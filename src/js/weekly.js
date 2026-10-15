// The monthly Management Review on the site. On the page of an issue, its charts (lib/weekly/charts.js) move in
// once when they come into view: lines draw, bars grow, people and figures appear one by one, the big figures
// count up. On the list of all issues, the month and the topics narrow the list. Without this script, or with reduced motion,
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

  // A list of all issues (the Management Review, From the Floor): one month at a time (the newest first), narrowed by topic, twelve covers at a time with
  // "show more". The choice stays in the address (?month=2026-10&topic=people), so the back button returns to it.
  const filter = document.querySelector("[data-weekly-filter]");
  if (filter) {
    const items = [...document.querySelectorAll(".weekly-grid > li")];
    const monthButtons = [...filter.querySelectorAll("button[data-month]")];
    const blockButtons = [...filter.querySelectorAll("button[data-block]")];
    const topicRow = filter.querySelector(".weekly-filter");
    const more = document.querySelector("[data-weekly-more]");
    const moreButton = more.querySelector("button");
    const shown = more.querySelector(".weekly-shown");
    const none = document.querySelector("[data-weekly-none]");
    const page = Number(filter.dataset.page) || 12;
    const params = new URLSearchParams(location.search);
    const pick = (buttons, key, value) => buttons.find((button) => button.dataset[key] === value);
    const state = {
      month: (pick(monthButtons, "month", params.get("month")) || monthButtons[0])?.dataset.month || "",
      block: pick(blockButtons, "block", params.get("topic") || "") ? params.get("topic") || "" : "",
      limit: page,
    };

    const render = () => {
      const inMonth = items.filter((item) => !state.month || item.dataset.month === state.month);
      if (state.block && !inMonth.some((item) => item.dataset.block === state.block)) state.block = "";
      for (const button of monthButtons) button.setAttribute("aria-pressed", String(button.dataset.month === state.month));
      for (const button of blockButtons) {
        button.setAttribute("aria-pressed", String(button.dataset.block === state.block));
        const count = button.querySelector(".weekly-n");
        if (!count) continue;
        // A topic with no issue in the month is left out of its row.
        count.textContent = inMonth.filter((item) => item.dataset.block === button.dataset.block).length;
        button.hidden = count.textContent === "0";
      }
      // With fewer than two topics in the month there is nothing to choose between.
      if (topicRow) topicRow.hidden = blockButtons.filter((button) => button.dataset.block && !button.hidden).length < 2;
      const matching = inMonth.filter((item) => !state.block || item.dataset.block === state.block);
      const visible = new Set(matching.slice(0, state.limit));
      for (const item of items) item.hidden = !visible.has(item);
      none.hidden = matching.length > 0;
      // The count and "show more" only while some covers are still to come.
      more.hidden = visible.size >= matching.length;
      shown.textContent = filter.dataset.shown.replace("{shown}", visible.size).replace("{total}", matching.length);
      const query = new URLSearchParams();
      if (state.month && state.month !== monthButtons[0]?.dataset.month) query.set("month", state.month);
      if (state.block) query.set("topic", state.block);
      const search = query.toString();
      try {
        history.replaceState(history.state, "", `${location.pathname}${search ? `?${search}` : ""}${location.hash}`);
      } catch {}
    };

    filter.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-month], button[data-block]");
      if (!button) return;
      if ("month" in button.dataset) state.month = button.dataset.month;
      else state.block = button.dataset.block;
      state.limit = page;
      render();
    });
    moreButton.addEventListener("click", () => {
      const before = items.filter((item) => !item.hidden).length;
      state.limit += page;
      render();
      // Keyboard and screen-reader users go on from the first cover that just appeared.
      items.filter((item) => !item.hidden)[before]?.querySelector("a")?.focus();
    });
    filter.hidden = false;
    render();
  }
})();
