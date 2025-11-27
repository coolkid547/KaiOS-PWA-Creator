// KaiOS PWA Creator - Main Application Logic

// Register Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(registration => console.log('SW registered'))
            .catch(err => console.log('SW registration failed'));
    });
}

// Handle install prompt for this creator app
let deferredInstallPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    const btn = document.getElementById('installBtn');
    if (btn) {
        btn.style.display = 'inline-block';
        btn.addEventListener('click', async () => {
            btn.disabled = true;
            deferredInstallPrompt.prompt();
            const choice = await deferredInstallPrompt.userChoice;
            if (choice && choice.outcome === 'accepted') {
                btn.textContent = 'Installed';
            } else {
                btn.textContent = 'Install';
            }
            deferredInstallPrompt = null;
            btn.disabled = false;
            btn.style.display = 'none';
        });
    }
});

// Form submission handler
document.getElementById('pwaForm').addEventListener('submit', (e) => {
    e.preventDefault();
    generatePWA();
});

// Generate PWA files
function generatePWA() {
    const formData = new FormData(document.getElementById('pwaForm'));

    // Provide safe defaults to avoid runtime errors
    const name = formData.get('appName') || 'My App';
    const shortName = formData.get('appShortName') || 'app';
    const startUrl = formData.get('appStart') || '/';
    const themeColor = formData.get('themeColor') || '#2196F3';
    const bgColor = formData.get('bgColor') || '#ffffff';

    const appConfig = {
        name: name,
        short_name: shortName,
        description: formData.get('appDescription') || '',
        start_url: startUrl,
        scope: '/',
        display: formData.get('appDisplay') || 'standalone',
        orientation: formData.get('appOrientation') || 'any',
        theme_color: themeColor,
        background_color: bgColor,
        url: formData.get('appUrl') || '',
        category: formData.get('appCategory') || ''
    };

    // Collect screenshots
    const screenshots = [];
    document.querySelectorAll('[name="screenshot"]').forEach(input => {
        if (input.value.trim()) {
            screenshots.push({
                src: input.value,
                sizes: '544x816',
                type: 'image/png'
            });
        }
    });
    appConfig.screenshots = screenshots;

    // Generate files
    const manifest = generateManifest(appConfig);
    const serviceWorker = generateServiceWorker(appConfig);
    const htmlTemplate = generateHTMLTemplate(appConfig);

    // Display results
    document.getElementById('manifestOutput').textContent = JSON.stringify(manifest, null, 2);
    document.getElementById('swOutput').textContent = serviceWorker;
    document.getElementById('htmlOutput').textContent = htmlTemplate;
    document.getElementById('outputSection').style.display = 'block';

    // Scroll to results
    setTimeout(() => {
        document.getElementById('outputSection').scrollIntoView({ behavior: 'smooth' });
    }, 100);
}

// Generate Web App Manifest
function generateManifest(config) {
    return {
        name: config.name,
        short_name: config.short_name,
        description: config.description,
        start_url: config.start_url,
        scope: config.scope,
        display: config.display,
        orientation: config.orientation,
        theme_color: config.theme_color,
        background_color: config.background_color,
        categories: config.category ? [config.category] : [],
        screenshots: config.screenshots,
        icons: [
            {
                src: '/assets/icon-72.png',
                sizes: '72x72',
                type: 'image/png',
                purpose: 'any'
            },
            {
                src: '/assets/icon-96.png',
                sizes: '96x96',
                type: 'image/png',
                purpose: 'any'
            },
            {
                src: '/assets/icon-128.png',
                sizes: '128x128',
                type: 'image/png',
                purpose: 'any'
            },
            {
                src: '/assets/icon-144.png',
                sizes: '144x144',
                type: 'image/png',
                purpose: 'any'
            },
            {
                src: '/assets/icon-152.png',
                sizes: '152x152',
                type: 'image/png',
                purpose: 'any'
            },
            {
                src: '/assets/icon-192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any'
            },
            {
                src: '/assets/icon-512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any'
            }
        ],
        shortcuts: [
            {
                name: 'New Task',
                short_name: 'New Task',
                description: 'Create a new task',
                url: '/new-task',
                icons: [
                    {
                        src: '/assets/icon-96.png',
                        sizes: '96x96'
                    }
                ]
            }
        ]
    };
}

