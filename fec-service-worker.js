const RUNTIME = 'runtime';
let CURRENT_CACHES = [RUNTIME];
const NO_CACHE_ORIGINS = [
  'https://api.mlab.com',
  'https://www.googleapis.com',
  'https://firestore.googleapis.com'
];
const COMPONENT = '__component__';

// The install handler takes care of precaching the resources we always need.
self.addEventListener('install', event => {
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !CURRENT_CACHES.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});

// The fetch handler serves responses for all resources from a cache.
// If no response is found, it populates the runtime cache with the response
// from the network before returning it to the page.
self.addEventListener('fetch', async event => {
  const url = event.request.url;
  // console.log('fetch - url:', url);
  //
  // The following demonstrates loading resources by using the convention
  // of looking for `__component__`. It then determines what type of
  // resource is being requested and performs a lookup in the
  // `components` collection in a NoSQL document database.
  // The return result is JSON and the actual resource is from the
  // `code` property.
  //
  if (url.includes(COMPONENT)) {
    event.respondWith(new Promise(async (resolve, reject) => {
      const name = url.substring(url.indexOf(COMPONENT) + COMPONENT.length + 1);
      const nameParts = name.split('.');
      const ext = nameParts.pop();
      let obj;
      let headers;
      if (ext === 'js') {
        headers = {'Content-Type': 'application/javascript; charset=utf-8'};
      } else if (ext === 'html') {
        headers = {'Content-Type': 'text/html'};
      } else if (ext === 'css') {
        headers = {'Content-Type': 'text/css'};
      }
      const init = {
        status: 200,
        statusText: "OK",
        headers
      };
      const baseUrl = 'https://api.mlab.com/api/1/';
      const filter = {name};
      const query = `?q=${JSON.stringify(filter)}&`;
      const api = 'apiKey=50klcLiRACv_V_SSI_FuvzcNauAR4IKB';
      const reqUrl = `${baseUrl}/databases/quoteone-stage/collections/components${query}${api}`;
      const request = new Request(reqUrl, {method: 'GET'});
      return fetch(request).then(async response => {
        const data = await response.json();
        const result = new Response(data[0].code, init);
        resolve(result);
      });
    }));
  } else {
    const reqUrl = new URL(event.request.url);
    // const refUrl = new URL(event.request.referrer);
    let CACHE_NAME = RUNTIME;
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return caches.open(CACHE_NAME).then(cache => {
          return fetch(event.request).then(response => {
            if (event.request.method === 'GET' &&
              !NO_CACHE_ORIGINS.includes(reqUrl.origin)) {
              // console.log('sw:caching (', CACHE_NAME, ') - ', event.request.url);
              return cache.put(event.request, response.clone()).then(() => {
                return response;
              });
            } else {
              return response;
            }
          });
        });
      })
    );
  }
});
