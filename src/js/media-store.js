// Photos as evidence, kept on this device only: IndexedDB database "sc-media", store "photos", one record per photo
// { id, created, tool, ref, blob, width, height }. A photo is made smaller on the device before it is kept (at most
// 1280 px on its long side, JPEG at quality 0.7), so a phone full of findings stays a few hundred kilobytes each.
// Nothing is sent anywhere. "Save all my work" (work-backup.js) puts them in the saved file (all, keepAll), up to
// a limit; opening that file adds the photos this browser does not have yet and never replaces one it has.
window.MediaStore = (() => {
  const DB = "sc-media";
  const STORE = "photos";
  const MAX_SIDE = 1280;
  const QUALITY = 0.7;

  // The size a photo is kept at: the long side at most `max`, the shape unchanged, never made larger.
  const fitSize = (width, height, max = MAX_SIDE) => {
    const w = Number(width), h = Number(height);
    if (!(w > 0 && h > 0)) return { width: 0, height: 0 };
    const scale = Math.min(1, max / Math.max(w, h));
    return { width: Math.max(1, Math.round(w * scale)), height: Math.max(1, Math.round(h * scale)) };
  };

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
          if (!db.objectStoreNames.contains(STORE)) {
            const store = db.createObjectStore(STORE, { keyPath: "id" });
            store.createIndex("tool", "tool");
            store.createIndex("toolRef", ["tool", "ref"]);
          }
        };
        request.onsuccess = () => {
          const db = request.result;
          // Another tab with a newer version: let it have the database.
          db.onversionchange = () => { db.close(); opening = null; };
          resolve(db);
        };
        request.onerror = () => reject(request.error);
        request.onblocked = () => reject(new Error("The photo store is busy in another tab"));
      }).catch((error) => { opening = null; throw error; });
    }
    return opening;
  };
  // One transaction; resolves with what `run` returns once the transaction has finished.
  const transact = async (mode, run) => {
    const db = await open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, mode);
      let result;
      Promise.resolve(run(tx.objectStore(STORE))).then((value) => { result = value; }, reject);
      tx.oncomplete = () => resolve(result);
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error || new Error("The photo was not saved"));
    });
  };

  const newId = () => (window.crypto?.randomUUID ? window.crypto.randomUUID() : `p-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`);

  // A picture file, read into something a canvas can draw; the orientation the camera wrote is kept.
  const decode = async (blob) => {
    if (typeof window.createImageBitmap === "function") {
      try { return await window.createImageBitmap(blob, { imageOrientation: "from-image" }); } catch { /* an older browser: try an <img> */ }
    }
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(blob);
      const image = new Image();
      image.onload = () => { URL.revokeObjectURL(url); resolve(image); };
      image.onerror = () => { URL.revokeObjectURL(url); reject(new Error("This photo could not be read")); };
      image.src = url;
    });
  };
  // The photo made smaller and turned into a JPEG, on the device.
  const compress = async (file, { max = MAX_SIDE, quality = QUALITY } = {}) => {
    const image = await decode(file);
    const { width, height } = fitSize(image.naturalWidth || image.width, image.naturalHeight || image.height, max);
    if (!width) throw new Error("This photo could not be read");
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    // A transparent PNG would turn black in a JPEG.
    context.fillStyle = "#fff";
    context.fillRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);
    image.close?.();
    const blob = await new Promise((resolve, reject) => canvas.toBlob((out) => (out ? resolve(out) : reject(new Error("This photo could not be saved"))), "image/jpeg", quality));
    return { blob, width, height };
  };

  // Ask once that the browser keeps the photos when space runs low; the answer changes nothing else.
  let askedToKeep = false;
  const keepPhotos = () => {
    if (askedToKeep) return;
    askedToKeep = true;
    try { navigator.storage?.persist?.().catch(() => {}); } catch { /* not offered here */ }
  };

  const byCreated = (a, b) => String(a.created).localeCompare(String(b.created));
  const add = async (file, { tool, ref } = {}) => {
    const { blob, width, height } = await compress(file);
    const record = { id: newId(), created: new Date().toISOString(), tool: String(tool || ""), ref: String(ref ?? ""), blob, width, height };
    await transact("readwrite", (store) => done(store.put(record)));
    keepPhotos();
    return record;
  };
  // A removed photo put back as it was (the undo of remove).
  const restore = (record) => transact("readwrite", (store) => done(store.put(record))).then(() => record);
  const get = (id) => transact("readonly", (store) => done(store.get(id))).then((record) => record || null);
  // The photos of one entry (tool and ref), or of a whole tool without ref; oldest first.
  const list = (tool, ref) => transact("readonly", (store) => done(ref === undefined
    ? store.index("tool").getAll(String(tool || ""))
    : store.index("toolRef").getAll([String(tool || ""), String(ref)]))).then((records) => (records || []).sort(byCreated));
  const remove = (id) => transact("readwrite", (store) => done(store.delete(id)));
  // A photo moved to another entry, for example a draft that has been saved under its own id.
  const update = (id, { tool, ref } = {}) => transact("readwrite", async (store) => {
    const record = await done(store.get(id));
    if (!record) return null;
    if (tool !== undefined) record.tool = String(tool);
    if (ref !== undefined) record.ref = String(ref);
    await done(store.put(record));
    return record;
  });
  // Every photo of every tool, oldest first (for the saved file).
  const all = () => transact("readonly", (store) => done(store.getAll())).then((records) => (records || []).sort(byCreated));
  // Photos from a saved file: each one this browser does not have yet (by id) is added, one it has stays as it is.
  // Resolves with how many were added.
  const keepAll = (records) => transact("readwrite", async (store) => {
    let added = 0;
    for (const record of records) {
      if (await done(store.get(record.id))) continue;
      await done(store.put(record));
      added += 1;
    }
    return added;
  });
  // How many photos each entry of a tool has: { ref: n }.
  const counts = async (tool) => {
    const out = {};
    (await list(tool)).forEach((record) => { out[record.ref] = (out[record.ref] || 0) + 1; });
    return out;
  };
  // The space this site uses and may use, as the browser reports it; null where it does not say.
  const estimate = async () => {
    try {
      const value = await navigator.storage?.estimate?.();
      return value ? { usage: value.usage || 0, quota: value.quota || 0 } : null;
    } catch {
      return null;
    }
  };

  return { DB, STORE, MAX_SIDE, QUALITY, fitSize, supported, compress, add, restore, get, list, all, keepAll, remove, update, counts, estimate };
})();
