// The pages of the publications are fixed boxes, A5 each (print/review-base.css, print/guide.css): what a page says
// has to fit between its running head and the block at its foot (its sources, its note, the essay and the tool it
// points to, then the foot with the page number). A page that would run into that block or past it is set a little
// tighter, in steps: src/_data/pageFit.json gives the step of each such page, the page templates add the class
// fit-1, fit-2 or fit-3 to it, and the stylesheets draw it 4, 8 or 12 per cent smaller below the title.
//
// scripts/page-fit.mjs measures every page in Chromium and writes pageFit.json; the print scripts (scripts/weekly.mjs
// and its siblings) measure again before they print, and stop with the list of pages if one still does not fit.
// Both use measurePages below, which runs inside the page (page.evaluate) and so carries everything it needs.

// The last step: the type of a page set at fit-3 is 12 per cent smaller, the most the design takes.
export const FIT_STEPS = 3;

// The publications that print on fixed pages, by the key of their pages in pageFit.json: the slug of the issue,
// the volume or the edition.
export const FIT_PUBLICATIONS = ["weekly", "magazine", "treatise", "review", "toolsGuide"];

// Every page of the document, with what is wrong with it: the text of the page running into the block at its foot
// (or into the foot, or past the page), the block at the foot running into the foot, anything wider than the page.
// Measured in CSS pixels of the page at its own size (a reader scales its pages; the scale is taken out), with a
// clearance of one millimetre between the text and the block below it.
export function measurePages() {
  const mm = 96 / 25.4;
  const gap = 1 * mm;
  return [...document.querySelectorAll(".mr .pg, .tg .pg")].map((pg, index) => {
    const box = pg.getBoundingClientRect();
    const scale = box.height / pg.offsetHeight || 1;
    const style = getComputedStyle(pg);
    const isAbsolute = (el) => getComputedStyle(el).position === "absolute";
    const sized = (r) => r.width > 0 && r.height > 0;
    // What is pinned to the lower half of the page (the block of sources, the foot, a motto, the edition line) and
    // what flows from the top (everything else but the running head).
    const anchors = [...pg.children].filter((el) => isAbsolute(el) && sized(el.getBoundingClientRect()) && el.getBoundingClientRect().top - box.top > box.height / 2)
      .map((el) => ({ el, r: el.getBoundingClientRect() })).sort((a, b) => a.r.top - b.r.top);
    const flow = [];
    const walk = (el) => {
      for (const child of el.children) {
        if (el === pg && isAbsolute(child)) continue;
        if (getComputedStyle(child).display === "none") continue;
        const r = child.getBoundingClientRect();
        if (sized(r)) flow.push({ el: child, r });
        if (child.namespaceURI !== "http://www.w3.org/2000/svg") walk(child);
      }
    };
    walk(pg);
    const problems = [];
    const name = (el) => (el.className && typeof el.className === "string" ? `.${el.className.trim().split(/\s+/)[0]}` : el.tagName.toLowerCase());
    const flowBottom = Math.max(box.top, ...flow.map((f) => f.r.bottom));
    const limit = anchors.length ? anchors[0].r.top - gap * scale : box.bottom - parseFloat(style.paddingBottom) * scale;
    const over = (flowBottom - limit) / scale;
    if (over > 0.5) problems.push(`runs ${Math.ceil(over)}px into ${anchors.length ? name(anchors[0].el) : "the bottom margin"}`);
    for (let i = 1; i < anchors.length; i++) {
      const overlap = (anchors[i - 1].r.bottom - anchors[i].r.top) / scale;
      if (overlap > 0.5) problems.push(`${name(anchors[i - 1].el)} runs ${Math.ceil(overlap)}px into ${name(anchors[i].el)}`);
    }
    for (const { el, r } of [...flow, ...anchors]) {
      const out = Math.max(r.bottom - box.bottom, r.right - box.right, box.left - r.left, box.top - r.top) / scale;
      if (out > 0.5) { problems.push(`${name(el)} runs ${Math.ceil(out)}px past the page`); break; }
    }
    return { page: index + 1, over: Math.round(over), problems };
  });
}

// The pages that do not fit, in the documents a print script is about to print ({ label, url }, the print pages
// served by the script), each as a line ("management-review-nr-52 de p9: runs 12px into .bottom"). The pages are
// measured with the steps pageFit.json gives them, as they will print.
export const checkPagesFit = async (browser, documents) => {
  const unfit = [];
  for (const { label, url } of documents) {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    for (const { page: number, problems } of await page.evaluate(measurePages)) {
      if (problems.length) unfit.push(`${label} p${number}: ${problems.join("; ")}`);
    }
    await page.close();
  }
  return unfit;
};

// What a print script says when it stops for pages that do not fit.
export const unfitMessage = (unfit) => `${unfit.length === 1 ? "A page does" : `${unfit.length} pages do`} not fit the page box, so nothing was printed. Run node scripts/page-fit.mjs, `
  + `which sets each page as tight as it needs (and names a page it cannot fit: shorten its text or lower a block), then print again:\n`
  + unfit.map((line) => `  ${line}`).join("\n");
