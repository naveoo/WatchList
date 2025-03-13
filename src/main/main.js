require('dotenv').config();
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const axios = require('axios');

const API_KEY = process.env.API_KEY;  // Utilisation de la variable d'environnement
const BASE_URL = 'https://api.themoviedb.org/3';

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