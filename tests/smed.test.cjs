// SMED Changeover (src/js/smed.js): the arithmetic in window.SmedMath (durations as typed, the laps of the stopwatch,
// internal and external time before, after separating and after the plan, people in parallel, the saving, the freed
// time and money per week and year, the batch-size effect, the Pareto by category, the changeover standard), the three
// data files, and the page: the example on a first visit, the stopwatch, the five steps, the hand-offs and the texts.
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const nunjucks = require('nunjucks');
const { JSDOM } = require('jsdom');

const plain = (value) => JSON.parse(JSON.stringify(value));
const close = (a, b, message) => assert.ok(Math.abs(a - b) < 1e-9, `${message}: ${a} vs ${b}`);
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const DATA = { en: 'src/_data/smed.json', de: 'src/_data/de/smed.json', sq: 'src/_data/sq/smed.json' };
const TODAY = '2026-10-24';

const env = new nunjucks.Environment(new nunjucks.FileSystemLoader('src/_includes'), { autoescape: false });
env.addFilter('t', (text) => text);
env.addFilter('local', (url, lang) => (lang && lang !== 'en' ? `/${lang}${url}` : url));
env.addFilter('assetUrl', (url) => url);
env.addFilter('scriptJson', (value) => JSON.stringify(value).replace(/</g, '\\u003c'));
const partial = (lang) => env.render('partials/smed.njk', { cfg: read(DATA[lang]), lang: lang === 'en' ? undefined : lang }).replace(/<script src=[^>]*><\/script>/g, '');
const strings = (lang) => {
  if (lang === 'en') return null;
  const own = read('src/_data/i18n-parts/smed.json');
  return { ...read(`src/_data/${lang}/ui.json`), ...own[lang] };
};

