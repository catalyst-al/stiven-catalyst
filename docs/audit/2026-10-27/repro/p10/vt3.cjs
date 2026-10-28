const { chromium } = require(process.cwd() + '/node_modules/playwright');
const AxeBuilder = require(process.cwd() + '/node_modules/@axe-core/playwright').default;
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  for (const axe of [false, true]) {
  const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  let step = 'start'; const errs = [];
  p.on('pageerror', e => errs.push(step + ': ' + e.message));
  const B = 'http://127.0.0.1:8110';
  step = 'home'; await p.goto(B + '/');
  const link = p.locator('.site-header a[href="/search.html"]');
  step = 'tab'; for (let i = 0; i < 40 && !(await link.evaluate(a => a === document.activeElement)); i++) await p.keyboard.press('Tab');
  step = 'enter'; await p.keyboard.press('Enter'); await p.waitForURL(/search\.html$/);
  step = 'type'; await p.keyboard.type('handover'); await p.locator('[data-search-results] > li > a').first().waitFor();
  if (axe) { step = 'axe'; await new AxeBuilder({ page: p }).withTags(['wcag2a','wcag2aa']).analyze(); }
  step = 'open'; const a = p.locator('[data-search-results] > li > a').first(); const href = await a.getAttribute('href');
  for (let i = 0; i < 10 && !(await a.evaluate(x => x === document.activeElement)); i++) await p.keyboard.press('Tab');
  await p.keyboard.press('Enter'); await p.waitForURL('**' + href);
  step = 'back'; await p.goBack(); await p.waitForTimeout(1500);
  console.log('axe=' + axe, JSON.stringify(errs)); await p.close(); }
  await b.close();
})();
