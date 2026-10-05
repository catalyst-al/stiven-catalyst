// Makes the link previews (1200 × 630, the size LinkedIn, WhatsApp and mail programs show) of every essay, every
// reflection and the writing pages, in English, German and Albanian, so a shared link shows what it leads to
// instead of the homepage card:
//   src/media/social/<lang>/insight-<slug>.jpg     the essay's number in its series, category, title and the series
//   src/media/social/<lang>/reflection-<slug>.jpg  the reflection's title
//   src/media/social/<lang>/page-<name>.jpg        Start here, Insights, Reflections, Field Notes, About
// The layout picks them up through the socialCard and essayCard filters (eleventy.config.js). The face and the
// portrait are those of the field note cards (scripts/note-cards.mjs).
//
// Run it after adding an essay or a reflection, or changing a title:  node scripts/page-cards.mjs
// It needs Playwright with Chromium (npm i -g playwright, or a local copy).
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const base64 = (file) => fs.readFileSync(path.join(ROOT, file)).toString("base64");
const json = (file) => JSON.parse(fs.readFileSync(path.join(ROOT, file), "utf8"));
const esc = (text) => String(text ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const SERIF = base64("scripts/note-card-fonts/gelasio-latin-400-normal.woff2");
const SANS = base64("scripts/guide-fonts/inter-latin-600-normal.woff2");
const SANS_REGULAR = base64("scripts/guide-fonts/inter-latin-400-normal.woff2");
const DISPLAY = base64("src/fonts/archivo-black-latin-400-normal.woff2");
const PHOTO = base64("scripts/note-card-photo.jpg");
const LOGO = base64("src/favicon.svg");

const SERIES = json("src/_data/essaySeries.json");
const UI = { en: {}, de: json("src/_data/de/ui.json"), sq: json("src/_data/sq/ui.json") };
const t = (lang, text) => UI[lang][text] ?? text;
const content = (lang, section) => (lang === "en" ? `src/content/${section}` : `src/content/${lang}/${section}`);

// The pages with a card of their own: the hero of each (eyebrow, title, lede), as the templates show it.
export const PAGES = {
  start: ["New to Stiven Catalyst", "Start here.", "Essays, field notes and small tools about leading people and running operations, written from ten years close to the work. If you have ten minutes, begin with these."],
  insights: ["Essays & analysis", "Insights", "Longer thinking on leadership, operations, accountability, service and the systems that shape performance."],
  reflections: ["Personal essays", "Reflections", "Slower, more personal pieces on attention, people and the quiet side of leadership."],
  "field-notes": ["Observed close to the work", "Field Notes", "Shorter ideas about management, service, standards and what becomes visible when you stay close to the operation."],
  about: ["The philosophy behind the work", "Clarity into action.", "Stiven Catalyst is built around one idea: better results begin with clearer thinking, and clearer thinking matters only when it changes what happens next."],
};

// The essays or reflections of a language, oldest first (as the site numbers them), without those marked "soon".
export const piecesOf = (lang, section) => {
  const dir = path.join(ROOT, content(lang, section));
  return fs.readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => ({ file, slug: file.replace(/\.md$/, "").replace(/^\d{4}-\d{2}-\d{2}-/, ""), data: matter.read(path.join(dir, file)).data }))
    .filter((item) => item.data.status !== "soon")
    .sort((a, b) => new Date(a.data.date) - new Date(b.data.date) || a.slug.localeCompare(b.slug));
};

