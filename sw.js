/* ============================================================
   ASKAIA Fotodok — Service Worker (PWA)
   Cacht die App fuer Offline-Nutzung. Bei jedem Release aendert
   sich der Cache-Name -> der Browser installiert die neue Version
   im Hintergrund und aktiviert sie beim naechsten Oeffnen.
   Es werden NUR Dateien der eigenen Herkunft gecacht — der
   GitHub-API-Update-Check und alle Nutzerdaten bleiben unberuehrt.
   ============================================================ */
'use strict';
const CACHE = 'askaia-fotodok-v0.5.2';
const SHELL = ['./', './index.html', './manifest.webmanifest',
  './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;   /* GitHub-API etc. immer live */
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true })
      .then(r => r || fetch(e.request))
  );
});
