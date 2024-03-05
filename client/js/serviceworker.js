const cacheName = "FreeGPT";
const staticAssets = [
  "./../html/index.min.html",
  "./../js/chat.min.js",
  "./../js/highlight.min.js",
  "./../js/katex.min.js"
];

self.addEventListener("install", async (event) => {
  const cache = await caches.open(cacheName);
  cache.addAll(staticAssets);
});

self.addEventListener("activate", (event) => {
  clients.claim();
});

self.addEventListener("fetch", function(event) {
  const request = event.request;
  const version = request.headers.get("version");
  const cacheBehavior = getCacheBehavior(version);
  return handleRequest(request, cacheBehavior);
});

function handleRequest(request, cacheBehavior) {
  if (cacheBehavior === cacheBehavior1) {
    return fetch(request);
  } else if (cacheBehavior === cacheBehavior2) {
    return caches.open(CACHE_NAME).then(function(cache) {
      return cache.match(request).then(function(cacheEntry) {
        return cacheEntry.response;
      });
    });
  }
}

const cacheBehavior1 = {
  maxAge: 3600,
  staleWhileRevalidate: 86400,
  cacheControl: "public, max-age=3600, stale-while-revalidate=86400"
};

const cacheBehavior2 = {
  maxAge: 0,
  staleWhileRevalidate: 0,
  cacheControl: "no-cache, no-store, must-revalidate"
};

async function getCacheBehavior(version) {
  const cacheBehavior = {
    1: cacheBehavior1,
    2: cacheBehavior2,
    // ...
  }[version];
  return cacheBehavior;
}
