// Builds the Management Review (September 2026): one designed PDF per language and the page images of the online
// reader. The same steps as scripts/magazine.mjs:
//
//   pip install pymupdf pillow
//   node scripts/review.mjs
//
// 1. Eleventy renders the print pages (src/guide-print/review.njk) into a temporary folder (GUIDE_PRINT).
// 2. Chromium (Playwright) prints each one to src/media/magazine/<slug>/<slug>-<lang>.pdf.
// 3. scripts/guide-pages.py turns the PDFs into page images and adds the edition to src/_data/magazinePages.json.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const { default: review } = await import(path.join(ROOT, "src", "_data", "review.js"));
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "review-"));

// The reader page is part of the same Eleventy run and needs an entry before the page images exist; step 3
// replaces it.
const pagesFile = path.join(ROOT, "src", "_data", "magazinePages.json");
const known = fs.existsSync(pagesFile) ? JSON.parse(fs.readFileSync(pagesFile, "utf8")) : {};
known[review.slug] ??= Object.fromEntries(review.langs.map((lang) => [lang, { pageCount: 0, pages: [{ number: 1, image: "", width: 0, height: 0 }] }]));
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

const out = path.join(ROOT, "src", "media", "magazine", review.slug);
fs.mkdirSync(out, { recursive: true });
for (const lang of review.langs) {
  const page = await browser.newPage();
  await page.goto(`${base}/guide-print/review/${lang}/`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const target = path.join(out, `${review.slug}-${lang}.pdf`);
  await page.pdf({ path: target, preferCSSPageSize: true, printBackground: true });
  console.log(`Printed ${path.relative(ROOT, target)}`);
  await page.close();
}
await browser.close();
server.close();
fs.rmSync(tmp, { recursive: true, force: true });

execFileSync("python3", [path.join(ROOT, "scripts", "guide-pages.py"), review.slug, ...review.langs], {
  cwd: ROOT,
  env: { ...process.env, MEDIA_ROOT: "magazine", DATA_FILE: "magazinePages.json" },
  stdio: "inherit",
});
