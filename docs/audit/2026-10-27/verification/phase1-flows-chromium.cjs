// Phase 1 verification in real Chromium on the built site: the flows between tools as a visitor meets them.
// Run from the repository root after `npm run build`: node tests/browser/server.mjs 8131 & node <this file>
// Prints PASS/FAIL per check and exits 1 on a failure.
const path = require('node:path');
const { chromium } = require(path.join(process.cwd(), 'node_modules', 'playwright'));
const BASE = process.env.BASE || 'http://127.0.0.1:8131';
const fails = [];
const check = (label, ok, detail = '') => { console.log(`${ok ? 'PASS' : 'FAIL'} ${label}${detail ? ` | ${detail}` : ''}`); if (!ok) fails.push(label); };

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }).catch(() => chromium.launch());
  const context = await browser.newContext({ timezoneId: 'Europe/Berlin' });
  const errors = [];
  const open = async (url) => {
    const page = await context.newPage();
    page.on('pageerror', (e) => errors.push(`${url}: ${e.message}`));
    await page.goto(`${BASE}${url}`, { waitUntil: 'load' });
    await page.waitForTimeout(400);
    return page;
  };
  const stored = (page, key) => page.evaluate((k) => JSON.parse(localStorage.getItem(k)), key);
  const clear = async () => { const p = await open('/index.html'); await p.evaluate(() => localStorage.clear()); await p.close(); };

  // 1. Damage Control: a first visit, period buttons, one example row removed, one own entry.
  await clear();
  let page = await open('/tools/damage-control/');
  for (const preset of ['week', 'all']) { await page.click(`[data-range] [data-preset="${preset}"]`); await page.waitForTimeout(150); }
  let log = await stored(page, 'sc-damage-control');
  check('Damage Control: period buttons store the example only as an example', !log || log.rows.every((r) => r.example === true), `${log?.rows?.length ?? 0} rows`);
  await page.click('[data-log] [data-remove]');
  await page.fill('[data-entry] [name=units]', '3');
  await page.fill('[data-entry] [name=note]', 'own entry');
  await page.click('[data-entry] [type=submit]');
  await page.waitForTimeout(300);
  log = await stored(page, 'sc-damage-control');
  check('Damage Control: one example row removed + one own entry = only the own entry', log.rows.length === 1 && log.rows[0].note === 'own entry', `${log.rows.length} rows`);
  await page.close();

  // 2. The readers on stored examples show what they show for an empty browser.
  await clear();
  for (const slug of ['damage-control', 'incomplete-control', 'delay-analyzer']) {
    const p = await open(`/tools/${slug}/`);
    await p.click('[data-range] [data-preset="all"]');
    await p.waitForTimeout(200);
    await p.close();
  }
  const pulseWithExamples = await (await open('/tools/shift-pulse/')).evaluate(() => document.querySelector('[data-results]')?.innerText || '');
  await clear();
  const pulseEmpty = await (await open('/tools/shift-pulse/')).evaluate(() => document.querySelector('[data-results]')?.innerText || '');
  check('Shift Pulse: stored examples read as nothing', pulseWithExamples === pulseEmpty);

  // 3. Waste Log → Cost of Quality, in three languages.
  for (const lang of ['', '/de', '/sq']) {
    await clear();
    const w = await open(`${lang}/tools/waste-log/`);
    await w.fill('[data-entry] [name=product]', 'Croissants');
    await w.fill('[data-entry] [name=qty]', '10');
    await w.fill('[data-entry] [name=cost]', lang ? '2,50' : '2.50');
    await w.click('[data-entry] [type=submit]');
    await w.waitForTimeout(300);
    const c = await open(`${lang}/tools/cost-of-quality/`);
    await c.click('[data-import]');
    await c.waitForTimeout(300);
    const line = (await stored(c, `sc-cost-of-quality${lang ? `-${lang.slice(1)}` : ''}`))?.lines?.find((l) => l.source === 'waste-log');
    check(`Waste Log → Cost of Quality ${lang || '/en'}: 25 € brought in`, Number(line?.amount) === 25, line ? `amount ${line.amount}` : await c.evaluate(() => document.querySelector('[data-status]').textContent));
  }

  // 4. The Action Tracker's example, then a hand-off from Kaizen Board, twice.
  await clear();
  page = await open('/tools/action-tracker/');
  check('Action Tracker: a first visit shows the example', await page.isVisible('.dl-example-note'));
  const k = await open('/tools/kaizen-board/');
  await k.fill('[data-entry] [name=title]', 'Second scanner at the outbound dock');
  await k.click('[data-entry] [type=submit]');
  await k.waitForTimeout(200);
  for (let i = 0; i < 3 && !(await k.$('[data-action="action"]')); i++) { await k.click('.kb-card [data-action="forward"]'); await k.waitForTimeout(150); }
  await k.click('[data-action="action"]');
  await k.waitForTimeout(150);
  await k.click('[data-action="action"]');
  const said = await k.evaluate(() => document.querySelector('[data-status]').textContent);
  const actions = (await stored(k, 'sc-actions')).rows;
  check('Kaizen Board → Action Tracker: one own action, the example gone', actions.length === 1 && !actions[0].example, `${actions.length} rows`);
  check('Kaizen Board: the second click says it is already on the list', /Already on the list/.test(said), said.trim());

  // 5. The Daily Board's example writes no workplace profile.
  await clear();
  page = await open('/tools/daily-board/');
  check('Daily Board: first visit leaves sc-workplace empty', (await stored(page, 'sc-workplace')) === null);

  check('no script error on any page', errors.length === 0, errors.slice(0, 3).join(' · '));
  await browser.close();
  console.log(fails.length ? `${fails.length} failed` : 'all passed');
  process.exit(fails.length ? 1 : 0);
})();
