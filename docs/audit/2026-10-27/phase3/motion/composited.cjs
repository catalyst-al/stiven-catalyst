// Phase 3, motion: which running CSS animations of a page Chrome could not run on the compositor, and why.
//   node docs/audit/2026-10-27/phase3/motion/composited.cjs http://127.0.0.1:8322 / /tools/cx-control-tower/
// Reads the "Animation" trace events (category devtools.timeline): args.data.compositeFailed is a bit mask of the
// reasons (Chromium's CompositorAnimations::FailureReason) and unsupportedProperties names the properties at fault.
const { chromium } = require("playwright");

const [base, ...paths] = process.argv.slice(2);
// Chromium's FailureReason bits as read off Chrome 153's own output (the bit is always printed with the mask; the
// names of bits 9-11 and 14-17 are a best reading, check the mask against compositor_animations.h when in doubt).
const REASONS = ["accelerated animations disabled", "effect suppressed by devtools", "invalid animation or effect",
  "effect has unsupported timing params", "effect has non-replace composite mode", "target has invalid compositing state",
  "target has incompatible animations", "target has CSS offset", "unused", "bit 9", "bit 10", "bit 11",
  "mixed keyframe value types", "unsupported CSS property", "animation has no visible change", "affects important property",
  "target has several transform-related properties", "timeline source has invalid compositing state"];

(async () => {
  const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const context = await browser.newContext({ viewport: { width: Number(process.env.WIDTH || 1440), height: 900 } });
  await context.route((url) => !/^http:\/\/127\.0\.0\.1/.test(url.href), (route) => route.abort());
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  for (const path of paths) {
    const events = [];
    const onData = ({ value }) => events.push(...value);
    cdp.on("Tracing.dataCollected", onData);
    const done = new Promise((resolve) => cdp.once("Tracing.tracingComplete", resolve));
    await cdp.send("Tracing.start", { categories: "devtools.timeline,blink.animations", transferMode: "ReportEvents" });
    await page.goto(base + path, { waitUntil: "load" });
    await page.waitForTimeout(2000);
    await cdp.send("Tracing.end");
    await done;
    cdp.off("Tracing.dataCollected", onData);
    const names = new Map();
    for (const e of events) if (e.name === "Animation" && e.ph === "b") names.set(e.id2?.local || e.id, `${e.args.data.displayName} on ${e.args.data.nodeName}`);
    const failed = new Map();
    for (const e of events) {
      const d = e.args?.data;
      if (e.name !== "Animation" || !d || d.compositeFailed === undefined) continue;
      const why = `mask ${d.compositeFailed}: ${REASONS.filter((_, i) => d.compositeFailed & (1 << i)).join("; ")}`;
      const key = `${names.get(e.id2?.local || e.id) || "?"}: ${why}${d.unsupportedProperties?.length ? ` [${d.unsupportedProperties.join(",")}]` : ""}`;
      failed.set(key, (failed.get(key) || 0) + 1);
    }
    console.log(`\n${path}: ${failed.size ? "" : "every animation composited"}`);
    for (const [k, n] of failed) console.log(`  ${n}x ${k}`);
  }
  await browser.close();
})();
