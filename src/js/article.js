// An essay or reflection while it is read (layouts/article.njk):
// - the thin bar at the top shows how far the reader is;
// - the contents beside the text mark the section on screen;
// - a checklist at the end of an essay counts the questions ticked off and copies them as plain text;
// - how far each essay was read is kept in this browser only (localStorage "sc-reading"), so the series
//   dots and the list of essays can show what is already read and where to continue. Nothing is sent.
(() => {
  const article = document.querySelector("[data-article]");
  if (!article) return;
  const bar = document.querySelector("[data-reading-progress]");
  const id = article.dataset.essayId;

  const KEY = "sc-reading";
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch { return {}; } };
  const save = (all) => { try { localStorage.setItem(KEY, JSON.stringify(all)); } catch { /* storage unavailable */ } };

  // The series dots: the essays read to the end are filled in.
  const reading = load();
  document.querySelectorAll("[data-essay-dot]").forEach((dot) => {
    dot.classList.toggle("is-read", Boolean(reading[dot.dataset.essayDot]?.done));
  });

  // How far through the text the reader is, from 0 to 1.
  const progress = () => {
    const rect = article.getBoundingClientRect();
    const total = rect.height - window.innerHeight * 0.6;
    const read = Math.min(Math.max(-rect.top + window.innerHeight * 0.2, 0), Math.max(total, 1));
    return total > 0 ? read / total : 1;
  };

  let stored = reading[id]?.p || 0;
  let lastSave = 0;
  const remember = (p) => {
    if (!id || p <= stored + 0.02) return;
    const now = Date.now();
    if (now - lastSave < 1500 && p < 0.9) return;
    lastSave = now;
    stored = p;
    const all = load();
    const entry = all[id] || {};
    all[id] = { p: Math.max(entry.p || 0, Math.round(p * 100) / 100), done: Boolean(entry.done || p >= 0.9), t: now };
    save(all);
    if (all[id].done) document.querySelector(`[data-essay-dot="${CSS.escape(id)}"]`)?.classList.add("is-read");
  };

  // The section on screen, marked in the contents.
  const links = [...document.querySelectorAll("[data-toc-link]")];
  const heads = links.map((link) => document.getElementById(decodeURIComponent(link.hash.slice(1)))).filter(Boolean);
  const markSection = () => {
    if (!heads.length) return;
    const line = window.innerHeight * 0.3;
    let current = -1;
    heads.forEach((head, i) => { if (head.getBoundingClientRect().top <= line) current = i; });
    links.forEach((link, i) => {
      if (i === current) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  };

  // Only reading counts: nothing is kept until the reader has scrolled.
  let scrolled = false;
  let ticking = false;
  const update = () => {
    const p = progress();
    if (bar) bar.style.transform = `scaleX(${p})`;
    markSection();
    if (scrolled) remember(p);
    ticking = false;
  };
  const request = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };

  // On a phone the contents are folded above the text; a chosen section closes them again.
  const fold = article.querySelector(".article-toc-fold");
  fold?.addEventListener("click", (event) => { if (event.target.closest("a")) fold.open = false; });

  window.addEventListener("scroll", () => { scrolled = true; request(); }, { passive: true });
  window.addEventListener("resize", request);
  update();
})();

// The checklist at the end of an essay: the count of ticked questions, and a copy of them as text.
document.querySelectorAll("[data-essay-checklist]").forEach((box) => {
  const items = [...box.querySelectorAll("[data-checklist-item]")];
  const count = box.querySelector("[data-checklist-count]");
  const update = () => { count.textContent = `${items.filter((item) => item.checked).length}/${items.length}`; };
  items.forEach((item) => item.addEventListener("change", update));
  update();
  const button = box.querySelector("[data-checklist-copy]");
  const label = button?.textContent;
  button?.addEventListener("click", async () => {
    const title = box.querySelector(".kicker")?.textContent.trim() || "";
    const lines = items.map((item, i) => `${i + 1}. ${item.closest("label").textContent.trim()}`);
    try {
      await navigator.clipboard.writeText([title, "", ...lines].join("\n"));
      button.textContent = button.dataset.copiedLabel || label;
      setTimeout(() => { button.textContent = label; }, 2000);
    } catch { /* clipboard unavailable */ }
  });
});
