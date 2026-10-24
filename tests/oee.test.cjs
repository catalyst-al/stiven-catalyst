// OEE (src/js/oee.js): availability, performance and quality of each shift, the six big losses they split the planned
// time into, and the page that logs shifts, opens on an example and hands the losses on to Pareto, 5 Whys and actions.
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');
const nunjucks = require('nunjucks');

const plain = (value) => JSON.parse(JSON.stringify(value));
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const data = { en: read('src/_data/oee.json'), de: read('src/_data/de/oee.json'), sq: read('src/_data/sq/oee.json') };
const own = read('src/_data/i18n-parts/oee.json');
// The hand-off to the Maintenance Planner keeps its strings in the links-3 part until the integrator merges them.
const links = read('src/_data/i18n-parts/links-3.json');
const part = { de: { ...links.de, ...own.de }, sq: { ...links.sq, ...own.sq } };
const near = (actual, expected, digits = 6, message) => assert.ok(Math.abs(actual - expected) < 10 ** -digits, `${message || ''} ${actual} ≠ ${expected}`);

// The partial rendered the way the site renders it (the filters stubbed as in scripts/check-tool.mjs), without its
// <script src> tags: the test loads the scripts itself.
const pageHtml = (lang) => {
  const ui = lang === 'en' ? {} : { ...read(`src/_data/${lang}/ui.json`), ...part[lang] };
  const env = new nunjucks.Environment(new nunjucks.FileSystemLoader(['src/_includes']), { autoescape: false });
  env.addFilter('t', (text) => ui[text] ?? text);
  env.addFilter('local', (url) => (lang === 'en' ? url : `/${lang}${url}`));
  env.addFilter('assetUrl', (url) => url);
  env.addFilter('scriptJson', (value) => JSON.stringify(value).replace(/[<>&]/g, (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, '0')}`));
  const body = env.render('partials/oee.njk', { cfg: data[lang], lang: lang === 'en' ? undefined : lang });
  return `<html lang="${lang}"><body><h1>OEE</h1>${body.replace(/<script src=[^>]*><\/script>/g, '')}</body></html>`;
};

// The log is written right after the screen is drawn (a frame and a tick later).
const settle = (w) => new Promise((resolve) => w.setTimeout(resolve, 60));

const load = ({ lang = 'en', page = false, now = '2026-10-23T10:00:00Z', storage = {} } = {}) => {
  const url = `https://example.test${lang === 'en' ? '' : `/${lang}`}/tools/oee/`;
  const dom = new JSDOM(page ? pageHtml(lang) : `<html lang="${lang}"><body></body></html>`, { url, runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  w.eval(`(() => { const Real = Date; const fixed = new Real(${JSON.stringify(now)}); Date = class extends Real { constructor(...args) { super(...(args.length ? args : [fixed])); } static now() { return fixed.getTime(); } }; })();`);
  w.confirm = () => true;
  w.HTMLElement.prototype.scrollIntoView = () => {};
  Object.entries(storage).forEach(([key, value]) => w.localStorage.setItem(key, JSON.stringify(value)));
  if (lang !== 'en') w.UiStrings = { ...read(`src/_data/${lang}/ui.json`), ...part[lang] };
  for (const file of ['tool-kit', 'chart-kit', 'workplace', 'actions-store', 'oee']) w.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  return w;
};

test('the three data files share their shape, and each language keeps its own log', () => {
  const LOSSES = ['breakdowns', 'setup', 'smallStops', 'speed', 'startupRejects', 'productionRejects'];
  assert.equal(data.en.storageKey, 'sc-oee');
  for (const lang of ['de', 'sq']) {
    const other = data[lang];
    assert.deepEqual(Object.keys(other).sort(), Object.keys(data.en).sort(), lang);
    assert.equal(other.storageKey, `sc-oee-${lang}`);
    assert.deepEqual(other.reasons.map((r) => r.loss), data.en.reasons.map((r) => r.loss), `${lang} reasons map onto the same losses`);
    assert.equal(new Set(other.reasons.map((r) => r.name)).size, other.reasons.length, `${lang} reason names are unique`);
    assert.equal(other.shifts.length, data.en.shifts.length);
    assert.equal(other.verdicts.length, 4);
    assert.equal(other.tips.length, data.en.tips.length);
    assert.deepEqual(Object.keys(other.placeholders).sort(), Object.keys(data.en.placeholders).sort());
    assert.deepEqual(other.example.equipment.map((m) => [m.rate, m.planned]), data.en.example.equipment.map((m) => [m.rate, m.planned]));
    assert.equal(other.example.rows.length, data.en.example.rows.length);
    other.example.rows.forEach((row, i) => {
      const cells = row.split('|');
      const en = data.en.example.rows[i].split('|');
      assert.deepEqual([cells[0], cells[3], cells[5], cells[6], cells[7]], [en[0], en[3], en[5], en[6], en[7]], `${lang} example row ${i}`);
      assert.ok(other.shifts.includes(cells[1]), `${lang} example row ${i} shift`);
      assert.ok(other.example.equipment.some((m) => m.name === cells[2]), `${lang} example row ${i} machine`);
    });
  }
  for (const lang of ['en', 'de', 'sq']) {
    const cfg = data[lang];
    assert.deepEqual(Object.keys(cfg.losses).sort(), [...LOSSES].sort(), `${lang} six losses`);
    LOSSES.forEach((key) => {
      assert.ok(cfg.losses[key].name && cfg.losses[key].meaning && cfg.losses[key].question, `${lang} ${key}`);
      assert.equal(cfg.losses[key].moves.length, 3, `${lang} ${key} moves`);
    });
    // Every stop of the example is a reason of the list, so nothing lands in breakdowns by accident.
    const names = new Set(cfg.reasons.map((r) => r.name));
    cfg.example.rows.forEach((row) => row.split('|')[4].split('; ').forEach((stop) => assert.ok(names.has(stop.split(': ')[0]), `${lang}: ${stop}`)));
  }
});

test('one entry: planned stops leave the planned time, and the six losses add up to it', () => {
  const M = load().OeeMath;
  const reasons = data.en.reasons;
  assert.equal(M.idealCycle({ rate: 1800 }), 2);
  assert.equal(M.idealCycle({ cycle: 1.5 }), 1.5);
  assert.equal(M.idealCycle({ rate: 0 }), null);
  const row = { planned: 480, stops: [{ reason: 'Break', minutes: 30 }, { reason: 'Breakdown', minutes: 40 }, { reason: 'Changeover', minutes: 20 }, { reason: 'Jam', minutes: 10 }], pieces: 9000, rejects: 450, startup: 90 };
  const e = M.entry(row, 2, reasons);
  assert.equal(e.ppt, 450);
  assert.equal(e.run, 390);
  near(e.availability, 390 / 450);
  near(e.performance, 300 / 390);
  near(e.quality, 0.95);
  near(e.oee, 285 / 450);
  near(e.oee, e.availability * e.performance * e.quality, 9, 'OEE = A × P × Q');
  assert.deepEqual(plain(Object.fromEntries(Object.entries(e.losses).map(([k, v]) => [k, Math.round(v * 1000) / 1000]))),
    { breakdowns: 40, setup: 20, smallStops: 10, speed: 80, startupRejects: 3, productionRejects: 12 });
  near(Object.values(e.losses).reduce((a, b) => a + b, 0) + e.valuable, e.ppt, 9, 'losses and good time fill the planned time');
  assert.equal(e.capped, false);
  // An unknown reason is a breakdown; a reason typed short is found.
  assert.equal(M.lossOf('Forklift in the way', reasons), 'breakdowns');
  assert.equal(M.matchReason('chang', reasons), 'Changeover');
  assert.equal(M.matchReason('break', reasons), 'Break', 'the exact name wins over a longer one');
});

test('the edges: capped performance, too many stop minutes, no ideal rate, no pieces', () => {
  const M = load().OeeMath;
  const reasons = data.en.reasons;
  const fast = M.entry({ planned: 100, stops: [], pieces: 7200, rejects: 0 }, 1, reasons);
  assert.equal(fast.performance, 1, 'capped at 100 %');
  assert.equal(fast.capped, true);
  assert.equal(fast.losses.speed, 0);
  const over = M.entry({ planned: 60, stops: [{ reason: 'Breakdown', minutes: 50 }, { reason: 'Changeover', minutes: 30 }], pieces: 0 }, 1, reasons);
  assert.equal(over.run, 0);
  assert.equal(over.losses.breakdowns, 37.5, 'scaled down to the planned time');
  assert.equal(over.losses.setup, 22.5);
  assert.equal(over.oee, 0);
  const unrated = M.entry({ planned: 480, stops: [{ reason: 'Breakdown', minutes: 60 }], pieces: 100 }, null, reasons);
  assert.equal(unrated.rated, false);
  assert.equal(unrated.oee, null);
  near(unrated.availability, 420 / 480);
  const idle = M.entry({ planned: 480, stops: [], pieces: 0 }, 2, reasons);
  assert.equal(idle.oee, 0);
  assert.equal(idle.losses.speed, 480, 'running without pieces is all speed loss');
  const rejects = M.entry({ planned: 100, stops: [], pieces: 10, rejects: 50, startup: 99 }, 60, reasons);
  assert.equal(rejects.rejects, 10, 'rejects never exceed the pieces');
  assert.equal(rejects.startup, 10);
});

test('stops typed as text: reasons and minutes, decimal commas, units and unknown reasons', () => {
  const M = load({ lang: 'de' }).OeeMath;
  const reasons = data.de.reasons;
  assert.deepEqual(plain(M.parseStops('Stau: 12; umrüst 20, Pause: 30 min\nStörung 7,5', reasons)), [
    { reason: 'Stau', minutes: 12 }, { reason: 'Umrüsten', minutes: 20 }, { reason: 'Pause', minutes: 30 }, { reason: 'Störung', minutes: 7.5 },
  ]);
  assert.deepEqual(plain(M.parseStops('Stapler im Weg: 15 | 0 | nur Text', reasons)), [{ reason: 'Stapler im Weg', minutes: 15 }]);
  assert.equal(M.stopsText([{ reason: 'Stau', minutes: 12 }, { reason: 'Pause', minutes: 30 }]), 'Stau: 12; Pause: 30');
  assert.deepEqual(plain(M.loggedOf(M.parseStops('Stau: 12; Pause: 30; Stapler: 5', reasons), reasons)), { breakdowns: 5, setup: 0, smallStops: 12, speed: 0, planned: 30 });
});

test('several entries: time-weighted, verdict bands and the vital few', () => {
  const M = load().OeeMath;
  const reasons = data.en.reasons;
  const a = M.entry({ planned: 480, stops: [{ reason: 'Break', minutes: 30 }, { reason: 'Breakdown', minutes: 40 }, { reason: 'Changeover', minutes: 20 }, { reason: 'Jam', minutes: 10 }], pieces: 9000, rejects: 450, startup: 90 }, 2, reasons);
  const b = M.entry({ planned: 480, stops: [], pieces: 14400, rejects: 0 }, 2, reasons);
  const c = M.entry({ planned: 480, stops: [], pieces: 100 }, null, reasons);
  const all = M.combine([a, b, c]);
  assert.equal(all.n, 2);
  assert.equal(all.unrated, 1);
  near(all.oee, 765 / 930);
  near(all.oee, all.availability * all.performance * all.quality, 9);
  near(all.lost, 930 - 765, 9);
  assert.equal(M.verdict(0.85), 0);
  assert.equal(M.verdict(0.849), 1);
  assert.equal(M.verdict(0.6), 1);
  assert.equal(M.verdict(0.45), 2);
  assert.equal(M.verdict(0.2), 3);
  const ranked = M.rank({ breakdowns: 500, setup: 100, smallStops: 0, speed: 300, startupRejects: 50, productionRejects: 50 });
  assert.deepEqual(plain(ranked.map((r) => r.key)), ['breakdowns', 'speed', 'setup', 'startupRejects', 'productionRejects', 'smallStops']);
  assert.deepEqual(plain(ranked.map((r) => r.vital)), [true, true, false, false, false, false], '500 + 300 of 1,000 carry 80 %');
  assert.equal(M.combine([]).oee, null);
});

test('the example: a sorter near 72 % with speed losses, a wrapper near 58 % with breakdowns', () => {
  const M = load().OeeMath;
  const cfg = data.en;
  for (const [machine, expected, loss] of [[cfg.example.equipment[0], 0.72, 'speed'], [cfg.example.equipment[1], 0.58, 'breakdowns']]) {
    const entries = cfg.example.rows.map((text) => text.split('|')).filter((cells) => cells[2] === machine.name).map((cells) => M.entry({
      planned: Number(cells[3]), stops: M.parseStops(cells[4], cfg.reasons), pieces: Number(cells[5]), rejects: Number(cells[6]), startup: Number(cells[7]),
    }, M.idealCycle(machine), cfg.reasons));
    const result = M.combine(entries);
    assert.equal(entries.length, 30, 'three weeks of two shifts');
    assert.ok(Math.abs(result.oee - expected) < 0.02, `${machine.name}: ${result.oee}`);
    assert.equal(M.rank(result.losses)[0].key, loss, `${machine.name}: biggest loss`);
    assert.equal(result.capped, 0);
  }
});

test('the breakdown stops one by one, as the Maintenance Planner reads them from this log', () => {
  const w = load();
  w.eval(fs.readFileSync('src/js/maintenance-planner.js', 'utf8'));
  const M = w.OeeMath;
  const rows = [
    { date: '2026-10-20', shift: 'Early', equipment: 'Sorter S1', stops: [{ reason: 'Break', minutes: 30 }, { reason: 'Breakdown', minutes: 45 }, { reason: 'Jam', minutes: 12 }, { reason: 'Motor smoke', minutes: 20 }] },
    { date: '2026-10-21', shift: 'Late', equipment: 'Wrapper W2', stops: [{ reason: 'Electrical fault', minutes: 25.5 }, { reason: 'Changeover', minutes: 15 }, { reason: 'Waiting for maintenance', minutes: 11 }] },
  ];
  const stops = plain(M.breakdownStops(rows, data.en.reasons));
  assert.deepEqual(stops.map((s) => [s.equipment, s.reason, s.minutes]), [['Sorter S1', 'Breakdown', 45], ['Sorter S1', 'Motor smoke', 20], ['Wrapper W2', 'Electrical fault', 25.5], ['Wrapper W2', 'Waiting for maintenance', 11]]);
  // Their minutes are the breakdown minutes of the entries, before anything is capped.
  near(stops.reduce((sum, s) => sum + s.minutes, 0), rows.reduce((sum, row) => sum + M.loggedOf(row.stops, data.en.reasons).breakdowns, 0));
  // The example's breakdown stops are the ones the planner would offer (it skips them while they are the example).
  const example = data.en.example.rows.map((line) => { const [date, shift, equipment, , stops] = line.split('|'); return { date, shift, equipment, stops: M.parseStops(stops, data.en.reasons) }; });
  assert.equal(w.MaintenancePlannerMath.oeeBreakdowns({ rows: example }, data.en.reasons).length, M.breakdownStops(example, data.en.reasons).length);
  assert.ok(M.breakdownStops(example, data.en.reasons).length > 20);
});

test('the page: the example opens on a first visit, with charts, a focus card and the hand-offs', () => {
  const w = load({ lang: 'sq', page: true });
  const doc = w.document;
  const results = doc.querySelector('[data-results]');
  assert.ok(!results.hidden, 'the result is shown');
  assert.ok(!doc.querySelector('.dl-example-note').hidden, 'the note says it is an example');
  assert.match(results.querySelector('h2').textContent, /^OEE \d/);
  assert.equal(results.querySelectorAll('.dl-stat').length, 5);
  assert.match(results.textContent, /Disponueshmëria/);
  assert.equal(results.querySelectorAll('.ck-figure').length, 3, 'stacked time, OEE trend and the six losses');
  assert.ok(results.querySelector('.dl-focus h3').textContent.length > 3, 'a loss to start with');
  assert.equal(doc.querySelectorAll('[data-machine-list] tr').length, 2, 'the example machines');
  assert.equal(doc.querySelectorAll('[data-log] tr').length, 25, 'the newest 25 rows of the example');
  assert.ok(results.querySelector('a[href*="/sq/tools/action-tracker/"]'), 'a hand-off to the tracker in the page’s language');
  const whys = results.querySelector('a[href*="/sq/tools/five-whys/?problem="]');
  assert.ok(whys, 'and to 5 Whys');
  // The countermeasure travels with source "oee" when the link is clicked.
  const add = [...results.querySelectorAll('a')].find((a) => a.textContent === 'Shto te veprimet');
  add.addEventListener('click', (event) => event.preventDefault());
  add.click();
  const params = new URL(add.href).searchParams;
  assert.equal(params.get('source'), 'oee');
  assert.equal(params.get('priority'), 'High');
  assert.ok(params.get('action').length > 10);
  // Pareto gets one row per entry and loss, measured in minutes.
  const pareto = [...results.querySelectorAll('a')].find((a) => a.href.includes('/sq/tools/pareto/'));
  pareto.addEventListener('click', (event) => event.preventDefault());
  pareto.click();
  const handoff = JSON.parse(w.sessionStorage.getItem('sc-pareto-handoff'));
  assert.deepEqual(handoff.headers, ['Humbja', 'Minuta']);
  assert.equal(handoff.measure, 'value');
  assert.deepEqual(handoff.map, { category: 0, value: 1 });
  assert.equal(handoff.template, 'idle-downtime');
  assert.ok(handoff.rows.length > 100);
  assert.ok(handoff.rows.every((row) => data.sq.losses[Object.keys(data.sq.losses).find((k) => data.sq.losses[k].name === row[0])] && Number(row[1]) > 0));
  // The breakdowns go on to the Maintenance Planner of the same language: a link in the actions and in the stop reasons.
  const planner = [...results.querySelectorAll('a')].filter((a) => a.href.endsWith('/sq/tools/maintenance-planner/'));
  assert.equal(planner.length, 2);
  assert.ok(planner.every((a) => a.textContent === 'Regjistroje në planifikuesin e mirëmbajtjes'));
  assert.match(results.querySelector('.oe-planner-note').textContent, /^\d+ ndalesa prishjeje \(\d[\d.\s]* min\) në këto ditë/);
  assert.ok(doc.querySelector('.tool-aside a[data-planner-link]').href.endsWith('/sq/tools/maintenance-planner/'));
  // The equipment filter narrows the result to one machine.
  const filter = doc.querySelector('[data-machine-filter]');
  filter.value = 'Paketuesja W2';
  filter.dispatchEvent(new w.Event('input', { bubbles: true }));
  assert.match(results.querySelector('.kicker').textContent, /Paketuesja W2/);
  assert.equal(results.querySelector('.dl-focus h3').firstChild.textContent, data.sq.losses.breakdowns.name);
});

test('the page: an entry of one’s own replaces the example and keeps the machine it uses', async () => {
  const w = load({ page: true });
  const doc = w.document;
  const form = doc.querySelector('[data-entry]');
  form.elements.equipment.value = 'Wrapper W2';
  form.elements.equipment.dispatchEvent(new w.Event('change'));
  assert.equal(form.elements.planned.value, '480', 'the planned minutes of the machine');
  doc.querySelector('[data-reason="Breakdown"]').click();
  assert.equal(form.elements.stops.value, 'Breakdown: ');
  form.elements.stops.value = 'Breakdown: 40; Break: 30; Forklift: 5';
  form.elements.stops.dispatchEvent(new w.Event('input'));
  assert.match(doc.querySelector('[data-stops-preview]').textContent, /Breakdowns 45 min · planned, left out: 30 min\. .*Forklift/);
  form.elements.pieces.value = '9000';
  form.elements.rejects.value = '100';
  form.dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true }));
  assert.ok(doc.querySelector('.dl-example-note').hidden, 'the example left');
  assert.equal(doc.querySelectorAll('[data-log] tr').length, 1);
  await settle(w);
  const saved = JSON.parse(w.localStorage.getItem('sc-oee'));
  assert.deepEqual(saved.equipment.map((m) => m.name), ['Wrapper W2'], 'the machine in use stays, the other example machine left');
  assert.equal(saved.rows[0].stops.length, 3);
  assert.match(doc.querySelector('[data-entry-status]').textContent, /Added Wrapper W2 .*OEE 6\d\.\d%/);
  assert.match(doc.querySelector('[data-results]').textContent, /Reasons not in the list count as breakdowns: Forklift/);
  // Too many rejects is refused.
  form.elements.pieces.value = '10';
  form.elements.rejects.value = '11';
  form.dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true }));
  assert.equal(doc.querySelectorAll('[data-log] tr').length, 1);
});

