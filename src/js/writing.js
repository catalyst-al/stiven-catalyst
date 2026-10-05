// The lists of essays and reflections: what this browser has already read (localStorage "sc-reading", kept by
// js/article.js) and, for the series, where to continue. Nothing is sent; without stored reading the page
// stays as it is built (the button starts with essay 1).
(() => {
  let reading = {};
  try { reading = JSON.parse(localStorage.getItem("sc-reading") || "{}") || {}; } catch { return; }
  const fill = (text, values) => String(text || "").replace(/\{(\w+)\}/g, (_, key) => values[key] ?? "");

  document.querySelectorAll("[data-read-row]").forEach((row) => {
    const done = Boolean(reading[row.dataset.readRow]?.done);
    row.classList.toggle("is-read", done);
    const mark = row.querySelector("[data-read-mark]");
    if (mark) mark.hidden = !done;
  });

  // Each series on the page has its own panel; the reading state is the same for all of them.
  document.querySelectorAll("[data-series-panel]").forEach((panel) => {
    const dots = [...panel.querySelectorAll("[data-essay-dot]")];
    const state = dots.map((dot) => ({ dot, entry: reading[dot.dataset.essayDot] || null, number: Number(dot.dataset.essayNumber) }));
    state.forEach(({ dot, entry }) => dot.classList.toggle("is-read", Boolean(entry?.done)));

    const read = state.filter(({ entry }) => entry?.done).length;
    if (!read && !state.some(({ entry }) => entry)) return;
    if (read) panel.querySelector("[data-series-count]").textContent = fill(panel.dataset.readLabel, { a: read, b: state.length });

    // An essay begun and not finished, the latest first; else the first essay not yet read.
    const begun = state.filter(({ entry }) => entry && !entry.done && entry.p >= 0.05).sort((a, b) => (b.entry.t || 0) - (a.entry.t || 0))[0];
    const next = begun || state.find(({ entry }) => !entry?.done);
    if (!next) return;
    const button = panel.querySelector("[data-series-next]");
    button.setAttribute("href", next.dot.getAttribute("href"));
    button.textContent = fill(begun ? panel.dataset.resumeLabel : panel.dataset.continueLabel, { n: next.number });
    next.dot.classList.add("is-next");
  });
})();
