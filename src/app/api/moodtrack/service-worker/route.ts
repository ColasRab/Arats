import { NextResponse } from "next/server"

// This route handler serves the service worker with the correct MIME type
export async function GET() {
  const serviceWorkerContent = `
    // Service worker for handling push notifications and PWA functionality
    
    // Cache name for offline support
    const CACHE_NAME = 'moodtrack-v1';
    
    // Files to cache for offline use
    const urlsToCache = [
      '/moodtrack',
      '/moodtrack/dashboard',
      '/moodtrack/check-in',
      '/moodtrack/assessment',
      '/icon-192x192.png',
      '/icon-512x512.png'
    ];
    
    // Install event - cache assets for offline use
    self.addEventListener('install', (event) => {
      console.log('Service Worker installing.');
      event.waitUntil(
        caches.open(CACHE_NAME)
          .then((cache) => {
            console.log('Opened cache');
            return cache.addAll(urlsToCache);
          })
      );
    });
    
    // Activate event - clean up old caches
    self.addEventListener('activate', (event) => {
      console.log('Service Worker activated.');
      event.waitUntil(
        caches.keys().then((cacheNames) => {
          return Promise.all(
            cacheNames.map((cacheName) => {
              if (cacheName !== CACHE_NAME) {
                console.log('Deleting old cache:', cacheName);
                return caches.delete(cacheName);
              }
            })
          );
        })
      );
      return self.clients.claim();
    });
    
    // Fetch event - serve cached content when offline
    self.addEventListener('fetch', (event) => {
      event.respondWith(
        caches.match(event.request)
          .then((response) => {
            // Cache hit - return the response from the cached version
            if (response) {
              return response;
            }
            
            // Not in cache - fetch and cache the response
            return fetch(event.request).then(
              (response) => {
                // Check if we received a valid response
                if (!response || response.status !== 200 || response.type !== 'basic') {
                  return response;
                }
                
                // Clone the response
                const responseToCache = response.clone();
                
                caches.open(CACHE_NAME)
                  .then((cache) => {
                    cache.put(event.request, responseToCache);
                  });
                  
                return response;
              }
            );
          })
      );
    });
    
    // Push event - handle incoming push notifications
    self.addEventListener('push', (event) => {
      console.log('Push notification received:', event);
      
      let notificationData = {
        title: 'MoodTrack',
        body: 'Time for a mood check-in!',
        url: '/check-in',
        type: 'mood-check-in'
      };
      
      // Try to parse the data if it exists
      if (event.data) {
        try {
          notificationData = event.data.json();
        } catch (e) {
          console.error('Error parsing push data:', e);
        }
      }
      
      const options = {
        body: notificationData.body,
        icon: '/icon-192x192.png',
        badge: '/badge-96x96.png',
        vibrate: [100, 50, 100],
        data: {
          url: notificationData.url || '/check-in',
          type: notificationData.type || 'mood-check-in'
        },
        actions: [
          {
            action: 'open',
            title: 'Open Now'
          },
          {
            action: 'later',
            title: 'Later'
          }
        ],
        // Use different tags for different notification types
        tag: notificationData.type || 'mood-check-in',
        renotify: true
      };
      
      event.waitUntil(
        self.registration.showNotification(notificationData.title, options)
      );
    });
    
    // Notification click event - handle user interaction with the notification
    self.addEventListener('notificationclick', (event) => {
      console.log('Notification click received:', event);
      
      event.notification.close();
      
      // Handle notification action clicks
      if (event.action === 'later') {
        // If user clicks "Later", we'll reschedule the notification for 30 minutes later
        // In a real app, you would communicate with your server to reschedule
        console.log('User clicked "Later" - would reschedule notification');
        return;
      }
      
      // Default action is to open the app at the specified URL
      const url = event.notification.data.url || '/';
      
      event.waitUntil(
        clients.matchAll({ type: 'window' }).then((windowClients) => {
          // Check if there is already a window/tab open with the target URL
          for (let i = 0; i < windowClients.length; i++) {
            const client = windowClients[i];
            if (client.url.includes(url) && 'focus' in client) {
              return client.focus();
            }
          }
          // If no window/tab is open, open a new one
          if (clients.openWindow) {
            return clients.openWindow(url);
          }
        })
      );
    });
  `

  return new NextResponse(serviceWorkerContent, {
    headers: {
      "Content-Type": "application/javascript",
    },
  })
}

