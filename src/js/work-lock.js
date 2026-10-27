// A PIN for a shared computer (partials/work-lock.njk, inside "All your work in one file"). A reception or a shift
// office often has one browser for everyone; the tools keep their work in it in plain text. "Lock the tools" takes
// every tool's work (the "sc-" keys of localStorage, the team code with them so team sync pauses, and the restore
// points of js/storage-guard.js), encrypts it all with a key from the PIN (PBKDF2-SHA-256, 310 000 rounds, a random
// salt → AES-GCM 256, a fresh IV) into one record in IndexedDB "sc-lock", removes the plain copies and reloads: the
// tools then open empty behind a dialog that asks for the PIN, and nothing is written while they are locked
// (tool-kit.js checks WorkLock.locked). The PIN unlocks: the record is decrypted, the work and the restore points are
// written back, the record is deleted, the page reloads with the work in place.
//
// After an unlock (or a lock with the PIN typed) the derived key stays in this tab's sessionStorage, so the tab can
// lock again without the PIN: at a click, or by itself after the minutes chosen without a touch (localStorage
// "sc-lock-idle"). The key is gone when the tab closes; another tab asks for the PIN again. The PIN itself is kept
// nowhere; a wrong one fails to decrypt and nothing changes. The lock is for the colleague at the same desk: someone
// who can read the browser's storage while the tools are open can read the work.
//
// "Forget everything on this device" removes every tool's work, the restore points, the reminders and the lock.
// This file loads in the head of the tool pages, before the tool scripts, so a locked page is known before any tool
// reads its storage. Without IndexedDB or WebCrypto the section stays hidden and nothing changes.
(() => {
  const FORMAT = "stiven-catalyst-lock";
  const VERSION = 1;
  const FLAG = "sc-locked";
  const IDLE_KEY = "sc-lock-idle";
  const SESSION_KEY = "sc-lock-key";
  const DB = "sc-lock";
  const STORE = "blob";
  const RECORD = "work";
  const RESTORE_DB = "sc-restore";
  const RESTORE_STORE = "points";
  const REMINDERS_DB = "sc-reminders";
  const ITERATIONS = 310000;
  const MIN_PIN = 4;
  // Settings of the page itself: readable without the PIN, never locked away.
  const OPEN = new Set(["sc-theme", "sc-floor-mode-ui", "sc-print-guide-hidden", FLAG, IDLE_KEY]);

  // ---- Pure logic (tests/work-lock.test.cjs) ----
  const lockable = (key) => typeof key === "string" && key.startsWith("sc-") && !OPEN.has(key);
  const gather = (storage) => {
    const items = {};
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (lockable(key)) items[key] = storage.getItem(key);
    }
    return items;
  };
  const toBase64 = (bytes) => {
    let binary = "";
    bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
    return btoa(binary);
  };
  const fromBase64 = (text) => Uint8Array.from(atob(text), (ch) => ch.charCodeAt(0));
  const subtle = () => (typeof crypto !== "undefined" && crypto.subtle) || null;
  const random = (n) => crypto.getRandomValues(new Uint8Array(n));
  const deriveKey = async (pin, salt) => {
    const base = await subtle().importKey("raw", new TextEncoder().encode(String(pin).normalize("NFKC")), "PBKDF2", false, ["deriveKey"]);
    return subtle().deriveKey({ name: "PBKDF2", salt, iterations: ITERATIONS, hash: "SHA-256" }, base, { name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
  };
  const exportKey = async (key) => toBase64(new Uint8Array(await subtle().exportKey("raw", key)));
  const importKey = (raw) => subtle().importKey("raw", fromBase64(raw), "AES-GCM", true, ["encrypt", "decrypt"]);
  const pipe = async (bytes, stream) => new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(stream)).arrayBuffer());
  const canZip = () => typeof CompressionStream === "function" && typeof DecompressionStream === "function";
  // The work and the restore points as one encrypted record: a first byte says whether the JSON is gzipped.
  const seal = async (key, { items, points = [] }, salt, now = new Date()) => {
    const json = new TextEncoder().encode(JSON.stringify({ format: FORMAT, version: VERSION, locked: now.toISOString(), items, points }));
    let body;
    if (canZip()) {
      try { body = await pipe(json, new CompressionStream("gzip")); } catch { body = null; }
    }
    const plain = new Uint8Array((body ? body.length : json.length) + 1);
    plain[0] = body ? 1 : 0;
    plain.set(body || json, 1);
    const iv = random(12);
    const data = new Uint8Array(await subtle().encrypt({ name: "AES-GCM", iv }, key, plain));
    return { id: RECORD, format: FORMAT, version: VERSION, locked: now.toISOString(), salt, iv, data, bytes: data.length };
  };
  // Back from the record with the key; null when the key is wrong or the record is not ours.
  const unseal = async (key, record) => {
    if (!record || record.format !== FORMAT || record.version !== VERSION) return null;
    let plain;
    try { plain = new Uint8Array(await subtle().decrypt({ name: "AES-GCM", iv: record.iv }, key, record.data)); } catch { return null; }
    try {
      const body = plain.subarray(1);
      const json = plain[0] === 1 ? await pipe(body, new DecompressionStream("gzip")) : body;
      const payload = JSON.parse(new TextDecoder().decode(json));
      if (!payload || payload.format !== FORMAT || !payload.items || typeof payload.items !== "object") return null;
      const items = Object.fromEntries(Object.entries(payload.items).filter(([k, v]) => lockable(k) && typeof v === "string"));
      const points = Array.isArray(payload.points) ? payload.points.filter((p) => p && typeof p === "object" && typeof p.id === "string") : [];
      return { locked: typeof payload.locked === "string" ? payload.locked : "", items, points };
    } catch {
      return null;
    }
  };
  const goodPin = (pin) => typeof pin === "string" && pin.trim().length >= MIN_PIN;
  const idleMinutes = (value) => {
    const n = Number(value);
    return [5, 15, 30, 60].includes(n) ? n : 0;
  };
  window.WorkLockMath = { FORMAT, VERSION, FLAG, IDLE_KEY, SESSION_KEY, MIN_PIN, OPEN, lockable, gather, toBase64, fromBase64, deriveKey, exportKey, importKey, seal, unseal, goodPin, idleMinutes };

  // ---- The browser ----
  const storage = (() => {
    try { const s = window.localStorage; s.length; return s; } catch { return null; }
  })();
  const session = (() => {
    try { const s = window.sessionStorage; s.length; return s; } catch { return null; }
  })();
  const supported = () => Boolean(storage && subtle() && typeof window.indexedDB !== "undefined" && window.indexedDB !== null);
  const locked = () => Boolean(storage && storage.getItem(FLAG) === "1");
  window.WorkLock = { locked: locked(), supported };
  if (!supported()) return;

  const done = (request) => new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  const openDb = (name, store) => new Promise((resolve, reject) => {
    const request = window.indexedDB.open(name, 1);
    request.onupgradeneeded = () => { if (!request.result.objectStoreNames.contains(store)) request.result.createObjectStore(store, { keyPath: "id" }); };
    request.onsuccess = () => { request.result.onversionchange = () => request.result.close(); resolve(request.result); };
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error("busy"));
  });
  const transact = async (name, store, mode, run) => {
    const db = await openDb(name, store);
    try {
      return await new Promise((resolve, reject) => {
        const tx = db.transaction(store, mode);
        let result;
        Promise.resolve(run(tx.objectStore(store))).then((value) => { result = value; }, reject);
        tx.oncomplete = () => resolve(result);
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(tx.error || new Error("aborted"));
      });
    } finally {
      db.close();
    }
  };
  const deleteDb = (name) => new Promise((resolve) => {
    const request = window.indexedDB.deleteDatabase(name);
    request.onsuccess = request.onerror = request.onblocked = () => resolve();
  });
  const readRecord = () => transact(DB, STORE, "readonly", (store) => done(store.get(RECORD))).catch(() => null);
  const readPoints = () => transact(RESTORE_DB, RESTORE_STORE, "readonly", (store) => done(store.getAll())).catch(() => []);

  const sessionKey = async () => {
    const raw = session?.getItem(SESSION_KEY);
    if (!raw) return null;
    try {
      const { key, salt } = JSON.parse(raw);
      return { key: await importKey(key), salt: fromBase64(salt) };
    } catch {
      return null;
    }
  };
  const rememberKey = async (key, salt) => {
    try { session?.setItem(SESSION_KEY, JSON.stringify({ key: await exportKey(key), salt: toBase64(salt) })); } catch { /* asks for the PIN next time */ }
  };

  // Lock: with the PIN (a new salt), or with the key of this tab. "locked", "nothing" (no work, no points) or "failed".
  const lock = async (pin = null) => {
    const items = gather(storage);
    const points = await readPoints();
    if (!Object.keys(items).length && !points.length) return "nothing";
    let key;
    let salt;
    if (pin !== null) {
      if (!goodPin(pin)) return "failed";
      salt = random(16);
      key = await deriveKey(pin, salt);
    } else {
      const kept = await sessionKey();
      if (!kept) return "failed";
      ({ key, salt } = kept);
    }
    try {
      const record = await seal(key, { items, points }, salt);
      await transact(DB, STORE, "readwrite", (store) => done(store.put(record)));
    } catch {
      return "failed";
    }
    // Only now, with the record in place, the plain copies go.
    Object.keys(items).forEach((k) => storage.removeItem(k));
    await transact(RESTORE_DB, RESTORE_STORE, "readwrite", (store) => done(store.clear())).catch(() => null);
    storage.setItem(FLAG, "1");
    await rememberKey(key, salt);
    window.WorkLock.locked = true;
    return "locked";
  };
  // Unlock with the PIN: "unlocked", "wrong", "gone" (no record: the flag alone is cleared) or "failed".
  const unlock = async (pin) => {
    const record = await readRecord();
    if (!record) { storage.removeItem(FLAG); window.WorkLock.locked = false; return "gone"; }
    let key;
    try { key = await deriveKey(pin, record.salt); } catch { return "failed"; }
    const payload = await unseal(key, record);
    if (!payload) return "wrong";
    try {
      Object.entries(payload.items).forEach(([k, v]) => storage.setItem(k, v));
    } catch {
      return "failed";
    }
    if (payload.points.length) await transact(RESTORE_DB, RESTORE_STORE, "readwrite", async (store) => { for (const p of payload.points) await done(store.put(p)); }).catch(() => null);
    await transact(DB, STORE, "readwrite", (store) => done(store.delete(RECORD))).catch(() => null);
    storage.removeItem(FLAG);
    await rememberKey(key, record.salt);
    window.WorkLock.locked = false;
    return "unlocked";
  };
  // Everything of the tools on this device: the work, the lock, the restore points and the reminders.
  const forget = async () => {
    for (const key of Object.keys(gather(storage))) storage.removeItem(key);
    storage.removeItem(FLAG);
    storage.removeItem(IDLE_KEY);
    try { session?.removeItem(SESSION_KEY); } catch { /* nothing kept */ }
    await Promise.all([deleteDb(DB), deleteDb(RESTORE_DB), deleteDb(REMINDERS_DB)]);
    window.WorkLock.locked = false;
  };
  Object.assign(window.WorkLock, { lock, unlock, forget, sessionKey, readRecord });

  // ---- The section and the dialog ----
  const start = () => {
    const root = document.querySelector("[data-work-lock]");
    const dialog = document.querySelector("[data-work-lock-dialog]");
    if (!root || !dialog) return;
    const text = JSON.parse(root.dataset.text || "{}");
    const fill = (template, vars = {}) => String(template || "").replace(/\{(\w+)\}/g, (m, name) => (name in vars ? vars[name] : m));
    const status = root.querySelector("[data-wl-status]");
    const say = (message) => { status.textContent = message || ""; };
    const reload = () => { location.reload(); };
    const confirmForget = async () => {
      if (!window.confirm(text.forgetConfirm)) return false;
      await forget();
      reload();
      return true;
    };
    root.hidden = false;

    // Locked: the dialog, and nothing else until the PIN is right (Escape does not close it).
    if (locked() && typeof dialog.showModal === "function") {
      const form = dialog.querySelector("form");
      const pinField = form.elements.pin;
      const error = dialog.querySelector("[data-wl-error]");
      dialog.addEventListener("cancel", (event) => event.preventDefault());
      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        error.textContent = "";
        form.querySelector("button[type=submit]").disabled = true;
        const result = await unlock(pinField.value).catch(() => "failed");
        form.querySelector("button[type=submit]").disabled = false;
        if (result === "unlocked" || result === "gone") { error.textContent = text.unlocked; reload(); return; }
        error.textContent = result === "wrong" ? text.wrong : text.failed;
        pinField.select();
      });
      dialog.querySelector("[data-wl-forget]").addEventListener("click", confirmForget);
      dialog.showModal();
      pinField.focus();
      root.querySelector("[data-wl-open]").hidden = true;
      return;
    }

    // Open: lock now (with the PIN the first time in this tab), the minutes before the tab locks itself, forget.
    const setup = root.querySelector("[data-wl-setup]");
    const lockButton = root.querySelector("[data-wl-lock]");
    const idleSelect = root.querySelector("[data-wl-idle]");
    const idleNote = root.querySelector("[data-wl-idle-note]");
    const pinForm = root.querySelector("[data-wl-pin-form]");
    let hasKey = false;
    sessionKey().then((kept) => { hasKey = Boolean(kept); showIdle(); });
    const showIdle = () => {
      const minutes = idleMinutes(storage.getItem(IDLE_KEY));
      idleSelect.value = String(minutes);
      idleNote.textContent = minutes ? (hasKey ? fill(text.idleOn, { n: minutes }) : text.idleNeedsKey) : "";
    };
    const finish = (result) => {
      if (result === "locked") { say(text.locking); reload(); return; }
      say(result === "nothing" ? text.nothing : text.failed);
    };
    lockButton.addEventListener("click", async () => {
      if (hasKey) { finish(await lock().catch(() => "failed")); return; }
      setup.hidden = !setup.hidden;
      if (!setup.hidden) pinForm.elements.pin.focus();
    });
    pinForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const pin = pinForm.elements.pin.value;
      const again = pinForm.elements.again.value;
      if (!goodPin(pin)) { say(fill(text.short, { n: MIN_PIN })); pinForm.elements.pin.focus(); return; }
      if (pin !== again) { say(text.differ); pinForm.elements.again.focus(); return; }
      say(text.working);
      pinForm.querySelector("button[type=submit]").disabled = true;
      const result = await lock(pin).catch(() => "failed");
      pinForm.querySelector("button[type=submit]").disabled = false;
      finish(result);
    });
    idleSelect.addEventListener("change", () => {
      const minutes = idleMinutes(idleSelect.value);
      if (minutes) storage.setItem(IDLE_KEY, String(minutes)); else storage.removeItem(IDLE_KEY);
      showIdle();
      armIdle();
    });
    root.querySelector("[data-wl-forget]").addEventListener("click", confirmForget);

    // The tab locks itself after the minutes chosen without a key press, a touch or a scroll, when it holds the key.
    let timer = null;
    const armIdle = () => {
      clearTimeout(timer);
      const minutes = idleMinutes(storage.getItem(IDLE_KEY));
      if (!minutes) return;
      timer = setTimeout(async () => {
        if (!hasKey || locked()) return;
        const result = await lock().catch(() => "failed");
        if (result === "locked") reload();
      }, minutes * 60 * 1000);
    };
    ["pointerdown", "keydown", "scroll", "input"].forEach((type) => window.addEventListener(type, armIdle, { passive: true }));
    armIdle();
    showIdle();
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();
