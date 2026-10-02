(() => {
  // The numbers behind Shift Pulse, without the page (tests/pulse-tools.test.cjs uses them too).
  // logs: { damage, incomplete, delay } as saved by the three logs ({ rows, ...settings }).
  // options: { from, to, shift } with ISO dates; shift "" means every shift.
  const clock = (time) => (/^\d{2}:\d{2}$/.test(String(time ?? "")) ? Number(time.slice(0, 2)) * 60 + Number(time.slice(3, 5)) : null);
  // Minutes after plan; a night route that crosses midnight stays inside twelve hours.
  const minutesLate = (planned, actual) => {
    const a = clock(planned);
    const b = clock(actual);
    if (a === null || b === null) return null;
    let value = b - a;
    if (value < -720) value += 1440;
    if (value > 720) value -= 1440;
    return value;
  };
  const days = (from, to) => {
    const list = [];
    for (let date = new Date(`${from}T00:00:00Z`); date <= new Date(`${to}T00:00:00Z`) && list.length < 400; date.setUTCDate(date.getUTCDate() + 1)) list.push(date.toISOString().slice(0, 10));
    return list;
  };
  // A count per day. "above" marks the latest day with entries when it is clearly worse than the days before it.
  const series = (list, valueOf) => {
    const byDay = list.map((day) => valueOf(day));
    const total = byDay.reduce((sum, value) => sum + value, 0);
    const latestIndex = byDay.map((value, i) => (value > 0 ? i : -1)).filter((i) => i >= 0).pop();
    const before = latestIndex === undefined ? [] : byDay.slice(0, latestIndex);
    const usual = before.some((value) => value > 0) ? before.reduce((sum, value) => sum + value, 0) / before.length : null;
    const latest = latestIndex === undefined ? null : { day: list[latestIndex], value: byDay[latestIndex] };
    return { byDay, total, average: total / list.length, latest, usual, above: Boolean(latest && usual !== null && latest.value >= 2 && latest.value > usual * 1.25) };
  };
  const compute = (logs, { from, to, shift = "" }) => {
    const list = days(from, to);
    const inWindow = (row) => typeof row.date === "string" && row.date >= from && row.date <= to && (!shift || row.shift === shift);
    const units = (row) => (Number(row.units) > 0 ? Math.round(Number(row.units)) : 1);
    const counted = (rows) => {
      const sums = new Map();
      rows.filter(inWindow).forEach((row) => sums.set(row.date, (sums.get(row.date) || 0) + units(row)));
      return series(list, (day) => sums.get(day) || 0);
    };
    const grace = (value, fallback) => {
      const number = Number(String(value ?? "").replace(",", "."));
      return Number.isFinite(number) && number >= 0 ? number : fallback;
    };
    const delay = logs.delay || { rows: [] };
    const arrGrace = grace(delay.arrivalGrace, 15);
    const routes = (delay.rows || []).filter(inWindow).map((row) => ({ date: row.date, arr: minutesLate(row.planArr, row.actArr) })).filter((row) => row.arr !== null);
    const lateByDay = new Map();
    const routesByDay = new Map();
    routes.forEach((row) => {
      routesByDay.set(row.date, (routesByDay.get(row.date) || 0) + 1);
      if (row.arr > arrGrace) lateByDay.set(row.date, (lateByDay.get(row.date) || 0) + 1);
    });
    const late = series(list, (day) => lateByDay.get(day) || 0);
    const rateByDay = list.map((day) => (routesByDay.get(day) ? (lateByDay.get(day) || 0) / routesByDay.get(day) : null));
    const withRoutes = rateByDay.map((value, i) => (value === null ? -1 : i)).filter((i) => i >= 0);
    const latestRate = withRoutes.length ? { day: list[withRoutes.at(-1)], value: rateByDay[withRoutes.at(-1)] } : null;
    const before = withRoutes.slice(0, -1);
    const usualRate = before.length ? before.reduce((sum, i) => sum + (lateByDay.get(list[i]) || 0), 0) / before.reduce((sum, i) => sum + routesByDay.get(list[i]), 0) : null;
    return {
      days: list,
      damage: counted((logs.damage || {}).rows || []),
      incomplete: counted((logs.incomplete || {}).rows || []),
      delay: {
        routes: routes.length,
        late: late.total,
        onTime: routes.length ? 1 - late.total / routes.length : null,
        lateByDay: late.byDay,
        routesByDay: list.map((day) => routesByDay.get(day) || 0),
        rateByDay,
        latest: latestRate,
        usualRate,
        above: Boolean(latestRate && usualRate !== null && latestRate.value > usualRate + 0.1 && (lateByDay.get(latestRate.day) || 0) >= 2),
      },
    };
  };
  window.PulseMath = { minutesLate, compute };

  const root = document.querySelector("[data-shift-pulse]");
  const dataEl = document.getElementById("shift-pulse-data");
  if (!root || !dataEl || !window.ToolKit) return;

  const { LANG, tx, int, pct, el, today, addDays, read, write, isObject, str, plural, showDate, dayMonth, trendFigure, panel, stat, copy } = window.ToolKit;
  const data = JSON.parse(dataEl.textContent);
  const SUFFIX = LANG === "en" ? "" : `-${LANG}`;
  const PREFS = `sc-shift-pulse${SUFFIX}`;
  const results = document.querySelector("[data-pulse-results]");
  const daysSelect = root.querySelector("[name=days]");
  const shiftSelect = root.querySelector("[name=shift]");
  const dayName = dayMonth(false);
  const dayLabel = (iso) => dayName(new Date(`${iso}T00:00:00Z`));

  const prefs = read(PREFS, {});
  daysSelect.value = ["7", "14", "30"].includes(String(prefs.days)) ? String(prefs.days) : "7";
  shiftSelect.value = data.shifts.includes(prefs.shift) ? prefs.shift : "";

  const logOf = (tool) => {
    const saved = read(`sc-${tool}${SUFFIX}`, {});
    return isObject(saved) && Array.isArray(saved.rows) ? { ...saved, rows: saved.rows.filter(isObject) } : { rows: [] };
  };
  // The open issues of the handover in progress, most urgent first.
  const openIssues = () => {
    const saved = read(`sc-shift-handover${SUFFIX}`, {});
    const issues = isObject(saved) && isObject(saved.current) && Array.isArray(saved.current.issues) ? saved.current.issues.filter(isObject) : [];
    const order = (priority) => (data.priorities.indexOf(priority) + 1 || 99);
    return issues.filter((issue) => issue.done !== true && str(issue.text).trim())
      .map((issue) => ({ text: str(issue.text).trim(), priority: str(issue.priority), owner: str(issue.owner).trim(), due: str(issue.due).trim(), carried: Number.isInteger(issue.carried) ? issue.carried : 0 }))
      .sort((a, b) => order(a.priority) - order(b.priority) || b.carried - a.carried);
  };

  // A small column chart for a card: one column per day, the latest day with entries in the alert colour.
  const SVG = "http://www.w3.org/2000/svg";
  const sparkline = (values, highlight) => {
    const W = 140, H = 36;
    const max = Math.max(...values, 0) || 1;
    const band = W / values.length;
    const svg = document.createElementNS(SVG, "svg");
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.setAttribute("class", "sp-spark");
    svg.setAttribute("aria-hidden", "true");
    values.forEach((value, i) => {
      const height = value > 0 ? Math.max(2, (value / max) * (H - 2)) : 1;
      const rect = document.createElementNS(SVG, "rect");
      rect.setAttribute("x", band * i + band * 0.15);
      rect.setAttribute("width", band * 0.7);
      rect.setAttribute("y", H - height);
      rect.setAttribute("height", height);
      rect.setAttribute("rx", 1.5);
      if (i === highlight) rect.setAttribute("class", "is-latest");
      svg.append(rect);
    });
    return svg;
  };

  const card = ({ label, value, note, values, highlight, above, tool, linkText }) => {
    const box = el("article", "sp-card");
    const head = el("div", "sp-card-head");
    head.append(el("p", "result-label", label));
    if (above) head.append(el("span", "dl-tag sp-flag", tx("Above usual")));
    box.append(head, el("strong", "sp-card-value", value), el("p", "dl-panel-note", note), sparkline(values, highlight));
    const link = el("a", "inline-link", linkText);
    link.href = new URL(`../${tool}/`, window.location.href).href;
    box.append(link);
    return box;
  };

  const trendOf = (model, key) => ({
    unit: "day",
    buckets: model.days.map((day, i) => ({ key: day, to: day, value: model[key].byDay[i] })),
  });
  const rateTrend = (model) => ({
    unit: "day",
    buckets: model.days.map((day, i) => ({ key: day, to: day, count: model.delay.lateByDay[i], total: model.delay.routesByDay[i], value: model.delay.routesByDay[i] ? model.delay.lateByDay[i] / model.delay.routesByDay[i] : 0 })),
  });

  const latestNote = (series, unit) => series.latest
    ? tx("{day}: {n} · usual {usual} a day", { day: dayLabel(series.latest.day), n: plural(series.latest.value, unit[0], unit[1]), usual: series.usual === null ? "–" : int.format(Math.round(series.usual * 10) / 10) })
    : tx("No entries in this period.");

  const spanText = (model) => `${dayLabel(model.days[0])} – ${dayLabel(model.days.at(-1))}${shiftSelect.value ? ` · ${shiftSelect.value}` : ""}`;

  const attention = (model, issues) => {
    const list = [];
    if (model.damage.above) list.push(tx("Damage is above the usual level on {day}: {n}.", { day: dayLabel(model.damage.latest.day), n: model.damage.latest.value }));
    if (model.incomplete.above) list.push(tx("Incomplete orders are above the usual level on {day}: {n}.", { day: dayLabel(model.incomplete.latest.day), n: model.incomplete.latest.value }));
    if (model.delay.above) list.push(tx("Late routes are above the usual level on {day}: {pct} late.", { day: dayLabel(model.delay.latest.day), pct: pct(model.delay.latest.value, 0) }));
    const noOwner = issues.filter((issue) => !issue.owner).length;
    if (noOwner) list.push(tx(noOwner === 1 ? "{n} open issue has no owner." : "{n} open issues have no owner.", { n: noOwner }));
    const carried = issues.filter((issue) => issue.carried > 0).length;
    if (carried) list.push(tx(carried === 1 ? "{n} issue has already been carried over from an earlier shift." : "{n} issues have already been carried over from earlier shifts.", { n: carried }));
    return list;
  };

  const summaryText = (model, issues, notes) => {
    const lines = [`Shift Pulse | Stiven Catalyst`, `${tx("Period")}: ${spanText(model)}`, ""];
    lines.push(`${tx("Damaged units")}: ${int.format(model.damage.total)}`);
    lines.push(`${tx("Incomplete orders")}: ${int.format(model.incomplete.total)}`);
    lines.push(model.delay.routes
      ? `${tx("On-time routes")}: ${pct(model.delay.onTime, 1)} (${tx("{a} of {b} late", { a: model.delay.late, b: plural(model.delay.routes, tx("route"), tx("routes")) })})`
      : `${tx("On-time routes")}: –`);
    if (notes.length) lines.push("", `${tx("Needs attention")}:`, ...notes.map((note) => `- ${note}`));
    lines.push("", `${tx("Open issues")} (${issues.length}):`);
    if (!issues.length) lines.push(`- ${tx("No open issues.")}`);
    issues.forEach((issue) => lines.push(`- [${issue.priority}] ${issue.text} · ${issue.owner || tx("no owner")}${issue.due ? ` · ${issue.due}` : ""}${issue.carried ? ` · ${tx("carried {n}×", { n: issue.carried })}` : ""}`));
    return lines.join("\n");
  };

  const render = () => {
    results.replaceChildren();
    const to = today();
    const from = addDays(to, -(Number(daysSelect.value) - 1));
    const logs = { damage: logOf("damage-control"), incomplete: logOf("incomplete-control"), delay: logOf("delay-analyzer") };
    const issues = openIssues();
    const model = compute(logs, { from, to, shift: shiftSelect.value });
    const empty = !logs.damage.rows.length && !logs.incomplete.rows.length && !logs.delay.rows.length;
    if (empty && !issues.length) {
      const note = el("article", "result-card dl-focus");
      note.append(el("p", "result-label", tx("Nothing to show yet")), el("p", "dl-focus-lede", tx("Shift Pulse reads the logs in this browser. Log a damaged unit, an incomplete order or a route, or start a handover, and it appears here.")));
      results.append(note);
      return;
    }

    const head = el("div", "result-head");
    head.append(el("p", "kicker", `${tx("Result")} · ${spanText(model)}`));
    const title = el("h2");
    title.append(tx("This shift at a glance"));
    head.append(title);

    const cards = el("div", "sp-cards");
    const lastIndex = (series) => (series.latest ? model.days.indexOf(series.latest.day) : -1);
    cards.append(
      card({ label: tx("Damaged units"), value: int.format(model.damage.total), note: latestNote(model.damage, [tx("unit"), tx("units")]), values: model.damage.byDay, highlight: lastIndex(model.damage), above: model.damage.above, tool: "damage-control", linkText: tx("Open Damage Control") }),
      card({ label: tx("Incomplete orders"), value: int.format(model.incomplete.total), note: latestNote(model.incomplete, [tx("order"), tx("orders")]), values: model.incomplete.byDay, highlight: lastIndex(model.incomplete), above: model.incomplete.above, tool: "incomplete-control", linkText: tx("Open Incomplete Control") }),
      card({
        label: tx("On-time routes"),
        value: model.delay.routes ? pct(model.delay.onTime, 1) : "–",
        note: model.delay.latest
          ? tx("{day}: {pct} late · usual {usual}", { day: dayLabel(model.delay.latest.day), pct: pct(model.delay.latest.value, 0), usual: model.delay.usualRate === null ? "–" : pct(model.delay.usualRate, 0) })
          : tx("No entries in this period."),
        values: model.delay.lateByDay,
        highlight: model.delay.latest ? model.days.indexOf(model.delay.latest.day) : -1,
        above: model.delay.above,
        tool: "delay-analyzer",
        linkText: tx("Open Delay Analyzer"),
      })
    );

    const notes = attention(model, issues);
    const attentionCard = el("article", "result-card dl-focus");
    attentionCard.append(el("p", "result-label", tx("Needs attention")));
    if (notes.length) {
      const list = el("ul", "sp-attention");
      notes.forEach((note) => list.append(el("li", null, note)));
      attentionCard.append(list);
    } else {
      attentionCard.append(el("p", "dl-focus-lede", tx("Nothing stands out. Keep logging where it happens.")));
    }

    const grid = el("div", "dl-result-grid");
    [["damage", tx("Damaged units"), trendOf(model, "damage"), tx("Damaged units per day")], ["incomplete", tx("Incomplete orders"), trendOf(model, "incomplete"), tx("Incomplete orders per day")]].forEach(([key, label, trend, unit]) => {
      if (!model[key].total) return;
      const box = panel(label, tx("Per day in this period. The dashed line is the average; the highest day is red."));
      box.append(trendFigure(trend, { title: `${label}: ${tx("Trend over time")}`, unit, average: tx("Average") }, `shift-pulse-${key}`));
      grid.append(box);
    });
    if (model.delay.routes) {
      const box = panel(tx("Late routes"), tx("Share of routes that were late per day. The dashed line is the average; the highest day is red."));
      box.append(trendFigure(rateTrend(model), { title: `${tx("Late routes")}: ${tx("Trend over time")}`, unit: tx("Late routes (%)"), average: tx("Average"), format: (value) => pct(value, 0) }, "shift-pulse-delay"));
      grid.append(box);
    }

    const issuesBox = panel(`${tx("Open issues")} (${issues.length})`, tx("From the handover in progress. Every issue needs an owner and a time."));
    if (issues.length) {
      const list = el("ul", "sp-issues");
      issues.forEach((issue) => {
        const item = el("li");
        item.append(el("span", "dl-tag", issue.priority), ` ${issue.text} `);
        item.append(el("small", null, `${issue.owner || tx("no owner")}${issue.due ? ` · ${issue.due}` : ""}${issue.carried ? ` · ${tx("carried {n}×", { n: issue.carried })}` : ""}`));
        list.append(item);
      });
      issuesBox.append(list);
    } else {
      issuesBox.append(el("p", "dl-panel-note", tx("No open issues.")));
    }
    const open = el("a", "inline-link", tx("Open Shift Handover"));
    open.href = new URL("../shift-handover/", window.location.href).href;
    issuesBox.append(open);
    grid.append(issuesBox);

    const actions = el("div", "tool-actions result-actions");
    const copyButton = el("button", "button-primary", tx("Copy summary"));
    copyButton.type = "button";
    copyButton.addEventListener("click", () => copy(summaryText(model, issues, notes), copyButton));
    const printButton = el("button", "button-secondary", tx("Print or save as PDF"));
    printButton.type = "button";
    printButton.addEventListener("click", () => window.print());
    actions.append(copyButton, printButton);

    results.append(head, cards, attentionCard, grid, actions);
  };

  root.addEventListener("change", () => {
    write(PREFS, { days: daysSelect.value, shift: shiftSelect.value });
    render();
  });
  render();
})();
