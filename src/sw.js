
// This is a simplified service worker for the PWA
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('memoria-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/src/main.tsx',
        '/src/index.css',
        '/src/assets/optimized-placeholder.svg'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((response) => {
        // Don't cache API calls
        if (event.request.url.includes('supabase.co') || 
            event.request.url.includes('/api/')) {
          return response;
        }

        return caches.open('memoria-v1').then((cache) => {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    }).catch(() => {
      // Fallback for offline images
      if (event.request.url.match(/\.(jpg|jpeg|png|gif|svg)$/)) {
        return caches.match('/src/assets/optimized-placeholder.svg');
      }
      
      // Fallback page for other resources
      return caches.match('/index.html');
    })
  );
});
