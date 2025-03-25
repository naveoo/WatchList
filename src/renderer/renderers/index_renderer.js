const { ipcRenderer } = require('electron');

document.getElementById('searchInput').addEventListener('input', async () => {
    triggerSearch();
});

document.getElementById('researchSubject').addEventListener('change', async () => {
    triggerSearch();
});

async function triggerSearch() {
    const query = document.getElementById('searchInput').value.trim();
    const searchSubject = document.getElementById('researchSubject').value;
    if (query.length < 3) return;

    const movies = await ipcRenderer.invoke('search-movies', { query, searchSubject });
    displayMovies(movies);
}

function displayMovies(movies) {
    const movieList = document.getElementById('movieList');
    movieList.innerHTML = '';
    
    movies.forEach(movie => {
        const movieItem = document.createElement('div');
        movieItem.classList.add('movie-item');
        movieItem.innerHTML = `
            <img src="${movie.poster}" alt="${movie.title}" class="preview_poster" />
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