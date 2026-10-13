// My shelf (src/js/shelf.js): the bookmark saves a page in this browser, the header counts it, a checklist keeps
// its state and comes back, and the Shelf page draws saved pages, cards in progress and the reading from the
// browser and the page's catalogue. Nothing leaves the browser.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const script = fs.readFileSync('src/js/shelf.js', 'utf8');
const hasSite = fs.existsSync('_site/shelf.html');
const built = (file) => fs.readFileSync(path.join('_site', file), 'utf8');

const essayPage = `<!doctype html><html lang="sq"><body>
  <a class="icon-button shelf-link" href="/sq/shelf.html"><b data-shelf-count hidden>0</b></a>
  <article data-article data-essay-id="gemba" data-essay-title="Gemba: çfarë sheh në terren">
    <button type="button" class="essay-save" data-shelf-save data-save-label="Ruaje për më vonë" data-saved-label="E ruajtur" aria-pressed="false"><span data-shelf-label>Ruaje për më vonë</span></button>
    <section class="essay-checklist" data-essay-checklist data-lang="sq"><p class="kicker">Fleta e një vizite në terren</p><ol>
      <li><label><input type="checkbox" data-checklist-item><span>A</span></label></li>
      <li><label><input type="checkbox" data-checklist-item><span>B</span></label></li>
      <li class="is-field"><label><span>C</span><textarea data-checklist-item></textarea></label></li>
    </ol><button type="button" data-checklist-clear>Pastro</button></section>
  </article>
  <div data-share-orbit data-url="https://stivencatalyst.com/sq/insights/gemba/" data-title="Gemba: çfarë sheh në terren"><button type="button" data-shelf-save data-save-label="Ruaje" data-saved-label="E ruajtur"><small data-shelf-label>Ruaje</small></button></div>
</body></html>`;
const open = (html, url, storage) => {
  const dom = new JSDOM(html, { url, runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  if (storage) for (const [k, v] of Object.entries(storage)) w.localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v));
  w.eval(script);
  return { w, $: (s) => w.document.querySelector(s), $$: (s) => [...w.document.querySelectorAll(s)] };
};

test('the bookmark saves the page with its title and kind, both buttons and the header badge follow, and a second press removes it', () => {
  const { w, $, $$ } = open(essayPage, 'https://stivencatalyst.com/sq/insights/gemba/');
  assert.equal($('[data-shelf-count]').hidden, true);
  $('.essay-save').click();
  const saved = JSON.parse(w.localStorage.getItem('sc-shelf'));
  assert.equal(saved.items.length, 1);
  assert.equal(saved.items[0].u, '/sq/insights/gemba/');
  assert.equal(saved.items[0].t, 'Gemba: çfarë sheh në terren');
  assert.equal(saved.items[0].k, 'essay');
  assert.equal(saved.items[0].l, 'sq');
  assert.deepEqual($$('[data-shelf-save]').map((b) => [b.getAttribute('aria-pressed'), b.querySelector('[data-shelf-label]').textContent]), [['true', 'E ruajtur'], ['true', 'E ruajtur']]);
  assert.equal($('[data-shelf-count]').hidden, false);
  assert.equal($('[data-shelf-count]').textContent, '1');
  $$('[data-shelf-save]')[1].click();
  assert.equal(JSON.parse(w.localStorage.getItem('sc-shelf')).items.length, 0);
  assert.equal($('.essay-save').getAttribute('aria-pressed'), 'false');
  assert.equal($('[data-shelf-count]').hidden, true);
  assert.equal(w.Shelf.kindOf('/de/tools/pareto/'), 'tool');
  assert.equal(w.Shelf.kindOf('/reflections/x/'), 'reflection');
  assert.equal(w.Shelf.kindOf('/sq/challenges.html'), 'page');
});

