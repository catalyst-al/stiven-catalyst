// Keyboard: tab order, visible focus, focus obscured by sticky header, skip link, mobile menu behaviour, pause button.
const path = require('path');
const SRC = '$SRC';
const { chromium } = require(path.join(SRC, 'node_modules/playwright'));
const BASE = process.argv[2] || 'http://localhost:8105';
const PAGES = (process.env.PAGES || '/,/insights/pareto-and-5-why-in-practice/,/tools/cx-control-tower/,/tools/shift-pulse/,/magazine/management-review-nr-80.html,/books/mall-per-durresin.html,/podcast.html,/search.html').split(',');
const STEPS = Number(process.env.STEPS || 60);
const FOCUSINFO = () => {
  const el = document.activeElement;
  if (!el || el === document.body) return { tag: 'body' };
  const r = el.getBoundingClientRect();
  const cs = getComputedStyle(el);
  const ring = (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0) ? `outline ${cs.outlineWidth} ${cs.outlineColor}` : (cs.boxShadow !== 'none' ? 'box-shadow' : 'NONE');
  // obscured: sample 5 points, see if topmost element is outside el (and not inside el)
  const pts = [[r.left + r.width / 2, r.top + r.height / 2], [r.left + 2, r.top + 2], [r.right - 2, r.top + 2], [r.left + 2, r.bottom - 2], [r.right - 2, r.bottom - 2]];
  let covered = 0, coveredBy = '';
  for (const [x, y] of pts) {
    if (x < 0 || y < 0 || x > innerWidth || y > innerHeight) continue;
    const top = document.elementFromPoint(x, y);
    if (top && top !== el && !el.contains(top) && !top.contains(el)) { covered++; coveredBy = (top.closest('header,.site-header,[class*=bar],[class*=sticky]') || top).className.toString().slice(0, 40); }
  }
  const inView = r.bottom > 0 && r.top < innerHeight;
  const label = (el.getAttribute('aria-label') || el.textContent || el.value || '').trim().replace(/\s+/g, ' ').slice(0, 40);
  return { tag: el.tagName.toLowerCase(), label, cls: (typeof el.className === 'string' ? el.className : '').slice(0, 30), ring, covered, coveredBy, inView, w: Math.round(r.width), h: Math.round(r.height) };
};
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  for (const w of (process.env.WIDTHS || '1440,390').split(',').map(Number)) for (const p of PAGES) {
    const ctx = await browser.newContext({ viewport: { width: w, height: w < 600 ? 844 : 900 }, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto(BASE + p, { waitUntil: 'load' });
    await page.waitForTimeout(800);
    const seq = [];
    for (let i = 0; i < STEPS; i++) { await page.keyboard.press('Tab'); seq.push(await page.evaluate(FOCUSINFO)); }
    const noRing = seq.filter((s) => s.ring === 'NONE');
    const obscured = seq.filter((s) => s.covered >= 3 || (s.covered > 0 && s.covered === 5));
    const hiddenFocus = seq.filter((s) => s.tag !== 'body' && (s.w === 0 || s.h === 0));
    console.log(`\n${p} w=${w}: first=${JSON.stringify(seq[0])}`);
    console.log(`  stops=${seq.length} noVisibleRing=${noRing.length} obscured(>=3/5 pts covered)=${obscured.length} zeroSize=${hiddenFocus.length}`);
    for (const s of noRing.slice(0, 5)) console.log('   no-ring:', JSON.stringify(s));
    for (const s of obscured.slice(0, 5)) console.log('   obscured:', JSON.stringify(s));
    for (const s of hiddenFocus.slice(0, 5)) console.log('   zero-size:', JSON.stringify(s));
    // skip link
    await page.goto(BASE + p, { waitUntil: 'load' });
    await page.keyboard.press('Tab');
    const skip = await page.evaluate(() => ({ text: document.activeElement.textContent.trim(), visible: document.activeElement.getBoundingClientRect().top >= 0 && getComputedStyle(document.activeElement).opacity !== '0' }));
    await page.keyboard.press('Enter');
    await page.waitForTimeout(300);
    await page.keyboard.press('Tab');
    const after = await page.evaluate(() => { const m = document.getElementById('main'); return { inMain: m ? m.contains(document.activeElement) : null, el: document.activeElement.tagName + ' ' + (document.activeElement.textContent || '').trim().slice(0, 30) }; });
    console.log('  skip link:', JSON.stringify(skip), 'after Enter+Tab ->', JSON.stringify(after));
    await ctx.close();
  }
  await browser.close();
})();
