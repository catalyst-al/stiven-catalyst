// The Room Inspection (src/js/room-inspection.js): the scoring in window.RoomInspectionMath (weights, critical items,
// the pass mark, re-checks, the rates per group, the Pareto of the faults, the heat map), the room list and its
// parsing, the seeded example, the three data files, and the page itself: the example on a first visit, an inspection
// answered and saved with its maintenance item in the Action Tracker, the Pareto hand-off and the CSV.
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const nunjucks = require('nunjucks');
const { JSDOM } = require('jsdom');

const plain = (value) => JSON.parse(JSON.stringify(value));
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const DATA = { en: 'src/_data/roomInspection.json', de: 'src/_data/de/roomInspection.json', sq: 'src/_data/sq/roomInspection.json' };
const ZONES = read(DATA.en).zones.map((zone) => zone.key);

// The partial rendered the way the site does it, with the filters stubbed (English text, no asset hashes).
const env = new nunjucks.Environment(new nunjucks.FileSystemLoader('src/_includes'), { autoescape: false });
env.addFilter('t', (text) => text);
env.addFilter('local', (url, lang) => (lang && lang !== 'en' ? `/${lang}${url}` : url));
env.addFilter('assetUrl', (url) => url);
env.addFilter('scriptJson', (value) => JSON.stringify(value).replace(/</g, '\\u003c'));
const partial = (lang) => env.render('partials/room-inspection.njk', { cfg: read(DATA[lang]), lang: lang === 'en' ? undefined : lang })
  .replace(/<script src=[^>]*><\/script>/g, '');

const load = ({ lang = 'en', page = true, now = '2026-10-24T09:30:00Z', storage = {} } = {}) => {
  const base = lang === 'en' ? '' : `/${lang}`;
  const html = `<html lang="${lang}"><body><main id="main">${page ? partial(lang) : ''}</main></body></html>`;
  const dom = new JSDOM(html, { url: `https://example.test${base}/tools/room-inspection/`, runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  w.eval(`(() => { const Real = Date; const fixed = new Real(${JSON.stringify(now)}); Date = class extends Real { constructor(...args) { super(...(args.length ? args : [fixed])); } static now() { return fixed.getTime(); } }; })();`);
  w.confirm = () => true;
  w.print = () => {};
  w.HTMLElement.prototype.scrollIntoView = () => {};
  Object.entries(storage).forEach(([key, value]) => w.localStorage.setItem(key, JSON.stringify(value)));
  for (const file of ['tool-kit', 'chart-kit', 'actions-store', 'template-pack', 'room-inspection']) w.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  return w;
};
const saved = (w, key = 'sc-room-inspection') => JSON.parse(w.localStorage.getItem(key));
const click = (w, node) => node.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
const choose = (w, input) => { input.checked = true; input.dispatchEvent(new w.Event('change', { bubbles: true })); };
const type = (w, input, value) => { input.value = value; input.dispatchEvent(new w.Event('input', { bubbles: true })); input.dispatchEvent(new w.Event('change', { bubbles: true })); };

// The shape of a value: object keys and array lengths, not the words (they are translated).
const shape = (value) => (Array.isArray(value) ? value.map(shape) : value && typeof value === 'object'
  ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, shape(value[key])])) : typeof value);

