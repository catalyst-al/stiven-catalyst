// Verifikim për planin (docs/plan-sot-2026-11-11/PLANI.md, pjesa 3.5): çfarë mbetet nga “vetëm një herë” pas një
// rikthimi nga kopja rezervë.
//
// Çfarë është e vërtetë këtu dhe çfarë është model:
// - E VËRTETË: skedari i kopjes rezervë bëhet dhe lexohet me kodin e repo-s (src/js/work-backup.js, makeBackup dhe
//   readBackup). Rikthimi shkruan çdo çelës të skedarit të tërë dhe nuk prek çelësat që skedari nuk i ka; kjo lak
//   është kopjuar nga faqja e kopjes rezervë, sepse faqja nuk e nxjerr si funksion.
// - MODEL: mbyllja, nisja e turnit pasues dhe mbartja (closeId, carriedFrom, krahasimi i çështjeve) janë rregullat e
//   planit, të shkruara këtu. Në repo nuk ekzistojnë ende.
// Nuk ndryshon asgjë në repo. Nis nga rrënja e repo-s, pas `npm ci`:
//   node docs/plan-sot-2026-11-11/prova/rikthimi-nga-backup.cjs
const fs = require('node:fs');
const assert = require('node:assert/strict');
const { JSDOM } = require(process.cwd() + '/node_modules/jsdom');

const KEY = 'sc-shift-handover-sq';
const SHIFTS = ['Mëngjes', 'Pasdite', 'Natë'];
const ISSUE = 'Rampa 3 e bllokuar';

const device = () => {
  const w = new JSDOM('<html lang="sq"><body></body></html>', { url: 'https://stivencatalyst.com/sq/tools.html', runScripts: 'outside-only' }).window;
  Object.defineProperty(w, 'crypto', { configurable: true, value: globalThis.crypto });
  w.TextEncoder = TextEncoder; w.TextDecoder = TextDecoder;
  for (const file of ['storage-guard', 'work-backup']) w.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  // Turni aktiv është cilësim i pajisjes: jashtë kopjes rezervë (vendimi 5), prandaj nuk rri te localStorage këtu.
  return { w, active: null, n: 0 };
};
const read = (d) => JSON.parse(d.w.localStorage.getItem(KEY) || 'null') || { current: null, history: [], received: [] };
const write = (d, state) => d.w.localStorage.setItem(KEY, JSON.stringify(state));

// ---- Kopja rezervë: kodi i repo-s ----
const backup = (d) => JSON.stringify(d.w.WorkBackup.makeBackup(d.w.localStorage));
const restore = (d, text) => {
  const file = d.w.WorkBackup.readBackup(text);
  assert.ok(file, 'skedari lexohet nga readBackup');
  for (const [key, value] of Object.entries(file.items)) d.w.localStorage.setItem(key, value);
  // Rregull i planit: pas rikthimit, turni aktiv që nuk përputhet me dorëzimin e rikthyer nuk mbahet.
  const now = read(d).current;
  if (!now || !d.active || now.date !== d.active.date || now.shift !== d.active.shift) d.active = null;
};

// ---- Modeli i planit ----
const issue = (text, extra = {}) => ({ text, priority: 'High', owner: '', due: '', done: false, carried: 0, ...extra });
const sheet = (date, shift, issues = []) => ({ template: 'warehouse', date, shift, area: 'Dock A', issues });
const norm = (text) => String(text).toLowerCase().replace(/\s+/g, ' ').trim();
const later = (a, b) => a.date > b.date || (a.date === b.date && SHIFTS.indexOf(a.shift) > SHIFTS.indexOf(b.shift));
const sameWorkplace = (a, b) => a.template === b.template && norm(a.area) === norm(b.area);

