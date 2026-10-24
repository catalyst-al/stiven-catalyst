// Standard Work (src/js/standard-work.js): the six-point check of a TWI job breakdown, the hazard words, the time
// against the takt, versions, the saved list of standards, the hand-off to the Action Tracker, and the Word file.
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');

const plain = (value) => JSON.parse(JSON.stringify(value));
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const dataFile = (lang) => read(lang === 'en' ? 'src/_data/standardWork.json' : `src/_data/${lang}/standardWork.json`);

const load = (lang = 'en', { page = true, search = '', storage = {}, now = '2026-10-23T10:00:00Z' } = {}) => {
  const prefix = lang === 'en' ? '' : `/${lang}`;
  const cfg = dataFile(lang);
  const body = page ? fs.readFileSync('src/_includes/partials/standard-work.njk', 'utf8')
    .replace(/\{#[\s\S]*?#\}/g, '')
    .replace(/\{%-? *for tpl in cfg\.templates *%\}[\s\S]*?\{%-? *endfor *%\}/, cfg.templates.map((t, i) => `<option value="${i}">${t.name}</option>`).join(''))
    .replace(/\{%-?[\s\S]*?-?%\}/g, '')
    .replace(/\{\{ *"([^"]+)" *\| *t\(lang\)[^}]*\}\}/g, '$1')
    .replace(/\{\{ *'([^']+)' *\| *local\(lang\) *\}\}/g, `${prefix}$1`)
    .replace(/\{\{ *cfg *\| *scriptJson *\| *safe *\}\}/, JSON.stringify(cfg).replace(/</g, '\\u003c'))
    .replace(/\{\{[^}]*\}\}/g, '').replace(/<script src=[^>]*><\/script>/g, '') : '';
  const dom = new JSDOM(`<html lang="${lang}"><body>${body}</body></html>`, { url: `https://example.test${prefix}/tools/standard-work/${search}`, runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  w.eval(`(() => { const Real = Date; const fixed = new Real(${JSON.stringify(now)}); Date = class extends Real { constructor(...args) { super(...(args.length ? args : [fixed])); } static now() { return fixed.getTime(); } }; })();`);
  w.confirm = () => true;
  w.TextEncoder = TextEncoder; // jsdom has none; the Word file needs it.
  w.HTMLElement.prototype.scrollIntoView = () => {};
  Object.entries(storage).forEach(([key, value]) => w.localStorage.setItem(key, JSON.stringify(value)));
  for (const file of ['tool-kit', 'chart-kit', 'workplace', 'actions-store', 'docx-kit', 'standard-work']) w.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  return w;
};
const saved = (w, key = 'sc-standard-work') => JSON.parse(w.localStorage.getItem(key));
const type = (w, selector, value) => {
  const node = w.document.querySelector(selector);
  node.value = value;
  node.dispatchEvent(new w.Event('input', { bubbles: true }));
};
const templateDoc = (cfg, tpl) => (tpl.doc === 'example' ? cfg.example : tpl.doc);

test('the three data files share one shape and keep their own saved work', () => {
  const en = dataFile('en');
  const shape = (value) => (Array.isArray(value) ? (value.length && typeof value[0] === 'object' && !Array.isArray(value[0]) ? [shape(value[0])] : 'list')
    : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, shape(value[key])])) : typeof value);
  assert.equal(en.storageKey, 'sc-standard-work');
  assert.equal(en.templates.length, 3);
  assert.equal(en.example.steps.length, 7);
  assert.equal(en.example.steps.flatMap((s) => s.points).length, 12);
  for (const lang of ['de', 'sq']) {
    const other = dataFile(lang);
    assert.deepEqual(shape(other), shape(en), lang);
    assert.equal(other.storageKey, `sc-standard-work-${lang}`);
    assert.equal(other.tips.length, en.tips.length, `${lang} tips`);
    assert.equal(other.templates.length, en.templates.length, `${lang} templates`);
    other.templates.forEach((tpl, i) => {
      const a = templateDoc(other, tpl), b = templateDoc(en, en.templates[i]);
      assert.equal(a.takt, b.takt, `${lang} template ${i} takt`);
      assert.deepEqual(a.steps.map((s) => [s.time, s.points.map((p) => p.type)]), b.steps.map((s) => [s.time, s.points.map((p) => p.type)]), `${lang} template ${i} steps`);
    });
    assert.deepEqual(Object.keys(other.types), Object.keys(en.types));
  }
});

test('the example and every template pass all six points in every language', () => {
  for (const lang of ['en', 'de', 'sq']) {
    const w = load(lang, { page: false });
    const cfg = dataFile(lang);
    const M = w.StandardWorkMath;
    const d = M.exampleDoc(cfg.example, '2026-10-23');
    assert.equal(d.versionDate, '2026-10-17', `${lang} version date`);
    assert.deepEqual(plain(d.history.map((h) => h.date)), ['2026-04-26', '2026-08-24']);
    const q = M.check(d, cfg);
    assert.deepEqual(plain(q.items.filter((i) => !i.ok).map((i) => i.key)), [], `${lang}: every point passes`);
    assert.equal(q.totals.total, 205);
    assert.equal(q.totals.takt, 240);
    assert.equal(q.totals.points, 12);
    // The hazard words are found in this language: forklift, tail lift, leveller, height.
    const flagged = M.filledSteps(d).filter((s) => M.hazards(s, cfg.safetyWords).length).length;
    assert.ok(flagged >= 3, `${lang}: ${flagged} steps name a hazard`);
    cfg.templates.forEach((tpl) => {
      const t = M.fromTemplate(templateDoc(cfg, tpl), '2026-10-23', cfg.firstIssue);
      assert.equal(t.version, 1);
      assert.equal(t.owner, '');
      assert.deepEqual(plain(M.check(t, cfg).items.filter((i) => !i.ok).map((i) => i.key)), [], `${lang} ${tpl.name}`);
    });
  }
});

test('hazard words: whole words, with * for German compounds and Albanian endings', () => {
  const w = load('en', { page: false });
  const M = w.StandardWorkMath;
  assert.deepEqual(plain(M.matchWords('Check the hotel bill', ['hot'])), []);
  assert.deepEqual(plain(M.matchWords('Mind the hot plate', ['hot'])), ['hot']);
  assert.deepEqual(plain(M.matchWords('Cut the strap with the box cutter', ['cutter*', 'knife'])), ['cutter']);
  assert.deepEqual(plain(M.matchWords('Out of the forklift lane', ['forklift*'])), ['forklift']);
  assert.deepEqual(plain(M.matchWords('Der Gabelstapler und die Staplerspur', ['*stapler*'])), ['stapler']);
  assert.deepEqual(plain(M.matchWords('Ladebalken auf Brusthöhe', ['*höhe'])), ['höhe']);
  assert.deepEqual(plain(M.matchWords('Mit dem Cuttermesser', ['*messer'])), ['messer']);
  assert.deepEqual(plain(M.matchWords('Schichtleiter prüft', ['leiter'])), [], 'a Schichtleiter is no ladder');
  assert.deepEqual(plain(M.matchWords('Larg korsisë së pirunit', ['pirun*'])), ['pirun']);
  assert.deepEqual(plain(M.matchWords('Kafazi bie nga platforma ngritëse', ['platform* ngritëse'])), ['platform* ngritëse']);
});

test('the check names what is missing: key point, safety, takt, steps, reasons, change note', () => {
  const w = load('en', { page: false });
  const cfg = dataFile('en');
  const M = w.StandardWorkMath;
  const failing = (d) => plain(M.check(d, cfg).items.filter((i) => !i.ok).map((i) => i.key));
  assert.deepEqual(failing({}), ['keyPoints', 'safety', 'takt', 'steps', 'reasons', 'changeNote'], 'an empty standard misses all six');
  const d = plain(M.exampleDoc(cfg.example, '2026-10-23'));
  const steps = (fn) => ({ ...d, steps: fn(plain(d.steps)) });
  assert.deepEqual(failing(steps((s) => { s[5].points = []; return s; })), ['keyPoints']);
  assert.deepEqual(failing(steps((s) => { s[1].points.forEach((p) => { p.type = 'technique'; }); return s; })), ['safety'], 'forklift without a safety key point');
  const q = M.check(steps((s) => { s.push({ step: 'Cut the strapping with a knife', time: '10', points: [{ text: 'Cut away from the body', type: 'technique', reason: 'A slip goes into the air' }] }); return s; }), cfg);
  assert.deepEqual(plain(q.unsafe), [{ n: 8, step: 'Cut the strapping with a knife', words: ['knife'] }]);
  assert.deepEqual(failing({ ...d, takt: '200' }), ['takt'], '205 s does not fit 200 s');
  assert.deepEqual(failing({ ...d, takt: '' }), ['takt']);
  assert.deepEqual(failing(steps((s) => { s[0].time = ''; return s; })), ['takt'], 'a step without a time');
  const many = steps((s) => [...s, ...s.slice(0, 6)].map((x) => ({ ...x, time: '1' })));
  assert.deepEqual(failing(many), ['steps']);
  assert.deepEqual(failing(steps((s) => { s[3].points[1].reason = ' '; return s; })), ['reasons']);
  assert.deepEqual(failing({ ...d, changeNote: '' }), ['changeNote']);
  // A blank row just added is not a step yet.
  assert.deepEqual(failing(steps((s) => [...s, { step: '', time: '', points: [{ text: '', type: 'safety', reason: '' }] }])), []);
});

test('seconds as typed, totals, new versions and moving steps', () => {
  const w = load('en', { page: false });
  const M = w.StandardWorkMath;
  assert.equal(M.seconds('45'), 45);
  assert.equal(M.seconds('45 s'), 45);
  assert.equal(M.seconds('1:30'), 90);
  assert.equal(M.seconds('7.5'), 7.5);
  assert.ok(Number.isNaN(M.seconds('soon')));
  assert.equal(load('de', { page: false }).StandardWorkMath.seconds('7,5'), 7.5);
  const t = plain(M.totals({ takt: '4:00', steps: [{ step: 'a', time: '100', points: [{ text: 'x', type: 'safety' }] }, { step: 'b', time: '', points: [{ text: 'y', type: 'cost' }] }] }));
  assert.equal(t.takt, 240);
  assert.equal(t.total, 100);
  assert.equal(t.missing, 1);
  assert.equal(t.timed, false);
  assert.equal(t.spare, 140);
  assert.deepEqual(t.byType, { safety: 1, quality: 0, technique: 0, cost: 1 });
  const d = M.exampleDoc(dataFile('en').example, '2026-10-23');
  const next = plain(M.newVersion(d, '2026-10-24'));
  assert.equal(next.version, 4);
  assert.equal(next.versionDate, '2026-10-24');
  assert.equal(next.changeNote, '');
  assert.equal(next.id, d.id);
  assert.deepEqual(next.history.at(-1), { version: 3, date: '2026-10-17', note: d.changeNote });
  assert.equal(next.history.length, 3);
  assert.deepEqual(plain(M.moveStep(['a', 'b', 'c'], 2, 1)), ['a', 'c', 'b']);
  assert.deepEqual(plain(M.moveStep(['a', 'b', 'c'], 0, -1)), ['a', 'b', 'c']);
});

test('the page opens on the example on a first visit and draws the job breakdown', () => {
  const w = load('sq');
  const doc = w.document;
  const state = saved(w, 'sc-standard-work-sq');
  assert.equal(state.docs.length, 1);
  assert.equal(state.example, state.docs[0].id);
  const results = doc.querySelector('[data-results]');
  assert.ok(!results.hidden);
  assert.ok(!doc.querySelector('.dl-example-note').hidden);
  assert.equal(results.querySelectorAll('.sw-table tbody tr').length, 7);
  assert.equal(results.querySelectorAll('.sw-table .sw-kp').length, 12);
  assert.equal(results.querySelectorAll('.sw-table .sw-reason').length, 12);
  assert.equal(results.querySelectorAll('.sw-quality .ck-chip.is-ok').length, 6);
  assert.ok(results.querySelector('.ck-figure svg'), 'time per step as a chart');
  assert.equal(results.querySelectorAll('.sw-version-list li').length, 3);
  assert.equal(doc.querySelector('#sw-title').value, dataFile('sq').example.title);
  assert.equal(doc.querySelectorAll('[data-steps] .sw-step').length, 7);
  assert.equal(doc.querySelector('[data-version]').textContent, '3');
  assert.ok([...doc.querySelectorAll('.sw-flag')].every((f) => f.hidden));
  // Typing makes the example this person's standard: the note goes, the change is saved.
  type(w, '#sw-title', 'Ngarkimi i kafazit, Hub 2');
  assert.ok(doc.querySelector('.dl-example-note').hidden);
  assert.equal(saved(w, 'sc-standard-work-sq').docs[0].title, 'Ngarkimi i kafazit, Hub 2');
  assert.equal(saved(w, 'sc-standard-work-sq').example, '');
  // A safety key point turned into technique: the step is flagged and the check drops.
  const select = doc.querySelector('[data-step-index="1"] [data-point-index="1"] select');
  select.value = 'technique';
  select.dispatchEvent(new w.Event('change', { bubbles: true }));
  assert.equal(doc.querySelectorAll('.sw-quality .ck-chip.is-ok').length, 6, 'the other safety key point still covers it');
  const select0 = doc.querySelector('[data-step-index="1"] [data-point-index="0"] select');
  select0.value = 'quality';
  select0.dispatchEvent(new w.Event('change', { bubbles: true }));
  assert.equal(doc.querySelectorAll('.sw-quality .ck-chip.is-ok').length, 5);
  assert.ok(!doc.querySelector('[data-step-index="1"] .sw-flag').hidden);
  assert.match(doc.querySelector('[data-step-index="1"] .sw-flag').textContent, /pirun/);
});

test('steps: add, insert, move up and down, remove with undo; key points add and remove', () => {
  const w = load('en');
  const doc = w.document;
  const titles = () => saved(w).docs[0].steps.map((s) => s.step);
  const card = (i) => doc.querySelector(`[data-step-index="${i}"]`);
  card(0).querySelector('[data-step-action="down"]').click();
  assert.deepEqual(titles().slice(0, 2), ['Push the cage to the dock door', 'Check the roll cage']);
  card(1).querySelector('[data-step-action="up"]').click();
  assert.equal(titles()[0], 'Check the roll cage');
  card(2).querySelector('[data-step-action="insert"]').click();
  assert.equal(titles().length, 8);
  assert.equal(titles()[3], '');
  assert.equal(doc.activeElement, card(3).querySelector('[data-key="step"]'));
  type(w, '[data-step-index="3"] [data-key="step"]', 'Open the truck doors');
  type(w, '[data-step-index="3"] [data-key="time"]', '10');
  assert.equal(titles()[3], 'Open the truck doors');
  assert.match(doc.querySelector('[data-step-total]').textContent, /215 s/);
  card(3).querySelector('[data-step-action="remove"]').click();
  assert.equal(titles().length, 7);
  doc.querySelector('[data-steps-status] .dl-undo').click();
  assert.equal(titles()[3], 'Open the truck doors');
  card(0).querySelector('[data-add-point]').click();
  assert.equal(saved(w).docs[0].steps[0].points.length, 3);
  card(0).querySelectorAll('[data-remove-point]')[2].click();
  assert.equal(saved(w).docs[0].steps[0].points.length, 2);
  doc.querySelector('[data-add-step]').click();
  assert.equal(titles().length, 9);
});

test('several standards: new, duplicate, delete with undo, template, new version', () => {
  const w = load('en');
  const doc = w.document;
  doc.querySelector('[data-new]').click();
  assert.equal(saved(w).docs.length, 2);
  assert.ok(doc.querySelector('[data-results]').hidden, 'an empty standard has no sheet yet');
  assert.equal(doc.querySelector('#sw-change').value, 'First issue.');
  type(w, '#sw-title', 'Pick a carton');
  assert.ok(!doc.querySelector('[data-results]').hidden);
  doc.querySelectorAll('.sw-item')[0].querySelector('.sw-item-tools button').click();
  assert.deepEqual(saved(w).docs.map((d) => d.title), ['Pick a carton', 'Pick a carton (copy)', 'Load a roll cage onto the truck']);
  doc.querySelectorAll('.sw-item')[1].querySelectorAll('.sw-item-tools button')[1].click();
  assert.equal(saved(w).docs.length, 2);
  doc.querySelector('[data-list-status] .dl-undo').click();
  assert.equal(saved(w).docs.length, 3);
  doc.querySelector('[data-template]').value = '2';
  doc.querySelector('[data-from-template]').click();
  const fresh = saved(w).docs[0];
  assert.equal(fresh.title, 'Take over a delivery at the dock');
  assert.equal(fresh.steps.length, 6);
  assert.equal(fresh.version, 1);
  // The example: a new version keeps the old note in the history and asks for a new one.
  doc.querySelectorAll('.sw-item')[3].querySelector('.sw-open').click();
  doc.querySelector('[data-new-version]').click();
  const ex = saved(w).docs[3];
  assert.equal(ex.version, 4);
  assert.equal(ex.history.length, 3);
  assert.equal(doc.querySelector('[data-version]').textContent, '4');
  assert.equal(doc.querySelector('#sw-change').value, '');
  assert.equal(doc.querySelectorAll('.sw-quality .ck-chip.is-ok').length, 5);
  assert.equal(doc.querySelectorAll('[data-history] li').length, 3);
});

test('the hand-offs keep the language: train the team via the Action Tracker, the 5S audit, the skills matrix', () => {
  const w = load('de');
  const doc = w.document;
  const train = doc.querySelector('[data-train]');
  assert.ok(train, 'the train button replaces its slot');
  train.dispatchEvent(new w.MouseEvent('click', { bubbles: true, cancelable: true }));
  const url = new URL(train.href);
  assert.equal(url.pathname, '/de/tools/action-tracker/');
  assert.match(url.searchParams.get('action'), /Rollcontainer auf den Lkw laden$/);
  assert.equal(url.searchParams.get('source'), 'standard-work');
  assert.equal(url.searchParams.get('owner'), 'Mehmet Y. (Trainer)');
  assert.equal(url.searchParams.get('due'), '2026-11-06');
  assert.equal(doc.querySelector('[data-five-s]').getAttribute('href'), '/de/tools/five-s-audit/');
  assert.equal(doc.querySelector('[data-skills]').getAttribute('href'), '/de/tools/skills-matrix/');
  const en = load('en');
  const link = en.document.querySelector('[data-train]');
  link.dispatchEvent(new en.MouseEvent('click', { bubbles: true, cancelable: true }));
  assert.equal(new URL(link.href).searchParams.get('action'), 'Train on: Load a roll cage onto the truck');
});

test('copy as text and the Word file carry the header, the three columns and the versions', () => {
  const w = load('en');
  const cfg = dataFile('en');
  const d = w.StandardWorkMath.exampleDoc(cfg.example, '2026-10-23');
  const text = w.StandardWorkMath.asText(d);
  ['Standard work · Load a roll cage onto the truck', 'Takt or target time: 240 s', '1. Check the roll cage (20 s)', '⚠ Safety: Wheels turn freely', 'Total: 205 s · Takt: 240 s', 'Quality check: 6/6', 'Version 2'].forEach((line) => assert.ok(text.includes(line), line));
  const bytes = w.StandardWorkMath.wordFile(d);
  assert.equal(String.fromCharCode(bytes[0], bytes[1]), 'PK');
  const xml = Buffer.from(bytes).toString('utf8');
  assert.equal((xml.match(/<w:tbl>/g) || []).length, 2, 'the header block and the breakdown');
  assert.equal((xml.match(/<w:gridCol /g) || []).length, 4 + 3);
  // Header block: 8 pairs in 4 rows; breakdown: a header row, 7 steps and the total.
  assert.equal((xml.match(/<w:tr>/g) || []).length, 4 + 1 + 7 + 1);
  assert.ok(xml.includes('Every lost roll cage costs about 150 euros'));
  assert.ok(xml.includes('Key points'));
  assert.ok(xml.includes('<w:tblHeader/>'));
});
