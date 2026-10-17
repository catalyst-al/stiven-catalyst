// Measures every fixed page of the publications in Chromium and writes src/_data/pageFit.json: for each page that
// would run into the block at its foot (its sources, its note, its links) or past it, the step that makes it fit,
// fit-1, fit-2 or fit-3, each 4 per cent tighter than the one before (lib/page-fit.js, print/review-base.css). The
// page templates read the file, so the PDF and the reader on the site set the page alike. Run it again after a text
// of a publication, its blocks or the stylesheets of its pages change, and before the print scripts, which stop when
// a page does not fit:
//
//   node scripts/page-fit.mjs                          every publication
//   node scripts/page-fit.mjs management-review-nr-52  only these (the slug of an issue, a volume or an edition)
//   node scripts/page-fit.mjs --built <folder>         measure a GUIDE_PRINT build already made into <folder>
//
// 1. Eleventy renders the print pages and the site (GUIDE_PRINT) into a temporary folder.
// 2. Chromium loads each print page and each reader, takes away any step a page already has, and measures every
//    page at each step, from none to fit-3. A page gets the first step at which it fits in print and in the reader
//    alike; a page that fits as it is gets no entry.
// 3. The steps are written to src/_data/pageFit.json. A page that does not fit even at fit-3 is listed and the script
//    exits with an error: its text or its blocks have to change (a shorter wording, a lower chart).
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { FIT_STEPS, measurePages } from "../lib/page-fit.js";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const args = process.argv.slice(2);
const builtAt = args.indexOf("--built");
const built = builtAt >= 0 ? path.resolve(args.splice(builtAt, 2)[1]) : null;
const only = args;
const data = async (name) => (await import(path.join(ROOT, "src", "_data", `${name}.js`))).default;
const [weekly, magazine, treatise, review, toolsGuide] = await Promise.all(["weekly", "magazine", "treatise", "review", "toolsGuide"].map(data));
const reader = (lang, address) => `${lang === "en" ? "" : `/${lang}`}${address}`;

// Every document with fixed pages: its key in pageFit.json, its language, the print page and the reader.
const documents = [
  ...weekly.issues.flatMap((issue) => weekly.langs.map((lang) => ({ key: issue.slug, lang, print: `/guide-print/weekly/${issue.slug}/${lang}/`, reader: reader(lang, `/magazine/${issue.slug}.html`) }))),
  ...magazine.issues.flatMap((issue) => magazine.langs.map((lang) => ({ key: issue.slug, lang, print: `/guide-print/magazine/${issue.slug}/${lang}/`, reader: reader(lang, `/magazine/${issue.slug}.html`) }))),
  ...treatise.volumes.flatMap((volume) => treatise.langs.map((lang) => ({ key: volume.slug, lang, print: `/guide-print/treatise/${volume.slug}/${lang}/`, reader: reader(lang, `/magazine/${volume.slug}.html`) }))),
  ...review.langs.map((lang) => ({ key: review.slug, lang, print: `/guide-print/review/${lang}/`, reader: reader(lang, `/magazine/${review.slug}.html`) })),
  ...toolsGuide.langs.map((lang) => ({ key: toolsGuide.slug, lang, print: `/guide-print/${lang}/`, reader: reader(lang, `/guides/${toolsGuide.slug}.html`) })),
].filter((doc) => !only.length || only.includes(doc.key));
if (!documents.length) throw new Error(`No publication with the slug ${only.join(", ")}`);

const out = built || fs.mkdtempSync(path.join(os.tmpdir(), "page-fit-"));
if (!built) execFileSync("npx", ["@11ty/eleventy", `--output=${out}`, "--quiet"], { cwd: ROOT, env: { ...process.env, GUIDE_PRINT: "1" }, stdio: "inherit" });

const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".woff2": "font/woff2", ".svg": "image/svg+xml", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg" };
const server = http.createServer((req, res) => {
  const url = decodeURIComponent(new URL(req.url, "http://x").pathname);
  const file = url.startsWith("/guide-fonts/") ? path.join(ROOT, "scripts", url.slice(1)) : path.join(out, url.endsWith("/") ? `${url}index.html` : url);
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
// Without its script a reader lays its pages one under the other at their own size, each laid out (with it, only the
// pages open in the book are); what is inside a page is the same either way.
const tab = await browser.newPage({ viewport: { width: 1280, height: 900 }, javaScriptEnabled: false });

// The first step at which each page of a document fits (FIT_STEPS + 1 when none does), and what is still wrong with
// it at the last step.
const stepsOf = async (url) => {
  await tab.goto(base + url, { waitUntil: "load" });
  await tab.evaluate(() => document.fonts.ready);
  const need = [];
  const left = [];
  for (let step = 0; step <= FIT_STEPS; step++) {
    await tab.evaluate((step) => document.querySelectorAll(".mr .pg, .tg .pg").forEach((pg) => {
      pg.classList.remove(...[...pg.classList].filter((name) => /^fit-\d$/.test(name)));
      if (step) pg.classList.add(`fit-${step}`);
    }), step);
    for (const { page, problems } of await tab.evaluate(measurePages)) {
      if (!problems.length) need[page] ??= step;
      else if (step === FIT_STEPS) left[page] = problems;
    }
  }
  return { need, left };
};

const fit = JSON.parse(fs.readFileSync(path.join(ROOT, "src", "_data", "pageFit.json"), "utf8").trim() || "{}");
for (const doc of documents) if (fit[doc.key]) delete fit[doc.key][doc.lang];
const unfit = [];
for (const doc of documents) {
  const steps = {};
  for (const url of [doc.print, doc.reader]) {
    const { need, left } = await stepsOf(url);
    need.forEach((step, page) => { if (step !== undefined) steps[page] = Math.max(steps[page] ?? 0, step); });
    left.forEach((problems, page) => { if (problems && need[page] === undefined) { steps[page] = FIT_STEPS; unfit.push(`${doc.key} ${doc.lang} p${page} (${url}): ${problems.join("; ")}`); } });
  }
  const pages = Object.fromEntries(Object.entries(steps).filter(([, step]) => step > 0).sort(([a], [b]) => a - b));
  if (Object.keys(pages).length) (fit[doc.key] ??= {})[doc.lang] = pages;
  console.log(`${doc.key} ${doc.lang}: ${Object.keys(pages).length ? Object.entries(pages).map(([page, step]) => `p${page} fit-${step}`).join(", ") : "every page fits"}`);
}
await browser.close();
server.close();
if (!built) fs.rmSync(out, { recursive: true, force: true });

// Sorted, the languages in the order of the publications, empty entries left out.
const sorted = Object.fromEntries(Object.keys(fit).sort().map((key) => [key, Object.fromEntries(["en", "sq", "de"].filter((lang) => fit[key][lang]).map((lang) => [lang, fit[key][lang]]))])
  .filter(([, langs]) => Object.keys(langs).length));
fs.writeFileSync(path.join(ROOT, "src", "_data", "pageFit.json"), JSON.stringify(sorted, null, 1) + "\n");
console.log(`${Object.values(sorted).reduce((sum, langs) => sum + Object.values(langs).reduce((s, pages) => s + Object.keys(pages).length, 0), 0)} pages set tighter, written to src/_data/pageFit.json.`);
if (unfit.length) {
  console.error(`\n${unfit.length} pages do not fit even at fit-${FIT_STEPS}; shorten their text or lower a block:\n${unfit.map((line) => `  ${line}`).join("\n")}`);
  process.exit(1);
}
