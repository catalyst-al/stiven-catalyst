// The tools hand work to each other: 5 Whys puts its countermeasure on the Shift Handover (?issue=, ?owner=, ?due=),
// an issue carried three shifts opens 5 Whys on itself, and the KPI Diagnostic takes its result to 5 Whys. The pages
// are the built ones (_site), with the scripts from src/js.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');

const hasSite = fs.existsSync('_site/tools/five-whys/index.html');
const page = (path, files, setup) => {
  const html = fs.readFileSync(`_site${path.split('?')[0]}index.html`, 'utf8').replace(/<script\b[^>]*\bsrc=[^>]*><\/script>/g, '');
  const { window } = new JSDOM(html, { url: `https://example.test${path}`, runScripts: 'outside-only', pretendToBeVisual: true });
  window.confirm = () => true;
  window.scrollTo = () => {};
  window.HTMLElement.prototype.scrollIntoView = () => {};
  setup?.(window);
  for (const file of files) window.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  return window;
};
const type = (window, node, value) => {
  node.value = value;
  node.dispatchEvent(new window.Event('input', { bubbles: true }));
};

test('5 Whys carries its countermeasure, owner and due date to the handover, and asks for one first', { skip: !hasSite }, () => {
  const window = page('/de/tools/five-whys/', ['tool-kit', 'five-whys']);
  const form = window.document.querySelector('[data-worksheet]');
  const link = form.querySelector('[data-handover]');
  assert.equal(new window.URL(link.href).pathname, '/de/tools/shift-handover/', 'the handover in the page\'s language');
  assert.equal(link.dataset.ready, 'no');
  const click = new window.MouseEvent('click', { bubbles: true, cancelable: true });
  link.dispatchEvent(click);
  assert.ok(click.defaultPrevented, 'nothing to hand over yet');
  assert.match(form.querySelector('[data-status]').textContent, /Write the countermeasure first/);
  type(window, form.elements.action, 'Stacking rule as one picture at the dock');
  type(window, form.elements.owner, 'Anna');
  type(window, form.elements.due, '2026-10-20');
  const url = new window.URL(link.href);
  assert.equal(url.pathname, '/de/tools/shift-handover/');
  assert.equal(url.searchParams.get('issue'), 'Stacking rule as one picture at the dock');
  assert.equal(url.searchParams.get('owner'), 'Anna');
  assert.equal(url.searchParams.get('due'), '2026-10-20');
  assert.equal(link.dataset.ready, '');
  const again = new window.MouseEvent('click', { bubbles: true, cancelable: true });
  link.dispatchEvent(again);
  assert.ok(!again.defaultPrevented);
});

test('the handover takes the issue once, with the owner and the time, and cleans its address', { skip: !hasSite }, () => {
  const query = '?issue=Stacking%20rule%20as%20one%20picture&owner=Anna&due=2026-10-20&coaching=p1';
  const window = page(`/tools/shift-handover/${query}`, ['tool-kit', 'shift-handover']);
  const issues = JSON.parse(window.localStorage.getItem('sc-shift-handover')).current.issues;
  assert.deepEqual(issues, [{ text: 'Stacking rule as one picture', priority: 'High', owner: 'Anna', due: '2026-10-20', done: false, carried: 0 }]);
  assert.equal(window.location.search, '?coaching=p1', 'the other parameters stay');
  assert.match(window.document.querySelector('[data-output] [data-status]').textContent, /Added from 5 Whys/);
  const row = window.document.querySelector('[data-issues] .sh-issue');
  assert.equal(row.querySelector('[data-issue="text"]').value, 'Stacking rule as one picture');
  // Opened again with the same issue: not added twice.
  const second = page(`/tools/shift-handover/?issue=Stacking%20rule%20as%20one%20picture`, ['tool-kit', 'shift-handover'], (w) => {
    w.localStorage.setItem('sc-shift-handover', window.localStorage.getItem('sc-shift-handover'));
  });
  assert.equal(JSON.parse(second.localStorage.getItem('sc-shift-handover')).current.issues.length, 1);
  assert.match(second.document.querySelector('[data-output] [data-status]').textContent, /already an open issue/);
});

test('an issue carried three shifts links to 5 Whys on itself', { skip: !hasSite }, () => {
  const window = page('/sq/tools/shift-handover/', ['tool-kit', 'shift-handover'], (w) => {
    w.localStorage.setItem('sc-shift-handover-sq', JSON.stringify({ current: { template: 'warehouse', date: '2026-10-12', shift: 'Mëngjes', issues: [
      { text: 'Dock 3 scanner', priority: 'E lartë', owner: 'B', due: '10:00', done: false, carried: 3 },
      { text: 'Fresh', priority: 'Mesatare', owner: '', due: '', done: false, carried: 1 },
    ] }, history: [] }));
  });
  const tags = [...window.document.querySelectorAll('[data-issues] .dl-tag')];
  assert.equal(tags.length, 2);
  assert.equal(tags[0].tagName, 'A');
  const url = new window.URL(tags[0].href);
  assert.equal(url.pathname, '/sq/tools/five-whys/');
  // The page's translations are a script the test leaves out, so the text is the English one.
  assert.match(url.searchParams.get('problem'), /^Carried over 3 shifts: Dock 3 scanner$/);
  assert.equal(tags[1].tagName, 'SPAN', 'carried once is only a tag');
});

test('the KPI Diagnostic takes its result to 5 Whys', { skip: !hasSite }, () => {
  const window = page('/tools/kpi-diagnostic/', ['tool-kit', 'kpi-diagnostic']);
  const { document } = window;
  const form = document.querySelector('[data-diagnostic]');
  form.elements.kpi.value = 'Damage rate';
  const names = [...new Set([...form.querySelectorAll('input[type=radio]')].map((input) => input.name))];
  names.forEach((name, i) => {
    const options = [...form.querySelectorAll(`input[name="${name}"]`)];
    options[i % 2 ? 0 : options.length - 1].checked = true;
  });
  form.dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
  const link = [...document.querySelectorAll('[data-result] a')].find((a) => /5 Whys/.test(a.textContent));
  assert.ok(link, 'the link is in the result');
  const url = new window.URL(link.href);
  assert.equal(url.pathname, '/tools/five-whys/');
  assert.match(url.searchParams.get('problem'), /^Damage rate is red; /);
});
