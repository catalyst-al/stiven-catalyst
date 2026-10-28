// "Save all your work": every tool keeps its work only in this browser (localStorage keys that
// start with "sc-", and the photos of IndexedDB "sc-media", js/media-store.js). This writes them all to one file, and
// opens such a file on another phone, computer or browser. Nothing is sent anywhere; the file stays with the visitor.
//
// The file: { format, version: 1, exported, items: { key: text }, media?: [{ id, created, tool, ref, width, height,
// type, data (base64) }] }. The photos go in newest first, up to photoLimit (20 MB before base64); the box names how
// many were left out. A file from before photos, or one opened by a version of the site from before them, simply has
// none. Opening adds the photos this browser does not have and never replaces one it has; the work itself is
// replaced after a restore point, as before. Restore points stay on the device.
(() => {
  const FORMAT = "stiven-catalyst-work";
  const VERSION = 1;
  // A file with its photos: 20 MB of them are about 27 MB in base64.
  const MAX_BYTES = 40 * 1024 * 1024;
  const PHOTO_LIMIT = 20 * 1024 * 1024;
  const PHOTO_TYPE = /^image\/(jpeg|png|webp)$/;
  const PHOTO_ID = /^[A-Za-z0-9-]{1,80}$/;
  const PHOTO_TOOL = /^[a-z0-9-]{1,60}$/;
  const MAX_PHOTOS = 2000;
  // Where this script came from: media-store.js is next to it, loaded when a page without photos saves or opens.
  const SELF = document.currentScript?.src || "";
  // Settings of the page itself, not work; the team code and what team sync last saw (js/team-sync.js) stay on this
  // device too, so a saved file never carries the code.
  const SKIP = new Set(["sc-theme", "sc-motion", "sc-floor-mode-ui", "sc-print-guide-hidden", "sc-team", "sc-team-state", "sc-locked", "sc-lock-idle"]);
  // Storage names that differ from the tool's address.
  const ALIAS = { "sigma-chart": "sigma-control-chart", dmaic: "six-sigma-dmaic", "cx-tower": "cx-control-tower", actions: "action-tracker" };

  const isWork = (key) => typeof key === "string" && key.startsWith("sc-") && !SKIP.has(key);
  // "sc-damage-control-sq-check" → "damage-control": the floor check and calculator settings
  // belong to their tool, and each language of a tool keeps its own log.
  const toolSlug = (key) => {
    const slug = key.replace(/^sc-/, "").replace(/-(check|calc|ui)$/, "").replace(/-(de|sq)$/, "");
    return ALIAS[slug] || slug;
  };

  // The work of these tools is an object, and of the logs among them a list of rows. An entry of any other shape was
  // damaged or made by hand: opened, it would wipe the log it replaces, so the whole file is refused.
  const OBJECT = /^sc-(damage-control|incomplete-control|night-audit|delay-analyzer|sigma-chart|pareto|cx-tower|shift-handover|six-sigma|dmaic|daily-board|five-s-audit|safety-cross|a3-report|kaizen-board|skills-matrix|oee|hotel-kpis|fishbone|fmea|process-lab|time-study|value-stream-map|standard-work|gemba-walk)(-(de|sq))?$|^sc-(actions|workplace)$|^sc-annotations$/;
  const LOG = /^sc-(damage-control|incomplete-control|night-audit|delay-analyzer|sigma-chart)(-(de|sq))?$|^sc-actions$|^sc-annotations$/;
  const sound = ([key, value]) => {
    if (!OBJECT.test(key)) return true;
    let parsed;
    try { parsed = JSON.parse(value); } catch { return false; }
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return false;
    return !LOG.test(key) || Array.isArray(parsed.rows);
  };
  const toBase64 = (bytes) => {
    let binary = "";
    for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(binary);
  };
  // A photo of the file as MediaStore keeps it, or null when anything in it is not as this site writes it.
  const photoIn = (entry) => {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) return null;
    const { id, created, tool, ref, width, height, type, data } = entry;
    if (typeof id !== "string" || !PHOTO_ID.test(id) || typeof tool !== "string" || !PHOTO_TOOL.test(tool) || typeof ref !== "string" || ref.length > 200) return null;
    if (typeof created !== "string" || Number.isNaN(Date.parse(created)) || typeof type !== "string" || !PHOTO_TYPE.test(type)) return null;
    if (!Number.isFinite(width) || !Number.isFinite(height) || width < 0 || height < 0 || typeof data !== "string" || !/^[A-Za-z0-9+/]*={0,2}$/.test(data)) return null;
    let raw;
    try { raw = atob(data); } catch { return null; }
    const bytes = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
    return { id, created, tool, ref, width, height, blob: new Blob([bytes], { type }) };
  };
  // A saved file, checked before anything in this browser is replaced.
  const readBackup = (text) => {
    let file;
    try { file = JSON.parse(text); } catch { return null; }
    if (!file || typeof file !== "object" || file.format !== FORMAT || file.version !== VERSION) return null;
    const items = file.items;
    if (!items || typeof items !== "object" || Array.isArray(items)) return null;
    if (file.media !== undefined && !Array.isArray(file.media)) return null;
    // A photo that is not as this site writes it is left out; the work around it still opens.
    const media = (file.media || []).slice(0, MAX_PHOTOS).map(photoIn).filter(Boolean);
    // A setting of the page (the theme, the paused motion, the lock's flag) is left out rather than refused: a file
    // saved by an older version of the site, which did not know to leave out a newer setting, still opens.
    const entries = Object.entries(items).filter(([key]) => !SKIP.has(key));
    if ((!entries.length && !media.length) || entries.some(([key, value]) => !isWork(key) || typeof value !== "string") || !entries.every(sound)) return null;
    return { exported: typeof file.exported === "string" ? file.exported : "", items: Object.fromEntries(entries), media };
  };
  const makeBackup = (storage, now = new Date()) => {
    const items = {};
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (isWork(key)) items[key] = storage.getItem(key);
    }
    return { format: FORMAT, version: VERSION, exported: now.toISOString(), items };
  };
  // The photos for a file: newest first while they fit `limit` bytes. { media, left }.
  const photosFor = async (records, limit = PHOTO_LIMIT) => {
    const media = [];
    let used = 0;
    let left = 0;
    const newest = [...records].sort((a, b) => String(b.created).localeCompare(String(a.created)));
    for (const record of newest) {
      const blob = record?.blob;
      if (!blob || typeof blob.arrayBuffer !== "function" || !PHOTO_ID.test(String(record.id)) || media.length >= MAX_PHOTOS) { left += 1; continue; }
      if (used + blob.size > limit) { left += 1; continue; }
      used += blob.size;
      media.push({
        id: String(record.id), created: String(record.created), tool: String(record.tool), ref: String(record.ref ?? ""),
        width: Number(record.width) || 0, height: Number(record.height) || 0, type: PHOTO_TYPE.test(blob.type) ? blob.type : "image/jpeg",
        data: toBase64(new Uint8Array(await blob.arrayBuffer())),
      });
    }
    return { media, left };
  };
  // MediaStore, loaded from next to this script on a page that has no photos of its own; null without IndexedDB.
  let loading = null;
  const mediaStore = () => {
    if (window.MediaStore) return Promise.resolve(window.MediaStore.supported() ? window.MediaStore : null);
    if (!loading) {
      loading = new Promise((resolve) => {
        if (!SELF || typeof window.indexedDB === "undefined" || window.indexedDB === null) { resolve(null); return; }
        const script = document.createElement("script");
        script.src = new URL("media-store.js", SELF).href;
        script.onload = () => resolve(window.MediaStore?.supported() ? window.MediaStore : null);
        script.onerror = () => resolve(null);
        document.head.append(script);
      });
    }
    return loading;
  };
  // ---- A work file sealed with a password ----
  // The same file, encrypted before it leaves the browser: { format, version: 1, exported, salt, iv, data } with the
  // bytes in base64, AES-GCM 256 under a key from the password (PBKDF2-SHA-256, 310 000 rounds, a random salt), the
  // format bound as additional data, the JSON gzipped where the browser can (a first byte says so). For a file that
  // sits in the Downloads of a shared computer or goes by email. Opened with the password it is the plain file again;
  // a wrong password or a changed byte opens nothing. The same way the PIN seals the tools (js/work-lock.js).
  const SEALED_FORMAT = "stiven-catalyst-work-sealed";
  const SEALED_VERSION = 1;
  const SEAL_ITERATIONS = 310000;
  const MIN_PASSWORD = 8;
  const subtle = () => (typeof crypto !== "undefined" && crypto.subtle) || null;
  const sealAad = () => new TextEncoder().encode(`${SEALED_FORMAT}/${SEALED_VERSION}`);
  const toB64 = (bytes) => {
    let binary = "";
    for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(binary);
  };
  const fromB64 = (text) => Uint8Array.from(atob(text), (ch) => ch.charCodeAt(0));
  // The bytes through a compression stream. With a limit, the reading stops as soon as the output passes it (a tiny
  // file that inflates to gigabytes never fills the memory) and throws.
  const pipeThrough = async (bytes, stream, limit = Infinity) => {
    const reader = new Blob([bytes]).stream().pipeThrough(stream).getReader();
    const chunks = [];
    let total = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.length;
      if (total > limit) { await reader.cancel().catch(() => {}); throw new Error("too big"); }
      chunks.push(value);
    }
    const out = new Uint8Array(total);
    let at = 0;
    for (const chunk of chunks) { out.set(chunk, at); at += chunk.length; }
    return out;
  };
  const sealKey = async (password, salt) => {
    const base = await subtle().importKey("raw", new TextEncoder().encode(String(password).normalize("NFKC")), "PBKDF2", false, ["deriveKey"]);
    return subtle().deriveKey({ name: "PBKDF2", salt, iterations: SEAL_ITERATIONS, hash: "SHA-256" }, base, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
  };
  const goodPassword = (value) => typeof value === "string" && value.trim().length >= MIN_PASSWORD;
  const isSealedText = (text) => {
    try { const file = JSON.parse(text); return Boolean(file) && file.format === SEALED_FORMAT; } catch { return false; }
  };
  // The plain file's text sealed: the text of the sealed file.
  const sealBackupText = async (text, password, now = new Date()) => {
    const json = new TextEncoder().encode(text);
    let body = null;
    if (typeof CompressionStream === "function") {
      try { body = await pipeThrough(json, new CompressionStream("gzip")); } catch { body = null; }
    }
    const plain = new Uint8Array((body || json).length + 1);
    plain[0] = body ? 1 : 0;
    plain.set(body || json, 1);
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await sealKey(password, salt);
    const data = new Uint8Array(await subtle().encrypt({ name: "AES-GCM", iv, additionalData: sealAad() }, key, plain));
    return `${JSON.stringify({ format: SEALED_FORMAT, version: SEALED_VERSION, exported: now.toISOString(), salt: toB64(salt), iv: toB64(iv), data: toB64(data) })}\n`;
  };
  // The plain file's text back, or { error: "invalid" | "wrong" } (a wrong password and a changed byte look the same).
  const openSealedText = async (text, password) => {
    let file;
    try { file = JSON.parse(text); } catch { return { error: "invalid" }; }
    if (!file || file.format !== SEALED_FORMAT || file.version !== SEALED_VERSION || [file.salt, file.iv, file.data].some((v) => typeof v !== "string")) return { error: "invalid" };
    let plain;
    try {
      const key = await sealKey(password, fromB64(file.salt));
      plain = new Uint8Array(await subtle().decrypt({ name: "AES-GCM", iv: fromB64(file.iv), additionalData: sealAad() }, key, fromB64(file.data)));
    } catch {
      return { error: "wrong" };
    }
    try {
      const body = plain.subarray(1);
      const json = plain[0] === 1 ? await pipeThrough(body, new DecompressionStream("gzip"), MAX_BYTES) : body;
      if (json.length > MAX_BYTES) return { error: "invalid" };
      return { text: new TextDecoder().decode(json), exported: typeof file.exported === "string" ? file.exported : "" };
    } catch {
      return { error: "invalid" };
    }
  };
  const api = { isWork, toolSlug, readBackup, makeBackup, sound, photosFor, photoLimit: PHOTO_LIMIT, SEALED_FORMAT, MIN_PASSWORD, goodPassword, isSealedText, sealBackupText, openSealedText };
  window.WorkBackup = api;

  const root = document.querySelector("[data-work-backup]");
  if (!root) return;
  const text = JSON.parse(root.dataset.text);
  const names = JSON.parse(document.getElementById("work-backup-names")?.textContent || "{}");
  const summary = root.querySelector("[data-work-summary]");
  const status = root.querySelector("[data-work-status]");
  const fill = (template, vars) => template.replace(/\{(\w+)\}/g, (match, name) => (name in vars ? vars[name] : match));

  const storage = (() => {
    try {
      const probe = window.localStorage;
      probe.length;
      return probe;
    } catch {
      return null;
    }
  })();

  const toolNames = (keys) => [...new Set(keys.map((key) => {
    const slug = toolSlug(key);
    return slug === "coaching-v1" ? text.coaching : names[slug] || slug;
  }))].sort((a, b) => a.localeCompare(b));

  const showSummary = () => {
    if (!storage) {
      summary.textContent = text.blocked;
      root.querySelectorAll("button, input").forEach((node) => { node.disabled = true; });
      return;
    }
    const tools = toolNames(Object.keys(makeBackup(storage).items));
    summary.textContent = tools.length ? fill(text.inBrowser, { n: tools.length, tools: tools.join(", ") }) : text.nothing;
  };

  const say = (message) => {
    status.textContent = message;
  };

  // Locked for a shared computer (js/work-lock.js): the work is in the locked record. A file saved now would hold only
  // what pages wrote since, and one opened now would sit in plain text beside the record.
  const locked = () => Boolean(window.WorkLock?.locked);
  const sealBox = root.querySelector("[data-work-seal]");
  const passwordDialog = document.querySelector("[data-work-password-dialog]");
  // The password, asked in the dialog: twice when sealing, once when opening. Null when the visitor closes it.
  const askPassword = (mode) => new Promise((resolve) => {
    if (!passwordDialog || typeof passwordDialog.showModal !== "function") { resolve(null); return; }
    const form = passwordDialog.querySelector("form");
    const again = passwordDialog.querySelector("[data-work-password-again]");
    const error = passwordDialog.querySelector("[data-work-password-error]");
    passwordDialog.querySelector("[data-work-password-title]").textContent = mode === "seal" ? text.sealTitle : text.unsealTitle;
    passwordDialog.querySelector("[data-work-password-help]").textContent = mode === "seal" ? text.sealHelp : text.unsealHelp;
    again.hidden = mode !== "seal";
    form.elements.password.value = "";
    form.elements.again.value = "";
    error.textContent = "";
    // One way out, whichever way it closes (Continue, Cancel, Esc): every listener goes, the promise settles once.
    let settled = false;
    const finish = (value) => {
      if (settled) return;
      settled = true;
      form.removeEventListener("submit", onSubmit);
      cancel.removeEventListener("click", onCancel);
      passwordDialog.removeEventListener("close", onClose);
      if (passwordDialog.open) passwordDialog.close();
      resolve(value);
    };
    const onClose = () => finish(null);
    const onSubmit = (event) => {
      event.preventDefault();
      const password = form.elements.password.value;
      if (!goodPassword(password)) { error.textContent = fill(text.passwordShort, { n: MIN_PASSWORD }); form.elements.password.focus(); return; }
      if (mode === "seal" && password !== form.elements.again.value) { error.textContent = text.passwordDiffer; form.elements.again.focus(); return; }
      finish(password);
    };
    const cancel = passwordDialog.querySelector("[data-work-password-cancel]");
    const onCancel = () => finish(null);
    form.addEventListener("submit", onSubmit);
    cancel.addEventListener("click", onCancel);
    passwordDialog.addEventListener("close", onClose);
    passwordDialog.showModal();
    form.elements.password.focus();
  });
  root.querySelector("[data-work-save]").addEventListener("click", async () => {
    if (locked()) { say(text.locked); return; }
    const backup = makeBackup(storage);
    // The photos: all of them up to the limit; when the photo store cannot be read, the work without them.
    let photos = { media: [], left: 0 };
    let unread = false;
    try {
      const store = await mediaStore();
      if (store) photos = await photosFor(await store.all(), api.photoLimit);
    } catch { unread = true; }
    if (!Object.keys(backup.items).length && !photos.media.length) {
      say(text.nothing);
      return;
    }
    if (photos.media.length) backup.media = photos.media;
    const now = new Date();
    const day = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    // Sealed with a password when asked: the file holds nothing readable without it.
    let content = JSON.stringify(backup);
    let sealed = false;
    if (sealBox?.checked) {
      if (!subtle()) { say(text.sealUnavailable); return; }
      const password = await askPassword("seal");
      if (password === null) return;
      say(text.sealing);
      try { content = await sealBackupText(content, password, now); } catch { say(text.sealFailed); return; }
      sealed = true;
    }
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([content], { type: "application/json" }));
    link.download = `stiven-catalyst-${day}${sealed ? ".sealed" : ""}.json`;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    say([
      fill(sealed ? text.savedSealed : text.saved, { file: link.download }),
      photos.media.length ? fill(text.savedPhotos, { n: photos.media.length }) : "",
      photos.left ? fill(text.photosLeft, { n: photos.left }) : "",
      unread ? text.photosUnread : "",
    ].filter(Boolean).join(" "));
  });

  const picker = root.querySelector("[data-work-open]");
  picker.addEventListener("change", async () => {
    const file = picker.files[0];
    picker.value = "";
    if (!file) return;
    if (locked()) { say(text.locked); return; }
    if (file.size > MAX_BYTES) {
      say(text.large);
      return;
    }
    let fileText = await file.text();
    // A sealed file asks for its password first; then it is the plain file.
    if (isSealedText(fileText)) {
      if (!subtle()) { say(text.sealUnavailable); return; }
      const password = await askPassword("open");
      if (password === null) return;
      say(text.opening);
      const opened = await openSealedText(fileText, password).catch(() => ({ error: "invalid" }));
      if (opened.error === "wrong") { say(text.wrongPassword); return; }
      if (opened.error) { say(text.invalid); return; }
      fileText = opened.text;
    }
    const backup = readBackup(fileText);
    if (!backup) {
      say(text.invalid);
      return;
    }
    const keys = Object.keys(backup.items);
    const date = backup.exported ? new Date(backup.exported) : null;
    const pad = (n) => String(n).padStart(2, "0");
    const when = date && !Number.isNaN(date.getTime())
      ? (document.documentElement.lang === "en" ? `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` : `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`)
      : "?";
    if (!window.confirm(fill(text.confirm, { date: when, tools: toolNames(keys).join(", ") }))) return;
    // A restore point of the work as it is (js/storage-guard.js sets the hook), so the wrong file can be undone.
    try { await window.WorkBackup.beforeReplace?.(keys); } catch { /* opened as before */ }
    // All or nothing: when the browser runs out of space halfway, the tools already written get
    // their old data back, so the device never holds half of one file and half of the other.
    const before = new Map(keys.map((key) => [key, storage.getItem(key)]));
    const written = [];
    let full = false;
    for (const key of keys) {
      try {
        storage.setItem(key, backup.items[key]);
        written.push(key);
      } catch {
        full = true;
        break;
      }
    }
    if (full) {
      written.forEach((key) => {
        try {
          if (before.get(key) === null) storage.removeItem(key);
          else storage.setItem(key, before.get(key));
        } catch { /* the old value was there before, so it fits again */ }
      });
      say(text.full);
      return;
    }
    // Rows the file lacks were not deleted: team sync (js/team-sync.js) does not delete them on the team's devices.
    try { window.TeamSync?.rebase?.(storage, keys); } catch { /* no team here */ }
    // The photos: added where this browser does not have them, never in place of one it has.
    let photoNote = "";
    if (backup.media.length) {
      let added = null;
      try {
        const store = await mediaStore();
        if (store) added = await store.keepAll(backup.media);
      } catch { added = null; }
      photoNote = added === null ? text.photosFailed : fill(text.openedPhotos, { n: added });
    }
    say([text.opened, photoNote].filter(Boolean).join(" "));
    setTimeout(() => window.location.reload(), 900);
  });

  showSummary();
  // Work saved in another tab shows up here too.
  window.addEventListener("storage", showSummary);
})();
