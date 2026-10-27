// Rollback proof, 27 October 2026: what a visitor's work does when the site goes back from the new version (this
// branch) to the old one (origin/main, live today) and forward again. One origin (http://127.0.0.1:8361), one
// persistent Chromium profile; the server swaps the folder it serves between the two builds, as a deploy would, so
// localStorage, IndexedDB and the service worker carry over exactly as in a visitor's browser.
//
//   bash build.sh <checkout of origin/main> <tmp>/site-old
//   bash build.sh <this checkout> <tmp>/site-new
//   SITE_OLD=<tmp>/site-old SITE_NEW=<tmp>/site-new OUT=<tmp>/out node rollback.cjs
//
// Every piece of work is made through the pages themselves (forms, buttons, file pickers), never by writing storage;
// storage is only read, to say what the pages kept. Writes results.json next to this file (and the saved files in OUT).
const path = require("node:path");
const fs = require("node:fs");
const http = require("node:http");
const zlib = require("node:zlib");
const { chromium } = require(path.join(__dirname, "../../../../../node_modules/playwright"));

const SITES = { new: path.resolve(process.env.SITE_NEW), old: path.resolve(process.env.SITE_OLD) };
const OUT = path.resolve(process.env.OUT || path.join(__dirname, "out"));
const PORT = 8361;
const BASE = `http://127.0.0.1:${PORT}`;
const CHROME = "/opt/pw-browsers/chromium";
fs.mkdirSync(OUT, { recursive: true });

// ---- The server: one origin, the served build swapped between steps ----
let served = "new";
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webmanifest": "application/manifest+json", ".woff2": "font/woff2", ".xml": "application/xml" };
const server = http.createServer((req, res) => {
  const root = SITES[served];
  let file;
  try { file = path.normalize(path.join(root, decodeURIComponent(new URL(req.url, BASE).pathname))); } catch { res.writeHead(400); res.end(); return; }
  if (!file.startsWith(root)) { res.writeHead(403); res.end(); return; }
  try { if (fs.statSync(file).isDirectory()) file = path.join(file, "index.html"); fs.accessSync(file); } catch {
    res.writeHead(404, { "content-type": "text/html" }); res.end("Not found"); return;
  }
  res.writeHead(200, { "content-type": TYPES[path.extname(file)] || "application/octet-stream", "cache-control": "no-cache" });
  fs.createReadStream(file).pipe(res);
});
const serve = (which) => { served = which; log(`---- now serving the ${which.toUpperCase()} site`); };

// ---- Results ----
const results = { date: new Date().toISOString(), base: BASE, sites: {}, checks: [], errors: [], snapshots: {}, notes: [] };
let scenario = "";
let phase = "";
const log = (text) => console.log(text);
const check = (tool, what, ok, detail = "") => {
  results.checks.push({ scenario, phase, tool, what, ok: Boolean(ok), detail: typeof detail === "string" ? detail : JSON.stringify(detail) });
  log(`${ok ? "PASS" : "FAIL"} [${scenario}/${phase}] ${tool}: ${what}${detail ? ` | ${typeof detail === "string" ? detail : JSON.stringify(detail)}` : ""}`);
};
const note = (tool, text) => { results.notes.push({ scenario, phase, tool, text }); log(`NOTE [${scenario}/${phase}] ${tool}: ${text}`); };

