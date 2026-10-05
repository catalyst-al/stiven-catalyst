// Makes the image of every field note (1080 × 1350, the portrait size LinkedIn and Instagram show whole in the
// feed), in English, German and Albanian: src/media/notes/<lang>/<slug>.jpg. The Field Notes page offers each
// one for download, to post with the note. The quote is set in Gelasio (the free face drawn to Georgia's
// measure, which the site uses for quotes); the label in Inter.
//
// Run it after adding or changing a note:  node scripts/note-cards.mjs
// It needs Playwright with Chromium (npm i -g playwright, or a local copy).
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const base64 = (file) => fs.readFileSync(path.join(ROOT, file)).toString("base64");
const esc = (text) => String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const SERIF = base64("scripts/note-card-fonts/gelasio-latin-400-normal.woff2");
const SANS = base64("scripts/guide-fonts/inter-latin-600-normal.woff2");
const PHOTO = base64("src/media/stiven-headshot.jpg");
const LOGO = base64("src/favicon.svg");

const LANGS = {
  en: { dir: "src/content/notes", label: "Field note" },
  de: { dir: "src/content/de/notes", label: "Field Note" },
  sq: { dir: "src/content/sq/notes", label: "Shënim nga terreni" },
};

// The notes of a language: { slug, quote }. The slug is the file name without its date, as on the page
// (note-<slug>).
export const notesOf = (dir) =>
  fs.readdirSync(path.join(ROOT, dir))
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const text = fs.readFileSync(path.join(ROOT, dir, file), "utf8");
      const quote = (text.match(/^quote:\s*(["'])([\s\S]*?)\1\s*$/m) || [])[2];
      return { slug: file.replace(/\.md$/, "").replace(/^\d{4}-\d{2}-\d{2}-/, ""), quote: quote && quote.replace(/\\"/g, '"').replace(/''/g, "'") };
    })
    .filter((note) => note.quote);

const card = (quote, label) => `<!doctype html><html><head><meta charset="utf-8"><style>
  @font-face { font-family: Gelasio; src: url(data:font/woff2;base64,${SERIF}) format("woff2"); }
  @font-face { font-family: Inter; font-weight: 600; src: url(data:font/woff2;base64,${SANS}) format("woff2"); }
  * { box-sizing: border-box; }
  html, body { margin: 0; width: 1080px; height: 1350px; }
  body {
    display: flex; flex-direction: column; padding: 96px 96px 84px;
    background:
      radial-gradient(900px 700px at 0% 0%, rgba(74,181,247,.16), transparent 60%),
      radial-gradient(700px 600px at 100% 100%, rgba(209,165,83,.08), transparent 60%),
      #060a10;
    color: #f6f7f4; font-family: Inter, sans-serif;
  }
  .label { font-size: 26px; font-weight: 600; letter-spacing: .16em; text-transform: uppercase; color: #4ab5f7; }
  .mark { height: 150px; margin: 34px 0 0 -8px; font: 300px/1 Gelasio, serif; color: #4ab5f7; }
  .quote { flex: 1; display: flex; align-items: center; min-height: 0; padding-bottom: 32px; }
  blockquote { margin: 0; font-family: Gelasio, serif; font-size: 112px; line-height: 1.1; letter-spacing: -.025em; overflow-wrap: break-word; }
  footer { display: flex; align-items: center; gap: 26px; padding-top: 44px; border-top: 2px solid rgba(255,255,255,.12); }
  footer img.photo { width: 104px; height: 104px; border-radius: 50%; }
  footer div { flex: 1; }
  footer strong { display: block; font-size: 34px; font-weight: 600; letter-spacing: -.01em; }
  footer span { display: block; margin-top: 6px; font-size: 26px; color: #a5b0b8; }
  footer img.logo { width: 76px; height: 76px; }
</style></head><body>
  <div class="label">${esc(label)}</div>
  <div class="mark">“</div>
  <div class="quote"><blockquote>${esc(quote)}</blockquote></div>
  <footer>
    <img class="photo" src="data:image/jpeg;base64,${PHOTO}" alt="">
    <div><strong>Stiven Janaqi</strong><span>stivencatalyst.com</span></div>
    <img class="logo" src="data:image/svg+xml;base64,${LOGO}" alt="">
  </footer>
<script>
  // The largest size at which the quote fits its space.
  window.fit = () => {
    const box = document.querySelector(".quote");
    const text = box.querySelector("blockquote");
    for (let size = 112; size > 44 && text.scrollHeight > box.clientHeight; size -= 2) text.style.fontSize = size + "px";
  };
</script>
</body></html>`;

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
  const tab = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
  let made = 0;
  for (const [lang, { dir, label }] of Object.entries(LANGS)) {
    const out = path.join(ROOT, "src/media/notes", lang);
    fs.mkdirSync(out, { recursive: true });
    for (const { slug, quote } of notesOf(dir)) {
      await tab.setContent(card(quote, label), { waitUntil: "load" });
      await tab.evaluate(async () => { await document.fonts.ready; window.fit(); });
      await tab.screenshot({ path: path.join(out, `${slug}.jpg`), type: "jpeg", quality: 86 });
      made += 1;
    }
  }
  await browser.close();
  console.log(`${made} note cards`);
}
