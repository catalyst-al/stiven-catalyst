// Phase 3, motion: a 3 s Chrome trace of the home page, summarised as self time per event name on the renderer's
// main thread and the compositor/raster threads (a diagnosis of where "(program)" time goes).
//   node docs/audit/2026-10-27/phase3/motion/trace.cjs http://127.0.0.1:8321 [phone4x|desktop] [path]
const { chromium } = require("playwright");

const base = process.argv[2];
const profile = process.argv[3] || "phone4x";
const path = process.argv[4] || "/";
const P = {
  desktop: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, rate: 1 },
  phone4x: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, rate: 4 },
}[profile];

(async () => {
  const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const context = await browser.newContext({ ...P, colorScheme: "dark" });
  await context.route((url) => !/^http:\/\/127\.0\.0\.1/.test(url.href), (route) => route.abort());
  if (process.env.INIT) await context.addInitScript(process.env.INIT);
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  if (P.rate > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: P.rate });
  await page.goto(base + path, { waitUntil: "load" });
  await page.waitForTimeout(3000);
  const events = [];
  cdp.on("Tracing.dataCollected", ({ value }) => events.push(...value));
  const done = new Promise((resolve) => cdp.once("Tracing.tracingComplete", resolve));
  await cdp.send("Tracing.start", { categories: "devtools.timeline,blink,cc,gpu,viz,disabled-by-default-devtools.timeline", transferMode: "ReportEvents" });
  await page.waitForTimeout(3000);
  await cdp.send("Tracing.end");
  await done;
  const threads = new Map();
  for (const e of events) if (e.ph === "M" && e.name === "thread_name") threads.set(`${e.pid}:${e.tid}`, e.args.name);
  // Self time of complete events (ph X) per thread name and event name.
  const byThread = new Map();
  for (const e of events) {
    if (e.ph !== "X" || !e.dur) continue;
    const t = threads.get(`${e.pid}:${e.tid}`) || "?";
    if (!byThread.has(t)) byThread.set(t, []);
    byThread.get(t).push(e);
  }
  for (const [t, list] of byThread) {
    list.sort((a, b) => a.ts - b.ts || b.dur - a.dur);
    const self = new Map();
    const stack = [];
    for (const e of list) {
      while (stack.length && stack[stack.length - 1].ts + stack[stack.length - 1].dur <= e.ts) stack.pop();
      if (stack.length) { const p = stack[stack.length - 1]; self.set(p.name, (self.get(p.name) || 0) - e.dur); }
      self.set(e.name, (self.get(e.name) || 0) + e.dur);
      stack.push(e);
    }
    const top = [...self.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12);
    if (top[0][1] < 50000) continue;
    console.log(`--- ${t}`);
    const count = (n) => list.filter((e) => e.name === n).length;
    for (const [name, us] of top) console.log(`${(us / 1000).toFixed(0).padStart(7)} ms  ${String(count(name)).padStart(5)}x  ${name}`);
  }
  await browser.close();
})();
