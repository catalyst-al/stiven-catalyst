(() => {
  // The numbers behind Shift Pulse, without the page (tests/pulse-tools.test.cjs uses them too).
  // logs: { damage, incomplete, delay } as saved by the three logs ({ rows, volumes, target, ...settings }).
  // options: { from, to, shift, unit } with ISO dates; shift "" means every shift; unit is "day" or "week" (a slot of
  // the period is a day, or a week from its Monday).
  const kit = window.ToolKit || {};
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
  const sum = (list) => list.reduce((total, value) => total + value, 0);
  const share = (value) => {
    const number = Number(String(value ?? "").replace(",", ".")) / 100;
    return number > 0 && number < 1 ? number : null;
  };

  // One KPI over the slots of the period. counts are per slot; totals are per slot when the KPI is a share of something
  // (the volume, the routes) and null when it is a plain count. latest is the last slot where present(i) holds, usual
  // what the slots before it ran at, and above says that the latest is clearly worse: worse(value, usual, before) with
  // the share for shares and the count otherwise, and always at least two entries.
  const level = (slots, counts, totals, present, worse) => {
    const index = counts.map((count, i) => i).filter(present).pop();
    if (index === undefined) return { latest: null, usual: null, usualShare: null, above: false };
    const before = counts.slice(0, index);
    const usual = before.some((count) => count > 0) ? sum(before) / before.length : null;
    if (!totals) {
      return { latest: { key: slots[index], count: counts[index], share: null }, usual, usualShare: null, above: usual !== null && counts[index] >= 2 && worse(counts[index], usual, before) };
    }
    const base = sum(totals.slice(0, index));
    const usualShare = base > 0 ? sum(before) / base : null;
    const latestShare = totals[index] > 0 ? counts[index] / totals[index] : null;
    return {
      latest: { key: slots[index], count: counts[index], share: latestShare },
      usual,
      usualShare,
      above: latestShare !== null && usualShare !== null && counts[index] >= 2 && worse(latestShare, usualShare, before),
    };
  };

  const compute = (logs, { from, to, shift = "", unit = "day" }) => {
    const list = days(from, to);
    const slotOf = unit === "week" ? kit.mondayOf : (day) => day;
    const slots = [...new Set(list.map(slotOf))];
    const at = new Map(slots.map((slot, i) => [slot, i]));
    const perSlot = (byDay) => {
      const out = slots.map(() => 0);
      byDay.forEach((value, day) => { out[at.get(slotOf(day))] += value; });
      return out;
    };
    const inWindow = (row) => typeof row.date === "string" && row.date >= from && row.date <= to && (!shift || row.shift === shift);
    const units = (row) => (Number(row.units) > 0 ? Math.round(Number(row.units)) : 1);

    // Damage and incomplete orders: counts, and rates when every day with entries has a volume. A volume is for the
    // whole day, so with one shift chosen there is no rate.
    const counted = (log) => {
      const saved = log || {};
      const rows = (saved.rows || []).filter(inWindow);
      const byDay = new Map();
      rows.forEach((row) => byDay.set(row.date, (byDay.get(row.date) || 0) + units(row)));
      const counts = perSlot(byDay);
      const total = sum(counts);
      const known = !shift && Array.isArray(saved.volumes) ? kit.cleanVolumes(saved.volumes) : [];
      const volumes = kit.dayVolumes(known, rows, from, to);
      const covered = volumes.items.length > 0 && !volumes.missing.length && !volumes.undated;
      const totals = covered ? perSlot(new Map(volumes.items.map((item) => [item.date, item.volume]))) : null;
      const found = level(slots, counts, totals, (i) => counts[i] > 0, totals
        ? (value, usual, before) => before.some((count) => count > 0) && value > usual * 1.25
        : (value, usual) => value > usual * 1.25);
      return {
        values: counts,
        total,
        ...found,
        volume: covered ? volumes.total : null,
        rate: covered && volumes.total > 0 && total <= volumes.total ? total / volumes.total : null,
        target: share(saved.target),
        dayRows: [...byDay].map(([date, count]) => ({ date, units: count })),
        volumes: volumes.items,
      };
    };

    const delay = logs.delay || { rows: [] };
    // The grace the Delay Analyzer saved (an empty box means none); 15 minutes when it never saved one.
    const grace = delay.arrivalGrace === undefined || delay.arrivalGrace === null ? NaN : Number(String(delay.arrivalGrace).replace(",", "."));
    const arrGrace = Number.isFinite(grace) && grace >= 0 ? grace : 15;
    const routes = (delay.rows || []).filter(inWindow).map((row) => ({ date: row.date, arr: minutesLate(row.planArr, row.actArr) })).filter((row) => row.arr !== null);
    const lateByDay = new Map();
    const routesByDay = new Map();
    routes.forEach((row) => {
      routesByDay.set(row.date, (routesByDay.get(row.date) || 0) + 1);
      if (row.arr > arrGrace) lateByDay.set(row.date, (lateByDay.get(row.date) || 0) + 1);
    });
    const lateSlots = perSlot(lateByDay);
    const routeSlots = perSlot(routesByDay);
    const found = level(slots, lateSlots, routeSlots, (i) => routeSlots[i] > 0, (value, usual) => value > usual + 0.1);
    const onTimeTarget = share(delay.target);

    return {
      unit,
      days: list,
      slots,
      damage: counted(logs.damage),
      incomplete: counted(logs.incomplete),
      delay: {
        routes: routes.length,
        late: sum(lateSlots),
        onTime: routes.length ? 1 - sum(lateSlots) / routes.length : null,
        values: lateSlots,
        routesBySlot: routeSlots,
        ...found,
        // The on-time target is a ceiling for the late share.
        lateTarget: onTimeTarget ? 1 - onTimeTarget : null,
      },
    };
  };
  window.PulseMath = { minutesLate, compute };

  const root = document.querySelector("[data-shift-pulse]");
  const dataEl = document.getElementById("shift-pulse-data");
  if (!root || !dataEl || !window.ToolKit) return;

  const { LANG, tx, int, pct, el, today, addDays, mondayOf, shareText, read, write, isObject, str, plural, dayMonth, trendFigure, trendShares, panel, copy } = window.ToolKit;
  const data = JSON.parse(dataEl.textContent);
  const SUFFIX = LANG === "en" ? "" : `-${LANG}`;
  const PREFS = `sc-shift-pulse${SUFFIX}`;
  const PERIODS = ["7", "14", "30", "w8", "w12"];
  const results = document.querySelector("[data-pulse-results]");
  const daysSelect = root.querySelector("[name=days]");
  const shiftSelect = root.querySelector("[name=shift]");
  const dayName = dayMonth(false);
  const dayLabel = (iso) => dayName(new Date(`${iso}T00:00:00Z`));

  const prefs = read(PREFS, {});
  daysSelect.value = PERIODS.includes(String(prefs.days)) ? String(prefs.days) : "7";
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

  // A small column chart for a card: one column per slot, the latest slot with entries in the alert colour.
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

  const card = ({ label, value, notes, values, highlight, above, tool, linkText }) => {
    const box = el("article", "sp-card");
    const head = el("div", "sp-card-head");
    head.append(el("p", "result-label", label));
    if (above) head.append(el("span", "dl-tag sp-flag", tx("Above usual")));
    box.append(head, el("strong", "sp-card-value", value));
    notes.filter(Boolean).forEach((note) => box.append(el("p", "dl-panel-note", note)));
    box.append(sparkline(values, highlight));
    const link = el("a", "inline-link", linkText);
    link.href = new URL(`../${tool}/`, window.location.href).href;
    box.append(link);
    return box;
  };

  // The period chosen: the last 7, 14 or 30 days, or whole weeks (this week so far and the ones before it).
  const periodOf = (value) => {
    const to = today();
    return value.startsWith("w")
      ? { unit: "week", from: addDays(mondayOf(to), -7 * (Number(value.slice(1)) - 1)), to }
      : { unit: "day", from: addDays(to, -(Number(value) - 1)), to };
  };

  const spanText = (model) => `${dayLabel(model.days[0])} – ${dayLabel(model.days.at(-1))}${shiftSelect.value ? ` · ${shiftSelect.value}` : ""}`;
  const slotIndex = (model, latest) => (latest ? model.slots.indexOf(latest.key) : -1);
  const weekly = (model) => model.unit === "week";

  // "Monday 14 Sept: 7 units · usual 1.8 a day" for a day, "Week of 14 Sept: 52 units · usual 40.5 a week" for a week.
  const latestNote = (model, series, nouns) => {
    if (!series.latest) return tx("No entries in this period.");
    const vars = { day: dayLabel(series.latest.key), n: plural(series.latest.count, nouns[0], nouns[1]), usual: series.usual === null ? "–" : int.format(Math.round(series.usual * 10) / 10) };
    return weekly(model) ? tx("Week of {day}: {n} · usual {usual} a week", vars) : tx("{day}: {n} · usual {usual} a day", vars);
  };
  const delayNote = (model) => {
    const delay = model.delay;
    if (!delay.latest) return tx("No entries in this period.");
    const vars = { day: dayLabel(delay.latest.key), pct: pct(delay.latest.share, 0), usual: delay.usualShare === null ? "–" : pct(delay.usualShare, 0) };
    return weekly(model) ? tx("Week of {day}: {pct} late · usual {usual}", vars) : tx("{day}: {pct} late · usual {usual}", vars);
  };

  const attention = (model, issues) => {
    const list = [];
    const w = weekly(model);
    if (model.damage.above) list.push(tx(w ? "Damage is above the usual level in the week of {day}: {n}." : "Damage is above the usual level on {day}: {n}.", { day: dayLabel(model.damage.latest.key), n: model.damage.latest.count }));
    if (model.incomplete.above) list.push(tx(w ? "Incomplete orders are above the usual level in the week of {day}: {n}." : "Incomplete orders are above the usual level on {day}: {n}.", { day: dayLabel(model.incomplete.latest.key), n: model.incomplete.latest.count }));
    if (model.delay.above) list.push(tx(w ? "Late routes are above the usual level in the week of {day}: {pct} late." : "Late routes are above the usual level on {day}: {pct} late.", { day: dayLabel(model.delay.latest.key), pct: pct(model.delay.latest.share, 0) }));
    const noOwner = issues.filter((issue) => !issue.owner).length;
    if (noOwner) list.push(tx(noOwner === 1 ? "{n} open issue has no owner." : "{n} open issues have no owner.", { n: noOwner }));
    const carried = issues.filter((issue) => issue.carried > 0).length;
    if (carried) list.push(tx(carried === 1 ? "{n} issue has already been carried over from an earlier shift." : "{n} issues have already been carried over from earlier shifts.", { n: carried }));
    return list;
  };

  const summaryText = (model, issues, notes) => {
    const lines = [`Shift Pulse | Stiven Catalyst`, `${tx("Period")}: ${spanText(model)}`, ""];
    [["damage", tx("Damaged units")], ["incomplete", tx("Incomplete orders")]].forEach(([key, label]) => {
      const series = model[key];
      lines.push(`${label}: ${int.format(series.total)}${series.rate !== null ? ` · ${data[key].rateLabel} ${shareText(series.rate)} (${int.format(series.total)}/${int.format(series.volume)})` : ""}`);
    });
    lines.push(model.delay.routes
      ? `${tx("On-time routes")}: ${pct(model.delay.onTime, 1)} (${tx("{a} of {b} late", { a: model.delay.late, b: plural(model.delay.routes, tx("route"), tx("routes")) })})`
      : `${tx("On-time routes")}: –`);
    if (notes.length) lines.push("", `${tx("Needs attention")}:`, ...notes.map((note) => `- ${note}`));
    lines.push("", `${tx("Open issues")} (${issues.length}):`);
    if (!issues.length) lines.push(`- ${tx("No open issues.")}`);
    issues.forEach((issue) => lines.push(`- [${issue.priority}] ${issue.text} · ${issue.owner || tx("no owner")}${issue.due ? ` · ${issue.due}` : ""}${issue.carried ? ` · ${tx("carried {n}×", { n: issue.carried })}` : ""}`));
    return lines.join("\n");
  };

  // One trend panel for damage or incomplete orders: a rate when the days have a volume, the counts otherwise.
  const countPanel = (model, key, label) => {
    const series = model[key];
    if (!series.total) return null;
    const unitName = weekly(model) ? tx("week") : tx("day");
    const per = weekly(model) ? tx("per week") : tx("per day");
    const options = { unit: model.unit, from: model.days[0], to: model.days.at(-1) };
    const shares = series.volumes.length ? trendShares(series.dayRows, (row) => row.units, series.volumes, 60, options) : null;
    if (shares && shares.buckets.filter((bucket) => bucket.total > 0).length > 1) {
      const text = data[key];
      const by = weekly(model) ? tx("week by week") : tx("day by day");
      const note = series.target
        ? tx("{rate} ({many} / {volume}), {by}. The dashed line is the average, the solid line the target; columns above it are red.", { rate: text.rateLabel, many: text.many, volume: text.volumeLabel, by })
        : tx("{rate} ({many} / {volume}), {by}. The dashed line is the average; the highest column is red.", { rate: text.rateLabel, many: text.many, volume: text.volumeLabel, by });
      const box = panel(label, note);
      box.append(trendFigure(shares, { title: `${label}: ${text.rateLabel}`, unit: text.rateLabel, average: tx("Average"), format: shareText, target: series.target, targetLabel: tx("Target") }, `shift-pulse-${key}`));
      if (shares.skipped.length) {
        const first = shares.skipped.slice(0, 5).map(dayLabel).join(", ");
        box.append(el("p", "dl-panel-note", tx(shares.skipped.length === 1 ? "{n} day with entries has no volume and is not in this chart: {days}." : "{n} days with entries have no volume and are not in this chart: {days}.", { n: shares.skipped.length, days: shares.skipped.length > 5 ? `${first}…` : first })));
      }
      return box;
    }
    const trend = { unit: model.unit, buckets: model.slots.map((slot, i) => ({ key: slot, to: slot, value: series.values[i] })) };
    const box = panel(label, tx("Per {unit} in this period. The dashed line is the average; the highest {unit} is red.", { unit: unitName }));
    box.append(trendFigure(trend, { title: `${label}: ${tx("Trend over time")}`, unit: `${label} ${per}`, average: tx("Average") }, `shift-pulse-${key}`));
    return box;
  };

  const delayPanel = (model) => {
    const delay = model.delay;
    if (!delay.routes) return null;
    const unitName = weekly(model) ? tx("week") : tx("day");
    const trend = {
      unit: model.unit,
      buckets: model.slots.map((slot, i) => ({ key: slot, to: slot, count: delay.values[i], total: delay.routesBySlot[i], value: delay.routesBySlot[i] ? delay.values[i] / delay.routesBySlot[i] : 0 })),
    };
    const note = delay.lateTarget
      ? tx("Share of routes that were late per {unit}. The dashed line is the average, the solid line the target; columns above it are red.", { unit: unitName })
      : tx("Share of routes that were late per {unit}. The dashed line is the average; the highest {unit} is red.", { unit: unitName });
    const box = panel(tx("Late routes"), note);
    box.append(trendFigure(trend, { title: `${tx("Late routes")}: ${tx("Trend over time")}`, unit: tx("Late routes (%)"), average: tx("Average"), format: (value) => pct(value, 0), target: delay.lateTarget, targetLabel: tx("Target") }, "shift-pulse-delay"));
    return box;
  };

  const render = () => {
    results.replaceChildren();
    const period = periodOf(daysSelect.value);
    const logs = { damage: logOf("damage-control"), incomplete: logOf("incomplete-control"), delay: logOf("delay-analyzer") };
    const issues = openIssues();
    const model = compute(logs, { ...period, shift: shiftSelect.value });
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
    title.append(weekly(model) ? tx("The weeks at a glance") : tx("This shift at a glance"));
    head.append(title);

    const rateLine = (key) => (model[key].rate === null ? "" : `${data[key].rateLabel}: ${shareText(model[key].rate)}`);
    const cards = el("div", "sp-cards");
    cards.append(
      card({ label: tx("Damaged units"), value: int.format(model.damage.total), notes: [rateLine("damage"), latestNote(model, model.damage, [tx("unit"), tx("units")])], values: model.damage.values, highlight: slotIndex(model, model.damage.latest), above: model.damage.above, tool: "damage-control", linkText: tx("Open Damage Control") }),
      card({ label: tx("Incomplete orders"), value: int.format(model.incomplete.total), notes: [rateLine("incomplete"), latestNote(model, model.incomplete, [tx("order"), tx("orders")])], values: model.incomplete.values, highlight: slotIndex(model, model.incomplete.latest), above: model.incomplete.above, tool: "incomplete-control", linkText: tx("Open Incomplete Control") }),
      card({
        label: tx("On-time routes"),
        value: model.delay.routes ? pct(model.delay.onTime, 1) : "–",
        notes: [delayNote(model)],
        values: model.delay.values,
        highlight: slotIndex(model, model.delay.latest),
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
    [countPanel(model, "damage", tx("Damaged units")), countPanel(model, "incomplete", tx("Incomplete orders")), delayPanel(model)].filter(Boolean).forEach((box) => grid.append(box));

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

    results.append(head, cards);
    if (weekly(model)) results.append(el("p", "dl-panel-note", tx("The latest week is the week so far.")));
    results.append(attentionCard, grid, actions);
  };

  root.addEventListener("change", () => {
    write(PREFS, { days: daysSelect.value, shift: shiftSelect.value });
    render();
  });
  render();
})();
