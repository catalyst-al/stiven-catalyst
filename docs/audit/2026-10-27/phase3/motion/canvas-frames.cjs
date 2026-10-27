// Phase 3, motion: what the planets' canvas draws, compared before the browser puts it on the screen.
//
//   node docs/audit/2026-10-27/phase3/motion/canvas-frames.cjs --a http://127.0.0.1:8321 --b http://127.0.0.1:8322 \
//        [--out docs/audit/2026-10-27/phase3/motion/canvas-frames.json]
//
// frames.cjs compares screenshots, i.e. the drawing after the browser has fitted the canvas into the page. This script
// compares the drawing itself: with time frozen the same way (seeded Math.random, virtual clock), it reads every
// canvas of the hero (one before the change; the planets' band and the sky above and below it after), puts them
// together at their rows into one picture of the whole hero, and compares that picture pixel by pixel (RGBA) with the
// other build's, at 390, 768 and 1440 px, at 0.5 s (warming up), 2 s, 6 s and 12 s, and over one second of frames.
const { chromium } = require("playwright");
const { PNG } = require("playwright-core/lib/utilsBundle");
const fs = require("node:fs");

const arg = (name, fallback) => {
  const at = process.argv.indexOf(`--${name}`);
  return at > -1 ? process.argv[at + 1] : fallback;
};
const A = arg("a");
const B = arg("b");
const OUT = arg("out");

const FREEZE = () => {
  let seed = 20261027;
  Math.random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  let now = 0;
  let next = 1;
  const queue = new Map();
  performance.now = () => now;
  window.requestAnimationFrame = (cb) => { queue.set(next, cb); return next++; };
  window.cancelAnimationFrame = (id) => { queue.delete(id); };
  window.__advance = (frames) => {
    for (let i = 0; i < frames; i += 1) {
      now += 1000 / 60;
      const due = [...queue.values()];
      queue.clear();
      for (const cb of due) cb(now);
    }
  };
};

// The hero's canvases put together: each at the row its style.top gives it (in canvas pixels).
const compose = () => {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const list = [...document.querySelectorAll(".cosmos-canvas")].filter((c) => c.style.display !== "none" && c.width && c.height);
  const rows = list.map((c) => ({ c, y0: Math.round((parseFloat(c.style.top) || 0) * dpr) }));
  const width = Math.max(...list.map((c) => c.width));
  const height = Math.max(...rows.map(({ c, y0 }) => y0 + c.height));
  const out = document.createElement("canvas");
  out.width = width;
  out.height = height;
  const o = out.getContext("2d");
  for (const { c, y0 } of rows) o.drawImage(c, 0, y0);
  return { png: out.toDataURL("image/png"), layers: rows.map(({ c, y0 }) => [y0, c.height]) };
};

const capture = async (browser, base, width, times) => {
  const context = await browser.newContext({ viewport: { width, height: width < 600 ? 844 : width < 1000 ? 1024 : 900 }, deviceScaleFactor: width < 1000 ? 2 : 1 });
  await context.route((url) => !/^http:\/\/127\.0\.0\.1/.test(url.href), (route) => route.abort());
  await context.addInitScript(FREEZE);
  const page = await context.newPage();
  await page.goto(`${base}/`, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  const shots = {};
  let at = 0;
  for (const t of times) {
    const frames = Math.round(t * 60) - at;
    await page.evaluate((n) => window.__advance(n), frames);
    at += frames;
    // In the page a layer is drawn while it is near the view; a resize draws all of them. The hero is narrowed by a
    // pixel and given its width back (both builds redraw on a resize), so every layer shows this very moment.
    await page.evaluate(() => { document.querySelector(".cosmos").style.width = "calc(100% - 1px)"; });
    await page.waitForTimeout(150);
    await page.evaluate(() => { document.querySelector(".cosmos").style.width = ""; });
    await page.waitForTimeout(150);
    shots[t] = await page.evaluate(compose);
  }
  await context.close();
  return shots;
};

const decode = (url) => PNG.sync.read(Buffer.from(url.split(",")[1], "base64"));

(async () => {
  const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const times = [0.5, 2, 6, 12, ...Array.from({ length: 10 }, (_, i) => +(12 + 0.1 * (i + 1)).toFixed(1))];
  const results = [];
  for (const width of [390, 768, 1440]) {
    const a = await capture(browser, A, width, times);
    const b = await capture(browser, B, width, times);
    for (const t of times) {
      const pa = decode(a[t].png);
      const pb = decode(b[t].png);
      // A canvas pixel is light that the page adds over what is behind it: its colour times its opacity (premultiplied),
      // rounded as the screen gets it. Read back unpremultiplied, a nearly transparent pixel (opacity 1/255 at the rim
      // of a glow) can read 0 or 255 in a channel for the same light, so the comparison is made on the premultiplied
      // values; the raw count is reported too.
      let differ = 0;
      let raw = 0;
      let max = 0;
      const same = pa.width === pb.width && pa.height === pb.height;
      if (same) {
        for (let i = 0; i < pa.data.length; i += 4) {
          const al = pa.data[i + 3];
          const bl = pb.data[i + 3];
          let d = Math.abs(al - bl);
          for (let k = 0; k < 3; k += 1) d = Math.max(d, Math.abs(Math.round(pa.data[i + k] * al / 255) - Math.round(pb.data[i + k] * bl / 255)));
          if (d) differ += 1;
          if (d > max) max = d;
          if (d || pa.data[i] !== pb.data[i] || pa.data[i + 1] !== pb.data[i + 1] || pa.data[i + 2] !== pb.data[i + 2]) raw += 1;
        }
      }
      const row = { width, t, size: `${pa.width}x${pa.height}`, sameSize: same, layersA: a[t].layers, layersB: b[t].layers, differPercent: same ? +(100 * differ / (pa.width * pa.height)).toFixed(4) : null, maxDelta: max, rawDifferPercent: same ? +(100 * raw / (pa.width * pa.height)).toFixed(4) : null };
      results.push(row);
      console.log(JSON.stringify(row));
    }
  }
  await browser.close();
  if (OUT) fs.writeFileSync(OUT, JSON.stringify({ date: new Date().toISOString(), a: A, b: B, results }, null, 1));
})();
