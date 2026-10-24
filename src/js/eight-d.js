// The 8D Report: one report per serious or customer-facing problem, in the eight disciplines of Ford's Global 8D
// (D0 to D8; the VDA 8D is close to it), from the emergency response to the closing of the team's work. Several
// reports are kept in this browser (cfg.storageKey), each discipline with its status and the date it was done. The
// result is the report in the customary 8D layout (it prints on A4 and downloads as Word), the days it has been open,
// to containment and to closing against target times, and an overview of all reports. Every action of D3, D5, D6 and
// D7 can go to the Action Tracker. The arithmetic and the rules are in window.EightDMath, so a test can call them.
(() => {
  if (!window.ToolKit) return;
  const { LANG, tx, el, read, write, isObject, str, num, pct, int, showDate, today, addDays, parseNumber, copy, flash, undoNote, stat, panel, resultLayout, firstVisit, downloadCsv, downloadXlsx } = window.ToolKit;

  // Arithmetic and rules --------------------------------------------------------------------------------------------
  const STEPS = ["d0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8"];
  const STEP_STATUSES = ["todo", "doing", "done"];
  const ACTION_STATUSES = ["open", "doing", "done"];
  // The disciplines with a target time, counted in calendar days from the opening date.
  const TARGET_KEYS = ["d3", "d4", "d5", "d6", "d8"];
  // Common industry practice, used when nothing else is set: containment within 24 hours (the next day), the root
  // cause within 10 days, the corrective actions chosen within 14, implemented within 30, the report closed within 60.
  const DEFAULT_TARGETS = { d3: 1, d4: 10, d5: 14, d6: 30, d8: 60 };
  const W2H = ["what", "why", "where", "when", "who", "how", "howMany"];
  const IS_NOT = ["what", "where", "when", "extent"];
  const CRITERIA = 6;
  const ADDRESSES = ["occurrence", "escape"];
  const PREVENTION_KINDS = ["fmea", "controlPlan", "standardWork", "training", "readAcross"];
  const DATE_KEYS = ["opened", "date", "eraDate", "cleanPoint", "due", "containmentRemoved"];

  const isDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value);
  const dateOf = (value) => (isDate(str(value)) ? str(value) : "");
  const text = (value, max = 4000) => str(value).slice(0, max);
  const obj = (value) => (isObject(value) ? value : {});
  const rowsOf = (list, clean) => (Array.isArray(list) ? list : []).filter(isObject).map(clean);
  const pick = (value, allowed, fallback) => (allowed.includes(value) ? value : fallback);
  const newId = () => `e${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

  // A saved report can be damaged or old; keep what has the right shape and fill the rest.
  const cleanReport = (item) => {
    const r = obj(item);
    const steps = {};
    STEPS.forEach((key) => {
      const s = obj(obj(r.steps)[key]);
      steps[key] = { status: pick(s.status, STEP_STATUSES, "todo"), date: dateOf(s.date) };
    });
    const d0 = obj(r.d0), d1 = obj(r.d1), d2 = obj(r.d2), d3 = obj(r.d3), d4 = obj(r.d4), d5 = obj(r.d5), d6 = obj(r.d6), d7 = obj(r.d7), d8 = obj(r.d8);
    const cause = (c) => ({ text: text(obj(c).text), verified: obj(c).verified === true, how: text(obj(c).how) });
    return {
      id: str(r.id) || newId(),
      title: text(r.title, 300), customer: text(r.customer, 300), ref: text(r.ref, 120), product: text(r.product, 300), area: text(r.area, 120),
      opened: dateOf(r.opened), updated: dateOf(r.updated),
      steps,
      d0: { criteria: Array.from({ length: CRITERIA }, (_, i) => Array.isArray(d0.criteria) && d0.criteria[i] === true), era: text(d0.era), eraOwner: text(d0.eraOwner, 120), eraDate: dateOf(d0.eraDate) },
      d1: { leader: text(d1.leader, 120), champion: text(d1.champion, 120), members: rowsOf(d1.members, (m) => ({ name: text(m.name, 120), role: text(m.role, 200) })) },
      d2: {
        w: Object.fromEntries(W2H.map((key) => [key, text(obj(d2.w)[key])])),
        isNot: Object.fromEntries(IS_NOT.map((key) => {
          const row = obj(obj(d2.isNot)[key]);
          return [key, { is: text(row.is), isNot: text(row.isNot), diff: text(row.diff) }];
        })),
        statement: text(d2.statement),
      },
      d3: {
        actions: rowsOf(d3.actions, (a) => ({ text: text(a.text, 300), owner: text(a.owner, 120), date: dateOf(a.date), where: text(a.where, 40), sorted: text(a.sorted, 20), found: text(a.found, 20), verified: text(a.verified, 500), status: pick(a.status, ACTION_STATUSES, "open") })),
        cleanPoint: dateOf(d3.cleanPoint), cleanMark: text(d3.cleanMark, 500),
      },
      d4: { occurrence: cause(d4.occurrence), escape: { ...cause(d4.escape), point: text(obj(d4.escape).point, 300) }, notes: text(d4.notes, 8000) },
      d5: { actions: rowsOf(d5.actions, (a) => ({ text: text(a.text, 300), addresses: pick(a.addresses, ADDRESSES, "occurrence"), owner: text(a.owner, 120), due: dateOf(a.due), verification: text(a.verification, 500), verified: a.verified === true, status: pick(a.status, ACTION_STATUSES, "open") })) },
      d6: {
        actions: rowsOf(d6.actions, (a) => ({ text: text(a.text, 300), owner: text(a.owner, 120), due: dateOf(a.due), status: pick(a.status, ACTION_STATUSES, "open") })),
        beforeBad: text(d6.beforeBad, 20), beforeTotal: text(d6.beforeTotal, 20), afterBad: text(d6.afterBad, 20), afterTotal: text(d6.afterTotal, 20),
        period: text(d6.period, 300), result: text(d6.result), containmentRemoved: dateOf(d6.containmentRemoved),
      },
      d7: { lines: rowsOf(d7.lines, (l) => ({ kind: text(l.kind, 40) || "other", text: text(l.text, 300), owner: text(l.owner, 120), due: dateOf(l.due), status: pick(l.status, ACTION_STATUSES, "open") })) },
      d8: { recognition: text(d8.recognition), lessons: text(d8.lessons), closedBy: text(d8.closedBy, 200) },
    };
  };
  // A new report opens today, with the D7 checklist already in place (the five systems most 8Ds have to change).
  const blankReport = (day) => cleanReport({
    opened: day, updated: day,
    d7: { lines: PREVENTION_KINDS.map((kind) => ({ kind })) },
  });
  // The example's dates are days relative to today (-38 is 38 days ago), so it always reads as a recent report.
  const shiftDates = (value, day, key = "") => {
    if (Array.isArray(value)) return value.map((item) => shiftDates(item, day));
    if (isObject(value)) return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, shiftDates(v, day, k)]));
    return DATE_KEYS.includes(key) && Number.isInteger(value) ? addDays(day, value) : value;
  };
  const exampleReport = (example, day) => cleanReport({ ...shiftDates(example, day), id: "", updated: day });

  // Calendar days from one date to another (YYYY-MM-DD, both at midnight UTC, so a change to summer time is no hour off).
  const daysBetween = (from, to) => Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 864e5);
  const isDone = (r, key) => r.steps[key].status === "done";
  const doneDate = (r, key) => (isDone(r, key) ? r.steps[key].date : "");
  // A report is closed when D8 is done: closing is the team's decision, whatever is still written in D7.
  const isClosed = (r) => isDone(r, "d8");
  const closedOn = (r) => doneDate(r, "d8");
  // The discipline the report is in: the first one not done yet.
  const currentStep = (r) => (isClosed(r) ? "closed" : STEPS.find((key) => !isDone(r, key)) || "closed");
  // Days open = (the closing date, or today while open) − the opening date.
  const daysOpen = (r, day) => {
    if (!r.opened) return null;
    const end = isClosed(r) && closedOn(r) ? closedOn(r) : day;
    return Math.max(0, daysBetween(r.opened, end));
  };
  // Days to a discipline = the date it was done − the opening date; null while it is not done.
  const daysTo = (r, key) => (r.opened && doneDate(r, key) ? daysBetween(r.opened, doneDate(r, key)) : null);
  const daysToContainment = (r) => daysTo(r, "d3");
  const daysToClose = (r) => daysTo(r, "d8");
  const cleanTargets = (targets) => Object.fromEntries(TARGET_KEYS.map((key) => {
    const value = Number(obj(targets)[key]);
    return [key, Number.isInteger(value) && value >= 0 && value <= 999 ? value : DEFAULT_TARGETS[key]];
  }));
  // Each discipline with a target: due on the opening date + the target days. Done in time is "ok", done after it
  // "late"; not done and past the due date "overdue" (on the due date itself it is still in time); otherwise "open".
  // A closed report has nothing overdue.
  const deadlines = (r, targets, day) => {
    const t = cleanTargets(targets);
    return TARGET_KEYS.map((key) => {
      const target = t[key];
      const days = daysTo(r, key);
      if (!r.opened) return { key, target, due: "", days, left: null, state: isDone(r, key) ? "done" : "none" };
      const due = addDays(r.opened, target);
      if (isDone(r, key)) return { key, target, due, days, left: null, state: days === null ? "done" : days <= target ? "ok" : "late" };
      if (isClosed(r)) return { key, target, due, days, left: null, state: "none" };
      const left = daysBetween(day, due);
      return { key, target, due, days, left, state: left < 0 ? "overdue" : "open" };
    });
  };
  const overdue = (r, targets, day) => deadlines(r, targets, day).filter((d) => d.state === "overdue").map((d) => d.key);
  const mean = (values) => (values.length ? values.reduce((sum, v) => sum + v, 0) / values.length : null);

  // All reports at a glance: open and closed, the discipline each is in, its age and what is overdue.
  const overview = (reports, targets, day) => {
    const items = reports.map((r) => ({
      id: r.id, title: r.title, ref: r.ref, customer: r.customer, opened: r.opened, closed: isClosed(r), closedOn: closedOn(r),
      step: currentStep(r), age: daysOpen(r, day), toContainment: daysToContainment(r), toClose: isClosed(r) ? daysToClose(r) : null,
      overdue: overdue(r, targets, day),
    }));
    const open = items.filter((i) => !i.closed);
    const byStep = Object.fromEntries([...STEPS, "closed"].map((key) => [key, items.filter((i) => i.step === key).length]));
    const ages = open.map((i) => i.age).filter((a) => a !== null);
    return {
      total: items.length, open: open.length, closed: items.length - open.length,
      overdue: open.filter((i) => i.overdue.length).length,
      byStep,
      avgContainment: mean(items.map((i) => i.toContainment).filter((v) => v !== null)),
      avgClose: mean(items.map((i) => i.toClose).filter((v) => v !== null)),
      oldest: ages.length ? Math.max(...ages) : null,
      items,
    };
  };

  // D0: Ford's six criteria for a Global 8D; with all six met, the 8D is warranted.
  const criteriaCheck = (r) => {
    const met = r.d0.criteria.filter(Boolean).length;
    return { met, total: CRITERIA, warranted: met === CRITERIA };
  };
  // D2, 5W2H: all seven questions answered, and "how many" with a number (a count is what makes the problem measurable).
  const w2hCheck = (w) => {
    const answers = obj(w);
    const missing = W2H.filter((key) => !str(answers[key]).trim());
    const howManyNumber = /\d/.test(str(answers.howMany));
    return { filled: W2H.length - missing.length, total: W2H.length, missing, howManyNumber, complete: !missing.length && howManyNumber };
  };
  // D2, IS / IS NOT: a row is complete when both sides are written and do not say the same; the difference column (what
  // is special about the IS) is where the cause shows, so it is counted, but it is not required.
  const isNotCheck = (table) => {
    const rows = IS_NOT.map((key) => {
      const row = obj(obj(table)[key]);
      const is = str(row.is).trim();
      const isNot = str(row.isNot).trim();
      const same = Boolean(is) && is.toLocaleLowerCase() === isNot.toLocaleLowerCase();
      return { key, is: Boolean(is), isNot: Boolean(isNot), diff: Boolean(str(row.diff).trim()), same, complete: Boolean(is && isNot) && !same };
    });
    const done = rows.filter((row) => row.complete).length;
    return { rows, completeRows: done, total: IS_NOT.length, diffs: rows.filter((row) => row.diff).length, missing: rows.filter((row) => !row.complete).map((row) => row.key), same: rows.filter((row) => row.same).map((row) => row.key), complete: done === IS_NOT.length };
  };
  // D3: what was checked and found, in total and per place; the share found is found / checked.
  const containment = (d3) => {
    const count = (value) => { const n = parseNumber(value); return Number.isFinite(n) && n >= 0 ? n : 0; };
    const actions = d3.actions.filter((a) => a.text.trim());
    const sorted = actions.reduce((sum, a) => sum + count(a.sorted), 0);
    const found = actions.reduce((sum, a) => sum + count(a.found), 0);
    const byPlace = new Map();
    actions.forEach((a) => {
      const place = byPlace.get(a.where) || { where: a.where, sorted: 0, found: 0 };
      place.sorted += count(a.sorted);
      place.found += count(a.found);
      byPlace.set(a.where, place);
    });
    return { actions: actions.length, verified: actions.filter((a) => a.verified.trim()).length, sorted, found, rate: sorted > 0 ? found / sorted : null, places: [...byPlace.values()] };
  };
  // D6: the defect rate before and after the change (defects / base), and the reduction = 1 − after / before.
  const validation = (d6) => {
    const rate = (bad, total) => {
      const b = parseNumber(bad), t = parseNumber(total);
      return Number.isFinite(b) && Number.isFinite(t) && t > 0 && b >= 0 ? { bad: b, total: t, rate: b / t } : null;
    };
    const before = rate(d6.beforeBad, d6.beforeTotal);
    const after = rate(d6.afterBad, d6.afterTotal);
    return { before, after, reduction: before && after && before.rate > 0 ? 1 - after.rate / before.rate : null };
  };
  // What each discipline still misses, as codes the page turns into words. An empty list: the discipline is complete.
  const gaps = (r) => {
    const out = Object.fromEntries(STEPS.map((key) => [key, []]));
    if (!criteriaCheck(r).met) out.d0.push("criteria");
    if (!r.d1.leader.trim()) out.d1.push("leader");
    if (!r.d1.champion.trim()) out.d1.push("champion");
    if (r.d1.members.filter((m) => m.name.trim()).length < 2) out.d1.push("members");
    if (!w2hCheck(r.d2.w).complete) out.d2.push("w2h");
    if (!isNotCheck(r.d2.isNot).complete) out.d2.push("isNot");
    if (!r.d2.statement.trim()) out.d2.push("statement");
    const d3 = r.d3.actions.filter((a) => a.text.trim());
    if (!d3.length) out.d3.push("containment");
    else if (d3.some((a) => !a.verified.trim())) out.d3.push("containmentVerified");
    if (!r.d4.occurrence.text.trim()) out.d4.push("occurrence");
    else if (!r.d4.occurrence.verified) out.d4.push("occurrenceVerified");
    if (!r.d4.escape.text.trim() && !r.d4.escape.point.trim()) out.d4.push("escape");
    else if (!r.d4.escape.verified) out.d4.push("escapeVerified");
    const d5 = r.d5.actions.filter((a) => a.text.trim());
    ADDRESSES.forEach((kind) => { if (!d5.some((a) => a.addresses === kind)) out.d5.push(`pca-${kind}`); });
    if (d5.some((a) => !a.verified)) out.d5.push("pcaVerified");
    const v = validation(r.d6);
    if (!v.before || !v.after) out.d6.push("validation");
    if (!r.d6.containmentRemoved) out.d6.push("containmentRemoved");
    const lines = r.d7.lines.filter((l) => l.text.trim());
    PREVENTION_KINDS.forEach((kind) => { if (!lines.some((l) => l.kind === kind)) out.d7.push(`prevent-${kind}`); });
    if (!r.d8.lessons.trim()) out.d8.push("lessons");
    return out;
  };

  // Hand-offs to the Action Tracker: every action of D3, D5, D6 and D7 with its owner, date and check. The tracker
  // reads title, detail, owner, due, source, check, area and priority; status travels only when the page adds it.
  const STAGE_LISTS = { d3: "actions", d5: "actions", d6: "actions", d7: "lines" };
  const nameOf = (r, untitled = "8D") => [r.ref.trim(), r.title.trim()].filter(Boolean).join(" · ") || untitled;
  const actionPayload = (r, stage, row, labels = {}) => {
    const detail = [`8D ${nameOf(r)}`, labels.heading, labels.extra].filter(Boolean).join(" · ");
    return {
      title: row.text.trim(),
      detail,
      owner: row.owner.trim(),
      due: stage === "d3" ? row.date : row.due,
      source: "eight-d",
      check: stage === "d3" ? row.verified.trim() : stage === "d5" ? row.verification.trim() : str(labels.check).trim(),
      area: r.area.trim(),
      // Containment and the corrective actions protect the customer; the system changes follow.
      priority: stage === "d3" || stage === "d5" ? "High" : "Medium",
      status: row.status,
    };
  };
  const allActions = (r) => Object.entries(STAGE_LISTS).flatMap(([stage, list]) => r[stage][list].map((row, index) => ({ stage, index, row })).filter((item) => item.row.text.trim()));

  // Imports, read only: the 5 Whys worksheet and the open Fishbone of this language become text for the D4 notes.
  // Their keys are only read here, never written.
  const whysText = (saved, labels = {}) => {
    if (!isObject(saved)) return "";
    const value = (name) => str(saved[name]).trim();
    const whys = Object.keys(saved).filter((name) => /^why\d+$/.test(name)).sort((a, b) => Number(a.slice(3)) - Number(b.slice(3))).map(value).filter(Boolean);
    if (!whys.length && !value("cause")) return "";
    const lines = [];
    if (value("problem")) lines.push(`${labels.problem || "Problem"}: ${value("problem")}`);
    whys.forEach((answer, i) => lines.push(`${(labels.why || "Why {n}").replace("{n}", i + 1)}: ${answer}`));
    if (value("cause")) lines.push(`${labels.cause || "Root cause"}: ${value("cause")}`);
    if (value("action")) lines.push(`${labels.action || "Countermeasure"}: ${value("action")}`);
    return lines.join("\n");
  };
  const fishboneText = (saved, sets = {}, labels = {}) => {
    if (!isObject(saved) || !Array.isArray(saved.diagrams)) return "";
    const diagrams = saved.diagrams.filter(isObject);
    const has = (d) => Array.isArray(d.causes) && d.causes.some((list) => Array.isArray(list) && list.some((c) => str(obj(c).text).trim()));
    const d = diagrams.find((x) => x.id === saved.current && has(x)) || diagrams.find(has);
    if (!d) return "";
    const names = Array.isArray(sets[d.set]) ? sets[d.set] : Object.values(sets)[0] || [];
    const lines = [];
    if (str(d.effect).trim()) lines.push(`${labels.effect || "Effect"}: ${str(d.effect).trim()}`);
    d.causes.forEach((list, i) => {
      // Causes kept in a category the diagram's set does not show stay out, as on the Fishbone page.
      if (!Array.isArray(list) || (names.length && i >= names.length)) return;
      const causes = list.filter((c) => str(obj(c).text).trim()).map((c) => {
        const votes = Number.isInteger(c.votes) && c.votes > 0 ? c.votes : 0;
        const marks = [c.likely === true ? labels.likely || "likely" : "", votes ? `${votes} ${votes === 1 ? labels.vote || "vote" : labels.votes || "votes"}` : ""].filter(Boolean);
        const subs = (Array.isArray(c.subs) ? c.subs : []).filter((s) => typeof s === "string" && s.trim());
        return `${str(c.text).trim()}${marks.length ? ` (${marks.join(", ")})` : ""}${subs.length ? `: ${subs.join("; ")}` : ""}`;
      });
      if (causes.length) lines.push(`${names[i] || `#${i + 1}`}: ${causes.join(" · ")}`);
    });
    return lines.join("\n");
  };

  window.EightDMath = {
    STEPS, TARGET_KEYS, DEFAULT_TARGETS, W2H, IS_NOT, PREVENTION_KINDS,
    cleanReport, blankReport, exampleReport, daysBetween, isClosed, currentStep, daysOpen, daysTo, daysToContainment, daysToClose,
    cleanTargets, deadlines, overdue, overview, criteriaCheck, w2hCheck, isNotCheck, containment, validation, gaps,
    nameOf, actionPayload, allActions, whysText, fishboneText,
  };

  // The page -------------------------------------------------------------------------------------------------------
  const dataEl = document.getElementById("eight-d-data");
  const root = document.querySelector("[data-eight-d]");
  const results = document.querySelector("[data-results]");
  if (!dataEl || !root || !results) return;
  const cfg = JSON.parse(dataEl.textContent);
  const CK = window.ChartKit;
  const S = window.ActionsStore;
  const $ = (selector) => root.querySelector(selector);
  const form = $("[data-ed-form]");
  const listBox = $("[data-list]");
  const listEmpty = $("[data-list-empty]");
  const listCount = $("[data-list-count]");
  const listStatus = $("[data-list-status]");
  const saveStatus = $("[data-save-status]");
  const exampleAgain = $("[data-example-again]");

  const saved = read(cfg.storageKey, null);
  const state = {
    reports: isObject(saved) && Array.isArray(saved.reports) ? saved.reports.filter(isObject).map(cleanReport) : [],
    current: isObject(saved) ? str(saved.current) : "",
    example: isObject(saved) ? str(saved.example) : "",
    targets: cleanTargets(isObject(saved) && isObject(saved.targets) ? saved.targets : cfg.targets),
  };
  if (!state.reports.some((r) => r.id === state.example)) state.example = "";
  const current = () => state.reports.find((r) => r.id === state.current) || null;
  const savedText = tx("Saved in this browser.");
  const save = () => {
    saveStatus.textContent = write(cfg.storageKey, state) ? savedText : tx("Not saved: this browser blocks storage. Copy the text or download the Word file to keep it.");
  };

  // Words -------------------------------------------------------------------------------------------------------------
  const discipline = (key) => cfg.disciplines.find((d) => d.key === key) || { key, code: key.toUpperCase(), title: key };
  const heading = (key) => `${discipline(key).code} · ${discipline(key).title}`;
  const stepStatus = (status) => cfg.stepStatuses?.[status] || status;
  const actionStatus = (status) => cfg.actionStatuses?.[status] || status;
  const placeName = (key) => cfg.locations.find((l) => l.key === key)?.name || key || "–";
  const preventionName = (key) => cfg.preventions.find((p) => p.key === key)?.name || key;
  const addressName = (key) => cfg.addresses?.[key] || key;
  const titleOf = (r) => r.title.trim() || tx("Untitled 8D");
  const dayCount = (n) => (n === null ? "–" : n === 1 ? tx("1 day") : tx("{n} days", { n: int.format(n) }));
  // Shares as small as 0.09 % keep two decimals; 3.0 % keeps one.
  const share = (value) => (value === null ? "–" : pct(value, value > 0 && value < 0.01 ? 2 : 1));
  const count = (value) => int.format(value);
  // A typed quantity shown as a number where it is one, as typed otherwise.
  const qty = (value) => { const n = parseNumber(value); return Number.isFinite(n) ? count(n) : str(value); };
  const yesNo = (value) => (value ? tx("Yes") : tx("No"));
  const stepCode = (key) => (key === "closed" ? tx("Closed") : discipline(key).code);
  const GAP_TEXT = {
    criteria: tx("Tick the 8D criteria that apply."),
    leader: tx("Name the team leader."),
    champion: tx("Name the champion."),
    members: tx("Add at least two team members with their function."),
    w2h: tx("Answer all seven 5W2H questions, with a number for how many."),
    isNot: tx("Fill IS and IS NOT in all four rows."),
    statement: tx("Write the problem statement."),
    containment: tx("Add a containment action."),
    containmentVerified: tx("Say how each containment action was verified."),
    occurrence: tx("Write the root cause of occurrence."),
    occurrenceVerified: tx("Verify the root cause of occurrence (turn it on and off)."),
    escape: tx("Write the escape point: why it was not detected."),
    escapeVerified: tx("Verify the escape point (turn it on and off)."),
    "pca-occurrence": tx("Choose a corrective action against the root cause."),
    "pca-escape": tx("Choose a corrective action for the escape point."),
    pcaVerified: tx("Verify every corrective action before you implement it."),
    validation: tx("Give the defects and the base before and after the change."),
    containmentRemoved: tx("Record when the containment was removed."),
    "prevent-fmea": tx("Add the FMEA update."),
    "prevent-controlPlan": tx("Add the control plan update."),
    "prevent-standardWork": tx("Add the standard work update."),
    "prevent-training": tx("Add the training."),
    "prevent-readAcross": tx("Add the read-across to similar products and processes."),
    lessons: tx("Write the lessons learned."),
  };
  const gapText = (code) => GAP_TEXT[code] || code;
  const deadlineText = (d) => {
    if (d.state === "none" && !d.due) return tx("Target: {n} after the opening date.", { n: dayCount(d.target) });
    if (d.state === "ok") return tx("Done after {days}, within the target of {target}.", { days: dayCount(d.days), target: dayCount(d.target) });
    if (d.state === "late") return tx("Done after {days}: {late} over the target of {target}.", { days: dayCount(d.days), late: dayCount(d.days - d.target), target: dayCount(d.target) });
    if (d.state === "overdue") return tx("Overdue: due {date} ({target} after opening), {late} late.", { date: showDate(d.due), target: dayCount(d.target), late: dayCount(-d.left) });
    if (d.state === "open") return tx("Due {date} ({target} after opening), {left} left.", { date: showDate(d.due), target: dayCount(d.target), left: dayCount(d.left) });
    return d.due ? tx("Due {date} ({target} after opening).", { date: showDate(d.due), target: dayCount(d.target) }) : "";
  };
  const verdict = (r) => {
    const day = today();
    if (isClosed(r)) return tx("Closed after {days}.", { days: dayCount(daysOpen(r, day)) });
    const late = overdue(r, state.targets, day);
    const step = currentStep(r);
    const where = tx("In {step}, open for {days}.", { step: heading(step), days: dayCount(daysOpen(r, day)) });
    return late.length ? `${where} ${tx("Overdue: {list}.", { list: late.map(stepCode).join(", ") })}` : `${where} ${tx("Nothing overdue.")}`;
  };

  // The summary as text ------------------------------------------------------------------------------------------------
  const asText = (r) => {
    const day = today();
    const v = validation(r.d6);
    const c = containment(r.d3);
    const lines = [`8D · ${titleOf(r)}`];
    lines.push([r.ref && `${tx("Reference")}: ${r.ref}`, r.customer && `${tx("Customer")}: ${r.customer}`, r.product && `${tx("Product or service")}: ${r.product}`, r.area && `${tx("Area")}: ${r.area}`].filter(Boolean).join(" · "));
    lines.push([r.opened && `${tx("Opened")}: ${showDate(r.opened)}`, `${tx("Days open")}: ${dayCount(daysOpen(r, day))}`, `${tx("Days to containment")}: ${dayCount(daysToContainment(r))}`, `${tx("Days to close")}: ${dayCount(daysToClose(r))}`].filter(Boolean).join(" · "));
    lines.push(verdict(r), "");
    const block = (key, body) => {
      const s = r.steps[key];
      lines.push(`${heading(key)} (${stepStatus(s.status)}${s.date ? `, ${showDate(s.date)}` : ""})`);
      const filled = body.filter((line) => line && String(line).trim());
      lines.push(...(filled.length ? filled : ["–"]), "");
    };
    const k = criteriaCheck(r);
    block("d0", [tx("{met} of {total} criteria met.", { met: k.met, total: k.total }), r.d0.era && `${tx("Emergency response")}: ${r.d0.era}${r.d0.eraOwner ? ` (${r.d0.eraOwner}${r.d0.eraDate ? `, ${showDate(r.d0.eraDate)}` : ""})` : ""}`]);
    block("d1", [r.d1.leader && `${tx("Team leader")}: ${r.d1.leader}`, r.d1.champion && `${tx("Champion")}: ${r.d1.champion}`, ...r.d1.members.filter((m) => m.name.trim()).map((m) => `- ${m.name}${m.role ? `, ${m.role}` : ""}`)]);
    block("d2", [
      ...cfg.w2h.filter((q) => r.d2.w[q.key].trim()).map((q) => `${q.label} ${r.d2.w[q.key].trim()}`),
      ...cfg.isNot.filter((row) => r.d2.isNot[row.key].is.trim() || r.d2.isNot[row.key].isNot.trim()).map((row) => {
        const x = r.d2.isNot[row.key];
        return `${row.label}: ${tx("IS")} ${x.is || "–"} | ${tx("IS NOT")} ${x.isNot || "–"}${x.diff ? ` | ${tx("Difference")} ${x.diff}` : ""}`;
      }),
      r.d2.statement && `${tx("Problem statement")}: ${r.d2.statement}`,
    ]);
    block("d3", [
      ...r.d3.actions.filter((a) => a.text.trim()).map((a) => `- ${a.text} (${[placeName(a.where), a.owner, a.date && showDate(a.date), actionStatus(a.status)].filter(Boolean).join(", ")})${a.sorted || a.found ? ` · ${tx("checked")} ${a.sorted || "–"}, ${tx("found")} ${a.found || "–"}` : ""}${a.verified ? ` · ${a.verified}` : ""}`),
      c.sorted ? tx("Checked {sorted}, found {found} ({rate}).", { sorted: count(c.sorted), found: count(c.found), rate: share(c.rate) }) : "",
      r.d3.cleanPoint && `${tx("Clean point")}: ${showDate(r.d3.cleanPoint)}${r.d3.cleanMark ? ` · ${r.d3.cleanMark}` : ""}`,
    ]);
    block("d4", [
      r.d4.occurrence.text && `${tx("Root cause of occurrence")}: ${r.d4.occurrence.text} (${tx("verified")}: ${yesNo(r.d4.occurrence.verified)}${r.d4.occurrence.how ? `; ${r.d4.occurrence.how}` : ""})`,
      (r.d4.escape.text || r.d4.escape.point) && `${tx("Escape point")}: ${[r.d4.escape.point, r.d4.escape.text].filter(Boolean).join(": ")} (${tx("verified")}: ${yesNo(r.d4.escape.verified)}${r.d4.escape.how ? `; ${r.d4.escape.how}` : ""})`,
    ]);
    block("d5", r.d5.actions.filter((a) => a.text.trim()).map((a) => `- ${a.text} (${[addressName(a.addresses), a.owner, a.due && showDate(a.due), actionStatus(a.status)].filter(Boolean).join(", ")}) · ${tx("verified")}: ${yesNo(a.verified)}${a.verification ? `; ${a.verification}` : ""}`));
    block("d6", [
      ...r.d6.actions.filter((a) => a.text.trim()).map((a) => `- ${a.text} (${[a.owner, a.due && showDate(a.due), actionStatus(a.status)].filter(Boolean).join(", ")})`),
      v.before && v.after ? validationLine(v) : "",
      r.d6.period && `${tx("Period")}: ${r.d6.period}`,
      r.d6.result && `${tx("Result")}: ${r.d6.result}`,
      r.d6.containmentRemoved && `${tx("Containment removed")}: ${showDate(r.d6.containmentRemoved)}`,
    ]);
    block("d7", r.d7.lines.filter((l) => l.text.trim()).map((l) => `- ${preventionName(l.kind)}: ${l.text} (${[l.owner, l.due && showDate(l.due), actionStatus(l.status)].filter(Boolean).join(", ")})`));
    block("d8", [r.d8.recognition && `${tx("Recognition")}: ${r.d8.recognition}`, r.d8.lessons && `${tx("Lessons learned")}: ${r.d8.lessons}`, r.d8.closedBy && `${tx("Closed by")}: ${r.d8.closedBy}`]);
    return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
  };
  const validationLine = (v) => tx("Before {before} ({bad} of {total}) · after {after} ({bad2} of {total2}) · {change}", {
    before: share(v.before.rate), bad: count(v.before.bad), total: count(v.before.total),
    after: share(v.after.rate), bad2: count(v.after.bad), total2: count(v.after.total),
    change: v.reduction === null ? "–" : `${v.reduction >= 0 ? "−" : "+"}${pct(Math.abs(v.reduction), 0)}`,
  });

  // The sheet: the customary 8D layout ---------------------------------------------------------------------------------
  const table = (headers, rows, className = "") => {
    const wrap = el("div", "dl-table-wrap ed-table-wrap");
    const t = el("table", `dl-table ed-table ${className}`.trim());
    const thead = el("thead");
    const hr = el("tr");
    headers.forEach((label) => { const th = el("th", null, label); th.scope = "col"; hr.append(th); });
    thead.append(hr);
    const tbody = el("tbody");
    rows.forEach((cells) => {
      const tr = el("tr");
      cells.forEach((cell) => {
        const td = el("td");
        // A cell is a text, a node, or { text, className } for a date or a number that must not break.
        const value = isObject(cell) && !(cell instanceof Node) ? cell.text : cell;
        if (isObject(cell) && !(cell instanceof Node) && cell.className) td.className = cell.className;
        if (value instanceof Node) td.append(value); else td.textContent = value === "" || value === null || value === undefined ? "–" : String(value);
        tr.append(td);
      });
      tbody.append(tr);
    });
    t.append(thead, tbody);
    wrap.append(t);
    return wrap;
  };
  const nw = (text) => ({ text, className: "ed-nowrap" });
  const pair = (label, value) => {
    const p = el("p", "ed-pair");
    p.append(el("span", null, `${label}: `), el("strong", null, value || "–"));
    return p;
  };
  const para = (value, empty = tx("Not filled in yet.")) => (String(value || "").trim() ? el("p", "ed-text", value.trim()) : el("p", "ed-empty", empty));
  const SIGN = { done: "✓", doing: "…", todo: "○" };
  const sheetSection = (r, key, ...content) => {
    const s = r.steps[key];
    const box = el("section", `ed-d ed-d-${key}`);
    const head = el("header", "ed-d-head");
    head.append(el("h3", "ed-d-title", heading(key)), el("p", `ed-d-state is-${s.status}`, `${SIGN[s.status]} ${stepStatus(s.status)}${s.date ? ` · ${showDate(s.date)}` : ""}`));
    box.append(head, ...content.filter(Boolean));
    return box;
  };
  const buildSheet = (r) => {
    const day = today();
    const sheet = el("div", "ed-sheet");
    const top = el("header", "ed-sheet-head");
    top.append(el("p", "ed-sheet-kicker", tx("8D Report")), el("h3", "ed-sheet-title", titleOf(r)));
    const meta = el("dl", "ed-meta");
    [[tx("Customer"), r.customer], [tx("Reference"), r.ref], [tx("Product or service"), r.product], [tx("Area"), r.area], [tx("Opened"), r.opened && showDate(r.opened)],
      [tx("Team leader"), r.d1.leader], [tx("Champion"), r.d1.champion], [tx("Status"), isClosed(r) ? `${tx("Closed")} ${closedOn(r) ? showDate(closedOn(r)) : ""}`.trim() : `${tx("Open")} · ${stepCode(currentStep(r))}`],
      [tx("Days open"), dayCount(daysOpen(r, day))], [tx("Days to containment"), dayCount(daysToContainment(r))], [tx("Days to close"), dayCount(daysToClose(r))]]
      .forEach(([label, value]) => { const item = el("div"); item.append(el("dt", null, label), el("dd", null, value || "–")); meta.append(item); });
    top.append(meta);
    // The status of every discipline, with its target where it has one.
    const marks = new Map(deadlines(r, state.targets, day).map((d) => [d.key, d]));
    const statusRows = STEPS.map((key) => {
      const s = r.steps[key];
      const d = marks.get(key);
      const days = daysTo(r, key);
      const targetText = d ? `≤ ${dayCount(d.target)}${d.state === "late" ? ` · ${tx("late")}` : d.state === "overdue" ? ` · ${tx("overdue")}` : d.state === "ok" ? ` · ${tx("in time")}` : ""}` : "";
      return [discipline(key).code, discipline(key).title, nw(`${SIGN[s.status]} ${stepStatus(s.status)}`), nw(s.date ? showDate(s.date) : ""), nw(days === null ? "" : dayCount(days)), targetText];
    });
    top.append(table([tx("D"), tx("Discipline"), tx("Status"), tx("Done on"), tx("Days"), tx("Target")], statusRows, "ed-status-table"));
    sheet.append(top);

    const k = criteriaCheck(r);
    const criteria = el("ul", "ed-criteria");
    cfg.criteria.forEach((line, i) => criteria.append(el("li", r.d0.criteria[i] ? "is-met" : "is-not", `${r.d0.criteria[i] ? "✓" : "–"} ${line}`)));
    sheet.append(sheetSection(r, "d0",
      el("p", "ed-note", `${tx("{met} of {total} criteria met.", { met: k.met, total: k.total })} ${k.warranted ? tx("An 8D is warranted.") : k.met ? tx("Not all criteria met: check whether a simpler method, a 5 Whys or an A3, is enough.") : ""}`.trim()),
      criteria,
      pair(tx("Emergency response"), r.d0.era), r.d0.eraOwner || r.d0.eraDate ? el("p", "ed-meta-line", [r.d0.eraOwner, r.d0.eraDate && showDate(r.d0.eraDate)].filter(Boolean).join(" · ")) : null));

    const members = r.d1.members.filter((m) => m.name.trim());
    sheet.append(sheetSection(r, "d1", pair(tx("Team leader"), r.d1.leader), pair(tx("Champion"), r.d1.champion),
      members.length ? table([tx("Name"), tx("Role or function")], members.map((m) => [m.name, m.role])) : el("p", "ed-empty", tx("No team members yet."))));

    const w = w2hCheck(r.d2.w);
    const t = isNotCheck(r.d2.isNot);
    sheet.append(sheetSection(r, "d2",
      el("h4", "ed-sub-title", `5W2H · ${w.filled}/${w.total}`),
      table([tx("Question"), tx("Answer")], cfg.w2h.map((q) => [q.label, r.d2.w[q.key]]), "ed-w2h"),
      el("h4", "ed-sub-title", `${tx("IS / IS NOT")} · ${t.completeRows}/${t.total}`),
      table(["", tx("IS"), tx("IS NOT"), tx("Difference")], cfg.isNot.map((row) => [row.label, r.d2.isNot[row.key].is, r.d2.isNot[row.key].isNot, r.d2.isNot[row.key].diff]), "ed-isnot-table"),
      el("h4", "ed-sub-title", tx("Problem statement")), para(r.d2.statement)));

    const c = containment(r.d3);
    const d3 = r.d3.actions.filter((a) => a.text.trim());
    sheet.append(sheetSection(r, "d3",
      d3.length ? table([tx("Containment action"), tx("Suspect stock"), tx("Owner"), tx("Date"), tx("Checked"), tx("Found"), tx("Verification of effectiveness"), tx("Status")],
        d3.map((a) => [a.text, placeName(a.where), a.owner, nw(a.date && showDate(a.date)), nw(qty(a.sorted)), nw(qty(a.found)), a.verified, actionStatus(a.status)])) : el("p", "ed-empty", tx("No containment action yet.")),
      c.sorted ? el("p", "ed-note", tx("Checked {sorted}, found {found} ({rate}).", { sorted: count(c.sorted), found: count(c.found), rate: share(c.rate) })) : null,
      r.d3.cleanPoint || r.d3.cleanMark ? pair(tx("Clean point"), [r.d3.cleanPoint && showDate(r.d3.cleanPoint), r.d3.cleanMark].filter(Boolean).join(" · ")) : null));

    const causeBox = (title, cause, extra) => {
      const box = el("div", "ed-cause");
      box.append(el("h4", "ed-sub-title", title));
      if (extra) box.append(extra);
      box.append(para(cause.text), el("p", `ed-verified ${cause.verified ? "is-yes" : "is-no"}`, `${cause.verified ? "✓" : "!"} ${tx("Verified")}: ${yesNo(cause.verified)}${cause.how ? ` · ${cause.how}` : ""}`));
      return box;
    };
    const causes = el("div", "ed-causes");
    causes.append(causeBox(tx("Root cause of occurrence"), r.d4.occurrence), causeBox(tx("Root cause of non-detection (escape point)"), r.d4.escape, r.d4.escape.point ? pair(tx("Escape point"), r.d4.escape.point) : null));
    sheet.append(sheetSection(r, "d4", causes, r.d4.notes.trim() ? el("h4", "ed-sub-title", tx("Analysis notes")) : null, r.d4.notes.trim() ? para(r.d4.notes) : null));

    const d5 = r.d5.actions.filter((a) => a.text.trim());
    sheet.append(sheetSection(r, "d5", d5.length
      ? table([tx("Permanent corrective action"), tx("Removes"), tx("Owner"), tx("Due date"), tx("Verified before implementation"), tx("Status")],
        d5.map((a) => [a.text, addressName(a.addresses), a.owner, nw(a.due && showDate(a.due)), `${a.verified ? "✓" : "!"} ${yesNo(a.verified)}${a.verification ? ` · ${a.verification}` : ""}`, actionStatus(a.status)]))
      : el("p", "ed-empty", tx("No corrective action yet."))));

    const v = validation(r.d6);
    const d6 = r.d6.actions.filter((a) => a.text.trim());
    sheet.append(sheetSection(r, "d6",
      d6.length ? table([tx("Implementation step"), tx("Owner"), tx("Date"), tx("Status")], d6.map((a) => [a.text, a.owner, nw(a.due && showDate(a.due)), actionStatus(a.status)])) : el("p", "ed-empty", tx("No implementation step yet.")),
      v.before && v.after ? pair(tx("Validation"), validationLine(v)) : null,
      r.d6.period ? pair(tx("Period"), r.d6.period) : null,
      r.d6.result ? pair(tx("Result"), r.d6.result) : null,
      pair(tx("Containment removed"), r.d6.containmentRemoved ? showDate(r.d6.containmentRemoved) : tx("not yet"))));

    sheet.append(sheetSection(r, "d7", table([tx("System change"), tx("What changes"), tx("Owner"), tx("Due date"), tx("Status")],
      [...r.d7.lines.filter((l) => l.text.trim()).map((l) => [preventionName(l.kind), l.text, l.owner, nw(l.due && showDate(l.due)), actionStatus(l.status)]),
        ...PREVENTION_KINDS.filter((kind) => !r.d7.lines.some((l) => l.kind === kind && l.text.trim())).map((kind) => [preventionName(kind), tx("Not addressed yet"), "", "", ""])])));

    sheet.append(sheetSection(r, "d8", pair(tx("Recognition"), r.d8.recognition), pair(tx("Lessons learned"), r.d8.lessons), pair(tx("Closed by"), r.d8.closedBy), pair(tx("Closed on"), closedOn(r) ? showDate(closedOn(r)) : tx("not yet"))));
    return sheet;
  };

  // Word ------------------------------------------------------------------------------------------------------------
  const wordFile = (r) => {
    const kit = window.DocxKit;
    if (!kit) return null;
    const { run, para: p, TEXT_WIDTH } = kit;
    const day = today();
    const GREY = '<w:color w:val="555555"/>';
    const SMALL = '<w:sz w:val="18"/><w:szCs w:val="18"/>';
    const body = [];
    const h1 = (key) => {
      const s = r.steps[key];
      body.push(p(run(heading(key)), '<w:pStyle w:val="Heading1"/>'));
      body.push(p(run(`${stepStatus(s.status)}${s.date ? ` · ${showDate(s.date)}` : ""}`, GREY + SMALL)));
    };
    const h2 = (value) => body.push(p(run(value, "<w:b/>"), '<w:spacing w:before="120" w:after="40"/>'));
    const lines = (value) => {
      const parts = String(value || "").split(/\n/).map((line) => line.trim()).filter(Boolean);
      (parts.length ? parts : ["–"]).forEach((line) => body.push(p(run(line))));
    };
    const pairLine = (label, value) => body.push(p(run(`${label}: `, "<w:b/>") + run(value || "–")));
    const grid = (headers, rows) => {
      const col = Math.floor(TEXT_WIDTH / headers.length);
      const widths = headers.map((_, i) => (i === headers.length - 1 ? TEXT_WIDTH - col * (headers.length - 1) : col));
      const edge = (side) => `<w:${side} w:val="single" w:sz="4" w:space="0" w:color="BBBBBB"/>`;
      const cell = (value, width, header) => `<w:tc><w:tcPr><w:tcW w:w="${width}" w:type="dxa"/>${header ? '<w:shd w:val="clear" w:color="auto" w:fill="EEF2F7"/>' : ""}</w:tcPr>${p(run(value === "" || value === null || value === undefined ? "–" : String(value), header ? "<w:b/>" : ""), '<w:spacing w:before="40" w:after="40"/>')}</w:tc>`;
      body.push(`<w:tbl><w:tblPr><w:tblW w:w="${TEXT_WIDTH}" w:type="dxa"/><w:tblBorders>${["top", "left", "bottom", "right", "insideH", "insideV"].map(edge).join("")}</w:tblBorders><w:tblCellMar><w:left w:w="80" w:type="dxa"/><w:right w:w="80" w:type="dxa"/></w:tblCellMar></w:tblPr><w:tblGrid>${widths.map((w) => `<w:gridCol w:w="${w}"/>`).join("")}</w:tblGrid>${[headers, ...rows].map((row, i) => `<w:tr>${i === 0 ? "<w:trPr><w:tblHeader/></w:trPr>" : ""}${row.map((value, j) => cell(value, widths[j], i === 0)).join("")}</w:tr>`).join("")}</w:tbl>`);
      body.push(p(""));
    };
    body.push(p(run(`8D · ${titleOf(r)}`), '<w:pStyle w:val="Title"/>'));
    body.push(p(run([r.customer, r.ref, r.product, r.area].filter(Boolean).join(" · "), GREY + SMALL)));
    body.push(p(run([r.opened && `${tx("Opened")}: ${showDate(r.opened)}`, `${tx("Days open")}: ${dayCount(daysOpen(r, day))}`, `${tx("Days to containment")}: ${dayCount(daysToContainment(r))}`, `${tx("Days to close")}: ${dayCount(daysToClose(r))}`].filter(Boolean).join(" · "), GREY + SMALL), '<w:spacing w:after="160"/>'));
    grid([tx("D"), tx("Discipline"), tx("Status"), tx("Done on")], STEPS.map((key) => [discipline(key).code, discipline(key).title, stepStatus(r.steps[key].status), r.steps[key].date && showDate(r.steps[key].date)]));

    const k = criteriaCheck(r);
    h1("d0");
    body.push(p(run(tx("{met} of {total} criteria met.", { met: k.met, total: k.total }))));
    cfg.criteria.forEach((line, i) => body.push(p(run(`${r.d0.criteria[i] ? "☑" : "☐"}  ${line}`), '<w:ind w:left="284"/>')));
    pairLine(tx("Emergency response"), [r.d0.era, r.d0.eraOwner, r.d0.eraDate && showDate(r.d0.eraDate)].filter(Boolean).join(" · "));

    h1("d1");
    pairLine(tx("Team leader"), r.d1.leader);
    pairLine(tx("Champion"), r.d1.champion);
    const members = r.d1.members.filter((m) => m.name.trim());
    if (members.length) grid([tx("Name"), tx("Role or function")], members.map((m) => [m.name, m.role]));

    h1("d2");
    h2("5W2H");
    grid([tx("Question"), tx("Answer")], cfg.w2h.map((q) => [q.label, r.d2.w[q.key]]));
    h2(tx("IS / IS NOT"));
    grid(["", tx("IS"), tx("IS NOT"), tx("Difference")], cfg.isNot.map((row) => [row.label, r.d2.isNot[row.key].is, r.d2.isNot[row.key].isNot, r.d2.isNot[row.key].diff]));
    h2(tx("Problem statement"));
    lines(r.d2.statement);

    h1("d3");
    const d3 = r.d3.actions.filter((a) => a.text.trim());
    if (d3.length) grid([tx("Containment action"), tx("Suspect stock"), tx("Owner"), tx("Date"), tx("Checked"), tx("Found"), tx("Verification of effectiveness")], d3.map((a) => [a.text, placeName(a.where), a.owner, a.date && showDate(a.date), a.sorted, a.found, a.verified]));
    else lines("");
    const c = containment(r.d3);
    if (c.sorted) body.push(p(run(tx("Checked {sorted}, found {found} ({rate}).", { sorted: count(c.sorted), found: count(c.found), rate: share(c.rate) }))));
    if (r.d3.cleanPoint || r.d3.cleanMark) pairLine(tx("Clean point"), [r.d3.cleanPoint && showDate(r.d3.cleanPoint), r.d3.cleanMark].filter(Boolean).join(" · "));

    h1("d4");
    h2(tx("Root cause of occurrence"));
    lines(r.d4.occurrence.text);
    pairLine(tx("Verified"), `${yesNo(r.d4.occurrence.verified)}${r.d4.occurrence.how ? ` · ${r.d4.occurrence.how}` : ""}`);
    h2(tx("Root cause of non-detection (escape point)"));
    if (r.d4.escape.point) pairLine(tx("Escape point"), r.d4.escape.point);
    lines(r.d4.escape.text);
    pairLine(tx("Verified"), `${yesNo(r.d4.escape.verified)}${r.d4.escape.how ? ` · ${r.d4.escape.how}` : ""}`);
    if (r.d4.notes.trim()) { h2(tx("Analysis notes")); lines(r.d4.notes); }

    h1("d5");
    const d5 = r.d5.actions.filter((a) => a.text.trim());
    if (d5.length) grid([tx("Permanent corrective action"), tx("Removes"), tx("Owner"), tx("Due date"), tx("Verified before implementation")], d5.map((a) => [a.text, addressName(a.addresses), a.owner, a.due && showDate(a.due), `${yesNo(a.verified)}${a.verification ? ` · ${a.verification}` : ""}`]));
    else lines("");

    h1("d6");
    const d6 = r.d6.actions.filter((a) => a.text.trim());
    if (d6.length) grid([tx("Implementation step"), tx("Owner"), tx("Date"), tx("Status")], d6.map((a) => [a.text, a.owner, a.due && showDate(a.due), actionStatus(a.status)]));
    const v = validation(r.d6);
    if (v.before && v.after) pairLine(tx("Validation"), validationLine(v));
    if (r.d6.period) pairLine(tx("Period"), r.d6.period);
    if (r.d6.result) pairLine(tx("Result"), r.d6.result);
    pairLine(tx("Containment removed"), r.d6.containmentRemoved ? showDate(r.d6.containmentRemoved) : tx("not yet"));

    h1("d7");
    grid([tx("System change"), tx("What changes"), tx("Owner"), tx("Due date"), tx("Status")], [
      ...r.d7.lines.filter((l) => l.text.trim()).map((l) => [preventionName(l.kind), l.text, l.owner, l.due && showDate(l.due), actionStatus(l.status)]),
      ...PREVENTION_KINDS.filter((kind) => !r.d7.lines.some((l) => l.kind === kind && l.text.trim())).map((kind) => [preventionName(kind), tx("Not addressed yet"), "", "", ""]),
    ]);

    h1("d8");
    pairLine(tx("Recognition"), r.d8.recognition);
    pairLine(tx("Lessons learned"), r.d8.lessons);
    pairLine(tx("Closed by"), r.d8.closedBy);
    pairLine(tx("Closed on"), closedOn(r) ? showDate(closedOn(r)) : tx("not yet"));
    return kit.wordFile({ body, font: "Arial", accent: "0a6ab0", lang: LANG, title: `8D · ${titleOf(r)}`, creator: r.d1.leader });
  };
  const fileSlug = (r) => (String(nameOf(r)).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "report");
  const saveBytes = (name, bytes, type) => {
    const link = el("a");
    link.href = URL.createObjectURL(new Blob([bytes], { type }));
    link.download = name;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  };

  // The overview as a table, for the CSV and the Excel file: header row first.
  const overviewRows = () => {
    const day = today();
    const o = overview(state.reports, state.targets, day);
    return [
      [tx("Title"), tx("Reference"), tx("Customer"), tx("Opened"), tx("Status"), tx("In discipline"), tx("Days open"), tx("Days to containment"), tx("Days to close"), tx("Overdue"), tx("Closed on")],
      ...o.items.map((i) => [i.title, i.ref, i.customer, i.opened, i.closed ? tx("Closed") : tx("Open"), stepCode(i.step), i.age ?? "", i.toContainment ?? "", i.toClose ?? "", i.overdue.map(stepCode).join(" "), i.closedOn]),
    ];
  };
  Object.assign(window.EightDMath, { asText, buildSheet, wordFile, overviewRows });

  // The example note ---------------------------------------------------------------------------------------------------
  const exampleNote = el("div", "dl-example-note");
  exampleNote.setAttribute("role", "status");
  exampleNote.hidden = true;
  const clearExample = el("button", "button-ghost", tx("Clear the example"));
  clearExample.type = "button";
  exampleNote.append(el("strong", null, tx("Example")), " ", el("span", null, tx("This is an example, so you can see what the tool shows. Change it to make it yours, start a new report, or clear it now.")), " ", clearExample);
  root.prepend(exampleNote);

  // The form ---------------------------------------------------------------------------------------------------------
  const getPath = (target, path) => path.split(".").reduce((o, key) => (o === null || o === undefined ? undefined : o[key]), target);
  const setPath = (target, path, value) => {
    const keys = path.split(".");
    const last = keys.pop();
    const holder = keys.reduce((o, key) => (o === null || o === undefined ? undefined : o[key]), target);
    if (holder && typeof holder === "object") holder[last] = value;
  };
  const fields = [...form.querySelectorAll("[data-f]")];
  const fillFields = () => {
    const r = current();
    fields.forEach((node) => {
      const value = r ? getPath(r, node.dataset.f) : undefined;
      if (node.type === "checkbox") node.checked = value === true;
      else node.value = value ?? (node.dataset.f === "opened" ? today() : node.tagName === "SELECT" ? node.options[0]?.value || "" : "");
    });
  };

  // Rows of the lists: the team, the containment, the corrective actions, the implementation and the prevention.
  const options = (pairs) => pairs.map(([value, label]) => { const o = el("option", null, label); o.value = value; return o; });
  const ACTION_OPTIONS = () => options(ACTION_STATUSES.map((s) => [s, actionStatus(s)]));
  const ROWS = {
    "d1.members": { fields: [["name", tx("Name"), "text", "", "person"], ["role", tx("Role or function"), "text"]], blank: () => ({ name: "", role: "" }), label: tx("Member") },
    "d3.actions": { stage: "d3", fields: [["text", tx("Containment action"), "text", "wide", "containment"], ["where", tx("Where is the suspect stock?"), () => options(cfg.locations.map((l) => [l.key, l.name]))], ["owner", tx("Owner"), "text"], ["date", tx("Date"), "date"], ["status", tx("Status"), ACTION_OPTIONS], ["sorted", tx("Checked or sorted"), "number"], ["found", tx("Defects found"), "number"], ["verified", tx("Verification of effectiveness"), "text", "span2", "verification"]], blank: () => ({ text: "", owner: "", date: today(), where: cfg.locations[0]?.key || "", sorted: "", found: "", verified: "", status: "open" }), label: tx("Containment action") },
    "d5.actions": { stage: "d5", fields: [["text", tx("Permanent corrective action"), "text", "wide", "pca"], ["addresses", tx("Removes"), () => options(ADDRESSES.map((a) => [a, addressName(a)]))], ["owner", tx("Owner"), "text"], ["due", tx("Due date"), "date"], ["status", tx("Status"), ACTION_OPTIONS], ["verification", tx("Verified before implementation by"), "text", "span2", "pcaCheck"], ["verified", tx("It works: verified"), "checkbox"]], blank: () => ({ text: "", addresses: "occurrence", owner: "", due: "", verification: "", verified: false, status: "open" }), label: tx("Permanent corrective action") },
    "d6.actions": { stage: "d6", fields: [["text", tx("Implementation step"), "text", "wide", "implementation"], ["owner", tx("Owner"), "text"], ["due", tx("Date"), "date"], ["status", tx("Status"), ACTION_OPTIONS]], blank: () => ({ text: "", owner: "", due: "", status: "open" }), label: tx("Implementation step") },
    "d7.lines": { stage: "d7", fields: [["text", tx("What changes"), "text", "wide", "prevention"], ["kind", tx("System change"), () => options(cfg.preventions.map((p) => [p.key, p.name]))], ["owner", tx("Owner"), "text"], ["due", tx("Due date"), "date"], ["status", tx("Status"), ACTION_OPTIONS]], blank: () => ({ kind: "other", text: "", owner: "", due: "", status: "open" }), label: tx("System change") },
  };
  const stageLabels = (r, stage, row) => ({
    heading: heading(stage),
    extra: stage === "d5" ? addressName(row.addresses) : stage === "d7" ? preventionName(row.kind) : "",
    check: stage === "d6" || stage === "d7" ? (validation(r.d6).after ? validationLine(validation(r.d6)) : "") : "",
  });
  const renderRows = (path) => {
    const spec = ROWS[path];
    const box = form.querySelector(`[data-rows="${path}"]`);
    if (!spec || !box) return;
    const r = current();
    const list = r ? getPath(r, path) : [];
    const slug = path.replace(".", "-");
    box.replaceChildren(...list.map((item, index) => {
      const row = el("div", `ed-row ed-row-${slug}`);
      row.dataset.row = path;
      row.dataset.index = String(index);
      spec.fields.forEach(([key, label, kind, wide, placeholder]) => {
        const id = `ed-${slug}-${key}-${index}`;
        const wrap = el("div", `field${wide ? ` ed-${wide}` : ""}${kind === "checkbox" ? " ed-check" : ""}`);
        let node;
        if (typeof kind === "function") {
          node = el("select");
          node.append(...kind());
          node.value = item[key];
          // A value this language's list does not know stays visible.
          if (node.value !== item[key] && item[key]) { const o = el("option", null, item[key]); o.value = item[key]; node.append(o); node.value = item[key]; }
        } else {
          node = el("input");
          node.type = kind === "number" ? "text" : kind;
          if (kind === "number") node.inputMode = "decimal";
          if (kind === "checkbox") node.checked = item[key] === true; else node.value = item[key] || "";
          if (kind === "text" || kind === "number") node.autocomplete = "off";
          if (placeholder && cfg.fields?.[placeholder]) node.placeholder = cfg.fields[placeholder];
        }
        node.id = id;
        node.dataset.k = key;
        const lab = el("label", null, `${label}${key === "text" || key === "name" ? ` ${index + 1}` : ""}`);
        lab.htmlFor = id;
        if (kind === "checkbox") wrap.append(node, " ", lab); else wrap.append(lab, node);
        row.append(wrap);
      });
      const tools = el("div", "ed-row-tools");
      if (spec.stage && S) {
        const link = S.linkButton(tx("Add to actions"), () => {
          const now = current();
          const rowNow = now ? getPath(now, path)?.[index] : null;
          return now && rowNow && rowNow.text.trim() ? actionPayload(now, spec.stage, rowNow, stageLabels(now, spec.stage, rowNow)) : null;
        }, "button-ghost ed-handoff");
        link.addEventListener("click", (event) => {
          const now = current();
          if (now && getPath(now, path)?.[index]?.text.trim()) return;
          event.preventDefault();
          flash(saveStatus, tx("Write the action first, then add it to the actions."));
        });
        tools.append(link);
      }
      const remove = el("button", "button-ghost ed-remove", tx("Remove"));
      remove.type = "button";
      remove.dataset.remove = "";
      remove.setAttribute("aria-label", `${tx("Remove")}: ${spec.label} ${index + 1}`);
      tools.append(remove);
      row.append(tools);
      return row;
    }));
  };
  const renderAllRows = () => Object.keys(ROWS).forEach(renderRows);
  // The discipline the report is in opens; the others stay folded, so a long report is one screen of work at a time.
  const discs = [...form.querySelectorAll("[data-disc]")];
  const openCurrent = () => {
    const r = current();
    const step = r ? currentStep(r) : "d0";
    discs.forEach((box) => { box.open = box.dataset.disc === step; });
  };
  const fillForm = () => { fillFields(); renderAllRows(); openCurrent(); };

  // Typing into an empty page starts a report: nobody has to press "New" first.
  const ensureCurrent = () => {
    let r = current();
    if (r) return r;
    r = blankReport(today());
    state.reports.unshift(r);
    state.current = r.id;
    return r;
  };
  const edited = (r) => {
    r.updated = today();
    // The first change to the example makes it this person's report; the note goes.
    if (state.example === r.id) state.example = "";
    save();
    renderAll();
  };
  const onInput = (event) => {
    const target = event.target;
    const row = target.closest?.("[data-row]");
    if (row && target.dataset.k) {
      const r = ensureCurrent();
      const item = getPath(r, row.dataset.row)?.[Number(row.dataset.index)];
      if (!item) return;
      const value = target.type === "checkbox" ? target.checked : target.value;
      if (item[target.dataset.k] === value) return;
      item[target.dataset.k] = value;
      edited(r);
      return;
    }
    const path = target.dataset?.f;
    if (!path) return;
    const r = ensureCurrent();
    const value = target.type === "checkbox" ? target.checked : target.value;
    if (getPath(r, path) === value) return;
    setPath(r, path, value);
    // A discipline marked done gets today's date when it has none, so its days count at once.
    const step = path.match(/^steps\.(d\d)\.status$/);
    if (step && value === "done" && !r.steps[step[1]].date) {
      r.steps[step[1]].date = today();
      const dateField = form.querySelector(`[data-f="steps.${step[1]}.date"]`);
      if (dateField) dateField.value = r.steps[step[1]].date;
    }
    edited(r);
  };
  form.addEventListener("input", onInput);
  form.addEventListener("change", onInput);
  form.addEventListener("submit", (event) => event.preventDefault());
  form.addEventListener("click", (event) => {
    const add = event.target.closest?.("[data-add]");
    if (add) {
      const path = add.dataset.add;
      const r = ensureCurrent();
      const list = getPath(r, path);
      if (!Array.isArray(list) || !ROWS[path]) return;
      const item = ROWS[path].blank();
      // A new D7 line takes the first system not yet on the list.
      if (path === "d7.lines") item.kind = PREVENTION_KINDS.find((kind) => !list.some((l) => l.kind === kind)) || "other";
      list.push(item);
      edited(r);
      renderRows(path);
      const inputs = form.querySelectorAll(`[data-rows="${path}"] [data-k="${path === "d7.lines" ? "text" : Object.keys(item)[0]}"]`);
      inputs[inputs.length - 1]?.focus();
      return;
    }
    const remove = event.target.closest?.("[data-remove]");
    if (!remove) return;
    const row = remove.closest("[data-row]");
    const r = current();
    if (!r || !row) return;
    const path = row.dataset.row;
    const list = getPath(r, path);
    const index = Number(row.dataset.index);
    const [gone] = list.splice(index, 1);
    edited(r);
    renderRows(path);
    undoNote(saveStatus, tx("Removed: {text}", { text: gone.text || gone.name || ROWS[path].label }), () => {
      list.splice(Math.min(index, list.length), 0, gone);
      edited(r);
      renderRows(path);
    });
  });

  // Notes under the disciplines: the target, what D0 and D2 say, the containment and the validation numbers.
  const renderNotes = (r) => {
    const day = today();
    const marks = r ? new Map(deadlines(r, state.targets, day).map((d) => [d.key, d])) : new Map();
    form.querySelectorAll("[data-disc-state]").forEach((node) => {
      const s = r?.steps[node.dataset.discState];
      const d = marks.get(node.dataset.discState);
      node.textContent = s ? `${SIGN[s.status]} ${stepStatus(s.status)}${s.date ? ` · ${showDate(s.date)}` : ""}${d?.state === "overdue" ? ` · ${tx("overdue")}` : d?.state === "late" ? ` · ${tx("late")}` : ""}` : "";
      node.classList.toggle("is-late", Boolean(d && (d.state === "overdue" || d.state === "late")));
    });
    form.querySelectorAll("[data-due]").forEach((node) => {
      const d = marks.get(node.dataset.due);
      node.textContent = d ? deadlineText(d) : "";
      node.classList.toggle("is-late", Boolean(d && (d.state === "overdue" || d.state === "late")));
    });
    const set = (selector, value) => { const node = form.querySelector(selector); if (node) node.textContent = value; };
    if (!r) { ["[data-d0-verdict]", "[data-w2h-note]", "[data-isnot-note]", "[data-d3-note]", "[data-d6-note]", "[data-gaps]"].forEach((s) => set(s, "")); return; }
    const k = criteriaCheck(r);
    set("[data-d0-verdict]", `${tx("{met} of {total} criteria met.", { met: k.met, total: k.total })} ${k.warranted ? tx("An 8D is warranted.") : k.met ? tx("Not all criteria met: check whether a simpler method, a 5 Whys or an A3, is enough.") : ""}`.trim());
    const w = w2hCheck(r.d2.w);
    const missing = w.missing.map((key) => cfg.w2h.find((q) => q.key === key)?.label || key);
    set("[data-w2h-note]", [tx("5W2H: {n} of {total} answered.", { n: w.filled, total: w.total }), missing.length ? `${tx("Missing")}: ${missing.join(" · ")}` : "", !w.missing.includes("howMany") && !w.howManyNumber ? tx("How many needs a number.") : ""].filter(Boolean).join(" "));
    const t = isNotCheck(r.d2.isNot);
    const label = (key) => cfg.isNot.find((row) => row.key === key)?.label || key;
    set("[data-isnot-note]", [tx("IS / IS NOT: {n} of {total} rows complete.", { n: t.completeRows, total: t.total }), t.same.length ? tx("IS and IS NOT say the same in: {rows}.", { rows: t.same.map(label).join(", ") }) : ""].filter(Boolean).join(" "));
    const c = containment(r.d3);
    set("[data-d3-note]", c.sorted ? tx("Checked {sorted}, found {found} ({rate}).", { sorted: count(c.sorted), found: count(c.found), rate: share(c.rate) }) : "");
    const v = validation(r.d6);
    set("[data-d6-note]", v.before && v.after ? validationLine(v) : v.before ? tx("Before {rate}. Give the numbers after the change to validate.", { rate: share(v.before.rate) }) : "");
  };

  const countLine = (o) => {
    const vars = { n: int.format(o.total), open: int.format(o.open), closed: int.format(o.closed), late: int.format(o.overdue) };
    return o.total === 1 ? tx("1 report: {open} open, {closed} closed, {late} overdue", vars) : tx("{n} reports: {open} open, {closed} closed, {late} overdue", vars);
  };

  // The list of reports (the overview in the panel) -------------------------------------------------------------------
  const open = (reportId) => {
    state.current = reportId;
    save();
    fillForm();
    renderAll();
  };
  const renderList = () => {
    const day = today();
    const o = overview(state.reports, state.targets, day);
    listBox.replaceChildren(...state.reports.map((r, index) => {
      const item = o.items[index];
      const li = el("li", "ed-item");
      if (r.id === state.current) li.setAttribute("aria-current", "true");
      const openButton = el("button", "ed-open", titleOf(r));
      openButton.type = "button";
      openButton.addEventListener("click", () => open(r.id));
      const where = item.closed ? `✓ ${tx("Closed")}` : `${tx("Open")} · ${stepCode(item.step)}`;
      const meta = el("span", "ed-item-meta", [r.ref, where, r.opened && showDate(r.opened), item.age !== null ? dayCount(item.age) : "", r.id === state.example ? tx("Example") : ""].filter(Boolean).join(" · "));
      li.append(openButton, meta);
      if (item.overdue.length) li.append(el("span", "ed-item-late", `! ${tx("Overdue: {list}.", { list: item.overdue.map(stepCode).join(", ") })}`));
      const tools = el("span", "ed-item-tools");
      const dup = el("button", "button-ghost", tx("Duplicate"));
      dup.type = "button";
      dup.setAttribute("aria-label", `${tx("Duplicate")}: ${titleOf(r)}`);
      dup.addEventListener("click", () => {
        const copyOf = cleanReport({ ...JSON.parse(JSON.stringify(r)), id: "", title: `${titleOf(r)} ${tx("(copy)")}`, updated: today() });
        state.reports.splice(index + 1, 0, copyOf);
        open(copyOf.id);
        flash(listStatus, tx("Duplicated: {text}", { text: titleOf(r) }));
      });
      const del = el("button", "button-ghost", tx("Delete"));
      del.type = "button";
      del.setAttribute("aria-label", `${tx("Delete")}: ${titleOf(r)}`);
      del.addEventListener("click", () => {
        const at = state.reports.findIndex((x) => x.id === r.id);
        if (at < 0) return;
        const [gone] = state.reports.splice(at, 1);
        const wasCurrent = state.current === gone.id;
        const wasExample = state.example === gone.id;
        if (wasExample) state.example = "";
        if (wasCurrent) state.current = state.reports[Math.min(at, state.reports.length - 1)]?.id || "";
        save();
        fillForm();
        renderAll();
        undoNote(listStatus, tx("Deleted: {text}", { text: titleOf(gone) }), () => {
          state.reports.splice(Math.min(at, state.reports.length), 0, gone);
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
    listBox.hidden = !state.reports.length;
    listEmpty.hidden = state.reports.length > 0;
    exampleAgain.hidden = !state.reports.length || Boolean(state.example);
    listCount.textContent = !o.total ? "" : countLine(o);
  };

  // Results ---------------------------------------------------------------------------------------------------------
  const STATE_WORDS = { ok: tx("in time"), late: tx("late"), overdue: tx("overdue"), open: tx("still open"), done: tx("done"), none: "" };
  const deadlineChart = (r) => {
    if (!CK || !r.opened) return null;
    const day = today();
    const items = deadlines(r, state.targets, day).filter((d) => d.state !== "none" && d.state !== "done").map((d) => {
      const value = d.days !== null ? Math.max(0, d.days) : Math.max(0, daysBetween(r.opened, day));
      const color = d.state === "ok" || d.state === "done" ? CK.C.ok : d.state === "late" || d.state === "overdue" ? CK.C.danger : CK.C.soft;
      return { label: `${discipline(d.key).code} ≤ ${d.target}`, value, color, tip: `${heading(d.key)}\n${deadlineText(d)}` };
    });
    if (!items.length) return null;
    const svg = CK.bars(items, { title: tx("Days from opening to each discipline, against its target"), unit: tx("days"), format: (v) => int.format(Math.round(v)) });
    const fig = CK.figure(svg, { fileName: `8d-${fileSlug(r)}`, caption: tx("Each column: the days from the opening date until the discipline was done, or until today while it is open. The label gives the target.") });
    fig.append(CK.legend([{ label: tx("Done in time"), color: CK.C.ok }, { label: tx("Late or overdue"), color: CK.C.danger }, { label: tx("Still open, in time"), color: CK.C.soft }]));
    return fig;
  };
  const overviewPanel = () => {
    const day = today();
    const o = overview(state.reports, state.targets, day);
    const box = panel(tx("All 8D reports"), countLine(o));
    const stats = el("div", "dl-stats ed-overview-stats");
    stats.append(
      stat(tx("Open"), int.format(o.open), o.oldest !== null ? `${tx("oldest")} ${dayCount(o.oldest)}` : ""),
      stat(tx("Overdue"), int.format(o.overdue), o.overdue ? tx("past a target time") : tx("all in time")),
      stat(tx("Average days to containment"), o.avgContainment === null ? "–" : num(o.avgContainment, 1), `${tx("target")} ≤ ${dayCount(state.targets.d3)}`),
      stat(tx("Average days to close"), o.avgClose === null ? "–" : num(o.avgClose, 1), `${tx("target")} ≤ ${dayCount(state.targets.d8)}`),
    );
    box.append(stats);
    if (CK) {
      const items = [...STEPS, "closed"].map((key) => ({ label: stepCode(key), value: o.byStep[key], color: key === "closed" ? CK.C.muted : CK.C.blue, tip: `${key === "closed" ? tx("Closed") : heading(key)}: ${int.format(o.byStep[key])}` }));
      box.append(CK.figure(CK.bars(items, { title: tx("Reports by the discipline they are in"), unit: tx("reports") }), { fileName: "8d-by-discipline" }));
      const open = o.items.filter((i) => !i.closed && i.age !== null);
      if (open.length) {
        const ages = open.map((i) => ({ label: i.ref || i.title || "8D", value: i.age, color: i.overdue.length ? CK.C.danger : CK.C.blue, tip: `${i.title || "8D"}\n${dayCount(i.age)} · ${stepCode(i.step)}${i.overdue.length ? ` · ${tx("Overdue: {list}.", { list: i.overdue.map(stepCode).join(", ") })}` : ""}` }));
        box.append(CK.figure(CK.bars(ages, { title: tx("Age of the open reports in days"), unit: tx("days"), target: state.targets.d8, targetLabel: tx("Close by"), highlight: () => false }), { fileName: "8d-age", caption: tx("The line is the target time to close. A column in the alert colour has a discipline overdue.") }));
      }
    }
    return box;
  };
  const gapsPanel = (r) => {
    const g = gaps(r);
    const box = panel(tx("What each discipline still needs"), tx("The rules of a complete 8D, discipline by discipline."));
    const list = el("ul", "ed-gaps");
    STEPS.forEach((key) => {
      const missing = g[key];
      const li = el("li", missing.length ? "is-open" : "is-ok");
      li.append(el("strong", null, `${missing.length ? "!" : "✓"} ${discipline(key).code}`), " ", missing.length ? missing.map(gapText).join(" ") : tx("Complete."));
      list.append(li);
    });
    box.append(list);
    return box;
  };
  const containmentPanel = (r) => {
    const c = containment(r.d3);
    if (!c.sorted) return null;
    const box = panel(tx("Containment by place"), tx("Checked {sorted}, found {found} ({rate}).", { sorted: count(c.sorted), found: count(c.found), rate: share(c.rate) }));
    box.append(table([tx("Suspect stock"), tx("Checked"), tx("Found"), tx("Share found")], c.places.map((p) => [placeName(p.where), count(p.sorted), count(p.found), share(p.sorted ? p.found / p.sorted : null)])));
    return box;
  };

  const sendAll = (r, status) => {
    if (!S) return;
    const items = allActions(r);
    if (!items.length) { flash(status, tx("Write the action first, then add it to the actions.")); return; }
    const known = S.list();
    let added = 0;
    items.forEach(({ stage, row }) => {
      const payload = actionPayload(r, stage, row, stageLabels(r, stage, row));
      if (known.some((a) => a.source === "eight-d" && a.title === payload.title && a.detail === payload.detail)) return;
      if (S.add(payload)) added += 1;
    });
    const link = el("a", "inline-link", tx("Open the Action Tracker"));
    link.href = S.trackerUrl().href;
    status.replaceChildren(`${added ? (added === 1 ? tx("1 action sent to the Action Tracker.") : tx("{n} actions sent to the Action Tracker.", { n: int.format(added) })) : tx("Already on the list.")} `, link);
  };

  const renderResults = () => {
    const r = current();
    results.replaceChildren();
    results.hidden = !r;
    if (!r) return;
    const day = today();
    const head = el("div", "result-head");
    head.append(el("p", "result-label", tx("Your 8D report")), el("h2", null, titleOf(r)), el("p", null, verdict(r)));
    const late = overdue(r, state.targets, day);
    const d3 = deadlines(r, state.targets, day).find((d) => d.key === "d3");
    const d8 = deadlines(r, state.targets, day).find((d) => d.key === "d8");
    const stats = el("div", "dl-stats");
    stats.append(
      stat(tx("Days open"), daysOpen(r, day) === null ? "–" : int.format(daysOpen(r, day)), r.opened ? `${tx("since")} ${showDate(r.opened)}` : tx("Give the opening date")),
      stat(tx("Days to containment"), daysToContainment(r) === null ? "–" : int.format(daysToContainment(r)), d3 ? `${tx("target")} ≤ ${dayCount(d3.target)}${STATE_WORDS[d3.state] ? ` · ${STATE_WORDS[d3.state]}` : ""}` : ""),
      stat(tx("Days to close"), daysToClose(r) === null ? "–" : int.format(daysToClose(r)), d8 ? `${tx("target")} ≤ ${dayCount(d8.target)}${d8.left !== null && d8.left >= 0 ? ` · ${tx("{left} left", { left: dayCount(d8.left) })}` : STATE_WORDS[d8.state] ? ` · ${STATE_WORDS[d8.state]}` : ""}` : ""),
      stat(tx("In discipline"), stepCode(currentStep(r)), isClosed(r) ? "" : discipline(currentStep(r)).title),
      stat(tx("Overdue"), late.length ? late.map(stepCode).join(", ") : "0", late.length ? tx("past their target time") : tx("all in time")),
    );
    // The disciplines as a row of marks: the sign and the word carry the state, the colour only repeats it.
    const chips = el("ul", "ed-chips");
    chips.setAttribute("aria-label", tx("Status per discipline"));
    STEPS.forEach((key) => {
      const s = r.steps[key];
      const chip = el("li", `ed-chip is-${s.status}`, `${SIGN[s.status]} ${discipline(key).code}`);
      chip.title = `${heading(key)}: ${stepStatus(s.status)}${s.date ? ` · ${showDate(s.date)}` : ""}`;
      chips.append(chip);
    });
    const timeline = el("div", "ed-timeline");
    timeline.append(chips);
    const chart = deadlineChart(r);
    if (chart) timeline.append(chart);

    const actions = el("div", "tool-actions result-actions");
    const copyButton = el("button", "button-primary", tx("Copy summary"));
    copyButton.type = "button";
    copyButton.addEventListener("click", () => copy(asText(r), copyButton));
    const printButton = el("button", "button-secondary", tx("Print or save as PDF"));
    printButton.type = "button";
    printButton.addEventListener("click", () => window.print());
    const wordButton = el("button", "button-secondary", tx("Download Word"));
    wordButton.type = "button";
    wordButton.hidden = !window.DocxKit;
    wordButton.addEventListener("click", () => { const bytes = wordFile(r); if (bytes) saveBytes(`8d-${fileSlug(r)}-${today()}.docx`, bytes, "application/vnd.openxmlformats-officedocument.wordprocessingml.document"); });
    const sendStatus = el("p", "form-note ed-send-status");
    sendStatus.setAttribute("aria-live", "polite");
    const sendButton = el("button", "button-secondary", tx("Send all actions to the Action Tracker"));
    sendButton.type = "button";
    sendButton.hidden = !S;
    sendButton.addEventListener("click", () => sendAll(r, sendStatus));
    const whys = el("a", "button-ghost", tx("Take it to 5 Whys"));
    const whysUrl = new URL($("[data-five-whys]")?.getAttribute("href") || "../five-whys/", location.href);
    const problem = (r.d2.statement.trim() || r.title.trim()).slice(0, 300);
    if (problem) whysUrl.searchParams.set("problem", problem);
    whys.href = whysUrl.href;
    actions.append(copyButton, printButton, wordButton, sendButton, whys, sendStatus);

    resultLayout(results, { head, stats, notes: [timeline], focus: buildSheet(r), actions, panels: [overviewPanel(), gapsPanel(r), containmentPanel(r)].filter(Boolean) });
  };

  const renderAll = () => {
    const r = current();
    exampleNote.hidden = !state.example || state.example !== state.current;
    renderList();
    renderNotes(r);
    renderResults();
  };

  // Target times -----------------------------------------------------------------------------------------------------
  root.querySelectorAll("[data-target]").forEach((input) => {
    input.value = String(state.targets[input.dataset.target]);
    input.addEventListener("input", () => {
      const value = Number(input.value);
      if (!Number.isInteger(value) || value < 0 || value > 999) return;
      state.targets = cleanTargets({ ...state.targets, [input.dataset.target]: value });
      save();
      renderAll();
    });
  });
  $("[data-targets-reset]")?.addEventListener("click", () => {
    state.targets = cleanTargets(cfg.targets);
    root.querySelectorAll("[data-target]").forEach((input) => { input.value = String(state.targets[input.dataset.target]); });
    save();
    renderAll();
  });

  // Imports from 5 Whys and Fishbone, offered only when this browser has their work in this language.
  const suffix = LANG === "en" ? "" : `-${LANG}`;
  const importStatus = $("[data-import-status]");
  const whysSaved = () => whysText(read(`sc-five-whys${suffix}`, null), { problem: tx("Problem"), why: tx("Why {n}"), cause: tx("Root cause"), action: tx("Countermeasure") });
  const fishSaved = () => fishboneText(read(`sc-fishbone${suffix}`, null), cfg.fishboneSets, { effect: tx("Effect"), likely: tx("likely"), vote: tx("vote"), votes: tx("votes") });
  const importInto = (found, source) => {
    if (!found) { flash(importStatus, tx("Nothing saved in {tool} in this browser yet.", { tool: source })); return; }
    const r = ensureCurrent();
    const block = `${source}:\n${found}`;
    if (r.d4.notes.includes(found)) { flash(importStatus, tx("Already in the notes.")); return; }
    r.d4.notes = r.d4.notes.trim() ? `${r.d4.notes.trim()}\n\n${block}` : block;
    const notes = form.querySelector('[data-f="d4.notes"]');
    if (notes) notes.value = r.d4.notes;
    edited(r);
    flash(importStatus, tx("Taken from {tool} into the analysis notes. The worksheet itself is unchanged.", { tool: source }));
  };
  const whysButton = $("[data-from-whys]");
  const fishButton = $("[data-from-fishbone]");
  const syncImports = () => {
    if (whysButton) whysButton.hidden = !whysSaved();
    if (fishButton) fishButton.hidden = !fishSaved();
  };
  whysButton?.addEventListener("click", () => importInto(whysSaved(), tx("5 Whys")));
  fishButton?.addEventListener("click", () => importInto(fishSaved(), tx("Fishbone")));

  // Buttons ----------------------------------------------------------------------------------------------------------
  const loadExample = () => {
    const existing = state.reports.find((r) => r.id === state.example);
    if (existing) { open(existing.id); return; }
    const r = exampleReport(cfg.example, today());
    state.reports.unshift(r);
    state.example = r.id;
    open(r.id);
  };
  root.querySelectorAll("[data-example], [data-example-again]").forEach((button) => button.addEventListener("click", () => {
    loadExample();
    results.scrollIntoView?.({ behavior: "smooth", block: "start" });
  }));
  clearExample.addEventListener("click", () => {
    const at = state.reports.findIndex((r) => r.id === state.example);
    if (at >= 0) state.reports.splice(at, 1);
    if (state.current === state.example) state.current = state.reports[0]?.id || "";
    state.example = "";
    save();
    fillForm();
    renderAll();
  });
  $("[data-new]").addEventListener("click", () => {
    const r = blankReport(today());
    state.reports.unshift(r);
    open(r.id);
    form.querySelector('[data-f="title"]')?.focus();
  });
  $("[data-csv]")?.addEventListener("click", () => { if (state.reports.length) downloadCsv("8d-reports", overviewRows()); });
  $("[data-xlsx]")?.addEventListener("click", () => { if (state.reports.length) downloadXlsx("8d-reports", overviewRows(), { sheet: "8D" }); });

  // Another tab changed the saved reports, or 5 Whys and Fishbone their work.
  window.addEventListener("storage", (event) => {
    if (event.key === `sc-five-whys${suffix}` || event.key === `sc-fishbone${suffix}`) { syncImports(); return; }
    if (event.key !== cfg.storageKey) return;
    const next = read(cfg.storageKey, null);
    if (!isObject(next) || !Array.isArray(next.reports)) return;
    state.reports = next.reports.filter(isObject).map(cleanReport);
    state.current = str(next.current);
    state.example = state.reports.some((r) => r.id === str(next.example)) ? str(next.example) : "";
    state.targets = cleanTargets(next.targets);
    fillForm();
    renderAll();
  });

  // Start: a ?problem= from another tool opens a new report on it (once); a first visit opens on the example.
  const params = new URLSearchParams(location.search);
  const incoming = params.get("problem")?.trim();
  if (incoming) {
    const r = blankReport(today());
    r.title = incoming.length > 140 ? `${incoming.slice(0, 139)}…` : incoming;
    r.d2.statement = incoming;
    state.reports.unshift(r);
    state.current = r.id;
    save();
    params.delete("problem");
    history.replaceState(null, "", location.pathname + (params.size ? `?${params}` : "") + location.hash);
  } else if (firstVisit(cfg.storageKey)) {
    const r = exampleReport(cfg.example, today());
    state.reports.push(r);
    state.example = r.id;
    state.current = r.id;
    save();
  } else if (!current() && state.reports.length) {
    state.current = state.reports[0].id;
  }
  syncImports();
  fillForm();
  renderAll();
})();
