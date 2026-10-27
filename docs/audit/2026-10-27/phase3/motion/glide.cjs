// Phase 3, motion: how long one turn of the mouse wheel (a 300 px notch) takes to move the page, before and after.
//   node docs/audit/2026-10-27/phase3/motion/glide.cjs --a http://127.0.0.1:8321 --b http://127.0.0.1:8322 [--runs 5]
// Desktop 1440x900, fine pointer, motion allowed; CPU throttle 1 and 4 (CDP). The page is left 2 s to settle at the
// top; then one wheel event of deltaY 300 is sent (page.mouse.wheel, a real input event) and the time is measured
// until window.scrollY has covered 90 % of the notch, and until it stops (no change for 150 ms). Also recorded:
// whether the page cancelled the wheel event (preventDefault: the page scrolls it itself). Median of the runs.
// Headless Chromium has no smooth wheel scrolling of its own, so a native notch lands at once; a real Chrome animates
// it over about 100-200 ms on the compositor.
const { chromium } = require("playwright");

const arg = (name, fallback) => {
  const at = process.argv.indexOf(`--${name}`);
  return at > -1 ? process.argv[at + 1] : fallback;
};
const SIDES = [["a", arg("a")], ["b", arg("b")]].filter(([, url]) => url);
const RUNS = Number(arg("runs", 5));
const PAGES = ["/", "/field-notes.html"];

const median = (list) => { const s = [...list].sort((x, y) => x - y); const m = Math.floor(s.length / 2); return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };

const once = async (browser, base, path, rate) => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await context.route((url) => !/^http:\/\/127\.0\.0\.1/.test(url.href), (route) => route.abort());
  await context.addInitScript(() => {
    window.__prevented = [];
    window.addEventListener("wheel", (e) => setTimeout(() => window.__prevented.push(e.defaultPrevented)), { passive: true, capture: true });
  });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  if (rate > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate });
  await page.goto(base + path, { waitUntil: "load" });
  await page.mouse.move(700, 450);
  await page.waitForTimeout(2000);
  await page.evaluate(() => {
    window.__track = [];
    const t0 = performance.now();
    const tick = () => { window.__track.push([performance.now() - t0, scrollY]); if (performance.now() - t0 < 3000) requestAnimationFrame(tick); };
    window.__t0 = t0;
    requestAnimationFrame(tick);
  });
  const sent = await page.evaluate(() => performance.now() - window.__t0);
  await page.mouse.wheel(0, 300);
  await page.waitForTimeout(rate > 1 ? 2600 : 1500);
  const { track, prevented } = await page.evaluate(() => ({ track: window.__track, prevented: window.__prevented }));
  await context.close();
  const end = track.at(-1)[1];
  const at90 = track.find(([, y]) => y >= 0.9 * end);
  let settled = track.at(-1)[0];
  for (let i = track.length - 1; i > 0; i -= 1) if (track[i - 1][1] !== end) { settled = track[i][0]; break; }
  return { distance: end, to90: at90 ? Math.round(at90[0] - sent) : null, settled: Math.round(settled - sent), prevented: prevented.includes(true) };
};

(async () => {
  const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const out = {};
  for (const path of PAGES) for (const rate of [1, 4]) for (const [side, base] of SIDES) {
    const runs = [];
    for (let i = 0; i < RUNS; i += 1) runs.push(await once(browser, base, path, rate));
    const key = `${path} x${rate} ${side}`;
    out[key] = { distance: median(runs.map((r) => r.distance)), to90ms: median(runs.map((r) => r.to90)), settledMs: median(runs.map((r) => r.settled)), prevented: runs.some((r) => r.prevented), runs };
    console.log(key, JSON.stringify({ ...out[key], runs: undefined }));
  }
  await browser.close();
  if (arg("out")) require("node:fs").writeFileSync(arg("out"), JSON.stringify({ date: new Date().toISOString(), a: arg("a"), b: arg("b"), runs: RUNS, results: out }, null, 1));
})();
