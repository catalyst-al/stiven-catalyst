// CSV export -> import round trip (DE and EN) for Damage Control and Delay Analyzer, plus duplicate import behaviour.
const { tool, check, note, click } = require('./lib.cjs');
const capture = (blobs) => ({ before: (win) => { const B = win.Blob; win.Blob = function (parts, o) { blobs.push(parts.map(String).join('')); return new B(parts, o); }; } });
const run = (lang, slug, key, rows, extra = {}) => {
  const blobs = [];
  const prefix = lang === 'en' ? '' : `/${lang}`;
  const w = tool(`${prefix}/tools/${slug}/`, { [key]: { rows, example: {}, totalsFor: {}, from: '', to: '', ...extra } }, capture(blobs));
  w.URL.createObjectURL = () => 'blob:x'; w.URL.revokeObjectURL = () => {}; w.HTMLAnchorElement.prototype.click = function () {};
  click(w, '[data-csv]');
  const csv = blobs.at(-1).replace(/^﻿/, '');
  const before = JSON.parse(w.localStorage.getItem(key)).rows;
  // clear and import the CSV text through the real paste box
  click(w, '[data-clear]');
  const paste = w.document.querySelector('[data-paste], textarea[id$="paste"], textarea');
  paste.value = csv;
  click(w, '[data-import]');
  w.dispatchEvent(new w.Event('pagehide'));
  const after = JSON.parse(w.localStorage.getItem(key)).rows;
  // import the same CSV again: duplicates?
  paste.value = csv; click(w, '[data-import]'); w.dispatchEvent(new w.Event('pagehide'));
  const twice = JSON.parse(w.localStorage.getItem(key)).rows;
  return { before, after, twice, csv };
};
const dmg = [
  { date: '2026-10-19', shift: 'Early', stage: 'Loading', type: 'Crushed', cause: 'Stacking', units: 3, cost: 12.5, note: '=SUM(A1)' },
  { date: '2026-10-20', shift: 'Late', stage: 'Sorting', type: 'Wet', cause: 'Weather', units: 1, cost: 1234.56, note: 'Çelës 🚚, "quoted"; semi' },
];
for (const [lang, key] of [['en', 'sc-damage-control'], ['de', 'sc-damage-control-de'], ['sq', 'sc-damage-control-sq']]) {
  const r = run(lang, 'damage-control', key, dmg);
  const strip = (x) => x.map(({ date, units, cost, note }) => ({ date, units, cost, note }));
  note(`${lang} damage before`, strip(r.before));
  note(`${lang} damage after`, strip(r.after));
  check(`${lang}: damage dates/units/costs survive round trip`, JSON.stringify(strip(r.before).map(({ note, ...x }) => x)), JSON.stringify(strip(r.after).map(({ note, ...x }) => x)));
  check(`${lang}: note text survives round trip unchanged`, r.before.map((x) => x.note), r.after.map((x) => x.note));
  note(`${lang}: importing the same CSV twice gives rows`, r.twice.length);
}
const routes = [{ date: '2026-10-25', shift: 'Night', route: 'N1', planDep: '01:30', actDep: '01:45', planArr: '02:50', actArr: '02:10', reason: '', note: 'DST night' }];
const rr = run('de', 'delay-analyzer', 'sc-delay-analyzer-de', routes, { departureGrace: '10', arrivalGrace: '15', routes: '', target: '' });
note('delay: before/after', [rr.before[0], rr.after[0]]);
check('delay: times survive round trip', [rr.before[0].planArr, rr.before[0].actArr], [rr.after[0]?.planArr, rr.after[0]?.actArr]);
