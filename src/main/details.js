const { ipcRenderer } = require('electron');

async function loadMovieDetails() {
    const movieId = localStorage.getItem('selectedMovieId');
    if (!movieId) return;

    const movie = await ipcRenderer.invoke('get-movie-details', movieId);
    if (!movie) return;

    document.getElementById('title').textContent = movie.title;
    document.getElementById('poster').src = `https://image.tmdb.org/t/p/w300${movie.poster_path}`;
    document.getElementById('release_date').textContent = movie.release_date;
    document.getElementById('overview').textContent = movie.overview;
}

function goBack() {
    window.location.href = '../renderer/index.html';
}

loadMovieDetails();
