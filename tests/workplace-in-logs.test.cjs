// The older logs (Damage Control, Incomplete Control, Night Audit Log, Delay Analyzer) take what the workplace profile
// knows: its shifts fill the shift list and its target stands in for an empty target box. The partials are rendered
// from src (not _site) with the filters stubbed the way scripts/check-tool.mjs stubs them.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const nunjucks = require('nunjucks');
const { JSDOM } = require('jsdom');

const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const env = new nunjucks.Environment(new nunjucks.FileSystemLoader(['src/_includes']), { autoescape: false });
const ui = { de: { ...read('src/_data/de/ui.json'), ...read('src/_data/i18n-parts/workplace-in-logs.json').de }, sq: { ...read('src/_data/sq/ui.json'), ...read('src/_data/i18n-parts/workplace-in-logs.json').sq } };
env.addFilter('t', (text, lang) => (ui[lang]?.[text] ?? text));
env.addFilter('local', (url, lang) => (lang === 'de' || lang === 'sq' ? `/${lang}${url}` : url));
env.addFilter('assetUrl', (url) => url);
env.addFilter('scriptJson', (value) => JSON.stringify(value).replace(/[<>&\u2028\u2029]/g, (char) => `\\u${char.charCodeAt(0).toString(16).padStart(4, '0')}`));
env.addFilter('lc', (text, lang) => (lang === 'de' ? String(text) : String(text).toLowerCase()));

const today = new Date();
const daysAgo = (k) => new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() - k)).toISOString().slice(0, 10);

// One page: the partial, then tool-kit.js, workplace.js (unless withProfile is false) and the tool's script.
const page = ({ partial, script, cfg, slug, lang = 'en', saved = {}, withProfile = true }) => {
  const body = env.render(`partials/${partial}.njk`, { cfg, lang });
  const html = `<!doctype html><html lang="${lang}"><body>${body.replace(/<script\b[^>]*\bsrc=[^>]*><\/script>/g, '')}</body></html>`;
  const prefix = lang === 'en' ? '' : `/${lang}`;
  const { window } = new JSDOM(html, { url: `https://example.test${prefix}/tools/${slug}/`, runScripts: 'outside-only', pretendToBeVisual: true });
  window.confirm = () => true;
  window.scrollTo = () => {};
  window.HTMLElement.prototype.scrollIntoView = () => {};
  if (lang !== 'en') window.UiStrings = ui[lang];
  for (const [key, value] of Object.entries(saved)) window.localStorage.setItem(key, JSON.stringify(value));
  window.eval(fs.readFileSync('src/js/tool-kit.js', 'utf8'));
  if (withProfile) window.eval(fs.readFileSync('src/js/workplace.js', 'utf8'));
  window.eval(fs.readFileSync(`src/js/${script}.js`, 'utf8'));
  return window;
};
const damage = (options = {}) => page({ partial: 'defect-log', script: 'defect-log', cfg: read('src/_data/damageControl.json'), slug: 'damage-control', ...options });
const delay = (options = {}) => page({ partial: 'delay-analyzer', script: 'delay-analyzer', cfg: read('src/_data/delayAnalyzer.json'), slug: 'delay-analyzer', ...options });

const options = (select) => [...select.options].map((option) => option.value || option.textContent);
const statValue = (window, label) => [...window.document.querySelectorAll('[data-results] .dl-stat')].find((item) => item.textContent.startsWith(label))?.querySelector('.dl-stat-value')?.textContent;
const type = (window, input, value) => { input.value = value; input.dispatchEvent(new window.Event('input', { bubbles: true })); };

// Five damaged units out of 1000 handled, logged on the early shift; no target typed.
const damageLog = (target = '') => ({ 'sc-damage-control': { period: '', volume: '1000', target, from: '', to: '', volumes: [], example: {}, totalsFor: {},
  rows: [{ date: daysAgo(1), shift: 'Early', stage: 'Loading', type: 'Crushed', cause: 'Stacking', units: 5, cost: null, note: '' }] } });
