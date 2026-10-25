// Site Compare (src/js/site-compare.js): the read-only code check (a six-word team code refused with its reason), the
// read through TeamSync.readTeamCopy against a fake of the sync server (GET only, this browser's own team untouched),
// the figures of each site counted from payloads in the tools' real shapes and held against the tools' own Math
// objects, the choice of a tool's language, best and worst, the ranking, that only summaries are stored, that Team
// Sync never offers this tool's key, the three data files, and the page: the example on a first visit (in memory, no
// network), adding a site, an update with its status per site, and the exports.
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const nunjucks = require('nunjucks');
const { JSDOM, VirtualConsole } = require('jsdom');

const plain = (value) => JSON.parse(JSON.stringify(value));
const close = (a, b, message) => assert.ok(Math.abs(a - b) < 1e-9, `${message}: ${a} vs ${b}`);
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const dataOf = (name, lang) => read(lang === 'en' ? `src/_data/${name}.json` : `src/_data/${lang}/${name}.json`);
const DATA = { en: dataOf('siteCompare', 'en'), de: dataOf('siteCompare', 'de'), sq: dataOf('siteCompare', 'sq') };
const ENDPOINT = 'https://sync.example.test';
const CODE = 'acid-acorn-acre-acts-afar-affix';
const NOW = '2026-10-24T10:00:00Z'; // a Saturday
const TODAY = '2026-10-24';
const OTHER = ['oee', 'roomInspection', 'maintenancePlanner'];

const env = new nunjucks.Environment(new nunjucks.FileSystemLoader('src/_includes'), { autoescape: false });
env.addFilter('t', (text) => text);
env.addFilter('local', (url, lang) => (lang && lang !== 'en' ? `/${lang}${url}` : url));
env.addFilter('assetUrl', (url) => url);
env.addFilter('scriptJson', (value) => JSON.stringify(value).replace(/</g, '\\u003c'));
const partial = (lang, endpoint = ENDPOINT) => env.render('partials/site-compare.njk', {
  cfg: DATA[lang], lang: lang === 'en' ? undefined : lang, site: { sync: { endpoint } },
  ...Object.fromEntries(OTHER.map((name) => [name, dataOf(name, 'en')])),
  de: Object.fromEntries(OTHER.map((name) => [name, dataOf(name, 'de')])),
  sq: Object.fromEntries(OTHER.map((name) => [name, dataOf(name, 'sq')])),
}).replace(/<script src=[^>]*><\/script>/g, '');
const TOOL_SCRIPTS = ['tool-kit', 'chart-kit', 'actions-store', 'oee', 'safety-cross', 'maintenance-planner', 'room-inspection', 'guest-complaints', 'ops-report'];

const load = ({ lang = 'en', page = true, storage = {}, fetch = null, endpoint = ENDPOINT, sync = true, extra = [] } = {}) => {
  const base = lang === 'en' ? '' : `/${lang}`;
  const virtualConsole = new VirtualConsole();
  // The German and Albanian pages carry their interface texts, as the layout puts them on the page.
  const strings = lang === 'en' ? '' : `<script type="application/json" id="ui-strings">${JSON.stringify({ ...read(`src/_data/${lang}/ui.json`), ...read('src/_data/i18n-parts/site-compare.json')[lang] }).replace(/</g, '\\u003c')}</script>`;
  const dom = new JSDOM(`<html lang="${lang}"><body>${strings}<main id="main">${page ? partial(lang, endpoint) : ''}</main></body></html>`, { url: `https://stivencatalyst.com${base}/tools/site-compare/`, runScripts: 'outside-only', virtualConsole });
  const w = dom.window;
  // jsdom has no WebCrypto, TextEncoder or compression streams: node's are handed in, as in the team sync tests.
  Object.defineProperty(w, 'crypto', { configurable: true, value: globalThis.crypto });
  w.TextEncoder = TextEncoder;
  w.TextDecoder = TextDecoder;
  w.CompressionStream = CompressionStream;
  w.DecompressionStream = DecompressionStream;
  w.eval(`(() => { const Real = Date; const fixed = new Real(${JSON.stringify(NOW)}); Date = class extends Real { constructor(...args) { super(...(args.length ? args : [fixed])); } static now() { return fixed.getTime(); } }; })();`);
  w.print = () => { w.printed = true; };
  w.confirm = () => true;
  w.downloads = [];
  w.URL.createObjectURL = (blob) => { w.downloads.push(blob); return 'blob:site-compare'; };
  w.URL.revokeObjectURL = () => {};
  w.Blob = class { constructor(parts, options) { this.parts = parts; this.type = options?.type; } };
  Object.defineProperty(w.navigator, 'clipboard', { value: { writeText: async (text) => { w.copied = text; } } });
  w.fetchLog = [];
  w.fetch = async (url, init = {}) => { w.fetchLog.push({ url, method: init.method || 'GET' }); if (!fetch) throw new TypeError('no network in this test'); return fetch(url, init); };
  Object.entries(storage).forEach(([key, value]) => w.localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value)));
  // The page order: the tools' scripts and this one first; Team Sync comes with the box at the foot of the page.
  for (const file of [...TOOL_SCRIPTS, 'site-compare', ...(sync ? ['storage-guard', 'work-backup', 'team-sync'] : []), ...extra]) w.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  return w;
};
const M = load({ page: false }).SiteCompareMath;
const waitFor = async (check, tries = 300) => { for (let i = 0; i < tries && !check(); i++) await new Promise((r) => setTimeout(r, 15)); return check(); };
const ctxOf = (w, lang = 'en') => {
  const ri = dataOf('roomInspection', lang);
  return {
    Ops: w.OpsReportMath, Oee: w.OeeMath, Safety: w.SafetyMath, Planner: w.MaintenancePlannerMath, Inspection: w.RoomInspectionMath, Complaints: w.GuestComplaintsMath,
    partial: w.ToolKit.partialRouteLog, reasons: { en: dataOf('oee', 'en').reasons, de: dataOf('oee', 'de').reasons, sq: dataOf('oee', 'sq').reasons },
    inspection: { threshold: ri.threshold, zones: ri.zones, templates: ri.templates }, maintenance: { target: dataOf('maintenancePlanner', lang).target },
  };
};