// A small PNG (a coloured rectangle), the "photo" of a 5S finding.
const png = (w, h, [r, g, b]) => {
  const crcTable = Array.from({ length: 256 }, (_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
  const crc = (buf) => { let c = 0xffffffff; for (const byte of buf) c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
  const chunk = (type, data) => { const len = Buffer.alloc(4); len.writeUInt32BE(data.length); const td = Buffer.concat([Buffer.from(type), data]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([len, td, c]); };
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 2;
  const raw = Buffer.alloc((w * 3 + 1) * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const o = y * (w * 3 + 1) + 1 + x * 3; raw[o] = (r + x) & 255; raw[o + 1] = (g + y) & 255; raw[o + 2] = b; }
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk("IHDR", ihdr), chunk("IDAT", zlib.deflateSync(raw)), chunk("IEND", Buffer.alloc(0))]);
};

// ---- Pages ----
const pageErrors = [];
const contexts = new Set();
// An empty browser on the same origin (another device): a new profile folder each time.
const freshOld = () => { const dir = path.join(OUT, "profile-fresh-old"); fs.rmSync(dir, { recursive: true, force: true }); return dir; };
const freshNew = () => { const dir = path.join(OUT, "profile-fresh-new"); fs.rmSync(dir, { recursive: true, force: true }); return dir; };
const launch = async (dir, options = {}) => {
  const ctx = await chromium.launchPersistentContext(dir, { executablePath: CHROME, acceptDownloads: true, timezoneId: "Europe/Berlin", locale: "en-GB", args: ["--disable-dev-shm-usage"], ...options });
  // Only the site itself: the analytics beacon of the pages (cloudflareinsights.com) is not part of the proof.
  await ctx.route((url) => !url.href.startsWith(BASE), (route) => route.abort());
  contexts.add(ctx);
  ctx.on("close", () => contexts.delete(ctx));
  return ctx;
};
const open = async (ctx, url, wait = 700) => {
  const page = await ctx.newPage();
  const errs = [];
  page.on("pageerror", (e) => { errs.push(e.message); pageErrors.push({ scenario, phase, site: served, url, error: e.message }); });
  page.on("console", (m) => { if (m.type() === "error" && !/Failed to load resource|favicon|net::ERR|cloudflareinsights/.test(m.text())) { errs.push(`console: ${m.text()}`); pageErrors.push({ scenario, phase, site: served, url, error: `console: ${m.text()}` }); } });
  page.on("dialog", (d) => { page.lastDialog = d.message(); d.accept().catch(() => {}); });
  page.errs = errs;
  await page.goto(`${BASE}${url}`, { waitUntil: "load" });
  await page.waitForTimeout(wait);
  return page;
};
// A radio answer, clicked as a visitor clicks it; tried again when the page redrew the question under the click.
const pick = async (page, selector) => {
  for (let i = 0; i < 4; i++) {
    await page.locator(selector).click({ force: true }).catch(() => {});
    await page.waitForTimeout(120);
    if (await page.locator(selector).isChecked().catch(() => false)) return;
  }
  throw new Error(`could not answer ${selector}`);
};
const noErrors = (tool, page) => check(tool, "no script error on the page", page.errs.length === 0, page.errs.join(" || "));
const json = (page, key) => page.evaluate((k) => { try { return JSON.parse(localStorage.getItem(k)); } catch { return localStorage.getItem(k); } }, key);
const text = (page, selector) => page.evaluate((s) => [...document.querySelectorAll(s)].map((n) => n.innerText).join("\n"), selector);
// Everything the browser keeps for the site: localStorage, and the four IndexedDB stores (ids only).
const snapshot = async (ctx, label) => {
  const page = await open(ctx, "/about.html", 200);
  const snap = await page.evaluate(async () => {
    const ls = {};
    for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); ls[k] = localStorage.getItem(k); }
    const dbs = (await indexedDB.databases()).map((d) => d.name);
    const all = (name, store) => new Promise((resolve) => {
      if (!dbs.includes(name)) { resolve(null); return; }
      const req = indexedDB.open(name);
      req.onsuccess = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(store)) { db.close(); resolve([]); return; }
        const tx = db.transaction(store, "readonly");
        const r = tx.objectStore(store).getAll();
        r.onsuccess = () => { db.close(); resolve(r.result); };
        r.onerror = () => { db.close(); resolve("error"); };
      };
      req.onerror = () => resolve("error");
    });
    const media = await all("sc-media", "photos");
    const points = await all("sc-restore", "points");
    const lock = await all("sc-lock", "blob");
    return {
      localStorage: ls,
      indexedDB: dbs,
      photos: Array.isArray(media) ? media.map((m) => ({ id: m.id, tool: m.tool, ref: m.ref, bytes: m.blob?.size ?? null })) : media,
      restorePoints: Array.isArray(points) ? points.map((p) => ({ id: p.id, reason: p.reason, keys: Object.keys(p.items || {}).length })) : points,
      lockRecord: Array.isArray(lock) ? lock.map((r) => ({ id: r.id, format: r.format, bytes: r.bytes })) : lock,
      sw: navigator.serviceWorker?.controller ? navigator.serviceWorker.controller.scriptURL : null,
    };
  });
  await page.close();
  results.snapshots[label] = snap;
  return snap;
};
const save = async (ctx, url, file) => {
  const page = await open(ctx, url);
  const [download] = await Promise.all([page.waitForEvent("download", { timeout: 15000 }), page.locator("[data-work-save]").first().click()]);
  await download.saveAs(file);
  await page.waitForTimeout(300);
  const status = await text(page, "[data-work-status]");
  await page.close();
  return { file, status, backup: JSON.parse(fs.readFileSync(file, "utf8")) };
};
const openBackup = async (ctx, url, file) => {
  const page = await open(ctx, url);
  const reload = page.waitForEvent("load", { timeout: 6000 }).then(() => true).catch(() => false);
  await page.locator("[data-work-open]").first().setInputFiles(file);
  let status = "";
  for (let i = 0; i < 20 && !status; i++) {
    await page.waitForTimeout(100);
    status = await page.locator("[data-work-status]").first().textContent().catch(() => "") || "";
  }
  const reloaded = await reload;
  await page.close();
  return { status, reloaded };
};

// ---- The work, made on a site ----
const ACTION = { title: "Replace the seal of dock door 3", owner: "Mira", due: "2026-11-05", area: "Dock 3", detail: "Draught at the door, cold chain" };
const PHOTO = path.join(OUT, "dock-2.png");
fs.writeFileSync(PHOTO, png(64, 48, [200, 40, 40]));

const makeActions = async (ctx) => {
  const page = await open(ctx, "/tools/action-tracker/");
  const exampleShown = await page.isVisible(".dl-example-note");
  const before = await json(page, "sc-actions");
  for (const [name, value] of Object.entries(ACTION)) await page.fill(`#at-${name}`, value);
  await page.click("form:has(#at-title) [type=submit]");
  await page.waitForTimeout(400);
  const after = await json(page, "sc-actions");
  check("Action Tracker", "a first visit shows the example, marked example: true", exampleShown && before?.rows?.length > 0 && before.rows.every((r) => r.example === true), `${before?.rows?.length ?? 0} example rows`);
  check("Action Tracker", "the own action replaces the example", after.rows.length === 1 && after.rows[0].title === ACTION.title && !after.rows[0].example, `${after.rows.length} rows`);
  noErrors("Action Tracker", page);
  await page.close();
};

const makeDamage = async (ctx, rows) => {
  const page = await open(ctx, "/tools/damage-control/");
  const before = { note: await page.isVisible(".dl-example-note"), stored: await json(page, "sc-damage-control") };
  for (const row of rows) {
    await page.fill("[data-entry] [name=date]", row.date);
    await page.fill("[data-entry] [name=units]", String(row.units));
    await page.fill("[data-entry] [name=note]", row.note);
    await page.click("[data-entry] [type=submit]");
    await page.waitForTimeout(300);
  }
  const after = await json(page, "sc-damage-control");
  noErrors("Damage Control", page);
  await page.close();
  return { before, after };
};

