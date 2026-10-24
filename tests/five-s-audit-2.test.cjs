// The 5S Audit, round 2 (src/js/five-s-audit.js, src/js/five-s-audit-photos.js): the audit plan (rotation, next due,
// the schedule and its calendar file) and the before and after photos of a question and of a red tag, with an
// in-memory photo store (jsdom has neither IndexedDB nor canvas).
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const nunjucks = require('nunjucks');
const { JSDOM } = require('jsdom');

const plain = (value) => JSON.parse(JSON.stringify(value));
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const script = (name) => fs.readFileSync(`src/js/${name}.js`, 'utf8');
const DATA = { en: 'src/_data/fiveSAudit.json', de: 'src/_data/de/fiveSAudit.json', sq: 'src/_data/sq/fiveSAudit.json' };
const wait = (w, ms = 40) => new Promise((resolve) => w.setTimeout(resolve, ms));
const click = (w, node) => node.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
const type = (w, node, value) => { node.value = value; node.dispatchEvent(new w.Event('input', { bubbles: true })); };

const env = new nunjucks.Environment(new nunjucks.FileSystemLoader('src/_includes'), { autoescape: false });
env.addFilter('t', (text) => text);
env.addFilter('local', (url, lang) => (lang && lang !== 'en' ? `/${lang}${url}` : url));
env.addFilter('assetUrl', (url) => url);
env.addFilter('scriptJson', (value) => JSON.stringify(value).replace(/</g, '\\u003c'));
const partial = (lang) => env.render('partials/five-s-audit.njk', { cfg: read(DATA[lang]), lang: lang === 'en' ? undefined : lang })
  .replace(/<script src=[^>]*><\/script>/g, '');

// An in-memory MediaStore with the same calls, as tests/floor-capture.test.cjs has it.
const FAKE_STORE = `window.MediaStore = (() => {
  const rows = []; let n = 0;
  const list = async (tool, ref) => rows.filter((r) => r.tool === tool && (ref === undefined || r.ref === ref));
  return {
    rows, supported: () => true, list,
    add: async (file, { tool, ref }) => { const r = { id: 'p' + (++n), created: new Date(1e12 + n * 864e5).toISOString(), tool, ref: String(ref), blob: file, width: 10, height: 10 }; rows.push(r); return r; },
    restore: async (r) => { rows.push(r); return r; },
    remove: async (id) => { const i = rows.findIndex((r) => r.id === id); if (i >= 0) rows.splice(i, 1); },
    update: async (id, { ref }) => { const r = rows.find((x) => x.id === id); if (r) r.ref = ref; return r; },
    counts: async (tool) => { const out = {}; (await list(tool)).forEach((r) => { out[r.ref] = (out[r.ref] || 0) + 1; }); return out; },
  };
})();`;

// The page in jsdom at a fixed day (Friday 23 October 2026), with the photo scripts when asked.
const load = ({ lang = 'en', page = true, now = '2026-10-23T10:00:00Z', storage = {}, photos = false, records = [] } = {}) => {
  const base = lang === 'en' ? '' : `/${lang}`;
  const dom = new JSDOM(`<html lang="${lang}"><body><main id="main">${page ? partial(lang) : ''}</main></body></html>`, { url: `https://example.test${base}/tools/five-s-audit/`, runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  w.eval(`(() => { const Real = Date; const fixed = new Real(${JSON.stringify(now)}); Date = class extends Real { constructor(...args) { super(...(args.length ? args : [fixed])); } static now() { return fixed.getTime(); } }; })();`);
  w.confirm = () => true;
  w.printed = 0;
  w.print = () => { w.printed++; };
  w.HTMLElement.prototype.scrollIntoView = () => {};
  w.HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); };
  w.HTMLDialogElement.prototype.close = function () { this.removeAttribute('open'); this.dispatchEvent(new w.Event('close')); };
  w.blobs = [];
  w.URL.createObjectURL = (blob) => { w.blobs.push(blob); return 'blob:https://example.test/x'; };
  w.URL.revokeObjectURL = () => {};
  Object.entries(storage).forEach(([key, value]) => w.localStorage.setItem(key, JSON.stringify(value)));
  for (const file of ['tool-kit', 'chart-kit', 'workplace', 'actions-store', 'five-s-audit']) w.eval(script(file));
  if (photos) {
    w.eval(FAKE_STORE);
    records.forEach((record, i) => w.MediaStore.rows.push({ id: `r${i}`, tool: 'five-s-audit', blob: 'x', width: 10, height: 10, ...record }));
    for (const file of ['floor-capture', 'five-s-audit-photos']) w.eval(script(file));
  }
  return w;
};
const saved = (w, key = 'sc-five-s-audit') => JSON.parse(w.localStorage.getItem(key));
const textOf = (w, blob) => new Promise((resolve) => { const reader = new w.FileReader(); reader.onload = () => resolve(reader.result); reader.readAsText(blob); });

