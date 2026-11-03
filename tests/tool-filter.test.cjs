// Phase 5C (audit P1-03): the filter field of the Tools page, on the built pages of the three languages with the
// script from src/js (so a change in the script is tested without building again). What a visitor types narrows the
// cards by name, type and description; capitals, accents, hyphens and the German sharp s do not count; a role without
// a match is hidden and comes back, with every card in its place, when the field is cleared; nothing typed is sent,
// stored or put in the address.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const SITE = path.join(ROOT, '_site');
const hasSite = fs.existsSync(path.join(SITE, 'tools.html'));
const SCRIPT = fs.readFileSync(path.join(ROOT, 'src/js/tool-filter.js'), 'utf8');
const LANGS = { en: 'tools.html', de: 'de/tools.html', sq: 'sq/tools.html' };
const data = (lang) => JSON.parse(fs.readFileSync(path.join(ROOT, 'src/_data', lang === 'en' ? '' : lang, 'tools.json'), 'utf8'));

// The built page with its scripts left out and this one run; fictional data already in both storages, to show the
// filter leaves them as they were.
const SAVED = { 'sc-actions': JSON.stringify([{ id: 'a1', title: 'Fictional action: label the returns shelf' }]), 'sc-theme': 'dark' };
const NOTE = { 'sc-action-handoff': JSON.stringify({ tok0000000000000: { title: 'Fictional hand-off' } }) };
const open = (lang) => {
  const html = fs.readFileSync(path.join(SITE, LANGS[lang]), 'utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '');
  const url = `https://example.test/${LANGS[lang]}#top`;
  const dom = new JSDOM(html, { url, runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  w.document.documentElement.classList.add('js');
  for (const [k, v] of Object.entries(SAVED)) w.localStorage.setItem(k, v);
  for (const [k, v] of Object.entries(NOTE)) w.sessionStorage.setItem(k, v);
  const sent = [];
  w.fetch = (...args) => { sent.push(['fetch', String(args[0])]); return Promise.reject(new Error('offline')); };
  w.navigator.sendBeacon = (...args) => { sent.push(['beacon', String(args[0])]); return true; };
  const history = [];
  for (const name of ['pushState', 'replaceState']) {
    const real = w.history[name].bind(w.history);
    w.history[name] = (...args) => { history.push([name, ...args]); return real(...args); };
  }
  w.eval(SCRIPT);
  const d = w.document;
  const input = d.querySelector('[data-tool-filter-input]');
  const type = (text) => { input.value = text; input.dispatchEvent(new w.Event('input', { bubbles: true })); };
  const key = (k) => input.dispatchEvent(new w.KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true }));
  const cards = () => [...d.querySelectorAll('.family-section .tool-card')];
  const shown = () => cards().filter((c) => !c.hidden && !c.closest('[hidden]')).map((c) => c.querySelector('h3').textContent.trim());
  const order = () => cards().map((c) => c.querySelector('a.text-link')?.getAttribute('href') || c.querySelector('h3').textContent);
  const sections = () => [...d.querySelectorAll('.family-section')];
  return { w, d, input, type, key, cards, shown, order, sections, sent, history, url };
};

test('the Tools page carries the filter in EN, DE and SQ, and every tool is listed without it', { skip: !hasSite }, () => {
  for (const lang of Object.keys(LANGS)) {
    const page = fs.readFileSync(path.join(SITE, LANGS[lang]), 'utf8');
    const p = open(lang);
    const tools = data(lang);
    assert.equal(p.cards().length, tools.length, `${lang}: one card per tool`);
    assert.equal(tools.length, 59, `${lang}: 59 tools`);
    for (const tool of tools) assert.ok(page.includes(`href="${tool.url}"`), `${lang}: ${tool.name} linked in the HTML itself`);
    // The field comes before the roles, labelled, with its count written at build time.
    assert.ok(page.indexOf('data-tool-filter') < page.indexOf('class="shell family-index"'), `${lang}: the field before the role cards`);
    assert.ok(page.indexOf('class="shell family-index"') < page.indexOf('class="shell family-section'), `${lang}: the role cards before the roles`);
    assert.match(page, /<label class="visually-hidden" for="tool-filter">[^<]+<\/label>/, `${lang}: the field has a label`);
    assert.match(page, /\/js\/tool-filter\.js\?v=[0-9a-f]+/, `${lang}: the script, versioned`);
    assert.equal((page.match(/\/js\/filter\.js/g) || []).length, 0, `${lang}: the Field Notes filter is not loaded here`);
    const count = p.d.querySelector('[data-tool-filter-count]');
    assert.equal(count.getAttribute('aria-live'), 'polite', `${lang}: the count is announced`);
    assert.equal(count.textContent, { en: '59 tools', de: '59 Tools', sq: '59 mjete' }[lang], `${lang}: the count at rest`);
    assert.equal(p.shown().length, 59, `${lang}: nothing hidden at rest`);
    assert.equal(p.sections().filter((s) => s.hidden).length, 0, `${lang}: every role at rest`);
    assert.equal(p.d.querySelector('[data-tool-filter-clear]').hidden, true, `${lang}: no clear button while the field is empty`);
  }
  // Without scripts the field is not drawn: the stylesheet hides it unless the head script set the "js" class.
  const css = fs.readFileSync(path.join(ROOT, 'src/css/04-essay-extras-and-tools-page.css'), 'utf8');
  assert.match(css, /html:not\(\.js\) \.tool-filter, html:not\(\.js\) \.tool-filter-empty \{ display: none; \}/);
});

test('a name, a type or words of the description find the right tools in EN, DE and SQ', { skip: !hasSite }, () => {
  const cases = {
    en: [
      ['night audit', ['Night Audit Log']],
      ['Night Audit', ['Night Audit Log']],
      ['audit night', ['Night Audit Log']],
      ['NIGHT-AUDIT', ['Night Audit Log']],
      ['nigh aud', ['Night Audit Log']],
      ['cv', ['CV Builder', 'ATS CV', 'Cover Letter'], true],
      ['pareto', ['Pareto 80/20'], false, 6],
      ['80/20', ['Pareto 80/20']],
      ['5 whys', ['5 Whys'], false],
      ['hotel', null, false, (n) => n >= 5],
    ],
    de: [
      ['night audit', ['Night-Audit-Protokoll']],
      ['lebenslauf', ['Lebenslauf-Generator', 'ATS-Lebenslauf'], false],
      ['pareto', ['Pareto 80/20'], false, 6],
      ['gästebeschwerden', ['Gästebeschwerden']],
      ['gastebeschwerden', ['Gästebeschwerden']],
      ['GÄSTE', ['Gästebeschwerden'], false],
      ['massnahmen', null, false, (n) => n >= 1],
      ['fischgrate', ['Fischgräte']],
    ],
    sq: [
      ['night audit', ['Regjistri i Night Audit']],
      ['cv', ['Krijuesi i CV-së', 'CV për ATS'], false],
      ['krijuesi i cv se', ['Krijuesi i CV-së']],
      ['pareto', ['Pareto 80/20'], false, 6],
      ['mysafireve', ['Ankesat e mysafirëve']],
      ['ANKESAT E MYSAFIRËVE', ['Ankesat e mysafirëve']],
      ['cilesi', null, false, (n) => n >= 1],
    ],
  };
  for (const [lang, list] of Object.entries(cases)) {
    const p = open(lang);
    for (const [query, first, exact, size] of list) {
      p.type(query);
      const got = p.shown();
      if (first && exact !== false && size === undefined) assert.deepEqual(got, first, `${lang} "${query}": exactly these`);
      else if (first) assert.deepEqual(got.slice(0, first.length), first, `${lang} "${query}": the named tools first (${got.join(', ')})`);
      if (typeof size === 'number') assert.equal(got.length, size, `${lang} "${query}": ${size} tools`);
      if (typeof size === 'function') assert.ok(size(got.length), `${lang} "${query}": ${got.length} tools`);
      assert.ok(got.length > 0 && got.length < 59, `${lang} "${query}": the unrelated tools disappear (${got.length})`);
      // Every card shown holds every word; every card hidden misses one.
      const fold = (s) => s.normalize('NFD').replace(/\p{M}+/gu, '').toLowerCase().replace(/ß/g, 'ss').replace(/[^\p{L}\p{N}]+/gu, ' ');
      const words = fold(query).trim().split(' ');
      for (const card of p.cards()) {
        const text = fold([card.querySelector('h3').textContent, card.querySelector('.card-meta span').textContent, card.querySelector('p').textContent].join(' '));
        const visible = !card.hidden && !card.closest('[hidden]');
        assert.equal(visible, words.every((wd) => text.includes(wd)), `${lang} "${query}": ${card.querySelector('h3').textContent}`);
      }
      // A role with no match is hidden, a role with one is shown; the role cards step aside while filtering.
      for (const s of p.sections()) assert.equal(s.hidden, ![...s.querySelectorAll('.tool-card')].some((c) => !c.hidden), `${lang} "${query}": role ${s.id}`);
      assert.equal(p.d.querySelector('.family-index').hidden, true, `${lang} "${query}": role cards hidden while filtering`);
      const count = p.d.querySelector('[data-tool-filter-count]').textContent;
      assert.ok(count.startsWith(`${got.length} `) && count.endsWith(lang === 'de' ? '59 Tools' : lang === 'sq' ? '59 mjete' : '59 tools'), `${lang} "${query}": count "${count}"`);
    }
  }
});

test('no match: the count says 0 and a message in the language of the page says what to try', { skip: !hasSite }, () => {
  const words = { en: 'No tool matches these words', de: 'Kein Tool passt zu diesen Wörtern', sq: 'Asnjë mjet nuk përputhet me këto fjalë' };
  for (const lang of Object.keys(LANGS)) {
    const p = open(lang);
    const empty = p.d.querySelector('[data-tool-filter-empty]');
    assert.equal(empty.hidden, true, `${lang}: no message at rest`);
    p.type('zzqx fictional');
    assert.deepEqual(p.shown(), [], `${lang}: nothing shown`);
    assert.equal(empty.hidden, false, `${lang}: the message shows`);
    assert.ok(empty.textContent.includes(words[lang]), `${lang}: in its language`);
    assert.ok(p.sections().every((s) => s.hidden), `${lang}: no empty role left on the page`);
    assert.match(p.d.querySelector('[data-tool-filter-count]').textContent, /^0 /, `${lang}: 0 of 59`);
    p.type('pareto');
    assert.equal(empty.hidden, true, `${lang}: the message goes with the first match`);
  }
});

test('Escape and the clear button bring back every tool, every role and the role cards, in their places', { skip: !hasSite }, () => {
  for (const lang of Object.keys(LANGS)) {
    const p = open(lang);
    const before = p.order();
    const roles = p.sections().map((s) => s.id);
    const clear = p.d.querySelector('[data-tool-filter-clear]');
    p.type('pareto');
    assert.equal(clear.hidden, false, `${lang}: the clear button shows with text`);
    assert.notDeepEqual(p.order(), before, `${lang}: the name match moved first`);
    assert.notDeepEqual(p.sections().map((s) => s.id), roles, `${lang}: its role moved first`);
    // Escape clears.
    assert.equal(p.key('Escape'), false, `${lang}: Escape handled (not passed on)`);
    assert.equal(p.input.value, '');
    assert.deepEqual(p.order(), before, `${lang}: Escape: every card back in its place`);
    assert.deepEqual(p.sections().map((s) => s.id), roles, `${lang}: Escape: the roles in their order`);
    assert.equal(p.shown().length, 59);
    assert.ok(p.sections().every((s) => !s.hidden));
    assert.equal(p.d.querySelector('.family-index').hidden, false, `${lang}: the role cards are back`);
    assert.equal(clear.hidden, true);
    assert.equal(p.d.querySelector('[data-tool-filter-count]').textContent.startsWith('59 '), true);
    // Escape in an empty field is left to the page (nothing to clear).
    assert.equal(p.key('Escape'), true, `${lang}: Escape on an empty field is not taken`);
    // The clear button clears and gives the field its focus back.
    p.type('cv');
    clear.click();
    assert.equal(p.input.value, '');
    assert.equal(p.d.activeElement, p.input, `${lang}: focus back in the field`);
    assert.deepEqual(p.order(), before, `${lang}: clear: every card back`);
    assert.equal(p.shown().length, 59);
    // The sections stay before what followed them (the guide and the backup box).
    const last = p.sections().at(-1);
    assert.ok(last.nextElementSibling && !last.nextElementSibling.classList.contains('family-section'), `${lang}: what follows the roles is still after them`);
  }
});

test('Enter takes the keyboard to the first match; links stay the tools\' own', { skip: !hasSite }, () => {
  for (const lang of Object.keys(LANGS)) {
    const p = open(lang);
    p.type('night audit');
    assert.equal(p.key('Enter'), false, `${lang}: Enter does not submit anything`);
    const link = p.d.activeElement;
    assert.equal(link.tagName, 'A');
    assert.equal(link.getAttribute('href'), `${lang === 'en' ? '' : `/${lang}`}/tools/night-audit/`, `${lang}: the Night Audit link has the focus`);
    // With the field empty Enter moves nothing.
    p.input.focus();
    p.type('');
    p.key('Enter');
    assert.equal(p.d.activeElement, p.input, `${lang}: empty field, focus stays`);
    // Links and previews are the cards' own, unchanged.
    for (const tool of data(lang)) assert.equal(p.d.querySelectorAll(`.tool-card a.text-link[href="${tool.url}"]`).length, 1, `${lang}: ${tool.url}`);
  }
});

test('the filter sends nothing, stores nothing and leaves the address and the saved work alone', { skip: !hasSite }, () => {
  for (const lang of Object.keys(LANGS)) {
    const p = open(lang);
    const local = { ...Object.fromEntries(Object.keys(SAVED).map((k) => [k, p.w.localStorage.getItem(k)])) };
    for (const q of ['fictional guest room 512', 'night audit', 'zzqx', 'pareto']) { p.type(q); p.key('Enter'); p.input.focus(); }
    p.key('Escape');
    assert.deepEqual(p.sent, [], `${lang}: no request`);
    assert.deepEqual(p.history, [], `${lang}: the address is not rewritten`);
    assert.equal(p.w.location.href, p.url, `${lang}: same address`);
    assert.equal(p.w.localStorage.length, Object.keys(SAVED).length, `${lang}: nothing added to localStorage`);
    for (const [k, v] of Object.entries(local)) assert.equal(p.w.localStorage.getItem(k), v, `${lang}: ${k} unchanged`);
    assert.equal(p.w.sessionStorage.length, Object.keys(NOTE).length, `${lang}: nothing added to sessionStorage`);
    for (const [k, v] of Object.entries(NOTE)) assert.equal(p.w.sessionStorage.getItem(k), v, `${lang}: the hand-off note unchanged`);
  }
  // And the script has no way to: no storage, network, address or cookie call in it.
  const code = SCRIPT.replace(/^\s*\/\/.*$/gm, '');
  for (const word of ['localStorage', 'sessionStorage', 'indexedDB', 'fetch(', 'XMLHttpRequest', 'sendBeacon', 'history.', 'location', 'document.cookie', 'WebSocket', 'postMessage']) {
    assert.ok(!code.includes(word), `tool-filter.js does not use ${word}`);
  }
});

test('the strings of the field are translated', () => {
  const keys = ['Find a tool', 'Find a tool: name, topic or task', 'Clear the search', '{a} of {b} tools', '1 of {b} tools', 'No tool matches these words. Try one word of the name, or a topic such as hotel, safety or quality, or clear the search to see every role.'];
  for (const lang of ['de', 'sq']) {
    const ui = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/_data', lang, 'ui.json'), 'utf8'));
    for (const k of keys) {
      assert.ok(ui[k] && ui[k] !== k, `${lang}: "${k}"`);
      for (const ph of ['{a}', '{b}']) if (k.includes(ph)) assert.ok(ui[k].includes(ph), `${lang}: "${k}" keeps ${ph}`);
    }
  }
});