const make5S = async (ctx) => {
  const page = await open(ctx, "/tools/five-s-audit/", 900);
  await page.fill("#fs-area", "Dock 2");
  await page.fill("#fs-auditor", "Mira");
  const names = await page.evaluate(() => [...new Set([...document.querySelectorAll("[data-questions] input[type=radio]")].map((r) => r.name))]);
  for (const [i, name] of names.entries()) {
    const value = i === 0 ? "1" : "3";
    await pick(page, `input[name="${name}"][value="${value}"]`);
  }
  await page.fill('[data-note="sort-0"]', "Broken pallets stacked at dock 2");
  await page.locator(".fc-file").first().setInputFiles(PHOTO);
  await page.waitForTimeout(1500);
  // The hand-off: the audit's findings to the Action Tracker (from the walk, before the audit is saved).
  await page.click("[data-add-actions]");
  await page.waitForTimeout(500);
  const status = await text(page, "[data-audit-status]");
  await page.click("[data-save]");
  await page.waitForTimeout(1200);
  const stored = await json(page, "sc-five-s-audit");
  const photos = await page.evaluate(async () => (await window.MediaStore.list("five-s-audit")).map((p) => ({ id: p.id, ref: p.ref })));
  const actions = await json(page, "sc-actions");
  noErrors("5S Audit", page);
  await page.close();
  return { questions: names.length, stored, photos, status, actions };
};

const makeRooms = async (ctx) => {
  const page = await open(ctx, "/tools/room-inspection/", 900);
  const exampleRows = (await json(page, "sc-room-inspection"))?.rows?.length ?? 0;
  // Incomplete: three items judged, the rest left open.
  await page.fill("#ri-room", "214");
  await page.fill("#ri-attendant", "Ana");
  await page.fill("#ri-inspector", "Mira");
  const answers = await page.evaluate(() => [...new Set([...document.querySelectorAll("input[data-answer]")].map((r) => r.name))]);
  for (const name of answers.slice(0, 3)) await pick(page, `input[name="${name}"][value="pass"]`);
  await page.click("[data-save]");
  await page.waitForTimeout(700);
  const said1 = await text(page, "[data-walk-status], [role=status]");
  // Complete: every item judged.
  await page.fill("#ri-room", "215");
  await page.fill("#ri-attendant", "Ana");
  await page.fill("#ri-inspector", "Mira");
  await page.click("[data-rest-pass]");
  await page.waitForTimeout(200);
  await page.click("[data-save]");
  await page.waitForTimeout(700);
  const stored = await json(page, "sc-room-inspection");
  const log = await text(page, "[data-log], table");
  noErrors("Room Inspection", page);
  await page.close();
  return { exampleRows, answers: answers.length, stored, said1, log };
};

const COACH = "/roles/shift-lead/";
const coachState = (page) => json(page, "sc-coaching-v1");
const makeCoaching = async (ctx) => {
  const page = await open(ctx, COACH, 900);
  await page.fill('form[data-form="profile"] [name=name]', "Mira");
  await page.click('form[data-form="profile"] [type=submit]');
  await page.waitForTimeout(400);
  await page.click('[data-action="view"][data-view="project"]');
  await page.waitForTimeout(300);
  if (!(await page.$('form[data-form="create"]'))) {
    const newButton = await page.$('[data-action="new"]');
    if (newButton) { await newButton.click(); await page.waitForTimeout(300); }
  }
  await page.fill('form[data-form="create"] [name=title]', "Fewer missed handovers at the late shift");
  await page.fill('form[data-form="create"] [name=goal]', "Every handover has its open points");
  await page.fill('form[data-form="create"] [name=measure]', "Handovers with open points missing / all handovers");
  const deadline = await page.$('form[data-form="create"] [name=deadline]');
  if (deadline) await deadline.fill("2026-12-15");
  await page.click('form[data-form="create"] [type=submit]');
  await page.waitForTimeout(500);
  const created = await coachState(page);
  // The coaching backup (its own file), then the project changes, then the backup opens: a labelled copy.
  await page.click('[data-action="view"][data-view="backup"]');
  await page.waitForTimeout(300);
  const file = path.join(OUT, "coaching-backup-new.json");
  const [download] = await Promise.all([page.waitForEvent("download"), page.click('[data-action="export"]')]);
  await download.saveAs(file);
  await page.click('[data-action="view"][data-view="project"]');
  await page.waitForTimeout(300);
  await page.fill('form[data-form="brief"] [name=goal]', "Every handover has its open points and an owner for each");
  await page.click('form[data-form="brief"] [type=submit]');
  await page.waitForTimeout(400);
  await page.click('[data-action="view"][data-view="backup"]');
  await page.waitForTimeout(300);
  await page.locator('form[data-form="import"] [name=backup]').setInputFiles(file);
  await page.click('form[data-form="import"] [type=submit]');
  await page.waitForTimeout(800);
  const after = await coachState(page);
  const list = await text(page, ".coaching-list");
  noErrors("Coaching", page);
  await page.close();
  return { created, after, file, list };
};

const makeCv = async (ctx) => {
  const page = await open(ctx, "/tools/cv-builder/", 900);
  await page.fill("#cv-person-name", "Mira Example");
  await page.fill("#cv-person-headline", "Shift lead, outbound");
  await page.fill("#cv-profile", "Eight years in warehouse operations; leads a team of 24.");
  await page.waitForTimeout(800);
  noErrors("CV Builder", page);
  await page.close();
  const ats = await open(ctx, "/tools/ats-cv/", 900);
  await ats.fill("#ats-person-name", "Mira Example");
  await ats.fill("#ats-summary", "Shift lead with eight years in outbound logistics.");
  await ats.waitForTimeout(800);
  noErrors("ATS CV", ats);
  await ats.close();
};

const makeBoard = async (ctx) => {
  const page = await open(ctx, "/tools/daily-board/", 900);
  // The workplace setup is folded away: opened as a visitor opens it.
  if (!(await page.isVisible("#db-site"))) await page.locator("details:has(#db-site) > summary").first().click();
  await page.fill("#db-site", "Frankfurt hub, outbound");
  await page.fill("#db-shifts", "Early, Late");
  await page.fill("#db-areas", "Dock 1 · Anna\nDock 2 · Mira");
  await page.fill("#db-target-damage", "0.5");
  await page.waitForTimeout(700);
  const profile = await json(page, "sc-workplace");
  noErrors("Daily Board", page);
  await page.close();
  return profile;
};

