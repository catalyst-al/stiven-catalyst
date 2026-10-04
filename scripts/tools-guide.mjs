// Builds the Tools Guide: one designed PDF per language and the page images of the online reader.
//
//   pip install pymupdf pillow
//   node scripts/tools-guide.mjs
//
// 1. Eleventy renders the print pages (src/guide-print/print.njk) into a temporary folder, only when GUIDE_PRINT is set,
//    so they never reach the published site.
// 2. Chromium (Playwright) prints each language to src/media/guides/tools-guide/tools-guide-<lang>.pdf.
// 3. scripts/guide-pages.py turns every PDF into page images and writes src/_data/toolsGuidePages.json.
//
// Run it again whenever the text in src/_data/toolsGuide.js or a tool changes.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const OUT = path.join(ROOT, "src", "media", "guides", "tools-guide");
const { default: guide } = await import(path.join(ROOT, "src", "_data", "toolsGuide.js"));
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "tools-guide-"));

execFileSync("npx", ["@11ty/eleventy", `--output=${tmp}`, "--quiet"], {
  cwd: ROOT,
  env: { ...process.env, GUIDE_PRINT: "1" },
  stdio: "inherit",
});

// The fonts of the printed guide live next to this script; the print pages ask for them at /guide-fonts/.
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".woff2": "font/woff2", ".svg": "image/svg+xml", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg" };
const server = http.createServer((req, res) => {
  const url = decodeURIComponent(new URL(req.url, "http://x").pathname);
  const file = url.startsWith("/guide-fonts/")
    ? path.join(ROOT, "scripts", url.slice(1))
    : path.join(tmp, url.endsWith("/") ? `${url}index.html` : url);
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

fs.mkdirSync(OUT, { recursive: true });
for (const lang of guide.langs) {
  const page = await browser.newPage();
  await page.goto(`${base}/guide-print/${lang}/`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const target = path.join(OUT, `${guide.slug}-${lang}.pdf`);
  await page.pdf({ path: target, preferCSSPageSize: true, printBackground: true });
  console.log(`Printed ${path.relative(ROOT, target)}`);
  await page.close();
}
await browser.close();
server.close();
fs.rmSync(tmp, { recursive: true, force: true });

execFileSync("python3", [path.join(ROOT, "scripts", "guide-pages.py"), guide.slug, ...guide.langs], { cwd: ROOT, stdio: "inherit" });