test('the three data files share one shape, the same weights and example, and their own storage key', () => {
  const en = read(DATA.en);
  assert.equal(en.storageKey, 'sc-room-inspection');
  assert.equal(en.threshold, 0.9);
  for (const lang of ['de', 'sq']) {
    const other = read(DATA[lang]);
    assert.equal(other.storageKey, `sc-room-inspection-${lang}`, `${lang} keeps its own work`);
    assert.deepEqual(shape(other), shape(en), `${lang} shape`);
    assert.deepEqual(other.zones.map((z) => z.key), en.zones.map((z) => z.key));
    assert.deepEqual(other.roomTypes.map((t) => t.key), en.roomTypes.map((t) => t.key));
    assert.deepEqual(other.kinds.map((k) => k.key), en.kinds.map((k) => k.key));
    for (const [key, tpl] of Object.entries(en.templates)) {
      const mine = other.templates[key];
      assert.deepEqual(mine.roomTypes, tpl.roomTypes);
      for (const zone of ZONES) {
        assert.deepEqual(mine.questions[zone].map(({ weight, critical, fix }) => ({ weight, critical, fix })), tpl.questions[zone].map(({ weight, critical, fix }) => ({ weight, critical, fix })), `${lang} ${key} ${zone}`);
        mine.questions[zone].forEach((item, i) => assert.notEqual(item.text, '', `${lang} ${key} ${zone} ${i}`));
      }
    }
    const { notes: a, ...restEn } = en.example;
    const { notes: b, ...restOther } = other.example;
    assert.deepEqual(restOther, restEn, `${lang}: the example's numbers are the same`);
    assert.deepEqual(Object.keys(b), Object.keys(a));
    assert.equal(other.tips.length, en.tips.length);
  }
});

test('every checklist has 3 to 6 items per zone it uses, critical items weigh 3, and the rooms have a checklist', () => {
  for (const lang of Object.keys(DATA)) {
    const cfg = read(DATA[lang]);
    assert.deepEqual(Object.keys(cfg.templates), ['standard', 'suite', 'public']);
    assert.deepEqual(ZONES, ['entrance', 'bed', 'bathroom', 'desk', 'minibar', 'windows', 'air', 'general']);
    for (const [name, tpl] of Object.entries(cfg.templates)) {
      const used = ZONES.filter((zone) => tpl.questions[zone].length);
      if (name !== 'public') assert.equal(used.length, 8, `${lang} ${name}: every zone`);
      for (const zone of used) {
        const n = tpl.questions[zone].length;
        assert.ok(n >= 3 && n <= 6, `${lang} ${name} ${zone}: ${n} items`);
        tpl.questions[zone].forEach((item) => {
          assert.ok([1, 2, 3].includes(item.weight));
          assert.ok(['reclean', 'maintenance'].includes(item.fix));
          if (item.critical) assert.equal(item.weight, 3);
        });
      }
      assert.ok(ZONES.some((zone) => tpl.questions[zone].some((item) => item.critical)), `${lang} ${name} has critical items`);
    }
    assert.equal(cfg.templates.standard.questions.bathroom[0].critical, true, 'hair in the bathroom fails the room');
    assert.equal(cfg.templates.standard.questions.bed[0].critical, true, 'stains on the linen fail the room');
    cfg.roomTypes.forEach((type) => assert.ok(Object.values(cfg.templates).some((tpl) => tpl.roomTypes.includes(type.key)), `${lang}: ${type.key} has a checklist`));
    cfg.zones.forEach((zone) => {
      assert.ok(zone.meaning && zone.question, `${lang} ${zone.key} advice`);
      assert.equal(zone.moves.length, 3);
    });
  }
});