const setThemeAndMotion = async (ctx) => {
  const page = await open(ctx, "/", 900);
  const before = await page.evaluate(() => document.documentElement.dataset.theme || "");
  await page.click("[data-theme-toggle]");
  const motion = await page.$("[data-motion-toggle]");
  if (motion) await motion.click();
  await page.waitForTimeout(300);
  const stored = await page.evaluate(() => ({ theme: localStorage.getItem("sc-theme"), motion: localStorage.getItem("sc-motion") }));
  noErrors("Theme and motion", page);
  await page.close();
  return { before, stored };
};

const lockWithPin = async (ctx, pin) => {
  const page = await open(ctx, "/tools/action-tracker/");
  await page.click("[data-wl-lock]");
  await page.fill("[data-wl-pin-form] [name=pin]", pin);
  await page.fill("[data-wl-pin-form] [name=again]", pin);
  const reload = page.waitForEvent("load", { timeout: 20000 });
  await page.click("[data-wl-pin-form] [type=submit]");
  await reload;
  await page.waitForTimeout(800);
  const dialog = await page.isVisible("[data-work-lock-dialog]");
  const keys = await page.evaluate(() => Object.keys(localStorage).sort());
  await page.close();
  return { dialog, keys };
};
const unlockWithPin = async (ctx, pin) => {
  const page = await open(ctx, "/tools/action-tracker/");
  const dialog = await page.isVisible("[data-work-lock-dialog]");
  await page.fill("[data-work-lock-dialog] [name=pin]", pin);
  const reload = page.waitForEvent("load", { timeout: 20000 });
  await page.click("[data-work-lock-dialog] [type=submit]");
  await reload;
  await page.waitForTimeout(800);
  const after = await page.isVisible("[data-work-lock-dialog]");
  await page.close();
  return { dialog, after };
};

// ---- The checks of one tool on whatever site is served ----
// The tracker opens on "Open and in progress"; "All" shows the done ones too.
const actionsOnPage = async (ctx) => {
  const page = await open(ctx, "/tools/action-tracker/");
  await page.click('[data-status="all"]');
  await page.waitForTimeout(300);
  const ui = await page.evaluate(() => [...document.querySelectorAll('select[aria-label^="Status: "]')].map((s) => s.getAttribute("aria-label").replace(/^Status: /, "")));
  const stored = await json(page, "sc-actions");
  const exampleNote = await page.isVisible(".dl-example-note");
  const counts = await page.evaluate(() => window.ActionsStore?.counts?.());
  noErrors("Action Tracker", page);
  return { page, ui, stored, exampleNote, counts };
};

