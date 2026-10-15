// "How this is made" (src/how-this-is-made.njk) and the dates of the publications (src/_data/online.json): the page says
// only what the site can show, and stays true when the site changes. Its quote is the sentence that closes the essay
// it links; its list of corrections is the publications that carry a correction note; the publications give the day
// they went online, to readers and to search engines. Built pages (_site).
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const hasSite = fs.existsSync('_site/how-this-is-made.html');
const read = (path) => fs.readFileSync(`_site/${path}`, 'utf8');
const plain = (html) => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const online = JSON.parse(fs.readFileSync('src/_data/online.json', 'utf8'));
const LANGS = [['en', ''], ['de', 'de/'], ['sq', 'sq/']];

test('the page exists in each language, and every page links it from the footer in its own language', { skip: !hasSite }, () => {
  for (const [, prefix] of LANGS) {
    assert.ok(fs.existsSync(`_site/${prefix}how-this-is-made.html`), prefix || 'en');
    for (const page of ['index.html', 'tools.html', 'magazine/management-review-nr-47.html']) {
      assert.match(read(`${prefix}${page}`), new RegExp(`<footer[\\s\\S]*href="/${prefix}how-this-is-made.html"`), `${prefix}${page}`);
    }
  }
});

test('its quote is the sentence that closes the essay it names, in each language', { skip: !hasSite }, () => {
  for (const [lang, prefix] of LANGS) {
    const essay = fs.readFileSync(`src/content/${lang === 'en' ? '' : `${lang}/`}insights/2026-10-13-the-report-a-machine-wrote.md`, 'utf8');
    const closing = [...essay.matchAll(/\*\*([^*]+)\*\*/g)].at(-1)[1];
    assert.ok(plain(read(`${prefix}how-this-is-made.html`)).includes(closing), `${lang}: ${closing}`);
    assert.match(read(`${prefix}how-this-is-made.html`), new RegExp(`href="/${prefix}insights/the-report-a-machine-wrote/"`));
  }
});

test('its list of corrections is exactly the publications that carry a correction note', { skip: !hasSite }, () => {
  // A publication corrected on its own: a correction other than the note on the second check of the whole series.
  const ownCorrection = (html) => /<p>/.test((html.match(/<div class="book-corrections"[^>]*>[\s\S]*?<\/div>/)?.[0] ?? '').replace(/<p data-series>[\s\S]*?<\/p>/g, ''));
  const corrected = fs.readdirSync('_site/magazine').filter((name) => name.endsWith('.html') && ownCorrection(read(`magazine/${name}`))).sort();
  const page = read('how-this-is-made.html');
  const section = page.slice(page.search(/<h2[^>]*>Corrections<\/h2>/), page.search(/<h2[^>]*>Your data<\/h2>/));
  const listed = [...section.matchAll(/href="\/magazine\/([^"]+\.html)"/g)].map((m) => m[1]).sort();
  assert.deepEqual(listed, corrected);
  // The essays corrected after publication, in every language: each listed, and each shows its note.
  for (const [, prefix] of LANGS) {
    const dir = `_site/${prefix}insights`;
    const noted = fs.readdirSync(dir).filter((slug) => fs.existsSync(`${dir}/${slug}/index.html`) && read(`${prefix}insights/${slug}/index.html`).includes('class="book-corrections"')).sort();
    const html = read(`${prefix}how-this-is-made.html`);
    const listed = [...new Set([...html.matchAll(new RegExp(`href="/${prefix}insights/([^/"]+)/"`, 'g'))].map((m) => m[1]))].filter((slug) => slug !== 'the-report-a-machine-wrote').sort();
    assert.deepEqual(listed, noted, `${prefix || 'en'}: the corrected essays`);
    assert.ok(noted.length >= 3, `${prefix || 'en'}: ${noted}`);
  }
  // And the podcast episodes whose recording was cut (corrections in audio.json), each linked, in every language, to a
  // podcast page where its note is shown.
  const audio = JSON.parse(fs.readFileSync('src/_data/audio.json', 'utf8'));
  const cut = Object.keys(audio).filter((slug) => Object.values(audio[slug]).some((track) => track.corrections?.length)).sort();
  for (const [, prefix] of LANGS) {
    const links = [...read(`${prefix}how-this-is-made.html`).matchAll(/href="\/((?:de\/|sq\/)?podcast\.html)#episode-([^"]+)"/g)];
    assert.deepEqual(links.map((m) => m[2]).sort(), cut, prefix || 'en');
    for (const [, page, slug] of links) {
      const target = read(page);
      const episode = target.slice(target.indexOf(`id="episode-${slug}"`), target.indexOf('</li>', target.indexOf(`id="episode-${slug}"`)));
      assert.match(episode, /class="audio-player-correction"/, `${prefix || 'en'}: ${page}#episode-${slug} shows no note`);
    }
  }
});

