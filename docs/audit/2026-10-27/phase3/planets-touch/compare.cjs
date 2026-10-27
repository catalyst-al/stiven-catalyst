// Planets on a touch screen: the home hero of two (or more) builds drawn at the same frozen moment, on an emulated
// phone, and each planet, its name and the central light measured and put side by side.
//
//   node docs/audit/2026-10-27/phase3/planets-touch/compare.cjs --a http://127.0.0.1:8351 \
//        --b B=http://127.0.0.1:8352[,C=http://127.0.0.1:8353] --out docs/audit/2026-10-27/phase3/planets-touch \
//        [--viewports 390x844,412x915] [--dsf 2,3] [--themes dark,light] [--times 6.2,12] \
//        [--images 390x844@3:dark:6.2,390x844@3:dark:6.2/C,...] [--all-images <dir>] [--json compare.json]
//
// --images: the configurations whose pictures are written to --out (for the first side after A, or for the side
// named after a slash); --all-images: every picture of every side, to another folder (they are many).
//
// Time is frozen as in ../motion/frames.cjs: seeded Math.random, a virtual clock behind performance.now and
// requestAnimationFrame (60 frames a second), CSS animations paused at the same time; the page is scrolled to the
// planets (the anchor's top - 120 px) and stepped to each moment of --times. Every context is a phone: isMobile,
// hasTouch (so "(pointer: coarse)" matches, as on a real phone), the given viewport and deviceScaleFactor.
//
// Where things are: CanvasRenderingContext2D.arc and fillText are wrapped (they still draw) to note, for the last frame,
// the planets' names (fillText of PULSE, ZENITH, LUMEN, ATLAS) and the full circles drawn on the same row left of each
// name (the planet's body and halos share its centre). The planet's box is a square around that centre whose half-side
// is the distance from the centre to its name (the ring, the dust and the halo are inside); the name's box is the text.
// The central light is the bulb: the anchor's centre, a square of 2 x 1.1 bulb sizes (bulb = 0.16 x the system's
// scale, as in cosmos.js), which holds the glass, the filament and the inner glow. Boxes come from side A and are
// used unchanged for every side, so the same screen pixels are compared (the offset of B's own positions is reported).
//
// Measured on the screenshot's device pixels (what the phone's screen shows), on luminance Y = 0.2126 R + 0.7152 G +
// 0.0722 B (sRGB values 0-255):
//   lapVar     variance of the 4-neighbour Laplacian of Y (sharpness; a softer image has less)
//   tenengrad  mean squared Sobel gradient of Y (edge energy)
//   meanY, p99Y, maxY   brightness and the peak of the glow
//   hue, chroma         CIE L*C*h (D65) of the pixels with chroma > 8: chroma-weighted circular mean hue, mean chroma
//   differ, differ8, maxDelta   share of pixels that differ at all / by more than 8/255 in a channel, largest delta
//   dE         mean CIE76 colour difference per pixel; ssim  mean SSIM of Y over 8x8 windows (stride 4)
const { chromium } = require("playwright");
const { PNG, jpegjs } = require("playwright-core/lib/utilsBundle");
const fs = require("node:fs");
const path = require("node:path");

const arg = (name, fallback) => {
  const at = process.argv.indexOf(`--${name}`);
  return at > -1 ? process.argv[at + 1] : fallback;
};
const A = arg("a");
const SIDES = [["A", A], ...arg("b").split(",").map((s) => s.split("="))];
const OUT = arg("out", ".");
const VIEWPORTS = arg("viewports", "390x844,412x915").split(",").map((v) => v.split("x").map(Number));
const DSFS = arg("dsf", "2,3").split(",").map(Number);
const THEMES = arg("themes", "dark,light").split(",");
const TIMES = arg("times", "6.2,12").split(",").map(Number);
const IMAGES = new Set((arg("images", "") || "").split(",").filter(Boolean));
const ALL_IMAGES = arg("all-images");
const JSON_NAME = arg("json", "compare.json");
const NAMES = ["PULSE", "ZENITH", "LUMEN", "ATLAS"];

