// Import that remembers the columns. The logs read pasted rows in a fixed order of columns; an export from a PMS,
// a WMS or another tool rarely has that order. A textarea that declares its columns (data-columns, with
// data-column-labels for the people) gets a small panel when the first pasted row is a header in another order:
// one choice per column of the log, guessed from the names in English, German and Albanian. Before the page's own
// import runs, the rows are put into the log's order (tab-separated, header dropped), and the choice is kept per
// tool and header in localStorage "sc-import-maps", so the next paste of the same export is mapped by itself.
// A paste that already fits (no header, or a header in the log's order) is never touched.
// Presets: the column names that exports of a kind of system typically use (a hotel PMS, a warehouse system, a route
// planner). They are generic names, not the layout of any one product's report: a header that matches more of one
// preset's names than of the others is "recognised as" that kind of export, and its names help the guess. The
// visitor can choose another preset or none, and map by hand; a remembered mapping still wins over any preset.
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
    room: ["room", "room number", "room no", "zimmer", "zimmernummer", "zimmer nr", "zi nr", "dhoma", "numri i dhomes", "nr i dhomes"],
    guest: ["guest", "guest name", "gast", "gastname", "name des gastes", "mysafiri", "emri i mysafirit"],
  };

  // The presets. `fields` adds names to the columns of the logs (by the keys the partials declare, and the fields
  // of Inventory ABC); `known` lists columns such exports often carry that no log takes (a rate code, a balance, a
  // delivery number): they help to recognise the export and are never guessed into a column that only looks alike
  // ("Arrival", the date of a booking, is not "arrivals", the count of a night). Written folded, as fold() makes them.
  const PRESETS = {
    hotel: {
      name: "Hotel PMS export (OPERA, protel, Mews …)",
      fields: {
        date: ["business date", "hotel date", "report date", "stay date", "created", "created at", "created on", "erstellt am", "angelegt am", "geschaftsdatum", "berichtsdatum", "funddatum", "gefunden am", "date found", "data e krijimit"],
        time: ["time", "zeit", "uhrzeit", "ora", "koha"],
        room: ["room", "room no", "room nr", "room number", "rm", "zimmer", "zimmernummer", "zimmer nr", "zi nr", "zi", "dhoma", "nr dhome", "numri i dhomes"],
        guest: ["guest", "guest name", "name", "last name", "surname", "gast", "gastname", "name des gastes", "nachname", "mysafiri", "emri i mysafirit", "klienti"],
        available: ["rooms available", "available rooms", "total rooms", "rooms in hotel", "zimmer gesamt", "verfugbare zimmer", "anzahl zimmer"],
        sold: ["rooms sold", "occupied rooms", "rooms occupied", "room nights", "belegte zimmer", "verkaufte zimmer", "zimmernachte"],
        roomRev: ["room revenue", "rooms revenue", "net room revenue", "accommodation revenue", "logis", "logisumsatz", "logis netto", "zimmerumsatz", "beherbergungsumsatz"],
        otherRev: ["other revenue", "f b revenue", "food and beverage revenue", "extras revenue", "f b umsatz", "nebenumsatz", "sonstiger umsatz"],
        arrivals: ["arrivals", "arrival rooms", "check ins", "anreisen", "mberritjet"],
        departures: ["departures", "departure rooms", "check outs", "abreisen", "largimet"],
        noShows: ["no shows", "no show", "no show rooms"],
        walkIns: ["walk ins", "walk in"],
        ooo: ["out of order", "ooo rooms", "rooms out of order", "ausser betrieb", "zimmer ausser betrieb"],
        covers: ["breakfast covers", "breakfast count", "fruhstuck", "fruhstucke", "anzahl fruhstuck"],
        what: ["description", "item", "item description", "object", "beschreibung", "gegenstand", "fundgegenstand", "fundsache", "complaint", "beschwerde", "pershkrimi", "sendi"],
        category: ["category", "kategorie", "kategoria"],
        status: ["status", "item status", "statusi"],
        channel: ["source", "channel", "via", "quelle", "kanal", "burimi", "kanali"],
        takenBy: ["taken by", "reported by", "created by", "user", "aufgenommen von", "erstellt von", "gemeldet von", "benutzer", "marre nga"],
        foundBy: ["found by", "finder", "gefunden von", "gjetur nga"],
        place: ["storage location", "stored in", "storage", "aufbewahrungsort", "aufbewahrung", "lagerort", "ruajtur ne", "vendi i ruajtjes"],
        tag: ["tag", "tag number", "tag no", "label", "etikett", "fundnummer", "etiketa"],
        area: ["area", "location", "department", "bereich", "abteilung", "ort", "fundort", "zona", "departamenti"],
        action: ["action taken", "resolution", "massnahme", "losung", "veprimi"],
        comp: ["compensation", "credit", "gutschrift", "kompensation", "kompensimi"],
        value: ["value", "amount", "wert", "betrag", "vlera", "shuma"],
        severity: ["severity", "priority", "prioritat", "schweregrad", "prioriteti"],
        note: ["comment", "comments", "remarks", "notes", "bemerkung", "bemerkungen", "kommentar", "notiz", "shenim", "koment"],
      },
      known: ["arrival", "arrival date", "departure", "departure date", "anreise", "anreisedatum", "abreise", "abreisedatum", "nights", "nachte", "rate code", "ratencode", "rate", "rate amount", "rate plan", "ratenplan", "balance", "saldo", "offener saldo", "confirmation number", "confirmation no", "bestatigungsnummer", "reservation number", "reservation no", "reservierungsnummer", "adults", "erwachsene", "children", "kinder", "room type", "zimmertyp", "zimmerkategorie", "company", "firma", "travel agent", "reiseburo", "market code", "marktsegment", "source code", "hk status", "fo status", "room status", "zimmerstatus", "payment method", "zahlungsart", "nationality", "nationalitat", "vip", "email", "phone", "telefon"],
    },
    warehouse: {
      name: "Warehouse export (SAP, WMS)",
      fields: {
        date: ["posting date", "document date", "created on", "delivery date", "goods issue date", "goods receipt date", "confirmation date", "buchungsdatum", "belegdatum", "angelegt am", "erstellt am", "lieferdatum", "warenausgangsdatum", "wa datum", "wareneingangsdatum", "we datum", "quittierungsdatum"],
        stage: ["process", "process step", "activity", "warehouse process type", "prozess", "prozessschritt", "tatigkeit", "lagerprozessart", "procesi"],
        type: ["exception code", "exception", "damage code", "error code", "error type", "ausnahmecode", "ausnahme", "schadenscode", "fehlercode", "fehlerart", "kodi i gabimit"],
        cause: ["reason for movement", "reason code", "reason", "bewegungsgrund", "grund", "grundcode", "arsyeja"],
        units: ["quantity", "qty", "delivery quantity", "actual quantity", "difference quantity", "damaged quantity", "menge", "liefermenge", "istmenge", "ist menge", "differenzmenge", "beschadigte menge", "sasia"],
        cost: ["value", "net value", "amount", "price", "wert", "nettowert", "betrag", "preis", "vlera"],
        note: ["item text", "text", "comment", "positionstext", "bemerkung", "kommentar", "shenim"],
        area: ["storage bin", "storage type", "storage section", "warehouse", "gate", "door", "dock", "lagerplatz", "lagertyp", "lagerbereich", "lager", "tor", "rampe", "magazina"],
        sku: ["material", "material number", "material no", "materialnummer", "artikelnummer", "sku", "artikulli"],
        name: ["material description", "product description", "materialkurztext", "materialbezeichnung", "produktbeschreibung", "bezeichnung", "pershkrimi"],
        unitCost: ["moving average price", "standard price", "price per unit", "gleitender durchschnittspreis", "standardpreis", "preis pro einheit"],
        lt: ["planned delivery time", "planned delivery time days", "planlieferzeit", "wiederbeschaffungszeit"],
        stock: ["unrestricted", "unrestricted use", "unrestricted use stock", "available quantity", "frei verwendbar", "frei verwendbarer bestand", "lagerbestand", "verfugbare menge", "stoku"],
        picks: ["pick lines", "picks", "number of picks", "anzahl picks", "pickpositionen"],
      },
      known: ["delivery", "delivery number", "outbound delivery", "inbound delivery", "lieferung", "liefernummer", "auslieferung", "anlieferung", "item", "position", "pos", "handling unit", "hu", "batch", "charge", "plant", "werk", "storage location", "lagerort", "warehouse number", "lagernummer", "unit of measure", "uom", "base unit of measure", "mengeneinheit", "basismengeneinheit", "me", "bme", "transfer order", "transportauftrag", "warehouse task", "lageraufgabe", "ship to party", "warenempfanger", "sold to party", "auftraggeber", "vendor", "supplier", "lieferant", "sales order", "kundenauftrag", "purchase order", "bestellung", "movement type", "bewegungsart", "weight", "gewicht"],
    },
    transport: {
      name: "Transport/route export (TMS)",
      fields: {
        date: ["tour date", "route date", "trip date", "transport date", "loading date", "shipping date", "delivery date", "tourdatum", "fahrtdatum", "transportdatum", "ladedatum", "versanddatum", "lieferdatum", "data e turit"],
        route: ["route", "route number", "route no", "route name", "route id", "tour", "tour nr", "tour number", "tournummer", "trip", "trip id", "fahrt", "fahrtnummer", "transport", "transportnummer", "linja", "rruga"],
        planDep: ["planned departure", "plan departure", "scheduled departure", "planned departure time", "planned start", "plan start", "etd", "std", "plan abfahrt", "planabfahrt", "soll abfahrt", "geplante abfahrt", "abfahrt plan", "geplanter start", "nisja e planifikuar", "nisja plan"],
        actDep: ["actual departure", "actual departure time", "actual start", "atd", "ist abfahrt", "istabfahrt", "tatsachliche abfahrt", "abfahrt ist", "ist start", "nisja reale", "nisja aktuale"],
        planArr: ["planned arrival", "plan arrival", "scheduled arrival", "planned arrival time", "planned end", "eta", "sta", "plan ankunft", "planankunft", "soll ankunft", "geplante ankunft", "ankunft plan", "plan ende", "mberritja e planifikuar"],
        actArr: ["actual arrival", "actual arrival time", "actual end", "ata", "ist ankunft", "istankunft", "tatsachliche ankunft", "ankunft ist", "ist ende", "mberritja reale", "mberritja aktuale"],
        reason: ["delay reason", "deviation reason", "reason code", "reason", "verspatungsgrund", "abweichungsgrund", "grund", "arsyeja e vonese", "arsyeja"],
        shift: ["shift", "wave", "schicht", "welle", "turni"],
        note: ["comment", "remarks", "driver note", "bemerkung", "kommentar", "fahrerbemerkung", "shenim"],
      },
      known: ["driver", "driver name", "fahrer", "vehicle", "fahrzeug", "truck", "lkw", "license plate", "kennzeichen", "carrier", "frachtfuhrer", "spediteur", "depot", "hub", "distance", "km", "entfernung", "origin", "start location", "startort", "destination", "ziel", "zielort", "stop", "stop number", "stopp", "stoppnummer", "pallets", "paletten", "shipment", "sendung", "customer", "kunde"],
    },
  };
  // A name that more than one preset uses ("comment", "lieferdatum") says nothing about which export it is.
  const SHARED = (() => {
    const seen = new Map();
    Object.values(PRESETS).forEach((preset) => {
      new Set([...Object.values(preset.fields).flat(), ...preset.known]).forEach((name) => seen.set(name, (seen.get(name) || 0) + 1));
    });
    return new Set([...seen].filter(([, n]) => n > 1).map(([name]) => name));
  })();
  const presetOf = (preset) => (typeof preset === "string" ? PRESETS[preset] : preset) || null;

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
  const namesOf = (column, preset = null) => [column.label, column.key, ...(ALIASES[column.key] || []), ...(presetOf(preset)?.fields[column.key] || [])].filter(Boolean);
  const best = (header, names) => Math.max(0, ...names.map((name) => similarity(header, name)));

  // Which preset a header row looks like, or "": the one with the most headers close to its own names (two at
  // least, and more than any other preset).
  const detect = (headers) => {
    const counts = Object.entries(PRESETS).map(([key, preset]) => {
      const names = [...Object.values(preset.fields).flat(), ...preset.known].filter((name) => !SHARED.has(name));
      return [key, (headers || []).filter((header) => best(header, names) >= 0.85).length];
    }).sort((a, b) => b[1] - a[1]);
    return counts[0][1] >= 2 && counts[0][1] > counts[1][1] ? counts[0][0] : "";
  };

  // The best pasted column for each column of the log, or -1. Each pasted column feeds one column at most; the
  // surest pairs are taken first, and of equal ones the pair that keeps the column in its place. With a preset, its
  // names count too, and a header that is closer to one of its known columns than to a log's column stays out.
  const guess = (headers, columns, preset = null) => {
    const chosen = presetOf(preset);
    const knownScore = headers.map((header) => (chosen ? best(header, chosen.known) : 0));
    const pairs = [];
    columns.forEach((column, j) => {
      const names = namesOf(column, chosen);
      headers.forEach((header, i) => {
        const score = best(header, names);
        if (score >= THRESHOLD && score >= knownScore[i]) pairs.push({ i, j, score });
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
  // preset: a key of PRESETS, "" for none, or undefined to take the one the header is recognised as.
  const plan = (text, columns, tool, preset) => {
    const headers = firstRow(text);
    if (!isHeader(headers)) return null;
    const sig = signature(headers);
    const detected = detect(headers);
    const chosen = preset === undefined ? detected : PRESETS[preset] ? preset : "";
    const saved = remembered(tool, sig);
    if (valid(saved, columns, headers)) return inPlace(saved) ? null : { headers, sig, mapping: saved.slice(), remembered: true, detected, preset: chosen };
    const mapping = guess(headers, columns, chosen);
    if (mapping.every((i) => i < 0) || inPlace(mapping)) return null;
    return { headers, sig, mapping, remembered: false, detected, preset: chosen };
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
    // Which kind of export the header was recognised as; another choice guesses again with its names.
    const presetRow = el("div", "fc-map-grid fc-map-preset");
    const presetField = el("div", "field");
    const presetLabel = el("label", null, tx("Recognised as"));
    presetLabel.htmlFor = `${id}-preset`;
    const presetSelect = el("select");
    presetSelect.id = `${id}-preset`;
    const noPreset = el("option", null, tx("No known export (column names only)"));
    noPreset.value = "";
    presetSelect.append(noPreset, ...Object.entries(PRESETS).map(([key, preset]) => {
      const option = el("option", null, tx(preset.name));
      option.value = key;
      return option;
    }));
    presetField.append(presetLabel, presetSelect);
    presetRow.append(presetField);
    const presetNote = el("p", "form-note", tx("Recognised from typical column names; check the mapping against your export."));
    const grid = el("div", "fc-map-grid");
    panel.append(title, help, presetRow, presetNote, grid);
    (textarea.closest(".field") || textarea).after(note, panel);

    const hide = () => {
      current = null;
      note.hidden = true;
      panel.hidden = true;
      grid.replaceChildren();
    };
    const renderPanel = () => {
      presetSelect.value = current.preset || "";
      presetNote.hidden = !current.preset;
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
    presetSelect.addEventListener("change", () => {
      if (!current) return;
      current.preset = PRESETS[presetSelect.value] ? presetSelect.value : "";
      current.mapping = guess(current.headers, columns, current.preset);
      renderPanel();
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

  window.ImportMap = { STORE, THRESHOLD, ALIASES, PRESETS, fold, similarity, detect, guess, isHeader, inPlace, signature, rewrite, plan, remembered, remember, attach, init };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => init());
  else init();
})();
