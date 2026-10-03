// Pictures of each tool's result for the cards on the Tools page and the role pages:
// src/media/tools/<lang>/<tool>.jpg. Builds the site first (npm run build), opens every tool page
// in Chromium, loads its example (or fills a short case), and photographs the result.
// Needs Playwright (npm i -D playwright, or a global install); run again after a tool's result changes.
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE = path.join(ROOT, "_site");
const read = (file) => JSON.parse(fs.readFileSync(path.join(ROOT, file), "utf8"));
const LANGS = { en: {}, de: read("src/_data/de/ui.json"), sq: read("src/_data/sq/ui.json") };
const t = (lang, text) => LANGS[lang][text] ?? text;
const tools = read("src/_data/tools.json").filter((tool) => tool.url).map((tool) => tool.url.split("/").filter(Boolean).pop());

const loadChromium = async () => {
  for (const spec of ["playwright", "/opt/node-tools/node_modules/playwright"]) {
    try { const mod = await import(createRequire(path.join(ROOT, "package.json")).resolve(spec)); return mod.chromium || mod.default?.chromium; } catch { /* next */ }
  }
  throw new Error("Playwright is not installed: npm i -D playwright");
};

const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".mjs": "text/javascript", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".json": "application/json" };
const server = http.createServer((req, res) => {
  let file = path.join(SITE, decodeURIComponent(new URL(req.url, "http://x").pathname));
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
  if (!fs.existsSync(file)) { res.statusCode = 404; res.end(); return; }
  res.setHeader("content-type", TYPES[path.extname(file)] || "application/octet-stream");
  fs.createReadStream(file).pipe(res);
}).listen(0);
const base = `http://localhost:${server.address().port}`;

// A short 5 Whys case, since that worksheet has no example of its own.
const WHYS = {
  en: ["Route 14 left 25 minutes late on Tuesday.", "The trolley was not at the dock when the driver arrived.", "Picking finished late because two pickers were moved to inbound.", "Inbound had no plan for the extra truck that arrived at 5:40.", "Nobody owns the morning dock plan when the shift lead is in the briefing.", "Dock plan is owned by the dispatcher from 5:30; shift lead confirms at 6:00.", "Dispatcher", "Next Friday: departures of the week within 5 minutes."],
  de: ["Tour 14 ist am Dienstag 25 Minuten zu spät losgefahren.", "Der Rollwagen stand nicht an der Rampe, als der Fahrer kam.", "Das Kommissionieren endete spät, weil zwei Kommissionierer zum Wareneingang mussten.", "Der Wareneingang hatte keinen Plan für den Extra-Lkw um 5:40.", "Niemand verantwortet den Rampenplan, solange der Schichtleiter im Briefing ist.", "Der Disponent verantwortet den Rampenplan ab 5:30; der Schichtleiter bestätigt um 6:00.", "Disponent", "Nächsten Freitag: Abfahrten der Woche innerhalb von 5 Minuten."],
  sq: ["Rruga 14 u nis 25 minuta me vonesë të martën.", "Karroca nuk ishte te doku kur erdhi shoferi.", "Picking-u mbaroi vonë, se dy picker-a u kaluan te hyrja e mallit.", "Hyrja e mallit nuk kishte plan për kamionin shtesë në 5:40.", "Askush nuk e zotëron planin e dokut sa kohë shift lead-i është në briefing.", "Planin e dokut e zotëron dispeçeri nga 5:30; shift lead-i e konfirmon në 6:00.", "Dispeçeri", "Të premten tjetër: nisjet e javës brenda 5 minutash."],
};

// How each tool gets its example, and which element shows the result.
const RECIPES = {
  "kpi-diagnostic": { act: (page) => page.evaluate(() => { const names = [...new Set([...document.querySelectorAll("input[type=radio]")].map((x) => x.name))]; const pick = [3, 1, 2, 0, 2, 3, 1, 2, 0, 1]; names.forEach((n, i) => { const inputs = [...document.querySelectorAll(`input[name="${n}"]`)]; inputs[Math.min(inputs.length - 1, pick[i % pick.length])].click(); }); }), target: "[data-result]" },
  "five-whys": { act: async (page, lang) => { const ids = ["ws-problem", "ws-why-1", "ws-why-2", "ws-why-3", "ws-why-4", "ws-cause", "ws-owner", "ws-check"]; for (const [i, id] of ids.entries()) { const el = await page.$(`#${id}`); if (el) await el.fill(WHYS[lang][i]); else { const alt = (await page.$$("textarea, input[type=text]"))[i]; if (alt) await alt.fill(WHYS[lang][i]); } } }, target: "main form, main .ws-sheet" },
  "damage-control": { act: (page) => page.click("[data-example]"), target: "[data-results]" },
  "incomplete-control": { act: (page) => page.click("[data-example]"), target: "[data-results]" },
  "delay-analyzer": { act: (page) => page.click("[data-example]"), target: "[data-results]" },
  "sigma-control-chart": { act: (page) => page.click("[data-example]"), target: "[data-results]" },
  "shift-pulse": { before: ["damage-control", "incomplete-control", "delay-analyzer"], act: async () => {}, target: "[data-pulse-results]" },
  "shift-handover": { act: (page) => page.click("[data-example]"), target: "[data-output]" },
  "six-sigma-dmaic": { act: async () => {}, target: ".dm-module" },
  "pareto": { act: (page) => page.click('[data-act="example"]'), target: "[data-result-body], .pa-results" },
  "cx-control-tower": { act: (page, lang) => page.click(`button:has-text("${t(lang, "Load the example")}")`), target: "main section:has(.cx-tabs), main .cx" },
  "cv-builder": { act: (page) => page.click('[data-act="example"]'), target: "[data-stage] > :first-child" },
  "ats-cv": { act: (page) => page.click('[data-act="example"]'), target: "[data-stage] > :first-child" },
  "cover-letter": { act: (page) => page.click('[data-act="example"]'), target: "[data-stage] > :first-child" },
};

