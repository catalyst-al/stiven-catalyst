// Phase 3, motion: the home hero drawn at the same moments by two builds, compared pixel by pixel.
//
//   node docs/audit/2026-10-27/phase3/motion/frames.cjs --a http://127.0.0.1:8321 --b http://127.0.0.1:8322 \
//        --out docs/audit/2026-10-27/phase3/motion/frames [--path /] [--keep 3]
//
// Time is frozen so that both builds draw exactly the same frame: before any script runs, Math.random is replaced by
// a seeded generator (the particles, the stars and the reader's moods come out the same), performance.now and
// requestAnimationFrame by a virtual clock that advances only when the script says so (60 frames a second, 16.67 ms
// each), and every CSS animation is paused at the same current time before a screenshot. The page is then stepped
// to a few moments of the hero's life (0.5 s: the light warming up; 2 s; 6 s; 12 s), at the top of the page and
// scrolled to the planets, at 390, 768 and 1440 px, in both themes; and a sequence of 10 frames 0.1 s apart (one
// second of motion) at 390 and 1440 px, dark theme. For each pair of screenshots it reports the share of pixels that
// differ at all (any channel), that differ by more than 8/255, and the largest difference. A few side-by-side PNGs
// (a | b | the differing pixels in red) are written, downscaled, for the pairs that differ most (--keep).
const { chromium } = require("playwright");
const { PNG, jpegjs } = require("playwright-core/lib/utilsBundle");
const fs = require("node:fs");
const path = require("node:path");

const arg = (name, fallback) => {
  const at = process.argv.indexOf(`--${name}`);
  return at > -1 ? process.argv[at + 1] : fallback;
};
const A = arg("a");
const B = arg("b");
const OUT = arg("out", "frames");
const PATH = arg("path", "/");
const KEEP = Number(arg("keep", 3));
const WIDTHS = (arg("widths", "390,768,1440")).split(",").map(Number);
const THEMES = (arg("themes", "dark,light")).split(",");
// For a diagnosis: side b gets this file in place of its js/cosmos.js (one change at a time).
const B_COSMOS = arg("b-cosmos");
// --touch: the phone and tablet widths as touch screens (pointer: coarse), as on a real phone.
const TOUCH = Boolean(arg("touch"));
// --crop 100,520: the side-by-side pictures show only these rows of the screen (CSS px), at full size if they fit.
const CROP = arg("crop")?.split(",").map(Number);
// --jpeg: the side-by-side pictures as JPEG (quality 85), to keep the files small.
const JPEG = Boolean(arg("jpeg"));

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
      for (const cb of due) { try { cb(now); } catch (e) { console.error(e); } }
    }
    return now;
  };
  window.__freezeCss = (ms) => {
    for (const a of document.getAnimations()) {
      if (a.timeline !== document.timeline) continue;
      try { a.pause(); a.currentTime = ms; } catch { /* finished one-shot */ }
    }
  };
};

const shoot = async (page) => page.screenshot({ animations: "allow", caret: "hide" });

