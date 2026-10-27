const { chromium } = require('$SRC/node_modules/playwright');
const PAGES = '/,/de/,/sq/,/insights/pareto-and-5-why-in-practice/,/reflections/the-information-monopoly/,/field-notes.html,/magazine/management-review-nr-80.html,/magazine/management-review.html,/books/mall-per-durresin.html,/tools.html,/tools/cx-control-tower/,/tools/shift-pulse/,/tools/cv-builder/,/podcast.html,/search.html,/contact.html,/coaching.html,/roles/shift-lead/'.split(',');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  await ctx.addInitScript(() => { window.__csp = []; document.addEventListener('securitypolicyviolation', (e) => window.__csp.push(`${e.violatedDirective} ${e.blockedURI} ${e.sourceFile}:${e.lineNumber}`)); });
  // block external hosts locally so nothing leaves; record them
  const ext = {};
  await ctx.route(/^https?:\/\/(?!localhost)/, (r) => { const h = new URL(r.request().url()).hostname; ext[h] = (ext[h] || 0) + 1; r.abort(); });
  for (const p of PAGES) {
    const page = await ctx.newPage(); const errs = [];
    page.on('console', (m) => { if (m.type() === 'error' && !/ERR_FAILED|Failed to load resource/.test(m.text())) errs.push(m.text().slice(0, 160)); });
    page.on('pageerror', (e) => errs.push('pageerror ' + String(e).slice(0, 160)));
    const resp = await page.goto('http://localhost:8105' + p, { waitUntil: 'load' }); await page.waitForTimeout(1200);
    console.log(p, resp.status(), 'csp:', JSON.stringify(await page.evaluate(() => window.__csp)), 'errors:', JSON.stringify(errs));
    await page.close();
  }
  console.log('external hosts requested (blocked locally):', JSON.stringify(ext));
  await b.close();
})();
