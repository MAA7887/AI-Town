import sqlite3 from 'sqlite3'; // Use ES module import
import fs from 'fs'; // Import the file system module
const { Database } = sqlite3.verbose();

// Path to the database file
const dbFilePath = './users.db';

// Delete the existing database file if it exists
if (fs.existsSync(dbFilePath)) {
    fs.unlinkSync(dbFilePath); // Synchronously delete the file
    console.log('Previous database file deleted.');
}

// Create a new database file
const db = new Database(dbFilePath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Create a "users" table
db.run(
    `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        password TEXT NOT NULL
    )`,
    (err) => {
        if (err) {
            console.error('Error creating users table:', err.message);
        } else {
            console.log('Users table ready.');
        }
    }
);

// Create a "chat_history" table
db.run(
    `CREATE TABLE IF NOT EXISTS chat_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        character_name TEXT NOT NULL,
        message TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    (err) => {
        if (err) {
            console.error('Error creating chat_history table:', err.message);
        } else {
            console.log('Chat history table ready.');
        }
    }
);

// Create a "characters" table
db.run(
    `CREATE TABLE IF NOT EXISTS characters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        type INTEGER NOT NULL
    )`,
    (err) => {
        if (err) {
            console.error('Error creating characters table:', err.message);
        } else {
            console.log('Characters table ready.');
        }
    }
);

// Create a "city" table
db.run(
    `CREATE TABLE IF NOT EXISTS city (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        element_name TEXT NOT NULL,
        row INTEGER NOT NULL,
        col INTEGER NOT NULL
    )`,
    (err) => {
        if (err) {
            console.error('Error creating city table:', err.message);
        } else {
            console.log('City table ready.');
        }
    }
);


export default db; // Use ES module export