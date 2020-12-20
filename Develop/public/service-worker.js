const CACHE_NAME = "static-cache-v6";
const DATA_CACHE_NAME = "data-cache-v6";
const FILES_TO_CACHE = [
    "/",
    "/index.js",
    "/manifest.webmanifest",
    "/styles.css",
    "/db.js",
    "/index.html",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png"
];
//install
self.addEventListener("install", (evt) => {
    evt.waitUntil(
        caches
            .open(DATA_CACHE_NAME)
            .then(cache => cache.addAll(FILES_TO_CACHE))
            .then(() => self.skipWaiting())
    );
});
self.addEventListener('fetch', function (evt) {
    if (evt.request.url.includes("/api/")) {
        evt.respondWith(
            caches.open(DATA_CACHE_NAME).then(cache => {
                return fetch(evt.request)
                    .then(response => {
                        if (response.status === 200) {
                            cache.put(evt.request.url, response.clone());
                        }
                        return response;
                    })
                    .catch(err => {
                        return cache.match(evt.request);
                    });
            }).catch(err => console.log(err))
        );
        return;
    }
    evt.respondWith(
        caches.open(CACHE_NAME).then(cache => {
            return cache.match(evt.request).then(response => {
                return response || fetch(evt.request);
            });
        })
    );
});