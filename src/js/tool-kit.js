// Helpers shared by the warehouse tools (defect-log.js, delay-analyzer.js).
window.ToolKit = (() => {
  // Language: German and Albanian pages load their translations as window.UiStrings (js/ui-de.js, js/ui-sq.js),
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
  // "Oct 2026" / "Okt. 2026" / "Tet 2026": the name of a month in a trend by month.
  const monthYear = (() => {
    if (LANG === "sq") return (date) => `${SQ_MONTHS[date.getUTCMonth()].charAt(0).toUpperCase()}${SQ_MONTHS[date.getUTCMonth()].slice(1)} ${date.getUTCFullYear()}`;
    const format = new Intl.DateTimeFormat(LOCALE, { month: "short", year: "numeric", timeZone: "UTC" });
    return (date) => format.format(date);
  })();
  // German and Albanian write 1.234,5 (or 1 234,5); English writes 1,234.5.
  const DECIMAL_COMMA = LANG !== "en";
  const strings = window.UiStrings || (() => {
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
    // Locked for a shared computer (js/work-lock.js): the tools show nothing and keep nothing until the PIN.
    if (window.WorkLock?.locked) return false;
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
  // Saved text the browser cannot parse any more is never thrown away: it is kept, as it is, under key + ".unreadable"
  // (it goes into the backup file with the rest), the page says so once, and the tool starts empty instead of opening
  // on its example over it (audit of 27 October 2026, P2A-10 and P2B-08).
  let warnedDamaged = false;
  const keepDamaged = (key) => {
    let raw = null;
    try { raw = localStorage.getItem(key); } catch { return; }
    if (raw === null) return;
    try { JSON.parse(raw); return; } catch { /* damaged: kept below */ }
    try { if (localStorage.getItem(`${key}.unreadable`) === null) localStorage.setItem(`${key}.unreadable`, raw); } catch { /* storage full: the text stays under its own key until the next save */ }
    if (warnedDamaged || !document.body) return;
    warnedDamaged = true;
    const box = document.createElement("div");
    box.className = "tk-save-warning";
    box.setAttribute("role", "alert");
    const text = document.createElement("p");
    text.textContent = tx("The saved data of this tool could not be read: it is damaged. It is kept aside unchanged, so nothing is lost, and the tool starts empty. A backup file or a restore point can bring your work back.");
    const close = document.createElement("button");
    close.type = "button";
    close.textContent = "OK";
    close.addEventListener("click", () => box.remove());
    box.append(text, close);
    document.body.append(box);
  };
  const loadState = (key, defaults) => {
    keepDamaged(key);
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
  // The example week of a tool, moved forward by whole weeks so that its last day is not in the
  // future and not weeks ago: the weekdays stay the same, and the other tools (Shift Pulse, the
  // handover) see it in their recent days. Rows are "YYYY-MM-DD|..." strings.
  const recentExample = (rows) => {
    const dates = rows.map((row) => String(row).slice(0, 10)).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)).sort();
    if (!dates.length) return rows;
    const weeks = Math.floor((Date.parse(`${today()}T00:00:00Z`) - Date.parse(`${dates.at(-1)}T00:00:00Z`)) / (7 * 864e5));
    if (!(weeks > 0)) return rows;
    return rows.map((row) => (/^\d{4}-\d{2}-\d{2}/.test(row) ? addDays(String(row).slice(0, 10), weeks * 7) + String(row).slice(10) : row));
  };
  const addDays = (iso, days) => {
    const date = new Date(`${iso}T00:00:00Z`);
    date.setUTCDate(date.getUTCDate() + days);
    return date.toISOString().slice(0, 10);
  };

  // Parsing, for forms and for rows pasted from a spreadsheet.
  const parseNumber = (value) => {
    // An export may write the currency next to the amount: "1.234,50 EUR", "CHF 80".
    let text = String(value ?? "").replace(/[\s€]/g, "").replace(/^(?:EUR|CHF|USD|GBP|ALL|Lek)(?=[\d+.,-])/i, "")
      .replace(/([\d.,-])(?:EUR|CHF|USD|GBP|ALL|Lek)$/i, "$1");
    if (!text) return NaN;
    // SAP lists put the minus after the number: 12,5- is -12.5.
    let sign = "";
    if (/^[+-]/.test(text)) [sign, text] = [text[0], text.slice(1)];
    else if (/^[\d.,]+-$/.test(text)) [sign, text] = ["-", text.slice(0, -1)];
    const comma = text.lastIndexOf(",");
    const dot = text.lastIndexOf(".");
    // A separator repeated is grouping in every locale: 1.234.567 and 1,234,567.
    if (comma >= 0 && dot < 0 && /^\d{1,3}(,\d{3}){2,}$/.test(text)) text = text.replace(/,/g, "");
    else if (dot >= 0 && comma < 0 && /^\d{1,3}(\.\d{3}){2,}$/.test(text)) text = text.replace(/\./g, "");
    // With one separator, use the page's locale to distinguish 1,234 from 1,234 decimals.
    else if (comma >= 0 && dot < 0 && !DECIMAL_COMMA && /^\d{1,3}(,\d{3})+$/.test(text) && !text.startsWith("0,")) text = text.replace(/,/g, "");
    else if (dot >= 0 && comma < 0 && DECIMAL_COMMA && /^\d{1,3}(\.\d{3})+$/.test(text) && !text.startsWith("0.")) text = text.replace(/\./g, "");
    // When both appear, the later separator is decimal: 1.234,50 and 1,234.50.
    else text = comma > dot ? text.replace(/\./g, "").replace(",", ".") : text.replace(/,/g, "");
    if (!/^(?:\d+\.?\d*|\.\d+)$/.test(text)) return NaN;
    const number = Number(sign + text);
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
    // Day first, as European exports write it, also with a time after it: 24.10.2026 08:15, 24/10/2026 08:15:00.
    match = text.match(/^(\d{1,2})[./](\d{1,2})[./](\d{2,4})(?:$|,?\s+\d{1,2}:\d{2}(?::\d{2})?\s*(?:Uhr|h)?$)/i);
    if (match) return iso(match[3].length === 2 ? `20${match[3]}` : match[3], match[2], match[1]);
    // Excel sometimes pastes dates as serial numbers.
    if (/^\d{5}(?:[.,]\d+)?$/.test(text)) return new Date(Date.UTC(1899, 11, 30) + Math.floor(Number(text.replace(",", "."))) * 864e5).toISOString().slice(0, 10);
    return "";
  };

  // A cell that holds a date and a time ("24.10.2026 08:15", "2026-10-24T08:15:00"): both parts, the time as HH:MM
  // or "" when there is none.
  const parseDateTime = (value) => {
    const text = String(value ?? "").trim();
    const date = parseDate(text);
    const match = date ? text.match(/[T\s,](\d{1,2}):(\d{2})(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:?\d{2})?\s*(?:Uhr|h)?$/i) : null;
    const time = match && Number(match[1]) < 24 && Number(match[2]) < 60 ? `${match[1].padStart(2, "0")}:${match[2]}` : "";
    return { date, time };
  };

  // Parse pasted TSV or CSV, including quoted separators, doubled quotes and line breaks.
  // With keepBlank, an empty line stays as an empty row, so that the rows keep the line numbers of the file.
  const parseRows = (text, { keepBlank = false } = {}) => {
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
      else if (keepBlank) rows.push([]);
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
  // Short-term sigma level with the 1.5 shift that sigma tables add by convention; 6 when there are no defects, and never
  // below 0.
  const sigma = (rate) => (rate <= 0 ? 6 : rate >= 1 ? 0 : Math.max(0, normInv(1 - rate) + 1.5));
  // With no defect at all, a sample of n says only that the rate is below about 3/n (the rule of three, 95 %
  // confidence): "≥ 4.25" for none in 1,000, not "6+". Without n, "6+".
  const sigmaText = (rate, n) => (rate <= 0 ? (n > 0 ? `≥ ${num(sigma(Math.min(1, 3 / n)), 2)}` : "6+") : num(sigma(rate), 2));

  // The period a log is analysed over. An empty end is open; with no range every row counts,
  // with a range only rows dated inside it. A rate needs its volume for the same days.
  const inRange = (rows, from, to) => (!from && !to ? rows : rows.filter((row) => row.date && (!from || row.date >= from) && (!to || row.date <= to)));
  // A total typed for a period (the units handled, the routes) belongs to the days chosen when it was typed; a log
  // remembers them in totalsFor. With other days chosen it is not used: it would be compared with the rows of other days.
  // Gives the typed text, or "" and the period it was typed for (stale).
  const rangeKey = (range) => `${str(range.from)}|${str(range.to)}`;
  const typedRange = (state, name) => {
    const key = isObject(state.totalsFor) ? state.totalsFor[name] : undefined;
    if (typeof key !== "string") return null;
    const [from = "", to = ""] = key.split("|");
    return { from, to };
  };
  const periodTotal = (state, name) => {
    const value = str(state[name]).trim();
    const range = typedRange(state, name);
    if (!value || !range || rangeKey(range) === rangeKey(state)) return { value, stale: null };
    return { value: "", stale: range };
  };
  // "1 Sept – 7 Sept", "From 1 Sept", "all days" for a chosen period.
  const rangeText = (range) => (range.from && range.to ? spanText(range) : range.from ? `${tx("From")} ${showDate(range.from)}` : range.to ? `${tx("To")} ${showDate(range.to)}` : tx("all days"));
  // A saved route log that holds only some routes of its period: the Delay Analyzer's "Routes in the period" is more
  // than the routes logged in the days it was typed for (often only the late ones are logged). Its routes are then no
  // base for a share.
  const partialRouteLog = (saved) => {
    if (!isObject(saved) || !Array.isArray(saved.rows)) return false;
    const set = Math.round(parseNumber(saved.routes));
    const range = typedRange(saved, "routes") || { from: str(saved.from), to: str(saved.to) };
    return set > 0 && set > inRange(saved.rows.filter(isObject), range.from, range.to).length;
  };
  // One pass, no sort: logs can hold thousands of rows and this runs on every change.
  const dateSpan = (rows) => {
    const days = new Set();
    let from = "";
    let to = "";
    for (const row of rows) {
      const date = row.date;
      if (!date) continue;
      days.add(date);
      if (!from || date < from) from = date;
      if (!to || date > to) to = date;
    }
    return days.size ? { from, to, days: days.size } : null;
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
    // A value in words (the largest cause, "25 above") is set smaller than a number, so its words fit the card.
    const words = /\p{L}{4,}/u.test(String(value));
    box.append(el("span", "dl-stat-label", label), el("strong", words ? "dl-stat-value is-words" : "dl-stat-value", value));
    if (note) box.append(el("span", "dl-stat-note", note));
    return box;
  };

  // Horizontal bars. Each item has key and value; options.label(item) returns
  // [bold value, rest of the text], options.title(item) the hover text.
  // With options.pick(item) every row is a button that picks its item (a log filters by it), pressed when
  // options.picked(item) is true; options.pickKey names the list, so the same row gets the focus back after a redraw.
  const barList = (items, options = {}) => {
    const list = el("div", "dl-bars");
    const max = Math.max(...items.map((item) => item.value), 0) || 1;
    const pickable = typeof options.pick === "function";
    // Inside a button only phrasing content is allowed, so the parts are spans there.
    const box = pickable ? "span" : "div";
    items.forEach((item, index) => {
      const row = el(pickable ? "button" : "div", "dl-bar");
      if (pickable) {
        row.type = "button";
        row.classList.add("is-pick");
        row.setAttribute("aria-pressed", String(Boolean(options.picked?.(item))));
        row.dataset.focusKey = `pick:${options.pickKey || ""}:${item.key}`;
        row.addEventListener("click", () => options.pick(item));
      }
      const highlight = options.highlight ? options.highlight(item) : false;
      if (highlight) row.classList.add("is-top");
      if (options.title) row.title = options.title(item);
      const label = el(box, "dl-bar-label");
      const name = el("span", "dl-bar-name");
      if (options.ranked) name.append(el("span", "dl-rank", String(index + 1)));
      name.append(item.key);
      if (highlight && options.tag) name.append(el("span", "dl-tag", options.tag));
      label.append(name);
      const [strong, rest] = options.label ? options.label(item) : [int.format(item.value), ""];
      const value = el("span", "dl-bar-value");
      value.append(el("strong", null, strong), rest);
      label.append(value);
      const track = el(box, "bar-track");
      const fill = el(box, "bar-fill");
      fill.style.width = `${(item.value / max) * 100}%`;
      track.append(fill);
      row.append(label, track);
      list.append(row);
    });
    return list;
  };

  // Shares of a volume are small (0.45% of the units is a bad day), so the digits follow the size: 12%, 0.45%.
  const shareText = (value) => pct(value, value === 0 || value >= 0.1 ? 0 : 2);
  // The volume of single days (units handled, orders shipped), kept by the defect logs and read by Shift Pulse. One
  // volume per date (a new value for a date replaces the old one), oldest first.
  const cleanVolumes = (list) => {
    const byDate = new Map();
    list.filter(isObject).forEach((item) => {
      const date = parseDate(item.date);
      const volume = Math.round(Number(item.volume));
      if (date && volume > 0 && Number.isSafeInteger(volume)) byDate.set(date, volume);
    });
    return [...byDate].sort(([a], [b]) => a.localeCompare(b)).map(([date, volume]) => ({ date, volume }));
  };
  // Rows pasted from a spreadsheet: date, then the volume of that day.
  const importVolumes = (text) => {
    const added = [];
    let skipped = 0;
    parseRows(text).forEach((cells, index) => {
      const [date, volume] = cells;
      const day = parseDate(date);
      const value = Math.round(parseNumber(volume));
      if (!day || !(value > 0) || !Number.isSafeInteger(value)) {
        // A first row with words where the date and the number belong is a header.
        if (index > 0) skipped++;
        return;
      }
      added.push({ date: day, volume: value });
    });
    return { added, skipped };
  };
  // The days of a period that have a volume of their own. rows are the rows of the period and from/to its own
  // limits ("" when open): an open side runs to the first or last day with entries, so volumes entered for other
  // months do not dilute the rate, while a limit that is given counts its quiet days too. "missing" lists the days
  // with entries that have no volume.
  const dayVolumes = (volumes, rows, from, to) => {
    const span = dateSpan(rows);
    const low = from || span?.from;
    const high = to || span?.to;
    if (!low || !high) return { items: [], missing: [], undated: false, total: 0 };
    const items = volumes.filter((item) => item.date >= low && item.date <= high);
    const have = new Set(items.map((item) => item.date));
    return {
      items,
      missing: [...new Set(rows.filter((row) => row.date).map((row) => row.date))].filter((date) => !have.has(date)).sort(),
      undated: rows.some((row) => !row.date),
      total: items.reduce((sum, item) => sum + item.volume, 0),
    };
  };

  // Trend over time. trendBuckets groups dated rows by day (a period of up to 31 days), by week (Monday to Sunday)
  // or, when asked, by month (from its first day), fills quiet days with 0 and sums valueOf(row). It is plain
  // arithmetic, so a test can call it.
  const mondayOf = (isoDate) => {
    const date = new Date(`${isoDate}T00:00:00Z`);
    return addDays(isoDate, -((date.getUTCDay() + 6) % 7));
  };
  const monthStart = (isoDate) => `${isoDate.slice(0, 7)}-01`;
  const nextMonth = (key) => {
    const date = new Date(`${key}T00:00:00Z`);
    date.setUTCMonth(date.getUTCMonth() + 1);
    return date.toISOString().slice(0, 10);
  };
  const TREND_UNITS = ["day", "week", "month"];
  // With totalOf, each bucket holds a share (sum of valueOf over sum of totalOf, 0 to 1) and its count and total;
  // a day with no total has no share and draws no column. options: { unit: "day", "week" or "month" instead of by the
  // length of the span, from and to: dates the buckets must cover even where there are no rows }.
  const trendBuckets = (rows, valueOf, maxBuckets = 60, totalOf = null, options = {}) => {
    const dated = rows.filter((row) => /^\d{4}-\d{2}-\d{2}$/.test(row.date));
    const undated = rows.length - dated.length;
    const reach = [options.from, options.to].filter(Boolean);
    if (!dated.length && !reach.length) return { unit: options.unit || "day", buckets: [], undated };
    const dates = [...dated.map((row) => row.date), ...reach].sort();
    const days = Math.round((new Date(`${dates.at(-1)}T00:00:00Z`) - new Date(`${dates[0]}T00:00:00Z`)) / 864e5) + 1;
    const unit = TREND_UNITS.includes(options.unit) ? options.unit : options.unit ? "week" : days <= 31 ? "day" : "week";
    const keyOf = unit === "day" ? (d) => d : unit === "month" ? monthStart : mondayOf;
    const next = unit === "day" ? (key) => addDays(key, 1) : unit === "month" ? nextMonth : (key) => addDays(key, 7);
    const sums = new Map();
    const totals = new Map();
    dated.forEach((row) => {
      sums.set(keyOf(row.date), (sums.get(keyOf(row.date)) || 0) + valueOf(row));
      if (totalOf) totals.set(keyOf(row.date), (totals.get(keyOf(row.date)) || 0) + totalOf(row));
    });
    const buckets = [];
    for (let key = keyOf(dates[0]); key <= keyOf(dates.at(-1)); key = next(key)) {
      const count = sums.get(key) || 0;
      const total = totals.get(key) || 0;
      const to = addDays(next(key), -1);
      buckets.push(totalOf ? { key, to, count, total, value: total ? count / total : 0 } : { key, to, value: count });
    }
    return { unit, buckets: buckets.slice(-maxBuckets), undated };
  };
  // The period of the same length just before a period: 8–14 Oct gives 1–7 Oct (days: 7).
  const daysBetween = (from, to) => Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 864e5);
  const previousRange = (range) => {
    if (!range || !/^\d{4}-\d{2}-\d{2}$/.test(range.from || "") || !/^\d{4}-\d{2}-\d{2}$/.test(range.to || "") || range.to < range.from) return null;
    const days = daysBetween(range.from, range.to) + 1;
    return { from: addDays(range.from, -days), to: addDays(range.from, -1), days };
  };
  // What a whole trend adds up to: with shares, its count over its total (the same as the dashed average); otherwise
  // the sum of its buckets. value is null for shares without any total.
  const trendTotal = (trend) => {
    const buckets = trend?.buckets || [];
    if (!buckets.some((b) => "total" in b)) return { value: buckets.reduce((sum, b) => sum + b.value, 0), count: null, total: null };
    const count = buckets.reduce((sum, b) => sum + b.count, 0);
    const total = buckets.reduce((sum, b) => sum + b.total, 0);
    return { value: total ? count / total : null, count, total };
  };
  // The change from before to now as a share of before: 0.57 % to 0.42 % is about −0.26. null when before is 0 or missing.
  const periodChange = (now, before) => (Number.isFinite(now) && Number.isFinite(before) && before > 0 ? (now - before) / before : null);
  // "−26%", "+12%", "±0%".
  const changeText = (change) => (change === null ? "" : `${change > 0.0005 ? "+" : change < -0.0005 ? "−" : "±"}${pct(Math.abs(change), 0)}`);
  // The line under a trend compared with the period before: "This period 0.42% · before 0.57% · −26%".
  const compareText = (now, before, format) => {
    const change = periodChange(now, before);
    const vars = { now: format(now), before: format(before), change: changeText(change) };
    return change === null ? tx("This period {now} · before {before}", vars) : tx("This period {now} · before {before} · {change}", vars);
  };
  // Shares over a volume of each day: countOf(row) over volumes[{ date, volume }], per day or per week. A day with
  // entries but no volume cannot have a share, so it is left out and listed in `skipped`; a day with a volume and no
  // entries counts as 0. Pass only the volumes of the days that belong to the period.
  const trendShares = (rows, countOf, volumes, maxBuckets = 60, options = {}) => {
    const volumeOf = new Map(volumes.map((item) => [item.date, item.volume]));
    const parts = [
      ...rows.filter((row) => volumeOf.has(row.date)).map((row) => ({ date: row.date, count: countOf(row), total: 0 })),
      ...volumes.map((item) => ({ date: item.date, count: 0, total: item.volume })),
    ];
    const trend = trendBuckets(parts, (part) => part.count, maxBuckets, (part) => part.total, options);
    return { ...trend, undated: rows.filter((row) => !row.date).length, skipped: [...new Set(rows.filter((row) => row.date && !volumeOf.has(row.date)).map((row) => row.date))].sort() };
  };

  const SVG_NS = "http://www.w3.org/2000/svg";
  const svgEl = (tag, attrs = {}, text) => {
    const node = document.createElementNS(SVG_NS, tag);
    Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const TREND_COLORS = { bar: "var(--tr-bar)", top: "var(--tr-top)", line: "var(--tr-line)", grid: "var(--tr-grid)", text: "var(--tr-text)", muted: "var(--tr-muted)", target: "var(--tr-target)" };
  const TREND_EXPORT = { bar: "#0a6ab0", top: "#c2141b", line: "#1b2330", grid: "#e3e6ea", text: "#1b2330", muted: "#5f6870", target: "#7f5c1f" };
  // The next 1, 2, 5 or 10 times a power of ten above the value (0.12 gives 0.2, 7 gives 10).
  const niceMax = (value) => {
    if (!(value > 0)) return 1;
    const magnitude = 10 ** Math.floor(Math.log10(value));
    return [1, 2, 5, 10].map((m) => m * magnitude).find((m) => m >= value - 1e-12) || value;
  };
  // Columns per bucket, a dashed average line and the highest bucket in the alert colour. With labels.target (a share,
  // for buckets that hold shares) a solid target line is drawn and every column above it is in the alert colour instead.
  // labels: { title, unit (what the columns count), average, format (optional), target, targetLabel, previous (the
  // buckets of the period before, in the same order: drawn as a thin dashed line over the columns and named in each
  // column's tooltip), events ([{ date, text }]: a dashed vertical line with a flag on each date) }. Returns an <svg>.
  const trendChart = (trend, colors, labels) => {
    const { buckets, unit } = trend;
    const W = 640, H = 280, left = 44, right = 14, top = 28, bottom = 44;
    const plotW = W - left - right, plotH = H - top - bottom;
    const shares = buckets.some((b) => "total" in b);
    const format = labels.format || ((value) => int.format(Math.round(value * 10) / 10));
    const max = Math.max(...buckets.map((b) => b.value), 0);
    const target = shares && Number.isFinite(labels.target) && labels.target > 0 ? labels.target : null;
    // A bucket of the period before counts only where it has something to compare: a share needs its total.
    const previous = buckets.map((b, i) => {
      const before = labels.previous?.[i];
      return before && (!shares || before.total > 0) ? before : null;
    });
    const peak = Math.max(max, target ?? 0, ...previous.map((b) => b?.value ?? 0));
    const ceiling = shares ? Math.min(1, niceMax(peak * 100) / 100) : niceMax(peak);
    const y = (value) => top + plotH - (Math.min(value, ceiling) / ceiling) * plotH;
    const band = plotW / buckets.length;
    const barW = Math.max(2, Math.min(40, band * 0.7));
    const dayName = dayMonth(false);
    const nameOf = unit === "month" ? (b) => monthYear(new Date(`${b.key}T00:00:00Z`)) : (b) => dayName(new Date(`${b.key}T00:00:00Z`));
    const svg = svgEl("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": labels.title, class: "tr-chart", "font-family": "Inter, Segoe UI, Roboto, Arial, sans-serif" });
    svg.append(svgEl("title", {}, labels.title));
    [0, 0.5, 1].forEach((f) => {
      const value = ceiling * f;
      svg.append(svgEl("line", { x1: left, x2: W - right, y1: y(value), y2: y(value), style: `stroke:${colors.grid}`, "stroke-width": 1 }));
      svg.append(svgEl("text", { x: left - 8, y: y(value) + 4, "text-anchor": "end", "font-size": 12, style: `fill:${colors.muted}` }, format(value)));
    });
    const top1 = buckets.findIndex((b) => b.value === max);
    buckets.forEach((b, i) => {
      const cx = left + band * (i + 0.5);
      const hot = target ? b.total > 0 && b.value > target : max > 0 && i === top1;
      // The chart is one image with one name; a column is a tooltip (its title), not a tab stop of its own.
      const g = svgEl("g", { class: "tr-col" });
      const before = previous[i];
      const tipText = `${nameOf(b)}: ${format(b.value)} ${labels.unit}${shares ? ` (${b.count}/${b.total})` : ""}${before
        ? `\n${labels.beforeLabel || tx("Before")} (${nameOf(before)}): ${format(before.value)}${shares ? ` (${before.count}/${before.total})` : ""}` : ""}`;
      g.append(svgEl("title", {}, tipText));
      g.setAttribute("data-tip", tipText);
      g.append(svgEl("rect", { x: cx - band / 2, y: top, width: band, height: plotH, fill: "transparent" }));
      if (b.value > 0) g.append(svgEl("rect", { x: cx - barW / 2, y: y(b.value), width: barW, height: Math.max(1, y(0) - y(b.value)), rx: 2, style: `fill:${hot ? colors.top : colors.bar}` }));
      if (buckets.length <= 16 && b.value > 0) g.append(svgEl("text", { x: cx, y: y(b.value) - 5, "text-anchor": "middle", "font-size": 12, "font-weight": 700, style: `fill:${colors.text}` }, format(b.value)));
      svg.append(g);
      if (i % Math.ceil(buckets.length / 10) === 0) svg.append(svgEl("text", { x: cx, y: top + plotH + 18, "text-anchor": "middle", "font-size": 12, style: `fill:${colors.text}` }, nameOf(b)));
    });
    // The period before: one dashed line through its buckets, broken where a bucket has nothing to compare.
    if (previous.some(Boolean)) {
      let d = "";
      previous.forEach((b, i) => {
        if (!b) return;
        d += `${i && previous[i - 1] ? "L" : "M"}${(left + band * (i + 0.5)).toFixed(1)},${y(b.value).toFixed(1)}`;
      });
      svg.append(svgEl("path", { d, class: "tr-before", fill: "none", style: `stroke:${colors.muted}`, "stroke-width": 2, "stroke-dasharray": "3 3", "stroke-linecap": "round", "pointer-events": "none" }));
      previous.forEach((b, i) => { if (b) svg.append(svgEl("circle", { cx: left + band * (i + 0.5), cy: y(b.value), r: 2.5, style: `fill:${colors.muted}`, "pointer-events": "none" })); });
    }
    // Events on the timeline: a dashed line on the day, inside its week or month, with a small flag at the top.
    const first = buckets[0]?.key;
    const last = buckets.at(-1)?.to;
    (labels.events || []).filter((event) => first && event.date >= first && event.date <= last).forEach((event) => {
      const i = buckets.findIndex((b) => event.date >= b.key && event.date <= b.to);
      const b = buckets[i];
      const x = left + band * (i + (daysBetween(b.key, event.date) + 0.5) / (daysBetween(b.key, b.to) + 1));
      const tip = `${dayName(new Date(`${event.date}T00:00:00Z`))}: ${event.text}`;
      const g = svgEl("g", { class: "tr-event", "data-tip": tip });
      g.append(svgEl("title", {}, tip));
      g.append(svgEl("rect", { x: x - 7, y: top - 8, width: 14, height: plotH + 8, fill: "transparent" }));
      g.append(svgEl("line", { x1: x, x2: x, y1: top - 2, y2: top + plotH, style: `stroke:${colors.text}`, "stroke-width": 1.25, "stroke-dasharray": "4 3" }));
      g.append(svgEl("path", { d: `M${x.toFixed(1)},${top - 8}h9l-3,4l3,4h-9z`, style: `fill:${colors.text}` }));
      svg.append(g);
    });
    const average = shares
      ? buckets.reduce((sum, b) => sum + b.count, 0) / (buckets.reduce((sum, b) => sum + b.total, 0) || 1)
      : buckets.reduce((sum, b) => sum + b.value, 0) / buckets.length;
    svg.append(svgEl("line", { x1: left, x2: W - right, y1: y(average), y2: y(average), style: `stroke:${colors.line}`, "stroke-width": 1.5, "stroke-dasharray": "6 4", "pointer-events": "none" }));
    const averageText = `${labels.average} ${shares ? format(average) : num(average, 1)}`;
    svg.append(svgEl("text", { x: W - right, y: 16, "text-anchor": "end", "font-size": 12, "font-weight": 700, style: `fill:${colors.text}` }, averageText));
    if (target) {
      svg.append(svgEl("line", { x1: left, x2: W - right, y1: y(target), y2: y(target), style: `stroke:${colors.target}`, "stroke-width": 2, "pointer-events": "none" }));
      svg.append(svgEl("text", { x: W - right - averageText.length * 7 - 18, y: 16, "text-anchor": "end", "font-size": 12, "font-weight": 700, style: `fill:${colors.target}` }, `${labels.targetLabel} ${format(target)}`));
    }
    svg.append(svgEl("text", { x: left, y: 16, "font-size": 12, style: `fill:${colors.muted}` }, labels.unit));
    return svg;
  };
  const exportTrendSvg = (trend, labels) => {
    const svg = trendChart(trend, TREND_EXPORT, labels);
    svg.setAttribute("xmlns", SVG_NS);
    const [, , w, h] = svg.getAttribute("viewBox").split(" ").map(Number);
    svg.setAttribute("width", w);
    svg.setAttribute("height", h);
    svg.insertBefore(svgEl("rect", { x: 0, y: 0, width: w, height: h, fill: "#ffffff" }), svg.firstChild.nextSibling);
    return new XMLSerializer().serializeToString(svg).replace(/ data-tip="[^"]*"/g, "");
  };
  const saveBlob = (name, blob) => {
    const link = el("a");
    link.href = URL.createObjectURL(blob);
    link.download = name;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  };
  // One tooltip per chart: a pointer (or a tap) on a column with data-tip shows its text next to the pointer, the
  // same text the column carries as its <title>. Used by the trend charts here and by js/chart-kit.js.
  const chartTooltip = (wrap, svg) => {
    const tooltip = el("div", "ck-tooltip");
    tooltip.hidden = true;
    tooltip.setAttribute("role", "status");
    wrap.append(tooltip);
    const show = (event) => {
      const target = event.target.closest?.("[data-tip]");
      if (!target) { tooltip.hidden = true; return; }
      const lines = target.getAttribute("data-tip").split("\n");
      tooltip.replaceChildren(...lines.map((text, i) => el(i ? "span" : "strong", null, text)));
      tooltip.hidden = false;
      const box = wrap.getBoundingClientRect();
      const left = event.clientX - box.left, top = event.clientY - box.top;
      const flip = left > box.width * 0.6;
      tooltip.style.left = `${flip ? left - tooltip.offsetWidth - 12 : left + 12}px`;
      tooltip.style.top = `${Math.max(0, top - tooltip.offsetHeight - 10)}px`;
    };
    svg.addEventListener("pointermove", show);
    svg.addEventListener("pointerdown", show);
    svg.addEventListener("pointerleave", () => { tooltip.hidden = true; });
    return tooltip;
  };
  // A figure with the chart and its "Chart as SVG / PNG" buttons.
  const trendFigure = (trend, labels, fileName) => {
    const figure = el("figure", "tr-figure");
    const scroller = el("div", "tr-scroll");
    const chart = trendChart(trend, TREND_COLORS, labels);
    scroller.append(chart);
    chartTooltip(scroller, chart);
    const actions = el("div", "tool-actions");
    const svgButton = el("button", "button-secondary", tx("Chart as SVG"));
    svgButton.type = "button";
    svgButton.addEventListener("click", () => saveBlob(`${fileName}-${today()}.svg`, new Blob([exportTrendSvg(trend, labels)], { type: "image/svg+xml" })));
    const pngButton = el("button", "button-secondary", tx("Chart as PNG"));
    pngButton.type = "button";
    pngButton.addEventListener("click", () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width * 2;
        canvas.height = img.height * 2;
        const ctx = canvas.getContext("2d");
        ctx.scale(2, 2);
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => blob && saveBlob(`${fileName}-${today()}.png`, blob));
      };
      img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(exportTrendSvg(trend, labels))}`;
    });
    actions.append(svgButton, pngButton);
    figure.append(scroller, actions);
    return figure;
  };

  // The chip that says a log is filtered, and clears the filter: "Filtered: Loading ×".
  const filterChip = (value, onClear) => {
    const chip = el("button", "ci-chip");
    chip.type = "button";
    chip.dataset.focusKey = "filter-chip";
    chip.setAttribute("aria-label", tx("Clear the filter: {value}", { value }));
    const x = el("span", "ci-chip-x", "×");
    x.setAttribute("aria-hidden", "true");
    chip.append(el("span", null, tx("Filtered: {value}", { value })), x);
    chip.addEventListener("click", onClear);
    return chip;
  };
  // A result rebuilt under a control that was just used: the control with the same data-focus-key gets the focus
  // back, or the one named by fallback when it is gone (the chip, after the filter is cleared).
  const keepFocus = (render, fallback = "") => {
    const active = document.activeElement;
    const key = active?.closest?.("[data-focus-key]")?.dataset.focusKey || "";
    render();
    if (!key) return;
    const find = (name) => [...document.querySelectorAll("[data-focus-key]")].find((node) => node.dataset.focusKey === name && !node.closest("[hidden]"));
    (find(key) || (fallback && find(fallback)))?.focus({ preventScroll: true });
  };
  // Above a trend: Day / Week / Month (automatic until one is chosen) and the comparison with the period before.
  // unit is the unit the chart uses now, grain the one chosen ("" for automatic).
  const trendControls = ({ unit, grain, compare, onGrain, onCompare }) => {
    const box = el("div", "ci-controls");
    const group = el("div", "ci-grain");
    group.setAttribute("role", "group");
    group.setAttribute("aria-label", tx("Show the trend by"));
    [["day", "Day"], ["week", "Week"], ["month", "Month"]].forEach(([value, label]) => {
      const button = el("button", null, tx(label));
      button.type = "button";
      button.dataset.focusKey = `grain:${value}`;
      button.setAttribute("aria-pressed", String(value === unit));
      button.addEventListener("click", () => onGrain(value));
      group.append(button);
    });
    if (!grain) group.append(el("span", "ci-auto", tx("automatic")));
    const label = el("label", "ci-compare");
    const box2 = el("input");
    box2.type = "checkbox";
    box2.checked = Boolean(compare);
    box2.dataset.focusKey = "compare";
    box2.addEventListener("change", () => onCompare(box2.checked));
    label.append(box2, " ", tx("Compare with the period before"));
    box.append(group, label);
    return box;
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
  // chart, when given, is a day-by-day series ({ source, metric, unit, rows: [{ date, n, d }], skipped }) that
  // the Sigma & Control Chart opens as a p-chart: d defects out of n handled on each date.
  // An action for the Action Tracker (js/actions-store.js reads these parameters on its page, adds the action once and
  // cleans the address). The tracker is a sibling of every tool, so the link keeps the page's language. The source is the
  // tool's own address, so the tracker can say where the action came from.
  const trackerUrl = (action = {}) => {
    const url = new URL("../action-tracker/", window.location.href);
    const source = window.location.pathname.split("/").filter(Boolean).pop() || "";
    const title = str(action.title).trim().slice(0, 300);
    if (title) {
      url.searchParams.set("action", title);
      url.searchParams.set("source", str(action.source) || source);
      ["detail", "owner", "due", "check", "area", "priority"].forEach((name) => { if (str(action[name]).trim()) url.searchParams.set(name, str(action[name]).trim()); });
    }
    return url.href;
  };
  const trackerLink = (label, action, className = "button-secondary") => {
    const link = el("a", className, label);
    link.href = trackerUrl(typeof action === "function" ? {} : action);
    // An action that changes while the page is open is read when the link is followed.
    if (typeof action === "function") link.addEventListener("click", () => { link.href = trackerUrl(action() || {}); });
    return link;
  };
  const resultActions = (summary, problem, pareto, chart = null) => {
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
    // Pages that keep their own list of actions (they load js/actions-store.js) offer their own hand-off; the others send
    // the problem to the Action Tracker as the action to take.
    if (!window.ActionsStore && problem) actions.append(trackerLink(tx("Add to actions"), { title: tx("Countermeasure for: {problem}", { problem }), priority: "High" }));
    if (pareto) {
      const link = el("a", "button-secondary", tx("Open in Pareto 80/20"));
      link.href = new URL("../pareto/", window.location.href).href;
      link.addEventListener("click", () => {
        try { sessionStorage.setItem("sc-pareto-handoff", JSON.stringify(pareto())); } catch { /* the page opens empty */ }
      });
      actions.append(link);
    }
    if (chart) {
      const link = el("a", "button-secondary", tx("Open as control chart"));
      link.href = new URL("../sigma-control-chart/", window.location.href).href;
      link.addEventListener("click", () => {
        try { sessionStorage.setItem("sc-sigma-handoff", JSON.stringify(chart)); } catch { /* the chart opens as it was */ }
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

  // Results in the order a phone needs them: the answer first (headline, key numbers, where to
  // start, the actions), then the evidence behind it, which starts closed on a narrow screen.
  // A reader who opens or closes the evidence keeps that choice while the results update.
  let detailsOpen = null;
  const resultLayout = (results, { head, stats, notes = [], focus, actions, panels = [] }) => {
    results.append(...[head, stats, ...notes, focus, actions].filter(Boolean));
    if (!panels.length) return;
    if (detailsOpen === null) {
      detailsOpen = window.matchMedia ? window.matchMedia("(min-width: 761px)").matches : true;
      // Printed results show the evidence too.
      window.addEventListener("beforeprint", () => document.querySelectorAll(".dl-details").forEach((details) => { details.open = true; }));
    }
    const details = el("details", "dl-details");
    details.open = detailsOpen;
    details.addEventListener("toggle", () => { detailsOpen = details.open; });
    const titles = panels.map((box) => box.querySelector(".result-label")?.textContent).filter(Boolean);
    const summary = el("summary", "dl-details-summary");
    summary.append(el("strong", null, tx("All details")), el("span", null, titles.join(" · ")));
    const grid = el("div", "dl-result-grid");
    grid.append(...panels);
    details.append(summary, grid);
    results.append(details);
  };
  // The log behind Damage Control, Incomplete Control and Delay Analyzer: its settings and period,
  // the table of the newest rows, removing a row (with undo), pasting from Excel, the example week,
  // clearing and the CSV. The tool gives its columns, its texts and its results.
  // Each language keeps its own log (the names in it are that language's words). When this
  // language's log is empty, the logs of the other languages are pointed to instead of looking lost.
  const LANG_NAMES = { en: "English", de: "Deutsch", sq: "Shqip" };
  const otherLogs = (key) => {
    const base = key.replace(/-(de|sq)$/, "");
    const path = window.location.pathname.replace(/^\/(de|sq)(?=\/)/, "");
    return Object.keys(LANG_NAMES).filter((code) => code !== LANG).map((code) => {
      const saved = read(code === "en" ? base : `${base}-${code}`, null);
      const count = isObject(saved) && Array.isArray(saved.rows) ? saved.rows.length : 0;
      return { code, count, name: LANG_NAMES[code], url: code === "en" ? path : `/${code}${path}` };
    }).filter((item) => item.count > 0);
  };

  // An example is marked, not guessed. Loaded, it is stamped { on: true, n, first, last } and each of its rows carries
  // example: true, so removing one of its rows or pressing a period button never turns the rest into the visitor's
  // data (audit of 27 October 2026, T-01 and T-02). The example stays whole until the visitor's own work replaces it:
  // an own entry, an import or "Clear the example" removes all of it, rows and settings together.
  // A log saved before then has only the shape ({ n, first, last }); while it still has that shape it is read as an
  // example and marked. A log whose shape changed under the old rule cannot be told apart any more and stays as it is.
  // A tool opens on its example only when nothing is stored yet and no coaching project sent the visitor here:
  // someone arriving with ?coaching= works on their own case, and the example must not become its evidence.
  // Anything stored counts, even text that cannot be read any more (it is kept aside, see keepDamaged).
  const stored = (key) => { try { return localStorage.getItem(key) !== null; } catch { return false; } };
  const firstVisit = (key) => !stored(key) && !new URLSearchParams(location.search).has("coaching");
  const isExampleRow = (row) => isObject(row) && row.example === true;
  const markExample = (rows) => {
    if (Array.isArray(rows)) rows.forEach((row) => { if (isObject(row)) row.example = true; });
    return rows;
  };
  const ownRows = (rows) => (Array.isArray(rows) ? rows.filter((row) => !isExampleRow(row)) : []);
  const exampleStamp = (rows) => ({ on: true, n: markExample(rows).length, first: rows[0]?.date ?? "", last: rows.at(-1)?.date ?? "" });
  const oldShape = (state) => isObject(state.example) && state.example.on === undefined && Number.isInteger(state.example.n) && Array.isArray(state.rows)
    && state.rows.length === state.example.n && (state.rows[0]?.date ?? "") === state.example.first && (state.rows.at(-1)?.date ?? "") === state.example.last;
  // Whether a saved state is an example, in any of the ways the tools mark one: { on: true } (with or without the
  // shape), the old shape, or example: true (the tools that hold a single study or matrix).
  const isExampleState = (state) => isObject(state) && (state.example === true || (isObject(state.example) && (state.example.on === true || oldShape(state))));
  const exampleMatches = (state) => {
    if (!isObject(state) || !isObject(state.example)) return false;
    if (state.example.on === true) return true;
    if (!oldShape(state)) return false;
    state.example = { ...state.example, on: true };
    markExample(state.rows);
    return true;
  };
  // Another tool's saved state as data: null (the fallback) when it is an example, and without any example rows a
  // team sync or an old version may have mixed in. The tools that gather other tools' logs read through this.
  const readOwn = (key, fallback = null) => {
    const saved = read(key, null);
    if (saved === null || isExampleState(saved)) return fallback;
    if (!isObject(saved)) return saved;
    const own = { ...saved };
    Object.keys(own).forEach((name) => { if (Array.isArray(own[name]) && own[name].some(isExampleRow)) own[name] = ownRows(own[name]); });
    return own;
  };
  // The note above the result while an example is loaded: what it is, and one tap to clear it.
  const exampleNote = (anchor, onClear) => {
    const note = el("div", "dl-example-note");
    note.setAttribute("role", "status");
    const button = el("button", "button-ghost", tx("Clear the example"));
    button.type = "button";
    button.addEventListener("click", onClear);
    note.append(el("strong", null, tx("Example")), " ", el("span", null, tx("This is an example, so you can see what the tool shows. Add your own entries and it disappears, or clear it now.")), " ", button);
    note.hidden = true;
    anchor.before(note);
    return { sync: (state) => { note.hidden = !exampleMatches(state); } };
  };

  // The rows of a paste that are not in the log yet: a row equal to one already there, field for field (its example
  // mark aside), is left out once for each such row, so a paste of two identical events adds two.
  const rowKey = (row) => JSON.stringify(Object.keys(row).filter((name) => name !== "example").sort().map((name) => [name, row[name] ?? ""]));
  const newRows = (rows, added) => {
    const left = new Map();
    ownRows(rows).forEach((row) => { const k = rowKey(row); left.set(k, (left.get(k) || 0) + 1); });
    const fresh = [];
    let already = 0;
    added.forEach((row) => {
      const k = rowKey(row);
      if (left.get(k) > 0) { left.set(k, left.get(k) - 1); already += 1; } else fresh.push(row);
    });
    return { fresh, already };
  };
  // filter, when given, returns null or { label, test(row), clear() }: the table then shows only the rows that pass,
  // under a chip that clears it (the result is not filtered here: the tool decides what it filters).
  // firstExample: false when the page should not open on its example even on a first visit (the Daily Board, when other
  // tools already hold the visitor's data).
  const logBook = ({ root, key, state, save, paste, cells, removeLabel, removedText, countText, importRows, importText, loadExample, clearExample, clearText, csv, renderResults, results, filter = null, firstExample = true }) => {
    const logBody = root.querySelector("[data-log]");
    const logWrap = root.querySelector("[data-log-wrap]");
    const logEmpty = root.querySelector("[data-log-empty]");
    const logCount = root.querySelector("[data-log-count]");
    const logStatus = root.querySelector("[data-log-status]");
    const importStatus = root.querySelector("[data-import-status]");
    const settings = [...root.querySelectorAll("[data-setting]")];
    const elsewhere = el("p", "form-note dl-elsewhere");
    elsewhere.hidden = true;
    logEmpty.after(elsewhere);
    // The table shows the newest rows; more on request. Fewer rows keep every entry quick on a
    // phone with a long log, and the CSV always has all of them.
    const FIRST_ROWS = 25;
    let shown = FIRST_ROWS;
    const more = el("button", "button-ghost dl-more");
    more.type = "button";
    more.hidden = true;
    logWrap.after(more);
    const filterNote = el("div", "ci-log-filter");
    filterNote.hidden = true;
    logWrap.before(filterNote);
    more.addEventListener("click", () => {
      shown = Math.min(shown + LOG_LIMIT, state.rows.length);
      renderLog();
    });
    let syncRange = () => {};

    const renderLog = () => {
      const rows = state.rows;
      const only = typeof filter === "function" && rows.length ? filter() : null;
      const passing = only ? rows.filter(only.test) : rows;
      filterNote.hidden = !only;
      filterNote.replaceChildren(...(only ? [filterChip(only.label, only.clear), el("span", "form-note", tx("{a} of {b}", { a: int.format(passing.length), b: int.format(rows.length) }))] : []));
      logBody.replaceChildren();
      const newest = [];
      for (let index = rows.length - 1; index >= 0 && newest.length < shown; index--) if (!only || only.test(rows[index])) newest.push([rows[index], index]);
      newest.forEach(([row, index]) => {
        const tr = el("tr");
        tr.append(...cells(row));
        const cell = el("td");
        const remove = el("button", "dl-remove", "×");
        remove.type = "button";
        remove.dataset.remove = index;
        remove.setAttribute("aria-label", removeLabel(row));
        cell.append(remove);
        tr.append(cell);
        logBody.append(tr);
      });
      logWrap.hidden = !rows.length;
      logEmpty.hidden = rows.length > 0;
      const hiddenRows = passing.length - newest.length;
      logCount.textContent = rows.length ? `${countText(passing)}${hiddenRows ? tx(" · newest {n} shown, CSV has all", { n: int.format(newest.length) }) : ""}` : "";
      more.hidden = !hiddenRows;
      more.textContent = tx("Show {n} more", { n: int.format(Math.min(LOG_LIMIT, hiddenRows)) });
      const others = rows.length || !key ? [] : otherLogs(key);
      elsewhere.hidden = !others.length;
      elsewhere.replaceChildren();
      others.forEach((item, index) => {
        const link = el("a", "inline-link", tx("Open it"));
        link.href = item.url;
        link.hreflang = item.code;
        elsewhere.append(`${index ? " " : ""}${tx("Your log in {language} has {n} entries.", { language: item.name, n: int.format(item.count) })} `, link);
      });
    };
    // The example leaves as a whole: its rows and its settings (period, volume, target), so the
    // visitor's own entries are never mixed into it or scored against its volume.
    const dropExample = () => {
      state.rows = ownRows(state.rows);
      state.example = {};
      state.totalsFor = {};
      clearExample?.();
      showSettings();
    };
    const note = exampleNote(results, () => {
      dropExample();
      changed();
    });
    const render = () => {
      note.sync(state);
      renderLog();
      syncRange();
      renderResults();
    };
    // The screen updates first; the log is written right after it is drawn (with a long log the
    // write takes a moment), and at once if the page is hidden or closed before that.
    let saving = null;
    const saveSoon = () => {
      if (saving) return;
      saving = () => {
        pending.delete(saving);
        saving = null;
        save();
      };
      const run = saving;
      listen();
      pending.add(run);
      requestAnimationFrame(() => setTimeout(() => { if (saving === run) run(); }, 0));
    };
    const changed = () => {
      saveSoon();
      render();
    };

    // Period settings; typing waits for a pause when the log is long.
    const renderSetting = renderOnPause(changed, () => state.rows.length);
    // A total for the period (data-period-total) remembers the days it was typed for; with other days chosen its box is
    // empty, and the result says for which days it was typed.
    const isTotal = (input) => input.hasAttribute("data-period-total");
    const stampTotals = () => {
      const stamps = isObject(state.totalsFor) ? { ...state.totalsFor } : {};
      settings.filter(isTotal).forEach((input) => { if (str(state[input.name]).trim() && typeof stamps[input.name] !== "string") stamps[input.name] = `${str(state.from)}|${str(state.to)}`; });
      state.totalsFor = stamps;
    };
    const showSettings = () => settings.forEach((input) => { input.value = isTotal(input) ? periodTotal(state, input.name).value : state[input.name] ?? ""; });
    settings.forEach((input) => input.addEventListener("input", () => {
      state[input.name] = input.value;
      if (isTotal(input)) state.totalsFor = { ...(isObject(state.totalsFor) ? state.totalsFor : {}), [input.name]: `${str(state.from)}|${str(state.to)}` };
      renderSetting();
    }));

    root.querySelector("[data-import]").addEventListener("click", () => {
      const { added, skipped } = importRows(paste.value);
      if (!added.length) {
        flash(importStatus, importText.none);
        return;
      }
      if (exampleMatches(state)) dropExample();
      // The same rows pasted again (the same export twice, or after a reload) are not counted twice: a pasted row that
      // matches a row already in the log, field for field, is left out, once per matching row (audit T-17).
      const { fresh, already } = newRows(state.rows, added);
      if (!fresh.length) {
        flash(importStatus, tx("All {n} rows are already in the log: nothing was added.", { n: int.format(already) }));
        return;
      }
      state.rows.push(...fresh);
      changed();
      paste.value = "";
      flash(importStatus, `${importText.done(fresh.length, skipped)}${already ? ` ${tx("{n} rows were already in the log and were not added again.", { n: int.format(already) })}` : ""}`);
    });

    logBody.addEventListener("click", (event) => {
      const button = event.target.closest("[data-remove]");
      if (!button) return;
      const index = Number(button.dataset.remove);
      const [removed] = state.rows.splice(index, 1);
      changed();
      (logBody.querySelector("[data-remove]") || root.querySelector("[data-entry] input, [data-entry] select")).focus();
      undoNote(logStatus, removedText(removed), () => {
        state.rows.splice(Math.min(index, state.rows.length), 0, removed);
        changed();
      });
    });

    // A pending undo belongs to the log that was there; the example or an empty log must not get its row back.
    const dropUndo = () => { clearTimeout(logStatus.timer); logStatus.textContent = ""; };
    root.querySelector("[data-example]").addEventListener("click", () => {
      dropUndo();
      loadExample();
      state.example = exampleStamp(state.rows);
      state.from = "";
      state.to = "";
      state.totalsFor = {};
      stampTotals();
      showSettings();
      changed();
      results.scrollIntoView({ behavior: "smooth", block: "start" });
      results.focus({ preventScroll: true });
    });

    root.querySelector("[data-clear]").addEventListener("click", () => {
      if (!state.rows.length || !window.confirm(clearText)) return;
      dropUndo();
      if (exampleMatches(state)) dropExample();
      state.rows = [];
      changed();
    });

    root.querySelector("[data-csv]").addEventListener("click", () => {
      if (!state.rows.length) return;
      const { name, rows } = csv();
      downloadCsv(name, rows);
    });
    // The same log as an Excel workbook, where the page offers it.
    root.querySelector("[data-xlsx]")?.addEventListener("click", () => {
      if (!state.rows.length) return;
      const { name, rows } = csv();
      downloadXlsx(name, rows);
    });

    // A first visit opens on the example, so the result is visible at once; the note says so.
    if (key && firstExample && !state.rows.length && firstVisit(key)) {
      loadExample();
      state.example = exampleStamp(state.rows);
      state.from = "";
      state.to = "";
      state.totalsFor = {};
    }
    // A total saved before totalsFor existed belongs to the days chosen now.
    stampTotals();
    showSettings();
    syncRange = rangeControl(root.querySelector("[data-range]"), state, () => state.rows, () => {
      showSettings();
      changed();
    });
    return {
      render,
      // A new row from the entry form.
      add: (row) => {
        if (exampleMatches(state)) { dropUndo(); dropExample(); }
        state.rows.push(row);
        changed();
      },
      // Own work that is not a row (a day's volume, a meter, a setting box that belongs to the visitor): the example
      // leaves first, whole, so the work is neither mixed into it nor cleared with it later.
      ownWork: () => {
        if (!exampleMatches(state)) return false;
        dropUndo();
        dropExample();
        changed();
        return true;
      },
    };
  };

  // What a hand-off to the Action Tracker did (ActionsStore.addAll), said plainly: added, already open, not saved.
  const actionsNote = ({ added = [], duplicate = 0, unsaved = 0, example = 0 } = {}) => [
    (Array.isArray(added) ? added.length : added) ? tx("Added {n} actions.", { n: int.format(Array.isArray(added) ? added.length : added) }) : "",
    duplicate ? tx("{n} were already open.", { n: int.format(duplicate) }) : "",
    unsaved ? tx("{n} could not be saved: this browser's storage is full, blocked or locked.", { n: int.format(unsaved) }) : "",
    example ? tx("The example's actions stay out of your own list.") : "",
  ].filter(Boolean).join(" ") || tx("Nothing new to add.");
  // One action (ActionsStore.add) that gave null: why, from ActionsStore.lastAdd.
  const actionRefused = (reason) => tx(reason === "duplicate" ? "Already on the list."
    : reason === "unsaved" ? "The action could not be saved: this browser's storage is full, blocked or locked."
    : reason === "example" ? "The example's actions stay out of your own list." : "Could not add the action.");

  // Printing a form: a one-line box prints only what fits in it, and an empty box prints its grey example. Inside a
  // [data-print-fields] container each box gets its whole text as plain text for print (.print-text), and the box
  // itself is left off the paper (.has-print-text in styles.css).
  window.addEventListener?.("beforeprint", () => {
    document.querySelectorAll("[data-print-fields]").forEach((box) => {
      box.querySelectorAll("input:not([type]), input[type=text], input[type=date], input[type=number], textarea").forEach((field) => {
        const next = field.nextElementSibling;
        const text = next?.classList.contains("print-text") ? next : el("span", "print-text");
        if (text !== next) field.after(text);
        text.textContent = field.value;
        field.classList.add("has-print-text");
      });
    });
  });

  // A typed text that a spreadsheet would run as a formula (=HYPERLINK(...), +cmd, @A1,
  // or a leading tab) is kept as text with a leading apostrophe; a plain number stays a number.
  const csvSafe = (text) => (/^[=+\-@\t\r]/.test(text) && !/^[+-]?\d+(?:[.,]\d+)?%?$/.test(text) ? `'${text}` : text);
  // German and Albanian Excel expect semicolons and a decimal comma.
  const downloadCsv = (name, rows) => {
    const separator = DECIMAL_COMMA ? ";" : ",";
    const quote = (value) => {
      const text = csvSafe(typeof value === "number" && DECIMAL_COMMA ? String(value).replace(".", ",") : String(value ?? ""));
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

  // A zip of text files, stored without compression (the same shape as the Word writer in docx-kit.js): an Excel
  // workbook is such a zip of XML parts, so no library is needed.
  const CRC_TABLE = (() => {
    const table = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      table[n] = c >>> 0;
    }
    return table;
  })();
  const crc32 = (bytes) => {
    let crc = 0xffffffff;
    for (let i = 0; i < bytes.length; i++) crc = CRC_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
    return (crc ^ 0xffffffff) >>> 0;
  };
  const zipStore = (files) => {
    const encoder = new TextEncoder();
    const parts = [];
    const central = [];
    let offset = 0;
    files.forEach(({ name, text }) => {
      const nameBytes = encoder.encode(name);
      const data = encoder.encode(text);
      const crc = crc32(data);
      const local = new DataView(new ArrayBuffer(30));
      local.setUint32(0, 0x04034b50, true);
      local.setUint16(4, 20, true);
      local.setUint16(6, 0x0800, true);
      local.setUint16(12, 0x21, true);
      local.setUint32(14, crc, true);
      local.setUint32(18, data.length, true);
      local.setUint32(22, data.length, true);
      local.setUint16(26, nameBytes.length, true);
      parts.push(new Uint8Array(local.buffer), nameBytes, data);
      const entry = new DataView(new ArrayBuffer(46));
      entry.setUint32(0, 0x02014b50, true);
      entry.setUint16(4, 20, true);
      entry.setUint16(6, 20, true);
      entry.setUint16(8, 0x0800, true);
      entry.setUint16(14, 0x21, true);
      entry.setUint32(16, crc, true);
      entry.setUint32(20, data.length, true);
      entry.setUint32(24, data.length, true);
      entry.setUint16(28, nameBytes.length, true);
      entry.setUint32(42, offset, true);
      central.push(new Uint8Array(entry.buffer), nameBytes);
      offset += 30 + nameBytes.length + data.length;
    });
    const size = central.reduce((sum, part) => sum + part.length, 0);
    const end = new DataView(new ArrayBuffer(22));
    end.setUint32(0, 0x06054b50, true);
    end.setUint16(8, files.length, true);
    end.setUint16(10, files.length, true);
    end.setUint32(12, size, true);
    end.setUint32(16, offset, true);
    const all = [...parts, ...central, new Uint8Array(end.buffer)];
    const out = new Uint8Array(all.reduce((sum, part) => sum + part.length, 0));
    let at = 0;
    all.forEach((part) => { out.set(part, at); at += part.length; });
    return out;
  };

  // An Excel workbook (.xlsx) with one sheet from the same rows as the CSV: the first row is the header (bold, with
  // a filter, kept in view when the sheet scrolls), a number stays a number, a date (YYYY-MM-DD) becomes a real date
  // in the sheet's own format, and everything else is text; a text that Excel would run as a formula stays text.
  const xmlText = (text) => String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "");
  const excelDate = (iso) => {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
    if (!match) return null;
    const days = Math.round((Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])) - Date.UTC(1899, 11, 30)) / 86400000);
    return days > 0 ? days : null;
  };
  const columnName = (index) => {
    let name = "";
    for (let n = index + 1; n > 0; n = Math.floor((n - 1) / 26)) name = String.fromCharCode(64 + ((n - 1) % 26) + 1) + name;
    return name;
  };
  const xlsxCell = (value, ref, header) => {
    if (header) return `<c r="${ref}" t="inlineStr" s="1"><is><t xml:space="preserve">${xmlText(value ?? "")}</t></is></c>`;
    if (typeof value === "number" && Number.isFinite(value)) return `<c r="${ref}"><v>${value}</v></c>`;
    const text = String(value ?? "");
    if (text === "") return "";
    const serial = excelDate(text);
    if (serial) return `<c r="${ref}" s="2"><v>${serial}</v></c>`;
    // A number only when it reads back the same: "00123" (a code, an article number) stays text (audit T-22).
    if (/^-?(?:0|[1-9]\d*)(?:\.\d+)?$/.test(text) && text.length < 16) return `<c r="${ref}"><v>${Number(text)}</v></c>`;
    return `<c r="${ref}" t="inlineStr"><is><t xml:space="preserve">${xmlText(text)}</t></is></c>`;
  };
  const xlsxFile = (rows, { sheet = "Sheet1", title = "" } = {}) => {
    const head = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';
    const ns = "http://schemas.openxmlformats.org";
    const width = Math.max(1, ...rows.map((cells) => cells.length));
    const widths = Array.from({ length: width }, (_, column) => Math.min(60, Math.max(8, ...rows.map((cells) => String(cells[column] ?? "").length + 2))));
    const body = rows.map((cells, r) => `<row r="${r + 1}">${cells.map((value, c) => xlsxCell(value, `${columnName(c)}${r + 1}`, r === 0)).join("")}</row>`).join("");
    const last = `${columnName(width - 1)}${rows.length}`;
    const dateFormat = DECIMAL_COMMA ? "dd.mm.yyyy" : "yyyy-mm-dd";
    const worksheet = `${head}<worksheet xmlns="${ns}/spreadsheetml/2006/main"><sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>`
      + `<cols>${widths.map((w, c) => `<col min="${c + 1}" max="${c + 1}" width="${w}" customWidth="1"/>`).join("")}</cols>`
      + `<sheetData>${body}</sheetData><autoFilter ref="A1:${last}"/></worksheet>`;
    const styles = `${head}<styleSheet xmlns="${ns}/spreadsheetml/2006/main"><numFmts count="1"><numFmt numFmtId="164" formatCode="${dateFormat}"/></numFmts>`
      + '<fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts>'
      + '<fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills>'
      + '<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>'
      + '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>'
      + '<cellXfs count="3"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/><xf numFmtId="164" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/></cellXfs>'
      + '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>';
    const workbook = `${head}<workbook xmlns="${ns}/spreadsheetml/2006/main" xmlns:r="${ns}/officeDocument/2006/relationships"><sheets><sheet name="${xmlText(sheet.slice(0, 31))}" sheetId="1" r:id="rId1"/></sheets></workbook>`;
    const core = `${head}<cp:coreProperties xmlns:cp="${ns}/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:title>${xmlText(title)}</dc:title><dc:creator>Stiven Catalyst</dc:creator></cp:coreProperties>`;
    return zipStore([
      { name: "[Content_Types].xml", text: `${head}<Types xmlns="${ns}/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/></Types>` },
      { name: "_rels/.rels", text: `${head}<Relationships xmlns="${ns}/package/2006/relationships"><Relationship Id="rId1" Type="${ns}/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/><Relationship Id="rId2" Type="${ns}/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/></Relationships>` },
      { name: "xl/workbook.xml", text: workbook },
      { name: "xl/_rels/workbook.xml.rels", text: `${head}<Relationships xmlns="${ns}/package/2006/relationships"><Relationship Id="rId1" Type="${ns}/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="${ns}/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>` },
      { name: "xl/worksheets/sheet1.xml", text: worksheet },
      { name: "xl/styles.xml", text: styles },
      { name: "docProps/core.xml", text: core },
    ]);
  };
  // The same rows as the CSV, as an Excel workbook: a text that Excel would run as a formula stays text.
  const downloadXlsx = (name, rows, options = {}) => {
    const safe = rows.map((cells) => cells.map((value) => (typeof value === "string" ? csvSafe(value) : value)));
    const bytes = xlsxFile(safe, { sheet: options.sheet || name.slice(0, 31), title: options.title || name });
    saveBlob(`${name}-${today()}.xlsx`, new Blob([bytes], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
  };

  // The floor check under each tool: ticks are kept per tool.
  const floorCheck = (section, key) => {
    const boxes = [...section.querySelectorAll("input[type=checkbox]")];
    const score = section.querySelector("[data-check-score]");
    const render = () => {
      const ticked = boxes.filter((box) => box.checked).length;
      const total = boxes.length;
      const verdict = ticked === total ? tx("The standard holds today.")
        : ticked >= total - 2 ? tx("Almost. Fix the open lines this shift.")
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
    read, write, warnNotSaved, actionsNote, actionRefused, newRows, keepDamaged, isObject, str, loadState, el, int, euro, pct, plural, capital, today, addDays, recentExample,
    parseNumber, parseDate, parseDateTime, parseRows, canon, sigma, sigmaText,
    inRange, partialRouteLog, periodTotal, rangeText, dateSpan, rangePreset, spanText, rangeControl, logBook, firstVisit, exampleStamp, exampleMatches, exampleNote, isExampleRow, isExampleState, markExample, ownRows, readOwn, resultLayout, otherLogs, cleanVolumes, importVolumes, dayVolumes, mondayOf, shareText,
    panel, stat, barList, trendBuckets, trendShares, trendFigure, chartTooltip, monthYear, monthStart, previousRange, trendTotal, periodChange, changeText, compareText, filterChip, keepFocus, trendControls, trackerUrl, trackerLink, focusCard, resultActions, copy, flash, undoNote, csvSafe, downloadCsv, downloadXlsx, xlsxFile, zipStore, excelDate, columnName, floorCheck, LOG_LIMIT, shownNote, renderOnPause,
  };
})();
