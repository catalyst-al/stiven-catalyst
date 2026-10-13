// The podcast of the Management Review (src/_data/podcast.js, src/podcast-feed.njk, pages/podcast.njk,
// scripts/podcast-art.mjs): one feed per language with episodes, with the tags Apple Podcasts and Spotify need, the
// artwork at the sizes they ask for, and the page that explains how to follow it, in the three languages.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const LANGS = ['en', 'sq', 'de'];
const load = async () => (await import('../src/_data/podcast.js')).default;
const audio = JSON.parse(fs.readFileSync('src/_data/audio.json', 'utf8'));

// The width and height of a JPEG, from its first frame header.
const jpegSize = (file) => {
  const b = fs.readFileSync(file);
  let i = 2;
  while (i < b.length) {
    const marker = b[i + 1];
    const length = b.readUInt16BE(i + 2);
    if (marker >= 0xc0 && marker <= 0xc3) return { height: b.readUInt16BE(i + 5), width: b.readUInt16BE(i + 7) };
    i += 2 + length;
  }
  throw new Error(`${file}: no frame header`);
};

test('the podcast:guid follows the Podcasting 2.0 rule (the example of the standard)', async () => {
  const { uuid5 } = await import('../lib/uuid5.js');
  assert.equal(uuid5('mp3s.nashownotes.com/pc20rss.xml'), '917393e3-1b1e-5cef-ace4-edaa54e1f810');
});

test('every Management Review recording is an episode of the feed of its language, with its date', async () => {
  const podcast = await load();
  const weekly = (await import('../src/_data/weekly.js')).default;
  for (const issue of weekly.issues) {
    for (const lang of Object.keys(audio[issue.slug] || {})) {
      assert.match(audio[issue.slug][lang].published || '', /^\d{4}-\d{2}-\d{2}$/, `${issue.slug} ${lang}: published`);
      const feed = podcast.feeds.find((f) => f.lang === lang);
      assert.ok(feed && feed.episodes.some((e) => e.slug === issue.slug), `${issue.slug} ${lang} is not in a feed`);
    }
  }
  for (const feed of podcast.feeds) {
    assert.equal(feed.path, feed.lang === 'en' ? '/podcast.xml' : `/${feed.lang}/podcast.xml`);
    assert.ok(feed.episodes.length, `${feed.lang}: a feed without episodes`);
    const numbers = feed.episodes.map((e) => e.number);
    assert.deepEqual(numbers, [...numbers].sort((a, b) => b - a), `${feed.lang}: the newest first`);
    assert.equal(new Set(feed.episodes.map((e) => e.guid)).size, feed.episodes.length, 'episode guids are unique');
    for (const e of feed.episodes) assert.ok(!Number.isNaN(Date.parse(e.pubDate)), `${e.slug}: pubDate`);
  }
});

test('the artwork is square, at the sizes the directories ask for, with a small copy for the page', async () => {
  const podcast = await load();
  const cover = jpegSize('src/media/podcast/cover.jpg');
  assert.deepEqual(cover, { width: 3000, height: 3000 }, 'Apple Podcasts: 1400 to 3000 px, square');
  assert.ok(fs.statSync('src/media/podcast/cover.jpg').size < 512 * 1024, 'the cover stays under 512 KB');
  assert.ok(fs.existsSync('src/media/podcast/cover-600.webp'));
  for (const feed of podcast.feeds) {
    for (const e of feed.episodes) {
      const file = path.join('src', e.image);
      assert.ok(fs.existsSync(file), `${file}: run node scripts/podcast-art.mjs`);
      const size = jpegSize(file);
      assert.equal(size.width, size.height, `${file} is square`);
      assert.ok(size.width >= 1400, `${file} is at least 1400 px`);
      assert.ok(fs.existsSync(file.replace(/\.jpg$/, '-600.webp')), `${file}: its small copy`);
    }
  }
});

