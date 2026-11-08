// The homepage's "Continue where you left off" (partials/home-continue.njk): from what this browser keeps of the
// reading (localStorage "sc-reading", js/article.js: { slug: { p, done, t } }), the essay or reflection begun most
// recently and not finished, with how far it was read; when all that was begun is finished, the first text not yet
// finished after the last one finished, in the reading order. Nothing is sent; a first visit sees nothing.
(() => {
  const box = document.querySelector("[data-home-continue]");
  if (!box) return;
  let reading = {};
  let order = [];
  try {
    reading = JSON.parse(localStorage.getItem("sc-reading") || "{}") || {};
    order = JSON.parse(box.querySelector("[data-home-continue-data]").textContent) || [];
  } catch { return; }
  const known = order.filter((item) => reading[item.s]);
  if (!known.length) return;

  const latest = (list) => list.reduce((a, b) => ((reading[b.s].t || 0) > (reading[a.s].t || 0) ? b : a));
  const begun = known.filter((item) => !reading[item.s].done && (reading[item.s].p || 0) >= 0.05);
  let pick = null;
  let label = box.dataset.continueLabel;
  let meta = "";
  if (begun.length) {
    pick = latest(begun);
    meta = (box.dataset.readLabel || "{p}%").replace("{p}", Math.round((reading[pick.s].p || 0) * 100));
  } else {
    const finished = known.filter((item) => reading[item.s].done);
    if (!finished.length) return;
    const from = order.indexOf(latest(finished));
    // The next not yet finished, going round the order once.
    for (let i = 1; i < order.length && !pick; i++) {
      const item = order[(from + i) % order.length];
      if (!reading[item.s]?.done) pick = item;
    }
    label = box.dataset.nextLabel;
  }
  if (!pick) return;

  box.querySelector("[data-home-continue-kicker]").textContent = label;
  box.querySelector("[data-home-continue-link]").href = pick.u;
  box.querySelector("[data-home-continue-meta]").textContent = meta ? `${pick.k} · ${meta}` : pick.k;
  box.querySelector("[data-home-continue-title]").textContent = pick.t;
  const summary = box.querySelector("[data-home-continue-summary]");
  summary.textContent = pick.d;
  summary.hidden = !pick.d;
  box.hidden = false;
})();
