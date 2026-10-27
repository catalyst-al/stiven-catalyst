const { test, before } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const zlib = require('node:zlib');
const { openTool, settle, click } = require('./helpers/tool-page.cjs');

// A .docx or .xlsx file is a zip, and a zip can unpack to far more than it weighs: 195 KB of deflate hold 200 MB of
// spaces (audit P2C-06), which the page then read as one text and froze on for minutes. Every reader of these files
// (ATS CV import, Pareto, Inventory ABC, CX Control Tower) goes through CvImport.unzip, so the limits sit there.
const context = {
  window: {},
  document: { documentElement: { lang: 'en' }, querySelector: () => null, getElementById: () => null, currentScript: null },
  TextEncoder, TextDecoder, Blob, Response, DecompressionStream, URL, Intl,
};
for (const file of ['tool-kit', 'docx-kit', 'cv-import', 'ats-cv', 'pareto']) {
  vm.runInNewContext(fs.readFileSync(`src/js/${file}.js`, 'utf8'), context);
}
const { CvImport, Pareto, AtsCv, ToolKit } = context.window;
const plain = (value) => JSON.parse(JSON.stringify(value));
const atsData = JSON.parse(fs.readFileSync('src/_data/atsCv.json', 'utf8'));

// A zip written here entry by entry, deflated by node's zlib. `declared` sets the uncompressed size the central
// directory states (a zip may lie about it); by default it is the true one.
const makeZip = (entries) => {
  const locals = [];
  const central = [];
  let offset = 0;
  for (const { name, data, declared, store } of entries) {
    const nameBytes = Buffer.from(name);
    const body = store ? data : zlib.deflateRawSync(data, { level: 9 });
    const crc = zlib.crc32(data);
    const size = declared ?? data.length;
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(store ? 0 : 8, 8);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(body.length, 18);
    local.writeUInt32LE(size, 22);
    local.writeUInt16LE(nameBytes.length, 26);
    locals.push(local, nameBytes, body);
    const head = Buffer.alloc(46);
    head.writeUInt32LE(0x02014b50, 0);
    head.writeUInt16LE(20, 4);
    head.writeUInt16LE(20, 6);
    head.writeUInt16LE(store ? 0 : 8, 10);
    head.writeUInt32LE(crc, 16);
    head.writeUInt32LE(body.length, 20);
    head.writeUInt32LE(size, 24);
    head.writeUInt16LE(nameBytes.length, 28);
    head.writeUInt32LE(offset, 42);
    central.push(head, nameBytes);
    offset += 30 + nameBytes.length + body.length;
  }
  const dir = Buffer.concat(central);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(Math.min(entries.length, 0xffff), 8);
  end.writeUInt16LE(Math.min(entries.length, 0xffff), 10);
  end.writeUInt32LE(dir.length, 12);
  end.writeUInt32LE(offset, 16);
  const out = Buffer.concat([...locals, dir, end]);
  return out.buffer.slice(out.byteOffset, out.byteOffset + out.byteLength);
};

const WORD = '<?xml version="1.0"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:t>';
const WORD_END = '</w:t></w:r></w:p></w:body></w:document>';
// 200 MB of spaces in document.xml: about 195 KB on disk, like the audit's bomb.docx.
let bombXml;
before(() => { bombXml = Buffer.concat([Buffer.from(WORD), Buffer.alloc(200e6, 0x20), Buffer.from(WORD_END)]); });
const bombDocx = (declared) => makeZip([
  { name: '[Content_Types].xml', data: Buffer.from('<Types/>') },
  { name: 'word/document.xml', data: bombXml, declared },
]);
// The same 200 MB as the one sheet of a workbook.
const bombXlsx = (declared) => makeZip([
  { name: 'xl/workbook.xml', data: Buffer.from('<workbook><sheets><sheet name="Data" sheetId="1" r:id="rId1"/></sheets></workbook>') },
  { name: 'xl/_rels/workbook.xml.rels', data: Buffer.from('<Relationships><Relationship Id="rId1" Target="worksheets/sheet1.xml"/></Relationships>') },
  { name: 'xl/worksheets/sheet1.xml', data: Buffer.concat([Buffer.from('<worksheet><sheetData><row r="1"><c r="A1" t="inlineStr"><is><t>'), bombXml.subarray(WORD.length), Buffer.from('</t></is></c></row></sheetData></worksheet>')]), declared },
]);

