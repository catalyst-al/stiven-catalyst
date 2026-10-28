// Shift Handover, "Send to the next shift" (src/js/shift-handover.js, window.ShiftHandoverLink): a handover sealed
// with a transfer code (PBKDF2 → AES-GCM) opens again as the same handover with that code and with no other; a
// changed byte, a foreign fragment or a bomb is refused; the old plain links (version 1) are still read; the link of a
// typical handover fits a QR code (team-sync.js, up to 2331 bytes); the confirmation code, what looks personal, and
// the merge of the issues with the ones already open on the receiving device.
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
const HREF = 'https://stivencatalyst.com/tools/shift-handover/';
const CODE = 'acid-acorn-acre-acts';

// Fictional: a warehouse late shift.
const handover = {
  template: 'warehouse', date: '2026-10-26', shift: 'Late', area: 'Outbound, docks 1–6', from: 'Arben', to: '', ackAt: '2026-10-26T13:00:00.000Z',
  metrics: [['Units handled', '4 820', ''], ['Backlog at handover', '120', 'two late trailers'], ['Damage %', '0,4', '']],
  issues: [{ text: 'Dock 4 door jams at the top; maintenance ticket open', priority: 'High', owner: 'Maintenance', due: '2026-10-27', done: false, carried: 1 },
    { text: 'Scanner 7 battery swollen, taken out of use', priority: 'Medium', owner: 'Team lead', due: '', done: true, carried: 0 }],
  headsUp: 'Carrier X arrives 30 min early tomorrow.\nNew temp starts 06:00, needs a buddy.',
  safety: 'Wet floor by dock 2 after the leak; cones are out.',
  checks: [true, true, false, true, false, false],
};

test('a sealed handover opens again with its code, and with no other; a changed byte opens nothing', async () => {
  const made = await Link.packHandover(handover, CODE, { id: 'test-id-1', now: new Date('2026-10-26T14:00:00Z') });
  assert.equal(made.id, 'test-id-1');
  assert.match(made.fragment, /^h2=[A-Za-z0-9_-]+$/, 'version 2, base64url, nothing to escape in an address');
  assert.equal(made.bytes[0], 2);
  const text = Buffer.from(made.bytes).toString('latin1');
  assert.ok(!/Arben|Dock 4|Carrier/.test(text) && !/stiven-catalyst/.test(text), 'nothing readable in the sealed bytes');
  const back = await Link.openHandover(made.bytes, CODE);
  assert.deepEqual(plain(back), { id: 'test-id-1', sent: '2026-10-26T14:00:00.000Z', handover });
  // The code is read without case, spaces or hyphens.
  assert.deepEqual(plain((await Link.openHandover(made.bytes, 'Acid Acorn ACRE acts')).handover), handover);
  assert.equal((await Link.openHandover(made.bytes, 'acid-acorn-acre-act')).error, 'wrong');
  for (const at of [5, 20, 40, made.bytes.length - 1]) {
    const damaged = Uint8Array.from(made.bytes);
    damaged[at] ^= 1;
    assert.equal((await Link.openHandover(damaged, CODE)).error, 'wrong', `byte ${at} changed`);
  }
  assert.equal((await Link.openHandover(Uint8Array.from([1, 2, 3]), CODE)).error, 'invalid');
  assert.equal((await Link.openHandover(Uint8Array.from([2, ...new Array(60).fill(0)]), CODE)).error, 'wrong');
  // Two seals of the same handover differ (a fresh salt and IV each time) and both open.
  const again = await Link.packHandover(handover, CODE);
  assert.notEqual(again.fragment, made.fragment);
  assert.notEqual(again.id, made.id, 'a new transfer id each time');
  assert.deepEqual(plain((await Link.openHandover(again.bytes, CODE)).handover), handover);
});

