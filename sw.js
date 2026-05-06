const CACHE_NAME = 'zodi-pwa-v10-light-redesign';
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/zodi-logo.png',
  '/bg-video.mp4',
  '/zodi-google-bridge-v20260505.js',
  '/zodi-production-polish-v20260505e.js',
  '/zodi-ux-polish-v20260506a.css',
  '/zodi-light-redesign-v20260506a.css'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  const freshFirst =
    request.mode === 'navigate' ||
    url.pathname.endsWith('.html') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.webmanifest');

  event.respondWith(
    (freshFirst
      ? fetch(request)
          .then(response => {
            const copy = response.clone();
            if (response.ok && url.origin === self.location.origin) {
              caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
            }
            return response;
          })
          .catch(() => caches.match(request))
      : caches.match(request).then(cached => {
          if (cached) return cached;
          return fetch(request).then(response => {
            const copy = response.clone();
            if (response.ok && url.origin === self.location.origin) {
              caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
            }
            return response;
          });
        })
    ).then(response => {
      if (response) return response;
      return fetch(request).then(response => {
        const copy = response.clone();
        if (response.ok && url.origin === self.location.origin) {
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        }
        return response;
      });
    })
  );
});

self.addEventListener('push', event => {
  const data = event.data?.json?.() || {};
  event.waitUntil(
    self.registration.showNotification(data.title || 'ZODI', {
      body: data.body || 'Tu frecuencia astral tiene una nueva lectura.',
      icon: '/zodi-logo.png',
      badge: '/favicon.svg',
      data: { url: data.url || '/' }
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(clients.openWindow(url));
});
