// The monthly Management Review (lib/weekly, src/_data/weekly.js): every issue has its ten pages in the three
// languages, every figure names a source that exists, the charts are drawn for print and for phones, and the
// printed issue (scripts/weekly.mjs) is there for the reader.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const LANGS = ['en', 'sq', 'de'];
const load = async () => (await import('../src/_data/weekly.js')).default;
const raw = async () => {
  const dir = path.join(__dirname, '..', 'lib', 'weekly', 'issues');
  const files = fs.readdirSync(dir).filter((name) => /^\d{2}\.js$/.test(name)).sort();
  return Promise.all(files.map(async (name) => ({ name, issue: (await import(path.join(dir, name))).default })));
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
const PLAN = ['cover', 'intro', 'sources', 'back'];

test('the issues are numbered 1, 2, 3 … one file each, with the number in the file name', async () => {
  const files = await raw();
  assert.ok(files.length >= 1);
  files.forEach(({ name, issue }, i) => {
    assert.equal(issue.number, i + 1, name);
    assert.equal(name, `${String(issue.number).padStart(2, '0')}.js`);
  });
});

test('every issue has ten pages: the cover first, the contents second, the sources and the back cover last', async () => {
  const weekly = await load();
  for (const issue of weekly.issues) {
    assert.equal(issue.pageCount, 10, issue.slug);
    for (const lang of LANGS) {
      const types = issue[lang].pages.map((page) => page.type || 'content');
      assert.deepEqual([types[0], types[1], types[8], types[9]], PLAN, `${issue.slug} ${lang}`);
      assert.equal(types.filter((type) => type === 'content').length, 6, `${issue.slug} ${lang}`);
    }
  }
});

test('every text of an issue is written in English, Albanian and German', async () => {
  for (const { name, issue } of await raw()) {
    const found = texts(issue);
    assert.ok(found.length > 100, `${name}: ${found.length} texts`);
    for (const [where, text] of found) {
      for (const lang of LANGS) assert.ok(typeof text[lang] === 'string' && text[lang].trim(), `${name}${where} ${lang}`);
    }
  }
});

test('the shared labels of the weekly are written in the three languages', async () => {
  const { common, blocks } = await import('../lib/weekly/common.js');
  for (const [where, text] of [...texts(common), ...texts(blocks)]) {
    for (const lang of LANGS) assert.ok(text[lang], `${where} ${lang}`);
  }
});

test('every page with a figure names its source, and every source is in the list of the issue', async () => {
  const { sources } = await import('../lib/weekly/sources.js');
  const ids = new Set(sources.map((source) => source.id));
  assert.equal(ids.size, sources.length, 'source ids are unique');
  for (const source of sources) {
    assert.ok(source.title && source.by && source.year, source.id);
    if (source.url) assert.match(source.url, /^https:\/\//, source.id);
  }
  for (const { name, issue } of await raw()) {
    for (const id of issue.sources) assert.ok(ids.has(id), `${name}: unknown source ${id}`);
    for (const page of issue.pages) {
      const used = [...(page.source || []), ...(page.blocks || []).flatMap((block) => block.source || [])];
      for (const id of used) assert.ok(issue.sources.includes(id), `${name} ${page.id}: ${id} is not in the sources of the issue`);
      if ((page.blocks || []).some((block) => FIGURES.includes(block.type))) {
        assert.ok(page.source && page.source.length, `${name} ${page.id}: a page with figures needs its source`);
      }
    }
    // Every source of the issue is used on some page.
    const all = new Set(issue.pages.flatMap((page) => [...(page.source || []), ...(page.blocks || []).flatMap((block) => block.source || [])]));
    for (const id of issue.sources) assert.ok(all.has(id), `${name}: ${id} is listed but not used`);
  }
});

test('a source line never names the same thing twice: two sources by one author in one year carry their titles', async () => {
  const weekly = await load();
  for (const issue of weekly.issues) {
    for (const lang of LANGS) {
      const lines = [...issue[lang].pages.map((page) => page.sourceLine), ...issue[lang].charts.map((chart) => chart.sourceLine)];
      for (const line of lines.filter(Boolean)) {
        const parts = line.split('; ');
        assert.equal(new Set(parts).size, parts.length, `${issue.slug} ${lang}: ${line}`);
      }
    }
  }
});

test('the charts are drawn for the print and again, narrower, for phones', async () => {
  const weekly = await load();
  for (const issue of weekly.issues) {
    for (const lang of LANGS) {
      const charts = issue[lang].charts;
      assert.ok(charts.length >= 1, `${issue.slug} ${lang}: ${charts.length} charts`);
      for (const chart of charts) {
        assert.match(chart.svg, /^<svg class="wk-svg[^"]*" viewBox="0 0 (340|120) /, `${issue.slug} ${lang} ${chart.type}`);
        assert.ok(chart.alt && !chart.alt.includes('undefined'), `${issue.slug} ${lang} ${chart.type}: ${chart.alt}`);
        assert.ok(!chart.svg.includes('NaN') && !chart.svg.includes('undefined'), `${issue.slug} ${lang} ${chart.type}`);
        if (chart.type !== 'donut') assert.match(chart.svgNarrow, /viewBox="0 0 230 /, `${issue.slug} ${lang} ${chart.type}`);
        assert.ok(chart.sourceLine, `${issue.slug} ${lang} ${chart.type}: source`);
      }
    }
  }
});

test('the teasers of the cover point at pages of the issue, and the essays it links to exist', async () => {
  const weekly = await load();
  const essays = fs.readdirSync('src/content/insights').map((file) => file.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, ''));
  for (const issue of weekly.issues) {
    for (const lang of LANGS) {
      assert.equal(issue[lang].teasers.length, 3, issue.slug);
      for (const teaser of issue[lang].teasers) assert.ok(teaser.number > 2 && teaser.number < 9, `${issue.slug}: ${teaser.page}`);
      for (const page of issue[lang].pages) if (page.more) assert.ok(essays.includes(page.more), `${issue.slug}: essay ${page.more}`);
      assert.ok(issue[lang].seo.length <= 160, `${issue.slug} ${lang}: the search description is ${issue[lang].seo.length} characters`);
    }
  }
});

test('every issue is printed: its PDF, its cover and its preview in every language', async () => {
  const weekly = await load();
  const pages = JSON.parse(fs.readFileSync('src/_data/magazinePages.json', 'utf8'));
  for (const issue of weekly.issues) {
    for (const lang of LANGS) {
      const hint = `${issue.slug} ${lang}: run node scripts/weekly.mjs ${issue.number}`;
      const entry = pages[issue.slug] && pages[issue.slug][lang];
      assert.ok(entry && entry.pageCount === 10, hint);
      // The reader shows the pages alive; only the cover is kept as a picture, for the hero, the lists and the preview.
      assert.equal(entry.pages.length, 1, hint);
      assert.ok(fs.existsSync(path.join('src', entry.pages[0].image)), `${hint} (${entry.pages[0].image})`);
      assert.ok(fs.existsSync(`src/media/magazine/${issue.slug}/${issue.slug}-${lang}.pdf`), hint);
      assert.ok(fs.existsSync(`src/media/magazine/${issue.slug}/${lang}/social.jpg`), hint);
    }
  }
});

const hasSite = fs.existsSync('_site/magazine/management-review.html');
const built = (file) => fs.readFileSync(path.join('_site', file), 'utf8');
// A text as Nunjucks writes it into the page, with its apostrophes, quotes and ampersands escaped once.
const escaped = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

test('each issue has its page in each language, with the reader, the charts and the text', { skip: !hasSite }, async () => {
  const weekly = await load();
  for (const issue of weekly.issues) {
    for (const lang of LANGS) {
      const html = built(`${lang === 'en' ? '' : `${lang}/`}magazine/${issue.slug}.html`);
      assert.match(html, /data-book-pages/, `${issue.slug} ${lang}: reader`);
      assert.equal((html.match(/class="book-page is-live"/g) || []).length, 10, `${issue.slug} ${lang}: ten live pages`);
      assert.equal((html.match(/<section class="pg/g) || []).length, 10, `${issue.slug} ${lang}: ten printed pages`);
      assert.match(html, /<link rel="stylesheet" href="\/review-pages\.css\?v=[0-9a-f]{10}">/, `${issue.slug} ${lang}: the stylesheet of the pages`);
      assert.equal((html.match(/data-weekly-chart/g) || []).length, issue[lang].charts.length, `${issue.slug} ${lang}: charts`);
      assert.ok(html.includes(escaped(issue[lang].heading)), `${issue.slug} ${lang}: title`);
      assert.ok(html.includes(`/media/magazine/${issue.slug}/${issue.slug}-${lang}.pdf`), `${issue.slug} ${lang}: PDF`);
    }
  }
});

test('the list of all issues and Publications show the weekly in every language', { skip: !hasSite }, async () => {
  const weekly = await load();
  for (const lang of LANGS) {
    const prefix = lang === 'en' ? '' : `${lang}/`;
    const archive = built(`${prefix}magazine/management-review.html`);
    for (const issue of weekly.issues) assert.ok(archive.includes(`/${prefix}magazine/${issue.slug}.html`), `${lang}: ${issue.slug}`);
    assert.ok(archive.includes('/magazine/management-review-2026-09.html'), `${lang}: the special edition`);
    const publications = built(`${prefix}publications.html`);
    assert.ok(publications.includes(`/${prefix}magazine/${weekly.latest.slug}.html`), `${lang}: newest issue`);
    assert.ok(publications.includes(`/${prefix}magazine/management-review.html`), `${lang}: all issues`);
  }
});

test('the lists of all issues can be narrowed to the month of an edition', { skip: !hasSite }, async () => {
  const weekly = await load();
  const magazine = (await import('../src/_data/magazine.js')).default;
  for (const [data, page] of [[weekly, 'management-review'], [magazine, 'from-the-floor']]) {
    assert.deepEqual(data.months.map((month) => month.id), [...new Set(data.issues.map((issue) => issue.month))].sort().reverse(), `${page}: the newest month first`);
    assert.equal(data.months.reduce((sum, month) => sum + month.count, 0), data.issues.length, `${page}: every issue in one month`);
    for (const issue of data.issues) assert.match(issue.month, /^\d{4}-\d{2}$/, `${issue.slug}: month`);
    for (const lang of LANGS) {
      const prefix = lang === 'en' ? '' : `${lang}/`;
      const archive = built(`${prefix}magazine/${page}.html`);
      if (data.months.length > 1) for (const month of data.months) assert.ok(archive.includes(`data-month="${month.id}">${escaped(month[lang])}`), `${page} ${lang}: the button of ${month.id}`);
      assert.equal((archive.match(/<li data-block="[a-z]+" data-month="\d{4}-\d{2}">/g) || []).length, data.issues.length, `${page} ${lang}: every cover has its month`);
      assert.ok(archive.includes('data-weekly-more') && archive.includes('/js/weekly.js'), `${page} ${lang}: show more`);
    }
  }
});

test('the monthly magazine is gathered the same way: its newest issue on Publications, all of them on their list', { skip: !hasSite }, async () => {
  const { default: magazine } = await import('../src/_data/magazine.js');
  for (const lang of LANGS) {
    const prefix = lang === 'en' ? '' : `${lang}/`;
    const archive = built(`${prefix}magazine/from-the-floor.html`);
    for (const issue of magazine.issues) assert.ok(archive.includes(`/${prefix}magazine/${issue.slug}.html`), `${lang}: ${issue.slug}`);
    const publications = built(`${prefix}publications.html`);
    assert.ok(publications.includes(`/${prefix}magazine/${magazine.latest.slug}.html`), `${lang}: newest issue`);
    assert.ok(publications.includes(`/${prefix}magazine/from-the-floor.html`), `${lang}: all issues`);
    for (const issue of magazine.issues.slice(0, -1)) assert.ok(!publications.includes(`/${prefix}magazine/${issue.slug}.html`), `${lang}: ${issue.slug} only on the list`);
  }
});

test('no page writes its title or description escaped twice', { skip: !hasSite }, () => {
  // eleventyComputed values are rendered by Nunjucks before the layout escapes them again; "Google's" must reach the
  // page as "Google&#39;s", never "Google&amp;#39;s".
  const pages = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === 'media' ? [] : pages(file);
    return entry.name.endsWith('.html') ? [file] : [];
  });
  const twice = [];
  for (const file of pages('_site')) {
    const head = fs.readFileSync(file, 'utf8').split('</head>')[0];
    if (/&amp;(#39|#x27|amp|quot|lt|gt);/.test(head)) twice.push(path.relative('_site', file));
  }
  assert.deepEqual(twice, []);
});

test('the issues come in monthly series of 40: the label names the series, the date its month', async () => {
  const { common, SERIES_SIZE, seriesOf } = await import('../lib/weekly/common.js');
  const { default: weekly } = await import('../src/_data/weekly.js');
  assert.equal(SERIES_SIZE, 40);
  assert.deepEqual([1, 40, 41, 80, 81].map(seriesOf), [1, 1, 2, 2, 3]);
  const months = { 1: 'Tetor 2026', 2: 'Nëntor 2026', 3: 'Dhjetor 2026' };
  for (const issue of weekly.issues) {
    for (const lang of ['en', 'sq', 'de']) {
      assert.equal(issue[lang].edition, common.labels.series[seriesOf(issue.number) - 1][lang], `${issue.no} ${lang}`);
    }
    if (months[seriesOf(issue.number)]) assert.equal(issue.sq.date, months[seriesOf(issue.number)], `${issue.no}: the month of its series`);
  }
  assert.equal(weekly.issues[0].sq.edition, 'Seria e parë');
  for (const file of ['src/_includes/print/weekly-page.njk', 'src/_includes/pages/weekly-issue.njk']) {
    assert.match(fs.readFileSync(file, 'utf8'), /I\.edition \}\} · \{\{ I\.date/, file);
  }
});