const close = (d) => {
  const state = read(d);
  assert.ok(state.current, 'ka dorëzim për të mbyllur');
  state.history.unshift({ closeId: `c${++d.n}`, closedAt: `2026-11-1${d.n}T21:40:00.000Z`, handover: state.current, text: '' });
  state.current = null;
  write(d, state);
  d.active = null;
};
// Nisja e shprehur e një turni. Kthen sa çështje u shtuan nga mbartja. `layers` lejon fikjen e një shtrese për provë.
const start = (d, date, shift, layers = { id: true, text: true }) => {
  const state = read(d);
  d.active = { date, shift };
  if (!state.current || state.current.date !== date || state.current.shift !== shift) {
    assert.ok(!state.current, 'një dorëzim tjetër i hapur duhet mbyllur më parë');
    state.current = sheet(date, shift);
  }
  const target = state.current;
  // Mbyllja më e fundit me closeId, në të njëjtin vend pune, nga e cila ky turn është pasues. Hyrjet pa closeId janë
  // të mbylljes së vjetër, që i mbartte çështjet menjëherë: nuk janë kurrë në pritje.
  const from = state.history.find((entry) => entry.closeId && sameWorkplace(entry.handover, target) && later(target, entry.handover));
  let added = 0;
  if (from) {
    // Shtresa 1: asnjë dorëzim, aktiv ose në historik, nuk e ka mbartur tashmë këtë mbyllje.
    const done = layers.id && [target, ...state.history.map((entry) => entry.handover)].some((h) => (h.carriedFrom || []).includes(from.closeId));
    if (!done) {
      from.handover.issues.filter((item) => !item.done).forEach((item) => {
        // Shtresa 2: e njëjta çështje që është tashmë aty nuk shtohet (teksti, si mergeIssues i mjetit).
        if (layers.text && target.issues.some((have) => norm(have.text) === norm(item.text))) return;
        target.issues.push({ ...item, carried: (item.carried || 0) + 1 });
        added += 1;
      });
      target.carriedFrom = [...(target.carriedFrom || []), from.closeId];
    }
  }
  write(d, state);
  return added;
};
const copies = (d) => (read(d).current?.issues || []).filter((item) => norm(item.text).startsWith(norm(ISSUE).slice(0, 8))).length;
const say = (label, text) => console.log(`${label}\n  ${text}`);

// Gjendja e nisjes për çdo rast: Pasdite 11 nën me një çështje të hapur.
const fresh = () => {
  const d = device();
  write(d, { current: sheet('2026-11-11', 'Pasdite', [issue(ISSUE)]), history: [], received: [] });
  d.w.localStorage.setItem('sc-damage-control-sq', JSON.stringify({ rows: [{ date: '2026-11-11', shift: 'Pasdite', stage: 'Ngarkimi', cause: 'Stivimi', units: 1, cost: null, note: '' }] }));
  d.active = { date: '2026-11-11', shift: 'Pasdite' };
  return d;
};
const work = (d) => { const s = read(d); s.current.issues.push(issue('Shtuar gjatë Natës')); write(d, s); };

