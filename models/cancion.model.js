const db = require('../util/database');

module.exports = class Cancion {
    constructor(titulo, artista, album, año) {
        this.titulo = titulo;
        this.artista = artista;
        this.album = album;
        this.año = año;
    }

    async save() {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();
            
            // Insert the new song
            const [result] = await connection.execute(
                'INSERT INTO canciones (titulo, artista, album, año) VALUES (?, ?, ?, ?)',
                [this.titulo, this.artista, this.album, this.año]
            );
            this.id = result.insertId;
            
            // Check for potential duplicates
            await this.detectDuplicates(connection);
            
            await connection.commit();
            return this;
        } catch (error) {
            await connection.rollback();
            console.log(error);
            throw new Error('Failed to save song');
        } finally {
            connection.release();
        }
    }
    
    // Method to detect duplicates after a song is inserted
    async detectDuplicates(connection) {
        try {
            // Find potential duplicates based on title and artist similarity
            const [potentialDuplicates] = await connection.execute(`
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
                WHERE id != ?
                AND (
                    LOWER(titulo) = LOWER(?)
                    OR SOUNDEX(titulo) = SOUNDEX(?)
                )
                HAVING similarity_score > 50
            `, [this.titulo, this.titulo, this.artista, this.id, this.titulo, this.titulo]);
            
            // Delete this song if it's a duplicate with similarity score above 50%
            if (potentialDuplicates.length > 0) {
                console.log(`Deleting song "${this.titulo}" by "${this.artista}" due to similarity above 50% with existing songs`);
                await connection.execute('DELETE FROM canciones WHERE id = ?', [this.id]);
                throw new Error(`Song "${this.titulo}" by "${this.artista}" was not saved because similar songs already exist in the database (similarity > 50%).`);
            }
            
            // No need to insert into potential_duplicates since we're deleting duplicates
            for (const duplicate of potentialDuplicates) {
                await connection.execute(`
                    INSERT INTO potential_duplicates 
                    (original_song_id, duplicate_song_id, similarity_score)
                    VALUES (?, ?, ?)
                `, [duplicate.id, this.id, duplicate.similarity_score]);
                
                // Create an admin alert for high similarity matches
                if (duplicate.similarity_score >= 90) {
                    await connection.execute(`
                        INSERT INTO admin_alerts 
                        (message, alert_type, reference_id)
                        VALUES (?, 'DUPLICATE_CONTENT', ?)
                    `, [`Posible canción duplicada detectada: "${this.titulo}"`, this.id]);
                }
            }
            
            return potentialDuplicates.length;
        } catch (error) {
            console.error('Error detecting duplicates:', error);
            return 0;
        }
    }

    static async fetchAll() {
        try {
            const [rows] = await db.execute('SELECT * FROM canciones');
            return rows;
        } catch (error) {
            console.log(error);
            throw new Error('Failed to fetch songs');
        }
    }

    static async findById(id) {
        try {
            const [rows] = await db.execute('SELECT * FROM canciones WHERE id = ?', [id]);
            return rows[0];
        } catch (error) {
            console.log(error);
            throw new Error(`Failed to find song with id ${id}`);
        }
    }

    static async update(id, cancion) {
        try {
            const [result] = await db.execute(
                'UPDATE canciones SET titulo = ?, artista = ?, album = ?, año = ? WHERE id = ?',
                [cancion.titulo, cancion.artista, cancion.album, cancion.año, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.log(error);
            throw new Error(`Failed to update song with id ${id}`);
        }
    }

    static async deleteById(id) {
        try {
            const [result] = await db.execute('DELETE FROM canciones WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.log(error);
            throw new Error(`Failed to delete song with id ${id}`);
        }
    }
    
    // Method to register a click on a song
    static async registerClick(songId) {
        try {
            // First, ensure the song exists
            const song = await this.findById(songId);
            if (!song) {
                throw new Error(`Song with id ${songId} not found`);
            }
            
            // Insert a new record in the song_clicks table
            await db.execute(
                'INSERT INTO song_clicks (song_id) VALUES (?)',
                [songId]
            );
            
            // Update the click_count directly (as a fallback if the trigger doesn't work)
            await db.execute(
                'UPDATE canciones SET click_count = click_count + 1 WHERE id = ?',
                [songId]
            );
            
            return true;
        } catch (error) {
            console.log('Error registering click:', error);
            throw new Error(`Failed to register click for song id ${songId}: ${error.message}`);
        }
    }
    
    // Method to check for potential duplicates
    static async checkForDuplicates(songId) {
        try {
            const [rows] = await db.execute(`
                SELECT pd.*, 
                       orig.titulo AS original_titulo, 
                       orig.artista AS original_artista,
                       dup.titulo AS duplicate_titulo,
                       dup.artista AS duplicate_artista
                FROM potential_duplicates pd
                JOIN canciones orig ON pd.original_song_id = orig.id
                JOIN canciones dup ON pd.duplicate_song_id = dup.id
                WHERE pd.duplicate_song_id = ? OR pd.original_song_id = ?
                ORDER BY pd.similarity_score DESC
            `, [songId, songId]);
            
            return rows;
        } catch (error) {
            console.log('Error checking for duplicates:', error);
            return [];
        }
    }
}