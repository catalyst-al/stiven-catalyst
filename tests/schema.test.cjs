// Structured data for the publications (audit SEO-07): the book and the guide as Book, the podcast as PodcastSeries,
// an issue as part of its periodical and a volume as part of its series.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const hasSite = fs.existsSync('_site/podcast.html');
const graph = (file) => JSON.parse(fs.readFileSync(`_site/${file}`, 'utf8').match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
const node = (file, type) => graph(file).find((item) => [].concat(item['@type']).includes(type));

test('the book is a Book, its translations name the Albanian original, the guide is a Book too', { skip: !hasSite }, () => {
  const en = node('books/mall-per-durresin.html', 'Book');
  assert.ok(en, 'a Book');
  assert.equal(en.inLanguage, 'en');
  assert.equal(en.translationOfWork.inLanguage, 'sq');
  assert.match(en.translationOfWork.url, /\/sq\/books\/mall-per-durresin\.html$/);
  assert.equal(node('sq/books/mall-per-durresin.html', 'Book').translationOfWork, undefined, 'the original is no translation');
  assert.ok(node('guides/tools-guide.html', 'Book'));
});

test('the podcast is a PodcastSeries with its own feed in each language', { skip: !hasSite }, () => {
  const en = node('podcast.html', 'PodcastSeries');
  assert.ok(en);
  assert.match(en.webFeed, /\/podcast\.xml$/);
  const de = node('de/podcast.html', 'PodcastSeries');
  assert.ok(de);
  assert.match(de.webFeed, /\/(de\/)?podcast\.xml$/);
});

test('an issue belongs to its periodical, a volume to its series', { skip: !hasSite }, () => {
  const mr = node('magazine/management-review-nr-01.html', 'Article');
  assert.equal(mr.isPartOf['@type'], 'PublicationIssue');
  assert.equal(mr.isPartOf.issueNumber, '1');
  assert.equal(mr.isPartOf.isPartOf['@type'], 'Periodical');
  assert.equal(mr.isPartOf.isPartOf.name, 'Management Review');
  const floor = node('de/magazine/nga-terreni-01.html', 'Article');
  assert.equal(floor.isPartOf.isPartOf['@type'], 'Periodical');
  assert.match(floor.isPartOf.isPartOf['@id'], /#from-the-floor$/);
  const volume = node('magazine/operational-treatise-vol-06.html', 'Article');
  assert.equal(volume.isPartOf['@type'], 'PublicationVolume');
  assert.equal(volume.isPartOf.volumeNumber, '6');
  assert.equal(volume.isPartOf.isPartOf['@type'], 'CreativeWorkSeries');
  // An essay is part of no series.
  const essay = fs.readdirSync('_site/insights').find((name) => fs.existsSync(`_site/insights/${name}/index.html`));
  assert.equal(node(`insights/${essay}/index.html`, 'Article').isPartOf, undefined);
});
