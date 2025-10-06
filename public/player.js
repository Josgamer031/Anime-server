document.addEventListener('DOMContentLoaded', async () => {
    const episodeTitle = document.getElementById('episode-title');
    const videoPlayerContainer = document.getElementById('video-player-container');
    const episodeNav = document.getElementById('episode-nav');

    const urlParams = new URLSearchParams(window.location.search);
    const animeId = urlParams.get('animeId');
    const episodeId = urlParams.get('episodeId');

    if (!animeId || !episodeId) {
        episodeTitle.textContent = `Error: No se especificó el anime o el episodio. Anime ID: ${animeId}, Episode ID: ${episodeId}`;
        return;
    }

    try {
        // Fetch anime details (for episode list) and episode sources concurrently
        const [animeRes, episodeRes] = await Promise.all([
            fetch(`http://YOUR_PUBLIC_API_URL_HERE/api/anime/${animeId}`),
            fetch(`http://YOUR_PUBLIC_API_URL_HERE/api/episodes/${episodeId}`)
        ]);

        if (!animeRes.ok) {
            throw new Error(`Error al cargar detalles del anime (Status: ${animeRes.status}). Anime ID: ${animeId}`);
        }
        if (!episodeRes.ok) {
            throw new Error(`Error al cargar recursos del episodio (Status: ${episodeRes.status}). Episode ID: ${episodeId}`);
        }

        const animeData = await animeRes.json();
        const episodeData = await episodeRes.json();

        // Sort episodes numerically to fix navigation
        animeData.Episodes.sort((a, b) => a.Number - b.Number);

        // --- 1. Render Video Player ---
        const currentEpisode = animeData.Episodes.find(ep => ep.Id === episodeId);
        episodeTitle.textContent = `${animeData.Title} - Episodio ${currentEpisode.Number}`;

        videoPlayerContainer.innerHTML = ''; // Clear previous content

        if (episodeData.SUB && episodeData.SUB.length > 0) {
            const sourceButtons = document.createElement('div');
            sourceButtons.classList.add('source-buttons');

            episodeData.SUB.forEach(source => {
                if (source.code) {
                    const button = document.createElement('button');
                    button.textContent = source.title;
                    button.dataset.videoSrc = source.code;
                    sourceButtons.appendChild(button);
                }
            });

            videoPlayerContainer.appendChild(sourceButtons);

            const iframeContainer = document.createElement('div');
            videoPlayerContainer.appendChild(iframeContainer);

            const loadVideo = (src) => {
                iframeContainer.innerHTML = `<iframe src="${src}" frameborder="0" allowfullscreen></iframe>`;
            };

            sourceButtons.addEventListener('click', (event) => {
                if (event.target.tagName === 'BUTTON') {
                    loadVideo(event.target.dataset.videoSrc);
                }
            });

            // Auto-load default source
            const defaultSource = episodeData.SUB.find(s => s.ads === 0 && s.code) || episodeData.SUB.find(s => s.code);
            if (defaultSource) {
                loadVideo(defaultSource.code);
            }

        } else {
            videoPlayerContainer.innerHTML = '<p>No se encontró un video para este episodio.</p>';
        }

        // --- 2. Render Navigation ---
        const currentIndex = animeData.Episodes.findIndex(ep => ep.Id === episodeId);

        // Previous Button
        if (currentIndex > 0) {
            const prevEpisode = animeData.Episodes[currentIndex - 1];
            const prevLink = document.createElement('a');
            prevLink.href = `player.html?animeId=${animeId}&episodeId=${prevEpisode.Id}`;
            prevLink.textContent = 'Anterior';
            prevLink.classList.add('nav-button');
            episodeNav.appendChild(prevLink);
        }

        // Episodes Button
        const episodesLink = document.createElement('a');
        episodesLink.href = `anime.html?id=${animeId}`;
        episodesLink.textContent = 'Lista de Episodios';
        episodesLink.classList.add('nav-button');
        episodeNav.appendChild(episodesLink);

        // Next Button
        if (currentIndex < animeData.Episodes.length - 1) {
            const nextEpisode = animeData.Episodes[currentIndex + 1];
            const nextLink = document.createElement('a');
            nextLink.href = `player.html?animeId=${animeId}&episodeId=${nextEpisode.Id}`;
            nextLink.textContent = 'Siguiente';
            nextLink.classList.add('nav-button');
            episodeNav.appendChild(nextLink);
        }

    } catch (error) {
        episodeTitle.textContent = error.message;
    }
});