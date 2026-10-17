// Corrections made after publication (corrections in an issue's or the special edition's data, drawn by
// partials/book-corrections.njk): on the built page, under the lede, dated, in each language; pages without one stay as
// they were. A recording edited after publication (corrections in src/_data/audio.json) says so under its player and in
// the podcast feed.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const hasSite = fs.existsSync('_site/magazine/management-review-nr-47.html');
// The corrections of one page, without the note on the second check of the whole Management Review (data-series).
const note = (path) => (fs.readFileSync(`_site/${path}`, 'utf8').match(/<div class="book-corrections"[^>]*>[\s\S]*?<\/div>/)?.[0] ?? '').replace(/<p data-series>[\s\S]*?<\/p>/g, '').replace(/<div class="book-corrections"[^>]*>\s*<\/div>/, '');
const plain = (html) => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
// One episode of a podcast page (its <li>), or the whole page when it lists no episodes (an issue's page).
const episodeOf = (html, slug) => {
  const at = html.indexOf(`id="episode-${slug}"`);
  return at < 0 ? html : html.slice(at, html.indexOf('</li>', at));
};

test('Issue 47 says, in each language, that its cover now credits Guest via Mintzberg, and since when', { skip: !hasSite }, () => {
  for (const [lang, start] of [['', 'Correction, 14 October 2026. The cover now credits the 48-second figure to Guest (1956) via Mintzberg (1975).'],
    ['sq/', 'Korrigjim, 14 tetor 2026. Kopertina tani ia atribuon shifrën e 48 sekondave Guest-it (1956) përmes Mintzberg-ut (1975).'],
    ['de/', 'Korrektur, 14. Oktober 2026. Der Titel nennt für die 48 Sekunden jetzt Guest (1956) über Mintzberg (1975).']]) {
    assert.ok(plain(note(`${lang}magazine/management-review-nr-47.html`)).startsWith(start), lang || 'en');
  }
});

test('the special edition says, in each language, that three figures now name their US samples', { skip: !hasSite }, () => {
  for (const [lang, start] of [['', 'Correction, 14 October 2026. Three figures now say they come from US samples'],
    ['sq/', 'Korrigjim, 14 tetor 2026. Tri shifra tani thonë se vijnë nga mostra në SHBA'],
    ['de/', 'Korrektur, 14. Oktober 2026. Drei Zahlen nennen jetzt ihre US-Stichproben']]) {
    assert.ok(plain(note(`${lang}magazine/management-review-2026-09.html`)).startsWith(start), lang || 'en');
  }
});

test('the note sits under the lede, and an issue without a correction has none', { skip: !hasSite }, () => {
  const html = fs.readFileSync('_site/magazine/management-review-nr-47.html', 'utf8');
  assert.ok(html.indexOf('class="lede"') < html.indexOf('class="book-corrections"'));
  assert.ok(html.indexOf('class="book-corrections"') < html.indexOf('class="book-facts"'));
  for (const path of ['magazine/management-review-nr-46.html', 'de/magazine/management-review-nr-05.html', 'sq/magazine/management-review-nr-78.html']) {
    assert.equal(note(path), '', path);
  }
});

