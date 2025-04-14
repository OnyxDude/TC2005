const db = require('../util/database');

module.exports = class Playlist {
    constructor(nombre, descripcion, usuario_id, plataforma_id, canciones = []) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.usuario_id = usuario_id || 1;
        this.plataforma_id = plataforma_id;
        this.canciones = canciones;
    }

    async save() {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();
            
            console.log('Inserting playlist with data:', {
                nombre: this.nombre,
                descripcion: this.descripcion,
                usuario_id: this.usuario_id,
                plataforma_id: this.plataforma_id
            });
            
            const [result] = await connection.execute(
                'INSERT INTO playlists (nombre, descripcion, usuario_id, plataforma_id) VALUES (?, ?, ?, ?)',
                [this.nombre, this.descripcion, this.usuario_id, this.plataforma_id]
            );
            
            const playlistId = result.insertId;
            console.log('Playlist inserted with ID:', playlistId);
            
            if (this.canciones && this.canciones.length > 0) {
                console.log('Inserting song relationships:', this.canciones);
                for (let i = 0; i < this.canciones.length; i++) {
                    await connection.execute(
                        'INSERT INTO playlist_canciones (playlist_id, cancion_id, orden) VALUES (?, ?, ?)',
                        [playlistId, this.canciones[i], i + 1]
                    );
                }
            }
            
            await connection.commit();
            this.id = playlistId;
            console.log('Successfully saved playlist with ID:', this.id);
            return this;
        } catch (error) {
            await connection.rollback();
            console.log('Error in save method:', error);
            console.log('Stack trace:', error.stack);
            throw new Error('Failed to save playlist: ' + error.message);
        } finally {
            connection.release();
        }
    }

    static async fetchAll() {
        try {
            const [rows] = await db.execute(`
                SELECT p.*, pl.nombre AS plataforma_nombre 
                FROM playlists p
                LEFT JOIN plataformas pl ON p.plataforma_id = pl.id
            `);
            return rows;
        } catch (error) {
            console.log(error);
            throw new Error('Failed to fetch playlists');
        }
    }

    static async findById(id) {
        try {
            const [rows] = await db.execute(
                'SELECT * FROM playlists WHERE id = ?',
                [id]
            );
            return rows[0];
        } catch (error) {
            console.log(error);
            throw new Error(`Failed to find playlist with id ${id}`);
        }
    }

    static async getDetailedPlaylist(id) {
        try {
            const [playlistRows] = await db.execute(
                `SELECT p.*, pl.nombre AS plataforma_nombre, pl.url AS plataforma_url 
                FROM playlists p
                LEFT JOIN plataformas pl ON p.plataforma_id = pl.id
                WHERE p.id = ?`,
                [id]
            );
            
            if (playlistRows.length === 0) {
                return null;
            }
            
            const playlist = playlistRows[0];
            
            const [songRows] = await db.execute(
                `SELECT c.*, pc.orden
                FROM canciones c
                JOIN playlist_canciones pc ON c.id = pc.cancion_id
                WHERE pc.playlist_id = ?
                ORDER BY pc.orden`,
                [id]
            );
            
            const restructuredPlaylist = {
                ...playlist,
                plataforma: {
                    nombre: playlist.plataforma_nombre,
                    url: playlist.plataforma_url
                },
                canciones: songRows
            };

            delete restructuredPlaylist.plataforma_nombre;
            delete restructuredPlaylist.plataforma_url;
            
            return restructuredPlaylist;
        } catch (error) {
            console.log(error);
            throw new Error(`Failed to get detailed playlist with id ${id}`);
        }
    }
    
    static async update(id, playlist) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();
            
            await connection.execute(
                'UPDATE playlists SET nombre = ?, descripcion = ?, plataforma_id = ? WHERE id = ?',
                [playlist.nombre, playlist.descripcion, playlist.plataforma_id, id]
            );
            
            if (playlist.canciones && Array.isArray(playlist.canciones)) {
                await connection.execute('DELETE FROM playlist_canciones WHERE playlist_id = ?', [id]);
                
                for (let i = 0; i < playlist.canciones.length; i++) {
                    await connection.execute(
                        'INSERT INTO playlist_canciones (playlist_id, cancion_id, orden) VALUES (?, ?, ?)',
                        [id, playlist.canciones[i], i + 1]
                    );
                }
            }
            
            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
            console.log(error);
            throw new Error(`Failed to update playlist with id ${id}`);
        } finally {
            connection.release();
        }
    }

    static async search(searchTerm) {
        try {
           
            if (!searchTerm || searchTerm.trim() === '') {
                return this.fetchAll();
            }
            
            const [rows] = await db.execute(`
                SELECT p.*, pl.nombre AS plataforma_nombre,
                (SELECT COUNT(*) FROM playlist_canciones pc WHERE pc.playlist_id = p.id) AS total_canciones
                FROM playlists p
                LEFT JOIN plataformas pl ON p.plataforma_id = pl.id
                WHERE p.nombre LIKE ? OR p.descripcion LIKE ?
            `, [`%${searchTerm}%`, `%${searchTerm}%`]);
            
            return rows;
        } catch (error) {
            console.log('Error in Playlist.search:', error);
            throw error;
        }
    }
}