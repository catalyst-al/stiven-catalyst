// Work kept in another language (src/js/work-elsewhere.js, src/_data/workKeys.js; audit P2B-19): a tool page whose
// own language holds no work of the visitor's points to the work kept on the page of another language. An example is
// no work, in each way the tools mark one.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');

const script = fs.readFileSync('src/js/work-elsewhere.js', 'utf8');
const page = (lang, slug, key, storage) => {
  const prefix = lang === 'en' ? '' : `/${lang}`;
  const dom = new JSDOM(`<html lang="${lang}"><body><main><section class="page-hero tool-hero"><h1>Tool</h1></section></main>`
    + `<script type="application/json" id="work-elsewhere-data">${JSON.stringify({ key })}</script></body></html>`,
  { url: `https://example.test${prefix}/tools/${slug}/`, runScripts: 'outside-only' });
  for (const [name, value] of Object.entries(storage)) dom.window.localStorage.setItem(name, JSON.stringify(value));
  dom.window.eval(script);
  const note = dom.window.document.querySelector('.tool-hero .work-elsewhere');
  return note && { text: note.textContent, links: [...note.querySelectorAll('a')].map((a) => [a.getAttribute('href'), a.hreflang]) };
};

test('an empty tool points to the work kept in the other languages, with a link to each page', () => {
  const note = page('en', 'fmea', 'sc-fmea', { 'sc-fmea-de': { rows: [{ id: 'f1', item: 'Stapler' }] }, 'sc-fmea-sq': { rows: [{ id: 'f2' }] } });
  assert.ok(note, 'the note is shown');
  assert.match(note.text, /kept on the page in another language/);
  assert.deepEqual(note.links, [['/de/tools/fmea/', 'de'], ['/sq/tools/fmea/', 'sq']]);
  const fromGerman = page('de', 'fmea', 'sc-fmea', { 'sc-fmea': { rows: [{ id: 'f1' }] } });
  assert.deepEqual(fromGerman.links, [['/tools/fmea/', 'en']]);
});

test('no note when this language holds work of its own, or no other language holds any', () => {
  assert.equal(page('en', 'fmea', 'sc-fmea', { 'sc-fmea': { rows: [{ id: 'a' }] }, 'sc-fmea-de': { rows: [{ id: 'b' }] } }), null);
  assert.equal(page('en', 'fmea', 'sc-fmea', {}), null);
  assert.equal(page('en', 'fmea', 'sc-fmea', { 'sc-fmea-de': { rows: [] } }), null, 'an emptied tool is no work');
  assert.equal(page('en', 'fmea', 'sc-fmea', { 'sc-fmea-de': 'not json' }), null);
});

test('an example is no work, however the tool marks it', () => {
  const none = (storage) => assert.equal(page('en', 'tool', 'sc-tool', storage), null, JSON.stringify(storage));
  none({ 'sc-tool-de': { example: true, devices: [{ id: 'ex0', name: 'Scan' }] } });
  none({ 'sc-tool-de': { reports: [{ id: 'r1', title: 'Beispiel' }], example: 'r1' } });
  none({ 'sc-tool-de': { assessments: [{ id: 'l1' }, { id: 'l2' }], example: ['l1', 'l2'] } });
  none({ 'sc-tool-de': { rows: [{ example: true }, { example: true }], example: { on: true, n: 2 } } });
  none({ 'sc-tool-de': { loops: [{ id: 'k1' }, { id: 'k2' }], example: 'signature-of-the-example' } });
  // The visitor's own beside the example is work.
  assert.ok(page('en', 'tool', 'sc-tool', { 'sc-tool-de': { reports: [{ id: 'r1' }, { id: 'r2', title: 'Eigener' }], example: 'r1' } }));
  assert.ok(page('en', 'tool', 'sc-tool', { 'sc-tool-de': { rows: [{ example: true }, { units: 3 }], example: { on: true, n: 1 } } }));
  // A form without a list (5 Whys) is work when something is typed in it.
  assert.ok(page('en', 'five-whys', 'sc-five-whys', { 'sc-five-whys-sq': { problem: 'Vonesa', whys: ['', ''] } }));
  assert.equal(page('en', 'five-whys', 'sc-five-whys', { 'sc-five-whys-sq': { problem: '', whys: ['', ''] } }), null);
});

test('the note is in the language of the page', () => {
  const dom = new JSDOM('<html lang="sq"><body><main><section class="tool-hero"></section></main>'
    + '<script type="application/json" id="work-elsewhere-data">{"key":"sc-fmea"}</script></body></html>',
  { url: 'https://example.test/sq/tools/fmea/', runScripts: 'outside-only' });
  dom.window.UiStrings = JSON.parse(fs.readFileSync('src/_data/sq/ui.json', 'utf8'));
  dom.window.localStorage.setItem('sc-fmea', JSON.stringify({ rows: [{ id: 'a' }] }));
  dom.window.eval(script);
  const note = dom.window.document.querySelector('.work-elsewhere');
  assert.match(note.textContent, /ruhet te faqja në një gjuhë tjetër/);
  assert.equal(note.querySelector('a').textContent, 'Hape në English');
});

test('the keys: every tool that keeps its work per language is in the map, the views and shared lists are not', async () => {
  const { default: keys } = await import('../src/_data/workKeys.js');
  assert.equal(keys.fmea, 'sc-fmea');
  assert.equal(keys['five-whys'], 'sc-five-whys');
  assert.equal(keys['sigma-control-chart'], 'sc-sigma-chart');
  for (const slug of ['shift-pulse', 'signals', 'ops-report', 'print-pack', 'action-tracker', 'pareto', 'cx-control-tower', 'cv-builder']) {
    assert.equal(keys[slug], undefined, `${slug} is left out`);
  }
  // The log tools say it in their own log (ToolKit.otherLogs).
  for (const slug of ['damage-control', 'oee', 'waste-log']) assert.equal(keys[slug], undefined, slug);
  // Every key in the map is the one the German and Albanian pages use with their suffix.
  const pages = fs.readdirSync('src/tools').filter((f) => f.endsWith('.njk'));
  for (const [slug, key] of Object.entries(keys)) {
    assert.ok(pages.includes(`${slug}.njk`), slug);
    assert.match(key, /^sc-[a-z0-9-]+$/, slug);
  }
});

test('the built tool pages carry the key and the script', { skip: !fs.existsSync('_site/tools/fmea/index.html') }, () => {
  for (const path of ['_site/tools/fmea/index.html', '_site/de/tools/fmea/index.html', '_site/sq/tools/five-whys/index.html']) {
    const html = fs.readFileSync(path, 'utf8');
    assert.match(html, /id="work-elsewhere-data">\{"key":"sc-(fmea|five-whys)"\}/, path);
    assert.match(html, /\/js\/work-elsewhere\.js/, path);
  }
  assert.doesNotMatch(fs.readFileSync('_site/tools/shift-pulse/index.html', 'utf8'), /work-elsewhere/);
  assert.doesNotMatch(fs.readFileSync('_site/tools/damage-control/index.html', 'utf8'), /work-elsewhere/);
});