test('the rotation: the next name after the last auditor, never the same person twice in a row', () => {
  const M = load({ page: false }).FiveSMath;
  const team = ['Anna', 'Besnik', 'Clara'];
  assert.equal(M.nextAuditor(team, 'Anna'), 'Besnik');
  assert.equal(M.nextAuditor(team, 'Clara'), 'Anna', 'round the end');
  assert.equal(M.nextAuditor(team, ' besnik '), 'Clara', 'typed names compare without case and spaces');
  assert.equal(M.nextAuditor(team, 'Drita'), 'Anna', 'a last auditor outside the rotation starts it');
  assert.equal(M.nextAuditor(team, ''), 'Anna');
  assert.equal(M.nextAuditor(['Anna'], 'Anna'), 'Anna', 'one name cannot avoid it');
  assert.equal(M.nextAuditor([], 'Anna'), '');
  assert.equal(M.nextAuditor(['', '  '], 'Anna'), '');
  assert.deepEqual(plain(M.rotation(team, 'Besnik', 5)), ['Clara', 'Anna', 'Besnik', 'Clara', 'Anna']);
  assert.deepEqual(plain(M.rotation(['Anna', 'Besnik'], 'Anna', 4)), ['Besnik', 'Anna', 'Besnik', 'Anna']);
  // With two or more names no two neighbours are the same person, the last audit included.
  for (const list of [['A', 'B'], ['A', 'B', 'C'], ['A', 'B', 'C', 'D']]) {
    const run = ['A', ...M.rotation(list, 'A', 12)];
    run.slice(1).forEach((name, i) => assert.notEqual(name, run[i], `${list}: ${run}`));
  }
  assert.deepEqual(plain(M.rotation([], 'A', 3)), []);
});

test('the dates: a week, two weeks, a month with the end of a shorter month', () => {
  const M = load({ page: false }).FiveSMath;
  assert.deepEqual(plain(M.CADENCES), ['weekly', 'biweekly', 'monthly']);
  assert.equal(M.stepDate('2026-10-26', 'weekly'), '2026-11-02');
  assert.equal(M.stepDate('2026-10-26', 'biweekly'), '2026-11-09');
  assert.equal(M.stepDate('2026-10-26', 'monthly'), '2026-11-26');
  assert.equal(M.stepDate('2026-10-26', 'nope'), '2026-11-02', 'an unknown cadence is weekly');
  assert.equal(M.addMonths('2026-01-31', 1), '2026-02-28');
  assert.equal(M.addMonths('2028-01-31', 1), '2028-02-29', 'a leap year');
  assert.equal(M.addMonths('2026-12-15', 1), '2027-01-15');
  assert.equal(M.addMonths('2026-03-31', -1), '2026-02-28');
  assert.equal(M.stepDate('2026-03-23', 'weekly'), '2026-03-30', 'no daylight saving slip');
});

test('next due: one cadence after the last audit of the area, overdue days, the next auditor; today when never audited', () => {
  const M = load({ page: false }).FiveSMath;
  const rows = [
    { id: 'a', date: '2026-10-05', area: 'Dock', auditor: 'Anna' },
    { id: 'b', date: '2026-10-12', area: 'dock ', auditor: 'Besnik' },
    { id: 'c', date: '2026-10-19', area: 'Packing', auditor: 'Clara' },
    { id: 'd', date: '2026-09-30', area: 'Returns', auditor: 'Drita' },
  ];
  const team = ['Anna', 'Besnik', 'Clara'];
  const dock = plain(M.nextAudit({ area: 'Dock', cadence: 'weekly', auditors: team }, rows, '2026-10-23'));
  assert.deepEqual(dock, { area: 'Dock', cadence: 'weekly', last: '2026-10-12', lastAuditor: 'Besnik', due: '2026-10-19', overdue: true, late: 4, auditor: 'Clara' });
  const packing = plain(M.nextAudit({ area: 'Packing', cadence: 'biweekly', auditors: ['Clara', 'Anna'] }, rows, '2026-10-23'));
  assert.deepEqual([packing.due, packing.overdue, packing.late, packing.auditor], ['2026-11-02', false, 0, 'Anna']);
  const returns = plain(M.nextAudit({ area: 'Returns', cadence: 'monthly', auditors: ['Drita', 'Anna'] }, rows, '2026-10-23'));
  assert.deepEqual([returns.due, returns.overdue, returns.auditor], ['2026-10-30', false, 'Anna'], 'Drita audited last: Anna next');
  const fresh = plain(M.nextAudit({ area: 'Outbound', cadence: 'weekly', auditors: team }, rows, '2026-10-23'));
  assert.deepEqual([fresh.last, fresh.due, fresh.overdue, fresh.auditor], ['', '2026-10-23', false, 'Anna'], 'never audited: due today, first name');
  const due = plain(M.nextAudit({ area: 'Dock', cadence: 'weekly', auditors: team }, rows, '2026-10-19'));
  assert.deepEqual([due.overdue, due.late], [false, 0], 'due today is not overdue');
});

