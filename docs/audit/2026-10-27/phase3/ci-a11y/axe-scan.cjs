// axe-core (WCAG 2.0/2.1 A and AA rules, every impact, plus heading-order) on the pages of
// tests/browser/a11y-pages.spec.mjs, in EN, DE and SQ, in both themes, at 1440 x 900 and 390 x 844. Prints one line
// per page with violations and writes those runs to axe-scan-<motion>[-raw].json next to this file.
// Usage: node tests/browser/server.mjs 8312 & node docs/audit/2026-10-27/phase3/ci-a11y/axe-scan.cjs [port] [motion] [raw]
//   motion: "reduce" (default) or "no-preference". raw: leave content-visibility: auto as it is (axe then reads the
//   parts of a page that are not drawn yet against white, and reports contrast failures that a reader never sees).
const path = require('node:path');
const fs = require('node:fs');
const root = path.resolve(__dirname, '../../../../..');
const { chromium } = require(path.join(root, 'node_modules/playwright'));
const { default: AxeBuilder } = require(path.join(root, 'node_modules/@axe-core/playwright'));

const port = Number(process.argv[2]) || 8312;
const motion = process.argv[3] || 'reduce';
const raw = process.argv[4] === 'raw';
const PAGES = [
  '/', '/insights/the-tools-you-build-yourself/', '/reflections/architects-of-smoke/', '/magazine/management-review-nr-80.html',
  '/magazine/management-review.html', '/field-notes.html', '/tools/cx-control-tower/', '/tools/cv-builder/',
  '/tools/eight-d/', '/tools/damage-control/', '/tools/kpi-diagnostic/', '/books/mall-per-durresin.html',
  '/how-this-is-made.html',
];
const LANGS = ['', '/de', '/sq'];
const executablePath = fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined;

(async () => {
  const browser = await chromium.launch({ executablePath });
  const out = [];
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    for (const theme of ['dark', 'light']) {
      const context = await browser.newContext({ viewport, reducedMotion: motion });
      await context.route(/^(?!http:\/\/127\.0\.0\.1[:/])[a-z]+:\/\//, (r) => r.abort());
      await context.addInitScript((t) => { try { localStorage.setItem('sc-theme', t); } catch {} }, theme);
      const page = await context.newPage();
      for (const lang of LANGS) {
        for (const p of PAGES) {
          const url = lang + p;
          await page.goto(`http://127.0.0.1:${port}${url}`);
          await page.waitForLoadState('networkidle');
          if (!raw) await page.addStyleTag({ content: '* { content-visibility: visible !important; }' });
          const wcag = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
          const order = await new AxeBuilder({ page }).withRules(['heading-order']).analyze();
          const violations = [...wcag.violations, ...order.violations];
          const found = violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.map((n) => n.target.join(' ') + (n.any[0]?.data?.fgColor ? ` ${n.any[0].data.fgColor} on ${n.any[0].data.bgColor}` : '')) }));
          out.push({ width: viewport.width, theme, url, violations: found });
          if (found.length) console.log(`${viewport.width} ${theme} ${url}: ${found.map((v) => `${v.id}(${v.impact}) x${v.nodes.length}`).join(', ')}`);
        }
      }
      await context.close();
    }
  }
  await browser.close();
  fs.writeFileSync(path.join(__dirname, `axe-scan-${motion}${raw ? '-raw' : ''}.json`), JSON.stringify(out.filter((r) => r.violations.length), null, 1));
  const runs = out.length;
  const withV = out.filter((r) => r.violations.length).length;
  const byRule = {};
  out.forEach((r) => r.violations.forEach((v) => { byRule[v.id] = (byRule[v.id] || 0) + v.nodes.length; }));
  console.log(`${runs} runs, ${withV} with violations; nodes by rule: ${JSON.stringify(byRule)}`);
})();
