const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = process.env.DB_PATH || './numerous.db';
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erreur lors de l’ouverture de la base de données:', err);
    } else {
        console.log('Base de données connectée.');
    }
});

// Initialisation des tables
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS games (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        secret_number TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS players (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        game_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        score INTEGER DEFAULT 0,
        FOREIGN KEY (game_id) REFERENCES games(id)
    )`);
});

module.exports = db;
