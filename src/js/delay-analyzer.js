(() => {
  const root = document.querySelector("[data-delay-analyzer]");
  const dataEl = document.getElementById("delay-analyzer-data");
  if (!root || !dataEl || !window.ToolKit) return;

  const {
    tx, showDate, lower,
    read, write, isObject, str, loadState, el, int, pct, plural, today,
    parseNumber, parseDate, splitLine, canon, sigmaText,
    panel, stat, barList, focusCard, resultActions, flash, downloadCsv, floorCheck, LOG_LIMIT, shownNote, renderOnPause,
  } = window.ToolKit;

  const data = JSON.parse(dataEl.textContent);
  const KEY = data.storageKey;
  const NOT_RECORDED = tx("Not recorded");
  const routes = (count) => plural(count, tx("route"), tx("routes"));
  const lateRoutes = (count) => plural(count, tx("late route"), tx("late routes"));
  const sideName = (side) => data.sides[side].name;
  const reasonNames = data.reasons.map((reason) => reason.name);
  const reasonInfo = Object.fromEntries(data.reasons.map((reason) => [reason.name, reason]));

  const entry = root.querySelector("[data-entry]");
  const logBody = root.querySelector("[data-log]");
  const logWrap = root.querySelector("[data-log-wrap]");
  const logEmpty = root.querySelector("[data-log-empty]");
  const logCount = root.querySelector("[data-log-count]");
  const entryStatus = root.querySelector("[data-entry-status]");
  const importStatus = root.querySelector("[data-import-status]");
  const pasteArea = root.querySelector("#da-paste");
  const results = document.querySelector("[data-results]");

  const state = loadState(KEY, { period: "", routes: "", departureGrace: "10", arrivalGrace: "15", target: "", rows: [] });
  const save = () => write(KEY, state);

  // Times: 07:45, 7.45, 0745, 07:45:00, or an Excel day fraction (0.3229).
  const parseTime = (value) => {
    const text = String(value ?? "").trim();
    let minutes = NaN;
    let match = text.match(/^(\d{1,2})[:.](\d{2})(?::\d{2})?$/);
    if (match) minutes = Number(match[1]) * 60 + Number(match[2]);
    else if ((match = text.match(/^(\d{1,2})(\d{2})$/))) minutes = Number(match[1]) * 60 + Number(match[2]);
    else if (/^0?[.,]\d+$/.test(text)) minutes = Math.round(parseNumber(text) * 1440);
    if (!(minutes >= 0 && minutes < 1440) || (match && Number(match[2]) > 59)) return "";
    return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
  };
  const toMinutes = (time) => Number(time.slice(0, 2)) * 60 + Number(time.slice(3, 5));
  // Actual minus planned, in minutes; a route that crosses midnight stays close.
  const diff = (planned, actual) => {
    if (!planned || !actual) return null;
    let value = toMinutes(actual) - toMinutes(planned);
    if (value < -720) value += 1440;
    if (value > 720) value -= 1440;
    return value;
  };
  // Keep saved routes that still have both arrival times; see loadState.
  state.rows = state.rows.filter(isObject).map((row) => ({
    date: parseDate(row.date),
    shift: str(row.shift).trim() || NOT_RECORDED,
    route: str(row.route),
    planDep: parseTime(str(row.planDep)),
    actDep: parseTime(str(row.actDep)),
    planArr: parseTime(str(row.planArr)),
    actArr: parseTime(str(row.actArr)),
    reason: str(row.reason),
    note: str(row.note),
  })).filter((row) => row.planArr && row.actArr);
  const signed = (value) => (value === null ? "" : value > 0 ? `+${value}` : value < 0 ? `−${-value}` : "0");
  const minutes = (value) => `${int.format(Math.round(value))} min`;
  // Where a late route's delay began; the keys stay English, the names follow the page.
  const SIDES = ["Dock", "Dock and road", "Road", "Not known"];
  const SIDE_TITLES = {
    "Dock": "Left late, and most of the delay was already there at departure.",
    "Dock and road": "Left late, then lost even more time on the road.",
    "Road": "Left on time and lost the time on the road.",
    "Not known": "No departure times, so the delay cannot be split.",
  };

  const importRows = (text) => {
    const added = [];
    let skipped = 0;
    text.split(/\r?\n/).filter((line) => line.trim()).forEach((line, index) => {
      const [date, shift, route, planDep, actDep, planArr, actArr, reason, ...note] = splitLine(line);
      const row = {
        date: parseDate(date),
        shift: canon(data.shifts, shift, NOT_RECORDED),
        route: (route || "").trim(),
        planDep: parseTime(planDep),
        actDep: parseTime(actDep),
        planArr: parseTime(planArr),
        actArr: parseTime(actArr),
        reason: canon(reasonNames, reason, ""),
        note: note.join(", ").trim(),
      };
      // Without both arrival times a route cannot be judged; a first row like that is a header.
      if (!row.planArr || !row.actArr) {
        if (index > 0) skipped++;
        return;
      }
      added.push(row);
    });
    return { added, skipped };
  };

  const analyse = () => {
    const depGrace = Math.max(0, parseNumber(state.departureGrace) || 0);
    const arrGrace = Math.max(0, parseNumber(state.arrivalGrace) || 0);
    const rows = state.rows.map((row) => {
      const dep = diff(row.planDep, row.actDep);
      const arr = diff(row.planArr, row.actArr);
      const late = arr > arrGrace;
      let dock = null;
      let side = null;
      if (late) {
        dock = dep === null ? null : Math.min(Math.max(dep, 0), arr);
        side = dep === null ? "Not known"
          : dep <= depGrace ? "Road"
          : dock >= arr - dock ? "Dock"
          : "Dock and road";
      }
      return { ...row, dep, arr, late, lateDep: dep !== null && dep > depGrace, dock, side };
    });

    const logged = rows.length;
    const setRoutes = Math.round(parseNumber(state.routes));
    const total = setRoutes > logged ? setRoutes : logged;
    const late = rows.filter((row) => row.late);
    const lateMinutes = late.reduce((sum, row) => sum + row.arr, 0);
    const split = late.filter((row) => row.dock !== null);
    const splitMinutes = split.reduce((sum, row) => sum + row.arr, 0);
    const dockMinutes = split.reduce((sum, row) => sum + row.dock, 0);
    const withDep = rows.filter((row) => row.dep !== null);
    const rate = late.length / total;
    const target = parseNumber(state.target) / 100;

    const group = (items, keyOf) => {
      const map = new Map();
      items.forEach((row) => {
        const key = keyOf(row);
        const item = map.get(key) || { key, routes: 0, late: 0, minutes: 0 };
        item.routes += 1;
        if (row.late) {
          item.late += 1;
          item.minutes += row.arr;
        }
        map.set(key, item);
      });
      return [...map.values()];
    };

    const reasons = group(late, (row) => row.reason || NOT_RECORDED)
      .map((item) => ({ ...item, value: item.late }))
      .sort((a, b) => b.value - a.value || b.minutes - a.minutes || a.key.localeCompare(b.key));
    let running = 0;
    reasons.forEach((item) => {
      item.share = item.value / late.length;
      item.vital = running < 0.8;
      running += item.share;
      item.cumulative = running;
    });

    const sides = SIDES
      .map((id) => {
        const items = late.filter((row) => row.side === id);
        return { id, key: tx(id), value: items.length, minutes: items.reduce((sum, row) => sum + row.arr, 0) };
      })
      .filter((item) => item.value || item.id !== "Not known");

    const withRate = (items) => items.map((item) => ({ ...item, value: item.late / item.routes }));
    const hours = withRate(group(rows.filter((row) => row.planDep), (row) => `${row.planDep.slice(0, 2)}:00`))
      .sort((a, b) => a.key.localeCompare(b.key));
    const shifts = withRate(group(rows, (row) => row.shift || NOT_RECORDED))
      .sort((a, b) => (data.shifts.indexOf(a.key) + 1 || 99) - (data.shifts.indexOf(b.key) + 1 || 99));
    const worstHour = hours.filter((item) => item.routes >= 3 && item.late).sort((a, b) => b.value - a.value)[0];

    const buckets = [[1, 15], [16, 30], [31, 60], [61, 120], [121, Infinity]].map(([low, high]) => ({
      key: high === Infinity ? tx("Over {n} min", { n: low - 1 }) : `${low}–${high} min`,
      value: late.filter((row) => row.arr >= low && row.arr <= high).length,
    }));

    // Start where most late minutes began, with the most frequent reason on that side.
    const dockShare = splitMinutes ? dockMinutes / splitMinutes : null;
    const side = dockShare === null
      ? (late.filter((row) => reasonInfo[row.reason]?.side === "dock").length >= late.length / 2 ? "dock" : "road")
      : dockShare >= 0.5 ? "dock" : "road";
    const topReason = reasons.find((item) => reasonInfo[item.key]?.side === side) || reasons[0];

    return {
      rows,
      logged,
      total,
      setRoutesIgnored: setRoutes > 0 && setRoutes < logged,
      late,
      lateMinutes,
      dockShare,
      rate,
      onTime: 1 - rate,
      depOnTime: withDep.length ? withDep.filter((row) => !row.lateDep).length / withDep.length : null,
      target: target > 0 && target <= 1 ? target : null,
      reasons,
      sides,
      hours,
      shifts,
      worstHour,
      buckets,
      side,
      topReason,
      noReason: late.filter((row) => !row.reason).length,
      noDeparture: late.length - split.length,
      days: new Set(rows.map((row) => row.date).filter(Boolean)).size,
    };
  };

  // The log table.
  const renderLog = () => {
    const depGrace = Math.max(0, parseNumber(state.departureGrace) || 0);
    const arrGrace = Math.max(0, parseNumber(state.arrivalGrace) || 0);
    const rows = state.rows;
    logBody.replaceChildren();
    rows.map((row, index) => [row, index]).reverse().slice(0, LOG_LIMIT).forEach(([row, index]) => {
      const dep = diff(row.planDep, row.actDep);
      const arr = diff(row.planArr, row.actArr);
      const tr = el("tr");
      tr.append(el("td", "nowrap", showDate(row.date) || "-"));
      [row.shift, row.route, row.planDep, row.actDep, row.planArr, row.actArr].forEach((value) => tr.append(el("td", null, value || "")));
      const depCell = el("td", "num", signed(dep));
      if (dep > depGrace) depCell.classList.add("is-late");
      const arrCell = el("td", "num", signed(arr));
      if (arr > arrGrace) arrCell.classList.add("is-late");
      tr.append(depCell, arrCell);
      tr.append(el("td", null, row.reason || ""));
      tr.append(el("td", "dl-note", row.note || ""));
      const cell = el("td");
      const remove = el("button", "dl-remove", "×");
      remove.type = "button";
      remove.dataset.remove = index;
      remove.setAttribute("aria-label", tx(row.date ? "Remove route {route} planned {time} on {date}" : "Remove route {route} planned {time}", { route: row.route || "", time: row.planDep || row.planArr, date: showDate(row.date) }));
      cell.append(remove);
      tr.append(cell);
      logBody.append(tr);
    });
    logWrap.hidden = !rows.length;
    logEmpty.hidden = rows.length > 0;
    const late = rows.filter((row) => diff(row.planArr, row.actArr) > arrGrace).length;
    logCount.textContent = rows.length ? `${routes(rows.length)} · ${tx("{n} late", { n: int.format(late) })}${shownNote(rows.length)}` : "";
  };

  // Results.
  const sideText = (result) => {
    const share = result.side === "dock" ? result.dockShare : result.dockShare === null ? null : 1 - result.dockShare;
    return share === null
      ? tx("most late routes point to the {side}", { side: lower(sideName(result.side)) })
      : tx("{pct} of late minutes {lede}", { pct: pct(share, 0), lede: data.sides[result.side].lede });
  };

  const problemText = (result) => {
    const when = state.period ? `${state.period}: ` : "";
    const why = result.topReason ? tx(", mostly {cause}", { cause: lower(result.topReason.key) }) : "";
    return `${when}${tx("{n} of {routes} late ({pct} on time)", { n: int.format(result.late.length), routes: routes(result.total), pct: pct(result.onTime, 1) })}; ${sideText(result)}${why}.`;
  };

  const targetText = (result) => {
    if (!result.target) return null;
    const needed = Math.ceil(result.target * result.total - 1e-9);
    const gap = needed - (result.total - result.late.length);
    return gap > 0
      ? { value: tx("{n} short", { n: int.format(gap) }), note: tx("{routes} on time reach {pct}", { routes: plural(gap, tx("more route"), tx("more routes")), pct: pct(result.target, 1) }) }
      : { value: tx("On target"), note: tx("{routes} to spare at {pct}", { routes: routes(-gap), pct: pct(result.target, 1) }) };
  };

  let checkSummary = () => "";

  const summaryText = (result) => {
    const lines = [`${data.tool} | Stiven Catalyst`];
    if (state.period) lines.push(`${tx("Period")}: ${state.period}`);
    lines.push(
      "",
      tx("Routes: {total} · late: {late} · on time: {pct} · sigma level: {sigma}", { total: int.format(result.total), late: int.format(result.late.length), pct: pct(result.onTime, 1), sigma: sigmaText(result.rate) }),
      tx("Late means arrival more than {arr} min after plan; late departure more than {dep} min.", { arr: state.arrivalGrace || 0, dep: state.departureGrace || 0 })
    );
    if (result.late.length) {
      lines.push(`${tx("Average delay of late routes")}: ${minutes(result.lateMinutes / result.late.length)}`);
      if (result.dockShare !== null) lines.push(`${tx("Late minutes that started at the dock")}: ${pct(result.dockShare, 0)}`);
    }
    if (result.depOnTime !== null) lines.push(`${tx("On-time departures")}: ${pct(result.depOnTime, 1)}`);
    const target = targetText(result);
    if (target) lines.push(`${tx("Target {pct} on time", { pct: pct(result.target, 1) })}: ${target.note}`);
    if (result.late.length) {
      lines.push("", `${tx("Dock or road (late routes)")}:`);
      result.sides.forEach((item) => lines.push(`- ${item.key}: ${routes(item.value)}, ${minutes(item.minutes)}`));
      lines.push("", `${tx("Pareto of reasons")}:`);
      result.reasons.forEach((item) => lines.push(`- ${item.key}: ${item.value} (${pct(item.share, 0)}, ${tx("cum.")} ${pct(item.cumulative, 0)})${item.vital ? ` [${tx("vital few")}]` : ""}`));
    }
    lines.push("", `${tx("Late by planned departure hour")}:`);
    result.hours.forEach((item) => lines.push(`- ${item.key}: ${tx("{a} of {b}", { a: item.late, b: item.routes })} (${pct(item.value, 0)})`));
    lines.push("", `${tx("Late by shift")}:`);
    result.shifts.forEach((item) => lines.push(`- ${item.key}: ${tx("{a} of {b}", { a: item.late, b: item.routes })} (${pct(item.value, 0)})`));
    if (result.late.length) {
      lines.push("", `${tx("Start here")}: ${problemText(result)}`);
      const advice = reasonInfo[result.topReason?.key];
      if (advice) {
        lines.push(`${tx("First moves")}:`);
        advice.moves.forEach((move) => lines.push(`- ${move}`));
        lines.push(`${tx("Question for the floor")}: ${advice.question}`);
      }
    }
    const check = checkSummary();
    if (check) lines.push("", check);
    return lines.join("\n");
  };

  const rateBars = (items, options = {}) => barList(items, {
    ...options,
    label: (item) => [tx("{a} of {b}", { a: item.late, b: item.routes }), ` ${tx("late")} · ${pct(item.value, 0)}`],
    title: (item) => `${item.key}: ${tx("{n} of {routes} late", { n: item.late, routes: routes(item.routes) })}${item.late ? tx(", {min} late in total", { min: minutes(item.minutes) }) : ""}`,
  });

  const renderResults = () => {
    results.replaceChildren();
    results.hidden = !state.rows.length;
    if (!state.rows.length) return;
    const result = analyse();

    const head = el("div", "result-head");
    head.append(el("p", "kicker", state.period ? `${tx("Result")} · ${state.period}` : tx("Result")));
    const title = el("h2");
    title.append(`${tx("On time")} `, el("span", null, pct(result.onTime, 1)));
    head.append(title);
    results.append(head);

    const stats = el("div", "dl-stats");
    stats.append(stat(tx("Late routes"), tx("{a} of {b}", { a: int.format(result.late.length), b: int.format(result.total) }), `${tx("{routes} logged", { routes: routes(result.logged) })}${result.days ? ` ${tx("over {days}", { days: plural(result.days, tx("day"), tx("days")) })}` : ""}`));
    if (result.late.length) {
      stats.append(stat(tx("Average delay"), minutes(result.lateMinutes / result.late.length), tx("of the late routes")));
      if (result.dockShare !== null) stats.append(stat(tx("Started at the dock"), pct(result.dockShare, 0), tx("of late minutes")));
    }
    if (result.depOnTime !== null) stats.append(stat(tx("On-time departures"), pct(result.depOnTime, 1), tx("left within {n} min of plan", { n: state.departureGrace || 0 })));
    stats.append(stat(tx("Sigma level"), sigmaText(result.rate), tx("short term, with 1.5 shift")));
    const target = targetText(result);
    if (target) stats.append(stat(tx("Target"), target.value, target.note));
    results.append(stats);

    if (result.setRoutesIgnored) {
      results.append(el("p", "dl-warning", tx("Routes in the period is lower than the routes in the log, so the log count is used.")));
    }

    const grid = el("div", "dl-result-grid");
    if (result.late.length) {
      const sides = panel(tx("Dock or road"), result.dockShare === null
        ? tx("Add departure times to split late minutes between the dock and the road.")
        : tx("{pct} of late minutes started at the dock, before the vehicle left.", { pct: pct(result.dockShare, 0) }));
      const biggest = Math.max(...result.sides.map((item) => item.value));
      sides.append(barList(result.sides, {
        highlight: (item) => item.value === biggest,
        tag: tx("Most"),
        label: (item) => [int.format(item.value), ` ${item.value === 1 ? tx("route") : tx("routes")} · ${minutes(item.minutes)}`],
        title: (item) => tx(SIDE_TITLES[item.id]),
      }));
      grid.append(sides);

      const vital = result.reasons.filter((item) => item.vital);
      const pareto = panel(tx("Pareto of reasons"), tx("{a} of {b} reasons carry {pct} of late routes. Fix these first.", { a: vital.length, b: result.reasons.length, pct: pct(vital.at(-1).cumulative, 0) }));
      pareto.append(barList(result.reasons, {
        ranked: true,
        highlight: (item) => item.vital,
        tag: tx("Vital few"),
        label: (item) => [int.format(item.value), ` · ${pct(item.share, 0)} · ${pct(item.cumulative, 0)} ${tx("cum.")}`],
        title: (item) => `${item.key}${reasonInfo[item.key] ? ` (${lower(sideName(reasonInfo[item.key].side))})` : ""}: ${lateRoutes(item.value)}${tx(", {min} late in total", { min: minutes(item.minutes) })}`,
      }));
      grid.append(pareto);
    }

    const hours = panel(tx("By planned departure hour"), tx("Share of routes that arrived late, by the hour they were planned to leave."));
    hours.append(rateBars(result.hours, { highlight: (item) => item === result.worstHour, tag: tx("Worst") }));
    grid.append(hours);

    const shifts = panel(tx("By shift"), tx("Share of each shift's routes that arrived late."));
    shifts.append(rateBars(result.shifts));
    grid.append(shifts);

    if (result.late.length) {
      const spread = panel(tx("How late"), tx("Late routes by minutes after the planned arrival."));
      spread.append(barList(result.buckets, {
        label: (item) => [int.format(item.value), ` ${item.value === 1 ? tx("route") : tx("routes")}`],
        title: (item) => `${item.key}: ${routes(item.value)}`,
      }));
      grid.append(spread);
    }
    results.append(grid);

    if (result.late.length) {
      const warnings = [];
      if (result.noReason / result.late.length > 0.15) warnings.push(tx("{pct} of late routes have no reason. Record it the same day, while people still remember.", { pct: pct(result.noReason / result.late.length, 0) }));
      if (result.noDeparture) warnings.push(tx(result.noDeparture === 1 ? "{routes} has no departure time, so its delay cannot be split between dock and road." : "{routes} have no departure time, so their delay cannot be split between dock and road.", { routes: lateRoutes(result.noDeparture) }));
      const reason = result.topReason;
      results.append(focusCard({
        title: sideName(result.side),
        detail: reason?.key,
        lede: problemText(result),
        advice: reasonInfo[reason?.key],
        extraLabel: tx("Why the {side} first", { side: lower(sideName(result.side)) }),
        extra: data.sides[result.side].advice,
        warning: warnings.join(" "),
      }));
      results.append(resultActions(() => summaryText(result), problemText(result)));
    } else {
      const card = el("article", "result-card dl-focus");
      card.append(el("p", "result-label", tx("No late routes")));
      card.append(el("p", "dl-focus-lede", tx("Every logged route arrived within {n} minutes of plan.", { n: state.arrivalGrace || 0 })));
      results.append(card);
    }
  };

  const render = () => {
    renderLog();
    renderResults();
  };

  // Period settings.
  const renderSetting = renderOnPause(() => {
    save();
    render();
  }, () => state.rows.length);
  root.querySelectorAll("[data-setting]").forEach((input) => {
    input.value = state[input.name] ?? "";
    input.addEventListener("input", () => {
      state[input.name] = input.value;
      renderSetting();
    });
  });

  // Log a route.
  entry.elements.date.value = today();
  entry.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = entry.elements;
    const row = {
      date: form.date.value,
      shift: form.shift.value,
      route: form.route.value.trim(),
      planDep: parseTime(form.planDep.value),
      actDep: parseTime(form.actDep.value),
      planArr: parseTime(form.planArr.value),
      actArr: parseTime(form.actArr.value),
      reason: form.reason.value,
      note: form.note.value.trim(),
    };
    if (!row.planArr || !row.actArr) {
      flash(entryStatus, tx("Enter the planned and actual arrival."));
      return;
    }
    state.rows.push(row);
    save();
    render();
    // Keep date and shift: the next route is usually from the same wave.
    ["route", "planDep", "actDep", "planArr", "actArr", "note"].forEach((name) => { form[name].value = ""; });
    form.reason.value = "";
    const arr = diff(row.planArr, row.actArr);
    flash(entryStatus, tx("Added {route}: {n} min at arrival.", { route: row.route || tx("route"), n: signed(arr) }));
    form.route.focus();
  });

  root.querySelector("[data-import]").addEventListener("click", () => {
    const { added, skipped } = importRows(pasteArea.value);
    if (!added.length) {
      flash(importStatus, tx("No rows found. Check that the arrival times are in columns six and seven."));
      return;
    }
    state.rows.push(...added);
    save();
    render();
    pasteArea.value = "";
    flash(importStatus, `${tx("Imported {rows}", { rows: routes(added.length) })}${skipped ? tx(", skipped {n} without arrival times", { n: skipped }) : ""}.`);
  });

  logBody.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove]");
    if (!button) return;
    state.rows.splice(Number(button.dataset.remove), 1);
    save();
    render();
    (logBody.querySelector("[data-remove]") || entry.elements.date).focus();
  });

  root.querySelector("[data-example]").addEventListener("click", () => {
    const { rows, ...settings } = data.example;
    Object.assign(state, settings);
    state.rows = importRows(rows.map((row) => row.replace(/\|/g, "\t")).join("\n")).added;
    root.querySelectorAll("[data-setting]").forEach((input) => { input.value = state[input.name]; });
    save();
    render();
    results.scrollIntoView({ behavior: "smooth", block: "start" });
    results.focus({ preventScroll: true });
  });

  root.querySelector("[data-clear]").addEventListener("click", () => {
    if (!state.rows.length || !window.confirm(tx("Clear the whole route log?"))) return;
    state.rows = [];
    save();
    render();
  });

  root.querySelector("[data-csv]").addEventListener("click", () => {
    if (!state.rows.length) return;
    const { rows } = analyse();
    downloadCsv(data.csv, [
      ["Date", "Shift", "Route", "Planned departure", "Actual departure", "Planned arrival", "Actual arrival", "Departure delay (min)", "Arrival delay (min)", "Late", "Reason", "Note"].map((name) => tx(name)),
      ...rows.map((row) => [row.date, row.shift, row.route, row.planDep, row.actDep, row.planArr, row.actArr, row.dep ?? "", row.arr ?? "", row.late ? tx("yes") : tx("no"), row.reason, row.note]),
    ]);
  });

  checkSummary = floorCheck(document.querySelector("[data-floor-check]"), `${KEY}-check`);
  render();
})();