test('the page of each language has its texts, and one in a language without episodes says they are in English', async () => {
  const podcast = await load();
  for (const lang of LANGS) {
    const P = podcast[lang];
    assert.ok(P.feed, `${lang}: a feed to offer`);
    for (const key of ['heading', 'lede', 'followTitle', 'followText', 'otherTitle', 'address', 'copy', 'copied', 'listTitle', 'howText', 'follow']) {
      assert.ok(P[key] && P[key].trim(), `${lang}: ${key}`);
    }
    assert.equal(P.steps.length, 3);
    assert.ok(P.seo.length <= 160, `${lang}: the search description is ${P.seo.length} characters`);
    if (P.other) assert.ok(P.inEnglish, `${lang}: says the episodes are in English`);
    assert.equal(P.list.length, P.feed.episodes.length);
    for (const app of P.subscribe) assert.ok(app.href.includes(P.feed.url.replace(/^https?:\/\//, '')) || app.href.includes(encodeURIComponent(P.feed.url)), `${lang}: ${app.name}`);
    const page = fs.readFileSync(lang === 'en' ? 'src/podcast.njk' : `src/${lang}/podcast.njk`, 'utf8');
    assert.match(page, /pages\/podcast\.njk/);
  }
});

const hasSite = fs.existsSync('_site/podcast.xml');
test('the built feed is well-formed RSS with the tags Apple Podcasts and Spotify read', { skip: !hasSite }, async () => {
  const { JSDOM } = require('jsdom');
  const podcast = await load();
  for (const feed of podcast.feeds) {
    const xml = fs.readFileSync(path.join('_site', feed.path), 'utf8');
    assert.ok(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>'), `${feed.path}: the declaration comes first`);
    const doc = new JSDOM(xml, { contentType: 'text/xml' }).window.document;
    assert.equal(doc.querySelector('parsererror'), null, `${feed.path} is not well-formed`);
    const channel = doc.querySelector('rss > channel');
    const tag = (el, name) => el.getElementsByTagName(name)[0];
    for (const name of ['title', 'link', 'description', 'language', 'itunes:author', 'itunes:explicit', 'podcast:guid']) {
      assert.ok(tag(channel, name)?.textContent.trim(), `${feed.path}: ${name}`);
    }
    assert.equal(tag(channel, 'itunes:image').getAttribute('href'), 'https://stivencatalyst.com/media/podcast/cover.jpg');
    assert.equal(tag(channel, 'itunes:category').getAttribute('text'), 'Business');
    assert.ok(tag(tag(channel, 'itunes:owner'), 'itunes:email').textContent.includes('@'));
    const items = [...channel.getElementsByTagName('item')];
    assert.equal(items.length, feed.episodes.length);
    items.forEach((item, i) => {
      const e = feed.episodes[i];
      const enclosure = tag(item, 'enclosure');
      assert.equal(enclosure.getAttribute('url'), `https://stivencatalyst.com${e.src}`);
      assert.equal(Number(enclosure.getAttribute('length')), fs.statSync(path.join('src', e.src)).size, `${e.slug}: length is the file's size`);
      assert.equal(enclosure.getAttribute('type'), 'audio/mpeg');
      assert.equal(tag(item, 'guid').textContent, e.guid);
      assert.equal(tag(item, 'itunes:duration').textContent, String(e.seconds));
      if (e.ai) assert.match(tag(item, 'description').textContent, /NotebookLM/, `${e.slug}: says it was made with AI`);
    });
  }
  const page = fs.readFileSync('_site/podcast.html', 'utf8');
  assert.match(page, /<link rel="alternate" type="application\/rss\+xml"[^>]*href="\/podcast\.xml"/);
  assert.match(page, /data-podcast-copy/);
  assert.match(fs.readFileSync('_site/magazine/management-review-nr-01.html', 'utf8'), /href="\/podcast\.html">Follow the podcast/);
  for (const lang of ['sq', 'de']) {
    assert.match(fs.readFileSync(`_site/${lang}/index.html`, 'utf8'), new RegExp(`href="/${lang}/podcast\\.html">Podcast`), `${lang}: the footer opens the podcast page of the language`);
  }
});
