// Phase 5A in a real browser (playwright.config.mjs runs this file in the 1440 px light project only): the service
// worker keeps the tools of a role whole offline across two deploys. A static server of this spec serves the built
// site (_site) as build D1, then the same site with a changed shared script (D2) and a changed shared stylesheet
// (D3), the pages that name them rewritten to the new versions, exactly as a deploy does. Offline is the server
// closed, so the worker's own fetches fail too (the browser's offline switch does not reach a worker). Each test
// runs in its own browser context with its own storage. With SW_JS pointing at the worker of 0b995e82 the spec
// fails at the first offline check after D2: that run is the proof the defect was real in a browser.
import { test, expect } from "./fixtures.mjs";
import { createServer } from "node:http";
import { createHash } from "node:crypto";
import { readFile, readdir, stat, mkdtemp, writeFile, mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, extname, join, resolve, relative } from "node:path";

const SITE = resolve(process.cwd(), "_site");
// The port is the system's choice the first time and kept for the rest of the file: the worker's origin must not change.
let PORT = 0;
let BASE = "";
const CACHE = "sc-offline-v1";
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".woff2": "font/woff2", ".webmanifest": "application/manifest+json" };

const state = { overlay: null, phase: "start", log: [], server: null, online: false };
const flat = async (dir) => {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await flat(path))); else out.push(path);
  }
  return out;
};
const hash = (text) => createHash("sha1").update(text).digest("hex").slice(0, 10);

// A build as an overlay: the changed files and every HTML page that names them, rewritten to the new versions.
const makeOverlay = async (root, changes) => {
  const dir = await mkdtemp(join(tmpdir(), "sc-build-"));
  const pages = (await flat(SITE)).filter((f) => f.endsWith(".html"));
  const rewrites = [];
  for (const [path, change] of changes) {
    const original = await readFile(join(SITE, path), "utf8");
    const next = change(original);
    await mkdir(dirname(join(dir, path)), { recursive: true });
    await writeFile(join(dir, path), next);
    const sample = await readFile(join(SITE, "tools/room-inspection/index.html"), "utf8");
    const escaped = path.replace(/[.*+?^$()|[\]\\{}]/g, "\\$&");
    const old = sample.match(new RegExp(escaped + "\\?v=([0-9a-f]+)"));
    if (!old) throw new Error(`no version for ${path} in the built pages`);
    rewrites.push([`${path}?v=${old[1]}`, `${path}?v=${hash(next)}`]);
  }
  for (const page of pages) {
    const rel = relative(SITE, page);
    const base = root ? await readFile(join(root, rel), "utf8").catch(() => null) : null;
    const html = base ?? await readFile(page, "utf8");
    let out = html;
    for (const [from, to] of rewrites) out = out.split(from).join(to);
    if (out !== html || base !== null) { await mkdir(dirname(join(dir, rel)), { recursive: true }); await writeFile(join(dir, rel), out); }
  }
  // Files changed in an earlier overlay stay changed.
  if (root) for (const f of (await flat(root)).filter((f) => !f.endsWith(".html"))) { const rel = relative(root, f); await mkdir(dirname(join(dir, rel)), { recursive: true }); await writeFile(join(dir, rel), await readFile(f)); }
  return { dir, rewrites };
};
const fileFor = async (pathname) => {
  const rel = decodeURIComponent(pathname).replace(/^\/+/, "");
  for (const root of [state.overlay, SITE].filter(Boolean)) {
    const path = join(root, rel);
    if (!path.startsWith(root)) continue;
    try {
      const info = await stat(path);
      if (info.isFile()) return path;
      if (info.isDirectory()) { await stat(join(path, "index.html")); return join(path, "index.html"); }
    } catch { /* next root */ }
  }
  return null;
};
const serve = () => new Promise((ok) => {
  state.server = createServer(async (request, response) => {
    const { pathname } = new URL(request.url, BASE);
    state.log.push({ phase: state.phase, url: request.url });
    let file = await fileFor(pathname);
    if (pathname === "/sw.js" && process.env.SW_JS) file = process.env.SW_JS;
    if (!file) { response.writeHead(404, { "content-type": "text/html" }); response.end("not found"); return; }
    response.writeHead(200, { "content-type": types[extname(file).toLowerCase()] || "application/octet-stream", "cache-control": "no-store" });
    response.end(await readFile(file));
  });
  state.server.listen(PORT, "127.0.0.1", () => { PORT = state.server.address().port; BASE = `http://127.0.0.1:${PORT}`; state.online = true; ok(); });
});
const goOffline = () => new Promise((ok) => { state.server.closeAllConnections(); state.server.close(() => { state.online = false; ok(); }); });
const goOnline = () => serve();
const requests = (phase) => state.log.filter((r) => r.phase === phase);

