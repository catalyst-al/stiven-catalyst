// "All your work in one file" sealed with a password (src/js/work-backup.js): the sealed text holds nothing readable,
// opens again as the same plain file with its password and with no other, and a changed byte or a foreign text is
// refused. The dialog and the download are checked in the browser (tests/browser/work-backup-sealed.spec.mjs).
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const context = {
  window: {},
  document: { querySelector: () => null, getElementById: () => null, currentScript: null },
  TextEncoder, TextDecoder, Blob, Response, CompressionStream, DecompressionStream, URL, btoa, atob, crypto: globalThis.crypto, navigator: {},
};
vm.runInNewContext(fs.readFileSync('src/js/work-backup.js', 'utf8'), context);
const { WorkBackup } = context.window;

const plainFile = JSON.stringify({ format: 'stiven-catalyst-work', version: 1, exported: '2026-10-28T10:00:00.000Z', items: { 'sc-shift-handover': JSON.stringify({ current: { from: 'Arben', area: 'Outbound' }, history: [] }), 'sc-five-whys': '{"problem":"Dock 4 door jams, ëçäöü €"}' } });

test('the sealed file is unreadable, and opens again as the same file with its password', async () => {
  const sealed = await WorkBackup.sealBackupText(plainFile, 'night-shift-2026', new Date('2026-10-28T10:00:00Z'));
  const file = JSON.parse(sealed);
  assert.equal(file.format, WorkBackup.SEALED_FORMAT);
  assert.equal(file.version, 1);
  assert.equal(file.exported, '2026-10-28T10:00:00.000Z');
  assert.ok(!sealed.includes('Arben') && !sealed.includes('sc-shift-handover') && !sealed.includes('Dock 4'), 'nothing readable');
  assert.ok(WorkBackup.isSealedText(sealed) && !WorkBackup.isSealedText(plainFile) && !WorkBackup.isSealedText('x'));
  const opened = await WorkBackup.openSealedText(sealed, 'night-shift-2026');
  assert.equal(opened.text, plainFile);
  assert.equal(opened.exported, '2026-10-28T10:00:00.000Z');
  // The plain file it holds is a work file the box reads as it did before.
  const backup = WorkBackup.readBackup(opened.text);
  assert.deepEqual(Object.keys(backup.items).sort(), ['sc-five-whys', 'sc-shift-handover']);
  // The same password spelled with other Unicode forms (NFKC) still opens it; two seals differ (fresh salt and IV).
  assert.equal((await WorkBackup.openSealedText(sealed, 'night-shift-2026'.normalize('NFKD'))).text, plainFile);
  const again = await WorkBackup.sealBackupText(plainFile, 'night-shift-2026');
  assert.notEqual(JSON.parse(again).data, file.data);
  assert.equal((await WorkBackup.openSealedText(again, 'night-shift-2026')).text, plainFile);
});

test('a wrong password, a changed byte, or a text that is not a sealed file: refused, nothing thrown', async () => {
  const sealed = await WorkBackup.sealBackupText(plainFile, 'night-shift-2026');
  assert.equal((await WorkBackup.openSealedText(sealed, 'night-shift-2027')).error, 'wrong');
  assert.equal((await WorkBackup.openSealedText(sealed, '')).error, 'wrong');
  const file = JSON.parse(sealed);
  const bytes = Buffer.from(file.data, 'base64');
  bytes[Math.floor(bytes.length / 2)] ^= 1;
  assert.equal((await WorkBackup.openSealedText(JSON.stringify({ ...file, data: bytes.toString('base64') }), 'night-shift-2026')).error, 'wrong');
  assert.equal((await WorkBackup.openSealedText(JSON.stringify({ ...file, salt: Buffer.alloc(16).toString('base64') }), 'night-shift-2026')).error, 'wrong');
  for (const bad of ['', 'x', '{}', plainFile, JSON.stringify({ ...file, format: 'other' }), JSON.stringify({ ...file, version: 2 }), JSON.stringify({ ...file, data: 7 })]) {
    assert.equal((await WorkBackup.openSealedText(bad, 'night-shift-2026')).error, 'invalid', bad.slice(0, 30));
  }
  assert.ok(WorkBackup.goodPassword('12345678') && !WorkBackup.goodPassword('1234567') && !WorkBackup.goodPassword('   ') && !WorkBackup.goodPassword(null));
  assert.equal(WorkBackup.MIN_PASSWORD, 8);
});

test('a sealed file that inflates past the limit is refused while it is read, not after it fills the memory', async () => {
  // 48 MB of zeros gzip to a few tens of KB; the limit is 40 MB. A DecompressionStream that counts what it hands on
  // shows the reading stopped before the end.
  let handed = 0;
  class Counting extends DecompressionStream {
    get readable() { return super.readable.pipeThrough(new TransformStream({ transform(chunk, controller) { handed += chunk.length; controller.enqueue(chunk); } })); }
  }
  const counting = { ...context, window: {}, DecompressionStream: Counting };
  vm.runInNewContext(fs.readFileSync('src/js/work-backup.js', 'utf8'), counting);
  const big = 48 * 1024 * 1024;
  const sealed = await counting.window.WorkBackup.sealBackupText('\0'.repeat(big), 'night-shift-2026');
  assert.ok(sealed.length < 1024 * 1024, `the sealed file is small (${sealed.length} bytes)`);
  const opened = await counting.window.WorkBackup.openSealedText(sealed, 'night-shift-2026');
  assert.equal(opened.error, 'invalid');
  assert.ok(handed > 40 * 1024 * 1024 && handed < big, `stopped after ${handed} of ${big} bytes`);
  // The same stream opens a file within the limit as before.
  const fine = await counting.window.WorkBackup.sealBackupText(plainFile, 'night-shift-2026');
  assert.equal((await counting.window.WorkBackup.openSealedText(fine, 'night-shift-2026')).text, plainFile);
});