test('a checklist keeps its ticks and answers in this browser, and comes back when the essay opens again', () => {
  const first = open(essayPage, 'https://stivencatalyst.com/sq/insights/gemba/');
  const boxes = first.$$('[data-checklist-item]');
  boxes[1].checked = true; boxes[1].dispatchEvent(new first.w.Event('change', { bubbles: true }));
  boxes[2].value = 'Rampa, ora 6'; boxes[2].dispatchEvent(new first.w.Event('input', { bubbles: true }));
  const kept = JSON.parse(first.w.localStorage.getItem('sc-checklists'));
  assert.deepEqual(Object.keys(kept), ['gemba@sq']);
  assert.deepEqual(kept['gemba@sq'].v, [false, true, 'Rampa, ora 6']);
  assert.equal(kept['gemba@sq'].d, 2);
  assert.equal(kept['gemba@sq'].n, 3);
  assert.equal(kept['gemba@sq'].c, 'Fleta e një vizite në terren');
  assert.equal(kept['gemba@sq'].u, '/sq/insights/gemba/');
  // Opened again: the state is back, and the events fire so the count on the page follows.
  const again = open(essayPage, 'https://stivencatalyst.com/sq/insights/gemba/', { 'sc-checklists': kept });
  const back = again.$$('[data-checklist-item]');
  assert.deepEqual([back[0].checked, back[1].checked, back[2].value], [false, true, 'Rampa, ora 6']);
  // Nothing ticked: the card leaves the browser.
  back[1].checked = false; back[1].dispatchEvent(new again.w.Event('change', { bubbles: true }));
  back[2].value = ''; back[2].dispatchEvent(new again.w.Event('input', { bubbles: true }));
  assert.deepEqual(JSON.parse(again.w.localStorage.getItem('sc-checklists')), {});
});

const shelfPage = (lang) => `<!doctype html><html lang="${lang}"><body><b data-shelf-count hidden>0</b>
<section data-shelf-page data-lang="${lang}" data-labels='${JSON.stringify({ remove: 'Hiq', noSaved: 'Asgjë.', noCards: 'Asnjë kartë.', noReading: 'Asgjë e lexuar.', done: '{a} nga {b} të bëra', percent: '{p}% e lexuar', confirmClear: 'Pastro?', kinds: { essay: 'Ese', tool: 'Mjet', reflection: 'Reflektim', page: 'Faqe' } })}'>
  <script type="application/json" data-shelf-catalogue>${JSON.stringify([{ s: 'gemba', t: 'Gemba (sq)', u: '/sq/insights/gemba/', k: 'essay' }, { s: 'the-first-30-days', t: '30 ditët e para', u: '/sq/insights/the-first-30-days/', k: 'essay' }])}</script>
  <div data-shelf-saved><ul></ul><p class="shelf-empty"></p></div>
  <div data-shelf-cards><ul></ul><p class="shelf-empty"></p></div>
  <div data-shelf-started><ul></ul><p class="shelf-empty"></p></div>
  <div data-shelf-finished><ul></ul><p class="shelf-empty"></p></div>
  <button type="button" data-shelf-clear hidden>Pastro raftin</button>
</section></body></html>`;

