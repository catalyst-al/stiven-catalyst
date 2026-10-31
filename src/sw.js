// The service worker: the tools work without a connection once they have been opened. Pages are fetched from the
// network first and kept as a copy for when there is none; a file with a version in its address (styles.css?v=…,
// js/tool-kit.js?v=…) never changes, so it is served from the copy and fetched once; a picture or font without one
// is served from the copy and refreshed in the background. Nothing but this site's own files is ever kept, and no
// work of a tool: that stays in localStorage, as before. Pages it was asked to keep (the tools of a role, from
// js/offline.js) are fetched with their stylesheets and scripts, so they open whole, and a versioned file stays as
// long as any kept page names it, so a deploy never leaves a kept page without its files (phase 5A, below).
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

// PHASE5A-START
// Offline copies that survive a deploy (phase 5A). A versioned file (?v=…) is kept as long as any cached page names
// it: the pages' references are kept in an index entry inside this cache (REFS, the page's cache address, query and
// all, → the files its HTML names; a page kept under two addresses is two documents with two entries), completed from
// the cached HTML of any page the index does not know. A page is written in two steps around its index entry: first
// the entry widened to the old and the new files, then the HTML, then the entry narrowed to the new files; so at any
// interruption the entry names at least what the cached HTML names, and the next collection, seeing the entry still
// marked as in progress, reads that one page again and settles it. Collection runs once per page update,
// never on a file request: it lists the cache once and deletes only the versioned files no cached page names (and,
// for files no page names at all, such as a script loaded by another script, the versions older than the one last
// fetched). A page that is already cached is refreshed whole or not at all: the new HTML and every file it names are
// gathered first, the page is written last, so a failed download never replaces a complete copy with a broken one.
// Every job that deletes or writes in several steps runs through one chain, so two refreshes, or a refresh and a
// collection, never interleave; a file request stores its file outside the chain and deletes nothing.
const REFS = "/__sw/refs";
const settings = { graceMs: 1500 };
let chain = Promise.resolve();
const exclusive = (job) => { const run = chain.then(job, job); chain = run.then(() => undefined, () => undefined); return run; };
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const hrefOf = (request) => (typeof request === "string" ? new URL(request, self.location.origin).href : request.url);
const pathOf = (request) => new URL(hrefOf(request)).pathname;
const looksLikePage = (url) => (url.pathname.endsWith("/") || url.pathname.endsWith(".html")) && !url.pathname.startsWith("/__sw/");
const isHtml = (response) => /text\/html/i.test((response && response.headers && response.headers.get("content-type")) || "");

