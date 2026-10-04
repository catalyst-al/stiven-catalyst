// Builds the issues of the magazine "Nga terreni": one designed PDF per issue and language, and the page images of
// the online reader. The same steps as scripts/tools-guide.mjs:
//
//   pip install pymupdf pillow
//   node scripts/magazine.mjs            every issue
//   node scripts/magazine.mjs 1          only issue 1
//
// 1. Eleventy renders the print pages (src/guide-print/magazine.njk) into a temporary folder (GUIDE_PRINT).
// 2. Chromium (Playwright) prints each one to src/media/magazine/<slug>/<slug>-<lang>.pdf.
// 3. scripts/guide-pages.py turns the PDFs into page images and adds the issue to src/_data/magazinePages.json.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const { default: magazine } = await import(path.join(ROOT, "src", "_data", "magazine.js"));
const only = process.argv[2] ? Number(process.argv[2]) : null;
const issues = magazine.issues.filter((issue) => !only || issue.number === only);
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "magazine-"));

// A new issue has no page images yet, but its reader page is part of the same Eleventy run: give it an empty entry,
// which step 3 replaces.
const pagesFile = path.join(ROOT, "src", "_data", "magazinePages.json");
const known = fs.existsSync(pagesFile) ? JSON.parse(fs.readFileSync(pagesFile, "utf8")) : {};
for (const issue of issues) {
  known[issue.slug] ??= Object.fromEntries(magazine.langs.map((lang) => [lang, { pageCount: 0, pages: [{ number: 1, image: "", width: 0, height: 0 }] }]));
}
fs.writeFileSync(pagesFile, JSON.stringify(known, null, 1) + "\n");

execFileSync("npx", ["@11ty/eleventy", `--output=${tmp}`, "--quiet"], { cwd: ROOT, env: { ...process.env, GUIDE_PRINT: "1" }, stdio: "inherit" });

const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".woff2": "font/woff2" };
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

for (const issue of issues) {
  const out = path.join(ROOT, "src", "media", "magazine", issue.slug);
  fs.mkdirSync(out, { recursive: true });
  for (const lang of magazine.langs) {
    const page = await browser.newPage();
    await page.goto(`${base}/guide-print/magazine/${issue.slug}/${lang}/`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const target = path.join(out, `${issue.slug}-${lang}.pdf`);
    await page.pdf({ path: target, preferCSSPageSize: true, printBackground: true });
    console.log(`Printed ${path.relative(ROOT, target)}`);
    await page.close();
  }
}
await browser.close();
server.close();
fs.rmSync(tmp, { recursive: true, force: true });

for (const issue of issues) {
  execFileSync("python3", [path.join(ROOT, "scripts", "guide-pages.py"), issue.slug, ...magazine.langs], {
    cwd: ROOT,
    env: { ...process.env, MEDIA_ROOT: "magazine", DATA_FILE: "magazinePages.json" },
    stdio: "inherit",
  });
}