test('the schedule: an overdue audit is planned for today, then every cadence with the next name; eight weeks', () => {
  const M = load({ page: false }).FiveSMath;
  const rows = [
    { id: 'a', date: '2026-10-12', area: 'Dock', auditor: 'Anna' },
    { id: 'b', date: '2026-10-19', area: 'Packing', auditor: 'Clara' },
  ];
  const plan = [
    { area: 'Dock', cadence: 'weekly', auditors: ['Anna', 'Besnik'] },
    { area: 'Packing', cadence: 'biweekly', auditors: ['Clara', 'Anna', 'Besnik'] },
    { area: 'Returns', cadence: 'monthly', auditors: [] },
    { area: '  ', cadence: 'weekly', auditors: ['Anna'] },
  ];
  const week = plain(M.schedule(plan, rows, '2026-10-23', 7));
  assert.deepEqual(week.map((e) => [e.date, e.area, e.auditor, e.overdue, e.late]), [
    ['2026-10-23', 'Dock', 'Besnik', true, 4],
    ['2026-10-23', 'Returns', '', false, 0],
  ], 'overdue first; an area without a name is not planned');
  assert.equal(week[0].due, '2026-10-19');
  const eight = plain(M.schedule(plan, rows, '2026-10-23', 56));
  const dock = eight.filter((e) => e.area === 'Dock');
  assert.deepEqual(dock.map((e) => e.date), ['2026-10-23', '2026-10-30', '2026-11-06', '2026-11-13', '2026-11-20', '2026-11-27', '2026-12-04', '2026-12-11']);
  assert.deepEqual(dock.map((e) => e.auditor), ['Besnik', 'Anna', 'Besnik', 'Anna', 'Besnik', 'Anna', 'Besnik', 'Anna']);
  assert.deepEqual(eight.filter((e) => e.area === 'Packing').map((e) => `${e.date} ${e.auditor}`), ['2026-11-02 Anna', '2026-11-16 Besnik', '2026-11-30 Clara', '2026-12-14 Anna']);
  assert.deepEqual(eight.filter((e) => e.area === 'Returns').map((e) => e.date), ['2026-10-23', '2026-11-23']);
  assert.ok(eight.every((e) => e.date >= '2026-10-23' && e.date <= '2026-12-17'));
  assert.deepEqual(eight.map((e) => e.date), [...eight.map((e) => e.date)].sort(), 'in date order');
  assert.deepEqual(plain(M.schedule([], rows, '2026-10-23')), []);
});

test('the calendar file: one all-day entry per audit, escaped, folded at 75 bytes, a stable UID', () => {
  const M = load({ page: false }).FiveSMath;
  const events = [
    { date: '2026-10-26', area: 'Inbound dock', summary: '5S audit: Inbound dock · Besnik', description: '5S Audit\nArea: Inbound dock, east; gate 4', location: 'Inbound dock' },
    { date: '2026-12-31', area: 'Zona e mbledhjes A', summary: `Auditi 5S: ${'ë'.repeat(60)}` },
  ];
  const text = M.ics(events, new Date('2026-10-23T10:00:00Z'));
  assert.ok(text.endsWith('\r\n'));
  const physical = text.split('\r\n').slice(0, -1);
  const octets = (line) => Buffer.byteLength(line, 'utf8');
  assert.ok(physical.every((line) => octets(line) <= 75), 'no line longer than 75 bytes');
  const lines = text.replace(/\r\n /g, '').split('\r\n');
  assert.equal(lines[0], 'BEGIN:VCALENDAR');
  assert.ok(lines.includes('VERSION:2.0'));
  assert.equal(lines.filter((l) => l === 'BEGIN:VEVENT').length, 2);
  assert.equal(lines.filter((l) => l === 'END:VEVENT').length, 2);
  assert.equal(lines.at(-2), 'END:VCALENDAR');
  assert.ok(lines.includes('DTSTART;VALUE=DATE:20261026'));
  assert.ok(lines.includes('DTEND;VALUE=DATE:20261027'), 'all day: the end is the next day');
  assert.ok(lines.includes('DTEND;VALUE=DATE:20270101'), 'over the year end');
  assert.ok(lines.includes('DTSTAMP:20261023T100000Z'));
  assert.ok(lines.includes('SUMMARY:5S audit: Inbound dock · Besnik'));
  assert.ok(lines.includes('DESCRIPTION:5S Audit\\nArea: Inbound dock\\, east\\; gate 4'), 'commas, semicolons and line breaks escaped');
  assert.ok(lines.includes('LOCATION:Inbound dock'));
  assert.ok(lines.includes(`SUMMARY:Auditi 5S: ${'ë'.repeat(60)}`), 'a folded line unfolds whole');
  const uids = lines.filter((l) => l.startsWith('UID:'));
  assert.equal(uids.length, 2);
  assert.equal(uids[0], `UID:${M.uidOf('Inbound dock', '2026-10-26')}`);
  assert.equal(M.uidOf('Inbound dock', '2026-10-26'), M.uidOf(' inbound DOCK', '2026-10-26'), 'the same area and day, the same entry');
  assert.notEqual(M.uidOf('Inbound dock', '2026-10-26'), M.uidOf('Packing', '2026-10-26'));
  assert.match(M.uidOf('Packing', '2026-10-26'), /^five-s-audit-20261026-[a-z0-9]+@stivencatalyst\.com$/);
});

