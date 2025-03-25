const { ipcRenderer } = require('electron');

async function loadMovieDetails() {
    const movieId = localStorage.getItem('selectedMovieId');
    if (!movieId) {
        return;
    }

    const movie = await ipcRenderer.invoke('get-movie-details', movieId);
    if (!movie) {
        return;
    }

    const titleElement = document.getElementById('title');
    const posterElement = document.getElementById('poster');
    const releaseDateElement = document.getElementById('release_date');
    const overviewElement = document.getElementById('overview');

    if (titleElement) titleElement.textContent = movie.title;
    if (posterElement) posterElement.src = `https://image.tmdb.org/t/p/w300${movie.poster_path}`;
    if (releaseDateElement) releaseDateElement.textContent = movie.release_date;
    if (overviewElement) overviewElement.textContent = movie.overview;
}

document.getElementById('addFavoriteButton')?.addEventListener('click', async () => {
    const movieId = localStorage.getItem('selectedMovieId');
    if (!movieId) {
        return;
    }

    const movie = {
        id: movieId,
        title: document.getElementById('title')?.textContent,
        poster: document.getElementById('poster')?.src,
        release_date: document.getElementById('release_date')?.textContent
    };

    if (movie.title && movie.poster && movie.release_date) {
        await ipcRenderer.invoke('add-favorite', movie);
    }
});