// "Send me your challenge" (pages/your-challenge.njk) and "Join in" under an essay (layouts/article.njk): the form
// posts through the feedback script with every field labelled, the page exists in the three languages and is
// linked from the essays, the Challenges page and Contact, and the LinkedIn link leads to the essay's post or the
// author's profile.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const hasSite = fs.existsSync('_site/your-challenge.html');
const built = (file) => fs.readFileSync(path.join('_site', file), 'utf8');
const script = fs.readFileSync('src/js/feedback.js', 'utf8');

test('the mail body names every filled field by its label; empty fields, the trap and hidden fields are left out', async () => {
  const dom = new JSDOM(`<html><body><form data-tool-feedback data-mail="contact@example.test" data-sent="Thank you." data-opened="Opens. If not, write to" data-failed="Failed. Write to" data-subject="Your challenge">
    <input type="hidden" name="subject" value="Stiven Catalyst: Your challenge"><input type="hidden" name="lang" value="sq"><input type="hidden" name="page" value="https://example.test/sq/your-challenge.html">
    <select name="role" data-line="Roli yt"><option value="">Zgjidh</option><option value="Shef turni" selected>Shef turni</option></select>
    <textarea name="situation" data-line="Situata">Dy turne, i njëjti gabim.</textarea>
    <textarea name="tried" data-line="Çfarë është provuar"></textarea>
    <label><input type="radio" name="publish" value="Po" data-line="A mund ta botoj?" checked></label><label><input type="radio" name="publish" value="Jo" data-line="A mund ta botoj?"></label>
    <input type="email" name="email" data-line="Përgjigje te" value="lexues@example.test">
    <div class="tf-trap"><input type="text" name="website"></div>
    <button type="submit">Dërgo</button><p data-tool-feedback-status hidden></p></form></body></html>`, { url: 'https://example.test/sq/your-challenge.html', runScripts: 'outside-only' });
  const w = dom.window;
  const clicked = [];
  w.HTMLAnchorElement.prototype.click = function () { clicked.push(this.href); };
  w.eval(script);
  w.document.querySelector('form').dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true }));
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal(clicked.length, 1);
  const url = new URL(clicked[0]);
  assert.equal(url.pathname, 'contact@example.test');
  assert.equal(url.searchParams.get('subject'), 'Your challenge');
  assert.equal(url.searchParams.get('body'), ['Roli yt: Shef turni', 'Situata: Dy turne, i njëjti gabim.', 'A mund ta botoj?: Po', 'Përgjigje te: lexues@example.test', 'Page: https://example.test/sq/your-challenge.html'].join('\n\n'));
});

test('the page exists in the three languages and its texts are translated', () => {
  for (const file of ['src/your-challenge.njk', 'src/de/your-challenge.njk', 'src/sq/your-challenge.njk']) assert.ok(fs.existsSync(file), file);
  const found = new Set();
  for (const file of ['src/_includes/pages/your-challenge.njk', 'src/_includes/layouts/article.njk']) {
    const source = fs.readFileSync(file, 'utf8');
    for (const match of source.matchAll(/'((?:[^'\\]|\\.)*)' \| t\(lang\)/g)) found.add(match[1]);
    for (const match of source.matchAll(/"((?:[^"\\]|\\.)*)" \| t\(lang\)/g)) found.add(match[1]);
  }
  assert.ok(found.has('Send me your challenge.') && found.has('Join in'));
  for (const lang of ['de', 'sq']) {
    const ui = JSON.parse(fs.readFileSync(`src/_data/${lang}/ui.json`, 'utf8'));
    for (const text of found) assert.ok(ui[text], `${lang}: ${text}`);
  }
  const { LOCAL_PAGES } = require('../lib/translations.js');
  assert.ok(LOCAL_PAGES.has('/your-challenge.html'));
  assert.match(fs.readFileSync('src/datenschutz.njk', 'utf8'), /the form for your challenge/);
  assert.equal((fs.readFileSync('.pages.yml', 'utf8').match(/name: linkedin/g) || []).length, 3, 'the CMS knows the LinkedIn post field');
});

test('the built page carries the form with its fields, the language switch and the script; the essays, Challenges and Contact link to it', { skip: !hasSite }, () => {
  for (const [file, prefix] of [['your-challenge.html', ''], ['de/your-challenge.html', '/de'], ['sq/your-challenge.html', '/sq']]) {
    const html = built(file);
    assert.match(html, /<form class="contact-form tool-feedback-form challenge-form" data-tool-feedback/, file);
    for (const name of ['role', 'situation', 'tried', 'publish', 'email', 'website', 'page']) assert.ok(html.includes(`name="${name}"`), `${file}: ${name}`);
    assert.match(html, /<textarea id="challenge-situation" name="situation"[^>]*required/, `${file}: the situation is required`);
    assert.match(html, /<input type="radio" name="publish"[^>]*required/, `${file}: the answer on publishing is required`);
    assert.match(html, /<nav class="lang-switch"/, `${file}: language switch`);
    assert.match(html, /js\/feedback\.js/, file);
    assert.ok(built(`${prefix.slice(1) ? prefix.slice(1) + '/' : ''}challenges.html`).includes(`href="${prefix}/your-challenge.html"`), `${file}: from Challenges`);
    assert.ok(built(`${prefix.slice(1) ? prefix.slice(1) + '/' : ''}contact.html`).includes(`href="${prefix}/your-challenge.html"`), `${file}: from Contact`);
  }
  const essay = built('sq/insights/gemba/index.html');
  const join = essay.match(/<aside class="essay-join"[\s\S]*?<\/aside>/);
  assert.ok(join, 'the join box');
  assert.ok(essay.indexOf('class="essay-join"') < essay.indexOf('class="share-row"'), 'before the share row');
  assert.match(join[0], /data-join-linkedin="(post|profile)" .*href=|href="https:\/\/www\.linkedin\.com\/[^"]+"[^>]*data-join-linkedin="(post|profile)"/, 'a LinkedIn link');
  assert.match(join[0], /href="\/sq\/your-challenge\.html"[^>]*data-join-challenge/, 'the link to the form');
  const index = JSON.parse(built('search-index.json'));
  assert.ok(index.some((item) => item.k === 'page' && item.u === '/your-challenge.html'), 'in the search index');
});
