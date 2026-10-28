// Phase 3, motion: the cost of a page's motion on the main thread, measured the same way before and after a change.
//
//   node docs/audit/2026-10-27/phase3/motion/perf.cjs --a http://127.0.0.1:8321 --b http://127.0.0.1:8322 \
//        [--path /] [--runs 5] [--profiles desktop,desktop4x,phone4x] [--tap .cosmos-chip] [--out file.json] [--settle 3000]
//
// --a and --b are two servers of the built site (node tests/browser/server.mjs <port>, one started in a folder that
// holds the old _site). The runs are interleaved (a, b, b, a, ...) so both builds see the same load on the machine.
// Each run is a fresh browser context: the page is opened, left 3 s to settle (the hero's warm-up is 1.3 s), then for
// 5 s the script records
//   busy     main-thread task time (CDP Performance.getMetrics TaskDuration, delta over the 5 s), in seconds
//   fps      frames in which the page ran animation-frame callbacks, per second (a wrapper on requestAnimationFrame
//            counts distinct frame timestamps; a page that draws nothing scores 0)
//   p95      the 95th percentile of the time between those frames, ms
//   long     long tasks (PerformanceObserver 'longtask') and their blocking time (sum of duration - 50 ms)
// and then taps the --tap element once (touch on the phone, a click on the desktop) and reads the Event Timing API:
//   delay    first-input processingStart - startTime, ms (how long the tap waited for the main thread)
//   tap      the longest event duration of that interaction (pointerdown/pointerup/click), ms
// Profiles: desktop = 1440x900 DPR 1 unthrottled; desktop4x = the same at CPU throttle 4 (CDP
// Emulation.setCPUThrottlingRate); phone4x = 390x844 DPR 2, touch, mobile, CPU throttle 4; phone2x the same at 2. The medians of each
// profile are printed and written to --out.
const { chromium } = require("playwright");
const fs = require("node:fs");

const arg = (name, fallback) => {
  const at = process.argv.indexOf(`--${name}`);
  return at > -1 ? process.argv[at + 1] : fallback;
};
const A = arg("a");
const B = arg("b");
const PATH = arg("path", "/");
const RUNS = Number(arg("runs", 5));
const TAP = arg("tap", ".cosmos-chip");
const OUT = arg("out");
const PROFILES = arg("profiles", "desktop,desktop4x,phone4x").split(",");
const EXTRA = arg("init", ""); // optional script run before the page's own (e.g. to pause the motion)
const WINDOW = 5000;
// --settle: ms the page is left before the 5 s window (default 3000, as in the phase 3 measurements); a longer one
// measures a page after its own adaptive steps have settled (planets-touch review).
const SETTLE = Number(arg("settle", 3000));

const PROFILE = {
  desktop: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, rate: 1 },
  desktop4x: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, rate: 4 },
  phone4x: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, rate: 4,
    userAgent: "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36" },
};
// phone2x: the same phone at CPU throttle 2, a middle-range phone (planets-touch review).
PROFILE.phone2x = { ...PROFILE.phone4x, rate: 2 };

const INIT = () => {
  const stamps = [];
  const native = window.requestAnimationFrame.bind(window);
  let lastStamp = -1;
  window.requestAnimationFrame = (cb) => native((t) => {
    if (t !== lastStamp) { lastStamp = t; if (window.__rec) stamps.push(t); }
    cb(t);
  });
  const long = [];
  try { new PerformanceObserver((list) => { if (window.__rec) long.push(...list.getEntries().map((e) => e.duration)); }).observe({ type: "longtask", buffered: false }); } catch {}
  const events = [];
  try { new PerformanceObserver((list) => events.push(...list.getEntries().map((e) => ({ name: e.name, type: e.entryType, start: e.startTime, ps: e.processingStart, dur: e.duration, id: e.interactionId })))).observe({ type: "event", durationThreshold: 16, buffered: true }); } catch {}
  try { new PerformanceObserver((list) => events.push(...list.getEntries().map((e) => ({ name: e.name, type: e.entryType, start: e.startTime, ps: e.processingStart, dur: e.duration })))).observe({ type: "first-input", buffered: true }); } catch {}
  window.__perf = { stamps, long, events };
};