test('the link carries the sealed bytes after #h2=, keeps the page address and replaces an older fragment', async () => {
  const { link, bytes, id } = await Link.handoverLink(handover, CODE, 'https://stivencatalyst.com/sq/tools/shift-handover/?issue=old#h=older');
  assert.ok(link.startsWith('https://stivencatalyst.com/sq/tools/shift-handover/?issue=old#h2='));
  const parsed = Link.parseFragment(new URL(link).hash);
  assert.equal(parsed.kind, 'sealed');
  assert.deepEqual([...parsed.bytes], [...bytes]);
  assert.equal((await Link.openHandover(parsed.bytes, CODE)).id, id);
  // What else an address can carry.
  assert.equal(Link.parseFragment('#h=AAAA').kind, 'plain');
  assert.equal(Link.parseFragment('#h0=AAAA').kind, 'plain');
  assert.deepEqual(plain(Link.parseFragment(`#${Link.ackFragment('abc-123', 'ABC-DEF', 'Lena Krasniqi')}`)), { kind: 'ack', id: 'abc-123', code: 'ABCDEF', by: 'Lena Krasniqi' });
  assert.deepEqual(plain(Link.parseFragment('#a=abc.abcdef')), { kind: 'ack', id: 'abc', code: 'ABCDEF', by: '' });
  for (const bad of ['', '#', '#x=abc', '#h2=', '#h2=not base64!', `#h2=${'A'.repeat(Link.MAX_FRAGMENT + 8)}`, '#a=abc.12345']) assert.equal(Link.parseFragment(bad), null, JSON.stringify(bad));
});

test('a handover file holds the same sealed bytes; anything else is not a handover file', async () => {
  const made = await Link.packHandover(handover, CODE);
  const text = Link.fileText(made.bytes, { date: '2026-10-26', shift: 'Late', sent: '2026-10-26T14:00:00.000Z' });
  const file = JSON.parse(text);
  assert.equal(file.format, Link.FILE_FORMAT);
  assert.equal(file.version, 2);
  assert.equal(file.shift, 'Late');
  assert.ok(!text.includes('Arben'), 'the file is as unreadable as the link');
  assert.deepEqual([...Link.bytesFromFile(text)], [...made.bytes]);
  assert.deepEqual(plain((await Link.openHandover(Link.bytesFromFile(text), CODE)).handover), handover);
  for (const bad of ['', 'x', '{}', JSON.stringify({ format: 'other', version: 2, data: file.data }), JSON.stringify({ ...file, version: 1 }), JSON.stringify({ ...file, data: 'not base64!' }), 'x'.repeat(Link.MAX_FILE + 1)]) {
    assert.equal(Link.bytesFromFile(bad), null, bad.slice(0, 30));
  }
});

test('transfer codes: four words of the list when it is there, letters and digits otherwise, at least eight characters', () => {
  const words = Link.newPasscode(M.WORDS);
  assert.match(words, /^[a-z]+-[a-z]+-[a-z]+-[a-z]+$/);
  assert.ok(words.split('-').every((w) => M.WORDS.includes(w)));
  const letters = Link.newPasscode(null);
  assert.match(letters, /^[abcdefghjkmnpqrstuvwxyz23456789]{10}$/, 'no 0, 1, i, l or o');
  assert.notEqual(Link.newPasscode(M.WORDS), words);
  assert.ok(Link.goodPasscode('acid-acorn') && Link.goodPasscode('12345678') && !Link.goodPasscode('1234567') && !Link.goodPasscode('a b c') && !Link.goodPasscode(''));
  assert.equal(Link.normalisePasscode('  Acid-ACORN  acre_acts '), 'acid acorn acre acts');
});

test('the confirmation code comes from the transfer id and the code, and only from both', async () => {
  const code = await Link.ackCode('test-id-1', CODE);
  assert.match(code, /^[A-Z2-7]{6}$/);
  assert.equal(await Link.ackCode('test-id-1', 'ACID acorn-acre acts'), code, 'the code as typed, read the same way');
  assert.notEqual(await Link.ackCode('test-id-2', CODE), code);
  assert.notEqual(await Link.ackCode('test-id-1', 'acid-acorn-acre-acid'), code);
  assert.equal(Link.showAck(code), `${code.slice(0, 3)}-${code.slice(3)}`);
  assert.equal(Link.readAck(` ${code.slice(0, 3).toLowerCase()}-${code.slice(3)} `), code);
});

test('what looks personal is found: emails, phone numbers, card numbers, IBANs; room numbers and quantities are not', () => {
  const found = Link.sensitiveFindings({
    area: 'Reception', headsUp: 'Call Mr Hoxha back on +49 170 1234567 about room 412.', safety: 'Card 4111 1111 1111 1111 left at the desk',
    metrics: [['Rooms', '180', 'IBAN DE89 3704 0044 0532 0130 00 on the invoice'], ['Units', '18,400', 'target 18,000']],
    issues: [{ text: 'Guest asks for a copy: anna.m@example.com', owner: 'Front office' }, { text: 'Dock 4 door jams', owner: 'Maintenance' }],
  });
  assert.deepEqual(plain(found.map((f) => [f.field, f.kind])), [['headsUp', 'phone'], ['safety', 'card'], ['metrics', 'iban'], ['issues', 'email']]);
  assert.ok(found.every((f) => f.sample.length <= 40));
  assert.deepEqual(plain(Link.sensitiveFindings(handover)), [], 'the fictional warehouse shift: nothing');
  assert.deepEqual(plain(Link.sensitiveFindings({ headsUp: 'Room 1204, 2 pax, 18:00; backlog 1 200 units' })), [], 'rooms, counts and times are not phone numbers');
});

