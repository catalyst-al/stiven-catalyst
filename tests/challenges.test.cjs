// The practical layer of every essay and the essays by challenge: three moves before the text ("firstMove"),
// a checklist at the end, the challenges an essay answers (src/_data/challenges.json, "problems" on the English
// essay), the Insights filter that takes several topics per row, and the Challenges page in three languages.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const yaml = require('js-yaml');
const { JSDOM } = require('jsdom');

const DIRS = { en: 'src/content/insights', de: 'src/content/de/insights', sq: 'src/content/sq/insights' };
const challenges = JSON.parse(fs.readFileSync('src/_data/challenges.json', 'utf8'));
const ids = new Set(challenges.map((c) => c.id));
const essays = (dir) => fs.readdirSync(dir).filter((f) => f.endsWith('.md')).map((file) => {
  const text = fs.readFileSync(path.join(dir, file), 'utf8');
  return { file, slug: file.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, ''), data: yaml.load(text.match(/^---\n([\s\S]*?)\n---/)[1]) };
});
const hasSite = fs.existsSync('_site/challenges.html');
const built = (file) => fs.readFileSync(path.join('_site', file), 'utf8');

test('every challenge has an id, a name and a line in the three languages', () => {
  assert.ok(challenges.length >= 8, `${challenges.length} challenges`);
  for (const c of challenges) {
    assert.match(c.id, /^[a-z-]+$/, c.id);
    for (const lang of ['en', 'de', 'sq']) {
      assert.ok(c.name[lang] && c.line[lang], `${c.id}: ${lang}`);
    }
    assert.ok(Array.isArray(c.tools), `${c.id}: tools`);
  }
  assert.equal(ids.size, challenges.length, 'ids are unique');
});

test('every essay, in every language, opens with three moves and ends with a checklist', () => {
  for (const [lang, dir] of Object.entries(DIRS)) {
    for (const { file, data } of essays(dir)) {
      assert.ok(Array.isArray(data.firstMove) && data.firstMove.length === 3, `${lang}/${file}: three moves`);
      for (const move of data.firstMove) assert.ok(typeof move === 'string' && move.trim().length > 20 && !/^\s*-/.test(move), `${lang}/${file}: move "${move}"`);
      assert.ok(data.checklist && data.checklist.title, `${lang}/${file}: checklist title`);
      assert.ok(Array.isArray(data.checklist.items) && data.checklist.items.length >= 3, `${lang}/${file}: checklist items`);
      for (const item of data.checklist.items) {
        const label = typeof item === 'string' ? item : item.label;
        assert.ok(label && label.trim().length > 3, `${lang}/${file}: item ${JSON.stringify(item)}`);
      }
    }
  }
});

test('every English essay names the challenges it answers; each challenge has at least two essays; translations follow the English file', () => {
  const english = essays(DIRS.en);
  const counts = {};
  for (const { file, data } of english) {
    assert.ok(Array.isArray(data.problems) && data.problems.length >= 1, `${file}: problems`);
    for (const id of data.problems) {
      assert.ok(ids.has(id), `${file}: unknown challenge "${id}"`);
      counts[id] = (counts[id] || 0) + 1;
    }
  }
  for (const c of challenges) assert.ok((counts[c.id] || 0) >= 2, `${c.id}: ${counts[c.id] || 0} essays`);
  const slugs = new Set(english.map((e) => e.slug));
  for (const lang of ['de', 'sq']) {
    for (const { file, slug, data } of essays(DIRS[lang])) {
      assert.ok(slugs.has(data.original || slug), `${lang}/${file}: has an English original`);
      assert.equal(data.problems, undefined, `${lang}/${file}: challenges live on the English essay only`);
    }
  }
});

test('the texts of the moves box, the Insights rows and the Challenges page have a German and an Albanian translation', () => {
  const found = new Set();
  for (const file of ['src/_includes/layouts/article.njk', 'src/_includes/pages/insights.njk', 'src/_includes/pages/challenges.njk', 'src/_includes/pages/writing.njk']) {
    const source = fs.readFileSync(file, 'utf8');
    for (const match of source.matchAll(/'((?:[^'\\]|\\.)*)' \| t\(lang\)/g)) found.add(match[1]);
    for (const match of source.matchAll(/"((?:[^"\\]|\\.)*)" \| t\(lang\)/g)) found.add(match[1]);
  }
  assert.ok(found.has('Tomorrow on shift') && found.has('Challenges'), 'the new texts are read');
  for (const lang of ['de', 'sq']) {
    const ui = JSON.parse(fs.readFileSync(`src/_data/${lang}/ui.json`, 'utf8'));
    for (const text of found) assert.ok(ui[text], `${lang}: ${text}`);
  }
});

// The Insights list as the template renders it: rows with one or several topics, chips by id.
const filtered = (query) => {
  const rows = [['e1', 'handover'], ['e2', 'handover|mistake'], ['e3', 'mistake'], ['e4', 'peak']]
    .map(([id, topics]) => `<a class="list-row" data-filter-item data-topic="${topics}" data-search="${id}" data-read-row="${id}"></a>`).join('');
  const chips = ['', 'handover', 'mistake', 'peak'].map((id) => `<button type="button" class="chip" data-topic="${id}">${id || 'All'}</button>`).join('');
  const dom = new JSDOM(`<body><section data-filter-list><div data-filter-controls data-count-label="{a} of {b} essays"><input type="search" data-filter-search><div>${chips}</div><p data-filter-count></p></div>${rows}<p data-filter-empty hidden></p></section></body>`,
    { url: `https://example.test/insights.html${query}`, runScripts: 'outside-only' });
  dom.window.eval(fs.readFileSync('src/js/filter.js', 'utf8'));
  return { shown: [...dom.window.document.querySelectorAll('[data-filter-item]')].filter((row) => !row.hidden).map((row) => row.dataset.readRow), dom };
};