test('the score: weights of the judged items, n.a. left out, a critical fault or the pass mark fails the room', () => {
  const M = load({ page: false }).RoomInspectionMath;
  const tpl = { questions: { bed: [{ text: 'Linen', weight: 3, critical: true }, { text: 'Made', weight: 2 }], bathroom: [{ text: 'Mirror', weight: 1 }, { text: '', weight: 2 }, { text: 'Tap', weight: 2, fix: 'maintenance' }] } };
  const items = plain(M.itemsOf(tpl, ['bed', 'bathroom']));
  assert.deepEqual(items.map((i) => i.qid), ['bed-0', 'bed-1', 'bathroom-0', 'bathroom-2'], 'an item without text is not asked, the others keep their place');
  assert.equal(items[3].fix, 'maintenance');
  const s = plain(M.score({ 'bed-0': 'pass', 'bed-1': 'fail', 'bathroom-0': 'na', 'bathroom-2': 'pass' }, items));
  assert.equal(s.pct, 5 / 7);
  assert.deepEqual([s.pass, s.fail, s.na, s.open, s.total], [2, 1, 1, 0, 4]);
  assert.deepEqual(s.failed, ['bed-1']);
  assert.deepEqual(plain(M.verdict(s, 0.9)), { pass: false, reason: 'score' });
  assert.deepEqual(plain(M.verdict(s, 0.7)), { pass: true, reason: '' });
  const critical = M.score({ 'bed-0': 'fail', 'bed-1': 'pass', 'bathroom-0': 'pass', 'bathroom-2': 'pass' }, items);
  assert.equal(critical.pct, 5 / 8);
  assert.deepEqual(plain(M.verdict(M.score({ 'bed-0': 'fail' }, items), 0)), { pass: false, reason: 'critical' }, 'a critical fault fails the room whatever the score');
  assert.deepEqual(plain(M.verdict(M.score({}, items), 0.9)), { pass: null, reason: '' }, 'nothing judged: no verdict');
  assert.deepEqual(plain(M.verdict(M.score({ 'bed-0': 'pass', 'bed-1': 'pass', 'bathroom-0': 'pass', 'bathroom-2': 'pass' }, items), 1)), { pass: true, reason: '' }, 'the pass mark itself passes');
  assert.deepEqual(['x', 'pass', 'na'].map((a) => M.score({ 'bed-1': a }, items).answered), [0, 1, 0]);
  assert.deepEqual([{ weight: 1 }, { weight: 2 }, { weight: 3 }, { weight: 2, critical: true }].map(M.priorityOf), ['Low', 'Medium', 'High', 'High']);
  assert.deepEqual([0, 1, 2.4, 3, 7, 'x'].map(M.weightOf), [1, 1, 2, 3, 1, 1]);
  assert.equal(M.mondayOf('2026-10-24'), '2026-10-19');
  assert.equal(M.mondayOf('2026-10-19'), '2026-10-19');
});

test('re-checks, rates per group, the weekly trend, the Pareto of the faults and the heat map', () => {
  const M = load({ page: false }).RoomInspectionMath;
  const items = M.itemsOf({ questions: { bed: [{ text: 'Linen', weight: 3, critical: true }, { text: 'Made', weight: 2 }], bathroom: [{ text: 'Hair', weight: 3, critical: true }] } }, ['bed', 'bathroom']);
  const row = (date, time, room, floor, attendant, answers) => ({ date, time, room, floor, attendant, template: 't', answers, flags: { 'bed-1': 'maintenance' } });
  const rows = [
    row('2026-10-20', '10:00', '101', '1', 'Ana', { 'bed-0': 'pass', 'bed-1': 'pass', 'bathroom-0': 'fail' }),
    row('2026-10-20', '10:40', '101', '1', 'Ana', { 'bed-0': 'pass', 'bed-1': 'pass', 'bathroom-0': 'pass' }),
    row('2026-10-20', '09:00', '201', '2', 'Ilir', { 'bed-0': 'pass', 'bed-1': 'fail', 'bathroom-0': 'pass' }),
    row('2026-10-12', '11:00', '102', '1', 'Ana', { 'bed-0': 'pass', 'bed-1': 'pass', 'bathroom-0': 'pass' }),
    row('2026-10-21', '11:00', '101', '1', 'Ana', { 'bed-0': 'pass', 'bed-1': 'pass', 'bathroom-0': 'fail' }),
  ];
  const a = M.annotate(rows, () => items, 0.9);
  assert.deepEqual(plain(a.map((r) => `${r.date} ${r.time}`)), ['2026-10-12 11:00', '2026-10-20 09:00', '2026-10-20 10:00', '2026-10-20 10:40', '2026-10-21 11:00'], 'in time order');
  assert.deepEqual(plain(a.map((r) => r.pass)), [true, false, false, true, false]);
  assert.deepEqual(plain(a.map((r) => r.recheck)), [false, false, false, true, false], 'the same room again on the day it failed is a re-check; the next day is a new first inspection');
  assert.deepEqual(plain(a.map((r) => r.maintenance)), [0, 1, 0, 0, 0]);
  assert.deepEqual(plain(a.map((r) => r.recleans)), [0, 0, 1, 0, 1]);
  const ana = plain(M.rateBy(a, (r) => r.attendant).find((g) => g.key === 'Ana'));
  assert.deepEqual([ana.n, ana.first, ana.firstPass, ana.rate], [4, 3, 1, 1 / 3]);
  const all = plain(M.overall(a));
  assert.deepEqual([all.n, all.first, all.firstPass], [5, 4, 1]);
  assert.deepEqual(plain(M.weekly(a)).map((w) => [w.week, w.n, w.first]), [['2026-10-12', 1, 1], ['2026-10-19', 4, 3]]);
  const p = plain(M.itemPareto(a));
  assert.deepEqual(p.map((x) => [x.key, x.count]), [['t|bathroom-0', 2], ['t|bed-1', 1]]);
  assert.deepEqual(p.map((x) => x.cum), [2 / 3, 1]);
  assert.deepEqual(p.map((x) => x.vital), [true, true], 'the item that crosses 80 % is one of the vital few');
  const h = plain(M.heat(a, () => items));
  assert.deepEqual(h.floors, ['1', '2']);
  assert.deepEqual(h.cells['1|bathroom'], { fail: 2, answered: 4 });
  assert.deepEqual(h.cells['2|bed'], { fail: 1, answered: 2 });
});

