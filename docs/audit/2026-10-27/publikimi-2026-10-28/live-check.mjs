// Checks on the live site after the release (docs/RELEASE.md §4 and the author's list of 28 October 2026).
// Usage: node live-check.mjs <playwright index.mjs> <chrome executable> <local _site dir> <phase label>
// Writes one line per check: PASS/FAIL name: detail. Exit code 1 if any check fails.
import fs from "node:fs";
const [pwPath, exe, siteDir, label = "live"] = process.argv.slice(2);
const { chromium } = await import(pwPath);
const BASE = "https://stivencatalyst.com";
const results = [];
const check = (name, ok, detail = "") => { results.push({ name, ok: Boolean(ok), detail }); console.log(`${ok ? "PASS" : "FAIL"} ${name}${detail ? `: ${detail}` : ""}`); };

const browser = await chromium.launch({ executablePath: exe });
const newContext = async (opts = {}) => {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, ...opts });
  // The visit-count beacon is left out so the checks are not counted as visits.
  await ctx.route(/cloudflareinsights\.com/, (r) => r.abort());
  return ctx;
};
const watch = (page) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => { if (m.type() === "error" && !/cloudflareinsights|ERR_FAILED/.test(m.text())) errors.push(`console: ${m.text()}`); });
  return errors;
};
const local = (path) => {
  let f = siteDir + path;
  if (f.endsWith("/")) f += "index.html";
  try { return fs.readFileSync(f, "utf8"); } catch { return null; }
};
const assets = (html) => [...new Set((html.match(/\/[\w./-]+\.(?:css|js)\?v=[0-9a-f]+/g) || []))].sort();

// 1. Pages in three languages: 200, the build of the merge (same asset versions as the local build), no error.
const PAGES = ["/", "/insights/the-tools-you-build-yourself/", "/reflections/architects-of-smoke/", "/magazine/management-review-nr-80.html",
  "/magazine/management-review.html", "/field-notes.html", "/tools.html", "/how-this-is-made.html", "/guides/tools-guide.html",
  "/books/mall-per-durresin.html", "/datenschutz.html", "/search.html", "/publications.html"];
const TOOLS = ["action-tracker", "andon", "five-s-audit", "room-inspection", "cv-builder", "ats-cv", "cx-control-tower", "eight-d",
  "damage-control", "kpi-diagnostic", "pareto", "lost-found", "skills-matrix", "fmea"];
const LANGS = ["", "/de", "/sq"];
const ctx = await newContext();
for (const lang of LANGS) {
  for (const path of [...PAGES, ...TOOLS.map((t) => `/tools/${t}/`)]) {
    const url = lang + path;
    const page = await ctx.newPage();
    const errors = watch(page);
    let status = 0;
    try { status = (await page.goto(BASE + url, { waitUntil: "load", timeout: 45000 }))?.status() ?? 0; } catch (e) { errors.push(String(e.message).split("\n")[0]); }
    await page.waitForTimeout(800);
    const html = await page.content().catch(() => "");
    const want = local(url);
    const same = want ? JSON.stringify(assets(html)) === JSON.stringify(assets(want)) : null;
    check(`page ${url}`, status === 200 && errors.length === 0 && same !== false,
      `${status}${same === false ? ", asset versions differ from the merged build" : ""}${errors.length ? `, ${errors.slice(0, 2).join(" | ")}` : ""}`);
    await page.close();
  }
}

// 2. The planets and the motion control (dark = motion on).
for (const lang of LANGS) {
  const page = await ctx.newPage();
  const errors = watch(page);
  await page.goto(`${BASE}${lang}/`, { waitUntil: "load" });
  await page.waitForTimeout(1500);
  // The visible top of the home page, where the planets are (the canvases are drawn only near the view).
  const canvases = await page.locator("canvas").count();
  const shot = async () => (await page.screenshot()).toString("base64");
  const a = await shot(); await page.waitForTimeout(700); const b = await shot();
  check(`planets ${lang || "/"}: drawn and moving`, canvases > 0 && a !== b, `${canvases} canvas`);
  const toggle = page.locator("[data-motion-toggle], .motion-toggle, button[aria-pressed][data-motion]").first();
  const hasToggle = await toggle.count();
  if (hasToggle) {
    await toggle.click();
    await page.waitForTimeout(600);
    const c = await shot(); await page.waitForTimeout(700); const d = await shot();
    check(`motion ${lang || "/"}: pause stops the planets`, c === d);
    await page.reload({ waitUntil: "load" }); await page.waitForTimeout(1200);
    const e = await shot(); await page.waitForTimeout(700); const f = await shot();
    check(`motion ${lang || "/"}: pause remembered after a reload`, e === f);
    await toggle.click().catch(() => {}); // leave it as it was
  } else check(`motion ${lang || "/"}: control found`, false, "no motion control matched");
  check(`home ${lang || "/"}: no script error with motion`, errors.length === 0, errors.slice(0, 2).join(" | "));
  await page.close();
}
{
  const rctx = await newContext({ reducedMotion: "reduce" });
  const page = await rctx.newPage();
  await page.goto(`${BASE}/`, { waitUntil: "load" }); await page.waitForTimeout(1500);
  const a = (await page.screenshot()).toString("base64"); await page.waitForTimeout(800); const b = (await page.screenshot()).toString("base64");
  check("motion: reduced motion starts paused", a === b);
  await rctx.close();
}