test('for the transfer the names are left out unless asked, and the device\'s own records never travel', () => {
  const h = { ...handover, shared: [{ id: 'x' }], ack: { id: 'x' }, received: { id: 'y' } };
  const bare = Link.forTransfer(h);
  assert.equal(bare.from, '');
  assert.equal(bare.to, '');
  assert.deepEqual(bare.issues.map((issue) => issue.owner), ['', '']);
  assert.ok(!('shared' in bare) && !('ack' in bare) && !('received' in bare) && !('ackAt' in bare));
  assert.equal(bare.headsUp, handover.headsUp);
  const named = Link.forTransfer(h, { names: true });
  assert.equal(named.from, 'Arben');
  assert.deepEqual(named.issues.map((issue) => issue.owner), ['Maintenance', 'Team lead']);
});

test('the issues of a received handover beside the ones open here: new, the same, and the ones kept from here', () => {
  const incoming = [
    { text: 'Dock 4 door jams at the top; maintenance ticket open', priority: 'High', owner: '', due: '2026-10-27', done: false, carried: 1 },
    { text: 'New temp needs a scanner login', priority: 'Medium', owner: '', due: '', done: false, carried: 0 },
  ];
  const here = [
    { text: 'DOCK 4 door jams at the top;  maintenance ticket open', priority: 'High', owner: 'Maintenance', due: '2026-10-27', done: false, carried: 2 },
    { text: 'Pallet wrap running low', priority: 'Low', owner: 'Lena', due: '', done: false, carried: 0 },
  ];
  const merged = Link.mergeIssues(incoming, here);
  assert.deepEqual(plain(merged.issues.map((issue) => [issue.text.slice(0, 12), issue.kept, issue.carried])), [['Dock 4 door ', false, 2], ['New temp nee', false, 0], ['Pallet wrap ', true, 0]]);
  assert.deepEqual([merged.added, merged.same, merged.kept], [1, 1, 1]);
  assert.deepEqual(plain(Link.mergeIssues(incoming, [])), { issues: incoming.map((issue) => ({ ...issue, kept: false })), added: 2, same: 0, kept: 0 });
  assert.deepEqual(plain(Link.mergeIssues([], []).issues), []);
});

test('the old plain link is still read, and a bomb or a foreign fragment is refused without unpacking it all', async () => {
  const zlib = require('node:zlib');
  const fragment = (json) => `#h=${Link.toBase64Url(zlib.gzipSync(Buffer.from(JSON.stringify(json))))}`;
  const wrap = (h) => ({ format: Link.LINK_FORMAT, version: 1, sent: 'x', handover: h });
  assert.deepEqual(plain((await Link.unpackHandover(fragment(wrap(handover)))).handover), handover);
  const plainFragment = `#h0=${Link.toBase64Url(new TextEncoder().encode(JSON.stringify(wrap(handover))))}`;
  assert.deepEqual(plain((await Link.unpackHandover(plainFragment)).handover), handover);
  const bomb = `#h=${Link.toBase64Url(zlib.gzipSync(Buffer.concat([Buffer.from(`{"format":"${Link.LINK_FORMAT}","version":1,"handover":{"headsUp":"`), Buffer.alloc(50 * 1024 * 1024, 32), Buffer.from('"}}')])))}`;
  const started = Date.now();
  assert.equal(await Link.unpackHandover(bomb), null);
  assert.ok(Date.now() - started < 2000, `refused in ${Date.now() - started} ms`);
  assert.equal(await Link.unpackHandover(fragment(wrap({ ...handover, headsUp: 'x'.repeat(Link.MAX_UNPACKED) }))), null);
  assert.equal(await Link.unpackHandover(`#h0=${'A'.repeat(Link.MAX_FRAGMENT + 4)}`), null);
  for (const bad of ['', '#', '#x=abc', '#h=', '#h0=aGVsbG8', `#h0=${Link.toBase64Url(new TextEncoder().encode('{"format":"other","version":1,"handover":{}}'))}`]) assert.equal(await Link.unpackHandover(bad), null, bad);
  // A sealed bomb: the cap holds after the decryption too.
  const sealedBomb = await Link.packHandover({ ...handover, headsUp: ' '.repeat(Link.MAX_UNPACKED + 10) }, CODE);
  assert.ok(sealedBomb.bytes.length < 4000, 'small on the wire');
  assert.equal((await Link.openHandover(sealedBomb.bytes, CODE)).error, 'invalid');
});

