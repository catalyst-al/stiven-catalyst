// Lists running CSS animations/transitions on a page (optionally after clicking Pause), with keyframe properties.
const path = require('path');
const SRC = '$SRC';
const { chromium } = require(path.join(SRC, 'node_modules/playwright'));
const BASE = process.argv[2] || 'http://localhost:8105';
const PAGES = (process.argv[3] || '/').split(',');
const MODE = process.env.MODE || 'paused'; // paused | running | reduced
const W = Number(process.env.W || 1440);
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  for (const p of PAGES) {
    const ctx = await browser.newContext({ viewport: { width: W, height: W < 600 ? 844 : 900 }, reducedMotion: MODE === 'reduced' ? 'reduce' : 'no-preference', isMobile: W < 600, hasTouch: W < 600 });
    const page = await ctx.newPage();
    await page.goto(BASE + p, { waitUntil: 'load' });
    await page.waitForTimeout(2500);
    if (MODE === 'paused') { const b = page.locator('[data-cosmos-pause]'); if (await b.count() && await b.isVisible()) { await b.click(); console.log('  (clicked pause)'); } }
    await page.waitForTimeout(500);
    const list = await page.evaluate(() => {
      const vis = (el) => { const r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth && r.width > 0; };
      return document.getAnimations().filter((a) => a.playState === 'running').map((a) => {
        const el = a.effect && a.effect.target; const pseudo = a.effect && a.effect.pseudoElement;
        let props = [];
        try { props = [...new Set(a.effect.getKeyframes().flatMap((k) => Object.keys(k).filter((x) => !['offset', 'easing', 'composite', 'computedOffset'].includes(x))))]; } catch {}
        const t = a.effect.getComputedTiming();
        const cls = el ? (typeof el.className === 'string' ? el.className : (el.className && el.className.baseVal) || '') : '';
        return { name: a.animationName || a.transitionProperty || a.constructor.name, el: el ? `${el.nodeName.toLowerCase()}.${cls}`.slice(0, 60) + (pseudo || '') : '?', inf: t.iterations === Infinity, dur: t.duration, props: props.join('|'), vis: el ? vis(el) : null };
      });
    });
    console.log(`${p} [${MODE} w=${W}] running=${list.length} infinite=${list.filter((x) => x.inf).length} visible=${list.filter((x) => x.vis).length}`);
    const groups = {};
    for (const a of list) { const k = `${a.name} ${a.el} ${a.props} inf=${a.inf} dur=${a.dur}`; groups[k] = groups[k] || { n: 0, vis: 0 }; groups[k].n++; if (a.vis) groups[k].vis++; }
    for (const [k, v] of Object.entries(groups).sort((a, b) => b[1].n - a[1].n).slice(0, Number(process.env.TOP || 40))) console.log(`   x${v.n} (vis ${v.vis})  ${k}`);
    await ctx.close();
  }
  await browser.close();
})();
