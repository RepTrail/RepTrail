const CACHE_NAME = 'reptrail-pwa-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/dashboard/student',
  '/dashboard/trainer'
];

// ─── INSTALL EVENT: pre-cache critical shell ──────────────────────────────────
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installing and caching App Shell...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

// ─── ACTIVATE EVENT: claim clients and clean old caches ───────────────────────
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activating and claiming clients...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[ServiceWorker] Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// ─── FETCH EVENT: network-first for HTML pages / cache-first for static assets 
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // 1. Bypass Supabase APIs, Server Actions, and POST mutations
  if (
    event.request.method !== 'GET' ||
    requestUrl.pathname.startsWith('/api') ||
    event.request.headers.get('x-nextjs-post') || 
    requestUrl.host.includes('supabase.co')
  ) {
    return; // Let the browser/DAL deal with network directly
  }

  // 2. HTML Pages (Dashboard): Network-First com timeout de 1.5s caindo para o App Shell
  if (event.request.headers.get('accept')?.includes('text/html')) {
    const fetchPromise = fetch(event.request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      });

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Network timeout (1.5s)')), 1500);
    });

    event.respondWith(
      Promise.race([fetchPromise, timeoutPromise])
        .catch(() => {
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;
            if (requestUrl.pathname.startsWith('/dashboard/student')) {
              return caches.match('/dashboard/student');
            }
            if (requestUrl.pathname.startsWith('/dashboard/trainer')) {
              return caches.match('/dashboard/trainer');
            }
            return caches.match('/');
          });
        })
    );
    return;
  }

  // 3. Static Bundles (_next/static, fonts, icons): Cache-First
  const isStaticAsset = 
    requestUrl.pathname.startsWith('/_next/static') ||
    requestUrl.pathname.startsWith('/fonts') ||
    requestUrl.pathname.startsWith('/icons') ||
    event.request.destination === 'font' ||
    (event.request.destination === 'image' && requestUrl.origin === self.location.origin);

  if (isStaticAsset) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        
        return fetch(event.request).then((response) => {
          if (!response || response.status !== 200) return response;
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        });
      })
    );
    return;
  }
});
