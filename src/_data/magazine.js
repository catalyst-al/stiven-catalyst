// "Nga terreni" (From the Floor, Aus der Praxis): the monthly magazine of Stiven Catalyst, one entry per issue,
// newest last, for the printed issue (src/guide-print/magazine.njk, scripts/magazine.mjs) and its reader page
// (src/_includes/pages/magazine-issue.njk), in English, Albanian and German.
//
// The trend is written by the editors from cited sources; "From the floor" is Stiven Janaqi's own answers,
// edited only for spelling; nothing in an issue is invented. The Albanian draft and its fact check live in
// docs/revista/.
//
// Each issue is written in the format of the Management Review (lib/floor/NN.js: pages of blocks with charts,
// sources by id) and drawn by the same pages (print/weekly-page.njk) under the name of the magazine: the cover with
// the picture, the figure and the teasers, the charts with their sources, a page of sources.
import { langs as reviewLangs, resolve, blocks, common } from "../../lib/weekly/common.js";
import { issueText, pageNumbers, sourceLineFor } from "../../lib/weekly/build.js";
import floor1 from "../../lib/floor/01.js";
import floor2 from "../../lib/floor/02.js";

const names = {
  en: { name: "From the Floor", tagline: "The monthly magazine of Stiven Catalyst" },
  sq: { name: "Nga terreni", tagline: "Revista mujore e Stiven Catalyst" },
  de: { name: "Aus der Praxis", tagline: "Das Monatsmagazin von Stiven Catalyst" },
};

const labels = {
  en: { issue: "Issue" },
  sq: { issue: "Numri" },
  de: { issue: "Ausgabe" },
};

// The list of all issues (/magazine/from-the-floor.html) and its link from Publications and from each issue.
const archive = {
  en: { eyebrow: "The monthly magazine", lede: "Every month one theme of the work on the floor: the trend of the month from cited sources, Stiven Janaqi's own answers from the floor, a tool, essays and a question for you. Every issue, the newest first.", seo: "From the Floor, the monthly magazine of Stiven Catalyst: every issue, the newest first, with the trend of the month, answers from the floor, a tool and essays.", all: "All issues" },
  sq: { eyebrow: "Revista mujore", lede: "Çdo muaj një temë e punës në terren: trendi i muajit nga burime të cituara, përgjigjet e vetë Stiven Janaqit nga terreni, një mjet, ese dhe një pyetje për ju. Të gjithë numrat, më i riu i pari.", seo: "Nga terreni, revista mujore e Stiven Catalyst: të gjithë numrat, më i riu i pari, me trendin e muajit, përgjigjet nga terreni, një mjet dhe ese.", all: "Të gjithë numrat" },
  de: { eyebrow: "Das Monatsmagazin", lede: "Jeden Monat ein Thema der Arbeit in der Praxis: der Trend des Monats aus zitierten Quellen, Stiven Janaqis eigene Antworten aus der Praxis, ein Tool, Essays und eine Frage an Sie. Alle Ausgaben, die neueste zuerst.", seo: "Aus der Praxis, das Monatsmagazin von Stiven Catalyst: alle Ausgaben, neueste zuerst, mit dem Trend des Monats, Antworten aus der Praxis, Tool und Essays.", all: "Alle Ausgaben" },
};

const langs = ["en", "sq", "de"];

// What the pages of the Management Review need to carry the name of the magazine: its masthead (the second word in
// red), the line under it, the picture of the cover, the line of the back and the list of all issues. The labels,
// the legend and the page of sources are the Management Review's own.
const masts = { en: ["From the", "Floor"], sq: ["Nga", "terreni"], de: ["Aus der", "Praxis"] };
const backLines = {
  en: "Every month one theme of the work on the floor, checked against the research, with answers from the floor.",
  sq: "Çdo muaj një temë e punës në terren, e kontrolluar me kërkimet, me përgjigje nga terreni.",
  de: "Jeden Monat ein Thema der Arbeit in der Praxis, geprüft an der Forschung, mit Antworten aus der Praxis.",
};
const review = Object.fromEntries(langs.map((lang) => {
  const W = resolve(common, lang);
  return [lang, {
    ...W,
    name: names[lang].name,
    tagline: names[lang].tagline,
    mast: masts[lang],
    archiveUrl: "/magazine/from-the-floor.html",
    labels: { ...W.labels, edition: archive[lang].eyebrow, all: archive[lang].all },
    back: { line: backLines[lang], all: archive[lang].all },
  }];
}));

// An issue written in the format of the Management Review, with what the other pages of the magazine read from an
// issue (theme, themeSub, trend.lead: Publications, the lists, the hero of the homepage).
const asReview = (issue) => {
  const pad = (n) => String(n).padStart(2, "0");
  const sourceById = Object.fromEntries(issue.sources.map((source) => [source.id, source]));
  const sourceLine = sourceLineFor(sourceById, `Nga terreni ${issue.number}`);
  return {
    number: issue.number,
    no: pad(issue.number),
    slug: issue.slug,
    block: issue.block,
    pageOf: pageNumbers(issue),
    pageCount: issue.pages.length,
    sources: issue.sources,
    ...Object.fromEntries(reviewLangs.map((lang) => {
      const text = issueText(issue, lang, sourceLine);
      return [lang, {
        ...text,
        edition: archive[lang].eyebrow,
        blockName: blocks[issue.block][lang],
        coverTheme: text.theme,
        theme: text.heading,
        themeSub: text.sub,
        trend: { lead: resolve(issue.lead, lang) },
      }];
    })),
  };
};

const issues = [asReview(floor1), asReview(floor2)];

export default {
  langs,
  names,
  labels,
  archive,
  review,
  issues,
  latest: issues[issues.length - 1],
  // One print page per issue and language (src/guide-print/magazine.njk).
  prints: issues.flatMap((issue) => langs.map((lang) => ({ issue, lang }))),
};
