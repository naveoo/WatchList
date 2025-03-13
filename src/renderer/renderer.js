const { ipcRenderer } = require('electron');

document.getElementById('searchInput').addEventListener('input', async (event) => {
    const query = event.target.value.trim();
    if (query.length < 3) return;

    const movies = await ipcRenderer.invoke('search-movies', query);
    displayMovies(movies);
});

function displayMovies(movies) {
    const movieList = document.getElementById('movieList');
    movieList.innerHTML = '';
    
    movies.forEach(movie => {
        const movieItem = document.createElement('div');
        movieItem.classList.add('movie-item');
        movieItem.innerHTML = `
            <img src="${movie.poster}" alt="${movie.title}" />
            <p><strong>${movie.title}</strong></p>
            <p>${movie.release_date}</p>
        `;
        movieItem.addEventListener('click', () => {
            localStorage.setItem('selectedMovieId', movie.id);
            document.getElementById('detailsLink').click();
        });
        movieList.appendChild(movieItem);
    });
}
