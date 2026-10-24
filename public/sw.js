/* Service worker: offline support and prayer reminders.
   Bump VERSION to drop old caches after a breaking change. */
const VERSION = "v1";
const SHELL = `shell-${VERSION}`;
const STATIC = `static-${VERSION}`;
const DATA = `data-${VERSION}`;
const PRECACHE = ["/", "/manifest.webmanifest", "/icons/icon-192.png", "/logo.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  const keep = new Set([SHELL, STATIC, DATA]);
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => !keep.has(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

const putInCache = async (cacheName, request, response) => {
  if (response.ok) {
    const cache = await caches.open(cacheName);
    await cache.put(request, response.clone());
  }
  return response;
};

// Fresh when online, last good copy when not
const networkFirst = async (request, cacheName) => {
  try {
    return await putInCache(cacheName, request, await fetch(request));
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    throw new Error("Offline and not cached");
  }
};

// Fingerprinted build assets never change, so serve from cache when present
const cacheFirst = async (request) =>
  (await caches.match(request)) || putInCache(STATIC, request, await fetch(request));

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Page loads: network first, fall back to the cached page offline
  if (request.mode === "navigate") {
    event.respondWith(
      networkFirst(request, SHELL).catch(() => caches.match("/")),
    );
    return;
  }

  if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/icons/")) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Data worth having offline; live streams and video lookups stay network-only
  if (/^\/api\/(prayer-times|hadith|news)/.test(url.pathname)) {
    event.respondWith(networkFirst(request, DATA));
    return;
  }

  if (url.pathname.startsWith("/_next/image") || url.pathname.startsWith("/images/")) {
    event.respondWith(networkFirst(request, STATIC));
  }
});

// Tapping a prayer reminder opens (or focuses) the prayer times section
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((windows) => {
      const existing = windows.find((w) => new URL(w.url).origin === self.location.origin);
      if (existing) {
        existing.navigate("/#prayer-times").catch(() => {});
        return existing.focus();
      }
      return self.clients.openWindow("/#prayer-times");
    }),
  );
});
