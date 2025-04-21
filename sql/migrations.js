// Migration script to set up necessary database schema for click tracking and duplicate detection
const db = require('../util/database');

async function runMigrations() {
    const connection = await db.getConnection();
    
    try {
        console.log('Starting database migrations...');
        await connection.beginTransaction();
        
        // 1. Add click_count column to canciones table if it doesn't exist
        console.log('Adding click_count column to canciones table...');
        await connection.execute(`
            ALTER TABLE canciones 
            ADD COLUMN IF NOT EXISTS click_count INT DEFAULT 0
        `);
        
        // 2. Create song_clicks table if it doesn't exist
        console.log('Creating song_clicks table...');
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS song_clicks (
                id INT AUTO_INCREMENT PRIMARY KEY,
                song_id INT NOT NULL,
                clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (song_id) REFERENCES canciones(id) ON DELETE CASCADE
            )
        `);
        
        // 3. Create potential_duplicates table if it doesn't exist
        console.log('Creating potential_duplicates table...');
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS potential_duplicates (
                id INT AUTO_INCREMENT PRIMARY KEY,
                original_song_id INT NOT NULL,
                duplicate_song_id INT NOT NULL,
                similarity_score DECIMAL(5,2) DEFAULT 0,
                reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                resolved BOOLEAN DEFAULT FALSE,
                resolution_notes TEXT,
                FOREIGN KEY (original_song_id) REFERENCES canciones(id),
                FOREIGN KEY (duplicate_song_id) REFERENCES canciones(id)
            )
        `);
        
        // 4. Create admin_alerts table if it doesn't exist
        console.log('Creating admin_alerts table...');
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS admin_alerts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                message VARCHAR(255) NOT NULL,
                alert_type VARCHAR(50) NOT NULL,
                reference_id INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                is_read BOOLEAN DEFAULT FALSE
            )
        `);
        
        // 5. Create trigger for automatic click tracking if it doesn't exist
        console.log('Checking for and creating click tracking trigger...');
        const [triggerExists] = await connection.execute(`
            SELECT COUNT(*) as count FROM information_schema.triggers 
            WHERE TRIGGER_SCHEMA = 'spopify' AND TRIGGER_NAME = 'update_click_count'
        `);
        
        if (triggerExists[0].count === 0) {
            console.log('Creating update_click_count trigger...');
            await connection.execute(`
                CREATE TRIGGER update_click_count
                AFTER INSERT ON song_clicks
                FOR EACH ROW
                BEGIN
                    UPDATE canciones SET click_count = click_count + 1 WHERE id = NEW.song_id;
                END
            `);
        }
        
        // 6. Create trigger for duplicate detection if it doesn't exist
        console.log('Checking for and creating duplicate detection trigger...');
        const [duplicateTriggerExists] = await connection.execute(`
            SELECT COUNT(*) as count FROM information_schema.triggers 
            WHERE TRIGGER_SCHEMA = 'spopify' AND TRIGGER_NAME = 'detect_duplicates'
        `);
        
        if (duplicateTriggerExists[0].count === 0) {
            console.log('Creating detect_duplicates trigger...');
            await connection.execute(`
                CREATE TRIGGER detect_duplicates
                AFTER INSERT ON canciones
                FOR EACH ROW
                BEGIN
                    -- Insert potential duplicates based on similarity
                    INSERT INTO potential_duplicates (original_song_id, duplicate_song_id, similarity_score)
                    SELECT id, NEW.id,
                    -- Simple similarity calculation based on name and artist
                    (CASE
                        WHEN LOWER(titulo) = LOWER(NEW.titulo) THEN 70
                        WHEN SOUNDEX(titulo) = SOUNDEX(NEW.titulo) THEN 50
                        ELSE 30
                    END +
                    CASE
                        WHEN LOWER(artista) = LOWER(NEW.artista) THEN 30
                        ELSE 0
                    END) AS similarity
                    FROM canciones
                    WHERE id != NEW.id
                    AND (
                        LOWER(titulo) = LOWER(NEW.titulo)
                        OR SOUNDEX(titulo) = SOUNDEX(NEW.titulo)
                    )
                    HAVING similarity >= 70;

                    -- Create alert for high similarity matches
                    IF EXISTS (
                        SELECT 1 FROM potential_duplicates
                        WHERE duplicate_song_id = NEW.id
                        AND similarity_score >= 90
                    ) THEN
                        -- Insert an alert for administrators
                        INSERT INTO admin_alerts (message, alert_type, reference_id)
                        VALUES (
                            CONCAT('Posible canción duplicada detectada: "', NEW.titulo, '"'),
                            'DUPLICATE_CONTENT',
                            NEW.id
                        );
                    END IF;
                END
            `);
        }
        
        await connection.commit();
        console.log('Database migrations completed successfully!');
        
    } catch (error) {
        await connection.rollback();
        console.error('Error during database migrations:', error);
        throw error;
    } finally {
        connection.release();
    }
}

// Run migrations when this file is executed directly
if (require.main === module) {
    runMigrations()
        .then(() => {
            console.log('Done! Exiting...');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Migration failed:', error);
            process.exit(1);
        });
} else {
    // For importing in other files
    module.exports = { runMigrations };
}
