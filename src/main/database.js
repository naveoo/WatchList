const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../data.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erreur lors de la connexion à la base de données', err);
    } else {
        console.log('Connecté à la base de données SQLite.');
        db.run(`
            CREATE TABLE IF NOT EXISTS favorites (
                id INTEGER PRIMARY KEY,
                movie_id INTEGER UNIQUE,
                title TEXT,
                poster TEXT,
                release_date TEXT
            )
        `, (err) => {
            if (err) console.error("Erreur lors de la création de la table favorites:", err);
        });

        db.run(`
            CREATE TABLE IF NOT EXISTS watchlist (
                id INTEGER PRIMARY KEY,
                movie_id INTEGER UNIQUE,
                title TEXT,
                poster TEXT,
                release_date TEXT,
                duration INTEGER
            )
        `, (err) => {
            if (err) console.error("Erreur lors de la création de la table watchlist:", err);
        });
    }
});

module.exports = db;