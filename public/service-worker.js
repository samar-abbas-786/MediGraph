const CACHE_NAME = "medigraph-cache-v1";
const STATIC_CACHE = "medigraph-static-v1";
const DYNAMIC_CACHE = "medigraph-dynamic-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/manifest.webmanifest",
  "/medipocket_logo.PNG",
  "/offline.html",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(ASSETS_TO_CACHE)),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== STATIC_CACHE && key !== DYNAMIC_CACHE) {
            return caches.delete(key);
          }
          return null;
        }),
      ),
    ),
  );
});

const isApiRequest = (request) => request.url.includes("/api/");
const isDocumentRequest = (request) => request.destination === "document";

self.addEventListener("fetch", (event) => {
  const request = event.request;

  // Handle API requests: try network first, fallback to cache
  if (isApiRequest(request)) {
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
        .catch(() => {
          // Return cached response if available, otherwise let the app handle the error
          return caches.match(request);
        }),
    );
    return;
  }

  // Handle document requests (pages)
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
        .catch(() => {
          // Only show offline page if truly offline
          return caches.match(request) || caches.match("/offline.html");
        }),
    );
    return;
  }

  // Handle static assets: cache first
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(request).then((response) => {
        if (response.ok) {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      });
    }),
  );
});
