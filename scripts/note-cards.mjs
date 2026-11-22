// Makes the image of every field note (1080 × 1350, the portrait size LinkedIn and Instagram show whole in the
// feed), in English, German and Albanian: src/media/notes/<lang>/<slug>.jpg. The Field Notes page offers each
// one for download, to post with the note. The quote is set in Gelasio (the free face drawn to Georgia's
// measure, which the site uses for quotes); the label in Inter; the name in the banner in Archivo Black.
//
// Run it after adding or changing a note:  node scripts/note-cards.mjs
// Only some notes, in every language:       node scripts/note-cards.mjs 29-twice 87-changed-hands
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
// The portrait for the cards: the head centred in the circle, with room above the hair.
const PHOTO = base64("scripts/note-card-photo.jpg");
const DISPLAY = base64("src/fonts/archivo-black-latin-400-normal.woff2");
// The ring of the mark, in its display weight: the one drawing of it, read from the stylesheet
// (--mark-ring-display, src/css/01-foundation.css), for the banner at the foot of the card.
const RING = decodeURIComponent(fs.readFileSync(path.join(ROOT, "src/css/01-foundation.css"), "utf8")
  .match(/--mark-ring-display: url\("data:image\/svg\+xml,(.*?)"\)/)[1]).match(/d='([^']+)'/)[1];

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

export const card = (quote, label) => `<!doctype html><html><head><meta charset="utf-8"><style>
  @font-face { font-family: Gelasio; src: url(data:font/woff2;base64,${SERIF}) format("woff2"); }
  @font-face { font-family: Inter; font-weight: 600; src: url(data:font/woff2;base64,${SANS}) format("woff2"); }
  @font-face { font-family: "Archivo Black"; src: url(data:font/woff2;base64,${DISPLAY}) format("woff2"); }
  * { box-sizing: border-box; }
  html, body { margin: 0; width: 1080px; height: 1350px; }
  body {
    display: flex; flex-direction: column; padding: 96px 96px 72px;
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
  /* The foot of the card: a banner with the mark (the circled point) at the centre of its small system and the
     name beside it, the round photo sitting over the banner's lower left edge, like the header of a profile. The
     mark is flat: the ring in the colour of the text, the point in the accent; the soft light begins outside it. */
  footer { position: relative; margin-top: 28px; padding-bottom: 6px; }
  .banner {
    position: relative; height: 236px; border-radius: 30px; overflow: hidden;
    border: 2px solid rgba(255,255,255,.08);
    background:
      radial-gradient(620px 360px at 100% 0%, rgba(10,106,176,.3), transparent 70%),
      linear-gradient(180deg, #0c131c, #070b11);
  }
  .banner svg { position: absolute; inset: 0; }
  .name { position: absolute; left: 468px; top: 50%; translate: 0 -50%; }
  .name small { display: block; margin-left: 4px; font-size: 19px; font-weight: 600; letter-spacing: .46em; color: #f6f7f4; }
  .name b { display: block; margin-top: 7px; font: 400 66px/.9 "Archivo Black", sans-serif; letter-spacing: -.03em; color: #f6f7f4; }
  footer img.photo {
    position: absolute; left: 34px; top: 132px; width: 168px; height: 168px; border-radius: 50%;
    border: 7px solid #060a10; box-shadow: 0 0 0 2px rgba(74,181,247,.45);
  }
  .who { margin: 18px 0 0 232px; }
  footer strong { display: block; font-size: 34px; font-weight: 600; letter-spacing: -.01em; }
  footer span { display: block; margin-top: 4px; font-size: 26px; color: #a5b0b8; }
</style></head><body>
  <div class="label">${esc(label)}</div>
  <div class="mark">“</div>
  <div class="quote"><blockquote>${esc(quote)}</blockquote></div>
  <footer>
    <div class="banner">
      <svg width="884" height="232" viewBox="0 0 884 232">
        <defs>
          <radialGradient id="light"><stop offset="0" stop-color="#1e68a8" stop-opacity=".5"/><stop offset="1" stop-color="#1e68a8" stop-opacity="0"/></radialGradient>
          <radialGradient id="still"><stop offset=".55" stop-color="#080d14"/><stop offset="1" stop-color="#080d14" stop-opacity="0"/></radialGradient>
        </defs>
        <g transform="translate(0 -2)">
          <ellipse cx="326" cy="118" rx="330" ry="150" fill="url(#light)"/>
          <ellipse cx="326" cy="118" rx="92" ry="82" fill="url(#still)"/>
          <g transform="rotate(-9 326 118)">
            <ellipse cx="326" cy="118" rx="150" ry="60" fill="none" stroke="#bed6ec" stroke-opacity=".24" stroke-width="1.5"/>
            <ellipse cx="326" cy="118" rx="236" ry="96" fill="none" stroke="#bed6ec" stroke-opacity=".17" stroke-width="1.5"/>
            <circle cx="198.8" cy="86.2" r="15.600000000000001" fill="#b09cfa" opacity=".16"/><circle cx="198.8" cy="86.2" r="6" fill="#b09cfa"/><circle cx="426.4" cy="73.4" r="16.900000000000002" fill="#84c6f7" opacity=".16"/><circle cx="426.4" cy="73.4" r="6.5" fill="#84c6f7"/><circle cx="200.9" cy="36.6" r="19.5" fill="#f6cc80" opacity=".16"/><circle cx="200.9" cy="36.6" r="7.5" fill="#f6cc80"/><circle cx="268.9" cy="211.1" r="15.600000000000001" fill="#d6dee6" opacity=".16"/><circle cx="268.9" cy="211.1" r="6" fill="#d6dee6"/>
          </g>
          <g transform="translate(231 19.2) scale(1.9)"><path d="${RING}" fill="#f6f7f4"/><rect x="42" y="44" width="16" height="16" fill="#4ab5f7"/></g>
        </g>
      </svg>
      <div class="name"><small>STIVEN</small><b>CATALYST</b></div>
    </div>
    <img class="photo" src="data:image/jpeg;base64,${PHOTO}" alt="">
    <div class="who"><strong>Stiven Janaqi</strong><span>stivencatalyst.com</span></div>
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
  const only = new Set(process.argv.slice(2));
  let made = 0;
  for (const [lang, { dir, label }] of Object.entries(LANGS)) {
    const out = path.join(ROOT, "src/media/notes", lang);
    fs.mkdirSync(out, { recursive: true });
    for (const { slug, quote } of notesOf(dir)) {
      if (only.size && !only.has(slug)) continue;
      await tab.setContent(card(quote, label), { waitUntil: "load" });
      await tab.evaluate(async () => { await document.fonts.ready; window.fit(); });
      await tab.screenshot({ path: path.join(out, `${slug}.jpg`), type: "jpeg", quality: 86 });
      made += 1;
    }
  }
  await browser.close();
  console.log(`${made} note cards`);
}