// ---- A fake of the sync server (the API of workers/sync/worker.js) ----
const fakeServer = () => {
  const spaces = new Map();
  const log = [];
  const reply = (status, body) => ({ status, ok: status >= 200 && status < 300, json: async () => (body === undefined ? null : JSON.parse(JSON.stringify(body))) });
  const fetch = async (url, init = {}) => {
    const method = init.method || 'GET';
    log.push(method);
    const match = /\/v1\/spaces\/([0-9a-f]{64})$/.exec(url);
    if (!match) return reply(404, { error: 'not-found' });
    const meta = spaces.get(match[1]);
    if (method === 'GET') return meta ? reply(200, { rev: meta.rev, updated: meta.updated, iv: meta.iv, data: meta.data }) : reply(404, { error: 'empty' });
    return reply(401, { error: 'token' });
  };
  return { spaces, log, fetch };
};
// A team's copy on the server, sealed as a member's device seals it, and the read-only code a member would make.
const publish = async (w, server, items, code = CODE) => {
  const keys = await w.TeamSyncMath.deriveKeys(code, 1000);
  const payload = { format: 'stiven-catalyst-team', version: 1, sent: '2026-10-24T07:30:00.000Z', device: { id: 'dev12345', name: 'Office PC of Ana' }, devices: [{ id: 'dev12345', name: 'Office PC of Ana', seen: '2026-10-24T07:30:00.000Z' }], items: Object.fromEntries(Object.entries(items).map(([k, v]) => [k, typeof v === 'string' ? v : JSON.stringify(v)])) };
  const box = await w.TeamSyncMath.seal(payload, keys.key);
  server.spaces.set(keys.spaceId, { rev: 3, updated: 1_000_000, ...box });
  return w.TeamSyncMath.viewerCode(code, 1000);
};

// ---- A site's tools, in their real saved shapes ----
const RI = dataOf('roomInspection', 'en');
const SITE = (w) => {
  const items = w.RoomInspectionMath.itemsOf(RI.templates.standard, RI.zones.map((z) => z.key));
  const all = (answer) => Object.fromEntries(items.map((item) => [item.qid, answer]));
  return {
    // The German log is the one in use (newest entry); the English one holds an old September entry.
    'sc-damage-control-de': { target: '0,3', rows: [{ date: '2026-10-20', shift: 'Früh', stage: '', type: '', cause: 'Beim Verladen gefallen', units: 3 }, { date: '2026-10-21', units: 2, cause: 'Nasse Verpackung' }, { date: '2026-10-22', cause: 'Gequetscht' }], volumes: [{ date: '2026-10-20', volume: 1000 }, { date: '2026-10-21', volume: 1200 }, { date: '2026-10-22', volume: 800 }, { date: '2026-10-10', volume: 900 }] },
    'sc-damage-control': { rows: [{ date: '2026-09-01', units: 50, cause: 'Old' }], volumes: [{ date: '2026-09-01', volume: 100 }] },
    // Grace 10 minutes: 5 routes, 3 late (one across midnight).
    'sc-delay-analyzer': { arrivalGrace: '10', departureGrace: '10', target: '95', routes: '', rows: [
      { date: '2026-10-20', route: 'R01', planDep: '06:00', actDep: '06:00', planArr: '08:00', actArr: '08:05' },
      { date: '2026-10-20', route: 'R02', planDep: '06:30', actDep: '06:40', planArr: '08:30', actArr: '08:45' },
      { date: '2026-10-20', route: 'R03', planDep: '07:00', actDep: '07:00', planArr: '09:00', actArr: '09:11' },
      { date: '2026-10-21', route: 'R04', planDep: '22:00', actDep: '22:10', planArr: '23:50', actArr: '00:20' },
      { date: '2026-10-21', route: 'R05', planDep: '05:00', actDep: '05:00', planArr: '07:00', actArr: '06:55' },
    ] },
    // The Albanian OEE log, with an Albanian planned stop ("Pushim") and breakdown ("Prishje").
    'sc-oee-sq': { equipment: [{ name: 'Linja 1', rate: 600 }], rows: [
      { date: '2026-10-20', shift: '', equipment: 'Linja 1', planned: 480, stops: [{ reason: 'Pushim', minutes: 30 }, { reason: 'Prishje', minutes: 45 }], pieces: 3600, rejects: 36, startup: 0 },
      { date: '2026-10-21', shift: '', equipment: 'linja 1', planned: 480, stops: [], pieces: 4000, rejects: 0, startup: 0 },
    ] },
    'sc-five-s-audit': { scope: '5S', tags: [], rows: [
      { id: 'a1', date: '2026-10-21', area: 'Dock', scope: '5S', scores: { sort: [4, 3], set: [2], shine: [3, 3, 3], standardize: [], sustain: [1] } },
      { id: 'a2', date: '2026-10-14', area: 'Dock', scope: '5S', scores: { sort: [4], set: [4], shine: [4], standardize: [4], sustain: [4] } },
    ] },
    'sc-safety-cross': { rows: [
      { date: '2026-10-22', type: 'near-miss' }, { date: '2026-10-23', type: 'unsafe-act' }, { date: '2026-10-19', type: 'first-aid' },
      { date: '2026-10-05', type: 'no-lost-time', area: 'Dock' }, { date: '2026-10-12', type: 'positive' },
    ] },
    'sc-actions': { rows: [
      { id: 'a1', title: 'Fix dock door', status: 'open', priority: 'High', created: '2026-10-01', due: '2026-10-10', closed: '' },
      { id: 'a2', title: 'Label racks', status: 'doing', created: '2026-10-15', due: '2026-10-30', closed: '' },
      { id: 'a3', title: 'Sweep bay 4', status: 'done', created: '2026-10-02', due: '2026-10-05', closed: '2026-10-20' },
      { id: 'a4', title: 'Order gloves', status: 'verified', created: '2026-09-20', due: '2026-09-25', closed: '2026-10-03' },
    ] },
    'sc-kaizen-board': { rows: [
      { id: 'k1', title: 'Pick by light', status: 'act', date: '2026-10-01', adopted: '2026-10-20' },
      { id: 'k2', title: 'Shadow board', status: 'act', date: '2026-09-20', adopted: '2026-10-02' },
      { id: 'k3', title: 'New labels', status: 'idea', date: '2026-10-22' },
    ] },
    'sc-maintenance-planner': { assets: [{ id: 'm1', tag: 'FL-1', name: 'Forklift', crit: 'B', tasks: [{ id: 't1', text: 'Weekly check', every: 1, unit: 'weeks', last: '2026-09-26' }] }], rows: [
      { id: 'd1', kind: 'done', asset: 'm1', task: 't1', date: '2026-10-03' },
      { id: 'd2', kind: 'done', asset: 'm1', task: 't1', date: '2026-10-12' },
      { id: 'd3', kind: 'done', asset: 'm1', task: 't1', date: '2026-10-17' },
    ] },
    'sc-room-inspection': { rows: [
      { id: 'r1', date: '2026-10-20', time: '10:00', room: '101', template: 'standard', answers: all('pass') },
      { id: 'r2', date: '2026-10-21', time: '10:00', room: '102', template: 'standard', answers: { ...all('pass'), 'bathroom-0': 'fail' } },
      { id: 'r3', date: '2026-10-21', time: '11:00', room: '102', template: 'standard', answers: all('pass') },
    ] },
    'sc-guest-complaints': { rows: [{ id: 'g1', date: '2026-10-19', guest: 'Mr Smith' }, { id: 'g2', date: '2026-10-20' }, { id: 'g3', date: '2026-10-22' }] },
    // English Hotel KPIs for every night of the last 7 days (50 sold); German ones, newer and different, which the
    // English complaints log does not read.
    'sc-hotel-kpis': { rows: Array.from({ length: 7 }, (_, i) => ({ date: `2026-10-${18 + i}`, available: 60, sold: 50 })) },
    'sc-hotel-kpis-de': { rows: [{ date: '2026-10-24', available: 60, sold: 10 }, { date: '2026-10-25', available: 60, sold: 10 }] },
    // Not a tool this page reads, and the site's own CV (never shared, so never in a copy in the first place).
    'sc-pareto': { rows: [] },
  };
};

