// Phase 3, motion: where the home hero's main-thread time goes (a diagnosis, not a before/after measurement).
//   node docs/audit/2026-10-27/phase3/motion/profile.cjs http://127.0.0.1:8321 [phone4x|desktop]
// Prints the CDP Performance metrics split (TaskDuration, ScriptDuration, Layout, RecalcStyle) over 5 s, and the
// self time of the 25 heaviest functions of a 5 s V8 CPU profile (canvas calls show up as native frames).
const { chromium } = require("playwright");

const base = process.argv[2];
const profile = process.argv[3] || "phone4x";
const P = {
  desktop: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, rate: 1 },
  phone4x: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, rate: 4 },
}[profile];

(async () => {
  const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const context = await browser.newContext({ ...P, colorScheme: "dark" });
  await context.route((url) => !/^http:\/\/127\.0\.0\.1/.test(url.href), (route) => route.abort());
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send("Performance.enable");
  if (P.rate > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: P.rate });
  await page.goto(base + "/", { waitUntil: "load" });
  await page.waitForTimeout(3000);
  const metrics = async () => Object.fromEntries((await cdp.send("Performance.getMetrics")).metrics.map((m) => [m.name, m.value]));
  await cdp.send("Profiler.enable");
  await cdp.send("Profiler.setSamplingInterval", { interval: 200 });
  const m0 = await metrics();
  await cdp.send("Profiler.start");
  await page.waitForTimeout(5000);
  const { profile: prof } = await cdp.send("Profiler.stop");
  const m1 = await metrics();
  const d = (k) => +(m1[k] - m0[k]).toFixed(3);
  console.log({ TaskDuration: d("TaskDuration"), ScriptDuration: d("ScriptDuration"), LayoutDuration: d("LayoutDuration"), RecalcStyleDuration: d("RecalcStyleDuration") });
  const byId = new Map(prof.nodes.map((n) => [n.id, n]));
  const self = new Map();
  const dt = prof.timeDeltas;
  prof.samples.forEach((id, i) => {
    const n = byId.get(id);
    const key = `${n.callFrame.functionName || "(anon)"} ${n.callFrame.url.split("/").pop().split("?")[0]}:${n.callFrame.lineNumber + 1}`;
    self.set(key, (self.get(key) || 0) + (dt[i] || 0));
  });
  const total = [...self.values()].reduce((a, b) => a + b, 0);
  [...self.entries()].sort((a, b) => b[1] - a[1]).slice(0, 25).forEach(([k, v]) => console.log(`${(v / 1000).toFixed(0).padStart(6)} ms ${(100 * v / total).toFixed(1).padStart(5)}%  ${k}`));
  console.log(await page.evaluate(() => { const c = document.querySelector(".cosmos-canvas"); return { w: c.width, h: c.height, cssW: c.clientWidth, cssH: c.clientHeight }; }));
  await browser.close();
})();
