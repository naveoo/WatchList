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

document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('add-favorite')) {
        const movie = {
            id: event.target.dataset.id,
            title: event.target.dataset.title,
            poster: event.target.dataset.poster
        };
        window.electron.send('add-favorite', movie);
        alert('Ajouté aux favoris !');
    }
});

if (document.getElementById('favoritesContainer')) {
    window.electron.invoke('get-favorites').then(favorites => {
        const container = document.getElementById('favoritesContainer');
        favorites.forEach(movie => {
            const movieElement = document.createElement('div');
            movieElement.classList.add('movie');
            movieElement.innerHTML = `
                <img src="${movie.poster}" alt="${movie.title}">
                <p>${movie.title}</p>
            `;
            container.appendChild(movieElement);
        });
    });
}
