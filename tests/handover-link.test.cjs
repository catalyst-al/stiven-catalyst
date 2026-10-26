// Shift Handover, "Send to the next shift" (src/js/shift-handover.js, window.ShiftHandoverLink): a handover packed into
// the fragment of a link, gzipped and in base64url, opens again as the same handover; a damaged or foreign fragment is
// refused; the link of a typical handover fits a QR code (team-sync.js, up to 2331 bytes).
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const context = {
  window: {},
  document: { querySelector: () => null, getElementById: () => null, currentScript: null },
  TextEncoder, TextDecoder, Blob, Response, CompressionStream, DecompressionStream, URL, btoa, atob, crypto: globalThis.crypto, navigator: {},
};
vm.runInNewContext(fs.readFileSync('src/js/shift-handover.js', 'utf8'), context);
vm.runInNewContext(fs.readFileSync('src/js/team-sync.js', 'utf8'), context);
const Link = context.window.ShiftHandoverLink;
const M = context.window.TeamSyncMath;
const data = JSON.parse(fs.readFileSync('src/_data/shiftHandover.json', 'utf8'));
const plain = (value) => JSON.parse(JSON.stringify(value));

const handover = {
  template: 'warehouse', date: '2026-10-26', shift: 'Late', area: 'Outbound, docks 1–6', from: 'Arben', to: '', ackAt: '2026-10-26T13:00:00.000Z',
  metrics: [['Units handled', '4 820', ''], ['Backlog at handover', '120', 'two late trailers'], ['Damage %', '0,4', '']],
  issues: [{ text: 'Dock 4 door jams at the top; maintenance ticket open', priority: 'High', owner: 'Maintenance', due: '2026-10-27', done: false, carried: 1 },
    { text: 'Scanner 7 battery swollen, taken out of use', priority: 'Medium', owner: 'Team lead', due: '', done: true, carried: 0 }],
  headsUp: 'Carrier X arrives 30 min early tomorrow.\nNew temp starts 06:00, needs a buddy.',
  safety: 'Wet floor by dock 2 after the leak; cones are out.',
  checks: [true, true, false, true, false, false],
};

test('a handover packed into a fragment opens again as the same handover, gzipped', async () => {
  const fragment = await Link.packHandover(handover, new Date('2026-10-26T14:00:00Z'));
  assert.match(fragment, /^h=[A-Za-z0-9_-]+$/, 'gzipped, base64url, nothing to escape in an address');
  const back = await Link.unpackHandover(`#${fragment}`);
  assert.deepEqual(plain(back), { sent: '2026-10-26T14:00:00.000Z', handover });
  assert.deepEqual(plain(await Link.unpackHandover(fragment)), plain(back), 'with or without the #');
  const link = await Link.handoverLink(handover, 'https://stivencatalyst.com/sq/tools/shift-handover/?issue=old#h=older', new Date());
  assert.ok(link.startsWith('https://stivencatalyst.com/sq/tools/shift-handover/?issue=old#h='), 'the page keeps its address, an older fragment is replaced');
});

test('the plain form is read too, and anything else is refused', async () => {
  const plainFragment = `h0=${Link.toBase64Url(new TextEncoder().encode(JSON.stringify({ format: Link.LINK_FORMAT, version: 1, sent: 'x', handover })))}`;
  assert.deepEqual(plain((await Link.unpackHandover(plainFragment)).handover), handover);
  assert.deepEqual(plain([...Link.fromBase64Url(Link.toBase64Url(Uint8Array.from([0, 251, 255, 62, 63])))]), [0, 251, 255, 62, 63]);
  for (const bad of ['', '#', '#x=abc', '#h=', '#h=not base64!', '#h0=aGVsbG8', `#h0=${Link.toBase64Url(new TextEncoder().encode('{"format":"other","version":1,"handover":{}}'))}`,
    `#h0=${Link.toBase64Url(new TextEncoder().encode(JSON.stringify({ format: Link.LINK_FORMAT, version: 2, handover })))}`,
    `#h0=${Link.toBase64Url(new TextEncoder().encode(JSON.stringify({ format: Link.LINK_FORMAT, version: 1, handover: [] })))}`,
    '#h=AAAA']) {
    assert.equal(await Link.unpackHandover(bad), null, JSON.stringify(bad));
  }
});

test('the link of the example shift and of a full handover fit a QR code', async () => {
  const ex = data.example;
  const example = { template: ex.template, date: ex.date, shift: ex.shift, area: ex.area, from: ex.from, to: ex.to, metrics: ex.metrics, issues: ex.issues, headsUp: ex.headsUp, safety: ex.safety, checks: ex.checks, ackAt: '' };
  for (const h of [example, handover]) {
    const link = await Link.handoverLink(h, 'https://stivencatalyst.com/tools/shift-handover/', new Date());
    assert.ok(link.length <= 2331, `${link.length} bytes fit version 40 at level M`);
    const qr = M.qrEncode(link);
    assert.ok(qr && qr.version <= 40, 'drawn as a QR code');
  }
  // Ten long open issues still fit.
  const long = { ...handover, issues: Array.from({ length: 10 }, (_, i) => ({ text: `Issue ${i}: ${'a problem described in a full sentence with its context '.repeat(2)}`, priority: 'High', owner: 'Someone responsible', due: '2026-10-30', done: false, carried: 0 })) };
  const link = await Link.handoverLink(long, 'https://stivencatalyst.com/tools/shift-handover/', new Date());
  assert.ok(M.qrEncode(link), `${link.length} bytes still fit`);
});