test('the printed pages carry the correction too, on the sources page, in each language', { skip: !hasSite }, () => {
  // The issue's page shows its printed pages (print/weekly-page.njk, print/review-page.njk); the PDFs are made from them.
  for (const [path, label, page] of [['magazine/management-review-nr-47.html', 'Correction · 14 October 2026', 9], ['de/magazine/management-review-nr-47.html', 'Korrektur · 14. Oktober 2026', 9],
    ['sq/magazine/management-review-2026-09.html', 'Korrigjim · 14 tetor 2026', 25], ['magazine/management-review-2026-09.html', 'Correction · 14 October 2026', 25]]) {
    const html = fs.readFileSync(`_site/${path}`, 'utf8');
    const printed = html.slice(html.indexOf(`data-page="${page}"`), html.indexOf(`data-page="${page + 1}"`));
    assert.match(printed, /class="callout is-correction/, path);
    assert.ok(plain(printed).includes(label), `${path}: ${label}`);
  }
  assert.doesNotMatch(fs.readFileSync('_site/magazine/management-review-nr-46.html', 'utf8'), /is-correction/);
});

test('Issues 6, 72 and 74 say what was corrected on 13 October, only in the languages whose text changed', { skip: !hasSite }, () => {
  const cases = [
    ['magazine/management-review-nr-06.html', 'Correction, 13 October 2026. The study by three economists that tested the Peter Principle'],
    ['de/magazine/management-review-nr-06.html', 'Korrektur, 13. Oktober 2026. Die Studie dreier Ökonomen'],
    ['sq/magazine/management-review-nr-06.html', 'Korrigjim, 13 tetor 2026. Studimi i tre ekonomistëve'],
    ['magazine/management-review-nr-72.html', 'Correction, 13 October 2026. Lillian Eby and colleagues (2008) pooled samples from youth, academic and workplace mentoring'],
    ['sq/magazine/management-review-nr-72.html', 'Korrigjim, 13 tetor 2026. Lillian Eby dhe kolegët (2008)'],
    ['magazine/management-review-nr-74.html', 'Correction, 13 October 2026. The summary of the issue now says “what it is measured against”'],
  ];
  for (const [path, start] of cases) {
    assert.ok(plain(note(path)).startsWith(start), path);
    assert.match(fs.readFileSync(`_site/${path}`, 'utf8'), /class="callout is-correction/, `${path}: on the printed sources page too`);
  }
  // The German of 72 already said "Hochschul-", and only the English summary of 74 changed.
  for (const path of ['de/magazine/management-review-nr-72.html', 'de/magazine/management-review-nr-74.html', 'sq/magazine/management-review-nr-74.html']) {
    assert.equal(note(path), '', path);
    assert.doesNotMatch(fs.readFileSync(`_site/${path}`, 'utf8'), /is-correction/, path);
  }
});

test('Episode 1 says what was cut from it, under its player, on the podcast page and in the feed, in English and German', { skip: !hasSite }, () => {
  const audio = JSON.parse(fs.readFileSync('src/_data/audio.json', 'utf8'))['management-review-nr-01'];
  const under = (html) => plain(episodeOf(html, 'management-review-nr-01').match(/<p class="audio-player-correction">[\s\S]*?<\/p>/)?.[0] ?? '');
  for (const [lang, prefix, start] of [['en', '', 'Correction, 14 October 2026. Four passages the issue does not support were cut from this recording, 24 seconds in all'],
    ['de', 'de/', 'Korrektur, 14. Oktober 2026. Drei Stellen, die der Ausgabe widersprechen, wurden aus dieser Aufnahme geschnitten, zusammen 24 Sekunden']]) {
    for (const page of [`${prefix}magazine/management-review-nr-01.html`, `${prefix}podcast.html`]) {
      assert.ok(under(fs.readFileSync(`_site/${page}`, 'utf8')).startsWith(start), page);
    }
    const item = fs.readFileSync(`_site/${prefix}podcast.xml`, 'utf8').split('<item>').find((x) => x.includes('<guid isPermaLink="false">stivencatalyst-management-review-nr-01-'));
    assert.ok(item.match(/<description>([^<]*)<\/description>/)[1].includes(start), `${prefix}podcast.xml: description`);
    assert.ok(item.match(/<content:encoded>([^<]*)<\/content:encoded>/)[1].includes(`&lt;p&gt;${start}`), `${prefix}podcast.xml: content`);
    assert.equal(audio[lang].corrections.length, 1);
  }
  // The Albanian recording was not edited, and the other episodes were not either.
  assert.equal(audio.sq.corrections, undefined);
  for (const page of ['sq/magazine/management-review-nr-01.html', 'sq/podcast.html', 'magazine/management-review-nr-02.html']) {
    assert.doesNotMatch(fs.readFileSync(`_site/${page}`, 'utf8'), /audio-player-correction/, page);
  }
});

test('Episode 2 says, in German only, that one sentence was cut from it', { skip: !hasSite }, () => {
  const start = 'Korrektur, 14. Oktober 2026. Ein Satz wurde aus dieser Aufnahme geschnitten, 6 Sekunden';
  const note = (html) => plain(episodeOf(html, 'management-review-nr-02').match(/<p class="audio-player-correction">[\s\S]*?<\/p>/)?.[0] ?? '');
  for (const page of ['de/magazine/management-review-nr-02.html', 'de/podcast.html']) {
    assert.ok(note(fs.readFileSync(`_site/${page}`, 'utf8')).startsWith(start), page);
  }
  const item = fs.readFileSync('_site/de/podcast.xml', 'utf8').split('<item>').find((x) => x.includes('stivencatalyst-management-review-nr-02-de'));
  assert.ok(item.match(/<description>([^<]*)<\/description>/)[1].includes(start), 'de/podcast.xml');
  // The English recording says nothing the issue contradicts, and the Albanian one was not edited: no note.
  for (const page of ['magazine/management-review-nr-02.html', 'podcast.html', 'sq/magazine/management-review-nr-02.html', 'sq/podcast.html']) {
    assert.equal(note(fs.readFileSync(`_site/${page}`, 'utf8')), '', page);
  }
});

test('the second check of 12 October: the archive tells what it changed, and each issue it changed says so, on the web', { skip: !hasSite }, async () => {
  const { common } = await import('../lib/weekly/common.js');
  const changed = new Set(common.checked.issues);
  assert.equal(changed.size, 64);
  for (const [prefix, lang, start] of [['', 'en', 'Correction, 12 October 2026. Within four days of going online, every figure in issues 1 to 80 was checked a second time'],
    ['de/', 'de', 'Korrektur, 12. Oktober 2026. Innerhalb von vier Tagen nach dem Erscheinen wurde jede Zahl in den Heften 1 bis 80 ein zweites Mal geprüft'],
    ['sq/', 'sq', 'Korrigjim, 12 tetor 2026. Brenda katër ditësh nga dalja online, çdo shifër në numrat 1 deri në 80 u kontrollua për herë të dytë']]) {
    const archive = fs.readFileSync(`_site/${prefix}magazine/management-review.html`, 'utf8');
    assert.ok(plain(archive.match(/<div class="book-corrections" id="checked">[\s\S]*?<\/div>/)?.[0] ?? '').startsWith(start), `${prefix || 'en'}: the archive`);
    const link = `href="/${prefix}magazine/management-review.html#checked"`;
    assert.ok(fs.readFileSync(`_site/${prefix}how-this-is-made.html`, 'utf8').includes(link), `${prefix || 'en'}: How this is made links to it`);
    for (let n = 1; n <= 80; n += 1) {
      const html = fs.readFileSync(`_site/${prefix}magazine/management-review-nr-${String(n).padStart(2, '0')}.html`, 'utf8');
      const series = html.match(/<p data-series>[\s\S]*?<\/p>/g) || [];
      assert.equal(series.length, changed.has(n) ? 1 : 0, `${prefix || 'en'} No. ${n}`);
      if (changed.has(n)) {
        assert.ok(series[0].includes(link), `${prefix || 'en'} No. ${n}: links to the archive`);
        // Not on the printed pages: the PDF printed on 12 October is already the checked text.
        assert.equal(html.split(common.checked.issue[lang].slice(0, 40)).length - 1, 1, `${prefix || 'en'} No. ${n}: once, on the web`);
      }
    }
  }
});
