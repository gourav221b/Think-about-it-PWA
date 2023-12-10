const cacheName = 'v2'

// install service worker
self.addEventListener("install", (e) => {
    console.log("service worker running")

})

// activate service worker
self.addEventListener("activate", (e) => {
    console.log("service worker activated")
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
            .then(response => {     //make clone of respones from server
                const resClone = response.clone()
                // open cache

                caches.open(cacheName)
                    .then(cache => {
                        //add response to the cache
                        cache.put(e.request, resClone)
                    })
                return response
            })
            .catch(() => caches.match(e.request)) // finds it from the cache
    )
})