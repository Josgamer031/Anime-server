import express from 'express';
import { GetNewSeries, GetNewEpisodes } from './node_modules/@carlosnunezmx/animeflv/dist/scrappers/main_page.js';
import { GetAnimeInfo } from './node_modules/@carlosnunezmx/animeflv/dist/scrappers/anime.js';
import { GetResources } from './node_modules/@carlosnunezmx/animeflv/dist/scrappers/episode.js';
import { Search } from './node_modules/@carlosnunezmx/animeflv/dist/scrappers/search.js';

const app = express();
const port = 3001;

// Helper function for timeout
const withTimeout = (promise, ms) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), ms))
  ]);
};



// --- ORIGINAL ANIME API ---

app.get('/api/latest', async (req, res) => {
  try {
    const latest = await withTimeout(GetNewSeries(), 10000); // 10 seconds timeout
    res.json(latest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/latest-episodes', async (req, res) => {
  try {
    const latest = await withTimeout(GetNewEpisodes(), 10000); // 10 seconds timeout
    res.json(latest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/catalog', async (req, res) => {
  try {
    const page = req.query.page || 1;
    const catalog = await withTimeout(Search({ page: parseInt(page) }), 10000); // 10 seconds timeout
    res.json(catalog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/search', async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ error: 'Query parameter "q" is required' });
    }
    const results = await withTimeout(Search(query), 10000); // 10 seconds timeout
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/anime/:id', async (req, res) => {
  try {
    const animeId = req.params.id;
    const animeInfo = await withTimeout(GetAnimeInfo(animeId), 10000); // 10 seconds timeout

    if (!animeInfo) {
      return res.status(404).send('<h1>Anime no encontrado</h1>');
    }

    const safeDescription = animeInfo.Description ? animeInfo.Description.replace(/\r\n/g, '<br>') : '';

    const html = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${animeInfo.Title}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif; background-color: #121212; color: #e0e0e0; margin: 0; padding: 20px; }
          h1, h2 { text-align: center; color: #fff; }
          nav { text-align: center; margin-bottom: 20px; }
          nav a { color: #bb86fc; text-decoration: none; display: inline-block; padding: 10px; }
          .anime-detail { display: flex; flex-direction: column; align-items: center; max-width: 800px; margin: 0 auto; }
          .anime-detail img { max-width: 300px; height: auto; border-radius: 8px; margin-bottom: 20px; }
          .anime-detail p { text-align: justify; line-height: 1.6; padding: 0 20px; }
          .episode-list { list-style: none; padding: 0; width: 100%; max-width: 600px; margin-top: 20px; }
          .episode-list li { background-color: #1e1e1e; border-radius: 8px; margin-bottom: 10px; padding: 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
          .episode-list li a { color: #bb86fc; text-decoration: none; display: block; }
          .episode-list li a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <header>
          <h1>${animeInfo.Title}</h1>
          <nav><a href="/">Inicio</a> | <a href="/catalog">Catálogo</a></nav>
        </header>
        <main class="anime-detail">
          <img src="${animeInfo.Image}" alt="${animeInfo.Title}">
          <h2>Sinopsis</h2>
          <p>${safeDescription}</p>
          <h2>Episodios</h2>
          <ul class="episode-list">
            ${Array.isArray(animeInfo.Episodes) && animeInfo.Episodes.length > 0 ? animeInfo.Episodes.map(ep => `
              <li>
                <a href="/player/${ep.Id}">${ep.Title}</a>
              </li>
            `).join('') : '<li>No hay episodios disponibles.</li>'}
          </ul>
        </main>
      </body>
      </html>
    `;
    res.send(html);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
});

app.get('/api/episodes/:id', async (req, res) => {
  try {
    const resources = await withTimeout(GetResources(req.params.id), 10000); // 10 seconds timeout
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});