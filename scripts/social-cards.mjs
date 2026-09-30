// Makes the social preview images (1200 × 630) of every tool page and of the Tools page,
// in English, German and Albanian: src/media/social/<lang>/<tool>.jpg and tools.jpg.
// Each card carries the tool's name, its family and the family's drawing (the same shapes
// as the background on the tool page, from src/_data/familySky.js).
//
// Run it after changing a tool's name, summary or family:  node scripts/social-cards.mjs
// It needs Playwright with Chromium (npm i -g playwright, or a local copy).
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import sky from "../src/_data/familySky.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => JSON.parse(fs.readFileSync(path.join(ROOT, file), "utf8"));
const families = read("src/_data/families.json");
const LANGS = {
  en: { tools: read("src/_data/tools.json"), ui: {} },
  de: { tools: read("src/_data/de/tools.json"), ui: read("src/_data/de/ui.json") },
  sq: { tools: read("src/_data/sq/tools.json"), ui: read("src/_data/sq/ui.json") },
};
const t = (lang, text) => LANGS[lang].ui[text] ?? text;
const esc = (text) => String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const local = (url, lang) => (lang === "en" ? url : `/${lang}${url}`);
const slugOf = (url) => url.split("/").filter(Boolean).pop();
// A mix of two #rrggbb colours, t of the way from a to b (SVG attributes take no CSS functions).
const mix = (a, b, t) => "#" + [1, 3, 5].map((i) => Math.round(parseInt(a.slice(i, i + 2), 16) * (1 - t) + parseInt(b.slice(i, i + 2), 16) * t).toString(16).padStart(2, "0")).join("");
const DISPLAY = fs.readFileSync(path.join(ROOT, "src/fonts/archivo-black-latin-400-normal.woff2")).toString("base64");

// ---- The family drawings, on the right of a 1200 × 630 card ----------------------------
const bulb = (x, y, s = 1) => `
  <g transform="translate(${x} ${y}) scale(${s})">
    <circle r="120" fill="url(#halo)"/>
    <rect x="-9" y="-40" width="18" height="16" rx="3" fill="#0d1013"/>
    <rect x="-9" y="-27" width="18" height="3" fill="#d1a553"/>
    <path d="M-8 -24 C-9 -14 -24 -12 -24 4 C-24 20 -12 30 0 30 C12 30 24 20 24 4 C24 -12 9 -14 8 -24 Z" fill="url(#glass)" filter="url(#glow)"/>
  </g>`;

