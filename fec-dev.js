const CACHE_NAME = 'runtime';
//
// The following functions are used for managing the Cache while
// developing the app in dev mode.
//
function postMessageSetup() {
  window.addEventListener('message', receiveMessage, false);
}
async function receiveMessage(event) {
  // console.log('messaged received: ', event);
  // Do we trust the sender of this message?
  const origins = [
    'http://localhost:9000',
    'http://frontendcreator.com',
    'http://www.frontendcreator.com',
    'https://frontendcreator.com',
    'https://www.frontendcreator.com'
  ];
  if (!origins.includes(event.origin)) return;

  const messages = JSON.parse(event.data);
  if (messages.length === 0) return;

  let project = '';
  for (const msg of messages) {
    const {operation, repo, key, value, origin} = msg;
    project = repo;
    // Only process messages for the correct repository.
    if (location.href.includes(repo)) {
      // console.debug('repo', repo, 'location.href', location.href);
      switch (operation) {
        case 'set':
          await this.putCache(key, value, origin, repo);
          break;
      }
    }
  }
  //
  // Until we have a working hot module reload capability in the
  // browser, we always redirect to the root of the site.
  //
  setTimeout(() => {
    // location.href = `${origin}/${project}/`;
    location.reload();
  }, 150);
}
function deleteCache(key, origin, repo) {
  return caches.open(CACHE_NAME).then(cache => {
    const req = new Request(`${origin}/${key}`);
    // console.log('removing old cache for ', req);
    return cache.delete(req).then((response) => {
      // Completed removing.
      // console.log('deleteCache - completed!', response);
    });
  });
}
function putCache(key, value, origin, repo) {
  const req = new Request(`${origin}/${key}`);
  let contentType = 'text/plain';
  if (key.endsWith('.json')) {
    contentType = 'application/json';
  } else if (key.endsWith('.js')) {
    contentType = 'application/javascript';
  } else if (key.endsWith('.html')) {
    contentType = 'text/html';
  }
  let init = {
    status: 200,
    statusText: 'OK',
    headers: {
      'content-type': contentType
    }
  };
  caches.match(req).then(cachedResponse => {
    if (cachedResponse) {
      init.status = cachedResponse.status;
      init.statusText = cachedResponse.statusText;
      cachedResponse.headers.forEach((v,k) => {
        init.headers[k] = v;
      });
      init.headers['content-length'] = value.length.toString();
    }
    return caches.open(CACHE_NAME).then(cache => {
      const res = new Response(value, init);
      console.log(`caching (${key}): ${value}`);
      // Put a copy of the response in the runtime cache.
      return cache.put(req, res).then(() => {
        // Completed caching.
        // console.log('putCache - completed!');
      });
    });
  });
}

postMessageSetup();
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./fec-service-worker.js');
}
