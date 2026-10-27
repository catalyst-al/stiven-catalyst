// The A3 Report: one Toyota A3 per problem, from its background to its follow-up, on one page. Several A3s are kept
// in this browser (cfg.storageKey), each saved as it is typed. The sheet in [data-results] is the A3 itself: boxes 1–4
// on the left, 5–7 on the right, the baseline, target and latest number as a chart, and a quality check of eight
// points. The arithmetic and the checks are in window.A3Math, so a test can call them without the page.
(() => {
  if (!window.ToolKit) return;
  const { LANG, tx, el, read, write, isObject, str, num, pct, int, showDate, today, addDays, parseNumber, parseDate, copy, flash, undoNote, stat, resultLayout, firstVisit } = window.ToolKit;

  // Arithmetic and checks ------------------------------------------------------------------------------------------------
  const TEXT_FIELDS = ["title", "owner", "date", "area", "background", "current", "baseline", "unit", "target", "targetValue", "targetBy", "rootCause", "how", "checkDate", "latest", "result"];
  const DATE_FIELDS = ["date", "targetBy", "checkDate"];
  const isDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value);
  const finite = (value) => typeof value === "number" && Number.isFinite(value);
  const id = () => `r${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

  // A saved A3 can be damaged or old; keep what has the right shape and fill the rest.
  const cleanReport = (item, statuses = []) => {
    const r = isObject(item) ? item : {};
    const out = { id: str(r.id) || id() };
    TEXT_FIELDS.forEach((name) => { out[name] = str(r[name]); });
    DATE_FIELDS.forEach((name) => { if (!isDate(out[name])) out[name] = ""; });
    out.countermeasures = (Array.isArray(r.countermeasures) ? r.countermeasures : []).filter(isObject).map((c) => ({
      text: str(c.text), owner: str(c.owner), due: isDate(str(c.due)) ? str(c.due) : "", status: statuses.includes(c.status) ? c.status : statuses[0] || "",
    }));
    out.plan = (Array.isArray(r.plan) ? r.plan : []).filter(isObject).map((s) => ({ step: str(s.step), date: isDate(str(s.date)) ? str(s.date) : "" }));
    out.updated = isDate(str(r.updated)) ? str(r.updated) : "";
    return out;
  };
  const blankReport = (day, statuses) => cleanReport({ date: day, countermeasures: [{ status: statuses[0] }], plan: [{}] }, statuses);
  // The example's dates are days relative to today, so it always reads as a recent A3.
  const exampleReport = (example, day, statuses) => {
    const at = (value) => (Number.isInteger(value) ? addDays(day, value) : str(value));
    return cleanReport({
      ...example, id: undefined, date: at(example.date), targetBy: at(example.targetBy), checkDate: at(example.checkDate), updated: day,
      countermeasures: (example.countermeasures || []).map((c) => ({ ...c, due: at(c.due) })),
      plan: (example.plan || []).map((s) => ({ ...s, date: at(s.date) })),
    }, statuses);
  };
  const hasContent = (r) => TEXT_FIELDS.some((name) => name !== "date" && r[name].trim())
    || r.countermeasures.some((c) => c.text.trim() || c.owner.trim()) || r.plan.some((s) => s.step.trim());

  // A word counts as a whole word only: "by" is in "bypass" and "last" in "elastic".
  const escape = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const hasWord = (text, words = []) => {
    const lower = String(text || "").toLocaleLowerCase();
    return words.some((word) => new RegExp(`(^|[^\\p{L}\\p{N}])${escape(String(word).toLocaleLowerCase())}(?=$|[^\\p{L}\\p{N}])`, "u").test(lower));
  };
  // A year, a date (12.03., 2026-03-12) or a calendar week (KW 12) is a time frame in any language.
  const hasDateLike = (text) => /\b(19|20)\d{2}\b|\b\d{1,2}\.\d{1,2}\.|\bkw\s?\d{1,2}\b|\b\d{1,2}\/\d{1,2}\b/i.test(String(text || ""));
  const numberIn = (value) => finite(parseNumber(value));
  // The eight points of a sound A3. Each item: key, ok, label (what good looks like), hint (what to do).
  const CHECKS = ["number", "time", "targetNumber", "targetDate", "cause", "owners", "dates", "measure"];
  const check = (r, cfg) => {
    const report = cleanReport(r, cfg.statuses);
    const measures = report.countermeasures.filter((c) => c.text.trim());
    const cause = report.rootCause.trim();
    const ok = {
      number: numberIn(report.baseline) || /\d/.test(report.current),
      time: hasWord(report.current, cfg.timeWords) || hasDateLike(report.current),
      targetNumber: numberIn(report.targetValue) || /\d/.test(report.target),
      targetDate: isDate(report.targetBy) || hasWord(report.target, cfg.timeWords) || hasDateLike(report.target),
      cause: cause.length >= 12 && !hasWord(cause, cfg.blameWords),
      owners: measures.length > 0 && measures.every((c) => c.owner.trim()),
      dates: measures.length > 0 && measures.every((c) => c.due),
      measure: report.how.trim().length > 0 && (hasWord(report.how, cfg.measureWords) || /[\d%]/.test(report.how)),
    };
    const items = CHECKS.map((key) => ({ key, ok: Boolean(ok[key]), label: cfg.checks?.[key]?.[0] || key, hint: cfg.checks?.[key]?.[1] || "" }));
    return { items, score: items.filter((item) => item.ok).length, total: items.length };
  };

  // The gap between today's number and the target, and how much of it the latest number closed. A target below the
  // baseline means lower is better (damage, delays); above it, higher is better (on-time, first-pass yield).
  const gap = (baseline, target, latest) => {
    const b = typeof baseline === "number" ? baseline : parseNumber(baseline);
    const t = typeof target === "number" ? target : parseNumber(target);
    const l = typeof latest === "number" ? latest : parseNumber(latest);
    if (!finite(b) || !finite(t)) return null;
    const down = t < b;
    const size = Math.abs(b - t);
    const out = { baseline: b, target: t, latest: null, down, size, relative: b ? (t - b) / b : null, closed: null, remaining: null, reached: false };
    if (finite(l)) {
      out.latest = l;
      out.closed = size ? (down ? b - l : l - b) / size : (l === t ? 1 : 0);
      out.remaining = Math.max(0, down ? l - t : t - l);
      out.reached = down ? l <= t : l >= t;
    }
    return out;
  };
  // Decimals the person typed (0.57 has two), so the sheet shows the numbers as precise as they were given.
  const digitsOf = (...values) => Math.min(3, Math.max(0, ...values.map((value) => {
    const match = String(value || "").trim().match(/[.,](\d+)$/);
    return match ? match[1].length : 0;
  })));

  // A 5 Whys worksheet (its saved fields) as an A3 root-cause box and a countermeasure.
  const fromWhys = (saved, labels = {}) => {
    if (!isObject(saved)) return null;
    const value = (name) => str(saved[name]).trim();
    const whys = Object.keys(saved).filter((name) => /^why\d+$/.test(name)).sort((a, b) => Number(a.slice(3)) - Number(b.slice(3))).map(value).filter(Boolean);
    if (!value("problem") && !whys.length && !value("cause")) return null;
    const why = labels.why || "Why?";
    const lines = whys.map((answer) => `${why} ${answer}`);
    if (value("cause")) lines.push(`${labels.cause || "Root cause"}: ${value("cause")}`);
    return {
      problem: value("problem"),
      rootCause: lines.join("\n"),
      countermeasure: value("action") ? { text: value("action"), owner: value("owner"), due: isDate(value("due")) ? value("due") : "" } : null,
      check: value("check"),
    };
  };

  // The Pareto 80/20 tool keeps its table in sc-pareto: its few largest causes and their share, for box 2.
  const fold = (text) => String(text ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/ß/g, "ss").replace(/[^\p{L}\p{N}%€]+/gu, " ").trim();
  const paretoTop = (saved, n = 3) => {
    if (!isObject(saved) || !isObject(saved.source) || !Array.isArray(saved.source.rows) || !isObject(saved.map) || !(saved.map.category >= 0)) return null;
    const map = saved.map;
    const merges = new Map((Array.isArray(saved.merges) ? saved.merges : []).filter((pair) => Array.isArray(pair) && pair.length === 2).map(([from, to]) => [fold(from), String(to)]));
    const byValue = saved.measure === "value" && map.value >= 0;
    const from = parseDate(str(saved.from)), to = parseDate(str(saved.to));
    const groups = new Map();
    let total = 0;
    saved.source.rows.forEach((row) => {
      if (!Array.isArray(row) || !row.some((cell) => String(cell ?? "").trim())) return;
      if (map.filter >= 0 && saved.filterValue && fold(row[map.filter]) !== fold(saved.filterValue)) return;
      if (map.date >= 0 && (from || to)) {
        const date = parseDate(row[map.date]);
        if (!date || (from && date < from) || (to && date > to)) return;
      }
      const amount = byValue ? parseNumber(row[map.value]) : map.count >= 0 ? parseNumber(row[map.count]) : 1;
      if (!finite(amount) || amount < 0) return;
      const raw = String(row[map.category] ?? "").replace(/\s+/g, " ").trim();
      if (!raw) return;
      const name = merges.get(fold(raw)) || raw;
      const group = groups.get(fold(name)) || { name, value: 0 };
      group.value += amount;
      groups.set(fold(name), group);
      total += amount;
    });
    if (!total) return null;
    const sorted = [...groups.values()].sort((a, b) => b.value - a.value);
    const top = sorted.slice(0, n).map((g) => ({ name: g.name, value: g.value, share: g.value / total }));
    return { name: str(saved.source.name), total, causes: sorted.length, top, share: top.reduce((sum, g) => sum + g.share, 0) };
  };

  // An A3 countermeasure's status (a word of the page's language) as the Action Tracker's.
  const STORE_STATUSES = ["open", "doing", "done", "verified"];
  const storeStatus = (status, statuses) => STORE_STATUSES[statuses.indexOf(status)] || "open";

  window.A3Math = { cleanReport, blankReport, exampleReport, hasContent, hasWord, check, gap, digitsOf, fromWhys, paretoTop, storeStatus, CHECKS };

  // The page ----------------------------------------------------------------------------------------------------------
  const dataEl = document.getElementById("a3-report-data");
  const root = document.querySelector("[data-a3-report]");
  const results = document.querySelector("[data-results]");
  if (!dataEl || !root || !results) return;
  const cfg = JSON.parse(dataEl.textContent);
  const statuses = Array.isArray(cfg.statuses) && cfg.statuses.length ? cfg.statuses : ["Open", "Doing", "Done", "Verified"];
  const CK = window.ChartKit;
  const S = window.ActionsStore;
  const form = root.querySelector("[data-a3-form]");
  const $ = (selector) => root.querySelector(selector);
  const list = $("[data-list]");
  const listEmpty = $("[data-list-empty]");
  const listCount = $("[data-list-count]");
  const listStatus = $("[data-list-status]");
  const exampleAgain = $("[data-example-again]");
  const saveStatus = $("[data-save-status]");
  const cmsBox = $("[data-cms]");
  const planBox = $("[data-plan]");

  const saved = read(cfg.storageKey, null);
  const state = {
    reports: isObject(saved) && Array.isArray(saved.reports) ? saved.reports.map((r) => cleanReport(r, statuses)) : [],
    current: isObject(saved) ? str(saved.current) : "",
    example: isObject(saved) ? str(saved.example) : "",
    paper: isObject(saved) && saved.paper === "a4" ? "a4" : "a3",
  };
  if (!state.reports.some((r) => r.id === state.example)) state.example = "";
  const current = () => state.reports.find((r) => r.id === state.current) || null;
  const savedText = tx("Saved in this browser.");
  const save = () => {
    if (!write(cfg.storageKey, state)) saveStatus.textContent = tx("Not saved: this browser blocks storage. Copy the text or download the Word file to keep it.");
    else saveStatus.textContent = savedText;
  };

  // Numbers and words for the sheet ------------------------------------------------------------------------------------
  const box = (key) => cfg.boxes?.[key] || {};
  const boxTitle = (n, key) => `${n} · ${box(key).title || key}`;
  // 0.57% in English and Albanian, 0,57 % in German; any other unit after a space.
  const withUnit = (text, unit) => {
    const u = String(unit || "").trim();
    if (!u) return text;
    if (u.startsWith("%")) return `${text}${LANG === "de" ? " " : ""}${u}`;
    return `${text} ${u}`;
  };
  const numbers = (r) => {
    const digits = digitsOf(r.baseline, r.targetValue, r.latest);
    const g = gap(r.baseline, r.targetValue, r.latest);
    const show = (value) => (finite(value) ? num(value, digits) : "–");
    return { digits, g, show, b: parseNumber(r.baseline), t: parseNumber(r.targetValue), l: parseNumber(r.latest) };
  };
  const gapText = (r) => {
    const { g, show } = numbers(r);
    if (!g) return "";
    const rel = g.relative !== null ? ` (${g.relative > 0 ? "+" : ""}${pct(g.relative, 0)})` : "";
    return `${tx("Gap")}: ${withUnit(show(g.size), r.unit.trim().startsWith("%") ? "" : r.unit)}${rel}`;
  };
  const verdict = (r) => {
    const { g, show } = numbers(r);
    if (!g) return tx("Give the key number today and the target number to see the gap.");
    if (g.latest === null) return tx("Gap to close: {gap}. Add the latest value in box 7 when you check.", { gap: show(g.size) });
    if (g.reached) return tx("Target reached: {latest} against a target of {target}.", { latest: withUnit(show(g.latest), r.unit), target: withUnit(show(g.target), r.unit) });
    return tx("{share} of the gap closed; {remaining} still to go.", { share: pct(Math.max(0, g.closed), 0), remaining: show(g.remaining) });
  };
  const nameOf = (r) => r.title.trim() || tx("Untitled A3");

  // Copy as text ------------------------------------------------------------------------------------------------------
  const asText = (r) => {
    const { show, g } = numbers(r);
    const q = check(r, cfg);
    const lines = [`A3 · ${nameOf(r)}`, [r.owner && `${tx("Owner")}: ${r.owner}`, r.area && `${tx("Area or team")}: ${r.area}`, r.date && `${tx("Date")}: ${showDate(r.date)}`].filter(Boolean).join(" · "), ""];
    const block = (n, key, text, extra = []) => { lines.push(boxTitle(n, key), text.trim() || "–", ...extra.filter(Boolean), ""); };
    block(1, "background", r.background);
    block(2, "current", r.current, [numberIn(r.baseline) && `${tx("Key number today")}: ${withUnit(show(parseNumber(r.baseline)), r.unit)}`]);
    block(3, "target", r.target, [numberIn(r.targetValue) && `${tx("Target number")}: ${withUnit(show(parseNumber(r.targetValue)), r.unit)}${r.targetBy ? ` · ${tx("By when")}: ${showDate(r.targetBy)}` : ""}`, g && gapText(r)]);
    block(4, "cause", r.rootCause);
    lines.push(boxTitle(5, "countermeasures"));
    const measures = r.countermeasures.filter((c) => c.text.trim());
    if (!measures.length) lines.push("–");
    measures.forEach((c) => lines.push(`- ${c.text.trim()} (${[c.owner || tx("no owner"), c.due ? showDate(c.due) : tx("no date"), c.status].filter(Boolean).join(", ")})`));
    lines.push("", boxTitle(6, "plan"));
    const steps = r.plan.filter((s) => s.step.trim());
    if (!steps.length) lines.push("–");
    steps.forEach((s, i) => lines.push(`${i + 1}. ${s.date ? `${showDate(s.date)}: ` : ""}${s.step.trim()}`));
    lines.push("", boxTitle(7, "followUp"));
    if (r.how) lines.push(`${tx("How will you check?")} ${r.how}`);
    if (r.checkDate) lines.push(`${tx("Check date")}: ${showDate(r.checkDate)}`);
    if (numberIn(r.latest)) lines.push(`${tx("Latest value")}: ${withUnit(show(parseNumber(r.latest)), r.unit)}`);
    if (r.result) lines.push(`${tx("Result")}: ${r.result}`);
    if (!r.how && !r.checkDate && !r.result && !numberIn(r.latest)) lines.push("–");
    lines.push("", `${tx("Quality check")}: ${q.score}/${q.total}`);
    return lines.join("\n");
  };

  // Word ---------------------------------------------------------------------------------------------------------------
  const wordFile = (r) => {
    const kit = window.DocxKit;
    if (!kit) return null;
    const { run, para, TEXT_WIDTH } = kit;
    const GREY = '<w:color w:val="555555"/>';
    const SMALL = '<w:sz w:val="18"/><w:szCs w:val="18"/>';
    const { show, g } = numbers(r);
    const body = [];
    const heading = (text) => body.push(para(run(text), '<w:pStyle w:val="Heading1"/>'));
    const text = (value) => {
      const parts = String(value || "").split(/\n/).map((line) => line.trim()).filter(Boolean);
      (parts.length ? parts : ["–"]).forEach((line) => body.push(para(run(line))));
    };
    const pair = (label, value) => { if (value) body.push(para(run(`${label}: `, "<w:b/>") + run(value))); };
    body.push(para(run(`A3 · ${nameOf(r)}`), '<w:pStyle w:val="Title"/>'));
    body.push(para(run([r.owner, r.area, r.date && showDate(r.date)].filter(Boolean).join(" · "), GREY + SMALL), '<w:spacing w:after="200"/>'));
    heading(boxTitle(1, "background")); text(r.background);
    heading(boxTitle(2, "current")); text(r.current);
    if (numberIn(r.baseline)) pair(tx("Key number today"), withUnit(show(parseNumber(r.baseline)), r.unit));
    heading(boxTitle(3, "target")); text(r.target);
    if (numberIn(r.targetValue)) pair(tx("Target number"), withUnit(show(parseNumber(r.targetValue)), r.unit));
    if (r.targetBy) pair(tx("By when"), showDate(r.targetBy));
    if (g) body.push(para(run(gapText(r), GREY)));
    heading(boxTitle(4, "cause")); text(r.rootCause);
    heading(boxTitle(5, "countermeasures"));
    const measures = r.countermeasures.filter((c) => c.text.trim());
    if (measures.length) {
      const widths = [4638, 2200, 1400, 1400];
      const edge = (side) => `<w:${side} w:val="single" w:sz="4" w:space="0" w:color="BBBBBB"/>`;
      const cell = (value, width, header) => `<w:tc><w:tcPr><w:tcW w:w="${width}" w:type="dxa"/>${header ? '<w:shd w:val="clear" w:color="auto" w:fill="EEF2F7"/>' : ""}</w:tcPr>${para(run(value || "–", header ? "<w:b/>" : ""), '<w:spacing w:before="40" w:after="40"/>')}</w:tc>`;
      const rows = [[tx("What"), tx("Owner"), tx("Due date"), tx("Status")], ...measures.map((c) => [c.text.trim(), c.owner, c.due ? showDate(c.due) : "", c.status])];
      body.push(`<w:tbl><w:tblPr><w:tblW w:w="${TEXT_WIDTH}" w:type="dxa"/><w:tblBorders>${["top", "left", "bottom", "right", "insideH", "insideV"].map(edge).join("")}</w:tblBorders><w:tblCellMar><w:left w:w="80" w:type="dxa"/><w:right w:w="80" w:type="dxa"/></w:tblCellMar></w:tblPr><w:tblGrid>${widths.map((w) => `<w:gridCol w:w="${w}"/>`).join("")}</w:tblGrid>${rows.map((row, i) => `<w:tr>${i === 0 ? "<w:trPr><w:tblHeader/></w:trPr>" : ""}${row.map((value, j) => cell(value, widths[j], i === 0)).join("")}</w:tr>`).join("")}</w:tbl>`);
    } else text("");
    heading(boxTitle(6, "plan"));
    const steps = r.plan.filter((s) => s.step.trim());
    if (!steps.length) text("");
    steps.forEach((s, i) => body.push(para(run(`${i + 1}.  ${s.date ? `${showDate(s.date)}  ` : ""}`, "<w:b/>") + run(s.step.trim()), '<w:ind w:left="397" w:hanging="397"/>')));
    heading(boxTitle(7, "followUp"));
    pair(tx("How will you check?").replace(/\?$/, ""), r.how);
    pair(tx("Check date"), r.checkDate && showDate(r.checkDate));
    pair(tx("Latest value"), numberIn(r.latest) ? withUnit(show(parseNumber(r.latest)), r.unit) : "");
    pair(tx("Result"), r.result);
    const q = check(r, cfg);
    body.push(para(run(`${tx("Quality check")}: ${q.score}/${q.total}`, GREY + SMALL), '<w:spacing w:before="240"/>'));
    return kit.wordFile({ body, font: "Arial", accent: "0a6ab0", lang: LANG, title: `A3 · ${nameOf(r)}`, creator: r.owner });
  };
  const fileSlug = (r) => (fold(nameOf(r)).replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").slice(0, 40) || "a3");
  const downloadWord = (r) => {
    const bytes = wordFile(r);
    if (!bytes) return;
    const link = el("a");
    link.href = URL.createObjectURL(new Blob([bytes], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }));
    link.download = `a3-${fileSlug(r)}-${today()}.docx`;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  };
  window.A3Math.asText = asText;
  window.A3Math.wordFile = wordFile;

  // The example note ---------------------------------------------------------------------------------------------------
  const exampleNote = el("div", "dl-example-note");
  exampleNote.setAttribute("role", "status");
  exampleNote.hidden = true;
  const clearExample = el("button", "button-ghost", tx("Clear the example"));
  clearExample.type = "button";
  exampleNote.append(el("strong", null, tx("Example")), " ", el("span", null, tx("This is an example, so you can see what the tool shows. Add your own entries and it disappears, or clear it now.")), " ", clearExample);
  root.prepend(exampleNote);

  // The form -----------------------------------------------------------------------------------------------------------
  const field = (idText, label, node, className) => {
    const wrap = el("div", `field${className ? ` ${className}` : ""}`);
    const lab = el("label", null, label);
    lab.htmlFor = idText;
    node.id = idText;
    wrap.append(lab, node);
    return wrap;
  };
  const input = (key, value, type = "text", placeholder = "") => {
    const node = el("input");
    node.type = type;
    node.value = value || "";
    node.dataset.key = key;
    node.autocomplete = "off";
    if (placeholder) node.placeholder = placeholder;
    return node;
  };
  const removeButton = (label) => {
    const button = el("button", "button-ghost a3-remove", tx("Remove"));
    button.type = "button";
    button.dataset.remove = "";
    button.setAttribute("aria-label", `${tx("Remove")}: ${label}`);
    return button;
  };
  const renderRows = () => {
    const r = current();
    const cms = r ? r.countermeasures : [];
    cmsBox.replaceChildren(...cms.map((c, i) => {
      const row = el("div", "a3-row a3-cm");
      row.dataset.list = "countermeasures";
      row.dataset.index = String(i);
      const select = el("select");
      select.dataset.key = "status";
      statuses.forEach((s) => { const option = el("option", null, s); option.value = s; option.selected = s === c.status; select.append(option); });
      row.append(
        field(`a3-cm-text-${i}`, `${tx("Countermeasure")} ${i + 1}`, input("text", c.text, "text", cfg.fields?.countermeasure), "a3-what"),
        field(`a3-cm-owner-${i}`, tx("Owner"), input("owner", c.owner, "text", cfg.fields?.cmOwner)),
        field(`a3-cm-due-${i}`, tx("Due date"), input("due", c.due, "date")),
        field(`a3-cm-status-${i}`, tx("Status"), select),
        removeButton(`${tx("Countermeasure")} ${i + 1}`),
      );
      return row;
    }));
    const steps = r ? r.plan : [];
    planBox.replaceChildren(...steps.map((s, i) => {
      const row = el("div", "a3-row a3-step");
      row.dataset.list = "plan";
      row.dataset.index = String(i);
      row.append(
        field(`a3-step-${i}`, `${tx("Step")} ${i + 1}`, input("step", s.step, "text", cfg.fields?.step), "a3-what"),
        field(`a3-step-date-${i}`, tx("Date"), input("date", s.date, "date")),
        removeButton(`${tx("Step")} ${i + 1}`),
      );
      return row;
    }));
  };
  const fillForm = () => {
    const r = current();
    TEXT_FIELDS.forEach((name) => { if (form.elements[name]) form.elements[name].value = r ? r[name] : name === "date" ? today() : ""; });
    renderRows();
  };
  // Typing into an empty page starts an A3: nobody has to press "New" first.
  const ensureCurrent = () => {
    let r = current();
    if (r) return r;
    r = blankReport(today(), statuses);
    r.countermeasures = [];
    r.plan = [];
    state.reports.unshift(r);
    state.current = r.id;
    return r;
  };
  const edited = (r) => {
    r.updated = today();
    // The first change to the example makes it this person's A3; the note goes.
    if (state.example === r.id) state.example = "";
    save();
    renderAll();
  };
  const onInput = (event) => {
    const target = event.target;
    const row = target.closest?.("[data-list]");
    if (row && target.dataset.key) {
      const r = ensureCurrent();
      const item = r[row.dataset.list]?.[Number(row.dataset.index)];
      if (!item || item[target.dataset.key] === target.value) return;
      item[target.dataset.key] = target.value;
      edited(r);
      return;
    }
    if (!TEXT_FIELDS.includes(target.name)) return;
    const r = ensureCurrent();
    if (r[target.name] === target.value) return;
    r[target.name] = target.value;
    edited(r);
  };
  form.addEventListener("input", onInput);
  form.addEventListener("change", onInput);
  form.addEventListener("submit", (event) => event.preventDefault());
  form.addEventListener("click", (event) => {
    const button = event.target.closest?.("[data-remove]");
    if (!button) return;
    const row = button.closest("[data-list]");
    const r = current();
    if (!r || !row) return;
    r[row.dataset.list].splice(Number(row.dataset.index), 1);
    edited(r);
    renderRows();
  });
  const addRow = (listName, item, focusKey) => {
    const r = ensureCurrent();
    r[listName].push(item);
    edited(r);
    renderRows();
    const rows = (listName === "plan" ? planBox : cmsBox).querySelectorAll(`[data-key="${focusKey}"]`);
    rows[rows.length - 1]?.focus();
  };
  $("[data-add-cm]").addEventListener("click", () => addRow("countermeasures", { text: "", owner: "", due: "", status: statuses[0] }, "text"));
  $("[data-add-step]").addEventListener("click", () => addRow("plan", { step: "", date: "" }, "step"));

  // Coaching hints under the boxes: what the quality check still misses, where it is missed.
  const NUDGE_AT = { number: "#a3-current", time: "#a3-current", targetNumber: "#a3-target", targetDate: "#a3-target", cause: "#a3-cause", owners: "[data-cms]", dates: "[data-cms]", measure: "#a3-how" };
  const nudges = new Map();
  Object.values(NUDGE_AT).forEach((selector) => {
    if (nudges.has(selector)) return;
    const node = $(selector);
    const set = node?.closest("fieldset");
    if (!set) return;
    const note = el("p", "a3-nudge");
    note.hidden = true;
    set.querySelector(".a3-hint")?.after(note);
    nudges.set(selector, note);
  });
  const renderNudges = (r) => {
    const q = r && hasContent(r) ? check(r, cfg) : null;
    const bySelector = new Map();
    (q ? q.items.filter((item) => !item.ok) : []).forEach((item) => {
      const selector = NUDGE_AT[item.key];
      if (!bySelector.has(selector)) bySelector.set(selector, []);
      bySelector.get(selector).push(item.hint);
    });
    nudges.forEach((note, selector) => {
      const hints = bySelector.get(selector);
      note.hidden = !hints;
      note.textContent = hints ? `${tx("To do")}: ${hints.join(" · ")}` : "";
    });
  };

  // The list of A3s -----------------------------------------------------------------------------------------------------
  const open = (reportId) => {
    state.current = reportId;
    save();
    fillForm();
    renderAll();
  };
  const renderList = () => {
    list.replaceChildren(...state.reports.map((r, index) => {
      const li = el("li", "a3-item");
      if (r.id === state.current) li.setAttribute("aria-current", "true");
      const openButton = el("button", "a3-open", nameOf(r));
      openButton.type = "button";
      openButton.addEventListener("click", () => open(r.id));
      const q = check(r, cfg);
      const meta = el("span", "a3-meta", [r.owner, r.date && showDate(r.date), `${tx("Quality check")} ${q.score}/${q.total}`, r.id === state.example ? tx("Example") : ""].filter(Boolean).join(" · "));
      const tools = el("span", "a3-item-tools");
      const dup = el("button", "button-ghost", tx("Duplicate"));
      dup.type = "button";
      dup.setAttribute("aria-label", `${tx("Duplicate")}: ${nameOf(r)}`);
      dup.addEventListener("click", () => {
        const copyOf = cleanReport({ ...JSON.parse(JSON.stringify(r)), id: "", title: `${nameOf(r)} ${tx("(copy)")}`, updated: today() }, statuses);
        state.reports.splice(index + 1, 0, copyOf);
        open(copyOf.id);
        flash(listStatus, tx("Duplicated: {text}", { text: nameOf(r) }));
      });
      const del = el("button", "button-ghost", tx("Delete"));
      del.type = "button";
      del.setAttribute("aria-label", `${tx("Delete")}: ${nameOf(r)}`);
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
        undoNote(listStatus, tx("Deleted: {text}", { text: nameOf(gone) }), () => {
          state.reports.splice(Math.min(at, state.reports.length), 0, gone);
          if (wasExample) state.example = gone.id;
          if (wasCurrent) state.current = gone.id;
          save();
          fillForm();
          renderAll();
        });
      });
      tools.append(dup, del);
      li.append(openButton, meta, tools);
      return li;
    }));
    list.hidden = !state.reports.length;
    listEmpty.hidden = state.reports.length > 0;
    exampleAgain.hidden = !state.reports.length || Boolean(state.example);
    listCount.textContent = state.reports.length === 1 ? tx("1 A3 saved") : state.reports.length ? tx("{n} A3s saved", { n: int.format(state.reports.length) }) : "";
  };

  // The sheet ------------------------------------------------------------------------------------------------------------
  const paragraphs = (text) => {
    const parts = String(text || "").split(/\n{2,}/).map((part) => part.trim()).filter(Boolean);
    if (!parts.length) return [el("p", "a3-empty", tx("Not filled in yet."))];
    return parts.map((part) => el("p", "a3-text", part));
  };
  const sheetBox = (n, key, ...content) => {
    const article = el("article", `a3-box a3-box-${key}`);
    article.append(el("h3", "a3-box-title", boxTitle(n, key)), ...content.filter(Boolean));
    return article;
  };
  const keyLine = (label, value) => {
    const p = el("p", "a3-key");
    p.append(el("span", null, `${label} `), el("strong", null, value));
    return p;
  };
  const chart = (r) => {
    const { g, show } = numbers(r);
    if (!CK || !g) return null;
    const items = [
      { label: tx("Baseline"), value: g.baseline, color: CK.C.muted },
      { label: tx("Target"), value: g.target, color: CK.C.blue },
    ];
    if (g.latest !== null) items.push({ label: tx("Latest"), value: g.latest, state: g.reached ? "ok" : "warn", tip: `${tx("Latest")}: ${show(g.latest)} · ${g.reached ? tx("target reached") : tx("target not reached yet")}` });
    const svg = CK.bars(items, { title: tx("Baseline, target and latest value"), unit: r.unit, target: g.target, targetLabel: tx("Target"), format: (v) => num(v, Math.max(1, numbers(r).digits)), highlight: () => false });
    return CK.figure(svg, { fileName: `a3-${fileSlug(r)}`, caption: g.latest === null ? tx("Baseline against target. The latest value appears once you check.") : verdict(r) });
  };
  const renderSheet = (r) => {
    results.replaceChildren();
    const show = Boolean(r && hasContent(r));
    results.hidden = !show;
    results.classList.toggle("a3-paper-a4", state.paper === "a4");
    results.classList.toggle("a3-paper-a3", state.paper !== "a4");
    if (!show) return;
    const n = numbers(r);
    const q = check(r, cfg);
    const head = el("div", "result-head");
    head.append(el("p", "result-label", tx("Your A3")));
    const h2 = el("h2", null, nameOf(r));
    head.append(h2, el("p", null, verdict(r)));
    const stats = el("div", "dl-stats");
    stats.append(
      stat(tx("Baseline"), finite(n.b) ? withUnit(n.show(n.b), r.unit.trim().startsWith("%") ? "%" : "") : "–", r.date ? showDate(r.date) : ""),
      stat(tx("Target"), finite(n.t) ? withUnit(n.show(n.t), r.unit.trim().startsWith("%") ? "%" : "") : "–", r.targetBy ? `${tx("by")} ${showDate(r.targetBy)}` : ""),
      stat(tx("Latest"), finite(n.l) ? withUnit(n.show(n.l), r.unit.trim().startsWith("%") ? "%" : "") : "–", r.checkDate ? showDate(r.checkDate) : ""),
      stat(tx("Gap closed"), n.g && n.g.closed !== null ? pct(Math.max(0, n.g.closed), 0) : "–", n.g ? `${tx("Gap")} ${n.show(n.g.size)}` : ""),
      stat(tx("Quality check"), `${q.score}/${q.total}`, q.score === q.total ? tx("ready to present") : tx("{n} to fix", { n: q.total - q.score })),
    );
    // The quality check as chips: the sign and the words carry the result, the colour only repeats it.
    const quality = el("div", "a3-quality");
    quality.append(el("p", "result-label", `${tx("Quality check")} · ${q.score}/${q.total}`));
    const chips = el("ul", "ck-chips");
    q.items.forEach((item) => {
      const chip = el("li", `ck-chip ${item.ok ? "is-ok" : "is-warn"}`, `${item.ok ? "✓" : "!"} ${item.label}`);
      if (!item.ok) chip.title = item.hint;
      chips.append(chip);
    });
    quality.append(chips);
    const missing = q.items.filter((item) => !item.ok);
    if (missing.length) quality.append(el("p", "form-note a3-next", `${tx("Next")}: ${missing[0].hint}`));

    // The sheet itself.
    const sheet = el("div", "a3-sheet");
    const sheetHead = el("header", "a3-sheet-head");
    sheetHead.append(el("p", "a3-sheet-title", `A3 · ${nameOf(r)}`), el("p", "a3-sheet-meta", [r.owner && `${tx("Owner")}: ${r.owner}`, r.area, r.date && showDate(r.date), `${tx("Quality check")} ${q.score}/${q.total}`].filter(Boolean).join(" · ")));
    const left = el("div", "a3-col a3-left");
    const right = el("div", "a3-col a3-right");
    left.append(
      sheetBox(1, "background", ...paragraphs(r.background)),
      sheetBox(2, "current", ...paragraphs(r.current), finite(n.b) ? keyLine(tx("Key number today"), withUnit(n.show(n.b), r.unit)) : null),
      sheetBox(3, "target", ...paragraphs(r.target),
        finite(n.t) ? keyLine(tx("Target number"), `${withUnit(n.show(n.t), r.unit)}${r.targetBy ? ` · ${tx("by")} ${showDate(r.targetBy)}` : ""}`) : null,
        n.g ? el("p", "a3-gap", gapText(r)) : null),
      sheetBox(4, "cause", ...paragraphs(r.rootCause)),
    );
    const measures = r.countermeasures.filter((c) => c.text.trim());
    let table = el("p", "a3-empty", tx("Not filled in yet."));
    if (measures.length) {
      table = el("div", "dl-table-wrap a3-table-wrap");
      const t = el("table", "dl-table a3-table");
      const thead = el("thead");
      const hr = el("tr");
      [tx("What"), tx("Owner"), tx("Due date"), tx("Status")].forEach((label) => { const th = el("th", null, label); th.scope = "col"; hr.append(th); });
      thead.append(hr);
      const tbody = el("tbody");
      measures.forEach((c) => {
        const tr = el("tr");
        const late = c.due && c.due < today() && storeStatus(c.status, statuses) !== "done" && storeStatus(c.status, statuses) !== "verified";
        tr.append(el("td", null, c.text.trim()), el("td", c.owner ? null : "a3-missing", c.owner || tx("no owner")), el("td", c.due ? (late ? "a3-late" : null) : "a3-missing", c.due ? `${showDate(c.due)}${late ? ` · ${tx("overdue")}` : ""}` : tx("no date")), el("td", null, c.status));
        tbody.append(tr);
      });
      t.append(thead, tbody);
      table.append(t);
    }
    const steps = r.plan.filter((s) => s.step.trim());
    let plan = el("p", "a3-empty", tx("Not filled in yet."));
    if (steps.length) {
      plan = el("ol", "a3-steps");
      steps.forEach((s) => { const li = el("li"); if (s.date) li.append(el("strong", null, showDate(s.date))); li.append(el("span", null, s.step.trim())); plan.append(li); });
    }
    const follow = [];
    if (r.how.trim()) follow.push(keyLine(tx("How will you check?"), r.how.trim()));
    if (r.checkDate) follow.push(keyLine(tx("Check date"), showDate(r.checkDate)));
    if (finite(n.l)) follow.push(keyLine(tx("Latest value"), withUnit(n.show(n.l), r.unit)));
    if (r.result.trim()) follow.push(...paragraphs(r.result));
    if (!follow.length) follow.push(el("p", "a3-empty", tx("Not filled in yet.")));
    right.append(sheetBox(5, "countermeasures", table), sheetBox(6, "plan", plan), sheetBox(7, "followUp", ...follow, chart(r)));
    sheet.append(sheetHead, left, right);

    // Copy, print on A3 or A4, Word.
    const actions = el("div", "tool-actions result-actions");
    const copyButton = el("button", "button-primary", tx("Copy as text"));
    copyButton.type = "button";
    copyButton.addEventListener("click", () => copy(asText(r), copyButton));
    const printButton = el("button", "button-secondary", tx("Print or save as PDF"));
    printButton.type = "button";
    printButton.addEventListener("click", () => window.print());
    const paper = el("div", "a3-paper");
    paper.setAttribute("role", "group");
    paper.setAttribute("aria-label", tx("Paper size"));
    [["a3", tx("A3 landscape")], ["a4", tx("A4 landscape")]].forEach(([key, label]) => {
      const button = el("button", "button-ghost", label);
      button.type = "button";
      button.setAttribute("aria-pressed", String(state.paper === key));
      button.addEventListener("click", () => { state.paper = key; save(); renderSheet(current()); });
      paper.append(button);
    });
    const wordButton = el("button", "button-secondary", tx("Download Word"));
    wordButton.type = "button";
    wordButton.hidden = !window.DocxKit;
    wordButton.addEventListener("click", () => downloadWord(r));
    actions.append(copyButton, printButton, wordButton, paper);
    resultLayout(results, { head, stats, notes: [quality], focus: sheet, actions });
  };

  // The 5 Whys link carries this A3's problem, so the worksheet starts from it.
  const fiveWhys = $("[data-five-whys]");
  const fiveWhysBase = fiveWhys?.getAttribute("href") || "../five-whys/";
  const renderLinks = (r) => {
    if (!fiveWhys) return;
    const url = new URL(fiveWhysBase, location.href);
    const problem = r ? (r.title.trim() || r.current.trim().split("\n")[0]) : "";
    if (problem) url.searchParams.set("problem", problem.slice(0, 300));
    fiveWhys.href = url.href;
  };

  const renderAll = () => {
    const r = current();
    exampleNote.hidden = !state.example || state.example !== state.current;
    renderList();
    renderNudges(r);
    renderLinks(r);
    renderSheet(r);
  };

  // Buttons ----------------------------------------------------------------------------------------------------------
  const loadExample = () => {
    const existing = state.reports.find((r) => r.id === state.example);
    if (existing) { open(existing.id); return; }
    const r = exampleReport(cfg.example, today(), statuses);
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
    const r = blankReport(today(), statuses);
    state.reports.unshift(r);
    open(r.id);
    form.elements.title.focus();
  });

  // 5 Whys: the worksheet of this language (sc-five-whys, -de, -sq) fills box 4 and adds its countermeasure.
  const whysStatus = $("[data-whys-status]");
  $("[data-from-whys]").addEventListener("click", () => {
    const key = `sc-five-whys${LANG === "en" ? "" : `-${LANG}`}`;
    const found = fromWhys(read(key, null), { why: tx("Why?"), cause: tx("Root cause") });
    if (!found) { flash(whysStatus, tx("No 5 Whys worksheet in this browser yet. Open 5 Whys, fill it in, then come back.")); return; }
    const r = ensureCurrent();
    if (r.rootCause.trim() && r.rootCause.trim() !== found.rootCause && !window.confirm(tx("Replace the root-cause box with the 5 Whys worksheet?"))) return;
    if (found.rootCause) r.rootCause = found.rootCause;
    if (!r.title.trim() && found.problem) r.title = found.problem.slice(0, 140);
    if (!r.current.trim() && found.problem) r.current = found.problem;
    if (!r.how.trim() && found.check) r.how = found.check;
    const c = found.countermeasure;
    if (c && !r.countermeasures.some((x) => x.text.trim() === c.text)) {
      const blank = r.countermeasures.findIndex((x) => !x.text.trim() && !x.owner.trim());
      const row = { ...c, status: statuses[0] };
      if (blank >= 0) r.countermeasures[blank] = row; else r.countermeasures.push(row);
    }
    edited(r);
    fillForm();
    flash(whysStatus, tx("Taken from 5 Whys: the chain of whys is in box 4."));
  });

  // Pareto: the few largest causes go into box 2 as one sentence.
  const paretoStatus = $("[data-pareto-status]");
  $("[data-from-pareto]")?.addEventListener("click", () => {
    const top = paretoTop(read("sc-pareto", null));
    if (!top) { flash(paretoStatus, tx("No Pareto in this browser yet. Open Pareto 80/20, load your data, then come back.")); return; }
    const causes = top.top.map((g) => `${g.name} ${pct(g.share, 0)}`).join(", ");
    const sentence = tx("Pareto ({name}): {causes}; the top {n} carry {share}.", { name: top.name || "Pareto 80/20", causes, n: int.format(top.top.length), share: pct(top.share, 0) });
    const r = ensureCurrent();
    if (r.current.includes(sentence)) { flash(paretoStatus, tx("Already in box 2.")); return; }
    r.current = r.current.trim() ? `${r.current.trim()}\n\n${sentence}` : sentence;
    edited(r);
    fillForm();
    flash(paretoStatus, tx("Added to box 2."));
  });

  // The Action Tracker: every countermeasure becomes an action with its owner, date and how it is checked.
  const actionsStatus = $("[data-actions-status]");
  $("[data-send-actions]").addEventListener("click", () => {
    const r = current();
    const measures = r ? r.countermeasures.filter((c) => c.text.trim()) : [];
    if (!measures.length) { flash(actionsStatus, tx("Write a countermeasure first.")); return; }
    if (!S) return;
    // Every action on the list, the example's too: a countermeasure already sent is not sent again, whatever its status.
    const known = S.all();
    let added = 0;
    measures.forEach((c) => {
      const title = c.text.trim();
      if (known.some((a) => a.source === "a3-report" && a.title === title)) return;
      if (S.add({ title, owner: c.owner, due: c.due, status: storeStatus(c.status, statuses), example: Boolean(state.example) && state.example === r.id, source: "a3-report", detail: `A3: ${nameOf(r)}`, check: r.how, area: r.area, priority: "Medium" })) added += 1;
    });
    flash(actionsStatus, added ? (added === 1 ? tx("1 countermeasure sent to the Action Tracker.") : tx("{n} countermeasures sent to the Action Tracker.", { n: int.format(added) })) : tx("Already on the list."));
  });

  // Another tab changed the saved A3s.
  window.addEventListener("storage", (event) => {
    if (event.key !== cfg.storageKey) return;
    const next = read(cfg.storageKey, null);
    if (!isObject(next) || !Array.isArray(next.reports)) return;
    state.reports = next.reports.map((r) => cleanReport(r, statuses));
    state.current = str(next.current);
    state.example = state.reports.some((r) => r.id === str(next.example)) ? str(next.example) : "";
    fillForm();
    renderAll();
  });

  // Start: a ?problem= from another tool opens a new A3 on it (once); a first visit opens on the example.
  const params = new URLSearchParams(location.search);
  const problem = params.get("problem")?.trim();
  if (problem) {
    const r = blankReport(today(), statuses);
    r.title = problem.length > 140 ? `${problem.slice(0, 139)}…` : problem;
    r.current = problem;
    state.reports.unshift(r);
    state.current = r.id;
    save();
    params.delete("problem");
    history.replaceState(null, "", location.pathname + (params.size ? `?${params}` : "") + location.hash);
    flash(saveStatus, tx("A new A3 for: {text}", { text: r.title }));
  } else if (firstVisit(cfg.storageKey)) {
    const r = exampleReport(cfg.example, today(), statuses);
    state.reports.push(r);
    state.example = r.id;
    state.current = r.id;
    save();
  } else if (!current() && state.reports.length) {
    state.current = state.reports[0].id;
  }
  fillForm();
  renderAll();
})();
