// When each publication went online, and when its text last changed, from the history of main (git log
// --first-parent, so a branch counts from the day it was merged). Writes src/_data/online.json, which the
// publication pages show ("Online since") and give to search engines (datePublished, dateModified in
// partials/structured-data.njk). The site is built from a shallow clone, without this history, so the file is kept in
// the repository: run this again after a publication is added or changed, with main fetched in full.
//
//   node scripts/online-dates.mjs            from origin/main
//   node scripts/online-dates.mjs HEAD       from the branch checked out
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const ref = process.argv[2] || "origin/main";
const days = (file) => execFileSync("git", ["log", "--first-parent", ref, "--format=%ad", "--date=short", "--", file], { cwd: ROOT })
  .toString().split("\n").filter(Boolean);

// The file each publication is written in, and the address of its page.
const publications = [
  ...fs.readdirSync(path.join(ROOT, "lib/weekly/issues")).filter((name) => /^\d\d\.js$/.test(name))
    .map((name) => [`management-review-nr-${name.slice(0, 2)}`, `lib/weekly/issues/${name}`]),
  ...fs.readdirSync(path.join(ROOT, "lib/floor")).filter((name) => /^\d\d\.js$/.test(name))
    .map((name) => [`nga-terreni-${name.slice(0, 2)}`, `lib/floor/${name}`]),
  ...fs.readdirSync(path.join(ROOT, "lib/treatise/volumes")).filter((name) => /^\d\d\.js$/.test(name))
    .map((name) => [`operational-treatise-vol-${name.slice(0, 2)}`, `lib/treatise/volumes/${name}`]),
  ["management-review-2026-09", "src/_data/review.js"],
];

const online = {};
for (const [slug, file] of publications.sort(([a], [b]) => a.localeCompare(b))) {
  const seen = days(file);
  if (!seen.length) continue; // not on main yet: the page falls back to its build date
  online[slug] = { published: seen.at(-1), modified: seen[0] };
}
fs.writeFileSync(path.join(ROOT, "src/_data/online.json"), JSON.stringify(online, null, 1) + "\n");
console.log(`${Object.keys(online).length} publications written to src/_data/online.json from ${ref}.`);