// Resolves to the error the promise rejects with, and how long that took.
const refusal = async (promise) => {
  const start = Date.now();
  try {
    const value = await promise;
    return { error: null, ms: Date.now() - start, value };
  } catch (error) {
    return { error, ms: Date.now() - start };
  }
};

test('a Word file whose text unpacks to 200 MB is refused at once when the zip states its size', async () => {
  const { error, ms, value } = await refusal(CvImport.readDocx(new File([bombDocx()], 'bomb.docx')));
  assert.equal(value, undefined, `unpacked ${value?.length} lines instead of refusing`);
  assert.equal(error?.message, 'zip-size');
  assert.ok(ms < 2000, `took ${ms} ms`);
});

test('a Word file that understates its size is stopped while it unpacks, not after', async () => {
  const { error, ms, value } = await refusal(CvImport.unzip(bombDocx(4000), 'word/document.xml'));
  assert.equal(value, undefined, `unpacked ${value?.length} characters instead of refusing`);
  assert.equal(error?.message, 'zip-size');
  assert.ok(ms < 2000, `took ${ms} ms`);
});

test('a zip with more entries than any Office file has is refused', async () => {
  const entries = Array.from({ length: 6000 }, (_, i) => ({ name: `x/${i}.xml`, data: Buffer.from('<a/>'), store: true }));
  entries.push({ name: 'word/document.xml', data: Buffer.from(`${WORD}Hello${WORD_END}`) });
  const { error } = await refusal(CvImport.unzip(makeZip(entries), 'word/document.xml'));
  assert.equal(error?.message, 'zip-size');
});

test('a workbook that unpacks to 200 MB is refused, and a sheet listed many times does not add up past the limit', async () => {
  for (const declared of [undefined, 4000]) {
    const { error, ms } = await refusal(Pareto.readWorkbook(bombXlsx(declared), CvImport.unzip));
    assert.equal(error?.message, 'zip-size', `declared ${declared}`);
    assert.ok(ms < 2000, `took ${ms} ms`);
  }
  // 40 sheets in workbook.xml that all point at one sheet of 30 MB: each under the limit for one entry, 1.2 GB together.
  const sheet = Buffer.concat([Buffer.from('<worksheet><sheetData><row r="1"><c r="A1"><v>1</v></c></row></sheetData>'), Buffer.alloc(30e6, 0x20), Buffer.from('</worksheet>')]);
  const many = makeZip([
    { name: 'xl/workbook.xml', data: Buffer.from(`<workbook><sheets>${Array.from({ length: 40 }, (_, i) => `<sheet name="S${i}" sheetId="${i + 1}" r:id="rId1"/>`).join('')}</sheets></workbook>`) },
    { name: 'xl/_rels/workbook.xml.rels', data: Buffer.from('<Relationships><Relationship Id="rId1" Target="worksheets/sheet1.xml"/></Relationships>') },
    { name: 'xl/worksheets/sheet1.xml', data: sheet },
  ]);
  const { error, ms } = await refusal(Pareto.readWorkbook(many, CvImport.unzip));
  assert.equal(error?.message, 'zip-size');
  assert.ok(ms < 2000, `took ${ms} ms`);
});

test('real Word and Excel files still open: the ATS CV .docx and a ToolKit .xlsx', async () => {
  const cv = AtsCv.clean({ person: { name: 'Ana Muster', email: 'ana@example.com' }, experience: [{ title: 'Night Manager', company: 'Hotel Nord', from: '01.2020', to: '', bullets: 'Led a team of 12' }] }, atsData, 'en');
  const bytes = AtsCv.docx(cv, atsData);
  const lines = await CvImport.readDocx(new File([bytes], 'cv.docx'));
  assert.ok(lines.some((line) => line.text.includes(cv.person.name)), 'the name is read back');
  const xlsx = ToolKit.xlsxFile([['Cause', 'Count'], ['Damage', 4], ['Late', 2]], { sheet: 'Data' });
  const book = await Pareto.readWorkbook(xlsx.buffer.slice(xlsx.byteOffset, xlsx.byteOffset + xlsx.byteLength), CvImport.unzip);
  assert.deepEqual(plain(book[0].rows), [['Cause', 'Count'], ['Damage', '4'], ['Late', '2']]);
  // A file somewhat larger than real ones (a 20 MB sheet) is still read.
  const big = Buffer.concat([Buffer.from('<worksheet><sheetData><row r="1"><c r="A1"><v>7</v></c></row></sheetData>'), Buffer.alloc(20e6, 0x20), Buffer.from('</worksheet>')]);
  const ok = await Pareto.readWorkbook(makeZip([
    { name: 'xl/workbook.xml', data: Buffer.from('<workbook><sheets><sheet name="A" sheetId="1" r:id="rId1"/></sheets></workbook>') },
    { name: 'xl/_rels/workbook.xml.rels', data: Buffer.from('<Relationships><Relationship Id="rId1" Target="worksheets/sheet1.xml"/></Relationships>') },
    { name: 'xl/worksheets/sheet1.xml', data: big },
  ]), CvImport.unzip);
  assert.deepEqual(plain(ok[0].rows), [['7']]);
});