// One worker, one server, the tests in order: the second test starts from a fresh context but the same build.
test.describe.configure({ mode: "serial" });
let d2, d3;
test.beforeAll(async () => {
  d2 = await makeOverlay(null, [["js/tool-kit.js", (js) => `${js}\n;window.__swBuild="D2";`], ["js/room-inspection.js", (js) => `${js}\n;window.__swPageBuild="D2";`]]);
  d3 = await makeOverlay(d2.dir, [["styles-tool.css", (css) => `${css}\n.sw-build-marker{--sw-build:"D3"}`]]);
  await serve();
});
test.afterAll(async () => { if (state.online) await goOffline(); });

// The worker in charge of the page, and the keep finished: the cache lists the page and its role's tools.
const waitForKept = async (page, paths) => {
  await page.evaluate(() => navigator.serviceWorker.ready);
  await expect.poll(async () => page.evaluate(async (want) => {
    const cache = await caches.open("sc-offline-v1");
    const keys = (await cache.keys()).map((k) => new URL(k.url).pathname);
    return want.every((p) => keys.includes(p));
  }, paths), { timeout: 30000 }).toBe(true);
  // And the keep finished. The new worker says so through its index; a worker without one (the worker of
  // 0b995e82, when SW_JS points at it) is given time until the cache stops growing.
  const hasIndex = await page.evaluate(async () => Boolean(await (await caches.open("sc-offline-v1")).match("/__sw/refs")));
  if (hasIndex) {
    await expect.poll(async () => page.evaluate(async (want) => {
      const cache = await caches.open("sc-offline-v1");
      const refs = await cache.match("/__sw/refs").then((r) => (r ? r.json() : null)).catch(() => null);
      return Boolean(refs) && want.every((p) => Array.isArray(refs.docs[location.origin + p] || refs.docs[p.split("?")[0]]));
    }, paths), { timeout: 30000 }).toBe(true);
  } else {
    let last = -1;
    await expect.poll(async () => { const n = await page.evaluate(async () => (await (await caches.open("sc-offline-v1")).keys()).length); const same = n === last; last = n; return same; }, { timeout: 30000, intervals: [2000] }).toBe(true);
  }
};
// The worker's index names `asset` for `path` (the refresh of that page is written); without an index (the old
// worker) a moment is given instead, so the spec reaches the offline checks either way.
const waitForRefresh = async (page, path, asset) => {
  const hasIndex = await page.evaluate(async () => Boolean(await (await caches.open("sc-offline-v1")).match("/__sw/refs")));
  if (!hasIndex) { await page.waitForTimeout(3000); return; }
  await expect.poll(async () => page.evaluate(async ([p, a]) => {
    const cache = await caches.open("sc-offline-v1");
    const refs = await cache.match("/__sw/refs").then((r) => (r ? r.json() : null)).catch(() => null);
    const entry = refs && (refs.docs[location.origin + p] || refs.docs[p.split("?")[0]]);
    return Boolean(entry && entry.some((x) => x.endsWith(a)) && (await cache.match(location.origin + "/" + a)));
  }, [path, asset]), { timeout: 30000 }).toBe(true);
};
// The page whole: its scripts ran and its stylesheet is applied, and no versioned file failed to load.
const expectWhole = async (page, path, { build = null } = {}) => {
  const failed = [];
  const onFailed = (r) => { if (/\?v=/.test(r.url())) failed.push(r.url()); };
  page.on("requestfailed", onFailed);
  const response = await page.goto(`${BASE}${path}`, { waitUntil: "load" });
  expect(response?.ok(), `${path} answers`).toBe(true);
  const facts = await page.evaluate(async () => ({
    toolKit: Boolean(window.ToolKit && window.ToolKit.tx), build: window.__swBuild || null,
    sheet: [...document.styleSheets].some((s) => s.href && s.href.includes("styles-tool.css") && s.cssRules && s.cssRules.length > 100),
    firstField: Boolean(document.querySelector("main input, main select, main textarea, main button.button-primary")),
    marker: (() => { const el = document.createElement("i"); el.className = "sw-build-marker"; document.body.append(el); const v = getComputedStyle(el).getPropertyValue("--sw-build").trim(); el.remove(); return v; })(),
    heading: Boolean(document.querySelector("main h1")),
    pageBuild: window.__swPageBuild || null,
    missing: await (async () => { const cache = await caches.open("sc-offline-v1"); const out = []; for (const el of document.querySelectorAll('script[src*="?v="], link[rel="stylesheet"][href*="?v="]')) { const href = el.src || el.href; if (!(await cache.match(href))) out.push(new URL(href).pathname + new URL(href).search); } return out; })(),
  }));
  page.off("requestfailed", onFailed);
  if (process.env.SW_DEBUG) console.log(`  facts ${path}: ${JSON.stringify(facts)}`);
  expect(facts.toolKit, `${path}: tool-kit.js ran`).toBe(true);
  expect(facts.sheet, `${path}: styles-tool.css applied`).toBe(true);
  expect(facts.firstField && facts.heading, `${path}: the tool is drawn`).toBe(true);
  expect(failed, `${path}: no versioned file failed`).toEqual([]);
  expect(facts.missing, `${path}: every file the page names is in the copy`).toEqual([]);
  if (build !== null) expect(facts.build, `${path}: tool-kit build`).toBe(build);
  return facts;
};

