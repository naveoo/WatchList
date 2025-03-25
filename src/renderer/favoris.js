const { ipcRenderer } = require('electron');

async function loadFavorites() {
    const favoritesContainer = document.getElementById('favorites');
    favoritesContainer.innerHTML = '';

    try {
        const favorites = await ipcRenderer.invoke('get-favorites');
        console.log("Favoris récupérés:", favorites);
        favorites.forEach((movie) => {
            const movieElement = document.createElement('div');
            movieElement.classList.add('movie');
            movieElement.innerHTML = `
                <img src="${movie.poster}" alt="${movie.title}" width="100">
                <p>${movie.title}</p>
                <button class="delete-btn" data-id="${movie.movie_id}">Supprimer</button>
            `;
            
            const deleteButton = movieElement.querySelector('.delete-btn');
            deleteButton.addEventListener('click', async () => {
                const movieId = deleteButton.getAttribute('data-id');
                await removeFavorite(movieId);
            });

            favoritesContainer.appendChild(movieElement);
        });
    } catch (error) {
        console.error("Erreur lors du chargement des favoris:", error);
    }
}
async function removeFavorite(movieId) {
    try {
        await ipcRenderer.invoke('remove-favorite', movieId);
        alert('Film supprimé des favoris');
        loadFavorites();
    } catch (error) {
        console.error('Erreur lors de la suppression du film:', error);
}
}

function goBack() {
        window.location.href = 'index.html';
}

loadFavorites();