const db = require('../util/database');
const bcrypt = require('bcryptjs');

module.exports = class User {
    constructor(username, password, name) {
        this.username = username;
        this.password = password;
        this.name = name;
    }
    
    async save() {
        try {
            const existingUser = await User.findByUsername(this.username);
            if (existingUser) {
                throw new Error('Username already exists');
            }
        
            const hashedPassword = await bcrypt.hash(this.password, 12);
            
            const [result] = await db.execute(
                'INSERT INTO usuarios (username, password, name) VALUES (?, ?, ?)',
                [this.username, hashedPassword, this.name]
            );
            this.id = result.insertId;
            return this;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    static async findByUsername(username) {
        try {
            const [rows] = await db.execute(
                'SELECT * FROM usuarios WHERE username = ?',
                [username]
            );
            return rows[0]; 
        } catch (error) {
            console.log(error);
            throw new Error(`Failed to find user with username ${username}`);
        }
    }

    static async findById(id) {
        try {
            const [rows] = await db.execute(
                'SELECT * FROM usuarios WHERE id = ?',
                [id]
            );
            return rows[0]; 
        } catch (error) {
            console.log(error);
            throw new Error(`Failed to find user with id ${id}`);
        }
    }

    static async validateCredentials(username, password) {
        try {
            const user = await this.findByUsername(username);
            if (!user) {
                return null;
            }
            
            const doMatch = await bcrypt.compare(password, user.password);
            if (doMatch) {
                return user;
            }
            return null;
        } catch (error) {
            console.log(error);
            throw new Error('Failed to validate credentials');
        }
    }
}