test('before and after: the same question of the same area in an earlier or a later audit, first and last photo', () => {
  const M = load({ page: false }).FiveSMath;
  const rows = [
    { id: 'a1', date: '2026-09-07', area: 'Dock', template: 'warehouse' },
    { id: 'a2', date: '2026-09-14', area: 'Dock', template: 'warehouse' },
    { id: 'a3', date: '2026-09-21', area: 'Dock', template: 'warehouse' },
    { id: 'b1', date: '2026-09-14', area: 'Packing', template: 'warehouse' },
    { id: 'h1', date: '2026-09-21', area: 'Dock', template: 'hotel' },
  ];
  const records = [
    { id: 'p1', ref: 'a1|sort-0', created: '2026-09-07T08:00:00Z' },
    { id: 'p2', ref: 'a1|sort-0', created: '2026-09-07T08:05:00Z' },
    { id: 'p3', ref: 'a3|sort-0', created: '2026-09-21T08:00:00Z' },
    { id: 'p4', ref: 'a3|sort-0', created: '2026-09-21T08:09:00Z' },
    { id: 'p5', ref: 'a3|set-1', created: '2026-09-21T08:10:00Z' },
    { id: 'p6', ref: 'b1|sort-0', created: '2026-09-14T08:00:00Z' },
    { id: 'p7', ref: 'h1|sort-0', created: '2026-09-21T09:00:00Z' },
    { id: 'p8', ref: 'draft|warehouse|sort-0', created: '2026-09-22T09:00:00Z' },
  ];
  const ids = (pairs) => plain(pairs).map((p) => [p.qid, p.before.audit.id, p.before.photo.id, p.after.audit.id, p.after.photo.id]);
  assert.deepEqual(ids(M.photoPairs(rows, records, 'a3')), [['sort-0', 'a1', 'p1', 'a3', 'p4']], 'the later audit is the after; set-1 has no partner');
  assert.deepEqual(ids(M.photoPairs(rows, records, 'a1')), [['sort-0', 'a1', 'p1', 'a3', 'p4']], 'from the earlier audit: its first later partner');
  assert.deepEqual(ids(M.photoPairs(rows, records, 'a2')), [], 'no photos, no pair');
  assert.deepEqual(ids(M.photoPairs(rows, records, 'b1')), [], 'another area does not pair');
  assert.deepEqual(ids(M.photoPairs(rows, records, 'h1')), [], 'another checklist asks another question');
  assert.deepEqual(ids(M.photoPairs(rows, records, 'a3', 'set-1')), []);
  assert.deepEqual(ids(M.photoPairs(rows, records, 'a3', 'sort-0')).length, 1);
  assert.deepEqual(ids(M.photoPairs(rows, records, 'nope')), []);
  // A red tag: its photo under its id, the after under "id|after".
  const tags = [{ id: 't1', ref: 't1', created: '2026-09-01T08:00:00Z' }, { id: 't2', ref: 't1|after', created: '2026-09-09T08:00:00Z' }, { id: 't3', ref: 't1|after', created: '2026-09-09T09:00:00Z' }];
  assert.deepEqual(plain(M.tagPair(tags, 't1')), { before: tags[0], after: tags[2] });
  assert.equal(M.tagPair(tags.slice(0, 1), 't1'), null, 'no after photo yet');
  assert.equal(M.TAG_AFTER, '|after');
});

