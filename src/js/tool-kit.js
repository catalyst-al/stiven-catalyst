// Helpers shared by the warehouse tools (defect-log.js, delay-analyzer.js).
window.ToolKit = (() => {
  // Language: German and Albanian pages carry their translations in #ui-strings,
  // keyed by the English text. tx("Copied") returns the translated text there,
  // or the English text itself; {name} placeholders are filled from vars.
  // Chrome has no Albanian number or date data, so Albanian pages format numbers
  // as German does (1.234,5) and spell dates with the names below.
  const LOCALES = { en: "en-GB", de: "de-DE", sq: "de-DE" };
  const LANG = document.documentElement.lang in LOCALES ? document.documentElement.lang : "en";
  const LOCALE = LOCALES[LANG];
  const SQ_MONTHS = ["jan", "shk", "mar", "pri", "maj", "qer", "korr", "gush", "sht", "tet", "nën", "dhj"];
  const SQ_DAYS = ["Die", "Hën", "Mar", "Mër", "Enj", "Pre", "Sht"];
  // dayMonth(true)(date) gives "Pre, 18 sht" / "Fri, 18 Sep"; build it once, call it often.
  const dayMonth = (weekday) => {
    if (LANG === "sq") return (date) => `${weekday ? `${SQ_DAYS[date.getUTCDay()]}, ` : ""}${date.getUTCDate()} ${SQ_MONTHS[date.getUTCMonth()]}`;
    const format = new Intl.DateTimeFormat(LOCALE, { ...(weekday && { weekday: "short" }), day: "numeric", month: "short", timeZone: "UTC" });
    return (date) => format.format(date);
  };
  // German and Albanian write 1.234,5 (or 1 234,5); English writes 1,234.5.
  const DECIMAL_COMMA = LANG !== "en";
  const strings = (() => {
    try { return JSON.parse(document.getElementById("ui-strings")?.textContent || "{}"); } catch { return {}; }
  })();
  const tx = (text, vars = {}) => (strings[text] ?? text).replace(/\{(\w+)\}/g, (match, name) => (name in vars ? vars[name] : match));

  // Storage (the tools work without it, for example in a private window).
  const read = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
  };
  // When saving fails (storage full, blocked or private mode), say so once,
  // so nobody relies on data that will be gone after a reload.
  let warned = false;
  const warnNotSaved = () => {
    if (warned) return;
    warned = true;
    const box = document.createElement("div");
    box.className = "tk-save-warning";
    box.setAttribute("role", "alert");
    const text = document.createElement("p");
    text.textContent = tx("This browser could not save your latest changes (storage is full, blocked or private). They stay on this page until you close it: download the CSV or copy the summary to keep them.");
    const close = document.createElement("button");
    close.type = "button";
    close.textContent = "OK";
    close.addEventListener("click", () => box.remove());
    box.append(text, close);
    document.body.append(box);
  };
  const write = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      warnNotSaved();
      return false;
    }
  };

  // Saved data can be damaged (an old format, an extension, a cut-off write).
  // Load only what has the expected shape, so a tool never breaks on load.
  const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
  const str = (value) => (typeof value === "string" ? value : "");
  const loadState = (key, defaults) => {
    const saved = read(key, {});
    const state = { ...defaults };
    if (!isObject(saved)) return state;
    Object.keys(defaults).forEach((name) => {
      const value = saved[name];
      const expected = defaults[name];
      const fits = Array.isArray(expected) ? Array.isArray(value)
        : isObject(expected) ? isObject(value)
        : typeof value === typeof expected;
      if (fits) state[name] = value;
    });
    return state;
  };

  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  const int = new Intl.NumberFormat(LOCALE);
  const euro = new Intl.NumberFormat(LOCALE, { style: "currency", currency: "EUR" });
  const num = (value, digits) => value.toLocaleString(LOCALE, { minimumFractionDigits: digits, maximumFractionDigits: digits });
  const pctFormat = (value, digits) => value.toLocaleString(LOCALE, { style: "percent", minimumFractionDigits: digits, maximumFractionDigits: digits });
  // Albanian writes 12,5% without the German space.
  const pct = (value, digits = 1) => (LANG === "sq" ? pctFormat(value, digits).replace(/\s%/, "%") : pctFormat(value, digits));
  // Dates are stored as YYYY-MM-DD; German and Albanian pages show them as DD.MM.YYYY.
  const showDate = (iso) => (DECIMAL_COMMA && /^\d{4}-\d{2}-\d{2}$/.test(iso) ? `${iso.slice(8, 10)}.${iso.slice(5, 7)}.${iso.slice(0, 4)}` : iso);
  const plural = (count, word, many = `${word}s`) => `${int.format(count)} ${count === 1 ? word : many}`;
  const capital = (text) => text.charAt(0).toUpperCase() + text.slice(1);
  // Mid-sentence lower case, except in German, where nouns keep their capital.
  const lower = (text) => (LANG === "de" ? text : text.toLowerCase());
  // Dates on this device's clock: a night shift logging after midnight gets today's date, not yesterday's (UTC).
  const localIso = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  const today = () => localIso(new Date());
  const addDays = (iso, days) => {
    const date = new Date(`${iso}T00:00:00Z`);
    date.setUTCDate(date.getUTCDate() + days);
    return date.toISOString().slice(0, 10);
  };

  // Parsing, for forms and for rows pasted from a spreadsheet.
  const parseNumber = (value) => {
    let text = String(value ?? "").replace(/[\s€]/g, "");
    if (!text) return NaN;
    const comma = text.lastIndexOf(",");
    const dot = text.lastIndexOf(".");
    // With one separator, use the page's locale to distinguish 1,234 from 1,234 decimals.
    if (comma >= 0 && dot < 0 && !DECIMAL_COMMA && /^\d{1,3}(,\d{3})+$/.test(text) && !text.startsWith("0,")) text = text.replace(/,/g, "");
    else if (dot >= 0 && comma < 0 && DECIMAL_COMMA && /^\d{1,3}(\.\d{3})+$/.test(text) && !text.startsWith("0.")) text = text.replace(/\./g, "");
    // When both appear, the later separator is decimal: 1.234,50 and 1,234.50.
    else text = comma > dot ? text.replace(/\./g, "").replace(",", ".") : text.replace(/,/g, "");
    if (!/^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(text)) return NaN;
    const number = Number(text);
    return Number.isFinite(number) ? number : NaN;
  };

  const iso = (year, month, day) => {
    const y = Number(year), m = Number(month), d = Number(day);
    if (y < 1 || y > 9999 || m < 1 || m > 12 || d < 1 || d > 31) return "";
    const date = new Date(0);
    date.setUTCFullYear(y, m - 1, d);
    return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d
      ? date.toISOString().slice(0, 10) : "";
  };
  const parseDate = (value) => {
    const text = String(value ?? "").trim();
    let match = text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:$|[T ])/);
    if (match) return iso(match[1], match[2], match[3]);
    match = text.match(/^(\d{1,2})[./](\d{1,2})[./](\d{2,4})$/);
    if (match) return iso(match[3].length === 2 ? `20${match[3]}` : match[3], match[2], match[1]);
    // Excel sometimes pastes dates as serial numbers.
    if (/^\d{5}(?:[.,]\d+)?$/.test(text)) return new Date(Date.UTC(1899, 11, 30) + Math.floor(Number(text.replace(",", "."))) * 864e5).toISOString().slice(0, 10);
    return "";
  };

  // Parse pasted TSV or CSV, including quoted separators, doubled quotes and line breaks.
  const parseRows = (text) => {
    const source = String(text ?? "").replace(/^\uFEFF/, "");
    let first = "", quoted = false;
    for (let i = 0; i < source.length; i++) {
      const ch = source[i];
      if (ch === '"') {
        if (quoted && source[i + 1] === '"') { i++; continue; }
        quoted = !quoted;
      } else if (!quoted && (ch === "\n" || ch === "\r")) break;
      else if (!quoted) first += ch;
    }
    const separator = first.includes("\t") ? "\t" : first.includes(";") ? ";" : ",";
    const rows = [];
    let row = [], field = "";
    quoted = false;
    const endField = () => { row.push(field.trim()); field = ""; };
    const endRow = () => {
      endField();
      if (row.some((cell) => cell)) rows.push(row);
      row = [];
    };
    for (let i = 0; i < source.length; i++) {
      const ch = source[i];
      if (ch === '"') {
        if (quoted && source[i + 1] === '"') { field += '"'; i++; }
        else quoted = !quoted;
      } else if (!quoted && ch === separator) endField();
      else if (!quoted && (ch === "\n" || ch === "\r")) {
        endRow();
        if (ch === "\r" && source[i + 1] === "\n") i++;
      } else field += ch;
    }
    if (field || row.length) endRow();
    return rows;
  };

  // Map a typed value onto a known option; unknown names are kept as they are.
  const canon = (options, value, empty) => {
    const text = String(value ?? "").trim();
    if (!text) return empty;
    const wanted = text.toLowerCase();
    // Albanian names may start with an article ("I shtypur"): "shtyp" still matches.
    const starts = (option) => option.toLowerCase().startsWith(wanted) || option.toLowerCase().replace(/^(?:i|e|të) /, "").startsWith(wanted);
    return options.find((option) => option.toLowerCase() === wanted)
      || (wanted.length >= 3 && options.find(starts))
      || text;
  };

  // Inverse of the standard normal distribution (Acklam), for the sigma level.
  const normInv = (p) => {
    const a = [-39.69683028665376, 220.9460984245205, -275.9285104469687, 138.357751867269, -30.66479806614716, 2.506628277459239];
    const b = [-54.47609879822406, 161.5858368580409, -155.6989798598866, 66.80131188771972, -13.28068155288572];
    const c = [-0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
    const d = [0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416];
    const tail = (q) => (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
    if (p < 0.02425) return tail(Math.sqrt(-2 * Math.log(p)));
    if (p > 1 - 0.02425) return -tail(Math.sqrt(-2 * Math.log(1 - p)));
    const q = p - 0.5;
    const r = q * q;
    return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
  };
  // Short-term sigma level with the usual 1.5 shift; 6 when there are no defects, and never below 0.
  const sigma = (rate) => (rate <= 0 ? 6 : rate >= 1 ? 0 : Math.max(0, normInv(1 - rate) + 1.5));
  const sigmaText = (rate) => (rate <= 0 ? "6+" : num(sigma(rate), 2));

  // The period a log is analysed over. An empty end is open; with no range every row counts,
  // with a range only rows dated inside it. A rate needs its volume for the same days.
  const inRange = (rows, from, to) => (!from && !to ? rows : rows.filter((row) => row.date && (!from || row.date >= from) && (!to || row.date <= to)));
  const dateSpan = (rows) => {
    const dates = rows.map((row) => row.date).filter(Boolean).sort();
    return dates.length ? { from: dates[0], to: dates.at(-1), days: new Set(dates).size } : null;
  };
  const RANGE_PRESETS = { today: 0, week: 6, month: 29 };
  const rangePreset = (name) => (name in RANGE_PRESETS ? { from: addDays(today(), -RANGE_PRESETS[name]), to: today() } : { from: "", to: "" });
  const spanText = (span) => (span.from === span.to ? showDate(span.from) : `${showDate(span.from)} – ${showDate(span.to)}`);
  // The range buttons and dates above a log (partials/log-range.njk). onChange runs after state.from/to change.
  const rangeControl = (box, state, rows, onChange) => {
    if (!box) return () => {};
    const inputs = [...box.querySelectorAll("input[type=date]")];
    const buttons = [...box.querySelectorAll("[data-preset]")];
    const note = box.querySelector("[data-span]");
    const sync = () => {
      inputs.forEach((input) => { input.value = state[input.name] || ""; });
      buttons.forEach((button) => {
        const preset = rangePreset(button.dataset.preset);
        button.setAttribute("aria-pressed", String(preset.from === (state.from || "") && preset.to === (state.to || "")));
      });
      const all = rows();
      const used = inRange(all, state.from, state.to);
      const span = dateSpan(used);
      note.textContent = !all.length ? ""
        : !used.length ? tx("No entries in this period. Choose another period or All.")
        : `${tx(used.length === all.length ? "All {n} entries" : "{n} of {total} entries", { n: int.format(used.length), total: int.format(all.length) })}${span ? `, ${spanText(span)} (${plural(span.days, tx("day"), tx("days"))})` : ""}. ${tx("Any volume you enter must cover the same days.")}`;
    };
    buttons.forEach((button) => button.addEventListener("click", () => {
      Object.assign(state, rangePreset(button.dataset.preset));
      onChange();
    }));
    inputs.forEach((input) => input.addEventListener("change", () => {
      state[input.name] = parseDate(input.value);
      onChange();
    }));
    return sync;
  };

  // Result pieces.
  const panel = (title, note) => {
    const box = el("article", "dl-panel");
    box.append(el("h3", "result-label", title));
    if (note) box.append(el("p", "dl-panel-note", note));
    return box;
  };

  const stat = (label, value, note) => {
    const box = el("div", "dl-stat");
    box.append(el("span", "dl-stat-label", label), el("strong", "dl-stat-value", value));
    if (note) box.append(el("span", "dl-stat-note", note));
    return box;
  };

  // Horizontal bars. Each item has key and value; options.label(item) returns
  // [bold value, rest of the text], options.title(item) the hover text.
  const barList = (items, options = {}) => {
    const list = el("div", "dl-bars");
    const max = Math.max(...items.map((item) => item.value), 0) || 1;
    items.forEach((item, index) => {
      const row = el("div", "dl-bar");
      const highlight = options.highlight ? options.highlight(item) : false;
      if (highlight) row.classList.add("is-top");
      if (options.title) row.title = options.title(item);
      const label = el("div", "dl-bar-label");
      const name = el("span", "dl-bar-name");
      if (options.ranked) name.append(el("span", "dl-rank", String(index + 1)));
      name.append(item.key);
      if (highlight && options.tag) name.append(el("span", "dl-tag", options.tag));
      label.append(name);
      const [strong, rest] = options.label ? options.label(item) : [int.format(item.value), ""];
      const value = el("span", "dl-bar-value");
      value.append(el("strong", null, strong), rest);
      label.append(value);
      const track = el("div", "bar-track");
      const fill = el("div", "bar-fill");
      fill.style.width = `${(item.value / max) * 100}%`;
      track.append(fill);
      row.append(label, track);
      list.append(row);
    });
    return list;
  };

  // "Start here" card: stage or reason advice from a tool's data file.
  const focusCard = ({ title, detail, lede, advice, extraLabel, extra, warning }) => {
    const focus = el("article", "result-card dl-focus");
    focus.append(el("p", "result-label", tx("Start here")));
    const heading = el("h3");
    heading.append(title);
    if (detail) heading.append(el("span", null, ` · ${detail}`));
    focus.append(heading);
    focus.append(el("p", "dl-focus-lede", lede));
    if (advice) {
      focus.append(el("p", null, advice.meaning));
      focus.append(el("p", "result-label", tx("First moves")));
      const moves = el("ol", "moves");
      advice.moves.forEach((move) => moves.append(el("li", null, move)));
      focus.append(moves);
    }
    if (extra) {
      focus.append(el("p", "result-label", extraLabel));
      focus.append(el("p", null, extra));
    }
    if (advice) {
      focus.append(el("p", "result-label", tx("Question for the floor")));
      focus.append(el("blockquote", null, advice.question));
    }
    if (warning) focus.append(el("p", "dl-warning", warning));
    return focus;
  };

  const copy = async (text, button) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const area = el("textarea");
      area.value = text;
      document.body.append(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    const label = button.textContent;
    button.textContent = tx("Copied");
    setTimeout(() => { button.textContent = label; }, 1600);
  };

  // Copy, print and 5 Whys buttons under a result.
  // pareto, when given, returns a table ({ source, template, headers, rows, map, measure })
  // that the Pareto tool opens; it travels in sessionStorage, so it stays in this tab.
  const resultActions = (summary, problem, pareto) => {
    const actions = el("div", "tool-actions result-actions");
    const copyButton = el("button", "button-primary", tx("Copy summary"));
    copyButton.type = "button";
    copyButton.addEventListener("click", () => copy(summary(), copyButton));
    const printButton = el("button", "button-secondary", tx("Print or save as PDF"));
    printButton.type = "button";
    printButton.addEventListener("click", () => window.print());
    const whys = el("a", "button-secondary", tx("Take it to 5 Whys"));
    // The page's own 5 Whys link says which worksheet to open; otherwise it
    // is the one next to this tool.
    const url = new URL(document.querySelector("a[data-five-whys]")?.href || new URL("../five-whys/", window.location.href));
    url.searchParams.set("problem", problem);
    whys.href = url.href;
    actions.append(copyButton, printButton, whys);
    if (pareto) {
      const link = el("a", "button-secondary", tx("Open in Pareto 80/20"));
      link.href = new URL("../pareto/", window.location.href).href;
      link.addEventListener("click", () => {
        try { sessionStorage.setItem("sc-pareto-handoff", JSON.stringify(pareto())); } catch { /* the page opens empty */ }
      });
      actions.append(link);
    }
    return actions;
  };

  // Log tables show the newest rows only: a table of thousands of rows makes
  // every keystroke slow. Results and CSV always use every row.
  const LOG_LIMIT = 100;
  // With a large log, typing waits for a short pause before saving and
  // rebuilding the results, so every keystroke stays instant on slow phones.
  // Anything still waiting runs at once when the page is hidden or closed.
  const pending = new Set();
  const flushPending = () => pending.forEach((run) => run());
  // Listen only once something waits, so loading the kit touches no page events.
  let listening = false;
  const listen = () => {
    if (listening) return;
    listening = true;
    window.addEventListener("pagehide", flushPending);
    document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") flushPending(); });
  };
  const renderOnPause = (render, rowCount, limit = 300) => {
    let timer;
    const run = () => {
      clearTimeout(timer);
      pending.delete(run);
      render();
    };
    return () => {
      clearTimeout(timer);
      if (rowCount() > limit) {
        listen();
        pending.add(run);
        timer = setTimeout(run, 150);
      } else {
        run();
      }
    };
  };
  const shownNote = (total) => (total > LOG_LIMIT ? tx(" · newest {n} shown, CSV has all", { n: LOG_LIMIT }) : "");

  const flash = (node, message) => {
    node.textContent = message;
    clearTimeout(node.timer);
    node.timer = setTimeout(() => { node.textContent = ""; }, 2600);
  };
  // A removed row can be put back for a few seconds: one tap on a phone is easy to miss.
  const undoNote = (node, message, undo) => {
    const button = el("button", "dl-undo", tx("Undo"));
    button.type = "button";
    button.addEventListener("click", () => {
      clearTimeout(node.timer);
      node.textContent = "";
      undo();
    });
    node.replaceChildren(`${message} `, button);
    clearTimeout(node.timer);
    node.timer = setTimeout(() => { node.textContent = ""; }, 8000);
  };

  // German and Albanian Excel expect semicolons and a decimal comma.
  const downloadCsv = (name, rows) => {
    const separator = DECIMAL_COMMA ? ";" : ",";
    const quote = (value) => {
      const text = typeof value === "number" && DECIMAL_COMMA ? String(value).replace(".", ",") : String(value ?? "");
      return text.includes(separator) || /["\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
    };
    const lines = rows.map((cells) => cells.map(quote).join(separator));
    const blob = new Blob([`﻿${lines.join("\r\n")}\r\n`], { type: "text/csv;charset=utf-8" });
    const link = el("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${name}-${today()}.csv`;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  };

  // The floor check under each tool: ticks are kept per tool.
  const floorCheck = (section, key) => {
    const boxes = [...section.querySelectorAll("input[type=checkbox]")];
    const score = section.querySelector("[data-check-score]");
    const render = () => {
      const ticked = boxes.filter((box) => box.checked).length;
      const total = boxes.length;
      const verdict = ticked === total ? tx("The standard holds today.")
        : ticked >= total - 2 ? tx("Close. Fix the open lines this shift.")
        : ticked >= total / 2 ? tx("Gaps in the standard. Expect misses where lines are open.")
        : tx("Not yet a standard. Start with the first three lines.");
      score.replaceChildren(el("strong", null, tx("{a} of {b}", { a: ticked, b: total })), ` ${tx("in place.")} ${verdict}`);
    };
    const saved = read(key, []);
    boxes.forEach((box, index) => {
      box.checked = Boolean(saved[index]);
      box.addEventListener("change", () => {
        write(key, boxes.map((item) => item.checked));
        render();
      });
    });
    section.querySelector("[data-check-reset]").addEventListener("click", () => {
      boxes.forEach((box) => { box.checked = false; });
      write(key, []);
      render();
    });
    render();
    return () => {
      const ticked = boxes.filter((box) => box.checked).length;
      return ticked ? tx("Floor check: {a} of {b} standards in place", { a: ticked, b: boxes.length }) : "";
    };
  };

  return {
    LANG, LOCALE, DECIMAL_COMMA, tx, num, showDate, dayMonth, lower,
    read, write, isObject, str, loadState, el, int, euro, pct, plural, capital, today, addDays,
    parseNumber, parseDate, parseRows, canon, sigma, sigmaText,
    inRange, dateSpan, rangePreset, spanText, rangeControl,
    panel, stat, barList, focusCard, resultActions, copy, flash, undoNote, downloadCsv, floorCheck, LOG_LIMIT, shownNote, renderOnPause,
  };
})();
