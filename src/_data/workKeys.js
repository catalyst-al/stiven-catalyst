// The key each tool keeps its work under, by the tool's address (/tools/<slug>/): the English key, read from the
// tool's own data file (the `cfg` its page sets). The German and Albanian pages keep theirs under the same key with
// "-de" and "-sq" (sc-fmea, sc-fmea-de, sc-fmea-sq), because the names in a log are that language's words.
// js/work-elsewhere.js reads this: on a tool whose work in this language is empty, it points to the work kept in the
// other languages, so work saved in German does not look lost on the English page (audit P2B-19).
// A tool whose German file keeps the English key (the Action Tracker, Pareto, the CX Control Tower, the CV tools) is
// one list in every language already and is left out.
import fs from "node:fs";

const read = (file) => {
  try { return JSON.parse(fs.readFileSync(new URL(file, import.meta.url), "utf8")); } catch { return null; }
};
// Pages without a data file of their own name their key here.
const EXTRA = { "five-whys": "sc-five-whys" };
// Pages that show the work of the other tools keep only how they are viewed (a period, what is dismissed): no work.
const VIEWS = new Set(["shift-pulse", "signals", "ops-report", "print-pack"]);

// The log tools (ToolKit.logBook) say where the work is in their own log, when it is empty: their pages are left to it.
const js = new URL("../js/", import.meta.url);
const logScripts = new Set(fs.readdirSync(js).filter((name) => name.endsWith(".js") && name !== "tool-kit.js"
  && fs.readFileSync(new URL(name, js), "utf8").includes("logBook(")));
// A tool's own script has the name of its partial (partials/oee.njk, js/oee.js); the others a page loads lend it their
// arithmetic (Site Compare loads oee.js) and do not count.
const usesLogBook = (page) => {
  const partial = page.match(/{% include "partials\/([\w-]+)\.njk" %}/)?.[1];
  return Boolean(partial) && logScripts.has(`${partial}.js`);
};

const keys = {};
for (const file of fs.readdirSync(new URL("../tools/", import.meta.url))) {
  if (!file.endsWith(".njk")) continue;
  const slug = file.slice(0, -4);
  if (VIEWS.has(slug)) continue;
  const page = fs.readFileSync(new URL(`../tools/${file}`, import.meta.url), "utf8");
  if (usesLogBook(page)) continue;
  const cfg = page.match(/{% set cfg = (\w+) %}/)?.[1];
  const key = EXTRA[slug] || (cfg && read(`./${cfg}.json`)?.storageKey);
  if (!key) continue;
  const de = cfg ? read(`./de/${cfg}.json`)?.storageKey : `${key}-de`;
  if (de !== `${key}-de`) continue;
  keys[slug] = key;
}

export default keys;