test('the three data files share one shape, their own storage key, and the figures and periods of the script', () => {
  const shape = (value) => (Array.isArray(value) ? value.map(shape) : value && typeof value === 'object'
    ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, shape(value[key])])) : typeof value);
  assert.deepEqual(shape(DATA.de), shape(DATA.en));
  assert.deepEqual(shape(DATA.sq), shape(DATA.en));
  assert.equal(DATA.en.storageKey, 'sc-site-compare');
  assert.equal(DATA.de.storageKey, 'sc-site-compare-de');
  assert.equal(DATA.sq.storageKey, 'sc-site-compare-sq');
  for (const lang of ['en', 'de', 'sq']) {
    assert.deepEqual(DATA[lang].periods.map((p) => p.key), plain(M.PERIODS), lang);
    assert.deepEqual(Object.keys(DATA[lang].kpis).sort(), plain(M.KPIS).map((k) => k.key).sort(), lang);
    assert.deepEqual(Object.keys(DATA[lang].groups).sort(), [...new Set(plain(M.KPIS).map((k) => k.group))].sort(), lang);
    // The example is the same in every language but for the words: the same numbers.
    const numbers = (value) => JSON.stringify(value, (key, v) => (typeof v === 'string' && !['name'].includes(key) && !/^(near-miss|unsafe-|first-aid|no-lost|positive|done|verified|doing|open)/.test(v) ? '' : v));
    assert.equal(numbers(DATA[lang].example.sites.map(({ name, ...rest }) => rest)), numbers(DATA.en.example.sites.map(({ name, ...rest }) => rest)), lang);
    // A detail names only fields a figure can carry.
    Object.values(DATA[lang].kpis).forEach((kpi) => (String(kpi.detail || '').match(/\{(\w+)\}/g) || []).forEach((m) => assert.ok(M.DETAILS.includes(m.slice(1, -1)), `${lang}: ${m}`)));
  }
  const part = read('src/_data/i18n-parts/site-compare.json');
  assert.deepEqual(Object.keys(part.de).sort(), Object.keys(part.sq).sort());
  const cards = read('src/_data/i18n-parts/site-compare.cards.json');
  assert.equal(cards.family, 'lumen');
  assert.deepEqual(['en', 'de', 'sq'].map((l) => cards.cards[l].url), ['/tools/site-compare/', '/de/tools/site-compare/', '/sq/tools/site-compare/']);
  assert.equal(cards.cards.en.type, 'Overview');
  assert.equal(cards.routine.when, 'Every week');
  // Every text the script shows has its translation.
  const script = fs.readFileSync('src/js/site-compare.js', 'utf8');
  const texts = [...script.matchAll(/tx\("((?:[^"\\]|\\.)*)"/g)].map((m) => JSON.parse(`"${m[1]}"`));
  for (const lang of ['de', 'sq']) {
    const ui = { ...read(`src/_data/${lang}/ui.json`), ...part[lang] };
    assert.deepEqual(texts.filter((text) => ui[text] === undefined), [], lang);
  }
});