// 3. Search by keyboard (CI-01), as the CI journey does it: type, Tab to the first result, Enter.
for (const lang of LANGS) {
  const page = await ctx.newPage();
  const errors = watch(page);
  await page.goto(`${BASE}${lang}/search.html`, { waitUntil: "load" });
  const input = page.locator("[data-search-input]");
  await input.click(); await page.keyboard.type("handover", { delay: 40 });
  const first = page.locator("[data-search-results] > li > a").first();
  await first.waitFor({ state: "visible", timeout: 10000 }).catch(() => {});
  const count = await page.locator("[data-search-results] > li > a").count();
  const href = count ? await first.getAttribute("href") : null;
  for (let i = 0; i < 10 && count && !(await first.evaluate((a) => a === document.activeElement)); i++) await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  await page.waitForURL((u) => href && u.pathname === new URL(href, BASE).pathname, { timeout: 10000 }).catch(() => {});
  const landed = href && new URL(page.url()).pathname === new URL(href, BASE).pathname;
  check(`search ${lang || "/"}: keyboard opens a result`, count > 1 && landed && errors.length === 0, `${count} results, ${page.url().replace(BASE, "")}`);
  await page.close();
}

// 4. The publications: months, a correction note, the register; the PDFs.
const text = async (url) => { const r = await fetch(BASE + url); return { status: r.status, body: await r.text() }; };
{
  const n41 = await text("/magazine/management-review-nr-41.html");
  check("Management Review No. 41: October 2026", n41.status === 200 && n41.body.includes("October 2026"));
  const n06 = await text("/magazine/management-review-nr-06.html");
  check("Management Review No. 6: dated correction note", n06.status === 200 && /Correction, \d+ Oc/.test(n06.body));
  const arch = await text("/magazine/management-review.html");
  check("Management Review archive: corrections register", arch.status === 200 && arch.body.includes("corrections register"));
  const how = await text("/how-this-is-made.html");
  check("How this is made: Albanian originals", how.status === 200 && /Albanian/.test(how.body));
  const guide = await text("/guides/tools-guide.html");
  check("Tools Guide: edition 8", guide.status === 200 && guide.body.includes("Edition 8"));
}
const PDFS = ["/media/magazine/management-review-nr-80/management-review-nr-80-en.pdf", "/media/magazine/management-review-nr-80/management-review-nr-80-de.pdf",
  "/media/magazine/management-review-nr-80/management-review-nr-80-sq.pdf", "/media/guides/tools-guide/tools-guide-en.pdf",
  "/media/guides/tools-guide/tools-guide-de.pdf", "/media/guides/tools-guide/tools-guide-sq.pdf"];
for (const url of PDFS) {
  const r = await fetch(BASE + url);
  const buf = Buffer.from(await r.arrayBuffer());
  const want = fs.existsSync(siteDir + url) ? fs.statSync(siteDir + url).size : null;
  check(`PDF ${url}`, r.status === 200 && buf.subarray(0, 5).toString() === "%PDF-" && (want === null || want === buf.length), `${r.status}, ${buf.length} bytes${want !== null && want !== buf.length ? `, local build ${want}` : ""}`);
}

// 5. Print: a tool with a wide table and an issue with charts; nothing wider than the page.
for (const url of ["/tools/andon/", "/magazine/management-review-nr-80.html"]) {
  const pctx = await newContext({ viewport: { width: 794, height: 1123 } });
  const page = await pctx.newPage();
  await page.goto(BASE + url, { waitUntil: "load" }); await page.waitForTimeout(1000);
  await page.emulateMedia({ media: "print" }); await page.waitForTimeout(500);
  const wide = await page.evaluate(() => [...document.querySelectorAll("table, svg, canvas")].filter((el) => el.getClientRects().length && el.getBoundingClientRect().right > document.documentElement.clientWidth + 1).length);
  const blank = await page.evaluate(() => [...document.querySelectorAll("svg")].filter((s) => s.getClientRects().length && s.getBoundingClientRect().height > 40 && s.querySelectorAll("path, rect, circle, line, polyline").length === 0).length);
  check(`print ${url}: no table or chart past the page edge, no empty chart`, wide === 0 && blank === 0, `${wide} wide, ${blank} empty`);
  await pctx.close();
}

// 6. Read aloud and privacy.
{
  const essay = await text("/insights/the-tools-you-build-yourself/");
  check("read aloud: player and its voice note on an essay", essay.status === 200 && /data-listen|listen-player|read-aloud/i.test(essay.body));
  const priv = [["/datenschutz.html", ["storage you start yourself", "without Google Fonts or any other external font service", "Its purpose is to count", "(PBKDF2, AES-GCM)"]],
    ["/de/datenschutz.html", ["Speicherung, die Sie selbst auslösen", "ohne Google Fonts oder andere externe Schriftdienste", "Es dient dazu, zu zählen", "(PBKDF2, AES-GCM)"]],
    ["/sq/datenschutz.html", ["ruajtjen që e nisni vetë", "pa Google Fonts ose shërbime të tjera të jashtme fontesh", "Qëllimi i tij është të numërojë", "(PBKDF2, AES-GCM)"]]];
  for (const [url, words] of priv) {
    const p = await text(url);
    const missing = words.filter((w) => !p.body.includes(w.replace(/'/g, "&#39;")) && !p.body.includes(w));
    check(`privacy ${url}: the approved text`, p.status === 200 && missing.length === 0, missing.join(" | "));
  }
}

// 7. The sitemap: lastmod of a reprinted issue.
{
  const sm = await text("/sitemap.xml");
  const m = sm.body.match(/management-review-nr-80\.html<\/loc><lastmod>([^<]+)</);
  check("sitemap: lastmod of issue 80", sm.status === 200 && m, m ? m[1] : "not found");
}

await browser.close();
const failed = results.filter((r) => !r.ok);
console.log(`\n${label}: ${results.length - failed.length} / ${results.length} checks pass`);
fs.writeFileSync(new URL(`./results-${label}.json`, import.meta.url), JSON.stringify(results, null, 2));
process.exit(failed.length ? 1 : 0);
