// Pareto 80/20: which few causes make most of the problem. Data comes from a
// CSV, an Excel file, pasted cells, a ready-made example or another tool on
// this site. Nothing is dropped silently: every row is either counted or listed
// with the reason it was left out, and the totals are shown next to the chart.
(() => {
  // ---------- Reading tables ----------
  const fold = (text) => String(text ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
    .replace(/ß/g, "ss").replace(/[^a-z0-9%€]+/g, " ").trim();

  // Excel on German Windows still saves CSV as Windows-1252; UTF-8 is tried first.
  // Windows-1252 is Latin-1 except for 0x80-0x9F (€, curly quotes, dashes...). Those are
  // mapped here, because a TextDecoder built without full ICU reads them as Latin-1 and drops the €.
  // Excel's "Unicode Text" is UTF-16 with a byte order mark; its NUL bytes are valid UTF-8,
  // so it is recognised first, by the mark or by the NUL in every other byte of plain text.
  const CP1252 = "€\u0081‚ƒ„…†‡ˆ‰Š‹Œ\u008DŽ\u008F\u0090‘’“”•–—˜™š›œ\u009DžŸ";
  const utf16 = (data) => {
    if (data.length < 2) return null;
    if (data[0] === 0xff && data[1] === 0xfe) return "utf-16le";
    if (data[0] === 0xfe && data[1] === 0xff) return "utf-16be";
    const head = data.subarray(0, Math.min(data.length, 512));
    let even = 0, odd = 0;
    for (let i = 0; i < head.length; i += 1) if (head[i] === 0) { if (i % 2) odd += 1; else even += 1; }
    if (odd > head.length / 4 && even === 0) return "utf-16le";
    if (even > head.length / 4 && odd === 0) return "utf-16be";
    return null;
  };
  const decode = (bytes) => {
    const data = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
    const wide = utf16(data);
    if (wide) {
      try { return new TextDecoder(wide).decode(data).replace(/^\ufeff/, ""); } catch { /* no UTF-16 decoder: read as bytes below */ }
    }
    try {
      return new TextDecoder("utf-8", { fatal: true }).decode(data).replace(/^﻿/, "");
    } catch {
      let text = "";
      for (let i = 0; i < data.length; i += 8192) {
        text += String.fromCharCode(...data.subarray(i, i + 8192)).replace(/[\x80-\x9f]/g, (ch) => CP1252[ch.charCodeAt(0) - 0x80]);
      }
      return text;
    }
  };

  // Reading .xlsx files: cells as text, numbers written the way the page reads them.
  const xmlText = (text) => text.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'")
    .replace(/&#x([0-9a-f]+);/gi, (m, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (m, dec) => String.fromCodePoint(Number(dec))).replace(/&amp;/g, "&");
  const columnIndex = (ref) => [...ref.replace(/\d+/g, "")].reduce((n, ch) => n * 26 + ch.charCodeAt(0) - 64, 0) - 1;
  // Every sheet of an .xlsx file, in workbook order: [{ name, hidden, rows }].
  const readWorkbook = async (buffer, unzip, decimalComma = false) => {
    // Excel stores 3.125, which a German page would otherwise read as 3125.
    const numberCell = (raw) => {
      const n = Number(raw);
      if (!/^[+-]?[\d.]+(e[+-]?\d+)?$/i.test(raw) || !Number.isFinite(n)) return raw;
      const text = n.toLocaleString("en-US", { useGrouping: false, maximumFractionDigits: 10 });
      return decimalComma ? text.replace(".", ",") : text;
    };
    const get = (name) => unzip(buffer, name).catch(() => "");
    const workbook = await get("xl/workbook.xml");
    const rels = await get("xl/_rels/workbook.xml.rels");
    const targetOf = (id) => (rels.match(new RegExp(`<Relationship\\b[^>]*Id="${id}"[^>]*Target="([^"]+)"`)) || rels.match(new RegExp(`<Relationship\\b[^>]*Target="([^"]+)"[^>]*Id="${id}"`)) || [])[1];
    const sheets = [...workbook.matchAll(/<sheet\b([^>]*)\/?>/g)].map((m, i) => {
      const attrs = m[1];
      const target = targetOf((attrs.match(/\br:id="([^"]+)"/) || [])[1]);
      return {
        name: xmlText((attrs.match(/\bname="([^"]*)"/) || [])[1] || `Sheet ${i + 1}`),
        hidden: /\bstate="(?:hidden|veryHidden)"/.test(attrs),
        path: target ? (target.startsWith("/") ? target.slice(1) : `xl/${target.replace(/^\.\//, "")}`) : `xl/worksheets/sheet${i + 1}.xml`,
      };
    });
    if (!sheets.length) sheets.push({ name: "Sheet 1", hidden: false, path: "xl/worksheets/sheet1.xml" });
    const shared = (await get("xl/sharedStrings.xml")).split(/<si\b[^>]*>/).slice(1)
      .map((si) => xmlText([...si.split("</si>")[0].matchAll(/<t\b[^>]*>([\s\S]*?)<\/t>/g)].map((m) => m[1]).join("")));
    const out = [];
    for (const sheet of sheets) {
      const xml = await get(sheet.path);
      const rows = [];
      // Rows sit at their Excel row number (an empty row, written as <row .../>, stays empty), so that
      // "Row 5" in a note is row 5 of the sheet.
      for (const rowMatch of xml.matchAll(/<row\b([^>]*?)(?:\/>|>([\s\S]*?)<\/row>)/g)) {
        const number = Number((rowMatch[1].match(/\br="(\d+)"/) || [])[1]);
        const row = [];
        for (const cell of (rowMatch[2] || "").matchAll(/<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
          const attrs = cell[1];
          const inner = cell[2] || "";
          const ref = (attrs.match(/\br="([A-Z]+)\d+"/) || [])[1];
          const type = (attrs.match(/\bt="(\w+)"/) || [])[1];
          const raw = (inner.match(/<v>([\s\S]*?)<\/v>/) || [])[1];
          let value = "";
          if (type === "s") value = shared[Number(raw)] ?? "";
          else if (type === "inlineStr") value = xmlText([...inner.matchAll(/<t\b[^>]*>([\s\S]*?)<\/t>/g)].map((m) => m[1]).join(""));
          else if (raw !== undefined) value = type === "str" || type === "e" || type === "b" ? xmlText(raw) : numberCell(xmlText(raw));
          row[ref ? columnIndex(ref) : row.length] = value;
        }
        const cells = Array.from(row, (cell) => (cell ?? "").trim());
        if (number >= 1) { while (rows.length < number - 1) rows.push([]); rows[number - 1] = cells; } else rows.push(cells);
      }
      out.push({ name: sheet.name, hidden: sheet.hidden, rows });
    }
    return out;
  };
  // The first sheet only.
  const readXlsx = async (buffer, unzip, decimalComma = false) => (await readWorkbook(buffer, unzip, decimalComma))[0].rows;

  // ---------- Recognising the columns ----------
  const WORDS = {
    category: ["cause", "causes", "reason", "root cause", "category", "kategorie", "kategori", "kategoria", "grund", "ursache", "grundursache", "fehlerursache", "fehler", "fehlerart", "defect", "issue", "problem", "type", "typ", "art", "shkak", "shkaku", "arsye", "arsyeja", "lloji", "gabimi", "reason code", "rts reason", "beschwerde", "complaint", "ankesa"],
    count: ["count", "qty", "quantity", "anzahl", "menge", "stuck", "stueck", "units", "pcs", "cases", "falle", "faelle", "sasia", "numri", "cope", "parcels", "pakete", "pako", "complaints", "beschwerden", "ankesa", "findings", "befunde", "gjetje", "frequency", "haufigkeit"],
    value: ["minutes", "min", "minuten", "minuta", "cost", "costs", "kosten", "kosto", "eur", "euro", "€", "value", "wert", "vlera", "amount", "betrag", "shuma", "hours", "stunden", "ore", "time", "zeit", "koha", "delay", "verspatung", "vonese", "duration", "dauer", "idle", "dwell", "compensation", "entschadigung", "kompensim", "loss", "verlust", "hours out of order", "delay minutes", "verspatung minuten", "minuta vonese", "cost €", "kosten €", "kosto €", "amount €", "betrag €", "shuma €"],
    date: ["date", "datum", "data", "day", "tag", "dita"],
    filter: ["dsp", "station", "zone", "zona", "area", "bereich", "department", "abteilung", "departamenti", "shift", "schicht", "turni", "floor", "etage", "kati", "driver", "fahrer", "shofer", "route", "tour", "rruga", "site", "standort", "stacioni", "supplier", "lieferant", "furnitori", "stage", "phase", "faza"],
  };
  const matches = (header, kind) => {
    const h = fold(header);
    return h && WORDS[kind].some((word) => h === word || h.startsWith(`${word} `) || h.endsWith(` ${word}`) || h.includes(` ${word} `));
  };

  // Types of each column, from up to 500 data rows.
  const profile = (rows, width, parseNumber, parseDate) => {
    const sample = rows.slice(0, 500);
    return Array.from({ length: width }, (_, col) => {
      const cells = sample.map((row) => String(row[col] ?? "").trim()).filter(Boolean);
      const n = cells.length || 1;
      const numeric = cells.filter((cell) => Number.isFinite(parseNumber(cell))).length / n;
      const dates = cells.filter((cell) => parseDate(cell) && !/^\d{1,4}$/.test(cell)).length / n;
      const distinct = new Set(cells.map(fold)).size;
      const avgLength = cells.reduce((sum, cell) => sum + cell.length, 0) / n;
      return { col, filled: cells.length, numeric, dates, distinct, avgLength };
    });
  };

  // Is the first row a header? Yes when it names a known column, or when it
  // holds words where the rows below hold numbers or dates.
  const detectHeader = (rows, parseNumber, parseDate) => {
    if (rows.length < 2) return false;
    const first = rows[0];
    if (first.some((cell) => ["category", "count", "value", "date"].some((kind) => matches(cell, kind)))) return true;
    const rest = rows.slice(1);
    const types = profile(rest, first.length, parseNumber, parseDate);
    return types.some((type, col) => {
      const cell = String(first[col] ?? "").trim();
      return cell && (type.numeric > 0.8 && !Number.isFinite(parseNumber(cell)) || type.dates > 0.8 && !parseDate(cell));
    });
  };

  const suggestColumns = (table, parseNumber, parseDate) => {
    const { headers, rows } = table;
    const types = profile(rows, headers.length, parseNumber, parseDate);
    const used = new Set();
    const pick = (kind, test) => {
      const byName = headers.findIndex((header, col) => !used.has(col) && matches(header, kind) && test(types[col]));
      if (byName >= 0) { used.add(byName); return byName; }
      return -1;
    };
    const isText = (type) => type.filled && type.numeric < 0.5 && type.dates < 0.5;
    const isNumber = (type) => type.filled && type.numeric >= 0.8;
    const isDate = (type) => type.filled && type.dates >= 0.8;
    const map = { category: -1, count: -1, value: -1, date: -1, filter: -1 };
    map.date = pick("date", isDate);
    // A cause column beats a type column ("Root_Cause_Category" before "Incident_Type").
    const causeFirst = headers.findIndex((header, col) => /\b(root cause|cause|causes|reason|ursache|grundursache|fehlerursache|grund|shkak|shkaku|arsye|arsyeja)\b/.test(fold(header)) && isText(types[col]));
    if (causeFirst >= 0) { map.category = causeFirst; used.add(causeFirst); } else map.category = pick("category", isText);
    if (map.category < 0) {
      // The text column whose values repeat most, with words of a sensible length.
      const candidates = types.filter((type) => !used.has(type.col) && isText(type) && type.avgLength >= 2 && type.avgLength <= 80)
        .sort((a, b) => (a.distinct / a.filled) - (b.distinct / b.filled) || b.filled - a.filled);
      if (candidates.length) { map.category = candidates[0].col; used.add(map.category); }
    }
    map.count = pick("count", isNumber);
    map.value = pick("value", isNumber);
    // A summary table (every cause once) counts with its number column.
    const categoryType = types[map.category];
    const aggregated = categoryType && categoryType.distinct === categoryType.filled && rows.length > 1;
    if (aggregated && map.count < 0 && map.value < 0) {
      const number = types.find((type) => !used.has(type.col) && isNumber(type) && type.dates < 0.5);
      if (number) { map.count = number.col; used.add(number.col); }
    }
    if (map.date < 0) {
      const date = types.find((type) => !used.has(type.col) && isDate(type));
      if (date) { map.date = date.col; used.add(date.col); }
    }
    map.filter = pick("filter", isText);
    return map;
  };

  // ---------- Counting ----------
  const OTHER_WORDS = new Set(["other", "others", "sonstige", "sonstiges", "andere", "tjeter", "te tjera", "tjera", "unknown", "unbekannt", "e panjohur", "i panjohur", "not stated", "nicht angegeben", "pa shkak", "n a", "na", "misc", "diverse", "various"]);
  const isOther = (name) => OTHER_WORDS.has(fold(name));

  // Similar names ("Traffic" and "Trafic") that may be one cause; they are only offered, never merged unasked.
  const distance = (a, b) => {
    if (Math.abs(a.length - b.length) > 2) return 3;
    const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) {
      let diag = prev[0];
      prev[0] = i;
      for (let j = 1; j <= b.length; j++) {
        const temp = prev[j];
        prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1));
        diag = temp;
      }
    }
    return prev[b.length];
  };
  const similarPairs = (names) => {
    const pairs = [];
    const list = names.slice(0, 200);
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const a = fold(list[i].key);
        const b = fold(list[j].key);
        if (a.length < 5 || b.length < 5) continue;
        const d = distance(a, b);
        const limit = Math.min(a.length, b.length) >= 10 ? 2 : 1;
        if (d > 0 && d <= limit) pairs.push([list[i].key, list[j].key]);
      }
    }
    return pairs.slice(0, 12);
  };

  // Rows to causes. options: { map, measure, merges, from, to, filterValue, notStated, parseNumber, parseDate }
  const analyse = (table, options) => {
    const { map, measure, parseNumber, parseDate } = options;
    const merges = new Map((options.merges || []).map(([from, to]) => [fold(from), to]));
    const groups = new Map();
    const skipped = [];
    let read = 0;
    let used = 0;
    let totalCount = 0;
    let totalValue = 0;
    const firstRow = (table.firstLine || 1) + (table.hasHeader ? 1 : 0);
    table.rows.forEach((row, index) => {
      const line = index + firstRow;
      if (!row.some((cell) => String(cell ?? "").trim())) return;
      read += 1;
      if (map.filter >= 0 && options.filterValue && fold(row[map.filter]) !== fold(options.filterValue)) return;
      if (map.date >= 0 && (options.from || options.to)) {
        const date = parseDate(row[map.date]);
        if (!date) { skipped.push({ line, reason: "date" }); return; }
        if ((options.from && date < options.from) || (options.to && date > options.to)) return;
      }
      let count = 1;
      if (map.count >= 0) {
        count = parseNumber(row[map.count]);
        if (!Number.isFinite(count) || count < 0) { skipped.push({ line, reason: "count", cell: row[map.count] }); return; }
      }
      let value = 0;
      if (map.value >= 0) {
        const cell = String(row[map.value] ?? "").trim();
        value = cell ? parseNumber(cell) : NaN;
        if (!Number.isFinite(value) || value < 0) {
          if (measure === "value") { skipped.push({ line, reason: "value", cell }); return; }
          value = 0;
        }
      }
      const raw = String(row[map.category] ?? "").replace(/\s+/g, " ").trim();
      const name = raw || options.notStated;
      const key = merges.get(fold(name)) ? fold(merges.get(fold(name))) : fold(name) || fold(options.notStated);
      const group = groups.get(key) || { key, names: new Map(), count: 0, value: 0, rows: 0 };
      group.names.set(merges.get(fold(name)) || name, (group.names.get(merges.get(fold(name)) || name) || 0) + 1);
      group.count += count;
      group.value += value;
      group.rows += 1;
      groups.set(key, group);
      used += 1;
      totalCount += count;
      totalValue += value;
    });
    // Each cause is shown under its most frequent spelling; other spellings were merged into it.
    const items = [...groups.values()].map((group) => {
      const spellings = [...group.names.entries()].sort((a, b) => b[1] - a[1]);
      return { key: spellings[0][0], spellings: spellings.map(([name]) => name), count: group.count, value: group.value, rows: group.rows };
    });
    const metric = (item) => (measure === "value" ? item.value : item.count);
    const total = measure === "value" ? totalValue : totalCount;
    items.sort((a, b) => (isOther(a.key) - isOther(b.key)) || metric(b) - metric(a) || a.key.localeCompare(b.key));
    let running = 0;
    items.forEach((item) => {
      item.amount = metric(item);
      item.share = total ? item.amount / total : 0;
      const before = running;
      running += item.share;
      item.cumulative = Math.min(1, running);
      // A causes bring the total up to 80%; the cause that crosses 80% belongs to them.
      item.cls = before < 0.8 - 1e-9 ? "A" : before < 0.95 - 1e-9 ? "B" : "C";
    });
    const real = items.filter((item) => !isOther(item.key));
    const vital = items.filter((item) => item.cls === "A" && !isOther(item.key));
    const top20 = real.slice(0, Math.max(1, Math.ceil(real.length * 0.2)));
    const top20Share = top20.reduce((sum, item) => sum + item.share, 0);
    const otherShare = items.filter((item) => isOther(item.key)).reduce((sum, item) => sum + item.share, 0);
    return {
      items, vital, total, totalCount, totalValue, read, used, skipped,
      vitalShare: vital.reduce((sum, item) => sum + item.share, 0),
      top20Share,
      // With fewer than five causes, 80/20 cannot show; with a flat spread there is no vital few.
      shape: real.length < 5 ? "few" : top20Share >= 0.6 ? "strong" : top20Share >= 0.45 ? "moderate" : "flat",
      otherShare,
      merged: items.filter((item) => item.spellings.length > 1).map((item) => ({ key: item.key, spellings: item.spellings })),
      suggestions: similarPairs(items),
    };
  };

  // Two periods side by side: share of each cause before and from the split date.
  const compare = (table, options, split) => {
    const before = analyse(table, { ...options, from: options.from, to: prevDay(split) });
    const after = analyse(table, { ...options, from: split, to: options.to });
    const keys = new Map();
    [...before.items, ...after.items].forEach((item) => { if (!keys.has(fold(item.key))) keys.set(fold(item.key), item.key); });
    const find = (result, key) => result.items.find((item) => fold(item.key) === key);
    return {
      before, after,
      rows: [...keys.entries()].map(([key, name]) => {
        const a = find(before, key);
        const b = find(after, key);
        return { key: name, before: a ? a.amount : 0, beforeShare: a ? a.share : 0, after: b ? b.amount : 0, afterShare: b ? b.share : 0 };
      }).sort((x, y) => y.before + y.after - (x.before + x.after)),
    };
  };
  const prevDay = (iso) => {
    const date = new Date(`${iso}T00:00:00Z`);
    date.setUTCDate(date.getUTCDate() - 1);
    return date.toISOString().slice(0, 10);
  };

  // ---------- Examples ----------
  // A fixed seed per template, so the example is the same every time.
  const random = (seed) => {
    let s = [...seed].reduce((h, ch) => Math.imul(h ^ ch.charCodeAt(0), 16777619), 2166136261) >>> 0;
    return () => {
      s = (s + 0x6d2b79f5) >>> 0;
      let t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };
  const example = (template, lang, end, rowsWanted = 160) => {
    const rand = random(template.id);
    const weights = template.causes.map((cause) => cause.w);
    const sum = weights.reduce((a, b) => a + b, 0);
    const endDate = new Date(`${end}T00:00:00Z`);
    const rows = [];
    for (let i = 0; i < rowsWanted; i++) {
      let pickAt = rand() * sum;
      const cause = template.causes.find((c) => (pickAt -= c.w) < 0) || template.causes[0];
      const date = new Date(endDate);
      date.setUTCDate(date.getUTCDate() - Math.floor(rand() * 28));
      const areas = template.areas[lang] || template.areas.en;
      const [lo, hi] = template.count;
      const count = lo + Math.floor(rand() * (hi - lo + 1));
      const value = cause.v ? Math.round(cause.v[0] + rand() * (cause.v[1] - cause.v[0])) : "";
      rows.push([date.toISOString().slice(0, 10), areas[Math.floor(rand() * areas.length)], template.idFormat.replace("{n}", String(100 + Math.floor(rand() * 60))), cause[lang] || cause.en, String(count), String(value), ""]);
    }
    rows.sort((a, b) => a[0].localeCompare(b[0]));
    return { headers: template.columns[lang] || template.columns.en, rows };
  };

  // ---------- The chart (one axis, 0–100%) ----------
  const SVG = "http://www.w3.org/2000/svg";
  const svgEl = (tag, attrs = {}, text) => {
    const node = document.createElementNS(SVG, tag);
    Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const shorten = (text, max) => (text.length > max ? `${text.slice(0, max - 1)}…` : text);

  // bars: [{ key, share, cumulative, vital, amountText, shareText, cumulativeText }]; colors: { vital, rest, line, grid, text, muted, surface }
  const chart = (bars, colors, labels) => {
    const n = bars.length;
    const W = 960;
    const rotate = n > 7;
    const bottom = rotate ? 130 : 64;
    const H = 380 + bottom;
    // Slanted labels reach left of the first bar, so the plot starts further in.
    const left = rotate ? 104 : 52;
    const right = 24;
    const top = 26;
    const plotH = H - top - bottom;
    const plotW = W - left - right;
    const band = plotW / Math.max(n, 1);
    const barW = Math.min(30, band * 0.62);
    const y = (share) => top + plotH * (1 - share);
    const svg = svgEl("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": labels.title, class: "pa-chart", "font-family": "Inter, Segoe UI, Roboto, Arial, sans-serif" });
    svg.append(svgEl("title", {}, labels.title));
    const grid = svgEl("g", { class: "pa-grid" });
    for (let tick = 0; tick <= 100; tick += 20) {
      grid.append(svgEl("line", { x1: left, x2: W - right, y1: y(tick / 100), y2: y(tick / 100), style: `stroke:${colors.grid}`, "stroke-width": 1 }));
      grid.append(svgEl("text", { x: left - 10, y: y(tick / 100) + 4, "text-anchor": "end", "font-size": 12, style: `fill:${colors.muted}` }, `${tick}%`));
    }
    svg.append(grid);
    // The 80% line.
    svg.append(svgEl("line", { x1: left, x2: W - right, y1: y(0.8), y2: y(0.8), style: `stroke:${colors.text}`, "stroke-width": 1, opacity: 0.55 }));
    svg.append(svgEl("text", { x: W - right, y: y(0.8) - 6, "text-anchor": "end", "font-size": 12, "font-weight": 700, style: `fill:${colors.text}` }, labels.line80));
    const marks = svgEl("g");
    bars.forEach((bar, i) => {
      const cx = left + band * (i + 0.5);
      const h = Math.max(plotH * bar.share, bar.share > 0 ? 1.5 : 0);
      const x = cx - barW / 2;
      const yTop = top + plotH - h;
      const r = Math.min(4, h, barW / 2);
      const g = svgEl("g", { class: "pa-bar-group", tabindex: 0, role: "img", "aria-label": `${bar.key}: ${bar.amountText}, ${bar.shareText}, ${labels.cumulative} ${bar.cumulativeText}` });
      g.dataset.index = i;
      g.append(svgEl("rect", { x: cx - band / 2, y: top, width: band, height: plotH, fill: "transparent", class: "pa-hit" }));
      g.append(svgEl("path", {
        d: `M${x},${top + plotH} V${yTop + r} Q${x},${yTop} ${x + r},${yTop} H${x + barW - r} Q${x + barW},${yTop} ${x + barW},${yTop + r} V${top + plotH} Z`,
        style: `fill:${bar.vital ? colors.vital : colors.rest}`, class: "pa-bar",
      }));
      // The first point of the line sits on the first bar, so its label moves beside it.
      if (bar.vital) {
        const side = i === 0 ? { x: cx + barW / 2 + 6, y: yTop + 14, "text-anchor": "start" } : { x: cx, y: yTop - 7, "text-anchor": "middle" };
        g.append(svgEl("text", { ...side, "font-size": 12, "font-weight": 700, style: `fill:${colors.text}` }, bar.shareText));
      }
      const name = shorten(bar.key, rotate ? 24 : Math.max(8, Math.floor(band / 7.2)));
      if (rotate) {
        g.append(svgEl("text", { x: cx, y: top + plotH + 14, "text-anchor": "end", "font-size": 12, style: `fill:${colors.text}`, transform: `rotate(-38 ${cx} ${top + plotH + 14})` }, name));
      } else {
        const words = name.split(" ");
        const half = Math.ceil(words.length / 2);
        const lines = name.length > band / 7.2 && words.length > 1 ? [words.slice(0, half).join(" "), words.slice(half).join(" ")] : [name];
        lines.forEach((line, k) => g.append(svgEl("text", { x: cx, y: top + plotH + 20 + k * 15, "text-anchor": "middle", "font-size": 12, style: `fill:${colors.text}` }, shorten(line, Math.max(8, Math.floor(band / 7)) + 4))));
      }
      marks.append(g);
    });
    svg.append(marks);
    // The cumulative line with its points.
    const points = bars.map((bar, i) => [left + band * (i + 0.5), y(bar.cumulative)]);
    if (points.length) {
      svg.append(svgEl("polyline", { points: points.map((p) => p.join(",")).join(" "), style: `fill:none;stroke:${colors.line}`, "stroke-width": 2, "stroke-linejoin": "round", "stroke-linecap": "round", "pointer-events": "none" }));
      points.forEach(([px, py]) => svg.append(svgEl("circle", { cx: px, cy: py, r: 4.5, style: `fill:${colors.line};stroke:${colors.surface}`, "stroke-width": 2, "pointer-events": "none" })));
    }
    svg.append(svgEl("line", { x1: left, x2: W - right, y1: top + plotH, y2: top + plotH, style: `stroke:${colors.muted}`, "stroke-width": 1 }));
    return svg;
  };

  window.Pareto = { fold, decode, readXlsx, readWorkbook, detectHeader, suggestColumns, analyse, compare, example, similarPairs, isOther, chart };

  // ======================================================================
  const app = document.querySelector("[data-pareto]");
  const dataEl = document.getElementById("pareto-data");
  if (!app || !dataEl || !window.ToolKit) return;
  const { LANG, tx, el, num, pct, int, lower, parseNumber, parseDate, parseRows, showDate, read, write, isObject, str, stat, resultActions, csvSafe } = window.ToolKit;
  const data = JSON.parse(dataEl.textContent);
  const lang = ["de", "sq"].includes(LANG) ? LANG : "en";
  const templates = Object.fromEntries(data.templates.map((template) => [template.id, template]));
  const MAX_ROWS = 50000;
  const SAVE_ROWS = 20000;

  const $ = (selector) => app.querySelector(selector);
  const status = $("[data-source-note]");
  const mapping = $("[data-mapping]");
  const results = document.querySelector("[data-pareto-results]");

  const blankState = () => ({ template: data.templates[0].id, source: null, map: null, measure: "count", valueLabel: "", merges: [], filterValue: "", from: "", to: "", group: "0", split: "" });
  const state = (() => {
    const saved = read(data.storageKey, null);
    const base = blankState();
    if (!isObject(saved)) return base;
    const source = isObject(saved.source) && Array.isArray(saved.source.headers) && Array.isArray(saved.source.rows)
      ? { name: str(saved.source.name), headers: saved.source.headers.map(String), rows: saved.source.rows.filter(Array.isArray).map((row) => row.map((cell) => String(cell ?? ""))), hasHeader: Boolean(saved.source.hasHeader), firstLine: Number.isInteger(saved.source.firstLine) && saved.source.firstLine > 0 ? saved.source.firstLine : 1, truncated: Boolean(saved.source.truncated) }
      : null;
    const map = isObject(saved.map) ? Object.fromEntries(["category", "count", "value", "date", "filter"].map((key) => [key, Number.isInteger(saved.map[key]) ? saved.map[key] : -1])) : null;
    return {
      ...base,
      template: templates[saved.template] ? saved.template : base.template,
      source,
      map: source && map && map.category < source.headers.length ? map : null,
      measure: saved.measure === "value" ? "value" : "count",
      valueLabel: str(saved.valueLabel),
      merges: Array.isArray(saved.merges) ? saved.merges.filter((pair) => Array.isArray(pair) && pair.length === 2).map((pair) => pair.map(String)) : [],
      filterValue: str(saved.filterValue),
      from: parseDate(str(saved.from)),
      to: parseDate(str(saved.to)),
      group: ["0", "1", "2", "5"].includes(saved.group) ? saved.group : "0",
      split: parseDate(str(saved.split)),
    };
  })();
  let saveTimer;
  const save = () => {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      // Only the first rows are kept between visits; the page says so when it opens with such a copy.
      const copy = { ...state, source: state.source ? { ...state.source, rows: state.source.rows.slice(0, SAVE_ROWS), truncated: state.source.rows.length > SAVE_ROWS } : null };
      if (!write(data.storageKey, copy)) status.textContent = tx("This browser could not save the data (storage is full, blocked or private). It stays on this page until you close it.");
    }, 300);
  };
  const say = (text) => { status.textContent = text; };
  if (state.source?.truncated) say(tx("Only the first {n} rows of {name} were kept between visits. Open the file again for the full totals.", { n: int.format(SAVE_ROWS), name: state.source.name }));

  const template = () => templates[state.template];
  const valueName = () => state.valueLabel.trim() || (state.source && state.map?.value >= 0 ? state.source.headers[state.map.value] : "") || tx("Value");

  // ---------- Loading data ----------
  const useTable = (name, rows, options = {}) => {
    const trimmed = rows.map((row) => row.map((cell) => String(cell ?? "").trim()));
    const hasText = (row) => row.some(Boolean);
    if (!trimmed.some(hasText)) { say(tx("No rows were found in this data.")); return false; }
    // Title lines above the table ("Incident log", a blank, a note) are skipped: the table starts at the
    // first row about as wide as the widest of the first thirty. Empty rows inside the table stay, so
    // that every row keeps the line number it has in the file (firstLine is the line of the first kept row).
    let start = trimmed.findIndex(hasText);
    const filled = trimmed.slice(start).filter(hasText).slice(0, 30).map((row) => row.filter(Boolean).length);
    const widest = Math.max(...filled);
    if (widest >= 3) while (!hasText(trimmed[start]) || trimmed[start].filter(Boolean).length < Math.max(2, widest * 0.6)) start++;
    const clean = trimmed.slice(start);
    while (clean.length && !hasText(clean.at(-1))) clean.pop();
    const width = Math.max(...clean.map((row) => row.length));
    const padded = clean.slice(0, MAX_ROWS + 1).map((row) => Array.from({ length: width }, (_, i) => row[i] ?? ""));
    const hasHeader = options.hasHeader ?? detectHeader(padded, parseNumber, parseDate);
    const headers = hasHeader ? padded[0].map((cell, i) => cell || tx("Column {n}", { n: i + 1 })) : padded[0].map((_, i) => tx("Column {n}", { n: i + 1 }));
    state.source = { name, headers, rows: hasHeader ? padded.slice(1) : padded, hasHeader, firstLine: start + 1 };
    state.map = options.map || suggestColumns(state.source, parseNumber, parseDate);
    if (state.map.category < 0) state.map.category = 0;
    const tpl = template();
    state.measure = options.measure || (state.map.value >= 0 && (tpl.measure === "value" || state.map.count < 0 && !options.forceCount) ? "value" : "count");
    if (state.map.value < 0) state.measure = "count";
    state.valueLabel = options.valueLabel || "";
    state.merges = [];
    state.filterValue = "";
    state.from = "";
    state.to = "";
    state.split = "";
    const cut = clean.length > MAX_ROWS + 1;
    say(tx("{name}: {n} rows read.", { name, n: int.format(state.source.rows.length) }) + (cut ? ` ${tx("Only the first {n} rows are used.", { n: int.format(MAX_ROWS) })}` : ""));
    save();
    renderAll();
    return true;
  };

  // Workbooks with several sheets: the page opens the sheet that looks most like a
  // cause log (a cause column, then the most rows); the others can be picked.
  let workbook = [];
  const sheetRow = $("[data-sheet-row]");
  const sheetSelect = $("[data-sheet]");
  const bestSheet = (sheets) => {
    const score = (sheet) => {
      const top = sheet.rows.slice(0, 12).flat().map(fold);
      const cause = top.some((cell) => /\b(root cause|cause|reason|ursache|grund|shkak|shkaku|arsye|arsyeja|category|kategorie)\b/.test(cell));
      return (sheet.hidden ? -1e6 : 0) + (cause ? 1e5 : 0) + Math.min(sheet.rows.length, 99999);
    };
    return sheets.reduce((best, sheet, i) => (score(sheet) > score(sheets[best]) ? i : best), 0);
  };
  const renderSheets = (fileName, selected) => {
    sheetRow.hidden = workbook.length < 2;
    sheetSelect.replaceChildren(...workbook.map((sheet, i) => {
      const option = el("option", null, `${sheet.name} (${int.format(Math.max(0, sheet.rows.length - 1))})`);
      option.value = String(i);
      return option;
    }));
    sheetSelect.value = String(selected);
    sheetSelect.dataset.file = fileName;
  };
  sheetSelect.addEventListener("change", () => {
    const sheet = workbook[Number(sheetSelect.value)];
    if (sheet) useTable(`${sheetSelect.dataset.file} · ${sheet.name}`, sheet.rows);
  });

  const importFile = async (file) => {
    if (!file) return;
    workbook = [];
    sheetRow.hidden = true;
    const name = file.name;
    say(tx("Reading {name}…", { name }));
    try {
      if (file.size > 30e6) throw new Error("size");
      let rows;
      if (/\.xlsx$/i.test(name)) {
        workbook = (await readWorkbook(await file.arrayBuffer(), window.CvImport.unzip, LANG !== "en")).filter((sheet) => sheet.rows.filter((row) => row.some(Boolean)).length >= 2);
        if (!workbook.length) throw new Error("empty");
        const best = bestSheet(workbook);
        renderSheets(name, best);
        rows = workbook[best].rows;
        if (workbook.length > 1) {
          useTable(`${name} · ${workbook[best].name}`, rows);
          return;
        }
      }
      else if (/\.xls$/i.test(name)) throw new Error("xls");
      else if (/\.(csv|txt|tsv)$/i.test(name) || /^text\//.test(file.type) || !file.type) rows = parseRows(decode(await file.arrayBuffer()), { keepBlank: true });
      else throw new Error("type");
      if (!rows.length) throw new Error("empty");
      useTable(name, rows);
    } catch (error) {
      say(error.message === "xls" ? tx("Old Excel files (.xls) cannot be read here. In Excel, choose Save as and pick .xlsx or CSV.")
        : error.message === "size" ? tx("This file is larger than 30 MB. Export only the columns and weeks you need.")
        : error.message === "type" ? tx("Use a CSV, an Excel file (.xlsx) or a text file.")
        : tx("This file could not be read. Save it as CSV or .xlsx and try again, or paste the cells."));
    }
  };

  // Data handed over by another tool on this site (Damage Control, Delay Analyzer, …).
  const handoff = (() => {
    try {
      const raw = sessionStorage.getItem(data.handoffKey);
      sessionStorage.removeItem(data.handoffKey);
      const value = raw && JSON.parse(raw);
      return isObject(value) && Array.isArray(value.headers) && Array.isArray(value.rows) ? value : null;
    } catch {
      return null;
    }
  })();

  // ---------- Template controls ----------
  const templateSelect = $("[data-template]");
  const renderTemplate = () => {
    const tpl = template();
    templateSelect.value = tpl.id;
    $("[data-template-what]").textContent = tpl.what[lang] || tpl.what.en;
    const list = $("[data-cause-list]");
    list.replaceChildren(...tpl.causes.map((cause) => el("li", null, cause[lang] || cause.en)));
    $("[data-template-columns]").textContent = (tpl.columns[lang] || tpl.columns.en).join(" · ");
  };
  templateSelect.addEventListener("change", () => {
    state.template = templateSelect.value;
    renderTemplate();
    save();
  });

  const csvCell = (raw, sep) => {
    const text = csvSafe(String(raw ?? ""));
    return /[";\n,\t]/.test(text) || text.includes(sep) ? `"${text.replace(/"/g, '""')}"` : text;
  };
  const download = (name, content, type) => {
    const url = URL.createObjectURL(content instanceof Blob ? content : new Blob([content], { type }));
    const link = el("a");
    link.href = url;
    link.download = name;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  // ---------- Mapping controls ----------
  const selects = Object.fromEntries(["category", "count", "value", "date", "filter"].map((key) => [key, $(`[data-map="${key}"]`)]));
  const renderMapping = () => {
    mapping.hidden = !state.source;
    if (!state.source) return;
    const { headers } = state.source;
    Object.entries(selects).forEach(([key, select]) => {
      const none = key === "count" ? tx("Each row counts once") : key === "category" ? null : tx("None");
      const options = [];
      if (none) options.push(Object.assign(el("option", null, none), { value: "-1" }));
      headers.forEach((header, i) => options.push(Object.assign(el("option", null, header), { value: String(i) })));
      select.replaceChildren(...options);
      select.value = String(state.map[key]);
    });
    $("[data-has-header]").checked = state.source.hasHeader;
    const hasValue = state.map.value >= 0;
    const valueRadio = $('[data-measure][value="value"]');
    valueRadio.disabled = !hasValue;
    app.querySelectorAll("[data-measure]").forEach((radio) => { radio.checked = radio.value === state.measure; });
    $("[data-value-label]").value = state.valueLabel;
    $("[data-value-label]").placeholder = hasValue ? headers[state.map.value] : "";
    $("[data-value-row]").hidden = !hasValue;
    $("[data-measure-value-label]").textContent = hasValue ? valueName() : tx("a value column");
    // Filter values
    const filterRow = $("[data-filter-row]");
    filterRow.hidden = state.map.filter < 0;
    if (state.map.filter >= 0) {
      const counts = new Map();
      state.source.rows.forEach((row) => { const v = String(row[state.map.filter] ?? "").trim(); if (v) counts.set(v, (counts.get(v) || 0) + 1); });
      const values = [...counts.keys()].sort((a, b) => a.localeCompare(b)).slice(0, 300);
      const select = $("[data-filter-value]");
      select.replaceChildren(Object.assign(el("option", null, tx("All")), { value: "" }), ...values.map((v) => Object.assign(el("option", null, `${v} (${int.format(counts.get(v))})`), { value: v })));
      select.value = values.includes(state.filterValue) ? state.filterValue : "";
    }
    app.querySelectorAll("[data-date-row]").forEach((node) => { node.hidden = state.map.date < 0; });
    $("[data-from]").value = state.from;
    $("[data-to]").value = state.to;
    $("[data-group]").value = state.group;
    renderPreview();
  };

  const renderPreview = () => {
    const table = $("[data-preview]");
    const { headers, rows } = state.source;
    const roles = new Map();
    const names = { category: tx("Cause"), count: tx("Count"), value: valueName(), date: tx("Date"), filter: tx("Filter") };
    Object.entries(state.map).forEach(([key, col]) => { if (col >= 0 && !roles.has(col)) roles.set(col, names[key]); });
    const head = el("tr");
    headers.forEach((header, i) => {
      const th = el("th", roles.has(i) ? "is-mapped" : null);
      th.append(el("span", null, header));
      if (roles.has(i)) th.append(el("small", null, roles.get(i)));
      head.append(th);
    });
    const body = rows.slice(0, 6).map((row) => {
      const tr = el("tr");
      row.forEach((cell, i) => tr.append(el("td", roles.has(i) ? "is-mapped" : null, cell)));
      return tr;
    });
    const thead = el("thead");
    thead.append(head);
    const tbody = el("tbody");
    tbody.append(...body);
    table.replaceChildren(thead, tbody);
  };

  const onMapChange = () => {
    // The mapping is hidden until a table is read; nothing to map before that.
    if (!state.source) return;
    Object.entries(selects).forEach(([key, select]) => { state.map[key] = Number(select.value); });
    if (state.map.value < 0) state.measure = "count";
    state.filterValue = "";
    state.merges = [];
    save();
    renderMapping();
    renderResults();
  };
  Object.values(selects).forEach((select) => select.addEventListener("change", onMapChange));
  $("[data-has-header]").addEventListener("change", (event) => {
    if (!state.source) return;
    const { name } = state.source;
    const rows = state.source.hasHeader ? [state.source.headers, ...state.source.rows] : state.source.rows;
    useTable(name, rows, { hasHeader: event.target.checked });
  });
  app.querySelectorAll("[data-measure]").forEach((radio) => radio.addEventListener("change", () => { state.measure = radio.value; save(); renderMapping(); renderResults(); }));
  $("[data-value-label]").addEventListener("input", (event) => { state.valueLabel = event.target.value; save(); renderResults(); });
  $("[data-filter-value]").addEventListener("change", (event) => { state.filterValue = event.target.value; save(); renderResults(); });
  $("[data-from]").addEventListener("change", (event) => { state.from = parseDate(event.target.value); save(); renderResults(); });
  $("[data-to]").addEventListener("change", (event) => { state.to = parseDate(event.target.value); save(); renderResults(); });
  $("[data-group]").addEventListener("change", (event) => { state.group = event.target.value; save(); renderResults(); });

  // ---------- Results ----------
  // The number alone (tables, tiles) and with its unit (sentences, tooltips).
  const numberText = (amount) => (Number.isInteger(Math.round(amount * 100) / 100) ? int.format(Math.round(amount)) : num(amount, 1));
  const amountText = (amount) => (state.measure === "value" ? `${numberText(amount)} ${lower(valueName())}` : numberText(amount));
  // On the page the chart follows the theme (and print) through CSS variables.
  const chartColors = () => Object.fromEntries(["vital", "rest", "line", "grid", "text", "muted", "surface"].map((key) => [key, `var(--pa-${key})`]));
  const EXPORT_COLORS = { vital: "#1c7cc2", rest: "#8e98a3", line: "#1b2330", grid: "#e3e6ea", text: "#1b2330", muted: "#5f6870", surface: "#ffffff" };

  const chartBars = (result) => {
    const threshold = Number(state.group) / 100;
    const shown = [];
    const rest = [];
    result.items.forEach((item, i) => {
      const small = threshold && item.share < threshold && item.cls !== "A";
      if ((small || i >= 15) && result.items.length > 3) rest.push(item);
      else shown.push(item);
    });
    const bars = shown.map((item) => ({ key: item.key, share: item.share, cumulative: item.cumulative, vital: item.cls === "A" && !isOther(item.key), amount: item.amount }));
    if (rest.length) {
      const share = rest.reduce((sum, item) => sum + item.share, 0);
      const amount = rest.reduce((sum, item) => sum + item.amount, 0);
      bars.push({ key: (data.other[lang] || data.other.en).replace("{n}", rest.length), share, cumulative: 1, vital: false, amount });
    }
    return bars.map((bar) => ({ ...bar, amountText: amountText(bar.amount), shareText: pct(bar.share, 1), cumulativeText: pct(bar.cumulative, 1) }));
  };

  let lastResult = null;
  let coachingResult = null;
  window.CoachingToolResult = { tool: 'pareto', get: () => coachingResult };
  let lastBars = [];
  const tooltip = el("div", "pa-tooltip");
  tooltip.hidden = true;

  const summaryText = (result) => {
    const vital = result.vital;
    const unit = state.measure === "value" ? lower(valueName()) : tx("cases");
    const lines = [
      `${tx("Pareto")}: ${template() && state.source ? state.source.name : ""}`,
      tx("{a} of {b} causes make {p} of all {unit}.", { a: vital.length, b: result.items.length, p: pct(result.vitalShare, 0), unit }),
      "",
      ...result.items.map((item, i) => `${i + 1}. ${item.key}: ${amountText(item.amount)} (${pct(item.share, 1)}, ${tx("cumulative")} ${pct(item.cumulative, 1)}) ${item.cls}`),
    ];
    return lines.join("\n");
  };

  const renderResults = () => {
    coachingResult = null;
    window.dispatchEvent(new CustomEvent('coaching:result'));
    results.hidden = !state.source;
    if (!state.source) return;
    const result = analyse(state.source, {
      map: state.map, measure: state.measure, merges: state.merges, filterValue: state.filterValue,
      from: state.from, to: state.to, notStated: data.notStated[lang] || data.notStated.en, parseNumber, parseDate,
    });
    lastResult = result;
    const box = results.querySelector("[data-result-body]");
    box.replaceChildren();
    if (!result.items.length || !result.total) {
      box.append(el("p", "dl-empty", tx("Nothing to count yet: check the cause column and, for values, the value column.")));
      renderChecks(result);
      return;
    }
    coachingResult = { version: 1, tool: 'pareto', captured: new Date().toISOString(), payload: { measure: state.measure, unit: state.measure === 'value' ? valueName() : tx('cases'), source: state.source.name, filter: state.filterValue || '', from: state.from || '', to: state.to || '', total: result.total, used: result.used, skipped: result.skipped.length, items: result.items.map(r => ({ name: r.key, amount: r.amount, share: r.share, cumulative: r.cumulative, cls: r.cls })) } };
    window.dispatchEvent(new CustomEvent('coaching:result'));
    const unit = state.measure === "value" ? lower(valueName()) : tx("cases");
    // Headline
    const head = el("article", "result-card pa-headline");
    head.append(el("p", "result-label", tx("The vital few")));
    const top = result.vital[0] || result.items[0];
    const sentence = el("h3");
    sentence.textContent = result.shape === "few"
      ? tx("{top} is the largest cause: {p} of all {unit}.", { top: top.key, p: pct(top.share, 0), unit })
      : tx("{a} of {b} causes make {p} of all {unit}.", { a: result.vital.length, b: result.items.length, p: pct(result.vitalShare, 0), unit });
    head.append(sentence);
    const shapeText = {
      strong: tx("A clear 80/20 pattern: the top fifth of the causes brings {p}. Work on the highlighted causes first; everything else can wait.", { p: pct(result.top20Share, 0) }),
      moderate: tx("A moderate pattern: the top fifth of the causes brings {p}. Start with the highlighted causes, but expect to work on more than one or two.", { p: pct(result.top20Share, 0) }),
      flat: tx("No clear vital few: the top fifth of the causes brings only {p}. The problem is spread out, which usually points to the process or the system as a whole, not to one cause.", { p: pct(result.top20Share, 0) }),
      few: tx("With fewer than five causes there is no 80/20 to find; fix the largest first."),
    }[result.shape];
    head.append(el("p", null, shapeText));
    const stats = el("div", "dl-stats pa-stats");
    stats.append(
      stat(tx("Total"), numberText(result.total), state.measure === "value" ? `${lower(valueName())} · ${tx("{n} rows", { n: int.format(result.used) })}` : tx("{n} rows", { n: int.format(result.used) })),
      stat(tx("Causes"), int.format(result.items.length)),
      stat(tx("Vital few"), int.format(result.vital.length), pct(result.vitalShare, 0)),
      stat(tx("Largest cause"), shortName(top.key), pct(top.share, 0)),
    );
    head.append(stats);
    box.append(head);
    // Chart
    const figure = el("figure", "pa-figure");
    lastBars = chartBars(result);
    const labels = { title: tx("Pareto chart: share of each cause and cumulative share"), line80: "80%", cumulative: tx("cumulative") };
    const svg = chart(lastBars, chartColors(), labels);
    // On a phone the chart keeps a readable size and scrolls sideways.
    const scroller = el("div", "pa-chart-scroll");
    scroller.tabIndex = 0;
    scroller.setAttribute("role", "group");
    scroller.setAttribute("aria-label", labels.title);
    scroller.append(svg);
    figure.append(scroller, tooltip);
    const legend = el("figcaption", "pa-legend");
    legend.append(
      legendItem("pa-key-vital", tx("Vital few (A)")),
      legendItem("pa-key-rest", tx("Other causes")),
      legendItem("pa-key-line", tx("Cumulative share")),
      legendItem("pa-key-80", tx("80% line")),
    );
    figure.append(legend);
    box.append(figure);
    bindTooltip(svg, figure);
    // Warnings
    const notes = [];
    if (result.totalCount < 30 && state.measure === "count" || result.used < 30) notes.push(tx("Only {n} rows: a Pareto becomes reliable from about 50 events or 2–4 weeks of data. Treat this as a first look.", { n: result.used }));
    if (result.otherShare > 0.1) notes.push(tx("“Other”, “Unknown” or empty causes make {p}. Above 10%, the cause list needs better names; look at the notes of those rows.", { p: pct(result.otherShare, 0) }));
    if (notes.length) {
      const warn = el("div", "pa-warnings");
      notes.forEach((text) => warn.append(el("p", null, text)));
      box.append(warn);
    }
    // Table
    box.append(resultTable(result));
    // Actions
    const actions = el("div", "tool-actions result-actions");
    const png = el("button", "button-primary", tx("Download chart (PNG)"));
    png.type = "button";
    png.addEventListener("click", exportPng);
    const svgButton = el("button", "button-secondary", tx("Chart as SVG"));
    svgButton.type = "button";
    svgButton.addEventListener("click", () => download(`${fileName()}.svg`, exportSvg(), "image/svg+xml"));
    const csv = el("button", "button-secondary", tx("Results as CSV"));
    csv.type = "button";
    csv.addEventListener("click", exportCsv);
    actions.append(png, svgButton, csv);
    box.append(actions);
    box.append(resultActions(() => summaryText(result), tx("Why is “{cause}” our largest cause?", { cause: top.key })));
    renderChecks(result);
    renderCompare();
  };
  const shortName = (text) => (text.length > 28 ? `${text.slice(0, 27)}…` : text);
  const legendItem = (className, text) => {
    const item = el("span", "pa-legend-item");
    item.append(el("i", className), text);
    return item;
  };

  const resultTable = (result) => {
    const wrap = el("div", "dl-table-wrap pa-table-wrap");
    wrap.tabIndex = 0;
    const table = el("table", "dl-table pa-table");
    const head = el("tr");
    ["#", tx("Cause"), state.measure === "value" ? valueName() : tx("Count"), tx("Share of the total"), tx("Cumulative"), tx("Class")].forEach((text) => head.append(el("th", null, text)));
    const thead = el("thead");
    thead.append(head);
    const tbody = el("tbody");
    result.items.forEach((item, i) => {
      const tr = el("tr", item.cls === "A" && !isOther(item.key) ? "is-vital" : null);
      const name = el("td");
      name.append(item.key);
      if (item.spellings.length > 1) name.append(el("small", "pa-spellings", ` (${tx("also written")}: ${item.spellings.slice(1).join(", ")})`));
      tr.append(el("td", null, String(i + 1)), name, el("td", "num", numberText(item.amount)), el("td", "num", pct(item.share, 1)), el("td", "num", pct(item.cumulative, 1)), el("td", `pa-class is-${item.cls.toLowerCase()}`, item.cls));
      tbody.append(tr);
    });
    table.append(thead, tbody);
    wrap.append(table);
    const caption = el("p", "cv-hint", tx("A: the causes that bring the total to 80%. B: up to 95%. C: the rest."));
    const box = el("div");
    box.append(wrap, caption);
    return box;
  };

  const bindTooltip = (svg, figure) => {
    const show = (group) => {
      const bar = lastBars[Number(group.dataset.index)];
      if (!bar) return;
      tooltip.replaceChildren(el("strong", null, bar.amountText), el("span", null, bar.key), el("span", null, `${tx("Share of the total")}: ${bar.shareText} · ${tx("Cumulative")}: ${bar.cumulativeText}`));
      tooltip.hidden = false;
      const box = group.getBoundingClientRect();
      const frame = figure.getBoundingClientRect();
      const x = Math.min(Math.max(box.left + box.width / 2 - frame.left, 90), frame.width - 90);
      tooltip.style.left = `${x}px`;
      tooltip.style.top = `${Math.max(0, box.top - frame.top + 10)}px`;
      svg.querySelectorAll(".pa-bar-group").forEach((g) => g.classList.toggle("is-active", g === group));
    };
    const hide = () => {
      tooltip.hidden = true;
      svg.querySelectorAll(".pa-bar-group").forEach((g) => g.classList.remove("is-active"));
    };
    svg.querySelectorAll(".pa-bar-group").forEach((group) => {
      group.addEventListener("pointerenter", () => show(group));
      group.addEventListener("focus", () => show(group));
      group.addEventListener("pointerleave", hide);
      group.addEventListener("blur", hide);
    });
  };

  // ---------- Data check ----------
  const renderChecks = (result) => {
    const box = $("[data-checks]");
    box.replaceChildren();
    const list = el("ul", "cv-checks");
    const item = (ok, text) => {
      const li = el("li", ok ? "is-ok" : "is-open");
      li.append(el("span", "cv-check-mark", ok ? "✓" : "!"), el("span", null, text));
      list.append(li);
    };
    const shown = state.filterValue || state.from || state.to;
    item(result.skipped.length === 0, tx("{read} rows read, {used} counted, {skipped} left out{filtered}.", {
      read: int.format(result.read), used: int.format(result.used), skipped: int.format(result.skipped.length),
      filtered: shown ? tx(" (the rest is outside the filter)") : "",
    }));
    item(true, tx("Total in the chart: {total}. It is the sum of the counted rows, so nothing is added or lost.", { total: amountText(result.total) }));
    if (result.merged.length) item(true, result.merged.length === 1
      ? tx("“{cause}” was written in more than one way (upper or lower case, spaces, accents); the spellings are counted together.", { cause: result.merged[0].key })
      : tx("{n} causes were written in more than one way (upper or lower case, spaces, accents) and are counted together.", { n: result.merged.length }));
    box.append(list);
    if (result.skipped.length) {
      const reasons = { date: tx("no valid date"), count: tx("the count is not a number"), value: tx("the value is not a number") };
      const details = el("details", "pa-skipped");
      details.append(el("summary", null, tx("Show the rows left out")));
      const ul = el("ul");
      result.skipped.slice(0, 40).forEach((row) => ul.append(el("li", null, tx("Row {line}: {reason}{cell}", { line: row.line, reason: reasons[row.reason], cell: row.cell ? ` (“${String(row.cell).slice(0, 40)}”)` : "" }))));
      if (result.skipped.length > 40) ul.append(el("li", null, tx("… and {n} more.", { n: result.skipped.length - 40 })));
      details.append(ul);
      box.append(details);
    }
    const dismissed = new Set((state.dismissed || []).map((pair) => pair.join("\u0000")));
    const suggestions = result.suggestions.filter((pair) => !dismissed.has(pair.join("\u0000")));
    if (suggestions.length) {
      const wrap = el("div", "pa-suggestions");
      wrap.append(el("p", "kicker", tx("Same cause, different spelling?")));
      suggestions.forEach(([a, b]) => {
        const rowEl = el("div", "pa-suggestion");
        rowEl.append(el("span", null, `“${a}” + “${b}”`));
        const merge = el("button", "button-secondary", tx("Count as one"));
        merge.type = "button";
        merge.addEventListener("click", () => { state.merges.push([b, a]); save(); renderResults(); });
        const keep = el("button", "button-ghost", tx("Keep apart"));
        keep.type = "button";
        keep.addEventListener("click", () => { state.dismissed = [...(state.dismissed || []), [a, b]]; renderChecks(result); });
        rowEl.append(merge, keep);
        wrap.append(rowEl);
      });
      box.append(wrap);
    }
    if (state.merges.length) {
      const undo = el("button", "button-ghost", tx("Undo the merged spellings ({n})", { n: state.merges.length }));
      undo.type = "button";
      undo.addEventListener("click", () => { state.merges = []; save(); renderResults(); });
      box.append(undo);
    }
  };

  // ---------- Two periods ----------
  const renderCompare = () => {
    const section = $("[data-compare]");
    const body = $("[data-compare-body]");
    section.hidden = !(state.source && state.map.date >= 0);
    if (section.hidden) return;
    $("[data-split]").value = state.split;
    body.replaceChildren();
    if (!state.split) {
      body.append(el("p", "cv-hint", tx("Pick the date a change started (a new process, a training); the table shows each cause before and after it.")));
      return;
    }
    const cmp = compare(state.source, {
      map: state.map, measure: state.measure, merges: state.merges, filterValue: state.filterValue, from: state.from, to: state.to,
      notStated: data.notStated[lang] || data.notStated.en, parseNumber, parseDate,
    }, state.split);
    const wrap = el("div", "dl-table-wrap");
    wrap.tabIndex = 0;
    const table = el("table", "dl-table pa-table");
    const head = el("tr");
    [tx("Cause"), tx("Before {date}", { date: showDate(state.split) }), tx("From {date}", { date: showDate(state.split) }), tx("Change in share")].forEach((text) => head.append(el("th", null, text)));
    const thead = el("thead");
    thead.append(head);
    const tbody = el("tbody");
    cmp.rows.forEach((row) => {
      const change = (row.afterShare - row.beforeShare) * 100;
      const tr = el("tr");
      tr.append(
        el("td", null, row.key),
        el("td", "num", `${numberText(row.before)} · ${pct(row.beforeShare, 0)}`),
        el("td", "num", `${numberText(row.after)} · ${pct(row.afterShare, 0)}`),
        el("td", `num ${change <= -2 ? "is-better" : change >= 2 ? "is-worse" : ""}`, `${change > 0 ? "+" : change < 0 ? "−" : "±"}${num(Math.abs(change), 1)} ${tx("points")}`),
      );
      tbody.append(tr);
    });
    table.append(thead, tbody);
    wrap.append(table);
    body.append(el("p", "cv-hint", tx("Before: {a}. From the split date: {b}.", { a: amountText(cmp.before.total), b: amountText(cmp.after.total) })), wrap);
  };
  $("[data-split]").addEventListener("change", (event) => { state.split = parseDate(event.target.value); save(); renderCompare(); });

  // ---------- Export ----------
  const fileName = () => `pareto-${(state.source?.name || template().id).replace(/\.[a-z]+$/i, "").normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase() || "chart"}`;
  const exportSvg = () => {
    const svg = chart(lastBars, EXPORT_COLORS, { title: tx("Pareto chart: share of each cause and cumulative share"), line80: "80%", cumulative: tx("cumulative") });
    svg.setAttribute("xmlns", SVG);
    const [, , w, h] = svg.getAttribute("viewBox").split(" ").map(Number);
    svg.setAttribute("width", w);
    svg.setAttribute("height", h);
    svg.insertBefore(svgEl("rect", { x: 0, y: 0, width: w, height: h, fill: "#ffffff" }), svg.firstChild.nextSibling);
    return new XMLSerializer().serializeToString(svg);
  };
  const exportPng = () => {
    const text = exportSvg();
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width * 2;
      canvas.height = img.height * 2;
      const ctx = canvas.getContext("2d");
      ctx.scale(2, 2);
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => blob && download(`${fileName()}.png`, blob));
    };
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(text)}`;
  };
  const exportCsv = () => {
    const sep = lang === "en" ? "," : ";";
    const fmt = (n) => (lang === "en" ? String(Math.round(n * 1000) / 1000) : String(Math.round(n * 1000) / 1000).replace(".", ","));
    const lines = [[tx("Rank"), tx("Cause"), state.measure === "value" ? valueName() : tx("Count"), tx("Share %"), tx("Cumulative %"), tx("Class")].map((c) => csvCell(c, sep)).join(sep)];
    lastResult.items.forEach((item, i) => lines.push([String(i + 1), item.key, fmt(item.amount), fmt(item.share * 100), fmt(item.cumulative * 100), item.cls].map((c) => csvCell(c, sep)).join(sep)));
    download(`${fileName()}.csv`, `﻿${lines.join("\r\n")}\r\n`, "text/csv;charset=utf-8");
  };

  // ---------- Actions ----------
  const actions = {
    example: () => {
      const tpl = template();
      const ex = example(tpl, lang, data.exampleEnd);
      useTable(`${tx("Example")}: ${tpl.name[lang] || tpl.name.en}`, [ex.headers, ...ex.rows], { hasHeader: true, measure: tpl.measure === "value" ? "value" : "count" });
    },
    csv: () => {
      const tpl = template();
      const ex = example(tpl, lang, data.exampleEnd, 3);
      const sep = lang === "en" ? "," : ";";
      const date = (iso) => (lang === "en" ? iso : `${iso.slice(8, 10)}.${iso.slice(5, 7)}.${iso.slice(0, 4)}`);
      const lines = [ex.headers, ...ex.rows.map((row) => [date(row[0]), ...row.slice(1)])].map((row) => row.map((cell) => csvCell(cell, sep)).join(sep));
      download(`pareto-${tpl.id}.csv`, `﻿${lines.join("\r\n")}\r\n`, "text/csv;charset=utf-8");
      say(tx("Template saved. Open it in Excel, delete the three example rows and add one row per event."));
    },
    "copy-causes": async (node) => {
      const text = template().causes.map((cause) => cause[lang] || cause.en).join("\n");
      try { await navigator.clipboard.writeText(text); } catch { /* shown on the page */ }
      say(tx("Cause list copied. In Excel: Data › Data Validation › List, so everyone picks the same names."));
    },
    paste: () => {
      const text = $("[data-paste]").value;
      if (!text.trim()) { say(tx("Paste the cells first.")); return; }
      useTable(tx("Pasted data"), parseRows(text, { keepBlank: true }));
    },
    reset: () => {
      if (!window.confirm(tx("Remove the data from this page and start again?"))) return;
      Object.assign(state, blankState(), { template: state.template });
      save();
      say("");
      renderAll();
    },
  };
  app.addEventListener("click", (event) => {
    const node = event.target.closest("[data-act]");
    if (node && actions[node.dataset.act]) actions[node.dataset.act](node);
  });
  $("[data-file]").addEventListener("change", (event) => { importFile(event.target.files?.[0]); event.target.value = ""; });
  const drop = $("[data-drop]");
  ["dragenter", "dragover"].forEach((type) => drop.addEventListener(type, (event) => { event.preventDefault(); drop.classList.add("is-over"); }));
  ["dragleave", "drop"].forEach((type) => drop.addEventListener(type, () => drop.classList.remove("is-over")));
  drop.addEventListener("drop", (event) => { event.preventDefault(); importFile(event.dataTransfer?.files?.[0]); });


  const renderAll = () => {
    renderTemplate();
    renderMapping();
    renderResults();
  };

  if (handoff) {
    if (handoff.template && templates[handoff.template]) state.template = handoff.template;
    useTable(str(handoff.source) || tx("Data from another tool"), [handoff.headers, ...handoff.rows], {
      hasHeader: true, map: isObject(handoff.map) ? { category: -1, count: -1, value: -1, date: -1, filter: -1, ...handoff.map } : undefined,
      measure: handoff.measure, valueLabel: str(handoff.valueLabel),
    });
    say(tx("{name}: {n} rows taken over. Check the columns below.", { name: str(handoff.source), n: int.format(handoff.rows.length) }));
  } else {
    // A first visit opens on the example of the chosen template, so the chart is visible at once (its name says "Example").
  if (!state.source && read(data.storageKey, null) === null) actions.example();
  renderAll();
  }
})();