test('the code check: a read-only code is taken, a damaged or later one refused, a six-word team code refused as such', async () => {
  const w = load({ page: false });
  const S = w.TeamSyncMath;
  const good = await S.viewerCode(CODE, 1000);
  assert.deepEqual(plain(await w.SiteCompareMath.checkCode(`  ${good.slice(0, 40)}\n${good.slice(40)} `)), { ok: true, code: good });
  assert.equal((await w.SiteCompareMath.checkCode(good.slice(0, 80))).reason, 'damaged');
  assert.equal((await w.SiteCompareMath.checkCode(`${good.slice(0, 50)}${good[50] === 'A' ? 'B' : 'A'}${good.slice(51)}`)).reason, 'damaged');
  assert.equal((await w.SiteCompareMath.checkCode(`scr2.${good.slice(5)}`)).reason, 'version');
  assert.equal((await w.SiteCompareMath.checkCode(CODE)).reason, 'team-code');
  assert.equal((await w.SiteCompareMath.checkCode('Acid ACORN acre acts afar affix')).reason, 'team-code');
  assert.equal((await w.SiteCompareMath.checkCode('acid acorn acre acts')).reason, 'team-code-typo');
  assert.equal((await w.SiteCompareMath.checkCode('hello')).reason, 'damaged');
  assert.equal((await w.SiteCompareMath.checkCode('')).reason, 'empty');
  assert.equal((await w.SiteCompareMath.checkCode(good, null)).reason, 'off', 'without Team Sync on the page');
});

test('the language of a tool: the newest entry wins, then more entries, then English; an empty key is no use', () => {
  const pick = (items, tool) => plain(M.pickVariant(Object.fromEntries(Object.entries(items).map(([k, v]) => [k, JSON.stringify(v)])), tool));
  const log = (dates) => ({ rows: dates.map((date) => ({ date, units: 1 })) });
  assert.equal(pick({ 'sc-damage-control': log(['2026-10-01']), 'sc-damage-control-de': log(['2026-10-20']), 'sc-damage-control-sq': log(['2026-10-05']) }, 'damage-control').key, 'sc-damage-control-de');
  assert.equal(pick({ 'sc-damage-control': log(['2026-10-20']), 'sc-damage-control-sq': log(['2026-10-20', '2026-10-19']) }, 'damage-control').key, 'sc-damage-control-sq', 'same day: more entries');
  assert.equal(pick({ 'sc-damage-control-sq': log(['2026-10-20']), 'sc-damage-control': log(['2026-10-20']) }, 'damage-control').key, 'sc-damage-control', 'a full tie: English');
  assert.equal(pick({ 'sc-damage-control': { rows: [], volumes: [] }, 'sc-damage-control-de': log(['2026-01-01']) }, 'damage-control').key, 'sc-damage-control-de', 'an empty key is no use');
  assert.equal(pick({ 'sc-damage-control': 'not json' }, 'damage-control'), null);
  // A volume counts as an entry and as a date; the actions are one key in every language.
  assert.equal(pick({ 'sc-incomplete-control': { rows: [], volumes: [{ date: '2026-10-22', volume: 10 }] }, 'sc-incomplete-control-de': log(['2026-10-21']) }, 'incomplete-control').key, 'sc-incomplete-control');
  assert.equal(pick({ 'sc-actions': { rows: [{ id: 'a', title: 'x', created: '2026-10-01' }] }, 'sc-actions-de': { rows: [{ title: 'y', created: '2026-10-20' }] } }, 'action-tracker').key, 'sc-actions');
  assert.equal(M.latestIn({ rows: [{ created: '2026-10-01', closed: '2026-10-09' }, { date: 'x' }] }), '2026-10-09');
});

