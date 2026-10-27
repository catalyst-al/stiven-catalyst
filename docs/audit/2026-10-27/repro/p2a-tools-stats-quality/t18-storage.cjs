// localStorage robustness: corrupted JSON / wrong shapes in every key the aggregators read; quota errors on write.
const { tool, check, note, text, click } = require('./lib.cjs');
const BAD = ['{"rows":[{"date":', '[]', '"text"', '{"rows":"x","volumes":{}}', '{"rows":[null,1,"a",{"date":"2026-13-45","units":"abc"}]}', 'null', '{"rows":[{"date":"2026-10-20","units":1e308,"shift":{"x":1}}],"volumes":[{"date":"2026-10-20","volume":-5}]}'];
const KEYS = ['sc-damage-control', 'sc-incomplete-control', 'sc-delay-analyzer', 'sc-night-audit', 'sc-safety-cross', 'sc-oee', 'sc-five-s-audit', 'sc-actions', 'sc-hotel-kpis', 'sc-room-inspection', 'sc-maintenance-planner', 'sc-lost-found', 'sc-shift-handover', 'sc-workplace', 'sc-annotations', 'sc-waste-log', 'sc-guest-complaints', 'sc-gemba-walk', 'sc-kaizen-board'];
for (const slug of ['shift-pulse', 'signals', 'ops-report', 'daily-board', 'shift-handover', 'cost-of-quality', 'damage-control', 'sigma-control-chart', 'andon', 'energy-tracker', 'hotel-kpis', 'lost-found', 'guest-complaints', 'waste-log', 'safety-cross', 'oee', 'pareto', 'cx-control-tower', 'site-compare']) {
  let errs = [];
  BAD.forEach((bad) => {
    const seed = Object.fromEntries(KEYS.map((k) => [k, bad]));
    seed[`sc-${slug}`] = bad;
    const w = tool(`/tools/${slug}/`, seed);
    errs.push(...w.__errors.map((e) => `${bad.slice(0, 20)} :: ${e.split('\n')[0].slice(0, 160)}`));
  });
  check(`${slug}: loads without script errors on 7 corrupted/odd storage shapes`, 0, errs.length);
  if (errs.length) note(`${slug} errors`, errs.slice(0, 3));
}
// Quota: make setItem throw and add a row in Damage Control.
{
  const w = tool('/tools/damage-control/', { 'sc-damage-control': { rows: [], example: {} } });
  w.localStorage.setItem = () => { const e = new Error('QuotaExceededError'); e.name = 'QuotaExceededError'; throw e; };
  Object.defineProperty(w, 'localStorage', { value: w.localStorage });
  const form = w.document.querySelector('[data-entry]');
  form.dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true }));
  w.dispatchEvent(new w.Event('pagehide'));
  note('quota: warning shown', text(w, '.tk-save-warning'));
}
