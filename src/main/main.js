require('dotenv').config();
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();

const API_KEY = process.env.API_KEY; 
const BASE_URL = 'https://api.themoviedb.org/3';

const dbPath = path.join(__dirname, '../data.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erreur lors de la connexion à la base de données:', err.message);
    } else {
        console.log('Base de données connectée à :', dbPath);
    }
});

db.run(`CREATE TABLE IF NOT EXISTS favoris (
    id INTEGER PRIMARY KEY,
    movie_id INTEGER UNIQUE,
    title TEXT,
    poster TEXT,
    release_date TEXT
)`, (err) => {
    if (err) console.error('Erreur lors de la création de la table favoris:', err.message);
});

ipcMain.handle('add-favorite', (event, movie) => {
    console.log('Ajout de film aux favoris:', movie);
    db.run(`INSERT OR IGNORE INTO favoris (movie_id, title, poster, release_date) VALUES (?, ?, ?, ?)`, 
        [movie.id, movie.title, movie.poster, movie.release_date], 
        (err) => {
            if (err) {
                console.error('Erreur lors de l\'ajout en favoris:', err.message);
            } else {
                console.log('Film ajouté aux favoris avec succès !');
            }
        }
    );
});

app.commandLine.appendSwitch('disable-gpu');
app.setPath('userData', path.join(__dirname, '../cache'));

let mainWindow;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.maximize();
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
    mainWindow.webContents.openDevTools();
    mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
        callback({
            responseHeaders: {
                ...details.responseHeaders,
                'Content-Security-Policy': [
                    "default-src 'self'; img-src 'self' https://image.tmdb.org data:; style-src 'self' 'unsafe-inline';"
                ]
            }
        });
    });
    
});

ipcMain.handle('search-movies', async (event, query) => {
    try {
        const response = await axios.get(`${BASE_URL}/search/movie`, {
            params: { api_key: API_KEY, query, language: 'fr-FR' }
        });
        return response.data.results.map(movie => ({
            id: movie.id,
            title: movie.title,
            poster: movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : '',
            release_date: movie.release_date
        }));
    } catch (error) {
        console.error('Erreur lors de la récupération des films:', error);
        return [];
    }
});

ipcMain.handle('get-movie-details', async (event, movieId) => {
    try {
        const response = await axios.get(`${BASE_URL}/movie/${movieId}`, {
            params: { api_key: API_KEY, language: 'fr-FR' }
        });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des détails du film:', error);
        return null;
    }
});
ipcMain.handle('get-favorites', async () => {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM favoris", (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
});
ipcMain.handle('remove-favorite', async (event, movieId) => {
    console.log("Requête de suppression reçue pour movie_id:", movieId);
    return new Promise((resolve, reject) => {
        db.run("DELETE FROM favoris WHERE movie_id = ?", [movieId], function (err) {
            if (err) {
                console.error("Erreur SQL lors de la suppression:", err.message);
                reject(false);
            } else {
                console.log(`Nombre de lignes supprimées: ${this.changes}`);
                if (this.changes > 0) {
                    console.log("Film supprimé avec succès !");
                } else {
                    console.warn("Aucun film trouvé avec cet ID !");
                }
                resolve(true);
            }
        });
    });
});
