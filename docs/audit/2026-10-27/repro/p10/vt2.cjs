const { chromium } = require(process.cwd() + '/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  for (const variant of ['fast-back', 'slow-back']) {
  const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  let step = 'start'; const errs = [];
  p.on('pageerror', e => errs.push(step + ': ' + e.message));
  const B = 'http://127.0.0.1:8110';
  step = 'home'; await p.goto(B + '/');
  step = 'search'; await p.goto(B + '/search.html');
  step = 'type'; await p.locator('[data-search-input]').focus(); await p.keyboard.type('handover');
  await p.locator('[data-search-results] > li > a').first().waitFor();
  step = 'open-result'; const a = p.locator('[data-search-results] > li > a').first(); const href = await a.getAttribute('href'); await a.focus(); await p.keyboard.press('Enter'); await p.waitForURL('**' + href); await p.locator('main h1').first().waitFor();
  if (variant === 'slow-back') await p.waitForTimeout(2000);
  step = 'back'; await p.goBack(); await p.waitForTimeout(2000);
  console.log(variant, JSON.stringify(errs)); await p.close(); }
  await b.close();
})();
