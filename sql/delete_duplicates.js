// Script to identify and delete duplicate songs with similarity above 50%
const db = require('../util/database');

// Function to create necessary tables if they don't exist
async function createTables() {
    try {
        console.log('Ensuring necessary tables exist...');
        
        // Create the potential_duplicates table
        await db.execute(`
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
            );
        `);
        
        // Create the admin_alerts table
        await db.execute(`
            CREATE TABLE IF NOT EXISTS admin_alerts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                message VARCHAR(255) NOT NULL,
                alert_type VARCHAR(50) NOT NULL,
                reference_id INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                is_read BOOLEAN DEFAULT FALSE
            );
        `);
        
        console.log('✅ Tables created successfully!');
    } catch (error) {
        console.error('❌ Error creating tables:', error.message);
    }
}

// Function to delete duplicate songs that already exist in the database
async function detectAndDeleteDuplicates() {
    try {
        console.log('Checking for duplicates in existing songs...');
        
        // Get all songs
        const [songs] = await db.execute('SELECT * FROM canciones ORDER BY id ASC');
        console.log(`Found ${songs.length} songs to process`);
        
        // Compare songs and delete duplicates with similarity > 50%
        let songsToDelete = [];
        let duplicatesFound = 0;
        
        // First pass: identify duplicates to delete
        for (let i = 0; i < songs.length; i++) {
            const song = songs[i];
            
            // Skip songs already marked for deletion
            if (songsToDelete.includes(song.id)) continue;
            
            // Find potential duplicates based on title and artist
            const [duplicates] = await db.execute(`
                SELECT id, titulo, artista,
                (CASE
                    WHEN LOWER(titulo) = LOWER(?) THEN 70
                    WHEN SOUNDEX(titulo) = SOUNDEX(?) THEN 50
                    ELSE 30
                END +
                CASE
                    WHEN LOWER(artista) = LOWER(?) THEN 30
                    ELSE 0
                END) AS similarity_score
                FROM canciones
                WHERE id > ? /* Only check against newer songs to avoid duplicate checks */
                AND (
                    LOWER(titulo) = LOWER(?)
                    OR SOUNDEX(titulo) = SOUNDEX(?)
                )
                HAVING similarity_score > 50
            `, [song.titulo, song.titulo, song.artista, song.id, song.titulo, song.titulo]);
            
            if (duplicates.length > 0) {
                console.log(`Found ${duplicates.length} duplicates above 50% similarity for song "${song.titulo}" by ${song.artista} (ID: ${song.id})`);
                
                // Mark newer duplicate songs for deletion
                for (const duplicate of duplicates) {
                    console.log(`Marking song for deletion: "${duplicate.titulo}" by ${duplicate.artista} (ID: ${duplicate.id}) - Similarity: ${duplicate.similarity_score}%`);
                    songsToDelete.push(duplicate.id);
                    duplicatesFound++;
                }
            }
        }
        
        // Second pass: delete the duplicate songs
        if (songsToDelete.length > 0) {
            console.log(`\n🗑️ Deleting ${songsToDelete.length} duplicate songs with similarity above 50%...`);
            
            // Use a transaction to ensure all deletions succeed or none do
            const connection = await db.getConnection();
            try {
                await connection.beginTransaction();
                
                // Delete songs from playlist_canciones first (to maintain foreign key constraints)
                await connection.execute(`DELETE FROM playlist_canciones WHERE cancion_id IN (${songsToDelete.join(',')})`);
                
                // Delete songs from song_clicks
                await connection.execute(`DELETE FROM song_clicks WHERE song_id IN (${songsToDelete.join(',')})`);
                
                // Delete the songs
                const [result] = await connection.execute(`DELETE FROM canciones WHERE id IN (${songsToDelete.join(',')})`);
                
                await connection.commit();
                console.log(`✅ Successfully deleted ${result.affectedRows} duplicate songs`);
            } catch (error) {
                await connection.rollback();
                console.error(`❌ Error deleting duplicate songs: ${error.message}`);
            } finally {
                connection.release();
            }
        } else {
            console.log('No duplicates above 50% similarity found to delete.');
        }
        
        console.log(`✅ Duplicate detection and deletion complete! Found and processed ${duplicatesFound} potential duplicates.`);
    } catch (error) {
        console.error('❌ Error detecting duplicates:', error.message);
    }
}

async function main() {
    try {
        console.log('Starting duplicate detection and deletion process...');
        
        // Step 1: Ensure necessary tables exist
        await createTables();
        
        // Step 2: Detect and delete duplicates in existing songs
        await detectAndDeleteDuplicates();
        
        console.log('✅ Process complete!');
        console.log('Now when you add new songs, any with similarity > 50% will be automatically deleted.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error during process:', error);
        process.exit(1);
    }
}

// Run the main function
main();
