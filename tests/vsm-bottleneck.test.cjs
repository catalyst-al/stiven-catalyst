// The Value Stream Map's bottleneck is the step with the least capacity, not the longest cycle time per operator
// (audit of 27 October 2026, P2B-14): a step that needs more of the day once its uptime and its share of the
// changeovers are counted is the constraint, and the "Start here" card must not say "every step keeps up with takt"
// while a warning below says that step cannot cover the day. Built from the tool's own example (src/_data).
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { openTool } = require('./helpers/tool-page.cjs');

const plain = (value) => JSON.parse(JSON.stringify(value));
const near = (a, b, eps = 1e-6) => assert.ok(Math.abs(a - b) < eps, `${a} ≈ ${b}`);
const DATA = JSON.parse(fs.readFileSync('src/_data/valueStreamMap.json', 'utf8'));

test('the bottleneck is the step with the least capacity: time per piece with uptime and changeovers', () => {
  const w = openTool('value-stream-map');
  const M = w.VsmMath;
  // Time per piece of working day: (CT ÷ operators + changeover ÷ batch) ÷ uptime.
  near(M.pieceTime({ ct: 48, operators: 4, co: 5, batch: 200, uptime: 94 }), 13.5 / 0.94);
  assert.equal(M.pieceTime({ ct: 30, uptime: 0 }), Infinity, 'a step that is never up never releases a piece');
  assert.equal(M.pieceTime({ ct: 0 }), 0);
  const state = M.fromExample(DATA.example);
  const run = (map) => M.analyse({ demand: state.demand, minutes: state.minutes, steps: map.steps, finished: map.finished });
  // Current state: Pack is both the slowest by CT per operator and the one with the least capacity.
  assert.equal(run(state.current).bottleneck.name, 'Pack');
  // Future state: Load has the longest CT per operator (20 s ÷ 2 = 10 s), but Pack (44 s ÷ 5 = 8.8 s, plus 300 s per
  // 200 pieces, at 94 % uptime) needs 10.96 s of the day per piece against Load's 10.93 s.
  const next = run(state.future);
  assert.deepEqual(plain(next.steps.map((s) => Math.round(s.pace * 1000) / 1000)), [9.375, 9.239, 9.184, 10.957, 7.071, 10.928]);
  assert.equal(next.bottleneck.name, 'Pack');
  near(next.bottleneck.capacity, 900 * 60 / next.bottleneck.pace);
  assert.ok(next.steps.every((s) => s.capacity >= next.bottleneck.capacity - 1e-9), 'no step has less capacity than the bottleneck');
  // The audit's line: Weld 39 s on one operator against Assy 62 s on two at 50 % uptime (capacity 445 for a demand of 460).
  const line = M.analyse({ demand: 460, minutes: 460, steps: [{ name: 'Stamp', ct: 1, co: 60, uptime: 85, batch: 1200 }, { name: 'Weld', ct: 39 }, { name: 'Assy', ct: 62, operators: 2, uptime: 50 }, { name: 'Ship', ct: 0 }] });
  assert.equal(line.bottleneck.name, 'Assy');
  near(line.bottleneck.capacity, 460 * 60 * 0.5 / 31);
  assert.equal(M.bottleneck([{ ct: '' }]), -1);
});

for (const lang of ['en', 'de', 'sq']) {
  test(`${lang}: the page names the constraint and does not say every step keeps up`, () => {
    // The example's future state with Load up 85 % of the time: 10 s per piece by CT, 12.5 s with uptime and changeovers.
    const own = JSON.parse(fs.readFileSync(`src/_data/${lang === 'en' ? '' : `${lang}/`}valueStreamMap.json`, 'utf8'));
    const state = { ...JSON.parse(JSON.stringify(openTool('value-stream-map').VsmMath.fromExample(own.example))), view: 'future', example: false };
    state.future.steps[5].uptime = '85';
    const w = openTool('value-stream-map', { lang, storage: { [own.storageKey]: state } });
    const results = w.document.querySelector('[data-results]');
    assert.equal(results.hidden, false);
    const loadName = own.example.future.steps[5].name;
    const bottleneckStat = [...results.querySelectorAll('.dl-stat')].find((node) => /^(Bottleneck|Engpass|Pengesa)$/.test(node.querySelector('.dl-stat-label')?.textContent));
    assert.ok(bottleneckStat, 'a bottleneck stat');
    assert.match(bottleneckStat.textContent, new RegExp(loadName));
    assert.match(bottleneckStat.textContent, /12[.,]5\s?s/, 'its time per piece with uptime and changeovers');
    const focus = results.querySelector('.dl-focus');
    assert.ok(focus, 'a Start here card');
    assert.match(focus.textContent, new RegExp(loadName), 'Start here points at the constraint');
    assert.doesNotMatch(focus.textContent, /Every step keeps up with takt|Jeder Schritt hält die Taktzeit|Çdo hap e mban taktin/);
  });
}