// The pages: the file goes in through the page's own file input, and the page says why it was not read.
const withStreams = (w) => { w.Blob = Blob; w.Response = Response; w.DecompressionStream = DecompressionStream; };
const choose = (w, input, files) => {
  Object.defineProperty(input, 'files', { configurable: true, value: files });
  input.dispatchEvent(new w.Event('change', { bubbles: true }));
};
const waitFor = async (w, read, ms = 2000) => {
  const start = Date.now();
  while (Date.now() - start < ms) {
    const text = read();
    if (text && !/Reading|wird gelesen|Po lexohet/.test(text)) return text;
    await settle(w, 20);
  }
  return read();
};
const MESSAGES = {
  en: 'This file would unpack to far more than any CV or table holds, so it was not read. It may be damaged; nothing was changed.',
  de: 'Diese Datei würde beim Entpacken weit mehr ergeben, als ein Lebenslauf oder eine Tabelle je enthält; sie wurde daher nicht gelesen. Sie ist vielleicht beschädigt; nichts wurde geändert.',
  sq: 'Ky skedar do të hapej në shumë më tepër të dhëna nga sa mban çdo CV apo tabelë, prandaj nuk u lexua. Mund të jetë i dëmtuar; asgjë nuk ndryshoi.',
};

for (const lang of ['en', 'de', 'sq']) {
  test(`ATS CV (${lang}): a zip-bomb .docx is refused within 2 s with its own message; the CV is untouched`, async () => {
    const w = openTool('ats-cv', { lang, before: withStreams });
    const before = w.localStorage.getItem('sc-ats-cv');
    const start = Date.now();
    choose(w, w.document.querySelector('[data-import-file]'), [new File([bombDocx()], 'bomb.docx')]);
    const note = await waitFor(w, () => w.document.querySelector('[data-import-note]').textContent);
    assert.equal(note, MESSAGES[lang]);
    assert.ok(Date.now() - start < 2000);
    assert.equal(w.localStorage.getItem('sc-ats-cv'), before);
  });
}

test('Pareto and Inventory ABC: a zip-bomb .xlsx is refused within 2 s with its own message', async () => {
  const pareto = openTool('pareto', { before: withStreams });
  let start = Date.now();
  choose(pareto, pareto.document.querySelector('[data-file]'), [new File([bombXlsx(4000)], 'bomb.xlsx')]);
  assert.equal(await waitFor(pareto, () => pareto.document.querySelector('[data-source-note]').textContent), MESSAGES.en);
  assert.ok(Date.now() - start < 2000);

  const abc = openTool('inventory-abc', { lang: 'de', before: withStreams });
  start = Date.now();
  choose(abc, abc.document.querySelector('#ia-file'), [new File([bombXlsx()], 'bomb.xlsx')]);
  assert.equal(await waitFor(abc, () => abc.document.querySelector('[data-import-status]').textContent), MESSAGES.de);
  assert.ok(Date.now() - start < 2000);
});

test('CX Control Tower: a zip-bomb .xlsx among the files is reported by name and the others are still read', async () => {
  const w = openTool('cx-control-tower', { lang: 'sq', before: withStreams });
  click(w, w.document.querySelector('#cx-tab-data'));
  const start = Date.now();
  const csv = 'Date,DSP,Delivered,On_Time,Complete,Damage_Free\n2026-10-20,A,1,1,1,1\n';
  choose(w, w.document.querySelector('[data-cx-body] input[type=file]'), [new File([bombXlsx(4000)], 'bomb.xlsx'), new File([csv], 'deliveries.csv', { type: 'text/csv' })]);
  const note = await waitFor(w, () => w.document.querySelector('[data-cx-note]').textContent);
  assert.ok(note.startsWith('bomb.xlsx: do të hapej në shumë më tepër të dhëna nga sa mban çdo tabelë, prandaj nuk u lexua.'), note);
  assert.ok(note.includes('deliveries.csv'), note);
  assert.ok(Date.now() - start < 2000);
});