test('the Shelf page draws what the browser holds: saved pages (this language first), cards in progress, reading begun and finished', () => {
  const storage = {
    'sc-shelf': { v: 1, items: [{ u: '/tools/pareto/', t: 'Pareto 80/20', k: 'tool', l: 'en', at: 3 }, { u: '/sq/insights/gemba/', t: 'Gemba (sq)', k: 'essay', l: 'sq', at: 2 }] },
    'sc-checklists': { 'gemba@sq': { u: '/sq/insights/gemba/', t: 'Gemba (sq)', c: 'Fleta e një vizite', v: [true, false], n: 2, d: 1, at: 1 } },
    'sc-reading': { gemba: { p: 0.4, done: false, t: 5 }, 'the-first-30-days': { p: 1, done: true, t: 4 }, unknown: { p: 1, done: true, t: 9 } },
  };
  const { w, $, $$ } = open(shelfPage('sq'), 'https://stivencatalyst.com/sq/shelf.html', storage);
  const titles = (sel) => $$(`${sel} .shelf-row strong`).map((s) => s.textContent);
  assert.deepEqual(titles('[data-shelf-saved]'), ['Gemba (sq)', 'Pareto 80/20'], 'this language first');
  assert.match($$('[data-shelf-saved] .shelf-row-meta')[1].textContent, /Mjet · EN/);
  assert.deepEqual(titles('[data-shelf-cards]'), ['Fleta e një vizite']);
  assert.match($('[data-shelf-cards] .shelf-row-meta').textContent, /1 nga 2 të bëra/);
  assert.equal($('[data-shelf-cards] .shelf-row-link').getAttribute('href'), '/sq/insights/gemba/#essay-checklist-title');
  assert.deepEqual(titles('[data-shelf-started]'), ['Gemba (sq)']);
  assert.match($('[data-shelf-started] .shelf-row-meta').textContent, /40% e lexuar/);
  assert.deepEqual(titles('[data-shelf-finished]'), ['30 ditët e para'], 'a slug the catalogue does not know is left out');
  assert.equal($('[data-shelf-saved] .shelf-empty').hidden, true);
  assert.equal($('[data-shelf-clear]').hidden, false);
  assert.equal($('[data-shelf-count]').textContent, '2');
  // Remove one.
  $('[data-shelf-saved] .shelf-remove').click();
  assert.deepEqual(titles('[data-shelf-saved]'), ['Pareto 80/20']);
  assert.equal($('[data-shelf-count]').textContent, '1');
  // Clear everything, after the question.
  w.confirm = () => true;
  $('[data-shelf-clear]').click();
  assert.deepEqual(titles('[data-shelf-saved]'), []);
  assert.equal($('[data-shelf-saved] .shelf-empty').hidden, false);
  assert.equal($('[data-shelf-saved] .shelf-empty').textContent, 'Asgjë.');
  assert.deepEqual(JSON.parse(w.localStorage.getItem('sc-checklists')), {});
  assert.deepEqual(titles('[data-shelf-started]'), ['Gemba (sq)'], 'the reading stays: it is not the shelf');
});

test('the shelf shows only pages of this site, whatever a backup file put in it', () => {
  const storage = {
    'sc-shelf': { v: 1, items: [
      { u: 'javascript:alert(1)', t: 'Script', k: 'tool', l: 'sq', at: 4 }, { u: 'https://example.com/login', t: 'Elsewhere', k: 'tool', l: 'sq', at: 3 },
      { u: '//example.com/', t: 'Also elsewhere', k: 'tool', l: 'sq', at: 2 }, { u: '/sq/insights/gemba/', t: 'Gemba (sq)', k: 'essay', l: 'sq', at: 1 },
    ] },
    'sc-checklists': { x: { u: 'javascript:alert(1)', t: 'X', c: 'Card', v: [], n: 1, d: 0, at: 1 } },
  };
  const { $$ } = open(shelfPage('sq'), 'https://stivencatalyst.com/sq/shelf.html', storage);
  assert.deepEqual($$('[data-shelf-saved] .shelf-row strong').map((s) => s.textContent), ['Gemba (sq)']);
  assert.deepEqual($$('[data-shelf-cards] .shelf-row'), []);
  assert.ok($$('a').every((a) => !/^(javascript:|https?:|\/\/)/.test(a.getAttribute('href') || '')), 'no link leads off the site');
});

