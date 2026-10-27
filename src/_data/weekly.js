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
import { issueText, pageNumbers, sourceLineFor, monthOf, monthsOf, blocksOf } from "../../lib/weekly/build.js";
import review from "./review.js";

const folder = new URL("../../lib/weekly/issues/", import.meta.url);
const files = fs.readdirSync(folder).filter((name) => /^\d{2}\.js$/.test(name)).sort();
const raw = await Promise.all(files.map((name) => import(new URL(name, folder)).then((module) => module.default)));

const pad = (n) => String(n).padStart(2, "0");
const sourceById = Object.fromEntries(sources.map((source) => [source.id, source]));
const sourceLine = sourceLineFor(sourceById, "Management Review");


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
    month: monthOf(issue, common.name),
    pageOf,
    pageCount: issue.pages.length,
    // The languages in which page 2 leaves out the reading legend, for lack of room.
    tight: issue.tight || [],
    sources: issue.sources.map((id) => sourceById[id]),
    ...perLang,
  };
});

// The issues the second check changed once they were online (common.checked.issues, the one list of them) and their
// count, which the texts that give it read from here ({count}), so the number cannot drift from the list.
const checkedIssues = [...common.checked.issues].sort((a, b) => a - b);
const fill = (text) => text.replaceAll("{count}", String(checkedIssues.length));

// "13 October 2026", "13 tetor 2026" or "13. Oktober 2026" → "2026-10-13", from the date of a correction (in three
// languages, or in the one language of a correction made to one edition), so the register can sort by it.
const MONTHS = [
  ["january", "janar", "januar"], ["february", "shkurt", "februar"], ["march", "mars", "märz"], ["april", "prill", "april"],
  ["may", "maj", "mai"], ["june", "qershor", "juni"], ["july", "korrik", "juli"], ["august", "gusht", "august"],
  ["september", "shtator", "september"], ["october", "tetor", "oktober"], ["november", "nëntor", "november"], ["december", "dhjetor", "dezember"],
];
const isoOf = (date) => {
  const text = typeof date === "string" ? date : date.en;
  const [day, month, year] = text.replace(".", "").split(" ");
  const index = MONTHS.findIndex((names) => names.includes(String(month).toLowerCase()));
  if (index < 0 || !/^\d{1,2}$/.test(day) || !/^\d{4}$/.test(year)) throw new Error(`Management Review: no date in "${text}"`);
  return `${year}-${String(index + 1).padStart(2, "0")}-${day.padStart(2, "0")}`;
};
const inLang = (value, lang) => (typeof value === "string" ? value : value[lang]);
const urlOf = (slug, lang) => `${lang === "en" ? "" : `/${lang}`}/magazine/${slug}.html`;

// The corrections register of the archive (/magazine/management-review.html#corrections), in each language: every
// dated correction of an issue (only those that apply to the language) and of the special edition, the second check
// and the dates corrected on 27 October, the newest first; on one day, in the order of the issues.
const register = Object.fromEntries(langs.map((lang) => {
  const entries = [];
  for (const issue of raw) {
    for (const correction of issue.corrections || []) {
      if (correction.lang && correction.lang !== lang) continue;
      entries.push({ iso: isoOf(correction.date), date: inLang(correction.date, lang), number: issue.number, label: `${common.labels.no[lang]} ${pad(issue.number)}`, url: urlOf(`management-review-nr-${pad(issue.number)}`, lang), t: inLang(correction.t, lang) });
    }
  }
  (review[lang].corrections || []).forEach((correction, index) => {
    entries.push({ iso: isoOf({ en: review.en.corrections[index].date }), date: correction.date, number: 0, label: common.labels.special[lang], url: urlOf(review.slug, lang), t: correction.t });
  });
  entries.push({ iso: isoOf(common.checked.date), date: common.checked.date[lang], number: 0, checked: true, label: `${common.labels.issues[lang]} 1–80`, url: "#checked",
    t: fill(common.archive.register.checked[lang]),
    issues: checkedIssues.map((number) => ({ label: `${common.labels.no[lang]} ${pad(number)}`, url: urlOf(`management-review-nr-${pad(number)}`, lang) })) });
  entries.push({ iso: isoOf(common.archive.datesNote.date), date: common.archive.datesNote.date[lang], number: 0, label: common.archive.register.dates[lang], url: "#dates", t: common.archive.datesNote.t[lang] });
  return [lang, entries.sort((a, b) => b.iso.localeCompare(a.iso) || a.number - b.number)];
}));

export default {
  name: common.name,
  langs,
  cover: common.cover,
  issues,
  latest: issues.at(-1),
  // The topics and the months that have at least one issue, for the list of issues.
  blocks: blocksOf(issues),
  months: monthsOf(issues),
  prints: issues.flatMap((issue) => langs.map((lang) => ({ slug: issue.slug, number: issue.number, lang }))),
  checkedCount: checkedIssues.length,
  register,
  // The issues with a dated correction of their own, in any language (How this is made lists them).
  corrected: raw.filter((issue) => (issue.corrections || []).length).map((issue) => ({ no: pad(issue.number), number: issue.number })),
  ...Object.fromEntries(langs.map((lang) => {
    const W = resolve(common, lang);
    return [lang, { ...W, checked: { ...W.checked, archive: fill(W.checked.archive), issues: checkedIssues } }];
  })),
};