test('rooms: generated by floor and number, merged, pasted in any shape, and the team with its floors', () => {
  const M = load({ page: false }).RoomInspectionMath;
  const types = read(DATA.de).roomTypes;
  const rooms = plain(M.generateRooms({ floorFrom: 1, floorTo: 6, roomFrom: 1, roomTo: 30, type: 'double' }));
  assert.equal(rooms.length, 180);
  assert.deepEqual(rooms[0], { number: '101', floor: '1', type: 'double' });
  assert.deepEqual(rooms.at(-1), { number: '630', floor: '6', type: 'double' });
  const suites = M.generateRooms({ floorFrom: 6, floorTo: 1, roomFrom: 30, roomTo: 29, type: 'suite' });
  assert.equal(suites.length, 12, 'the order of from and to does not matter');
  const merged = plain(M.mergeRooms(rooms, suites));
  assert.equal(merged.length, 180);
  assert.equal(merged.find((r) => r.number === '429').type, 'suite');
  assert.equal(M.generateRooms({ floorFrom: NaN, floorTo: 2, roomFrom: 1, roomTo: 2, type: 'single' }).length, 0);
  assert.deepEqual(['412', '1203', '7', 'A12', '05'].map(M.floorOf), ['4', '12', '', '', '']);
  const pasted = plain(M.parseRooms('Zimmer;Etage;Typ\n412; 4; Suite\n413\n414 Doppelzimmer\n\n1203\tbarrierefrei\nA12 2 einzel', types));
  assert.equal(pasted.skipped, 1, 'the header line');
  assert.deepEqual(pasted.rooms, [
    { number: '412', floor: '4', type: 'suite' },
    { number: '413', floor: '4', type: 'double' },
    { number: '414', floor: '4', type: 'double' },
    { number: '1203', floor: '12', type: 'accessible' },
    { number: 'A12', floor: '2', type: 'single' },
  ]);
  const team = plain(M.parseNames('Marta; 1, 2\nIlir;3\n\nmarta\nJonas'));
  assert.deepEqual(team, [{ name: 'Marta', floors: ['1', '2'] }, { name: 'Ilir', floors: ['3'] }, { name: 'Jonas', floors: [] }]);
  assert.equal(M.namesText(team), 'Marta; 1, 2\nIlir; 3\nJonas');
});