test('the templates carry the bookmark in the header, the byline and the share planet; the texts are translated; the backup names the keys', () => {
  const base = fs.readFileSync('src/_includes/layouts/base.njk', 'utf8');
  assert.match(base, /class="icon-button shelf-link" href="\{\{ '\/shelf\.html' \| local\(lang\) \}\}"/);
  assert.match(base, /data-shelf-count/);
  assert.match(base, /\/js\/shelf\.js/);
  assert.match(fs.readFileSync('src/_includes/partials/share-orbit.njk', 'utf8'), /data-shelf-save/);
  assert.match(fs.readFileSync('src/_includes/layouts/article.njk', 'utf8'), /class="essay-save" data-shelf-save/);
  for (const file of ['src/shelf.njk', 'src/de/shelf.njk', 'src/sq/shelf.njk']) assert.ok(fs.existsSync(file), file);
  const { LOCAL_PAGES } = require('../lib/translations.js');
  assert.ok(LOCAL_PAGES.has('/shelf.html'));
  const found = new Set();
  for (const file of ['src/_includes/pages/shelf.njk', 'src/_includes/partials/share-orbit.njk', 'src/_includes/layouts/base.njk', 'src/_includes/layouts/article.njk', 'src/_includes/partials/work-backup.njk']) {
    const source = fs.readFileSync(file, 'utf8');
    for (const match of source.matchAll(/'((?:[^'\\]|\\.)*)' \| t\(lang\)/g)) found.add(match[1]);
    for (const match of source.matchAll(/"((?:[^"\\]|\\.)*)" \| t\(lang\)/g)) found.add(match[1]);
  }
  assert.ok(found.has('My shelf') && found.has('Save for later') && found.has('Cards in progress'));
  for (const lang of ['de', 'sq']) {
    const ui = JSON.parse(fs.readFileSync(`src/_data/${lang}/ui.json`, 'utf8'));
    for (const t of found) assert.ok(ui[t], `${lang}: ${t}`);
  }
  assert.match(fs.readFileSync('src/_includes/partials/work-backup.njk', 'utf8'), /"shelf": .*"checklists": .*"reading": /);
  assert.match(fs.readFileSync('src/datenschutz.njk', 'utf8'), /“My shelf”/);
});

test('the built pages: the shelf in three languages with its catalogue, the bookmark on an essay and a tool, the header link everywhere', { skip: !hasSite }, () => {
  for (const [file, lang, prefix] of [['shelf.html', 'en', ''], ['de/shelf.html', 'de', '/de'], ['sq/shelf.html', 'sq', '/sq']]) {
    const html = built(file);
    assert.match(html, /<section class="shell shelf" data-shelf-page/, file);
    const catalogue = JSON.parse(html.match(/<script type="application\/json" data-shelf-catalogue>([\s\S]*?)<\/script>/)[1]);
    assert.ok(catalogue.filter((c) => c.k === 'essay').length >= 30, `${file}: essays in the catalogue`);
    assert.ok(catalogue.some((c) => c.k === 'tool' && c.u === `${prefix}/tools/pareto/`), `${file}: tools in the catalogue`);
    assert.ok(catalogue.every((c) => c.u.startsWith(prefix ? `${prefix}/` : '/')), `${file}: addresses of ${lang}`);
    assert.match(html, /<meta name="robots" content="noindex">/, `${file}: not for search engines`);
    assert.match(html, /<nav class="lang-switch"/, `${file}: language switch`);
    const names = JSON.parse(built(`${prefix.slice(1) ? prefix.slice(1) + '/' : ''}tools/pareto/index.html`).match(/<script type="application\/json" id="work-backup-names">([\s\S]*?)<\/script>/)[1]);
    assert.ok(names.shelf && names.checklists && names.reading, `${file}: the backup names the keys`);
  }
  for (const file of ['insights/gemba/index.html', 'de/tools/five-whys/index.html', 'sq/challenges.html']) {
    const html = built(file);
    assert.match(html, /class="icon-button shelf-link" href="\/(de\/|sq\/)?shelf\.html"/, `${file}: the header link`);
    assert.match(html, /data-shelf-save data-save-label=/, `${file}: a bookmark`);
    assert.match(html, /js\/shelf\.js/, `${file}: the script`);
  }
  assert.match(built('sq/insights/gemba/index.html'), /class="essay-save" data-shelf-save data-save-label="Ruaje për më vonë"/);
});