test('the data files: the cadences, the new texts and an example plan in all three languages', () => {
  const en = read(DATA.en);
  for (const lang of Object.keys(DATA)) {
    const cfg = read(DATA[lang]);
    assert.deepEqual(Object.keys(cfg.cadences), ['weekly', 'biweekly', 'monthly'], lang);
    assert.ok(Object.values(cfg.cadences).every((name) => typeof name === 'string' && name.trim()));
    assert.ok(cfg.text.auditorsPlaceholder && /^[a-z0-9-]+$/.test(cfg.text.icsName), lang);
    const plan = cfg.example.plan;
    assert.equal(plan.length, en.example.plan.length);
    plan.forEach((entry, i) => {
      assert.ok(cfg.templates[cfg.example.template].areas.includes(entry.area), `${lang}: ${entry.area}`);
      assert.equal(entry.cadence, en.example.plan[i].cadence);
      assert.deepEqual(entry.auditors, en.example.plan[i].auditors, 'the names are the same people');
    });
    const audited = new Set(cfg.example.audits.map((a) => a.area));
    assert.equal(plan.filter((entry) => !audited.has(entry.area)).length, 1, 'one planned area is not audited yet');
  }
  const parts = read('src/_data/i18n-parts/five-s-audit-2.json');
  assert.deepEqual(Object.keys(parts.de).sort(), Object.keys(parts.sq).sort());
  for (const lang of ['de', 'sq']) {
    const ui = read(`src/_data/${lang}/ui.json`);
    for (const [text, translation] of Object.entries(parts[lang])) {
      assert.ok(translation && translation !== text, `${lang}: "${text}"`);
      // Once merged into ui.json, the site's translation must be this one.
      if (text in ui) assert.equal(ui[text], translation, `${lang}: "${text}" differs in ui.json`);
      for (const name of text.match(/\{\w+\}/g) || []) assert.ok(translation.includes(name), `${lang}: "${text}" loses ${name}`);
    }
  }
  assert.match(JSON.stringify(parts.sq), /[ëç]/);
});

test('the example opens on a plan: next due and auditor per area, this week, the month and the calendar file', async () => {
  const w = load();
  const doc = w.document;
  const rows = [...doc.querySelectorAll('[data-plan-rows] .fs-plan-row')];
  assert.equal(rows.length, 4);
  assert.equal(doc.querySelector('[data-plan-empty]').hidden, true);
  const inbound = rows[0];
  assert.equal(inbound.querySelector('input[data-plan-field="area"]').value, 'Inbound dock');
  assert.equal(doc.querySelector(`label[for="${inbound.querySelector('input[data-plan-field="auditors"]').id}"]`).textContent, 'Auditors, in turn');
  assert.match(inbound.querySelector('.fs-plan-next').textContent, /Last audit 2026-10-19 \(Anna\) · Next due 2026-10-26 · Next auditor: Besnik/);
  assert.match(rows[3].querySelector('.fs-plan-next').textContent, /Not audited yet · Due today · Next auditor: Anna/);
  assert.equal(doc.querySelector('[data-plan-view]').hidden, false);
  assert.match(doc.querySelector('[data-plan-count]').textContent, /4 areas planned/);
  const due = [...doc.querySelectorAll('[data-plan-due] li')];
  assert.deepEqual(due.map((li) => li.querySelector('.fs-due-text').textContent.split(' · ').slice(0, 2).join(' · ')), ['Returns · Anna', 'Inbound dock · Besnik', 'Packing · Anna']);
  // The month: three walks done on each of three Mondays, the plan on 23 and 26 October; who and where in the tip.
  const calendar = doc.querySelector('[data-plan-calendar] svg.ck-chart');
  assert.ok(calendar, 'a calendar of the month');
  const tips = [...calendar.querySelectorAll('[data-tip]')].map((g) => g.getAttribute('data-tip'));
  const day26 = tips.find((tip) => tip.startsWith('2026-10-26'));
  assert.match(day26, /Planned: Inbound dock · Besnik/);
  assert.match(day26, /Planned: Packing · Anna/);
  assert.match(tips.find((tip) => tip.startsWith('2026-10-19')), /Audited: Packing · Clara/);
  assert.equal(doc.querySelector('[data-results]').querySelectorAll('svg.ck-chart').length, 3, 'the result keeps its three charts');
  click(w, doc.querySelector('[data-plan-month="1"]'));
  assert.equal(doc.querySelector('[data-plan-month="1"]').getAttribute('aria-pressed'), 'true');
  assert.match(doc.querySelector('[data-plan-calendar] svg title, [data-plan-calendar] svg').textContent, /Nov 2026/);

  // The calendar file: the next eight weeks.
  click(w, doc.querySelector('[data-plan-ics]'));
  const blob = w.blobs.at(-1);
  assert.match(blob.type, /^text\/calendar/);
  const text = (await textOf(w, blob)).replace(/\r\n /g, '');
  assert.equal(text.match(/BEGIN:VEVENT/g).length, 22, '8 + 8 weekly, 4 every two weeks, 2 monthly');
  assert.match(text, /SUMMARY:5S audit: Returns · Anna\r\n/);
  assert.match(text, /DTSTART;VALUE=DATE:20261023/);
  assert.match(doc.querySelector('[data-plan-status]').textContent, /22 audits in the calendar file/);
  assert.equal(saved(w), null, 'nothing is written by looking at it');

  // Start this audit: the walk gets the area and the auditor.
  click(w, doc.querySelectorAll('[data-plan-due] [data-plan-start]')[1]);
  assert.equal(doc.querySelector('#fs-area').value, 'Inbound dock');
  assert.equal(doc.querySelector('#fs-auditor').value, 'Besnik');
  assert.equal(saved(w).draft.area, 'Inbound dock');
  assert.match(doc.querySelector('[data-audit-status]').textContent, /set for Inbound dock with Besnik/);
});

