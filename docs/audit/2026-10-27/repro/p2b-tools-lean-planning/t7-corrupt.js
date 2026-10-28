// Damaged saved data: each tool's key set to broken JSON / wrong shapes; does the page load, and does it keep or replace the value?
const { open, close } = require('./lib');
const KEYS = { 'a3-report': 'sc-a3-report', 'action-tracker': 'sc-actions', 'eight-d': 'sc-eight-d', fishbone: 'sc-fishbone', 'five-s-audit': 'sc-five-s-audit', 'five-whys': 'sc-five-whys', fmea: 'sc-fmea', 'gemba-walk': 'sc-gemba-walk', heijunka: 'sc-heijunka', 'hoshin-kanri': 'sc-hoshin-kanri', 'housekeeping-planner': 'sc-housekeeping-planner', 'inventory-abc': 'sc-inventory-abc', 'kaizen-board': 'sc-kaizen-board', 'kaizen-event': 'sc-kaizen-event', 'kanban-sizing': 'sc-kanban-sizing', 'leader-standard-work': 'sc-leader-standard-work', 'lean-assessment': 'sc-lean-assessment', 'maintenance-planner': 'sc-maintenance-planner', 'poka-yoke': 'sc-poka-yoke', 'process-lab': 'sc-process-lab', 'project-portfolio': 'sc-project-portfolio', 'risk-assessment': 'sc-risk-assessment', 'room-inspection': 'sc-room-inspection', 'room-status': 'sc-room-status', 'shift-capacity': 'sc-shift-capacity', 'skills-matrix': 'sc-skills-matrix', smed: 'sc-smed', 'spaghetti-diagram': 'sc-spaghetti-diagram', 'standard-work': 'sc-standard-work', 'time-study': 'sc-time-study', 'value-stream-map': 'sc-value-stream-map', 'print-pack': 'sc-print-pack', 'six-sigma-dmaic': 'sc-dmaic' };
const BAD = { broken: '{"rows":[{"a":1}', arr: '[1,2,3]', nul: 'null', shape: '{"rows":"x","items":5,"assessments":{"a":1},"projects":"p","stations":7,"walks":null,"loops":"z","leaders":3,"devices":{},"reports":1,"events":2,"docs":"d","rooms":"r","board":[],"people":"q","tasks":4,"steps":"s","current":{"steps":9},"elements":"e","products":1}', huge: JSON.stringify({ rows: Array.from({ length: 3 }, () => ({ title: '😀'.repeat(5000), step: 'x'.repeat(20000) })) }) };
(async () => {
  const bad = [];
  for (const [tool, key] of Object.entries(KEYS)) {
    for (const [kind, value] of Object.entries(BAD)) {
      const { page, errors } = await open(`/tools/${tool}/`, { storage: { [key]: value } });
      await page.waitForTimeout(400);
      const after = await page.evaluate((k) => localStorage.getItem(k), key);
      const hasMain = await page.evaluate(() => document.querySelector('main')?.innerText.length || 0);
      const kept = after === value ? 'kept' : after === null ? 'removed' : 'replaced';
      if (errors.length || kind === 'broken') console.log(tool, kind, kept, 'errors:', errors.slice(0, 2).join(' / ').slice(0, 200));
      if (errors.length) bad.push([tool, kind, errors[0]]);
      await page.context().close();
    }
  }
  console.log('TOOLS WITH ERRORS', JSON.stringify(bad, null, 1));
  await close();
})();