const median = (list) => {
  const s = list.filter((v) => Number.isFinite(v)).sort((x, y) => x - y);
  if (!s.length) return null;
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

const measure = async (browser, base, profileName) => {
  const p = PROFILE[profileName];
  const context = await browser.newContext({ viewport: p.viewport, deviceScaleFactor: p.deviceScaleFactor, isMobile: p.isMobile, hasTouch: p.hasTouch, userAgent: p.userAgent, colorScheme: "dark" });
  await context.route((url) => !/^http:\/\/127\.0\.0\.1/.test(url.href), (route) => route.abort());
  if (EXTRA) await context.addInitScript(EXTRA);
  await context.addInitScript(INIT);
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send("Performance.enable");
  if (p.rate > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: p.rate });
  await page.goto(base + PATH, { waitUntil: "load" });
  await page.waitForTimeout(SETTLE);
  const task = async () => (await cdp.send("Performance.getMetrics")).metrics.find((m) => m.name === "TaskDuration").value;
  const t0 = await task();
  await page.evaluate(() => { window.__rec = true; });
  await page.waitForTimeout(WINDOW);
  await page.evaluate(() => { window.__rec = false; });
  const t1 = await task();
  const rec = await page.evaluate(() => ({ stamps: window.__perf.stamps.slice(), long: window.__perf.long.slice() }));
  // The tap.
  let delay = null;
  let tap = null;
  const target = page.locator(TAP).first();
  if (await target.count()) {
    await target.scrollIntoViewIfNeeded().catch(() => {});
    if (p.hasTouch) await target.tap({ force: true }); else await target.click({ force: true });
    await page.waitForTimeout(1500);
    const events = await page.evaluate(() => window.__perf.events.slice());
    const first = events.find((e) => e.type === "first-input");
    delay = first ? first.ps - first.start : null;
    const durs = events.filter((e) => e.type === "event" && /pointer|click|touch|mouse/.test(e.name)).map((e) => e.dur);
    tap = durs.length ? Math.max(...durs) : first ? first.dur : null;
  }
  await context.close();
  const gaps = rec.stamps.slice(1).map((t, i) => t - rec.stamps[i]).sort((x, y) => x - y);
  return {
    busy: +(t1 - t0).toFixed(3),
    fps: +(rec.stamps.length / (WINDOW / 1000)).toFixed(1),
    p95: gaps.length ? +gaps[Math.floor(gaps.length * 0.95)].toFixed(1) : null,
    longTasks: rec.long.length,
    blocking: Math.round(rec.long.reduce((s, d) => s + Math.max(0, d - 50), 0)),
    delay: delay === null ? null : Math.round(delay),
    tap: tap === null ? null : Math.round(tap),
  };
};

(async () => {
  const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const sides = B ? [["a", A], ["b", B]] : [["a", A]];
  const raw = {};
  for (let run = 0; run < RUNS; run += 1) {
    for (const profile of PROFILES) {
      const order = run % 2 ? [...sides].reverse() : sides;
      for (const [side, base] of order) {
        const r = await measure(browser, base, profile);
        ((raw[profile] ||= {})[side] ||= []).push(r);
        console.error(`run ${run + 1} ${profile} ${side}: ${JSON.stringify(r)}`);
      }
    }
  }
  await browser.close();
  const keys = ["busy", "fps", "p95", "longTasks", "blocking", "delay", "tap"];
  const summary = {};
  for (const [profile, bySide] of Object.entries(raw)) {
    for (const [side, list] of Object.entries(bySide)) {
      (summary[profile] ||= {})[side] = Object.fromEntries(keys.map((k) => [k, median(list.map((r) => r[k]))]));
    }
  }
  const result = { date: new Date().toISOString(), path: PATH, runs: RUNS, a: A, b: B || null, tap: TAP, windowMs: WINDOW, settleMs: SETTLE, init: EXTRA || null,
    machine: { cpus: require("node:os").cpus().length, model: require("node:os").cpus()[0]?.model, load: require("node:os").loadavg() }, summary, raw };
  if (OUT) fs.writeFileSync(OUT, JSON.stringify(result, null, 1));
  console.log(JSON.stringify({ path: PATH, summary }, null, 1));
})();
