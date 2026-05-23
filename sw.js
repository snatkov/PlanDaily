const CACHE = 'plandaily-v1';
const URLS = [
  './',
  './index.html',
  './ios/manifest.json',
  './ios/icon.svg'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(URLS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).catch(() =>
      caches.match(e.request)
    )
  );
});

self.addEventListener('message', e => {
  if (e.data && e.data.type === 'notify') {
    e.waitUntil(
      self.registration.showNotification(e.data.title || 'PlanDaily', {
        body: e.data.body || '',
        tag: e.data.tag || 'plandaily',
        icon: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 32 32\'%3E%3Crect width=\'32\' height=\'32\' rx=\'6\' fill=\'%236c5ce7\'/%3E%3Ctext x=\'16\' y=\'22\' font-family=\'system-ui,sans-serif\' font-size=\'17\' font-weight=\'800\' fill=\'%23fff\' text-anchor=\'middle\'%3EPD%3C/text%3E%3C/svg%3E',
        badge: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 32 32\'%3E%3Crect width=\'32\' height=\'32\' rx=\'6\' fill=\'%236c5ce7\'/%3E%3Ctext x=\'16\' y=\'22\' font-family=\'system-ui,sans-serif\' font-size=\'17\' font-weight=\'800\' fill=\'%23fff\' text-anchor=\'middle\'%3EPD%3C/text%3E%3C/svg%3E',
        vibrate: [200, 100, 200]
      })
    );
  }
});
