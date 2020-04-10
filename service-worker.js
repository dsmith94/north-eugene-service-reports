

var CACHE_NAME = 'my-site-cache-v1';
var FILES_TO_CACHE = [
  'index.html',
  'icons-512.png',
  'service-reports.js'
];

self.addEventListener('install', (event) => {
    console.log('👷', 'install', event);
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
          console.log('[ServiceWorker] Pre-caching offline page');
          return cache.addAll(FILES_TO_CACHE);
        })
    );
  });
  
  self.addEventListener('activate', (event) => {
    console.log('👷', 'activate', event);
    event.waitUntil(
        caches.keys().then((keyList) => {
          return Promise.all(keyList.map((key) => {
            if (key !== CACHE_NAME) {
              console.log('[ServiceWorker] Removing old cache', key);
              return caches.delete(key);
            }
          }));
        })
    );
  });
  
  self.addEventListener('fetch', function(event) {
    console.log('👷', 'fetch', event);
    if (event.request.mode !== 'navigate') {
        // Not a page navigation, bail.
        return;
      }
      event.respondWith(
          fetch(event.request)
              .catch(() => {
                return caches.open(CACHE_NAME)
                    .then((cache) => {
                      return cache.match('offline.html');
                    });
              })
      );
  });