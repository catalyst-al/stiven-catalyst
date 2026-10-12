// The diagrams inside the essays (lib/diagrams.js): every text in the three languages, every essay that names a
// diagram marks its place in the three language files, the marker becomes the figure in the built pages and
// never shows as text.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const yaml = require('js-yaml');

const DIRS = { en: 'src/content/insights', de: 'src/content/de/insights', sq: 'src/content/sq/insights' };
const load = () => import('../lib/diagrams.js');
const essays = (dir) => fs.readdirSync(dir).filter((f) => f.endsWith('.md')).map((file) => {
  const text = fs.readFileSync(path.join(dir, file), 'utf8');
  const m = text.match(/^---\n([\s\S]*?)\n---\n/);
  return { file, slug: file.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, ''), data: yaml.load(m[1]), body: text.slice(m[0].length) };
});
const texts = (value, out = []) => {
  if (value && typeof value === 'object' && 'en' in value) out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => texts(v, out));
  else if (value && typeof value === 'object') Object.values(value).forEach((v) => texts(v, out));
  return out;
};

test('every diagram has a known shape and every one of its texts in English, German and Albanian', async () => {
  const { DIAGRAMS } = await load();
  assert.ok(DIAGRAMS.length >= 10, `${DIAGRAMS.length} diagrams`);
  const ids = new Set();
  for (const d of DIAGRAMS) {
    assert.match(d.id, /^[a-z-]+$/);
    assert.ok(!ids.has(d.id), `${d.id} twice`); ids.add(d.id);
    assert.ok(['flow', 'loop', 'handoff', 'ladder', 'layers', 'paths'].includes(d.type), `${d.id}: ${d.type}`);
    const all = texts(d);
    assert.ok(all.length >= 6, `${d.id}: ${all.length} texts`);
    for (const text of all) for (const lang of ['en', 'de', 'sq']) assert.ok(text[lang] && text[lang].trim().length > 1, `${d.id}: ${JSON.stringify(text)} in ${lang}`);
  }
});

test('the figure carries the texts of its language, escapes them, and takes the place of the marker', async () => {
  const { renderDiagram, withDiagram, DIAGRAMS } = await load();
  for (const d of DIAGRAMS) {
    for (const lang of ['en', 'de', 'sq']) {
      const html = renderDiagram(d.id, lang);
      assert.match(html, new RegExp(`^<figure class="essay-diagram dg dg-${d.type}" data-diagram="${d.id}"`), `${d.id} ${lang}`);
      assert.ok(html.includes(d.title[lang].replace(/&/g, '&amp;')), `${d.id}: title in ${lang}`);
      assert.ok(html.includes(d.caption[lang].replace(/&/g, '&amp;').replace(/"/g, '&quot;')), `${d.id}: caption in ${lang}`);
      if (lang !== 'en' && d.title.en !== d.title[lang]) assert.ok(!html.includes(`>${d.title.en}<`), `${d.id}: no English title in ${lang}`);
    }
  }
  assert.equal(renderDiagram('no-such-diagram', 'en'), '');
  const body = '<p>Before.</p>\n<p>{diagram}</p>\n<h2>After</h2>';
  const placed = withDiagram(body, 'gemba-loop', 'sq');
  assert.ok(placed.startsWith('<p>Before.</p>\n<figure class="essay-diagram dg dg-loop"'), 'in place of the marker');
  assert.ok(placed.endsWith('<h2>After</h2>') && !placed.includes('{diagram}'));
  assert.ok(withDiagram('<p>Only text.</p>', 'gemba-loop', 'en').endsWith('</figure>'), 'after the text without a marker');
  assert.equal(withDiagram(body, undefined, 'en'), '<p>Before.</p>\n<h2>After</h2>', 'a stray marker goes, with no diagram named');
  assert.equal(withDiagram(body, 'no-such-diagram', 'en'), '<p>Before.</p>\n<h2>After</h2>');
});

test('every essay that names a diagram names a known one and marks its place once, in the three languages, at the same section', async () => {
  const { diagramById } = await load();
  const english = essays(DIRS.en);
  const withOne = english.filter((e) => e.data.diagram);
  assert.ok(withOne.length >= 10, `${withOne.length} essays with a diagram`);
  const position = (body) => {
    const blocks = body.split('\n').filter((l) => l.trim());
    const i = blocks.indexOf('{diagram}');
    return { headingsBefore: blocks.slice(0, i).filter((l) => l.startsWith('## ')).length, blocksBefore: i };
  };
  for (const e of english) {
    for (const lang of ['de', 'sq']) {
      const other = essays(DIRS[lang]).find((o) => (o.data.original || o.slug) === e.slug);
      assert.ok(other, `${lang}: ${e.slug}`);
      assert.equal(other.data.diagram, e.data.diagram, `${lang}/${other.file}: the same diagram as the English essay`);
      assert.equal((other.body.match(/\{diagram\}/g) || []).length, (e.body.match(/\{diagram\}/g) || []).length, `${lang}/${other.file}: the marker`);
      if (e.data.diagram) assert.deepEqual(position(other.body), position(e.body), `${lang}/${other.file}: the marker at the same place`);
    }
    if (!e.data.diagram) { assert.ok(!e.body.includes('{diagram}'), `${e.file}: a marker without a diagram`); continue; }
    assert.ok(diagramById(e.data.diagram), `${e.file}: unknown diagram ${e.data.diagram}`);
    assert.equal((e.body.match(/^\{diagram\}$/gm) || []).length, 1, `${e.file}: one marker on its own line`);
  }
});

test('the built pages show the figure where the marker was, in the language of the page, and the marker nowhere', { skip: !fs.existsSync('_site/insights/gemba/index.html') }, async () => {
  const { DIAGRAMS } = await load();
  for (const [lang, prefix] of [['en', ''], ['de', 'de/'], ['sq', 'sq/']]) {
    for (const e of essays(DIRS[lang])) {
      const file = `_site/${prefix}insights/${e.slug}/index.html`;
      if (!fs.existsSync(file)) continue;
      const html = fs.readFileSync(file, 'utf8');
      assert.ok(!html.includes('{diagram}'), `${file}: the marker shows`);
      if (!e.data.diagram) { assert.ok(!html.includes('class="essay-diagram'), `${file}: a figure without a diagram`); continue; }
      const d = DIAGRAMS.find((x) => x.id === e.data.diagram);
      const figure = html.match(/<figure class="essay-diagram[\s\S]*?<\/figure>/);
      assert.ok(figure, `${file}: the figure`);
      assert.ok(figure[0].replace(/<[^>]+>/g, '').includes(d.title[lang]), `${file}: the title in ${lang}`);
      assert.ok(html.indexOf('class="essay-diagram') < html.indexOf('class="essay-checklist'), `${file}: inside the text, before the checklist`);
    }
  }
  const feed = fs.readFileSync('_site/sq/feed.xml', 'utf8');
  assert.ok(!feed.includes('{diagram}'), 'the feed carries the figure, not the marker');
});
