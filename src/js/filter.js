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
  // A link to one item (field-notes.html#note-…) opens the month it is in and shows it, however far down the list.
  let target = null;
  try {
    target = location.hash.length > 1 ? document.getElementById(decodeURIComponent(location.hash.slice(1))) : null;
  } catch {}
  const linked = target && items.find((item) => item.contains(target));
  if (linked?.dataset.month && !params.has("month")) month = linked.dataset.month;

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
  // After a click on a month or a topic (and on "show more"), the rows come in one after another (styles.css,
  // .is-entering); typing in the search box changes the list without it.
  const reveal = (from = 0) => {
    const shown = items.filter((item) => !item.hidden).slice(from);
    shown.forEach((item) => item.classList.remove("is-entering"));
    void list.offsetWidth;
    shown.forEach((item, i) => {
      item.style.setProperty("--i", Math.min(i, 12));
      item.classList.add("is-entering");
    });
  };
  items.forEach((item) => item.addEventListener("animationend", (event) => {
    if (event.target === item) item.classList.remove("is-entering");
  }));
  // Every new choice starts again from the first page.
  const choose = (animate) => {
    limit = page;
    apply();
    if (animate) reveal();
  };

  months.forEach((button) => button.addEventListener("click", () => {
    month = button.dataset.filterMonth;
    choose(true);
  }));
  more?.querySelector("button").addEventListener("click", () => {
    const before = items.filter((item) => !item.hidden).length;
    limit += page;
    apply();
    reveal(before);
    // Keyboard and screen-reader users go on from the first row that just appeared.
    const first = items.filter((item) => !item.hidden)[before];
    (first?.matches("a") ? first : first?.querySelector("a"))?.focus();
  });
  chips.forEach((chip) => chip.addEventListener("click", () => {
    topic = chip.dataset.topic;
    choose(true);
  }));
  search.addEventListener("input", () => choose());
  search.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && search.value) {
      search.value = "";
      choose();
    }
  });

  apply();
  if (linked) {
    while (linked.hidden && limit < items.length) {
      limit += page;
      apply();
    }
    if (!linked.hidden) target.scrollIntoView();
  }
})();
