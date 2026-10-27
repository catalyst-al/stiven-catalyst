// A minimal IndexedDB for the tests of the stores that keep their records there (media-store.js, work-lock.js,
// storage-guard.js): databases of object stores keyed by keyPath, with indexes, getAll, clear and deleteDatabase.
// Requests answer on a later turn, and a transaction completes once nothing is pending (as in browsers, a request
// made from a promise callback keeps it open). Records are copied with structuredClone, Blobs included, as a browser
// does. Not a test file itself: the runner loads only *.test.cjs.
const fakeIndexedDB = () => {
  const dbs = new Map();
  const deleted = [];
  const later = (fn) => setTimeout(fn, 0);
  const request = (tx, work) => {
    const req = { result: undefined, error: null, onsuccess: null, onerror: null };
    if (tx) tx.pending += 1;
    later(() => {
      try { req.result = work(); req.onsuccess?.({ target: req }); } catch (error) { req.error = error; req.onerror?.({ target: req }); if (tx) tx.failed = error; }
      if (tx) { tx.pending -= 1; tx.check(); }
    });
    return req;
  };
  const rowsOf = (name, store) => [...(dbs.get(name)?.stores.get(store)?.rows.values() || [])];
  return {
    dbs,
    deleted,
    rowsOf,
    deleteDatabase(name) {
      const req = { onsuccess: null, onerror: null, onblocked: null };
      later(() => { dbs.delete(name); deleted.push(name); req.onsuccess?.(); });
      return req;
    },
    open(name) {
      const req = { result: null, onupgradeneeded: null, onsuccess: null, onerror: null, onblocked: null };
      later(() => {
        let db = dbs.get(name);
        const fresh = !db;
        if (fresh) {
          const stores = new Map();
          db = {
            stores,
            objectStoreNames: { contains: (store) => stores.has(store) },
            createObjectStore: (store, { keyPath }) => {
              const data = { keyPath, rows: new Map(), indexes: new Map() };
              stores.set(store, data);
              return { createIndex: (index, path) => data.indexes.set(index, path) };
            },
            close() {},
            transaction(store) {
              const data = stores.get(store);
              const tx = {
                pending: 0, failed: null, finished: false, oncomplete: null, onerror: null, onabort: null,
                check() { later(() => { if (!tx.finished && tx.pending === 0) { tx.finished = true; if (tx.failed) { tx.error = tx.failed; tx.onabort?.(); } else tx.oncomplete?.(); } }); },
                objectStore: () => ({
                  put: (value) => request(tx, () => { data.rows.set(value[data.keyPath], structuredClone(value)); return value[data.keyPath]; }),
                  get: (key) => request(tx, () => (data.rows.has(key) ? structuredClone(data.rows.get(key)) : undefined)),
                  getAll: () => request(tx, () => [...data.rows.values()].map((v) => structuredClone(v))),
                  getAllKeys: () => request(tx, () => [...data.rows.keys()].sort()),
                  delete: (key) => request(tx, () => { data.rows.delete(key); }),
                  clear: () => request(tx, () => { data.rows.clear(); }),
                  index: (index) => ({
                    getAll: (match) => request(tx, () => {
                      const path = data.indexes.get(index);
                      const keyOf = (row) => (Array.isArray(path) ? path.map((p) => row[p]) : row[path]);
                      return [...data.rows.values()].filter((row) => JSON.stringify(keyOf(row)) === JSON.stringify(match)).map((v) => structuredClone(v));
                    }),
                  }),
                }),
              };
              tx.check();
              return tx;
            },
          };
          dbs.set(name, db);
        }
        req.result = db;
        if (fresh) req.onupgradeneeded?.();
        req.onsuccess?.();
      });
      return req;
    },
  };
};

module.exports = { fakeIndexedDB };