const capture = async (browser, base, width, theme, plan) => {
  const context = await browser.newContext({ viewport: { width, height: width < 600 ? 844 : width < 1000 ? 1024 : 900 }, deviceScaleFactor: width < 1000 ? 2 : 1, colorScheme: theme, ...(TOUCH && width < 1000 ? { isMobile: true, hasTouch: true } : {}) });
  await context.route((url) => !/^http:\/\/127\.0\.0\.1/.test(url.href), (route) => route.abort());
  await context.addInitScript(`try{localStorage.setItem("sc-theme",${JSON.stringify(theme)})}catch(e){}`);
  await context.addInitScript(FREEZE);
  if (B_COSMOS && base === B) await context.route(/\/js\/cosmos\.js/, (route) => route.fulfill({ contentType: "text/javascript", body: fs.readFileSync(B_COSMOS, "utf8") }));
  const page = await context.newPage();
  await page.goto(base + PATH, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  const shots = {};
  let at = 0;
  for (const step of plan) {
    if (step.scroll !== undefined) {
      await page.evaluate((where) => {
        const y = where === "system" ? document.querySelector("[data-cosmos-anchor]").getBoundingClientRect().top + scrollY - 120 : 0;
        window.scrollTo({ top: y, behavior: "instant" });
      }, step.scroll);
      await page.waitForTimeout(250);
    }
    const frames = Math.round(step.t * 60) - at;
    if (frames > 0) await page.evaluate((n) => window.__advance(n), frames);
    at += Math.max(0, frames);
    await page.evaluate(() => window.__freezeCss(1000));
    await page.waitForTimeout(60);
    shots[step.name] = await shoot(page);
  }
  await context.close();
  return shots;
};

const diff = (bufA, bufB) => {
  const a = PNG.sync.read(bufA);
  const b = PNG.sync.read(bufB);
  if (a.width !== b.width || a.height !== b.height) return { sizeMismatch: true };
  let any = 0;
  let big = 0;
  let max = 0;
  const mask = new Uint8Array(a.width * a.height);
  for (let i = 0; i < a.width * a.height; i += 1) {
    const o = i * 4;
    const d = Math.max(Math.abs(a.data[o] - b.data[o]), Math.abs(a.data[o + 1] - b.data[o + 1]), Math.abs(a.data[o + 2] - b.data[o + 2]));
    if (d > 0) { any += 1; mask[i] = 1; }
    if (d > 8) { big += 1; mask[i] = 2; }
    if (d > max) max = d;
  }
  const n = a.width * a.height;
  return { width: a.width, height: a.height, differ: +(100 * any / n).toFixed(3), differOver8: +(100 * big / n).toFixed(3), maxDelta: max, a, b, mask };
};

// a | b | mask, downscaled by an integer factor to at most 1200 px wide (or 1600 px with --crop).
const sideBySide = (d, file, dpr) => {
  const top = CROP ? Math.round(CROP[0] * dpr) : 0;
  const rows = CROP ? Math.min(d.height - top, Math.round((CROP[1] - CROP[0]) * dpr)) : d.height;
  const scale = Math.max(1, Math.ceil((d.width * 3 + 20) / (CROP ? 1600 : 1200)));
  const w = Math.floor(d.width / scale);
  const h = Math.floor(rows / scale);
  const out = new PNG({ width: w * 3 + 20, height: h });
  out.data.fill(255);
  const put = (x, y, r, g, b) => { const o = (y * out.width + x) * 4; out.data[o] = r; out.data[o + 1] = g; out.data[o + 2] = b; out.data[o + 3] = 255; };
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const sx = x * scale;
      const sy = top + y * scale;
      const o = (sy * d.width + sx) * 4;
      put(x, y, d.a.data[o], d.a.data[o + 1], d.a.data[o + 2]);
      put(x + w + 10, y, d.b.data[o], d.b.data[o + 1], d.b.data[o + 2]);
      let m = 0;
      for (let yy = 0; yy < scale; yy += 1) for (let xx = 0; xx < scale; xx += 1) m = Math.max(m, d.mask[(sy + yy) * d.width + sx + xx] || 0);
      const grey = Math.round((d.a.data[o] + d.a.data[o + 1] + d.a.data[o + 2]) / 9);
      if (m === 2) put(x + 2 * w + 20, y, 255, 0, 0);
      else if (m === 1) put(x + 2 * w + 20, y, 255, 170, 0);
      else put(x + 2 * w + 20, y, grey, grey, grey);
    }
  }
  if (JPEG) fs.writeFileSync(file.replace(/\.png$/, ".jpg"), jpegjs.encode({ data: out.data, width: out.width, height: out.height }, 85).data);
  else fs.writeFileSync(file, PNG.sync.write(out, { colorType: 2 }));
};

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const results = [];
  const keep = [];
  for (const width of WIDTHS) {
    for (const theme of THEMES) {
      const plan = [
        { name: "top-0.5s", t: 0.5, scroll: "top" },
        { name: "top-2s", t: 2 },
        { name: "top-6s", t: 6 },
        { name: "planets-6.2s", t: 6.2, scroll: "system" },
        { name: "planets-12s", t: 12 },
      ];
      if (theme === "dark" && width !== 768) for (let i = 0; i < 10; i += 1) plan.push({ name: `seq-${String(i).padStart(2, "0")}`, t: 12 + 0.1 * (i + 1) });
      const shotsA = await capture(browser, A, width, theme, plan);
      const shotsB = await capture(browser, B, width, theme, plan);
      for (const { name } of plan) {
        const d = diff(shotsA[name], shotsB[name]);
        const row = { width, theme, frame: name, differ: d.differ, differOver8: d.differOver8, maxDelta: d.maxDelta, sizeMismatch: d.sizeMismatch || false };
        results.push(row);
        console.log(JSON.stringify(row));
        if (!d.sizeMismatch) keep.push({ row, d });
        keep.sort((x, y) => y.row.differ - x.row.differ);
        keep.splice(KEEP);
      }
    }
  }
  await browser.close();
  for (const { row, d } of keep) if (row.differ > 0) sideBySide(d, path.join(OUT, `diff-${row.width}-${row.theme}-${row.frame}.png`), row.width < 1000 ? 2 : 1);
  const summary = { date: new Date().toISOString(), a: A, b: B, path: PATH, results };
  fs.writeFileSync(path.join(OUT, "frames.json"), JSON.stringify(summary, null, 1));
})();
