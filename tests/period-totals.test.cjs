// A total typed for a period ("Units handled in the period", "Routes in the period") belongs to the days chosen when it
// was typed (totalsFor in the log). With other days chosen it is not used and the result says so; going back to those
// days brings it back. Damage Control and the Delay Analyzer on their built pages, with the scripts from src/js.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');

const hasSite = fs.existsSync('_site/tools/damage-control/index.html');
const page = (path, files, saved) => {
  const html = fs.readFileSync(`_site${path}index.html`, 'utf8').replace(/<script\b[^>]*\bsrc=[^>]*><\/script>/g, '');
  const { window } = new JSDOM(html, { url: `https://example.test${path}`, runScripts: 'outside-only', pretendToBeVisual: true });
  window.confirm = () => true;
  window.scrollTo = () => {};
  window.HTMLElement.prototype.scrollIntoView = () => {};
  for (const [key, value] of Object.entries(saved)) window.localStorage.setItem(key, JSON.stringify(value));
  for (const file of files) window.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  return window;
};
// Days counted back from the reader's date, as the range buttons count them.
const now = new Date();
const daysAgo = (k) => new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() - k)).toISOString().slice(0, 10);
const press = (window, preset) => window.document.querySelector(`[data-preset="${preset}"]`).dispatchEvent(new window.Event('click', { bubbles: true }));
const results = (window) => window.document.querySelector('[data-results]');
const statValue = (window, label) => [...results(window).querySelectorAll('.dl-stat')].find((item) => item.textContent.startsWith(label))?.querySelector('.dl-stat-value')?.textContent;
const warnings = (window) => [...results(window).querySelectorAll('.dl-warning')].map((item) => item.textContent).join(' ');

test('a volume typed for all days is not used for the last 7 days: the daily volumes of those days are', { skip: !hasSite }, () => {
  // Ten days, 1000 units each; 2 damaged a day in the last seven, 5 a day before. 10000 typed for all of them.
  const rows = [...Array(10)].map((_, k) => ({ date: daysAgo(k), shift: 'Early', stage: 'Loading', type: 'Crushed', cause: 'Stacking', units: k < 7 ? 2 : 5, cost: null, note: '' }));
  const volumes = [...Array(10)].map((_, k) => ({ date: daysAgo(k), volume: 1000 }));
  const window = page('/tools/damage-control/', ['tool-kit', 'defect-log'], { 'sc-damage-control': { period: '', volume: '10000', target: '', from: '', to: '', volumes, rows, example: {} } });
  assert.equal(statValue(window, 'DPMO'), '2,900', '29 of the 10000 typed');
  press(window, 'week');
  assert.equal(statValue(window, 'DPMO'), '2,000', '14 of the 7000 in the daily volumes, not 14 of 10000');
  assert.match(warnings(window), /The number you typed for units handled was for all days/);
  assert.equal(window.document.querySelector('[name=volume]').value, '', 'the box does not show a number it is not using');
  press(window, 'all');
  assert.equal(statValue(window, 'DPMO'), '2,900');
  assert.equal(window.document.querySelector('[name=volume]').value, '10000');
  assert.doesNotMatch(warnings(window), /was for/);
  // A log saved before totals remembered their days keeps the days chosen then (written at once when the page is hidden).
  window.dispatchEvent(new window.Event('pagehide'));
  assert.equal(JSON.parse(window.localStorage.getItem('sc-damage-control')).totalsFor.volume, '|');
});

test('routes typed for all days say nothing about today: late routes are counted, with no share on time', { skip: !hasSite }, () => {
  const late = [1, 2, 3, 4, 5].map((i) => ({ date: daysAgo(0), shift: 'Early', route: `R${i}`, planDep: '06:00', actDep: '06:30', planArr: '08:00', actArr: '08:45', reason: 'Late loading', note: '' }));
  const saved = { period: '', routes: '100', departureGrace: '10', arrivalGrace: '15', target: '95', from: '', to: '', rows: late, example: {}, totalsFor: { routes: '|' } };
  const window = page('/tools/delay-analyzer/', ['tool-kit', 'delay-analyzer'], { 'sc-delay-analyzer': saved });
  const title = () => results(window).querySelector('h2').textContent;
  assert.equal(title(), 'On time 95.0%');
  press(window, 'today');
  assert.equal(title(), 'Late routes 5', 'not "On time 0.0%" and not 5 of 100');
  assert.match(warnings(window), /The routes in the period you typed were for all days/);
  assert.equal(statValue(window, 'Sigma level'), undefined, 'no sigma level without a share');
  assert.equal(window.ToolKit.partialRouteLog(JSON.parse(window.localStorage.getItem('sc-delay-analyzer'))), true, 'still a partial log for Shift Pulse');
});
