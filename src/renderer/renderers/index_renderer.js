    const { ipcRenderer } = require('electron');

    const searchInput = document.getElementById('searchInput');
    const researchSubject = document.getElementById('researchSubject');
    const searchResultsContainer = document.getElementById('movieList');

    searchInput.addEventListener('input', triggerSearch);
    researchSubject.addEventListener('change', triggerSearch);

    async function triggerSearch() {
        const query = searchInput.value.trim();
        const subject = researchSubject.value;
        if (query.length < 3) return;

        const movies = await ipcRenderer.invoke('search-movies', {
            query,
            searchSubject: subject
        });

        displayMovies(movies);
    }

    const path = require('path');

function displayMovies(movies) {
    searchResultsContainer.innerHTML = '';

    movies.forEach(movie => {
        let posterSrc;

        if (movie.poster && movie.poster.startsWith('http')) {
            posterSrc = movie.poster;
        } else {
            posterSrc = path.join(__dirname, '../renderer/assets/placeholder-not-found.png');
            posterSrc = posterSrc.replace(/\\/g, '/');
            posterSrc = `file://${posterSrc}`;
        }

        const movieElement = document.createElement('div');
        movieElement.classList.add('movie');
        movieElement.dataset.id = movie.id;
        movieElement.innerHTML = `
            <div class="movie-item">
                <img src="${posterSrc}" alt="${movie.title}">
                <p>${movie.title}</p>
            </div>
        `;

        movieElement.addEventListener('click', () => {
            localStorage.setItem('selectedMovieId', movie.id);
            window.location.href = 'details.html';
        });

        searchResultsContainer.appendChild(movieElement);
    });
}