const load = ({ lang = 'en', page = true, now = `${TODAY}T09:30:00Z`, storage = {}, clock } = {}) => {
  const base = lang === 'en' ? '' : `/${lang}`;
  const html = `<html lang="${lang}"><body><main id="main">${page ? partial(lang) : ''}</main></body></html>`;
  const dom = new JSDOM(html, { url: `https://example.test${base}/tools/smed/`, runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  w.eval(`(() => { const Real = Date; const fixed = new Real(${JSON.stringify(now)}); Date = class extends Real { constructor(...args) { super(...(args.length ? args : [fixed])); } static now() { return fixed.getTime(); } }; })();`);
  if (clock) w.performance.now = () => clock.t;
  w.confirm = () => true;
  w.print = () => {};
  w.HTMLElement.prototype.scrollIntoView = () => {};
  w.URL.createObjectURL = () => 'blob:test';
  w.URL.revokeObjectURL = () => {};
  if (lang !== 'en') w.UiStrings = strings(lang);
  Object.entries(storage).forEach(([key, value]) => w.localStorage.setItem(key, JSON.stringify(value)));
  for (const file of ['tool-kit', 'chart-kit', 'actions-store', 'template-pack', 'smed']) w.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  w.document.addEventListener('click', (event) => { if (event.target.closest('a')) event.preventDefault(); });
  return w;
};
const math = () => load({ page: false }).SmedMath;
// Links are followed by reading their address; jsdom cannot navigate.
const click = (w, node) => node.dispatchEvent(new w.MouseEvent('click', { bubbles: true, cancelable: true }));
const type = (w, input, value) => { input.value = value; input.dispatchEvent(new w.Event('input', { bubbles: true })); input.dispatchEvent(new w.Event('change', { bubbles: true })); };
const saved = (w, key = 'sc-smed') => JSON.parse(w.localStorage.getItem(key));
const example = (M) => M.fromExample(read(DATA.en).example, TODAY, (iso, days) => { const d = new Date(`${iso}T00:00:00Z`); d.setUTCDate(d.getUTCDate() + days); return d.toISOString().slice(0, 10); });

test('durations as typed at the machine, and seconds as a clock', () => {
  const M = math();
  assert.equal(M.parseDuration('4:30'), 270);
  assert.equal(M.parseDuration('0:45'), 45);
  assert.equal(M.parseDuration('1:02:30'), 3750);
  assert.equal(M.parseDuration('4.5'), 270, 'a plain number is minutes');
  assert.equal(M.parseDuration('4,5'), 270);
  assert.equal(M.parseDuration('90 s'), 90);
  assert.equal(M.parseDuration('2 min'), 120);
  assert.ok(Number.isNaN(M.parseDuration('')));
  assert.ok(Number.isNaN(M.parseDuration('soon')));
  assert.ok(Number.isNaN(M.parseDuration('4:75')));
  assert.equal(M.clock(270), '4:30');
  assert.equal(M.clock(65), '1:05');
  assert.equal(M.clock(3750), '1:02:30');
  assert.equal(M.clock(-90), '−1:30');
  assert.equal(M.clock(NaN), '–');
});

test('laps: the marks are rounded, then subtracted, so the elements add up to the whole changeover', () => {
  const M = math();
  // Laps at 65.0 s, 190.4 s and 250.0 s after the last good piece.
  assert.deepEqual(plain(M.lapDurations([65000, 190400, 250000])), [{ start: 0, dur: 65 }, { start: 65, dur: 125 }, { start: 190, dur: 60 }]);
  // 0.4 + 0.4 s rounds to marks 0 and 1: the elements are 1 s each, never 0.
  assert.deepEqual(plain(M.lapDurations([400, 800])).map((x) => x.dur), [1, 1]);
  const sum = plain(M.lapDurations([61200, 179900, 2880400])).reduce((s, x) => s + x.dur, 0);
  assert.equal(sum, 2880, 'the laps add up to the rounded last mark');
  assert.equal(M.nextStart([]), 0);
  assert.equal(M.nextStart([{ start: 0, dur: 60 }, { start: 60, dur: 30 }]), 90);
  assert.equal(M.nextStart([{ start: null, dur: 60 }]), null);
});

test('the example by hand: 48:00 observed, 38:30 after separating, 19:00 after the plan, 29 min saved (60 %)', () => {
  const M = math();
  const { elements, study } = example(M);
  assert.equal(elements.length, 13);
  assert.equal(study.date, '2026-10-21');
  // Lapped one after another: the last element ends at 48:00.
  assert.equal(elements.at(-1).start + elements.at(-1).dur, 2880);
  const r = plain(M.analyse(elements, { perWeek: 8, costPerMinute: 6, weeks: 48, target: 1200 }));
  // 300+120+180+240+300+210+150+360+270+90+360+150+150 = 2880, all with the machine stopped.
  assert.equal(r.before.downtime, 2880);
  assert.equal(r.before.work, 2880);
  assert.equal(r.before.span, 2880);
  assert.equal(r.before.gap, 0);
  assert.equal(r.before.external, 0);
  // Step 2: elements 1, 2 and 13 are external (300 + 120 + 150 = 570).
  assert.deepEqual(r.separated, { internal: 2310, external: 570 });
  assert.equal(r.separationSaving, 570);
  // After: 150+120+150+180+90+150+30+180+90 = 1140 internal, one person; 240+60+360+150 = 810 external.
  assert.equal(r.after.downtime, 1140);
  assert.equal(r.after.labour, 1140);
  assert.equal(r.after.external, 810);
  assert.equal(r.after.converted, 1, 'the heating of the jaws became external');
  assert.equal(r.after.removed, 0);
  assert.deepEqual(r.after.lanes, [{ who: 'Operator', seconds: 1140, count: 9 }]);
  assert.equal(r.saving, 1740);
  close(r.savingShare, 1740 / 2880, 'saving share');
  assert.equal(Math.round(r.savingShare * 100), 60);
  assert.equal(r.targetMet, true);
  assert.equal(r.singleMinute, false, '19 min is not single-minute');
  assert.equal(r.untimed, 0);
});

test('freed time and money by hand: 29 min × 8 a week = 232 min, × 48 weeks = 11,136 min; at € 6 = € 1,392 and € 66,816', () => {
  const M = math();
  const f = plain(M.freed(1740, 8, 6, 48));
  close(f.minutesWeek, 232, 'minutes a week');
  close(f.minutesYear, 11136, 'minutes a year');
  close(f.euroWeek, 1392, 'euro a week');
  close(f.euroYear, 66816, 'euro a year');
  // Without a cost, only the minutes; without weeks, only the week; without changeovers, nothing.
  assert.deepEqual(plain(M.freed(1740, 8, NaN, 48)), { minutesWeek: 232, minutesYear: 11136, euroWeek: null, euroYear: null });
  assert.deepEqual(plain(M.freed(600, 5, 2, NaN)), { minutesWeek: 50, minutesYear: null, euroWeek: 100, euroYear: null });
  assert.equal(M.freed(1740, 0, 6, 48), null);
  assert.equal(M.freed(1740, NaN, 6, 48), null);
  const r = plain(M.analyse(example(M).elements, { perWeek: 8, costPerMinute: 6, weeks: 48 }));
  close(r.freed.euroYear, 66816, 'the example a year');
});

test('batch size: the same changeover minutes allow before ÷ after the changeovers; EOQ falls with the square root', () => {
  const M = math();
  const b = plain(M.batch(2880, 1140, 8));
  close(b.ratio, 1140 / 2880, 'ratio');
  close(b.eoq, Math.sqrt(1140 / 2880), 'EOQ factor');
  assert.equal(Math.round(b.eoq * 100), 63);
  close(b.changeovers, 8 * 2880 / 1140, 'changeovers a week');
  assert.equal(Math.round(b.changeovers * 10) / 10, 20.2);
  assert.equal(M.batch(2880, 2880, 8), null, 'no saving, no effect');
  assert.equal(M.batch(0, 0, 8), null);
  assert.equal(plain(M.batch(600, 150, 0)).changeovers, null);
  close(plain(M.batch(600, 150, 0)).eoq, 0.5, '√(150/600)');
});

test('the Pareto of the stop by category, before and after, by hand', () => {
  const M = math();
  const { elements } = example(M);
  const before = plain(M.pareto(elements, 'before'));
  // Preparation 300+120+180+360+150 = 1110, mounting 240+300+210+150 = 900, trial runs 360+150 = 510, setting 270+90 = 360.
  assert.deepEqual(before.map((x) => [x.cat, x.seconds]), [['prep', 1110], ['mount', 900], ['trial', 510], ['measure', 360]]);
  close(before[0].share, 1110 / 2880, 'preparation share');
  close(before[1].cum, 2010 / 2880, 'cumulative after two');
  close(before.at(-1).cum, 1, 'all of it');
  const after = plain(M.pareto(elements, 'after'));
  // Internal after: mounting 120+150+180+90 = 540, trial runs 180+90 = 270, setting 150+30 = 180, preparation 150.
  assert.deepEqual(after.map((x) => [x.cat, x.seconds]), [['mount', 540], ['trial', 270], ['measure', 180], ['prep', 150]]);
  close(after[0].share, 540 / 1140, 'mounting after');
  // Running work does not count; a tie keeps the order of the four categories.
  assert.deepEqual(plain(M.pareto([{ cat: 'trial', dur: 60 }, { cat: 'prep', dur: 60 }, { cat: 'mount', dur: 500, now: 'running' }])).map((x) => x.cat), ['prep', 'trial']);
});

test('people in parallel: the machine stands as long as the longest person; an element without a person goes to the first named', () => {
  const M = math();
  const els = [
    { cat: 'mount', dur: 400, after: 'internal', afterDur: 300, who: 'Anna' },
    { cat: 'mount', dur: 300, after: 'internal', afterDur: 200, who: 'Ben' },
    { cat: 'measure', dur: 200, after: 'internal', afterDur: 100, who: ' anna ' },
    { cat: 'trial', dur: 100, after: 'internal', afterDur: 50, who: '' },
    { cat: 'prep', dur: 250, after: 'external', afterDur: 250, who: 'Ben' },
    { cat: 'prep', dur: 90, after: 'removed', afterDur: 90, who: 'Ben' },
  ];
  const r = plain(M.analyse(els));
  assert.deepEqual(r.after.lanes, [{ who: 'Anna', seconds: 450, count: 3 }, { who: 'Ben', seconds: 200, count: 1 }]);
  assert.equal(r.after.downtime, 450, 'max(300 + 100 + 50, 200)');
  assert.equal(r.after.labour, 650);
  assert.equal(r.after.external, 250);
  assert.equal(r.after.removed, 1);
  assert.equal(r.before.downtime, 1340);
  assert.equal(r.saving, 890);
  // Undecided: done stopped today counts internal, running counts external; the plan keeps the step-2 answer.
  assert.equal(M.kindOf({ now: 'stopped' }), 'internal');
  assert.equal(M.kindOf({ now: 'running' }), 'external');
  assert.equal(M.afterOf({ kind: 'external' }), 'external');
  assert.equal(M.afterDurOf({ dur: 120 }), 120, 'no planned time keeps the observed one');
  assert.equal(M.afterDurOf({ dur: 120, after: 'removed', afterDur: 60 }), 0);
});

test('clock times: gaps between the elements count in the stop, two people at once count once', () => {
  const M = math();
  const gap = plain(M.analyse([{ cat: 'prep', start: 0, dur: 120 }, { cat: 'mount', start: 180, dur: 120 }]));
  assert.equal(gap.before.downtime, 300, 'from 0:00 to 5:00');
  assert.equal(gap.before.work, 240);
  assert.equal(gap.before.gap, 60);
  const overlap = plain(M.analyse([{ cat: 'mount', start: 0, dur: 300 }, { cat: 'mount', start: 60, dur: 120 }]));
  assert.equal(overlap.before.downtime, 300);
  assert.equal(overlap.before.gap, -120);
  // Without a clock time on every stopped element, the stop is the sum.
  assert.equal(plain(M.analyse([{ cat: 'prep', start: 0, dur: 120 }, { cat: 'mount', start: null, dur: 60 }])).before.downtime, 180);
});

test('the changeover standard: before the stop, machine stopped, after the restart, in the order of the study', () => {
  const M = math();
  const { elements } = example(M);
  const s = plain(M.standard(elements));
  assert.deepEqual(s.before.map((e) => e.index + 1), [1, 2, 8]);
  assert.deepEqual(s.stopped.map((e) => e.index + 1), [3, 4, 5, 6, 7, 9, 10, 11, 12]);
  assert.deepEqual(s.after.map((e) => e.index + 1), [13]);
  assert.equal(s.before.reduce((sum, e) => sum + e.seconds, 0), 660);
  // Without a phase: an external element after the last internal one is put away after the restart.
  const els = [{ kind: 'external' }, { after: 'internal' }, { kind: 'external' }, { after: 'removed' }, { kind: 'internal', after: 'external' }];
  assert.deepEqual([0, 2, 4].map((i) => M.phaseOf(els, i)), ['before', 'after', 'before'], 'a converted element is prepared before the stop');
  assert.equal(M.phaseOf([{ after: 'external', phase: 'after' }, { after: 'internal' }], 0), 'after');
  assert.equal(plain(M.standard(els)).stopped.length, 1, 'the eliminated element is not on the standard');
});

test('pasted rows: element, category by number, key or name, duration, internal or external', () => {
  const M = math();
  const cats = read(DATA.en).categories;
  const { added, skipped } = M.parseElements('Element\tCategory\tDuration\tType\nFetch parts\t1\t5:00\texternal\nSwap jaws\tMounting\t2,5\tinternal\nSet rails\tmeasure\t90 s\t\nNo time\t2\t\t\nBad category\tcoffee\t1:00\t', cats);
  assert.equal(skipped, 2);
  assert.deepEqual(plain(added).map((e) => [e.name, e.cat, e.dur, e.kind]), [['Fetch parts', 'prep', 300, 'external'], ['Swap jaws', 'mount', 150, 'internal'], ['Set rails', 'measure', 90, '']]);
  const de = M.parseElements('Backen tauschen;Ab- und Anbauen;3:00;intern', read(DATA.de).categories);
  assert.deepEqual(plain(de.added).map((e) => [e.cat, e.dur, e.kind]), [['mount', 180, 'internal']]);
  // A damaged element is rebuilt with safe values.
  assert.deepEqual((({ id, ...rest }) => rest)(plain(M.cleanElement({ name: 7, cat: 'x', dur: -4, start: 'a', now: 'later', kind: 'maybe', after: 'gone', afterDur: '9', due: '24.10.2026', phase: 'never' }))),
    { name: '', cat: 'prep', start: null, dur: 0, now: 'stopped', kind: '', after: '', afterDur: null, who: '', convert: '', streamline: '', note: '', owner: '', due: '', check: '', phase: '' });
});

// The shape of a value: object keys and array lengths, not the words (they are translated).
const shape = (value) => (Array.isArray(value) ? value.map(shape) : value && typeof value === 'object'
  ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, shape(value[key])])) : typeof value);

