const { ipcRenderer } = require('electron');

async function loadWatchlist() {
    const watchlistContainer = document.getElementById('watchlist');
    watchlistContainer.innerHTML = '';

    try {
        const watchlist = await ipcRenderer.invoke('get-watchlist');
        console.log("Watchlist récupérée:", watchlist);
        watchlist.forEach((movie) => {
            const movieElement = document.createElement('div');
            movieElement.classList.add('movie');
            movieElement.innerHTML = `
                <img src="${movie.poster}" alt="${movie.title}" width="100">
                <p><strong>${movie.title}</strong></p>
                <p>Durée : ${movie.duration ? movie.duration + ' min' : 'Inconnue'}</p>
                <p>Sortie : ${movie.release_date}</p>
                <button class="delete-watchlist-btn" data-id="${movie.movie_id}">Supprimer</button>
            `;

            const deleteButton = movieElement.querySelector('.delete-watchlist-btn');
            deleteButton.addEventListener('click', async () => {
                const movieId = deleteButton.getAttribute('data-id');
                await removeFromWatchlist(movieId);
            });

            watchlistContainer.appendChild(movieElement);
        });

    } catch (error) {
        console.error("Erreur lors du chargement de la watchlist:", error);
    }
}
async function removeFromWatchlist(movieId) {
    try {
        await ipcRenderer.invoke('remove-from-watchlist', movieId);
        loadWatchlist();
    } catch (error) {
        console.error('Erreur lors de la suppression du film:', error);
    }
}