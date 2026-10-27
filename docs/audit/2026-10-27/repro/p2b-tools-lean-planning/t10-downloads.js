// Click every export button of every tool (EN and DE, example loaded) and save the files for validation.
const fs = require('fs');
const path = require('path');
const { open, close } = require('./lib');
const TOOLS = ['a3-report', 'action-tracker', 'eight-d', 'five-s-audit', 'fmea', 'gemba-walk', 'heijunka', 'housekeeping-planner', 'inventory-abc', 'kaizen-board', 'kaizen-event', 'kanban-sizing', 'leader-standard-work', 'poka-yoke', 'process-lab', 'project-portfolio', 'risk-assessment', 'room-status', 'shift-capacity', 'smed', 'spaghetti-diagram', 'time-study', 'value-stream-map', 'maintenance-planner', 'lean-assessment', 'hoshin-kanri', 'skills-matrix', 'standard-work', 'fishbone', 'room-inspection'];
const RX = /csv|excel|word|\.json|\.ics|calendar|template file|history/i;
(async () => {
  const dir = path.join(__dirname, 'downloads');
  for (const lang of ['', '/de']) {
    for (const t of TOOLS) {
      const { page, errors } = await open(`${lang}/tools/${t}/`);
      const ex = page.locator('button[data-example]:visible'); if (await ex.count()) { await ex.first().click().catch(() => {}); await page.waitForTimeout(500); }
      // open all <details> so hidden buttons become visible
      await page.evaluate(() => document.querySelectorAll('main details').forEach((d) => { d.open = true; }));
      await page.waitForTimeout(200);
      const buttons = page.locator('main button:visible, main a[download]:visible');
      const n = await buttons.count();
      const got = [];
      for (let i = 0; i < n; i++) {
        const b = buttons.nth(i);
        const label = ((await b.textContent().catch(() => '')) || '').trim();
        if (!RX.test(label) || /open a template/i.test(label) || /öffnen/i.test(label)) continue;
        try {
          const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 4000 }), b.click({ timeout: 3000 })]);
          const name = `${lang ? 'de' : 'en'}__${t}__${dl.suggestedFilename()}`;
          await dl.saveAs(path.join(dir, name));
          got.push(name);
        } catch (e) { got.push(`(no download: ${label})`); }
      }
      console.log(`${lang || '/en'} ${t}:`, got.join(', '), errors.length ? `ERR ${errors[0]}` : '');
      await page.context().close();
    }
  }
  await close();
})();
