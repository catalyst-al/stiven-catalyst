// Heijunka (src/js/heijunka.js): the arithmetic in window.HeijunkaMath (available time, takt, pitch, utilisation,
// EPEI, containers and runs, the levelled sequence, changeovers, the most runs that fit, the stock in batches and
// levelled, the clock with breaks, the load per hour and its backlog, the heijunka box) against hand-worked values,
// the three data files, and the page: the example on a first visit, the hand-offs, the exports and the texts.
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const nunjucks = require('nunjucks');
const { JSDOM } = require('jsdom');

const plain = (value) => JSON.parse(JSON.stringify(value));
const close = (a, b, message, eps = 1e-9) => assert.ok(Math.abs(a - b) < eps, `${message}: ${a} vs ${b}`);
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const DATA = { en: 'src/_data/heijunka.json', de: 'src/_data/de/heijunka.json', sq: 'src/_data/sq/heijunka.json' };

const env = new nunjucks.Environment(new nunjucks.FileSystemLoader('src/_includes'), { autoescape: false });
env.addFilter('t', (text) => text);
env.addFilter('local', (url, lang) => (lang && lang !== 'en' ? `/${lang}${url}` : url));
env.addFilter('assetUrl', (url) => url);
env.addFilter('scriptJson', (value) => JSON.stringify(value).replace(/</g, '\\u003c'));
const partial = (lang) => env.render('partials/heijunka.njk', { cfg: read(DATA[lang]), lang: lang === 'en' ? undefined : lang }).replace(/<script src=[^>]*><\/script>/g, '');
const strings = (lang) => ({ ...read(`src/_data/${lang}/ui.json`), ...read('src/_data/i18n-parts/heijunka.json')[lang] });

