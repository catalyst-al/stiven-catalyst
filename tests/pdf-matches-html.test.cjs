// Every publication PDF says what its page on the site says (audit of 27 October 2026, CI-04).
//
// The PDFs are printed offline (scripts/weekly.mjs, review.mjs, magazine.mjs, treatise.mjs, tools-guide.mjs and the
// book's scripts) and committed; the site is built from the same data on every run. Nothing else checks that the two
// still agree once the data changes. This test reads each committed PDF with the vendored pdf.js (as the CV import
// does in tests/cv-import-pdf.test.cjs) and compares it with the built page that offers it for download:
//
//   - the title of the page (its h1) is printed in the PDF, and the PDF's own title names it or its series;
//   - the issue number, volume, edition and date of the eyebrow (each part that holds a number) are printed;
//   - the page count of the reader and of its facts box is the PDF's;
//   - every dated correction in the page's corrections box is printed, with its date (the corrections of each issue
//     are printed on its pages); the series-wide note of the second check (data-series) is the site's own and links
//     to the archive, so it is not looked for in the PDF;
//   - every block of text on every page of the reader (the print pages shown as HTML: title, paragraphs, figures,
//     chart labels, sources, correction boxes and any colophon line on them) is on the same page of the PDF;
//   - every number of "Read it as text" (figures with %, decimals, years) is in the PDF.
// The archived editions of the Tools Guide are checked for their edition number on the cover.
//
// Text is compared after the same normalisation on both sides: Unicode NFKC (ligatures), lower case and "ß" as "ss"
// (CSS capitals), soft hyphens and zero-width marks dropped, hyphens and dashes dropped (hyphenation at line ends),
// quotes and apostrophes unified, and all white space removed (letter-spaced labels come out of a PDF as "N O . 8 0").
// Letters with marks (ä, ö, ü, ë, ç, é) are kept: both sides hold them as the same letters.
//
// The PDFs are read in worker threads, a few at a time; all of them take well under the 90 s budget.
'use strict';
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { Worker, isMainThread, parentPort, workerData } = require('node:worker_threads');

const ROOT = path.resolve(__dirname, '..');
const SITE = path.join(ROOT, '_site');
const PDFJS = pathToFileURL(path.join(ROOT, 'src/js/vendor/pdfjs/pdf.min.mjs')).href;
const PDFJS_WORKER = pathToFileURL(path.join(ROOT, 'src/js/vendor/pdfjs/pdf.worker.min.mjs')).href;