const card = ({ kicker, number, title, sub }) => `<!doctype html><html><head><meta charset="utf-8"><style>
  @font-face { font-family: Gelasio; src: url(data:font/woff2;base64,${SERIF}) format("woff2"); }
  @font-face { font-family: Inter; font-weight: 600; src: url(data:font/woff2;base64,${SANS}) format("woff2"); }
  @font-face { font-family: Inter; font-weight: 400; src: url(data:font/woff2;base64,${SANS_REGULAR}) format("woff2"); }
  @font-face { font-family: "Archivo Black"; src: url(data:font/woff2;base64,${DISPLAY}) format("woff2"); }
  * { box-sizing: border-box; }
  html, body { margin: 0; width: 1200px; height: 630px; }
  body {
    display: flex; flex-direction: column; padding: 58px 70px 48px;
    background:
      radial-gradient(800px 520px at 0% 0%, rgba(74,181,247,.17), transparent 62%),
      radial-gradient(640px 480px at 100% 100%, rgba(209,165,83,.08), transparent 60%),
      #060a10;
    color: #f6f7f4; font-family: Inter, sans-serif;
  }
  .top { display: flex; justify-content: space-between; align-items: flex-start; gap: 40px; }
  .kicker { padding-top: 10px; font-size: 21px; font-weight: 600; letter-spacing: .16em; text-transform: uppercase; color: #4ab5f7; }
  .number { font: 92px/0.8 "Archivo Black", sans-serif; letter-spacing: -.04em; color: #4ab5f7; }
  .copy { flex: 1; display: flex; flex-direction: column; justify-content: center; min-height: 0; max-width: 960px; padding-bottom: 18px; }
  h1 { margin: 0; font: 400 76px/1.04 Gelasio, serif; letter-spacing: -.025em; }
  .sub { margin: 20px 0 0; font-size: 25px; font-weight: 400; line-height: 1.35; color: #a5b0b8; }
  footer { display: flex; align-items: center; gap: 20px; padding-top: 26px; border-top: 2px solid rgba(255,255,255,.12); }
  footer img.photo { width: 76px; height: 76px; border-radius: 50%; }
  footer div { flex: 1; }
  footer strong { display: block; font-size: 26px; font-weight: 600; }
  footer span { display: block; margin-top: 4px; font-size: 21px; color: #a5b0b8; }
  footer img.logo { width: 58px; height: 58px; }
</style></head><body>
  <div class="top"><div class="kicker">${esc(kicker)}</div>${number ? `<div class="number">${esc(number)}</div>` : ""}</div>
  <div class="copy"><h1>${esc(title)}</h1>${sub ? `<p class="sub">${esc(sub)}</p>` : ""}</div>
  <footer>
    <img class="photo" src="data:image/jpeg;base64,${PHOTO}" alt="">
    <div><strong>Stiven Janaqi</strong><span>stivencatalyst.com</span></div>
    <img class="logo" src="data:image/svg+xml;base64,${LOGO}" alt="">
  </footer>
<script>
  // The largest title that fits; a long lede is shortened to two lines first.
  window.fit = () => {
    const box = document.querySelector(".copy");
    const title = box.querySelector("h1");
    const sub = box.querySelector(".sub");
    if (sub) { sub.style.display = "-webkit-box"; sub.style.webkitLineClamp = "2"; sub.style.webkitBoxOrient = "vertical"; sub.style.overflow = "hidden"; }
    for (let size = 76; size > 38 && box.scrollHeight > box.clientHeight; size -= 2) title.style.fontSize = size + "px";
  };
</script>
</body></html>`;

// Every card to make: { file, ...card }.
export const cards = () => {
  const list = [];
  for (const lang of ["en", "de", "sq"]) {
    const dir = `src/media/social/${lang}`;
    const essays = piecesOf(lang, "insights");
    // Each essay is numbered within its series (essaySeries.json), against the essays the series plans.
    for (const info of SERIES) {
      const inSeries = essays.filter(({ data }) => (data.series || SERIES[0].id) === info.id);
      const total = Math.max(inSeries.length, info.planned || 0);
      inSeries.forEach(({ slug, data }, index) => list.push({
        file: `${dir}/insight-${slug}.jpg`,
        kicker: `${t(lang, "Essay")} · ${data.category || ""}`.replace(/ · $/, ""),
        number: String(index + 1).padStart(2, "0"),
        title: data.title,
        sub: `${info.name[lang]} · ${t(lang, "Essay {n} of {total}").replace("{n}", index + 1).replace("{total}", total)}`,
      }));
    }
    for (const { slug, data } of piecesOf(lang, "reflections")) {
      list.push({ file: `${dir}/reflection-${slug}.jpg`, kicker: t(lang, "Reflection"), title: data.title, sub: data.summary });
    }
    for (const [name, [kicker, title, sub]] of Object.entries(PAGES)) {
      list.push({ file: `${dir}/page-${name}.jpg`, kicker: t(lang, kicker), title: t(lang, title), sub: t(lang, sub) });
    }
  }
  return list;
};

const loadChromium = async () => {
  try {
    return (await import("playwright")).chromium;
  } catch {
    const global = execSync("npm root -g").toString().trim();
    return createRequire(import.meta.url)(path.join(global, "playwright")).chromium;
  }
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const chromium = await loadChromium();
  const browser = await chromium.launch();
  const tab = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  const list = cards();
  for (const item of list) {
    await tab.setContent(card(item), { waitUntil: "load" });
    await tab.evaluate(async () => { await document.fonts.ready; window.fit(); });
    fs.mkdirSync(path.dirname(path.join(ROOT, item.file)), { recursive: true });
    await tab.screenshot({ path: path.join(ROOT, item.file), type: "jpeg", quality: 86 });
  }
  await browser.close();
  console.log(`${list.length} page cards`);
}