test("the tools of a role stay whole offline through D1 → D2 → D3 when only one page is reopened online after each deploy", async ({ page }) => {
  test.setTimeout(240_000);
  const home = "/tools/room-inspection/";
  state.phase = "d1-online";
  await page.goto(`${BASE}${home}`, { waitUntil: "load" });
  const kept = await page.evaluate(() => [...document.querySelectorAll(".family-more-list a[href]")].map((a) => new URL(a.getAttribute("href"), location.href).pathname).slice(0, 3));
  expect(kept.length, "the role names other tools to keep").toBeGreaterThanOrEqual(2);
  await waitForKept(page, [home, ...kept]);
  // D1 offline: everything kept opens whole.
  await goOffline();
  state.phase = "d1-offline";
  for (const path of [home, ...kept]) await expectWhole(page, path, { build: null });
  expect(requests("d1-offline"), "offline means offline: the server saw nothing").toEqual([]);
  // D2: a shared script changed. One kept page reopened online, under a query variant of its address (as a hand-off
  // or a shared link opens it): the variant is a document of its own; the plain copy keeps its D1 files.
  await goOnline();
  state.overlay = d2.dir;
  state.phase = "d2-online";
  const reopened = home;
  const variant = `${reopened}?sw-variant=1`;
  const facts = await expectWhole(page, variant, { build: "D2" });
  expect(facts.build).toBe("D2");
  expect(facts.pageBuild, "the variant runs the D2 page script").toBe("D2");
  // The worker stores the variant whole: its index entry names the new script.
  await waitForRefresh(page, variant, d2.rewrites[0][1]);
  // D2 offline: the pages that were NOT reopened, the plain copy of the reopened one among them, still open whole
  // with their D1 files; the variant with D2.
  await goOffline();
  state.phase = "d2-offline";
  const plainD2 = await expectWhole(page, reopened, { build: null });
  expect(plainD2.pageBuild, "the plain copy still runs its own D1 page script").toBe(null);
  await expectWhole(page, kept[0], { build: null });
  await expectWhole(page, kept[1], { build: null });
  const variantD2 = await expectWhole(page, variant, { build: "D2" });
  expect(variantD2.pageBuild).toBe("D2");
  expect(requests("d2-offline")).toEqual([]);
  // D3: a shared stylesheet changed as well. Another kept page reopened online.
  await goOnline();
  state.overlay = d3.dir;
  state.phase = "d3-online";
  const second = kept[1];
  const d3facts = await expectWhole(page, second, { build: "D2" });
  expect(d3facts.marker, "the D3 stylesheet is applied online").toBe('"D3"');
  await waitForRefresh(page, second, d3.rewrites[0][1]);
  await goOffline();
  state.phase = "d3-offline";
  const h = await expectWhole(page, kept[0], { build: null });
  expect(h.marker, "a page never reopened keeps its own D1 stylesheet, whole").toBe("");
  const r = await expectWhole(page, variant, { build: "D2" });
  expect(r.marker, "the D2 variant keeps its D2 files").toBe("");
  const plain = await expectWhole(page, reopened, { build: null });
  expect(plain.marker, "the plain D1 copy beside it is whole too").toBe("");
  expect(plain.pageBuild).toBe(null);
  const s3 = await expectWhole(page, second, { build: "D2" });
  expect(s3.marker, "the D3 page has its D3 stylesheet offline").toBe('"D3"');
  expect(requests("d3-offline")).toEqual([]);
  await goOnline();
  // Overhead: what the server saw in the online phases, for the record.
  const summary = (phase) => { const list = requests(phase); return `${list.length} requests, ${list.filter((x) => /\?v=/.test(x.url)).length} versioned files, ${list.filter((x) => !/\./.test(x.url.split("?")[0].split("/").pop() || "")).length} pages`; };
  console.log(`  d1 online: ${summary("d1-online")} · d2 online (one page reopened): ${summary("d2-online")} · d3 online (one page reopened): ${summary("d3-online")}`);
  const pagesOf = (phase) => requests(phase).map((x) => x.url).filter((u) => !/\./.test(u.split("?")[0].split("/").pop() || ""));
  for (const phase of ["d1-online", "d2-online", "d3-online"]) console.log(`  ${phase} pages: ${pagesOf(phase).join(" ")}`);
  const newInD2 = pagesOf("d2-online").filter((u) => !pagesOf("d1-online").includes(u));
  console.log(`  d2 online: ${newInD2.length} page(s) not kept before (fetched by the keep of the reopened page), versioned files: ${requests("d2-online").map((x) => x.url).filter((u) => /\?v=/.test(u)).join(" ")}`);
  // Cleanup within the context: the cache holds three versions of tool-kit only while three pages name them.
  const versions = await page.evaluate(async () => (await (await caches.open("sc-offline-v1")).keys()).map((k) => k.url).filter((u) => u.includes("tool-kit.js?v=")).length);
  expect(versions, "two versions of tool-kit.js: D1 (the pages never reopened, the plain copy among them) and D2 (the variant)").toBe(2);
});