// The same text on both sides, whatever the print did to it (see above).
const squash = (text) => String(text || '')
  .normalize('NFKC')
  .toLowerCase()
  .replace(/\u00df/g, 'ss')
  .replace(/[\u00ad\u200b-\u200d\u2060\ufeff]/g, '')
  .replace(/[-\u2010-\u2015\u2212]/g, '')
  .replace(/[\u2018\u2019\u201a\u201b\u2032\u02b9\u02bc`\u00b4']/g, "'")
  .replace(/[\u201c\u201d\u201e\u201f\u00ab\u00bb\u2033"]/g, '"')
  .replace(/\s+/g, '');
const clean = (text) => String(text || '').replace(/\s+/g, ' ').trim();
// The numbers of a text: 4 · 4% · 14.5 · 1,234 · 12,658 · 2024/25 · 9:30. Links and DOIs are not figures.
const numbersOf = (text) => String(text || '').replace(/\b(?:https?:\/\/|www\.|doi\.org\/|10\.\d{4,}\/)\S*/g, ' ').match(/\d+(?:[.,:/]\d+)*/g) || [];
// A number is in a text when its characters are there in order, with nothing but white space between them (letter
// spacing), and not as a part of a longer number (no digit right before or after it, nor a decimal mark and a digit).
const hasNumber = (text, number) => new RegExp(`(?<!\\d[.,:/]?)${[...number].map((ch) => ch.replace(/[.\\/]/g, '\\$&')).join('\\s*')}(?![.,:/]?\\d)`).test(text);

if (!isMainThread) {
  // ------------------------------------------------------------------------------------------------------------------
  // A worker: compares the pairs it is given and posts what differs.
  const { JSDOM } = require('jsdom');
  // Elements the print CSS hides (display: none) are on the reader's pages but not in the PDF.
  const hidden = [];
  for (const file of fs.readdirSync(path.join(ROOT, 'src/_includes/print')).filter((name) => name.endsWith('.css'))) {
    const css = fs.readFileSync(path.join(ROOT, 'src/_includes/print', file), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
    for (const [, selector] of css.matchAll(/([^{}@]+)\{[^{}]*display\s*:\s*none[^{}]*\}/g)) hidden.push(...selector.split(',').map((s) => s.trim()).filter(Boolean));
  }
  const textBlocks = (root) => {
    // Every element that holds text of its own, with all of its text: a paragraph with its emphasis, a title with its
    // accent, a label of a chart.
    const blocks = [];
    for (const el of root.querySelectorAll('*')) {
      if (el.closest('script, style, template')) continue;
      if (![...el.childNodes].some((node) => node.nodeType === 3 && /[\p{L}\d]/u.test(node.textContent))) continue;
      const text = clean(el.textContent);
      // Its pieces too: the text nodes in it, for a block whose parts the print lays out in another order (a page
      // number set before its label by the CSS).
      const walker = el.ownerDocument.createTreeWalker(el, 4);
      const parts = [];
      for (let node = walker.nextNode(); node; node = walker.nextNode()) if (/[\p{L}\d]/u.test(node.textContent)) parts.push(clean(node.textContent));
      if (/[\p{L}\d]/u.test(text)) blocks.push({ text, parts });
    }
    return blocks;
  };
  const leafTexts = (root) => (root ? [...root.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, td, th, dt, dd, figcaption, blockquote')]
    .filter((el) => !el.querySelector('p, li, td, blockquote'))
    .map((el) => clean(el.textContent)) : []);

  const compare = async (pdfjs, pair) => {
    const problems = [];
    const say = (kind, detail, page) => problems.push({ kind, detail, ...(page ? { page } : {}) });
    const html = fs.readFileSync(pair.html, 'utf8');
    const main = html.slice(html.indexOf('<main'), html.indexOf('</main>') + 7);
    const dom = new JSDOM(main);
    const doc = dom.window.document;
    const stage = doc.querySelector('[data-book-pages]');
    for (const selector of hidden) {
      try { for (const el of stage.querySelectorAll(selector)) el.remove(); } catch { /* a selector JSDOM cannot read is not one of the print pages' */ }
    }
    const htmlPages = [...stage.querySelectorAll('.book-page')].map(textBlocks);
    const hero = doc.querySelector('.book-hero');
    const facts = Object.fromEntries([...hero.querySelectorAll('.book-facts div')].map((div) => [clean(div.querySelector('dt')?.textContent), clean(div.querySelector('dd')?.textContent)]));
    const info = {
      title: clean(hero.querySelector('h1')?.textContent),
      eyebrow: clean(hero.querySelector('.eyebrow')?.textContent),
      pages: facts.Pages ?? facts.Seiten ?? facts.Faqe,
      corrections: [...hero.querySelectorAll('.book-corrections p')].map((p) => {
        const label = clean(p.querySelector('strong')?.textContent);
        const link = clean(p.querySelector('a')?.textContent);
        let body = clean(p.textContent).slice(label.length).trim();
        if (link && body.endsWith(link)) body = body.slice(0, -link.length).trim();
        return { series: p.hasAttribute('data-series'), label, date: label.replace(/^[^,]*,\s*/, '').replace(/\.$/, ''), body };
      }),
      text: leafTexts(doc.querySelector('.book-text-body')).join('\n'),
    };
    dom.window.close();

    const pdf = await pdfjs.getDocument({ data: new Uint8Array(fs.readFileSync(pair.pdf)), isEvalSupported: false, disableFontFace: true, verbosity: 0 }).promise;
    const meta = (await pdf.getMetadata()).info || {};
    const raw = [];
    for (let n = 1; n <= pdf.numPages; n++) {
      const page = await pdf.getPage(n);
      raw.push((await page.getTextContent()).items.map((item) => item.str).join(' ').normalize('NFKC'));
      page.cleanup();
    }
    await pdf.destroy();
    const pages = raw.map(squash);
    const all = pages.join('');
    const rawAll = raw.join('\n');

    // The title and the issue.
    if (!info.title || !all.includes(squash(info.title))) say('title', `the title "${info.title}" is not printed`);
    const series = clean(info.eyebrow.split('·')[0]);
    const metaTitle = clean(meta.Title);
    if (!metaTitle || !(squash(metaTitle).includes(squash(info.title)) || squash(metaTitle).includes(squash(series)))) say('meta-title', `the PDF's title "${metaTitle}" names neither "${info.title}" nor "${series}"`);
    const eyebrowNumbers = numbersOf(info.eyebrow).map(Number);
    // The issue, volume or month in the PDF's title (its parts other than the title itself) is the page's.
    const metaParts = metaTitle.split('\u00b7').map(clean).filter((part) => squash(part) !== squash(info.title));
    for (const n of numbersOf(metaParts.join(' '))) if (!eyebrowNumbers.includes(Number(n))) say('meta-title', `the PDF's title "${metaTitle}" has ${n}, the page says "${info.eyebrow}"`);
    for (const part of info.eyebrow.split('·').map(clean).filter((part) => /\d/.test(part))) {
      if (!all.includes(squash(part))) say('date', `"${part}" (eyebrow "${info.eyebrow}") is not printed`);
    }
    // The pages.
    if (htmlPages.length !== pages.length) say('pages', `the reader has ${htmlPages.length} pages, the PDF ${pages.length}`);
    if (info.pages && Number(info.pages) !== pages.length) say('pages', `the page says ${info.pages} pages, the PDF has ${pages.length}`);
    // The corrections.
    for (const c of info.corrections) {
      if (c.series) continue;
      if (!all.includes(squash(c.date))) say('correction', `the correction of ${c.date} is not printed with its date`);
      if (!all.includes(squash(c.body))) say('correction', `the correction of ${c.date} is not printed: "${c.body}"`);
    }
    // Every block of every page, on the same page.
    htmlPages.forEach((blocks, i) => {
      const page = pages[i] ?? '';
      const seen = new Set();
      for (const { text: block, parts } of blocks) {
        const s = squash(block);
        if (!s || seen.has(s)) continue;
        seen.add(s);
        if (page.includes(s)) continue;
        // In another order on the page: every piece is there.
        if (parts.length > 1 && parts.every((part) => page.includes(squash(part)))) continue;
        const missing = numbersOf(block).filter((n) => !hasNumber(raw[i] ?? '', n));
        say('page-text', `${missing.length ? `numbers ${missing.join(', ')} not printed; ` : ''}"${block.length > 160 ? `${block.slice(0, 157)}...` : block}"`, i + 1);
      }
    });
    // Nothing printed that the page does not say: once every block of the page is taken out of the PDF's page, only
    // what the print adds is left (the numbers of a CSS counter, bullets, arrows, separators), no word.
    htmlPages.forEach((blocks, i) => {
      if (!blocks.length || pages[i] === undefined) return;
      let rest = pages[i];
      for (const piece of blocks.flatMap((block) => [block.text, ...block.parts]).map(squash).filter(Boolean).sort((a, b) => b.length - a.length)) rest = rest.split(piece).join(' ');
      const words = rest.match(/\p{L}[\p{L}\d]*/gu);
      if (words) say('extra-text', `the PDF prints "${words.join(' ').slice(0, 200)}", which the page does not have`, i + 1);
    });
    // The book's pages are pictures on the site: its PDF is compared with its text, page by page (scripts/book/*.txt).
    if (pair.source) {
      const source = fs.readFileSync(pair.source, 'utf8').split(/^== (\d+)\s*$/m);
      for (let k = 1; k < source.length; k += 2) {
        const n = Number(source[k]);
        const page = pages[n - 1] ?? '';
        for (const line of source[k + 1].split('\n').map((text) => text.trim()).filter((text) => text && !text.startsWith('#') && !/^\[image/.test(text))) {
          const value = line.replace(/^[a-z-]+:\s*/, '');
          for (const piece of value.split(/\s[|/]\s/).map(clean).filter((text) => /[\p{L}\d]/u.test(text))) {
            if (!page.includes(squash(piece))) say('page-text', `"${piece.length > 160 ? `${piece.slice(0, 157)}...` : piece}" (${path.basename(pair.source)}) is not printed`, n);
          }
        }
      }
    }
    // The numbers of the text version.
    const missing = [...new Set(numbersOf(info.text))].filter((n) => !hasNumber(rawAll, n));
    if (missing.length) say('numbers', `"Read it as text" has ${missing.join(', ')}, the PDF does not`);
    return { ...pair, pageCount: pages.length, metaTitle, problems };
  };

  (async () => {
    const log = console.log;
    console.log = () => {}; // pdf.js says once, on loading, that Node has no canvas; text needs none.
    let pdfjs;
    try { pdfjs = await import(PDFJS); } finally { console.log = log; }
    pdfjs.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
    const results = [];
    for (const pair of workerData.pairs) {
      try {
        results.push(await compare(pdfjs, pair));
      } catch (error) {
        results.push({ ...pair, problems: [{ kind: 'error', detail: String(error && error.stack || error) }] });
      }
    }
    if (workerData.editions) {
      for (const edition of workerData.editions) {
        const pdf = await pdfjs.getDocument({ data: new Uint8Array(fs.readFileSync(edition.pdf)), isEvalSupported: false, disableFontFace: true, verbosity: 0 }).promise;
        const page = await pdf.getPage(1);
        const text = (await page.getTextContent()).items.map((item) => item.str).join(' ');
        await pdf.destroy();
        results.push({ ...edition, cover: squash(text) });
      }
    }
    parentPort.postMessage(results);
  })();
  return;
}

// ----------------------------------------------------------------------------------------------------------------------
// The main thread: find the pairs, read them in workers, and test.
const { test, before } = require('node:test');
const assert = require('node:assert/strict');

// Known mismatches: a PDF that does not say what its page says, for a reason someone has to act on (reprint the PDF,
// or correct the page). Each entry names the PDF, the kind of difference (title, meta-title, date, pages, correction,
// page-text, numbers), a pattern of its message and why it is still there. A listed mismatch is reported, not failed;
// an entry that matches nothing fails, so the list only gets shorter.
const KNOWN_MISMATCHES = [
];

const relative = (file) => path.relative(ROOT, file).split(path.sep).join('/');
const readers = [];
for (const lang of ['', 'de', 'sq']) {
  for (const dir of ['magazine', 'books', 'guides']) {
    const folder = path.join(SITE, lang, dir);
    if (!fs.existsSync(folder)) continue;
    for (const name of fs.readdirSync(folder).filter((file) => file.endsWith('.html'))) {
      const file = path.join(folder, name);
      const html = fs.readFileSync(file, 'utf8');
      if (!html.includes('data-book-pages')) continue;
      // The PDF the page offers: the download button of its hero.
      const actions = html.slice(html.indexOf('class="hero-actions"'));
      const href = actions.match(/href="(\/media\/[^"]+\.pdf)"/)?.[1];
      // The book's text, page by page, in the language of the page (its reader shows pictures of the pages).
      const source = href && href.startsWith('/media/books/') ? path.join(ROOT, 'scripts/book', `${lang || 'en'}.txt`) : undefined;
      readers.push({ html: file, page: relative(file), lang: lang || 'en', pdf: href ? path.join(ROOT, 'src', href) : null, href, source });
    }
  }
}
const hasSite = readers.length > 0;
const pairs = readers.filter((reader) => reader.pdf && fs.existsSync(reader.pdf));
const editionsDir = path.join(ROOT, 'src/media/guides/tools-guide/editions');
const editions = fs.existsSync(editionsDir) ? fs.readdirSync(editionsDir).filter((name) => name.endsWith('.pdf')).map((name) => {
  const [, number, lang] = name.match(/^tools-guide-(\d+)-(\w+)\.pdf$/);
  return { pdf: path.join(editionsDir, name), number: Number(number), lang };
}) : [];

