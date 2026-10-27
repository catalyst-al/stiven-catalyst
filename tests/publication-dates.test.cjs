// Every publication is dated by the month it went online (src/_data/online.json, from the history of main): no issue,
// volume or edition carries a month after the one it went online in, nor one before it. The covers, the running
// heads, the pages, their structured data and the sitemap agree.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const hasSite = fs.existsSync('_site/magazine/management-review-nr-41.html');
const online = JSON.parse(fs.readFileSync('src/_data/online.json', 'utf8'));
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const monthOf = (en) => {
  const [month, year] = en.split(' ');
  return `${year}-${String(MONTHS.indexOf(month) + 1).padStart(2, '0')}`;
};

const publications = async () => {
  const { default: weekly } = await import('../src/_data/weekly.js');
  const { default: magazine } = await import('../src/_data/magazine.js');
  const { default: treatise } = await import('../src/_data/treatise.js');
  const { default: review } = await import('../src/_data/review.js');
  return [
    ...weekly.issues.map((issue) => ({ slug: issue.slug, date: issue.en.date, dates: [issue.en.date, issue.sq.date, issue.de.date] })),
    ...magazine.issues.map((issue) => ({ slug: issue.slug, date: issue.en.date, dates: [issue.en.date, issue.sq.date, issue.de.date] })),
    ...treatise.volumes.map((volume) => ({ slug: volume.slug, date: volume.en.date, dates: [volume.en.date, volume.sq.date, volume.de.date] })),
    { slug: review.slug, date: review.en.date, dates: [review.en.date, review.sq.date, review.de.date] },
  ];
};

test('no publication is dated after, or before, the month it went online', async () => {
  const all = await publications();
  assert.ok(all.length >= 80 + 2 + 13 + 1);
  for (const p of all) {
    assert.ok(online[p.slug], `${p.slug}: online date`);
    assert.equal(monthOf(p.date), online[p.slug].published.slice(0, 7), `${p.slug}: ${p.date} against ${online[p.slug].published}`);
  }
});

test('the three languages give the same month', async () => {
  const names = { 'October 2026': ['October 2026', 'Tetor 2026', 'Oktober 2026'] };
  for (const p of await publications()) {
    if (names[p.date]) assert.deepEqual(p.dates, names[p.date], p.slug);
  }
});

test('issue 41, From the Floor No. 2 and the special edition: the cover, the running head, the page and its data agree', { skip: !hasSite }, () => {
  for (const [prefix, month] of [['', 'October 2026'], ['sq/', 'Tetor 2026'], ['de/', 'Oktober 2026']]) {
    for (const slug of ['management-review-nr-41', 'management-review-nr-80', 'nga-terreni-02', 'management-review-2026-09']) {
      const html = fs.readFileSync(`_site/${prefix}magazine/${slug}.html`, 'utf8');
      assert.ok(html.includes(month), `${prefix}${slug}: ${month}`);
      assert.doesNotMatch(html, /November 2026|Nëntor 2026|September 2026|Shtator 2026/, `${prefix}${slug}: no former month`);
      assert.match(html, new RegExp(`"datePublished":"${online[slug].published}"`), `${prefix}${slug}: datePublished`);
    }
  }
});

test('the sitemap gives each dated publication page the day its text last changed', { skip: !hasSite }, () => {
  const sitemap = fs.readFileSync('_site/sitemap.xml', 'utf8');
  for (const slug of ['management-review-nr-01', 'management-review-nr-41', 'nga-terreni-02', 'operational-treatise-vol-04', 'management-review-2026-09']) {
    for (const prefix of ['', 'de/', 'sq/']) {
      const loc = `<loc>https://stivencatalyst.com/${prefix}magazine/${slug}.html</loc><lastmod>${online[slug].modified}</lastmod>`;
      assert.ok(sitemap.includes(loc), `${prefix}${slug}`);
    }
  }
});
