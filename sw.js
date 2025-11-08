const CACHE_NAME = 'kalkulator-nadplat-cache-v1';
const URLS_TO_CACHE = [
    './kalkulator_pwa.html',
    'https://cdn.tailwindcss.com',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap'
    // Pliki czcionek zostaną pobrane przez CSS i również powinny zostać przechwycone przez fetch.
];

// Instalacja Service Workera i cache'owanie zasobów
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Otwarto cache');
                return cache.addAll(URLS_TO_CACHE);
            })
    );
});

// Przechwytywanie zapytań sieciowych
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Jeśli zasób jest w cache, zwróć go
                if (response) {
                    return response;
                }
                
                // W przeciwnym razie, pobierz z sieci
                return fetch(event.request).then(
                    networkResponse => {
                        // Opcjonalnie: można dodać nowe zasoby do cache dynamicznie
                        // Ale dla tak prostej aplikacji nie jest to konieczne
                        return networkResponse;
                    }
                ).catch(() => {
                    // Obsługa błędu, gdy sieć jest niedostępna
                    // W przypadku tej aplikacji, jeśli plik HTML jest w cache, reszta powinna działać.
                });
            })
    );
});

// Aktywacja i czyszczenie starego cache
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
