// The newsletter form: its texts are translated, the partial and the script agree on their names, the
// address goes to the provider with the page's language and the form gives way to the note to confirm,
// and the built pages allow the provider in their Content Security Policy.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');

const partial = fs.readFileSync('src/_includes/partials/newsletter.njk', 'utf8');
const script = fs.readFileSync('src/js/newsletter.js', 'utf8');
const site = JSON.parse(fs.readFileSync('src/_data/site.json', 'utf8'));

test('every text of the newsletter form has a German and an Albanian translation', () => {
  const found = new Set();
  for (const match of partial.matchAll(/'((?:[^'\\]|\\.)*)' \| t\(lang\)/g)) found.add(match[1]);
  for (const match of partial.matchAll(/"((?:[^"\\]|\\.)*)" \| t\(lang\)/g)) found.add(match[1]);
  assert.ok(found.size >= 10, `found ${found.size} texts`);
  for (const lang of ['de', 'sq']) {
    const ui = JSON.parse(fs.readFileSync(`src/_data/${lang}/ui.json`, 'utf8'));
    for (const text of found) assert.ok(ui[text], `${lang}: ${text}`);
  }
});

test('the partial carries every name and attribute the script reads', () => {
  for (const name of ['data-newsletter', 'data-newsletter-status', 'data-sent', 'data-failed', 'data-mail', 'name="website"', 'newsletter-row', 'form-note', '/js/newsletter.js']) {
    assert.ok(partial.includes(name), name);
  }
  for (const key of ['dataset.sent', 'dataset.failed', 'dataset.mail', '"website"', 'no-cors']) assert.ok(script.includes(key), key);
});

test('the form posts to MailerLite with the email, the language and the fields it expects', () => {
  const { action, emailField, languageField, hiddenFields } = site.newsletter;
  assert.match(action, /^https:\/\/assets\.mailerlite\.com\/jsonp\/\d+\/forms\/\d+\/subscribe$/);
  assert.equal(emailField, 'fields[email]');
  assert.equal(languageField, 'fields[language]');
  assert.deepEqual(hiddenFields, { 'ml-submit': '1', anticsrf: 'true' });
});

const page = (fetchImpl) => {
  const dom = new JSDOM(`<html><body><form data-newsletter action="https://assets.mailerlite.com/jsonp/1/forms/2/subscribe" method="post" data-sent="Almost there." data-failed="Did not go through. Write to" data-mail="contact@example.test">
    <div class="newsletter-row"><input type="email" name="fields[email]"><button type="submit">Subscribe</button></div>
    <input type="hidden" name="fields[language]" value="sq"><input type="hidden" name="ml-submit" value="1"><input type="hidden" name="anticsrf" value="true">
    <div class="newsletter-trap"><input type="text" name="website"></div>
    <p class="form-note">You will get an email.</p><p data-newsletter-status hidden></p></form></body></html>`, { url: 'https://example.test/sq/', runScripts: 'outside-only' });
  const w = dom.window;
  w.fetch = fetchImpl;
  w.URLSearchParams = URLSearchParams;
  w.eval(script);
  const form = w.document.querySelector('form');
  form.querySelector('input[type=email]').value = 'lexues@example.test';
  const submit = () => { form.dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true })); return new Promise((resolve) => setTimeout(resolve, 0)); };
  return { w, form, submit, status: w.document.querySelector('[data-newsletter-status]') };
};

test('a subscription is sent once, without leaving the page, and the form gives way to the note', async () => {
  const calls = [];
  const { form, submit, status } = page(async (url, options) => { calls.push({ url, options }); return {}; });
  await submit();
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://assets.mailerlite.com/jsonp/1/forms/2/subscribe');
  assert.equal(calls[0].options.method, 'POST');
  assert.equal(calls[0].options.mode, 'no-cors');
  const body = new URLSearchParams(calls[0].options.body);
  assert.equal(body.get('fields[email]'), 'lexues@example.test');
  assert.equal(body.get('fields[language]'), 'sq');
  assert.equal(body.get('ml-submit'), '1');
  assert.equal(body.has('website'), false);
  assert.equal(form.querySelector('.newsletter-row').hidden, true);
  assert.equal(form.querySelector('.form-note').hidden, true);
  assert.equal(status.hidden, false);
  assert.equal(status.textContent, 'Almost there.');
});

test('a failed request keeps the form and names the address to write to', async () => {
  const { form, submit, status } = page(async () => { throw new TypeError('Failed to fetch'); });
  await submit();
  assert.equal(form.querySelector('.newsletter-row').hidden, false);
  assert.equal(form.querySelector('button').disabled, false);
  assert.equal(status.textContent, 'Did not go through. Write to contact@example.test.');
  assert.equal(status.querySelector('a').getAttribute('href'), 'mailto:contact@example.test');
});

test('a bot that fills the hidden field gets the note and nothing is sent', async () => {
  let sent = 0;
  const { form, submit, status } = page(async () => { sent += 1; return {}; });
  form.querySelector('input[name=website]').value = 'https://spam.example';
  await submit();
  assert.equal(sent, 0);
  assert.equal(status.hidden, false);
});

test('the built pages show the form and allow the provider in their Content Security Policy', { skip: !fs.existsSync('_site/index.html') }, () => {
  for (const file of ['_site/index.html', '_site/sq/index.html', '_site/de/insights.html']) {
    const html = fs.readFileSync(file, 'utf8');
    assert.ok(html.includes('data-newsletter'), `${file}: form`);
    assert.match(html, /connect-src 'self' https:\/\/assets\.mailerlite\.com/, `${file}: connect-src`);
  }
  assert.ok(fs.readFileSync('_site/sq/index.html', 'utf8').includes('name="fields[language]" value="sq"'));
  assert.ok(fs.readFileSync('_site/datenschutz.html', 'utf8').includes('MailerLite'));
});
