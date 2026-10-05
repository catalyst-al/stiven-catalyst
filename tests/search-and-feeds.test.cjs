// Search (pages/search.njk, js/search.js, lib/search-index.js) and the feeds in each language (partials/feed.njk):
// the index holds every essay, reflection, note, tool and main page with addresses that exist, the search finds
// words without case or accents and marks them, and each language has its own Atom feed, linked from its pages.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const partial = fs.readFileSync('src/_includes/pages/search.njk', 'utf8');
const script = fs.readFileSync('src/js/search.js', 'utf8');
const hasSite = fs.existsSync('_site/search-index.json');
const built = (file) => fs.readFileSync(path.join('_site', file), 'utf8');
const exists = (url) => {
  const file = path.join('_site', decodeURI(url.split('#')[0]));
  return fs.existsSync(file) && fs.statSync(file).isFile() ? true : fs.existsSync(path.join(file, 'index.html'));
};
const count = (dir) => fs.readdirSync(dir).filter((file) => file.endsWith('.md')).length;

test('every text of the Search page has a German and an Albanian translation', () => {
  const found = new Set();
  for (const match of partial.matchAll(/'((?:[^'\\]|\\.)*)' \| t\(lang\)/g)) found.add(match[1]);
  for (const match of partial.matchAll(/"((?:[^"\\]|\\.)*)" \| t\(lang\)/g)) found.add(match[1]);
  assert.ok(found.size >= 14, `found ${found.size} texts`);
  for (const lang of ['de', 'sq']) {
    const ui = JSON.parse(fs.readFileSync(`src/_data/${lang}/ui.json`, 'utf8'));
    for (const text of found) assert.ok(ui[text], `${lang}: ${text}`);
  }
});

test('plain text keeps the words of Markdown and drops its marks', async () => {
  const { plainText } = await import('../lib/search-index.js');
  assert.equal(plainText('## A title\n\n**Bold** and _soft_ words, a [link](https://x.test) and <em>tags</em>.\n\n- one\n> quoted'), 'A title Bold and soft words, a link and tags . one quoted');
});

test('each language has an index of its essays, reflections, notes, tools and pages, at addresses that exist', { skip: !hasSite }, () => {
  for (const [lang, prefix, content] of [['en', '', 'src/content'], ['de', 'de/', 'src/content/de'], ['sq', 'sq/', 'src/content/sq']]) {
    const index = JSON.parse(built(`${prefix}search-index.json`));
    const kinds = {};
    for (const item of index) {
      kinds[item.k] = (kinds[item.k] || 0) + 1;
      assert.ok(item.t && item.u, `${lang}: ${JSON.stringify(item).slice(0, 80)}`);
      assert.ok(exists(item.u), `${lang}: ${item.u} exists`);
      if (lang !== 'en') assert.ok(item.u.startsWith(`/${lang}/`), `${lang}: ${item.u} stays in the language`);
    }
    assert.equal(kinds.essay, count(`${content}/insights`), `${lang}: essays`);
    assert.equal(kinds.reflection, count(`${content}/reflections`), `${lang}: reflections`);
    assert.equal(kinds.note, count(`${content}/notes`), `${lang}: notes`);
    assert.ok(kinds.tool >= 10 && kinds.page === 5, `${lang}: tools and pages`);
    assert.ok(index.filter((item) => item.k === 'essay').every((item) => item.b.length > 1500), `${lang}: essay text`);
  }
});

test('the Search page and the header link to it in every language; the page stays out of search engines', { skip: !hasSite }, () => {
  for (const [page, home, search] of [['search.html', 'index.html', '/search.html'], ['de/search.html', 'de/index.html', '/de/search.html'], ['sq/search.html', 'sq/index.html', '/sq/search.html']]) {
    const html = built(page);
    assert.match(html, /<meta name="robots" content="noindex">/, page);
    assert.match(html, /data-search /, page);
    assert.ok(built(home).includes(`href="${search}" aria-label=`), `${home}: header link`);
  }
});

