const { ipcRenderer } = require('electron');

document.getElementById('findMovies').addEventListener('click', async () => {
    const availableTime = document.getElementById('availableTime').value;
    if (!availableTime || availableTime <= 0) {
        alert("Veuillez entrer une durée valide !");
        return;
    }

    const movies = await ipcRenderer.invoke('get-movies-by-duration', availableTime);
    const suggestionsContainer = document.getElementById('suggestionsContainer');
    suggestionsContainer.innerHTML = '';

    if (movies.length === 0) {
        suggestionsContainer.innerHTML = '<p>Aucun film disponible pour cette durée.</p>';
        return;
    }

    movies.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie');
        movieElement.innerHTML = `
            <div class="movie-item">
                <img src="${movie.poster}" alt="${movie.title}" width="100">
                <p><strong>${movie.title}</strong> <i>(${movie.release_date})</i></p>
                <p>Durée : ${movie.duration} minutes</p>
            </div>
        `;
        suggestionsContainer.appendChild(movieElement);
    });
});