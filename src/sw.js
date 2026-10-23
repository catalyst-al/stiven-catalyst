// The service worker: the tools work without a connection once they have been opened. Pages are fetched from the
// network first and kept as a copy for when there is none; a file with a version in its address (styles.css?v=…,
// js/tool-kit.js?v=…) never changes, so it is served from the copy and fetched once; a picture or font without one
// is served from the copy and refreshed in the background. Nothing but this site's own files is ever kept, and no
// work of a tool: that stays in localStorage, as before. Pages it was asked to keep (the tools of a role, from
// js/offline.js) are fetched with their stylesheets and scripts, so they open whole.
const CACHE = "sc-offline-v1";
const OFFLINE_PAGE = "/offline.html";
const PRECACHE = [OFFLINE_PAGE, "/manifest.webmanifest", "/favicon.svg"];
const KEPT = /\.(?:css|js|mjs|woff2?|svg|png|jpe?g|webp|json|webmanifest)$/i;

const isVersioned = (url) => /(?:^|[?&])v=[0-9a-f]+/.test(url.search);
// The stylesheets and scripts a page links, as addresses to fetch with it.
const assetsOf = (html, pageUrl) => {
  const found = new Set();
  for (const match of html.matchAll(/<(?:link|script)\b[^>]*?\b(?:href|src)="([^"]+)"[^>]*>/g)) {
    const tag = match[0];
    if (/<link/.test(tag) && !/rel="stylesheet"/.test(tag)) continue;
    if (/<script/.test(tag) && !/\bsrc=/.test(tag)) continue;
    try {
      const url = new URL(match[1].replace(/&amp;/g, "&"), pageUrl);
      if (url.origin === self.location.origin) found.add(url.href);
    } catch { /* not an address */ }
  }
  return [...found];
};

const put = async (cache, request, response) => {
  if (!response || !response.ok || response.type === "opaque") return;
  await cache.put(request, response.clone());
  // A versioned file replaces the older versions of the same file.
  const url = new URL(typeof request === "string" ? request : request.url);
  if (!isVersioned(url)) return;
  for (const key of await cache.keys()) {
    const other = new URL(key.url);
    if (other.pathname === url.pathname && other.search !== url.search) await cache.delete(key);
  }
};

const networkFirst = async (request) => {
  const cache = await caches.open(CACHE);
  try {
    const response = await fetch(request);
    await put(cache, request, response);
    return response;
  } catch {
    const kept = await cache.match(request, { ignoreSearch: true });
    return kept || (await cache.match(OFFLINE_PAGE)) || Response.error();
  }
};
const cacheFirst = async (request) => {
  const cache = await caches.open(CACHE);
  const kept = await cache.match(request);
  if (kept) return kept;
  const response = await fetch(request);
  await put(cache, request, response);
  return response;
};
const staleWhileRevalidate = async (request) => {
  const cache = await caches.open(CACHE);
  const kept = await cache.match(request);
  const refresh = fetch(request).then(async (response) => { await put(cache, request, response); return response; }).catch(() => null);
  return kept || (await refresh) || Response.error();
};

// A page and the files it links, kept so the tool opens whole without a connection.
const keepPage = async (cache, href) => {
  const response = await fetch(href);
  if (!response.ok) return;
  await put(cache, href, response.clone());
  const html = await response.text();
  for (const asset of assetsOf(html, href)) {
    if (!(await cache.match(asset))) {
      try { await put(cache, asset, await fetch(asset)); } catch { /* next file */ }
    }
  }
};

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || url.pathname === "/sw.js") return;
  if (request.mode === "navigate" || request.destination === "document") {
    event.respondWith(networkFirst(request));
  } else if (KEPT.test(url.pathname)) {
    event.respondWith(isVersioned(url) ? cacheFirst(request) : staleWhileRevalidate(request));
  }
});
self.addEventListener("message", (event) => {
  const data = event.data;
  if (!data || data.type !== "keep" || !Array.isArray(data.urls)) return;
  event.waitUntil(caches.open(CACHE).then(async (cache) => {
    for (const href of data.urls.slice(0, 40)) {
      try {
        if (new URL(href).origin === self.location.origin && !(await cache.match(href, { ignoreSearch: true }))) await keepPage(cache, href);
      } catch { /* next page */ }
    }
  }));
});

// For the tests (tests/offline.test.cjs).
self.SwKit = { CACHE, PRECACHE, KEPT, isVersioned, assetsOf };