test('the figures of a site, from the tools\' real shapes, counted as the tools\' own Math counts them', () => {
  const w = load({ page: false, extra: ['delay-analyzer', 'five-s-audit'] });
  assert.ok(w.DelayMath && w.FiveSMath);
  const site = SITE(w);
  const items = Object.fromEntries(Object.entries(site).map(([k, v]) => [k, JSON.stringify(v)]));
  const s = plain(w.SiteCompareMath.summarize(items, TODAY, ctxOf(w)));
  assert.equal(s.asOf, TODAY);
  assert.deepEqual(s.tools, { 'damage-control': '-de', 'delay-analyzer': '', oee: '-sq', 'five-s-audit': '', 'safety-cross': '', 'action-tracker': '', 'kaizen-board': '', 'maintenance-planner': '', 'room-inspection': '', 'guest-complaints': '', 'hotel-kpis': '-de' });
  const p7 = s.periods.last7, p30 = s.periods.last30, pm = s.periods.lastMonth;
  // Damage, from the German log: 3 + 2 + 1 (a row without units is one) = 6 of 1,000 + 1,200 + 800.
  assert.deepEqual(p7.damageRate, { value: 6 / 3000, units: 6, volume: 3000 });
  assert.deepEqual(p7.damageUnits, { value: 6 });
  assert.deepEqual(p30.damageRate, { value: 6 / 3900, units: 6, volume: 3900 }, 'the 10th has its volume and no damage');
  assert.deepEqual(pm.damageRate, { value: null, units: 0, why: 'empty' }, 'the English September log is not the one in use');
  assert.equal(p7.incompleteRate, undefined, 'no Incomplete Control: no figure');
  // Delivery: late beyond the 10-minute grace, as DelayMath classifies a route.
  const routes = site['sc-delay-analyzer'].rows.map((r) => w.OpsReportMath.minutesLate(r.planArr, r.actArr));
  const late = routes.filter((m) => w.DelayMath.classify(0, m, 10, 10).late).length;
  assert.equal(late, 3);
  assert.deepEqual(p7.onTime, { value: 2 / 5, late: 3, routes: 5 });
  assert.deepEqual(p7.lateRoutes, { value: 3 });
  // OEE, with the Albanian reasons: "Pushim" is a planned stop, so the shifts plan 450 and 480 minutes.
  const reasons = dataOf('oee', 'sq').reasons;
  const entries = site['sc-oee-sq'].rows.map((row) => w.OeeMath.entry(row, 6, reasons));
  const own = w.OeeMath.combine(entries).oee;
  close(own, (356.4 + 400) / (450 + 480), 'OEE worked by hand: valuable / planned production time');
  close(p7.oee.value, own, 'the OEE tool\'s own combine');
  assert.equal(p7.oee.entries, 2);
  assert.equal(p7.oee.machines, 1, 'the same machine however its name is typed');
  // 5S: per S the mean of its answers over 4, then the mean of the S answered (FiveSMath.score).
  const pillars = ['sort', 'set', 'shine', 'standardize', 'sustain'];
  const fs1 = w.FiveSMath.score(site['sc-five-s-audit'].rows[0].scores, pillars).overall;
  close(fs1, 0.59375, '5S by hand');
  assert.deepEqual(p7.fiveS, { value: 0.59375, audits: 1 });
  assert.deepEqual(p30.fiveS, { value: (0.59375 + 1) / 2, audits: 2 });
  // Safety: SafetyMath's counts and days since the last accident (5 October → 24 October).
  assert.deepEqual([p7.accidents.value, p7.firstAid.value, p7.nearMisses.value, p7.daysSince.value], [0, 1, 2, 19]);
  assert.equal(p7.daysSince.value, w.SafetyMath.daysSince(site['sc-safety-cross'].rows, TODAY));
  assert.deepEqual([p30.accidents.value, p30.firstAid.value, p30.nearMisses.value], [1, 1, 2]);
  assert.deepEqual([pm.accidents.value, pm.firstAid.value, pm.nearMisses.value], [0, 0, 0], 'a month without entries is safe days on the cross');
  assert.deepEqual(pm.daysSince, { value: null, why: 'noAccident' }, 'no accident logged by the end of September');
  // Actions, as the list stood at the end of each period.
  assert.deepEqual([p7.openActions.value, p7.overdueActions.value], [2, 1]);
  assert.deepEqual([pm.openActions.value, pm.overdueActions.value], [1, 1], 'on 30 September only the gloves were open, and late');
  assert.deepEqual([p7.kaizenDone.value, p30.kaizenDone.value], [1, 2]);
  // Maintenance: due 3, 10 and 19 October; done on the 3rd, 12th (late: a weekly task has no tolerance) and 17th.
  const P = w.MaintenancePlannerMath;
  const mp = site['sc-maintenance-planner'];
  const h = P.history(mp.assets[0].tasks[0], mp.rows);
  const own30 = P.compliance([h], '2026-09-25', TODAY, TODAY);
  assert.deepEqual(plain(own30), { scheduled: 3, onTime: 2, rate: 2 / 3 });
  assert.deepEqual(p30.pm, { value: 2 / 3, onTime: 2, scheduled: 3 });
  assert.deepEqual(p30.pmOverdue, { value: 0 });
  assert.deepEqual(pm.pm, { value: null, why: 'noneDue' }, 'nothing was due in September');
  // Room Inspection: room 102 failed (a critical item) and passed its re-check the same day: 1 of 2 first time.
  const R = w.RoomInspectionMath;
  const zones = RI.zones.map((z) => z.key);
  const own7 = R.overall(R.annotate(site['sc-room-inspection'].rows, (row) => R.itemsOf(RI.templates[row.template], zones), RI.threshold));
  assert.equal(own7.rate, 0.5);
  assert.deepEqual(p7.firstPass, { value: 0.5, first: 2, firstPass: 1 });
  // Complaints per 100 occupied room nights: 3 ÷ (7 × 50) × 100, the English Hotel KPIs of the English log.
  close(p7.complaintsPer100.value, (3 / 350) * 100, 'per 100 room nights');
  assert.equal(p7.complaintsPer100.value, w.GuestComplaintsMath.per100(3, 350));
  assert.deepEqual([p7.complaintsPer100.complaints, p7.complaintsPer100.nights, p7.complaints.value], [3, 350, 3]);
  assert.deepEqual(p30.complaintsPer100, { value: null, complaints: 3, why: 'nights' }, 'Hotel KPIs has 7 of the 30 nights');
  // Nothing of the work itself is in the summary: no title, cause, guest or machine name.
  const text = JSON.stringify(s);
  for (const word of ['Fix dock door', 'Beim Verladen', 'Mr Smith', 'Linja', 'Dock', 'Weekly check', 'Pick by light']) assert.ok(!text.includes(word), word);
});

test('the periods: the last 7 and 30 days to the day of the update, this month so far, last month whole', () => {
  assert.deepEqual(plain(M.rangeOf('last7', TODAY)), { from: '2026-10-18', to: TODAY });
  assert.deepEqual(plain(M.rangeOf('last30', TODAY)), { from: '2026-09-25', to: TODAY });
  assert.deepEqual(plain(M.rangeOf('thisMonth', TODAY)), { from: '2026-10-01', to: TODAY });
  assert.deepEqual(plain(M.rangeOf('lastMonth', TODAY)), { from: '2026-09-01', to: '2026-09-30' });
  assert.deepEqual(plain(M.rangeOf('lastMonth', '2026-03-31')), { from: '2026-02-01', to: '2026-02-28' });
});

