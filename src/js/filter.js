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
  // Insights: the months of the essays (the newest first) and a page of twelve with "show more" below the list.
  const months = [...controls.querySelectorAll("[data-filter-month]")];
  const page = Number(controls.dataset.page) || Infinity;
  const more = list.querySelector("[data-filter-more]");

  const params = new URLSearchParams(location.search);
  let topic = chips.some((chip) => chip.dataset.topic === params.get("topic")) ? params.get("topic") : "";
  let month = (months.find((button) => button.dataset.filterMonth === params.get("month")) || months[0])?.dataset.filterMonth || "";
  let limit = page;
  search.value = params.get("q") || "";

  // An item can belong to several topics, written "a|b" (the essays and their challenges); the notes have one.
  const inTopic = (item, id) => item.dataset.topic.split("|").includes(id);

  const apply = () => {
    const words = search.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const inMonth = items.filter((item) => !month || item.dataset.month === month);
    // How many items each topic has in the month; a topic with none is left out of the row.
    chips.forEach((chip) => {
      const n = chip.querySelector("[data-chip-count]");
      if (!n || !chip.dataset.topic) return;
      n.textContent = inMonth.filter((item) => inTopic(item, chip.dataset.topic)).length;
      chip.hidden = n.textContent === "0";
    });
    if (topic && chips.find((chip) => chip.dataset.topic === topic)?.hidden) topic = "";
    const matches = inMonth.filter((item) => (!topic || inTopic(item, topic)) && words.every((word) => item.dataset.search.includes(word)));
    const visible = new Set(matches.slice(0, limit));
    items.forEach((item) => { item.hidden = !visible.has(item); });
    chips.forEach((chip) => chip.setAttribute("aria-pressed", String(chip.dataset.topic === topic)));
    months.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.filterMonth === month)));
    empty.hidden = matches.length > 0;
    const filtered = topic || words.length;
    count.textContent = filtered ? countLabel.replace("{a}", matches.length).replace("{b}", inMonth.length) : "";
    if (more) {
      more.hidden = visible.size >= matches.length;
      more.querySelector(".weekly-shown").textContent = countLabel.replace("{a}", visible.size).replace("{b}", matches.length);
    }

    // Keep the current filter in the address so it can be shared.
    // Other parameters in the address (a campaign tag, for example) are left as they are.
    const next = new URLSearchParams(location.search);
    next.delete("topic");
    next.delete("q");
    next.delete("month");
    if (month && month !== months[0]?.dataset.filterMonth) next.set("month", month);
    if (topic) next.set("topic", topic);
    if (search.value.trim()) next.set("q", search.value.trim());
    const query = next.toString();
    history.replaceState(null, "", query ? `?${query}${location.hash}` : location.pathname + location.hash);
  };
  // Every new choice starts again from the first page.
  const choose = () => {
    limit = page;
    apply();
  };

  months.forEach((button) => button.addEventListener("click", () => {
    month = button.dataset.filterMonth;
    choose();
  }));
  more?.querySelector("button").addEventListener("click", () => {
    const before = items.filter((item) => !item.hidden).length;
    limit += page;
    apply();
    // Keyboard and screen-reader users go on from the first row that just appeared.
    const first = items.filter((item) => !item.hidden)[before];
    (first?.matches("a") ? first : first?.querySelector("a"))?.focus();
  });
  chips.forEach((chip) => chip.addEventListener("click", () => {
    topic = chip.dataset.topic;
    choose();
  }));
  search.addEventListener("input", choose);
  search.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && search.value) {
      search.value = "";
      choose();
    }
  });

  apply();
})();
