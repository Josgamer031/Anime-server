document.addEventListener('DOMContentLoaded', () => {
  // Service Worker Registration (Temporarily commented out for debugging)
  /*
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('Service Worker registered: ', registration);
        })
        .catch(error => {
          console.log('Service Worker registration failed: ', error);
        });
    });
  }
  */

  // Original script.js content starts here
  const animeList = document.getElementById('anime-list');
  const latestEpisodesList = document.getElementById('latest-episodes-list');

  // Function to fetch and display latest anime
  fetch('http://YOUR_PUBLIC_API_URL_HERE/api/latest')
    .then(response => response.json())
    .then(data => {
      data.forEach(anime => {
        const animeItem = document.createElement('div');
        animeItem.classList.add('anime-item');

        const link = document.createElement('a');
        link.href = `anime.html?id=${anime.Id}`;

        const title = document.createElement('h3');
        title.textContent = anime.Title; // Corrected line
        title.classList.add('title');

        const image = document.createElement('img');
        image.src = anime.Image;
        image.alt = anime.Title;

        link.appendChild(image);
        link.appendChild(title);
        animeItem.appendChild(link);
        animeList.appendChild(animeItem);
      });
    })
    .catch(error => {
      console.error('Error fetching latest anime:', error);
      animeList.innerHTML = '<p>Error al cargar los últimos animes.</p>';
    });

  // Function to fetch and display latest episodes
  fetch('http://YOUR_PUBLIC_API_URL_HERE/api/latest-episodes')
    .then(response => response.json())
    .then(data => {
      data.forEach(episode => {
        const episodeItem = document.createElement('div');
        episodeItem.classList.add('anime-item'); // Reusing anime-item class for styling

        const link = document.createElement('a');
        const animeSlug = episode.Id.substring(0, episode.Id.lastIndexOf('-'));
        link.href = `player.html?animeId=${animeSlug}&episodeId=${episode.Id}`;

        const title = document.createElement('h3');
        title.textContent = `${episode.Anime} - Ep ${episode.Title}`;
        title.classList.add('title');

        const image = document.createElement('img');
        image.src = episode.Image;
        image.alt = episode.AnimeTitle;

        link.appendChild(image);
        link.appendChild(title);
        episodeItem.appendChild(link);
        latestEpisodesList.appendChild(episodeItem);
      });
    })
    .catch(error => {
      console.error('Error fetching latest episodes:', error);
      latestEpisodesList.innerHTML = '<p>Error al cargar los últimos episodios.</p>';
    });
});