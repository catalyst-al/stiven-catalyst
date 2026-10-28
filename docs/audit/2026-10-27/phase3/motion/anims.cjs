// Phase 3, motion: the running CSS animations of a page (document.getAnimations()), with what they animate.
//   node docs/audit/2026-10-27/phase3/motion/anims.cjs http://127.0.0.1:8322 / /tools/cx-control-tower/ ...
// Options through the environment: WIDTH (default 1440), MOTION=paused (sets sc-motion before the page loads),
// REDUCED=1 (prefers-reduced-motion: reduce).
const { chromium } = require("playwright");

const [base, ...paths] = process.argv.slice(2);
const width = Number(process.env.WIDTH || 1440);

(async () => {
  const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const context = await browser.newContext({ viewport: { width, height: width < 600 ? 844 : 900 }, reducedMotion: process.env.REDUCED ? "reduce" : "no-preference" });
  await context.route((url) => !/^http:\/\/127\.0\.0\.1/.test(url.href), (route) => route.abort());
  if (process.env.MOTION) await context.addInitScript(`try{localStorage.setItem("sc-motion",${JSON.stringify(process.env.MOTION)})}catch(e){}`);
  const page = await context.newPage();
  for (const path of paths) {
    await page.goto(base + path, { waitUntil: "load" });
    await page.waitForTimeout(2500);
    const list = await page.evaluate(() => document.getAnimations().map((a) => {
      const t = a.effect?.target;
      const el = t ? `${t.tagName.toLowerCase()}${t.className && typeof t.className === "string" ? "." + t.className.trim().split(/\s+/).join(".") : ""}${a.effect.pseudoElement || ""}` : "?";
      const props = [...new Set((a.effect?.getKeyframes?.() || []).flatMap((k) => Object.keys(k).filter((p) => !["offset", "easing", "composite", "computedOffset"].includes(p))))];
      return { name: a.animationName || a.constructor.name, state: a.playState, infinite: a.effect?.getTiming().iterations === Infinity, el, props: props.join(",") };
    }));
    const running = list.filter((a) => a.state === "running");
    console.log(`\n${path}: ${list.length} animations, ${running.length} running, ${running.filter((a) => a.infinite).length} running infinite`);
    for (const a of running) console.log(`  ${a.infinite ? "inf " : "once"} ${a.name.padEnd(22)} ${a.props.padEnd(40)} ${a.el}`);
  }
  await browser.close();
})();
