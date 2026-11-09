// The bookmarks of a printed publication (audit P5-08): one per page that has a heading, named by that heading, the
// first page by the document's title. Chromium's own outline joins the two lines of a heading without a space
// ("Spielt die Führungskrafteine Rolle?") and lists every small heading, so the print scripts read the headings here,
// leave the list beside the PDF (<pdf>.toc.json) and scripts/pdf-meta.py writes it into the PDF and removes it.
import fs from "node:fs";

// In the page: each .pg is one printed page, in order.
export const readOutline = (page) => page.evaluate(() => {
  // A part on a line of its own (a block, a <br>) is a word apart; kerning spans inside a word are not.
  const words = (node) => [...node.childNodes].map((child) => {
    if (child.nodeType === 3) return child.textContent;
    if (child.nodeType !== 1) return "";
    if (child.tagName === "BR") return " ";
    const apart = ["block", "flex", "grid", "list-item"].includes(getComputedStyle(child).display);
    return apart ? ` ${words(child)} ` : words(child);
  }).join("");
  const clean = (text) => text.replace(/\s+/g, " ").trim();
  const entries = [];
  [...document.querySelectorAll(".pg")].forEach((pg, i) => {
    const heading = pg.querySelector("h1, h2");
    const title = heading ? clean(words(heading)) : i === 0 ? clean(document.title) : "";
    if (title) entries.push([1, title, i + 1]);
  });
  return entries;
});

export const writeOutline = (target, entries) => fs.writeFileSync(`${target}.toc.json`, JSON.stringify(entries));
