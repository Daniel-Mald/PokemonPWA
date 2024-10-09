// service-worker.js


let urls = [
    "/",
    "/Index",
    "/Datos",
    "/estilos.css",
    "/imgs/icono.png",
    "/imgs/icono-128.png",
    "/imgs/icono-512.png",
    "/imgs/pokemon.png"
];
let cacheName = "pokemonCachev1";
async function precache() {
    let cache = await caches.open(cacheName);
    await cache.addAll(urls);
}
//PRecache
self.addEventListener("install", function (e) {
    e.waitUntil(precache());
});


self.addEventListener('fetch', event => {
    event.respondWith(CacheFirst(event.request));
});

async function CacheFirst(url) {
    let cache = await caches.open(cacheName);
    let response = await cache.match(url);
    if (response) {
        return response;
    } else {
        let respuesta = await fetch(url);
        await cache.put(url, respuesta.clone());
        return respuesta;
        try {
            const respuesta = await fetch(url);
            await cache.put(url, respuesta.clone());
            return respuesta;
        } catch (error) {
            console.error("Fetch failed; returning offline page instead.", error);
            // Aquí podrías devolver una página de error o una versión offline
        }
    }
}


async function CacheFirst(url) {
    let cache = await caches.open(cacheName);
    let response = await cache.match(url);
    if (response) {
        return response;
    } else {
        return new Response("No se encontro en cache")
       
    }
}


self.addEventListener("online", function () { });
async function NetworkFirst(url) {
    let cahe = await caches.open(cahceName);
    let respuesta = await fetch(url);

    //if (self.isConnected) {

    //}

    try {
        if (respuesta.ok) {
            let cache = awati caches.open(cacheName);
            cache.put(url, respuesta.clone());
            return respuesta;
        }
    }catch(x){
        let response = await cahe.match(url);
        if (response) {
            return response;
        }
    }

    async function StaleWhileRevalidate(url) {
        let cache = await caches.open(cacheName);
        let response = await cache.match(url);

        let r =fetch(url).then(response => {
            cache.put(url, response.clone());
            return response;

        });

        return response || r;
         
    }
    let channel = new BroadcastChannel("refreshChannel");

    //suscribirse al channel en el layaut
    async function staleThenRevalidate(req) {
        let cache = await caches.open(cacheName);
        let response = await cache.match(req);

        if (response) {
            fetch(req).then(async(res) => {

                let networkResponsse = await fetch(req);
                let cacheData = await response.text();

                let networkData = await networkResponsse.clone().text();

                if (cacheData != networkData) {
                    cache.put(req, networkResponsse.clone());
                    channel.postMessage({
                        Url: req.url,
                        Data: networkData
                    });
                }
            })
            return response.clone();//stale


        } else {
            return NetworkFirst(req);
        }
    }

    let maxAge = 24 * 60 * 60 * 1000;
    async function timeBasedCache(req) {
        let cache = await caches.open(cacheName);

        let cacheResponse = await cache.match(req);

        if (cacheResponse) {
            let fechaDescarga = cacheResponse.headers.get("fecha");



        } else {
            let networkResponse = await fetch(req);
            let nuevoResponse = new Response(networkResponse.body, {
                statusText : networkResponse.statusText,
                status: networkResponse.status,
                headers: networkResponse.headers,
                type: networkResponse.type
            });
            nuevoResponse.headers.append("fecha", new Date().toISOString());

            cache.put(req, nuevoResponse);
            return networkResponse;
        }
    }
}