// ---- Scenario 1: rollback and forward again, one browser ----
const rollbackAndForward = async () => {
  scenario = "rollback";
  const profile = path.join(OUT, "profile-main");
  fs.rmSync(profile, { recursive: true, force: true });
  const ctx = await launch(profile);

  // 1. NEW: the work.
  phase = "1 new: the work";
  serve("new");
  const look = await setThemeAndMotion(ctx);
  check("Theme and motion", "the theme and the motion pause are kept", look.stored.theme && look.stored.motion === "paused", look.stored);
  await makeActions(ctx);
  const dmg = await makeDamage(ctx, [{ date: "2026-10-26", units: 3, note: "Crushed cartons, lane 4" }, { date: "2026-10-27", units: 2, note: "Wet pallet, dock 2" }]);
  check("Damage Control", "first visit opens on the example, the own rows replace it", dmg.before.note && dmg.after.rows.length === 2 && dmg.after.rows.every((r) => !r.example), `example shown ${dmg.before.note} (stored: ${dmg.before.stored ? "yes" : "not until a change"}) → ${dmg.after.rows.length} rows`);
  const five = await make5S(ctx);
  check("5S Audit", "the audit is saved with its photo", five.stored?.rows?.length === 1 && five.photos.length === 1, `${five.stored?.rows?.length} audits, ${five.photos.length} photos, ${five.questions} questions`);
  check("Action Tracker", "the 5S finding is handed off to the tracker", five.actions.rows.length === 2 && five.actions.rows.some((r) => r.source === "five-s-audit"), `${five.actions.rows.length} actions; "${five.status}"`);
  const rooms = await makeRooms(ctx);
  const own = (rooms.stored?.rows || []).filter((r) => !String(r.id).startsWith("ex-"));
  check("Room Inspection", "an incomplete and a complete inspection are saved", own.length === 2, `${rooms.exampleRows} example rows first; now ${rooms.stored?.rows?.length} rows, ${own.length} own; items ${rooms.answers}`);
  results.roomsNew = { said: rooms.said1, rows: rooms.stored?.rows?.map((r) => ({ id: r.id, room: r.room, answers: Object.keys(r.answers || {}).length })) };
  const coach = await makeCoaching(ctx);
  const titles = coach.after?.projects?.map((p) => p.title) || [];
  check("Coaching", "a project and its labelled copy from the coaching backup", titles.length === 2 && coach.after.projects.some((p) => p.copyOf), titles);
  await makeCv(ctx);
  const board = await makeBoard(ctx);
  check("Daily Board", "the workplace profile is kept", board?.site === "Frankfurt hub, outbound" && board.areas.length === 2, board);
  const s1 = await snapshot(ctx, "1-new-work");

  // 2. NEW: "Save all my work", then lock with a 6-character PIN and unlock.
  phase = "2 new: save, lock, unlock";
  const saved = await save(ctx, "/tools.html", path.join(OUT, "work-saved-by-new.json"));
  check("Save all my work", "the file of the new site holds the work and the photo", Object.keys(saved.backup.items).length > 5 && saved.backup.media?.length === 1, `${Object.keys(saved.backup.items).length} keys, ${saved.backup.media?.length ?? 0} photos; "${saved.status}"`);
  const locked = await lockWithPin(ctx, "482915");
  check("Work lock", "locked with a 6-character PIN: the dialog, no work left in plain text", locked.dialog && !locked.keys.some((k) => ["sc-actions", "sc-damage-control", "sc-coaching-v1"].includes(k)), locked.keys);
  const unlocked = await unlockWithPin(ctx, "482915");
  check("Work lock", "the PIN unlocks", unlocked.dialog && !unlocked.after);
  const s2 = await snapshot(ctx, "2-new-after-unlock");
  const sameAfterUnlock = Object.keys(s1.localStorage).filter((k) => s1.localStorage[k] !== s2.localStorage[k]);
  check("Work lock", "after the unlock every key is as before", sameAfterUnlock.length === 0, sameAfterUnlock);
  check("Work lock", "after the unlock the photo is back", s2.photos?.length === 1, s2.photos);

  // 3. OLD: the rollback.
  phase = "3 old: rollback";
  serve("old");
  const keysBefore = { ...s2.localStorage };
  {
    const { page, ui, stored, exampleNote, counts } = await actionsOnPage(ctx);
    check("Action Tracker", "both actions shown, no example, none duplicated", ui.length === 2 && !exampleNote && new Set(ui).size === 2, ui);
    check("Action Tracker", "the stored list is unchanged by the old page", JSON.stringify(stored) === keysBefore["sc-actions"], counts);
    // Edit on the old site: the hand-off action done, one more action.
    const sel = page.locator('select[aria-label^="Status: "]').nth(1);
    const editedTitle = (await sel.getAttribute("aria-label")).replace(/^Status: /, "");
    await sel.selectOption("done");
    await page.waitForTimeout(300);
    await page.fill("#at-title", "Old site: order a second scanner");
    await page.fill("#at-owner", "Anna");
    await page.click("form:has(#at-title) [type=submit]");
    await page.waitForTimeout(400);
    const after = await json(page, "sc-actions");
    check("Action Tracker", "editable on the old site (status changed, one action added)", after.rows.length === 3 && after.rows.find((r) => r.title === editedTitle)?.status === "done", `${after.rows.length} actions`);
    noErrors("Action Tracker", page);
    await page.close();
  }
  {
    const page = await open(ctx, "/tools/damage-control/");
    const stored = await json(page, "sc-damage-control");
    const rows = await page.locator("[data-log] [data-remove]").count();
    const exampleNote = await page.isVisible(".dl-example-note");
    check("Damage Control", "the two own rows shown, no example", rows === 2 && !exampleNote && JSON.stringify(stored) === keysBefore["sc-damage-control"], `${rows} rows`);
    await page.fill("[data-entry] [name=date]", "2026-10-28");
    await page.fill("[data-entry] [name=units]", "1");
    await page.fill("[data-entry] [name=note]", "Old site: torn bag, lane 1");
    await page.click("[data-entry] [type=submit]");
    await page.waitForTimeout(300);
    const after = await json(page, "sc-damage-control");
    check("Damage Control", "a row added on the old site", after.rows.length === 3, `${after.rows.length} rows; fields of a row: ${Object.keys(after.rows[0]).join(",")}`);
    noErrors("Damage Control", page);
    await page.close();
  }
  {
    const page = await open(ctx, "/tools/five-s-audit/", 900);
    const stored = await json(page, "sc-five-s-audit");
    const logText = await text(page, "[data-log]");
    const photos = await page.evaluate(async () => (window.MediaStore ? (await window.MediaStore.list("five-s-audit")).map((p) => ({ id: p.id, ref: p.ref, type: p.blob?.type, size: p.blob?.size })) : null));
    const photoButton = await page.locator("[data-log] button").filter({ hasText: /photo|Photo/ }).count();
    check("5S Audit", "the audit is shown with its photo", stored?.rows?.length === 1 && /Dock 2/.test(logText) && photos?.length === 1, { photos, photoButton });
    noErrors("5S Audit", page);
    await page.close();
  }
  {
    const page = await open(ctx, "/tools/room-inspection/", 900);
    const stored = await json(page, "sc-room-inspection");
    const rowsText = await page.evaluate(() => [...document.querySelectorAll("tr")].filter((tr) => /\b21[45]\b/.test(tr.innerText)).map((tr) => tr.innerText.replace(/\s+/g, " ").trim()));
    check("Room Inspection", "both inspections shown", rowsText.length >= 2 && JSON.stringify(stored) === keysBefore["sc-room-inspection"], rowsText);
    const incomplete = rowsText.find((t) => /\b214\b/.test(t)) || "";
    note("Room Inspection", `the incomplete inspection of room 214 reads on the old site: "${incomplete}"`);
    noErrors("Room Inspection", page);
    await page.close();
  }
  {
    const page = await open(ctx, COACH, 900);
    await page.click('[data-action="view"][data-view="backup"]');
    await page.waitForTimeout(300);
    const list = await text(page, ".coaching-list");
    const state = await coachState(page);
    check("Coaching", "both projects shown, the labelled copy among them", state?.projects?.length === 2 && list.split("\n").filter((l) => /handovers/.test(l)).length >= 2, list.replace(/\n/g, " | "));
    // Edit on the old site: an action on the labelled copy.
    const copy = state.projects.find((p) => p.copyOf);
    await page.goto(`${BASE}${COACH}?project=${copy.id}#coaching`);
    await page.waitForTimeout(800);
    await page.click('[data-action="view"][data-view="project"]').catch(() => {});
    await page.waitForTimeout(300);
    await page.fill('form[data-form="action"] [name=action]', "Old site: brief the late shift on the checklist");
    await page.fill('form[data-form="action"] [name=owner]', "Mira");
    await page.click('form[data-form="action"] [type=submit]');
    await page.waitForTimeout(400);
    const after = await coachState(page);
    const copyAfter = after.projects.find((p) => p.id === copy.id);
    check("Coaching", "editable on the old site: an action added to the copy", copyAfter?.actions?.length === copy.actions.length + 1, `${copyAfter?.actions?.length} actions`);
    check("Coaching", "the copy keeps its copyOf mark after the old site saved it", copyAfter?.copyOf === copy.copyOf, `copyOf ${copyAfter?.copyOf ?? "gone"}`);
    noErrors("Coaching", page);
    await page.close();
  }
  {
    const page = await open(ctx, "/tools/cv-builder/", 900);
    const values = await page.evaluate(() => ({ name: document.querySelector("#cv-person-name").value, headline: document.querySelector("#cv-person-headline").value }));
    check("CV Builder", "the CV is shown", values.name === "Mira Example" && values.headline === "Shift lead, outbound", values);
    await page.fill("#cv-person-headline", "Shift lead, outbound and returns");
    await page.waitForTimeout(800);
    noErrors("CV Builder", page);
    await page.close();
    const ats = await open(ctx, "/tools/ats-cv/", 900);
    const atsValues = await ats.evaluate(() => ({ name: document.querySelector("#ats-person-name").value, summary: document.querySelector("#ats-summary").value }));
    check("ATS CV", "the ATS CV is shown", atsValues.name === "Mira Example" && /eight years/.test(atsValues.summary), atsValues);
    noErrors("ATS CV", ats);
    await ats.close();
  }
  {
    const page = await open(ctx, "/tools/daily-board/", 900);
    const values = await page.evaluate(() => ({ site: document.querySelector("#db-site")?.value, areas: document.querySelector("#db-areas")?.value }));
    const profileNow = await json(page, "sc-workplace");
    check("Daily Board", "the workplace profile is shown and not replaced by the demo", values.site === "Frankfurt hub, outbound" && profileNow?.site === "Frankfurt hub, outbound", values);
    const exampleNote = await page.isVisible(".dl-example-note");
    note("Daily Board", `the old Daily Board ${exampleNote ? "opens on its example" : "opens without its example"}; sc-daily-board ${await page.evaluate(() => (localStorage.getItem("sc-daily-board") ? "now stored" : "not stored"))}`);
    noErrors("Daily Board", page);
    await page.close();
  }
  {
    const page = await open(ctx, "/", 900);
    const look = await page.evaluate(() => ({ theme: document.documentElement.dataset.theme || "", stored: localStorage.getItem("sc-theme"), motion: localStorage.getItem("sc-motion"), paused: document.documentElement.dataset.motion || document.documentElement.className }));
    check("Theme and motion", "the theme chosen on the new site applies on the old one", look.theme === look.stored, look);
    note("Theme and motion", `the old site has no stored motion choice: sc-motion stays "${look.motion}" in storage, the home page shows ${look.paused || "its default"}`);
    noErrors("Theme and motion", page);
    await page.close();
  }
  {
    const page = await open(ctx, "/tools.html");
    const lockUi = await page.$("[data-work-lock]");
    check("Work lock", "the old site has no work lock (nothing to open, nothing locked)", !lockUi);
    await page.close();
  }
  const s3 = await snapshot(ctx, "3-old-after-edits");

  // 3b. The file saved by the new site, opened by the old site in an empty browser.
  {
    const fresh = await launch(freshOld());
    const opened = await openBackup(fresh, "/tools.html", path.join(OUT, "work-saved-by-new.json"));
    const s = await snapshot(fresh, "3b-old-empty-browser-opens-new-file");
    const fileKeys = Object.keys(saved.backup.items);
    const missing = fileKeys.filter((k) => s.localStorage[k] !== saved.backup.items[k]);
    check("Save all my work", "the new site's file opens in the old site: every key restored", opened.reloaded && missing.length === 0, `"${opened.status}"; missing ${missing.join(",") || "none"}`);
    check("Save all my work", "its photo comes back in the old site", (s.photos || []).length === 1, `${(s.photos || []).length} photos: the old site reads no photos from a file (they stay in the file)`);
    const p = await open(fresh, "/tools/action-tracker/");
    const n = await p.locator('select[aria-label^="Status: "]').count();
    check("Save all my work", "after opening it, the old Action Tracker shows the 2 actions", n === 2, `${n}`);
    await p.close();
    await fresh.close();
  }

  // 3c. "Save all my work" on the old site, kept for step 5.
  const savedOld = await save(ctx, "/tools.html", path.join(OUT, "work-saved-by-old.json"));
  const oldKeys = Object.keys(savedOld.backup.items);
  note("Save all my work", `the old site's file holds ${oldKeys.length} keys: ${oldKeys.join(", ")}`);

  // 4. NEW again: forward.
  phase = "4 new: forward again";
  scenario = "forward";
  serve("new");
  {
    const { page, ui, stored, exampleNote } = await actionsOnPage(ctx);
    check("Action Tracker", "the 3 actions shown (2 from before, 1 from the old site), none duplicated, no example", ui.length === 3 && new Set(ui).size === 3 && !exampleNote, ui);
    check("Action Tracker", "the status set on the old site is kept", stored.rows.filter((r) => r.status === "done").length === 1);
    noErrors("Action Tracker", page);
    await page.close();
  }
  {
    const page = await open(ctx, "/tools/damage-control/");
    const rows = await page.locator("[data-log] [data-remove]").count();
    const stored = await json(page, "sc-damage-control");
    check("Damage Control", "3 rows, none an example, none duplicated", rows === 3 && stored.rows.every((r) => !r.example) && !(await page.isVisible(".dl-example-note")), `${rows} rows`);
    noErrors("Damage Control", page);
    await page.close();
  }
  {
    const page = await open(ctx, "/tools/five-s-audit/", 900);
    const stored = await json(page, "sc-five-s-audit");
    const photos = await page.evaluate(async () => (await window.MediaStore.list("five-s-audit")).length);
    check("5S Audit", "the audit and its photo", stored.rows.length === 1 && photos === 1, `${stored.rows.length} audits, ${photos} photos`);
    noErrors("5S Audit", page);
    await page.close();
  }
  {
    const page = await open(ctx, "/tools/room-inspection/", 900);
    const rowsText = await page.evaluate(() => [...document.querySelectorAll("tr")].filter((tr) => /\b21[45]\b/.test(tr.innerText)).map((tr) => tr.innerText.replace(/\s+/g, " ").trim()));
    check("Room Inspection", "both inspections, 214 incomplete again", rowsText.length >= 2 && rowsText.some((t) => /214/.test(t) && /Incomplete/.test(t)), rowsText);
    noErrors("Room Inspection", page);
    await page.close();
  }
  {
    const page = await open(ctx, COACH, 900);
    const state = await coachState(page);
    check("Coaching", "both projects, the old site's action kept", state.projects.length === 2 && state.projects.some((p) => p.actions.some((a) => /Old site/.test(a.text))), state.projects.map((p) => `${p.title} (${p.actions.length} actions)`));
    // The same coaching backup opened again: nothing new.
    await page.click('[data-action="view"][data-view="backup"]');
    await page.waitForTimeout(300);
    await page.locator('form[data-form="import"] [name=backup]').setInputFiles(coach.file);
    await page.click('form[data-form="import"] [type=submit]');
    await page.waitForTimeout(800);
    const again = await coachState(page);
    check("Coaching", "the same coaching backup opened again adds nothing (copyOf survived the old site)", again.projects.length === 2, `${again.projects.length} projects`);
    noErrors("Coaching", page);
    await page.close();
  }
  {
    const page = await open(ctx, "/tools/cv-builder/", 900);
    const headline = await page.evaluate(() => document.querySelector("#cv-person-headline").value);
    check("CV Builder", "the headline edited on the old site is kept", headline === "Shift lead, outbound and returns", headline);
    noErrors("CV Builder", page);
    await page.close();
  }
  {
    const page = await open(ctx, "/tools/daily-board/", 900);
    const profileNow = await json(page, "sc-workplace");
    check("Daily Board", "the workplace profile is kept", profileNow?.site === "Frankfurt hub, outbound" && profileNow.areas.length === 2, profileNow);
    noErrors("Daily Board", page);
    await page.close();
  }
  {
    const page = await open(ctx, "/", 900);
    const look = await page.evaluate(() => ({ theme: document.documentElement.dataset.theme || "", stored: localStorage.getItem("sc-theme"), motion: localStorage.getItem("sc-motion"), pressed: document.querySelector("[data-motion-toggle]")?.getAttribute("aria-pressed") }));
    check("Theme and motion", "the theme and the motion pause hold again", look.theme === look.stored && look.motion === "paused", look);
    await page.close();
  }
  const s4 = await snapshot(ctx, "4-new-forward");
  check("All", "no key of the work lost between step 2 and step 4", Object.keys(s2.localStorage).every((k) => k in s4.localStorage), Object.keys(s2.localStorage).filter((k) => !(k in s4.localStorage)));
  check("All", "the photo store holds one photo", s4.photos?.length === 1, s4.photos);

  // 4b. The file saved by the old site, opened by the new site in an empty browser.
  {
    const fresh = await launch(freshNew());
    const opened = await openBackup(fresh, "/tools.html", savedOld.file);
    const s = await snapshot(fresh, "4b-new-empty-browser-opens-old-file");
    const missing = oldKeys.filter((k) => s.localStorage[k] !== savedOld.backup.items[k]);
    check("Save all my work", "the old site's file opens in the new site", opened.reloaded && missing.length === 0, `"${opened.status}"; not restored: ${missing.join(",") || "none"}`);
    results.oldFileInNew = { status: opened.status, reloaded: opened.reloaded, notRestored: missing };
    await fresh.close();
  }
  await ctx.close();
};

