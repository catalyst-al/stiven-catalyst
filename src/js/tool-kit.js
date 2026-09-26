// Helpers shared by the warehouse tools (defect-log.js, delay-analyzer.js).
window.ToolKit = (() => {
  // Language: German pages carry their translations in #ui-strings, keyed by
  // the English text. tx("Copied") returns the German text there, or the
  // English text itself; {name} placeholders are filled from vars.
  const LANG = document.documentElement.lang === "de" ? "de" : "en";
  const LOCALE = LANG === "de" ? "de-DE" : "en-GB";
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
  const pct = (value, digits = 1) => value.toLocaleString(LOCALE, { style: "percent", minimumFractionDigits: digits, maximumFractionDigits: digits });
  // Dates are stored as YYYY-MM-DD; German pages show them as DD.MM.YYYY.
  const showDate = (iso) => (LANG === "de" && /^\d{4}-\d{2}-\d{2}$/.test(iso) ? `${iso.slice(8, 10)}.${iso.slice(5, 7)}.${iso.slice(0, 4)}` : iso);
  const plural = (count, word, many = `${word}s`) => `${int.format(count)} ${count === 1 ? word : many}`;
  const capital = (text) => text.charAt(0).toUpperCase() + text.slice(1);
  // Mid-sentence lower case for English labels; German nouns keep their capital.
  const lower = (text) => (LANG === "de" ? text : text.toLowerCase());
  const today = () => new Date().toISOString().slice(0, 10);

  // Parsing, for forms and for rows pasted from a spreadsheet.
  const parseNumber = (value) => {
    let text = String(value ?? "").replace(/[\s€]/g, "");
    if (!text) return NaN;
    const comma = text.lastIndexOf(",");
    const dot = text.lastIndexOf(".");
    // With one separator, use the page's locale to distinguish 1,234 from 1,234 decimals.
    if (comma >= 0 && dot < 0 && LANG === "en" && /^\d{1,3}(,\d{3})+$/.test(text) && !text.startsWith("0,")) text = text.replace(/,/g, "");
    else if (dot >= 0 && comma < 0 && LANG === "de" && /^\d{1,3}(\.\d{3})+$/.test(text) && !text.startsWith("0.")) text = text.replace(/\./g, "");
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
    if (/^\d{5}$/.test(text)) return new Date(Date.UTC(1899, 11, 30) + Number(text) * 864e5).toISOString().slice(0, 10);
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
    return options.find((option) => option.toLowerCase() === wanted)
      || (wanted.length >= 3 && options.find((option) => option.toLowerCase().startsWith(wanted)))
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
  // Short-term sigma level with the usual 1.5 shift; 6 when there are no defects.
  const sigma = (rate) => (rate === 0 ? 6 : normInv(1 - rate) + 1.5);
  const sigmaText = (rate) => (rate === 0 ? "6+" : num(sigma(rate), 2));

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
  const resultActions = (summary, problem) => {
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
  window.addEventListener("pagehide", flushPending);
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") flushPending(); });
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

  // German Excel expects semicolons and a decimal comma.
  const downloadCsv = (name, rows) => {
    const separator = LANG === "de" ? ";" : ",";
    const quote = (value) => {
      const text = typeof value === "number" && LANG === "de" ? String(value).replace(".", ",") : String(value ?? "");
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
    LANG, LOCALE, tx, num, showDate, lower,
    read, write, isObject, str, loadState, el, int, euro, pct, plural, capital, today,
    parseNumber, parseDate, parseRows, canon, sigma, sigmaText,
    panel, stat, barList, focusCard, resultActions, flash, downloadCsv, floorCheck, LOG_LIMIT, shownNote, renderOnPause,
  };
})();
