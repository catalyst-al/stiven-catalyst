// The filter field of the Tools page (partials/tool-filter.njk): as the visitor types, only the tools whose name, type
// or description hold every word stay; a role with none left is hidden, and the role cards with it, so the matches
// come right under the field. Capitals and accents do not count ("ë" finds "e", "Maßnahmen" is found by
// "massnahmen"), nor do hyphens and slashes ("night audit" finds "Night-Audit-Protokoll"). Escape or the clear button
// brings the whole page back. A tool whose name holds every word comes first, in its role and its role first among
// the roles, so "pareto" puts Pareto 80/20 above the tools that only mention it; the cards are moved, not only drawn
// elsewhere, so the order read and tabbed through is the order seen, and clearing puts every card back in its place.
// Enter takes the keyboard (and a phone's "search" key) to the first match.
//
// Everything happens in this page: the words are not sent anywhere, not written to storage and not put in the
// address. Without scripts the field stays hidden (the "js" class of the head script) and the page is as before.
(() => {
  const root = document.querySelector("[data-tool-filter]");
  if (!root) return;
  const input = root.querySelector("[data-tool-filter-input]");
  const clear = root.querySelector("[data-tool-filter-clear]");
  const count = root.querySelector("[data-tool-filter-count]");
  const empty = document.querySelector("[data-tool-filter-empty]");
  const index = document.querySelector(".family-index");
  const sections = [...document.querySelectorAll(".family-section")];
  const total = root.dataset.total || "";
  const some = root.dataset.countLabel || "{a} / {b}";
  const one = root.dataset.oneLabel || some;

  // Lower case, without accents or the German sharp s, and with every run of other signs as one space.
  const fold = (text) => String(text || "").normalize("NFD").replace(/\p{M}+/gu, "").toLowerCase()
    .replace(/ß/g, "ss").replace(/[^\p{L}\p{N}]+/gu, " ").trim();

  // What a card is searched by: its name, its type (the first label above it) and its description, read once.
  const cards = sections.flatMap((section) => [...section.querySelectorAll(".tool-card")].map((card, at) => {
    const name = fold(card.querySelector("h2, h3")?.textContent);
    return { card, section, at, name, text: `${name} ${fold(card.querySelector(".card-meta span")?.textContent)} ${fold(card.querySelector("p")?.textContent)}` };
  }));
  // Where the sections and the cards go back to: each section before what followed the last of them, each card at the
  // end of its own grid, in the order of the page as built.
  const after = sections.at(-1)?.nextSibling ?? null;
  const place = (order) => {
    for (const section of order) section.parentNode.insertBefore(section, after);
  };
  const ordered = (list) => list.sort((a, b) => a.rank - b.rank || a.at - b.at);

  let last = null;
  const apply = () => {
    const words = fold(input.value).split(" ").filter(Boolean);
    const key = words.join(" ");
    clear.hidden = !input.value;
    if (key === last) return;
    last = key;
    // 0: every word in the name; 1: somewhere in the type or the description; no match: hidden.
    const best = new Map();
    let n = 0;
    for (const item of cards) {
      const match = words.every((word) => item.text.includes(word));
      item.rank = !words.length ? 0 : words.every((word) => item.name.includes(word)) ? 0 : 1;
      item.card.hidden = !match;
      if (match) {
        n += 1;
        best.set(item.section, Math.min(best.get(item.section) ?? 1, item.rank));
      }
    }
    for (const section of sections) {
      section.hidden = !best.has(section);
      const grid = section.querySelector(".tool-grid");
      for (const item of ordered(cards.filter((c) => c.section === section))) grid.appendChild(item.card);
    }
    place(sections.map((section, at) => ({ section, at, rank: best.get(section) ?? 1 })).sort((a, b) => a.rank - b.rank || a.at - b.at).map((s) => s.section));
    if (index) index.hidden = words.length > 0;
    empty.hidden = !words.length || n > 0;
    root.classList.toggle("is-filtering", words.length > 0);
    count.textContent = words.length ? (n === 1 ? one : some).replace("{a}", n).replace("{b}", cards.length) : total;
  };

  input.addEventListener("input", apply);
  input.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && input.value) {
      event.preventDefault();
      input.value = "";
      apply();
    }
    // The field is not part of a form: Enter goes to the first tool shown (the way into it), which also closes a
    // phone's keyboard so the matches can be seen.
    if (event.key === "Enter" && !event.isComposing) {
      event.preventDefault();
      if (last) document.querySelector(".family-section:not([hidden]) .tool-card:not([hidden]) a.text-link")?.focus();
    }
  });
  clear.addEventListener("click", () => {
    input.value = "";
    apply();
    input.focus();
  });
  // A page brought back by the Back button can come with the words still in the field.
  window.addEventListener("pageshow", apply);
  apply();
})();