test('the plan is edited, kept, and leaves with the example unless it was changed', () => {
  const w = load({ lang: 'de' });
  const doc = w.document;
  // Clearing the example takes its plan along.
  click(w, doc.querySelector('.dl-example-note button'));
  assert.equal(doc.querySelectorAll('[data-plan-rows] .fs-plan-row').length, 0);
  assert.equal(doc.querySelector('[data-plan-empty]').hidden, false);
  assert.equal(doc.querySelector('[data-plan-view]').hidden, true);
  click(w, doc.querySelector('[data-plan-add]'));
  const row = doc.querySelector('[data-plan-rows] .fs-plan-row');
  assert.equal(doc.activeElement, row.querySelector('input[data-plan-field="area"]'), 'the new area has the focus');
  type(w, row.querySelector('input[data-plan-field="area"]'), 'Halle 3');
  type(w, row.querySelector('input[data-plan-field="auditors"]'), 'Anna, Besnik;  anna');
  const cadence = row.querySelector('select[data-plan-field="cadence"]');
  cadence.value = 'monthly';
  cadence.dispatchEvent(new w.Event('change', { bubbles: true }));
  const state = saved(w, 'sc-five-s-audit-de');
  assert.equal(state.plan.length, 1);
  assert.deepEqual([state.plan[0].area, state.plan[0].cadence, state.plan[0].auditors], ['Halle 3', 'monthly', ['Anna', 'Besnik', 'anna']]);
  assert.equal(state.planExample, false);
  assert.match(row.querySelector('.fs-plan-next').textContent, /Not audited yet · Due today · Next auditor: Anna/);
  assert.equal(doc.querySelectorAll('[data-plan-due] li').length, 1);
  // Removing it says so, with undo.
  click(w, row.querySelector('[data-plan-remove]'));
  assert.equal(saved(w, 'sc-five-s-audit-de').plan.length, 0);
  click(w, doc.querySelector('[data-plan-status] .dl-undo'));
  assert.equal(saved(w, 'sc-five-s-audit-de').plan.length, 1);
  // A reload keeps it.
  const again = load({ lang: 'de', storage: { 'sc-five-s-audit-de': saved(w, 'sc-five-s-audit-de') } });
  assert.equal(again.document.querySelector('[data-plan-rows] input[data-plan-field="area"]').value, 'Halle 3');

  // An example plan that was changed stays when the example leaves.
  const v = load({ lang: 'en' });
  type(v, v.document.querySelector('[data-plan-rows] input[data-plan-field="auditors"]'), 'Anna, Drita');
  click(v, v.document.querySelector('.dl-example-note button'));
  assert.equal(saved(v).plan.length, 4);
  assert.deepEqual(saved(v).plan[0].auditors, ['Anna', 'Drita']);
});

