// FMEA: a process failure mode and effects sheet. Each row is one way a step can fail, rated for severity (S),
// occurrence (O) and detection (D); the sheet gives the RPN and the AIAG-VDA action priority, keeps the actions with
// their owners and the re-rating after them. The arithmetic lives in window.FmeaMath so the tests can call it.
(() => {
  // Arithmetic -------------------------------------------------------------------------------------------------------
  const RANK = { H: 3, M: 2, L: 1 };
  const STATUSES = ["open", "done"];
  const FIELDS = ["step", "function", "mode", "effect", "cause", "prevention", "detection", "action", "owner"];
  const RATINGS = ["s", "o", "d", "s2", "o2", "d2"];
  const rating = (value) => {
    const n = typeof value === "string" && value.trim() !== "" ? Number(value) : value;
    return Number.isInteger(n) && n >= 1 && n <= 10 ? n : null;
  };
  // RPN = S × O × D, only when all three are rated: a missing rating is not a 1.
  const rpn = (s, o, d) => {
    const [a, b, c] = [rating(s), rating(o), rating(d)];
    return a && b && c ? a * b * c : null;
  };
  // The AIAG-VDA FMEA handbook (2019) action priority table. Severity bands 9–10, 7–8, 4–6, 2–3, 1; occurrence bands
  // 8–10, 6–7, 4–5, 2–3, 1; each string gives the priority for detection 7–10, 5–6, 2–4 and 1, in that order.
  const AP_TABLE = {
    9: { 8: "HHHH", 6: "HHHH", 4: "HHHM", 2: "HMLL", 1: "LLLL" },
    7: { 8: "HHHH", 6: "HHHM", 4: "HMMM", 2: "MMLL", 1: "LLLL" },
    4: { 8: "HHMM", 6: "MMML", 4: "MLLL", 2: "LLLL", 1: "LLLL" },
    2: { 8: "MMLL", 6: "LLLL", 4: "LLLL", 2: "LLLL", 1: "LLLL" },
    1: { 8: "LLLL", 6: "LLLL", 4: "LLLL", 2: "LLLL", 1: "LLLL" },
  };
  const sBand = (s) => (s >= 9 ? 9 : s >= 7 ? 7 : s >= 4 ? 4 : s >= 2 ? 2 : 1);
  const oBand = (o) => (o >= 8 ? 8 : o >= 6 ? 6 : o >= 4 ? 4 : o >= 2 ? 2 : 1);
  const dIndex = (d) => (d >= 7 ? 0 : d >= 5 ? 1 : d >= 2 ? 2 : 3);
  const ap = (s, o, d) => {
    const [a, b, c] = [rating(s), rating(o), rating(d)];
    if (!a || !b || !c) return null;
    return AP_TABLE[sBand(a)][oBand(b)][dIndex(c)];
  };
  const reduction = (before, after) => (before > 0 && Number.isFinite(after) ? (before - after) / before : null);
  // One row with what follows from its ratings.
  const enrich = (row) => {
    const before = rpn(row.s, row.o, row.d);
    const after = rpn(row.s2, row.o2, row.d2);
    return { ...row, rpn: before, ap: ap(row.s, row.o, row.d), rpn2: after, ap2: ap(row.s2, row.o2, row.d2), reduction: after === null ? null : reduction(before, after) };
  };
  // Action priority first, then RPN, then severity: two rows with one RPN can need different urgency.
  const byPriority = (a, b) => (RANK[b.ap] || 0) - (RANK[a.ap] || 0) || (b.rpn ?? -1) - (a.rpn ?? -1) || (rating(b.s) || 0) - (rating(a.s) || 0);
  const byRpn = (a, b) => (b.rpn ?? -1) - (a.rpn ?? -1) || (RANK[b.ap] || 0) - (RANK[a.ap] || 0);
  // Sorted copies; ties keep the order of the sheet. "step" groups the rows of one step where that step first appears.
  const sortRows = (rows, by = "ap") => {
    const list = rows.map((row, index) => ({ row: row.rpn === undefined ? enrich(row) : row, index }));
    if (by === "step") {
      const first = new Map();
      list.forEach(({ row, index }) => { const key = String(row.step || "").trim().toLowerCase(); if (!first.has(key)) first.set(key, index); });
      return list.sort((a, b) => first.get(String(a.row.step || "").trim().toLowerCase()) - first.get(String(b.row.step || "").trim().toLowerCase()) || a.index - b.index).map((item) => item.row);
    }
    const compare = by === "rpn" ? byRpn : byPriority;
    return list.sort((a, b) => compare(a.row, b.row) || a.index - b.index).map((item) => item.row);
  };
  const hasAction = (row) => String(row.action || "").trim() !== "";
  const isOpenAction = (row) => hasAction(row) && row.status !== "done";
  // The sheet in numbers. The RPN after counts each row at its re-rating where there is one, else as it is today.
  const summarize = (rows, day = "") => {
    const list = rows.map((row) => (row.rpn === undefined ? enrich(row) : row));
    const rated = list.filter((row) => row.ap);
    const count = (level) => rated.filter((row) => row.ap === level).length;
    const open = list.filter(isOpenAction);
    const before = rated.reduce((sum, row) => sum + row.rpn, 0);
    const after = rated.reduce((sum, row) => sum + (row.rpn2 ?? row.rpn), 0);
    return {
      modes: list.length, rated: rated.length, unrated: list.length - rated.length, H: count("H"), M: count("M"), L: count("L"),
      openActions: open.length, overdue: open.filter((row) => row.due && day && row.due < day).length,
      doneActions: list.filter((row) => hasAction(row) && row.status === "done").length,
      withoutAction: rated.filter((row) => (row.ap === "H" || row.ap === "M") && !hasAction(row)).length,
      reRated: list.filter((row) => row.rpn2 !== null && row.rpn !== null).length,
      rpnBefore: before, rpnAfter: after, reduction: reduction(before, after), top: sortRows(rated, "ap")[0] || null,
    };
  };
  // The S × O grid: how many modes sit in each cell, and the highest action priority among them.
  const heatCells = (rows) => {
    const cells = new Map();
    rows.map((row) => (row.rpn === undefined ? enrich(row) : row)).filter((row) => row.ap).forEach((row) => {
      const key = `${rating(row.s)}-${rating(row.o)}`;
      const cell = cells.get(key) || { count: 0, ap: "L", rows: [] };
      cell.count += 1;
      cell.rows.push(row);
      if (RANK[row.ap] > RANK[cell.ap]) cell.ap = row.ap;
      cells.set(key, cell);
    });
    return cells;
  };
  // The failure modes as a table the Pareto tool opens: the mode is the category, the RPN the value, the step the filter.
  const paretoTable = (rows, { source = "FMEA", headers = ["Failure mode", "Step", "RPN"], valueLabel = "RPN" } = {}) => ({
    source, headers,
    rows: sortRows(rows.map((row) => (row.rpn === undefined ? enrich(row) : row)).filter((row) => row.rpn), "rpn").map((row) => [String(row.mode || ""), String(row.step || ""), String(row.rpn)]),
    map: { category: 0, count: -1, value: 2, date: -1, filter: 1 }, measure: "value", valueLabel,
  });

  // Rows from anywhere (saved, opened from a file, the example) are rebuilt field by field.
  const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
  const text = (value, max = 400) => (typeof value === "string" ? value.slice(0, max) : typeof value === "number" ? String(value) : "");
  const isoDate = (value) => (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : "");
  let counter = 0;
  const newId = () => `r${Date.now().toString(36)}${(counter++).toString(36)}${Math.random().toString(36).slice(2, 5)}`;
  const cleanRow = (raw) => {
    if (!isObject(raw)) return null;
    const row = { id: typeof raw.id === "string" && raw.id ? raw.id.slice(0, 40) : newId() };
    FIELDS.forEach((name) => { row[name] = text(raw[name]); });
    RATINGS.forEach((name) => { row[name] = rating(raw[name]); });
    row.due = isoDate(raw.due);
    row.status = STATUSES.includes(raw.status) ? raw.status : "open";
    return row;
  };
  const cleanSheet = (raw) => {
    if (!isObject(raw) || !Array.isArray(raw.rows)) return null;
    const ids = new Set();
    const rows = raw.rows.slice(0, 500).map(cleanRow).filter(Boolean).map((row) => { if (ids.has(row.id)) row.id = newId(); ids.add(row.id); return row; });
    return { process: text(raw.process, 200), owner: text(raw.owner, 120), date: isoDate(raw.date), revision: text(raw.revision, 40), rows };
  };
  const shiftDay = (iso, days) => {
    const date = new Date(`${iso}T00:00:00Z`);
    date.setUTCDate(date.getUTCDate() + days);
    return date.toISOString().slice(0, 10);
  };
  // The example of the data file as a sheet, its dates counted from the given day.
  const fromExample = (example, day) => ({
    process: text(example.process, 200), owner: text(example.owner, 120), revision: text(example.revision, 40),
    date: Number.isInteger(example.daysAgo) ? shiftDay(day, -example.daysAgo) : day,
    rows: (example.rows || []).map((row) => cleanRow({ ...row, id: undefined, due: Number.isInteger(row.dueIn) ? shiftDay(day, row.dueIn) : "" })),
  });
  // Rows for a template: one per step, with its function, the ratings left to the team.
  const fromTemplate = (template) => (template?.steps || []).map(([step, fn]) => cleanRow({ step, function: fn }));

  window.FmeaMath = { RANK, AP_TABLE, rating, rpn, ap, reduction, enrich, sortRows, summarize, heatCells, paretoTable, cleanRow, cleanSheet, fromExample, fromTemplate, isOpenAction };

  // The page ---------------------------------------------------------------------------------------------------------
  const root = document.querySelector("[data-fmea]");
  const dataEl = document.getElementById("fmea-data");
  if (!root || !dataEl || !window.ToolKit) return;
  const { tx, int, pct, el, read, write, firstVisit, today, showDate, panel, stat, focusCard, resultActions, resultLayout, renderOnPause, flash, undoNote, downloadCsv, downloadXlsx } = window.ToolKit;
  const CK = window.ChartKit;
  const data = JSON.parse(dataEl.textContent);
  const KEY = data.storageKey;
  const C = data.columns;
  const apText = (level) => (level ? `${level} · ${data.ap[level]}` : "–");
  const apState = { H: "danger", M: "warn", L: "ok" };
  const scaleOf = { s: "S", o: "O", d: "D", s2: "S", o2: "O", d2: "D" };

  const results = document.querySelector("[data-results]");
  const grid = root.querySelector("[data-grid]");
  const gridWrap = root.querySelector("[data-grid-wrap]");
  const empty = root.querySelector("[data-log-empty]");
  const count = root.querySelector("[data-log-count]");
  const status = root.querySelector("[data-log-status]");
  const headers = [...root.querySelectorAll("[data-header]")];
  const sortSelect = root.querySelector("[data-sort]");
  const apFilter = root.querySelector("[data-filter-ap]");
  const statusFilter = root.querySelector("[data-filter-status]");
  const templateSelect = root.querySelector("[data-template]");
  const templateStatus = root.querySelector("[data-template-status]");
  const fileStatus = root.querySelector("[data-file-status]");

  // State: the header of the sheet, its rows, and how the grid is shown. Saved data is rebuilt field by field.
  const defaults = { process: "", owner: "", date: "", revision: "", rows: [], sort: "ap", filterAp: "", filterStatus: "", paper: "a4", example: false };
  const saved = read(KEY, null);
  const state = { ...defaults };
  if (isObject(saved)) {
    Object.assign(state, cleanSheet({ ...saved, rows: Array.isArray(saved.rows) ? saved.rows : [] }) || {});
    state.sort = ["ap", "rpn", "step"].includes(saved.sort) ? saved.sort : "ap";
    state.filterAp = ["H", "M", "L"].includes(saved.filterAp) ? saved.filterAp : "";
    state.filterStatus = STATUSES.includes(saved.filterStatus) ? saved.filterStatus : "";
    state.paper = saved.paper === "a3" ? "a3" : "a4";
    state.example = saved.example === true;
  }
  const save = () => write(KEY, state);
  const loadExample = () => {
    Object.assign(state, fromExample(data.example, today()), { example: true, filterAp: "", filterStatus: "" });
  };
  // A first visit opens on the example, so the result is visible at once; the note above it says so.
  if (!state.rows.length && firstVisit(KEY)) loadExample();
  // The visitor's own first change ends the example: the rows stay, the note goes.
  const own = () => { state.example = false; note.hidden = true; };

  const note = el("div", "dl-example-note");
  note.setAttribute("role", "status");
  const clearExample = el("button", "button-ghost", tx("Clear the example"));
  clearExample.type = "button";
  clearExample.addEventListener("click", () => {
    Object.assign(state, { process: "", owner: "", date: "", revision: "", rows: [], example: false, filterAp: "", filterStatus: "" });
    save();
    renderAll();
  });
  note.append(el("strong", null, tx("Example")), " ", el("span", null, tx("This is an example, so you can see what the tool shows. Add your own entries and it disappears, or clear it now.")), " ", clearExample);
  results.before(note);

  // The grid -----------------------------------------------------------------------------------------------------------
  const view = () => sortRows(state.rows.map(enrich), state.sort)
    .filter((row) => (!state.filterAp || row.ap === state.filterAp) && (!state.filterStatus || row.status === state.filterStatus));
  const rowNumber = (id) => state.rows.findIndex((row) => row.id === id) + 1;
  const apChip = (level) => el("span", `fm-ap${level ? ` fm-ap-${level.toLowerCase()}` : ""}`, level ? apText(level) : "–");
  const rpnCell = (value, red) => {
    const td = el("td", "num fm-rpn");
    td.append(el("strong", null, value === null ? "–" : int.format(value)));
    if (red !== undefined && red !== null) td.append(el("span", "fm-red", ` ${red > 0 ? "−" : red < 0 ? "+" : "±"}${pct(Math.abs(red), 0)}`));
    return td;
  };
  const ratingSelect = (row, name) => {
    const select = el("select", "fm-in fm-rate");
    const levels = data.scales[scaleOf[name]].levels;
    const blank = el("option", null, "–");
    blank.value = "";
    select.append(blank);
    levels.forEach(([label], i) => { const option = el("option", null, `${i + 1} · ${label}`); option.value = String(i + 1); option.title = levels[i][1]; select.append(option); });
    select.value = row[name] ? String(row[name]) : "";
    return select;
  };
  // A rating changed: only the RPN and AP cells of that row are redrawn, so the field being typed in keeps its focus.
  const updateComputed = (tr, row) => {
    const e = enrich(row);
    const before = rpnCell(e.rpn);
    before.dataset.rpn = "";
    tr.querySelector("[data-rpn]").replaceWith(before);
    tr.querySelector("[data-ap]").replaceChildren(apChip(e.ap));
    const after = rpnCell(e.rpn2, e.reduction);
    after.dataset.rpn2 = "";
    tr.querySelector("[data-rpn2]").replaceWith(after);
  };
  const gridRow = (row) => {
    const e = enrich(row);
    const n = rowNumber(row.id);
    const tr = el("tr");
    tr.dataset.id = row.id;
    if (row.status === "done") tr.classList.add("is-done");
    const label = (name) => `${C[name]} · ${tx("row {n}", { n })}`;
    const change = (name, value) => {
      const target = state.rows.find((item) => item.id === row.id);
      if (!target) return;
      target[name] = value;
      own();
      save();
      updateComputed(tr, target);
      tr.classList.toggle("is-done", target.status === "done");
      renderSoon();
    };
    const textCell = (name, wide, placeholder) => {
      const td = el("td", "fm-cell");
      const area = el("textarea", `fm-in${wide ? " fm-wide" : ""}`);
      area.rows = 2;
      area.value = row[name] || "";
      area.setAttribute("aria-label", label(name));
      if (placeholder) area.placeholder = placeholder;
      area.addEventListener("input", () => change(name, area.value.slice(0, 400)));
      td.append(area);
      return td;
    };
    const rateCell = (name) => {
      const td = el("td", "fm-cell");
      const select = ratingSelect(row, name);
      select.setAttribute("aria-label", label(name));
      select.addEventListener("change", () => change(name, rating(select.value)));
      td.append(select);
      return td;
    };
    const ownerCell = () => {
      const td = el("td", "fm-cell");
      const input = el("input", "fm-in fm-owner");
      input.value = row.owner || "";
      input.autocomplete = "off";
      input.setAttribute("aria-label", label("owner"));
      input.addEventListener("input", () => change("owner", input.value.slice(0, 120)));
      td.append(input);
      return td;
    };
    const dueCell = () => {
      const td = el("td", "fm-cell");
      const input = el("input", "fm-in fm-due");
      input.type = "date";
      input.value = row.due || "";
      input.setAttribute("aria-label", label("due"));
      input.addEventListener("change", () => change("due", /^\d{4}-\d{2}-\d{2}$/.test(input.value) ? input.value : ""));
      td.append(input);
      return td;
    };
    const statusCell = () => {
      const td = el("td", "fm-cell");
      const select = el("select", "fm-in fm-status");
      STATUSES.forEach((key) => { const option = el("option", null, data.status[key]); option.value = key; select.append(option); });
      select.value = row.status;
      select.setAttribute("aria-label", label("status"));
      select.addEventListener("change", () => change("status", select.value));
      td.append(select);
      return td;
    };
    const rpnTd = rpnCell(e.rpn);
    rpnTd.dataset.rpn = "";
    const apTd = el("td", "fm-ap-cell");
    apTd.dataset.ap = "";
    apTd.append(apChip(e.ap));
    const rpn2Td = rpnCell(e.rpn2, e.reduction);
    rpn2Td.dataset.rpn2 = "";
    const tools = el("td", "fm-tools");
    const duplicate = el("button", "button-ghost fm-dup", tx("Duplicate"));
    duplicate.type = "button";
    duplicate.setAttribute("aria-label", `${tx("Duplicate")} · ${tx("row {n}", { n })}`);
    duplicate.addEventListener("click", () => {
      const index = state.rows.findIndex((item) => item.id === row.id);
      if (index < 0) return;
      const copyRow = { ...state.rows[index], id: newId() };
      state.rows.splice(index + 1, 0, copyRow);
      own();
      save();
      renderAll();
      flash(status, tx("Row {n} duplicated.", { n }));
      grid.querySelector(`[data-id="${copyRow.id}"] textarea`)?.focus();
    });
    const remove = el("button", "dl-remove", "×");
    remove.type = "button";
    remove.setAttribute("aria-label", `${tx("Remove")} · ${tx("row {n}", { n })}`);
    remove.addEventListener("click", () => {
      const index = state.rows.findIndex((item) => item.id === row.id);
      if (index < 0) return;
      const [gone] = state.rows.splice(index, 1);
      own();
      save();
      renderAll();
      undoNote(status, tx("Removed: {text}", { text: gone.mode || gone.step || tx("row {n}", { n }) }), () => {
        state.rows.splice(Math.min(index, state.rows.length), 0, gone);
        save();
        renderAll();
      });
    });
    tools.append(duplicate, remove);
    tr.append(
      el("td", "num fm-no", String(n)),
      textCell("step"), textCell("function", true), textCell("mode", true), textCell("effect", true), rateCell("s"),
      textCell("cause", true), rateCell("o"), textCell("prevention", true), textCell("detection", true), rateCell("d"),
      rpnTd, apTd, textCell("action", true, data.text.actionPlaceholder), ownerCell(), dueCell(), statusCell(),
      rateCell("s2"), rateCell("o2"), rateCell("d2"), rpn2Td, tools,
    );
    return tr;
  };
  const renderGrid = () => {
    const rows = view();
    grid.replaceChildren(...rows.map((row) => gridRow(state.rows.find((item) => item.id === row.id))));
    gridWrap.hidden = !state.rows.length;
    empty.hidden = state.rows.length > 0;
    count.textContent = !state.rows.length ? "" : rows.length === state.rows.length ? tx("All {n} entries", { n: int.format(rows.length) }) : tx("{n} of {total} entries", { n: int.format(rows.length), total: int.format(state.rows.length) });
    sortSelect.value = state.sort;
    apFilter.value = state.filterAp;
    statusFilter.value = state.filterStatus;
  };
  const showHeader = () => headers.forEach((input) => { input.value = state[input.name] || ""; });

  // Exports ------------------------------------------------------------------------------------------------------------
  const sheetRows = () => [
    [C.step, C.function, C.mode, C.effect, C.s, C.cause, C.o, C.prevention, C.detection, C.d, C.rpn, C.ap, C.crit, C.action, C.owner, C.due, C.status, C.s2, C.o2, C.d2, C.rpn2],
    ...sortRows(state.rows.map(enrich), state.sort).map((row) => [
      row.step, row.function, row.mode, row.effect, row.s ?? "", row.cause, row.o ?? "", row.prevention, row.detection, row.d ?? "",
      row.rpn ?? "", row.ap ? data.ap[row.ap] : "", row.s && row.o ? row.s * row.o : "", row.action, row.owner, row.due, data.status[row.status],
      row.s2 ?? "", row.o2 ?? "", row.d2 ?? "", row.rpn2 ?? "",
    ]),
  ];
  const fileName = () => `${data.text.csv}${state.revision ? `-${state.revision.replace(/[^\w-]+/g, "")}` : ""}`;
  const summaryText = (sum) => {
    const list = sortRows(state.rows.map(enrich), "ap").filter((row) => row.ap);
    const head = [`${data.text.tool}: ${state.process || tx("Process")}`, [state.revision && `${tx("Revision")} ${state.revision}`, state.date && showDate(state.date), state.owner].filter(Boolean).join(" · ")].filter(Boolean);
    const lines = [
      ...head, "",
      `${tx("Failure modes")}: ${sum.modes} · AP ${data.ap.H}: ${sum.H} · AP ${data.ap.M}: ${sum.M} · AP ${data.ap.L}: ${sum.L}`,
      `${tx("Open actions")}: ${sum.openActions}${sum.overdue ? ` (${tx("{n} overdue", { n: sum.overdue })})` : ""}`,
      `${tx("RPN before → after")}: ${int.format(sum.rpnBefore)} → ${int.format(sum.rpnAfter)}${sum.reduction ? ` (−${pct(sum.reduction, 0)})` : ""}`,
      "", `${tx("Top risks")}:`,
      ...list.slice(0, 5).map((row, i) => `${i + 1}. ${row.mode || "–"} (${row.step || "–"}): S ${row.s} · O ${row.o} · D ${row.d} · ${C.rpn} ${row.rpn} · AP ${data.ap[row.ap]}${row.action ? `\n   ${C.action}: ${row.action}${row.owner ? ` (${row.owner}${row.due ? `, ${showDate(row.due)}` : ""})` : ""}` : ""}`),
    ];
    return lines.join("\n");
  };
  const problemText = (top) => (top ? `${top.mode || top.step}${top.step && top.mode ? ` (${top.step})` : ""}${top.cause ? `: ${top.cause}` : ""}` : "");

  // Results ------------------------------------------------------------------------------------------------------------
  const table = (heads, rows, className = "") => {
    const wrap = el("div", "dl-table-wrap");
    wrap.tabIndex = 0;
    const tbl = el("table", `dl-table ${className}`.trim());
    const thead = el("thead");
    const hr = el("tr");
    heads.forEach(([label, cls]) => { const th = el("th", cls, label); th.scope = "col"; hr.append(th); });
    thead.append(hr);
    const tbody = el("tbody");
    rows.forEach((cells) => {
      const tr = el("tr");
      cells.forEach(([value, cls]) => { const td = el("td", cls); td.append(value); tr.append(td); });
      tbody.append(tr);
    });
    tbl.append(thead, tbody);
    wrap.append(tbl);
    return wrap;
  };
  const addActions = (actions) => {
    if (!window.ActionsStore) return;
    const S = window.ActionsStore;
    const button = el("button", "button-secondary", tx("Add open actions to the Action Tracker"));
    button.type = "button";
    const out = el("p", "form-note fm-actions-status");
    out.setAttribute("role", "status");
    button.addEventListener("click", () => {
      // An action already open on the tracker, or twice on this sheet, goes over once.
      const known = new Set(S.list().filter((a) => S.isOpen(a) && a.source === "fmea").map((a) => a.title));
      const added = sortRows(state.rows.map(enrich), "ap").filter(isOpenAction).filter((row) => { const title = row.action.trim(); if (known.has(title)) return false; known.add(title); return true; }).map((row) => S.add({
        title: row.action.trim(), owner: row.owner, due: row.due, source: "fmea", area: row.step,
        priority: row.ap === "H" ? "High" : row.ap === "L" ? "Low" : "Medium",
        detail: [row.mode, row.cause && `${C.cause}: ${row.cause}`, row.rpn && `S ${row.s} · O ${row.o} · D ${row.d} · ${C.rpn} ${row.rpn} · AP ${data.ap[row.ap]}`].filter(Boolean).join(" · "),
        check: tx("Re-rate S, O and D on the FMEA row after the action: the RPN and the action priority must drop."),
      })).filter(Boolean);
      const link = el("a", "inline-link", tx("Open the Action Tracker"));
      link.href = S.trackerUrl().href;
      out.replaceChildren(added.length ? tx("Added {n} actions.", { n: added.length }) : tx("Every open action is already on the Action Tracker."), " ", link);
    });
    actions.append(button, out);
  };
  const paperToggle = () => {
    const box = el("div", "fm-paper");
    box.setAttribute("role", "group");
    box.setAttribute("aria-label", tx("Paper size"));
    [["a4", tx("A4 landscape")], ["a3", tx("A3 landscape")]].forEach(([key, label]) => {
      const button = el("button", "button-ghost", label);
      button.type = "button";
      button.setAttribute("aria-pressed", String(state.paper === key));
      button.addEventListener("click", () => {
        state.paper = key;
        save();
        box.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
        paperClass();
      });
      box.append(button);
    });
    return box;
  };
  const paperClass = () => {
    results.classList.toggle("fm-paper-a3", state.paper === "a3");
    results.classList.toggle("fm-paper-a4", state.paper !== "a3");
  };

  const renderResults = () => {
    results.replaceChildren();
    results.hidden = !state.rows.length;
    paperClass();
    if (!state.rows.length) return;
    const day = today();
    const rows = state.rows.map(enrich);
    const sum = summarize(rows, day);
    const ranked = sortRows(rows.filter((row) => row.ap), "ap");

    const head = el("div", "result-head");
    head.append(el("p", "result-label", `${data.text.tool}${state.process ? ` · ${state.process}` : ""}`));
    const h2 = el("h2");
    h2.append(el("span", null, int.format(sum.H)), ` ${tx("high priority")} · ${tx("{n} failure modes", { n: int.format(sum.modes) })}`);
    head.append(h2);
    const meta = [state.revision && `${tx("Revision")} ${state.revision}`, state.date && showDate(state.date), state.owner].filter(Boolean).join(" · ");
    if (meta) head.append(el("p", "fm-meta", meta));
    head.append(el("p", null, !sum.rated ? tx("Rate S, O and D on a row to see its action priority.")
      : sum.H ? tx("Start with the high-priority rows: each needs an action with an owner, or a written reason why there is none.")
        : sum.M ? tx("No high priority. Work through the medium rows, or write down why the risk is accepted.")
          : tx("Every rated failure mode is low priority. Keep the controls and review the sheet when the process changes.")));

    const stats = el("div", "dl-stats");
    stats.append(
      stat(tx("Failure modes"), int.format(sum.modes), sum.unrated ? tx("{n} not rated yet", { n: sum.unrated }) : tx("all rated")),
      stat(`AP ${data.ap.H}`, int.format(sum.H), sum.withoutAction ? tx("{n} high or medium without an action", { n: sum.withoutAction }) : ""),
      stat(`AP ${data.ap.M}`, int.format(sum.M), ""),
      stat(`AP ${data.ap.L}`, int.format(sum.L), ""),
      stat(tx("Open actions"), int.format(sum.openActions), sum.overdue ? tx("{n} overdue", { n: sum.overdue }) : tx("none overdue")),
      stat(tx("RPN before → after"), `${int.format(sum.rpnBefore)} → ${int.format(sum.rpnAfter)}`, sum.reduction ? tx("{p} lower after the actions", { p: pct(sum.reduction, 0) }) : tx("re-rate a row after its action")),
    );

    const top = sum.top;
    const focus = top ? focusCard({
      title: top.mode || top.step || tx("row {n}", { n: rowNumber(top.id) }),
      detail: top.mode ? top.step : "",
      lede: `S ${top.s} · O ${top.o} · D ${top.d} · ${C.rpn} ${int.format(top.rpn)} · AP ${data.ap[top.ap]}${top.effect ? `. ${C.effect}: ${top.effect}` : ""}`,
      advice: data.advice[top.ap],
      extraLabel: C.action,
      extra: top.action ? `${top.action}${top.owner ? ` (${top.owner}${top.due ? `, ${showDate(top.due)}` : ""})` : ""}` : tx("No action yet. Agree one with an owner and a date."),
      warning: sum.withoutAction ? tx("{n} high or medium rows have no action yet.", { n: sum.withoutAction }) : "",
    }) : null;

    const actions = resultActions(() => summaryText(sum), problemText(top), ranked.length ? () => paretoTable(rows, { source: data.text.tool, headers: [C.mode, C.step, C.rpn], valueLabel: C.rpn }) : null);
    addActions(actions);
    actions.append(paperToggle());

    const panels = [];
    if (CK && ranked.length) {
      const cells = heatCells(rows);
      const heat = panel(tx("Severity × occurrence"), tx("Each cell counts the failure modes with that severity and occurrence. The letter and the colour give the highest action priority among them; detection decides the rest."));
      const sLevels = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
      const oLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      heat.append(CK.figure(CK.heatmap(sLevels.map((s) => `S ${s}`), oLevels.map((o) => `O ${o}`), (r, c) => {
        const cell = cells.get(`${sLevels[r]}-${oLevels[c]}`);
        if (!cell) return null;
        return { text: `${cell.count} ${cell.ap}`, state: apState[cell.ap], tip: `S ${sLevels[r]} · O ${oLevels[c]}: ${cell.rows.map((row) => `${row.mode || row.step} (D ${row.d}, AP ${row.ap})`).join("; ")}` };
      }, { title: `${data.text.tool}: ${tx("Severity × occurrence")}`, cellSize: 40, labelWidth: 56 }), { fileName: `${data.text.csv}-heatmap` }));
      heat.append(CK.legend(["H", "M", "L"].map((level) => ({ label: apText(level), state: apState[level] }))));
      panels.push(heat);

      const ten = sortRows(rows.filter((row) => row.rpn), "rpn").slice(0, 10);
      const bars = panel(tx("Top 10 by RPN"), tx("The columns are numbered by rank; the list under the chart names them. The colour and the letter give the action priority."));
      bars.append(CK.figure(CK.bars(ten.map((row, i) => ({ label: String(i + 1), value: row.rpn, state: apState[row.ap], tip: `${i + 1}. ${row.mode || row.step}: ${C.rpn} ${row.rpn} (S ${row.s} × O ${row.o} × D ${row.d}), AP ${data.ap[row.ap]}` })), { title: `${data.text.tool}: ${tx("Top 10 by RPN")}`, format: (v) => int.format(Math.round(v)) }), { fileName: `${data.text.csv}-top10` }));
      const key = el("ol", "fm-key");
      ten.forEach((row) => { const li = el("li"); li.append(`${row.mode || row.step} `, el("small", null, `${row.step ? `${row.step} · ` : ""}${C.rpn} ${int.format(row.rpn)} · `), apChip(row.ap)); key.append(li); });
      bars.append(key);
      panels.push(bars);
    }

    const reRated = sortRows(rows.filter((row) => row.rpn && row.rpn2), "rpn");
    if (reRated.length) {
      const after = panel(tx("Before and after the action"), tx("The rows rated again after their action. Severity rarely moves; the cause and the controls do."));
      after.append(table([[C.mode], [C.rpn, "num"], [C.rpn2, "num"], [tx("Reduction"), "num"], [`${C.ap}`]], reRated.map((row) => [
        [row.mode || row.step], [int.format(row.rpn), "num"], [int.format(row.rpn2), "num"], [row.reduction === null ? "–" : `${row.reduction > 0 ? "−" : row.reduction < 0 ? "+" : "±"}${pct(Math.abs(row.reduction), 0)}`, "num"],
        [`${row.ap} → ${row.ap2 || "–"}`],
      ])));
      panels.push(after);
    }

    const open = rows.filter(isOpenAction).sort((a, b) => (a.due || "9999").localeCompare(b.due || "9999") || byPriority(a, b));
    if (open.length) {
      const list = panel(tx("Open actions"), tx("By due date. An action is closed when it is done and the row is rated again."));
      list.append(table([[C.action], [C.owner], [C.due], [C.mode], [C.ap]], open.map((row) => {
        const due = el("span", row.due && row.due < day ? "fm-late" : null, row.due ? `${showDate(row.due)}${row.due < day ? ` · ${tx("overdue")}` : ""}` : "–");
        return [[row.action], [row.owner || "–"], [due], [row.mode || row.step], [apChip(row.ap)]];
      })));
      panels.push(list);
    }

    // The whole sheet, read-only: the evidence on screen, the sheet on paper.
    const sheet = panel(tx("The sheet"), tx("Every row in the order chosen above the grid. This is the page that prints."));
    sheet.classList.add("fm-sheet");
    const body = sheetRows();
    sheet.append(table(body[0].map((label, i) => [label, [4, 6, 9, 10, 12, 17, 18, 19, 20].includes(i) ? "num" : ""]), body.slice(1).map((cells) => cells.map((value, i) => [i === 15 ? showDate(String(value)) : String(value), [4, 6, 9, 10, 12, 17, 18, 19, 20].includes(i) ? "num" : ""])), "fm-sheet-table"));
    panels.push(sheet);

    resultLayout(results, { head, stats, focus, actions, panels });
  };
  const renderSoon = renderOnPause(renderResults, () => state.rows.length, 40);

  const renderAll = () => {
    note.hidden = !state.example;
    showHeader();
    renderGrid();
    renderResults();
  };

  // Events -------------------------------------------------------------------------------------------------------------
  headers.forEach((input) => input.addEventListener("input", () => {
    state[input.name] = input.name === "date" ? (/^\d{4}-\d{2}-\d{2}$/.test(input.value) ? input.value : "") : input.value.slice(0, 200);
    own();
    save();
    renderSoon();
  }));
  sortSelect.addEventListener("change", () => { state.sort = sortSelect.value; save(); renderGrid(); renderResults(); });
  apFilter.addEventListener("change", () => { state.filterAp = apFilter.value; save(); renderGrid(); });
  statusFilter.addEventListener("change", () => { state.filterStatus = statusFilter.value; save(); renderGrid(); });
  // A new row is unrated, so it sorts to the end of the grid; the filters are cleared so it shows.
  root.querySelector("[data-add]").addEventListener("click", () => {
    const row = cleanRow({});
    state.rows.push(row);
    state.filterAp = "";
    state.filterStatus = "";
    if (!state.date) state.date = today();
    own();
    save();
    renderAll();
    grid.querySelector(`[data-id="${row.id}"] textarea`)?.focus();
  });
  root.querySelector("[data-fill]").addEventListener("click", () => {
    const template = data.templates.find((t) => t.id === templateSelect.value) || data.templates[0];
    if (state.example) Object.assign(state, { process: "", owner: "", date: "", revision: "", rows: [], example: false });
    const rows = fromTemplate(template);
    state.rows.push(...rows);
    if (!state.process) state.process = template.process;
    if (!state.date) state.date = today();
    state.filterAp = "";
    state.filterStatus = "";
    if (state.sort !== "step") state.sort = "step";
    own();
    save();
    renderAll();
    flash(templateStatus, tx("{n} steps added. Now write how each one can fail.", { n: rows.length }));
  });
  root.querySelector("[data-example]").addEventListener("click", () => {
    loadExample();
    save();
    renderAll();
    results.scrollIntoView?.({ behavior: "smooth", block: "start" });
  });
  root.querySelector("[data-clear]").addEventListener("click", () => {
    if (!state.rows.length || !window.confirm(tx("Clear the whole sheet in this browser?"))) return;
    Object.assign(state, { process: "", owner: "", date: "", revision: "", rows: [], example: false, filterAp: "", filterStatus: "" });
    save();
    renderAll();
  });
  root.querySelector("[data-csv]").addEventListener("click", () => { if (state.rows.length) downloadCsv(fileName(), sheetRows()); });
  root.querySelector("[data-xlsx]").addEventListener("click", () => { if (state.rows.length) downloadXlsx(fileName(), sheetRows(), { sheet: data.text.tool, title: `${data.text.tool}${state.process ? `: ${state.process}` : ""}` }); });
  // The sheet as a file of its own: to keep a revision, or to hand it to a colleague who opens it in the same tool. It is
  // a template file (js/template-pack.js, kind "fmea-sheet"); the plain files of earlier versions still open.
  const Pack = window.TemplatePack;
  const sheetOf = (raw) => { const sheet = cleanSheet(raw); return sheet && sheet.rows.length ? sheet : null; };
  root.querySelector("[data-json]").addEventListener("click", () => {
    if (!state.rows.length) return;
    const sheet = { process: state.process, owner: state.owner, date: state.date, revision: state.revision, rows: state.rows };
    if (Pack) { Pack.save({ tool: "fmea", kind: "fmea-sheet", name: [state.process || data.text.tool, state.revision].filter(Boolean).join(" "), data: JSON.parse(JSON.stringify(sheet)) }); return; }
    const link = el("a");
    link.href = URL.createObjectURL(new Blob([JSON.stringify({ tool: "fmea", version: 1, ...sheet }, null, 2)], { type: "application/json" }));
    link.download = `${fileName()}-${today()}.json`;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  });
  const opener = root.querySelector("[data-open]");
  const openSheet = (sheet, why) => {
    opener.value = "";
    if (!sheet) { flash(fileStatus, why || tx("This file is not an FMEA sheet from this tool.")); return; }
    if (state.rows.length && !state.example && !window.confirm(tx("Replace the sheet in this browser with the file?"))) return;
    Object.assign(state, sheet, { example: false, filterAp: "", filterStatus: "" });
    save();
    renderAll();
    flash(fileStatus, tx("Opened: {n} failure modes.", { n: sheet.rows.length }));
  };
  opener.addEventListener("change", () => {
    const file = opener.files?.[0];
    if (!file) return;
    // A file of another tool, a damaged or a too large one has its own reason; anything else is "not an FMEA sheet".
    if (Pack) { Pack.readFile(file, { tool: "fmea", kind: "fmea-sheet", validate: sheetOf, legacy: sheetOf }, (result) => openSheet(result.ok ? result.data : null, ["format", "content"].includes(result.error) ? "" : result.message)); return; }
    const reader = new FileReader();
    reader.onload = () => {
      let sheet = null;
      try { sheet = sheetOf(JSON.parse(String(reader.result))); } catch { sheet = null; }
      openSheet(sheet);
    };
    reader.readAsText(file);
  });

  renderAll();
})();
