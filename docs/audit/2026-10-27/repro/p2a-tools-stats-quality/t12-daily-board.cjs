// Daily Board: default targets when none is set, and the 5S score formula vs the 5S Audit / Shift Pulse / Signals.
const { tool, check, note, text, isoDaysAgo } = require('./lib.cjs');
const D0 = isoDaysAgo(0), D1 = isoDaysAgo(1);
const damage = { rows: [{ date: D1, shift: 'Early', units: 4 }], volumes: [{ date: D1, volume: 1000 }], target: '' };
const fiveRow = { date: D1, area: 'Dock', scope: '5S', scores: { sort: [4, 4, 4, 4], set: [0], shine: [], standardize: [], sustain: [] } };
const w = tool('/tools/daily-board/', { 'sc-damage-control': damage, 'sc-five-s-audit': { rows: [fiveRow] }, 'sc-daily-board': { rows: [], example: {}, demoProfile: false } });
const all = text(w, '[data-results]');
note('daily board text mentioning damage/target', (all.match(/[^.]{0,120}(0[.,]3\s?%|target|Ziel)[^.]{0,80}/gi) || []).slice(0, 4));
const M = w.DailyBoardMath;
const f = M.facts({ damage, fives: { rows: [fiveRow] } }, {}, { damage: 0.003, incomplete: 0.005, ontime: 0.95, fives: 0.8 }, {});
const st = M.dayState(f, D1);
note('Q state for 0.4 % damage with NO target set (built-in default 0.3 %)', st);
// 5S: independent per-S method (5S Audit tool): sort 100 %, set 0 % -> overall 50 %; pooled mean = 16/20 = 80 %
const pooled = M.fivesScore(fiveRow);
const wp = tool('/tools/shift-pulse/', {});
const perS = wp.PulseMath.fiveSOverall(fiveRow.scores);
check('5S per-S method (Shift Pulse / 5S Audit) = 0.5', 0.5, perS);
check('Daily Board 5S score equals the 5S Audit score (0.5)', 0.5, pooled);
const ws = tool('/tools/signals/', {});
note('Signals 5S overall', ws.SignalsMath.fiveSOverall(fiveRow));
const k = all.indexOf('40% (target');
note('context', all.slice(Math.max(0, k - 300), k + 200));
const q = all.search(/0[.,]40\s?%/);
note('damage reason', all.slice(Math.max(0, q - 200), q + 200));