const load = ({ lang = 'en', page = true, storage = {} } = {}) => {
  const base = lang === 'en' ? '' : `/${lang}`;
  const html = `<html lang="${lang}"><body><main id="main">${page ? partial(lang) : ''}</main></body></html>`;
  const dom = new JSDOM(html, { url: `https://example.test${base}/tools/heijunka/`, runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  w.confirm = () => true;
  w.print = () => {};
  w.HTMLElement.prototype.scrollIntoView = () => {};
  w.URL.createObjectURL = () => 'blob:test';
  w.URL.revokeObjectURL = () => {};
  if (lang !== 'en') w.UiStrings = strings(lang);
  Object.entries(storage).forEach(([key, value]) => w.localStorage.setItem(key, JSON.stringify(value)));
  for (const file of ['tool-kit', 'chart-kit', 'actions-store', 'heijunka']) w.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  w.document.addEventListener('click', (event) => { if (event.target.closest('a')) event.preventDefault(); });
  return w;
};
const math = () => load({ page: false }).HeijunkaMath;
const click = (w, node) => node.dispatchEvent(new w.MouseEvent('click', { bubbles: true, cancelable: true }));
const type = (w, input, value) => { input.value = value; input.dispatchEvent(new w.Event('input', { bubbles: true })); };
const saved = (w, key = 'sc-heijunka') => JSON.parse(w.localStorage.getItem(key));
// The example as numbers: 2 shifts of 480 min with 30 min breaks, 20 days, A–D with 12,000 / 6,000 / 4,000 / 2,000.
const example = (M, lang = 'en', change = {}) => {
  const d = read(DATA[lang]).example;
  const n = M.numbers(M.cleanLine({ ...d.line, ...change }), d.products.map(M.cleanProduct));
  return M.analyse(n.line, n.products);
};

test('available time, daily demand, takt and pitch by hand', () => {
  const M = math();
  // 2 × (480 − 30) = 900 min a day.
  assert.equal(M.available(2, 480, 30), 900);
  assert.equal(M.available(3, 480, 0), 1440);
  assert.equal(M.available(0, 480, 30), 0);
  assert.equal(M.available(1, 20, 30), 0, 'breaks longer than the shift leave nothing');
  assert.equal(M.daily(12000, 20), 600);
  assert.equal(M.daily(5, 0), 0);
  // Takt = 54,000 s ÷ 1,200 units = 45 s; pitch = 45 s × 20 = 900 s (15 min), × 10 = 450 s.
  assert.equal(M.takt(54000, 1200), 45);
  assert.equal(M.takt(54000, 0), null);
  assert.equal(M.pitch(45, 20), 900);
  assert.equal(M.pitch(45, 10), 450);
  assert.equal(M.pitch(null, 10), null);
});

test('utilisation: Σ(daily demand × cycle time) against the available time, with the 85 % and 100 % lines', () => {
  const M = math();
  // 600 × 27 + 300 × 36 + 200 × 45 + 100 × 60 = 42,000 s of 54,000 s = 77.8 %.
  const u = M.utilisation([{ daily: 600, cycle: 27 }, { daily: 300, cycle: 36 }, { daily: 200, cycle: 45 }, { daily: 100, cycle: 60 }], 54000);
  assert.equal(u.runSec, 42000);
  close(u.share, 7 / 9, 'share');
  assert.equal(u.state, 'ok');
  // 1,000 × 45 s = 45,000 s of 54,000 s = 83.3 %: still below the 85 % line.
  assert.equal(M.utilisation([{ daily: 1000, cycle: 45 }], 54000).state, 'ok');
  assert.equal(M.utilisation([], 0).state, 'none');
});

test('the 85 % and 100 % lines exactly', () => {
  const M = math();
  assert.equal(M.utilisation([{ daily: 1000, cycle: 45.9 }], 54000).state, 'ok', '85.0 % is not above 85 %');
  assert.equal(M.utilisation([{ daily: 1000, cycle: 46 }], 54000).state, 'tight', '85.2 %');
  assert.equal(M.utilisation([{ daily: 1000, cycle: 54 }], 54000).state, 'tight', '100 % exactly is tight, not over');
  assert.equal(M.utilisation([{ daily: 1000, cycle: 55 }], 54000).state, 'over', '101.9 %');
});

test('EPEI = Σ changeovers ÷ (available − run time), in days; not possible when the run takes all the time', () => {
  const M = math();
  // 20 min ÷ (900 − 700) min = 0.1 days.
  close(M.epei(20, 900, 700), 0.1, 'example');
  close(M.epei(300, 900, 700), 1.5, 'longer than a day');
  assert.equal(M.epei(0, 900, 700), 0);
  assert.equal(M.epei(20, 900, 900), null);
  assert.equal(M.epei(20, 900, 950), null);
});

test('containers and runs: full containers with the rest in the last; runs split evenly, the first take the one left over', () => {
  const M = math();
  assert.deepEqual(plain(M.containers(600, 20)).length, 30);
  assert.deepEqual(plain(M.containers(610, 24)), [...Array(25).fill(24), 10]);
  assert.deepEqual(plain(M.containers(0, 20)), []);
  assert.deepEqual(plain(M.containers(5, 10)), [5]);
  assert.deepEqual(plain(M.splitRuns(30, 4)), [8, 8, 7, 7]);
  assert.deepEqual(plain(M.splitRuns(15, 4)), [4, 4, 4, 3]);
  assert.deepEqual(plain(M.splitRuns(10, 4)), [3, 3, 2, 2]);
  assert.deepEqual(plain(M.splitRuns(3, 5)), [1, 1, 1], 'never more runs than containers');
  assert.deepEqual(plain(M.splitRuns(0, 4)), []);
});

test('the example by hand: takt 45 s, 77.8 %, EPEI 0.1 days, 4 runs a day in 16 runs that fill the day exactly', () => {
  const M = math();
  const r = example(M);
  assert.equal(r.availableMin, 900);
  assert.equal(r.totalDaily, 1200);
  assert.equal(r.takt, 45);
  assert.deepEqual(plain(r.pitches), [900, 900, 450, 450]);
  assert.equal(r.runMin, 700);
  close(r.load.share, 7 / 9, 'utilisation');
  assert.equal(r.changeoverSum, 20);
  close(r.epei, 0.1, 'EPEI');
  close(r.epeiShifts, 0.2, 'EPEI in shifts');
  close(r.epeiMinutes, 90, 'EPEI in productive minutes');
  assert.equal(r.runs, 4);
  assert.equal(r.fits, 10, '10 runs × 20 min = 200 min = the free time exactly');
  assert.equal(r.most, 30);
  // Four runs each: A 8, 8, 7, 7 containers; B 4, 4, 4, 3; C 5 each; D 3, 3, 2, 2. All four products share each
  // ideal position, so goal chasing orders them. The day's rate is 700 ÷ 900 = 7/9 of work per minute; a run moves the
  // balance by its work − 7/9 × its time: A8 72 − 93.3 = −21.3, B4 48 − 46.7 = +1.3, C5 37.5 − 29.2 = +8.3,
  // D3 30 − 17.5 = +12.5. From 0: B (+1.3), then C (+9.7, against A −20.0 and D +13.8), then A (−11.7), then D (+0.8).
  const names = 'ABCD';
  assert.equal(r.seq.map((run) => `${names[run.index]}${run.containers}`).join(' '), 'B4 C5 A8 D3 B4 C5 A8 D3 B4 C5 A7 D2 B3 C5 A7 D2');
  assert.deepEqual(plain(r.seq.map((run) => run.start)), [0, 60, 97.5, 217.5, 240, 300, 337.5, 457.5, 480, 540, 577.5, 682.5, 697.5, 742.5, 780, 885]);
  assert.equal(r.seq.at(-1).end, 900, 'the pitches add up to the available time');
  assert.equal(r.seq.reduce((s, run) => s + run.units, 0), 1200);
  // Every switch, D → A into the next day included: 16 changeovers, 4 × 20 = 80 min.
  assert.equal(r.switches.count, 16);
  assert.equal(r.switches.minutes, 80);
  close(r.levelShare, 780 / 900, 'run + changeovers');
  assert.equal(r.levelFits, true);
  // Batches once a week (5 days): 4 changeovers ÷ 5 = 0.8 a day, 20 ÷ 5 = 4 min.
  assert.deepEqual(plain(r.batch), { days: 5, assumed: false, perDay: 0.8, minutesPerDay: 4 });
});

test('finished stock by hand: 6,000 units in weekly batches against 320 levelled (the largest run of each)', () => {
  const M = math();
  const r = example(M);
  assert.deepEqual(plain(r.stock.map((s) => s.batch)), [3000, 1500, 1000, 500]);
  assert.deepEqual(plain(r.stock.map((s) => s.levelled)), [160, 80, 50, 30]);
  assert.deepEqual(plain(r.stock.map((s) => s.container)), [20, 20, 10, 10]);
  assert.equal(r.batchStock, 6000);
  assert.equal(r.levelStock, 320);
  close(r.stockCut, 1 - 320 / 6000, 'cut');
  // Fully levelled, one container per run: the levelled stock is one pitch of each product.
  const full = example(M, 'en', { runs: 30 });
  assert.deepEqual(plain(full.stock.map((s) => s.levelled)), [20, 20, 10, 10]);
  assert.equal(full.levelFits, false, 'with 4 to 6 min changeovers the fully mixed day does not fit');
  // No batch interval given: the EPEI rounded up to whole days.
  const assumed = example(M, 'en', { batchDays: '' });
  assert.deepEqual(plain(assumed.batch), { days: 1, assumed: true, perDay: 4, minutesPerDay: 20 });
  assert.equal(assumed.batchStock, 1200);
});

test('changeovers: only switches count, the wrap into the next day too; one product has none', () => {
  const M = math();
  const items = [{ changeover: 5 }, { changeover: 7 }];
  const seq = (list) => list.map((index) => ({ index }));
  assert.deepEqual(plain(M.changeovers(seq([0, 0, 1, 0]), items)), { count: 2, minutes: 12, at: [2, 3] });
  assert.deepEqual(plain(M.changeovers(seq([0, 1, 0, 1]), items)), { count: 4, minutes: 24, at: [0, 1, 2, 3] });
  assert.deepEqual(plain(M.changeovers(seq([0]), items)), { count: 0, minutes: 0, at: [] });
  assert.deepEqual(plain(M.changeovers(seq([0, 0]), items)).count, 0);
});

test('the sequence spreads products by their ideal position, deterministically', () => {
  const M = math();
  // A 3 containers, B 1, takt 60 s, one unit a container: A at 1/6, 3/6, 5/6, B at 1/2. B ties with A's second run;
  // without cycle times goal chasing has nothing to choose by, so the product listed first goes first: A A B A.
  const items = [{ daily: 3, packout: 1, changeover: 1 }, { daily: 1, packout: 1, changeover: 1 }];
  assert.deepEqual(plain(M.sequence(items, 10, 60).map((run) => run.index)), [0, 0, 1, 0]);
  assert.deepEqual(plain(M.sequence(items, 1, 60).map((run) => [run.index, run.containers])), [[0, 3], [1, 1]]);
  // 2 : 1 interleaves A B A: positions 1/4, 3/4 against 1/2.
  const two = [{ daily: 2, packout: 1 }, { daily: 1, packout: 1 }];
  assert.deepEqual(plain(M.sequence(two, 5, 60).map((run) => run.index)), [0, 1, 0]);
  assert.deepEqual(plain(M.sequence(two, 5, 60).map((run) => run.end)), [1, 2, 3]);
  assert.deepEqual(plain(M.sequence(two, 5, null)), []);
});

test('the clock: shifts follow each other, breaks in the middle of each shift', () => {
  const M = math();
  const shift = { start: 360, shiftMin: 480, breakMin: 30, shifts: 2 };
  const at = (pm, end) => M.hhmm(M.clockAt(pm, shift, end));
  assert.equal(at(0), '06:00');
  assert.equal(at(120), '08:00');
  assert.equal(at(217.5), '09:38', '09:37:30 rounds to the minute');
  assert.equal(at(225), '10:15', 'a run starting at the break starts after it');
  assert.equal(at(225, true), '09:45', 'a run ending at the break ends before it');
  assert.equal(at(240, true), '10:30');
  assert.equal(at(450, true), '14:00', 'the end of the first shift');
  assert.equal(at(450), '14:00', 'the start of the second');
  assert.equal(at(585, true), '16:15');
  assert.equal(at(682.5), '18:23');
  assert.equal(at(900, true), '22:00');
  assert.equal(M.hhmm(M.clockAt(30, { start: 1380, shiftMin: 480, breakMin: 0, shifts: 1 })), '23:30');
  assert.equal(M.hhmm(M.clockAt(90, { start: 1380, shiftMin: 480, breakMin: 0, shifts: 1 })), '00:30', 'past midnight');
  assert.equal(M.parseClock('06:00'), 360);
  assert.equal(M.parseClock('6'), 360);
  assert.equal(M.parseClock('22.30'), 1350);
  assert.equal(M.parseClock('25:00'), null);
  assert.equal(M.parseClock(''), null);
});

test('load per hour by hand: levelled at most 102.5 %, batches end at 133.3 %; the backlog 3 min against 20 min', () => {
  const M = math();
  const r = example(M);
  const lev = r.hourly.levelled, blk = r.hourly.blocks;
  assert.equal(lev.length, 15);
  // Hour 1: B runs 60 min at 36 ÷ 45 = 80 % = 48 min, plus the 4 min changeover from D into B = 52 ÷ 60.
  close(lev[0].share, 52 / 60, 'hour 1');
  // Hour 2: C 37.5 min at 100 % + A 22.5 min at 60 % = 51, plus 6 + 4 min changeovers = 61 ÷ 60.
  close(lev[1].share, 61 / 60, 'hour 2');
  // Hour 3: A 60 min at 60 % = 36 ÷ 60. Hour 4: A 37.5 × 60 % + D 22.5 × 133.3 % + 6 = 58.5 ÷ 60.
  close(lev[2].share, 0.6, 'hour 3');
  close(lev[3].share, 58.5 / 60, 'hour 4');
  close(Math.max(...lev.map((h) => h.share)), 61.5 / 60, 'the highest levelled hour');
  // In one block each (goal chasing again: B, C, A, D): B to 225 at 80 %, C to 375 at 100 %, A to 825 at 60 %, D to 900.
  close(blk[1].share, 0.8, 'batch hour 2');
  close(blk[14].share, 80 / 60, 'batch hour 15: D at 133.3 %');
  close(blk[13].share, (27 + 20 + 6) / 60, 'batch hour 14: A 45 × 60 % = 27, D 15 × 4/3 = 20, changeover 6');
  // The work of the day adds up: 700 min run + the changeovers.
  close(lev.reduce((s, h) => s + h.work, 0), 780, 'levelled work', 1e-6);
  close(blk.reduce((s, h) => s + h.work, 0), 720, 'batch work', 1e-6);
  // Backlog: levelled 1.5 + 1.5 = 3 min in hours 12 and 13 at worst; in batches 20 min in the last hour.
  close(M.backlog(lev), 3, 'levelled backlog', 1e-6);
  close(M.backlog(blk), 20, 'batch backlog', 1e-6);
  close(M.backlog([{ work: 70, length: 60 }, { work: 55, length: 60 }, { work: 80, length: 60 }]), 25, 'carried: 10, 5, 25');
});

test('the heijunka box: one column per pitch of the largest product, cards where each container starts', () => {
  const M = math();
  const r = example(M);
  assert.equal(r.box.lead, 0);
  assert.equal(r.box.interval, 15);
  assert.equal(r.box.columns, 60);
  const count = (row, col) => r.box.cells[row][col].length;
  assert.equal(r.box.cells.flat().reduce((s, cards) => s + cards.length, 0), 75, '30 + 15 + 20 + 10 cards');
  assert.deepEqual([count(1, 0), count(1, 3), count(1, 4), count(0, 5), count(0, 6), count(0, 13)], [1, 1, 0, 0, 1, 1]);
  // C has a pitch of 7.5 min: two cards a column from 07:00; A's first card (97.5) shares column 6 with C's last (90).
  assert.deepEqual([count(2, 4), count(2, 5), count(2, 6), count(3, 14), count(3, 15)], [2, 2, 1, 1, 2]);
});

test('edge cases: overloaded, EPEI not possible, EPEI above a day, no changeovers', () => {
  const M = math();
  const d = read(DATA.en).example;
  const run = (products, line = {}) => { const n = M.numbers(M.cleanLine({ ...d.line, ...line }), products.map(M.cleanProduct)); return M.analyse(n.line, n.products); };
  // Cycle times × 1.4: 980 min of 900: over, no EPEI.
  const heavy = run(d.products.map((p) => ({ ...p, cycle: p.cycle * 1.4 })));
  assert.equal(heavy.load.state, 'over');
  assert.equal(heavy.epei, null);
  assert.equal(heavy.fits, 0);
  assert.equal(heavy.runs, 4, 'the runs asked are still shown');
  // Changeovers of 75 min each: 300 ÷ 200 = 1.5 days; not even one run a day fits.
  const long = run(d.products.map((p) => ({ ...p, changeover: 75 })), { runs: '', batchDays: '' });
  close(long.epei, 1.5, 'EPEI');
  assert.equal(long.fits, 0);
  assert.equal(long.runs, 1);
  assert.equal(long.levelFits, false);
  assert.equal(long.batch.days, 2, 'EPEI 1.5 rounded up when no interval is given');
  // No changeover time: every product every pitch, the most runs fit.
  const free = run(d.products.map((p) => ({ ...p, changeover: 0 })), { runs: '' });
  assert.equal(free.epei, 0);
  assert.equal(free.runs, 30);
  // A product without demand is left out; text that is not a number is ignored.
  const partial = run([...d.products, { name: 'E', demand: '', cycle: 'x', packout: 10, changeover: 3 }]);
  assert.equal(partial.active.length, 4);
  assert.equal(partial.items.length, 5);
  assert.equal(partial.takt, 45);
});

// Audit 27 Oct 2026, P2B-04: 20,000 units a week at a pack-out of 1 took 4.6 s per keystroke (maxRuns built the whole
// sequence for every run count up to the number of containers), and a demand of 1,000,000,000 hung the tab.
const LINE3 = { shifts: 3, shiftMin: 480, breakMin: 30, days: 5, runs: NaN, batchDays: NaN };
const timed = (fn) => { const t = process.hrtime.bigint(); const value = fn(); return { value, ms: Number(process.hrtime.bigint() - t) / 1e6 }; };
test('large volumes stay fast: 20,000 units a week at a pack-out of 1 in under 300 ms', () => {
  const M = math();
  const { value: r, ms } = timed(() => M.analyse(LINE3, [{ name: 'A', demand: 20000, cycle: 1, packout: 1, changeover: 1 }, { name: 'B', demand: 10000, cycle: 1, packout: 1, changeover: 1 }]));
  assert.ok(ms < 300, `analyse took ${Math.round(ms)} ms`);
  assert.equal(r.too, null);
  assert.ok(r.fits > 0 && r.seq.length > 0, 'a plan');
  assert.equal(r.seq.reduce((s, run) => s + run.units, 0), 6000, 'the whole day is in the sequence');
  // The quick search finds the same most runs as trying every count, including where more runs fit after fewer did not.
  const brute = (items, t, availableMin, runMin) => {
    let best = 0;
    for (let m = 1; m <= Math.max(0, ...items.map((p) => M.containers(p.daily, p.packout).length)); m += 1) {
      if (runMin + M.changeovers(M.sequence(items, m, t), items).minutes <= availableMin + 1e-9) best = m;
    }
    return best;
  };
  let seed = 7;
  const rand = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
  for (let trial = 0; trial < 300; trial += 1) {
    const items = Array.from({ length: 1 + Math.floor(rand() * 6) }, () => ({ daily: 1 + Math.floor(rand() * 200), packout: 1 + Math.floor(rand() * 20), cycle: rand() * 60, changeover: Math.floor(rand() * 30) }));
    const availableMin = 400 + rand() * 1000;
    const t = (availableMin * 60) / items.reduce((s, p) => s + p.daily, 0);
    const runMin = items.reduce((s, p) => s + p.daily * p.cycle, 0) / 60;
    assert.equal(M.maxRuns(items, t, availableMin, runMin), brute(items, t, availableMin, runMin), `trial ${trial}`);
  }
});

test('input caps: a demand of a billion or a day longer than 24 hours is refused quickly, with a message', () => {
  const M = math();
  const { value: huge, ms } = timed(() => M.analyse(LINE3, [{ name: 'A', demand: 1e9, cycle: 1, packout: 1, changeover: 1 }]));
  assert.ok(ms < 300, `analyse took ${Math.round(ms)} ms`);
  assert.deepEqual(plain(huge.too), { what: 'containers', value: 2e8, max: M.MAX_CONTAINERS });
  assert.deepEqual(plain([huge.seq, huge.blocks, huge.box.cells]), [[], [], []]);
  assert.ok(huge.takt > 0, 'takt and load are still worked out');
  const day = M.analyse({ ...LINE3, shifts: 1e9 }, [{ name: 'A', demand: 100, cycle: 1, packout: 1, changeover: 1 }]);
  assert.deepEqual(plain(day.too), { what: 'day', value: 1e9 * 450, max: 1440 });
  assert.deepEqual(plain(day.seq), []);
  const texts = { en: /more than the plan can hold/, de: /mehr, als der Plan fassen kann/, sq: /më shumë se sa mban plani/ };
  for (const lang of ['en', 'de', 'sq']) {
    const w = load({ lang });
    const d = w.document;
    type(w, d.querySelector('#hj-demand-0'), '1000000000');
    const results = d.querySelector('[data-results]');
    assert.equal(results.hidden, false, `${lang}: the result says why`);
    assert.match(results.textContent, texts[lang], `${lang}: the cap is said`);
    assert.equal(results.querySelector('.hj-box'), null, `${lang}: no box`);
  }
});

// The page at that volume: 6,000 pitch columns and 1,250 runs took a second to draw per keystroke in Chromium. The
// box is left out with a message above 300 columns, and the screen shows the first 300 runs; the CSV keeps them all.
test('the page at unit-level volume: no box of thousands of columns, the first 300 runs, every container in the CSV', () => {
  const products = [{ id: 'a', name: 'A', demand: '20000', cycle: '1', packout: '1', changeover: '1' }, { id: 'b', name: 'B', demand: '10000', cycle: '1', packout: '1', changeover: '1' }];
  const w = load({ storage: { 'sc-heijunka': { line: { name: 'L', shifts: '3', shiftMin: '480', breakMin: '30', start: '06:00', days: '5', runs: '', batchDays: '' }, products, example: false } } });
  const results = w.document.querySelector('[data-results]');
  assert.equal(results.hidden, false);
  assert.equal(results.querySelector('.hj-box'), null, 'no box table');
  assert.match(results.querySelector('.hj-box-panel').textContent, /6,000 pitch columns a day \(0\.2 min each\) are too many/);
  assert.equal(results.querySelectorAll('.hj-seq tbody tr').length, 300);
  assert.match(results.textContent, /The first 300 of 1,250 runs/);
  const print = [...results.querySelectorAll('button')].find((b) => b.textContent === 'Print the heijunka box');
  assert.equal(print.disabled, true);
  let csv = '';
  w.Blob = class { constructor(parts) { csv = parts.join(''); } };
  click(w, [...results.querySelectorAll('button')].find((b) => b.textContent === 'Download CSV'));
  assert.equal(csv.trim().split('\r\n').length, 6001, 'a header and 6,000 containers');
});

// Audit 27 Oct 2026, P2B-13: a product with demand but no pack-out dropped out of the takt without a word.
test('a product without pack-out counts in the takt and the load, and the page names it', () => {
  const M = math();
  const d = read(DATA.en).example;
  const products = [...d.products, { name: 'E · Sample pack', demand: 6000, cycle: 30, packout: '', changeover: 5 }];
  const n = M.numbers(M.cleanLine(d.line), products.map(M.cleanProduct));
  const r = M.analyse(n.line, n.products);
  close(r.takt, (900 * 60) / 1500, 'takt from all 1,500 units a day, not 1,200');
  close(r.load.runSec, 600 * 27 + 300 * 36 + 200 * 45 + 100 * 60 + 300 * 30, 'its work is in the load');
  assert.equal(r.active.length, 4, 'it has no place in the sequence');
  assert.deepEqual(plain(r.unpacked.map((p) => p.name)), ['E · Sample pack']);
  const w = load({ storage: { 'sc-heijunka': { line: d.line, products, example: false } } });
  assert.match(w.document.querySelector('[data-results]').textContent, /E · Sample pack: no pack-out yet\. The demand counts in the takt and the load/);
});

test('the three data files share one shape, the same numbers, and their own storage key', () => {
  const shape = (value) => (Array.isArray(value) ? value.map(shape) : value && typeof value === 'object'
    ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, shape(value[key])])) : typeof value);
  const en = read(DATA.en);
  assert.equal(en.storageKey, 'sc-heijunka');
  const numbers = (d) => d.example.products.map(({ demand, cycle, packout, changeover }) => [demand, cycle, packout, changeover]);
  for (const lang of ['de', 'sq']) {
    const other = read(DATA[lang]);
    assert.equal(other.storageKey, `sc-heijunka-${lang}`, `${lang} keeps its own work`);
    assert.deepEqual(shape(other), shape(en), `${lang} shape`);
    assert.deepEqual(numbers(other), numbers(en), `${lang}: the example's numbers`);
    assert.deepEqual({ ...other.example.line, name: '' }, { ...en.example.line, name: '' });
    assert.deepEqual(other.defaults, en.defaults);
    for (const [key, value] of Object.entries(other.text)) assert.ok(value.trim(), `${lang} text.${key}`);
    for (const value of Object.values(other.advice)) assert.equal(value.moves.length, 3);
  }
  assert.deepEqual(Object.keys(en.advice).sort(), ['epei', 'nofit', 'ok', 'over', 'tight']);
  // The example of the task: A 600, B 300, C 200, D 100 a day, two shifts of 450 productive minutes.
  assert.deepEqual(plain(en.example.products.map((p) => p.demand / en.example.line.days)), [600, 300, 200, 100]);
  assert.equal(en.example.line.shiftMin - en.example.line.breakMin, 450);
  for (const lang of ['en', 'de', 'sq']) {
    const r = example(math(), lang);
    assert.deepEqual([r.takt, r.runMin, r.switches.count, r.levelStock, r.batchStock], [45, 700, 16, 320, 6000], `${lang} example`);
  }
});

