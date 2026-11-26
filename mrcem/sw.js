// Offline cache. Bump VERSION whenever any file changes so installed copies refresh.
const VERSION = "mrcem-v3.0.0";
const FILES = [
  "./",
  "./brand/mark-maskable.svg",
  "./brand/mark-square.svg",
  "./brand/mark.svg",
  "./data/cardio.js",
  "./data/comms.js",
  "./data/core.js",
  "./data/frameworks.js",
  "./data/history.js",
  "./data/medical.js",
  "./data/neuro_psych.js",
  "./data/obs.js",
  "./data/paeds.js",
  "./data/resus.js",
  "./data/surg.js",
  "./data/trauma.js",
  "./fonts/GFSBaskerville.otf",
  "./fonts/Inter-latin.woff2",
  "./fonts/InterDisplay-Bold.woff",
  "./fonts/InterDisplay-SemiBold.woff",
  "./img/apple-touch-icon.png",
  "./img/favicon-16.png",
  "./img/favicon-32.png",
  "./img/favicon-64.png",
  "./img/icon-192.png",
  "./img/icon-512.png",
  "./img/icon-maskable-192.png",
  "./img/icon-maskable-512.png",
  "./img/og-1200x630.jpg",
  "./img/poster.jpg",
  "./index.html",
  "./manifest.webmanifest"
];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
// Network-first (fresh content when online), cache fallback when offline.
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request).then(r => {
      if (r.ok) { const copy = r.clone(); caches.open(VERSION).then(c => c.put(e.request, copy)); }
      return r;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }).then(m => m || caches.match("./index.html")))
  );
});
