// Frozen screenshots (reduced motion) + overflow/clipping/overlap detection per width and theme.
const path = require('path');
const fs = require('fs');
const SRC = '$SRC';
const { chromium } = require(path.join(SRC, 'node_modules/playwright'));
const BASE = process.argv[2] || 'http://localhost:8105';
const OUTDIR = path.join(__dirname, 'shots');
fs.mkdirSync(OUTDIR, { recursive: true });
const PAGES = (process.env.PAGES || '/,/de/,/sq/,/insights/pareto-and-5-why-in-practice/,/reflections/the-information-monopoly/,/field-notes.html,/magazine/management-review-nr-80.html,/magazine/management-review.html,/books/mall-per-durresin.html,/tools.html,/tools/cx-control-tower/,/tools/shift-pulse/,/podcast.html,/search.html').split(',');
const WIDTHS = (process.env.WIDTHS || '320,390,768,1024,1440').split(',').map(Number);
const THEMES = (process.env.THEMES || 'dark,light').split(',');
const FULL = process.env.FULL || '320';
const CHECK = () => {
  const iw = document.documentElement.clientWidth;
  const out = { sw: document.documentElement.scrollWidth, iw, offenders: [], clipped: [], overlaps: [] };
  const clippedByAncestor = (el) => { for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) { const cs = getComputedStyle(p); if (/(hidden|auto|scroll|clip)/.test(cs.overflowX)) return true; } return false; };
  for (const el of document.body.querySelectorAll('*')) {
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.position === 'fixed') continue;
    if (r.right > iw + 1 && !clippedByAncestor(el) && !el.closest('[aria-hidden=true],canvas,svg')) out.offenders.push(`${el.tagName.toLowerCase()}.${(typeof el.className === 'string' ? el.className : '').slice(0, 30)} right=${Math.round(r.right)}`);
    // clipped text: element with text, overflow hidden and content wider than box, not an intentional ellipsis
    if (el.childElementCount === 0 && el.textContent.trim().length > 2 && /(hidden|clip)/.test(cs.overflowX) && el.scrollWidth > el.clientWidth + 2 && cs.textOverflow !== 'ellipsis' && !el.closest('.visually-hidden,.sr-only,.skip-link,[aria-hidden=true]')) out.clipped.push(`${el.tagName.toLowerCase()}.${(typeof el.className === 'string' ? el.className : '').slice(0, 30)} "${el.textContent.trim().slice(0, 30)}" ${el.scrollWidth}>${el.clientWidth}`);
  }
  // overlap: interactive elements whose centre is covered by another non-ancestor element (in the first 3 screens)
  for (const el of document.querySelectorAll('a[href],button,input,select,textarea')) {
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height || r.top < 0 || r.bottom > innerHeight) continue;
    if (getComputedStyle(el).visibility === 'hidden' || el.closest('[hidden],[aria-hidden=true]')) continue;
    const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    if (top && top !== el && !el.contains(top) && !top.contains(el)) out.overlaps.push(`${el.tagName.toLowerCase()} "${(el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 25)}" under ${top.tagName.toLowerCase()}.${(typeof top.className === 'string' ? top.className : '').slice(0, 25)}`);
  }
  out.offenders = [...new Set(out.offenders)].slice(0, 8); out.clipped = [...new Set(out.clipped)].slice(0, 8); out.overlaps = [...new Set(out.overlaps)].slice(0, 8);
  return out;
};
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const res = [];
  for (const p of PAGES) for (const w of WIDTHS) for (const theme of THEMES) {
    const ctx = await browser.newContext({ viewport: { width: w, height: w < 600 ? 780 : (w < 1100 ? 1000 : 900) }, isMobile: w < 800, hasTouch: w < 800, reducedMotion: 'reduce' });
    await ctx.addInitScript((t) => { try { localStorage.setItem('sc-theme', t); } catch {} }, theme);
    const page = await ctx.newPage();
    await page.goto(BASE + p, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts && document.fonts.ready);
    await page.waitForTimeout(700);
    const name = `${p.replace(/[\/.]+/g, '_').replace(/^_|_$/g, '') || 'home'}-${w}-${theme}`;
    await page.screenshot({ path: path.join(OUTDIR, name + '.png') });
    if (FULL.split(',').includes(String(w)) && theme === 'dark') await page.screenshot({ path: path.join(OUTDIR, name + '-full.png'), fullPage: true });
    // check at top and also after scrolling to the middle
    const c = await page.evaluate(CHECK);
    res.push({ page: p, w, theme, ...c });
    console.log(p, w, theme, c.sw > c.iw ? `HSCROLL ${c.sw}>${c.iw}` : 'no-hscroll', 'offenders', c.offenders.length, 'clipped', c.clipped.length, 'overlaps', c.overlaps.length);
    await ctx.close();
  }
  fs.writeFileSync(path.join(__dirname, 'shots.json'), JSON.stringify(res, null, 1));
  await browser.close();
})();
