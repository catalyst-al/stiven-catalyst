(() => {
  const form = document.querySelector("[data-diagnostic]");
  const resultBox = document.querySelector("[data-result]");
  const progress = document.querySelector("[data-progress]");
  const data = JSON.parse(document.getElementById("kpi-diagnostic-data").textContent);
  if (!form || !resultBox) return;

  const tx = window.ToolKit?.tx || ((text, vars = {}) => text.replace(/\{(\w+)\}/g, (m, name) => (name in vars ? vars[name] : m)));
  const total = data.statements.length;
  const maxPerCause = (data.scale.length - 1) * 2;
  let coachingResult = null;
  window.CoachingToolResult = { tool: 'kpi-diagnostic', get: () => coachingResult };
  const invalidate = () => { coachingResult = null; window.dispatchEvent(new CustomEvent('coaching:result')); };
  form.addEventListener('input', invalidate);
  form.addEventListener('change', invalidate);

  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  const answered = () => form.querySelectorAll("input[type=radio]:checked");

  const updateProgress = () => {
    progress.textContent = tx("{a} of {b} answered", { a: answered().length, b: total });
  };
  form.addEventListener("change", updateProgress);

  const scores = () => {
    const result = Object.fromEntries(Object.keys(data.causes).map((key) => [key, 0]));
    answered().forEach((input) => {
      result[input.dataset.cause] += Number(input.value);
    });
    return Object.entries(result).sort((a, b) => b[1] - a[1]);
  };

  // The causes worth naming, as a hypothesis: the answers are one person's ratings of two statements per cause, so a
  // cause is named only when it stands clearly apart. The leader needs more than half the maximum (4 of 6), and the
  // named causes need two points over every cause left out. Causes one point apart are near-ties: one notch on one
  // statement is not a difference, so they are named together (a chain: 6, 5, 4 names all three). When that takes in
  // all five, or the leader is at half the maximum or below, no cause is named.
  const topCauses = (ranked) => {
    const best = ranked[0][1];
    if (best <= maxPerCause / 2) return [];
    let k = 1;
    while (k < ranked.length && ranked[k - 1][1] - ranked[k][1] <= 1) k++;
    return k === ranked.length ? [] : ranked.slice(0, k).map(([key]) => key);
  };
  // "A", "A and B", "A, B and C".
  const joinAnd = (items) => (items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} ${tx("and")} ${items.at(-1)}`);
  const nameOf = (key) => data.causes[key].name;
  const scoreOf = (ranked, key) => ranked.find(([k]) => k === key)[1];
  // How far the named causes stand apart, in words: the margin over the next cause, and near-ties said as such. With no
  // cause named, the lean of the answers (when they are not all alike) with why it is not named.
  const marginText = (ranked, top) => {
    if (!top.length) {
      const best = ranked[0][1];
      if (best - ranked.at(-1)[1] < 2) return "";
      const leaning = ranked.filter(([, score]) => score === best).map(([key]) => nameOf(key));
      return tx("Your answers lean towards {cause} ({score}/{max}), but not by enough to name it: one notch on one statement would change the picture.", { cause: leaning.join(" + "), score: best, max: maxPerCause });
    }
    const [next, nextScore] = ranked[top.length];
    const lowest = scoreOf(ranked, top.at(-1));
    if (top.length === 1) {
      return tx("{cause} scores {score}/{max}, {gap} points ahead of the next cause ({next}, {nextScore}/{max}).", { cause: nameOf(top[0]), score: lowest, max: maxPerCause, gap: lowest - nextScore, next: nameOf(next), nextScore });
    }
    return `${tx("{causes} are within one point of each other: your answers do not separate them.", { causes: joinAnd(top.map((key) => `${nameOf(key)} (${scoreOf(ranked, key)}/${maxPerCause})`)) })} ${tx("Together they are {gap} points ahead of the next cause ({next}, {nextScore}/{max}).", { gap: lowest - nextScore, next: nameOf(next), nextScore, max: maxPerCause })}`;
  };
  const CAVEAT = "These are your own ratings, two statements per cause. They show where to look first, not the cause itself. Before you act, check it: watch the work for a shift, ask two or three people who do it to rate the same statements, and look at the data behind the KPI.";
  const headline = (top) => tx(top.length > 1 ? "Leading hypotheses" : "Leading hypothesis");
  window.KpiDiagnostic = { topCauses };

  const summaryText = (kpi, ranked, top) => {
    const lines = [`${tx("KPI Diagnostic")} | Stiven Catalyst`];
    if (kpi) lines.push(`KPI: ${kpi}`);
    lines.push("");
    if (top.length) {
      lines.push(`${headline(top)}: ${top.map((key) => data.causes[key].name).join(" + ")}`, marginText(ranked, top));
      top.forEach((key) => {
        const cause = data.causes[key];
        lines.push("", `${cause.name}: ${cause.meaning}`, `${tx("First moves")}:`);
        cause.moves.forEach((move) => lines.push(`- ${move}`));
        lines.push(`${tx("Question for the floor")}: ${cause.question}`);
      });
    } else {
      lines.push(tx("No clear pattern. Go and watch the work where the number is produced."));
      const lean = marginText(ranked, top);
      if (lean) lines.push(lean);
    }
    lines.push("", tx(CAVEAT));
    lines.push("", `${tx("Scores")}:`);
    ranked.forEach(([key, score]) => lines.push(`- ${data.causes[key].name}: ${score}/${maxPerCause}`));
    return lines.join("\n");
  };

  const copy = async (text, button) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const area = el("textarea");
      area.value = text;
      document.body.append(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    const label = button.textContent;
    button.textContent = tx("Copied");
    setTimeout(() => { button.textContent = label; }, 1600);
  };

  const render = () => {
    const kpi = form.elements.kpi.value.trim();
    const ranked = scores();
    const top = topCauses(ranked);
    coachingResult = { version: 1, tool: 'kpi-diagnostic', captured: new Date().toISOString(), payload: { kpi, answers: [...answered()].map(i => ({ key: i.dataset.cause, score: Number(i.value) })), scores: ranked.map(([key, score]) => ({ key, label: data.causes[key].name, score })) } };
    window.dispatchEvent(new CustomEvent('coaching:result'));

    resultBox.replaceChildren();
    const head = el("div", "result-head");
    head.append(el("p", "kicker", kpi ? `${tx("Result")} · ${kpi}` : tx("Result")));
    const title = el("h2");
    if (top.length) {
      title.append(`${headline(top)}: `);
      title.append(el("span", null, top.map((key) => data.causes[key].name).join(" + ")));
    } else {
      title.append(`${tx("No single cause")} `);
      title.append(el("span", null, tx("stands out.")));
    }
    head.append(title);
    const margin = marginText(ranked, top);
    if (margin) head.append(el("p", "result-margin", margin));
    resultBox.append(head);

    const grid = el("div", "result-grid");
    const detail = el("div", "result-detail");
    if (top.length) {
      top.forEach((key) => {
        const cause = data.causes[key];
        const card = el("article", "result-card");
        card.append(el("h3", null, cause.name));
        card.append(el("p", null, cause.meaning));
        card.append(el("p", "result-label", tx("First moves")));
        const list = el("ol", "moves");
        cause.moves.forEach((move) => list.append(el("li", null, move)));
        card.append(list);
        card.append(el("p", "result-label", tx("Question for the floor")));
        card.append(el("blockquote", null, cause.question));
        detail.append(card);
      });
    } else {
      const card = el("article", "result-card");
      card.append(el("h3", null, tx("Go and see the work")));
      card.append(el("p", null, tx("Your answers do not point strongly to one cause. That usually means the problem is not visible from where the number is reported. Spend one shift where the result is produced, follow one case from start to finish and note where it first deviates.")));
      detail.append(card);
    }
    // Whatever the result: how sure it can be, and how to check it.
    const check = el("article", "result-card result-caveat");
    check.append(el("p", "result-label", tx("How sure is this?")), el("p", null, tx(CAVEAT)));
    detail.append(check);
    grid.append(detail);

    const bars = el("div", "result-bars");
    bars.append(el("p", "result-label", tx("All five causes")));
    ranked.forEach(([key, score]) => {
      const row = el("div", "bar-row");
      if (top.includes(key)) row.classList.add("is-top");
      const label = el("div", "bar-label");
      label.append(el("span", null, data.causes[key].name), el("span", null, `${score}/${maxPerCause}`));
      const track = el("div", "bar-track");
      const fill = el("div", "bar-fill");
      fill.style.width = `${(score / maxPerCause) * 100}%`;
      track.append(fill);
      row.append(label, track);
      bars.append(row);
    });
    grid.append(bars);
    resultBox.append(grid);

    const actions = el("div", "tool-actions result-actions");
    const copyButton = el("button", "button-primary", tx("Copy summary"));
    copyButton.type = "button";
    copyButton.addEventListener("click", () => copy(summaryText(kpi, ranked, top), copyButton));
    const printButton = el("button", "button-secondary", tx("Print or save as PDF"));
    printButton.type = "button";
    printButton.addEventListener("click", () => window.print());
    const resetButton = el("button", "button-secondary", tx("Start again"));
    resetButton.type = "button";
    resetButton.addEventListener("click", () => {
      form.reset();
      invalidate();
      updateProgress();
      resultBox.hidden = true;
      document.body.classList.remove("has-result");
      form.scrollIntoView({ behavior: "smooth", block: "start" });
      form.querySelector("input").focus({ preventScroll: true });
    });
    // The result as the problem of a 5 Whys worksheet (the worksheet next to this tool, ?problem=).
    const whys = el("a", "button-secondary", tx("Take it to 5 Whys"));
    const whysUrl = new URL(document.querySelector("a[data-five-whys]")?.getAttribute("href") || "../five-whys/", location.href);
    whysUrl.searchParams.set("problem", top.length
      ? tx("{kpi} is red; the self-assessment points to {cause}, a hypothesis to check.", { kpi: kpi || "KPI", cause: top.map((key) => data.causes[key].name).join(" + ") })
      : tx("{kpi} is red; no single cause stands out in the diagnostic.", { kpi: kpi || "KPI" }));
    whys.href = whysUrl.href;
    actions.append(copyButton, printButton, whys);
    // A self-assessment is a reason to go and check, not a finding: the action is the check, at Medium priority.
    if (window.ToolKit?.trackerLink) actions.append(window.ToolKit.trackerLink(tx("Add to actions"), { title: top.length ? tx("Check on the floor: {cause} behind {kpi}", { kpi: kpi || "KPI", cause: top.map((key) => data.causes[key].name).join(" + ") }) : tx("First move on {kpi}: {cause}", { kpi: kpi || "KPI", cause: tx("find the cause") }), detail: whysUrl.searchParams.get("problem") || "", source: "kpi-diagnostic", priority: "Medium" }));
    actions.append(resetButton);
    resultBox.append(actions);

    resultBox.hidden = false;
    // When printing, show only the result.
    document.body.classList.add("has-result");
    resultBox.scrollIntoView({ behavior: "smooth", block: "start" });
    resultBox.focus({ preventScroll: true });
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const missing = [...form.querySelectorAll("fieldset.statement")].filter((set) => !set.querySelector("input:checked"));
    form.querySelectorAll(".statement.is-missing").forEach((set) => set.classList.remove("is-missing"));
    if (missing.length) {
      missing.forEach((set) => set.classList.add("is-missing"));
      progress.textContent = tx(missing.length === 1 ? "{n} statement left to answer" : "{n} statements left to answer", { n: missing.length });
      missing[0].scrollIntoView({ behavior: "smooth", block: "center" });
      missing[0].querySelector("input").focus({ preventScroll: true });
      return;
    }
    render();
  });

  form.addEventListener("change", (event) => {
    event.target.closest(".statement")?.classList.remove("is-missing");
  });
})();
