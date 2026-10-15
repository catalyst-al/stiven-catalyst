// The Publications page narrowed by month and kind (src/_includes/pages/publications.njk, partials/issue-filter.njk):
// for each month, the newest issue of the Management Review, the newest volume of the treatise and the newest issue
// of From the Floor that came out in it, and the special edition of September 2026 in its month. The book and the
// Tools Guide are not tied to a month: they stay on the page whatever the month.
import { x, resolve } from "../../lib/weekly/common.js";
import { monthOf, monthsOf } from "../../lib/weekly/build.js";
import weekly from "./weekly.js";
import treatise from "./treatise.js";
import magazine from "./magazine.js";
import review from "./review.js";

const langs = ["en", "sq", "de"];

// The newest of a list (oldest first, each with its .month) in each of its months, the newest month first.
const newestByMonth = (list) => monthsOf(list).map((month) => list.filter((item) => item.month === month.id).at(-1));

const special = {
  slug: review.slug,
  month: monthOf({ number: "September", date: { en: review.en.date } }, "Management Review, special edition"),
  ...Object.fromEntries(langs.map((lang) => [lang, { date: review[lang].date }])),
};

const picks = {
  review: newestByMonth(weekly.issues),
  treatise: newestByMonth(treatise.volumes),
  floor: newestByMonth(magazine.issues),
};

const kinds = [
  { id: "review", en: "Management Review", sq: "Management Review", de: "Management Review" },
  { id: "treatise", ...Object.fromEntries(langs.map((lang) => [lang, treatise[lang].short])) },
  { id: "floor", ...Object.fromEntries(langs.map((lang) => [lang, magazine.names[lang].name])) },
  { id: "books", ...x("Books and guides", "Libra dhe udhëzues", "Bücher und Leitfäden") },
];

const labels = {
  all: x("All", "Të gjitha", "Alle"),
  kinds: x("Kind of publication", "Lloji i botimit", "Art der Publikation"),
  months: x("Month of the edition", "Muaji i botimit", "Monat der Ausgabe"),
  shown: x("{shown} of {total} publications", "{shown} nga {total} botime", "{shown} von {total} Publikationen"),
  more: x("Show more publications", "Shfaq më shumë botime", "Mehr Publikationen zeigen"),
  empty: x("No publication of this kind in this month.", "Asnjë botim i këtij lloji në këtë muaj.", "Keine Publikation dieser Art in diesem Monat."),
};

export default {
  ...picks,
  special,
  // The months with at least one dated publication, the newest first, each with how many the page shows in it:
  // its own and the two that stay in every month (the guide and the book).
  months: monthsOf([...picks.review, ...picks.treatise, ...picks.floor, special]).map((month) => ({ ...month, count: month.count + 2 })),
  kinds,
  ...Object.fromEntries(langs.map((lang) => [lang, resolve(labels, lang)])),
};
