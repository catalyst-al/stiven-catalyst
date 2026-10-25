// Reminders that stay on this device. The Action Tracker offers "Remind me of due actions on this device"
// ([data-reminders-optin] in partials/action-tracker.njk); this script is loaded with the work box on every tool page
// and the Tools page. Once switched on, once a day, the first time a page with it is opened, it shows one notification
// with how many open actions are overdue and due today and the first three titles; where notifications are blocked or
// not available, the same as a note at the top of the page. A click opens the Action Tracker. The browser is asked for
// permission only on that click, never by itself.
//
// The list is read from localStorage "sc-actions" (js/actions-store.js). What the reminders keep is in IndexedDB
// "sc-reminders", store "kv", on this device only (so no saved work file, restore point or team sync carries it):
//   { id: "state", on, since, last: "YYYY-MM-DD" (the day one was shown), lang, texts: { en|de|sq: words } }
//   { id: "summary", version: 1, updated, lang, url, byDue: { "YYYY-MM-DD": open actions due that day },
//     first: [{ title, due }] }   the three open actions due soonest
// The summary is all the service worker (sw.js) needs to remind without a page open, through Periodic Background Sync
// where the browser offers it (an installed app in Chromium): from the counts per day it counts overdue and due today
// on any later day, and the three due soonest are the first three of those. Nothing is sent anywhere. Where IndexedDB
// is missing (some private windows) there are no reminders and the opt-in says so.
(() => {
  const DB = "sc-reminders";
  const STORE = "kv";
  const TAG = "sc-reminders";
  const ACTIONS_KEY = "sc-actions";
  const DAY_MS = 24 * 60 * 60 * 1000;
  const TITLE_MAX = 80;
  const FIRST = 3;
  const ICON = "/icons/icon-192.png";

  // ---- Pure logic (tests/reminders.test.cjs) ----
  const pad = (n) => String(n).padStart(2, "0");
  // The visitor's own calendar day, as the Action Tracker counts overdue.
  const localDay = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  const isDay = (value) => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
  const fill = (template, vars = {}) => String(template || "").replace(/\{(\w+)\}/g, (match, name) => (name in vars ? vars[name] : match));
  // Open is "open" or "doing"; the store reads any other unknown status as open too, so only done and verified are closed.
  const isOpen = (row) => row.status !== "done" && row.status !== "verified";
  const readRows = (storage) => {
    try {
      const saved = JSON.parse(storage.getItem(ACTIONS_KEY));
      const rows = saved && typeof saved === "object" && Array.isArray(saved.rows) ? saved.rows : Array.isArray(saved) ? saved : [];
      return rows.filter((row) => row && typeof row === "object" && !Array.isArray(row));
    } catch { return []; }
  };
  // Open actions with a title and a due date, the soonest first, then the older, as the tracker sorts them.
  const dated = (rows) => rows
    .filter((row) => isOpen(row) && typeof row.title === "string" && row.title.trim() && isDay(row.due))
    .map((row) => ({ title: row.title.trim().slice(0, TITLE_MAX), due: row.due, created: typeof row.created === "string" ? row.created : "" }))
    .sort((a, b) => a.due.localeCompare(b.due) || a.created.localeCompare(b.created));
  // Overdue: open and due before today. Due today: open and due today. The titles: the first three of both, soonest first.
  const dueNow = (rows, today) => {
    const list = dated(rows).filter((a) => a.due <= today);
    return { overdue: list.filter((a) => a.due < today).length, today: list.filter((a) => a.due === today).length, titles: list.slice(0, FIRST).map((a) => a.title) };
  };
  // What the service worker reads: counts per due day and the three due soonest, nothing else of the list.
  const summarize = (rows, now = new Date(), { lang = "en", url = "" } = {}) => {
    const list = dated(rows);
    const byDue = {};
    list.forEach((a) => { byDue[a.due] = (byDue[a.due] || 0) + 1; });
    return { id: "summary", version: 1, updated: now.toISOString(), lang, url, byDue, first: list.slice(0, FIRST).map(({ title, due }) => ({ title, due })) };
  };
  // The same counts from a summary, on any day after it was made (sw.js does exactly this).
  const fromSummary = (summary, today) => {
    let overdue = 0;
    let due = 0;
    Object.entries(summary?.byDue || {}).forEach(([day, n]) => {
      if (!isDay(day) || !Number.isInteger(n) || n < 1) return;
      if (day < today) overdue += n;
      else if (day === today) due += n;
    });
    const titles = (Array.isArray(summary?.first) ? summary.first : []).filter((a) => a && typeof a.title === "string" && isDay(a.due) && a.due <= today).slice(0, FIRST).map((a) => a.title);
    return { overdue, today: due, titles };
  };
  // At most one a day: switched on, and not shown yet on this calendar day.
  const shouldShow = (state, today) => Boolean(state && state.on === true) && state.last !== today;
  const message = (due, words) => {
    const counts = fill(words.counts, { overdue: due.overdue, today: due.today });
    const rest = due.overdue + due.today - due.titles.length;
    const more = rest > 0 ? fill(words.more, { n: rest }) : "";
    return { title: words.title, counts, titles: due.titles, more, body: [counts, ...due.titles.map((title) => `• ${title}`), more].filter(Boolean).join("\n") };
  };
  // The words in the page's language, else in the language the reminders were switched on in.
  const wordsFor = (state, lang) => {
    const texts = state && typeof state.texts === "object" && state.texts ? state.texts : {};
    const sound = (words) => words && ["title", "counts", "more", "open", "close"].every((name) => typeof words[name] === "string");
    return [texts[lang], texts[state?.lang], ...Object.values(texts)].find(sound) || null;
  };
  // What this browser can do. permission: "granted", "denied", "default" or "unsupported".
  const detect = (w) => {
    const has = (fn) => { try { return Boolean(fn()); } catch { return false; } };
    let permission = "unsupported";
    try { if (typeof w.Notification === "function") permission = w.Notification.permission || "default"; } catch { permission = "unsupported"; }
    const serviceWorker = has(() => w.navigator && "serviceWorker" in w.navigator);
    return {
      idb: has(() => w.indexedDB),
      permission,
      notify: permission === "granted",
      serviceWorker,
      periodic: serviceWorker && has(() => typeof w.ServiceWorkerRegistration === "function" && "periodicSync" in w.ServiceWorkerRegistration.prototype),
    };
  };
  const langOf = (path) => (String(path).match(/^\/(de|sq)(?=\/)/) || [])[1] || "en";
  const trackerUrl = (origin, lang) => new URL(`${lang === "en" ? "" : `/${lang}`}/tools/action-tracker/`, origin).href;

  // ---- The store: one small IndexedDB database, opened only to read unless something is to be written ----
  const openDb = (idb, create) => new Promise((resolve) => {
    if (!idb) { resolve(null); return; }
    let request;
    try { request = idb.open(DB, 1); } catch { resolve(null); return; }
    request.onupgradeneeded = (event) => {
      // Only reading, and there is no database yet: none is made (the upgrade is called off).
      if (!create && !(event.oldVersion > 0)) { try { request.transaction.abort(); } catch { /* resolves null below */ } return; }
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: "id" });
    };
    request.onsuccess = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) { db.close(); resolve(null); return; }
      resolve(db);
    };
    request.onerror = () => resolve(null);
    request.onblocked = () => resolve(null);
  });
  // The request's result, or undefined when anything failed: a reminder is never worth an error on a tool page.
  const withStore = async (idb, mode, create, run) => {
    const db = await openDb(idb, create);
    if (!db) return undefined;
    try {
      return await new Promise((resolve) => {
        const tx = db.transaction(STORE, mode);
        const request = run(tx.objectStore(STORE));
        let result;
        request.onsuccess = () => { result = request.result; };
        tx.oncomplete = () => resolve(result);
        tx.onerror = () => resolve(undefined);
        tx.onabort = () => resolve(undefined);
      });
    } catch { return undefined; } finally { db.close(); }
  };
  const store = (idb) => ({
    get: (id) => withStore(idb, "readonly", false, (s) => s.get(id)),
    put: (record) => withStore(idb, "readwrite", true, (s) => s.put(record)),
    remove: (id) => withStore(idb, "readwrite", false, (s) => s.delete(id)).then(() => true),
  });

  window.RemindersMath = { DB, STORE, TAG, ACTIONS_KEY, localDay, readRows, dated, dueNow, summarize, fromSummary, shouldShow, message, wordsFor, detect, langOf, trackerUrl, store };
  const api = { ready: Promise.resolve(null), last: Promise.resolve(null) };
  window.Reminders = api;

  // ---- On the page ----
  const storage = (() => { try { const probe = window.localStorage; probe.length; return probe; } catch { return null; } })();
  const idb = (() => { try { return window.indexedDB || null; } catch { return null; } })();
  const db = store(idb);
  const lang = langOf(location.pathname);
  const url = trackerUrl(location.origin, lang);
  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const mirror = (now = new Date()) => (storage ? db.put(summarize(readRows(storage), now, { lang, url })) : Promise.resolve(undefined));

  const registration = async () => {
    try { return "serviceWorker" in navigator ? (await navigator.serviceWorker.getRegistration()) || null : null; } catch { return null; }
  };
  // A daily wake-up of the service worker, where the browser has Periodic Background Sync and allows it (an installed app).
  const periodic = async (on) => {
    const reg = await registration();
    if (!reg || !reg.periodicSync) return false;
    try {
      if (!on) { await reg.periodicSync.unregister(TAG); return false; }
      if (navigator.permissions?.query) {
        const allowed = await navigator.permissions.query({ name: "periodic-background-sync" });
        if (allowed.state !== "granted") return false;
      }
      await reg.periodicSync.register(TAG, { minInterval: DAY_MS });
      return true;
    } catch { return false; }
  };
  const hasPeriodic = async () => {
    const reg = await registration();
    try { return Boolean(reg?.periodicSync && (await reg.periodicSync.getTags()).includes(TAG)); } catch { return false; }
  };

  // A notification through the service worker where there is one (Android shows only those), else from the page.
  const notify = async (msg) => {
    if (detect(window).permission !== "granted") return false;
    const options = { body: msg.body, tag: TAG, data: { url }, icon: ICON, lang };
    const reg = await registration();
    if (reg && typeof reg.showNotification === "function") {
      try { await reg.showNotification(msg.title, options); return true; } catch { /* from the page instead */ }
    }
    try {
      const note = new window.Notification(msg.title, options);
      note.onclick = () => { try { window.focus(); } catch { /* another tab */ } note.close(); location.assign(url); };
      return true;
    } catch { return false; }
  };
  const banner = (msg, words) => {
    document.querySelector("[data-reminders-banner]")?.remove();
    const wrap = el("div", "shell rm-wrap");
    wrap.dataset.remindersBanner = "";
    const box = el("div", "rm-banner");
    box.setAttribute("role", "status");
    const body = el("div", "rm-text");
    const line = el("p");
    line.append(el("strong", null, msg.title), ` ${msg.counts}`);
    body.append(line);
    if (msg.titles.length) {
      const list = el("ul", "rm-list");
      msg.titles.forEach((title) => list.append(el("li", null, title)));
      if (msg.more) list.append(el("li", null, msg.more));
      body.append(list);
    }
    const actions = el("div", "rm-actions");
    const open = el("a", "button-secondary", words.open);
    open.href = url;
    const close = el("button", "button-ghost", words.close);
    close.type = "button";
    close.addEventListener("click", () => wrap.remove());
    actions.append(open, close);
    box.append(body, actions);
    wrap.append(box);
    (document.querySelector("main") || document.body).prepend(wrap);
    return wrap;
  };
  // The reminder of the day, if one is due: { how: "notification" | "banner", overdue, today, titles } or null.
  const remindNow = async (now = new Date()) => {
    if (!storage) return null;
    const today = localDay(now);
    const state = await db.get("state");
    if (!shouldShow(state, today)) return null;
    const due = dueNow(readRows(storage), today);
    if (!due.overdue && !due.today) return null;
    const words = wordsFor(state, lang);
    if (!words) return null;
    // The day is claimed before anything shows: two tabs opened together, or the service worker, show it once.
    if ((await db.put({ ...state, last: today })) === undefined) return null;
    const msg = message(due, words);
    if (await notify(msg)) return { how: "notification", ...due };
    banner(msg, words);
    return { how: "banner", ...due };
  };

  // The summary follows the list: a change here, in another tab, or from the team.
  let listening = false;
  const listen = () => {
    if (listening) return;
    listening = true;
    let timer = null;
    const soon = () => {
      clearTimeout(timer);
      timer = setTimeout(() => { db.get("state").then((state) => (state?.on ? mirror() : null)); }, 1000);
    };
    window.addEventListener("actions:changed", soon);
    window.addEventListener("storage", (event) => { if (!event.key || event.key === ACTIONS_KEY) soon(); });
  };

  // ---- The opt-in in the Action Tracker ----
  const askPermission = () => {
    try {
      const N = window.Notification;
      if (typeof N !== "function") return Promise.resolve("unsupported");
      if (N.permission !== "default") return Promise.resolve(N.permission);
      const asked = N.requestPermission();
      return asked && typeof asked.then === "function" ? asked.catch(() => N.permission) : Promise.resolve(N.permission);
    } catch { return Promise.resolve("unsupported"); }
  };
  const wireOptin = async (box, initial) => {
    let text = {};
    try { text = JSON.parse(box.dataset.text || "{}"); } catch { text = {}; }
    const button = box.querySelector("[data-reminders-toggle]");
    const status = box.querySelector("[data-reminders-status]");
    box.hidden = false;
    if (!detect(window).idb || !storage) {
      button.disabled = true;
      status.textContent = text.unavailable || "";
      return initial;
    }
    let state = initial || null;
    const words = text.reminder && typeof text.reminder === "object" ? text.reminder : null;
    // This language's words, kept for the reminders on the other pages and in the service worker.
    if (state?.on && words) {
      state = { ...state, lang, texts: { ...(state.texts || {}), [lang]: words } };
      await db.put(state);
    }
    const show = async (note) => {
      const on = Boolean(state?.on);
      button.textContent = on ? text.off : text.on;
      button.setAttribute("aria-pressed", String(on));
      if (note !== undefined) { status.textContent = note; return; }
      if (!on) { status.textContent = ""; return; }
      const granted = detect(window).permission === "granted";
      const background = granted && (await hasPeriodic());
      status.textContent = [granted ? text.onNotify : text.onBanner, background ? text.background : ""].filter(Boolean).join(" ");
    };
    button.addEventListener("click", () => {
      if (state?.on) {
        api.last = (async () => {
          state = { ...state, on: false, last: "" };
          await db.put(state);
          await db.remove("summary");
          await periodic(false);
          await show(text.offDone);
          return state;
        })();
        return;
      }
      // The one place the browser is asked: this click, before anything else, while it still counts as one.
      const asked = askPermission();
      api.last = (async () => {
        const permission = await asked;
        state = { id: "state", on: true, since: new Date().toISOString(), last: "", lang, texts: { ...(state?.texts || {}), ...(words ? { [lang]: words } : {}) } };
        if ((await db.put(state)) === undefined) {
          state = { ...state, on: false };
          await show(text.unavailable || "");
          return state;
        }
        await mirror();
        if (permission === "granted") await periodic(true);
        listen();
        await show();
        return state;
      })();
    });
    await show();
    return state;
  };

  const start = async () => {
    const box = document.querySelector("[data-reminders-optin]");
    let state = await db.get("state");
    if (box) state = await wireOptin(box, state);
    if (!state?.on || !storage) return null;
    await mirror();
    listen();
    // Registered again on each visit: the service worker may have come after the reminders were switched on.
    if (detect(window).permission === "granted") periodic(true);
    return remindNow();
  };
  api.ready = Promise.resolve().then(start).catch(() => null);
  api.remindNow = remindNow;
})();
