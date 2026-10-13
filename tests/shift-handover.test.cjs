// Shift Handover (src/js/shift-handover.js) on its built page: "Fill in from the logs" writes what each box counts,
// and a route log that holds only some routes of its period gives a count of late routes, never a share.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');

const hasSite = fs.existsSync('_site/tools/shift-handover/index.html');
const DAY = '2026-10-12';
const late = [1, 2, 3, 4, 5].map((i) => ({ date: DAY, shift: 'Early', route: `R${i}`, planDep: '06:00', actDep: '06:30', planArr: '08:00', actArr: '08:45', reason: 'Late loading', note: '' }));

const fill = (delay) => {
  const html = fs.readFileSync('_site/tools/shift-handover/index.html', 'utf8').replace(/<script\b[^>]*\bsrc=[^>]*><\/script>/g, '');
  const { window } = new JSDOM(html, { url: 'https://example.test/tools/shift-handover/', runScripts: 'outside-only', pretendToBeVisual: true });
  window.localStorage.setItem('sc-damage-control', JSON.stringify({ rows: [{ date: DAY, shift: 'Early', stage: 'Loading', type: 'Crushed', cause: 'Stacking', units: 3, note: '' }], volumes: [] }));
  window.localStorage.setItem('sc-incomplete-control', JSON.stringify({ rows: [{ date: DAY, shift: 'Early', stage: 'Picking', cause: 'Short pick', units: 2, note: '' }], volumes: [] }));
  window.localStorage.setItem('sc-delay-analyzer', JSON.stringify(delay));
  for (const file of ['tool-kit', 'shift-handover']) window.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  const form = window.document.querySelector('[data-handover]');
  const set = (selector, value) => {
    const node = form.querySelector(selector);
    node.value = value;
    for (const type of ['input', 'change']) node.dispatchEvent(new window.Event(type, { bubbles: true }));
  };
  set('[name=template]', 'warehouse');
  set('[name=date]', DAY);
  set('[name=shift]', 'Early');
  form.querySelector('[data-fill-logs]').dispatchEvent(new window.Event('click', { bubbles: true }));
  return Object.fromEntries([...form.querySelectorAll('[data-metrics] > *')].map((row) => {
    const [name, value, note] = [...row.querySelectorAll('input')].map((input) => input.value);
    return [name, { value, note }];
  }));
};

test('the handover says what a count counts, so a "%" box never holds a bare number', { skip: !hasSite }, () => {
  const boxes = fill({ routes: '', from: '', to: '', departureGrace: '10', arrivalGrace: '15', rows: late });
  assert.equal(boxes['Damage %'].value, '3 damaged units');
  assert.match(boxes['Damage %'].note, /add the units handled for the rate/);
  assert.equal(boxes['Incomplete %'].value, '2 incomplete orders');
  assert.equal(boxes['On-time departures %'].value, '0.0%', 'every route of the shift is logged: a share');
});

test('a partial route log gives the late routes as a count, not 0 % on time', { skip: !hasSite }, () => {
  const boxes = fill({ routes: '100', from: '', to: '', departureGrace: '10', arrivalGrace: '15', rows: late });
  assert.equal(boxes['On-time departures %'].value, '5 late');
  assert.match(boxes['On-time departures %'].note, /only some routes of the period/i);
});
