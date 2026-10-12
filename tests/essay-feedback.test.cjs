// Under an essay: the checklist as a Word file (src/js/checklist-word.js, written by js/docx-kit.js), the question
// "Did you try it?" (partials/essay-feedback.njk) and what readers wrote ("readers" in the front matter).
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const hasSite = fs.existsSync('_site/insights/gemba/index.html');
const built = (file) => fs.readFileSync(path.join('_site', file), 'utf8');

// An essay page with a card to fill in, as the layout renders it, and the two scripts.
const open = ({ fill = true } = {}) => {
  const items = fill
    ? '<li class="is-field"><label><span><b>01</b> Which result brought me here?</span><small>A number, not a feeling.</small><textarea data-checklist-item>Delay 2.8%</textarea></label></li><li class="is-field"><label><span><b>02</b> What did I see?</span><small>Facts, not impressions.</small><textarea data-checklist-item></textarea></label></li>'
    : '<li><label><input type="checkbox" data-checklist-item><span>The gates are closed.</span></label></li><li><label><input type="checkbox" data-checklist-item><span>Open problems have been handed over.</span></label></li>';
  const dom = new JSDOM(`<!doctype html><html lang="sq"><body><article data-article data-essay-id="gemba" data-essay-title="Gemba: çfarë sheh në terren">
    <aside class="essay-moves"><ol><li><b>01</b><span>Shko në terren me një numër.</span></li><li><b>02</b><span>Dëgjo para se të shpjegosh.</span></li></ol></aside>
    <section class="essay-checklist" data-essay-checklist data-essay-url="https://stivencatalyst.com/sq/insights/gemba/" data-lang="sq" data-site="Stiven Catalyst" data-author="Stiven Janaqi" data-word-from="Nga eseja" data-word-moves="Nesër në turn" data-word-answer="Përgjigjja juaj">
      <div class="essay-checklist-head"><p class="kicker">Fleta e një vizite në terren</p></div><ol>${items}</ol>
      <div class="essay-checklist-actions"><button type="button" data-checklist-word>Shkarko si Word</button></div>
      <p class="essay-checklist-note">Fletë orientuese.</p>
    </section></article></body></html>`, { url: 'https://stivencatalyst.com/sq/insights/gemba/', runScripts: 'outside-only' });
  const w = dom.window;
  w.TextEncoder = TextEncoder;
  w.eval(fs.readFileSync('src/js/docx-kit.js', 'utf8'));
  w.eval(fs.readFileSync('src/js/checklist-word.js', 'utf8'));
  return { w, box: w.document.querySelector('[data-essay-checklist]') };
};
const text = (bytes) => new TextDecoder('utf-8', { fatal: false }).decode(bytes);

test('the Word file carries the title, the questions with their hints, a typed answer, the note, the moves and where it comes from', () => {
  const { w, box } = open();
  const bytes = w.ChecklistWord.build(box);
  assert.ok(bytes instanceof w.Uint8Array || bytes instanceof Uint8Array);
  assert.equal(String.fromCharCode(bytes[0], bytes[1]), 'PK', 'a zip');
  const doc = text(bytes);
  for (const piece of ['Fleta e një vizite në terren', 'Nga eseja “Gemba: çfarë sheh në terren” · Stiven Catalyst', '01  Which result brought me here?', 'A number, not a feeling.', 'Delay 2.8%', '02  What did I see?', 'Përgjigjja juaj', 'Fletë orientuese.', 'Nesër në turn', 'Shko në terren me një numër.', 'https://stivencatalyst.com/sq/insights/gemba/', 'w:val="sq-AL"']) {
    assert.ok(doc.includes(piece), piece);
  }
  assert.ok(!doc.includes('<b>01</b>'), 'the number of the page is not repeated');
  assert.equal(w.ChecklistWord.fileName(box), 'gemba-sq-checklist.docx');
});