// ---- Scenario 2: the site rolled back while the tools are locked ----
const rollbackWhileLocked = async () => {
  scenario = "rollback-while-locked";
  const profile = path.join(OUT, "profile-locked");
  fs.rmSync(profile, { recursive: true, force: true });
  const ctx = await launch(profile);
  phase = "1 new: work, locked";
  serve("new");
  await makeActions(ctx);
  await makeDamage(ctx, [{ date: "2026-10-26", units: 3, note: "Crushed cartons, lane 4" }, { date: "2026-10-27", units: 2, note: "Wet pallet, dock 2" }]);
  const before = await snapshot(ctx, "L1-new-before-lock");
  const locked = await lockWithPin(ctx, "482915");
  check("Work lock", "locked with a 6-character PIN", locked.dialog, locked.keys);
  const afterLock = await snapshot(ctx, "L1b-new-locked");

  phase = "2 old: rollback while locked";
  serve("old");
  {
    const page = await open(ctx, "/tools/damage-control/");
    const rows = await page.locator("[data-log] [data-remove]").count();
    const exampleNote = await page.isVisible(".dl-example-note");
    const own = (await text(page, "[data-log]")).includes("lane 4");
    check("Damage Control", "the locked work is visible on the old site", own, `${rows} rows shown, example note ${exampleNote ? "shown" : "hidden"}, own rows ${own ? "shown" : "not shown"}`);
    await page.fill("[data-entry] [name=date]", "2026-10-28");
    await page.fill("[data-entry] [name=units]", "4");
    await page.fill("[data-entry] [name=note]", "Old site while locked: crushed cage, dock 1");
    await page.click("[data-entry] [type=submit]");
    await page.waitForTimeout(300);
    const after = await json(page, "sc-damage-control");
    note("Damage Control", `on the old site, with the work locked away, the visitor adds a row: the log now holds ${after.rows.length} row(s)`);
    noErrors("Damage Control", page);
    await page.close();
    const tracker = await open(ctx, "/tools/action-tracker/");
    const shown = await tracker.evaluate(() => [...document.querySelectorAll('select[aria-label^="Status: "]')].map((s) => s.getAttribute("aria-label").replace(/^Status: /, "")));
    note("Action Tracker", `the old tracker shows ${shown.length} action(s): ${shown.join(" / ")}`);
    await tracker.close();
  }
  const mid = await snapshot(ctx, "L2-old-while-locked");
  const oldWrote = Object.keys(mid.localStorage).filter((k) => mid.localStorage[k] !== afterLock.localStorage[k]);
  note("All", `keys the old site wrote while the work was locked away: ${oldWrote.join(", ")}`);
  // "Save all my work" on the old site now: what the file holds, and whether the new site opens it.
  const lockedFile = await save(ctx, "/tools.html", path.join(OUT, "work-saved-by-old-while-locked.json"));
  note("Save all my work", `the old site's file made while locked holds: ${Object.keys(lockedFile.backup.items).join(", ")}`);

  phase = "3 new: forward, unlock";
  serve("new");
  const unlocked = await unlockWithPin(ctx, "482915");
  check("Work lock", "the new site still asks for the PIN, and it unlocks", unlocked.dialog && !unlocked.after);
  {
    const page = await open(ctx, "/tools/damage-control/");
    const stored = await json(page, "sc-damage-control");
    const notes = (stored?.rows || []).map((r) => r.note);
    check("Damage Control", "the row added on the old site while locked survives the unlock", notes.some((n) => /while locked/.test(n)), notes);
    check("Damage Control", "the locked rows are back", notes.includes("Crushed cartons, lane 4") && notes.includes("Wet pallet, dock 2"), notes);
    await page.close();
    const tracker = await open(ctx, "/tools/action-tracker/");
    const rows = (await json(tracker, "sc-actions"))?.rows || [];
    check("Action Tracker", "after the unlock: the own action, no example", rows.length === 1 && !rows[0].example, rows.map((r) => `${r.title}${r.example ? " (example)" : ""}`));
    await tracker.close();
  }
  const end = await snapshot(ctx, "L3-new-after-unlock");
  results.lockedScenario = { lockedKeys: locked.keys, oldWrote, restorePointsAfter: end.restorePoints, photosAfter: end.photos };
  await ctx.close();
  {
    const fresh = await launch(freshNew());
    const opened = await openBackup(fresh, "/tools.html", lockedFile.file);
    check("Save all my work", "the old site's file made while locked opens in the new site", opened.reloaded, `"${opened.status}"`);
    await fresh.close();
  }
};

