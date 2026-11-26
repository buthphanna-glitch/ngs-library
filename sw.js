// Service worker — ធ្វើឱ្យដំឡើងជា App បាន និងបង្ហាញទំព័រដើម ពេលគ្មានអ៊ីនធឺណិត
// ទាញកំណែថ្មីពី Server ជានិច្ច (កុំប្រើ cache ចាស់) — ប្រើ cache តែពេលគ្មានអ៊ីនធឺណិត
const CACHE = 'ngs-library-v2';
const FILES = ['./', './index.html', './manifest.webmanifest', './logo.png', './icon-192.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin || e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request, { cache: 'no-store' })
      .then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {}); return res; })
      .catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
