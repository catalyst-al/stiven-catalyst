// The weekly Management Review on the site. On the page of an issue, its charts (lib/weekly/charts.js) move in
// once when they come into view: lines draw, bars grow, people and figures appear one by one, the big figures
// count up. On the list of all issues, the topics narrow the list. Without this script, or with reduced motion,
// everything is simply shown as it is.
(() => {
  const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const charts = [...document.querySelectorAll("[data-weekly-chart]")];

  // "70%" counts up from 0, keeping its own way of writing the number ("70 %", "2,5×").
  const countUp = (el) => {
    const text = el.textContent;
    const match = text.match(/\d+(?:[.,]\d+)?/);
    if (!match) return;
    const target = Number(match[0].replace(",", "."));
    const decimals = (match[0].split(/[.,]/)[1] || "").length;
    const comma = match[0].includes(",");
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / 1100);
      const value = (target * (1 - (1 - t) ** 3)).toFixed(decimals);
      el.textContent = text.replace(match[0], comma ? value.replace(".", ",") : value);
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if (charts.length && !calm && "IntersectionObserver" in window) {
    const watch = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const chart = entry.target;
        watch.unobserve(chart);
        requestAnimationFrame(() => chart.classList.add("is-in"));
        chart.querySelectorAll(".wk-count").forEach(countUp);
      }
    }, { threshold: 0.3 });
    for (const chart of charts) {
      chart.classList.add("wk-anim");
      watch.observe(chart);
    }
  }

  const filter = document.querySelector("[data-weekly-filter]");
  if (filter) {
    const items = [...document.querySelectorAll(".weekly-grid > li")];
    filter.hidden = false;
    filter.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-block]");
      if (!button) return;
      for (const other of filter.querySelectorAll("button")) other.setAttribute("aria-pressed", String(other === button));
      for (const item of items) item.hidden = Boolean(button.dataset.block) && item.dataset.block !== button.dataset.block;
    });
  }
})();