// The page as the partial renders it, with a small index.
const page = (query = '') => {
  const index = [
    { k: 'essay', t: 'Führung ohne Titel', s: 'Über Führung im Betrieb.', b: 'Ein langer Text über die Schichtübergabe und Führung.', u: '/de/insights/a/' },
    { k: 'note', t: 'Një ekip që ka frikë nuk ka më pak gabime.', s: '', b: '', u: '/sq/field-notes.html#note-14-fear' },
    { k: 'tool', t: 'Pareto 80/20', s: 'Which few causes make most of your delays?', b: '', u: '/tools/pareto/' },
  ];
  const dom = new JSDOM(`<html><body><section data-search data-index="/search-index.json" data-kinds='{"essay":"Essay","note":"Field note","tool":"Tool"}' data-count-label="{n} results" data-one-label="1 result" data-none-label="Nothing found.">
    <form><input type="search" name="q" data-search-input></form><p data-search-count></p><ol data-search-results></ol></section></body></html>`, { url: `https://example.test/search.html${query}`, runScripts: 'outside-only' });
  const w = dom.window;
  let fetched = 0;
  w.fetch = async () => { fetched += 1; return { json: async () => index }; };
  w.eval(script);
  const search = async (text) => {
    const input = w.document.querySelector('input');
    input.value = text;
    input.dispatchEvent(new w.Event('input'));
    await new Promise((resolve) => setTimeout(resolve, 200));
  };
  const results = () => [...w.document.querySelectorAll('[data-search-results] li')];
  return { w, search, results, count: () => w.document.querySelector('[data-search-count]').textContent, fetched: () => fetched };
};

test('the search finds words without case or accents, marks them and keeps the question in the address', async () => {
  const { w, search, results, count, fetched } = page();
  await search('fuhrung');
  assert.equal(count(), '1 result');
  const first = results()[0];
  assert.equal(first.querySelector('a').getAttribute('href'), '/de/insights/a/');
  assert.equal(first.querySelector('.search-kind').textContent, 'Essay');
  assert.equal(first.querySelector('strong mark').textContent, 'Führung');
  assert.equal(new w.URL(w.location.href).searchParams.get('q'), 'fuhrung');

  await search('FRIKE gabime');
  assert.equal(count(), '1 result');
  assert.deepEqual([...results()[0].querySelectorAll('mark')].map((mark) => mark.textContent), ['frikë', 'gabime']);

  await search('pareto delays');
  assert.equal(results()[0].querySelector('p mark').textContent, 'delays');

  await search('nothing-like-this');
  assert.equal(count(), 'Nothing found.');
  assert.equal(results().length, 0);
  assert.equal(fetched(), 1, 'the index is read once');
});

test('a search in the address is run when the page opens', async () => {
  const { results } = page('?q=pareto');
  await new Promise((resolve) => setTimeout(resolve, 50));
  assert.equal(results().length, 1);
});

test('each language has its own feed of its essays and reflections, linked from its pages', { skip: !hasSite }, () => {
  for (const [feed, home, content, lang] of [['feed.xml', 'index.html', 'src/content', 'en'], ['de/feed.xml', 'de/index.html', 'src/content/de', 'de'], ['sq/feed.xml', 'sq/index.html', 'src/content/sq', 'sq']]) {
    const xml = built(feed);
    assert.match(xml, new RegExp(`xml:lang="${lang}"`), feed);
    assert.equal((xml.match(/<entry>/g) || []).length, Math.min(20, count(`${content}/insights`) + count(`${content}/reflections`)), feed);
    const prefix = lang === 'en' ? '' : `/${lang}`;
    for (const href of xml.matchAll(/<entry>[\s\S]*?<link href="https:\/\/stivencatalyst\.com([^"]+)"/g)) {
      assert.ok(href[1].startsWith(`${prefix}/`), `${feed}: ${href[1]}`);
      assert.ok(exists(href[1]), `${feed}: ${href[1]} exists`);
    }
    const html = built(home);
    assert.ok(html.includes(`type="application/atom+xml" title="Stiven Catalyst" href="/${feed}"`), `${home}: feed link`);
    assert.ok(html.includes(`<a href="/${feed}">RSS</a>`), `${home}: footer link`);
  }
});