const FREEZE = () => {
  let seed = 20261027;
  Math.random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  let now = 0;
  let next = 1;
  const queue = new Map();
  performance.now = () => now;
  window.requestAnimationFrame = (cb) => { queue.set(next, cb); return next++; };
  window.cancelAnimationFrame = (id) => { queue.delete(id); };
  window.__marks = { arcs: [], labels: [] };
  window.__advance = (frames) => {
    for (let i = 0; i < frames; i += 1) {
      now += 1000 / 60;
      const due = [...queue.values()];
      queue.clear();
      if (due.length) window.__marks = { arcs: [], labels: [] };
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
  const proto = CanvasRenderingContext2D.prototype;
  const at = (ctx, x, y) => { const m = ctx.getTransform(); return [m.a * x + m.c * y + m.e, m.b * x + m.d * y + m.f]; };
  const arc = proto.arc;
  proto.arc = function (x, y, r, s, e, ccw) {
    if (Math.abs(e - s) >= 6.28) { const [px, py] = at(this, x, y); window.__marks.arcs.push({ canvas: this.canvas, x: px, y: py, r: r * Math.hypot(this.getTransform().a, this.getTransform().b) }); }
    return arc.call(this, x, y, r, s, e, ccw);
  };
  const fillText = proto.fillText;
  proto.fillText = function (text, x, y, ...rest) {
    if (/^(PULSE|ZENITH|LUMEN|ATLAS)$/.test(text)) {
      const [px, py] = at(this, x, y);
      const m = this.measureText(text);
      window.__marks.labels.push({ canvas: this.canvas, text, x: px, y: py, w: m.width, h: parseFloat(this.font.match(/([\d.]+)px/)[1]) });
    }
    return fillText.call(this, text, x, y, ...rest);
  };
  // Boxes in CSS px of the viewport, for the last frame drawn.
  window.__boxes = () => {
    const { arcs, labels } = window.__marks;
    const out = {};
    for (const l of labels) {
      const rect = l.canvas.getBoundingClientRect();
      const k = rect.width / l.canvas.width;
      const same = arcs.filter((a) => a.canvas === l.canvas && Math.abs(a.y - l.y) < 1e-6 && a.x < l.x);
      if (!same.length) continue;
      const count = new Map();
      for (const a of same) count.set(a.x, (count.get(a.x) || 0) + 1);
      const cxp = [...count.entries()].sort((p, q) => q[1] - p[1])[0][0];
      const body = Math.min(...same.filter((a) => a.x === cxp).map((a) => a.r));
      const cx = rect.left + cxp * k;
      const cy = rect.top + l.y * k;
      const half = (l.x - cxp) * k;
      const name = l.text[0] + l.text.slice(1).toLowerCase();
      out[name] = { x: cx - half, y: cy - half, w: 2 * half, h: 2 * half, cx, cy, body: body * k, dpr: 1 / k };
      out[`${name} name`] = { x: rect.left + l.x * k - 2, y: cy - l.h * k * 0.75, w: l.w * k + 4, h: l.h * k * 1.5 };
    }
    const anchor = document.querySelector("[data-cosmos-anchor]").getBoundingClientRect();
    const S0 = Math.min(anchor.width / 2 / (anchor.width < 560 ? 1.24 : 1.32), anchor.height / 2 / 0.66);
    const b = S0 * 0.16;
    const lx = anchor.left + anchor.width / 2;
    const ly = anchor.top + anchor.height / 2;
    out.Light = { x: lx - 1.1 * b, y: ly - 1.1 * b, w: 2.2 * b, h: 2.2 * b, cx: lx, cy: ly };
    return out;
  };
};

const capture = async (browser, base, [w, h], dsf, theme) => {
  const context = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dsf, isMobile: true, hasTouch: true, colorScheme: theme,
    userAgent: "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36" });
  await context.route((url) => !/^http:\/\/127\.0\.0\.1/.test(url.href), (route) => route.abort());
  await context.addInitScript(`try{localStorage.setItem("sc-theme",${JSON.stringify(theme)})}catch(e){}`);
  await context.addInitScript(FREEZE);
  const page = await context.newPage();
  await page.goto(base + "/", { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  await page.evaluate(() => window.scrollTo({ top: document.querySelector("[data-cosmos-anchor]").getBoundingClientRect().top + scrollY - 120, behavior: "instant" }));
  await page.waitForTimeout(250);
  const coarse = await page.evaluate(() => matchMedia("(pointer: coarse)").matches);
  const shots = {};
  let at = 0;
  for (const t of TIMES) {
    const frames = Math.round(t * 60) - at;
    if (frames > 0) await page.evaluate((n) => window.__advance(n), frames);
    at += Math.max(0, frames);
    await page.evaluate(() => window.__freezeCss(1000));
    await page.waitForTimeout(60);
    const boxes = await page.evaluate(() => window.__boxes());
    const png = await page.screenshot({ animations: "allow", caret: "hide" });
    shots[t] = { png: PNG.sync.read(png), boxes };
  }
  await context.close();
  return { coarse, shots };
};

// ---- Pixels ----
const Y = (d, o) => 0.2126 * d[o] + 0.7152 * d[o + 1] + 0.0722 * d[o + 2];
const crop = (img, box, dsf) => {
  const x0 = Math.max(0, Math.round(box.x * dsf));
  const y0 = Math.max(0, Math.round(box.y * dsf));
  const x1 = Math.min(img.width, Math.round((box.x + box.w) * dsf));
  const y1 = Math.min(img.height, Math.round((box.y + box.h) * dsf));
  const w = Math.max(0, x1 - x0);
  const h = Math.max(0, y1 - y0);
  const data = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y += 1) img.data.copy(data, y * w * 4, ((y0 + y) * img.width + x0) * 4, ((y0 + y) * img.width + x1) * 4);
  return { width: w, height: h, data };
};
const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const LIN = Float64Array.from({ length: 256 }, (_, i) => lin(i));
const lab = (r, g, b) => {
  const R = LIN[r], G = LIN[g], B = LIN[b];
  const f = (t) => (t > 216 / 24389 ? Math.cbrt(t) : (24389 / 27 * t + 16) / 116);
  const fx = f((0.4124 * R + 0.3576 * G + 0.1805 * B) / 0.95047);
  const fy = f(0.2126 * R + 0.7152 * G + 0.0722 * B);
  const fz = f((0.0193 * R + 0.1192 * G + 0.9505 * B) / 1.08883);
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
};
const metrics = (c) => {
  const { width: w, height: h, data: d } = c;
  const n = w * h;
  const y = new Float64Array(n);
  for (let i = 0; i < n; i += 1) y[i] = Y(d, i * 4);
  let lapS = 0, lapS2 = 0, lapN = 0, ten = 0;
  for (let j = 1; j < h - 1; j += 1) {
    for (let i = 1; i < w - 1; i += 1) {
      const k = j * w + i;
      const lap = y[k - 1] + y[k + 1] + y[k - w] + y[k + w] - 4 * y[k];
      lapS += lap; lapS2 += lap * lap; lapN += 1;
      const gx = (y[k - w + 1] + 2 * y[k + 1] + y[k + w + 1]) - (y[k - w - 1] + 2 * y[k - 1] + y[k + w - 1]);
      const gy = (y[k + w - 1] + 2 * y[k + w] + y[k + w + 1]) - (y[k - w - 1] + 2 * y[k - w] + y[k - w + 1]);
      ten += gx * gx + gy * gy;
    }
  }
  const sorted = Float64Array.from(y).sort();
  let mean = 0;
  for (const v of y) mean += v;
  let hs = 0, hc = 0, cw = 0, cn = 0;
  for (let i = 0; i < n; i += 1) {
    const [, a, b] = lab(d[i * 4], d[i * 4 + 1], d[i * 4 + 2]);
    const C = Math.hypot(a, b);
    if (C > 8) { const t = Math.atan2(b, a); hs += C * Math.sin(t); hc += C * Math.cos(t); cw += C; cn += 1; }
  }
  return {
    px: n,
    lapVar: +(lapS2 / lapN - (lapS / lapN) ** 2).toFixed(1),
    tenengrad: +(ten / lapN).toFixed(1),
    meanY: +(mean / n).toFixed(2),
    p99Y: +sorted[Math.floor(n * 0.99)].toFixed(1),
    maxY: +sorted[n - 1].toFixed(1),
    hue: cn ? +(((Math.atan2(hs, hc) * 180) / Math.PI + 360) % 360).toFixed(1) : null,
    chroma: cn ? +(cw / cn).toFixed(2) : null,
    colouredShare: +(100 * cn / n).toFixed(2),
  };
};
const compare = (a, b) => {
  const n = a.width * a.height;
  let any = 0, big = 0, max = 0, dE = 0;
  for (let i = 0; i < n; i += 1) {
    const o = i * 4;
    const dd = Math.max(Math.abs(a.data[o] - b.data[o]), Math.abs(a.data[o + 1] - b.data[o + 1]), Math.abs(a.data[o + 2] - b.data[o + 2]));
    if (dd > 0) any += 1;
    if (dd > 8) big += 1;
    if (dd > max) max = dd;
    if (dd > 0) { const p = lab(a.data[o], a.data[o + 1], a.data[o + 2]); const q = lab(b.data[o], b.data[o + 1], b.data[o + 2]); dE += Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]); }
  }
  // SSIM of Y, 8x8 windows, stride 4.
  const C1 = (0.01 * 255) ** 2, C2 = (0.03 * 255) ** 2;
  let ss = 0, sn = 0;
  for (let j = 0; j + 8 <= a.height; j += 4) {
    for (let i = 0; i + 8 <= a.width; i += 4) {
      let ma = 0, mb = 0, va = 0, vb = 0, cv = 0;
      for (let y = j; y < j + 8; y += 1) for (let x = i; x < i + 8; x += 1) { const o = (y * a.width + x) * 4; const p = Y(a.data, o), q = Y(b.data, o); ma += p; mb += q; va += p * p; vb += q * q; cv += p * q; }
      ma /= 64; mb /= 64; va = va / 64 - ma * ma; vb = vb / 64 - mb * mb; cv = cv / 64 - ma * mb;
      ss += ((2 * ma * mb + C1) * (2 * cv + C2)) / ((ma * ma + mb * mb + C1) * (va + vb + C2)); sn += 1;
    }
  }
  return { differ: +(100 * any / n).toFixed(2), differ8: +(100 * big / n).toFixed(2), maxDelta: max, dE: +(dE / n).toFixed(3), ssim: sn ? +(ss / sn).toFixed(4) : null };
};

