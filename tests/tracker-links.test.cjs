// The older tools hand their problems to the Action Tracker (ToolKit.trackerUrl / trackerLink in src/js/tool-kit.js):
// the result buttons of the logs, 5 Whys, the Shift Handover, the KPI Diagnostic and the CX Control Tower. Since phase
// 5B the action waits in a sessionStorage note of the tab and the address carries only a token (#handoff=…).
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');

const { handedOver, carry } = require('./helpers/tool-page.cjs');
const load = (url, scripts = ['tool-kit']) => {
  const dom = new JSDOM('<html lang="de"><body></body></html>', { url, runScripts: 'outside-only', pretendToBeVisual: true });
  for (const file of scripts) dom.window.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  return dom.window;
};

test('the tracker link stays in the page\'s language and names the tool it came from', () => {
  const w = load('https://example.test/de/tools/damage-control/');
  const href = w.ToolKit.trackerUrl({ title: 'Stacking rule at dock 2', owner: 'Anna', due: '2026-10-30', priority: 'High' });
  const url = new w.URL(href);
  assert.equal(url.pathname, '/de/tools/action-tracker/');
  assert.equal(url.search, '', 'nothing typed in the address');
  assert.match(url.hash, /^#handoff=[a-z0-9]{16}$/);
  const sent = handedOver(w, href).action;
  assert.equal(sent.title, 'Stacking rule at dock 2');
  assert.equal(sent.source, 'damage-control');
  assert.equal(sent.owner, 'Anna');
  assert.equal(sent.due, '2026-10-30');
  assert.equal(sent.detail, undefined, 'empty fields are left out');
  // Without a title the link only opens the tracker.
  assert.equal(new w.URL(w.ToolKit.trackerUrl({})).hash, '');
  assert.equal(new w.URL(w.ToolKit.trackerUrl({})).search, '');
});

test('the result buttons of a log add the problem to the actions, unless the page keeps its own list', () => {
  const w = load('https://example.test/sq/tools/delay-analyzer/');
  const box = w.ToolKit.resultActions(() => 'summary', 'Route 14 late three days in a row');
  const link = [...box.querySelectorAll('a')].find((a) => a.href.includes('/action-tracker/'));
  assert.ok(link, 'a link to the tracker');
  const url = new w.URL(link.href);
  assert.equal(url.pathname, '/sq/tools/action-tracker/');
  assert.ok(!link.href.includes('Route') && url.search === '', 'the problem is not in the address');
  const sent = handedOver(w, link.href).action;
  assert.match(sent.title, /Route 14 late three days in a row/);
  assert.equal(sent.source, 'delay-analyzer');
  // A new tool loads the store and offers its own hand-off: no second link.
  const own = load('https://example.test/tools/oee/', ['tool-kit', 'actions-store']);
  const ownBox = own.ToolKit.resultActions(() => 'summary', 'Sorter speed loss');
  assert.ok(![...ownBox.querySelectorAll('a')].some((a) => a.href.includes('/action-tracker/')));
});

test('the tracker reads what an old tool sends and names its source', () => {
  const w = load('https://example.test/tools/night-audit/', ['tool-kit']);
  const href = w.ToolKit.trackerUrl({ title: 'Check declined cards before 23:00', priority: 'High' });
  const t = load(href, ['tool-kit', 'actions-store']);
  carry(w, t);
  const { added } = t.ActionsStore.fromParams(t.location);
  assert.equal(added.title, 'Check declined cards before 23:00');
  assert.equal(added.source, 'night-audit');
  assert.equal(added.priority, 'High');
  for (const lang of ['', 'de/', 'sq/']) {
    const sources = JSON.parse(fs.readFileSync(`src/_data/${lang}actionTracker.json`, 'utf8')).sources;
    for (const slug of ['damage-control', 'incomplete-control', 'delay-analyzer', 'night-audit', 'five-whys', 'shift-handover', 'kpi-diagnostic', 'cx-control-tower', 'pareto', 'sigma-control-chart']) assert.ok(sources[slug], `${lang || 'en/'} names ${slug}`);
  }
});

const hasSite = fs.existsSync('_site/de/tools/five-whys/index.html');
test('5 Whys sends its countermeasure with owner, date and check, and asks for one first', { skip: !hasSite }, () => {
  const html = fs.readFileSync('_site/de/tools/five-whys/index.html', 'utf8').replace(/<script\b[^>]*\bsrc=[^>]*><\/script>/g, '');
  const { window } = new JSDOM(html, { url: 'https://example.test/de/tools/five-whys/', runScripts: 'outside-only', pretendToBeVisual: true });
  for (const file of ['tool-kit', 'five-whys']) window.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  const form = window.document.querySelector('[data-worksheet]');
  const link = form.querySelector('[data-tracker]');
  assert.equal(link.dataset.ready, 'no');
  const click = new window.MouseEvent('click', { bubbles: true, cancelable: true });
  link.dispatchEvent(click);
  assert.ok(click.defaultPrevented);
  const type = (name, value) => { form.elements[name].value = value; form.elements[name].dispatchEvent(new window.Event('input', { bubbles: true })); };
  type('action', 'Dispatcher owns the dock plan from 5:30');
  type('owner', 'Driton');
  type('due', '2026-10-30');
  type('check', 'Departures within 5 minutes for a week');
  const url = new window.URL(link.href);
  assert.equal(url.pathname, '/de/tools/action-tracker/');
  assert.equal(url.search, '');
  for (const text of ['Dispatcher', 'Driton', 'Departures']) assert.ok(!decodeURIComponent(link.href).includes(text), `${text} is not in the address`);
  const sent = handedOver(window, link.href).action;
  assert.equal(sent.title, 'Dispatcher owns the dock plan from 5:30');
  assert.equal(sent.owner, 'Driton');
  assert.equal(sent.check, 'Departures within 5 minutes for a week');
  assert.equal(sent.source, 'five-whys');
  assert.equal(sent.due, '2026-10-30');
});
