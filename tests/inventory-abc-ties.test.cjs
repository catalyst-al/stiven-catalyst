// Inventory ABC with equal values (audit of 27 October 2026, P2B-15): 70/10/10/10 gave A, A, A, A, because a run of
// equal values took the class of its first SKU, so a whole tail could join class A and A carried 100 % of the value.
// Each SKU is now classed by the cumulative share before it (the crossing rule), equal values taken in SKU code order,
// so the result never depends on the order of the rows; the page says when equal values fall on both sides of a limit.
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { openTool } = require('./helpers/tool-page.cjs');

const plain = (value) => JSON.parse(JSON.stringify(value));
const classes = (M, values, options) => plain(M.abc(values.map(([key, value]) => ({ key, value })), options)).map((item) => [item.key, item.cls]);

test('ties: each SKU by the share before it, equal values in SKU code order, never by row order', () => {
  const M = openTool('inventory-abc').InventoryAbcMath;
  // 70/10/10/10: before each 0 %, 70 %, 80 %, 90 % → A, A, B, B. Class A holds 80 % of the value, not 100 %.
  assert.deepEqual(classes(M, [['w', 70], ['z', 10], ['x', 10], ['y', 10]]), [['w', 'A'], ['x', 'A'], ['y', 'B'], ['z', 'B']]);
  // The same SKUs in any row order give the same classes.
  assert.deepEqual(classes(M, [['y', 10], ['x', 10], ['z', 10], ['w', 70]]), [['w', 'A'], ['x', 'A'], ['y', 'B'], ['z', 'B']]);
  // 70/5/5/5/5/5/5: before 0, 70, 75, 80, 85, 90, 95 % → A, A, A, B, B, B, C: one run of equal values over three classes.
  assert.deepEqual(classes(M, [['a', 70], ...'bcdefg'.split('').map((key) => [key, 5])]).map(([, cls]) => cls).join(''), 'AAABBBC');
  // Ten equal SKUs: 10 % each, A while the share before is under 80 %, B under 95 %, C from there.
  const ten = classes(M, [...'abcdefghij'].map((key) => [key, 1]));
  assert.deepEqual(ten.map(([, cls]) => cls).join(''), 'AAAAAAAABB');
  // 50, 30, 10, 5, 5: d starts at 90 % (B), e at 95 % (C).
  assert.deepEqual(classes(M, [['e', 5], ['d', 5], ['a', 50], ['b', 30], ['c', 10]]), [['a', 'A'], ['b', 'A'], ['c', 'B'], ['d', 'B'], ['e', 'C']]);
  // The SKUs of a run of equal values that ends up in more than one class.
  assert.deepEqual(plain(M.splitTies(M.abc([['w', 70], ['z', 10], ['x', 10], ['y', 10]].map(([key, value]) => ({ key, value }))))).map((item) => item.key), ['x', 'y', 'z']);
  assert.deepEqual(plain(M.splitTies(M.abc([{ key: 'a', value: 50 }, { key: 'b', value: 30 }, { key: 'c', value: 20 }]))), []);
});

for (const [lang, said] of [['en', /3 SKUs of equal value fall on both sides of a class limit/], ['de', /3 Artikel mit gleichem Wert liegen beiderseits einer Klassengrenze/], ['sq', /3 artikuj me vlerë të njëjtë bien në të dy anët e një kufiri klase/]]) {
  test(`${lang}: the page classes the tail A, A, B, B and says the equal values were split`, () => {
    const key = lang === 'en' ? 'sc-inventory-abc' : `sc-inventory-abc-${lang}`;
    // Annual value = mean demand × periods × cost: the same demand, costs 70, 10, 10, 10.
    const rows = [['W-1', 70], ['Z-4', 10], ['X-2', 10], ['Y-3', 10]].map(([sku, cost]) => ({ sku, name: sku, cost, demand: [5, 5, 5, 5] }));
    const w = openTool('inventory-abc', { lang, storage: { [key]: { rows, periods: ['P1', 'P2', 'P3', 'P4'] } } });
    const results = w.document.querySelector('[data-results]');
    assert.equal(results.hidden, false);
    const text = results.textContent;
    assert.match(text, said);
    assert.match(text, /X-2 A, Y-3 B, Z-4 B/, 'the equal SKUs in code order, each with its class: W-1 and X-2 are A, not all four');
  });
}
