// The build step that gives letter pairs their space in the display titles (lib/display-pairs.js).
const { test } = require('node:test');
const assert = require('node:assert/strict');

const load = () => import('../lib/display-pairs.js');

test('the first letter of a pair whose bars would touch is wrapped, in any case', async () => {
  const { markPairs } = await load();
  assert.equal(markPairs('<h1>Shift Lead</h1>'), '<h1>Shi<k-p class="kp2">f</k-p>t Lead</h1>');
  assert.equal(markPairs('<h2 class="x">SAFETY</h2>'), '<h2 class="x">SAF<k-p class="kp1">E</k-p><k-p class="kp4">T</k-p>Y</h2>');
});

test('only headings, strong labels and elements marked data-pairs are touched', async () => {
  const { markPairs } = await load();
  assert.equal(markPairs('<p>Shift</p><div>into</div>'), '<p>Shift</p><div>into</div>');
  assert.equal(markPairs('<strong>Lift</strong>'), '<strong>Li<k-p class="kp2">f</k-p>t</strong>');
  assert.equal(markPairs('<div class="m" data-pairs><span>into</span></div>'), '<div class="m" data-pairs><span>in<k-p class="kp1">t</k-p>o</span></div>');
});

test('tags, attributes, entities, scripts and styles stay as they are', async () => {
  const { markPairs } = await load();
  assert.equal(markPairs('<h2><a href="/after/" title="Shift">Ok</a> Verspätungs&shy;analyse &amp; mehr</h2>'), '<h2><a href="/after/" title="Shift">Ok</a> Verspätungs&shy;analyse &amp; mehr</h2>');
  const script = '<script>el.innerHTML = "<strong>Shift</strong>";</script><style>h1::after{content:"ft"}</style>';
  assert.equal(markPairs(script + '<h1>Lift</h1>'), script + '<h1>Li<k-p class="kp2">f</k-p>t</h1>');
});

test('the text read by search and screen readers does not change', async () => {
  const { markPairs } = await load();
  const text = (html) => html.replace(/<[^>]+>/g, '');
  const html = '<h1>Lead one shift with clarity. Quality, safety, Zentrale, Verspätungs&shy;analyse</h1>';
  assert.equal(text(markPairs(html)), text(html));
});