test('the publications say when they went online, and tell search engines the same', { skip: !hasSite }, () => {
  for (const [slug, label, prefix] of [['management-review-nr-47', 'Online since', ''], ['management-review-nr-01', 'Online seit', 'de/'], ['management-review-2026-09', 'Online që më', 'sq/'], ['nga-terreni-02', 'Online since', ''], ['operational-treatise-vol-01', 'Online since', '']]) {
    const html = read(`${prefix}magazine/${slug}.html`);
    assert.match(html, new RegExp(`<dt>${label}</dt><dd>[^<]+</dd>`), `${prefix}${slug}`);
    assert.equal(html.match(/"datePublished":"([^"]+)"/)[1], online[slug].published, slug);
    assert.equal(html.match(/"dateModified":"([^"]+)"/)[1], online[slug].modified, slug);
  }
  // Every issue, From the Floor and the treatise has its dates; a date is a real day, the change never before it.
  for (const [slug, { published, modified }] of Object.entries(online)) {
    assert.match(published, /^2026-\d\d-\d\d$/, slug);
    assert.ok(modified >= published, slug);
  }
  assert.equal(Object.keys(online).filter((slug) => slug.startsWith('management-review-nr-')).length, 80);
  for (const [, prefix] of LANGS) assert.doesNotMatch(read(`${prefix}magazine/management-review.html`), /every month brings|çdo muaj vjen|jeden Monat kommt/);
});

test('the diagram of "The system is faster than you" gives no number it cannot source', () => {
  const diagrams = fs.readFileSync('lib/diagrams.js', 'utf8');
  const split = diagrams.slice(diagrams.indexOf('id: "decision-split"'), diagrams.indexOf('id: "dashboard-lag"'));
  assert.doesNotMatch(split, /\b98\b|hundred|hundert|njëqind/);
});

test('the About page says no more than the essays: years leading teams, the resellers, the systems', { skip: !hasSite }, () => {
  const essays = fs.readdirSync('src/content/insights').map((file) => fs.readFileSync(`src/content/insights/${file}`, 'utf8')).join('\n');
  for (const [prefix, linked] of [['', 'linked to revenue growth of around 30–40%'], ['de/', 'mit rund 30–40 % Umsatzwachstum verbunden'], ['sq/', 'i lidhur me rritjen e xhiros me rreth 30–40%']]) {
    const about = plain(read(`${prefix}about.html`));
    // More than ten years in operations, about eight of them leading teams (2015–2021 in Albania, then from January 2025).
    assert.doesNotMatch(about, /led operations and teams for more than ten years|seit mehr als zehn Jahren Betriebe und Teams|drejton operacione dhe ekipe prej më shumë se dhjetë/, prefix || 'en');
    // The resellers' channel is linked to the growth, as the essay "61 resellers" writes it: "a link, not as proof".
    assert.ok(about.includes(linked), `${prefix || 'en'}: ${linked}`);
    // A system the essays are unsure of is not listed: "Excel or Power BI, I do not know for sure".
    assert.ok(!about.includes('Power BI') || !/Power BI, I do not know for sure/.test(essays), `${prefix || 'en'}: Power BI`);
  }
  // The figures of the About page are the essays' own.
  for (const figure of [/four Shift Leaders and eight dispatchers/, /around 250 drivers/, /80\+ vehicles and 100\+ drivers/, /61 active resellers/, /Since 1 January 2026 I have worked part-time as a Last Mile Dispatcher/]) {
    assert.match(essays, figure);
  }
});
