// For every tool in the group and every language: load page, click the example button, record errors, keys written,
// visible result text length, and buttons available (for later tests). Also: is the page usable with corrupted storage?
const fs = require('fs');
const { open, close } = require('./lib');
const TOOLS = ['a3-report', 'action-tracker', 'eight-d', 'fishbone', 'five-s-audit', 'five-whys', 'fmea', 'gemba-walk', 'heijunka', 'hoshin-kanri', 'housekeeping-planner', 'inventory-abc', 'kaizen-board', 'kaizen-event', 'kanban-sizing', 'leader-standard-work', 'lean-assessment', 'maintenance-planner', 'poka-yoke', 'process-lab', 'project-portfolio', 'risk-assessment', 'room-inspection', 'room-status', 'shift-capacity', 'six-sigma-dmaic', 'skills-matrix', 'smed', 'spaghetti-diagram', 'standard-work', 'time-study', 'value-stream-map', 'print-pack'];
(async () => {
  const out = {};
  for (const lang of ['', '/de', '/sq']) {
    for (const t of TOOLS) {
      const url = `${lang}/tools/${t}/`;
      const { page, errors } = await open(url);
      const info = { url };
      const ex = await page.$('button[data-example], [data-example] button, button[data-lab-example]');
      info.hasExample = Boolean(ex);
      if (ex) { try { await ex.click({ timeout: 3000 }); await page.waitForTimeout(600); } catch (e) { info.clickErr = String(e).slice(0, 120); } }
      info.keys = await page.evaluate(() => Object.keys(localStorage).filter((k) => k.startsWith('sc-')).map((k) => `${k}:${localStorage.getItem(k).length}`));
      info.buttons = await page.evaluate(() => [...document.querySelectorAll('main button')].filter((b) => b.offsetParent).map((b) => b.textContent.trim().slice(0, 40)).filter(Boolean).slice(0, 60));
      info.errors = errors.slice(0, 5);
      out[url] = info;
      console.log(url, 'example', info.hasExample, 'errors', errors.length, 'keys', info.keys.join(' '));
      await page.context().close();
    }
  }
  fs.writeFileSync(__dirname + '/explore.json', JSON.stringify(out, null, 1));
  await close();
})();
