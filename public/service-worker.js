const CACHE_NAME = 'anime-app-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/catalog.html',
  '/anime.html',
  '/player.html',
  '/style.css?v=2',
  '/script.js',
  '/catalog.js',
  '/anime.js',
  '/player.js',
  '/search.js',
  '/manifest.json',
  // Add your icon paths here once you create them
  '/icons/1-192x192.png',
  '/icons/1-512x512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
