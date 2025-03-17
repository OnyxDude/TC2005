const db = require('../util/database');

module.exports = class Cancion {
    constructor(titulo, artista, album, año) {
        this.titulo = titulo;
        this.artista = artista;
        this.album = album;
        this.año = año;
    }

    async save() {
        try {
            const [result] = await db.execute(
                'INSERT INTO canciones (titulo, artista, album, año) VALUES (?, ?, ?, ?)',
                [this.titulo, this.artista, this.album, this.año]
            );
            this.id = result.insertId;
            return this;
        } catch (error) {
            console.log(error);
            throw new Error('Failed to save song');
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
}