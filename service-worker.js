const CACHE_NAME = 'beacon-pwa-v1';
const urlsToCache = [
  './',                  // Alias for index.html
  'index.html',
  'calendar.html',
  'map.html',
  'report.html',
  'notification.html',
  'login.html',          // Include if you have these pages
  'register.html',       // Include if you have these pages
  'styles.css',          // Ensure this matches your CSS filename
  'dashboard.js',        // ✅ Changed from script.js
  'notification.js',     // ✅ Added this based on your earlier code
  'manifest.json',
  'icons/icon-192.png',
  'icons/icon-512.png'
];

// Install event
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Activate event
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});