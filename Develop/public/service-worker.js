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
self.addEventListener("install", (e) => {
    e.waitUntil(
        caches
            .open(DATA_CACHE_NAME)
            .then(cache => cache.addAll(FILES_TO_CACHE))
            .then(() => self.skipWaiting())
    );
});
// fetch
self.addEventListener('fetch', function (e) {
    if (e.request.url.includes("/api/")) {
        e.respondWith(
            caches.open(DATA_CACHE_NAME)
            .then(cache => {
                return fetch(e.request)
                    .then(response => {
                        if (response.status === 200) {
                            cache.put(e.request.url, response.clone());
                        }
                        return response;
                    })
                    .catch(err => {
                        return cache.match(e.request);
                    });
            }).catch(err => console.log(err))
        );
        return;
    }
    e.respondWith(
        caches.open(CACHE_NAME)
        .then(cache => {
            return cache.match(e.request).then(response => {
                return response || fetch(e.request);
            });
        })
    );
});