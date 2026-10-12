// The operational treatise (lib/treatise, src/_data/treatise.js): every volume has its chapters in the three layers,
// every text in the three languages, every figure names a source that exists (or is marked as an invented
// example), the charts are drawn for print and for phones, and the printed volume (scripts/treatise.mjs) is there
// for the reader.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const LANGS = ['en', 'sq', 'de'];
const LAYERS = ['scene', 'concept', 'protocol'];
const load = async () => (await import('../src/_data/treatise.js')).default;
const raw = async () => {
  const dir = path.join(__dirname, '..', 'lib', 'treatise', 'volumes');
  const files = fs.readdirSync(dir).filter((name) => /^\d{2}\.js$/.test(name)).sort();
  return Promise.all(files.map(async (name) => ({ name, volume: (await import(path.join(dir, name))).default })));
};
// Every x(en, sq, de) text in a value, with where it was found.
const texts = (value, where = '', out = []) => {
  if (value && typeof value === 'object' && !Array.isArray(value) && LANGS.every((lang) => lang in value) && Object.keys(value).length === 3) {
    out.push([where, value]);
  } else if (Array.isArray(value)) value.forEach((item, i) => texts(item, `${where}[${i}]`, out));
  else if (value && typeof value === 'object') for (const [key, item] of Object.entries(value)) texts(item, `${where}.${key}`, out);
  return out;
};
const FIGURES = ['line', 'dumbbell', 'donut', 'people', 'pairs', 'columns', 'hbars', 'days', 'stat', 'stats', 'figures', 'timeline'];
// The pages of a volume laid flat, as the data file lists them: a chapter's pages follow each other.
const flat = (volume) => volume.pages.flatMap((page) => (page.type === 'chapter' ? page.pages : [page]));

test('the volumes are numbered 1, 2, 3 … one file each, with the number in the file name and a Roman numeral', async () => {
  const files = await raw();
  assert.ok(files.length >= 1);
  files.forEach(({ name, volume }, i) => {
    assert.equal(volume.number, i + 1, name);
    assert.equal(name, `${String(volume.number).padStart(2, '0')}.js`);
    assert.match(volume.numeral, /^[IVX]+$/, name);
  });
});

test('every volume opens with the cover, the editorial and the contents, and closes with the sources and the back cover', async () => {
  const treatise = await load();
  for (const volume of treatise.volumes) {
    assert.ok(volume.pageCount >= 12, `${volume.slug}: ${volume.pageCount} pages`);
    for (const lang of LANGS) {
      const types = volume[lang].pages.map((page) => page.type || 'content');
      assert.deepEqual(types.slice(0, 3), ['cover', 'intro', 'contents'], `${volume.slug} ${lang}`);
      assert.deepEqual(types.slice(-2), ['sources', 'back'], `${volume.slug} ${lang}`);
      assert.equal(volume[lang].pages.length, volume.pageCount);
    }
  }
});

test('every chapter is built in the three layers, in their order: the scene first, the protocol last', async () => {
  for (const { name, volume } of await raw()) {
    const chapters = volume.pages.filter((page) => page.type === 'chapter');
    assert.ok(chapters.length >= 3, `${name}: ${chapters.length} chapters`);
    for (const chapter of chapters) {
      assert.match(chapter.numeral, /^[IVX]+$/, `${name} ${chapter.id}`);
      const layers = chapter.pages.map((page) => page.layer);
      for (const layer of layers) assert.ok(LAYERS.includes(layer), `${name} ${chapter.id}: layer ${layer}`);
      assert.equal(layers[0], 'scene', `${name} ${chapter.id}: the scene opens the chapter`);
      assert.equal(layers.at(-1), 'protocol', `${name} ${chapter.id}: the protocol closes it`);
      assert.ok(layers.includes('concept'), `${name} ${chapter.id}: the breakdown`);
      // The layers follow each other: never back from the protocol to the scene.
      const order = layers.map((layer) => LAYERS.indexOf(layer));
      assert.deepEqual(order, [...order].sort(), `${name} ${chapter.id}: ${layers.join(', ')}`);
      // A scene says what it is.
      assert.equal(chapter.pages[0].blocks[0].type, 'flag', `${name} ${chapter.id}: the scene opens with its flag`);
    }
    const ids = flat(volume).map((page) => page.id);
    assert.equal(new Set(ids).size, ids.length, `${name}: page ids are unique`);
  }
});

test('every text of a volume is written in English, Albanian and German', async () => {
  for (const { name, volume } of await raw()) {
    const found = texts(volume);
    assert.ok(found.length > 150, `${name}: ${found.length} texts`);
    for (const [where, text] of found) {
      for (const lang of LANGS) assert.ok(typeof text[lang] === 'string' && text[lang].trim(), `${name}${where} ${lang}`);
    }
  }
});

