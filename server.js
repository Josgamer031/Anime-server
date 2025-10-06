import express from 'express';
import { GetNewSeries, GetNewEpisodes } from './node_modules/@carlosnunezmx/animeflv/dist/scrappers/main_page.js';
import { GetAnimeInfo } from './node_modules/@carlosnunezmx/animeflv/dist/scrappers/anime.js';
import { GetResources } from './node_modules/@carlosnunezmx/animeflv/dist/scrappers/episode.js';
import { Search } from './node_modules/@carlosnunezmx/animeflv/dist/scrappers/search.js';

const app = express();
const port = 3001;

// Middleware to serve static files from 'public' directory
app.use(express.static('public'));

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

export default app;