const put = async (cache, request, response) => {
  if (!response || !response.ok || response.type === "opaque") return false;
  await cache.put(request, response.clone());
  return true;
};
// The index: { v: 2, docs: { "https://…/tools/pareto/": [file hrefs], "https://…/tools/pareto/?x=1": […], … },
// pending: { "<page address>": true } (a page whose two-step write was not finished), loose: { "/js/x.js":
// "https://…/js/x.js?v=…" } }. An index of another shape is started afresh: every cached page is read once again.
const readRefs = async (cache) => {
  try {
    const kept = await cache.match(REFS);
    if (kept) {
      const data = await kept.json();
      if (data && data.v === 2 && data.docs && typeof data.docs === "object") return { v: 2, docs: data.docs, pending: data.pending && typeof data.pending === "object" ? data.pending : {}, loose: data.loose && typeof data.loose === "object" ? data.loose : {} };
    }
  } catch { /* a fresh index */ }
  return { v: 2, docs: {}, pending: {}, loose: {} };
};
const writeRefs = (cache, refs) => cache.put(REFS, new Response(JSON.stringify(refs), { headers: { "content-type": "application/json" } }));
// The index completed from the cached pages it does not know (a page stored before this index existed, or a worker
// stopped between two writes) and from the pages whose two-step write was left in progress (read once again, then
// settled), and cleared of pages no longer in the cache.
const reconcile = async (cache, keys) => {
  const refs = await readRefs(cache);
  const present = new Set();
  let changed = false;
  for (const key of keys) {
    const url = new URL(key.url);
    if (!looksLikePage(url)) continue;
    present.add(key.url);
    if (refs.docs[key.url] && !refs.pending[key.url]) continue;
    const response = await cache.match(key);
    if (!response || !isHtml(response)) continue;
    refs.docs[key.url] = assetsOf(await response.text(), key.url);
    delete refs.pending[key.url];
    changed = true;
  }
  for (const href of Object.keys(refs.docs)) if (!present.has(href)) { delete refs.docs[href]; changed = true; }
  for (const href of Object.keys(refs.pending)) if (!present.has(href)) { delete refs.pending[href]; changed = true; }
  if (changed) await writeRefs(cache, refs);
  return refs;
};
// Files of refreshes still in flight: the browser already holds the new HTML and may be fetching them while another
// job collects. Each job holds its own set until it is done.
const pending = new Map();
const hold = (assets) => { const token = {}; pending.set(token, new Set(assets)); return () => pending.delete(token); };
const named = (refs) => {
  const set = new Set();
  for (const list of Object.values(refs.docs)) for (const href of list) set.add(href);
  for (const list of pending.values()) for (const href of list) set.add(href);
  return set;
};
// Collection: the versioned files no cached page names are deleted; a file no page names at all (fetched by a script)
// keeps the version last fetched and loses the older ones.
const collect = async (cache) => {
  const keys = await cache.keys();
  const refs = await reconcile(cache, keys);
  const used = named(refs);
  // A loose record counts only for a path no page names; the records of named paths are dropped.
  const namedPaths = new Set([...used].map((href) => new URL(href).pathname));
  let pruned = false;
  for (const path of Object.keys(refs.loose)) if (namedPaths.has(path)) { delete refs.loose[path]; pruned = true; }
  if (pruned) await writeRefs(cache, refs);
  const latest = new Set(Object.values(refs.loose));
  for (const key of keys) {
    const url = new URL(key.url);
    if (!isVersioned(url) || used.has(key.url) || latest.has(key.url)) continue;
    await cache.delete(key);
  }
};
// A versioned file fetched for a page that is not a cached document (a script's own import): remembered as the
// latest of its path, so collection keeps it and drops its older versions.
const noteLoose = (cache, request) => exclusive(async () => {
  const refs = await readRefs(cache);
  const href = hrefOf(request);
  if (refs.loose[pathOf(request)] === href) return;
  refs.loose[pathOf(request)] = href;
  await writeRefs(cache, refs);
});
// A page from the network with the files it names, and the files gathered (from the copy where the browser already
// stored them, else fetched); the page is written only when every file is there.
const fetchPage = async (href) => {
  const response = await fetch(href);
  if (!response.ok || !isHtml(response)) return null;
  const html = await response.clone().text();
  return { response, html, assets: assetsOf(html, href) };
};
const gather = async (cache, assets) => {
  for (const asset of assets) {
    if (await cache.match(asset)) continue;
    let response;
    try { response = await fetch(asset); } catch { return false; }
    if (!(await put(cache, asset, response))) return false;
  }
  return true;
};
// The page written in two steps around its index entry (see above): the entry widened and marked, the HTML, the
// entry narrowed and unmarked. A failure before the HTML changes nothing; one after it leaves the mark, which the next
// collection settles by reading the page again. Never a cached page whose files the index does not protect.
const storePage = async (cache, request, page) => {
  const href = hrefOf(request);
  const before = await readRefs(cache);
  before.docs[href] = [...new Set([...(before.docs[href] || []), ...page.assets])];
  before.pending[href] = true;
  await writeRefs(cache, before);
  if (!(await put(cache, request, page.response))) return false;
  const after = await readRefs(cache);
  after.docs[href] = page.assets;
  delete after.pending[href];
  await writeRefs(cache, after);
  return true;
};
// True when every file the cached page names is in the copy.
const whole = async (cache, refs, href) => {
  for (const asset of refs.docs[href] || []) if (!(await cache.match(asset))) return false;
  return true;
};

