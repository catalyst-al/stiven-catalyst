// The Kaizen Board: the team's improvement ideas from suggestion to verified result. Six PDCA columns (Idea, Plan,
// Do, Check, Adopted, Dropped), an effort/impact matrix of the open ideas and the numbers a weekly review needs.
// The arithmetic lives in window.KaizenMath (also window.KaizenBoardMath), so tests can call it without a page.
(() => {
  const FLOW = ["idea", "plan", "do", "check", "act"];
  const STATUSES = [...FLOW, "dropped"];
  const DAY = 864e5;
  const clampScale = (value, fallback = 3) => {
    const n = Math.round(Number(value));
    return Number.isFinite(n) ? Math.min(5, Math.max(1, n)) : fallback;
  };
  const isIso = (value) => /^\d{4}-\d{2}-\d{2}$/.test(String(value));
  const daysBetween = (from, to) => (isIso(from) && isIso(to) ? Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / DAY) : null);
  const monthKey = (iso) => (isIso(iso) ? iso.slice(0, 7) : "");
  // The last n months as "YYYY-MM", oldest first, ending with the month of `today`.
  const lastMonths = (today, n = 6) => {
    const [y, m] = today.split("-").map(Number);
    return Array.from({ length: n }, (_, i) => {
      const date = new Date(Date.UTC(y, m - 1 - (n - 1 - i), 1));
      return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
    });
  };
  const isOpen = (row) => row.status !== "act" && row.status !== "dropped";
  const math = {
    FLOW, STATUSES, daysBetween, monthKey, lastMonths, clampScale, isOpen,
    // Impact weighs twice: a small effort for a big change is what the board is for. From −3 to 9.
    priority: (impact, effort) => clampScale(impact) * 2 - clampScale(effort),
    // The 1–5 scales on the 0–10 matrix: 1 sits on the edge, 3 on the middle line.
    matrixPos: (value) => (clampScale(value) - 1) * 2.5,
    // 0 quick wins (low effort, high impact), 1 projects (high, high), 2 fill-ins (low, low), 3 thankless (high, low).
    quadrant: (effort, impact) => {
      const hard = clampScale(effort) > 3;
      const big = clampScale(impact) >= 3;
      return big ? (hard ? 1 : 0) : hard ? 3 : 2;
    },
    // The position of an idea on the matrix; `seen` counts the ideas already placed on the same scores.
    spread: (effort, impact, seen = new Map()) => {
      const key = `${clampScale(effort)}|${clampScale(impact)}`;
      const k = seen.get(key) || 0;
      seen.set(key, k + 1);
      return { x: Math.min(10, math.matrixPos(effort) + k * 0.45), y: Math.max(0, math.matrixPos(impact) - k * 0.45) };
    },
    daysInColumn: (row, today) => Math.max(0, daysBetween(row.moved || row.date, today) ?? 0),
    ranking: (rows) => rows.filter(isOpen).map((row) => ({ row, score: math.priority(row.impact, row.effort) }))
      .sort((a, b) => b.score - a.score || b.row.impact - a.row.impact || (Number(b.row.saving) || 0) - (Number(a.row.saving) || 0)),
    adoption: (rows) => {
      const adopted = rows.filter((row) => row.status === "act").length;
      return { adopted, total: rows.length, rate: rows.length ? adopted / rows.length : 0 };
    },
    // Mean days from the idea to its adoption, over the adopted ideas that carry both dates.
    averageLead: (rows) => {
      const days = rows.filter((row) => row.status === "act").map((row) => daysBetween(row.date, row.adopted)).filter((d) => d !== null && d >= 0);
      return days.length ? days.reduce((sum, d) => sum + d, 0) / days.length : null;
    },
    thisMonth: (rows, today) => rows.filter((row) => monthKey(row.date) === monthKey(today)).length,
    adoptedPerMonth: (rows, today, n = 6) => lastMonths(today, n).map((month) => ({ month, value: rows.filter((row) => row.status === "act" && monthKey(row.adopted) === month).length })),
    byWaste: (rows, wastes) => {
      const map = new Map(wastes.map((waste) => [waste, { open: 0, act: 0, dropped: 0 }]));
      rows.forEach((row) => {
        if (!map.has(row.waste)) map.set(row.waste, { open: 0, act: 0, dropped: 0 });
        map.get(row.waste)[isOpen(row) ? "open" : row.status]++;
      });
      return [...map].filter(([, counts]) => counts.open + counts.act + counts.dropped > 0).map(([waste, counts]) => ({ waste, ...counts }));
    },
    perPerson: (rows) => {
      const map = new Map();
      rows.forEach((row) => { const who = row.by || "?"; map.set(who, (map.get(who) || 0) + 1); });
      return [...map].map(([key, value]) => ({ key, value })).sort((a, b) => b.value - a.value || a.key.localeCompare(b.key));
    },
    savings: (rows) => {
      const month = rows.filter((row) => row.status === "act").reduce((sum, row) => sum + (Number(row.saving) || 0), 0);
      return { month, year: month * 12 };
    },
    // The idea of the month: the highest impact among the ideas adopted in the latest month with an adoption; ties go
    // to the saving, then to the earlier idea.
    ideaOfMonth: (rows) => {
      const adopted = rows.filter((row) => row.status === "act" && isIso(row.adopted));
      if (!adopted.length) return null;
      const month = adopted.map((row) => monthKey(row.adopted)).sort().at(-1);
      return adopted.filter((row) => monthKey(row.adopted) === month)
        .sort((a, b) => b.impact - a.impact || (Number(b.saving) || 0) - (Number(a.saving) || 0) || a.date.localeCompare(b.date))[0];
    },
  };
  window.KaizenMath = math;
  window.KaizenBoardMath = math;

  const root = document.querySelector("[data-kaizen-board]");
  const dataEl = document.getElementById("kaizen-board-data");
  const results = document.querySelector("[data-results]");
  if (!root || !dataEl || !results || !window.ToolKit || !window.ChartKit) return;

  const { tx, el, int, num, euro, pct, showDate, read, write, loadState, isObject, str, today, addDays, parseDate, parseNumber, flash, undoNote, panel, stat, barList, resultLayout, resultActions, firstVisit, exampleStamp, exampleMatches, exampleNote, downloadCsv, downloadXlsx } = window.ToolKit;
  const ChartKit = window.ChartKit;
  const data = JSON.parse(dataEl.textContent);
  const KEY = data.storageKey;
  const label = (status) => data.statuses[status] || status;
  const id = () => `k${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

  // Rebuild a saved idea field by field, so damaged data cannot break the page.
  const clean = (row) => {
    if (!isObject(row) || !str(row.title).trim()) return null;
    const saving = parseNumber(row.saving);
    const date = parseDate(row.date) || today();
    const status = STATUSES.includes(row.status) ? row.status : "idea";
    return {
      id: str(row.id) || id(),
      title: str(row.title).trim().slice(0, 200),
      waste: str(row.waste).trim() || data.wastes[0],
      area: str(row.area).trim().slice(0, 80),
      by: str(row.by).trim().slice(0, 80),
      date,
      effort: clampScale(row.effort, 2),
      impact: clampScale(row.impact, 3),
      saving: Number.isFinite(saving) && saving >= 0 ? saving : "",
      status,
      owner: str(row.owner).trim().slice(0, 80),
      due: parseDate(row.due),
      next: str(row.next).trim().slice(0, 500),
      result: str(row.result).trim().slice(0, 1000),
      reason: str(row.reason).trim().slice(0, 500),
      moved: parseDate(row.moved) || date,
      adopted: status === "act" ? parseDate(row.adopted) || parseDate(row.moved) || date : "",
    };
  };
  const state = loadState(KEY, { rows: [], example: {} });
  state.rows = state.rows.map(clean).filter(Boolean);
  const save = () => write(KEY, state);

  // The example's dates are days relative to today, so the board always looks like this month's.
  const exampleRows = () => data.example.rows.map((row) => {
    const copy = { ...row };
    ["date", "moved", "adopted", "due"].forEach((name) => { if (typeof copy[name] === "number") copy[name] = addDays(today(), copy[name]); });
    return clean(copy);
  }).filter(Boolean);
  const loadExample = () => {
    state.rows = exampleRows();
    state.example = exampleStamp(state.rows);
  };
  const dropExample = () => { state.rows = []; state.example = {}; };

  // Form pieces ------------------------------------------------------------------------------------------------------
  const entry = root.querySelector("[data-entry]");
  const entryStatus = root.querySelector("[data-entry-status]");
  const countNote = root.querySelector("[data-count]");
  const status = root.querySelector("[data-status]");
  const empty = root.querySelector("[data-empty]");
  const areaList = root.querySelector("[data-areas]");
  const scaleFor = (name) => data.scales[name] || [];
  // Areas from the workplace profile when there is one, else the tool's own list.
  const fillAreas = () => {
    const names = window.Workplace ? window.Workplace.areas().map((area) => area.name) : [];
    const list = names.length ? names : data.areas;
    areaList.replaceChildren(...list.map((name) => { const option = el("option"); option.value = name; return option; }));
  };
  fillAreas();
  window.addEventListener("workplace:changed", fillAreas);
  entry.elements.date.value = today();

  let editing = null;
  const changed = () => { save(); render(); };
  const dropUndo = () => { clearTimeout(status.timer); status.textContent = ""; };

  entry.addEventListener("submit", (event) => {
    event.preventDefault();
    const f = entry.elements;
    const row = clean({ title: f.title.value, waste: f.waste.value, area: f.area.value, by: f.by.value, date: f.date.value, effort: f.effort.value, impact: f.impact.value, saving: f.saving.value, owner: f.owner.value, due: f.due.value, status: "idea" });
    if (!row) { flash(entryStatus, tx("Write the idea first.")); f.title.focus(); return; }
    if (exampleMatches(state)) { dropUndo(); dropExample(); }
    row.moved = row.date;
    state.rows.push(row);
    changed();
    ["title", "saving", "owner", "due"].forEach((name) => { f[name].value = ""; });
    f.title.focus();
    flash(entryStatus, tx("On the board: {title}", { title: row.title }));
  });

  root.querySelector("[data-example]").addEventListener("click", () => {
    dropUndo();
    editing = null;
    loadExample();
    changed();
    results.scrollIntoView({ behavior: "smooth", block: "start" });
    results.focus({ preventScroll: true });
  });
  root.querySelector("[data-clear]").addEventListener("click", () => {
    if (!state.rows.length || !window.confirm(tx("Clear the whole board? Every idea goes."))) return;
    dropUndo();
    editing = null;
    dropExample();
    changed();
  });
  const table = () => [
    [tx("Idea"), tx("What it removes"), tx("Area"), tx("Proposed by"), tx("Date"), tx("Effort"), tx("Impact"), tx("Saving € per month"), tx("Status"), tx("Owner"), tx("Due date"), tx("Next step"), tx("Result"), tx("Reason"), tx("In column since"), tx("Adopted on")],
    ...state.rows.map((row) => [row.title, row.waste, row.area, row.by, row.date, row.effort, row.impact, row.saving, label(row.status), row.owner, row.due, row.next, row.result, row.reason, row.moved, row.adopted]),
  ];
  root.querySelector("[data-csv]").addEventListener("click", () => { if (state.rows.length) downloadCsv(data.text.csv, table()); });
  root.querySelector("[data-xlsx]").addEventListener("click", () => { if (state.rows.length) downloadXlsx(data.text.csv, table(), { title: data.text.tool }); });

  // Moves ------------------------------------------------------------------------------------------------------------
  const setStatus = (row, next) => {
    if (row.status === next) return;
    row.status = next;
    row.moved = today();
    row.adopted = next === "act" ? today() : "";
    if (next !== "dropped") row.reason = "";
  };
  const step = (row, dir) => {
    const at = FLOW.indexOf(row.status);
    const to = FLOW[at + dir];
    if (at < 0 || !to) return;
    setStatus(row, to);
    changed();
    focusCard(row.id, dir > 0 ? "forward" : "back");
  };
  // After a move the same button on the card is focused again, so a keyboard user can keep moving it.
  const focusCard = (rowId, action) => {
    const card = results.querySelector(`[data-id="${rowId}"]`);
    (card?.querySelector(`[data-action="${action}"]:not([disabled])`) || card?.querySelector("[data-action]"))?.focus();
  };

  // The 5 Whys and A3 worksheets in this page's language (the links in the aside), opened on an idea.
  const toolUrl = (selector, fallback, title) => {
    const url = new URL(document.querySelector(selector)?.getAttribute("href") || fallback, location.href);
    url.searchParams.set("problem", title);
    return url.href;
  };

  // Cards ------------------------------------------------------------------------------------------------------------
  const chip = (text, title) => { const node = el("li", "ck-chip", text); if (title) node.title = title; return node; };
  const select = (name, options, current, ariaLabel) => {
    const node = el("select", "kb-in");
    node.name = name;
    node.setAttribute("aria-label", ariaLabel);
    options.forEach(([value, text]) => { const option = el("option", null, text); option.value = value; option.selected = String(value) === String(current); node.append(option); });
    return node;
  };
  const input = (name, value, ariaLabel, props = {}) => {
    const node = el(props.rows ? "textarea" : "input", "kb-in");
    node.name = name;
    node.value = value;
    node.autocomplete = "off";
    node.setAttribute("aria-label", ariaLabel);
    Object.assign(node, props);
    return node;
  };
  const field = (text, control) => {
    const box = el("label", "kb-field");
    box.append(el("span", null, text), control);
    return box;
  };
  const editForm = (row) => {
    const form = el("form", "kb-edit");
    form.noValidate = true;
    const grid = el("div", "kb-edit-grid");
    const scale = (name) => scaleFor(name).map((text, i) => [i + 1, text]);
    grid.append(
      field(tx("Idea"), input("title", row.title, tx("Idea"), { className: "kb-in kb-wide" })),
      field(tx("What it removes"), select("waste", [...new Set([...data.wastes, row.waste])].map((w) => [w, w]), row.waste, tx("What it removes"))),
      field(tx("Area"), input("area", row.area, tx("Area"), { placeholder: data.text.areaPlaceholder })),
      field(tx("Proposed by"), input("by", row.by, tx("Proposed by"))),
      field(tx("Date"), input("date", row.date, tx("Date"), { type: "date" })),
      field(tx("Effort"), select("effort", scale("effort"), row.effort, tx("Effort"))),
      field(tx("Impact"), select("impact", scale("impact"), row.impact, tx("Impact"))),
      field(tx("Saving € per month"), input("saving", row.saving === "" ? "" : String(row.saving), tx("Saving € per month"), { type: "number", min: "0", step: "1", inputMode: "decimal" })),
      field(tx("Status"), select("status", STATUSES.map((s) => [s, label(s)]), row.status, tx("Status"))),
      field(tx("Owner"), input("owner", row.owner, tx("Owner"))),
      field(tx("Due date"), input("due", row.due, tx("Due date"), { type: "date" })),
      field(tx("Next step"), input("next", row.next, tx("Next step"), { placeholder: data.text.nextPlaceholder, rows: 2 })),
      field(tx("Result"), input("result", row.result, tx("Result"), { placeholder: data.text.resultPlaceholder, rows: 2 })),
      field(tx("Reason, when dropped"), input("reason", row.reason, tx("Reason, when dropped"), { placeholder: data.text.reasonPlaceholder, rows: 2 })),
    );
    grid.querySelector("[name=title]").closest(".kb-field").classList.add("kb-wide");
    ["next", "result", "reason"].forEach((name) => grid.querySelector(`[name=${name}]`).closest(".kb-field").classList.add("kb-wide"));
    const actions = el("div", "tool-actions kb-edit-actions");
    const saveButton = el("button", "button-primary", tx("Save"));
    saveButton.type = "submit";
    const cancel = el("button", "button-ghost", tx("Cancel"));
    cancel.type = "button";
    cancel.addEventListener("click", () => { editing = null; render(); focusCard(row.id, "edit"); });
    const remove = el("button", "button-ghost kb-danger", tx("Remove"));
    remove.type = "button";
    remove.addEventListener("click", () => {
      const index = state.rows.indexOf(row);
      state.rows.splice(index, 1);
      editing = null;
      changed();
      undoNote(status, tx("Removed: {title}", { title: row.title }), () => { state.rows.splice(Math.min(index, state.rows.length), 0, row); changed(); });
    });
    const links = el("div", "kb-links");
    const a3 = el("a", "inline-link", tx("Take to A3"));
    a3.href = toolUrl("a[data-a3]", "../a3-report/", row.title);
    const whys = el("a", "inline-link", tx("Take it to 5 Whys"));
    whys.href = toolUrl("a[data-five-whys]", "../five-whys/", row.title);
    links.append(a3, whys);
    actions.append(saveButton, cancel, remove, links);
    form.append(grid, actions);
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const f = form.elements;
      const before = row.status;
      const next = clean({ ...row, title: f.title.value, waste: f.waste.value, area: f.area.value, by: f.by.value, date: f.date.value, effort: f.effort.value, impact: f.impact.value, saving: f.saving.value, status: f.status.value, owner: f.owner.value, due: f.due.value, next: f.next.value, result: f.result.value, reason: f.reason.value });
      if (!next) { f.title.focus(); return; }
      Object.assign(row, next);
      // A status changed in the form counts as a move: the card starts its days in the new column today.
      if (before !== row.status) Object.assign(row, { moved: today(), adopted: row.status === "act" ? today() : "", reason: row.status === "dropped" ? row.reason : "" });
      editing = null;
      changed();
      focusCard(row.id, "edit");
    });
    return form;
  };

  const card = (row) => {
    const node = el("article", "kb-card");
    node.dataset.id = row.id;
    const score = math.priority(row.impact, row.effort);
    const head = el("div", "kb-card-head");
    head.append(el("h4", "kb-card-title", row.title), el("span", "kb-score", String(score)));
    head.lastChild.title = tx("Priority score: impact × 2 − effort");
    head.lastChild.setAttribute("aria-label", tx("Priority {n}", { n: score }));
    node.append(head);
    node.append(el("p", "kb-card-meta", [row.waste, row.area].filter(Boolean).join(" · ")));
    const chips = el("ul", "ck-chips kb-chips");
    chips.append(chip(`${tx("E")} ${row.effort}`, `${tx("Effort")} ${row.effort}`), chip(`${tx("I")} ${row.impact}`, `${tx("Impact")} ${row.impact}`));
    if (row.saving !== "") chips.append(chip(`${euro.format(row.saving)}/${tx("month")}`));
    if (isOpen(row) && row.due && row.due < today()) {
      const late = chip(`! ${tx("Overdue")}`);
      late.classList.add("is-warn");
      chips.append(late);
    }
    node.append(chips);
    const who = row.owner || row.by;
    const when = row.status === "act" ? tx("adopted {date}", { date: showDate(row.adopted) })
      : row.status === "dropped" ? tx("dropped {date}", { date: showDate(row.moved) })
      : tx("{n} days here", { n: int.format(math.daysInColumn(row, today())) });
    node.append(el("p", "kb-card-people", `${who ? `${who} · ` : ""}${when}`));
    if (row.status === "dropped" && row.reason) node.append(el("p", "kb-card-note", row.reason));
    if (row.status === "act" && row.result) node.append(el("p", "kb-card-note", row.result));
    if (isOpen(row) && row.next) node.append(el("p", "kb-card-note", `→ ${row.next}`));

    const actions = el("div", "kb-card-actions");
    const button = (action, text, aria, onClick, disabled = false) => {
      const b = el("button", "kb-move", text);
      b.type = "button";
      b.dataset.action = action;
      b.setAttribute("aria-label", aria);
      b.title = aria;
      b.disabled = disabled;
      b.addEventListener("click", onClick);
      return b;
    };
    const at = FLOW.indexOf(row.status);
    if (row.status === "dropped") {
      actions.append(button("forward", tx("Reopen"), tx("Reopen: {title}", { title: row.title }), () => { setStatus(row, "idea"); changed(); focusCard(row.id, "forward"); }));
    } else {
      actions.append(
        button("back", "◀", tx("Move back to {column}: {title}", { column: label(FLOW[at - 1] || FLOW[0]), title: row.title }), () => step(row, -1), at <= 0),
        button("forward", "▶", tx("Move on to {column}: {title}", { column: label(FLOW[at + 1] || FLOW[at]), title: row.title }), () => step(row, 1), at >= FLOW.length - 1),
      );
    }
    const edit = button("edit", tx("Edit"), tx("Edit: {title}", { title: row.title }), () => { editing = editing === row.id ? null : row.id; render(); focusCard(row.id, "edit"); });
    edit.setAttribute("aria-expanded", String(editing === row.id));
    actions.append(edit);
    if (row.status !== "dropped") {
      actions.append(button("drop", tx("Drop"), tx("Drop: {title}", { title: row.title }), () => { setStatus(row, "dropped"); editing = row.id; changed(); results.querySelector(`[data-id="${row.id}"] [name=reason]`)?.focus(); }));
    }
    if (row.status === "plan" && window.ActionsStore) {
      // The next step of a planned idea is an action with an owner and a date; the tracker keeps it with the others.
      actions.append(button("action", tx("Add to actions"), tx("Add the next step to the Action Tracker: {title}", { title: row.title }), () => {
        const added = window.ActionsStore.add({ title: row.next || row.title, detail: `${tx("Kaizen idea")}: ${row.title}${row.by ? ` (${row.by})` : ""}`, owner: row.owner || row.by, due: row.due, example: row.example === true, source: "kaizen-board", check: row.result, area: row.area, priority: score >= 5 ? "High" : "Medium" });
        const link = el("a", "inline-link", tx("Open the Action Tracker"));
        link.href = window.ActionsStore.trackerUrl().href;
        status.replaceChildren(added ? `${tx("Added to the actions: {title}", { title: added.title })} ` : `${window.ToolKit.actionRefused(window.ActionsStore.lastAdd)} `, link);
        clearTimeout(status.timer);
        status.timer = setTimeout(() => { status.textContent = ""; }, 8000);
      }));
    }
    node.append(actions);
    if (editing === row.id) node.append(editForm(row));
    return node;
  };

  const board = () => {
    const wrap = el("div", "kb-board-wrap");
    const grid = el("div", "kb-board");
    grid.setAttribute("role", "list");
    STATUSES.forEach((key) => {
      const rows = state.rows.filter((row) => row.status === key).sort((a, b) => (a.moved || a.date).localeCompare(b.moved || b.date));
      const column = el("section", `kb-column is-${key}`);
      column.setAttribute("role", "listitem");
      column.setAttribute("aria-label", `${label(key)} (${rows.length})`);
      const head = el("header", "kb-column-head");
      head.append(el("h3", "kb-column-title", label(key)), el("span", "kb-column-count", int.format(rows.length)));
      column.append(head, el("p", "kb-column-hint", data.statusHints[key] || ""));
      const list = el("div", "kb-cards");
      rows.forEach((row) => list.append(card(row)));
      if (!rows.length) list.append(el("p", "kb-column-empty", tx("Nothing here.")));
      column.append(list);
      grid.append(column);
    });
    wrap.append(grid);
    return wrap;
  };

  // Results ----------------------------------------------------------------------------------------------------------
  const head = el("div", "kb-head");
  const body = el("div", "kb-body");
  results.append(head, body);
  const note = exampleNote(body, () => { dropExample(); editing = null; changed(); });
  // The matrix shows the open ideas with the effort and the impact as the two axes.
  const matrixPanel = () => {
    const open = state.rows.filter(isOpen);
    const box = panel(tx("Effort and impact"), tx("Open ideas only. Top left is where the week's work is."));
    if (!open.length) { box.append(el("p", "form-note", tx("No open ideas. Everything is adopted or dropped."))); return box; }
    const colors = [ChartKit.C.blue, ChartKit.C.warn, ChartKit.C.muted, ChartKit.C.danger];
    // Ideas with the same scores would hide each other; each further one sits a little to the right and down.
    const seen = new Map();
    const points = open.map((row) => ({
      ...math.spread(row.effort, row.impact, seen), label: row.title, color: colors[math.quadrant(row.effort, row.impact)],
      tip: `${row.title}\n${tx("Effort")} ${row.effort} · ${tx("Impact")} ${row.impact} · ${tx("Priority")} ${math.priority(row.impact, row.effort)}\n${data.quadrants[math.quadrant(row.effort, row.impact)]}`,
    }));
    box.append(ChartKit.figure(ChartKit.quadrant(points, { title: tx("Effort and impact"), names: data.quadrants, xLabel: tx("Effort"), yLabel: tx("Impact") }), { fileName: `${data.text.csv}-matrix` }));
    box.append(ChartKit.legend(data.quadrants.map((name, i) => ({ label: name, color: colors[i] }))));
    const ranking = math.ranking(state.rows);
    box.append(el("p", "result-label kb-sub", tx("Ranking by priority")));
    box.append(barList(ranking.map(({ row, score }) => ({ key: row.title, value: Math.max(0, score) + 1, score, row })), {
      ranked: true,
      label: (item) => [String(item.score), ` · ${tx("E")} ${item.row.effort} · ${tx("I")} ${item.row.impact}`],
      title: (item) => data.quadrantAdvice[data.quadrants[math.quadrant(item.row.effort, item.row.impact)]] || "",
      highlight: (item) => math.quadrant(item.row.effort, item.row.impact) === 0,
      tag: data.quadrants[0],
    }));
    const top = ranking[0];
    if (top) box.append(el("p", "dl-panel-note", `${data.quadrants[math.quadrant(top.row.effort, top.row.impact)]}: ${data.quadrantAdvice[data.quadrants[math.quadrant(top.row.effort, top.row.impact)]] || ""}`));
    return box;
  };
  const monthName = (() => {
    const format = new Intl.DateTimeFormat(window.ToolKit.LOCALE, { month: "short", timeZone: "UTC" });
    const SQ = ["jan", "shk", "mar", "pri", "maj", "qer", "korr", "gush", "sht", "tet", "nën", "dhj"];
    return (month) => (window.ToolKit.LANG === "sq" ? SQ[Number(month.slice(5, 7)) - 1] : format.format(new Date(`${month}-01T00:00:00Z`)));
  })();
  const monthsPanel = () => {
    const box = panel(tx("Adopted per month"), tx("The last six months. The aim is a steady flow, not one big month."));
    const items = math.adoptedPerMonth(state.rows, today()).map(({ month, value }) => ({ label: monthName(month), value }));
    box.append(ChartKit.figure(ChartKit.bars(items, { title: tx("Adopted per month"), unit: tx("ideas adopted"), format: (v) => int.format(Math.round(v)) }), { fileName: `${data.text.csv}-months` }));
    return box;
  };
  const wastePanel = () => {
    const box = panel(tx("Ideas by what they remove"), tx("Where the team sees waste, and how much of it was turned into a standard."));
    const keys = [tx("Open"), label("act"), label("dropped")];
    const groups = math.byWaste(state.rows, data.wastes).map((item) => ({ label: item.waste, parts: [{ key: keys[0], value: item.open }, { key: keys[1], value: item.act }, { key: keys[2], value: item.dropped }] }));
    box.append(ChartKit.figure(ChartKit.stacked(groups, { title: tx("Ideas by what they remove"), keys, colors: { [keys[0]]: ChartKit.C.blue, [keys[1]]: ChartKit.C.ok, [keys[2]]: ChartKit.C.muted }, unit: tx("ideas"), format: (v) => int.format(Math.round(v)) }), { fileName: `${data.text.csv}-waste` }));
    return box;
  };
  const peoplePanel = () => {
    const box = panel(tx("Ideas per person"), tx("Many names with a few ideas each is the healthy picture."));
    box.append(barList(math.perPerson(state.rows), { label: (item) => [int.format(item.value), ` ${item.value === 1 ? tx("idea") : tx("ideas")}`] }));
    return box;
  };
  const focusCardOf = () => {
    const best = math.ideaOfMonth(state.rows);
    const box = el("article", "result-card dl-focus kb-focus");
    if (best) {
      box.append(el("p", "result-label", tx("Idea of the month")));
      const h3 = el("h3");
      h3.append(best.title, el("span", null, ` · ${best.by || best.owner || "?"}`));
      box.append(h3);
      box.append(el("p", "dl-focus-lede", best.result || tx("Adopted on {date}.", { date: showDate(best.adopted) })));
      const facts = [`${tx("Impact")} ${best.impact}`, `${tx("Effort")} ${best.effort}`, best.waste, best.area, best.saving !== "" ? `${euro.format(best.saving)}/${tx("month")}` : ""].filter(Boolean).join(" · ");
      box.append(el("p", null, facts));
      box.append(el("p", "kb-focus-note", tx("Say it where the team can hear it: the idea, the name and the number. That is what brings the next idea.")));
      return box;
    }
    const top = math.ranking(state.rows)[0];
    box.append(el("p", "result-label", tx("Start here")));
    if (!top) { box.append(el("h3", null, tx("Nothing adopted yet")), el("p", "dl-focus-lede", tx("Add the first idea above. The first adopted idea becomes the idea of the month."))); return box; }
    const q = math.quadrant(top.row.effort, top.row.impact);
    const h3 = el("h3");
    h3.append(top.row.title, el("span", null, ` · ${data.quadrants[q]}`));
    box.append(h3, el("p", "dl-focus-lede", data.quadrantAdvice[data.quadrants[q]] || ""), el("p", null, `${tx("Priority")} ${top.score} · ${tx("Effort")} ${top.row.effort} · ${tx("Impact")} ${top.row.impact}${top.row.by ? ` · ${top.row.by}` : ""}`));
    return box;
  };
  const summary = () => {
    const rows = state.rows;
    const { adopted, total, rate } = math.adoption(rows);
    const lead = math.averageLead(rows);
    const { month, year } = math.savings(rows);
    const lines = [`${data.text.tool} | Stiven Catalyst`, showDate(today()), ""];
    lines.push(`${tx("Ideas this month")}: ${int.format(math.thisMonth(rows, today()))}`, `${tx("Adopted")}: ${int.format(adopted)} / ${int.format(total)} (${pct(rate, 0)})`);
    if (lead !== null) lines.push(`${tx("Days from idea to adopted")}: ${num(lead, 0)}`);
    lines.push(`${tx("Savings of adopted ideas")}: ${euro.format(month)}/${tx("month")} · ${euro.format(year)}/${tx("year")}`, "");
    STATUSES.forEach((key) => {
      const inColumn = rows.filter((row) => row.status === key);
      lines.push(`${label(key)} (${inColumn.length})`);
      inColumn.forEach((row) => lines.push(`  - ${row.title}${row.owner || row.by ? ` — ${row.owner || row.by}` : ""} (${tx("E")} ${row.effort}, ${tx("I")} ${row.impact}${row.saving !== "" ? `, ${euro.format(row.saving)}/${tx("month")}` : ""})${row.status === "dropped" && row.reason ? ` — ${row.reason}` : ""}${row.status === "act" && row.result ? ` — ${row.result}` : ""}`));
      lines.push("");
    });
    const best = math.ideaOfMonth(rows);
    if (best) lines.push(`${tx("Idea of the month")}: ${best.title}${best.by ? ` (${best.by})` : ""}`);
    return lines.join("\n").trim();
  };

  const render = () => {
    if (state.example && !exampleMatches(state)) state.example = {};
    note.sync(state);
    const rows = state.rows;
    results.hidden = !rows.length;
    empty.hidden = rows.length > 0;
    countNote.textContent = rows.length ? `${int.format(rows.length)} ${rows.length === 1 ? tx("idea") : tx("ideas")} · ${int.format(rows.filter(isOpen).length)} ${tx("open")}` : "";
    body.replaceChildren();
    head.replaceChildren();
    if (!rows.length) return;
    const title = el("div", "section-heading kb-heading");
    const left = el("div");
    left.append(el("p", "kicker", tx("The board")), el("h2", null, data.text.tool));
    title.append(left, el("p", null, tx("Move a card with ◀ and ▶. Open a card to edit it, add its next step to the actions or take it to an A3.")));
    head.append(title);
    const { adopted, total, rate } = math.adoption(rows);
    const lead = math.averageLead(rows);
    const { month, year } = math.savings(rows);
    const stats = el("div", "dl-stats");
    stats.append(
      stat(tx("Ideas this month"), int.format(math.thisMonth(rows, today())), tx("{n} open on the board", { n: int.format(rows.filter(isOpen).length) })),
      stat(tx("Adopted"), int.format(adopted), tx("{rate} of {n} ideas", { rate: pct(rate, 0), n: int.format(total) })),
      stat(tx("Days from idea to adopted"), lead === null ? "–" : num(lead, 0), lead === null ? tx("No idea adopted yet") : tx("on average")),
      stat(tx("Savings of adopted ideas"), `${euro.format(month)}`, `${tx("per month")} · ${euro.format(year)} ${tx("per year")}`),
    );
    const problem = math.ranking(rows)[0]?.row.title || rows[0].title;
    resultLayout(body, {
      stats,
      notes: [board()],
      focus: focusCardOf(),
      actions: resultActions(summary, problem),
      panels: [matrixPanel(), monthsPanel(), wastePanel(), peoplePanel()],
    });
  };

  // A first visit opens on the example, so the board is visible at once; nothing is saved until the visitor acts.
  if (!state.rows.length && firstVisit(KEY)) loadExample();
  render();
})();