test('the example: two weeks of a 180-room hotel, six attendants, about 120 inspections, one new attendant and the bathroom on top', () => {
  const M = load({ page: false }).RoomInspectionMath;
  const cfg = read(DATA.en);
  const ex = plain(M.exampleData(cfg.example, cfg.templates, ZONES, '2026-10-24', cfg.threshold));
  assert.equal(ex.rooms.length, 180);
  assert.equal(ex.attendants.length, 6);
  assert.ok(ex.rows.length >= 110 && ex.rows.length <= 130, `${ex.rows.length} inspections`);
  assert.equal(ex.rows.at(-1).date, '2026-10-24', 'the last day is today');
  assert.equal(ex.rows[0].date, '2026-10-11');
  assert.deepEqual(plain(M.exampleData(cfg.example, cfg.templates, ZONES, '2026-10-24', cfg.threshold)), ex, 'the same example every time');
  const itemsFor = (row) => M.itemsOf(cfg.templates[row.template], ZONES);
  const a = M.annotate(ex.rows, itemsFor, cfg.threshold);
  const groups = plain(M.rateBy(a, (r) => r.attendant));
  const jonas = groups.find((g) => g.key === 'Jonas');
  const others = groups.filter((g) => g.key !== 'Jonas');
  assert.ok(others.every((g) => g.rate > jonas.rate + 0.15), 'the new attendant passes less often the first time');
  assert.ok(a.some((r) => r.recheck), 'failed rooms are inspected again');
  const top = plain(M.itemPareto(a)).slice(0, 3);
  assert.ok(top.every((p) => p.key.includes('|bathroom-')), `recurring bathroom items: ${top.map((p) => p.key)}`);
  assert.ok(ex.rows.every((r) => r.template === (r.roomType === 'suite' ? 'suite' : 'standard')));
});

test('a first visit opens on the example with a rich result; clearing it leaves an empty page', () => {
  const w = load();
  const results = w.document.querySelector('[data-results]');
  assert.equal(results.hidden, false);
  assert.match(results.querySelector('h2').textContent, /first-time pass rate/);
  assert.equal(results.querySelectorAll('.dl-stat').length, 5);
  assert.ok(results.querySelectorAll('svg').length >= 4, 'charts by attendant, week, floor, type and the heat map');
  assert.match(results.querySelector('.ri-panel-attendant .dl-panel-note').textContent, /coaching, not blame/);
  assert.ok(results.querySelector('.dl-focus h3').textContent.length > 5, 'the most failed item is the focus');
  const note = w.document.querySelector('.dl-example-note');
  assert.equal(note.hidden, false);
  assert.equal(w.localStorage.getItem('sc-room-inspection'), null, 'nothing is written until the visitor acts');
  assert.equal(w.document.querySelectorAll('[data-log] tr').length, 30, 'the newest 30 in the log');
  click(w, note.querySelector('button'));
  assert.equal(results.hidden, true);
  assert.equal(saved(w).rows.length, 0);
  assert.equal(saved(w).rooms.length, 0, 'the rooms the example brought go with it');
});