// ---- Pictures ----
const canvasOf = (w, h, bg) => { const p = new PNG({ width: w, height: h }); for (let i = 0; i < w * h; i += 1) { p.data[i * 4] = bg[0]; p.data[i * 4 + 1] = bg[1]; p.data[i * 4 + 2] = bg[2]; p.data[i * 4 + 3] = 255; } return p; };
const blit = (dst, src, x0, y0, zoom = 1) => {
  for (let y = 0; y < src.height * zoom; y += 1) for (let x = 0; x < src.width * zoom; x += 1) {
    const s = (Math.floor(y / zoom) * src.width + Math.floor(x / zoom)) * 4;
    const t = ((y0 + y) * dst.width + x0 + x) * 4;
    if (x0 + x >= dst.width || y0 + y >= dst.height) continue;
    dst.data[t] = src.data[s]; dst.data[t + 1] = src.data[s + 1]; dst.data[t + 2] = src.data[s + 2]; dst.data[t + 3] = 255;
  }
};
// Downscale by an integer factor (box filter), for the hero overview.
const shrink = (img, f) => {
  const w = Math.floor(img.width / f), h = Math.floor(img.height / f);
  const out = { width: w, height: h, data: Buffer.alloc(w * h * 4) };
  for (let y = 0; y < h; y += 1) for (let x = 0; x < w; x += 1) {
    const acc = [0, 0, 0];
    for (let yy = 0; yy < f; yy += 1) for (let xx = 0; xx < f; xx += 1) { const o = ((y * f + yy) * img.width + x * f + xx) * 4; acc[0] += img.data[o]; acc[1] += img.data[o + 1]; acc[2] += img.data[o + 2]; }
    const t = (y * w + x) * 4;
    out.data[t] = acc[0] / f / f; out.data[t + 1] = acc[1] / f / f; out.data[t + 2] = acc[2] / f / f; out.data[t + 3] = 255;
  }
  return out;
};
// JPEG (jpeg-js writes 4:4:4, no chroma subsampling) to keep each file under 200 KB; the metrics use the PNG pixels.
const writeImg = (img, file, quality = 90) => {
  if (file.endsWith(".jpg")) fs.writeFileSync(file, jpegjs.encode({ data: img.data, width: img.width, height: img.height }, quality).data);
  else fs.writeFileSync(file, PNG.sync.write(img, { colorType: 2 }));
};
// One row per object: A | B at 100 % (one picture pixel = one screen pixel), then A | B at the zoom (nearest
// neighbour), on a grey ground; 6 px gaps.
const sheet = (rows, zoom) => {
  const gap = 6;
  const W = Math.max(...rows.map((r) => r.a.width)) ;
  const H = (r) => r.a.height * zoom;
  const width = gap + (W + gap) * 2 + (W * zoom + gap) * 2;
  const height = gap + rows.reduce((s, r) => s + H(r) + gap, 0);
  const out = canvasOf(width, height, [128, 128, 128]);
  let y = gap;
  for (const r of rows) {
    blit(out, r.a, gap, y);
    blit(out, r.b, gap + W + gap, y);
    blit(out, r.a, gap + (W + gap) * 2, y, zoom);
    blit(out, r.b, gap + (W + gap) * 2 + W * zoom + gap, y, zoom);
    y += H(r) + gap;
  }
  return out;
};

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  if (ALL_IMAGES) fs.mkdirSync(ALL_IMAGES, { recursive: true });
  const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const results = [];
  for (const vp of VIEWPORTS) for (const dsf of DSFS) for (const theme of THEMES) {
    const caps = {};
    for (const [side, base] of SIDES) caps[side] = await capture(browser, base, vp, dsf, theme);
    for (const t of TIMES) {
      const ref = caps.A.shots[t];
      const config = `${vp[0]}x${vp[1]}@${dsf}:${theme}:${t}`;
      const objects = ["Pulse", "Zenith", "Lumen", "Atlas", "Light", "Pulse name", "Zenith name", "Lumen name", "Atlas name"].filter((o) => ref.boxes[o]);
      const rows = {};
      for (const o of objects) {
        const box = ref.boxes[o];
        const row = { config, viewport: `${vp[0]}x${vp[1]}`, dsf, theme, t, object: o, box: Object.fromEntries(Object.entries(box).map(([k, v]) => [k, +v.toFixed(2)])) };
        const ca = crop(ref.png, box, dsf);
        row.A = metrics(ca);
        for (const [side] of SIDES.slice(1)) {
          const own = caps[side].shots[t];
          const cb = crop(own.png, box, dsf);
          const ob = own.boxes[o];
          row[side] = { ...metrics(cb), canvasDpr: ob?.dpr ? +ob.dpr.toFixed(3) : undefined, offset: ob ? +Math.hypot((ob.cx ?? ob.x) - (box.cx ?? box.x), (ob.cy ?? ob.y) - (box.cy ?? box.y)).toFixed(2) : null, vsA: compare(ca, cb) };
          (rows[side] ||= []).push({ a: ca, b: cb, object: o });
        }
        if (box.dpr) row.A.canvasDpr = +box.dpr.toFixed(3);
        results.push(row);
        console.log(JSON.stringify({ config, object: o, A: row.A.lapVar, ...Object.fromEntries(SIDES.slice(1).map(([s]) => [s, row[s].lapVar])) }));
      }
      // Whole viewport, the planets in view: A | B (| C ...), downscaled to CSS px.
      const full = compare(ref.png, caps[SIDES[1][0]].shots[t].png);
      results.push({ config, viewport: `${vp[0]}x${vp[1]}`, dsf, theme, t, object: "viewport", coarse: Object.fromEntries(SIDES.map(([s]) => [s, caps[s].coarse])), [`${SIDES[1][0]}vsA`]: full });
      const tag = `${vp[0]}x${vp[1]}-dpr${dsf}-${theme}-${String(t).replace(".", "_")}s`;
      for (const [side] of SIDES.slice(1)) {
        const want = IMAGES.has(`${config}/${side}`) || (side === SIDES[1][0] && IMAGES.has(config));
        const planets = rows[side].filter((r) => !r.object.endsWith("name"));
        const names = rows[side].filter((r) => r.object.endsWith("name"));
        const files = [];
        if (want) files.push([OUT, ""]);
        if (ALL_IMAGES) files.push([ALL_IMAGES, ""]);
        for (const [dir] of files) {
          writeImg(sheet(planets, 2), path.join(dir, `crops-${tag}-A-${side}.jpg`), 86);
          writeImg(sheet(names, 2), path.join(dir, `names-${tag}-A-${side}.jpg`), 92);
          const sa = shrink(ref.png, dsf);
          const sb = shrink(caps[side].shots[t].png, dsf);
          const hero = canvasOf(sa.width * 2 + 10, sa.height, [128, 128, 128]);
          blit(hero, sa, 0, 0);
          blit(hero, sb, sa.width + 10, 0);
          writeImg(hero, path.join(dir, `hero-${tag}-A-${side}.jpg`), 85);
        }
      }
    }
  }
  await browser.close();
  fs.writeFileSync(path.join(OUT, JSON_NAME), JSON.stringify({ date: new Date().toISOString(), sides: Object.fromEntries(SIDES), times: TIMES, results }).replace(/\},\{"config"/g, "},\n{\"config\""));
})();
