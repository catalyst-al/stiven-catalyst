// The Kaizen Event: plan, run and follow up a rapid improvement event (a kaizen blitz) as Lean teaches it, in three
// phases: the preparation weeks before (charter, team, data, operators released), the event itself (3 to 5 days,
// from training and the current state to the report-out) and the 30-day follow-up, when the open items of the
// Kaizen newspaper are closed and the results are checked again. Several events are kept in this browser
// (cfg.storageKey), each with its status: planned, running, follow-up or closed. The result is the report-out
// (A4 and Word), the charter (A4), the goals before and after, the effort and impact matrix of the ideas and the
// follow-up list against its 30 days. The arithmetic and the rules are in window.KaizenEventMath, so tests can call them.
(() => {
  if (!window.ToolKit) return;
  const { LANG, DECIMAL_COMMA, tx, el, read, write, isObject, str, num, pct, int, euro, showDate, today, addDays, mondayOf, parseNumber, copy, flash, undoNote, stat, panel, resultLayout, firstVisit, downloadCsv, downloadXlsx } = window.ToolKit;

  // Arithmetic and rules --------------------------------------------------------------------------------------------
  const EVENT_STATUSES = ["planned", "running", "followup", "closed"];
  const IDEA_STATUSES = ["idea", "trying", "done", "followup"];
  const DIRECTIONS = ["lower", "higher"];
  const ROLES = ["operator", "supervisor", "maintenance", "support", "outsider", "other"];
  const WASTES = ["D", "O", "W", "N", "T", "I", "M", "E"];
  // The follow-up list of an event is closed within 30 days of the report-out.
  const FOLLOW_UP_DAYS = 30;
  const EVENT_DAYS = [3, 4, 5];

  const isDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value);
  const dateOf = (value) => (isDate(str(value)) ? str(value) : "");
  const text = (value, max = 4000) => str(value).slice(0, max);
  const obj = (value) => (isObject(value) ? value : {});
  const rowsOf = (list, clean) => (Array.isArray(list) ? list : []).filter(isObject).map(clean);
  const pick = (value, allowed, fallback) => (allowed.includes(value) ? value : fallback);
  const scale = (value, fallback = 3) => { const n = Math.round(Number(value)); return Number.isFinite(n) ? Math.min(5, Math.max(1, n)) : fallback; };
  const clampDays = (value) => (EVENT_DAYS.includes(Number(value)) ? Number(value) : 5);
  const weeksOf = (value) => { const n = Math.round(Number(value)); return Number.isFinite(n) ? Math.min(26, Math.max(0, n)) : 1; };
  const newId = () => `k${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  // Calendar days from one date to another (both at midnight UTC, so summer time is never an hour off).
  const daysBetween = (from, to) => Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 864e5);
  // A typed number ("18,4", "1.250") as a number, or null.
  const value = (typed) => { const n = typeof typed === "number" ? typed : parseNumber(typed); return Number.isFinite(n) ? n : null; };
  // A number from the data file as the text a visitor of this language would type.
  const numText = (n) => (Number.isFinite(n) ? (DECIMAL_COMMA ? String(n).replace(".", ",") : String(n)) : "");

  // The event's days run back to back from the start date: a 5-day event that starts on Monday reports out on Friday.
  const endDate = (start, days) => (isDate(start) ? addDays(start, clampDays(days) - 1) : "");
  const eventDates = (start, days) => (isDate(start) ? Array.from({ length: clampDays(days) }, (_, i) => addDays(start, i)) : []);
  // The 30-day check: 30 calendar days after the last day of the event (the report-out).
  const checkDate = (start, days) => (isDate(start) ? addDays(endDate(start, days), FOLLOW_UP_DAYS) : "");
  // A preparation task due n weeks before the event: start date − 7 × n days.
  const prepDue = (start, weeks) => (isDate(start) ? addDays(start, -7 * weeksOf(weeks)) : "");

  const cleanEvent = (item) => {
    const e = obj(item);
    return {
      id: str(e.id) || newId(),
      name: text(e.name, 300), area: text(e.area, 120), start: dateOf(e.start), days: clampDays(e.days),
      scopeStart: text(e.scopeStart, 300), scopeEnd: text(e.scopeEnd, 300), problem: text(e.problem), whyNow: text(e.whyNow),
      sponsor: text(e.sponsor, 120), leader: text(e.leader, 120), facilitator: text(e.facilitator, 120),
      outOfBounds: text(e.outOfBounds), budget: text(e.budget, 30), spent: text(e.spent, 30), savings: text(e.savings, 30),
      savingsNote: text(e.savingsNote, 500), changed: text(e.changed), closedOn: dateOf(e.closedOn), updated: dateOf(e.updated),
      members: rowsOf(e.members, (m) => ({ name: text(m.name, 120), role: pick(m.role, ROLES, "operator") })),
      goals: rowsOf(e.goals, (g) => ({ metric: text(g.metric, 200), unit: text(g.unit, 40), better: pick(g.better, DIRECTIONS, "lower"), baseline: text(g.baseline, 30), target: text(g.target, 30), result: text(g.result, 30), result30: text(g.result30, 30) })),
      prep: rowsOf(e.prep, (p) => ({ text: text(p.text, 300), weeks: weeksOf(p.weeks), owner: text(p.owner, 120), done: p.done === true })),
      agenda: rowsOf(e.agenda, (d) => ({ title: text(d.title, 200), items: rowsOf(d.items, (i) => ({ text: text(i.text, 300), done: i.done === true })) })),
      ideas: rowsOf(e.ideas, (i) => ({ text: text(i.text, 300), waste: WASTES.includes(i.waste) ? i.waste : "", effort: scale(i.effort), impact: scale(i.impact), status: pick(i.status, IDEA_STATUSES, "idea"), owner: text(i.owner, 120), due: dateOf(i.due), closed: dateOf(i.closed), fu: i.fu === true })),
    };
  };

  // The standard agenda of the event, one template per day (cfg.agenda), folded into 3 or 4 days by cfg.plans:
  // a 3-day event runs day 1, then days 2 and 3 together, then days 4 and 5 together.
  const buildAgenda = (templates, plans, days) => {
    const plan = obj(plans)[String(clampDays(days))] || [[0], [1], [2], [3], [4]];
    return plan.map((group) => ({
      title: group.map((i) => str(templates[i]?.title)).filter(Boolean).join(" · "),
      items: group.flatMap((i) => (templates[i]?.items || []).map((line) => ({ text: line, done: false }))),
    }));
  };
  // A new length keeps what was ticked (by its text) and every item the team added (on the same day where it still
  // exists, otherwise on the last day).
  const rebuildAgenda = (old, templates, plans, days) => {
    const fresh = buildAgenda(templates, plans, days);
    const standard = new Set(templates.flatMap((t) => t.items || []));
    const ticked = new Set(old.flatMap((d) => d.items.filter((i) => i.done).map((i) => i.text)));
    fresh.forEach((d) => d.items.forEach((i) => { i.done = ticked.has(i.text); }));
    old.forEach((d, index) => d.items.filter((i) => i.text.trim() && !standard.has(i.text)).forEach((i) => fresh[Math.min(index, fresh.length - 1)].items.push({ ...i })));
    return fresh;
  };
  const agendaProgress = (agenda) => agenda.map((d) => {
    const items = d.items.filter((i) => i.text.trim());
    return { done: items.filter((i) => i.done).length, total: items.length };
  });

  // Preparation: every task with its due date counted back from the start. Done; overdue when not done and its due
  // date has passed; "soon" when due within the next 7 days; otherwise open. Without a start date nothing is due.
  const prepPlan = (e, day) => {
    const items = e.prep.map((p, index) => {
      const due = prepDue(e.start, p.weeks);
      const state = p.done ? "done" : !due ? "none" : due < day ? "overdue" : daysBetween(day, due) <= 7 ? "soon" : "open";
      return { index, text: p.text, weeks: p.weeks, owner: p.owner, due, done: p.done, state };
    }).filter((p) => p.text.trim());
    return { items, done: items.filter((p) => p.done).length, total: items.length, overdue: items.filter((p) => p.state === "overdue").length };
  };

  // Goals. The change is measured from the baseline and is positive when the metric moved the right way:
  //   lower is better:  (baseline − value) / |baseline|      higher is better: (value − baseline) / |baseline|
  // A target is met when the value is at or below it (lower is better) or at or above it (higher is better).
  const improvement = (baseline, result, better) => {
    const b = value(baseline), v = value(result);
    if (b === null || v === null || b === 0) return null;
    return (better === "higher" ? v - b : b - v) / Math.abs(b);
  };
  const targetMet = (target, result, better) => {
    const t = value(target), v = value(result);
    if (t === null || v === null) return null;
    return better === "higher" ? v >= t : v <= t;
  };
  // The share of the planned change reached: (value − baseline) / (target − baseline); 1 is the target exactly.
  const gapClosed = (baseline, target, result) => {
    const b = value(baseline), t = value(target), v = value(result);
    return b === null || t === null || v === null || t === b ? null : (v - b) / (t - b);
  };
  const goalReport = (g) => {
    const point = (result) => ({ value: value(result), change: improvement(g.baseline, result, g.better), met: targetMet(g.target, result, g.better), gap: gapClosed(g.baseline, g.target, result) });
    const after = point(g.result);
    const day30 = point(g.result30);
    return {
      metric: g.metric, unit: g.unit, better: g.better, baseline: value(g.baseline), target: value(g.target),
      targetChange: improvement(g.baseline, g.target, g.better), after, day30,
      // The latest measurement counts: the 30-day check where it was taken, otherwise the end of the event.
      latest: day30.value !== null ? { ...day30, when: "day30" } : after.value !== null ? { ...after, when: "after" } : null,
    };
  };
  const goalsSummary = (e) => {
    const goals = e.goals.filter((g) => g.metric.trim()).map(goalReport);
    const count = (key) => goals.filter((g) => g[key].met === true).length;
    const measured = (key) => goals.filter((g) => g[key].met !== null).length;
    return {
      goals, total: goals.length,
      after: { met: count("after"), measured: measured("after") },
      day30: { met: count("day30"), measured: measured("day30") },
      latest: { met: goals.filter((g) => g.latest?.met === true).length, measured: goals.filter((g) => g.latest && g.latest.met !== null).length },
    };
  };

  // Status of the event by the calendar: planned before the start (or without one), running on its days, in
  // follow-up after the report-out, closed when the 30-day check is recorded.
  const eventStatus = (e, day) => {
    if (e.closedOn) return "closed";
    if (!e.start || day < e.start) return "planned";
    return day <= endDate(e.start, e.days) ? "running" : "followup";
  };
  const isEnded = (e, day) => Boolean(e.start) && day > endDate(e.start, e.days);
  const isFollowUp = (idea, ended) => idea.fu || idea.status === "followup" || (ended && idea.status === "trying");

  // The 30-day follow-up list: everything put on it, and after the event everything still being tried. An item is
  // closed when done; it counts as closed by day 30 when its closing date is on or before the 30-day check (done
  // without a date counts as in time). Days left = check date − today; below zero the check is overdue.
  const followUp = (e, day) => {
    const ended = isEnded(e, day);
    const items = e.ideas.filter((i) => i.text.trim() && isFollowUp(i, ended));
    const due = checkDate(e.start, e.days);
    const closed = items.filter((i) => i.status === "done");
    const inTime = closed.filter((i) => !i.closed || !due || i.closed <= due);
    const open = items.filter((i) => i.status !== "done");
    const left = due ? daysBetween(day, due) : null;
    return {
      items, due, left, ended,
      closed: closed.length, inTime: inTime.length, late: closed.length - inTime.length, open: open.length,
      share: items.length ? inTime.length / items.length : null,
      overdueItems: open.filter((i) => i.due && i.due < day).length,
      state: !items.length ? "none" : !open.length ? "done" : left !== null && left < 0 && !e.closedOn ? "overdue" : "open",
    };
  };

  // The team: operators from the area are required; common practice is about a third of the team from the area and
  // six to eight people in all, so fewer than 4 or more than 10 gets a note.
  const teamCheck = (members) => {
    const named = members.filter((m) => m.name.trim());
    const operators = named.filter((m) => m.role === "operator").length;
    const warnings = [];
    if (!operators) warnings.push("noOperator");
    else if (operators * 3 < named.length) warnings.push("fewOperators");
    if (named.length && named.length < 4) warnings.push("small");
    if (named.length > 10) warnings.push("large");
    return { size: named.length, operators, warnings, ok: operators > 0 };
  };

  // Effort and impact on 1–5, as on the Kaizen Board: 0 quick wins (low effort, high impact), 1 projects (high, high),
  // 2 fill-ins (low, low), 3 thankless (high effort, low impact). On the 0–10 matrix, 1 sits on the edge, 3 in the middle.
  const quadrant = (effort, impact) => {
    const hard = scale(effort) > 3;
    const big = scale(impact) >= 3;
    return big ? (hard ? 1 : 0) : hard ? 3 : 2;
  };
  const matrixPos = (v) => (scale(v) - 1) * 2.5;
  const wasteCounts = (ideas) => WASTES.map((key) => ({ key, done: ideas.filter((i) => i.text.trim() && i.waste === key && i.status === "done").length, all: ideas.filter((i) => i.text.trim() && i.waste === key).length })).filter((w) => w.all);

  const budgetCheck = (e) => {
    const limit = value(e.budget), spent = value(e.spent);
    return { limit, spent, over: limit !== null && spent !== null && spent > limit, share: limit && spent !== null ? spent / limit : null };
  };

  // All events at a glance, for the list and its export.
  const overview = (events, day) => {
    const items = events.map((e) => {
      const f = followUp(e, day);
      const g = goalsSummary(e);
      const check = checkDate(e.start, e.days);
      return { id: e.id, name: e.name, area: e.area, status: eventStatus(e, day), start: e.start, end: endDate(e.start, e.days), check, left: check && !e.closedOn ? daysBetween(day, check) : null, goalsMet: g.latest.met, goalsTotal: g.total, followUp: f.items.length, followUpOpen: f.open, followUpInTime: f.inTime, followUpShare: f.share };
    });
    return { items, total: items.length, byStatus: Object.fromEntries(EVENT_STATUSES.map((s) => [s, items.filter((i) => i.status === s).length])) };
  };

  // Hand-offs. To the Action Tracker: an open item of the newspaper, due by its own date or else by the 30-day check.
  const actionPayload = (e, idea, labels = {}) => ({
    title: idea.text.trim(),
    detail: [labels.event, labels.list, labels.waste].filter(Boolean).join(" · "),
    owner: idea.owner.trim(),
    due: idea.due || checkDate(e.start, e.days),
    source: "kaizen-event",
    check: str(labels.check),
    area: e.area.trim(),
    priority: scale(idea.impact) >= 4 ? "High" : "Medium",
  });
  // To the Kaizen Board, which reads no address: the idea as text to paste there.
  const boardText = (e, idea, labels = {}) => [
    idea.text.trim(),
    [labels.waste && `${labels.wasteLabel || "Waste"}: ${labels.waste}`, `${labels.effortLabel || "Effort"}: ${scale(idea.effort)}/5`, `${labels.impactLabel || "Impact"}: ${scale(idea.impact)}/5`].filter(Boolean).join(" · "),
    `${labels.fromLabel || "From"}: ${e.name.trim() || "Kaizen event"}${e.area ? ` (${e.area})` : ""}`,
  ].join("\n");

  // A new event: the start in six weeks (on a Monday), the standard preparation list and agenda, one goal to fill.
  const blankEvent = (cfg, day) => cleanEvent({
    start: addDays(mondayOf(addDays(day, 42)), 0), days: 5, updated: day,
    prep: cfg.prep.map((p) => ({ text: p.text, weeks: p.weeks, done: false })),
    agenda: buildAgenda(cfg.agenda, cfg.plans, 5),
    goals: [{ better: "lower" }],
  });
  // The example ran three weeks ago, Monday to Friday, and is now in its follow-up: its dates are days from the
  // start, and its numbers are written as this language writes them.
  const exampleEvent = (cfg, day) => {
    const ex = cfg.example;
    const start = addDays(mondayOf(day), -21);
    const at = (n) => (Number.isInteger(n) ? addDays(start, n) : "");
    const undone = new Set((ex.undone || []).map(([d, i]) => `${d}:${i}`));
    const agenda = buildAgenda(cfg.agenda, cfg.plans, ex.days).map((d, di) => ({ ...d, items: d.items.map((item, ii) => ({ ...item, done: !undone.has(`${di}:${ii}`) })) }));
    return cleanEvent({
      ...ex, id: "", start, updated: day, closedOn: "",
      budget: numText(ex.budget), spent: numText(ex.spent), savings: numText(ex.savings),
      goals: ex.goals.map((g) => ({ ...g, baseline: numText(g.baseline), target: numText(g.target), result: numText(g.result), result30: numText(g.result30) })),
      prep: cfg.prep.map((p) => ({ text: p.text, weeks: p.weeks, done: true })),
      agenda,
      ideas: ex.ideas.map((i) => ({ ...i, due: at(i.due), closed: at(i.closed) })),
    });
  };

  window.KaizenEventMath = {
    EVENT_STATUSES, IDEA_STATUSES, DIRECTIONS, ROLES, WASTES, FOLLOW_UP_DAYS,
    cleanEvent, blankEvent, exampleEvent, buildAgenda, rebuildAgenda, agendaProgress, daysBetween, endDate, eventDates, checkDate, prepDue, prepPlan,
    improvement, targetMet, gapClosed, goalReport, goalsSummary, eventStatus, isEnded, followUp, teamCheck, quadrant, matrixPos, wasteCounts, budgetCheck,
    overview, actionPayload, boardText,
  };

  // The page -------------------------------------------------------------------------------------------------------
  const dataEl = document.getElementById("kaizen-event-data");
  const root = document.querySelector("[data-kaizen-event]");
  const results = document.querySelector("[data-results]");
  if (!dataEl || !root || !results) return;
  const cfg = JSON.parse(dataEl.textContent);
  const CK = window.ChartKit;
  const S = window.ActionsStore;
  const WP = window.Workplace || null;
  const $ = (selector) => root.querySelector(selector);
  const form = $("[data-ke-form]");
  const listBox = $("[data-list]");
  const listEmpty = $("[data-list-empty]");
  const listCount = $("[data-list-count]");
  const listStatus = $("[data-list-status]");
  const saveStatus = $("[data-save-status]");
  const exampleAgain = $("[data-example-again]");

  const saved = read(cfg.storageKey, null);
  const state = {
    events: isObject(saved) && Array.isArray(saved.events) ? saved.events.filter(isObject).map(cleanEvent) : [],
    current: isObject(saved) ? str(saved.current) : "",
    example: isObject(saved) ? str(saved.example) : "",
  };
  if (!state.events.some((e) => e.id === state.example)) state.example = "";
  const current = () => state.events.find((e) => e.id === state.current) || null;
  const save = () => {
    saveStatus.textContent = write(cfg.storageKey, state) ? tx("Saved in this browser.") : tx("Not saved: this browser blocks storage. Copy the text or download the Word file to keep it.");
  };

  // Words -------------------------------------------------------------------------------------------------------------
  const statusName = (key) => cfg.eventStatuses?.[key] || key;
  const ideaStatusName = (key) => cfg.ideaStatuses?.[key] || key;
  const roleName = (key) => cfg.roles.find((r) => r.key === key)?.name || key;
  const wasteName = (key) => cfg.wastes.find((w) => w.key === key)?.name || "";
  const directionName = (key) => cfg.directions?.[key] || key;
  const quadrantName = (i) => cfg.quadrants?.[i] || "";
  const nameOf = (e) => e.name.trim() || tx("Untitled Kaizen event");
  const dayCount = (n) => (n === null || n === undefined ? "–" : Math.abs(n) === 1 ? tx("1 day") : tx("{n} days", { n: int.format(Math.abs(n)) }));
  const dateText = (iso) => (iso ? showDate(iso) : "–");
  // Measured values keep the digits they were typed with, up to two.
  const amount = (n) => (n === null ? "–" : num(n, Number.isInteger(n) ? 0 : Math.abs(n * 10 - Math.round(n * 10)) < 1e-9 ? 1 : 2));
  const withUnit = (n, unit) => (n === null ? "–" : `${amount(n)}${unit ? ` ${unit}` : ""}`);
  // A change in the right direction is "better", in the wrong direction "worse": the sign never depends on the metric.
  const changeText = (change) => (change === null ? "–" : change >= 0 ? tx("{pct} better", { pct: pct(change, 1) }) : tx("{pct} worse", { pct: pct(-change, 1) }));
  const metText = (met) => (met === null ? "–" : met ? `✓ ${tx("Yes")}` : `✗ ${tx("No")}`);
  const euros = new Intl.NumberFormat(window.ToolKit.LOCALE, { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
  // Whole euros read better on a savings line; cents only where they were typed.
  const money = (typed) => { const n = value(typed); return n === null ? "–" : Number.isInteger(n) ? euros.format(n) : euro.format(n); };
  const span = (e) => (e.start ? `${showDate(e.start)} – ${showDate(endDate(e.start, e.days))}` : tx("No dates yet"));
  const lengthText = (e) => tx("{n} days", { n: int.format(e.days) });
  const verdict = (e) => {
    const day = today();
    const status = eventStatus(e, day);
    if (status === "planned") {
      const p = prepPlan(e, day);
      if (!e.start) return tx("Planned. Give the start date and the preparation tasks get their due dates.");
      return `${tx("Planned: starts {date}, in {days}.", { date: showDate(e.start), days: dayCount(daysBetween(day, e.start)) })} ${tx("Preparation: {done} of {total} done.", { done: int.format(p.done), total: int.format(p.total) })}${p.overdue ? ` ${tx("Overdue: {n}.", { n: int.format(p.overdue) })}` : ""}`;
    }
    if (status === "running") return tx("Running: day {n} of {total}.", { n: int.format(daysBetween(e.start, day) + 1), total: int.format(e.days) });
    const f = followUp(e, day);
    if (status === "closed") return `${tx("Closed on {date}.", { date: showDate(e.closedOn) })}${f.items.length ? ` ${tx("{share} of the follow-up list closed by day 30.", { share: pct(f.share, 0) })}` : ""}`;
    if (f.left !== null && f.left < 0) return tx("Follow-up: the 30-day check was due on {date}, {days} ago. {open} of {total} follow-up items open.", { date: showDate(f.due), days: dayCount(-f.left), open: int.format(f.open), total: int.format(f.items.length) });
    return tx("Follow-up: {days} to the 30-day check on {date}. {open} of {total} follow-up items open.", { days: dayCount(f.left), date: showDate(f.due), open: int.format(f.open), total: int.format(f.items.length) });
  };
  const checkLine = (f) => (f.left === null ? "–" : f.left >= 0 ? tx("{days} left", { days: dayCount(f.left) }) : tx("{days} overdue", { days: dayCount(-f.left) }));
  const TEAM_TEXT = {
    noOperator: tx("No operator from the area on the team. Operators are required: they know the work, and they will run the new standard."),
    fewOperators: tx("Fewer than a third of the team are operators from the area. Common practice is about a third from the area."),
    small: tx("A small team: most Kaizen events run with six to eight people, so the floor work and the measuring can be shared."),
    large: tx("More than ten people: split the team, or the event turns into a meeting."),
  };
  const PREP_STATE = { done: () => `✓ ${tx("done")}`, overdue: () => `! ${tx("overdue")}`, soon: () => tx("due this week"), open: () => "", none: () => "" };

  // The summary as text ------------------------------------------------------------------------------------------------
  const asText = (e) => {
    const day = today();
    const g = goalsSummary(e);
    const f = followUp(e, day);
    const lines = [`${tx("Kaizen event")} · ${nameOf(e)}`];
    lines.push([e.area && `${tx("Area")}: ${e.area}`, `${tx("Dates")}: ${span(e)} (${lengthText(e)})`, `${tx("Status")}: ${statusName(eventStatus(e, day))}`].filter(Boolean).join(" · "));
    lines.push(verdict(e), "");
    if (e.scopeStart || e.scopeEnd) lines.push(`${tx("Scope")}: ${e.scopeStart || "–"} → ${e.scopeEnd || "–"}`);
    if (e.problem) lines.push(`${tx("Problem")}: ${e.problem}`);
    lines.push([e.sponsor && `${tx("Sponsor")}: ${e.sponsor}`, e.leader && `${tx("Team leader")}: ${e.leader}`, e.facilitator && `${tx("Facilitator")}: ${e.facilitator}`].filter(Boolean).join(" · "), "");
    if (g.total) {
      lines.push(tx("Goals"));
      g.goals.forEach((x) => lines.push(`- ${x.metric}: ${withUnit(x.baseline, x.unit)} → ${tx("target")} ${withUnit(x.target, x.unit)} · ${tx("after the event")} ${withUnit(x.after.value, x.unit)} (${changeText(x.after.change)}, ${tx("target met")}: ${metText(x.after.met)})${x.day30.value !== null ? ` · ${tx("day 30")} ${withUnit(x.day30.value, x.unit)} (${changeText(x.day30.change)}, ${tx("target met")}: ${metText(x.day30.met)})` : ""}`));
      lines.push("");
    }
    if (value(e.savings) !== null) lines.push(`${tx("Hard savings per year")}: ${money(e.savings)}${e.savingsNote ? ` (${e.savingsNote})` : ""}`);
    if (e.changed.trim()) lines.push(`${tx("What changed in the process")}: ${e.changed.trim()}`);
    const done = e.ideas.filter((i) => i.text.trim() && i.status === "done" && !i.fu);
    if (done.length) { lines.push("", tx("Done in the event")); done.forEach((i) => lines.push(`- ${i.text}${i.waste ? ` (${wasteName(i.waste)})` : ""}`)); }
    if (f.items.length) {
      lines.push("", `${tx("30-day follow-up list")} · ${tx("{a} of {b} closed", { a: int.format(f.closed), b: int.format(f.items.length) })} · ${tx("check on {date}", { date: dateText(f.due) })}`);
      f.items.forEach((i) => lines.push(`- ${i.text} (${[i.owner, i.due && showDate(i.due), ideaStatusName(i.status)].filter(Boolean).join(", ")})`));
    }
    const team = e.members.filter((m) => m.name.trim());
    if (team.length) lines.push("", `${tx("Team")}: ${team.map((m) => `${m.name} (${roleName(m.role)})`).join(", ")}`);
    return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
  };

  // Tables and sheets ----------------------------------------------------------------------------------------------------
  const table = (headers, rows, className = "") => {
    const wrap = el("div", "dl-table-wrap ke-table-wrap");
    const t = el("table", `dl-table ke-table ${className}`.trim());
    const thead = el("thead");
    const hr = el("tr");
    headers.forEach((label) => { const th = el("th", null, label); th.scope = "col"; hr.append(th); });
    thead.append(hr);
    const tbody = el("tbody");
    rows.forEach((cells) => {
      const tr = el("tr");
      cells.forEach((cell) => {
        const td = el("td");
        const content = isObject(cell) && !(cell instanceof Node) ? cell.text : cell;
        if (isObject(cell) && !(cell instanceof Node) && cell.className) td.className = cell.className;
        if (content instanceof Node) td.append(content); else td.textContent = content === "" || content === null || content === undefined ? "–" : String(content);
        tr.append(td);
      });
      tbody.append(tr);
    });
    t.append(thead, tbody);
    wrap.append(t);
    return wrap;
  };
  const nw = (content, extra = "") => ({ text: content, className: `ke-nowrap ${extra}`.trim() });
  const pair = (label, content) => {
    const p = el("p", "ke-pair");
    p.append(el("span", null, `${label}: `), el("strong", null, content || "–"));
    return p;
  };
  const para = (content) => (String(content || "").trim() ? el("p", "ke-text", content.trim()) : el("p", "ke-empty", tx("Not filled in yet.")));
  const metCell = (met) => nw(metText(met), met === true ? "is-met" : met === false ? "is-missed" : "");
  const sheetHead = (kicker, e, extra = []) => {
    const head = el("header", "ke-sheet-head");
    head.append(el("p", "ke-sheet-kicker", kicker), el("h3", "ke-sheet-title", nameOf(e)));
    const meta = el("dl", "ke-meta");
    [[tx("Area"), e.area], [tx("Dates"), `${span(e)} · ${lengthText(e)}`], [tx("Sponsor"), e.sponsor], [tx("Team leader"), e.leader], [tx("Facilitator"), e.facilitator], ...extra]
      .forEach(([label, content]) => { const item = el("div"); item.append(el("dt", null, label), el("dd", null, content || "–")); meta.append(item); });
    head.append(meta);
    return head;
  };
  const block = (title, ...content) => {
    const box = el("section", "ke-block");
    box.append(el("h4", "ke-block-title", title), ...content.filter(Boolean));
    return box;
  };
  const teamTable = (e) => {
    const team = e.members.filter((m) => m.name.trim());
    return team.length ? table([tx("Name"), tx("Role in the team")], team.map((m) => [m.name, roleName(m.role)])) : el("p", "ke-empty", tx("No team members yet."));
  };
  // One small chart per goal: before, after the event and at day 30, with the target as a line. The colour repeats
  // what the label says: target met or not.
  const goalChart = (x, index) => {
    if (!CK || x.baseline === null) return null;
    const items = [{ label: tx("Before"), value: x.baseline, color: CK.C.muted, tip: `${tx("Before")}: ${withUnit(x.baseline, x.unit)}` }];
    [["after", tx("After the event")], ["day30", tx("Day 30")]].forEach(([key, label]) => {
      const p = x[key];
      if (p.value === null) return;
      items.push({ label, value: Math.max(0, p.value), color: p.met === true ? CK.C.ok : p.met === false ? CK.C.warn : CK.C.blue, tip: `${label}: ${withUnit(p.value, x.unit)}\n${changeText(p.change)} · ${tx("target met")}: ${metText(p.met)}` });
    });
    const svg = CK.bars(items, { title: `${x.metric}${x.unit ? ` (${x.unit})` : ""}`, unit: x.unit, target: x.target ?? undefined, targetLabel: tx("Target"), format: amount, highlight: () => false });
    const fig = CK.figure(svg, { fileName: `kaizen-goal-${index + 1}`, caption: `${x.metric} · ${directionName(x.better)}` });
    fig.classList.add("ke-goal-chart");
    return fig;
  };
  const goalsTable = (g, withResults) => table(
    withResults
      ? [tx("Goal"), tx("Before"), tx("Target value"), tx("After the event"), tx("Change"), tx("Day 30"), tx("Change"), tx("Target met")]
      : [tx("Goal"), tx("Better when"), tx("Baseline"), tx("Target value"), tx("Planned change")],
    g.goals.map((x) => (withResults
      ? [`${x.metric}${x.unit ? ` (${x.unit})` : ""}`, nw(amount(x.baseline)), nw(amount(x.target)), nw(amount(x.after.value)), nw(changeText(x.after.change)), nw(amount(x.day30.value)), nw(changeText(x.day30.change)), metCell(x.latest ? x.latest.met : null)]
      : [`${x.metric}${x.unit ? ` (${x.unit})` : ""}`, directionName(x.better), nw(amount(x.baseline)), nw(amount(x.target)), nw(changeText(x.targetChange))])),
    "ke-goals-table",
  );
  const followTable = (f) => (f.items.length
    ? table([tx("Follow-up item"), tx("Owner"), tx("Due date"), tx("Status")], f.items.map((i) => [i.text, i.owner, nw(dateText(i.due)), nw(`${i.status === "done" ? "✓ " : ""}${ideaStatusName(i.status)}${i.status === "done" && i.closed ? ` · ${showDate(i.closed)}` : ""}`)]))
    : el("p", "ke-empty", tx("Nothing on the follow-up list.")));

  // The report-out: what the sponsor and the area see on the last day, and again at the 30-day check.
  const buildReport = (e) => {
    const day = today();
    const g = goalsSummary(e);
    const f = followUp(e, day);
    const sheet = el("div", "ke-sheet ke-report");
    sheet.append(sheetHead(tx("Kaizen event · report-out"), e, [[tx("Status"), statusName(eventStatus(e, day))], [tx("30-day check"), f.due ? `${showDate(f.due)} · ${e.closedOn ? `${tx("held on")} ${showDate(e.closedOn)}` : checkLine(f)}` : "–"]]));
    sheet.append(block(tx("Problem and scope"), para(e.problem), e.scopeStart || e.scopeEnd ? pair(tx("Scope"), `${e.scopeStart || "–"} → ${e.scopeEnd || "–"}`) : null));
    const charts = el("div", "ke-goal-charts");
    g.goals.forEach((x, i) => { const fig = goalChart(x, i); if (fig) charts.append(fig); });
    sheet.append(block(tx("Goals: before and after"),
      g.total ? goalsTable(g, true) : el("p", "ke-empty", tx("No goals yet.")),
      g.total ? el("p", "ke-note", tx("{met} of {total} targets met (latest measurement).", { met: int.format(g.latest.met), total: int.format(g.total) })) : null,
      charts.childElementCount ? charts : null));
    const done = e.ideas.filter((i) => i.text.trim() && i.status === "done" && !i.fu);
    const list = el("ul", "ke-changes");
    done.forEach((i) => list.append(el("li", null, `${i.text}${i.waste ? ` · ${wasteName(i.waste)}` : ""}`)));
    sheet.append(block(tx("What changed in the process"), e.changed.trim() ? para(e.changed) : null, done.length ? list : el("p", "ke-empty", tx("Nothing marked done in the event yet.")),
      value(e.savings) !== null ? pair(tx("Hard savings per year"), `${money(e.savings)}${e.savingsNote ? ` · ${e.savingsNote}` : ""}`) : null));
    sheet.append(block(`${tx("30-day follow-up list")} · ${f.items.length ? tx("{a} of {b} closed", { a: int.format(f.closed), b: int.format(f.items.length) }) : "0"}`, followTable(f)));
    sheet.append(block(tx("Team"), teamTable(e)));
    return sheet;
  };

  // The charter: what the sponsor agrees to before the event, with the preparation list counted back from the start.
  const buildCharter = (e) => {
    const day = today();
    const g = goalsSummary(e);
    const p = prepPlan(e, day);
    const b = budgetCheck(e);
    const sheet = el("div", "ke-sheet ke-charter");
    sheet.append(sheetHead(tx("Kaizen event · charter"), e, [[tx("Budget limit"), money(b.limit)]]));
    sheet.append(block(tx("Scope"), pair(tx("Starts at"), e.scopeStart), pair(tx("Ends at"), e.scopeEnd)));
    sheet.append(block(tx("Problem"), para(e.problem)), block(tx("Why now"), para(e.whyNow)));
    sheet.append(block(tx("Goals"), g.total ? goalsTable(g, false) : el("p", "ke-empty", tx("No goals yet."))));
    sheet.append(block(tx("Out of bounds"), para(e.outOfBounds)));
    sheet.append(block(tx("Team"), teamTable(e)));
    sheet.append(block(tx("Preparation"), p.total ? table([tx("Task"), tx("Weeks before"), tx("Due date"), tx("Owner"), tx("Done")], p.items.map((x) => [x.text, nw(int.format(x.weeks)), nw(dateText(x.due)), x.owner, nw(x.done ? "☑" : "☐")])) : el("p", "ke-empty", tx("No preparation tasks."))));
    const days = el("ol", "ke-days-list");
    const dates = eventDates(e.start, e.days);
    e.agenda.forEach((d, i) => days.append(el("li", null, `${dates[i] ? `${showDate(dates[i])} · ` : ""}${d.title}`)));
    sheet.append(block(tx("The event days"), days));
    const sign = el("div", "ke-sign");
    [tx("Sponsor"), tx("Team leader"), tx("Area owner")].forEach((label) => sign.append(el("p", null, `${label}: ____________________`)));
    sheet.append(block(tx("Agreed"), sign));
    return sheet;
  };

  // Word: the report-out ------------------------------------------------------------------------------------------------
  const wordFile = (e) => {
    const kit = window.DocxKit;
    if (!kit) return null;
    const { run, para: p, TEXT_WIDTH } = kit;
    const day = today();
    const g = goalsSummary(e);
    const f = followUp(e, day);
    const GREY = '<w:color w:val="555555"/>';
    const SMALL = '<w:sz w:val="18"/><w:szCs w:val="18"/>';
    const body = [];
    const h1 = (title) => body.push(p(run(title), '<w:pStyle w:val="Heading1"/>'));
    const lines = (content) => String(content || "").split(/\n/).map((line) => line.trim()).filter(Boolean).forEach((line) => body.push(p(run(line))));
    const pairLine = (label, content) => body.push(p(run(`${label}: `, "<w:b/>") + run(content || "–")));
    const bullet = (content) => body.push(p(run(`• ${content}`), '<w:ind w:left="284"/>'));
    const grid = (headers, rows) => {
      const col = Math.floor(TEXT_WIDTH / headers.length);
      const widths = headers.map((_, i) => (i === headers.length - 1 ? TEXT_WIDTH - col * (headers.length - 1) : col));
      const edge = (side) => `<w:${side} w:val="single" w:sz="4" w:space="0" w:color="BBBBBB"/>`;
      const cell = (content, width, header) => `<w:tc><w:tcPr><w:tcW w:w="${width}" w:type="dxa"/>${header ? '<w:shd w:val="clear" w:color="auto" w:fill="EEF2F7"/>' : ""}</w:tcPr>${p(run(content === "" || content === null || content === undefined ? "–" : String(content), header ? "<w:b/>" : ""), '<w:spacing w:before="40" w:after="40"/>')}</w:tc>`;
      body.push(`<w:tbl><w:tblPr><w:tblW w:w="${TEXT_WIDTH}" w:type="dxa"/><w:tblBorders>${["top", "left", "bottom", "right", "insideH", "insideV"].map(edge).join("")}</w:tblBorders><w:tblCellMar><w:left w:w="80" w:type="dxa"/><w:right w:w="80" w:type="dxa"/></w:tblCellMar></w:tblPr><w:tblGrid>${widths.map((w) => `<w:gridCol w:w="${w}"/>`).join("")}</w:tblGrid>${[headers, ...rows].map((row, i) => `<w:tr>${i === 0 ? "<w:trPr><w:tblHeader/></w:trPr>" : ""}${row.map((c, j) => cell(c, widths[j], i === 0)).join("")}</w:tr>`).join("")}</w:tbl>`);
      body.push(p(""));
    };
    body.push(p(run(`${tx("Kaizen event")} · ${nameOf(e)}`), '<w:pStyle w:val="Title"/>'));
    body.push(p(run([e.area, `${span(e)} (${lengthText(e)})`, statusName(eventStatus(e, day))].filter(Boolean).join(" · "), GREY + SMALL)));
    body.push(p(run([e.sponsor && `${tx("Sponsor")}: ${e.sponsor}`, e.leader && `${tx("Team leader")}: ${e.leader}`, e.facilitator && `${tx("Facilitator")}: ${e.facilitator}`].filter(Boolean).join(" · "), GREY + SMALL), '<w:spacing w:after="160"/>'));
    h1(tx("Problem and scope"));
    lines(e.problem || "–");
    if (e.scopeStart || e.scopeEnd) pairLine(tx("Scope"), `${e.scopeStart || "–"} → ${e.scopeEnd || "–"}`);
    h1(tx("Goals: before and after"));
    if (g.total) {
      grid([tx("Goal"), tx("Before"), tx("Target value"), tx("After the event"), tx("Change"), tx("Day 30"), tx("Change"), tx("Target met")],
        g.goals.map((x) => [`${x.metric}${x.unit ? ` (${x.unit})` : ""}`, amount(x.baseline), amount(x.target), amount(x.after.value), changeText(x.after.change), amount(x.day30.value), changeText(x.day30.change), metText(x.latest ? x.latest.met : null)]));
      body.push(p(run(tx("{met} of {total} targets met (latest measurement).", { met: int.format(g.latest.met), total: int.format(g.total) }))));
    } else lines("–");
    h1(tx("What changed in the process"));
    if (e.changed.trim()) lines(e.changed);
    e.ideas.filter((i) => i.text.trim() && i.status === "done" && !i.fu).forEach((i) => bullet(`${i.text}${i.waste ? ` (${wasteName(i.waste)})` : ""}`));
    if (value(e.savings) !== null) pairLine(tx("Hard savings per year"), `${money(e.savings)}${e.savingsNote ? ` · ${e.savingsNote}` : ""}`);
    h1(`${tx("30-day follow-up list")} · ${tx("check on {date}", { date: dateText(f.due) })}`);
    if (f.items.length) grid([tx("Follow-up item"), tx("Owner"), tx("Due date"), tx("Status")], f.items.map((i) => [i.text, i.owner, dateText(i.due), `${ideaStatusName(i.status)}${i.status === "done" && i.closed ? ` · ${showDate(i.closed)}` : ""}`]));
    else lines(tx("Nothing on the follow-up list."));
    h1(tx("Team"));
    const team = e.members.filter((m) => m.name.trim());
    if (team.length) grid([tx("Name"), tx("Role in the team")], team.map((m) => [m.name, roleName(m.role)]));
    else lines("–");
    return kit.wordFile({ body, font: "Arial", accent: "0a6ab0", lang: LANG, title: `${tx("Kaizen event")} · ${nameOf(e)}`, creator: e.leader });
  };
  const fileSlug = (e) => (String(nameOf(e)).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "event");
  const saveBytes = (name, bytes, type) => {
    const link = el("a");
    link.href = URL.createObjectURL(new Blob([bytes], { type }));
    link.download = name;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  };

  // The action list (the Kaizen newspaper) as a table for the CSV and the Excel file: header row first.
  const actionRows = (e) => {
    const ended = isEnded(e, today());
    return [
      [tx("No."), tx("Idea or action"), tx("Waste"), tx("Effort"), tx("Impact"), tx("Matrix"), tx("Status"), tx("Owner"), tx("Due date"), tx("Closed on"), tx("On the follow-up list")],
      ...e.ideas.filter((i) => i.text.trim()).map((i, n) => [n + 1, i.text, wasteName(i.waste), i.effort, i.impact, quadrantName(quadrant(i.effort, i.impact)), ideaStatusName(i.status), i.owner, i.due, i.closed, isFollowUp(i, ended) ? tx("Yes") : tx("No")]),
    ];
  };
  Object.assign(window.KaizenEventMath, { asText, buildReport, buildCharter, wordFile, actionRows });

  // The example note ---------------------------------------------------------------------------------------------------
  const exampleNote = el("div", "dl-example-note");
  exampleNote.setAttribute("role", "status");
  exampleNote.hidden = true;
  const clearExample = el("button", "button-ghost", tx("Clear the example"));
  clearExample.type = "button";
  exampleNote.append(el("strong", null, tx("Example")), " ", el("span", null, tx("This is an example, so you can see what the tool shows. Change it to make it yours, start a new event, or clear it now.")), " ", clearExample);
  root.prepend(exampleNote);

  // The form ---------------------------------------------------------------------------------------------------------
  const getPath = (target, path) => path.split(".").reduce((o, key) => (o === null || o === undefined ? undefined : o[key]), target);
  const setPath = (target, path, content) => {
    const keys = path.split(".");
    const last = keys.pop();
    const holder = keys.reduce((o, key) => (o === null || o === undefined ? undefined : o[key]), target);
    if (holder && typeof holder === "object") holder[last] = content;
  };
  const fields = [...form.querySelectorAll("[data-f]")];
  const fillFields = () => {
    const e = current();
    fields.forEach((node) => {
      const content = e ? getPath(e, node.dataset.f) : undefined;
      node.value = content === undefined || content === null ? (node.tagName === "SELECT" ? node.options[node.options.length - 1]?.value || "" : "") : String(content);
    });
  };
  // Areas from the workplace profile when there is one, otherwise the tool's own.
  const areaList = $("[data-area-list]");
  const fillAreas = () => {
    if (!areaList) return;
    const names = WP?.areas().length ? WP.areas().map((a) => a.name) : cfg.areas;
    areaList.replaceChildren(...names.map((name) => { const o = el("option"); o.value = name; return o; }));
  };

  const options = (pairs) => pairs.map(([v, label]) => { const o = el("option", null, label); o.value = v; return o; });
  const SCALE = () => options([1, 2, 3, 4, 5].map((n) => [String(n), String(n)]));
  const ROWS = {
    members: { fields: [["name", tx("Name"), "text", "", "person"], ["role", tx("Role in the team"), () => options(cfg.roles.map((r) => [r.key, r.name]))]], blank: () => ({ name: "", role: "operator" }), label: tx("Team member") },
    goals: { fields: [["metric", tx("Metric"), "text", "wide", "metric"], ["unit", tx("Unit"), "text", "", "unit"], ["better", tx("Better when"), () => options(DIRECTIONS.map((d) => [d, directionName(d)]))], ["baseline", tx("Baseline"), "number"], ["target", tx("Target value"), "number"]], calc: "goal", blank: () => ({ metric: "", unit: "", better: "lower", baseline: "", target: "", result: "", result30: "" }), label: tx("Goal") },
    results: { list: "goals", fields: [["result", tx("After the event"), "number"], ["result30", tx("At the 30-day check"), "number"]], calc: "result", title: (g) => `${g.metric || tx("Goal")}${g.unit ? ` (${g.unit})` : ""}`, label: tx("Goal") },
    prep: { fields: [["done", tx("Done"), "checkbox"], ["text", tx("Task"), "text", "wide"], ["weeks", tx("Weeks before"), "int"], ["owner", tx("Owner"), "text", "", "person"]], calc: "prep", blank: () => ({ text: "", weeks: 1, owner: "", done: false }), label: tx("Task") },
    ideas: { fields: [["text", tx("Idea or action"), "text", "wide", "idea"], ["waste", tx("Waste it removes"), () => options([["", tx("Not set")], ...cfg.wastes.map((w) => [w.key, w.name])])], ["effort", tx("Effort (1–5)"), SCALE], ["impact", tx("Impact (1–5)"), SCALE], ["status", tx("Status"), () => options(IDEA_STATUSES.map((s) => [s, ideaStatusName(s)]))], ["owner", tx("Owner"), "text", "", "person"], ["due", tx("Due date"), "date"]], calc: "idea", blank: () => ({ text: "", waste: "", effort: 3, impact: 3, status: "idea", owner: "", due: "", closed: "", fu: false }), label: tx("Idea") },
  };
  const ideaLabels = (e, idea) => ({
    event: `${tx("Kaizen event")}: ${nameOf(e)}`,
    list: tx("30-day follow-up list"),
    waste: idea.waste ? `${tx("Waste")}: ${wasteName(idea.waste)}` : "",
    check: checkDate(e.start, e.days) ? tx("Closed by the 30-day check on {date}", { date: showDate(checkDate(e.start, e.days)) }) : "",
  });
  const boardLabels = (idea) => ({ waste: wasteName(idea.waste), wasteLabel: tx("Waste"), effortLabel: tx("Effort"), impactLabel: tx("Impact"), fromLabel: tx("From") });

  const field = (id, label, node, className = "field") => {
    const wrap = el("div", className);
    const lab = el("label", null, label);
    lab.htmlFor = id;
    node.id = id;
    if (node.type === "checkbox") wrap.append(node, " ", lab); else wrap.append(lab, node);
    return wrap;
  };
  const inputFor = (kind, content, placeholder) => {
    let node;
    if (typeof kind === "function") {
      node = el("select");
      node.append(...kind());
      node.value = String(content);
    } else {
      node = el("input");
      node.type = kind === "number" ? "text" : kind === "int" ? "number" : kind;
      if (kind === "number") node.inputMode = "decimal";
      if (kind === "int") { node.min = "0"; node.max = "26"; node.step = "1"; node.inputMode = "numeric"; }
      if (kind === "checkbox") node.checked = content === true; else node.value = content ?? "";
      if (kind === "text" || kind === "number") node.autocomplete = "off";
      if (placeholder && cfg.fields?.[placeholder]) node.placeholder = cfg.fields[placeholder];
    }
    return node;
  };
  const renderRows = (name) => {
    const spec = ROWS[name];
    const box = form.querySelector(`[data-rows="${name}"]`);
    if (!spec || !box) return;
    const e = current();
    const listName = spec.list || name;
    const list = e ? e[listName] : [];
    box.replaceChildren(...list.map((item, index) => {
      if (name === "results" && !item.metric.trim()) return null;
      const row = el("div", `ke-row ke-row-${name}`);
      row.dataset.row = listName;
      row.dataset.index = String(index);
      if (spec.title) row.append(el("p", "ke-row-title", spec.title(item)));
      spec.fields.forEach(([key, label, kind, wide, placeholder]) => {
        const node = inputFor(kind, item[key], placeholder);
        node.dataset.k = key;
        const numbered = key === "text" || key === "name" || key === "metric";
        row.append(field(`ke-${name}-${key}-${index}`, `${label}${numbered ? ` ${index + 1}` : ""}`, node, `field${wide ? " ke-wide" : ""}${kind === "checkbox" ? " ke-check" : ""}`));
      });
      if (spec.calc) {
        const calc = el("p", "form-note ke-calc");
        calc.dataset.calc = `${spec.calc}:${index}`;
        calc.setAttribute("aria-live", "polite");
        row.append(calc);
      }
      if (name !== "results") {
        const tools = el("div", "ke-row-tools");
        if (name === "ideas") ideaTools(item, index).forEach((node) => tools.append(node));
        const remove = el("button", "button-ghost", tx("Remove"));
        remove.type = "button";
        remove.dataset.remove = "";
        remove.setAttribute("aria-label", `${tx("Remove")}: ${spec.label} ${index + 1}`);
        tools.append(remove);
        row.append(tools);
      }
      return row;
    }).filter(Boolean));
  };
  // An open item goes to the Action Tracker; an idea nobody took up can be copied for the Kaizen Board.
  const ideaTools = (item, index) => {
    const out = [];
    if (S && item.status !== "done") {
      const link = S.linkButton(tx("Add to actions"), () => {
        const e = current();
        const now = e?.ideas[index];
        return e && now && now.text.trim() ? actionPayload(e, now, ideaLabels(e, now)) : null;
      }, "button-ghost ke-handoff");
      link.addEventListener("click", (event) => {
        if (current()?.ideas[index]?.text.trim()) return;
        event.preventDefault();
        flash(saveStatus, tx("Write the action first, then add it to the actions."));
      });
      out.push(link);
    }
    if (item.status === "idea") {
      const button = el("button", "button-ghost", tx("Copy for the Kaizen Board"));
      button.type = "button";
      button.addEventListener("click", () => {
        const e = current();
        const now = e?.ideas[index];
        if (now?.text.trim()) copy(boardText(e, now, boardLabels(now)), button);
      });
      out.push(button);
    }
    return out;
  };

  // The event days: one checklist per day, from the standard agenda, every line editable.
  const agendaBox = $("[data-agenda]");
  const renderAgenda = () => {
    const e = current();
    if (!agendaBox) return;
    agendaBox.replaceChildren(...(e ? e.agenda : []).map((d, di) => {
      const box = el("div", "ke-day");
      const head = el("div", "ke-day-head");
      const title = el("h4", "ke-day-title");
      title.dataset.calc = `day:${di}`;
      head.append(title, el("span", "form-note ke-day-progress"));
      head.lastChild.dataset.calc = `dayprogress:${di}`;
      box.append(head);
      const list = el("ul", "ke-day-items");
      d.items.forEach((item, ii) => {
        const li = el("li", "ke-day-item");
        li.dataset.row = `agenda.${di}.items`;
        li.dataset.index = String(ii);
        const check = inputFor("checkbox", item.done);
        check.dataset.k = "done";
        const checkId = `ke-day-${di}-${ii}-done`;
        const checkLabel = el("label", "visually-hidden", `${tx("Done")}: ${tx("Day {n}", { n: di + 1 })}, ${tx("item {n}", { n: ii + 1 })}`);
        checkLabel.htmlFor = checkId;
        check.id = checkId;
        const line = inputFor("text", item.text);
        line.dataset.k = "text";
        const lineId = `ke-day-${di}-${ii}-text`;
        const lineLabel = el("label", "visually-hidden", `${tx("Day {n}", { n: di + 1 })}, ${tx("item {n}", { n: ii + 1 })}`);
        lineLabel.htmlFor = lineId;
        line.id = lineId;
        const remove = el("button", "button-ghost ke-day-remove", "×");
        remove.type = "button";
        remove.dataset.remove = "";
        remove.setAttribute("aria-label", `${tx("Remove")}: ${tx("Day {n}", { n: di + 1 })}, ${tx("item {n}", { n: ii + 1 })}`);
        li.append(check, checkLabel, lineLabel, line, remove);
        list.append(li);
      });
      box.append(list);
      const add = el("button", "button-ghost", tx("Add an item"));
      add.type = "button";
      add.dataset.addAgenda = String(di);
      box.append(add);
      return box;
    }));
  };
  const renderAllRows = () => { Object.keys(ROWS).forEach(renderRows); renderAgenda(); };
  const fillForm = () => { fillFields(); renderAllRows(); };
  // Re-render a list and put the focus back on the same control.
  const rerender = (render) => {
    const id = document.activeElement?.id;
    render();
    if (id) document.getElementById(id)?.focus({ preventScroll: true });
  };

  // Typing into an empty page starts an event: nobody has to press "New" first.
  const ensureCurrent = () => {
    let e = current();
    if (e) return e;
    e = blankEvent(cfg, today());
    state.events.unshift(e);
    state.current = e.id;
    return e;
  };
  const edited = (e) => {
    e.updated = today();
    // The first change to the example makes it this person's event; the note goes.
    if (state.example === e.id) state.example = "";
    save();
    renderAll();
  };
  const KINDS = { weeks: weeksOf, effort: scale, impact: scale };
  const onInput = (event) => {
    const target = event.target;
    const row = target.closest?.("[data-row]");
    if (row && target.dataset.k) {
      const e = ensureCurrent();
      const item = getPath(e, row.dataset.row)?.[Number(row.dataset.index)];
      if (!item) return;
      const key = target.dataset.k;
      let content = target.type === "checkbox" ? target.checked : target.value;
      if (KINDS[key]) { if (target.value === "") return; content = KINDS[key](content); }
      if (item[key] === content) return;
      const before = item[key];
      item[key] = content;
      if (row.dataset.row === "ideas" && key === "status") {
        const day = today();
        // An item put on the follow-up list, or still being tried after the event, stays a follow-up item when it is
        // closed; done gets today's date, so the 30-day count knows when.
        if (content === "followup" || before === "followup" || (before === "trying" && isEnded(e, day))) item.fu = item.fu || content !== "idea";
        if (content === "idea" || (content === "trying" && !isEnded(e, day))) item.fu = false;
        item.closed = content === "done" ? item.closed || day : "";
        edited(e);
        rerender(() => renderRows("ideas"));
        return;
      }
      edited(e);
      if (row.dataset.row === "goals" && key === "metric" && event.type === "change") rerender(() => renderRows("results"));
      return;
    }
    const path = target.dataset?.f;
    if (!path) return;
    // Read the value before a new event fills the form, so the first keystroke is kept.
    const content = path === "days" ? clampDays(target.value) : target.value;
    const fresh = !current();
    const e = ensureCurrent();
    if (getPath(e, path) === content) return;
    setPath(e, path, content);
    // A new length rebuilds the agenda, keeping the ticks and the team's own lines.
    if (path === "days") { e.agenda = rebuildAgenda(e.agenda, cfg.agenda, cfg.plans, content); renderAgenda(); }
    if (fresh) rerender(fillForm);
    edited(e);
  };
  form.addEventListener("input", onInput);
  form.addEventListener("change", onInput);
  form.addEventListener("submit", (event) => event.preventDefault());
  form.addEventListener("click", (event) => {
    const add = event.target.closest?.("[data-add]");
    if (add) {
      const name = add.dataset.add;
      if (!ROWS[name]?.blank) return;
      const fresh = !current();
      const e = ensureCurrent();
      e[name].push(ROWS[name].blank());
      edited(e);
      if (fresh) fillForm(); else renderRows(name);
      if (name === "goals") renderRows("results");
      const inputs = form.querySelectorAll(`[data-rows="${name}"] [data-k="${ROWS[name].fields.find((f) => f[2] === "text")[0]}"]`);
      inputs[inputs.length - 1]?.focus();
      return;
    }
    const addAgenda = event.target.closest?.("[data-add-agenda]");
    if (addAgenda) {
      const e = ensureCurrent();
      const d = e.agenda[Number(addAgenda.dataset.addAgenda)];
      if (!d) return;
      d.items.push({ text: "", done: false });
      edited(e);
      renderAgenda();
      const inputs = agendaBox.querySelectorAll(`[data-row="agenda.${addAgenda.dataset.addAgenda}.items"] input[type=text]`);
      inputs[inputs.length - 1]?.focus();
      return;
    }
    const remove = event.target.closest?.("[data-remove]");
    if (!remove) return;
    const row = remove.closest("[data-row]");
    const e = current();
    if (!e || !row) return;
    const path = row.dataset.row;
    const list = getPath(e, path);
    const index = Number(row.dataset.index);
    const [gone] = list.splice(index, 1);
    const redraw = () => { renderAllRows(); };
    edited(e);
    redraw();
    undoNote(saveStatus, tx("Removed: {text}", { text: gone.text || gone.name || gone.metric || tx("the line") }), () => {
      list.splice(Math.min(index, list.length), 0, gone);
      edited(e);
      redraw();
    });
  });

  // Notes under the form: the computed lines of every row and what the rules say.
  const setText = (selector, content) => { const node = form.querySelector(selector); if (node) node.textContent = content; };
  const renderNotes = (e) => {
    const day = today();
    form.querySelectorAll("[data-calc]").forEach((node) => {
      const [kind, at] = node.dataset.calc.split(":");
      const i = Number(at);
      if (!e) { node.textContent = ""; return; }
      if (kind === "goal") {
        const x = goalReport(e.goals[i] || {});
        node.textContent = x.targetChange === null ? "" : tx("Planned change: {change}", { change: changeText(x.targetChange) });
      } else if (kind === "result") {
        const x = goalReport(e.goals[i] || {});
        const parts = [["after", tx("After the event")], ["day30", tx("Day 30")]].filter(([key]) => x[key].value !== null).map(([key, label]) => `${label}: ${changeText(x[key].change)} · ${tx("target met")}: ${metText(x[key].met)}`);
        node.textContent = parts.join(" · ");
      } else if (kind === "prep") {
        const p = e.prep[i];
        if (!p) return;
        const due = prepDue(e.start, p.weeks);
        const st = p.done ? "done" : !due ? "none" : due < day ? "overdue" : daysBetween(day, due) <= 7 ? "soon" : "open";
        node.textContent = due ? [tx("Due {date}", { date: showDate(due) }), PREP_STATE[st]()].filter(Boolean).join(" · ") : tx("Give the start date to get the due date.");
        node.classList.toggle("is-late", st === "overdue");
      } else if (kind === "idea") {
        const idea = e.ideas[i];
        if (!idea) return;
        const ended = isEnded(e, day);
        node.textContent = [quadrantName(quadrant(idea.effort, idea.impact)), isFollowUp(idea, ended) ? tx("On the 30-day follow-up list") : "", idea.status === "done" && idea.closed ? tx("Closed on {date}", { date: showDate(idea.closed) }) : "", ended && idea.status === "idea" ? tx("Not taken up in the event: copy it for the Kaizen Board, or open a project if it needs data.") : ""].filter(Boolean).join(" · ");
      } else if (kind === "day") {
        const dates = eventDates(e.start, e.days);
        node.textContent = `${tx("Day {n}", { n: i + 1 })}${dates[i] ? ` · ${showDate(dates[i])}` : ""} · ${e.agenda[i]?.title || ""}`;
      } else if (kind === "dayprogress") {
        const progress = agendaProgress(e.agenda)[i];
        node.textContent = progress ? tx("{a} of {b}", { a: int.format(progress.done), b: int.format(progress.total) }) : "";
      }
    });
    if (!e) { ["[data-team-note]", "[data-dates-note]", "[data-prep-note]", "[data-ideas-note]", "[data-budget-note]"].forEach((s) => setText(s, "")); return; }
    const team = teamCheck(e.members);
    const teamNote = form.querySelector("[data-team-note]");
    if (teamNote) {
      teamNote.textContent = [tx("Team size: {n}; operators from the area: {ops}.", { n: int.format(team.size), ops: int.format(team.operators) }), ...team.warnings.map((w) => TEAM_TEXT[w])].join(" ");
      teamNote.classList.toggle("is-warning", !team.ok);
    }
    setText("[data-dates-note]", e.start ? tx("{span}. 30-day check: {date}.", { span: span(e), date: showDate(checkDate(e.start, e.days)) }) : tx("No dates yet"));
    const p = prepPlan(e, day);
    setText("[data-prep-note]", p.total ? `${tx("Preparation: {done} of {total} done.", { done: int.format(p.done), total: int.format(p.total) })}${p.overdue ? ` ${tx("Overdue: {n}.", { n: int.format(p.overdue) })}` : ""}` : "");
    const f = followUp(e, day);
    const ideas = e.ideas.filter((i) => i.text.trim());
    setText("[data-ideas-note]", ideas.length ? `${tx("Ideas: {n}, done: {done}.", { n: int.format(ideas.length), done: int.format(ideas.filter((i) => i.status === "done").length) })}${f.items.length ? ` ${tx("Follow-up list: {open} of {total} open, {left}.", { open: int.format(f.open), total: int.format(f.items.length), left: checkLine(f) })}` : ""}` : "");
    const b = budgetCheck(e);
    const budgetNote = form.querySelector("[data-budget-note]");
    if (budgetNote) {
      budgetNote.textContent = b.limit !== null && b.spent !== null ? `${tx("Spent {spent} of the budget of {limit} ({share}).", { spent: money(b.spent), limit: money(b.limit), share: pct(b.share, 0) })}${b.over ? ` ${tx("Over the budget: the sponsor decides.")}` : ""}` : "";
      budgetNote.classList.toggle("is-warning", b.over);
    }
  };

  // The list of events ---------------------------------------------------------------------------------------------------
  const open = (eventId) => {
    state.current = eventId;
    save();
    fillForm();
    renderAll();
  };
  const countLine = (o) => {
    const vars = { n: int.format(o.total), planned: int.format(o.byStatus.planned), running: int.format(o.byStatus.running), followup: int.format(o.byStatus.followup), closed: int.format(o.byStatus.closed) };
    return o.total === 1 ? tx("1 event: {planned} planned, {running} running, {followup} in follow-up, {closed} closed", vars) : tx("{n} events: {planned} planned, {running} running, {followup} in follow-up, {closed} closed", vars);
  };
  const listMeta = (item) => {
    const left = item.status === "closed" ? "" : item.left === null ? "" : item.left >= 0 ? tx("30-day check in {days}", { days: dayCount(item.left) }) : tx("30-day check {days} overdue", { days: dayCount(-item.left) });
    return [statusName(item.status), item.start ? `${showDate(item.start)} – ${showDate(item.end)}` : "", left].filter(Boolean).join(" · ");
  };
  const renderList = () => {
    const o = overview(state.events, today());
    listBox.replaceChildren(...state.events.map((e, index) => {
      const item = o.items[index];
      const li = el("li", "ke-item");
      if (e.id === state.current) li.setAttribute("aria-current", "true");
      const openButton = el("button", "ke-open", nameOf(e));
      openButton.type = "button";
      openButton.addEventListener("click", () => open(e.id));
      li.append(openButton, el("span", "ke-item-meta", [e.area, listMeta(item), e.id === state.example ? tx("Example") : ""].filter(Boolean).join(" · ")));
      if (item.left !== null && item.left < 0 && item.followUpOpen) li.append(el("span", "ke-item-late", `! ${tx("Follow-up items open after the 30-day check: {n}.", { n: int.format(item.followUpOpen) })}`));
      const tools = el("span", "ke-item-tools");
      const dup = el("button", "button-ghost", tx("Duplicate"));
      dup.type = "button";
      dup.setAttribute("aria-label", `${tx("Duplicate")}: ${nameOf(e)}`);
      dup.addEventListener("click", () => {
        const copyOf = cleanEvent({ ...JSON.parse(JSON.stringify(e)), id: "", name: `${nameOf(e)} ${tx("(copy)")}`, updated: today() });
        state.events.splice(index + 1, 0, copyOf);
        open(copyOf.id);
        flash(listStatus, tx("Duplicated: {text}", { text: nameOf(e) }));
      });
      const del = el("button", "button-ghost", tx("Delete"));
      del.type = "button";
      del.setAttribute("aria-label", `${tx("Delete")}: ${nameOf(e)}`);
      del.addEventListener("click", () => {
        const at = state.events.findIndex((x) => x.id === e.id);
        if (at < 0) return;
        const [gone] = state.events.splice(at, 1);
        const wasCurrent = state.current === gone.id;
        const wasExample = state.example === gone.id;
        if (wasExample) state.example = "";
        if (wasCurrent) state.current = state.events[Math.min(at, state.events.length - 1)]?.id || "";
        save();
        fillForm();
        renderAll();
        undoNote(listStatus, tx("Deleted: {text}", { text: nameOf(gone) }), () => {
          state.events.splice(Math.min(at, state.events.length), 0, gone);
          if (wasExample) state.example = gone.id;
          if (wasCurrent) state.current = gone.id;
          save();
          fillForm();
          renderAll();
        });
      });
      tools.append(dup, del);
      li.append(tools);
      return li;
    }));
    listBox.hidden = !state.events.length;
    listEmpty.hidden = state.events.length > 0;
    exampleAgain.hidden = !state.events.length || Boolean(state.example);
    listCount.textContent = o.total ? countLine(o) : "";
  };

  // Results ---------------------------------------------------------------------------------------------------------
  const IDEA_COLORS = () => ({ done: CK.C.ok, followup: CK.C.warn, trying: CK.C.blue, idea: CK.C.muted });
  const matrixPanel = (e) => {
    const ideas = e.ideas.filter((i) => i.text.trim());
    if (!ideas.length) return null;
    const box = panel(tx("Ideas: effort and impact"), tx("The matrix of the Kaizen Board: impact up, effort to the right. The colour repeats the status."));
    if (CK) {
      const colors = IDEA_COLORS();
      const seen = new Map();
      const points = ideas.map((i, n) => {
        const key = `${i.effort}|${i.impact}`;
        const k = seen.get(key) || 0;
        seen.set(key, k + 1);
        // Drawn a little inside the frame, so a point on the edge keeps its number readable; 3 stays on the middle line.
        const inset = (v) => 0.5 + matrixPos(v) * 0.9;
        return { label: `${n + 1}`, x: Math.min(9.6, inset(i.effort) + k * 0.45), y: Math.max(0.3, inset(i.impact) - k * 0.45), color: colors[i.status], tip: `${n + 1}. ${i.text}\n${ideaStatusName(i.status)} · ${tx("Effort")} ${i.effort}/5 · ${tx("Impact")} ${i.impact}/5${i.waste ? ` · ${wasteName(i.waste)}` : ""}` };
      });
      box.append(CK.figure(CK.quadrant(points, { title: tx("Ideas: effort and impact"), xLabel: tx("Effort"), yLabel: tx("Impact"), names: cfg.quadrants, max: 10 }), { fileName: `kaizen-matrix-${fileSlug(e)}` }));
      box.append(CK.legend(IDEA_STATUSES.map((s) => ({ label: ideaStatusName(s), color: colors[s] }))));
    }
    const list = el("ol", "ke-idea-index");
    ideas.forEach((i) => list.append(el("li", null, `${i.text} · ${ideaStatusName(i.status)}`)));
    box.append(list);
    return box;
  };
  // Bars of a share done (done of total), drawn against 100 % rather than against the longest bar.
  const shareBars = (items) => {
    const list = el("div", "dl-bars");
    items.forEach((item) => {
      const row = el("div", "dl-bar");
      const label = el("div", "dl-bar-label");
      const amount = el("span", "dl-bar-value");
      amount.append(el("strong", null, int.format(item.done)), ` / ${int.format(item.total)}`);
      label.append(el("span", "dl-bar-name", item.key), amount);
      const track = el("div", "bar-track");
      const fill = el("div", "bar-fill");
      fill.style.width = `${item.total ? (item.done / item.total) * 100 : 0}%`;
      track.append(fill);
      row.append(label, track);
      list.append(row);
    });
    return list;
  };
  const wastePanel = (e) => {
    const counts = wasteCounts(e.ideas);
    if (!counts.length) return null;
    const box = panel(tx("Waste removed"), tx("Ideas done per waste, of all the ideas against it."));
    // Each bar is the share done of the ideas against that waste.
    box.append(shareBars(counts.map((w) => ({ key: wasteName(w.key), done: w.done, total: w.all }))));
    return box;
  };
  const prepPanel = (e) => {
    const p = prepPlan(e, today());
    if (!p.total) return null;
    const box = panel(tx("Preparation"), `${tx("Preparation: {done} of {total} done.", { done: int.format(p.done), total: int.format(p.total) })}${p.overdue ? ` ${tx("Overdue: {n}.", { n: int.format(p.overdue) })}` : ""}`);
    box.append(table([tx("Task"), tx("Due date"), tx("Done")], p.items.map((x) => [x.text, nw(dateText(x.due)), nw(x.done ? `✓ ${tx("done")}` : x.state === "overdue" ? `! ${tx("overdue")}` : x.state === "soon" ? tx("due this week") : "–", x.state === "overdue" ? "is-missed" : "")])));
    return box;
  };
  const daysPanel = (e) => {
    const progress = agendaProgress(e.agenda);
    if (!progress.length) return null;
    const dates = eventDates(e.start, e.days);
    const box = panel(tx("The event days"), tx("Agenda items ticked per day."));
    box.append(shareBars(e.agenda.map((d, i) => ({ key: `${tx("Day {n}", { n: i + 1 })}${dates[i] ? ` · ${showDate(dates[i])}` : ""} · ${d.title}`, done: progress[i].done, total: progress[i].total }))));
    return box;
  };
  const overviewPanel = () => {
    const day = today();
    const o = overview(state.events, day);
    const box = panel(tx("All Kaizen events"), countLine(o));
    box.append(table([tx("Event"), tx("Status"), tx("Dates"), tx("30-day check"), tx("Targets met"), tx("Follow-up closed")], o.items.map((i) => [
      i.name || tx("Untitled Kaizen event"), nw(statusName(i.status)), nw(i.start ? `${showDate(i.start)} – ${showDate(i.end)}` : "–"),
      nw(i.check ? `${showDate(i.check)}${i.left !== null ? ` · ${i.left >= 0 ? tx("in {days}", { days: dayCount(i.left) }) : tx("{days} overdue", { days: dayCount(-i.left) })}` : ""}` : "–"),
      nw(i.goalsTotal ? tx("{a} of {b}", { a: int.format(i.goalsMet), b: int.format(i.goalsTotal) }) : "–"),
      nw(i.followUp ? `${pct(i.followUpShare, 0)} (${tx("{a} of {b}", { a: int.format(i.followUpInTime), b: int.format(i.followUp) })})` : "–"),
    ])));
    return box;
  };
  const charterPanel = (e) => {
    const box = panel(tx("Charter"), tx("Agreed with the sponsor before the event. Print it on its own with Print the charter."));
    box.append(buildCharter(e));
    return box;
  };
  const linksPanel = (e) => {
    const ended = isEnded(e, today());
    const parked = e.ideas.filter((i) => i.text.trim() && i.status === "idea");
    if (!parked.length) return null;
    const box = panel(ended ? tx("Ideas not taken up in the event") : tx("Ideas not tried yet"), tx("An idea bigger than the event goes to the Kaizen Board (copy it there, the board reads no link). One that needs data to find its cause is a DMAIC project for the Project Portfolio."));
    const list = el("ul", "ke-parked");
    parked.forEach((i) => list.append(el("li", null, `${i.text} · ${quadrantName(quadrant(i.effort, i.impact))}`)));
    const actions = el("div", "tool-actions");
    const board = el("a", "button-secondary", tx("Open the Kaizen Board"));
    board.href = new URL("../kaizen-board/", location.href).href;
    const portfolio = el("a", "button-ghost", tx("Open the Project Portfolio"));
    portfolio.href = new URL("../project-portfolio/", location.href).href;
    actions.append(board, portfolio);
    box.append(list, actions);
    return box;
  };

  const sendAll = (e, status) => {
    if (!S) return;
    const f = followUp(e, today());
    const items = f.items.filter((i) => i.status !== "done");
    if (!items.length) { flash(status, tx("Nothing open on the follow-up list.")); return; }
    const known = S.list();
    let added = 0;
    items.forEach((idea) => {
      const payload = actionPayload(e, idea, ideaLabels(e, idea));
      if (known.some((a) => a.source === "kaizen-event" && a.title === payload.title && a.detail === payload.detail && S.isOpen(a))) return;
      if (S.add(payload)) added += 1;
    });
    const link = el("a", "inline-link", tx("Open the Action Tracker"));
    link.href = S.trackerUrl().href;
    status.replaceChildren(`${added ? (added === 1 ? tx("1 action sent to the Action Tracker.") : tx("{n} actions sent to the Action Tracker.", { n: int.format(added) })) : tx("Already on the list.")} `, link);
  };
  // Two printouts from one page: the report-out (the default, also for Ctrl+P) or the charter.
  const printAs = (kind) => {
    document.documentElement.dataset.kePrint = kind;
    window.print();
    // Browsers that print without blocking clean up after the dialog.
    setTimeout(() => { if (!window.matchMedia?.("print").matches) delete document.documentElement.dataset.kePrint; }, 1000);
  };
  window.addEventListener("afterprint", () => { delete document.documentElement.dataset.kePrint; });

  const renderResults = () => {
    const e = current();
    results.replaceChildren();
    results.hidden = !e;
    if (!e) return;
    const day = today();
    const status = eventStatus(e, day);
    const g = goalsSummary(e);
    const f = followUp(e, day);
    const p = prepPlan(e, day);
    const team = teamCheck(e.members);
    const b = budgetCheck(e);
    const head = el("div", "result-head");
    head.append(el("p", "result-label", tx("Your Kaizen event")), el("h2", null, nameOf(e)), el("p", null, verdict(e)));
    const stats = el("div", "dl-stats");
    stats.append(
      stat(tx("Status"), statusName(status), `${span(e)} · ${lengthText(e)}`),
      stat(tx("30-day check"), status === "closed" ? "✓" : f.left === null ? "–" : f.left >= 0 ? int.format(f.left) : `−${int.format(-f.left)}`, status === "closed" ? `${tx("held on")} ${showDate(e.closedOn)}` : f.due ? `${checkLine(f)} · ${showDate(f.due)}` : tx("No dates yet")),
      stat(tx("Targets met"), g.total ? tx("{a} of {b}", { a: int.format(g.latest.met), b: int.format(g.total) }) : "–", g.day30.measured ? tx("at the 30-day check") : g.after.measured ? tx("after the event") : tx("not measured yet")),
      stat(tx("Follow-up closed"), f.items.length ? pct(f.share, 0) : "–", f.items.length ? tx("{a} of {b} closed by day 30", { a: int.format(f.inTime), b: int.format(f.items.length) }) : tx("Nothing on the follow-up list.")),
      stat(tx("Hard savings per year"), money(e.savings), e.savingsNote || ""),
    );
    // What needs attention, in words (the colour only repeats it).
    const warnings = [];
    if (!team.ok) warnings.push(TEAM_TEXT.noOperator);
    if (p.overdue && status === "planned") warnings.push(tx("Preparation tasks overdue: {n}.", { n: int.format(p.overdue) }));
    if (f.state === "overdue") warnings.push(tx("The 30-day check is overdue. Follow-up items open: {n}.", { n: int.format(f.open) }));
    if (b.over) warnings.push(tx("Spent {spent} of the budget of {limit} ({share}).", { spent: money(b.spent), limit: money(b.limit), share: pct(b.share, 0) }));
    const notes = warnings.map((w) => el("p", "dl-warning ke-warning", `! ${w}`));

    const actions = el("div", "tool-actions result-actions");
    const copyButton = el("button", "button-primary", tx("Copy summary"));
    copyButton.type = "button";
    copyButton.addEventListener("click", () => copy(asText(e), copyButton));
    const printReport = el("button", "button-secondary", tx("Print the report-out"));
    printReport.type = "button";
    printReport.addEventListener("click", () => printAs("report"));
    const printCharter = el("button", "button-secondary", tx("Print the charter"));
    printCharter.type = "button";
    printCharter.addEventListener("click", () => printAs("charter"));
    const wordButton = el("button", "button-secondary", tx("Download Word"));
    wordButton.type = "button";
    wordButton.hidden = !window.DocxKit;
    wordButton.addEventListener("click", () => { const bytes = wordFile(e); if (bytes) saveBytes(`kaizen-event-${fileSlug(e)}-${today()}.docx`, bytes, "application/vnd.openxmlformats-officedocument.wordprocessingml.document"); });
    const sendStatus = el("p", "form-note ke-send-status");
    sendStatus.setAttribute("aria-live", "polite");
    const sendButton = el("button", "button-secondary", tx("Send the follow-up list to the Action Tracker"));
    sendButton.type = "button";
    sendButton.hidden = !S || !f.open;
    sendButton.addEventListener("click", () => sendAll(e, sendStatus));
    actions.append(copyButton, printReport, printCharter, wordButton, sendButton, sendStatus);

    resultLayout(results, { head, stats, notes, focus: buildReport(e), actions, panels: [matrixPanel(e), linksPanel(e), wastePanel(e), daysPanel(e), prepPanel(e), charterPanel(e), overviewPanel()].filter(Boolean) });
  };

  const renderAll = () => {
    const e = current();
    exampleNote.hidden = !state.example || state.example !== state.current;
    renderList();
    renderNotes(e);
    renderResults();
  };

  // Buttons ----------------------------------------------------------------------------------------------------------
  const loadExample = () => {
    const existing = state.events.find((e) => e.id === state.example);
    if (existing) { open(existing.id); return; }
    const e = exampleEvent(cfg, today());
    state.events.unshift(e);
    state.example = e.id;
    open(e.id);
  };
  root.querySelectorAll("[data-example], [data-example-again]").forEach((button) => button.addEventListener("click", () => {
    loadExample();
    results.scrollIntoView?.({ behavior: "smooth", block: "start" });
  }));
  clearExample.addEventListener("click", () => {
    const at = state.events.findIndex((e) => e.id === state.example);
    if (at >= 0) state.events.splice(at, 1);
    if (state.current === state.example) state.current = state.events[0]?.id || "";
    state.example = "";
    save();
    fillForm();
    renderAll();
  });
  $("[data-new]").addEventListener("click", () => {
    const e = blankEvent(cfg, today());
    state.events.unshift(e);
    open(e.id);
    form.querySelector('[data-f="name"]')?.focus();
  });
  $("[data-close-today]")?.addEventListener("click", () => {
    const e = current();
    if (!e) return;
    e.closedOn = today();
    const input = form.querySelector('[data-f="closedOn"]');
    if (input) input.value = e.closedOn;
    edited(e);
  });
  const exportRows = () => { const e = current(); return e && e.ideas.some((i) => i.text.trim()) ? e : null; };
  $("[data-csv]")?.addEventListener("click", () => { const e = exportRows(); if (e) downloadCsv(`kaizen-newspaper-${fileSlug(e)}`, actionRows(e)); });
  $("[data-xlsx]")?.addEventListener("click", () => { const e = exportRows(); if (e) downloadXlsx(`kaizen-newspaper-${fileSlug(e)}`, actionRows(e), { sheet: "Kaizen" }); });

  // Another tab changed the saved events.
  window.addEventListener("storage", (event) => {
    if (event.key !== cfg.storageKey) return;
    const next = read(cfg.storageKey, null);
    if (!isObject(next) || !Array.isArray(next.events)) return;
    state.events = next.events.filter(isObject).map(cleanEvent);
    state.current = str(next.current);
    state.example = state.events.some((e) => e.id === str(next.example)) ? str(next.example) : "";
    fillForm();
    renderAll();
  });
  if (WP) window.addEventListener("workplace:changed", fillAreas);

  // Start: a first visit opens on the example, with the note.
  if (firstVisit(cfg.storageKey)) {
    const e = exampleEvent(cfg, today());
    state.events.push(e);
    state.example = e.id;
    state.current = e.id;
    save();
  } else if (!current() && state.events.length) {
    state.current = state.events[0].id;
  }
  fillAreas();
  fillForm();
  renderAll();
})();
