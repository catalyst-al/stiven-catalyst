// The Action Tracker: the one list of actions that every tool feeds (js/actions-store.js keeps it in sc-actions).
// This page adds, edits, filters and closes actions, shows the week in numbers and charts, and writes the weekly
// review. The arithmetic is in window.ActionTrackerMath so a test can call it without the page.
(() => {
  const dataEl = document.getElementById("action-tracker-data");
  if (!dataEl || !window.ToolKit || !window.ActionsStore) return;
  const { tx, el, read, write, showDate, today, addDays, int, stat, panel, barList, resultLayout, copy, flash, undoNote, downloadCsv, downloadXlsx, plural, mondayOf } = window.ToolKit;
  const S = window.ActionsStore;
  const CK = window.ChartKit;
  const data = JSON.parse(dataEl.textContent);
  const root = document.querySelector("[data-action-tracker]");
  const results = document.querySelector("[data-results]");
  if (!root || !results) return;
  const UI_KEY = `${data.storageKey}-ui`;
  const ui = read(UI_KEY, {});
  if (typeof ui.status !== "string") ui.status = "live";
  if (typeof ui.owner !== "string") ui.owner = "";
  if (typeof ui.source !== "string") ui.source = "";
  // The example is marked in the list itself (ActionsStore: example: true), and its ids are kept here as well, where
  // the version of the site before 27 October 2026 looks for them: after a rollback to it, that version still shows the
  // example as one, and when its store saves the list without the marks, ActionsStore reads the ids back and marks
  // the actions again (tests/actions-integrity.test.cjs, new → live → new). The ids follow the marks: they are emptied
  // when the example leaves.
  if (!Array.isArray(ui.exampleIds)) ui.exampleIds = [];
  const saveUi = () => write(UI_KEY, ui);
  const syncExampleIds = () => {
    const ids = S.all().filter((a) => a.example === true).map((a) => a.id);
    if (ids.length === ui.exampleIds.length && ids.every((id) => ui.exampleIds.includes(id))) return;
    ui.exampleIds = ids;
    saveUi();
  };
  // A list saved without the marks (by the older version): they are saved with it again.
  if (ui.exampleIds.length && S.all().some((a) => a.example === true)) S.replaceAll(S.all());
  syncExampleIds();
  const sourceName = (source) => data.sources[source || "manual"] || source || data.sources.manual;
  const statusName = (status) => data.statuses[status] || status;

  // Arithmetic -------------------------------------------------------------------------------------------------------
  const daysBetween = (a, b) => Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 864e5);
  const summarize = (rows, day) => {
    const open = rows.filter(S.isOpen);
    const overdue = open.filter((a) => S.isOverdue(a, day));
    const weekEnd = addDays(day, 6);
    const dueWeek = open.filter((a) => a.due && a.due >= day && a.due <= weekEnd);
    const closed = rows.filter((a) => !S.isOpen(a));
    const recent = closed.filter((a) => a.closed && daysBetween(a.closed, day) <= 30);
    const verifiedWeek = rows.filter((a) => a.status === "verified" && a.closed && daysBetween(a.closed, day) <= 7);
    const spans = closed.filter((a) => a.closed && a.created).map((a) => Math.max(0, daysBetween(a.created, a.closed)));
    const byKey = (list, key) => {
      const map = new Map();
      list.forEach((a) => { const k = a[key] || ""; map.set(k, (map.get(k) || 0) + 1); });
      return [...map].map(([k, value]) => ({ key: k, value })).sort((x, y) => y.value - x.value);
    };
    return {
      total: rows.length, open: open.length, overdue: overdue.length, dueWeek: dueWeek.length,
      done: rows.filter((a) => a.status === "done").length, verified: rows.filter((a) => a.status === "verified").length,
      closedRecent: recent.length, verifiedWeek: verifiedWeek.length,
      avgDays: spans.length ? spans.reduce((s, v) => s + v, 0) / spans.length : null,
      verifiedShare: closed.length ? rows.filter((a) => a.status === "verified").length / closed.length : null,
      byOwner: byKey(open, "owner"), bySource: byKey(open, "source"), overdueList: overdue, dueWeekList: dueWeek, verifiedWeekList: verifiedWeek,
    };
  };
  // Actions closed (done or verified) per week, the last `weeks` weeks up to today, oldest first.
  const closedPerWeek = (rows, day, weeks = 8) => {
    const thisMonday = mondayOf(day);
    const slots = Array.from({ length: weeks }, (_, i) => addDays(thisMonday, -7 * (weeks - 1 - i)));
    const counts = new Map(slots.map((s) => [s, { done: 0, verified: 0 }]));
    rows.filter((a) => !S.isOpen(a) && a.closed).forEach((a) => {
      const slot = mondayOf(a.closed);
      if (counts.has(slot)) counts.get(slot)[a.status === "verified" ? "verified" : "done"] += 1;
    });
    return slots.map((s) => ({ key: s, ...counts.get(s) }));
  };
  const verdict = (overdue) => (overdue === 0 ? data.verdicts.clear : overdue <= 3 ? data.verdicts.some : data.verdicts.many).replace("{n}", int.format(overdue));
  // The example list, its dates relative to today.
  const exampleRows = (example, day) => example.map((item) => ({
    ...item, id: undefined, due: Number.isInteger(item.offset) ? addDays(day, item.offset) : "", created: Number.isInteger(item.created) ? addDays(day, item.created) : day,
    closed: Number.isInteger(item.closed) ? addDays(day, item.closed) : "",
  }));
  // The sort of the list: overdue first, then by due date, undated last; closed actions by the day they closed, newest first.
  const order = (a, b, day) => {
    const openA = S.isOpen(a), openB = S.isOpen(b);
    if (openA !== openB) return openA ? -1 : 1;
    if (openA) {
      const oa = S.isOverdue(a, day), ob = S.isOverdue(b, day);
      if (oa !== ob) return oa ? -1 : 1;
      if (a.due !== b.due) return !a.due ? 1 : !b.due ? -1 : a.due.localeCompare(b.due);
      return a.created.localeCompare(b.created);
    }
    return (b.closed || "").localeCompare(a.closed || "");
  };
  window.ActionTrackerMath = { summarize, closedPerWeek, verdict, exampleRows, order, daysBetween };

  // Example ------------------------------------------------------------------------------------------------------------
  // The example's actions are marked in the list itself (ActionsStore: example: true). The first own action, from this
  // page or from any tool, replaces them; the other tools never count them.
  const exampleOn = () => S.all().some((a) => a.example === true);
  const loadExample = () => {
    exampleRows(data.example, today()).forEach((row) => S.add({ ...row, example: true }));
  };
  const dropExample = () => {
    if (exampleOn()) S.replaceAll(S.list());
  };
  const exampleNote = el("div", "dl-example-note");
  exampleNote.setAttribute("role", "status");
  exampleNote.hidden = true;
  const clearExample = el("button", "button-ghost", tx("Clear the example"));
  clearExample.type = "button";
  clearExample.addEventListener("click", () => { dropExample(); render(); });
  exampleNote.append(el("strong", null, tx("Example")), " ", el("span", null, tx("This is an example, so you can see what the tool shows. Add your own entries and it disappears, or clear it now.")), " ", clearExample);
  results.before(exampleNote);

  // The list -----------------------------------------------------------------------------------------------------------
  const list = root.querySelector("[data-list]");
  const empty = root.querySelector("[data-log-empty]");
  const count = root.querySelector("[data-log-count]");
  const status = root.querySelector("[data-log-status]");
  const entry = root.querySelector("[data-entry]");
  const entryStatus = root.querySelector("[data-entry-status]");
  const filterButtons = [...root.querySelectorAll("[data-status-filter] button")];
  const ownerFilter = root.querySelector('[data-filter="owner"]');
  const sourceFilter = root.querySelector('[data-filter="source"]');
  const textFilter = root.querySelector('[data-filter="text"]');
  let editing = null;
  // A status the visitor chose that waits for a result (verified): applied when the result is saved.
  let pending = null;

  const filtered = (rows, day) => rows.filter((a) => {
    if (ui.status === "live" && !S.isOpen(a)) return false;
    if (ui.status === "overdue" && !S.isOverdue(a, day)) return false;
    if ((ui.status === "done" || ui.status === "verified") && a.status !== ui.status) return false;
    if (ui.owner && a.owner !== ui.owner) return false;
    if (ui.source && (a.source || "manual") !== ui.source) return false;
    const text = (textFilter?.value || "").trim().toLowerCase();
    if (text && ![a.title, a.detail, a.owner, a.area, a.check, a.result].some((v) => String(v || "").toLowerCase().includes(text))) return false;
    return true;
  }).sort((a, b) => order(a, b, day));

  const chip = (text, state) => el("span", `ck-chip${state ? ` is-${state}` : ""}`, text);
  const input = (name, value, type = "text") => {
    const node = el(type === "textarea" ? "textarea" : "input");
    if (type !== "textarea") node.type = type;
    node.name = name;
    node.value = value || "";
    node.autocomplete = "off";
    return node;
  };
  const field = (id, label, node, wide) => {
    const box = el("div", wide ? "field dl-wide" : "field");
    const lab = el("label", null, label);
    lab.htmlFor = id;
    node.id = id;
    box.append(lab, node);
    return box;
  };
  const dueChip = (a, day) => {
    if (!a.due) return chip(tx("No date"), null);
    if (!S.isOpen(a)) return chip(`${tx("Due")} ${showDate(a.due)}`, null);
    const days = daysBetween(day, a.due);
    if (days < 0) return chip(tx("{n} days overdue", { n: int.format(-days) }), "danger");
    if (days === 0) return chip(tx("Due today"), "warn");
    if (days <= 3) return chip(tx("Due in {n} days", { n: int.format(days) }), "warn");
    return chip(`${tx("Due")} ${showDate(a.due)}`, null);
  };
  const item = (a, day) => {
    const li = el("li", "at-item");
    li.dataset.id = a.id;
    if (S.isOverdue(a, day)) li.classList.add("is-overdue");
    if (!S.isOpen(a)) li.classList.add("is-closed");
    if (editing === a.id) li.classList.add("is-editing");
    const statusBox = el("div", "at-status");
    const select = el("select");
    select.setAttribute("aria-label", `${tx("Status")}: ${a.title}`);
    S.STATUSES.forEach((s) => { const option = el("option", null, statusName(s)); option.value = s; option.selected = s === a.status; select.append(option); });
    select.addEventListener("change", () => {
      const updated = S.update(a.id, { status: select.value });
      // Verified needs a result: the status stays, the form opens on the result, and saving a result verifies it.
      if (!updated && S.lastUpdate === "needs-result") { editing = a.id; pending = { id: a.id, status: "verified" }; }
      else if (select.value === "done" && !a.result) { editing = a.id; }
      render();
    });
    statusBox.append(select);
    const main = el("div", "at-main");
    main.append(el("p", "at-title", a.title));
    const meta = el("div", "at-meta");
    if (a.owner) meta.append(chip(a.owner, "blue"));
    meta.append(dueChip(a, day));
    if (a.priority === "High") meta.append(chip(data.priorities.High, "danger"));
    if (a.area) meta.append(el("span", null, a.area));
    meta.append(el("span", null, `${tx("From")}: ${sourceName(a.source)}`));
    if (!S.isOpen(a) && a.closed) meta.append(el("span", null, `${statusName(a.status)} ${showDate(a.closed)}`));
    main.append(meta);
    if (a.detail) main.append(el("p", "at-detail", a.detail));
    if (a.check) main.append(el("p", "at-detail", `${tx("Check")}: ${a.check}`));
    if (a.result) main.append(el("p", "at-detail", `${tx("Result")}: ${a.result}`));
    if (a.caseId) {
      const caseLine = el("p", "at-detail at-case");
      const caseLink = el("a", null, `${tx("Investigation")} ${a.caseId}`);
      const caseUrl = new URL("../cx-control-tower/", location.href);
      caseUrl.searchParams.set("case", a.caseId);
      caseLink.href = caseUrl.href;
      caseLine.append(caseLink, " · ", tx("Verified is decided there, from the KPI before and after the action."));
      main.append(caseLine);
    }
    // The edit form, open on request.
    const edit = el("div", "at-edit");
    const fields = {
      title: input("title", a.title), owner: input("owner", a.owner), due: input("due", a.due, "date"), area: input("area", a.area),
      priority: el("select"), check: input("check", a.check), detail: input("detail", a.detail), result: input("result", a.result),
    };
    fields.owner.setAttribute("list", "at-owners");
    fields.area.setAttribute("list", "at-areas");
    Object.entries(data.priorities).forEach(([key, label]) => { const option = el("option", null, label); option.value = key; option.selected = key === a.priority; fields.priority.append(option); });
    if (pending?.id === a.id) edit.append(el("p", "form-note at-pending dl-wide", tx("Verified needs a result: write what happened and what the number did, then save.")));
    edit.append(
      field(`at-e-title-${a.id}`, tx("Action"), fields.title, true),
      field(`at-e-owner-${a.id}`, tx("Owner"), fields.owner), field(`at-e-due-${a.id}`, tx("Due date"), fields.due),
      field(`at-e-area-${a.id}`, tx("Area"), fields.area), field(`at-e-priority-${a.id}`, tx("Priority"), fields.priority),
      field(`at-e-check-${a.id}`, tx("How will you know it worked?"), fields.check, true),
      field(`at-e-detail-${a.id}`, tx("Detail"), fields.detail, true),
      field(`at-e-result-${a.id}`, tx("Result (what happened, what the number did)"), fields.result, true),
    );
    const saveEdit = el("button", "button-primary", tx("Save changes"));
    saveEdit.type = "button";
    saveEdit.addEventListener("click", () => {
      const patch = Object.fromEntries(Object.entries(fields).map(([name, node]) => [name, node.value]));
      if (!patch.title.trim()) { fields.title.focus(); return; }
      if (pending?.id === a.id && patch.result.trim()) patch.status = pending.status;
      S.update(a.id, patch);
      if (pending?.id === a.id) pending = null;
      editing = null;
      render();
    });
    const cancelEdit = el("button", "button-ghost", tx("Cancel"));
    cancelEdit.type = "button";
    cancelEdit.addEventListener("click", () => { editing = null; if (pending?.id === a.id) pending = null; render(); });
    const editActions = el("div", "tool-actions dl-wide");
    editActions.append(saveEdit, cancelEdit);
    edit.append(editActions);
    main.append(edit);
    const tools = el("div", "at-tools");
    const editButton = el("button", "button-ghost", editing === a.id ? tx("Close") : tx("Edit"));
    editButton.type = "button";
    editButton.addEventListener("click", () => { editing = editing === a.id ? null : a.id; render(); if (editing) list.querySelector(`[data-id="${a.id}"] input`)?.focus(); });
    const whys = el("a", "button-ghost", tx("5 Whys"));
    const whysUrl = new URL("../five-whys/", location.href);
    whysUrl.searchParams.set("problem", a.title);
    whys.href = whysUrl.href;
    const remove = el("button", "button-ghost", tx("Remove"));
    remove.type = "button";
    remove.addEventListener("click", () => {
      const gone = S.remove(a.id);
      if (!gone) return;
      saveUi();
      render();
      undoNote(status, tx("Removed: {text}", { text: a.title }), () => { S.restore(gone.removed, gone.index); render(); });
    });
    tools.append(editButton, whys, remove);
    li.append(statusBox, main, tools);
    return li;
  };

  const fillFilters = (rows) => {
    const keep = (select, values, labelOf, current) => {
      const first = select.firstElementChild;
      select.replaceChildren(first);
      values.forEach((value) => { const option = el("option", null, labelOf(value)); option.value = value; option.selected = value === current; select.append(option); });
      if (current && !values.includes(current)) select.value = "";
    };
    keep(ownerFilter, [...new Set(rows.map((a) => a.owner).filter(Boolean))].sort(), (v) => v, ui.owner);
    keep(sourceFilter, [...new Set(rows.map((a) => a.source || "manual"))].sort(), sourceName, ui.source);
    const owners = root.querySelector("#at-owners");
    owners.replaceChildren(...[...new Set(rows.map((a) => a.owner).filter(Boolean))].sort().map((v) => { const o = el("option"); o.value = v; return o; }));
    const areas = root.querySelector("#at-areas");
    const known = [...new Set([...(window.Workplace ? window.Workplace.areas().map((a) => a.name) : []), ...rows.map((a) => a.area).filter(Boolean)])].sort();
    areas.replaceChildren(...known.map((v) => { const o = el("option"); o.value = v; return o; }));
  };

  const renderList = (rows, day) => {
    const shown = filtered(rows, day);
    list.replaceChildren(...shown.map((a) => item(a, day)));
    empty.hidden = rows.length > 0;
    list.hidden = !rows.length;
    count.textContent = rows.length ? (shown.length === rows.length ? tx("All {n} entries", { n: int.format(rows.length) }) : tx("{n} of {total} entries", { n: int.format(shown.length), total: int.format(rows.length) })) : "";
    filterButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.status === ui.status)));
  };

  // Results ------------------------------------------------------------------------------------------------------------
  const reviewText = (sum, day) => {
    const line = (a) => `- ${a.title}${a.owner ? ` (${a.owner}${a.due ? `, ${showDate(a.due)}` : ""})` : a.due ? ` (${showDate(a.due)})` : ""}`;
    const block = (title, items) => `${title}: ${items.length ? `\n${items.map(line).join("\n")}` : data.review.none}`;
    return [`${data.review.title} · ${showDate(day)}`, "", `${tx("Open")}: ${sum.open} · ${tx("Overdue")}: ${sum.overdue} · ${tx("Due this week")}: ${sum.dueWeek} · ${tx("Verified")}: ${sum.verified}`, verdict(sum.overdue), "",
      block(data.review.overdue, sum.overdueList), "", block(data.review.week, sum.dueWeekList), "", block(data.review.verified, sum.verifiedWeekList)].join("\n");
  };
  const renderResults = (rows, day) => {
    results.replaceChildren();
    results.hidden = !rows.length;
    if (!rows.length) return;
    const sum = summarize(rows, day);
    const head = el("div", "result-head");
    head.append(el("p", "result-label", tx("The week in actions")));
    const h2 = el("h2");
    h2.append(el("span", null, int.format(sum.overdue)), ` ${tx("overdue")} · ${int.format(sum.open)} ${tx("open")}`);
    head.append(h2, el("p", null, verdict(sum.overdue)));
    const stats = el("div", "dl-stats");
    stats.append(
      stat(tx("Open"), int.format(sum.open), sum.byOwner.length ? tx("{n} owners", { n: sum.byOwner.length }) : ""),
      stat(tx("Overdue"), int.format(sum.overdue), sum.overdue ? tx("decide today") : data.review.none),
      stat(tx("Due this week"), int.format(sum.dueWeek), ""),
      stat(tx("Closed, last 30 days"), int.format(sum.closedRecent), sum.avgDays !== null ? tx("{n} days on average", { n: Math.round(sum.avgDays) }) : ""),
      stat(tx("Verified"), sum.verifiedShare !== null ? `${Math.round(sum.verifiedShare * 100)}%` : "–", tx("of closed actions")),
    );
    // The review, as text people can read in the meeting.
    const review = panel(data.review.title, tx("Overdue first, then this week, then what was verified."));
    review.classList.add("at-review");
    const section = (title, items) => {
      review.append(el("p", "result-label", title));
      if (!items.length) { review.append(el("p", null, data.review.none)); return; }
      const ul = el("ul");
      items.forEach((a) => { const li = el("li"); li.append(a.title); const small = el("small", null, ` · ${[a.owner, a.due ? showDate(a.due) : ""].filter(Boolean).join(", ")}`); li.append(small); ul.append(li); });
      review.append(ul);
    };
    section(data.review.overdue, sum.overdueList);
    section(data.review.week, sum.dueWeekList);
    section(data.review.verified, sum.verifiedWeekList);
    const actions = el("div", "tool-actions result-actions");
    const copyButton = el("button", "button-primary", tx("Copy the review"));
    copyButton.type = "button";
    copyButton.addEventListener("click", () => copy(reviewText(sum, day), copyButton));
    const printButton = el("button", "button-secondary", tx("Print or save as PDF"));
    printButton.type = "button";
    printButton.addEventListener("click", () => window.print());
    actions.append(copyButton, printButton);
    if (sum.overdueList[0]) {
      const whys = el("a", "button-secondary", tx("Take it to 5 Whys"));
      const url = new URL("../five-whys/", location.href);
      url.searchParams.set("problem", tx("Overdue action: {text}", { text: sum.overdueList[0].title }));
      whys.href = url.href;
      actions.append(whys);
    }
    const panels = [];
    if (CK) {
      const byOwner = panel(tx("Open by owner"), tx("Who carries the list. One name with most of it is a capacity question, not a performance one."));
      byOwner.append(barList(sum.byOwner.map((o) => ({ key: o.key || tx("No owner"), value: o.value })), { highlight: (o) => o.key === tx("No owner") && o.value > 0, tag: tx("needs an owner") }));
      panels.push(byOwner);
      const bySource = panel(tx("Open by tool"), tx("Where the work comes from."));
      bySource.append(barList(sum.bySource.map((s) => ({ key: sourceName(s.key), value: s.value }))));
      panels.push(bySource);
      const weeks = closedPerWeek(rows, day, 8);
      const closedPanel = panel(tx("Closed per week"), tx("Done and verified, the last eight weeks. A list that only grows is not a plan."));
      closedPanel.append(CK.figure(CK.stacked(weeks.map((w) => ({ label: showDate(w.key).slice(0, 5), parts: [{ key: statusName("done"), value: w.done }, { key: statusName("verified"), value: w.verified }] })), { keys: [statusName("done"), statusName("verified")], colors: { [statusName("done")]: CK.C.blue, [statusName("verified")]: CK.C.ok }, title: tx("Closed per week") }), { fileName: "actions-closed" }));
      panels.push(closedPanel);
      const [year, month] = day.split("-").map(Number);
      const calPanel = panel(tx("Due dates this month"), tx("Red: overdue and still open. Amber: due, still open. Green: everything due that day is closed."));
      const byDay = new Map();
      rows.filter((a) => a.due).forEach((a) => { if (!byDay.has(a.due)) byDay.set(a.due, []); byDay.get(a.due).push(a); });
      calPanel.append(CK.figure(CK.calendar(year, month, (iso) => {
        const items = byDay.get(iso);
        if (!items) return null;
        const openOnes = items.filter(S.isOpen);
        const state = openOnes.length ? (iso < day ? "danger" : "warn") : "ok";
        return { state, text: String(items.length), tip: items.map((a) => `${S.isOpen(a) ? "○" : "●"} ${a.title}${a.owner ? ` (${a.owner})` : ""}`).join("\n") };
      }, { title: tx("Due dates this month") }), { fileName: "actions-month", buttons: false }));
      panels.push(calPanel);
    }
    resultLayout(results, { head, stats, focus: review, actions, panels });
  };

  const render = () => {
    syncExampleIds();
    const rows = S.all();
    const day = today();
    exampleNote.hidden = !exampleOn();
    fillFilters(rows);
    renderList(rows, day);
    renderResults(rows, day);
  };

  // Events -------------------------------------------------------------------------------------------------------------
  entry.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = (name) => entry.elements[name]?.value.trim() || "";
    if (!value("title")) { entry.elements.title.focus(); flash(entryStatus, tx("Write the action first.")); return; }
    if (exampleOn()) dropExample();
    S.add({ title: value("title"), owner: value("owner"), due: value("due"), area: value("area"), priority: entry.elements.priority.value, check: value("check"), detail: value("detail"), source: "manual" });
    ["title", "check", "detail"].forEach((name) => { entry.elements[name].value = ""; });
    flash(entryStatus, tx("Added."));
    render();
    entry.elements.title.focus();
  });
  filterButtons.forEach((button) => button.addEventListener("click", () => { ui.status = button.dataset.status; saveUi(); render(); }));
  ownerFilter.addEventListener("change", () => { ui.owner = ownerFilter.value; saveUi(); render(); });
  sourceFilter.addEventListener("change", () => { ui.source = sourceFilter.value; saveUi(); render(); });
  textFilter.addEventListener("input", () => render());
  root.querySelector("[data-example]").addEventListener("click", () => { loadExample(); render(); results.scrollIntoView({ behavior: "smooth", block: "start" }); });
  root.querySelector("[data-clear]").addEventListener("click", () => {
    if (!S.all().length || !window.confirm(tx("Clear every action in this browser?"))) return;
    S.replaceAll([]);
    render();
  });
  const table = () => [[tx("Action"), tx("Detail"), tx("Owner"), tx("Due date"), tx("Area"), tx("Priority"), tx("Status"), tx("From"), tx("Check"), tx("Created"), tx("Closed"), tx("Result")],
    ...S.list().sort((a, b) => order(a, b, today())).map((a) => [a.title, a.detail, a.owner, a.due, a.area, data.priorities[a.priority] || a.priority, statusName(a.status), sourceName(a.source), a.check, a.created, a.closed, a.result])];
  root.querySelector("[data-csv]").addEventListener("click", () => { if (S.list().length) downloadCsv("actions", table()); });
  root.querySelector("[data-xlsx]").addEventListener("click", () => { if (S.list().length) downloadXlsx("actions", table(), { sheet: "Actions", title: tx("Action Tracker") }); });
  root.querySelector("[data-ics]").addEventListener("click", () => {
    const rows = S.list();
    if (!rows.some((a) => S.isOpen(a) && a.due)) { flash(status, tx("No open action with a due date to put in a calendar.")); return; }
    const link = el("a");
    link.href = URL.createObjectURL(new Blob([S.ics(rows)], { type: "text/calendar;charset=utf-8" }));
    link.download = `actions-${today()}.ics`;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  });
  // Another tab, or another tool in this tab, changed the list.
  window.addEventListener("storage", (event) => { if (event.key === S.KEY) render(); });

  // An action handed over by another tool arrives in the address; a first visit with nothing saved opens on the example.
  const nothingSaved = localStorage.getItem(S.KEY) === null;
  const arrived = S.fromParams(location);
  if (arrived.added) {
    // ActionsStore.add has already replaced an example with it.
    flash(status, tx("Added from {source}: {text}", { source: sourceName(arrived.added.source), text: arrived.added.title }));
  } else if (arrived.duplicate) {
    flash(status, tx("Already on the list."));
  } else if (nothingSaved && !new URLSearchParams(location.search).has("coaching")) {
    loadExample();
  }
  render();
})();
