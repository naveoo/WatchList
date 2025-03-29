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

const searchResultsContainer = document.getElementById('movieList');

function displayMovies(movies) {
    searchResultsContainer.innerHTML = '';

    movies.forEach(movie => {
        console.log(`Film: ${movie.title} | Poster: ${movie.poster}`);

        const movieElement = document.createElement('div');
        movieElement.classList.add('movie');
        movieElement.dataset.id = movie.id;
        movieElement.innerHTML = `
            <img src="${movie.poster || '../../assets/placeholder-not-found.png'}" 
                 alt="${movie.title}" width="100">
            <p>${movie.title}</p>
        `;

        movieElement.addEventListener('click', () => {
            console.log('Film sélectionné :', movie.id);
            localStorage.setItem('selectedMovieId', movie.id);
            window.location.href = 'details.html';
        });

        searchResultsContainer.appendChild(movieElement);
    });
}
