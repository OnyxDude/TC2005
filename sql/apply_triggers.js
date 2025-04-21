// Script to apply database triggers
const db = require('../util/database');
const fs = require('fs');
const path = require('path');

async function applyTriggers() {
    const connection = await db.getConnection();
    try {
        console.log('Starting to apply triggers...');
        
        // Read the duplicate_detection.sql file
        const triggerFilePath = path.join(__dirname, 'duplicate_detection.sql');
        let triggerSQL = fs.readFileSync(triggerFilePath, 'utf8');
        
        // Remove the MySQL DELIMITER statements as they're not needed in Node.js execution
        triggerSQL = triggerSQL
            .replace(/DELIMITER \/\//g, '')
            .replace(/\/\/\s*DELIMITER ;/g, '')
            .replace(/END\/\//g, 'END');
        
        // Split into separate SQL statements
        const statements = triggerSQL.split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0);
        
        // Execute each statement
        for (const statement of statements) {
            console.log(`Executing SQL statement: ${statement.substring(0, 100)}...`);
            await connection.query(statement);
        }
        
        console.log('Successfully applied triggers!');
        console.log('Checking if detect_duplicates trigger exists...');
        
        const [triggers] = await connection.query(`
            SELECT TRIGGER_NAME 
            FROM information_schema.TRIGGERS 
            WHERE TRIGGER_SCHEMA = 'spopify' 
            AND TRIGGER_NAME = 'detect_duplicates'
        `);
        
        if (triggers.length > 0) {
            console.log('✅ detect_duplicates trigger was successfully created!');
        } else {
            console.log('❌ detect_duplicates trigger was not created. Please check for errors.');
        }
        
    } catch (error) {
        console.error('Error applying triggers:', error);
    } finally {
        connection.release();
        process.exit();
    }
}

applyTriggers();
