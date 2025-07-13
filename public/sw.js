// Service Worker для Trinity AI News
const CACHE_NAME = 'trinity-ai-news-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/favicon.ico'
];

// Установка Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Обработка fetch запросов
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Возвращаем кэшированный ответ, если он есть
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Обработка push уведомлений
self.addEventListener('push', (event) => {
  let data = {};
  
  if (event.data) {
    data = event.data.json();
  }

  const title = data.title || 'Trinity AI News';
  const options = {
    body: data.body || 'Новая статья доступна для чтения',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    data: data.url || '/',
    actions: [
      {
        action: 'open',
        title: 'Читать',
        icon: '/favicon.ico'
      },
      {
        action: 'close',
        title: 'Закрыть'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Обработка кликов по уведомлениям
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'open' || !event.action) {
    const urlToOpen = event.notification.data || '/';
    
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((clientList) => {
          // Проверяем, есть ли уже открытая вкладка с нашим сайтом
          for (let client of clientList) {
            if (client.url.includes(self.location.origin) && 'focus' in client) {
              return client.focus().then(() => {
                return client.navigate(urlToOpen);
              });
            }
          }
          
          // Если нет открытых вкладок, открываем новую
          if (clients.openWindow) {
            return clients.openWindow(urlToOpen);
          }
        })
    );
  }
});

// Обработка обновления кэша
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});