const chromium = await loadChromium();
const browser = await chromium.launch();
let made = 0;
for (const lang of (process.env.ONLY ? [process.env.ONLY] : Object.keys(LANGS))) {
  const context = await browser.newContext({ viewport: { width: 1180, height: 900 }, deviceScaleFactor: 1 });
  const dir = path.join(ROOT, "src/media/tools", lang);
  fs.mkdirSync(dir, { recursive: true });
  const open = async (slug) => {
    const page = await context.newPage();
    page.on("dialog", (d) => d.accept());
    await page.goto(`${base}${lang === "en" ? "" : `/${lang}`}/tools/${slug}/`, { waitUntil: "networkidle" });
    return page;
  };
  for (const slug of tools) {
    const recipe = RECIPES[slug];
    if (!recipe) { console.warn(`no recipe for ${slug}`); continue; }
    try {
      // The logs Shift Pulse reads: their examples, unless this context loaded them already (the button is then hidden).
      for (const dep of recipe.before || []) { const p = await open(dep); const button = await p.$("[data-example]"); if (button && await button.isVisible()) await button.click(); await p.waitForTimeout(400); await p.close(); }
      const page = await open(slug);
      await recipe.act(page, lang);
      await page.waitForTimeout(900);
      // The result element named in the recipe, if it is visible and tall enough; else the first large section after the title.
      let target = null;
      for (const sel of recipe.target.split(",").map((x) => x.trim())) {
        const h = await page.$(sel);
        if (h && await h.isVisible() && ((await h.boundingBox())?.height || 0) > 120) { target = h; break; }
      }
      if (!target) {
        for (const h of await page.$$("main > section")) {
          const box = await h.boundingBox();
          if (box && box.height > 300 && !(await h.evaluate((e) => e.classList.contains("page-hero")))) { target = h; break; }
        }
      }
      if (!target) throw new Error("no visible result");
      // Nothing that floats over the page (the site header, a sticky toolbar, the share planet) belongs in the picture.
      await page.evaluate((node) => {
        for (const el of document.querySelectorAll("body *")) {
          const position = getComputedStyle(el).position;
          if ((position === "sticky" || position === "fixed") && !node.contains(el) && !el.contains(node)) el.style.setProperty("visibility", "hidden", "important");
        }
        document.querySelector(".site-header")?.style.setProperty("display", "none", "important");
      }, target);
      // The result's top edge at the top of the picture, without the section's own top padding.
      await target.evaluate((node) => { document.documentElement.style.scrollBehavior = "auto"; window.scrollTo({ top: node.getBoundingClientRect().top + window.scrollY, behavior: "instant" }); });
      await page.waitForTimeout(400);
      const box = await target.evaluate((node) => { const r = node.getBoundingClientRect(); return { x: r.left, y: r.top, width: r.width, height: r.height, padding: parseFloat(getComputedStyle(node).paddingTop) || 0, scrollY: window.scrollY }; });
      if (process.env.DEBUG) console.log(slug, JSON.stringify(box));
      const width = Math.min(box.width, 1180 - Math.max(0, box.x));
      const top = Math.min(Math.max(0, box.y + box.padding), 600);
      const clip = { x: Math.max(0, box.x), y: top, width, height: Math.max(120, Math.min(Math.max(box.height - box.padding, 120), Math.round(width * 9 / 16), 900 - top)) };
      await page.screenshot({ path: path.join(dir, `${slug}.jpg`), type: "jpeg", quality: 82, clip });
      made += 1;
      console.log(`${lang}/${slug}.jpg  ${Math.round(clip.width)}×${Math.round(clip.height)}`);
      await page.close();
    } catch (error) {
      console.error(`${lang}/${slug}: ${String(error).split("\n")[0]}`);
    }
  }
  await context.close();
}
await browser.close();
server.close();
console.log(`${made} previews written to src/media/tools/<lang>/`);
