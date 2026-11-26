// Offline cache. Bump VERSION whenever any file changes so phones pick up the update.
const VERSION = "mrcem-v2.1";
const FILES = [
  "./", "./index.html", "./manifest.webmanifest",
  "./data/core.js", "./data/resus.js", "./data/paeds.js", "./data/obs.js", "./data/trauma.js",
  "./data/cardio.js", "./data/medical.js", "./data/neuro_psych.js", "./data/surg.js",
  "./data/comms.js", "./data/history.js", "./data/frameworks.js",
  "./img/favicon-64.png", "./img/apple-touch-icon.png", "./img/logo-160.png",
  "./img/icon-192.png", "./img/icon-512.png", "./img/icon-maskable-512.png"
];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
// Network-first for the page and data (so updates arrive when online), cache fallback offline.
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request).then(r => {
      const copy = r.clone();
      caches.open(VERSION).then(c => c.put(e.request, copy));
      return r;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }).then(m => m || caches.match("./index.html")))
  );
});