test('an inspection: the room picks its checklist and attendant, a fault opens its note, maintenance goes to the tracker', () => {
  const w = load({ storage: { 'sc-room-inspection': { rooms: [{ number: '412', floor: '4', type: 'suite' }, { number: '413', floor: '4', type: 'double' }], attendants: [{ name: 'Jonas', floors: ['4'] }], inspectors: ['Elena'] } } });
  const d = w.document;
  type(w, d.querySelector('#ri-room'), '412');
  assert.equal(d.querySelector('#ri-template').value, 'suite', 'a suite gets the suite checklist');
  assert.equal(d.querySelector('#ri-attendant').value, 'Jonas', 'the attendant of floor 4');
  assert.match(d.querySelector('[data-room-note]').textContent, /Floor 4 · Suite/);
  const tap = d.querySelector('input[name="ri-bathroom-5"][value="fail"]');
  choose(w, tap);
  const row = tap.closest('.ri-item');
  assert.equal(row.dataset.answer, 'fail');
  assert.ok(row.querySelector('.ri-note'), 'the note opens');
  assert.equal(row.querySelector('input[name="ri-flag-bathroom-5"]:checked').value, 'maintenance', 'a dripping tap goes to maintenance');
  type(w, row.querySelector('.ri-note'), 'Shower tap drips');
  click(w, d.querySelector('[data-rest-pass]'));
  assert.match(d.querySelector('[data-live]').textContent, /Score 9\d ?% · ✓ Pass/);
  click(w, d.querySelector('[data-save]'));
  const state = saved(w);
  assert.equal(state.rows.length, 1);
  const r = state.rows[0];
  assert.deepEqual([r.room, r.floor, r.roomType, r.attendant, r.template], ['412', '4', 'suite', 'Jonas', 'suite']);
  assert.equal(r.answers['bathroom-5'], 'fail');
  assert.equal(r.notes['bathroom-5'], 'Shower tap drips');
  assert.equal(r.sent['bathroom-5'], true);
  const actions = JSON.parse(w.localStorage.getItem('sc-actions')).rows;
  assert.equal(actions.length, 1);
  assert.equal(actions[0].source, 'room-inspection');
  assert.equal(actions[0].area, 'Floor 4');
  assert.equal(actions[0].priority, 'Medium');
  assert.match(actions[0].title, /Room 412: Tap, drain and flush work/);
  assert.equal(state.draft.room, '', 'the next inspection starts blank');
  assert.equal(state.draft.inspector, '', 'no inspector was given');
  // A critical fault fails the room, whatever the score.
  type(w, d.querySelector('#ri-room'), '413');
  assert.equal(d.querySelector('#ri-template').value, 'standard');
  click(w, d.querySelector('[data-rest-pass]'));
  choose(w, d.querySelector('input[name="ri-bathroom-0"][value="fail"]'));
  assert.match(d.querySelector('[data-live]').textContent, /✗ Fail · .*critical item failed: No hair/);
  click(w, d.querySelector('[data-save]'));
  const results = d.querySelector('[data-results]');
  assert.equal(results.hidden, false);
  assert.match(results.querySelector('h2').textContent, /^50 ?%/);
  // The faults travel to Pareto 80/20 in its housekeeping template.
  const pareto = [...results.querySelectorAll('a')].find((a) => /Pareto/.test(a.textContent));
  click(w, pareto);
  const handoff = JSON.parse(w.sessionStorage.getItem('sc-pareto-handoff'));
  assert.equal(handoff.template, 'housekeeping');
  assert.deepEqual(handoff.headers, ['Date', 'Floor', 'Room', 'Cause', 'Count', 'Note']);
  assert.equal(handoff.rows.length, 2);
  assert.deepEqual(handoff.map, { category: 3, count: 4, value: -1, date: 0, filter: 1 });
  const whys = [...results.querySelectorAll('a')].find((a) => /5 Whys/.test(a.textContent));
  assert.equal(new URL(whys.href).pathname, '/tools/five-whys/');
  assert.equal(new URL(whys.href).searchParams.get('problem'), 'Room inspection: “No hair in the shower, bath, basin or on the floor” fails most often (1 ×)');
});

