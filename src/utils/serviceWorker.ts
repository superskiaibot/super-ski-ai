// Service Worker for PWA capabilities
const CACHE_NAME = 'ski-tracer-v1.0.0';
const RUNTIME_CACHE = 'ski-tracer-runtime';

// Resources to cache for offline use
const STATIC_CACHE_URLS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png'
];

// Runtime cache for API responses and user data
const RUNTIME_CACHE_URLS = [
  '/api/user/profile',
  '/api/runs/recent',
  '/api/resorts/list'
];

// Install event - cache static resources
self.addEventListener('install', (event: ExtendableEvent) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching static resources');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        // Force activation of new service worker
        return (self as any).skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event: ExtendableEvent) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        // Take control of all pages
        return (self as any).clients.claim();
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event: FetchEvent) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle different types of requests with appropriate strategies
  if (request.method === 'GET') {
    // Static resources - Cache First
    if (isStaticResource(request)) {
      event.respondWith(cacheFirst(request));
    }
    // API requests - Network First with fallback
    else if (isApiRequest(request)) {
      event.respondWith(networkFirst(request));
    }
    // Images and media - Cache First
    else if (isMediaRequest(request)) {
      event.respondWith(cacheFirst(request));
    }
    // Maps and tiles - Stale While Revalidate
    else if (isMapRequest(request)) {
      event.respondWith(staleWhileRevalidate(request));
    }
    // Everything else - Network First
    else {
      event.respondWith(networkFirst(request));
    }
  }
  // Handle POST requests for offline functionality
  else if (request.method === 'POST') {
    event.respondWith(handlePostRequest(request));
  }
});

// Background sync for offline actions
self.addEventListener('sync', (event: any) => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === 'sync-runs') {
    event.waitUntil(syncOfflineRuns());
  } else if (event.tag === 'sync-social') {
    event.waitUntil(syncSocialActions());
  }
});

// Push notifications
self.addEventListener('push', (event: any) => {
  console.log('Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New update available!',
    icon: '/icon-192x192.png',
    badge: '/icon-72x72.png',
    vibrate: [200, 100, 200],
    data: event.data ? JSON.parse(event.data.text()) : {},
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: '/action-view.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/action-dismiss.png'
      }
    ]
  };
  
  event.waitUntil(
    (self as any).registration.showNotification('SKI TRACER', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event: any) => {
  console.log('Notification clicked:', event.action);
  
  event.notification.close();
  
  if (event.action === 'view') {
    // Open the app to relevant page
    event.waitUntil(
      (self as any).clients.openWindow(event.notification.data.url || '/')
    );
  }
});

// Caching strategies
async function cacheFirst(request: Request): Promise<Response> {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  
  if (cached) {
    return cached;
  }
  
  try {
    const response = await fetch(request);
    if (response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    // Return offline fallback if available
    return getOfflineFallback(request);
  }
}

async function networkFirst(request: Request): Promise<Response> {
  const cache = await caches.open(RUNTIME_CACHE);
  
  try {
    const response = await fetch(request);
    
    if (response.status === 200) {
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('Network failed, trying cache:', request.url);
    
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    
    return getOfflineFallback(request);
  }
}

async function staleWhileRevalidate(request: Request): Promise<Response> {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request);
  
  // Start fetch in background
  const fetchPromise = fetch(request).then(response => {
    if (response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  });
  
  // Return cached version immediately, or wait for network
  return cached || fetchPromise;
}

async function handlePostRequest(request: Request): Promise<Response> {
  try {
    return await fetch(request);
  } catch (error) {
    // Store for background sync
    const data = await request.clone().formData();
    await storeOfflineAction(request.url, data);
    
    // Return synthetic response
    return new Response(
      JSON.stringify({ 
        success: true, 
        offline: true, 
        message: 'Action queued for sync' 
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
}

// Helper functions
function isStaticResource(request: Request): boolean {
  return request.url.includes('/static/') || 
         request.url.includes('.css') || 
         request.url.includes('.js') ||
         request.url.includes('/manifest.json');
}

function isApiRequest(request: Request): boolean {
  return request.url.includes('/api/');
}

function isMediaRequest(request: Request): boolean {
  return request.url.includes('.jpg') || 
         request.url.includes('.png') || 
         request.url.includes('.webp') ||
         request.url.includes('.mp4') ||
         request.url.includes('.webm');
}

function isMapRequest(request: Request): boolean {
  return request.url.includes('tiles') || 
         request.url.includes('maps') ||
         request.url.includes('mapbox') ||
         request.url.includes('openstreetmap');
}

function getOfflineFallback(request: Request): Response {
  if (request.destination === 'document') {
    return caches.match('/offline.html') || new Response('Offline');
  }
  
  if (isMediaRequest(request)) {
    return caches.match('/offline-image.png') || new Response('');
  }
  
  return new Response('Offline', { status: 503 });
}

async function storeOfflineAction(url: string, data: FormData): Promise<void> {
  const db = await openIndexedDB();
  const transaction = db.transaction(['offline_actions'], 'readwrite');
  const store = transaction.objectStore('offline_actions');
  
  await store.add({
    url,
    data: Object.fromEntries(data.entries()),
    timestamp: Date.now()
  });
}

async function syncOfflineRuns(): Promise<void> {
  const db = await openIndexedDB();
  const transaction = db.transaction(['offline_actions'], 'readonly');
  const store = transaction.objectStore('offline_actions');
  const actions = await store.getAll();
  
  for (const action of actions) {
    try {
      await fetch(action.url, {
        method: 'POST',
        body: JSON.stringify(action.data),
        headers: { 'Content-Type': 'application/json' }
      });
      
      // Remove from offline storage
      const deleteTransaction = db.transaction(['offline_actions'], 'readwrite');
      deleteTransaction.objectStore('offline_actions').delete(action.id);
    } catch (error) {
      console.log('Sync failed for action:', action.id);
    }
  }
}

async function syncSocialActions(): Promise<void> {
  // Similar to syncOfflineRuns but for social interactions
  console.log('Syncing social actions...');
}

function openIndexedDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('SkiTracerDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      if (!db.objectStoreNames.contains('offline_actions')) {
        const store = db.createObjectStore('offline_actions', { 
          keyPath: 'id', 
          autoIncrement: true 
        });
        store.createIndex('timestamp', 'timestamp');
      }
    };
  });
}

export {};