test('plan the known areas: the workplace areas with their owners, and the people to add', () => {
  const w = load({ storage: { 'sc-workplace': { areas: [{ name: 'Dock 1', owner: 'Besnik' }, 'Dock 2'], teams: ['Inbound team'] }, 'sc-five-s-audit': { rows: [], tags: [] } } });
  const doc = w.document;
  assert.equal(doc.querySelectorAll('[data-plan-rows] .fs-plan-row').length, 0);
  click(w, doc.querySelector('[data-plan-known]'));
  const plan = saved(w).plan;
  assert.deepEqual(plan.map((entry) => [entry.area, entry.cadence, entry.auditors]), [['Dock 1', 'weekly', ['Besnik']], ['Dock 2', 'weekly', []]]);
  assert.match(doc.querySelector('[data-plan-status]').textContent, /2 areas added/);
  click(w, doc.querySelector('[data-plan-known]'));
  assert.match(doc.querySelector('[data-plan-status]').textContent, /already/);
  // The second area adds a person from the profile.
  const pick = doc.querySelectorAll('[data-plan-rows] [data-plan-pick]')[1];
  assert.deepEqual([...pick.options].map((o) => o.value), ['', 'Besnik', 'Inbound team']);
  pick.value = 'Besnik';
  pick.dispatchEvent(new w.Event('change', { bubbles: true }));
  assert.deepEqual(saved(w).plan[1].auditors, ['Besnik']);
  assert.equal(doc.querySelectorAll('[data-plan-rows] input[data-plan-field="auditors"]')[1].value, 'Besnik');
});

// Two walks of the inbound dock a week apart, the first sort question photographed in both; a red tag with a photo.
const SCORES = (first) => ({ sort: [first, 2, 3, 3], set: [2, 2, 3, 3], shine: [3, 3, 3, 3], standardize: [3, 3, 3, 3], sustain: [3, 3, 3, 3] });
const audits = () => ({
  rows: [
    { id: 'a1', date: '2026-10-12', area: 'Inbound dock', auditor: 'Anna', shift: 'Early', scope: '5S', template: 'warehouse', scores: SCORES(0), notes: { 'sort-0': 'Pallets in the walkway' } },
    { id: 'a2', date: '2026-10-19', area: 'Inbound dock', auditor: 'Besnik', shift: 'Early', scope: '5S', template: 'warehouse', scores: SCORES(2), notes: {} },
  ],
  tags: [{ id: 't1', date: '2026-10-12', area: 'Inbound dock', item: 'Bent pallet jack', reason: 'Broken', decision: 'Return', owner: 'Besnik', due: '2026-10-19', done: false }],
  view: 'a2',
});
const RECORDS = [
  { ref: 'a1|sort-0', created: '2026-10-12T07:00:00.000Z' },
  { ref: 'a2|sort-0', created: '2026-10-19T07:00:00.000Z' },
  { ref: 't1', created: '2026-10-12T07:30:00.000Z' },
];

test('before and after in the log and the weakest questions: side by side with dates and scores, printed on A4', async () => {
  const w = load({ photos: true, storage: { 'sc-five-s-audit': audits() }, records: RECORDS });
  const doc = w.document;
  await wait(w);
  const tr = doc.querySelector('[data-show="a2"]').closest('tr');
  assert.equal(tr.querySelector('.fc-row-photos').textContent, 'Photos · 1', 'the photo button comes first, as before');
  const pairButton = tr.querySelector('.fs-ba-button');
  assert.equal(pairButton.textContent, 'Before / after');
  assert.ok(doc.querySelector('[data-show="a1"]').closest('tr').querySelector('.fs-ba-button'), 'the earlier audit offers it too');
  // The weakest questions of the audit shown (a2): the first sort question at 2 has its pair.
  const bar = doc.querySelector('.fs-panel-weak .dl-bar[data-qid="sort-0"]');
  assert.ok(bar.querySelector('.fs-ba-button'));
  assert.equal(doc.querySelector('.fs-panel-weak .dl-bar[data-qid="sort-1"] .fs-ba-button'), null, 'no photos, no button');

  click(w, pairButton);
  const dialog = doc.querySelector('.fs-ba-dialog');
  assert.ok(dialog.hasAttribute('open'));
  assert.equal(dialog.querySelector('h2').textContent, 'Inbound dock · Before / after');
  const sides = [...dialog.querySelectorAll('.fs-ba-side figcaption')].map((c) => c.textContent);
  assert.deepEqual(sides, ['Before · 2026-10-12 · Score 0 / 4 · Anna', 'After · 2026-10-19 · Score 2 / 4 · Besnik']);
  assert.equal(dialog.querySelectorAll('.fs-ba-side img').length, 2);
  assert.match(dialog.querySelector('.fs-ba-pair h3').textContent, /^Sort 1 · /);
  assert.equal(dialog.querySelector('.fs-ba-change').textContent, 'Score 0 → 2 of 4');
  click(w, [...dialog.querySelectorAll('button')].find((b) => b.textContent === 'Print for the team board'));
  await wait(w, 10);
  assert.equal(w.printed, 1);
  const sheet = doc.querySelector('body > .fs-ba-sheet');
  assert.ok(sheet && doc.documentElement.classList.contains('fs-ba-print'), 'the A4 sheet is what prints');
  assert.equal(sheet.querySelectorAll('.fs-ba-side').length, 2);
  w.dispatchEvent(new w.Event('afterprint'));
  assert.equal(doc.querySelector('.fs-ba-sheet'), null);
  assert.equal(doc.documentElement.classList.contains('fs-ba-print'), false);
  click(w, dialog.querySelector('.fc-close'));
  assert.equal(dialog.hasAttribute('open'), false);
});

