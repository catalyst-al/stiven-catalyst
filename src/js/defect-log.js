(() => {
  // Shared by Damage Control and Incomplete Control. Each page supplies its
  // fields, wording, advice and example in #defect-log-data. The fields are
  // always shift, stage, type and cause, in that order.
  const root = document.querySelector("[data-defect-log]");
  const dataEl = document.getElementById("defect-log-data");
  if (!root || !dataEl || !window.ToolKit) return;

  const {
    tx, num, showDate, lower, addDays, cleanVolumes, importVolumes, dayVolumes, shareText,
    read, write, isObject, str, loadState, el, int, euro, pct, plural, capital, today,
    parseNumber, parseDate, parseRows, canon, sigma, sigmaText,
    inRange, dateSpan, spanText, logBook, resultLayout,
    panel, stat, barList, trendBuckets, trendShares, trendFigure, focusCard, resultActions, flash, floorCheck, recentExample } = window.ToolKit;

  const data = JSON.parse(dataEl.textContent);
  const t = data.text;
  const KEY = data.storageKey;
  const NOT_RECORDED = tx("Not recorded");
  // The cause that means "nobody knows"; German data names it in German.
  const UNKNOWN = data.unknownCause || "Unknown";
  const entries = (count) => plural(count, tx("entry"), tx("entries"));
  const fields = data.fields;
  const field = Object.fromEntries(fields.map((f) => [f.name, f]));

  const periodVolumeInput = root.querySelector('[name="volume"]');
  const periodVolumePlaceholder = periodVolumeInput.placeholder;
  const entry = root.querySelector("[data-entry]");
  const entryStatus = root.querySelector("[data-entry-status]");
  const pasteArea = root.querySelector("#dl-paste");
  const results = document.querySelector("[data-results]");

  const state = loadState(KEY, { period: "", volume: "", target: "", from: "", to: "", volumes: [], rows: [], example: {} });
  state.from = parseDate(state.from);
  state.to = parseDate(state.to);
  state.volumes = cleanVolumes(state.volumes);
  state.rows = state.rows.filter(isObject).map((row) => {
    const units = Math.round(Number(row.units));
    const cost = Number(row.cost);
    return {
      date: parseDate(row.date),
      ...Object.fromEntries(fields.map((f) => [f.name, str(row[f.name]).trim() || NOT_RECORDED])),
      units: units > 0 ? units : 1,
      cost: row.cost != null && row.cost !== "" && cost >= 0 ? cost : null,
      note: str(row.note),
    };
  });
  const save = () => write(KEY, state);

  const importRows = (text) => {
    const added = [];
    let skipped = 0;
    parseRows(text).forEach((cells, index) => {
      const [date, shift, stage, type, cause, units, cost, ...note] = cells;
      const count = units ? parseNumber(units) : 1;
      const wholeUnits = Math.round(count);
      if (!(wholeUnits > 0 && Number.isSafeInteger(wholeUnits))) {
        // A first row with words where numbers belong is a header.
        if (index > 0) skipped++;
        return;
      }
      const value = parseNumber(cost);
      added.push({
        date: parseDate(date),
        shift: canon(field.shift.options, shift, NOT_RECORDED),
        stage: canon(field.stage.options, stage, NOT_RECORDED),
        type: canon(field.type.options, type, NOT_RECORDED),
        cause: canon(field.cause.options, cause, NOT_RECORDED),
        units: wholeUnits,
        cost: value >= 0 ? value : null,
        note: note.join(", ").trim(),
      });
    });
    return { added, skipped };
  };

  // Tallies: item.value is the count of units (or orders) behind each name.
  const tally = (rows, name) => {
    const map = new Map();
    rows.forEach((row) => {
      const key = row[name] || NOT_RECORDED;
      const item = map.get(key) || { key, value: 0, entries: 0 };
      item.value += row.units;
      item.entries += 1;
      map.set(key, item);
    });
    return map;
  };
  // Known options in process order, then any other names by size.
  const inOrder = (map, name) => {
    const known = field[name].options.filter((option) => map.has(option)).map((option) => map.get(option));
    const rest = [...map.values()].filter((item) => !field[name].options.includes(item.key)).sort((a, b) => b.value - a.value);
    return [...known, ...rest];
  };
  const bySize = (map) => [...map.values()].sort((a, b) => b.value - a.value || a.key.localeCompare(b.key));

  const dayVolumesOf = (rows) => dayVolumes(state.volumes, rows, state.from, state.to);
  // Set by the page code below: the list of daily volumes, and whether the box opens (after loading the example).
  let renderVolumes = () => {};
  let openVolumes = false;

  // The rows of the chosen period; the volume and target belong to the same days.
  const periodRows = () => inRange(state.rows, state.from, state.to);
  // "Week 38" when the period has a name, else the days the rows cover.
  const periodName = (rows) => {
    if (state.period) return state.period;
    const span = dateSpan(rows);
    return span ? spanText(span) : "";
  };

  const analyse = () => {
    const rows = periodRows();
    const total = rows.reduce((sum, row) => sum + row.units, 0);
    const costed = rows.filter((row) => row.cost != null);
    const cost = costed.reduce((sum, row) => sum + row.cost, 0);
    // The volume typed for the period wins; without one, the daily volumes stand in for it when every day with entries has one.
    const days = dayVolumesOf(rows);
    const typed = parseNumber(state.volume);
    const fromDays = !(typed > 0) && days.items.length > 0 && !days.missing.length && !days.undated;
    const volume = fromDays ? days.total : typed;
    const target = parseNumber(state.target) / 100;
    const hasVolume = volume > 0 && total <= volume;
    const rate = hasVolume ? total / volume : null;

    const causes = bySize(tally(rows, "cause"));
    let running = 0;
    causes.forEach((item) => {
      item.share = item.value / total;
      item.vital = running < 0.8;
      running += item.share;
      item.cumulative = running;
    });

    const topStage = bySize(tally(rows, "stage"))[0];
    const topStageCause = bySize(tally(rows.filter((row) => row.stage === topStage.key), "cause"))[0];
    const unknown = rows.filter((row) => row.cause === UNKNOWN || row.cause === NOT_RECORDED).reduce((sum, row) => sum + row.units, 0);

    return {
      rows,
      total,
      cost: costed.length ? cost : null,
      volume: hasVolume ? volume : null,
      volumeFromDays: fromDays ? days.items.length : 0,
      dayVolumes: days,
      volumeTooLow: volume > 0 && total > volume,
      rate,
      dpmo: rate === null ? null : rate * 1e6,
      target: hasVolume && target > 0 ? target : null,
      causes,
      stages: inOrder(tally(rows, "stage"), "stage"),
      shifts: inOrder(tally(rows, "shift"), "shift"),
      types: inOrder(tally(rows, "type"), "type"),
      topStage,
      topStageCause,
      unknownShare: unknown / total,
      days: new Set(rows.map((row) => row.date).filter(Boolean)).size,
    };
  };

  // Results.
  const bars = (items, total, options = {}) => barList(items, {
    ...options,
    title: (item) => `${item.key}: ${tx("{count} in {entries}, {pct} of all {noun}", { count: plural(item.value, t.one, t.many), entries: entries(item.entries), pct: pct(item.value / total), noun: t.allNoun })}`,
    label: (item) => [int.format(item.value), ` · ${pct(item.value / total, 0)}${options.cumulative ? ` · ${pct(item.cumulative, 0)} ${tx("cum.")}` : ""}`],
  });

  const matrix = (result) => {
    const wrap = el("div", "dl-table-wrap");
    wrap.tabIndex = 0;
    const table = el("table", "dl-table dl-matrix");
    const head = el("tr");
    head.append(el("th", null, `${fields[1].label} \\ ${lower(fields[2].label)}`));
    result.types.forEach((type) => {
      const th = el("th", "num", type.key);
      th.scope = "col";
      head.append(th);
    });
    const thead = el("thead");
    thead.append(head);
    const tbody = el("tbody");
    const cells = new Map();
    result.rows.forEach((row) => {
      const key = `${row.stage}\u0000${row.type}`;
      cells.set(key, (cells.get(key) || 0) + row.units);
    });
    const max = Math.max(...cells.values());
    result.stages.forEach((stage) => {
      const tr = el("tr");
      const th = el("th", null, stage.key);
      th.scope = "row";
      tr.append(th);
      result.types.forEach((type) => {
        const value = cells.get(`${stage.key}\u0000${type.key}`) || 0;
        const td = el("td", "num", value ? int.format(value) : "");
        if (value) {
          // One hue, stronger with a higher count; the number is always shown.
          td.style.setProperty("--heat", `${Math.round(12 + (value / max) * 58)}%`);
          td.classList.add("is-heat");
          if (value === max) td.classList.add("is-max");
          td.title = `${stage.key} · ${type.key}: ${plural(value, t.one, t.many)}`;
        }
        tr.append(td);
      });
      tbody.append(tr);
    });
    table.append(thead, tbody);
    wrap.append(table);
    return wrap;
  };

  const targetText = (result) => {
    if (!result.target) return null;
    const allowed = Math.floor(result.target * result.volume);
    const gap = result.total - allowed;
    return gap > 0
      ? { value: tx("{n} over", { n: int.format(gap) }), note: tx("{n} fewer {many} reach {pct}", { n: int.format(gap), many: t.many, pct: pct(result.target, 2) }) }
      : { value: tx("On target"), note: tx("{n} {noun} inside {pct}", { n: int.format(-gap), noun: t.volumeNoun, pct: pct(result.target, 2) }) };
  };

  const problemText = (result) => {
    const stage = result.topStage;
    const name = periodName(result.rows);
    const when = name ? `${name}: ` : "";
    const why = result.topStageCause ? tx(", mostly {cause}", { cause: lower(result.topStageCause.key) }) : "";
    return `${when}${plural(stage.value, t.one, t.many)} ${t.stagePhrase} ${stage.key} (${tx("{pct} of all {noun}", { pct: pct(stage.value / result.total, 0), noun: t.allNoun })})${why}.`;
  };

  let checkSummary = () => "";

  const summaryText = (result) => {
    const lines = [`${t.tool} | Stiven Catalyst`];
    const span = dateSpan(result.rows);
    if (state.period || span) lines.push(`${tx("Period")}: ${[state.period, span && spanText(span)].filter(Boolean).join(" · ")}`);
    lines.push("", `${capital(t.many)}: ${tx("{n} in {entries}", { n: int.format(result.total), entries: entries(result.rows.length) })}`);
    if (result.volume) {
      lines.push(`${t.volumeLabel}: ${int.format(result.volume)}`);
      lines.push(`${t.rateLabel}: ${pct(result.rate, 2)} · DPMO: ${int.format(Math.round(result.dpmo))} · ${tx("Sigma level")}: ${num(sigma(result.rate), 2)}`);
      if (t.complement) lines.push(`${t.complement.label}: ${pct(1 - result.rate, 2)}`);
    }
    const target = targetText(result);
    if (target) lines.push(`${tx("Target")} ${pct(result.target, 2)}: ${target.note}`);
    if (result.cost != null) lines.push(`${tx("Recorded cost")}: ${euro.format(result.cost)}`);
    lines.push("", `${tx("Pareto of causes")}:`);
    result.causes.forEach((item) => lines.push(`- ${item.key}: ${item.value} (${pct(item.share, 0)}, ${tx("cum.")} ${pct(item.cumulative, 0)})${item.vital ? ` [${tx("vital few")}]` : ""}`));
    lines.push("", `${t.stageTitle}:`);
    result.stages.forEach((item) => lines.push(`- ${item.key}: ${item.value} (${pct(item.value / result.total, 0)})`));
    lines.push("", `${tx("By shift")}:`);
    result.shifts.forEach((item) => lines.push(`- ${item.key}: ${item.value} (${pct(item.value / result.total, 0)})`));
    lines.push("", `${tx("Start here")}: ${problemText(result)}`);
    const advice = data.stages[result.topStage.key];
    if (advice) {
      lines.push(`${tx("First moves")}:`);
      advice.moves.forEach((move) => lines.push(`- ${move}`));
      lines.push(`${tx("Question for the floor")}: ${advice.question}`);
    }
    const check = checkSummary();
    if (check) lines.push("", check);
    return lines.join("\n");
  };

  // With the volume of every day in, the volume of the period fills itself; the empty field says so.
  const syncPeriodVolume = () => {
    const days = dayVolumesOf(periodRows());
    const covers = days.items.length > 0 && !days.missing.length && !days.undated;
    periodVolumeInput.placeholder = covers ? tx("from the daily volumes: {n}", { n: int.format(days.total) }) : periodVolumePlaceholder;
  };

  const renderResults = () => {
    syncPeriodVolume();
    renderVolumes();
    results.replaceChildren();
    results.hidden = !state.rows.length;
    if (!state.rows.length) return;
    if (!periodRows().length) {
      const card = el("article", "result-card dl-focus");
      card.append(el("p", "result-label", tx("Result")), el("p", "dl-focus-lede", tx("No entries in this period. Choose another period or All.")));
      results.append(card);
      return;
    }
    const result = analyse();

    const head = el("div", "result-head");
    const name = periodName(result.rows);
    head.append(el("p", "kicker", name ? `${tx("Result")} · ${name}` : tx("Result")));
    const title = el("h2");
    if (result.rate !== null) {
      title.append(`${t.rateLabel} `, el("span", null, pct(result.rate, 2)));
    } else {
      title.append(el("span", null, int.format(result.total)), ` ${result.total === 1 ? t.one : t.many}`);
    }
    head.append(title);

    const stats = el("div", "dl-stats");
    stats.append(stat(capital(t.many), int.format(result.total), `${entries(result.rows.length)}${result.days ? ` ${tx("over {days}", { days: plural(result.days, tx("day"), tx("days")) })}` : ""}`));
    if (result.volume) {
      if (t.complement) stats.append(stat(t.complement.label, pct(1 - result.rate, 2), t.complement.note));
      stats.append(stat("DPMO", int.format(Math.round(result.dpmo)), tx("{many} per million {noun}", { many: t.many, noun: t.volumeNoun })));
      stats.append(stat(tx("Sigma level"), sigmaText(result.rate), tx("short term, with 1.5 shift")));
      const target = targetText(result);
      if (target) stats.append(stat(tx("Target"), target.value, target.note));
    }
    if (result.cost != null) stats.append(stat(tx("Recorded cost"), euro.format(result.cost), tx("only entries with a cost")));

    const notes = [];
    if (result.volumeTooLow) {
      notes.push(el("p", "dl-warning", tx("The log holds more {many} than {volume}. Check the volume to see the rate, DPMO and sigma level.", { many: t.many, volume: lower(t.volumeLabel) })));
    } else if (!result.volume) {
      notes.push(el("p", "dl-warning", tx("Add the {volume} in this period to see the {rate}, DPMO and sigma level.", { volume: lower(t.volumeLabel), rate: lower(t.rateLabel) })));
      const days = result.dayVolumes;
      if (days.items.length && (days.missing.length || days.undated)) {
        const list = days.missing.slice(0, 5).map(showDate).join(", ");
        notes.push(el("p", "dl-warning", days.missing.length
          ? tx("The daily volumes do not cover every day with entries yet: {days} missing. Add them, or type the volume of the period.", { days: `${list}${days.missing.length > 5 ? "…" : ""}` })
          : tx("Entries without a date cannot use the daily volumes. Type the volume of the period.")));
      }
    } else if (result.volumeFromDays) {
      notes.push(el("p", "dl-panel-note", tx("The volume is the sum of the daily volumes of {days}.", { days: plural(result.volumeFromDays, tx("day"), tx("days")) })));
    }

    const vital = result.causes.filter((item) => item.vital);
    const pareto = panel(tx("Pareto of causes"), tx("{a} of {b} causes carry {pct} of the {noun}. Fix these first.", { a: vital.length, b: result.causes.length, pct: pct(vital.at(-1).cumulative, 0), noun: t.allNoun }));
    pareto.append(bars(result.causes, result.total, { ranked: true, cumulative: true, highlight: (item) => item.vital, tag: tx("Vital few") }));

    const flow = panel(t.stageTitle, t.stageNote);
    flow.append(bars(result.stages, result.total, { highlight: (item) => item.key === result.topStage.key, tag: tx("Most") }));

    // Trend over time, so a bad day or a worsening week shows before the totals do. With the volume of each day it is a
    // rate (and the target, when there is one, is drawn); without it, the units per day or week.
    const shares = result.dayVolumes.items.length ? trendShares(result.rows, (row) => row.units, result.dayVolumes.items) : null;
    const useShares = Boolean(shares) && shares.buckets.filter((bucket) => bucket.total > 0).length > 1;
    const trend = useShares ? shares : trendBuckets(result.rows, (row) => row.units);
    const goal = parseNumber(state.target) / 100;
    const trendUnit = trend.unit === "week" ? tx("week") : tx("day");
    let trendPanel = null;
    if (trend.buckets.length > 1) {
      const by = trend.unit === "week" ? tx("week by week") : tx("day by day");
      const note = !useShares ? tx("{many} per {unit}. The dashed line is the average; the highest {unit} is red.", { many: t.many, unit: trendUnit })
        : goal > 0 ? tx("{rate} ({many} / {volume}), {by}. The dashed line is the average, the solid line the target; columns above it are red.", { rate: t.rateLabel, many: t.many, volume: t.volumeLabel, by })
        : tx("{rate} ({many} / {volume}), {by}. The dashed line is the average; the highest column is red.", { rate: t.rateLabel, many: t.many, volume: t.volumeLabel, by });
      trendPanel = panel(tx("Trend over time"), note);
      trendPanel.append(trendFigure(trend, useShares
        ? { title: `${t.tool}: ${t.rateLabel}`, unit: t.rateLabel, average: tx("Average"), format: shareText, target: goal > 0 ? goal : null, targetLabel: tx("Target") }
        : { title: `${t.tool}: ${tx("Trend over time")}`, unit: capital(t.many), average: tx("Average") }, KEY.replace(/^sc-/, "")));
      if (useShares && shares.skipped.length) {
        const list = shares.skipped.slice(0, 5).map(showDate).join(", ");
        trendPanel.append(el("p", "dl-panel-note", tx(shares.skipped.length === 1 ? "{n} day with entries has no volume and is not in this chart: {days}." : "{n} days with entries have no volume and are not in this chart: {days}.", { n: shares.skipped.length, days: shares.skipped.length > 5 ? `${list}…` : list })));
      }
    }

    const types = panel(t.matrixTitle, tx("Each cell counts {many}. The darkest cell is the most specific place to look.", { many: t.many }));
    types.append(matrix(result));

    const shifts = panel(tx("By shift"), tx("Counts only. A shift that handles more volume will log more {noun}, so compare with its share of the work.", { noun: t.allNoun }));
    shifts.append(bars(result.shifts, result.total));

    // Where to start: the stage with the highest count, and its main cause.
    const cause = result.topStageCause;
    const focus = focusCard({
      title: result.topStage.key,
      detail: cause?.key,
      lede: problemText(result),
      advice: data.stages[result.topStage.key],
      extraLabel: cause ? tx("About {cause}", { cause: lower(cause.key) }) : "",
      extra: cause && cause.key !== UNKNOWN ? data.causes[cause.key] : "",
      warning: result.unknownShare > 0.15 ? `${tx("{pct} of {many} have no known cause.", { pct: pct(result.unknownShare, 0), many: t.many })} ${data.causes[UNKNOWN]}` : "",
    });

    resultLayout(results, {
      head,
      stats,
      notes,
      focus,
      actions: resultActions(() => summaryText(result), problemText(result), paretoTable, controlChart(result)),
      panels: [trendPanel, pareto, flow, types, shifts].filter(Boolean),
    });
  };

  // The days with a volume as a p-chart for the Sigma & Control Chart: units out of the volume of each day.
  // A day with entries and no volume cannot be a point, so it is counted in "skipped"; the chart needs two days.
  const controlChart = (result) => {
    const perDay = new Map();
    result.rows.forEach((row) => row.date && perDay.set(row.date, (perDay.get(row.date) || 0) + row.units));
    const rows = result.dayVolumes.items.map((item) => ({ date: item.date, n: item.volume, d: perDay.get(item.date) || 0 })).filter((row) => row.d <= row.n);
    return rows.length < 2 ? null : { source: t.tool, metric: capital(t.many), unit: t.volumeLabel, rows, skipped: result.dayVolumes.missing.length };
  };

  // The log for the Pareto tool: causes counted in units, valued in euros where known.
  const paretoTable = () => ({
    source: data.text?.title || document.title.split("|")[0].trim(),
    template: KEY.includes("damage") ? "damage" : "picking-errors",
    headers: [tx("Date"), fields.find((f) => f.name === "shift")?.label || "Shift", fields.find((f) => f.name === "stage")?.label || "Stage",
      fields.find((f) => f.name === "type")?.label || "Type", fields.find((f) => f.name === "cause")?.label || "Cause", tx("Units"), tx("Cost (€)")],
    rows: periodRows().map((row) => [row.date, row.shift, row.stage, row.type, row.cause, String(row.units), row.cost == null ? "" : String(row.cost)]),
    map: { category: 4, count: 5, value: 6, date: 0, filter: 2 },
    measure: "count",
    valueLabel: "€",
  });

  const book = logBook({
    root,
    key: KEY,
    clearExample: () => { state.period = ""; state.volume = ""; state.target = ""; state.volumes = []; openVolumes = false; },
    state,
    save,
    results,
    paste: pasteArea,
    cells: (row) => [
      el("td", "nowrap", showDate(row.date) || "-"),
      ...fields.map((f) => el("td", null, row[f.name])),
      el("td", "num", int.format(row.units)),
      el("td", "num", row.cost == null ? "" : num(row.cost, 2)),
      el("td", "dl-note", row.note || ""),
    ],
    removeLabel: (row) => tx(row.date ? "Remove {n} {type} at {stage} on {date}" : "Remove {n} {type} at {stage}", { n: row.units, type: row.type, stage: row.stage, date: showDate(row.date) }),
    removedText: (row) => tx("Removed {count} at {stage}.", { count: plural(row.units, t.one, t.many), stage: row.stage }),
    countText: (rows) => `${entries(rows.length)} · ${plural(rows.reduce((sum, row) => sum + row.units, 0), t.one, t.many)}`,
    importRows,
    importText: {
      none: tx("No rows found. Check that {count} are in the sixth column.", { count: t.countShort }),
      done: (added, skipped) => `${tx("Imported {rows}", { rows: plural(added, tx("row"), tx("rows")) })}${skipped ? tx(", skipped {n} without {count}", { n: skipped, count: t.countShort }) : ""}.`,
    },
    loadExample: () => {
      const example = data.example;
      state.period = example.period;
      state.volume = String(example.volume);
      state.target = String(example.target);
      state.rows = importRows(recentExample(example.rows).map((row) => row.replace(/\|/g, "\t")).join("\n")).added;
      state.volumes = importVolumes(recentExample(example.volumes || []).map((row) => row.replace(/\|/g, "\t")).join("\n")).added;
      state.volumes = cleanVolumes(state.volumes);
      openVolumes = true;
    },
    clearText: tx("Clear the whole {tool} log?", { tool: t.tool }),
    csv: () => ({
      name: t.csv,
      rows: [
        [tx("Date"), ...fields.map((f) => f.label), capital(t.countShort), tx("Cost"), tx("Note")],
        ...state.rows.map((row) => [row.date, ...fields.map((f) => row[f.name]), row.units, row.cost ?? "", row.note]),
      ],
    }),
    renderResults,
  });

  // The volume of each day (optional): it makes the trend a rate and can stand in for the volume of the period.
  const volumesBox = root.querySelector("[data-volumes]");
  const volumeForm = volumesBox.querySelector("[data-volume-form]");
  const volumeList = volumesBox.querySelector("[data-volume-list]");
  const volumeWrap = volumesBox.querySelector("[data-volume-wrap]");
  const volumeCount = volumesBox.querySelector("[data-volume-count]");
  const volumeStatus = volumesBox.querySelector("[data-volume-status]");
  const volumePaste = volumesBox.querySelector("[data-volume-paste]");
  const volumeImportStatus = volumesBox.querySelector("[data-volume-import-status]");
  const VOLUME_ROWS = 14;
  renderVolumes = () => {
    if (openVolumes) {
      volumesBox.open = true;
      openVolumes = false;
    }
    volumeList.replaceChildren();
    [...state.volumes].reverse().slice(0, VOLUME_ROWS).forEach((item) => {
      const tr = el("tr");
      tr.append(el("td", "nowrap", showDate(item.date)), el("td", "num", int.format(item.volume)));
      const cell = el("td");
      const remove = el("button", "dl-remove", "×");
      remove.type = "button";
      remove.dataset.removeVolume = item.date;
      remove.setAttribute("aria-label", tx("Remove {name}", { name: showDate(item.date) }));
      cell.append(remove);
      tr.append(cell);
      volumeList.append(tr);
    });
    volumeWrap.hidden = !state.volumes.length;
    const hidden = state.volumes.length - VOLUME_ROWS;
    volumeCount.textContent = state.volumes.length
      ? `${plural(state.volumes.length, tx("day"), tx("days"))} · ${int.format(state.volumes.reduce((sum, item) => sum + item.volume, 0))} ${lower(t.volumeNoun)}${hidden > 0 ? tx(" · newest {n} shown", { n: VOLUME_ROWS }) : ""}`
      : "";
  };
  const volumesChanged = () => {
    save();
    book.render();
    renderVolumes();
  };
  openVolumes = state.volumes.length > 0;
  volumeForm.elements.vdate.value = today();
  volumeForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = volumeForm.elements;
    const volume = Math.round(parseNumber(form.vvolume.value));
    const date = parseDate(form.vdate.value);
    if (!date || !(volume > 0)) {
      flash(volumeStatus, tx("Enter a date and a volume above zero."));
      (date ? form.vvolume : form.vdate).focus();
      return;
    }
    const replaced = state.volumes.some((item) => item.date === date);
    state.volumes = cleanVolumes([...state.volumes, { date, volume }]);
    volumesChanged();
    // The next entry is usually the next day.
    form.vdate.value = addDays(date, 1);
    form.vvolume.value = "";
    flash(volumeStatus, tx(replaced ? "Replaced {date}: {n}." : "Added {date}: {n}.", { date: showDate(date), n: int.format(volume) }));
    form.vvolume.focus();
  });
  volumesBox.querySelector("[data-volume-import]").addEventListener("click", () => {
    const { added, skipped } = importVolumes(volumePaste.value);
    if (!added.length) {
      flash(volumeImportStatus, tx("No rows found. Check the order: date, volume."));
      return;
    }
    state.volumes = cleanVolumes([...state.volumes, ...added]);
    volumesChanged();
    volumePaste.value = "";
    flash(volumeImportStatus, `${tx("Imported {rows}", { rows: plural(added.length, tx("day"), tx("days")) })}${skipped ? tx(", skipped {n} without a date or volume", { n: skipped }) : ""}.`);
  });
  volumeList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove-volume]");
    if (!button) return;
    state.volumes = state.volumes.filter((item) => item.date !== button.dataset.removeVolume);
    volumesChanged();
    (volumeList.querySelector("[data-remove-volume]") || volumeForm.elements.vvolume).focus();
  });
  volumesBox.querySelector("[data-volume-clear]").addEventListener("click", () => {
    if (!state.volumes.length || !window.confirm(tx("Clear all daily volumes?"))) return;
    state.volumes = [];
    volumesChanged();
  });

  // Log an entry.
  entry.elements.date.value = today();
  entry.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = entry.elements;
    const units = Math.round(parseNumber(form.units.value));
    if (!(units > 0)) {
      form.units.focus();
      flash(entryStatus, tx("Enter at least one {one}.", { one: t.one }));
      return;
    }
    const cost = parseNumber(form.cost.value);
    const row = {
      date: form.date.value,
      ...Object.fromEntries(fields.map((f) => [f.name, form[f.name].value])),
      units,
      cost: cost >= 0 ? cost : null,
      note: form.note.value.trim(),
    };
    // Keep date, shift and stage: the next entry is usually from the same place. The form is
    // cleared before the results change, so the page is laid out once.
    form.units.value = 1;
    form.cost.value = "";
    form.note.value = "";
    book.add(row);
    flash(entryStatus, tx("Added {count} at {stage}.", { count: plural(units, t.one, t.many), stage: form.stage.value }));
    form.type.focus();
  });

  checkSummary = floorCheck(document.querySelector("[data-floor-check]"), `${KEY}-check`);
  book.render();
})();