test('German page: links keep /de/, the texts are translated and the log removes with undo', () => {
  const w = load({ lang: 'de' });
  const d = w.document;
  const results = d.querySelector('[data-results]');
  const standard = [...results.querySelectorAll('a')].find((a) => /standard-work/.test(a.href));
  assert.match(standard.href, /\/de\/tools\/standard-work\/$/);
  const tracker = [...results.querySelectorAll('a')].find((a) => /action-tracker/.test(a.href));
  assert.match(tracker.href, /\/de\/tools\/action-tracker\//);
  const cfg = read(DATA.de);
  const n = w.RoomInspectionMath.exampleData(cfg.example, cfg.templates, ZONES, '2026-10-24', cfg.threshold).rows.length;
  click(w, d.querySelector('[data-log] .dl-remove'));
  assert.equal(saved(w, 'sc-room-inspection-de').rows.length, n - 1);
  click(w, d.querySelector('[data-log-status] .dl-undo'));
  assert.equal(saved(w, 'sc-room-inspection-de').rows.length, n);
  assert.match(d.querySelector('[data-zones] .ri-answer.is-fail span').textContent, /^Fail$|^Mangel$/);
});

test('every text of the page and the script has a German and an Albanian translation', () => {
  const ui = { de: read('src/_data/de/ui.json'), sq: read('src/_data/sq/ui.json') };
  const part = read('src/_data/i18n-parts/room-inspection.json');
  const njk = fs.readFileSync('src/_includes/partials/room-inspection.njk', 'utf8');
  const js = fs.readFileSync('src/js/room-inspection.js', 'utf8');
  const texts = new Set([...njk.matchAll(/\{\{\s*"((?:[^"\\]|\\.)*)"\s*\|\s*t\(lang\)/g)].map((m) => m[1]));
  for (const m of js.matchAll(/\btx\("((?:[^"\\]|\\.)*)"/g)) texts.add(JSON.parse(`"${m[1]}"`));
  assert.ok(texts.size > 100);
  for (const lang of ['de', 'sq']) {
    const missing = [...texts].filter((text) => (part[lang][text] ?? ui[lang][text]) === undefined);
    assert.deepEqual(missing, [], `${lang}: no translation`);
    Object.entries(part[lang]).forEach(([en, out]) => {
      const vars = (s) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
      assert.deepEqual(vars(out), vars(en), `${lang}: the placeholders of "${en}"`);
    });
  }
  const cards = read('src/_data/i18n-parts/room-inspection.cards.json');
  assert.equal(cards.family, 'zenith');
  assert.deepEqual(['en', 'de', 'sq'].map((lang) => cards.cards[lang].url), ['/tools/room-inspection/', '/de/tools/room-inspection/', '/sq/tools/room-inspection/']);
  assert.ok(['en', 'de', 'sq'].every((lang) => cards.cards[lang].type === 'Hotel' && cards.cards[lang].time === '5 min'));
});

test('an own checklist: copied from the chosen one, a weight of C makes an item critical, and its rooms pick it', () => {
  const w = load({ storage: { 'sc-room-inspection': { rooms: [{ number: '305', floor: '3', type: 'double' }] } } });
  const d = w.document;
  click(w, d.querySelector('[data-pack-copy]'));
  const state = saved(w);
  const [key] = Object.keys(state.custom);
  assert.match(key, /^custom-/);
  assert.equal(d.querySelector('#ri-template').value, key);
  const weight = d.querySelector('[data-pack-editor] input[data-group="bathroom"][data-index="2"][data-field="weight"]');
  assert.equal(weight.value, '2');
  type(w, weight, 'C');
  const item = saved(w).custom[key].questions.bathroom[2];
  assert.deepEqual([item.weight, item.critical], [3, true]);
  assert.match(d.querySelector('.ri-item[data-qid="bathroom-2"] .ri-weight').textContent, /Critical/);
  d.querySelector('#ri-template').value = 'suite';
  d.querySelector('#ri-template').dispatchEvent(new w.Event('change', { bubbles: true }));
  type(w, d.querySelector('#ri-room'), '305');
  assert.equal(d.querySelector('#ri-template').value, key, 'the team’s own checklist for its room types comes first');
});
