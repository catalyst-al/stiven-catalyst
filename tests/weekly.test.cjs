// The monthly Management Review (lib/weekly, src/_data/weekly.js): every issue has its ten pages in the three
// languages, every figure names a source that exists, the charts are drawn for print and for phones with a note on
// what they count, and the printed issue (scripts/weekly.mjs) is there for the reader.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const LANGS = ['en', 'sq', 'de'];
const load = async () => (await import('../src/_data/weekly.js')).default;

// What a chart's note must hold (audit P5-10): a word for how the figure is measured (a share, a rate, a survey, a
// correlation, self-reports, a sample, a unit of time or of people), or something of the chart itself.
const NOTE_BASIS = {
  en: /%|\bshare|\bper\b|\bout of\b|\bsurvey|\brespondent|\bsample|\bcount|\bestimate|\bpoints?\b|\brate\b|\baverage|\bmedian|\bindex\b|\bscore|\bminutes?\b|\bhours?\b|\bdays?\b|\bweeks?\b|\byears?\b|\bpeople\b|\bworkers?\b|\bemployees?\b|\bmanagers?\b|\bratio|\btimes\b|\bin \d+\b|\bnumber of\b|\btotal\b|\bmillion|\bbillion|\bcases?\b|\bincidents?\b|\bmeasured\b|\bcorrelat|\beffect sizes?|\brelative risk|\bself-report|\bstud(?:y|ies)\b|\bdata\b|\bfigures?\b|\bbefore and after|\bforecast|\bscenario|\bcontrol group|\bexperiment|\bweights?\b|\btable\b|\bp = |\bsums?\b|\bassessment/i,
  de: /%|\banteil|\bje\b|\bpro\b|\bvon \d|\bumfrage|\bbefragt|\bstichprobe|\bzahl|\bschätz|\bpunkte?\b|\brate\b|\bdurchschnitt|\bmittel|\bmedian|\bindex\b|\bminuten?\b|\bstunden?\b|\btage?n?\b|\bwochen?\b|\bjahre?n?\b|\bmenschen\b|\bbeschäftigte|\bmitarbeit|\bführungskräfte|\bverhältnis|\bmal\b|\bmillion|\bmilliard|\bfälle?n?\b|\bgemessen|\bsumme\b|\binsgesamt\b|\bkorrelation|\beffektst|\beffektgr|\brelative risik|\bselbstausk|\bstudie|\bdaten\b|\bzahlen?\b|\bvorher|\bprognose|\bszenario|\bkontrollgruppe|\bexperiment|\bgewicht|\btabelle|\bp = |\bsummen?\b|\bsegment|\bzähl|\bwartezeit|\babbildung/i,
  sq: /%|\bpjes|\bpër\b|\bnga \d|\banket|\bmostr|\bnumër|\bnumri|\bvlerës|\bpikë|\bnorm|\bmesatar|\bmedian|\bindeks|\bminut|\bor[ëe]\b|\borë|\bdit[ëe]|\bjav[ëe]|\bvit|\bnjerëz|\bpunonjës|\bpuntor|\bmenaxher|\braport|\bher[ëe]\b|\bmilion|\bmiliard|\braste?\b|\bmatur|\bgjithsej\b|\btotal|\bkorrelac|\bmadhësi efekti|\brrezik|\bvetëdeklar|\bstudim|\bdhëna|\bshifr|\bpara dhe pas|\bparashikim|\bskenar|\bgrup kontrolli|\beksperiment|\bpesh|\btabel|\bp = |\bshum|\bfigur|\bvlerësim/i,
};
const foldText = (text) => String(text || '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const COMMON_WORDS = /^(the|and|for|from|with|von|der|die|das|und|des|nga|dhe|per|report|study|survey|data|article|page|press|release|fact|sheet|accessed|retrieved|online|journal|review|vol|pdf|https?|www|com|org|html)$/;
const notePointsAtChart = (chart) => {
  const note = foldText(chart.note);
  const source = foldText([chart.sourceLine, chart.source, ...(Array.isArray(chart.sources) ? chart.sources.map((s) => (typeof s === 'string' ? s : JSON.stringify(s))) : [])].filter(Boolean).join(' '));
  const words = (source.match(/[a-z][a-z&.'-]{2,}/g) || []).filter((word) => !COMMON_WORDS.test(word));
  const figures = [...(foldText(chart.alt).match(/\d+(?:[.,]\d+)?/g) || []), ...(source.match(/\b(?:19|20)\d\d\b/g) || [])];
  return words.some((word) => note.includes(word)) || figures.some((n) => new RegExp(`(^|[^\\d])${n.replace(/[.,]/, '[.,]')}([^\\d]|$)`).test(note));
};
const raw = async () => {
  const dir = path.join(__dirname, '..', 'lib', 'weekly', 'issues');
  const files = fs.readdirSync(dir).filter((name) => /^\d{2,3}\.js$/.test(name)).sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
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

test('the charts are drawn for the print and again, narrower, for phones, each with a note on what it counts', async () => {
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
        // What it counts (its base, unit or limit): its own note or its page's, never a bare figure. Audit P5-10: a
        // length alone passed any note; the note must say how the figure is measured (NOTE_BASIS) or tie itself to its
        // chart: a figure the chart shows, a name in its source or a year of its data (notePointsAtChart).
        assert.ok(chart.note && chart.note.trim().length > 20, `${issue.slug} ${lang} ${chart.type}: no note`);
        assert.ok(NOTE_BASIS[lang].test(chart.note) || notePointsAtChart(chart), `${issue.slug} ${lang} ${chart.type}: the note says nothing of what the chart counts: ${chart.note}`);
      }
    }
  }
});

test('the chart-note check refuses a note that says nothing of its chart', () => {
  const chart = { note: 'An interesting picture of how things have moved over the period.', alt: 'A 31%, B 22%', sourceLine: 'Gallup, State of the Global Workplace, 2025' };
  assert.equal(NOTE_BASIS.en.test(chart.note), false);
  assert.equal(notePointsAtChart(chart), false);
  assert.equal(notePointsAtChart({ ...chart, note: 'As Gallup reported it.' }), true);
  assert.equal(NOTE_BASIS.en.test('Share of respondents in each group.'), true);
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
  const treatise = (await import('../src/_data/treatise.js')).default;
  for (const [data, page] of [[weekly, 'management-review'], [magazine, 'from-the-floor'], [{ ...treatise, issues: treatise.volumes }, 'operational-treatise']]) {
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

test('Publications can be narrowed by month and kind: the newest of each series in each month, the book and the guide in every month', { skip: !hasSite }, async () => {
  const publications = (await import('../src/_data/publications.js')).default;
  const weekly = await load();
  assert.equal(publications.months[0].id, weekly.latest.month, 'the newest month first');
  for (const lang of LANGS) {
    const prefix = lang === 'en' ? '' : `${lang}/`;
    const page = built(`${prefix}publications.html`);
    // A button for each month once there are two (src/_includes/partials/issue-filter.njk).
    if (publications.months.length > 1) for (const month of publications.months) assert.ok(page.includes(`data-month="${month.id}">${escaped(month[lang])}`), `${lang}: the button of ${month.id}`);
    for (const kind of publications.kinds) assert.ok(page.includes(`data-block="${kind.id}">${escaped(kind[lang])}`), `${lang}: the kind ${kind.id}`);
    const dated = publications.review.length + publications.treatise.length + publications.floor.length + 1;
    assert.equal((page.match(/data-pub data-block="[a-z]+" data-month="\d{4}-\d{2}"/g) || []).length, dated, `${lang}: every dated publication has its month`);
    assert.ok(page.includes('<div data-pub data-block="books">'), `${lang}: the book and the guide in every month`);
    for (const issue of publications.review) assert.ok(page.includes(`/${prefix}magazine/${issue.slug}.html`), `${lang}: ${issue.slug}`);
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
    // Publications shows the newest issue of each month (by month, src/_data/publications.js); without the script
    // only the newest of all is shown, the others wait hidden for their month.
    for (const issue of magazine.issues) {
      const newestOfMonth = magazine.issues.filter((other) => other.month === issue.month).at(-1) === issue;
      assert.equal(publications.includes(`/${prefix}magazine/${issue.slug}.html`), newestOfMonth, `${lang}: ${issue.slug}`);
    }
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

test('the issues come in series of 40: the label names the series, the date the month it went online', async () => {
  const { common, SERIES_SIZE, seriesOf } = await import('../lib/weekly/common.js');
  const { default: weekly } = await import('../src/_data/weekly.js');
  const online = JSON.parse(fs.readFileSync('src/_data/online.json', 'utf8'));
  assert.equal(SERIES_SIZE, 40);
  assert.deepEqual([1, 40, 41, 80, 81].map(seriesOf), [1, 1, 2, 2, 3]);
  for (const issue of weekly.issues) {
    for (const lang of ['en', 'sq', 'de']) {
      assert.equal(issue[lang].edition, common.labels.series[seriesOf(issue.number) - 1][lang], `${issue.no} ${lang}`);
    }
    // Issues 1–80 went online in October 2026 (tests/publication-dates.test.cjs checks every publication).
    if (online[issue.slug]) assert.equal(issue.month, online[issue.slug].published.slice(0, 7), `${issue.no}: the month it went online`);
  }
  assert.equal(weekly.issues[0].sq.edition, 'Seria e parë');
  for (const file of ['src/_includes/print/weekly-page.njk', 'src/_includes/pages/weekly-issue.njk']) {
    assert.match(fs.readFileSync(file, 'utf8'), /I\.edition \}\} · \{\{ I\.date/, file);
  }
});

test('Insights shows its essays a month and twelve at a time, with "show more" and the count of each challenge', { skip: !hasSite }, () => {
  for (const lang of LANGS) {
    const prefix = lang === 'en' ? '' : `${lang}/`;
    const page = built(`${prefix}insights.html`);
    const rows = page.match(/data-filter-item [^>]*>/g) || [];
    assert.ok(rows.length > 12, `${lang}: more essays than a page`);
    for (const row of rows) assert.match(row, /data-month="\d{4}-\d{2}"/, `${lang}: every essay has its month`);
    const months = new Set(rows.map((row) => row.match(/data-month="([^"]+)"/)[1]));
    assert.equal((page.match(/data-filter-month="/g) || []).length, months.size > 1 ? months.size : 0, `${lang}: a button for each month, once there are two`);
    assert.ok(page.includes('data-page="12"') && page.includes('data-filter-more'), `${lang}: twelve at a time, with show more`);
    assert.ok(page.includes('data-chip-count'), `${lang}: the count of each challenge`);
  }
});

test('Reflections can be searched, by month once there are two, twelve at a time', { skip: !hasSite }, () => {
  for (const lang of LANGS) {
    const prefix = lang === 'en' ? '' : `${lang}/`;
    const page = built(`${prefix}reflections.html`);
    const rows = page.match(/data-filter-item [^>]*>/g) || [];
    assert.ok(rows.length > 0, `${lang}: reflections listed`);
    for (const row of rows) assert.match(row, /data-month="\d{4}-\d{2}"/, `${lang}: every reflection has its month`);
    const months = new Set(rows.map((row) => row.match(/data-month="([^"]+)"/)[1]));
    assert.equal((page.match(/data-filter-month="/g) || []).length, months.size > 1 ? months.size : 0, `${lang}: a button for each month, once there are two`);
    assert.ok(page.includes('data-filter-search') && page.includes('data-filter-more') && page.includes('/js/filter.js'), `${lang}: search and show more`);
  }
});

test('Field Notes shows a month and twelve notes at a time, and a link to one note still finds it', { skip: !hasSite }, () => {
  for (const lang of LANGS) {
    const prefix = lang === 'en' ? '' : `${lang}/`;
    const page = built(`${prefix}field-notes.html`);
    const cards = page.match(/<article class="note-card"[^>]*>/g) || [];
    assert.ok(cards.length > 12, `${lang}: more notes than a page`);
    for (const card of cards) assert.match(card, /data-month="\d{4}-\d{2}"/, `${lang}: every note has its month`);
    const months = new Set(cards.map((card) => card.match(/data-month="([^"]+)"/)[1]));
    assert.equal((page.match(/data-filter-month="/g) || []).length, months.size > 1 ? months.size : 0, `${lang}: a button for each month, once there are two`);
    assert.ok(page.includes('data-page="12"') && page.includes('data-filter-more'), `${lang}: twelve at a time, with show more`);
    if (page.includes('filter-chips')) assert.ok(page.includes('data-chip-count'), `${lang}: the count of each topic`);
  }
  // The script opens the month and the page of a note named in the address.
  assert.match(fs.readFileSync('src/js/filter.js', 'utf8'), /location\.hash[\s\S]*linked\.dataset\.month/);
});

// Audit P5-06: percentage bars on a scale short of 100 % (a bar of 30 % three quarters full on a scale of 40 %) had no
// axis. Such a chart now shows its scale, written as its figures are, in the print and on the phone.
test('a share chart on a scale short of 100 % shows its scale; a full scale or a count draws none', async () => {
  const { chartMarkup, NARROW } = await import('../lib/weekly/charts.js');
  const ends = (svgText) => [...svgText.matchAll(/class="wk-axis wk-scale"[^>]*>([^<]*)</g)].map((m) => m[1]);
  const bars = { type: 'hbars', label: 'x', max: 40, items: [{ k: 'Albania', v: 32, n: '32%' }, { k: 'Europe', v: 12, n: '12%' }] };
  assert.deepEqual(ends(chartMarkup(bars)), ['0%', '40%']);
  assert.deepEqual(ends(chartMarkup(bars, NARROW)), ['0%', '40%'], 'on the phone too');
  assert.deepEqual(ends(chartMarkup({ ...bars, items: bars.items.map((item) => ({ ...item, n: `${item.v} %` })) })), ['0 %', '40 %'], 'German figures, German scale');
  assert.deepEqual(ends(chartMarkup({ ...bars, max: 100 })), [], 'a full scale needs none');
  assert.deepEqual(ends(chartMarkup({ ...bars, max: 70, items: [{ k: 'Change', v: 12, n: '+12%' }] })), ['0%', '70%'], 'the sign of a change is not the scale\'s');
  assert.deepEqual(ends(chartMarkup({ ...bars, items: [{ k: 'Routes', v: 32, n: '32' }] })), [], 'a count needs none');
  assert.deepEqual(ends(chartMarkup({ type: 'pairs', label: 'x', from: '2010', to: '2012', max: 90, rows: [{ k: 'All', a: 83, an: '83%', b: 88, bn: '88%' }] })), ['0%', '90%']);
  assert.deepEqual(ends(chartMarkup({ type: 'dumbbell', label: 'x', from: '2022', to: '2025', min: 10, max: 40, rows: [{ k: 'Managers', a: 31, an: '31%', b: 22, bn: '22%' }] })), ['10%', '40%']);
  assert.deepEqual(ends(chartMarkup({ type: 'columns', label: 'x', max: 25, items: [{ k: '2009', v: 12, n: '12%' }, { k: '2025', v: 20, n: '20%' }] })), ['25%'], 'columns: the top of the scale');
  const weekly = await load();
  for (const issue of weekly.issues) {
    for (const lang of LANGS) {
      for (const chart of issue[lang].charts) {
        if (!['hbars', 'pairs', 'dumbbell'].includes(chart.type)) continue;
        const figures = JSON.stringify(chart.items || chart.rows || []);
        const short = (chart.max ?? 100) < 100 || (chart.min ?? 0) > 0;
        if (!short || !figures.includes('%')) continue;
        assert.match(chart.svg, /wk-scale/, `${issue.slug} ${lang} ${chart.type}: no scale`);
        assert.match(chart.svgNarrow, /wk-scale/, `${issue.slug} ${lang} ${chart.type}: no scale on the phone`);
      }
    }
  }
});
