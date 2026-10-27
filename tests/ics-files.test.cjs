// The calendar files (.ics) the tools write, taken from the real pages' buttons: every physical line at most 75 octets
// of UTF-8 (RFC 5545, 3.1), folded so that unfolding gives the text back whole, and the labels in the page's language
// (audit of 27 October 2026, P2B-10: the German Action Tracker file had 209-octet lines and "Check:", "Area:",
// "From:"; the Albanian Maintenance Planner file folded at 60 characters and had a 108-octet line).
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { openTool, click } = require('./helpers/tool-page.cjs');

const NOW = '2026-10-25T11:00:00Z';
const octets = (line) => Buffer.byteLength(line, 'utf8');
const unfold = (text) => text.replace(/\r\n /g, '').split('\r\n');

// The text of the calendar file a click on the button makes.
const calendarOf = (w, selector) => {
  let text = null;
  const Real = w.Blob;
  w.Blob = class extends Real { constructor(parts, options) { super(parts, options); if (options?.type?.startsWith('text/calendar')) text = parts.join(''); } };
  w.HTMLAnchorElement.prototype.click = () => {};
  click(w, w.document.querySelector(selector));
  w.Blob = Real;
  assert.ok(text, `a calendar file from ${selector}`);
  return text;
};
const assertFolded = (text, label) => {
  const physical = text.split('\r\n').slice(0, -1);
  const long = physical.filter((line) => octets(line) > 75);
  assert.deepEqual(long.map(octets), [], `${label}: no line longer than 75 octets`);
  assert.ok(physical.every((line) => !/�/.test(line)), `${label}: no character cut in two`);
};

test('German Action Tracker: folded at 75 octets, the labels in German', () => {
  const action = {
    id: 'a1', title: 'Stapelregel als ein Bild an Tor 2 aushängen und mit allen Schichtführern durchgehen', owner: 'Jürgen Müller',
    detail: 'Gequetschte Pakete beim Verladen: die schweren Pakete gehören nach unten, die Stapelhöhe ist an jeder Wechselbrücke markiert.',
    check: 'Gequetschte Pakete beim Verladen unter 10 pro Woche, vier Wochen lang', area: 'Tor 2', source: 'five-whys',
    due: '2026-11-03', status: 'open', priority: 'High', created: '2026-10-20',
  };
  const w = openTool('action-tracker', { lang: 'de', now: NOW, storage: { 'sc-actions': { rows: [action] } } });
  const text = calendarOf(w, '[data-ics]');
  assertFolded(text, 'DE Action Tracker');
  const lines = unfold(text);
  const description = lines.find((line) => line.startsWith('DESCRIPTION:'));
  assert.ok(description.includes(action.detail.replace(/,/g, '\\,')), 'the detail unfolds whole');
  assert.match(description, /\\nKontrolle: Gequetschte Pakete/);
  assert.match(description, /\\nBereich: Tor 2\\nVon: five-whys$/);
  assert.doesNotMatch(description, /Check:|Area:|From:/);
  assert.ok(lines.includes(`SUMMARY:${action.title} (Jürgen Müller)`), 'the summary unfolds whole');
});

test('Albanian Maintenance Planner: every line within 75 octets, no emoji cut in two', () => {
  const w = openTool('maintenance-planner', { lang: 'sq', now: NOW });
  const text = calendarOf(w, '[data-ics]');
  assertFolded(text, 'SQ Maintenance Planner example');
  assert.ok(unfold(text).filter((line) => line === 'BEGIN:VEVENT').length > 10, 'the example plan is in the file');
  // The audit's task (t16-ics.js): a long Albanian name and a description of emoji, through the planner's own writer.
  const summary = 'Kontrollë e përjavshme e ngrohësit në katin e dytë: çelësat, rripat, filtrat, vajrat — ëëëëëëëëëë';
  const own = w.MaintenancePlannerMath.ics([{ uid: 'x1', date: '2026-11-02', summary, description: '🔧'.repeat(40) }], new Date(NOW));
  assertFolded(own, 'SQ Maintenance Planner task');
  assert.ok(!own.split('\r\n').some((line) => /[\uD800-\uDBFF]$|^ ?[\uDC00-\uDFFF]/.test(line)), 'no lone surrogate at a fold');
  const lines = unfold(own);
  assert.ok(lines.includes(`SUMMARY:${summary.replace(/,/g, '\\,')}`));
  assert.ok(lines.includes(`DESCRIPTION:${'🔧'.repeat(40)}`));
});

test('the shared fold: 75 octets with two- and three-byte characters, and back whole', () => {
  const w = openTool('action-tracker', { lang: 'sq', now: NOW });
  const { icsFold, icsText } = w.ActionsStore;
  for (const line of [`DESCRIPTION:${'ë'.repeat(100)}`, `SUMMARY:${'€'.repeat(40)}x`, `SUMMARY:${'a'.repeat(75)}`, 'SUMMARY:short']) {
    const folded = icsFold(line);
    assert.ok(folded.split('\r\n').every((part) => octets(part) <= 75), line.slice(0, 20));
    assert.equal(folded.replace(/\r\n /g, ''), line);
  }
  assert.equal(icsFold(`SUMMARY:${'a'.repeat(67)}`), `SUMMARY:${'a'.repeat(67)}`, 'exactly 75 octets stays one line');
  assert.equal(icsText('a,b;c\\d\ne'), 'a\\,b\\;c\\\\d\\ne');
});

test('German 5S plan and Leader Standard Work still fold at 75 octets through the shared rule', () => {
  const five = openTool('five-s-audit', { lang: 'de', now: NOW });
  const plan = five.document.querySelector('[data-plan-ics]');
  assert.ok(plan, 'the 5S plan has a calendar button');
  assertFolded(calendarOf(five, '[data-plan-ics]'), 'DE 5S plan');
  const M = five.FiveSMath;
  assertFolded(M.ics([{ date: '2026-10-26', area: 'Wareneingang', summary: `5S-Audit: ${'Ü'.repeat(70)}` }], new Date(NOW)), '5S math');
  const lsw = openTool('leader-standard-work', { lang: 'de', now: NOW });
  assertFolded(calendarOf(lsw, '[data-ics]'), 'DE Leader Standard Work');
});
