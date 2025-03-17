const db = require('../util/database');

module.exports = class Plataforma {
    constructor(nombre, url) {
        this.nombre = nombre;
        this.url = url;
    }

    async save() {
        try {
            const [result] = await db.execute(
                'INSERT INTO plataformas (nombre, url) VALUES (?, ?)',
                [this.nombre, this.url]
            );
            this.id = result.insertId;
            return this;
        } catch (error) {
            console.log(error);
            throw new Error('Failed to save platform');
        }
    }

    static async fetchAll() {
        try {
            const [rows] = await db.execute('SELECT * FROM plataformas');
            return rows;
        } catch (error) {
            console.log(error);
            throw new Error('Failed to fetch platforms');
        }
    }

    static async findById(id) {
        try {
            const [rows] = await db.execute('SELECT * FROM plataformas WHERE id = ?', [id]);
            return rows[0];
        } catch (error) {
            console.log(error);
            throw new Error(`Failed to find platform with id ${id}`);
        }
    }

    static async findByName(nombre) {
        try {
            const [rows] = await db.execute('SELECT * FROM plataformas WHERE nombre = ?', [nombre]);
            return rows[0];
        } catch (error) {
            console.log(error);
            throw new Error(`Failed to find platform with name ${nombre}`);
        }
    }

    static async update(id, plataforma) {
        try {
            const [result] = await db.execute(
                'UPDATE plataformas SET nombre = ?, url = ? WHERE id = ?',
                [plataforma.nombre, plataforma.url, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.log(error);
            throw new Error(`Failed to update platform with id ${id}`);
        }
    }
}