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

// Reminders without a page open. js/reminders.js keeps, in IndexedDB "sc-reminders" on this device, whether they
// are on, the day one was last shown, their words, and a summary of the open actions (counts per due day, the three
// due soonest). Where the browser offers Periodic Background Sync (an installed app in Chromium) it wakes this worker
// about once a day, and the worker shows the day's one notification if no page has shown it yet. A click opens the
// Action Tracker. Nothing is fetched or sent for it; where any of it is missing, nothing happens.
const REMIND = { DB: "sc-reminders", STORE: "kv", TAG: "sc-reminders" };
const remindDay = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const remindIsDay = (value) => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
// As RemindersMath.fromSummary: open actions due before today, due today, and the first three titles of those.
const remindCounts = (summary, today) => {
  let overdue = 0;
  let due = 0;
  for (const [day, n] of Object.entries(summary?.byDue || {})) {
    if (!remindIsDay(day) || !Number.isInteger(n) || n < 1) continue;
    if (day < today) overdue += n;
    else if (day === today) due += n;
  }
  const titles = (Array.isArray(summary?.first) ? summary.first : []).filter((a) => a && typeof a.title === "string" && remindIsDay(a.due) && a.due <= today).slice(0, 3).map((a) => a.title);
  return { overdue, today: due, titles };
};
const remindFill = (template, vars) => String(template || "").replace(/\{(\w+)\}/g, (match, name) => (name in vars ? vars[name] : match));
const remindWords = (state, lang) => {
  const texts = state && typeof state.texts === "object" && state.texts ? state.texts : {};
  const sound = (words) => words && ["title", "counts", "more"].every((name) => typeof words[name] === "string");
  return [texts[lang], texts[state?.lang], ...Object.values(texts)].find(sound) || null;
};
// Only the Action Tracker of this site, in one of its three languages.
const remindUrl = (href) => {
  try {
    const url = new URL(href, self.location.origin);
    if (url.origin === self.location.origin && /^\/(?:(?:de|sq)\/)?tools\/action-tracker\/$/.test(url.pathname)) return url.href;
  } catch { /* the default */ }
  return new URL("/tools/action-tracker/", self.location.origin).href;
};
// The database only if a page made it: opened to read, a missing one is not created.
const remindOpen = (idb) => new Promise((resolve) => {
  if (!idb) { resolve(null); return; }
  let request;
  try { request = idb.open(REMIND.DB, 1); } catch { resolve(null); return; }
  request.onupgradeneeded = () => { try { request.transaction.abort(); } catch { /* resolves null */ } };
  request.onsuccess = () => {
    const db = request.result;
    if (!db.objectStoreNames.contains(REMIND.STORE)) { db.close(); resolve(null); return; }
    resolve(db);
  };
  request.onerror = () => resolve(null);
  request.onblocked = () => resolve(null);
});
const remindDo = (db, mode, run) => new Promise((resolve) => {
  try {
    const tx = db.transaction(REMIND.STORE, mode);
    const request = run(tx.objectStore(REMIND.STORE));
    let result;
    request.onsuccess = () => { result = request.result; };
    tx.oncomplete = () => resolve(result);
    tx.onerror = () => resolve(undefined);
    tx.onabort = () => resolve(undefined);
  } catch { resolve(undefined); }
});
// True when a notification was shown.
const remind = async ({ idb = self.indexedDB, registration = self.registration, permission = self.Notification?.permission, now = new Date() } = {}) => {
  if (permission !== "granted" || !registration || typeof registration.showNotification !== "function") return false;
  const db = await remindOpen(idb);
  if (!db) return false;
  try {
    const state = await remindDo(db, "readonly", (store) => store.get("state"));
    const summary = await remindDo(db, "readonly", (store) => store.get("summary"));
    const today = remindDay(now);
    if (!state || state.on !== true || state.last === today || !summary) return false;
    const due = remindCounts(summary, today);
    if (!due.overdue && !due.today) return false;
    const words = remindWords(state, summary.lang);
    if (!words) return false;
    // The day is claimed first, as the page does, so the page does not show it again.
    if ((await remindDo(db, "readwrite", (store) => store.put({ ...state, last: today }))) === undefined) return false;
    const counts = remindFill(words.counts, { overdue: due.overdue, today: due.today });
    const rest = due.overdue + due.today - due.titles.length;
    const body = [counts, ...due.titles.map((title) => `• ${title}`), rest > 0 ? remindFill(words.more, { n: rest }) : ""].filter(Boolean).join("\n");
    await registration.showNotification(words.title, { body, tag: REMIND.TAG, data: { url: remindUrl(summary.url) }, icon: "/icons/icon-192.png", lang: summary.lang });
    return true;
  } catch { return false; } finally { db.close(); }
};
// Set as the scope's event handler properties (standard for both events), beside the listeners of the offline copy.
self.onperiodicsync = (event) => {
  if (event.tag === REMIND.TAG) event.waitUntil(remind());
};
// A reminder clicked (shown here or by a page through this worker): the Action Tracker, in a tab already open if any.
self.onnotificationclick = (event) => {
  if (event.notification?.tag !== REMIND.TAG) return;
  event.notification.close();
  const href = remindUrl(event.notification.data?.url);
  event.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
    const open = list.find((client) => new URL(client.url).pathname === new URL(href).pathname && typeof client.focus === "function");
    return open ? open.focus() : self.clients.openWindow(href);
  }).catch(() => null));
};

// For the tests (tests/offline.test.cjs, tests/reminders.test.cjs).
self.SwKit = { CACHE, PRECACHE, KEPT, isVersioned, assetsOf };
self.SwReminders = { REMIND, remindCounts, remindUrl, remind };
