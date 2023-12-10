const cacheName = 'v1'

const cacheAssets = [
    '/index.html',
    '/manifest.json',
    '/main.css',
    '/large.css',
    '/main.js',
    '/service-worker.js'
]



// install service worker
self.addEventListener("install", (e) => {
    console.log("service worker running")

    //handle cache events here
    e.waitUntil(
        caches
            .open(cacheName)
            .then(cache => {
                console.log("worker caching file")
                cache.addAll(cacheAssets)
            })
            .then(() => self.skipWaiting())

    )
})

//not relying on the default system ui, but to recreate our own.

// activate service worker
self.addEventListener("activate", (e) => {
    console.log("service worker activated")
    e.waitUntil(self.registration.navigationPreload.enable());
    // remove unwanted cache assets
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(cacheNames.map(cache => {
                if (cache !== cacheName) {
                    caches.delete(cache)
                }
            }))
        })     //loop through caches and if cache isn't what we're looking for, delete it
    )
})


//  fetch event (for offline caching access)

self.addEventListener("fetch", (e) => {
    console.log("service worker fetching")
    e.respondWith(
        fetch(e.request)            //incase of no connection, this fails.
            .then(res => res)
            .catch(() => caches.match(e.request)) // finds it from the cache
    )
})
