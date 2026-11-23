// The artwork of the podcast (src/_data/podcast.js): the show's cover, 3000 × 3000, and one square picture per
// episode, 1400 × 1400, the sizes Apple Podcasts and Spotify ask for. Both are drawn here as HTML and photographed
// with Chromium: the mark (the circled point) at the centre of its small system, the masthead of the Management
// Review with its second word in red, and the word PODCAST in blue beside a sound wave. An episode adds its
// number and title. Written to src/media/podcast/cover.jpg and src/media/podcast/<slug>-<lang>.jpg, with a small
// WebP of each for the podcast page.
//
//   node scripts/podcast-art.mjs        (after scripts/audio.mjs has listed a new episode)
//
// It needs Playwright with Chromium (npm i -g playwright, or a local copy) and ImageMagick (convert) for the WebP copies.
import fs from "node:fs";
import path from "node:path";
import { execFileSync, execSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const { default: podcast } = await import(path.join(ROOT, "src/_data/podcast.js"));
const font = (file) => fs.readFileSync(path.join(ROOT, "src/fonts", file)).toString("base64");
const DISPLAY = font("archivo-black-latin-400-normal.woff2");
const INTER = { 600: font("inter-latin-600-normal.woff2"), 700: font("inter-latin-700-normal.woff2") };
const esc = (text) => String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const OUT = path.join(ROOT, "src/media/podcast");

// The ring of the mark, in its display weight: the one drawing of it, read from the stylesheet.
const RING = decodeURIComponent(fs.readFileSync(path.join(ROOT, "src/css/01-foundation.css"), "utf8")
  .match(/--mark-ring-display: url\("data:image\/svg\+xml,(.*?)"\)/)[1]).match(/d='([^']+)'/)[1];

// The mark, in a 1000 × 1000 square: the circled point at cx, cy at the centre of its small system, three thin orbits
// with the four families on them. The mark is flat (the ring in the colour of the text, the point in the accent); the
// cool light begins outside the ring. b sets the size, as it did for the light the artwork carried before.
const mark = (cx, cy, b) => {
  const m = b / 50;
  const orbits = [1.3, 1.85, 2.4].map((k) => [k * b, k * b * 0.42]);
  const at = (orbit, degrees) => {
    const [rx, ry] = orbits[orbit];
    return [cx + rx * Math.cos((degrees * Math.PI) / 180), cy + ry * Math.sin((degrees * Math.PI) / 180)];
  };
  const planets = [["#b09cfa", 0, 28, 0.05], ["#84c6f7", 1, 205, 0.058], ["#f6cc80", 1, 318, 0.066], ["#d6dee6", 2, 112, 0.054]]
    .map(([colour, orbit, degrees, r]) => {
      const [x, y] = at(orbit, degrees);
      return `<circle cx="${x}" cy="${y}" r="${r * b * 2.6}" fill="${colour}" opacity=".16"/><circle cx="${x}" cy="${y}" r="${r * b}" fill="${colour}"/>`;
    }).join("");
  return `
  <defs>
    <radialGradient id="cool"><stop offset="0" stop-color="#1e68a8" stop-opacity=".5"/><stop offset="1" stop-color="#1e68a8" stop-opacity="0"/></radialGradient>
    <radialGradient id="still"><stop offset=".55" stop-color="#060a10"/><stop offset="1" stop-color="#060a10" stop-opacity="0"/></radialGradient>
  </defs>
  <ellipse cx="${cx}" cy="${cy}" rx="${2.9 * b}" ry="${1.7 * b}" fill="url(#cool)"/>
  <ellipse cx="${cx}" cy="${cy}" rx="${0.96 * b}" ry="${0.86 * b}" fill="url(#still)"/>
  <g transform="rotate(-9 ${cx} ${cy})">
    ${orbits.map(([rx, ry], i) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="#bed6ec" stroke-opacity="${0.26 - i * 0.05}" stroke-width="${0.008 * b}"/>`).join("")}
    ${planets}
  </g>
  <g transform="translate(${cx - 50 * m} ${cy - 52 * m}) scale(${m})"><path d="${RING}" fill="#f6f7f4"/><rect x="42" y="44" width="16" height="16" fill="#4ab5f7"/></g>`;
};

const page = (body, light) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: Display; src: url(data:font/woff2;base64,${DISPLAY}) format("woff2"); }
@font-face { font-family: Inter; font-weight: 600; src: url(data:font/woff2;base64,${INTER[600]}) format("woff2"); }
@font-face { font-family: Inter; font-weight: 700; src: url(data:font/woff2;base64,${INTER[700]}) format("woff2"); }
* { margin: 0; box-sizing: border-box; }
html, body { width: 1000px; height: 1000px; overflow: hidden; }
body { position: relative; background: #060a10; color: #f6f7f4; font-family: Inter, sans-serif;
  background-image: radial-gradient(ellipse 70% 45% at 50% -8%, rgba(74,181,247,.20), rgba(74,181,247,0) 70%); }
svg.light { position: absolute; inset: 0; width: 1000px; height: 1000px; }
.brand { position: absolute; left: 80px; top: 84px; font-weight: 700; font-size: 26px; letter-spacing: .32em; text-transform: uppercase; }
.brand i { display: block; width: 64px; height: 7px; margin-top: 22px; background: #ff4b5c; }
.mast { font-family: Display, sans-serif; text-transform: uppercase; line-height: .9; letter-spacing: -.01em; white-space: nowrap; }
.mast span { display: block; color: #ff4b5c; }
.tag { display: flex; align-items: center; gap: 18px; color: #4ab5f7; font-weight: 700; letter-spacing: .34em; text-transform: uppercase; white-space: nowrap; }
.tag svg { flex: none; }
.foot { position: absolute; left: 80px; right: 80px; bottom: 80px; }
</style></head><body>
<svg class="light" viewBox="0 0 1000 1000">${mark(light.x, light.y, light.b)}</svg>
${body}
<script>
  // The longest word of a line must stay inside the square: the size comes down until it fits.
  window.fit = () => document.querySelectorAll("[data-fit]").forEach((el) => {
    const max = Number(el.dataset.fit);
    let size = parseFloat(getComputedStyle(el).fontSize);
    while (el.scrollWidth > max && size > 10) el.style.fontSize = (size -= 2) + "px";
  });
</script>
</body></html>`;

