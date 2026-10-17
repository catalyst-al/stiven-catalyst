// Builds the operational treatise: one designed PDF per volume and language, and the cover of each as a picture (the
// reader shows the pages themselves, as HTML; the cover is for the hero, the lists and the social preview). The same
// steps as scripts/weekly.mjs:
//
//   pip install pymupdf pillow
//   node scripts/treatise.mjs          every volume
//   node scripts/treatise.mjs 1 2      only these volumes
//
// 1. Eleventy renders the print pages (src/guide-print/treatise.njk) into a temporary folder (GUIDE_PRINT).
// 2. Chromium (Playwright) checks that every page fits its box (lib/page-fit.js) and stops with the list of
//    those that do not (node scripts/page-fit.mjs sets them tighter); then it prints each one to
//    src/media/magazine/<slug>/<slug>-<lang>.pdf.
// 3. scripts/guide-pages.py draws the cover of each PDF (COVER_ONLY) and adds the volume to src/_data/magazinePages.json.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { checkPagesFit, unfitMessage } from "../lib/page-fit.js";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const { default: treatise } = await import(path.join(ROOT, "src", "_data", "treatise.js"));
const wanted = process.argv.slice(2).map(Number);
const volumes = treatise.volumes.filter((volume) => !wanted.length || wanted.includes(volume.number));
if (!volumes.length) throw new Error(`No volume numbered ${wanted.join(", ")} in lib/treatise/volumes`);
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "treatise-"));

// The reader pages are part of the same Eleventy run and need an entry before the page images exist; step 3
// replaces it.
const pagesFile = path.join(ROOT, "src", "_data", "magazinePages.json");
const known = fs.existsSync(pagesFile) ? JSON.parse(fs.readFileSync(pagesFile, "utf8")) : {};
for (const volume of treatise.volumes) {
  known[volume.slug] ??= Object.fromEntries(treatise.langs.map((lang) => [lang, { pageCount: 0, pages: [{ number: 1, image: "", width: 0, height: 0 }] }]));
}
fs.writeFileSync(pagesFile, JSON.stringify(known, null, 1) + "\n");

execFileSync("npx", ["@11ty/eleventy", `--output=${tmp}`, "--quiet"], { cwd: ROOT, env: { ...process.env, GUIDE_PRINT: "1" }, stdio: "inherit" });

const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".woff2": "font/woff2", ".jpg": "image/jpeg" };
const server = http.createServer((req, res) => {
  const url = decodeURIComponent(new URL(req.url, "http://x").pathname);
  const file = url.startsWith("/guide-fonts/") ? path.join(ROOT, "scripts", url.slice(1)) : path.join(tmp, url.endsWith("/") ? `${url}index.html` : url);
  fs.readFile(file, (error, body) => {
    if (error) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { "content-type": TYPES[path.extname(file)] || "application/octet-stream" });
    res.end(body);
  });
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const base = `http://127.0.0.1:${server.address().port}`;

const require = createRequire(import.meta.url);
let playwright;
try { playwright = require("playwright"); } catch { playwright = require(path.join(execFileSync("npm", ["root", "-g"]).toString().trim(), "playwright")); }
const browser = await playwright.chromium.launch(fs.existsSync("/opt/pw-browsers/chromium") ? { executablePath: "/opt/pw-browsers/chromium" } : {});

// Every page has to fit its box before anything is printed (lib/page-fit.js, with the steps of src/_data/pageFit.json):
// a page that runs into the block at its foot, or past the page, stops the print with the list of such pages.
const unfit = await checkPagesFit(browser, volumes.flatMap((volume) => treatise.langs.map((lang) => ({ label: `${volume.slug} ${lang}`, url: `${base}/guide-print/treatise/${volume.slug}/${lang}/` }))));
if (unfit.length) {
  await browser.close();
  server.close();
  fs.rmSync(tmp, { recursive: true, force: true });
  console.error(unfitMessage(unfit));
  process.exit(1);
}

for (const volume of volumes) {
  const out = path.join(ROOT, "src", "media", "magazine", volume.slug);
  fs.mkdirSync(out, { recursive: true });
  for (const lang of treatise.langs) {
    const page = await browser.newPage();
    await page.goto(`${base}/guide-print/treatise/${volume.slug}/${lang}/`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const target = path.join(out, `${volume.slug}-${lang}.pdf`);
    await page.pdf({ path: target, preferCSSPageSize: true, printBackground: true });
    console.log(`Printed ${path.relative(ROOT, target)}`);
    await page.close();
  }
}
await browser.close();
server.close();
fs.rmSync(tmp, { recursive: true, force: true });

for (const volume of volumes) {
  execFileSync("python3", [path.join(ROOT, "scripts", "guide-pages.py"), volume.slug, ...treatise.langs], {
    cwd: ROOT,
    env: { ...process.env, MEDIA_ROOT: "magazine", DATA_FILE: "magazinePages.json", COVER_ONLY: "1" },
    stdio: "inherit",
  });
}

// The pages were replaced: make the small copies of the covers again (scripts/thumbnails.mjs).
execFileSync("node", [path.join(ROOT, "scripts", "thumbnails.mjs")], { cwd: ROOT, stdio: "inherit" });