test('a first visit opens on the example with a rich result; nothing is saved until the visitor acts; clearing it empties the page', () => {
  const w = load();
  const d = w.document;
  const results = d.querySelector('[data-results]');
  assert.equal(results.hidden, false);
  assert.equal(results.querySelector('h2').textContent, '4 runs of each product a day: 16 changeovers, 95% less finished stock');
  const stats = [...results.querySelectorAll('.dl-stats > .dl-stat')].map((s) => s.textContent);
  assert.match(stats[0], /^Takt time45 s900 min available ÷ 1,200 units a day/);
  assert.match(stats[1], /^Pitch7\.5–15 min/);
  assert.match(stats[2], /^Utilisation77\.8%700 min run time · room for changeovers/);
  assert.match(stats[3], /^EPEI0\.10 days0\.20 shifts · every product every 90 min of production/);
  assert.match(stats[4], /^Changeovers per day16levelled, 80 min; in batches 0\.8 a day/);
  assert.match(stats[5], /^Finished stock320units levelled; 6,000 in batches every 5 days/);
  assert.equal(results.querySelectorAll('.hj-box tbody tr').length, 4);
  assert.equal(results.querySelectorAll('.hj-box thead th').length, 61);
  // A and B one card a column (30 + 15); C two to a column, 3 columns a run (12); D 2, 2, 2 and 1 columns (7).
  assert.equal(results.querySelectorAll('.hj-box .has-card').length, 30 + 15 + 12 + 7);
  assert.equal(results.querySelectorAll('.hj-box .is-start').length, 16);
  assert.equal(results.querySelector('.hj-box thead th:nth-child(2)').textContent, '06:00');
  assert.ok(results.querySelectorAll('svg').length >= 2, 'load curve and stock chart');
  assert.equal(results.querySelectorAll('.hj-seq tbody tr').length, 16);
  assert.match(results.querySelector('.hj-seq tbody tr:nth-child(4)').textContent, /^409:3810:30D · Gift box3306 min/);
  assert.match(results.querySelector('.hj-facts').textContent, /Levelled: highest hour 10[23]%, largest backlog 3 min\.In batches: highest hour 133%, largest backlog 20 min\./);
  assert.match(results.querySelector('.dl-focus h3').textContent, /Load the box and pull at the pitch/);
  assert.match(results.textContent, /EPEI = Σ changeover times ÷ \(available time − run time\) = 20 min ÷ 200 min = 0\.10 days\./);
  assert.match(d.querySelector('[data-derived]').textContent, /2 × \(480 − 30\) = 900 min · Takt time: 45 s/);
  assert.equal(d.querySelectorAll('[data-products] tr').length, 4);
  assert.match(d.querySelector('[data-info="2"]').textContent, /200 a day · pitch 7\.5 min/);
  // EPEI 0.1 days: no SMED action is pushed, but SMED stays one link away.
  assert.ok(![...results.querySelectorAll('a')].some((a) => /action-tracker/.test(a.href)));
  assert.ok([...results.querySelectorAll('a')].some((a) => new URL(a.href).pathname === '/tools/smed/'));
  const note = d.querySelector('.dl-example-note');
  assert.equal(note.hidden, false);
  assert.equal(w.localStorage.getItem('sc-heijunka'), null, 'nothing is written until the visitor acts');
  click(w, note.querySelector('button'));
  assert.equal(results.hidden, true);
  assert.equal(saved(w).products.length, 0);
  assert.equal(saved(w).line.shifts, '2', 'the defaults stay');
  assert.equal(d.querySelector('[data-empty]').hidden, false);
  click(w, d.querySelector('[data-example]'));
  assert.equal(results.hidden, false);
  assert.equal(saved(w).example, true);
});