test("a kept page made incomplete is repaired from fresh HTML on the next keep, and a complete one is not fetched again", async ({ page }) => {
  test.setTimeout(120_000);
  state.overlay = null;
  state.phase = "repair-setup";
  const home = "/tools/room-inspection/";
  await page.goto(`${BASE}${home}`, { waitUntil: "load" });
  const kept = await page.evaluate(() => [...document.querySelectorAll(".family-more-list a[href]")].map((a) => new URL(a.getAttribute("href"), location.href).pathname).slice(0, 2));
  await waitForKept(page, [home, ...kept]);
  // Damage the copy of one kept page the way the old worker did: delete a file only that page names (its own
  // script), so nothing but a repair of that page can bring it back.
  const victim = kept[0];
  const removed = await page.evaluate(async ([p, others]) => {
    const cache = await caches.open("sc-offline-v1");
    const refs = await (await cache.match("/__sw/refs")).json();
    const named = (path) => refs.docs[location.origin + path] || refs.docs[path] || [];
    const elsewhere = new Set(others.flatMap(named));
    const asset = named(p).find((a) => /\.js\?v=/.test(a) && !elsewhere.has(a));
    if (asset) await cache.delete(asset);
    return asset || null;
  }, [victim, [home, kept[1]]]);
  expect(removed, "the page has a script of its own").toMatch(/\.js\?v=/);
  state.phase = "repair-keep";
  // A new tool page visit sends the keep again.
  await page.goto(`${BASE}${home}`, { waitUntil: "load" });
  await expect.poll(async () => page.evaluate(async (a) => Boolean(await (await caches.open("sc-offline-v1")).match(a)), removed), { timeout: 30000 }).toBe(true);
  const fetched = requests("repair-keep").map((r) => r.url);
  expect(fetched.filter((u) => u.split("?")[0] === victim).length, "the incomplete page was fetched again").toBe(1);
  expect(fetched.filter((u) => u.split("?")[0] === kept[1]).length, "the complete page was not").toBe(0);
  await goOffline();
  state.phase = "repair-offline";
  await expectWhole(page, victim);
  await goOnline();
});
