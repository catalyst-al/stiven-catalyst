// Makes src/social.png (1200 × 630): the card of the site itself, the mark (the circled point) at the centre of its
// small system with the name and the motto beside it. The structured data of every page names it as the logo of the
// publisher, and a page without a link preview of its own falls back to it (layouts/base.njk).
//
// Run it after changing the mark, the name or the motto:  node scripts/social-default.mjs
// It needs Playwright with Chromium (npm i -g playwright, or a local copy).
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const base64 = (file) => fs.readFileSync(path.join(ROOT, file)).toString("base64");
const DISPLAY = base64("src/fonts/archivo-black-latin-400-normal.woff2");
const SANS = base64("scripts/guide-fonts/inter-latin-600-normal.woff2");
// The ring of the mark, in its display weight: the one drawing of it, read from the stylesheet.
const RING = decodeURIComponent(fs.readFileSync(path.join(ROOT, "src/css/01-foundation.css"), "utf8")
  .match(/--mark-ring-display: url\("data:image\/svg\+xml,(.*?)"\)/)[1]).match(/d='([^']+)'/)[1];

// The four families on the orbits round the mark: colour, orbit (rx, ry), place on it in degrees, size.
const CX = 322;
const CY = 315;
const ORBITS = [[182, 76], [252, 106], [322, 138]];
const PLANETS = [["#b09cfa", 0, 28, 9], ["#84c6f7", 1, 205, 10.5], ["#f6cc80", 1, 318, 12], ["#d6dee6", 2, 112, 9.5]];
const planets = PLANETS.map(([colour, orbit, degrees, r]) => {
  const [rx, ry] = ORBITS[orbit];
  const x = (CX + rx * Math.cos((degrees * Math.PI) / 180)).toFixed(1);
  const y = (CY + ry * Math.sin((degrees * Math.PI) / 180)).toFixed(1);
  return `<circle cx="${x}" cy="${y}" r="${r * 2.6}" fill="${colour}" opacity=".16"/><circle cx="${x}" cy="${y}" r="${r}" fill="${colour}"/>`;
}).join("");

export const html = () => `<!doctype html><html><head><meta charset="utf-8"><style>
  @font-face { font-family: "Archivo Black"; src: url(data:font/woff2;base64,${DISPLAY}) format("woff2"); }
  @font-face { font-family: Inter; font-weight: 600; src: url(data:font/woff2;base64,${SANS}) format("woff2"); }
  * { box-sizing: border-box; }
  html, body { margin: 0; width: 1200px; height: 630px; }
  body {
    position: relative; overflow: hidden;
    background:
      radial-gradient(760px 520px at 100% 0%, rgba(10,106,176,.24), transparent 70%),
      #05080b;
    color: #f6f7f4; font-family: Inter, sans-serif;
  }
  svg { position: absolute; inset: 0; }
  .name { position: absolute; left: 676px; top: 50%; translate: 0 -50%; }
  .name small { display: block; margin-left: 5px; font-size: 24px; font-weight: 600; letter-spacing: .5em; }
  .name b { display: block; margin-top: 12px; font: 400 84px/.9 "Archivo Black", sans-serif; letter-spacing: -.03em; }
  .name p { margin: 28px 0 0 5px; font-size: 26px; font-weight: 600; color: #a5b0b8; }
  .name span { display: block; margin: 34px 0 0 5px; font-size: 19px; font-weight: 600; letter-spacing: .16em; text-transform: uppercase; color: #4ab5f7; }
</style></head><body>
  <svg width="1200" height="630" viewBox="0 0 1200 630">
    <defs>
      <radialGradient id="light"><stop offset="0" stop-color="#1e68a8" stop-opacity=".5"/><stop offset="1" stop-color="#1e68a8" stop-opacity="0"/></radialGradient>
      <radialGradient id="still"><stop offset=".55" stop-color="#05080b"/><stop offset="1" stop-color="#05080b" stop-opacity="0"/></radialGradient>
    </defs>
    <ellipse cx="${CX}" cy="${CY}" rx="520" ry="290" fill="url(#light)"/>
    <ellipse cx="${CX}" cy="${CY}" rx="124" ry="111" fill="url(#still)"/>
    <g transform="rotate(-9 ${CX} ${CY})">
      ${ORBITS.map(([rx, ry], i) => `<ellipse cx="${CX}" cy="${CY}" rx="${rx}" ry="${ry}" fill="none" stroke="#bed6ec" stroke-opacity="${0.26 - i * 0.05}" stroke-width="1.5"/>`).join("")}
      ${planets}
    </g>
    <g transform="translate(${CX - 50 * 2.6} ${CY - 52 * 2.6}) scale(2.6)"><path d="${RING}" fill="#f6f7f4"/><rect x="42" y="44" width="16" height="16" fill="#4ab5f7"/></g>
  </svg>
  <div class="name"><small>STIVEN</small><b>CATALYST</b><p>Management without theatre.</p><span>stivencatalyst.com</span></div>
</body></html>`;

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  let chromium;
  try {
    ({ chromium } = await import("playwright"));
  } catch {
    ({ chromium } = createRequire(import.meta.url)(path.join(execSync("npm root -g").toString().trim(), "playwright")));
  }
  const browser = await chromium.launch();
  const tab = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await tab.setContent(html(), { waitUntil: "load" });
  await tab.evaluate(() => document.fonts.ready);
  await tab.screenshot({ path: path.join(ROOT, "src/social.png"), type: "png" });
  await browser.close();
  console.log("src/social.png");
}
