// Verifikim, jashtë repo-s: si i bashkon sinkronizimi i ekipit dy pajisje që nisin të njëjtin turn pasues pa u sinkronizuar.
// Lexon src/js/team-sync.js të repo-s pa e ndryshuar. Nis nga rrënja e repo-s: node <ky skedar>
const fs = require('node:fs');
const { JSDOM } = require(process.cwd() + '/node_modules/jsdom');
const dom = new JSDOM('<html lang="en"><body></body></html>', { url: 'https://stivencatalyst.com/tools.html', runScripts: 'outside-only' });
const w = dom.window;
Object.defineProperty(w, 'crypto', { configurable: true, value: globalThis.crypto }); w.TextEncoder = TextEncoder; w.TextDecoder = TextDecoder;
for (const f of ['storage-guard', 'work-backup', 'team-sync']) w.eval(fs.readFileSync(`src/js/${f}.js`, 'utf8'));
const M = w.TeamSyncMath, KEY = 'sc-shift-handover';
const issue = (text, extra = {}) => ({ text, priority: 'High', owner: '', due: '', done: false, carried: 0, ...extra });
const sheet = (date, shift, issues) => ({ template: 'warehouse', date, shift, area: 'Dock A', issues });
const closed = sheet('2026-11-11', 'Late', [issue('Rampa 3 e bllokuar')]);
const text = (v) => JSON.stringify(v);
const start = (device, extra) => ({                       // secila pajisje nis vetë turnin pasues dhe mbart çështjen
  current: sheet('2026-11-11', 'Night', [issue('Rampa 3 e bllokuar', { carried: 1, ...extra.carried }), ...extra.own]),
  history: [{ closedAt: `2026-11-11T21:4${device === 'A' ? 0 : 5}:00.000Z`, handover: closed, text: '', carriedTo: '2026-11-11|Night' }],
  received: [],
});
const before = { [KEY]: text({ current: closed, history: [], received: [] }) };   // gjendja e sinkronizuar te të dyja
const A = { local: { [KEY]: text(start('A', { carried: { done: true }, own: [issue('A: paleta te porta 2')] })) }, base: M.baseOf(before) };
const B = { local: { [KEY]: text(start('B', { carried: {}, own: [issue('B: skaner i prishur')] })) }, base: M.baseOf(before) };
let team = before;
const sync = (d) => { const merged = M.merge(d.local, team, d.base, {}); d.local = merged; team = { ...team, ...merged }; d.base = M.baseOf(merged); };
const show = (label, d) => { const s = JSON.parse(d.local[KEY]); console.log(label.padEnd(26), s.current.issues.map((i) => `${i.text}${i.done ? ' [zgjidhur]' : ''}`).join(' | '), '· historik:', s.history.map((h) => h.closedAt.slice(11, 16)).join(',')); };
show('A para sinkronizimit', A); show('B para sinkronizimit', B);
sync(A); show('A pas sinkronizimit 1', A);
sync(B); show('B pas sinkronizimit', B);
sync(A); show('A pas sinkronizimit 2', A);
const fin = JSON.parse(A.local[KEY]);
console.log('kopje të çështjes së mbartur te A:', fin.current.issues.filter((i) => i.text === 'Rampa 3 e bllokuar').length);
console.log('puna e A-së mbijetoi:', fin.current.issues.some((i) => i.text.startsWith('A:')), '· “zgjidhur” e A-së mbijetoi:', fin.current.issues[0].done);
console.log('A dhe B njësoj në fund:', A.local[KEY] === B.local[KEY]);
