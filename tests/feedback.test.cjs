// The feedback question at the end of a tool page: its texts are translated, the script and the partial
// agree on their names, the mail fallback opens the visitor's mail program, and a form action is posted to.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');

const partial = fs.readFileSync('src/_includes/partials/tool-feedback.njk', 'utf8');
const script = fs.readFileSync('src/js/feedback.js', 'utf8');

test('every text of the feedback form has a German and an Albanian translation', () => {
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
  for (const name of ['data-tool-feedback', 'data-tool-feedback-status', 'data-sent', 'data-opened', 'data-failed', 'data-subject', 'name="helped"', 'name="message"', 'name="email"', 'name="website"', 'name="page"', 'name="tool"', 'name="lang"']) {
    assert.ok(partial.includes(name), name);
  }
  for (const key of ['dataset.sent', 'dataset.opened', 'dataset.failed', 'dataset.subject', 'dataset.mail', '"helped"', '"message"', '"email"', '"website"', '"page"']) {
    assert.ok(script.includes(key), key);
  }
});

// The form as the partial renders it, with the action or the mail address of the site.
const page = ({ action = '', mail = 'contact@example.test' } = {}) => {
  const attrs = action ? `action="${action}" method="post"` : `data-mail="${mail}"`;
  const dom = new JSDOM(`<html><body><form data-tool-feedback ${attrs} data-sent="Thank you." data-opened="Your email program opens. If not, write to" data-failed="Could not send. Write to" data-subject="Feedback: Pareto 80/20">
    <input type="hidden" name="subject" value="Feedback: Pareto 80/20"><input type="hidden" name="tool" value="/tools/pareto/"><input type="hidden" name="lang" value="de"><input type="hidden" name="page" value="https://example.test/de/tools/pareto/">
    <fieldset><label><input type="radio" name="helped" value="yes" required><span>Yes</span></label><label><input type="radio" name="helped" value="no"><span>No</span></label></fieldset>
    <label class="tf-field"><textarea name="message"></textarea></label><label class="tf-field"><input type="email" name="email"></label>
    <div class="tf-trap"><input type="text" name="website"></div>
    <div class="tf-actions"><button type="submit">Send</button></div>
    <p data-tool-feedback-status hidden></p></form></body></html>`, { url: 'https://example.test/de/tools/pareto/', runScripts: 'outside-only' });
  const w = dom.window;
  w.eval(script);
  const form = w.document.querySelector('form');
  const submit = () => { form.dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true })); return new Promise((resolve) => setTimeout(resolve, 0)); };
  return { w, form, submit, status: w.document.querySelector('[data-tool-feedback-status]') };
};

test('without an action the answer goes by email through a mailto: link', async () => {
  const { w, form, submit, status } = page();
  const opened = [];
  w.document.addEventListener('click', (event) => { if (event.target.tagName === 'A') { opened.push(event.target.href); event.preventDefault(); } });
  form.querySelector('input[value=no]').checked = true;
  form.querySelector('textarea').value = 'Ein Export nach Excel fehlt.';
  form.querySelector('input[type=email]').value = 'leser@example.test';
  await submit();
  assert.equal(opened.length, 1);
  const url = new URL(opened[0]);
  assert.equal(url.protocol, 'mailto:');
  assert.equal(url.pathname, 'contact@example.test');
  assert.equal(url.searchParams.get('subject'), 'Feedback: Pareto 80/20');
  const body = url.searchParams.get('body');
  assert.match(body, /^Helped: no\n/);
  assert.ok(body.includes('Ein Export nach Excel fehlt.'));
  assert.ok(body.includes('Reply to: leser@example.test'));
  assert.ok(body.includes('Page: https://example.test/de/tools/pareto/'));
  assert.equal(status.hidden, false);
  assert.ok(status.textContent.startsWith('Your email program opens.'));
  assert.equal(status.querySelector('a').getAttribute('href'), 'mailto:contact@example.test');
  assert.equal(form.querySelector('fieldset').hidden, true, 'the question is folded away once answered');
});

test('with an action the answer is posted there and the form thanks the visitor', async () => {
  const { w, form, submit, status } = page({ action: 'https://forms.example.test/f/abc' });
  const calls = [];
  w.fetch = async (url, init) => { calls.push({ url, init }); return { ok: true, status: 200 }; };
  form.querySelector('input[value=yes]').checked = true;
  form.querySelector('textarea').value = 'Passt.';
  await submit();
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://forms.example.test/f/abc');
  assert.equal(calls[0].init.method, 'POST');
  assert.equal(calls[0].init.headers.Accept, 'application/json');
  const sent = calls[0].init.body;
  assert.equal(sent.get('helped'), 'yes');
  assert.equal(sent.get('message'), 'Passt.');
  assert.equal(sent.get('tool'), '/tools/pareto/');
  assert.equal(sent.get('lang'), 'de');
  assert.equal(status.textContent, 'Thank you.');
  assert.equal(form.querySelector('.tf-actions').hidden, true);
});

test('a failed post keeps the form and names the email address instead', async () => {
  const { w, form, submit, status } = page({ action: 'https://forms.example.test/f/abc' });
  w.fetch = async () => ({ ok: false, status: 500 });
  form.querySelector('input[value=yes]').checked = true;
  await submit();
  assert.equal(form.querySelector('fieldset').hidden, false);
  assert.equal(form.querySelector('button').disabled, false);
  assert.ok(status.textContent.startsWith('Could not send.'));
  assert.equal(status.querySelector('a'), null, 'no address when the site has only an action');
});

test('a filled honeypot sends nothing and still thanks', async () => {
  const { w, form, submit, status } = page({ action: 'https://forms.example.test/f/abc' });
  let called = 0;
  w.fetch = async () => { called++; return { ok: true }; };
  form.querySelector('input[value=yes]').checked = true;
  form.querySelector('input[name=website]').value = 'http://spam.example';
  await submit();
  assert.equal(called, 0);
  assert.equal(status.textContent, 'Thank you.');
});

test('the feedback form has an attribute no other part of a page uses', () => {
  const walk = (dir, out = []) => { for (const e of fs.readdirSync(dir, { withFileTypes: true })) { const f = `${dir}/${e.name}`; if (e.isDirectory()) walk(f, out); else if (f.endsWith('.njk')) out.push(f); } return out; };
  const users = walk('src').filter((file) => /data-tool-feedback(?!-status)/.test(fs.readFileSync(file, 'utf8')));
  assert.deepEqual(users, ['src/_includes/partials/tool-feedback.njk']);
  assert.match(script, /querySelector\("\[data-tool-feedback\]"\)/);
});