// A navigation: the network first, the copy when there is none. A page not yet in the copy is stored at once (the
// browser fetches its files itself); one already there is refreshed whole in the background, after a moment for the
// browser's own requests to land, and only when every file of the new page is there.
const navigation = async (event, request) => {
  const cache = await caches.open(CACHE);
  let response;
  try { response = await fetch(request); } catch {
    // Offline: the copy stored under this exact address first (a query variant has its own), then any copy of the path.
    return (await cache.match(request)) || (await cache.match(request, { ignoreSearch: true })) || (await cache.match(OFFLINE_PAGE)) || Response.error();
  }
  if (!response.ok) return response;
  // A navigation to something other than a page (a PDF, a sound file) is kept as before: stored as it comes, nothing
  // to gather, nothing to index.
  if (!isHtml(response)) { event.waitUntil(put(cache, request, response.clone()).catch(() => undefined)); return response; }
  const html = await response.clone().text();
  const page = { response: response.clone(), html, assets: assetsOf(html, request.url) };
  const release = hold(page.assets);
  // "Already in the copy" is this exact address (a page kept under another query is another document).
  const job = cache.match(request).then((existing) => (existing
    ? wait(settings.graceMs).then(() => exclusive(async () => { if (await gather(cache, page.assets)) { await storePage(cache, request, page); await collect(cache); } }))
    : exclusive(async () => { await storePage(cache, request, page); await collect(cache); })));
  event.waitUntil(job.catch(() => undefined).then(release, release));
  return response;
};
// A versioned file: from the copy, else fetched and stored; the loose record is written within the event's lifetime.
const cacheFirst = async (event, request) => {
  const cache = await caches.open(CACHE);
  const kept = await cache.match(request);
  if (kept) return kept;
  const response = await fetch(request);
  if (await put(cache, request, response)) event.waitUntil(noteLoose(cache, request).catch(() => undefined));
  return response;
};
const staleWhileRevalidate = async (request) => {
  const cache = await caches.open(CACHE);
  const kept = await cache.match(request);
  const refresh = fetch(request).then(async (response) => { await put(cache, request, response); return response; }).catch(() => null);
  return kept || (await refresh) || Response.error();
};
// The pages a tool page asks to keep (itself, the other tools of its role, the Tools page): one not in the copy is
// fetched with its files; one in the copy but incomplete (a file it names is missing) is fetched again whole, from
// fresh HTML, never through an old file address; one in the copy and complete is left as it is, newer build or not,
// since it still opens whole offline and is refreshed when it is visited online.
// A page kept under several addresses (its plain address and query variants) is several documents: each incomplete one
// is fetched again by its own address.
const keep = (urls) => exclusive(async () => {
  const cache = await caches.open(CACHE);
  let keys = null;
  let refs = null;
  for (const href of urls.slice(0, 40)) {
    try {
      const url = new URL(href);
      if (url.origin !== self.location.origin) continue;
      if (!keys) { keys = await cache.keys(); refs = await reconcile(cache, keys); }
      const variants = keys.map((key) => key.url).filter((other) => new URL(other).pathname === url.pathname && looksLikePage(new URL(other)));
      const targets = variants.length ? variants.filter((other) => !refs.docs[other]) : [url.href];
      for (const other of variants) if (refs.docs[other] && !(await whole(cache, refs, other))) targets.push(other);
      for (const target of targets) {
        const page = await fetchPage(target);
        if (!page || !(await gather(cache, page.assets))) continue;
        await storePage(cache, target, page);
        refs.docs[target] = page.assets;
        delete refs.pending[target];
      }
    } catch { /* next page */ }
  }
  await collect(cache);
});

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (event) => {
  // Other caches go; this one is reconciled (pages indexed, files no page names collected) and kept whole.
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
    .then(() => exclusive(async () => collect(await caches.open(CACHE))).catch(() => undefined))
    .then(() => self.clients.claim()));
});
self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || url.pathname === "/sw.js" || url.pathname.startsWith("/__sw/")) return;
  if (request.mode === "navigate" || request.destination === "document") {
    event.respondWith(navigation(event, request));
  } else if (KEPT.test(url.pathname)) {
    event.respondWith(isVersioned(url) ? cacheFirst(event, request) : staleWhileRevalidate(request));
  }
});
// The addresses in a "keep" message are each checked against this origin; the sender is a page of this origin by
// construction (a worker only receives messages from its own clients), so there is no event.origin check.
self.addEventListener("message", (event) => {
  const data = event.data;
  if (!data || data.type !== "keep" || !Array.isArray(data.urls)) return;
  event.waitUntil(keep(data.urls).catch(() => undefined));
});
// PHASE5A-END

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
self.SwKit = { CACHE, PRECACHE, KEPT, REFS, isVersioned, assetsOf, settings, idle: () => chain, readRefs, collect, keep };
self.SwReminders = { REMIND, remindCounts, remindUrl, remind };