// ---- Scenario 3: rolled back while only the Action Tracker's example is stored ----
const rollbackWithExample = async () => {
  scenario = "rollback-with-example";
  const profile = path.join(OUT, "profile-example");
  fs.rmSync(profile, { recursive: true, force: true });
  const ctx = await launch(profile);
  phase = "1 new: the examples are opened";
  serve("new");
  for (const url of ["/tools/action-tracker/", "/tools/damage-control/"]) { const p = await open(ctx, url); await p.close(); }
  const s = await snapshot(ctx, "E1-new-examples");
  const exampleRows = JSON.parse(s.localStorage["sc-actions"]).rows.length;
  check("Action Tracker", "the example is stored, marked", JSON.parse(s.localStorage["sc-actions"]).rows.every((r) => r.example === true), `${exampleRows} rows`);

  phase = "2 old: rollback, a hand-off and an own row";
  serve("old");
  {
    const page = await open(ctx, "/tools/action-tracker/");
    const exampleNote = await page.isVisible(".dl-example-note");
    const counts = await page.evaluate(() => window.ActionsStore.counts());
    note("Action Tracker", `the old tracker shows the new site's example ${exampleNote ? "with" : "WITHOUT"} its example note; ActionsStore.counts() = ${JSON.stringify(counts)}`);
    await page.fill("#at-title", "Old site: fix the dock leveller");
    await page.fill("#at-owner", "Anna");
    await page.click("form:has(#at-title) [type=submit]");
    await page.waitForTimeout(400);
    const rows = (await json(page, "sc-actions")).rows;
    note("Action Tracker", `after one own action on the old site the list holds ${rows.length} actions, ${rows.filter((r) => r.example === true).length} still marked example`);
    await page.close();
  }
  {
    const page = await open(ctx, "/tools/damage-control/");
    const exampleNote = await page.isVisible(".dl-example-note");
    await page.fill("[data-entry] [name=date]", "2026-10-28");
    await page.fill("[data-entry] [name=units]", "1");
    await page.fill("[data-entry] [name=note]", "Old site: own row");
    await page.click("[data-entry] [type=submit]");
    await page.waitForTimeout(300);
    const rows = (await json(page, "sc-damage-control")).rows;
    check("Damage Control", "the old site reads the new example as an example, and the own row replaces it", exampleNote && rows.length === 1, `example note ${exampleNote}; ${rows.length} rows`);
    await page.close();
  }
  phase = "3 new: forward";
  serve("new");
  {
    const page = await open(ctx, "/tools/action-tracker/");
    const rows = (await json(page, "sc-actions")).rows;
    const ui = await page.locator('select[aria-label^="Status: "]').count();
    const exampleNote = await page.isVisible(".dl-example-note");
    const counts = await page.evaluate(() => window.ActionsStore.counts());
    check("Action Tracker", "forward: only the own action counts, the example does not come back as real work", counts.total === 1, `${rows.length} stored, ${ui} shown, example note ${exampleNote}; counts ${JSON.stringify(counts)}`);
    await page.close();
  }
  await ctx.close();
};

