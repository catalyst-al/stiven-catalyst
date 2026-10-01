(() => {
  // Shared by Damage Control and Incomplete Control. Each page supplies its
  // fields, wording, advice and example in #defect-log-data. The fields are
  // always shift, stage, type and cause, in that order.
  const root = document.querySelector("[data-defect-log]");
  const dataEl = document.getElementById("defect-log-data");
  if (!root || !dataEl || !window.ToolKit) return;

  const {
    tx, num, showDate, lower,
    read, write, isObject, str, loadState, el, int, euro, pct, plural, capital, today,
    parseNumber, parseDate, parseRows, canon, sigma, sigmaText,
    inRange, dateSpan, spanText, logBook, resultLayout,
    panel, stat, barList, focusCard, resultActions, flash, floorCheck,
  } = window.ToolKit;

  const data = JSON.parse(dataEl.textContent);
  const t = data.text;
  const KEY = data.storageKey;
  const NOT_RECORDED = tx("Not recorded");
  // The cause that means "nobody knows"; German data names it in German.
  const UNKNOWN = data.unknownCause || "Unknown";
  const entries = (count) => plural(count, tx("entry"), tx("entries"));
  const fields = data.fields;
  const field = Object.fromEntries(fields.map((f) => [f.name, f]));

  const entry = root.querySelector("[data-entry]");
  const entryStatus = root.querySelector("[data-entry-status]");
  const pasteArea = root.querySelector("#dl-paste");
  const results = document.querySelector("[data-results]");

  const state = loadState(KEY, { period: "", volume: "", target: "", from: "", to: "", rows: [] });
  state.from = parseDate(state.from);
  state.to = parseDate(state.to);
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
    const volume = parseNumber(state.volume);
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

  const renderResults = () => {
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
    }

    const vital = result.causes.filter((item) => item.vital);
    const pareto = panel(tx("Pareto of causes"), tx("{a} of {b} causes carry {pct} of the {noun}. Fix these first.", { a: vital.length, b: result.causes.length, pct: pct(vital.at(-1).cumulative, 0), noun: t.allNoun }));
    pareto.append(bars(result.causes, result.total, { ranked: true, cumulative: true, highlight: (item) => item.vital, tag: tx("Vital few") }));

    const flow = panel(t.stageTitle, t.stageNote);
    flow.append(bars(result.stages, result.total, { highlight: (item) => item.key === result.topStage.key, tag: tx("Most") }));

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
      actions: resultActions(() => summaryText(result), problemText(result), paretoTable),
      panels: [pareto, flow, types, shifts],
    });
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
      state.rows = importRows(example.rows.map((row) => row.replace(/\|/g, "\t")).join("\n")).added;
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