test('the shared labels and the three layers of the treatise are written in the three languages', async () => {
  const { common, layers } = await import('../lib/treatise/common.js');
  assert.equal(layers.length, 3);
  assert.deepEqual(layers.map((layer) => layer.id), LAYERS);
  for (const [where, text] of [...texts(common), ...texts(layers)]) {
    for (const lang of LANGS) assert.ok(text[lang], `${where} ${lang}`);
  }
  for (const lang of LANGS) assert.ok(common.name[lang].length > 30, `${lang}: the full name`);
});

test('every page with a figure names its source or is marked as an invented example, and every source is in the list of the volume', async () => {
  const { sources } = await import('../lib/weekly/sources.js');
  const ids = new Set(sources.map((source) => source.id));
  for (const { name, volume } of await raw()) {
    for (const id of volume.sources) assert.ok(ids.has(id), `${name}: unknown source ${id}`);
    for (const page of flat(volume)) {
      const used = [...(page.source || []), ...(page.blocks || []).flatMap((block) => block.source || [])];
      for (const id of used) assert.ok(volume.sources.includes(id), `${name} ${page.id}: ${id} is not in the sources of the volume`);
      const figures = (page.blocks || []).filter((block) => FIGURES.includes(block.type));
      if (figures.length && !figures.every((block) => block.hypothetical)) {
        assert.ok(page.source && page.source.length, `${name} ${page.id}: a page with figures needs its source`);
      }
    }
    const all = new Set(flat(volume).flatMap((page) => [...(page.source || []), ...(page.blocks || []).flatMap((block) => block.source || [])]));
    for (const id of volume.sources) assert.ok(all.has(id), `${name}: ${id} is listed but not used`);
  }
});

test('the charts are drawn for the print and again, narrower, for phones, each with its source line', async () => {
  const treatise = await load();
  for (const volume of treatise.volumes) {
    for (const lang of LANGS) {
      const charts = volume[lang].charts;
      assert.ok(charts.length >= 2, `${volume.slug} ${lang}: ${charts.length} charts`);
      for (const chart of charts) {
        assert.match(chart.svg, /^<svg class="wk-svg[^"]*" viewBox="0 0 (340|120) /, `${volume.slug} ${lang} ${chart.type}`);
        assert.ok(chart.alt && !chart.alt.includes('undefined'), `${volume.slug} ${lang} ${chart.type}: ${chart.alt}`);
        assert.ok(!chart.svg.includes('NaN') && !chart.svg.includes('undefined'), `${volume.slug} ${lang} ${chart.type}`);
        if (chart.type !== 'donut') assert.match(chart.svgNarrow, /viewBox="0 0 230 /, `${volume.slug} ${lang} ${chart.type}`);
        assert.ok(chart.sourceLine, `${volume.slug} ${lang} ${chart.type}: source`);
        if (chart.hypothetical) assert.equal(chart.sourceLine, treatise[lang].labels.hypothetical);
      }
      const lines = [...volume[lang].pages.map((page) => page.sourceLine), ...charts.map((chart) => chart.sourceLine)];
      for (const line of lines.filter(Boolean)) {
        const parts = line.split('; ');
        assert.equal(new Set(parts).size, parts.length, `${volume.slug} ${lang}: ${line}`);
      }
    }
  }
});

test('the contents name every chapter page, the teasers point at pages of the volume, and the essays it links to exist', async () => {
  const treatise = await load();
  const essays = fs.readdirSync('src/content/insights').map((file) => file.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, ''));
  for (const volume of treatise.volumes) {
    for (const lang of LANGS) {
      const V = volume[lang];
      assert.equal(V.teasers.length, 3, volume.slug);
      for (const teaser of V.teasers) assert.ok(teaser.number > 3 && teaser.number < volume.pageOf.sources, `${volume.slug}: ${teaser.page}`);
      for (const page of V.pages) if (page.more) assert.ok(essays.includes(page.more), `${volume.slug}: essay ${page.more}`);
      assert.ok(V.seo.length <= 160, `${volume.slug} ${lang}: the search description is ${V.seo.length} characters`);
      assert.equal(V.chapters.length, volume.chapterCount);
      for (const chapter of V.chapters) {
        for (const page of chapter.pages) {
          assert.ok(page.number > 3 && page.heading && page.layerShort, `${volume.slug} ${lang} ${chapter.id}: ${page.id}`);
          assert.equal(V.pages[page.number - 1].id, page.id);
        }
      }
      // Every chapter page carries its chapter in its kicker and its layer in its running head.
      for (const page of V.pages.filter((page) => page.chapter)) {
        assert.ok(page.kicker.includes(page.chapter.numeral) && page.kicker.includes(page.chapter.title), `${volume.slug} ${lang} ${page.id}: kicker`);
        assert.ok(page.run.includes(page.layerInfo.short), `${volume.slug} ${lang} ${page.id}: running head`);
      }
      assert.ok(V.also.some((page) => page.id === 'tool'), `${volume.slug} ${lang}: the tool outside the chapters`);
    }
  }
});