test('a list to tick off becomes boxes; the button downloads the file', () => {
  const { w, box } = open({ fill: false });
  const doc = text(w.ChecklistWord.build(box));
  assert.ok(doc.includes('☐  ') && doc.includes('The gates are closed.') && doc.includes('Open problems have been handed over.'));
  let saved = null;
  w.URL.createObjectURL = (blob) => { saved = blob; return 'blob:checklist'; };
  w.URL.revokeObjectURL = () => {};
  const clicked = [];
  w.HTMLAnchorElement.prototype.click = function () { clicked.push({ href: this.href, download: this.download }); };
  w.document.querySelector('[data-checklist-word]').click();
  assert.ok(saved, 'a file was made');
  assert.equal(saved.type, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  assert.deepEqual(clicked, [{ href: 'blob:checklist', download: 'gemba-sq-checklist.docx' }]);
});

test('the layout carries the Word button on the checklist, the readers box and the question, loads the scripts, and its texts are translated', () => {
  const layout = fs.readFileSync('src/_includes/layouts/article.njk', 'utf8');
  assert.match(layout, /data-checklist-word/);
  assert.ok(layout.indexOf('data-checklist-word') < layout.indexOf('data-checklist-copy'), 'Word before Copy');
  assert.match(layout, /class="essay-readers"/);
  assert.match(layout, /partials\/essay-feedback\.njk/);
  assert.ok(layout.indexOf('essay-feedback.njk') < layout.indexOf('class="essay-join"'), 'the question before Join in');
  for (const script of ['/js/feedback.js', '/js/docx-kit.js', '/js/checklist-word.js']) assert.ok(layout.includes(script), script);
  const found = new Set();
  for (const file of ['src/_includes/layouts/article.njk', 'src/_includes/partials/essay-feedback.njk']) {
    const source = fs.readFileSync(file, 'utf8');
    for (const match of source.matchAll(/'((?:[^'\\]|\\.)*)' \| t\(lang\)/g)) found.add(match[1]);
    for (const match of source.matchAll(/"((?:[^"\\]|\\.)*)" \| t\(lang\)/g)) found.add(match[1]);
  }
  assert.ok(found.has('Download as Word') && found.has('Did you try it?') && found.has('From the readers'));
  for (const lang of ['de', 'sq']) {
    const ui = JSON.parse(fs.readFileSync(`src/_data/${lang}/ui.json`, 'utf8'));
    for (const t of found) assert.ok(ui[t], `${lang}: ${t}`);
  }
  assert.equal((fs.readFileSync('.pages.yml', 'utf8').match(/name: readers/g) || []).length, 3, 'the CMS knows the readers field');
  assert.match(fs.readFileSync('src/datenschutz.njk', 'utf8'), /the question under each essay/);
});

test('the built essays carry the Word button, the question with its fields and the scripts, in the three languages', { skip: !hasSite }, () => {
  for (const [file, label] of [['insights/gemba/index.html', 'Download as Word'], ['de/insights/gemba/index.html', 'Als Word herunterladen'], ['sq/insights/gemba/index.html', 'Shkarko si Word']]) {
    const html = built(file);
    assert.ok(html.includes(`data-checklist-word>${label}<`), `${file}: the Word button`);
    assert.match(html, /<section class="essay-feedback"/, `${file}: the question`);
    for (const name of ['tried', 'message', 'industry', 'publish', 'email', 'essay', 'page', 'website']) assert.ok(html.includes(`name="${name}"`), `${file}: ${name}`);
    assert.equal((html.match(/data-tool-feedback(?![-\w])/g) || []).length, 1, `${file}: one form for the script`);
    for (const script of ['js/feedback.js', 'js/docx-kit.js', 'js/checklist-word.js']) assert.ok(html.includes(script), `${file}: ${script}`);
    assert.ok(html.indexOf('class="essay-feedback"') < html.indexOf('class="essay-join"'), `${file}: before Join in`);
  }
  const reflection = fs.readdirSync('_site/reflections').find((d) => fs.existsSync(`_site/reflections/${d}/index.html`));
  if (reflection) assert.match(built(`reflections/${reflection}/index.html`), /<section class="essay-feedback"/, 'a reflection asks too');
});
