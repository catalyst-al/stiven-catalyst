// The Publications page's "Continue where you left off" (pages/publications.njk): the issue, volume, book or guide
// this browser turned the pages of most recently and did not finish, in the page's language, from what the reader
// keeps (localStorage "sc-book-recent", js/book.js), with the page it stopped at; the link opens it on that page.
// Nothing is sent; a reader who has not opened one sees nothing.
(() => {
  const box = document.querySelector("[data-pub-continue]");
  if (!box) return;
  let recent = [];
  try { recent = JSON.parse(localStorage.getItem("sc-book-recent") || "[]") || []; } catch { return; }
  // This page's language: its address starts with /de/ or /sq/, or with neither for English.
  const prefix = location.pathname.match(/^\/(de|sq)\//)?.[0] || "/";
  const sameLanguage = (u) => (prefix === "/" ? !/^\/(de|sq)\//.test(u) : u.startsWith(prefix));
  const pick = recent
    .filter((entry) => entry && typeof entry.u === "string" && entry.u.startsWith("/") && sameLanguage(entry.u) && entry.p > 1 && entry.p < entry.n)
    .sort((a, b) => (b.t || 0) - (a.t || 0))[0];
  if (!pick) return;
  box.querySelector("[data-pub-continue-link]").href = `${pick.u}#faqe-${pick.p}`;
  box.querySelector("[data-pub-continue-meta]").textContent = [pick.k, (box.dataset.pageLabel || "{n} / {total}").replace("{n}", pick.p).replace("{total}", pick.n)].filter(Boolean).join(" · ");
  box.querySelector("[data-pub-continue-title]").textContent = pick.h;
  box.hidden = false;
})();