(async () => {
  for (const which of ["new", "old"]) {
    const file = path.join(SITES[which], "js/work-backup.js");
    results.sites[which] = { dir: SITES[which], hasWorkLock: fs.existsSync(path.join(SITES[which], "js/work-lock.js")), workBackupBytes: fs.statSync(file).size };
  }
  await new Promise((resolve) => server.listen(PORT, "127.0.0.1", resolve));
  const only = process.env.ONLY ? process.env.ONLY.split(",") : ["main", "locked", "example"];
  try {
    if (only.includes("main")) await rollbackAndForward();
    if (only.includes("locked")) await rollbackWhileLocked();
    if (only.includes("example")) await rollbackWithExample();
  } catch (error) {
    results.errors.push(`${scenario}/${phase}: ${error.stack || error}`);
    console.error(error);
  } finally {
    results.pageErrors = pageErrors;
    const summary = { checks: results.checks.length, failed: results.checks.filter((c) => !c.ok).length, pageErrors: pageErrors.length, runErrors: results.errors.length };
    results.summary = summary;
    fs.writeFileSync(path.join(process.env.RESULTS || path.join(__dirname, "results.json")), `${JSON.stringify(results, null, 2)}\n`);
    console.log(JSON.stringify(summary));
    for (const ctx of contexts) await ctx.close().catch(() => {});
    server.close();
    process.exit(0);
  }
})();
