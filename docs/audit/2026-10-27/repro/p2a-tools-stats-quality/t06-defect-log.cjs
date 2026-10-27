// Damage Control / Incomplete Control / Night Audit (defect-log.js): rate, DPMO, sigma, target, DE number formats,
// CSV injection, corrupted storage.
const { tool, check, note, text, type, click } = require('./lib.cjs');
const rows = [
  { date: '2026-10-19', shift: 'Early', stage: 'Loading', type: 'Crushed', cause: 'Stacking', units: 3, cost: 12.5, note: '=HYPERLINK("http://x","y")' },
  { date: '2026-10-20', shift: 'Late', stage: 'Loading', type: 'Crushed', cause: 'Stacking', units: 2, cost: null, note: 'Ünïcödé 🚚 Çelës' },
  { date: '2026-10-21', shift: 'Early', stage: 'Sorting', type: 'Wet', cause: 'Weather', units: 1, cost: null, note: '+cmd' },
];
const volumes = [{ date: '2026-10-19', volume: 1200 }, { date: '2026-10-20', volume: 1300 }, { date: '2026-10-21', volume: 1500 }];
const state = (extra = {}) => ({ period: '', volume: '', target: '0,3', from: '', to: '', volumes, rows, example: {}, totalsFor: {}, grain: '', compare: false, ...extra });
// Independent: 6 units / 4000 = 0.15 %; DPMO 1500; sigma = z(0.9985)+1.5 = 2.9677+1.5 = 4.47; target 0.3% -> allowed floor(12)=12, gap -6 -> on target
for (const [lang, key, prefix] of [['en', 'sc-damage-control', ''], ['de', 'sc-damage-control-de', '/de']]) {
  const st = state(lang === 'en' ? { target: '0.3' } : {});
  const blobs = [];
  const w = tool(`${prefix}/tools/damage-control/`, { [key]: st }, { before: (win) => { const B = win.Blob; win.Blob = function (parts, o) { blobs.push(parts.map(String).join('')); return new B(parts, o); }; } });
  const stats = text(w, '[data-results]');
  note(`${lang} stats`, stats.slice(0, 400));
  check(`${lang}: DPMO 1,500 / 1.500`, true, /DPMO\s*1[.,]500/.test(stats));
  check(`${lang}: rate 0.15 % / 0,15 %`, true, /0[.,]15\s?%/.test(stats));
  check(`${lang}: sigma 4.47 / 4,47`, true, /4[.,]47/.test(stats));
  check(`${lang}: target judged on target`, true, /On target|Im Ziel|Ziel erreicht|Auf Ziel/i.test(stats));
  // untranslated English strings on the DE page
  if (lang === 'de') note('de: english words in results?', (text(w, '[data-results]').match(/\b(the|units|handled|Damage rate|short term|on target|over)\b/gi) || []).slice(0, 10));
  // CSV export: capture downloadCsv rows via Blob
  w.URL.createObjectURL = () => 'blob:x'; w.URL.revokeObjectURL = () => {};
  w.HTMLAnchorElement.prototype.click = function () {};
  try { click(w, '[data-csv]'); } catch (e) { note('csv click', String(e)); }
  const t = blobs.at(-1);
  if (t) {
    {
      note(`${lang} CSV head`, t.split(/\r?\n/).slice(0, 3).join(' || '));
      check(`${lang}: formula note neutralised in CSV`, true, /'=HYPERLINK/.test(t));
      check(`${lang}: +cmd neutralised`, true, /'\+cmd/.test(t));
      check(`${lang}: unicode kept`, true, /Ünïcödé 🚚 Çelës/.test(t));
      check(`${lang}: BOM for Excel`, true, t.charCodeAt(0) === 0xfeff || /^﻿/.test(t));
    }
  } else note(`${lang} CSV`, 'no blob captured');
}
// Corrupted storage
const wc = tool('/tools/damage-control/', { 'sc-damage-control': '{"rows": [ {"date":' });
note('corrupted JSON: page errors', wc.__errors.slice(0, 2));
note('corrupted JSON: result text', text(wc, '[data-results]').slice(0, 160));
note('corrupted JSON: storage after load (was it overwritten/backed up?)', wc.localStorage.getItem('sc-damage-control')?.slice(0, 80));
// Old/odd shapes: rows not array, units as string "2,5", negative units, cost "abc"
const wo = tool('/tools/damage-control/', { 'sc-damage-control': { rows: [{ date: '19.10.2026', units: '-4', cost: 'abc' }, { date: '2026-10-20', units: '2.6' }, null, 5], volume: '100' } });
note('odd rows result', text(wo, '[data-results] .dl-stat').slice(0, 200));
console.log('errors', wo.__errors.slice(0, 3));
