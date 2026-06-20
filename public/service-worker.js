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

const isApiRequest = (request) =>
  request.url.includes("/api/") || request.destination === "document";

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (isApiRequest(request)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches
              .open(DYNAMIC_CACHE)
              .then((cache) => cache.put(request, responseClone));
          }
          return response;
        })
        .catch(() => caches.match(request)),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(request)
        .then((response) => {
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }
          const responseClone = response.clone();
          caches
            .open(DYNAMIC_CACHE)
            .then((cache) => cache.put(request, responseClone));
          return response;
        })
        .catch(() => caches.match("/offline.html"));
    }),
  );
});
