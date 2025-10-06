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
    const animeInfo = await withTimeout(GetAnimeInfo(req.params.id), 10000); // 10 seconds timeout
    res.json(animeInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
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