test('typing changes the plan; products can be added and removed; the CSV is the sequence container by container', () => {
  const w = load();
  const d = w.document;
  const results = d.querySelector('[data-results]');
  type(w, d.querySelector('#hj-runs'), '2');
  assert.match(results.querySelector('h2').textContent, /^2 runs of each product a day: 8 changeovers/);
  assert.equal(saved(w).example, false, 'the first change ends the example');
  assert.equal(d.querySelector('.dl-example-note').hidden, true);
  type(w, d.querySelector('#hj-changeover-3'), '90');
  // 4 + 4 + 6 + 90 = 104 min a round, 2 runs = 208 min > 200 free: too many; one run fits.
  assert.match(results.textContent, /2 runs a day need 208 min of changeovers, but only 200 min are free\. The most that fit: 1 a day\./);
  const tracker = [...results.querySelectorAll('a')].find((a) => /action-tracker/.test(a.href));
  assert.ok(tracker, 'a SMED action for the longest changeover');
  assert.match(tracker.textContent, /^Reduce changeover on D · Gift box: add to actions$/);
  click(w, tracker);
  const url = new URL(tracker.href);
  assert.equal(url.pathname, '/tools/action-tracker/');
  assert.equal(url.searchParams.get('action'), 'Reduce the changeover to D · Gift box (90 min) with SMED');
  assert.equal(url.searchParams.get('source'), 'heijunka');
  assert.equal(url.searchParams.get('area'), 'Packing line 2 (kits)');
  assert.match(url.searchParams.get('detail'), /EPEI 0\.52 days, 200 min free per day for 104 min of changeovers/);
  click(w, d.querySelector('[data-add]'));
  assert.equal(d.querySelectorAll('[data-products] tr').length, 5);
  assert.equal(d.activeElement.id, 'hj-name-4');
  click(w, d.querySelector('[data-remove="4"]'));
  assert.equal(saved(w).products.length, 4);
  // The CSV: a header and one row per container, with clock times.
  let csv = '';
  w.Blob = class { constructor(parts) { csv = parts.join(''); } };
  type(w, d.querySelector('#hj-changeover-3'), '6');
  type(w, d.querySelector('#hj-runs'), '4');
  click(w, [...results.querySelectorAll('button')].find((b) => b.textContent === 'Download CSV'));
  const lines = csv.replace(/^﻿/, '').trim().split('\r\n');
  assert.equal(lines.length, 76);
  assert.equal(lines[0], 'No.,Run,Product,Units,Pitch (min),From,To,Changeover before (min)');
  assert.equal(lines[1], '1,1,B · Refill kit,20,15,06:00,06:15,4');
  assert.equal(lines[2], '2,1,B · Refill kit,20,15,06:15,06:30,0');
  assert.equal(lines[5], '5,2,C · Premium kit,10,7.5,07:00,07:08,6');
  assert.equal(lines[10], '10,3,A · Starter kit,20,15,07:38,07:53,4');
});

