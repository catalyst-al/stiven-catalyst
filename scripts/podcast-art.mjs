// The artwork of the podcast (src/_data/podcast.js): the show's cover, 3000 × 3000, and one square picture per
// episode, 1400 × 1400, the sizes Apple Podcasts and Spotify ask for. Both are drawn here as HTML and photographed
// with Chromium: the Catalyst light hanging from its cable, its filament a sound wave (the voice of the brand), the
// masthead of the Management Review with its second word in red, and the word PODCAST in blue. An episode adds its
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

// The light, in a 1000 × 1000 square: the cable from the top edge, the black cap with its brass ring, the glass
// glowing warm, and inside it a sound wave of eleven bars, loudest in the middle.
const bulb = (cx, cy, b) => {
  const neck = cy - 0.52 * b;
  const capTop = neck - 0.46 * b;
  const bars = Array.from({ length: 11 }, (_, i) => {
    const px = cx - 0.3 * b + (i * 0.6 * b) / 10;
    const env = Math.sin((i / 10) * Math.PI);
    const h = (0.05 + 0.2 * env * (0.72 + 0.28 * Math.sin(i * 1.7 + 0.6))) * b;
    return `<line x1="${px}" y1="${cy + 0.22 * b - h}" x2="${px}" y2="${cy + 0.22 * b + h}" stroke-opacity="${0.6 + 0.4 * env}"/>`;
  }).join("");
  return `
  <defs>
    <radialGradient id="halo" cx="${cx}" cy="${cy + 0.1 * b}" r="${2.6 * b}" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#ffe2b0" stop-opacity=".42"/><stop offset=".35" stop-color="#ffcf8a" stop-opacity=".12"/><stop offset="1" stop-color="#ffcf8a" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glass" cx="${cx - 0.14 * b}" cy="${cy + 0.05 * b}" r="${0.95 * b}" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#ffffff"/><stop offset=".55" stop-color="#fffaf0"/><stop offset="1" stop-color="#ffe6bb"/>
    </radialGradient>
    <linearGradient id="cable" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dce6f0" stop-opacity="0"/><stop offset="1" stop-color="#dce6f0" stop-opacity=".65"/></linearGradient>
    <linearGradient id="cap" x1="0" x2="1"><stop offset="0" stop-color="#050607"/><stop offset=".55" stop-color="#23272a"/><stop offset="1" stop-color="#050607"/></linearGradient>
    <filter id="glow" x="-1" y="-1" width="3" height="3"><feGaussianBlur stdDeviation="${0.09 * b}" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="spark" x="-1" y="-1" width="3" height="3"><feGaussianBlur stdDeviation="${0.012 * b}" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <circle cx="${cx}" cy="${cy + 0.1 * b}" r="${2.6 * b}" fill="url(#halo)"/>
  <rect x="${cx - 0.02 * b}" y="0" width="${0.04 * b}" height="${capTop}" fill="url(#cable)"/>
  <path filter="url(#glow)" fill="url(#glass)" d="M${cx - 0.22 * b} ${neck}
    C${cx - 0.24 * b} ${cy - 0.28 * b} ${cx - 0.64 * b} ${cy - 0.24 * b} ${cx - 0.64 * b} ${cy + 0.16 * b}
    C${cx - 0.64 * b} ${cy + 0.6 * b} ${cx - 0.32 * b} ${cy + 0.84 * b} ${cx} ${cy + 0.84 * b}
    C${cx + 0.32 * b} ${cy + 0.84 * b} ${cx + 0.64 * b} ${cy + 0.6 * b} ${cx + 0.64 * b} ${cy + 0.16 * b}
    C${cx + 0.64 * b} ${cy - 0.24 * b} ${cx + 0.24 * b} ${cy - 0.28 * b} ${cx + 0.22 * b} ${neck} Z"/>
  <g stroke="#ff9632" stroke-opacity=".75" stroke-width="${0.03 * b}" stroke-linecap="round">
    <line x1="${cx - 0.1 * b}" y1="${neck + 0.05 * b}" x2="${cx - 0.1 * b}" y2="${cy - 0.02 * b}"/>
    <line x1="${cx + 0.1 * b}" y1="${neck + 0.05 * b}" x2="${cx + 0.1 * b}" y2="${cy - 0.02 * b}"/>
  </g>
  <g stroke="#ff8a1e" stroke-width="${0.05 * b}" stroke-linecap="round" filter="url(#spark)">${bars}</g>
  <rect x="${cx - 0.25 * b}" y="${capTop}" width="${0.5 * b}" height="${neck - capTop + 0.02 * b}" rx="${0.05 * b}" fill="url(#cap)"/>
  <rect x="${cx - 0.25 * b}" y="${capTop + 0.14 * b}" width="${0.5 * b}" height="${0.022 * b}" fill="#fff" fill-opacity=".08"/>
  <rect x="${cx - 0.25 * b}" y="${capTop + 0.26 * b}" width="${0.5 * b}" height="${0.022 * b}" fill="#fff" fill-opacity=".08"/>
  <rect x="${cx - 0.25 * b}" y="${neck - 0.04 * b}" width="${0.5 * b}" height="${0.06 * b}" fill="#d1a553"/>`;
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
<svg class="light" viewBox="0 0 1000 1000">${bulb(light.x, light.y, light.b)}</svg>
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