test('a row that answers several challenges is shown for each of them; an unknown topic in the address shows everything', () => {
  assert.deepEqual(filtered('?topic=handover').shown, ['e1', 'e2']);
  assert.deepEqual(filtered('?topic=mistake').shown, ['e2', 'e3']);
  assert.deepEqual(filtered('?topic=Operations').shown, ['e1', 'e2', 'e3', 'e4']);
  const { dom } = filtered('?topic=peak');
  assert.equal(dom.window.document.querySelector('[data-filter-count]').textContent, '1 of 4 essays');
  assert.equal(dom.window.location.search, '?topic=peak');
});

test('the built essay opens with the three moves, the way to its checklist, its first tool and its challenges', { skip: !hasSite }, () => {
  for (const [file, tool, challenge] of [
    ['insights/why-the-handover-is-underrated/index.html', '/tools/shift-handover/', '/challenges.html#handover'],
    ['de/insights/gemba/index.html', '/de/tools/kpi-diagnostic/', '/de/challenges.html#red-number'],
    ['sq/insights/the-first-30-days/index.html', '/sq/tools/six-sigma-dmaic/', '/sq/challenges.html#new-role'],
  ]) {
    const html = built(file);
    const box = html.match(/<aside class="essay-moves"[\s\S]*?<\/aside>/);
    assert.ok(box, `${file}: the box`);
    assert.equal((box[0].match(/<li>/g) || []).length, 3, `${file}: three moves`);
    assert.ok(html.indexOf('class="essay-moves"') < html.indexOf('class="essay-checklist"'), `${file}: the box comes before the checklist`);
    assert.match(box[0], /href="#essay-checklist-title"/, `${file}: the link to the checklist`);
    assert.match(html, /id="essay-checklist-title"/, `${file}: the checklist`);
    assert.ok(box[0].includes(`href="${tool}"`), `${file}: the tool ${tool}`);
    assert.ok(box[0].includes(`href="${challenge}"`), `${file}: the challenge ${challenge}`);
  }
});

test('the Insights rows carry their challenges and badges; the chips are the challenges by id', { skip: !hasSite }, () => {
  for (const [file, label] of [['insights.html', 'Checklist'], ['de/insights.html', 'Checkliste'], ['sq/insights.html', 'Checklist']]) {
    const html = built(file);
    for (const c of challenges) assert.ok(html.includes(`data-topic="${c.id}"`), `${file}: chip ${c.id}`);
    const rows = [...html.matchAll(/<a class="list-row"[^>]*data-topic="([^"]*)"/g)].map((m) => m[1]);
    assert.ok(rows.length >= 30, `${file}: ${rows.length} rows`);
    for (const topics of rows) for (const id of topics.split('|')) assert.ok(ids.has(id), `${file}: row topic "${id}"`);
    assert.ok(rows.some((topics) => topics.includes('|')), `${file}: a row with several challenges`);
    assert.equal((html.match(new RegExp(`<span class="row-badge">${label}</span>`, 'g')) || []).length, rows.length, `${file}: every row has a checklist badge`);
    assert.match(html, /href="\/(?:de\/|sq\/)?challenges\.html"/, `${file}: the link to the challenges`);
  }
});

test('the Challenges page lists every challenge with its essays, in the three languages, and switches language', { skip: !hasSite }, () => {
  for (const [file, lang, prefix] of [['challenges.html', 'en', ''], ['de/challenges.html', 'de', '/de'], ['sq/challenges.html', 'sq', '/sq']]) {
    const html = built(file);
    for (const c of challenges) {
      const section = html.match(new RegExp(`<section class="shell challenge" id="${c.id}"[\\s\\S]*?</section>`));
      assert.ok(section, `${file}: section ${c.id}`);
      // Display titles may carry <k-p> around letter pairs (lib/display-pairs.js): compare the words only.
      const words = section[0].replace(/<[^>]+>/g, '').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&');
      assert.ok(words.includes(c.name[lang]) && words.includes(c.line[lang]), `${file}: ${c.id} in ${lang}`);
      const links = section[0].match(new RegExp(`href="${prefix}/insights/`, 'g')) || [];
      assert.ok(links.length >= 2, `${file}: ${c.id} has ${links.length} essays`);
      for (const tool of c.tools) assert.ok(section[0].includes(`href="${prefix}${tool}"`), `${file}: ${c.id} shows ${tool}`);
      assert.ok(section[0].includes(`href="#${c.id}"`) || html.includes(`href="#${c.id}"`), `${file}: ${c.id} in the index`);
    }
    assert.match(html, /<nav class="lang-switch"/, `${file}: the language switch`);
    assert.match(html, new RegExp(`aria-current="page" href="${prefix}/writing.html"`), `${file}: Writing is the current menu item`);
  }
});
