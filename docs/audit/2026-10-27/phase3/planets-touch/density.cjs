// Planets on a touch screen: at what density the planets' canvas is really drawn, over time, on the phone4x profile
// of ../motion/perf.cjs (390x844, deviceScaleFactor 2, touch, mobile, CPU throttle 4), real clock (nothing frozen).
// cosmos.js lowers its quality by itself when frames are slow (quality 1 -> 0.75 -> 0.5 after 40 of 60 frames over
// 34 ms), so the density a build starts with is not the one it keeps; this records it every 250 ms for --ms (9 s).
//
//   node docs/audit/2026-10-27/phase3/planets-touch/density.cjs --sides A=http://127.0.0.1:8351,B=http://127.0.0.1:8352 \
//        [--runs 3] [--rate 4] [--dsf 2] [--ms 9000] [--out density.json]
//
// Density = canvas.width / its CSS width = min(devicePixelRatio, cap) x quality; quality < 1 also means fewer particles.
const { chromium } = require("playwright");
const fs = require("node:fs");

const arg = (name, fallback) => {
  const at = process.argv.indexOf(`--${name}`);
  return at > -1 ? process.argv[at + 1] : fallback;
};
const SIDES = arg("sides").split(",").map((s) => s.split("="));
const RUNS = Number(arg("runs", 3));
const RATE = Number(arg("rate", 4));
const DSF = Number(arg("dsf", 2));
const OUT = arg("out");
const MS = Number(arg("ms", 9000));

const probe = async (browser, base) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: DSF, isMobile: true, hasTouch: true, colorScheme: "dark",
    userAgent: "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36" });
  await context.route((url) => !/^http:\/\/127\.0\.0\.1/.test(url.href), (route) => route.abort());
  await context.addInitScript(() => {
    window.__density = [];
    const t0 = performance.now();
    const tick = () => {
      // Every hero canvas has the same density; take the first one that is shown.
      const c = [...document.querySelectorAll("canvas.cosmos-canvas")].find((x) => x.style.display !== "none" && x.width);
      if (c) window.__density.push([Math.round(performance.now() - t0), +(c.width / c.getBoundingClientRect().width).toFixed(3)]);
      setTimeout(tick, 250);
    };
    addEventListener("load", tick);
  });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  if (RATE > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: RATE });
  await page.goto(base + "/", { waitUntil: "load" });
  await page.waitForTimeout(MS);
  const series = await page.evaluate(() => window.__density);
  await context.close();
  // Compress: the moments the density changed.
  const steps = series.filter((p, i) => i === 0 || p[1] !== series[i - 1][1]);
  const at = (ms) => series.find((p) => p[0] >= ms)?.[1] ?? null;
  return { steps, at3s: at(3000), at8s: at(8000), at15s: at(15000), at20s: at(20000) };
};

(async () => {
  const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const raw = {};
  for (let run = 0; run < RUNS; run += 1) {
    const order = run % 2 ? [...SIDES].reverse() : SIDES;
    for (const [side, base] of order) {
      const r = await probe(browser, base);
      (raw[side] ||= []).push(r);
      console.error(`run ${run + 1} ${side}: ${JSON.stringify(r)}`);
    }
  }
  await browser.close();
  const result = { date: new Date().toISOString(), rate: RATE, dsf: DSF, ms: MS, sides: Object.fromEntries(SIDES), load: require("node:os").loadavg(), raw };
  if (OUT) fs.writeFileSync(OUT, JSON.stringify(result, null, 1));
})();
