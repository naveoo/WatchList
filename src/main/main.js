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
    mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
        callback({
            responseHeaders: {
                ...details.responseHeaders,
                'Content-Security-Policy': [
                    "default-src 'self'; img-src 'self' https://image.tmdb.org; script-src 'self' 'nonce-protectedcode' 'unsafe-hashes'; style-src 'self' 'unsafe-inline';"
                ]
            }
        });
    });
});

ipcMain.handle('get-movie-details', async (event, movieId) => {
    try {
        const response = await axios.get(`${BASE_URL}/movie/${movieId}`, {
            params: { api_key: API_KEY, language: 'fr-FR' }
        });
        return response.data;
    } catch (error) {
        return null;
    }
});

ipcMain.handle('search-movies', async (event, { query, searchSubject }) => {
    try {
        let searchType = 'movie';
        let searchField = 'query';

        if (searchSubject === 'director' || searchSubject === 'actor') {
            searchType = 'person';
            searchField = 'query';
        }

        const response = await axios.get(`${BASE_URL}/search/${searchType}`, {
            params: { api_key: API_KEY, [searchField]: query, language: 'fr-FR' }
        });

        if (searchSubject === 'title') {
            return response.data.results.map(movie => ({
                id: movie.id,
                title: movie.title,
                poster: movie.poster_path 
                    ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                    : '../../assets/placeholder-not-found.png',
                release_date: movie.release_date
            }));
        } else {
            const personResults = response.data.results;
            const movies = [];
            for (const person of personResults) {
                const personMovies = await axios.get(`${BASE_URL}/person/${person.id}/movie_credits`, {
                    params: { api_key: API_KEY, language: 'fr-FR' }
                });
                personMovies.data.cast.forEach(movie => {
                    movies.push({
                        id: movie.id,
                        title: movie.title,
                        poster: movie.poster_path 
                            ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                            : '../../assets/placeholder-not-found.png',
                        release_date: movie.release_date
                    });
                });
            }
            return movies;
        }
    } catch (error) {
        console.error('Erreur lors de la recherche des films:', error);
        return [];
    }
});


ipcMain.handle('add-favorite', (event, movie) => {
    db.run(`INSERT OR IGNORE INTO favorites (movie_id, title, poster, release_date) VALUES (?, ?, ?, ?)`, 
        [movie.id, movie.title, movie.poster, movie.release_date], 
    );
});

ipcMain.handle('get-favorites', async () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM favorites', (err, rows) => {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
});

ipcMain.handle('remove-favorite', (event, movieId) => {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM favorites WHERE movie_id = ?', [movieId], (err) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
});
ipcMain.handle('add-to-watchlist', async (event, movieId) => {
    try {
        const response = await axios.get(`${BASE_URL}/movie/${movieId}`, {
            params: { api_key: API_KEY, language: 'fr-FR' }
        });
        const movie = response.data;

        db.run(`INSERT OR IGNORE INTO watchlist (movie_id, title, poster, release_date, duration) VALUES (?, ?, ?, ?, ?)`, 
            [movie.id, movie.title, `https://image.tmdb.org/t/p/w200${movie.poster_path}`, movie.release_date, movie.runtime], 
            (err) => {
                if (err) {
                    console.error('Erreur lors de l\'ajout à la watchlist:', err.message);
                } else {
                    console.log('Film ajouté à la watchlist avec succès !');
                }
            }
        );
    } catch (error) {
        console.error('Erreur lors de la récupération des détails du film:', error);
    }
});

ipcMain.handle('get-watchlist', async () => {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM watchlist", (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
});


ipcMain.handle('remove-from-watchlist', async (event, movieId) => {
    return new Promise((resolve, reject) => {
        db.run("DELETE FROM watchlist WHERE movie_id = ?", [movieId], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
});

ipcMain.handle('get-movies-by-duration', (event, availableTime) => {
    return new Promise((resolve, reject) => {
        db.all(
            "SELECT * FROM watchlist WHERE duration <= ? ORDER BY duration DESC",
            [availableTime],
            (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            }
        );
    });
});