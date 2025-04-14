const db = require('../util/database');

module.exports = class Archivo {
    constructor(nombre, mimetype, size, usuario_id, fileData = null, ruta = null) {
        this.nombre = nombre;
        this.mimetype = mimetype;
        this.size = size;
        this.usuario_id = usuario_id;
        this.fileData = fileData;
        this.ruta = ruta;
    }

    async save() {
        try {
            const [result] = await db.execute(
                'INSERT INTO archivos (nombre, ruta, mimetype, size, usuario_id, file_data) VALUES (?, ?, ?, ?, ?, ?)',
                [this.nombre, this.ruta, this.mimetype, this.size, this.usuario_id, this.fileData]
            );
            this.id = result.insertId;
            return this;
        } catch (error) {
            console.log(error);
            throw new Error('Failed to save file: ' + error.message);
        }
    }

    static async fetchAll() {
        try {
            const [rows] = await db.execute('SELECT * FROM archivos ORDER BY created_at DESC');
            return rows;
        } catch (error) {
            console.log(error);
            throw new Error('Failed to fetch files');
        }
    }

    static async findById(id) {
        try {
            const [rows] = await db.execute('SELECT * FROM archivos WHERE id = ?', [id]);
            return rows[0];
        } catch (error) {
            console.log(error);
            throw new Error(`Failed to find file with id ${id}`);
        }
    }

    static async findByUserId(usuario_id) {
        try {
            const [rows] = await db.execute('SELECT * FROM archivos WHERE usuario_id = ? ORDER BY created_at DESC', [usuario_id]);
            return rows;
        } catch (error) {
            console.log(error);
            throw new Error(`Failed to find files for user with id ${usuario_id}`);
        }
    }

    static async deleteById(id) {
        try {
            const [result] = await db.execute('DELETE FROM archivos WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.log(error);
            throw new Error(`Failed to delete file with id ${id}`);
        }
    }
}
