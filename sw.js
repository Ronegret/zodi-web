// ZODI Service Worker v13
// Strategy: network-first for documents/scripts, cache-first for assets

const CACHE_VERSION = 'v14';
const CACHE_NAME    = `zodi-pwa-${CACHE_VERSION}`;
const OFFLINE_URL   = '/offline.html';

// Core shell — only files that are always present
const APP_SHELL = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/zodi-logo.png',
  '/zodi-pwa-icon.png',
  '/zodi-ux-polish-v20260506a.css',
  '/zodi-light-redesign-v20260506b.css',
  '/zodi-google-bridge-v20260505.js',
  '/zodi-production-polish-v20260506a.js',
];

// ─── INSTALL ──────────────────────────────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
      .catch(err => console.error('[SW] Install failed:', err))
  );
});

// ─── ACTIVATE ─────────────────────────────────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys =>
        Promise.all(
          keys
            .filter(key => key.startsWith('zodi-pwa-') && key !== CACHE_NAME)
            .map(key => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

// ─── FETCH ────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  const { request } = event;

  // Skip non-GET and cross-origin requests
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Skip API and PHP requests — always go to network
  if (url.pathname.startsWith('/api') || url.pathname.endsWith('.php')) return;

  const isNavigation = request.mode === 'navigate';
  const isFreshFirst =
    isNavigation ||
    url.pathname.endsWith('.html') ||
    url.pathname.endsWith('.js')   ||
    url.pathname.endsWith('.css')  ||
    url.pathname.endsWith('.webmanifest');

  if (isFreshFirst) {
    // Network-first: try network, fall back to cache, then offline page
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          }
          return response;
        })
        .catch(() =>
          caches.match(request).then(cached => {
            if (cached) return cached;
            if (isNavigation) return caches.match(OFFLINE_URL);
            return new Response('Not found', { status: 404 });
          })
        )
    );
  } else {
    // Cache-first: serve from cache, update in background
    event.respondWith(
      caches.match(request).then(cached => {
        const fetchPromise = fetch(request).then(response => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          }
          return response;
        });
        return cached || fetchPromise;
      })
    );
  }
});

// ─── PUSH NOTIFICATIONS ───────────────────────────────────────────────────────
self.addEventListener('push', event => {
  let data = {};
  try {
    data = event.data?.json() ?? {};
  } catch {
    data = { title: 'ZODI', body: event.data?.text() ?? '' };
  }

  event.waitUntil(
    self.registration.showNotification(data.title || 'ZODI', {
      body:  data.body  || 'Tu frecuencia astral tiene una nueva lectura.',
      icon:  '/zodi-logo.png',
      badge: '/favicon.svg',
      tag:   data.tag   || 'zodi-notification',
      data:  { url: data.url || '/' },
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      const existing = list.find(c => c.url === url && 'focus' in c);
      if (existing) return existing.focus();
      return clients.openWindow(url);
    })
  );
});
