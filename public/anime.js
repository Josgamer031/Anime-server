document.addEventListener('DOMContentLoaded', () => {
  const animeDetails = document.getElementById('anime-details');
  const episodeList = document.getElementById('episode-list');

  const urlParams = new URLSearchParams(window.location.search);
  const animeId = urlParams.get('id');

  if (animeId) {
    fetch(`http://YOUR_PUBLIC_API_URL_HERE/api/anime/${animeId}`)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          animeDetails.innerHTML = `<p>${data.error}</p>`;
          return;
        }

        // Render anime details
        animeDetails.innerHTML = `
            <h1>${data.Title}</h1>
            <img src="${data.Image}" alt="${data.Title}">
            <div>
                <p>${data.Description}</p>
            </div>
        `;

        // Render episode list as links
        data.Episodes.forEach(episode => {
          const episodeLink = document.createElement('a');
          episodeLink.classList.add('episode-item');
          episodeLink.textContent = `Episodio ${episode.Number}`;
          episodeLink.href = `player.html?animeId=${animeId}&episodeId=${episode.Id}`;
          episodeLink.target = '_blank'; // Open in new tab
          episodeList.appendChild(episodeLink);
        });
      })
      .catch(error => {
          animeDetails.innerHTML = `<p>Error al cargar detalles: ${error.message}</p>`;
      });
  }
});