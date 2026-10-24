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
  // what the slots before it ran at, and above says that the latest is clearly worse, by the rule of the Sigma &
  // Control Chart: beyond three sigma of the usual level (a c-chart for a count, a p-chart for a share, at the latest
  // slot's own volume), and always at least two entries. A high day inside those limits is noise, not a signal.
  const level = (slots, counts, totals, present) => {
    const index = counts.map((count, i) => i).filter(present).pop();
    if (index === undefined) return { latest: null, usual: null, usualShare: null, limit: null, above: false };
    const before = counts.slice(0, index);
    const usual = before.some((count) => count > 0) ? sum(before) / before.length : null;
    if (!totals) {
      const limit = usual === null ? null : usual + 3 * Math.sqrt(usual);
      return { latest: { key: slots[index], count: counts[index], share: null }, usual, usualShare: null, limit, above: limit !== null && counts[index] >= 2 && counts[index] > limit };
    }
    const base = sum(totals.slice(0, index));
    const usualShare = base > 0 ? sum(before) / base : null;
    const latestShare = totals[index] > 0 ? counts[index] / totals[index] : null;
    const limit = usualShare === null || latestShare === null ? null : usualShare + 3 * Math.sqrt((usualShare * (1 - usualShare)) / totals[index]);
    return {
      latest: { key: slots[index], count: counts[index], share: latestShare },
      usual,
      usualShare,
      limit,
      above: limit !== null && counts[index] >= 2 && latestShare > limit,
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
      // With a volume, a damage-free run before the latest day is no base for a share: no flag then.
      const found = level(slots, counts, totals, (i) => counts[i] > 0);
      if (totals && !counts.slice(0, counts.findLastIndex((count) => count > 0)).some((count) => count > 0)) found.above = false;
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
    // With only some routes logged (often the late ones), a share of the logged routes would read far worse than the
    // day was: late routes are counted, as in the Delay Analyzer's hours and shifts.
    const partial = Boolean(kit.partialRouteLog?.(delay));
    const found = level(slots, lateSlots, partial ? null : routeSlots, (i) => routeSlots[i] > 0);
    const onTimeTarget = share(delay.target);

    return {
      unit,
      days: list,
      slots,
      damage: counted(logs.damage),
      incomplete: counted(logs.incomplete),
      delay: {
        routes: routes.length,
        partial,
        late: sum(lateSlots),
        onTime: routes.length && !partial ? 1 - sum(lateSlots) / routes.length : null,
        values: lateSlots,
        routesBySlot: routeSlots,
        ...found,
        // The on-time target is a ceiling for the late share.
        lateTarget: onTimeTarget && !partial ? 1 - onTimeTarget : null,
      },
    };
  };
  // The tools that joined later (Safety Cross, OEE, Action Tracker, 5S Audit), read from what they save. Each one
  // gets its own function, so compute() and the numbers of the three logs stay exactly as they were.
  const isIso = (value) => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
  const isObj = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
  const fold = (text) => String(text ?? "").trim().toLowerCase();
  const positive = (value) => (Number.isFinite(Number(value)) && Number(value) > 0 ? Number(value) : 0);
  const between = (from, to) => Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86400000);
  const slotting = (from, to, unit) => {
    const slotOf = unit === "week" ? kit.mondayOf : (day) => day;
    const slots = [...new Set(days(from, to).map(slotOf))];
    const at = new Map(slots.map((slot, i) => [slot, i]));
    return { slots, indexOf: (day) => at.get(slotOf(day)) };
  };
  const listOf = (value) => (Array.isArray(value) ? value : []);
  const latestOf = (list, present) => list.map((value, i) => i).filter(present).pop() ?? -1;

  // Safety Cross: accidents (with and without lost time), first aid, and near misses with unsafe conditions and acts,
  // per slot. Days since the last accident count to the end of the period over the whole log and every shift: an
  // accident is the site's, not one shift's.
  const ACCIDENTS = ["lost-time", "no-lost-time"];
  const NEAR = ["near-miss", "unsafe-condition", "unsafe-act"];
  const safety = (log, { from, to, shift = "", unit = "day" }) => {
    const { slots, indexOf } = slotting(from, to, unit);
    const rows = listOf(log?.rows).filter((row) => isObj(row) && isIso(row.date));
    const zero = () => slots.map(() => 0);
    const accidents = zero(), firstAid = zero(), nearMisses = zero(), logged = zero();
    rows.filter((row) => row.date >= from && row.date <= to && (!shift || row.shift === shift)).forEach((row) => {
      const i = indexOf(row.date);
      logged[i]++;
      if (ACCIDENTS.includes(row.type)) accidents[i]++;
      else if (row.type === "first-aid") firstAid[i]++;
      else if (NEAR.includes(row.type)) nearMisses[i]++;
    });
    const events = slots.map((slot, i) => accidents[i] + firstAid[i] + nearMisses[i]);
    const index = latestOf(logged, (i) => logged[i] > 0);
    const lastAccident = rows.filter((row) => ACCIDENTS.includes(row.type) && row.date <= to).map((row) => row.date).sort().at(-1) || null;
    return {
      slots, accidents, firstAid, nearMisses, events,
      totals: { accidents: sum(accidents), firstAid: sum(firstAid), nearMisses: sum(nearMisses), entries: sum(logged) },
      latest: index < 0 ? null : { key: slots[index], accidents: accidents[index], firstAid: firstAid[index], nearMisses: nearMisses[index] },
      accident: index >= 0 && accidents[index] > 0,
      lastAccident,
      daysSince: lastAccident ? between(lastAccident, to) : null,
    };
  };

  // OEE, the way the OEE tool counts it (js/oee.js, OeeMath.entry and combine), without loading that tool: planned
  // stops leave the planned time, breakdowns and setup the run time (scaled down when they exceed it), performance is
  // the ideal time of the pieces over the run time, capped at 100 %, quality the good pieces over all. Several entries
  // add up by time, so a long shift weighs more than a short one. A machine without an ideal rate has no OEE.
  const OEE_TARGET = 0.85;
  const oeeTarget = (value) => {
    const n = Number(value);
    return Number.isFinite(n) && n > 0 ? (n > 1 ? n / 100 : n) : OEE_TARGET;
  };
  const oeeEntry = (row, cycle, reasons = []) => {
    const lossOf = (reason) => reasons.find((r) => fold(r.name) === fold(reason))?.loss || "breakdowns";
    const logged = { breakdowns: 0, setup: 0, planned: 0 };
    (Array.isArray(row.stops) ? row.stops : []).filter(isObj).forEach((stop) => {
      const loss = lossOf(stop.reason);
      if (loss in logged) logged[loss] += positive(stop.minutes);
    });
    const ppt = Math.max(0, positive(row.planned) - logged.planned);
    const down = Math.min(ppt, logged.breakdowns + logged.setup);
    const run = ppt - down;
    const total = Math.round(positive(row.pieces));
    const good = total - Math.min(total, Math.round(positive(row.rejects)));
    if (!(cycle > 0)) return null;
    const performance = run > 0 ? Math.min(1, (total * cycle) / 60 / run) : 0;
    const atSpeed = run * performance;
    return { ppt, run, atSpeed, valuable: atSpeed * (total > 0 ? good / total : 1) };
  };
  const oeeCombine = (entries) => {
    const total = (key) => entries.reduce((s, e) => s + e[key], 0);
    const ppt = total("ppt"), run = total("run"), atSpeed = total("atSpeed"), valuable = total("valuable");
    return {
      n: entries.length,
      availability: ppt > 0 ? run / ppt : null,
      performance: run > 0 ? atSpeed / run : null,
      quality: atSpeed > 0 ? valuable / atSpeed : null,
      oee: ppt > 0 ? valuable / ppt : null,
    };
  };
  // saved: { equipment: [{ name, rate (pieces per hour) or cycle (seconds) }], rows: [{ date, shift, equipment,
  // planned, stops: [{ reason, minutes }], pieces, rejects }] }; reasons: the OEE tool's list ({ name, loss }).
  const oee = (saved, { from, to, shift = "", unit = "day", target } = {}, reasons = []) => {
    const { slots, indexOf } = slotting(from, to, unit);
    const machines = listOf(saved?.equipment).filter(isObj);
    const cycleOf = (name) => {
      const machine = machines.find((m) => fold(m.name) === fold(name));
      if (!machine) return null;
      if (Number(machine.rate) > 0) return 3600 / Number(machine.rate);
      return Number(machine.cycle) > 0 ? Number(machine.cycle) : null;
    };
    const rows = listOf(saved?.rows).filter((row) => isObj(row) && isIso(row.date) && row.date >= from && row.date <= to && (!shift || row.shift === shift) && positive(row.planned) > 0);
    const bySlot = slots.map(() => []);
    const rated = [];
    rows.forEach((row) => {
      const e = oeeEntry(row, cycleOf(row.equipment), reasons);
      if (!e) return;
      bySlot[indexOf(row.date)].push(e);
      rated.push(e);
    });
    const perSlot = bySlot.map(oeeCombine);
    const index = latestOf(perSlot, (i) => perSlot[i].oee !== null);
    const goal = oeeTarget(target);
    const latest = index < 0 ? null : { key: slots[index], ...perSlot[index] };
    return {
      slots,
      values: perSlot.map((s) => s.oee),
      perSlot,
      period: oeeCombine(rated),
      latest,
      entries: rows.length,
      unrated: rows.length - rated.length,
      target: goal,
      below: Boolean(latest) && latest.oee < goal - 1e-9,
    };
  };

  // Action Tracker (sc-actions, one list in every language): open means open or doing; overdue is open with a due
  // date before today.
  const STATUSES = ["open", "doing", "done", "verified"];
  const actions = (saved, today) => {
    const list = (Array.isArray(saved?.rows) ? saved.rows : Array.isArray(saved) ? saved : [])
      .filter((row) => isObj(row) && typeof row.title === "string" && row.title.trim())
      .map((row) => ({ title: row.title.trim(), owner: typeof row.owner === "string" ? row.owner.trim() : "", due: isIso(row.due) ? row.due : "", status: STATUSES.includes(row.status) ? row.status : "open" }));
    const open = list.filter((row) => row.status === "open" || row.status === "doing");
    const overdue = open.filter((row) => row.due && row.due < today).sort((a, b) => a.due.localeCompare(b.due));
    return {
      total: list.length,
      open: open.length,
      doing: open.filter((row) => row.status === "doing").length,
      closed: list.length - open.length,
      overdue: overdue.length,
      dueToday: open.filter((row) => row.due === today).length,
      oldest: overdue[0] || null,
    };
  };

  // 5S Audit: the overall share of the latest audit, as the audit tool shows it: per S the mean of the answered
  // questions (0–4) over 4, then the mean of the S that have an answer, so each S weighs the same.
  const isScore = (value) => Number.isInteger(value) && value >= 0 && value <= 4;
  const fiveSOverall = (scores) => {
    const shares = Object.values(isObj(scores) ? scores : {}).map((list) => (Array.isArray(list) ? list.filter(isScore) : []))
      .filter((values) => values.length).map((values) => sum(values) / values.length / 4);
    return shares.length ? sum(shares) / shares.length : null;
  };
  const fiveS = (saved) => {
    const rows = listOf(saved?.rows).filter((row) => isObj(row) && isIso(row.date) && fiveSOverall(row.scores) !== null)
      .map((row, i) => ({ row, i })).sort((a, b) => a.row.date.localeCompare(b.row.date) || a.i - b.i).map(({ row }) => row);
    const last = rows.at(-1);
    if (!last) return null;
    const area = typeof last.area === "string" ? last.area.trim() : "";
    const ofArea = rows.filter((row) => (typeof row.area === "string" ? row.area.trim() : "") === area);
    const series = ofArea.slice(-12).map((row) => fiveSOverall(row.scores));
    return { date: last.date, area, overall: series.at(-1), previous: series.length > 1 ? series.at(-2) : null, series, audits: rows.length };
  };

  window.PulseMath = { minutesLate, compute, safety, oee, oeeTarget, actions, fiveS, fiveSOverall };

  const root = document.querySelector("[data-shift-pulse]");
  const dataEl = document.getElementById("shift-pulse-data");
  if (!root || !dataEl || !window.ToolKit) return;

  const { LANG, tx, int, pct, el, showDate, today, addDays, mondayOf, shareText, read, write, isObject, str, plural, dayMonth, trendFigure, trendShares, panel, copy } = window.ToolKit;
  const data = JSON.parse(dataEl.textContent);
  const SUFFIX = LANG === "en" ? "" : `-${LANG}`;
  const PREFS = `sc-shift-pulse${SUFFIX}`;
  const PERIODS = ["7", "14", "30", "w8", "w12"];
  const PARTIAL_NOTE = "Only some routes of the period are in the route log, so late routes are counted, not shown as a share.";
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

  // flag: the words of the tag when it is not "Above usual"; values: none for a card without a series.
  const card = ({ label, value, notes, values, highlight, above, flag, tool, linkText }) => {
    const box = el("article", "sp-card");
    const head = el("div", "sp-card-head");
    head.append(el("p", "result-label", label));
    if (above) head.append(el("span", "dl-tag sp-flag", flag || tx("Above usual")));
    box.append(head, el("strong", "sp-card-value", value));
    notes.filter(Boolean).forEach((note) => box.append(el("p", "dl-panel-note", note)));
    if (values && values.length) box.append(sparkline(values, highlight));
    const link = el("a", "inline-link", linkText);
    link.href = new URL(`../${tool}/`, window.location.href).href;
    box.append(link);
    return box;
  };

  // The tools that joined later, each only when it holds something in this browser (in the language of this page, as
  // the logs; the actions are one list for every language). The OEE target is the workplace's, else world class.
  const moreOf = (period) => {
    const options = { ...period, shift: shiftSelect.value };
    const safetyLog = logOf("safety-cross");
    const oeeLog = logOf("oee");
    const fiveLog = logOf("five-s-audit");
    const acts = actions(read("sc-actions", {}), today());
    return {
      safety: safetyLog.rows.length ? safety(safetyLog, options) : null,
      oee: oeeLog.rows.length ? oee(oeeLog, { ...options, target: window.Workplace?.target("oee") }, data.oeeReasons || []) : null,
      actions: acts.total ? acts : null,
      fiveS: fiveLog.rows.length ? fiveS(fiveLog) : null,
    };
  };
  const hasMore = (more) => Object.values(more).some(Boolean);

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
  const slotName = (model, key) => (weekly(model) ? tx("Week of {day}", { day: dayLabel(key) }) : dayLabel(key));
  const short = (text, max = 80) => (text.length > max ? `${text.slice(0, max - 1)}…` : text);

  // "Monday 14 Sept: 7 units · usual 1.8 a day" for a day, "Week of 14 Sept: 52 units · usual 40.5 a week" for a week.
  const latestNote = (model, series, nouns) => {
    if (!series.latest) return tx("No entries in this period.");
    const vars = { day: dayLabel(series.latest.key), n: plural(series.latest.count, nouns[0], nouns[1]), usual: series.usual === null ? "–" : int.format(Math.round(series.usual * 10) / 10) };
    return weekly(model) ? tx("Week of {day}: {n} · usual {usual} a week", vars) : tx("{day}: {n} · usual {usual} a day", vars);
  };
  const delayNote = (model) => {
    const delay = model.delay;
    if (delay.partial) return latestNote(model, delay, [tx("late route"), tx("late routes")]);
    if (!delay.latest) return tx("No entries in this period.");
    const vars = { day: dayLabel(delay.latest.key), pct: pct(delay.latest.share, 0), usual: delay.usualShare === null ? "–" : pct(delay.usualShare, 0) };
    return weekly(model) ? tx("Week of {day}: {pct} late · usual {usual}", vars) : tx("{day}: {pct} late · usual {usual}", vars);
  };

  const attention = (model, issues, more = {}) => {
    const list = [];
    const w = weekly(model);
    if (more.safety?.accident) list.push(tx(w ? "Accidents in the week of {day}: {n}." : "Accidents on {day}: {n}.", { day: dayLabel(more.safety.latest.key), n: more.safety.latest.accidents }));
    if (more.oee?.below) list.push(tx(w ? "OEE is below the target in the week of {day}: {pct} (target {target})." : "OEE is below the target on {day}: {pct} (target {target}).", { day: dayLabel(more.oee.latest.key), pct: pct(more.oee.latest.oee, 1), target: pct(more.oee.target, 0) }));
    if (more.actions?.overdue) list.push(tx(more.actions.overdue === 1 ? "{n} action is overdue." : "{n} actions are overdue.", { n: more.actions.overdue }));
    if (model.damage.above) list.push(tx(w ? "Damage is above the usual level in the week of {day}: {n}." : "Damage is above the usual level on {day}: {n}.", { day: dayLabel(model.damage.latest.key), n: model.damage.latest.count }));
    if (model.incomplete.above) list.push(tx(w ? "Incomplete orders are above the usual level in the week of {day}: {n}." : "Incomplete orders are above the usual level on {day}: {n}.", { day: dayLabel(model.incomplete.latest.key), n: model.incomplete.latest.count }));
    if (model.delay.above && model.delay.partial) list.push(tx(w ? "Late routes are above the usual level in the week of {day}: {n}." : "Late routes are above the usual level on {day}: {n}.", { day: dayLabel(model.delay.latest.key), n: model.delay.latest.count }));
    else if (model.delay.above) list.push(tx(w ? "Late routes are above the usual level in the week of {day}: {pct} late." : "Late routes are above the usual level on {day}: {pct} late.", { day: dayLabel(model.delay.latest.key), pct: pct(model.delay.latest.share, 0) }));
    const noOwner = issues.filter((issue) => !issue.owner).length;
    if (noOwner) list.push(tx(noOwner === 1 ? "{n} open issue has no owner." : "{n} open issues have no owner.", { n: noOwner }));
    const carried = issues.filter((issue) => issue.carried > 0).length;
    if (carried) list.push(tx(carried === 1 ? "{n} issue has already been carried over from an earlier shift." : "{n} issues have already been carried over from earlier shifts.", { n: carried }));
    return list;
  };

  const moreLines = (model, more) => {
    const lines = [];
    const { safety: s, oee: o, actions: a, fiveS: f } = more;
    if (s) lines.push(`${tx("Accidents")}: ${int.format(s.totals.accidents)} · ${tx("First aid")}: ${int.format(s.totals.firstAid)} · ${tx("Near misses and unsafe")}: ${int.format(s.totals.nearMisses)} · ${tx("Days since the last accident")}: ${s.daysSince === null ? "–" : int.format(s.daysSince)}`);
    if (o) lines.push(`OEE: ${o.latest ? `${pct(o.latest.oee, 1)} (${slotName(model, o.latest.key)})` : "–"} · ${tx("Period")}: ${o.period.oee === null ? "–" : pct(o.period.oee, 1)} · ${tx("Target")}: ${pct(o.target, 0)}`);
    if (a) lines.push(`${tx("Open actions")}: ${int.format(a.open)} · ${tx("{a} overdue · {b} due today", { a: int.format(a.overdue), b: int.format(a.dueToday) })}`);
    if (f) lines.push(`${tx("5S audit")}: ${pct(f.overall, 0)} · ${f.area || "–"} · ${showDate(f.date)}`);
    return lines;
  };

  const summaryText = (model, issues, notes, more = {}) => {
    const lines = [`Shift Pulse | Stiven Catalyst`, `${tx("Period")}: ${spanText(model)}`, ""];
    [["damage", tx("Damaged units")], ["incomplete", tx("Incomplete orders")]].forEach(([key, label]) => {
      const series = model[key];
      lines.push(`${label}: ${int.format(series.total)}${series.rate !== null ? ` · ${data[key].rateLabel} ${shareText(series.rate)} (${int.format(series.total)}/${int.format(series.volume)})` : ""}`);
    });
    if (model.delay.partial) lines.push(`${tx("Late routes")}: ${int.format(model.delay.late)} (${tx(PARTIAL_NOTE)})`);
    else lines.push(model.delay.routes
      ? `${tx("On-time routes")}: ${pct(model.delay.onTime, 1)} (${tx("{a} of {b} late", { a: model.delay.late, b: plural(model.delay.routes, tx("route"), tx("routes")) })})`
      : `${tx("On-time routes")}: –`);
    lines.push(...moreLines(model, more));
    if (notes.length) lines.push("", `${tx("Needs attention")}:`, ...notes.map((note) => `- ${note}`));
    lines.push("", `${tx("Open issues")} (${issues.length}):`);
    if (!issues.length) lines.push(`- ${tx("No open issues.")}`);
    issues.forEach((issue) => lines.push(`- [${issue.priority}] ${issue.text} · ${issue.owner || tx("no owner")}${issue.due ? ` · ${issue.due}` : ""}${issue.carried ? ` · ${tx("carried {n}×", { n: issue.carried })}` : ""}`));
    return lines.join("\n");
  };

  // The cards of the later tools, in the style of the three logs.
  const moreCards = (model, more) => {
    const list = [];
    const { safety: s, oee: o, actions: a, fiveS: f } = more;
    if (s) {
      list.push(card({
        label: tx("Accidents"),
        value: int.format(s.totals.accidents),
        notes: [
          tx("First aid {a} · near misses and unsafe {b}", { a: int.format(s.totals.firstAid), b: int.format(s.totals.nearMisses) }),
          s.latest ? `${slotName(model, s.latest.key)}: ${plural(s.latest.accidents, tx("accident"), tx("accidents"))}` : tx("No entries in this period."),
          s.daysSince === null ? tx("No accident in the log.") : `${tx("Days since the last accident")}: ${int.format(s.daysSince)}`,
        ],
        values: s.events,
        highlight: s.latest ? s.slots.indexOf(s.latest.key) : -1,
        above: s.accident,
        flag: tx("Accident"),
        tool: "safety-cross",
        linkText: tx("Open Safety Cross"),
      }));
    }
    if (o) {
      const l = o.latest;
      list.push(card({
        label: "OEE",
        value: l ? pct(l.oee, 1) : "–",
        notes: [
          l ? `${slotName(model, l.key)}: ${tx("availability {a} · performance {p} · quality {q}", { a: pct(l.availability, 0), p: pct(l.performance, 0), q: pct(l.quality, 0) })}` : tx("No entries in this period."),
          o.period.oee === null ? `${tx("Target")}: ${pct(o.target, 0)}` : tx("Period {pct} · target {target}", { pct: pct(o.period.oee, 1), target: pct(o.target, 0) }),
          o.unrated ? tx(o.unrated === 1 ? "{n} entry has no ideal rate and is left out." : "{n} entries have no ideal rate and are left out.", { n: o.unrated }) : "",
        ],
        values: o.values.map((value) => value ?? 0),
        highlight: l ? o.slots.indexOf(l.key) : -1,
        above: o.below,
        flag: tx("Below target"),
        tool: "oee",
        linkText: tx("Open OEE"),
      }));
    }
    if (a) {
      list.push(card({
        label: tx("Open actions"),
        value: int.format(a.open),
        notes: [
          tx("{a} overdue · {b} due today", { a: int.format(a.overdue), b: int.format(a.dueToday) }),
          a.oldest ? tx("Overdue since {date}: {title}", { date: showDate(a.oldest.due), title: short(a.oldest.title) }) : "",
        ],
        above: a.overdue > 0,
        flag: tx("Overdue"),
        tool: "action-tracker",
        linkText: tx("Open Action Tracker"),
      }));
    }
    if (f) {
      list.push(card({
        label: tx("5S audit"),
        value: pct(f.overall, 0),
        notes: [`${f.area || "–"} · ${showDate(f.date)}`, f.previous === null ? "" : tx("Previous audit of this area: {pct}", { pct: pct(f.previous, 0) })],
        values: f.series.length > 1 ? f.series : null,
        highlight: f.series.length - 1,
        tool: "five-s-audit",
        linkText: tx("Open 5S Audit"),
      }));
    }
    return list;
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
    if (delay.partial) {
      const counts = { unit: model.unit, buckets: model.slots.map((slot, i) => ({ key: slot, to: slot, value: delay.values[i] })) };
      const box = panel(tx("Late routes"), `${tx(PARTIAL_NOTE)} ${tx("Per {unit} in this period. The dashed line is the average; the highest {unit} is red.", { unit: unitName })}`);
      box.append(trendFigure(counts, { title: `${tx("Late routes")}: ${tx("Trend over time")}`, unit: `${tx("Late routes")} ${weekly(model) ? tx("per week") : tx("per day")}`, average: tx("Average") }, "shift-pulse-delay"));
      return box;
    }
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
    const more = moreOf(period);
    const empty = !logs.damage.rows.length && !logs.incomplete.rows.length && !logs.delay.rows.length;
    if (empty && !issues.length && !hasMore(more)) {
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
        label: model.delay.partial ? tx("Late routes") : tx("On-time routes"),
        value: model.delay.partial ? int.format(model.delay.late) : model.delay.routes ? pct(model.delay.onTime, 1) : "–",
        notes: model.delay.partial ? [tx(PARTIAL_NOTE), delayNote(model)] : [delayNote(model)],
        values: model.delay.values,
        highlight: slotIndex(model, model.delay.latest),
        above: model.delay.above,
        tool: "delay-analyzer",
        linkText: tx("Open Delay Analyzer"),
      }),
      ...moreCards(model, more)
    );

    const notes = attention(model, issues, more);
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
    copyButton.addEventListener("click", () => copy(summaryText(model, issues, notes, more), copyButton));
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
