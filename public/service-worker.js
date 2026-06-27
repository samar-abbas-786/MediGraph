const STATIC_CACHE = "medigraph-static-v3";
const DYNAMIC_CACHE = "medigraph-dynamic-v3";

const ASSETS_TO_CACHE = [
  "/manifest.webmanifest",
  "/medipocket_logo.PNG",
  "/offline.html",
];

// Install
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }),
  );

  self.skipWaiting();
});

// Activate
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== STATIC_CACHE && key !== DYNAMIC_CACHE) {
            console.log("Deleting old cache:", key);
            return caches.delete(key);
          }
        }),
      );
    }),
  );

  event.waitUntil(self.clients.claim());
});

// Helpers
const isApiRequest = (request) => request.url.includes("/api/");
const isDocumentRequest = (request) => request.destination === "document";

// Fetch
self.addEventListener("fetch", (event) => {
  const request = event.request;

  // Never handle non-GET requests
  if (request.method !== "GET") {
    event.respondWith(fetch(request));
    return;
  }

  // Never cache API requests
  if (isApiRequest(request)) {
    event.respondWith(fetch(request));
    return;
  }

  // Network first for pages
  if (isDocumentRequest(request)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const responseClone = response.clone();

            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }

          return response;
        })
        .catch(async () => {
          const cachedPage = await caches.match(request);

          if (cachedPage) {
            return cachedPage;
          }

          return caches.match("/offline.html");
        }),
    );

    return;
  }

  // Cache first for static assets
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request)
        .then((response) => {
          if (
            response &&
            response.status === 200 &&
            response.type === "basic"
          ) {
            const responseClone = response.clone();

            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }

          return response;
        })
        .catch(() => {
          if (request.destination === "image") {
            return caches.match("/medipocket_logo.PNG");
          }
        });
    }),
  );
});