test('a red tag gets a photo, the after photo when it is done, and then its before and after', async () => {
  const w = load({ photos: true, storage: { 'sc-five-s-audit': audits() }, records: RECORDS });
  const doc = w.document;
  await wait(w);
  const cell = () => doc.querySelector('[data-tags] tr').cells[3];
  assert.equal(cell().querySelector('.fc-row-photos').textContent, 'Photos · 1');
  assert.equal(cell().querySelector('.fs-ba-button'), null, 'no after photo yet');
  assert.equal(cell().firstChild.nodeValue, 'Bent pallet jack', 'the item text is unchanged');
  const box = doc.querySelector('[data-tags] [data-done]');
  box.checked = true;
  box.dispatchEvent(new w.Event('change', { bubbles: true }));
  const status = doc.querySelector('[data-tag-status]');
  assert.match(status.textContent, /Red tag Bent pallet jack is done/);
  click(w, status.querySelector('.fs-photo-offer'));
  await wait(w);
  const gallery = doc.querySelector('.fc-gallery');
  assert.ok(gallery.hasAttribute('open'));
  assert.deepEqual([...gallery.querySelectorAll('.fc-gallery-entry h3')].map((h) => h.textContent), ['Before', 'After, when done']);
  // The after photo, taken in the second section.
  const input = gallery.querySelectorAll('.fc-gallery-entry')[1].querySelector('input[type="file"]');
  Object.defineProperty(input, 'files', { value: [new w.File(['y'], 'after.jpg', { type: 'image/jpeg' })], configurable: true });
  input.dispatchEvent(new w.Event('change'));
  await wait(w);
  assert.ok(w.MediaStore.rows.some((r) => r.ref === 't1|after'));
  click(w, gallery.querySelector('.fc-close'));
  await wait(w);
  assert.equal(cell().querySelector('.fc-row-photos').textContent, 'Photos · 2');
  click(w, cell().querySelector('.fs-ba-button'));
  const dialog = doc.querySelector('.fs-ba-dialog');
  assert.deepEqual([...dialog.querySelectorAll('.fs-ba-side figcaption strong')].map((s) => s.textContent), ['Before', 'After']);
  assert.match(dialog.querySelector('.fs-ba-pair h3').textContent, /Inbound dock · Bent pallet jack/);
});

test('removing an audit or a red tag offers to remove its photos; undo puts the entry and its photos back', async () => {
  const w = load({ photos: true, storage: { 'sc-five-s-audit': audits() }, records: RECORDS });
  const doc = w.document;
  await wait(w);
  const refs = () => plain(w.MediaStore.rows.map((r) => r.ref).sort());
  click(w, doc.querySelector('[data-show="a1"]').closest('tr').querySelector('[data-remove]'));
  await wait(w);
  const status = doc.querySelector('[data-log-status]');
  assert.match(status.textContent, /Removed the audit of Inbound dock/);
  assert.ok(status.querySelector('.dl-undo'), 'the undo of the audit stays');
  const offer = status.querySelector('.fs-photo-offer');
  assert.equal(offer.textContent, 'Also remove its 1 photos');
  click(w, offer);
  await wait(w);
  assert.deepEqual(refs(), ['a2|sort-0', 't1']);
  assert.match(status.textContent, /1 photos removed/);
  click(w, status.querySelector('.dl-undo'));
  await wait(w);
  assert.equal(saved(w).rows.length, 2, 'the audit is back');
  assert.deepEqual(refs(), ['a1|sort-0', 'a2|sort-0', 't1'], 'and its photo');
  // Removing without taking the offer keeps the photos.
  click(w, doc.querySelector('[data-show="a2"]').closest('tr').querySelector('[data-remove]'));
  await wait(w);
  assert.equal(refs().length, 3);
  // A red tag.
  click(w, doc.querySelector('[data-tags] [data-remove-tag]'));
  await wait(w);
  const tagStatus = doc.querySelector('[data-tag-status]');
  click(w, tagStatus.querySelector('.fs-photo-offer'));
  await wait(w);
  assert.deepEqual(refs(), ['a1|sort-0', 'a2|sort-0']);
  assert.equal(saved(w).tags.length, 0);
});