// Ten routes, two of them late: 80 % on time.
const delayLog = (target = '') => ({ 'sc-delay-analyzer': { period: '', routes: '', departureGrace: '10', arrivalGrace: '15', target, from: '', to: '', example: {}, totalsFor: {},
  rows: [...Array(10)].map((_, k) => ({ date: daysAgo(1), shift: 'Early', route: `R${k}`, planDep: '06:00', actDep: '06:00', planArr: '08:00', actArr: k < 2 ? '09:00' : '08:00', reason: '', note: '' })) } });

test('without a profile the logs keep their own shifts and targets', () => {
  const cfg = read('src/_data/damageControl.json');
  for (const withProfile of [false, true]) {
    const window = damage({ withProfile, saved: damageLog() });
    const shift = window.document.querySelector('[name=shift]');
    assert.deepEqual(options(shift), cfg.fields[0].options, `the page's shifts (workplace.js loaded: ${withProfile})`);
    const target = window.document.querySelector('[name=target]');
    assert.equal(target.placeholder, cfg.text.targetPlaceholder);
    assert.equal(window.document.querySelector('[data-profile-target]').hidden, true);
    assert.equal(statValue(window, 'Target'), undefined, 'no target, no target result');
    const routes = delay({ withProfile, saved: delayLog() });
    assert.deepEqual(options(routes.document.querySelector('[name=shift]')), read('src/_data/delayAnalyzer.json').shifts);
    assert.equal(statValue(routes, 'Target'), undefined);
  }
});

test('the profile shifts fill the shift list, and a shift chosen before stays', () => {
  const profile = { 'sc-workplace': { shifts: ['Früh', 'Spät'] } };
  const window = damage({ saved: { ...damageLog(), ...profile } });
  const shift = window.document.querySelector('[name=shift]');
  assert.deepEqual(options(shift), ['Früh', 'Spät']);
  assert.equal(shift.value, 'Früh');
  // A shift picked from the list, then the profile changes: the pick is kept even though it is not in the new list.
  shift.value = 'Spät';
  shift.dispatchEvent(new window.Event('change', { bubbles: true }));
  window.Workplace.set({ shifts: ['A', 'B', 'C'] });
  assert.deepEqual(options(shift), ['A', 'B', 'C', 'Spät']);
  assert.equal(shift.value, 'Spät');
  // Rows already logged keep their shift.
  assert.equal(JSON.parse(window.localStorage.getItem('sc-damage-control')).rows[0].shift, 'Early');
  assert.match(window.document.querySelector('[data-log]').textContent, /Early/);
  // A change made in another tab arrives as a storage event.
  window.localStorage.setItem('sc-workplace', JSON.stringify({ shifts: ['Night only'] }));
  window.dispatchEvent(new window.StorageEvent('storage', { key: 'sc-workplace' }));
  assert.deepEqual(options(shift), ['Night only', 'Spät']);
  // An empty profile gives the page's own list back.
  window.Workplace.set({ shifts: [] });
  assert.deepEqual(options(shift), [...read('src/_data/damageControl.json').fields[0].options, 'Spät']);

  const routes = delay({ saved: { ...delayLog(), ...profile } });
  assert.deepEqual(options(routes.document.querySelector('[name=shift]')), ['Früh', 'Spät']);
});