// Four bars of a sound wave, the mark beside the word PODCAST.
const wave = (h) => `<svg width="${h * 1.1}" height="${h}" viewBox="0 0 22 20" aria-hidden="true"><g stroke="#4ab5f7" stroke-width="3.2" stroke-linecap="round"><line x1="2" y1="7" x2="2" y2="13"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="14" y1="5" x2="14" y2="15"/><line x1="20" y1="8" x2="20" y2="12"/></g></svg>`;

const cover = () => page(`
<p class="brand">Stiven Catalyst<i></i></p>
<div class="foot">
  <div class="mast" data-fit="840" style="font-size:112px">Management<span>Review</span></div>
  <p class="tag" style="margin-top:44px;font-size:34px">${wave(34)}Podcast</p>
</div>`, { x: 690, y: 330, b: 205 });

const episode = (e) => page(`
<p class="brand">Stiven Catalyst<i></i></p>
<div class="foot">
  <p class="mast" style="font-size:44px">Management <span style="display:inline">Review</span></p>
  <p style="margin-top:36px;font-family:Display,sans-serif;font-size:150px;line-height:.9;color:#4ab5f7">${esc(e.label)}</p>
  <p data-fit="840" style="margin-top:34px;max-width:840px;font-weight:700;font-size:58px;line-height:1.08;letter-spacing:-.015em">${esc(e.title)}</p>
  <p class="tag" style="margin-top:40px;font-size:26px">${wave(26)}Podcast · ${e.minutes} min</p>
</div>`, { x: 760, y: 250, b: 150 });

const loadChromium = async () => {
  try {
    return (await import("playwright")).chromium;
  } catch {
    const global = execSync("npm root -g").toString().trim();
    return createRequire(import.meta.url)(path.join(global, "playwright")).chromium;
  }
};
const chromium = await loadChromium();
const browser = await chromium.launch(fs.existsSync("/opt/pw-browsers/chromium") ? { executablePath: "/opt/pw-browsers/chromium" } : {});

// Photographs the 1000 × 1000 page at the given size, and a 600 px WebP beside it for the web page.
const save = async (html, file, size) => {
  const tab = await browser.newPage({ viewport: { width: 1000, height: 1000 }, deviceScaleFactor: size / 1000 });
  await tab.setContent(html, { waitUntil: "load" });
  await tab.evaluate(async () => { await document.fonts.ready; window.fit(); });
  await tab.screenshot({ path: file, type: "jpeg", quality: 90 });
  await tab.close();
  execFileSync("convert", [file, "-resize", "600x600", "-strip", "-quality", "82", "-define", "webp:method=6", file.replace(/\.jpg$/, "-600.webp")]);
  console.log(`${path.relative(ROOT, file)}: ${(fs.statSync(file).size / 1024).toFixed(0)} KB`);
};

fs.mkdirSync(OUT, { recursive: true });
await save(cover(), path.join(OUT, "cover.jpg"), 3000);
for (const feed of podcast.feeds) {
  for (const e of feed.episodes) await save(episode(e), path.join(ROOT, "src", e.image), 1400);
}
await browser.close();
