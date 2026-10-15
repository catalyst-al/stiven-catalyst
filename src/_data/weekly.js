// The monthly Management Review: a monthly edition in numbered issues, 10 pages each, in English, Albanian and German. The issues
// are in lib/weekly/issues (01.js, 02.js …), the sources and shared labels in lib/weekly. This file puts them
// together for the print (src/guide-print/weekly.njk, printed by scripts/weekly.mjs), the reader of each issue
// (src/_includes/pages/weekly-issue.njk) and the list of all issues (src/_includes/pages/weekly-archive.njk).
//
// Each issue is resolved per language, and its charts are drawn here once (lib/weekly/charts.js), so the print
// and the web page show the same SVG.
import fs from "node:fs";
import { langs, resolve, blocks, common, seriesOf } from "../../lib/weekly/common.js";
import { sources } from "../../lib/weekly/sources.js";
import { issueText, pageNumbers, sourceLineFor } from "../../lib/weekly/build.js";

const folder = new URL("../../lib/weekly/issues/", import.meta.url);
const files = fs.readdirSync(folder).filter((name) => /^\d{2}\.js$/.test(name)).sort();
const raw = await Promise.all(files.map((name) => import(new URL(name, folder)).then((module) => module.default)));

const pad = (n) => String(n).padStart(2, "0");
const sourceById = Object.fromEntries(sources.map((source) => [source.id, source]));
const sourceLine = sourceLineFor(sourceById, "Management Review");

// The month of an issue's edition as "2026-11", read from its English date ("November 2026"), so the list of issues
// can be narrowed to one month.
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const monthOf = (issue) => {
  const [name, year] = issue.date.en.split(" ");
  const index = MONTHS.indexOf(name);
  if (index < 0 || !/^\d{4}$/.test(year)) throw new Error(`Management Review No. ${issue.number}: no month in "${issue.date.en}"`);
  return `${year}-${pad(index + 1)}`;
};

const issues = raw.map((issue) => {
  const slug = `management-review-nr-${pad(issue.number)}`;
  const pageOf = pageNumbers(issue);
  const perLang = Object.fromEntries(langs.map((lang) => {
    const text = issueText(issue, lang, sourceLine);
    // The second check of 12 October: the issues it changed say so, with a link to what it changed (the archive).
    const checked = common.checked.issues.includes(issue.number) ? [{
      date: common.checked.date[lang],
      t: common.checked.issue[lang],
      link: `${lang === "en" ? "" : `/${lang}`}${common.archiveUrl}#checked`,
      linkText: common.checked.link[lang],
      series: true,
    }] : [];
    return [lang, {
      ...text,
      corrections: [...text.corrections, ...checked],
      // The series the issue belongs to: "First series" for 1–40 (October 2026), "Second series" for 41–80 …
      edition: common.labels.series[seriesOf(issue.number) - 1][lang],
      blockName: blocks[issue.block][lang],
    }];
  }));
  return {
    number: issue.number,
    no: pad(issue.number),
    slug,
    block: issue.block,
    month: monthOf(issue),
    pageOf,
    pageCount: issue.pages.length,
    // The languages in which page 2 leaves out the reading legend, for lack of room.
    tight: issue.tight || [],
    sources: issue.sources.map((id) => sourceById[id]),
    ...perLang,
  };
});

export default {
  name: common.name,
  langs,
  cover: common.cover,
  issues,
  latest: issues.at(-1),
  // The blocks that have at least one issue, in the order of the plan, for the list of issues.
  blocks: Object.keys(blocks).filter((id) => issues.some((issue) => issue.block === id)).map((id) => ({ id, ...blocks[id] })),
  // The months of the editions, the newest first, each with its name in the three languages and how many issues it has.
  months: [...new Set(issues.map((issue) => issue.month))].sort().reverse().map((id) => {
    const first = raw.find((issue) => monthOf(issue) === id);
    return { id, count: issues.filter((issue) => issue.month === id).length, ...first.date };
  }),
  prints: issues.flatMap((issue) => langs.map((lang) => ({ slug: issue.slug, number: issue.number, lang }))),
  ...Object.fromEntries(langs.map((lang) => [lang, resolve(common, lang)])),
};