// Generate Service Worker
function generateServiceWorker(config) {
        // Build a safe cache name from short_name
        const raw = (config.short_name || 'app').toString();
        const safe = raw.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || 'app';
        const cacheName = `${safe}-v1`;
        return `// Service Worker for ${config.name || 'App'}
// Generated by KaiOS PWA Creator

const CACHE_NAME = '${cacheName}';
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    '/styles/main.css',
    '/js/app.js'
];

// Install event
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(urlsToCache);
            })
            .catch((err) => {
                console.log('Cache installation failed:', err);
            })
    );
    self.skipWaiting();
});

// Activate event
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
    self.clients.claim();
});

// Fetch event - Network first, fallback to cache
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    // Skip non-http(s) requests
    if (!event.request.url.startsWith('http')) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Clone the response
                const clonedResponse = response.clone();
        
                // Cache successful responses
                if (response.status === 200 && response.type !== 'error') {
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, clonedResponse);
                    });
                }
        
                return response;
            })
            .catch(() => {
                // Fall back to cache
                return caches.match(event.request)
                    .then((response) => {
                        return response || caches.match('/index.html');
                    })
                    .catch(() => {
                        return new Response('Offline - Please check your connection', {
                            status: 503,
                            statusText: 'Service Unavailable',
                            headers: new Headers({
                                'Content-Type': 'text/plain'
                            })
                        });
                    });
            })
    );
});

// Handle messages from clients
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
`;
}

// Generate HTML Template
function generateHTMLTemplate(config) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${config.description}">
    <meta name="theme-color" content="${config.theme_color}">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="${config.short_name}">
    <link rel="manifest" href="manifest.json">
    <link rel="icon" type="image/png" sizes="192x192" href="/assets/icon-192.png">
    <link rel="apple-touch-icon" href="/assets/icon-192.png">
    <link rel="stylesheet" href="styles/main.css">
    <title>${config.name}</title>
</head>
<body>
    <div class="app-container">
        <header class="app-header">
            <h1>${config.name}</h1>
        </header>
        
        <main class="app-main">
            <p>Welcome to ${config.name}!</p>
            <p>This is your PWA home screen content.</p>
        </main>
        
        <footer class="app-footer">
            <p>&copy; 2025 ${config.name}</p>
        </footer>
    </div>

    <script>
        // Register Service Worker
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('sw.js')
                    .then(registration => {
                        console.log('Service Worker registered');
                        
                        // Check for updates periodically
                        setInterval(() => {
                            registration.update();
                        }, 60000);
                    })
                    .catch(err => console.log('Service Worker registration failed:', err));
            });
        }

        // Handle app installation
        let deferredPrompt;
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            // Show install button if needed
        });

        // Handle app launch
        window.addEventListener('load', () => {
            if (window.navigator.standalone === true) {
                console.log('App is running in standalone mode');
            }
        });
    </script>
</body>
</html>`;
}

// Download file helper
function downloadFile(filename, content) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

// Copy to clipboard helper
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard');
    }).catch(err => {
        console.error('Failed to copy:', err);
        showToast('Copy failed');
    });
}

// Add screenshot input field
function addScreenshot() {
    const screenshotsList = document.getElementById('screenshotsList');
    const screenshotDiv = document.createElement('div');
    screenshotDiv.className = 'screenshot-item';
    screenshotDiv.innerHTML = '<input type="url" name="screenshot" placeholder="https://example.com/screenshot.png">' +
        '<button type="button" class="btn-small" onclick="this.parentElement.remove()">Remove</button>';
    screenshotsList.appendChild(screenshotDiv);
}

// Toast helper
function showToast(message, timeout = 2500) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = message;
    t.style.display = 'block';
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => {
        t.style.display = 'none';
    }, timeout);
}

// KaiOS back handling: "press back twice to exit" pattern
(() => {
    let lastBack = 0;
    window.addEventListener('keydown', (e) => {
        // Backspace or Escape could be used as back button on some devices
        if (e.key === 'Backspace' || e.key === 'Escape') {
            const el = document.activeElement;
            // If focus is on input, let it act normally
            if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) return;
            e.preventDefault();
            const now = Date.now();
            if (now - lastBack < 2000) {
                // Allow default behavior (exit or history back)
                history.back();
            } else {
                showToast('Press back again to exit');
                lastBack = now;
            }
        }
    });
})();