let results = [];
before(async () => {
  if (!hasSite) return;
  const count = Math.max(1, Math.min(4, (os.availableParallelism?.() ?? os.cpus().length) - 1, pairs.length));
  // The largest PDFs first, spread over the workers in turn, so they finish together.
  const sorted = [...pairs].sort((a, b) => fs.statSync(b.pdf).size - fs.statSync(a.pdf).size);
  const shares = Array.from({ length: count }, (_, i) => sorted.filter((_, j) => j % count === i));
  const parts = await Promise.all(shares.map((share, i) => new Promise((resolve, reject) => {
    const worker = new Worker(__filename, { workerData: { pairs: share, editions: i === 0 ? editions : null } });
    worker.once('message', resolve);
    worker.once('error', reject);
    worker.once('exit', (code) => { if (code) reject(new Error(`worker ${i} stopped with ${code}`)); });
  })));
  results = parts.flat();
});

const pdfName = (result) => relative(result.pdf);
const isKnown = (result, problem) => KNOWN_MISMATCHES.find((entry) => entry.pdf === pdfName(result) && entry.kind === problem.kind && entry.match.test(problem.detail));
const used = new Set();
const report = (group) => {
  const failures = [];
  for (const result of results.filter((item) => group(item) && item.problems)) {
    for (const problem of result.problems) {
      const entry = isKnown(result, problem);
      const line = `${pdfName(result)} (${result.page})${problem.page ? `, page ${problem.page}` : ''}: ${problem.kind}: ${problem.detail}`;
      if (entry) {
        used.add(entry);
        console.log(`# known mismatch: ${line}`);
      } else {
        failures.push(line);
      }
    }
  }
  return failures;
};
const GROUPS = [
  ['the Management Review issues', (item) => /\/management-review-nr-\d+\//.test(item.href || '')],
  ['the special edition of the Management Review', (item) => /\/management-review-\d{4}-\d{2}\//.test(item.href || '')],
  ['From the Floor', (item) => /\/nga-terreni-\d+\//.test(item.href || '')],
  ['the volumes of the Operational Treatise', (item) => /\/operational-treatise-vol-\d+\//.test(item.href || '')],
  ['the Tools Guide, current edition', (item) => /\/guides\/tools-guide\/tools-guide-\w+\.pdf$/.test(item.href || '')],
  ['the book, in its three editions', (item) => /\/media\/books\//.test(item.href || '')],
];

test('every publication PDF is the download of a page on the site, and every such page has its PDF', { skip: !hasSite }, () => {
  for (const reader of readers) assert.ok(reader.pdf && fs.existsSync(reader.pdf), `${reader.page}: its PDF ${reader.href} exists`);
  const offered = new Set(pairs.map((pair) => relative(pair.pdf)));
  const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => (entry.isDirectory() ? walk(path.join(dir, entry.name)) : [path.join(dir, entry.name)]));
  const published = [
    ...walk(path.join(ROOT, 'src/media/magazine')),
    ...walk(path.join(ROOT, 'src/media/books')),
    ...fs.readdirSync(path.join(ROOT, 'src/media/guides/tools-guide')).map((name) => path.join(ROOT, 'src/media/guides/tools-guide', name)),
  ].filter((file) => file.endsWith('.pdf')).map(relative);
  assert.ok(published.length >= 290, `${published.length} publication PDFs`);
  assert.deepEqual(published.filter((file) => !offered.has(file)), [], 'a PDF no page offers is not checked');
  // Every group has its PDFs: 80 issues in three languages, and so on.
  const counts = Object.fromEntries(GROUPS.map(([name, group]) => [name, pairs.filter(group).length]));
  assert.ok(counts['the Management Review issues'] >= 240, JSON.stringify(counts));
  for (const [name, n] of Object.entries(counts)) assert.ok(n >= 3, `${name}: ${n}`);
});

for (const [name, group] of GROUPS) {
  test(`${name}: the PDF says what the page says (title, issue, date, pages, corrections, every page's text, the figures)`, { skip: !hasSite }, () => {
    const checked = results.filter(group);
    assert.equal(checked.length, pairs.filter(group).length, `${name}: every PDF was read`);
    const failures = report(group);
    assert.deepEqual(failures, [], `${failures.length} differences:\n${failures.join('\n')}`);
  });
}

test('the archived Tools Guide editions each carry their own number on the cover', { skip: !hasSite || !editions.length }, () => {
  const words = { en: 'edition', de: 'ausgabe', sq: 'botimi' };
  for (const edition of results.filter((item) => item.cover !== undefined)) {
    assert.ok(edition.cover.includes(`${words[edition.lang]}${edition.number}`), `${relative(edition.pdf)}: "${words[edition.lang]} ${edition.number}" on the cover`);
  }
  assert.equal(results.filter((item) => item.cover !== undefined).length, editions.length);
});

test('every known mismatch is still a mismatch (the list only gets shorter)', { skip: !hasSite }, () => {
  for (const [, group] of GROUPS) report(group);
  const stale = KNOWN_MISMATCHES.filter((entry) => !used.has(entry));
  assert.deepEqual(stale.map((entry) => `${entry.pdf}: ${entry.kind} ${entry.match}`), [], 'these PDFs match their pages now: remove them from KNOWN_MISMATCHES');
});

test('the normalisation: letter spacing, hyphenation, soft hyphens, ligatures, capitals and German and Albanian letters', () => {
  assert.equal(squash('N O . 8 0 · N O V E M B E R'), squash('No. 80 · November'));
  assert.equal(squash('Verbesse-\nrung'), squash('Verbesserung'));
  assert.equal(squash('Ver\u00adbesserung'), squash('Verbesserung'));
  assert.equal(squash('\ufb01rst \ufb02oor'), squash('first floor'));
  assert.equal(squash('STRASSE'), squash('Stra\u00dfe'));
  assert.equal(squash('PËRGJEGJËSIA · ÇFARË'), squash('përgjegjësia · çfarë'));
  assert.equal(squash('\u2018Improving ratings\u02bc'), squash("'Improving ratings'"));
  assert.notEqual(squash('Führung'), squash('Fuhrung'));
  assert.deepEqual(numbersOf('4% of 12,658 in 2024/25 at 9:30, 14.5 · https://doi.org/10.1016/0149-7189(79)90048-X'), ['4', '12,658', '2024/25', '9:30', '14.5']);
  assert.ok(hasNumber('N O . 8 0', '80'));
  assert.ok(hasNumber('a 4% share', '4'));
  assert.ok(!hasNumber('a 48% share', '4'));
  assert.ok(!hasNumber('1,234', '234'));
});
