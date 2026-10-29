// The CX Control Tower's page in jsdom, with the actions store the built page loads before it, for the tests that follow
// a case through the tower, the tracker and 5 Whys. `storage` seeds localStorage (a reload), `session` sessionStorage
// (a hand-off note), `search` the address, `before(w)` runs before the scripts (e.g. a storage that fails).
const fs = require('node:fs');
const { JSDOM } = require('jsdom');

const cfg = fs.readFileSync('src/_data/cxTower.json', 'utf8');
const html = `<html lang="en"><body><div data-cx class="cx"><p data-cx-example-flag hidden></p><p data-cx-note></p>
  <div data-cx-filters hidden><input data-cx-filter="from" type="date"><input data-cx-filter="to" type="date"><select data-cx-filter="DSP"></select><select data-cx-filter="Shift"></select><select data-cx-filter="Zone"></select><button data-cx-reset-filters type="button"></button></div>
  <div data-cx-tabs></div><div data-cx-body id="cx-panel"></div></div><script type="application/json" id="cx-data">${cfg}</script></body></html>`;

const tower = ({ storage = {}, session = {}, search = '', now = '2026-10-28T10:00:00Z', before = null } = {}) => {
  const dom = new JSDOM(html, { url: `https://example.test/tools/cx-control-tower/${search}`, runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  w.eval(`(() => { const Real = Date; const fixed = new Real(${JSON.stringify(now)}); Date = class extends Real { constructor(...args) { super(...(args.length ? args : [fixed])); } static now() { return fixed.getTime(); } }; })();`);
  w.confirm = () => true;
  w.URL.createObjectURL = () => 'blob:x';
  w.URL.revokeObjectURL = () => {};
  Object.entries(storage).forEach(([key, value]) => w.localStorage.setItem(key, value));
  Object.entries(session).forEach(([key, value]) => w.sessionStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value)));
  if (before) before(w);
  for (const file of ['tool-kit', 'docx-kit', 'cv-import', 'pareto', 'actions-store', 'cx-tower']) w.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  const body = w.document.querySelector('[data-cx-body]');
  const click = (node) => node.dispatchEvent(new w.Event('click', { bubbles: true }));
  const field = (name) => body.querySelector(`#cx-case-${name}`);
  const type = (name, value) => { const node = field(name); node.value = value; node.dispatchEvent(new w.Event(node.tagName === 'SELECT' || node.type === 'date' ? 'change' : 'input', { bubbles: true })); };
  const button = (text) => [...body.querySelectorAll('button')].find((b) => b.textContent === text);
  const filter = (key, value) => { const node = w.document.querySelector(`[data-cx-filter="${key}"]`); node.value = value; node.dispatchEvent(new w.Event('change', { bubbles: true })); };
  const stored = () => { w.dispatchEvent(new w.Event('pagehide')); return JSON.parse(w.localStorage.getItem('sc-cx-tower')); };
  const all = () => { w.dispatchEvent(new w.Event('pagehide')); const out = {}; for (let i = 0; i < w.localStorage.length; i++) { const key = w.localStorage.key(i); out[key] = w.localStorage.getItem(key); } return out; };
  const tab = (id) => click(w.document.querySelector(`[data-tab="${id}"]`));
  const note = () => body.querySelector('.cx-case-note').textContent;
  const deepMetric = (id) => { const select = body.querySelector('#cx-deep-metric'); select.value = id; select.dispatchEvent(new w.Event('change', { bubbles: true })); };
  const setValue = (selector, value) => { const node = body.querySelector(selector); node.value = value; node.dispatchEvent(new w.Event('change', { bubbles: true })); };
  return { w, body, click, field, type, button, filter, stored, all, tab, note, deepMetric, setValue, S: w.ActionsStore };
};
// A case on the example station: the deep dive on one failure, 31 Aug – 13 Sep as the evidence, the form filled.
const startCase = (t, id, title, corrective = 'Heavy-first loading sequence with marked shelf zones') => {
  t.tab('deep');
  t.deepMetric(id);
  t.filter('from', '2026-08-31');
  t.filter('to', '2026-09-13');
  t.click(t.button('New investigation'));
  t.type('title', title);
  t.type('problem', `${title}: too many on the evening wave`);
  t.type('evidence', 'Deliveries table, 31 Aug – 13 Sep, every row traceable');
  t.type('rootStatus', 'Verified');
  t.type('root', 'No loading sequence standard');
  t.type('corrective', corrective);
  t.type('owner', 'Shift Leader');
  t.type('deadline', '2026-09-13');
  t.type('verifyMetric', 'Failure rate before and after');
};

module.exports = { tower, startCase };
