
// Cacheable assets
const STATIC_CACHE = 'memoria-static-v1';
const DYNAMIC_CACHE = 'memoria-dynamic-v1';
const IMAGE_CACHE = 'memoria-images-v1';

// Assets to precache
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/src/main.tsx',
  '/src/index.css',
  '/src/assets/optimized-placeholder.svg'
];

// Install event - precache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting()) // Activate immediately
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const currentCaches = [STATIC_CACHE, DYNAMIC_CACHE, IMAGE_CACHE];
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return cacheNames.filter(
          (cacheName) => !currentCaches.includes(cacheName)
        );
      })
      .then((cachesToDelete) => {
        return Promise.all(
          cachesToDelete.map((cacheToDelete) => {
            return caches.delete(cacheToDelete);
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Utility function to determine caching strategy based on request
const getCacheStrategy = (request) => {
  const url = new URL(request.url);
  
  // Don't cache API or authentication requests
  if (url.pathname.includes('/api/') || 
      url.pathname.includes('/auth/') ||
      url.pathname.includes('/supabase/')) {
    return 'network-only';
  }
  
  // Cache images with a specific strategy
  if (request.destination === 'image' || 
      url.pathname.endsWith('.png') || 
      url.pathname.endsWith('.jpg') || 
      url.pathname.endsWith('.jpeg') || 
      url.pathname.endsWith('.webp') || 
      url.pathname.endsWith('.svg')) {
    return 'cache-first-image';
  }
  
  // Static assets with cache-first strategy
  if (request.destination === 'script' || 
      request.destination === 'style' || 
      request.destination === 'font') {
    return 'cache-first';
  }
  
  // Default for HTML, JSON, etc
  return 'network-first';
};

// Fetch event with appropriate caching strategies
self.addEventListener('fetch', (event) => {
  const strategy = getCacheStrategy(event.request);
  
  switch (strategy) {
    case 'network-only':
      // Always go to network for API calls
      event.respondWith(fetch(event.request));
      break;
      
    case 'cache-first':
      // Check cache first, fall back to network
      event.respondWith(
        caches.match(event.request)
          .then((response) => {
            return response || fetch(event.request)
              .then((fetchResponse) => {
                return caches.open(STATIC_CACHE)
                  .then((cache) => {
                    cache.put(event.request, fetchResponse.clone());
                    return fetchResponse;
                  });
              });
          })
      );
      break;
      
    case 'cache-first-image':
      // Specialized image handling
      event.respondWith(
        caches.match(event.request)
          .then((response) => {
            return response || fetch(event.request)
              .then((fetchResponse) => {
                return caches.open(IMAGE_CACHE)
                  .then((cache) => {
                    cache.put(event.request, fetchResponse.clone());
                    return fetchResponse;
                  });
              })
              .catch(() => {
                // Provide fallback for offline images
                return caches.match('/src/assets/optimized-placeholder.svg');
              });
          })
      );
      break;
      
    case 'network-first':
    default:
      // Try network first, fall back to cache
      event.respondWith(
        fetch(event.request)
          .then((response) => {
            // Cache a copy of the response
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                cache.put(event.request, responseClone);
              });
            return response;
          })
          .catch(() => {
            return caches.match(event.request)
              .then((cachedResponse) => {
                if (cachedResponse) {
                  return cachedResponse;
                }
                // If HTML is requested but not in cache, return offline page
                if (event.request.destination === 'document') {
                  return caches.match('/index.html');
                }
                return new Response('Network error occurred', {
                  status: 408,
                  headers: new Headers({
                    'Content-Type': 'text/plain'
                  })
                });
              });
          })
      );
      break;
  }
});

// Background sync for offline form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'post-sync') {
    event.waitUntil(
      // Process any queued posts when back online
      // This would require additional implementation with IndexedDB
      console.log('Background sync triggered for queued posts')
    );
  }
});

// Handle push notifications
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/favicon.ico',
      badge: '/favicon.ico'
    };
    
    event.waitUntil(
      self.registration.showNotification('MEMORIA', options)
    );
  }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});
