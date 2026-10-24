// Standard Work: the job breakdown of TWI (Training Within Industry) for one job. Each major step says what is done,
// its key points say how (each marked Safety, Quality, Technique or Cost) and every key point has its reason. Several
// standards are kept in this browser (cfg.storageKey), each saved as it is typed, with a version number that moves on
// "New version" and keeps the change note of every earlier version. The sheet in [data-results] is the classic
// three-column breakdown with its header, the time per step against the takt, and a check of six points. The
// arithmetic and the checks are in window.StandardWorkMath, so a test can call them without the page.
(() => {
  if (!window.ToolKit) return;
  const { LANG, tx, el, read, write, isObject, str, int, num, showDate, today, addDays, parseNumber, copy, flash, undoNote, stat, resultLayout, firstVisit } = window.ToolKit;

  // Arithmetic and checks ------------------------------------------------------------------------------------------------
  const TEXT_FIELDS = ["title", "process", "area", "owner", "takt", "ppe", "trainedBy", "approvedBy", "versionDate", "changeNote"];
  const HEADER_FIELDS = ["title", "process", "area", "owner", "takt", "ppe", "trainedBy", "approvedBy"];
  const TYPES = ["safety", "quality", "technique", "cost"];
  const CHECKS = ["keyPoints", "safety", "takt", "steps", "reasons", "changeNote"];
  const MAX_STEPS = 12;
  const isDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value);
  const finite = (value) => typeof value === "number" && Number.isFinite(value);
  const id = () => `w${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  const text = (value) => (typeof value === "number" && Number.isFinite(value) ? String(value) : str(value));

  // A saved standard can be damaged or old; keep what has the right shape and fill the rest.
  const cleanPoint = (item) => {
    const p = isObject(item) ? item : {};
    return { text: str(p.text), type: TYPES.includes(p.type) ? p.type : "technique", reason: str(p.reason) };
  };
  const cleanStep = (item) => {
    const s = isObject(item) ? item : {};
    return { step: str(s.step), time: text(s.time), points: (Array.isArray(s.points) ? s.points : []).filter(isObject).map(cleanPoint).slice(0, 20) };
  };
  const cleanDoc = (item) => {
    const d = isObject(item) ? item : {};
    const out = { id: str(d.id) || id() };
    TEXT_FIELDS.forEach((name) => { out[name] = text(d[name]); });
    if (!isDate(out.versionDate)) out.versionDate = "";
    out.version = Number.isInteger(d.version) && d.version > 0 ? d.version : 1;
    out.history = (Array.isArray(d.history) ? d.history : []).filter(isObject).map((h) => ({
      version: Number.isInteger(h.version) && h.version > 0 ? h.version : 1, date: isDate(str(h.date)) ? str(h.date) : "", note: str(h.note),
    }));
    out.steps = (Array.isArray(d.steps) ? d.steps : []).filter(isObject).map(cleanStep).slice(0, 60);
    out.updated = isDate(str(d.updated)) ? str(d.updated) : "";
    return out;
  };
  const blankDoc = (day, firstNote = "") => cleanDoc({ versionDate: day, changeNote: firstNote, updated: day, steps: [{ points: [{}] }] });
  // The example's dates are days relative to today, so its versions always read as recent.
  const exampleDoc = (example, day) => {
    const at = (value) => (Number.isInteger(value) ? addDays(day, value) : str(value));
    const e = isObject(example) ? example : {};
    return cleanDoc({ ...e, id: undefined, versionDate: at(e.versionDate), updated: day, history: (Array.isArray(e.history) ? e.history : []).map((h) => ({ ...h, date: at(h.date) })) });
  };
  // A template is a job without people: the steps, the takt and the equipment; version 1 starts today.
  const fromTemplate = (tpl, day, firstNote = "") => {
    const t = isObject(tpl) ? tpl : {};
    return cleanDoc({ title: t.title, process: t.process, takt: t.takt, ppe: t.ppe, steps: t.steps, version: 1, versionDate: day, changeNote: firstNote, updated: day });
  };
  const hasContent = (d) => HEADER_FIELDS.some((name) => d[name].trim()) || d.steps.some((s) => s.step.trim() || s.points.some((p) => p.text.trim()));

  // Seconds as typed on the floor: 45, 45 s, 7,5 (German), 1:30 (a minute and a half).
  const seconds = (value) => {
    if (typeof value === "number") return Number.isFinite(value) && value >= 0 ? value : NaN;
    const raw = String(value ?? "").trim().replace(/\s*(s|sec|sek|seconds|sekunden|sekonda)\.?$/i, "");
    const clock = raw.match(/^(\d+):([0-5]\d)$/);
    if (clock) return Number(clock[1]) * 60 + Number(clock[2]);
    const n = parseNumber(raw);
    return Number.isFinite(n) && n >= 0 ? n : NaN;
  };

  // Hazard words count as whole words ("hot" is not in "hotel"); a * makes a word a prefix or a suffix, so German
  // compounds are found too (*stapler* is in "Gabelstapler" and "Staplerspur"); a * inside a phrase stands for an ending.
  const patterns = new Map();
  const patternOf = (word) => {
    const w = String(word).toLocaleLowerCase().trim();
    if (patterns.has(w)) return patterns.get(w);
    const any = "[\\p{L}\\p{N}]*";
    const core = w.replace(/^\*|\*$/g, "").split("*").map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+")).join(any);
    const re = new RegExp(`(^|[^\\p{L}\\p{N}])${w.startsWith("*") ? any : ""}${core}${w.length > 1 && w.endsWith("*") ? any : ""}(?=$|[^\\p{L}\\p{N}])`, "u");
    patterns.set(w, re);
    return re;
  };
  const matchWords = (value, words = []) => {
    const lower = String(value || "").toLocaleLowerCase();
    return [...new Set((Array.isArray(words) ? words : []).filter((w) => String(w).replace(/\*/g, "").trim() && patternOf(w).test(lower)).map((w) => String(w).replace(/^\*|\*$/g, "")))];
  };
  const hazards = (step, words) => matchWords([step.step, ...step.points.flatMap((p) => [p.text, p.reason])].join("\n"), words);
  const hasSafety = (step) => step.points.some((p) => p.text.trim() && p.type === "safety");

  // A step counts once it has a name or a key point; a blank row just added is not a step yet.
  const filledSteps = (d) => d.steps.filter((s) => s.step.trim() || s.points.some((p) => p.text.trim()));
  const totals = (input) => {
    const d = cleanDoc(input);
    const steps = filledSteps(d);
    const times = steps.map((s) => seconds(s.time));
    const points = steps.flatMap((s) => s.points.filter((p) => p.text.trim()));
    const takt = seconds(d.takt);
    const total = times.filter(finite).reduce((sum, t) => sum + t, 0);
    const out = {
      steps: steps.length, points: points.length, byType: Object.fromEntries(TYPES.map((t) => [t, points.filter((p) => p.type === t).length])),
      times, total, missing: times.filter((t) => !finite(t) || t <= 0).length, timed: steps.length > 0 && times.every((t) => finite(t) && t > 0),
      takt: finite(takt) && takt > 0 ? takt : null, share: null, spare: null,
    };
    if (out.takt !== null) { out.share = total / out.takt; out.spare = out.takt - total; }
    return out;
  };

  // The six points of a sound breakdown. Each item: key, ok, label (what good looks like), hint (what to do).
  const check = (input, cfg = {}) => {
    const d = cleanDoc(input);
    const steps = filledSteps(d);
    const t = totals(d);
    const max = Number.isInteger(cfg.maxSteps) ? cfg.maxSteps : MAX_STEPS;
    const points = steps.flatMap((s) => s.points.filter((p) => p.text.trim()));
    const unsafe = steps.map((s, i) => ({ n: i + 1, step: s.step, words: hazards(s, cfg.safetyWords) })).filter((x, i) => x.words.length && !hasSafety(steps[i]));
    const ok = {
      keyPoints: steps.length > 0 && steps.every((s) => s.points.some((p) => p.text.trim())),
      safety: steps.length > 0 && unsafe.length === 0,
      takt: t.takt !== null && t.timed && t.total <= t.takt,
      steps: steps.length > 0 && steps.length <= max,
      reasons: points.length > 0 && points.every((p) => p.reason.trim()),
      changeNote: d.changeNote.trim().length > 0,
    };
    const items = CHECKS.map((key) => ({ key, ok: Boolean(ok[key]), label: cfg.checks?.[key]?.[0] || key, hint: cfg.checks?.[key]?.[1] || "" }));
    return { items, score: items.filter((item) => item.ok).length, total: items.length, unsafe, totals: t };
  };

  // "New version": the version in force goes into the history with its date and note; the next one starts today
  // with an empty note, which the check asks for.
  const newVersion = (input, day) => {
    const d = cleanDoc(input);
    const next = cleanDoc(JSON.parse(JSON.stringify(d)));
    next.history.push({ version: d.version, date: d.versionDate || day, note: d.changeNote.trim() });
    next.version = d.version + 1;
    next.versionDate = day;
    next.changeNote = "";
    next.updated = day;
    return next;
  };
  const moveStep = (steps, from, to) => {
    const list = steps.slice();
    if (from < 0 || from >= list.length || to < 0 || to >= list.length || from === to) return list;
    const [item] = list.splice(from, 1);
    list.splice(to, 0, item);
    return list;
  };

  window.StandardWorkMath = { cleanDoc, blankDoc, exampleDoc, fromTemplate, hasContent, seconds, matchWords, hazards, filledSteps, totals, check, newVersion, moveStep, CHECKS, TYPES, MAX_STEPS };

  // The page ----------------------------------------------------------------------------------------------------------
  const dataEl = document.getElementById("standard-work-data");
  const root = document.querySelector("[data-standard-work]");
  const results = document.querySelector("[data-results]");
  if (!dataEl || !root || !results) return;
  const cfg = JSON.parse(dataEl.textContent);
  const CK = window.ChartKit;
  const S = window.ActionsStore;
  const $ = (selector) => root.querySelector(selector);
  const form = $("[data-sw-form]");
  const list = $("[data-list]");
  const listEmpty = $("[data-list-empty]");
  const listCount = $("[data-list-count]");
  const listStatus = $("[data-list-status]");
  const exampleAgain = $("[data-example-again]");
  const saveStatus = $("[data-save-status]");
  const stepsBox = $("[data-steps]");
  const stepsStatus = $("[data-steps-status]");
  const stepTotal = $("[data-step-total]");
  const versionOut = $("[data-version]");
  const versionStatus = $("[data-version-status]");
  const historyList = $("[data-history]");
  const firstNote = str(cfg.firstIssue);

  const saved = read(cfg.storageKey, null);
  const state = {
    docs: isObject(saved) && Array.isArray(saved.docs) ? saved.docs.map(cleanDoc) : [],
    current: isObject(saved) ? str(saved.current) : "",
    example: isObject(saved) ? str(saved.example) : "",
  };
  if (!state.docs.some((d) => d.id === state.example)) state.example = "";
  const current = () => state.docs.find((d) => d.id === state.current) || null;
  const save = () => {
    saveStatus.textContent = write(cfg.storageKey, state) ? tx("Saved in this browser.") : tx("Not saved: this browser blocks storage. Copy the text or download the Word file to keep it.");
  };

  // Words and numbers for the sheet ------------------------------------------------------------------------------------
  const type = (key) => cfg.types?.[key] || { label: key, mark: "" };
  const typeTag = (key) => `${type(key).mark ? `${type(key).mark} ` : ""}${type(key).label}`;
  const secs = (value) => (finite(value) ? `${num(value, value % 1 ? 1 : 0)} s` : "–");
  const nameOf = (d) => d.title.trim() || tx("Untitled standard");
  const versionText = (d) => [tx("Version {n}", { n: d.version }), d.versionDate && showDate(d.versionDate)].filter(Boolean).join(" · ");
  const verdict = (d) => {
    const t = totals(d);
    if (t.takt === null) return tx("Add the takt or target time to see whether the job fits.");
    if (!t.timed) return tx("Give every step a time to compare the job with the takt of {takt}.", { takt: secs(t.takt) });
    if (t.total <= t.takt) return tx("{total} against a takt of {takt}: {spare} to spare.", { total: secs(t.total), takt: secs(t.takt), spare: secs(t.spare) });
    return tx("{over} over the takt of {takt}: split the job or take waste out of it.", { over: secs(-t.spare), takt: secs(t.takt) });
  };
  const fold = (value) => String(value ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/ß/g, "ss").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const fileSlug = (d) => fold(nameOf(d)).slice(0, 40) || "standard";
  const headerPairs = (d) => [
    [tx("Process"), d.process], [tx("Area"), d.area], [tx("Owner"), d.owner], [tx("Version"), versionText(d)],
    [tx("Takt or target time"), finite(seconds(d.takt)) ? secs(seconds(d.takt)) : ""], [tx("PPE and tools"), d.ppe],
    [tx("Trained by"), d.trainedBy], [tx("Approved by"), d.approvedBy],
  ];

  // Copy as text ------------------------------------------------------------------------------------------------------
  const asText = (input) => {
    const d = cleanDoc(input);
    const t = totals(d);
    const q = check(d, cfg);
    const lines = [`${tx("Standard work")} · ${nameOf(d)}`];
    headerPairs(d).forEach(([label, value]) => { if (value) lines.push(`${label}: ${value}`); });
    if (d.changeNote.trim()) lines.push(`${tx("What changed")}: ${d.changeNote.trim()}`);
    lines.push("");
    filledSteps(d).forEach((s, i) => {
      lines.push(`${i + 1}. ${s.step.trim() || "–"} (${secs(seconds(s.time))})`);
      s.points.filter((p) => p.text.trim()).forEach((p) => lines.push(`   ${typeTag(p.type)}: ${p.text.trim()}${p.reason.trim() ? ` – ${tx("Reason")}: ${p.reason.trim()}` : ""}`));
    });
    lines.push("", [`${tx("Total")}: ${secs(t.total)}`, t.takt !== null && `${tx("Takt")}: ${secs(t.takt)}`].filter(Boolean).join(" · "), verdict(d));
    lines.push(`${tx("Quality check")}: ${q.score}/${q.total}`);
    if (d.history.length) {
      lines.push("", `${tx("Change history")}:`);
      [...d.history].reverse().forEach((h) => lines.push(`- ${tx("Version {n}", { n: h.version })}${h.date ? ` · ${showDate(h.date)}` : ""}${h.note ? `: ${h.note}` : ""}`));
    }
    return lines.join("\n");
  };

  // Word ---------------------------------------------------------------------------------------------------------------
  // A Word table: rows of cells, each cell a text or a list of finished <w:p> paragraphs; the first row repeats on
  // every page when header is set.
  const wordTable = (rows, widths, { header = true } = {}) => {
    const { run, para } = window.DocxKit;
    const edge = (side) => `<w:${side} w:val="single" w:sz="4" w:space="0" w:color="BBBBBB"/>`;
    const cell = (content, width, head) => {
      const paras = Array.isArray(content) ? content : [para(run(content || "–", head ? "<w:b/>" : ""), '<w:spacing w:before="40" w:after="40"/>')];
      return `<w:tc><w:tcPr><w:tcW w:w="${width}" w:type="dxa"/>${head ? '<w:shd w:val="clear" w:color="auto" w:fill="EEF2F7"/>' : ""}</w:tcPr>${paras.length ? paras.join("") : para("")}</w:tc>`;
    };
    const total = widths.reduce((sum, w) => sum + w, 0);
    return `<w:tbl><w:tblPr><w:tblW w:w="${total}" w:type="dxa"/><w:tblBorders>${["top", "left", "bottom", "right", "insideH", "insideV"].map(edge).join("")}</w:tblBorders><w:tblLayout w:type="fixed"/><w:tblCellMar><w:left w:w="80" w:type="dxa"/><w:right w:w="80" w:type="dxa"/></w:tblCellMar></w:tblPr><w:tblGrid>${widths.map((w) => `<w:gridCol w:w="${w}"/>`).join("")}</w:tblGrid>`
      + rows.map((row, i) => `<w:tr>${i === 0 && header ? "<w:trPr><w:tblHeader/><w:cantSplit/></w:trPr>" : "<w:trPr><w:cantSplit/></w:trPr>"}${row.map((value, j) => cell(value, widths[j], i === 0 && header)).join("")}</w:tr>`).join("")
      + "</w:tbl>";
  };
  const wordFile = (input) => {
    const kit = window.DocxKit;
    if (!kit) return null;
    const { run, para, TEXT_WIDTH } = kit;
    const d = cleanDoc(input);
    const t = totals(d);
    const q = check(d, cfg);
    const GREY = '<w:color w:val="555555"/>';
    const SMALL = '<w:sz w:val="18"/><w:szCs w:val="18"/>';
    const TIGHT = '<w:spacing w:before="40" w:after="40"/>';
    const body = [];
    body.push(para(run(nameOf(d)), '<w:pStyle w:val="Title"/>'));
    body.push(para(run(`${tx("Standard work")} · ${tx("Job breakdown sheet")} · ${versionText(d)}`, GREY + SMALL), '<w:spacing w:after="200"/>'));
    // The header block: four columns, label and value twice per row.
    const pairs = headerPairs(d).filter(([, value]) => value);
    if (pairs.length) {
      const rows = [];
      for (let i = 0; i < pairs.length; i += 2) {
        const [a, b = ["", ""]] = [pairs[i], pairs[i + 1]];
        const label = (value) => [para(run(value, "<w:b/>" + SMALL), TIGHT)];
        const value = (v) => [para(run(v || " ", SMALL), TIGHT)];
        rows.push([label(a[0]), value(a[1]), label(b[0]), value(b[1])]);
      }
      const w = Math.round((TEXT_WIDTH - 2 * 1700) / 2);
      body.push(wordTable(rows, [1700, w, 1700, TEXT_WIDTH - 3400 - w], { header: false }));
    }
    body.push(para(run(tx("Job breakdown")), '<w:pStyle w:val="Heading1"/>'));
    // The breakdown itself: step | key points | reasons, each key point beside its reason.
    const widths = [2900, 3600, TEXT_WIDTH - 6500];
    const rows = [[tx("Major step"), tx("Key points"), tx("Reasons")]];
    filledSteps(d).forEach((s, i) => {
      const points = s.points.filter((p) => p.text.trim());
      rows.push([
        [para(run(`${i + 1}.  `, "<w:b/>") + run(s.step.trim() || "–", "<w:b/>"), TIGHT), para(run(secs(seconds(s.time)), GREY + SMALL), '<w:spacing w:after="40"/>')],
        points.length ? points.map((p) => para(run(`${typeTag(p.type)}: `, "<w:b/>" + SMALL) + run(p.text.trim()), TIGHT)) : [para(run("–"), TIGHT)],
        points.length ? points.map((p) => para(run(p.reason.trim() || "–"), TIGHT)) : [para(run("–"), TIGHT)],
      ]);
    });
    rows.push([[para(run(tx("Total"), "<w:b/>"), TIGHT)], [para(run(`${secs(t.total)}${t.takt !== null ? ` · ${tx("Takt")} ${secs(t.takt)}` : ""}`, "<w:b/>"), TIGHT)], [para(run(verdict(d), GREY + SMALL), TIGHT)]]);
    body.push(wordTable(rows, widths));
    body.push(para(run(tx("Version and changes")), '<w:pStyle w:val="Heading1"/>'));
    body.push(para(run(`${versionText(d)}: `, "<w:b/>") + run(d.changeNote.trim() || "–")));
    [...d.history].reverse().forEach((h) => body.push(para(run(`${tx("Version {n}", { n: h.version })}${h.date ? ` · ${showDate(h.date)}` : ""}: `, "<w:b/>" + GREY) + run(h.note || "–", GREY))));
    body.push(para(run(`${tx("Quality check")}: ${q.score}/${q.total}`, GREY + SMALL), '<w:spacing w:before="240"/>'));
    return kit.wordFile({ body, font: "Arial", accent: "0a6ab0", lang: LANG, title: `${tx("Standard work")} · ${nameOf(d)}`, creator: d.owner });
  };
  const downloadWord = (d) => {
    const bytes = wordFile(d);
    if (!bytes) return;
    const link = el("a");
    link.href = URL.createObjectURL(new Blob([bytes], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }));
    link.download = `standard-work-${fileSlug(d)}-v${d.version}.docx`;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  };
  Object.assign(window.StandardWorkMath, { asText, wordFile, wordTable });

  // The example note ---------------------------------------------------------------------------------------------------
  const exampleNote = el("div", "dl-example-note");
  exampleNote.setAttribute("role", "status");
  exampleNote.hidden = true;
  const clearExample = el("button", "button-ghost", tx("Clear the example"));
  clearExample.type = "button";
  exampleNote.append(el("strong", null, tx("Example")), " ", el("span", null, tx("This is an example, so you can see what the tool shows. Add your own entries and it disappears, or clear it now.")), " ", clearExample);
  root.prepend(exampleNote);

  // Areas from the workplace profile, else the tool's own.
  const areaList = $("[data-areas]");
  const fillAreas = () => {
    if (!areaList) return;
    const names = [...new Set([...(window.Workplace ? window.Workplace.areas().map((a) => a.name) : []), ...(cfg.areas || [])])];
    areaList.replaceChildren(...names.map((name) => { const option = el("option"); option.value = name; return option; }));
  };

  // The steps in the form ----------------------------------------------------------------------------------------------
  const field = (idText, label, node, className) => {
    const wrap = el("div", `field${className ? ` ${className}` : ""}`);
    const lab = el("label", null, label);
    lab.htmlFor = idText;
    node.id = idText;
    wrap.append(lab, node);
    return wrap;
  };
  const input = (key, value, placeholder = "", attr = "key") => {
    const node = el("input");
    node.type = "text";
    node.value = value || "";
    node.dataset[attr] = key;
    node.autocomplete = "off";
    if (placeholder) node.placeholder = placeholder;
    return node;
  };
  const smallButton = (label, data, aria) => {
    const button = el("button", "button-ghost sw-mini", label);
    button.type = "button";
    Object.entries(data).forEach(([k, v]) => { button.dataset[k] = v; });
    if (aria) button.setAttribute("aria-label", aria);
    return button;
  };
  const renderSteps = () => {
    const d = current();
    const steps = d ? d.steps : [];
    stepsBox.replaceChildren(...steps.map((s, i) => {
      const n = i + 1;
      const card = el("article", "sw-step");
      card.dataset.stepIndex = String(i);
      const head = el("div", "sw-step-head");
      head.append(el("h3", "sw-step-no", tx("Step {n}", { n })));
      const tools = el("div", "sw-step-tools");
      const up = smallButton("↑", { stepAction: "up" }, `${tx("Move up")}: ${tx("Step {n}", { n })}`);
      up.disabled = i === 0;
      const down = smallButton("↓", { stepAction: "down" }, `${tx("Move down")}: ${tx("Step {n}", { n })}`);
      down.disabled = i === steps.length - 1;
      tools.append(up, down, smallButton(tx("Insert below"), { stepAction: "insert" }, `${tx("Insert a step below")} ${tx("Step {n}", { n })}`), smallButton(tx("Remove"), { stepAction: "remove" }, `${tx("Remove")}: ${tx("Step {n}", { n })}`));
      head.append(tools);
      const grid = el("div", "sw-step-grid");
      const time = input("time", s.time, cfg.fields?.time);
      time.inputMode = "decimal";
      grid.append(field(`sw-step-${i}`, tx("Major step"), input("step", s.step, cfg.fields?.step), "sw-step-what"), field(`sw-time-${i}`, tx("Time (s)"), time, "sw-step-time"));
      const points = el("div", "sw-points");
      s.points.forEach((p, j) => {
        const row = el("div", "sw-point");
        row.dataset.pointIndex = String(j);
        const select = el("select");
        select.dataset.pkey = "type";
        TYPES.forEach((key) => { const option = el("option", null, typeTag(key)); option.value = key; option.selected = key === p.type; select.append(option); });
        const label = tx("Key point {n}", { n: j + 1 });
        row.append(
          field(`sw-point-${i}-${j}`, label, input("text", p.text, cfg.fields?.point, "pkey"), "sw-point-text"),
          field(`sw-type-${i}-${j}`, tx("Type"), select, "sw-point-type"),
          field(`sw-reason-${i}-${j}`, tx("Reason"), input("reason", p.reason, cfg.fields?.reason, "pkey"), "sw-point-reason"),
          smallButton(tx("Remove"), { removePoint: "" }, `${tx("Remove")}: ${label}, ${tx("Step {n}", { n })}`),
        );
        points.append(row);
      });
      const flag = el("p", "sw-flag");
      flag.hidden = true;
      card.append(head, grid, points, smallButton(tx("Add a key point"), { addPoint: "" }, `${tx("Add a key point")}: ${tx("Step {n}", { n })}`), flag);
      return card;
    }));
    renderFlags();
  };
  // Under each step, a hazard word without a Safety key point is named where it is typed.
  const renderFlags = () => {
    const d = current();
    stepsBox.querySelectorAll("[data-step-index]").forEach((card) => {
      const s = d?.steps[Number(card.dataset.stepIndex)];
      const flag = card.querySelector(".sw-flag");
      if (!s || !flag) return;
      const words = hazards(s, cfg.safetyWords);
      const show = words.length > 0 && !hasSafety(s);
      flag.hidden = !show;
      flag.textContent = show ? `! ${tx("Hazard words ({words}): add a Safety key point to this step.", { words: words.join(", ") })}` : "";
    });
    const t = d ? totals(d) : null;
    stepTotal.textContent = t && t.steps ? [`${tx("Total")}: ${secs(t.total)}`, t.takt !== null && `${tx("Takt")}: ${secs(t.takt)}`, tx("{n} of {max} steps", { n: t.steps, max: cfg.maxSteps || MAX_STEPS })].filter(Boolean).join(" · ") : "";
  };
  const renderVersion = () => {
    const d = current();
    versionOut.textContent = String(d ? d.version : 1);
    historyList.replaceChildren(...(d ? [...d.history].reverse() : []).map((h) => el("li", null, `${tx("Version {n}", { n: h.version })}${h.date ? ` · ${showDate(h.date)}` : ""}${h.note ? `: ${h.note}` : ""}`)));
    historyList.hidden = !d || !d.history.length;
  };
  const fillForm = () => {
    const d = current();
    TEXT_FIELDS.forEach((name) => { if (form.elements[name]) form.elements[name].value = d ? d[name] : name === "versionDate" ? today() : name === "changeNote" ? firstNote : ""; });
    renderVersion();
    renderSteps();
  };
  // Typing into an empty page starts a standard: nobody has to press "New" first.
  const ensureCurrent = () => {
    let d = current();
    if (d) return d;
    d = blankDoc(today(), firstNote);
    d.steps = [];
    state.docs.unshift(d);
    state.current = d.id;
    return d;
  };
  const edited = (d) => {
    d.updated = today();
    // The first change to the example makes it this person's standard; the note goes.
    if (state.example === d.id) state.example = "";
    save();
    renderAll();
  };
  form.addEventListener("submit", (event) => event.preventDefault());
  const onHeader = (event) => {
    const target = event.target;
    if (!TEXT_FIELDS.includes(target.name)) return;
    const d = ensureCurrent();
    if (d[target.name] === target.value) return;
    d[target.name] = target.value;
    edited(d);
  };
  form.addEventListener("input", onHeader);
  form.addEventListener("change", onHeader);
  const onStep = (event) => {
    const target = event.target;
    const card = target.closest?.("[data-step-index]");
    const d = current();
    if (!card || !d) return;
    const s = d.steps[Number(card.dataset.stepIndex)];
    if (!s) return;
    if (target.dataset.key) {
      if (s[target.dataset.key] === target.value) return;
      s[target.dataset.key] = target.value;
    } else if (target.dataset.pkey) {
      const p = s.points[Number(target.closest("[data-point-index]")?.dataset.pointIndex)];
      if (!p || p[target.dataset.pkey] === target.value) return;
      p[target.dataset.pkey] = target.value;
    } else return;
    edited(d);
  };
  stepsBox.addEventListener("input", onStep);
  stepsBox.addEventListener("change", onStep);
  const focusIn = (index, selector) => stepsBox.querySelector(`[data-step-index="${index}"] ${selector}`)?.focus();
  stepsBox.addEventListener("click", (event) => {
    const button = event.target.closest?.("button");
    const card = button?.closest("[data-step-index]");
    const d = current();
    if (!button || !card || !d) return;
    const i = Number(card.dataset.stepIndex);
    const s = d.steps[i];
    if (!s) return;
    const action = button.dataset.stepAction;
    if (action === "up" || action === "down") {
      const to = action === "up" ? i - 1 : i + 1;
      d.steps = moveStep(d.steps, i, to);
      edited(d);
      renderSteps();
      const moved = stepsBox.querySelector(`[data-step-index="${Math.max(0, Math.min(to, d.steps.length - 1))}"] [data-step-action="${action}"]`);
      if (moved && !moved.disabled) moved.focus(); else focusIn(Math.max(0, Math.min(to, d.steps.length - 1)), '[data-key="step"]');
      flash(stepsStatus, tx("Step moved to position {n}.", { n: Math.max(0, Math.min(to, d.steps.length - 1)) + 1 }));
    } else if (action === "insert") {
      d.steps.splice(i + 1, 0, cleanStep({ points: [{}] }));
      edited(d);
      renderSteps();
      focusIn(i + 1, '[data-key="step"]');
    } else if (action === "remove") {
      const [gone] = d.steps.splice(i, 1);
      edited(d);
      renderSteps();
      undoNote(stepsStatus, tx("Removed: {text}", { text: gone.step.trim() || tx("Step {n}", { n: i + 1 }) }), () => {
        const doc = current();
        if (!doc) return;
        doc.steps.splice(Math.min(i, doc.steps.length), 0, gone);
        edited(doc);
        renderSteps();
      });
    } else if (button.dataset.addPoint !== undefined) {
      s.points.push(cleanPoint({}));
      edited(d);
      renderSteps();
      const rows = stepsBox.querySelectorAll(`[data-step-index="${i}"] [data-pkey="text"]`);
      rows[rows.length - 1]?.focus();
    } else if (button.dataset.removePoint !== undefined) {
      const j = Number(button.closest("[data-point-index]")?.dataset.pointIndex);
      if (!(j >= 0)) return;
      s.points.splice(j, 1);
      edited(d);
      renderSteps();
      focusIn(i, "[data-add-point]");
    }
  });
  $("[data-add-step]").addEventListener("click", () => {
    const d = ensureCurrent();
    d.steps.push(cleanStep({ points: [{}] }));
    edited(d);
    renderSteps();
    focusIn(d.steps.length - 1, '[data-key="step"]');
  });
  $("[data-new-version]").addEventListener("click", () => {
    const d = current();
    if (!d) return;
    const next = newVersion(d, today());
    state.docs[state.docs.indexOf(d)] = next;
    edited(next);
    fillForm();
    form.elements.changeNote.focus();
    flash(versionStatus, tx("Version {n} started. Write what changed.", { n: next.version }));
  });

  // The list of standards --------------------------------------------------------------------------------------------
  const open = (docId) => {
    state.current = docId;
    save();
    fillForm();
    renderAll();
  };
  const renderList = () => {
    list.replaceChildren(...state.docs.map((d, index) => {
      const li = el("li", "sw-item");
      if (d.id === state.current) li.setAttribute("aria-current", "true");
      const openButton = el("button", "sw-open", nameOf(d));
      openButton.type = "button";
      openButton.addEventListener("click", () => open(d.id));
      const q = check(d, cfg);
      const meta = el("span", "sw-meta", [d.area, versionText(d), `${tx("Quality check")} ${q.score}/${q.total}`, d.id === state.example ? tx("Example") : ""].filter(Boolean).join(" · "));
      const tools = el("span", "sw-item-tools");
      const dup = el("button", "button-ghost", tx("Duplicate"));
      dup.type = "button";
      dup.setAttribute("aria-label", `${tx("Duplicate")}: ${nameOf(d)}`);
      dup.addEventListener("click", () => {
        const copyOf = cleanDoc({ ...JSON.parse(JSON.stringify(d)), id: "", title: `${nameOf(d)} ${tx("(copy)")}`, updated: today() });
        state.docs.splice(index + 1, 0, copyOf);
        open(copyOf.id);
        flash(listStatus, tx("Duplicated: {text}", { text: nameOf(d) }));
      });
      const del = el("button", "button-ghost", tx("Delete"));
      del.type = "button";
      del.setAttribute("aria-label", `${tx("Delete")}: ${nameOf(d)}`);
      del.addEventListener("click", () => {
        const at = state.docs.findIndex((x) => x.id === d.id);
        if (at < 0) return;
        const [gone] = state.docs.splice(at, 1);
        const wasCurrent = state.current === gone.id;
        const wasExample = state.example === gone.id;
        if (wasExample) state.example = "";
        if (wasCurrent) state.current = state.docs[Math.min(at, state.docs.length - 1)]?.id || "";
        save();
        fillForm();
        renderAll();
        undoNote(listStatus, tx("Deleted: {text}", { text: nameOf(gone) }), () => {
          state.docs.splice(Math.min(at, state.docs.length), 0, gone);
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
    list.hidden = !state.docs.length;
    listEmpty.hidden = state.docs.length > 0;
    exampleAgain.hidden = !state.docs.length || Boolean(state.example);
    listCount.textContent = state.docs.length === 1 ? tx("1 standard saved") : state.docs.length ? tx("{n} standards saved", { n: int.format(state.docs.length) }) : "";
  };

  // The sheet ------------------------------------------------------------------------------------------------------------
  const chart = (d) => {
    const t = totals(d);
    const steps = filledSteps(d);
    if (!CK || !steps.length || !t.total) return null;
    let running = 0;
    const items = steps.map((s, i) => {
      const v = seconds(s.time);
      running += finite(v) ? v : 0;
      return { label: String(i + 1), value: finite(v) ? v : 0, tip: `${i + 1}. ${s.step.trim() || "–"}: ${secs(v)} · ${tx("running total")} ${secs(running)}` };
    });
    items.push({ label: tx("Total"), value: t.total, state: t.takt === null ? undefined : t.total <= t.takt ? "ok" : "warn", tip: `${tx("Total")}: ${secs(t.total)}${t.takt !== null ? ` · ${tx("Takt")} ${secs(t.takt)}` : ""}` });
    if (t.takt === null) delete items.at(-1).state;
    const svg = CK.bars(items, { title: tx("Time per step against the takt"), unit: "s", target: t.takt ?? undefined, targetLabel: tx("Takt"), format: (v) => num(v, v % 1 ? 1 : 0), highlight: () => false });
    return CK.figure(svg, { fileName: `standard-work-${fileSlug(d)}`, caption: verdict(d) });
  };
  const renderSheet = (d) => {
    results.replaceChildren();
    const show = Boolean(d && hasContent(d));
    results.hidden = !show;
    if (!show) return;
    const t = totals(d);
    const q = check(d, cfg);
    const head = el("div", "result-head");
    head.append(el("p", "result-label", tx("Your standard")), el("h2", null, nameOf(d)), el("p", null, verdict(d)));
    const stats = el("div", "dl-stats");
    stats.append(
      stat(tx("Steps"), int.format(t.steps), tx("max. {max}", { max: cfg.maxSteps || MAX_STEPS })),
      stat(tx("Key points"), int.format(t.points), `${type("safety").mark} ${int.format(t.byType.safety)} ${type("safety").label}`),
      stat(tx("Total time"), secs(t.total), t.missing ? tx("{n} without a time", { n: t.missing }) : ""),
      stat(tx("Takt"), t.takt !== null ? secs(t.takt) : "–", t.takt === null ? "" : t.spare >= 0 ? tx("{n} to spare", { n: secs(t.spare) }) : tx("{n} over", { n: secs(-t.spare) })),
      stat(tx("Quality check"), `${q.score}/${q.total}`, q.score === q.total ? tx("ready to train") : tx("{n} to fix", { n: q.total - q.score })),
    );
    // The check as chips: the sign and the words carry the result, the colour only repeats it.
    const quality = el("div", "sw-quality");
    quality.append(el("p", "result-label", `${tx("Quality check")} · ${q.score}/${q.total}`));
    const chips = el("ul", "ck-chips");
    q.items.forEach((item) => {
      const chip = el("li", `ck-chip ${item.ok ? "is-ok" : "is-warn"}`, `${item.ok ? "✓" : "!"} ${item.label}`);
      if (!item.ok) chip.title = item.hint;
      chips.append(chip);
    });
    quality.append(chips);
    const missing = q.items.filter((item) => !item.ok);
    if (missing.length) {
      const first = missing[0];
      const where = first.key === "safety" && q.unsafe.length ? ` (${q.unsafe.map((u) => `${tx("Step {n}", { n: u.n })}: ${u.words.join(", ")}`).join("; ")})` : "";
      quality.append(el("p", "form-note sw-next", `${tx("Next")}: ${first.hint}${where}`));
    }

    // The job breakdown sheet.
    const sheet = el("div", "sw-sheet");
    const sheetHead = el("header", "sw-sheet-head");
    sheetHead.append(el("p", "sw-sheet-kicker", `${tx("Standard work")} · ${tx("Job breakdown sheet")}`), el("p", "sw-sheet-title", nameOf(d)));
    const meta = el("dl", "sw-meta-grid");
    headerPairs(d).forEach(([label, value]) => {
      const pair = el("div", "sw-pair");
      pair.append(el("dt", null, label), el("dd", value ? null : "sw-blank", value || "–"));
      meta.append(pair);
    });
    sheetHead.append(meta);
    const table = el("table", "sw-table");
    const caption = el("caption", "visually-hidden", `${tx("Job breakdown")}: ${nameOf(d)}`);
    const thead = el("thead");
    const hr = el("tr");
    const labels = [tx("Major step"), tx("Key points"), tx("Reasons")];
    labels.forEach((label) => { const th = el("th", null, label); th.scope = "col"; hr.append(th); });
    thead.append(hr);
    const tbody = el("tbody");
    filledSteps(d).forEach((s, i) => {
      const tr = el("tr");
      const stepCell = el("th", "sw-col-step");
      stepCell.scope = "row";
      stepCell.append(el("span", "sw-no", `${i + 1}`), el("strong", null, s.step.trim() || "–"), el("span", "sw-time", secs(seconds(s.time))));
      const points = s.points.filter((p) => p.text.trim());
      const pointCell = el("td", "sw-col-points");
      pointCell.dataset.label = labels[1];
      const reasonCell = el("td", "sw-col-reasons");
      reasonCell.dataset.label = labels[2];
      if (!points.length) {
        pointCell.append(el("p", "sw-missing", tx("no key point")));
        reasonCell.append(el("p", "sw-blank", "–"));
      }
      points.forEach((p) => {
        const line = el("p", "sw-kp");
        line.append(el("span", `sw-mark sw-type-${p.type}`, typeTag(p.type)), " ", el("span", null, p.text.trim()));
        pointCell.append(line);
        reasonCell.append(el("p", p.reason.trim() ? "sw-reason" : "sw-missing", p.reason.trim() || tx("no reason")));
      });
      tr.append(stepCell, pointCell, reasonCell);
      tbody.append(tr);
    });
    const tfoot = el("tfoot");
    const fr = el("tr");
    const ft = el("th", null, tx("Total"));
    ft.scope = "row";
    const fd = el("td", null, `${secs(t.total)}${t.takt !== null ? ` · ${tx("Takt")} ${secs(t.takt)}` : ""} · ${verdict(d)}`);
    fd.colSpan = 2;
    fr.append(ft, fd);
    tfoot.append(fr);
    table.append(caption, thead, tbody, tfoot);
    const versions = el("div", "sw-versions");
    versions.append(el("p", "result-label", tx("Version and changes")));
    const vl = el("ul", "sw-version-list");
    const now = el("li");
    now.append(el("strong", null, versionText(d)), " ", el("span", d.changeNote.trim() ? null : "sw-missing", d.changeNote.trim() || tx("no change note yet")));
    vl.append(now, ...[...d.history].reverse().map((h) => el("li", "sw-old", `${tx("Version {n}", { n: h.version })}${h.date ? ` · ${showDate(h.date)}` : ""}${h.note ? `: ${h.note}` : ""}`)));
    versions.append(vl);
    sheet.append(sheetHead, table, versions);
    const focus = el("div", "sw-focus");
    focus.append(sheet);
    const figure = chart(d);
    if (figure) focus.append(figure);

    const actions = el("div", "tool-actions result-actions");
    const copyButton = el("button", "button-primary", tx("Copy as text"));
    copyButton.type = "button";
    copyButton.addEventListener("click", () => copy(asText(d), copyButton));
    const printButton = el("button", "button-secondary", tx("Print or save as PDF"));
    printButton.type = "button";
    printButton.addEventListener("click", () => window.print());
    const wordButton = el("button", "button-secondary", tx("Download Word"));
    wordButton.type = "button";
    wordButton.hidden = !window.DocxKit;
    wordButton.addEventListener("click", () => downloadWord(d));
    actions.append(copyButton, printButton, wordButton);
    resultLayout(results, { head, stats, notes: [quality], focus, actions });
  };

  // Hand-offs: train the team (an action in the tracker), audit the standard (5S), the skills matrix.
  const trainSlot = $("[data-train-slot]");
  if (S && trainSlot) {
    const train = S.linkButton(tx("Train the team on it"), () => {
      const d = current();
      if (!d || !hasContent(d)) return null;
      const t = totals(d);
      return {
        title: tx("Train on: {title}", { title: nameOf(d) }),
        detail: `${tx("Standard work")} · ${versionText(d)} · ${tx("{n} steps, {k} key points", { n: t.steps, k: t.points })}`,
        owner: d.trainedBy || d.owner, area: d.area, due: addDays(today(), 14), source: "standard-work", priority: "Medium",
        check: tx("Each person does the job once to the standard while the trainer watches."),
      };
    }, "button-primary");
    train.dataset.train = "";
    trainSlot.replaceWith(train);
  }

  const renderAll = () => {
    const d = current();
    exampleNote.hidden = !state.example || state.example !== state.current;
    renderList();
    renderFlags();
    renderVersion();
    renderSheet(d);
  };

  // Buttons ----------------------------------------------------------------------------------------------------------
  const loadExample = () => {
    const existing = state.docs.find((d) => d.id === state.example);
    if (existing) { open(existing.id); return; }
    const d = exampleDoc(cfg.example, today());
    state.docs.unshift(d);
    state.example = d.id;
    open(d.id);
  };
  root.querySelectorAll("[data-example], [data-example-again]").forEach((button) => button.addEventListener("click", () => {
    loadExample();
    results.scrollIntoView?.({ behavior: "smooth", block: "start" });
  }));
  clearExample.addEventListener("click", () => {
    const at = state.docs.findIndex((d) => d.id === state.example);
    if (at >= 0) state.docs.splice(at, 1);
    if (state.current === state.example) state.current = state.docs[0]?.id || "";
    state.example = "";
    save();
    fillForm();
    renderAll();
  });
  $("[data-new]").addEventListener("click", () => {
    const d = blankDoc(today(), firstNote);
    state.docs.unshift(d);
    open(d.id);
    form.elements.title.focus();
  });
  const templateSelect = $("[data-template]");
  $("[data-from-template]")?.addEventListener("click", () => {
    const tpl = (cfg.templates || [])[Number(templateSelect?.value)];
    if (!tpl) return;
    const d = fromTemplate(tpl.doc === "example" ? cfg.example : tpl.doc, today(), firstNote);
    state.docs.unshift(d);
    open(d.id);
    flash(listStatus, tx("A new standard from the template: {text}", { text: tpl.name }));
  });
  // One standard as a template file (js/template-pack.js): another site opens it as a new standard of its own, with
  // its version and the notes of every earlier version.
  const packHost = $("[data-template-pack]");
  if (window.TemplatePack && packHost) {
    window.TemplatePack.ui(packHost, {
      tool: "standard-work", kind: "standard",
      name: () => (current() ? nameOf(current()) : ""),
      data: () => { const d = current(); if (!d || !hasContent(d)) return null; const { id: _id, ...doc } = cleanDoc(d); return doc; },
      validate: (raw) => { const d = cleanDoc(isObject(raw) ? { ...raw, id: undefined } : null); return hasContent(d) ? d : null; },
      onOpen: (result) => {
        const d = result.data;
        d.updated = today();
        state.docs.unshift(d);
        open(d.id);
        return tx("A new standard from the file: {text}", { text: nameOf(d) });
      },
    });
  }

  // Another tab changed the saved standards.
  window.addEventListener("storage", (event) => {
    if (event.key !== cfg.storageKey) return;
    const next = read(cfg.storageKey, null);
    if (!isObject(next) || !Array.isArray(next.docs)) return;
    state.docs = next.docs.map(cleanDoc);
    state.current = str(next.current);
    state.example = state.docs.some((d) => d.id === str(next.example)) ? str(next.example) : "";
    fillForm();
    renderAll();
  });
  window.addEventListener("workplace:changed", fillAreas);

  // Start: a first visit opens on the example.
  if (firstVisit(cfg.storageKey)) {
    const d = exampleDoc(cfg.example, today());
    state.docs.push(d);
    state.example = d.id;
    state.current = d.id;
    save();
  } else if (!current() && state.docs.length) {
    state.current = state.docs[0].id;
  }
  fillAreas();
  fillForm();
  renderAll();
})();