test('every volume is printed: its PDF, its cover and its preview in every language', async () => {
  const treatise = await load();
  const pages = JSON.parse(fs.readFileSync('src/_data/magazinePages.json', 'utf8'));
  for (const volume of treatise.volumes) {
    for (const lang of LANGS) {
      const hint = `${volume.slug} ${lang}: run node scripts/treatise.mjs ${volume.number}`;
      const entry = pages[volume.slug] && pages[volume.slug][lang];
      assert.ok(entry && entry.pageCount === volume.pageCount, hint);
      assert.equal(entry.pages.length, 1, hint);
      assert.ok(fs.existsSync(path.join('src', entry.pages[0].image)), `${hint} (${entry.pages[0].image})`);
      assert.ok(fs.existsSync(`src/media/magazine/${volume.slug}/${volume.slug}-${lang}.pdf`), hint);
      assert.ok(fs.existsSync(`src/media/magazine/${volume.slug}/${lang}/social.jpg`), hint);
    }
  }
});

const hasSite = fs.existsSync('_site/magazine/operational-treatise.html');
const built = (file) => fs.readFileSync(path.join('_site', file), 'utf8');
const escaped = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

test('each volume has its page in each language, with the reader, the layers, the charts and the text', { skip: !hasSite }, async () => {
  const treatise = await load();
  for (const volume of treatise.volumes) {
    for (const lang of LANGS) {
      const html = built(`${lang === 'en' ? '' : `${lang}/`}magazine/${volume.slug}.html`);
      assert.match(html, /data-book-pages/, `${volume.slug} ${lang}: reader`);
      assert.equal((html.match(/class="book-page is-live"/g) || []).length, volume.pageCount, `${volume.slug} ${lang}: live pages`);
      assert.equal((html.match(/<section class="pg/g) || []).length, volume.pageCount, `${volume.slug} ${lang}: printed pages`);
      assert.match(html, /<link rel="stylesheet" href="\/treatise-pages\.css\?v=[0-9a-f]{10}">/, `${volume.slug} ${lang}: the stylesheet of the pages`);
      assert.equal((html.match(/data-weekly-chart/g) || []).length, volume[lang].charts.length, `${volume.slug} ${lang}: charts`);
      assert.equal((html.match(/class="treatise-layer is-/g) || []).length, 3, `${volume.slug} ${lang}: the three layers above the reader`);
      assert.equal((html.match(/<ol class="tr-layers"/g) || []).length, volume[lang].pages.filter((page) => page.layer).length, `${volume.slug} ${lang}: a layer strip on every chapter page`);
      assert.ok(html.includes(escaped(volume[lang].heading)), `${volume.slug} ${lang}: title`);
      assert.ok(html.includes(`/media/magazine/${volume.slug}/${volume.slug}-${lang}.pdf`), `${volume.slug} ${lang}: PDF`);
    }
  }
});

test('the list of all volumes, Publications and the home page show the treatise in every language', { skip: !hasSite }, async () => {
  const treatise = await load();
  for (const lang of LANGS) {
    const prefix = lang === 'en' ? '' : `${lang}/`;
    const archive = built(`${prefix}magazine/operational-treatise.html`);
    for (const volume of treatise.volumes) assert.ok(archive.includes(`/${prefix}magazine/${volume.slug}.html`), `${lang}: ${volume.slug}`);
    assert.ok(archive.includes(escaped(treatise[lang].name)), `${lang}: the full name on the list`);
    assert.ok(archive.includes(`/${prefix}magazine/management-review.html`), `${lang}: the way to the monthly issues`);
    const publications = built(`${prefix}publications.html`);
    assert.ok(publications.includes(`/${prefix}magazine/${treatise.latest.slug}.html`), `${lang}: newest volume`);
    assert.ok(publications.includes(`/${prefix}magazine/operational-treatise.html`), `${lang}: all volumes`);
    for (const volume of treatise.volumes.slice(0, -1)) assert.ok(!publications.includes(`/${prefix}magazine/${volume.slug}.html`), `${lang}: ${volume.slug} only on the list`);
    const home = built(`${prefix}index.html`);
    assert.ok(home.includes(`/${prefix}magazine/${treatise.latest.slug}.html`), `${lang}: the newest volume on the home shelf`);
  }
});
