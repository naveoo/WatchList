const { ipcRenderer } = require('electron');

async function loadFavorites() {
    const favoritesContainer = document.getElementById('favorites');
    favoritesContainer.innerHTML = '';
    const favorites = await ipcRenderer.invoke('get-favorites');
    favorites.forEach((movie) => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie');
        movieElement.innerHTML = `
            <div class="movie-item">
                <img src="${movie.poster}" alt="${movie.title}" width="100">
                <p>${movie.title}</p>
                <button class="delete-btn" data-id="${movie.movie_id}">Supprimer</button>
            </div>
        `;
        
        const deleteButton = movieElement.querySelector('.delete-btn');
        deleteButton.addEventListener('click', async () => {
            const movieId = deleteButton.getAttribute('data-id');
            await removeFavorite(movieId);
        });

        favoritesContainer.appendChild(movieElement);
    });
}

async function removeFavorite(movieId) {
    await ipcRenderer.invoke('remove-favorite', movieId);
    loadFavorites();
}