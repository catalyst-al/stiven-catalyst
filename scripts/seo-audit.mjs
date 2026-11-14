// The SEO audit of the built site: node scripts/seo-audit.mjs [--site _site] [--json report.json] [--md report.md]
// Run after `npm run build`. Prints the report as Markdown and exits 1 when it finds errors (genuine problems);
// warnings and the intentional exclusions are reported but do not fail. See lib/seo-audit.js.
import fs from "node:fs";
import { audit, toMarkdown } from "../lib/seo-audit.js";

const args = process.argv.slice(2);
const option = (name, fallback) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : fallback; };
const site = option("--site", "_site");
if (!fs.existsSync(`${site}/index.html`)) {
  console.error(`No built site at ${site}; run npm run build first.`);
  process.exit(2);
}
const config = JSON.parse(fs.readFileSync(new URL("../docs/seo/priority-urls.json", import.meta.url), "utf8"));
const report = audit(site, { priority: config.urls, minContextualLinks: config.minContextualLinks });
const markdown = toMarkdown(report);
if (option("--json")) fs.writeFileSync(option("--json"), JSON.stringify(report, null, 2) + "\n");
if (option("--md")) fs.writeFileSync(option("--md"), markdown + "\n");
console.log(markdown);
process.exit(report.errors.length ? 1 : 0);
