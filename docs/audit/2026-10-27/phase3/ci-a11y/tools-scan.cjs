// axe-core (WCAG 2.0/2.1 A and AA, plus heading-order) on every tool page in English, both themes, 1440 x 900, every
// part of the page drawn (content-visibility: visible). Groups what it finds by rule and colours, with the tools.
// Usage: node tests/browser/server.mjs 8312 & node docs/audit/2026-10-27/phase3/ci-a11y/tools-scan.cjs [port]
const path = require('node:path');
const fs = require('node:fs');
const root = path.resolve(__dirname, '../../../../..');
const { chromium } = require(path.join(root, 'node_modules/playwright'));
const { default: AxeBuilder } = require(path.join(root, 'node_modules/@axe-core/playwright'));
const port = Number(process.argv[2]) || 8312;
const executablePath = fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined;
const tools = fs.readdirSync(path.join(root, '_site/tools')).filter((t) => fs.existsSync(path.join(root, '_site/tools', t, 'index.html')));

(async () => {
  const browser = await chromium.launch({ executablePath });
  const groups = {};
  let runs = 0;
  for (const theme of ['dark', 'light']) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    await context.route(/^(?!http:\/\/127\.0\.0\.1[:/])[a-z]+:\/\//, (r) => r.abort());
    await context.addInitScript((t) => { try { localStorage.setItem('sc-theme', t); } catch {} }, theme);
    const page = await context.newPage();
    for (const tool of tools) {
      await page.goto(`http://127.0.0.1:${port}/tools/${tool}/`);
      await page.waitForLoadState('networkidle');
      await page.addStyleTag({ content: '* { content-visibility: visible !important; }' });
      const family = await page.evaluate(() => document.body.dataset.family || '');
      const wcag = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
      const order = await new AxeBuilder({ page }).withRules(['heading-order']).analyze();
      runs++;
      for (const v of [...wcag.violations, ...order.violations]) {
        for (const n of v.nodes) {
          const d = n.any[0]?.data;
          const key = `${theme} ${v.id}${d?.fgColor ? ` ${d.fgColor} on ${d.bgColor} (${d.contrastRatio}:1, ${d.fontSize} ${d.fontWeight})` : ''}`;
          (groups[key] ||= { nodes: 0, tools: new Set() }).nodes++;
          groups[key].tools.add(`${tool}${family ? ` [${family}]` : ''}`);
        }
      }
    }
    await context.close();
  }
  await browser.close();
  const rows = Object.entries(groups).sort((a, b) => b[1].nodes - a[1].nodes);
  for (const [key, g] of rows) console.log(`${String(g.nodes).padStart(4)}  ${key}  -- ${[...g.tools].join(', ')}`);
  console.log(`${runs} runs (${tools.length} tools x 2 themes), ${rows.reduce((a, [, g]) => a + g.nodes, 0)} failing nodes`);
})();
