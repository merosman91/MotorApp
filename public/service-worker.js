const CACHE_NAME = 'motor-pwa-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
];

/* Install */
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
});

/* Activate */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

/* Fetch */
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // ❌ لا نعترض ملفات JS أو CSS أو Vite assets
  if (
    request.url.includes('/assets/') ||
    request.destination === 'script' ||
    request.destination === 'style'
  ) {
    return;
  }

  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request).then((response) => {
          return response;
        })
    )
  );
});
