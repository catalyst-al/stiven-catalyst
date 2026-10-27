// axe-core + target size + overflow checks. node a11y.cjs base out.json
const path = require('path');
const fs = require('fs');
const SRC = '$SRC';
const { chromium } = require(path.join(SRC, 'node_modules/playwright'));
const { AxeBuilder } = require(path.join(SRC, 'node_modules/@axe-core/playwright'));
const BASE = process.argv[2] || 'http://localhost:8105';
const OUT = process.argv[3];
const PAGES = (process.env.PAGES || [
  '/', '/de/', '/sq/', '/insights/pareto-and-5-why-in-practice/', '/reflections/the-information-monopoly/',
  '/field-notes.html', '/magazine/management-review-nr-80.html', '/magazine/management-review.html',
  '/books/mall-per-durresin.html', '/tools.html', '/tools/cx-control-tower/', '/tools/shift-pulse/',
  '/podcast.html', '/search.html', '/datenschutz.html', '/contact.html',
].join(',')).split(',');
const WIDTHS = (process.env.WIDTHS || '390,1440').split(',').map(Number);
const THEMES = (process.env.THEMES || 'dark,light').split(',');
const MOTION = process.env.MOTION || 'reduce';

const TARGETS = () => {
  const sel = 'a[href], button, input:not([type=hidden]), select, textarea, summary, [role=button], [role=link], [role=tab], [tabindex]:not([tabindex="-1"])';
  const els = [...document.querySelectorAll(sel)].filter((el) => {
    const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && !el.closest('[hidden],[aria-hidden=true]');
  });
  const boxes = els.map((el) => ({ el, r: el.getBoundingClientRect() }));
  const small = [];
  for (const { el, r } of boxes) {
    if (r.width >= 24 && r.height >= 24) continue;
    // inline-in-text exception: inline <a> inside a paragraph/list item with other text
    const cs = getComputedStyle(el);
    if (el.tagName === 'A' && cs.display === 'inline') {
      const p = el.parentElement; if (p && p.textContent.trim().length > el.textContent.trim().length + 5) continue;
    }
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2 + scrollY;
    // spacing exception: 24px-diameter circle centred on target does not intersect another target or its circle
    const crowded = boxes.some((o) => {
      if (o.el === el || o.el.contains(el) || el.contains(o.el)) return false;
      const ocx = o.r.left + o.r.width / 2, ocy = o.r.top + o.r.height / 2 + scrollY;
      const osmall = o.r.width < 24 || o.r.height < 24;
      if (osmall) return Math.hypot(cx - ocx, cy - ocy) < 24;
      const dx = Math.max(o.r.left - cx, 0, cx - o.r.right); const dy = Math.max(o.r.top + scrollY - cy, 0, cy - (o.r.bottom + scrollY));
      return Math.hypot(dx, dy) < 12;
    });
    const label = (el.getAttribute('aria-label') || el.textContent || el.getAttribute('title') || el.name || el.tagName).trim().replace(/\s+/g, ' ').slice(0, 40);
    small.push({ tag: el.tagName.toLowerCase(), cls: (typeof el.className === 'string' ? el.className : '').slice(0, 40), label, w: Math.round(r.width), h: Math.round(r.height), crowded });
  }
  return { total: els.length, small };
};

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const results = [];
  for (const p of PAGES) for (const w of WIDTHS) for (const theme of THEMES) {
    const ctx = await browser.newContext({ viewport: { width: w, height: w < 600 ? 844 : 900 }, isMobile: w < 600, hasTouch: w < 600, reducedMotion: MOTION });
    await ctx.addInitScript((t) => { try { localStorage.setItem('sc-theme', t); } catch {} }, theme);
    const page = await ctx.newPage();
    await page.goto(BASE + p, { waitUntil: 'load' });
    await page.waitForTimeout(1200);
    // scroll through so lazy/reveal content settles, back to top
    await page.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } scrollTo(0, 0); });
    await page.waitForTimeout(600);
    let axe;
    try { axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice']).analyze(); } catch (e) { axe = { error: String(e) }; }
    const violations = (axe.violations || []).map((v) => ({ id: v.id, impact: v.impact, tags: v.tags.filter((t) => /wcag|best/.test(t)), n: v.nodes.length, help: v.help, nodes: v.nodes.slice(0, 5).map((n) => ({ t: n.target.join(' '), s: (n.failureSummary || '').split('\n').slice(0, 3).join(' | ').slice(0, 220), html: n.html.slice(0, 160) })) }));
    const incomplete = (axe.incomplete || []).map((v) => ({ id: v.id, n: v.nodes.length }));
    const targets = await page.evaluate(TARGETS);
    const overflow = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: innerWidth }));
    results.push({ page: p, w, theme, violations, incomplete, targets: { total: targets.total, small: targets.small.length, crowded: targets.small.filter((s) => s.crowded).length, examples: targets.small.filter((s) => s.crowded).slice(0, 8) }, overflow });
    console.log(p, w, theme, 'violations:', violations.map((v) => `${v.id}(${v.impact})x${v.n}`).join(', ') || 'none', '| small targets', targets.small.length, 'crowded', targets.small.filter((s) => s.crowded).length, '| overflow', overflow.sw > overflow.iw ? `YES ${overflow.sw}` : 'no');
    await ctx.close();
  }
  fs.writeFileSync(OUT, JSON.stringify(results, null, 1));
  await browser.close();
})();