// ---- R1: kopja u bë PAS mbartjes ----
{
  const d = fresh(); close(d);
  assert.equal(start(d, '2026-11-11', 'Natë'), 1);
  const after = backup(d); work(d);
  restore(d, after);
  const again = start(d, '2026-11-11', 'Natë');
  assert.equal(again, 0); assert.equal(copies(d), 1);
  say('R1. Kopje e bërë pas mbartjes', `nisja e përsëritur shton ${again} çështje; dorëzimi mban ${copies(d)} kopje. Puna pas kopjes humbet nga vetë rikthimi.`);
}
// ---- R2: kopja u bë PARA mbartjes, pas mbylljes ----
{
  const d = fresh(); close(d);
  const before = backup(d);
  assert.equal(start(d, '2026-11-11', 'Natë'), 1); work(d);
  restore(d, before);
  assert.equal(d.active, null, 'pa turn aktiv pas rikthimit');
  assert.equal(read(d).current, null, 'dorëzimi i Natës nuk ekziston më');
  const again = start(d, '2026-11-11', 'Natë');
  assert.equal(again, 1); assert.equal(copies(d), 1);
  say('R2. Kopje e bërë para mbartjes, pas mbylljes', `gjendja kthehet para nisjes; nisja e re mbart përsëri ${again} çështje; dorëzimi mban ${copies(d)} kopje. Mbartja ndodhi dy herë në kohë, pa dyfishim.`);
}
// ---- R3: kopja u bë PARA mbylljes ----
{
  const d = fresh();
  const before = backup(d);
  close(d); assert.equal(start(d, '2026-11-11', 'Natë'), 1);
  restore(d, before);
  const s = read(d);
  assert.equal(s.history.length, 0); assert.equal(s.current.shift, 'Pasdite'); assert.equal(d.active, null);
  close(d); const again = start(d, '2026-11-11', 'Natë');
  assert.equal(again, 1); assert.equal(copies(d), 1);
  say('R3. Kopje e bërë para mbylljes', `turni i mbyllur kthehet i hapur dhe mbyllja zhduket nga historiku; pajisja mbetet pa turn aktiv. Pas mbylljes së re, nisja mbart ${again} çështje, ${copies(d)} kopje.`);
}
// ---- R4: kopja nuk e ka fare çelësin e dorëzimit ----
{
  const d = fresh();
  const other = device(); other.w.localStorage.setItem('sc-damage-control-sq', JSON.stringify({ rows: [] }));
  const without = backup(other);
  close(d); assert.equal(start(d, '2026-11-11', 'Natë'), 1); work(d);
  const kept = JSON.stringify(read(d));
  restore(d, without);
  assert.equal(JSON.stringify(read(d)), kept, 'dorëzimi nuk preket');
  d.active = { date: '2026-11-11', shift: 'Natë' };
  const again = start(d, '2026-11-11', 'Natë');
  assert.equal(again, 0); assert.equal(copies(d), 1);
  say('R4. Kopje pa çelësin e dorëzimit', `dorëzimi mbetet siç ishte, bashkë me punën e Natës; nisja e përsëritur shton ${again}.`);
}
// ---- R5: kopje e vjetër, nga para hapit 3 (mbyllja e vjetër, pa closeId) ----
{
  const d = device();
  const old = { current: sheet('2026-11-11', 'Natë', [issue(ISSUE, { carried: 1 })]), history: [{ closedAt: '2026-11-11T21:40:00.000Z', handover: sheet('2026-11-11', 'Pasdite', [issue(ISSUE)]), text: '' }], received: [] };
  write(d, old); const legacy = backup(d);
  write(d, { current: null, history: [], received: [] });
  restore(d, legacy);
  const again = start(d, '2026-11-11', 'Natë');
  assert.equal(again, 0); assert.equal(copies(d), 1);
  say('R5. Kopje e vjetër, pa closeId', `hyrja e vjetër nuk është kurrë në pritje; nisja shton ${again}; ${copies(d)} kopje.`);
}
// ---- R6: kufiri. Vetëm shtresa 2, dhe teksti i çështjes është ndryshuar pas mbartjes ----
{
  const run = (edit, layers) => {
    const d = fresh(); close(d); start(d, '2026-11-11', 'Natë');
    const s = read(d); if (edit) s.current.issues[0].text = 'Rampa 3 e bllokuar nga paleta'; delete s.current.carriedFrom; write(d, s);
    return [start(d, '2026-11-11', 'Natë', layers), copies(d)];
  };
  const same = run(false, { id: false, text: true }), edited = run(true, { id: false, text: true });
  assert.deepEqual(same, [0, 1]); assert.deepEqual(edited, [1, 2]);
  say('R6. Kufiri i shtresës 2 (pa closeId te destinacioni)', `tekst i pandryshuar: shton ${same[0]}, ${same[1]} kopje. Tekst i ndryshuar pas mbartjes: shton ${edited[0]}, ${edited[1]} kopje.`);
  console.log('  Kjo gjendje nuk lind nga një kopje rezervë, sepse dorëzimi dhe historiku janë në të njëjtin çelës dhe rikthehen bashkë.');
  console.log('  Lind kur fushat bashkohen veçmas, pra kur dorëzimi sinkronizohet. Prandaj përjashtimi nga sinkronizimi është kusht i garancisë.');
}
console.log('\nTë gjashtë rastet dolën siç pritej.');
