const { chromium } = require(process.cwd() + '/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  let step = 'start'; const errs = [];
  p.on('pageerror', e => errs.push(step + ': ' + e.message));
  const B = 'http://127.0.0.1:8110';
  step = 'home'; await p.goto(B + '/'); await p.waitForTimeout(800);
  step = 'click-search'; await p.click('.site-header a[href="/search.html"]'); await p.waitForURL(/search/); await p.waitForTimeout(800);
  step = 'type'; await p.keyboard.type('handover'); await p.waitForTimeout(1200);
  step = 'open-result'; const href = await p.locator('[data-search-results] > li > a').first().getAttribute('href'); await p.locator('[data-search-results] > li > a').first().click(); await p.waitForURL('**' + href); await p.waitForTimeout(1000);
  step = 'back'; await p.goBack(); await p.waitForTimeout(1500);
  step = 'essay-to-essay'; await p.goto(B + '/'); await p.waitForTimeout(500); await p.locator('main a[href*="/insights/"]').first().click().catch(()=>{}); await p.waitForTimeout(1200);
  step = 'back2'; await p.goBack(); await p.waitForTimeout(1200);
  console.log(JSON.stringify(errs, null, 1)); await b.close();
})();