test('best and worst: by the way that is good, equal values share the mark, all the same or one site marks none', () => {
  const m = (entries, kpi) => plain(M.marks(entries, kpi));
  assert.deepEqual(m([{ id: 'a', value: 0.002 }, { id: 'b', value: 0.004 }, { id: 'c', value: 0.003 }], 'damageRate'), { best: ['a'], worst: ['b'] });
  assert.deepEqual(m([{ id: 'a', value: 0.8 }, { id: 'b', value: 0.6 }, { id: 'c', value: 0.8 }], 'oee'), { best: ['a', 'c'], worst: ['b'] });
  assert.deepEqual(m([{ id: 'a', value: 0.5 }, { id: 'b', value: 0.5 }], 'oee'), { best: [], worst: [] });
  assert.deepEqual(m([{ id: 'a', value: 0.5 }, { id: 'b', value: null }], 'oee'), { best: [], worst: [] });
  assert.deepEqual(m([{ id: 'a', value: 1 }, { id: 'b', value: 5 }], 'nearMisses'), { best: [], worst: [] }, 'never marked');
  // Values that show the same are the same: 81.23 % and 81.24 % are both 81.2 %.
  assert.deepEqual(m([{ id: 'a', value: 0.81234 }, { id: 'b', value: 0.81238 }, { id: 'c', value: 0.7 }], 'oee'), { best: ['a', 'b'], worst: ['c'] });
  assert.deepEqual(m([{ id: 'a', value: 30 }, { id: 'b', value: 120 }], 'daysSince'), { best: ['b'], worst: ['a'] });
});

test('the ranking: 100 for the best and 0 for the worst on each shared rate, shared places, the mean over a site\'s rates', () => {
  const site = (id, figures) => ({ id, name: id.toUpperCase(), figures: Object.fromEntries(Object.entries(figures).map(([k, value]) => [k, { value }])) });
  const sites = [
    site('a', { damageRate: 0.002, oee: 0.8, accidents: 9 }),
    site('b', { damageRate: 0.004, oee: 0.6 }),
    site('c', { damageRate: 0.003, oee: 0.8, fiveS: 0.9 }),
    site('d', { accidents: 0 }),
  ];
  const r = plain(M.ranking(sites));
  // damageRate: a 1st (100), c 2nd (50), b 3rd (0). oee: a and c share 1st–2nd (place 1.5 → 75), b 0. fiveS: one site, not ranked.
  assert.deepEqual(r.map((x) => [x.id, x.score, x.kpis]), [['a', 87.5, 2], ['c', 62.5, 2], ['b', 0, 2], ['d', null, 0]]);
  // The widest gap, relative to the larger value: damage 0.002 vs 0.004 (50 %) over OEE 0.8 vs 0.6 (25 %).
  assert.deepEqual(plain(M.widestGap(sites)), { kpi: 'damageRate', gap: 0.5, best: 'a', worst: 'b', bestValue: 0.002, worstValue: 0.004 });
  assert.equal(M.widestGap([sites[3]]), null);
});

