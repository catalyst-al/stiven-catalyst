// The Skills Matrix: who does which task at which level (ILU: 0 not trained, 1 in training, 2 with support,
// 3 independent, 4 can train), and what that means for the team: the cover of each task at level 3 or above against
// its target, the single points of failure, the people below a task's minimum, the cover per shift, and a training
// plan that pairs a level-4 trainer with a trainee, the most critical gaps first. Snapshots keep the flexibility index
// over time. The arithmetic lives in window.SkillsMath, so tests can call it.
(() => {
  const MAX = 4;
  // Level 3 is the first level at which a person can be left alone with the task: it is what "cover" counts.
  const COVER_AT = 3;
  const PLAN_DAYS = 30;
  const SEVERITY = { none: 0, spof: 1, short: 2, ok: 3 };

  const isLevel = (value) => Number.isInteger(value) && value >= 0 && value <= MAX;
  const addDays = (iso, days) => {
    const date = new Date(`${iso}T00:00:00Z`);
    if (Number.isNaN(date.getTime())) return iso;
    date.setUTCDate(date.getUTCDate() + days);
    return date.toISOString().slice(0, 10);
  };
  // A cell nobody rated is a 0: an empty box in a skills matrix means "not trained", never "unknown".
  const level = (levels, personId, taskId) => {
    const value = levels?.[personId]?.[taskId];
    return isLevel(value) ? value : 0;
  };
  const cycle = (value) => (isLevel(value) ? (value + 1) % (MAX + 1) : 1);
  const listsOf = (model) => ({ people: Array.isArray(model?.people) ? model.people : [], tasks: Array.isArray(model?.tasks) ? model.tasks : [], levels: model?.levels || {} });

  // Per task: how many people do it alone (level 3+), against its target. Exactly one is a single point of failure,
  // none is no cover at all.
  const coverage = (model, at = COVER_AT) => {
    const { people, tasks, levels } = listsOf(model);
    return tasks.map((task) => {
      const holders = people.filter((p) => level(levels, p.id, task.id) >= at).map((p) => p.id);
      const count = holders.length;
      const target = Number.isInteger(task.target) && task.target > 0 ? task.target : 1;
      const sum = people.reduce((total, p) => total + level(levels, p.id, task.id), 0);
      const state = count === 0 ? "none" : count === 1 ? "spof" : count < target ? "short" : "ok";
      return {
        id: task.id, count, target, gap: Math.max(0, target - count), state, crit: task.crit || 1, min: task.min || 0,
        mean: people.length ? sum / people.length : 0, holders, trainers: people.filter((p) => level(levels, p.id, task.id) === MAX).map((p) => p.id),
      };
    });
  };
  const spof = (model) => coverage(model).filter((c) => c.count === 1).map((c) => ({ taskId: c.id, personId: c.holders[0] }));
  const noCover = (model) => coverage(model).filter((c) => c.count === 0).map((c) => c.id);
  // Per person: the tasks they do alone (level 3+), and their mean level.
  const versatility = (model, at = COVER_AT) => {
    const { people, tasks, levels } = listsOf(model);
    return people.map((p) => {
      const values = tasks.map((t) => level(levels, p.id, t.id));
      const count = values.filter((v) => v >= at).length;
      const sum = values.reduce((a, b) => a + b, 0);
      return { id: p.id, count, sum, mean: tasks.length ? sum / tasks.length : 0, share: tasks.length ? count / tasks.length : 0 };
    });
  };
  // The mean level of every cell over the top level: 0 nobody trained on anything, 1 everyone can train everything.
  const flexibilityIndex = (model) => {
    const { people, tasks, levels } = listsOf(model);
    const cells = people.length * tasks.length;
    if (!cells) return 0;
    let sum = 0;
    people.forEach((p) => tasks.forEach((t) => { sum += level(levels, p.id, t.id); }));
    return sum / cells / MAX;
  };
  // Cover at level 3+ inside each shift: a task covered on Early may have nobody on Night.
  const shiftCoverage = (model, shifts, at = COVER_AT) => {
    const { people, tasks, levels } = listsOf(model);
    return shifts.map((shift) => {
      const crew = people.filter((p) => p.shift === shift);
      return { shift, people: crew.length, counts: tasks.map((t) => crew.filter((p) => level(levels, p.id, t.id) >= at).length) };
    });
  };
  // Two kinds of need: a task short of its cover (a single point of failure always wants a second person), and a
  // person below the minimum level a task asks of everyone. Most critical first.
  const trainingNeeds = (model) => {
    const { people, tasks, levels } = listsOf(model);
    const order = new Map(tasks.map((t, i) => [t.id, i]));
    const gaps = coverage(model).map((c) => ({ taskId: c.id, crit: c.crit, state: c.state, count: c.count, target: c.target, need: Math.max(c.gap, 2 - c.count) }))
      .filter((g) => g.need > 0)
      .sort((a, b) => b.crit - a.crit || SEVERITY[a.state] - SEVERITY[b.state] || b.need - a.need || order.get(a.taskId) - order.get(b.taskId));
    const below = [];
    tasks.forEach((t) => {
      if (!(t.min > 0)) return;
      people.forEach((p) => { const v = level(levels, p.id, t.id); if (v < t.min) below.push({ personId: p.id, taskId: t.id, level: v, min: t.min, crit: t.crit || 1 }); });
    });
    below.sort((a, b) => b.crit - a.crit || order.get(a.taskId) - order.get(b.taskId));
    return { gaps, below };
  };
  // The suggested plan: for each need, most critical first (a gap before a minimum at the same criticality), a trainee
  // (for a gap: the closest to level 3, from the shift with the least cover of the task) and a level-4 trainer on the
  // same task (the same shift first, then whoever trains least so far). No level 4 in the team: the trainer stays empty.
  const planSuggestions = (model, { today = "", days = PLAN_DAYS } = {}) => {
    const { people, tasks, levels } = listsOf(model);
    const taskOrder = new Map(tasks.map((t, i) => [t.id, i]));
    const personOrder = new Map(people.map((p, i) => [p.id, i]));
    const taskOf = new Map(tasks.map((t) => [t.id, t]));
    const { gaps, below } = trainingNeeds(model);
    const needs = [
      ...gaps.map((g) => ({ kind: 0, taskId: g.taskId, crit: g.crit, sev: SEVERITY[g.state], need: g.need })),
      ...below.map((b) => ({ kind: 1, taskId: b.taskId, crit: b.crit, sev: 0, personId: b.personId, target: b.min })),
    ].sort((a, b) => b.crit - a.crit || a.kind - b.kind || a.sev - b.sev || taskOrder.get(a.taskId) - taskOrder.get(b.taskId) || (personOrder.get(a.personId) ?? 0) - (personOrder.get(b.personId) ?? 0));
    const trainerLoad = new Map();
    const traineeLoad = new Map();
    const taken = new Set();
    const due = today ? addDays(today, days) : "";
    const out = [];
    const shiftCount = (taskId, shift) => people.filter((p) => p.shift === shift && level(levels, p.id, taskId) >= COVER_AT).length;
    const pickTrainer = (taskId, trainee) => people
      .filter((p) => p.id !== trainee.id && level(levels, p.id, taskId) === MAX)
      .sort((a, b) => Number(b.shift === trainee.shift) - Number(a.shift === trainee.shift) || (trainerLoad.get(a.id) || 0) - (trainerLoad.get(b.id) || 0) || personOrder.get(a.id) - personOrder.get(b.id))[0] || null;
    const add = (taskId, trainee, target, reason) => {
      const trainer = pickTrainer(taskId, trainee);
      taken.add(`${taskId}|${trainee.id}`);
      traineeLoad.set(trainee.id, (traineeLoad.get(trainee.id) || 0) + 1);
      if (trainer) trainerLoad.set(trainer.id, (trainerLoad.get(trainer.id) || 0) + 1);
      out.push({ taskId, traineeId: trainee.id, trainerId: trainer ? trainer.id : "", from: level(levels, trainee.id, taskId), target, due, reason, crit: taskOf.get(taskId)?.crit || 1 });
    };
    needs.forEach((need) => {
      if (need.kind === 0) {
        people.filter((p) => level(levels, p.id, need.taskId) < COVER_AT && !taken.has(`${need.taskId}|${p.id}`))
          .sort((a, b) => level(levels, b.id, need.taskId) - level(levels, a.id, need.taskId) || shiftCount(need.taskId, a.shift) - shiftCount(need.taskId, b.shift) || (traineeLoad.get(a.id) || 0) - (traineeLoad.get(b.id) || 0) || personOrder.get(a.id) - personOrder.get(b.id))
          .slice(0, need.need)
          .forEach((p) => add(need.taskId, p, COVER_AT, "gap"));
      } else if (!taken.has(`${need.taskId}|${need.personId}`)) {
        add(need.taskId, people[personOrder.get(need.personId)], need.target, "min");
      }
    });
    return out;
  };
  // The numbers a snapshot keeps: enough for the trend and for the radar of an earlier month.
  const snapshot = (model, date) => {
    const cov = coverage(model);
    return {
      date, flex: flexibilityIndex(model), spof: cov.filter((c) => c.count === 1).length, nocover: cov.filter((c) => c.count === 0).length,
      below: trainingNeeds(model).below.length, means: Object.fromEntries(cov.map((c) => [c.id, c.mean])),
    };
  };
  window.SkillsMath = { MAX, COVER_AT, PLAN_DAYS, isLevel, addDays, level, cycle, coverage, spof, noCover, versatility, flexibilityIndex, shiftCoverage, trainingNeeds, planSuggestions, snapshot };

  const dataEl = document.getElementById("skills-matrix-data");
  const root = document.querySelector("[data-skills-matrix]");
  const results = document.querySelector("[data-results]");
  if (!dataEl || !root || !results || !window.ToolKit) return;
  const { tx, num, pct, showDate, dayMonth, write, loadState, isObject, str, el, int, today, parseDate, flash, undoNote, panel, stat, barList, focusCard, resultActions, resultLayout, firstVisit, downloadCsv, downloadXlsx } = window.ToolKit;
  const ChartKit = window.ChartKit;
  const Workplace = window.Workplace;
  const Actions = window.ActionsStore;
  const cfg = JSON.parse(dataEl.textContent);
  const KEY = cfg.storageKey;
  const TEMPLATES = Object.keys(cfg.templates);
  const SVG_NS = "http://www.w3.org/2000/svg";
  let counter = 0;
  const newId = (prefix) => `${prefix}${Date.now().toString(36)}${(counter++).toString(36)}${Math.random().toString(36).slice(2, 5)}`;
  const clampInt = (value, lo, hi, fallback) => { const n = Number(value); return Number.isInteger(n) && n >= lo && n <= hi ? n : fallback; };

  // State. Saved data can be damaged; keep only what has the expected shape.
  const state = loadState(KEY, { team: "", template: "", people: [], tasks: [], levels: {}, plan: [], snapshots: [], anon: false, example: false });
  if (!TEMPLATES.includes(state.template)) state.template = TEMPLATES[0];
  const cleanPerson = (p) => (isObject(p) && str(p.name).trim() ? { id: str(p.id) || newId("p"), name: str(p.name).trim().slice(0, 80), role: str(p.role).trim().slice(0, 80), shift: str(p.shift).trim().slice(0, 40) } : null);
  const cleanTask = (t) => (isObject(t) && str(t.name).trim() ? { id: str(t.id) || newId("t"), name: str(t.name).trim().slice(0, 80), crit: clampInt(t.crit, 1, 3, 2), min: clampInt(t.min, 0, MAX, 0), target: clampInt(t.target, 1, 99, 2) } : null);
  const unique = (list) => { const seen = new Set(); return list.filter((item) => { if (seen.has(item.id)) return false; seen.add(item.id); return true; }); };
  state.team = str(state.team).slice(0, 80);
  state.people = unique(state.people.map(cleanPerson).filter(Boolean));
  state.tasks = unique(state.tasks.map(cleanTask).filter(Boolean));
  const tidy = () => {
    const pids = new Set(state.people.map((p) => p.id));
    const tids = new Set(state.tasks.map((t) => t.id));
    const levels = {};
    Object.entries(isObject(state.levels) ? state.levels : {}).forEach(([pid, row]) => {
      if (!pids.has(pid) || !isObject(row)) return;
      levels[pid] = Object.fromEntries(Object.entries(row).filter(([tid, v]) => tids.has(tid) && isLevel(v)));
    });
    state.levels = levels;
    state.plan = state.plan.filter(isObject).map((r) => ({
      id: str(r.id) || newId("r"), task: str(r.task), trainee: str(r.trainee), trainer: pids.has(str(r.trainer)) ? str(r.trainer) : "",
      target: clampInt(r.target, 1, MAX, COVER_AT), due: parseDate(r.due) || "", sent: r.sent === true,
    })).filter((r) => tids.has(r.task) && pids.has(r.trainee));
  };
  tidy();
  state.snapshots = state.snapshots.filter(isObject).map((s) => ({
    date: parseDate(s.date) || "", flex: Number.isFinite(s.flex) ? Math.max(0, Math.min(1, s.flex)) : 0,
    spof: clampInt(s.spof, 0, 999, 0), nocover: clampInt(s.nocover, 0, 999, 0), below: clampInt(s.below, 0, 99999, 0),
    means: Object.fromEntries(Object.entries(isObject(s.means) ? s.means : {}).filter(([, v]) => Number.isFinite(v))),
  })).filter((s) => s.date).sort((a, b) => a.date.localeCompare(b.date));
  state.anon = state.anon === true;
  state.example = state.example === true;
  const save = () => write(KEY, state);
  const model = () => ({ people: state.people, tasks: state.tasks, levels: state.levels });

  // Elements.
  const q = (selector, scope = root) => scope.querySelector(selector);
  const teamInput = q("#sm-team");
  const teamList = q("#sm-team-list");
  const templateSelect = q("#sm-template");
  const setupStatus = q("[data-setup-status]");
  const personForm = q("[data-person-form]");
  const peopleBody = q("[data-people]");
  const peopleWrap = q("[data-people-wrap]");
  const peopleEmpty = q("[data-people-empty]");
  const peopleCount = q("[data-people-count]");
  const peopleStatus = q("[data-people-status]");
  const taskForm = q("[data-task-form]");
  const tasksBody = q("[data-tasks]");
  const tasksWrap = q("[data-tasks-wrap]");
  const tasksEmpty = q("[data-tasks-empty]");
  const tasksCount = q("[data-tasks-count]");
  const tasksStatus = q("[data-tasks-status]");
  const headBox = q("[data-head]", results);
  const legendBox = q("[data-legend]", results);
  const gridBox = q("[data-grid]", results);
  const anonBox = q("[data-anon]", results);
  const summaryBox = q("[data-summary]", results);
  const planBody = q("[data-plan]", results);
  const planWrap = q("[data-plan-wrap]", results);
  const planEmpty = q("[data-plan-empty]", results);
  const planStatus = q("[data-plan-status]", results);
  const snapChart = q("[data-snap-chart]", results);
  const snapBody = q("[data-snaps]", results);
  const snapWrap = q("[data-snaps-wrap]", results);
  const snapEmpty = q("[data-snaps-empty]", results);
  const snapStatus = q("[data-snap-status]", results);

  // Names, words and colours.
  const levelName = (v) => cfg.levels[v]?.name || String(v);
  const critName = (c) => cfg.criticality[c - 1] || String(c);
  const personIndex = (id) => state.people.findIndex((p) => p.id === id);
  const realName = (id) => state.people.find((p) => p.id === id)?.name || "";
  // Anonymised, a person is "Person 3" everywhere on the page and in the exports; the Action Tracker gets real names.
  const nameOf = (id) => (personIndex(id) < 0 ? "" : state.anon ? tx("Person {n}", { n: personIndex(id) + 1 }) : realName(id));
  const taskOf = (id) => state.tasks.find((t) => t.id === id) || null;
  const taskName = (id) => taskOf(id)?.name || "";
  const C = ChartKit ? ChartKit.C : {};
  const LEVEL_COLORS = [C.grid, C.danger, C.warn, C.blue, C.ok];
  const shifts = () => [...new Set([...(Workplace && Workplace.shifts().length ? Workplace.shifts() : cfg.shifts), ...state.people.map((p) => p.shift)])].filter(Boolean);
  const shortDate = dayMonth(false);
  const label = (iso) => shortDate(new Date(`${iso}T00:00:00Z`));
  const flagText = { none: () => tx("No cover"), spof: () => tx("SPOF") };
  const stateNote = (c) => (c.state === "none" ? tx("no cover") : c.state === "spof" ? tx("single point of failure") : c.state === "short" ? tx("below target") : tx("on target"));

  // The ILU icon: an empty circle for 0, then a quarter, a half and three quarters filled, and a full circle with a dot.
  const icon = (v) => {
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("class", `sm-icon sm-l${v}`);
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    const part = (tag, attrs) => { const node = document.createElementNS(SVG_NS, tag); Object.entries(attrs).forEach(([k, val]) => node.setAttribute(k, val)); svg.append(node); };
    const paths = { 1: "M12 12V3A9 9 0 0 1 21 12Z", 2: "M12 12V3A9 9 0 0 1 12 21Z", 3: "M12 12V3A9 9 0 1 1 3 12Z" };
    if (v === MAX) part("circle", { cx: 12, cy: 12, r: 9, class: "sm-fill" });
    else if (paths[v]) part("path", { d: paths[v], class: "sm-fill" });
    part("circle", { cx: 12, cy: 12, r: 9, class: "sm-ring" });
    if (v === MAX) part("circle", { cx: 12, cy: 12, r: 2.6, class: "sm-dot" });
    return svg;
  };

  // Setup -----------------------------------------------------------------------------------------------------------
  const option = (value, text, selected) => { const o = el("option", null, text); o.value = String(value); o.selected = selected; return o; };
  const fillShiftSelect = (select, current) => select.replaceChildren(...[...new Set([...shifts(), ...(current ? [current] : [])])].map((s) => option(s, s, s === current)));
  const input = (value, labelText, attrs = {}) => {
    const node = el("input");
    node.type = attrs.type || "text";
    node.value = value;
    node.autocomplete = "off";
    node.setAttribute("aria-label", labelText);
    Object.entries(attrs).forEach(([k, v]) => { if (k !== "type") node.setAttribute(k, v); });
    return node;
  };
  const removeButton = (labelText, data) => {
    const button = el("button", "dl-remove", "×");
    button.type = "button";
    button.setAttribute("aria-label", labelText);
    Object.assign(button.dataset, data);
    return button;
  };
  const cell = (child, className) => { const td = el("td", className); td.append(child); return td; };
  const renderSetup = () => {
    teamInput.value = state.team;
    teamList.replaceChildren(...(Workplace ? Workplace.teams() : []).map((t) => el("option", null, t)));
    templateSelect.value = state.template;
    fillShiftSelect(personForm.elements.shift, personForm.elements.shift.value || shifts()[0]);
    peopleBody.replaceChildren(...state.people.map((p) => {
      const tr = el("tr");
      tr.dataset.id = p.id;
      const shift = el("select");
      shift.setAttribute("aria-label", `${tx("Shift")}: ${p.name}`);
      shift.dataset.field = "shift";
      fillShiftSelect(shift, p.shift);
      tr.append(
        cell(input(p.name, tx("Name"), { "data-field": "name" })),
        cell(input(p.role, `${tx("Role")}: ${p.name}`, { "data-field": "role" })),
        cell(shift),
        cell(removeButton(tx("Remove {name}", { name: p.name }), { removePerson: p.id })),
      );
      return tr;
    }));
    tasksBody.replaceChildren(...state.tasks.map((t) => {
      const tr = el("tr");
      tr.dataset.id = t.id;
      const crit = el("select");
      crit.dataset.field = "crit";
      crit.setAttribute("aria-label", `${tx("Criticality")}: ${t.name}`);
      crit.append(...[1, 2, 3].map((c) => option(c, `${c} · ${critName(c)}`, c === t.crit)));
      const min = el("select");
      min.dataset.field = "min";
      min.setAttribute("aria-label", `${tx("Minimum level")}: ${t.name}`);
      min.append(...cfg.levels.map((lv, v) => option(v, `${v} · ${lv.name}`, v === t.min)));
      tr.append(
        cell(input(t.name, tx("Task"), { "data-field": "name" })),
        cell(crit),
        cell(min),
        cell(input(String(t.target), `${tx("Target at level 3+")}: ${t.name}`, { type: "number", min: "1", max: "99", step: "1", inputmode: "numeric", "data-field": "target", class: "sm-num" })),
        cell(removeButton(tx("Remove {name}", { name: t.name }), { removeTask: t.id })),
      );
      return tr;
    }));
    peopleWrap.hidden = !state.people.length;
    peopleEmpty.hidden = state.people.length > 0;
    tasksWrap.hidden = !state.tasks.length;
    tasksEmpty.hidden = state.tasks.length > 0;
    peopleCount.textContent = state.people.length ? tx("{n} people", { n: int.format(state.people.length) }) : "";
    tasksCount.textContent = state.tasks.length ? tx("{n} tasks", { n: int.format(state.tasks.length) }) : "";
  };

  // The grid -------------------------------------------------------------------------------------------------------
  let active = { r: 0, c: 0 };
  const cellText = (p, t, v) => {
    const below = t.min > 0 && v < t.min;
    return `${nameOf(p.id)}, ${t.name}: ${v} · ${levelName(v)}${below ? ` · ${tx("below the minimum of {min}", { min: t.min })}` : ""}`;
  };
  const renderLegend = () => {
    const list = el("ul", "sm-legend");
    cfg.levels.forEach((lv, v) => {
      const item = el("li");
      item.title = lv.note;
      item.append(icon(v), el("strong", null, String(v)), ` ${lv.name}`);
      list.append(item);
    });
    legendBox.replaceChildren(list);
  };
  const renderGrid = (cov, vers) => {
    const hadFocus = gridBox.contains(document.activeElement);
    active.r = Math.min(active.r, Math.max(0, state.people.length - 1));
    active.c = Math.min(active.c, Math.max(0, state.tasks.length - 1));
    const table = el("table", "dl-table sm-grid");
    table.append(el("caption", "visually-hidden", tx("People in rows, tasks in columns. Click a cell to raise the level; arrow keys move, 0 to 4 set the level.")));
    const head = el("tr");
    head.append(el("th", "sm-corner", tx("Person")));
    head.firstChild.scope = "col";
    state.tasks.forEach((t) => {
      const th = el("th", "sm-task");
      th.scope = "col";
      th.title = `${t.name} · ${tx("Criticality")}: ${critName(t.crit)} · ${tx("Minimum level")}: ${t.min} · ${tx("Target")}: ${t.target}`;
      th.append(el("span", "sm-task-name", t.name), el("span", `sm-crit sm-crit-${t.crit}`, critName(t.crit)));
      head.append(th);
    });
    const versHead = el("th", "num sm-vers", tx("Tasks at 3+"));
    versHead.scope = "col";
    head.append(versHead);
    const thead = el("thead");
    thead.append(head);
    const tbody = el("tbody");
    state.people.forEach((p, r) => {
      const tr = el("tr");
      const th = el("th", "sm-person");
      th.scope = "row";
      th.append(el("strong", null, nameOf(p.id)), el("span", null, [p.role, p.shift].filter(Boolean).join(" · ")));
      tr.append(th);
      state.tasks.forEach((t, c) => {
        const v = level(state.levels, p.id, t.id);
        const button = el("button", "sm-cell");
        button.type = "button";
        button.dataset.r = r;
        button.dataset.c = c;
        button.tabIndex = r === active.r && c === active.c ? 0 : -1;
        const text = cellText(p, t, v);
        button.title = text;
        if (t.min > 0 && v < t.min) button.classList.add("is-below");
        button.append(icon(v), el("span", "visually-hidden", text));
        tr.append(cell(button, "sm-td"));
      });
      const count = vers[r].count;
      const td = el("td", "num sm-vers");
      td.append(el("strong", null, int.format(count)));
      tr.append(td);
      tbody.append(tr);
    });
    const tfoot = el("tfoot");
    const coverRow = el("tr", "sm-cover");
    const coverHead = el("th", null, tx("At level 3+ / target"));
    coverHead.scope = "row";
    coverRow.append(coverHead);
    cov.forEach((c) => {
      const td = el("td", `sm-cov is-${c.state}`);
      td.title = `${taskName(c.id)}: ${tx("{n} of {target} at level 3 or above", { n: c.count, target: c.target })} · ${stateNote(c)}`;
      td.append(el("strong", null, int.format(c.count)), `/${int.format(c.target)}`);
      if (flagText[c.state]) td.append(el("span", "sm-flag", flagText[c.state]()));
      coverRow.append(td);
    });
    coverRow.append(el("td"));
    tfoot.append(coverRow);
    shiftCoverage(model(), shifts()).filter((s) => s.people > 0).forEach((s) => {
      const tr = el("tr", "sm-shift");
      const th = el("th");
      th.scope = "row";
      th.append(s.shift, el("span", null, ` · ${tx("{n} people", { n: int.format(s.people) })}`));
      tr.append(th);
      s.counts.forEach((n, i) => {
        const td = el("td", n === 0 ? "sm-shift-n is-gap" : "sm-shift-n", int.format(n));
        td.title = `${s.shift} · ${state.tasks[i].name}: ${n === 0 ? tx("nobody at level 3 or above on this shift") : tx("{n} at level 3 or above", { n })}`;
        tr.append(td);
      });
      tr.append(el("td"));
      tfoot.append(tr);
    });
    table.append(thead, tbody, tfoot);
    gridBox.replaceChildren(table);
    if (hadFocus) gridBox.querySelector(`.sm-cell[data-r="${active.r}"][data-c="${active.c}"]`)?.focus();
  };
  const focusCell = (r, c) => {
    const target = gridBox.querySelector(`.sm-cell[data-r="${r}"][data-c="${c}"]`);
    if (!target) return;
    gridBox.querySelectorAll(".sm-cell[tabindex='0']").forEach((b) => { b.tabIndex = -1; });
    target.tabIndex = 0;
    active = { r, c };
    target.focus();
  };
  const setLevel = (r, c, v) => {
    const p = state.people[r];
    const t = state.tasks[c];
    if (!p || !t || !isLevel(v)) return;
    if (!state.levels[p.id]) state.levels[p.id] = {};
    state.levels[p.id][t.id] = v;
    active = { r, c };
    save();
    renderResults();
  };
  gridBox.addEventListener("click", (event) => {
    const button = event.target.closest(".sm-cell");
    if (!button) return;
    const r = Number(button.dataset.r), c = Number(button.dataset.c);
    setLevel(r, c, cycle(level(state.levels, state.people[r]?.id, state.tasks[c]?.id)));
  });
  gridBox.addEventListener("keydown", (event) => {
    const button = event.target.closest(".sm-cell");
    if (!button) return;
    const r = Number(button.dataset.r), c = Number(button.dataset.c);
    if (/^[0-4]$/.test(event.key)) { event.preventDefault(); setLevel(r, c, Number(event.key)); return; }
    const moves = { ArrowRight: [r, c + 1], ArrowLeft: [r, c - 1], ArrowDown: [r + 1, c], ArrowUp: [r - 1, c], Home: [r, 0], End: [r, state.tasks.length - 1] };
    const next = moves[event.key];
    if (!next) return;
    event.preventDefault();
    focusCell(Math.max(0, Math.min(state.people.length - 1, next[0])), Math.max(0, Math.min(state.tasks.length - 1, next[1])));
  });

  // Results ----------------------------------------------------------------------------------------------------------
  const worstTask = (cov) => [...cov].filter((c) => c.state !== "ok").sort((a, b) => SEVERITY[a.state] - SEVERITY[b.state] || b.crit - a.crit || state.tasks.findIndex((t) => t.id === a.id) - state.tasks.findIndex((t) => t.id === b.id))[0] || null;
  const pairingText = (s) => (s.trainerId
    ? tx("{trainer} (level 4) trains {trainee} (now level {from}) to level {target} by {date}.", { trainer: nameOf(s.trainerId), trainee: nameOf(s.traineeId), from: s.from, target: s.target, date: showDate(s.due) })
    : tx("Nobody in the team is at level 4 on this task: find a trainer in another team or shift for {trainee}.", { trainee: nameOf(s.traineeId) }));
  const summaryText = (cov, flex, needs) => {
    const lines = [`${cfg.text.tool}${state.team ? ` · ${state.team}` : ""} · ${showDate(today())}`, `${tx("Flexibility index")} ${pct(flex, 0)} · ${tx("{p} people × {t} tasks", { p: state.people.length, t: state.tasks.length })}`, ""];
    lines.push(`${tx("At level 3+ / target")}:`);
    cov.forEach((c) => lines.push(`- ${taskName(c.id)}: ${c.count}/${c.target}${c.state !== "ok" ? ` · ${stateNote(c)}` : ""}${c.count === 1 ? ` (${nameOf(c.holders[0])})` : ""}`));
    if (needs.below.length) {
      lines.push("", `${tx("Below the minimum")}:`);
      needs.below.forEach((b) => lines.push(`- ${nameOf(b.personId)} · ${taskName(b.taskId)}: ${b.level} / ${b.min}`));
    }
    if (state.plan.length) {
      lines.push("", `${tx("Training plan")}:`);
      state.plan.forEach((r) => lines.push(`- ${taskName(r.task)}: ${nameOf(r.trainee)} → ${r.target}${r.trainer ? ` · ${tx("Trainer")} ${nameOf(r.trainer)}` : ""}${r.due ? ` · ${showDate(r.due)}` : ""}`));
    }
    return lines.join("\n");
  };
  const renderHead = (cov, flex, vers, needs) => {
    const spofs = cov.filter((c) => c.state === "spof");
    const none = cov.filter((c) => c.state === "none");
    const ok = cov.filter((c) => c.state === "ok").length;
    const head = el("div", "result-head sm-head");
    head.append(el("p", "kicker", state.team || cfg.text.tool));
    const h2 = el("h2");
    h2.append(pct(flex, 0), el("span", null, ` · ${spofs.length === 1 ? tx("1 single point of failure") : tx("{n} single points of failure", { n: int.format(spofs.length) })}`));
    head.append(h2, el("p", "sm-meta", tx("{p} people × {t} tasks", { p: int.format(state.people.length), t: int.format(state.tasks.length) })));
    const stats = el("div", "dl-stats sm-stats");
    const meanLevel = flex * MAX;
    const meanVers = vers.length ? vers.reduce((s, v) => s + v.count, 0) / vers.length : 0;
    stats.append(
      stat(tx("Flexibility index"), pct(flex, 0), tx("mean level {m} of 4", { m: num(meanLevel, 1) })),
      stat(tx("Tasks on target"), `${int.format(ok)} / ${int.format(cov.length)}`, tx("enough people at level 3 or above")),
      stat(tx("Single points of failure"), int.format(spofs.length), spofs.length ? spofs.map((c) => taskName(c.id)).join(", ") : tx("none")),
      stat(tx("No cover"), int.format(none.length), none.length ? none.map((c) => taskName(c.id)).join(", ") : tx("every task has someone at level 3")),
      stat(tx("Versatility"), num(meanVers, 1), tx("tasks per person at level 3 or above")),
      stat(tx("Below the minimum"), int.format(needs.below.length), tx("people × tasks under the minimum level")),
    );
    headBox.replaceChildren(head, stats);
  };
  const levelCell = (r, c) => {
    const v = level(state.levels, state.people[r].id, state.tasks[c].id);
    return { text: String(v), color: LEVEL_COLORS[v], textColor: v === 0 ? C.text : "#ffffff", tip: `${nameOf(state.people[r].id)} · ${state.tasks[c].name}: ${v} · ${levelName(v)}` };
  };
  const renderSummary = (cov, flex, vers, needs) => {
    summaryBox.replaceChildren();
    const suggestions = planSuggestions(model(), { today: today() });
    const worst = worstTask(cov);
    let focus;
    if (worst) {
      const pairing = suggestions.find((s) => s.taskId === worst.id);
      const lede = worst.state === "none" ? tx("Nobody in the team does this task alone.")
        : worst.state === "spof" ? tx("Only {name} does this task alone. One day off and it stops.", { name: nameOf(worst.holders[0]) })
        : tx("Fewer people than the target do this task alone.");
      focus = focusCard({ title: taskName(worst.id), detail: tx("{n} of {target} at level 3 or above", { n: worst.count, target: worst.target }), lede, advice: cfg.advice[worst.state], extraLabel: tx("Suggested pairing"), extra: pairing ? pairingText(pairing) : "" });
    } else if (needs.below.length) {
      const first = needs.below[0];
      const pairing = suggestions.find((s) => s.taskId === first.taskId && s.traineeId === first.personId);
      focus = focusCard({ title: taskName(first.taskId), detail: `${nameOf(first.personId)} · ${first.level} / ${first.min}`, lede: tx("{n} people × tasks are below the minimum level.", { n: needs.below.length }), advice: cfg.advice.below, extraLabel: tx("Suggested pairing"), extra: pairing ? pairingText(pairing) : "" });
    } else {
      focus = focusCard({ title: tx("Every task on target"), lede: tx("Every task has enough people at level 3 or above."), advice: cfg.advice.ok });
    }
    const problem = worst ? tx("{task}: {n} of {target} people at level 3 or above", { task: taskName(worst.id), n: worst.count, target: worst.target }) : tx("Skills matrix: keep the cover");
    const actions = resultActions(() => summaryText(cov, flex, needs), problem);
    if (Actions) {
      const tracker = el("a", "button-secondary", tx("Open the Action Tracker"));
      tracker.href = Actions.trackerUrl().href;
      actions.append(tracker);
    }

    const panels = [];
    if (ChartKit) {
      const people = state.people.map((p) => nameOf(p.id));
      const tasks = state.tasks.map((t) => t.name);
      const matrixPanel = panel(tx("The matrix as a picture"), tx("The same levels as one chart, for the board or a report: grey 0, red 1, amber 2, blue 3, green 4."));
      matrixPanel.classList.add("sm-panel-wide");
      matrixPanel.append(ChartKit.figure(ChartKit.heatmap(people, tasks, levelCell, { title: `${cfg.text.tool}${state.team ? ` · ${state.team}` : ""}`, labelWidth: 130, cellSize: 44 }), { fileName: "skills-matrix" }));
      matrixPanel.append(ChartKit.legend(cfg.levels.map((lv, v) => ({ label: `${v} · ${lv.name}`, color: LEVEL_COLORS[v] }))));
      panels.push(matrixPanel);

      const coverPanel = panel(tx("Cover against target"), tx("People at level 3 or above as a share of each task's target. Red: nobody; amber: one person or below target."));
      const stateColor = { none: "danger", spof: "warn", short: "warn", ok: "ok" };
      coverPanel.append(ChartKit.figure(ChartKit.bars(cov.map((c) => ({ label: taskName(c.id), value: c.count / c.target, state: stateColor[c.state], tip: `${taskName(c.id)}: ${tx("{n} of {target} at level 3 or above", { n: c.count, target: c.target })} · ${stateNote(c)}` })), { title: tx("Cover against target"), target: 1, format: (v) => pct(v, 0) }), { fileName: "skills-cover" }));
      panels.push(coverPanel);

      if (state.tasks.length >= 3) {
        const last = state.snapshots.at(-1);
        const usable = last && state.tasks.some((t) => Number.isFinite(last.means[t.id]));
        const radarPanel = panel(tx("Team level per task"), usable ? tx("The mean level of the team on each task. Dashed: the snapshot of {date}.", { date: showDate(last.date) }) : tx("The mean level of the team on each task, from 0 to 4."));
        const compare = usable ? [{ label: `${tx("Snapshot")} ${showDate(last.date)}`, values: state.tasks.map((t) => last.means[t.id] || 0) }] : [];
        radarPanel.append(ChartKit.figure(ChartKit.radar(cov.map((c) => ({ label: taskName(c.id), value: c.mean, max: MAX })), { title: tx("Team level per task"), levels: MAX, compare, format: (v) => num(v, 1) }), { fileName: "skills-radar" }));
        radarPanel.classList.add("sm-panel-radar");
        panels.push(radarPanel);
      }

      const stackPanel = panel(tx("People per level"), tx("How many people stand at each level of each task."));
      const keys = cfg.levels.map((lv, v) => `${v} · ${lv.name}`);
      const groups = state.tasks.map((t) => ({ label: t.name, parts: keys.map((key, v) => ({ key, value: state.people.filter((p) => level(state.levels, p.id, t.id) === v).length })) }));
      stackPanel.append(ChartKit.figure(ChartKit.stacked(groups, { keys, colors: Object.fromEntries(keys.map((key, v) => [key, LEVEL_COLORS[v]])), title: tx("People per level"), format: (v) => int.format(Math.round(v)) }), { fileName: "skills-levels" }));
      panels.push(stackPanel);
    }

    const versPanel = panel(tx("Versatility"), tx("Tasks each person does alone, at level 3 or above."));
    versPanel.append(barList(vers.map((v) => ({ key: nameOf(v.id), value: v.count, total: state.tasks.length })).sort((a, b) => b.value - a.value), {
      label: (item) => [int.format(item.value), ` ${tx("of {n} tasks", { n: int.format(item.total) })}`],
      highlight: (item) => item.value <= 1,
      tag: tx("one task or none"),
    }));
    panels.push(versPanel);

    const needsPanel = panel(tx("Training needs"), needs.gaps.length || needs.below.length ? tx("Tasks short of their cover, then people below a task's minimum, the most critical first.") : tx("No task is short of cover and nobody is below a minimum."));
    if (needs.gaps.length || needs.below.length) {
      const list = el("ul", "sm-needs");
      needs.gaps.forEach((g) => {
        const item = el("li");
        item.append(el("strong", null, taskName(g.taskId)), ` · ${g.count}/${g.target} · ${stateNote(coverage(model()).find((c) => c.id === g.taskId))} · ${critName(g.crit)}`);
        list.append(item);
      });
      needs.below.forEach((b) => {
        const item = el("li");
        item.append(el("strong", null, nameOf(b.personId)), ` · ${taskName(b.taskId)}: ${tx("level {a}, minimum {b}", { a: b.level, b: b.min })}`);
        list.append(item);
      });
      needsPanel.append(list);
    }
    panels.push(needsPanel);
    resultLayout(summaryBox, { focus, actions, panels });
  };

  // The training plan ---------------------------------------------------------------------------------------------------
  const renderPlan = () => {
    const personOptions = (current, empty) => [...(empty ? [option("", tx("Nobody yet"), !current)] : []), ...state.people.map((p) => option(p.id, nameOf(p.id), p.id === current))];
    planBody.replaceChildren(...state.plan.map((row) => {
      const tr = el("tr");
      tr.dataset.id = row.id;
      if (row.sent) tr.classList.add("is-sent");
      const task = el("select");
      task.dataset.field = "task";
      task.setAttribute("aria-label", tx("Task"));
      task.append(...state.tasks.map((t) => option(t.id, t.name, t.id === row.task)));
      const trainee = el("select");
      trainee.dataset.field = "trainee";
      trainee.setAttribute("aria-label", `${tx("Trainee")}: ${taskName(row.task)}`);
      trainee.append(...personOptions(row.trainee, false));
      const now = el("span", "sm-now", tx("now {n}", { n: level(state.levels, row.trainee, row.task) }));
      const traineeCell = el("td");
      traineeCell.append(trainee, " ", now);
      const trainer = el("select");
      trainer.dataset.field = "trainer";
      trainer.setAttribute("aria-label", `${tx("Trainer")}: ${taskName(row.task)}`);
      trainer.append(...personOptions(row.trainer, true));
      const target = el("select");
      target.dataset.field = "target";
      target.setAttribute("aria-label", `${tx("Target level")}: ${taskName(row.task)}`);
      target.append(...cfg.levels.map((lv, v) => option(v, `${v} · ${lv.name}`, v === row.target)).slice(1));
      const due = input(row.due, `${tx("By date")}: ${taskName(row.task)}`, { type: "date", "data-field": "due" });
      tr.append(cell(task), traineeCell, cell(trainer), cell(target), cell(due), el("td", "sm-sent", row.sent ? tx("In the Action Tracker") : ""), cell(removeButton(tx("Remove this row"), { removeRow: row.id })));
      return tr;
    }));
    planWrap.hidden = !state.plan.length;
    planEmpty.hidden = state.plan.length > 0;
  };

  // Snapshots ----------------------------------------------------------------------------------------------------------
  const renderSnapshots = (flex, cov, needs) => {
    snapBody.replaceChildren(...[...state.snapshots].reverse().map((s) => {
      const tr = el("tr");
      tr.append(el("td", null, showDate(s.date)), el("td", "num", pct(s.flex, 0)), el("td", "num", int.format(s.spof)), el("td", "num", int.format(s.nocover)), el("td", "num", int.format(s.below)), cell(removeButton(tx("Remove the snapshot of {date}", { date: showDate(s.date) }), { removeSnap: s.date })));
      return tr;
    }));
    snapWrap.hidden = !state.snapshots.length;
    snapEmpty.hidden = state.snapshots.length > 0;
    snapChart.replaceChildren();
    if (!ChartKit || !state.snapshots.length) return;
    const now = { date: today(), flex, spof: cov.filter((c) => c.count === 1).length, nocover: cov.filter((c) => c.count === 0).length, below: needs.below.length };
    const points = [...state.snapshots.filter((s) => s.date !== now.date), { ...now, isNow: true }];
    const x = (s) => (s.isNow ? tx("Now") : label(s.date));
    const flexLine = ChartKit.line([{ label: tx("Flexibility index"), points: points.map((s) => ({ x: x(s), y: s.flex, tip: `${s.isNow ? tx("Now") : showDate(s.date)}: ${pct(s.flex, 0)}` })) }], { title: tx("Flexibility index over time"), yMin: 0, yMax: 1, format: (v) => pct(v, 0) });
    const riskLine = ChartKit.line([
      { label: tx("Single points of failure"), color: C.warn, points: points.map((s) => ({ x: x(s), y: s.spof })) },
      { label: tx("No cover"), color: C.danger, points: points.map((s) => ({ x: x(s), y: s.nocover })) },
    ], { title: tx("Single points of failure and no cover over time"), yMin: 0, yMax: Math.max(4, ...points.map((s) => Math.max(s.spof, s.nocover))), format: (v) => int.format(Math.round(v)) });
    snapChart.append(ChartKit.figure(flexLine, { fileName: "skills-flexibility" }), ChartKit.figure(riskLine, { fileName: "skills-spof" }));
  };

  // The example note: what it is, and one tap to clear it. The example leaves as a whole with the first own person or task.
  const exampleBox = el("div", "dl-example-note");
  exampleBox.setAttribute("role", "status");
  const clearExampleButton = el("button", "button-ghost", tx("Clear the example"));
  clearExampleButton.type = "button";
  exampleBox.append(el("strong", null, tx("Example")), " ", el("span", null, tx("This is an example team, so you can see what the tool shows. Add your own people or tasks and it disappears, or clear it now.")), " ", clearExampleButton);
  results.prepend(exampleBox);

  const renderResults = () => {
    exampleBox.hidden = !state.example;
    anonBox.checked = state.anon;
    if (!state.people.length || !state.tasks.length) { results.hidden = true; return; }
    results.hidden = false;
    const cov = coverage(model());
    const vers = versatility(model());
    const flex = flexibilityIndex(model());
    const needs = trainingNeeds(model());
    renderHead(cov, flex, vers, needs);
    renderGrid(cov, vers);
    renderSummary(cov, flex, vers, needs);
    renderPlan();
    renderSnapshots(flex, cov, needs);
  };
  const render = () => { renderSetup(); renderResults(); };
  const changed = () => { save(); render(); };

  // The example: eight people of an outbound team on nine warehouse tasks, two snapshots a month apart, the plan filled.
  const loadExample = () => {
    const ex = cfg.example;
    const tpl = cfg.templates[ex.template];
    state.team = ex.team;
    state.template = ex.template;
    state.tasks = tpl.tasks.map((t, i) => ({ id: `ex-t${i}`, name: t.name, crit: t.crit, min: t.min, target: t.target }));
    state.people = ex.people.map((p, i) => ({ id: `ex-p${i}`, name: p.name, role: p.role, shift: p.shift }));
    state.levels = Object.fromEntries(ex.people.map((p, i) => [`ex-p${i}`, Object.fromEntries(p.levels.map((v, j) => [`ex-t${j}`, v]))]));
    state.snapshots = ex.snapshots.map((s) => ({
      date: addDays(today(), -s.daysAgo), flex: s.means.reduce((a, b) => a + b, 0) / s.means.length / MAX, spof: s.spof, nocover: s.nocover, below: s.below,
      means: Object.fromEntries(s.means.map((v, j) => [`ex-t${j}`, v])),
    }));
    state.plan = planSuggestions(model(), { today: today() }).map((s, i) => ({ id: `ex-r${i}`, task: s.taskId, trainee: s.traineeId, trainer: s.trainerId, target: s.target, due: s.due, sent: false }));
    state.anon = false;
    state.example = true;
    active = { r: 0, c: 0 };
  };
  const dropExample = () => {
    state.people = [];
    state.tasks = [];
    state.levels = {};
    state.plan = [];
    state.snapshots = [];
    state.example = false;
  };
  const ownWork = () => { if (state.example) dropExample(); };
  clearExampleButton.addEventListener("click", () => { dropExample(); state.team = ""; changed(); });

  // Setup events.
  teamInput.addEventListener("input", () => { state.team = teamInput.value.trim().slice(0, 80); save(); renderResults(); });
  templateSelect.addEventListener("change", () => { state.template = templateSelect.value; save(); });
  // A task list replaces the tasks; a task of the same name keeps its id, so its levels stay. False when declined.
  const useTasks = (tasks) => {
    if (!state.example && state.tasks.length && !window.confirm(tx("Replace the tasks with the template? Levels of tasks with the same name are kept."))) return false;
    ownWork();
    const byName = new Map(state.tasks.map((t) => [t.name.toLowerCase(), t.id]));
    state.tasks = tasks.map((t) => ({ id: byName.get(t.name.toLowerCase()) || newId("t"), name: t.name, crit: t.crit, min: t.min, target: t.target }));
    tidy();
    changed();
    return true;
  };
  q("[data-load-template]").addEventListener("click", () => {
    const tpl = cfg.templates[templateSelect.value];
    if (!tpl) return;
    state.template = templateSelect.value;
    if (useTasks(tpl.tasks)) flash(setupStatus, tx("{n} tasks loaded from the template.", { n: state.tasks.length }));
  });
  // The task list as a template file (js/template-pack.js): names, criticality, minimum level and target. The people
  // and their levels stay in this browser.
  const packHost = q("[data-template-pack]");
  if (window.TemplatePack && packHost) {
    window.TemplatePack.ui(packHost, {
      tool: "skills-matrix", kind: "skills-tasks",
      name: () => state.team || cfg.templates[state.template]?.name || "",
      data: () => (state.tasks.length ? { tasks: state.tasks.map((t) => ({ name: t.name, crit: t.crit, min: t.min, target: t.target })) } : null),
      validate: (raw) => {
        const tasks = (isObject(raw) && Array.isArray(raw.tasks) ? raw.tasks : []).slice(0, 200).map(cleanTask).filter(Boolean).map(({ id: _id, ...t }) => t);
        return tasks.length ? { tasks } : null;
      },
      onOpen: (result) => (useTasks(result.data.tasks) ? tx("{n} tasks loaded from the file.", { n: state.tasks.length }) : false),
    });
  }
  q("[data-clear-all]").addEventListener("click", () => {
    if (!state.people.length && !state.tasks.length) return;
    if (!state.example && !window.confirm(tx("Clear the whole matrix: people, tasks, levels, plan and snapshots?"))) return;
    dropExample();
    state.team = "";
    changed();
  });
  personForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const f = personForm.elements;
    const name = f.name.value.trim();
    if (!name) { flash(peopleStatus, tx("Name the person first.")); f.name.focus(); return; }
    ownWork();
    state.people.push({ id: newId("p"), name: name.slice(0, 80), role: f.role.value.trim().slice(0, 80), shift: f.shift.value });
    f.name.value = "";
    f.role.value = "";
    changed();
    flash(peopleStatus, tx("{name} added.", { name }));
    f.name.focus();
  });
  taskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const f = taskForm.elements;
    const name = f.name.value.trim();
    if (!name) { flash(tasksStatus, tx("Name the task first.")); f.name.focus(); return; }
    ownWork();
    state.tasks.push(cleanTask({ id: newId("t"), name, crit: Number(f.crit.value), min: Number(f.min.value), target: Number(f.target.value) }));
    f.name.value = "";
    changed();
    flash(tasksStatus, tx("{name} added.", { name }));
    f.name.focus();
  });
  // Typing in the lists changes the matrix but leaves the lists alone, so the cursor stays where it is.
  const editRow = (list, clean) => (event) => {
    const field = event.target.dataset.field;
    const id = event.target.closest("tr")?.dataset.id;
    const item = list().find((x) => x.id === id);
    if (!field || !item) return;
    // A number box being retyped is empty for a moment: keep the last target until a number is there.
    if (field === "target" && event.target.value.trim() === "") return;
    const next = clean({ ...item, [field]: field === "crit" || field === "min" || field === "target" ? Number(event.target.value) : event.target.value });
    if (!next) return;
    Object.assign(item, next);
    save();
    renderResults();
  };
  const editPerson = editRow(() => state.people, cleanPerson);
  const editTask = editRow(() => state.tasks, cleanTask);
  peopleBody.addEventListener("input", editPerson);
  peopleBody.addEventListener("change", editPerson);
  tasksBody.addEventListener("input", editTask);
  tasksBody.addEventListener("change", editTask);
  // Removing a person or a task takes their levels and plan rows along; undo puts all of it back.
  const removeWithUndo = (status, message, apply) => {
    const before = JSON.stringify({ people: state.people, tasks: state.tasks, levels: state.levels, plan: state.plan });
    apply();
    tidy();
    changed();
    undoNote(status, message, () => { Object.assign(state, JSON.parse(before)); changed(); });
  };
  peopleBody.addEventListener("click", (event) => {
    const id = event.target.closest("[data-remove-person]")?.dataset.removePerson;
    const person = state.people.find((p) => p.id === id);
    if (!person) return;
    removeWithUndo(peopleStatus, tx("Removed {name}.", { name: person.name }), () => { state.people = state.people.filter((p) => p.id !== id); });
  });
  tasksBody.addEventListener("click", (event) => {
    const id = event.target.closest("[data-remove-task]")?.dataset.removeTask;
    const task = state.tasks.find((t) => t.id === id);
    if (!task) return;
    removeWithUndo(tasksStatus, tx("Removed {name}.", { name: task.name }), () => { state.tasks = state.tasks.filter((t) => t.id !== id); });
  });
  q("[data-example]").addEventListener("click", () => {
    loadExample();
    changed();
    results.scrollIntoView({ behavior: "smooth", block: "start" });
    results.focus({ preventScroll: true });
  });
  window.addEventListener("workplace:changed", render);

  // Matrix exports and the anonymous view.
  anonBox.addEventListener("change", () => { state.anon = anonBox.checked; save(); renderResults(); });
  const matrixRows = () => {
    const cov = coverage(model());
    const vers = versatility(model());
    const pad = (cells) => ["", "", ...cells, ""];
    return [
      [tx("Name"), tx("Role"), tx("Shift"), ...state.tasks.map((t) => t.name), tx("Tasks at level 3 or above")],
      ...state.people.map((p, i) => [nameOf(p.id), p.role, p.shift, ...state.tasks.map((t) => level(state.levels, p.id, t.id)), vers[i].count]),
      [tx("At level 3 or above"), ...pad(cov.map((c) => c.count))],
      [tx("Target"), ...pad(state.tasks.map((t) => t.target))],
      [tx("Minimum level"), ...pad(state.tasks.map((t) => t.min))],
      [tx("Criticality"), ...pad(state.tasks.map((t) => t.crit))],
    ];
  };
  q("[data-matrix-csv]", results).addEventListener("click", () => downloadCsv(cfg.text.csvMatrix, matrixRows()));
  q("[data-matrix-xlsx]", results).addEventListener("click", () => downloadXlsx(cfg.text.csvMatrix, matrixRows()));

  // Plan events.
  q("[data-suggest]", results).addEventListener("click", () => {
    const have = new Set(state.plan.map((r) => `${r.task}|${r.trainee}`));
    const fresh = planSuggestions(model(), { today: today() }).filter((s) => !have.has(`${s.taskId}|${s.traineeId}`));
    fresh.forEach((s) => state.plan.push({ id: newId("r"), task: s.taskId, trainee: s.traineeId, trainer: s.trainerId, target: s.target, due: s.due, sent: false }));
    changed();
    flash(planStatus, fresh.length ? tx("{n} rows suggested.", { n: fresh.length }) : tx("Nothing new to suggest: every need already has a row."));
  });
  q("[data-add-row]", results).addEventListener("click", () => {
    if (!state.tasks.length || !state.people.length) return;
    state.plan.push({ id: newId("r"), task: state.tasks[0].id, trainee: state.people[0].id, trainer: "", target: COVER_AT, due: addDays(today(), PLAN_DAYS), sent: false });
    changed();
    planBody.querySelector("tr:last-child select")?.focus();
  });
  planBody.addEventListener("change", (event) => {
    const field = event.target.dataset.field;
    const row = state.plan.find((r) => r.id === event.target.closest("tr")?.dataset.id);
    if (!field || !row) return;
    if (field === "target") row.target = clampInt(Number(event.target.value), 1, MAX, COVER_AT);
    else if (field === "due") row.due = parseDate(event.target.value) || "";
    else row[field] = event.target.value;
    if (field === "task" || field === "trainee") event.target.closest("tr").querySelector(".sm-now").textContent = tx("now {n}", { n: level(state.levels, row.trainee, row.task) });
    save();
  });
  planBody.addEventListener("click", (event) => {
    const id = event.target.closest("[data-remove-row]")?.dataset.removeRow;
    const index = state.plan.findIndex((r) => r.id === id);
    if (index < 0) return;
    const [removed] = state.plan.splice(index, 1);
    changed();
    undoNote(planStatus, tx("Removed the row for {name}.", { name: nameOf(removed.trainee) }), () => { state.plan.splice(Math.min(index, state.plan.length), 0, removed); changed(); });
  });
  q("[data-plan-clear]", results).addEventListener("click", () => {
    if (!state.plan.length || !window.confirm(tx("Clear the training plan?"))) return;
    state.plan = [];
    changed();
  });
  // Each row becomes one action owned by its trainer; a row is sent once.
  q("[data-send]", results).addEventListener("click", () => {
    if (!Actions) return;
    const rows = state.plan.filter((r) => !r.sent && taskOf(r.task) && realName(r.trainee));
    if (!rows.length) { flash(planStatus, tx("Nothing new to send: every row is already in the Action Tracker.")); return; }
    rows.forEach((r) => {
      const task = taskOf(r.task);
      Actions.add({
        title: tx("Train {trainee} on {task}", { trainee: realName(r.trainee), task: task.name }),
        detail: [tx("Level now {a}, target {b}", { a: level(state.levels, r.trainee, r.task), b: r.target }), `${tx("Criticality")}: ${critName(task.crit)}`, `${cfg.text.tool}${state.team ? ` · ${state.team}` : ""}`].join(" · "),
        owner: realName(r.trainer), due: r.due, source: "skills-matrix",
        check: cfg.text.checkText.replace("{trainee}", realName(r.trainee)).replace("{task}", task.name).replace("{level}", String(r.target)).replace("{trainer}", realName(r.trainer) || "–"),
        area: state.team, priority: task.crit === 3 ? "High" : task.crit === 2 ? "Medium" : "Low",
      });
      r.sent = true;
    });
    changed();
    const link = el("a", "inline-link", tx("Open the Action Tracker"));
    link.href = Actions.trackerUrl().href;
    planStatus.replaceChildren(`${tx("Sent {n} rows to the Action Tracker.", { n: rows.length })} `, link);
    clearTimeout(planStatus.timer);
    planStatus.timer = setTimeout(() => { planStatus.textContent = ""; }, 8000);
  });
  const planRows = () => [
    [tx("Task"), tx("Trainee"), tx("Level now"), tx("Trainer"), tx("Target level"), tx("By date"), tx("Sent to actions")],
    ...state.plan.map((r) => [taskName(r.task), nameOf(r.trainee), level(state.levels, r.trainee, r.task), nameOf(r.trainer), r.target, r.due, r.sent ? tx("yes") : tx("no")]),
  ];
  q("[data-plan-csv]", results).addEventListener("click", () => { if (state.plan.length) downloadCsv(cfg.text.csvPlan, planRows()); });
  q("[data-plan-xlsx]", results).addEventListener("click", () => { if (state.plan.length) downloadXlsx(cfg.text.csvPlan, planRows()); });

  // Snapshot events: one per day, a new one the same day replaces it.
  q("[data-snapshot]", results).addEventListener("click", () => {
    const snap = snapshot(model(), today());
    state.snapshots = [...state.snapshots.filter((s) => s.date !== snap.date), snap].sort((a, b) => a.date.localeCompare(b.date));
    changed();
    flash(snapStatus, tx("Snapshot of {date} kept.", { date: showDate(snap.date) }));
  });
  snapBody.addEventListener("click", (event) => {
    const date = event.target.closest("[data-remove-snap]")?.dataset.removeSnap;
    const index = state.snapshots.findIndex((s) => s.date === date);
    if (index < 0) return;
    const [removed] = state.snapshots.splice(index, 1);
    changed();
    undoNote(snapStatus, tx("Removed the snapshot of {date}.", { date: showDate(removed.date) }), () => { state.snapshots.splice(Math.min(index, state.snapshots.length), 0, removed); changed(); });
  });

  // A first visit opens on the example, so the result is visible at once; nothing is written until the visitor acts.
  if (!state.people.length && !state.tasks.length && firstVisit(KEY)) loadExample();
  renderLegend();
  render();
})();
