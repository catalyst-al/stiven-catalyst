// The icons of the site as an app (manifest.webmanifest): src/icons/icon-192.png, icon-512.png and a maskable
// 512 px icon with the bulb inside the safe zone, drawn from favicon.svg in Chromium. Run it again after the
// favicon changes:  node scripts/app-icons.mjs
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const svg = fs.readFileSync(path.join(ROOT, "src/favicon.svg"), "utf8");
const loadChromium = async () => {
  for (const spec of ["playwright", "playwright-core", "/opt/node-tools/node_modules/playwright"]) {
    try { const mod = await import(createRequire(path.join(ROOT, "package.json")).resolve(spec)); return mod.chromium || mod.default?.chromium; } catch { /* next */ }
  }
  throw new Error("Playwright is not installed: npm i -D playwright");
};
const page = (size, inset) => `<!doctype html><html><body style="margin:0;background:${inset ? "#0b1218" : "transparent"}">
<div style="width:${size}px;height:${size}px;display:grid;place-items:center;background:${inset ? "#0b1218" : "transparent"}">
<div style="width:${size - 2 * inset}px;height:${size - 2 * inset}px">${svg.replace("<svg ", '<svg width="100%" height="100%" ')}</div></div></body></html>`;

const chromium = await loadChromium();
const browser = await chromium.launch();
const dir = path.join(ROOT, "src/icons");
fs.mkdirSync(dir, { recursive: true });
for (const [name, size, inset] of [["icon-192.png", 192, 0], ["icon-512.png", 512, 0], ["icon-maskable-512.png", 512, 80]]) {
  const tab = await browser.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: 1 });
  await tab.setContent(page(size, inset));
  await tab.screenshot({ path: path.join(dir, name), omitBackground: !inset, clip: { x: 0, y: 0, width: size, height: size } });
  await tab.close();
  console.log(`${name}: ${size} px`);
}
await browser.close();