test('German and Albanian pages: the example in that language, links keep /de/ and /sq/, the texts are translated', () => {
  for (const lang of ['de', 'sq']) {
    const long = read(DATA[lang]).example;
    const w = load({ lang, storage: { [`sc-heijunka-${lang}`]: { line: { ...long.line, runs: '' }, products: long.products.map((p) => ({ ...p, changeover: 80 })), example: false } } });
    const d = w.document;
    const results = d.querySelector('[data-results]');
    assert.equal(results.hidden, false);
    assert.match(results.querySelector('h2').textContent, lang === 'de' ? /^Ein Lauf je Produkt pro Tag: 4 Rüstvorgänge, 80\s%\s?weniger Fertigwarenbestand$/ : /^Një prodhim i çdo produkti në ditë: 4 ndërrime, 80% më pak stok të gatshëm$/);
    const tracker = [...results.querySelectorAll('a')].find((a) => /action-tracker/.test(a.href));
    click(w, tracker);
    assert.equal(new URL(tracker.href).pathname, `/${lang}/tools/action-tracker/`);
    assert.equal(new URL(tracker.href).searchParams.get('source'), 'heijunka');
    for (const slug of ['smed', 'shift-capacity', 'standard-work', 'five-whys']) {
      assert.ok([...d.querySelectorAll('a')].some((a) => new URL(a.href).pathname === `/${lang}/tools/${slug}/`), `${lang}: ${slug}`);
    }
    assert.doesNotMatch(results.textContent, /Changeovers per day|Finished stock|runs of each product|Load per hour|How it is calculated/);
    assert.equal(w.localStorage.getItem('sc-heijunka'), null, `${lang}: the English plan is not touched`);
  }
});