test('the sealed link of the example shift and of a full handover fit a QR code; a long one goes as a file', async () => {
  const ex = data.example;
  const example = { template: ex.template, date: ex.date, shift: ex.shift, area: ex.area, from: ex.from, to: ex.to, metrics: ex.metrics, issues: ex.issues, headsUp: ex.headsUp, safety: ex.safety, checks: ex.checks, ackAt: '' };
  for (const h of [example, handover]) {
    const { link } = await Link.handoverLink(Link.forTransfer(h, { names: true }), CODE, HREF);
    assert.ok(link.length <= 2331, `${link.length} bytes fit version 40 at level M`);
    assert.ok(M.qrEncode(link), 'drawn as a QR code');
  }
  const long = { ...handover, issues: Array.from({ length: 10 }, (_, i) => ({ text: `Issue ${i}: ${'a problem described in a full sentence with its context '.repeat(2)}`, priority: 'High', owner: 'Someone responsible', due: '2026-10-30', done: false, carried: 0 })) };
  const { link } = await Link.handoverLink(long, CODE, HREF);
  assert.ok(M.qrEncode(link), `${link.length} bytes still fit`);
  // Forty issues of different words each (repeated text would gzip into a code).
  const longer = { ...handover, issues: Array.from({ length: 40 }, (_, i) => ({ text: `Issue ${i}: ${M.WORDS.slice(i * 30, i * 30 + 30).join(' ')}`, priority: 'High', owner: 'Team lead', due: '2026-10-30', done: false, carried: 0 })) };
  const big = await Link.handoverLink(longer, CODE, HREF);
  assert.equal(M.qrEncode(big.link), null, 'too long for a code');
  assert.ok(Link.bytesFromFile(Link.fileText(big.bytes, {})), 'but a file');
});

test('a handover from an old link is shown as text: markup in its fields never becomes part of the page', { skip: !fs.existsSync('_site/tools/shift-handover/index.html') }, async () => {
  const { JSDOM } = require('jsdom');
  const zlib = require('node:zlib');
  const evil = '<img src=x onerror="window.pwned=1"><script>window.pwned=2</script>';
  const h = { ...handover, from: evil, shift: evil, area: evil, headsUp: evil, safety: evil, metrics: [[evil, evil, evil]], issues: [{ text: evil, priority: evil, owner: evil, due: evil, done: false, carried: 0 }] };
  const fragmentText = `h=${Link.toBase64Url(zlib.gzipSync(Buffer.from(JSON.stringify({ format: Link.LINK_FORMAT, version: 1, sent: 'x', handover: h }))))}`;
  const html = fs.readFileSync('_site/tools/shift-handover/index.html', 'utf8').replace(/<script\b[^>]*\bsrc=[^>]*><\/script>/g, '');
  const dom = new JSDOM(html, { url: `https://example.test/tools/shift-handover/#${fragmentText}`, runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  Object.assign(w, { CompressionStream, DecompressionStream, Blob, Response, TextEncoder, TextDecoder });
  w.HTMLElement.prototype.scrollIntoView = () => {};
  w.confirm = () => true;
  for (const file of ['tool-kit', 'shift-handover']) w.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  const box = w.document.querySelector('[data-incoming]');
  for (let i = 0; i < 100 && box.hidden; i++) await new Promise((r) => setTimeout(r, 10));
  assert.equal(box.hidden, false, 'the handover is offered');
  assert.match(w.document.querySelector('[data-incoming-note]').textContent, /older version/, 'said to be an old plain link');
  box.querySelector('[data-incoming-open]').click();
  await new Promise((r) => setTimeout(r, 20));
  assert.equal(w.pwned, undefined);
  assert.equal(w.document.querySelectorAll('img[src="x"]').length + [...w.document.querySelectorAll('script')].filter((s) => s.textContent.includes('pwned')).length, 0, 'no element from the link');
  assert.match(w.document.querySelector('[data-handover]').textContent + [...w.document.querySelectorAll('input, textarea')].map((field) => field.value).join(' '), /<img src=x onerror=/, 'the markup is there as text');
  assert.equal(w.location.hash, '', 'the handover leaves the address once opened');
});
