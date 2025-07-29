importScripts('./service-worker-assets.js');

const CACHE_NAME = 'AlmaWEB-cache-v1';

const OFFLINE_ASSETS = self.assetsManifest.assets.map(asset => asset.url);


// Instalar y cachear los assets
self.addEventListener('install', event => {
    console.log('Service Worker: Instalando...');
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(OFFLINE_ASSETS);
        })
    );
    self.skipWaiting();
});

// Activar y limpiar cachés viejas
self.addEventListener('activate', event => {
    console.log('Service Worker: Activado');
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

// Interceptar peticiones y responder desde cache o red
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});
