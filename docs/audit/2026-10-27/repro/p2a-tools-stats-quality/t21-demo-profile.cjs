// Regression 1 (variant): does merely opening the Daily Board write a demo workplace profile that other tools then use?
const { launch, newPage, BASE } = require('./pw.cjs');
const { check, note } = require('./lib.cjs');
(async () => {
  const browser = await launch();
  const { page } = await newPage(browser);
  await page.goto(`${BASE}/tools/daily-board/`); await page.waitForTimeout(800);
  const wp = await page.evaluate(() => localStorage.getItem('sc-workplace'));
  note('sc-workplace after one visit to Daily Board', wp && JSON.parse(wp));
  check('a visit to Daily Board does not write a workplace profile', null, wp);
  // Now the visitor starts their own Damage Control log (clears the example and logs one unit with a volume)
  await page.goto(`${BASE}/tools/delay-analyzer/`); await page.waitForTimeout(600);
  const tp = await page.evaluate(() => ({ placeholder: document.querySelector('[name=target]')?.placeholder, note: document.querySelector('[data-profile-target]')?.textContent?.trim(), hidden: document.querySelector('[data-profile-target]')?.hidden }));
  note('Delay Analyzer target box after that visit', tp);
  await page.goto(`${BASE}/tools/damage-control/`); await page.waitForTimeout(600);
  const tp2 = await page.evaluate(() => ({ placeholder: document.querySelector('[name=target]')?.placeholder, note: document.querySelector('[data-profile-target]')?.textContent?.trim(), hidden: document.querySelector('[data-profile-target]')?.hidden, shifts: [...document.querySelectorAll('[data-entry] [name=shift] option')].map((o) => o.textContent) }));
  note('Damage Control target box / shifts after that visit', tp2);
  await page.goto(`${BASE}/tools/oee/`); await page.waitForTimeout(600);
  note('OEE page mentions demo site?', await page.evaluate(() => /Frankfurt hub/.test(document.body.textContent)));
  await browser.close();
})();
