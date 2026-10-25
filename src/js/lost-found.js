(() => {
  // Lost & Found: the register of found items, from the moment one is handed in to the day it is returned, sent,
  // handed to the police, given away or destroyed. The log is { rows: [{ id, date, time, area, room, category, what,
  // value, foundBy, place, tag, guest, steps: [{ status, date, by }], delivery: { how, tracking, postage, paidBy } }] }.
  // An item's status is its last step; with no step it is stored. Photos are kept by FloorCapture under the item id.
  const kit = window.ToolKit;

  // The arithmetic, apart from the page, so a test can call it.
  const STATUSES = ["stored", "contacted", "returned", "police", "charity", "destroyed"];
  const OPEN = ["stored", "contacted"];
  const VALUES = ["low", "medium", "high"];
  const DAY = 864e5;
  const isIso = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value);
  const between = (from, to) => Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / DAY);
  const addDays = (iso, days) => {
    const date = new Date(`${iso}T00:00:00Z`);
    date.setUTCDate(date.getUTCDate() + days);
    return date.toISOString().slice(0, 10);
  };
  const mondayOf = (iso) => addDays(iso, -((new Date(`${iso}T00:00:00Z`).getUTCDay() + 6) % 7));
  const fill = (text, vars = {}) => String(text ?? "").replace(/\{(\w+)\}/g, (match, name) => (name in vars ? vars[name] : match));

  const categoryOf = (cfg, key) => cfg.categories.find((item) => item.key === key) || cfg.categories.at(-1);
  const statusOf = (row) => row.steps?.at(-1)?.status || "stored";
  const isOpen = (row) => OPEN.includes(statusOf(row));
  const lastStep = (row) => row.steps?.at(-1) || null;

  // The rules in force: the days an item is kept by its value, and the days for documents and cards, which are decided
  // on within days, not months. A typed setting wins over the data file's default.
  const rules = (cfg, typed = {}) => {
    const pick = (value, fallback) => {
      const n = Number.parseInt(String(value ?? "").trim(), 10);
      return n > 0 && n < 3700 ? n : fallback;
    };
    const d = cfg.retention;
    return { low: pick(typed.retLow, d.low), medium: pick(typed.retMedium, d.medium), high: pick(typed.retHigh, d.high), docs: pick(typed.retDocs, d.docs), followUp: cfg.followUpDays, soon: cfg.dueSoonDays };
  };
  const retentionDays = (row, cfg, r) => (categoryOf(cfg, row.category).days ? r.docs : r[row.value] ?? r.low);
  const keepUntil = (row, cfg, r) => addDays(row.date, retentionDays(row, cfg, r));

  // Where an open item stands: past its keep-until date ("over"), close to it ("due"), contacted long ago and still
  // here ("follow"), or fine. A closed item is "closed".
  const flagOf = (row, today, cfg, r) => {
    if (!isOpen(row)) return "closed";
    const until = keepUntil(row, cfg, r);
    if (today > until) return "over";
    if (between(today, until) <= r.soon) return "due";
    const last = lastStep(row);
    if (last?.status === "contacted" && between(last.date, today) >= r.followUp) return "follow";
    return "ok";
  };
  // What to do with an item that is due: a guest contacted long ago is contacted again; the rest goes where its
  // category goes (documents to the police, clothes to charity) once nobody has claimed it.
  const decisionOf = (row, flag, cfg) => (flag === "follow" ? "contacted" : categoryOf(cfg, row.category).decision);
  const dueList = (rows, today, cfg, r) => rows
    .filter(isOpen)
    .map((row) => ({ row, flag: flagOf(row, today, cfg, r), until: keepUntil(row, cfg, r) }))
    .filter((item) => item.flag === "over" || item.flag === "due" || item.flag === "follow")
    .sort((a, b) => ({ over: 0, due: 1, follow: 2 }[a.flag] - { over: 0, due: 1, follow: 2 }[b.flag]) || a.until.localeCompare(b.until));

  // The numbers of the register on one day.
  const stats = (rows, today, cfg, r) => {
    const open = rows.filter(isOpen);
    const flags = open.map((row) => flagOf(row, today, cfg, r));
    const month = rows.filter((row) => row.date.startsWith(today.slice(0, 7)));
    const returned = month.filter((row) => statusOf(row) === "returned").length;
    return {
      total: rows.length,
      open: open.length,
      inSafe: open.filter((row) => row.place === cfg.safe).length,
      highOutside: open.filter((row) => row.value === "high" && row.place !== cfg.safe).length,
      contacted: open.filter((row) => statusOf(row) === "contacted").length,
      over: flags.filter((flag) => flag === "over").length,
      due: flags.filter((flag) => flag === "due").length,
      follow: flags.filter((flag) => flag === "follow").length,
      monthFound: month.length,
      monthReturned: returned,
      returnRate: month.length ? returned / month.length : null,
    };
  };

  // Counts by a field, largest first.
  const tally = (rows, valueOf) => {
    const map = new Map();
    rows.forEach((row) => {
      const key = valueOf(row);
      if (key) map.set(key, (map.get(key) || 0) + 1);
    });
    return [...map].map(([key, value]) => ({ key, value })).sort((a, b) => b.value - a.value || a.key.localeCompare(b.key));
  };

  // Found and returned per week (Monday to Sunday), from the week of the first find to this week: at least four weeks
  // so a line has a shape, at most `max` so it stays readable.
  const weekly = (rows, today, max = 8) => {
    const dates = rows.map((row) => row.date).filter(isIso).sort();
    if (!dates.length) return [];
    const last = mondayOf(today);
    let first = mondayOf(dates[0]);
    if (between(first, last) > (max - 1) * 7) first = addDays(last, -(max - 1) * 7);
    if (between(first, last) < 21) first = addDays(last, -21);
    const weeks = [];
    for (let week = first; week <= last; week = addDays(week, 7)) weeks.push({ week, found: 0, returned: 0 });
    const at = (iso) => weeks.find((item) => iso >= item.week && iso < addDays(item.week, 7));
    rows.forEach((row) => {
      const found = at(row.date);
      if (found) found.found++;
      if (statusOf(row) === "returned") {
        const back = at(lastStep(row).date);
        if (back) back.returned++;
      }
    });
    return weeks;
  };

  // Item ids: LF, the day, three characters that cannot be misread on a tag (no 0/O, 1/I).
  const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const newId = (date, taken = new Set(), random = Math.random) => {
    const stem = `LF-${date.slice(2, 4)}${date.slice(5, 7)}${date.slice(8, 10)}-`;
    for (let attempt = 0; attempt < 60; attempt++) {
      let tail = "";
      for (let i = 0; i < 3; i++) tail += CHARS[Math.floor(random() * CHARS.length) % CHARS.length];
      if (!taken.has(stem + tail)) return stem + tail;
    }
    let n = taken.size + 1;
    while (taken.has(`${stem}${n}`)) n++;
    return `${stem}${n}`;
  };

  // A saved row, cleaned: no date, no item; an unknown category is "other", an unknown value the category's own.
  const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
  const cleanRow = (row, cfg) => {
    if (!isObject(row)) return null;
    const date = kit.parseDate(row.date);
    if (!date) return null;
    const s = (value) => (typeof value === "string" ? value.trim() : "");
    const category = cfg.categories.some((item) => item.key === row.category) ? row.category : "other";
    const steps = (Array.isArray(row.steps) ? row.steps : [])
      .map((step) => (isObject(step) && STATUSES.includes(step.status) && step.status !== "stored" && kit.parseDate(step.date) ? { status: step.status, date: kit.parseDate(step.date), by: s(step.by) } : null))
      .filter(Boolean)
      // The history in the order of its dates; steps of one day keep the order they were made in.
      .map((step, index) => ({ step, index }))
      .sort((a, b) => a.step.date.localeCompare(b.step.date) || a.index - b.index)
      .map(({ step }) => step);
    const sent = isObject(row.delivery) ? row.delivery : {};
    const postage = typeof sent.postage === "number" ? sent.postage : kit.parseNumber(sent.postage);
    return {
      id: /^[A-Za-z0-9-]{3,30}$/.test(s(row.id)) ? s(row.id) : "",
      date,
      time: /^\d{1,2}:\d{2}$/.test(s(row.time)) ? s(row.time).padStart(5, "0") : "",
      area: s(row.area),
      room: s(row.room).slice(0, 12),
      category,
      what: s(row.what),
      value: VALUES.includes(row.value) ? row.value : categoryOf(cfg, category).value,
      foundBy: s(row.foundBy),
      place: s(row.place),
      tag: s(row.tag).slice(0, 20),
      guest: s(row.guest),
      steps,
      delivery: {
        how: sent.how === "post" || sent.how === "person" ? sent.how : "",
        tracking: s(sent.tracking),
        postage: Number.isFinite(postage) && postage >= 0 ? Math.round(postage * 100) / 100 : null,
        paidBy: sent.paidBy === "guest" || sent.paidBy === "hotel" ? sent.paidBy : "",
      },
    };
  };
  // Rows with an id each, unique: a missing or repeated one gets a new id.
  const cleanRows = (rows, cfg, taken = new Set()) => rows.map((row) => cleanRow(row, cfg)).filter(Boolean).map((row) => {
    if (!row.id || taken.has(row.id)) row.id = newId(row.date, taken);
    taken.add(row.id);
    return row;
  });

  // A pasted name to its key: the key itself, the name in this language or the start of it.
  const keyOf = (value, entries) => {
    const text = String(value ?? "").trim().toLowerCase();
    if (!text) return "";
    const lists = entries.map(([key, names]) => [key, [key, ...names].filter(Boolean).map((name) => String(name).toLowerCase())]);
    const exact = lists.find(([, names]) => names.includes(text));
    if (exact) return exact[0];
    const start = text.length >= 3 && lists.find(([, names]) => names.some((name) => name.startsWith(text) || text.startsWith(name)));
    return start ? start[0] : "";
  };
  const categoryKey = (value, cfg) => keyOf(value, cfg.categories.map((item) => [item.key, [item.name]]));
  const valueKey = (value, cfg) => keyOf(value, VALUES.map((key) => [key, [cfg.values[key]]]));
  const statusKey = (value, cfg) => keyOf(value, STATUSES.map((key) => [key, [cfg.statuses[key], cfg.short[key]]]));
  // Rows from a spreadsheet: date, time, area, room, category, description, value, found by, stored in, tag, guest,
  // status. A row needs a date; a first row without one is a header. A status after "stored" becomes one step on the
  // date the item was found, since a register rarely keeps when it changed.
  const importRows = (text, cfg, taken = new Set()) => {
    const added = [];
    let skipped = 0;
    kit.parseRows(text).forEach((cells, index) => {
      const [date, time, area, room, category, what, value, foundBy, place, tag, guest, status] = cells;
      const day = kit.parseDate(date);
      if (!day) {
        if (index > 0) skipped++;
        return;
      }
      // An export with one "found at" column holds the time in the date cell.
      const clock = String(time ?? "").trim() || (kit.parseDateTime ? kit.parseDateTime(date).time : "");
      const kind = categoryKey(category, cfg) || "other";
      const state = statusKey(status, cfg);
      added.push({
        date: day,
        time: clock,
        area: kit.canon(cfg.areas || [], area, ""),
        room: String(room ?? "").trim(),
        category: kind,
        what: String(what ?? "").trim(),
        value: valueKey(value, cfg) || categoryOf(cfg, kind).value,
        foundBy: String(foundBy ?? "").trim(),
        place: kit.canon(cfg.places || [], place, ""),
        tag: String(tag ?? "").trim(),
        guest: String(guest ?? "").trim(),
        steps: state && state !== "stored" ? [{ status: state, date: day, by: "" }] : [],
      });
    });
    return { added: cleanRows(added, cfg, taken), skipped };
  };

  // The example of the data file, moved forward by whole weeks so its last day is today or just before; every date
  // (finds and steps) moves together, so the weekdays and the gaps stay the same.
  const exampleRows = (cfg, today) => {
    const raw = cfg.example.rows;
    const dates = raw.flatMap((row) => [row.date, ...row.steps.map((step) => step[1])]).filter(isIso).sort();
    const weeks = dates.length ? Math.floor(between(dates.at(-1), today) / 7) : 0;
    const move = (iso) => (weeks > 0 ? addDays(iso, weeks * 7) : iso);
    return cleanRows(raw.map((row, index) => {
      const date = move(row.date);
      return { ...row, id: `LF-${date.slice(2, 4)}${date.slice(5, 7)}${date.slice(8, 10)}-${String(index + 1).padStart(3, "0")}`, date, steps: row.steps.map(([status, day, by]) => ({ status, date: move(day), by })) };
    }), cfg);
  };

  // The reply to the guest, from the templates of the data file: email (with a subject line) or a short WhatsApp text.
  const firstLower = (text, lang) => (lang !== "de" && /^\p{Lu}\p{Ll}/u.test(text) ? text.charAt(0).toLowerCase() + text.slice(1) : text);
  const replyText = (row, cfg, { channel = "email", postage = NaN, hotel = "", me = "", until = "", lang = "en", date = (iso) => iso, money = (n) => String(n) } = {}) => {
    const tpl = cfg.replies[channel] || cfg.replies.email;
    const t = cfg.text;
    const where = row.room ? fill(t.whereRoom, { room: row.room }) : row.area ? fill(t.whereArea, { area: lang === "de" ? row.area : row.area.toLowerCase() }) : "";
    const vars = {
      guest: row.guest,
      hotel: hotel || t.hotelFallback,
      item: firstLower(row.what || categoryOf(cfg, row.category).name, lang),
      where,
      date: date(row.date),
      until: until ? date(until) : "",
      postage: Number.isFinite(postage) && postage > 0 ? money(postage) : "",
      id: row.id,
    };
    const line = (text) => fill(text, vars).replace(/ {2,}/g, " ").replace(/ ([.,:])/g, "$1");
    const hello = line(row.guest ? tpl.hello : tpl.helloAnon);
    const lines = [];
    if (tpl.subject) lines.push(line(tpl.subject), "");
    if (tpl.inline) lines.push(`${hello} ${line(tpl.found)}`);
    else lines.push(hello, "", line(tpl.found));
    lines.push(line(vars.postage ? tpl.post : tpl.postAsk), line(tpl.collect));
    if (vars.until) lines.push(line(tpl.keep));
    lines.push(line(tpl.ref), "", line(tpl.bye));
    if (me) lines.push(me);
    if (hotel) lines.push(hotel);
    return lines.join("\n");
  };

  window.LostFoundMath = { STATUSES, OPEN, VALUES, addDays, mondayOf, categoryOf, statusOf, isOpen, rules, retentionDays, keepUntil, flagOf, decisionOf, dueList, stats, tally, weekly, newId, cleanRow, cleanRows, keyOf, importRows, exampleRows, replyText };

  // The page.
  const dataEl = document.getElementById("lost-found-data");
  const root = document.querySelector("[data-lost-found]");
  const Chart = window.ChartKit;
  if (!dataEl || !root || !kit || !Chart) return;
  const Workplace = window.Workplace || null;
  const Actions = window.ActionsStore || null;
  const Capture = window.FloorCapture || null;
  const { LANG, tx, num, showDate, write, loadState, el, int, euro, pct, plural, today, parseNumber, parseDate, logBook, resultLayout, panel, stat, focusCard, resultActions, flash, copy, dayMonth } = kit;
  const M = window.LostFoundMath;

  const data = JSON.parse(dataEl.textContent);
  const t = data.text;
  const KEY = data.storageKey;
  const TOOL = "lost-found";
  const results = document.querySelector("[data-results]");
  const entry = root.querySelector("[data-entry]");
  const entryStatus = root.querySelector("[data-entry-status]");
  const paste = root.querySelector("#lf-paste");
  const box = root.querySelector("[data-item-box]");
  const pick = box.querySelector("#lf-pick");
  const card = box.querySelector("[data-item-card]");
  const stepForm = box.querySelector("[data-step]");
  const stepStatus = box.querySelector("[data-step-status]");
  const replyBox = box.querySelector("#lf-reply");
  const itemParts = box.querySelector("[data-item-parts]");
  const itemEmpty = box.querySelector("[data-item-empty]");

  const state = loadState(KEY, { me: "", hotel: "", retLow: "", retMedium: "", retHigh: "", retDocs: "", rows: [], example: {}, totalsFor: {}, selected: "", channel: "email", from: "", to: "" });
  state.rows = M.cleanRows(state.rows, data);
  if (!["email", "whatsapp"].includes(state.channel)) state.channel = "email";
  const save = () => write(KEY, state);

  const catName = (key) => M.categoryOf(data, key).name;
  const valueName = (key) => data.values[key] || key;
  const statusName = (key) => data.statuses[key] || key;
  const shortStatus = (key) => data.short[key] || key;
  const r = () => M.rules(data, state);
  const weekLabel = dayMonth(false);
  const items = (count) => plural(count, tx("item"), tx("items"));
  const FLAG_WORDS = () => ({ over: tx("over retention"), due: tx("due soon"), follow: tx("follow up") });
  const FLAG_STATE = { over: "danger", due: "warn", follow: "warn" };
  const whereText = (row) => [row.area, row.room ? `${tx("Room")} ${row.room}` : ""].filter(Boolean).join(" · ");
  const storedText = (row) => [row.place, row.tag ? `#${row.tag}` : ""].filter(Boolean).join(" · ");
  const money = (value) => euro.format(value);

  // Areas from the workplace profile when it has them, else the data file's.
  const areas = () => (Workplace?.areas().length ? Workplace.areas().map((area) => area.name) : data.areas);
  const fillChoices = () => {
    if (Workplace) Workplace.fillSelect(entry.elements.area, areas(), entry.elements.area.value);
  };

  // The id of the item being typed: its photos are kept under it before it is saved, and it moves to the next item
  // once this one is in the register.
  const takenIds = () => new Set(state.rows.map((row) => row.id));
  let pendingId = M.newId(today(), takenIds());
  const newIdEl = entry.querySelector("[data-new-id]");
  const entryPhotos = Capture ? Capture.attach(entry.querySelector("[data-entry-photos]"), { tool: TOOL, ref: pendingId }) : null;
  const showPendingId = () => { newIdEl.textContent = pendingId; };

  // The item shown in box 4.
  const selected = () => state.rows.find((row) => row.id === state.selected) || null;
  let itemPhotos = null;

  const analyse = () => {
    const now = today();
    const rules = r();
    const s = M.stats(state.rows, now, data, rules);
    const due = M.dueList(state.rows, now, data, rules);
    const byArea = M.tally(state.rows, (row) => row.area || tx("Not recorded"));
    const top = byArea[0] || null;
    const topRows = top ? state.rows.filter((row) => (row.area || tx("Not recorded")) === top.key) : [];
    const topCategory = M.tally(topRows, (row) => catName(row.category))[0] || null;
    return { now, rules, s, due, byArea, top, topCategory, byCategory: data.categories.map((item) => ({ key: item.name, value: state.rows.filter((row) => row.category === item.key).length })), weeks: M.weekly(state.rows, now) };
  };

  const problemText = (a) => (a.top
    ? tx("{area}: {n} of {total} found items in the register were left here, most often {category}.", { area: a.top.key, n: int.format(a.top.value), total: int.format(state.rows.length), category: a.topCategory ? (LANG === "de" ? a.topCategory.key : a.topCategory.key.toLowerCase()) : "-" })
    : "");

  const rulesText = (rules) => tx("Kept {low} days (low value), {medium} days (medium) and {high} days (high); documents and cards are decided on within {docs} days.", { low: int.format(rules.low), medium: int.format(rules.medium), high: int.format(rules.high), docs: int.format(rules.docs) });

  const summaryText = (a) => {
    const lines = [`${t.tool} | Stiven Catalyst`, `${tx("Date")}: ${showDate(a.now)}`, ""];
    lines.push(`${tx("Open items")}: ${int.format(a.s.open)}`);
    lines.push(`${tx("In the safe")}: ${int.format(a.s.inSafe)}`);
    lines.push(`${tx("Contacted, not collected")}: ${int.format(a.s.contacted)}`);
    lines.push(`${tx("Over retention")}: ${int.format(a.s.over)}`);
    lines.push(`${tx("Returned this month")}: ${a.s.returnRate === null ? "–" : pct(a.s.returnRate, 0)} (${tx("{a} of {b} found this month", { a: int.format(a.s.monthReturned), b: int.format(a.s.monthFound) })})`);
    lines.push("", `${tx("Due for a decision")}: ${int.format(a.due.length)}`);
    a.due.forEach(({ row, flag, until }) => lines.push(`- ${row.id} · ${catName(row.category)} · ${row.what} · ${FLAG_WORDS()[flag]} (${tx("keep until {date}", { date: showDate(until) })}) → ${data.stepButtons[M.decisionOf(row, flag, data)]}`));
    if (a.top) {
      lines.push("", `${tx("Start here")}: ${problemText(a)}`);
      const advice = data.advice[a.top.key] || data.advice.default;
      lines.push(`${tx("First moves")}:`);
      advice.moves.forEach((move) => lines.push(`- ${move}`));
      lines.push(`${tx("Question for the floor")}: ${advice.question}`);
    }
    lines.push("", rulesText(a.rules), t.rulesNote);
    return lines.join("\n");
  };

  // The register for Pareto: one count per item, by category; the area is the filter.
  const paretoTable = () => ({
    source: t.tool,
    headers: [tx("Date"), tx("Area"), tx("Category"), tx("Value"), tx("Count")],
    rows: state.rows.map((row) => [row.date, row.area, catName(row.category), valueName(row.value), "1"]),
    map: { category: 2, count: 4, date: 0, filter: 1 },
    measure: "count",
  });

  // A step for an item: the status, the day and who; "returned" also says how, and by post the tracking and postage.
  const addStep = (row, status, { date = today(), by = state.me, delivery = null } = {}) => {
    row.steps.push({ status, date, by: String(by || "").trim() });
    if (status === "returned" && delivery) row.delivery = delivery;
  };

  const dueCard = (a) => {
    const cardEl = el("article", "result-card lf-due");
    cardEl.append(el("p", "result-label", tx("Due for a decision")));
    if (!a.due.length) {
      cardEl.append(el("p", null, tx("Nothing is due: every open item is within its keep-until date.")));
    } else {
      const list = el("ul", "lf-due-list");
      a.due.slice(0, 12).forEach(({ row, flag, until }) => {
        const item = el("li", `is-${FLAG_STATE[flag]}`);
        const text = el("div", "lf-due-text");
        const head = el("strong", null, `${row.id} · ${catName(row.category)}`);
        const sign = flag === "over" ? "✕" : "!";
        text.append(head, el("span", `lf-flag is-${FLAG_STATE[flag]}`, `${sign} ${FLAG_WORDS()[flag]}`), el("small", null, `${row.what}${row.what ? " · " : ""}${tx("found {date}", { date: showDate(row.date) })} · ${tx("keep until {date}", { date: showDate(until) })}${row.guest ? ` · ${row.guest}` : ""}`));
        const buttons = el("div", "lf-due-actions");
        const decision = M.decisionOf(row, flag, data);
        const decide = el("button", "button-secondary", data.stepButtons[decision]);
        decide.type = "button";
        decide.dataset.decide = row.id;
        decide.dataset.status = decision;
        decide.setAttribute("aria-label", `${data.stepButtons[decision]}: ${row.id}`);
        const open = el("button", "button-ghost", tx("Open item"));
        open.type = "button";
        open.dataset.pick = row.id;
        open.setAttribute("aria-label", `${tx("Open item")} ${row.id}`);
        buttons.append(decide, open);
        item.append(text, buttons);
        list.append(item);
      });
      cardEl.append(list);
      if (a.due.length > 12) cardEl.append(el("p", "dl-panel-note", tx("{n} more in the register.", { n: int.format(a.due.length - 12) })));
    }
    cardEl.append(el("p", "form-note lf-rules", `${rulesText(a.rules)} ${t.rulesNote}`));
    const status = el("p", "form-note");
    status.dataset.decideStatus = "";
    status.setAttribute("aria-live", "polite");
    cardEl.append(status);
    return cardEl;
  };

  // The register on paper: every item, A4, only in print.
  const registerTable = () => {
    const wrap = el("section", "lf-register");
    wrap.append(el("h3", "result-label", `${t.tool} · ${tx("Register")} · ${showDate(today())}`));
    const table = el("table", "dl-table");
    const head = el("tr");
    [tx("ID"), tx("Found"), tx("Where"), tx("Category"), tx("Description"), tx("Value"), tx("Stored in"), tx("Guest"), tx("Status")].forEach((name) => {
      const th = el("th", null, name);
      th.scope = "col";
      head.append(th);
    });
    const thead = el("thead");
    thead.append(head);
    const body = el("tbody");
    const rules = r();
    state.rows.forEach((row) => {
      const tr = el("tr");
      const last = lastStep(row);
      tr.append(
        el("td", "nowrap", row.id),
        el("td", "nowrap", `${showDate(row.date)} ${row.time}`),
        el("td", null, whereText(row)),
        el("td", null, catName(row.category)),
        el("td", null, row.what),
        el("td", null, valueName(row.value)),
        el("td", null, storedText(row)),
        el("td", null, row.guest),
        el("td", null, `${shortStatus(M.statusOf(row))}${last ? ` · ${showDate(last.date)}${last.by ? ` · ${last.by}` : ""}` : ` · ${tx("keep until {date}", { date: showDate(M.keepUntil(row, data, rules)) })}`}`),
      );
      body.append(tr);
    });
    table.append(thead, body);
    wrap.append(table);
    return wrap;
  };

  const renderResults = () => {
    results.replaceChildren();
    renderItem();
    results.hidden = !state.rows.length;
    if (!state.rows.length) return;
    const a = analyse();

    const head = el("div", "result-head");
    head.append(el("p", "kicker", `${tx("Result")} · ${showDate(a.now)}`));
    const title = el("h2");
    title.append(el("span", null, int.format(a.s.open)), ` ${a.s.open === 1 ? tx("open item") : tx("open items")} · ${a.due.length ? tx("{n} due for a decision", { n: int.format(a.due.length) }) : tx("nothing due")}`);
    head.append(title);

    const stats = el("div", "dl-stats");
    stats.append(stat(tx("Open items"), int.format(a.s.open), tx("{n} in the register", { n: items(a.s.total) })));
    stats.append(stat(tx("In the safe"), int.format(a.s.inSafe), a.s.highOutside ? `! ${tx("{n} high-value outside the safe", { n: int.format(a.s.highOutside) })}` : tx("every high-value item is in the safe")));
    stats.append(stat(tx("Contacted, not collected"), int.format(a.s.contacted), a.s.follow ? `! ${tx("{n} waiting {d} days or more", { n: int.format(a.s.follow), d: int.format(a.rules.followUp) })}` : tx("follow up after {d} days", { d: int.format(a.rules.followUp) })));
    stats.append(stat(tx("Over retention"), int.format(a.s.over), a.s.due ? tx("{n} more due within {d} days", { n: int.format(a.s.due), d: int.format(a.rules.soon) }) : tx("past the keep-until date")));
    stats.append(stat(tx("Returned this month"), a.s.returnRate === null ? "–" : pct(a.s.returnRate, 0), tx("{a} of {b} found this month", { a: int.format(a.s.monthReturned), b: int.format(a.s.monthFound) })));

    const notes = [dueCard(a)];
    if (a.s.highOutside) notes.push(el("p", "dl-warning", tx("High-value items belong in the safe: {list}.", { list: state.rows.filter((row) => M.isOpen(row) && row.value === "high" && row.place !== data.safe).map((row) => `${row.id} (${storedText(row) || "-"})`).join(", ") })));

    let focus = null;
    if (a.top) {
      const advice = data.advice[a.top.key] || data.advice.default;
      focus = focusCard({ title: a.top.key, detail: a.topCategory?.key, lede: problemText(a), advice });
      // A place that keeps collecting items is a process to fix, not a shelf to fill: one tap to the Action Tracker.
      const action = () => ({
        title: tx("Fewer items left behind in {area}", { area: a.top.key }),
        detail: `${problemText(a)} ${advice.moves[0]}`,
        source: TOOL,
        area: a.top.key,
        priority: a.top.value >= 5 ? "High" : "Medium",
        due: M.addDays(a.now, 14),
        check: tx("Fewer items found in {area} over the next four weeks", { area: a.top.key }),
      });
      const actions = el("div", "tool-actions");
      actions.append(Actions ? Actions.linkButton(tx("Add to actions"), action) : kit.trackerLink(tx("Add to actions"), action));
      focus.append(actions);
    }

    const actions = resultActions(() => summaryText(a), problemText(a) || t.tool, state.rows.length ? paretoTable : null);

    const top = a.byCategory.reduce((best, item) => (item.value > (best?.value ?? 0) ? item : best), null);
    const categories = panel(tx("Items by category"), tx("Every item in the register, by what it is."));
    categories.append(Chart.figure(Chart.bars(a.byCategory.map((item) => ({ label: item.key, value: item.value, tip: `${item.key}: ${int.format(item.value)}` })), { title: tx("Items by category"), highlight: (item) => item.label === top?.key, yMax: Chart.niceMax(Math.max(4, ...a.byCategory.map((item) => item.value))), format: (v) => int.format(v) }), { fileName: "lost-found-categories" }));

    const areaPanel = panel(tx("Items by area"), tx("Where the items were left. The area at the top gets the first fix."));
    areaPanel.append(Chart.figure(Chart.bars(a.byArea.map((item) => ({ label: item.key, value: item.value, tip: `${item.key}: ${int.format(item.value)}` })), { title: tx("Items by area"), highlight: (item) => item.label === a.top?.key, yMax: Chart.niceMax(Math.max(4, ...a.byArea.map((item) => item.value))), format: (v) => int.format(v) }), { fileName: "lost-found-areas" }));

    const weekPanel = panel(tx("Found and returned per week"), tx("Items found in a week and items that went back to their owner in that week. Weeks start on Monday."));
    const point = (week, value, name) => ({ x: weekLabel(new Date(`${week.week}T00:00:00Z`)), y: value, tip: `${tx("Week of {date}", { date: showDate(week.week) })}\n${name}: ${int.format(value)}` });
    weekPanel.append(Chart.figure(Chart.line([
      { label: tx("Found"), points: a.weeks.map((week) => point(week, week.found, tx("Found"))) },
      { label: tx("Returned"), points: a.weeks.map((week) => point(week, week.returned, tx("Returned"))), color: Chart.C.ok },
    ], { title: tx("Found and returned per week"), yMin: 0, format: (v) => int.format(v) }), { fileName: "lost-found-weeks" }));

    resultLayout(results, { head, stats, notes, focus, actions, panels: [categories, areaPanel, weekPanel] });
    results.append(registerTable());
  };

  // Box 4: one item, its history, its next step, the reply to the guest and its tag label.
  const fillPick = () => {
    const open = state.rows.filter(M.isOpen).reverse();
    const closed = state.rows.filter((row) => !M.isOpen(row)).reverse();
    const option = (row) => {
      const node = el("option", null, `${row.id} · ${catName(row.category)}${row.what ? ` · ${row.what.slice(0, 40)}` : ""}`);
      node.value = row.id;
      return node;
    };
    const groups = [];
    if (open.length) {
      const group = el("optgroup");
      group.label = tx("Open");
      group.append(...open.map(option));
      groups.push(group);
    }
    if (closed.length) {
      const group = el("optgroup");
      group.label = tx("Closed");
      group.append(...closed.map(option));
      groups.push(group);
    }
    pick.replaceChildren(...groups);
    if (!selected()) state.selected = open[0]?.id || closed[0]?.id || "";
    pick.value = state.selected;
  };

  const detailRow = (list, label, value) => {
    if (!value) return;
    list.append(el("dt", null, label), el("dd", null, value));
  };
  let shownId = "";
  const renderItem = () => {
    fillPick();
    const row = selected();
    itemParts.hidden = !row;
    itemEmpty.hidden = Boolean(row);
    if (!row) {
      card.replaceChildren();
      shownId = "";
      return;
    }
    const rules = r();
    const flag = M.flagOf(row, today(), data, rules);
    const until = M.keepUntil(row, data, rules);
    card.replaceChildren();
    const head = el("div", "lf-item-head");
    head.append(el("strong", "lf-item-id", row.id), el("span", `lf-flag is-${flag === "closed" || flag === "ok" ? "ok" : FLAG_STATE[flag]}`, `${flag === "over" ? "✕ " : flag === "due" || flag === "follow" ? "! " : "✓ "}${statusName(M.statusOf(row))}${FLAG_WORDS()[flag] ? ` · ${FLAG_WORDS()[flag]}` : ""}`));
    card.append(head);
    const list = el("dl", "lf-facts");
    detailRow(list, tx("Found"), `${showDate(row.date)}${row.time ? ` ${row.time}` : ""}${row.foundBy ? ` · ${row.foundBy}` : ""}`);
    detailRow(list, tx("Where"), whereText(row));
    detailRow(list, tx("Category"), `${catName(row.category)} · ${valueName(row.value)}`);
    detailRow(list, tx("Description"), row.what);
    detailRow(list, tx("Stored in"), storedText(row));
    detailRow(list, tx("Guest"), row.guest);
    if (M.isOpen(row)) detailRow(list, tx("Keep until"), `${showDate(until)} (${plural(M.retentionDays(row, data, rules), tx("day"), tx("days"))})`);
    if (M.statusOf(row) === "returned" && row.delivery.how) detailRow(list, tx("Returned"), [data.returnHow[row.delivery.how], row.delivery.tracking, row.delivery.postage !== null ? money(row.delivery.postage) : "", row.delivery.paidBy ? `${tx("paid by")} ${data.paidBy[row.delivery.paidBy]}` : ""].filter(Boolean).join(" · "));
    card.append(list);
    card.append(el("p", "result-label", tx("History")));
    const history = el("ol", "lf-history");
    const first = el("li");
    first.append(el("strong", null, statusName("stored")), ` · ${showDate(row.date)}${row.foundBy ? ` · ${row.foundBy}` : ""}`);
    history.append(first);
    row.steps.forEach((step) => {
      const item = el("li");
      item.append(el("strong", null, statusName(step.status)), ` · ${showDate(step.date)}${step.by ? ` · ${step.by}` : ""}`);
      history.append(item);
    });
    card.append(history);
    stepForm.querySelector("[data-undo-step]").disabled = !row.steps.length;

    // A newly chosen item: the step form offers the next natural step, and the reply its postage.
    if (shownId !== row.id) {
      shownId = row.id;
      const f = stepForm.elements;
      f.step.value = M.statusOf(row) === "stored" ? "contacted" : M.statusOf(row) === "contacted" ? "returned" : "returned";
      f.stepDate.value = today();
      f.stepBy.value = state.me;
      f.how.value = row.delivery.how || "person";
      f.tracking.value = row.delivery.tracking;
      f.stepPostage.value = row.delivery.postage !== null ? num(row.delivery.postage, 2) : "";
      f.paidBy.value = row.delivery.paidBy || "guest";
      box.querySelector("#lf-postage").value = row.delivery.postage !== null ? num(row.delivery.postage, 2) : num(data.postage, 2);
      syncStepFields();
      if (itemPhotos) itemPhotos.setRef(row.id);
    }
    renderReply();
  };
  const renderReply = () => {
    const row = selected();
    if (!row) return;
    box.querySelector("#lf-channel").value = state.channel;
    replyBox.value = M.replyText(row, data, {
      channel: state.channel,
      postage: parseNumber(box.querySelector("#lf-postage").value),
      hotel: state.hotel.trim() || Workplace?.get().site || "",
      me: state.me.trim(),
      until: M.isOpen(row) ? M.keepUntil(row, data, r()) : "",
      lang: LANG,
      date: showDate,
      money,
    });
  };
  const syncStepFields = () => {
    const f = stepForm.elements;
    const returned = f.step.value === "returned";
    stepForm.querySelector("[data-return-fields]").hidden = !returned;
    stepForm.querySelectorAll("[data-post-field]").forEach((node) => { node.hidden = !returned || f.how.value !== "post"; });
  };

  const choose = (id, { scroll = false } = {}) => {
    state.selected = id;
    save();
    renderItem();
    if (scroll) {
      box.scrollIntoView({ behavior: "smooth", block: "start" });
      pick.focus({ preventScroll: true });
    }
  };

  // The tag label: id, date, short description and the tag number large, printed on its own.
  const printLabel = () => {
    const row = selected();
    if (!row) return;
    document.querySelector(".lf-label-sheet")?.remove();
    const sheet = el("div", "lf-label-sheet");
    const label = el("div", "lf-label");
    label.append(
      el("p", "lf-label-kicker", `${t.tool} · ${catName(row.category)}`),
      el("p", "lf-label-tag", row.tag ? `#${row.tag}` : row.id),
      el("p", "lf-label-id", row.id),
      el("p", "lf-label-what", row.what.length > 70 ? `${row.what.slice(0, 69)}…` : row.what),
      el("p", "lf-label-meta", `${tx("Found")} ${showDate(row.date)}${row.time ? ` ${row.time}` : ""} · ${whereText(row)}`),
      el("p", "lf-label-meta", `${valueName(row.value)}${row.place ? ` · ${row.place}` : ""} · ${tx("keep until {date}", { date: showDate(M.keepUntil(row, data, r())) })}`),
    );
    sheet.append(label);
    document.body.append(sheet);
    document.body.classList.add("lf-printing-label");
    const done = () => {
      document.body.classList.remove("lf-printing-label");
      sheet.remove();
      window.removeEventListener("afterprint", done);
    };
    window.addEventListener("afterprint", done);
    window.print();
    // Browsers without afterprint (and the tests) get the page back after the dialog.
    setTimeout(() => { if (!window.matchMedia?.("print").matches) done(); }, 1000);
  };

  // Clicks in the result: a decision on a due item, or an item to open in box 4.
  results.addEventListener("click", (event) => {
    const decide = event.target.closest("[data-decide]");
    const open = event.target.closest("[data-pick]");
    if (decide) {
      const row = state.rows.find((item) => item.id === decide.dataset.decide);
      if (!row) return;
      addStep(row, decide.dataset.status);
      book.render();
      save();
      const status = results.querySelector("[data-decide-status]");
      if (status) flash(status, tx("{id}: {status}.", { id: row.id, status: statusName(decide.dataset.status) }));
      (results.querySelector("[data-decide]") || results.querySelector("[data-pick]") || results)?.focus();
    } else if (open) {
      choose(open.dataset.pick, { scroll: true });
    }
  });
  root.querySelector("[data-log]").addEventListener("click", (event) => {
    const open = event.target.closest("[data-pick]");
    if (open) choose(open.dataset.pick, { scroll: true });
  });

  pick.addEventListener("change", () => choose(pick.value));
  stepForm.addEventListener("change", (event) => { if (event.target.name === "step" || event.target.name === "how") syncStepFields(); });
  stepForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const row = selected();
    if (!row) return;
    const f = stepForm.elements;
    const date = parseDate(f.stepDate.value);
    if (!date) {
      f.stepDate.focus();
      flash(stepStatus, tx("Enter the date of the step."));
      return;
    }
    if (date < row.date) {
      f.stepDate.focus();
      flash(stepStatus, tx("A step cannot be before the day the item was found."));
      return;
    }
    const postage = parseNumber(f.stepPostage.value);
    addStep(row, f.step.value, {
      date,
      by: f.stepBy.value,
      delivery: { how: f.how.value, tracking: f.how.value === "post" ? f.tracking.value.trim() : "", postage: f.how.value === "post" && Number.isFinite(postage) && postage >= 0 ? Math.round(postage * 100) / 100 : null, paidBy: f.how.value === "post" ? f.paidBy.value : "" },
    });
    // The rows are sorted by date inside the history; a step dated earlier than the last one goes in its place.
    row.steps = M.cleanRow(row, data).steps;
    shownId = "";
    book.render();
    save();
    flash(stepStatus, tx("{id}: {status}.", { id: row.id, status: statusName(f.step.value) }));
  });
  stepForm.querySelector("[data-undo-step]").addEventListener("click", () => {
    const row = selected();
    if (!row || !row.steps.length) return;
    const removed = row.steps.pop();
    shownId = "";
    book.render();
    save();
    kit.undoNote(stepStatus, tx("Removed: {status} on {date}.", { status: statusName(removed.status), date: showDate(removed.date) }), () => {
      row.steps.push(removed);
      shownId = "";
      book.render();
      save();
    });
  });
  box.querySelector("#lf-channel").addEventListener("change", (event) => {
    state.channel = event.target.value === "whatsapp" ? "whatsapp" : "email";
    save();
    renderReply();
  });
  box.querySelector("#lf-postage").addEventListener("input", renderReply);
  box.querySelector("[data-copy-reply]").addEventListener("click", (event) => { if (replyBox.value) copy(replyBox.value, event.currentTarget); });
  box.querySelector("[data-label]").addEventListener("click", printLabel);
  if (Capture) itemPhotos = Capture.attach(box.querySelector("[data-item-photos]"), { tool: TOOL, ref: state.selected });

  // Guest names are personal data: once a case is closed, the name has done its job.
  root.querySelector("[data-forget]").addEventListener("click", () => {
    const closed = state.rows.filter((row) => !M.isOpen(row) && row.guest);
    const status = root.querySelector("[data-log-status]");
    if (!closed.length) {
      flash(status, tx("No closed item has a guest name."));
      return;
    }
    if (!window.confirm(tx("Remove the guest names of {n}?", { n: plural(closed.length, tx("closed item"), tx("closed items")) }))) return;
    closed.forEach((row) => { row.guest = ""; });
    book.render();
    save();
    flash(status, tx("Guest names removed from {n}.", { n: plural(closed.length, tx("closed item"), tx("closed items")) }));
  });

  const flagCell = (row) => {
    const flag = M.flagOf(row, today(), data, r());
    const cell = el("td", `lf-status is-${FLAG_STATE[flag] || "ok"}`);
    cell.append(el("span", null, `${shortStatus(M.statusOf(row))}${FLAG_WORDS()[flag] ? ` · ${flag === "over" ? "✕" : "!"} ${FLAG_WORDS()[flag]}` : ""}`));
    const open = el("button", "button-ghost lf-open", tx("Open it"));
    open.type = "button";
    open.dataset.pick = row.id;
    open.setAttribute("aria-label", `${tx("Open item")} ${row.id}`);
    cell.append(open);
    return cell;
  };

  const book = logBook({
    root,
    key: KEY,
    state,
    save,
    results,
    paste,
    clearExample: () => {
      state.me = "";
      state.hotel = "";
      state.selected = "";
    },
    cells: (row) => [
      el("td", "nowrap lf-id", row.id),
      el("td", "nowrap", `${showDate(row.date)}${row.time ? ` ${row.time}` : ""}`),
      el("td", null, whereText(row)),
      el("td", null, catName(row.category)),
      el("td", "dl-note", row.what),
      el("td", `nowrap${row.value === "high" ? " lf-high" : ""}`, valueName(row.value)),
      el("td", null, storedText(row)),
      flagCell(row),
    ],
    removeLabel: (row) => tx("Remove {id}", { id: row.id }),
    removedText: (row) => tx("Removed {id}.", { id: row.id }),
    countText: (rows) => `${items(rows.length)} · ${tx("{n} open", { n: int.format(rows.filter(M.isOpen).length) })}`,
    importRows: (text) => M.importRows(text, { ...data, areas: areas() }, takenIds()),
    importText: {
      none: tx("No rows found. Check that each row starts with the date the item was found."),
      done: (added, skipped) => `${tx("Imported {rows}", { rows: plural(added, tx("row"), tx("rows")) })}${skipped ? tx(", skipped {n} without a date", { n: skipped }) : ""}.`,
    },
    loadExample: () => {
      state.rows = M.exampleRows(data, today());
      state.me = data.example.me;
      state.hotel = data.example.hotel;
      state.selected = state.rows.find((row) => row.guest && M.isOpen(row))?.id || "";
      shownId = "";
    },
    clearText: tx("Clear the whole {tool} register?", { tool: t.tool }),
    csv: () => {
      const rules = r();
      return {
        name: t.csv,
        rows: [
          [tx("ID"), tx("Date found"), tx("Time"), tx("Area"), tx("Room"), tx("Category"), tx("Description"), tx("Value"), tx("Found by"), tx("Stored in"), tx("Tag number"), tx("Guest"), tx("Status"), tx("Status date"), tx("Who"), tx("Keep until"), tx("Returned how"), tx("Tracking number"), tx("Postage"), tx("Paid by")],
          ...state.rows.map((row) => {
            const last = lastStep(row);
            const sent = M.statusOf(row) === "returned" ? row.delivery : { how: "", tracking: "", postage: null, paidBy: "" };
            return [row.id, row.date, row.time, row.area, row.room, catName(row.category), row.what, valueName(row.value), row.foundBy, row.place, row.tag, row.guest, statusName(M.statusOf(row)), last?.date || row.date, last?.by || row.foundBy, M.keepUntil(row, data, rules), sent.how ? data.returnHow[sent.how] : "", sent.tracking, sent.postage ?? "", sent.paidBy ? data.paidBy[sent.paidBy] : ""];
          }),
        ],
      };
    },
    renderResults,
  });

  // Log a found item.
  fillChoices();
  window.addEventListener("workplace:changed", fillChoices);
  const form = entry.elements;
  form.date.value = today();
  form.time.value = new Date().toTimeString().slice(0, 5);
  showPendingId();
  // A category brings its usual value, and high value goes to the safe.
  form.category.addEventListener("change", () => {
    form.valueClass.value = M.categoryOf(data, form.category.value).value;
    if (form.valueClass.value === "high") form.place.value = data.safe;
  });
  form.valueClass.addEventListener("change", () => { if (form.valueClass.value === "high") form.place.value = data.safe; });
  form.category.dispatchEvent(new Event("change"));
  entry.addEventListener("submit", (event) => {
    event.preventDefault();
    const date = parseDate(form.date.value);
    if (!date) {
      form.date.focus();
      flash(entryStatus, tx("Enter the date the item was found."));
      return;
    }
    if (!form.what.value.trim()) {
      form.what.focus();
      flash(entryStatus, tx("Describe the item, so the guest and the team can recognise it."));
      return;
    }
    const taken = takenIds();
    const id = taken.has(pendingId) ? M.newId(date, taken) : pendingId;
    const [row] = M.cleanRows([{
      id,
      date,
      time: form.time.value,
      area: form.area.value,
      room: form.room.value,
      category: form.category.value,
      what: form.what.value,
      value: form.valueClass.value,
      foundBy: form.foundBy.value,
      place: form.place.value,
      tag: form.tag.value,
      guest: form.guest.value,
      steps: [],
    }], data, taken);
    // Keep the date, the area and who found it: the next item often comes from the same round.
    form.room.value = "";
    form.what.value = "";
    form.tag.value = "";
    form.guest.value = "";
    state.selected = row.id;
    shownId = "";
    book.add(row);
    pendingId = M.newId(today(), takenIds());
    showPendingId();
    entryPhotos?.setRef(pendingId);
    flash(entryStatus, tx("Added {id}: {item}.", { id: row.id, item: row.what }));
    form.what.focus();
  });

  book.render();
})();
