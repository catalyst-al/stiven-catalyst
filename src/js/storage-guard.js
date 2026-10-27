// Work kept in the browser, made harder to lose (the box "All your work in one file", partials/work-backup.njk).
// The tools keep reading and writing their "sc-" keys in localStorage as before; this only watches over them:
// - it asks the browser to keep the site's data when space runs low (navigator.storage.persist), once there is work;
// - it keeps restore points on this device: IndexedDB database "sc-restore", store "points", one record per point
//   { id, created, reason, items, bytes }, items as in the Work Backup file. One a day at most (the first visit of a
//   tool or the Tools page that day), one before a Work Backup file replaces anything, one before a restore, one
//   before team sync (js/team-sync.js) writes the team's work, and one whenever the visitor asks. The last 14 daily,
//   the last 5 before a team sync and the last 5 others are kept;
// - it says how much space the work takes, and names the largest tools when localStorage is nearly full.
// Nothing is sent anywhere. Without IndexedDB (some private windows) there are no restore points and the box works
// as it did before.
(() => {
  const DB = "sc-restore";
  const STORE = "points";
  const KEEP = { daily: 14, sync: 5, recent: 6, other: 5 };
  // A point while working, every so often when the work changed: a slip of the hand is at most that far back.
  const RECENT_MS = 15 * 60 * 1000;
  // Most browsers give a site about 5 MB of localStorage (counted in characters); past 4 MB a tool may soon fail to save.
  const MB = 1024 * 1024;
  const NEARLY_FULL = 4 * MB;
  const REASONS = ["daily", "before-open", "before-restore", "manual", "before-sync", "recent"];

  // ---- Pure logic (tests/storage-guard.test.cjs) ----
  const pad = (n) => String(n).padStart(2, "0");
  const localDay = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  // The id sorts by time and carries the reason, so the count, the latest and the pruning need only the keys,
  // never the snapshots themselves (a few megabytes each at most, but nineteen of them on a phone).
  const pointId = (created, reason, n = 0) => `${created} ${reason}${n ? ` ${n}` : ""}`;
  const parseId = (id) => {
    const [created = "", reason = ""] = String(id).split(" ");
    return { id: String(id), created, reason };
  };
  const newestFirst = (a, b) => String(b.id).localeCompare(String(a.id));
  // The ids to drop: all but the newest `daily` daily points, the newest `sync` before a team sync and the newest
  // `recent` made while working (both may come often, so they never push out a point made by hand) and the newest
  // `other` of the rest.
  const prune = (points, keep = KEEP) => {
    const sorted = [...points].sort(newestFirst);
    const daily = sorted.filter((p) => p.reason === "daily");
    const sync = sorted.filter((p) => p.reason === "before-sync");
    const recent = sorted.filter((p) => p.reason === "recent");
    const other = sorted.filter((p) => !["daily", "before-sync", "recent"].includes(p.reason));
    return [...daily.slice(keep.daily), ...sync.slice(keep.sync ?? keep.other), ...recent.slice(keep.recent ?? keep.other), ...other.slice(keep.other)].map((p) => p.id);
  };
  // A daily point is due when there is none from today (the visitor's own calendar day).
  const needsDaily = (points, now = new Date()) => !points.some((p) => p.reason === "daily" && !Number.isNaN(new Date(p.created).getTime()) && localDay(new Date(p.created)) === localDay(now));
  // What a point keeps: every key that is work, as the Work Backup file does.
  const snapshot = (storage, isWork) => {
    const items = {};
    if (!storage) return items;
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (isWork(key)) {
        const value = storage.getItem(key);
        if (typeof value === "string") items[key] = value;
      }
    }
    return items;
  };
  // Characters, the measure browsers count localStorage in.
  const sizeOf = (key, value) => String(key).length + String(value ?? "").length;
  const itemsBytes = (items) => Object.entries(items || {}).reduce((sum, [key, value]) => sum + sizeOf(key, value), 0);
  const storageBytes = (storage) => {
    let total = 0;
    if (!storage) return total;
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      total += sizeOf(key, storage.getItem(key));
    }
    return total;
  };
  // The work per tool, largest first: [{ slug, bytes, keys }].
  const byTool = (items, toolSlug) => {
    const tools = new Map();
    Object.entries(items || {}).forEach(([key, value]) => {
      const slug = toolSlug(key);
      const tool = tools.get(slug) || { slug, bytes: 0, keys: [] };
      tool.bytes += sizeOf(key, value);
      tool.keys.push(key);
      tools.set(slug, tool);
    });
    return [...tools.values()].sort((a, b) => b.bytes - a.bytes || a.slug.localeCompare(b.slug));
  };
  const largest = (items, toolSlug, n = 3) => byTool(items, toolSlug).slice(0, n);
  const nearlyFull = (bytes) => bytes >= NEARLY_FULL;
  const formatBytes = (bytes, lang = "en") => {
    const n = Math.max(0, Number(bytes) || 0);
    const text = n >= 1024 * MB ? `${(n / 1024 / MB).toFixed(1)} GB`
      : n >= MB / 10 ? `${(n / MB).toFixed(1)} MB`
        : `${Math.max(n ? 1 : 0, Math.round(n / 1024))} KB`;
    return lang === "en" ? text : text.replace(".", ",");
  };
  // All or nothing, as when a file is opened: when the browser runs out of space halfway, the keys already written
  // get their old value back, so the device never holds half of one state and half of the other.
  const replaceItems = (storage, items) => {
    const keys = Object.keys(items);
    const before = new Map(keys.map((key) => [key, storage.getItem(key)]));
    const written = [];
    for (const key of keys) {
      try {
        storage.setItem(key, items[key]);
        written.push(key);
      } catch {
        written.forEach((done) => {
          try {
            if (before.get(done) === null) storage.removeItem(done);
            else storage.setItem(done, before.get(done));
          } catch { /* the old value was there before, so it fits again */ }
        });
        return false;
      }
    }
    return true;
  };
  // A list of items read like a localStorage, so WorkBackup.makeBackup writes the file of a restore point.
  const asStorage = (items) => {
    const keys = Object.keys(items);
    return { length: keys.length, key: (i) => keys[i] ?? null, getItem: (key) => (key in items ? items[key] : null) };
  };
  window.StorageGuardMath = { KEEP, RECENT_MS, NEARLY_FULL, REASONS, localDay, pointId, parseId, prune, needsDaily, snapshot, sizeOf, itemsBytes, storageBytes, byTool, largest, nearlyFull, formatBytes, replaceItems, asStorage };

  // ---- The store ----
  const storage = (() => {
    try {
      const probe = window.localStorage;
      probe.length;
      return probe;
    } catch {
      return null;
    }
  })();
  const isWork = (key) => (window.WorkBackup ? window.WorkBackup.isWork(key) : typeof key === "string" && key.startsWith("sc-") && !["sc-theme", "sc-print-guide-hidden", "sc-team", "sc-team-state", "sc-locked", "sc-lock-idle"].includes(key));
  const toolSlug = (key) => (window.WorkBackup ? window.WorkBackup.toolSlug(key) : String(key).replace(/^sc-/, ""));
  const work = () => snapshot(storage, isWork);

  const supported = () => {
    try { return typeof window.indexedDB !== "undefined" && window.indexedDB !== null; } catch { return false; }
  };
  const done = (request) => new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  let opening = null;
  const open = () => {
    if (!opening) {
      opening = new Promise((resolve, reject) => {
        if (!supported()) { reject(new Error("IndexedDB is not available")); return; }
        const request = window.indexedDB.open(DB, 1);
        request.onupgradeneeded = () => {
          const db = request.result;
          if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: "id" });
        };
        request.onsuccess = () => {
          const db = request.result;
          db.onversionchange = () => { db.close(); opening = null; };
          resolve(db);
        };
        request.onerror = () => reject(request.error);
        request.onblocked = () => reject(new Error("The restore points are busy in another tab"));
      }).catch((error) => { opening = null; throw error; });
    }
    return opening;
  };
  const transact = async (mode, run) => {
    const db = await open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, mode);
      let result;
      Promise.resolve(run(tx.objectStore(STORE))).then((value) => { result = value; }, reject);
      tx.oncomplete = () => resolve(result);
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error || new Error("The restore point was not saved"));
    });
  };
  const allIds = (store) => (typeof store.getAllKeys === "function"
    ? done(store.getAllKeys())
    : done(store.getAll()).then((records) => (records || []).map((record) => record.id)));
  // The points without their snapshots, newest first.
  const summaries = () => transact("readonly", (store) => allIds(store)).then((ids) => (ids || []).map(parseId).sort(newestFirst));
  const points = () => transact("readonly", (store) => done(store.getAll())).then((records) => (records || []).sort(newestFirst));
  const get = (id) => transact("readonly", (store) => done(store.get(id))).then((record) => record || null);
  // A point of the work as it is now; null when there is no work to keep. Older points beyond the limits go in the
  // same transaction, so the store never grows past them.
  const makePoint = async (reason, items = work(), now = new Date()) => {
    if (!REASONS.includes(reason) || !Object.keys(items).length) return null;
    const created = now.toISOString();
    return transact("readwrite", async (store) => {
      const ids = new Set(await allIds(store));
      let n = 0;
      while (ids.has(pointId(created, reason, n))) n += 1;
      const record = { id: pointId(created, reason, n), created, reason, items, bytes: itemsBytes(items) };
      await done(store.put(record));
      ids.add(record.id);
      for (const id of prune([...ids].map(parseId))) await done(store.delete(id));
      return record;
    });
  };
  const withTimeout = (promise, ms) => Promise.race([promise, new Promise((resolve) => setTimeout(() => resolve(null), ms))]);

  // Back to a point: first a point of the work as it is now (so the restore can be undone), then exactly the keys
  // of the point are replaced, all or nothing. "restored", "full", "gone" or "failed".
  const restorePoint = async (id) => {
    if (!storage) return "failed";
    const point = await get(id).catch(() => null);
    if (!point || !point.items || typeof point.items !== "object") return "gone";
    const items = Object.fromEntries(Object.entries(point.items).filter(([key, value]) => isWork(key) && typeof value === "string"));
    if (!Object.keys(items).length) return "gone";
    try {
      await makePoint("before-restore");
    } catch {
      return "failed";
    }
    return replaceItems(storage, items) ? "restored" : "full";
  };

  // Ask once a session that the browser keeps the data; true, false, or null where the browser does not say.
  const keep = async (hasWork) => {
    const api = navigator.storage;
    if (!api || typeof api.persisted !== "function") return null;
    let kept = false;
    try { kept = await api.persisted(); } catch { return null; }
    if (kept || !hasWork || typeof api.persist !== "function") return Boolean(kept);
    let asked = false;
    try { asked = sessionStorage.getItem("sc-persist-asked") === "1"; sessionStorage.setItem("sc-persist-asked", "1"); } catch { /* ask anyway */ }
    if (asked) return false;
    try { return Boolean(await api.persist()); } catch { return false; }
  };

  let started;
  const api = { DB, STORE, supported, summaries, points, get, makePoint, restorePoint, keep, work, ready: new Promise((resolve) => { started = resolve; }) };
  window.StorageGuard = api;

  // ---- The box ----
  const start = async () => {
    const box = document.querySelector("[data-work-backup]");
    const root = box?.querySelector("[data-storage-guard]");
    // A file about to replace work: a point first. Waited for at most two seconds, so a slow store never stops it.
    if (window.WorkBackup) {
      window.WorkBackup.beforeReplace = () => (supported() && storage
        ? withTimeout(makePoint("before-open").catch(() => null), 2000).then((record) => { refresh(); return record; })
        : Promise.resolve(null));
    }
    if (!root || !storage) return;
    const text = JSON.parse(root.dataset.text || "{}");
    const wbText = (() => { try { return JSON.parse(box.dataset.text || "{}"); } catch { return {}; } })();
    const names = (() => { try { return JSON.parse(document.getElementById("work-backup-names")?.textContent || "{}"); } catch { return {}; } })();
    const lang = document.documentElement.lang || "en";
    const fill = (template, vars) => String(template || "").replace(/\{(\w+)\}/g, (match, name) => (name in vars ? vars[name] : match));
    const $ = (selector) => root.querySelector(selector);
    const status = box.querySelector("[data-work-status]");
    const say = (message) => { if (status) status.textContent = message; };
    const toolNames = (keys) => [...new Set(keys.map((key) => {
      const slug = toolSlug(key);
      return slug === "coaching-v1" ? wbText.coaching || slug : names[slug] || slug;
    }))].sort((a, b) => a.localeCompare(b));
    const when = (iso, relative = true) => {
      const date = new Date(iso);
      if (Number.isNaN(date.getTime())) return "?";
      const time = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
      const day = localDay(date);
      const now = new Date();
      const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
      if (relative && day === localDay(now)) return fill(text.today, { time });
      if (relative && day === localDay(yesterday)) return fill(text.yesterday, { time });
      const shown = lang === "en" ? day : `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`;
      return `${shown} ${time}`;
    };
    const download = (items, created, suffix) => {
      const date = new Date(created);
      const backup = window.WorkBackup.makeBackup(asStorage(items), Number.isNaN(date.getTime()) ? new Date() : date);
      const link = document.createElement("a");
      link.href = URL.createObjectURL(new Blob([JSON.stringify(backup)], { type: "application/json" }));
      link.download = `stiven-catalyst-${localDay(Number.isNaN(date.getTime()) ? new Date() : date)}${suffix}.json`;
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(link.href), 1000);
      say(fill(wbText.saved || "{file}", { file: link.download }));
    };

    // Space: the work in localStorage, and what the browser says of the rest.
    const showSpace = async (items) => {
      const workBytes = itemsBytes(items);
      const total = storageBytes(storage);
      const space = $("[data-sg-space]");
      let line = workBytes ? fill(text.spaceWork, { work: formatBytes(workBytes, lang) }) : "";
      try {
        const estimate = await navigator.storage?.estimate?.();
        if (line && estimate && estimate.quota) line += ` ${fill(text.spaceDevice, { usage: formatBytes(estimate.usage || 0, lang), quota: formatBytes(estimate.quota, lang) })}`;
      } catch { /* the browser does not say */ }
      space.textContent = line;
      space.hidden = !line;
      const full = $("[data-sg-full]");
      full.hidden = !nearlyFull(total);
      if (full.hidden) return;
      const top = largest(items, toolSlug);
      $("[data-sg-full-text]").textContent = fill(text.nearlyFull, {
        work: formatBytes(total, lang),
        tools: top.map((tool) => `${toolNames(tool.keys)[0]} ${formatBytes(tool.bytes, lang)}`).join(", "),
      });
      full.dataset.keys = JSON.stringify(top.flatMap((tool) => tool.keys));
    };
    $("[data-sg-full-save]").addEventListener("click", () => {
      const keys = JSON.parse($("[data-sg-full]").dataset.keys || "[]");
      const items = Object.fromEntries(Object.entries(work()).filter(([key]) => keys.includes(key)));
      if (Object.keys(items).length) download(items, new Date().toISOString(), "-largest");
    });

    const showKeep = (kept, hasWork) => {
      const note = $("[data-sg-keep]");
      note.hidden = kept === null || !hasWork;
      note.textContent = kept ? text.kept : text.mayClear;
      note.classList.toggle("is-kept", Boolean(kept));
    };

    const list = $("[data-sg-list]");
    const toggle = $("[data-sg-toggle]");
    // The point team sync makes is named by its own section (partials/team-sync.njk), shown only where sync is on.
    const syncText = (() => { try { return JSON.parse(box.querySelector("[data-team-sync]")?.dataset.text || "{}"); } catch { return {}; } })();
    const reasonLabel = (reason) => (text.reasons || {})[reason] || (syncText.reasons || {})[reason] || reason;
    const showList = async () => {
      const records = await points().catch(() => []);
      list.replaceChildren(...records.map((point) => {
        const item = document.createElement("li");
        item.className = "sg-point";
        const head = document.createElement("p");
        head.className = "sg-point-head";
        const date = document.createElement("strong");
        date.textContent = when(point.created);
        head.append(date, ` · ${reasonLabel(point.reason)} · ${formatBytes(point.bytes ?? itemsBytes(point.items), lang)}`);
        const tools = document.createElement("p");
        tools.className = "form-note sg-point-tools";
        tools.textContent = toolNames(Object.keys(point.items || {})).join(", ");
        const actions = document.createElement("div");
        actions.className = "sg-point-actions";
        const restore = document.createElement("button");
        restore.type = "button";
        restore.className = "button-secondary";
        restore.textContent = text.restore;
        restore.addEventListener("click", async () => {
          if (!window.confirm(fill(text.restoreConfirm, { date: when(point.created, false), tools: toolNames(Object.keys(point.items || {})).join(", ") }))) return;
          restore.disabled = true;
          const result = await restorePoint(point.id);
          restore.disabled = false;
          say(text[result] || text.failed);
          if (result === "restored") setTimeout(() => window.location.reload(), 900);
          else refresh();
        });
        const save = document.createElement("button");
        save.type = "button";
        save.className = "button-ghost";
        save.textContent = text.download;
        save.addEventListener("click", () => download(point.items || {}, point.created, `-${String(point.created).slice(11, 16).replace(":", "")}`));
        actions.append(restore, save);
        item.append(head, tools, actions);
        return item;
      }));
    };
    toggle.addEventListener("click", async () => {
      const opening = list.hidden;
      if (opening) await showList();
      list.hidden = !opening;
      toggle.setAttribute("aria-expanded", String(opening));
      toggle.textContent = opening ? text.hide : text.show;
    });
    $("[data-sg-make]").addEventListener("click", async () => {
      const items = work();
      if (!Object.keys(items).length) { say(wbText.nothing || ""); return; }
      const record = await makePoint("manual", items).catch(() => null);
      say(record ? fill(text.made, { tools: toolNames(Object.keys(items)).join(", ") }) : text.failed);
      refresh();
    });

    const showPoints = async () => {
      const section = $("[data-sg-points]");
      if (!supported()) { section.hidden = true; return; }
      const known = await summaries().catch(() => null);
      if (!known) { section.hidden = true; return; }
      section.hidden = false;
      $("[data-sg-points-text]").textContent = known.length ? fill(text.points, { n: known.length, when: when(known[0].created) }) : text.noPoints;
      toggle.hidden = !known.length;
      if (!known.length) {
        list.hidden = true;
        toggle.setAttribute("aria-expanded", "false");
        toggle.textContent = text.show;
      }
      if (!list.hidden) await showList();
    };

    let kept = null;
    refresh = async () => {
      const items = work();
      const hasWork = Object.keys(items).length > 0;
      showKeep(kept, hasWork);
      await Promise.all([showSpace(items), showPoints()]);
      // Nothing to say (no work, no restore points in this browser): the box stays as it was.
      root.hidden = ![...root.children].some((node) => !node.hidden);
    };

    const items = work();
    const hasWork = Object.keys(items).length > 0;
    kept = await keep(hasWork).catch(() => null);
    if (hasWork && supported()) {
      const known = await summaries().catch(() => null);
      if (known && needsDaily(known)) await makePoint("daily", items).catch(() => null);
    }
    await refresh();
    window.addEventListener("storage", () => { refresh(); });
    // While the page stays open: typing or a change arms one timer, and when it runs a "recent" point is made if the
    // work changed since the last look (a timer only after a touch, so an idle page keeps none running).
    let lastSeen = JSON.stringify(items);
    let pending = null;
    const recentSoon = () => {
      if (pending || !supported()) return;
      pending = setTimeout(async () => {
        pending = null;
        const now = work();
        const seen = JSON.stringify(now);
        if (seen === lastSeen || !Object.keys(now).length) return;
        lastSeen = seen;
        await makePoint("recent", now).catch(() => null);
        refresh();
      }, RECENT_MS);
    };
    ["input", "change"].forEach((type) => document.addEventListener(type, recentSoon, { capture: true, passive: true }));
  };
  let refresh = () => {};
  // After work-backup.js, which is loaded after this file and makes window.WorkBackup.
  const run = () => { start().catch(() => {}).then(started); };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run, { once: true });
  else setTimeout(run, 0);
})();
