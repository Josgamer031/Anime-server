import express from 'express';
import { GetNewSeries, GetNewEpisodes } from './node_modules/@carlosnunezmx/animeflv/dist/scrappers/main_page.js';
import { GetAnimeInfo } from './node_modules/@carlosnunezmx/animeflv/dist/scrappers/anime.js';
import { GetResources } from './node_modules/@carlosnunezmx/animeflv/dist/scrappers/episode.js';
import { Search } from './node_modules/@carlosnunezmx/animeflv/dist/scrappers/search.js';

const app = express();
const port = 3001;

app.get('/', async (req, res) => {
  try {
    const series = await GetNewSeries();
    const html = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AnimeFLV Server</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif; background-color: #121212; color: #e0e0e0; margin: 0; padding: 20px; }
          h1, h2 { text-align: center; color: #fff; }
          nav { text-align: center; margin-bottom: 20px; }
          nav a { color: #bb86fc; text-decoration: none; font-size: 1.2em; padding: 10px; }
          ul { list-style: none; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 20px; }
          li { background-color: #1e1e1e; border-radius: 8px; overflow: hidden; text-align: center; box-shadow: 0 4px 8px rgba(0,0,0,0.2); transition: transform 0.2s; }
          li:hover { transform: scale(1.05); }
          img { max-width: 100%; height: auto; display: block; }
          p { padding: 15px; margin: 0; font-size: 14px; }
        </style>
      </head>
      <body>
        <header>
          <h1>Mi Servidor de Anime</h1>
          <nav><a href=\"/catalog\">Ver Catálogo</a></nav>
        </header>
        <main>
          <h2>Últimas Series</h2>
          <ul>
            ${series.map(s => `
              <li>
                <img src="${s.Image}" alt="${s.Title}">
                <p>${s.Title}</p>
              </li>
            `).join('')}
          </ul>
        </main>
      </body>
      </html>
    `;
    res.send(html);
  } catch (error) {
    console.error(error);
    res.status(500).send('<h1>Error al cargar las series</h1>');
  }
});

app.get('/catalog', async (req, res) => {
  try {
    const catalog = await Search({ page: 1 }); // Fetch first page of catalog
    res.json(catalog);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
});





// --- ORIGINAL ANIME API ---

app.get('/api/latest', async (req, res) => {
  try {
    const latest = await GetNewSeries();
    res.json(latest);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch latest anime' });
  }
});

app.get('/api/latest-episodes', async (req, res) => {
  try {
    const latest = await GetNewEpisodes();
    res.json(latest);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch latest episodes' });
  }
});

app.get('/api/catalog', async (req, res) => {
  try {
    const page = req.query.page || 1;
    const catalog = await Search({ page: parseInt(page) });
    res.json(catalog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch catalog' });
  }
});

app.get('/api/search', async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ error: 'Query parameter "q" is required' });
    }
    const results = await Search(query);
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to perform search' });
  }
});

app.get('/api/anime/:id', async (req, res) => {
  try {
    const animeInfo = await GetAnimeInfo(req.params.id);
    res.json(animeInfo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch anime info' });
  }
});

app.get('/api/episodes/:id', async (req, res) => {
  try {
    const resources = await GetResources(req.params.id);
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch episode resources' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});