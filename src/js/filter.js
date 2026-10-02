// "New" on essays from the last seven days, by the reader's own date.
document.querySelectorAll("[data-new-since]").forEach((badge) => {
  const days = (Date.now() - new Date(`${badge.dataset.newSince}T00:00:00`).getTime()) / 864e5;
  badge.hidden = !(days >= -1 && days < 7);
});

(() => {
  const list = document.querySelector("[data-filter-list]");
  const controls = list?.querySelector("[data-filter-controls]");
  if (!list || !controls) return;

  const items = [...list.querySelectorAll("[data-filter-item]")];
  const search = controls.querySelector("[data-filter-search]");
  const chips = [...controls.querySelectorAll("[data-topic]")];
  const count = controls.querySelector("[data-filter-count]");
  const empty = list.querySelector("[data-filter-empty]");
  // "{a} of {b} essays", in the page's language.
  const countLabel = controls.dataset.countLabel || "{a} of {b}";

  const params = new URLSearchParams(location.search);
  let topic = chips.some((chip) => chip.dataset.topic === params.get("topic")) ? params.get("topic") : "";
  search.value = params.get("q") || "";

  const apply = () => {
    const words = search.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    let shown = 0;
    items.forEach((item) => {
      const match = (!topic || item.dataset.topic === topic) && words.every((word) => item.dataset.search.includes(word));
      item.hidden = !match;
      if (match) shown++;
    });
    chips.forEach((chip) => chip.setAttribute("aria-pressed", String(chip.dataset.topic === topic)));
    empty.hidden = shown > 0;
    const filtered = topic || words.length;
    count.textContent = filtered ? countLabel.replace("{a}", shown).replace("{b}", items.length) : "";

    // Keep the current filter in the address so it can be shared.
    // Other parameters in the address (a campaign tag, for example) are left as they are.
    const next = new URLSearchParams(location.search);
    next.delete("topic");
    next.delete("q");
    if (topic) next.set("topic", topic);
    if (search.value.trim()) next.set("q", search.value.trim());
    const query = next.toString();
    history.replaceState(null, "", query ? `?${query}${location.hash}` : location.pathname + location.hash);
  };

  chips.forEach((chip) => chip.addEventListener("click", () => {
    topic = chip.dataset.topic;
    apply();
  }));
  search.addEventListener("input", apply);
  search.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && search.value) {
      search.value = "";
      apply();
    }
  });

  apply();
})();