test('every text of the page and the script has a German and an Albanian translation', () => {
  const ui = { de: read('src/_data/de/ui.json'), sq: read('src/_data/sq/ui.json') };
  const own = read('src/_data/i18n-parts/heijunka.json');
  const njk = fs.readFileSync('src/_includes/partials/heijunka.njk', 'utf8');
  const js = fs.readFileSync('src/js/heijunka.js', 'utf8');
  const texts = new Set([...njk.matchAll(/\{\{\s*(?:"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)')\s*\|\s*t\(lang\)/g)].map((m) => m[1] ?? m[2]));
  for (const m of js.matchAll(/\btx\("((?:[^"\\]|\\.)*)"/g)) texts.add(JSON.parse(`"${m[1]}"`));
  assert.ok(texts.size > 140);
  for (const lang of ['de', 'sq']) {
    const missing = [...texts].filter((text) => (own[lang][text] ?? ui[lang][text]) === undefined);
    assert.deepEqual(missing, [], `${lang}: no translation`);
    Object.entries(own[lang]).forEach(([en, out]) => {
      const vars = (s) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
      assert.deepEqual(vars(out), vars(en), `${lang}: the placeholders of "${en}"`);
    });
  }
  const cards = read('src/_data/i18n-parts/heijunka.cards.json');
  assert.equal(cards.family, 'lumen');
  assert.deepEqual(['en', 'de', 'sq'].map((lang) => cards.cards[lang].url), ['/tools/heijunka/', '/de/tools/heijunka/', '/sq/tools/heijunka/']);
  assert.deepEqual(['en', 'de', 'sq'].map((lang) => cards.cards[lang].name), ['Heijunka', 'Heijunka (Produktionsglättung)', 'Heijunka (nivelizimi i prodhimit)']);
  for (const [file, lang] of [['src/tools/heijunka.njk', 'en'], ['src/de/tools/heijunka.njk', 'de'], ['src/sq/tools/heijunka.njk', 'sq']]) {
    const page = fs.readFileSync(file, 'utf8');
    assert.match(page, lang === 'en' ? /\{% set cfg = heijunka %\}/ : new RegExp(`\\{% set cfg = ${lang}\\.heijunka %\\}`));
    const description = page.match(/^description: "(.*)"$/m)[1];
    assert.ok(description.length <= 160, `${file}: ${description.length}`);
  }
});

test('the stylesheet part uses its prefix, the theme variables only, balanced braces and an A4 landscape print', () => {
  const raw = fs.readFileSync('src/css/58-heijunka.css', 'utf8');
  const css = raw.replace(/\/\*[\s\S]*?\*\//g, '');
  assert.doesNotMatch(css, /--red|--gold/);
  assert.equal((css.match(/\{/g) || []).length, (css.match(/\}/g) || []).length);
  const classes = [...css.matchAll(/\.([a-z][a-z0-9-]*)/g)].map((m) => m[1]).filter((name) => !/^(dl|ck|has-|is-|\d)/.test(name));
  assert.ok(classes.every((name) => name.startsWith('hj-')), classes.filter((name) => !name.startsWith('hj-')).join(', '));
  assert.match(css, /@media print/);
  assert.match(css, /@page hj-a4 \{ size: A4 landscape/);
});