test('readTeamCopy and the page: a site is read with GET only, this browser\'s own team untouched, only the summary stored', async () => {
  const server = fakeServer();
  const own = { 'sc-team': { code: 'zesty-zippy-zone-zoom-yacht-amino' }, 'sc-team-state': { deviceId: 'own12345', rev: 4, lastSync: '2026-10-23T08:00:00.000Z' } };
  const w = load({ storage: { ...own, 'sc-site-compare': { period: 'last7', sites: [] } }, fetch: server.fetch });
  const doc = w.document;
  const code = await publish(w, server, SITE(w));
  assert.equal(doc.querySelector('[data-results]').hidden, true, 'not a first visit: no example');
  doc.querySelector('[name=name]').value = 'Leipzig';
  doc.querySelector('[name=code]').value = `${code.slice(0, 48)}\n${code.slice(48)}`;
  doc.querySelector('[data-add]').click();
  assert.ok(await waitFor(() => /Updated/.test(doc.querySelector('.sv-site-status')?.textContent || '')));
  assert.deepEqual(server.log, ['GET'], 'one GET, nothing else');
  for (const [key, value] of Object.entries(own)) assert.equal(w.localStorage.getItem(key), JSON.stringify(value), key);
  const keys = Object.keys(w.localStorage).sort();
  assert.deepEqual(keys, ['sc-site-compare', 'sc-team', 'sc-team-state'], 'no tool of the site lands in this browser');
  const saved = JSON.parse(w.localStorage.getItem('sc-site-compare'));
  assert.equal(saved.sites.length, 1);
  assert.deepEqual(Object.keys(saved.sites[0]).sort(), ['code', 'fetched', 'id', 'name', 'status', 'summary', 'tried']);
  assert.equal(saved.sites[0].code, code);
  assert.equal(saved.sites[0].status, 'ok');
  assert.equal(saved.sites[0].summary.sent, '2026-10-24T07:30:00.000Z');
  const text = JSON.stringify(saved);
  for (const word of ['Fix dock door', 'Beim Verladen', 'Mr Smith', 'Office PC of Ana', 'Linja', 'rows', 'items']) assert.ok(!text.includes(word), word);
  close(saved.sites[0].summary.periods.last7.damageRate.value, 0.002, 'the figure itself');
  // The table: one site, its figures; a single site has no best or worst.
  const table = doc.querySelector('.sv-table');
  assert.ok(table);
  assert.match(table.textContent, /Damage rate/);
  assert.equal(doc.querySelectorAll('.sv-tag').length, 0);
  // A second site, smaller and worse on damage: best and worst in words.
  const code2 = await publish(w, server, { 'sc-damage-control': { rows: [{ date: '2026-10-21', units: 9 }], volumes: [{ date: '2026-10-21', volume: 1000 }] } }, 'zebra-zero-zesty-zippy-zone-zoom');
  doc.querySelector('[name=name]').value = 'Kassel';
  doc.querySelector('[name=code]').value = code2;
  doc.querySelector('[data-add]').click();
  assert.ok(await waitFor(() => doc.querySelectorAll('.sv-site-status').length === 2 && /Updated/.test(doc.querySelectorAll('.sv-site-status')[1].textContent)));
  const row = [...doc.querySelectorAll('.sv-table tbody tr')].find((tr) => /Damage rate/.test(tr.textContent));
  const cells = [...row.querySelectorAll('td')].map((td) => td.textContent);
  assert.match(cells[0], /0\.20%.*best/);
  assert.match(cells[1], /0\.90%.*worst/);
  assert.match(doc.querySelector('.sv-prompt').textContent, /Leipzig leads on “Damage rate”: 0\.20%, against 0\.90% at Kassel\./);
  assert.ok(doc.querySelector('.sv-prompt a[href$="/tools/gemba-walk/"]') && doc.querySelector('.sv-prompt a[href$="/tools/kaizen-board/"]'));
  // Update: the second copy is gone, the network drops for none; each site says its own result, old figures kept.
  server.spaces.delete([...server.spaces.keys()][1]);
  doc.querySelector('[data-update]').click();
  assert.ok(await waitFor(() => /2 sites updated|1 of 2 sites updated/.test(doc.querySelector('[data-status]').textContent)));
  const statuses = [...doc.querySelectorAll('.sv-site-status')].map((node) => node.textContent);
  assert.match(statuses[0], /^Updated 2026-10-24 12:00\. The site's copy was last saved 2026-10-24 09:30\.$/);
  assert.match(statuses[1], /no longer on the server.*new read-only code/);
  assert.equal(JSON.parse(w.localStorage.getItem('sc-site-compare')).sites[1].status, 'gone');
  assert.ok(JSON.parse(w.localStorage.getItem('sc-site-compare')).sites[1].summary, 'the last figures stay');
  assert.ok(server.log.every((method) => method === 'GET'));
  // Offline: said in words.
  w.fetch = async () => { throw new TypeError('offline'); };
  doc.querySelector('[data-update]').click();
  assert.ok(await waitFor(() => /0 of 2 sites updated/.test(doc.querySelector('[data-status]').textContent)));
  assert.match(doc.querySelector('.sv-site-status').textContent, /^No connection\. Figures from/);
  // The exports: a header row first, the sites as columns, best and worst by name.
  [...doc.querySelectorAll('.result-actions button')].find((b) => b.textContent === 'Download CSV').click();
  const csv = w.downloads.at(-1).parts.join('');
  assert.match(csv, /^﻿Figure,Unit,Leipzig,Kassel,Best site,Worst site\r\n/);
  assert.match(csv, /Damage rate,%,0\.2,0\.9,Leipzig,Kassel/);
  [...doc.querySelectorAll('.result-actions button')].find((b) => b.textContent === 'Copy summary').click();
  assert.ok(await waitFor(() => typeof w.copied === 'string'));
  assert.match(w.copied, /Damage rate: Leipzig 0\.20% \(best\) · Kassel 0\.90% \(worst\)/);
  assert.match(w.copied, /Ranking:\n1\. Leipzig/);
});

test('the page refuses a six-word team code with its reason, keeps nothing of it, and asks the server nothing', async () => {
  const server = fakeServer();
  const w = load({ storage: { 'sc-site-compare': { period: 'last30', sites: [] } }, fetch: server.fetch });
  const doc = w.document;
  doc.querySelector('[name=name]').value = 'Erfurt';
  doc.querySelector('[name=code]').value = CODE;
  doc.querySelector('[data-add]').click();
  assert.ok(await waitFor(() => doc.querySelector('[data-add-note]').textContent.length > 0));
  assert.match(doc.querySelector('[data-add-note]').textContent, /This is a team code \(six words\)\. Comparing needs read-only codes/);
  assert.equal(doc.querySelector('[name=code]').value, '', 'not even left in the field');
  assert.deepEqual(JSON.parse(w.localStorage.getItem('sc-site-compare')).sites, []);
  for (let i = 0; i < w.localStorage.length; i++) assert.ok(!w.localStorage.getItem(w.localStorage.key(i)).includes('acorn'));
  // A damaged read-only code: said, kept in the field to be corrected.
  const good = await w.TeamSyncMath.viewerCode(CODE, 1000);
  doc.querySelector('[name=code]').value = good.slice(0, 70);
  doc.querySelector('[data-add]').click();
  assert.ok(await waitFor(() => /incomplete or damaged/.test(doc.querySelector('[data-add-note]').textContent)));
  // A good code without a name.
  doc.querySelector('[name=name]').value = '';
  doc.querySelector('[name=code]').value = good;
  doc.querySelector('[data-add]').click();
  assert.ok(await waitFor(() => /Give the site a name/.test(doc.querySelector('[data-add-note]').textContent)));
  assert.deepEqual(server.log, []);
  assert.deepEqual(w.fetchLog, []);
});

test('a first visit opens on the example: three sites in memory, the note, a rich result, no network, nothing written', async () => {
  const w = load();
  const doc = w.document;
  const results = doc.querySelector('[data-results]');
  assert.equal(results.hidden, false);
  assert.match(results.querySelector('.dl-example-note').textContent, /Three sites with made-up figures/);
  assert.deepEqual([...results.querySelectorAll('.sv-site-head')].map((n) => n.textContent), ['Leipzig', 'Kassel', 'Erfurt']);
  assert.ok(results.querySelectorAll('.sv-tag').length >= 10, 'best and worst named in words');
  assert.ok(results.querySelectorAll('.ck-figure svg').length >= 10, 'a chart per figure');
  assert.equal(results.querySelectorAll('.sv-ranking li').length, 3);
  assert.equal(w.localStorage.length, 0, 'the example is never written, to this key or any tool\'s');
  assert.deepEqual(w.fetchLog, [], 'and nothing is asked of a server');
  // The example's figures add up: the damage rate of Leipzig over the last 7 days, from the data file's numbers.
  const spec = DATA.en.example.sites[0].damage;
  let units = 0, volume = 0;
  for (let ago = 6; ago >= 0; ago--) {
    const date = new Date(Date.parse(`${TODAY}T00:00:00Z`) - ago * 864e5);
    const wd = (date.getUTCDay() + 6) % 7;
    const i = 74 - ago;
    if (!(spec.volume[wd] > 0)) continue;
    volume += spec.volume[wd];
    units += Math.max(0, spec.units[wd] + spec.extra[i % spec.extra.length]);
  }
  const summary = plain(w.SiteCompareMath.summarize(w.SiteCompareMath.exampleItems(DATA.en.example.sites[0], TODAY, '', dataOf('oee', 'en').reasons), TODAY, ctxOf(w)));
  assert.deepEqual(summary.periods.last7.damageRate, { value: units / volume, units, volume });
  // Every example site has its rates.
  for (const site of DATA.en.example.sites) {
    const s = plain(w.SiteCompareMath.summarize(w.SiteCompareMath.exampleItems(site, TODAY, '', dataOf('oee', 'en').reasons), TODAY, ctxOf(w)));
    for (const key of ['damageRate', 'incompleteRate', 'onTime', 'oee', 'fiveS', 'pm']) {
      const v = s.periods.last30[key].value;
      assert.ok(Number.isFinite(v) && v >= 0 && v <= 1, `${site.name} ${key}: ${v}`);
    }
    assert.ok(s.periods.last30.oee.value > 0.6 && s.periods.last30.oee.value < 0.95, `${site.name} OEE ${s.periods.last30.oee.value}`);
  }
  // A period change redraws; clearing the example keeps the visitor's choice and ends the first visit.
  const radio = doc.querySelector('input[name=period][value=last7]');
  radio.checked = true;
  radio.dispatchEvent(new w.Event('change', { bubbles: true }));
  assert.match(results.querySelector('.sv-head h2').textContent, /Last 7 days/);
  assert.equal(w.localStorage.length, 0);
  results.querySelector('.dl-example-note button').click();
  assert.equal(results.hidden, true);
  assert.deepEqual(JSON.parse(w.localStorage.getItem('sc-site-compare')), { period: 'last7', sites: [] });
  // The example button brings it back, in German too.
  doc.querySelector('[data-example]').click();
  assert.equal(results.hidden, false);
  const de = load({ lang: 'de' });
  assert.match(de.document.querySelector('.sv-table').textContent, /Schadensquote/);
  assert.match(de.document.querySelector('.sv-table').textContent, /bester/);
});

test('what is read back from storage: numbers and known reasons only; a site without a read-only code is dropped', () => {
  const summary = { asOf: TODAY, sent: '<img src=x>', tools: { oee: '-sq', evil: 'x', 'damage-control': '-xx' }, rows: [1], periods: { last7: { oee: { value: 0.8, entries: 2, note: '<b>', why: 'empty' }, damageRate: { value: '0.1', why: 'volume' }, extra: { value: 1 } } } };
  const clean = plain(M.cleanSummary(summary));
  assert.deepEqual(clean, { asOf: TODAY, tools: { oee: '-sq' }, periods: { last7: { oee: { value: 0.8, entries: 2 }, damageRate: { value: null, why: 'volume' } }, last30: {}, thisMonth: {}, lastMonth: {} } });
  assert.equal(M.cleanSummary({ asOf: 'yesterday', periods: {} }), null);
  assert.equal(M.cleanSite({ name: 'A', code: 'acid-acorn-acre-acts-afar-affix' }), null, 'a team code is never kept');
  assert.equal(M.cleanSite({ name: '', code: 'scr1.abcdefghijkl' }), null);
  const site = plain(M.cleanSite({ id: 'x1y2', name: '  Leipzig ', code: 'scr1.abcd efghijkl', status: 'hacked', fetched: 'now', summary }));
  assert.deepEqual(Object.keys(site).sort(), ['code', 'fetched', 'id', 'name', 'status', 'summary', 'tried']);
  assert.deepEqual([site.name, site.code, site.status, site.fetched], ['Leipzig', 'scr1.abcdefghijkl', '', '']);
  assert.equal(plain(M.cleanSites([{ name: 'A', code: 'scr1.abcdefghijkl' }, { name: 'B', code: 'scr1.abcdefghijkl' }])).length, 1, 'the same code once');
});

test('Team Sync never offers this tool\'s key, so the codes it holds stay on this device', () => {
  const w = load({ page: false });
  for (const key of ['sc-site-compare', 'sc-site-compare-de', 'sc-site-compare-sq']) assert.equal(w.TeamSyncMath.offerable(key), false, key);
  assert.ok(w.WorkBackup.isWork('sc-site-compare'), 'but it is the visitor\'s own work, in the saved file');
});

test('without a sync server the page says it cannot read the sites, and still shows the example', async () => {
  const w = load({ endpoint: '', sync: false });
  // Said once the page is ready: Team Sync's script comes after this one.
  assert.ok(await waitFor(() => w.document.querySelector('[data-off]').hidden === false));
  const on = load({});
  assert.ok(await waitFor(() => on.document.readyState === 'complete'));
  assert.equal(on.document.querySelector('[data-off]').hidden, true);
  assert.equal(w.document.querySelector('[data-results]').hidden, false);
});

test('the stylesheet is balanced and keeps to the brand colours', () => {
  const css = fs.readFileSync('src/css/54-site-compare.css', 'utf8');
  const stripped = css.replace(/\/\*[\s\S]*?\*\//g, '');
  assert.equal((stripped.match(/\{/g) || []).length, (stripped.match(/\}/g) || []).length);
  assert.doesNotMatch(css, /--red|--gold/);
  assert.match(css, /@media print/);
  assert.ok(/^\/\*/.test(css.trim()) && css.trim().endsWith('}'));
});