const art = {
  lumen: () => {
    const cone = "915,190 945,190 1260,630 600,630";
    const dust = sky.dust.map((p) => `<circle cx="${(p.x / 100) * 1200}" cy="${(p.y / 100) * 630}" r="${p.size * 0.9}" fill="#fff4dc" opacity="${0.35 + (p.size / 2.8) * 0.5}"/>`).join("");
    return `
      <clipPath id="cone"><polygon points="${cone}"/></clipPath>
      <line x1="930" y1="0" x2="930" y2="150" stroke="rgba(230,236,242,.55)" stroke-width="2"/>
      <g filter="url(#soft)"><polygon points="${cone}" fill="url(#beam)"/><polygon points="922,190 938,190 1080,630 820,630" fill="url(#core)"/></g>
      <g clip-path="url(#cone)">${dust}</g>
      ${bulb(930, 190, 1.3)}`;
  },
  pulse: () => `
      <rect x="560" y="0" width="640" height="630" fill="url(#grid)" mask="url(#fade)"/>
      <g transform="translate(930 220)">
        <circle r="150" fill="none" stroke="var(--family)" stroke-opacity=".18"/>
        <circle r="104" fill="none" stroke="var(--family)" stroke-opacity=".35"/>
        <circle r="62" fill="url(#planet)" filter="url(#glow)"/>
      </g>
      <g transform="translate(-160 430)" mask="url(#fromRight)">
        <path d="${sky.ecg}" fill="none" stroke="var(--family)" stroke-opacity=".45" stroke-width="2"/>
        <path d="${sky.ecg}" pathLength="1000" fill="none" stroke="var(--family)" stroke-width="4" stroke-linecap="round" stroke-dasharray="80 1000" stroke-dashoffset="-520" filter="url(#glow)"/>
      </g>`,
  zenith: () => {
    const cx = 930;
    const cy = 300;
    const r = 240;
    const blips = sky.blips.map((b) => {
      const x = cx + ((b.x - 50) / 50) * r;
      const y = cy + ((b.y - 50) / 50) * r;
      const angle = (Math.atan2(x - cx, cy - y) * 180) / Math.PI;
      const behind = ((50 - angle) % 360 + 360) % 360;
      const lit = behind < 75;
      return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${lit ? 6 : 4.5}" fill="var(--family)" opacity="${lit ? 1 : 0.25}"${lit ? ' filter="url(#glow)"' : ""}/>`;
    }).join("");
    const edge = (deg) => [cx + r * Math.sin((deg * Math.PI) / 180), cy - r * Math.cos((deg * Math.PI) / 180)].map((v) => v.toFixed(1)).join(" ");
    return `
      <g transform="translate(${cx - 450 * 0.95} ${cy - 450 * 0.95}) scale(.95)">
        ${sky.contours.map((c) => `<path d="${c.d}" fill="none" stroke="var(--family)" stroke-opacity="${c.major ? 0.34 : 0.18}"${c.major ? ' stroke-dasharray="2 5"' : ""}/>`).join("")}
      </g>
      <g fill="none" stroke="var(--family)" stroke-opacity=".32">
        <circle cx="${cx}" cy="${cy}" r="${r / 3}"/><circle cx="${cx}" cy="${cy}" r="${(r * 2) / 3}"/><circle cx="${cx}" cy="${cy}" r="${r}"/>
        <path d="M${cx} ${cy - r}V${cy + r}M${cx - r} ${cy}H${cx + r}"/>
      </g>
      <path d="M${cx} ${cy} L${edge(-25)} A${r} ${r} 0 0 1 ${edge(50)} Z" fill="url(#sweep)"/>
      <path d="M${cx} ${cy} L${edge(50)}" stroke="var(--family)" stroke-width="2" filter="url(#glow)"/>
      ${blips}`;
  },
  atlas: () => {
    const map = (p) => [250 + p.x * 0.95, 40 + p.y * 0.95];
    const points = sky.path.map(map);
    const [gx, gy] = points.at(-1);
    return `
      <g transform="translate(250 40) scale(.95)" fill="none" stroke="var(--family)" stroke-opacity=".3">
        <circle cx="912" cy="330" r="74"/><circle cx="912" cy="330" r="56" stroke-dasharray="2 6"/>
        <path d="M912 260 L921 321 L982 330 L921 339 L912 400 L903 339 L842 330 L903 321 Z"/>
        <path d="M912 330 L952 290 L916 334 Z" fill="var(--family)" fill-opacity=".35" stroke="none"/>
      </g>
      <polyline points="${points.map((p) => p.join(",")).join(" ")}" fill="none" stroke="rgba(244,247,251,.55)" stroke-width="1.6"/>
      ${points.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i === points.length - 1 ? 13 : 9}" fill="var(--family)" fill-opacity=".18"/><circle cx="${x}" cy="${y}" r="${i === points.length - 1 ? 5 : 3.6}" fill="#f4f7fb"/>`).join("")}
      <path d="M${gx} ${gy - 30} L${gx + 4} ${gy - 4} L${gx + 30} ${gy} L${gx + 4} ${gy + 4} L${gx} ${gy + 30} L${gx - 4} ${gy + 4} L${gx - 30} ${gy} L${gx - 4} ${gy - 4} Z" fill="#f4f7fb" filter="url(#glow)"/>`;
  },
  academy: () => {
    const letters = ["D", "M", "A", "I", "C"];
    const moons = sky.moons.map((m, i) => {
      const x = 700 + i * 106;
      const y = 250 + m.drop * 2.2;
      const shade = m.shade * 1.5;
      return `
        <mask id="moon${i}"><rect x="0" y="0" width="1200" height="630" fill="#fff"/><circle cx="${x + shade}" cy="${y}" r="34" fill="#000"/></mask>
        <circle cx="${x}" cy="${y}" r="34" fill="url(#moonlight)" filter="url(#glow)"/>
        ${shade ? `<circle cx="${x}" cy="${y}" r="34.5" fill="#070a0d" mask="url(#moon${i})"/>` : ""}
        <text x="${x}" y="${y + 66}" text-anchor="middle" class="letter">${letters[i]}</text>`;
    }).join("");
    return `
      <path d="M655 ${250 + 44 * 2.2} Q ${700 + 2 * 106} ${250 - 110} ${1170} ${250 + 44 * 2.2}" fill="none" stroke="var(--family)" stroke-opacity=".45" stroke-dasharray="3 7"/>
      ${moons}`;
  },
};

// The Tools page: the Catalyst light with the five families on their orbits.
const system = () => {
  const cx = 910;
  const cy = 318;
  const angles = [200, 320, 30, 140, 250];
  return `
    ${families.map((f) => `<ellipse cx="${cx}" cy="${cy}" rx="${f.orbit * 230}" ry="${f.orbit * 230 * 0.42}" fill="none" stroke="${f.color}" stroke-opacity=".32"/>`).join("")}
    ${bulb(cx, cy, 1.15)}
    ${families.map((f, i) => {
      const a = (angles[i] * Math.PI) / 180;
      const x = cx + Math.cos(a) * f.orbit * 230;
      const y = cy + Math.sin(a) * f.orbit * 230 * 0.42;
      // Labels point away from the light, so none runs into the bulb.
      const left = x < cx;
      return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${13 + i}" fill="${f.color}" filter="url(#glow)"/><text x="${(left ? x - 22 - i : x + 22 + i).toFixed(1)}" y="${(y + 5).toFixed(1)}" text-anchor="${left ? "end" : "start"}" class="planet">${f.name.toUpperCase()}</text>`;
    }).join("")}`;
};

const stars = () => sky.stars.map((s) => `<circle cx="${(s.x / 100) * 1200}" cy="${(s.y / 100) * 630}" r="${s.size * 0.6}" fill="#f4f7fb" opacity="${0.15 + (s.size / 2.2) * 0.35}"/>`).join("");

const page = ({ color, drawing, badge, title, line, footer }) => html({ color, badge, title, line, footer, drawing }).replace(/<svg[\s\S]*<\/svg>/, (svg) => svg.replaceAll("var(--family)", color));
const html = ({ color, drawing, badge, title, line, footer }) => `<!doctype html>
<html><head><meta charset="utf-8"><style>
@font-face { font-family: "Archivo Black"; src: url(data:font/woff2;base64,${DISPLAY}) format("woff2"); }
* { box-sizing: border-box; }
html, body { margin: 0; }
body { --family: ${color}; width: 1200px; height: 630px; overflow: hidden; color: #f6f7f4; font-family: "Liberation Sans", Arial, sans-serif; }
.card { position: relative; width: 1200px; height: 630px; overflow: hidden;
  background:
    radial-gradient(640px 520px at 80% 40%, color-mix(in srgb, var(--family) 22%, transparent), transparent 72%),
    radial-gradient(620px 420px at -4% 108%, rgba(223, 17, 25, .14), transparent 70%),
    #05080b; }
svg { position: absolute; inset: 0; }
.letter { fill: var(--family); font: 700 18px "Liberation Sans", Arial, sans-serif; letter-spacing: .2em; }
.planet { fill: #e9eef3; font: 700 15px "Liberation Sans", Arial, sans-serif; letter-spacing: .18em; }
.copy { position: absolute; left: 72px; top: 60px; bottom: 56px; width: 590px; display: flex; flex-direction: column; }
.brand { display: flex; align-items: center; gap: 14px; font-size: 17px; font-weight: 700; letter-spacing: .34em; }
.brand i { position: relative; width: 17px; height: 21px; border-radius: 48% 48% 52% 52%; background: #fff; box-shadow: 0 0 10px #fff, 0 0 26px rgba(120, 190, 247, .8); }
.brand i::before { content: ""; position: absolute; left: 4px; top: -7px; width: 9px; height: 7px; border-radius: 2px 2px 0 0; background: #111; border-bottom: 2px solid #d1a553; }
.middle { margin-top: auto; }
.badge { display: inline-flex; align-items: center; gap: 12px; padding: 9px 18px 9px 13px; border: 1.5px solid color-mix(in srgb, var(--family) 55%, transparent); border-radius: 999px; background: color-mix(in srgb, var(--family) 12%, transparent); font-size: 16px; font-weight: 700; letter-spacing: .2em; text-transform: uppercase; }
.badge b { width: 12px; height: 12px; border-radius: 50%; background: var(--family); box-shadow: 0 0 12px var(--family); }
.badge small { color: #a5b0b8; font-size: 14px; letter-spacing: .16em; }
h1 { margin: 26px 0 0; font: 400 86px/0.92 "Archivo Black", sans-serif; letter-spacing: -.045em; text-transform: uppercase; overflow-wrap: normal; hyphens: manual; }
p { margin: 20px 0 0; color: #b4bec6; font-size: 23px; line-height: 1.38; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.foot { margin-top: auto; display: flex; justify-content: space-between; gap: 20px; padding-top: 22px; border-top: 1px solid rgba(255, 255, 255, .14); color: #a5b0b8; font-size: 15px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; white-space: nowrap; }
.foot span:last-child { color: var(--family); }
</style></head><body><div class="card">
<svg width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="halo"><stop offset="0" stop-color="#fff4d8" stop-opacity=".55"/><stop offset=".45" stop-color="#f5c86a" stop-opacity=".16"/><stop offset="1" stop-color="#f5c86a" stop-opacity="0"/></radialGradient>
    <radialGradient id="glass" cx=".42" cy=".45"><stop offset="0" stop-color="#fff"/><stop offset=".6" stop-color="#fff8ea"/><stop offset="1" stop-color="#ffe2a8"/></radialGradient>
    <radialGradient id="planet" cx=".36" cy=".32"><stop offset="0" stop-color="${mix(color, "#ffffff", 0.7)}"/><stop offset=".45" stop-color="var(--family)"/><stop offset="1" stop-color="${mix(color, "#000000", 0.75)}"/></radialGradient>
    <radialGradient id="moonlight" cx=".38" cy=".34"><stop offset="0" stop-color="#fffaf2"/><stop offset=".5" stop-color="#ffe1c8"/><stop offset="1" stop-color="${mix(color, "#ffffff", 0.4)}"/></radialGradient>
    <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1"><stop offset=".25" stop-color="#fff0cd" stop-opacity=".34"/><stop offset=".7" stop-color="#ffe2aa" stop-opacity=".12"/><stop offset="1" stop-color="#ffe2aa" stop-opacity="0"/></linearGradient>
    <linearGradient id="core" x1="0" y1="0" x2="0" y2="1"><stop offset=".25" stop-color="#fffaeb" stop-opacity=".32"/><stop offset="1" stop-color="#fffaeb" stop-opacity="0"/></linearGradient>
    <linearGradient id="sweep" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="var(--family)" stop-opacity="0"/><stop offset="1" stop-color="var(--family)" stop-opacity=".42"/></linearGradient>
    <pattern id="grid" width="120" height="120" patternUnits="userSpaceOnUse"><path d="M0 0H120M0 0V120" stroke="var(--family)" stroke-opacity=".16"/><path d="M0 24H120M0 48H120M0 72H120M0 96H120M24 0V120M48 0V120M72 0V120M96 0V120" stroke="var(--family)" stroke-opacity=".06"/></pattern>
    <radialGradient id="fadeGrad" cx=".6" cy=".45" r=".6"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#000"/></radialGradient>
    <mask id="fade"><rect x="560" y="0" width="640" height="630" fill="url(#fadeGrad)"/></mask>
    <linearGradient id="rightward" x1="0" y1="0" x2="1" y2="0"><stop offset=".5" stop-color="#000"/><stop offset=".64" stop-color="#fff"/></linearGradient>
    <mask id="fromRight" maskUnits="userSpaceOnUse" x="-2000" y="-2000" width="6000" height="6000"><rect x="160" y="-430" width="1200" height="630" fill="url(#rightward)"/></mask>
    <filter id="glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="14"/></filter>
  </defs>
  ${stars()}
  ${drawing}
</svg>
<div class="copy">
  <div class="brand"><i></i>STIVEN CATALYST</div>
  <div class="middle">
    <span class="badge"><b></b>${esc(badge.name)}<small>${esc(badge.role)}</small></span>
    <h1>${title}</h1>
    ${line ? `<p>${esc(line)}</p>` : ""}
  </div>
  <div class="foot"><span>${esc(footer)}</span><span>stivencatalyst.com</span></div>
</div>
</div>
<script>
  // Once the font is in: the title shrinks until it fits three lines, no word is wider than
  // its column (long German words break only at their soft hyphen), and the text leaves room.
  window.fit = () => {
    const h1 = document.querySelector("h1");
    const copy = document.querySelector(".copy");
    const fits = () => h1.scrollWidth <= h1.clientWidth + 1
      && h1.getBoundingClientRect().height <= parseFloat(h1.style.fontSize || 86) * 0.92 * 3 + 4
      && copy.scrollHeight <= copy.clientHeight + 1;
    for (let size = 86; size >= 40 && !fits(); size -= 2) h1.style.fontSize = size + "px";
  };
</script>
</body></html>`;

// ---- Render --------------------------------------------------------------------------------
const loadChromium = async () => {
  try {
    return (await import("playwright")).chromium;
  } catch {
    const global = execSync("npm root -g").toString().trim();
    return createRequire(import.meta.url)(path.join(global, "playwright")).chromium;
  }
};

const chromium = await loadChromium();
const browser = await chromium.launch();
const tab = await browser.newPage({ viewport: { width: 1200, height: 630 } });
const save = async (html, file) => {
  await tab.setContent(html, { waitUntil: "load" });
  await tab.evaluate(async () => { await document.fonts.ready; window.fit(); });
  fs.mkdirSync(path.dirname(file), { recursive: true });
  await tab.screenshot({ path: file, type: "jpeg", quality: 88 });
};

let made = 0;
for (const [lang, { tools }] of Object.entries(LANGS)) {
  const dir = path.join(ROOT, "src/media/social", lang);
  for (const family of families) {
    for (const url of family.tools) {
      const tool = tools.find((item) => item.url === local(url, lang));
      if (!tool) continue;
      await save(page({
        color: family.color,
        drawing: art[family.id](),
        badge: { name: family.name, role: t(lang, family.role) },
        title: esc(tool.name).replace(/­/g, "&shy;"),
        line: tool.summary,
        footer: t(lang, "Free · Private · No sign-up"),
      }), path.join(dir, `${slugOf(url)}.jpg`));
      made += 1;
    }
  }
  const count = tools.filter((tool) => tool.url).length;
  await save(page({
    color: "#4ab5f7",
    drawing: system(),
    badge: { name: "Catalyst", role: families.map((f) => f.name).join(" · ") },
    title: esc(t(lang, "Tools")),
    line: t(lang, "{n} free tools in five families").replace("{n}", count),
    footer: t(lang, "Free · Private · No sign-up"),
  }), path.join(dir, "tools.jpg"));
  made += 1;
}
await browser.close();
console.log(`${made} cards written to src/media/social/`);