test('the profile target counts when the target box is empty, and a typed target wins', () => {
  const window = damage({ saved: { ...damageLog(), 'sc-workplace': { targets: { damage: 0.3 } } } });
  const target = window.document.querySelector('[name=target]');
  const note = window.document.querySelector('[data-profile-target]');
  assert.equal(target.value, '');
  assert.equal(target.placeholder, '0.3');
  assert.equal(note.hidden, false);
  assert.equal(target.getAttribute('aria-describedby'), note.id);
  assert.equal(note.querySelector('a').getAttribute('href'), '/tools/daily-board/');
  // 0.3 % of 1000 allows 3; 5 were logged.
  assert.equal(statValue(window, 'Target'), '2 over');
  type(window, target, '1');
  assert.equal(note.hidden, true, 'the note goes once a target is typed');
  assert.equal(target.hasAttribute('aria-describedby'), false);
  assert.equal(statValue(window, 'Target'), 'On target', '1 % of 1000 allows 10');
  type(window, target, '');
  assert.equal(statValue(window, 'Target'), '2 over', 'back to the profile when the box is emptied');
  // The profile changes while the page is open.
  window.Workplace.set({ targets: { damage: 0.5 } });
  assert.equal(target.placeholder, '0.5');
  assert.equal(statValue(window, 'Target'), 'On target');

  // A target saved in the log wins over the profile from the start.
  const typed = damage({ saved: { ...damageLog('0.1'), 'sc-workplace': { targets: { damage: 5 } } } });
  assert.equal(statValue(typed, 'Target'), '4 over');
  assert.equal(typed.document.querySelector('[data-profile-target]').hidden, true);
  // Each log reads its own key: Incomplete Control and the Night Audit Log do not take the damage target.
  const incomplete = page({ partial: 'defect-log', script: 'defect-log', cfg: read('src/_data/incompleteControl.json'), slug: 'incomplete-control',
    saved: { 'sc-incomplete-control': { ...damageLog()['sc-damage-control'], rows: [{ date: daysAgo(1), shift: 'Early', stage: 'Picking', type: 'Missing item', cause: 'Pick error', units: 5, cost: null, note: '' }] }, 'sc-workplace': { targets: { damage: 0.3, incomplete: 1 } } } });
  assert.equal(statValue(incomplete, 'Target'), 'On target');
  const night = page({ partial: 'defect-log', script: 'defect-log', cfg: read('src/_data/nightAudit.json'), slug: 'night-audit',
    saved: { 'sc-night-audit': { ...damageLog()['sc-damage-control'], rows: [{ date: daysAgo(1), shift: 'Night', stage: 'Arrival', type: 'No-show', cause: 'No guarantee', units: 5, cost: null, note: '' }] }, 'sc-workplace': { targets: { damage: 0.3, nightAudit: 0.2 } } } });
  assert.equal(statValue(night, 'Target'), '3 over', '0.2 % of 1000 allows 2');
});

test('the Delay Analyzer takes the on-time target of the profile', () => {
  const window = delay({ saved: { ...delayLog(), 'sc-workplace': { targets: { ontime: 95 } } } });
  const target = window.document.querySelector('[name=target]');
  assert.equal(target.placeholder, '95');
  assert.equal(window.document.querySelector('[data-profile-target]').hidden, false);
  // 95 % of 10 routes needs 10 on time; 8 were.
  assert.equal(statValue(window, 'Target'), '2 short');
  type(window, target, '80');
  assert.equal(statValue(window, 'Target'), 'On target');
  assert.equal(window.document.querySelector('[data-profile-target]').hidden, true);
});

test('the German and Albanian pages show the note in their language and link to their own Daily Board', () => {
  const de = damage({ lang: 'de', cfg: read('src/_data/de/damageControl.json'), saved: { 'sc-damage-control-de': damageLog()['sc-damage-control'], 'sc-workplace': { targets: { damage: 0.3 } } } });
  const note = de.document.querySelector('[data-profile-target]');
  assert.match(note.textContent, /Aus dem Arbeitsplatzprofil/);
  assert.equal(note.querySelector('a').getAttribute('href'), '/de/tools/daily-board/');
  assert.equal(de.document.querySelector('[name=target]').placeholder, '0,3', 'the German decimal comma');
  const sq = delay({ lang: 'sq', cfg: read('src/_data/sq/delayAnalyzer.json'), saved: { 'sc-delay-analyzer-sq': delayLog()['sc-delay-analyzer'], 'sc-workplace': { targets: { ontime: 95 } } } });
  assert.match(sq.document.querySelector('[data-profile-target]').textContent, /Nga profili i vendit të punës/);
  assert.equal(sq.document.querySelector('[data-profile-target] a').getAttribute('href'), '/sq/tools/daily-board/');
  for (const lang of ['de', 'sq']) {
    const part = read('src/_data/i18n-parts/workplace-in-logs.json')[lang];
    assert.deepEqual(Object.keys(part).sort(), ['Edit it on the Daily Board', 'From the workplace profile']);
  }
});