test('the three data files share one shape, the same numbers and keys, and their own storage key', () => {
  const en = read(DATA.en);
  assert.equal(en.storageKey, 'sc-smed');
  const numbers = (d) => d.example.elements.map(({ cat, dur, kind, after, afterDur, convert, streamline, due, phase }) => [cat, dur, kind, after, afterDur, convert, streamline, due, phase]);
  for (const lang of ['de', 'sq']) {
    const other = read(DATA[lang]);
    assert.equal(other.storageKey, `sc-smed-${lang}`, `${lang} keeps its own work`);
    assert.deepEqual(shape(other), shape(en), `${lang} shape`);
    assert.deepEqual(numbers(other), numbers(en), `${lang}: the example's numbers`);
    assert.deepEqual(other.categories.map((c) => [c.key, c.typical]), en.categories.map((c) => [c.key, c.typical]));
    assert.deepEqual(other.measures.map((m) => [m.key, m.step]), en.measures.map((m) => [m.key, m.step]));
    assert.deepEqual(['date', 'target', 'perWeek', 'costMin', 'weeks'].map((k) => other.example[k]), ['date', 'target', 'perWeek', 'costMin', 'weeks'].map((k) => en.example[k]));
    // The people of the example are the same two in each language, so the lanes are the same.
    assert.deepEqual([...new Set(other.example.elements.map((e) => e.who))].length, 2);
    for (const [key, value] of Object.entries(other.text)) assert.ok(value.trim(), `${lang} text.${key}`);
  }
  // Shingo's four categories with the shares of a traditional changeover: 30, 5, 15 and 50 %.
  assert.deepEqual(en.categories.map((c) => [c.key, c.typical]), [['prep', 0.3], ['mount', 0.05], ['measure', 0.15], ['trial', 0.5]]);
  close(en.categories.reduce((s, c) => s + c.typical, 0), 1, 'the shares add up');
  assert.equal(en.steps.length, 5);
  assert.deepEqual(Object.keys(en.advice).sort(), ['measure', 'mount', 'prep', 'trial']);
  assert.ok(en.measures.filter((m) => m.step === 3).length >= 4 && en.measures.filter((m) => m.step === 4).length >= 5);
  const keys = new Set(en.measures.map((m) => m.key));
  assert.ok(en.example.elements.every((e) => (!e.convert || en.measures.find((m) => m.key === e.convert).step === 3) && (!e.streamline || en.measures.find((m) => m.key === e.streamline).step === 4) && [e.convert, e.streamline].every((k) => !k || keys.has(k))));
  for (const lang of ['en', 'de', 'sq']) {
    const M = load({ lang, page: false }).SmedMath;
    const d = read(DATA[lang]);
    const r = M.analyse(M.fromExample(d.example, TODAY, null).elements);
    assert.deepEqual([r.before.downtime, r.after.downtime, r.after.external, r.after.lanes.length], [2880, 1140, 810, 1], `${lang} example`);
  }
});