test('the page: pasted rows are imported, a new machine is added without a rate and the result asks for it', async () => {
  const w = load({ lang: 'de', page: true, storage: { 'sc-oee-de': { equipment: [{ name: 'Sorter S1', rate: 2400, planned: 480 }], rows: [] }, 'sc-workplace': { targets: { oee: 75 } } } });
  const doc = w.document;
  assert.ok(doc.querySelector('[data-results]').hidden, 'nothing logged, no example: a saved log is not replaced');
  const paste = doc.querySelector('#oe-paste');
  paste.value = 'Datum;Schicht;Anlage;Geplant;Stopps;Teile;Ausschuss;Anlauf;Notiz\n22.10.2026;Früh;sorter s1;480;"Pause: 30, Stau: 12";15200;540;90;\n22.10.2026;Spät;Etikettierer;480;Störung: 20;9000;10;0;neu\nkein Datum;Früh;Sorter S1;480;;1;0;0;';
  doc.querySelector('[data-import]').click();
  assert.equal(doc.querySelectorAll('[data-log] tr').length, 2);
  assert.match(doc.querySelector('[data-import-status]').textContent, /2 Zeilen/);
  await settle(w);
  const saved = JSON.parse(w.localStorage.getItem('sc-oee-de'));
  assert.equal(saved.rows[0].equipment, 'Sorter S1', 'the known machine, in its own spelling');
  assert.deepEqual(saved.rows[0].stops, [{ reason: 'Pause', minutes: 30 }, { reason: 'Stau', minutes: 12 }]);
  assert.deepEqual(saved.equipment.map((m) => [m.name, m.rate]), [['Sorter S1', 2400], ['Etikettierer', 0]]);
  const results = doc.querySelector('[data-results]');
  assert.match(results.textContent, /Keine ideale Leistung für Etikettierer/);
  assert.match(results.textContent, /OEE 75\s%/, 'the target of the workplace profile');
  assert.ok(results.querySelector('a[href*="/de/tools/five-whys/?problem="]'));
  // A rate for the new machine brings it into the OEE.
  const form = doc.querySelector('[data-machine-form]');
  form.elements.mname.value = 'Etikettierer';
  form.elements.mcycle.value = '2,5';
  form.dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true }));
  assert.doesNotMatch(results.textContent, /Keine ideale Leistung/);
  assert.equal(JSON.parse(w.localStorage.getItem('sc-oee-de')).equipment[1].rate, 1440);
});
