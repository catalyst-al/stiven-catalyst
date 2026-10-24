// Import that remembers the columns. The logs read pasted rows in a fixed order of columns; an export from a PMS,
// a WMS or another tool rarely has that order. A textarea that declares its columns (data-columns, with
// data-column-labels for the people) gets a small panel when the first pasted row is a header in another order:
// one choice per column of the log, guessed from the names in English, German and Albanian. Before the page's own
// import runs, the rows are put into the log's order (tab-separated, header dropped), and the choice is kept per
// tool and header in localStorage "sc-import-maps", so the next paste of the same export is mapped by itself.
// A paste that already fits (no header, or a header in the log's order) is never touched.
(() => {
  const kit = window.ToolKit;
  if (!kit) return;
  const { tx, el, read, write, parseRows, parseDate, parseNumber, isObject, columnName } = kit;
  const STORE = "sc-import-maps";
  // How many header layouts a tool remembers; the oldest goes first.
  const KEEP = 20;
  // Below this a name is not taken for a column: a wrong guess is worse than "none".
  const THRESHOLD = 0.6;

  // The names exports give a column, by the key the partial declares. The page's own label (in its language) and
  // the key itself are added, so a key missing here still finds its own column. Written folded (lower case,
  // without accents), as fold() makes them.
  const ALIASES = {
    date: ["date", "day", "datum", "tag", "data", "dita", "shift date", "business date", "night of", "nacht vom"],
    shift: ["shift", "schicht", "turni", "turn", "nderrimi", "team"],
    stage: ["stage", "process step", "step", "station", "stufe", "prozessschritt", "prozessstufe", "faza", "hapi"],
    type: ["type", "category", "damage type", "error type", "exception type", "kind", "art", "typ", "kategorie", "schadensart", "fehlerart", "lloji", "kategoria"],
    cause: ["cause", "root cause", "ursache", "grundursache", "shkaku"],
    units: ["units", "count", "quantity", "qty", "number", "orders", "reservations", "pieces", "menge", "anzahl", "einheiten", "stuck", "auftrage", "reservierungen", "sasia", "numri", "njesi", "porosi", "rezervime"],
    cost: ["cost", "costs", "cost eur", "amount", "value", "kosten", "betrag", "wert", "kosto", "shuma", "vlera"],
    note: ["note", "notes", "comment", "comments", "remark", "remarks", "notiz", "notizen", "bemerkung", "kommentar", "shenim", "shenimi", "shenime", "koment"],
    route: ["route", "tour", "tour nr", "route id", "trip", "linja", "rruga", "itinerari"],
    planDep: ["planned departure", "scheduled departure", "plan departure", "departure planned", "geplante abfahrt", "soll abfahrt", "abfahrt soll", "abfahrt geplant", "nisja e planifikuar"],
    actDep: ["actual departure", "departure actual", "real departure", "tatsachliche abfahrt", "ist abfahrt", "abfahrt ist", "nisja reale", "nisja aktuale"],
    planArr: ["planned arrival", "scheduled arrival", "plan arrival", "arrival planned", "eta", "geplante ankunft", "soll ankunft", "ankunft soll", "ankunft geplant", "mberritja e planifikuar"],
    actArr: ["actual arrival", "arrival actual", "real arrival", "ata", "tatsachliche ankunft", "ist ankunft", "ankunft ist", "mberritja reale", "mberritja aktuale"],
    reason: ["reason", "delay reason", "reason if late", "grund", "verspatungsgrund", "arsyeja", "arsyeja e vonese"],
    area: ["area", "zone", "location", "place", "bereich", "zone", "ort", "zona", "vendi"],
    what: ["what happened", "description", "event", "incident", "was passiert ist", "beschreibung", "ereignis", "vorfall", "cfare ndodhi", "pershkrimi", "ngjarja"],
    severity: ["severity", "severity 1 4", "potential severity", "schweregrad", "schwere", "rendesia", "ashpersia"],
    action: ["action", "measure", "countermeasure", "massnahme", "veprimi", "masa"],
    owner: ["owner", "responsible", "who", "verantwortlich", "zustandig", "pergjegjesi"],
    done: ["done", "status", "closed", "done yes or no", "erledigt", "geschlossen", "kryer", "mbyllur"],
    equipment: ["equipment", "machine", "line", "asset", "anlage", "maschine", "linie", "pajisja", "makina"],
    planned: ["planned minutes", "planned time", "planned production time", "plan minutes", "geplante minuten", "planzeit", "geplante zeit", "minutat e planifikuara", "koha e planifikuar"],
    stops: ["stops", "downtime", "stop reasons", "stopps", "stillstande", "stillstand", "ndalesat", "ndalimet"],
    pieces: ["pieces", "output", "total count", "good and bad", "teile", "stuckzahl", "ausbringung", "copat", "prodhimi"],
    rejects: ["rejects", "scrap", "defects", "ausschuss", "skartet", "skarto"],
    startup: ["startup rejects", "start up rejects", "setup scrap", "anlaufausschuss", "skartet ne nisje"],
    available: ["rooms available", "available rooms", "available", "verfugbare zimmer", "zimmer verfugbar", "dhoma ne dispozicion"],
    sold: ["rooms sold", "sold rooms", "room nights", "occupied rooms", "verkaufte zimmer", "belegte zimmer", "dhoma te shitura"],
    roomRev: ["room revenue", "rooms revenue", "logis revenue", "logisumsatz", "zimmerumsatz", "logis", "te ardhurat nga dhomat"],
    otherRev: ["other revenue", "f b revenue", "extras", "sonstiger umsatz", "nebenumsatz", "te ardhura te tjera"],
    arrivals: ["arrivals", "check ins", "anreisen", "mberritje", "mberritjet"],
    departures: ["departures", "check outs", "abreisen", "largime", "largimet"],
    noShows: ["no shows", "no show", "noshows"],
    walkIns: ["walk ins", "walk in", "walkins"],
    ooo: ["rooms out of order", "out of order", "ooo", "zimmer ausser betrieb", "ausser betrieb", "dhoma jashte perdorimit", "jashte perdorimit"],
    complaints: ["complaints", "beschwerden", "reklamationen", "ankesa", "ankesat"],
    covers: ["breakfast covers", "breakfast", "covers", "fruhstucksgaste", "fruhstuck", "mengjese", "mengjesi"],
    complaintCause: ["complaint cause", "cause of complaint", "beschwerdeursache", "beschwerdegrund", "shkaku i ankeses"],
  };

  // Lower case, without accents and signs: "Tatsächliche Ankunft", "Room revenue €" and "mbërritja" compare by
  // their letters.
  const fold = (text) => String(text ?? "").toLowerCase().replace(/ß/g, "ss").normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ").trim();
  const bigrams = (text) => {
    const padded = ` ${text} `;
    const out = [];
    for (let i = 0; i < padded.length - 1; i++) out.push(padded.slice(i, i + 2));
    return out;
  };
  // Dice coefficient of letter pairs: "plan arrival" is close to "planned arrival", far from "planned departure".
  const dice = (a, b) => {
    const x = bigrams(a), y = bigrams(b);
    const counts = new Map();
    x.forEach((pair) => counts.set(pair, (counts.get(pair) || 0) + 1));
    let hits = 0;
    y.forEach((pair) => {
      const n = counts.get(pair);
      if (n) { hits++; counts.set(pair, n - 1); }
    });
    return (2 * hits) / (x.length + y.length);
  };
  // How alike a header and a name are, 0 to 1. Every word of one inside the other ("Room revenue €" and
  // "room revenue", "Tour Nr." and "tour") counts as close.
  const similarity = (header, name) => {
    const a = fold(header), b = fold(name);
    if (!a || !b) return 0;
    if (a === b) return 1;
    const wa = a.split(" "), wb = b.split(" ");
    const within = (outer, inner) => inner.every((word) => outer.includes(word));
    let score = dice(a, b);
    if (within(wa, wb) || within(wb, wa)) score = Math.max(score, 0.75 + (0.2 * Math.min(wa.length, wb.length)) / Math.max(wa.length, wb.length));
    return score;
  };
  const namesOf = (column) => [column.label, column.key, ...(ALIASES[column.key] || [])].filter(Boolean);

  // The best pasted column for each column of the log, or -1. Each pasted column feeds one column at most; the
  // surest pairs are taken first, and of equal ones the pair that keeps the column in its place.
  const guess = (headers, columns) => {
    const pairs = [];
    columns.forEach((column, j) => {
      const names = namesOf(column);
      headers.forEach((header, i) => {
        const score = Math.max(0, ...names.map((name) => similarity(header, name)));
        if (score >= THRESHOLD) pairs.push({ i, j, score });
      });
    });
    pairs.sort((a, b) => b.score - a.score || Math.abs(a.i - a.j) - Math.abs(b.i - b.j) || a.i - b.i);
    const mapping = columns.map(() => -1);
    const used = new Set();
    pairs.forEach(({ i, j }) => {
      if (mapping[j] >= 0 || used.has(i)) return;
      mapping[j] = i;
      used.add(i);
    });
    return mapping;
  };

  // A header is a first row of words only: no date and no number in it.
  const isHeader = (cells) => {
    const filled = (cells || []).filter((cell) => String(cell).trim());
    return filled.length >= 2 && filled.every((cell) => !parseDate(cell) && !Number.isFinite(parseNumber(cell)) && /\p{L}/u.test(cell));
  };
  // Each column where the log expects it, or not found: nothing to change.
  const inPlace = (mapping) => mapping.every((i, j) => i < 0 || i === j);
  const signature = (headers) => headers.map(fold).join("|");
  const valid = (mapping, columns, headers) => Array.isArray(mapping) && mapping.length === columns.length
    && mapping.every((i) => Number.isInteger(i) && i >= -1 && i < headers.length);

  // A cell that holds a tab, a line break or a quote is quoted, as parseRows reads it back.
  const cellText = (value) => {
    const text = String(value ?? "");
    return /[\t\r\n"]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };
  // The pasted rows in the log's order, tab-separated, without the header.
  const rewrite = (text, mapping) => parseRows(text).slice(1)
    .map((row) => mapping.map((i) => cellText(i >= 0 ? row[i] ?? "" : "")).join("\t"))
    .join("\n");

  // The remembered choices: { [toolKey]: { [headerSignature]: [indexes] } }.
  const memory = () => {
    const saved = read(STORE, {});
    return isObject(saved) ? saved : {};
  };
  const remembered = (tool, sig) => {
    const list = memory()[tool];
    return isObject(list) && Array.isArray(list[sig]) ? list[sig] : null;
  };
  const remember = (tool, sig, mapping) => {
    const all = memory();
    const list = isObject(all[tool]) ? { ...all[tool] } : {};
    delete list[sig];
    list[sig] = mapping.slice();
    const keys = Object.keys(list);
    keys.slice(0, Math.max(0, keys.length - KEEP)).forEach((key) => delete list[key]);
    all[tool] = list;
    write(STORE, all);
  };

  // The first row of a paste: a header sits on top, so a few thousand characters are enough to read it.
  const firstRow = (text) => parseRows(String(text ?? "").slice(0, 4000))[0] || [];
  // What to do with a paste: null when it is left as it is.
  const plan = (text, columns, tool) => {
    const headers = firstRow(text);
    if (!isHeader(headers)) return null;
    const sig = signature(headers);
    const saved = remembered(tool, sig);
    if (valid(saved, columns, headers)) return inPlace(saved) ? null : { headers, sig, mapping: saved.slice(), remembered: true };
    const mapping = guess(headers, columns);
    if (mapping.every((i) => i < 0) || inPlace(mapping)) return null;
    return { headers, sig, mapping, remembered: false };
  };

  const toolOf = (textarea) => textarea.dataset.importKey
    || (location.pathname.match(/\/tools\/([^/]+)/) || [])[1]
    || textarea.id || "import";
  const parseList = (text) => {
    try {
      const list = JSON.parse(text || "[]");
      return Array.isArray(list) ? list.map(String) : [];
    } catch {
      return [];
    }
  };

  let count = 0;
  const attach = (textarea) => {
    if (!textarea || textarea.dataset.importMapReady) return null;
    const keys = parseList(textarea.dataset.columns);
    if (!keys.length) return null;
    textarea.dataset.importMapReady = "1";
    const labels = parseList(textarea.dataset.columnLabels);
    const columns = keys.map((key, j) => ({ key, label: labels[j] || key }));
    const tool = toolOf(textarea);
    const id = `im-${++count}`;
    let current = null;

    const note = el("p", "form-note fc-map-note");
    note.hidden = true;
    note.setAttribute("aria-live", "polite");
    const change = el("button", "dl-undo", tx("change"));
    change.type = "button";
    note.append(`${tx("Mapped like last time")} · `, change);
    const panel = el("div", "fc-map");
    panel.hidden = true;
    panel.setAttribute("role", "group");
    panel.setAttribute("aria-labelledby", `${id}-title`);
    const title = el("p", "fc-map-title", tx("Match the columns"));
    title.id = `${id}-title`;
    const help = el("p", "form-note", tx("The first row is a header in another order. Choose which pasted column goes into each column of the log; the rows are put in order when you import them."));
    const grid = el("div", "fc-map-grid");
    panel.append(title, help, grid);
    (textarea.closest(".field") || textarea).after(note, panel);

    const hide = () => {
      current = null;
      note.hidden = true;
      panel.hidden = true;
      grid.replaceChildren();
    };
    const renderPanel = () => {
      grid.replaceChildren();
      columns.forEach((column, j) => {
        const field = el("div", "field");
        const label = el("label", null, column.label);
        label.htmlFor = `${id}-${j}`;
        const select = el("select");
        select.id = `${id}-${j}`;
        const none = el("option", null, tx("— none —"));
        none.value = "-1";
        select.append(none);
        current.headers.forEach((header, i) => {
          const option = el("option", null, `${columnName(i)} · ${header || "-"}`);
          option.value = String(i);
          select.append(option);
        });
        select.value = String(current.mapping[j]);
        select.addEventListener("change", () => { if (current) current.mapping[j] = Number(select.value); });
        field.append(label, select);
        grid.append(field);
      });
    };
    const analyse = () => {
      const next = plan(textarea.value, columns, tool);
      if (!next) { hide(); return; }
      // The same header again (more rows typed or pasted below it) keeps the choice already made.
      if (current && current.sig === next.sig) return;
      current = next;
      renderPanel();
      note.hidden = !current.remembered;
      panel.hidden = current.remembered;
    };
    let timer = null;
    textarea.addEventListener("input", () => {
      clearTimeout(timer);
      timer = setTimeout(analyse, 120);
    });
    change.addEventListener("click", () => {
      note.hidden = true;
      panel.hidden = false;
      grid.querySelector("select")?.focus();
    });

    // The page's import listens on the button; this runs first (capture on the paste box) and puts the rows in order.
    const box = textarea.closest(".dl-paste") || textarea.closest("form, details, section") || document;
    box.addEventListener("click", (event) => {
      if (!event.target.closest?.("[data-import]")) return;
      clearTimeout(timer);
      if (!current || current.sig !== signature(firstRow(textarea.value))) analyse();
      if (!current || current.mapping.every((i) => i < 0)) return;
      remember(tool, current.sig, current.mapping);
      textarea.value = rewrite(textarea.value, current.mapping);
      hide();
    }, true);
    analyse();
    return { analyse, columns, tool, get current() { return current; } };
  };

  const init = (root = document) => [...root.querySelectorAll("textarea[data-columns]")].map(attach).filter(Boolean);

  window.ImportMap = { STORE, THRESHOLD, ALIASES, fold, similarity, guess, isHeader, inPlace, signature, rewrite, plan, remembered, remember, attach, init };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => init());
  else init();
})();