test('a first visit opens on the example with a rich result; nothing is saved until the visitor acts; clearing it empties the page', () => {
  const w = load();
  const d = w.document;
  const results = d.querySelector('[data-results]');
  assert.equal(results.hidden, false);
  assert.equal(results.querySelector('h2').textContent, 'From 48 min to 19 min with the machine stopped');
  const stats = [...results.querySelectorAll('.dl-stats > .dl-stat')].map((s) => s.textContent);
  assert.match(stats[0], /^Before48:00/);
  assert.match(stats[1], /^After separation alone38:30/);
  assert.match(stats[2], /^After19:00/);
  assert.match(stats[3], /^Saving60%29 min less/);
  assert.match(stats[4], /^External13:30/);
  assert.match(stats[5], /^Freed per week232 min€1,392\.00 at €6\.00/);
  assert.ok(results.querySelectorAll('svg').length >= 3, 'elements, steps and Pareto');
  assert.match(results.querySelector('.dl-focus h3').textContent, /Mounting and removing · 9:00 of 19:00/);
  assert.match(results.querySelector('.sm-batch').textContent, /20\.2 times instead of 8: batches of 40%/);
  assert.match(results.querySelector('.sm-batch').textContent, /= 63% of today's/);
  assert.match(results.textContent, /11,136 min · €66,816\.00 · 48 working weeks/);
  assert.equal(results.querySelectorAll('.sm-table tbody tr').length, 13);
  assert.equal(results.querySelectorAll('.sm-pareto tbody tr').length, 4);
  assert.equal(d.querySelectorAll('.sm-el').length, 13);
  assert.equal(d.querySelector('[data-step="1"]').getAttribute('aria-current'), 'step');
  assert.ok([...d.querySelectorAll('[data-step-state]')].every((s) => /done/.test(s.textContent)), 'the example is complete in every step');
  const note = d.querySelector('.dl-example-note');
  assert.equal(note.hidden, false);
  assert.equal(w.localStorage.getItem('sc-smed'), null, 'nothing is written until the visitor acts');
  click(w, note.querySelector('button'));
  assert.equal(results.hidden, true);
  assert.equal(saved(w).elements.length, 0);
  assert.equal(d.querySelector('[data-empty]').hidden, false);
  assert.equal(saved(w).study.weeks, '48');
});

test('the stopwatch: start at the last good piece, laps close the elements, stop at the first good piece, undo the last lap', () => {
  const clock = { t: 1000 };
  const w = load({ storage: { 'sc-smed': { study: {}, elements: [], step: 1 } }, clock });
  const d = w.document;
  click(w, d.querySelector('[data-start]'));
  assert.equal(d.querySelector('[data-start]').hidden, true);
  d.querySelector('[data-watch-name]').value = 'Fetch the parts';
  clock.t = 1000 + 65000;
  click(w, d.querySelector('[data-lap]'));
  d.querySelector('[data-watch-cat]').value = 'mount';
  clock.t = 1000 + 190400;
  click(w, d.querySelector('[data-lap]'));
  clock.t = 1000 + 250000;
  click(w, d.querySelector('[data-stop]'));
  let els = saved(w).elements;
  assert.deepEqual(els.map((e) => [e.name, e.cat, e.start, e.dur, e.now]), [['Fetch the parts', 'prep', 0, 65, 'stopped'], ['', 'mount', 65, 125, 'stopped'], ['', 'mount', 190, 60, 'stopped']]);
  assert.match(d.querySelector('[data-totals]').textContent, /3 elements · Before: 4:10 machine stopped/);
  // A second run continues the clock; a lap pressed too early is taken back and its time flows on.
  click(w, d.querySelector('[data-start]'));
  clock.t += 10000;
  click(w, d.querySelector('[data-lap]'));
  assert.equal(saved(w).elements.length, 4);
  assert.equal(saved(w).elements[3].start, 250);
  click(w, d.querySelector('[data-undo-lap]'));
  assert.equal(saved(w).elements.length, 3);
  clock.t += 20000;
  click(w, d.querySelector('[data-stop]'));
  els = saved(w).elements;
  assert.deepEqual([els[3].start, els[3].dur], [250, 30]);
});

test('the five steps: separate, convert, streamline and standardise change the result as they are made', () => {
  const w = load({ storage: { 'sc-smed': { study: { machine: 'Line 1' }, step: 1, elements: [
    { id: 'a', name: 'Fetch tools', cat: 'prep', dur: 300, now: 'stopped' },
    { id: 'b', name: 'Swap die', cat: 'mount', dur: 600, now: 'stopped' },
    { id: 'c', name: 'Heat die', cat: 'prep', dur: 400, now: 'stopped' },
  ] } } });
  const d = w.document;
  const results = d.querySelector('[data-results]');
  assert.match(results.querySelector('h2').textContent, /^21\.7 min with the machine stopped: plan the change in steps 2 to 4$/);
  click(w, d.querySelector('[data-step="2"]'));
  const radio = d.querySelector('input[name="sm-kind-0"][value="external"]');
  radio.checked = true;
  radio.dispatchEvent(new w.Event('change', { bubbles: true }));
  assert.equal(saved(w).elements[0].kind, 'external');
  assert.match(d.querySelector('[data-totals]').textContent, /Separated: 16:40/);
  click(w, d.querySelector('[data-step="3"]'));
  const after = d.querySelector('select[data-f="after"][data-i="2"]');
  type(w, after, 'external');
  type(w, d.querySelector('select[data-f="convert"][data-i="2"]'), 'preheat');
  assert.equal(saved(w).elements[2].after, 'external');
  click(w, d.querySelector('[data-next]'));
  assert.equal(d.querySelector('[data-step="4"]').getAttribute('aria-current'), 'step');
  type(w, d.querySelector('input[data-f="afterDur"][data-i="1"]'), '4:00');
  type(w, d.querySelector('input[data-f="note"][data-i="1"]'), 'Quick-release clamps on the die');
  type(w, d.querySelector('input[data-f="owner"][data-i="1"]'), 'Maintenance');
  type(w, d.querySelector('input[data-f="due"][data-i="1"]'), '2026-11-07');
  assert.equal(saved(w).elements[1].afterDur, 240);
  assert.equal(results.querySelector('h2').textContent, 'From 21.7 min to 4 min with the machine stopped');
  assert.match(results.textContent, /Single-minute changeover: under ten minutes/);
  // The element's own hand-off to the Action Tracker.
  const link = [...d.querySelectorAll('[data-card="1"] a')].find((a) => /Add to actions/.test(a.textContent));
  click(w, link);
  const url = new URL(link.href);
  assert.equal(url.pathname, '/tools/action-tracker/');
  assert.equal(url.searchParams.get('action'), 'Quick-release clamps on the die (Swap die)');
  assert.equal(url.searchParams.get('source'), 'smed');
  assert.equal(url.searchParams.get('owner'), 'Maintenance');
  assert.equal(url.searchParams.get('due'), '2026-11-07');
  assert.equal(url.searchParams.get('area'), 'Line 1');
  assert.equal(url.searchParams.get('priority'), 'High');
  assert.match(url.searchParams.get('check'), /Swap die takes 4:00 or less with the machine stopped/);
  click(w, d.querySelector('[data-step="5"]'));
  type(w, d.querySelector('input[data-f="check"][data-i="1"]'), 'Clamps locked');
  type(w, d.querySelector('select[data-f="phase"][data-i="0"]'), 'before');
  const sheet = d.querySelector('[data-standard]');
  assert.equal(sheet.hidden, false);
  assert.match(sheet.textContent, /A · Before the stop \(machine running\) · 11:40/);
  assert.match(sheet.textContent, /B · Machine stopped · 4:00/);
  assert.match(sheet.textContent, /Swap die.*4:00.*Clamps locked/);
});

test('hand-offs: the countermeasures to the Action Tracker, the standard to print and to Standard Work, 5 Whys and OEE', () => {
  const w = load();
  const d = w.document;
  const results = d.querySelector('[data-results]');
  const add = [...results.querySelectorAll('button')].find((b) => /^Add the \d+ countermeasures to actions$/.test(b.textContent));
  assert.equal(add.textContent, 'Add the 12 countermeasures to actions');
  click(w, add);
  const actions = w.ActionsStore.list();
  assert.equal(actions.length, 12);
  assert.ok(actions.every((a) => a.source === 'smed' && a.area === 'Packing line 3 · vertical bagger'));
  const clamps = actions.find((a) => /8 screws/.test(a.title));
  assert.equal(clamps.owner, 'Maintenance');
  assert.equal(clamps.due, '2026-11-21');
  assert.equal(clamps.priority, 'High');
  assert.match(clamps.detail, /Remove the old forming shoulder \(8 screws\), 4:00 internal → 2:00 internal/);
  const jaws = actions.find((a) => /heating station/.test(a.title));
  assert.match(jaws.check, /done while the machine runs, in 6:00 or less/);
  assert.match(results.querySelector('[data-actions-status]').textContent, /Added 12 actions/);
  assert.equal(new URL(results.querySelector('[data-actions-status] a').href).pathname, '/tools/action-tracker/');
  // The printed standard: A4, the three parts, signatures.
  click(w, [...results.querySelectorAll('button')].find((b) => b.textContent === 'Print the changeover standard'));
  const print = d.querySelector('[data-print]');
  assert.equal(print.hidden, false);
  assert.ok(d.documentElement.classList.contains('sm-printing'));
  assert.equal(print.querySelectorAll('tbody tr').length, 13);
  assert.match(print.textContent, /Approved/);
  w.dispatchEvent(new w.Event('afterprint'));
  assert.equal(print.hidden, true);
  // Standard Work opens the file with "Open a template file": its own tool and kind, the stopped steps with times.
  let file = null;
  w.TemplatePack.download = (packed) => { file = packed; };
  click(w, [...results.querySelectorAll('button')].find((b) => b.textContent === 'Save for Standard Work'));
  assert.equal(file.file.tool, 'standard-work');
  assert.equal(file.file.kind, 'standard');
  assert.equal(file.file.data.steps.length, 9);
  assert.deepEqual(file.file.data.steps.map((s) => Number(s.time)).reduce((a, b) => a + b, 0), 1140);
  assert.equal(file.file.data.takt, '1200', 'the target of 20 min');
  assert.equal(file.file.data.steps[2].points[0].type, 'quality');
  const opened = w.TemplatePack.read(file.text, { tool: 'standard-work', kind: 'standard' });
  assert.equal(opened.ok, true);
  const whys = [...results.querySelectorAll('a')].find((a) => /5 Whys/.test(a.textContent));
  assert.equal(new URL(whys.href).searchParams.get('problem'), 'Wait for the new jaws to heat to 165 °C keeps Packing line 3 · vertical bagger stopped for 6:00 at every changeover');
  const oee = [...results.querySelectorAll('a')].find((a) => /Open OEE/.test(a.textContent));
  assert.equal(new URL(oee.href).pathname, '/tools/oee/');
  const sw = [...d.querySelectorAll('aside a')].find((a) => /Standard Work/.test(a.textContent));
  assert.equal(sw.getAttribute('href'), '/tools/standard-work/');
});

test('German and Albanian pages: the example in that language, links keep /de/ and /sq/, the texts are translated', () => {
  for (const lang of ['de', 'sq']) {
    const w = load({ lang });
    const d = w.document;
    const results = d.querySelector('[data-results]');
    assert.equal(results.hidden, false);
    assert.match(results.querySelector('h2').textContent, lang === 'de' ? /^Von 48 min auf 19 min bei stehender Maschine$/ : /^Nga 48 min në 19 min me makinën të ndalur$/);
    click(w, d.querySelector('[data-step="4"]'));
    const tracker = d.querySelector('[data-card="3"] a');
    click(w, tracker);
    assert.ok(tracker, `${lang}: a tracker link`);
    assert.equal(new URL(tracker.href).pathname, `/${lang}/tools/action-tracker/`);
    assert.equal(new URL(tracker.href).searchParams.get('owner'), lang === 'de' ? 'Instandhaltung' : 'Mirëmbajtja');
    assert.equal(new URL(tracker.href).searchParams.get('source'), 'smed');
    assert.equal(new URL([...results.querySelectorAll('a')].find((a) => /five-whys/.test(a.href)).href).pathname, `/${lang}/tools/five-whys/`);
    assert.equal(new URL([...results.querySelectorAll('a')].find((a) => /\/oee\//.test(a.href)).href).pathname, `/${lang}/tools/oee/`);
    assert.doesNotMatch(results.textContent, /machine stopped|Freed per week|Before and after/);
    // Choosing a step is saved under the language's own key; the example stays the example.
    assert.equal(saved(w, `sc-smed-${lang}`).example, true);
    assert.equal(saved(w, `sc-smed-${lang}`).step, 4);
    assert.equal(w.localStorage.getItem('sc-smed'), null, `${lang}: the English study is not touched`);
  }
});

test('every text of the page and the script has a German and an Albanian translation', () => {
  const ui = { de: read('src/_data/de/ui.json'), sq: read('src/_data/sq/ui.json') };
  const own = read('src/_data/i18n-parts/smed.json');
  const njk = fs.readFileSync('src/_includes/partials/smed.njk', 'utf8');
  const js = fs.readFileSync('src/js/smed.js', 'utf8');
  const texts = new Set([...njk.matchAll(/\{\{\s*["']((?:[^"'\\]|\\.)*)["']\s*\|\s*t\(lang\)/g)].map((m) => m[1]));
  for (const m of js.matchAll(/\btx\("((?:[^"\\]|\\.)*)"/g)) texts.add(JSON.parse(`"${m[1]}"`));
  assert.ok(texts.size > 150);
  for (const lang of ['de', 'sq']) {
    const missing = [...texts].filter((text) => (own[lang][text] ?? ui[lang][text]) === undefined);
    assert.deepEqual(missing, [], `${lang}: no translation`);
    Object.entries(own[lang]).forEach(([en, out]) => {
      const vars = (s) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
      assert.deepEqual(vars(out), vars(en), `${lang}: the placeholders of "${en}"`);
    });
  }
  const cards = read('src/_data/i18n-parts/smed.cards.json');
  assert.equal(cards.family, 'lumen');
  assert.deepEqual(['en', 'de', 'sq'].map((lang) => cards.cards[lang].url), ['/tools/smed/', '/de/tools/smed/', '/sq/tools/smed/']);
  assert.deepEqual(['en', 'de', 'sq'].map((lang) => cards.cards[lang].name), ['SMED Changeover', 'SMED-Rüstzeitanalyse', 'SMED: ndërrimi i shpejtë']);
  for (const [file, lang] of [['src/tools/smed.njk', 'en'], ['src/de/tools/smed.njk', 'de'], ['src/sq/tools/smed.njk', 'sq']]) {
    const page = fs.readFileSync(file, 'utf8');
    assert.match(page, lang === 'en' ? /\{% set cfg = smed %\}/ : new RegExp(`\\{% set cfg = ${lang}\\.smed %\\}`));
    const description = page.match(/^description: "(.*)"$/m)[1];
    assert.ok(description.length <= 160, `${file}: ${description.length}`);
  }
});

test('the stylesheet part uses its prefix and the theme variables only', () => {
  const css = fs.readFileSync('src/css/48-smed.css', 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  assert.doesNotMatch(css, /--red|--gold/);
  const classes = [...css.matchAll(/\.([a-z][a-z0-9-]*)/g)].map((m) => m[1]).filter((name) => !/^(dl|ck|fc|kicker|form-note|button|is-|field|optional|num)/.test(name));
  assert.ok(classes.every((name) => name.startsWith('sm-')), classes.filter((name) => !name.startsWith('sm-')).join(', '));
  assert.match(css, /@media print/);
});
