// Phase 3, motion: an animated detail of a page, as frames, in two builds: Zenith's radar and the podcast's step
// numbers before and after the duplicate @keyframes were renamed (audit PM-4), and the family badge of a tool before
// and after its glow moved off the beating dot (audit PM-8).
//   node docs/audit/2026-10-27/phase3/motion/radar-frames.cjs --a http://127.0.0.1:8321 --b http://127.0.0.1:8322 --out dir [--only tool-badge]
// For each subject the CSS animations are paused and set to the same moments (0 to 5 s, a second apart), and the
// element is photographed; a JPEG per subject holds the frames of a (top row) and b (bottom row). The keyframes each
// build actually applies to the subject are written to radar-frames.json.
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
const OUT = arg("out", ".");
const TIMES = [0, 1, 2, 3, 4, 5];
const SUBJECTS = [
  { name: "tool-sky-radar", path: "/tools/cx-control-tower/", selector: ".sky-zenith .zenith-radar", box: ".sky-zenith .zenith-radar" },
  { name: "planet-card-radar", path: "/tools.html", selector: ".planet-zenith .zenith-radar", box: "svg.planet-zenith" },
  { name: "podcast-steps", path: "/podcast.html", selector: ".podcast-steps li b", box: ".podcast-steps" },
  { name: "tool-badge", path: "/tools/cx-control-tower/", selector: ".family-badge > span", box: ".family-badge", pad: 24, scale: 3 },
].filter((s) => !arg("only") || arg("only").split(",").includes(s.name));

const shoot = async (browser, base, subject) => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: subject.scale || 1 });
  await context.route((url) => !/^http:\/\/127\.0\.0\.1/.test(url.href), (route) => route.abort());
  const page = await context.newPage();
  await page.goto(base + subject.path, { waitUntil: "load" });
  const box = page.locator(subject.box).first();
  await box.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  const keyframes = await page.evaluate((sel) => document.querySelector(sel)?.getAnimations().map((a) => ({ name: a.animationName, keyframes: a.effect.getKeyframes().map((k) => Object.fromEntries(Object.entries(k).filter(([p]) => !["easing", "composite", "computedOffset"].includes(p)))) })), subject.selector);
  const frames = [];
  for (const t of TIMES) {
    await page.evaluate(({ sel, ms }) => {
      for (const a of document.getAnimations()) if (a.effect?.target?.closest?.(sel) || a.effect?.target?.matches?.(sel)) { try { a.pause(); a.currentTime = ms; } catch { /* a scroll-driven one: as scrolled */ } }
    }, { sel: subject.box, ms: t * 1000 });
    await page.waitForTimeout(80);
    const pad = subject.pad || 0;
    const r = await box.boundingBox();
    frames.push(PNG.sync.read(pad ? await page.screenshot({ animations: "allow", clip: { x: r.x - pad, y: r.y - pad, width: r.width + 2 * pad, height: r.height + 2 * pad } }) : await box.screenshot({ animations: "allow" })));
  }
  await context.close();
  return { keyframes, frames };
};

const strip = (rows, file) => {
  const fw = rows[0][0].width;
  const fh = rows[0][0].height;
  const scale = Math.max(1, Math.ceil((fw * TIMES.length) / (Number(arg("max-width")) || 1500)));
  const w = Math.floor(fw / scale);
  const h = Math.floor(fh / scale);
  const out = { width: (w + 6) * TIMES.length, height: (h + 6) * rows.length, data: Buffer.alloc((w + 6) * TIMES.length * (h + 6) * rows.length * 4, 255) };
  rows.forEach((frames, r) => frames.forEach((img, c) => {
    for (let y = 0; y < h; y += 1) for (let x = 0; x < w; x += 1) {
      const i = ((y * scale) * img.width + x * scale) * 4;
      const o = (((r * (h + 6)) + y) * out.width + c * (w + 6) + x) * 4;
      out.data[o] = img.data[i]; out.data[o + 1] = img.data[i + 1]; out.data[o + 2] = img.data[i + 2]; out.data[o + 3] = 255;
    }
  }));
  fs.writeFileSync(file, jpegjs.encode(out, 85).data);
};

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const report = {};
  for (const subject of SUBJECTS) {
    const a = await shoot(browser, A, subject);
    const b = await shoot(browser, B, subject);
    // Share of pixels that differ between a and b at each moment (any channel), and the largest difference.
    const diffs = a.frames.map((fa, i) => {
      const fb = b.frames[i];
      if (fa.width !== fb.width || fa.height !== fb.height) return { sizeMismatch: true };
      let n = 0;
      let max = 0;
      for (let k = 0; k < fa.data.length; k += 4) {
        const d = Math.max(Math.abs(fa.data[k] - fb.data[k]), Math.abs(fa.data[k + 1] - fb.data[k + 1]), Math.abs(fa.data[k + 2] - fb.data[k + 2]));
        if (d) n += 1;
        if (d > max) max = d;
      }
      return { t: TIMES[i], differPercent: +(100 * n / (fa.width * fa.height)).toFixed(2), maxDelta: max };
    });
    report[subject.name] = { a: a.keyframes, b: b.keyframes, diffs };
    strip([a.frames, b.frames], path.join(OUT, `${subject.name}.jpg`));
  }
  await browser.close();
  fs.writeFileSync(path.join(OUT, "radar-frames.json"), JSON.stringify({ date: new Date().toISOString(), a: A, b: B, times: TIMES, report }, null, 1));
  console.log(JSON.stringify(report, null, 1).slice(0, 3000));
})();
