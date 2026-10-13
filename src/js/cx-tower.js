// Last-Mile CX Control Tower: customer outcome -> operational driver -> root
// cause -> verified action. Four tables (deliveries, routes, incidents,
// actions) come from CSV or Excel files, or from the example. Every KPI is
// computed here from single rows, so Perfect Delivery is an exact per-delivery
// check and never a product of separate rates. Nothing leaves the browser.
(() => {
  const TK = window.ToolKit;
  const P = window.Pareto;
  if (!TK || !P) return;
  const { tx, parseNumber, parseDate } = TK;
  const fold = P.fold;

  // ---------- The four tables ----------
  // kind: text, date, bin (0/1), num, time (date and time). Aliases cover the
  // usual English, German and Albanian headers; the canonical names are the
  // ones in the CSV templates.
  const TABLES = {
    deliveries: {
      key: (row) => row.Delivery_ID,
      signature: ["Delivery_ID", "On_Time", "Complete", "Damage_Free", "First_Attempt", "Perfect_Delivery"],
      columns: {
        Date: ["date", "datum", "data", "delivery date", "liefertag"],
        DSP: ["dsp", "delivery partner", "lieferpartner", "partner"],
        Shift: ["shift", "schicht", "turni", "wave", "welle"],
        Zone: ["zone", "zona", "area", "gebiet", "zustellgebiet"],
        Route_ID: ["route id", "route", "tour", "tour id", "rruga", "linja"],
        Driver_ID: ["driver id", "driver", "fahrer", "fahrer id", "shofer", "shoferi"],
        Delivery_ID: ["delivery id", "order id", "order", "auftrag", "auftragsnummer", "sendung", "porosia"],
        Delivered: ["delivered", "zugestellt", "dorezuar", "e dorezuar"],
        On_Time: ["on time", "puenktlich", "punktlich", "ne kohe", "rechtzeitig"],
        Complete: ["complete", "vollstaendig", "vollstandig", "komplet", "e plote"],
        Damage_Free: ["damage free", "undamaged", "schadenfrei", "ohne schaden", "pa deme"],
        Temp_Compliant: ["temp compliant", "temperature compliant", "cold chain", "kuehlkette", "kuhlkette", "zinxhiri i ftohte"],
        First_Attempt: ["first attempt", "erstzustellung", "erster versuch", "prova e pare", "ne tentativen e pare"],
        Notification_Eligible: ["notification eligible", "benachrichtigung noetig", "njoftim i nevojshem"],
        Customer_Notified: ["customer notified", "notified", "kunde benachrichtigt", "benachrichtigt", "klienti u njoftua"],
        Complaint: ["complaint", "beschwerde", "reklamation", "ankese", "ankesa"],
      },
      kinds: { Date: "date", Delivered: "bin", On_Time: "bin", Complete: "bin", Damage_Free: "bin", Temp_Compliant: "bin", First_Attempt: "bin", Notification_Eligible: "bin", Customer_Notified: "bin", Complaint: "bin" },
    },
    routes: {
      key: (row) => row.Route_ID && `${row.Date}|${row.Route_ID}`,
      signature: ["Loading_Time_Min", "Planned_Departure", "Actual_Departure", "Departure_Delay_Min", "Gate_Closed_Compliant", "Scan_Compliance_Pct"],
      columns: {
        Date: ["date", "datum", "data"],
        DSP: ["dsp", "delivery partner", "lieferpartner", "partner"],
        Shift: ["shift", "schicht", "turni", "wave", "welle"],
        Zone: ["zone", "zona", "area", "gebiet"],
        Route_ID: ["route id", "route", "tour", "tour id", "rruga", "linja"],
        Driver_ID: ["driver id", "driver", "fahrer", "fahrer id", "shofer"],
        Vehicle_ID: ["vehicle id", "vehicle", "fahrzeug", "automjeti"],
        Ramp_Gate: ["ramp gate", "gate", "rampe", "tor", "porta"],
        Planned_Deliveries: ["planned deliveries", "geplante stopps", "stopps geplant"],
        Actual_Deliveries: ["actual deliveries", "zugestellte stopps"],
        Loading_Time_Min: ["loading time min", "loading time", "loading minutes", "ladezeit", "ladezeit min", "koha e ngarkimit"],
        Planned_Departure: ["planned departure", "geplante abfahrt", "abfahrt geplant", "nisja e planifikuar"],
        Actual_Departure: ["actual departure", "tatsaechliche abfahrt", "abfahrt", "nisja reale"],
        Departure_Delay_Min: ["departure delay min", "departure delay", "abfahrtsverspaetung", "verspaetung abfahrt", "vonesa e nisjes"],
        Missing_Bag_Events: ["missing bag events", "missing bags", "fehlende taschen", "cante qe mungojne"],
        Scan_Compliance_Pct: ["scan compliance pct", "scan compliance", "scanquote", "scan quote"],
        Cold_Scan_Compliant: ["cold scan compliant", "cold scan", "kuehlscan", "kuhlscan"],
        Gate_Closed_Compliant: ["gate closed compliant", "gate closed", "tor geschlossen", "porta e mbyllur"],
        Black_Box_Lids_OK: ["black box lids ok", "lids ok", "deckel ok"],
        Safety_Vest_Compliant: ["safety vest compliant", "safety vest", "warnweste", "jelek"],
        Traffic_Direction_Compliant: ["traffic direction compliant", "traffic direction", "fahrtrichtung"],
        Yard_Speed_Breach: ["yard speed breach", "speed breach", "geschwindigkeit ueberschritten"],
      },
      kinds: { Date: "date", Planned_Deliveries: "num", Actual_Deliveries: "num", Loading_Time_Min: "num", Planned_Departure: "time", Actual_Departure: "time", Departure_Delay_Min: "num", Missing_Bag_Events: "num", Scan_Compliance_Pct: "share", Cold_Scan_Compliant: "bin", Gate_Closed_Compliant: "bin", Black_Box_Lids_OK: "bin", Safety_Vest_Compliant: "bin", Traffic_Direction_Compliant: "bin", Yard_Speed_Breach: "num" },
    },
    incidents: {
      key: (row) => row.Incident_ID,
      signature: ["Incident_ID", "Incident_Type", "Root_Cause_Category", "Department_Owner", "Severity", "Repeat_Flag"],
      columns: {
        Incident_ID: ["incident id", "incident", "vorfall id", "vorfall", "incidenti"],
        Date: ["date", "datum", "data"],
        DSP: ["dsp", "delivery partner", "lieferpartner", "partner"],
        Shift: ["shift", "schicht", "turni"],
        Zone: ["zone", "zona", "area", "gebiet"],
        Route_ID: ["route id", "route", "tour", "rruga", "linja"],
        Driver_ID: ["driver id", "driver", "fahrer", "shofer"],
        Delivery_ID: ["delivery id", "order id", "auftrag", "porosia"],
        Incident_Type: ["incident type", "type", "vorfallart", "art", "lloji"],
        Root_Cause_Category: ["root cause category", "root cause", "cause", "ursache", "grundursache", "shkaku", "shkaku rrenjesor"],
        Root_Cause_Detail: ["root cause detail", "detail", "details", "beschreibung", "pershkrimi"],
        Department_Owner: ["department owner", "owner", "department", "verantwortlich", "abteilung", "pergjegjes", "departamenti"],
        Severity: ["severity", "schwere", "prioritaet", "rendesia"],
        Customer_Impact: ["customer impact", "kundenauswirkung", "ndikimi te klienti"],
        Customer_Notified: ["customer notified", "kunde benachrichtigt"],
        Status: ["status", "statusi", "stand"],
        Repeat_Flag: ["repeat flag", "repeat", "wiederholung", "wiederholt", "perseritje"],
      },
      kinds: { Date: "date" },
    },
    actions: {
      key: (row) => row.Action_ID,
      signature: ["Action_ID", "Action", "Owner", "Deadline", "Verification_Status", "Verification_Metric"],
      columns: {
        Action_ID: ["action id", "massnahme id", "veprimi id"],
        Linked_Incident: ["linked incident", "incident", "vorfall"],
        Problem: ["problem", "problemi"],
        Evidence: ["evidence", "beleg", "nachweis", "evidenca"],
        Root_Cause: ["root cause", "cause", "ursache", "shkaku"],
        Action_Type: ["action type", "type", "art", "lloji"],
        Action: ["action", "massnahme", "veprimi"],
        Owner: ["owner", "verantwortlich", "pergjegjes"],
        Start_Date: ["start date", "start", "beginn", "fillimi"],
        Deadline: ["deadline", "due date", "frist", "termin", "afati"],
        Status: ["status", "statusi"],
        Verification_Metric: ["verification metric", "metric", "kennzahl", "treguesi"],
        Baseline: ["baseline", "ausgangswert", "vlera fillestare"],
        Target: ["target", "ziel", "objektivi"],
        Result: ["result", "ergebnis", "rezultati"],
        Verification_Status: ["verification status", "verification", "wirksamkeit", "verifikimi"],
        Notes: ["notes", "note", "notizen", "shenime"],
      },
      kinds: { Start_Date: "date", Deadline: "date" },
    },
  };
  const FIELDS = Object.fromEntries(Object.entries(TABLES).map(([name, table]) => [name, Object.keys(table.columns)]));

  // ---------- Reading cells ----------
  const YES = new Set(["1", "yes", "y", "true", "ja", "j", "po", "x", "ok", "wahr", "pass"]);
  const NO = new Set(["0", "no", "n", "false", "nein", "jo", "falsch", "fail"]);
  // 1, 0, null for an empty cell, NaN for anything else.
  const bin = (value) => {
    const f = fold(value);
    if (!f) return null;
    if (YES.has(f)) return 1;
    if (NO.has(f)) return 0;
    const n = parseNumber(value);
    return n === 1 || n === 0 ? n : NaN;
  };
  // Minutes since 1970 from "2026-08-31T07:57", "31.08.2026 07:57", an Excel
  // serial with a time fraction, a bare "07:57" on the row's date, or an Excel time
  // cell on its own (a fraction of a day, 0.33125 for 07:57; German pages read 0,33125).
  const minutes = (value, dayIso) => {
    const text = String(value ?? "").trim();
    if (!text) return null;
    let m = text.match(/^(\d{4}-\d{2}-\d{2})[T ](\d{1,2}):(\d{2})/) || text.match(/^(\d{1,2}[./]\d{1,2}[./]\d{2,4}) (\d{1,2}):(\d{2})/);
    if (m) {
      const day = parseDate(m[1]);
      return day ? Date.parse(`${day}T00:00:00Z`) / 6e4 + Number(m[2]) * 60 + Number(m[3]) : NaN;
    }
    m = text.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
    if (m) return dayIso ? Date.parse(`${dayIso}T00:00:00Z`) / 6e4 + Number(m[1]) * 60 + Number(m[2]) : NaN;
    if (/^\d{5}(?:[.,]\d+)?$/.test(text)) return Math.round((Number(text.replace(",", ".")) - 25569) * 1440);
    if (/^(?:0|0?[.,]\d+)$/.test(text)) return dayIso ? Date.parse(`${dayIso}T00:00:00Z`) / 6e4 + Math.round(Number(text.replace(",", ".")) * 1440) : NaN;
    return NaN;
  };

  // The header row: among the first 15 rows, the one naming most known columns of any table.
  const matchColumn = (header, aliases, canonical) => {
    const h = fold(header);
    return h && (h === fold(canonical) || aliases.includes(h));
  };
  const recognise = (rows) => {
    let best = null;
    rows.slice(0, 15).forEach((row, index) => {
      Object.entries(TABLES).forEach(([name, table]) => {
        const map = {};
        Object.entries(table.columns).forEach(([field, aliases]) => {
          const col = row.findIndex((cell, i) => !Object.values(map).includes(i) && matchColumn(cell, aliases, field));
          if (col >= 0) map[field] = col;
        });
        const hits = Object.keys(map).length;
        const marks = table.signature.filter((field) => field in map).length;
        const score = marks * 10 + hits;
        const anchor = name === "actions" ? "Action" in map : "Date" in map;
        if (anchor && marks >= 2 && hits >= 3 && (!best || score > best.score)) best = { name, map, headerRow: index, score };
      });
    });
    return best;
  };

  // Rows of one table to records, with the problems found on the way.
  const toRecords = (name, rows, map, headerRow) => {
    const table = TABLES[name];
    const issues = new Map();
    const note = (field, line, cell) => {
      const item = issues.get(field) || { field, count: 0, lines: [], cell };
      item.count += 1;
      if (item.lines.length < 5) item.lines.push(line);
      issues.set(field, item);
    };
    const records = [];
    rows.slice(headerRow + 1).forEach((row, index) => {
      if (!row.some((cell) => String(cell ?? "").trim())) return;
      const line = headerRow + index + 2;
      const record = {};
      FIELDS[name].forEach((field) => {
        const cell = map[field] >= 0 && map[field] !== undefined ? String(row[map[field]] ?? "").trim() : "";
        const kind = table.kinds[field] || "text";
        if (kind === "text") { record[field] = cell; return; }
        if (!cell) { record[field] = kind === "date" ? "" : null; return; }
        let value;
        if (kind === "date") value = parseDate(cell) || "";
        else if (kind === "bin") value = bin(cell);
        else if (kind === "time") value = minutes(cell, record.Date);
        else if (kind === "share") {
          const n = parseNumber(cell.replace("%", ""));
          value = Number.isFinite(n) ? (cell.includes("%") || n > 1 ? n / 100 : n) : NaN;
        } else value = parseNumber(cell);
        const bad = kind === "date" ? !value : Number.isNaN(value);
        if (bad) { note(field, line, cell); record[field] = kind === "date" ? "" : null; return; }
        record[field] = value;
      });
      if (name === "routes") {
        // A delay written in the file wins; otherwise it comes from the two departure times.
        // Bare times sit on the row's date, so a route planned at 23:50 that left at 00:10 is
        // twenty minutes late, not a day early.
        if (record.Departure_Delay_Min == null && record.Planned_Departure != null && record.Actual_Departure != null) {
          let delay = record.Actual_Departure - record.Planned_Departure;
          if (delay < -720) delay += 1440;
          record.Departure_Delay_Min = Math.max(0, delay);
        }
      }
      if (name !== "actions" && !record.Date) note("Date", line, "");
      records.push(record);
    });
    return { records, issues: [...issues.values()] };
  };

  // Everything readable in a set of sheets: [{ name, map, records, issues, sheet }], plus targets.
  const readSheets = (sheets) => {
    const found = [];
    const targetTables = [];
    sheets.forEach((sheet) => {
      if (sheet.hidden) return;
      const rows = sheet.rows.map((row) => row.map((cell) => String(cell ?? "")));
      // One of the four tables is read as that table, even when it has Metric and Target
      // columns (the action tracker has both). Any other "Metric | Target" table holds
      // targets, even when it also has an Owner column.
      const hit = recognise(rows);
      if (!hit) {
        const t = readTargets(rows);
        if (t) targetTables.push({ sheet: sheet.name, t });
        return;
      }
      const { records, issues } = toRecords(hit.name, rows, hit.map, hit.headerRow);
      found.push({ name: hit.name, sheet: sheet.name, map: hit.map, records, issues });
    });
    // One target table only: a sheet named for targets beats a KPI dictionary.
    targetTables.sort((a, b) => /target|ziel|objektiv/i.test(b.sheet) - /target|ziel|objektiv/i.test(a.sheet));
    return { found, targets: targetTables[0]?.t || null, targetSheet: targetTables[0]?.sheet || "" };
  };

  // A "Metric | Target" table (the TARGETS sheet of the workbook) to target values.
  const readTargets = (rows) => {
    const headerRow = rows.slice(0, 15).findIndex((row) => row.some((cell) => /^(metric|kpi|kennzahl|treguesi)$/.test(fold(cell))) && row.some((cell) => /^(target|ziel|objektivi)$/.test(fold(cell))));
    if (headerRow < 0) return null;
    const header = rows[headerRow].map(fold);
    const metricCol = header.findIndex((h) => /^(metric|kpi|kennzahl|treguesi)$/.test(h));
    const targetCol = header.findIndex((h) => /^(target|ziel|objektivi)$/.test(h));
    const out = {};
    rows.slice(headerRow + 1).forEach((row) => {
      const kpi = KPIS.find((k) => [k.label, ...k.aliases].some((name) => fold(name) === fold(row[metricCol])));
      if (!kpi) return;
      const raw = String(row[targetCol] ?? "").trim();
      out[kpi.id] = raw ? targetValue(kpi, raw) : null;
    });
    return Object.keys(out).length ? out : null;
  };
  // "98%", "0.98" and "98" all mean 98% for a rate; minutes and per-1,000 stay as written.
  const targetValue = (kpi, raw) => {
    const text = String(raw).replace(/[<>=≤≥\s]|min|‰/gi, "");
    const n = parseNumber(text.replace("%", ""));
    if (!Number.isFinite(n)) return null;
    if (kpi.unit !== "pct") return n;
    return text.includes("%") || n > 1 ? n / 100 : n;
  };

  // ---------- KPIs ----------
  const KPIS = [
    { id: "perfect", label: "Perfect Delivery Rate", aliases: ["Perfect Delivery"], unit: "pct", dir: "up", grain: "deliveries", def: "Deliveries that were on time, complete, undamaged, temperature-compliant and delivered at the first attempt, all at once." },
    { id: "onTime", label: "On-Time Delivery Rate", aliases: ["On-Time", "On time"], unit: "pct", dir: "up", grain: "deliveries", def: "Deliveries inside the promised window." },
    { id: "incomplete", label: "Incomplete Rate", aliases: ["Incomplete"], unit: "pct", dir: "down", grain: "deliveries", def: "Deliveries with a missing item or bag." },
    { id: "damage", label: "Damage Rate", aliases: ["Damage"], unit: "pct", dir: "down", grain: "deliveries", def: "Deliveries with damage the customer can see." },
    { id: "cold", label: "Cold-Chain Compliance", aliases: ["Cold chain"], unit: "pct", dir: "up", grain: "deliveries", def: "Chilled or frozen deliveries handled within temperature rules; deliveries without a value are not temperature-relevant." },
    { id: "first", label: "First-Attempt Rate", aliases: ["First-Attempt Delivery Rate", "First attempt"], unit: "pct", dir: "up", grain: "deliveries", def: "Deliveries that succeeded at the first attempt." },
    { id: "notification", label: "Proactive Notification Rate", aliases: ["Notification rate"], unit: "pct", dir: "up", grain: "deliveries", def: "Late or at-risk deliveries where the customer was told before the window was missed." },
    { id: "complaints", label: "Complaints / 1,000", aliases: ["Complaints per 1,000", "Complaints per 1000", "Complaints / 1000"], unit: "per1000", dir: "down", grain: "deliveries", def: "Customer complaints per 1,000 deliveries, so partners of different size can be compared." },
    { id: "loading", label: "Average Loading Time", aliases: ["Loading time", "Avg Loading Time"], unit: "min", dir: "down", grain: "routes", def: "Average minutes to load a route. Scanning and loading quality come before speed." },
    { id: "lateRoute", label: "Late Route Rate", aliases: ["Late routes"], unit: "pct", dir: "down", grain: "routes", def: "Routes that left later than the late limit set below." },
    { id: "gateClose", label: "Gate Close Compliance", aliases: ["Gate close"], unit: "pct", dir: "up", grain: "routes", def: "Routes where the gate was closed after loading." },
    { id: "coldScan", label: "Cold Scan Compliance", aliases: ["Cold scan"], unit: "pct", dir: "up", grain: "routes", def: "Routes where chilled and frozen bags were scanned inside the cooling area." },
  ];
  const KPI = Object.fromEntries(KPIS.map((kpi) => [kpi.id, kpi]));
  // No KPI has a target until the visitor approves one: the page never invents a threshold. The example station
  // comes with targets of its own, so it shows what a scored KPI looks like.
  const DEFAULT_TARGETS = { perfect: null, onTime: null, incomplete: null, damage: null, cold: null, first: null, notification: null, complaints: null, loading: null, lateRoute: null, gateClose: null, coldScan: null };
  const EXAMPLE_TARGETS = { ...DEFAULT_TARGETS, onTime: 0.98, incomplete: 0.008, damage: 0.008, loading: 20, gateClose: 1, coldScan: 1 };

  // A delivery is perfect when every recorded condition holds. A blank
  // temperature cell means the order had nothing chilled, so it passes.
  const PERFECT_FIELDS = ["On_Time", "Complete", "Damage_Free", "First_Attempt"];
  const isDelivered = (row) => row.Delivered !== 0;
  const perfectOf = (row, present) => {
    for (const field of PERFECT_FIELDS) {
      if (!present.has(field)) continue;
      if (row[field] == null) return null;
      if (row[field] !== 1) return 0;
    }
    if (present.has("Temp_Compliant") && row.Temp_Compliant === 0) return 0;
    return 1;
  };

  const share = (rows, test, base) => {
    let n = 0;
    let hit = 0;
    rows.forEach((row) => {
      if (!base(row)) return;
      n += 1;
      if (test(row)) hit += 1;
    });
    return { value: n ? hit / n : null, n, hit };
  };
  const has = (field) => (row) => row[field] != null;

  // present: the columns that exist in the deliveries table (a missing column
  // is left out of Perfect Delivery rather than counted as a failure).
  const computeKpis = (deliveries, routes, settings, present) => {
    const d = deliveries.filter(isDelivered);
    const out = {};
    const pdOk = PERFECT_FIELDS.some((field) => present.has(field));
    out.perfect = pdOk ? share(d, (row) => perfectOf(row, present) === 1, (row) => perfectOf(row, present) != null) : { value: null, n: 0 };
    out.onTime = share(d, (row) => row.On_Time === 1, has("On_Time"));
    out.incomplete = share(d, (row) => row.Complete === 0, has("Complete"));
    out.damage = share(d, (row) => row.Damage_Free === 0, has("Damage_Free"));
    out.cold = share(d, (row) => row.Temp_Compliant === 1, has("Temp_Compliant"));
    // A first attempt that failed is often an order that was not delivered: first attempt and complaints count every
    // order, delivered or not; the other delivery rates are per delivered order.
    out.first = share(deliveries, (row) => row.First_Attempt === 1, has("First_Attempt"));
    out.notification = share(d, (row) => row.Customer_Notified === 1, (row) => row.Notification_Eligible === 1 && row.Customer_Notified != null);
    const complaints = share(deliveries, (row) => row.Complaint === 1, has("Complaint"));
    out.complaints = { value: complaints.n ? complaints.hit / complaints.n * 1000 : null, n: complaints.n, hit: complaints.hit };
    const loads = routes.filter((row) => row.Loading_Time_Min != null);
    out.loading = { value: loads.length ? loads.reduce((sum, row) => sum + row.Loading_Time_Min, 0) / loads.length : null, n: loads.length };
    out.lateRoute = share(routes, (row) => row.Departure_Delay_Min > settings.lateMinutes, has("Departure_Delay_Min"));
    out.gateClose = share(routes, (row) => row.Gate_Closed_Compliant === 1, has("Gate_Closed_Compliant"));
    out.coldScan = share(routes, (row) => row.Cold_Scan_Compliant === 1, has("Cold_Scan_Compliant"));
    return out;
  };

  // On target, off target, or no target (null). A rate of exactly the target is on target.
  const judge = (kpi, value, target) => {
    if (value == null || target == null) return null;
    return kpi.dir === "up" ? value >= target - 1e-9 : value <= target + 1e-9;
  };

  // Weighted CX score per delivery, as in the workbook: 25 on time, 25 complete,
  // 20 undamaged, 15 temperature, 10 first attempt, 5 no complaint.
  const cxScore = (rows) => {
    const d = rows.filter(isDelivered);
    if (!d.length) return null;
    const flag = (value) => (value == null ? 1 : value);
    const total = d.reduce((sum, row) => sum + 25 * flag(row.On_Time) + 25 * flag(row.Complete) + 20 * flag(row.Damage_Free)
      + 15 * (row.Temp_Compliant === 0 ? 0 : 1) + 10 * flag(row.First_Attempt) + 5 * (row.Complaint === 1 ? 0 : 1), 0);
    return total / d.length;
  };

  // Route risk, as in the workbook: loading over target 25, leaving over 10 min
  // late 20, scan compliance under 98% 15, gate open 15, cold scan missed 10,
  // yard speed breach 10 each, missing bag 5 each; capped at 100.
  const routeRisk = (row, settings) => {
    const reasons = [];
    let score = 0;
    const add = (points, reason) => { score += points; reasons.push(reason); };
    if (row.Loading_Time_Min != null && settings.loadingTarget != null && row.Loading_Time_Min > settings.loadingTarget) add(25, ["loading", row.Loading_Time_Min]);
    if (row.Departure_Delay_Min > 10) add(20, ["late", row.Departure_Delay_Min]);
    if (row.Scan_Compliance_Pct != null && row.Scan_Compliance_Pct < 0.98) add(15, ["scan", row.Scan_Compliance_Pct]);
    if (row.Gate_Closed_Compliant === 0) add(15, ["gate"]);
    if (row.Cold_Scan_Compliant === 0) add(10, ["cold"]);
    if (row.Yard_Speed_Breach > 0) add(10 * row.Yard_Speed_Breach, ["speed", row.Yard_Speed_Breach]);
    if (row.Missing_Bag_Events > 0) add(5 * row.Missing_Bag_Events, ["bags", row.Missing_Bag_Events]);
    if (row.Safety_Vest_Compliant === 0) reasons.push(["vest"]);
    if (row.Traffic_Direction_Compliant === 0) reasons.push(["direction"]);
    if (row.Black_Box_Lids_OK === 0) reasons.push(["lids"]);
    score = Math.min(100, score);
    return { score, level: score >= 50 ? "critical" : score >= 25 ? "watch" : "normal", reasons };
  };

  // ISO week "2026-W39" and its Monday.
  const isoWeek = (iso) => {
    const date = new Date(`${iso}T00:00:00Z`);
    const day = (date.getUTCDay() + 6) % 7;
    date.setUTCDate(date.getUTCDate() - day + 3);
    const year = date.getUTCFullYear();
    const firstThursday = new Date(Date.UTC(year, 0, 4));
    const week = 1 + Math.round(((date - firstThursday) / 864e5 - 3 + ((firstThursday.getUTCDay() + 6) % 7)) / 7);
    return `${year}-W${String(week).padStart(2, "0")}`;
  };
  const weekMonday = (iso) => {
    const date = new Date(`${iso}T00:00:00Z`);
    date.setUTCDate(date.getUTCDate() - ((date.getUTCDay() + 6) % 7));
    return date.toISOString().slice(0, 10);
  };
  const addDays = (iso, days) => {
    const date = new Date(`${iso}T00:00:00Z`);
    date.setUTCDate(date.getUTCDate() + days);
    return date.toISOString().slice(0, 10);
  };

  // Canonical action states, whatever language the file used.
  const actionStatus = (value) => {
    const f = fold(value);
    if (/complet|done|closed|erledigt|abgeschlossen|fertig|perfunduar|mbyllur|kryer/.test(f)) return "Completed";
    if (/progress|arbeit|laufend|proces|ne punë|ne pune/.test(f)) return "In Progress";
    return "Open";
  };
  const verification = (value) => {
    const f = fold(value);
    if (/not effective|ineffective|nicht wirksam|unwirksam|jo efektiv/.test(f)) return "Not effective";
    if (/effective|wirksam|efektiv/.test(f)) return "Effective";
    return "Pending";
  };
  const incidentOpen = (row) => !/closed|geschlossen|erledigt|mbyllur|complet/.test(fold(row.Status));
  const isRepeat = (row) => YES.has(fold(row.Repeat_Flag));
  const severityRank = (value) => {
    const f = fold(value);
    return /critical|kritisch|kritik/.test(f) ? 3 : /high|hoch|larte/.test(f) ? 2 : /medium|mittel|mesatar/.test(f) ? 1 : 0;
  };

  // ---------- Example ----------
  // Four weeks of a station with five partners. The story in the numbers: one
  // partner loads slowly and loses bags, the late shift leaves late, damage from
  // stacking drops after an action in week three, and late customers are rarely told.
  const random = (seed) => {
    let s = seed >>> 0;
    return () => {
      s = (s + 0x6d2b79f5) >>> 0;
      let t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };
  const example = (end) => {
    const rand = random(20260927);
    const pick = (list) => list[Math.floor(rand() * list.length)];
    const dsps = ["DSP A", "DSP B", "DSP C", "DSP D", "DSP E"];
    const zones = ["North", "South", "East", "West", "Centre"];
    // Six regular drivers per partner and one new driver with few routes.
    const drivers = Object.fromEntries(dsps.map((dsp, i) => [dsp, Array.from({ length: 6 }, (_, j) => `D${String(i * 6 + j + 1).padStart(2, "0")}`)]));
    const driverFor = (dsp, i) => (rand() < 0.04 ? `D${31 + i}` : pick(drivers[dsp]));
    const start = addDays(end, -27);
    const deliveries = [];
    const routes = [];
    const incidents = [];
    let routeNo = 0;
    let deliveryNo = 0;
    const incident = (row, type, cause, owner, severity) => {
      incidents.push({
        Incident_ID: `INC${String(incidents.length + 1).padStart(5, "0")}`, Date: row.Date, DSP: row.DSP, Shift: row.Shift, Zone: row.Zone,
        Route_ID: row.Route_ID, Driver_ID: row.Driver_ID, Delivery_ID: row.Delivery_ID || "", Incident_Type: type, Root_Cause_Category: cause,
        Root_Cause_Detail: "", Department_Owner: owner, Severity: severity, Customer_Impact: type, Customer_Notified: "",
        Status: row.Date < addDays(end, -6) ? (rand() < 0.9 ? "Closed" : "In Progress") : pick(["Open", "In Progress", "Closed"]), Repeat_Flag: rand() < 0.1 ? "Yes" : "No",
      });
    };
    for (let day = 0; day < 28; day++) {
      const date = addDays(start, day);
      const weekday = new Date(`${date}T00:00:00Z`).getUTCDay();
      if (weekday === 0) continue;
      const afterAction = day >= 15;
      for (let r = 0; r < 8; r++) {
        routeNo += 1;
        const dsp = dsps[r % 5];
        const shift = r < 5 ? "AM" : "PM";
        const slow = dsp === "DSP C";
        const loading = Math.round((14 + rand() * 6 + (slow ? 5 + rand() * 4 : 0) + (shift === "PM" ? 1.5 : 0)) * 10) / 10;
        const delay = Math.max(0, Math.round((shift === "PM" ? rand() * 12 : rand() * 6) + (loading > 21 ? loading - 21 : 0) - 1));
        const planned = Date.parse(`${date}T00:00:00Z`) / 6e4 + (shift === "AM" ? 7 * 60 + 30 + r * 8 : 12 * 60 + 30 + r * 6);
        const route = {
          Date: date, DSP: dsp, Shift: shift, Zone: zones[(r + day) % 5], Route_ID: `R${String(routeNo).padStart(4, "0")}`, Driver_ID: driverFor(dsp, r % 5),
          Vehicle_ID: `V${String(1 + (routeNo % 12)).padStart(2, "0")}`, Ramp_Gate: String(1 + (routeNo % 13)), Planned_Deliveries: 0, Actual_Deliveries: 0,
          Loading_Time_Min: loading, Planned_Departure: planned, Actual_Departure: planned + delay, Departure_Delay_Min: delay,
          Missing_Bag_Events: slow && rand() < 0.35 ? 1 + Math.floor(rand() * 2) : rand() < 0.05 ? 1 : 0,
          Scan_Compliance_Pct: Math.round((slow ? 0.955 + rand() * 0.04 : 0.975 + rand() * 0.025) * 10000) / 10000,
          Cold_Scan_Compliant: rand() < (slow ? 0.9 : 0.98) ? 1 : 0, Gate_Closed_Compliant: rand() < 0.93 ? 1 : 0, Black_Box_Lids_OK: rand() < 0.97 ? 1 : 0,
          Safety_Vest_Compliant: rand() < 0.98 ? 1 : 0, Traffic_Direction_Compliant: rand() < 0.97 ? 1 : 0, Yard_Speed_Breach: rand() < 0.03 ? 1 : 0,
        };
        const stops = 30 + Math.floor(rand() * 12);
        route.Planned_Deliveries = stops;
        for (let s = 0; s < stops; s++) {
          deliveryNo += 1;
          const late = rand() < (shift === "PM" ? 0.035 : 0.012) + (delay > 10 ? 0.03 : 0);
          const missing = rand() < (slow ? 0.018 : 0.005) + (route.Missing_Bag_Events ? 0.01 : 0);
          const damaged = rand() < (afterAction ? 0.004 : 0.011);
          const chilled = rand() < 0.35;
          const warm = chilled && rand() < (route.Cold_Scan_Compliant ? 0.002 : 0.03);
          const firstFail = rand() < 0.02;
          const eligible = late || firstFail;
          const notified = eligible ? (rand() < 0.55 ? 1 : 0) : 0;
          const complaint = rand() < 0.002 + (late && !notified ? 0.12 : 0) + (missing ? 0.2 : 0) + (damaged ? 0.25 : 0);
          const row = {
            Date: date, DSP: dsp, Shift: shift, Zone: route.Zone, Route_ID: route.Route_ID, Driver_ID: route.Driver_ID, Delivery_ID: `DLV${String(deliveryNo).padStart(6, "0")}`,
            Delivered: 1, On_Time: late ? 0 : 1, Complete: missing ? 0 : 1, Damage_Free: damaged ? 0 : 1, Temp_Compliant: chilled ? (warm ? 0 : 1) : null,
            First_Attempt: firstFail ? 0 : 1, Notification_Eligible: eligible ? 1 : 0, Customer_Notified: notified, Complaint: complaint ? 1 : 0,
          };
          deliveries.push(row);
          if (late) incident(row, "Delay", delay > 10 ? "Late departure / loading" : pick(["Traffic / external", "Route planning / capacity", "Route planning / capacity"]), "Last Mile", "Low");
          if (missing) incident(row, "Incomplete", route.Missing_Bag_Events ? "Missing bag / scan gap" : "Warehouse preparation", route.Missing_Bag_Events ? "Shared LM/OB" : "Warehouse", "Medium");
          if (damaged) incident(row, "Damage", afterAction ? pick(["Packaging failure", "Loading sequence / stacking"]) : pick(["Loading sequence / stacking", "Loading sequence / stacking", "Packaging failure"]), "Quality", "Medium");
          if (warm) incident(row, "Temperature", "Cold-chain process", "DSP", "High");
          if (firstFail) incident(row, "Failed delivery", pick(["Customer unavailable / access", "Customer unavailable / access", "Wrong address / access code"]), "Customer Care", "Low");
          if (eligible && !notified && rand() < 0.4) incident(row, "Customer communication", "Communication failure", "Customer Care", "Low");
        }
        route.Actual_Deliveries = stops;
        routes.push(route);
        if (route.Gate_Closed_Compliant === 0 && rand() < 0.5) incident(route, "Safety", "Driver process non-compliance", "DSP", "Medium");
        if (route.Yard_Speed_Breach) incident(route, "Safety", "Driver process non-compliance", "DSP", "High");
      }
    }
    const actions = [
      { Action_ID: "ACT001", Linked_Incident: "", Problem: "Damage from stacking heavy bags on light ones", Evidence: "Damage incidents: loading sequence / stacking is the largest cause in weeks 1–2", Root_Cause: "No loading sequence standard for heavy items", Action_Type: "Corrective", Action: "Heavy-first loading sequence, marked shelf zones in vans, briefing at every ramp", Owner: "Shift Leader", Start_Date: addDays(start, 13), Deadline: addDays(start, 15), Status: "Completed", Verification_Metric: "Damage Rate", Baseline: "1.1%", Target: "<=0.8%", Result: "0.4%", Verification_Status: "Effective", Notes: "" },
      { Action_ID: "ACT002", Linked_Incident: "", Problem: "DSP C routes load 6 minutes slower and lose bags", Evidence: "Average loading and missing-bag events by partner", Root_Cause: "Scanners fetched from the office; bags staged after the driver arrives", Action_Type: "Corrective", Action: "Keep scanners at the ramp, pre-stage bags per route before arrival", Owner: "DSP C Lead", Start_Date: addDays(start, 20), Deadline: addDays(end, -2), Status: "In Progress", Verification_Metric: "Average Loading Time", Baseline: "24 min", Target: "<=20 min", Result: "", Verification_Status: "Pending", Notes: "" },
      { Action_ID: "ACT003", Linked_Incident: "", Problem: "Customers are not told before their window is missed", Evidence: "Proactive notification rate about 55%", Root_Cause: "Notification depends on the driver remembering to call", Action_Type: "Preventive", Action: "Automatic delay message when ETA moves past the window", Owner: "Customer Care", Start_Date: addDays(start, 22), Deadline: addDays(end, 10), Status: "Open", Verification_Metric: "Proactive Notification Rate", Baseline: "55%", Target: "", Result: "", Verification_Status: "Pending", Notes: "Target to be agreed" },
      { Action_ID: "ACT004", Linked_Incident: "", Problem: "Gates left open after loading", Evidence: "Gate close compliance about 93%", Root_Cause: "Closing the gate is not part of the release check", Action_Type: "Containment", Action: "Add gate check to the release sign-off; Shift Leader walk at each wave", Owner: "Shift Leader", Start_Date: addDays(start, 8), Deadline: addDays(start, 12), Status: "Completed", Verification_Metric: "Gate Close Compliance", Baseline: "93%", Target: "100%", Result: "", Verification_Status: "Pending", Notes: "Result not yet measured" },
      { Action_ID: "ACT005", Linked_Incident: "", Problem: "PM wave leaves late", Evidence: "Late route rate AM vs PM", Root_Cause: "PM volume arrives from the warehouse after the planned loading start", Action_Type: "Corrective", Action: "Agree a PM cut-off with outbound; move two routes to the AM wave", Owner: "Station Manager", Start_Date: addDays(start, 18), Deadline: addDays(end, -4), Status: "Open", Verification_Metric: "Late Route Rate", Baseline: "", Target: "", Result: "", Verification_Status: "Pending", Notes: "" },
    ];
    return { deliveries, routes, incidents, actions };
  };

  // ---------- Deep dive ----------
  // One failure to investigate at a time. Each metric names the rows it can judge (its grain and the
  // column that must hold a valid outcome), what counts as a failure, which incident types record the
  // same kind of failure (matched on the folded type, without accents, in English, German or Albanian), and the KPI
  // whose approved target bounds its failure rate ("inverse": the KPI is a success rate, so the failure
  // maximum is one minus the target). A row without a valid outcome is left out, never counted as a
  // success or a failure.
  const DEEP = [
    { id: "late", label: "Late deliveries", grain: "deliveries", field: "On_Time", fail: 0, kpi: "onTime", inverse: true, incident: /delay|\blate\b|verspat|vones/ },
    { id: "incomplete", label: "Incomplete deliveries", grain: "deliveries", field: "Complete", fail: 0, kpi: "incomplete", incident: /incomplete|unvollst|fehlend|paplot|mungon/ },
    { id: "damage", label: "Damaged deliveries", grain: "deliveries", field: "Damage_Free", fail: 0, kpi: "damage", incident: /damage|schaden|beschad|\bdem/ },
    { id: "temperature", label: "Temperature failures", grain: "deliveries", field: "Temp_Compliant", fail: 0, kpi: "cold", inverse: true, incident: /temperat|cold chain|kuhl|ftoht/ },
    { id: "firstAttempt", label: "Failed first attempts", grain: "deliveries", field: "First_Attempt", fail: 0, kpi: "first", inverse: true, incident: /failed deliver|first attempt|not delivered|fehlversuch|nicht zugestellt|erstzustell|deshtuar|tentativ/ },
    { id: "notification", label: "Late deliveries without a message", grain: "deliveries", kpi: "notification", inverse: true, incident: /communicat|notif|benachricht|kommunikat|njoftim|komunikim/ },
    { id: "complaint", label: "Customer complaints", grain: "deliveries", field: "Complaint", fail: 1, kpi: null, incident: null },
    { id: "imperfect", label: "Deliveries that were not perfect", grain: "deliveries", kpi: "perfect", inverse: true, incident: null },
    { id: "loading", label: "Routes loading over target", grain: "routes", field: "Loading_Time_Min", over: (settings) => (settings.loadingTarget == null ? 20 : settings.loadingTarget), kpi: null, incident: /loading|ladung|belad|ngarkim/ },
    { id: "departure", label: "Routes leaving late", grain: "routes", field: "Departure_Delay_Min", over: (settings) => settings.lateMinutes, kpi: "lateRoute", incident: /delay|\blate\b|departure|abfahrt|verspat|nisj|vones/ },
    { id: "missingBags", label: "Routes with missing bags", grain: "routes", field: "Missing_Bag_Events", over: () => 0, kpi: null, incident: /incomplete|missing bag|\bbag|tasche|\bcant|paplot|mungon/ },
    { id: "gate", label: "Gate left open", grain: "routes", field: "Gate_Closed_Compliant", fail: 0, kpi: "gateClose", inverse: true, incident: /\bgate|\btor\b|\bport/ },
    { id: "coldScan", label: "Cold scan missed", grain: "routes", field: "Cold_Scan_Compliant", fail: 0, kpi: "coldScan", inverse: true, incident: /cold scan|kuhlscan|temperat|skanim/ },
    { id: "safety", label: "Routes with a safety deviation", grain: "routes", fields: ["Yard_Speed_Breach", "Safety_Vest_Compliant", "Traffic_Direction_Compliant"], kpi: null, incident: /safety|sicherheit|siguri/ },
  ];
  const DEEP_DIMS = { deliveries: ["DSP", "Shift", "Zone", "Week", "Driver_ID", "Route_ID"], routes: ["DSP", "Shift", "Zone", "Week", "Driver_ID", "Route_ID", "Ramp_Gate", "Vehicle_ID"] };
  // The deep-dive failures that count every order, delivered or not (as their KPIs do).
  const EVERY_ORDER = new Set(["firstAttempt", "complaint"]);
  // 1 failed, 0 passed, null when the row has no valid outcome for this metric.
  const deepOutcome = (metric, row, settings, present) => {
    if (metric.grain === "deliveries" && !isDelivered(row) && !EVERY_ORDER.has(metric.id)) return null;
    if (metric.id === "imperfect") {
      const p = perfectOf(row, present);
      return p == null ? null : p === 1 ? 0 : 1;
    }
    if (metric.id === "notification") {
      if (row.Notification_Eligible !== 1 || row.Customer_Notified == null) return null;
      return row.Customer_Notified === 1 ? 0 : 1;
    }
    if (metric.id === "safety") {
      if (metric.fields.every((field) => row[field] == null)) return null;
      return row.Yard_Speed_Breach > 0 || row.Safety_Vest_Compliant === 0 || row.Traffic_Direction_Compliant === 0 ? 1 : 0;
    }
    const value = row[metric.field];
    if (value == null) return null;
    if (metric.over) return value > metric.over(settings) ? 1 : 0;
    return value === metric.fail ? 1 : 0;
  };
  // The eligible rows, the affected ones among them, and the rate: numerator over its own denominator.
  const deepAggregate = (rows, metric, settings, present) => {
    const eligible = [];
    const affected = [];
    rows.forEach((row) => {
      const outcome = deepOutcome(metric, row, settings, present);
      if (outcome == null) return;
      eligible.push(row);
      if (outcome === 1) affected.push(row);
    });
    const hit = new Set(affected);
    return { eligible, affected, hit, excluded: rows.length - eligible.length, n: eligible.length, k: affected.length, rate: eligible.length ? affected.length / eligible.length : null };
  };
  const segmentOf = (row, dim) => (dim === "Week" ? (row.Date ? isoWeek(row.Date) : "") : String(row[dim] ?? ""));
  // Where the failures sit: per value of a dimension, its cases, eligible rows, rate and share of all
  // cases. The difference against the rest is only given when both sides reach the sample floor.
  const deepSegments = (agg, dim, minN) => {
    const map = new Map();
    agg.eligible.forEach((row) => {
      const key = segmentOf(row, dim);
      const seg = map.get(key) || { key, n: 0, k: 0 };
      seg.n += 1;
      if (agg.hit.has(row)) seg.k += 1;
      map.set(key, seg);
    });
    return [...map.values()].map((seg) => {
      const restN = agg.n - seg.n;
      const restK = agg.k - seg.k;
      const comparable = seg.n >= minN && restN >= minN;
      return { ...seg, rate: seg.n ? seg.k / seg.n : null, share: agg.k ? seg.k / agg.k : 0, low: seg.n < minN, vsRest: comparable ? seg.k / seg.n - restK / restN : null };
    }).sort((a, b) => b.k - a.k || b.n - a.n || a.key.localeCompare(b.key, undefined, { numeric: true }));
  };
  // The rate per ISO week: each week's cases over that week's eligible rows, never an average of days.
  const deepWeekly = (agg) => {
    const map = new Map();
    agg.eligible.forEach((row) => {
      if (!row.Date) return;
      const week = isoWeek(row.Date);
      const point = map.get(week) || { week, n: 0, k: 0 };
      point.n += 1;
      if (agg.hit.has(row)) point.k += 1;
      map.set(week, point);
    });
    return [...map.values()].sort((a, b) => a.week.localeCompare(b.week)).map((point) => ({ ...point, rate: point.k / point.n }));
  };
  // The window of equal length just before the period, for a like-for-like comparison.
  const priorWindow = (from, to) => {
    if (!from || !to || to < from) return null;
    const days = Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 864e5) + 1;
    if (!(days > 0) || days > 3660) return null;
    return { from: addDays(from, -days), to: addDays(from, -1), days };
  };
  // The incidents that record this kind of failure, and how many of them name one of the affected rows.
  const deepKey = (metric, row) => (metric.grain === "routes" ? (row.Route_ID ? `${row.Date}|${row.Route_ID}` : "") : String(row.Delivery_ID || ""));
  const deepIncidents = (incidents, metric, affected) => {
    const records = metric.incident ? incidents.filter((row) => metric.incident.test(fold(row.Incident_Type))) : incidents;
    const keys = new Set(affected.map((row) => deepKey(metric, row)).filter(Boolean));
    const linked = records.filter((row) => keys.has(deepKey(metric, row))).length;
    return { records, linked, typed: Boolean(metric.incident) };
  };
  // The investigation case: evidence first, a cause that stays a hypothesis until verified, then the
  // actions, an owner, a deadline and the check that it worked.
  const CASE_FIELDS = ["title", "status", "problem", "evidence", "where", "rootStatus", "why1", "why2", "why3", "why4", "why5", "root", "containment", "corrective", "preventive", "owner", "deadline", "verifyMetric", "verifyResult"];
  const CASE_STATUS = ["Open", "Investigating", "Verification pending", "Verified effective", "Reopened"];
  const ROOT_STATUS = ["Hypothesis", "Verified"];
  const text = (value) => String(value ?? "").trim();
  // What stops a case from being saved: "title" when it has none, "verified" when it is marked
  // verified effective without a verified root cause, written evidence, a cause and a verification result.
  const caseCheck = (draft) => {
    const errors = [];
    if (!text(draft.title)) errors.push("title");
    if (draft.status === "Verified effective" && (draft.rootStatus !== "Verified" || !text(draft.evidence) || !text(draft.root) || !text(draft.verifyResult))) errors.push("verified");
    return errors;
  };
  // An action can be created from a case once it names an action, an owner and a deadline.
  const caseAction = (draft) => text(draft.corrective) || text(draft.containment) || text(draft.preventive);
  const capaReady = (draft) => Boolean(caseAction(draft) && text(draft.owner) && text(draft.deadline));
  // The action a case becomes, as a row of the action tracker.
  // words: the page's texts for "working hypothesis" and "investigation", in its language.
  const caseToAction = (draft, id, start, caseId, words = {}) => ({
    Action_ID: id, Linked_Incident: "", Problem: text(draft.problem) || text(draft.title), Evidence: text(draft.evidence),
    Root_Cause: draft.rootStatus === "Verified" ? text(draft.root) : `${words.hypothesis || "Working hypothesis, not verified"}: ${text(draft.root) || "–"}`,
    Action_Type: text(draft.corrective) ? "Corrective" : text(draft.containment) ? "Containment" : "Preventive", Action: caseAction(draft),
    Owner: text(draft.owner), Start_Date: start, Deadline: text(draft.deadline), Status: "Open", Verification_Metric: text(draft.verifyMetric), Baseline: "", Target: "", Result: "", Verification_Status: "Pending",
    Notes: `${words.investigation || "Investigation"} ${caseId}`,
  });

  window.CxTower = { TABLES, FIELDS, KPIS, DEFAULT_TARGETS, EXAMPLE_TARGETS, isDelivered, bin, minutes, recognise, toRecords, readSheets, readTargets, targetValue, computeKpis, perfectOf, judge, cxScore, routeRisk, isoWeek, weekMonday, addDays, actionStatus, verification, incidentOpen, isRepeat, severityRank, example,
    DEEP, DEEP_DIMS, deepOutcome, deepAggregate, deepSegments, deepWeekly, priorWindow, deepIncidents, deepKey, CASE_FIELDS, CASE_STATUS, ROOT_STATUS, caseCheck, capaReady, caseToAction };
})();

// ======================================================================
// The page.
(() => {
  const app = document.querySelector("[data-cx]");
  const dataEl = document.getElementById("cx-data");
  if (!app || !dataEl || !window.ToolKit || !window.CxTower || !window.Pareto) return;
  const C = window.CxTower;
  const P = window.Pareto;
  const { LANG, tx, el, num, pct, int, lower, parseDate, parseRows, showDate, read, write, isObject, stat, panel, barList, copy, flash, downloadCsv, firstVisit } = window.ToolKit;
  const cfg = JSON.parse(dataEl.textContent);
  const NAMES = ["deliveries", "routes", "incidents", "actions"];
  const TABLE_LABEL = { deliveries: tx("Deliveries"), routes: tx("Routes"), incidents: tx("Incidents"), actions: tx("Actions") };
  const TABS = [
    ["overview", tx("Overview")], ["operations", tx("Operations")], ["deep", tx("Deep dive")], ["scorecards", tx("Scorecards")], ["causes", tx("Root causes")],
    ["actions", tx("Actions")], ["review", tx("Weekly review")], ["data", tx("Data & targets")],
  ];
  const $ = (selector) => app.querySelector(selector);
  const note = $("[data-cx-note]");
  const say = (text) => { note.textContent = text; };

  // ---------- State ----------
  const blank = () => ({
    deliveries: [], routes: [], incidents: [], actions: [],
    columns: { deliveries: [], routes: [], incidents: [], actions: [] },
    sources: {}, issues: {}, targets: { ...C.DEFAULT_TARGETS },
    settings: { lateMinutes: 5, minSample: 50 },
    filters: { from: "", to: "", DSP: "", Shift: "", Zone: "" },
    tab: "overview", week: "", groupBy: "Root_Cause_Category", typeFilter: "", example: false,
    // The deep dive: which failure, broken down by what, the sample floor, the comparison and the
    // clicked segment; the saved investigations, the one open in the form and the form's draft.
    deep: { metric: "incomplete", dim: "DSP", minN: 50, compare: true, segment: "" },
    cases: [], caseId: "", draft: {},
  });
  // Saved and loaded values keep the kinds of their columns, so damaged storage never breaks the page.
  const cleanValue = (name, field, value) => {
    const kind = C.TABLES[name].kinds[field] || "text";
    if (kind === "text") return value == null ? "" : String(value);
    if (kind === "date") return parseDate(String(value ?? "")) || "";
    if (kind === "bin") return value === 1 || value === 0 ? value : null;
    return typeof value === "number" && Number.isFinite(value) ? value : null;
  };
  const state = (() => {
    const base = blank();
    const saved = read(cfg.storageKey, null);
    if (!isObject(saved)) return base;
    NAMES.forEach((name) => {
      const table = saved.tables?.[name];
      if (!isObject(table) || !Array.isArray(table.fields) || !Array.isArray(table.rows)) return;
      const fields = table.fields.filter((field) => C.FIELDS[name].includes(field));
      base[name] = table.rows.filter(Array.isArray).map((row) => Object.fromEntries(C.FIELDS[name].map((field) => {
        const at = table.fields.indexOf(field);
        return [field, cleanValue(name, field, at >= 0 ? row[at] : null)];
      })));
      base.columns[name] = fields;
    });
    if (isObject(saved.sources)) NAMES.forEach((name) => { if (typeof saved.sources[name] === "string") base.sources[name] = saved.sources[name]; });
    if (isObject(saved.targets)) C.KPIS.forEach((kpi) => { const v = saved.targets[kpi.id]; base.targets[kpi.id] = typeof v === "number" && Number.isFinite(v) ? v : v === null ? null : base.targets[kpi.id]; });
    if (isObject(saved.settings)) {
      const late = saved.settings.lateMinutes;
      const min = saved.settings.minSample;
      if (Number.isFinite(late) && late >= 0) base.settings.lateMinutes = late;
      if (Number.isInteger(min) && min >= 1) base.settings.minSample = min;
    }
    if (isObject(saved.filters)) Object.keys(base.filters).forEach((key) => { if (typeof saved.filters[key] === "string") base.filters[key] = saved.filters[key]; });
    if (TABS.some(([id]) => id === saved.tab)) base.tab = saved.tab;
    ["week", "groupBy", "typeFilter"].forEach((key) => { if (typeof saved[key] === "string") base[key] = saved[key]; });
    if (!["Root_Cause_Category", "Incident_Type", "Department_Owner", "DSP", "Zone", "Shift"].includes(base.groupBy)) base.groupBy = "Root_Cause_Category";
    base.example = saved.example === true;
    if (isObject(saved.deep)) {
      const d = saved.deep;
      if (C.DEEP.some((m) => m.id === d.metric)) base.deep.metric = d.metric;
      if (typeof d.dim === "string") base.deep.dim = d.dim;
      if (Number.isInteger(d.minN) && d.minN >= 1) base.deep.minN = d.minN;
      if (typeof d.compare === "boolean") base.deep.compare = d.compare;
      if (typeof d.segment === "string") base.deep.segment = d.segment;
    }
    const textOf = (value) => (typeof value === "string" ? value : "");
    if (Array.isArray(saved.cases)) {
      base.cases = saved.cases.filter((item) => isObject(item) && typeof item.id === "string" && item.id).map((item) => ({
        id: item.id, updated: textOf(item.updated), ...Object.fromEntries(C.CASE_FIELDS.map((field) => [field, textOf(item[field])])), actionId: textOf(item.actionId),
        snapshot: isObject(item.snapshot) ? Object.fromEntries(Object.entries(item.snapshot).filter(([, v]) => typeof v === "string" || typeof v === "number")) : {},
      }));
    }
    if (typeof saved.caseId === "string" && base.cases.some((item) => item.id === saved.caseId)) base.caseId = saved.caseId;
    if (isObject(saved.draft)) base.draft = Object.fromEntries(C.CASE_FIELDS.filter((field) => typeof saved.draft[field] === "string").map((field) => [field, saved.draft[field]]));
    return base;
  })();

  const persist = () => {
    const tables = Object.fromEntries(NAMES.map((name) => {
      const fields = C.FIELDS[name];
      return [name, { fields, rows: state[name].map((row) => fields.map((field) => row[field])) }];
    }));
    write(cfg.storageKey, { v: 1, tables, sources: state.sources, targets: state.targets, settings: state.settings, filters: state.filters, tab: state.tab, week: state.week, groupBy: state.groupBy, typeFilter: state.typeFilter, example: state.example, deep: state.deep, cases: state.cases, caseId: state.caseId, draft: state.draft });
  };
  let saveTimer = null;
  const save = () => {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => { saveTimer = null; persist(); }, 300);
  };
  // A change still waiting is written before the page goes away.
  window.addEventListener("pagehide", () => { if (saveTimer) { clearTimeout(saveTimer); saveTimer = null; persist(); } });

  const hasData = () => NAMES.some((name) => state[name].length);
  const present = () => new Set(state.columns.deliveries.length ? state.columns.deliveries : C.FIELDS.deliveries);

  // ---------- Filtered view ----------
  let cache = null;
  const invalidate = () => { cache = null; };
  const inDims = (row) => ["DSP", "Shift", "Zone"].every((key) => !state.filters[key] || row[key] === state.filters[key]);
  const inDates = (row) => (!state.filters.from || (row.Date && row.Date >= state.filters.from)) && (!state.filters.to || (row.Date && row.Date <= state.filters.to));
  const view = () => {
    if (cache) return cache;
    const keep = (row) => inDims(row) && inDates(row);
    const dates = [...state.deliveries, ...state.routes, ...state.incidents].map((row) => row.Date).filter(Boolean).sort();
    cache = {
      d: state.deliveries.filter(keep), r: state.routes.filter(keep), i: state.incidents.filter(keep),
      first: dates[0] || "", last: dates[dates.length - 1] || "",
    };
    cache.asOf = cache.last || window.ToolKit.today();
    return cache;
  };
  const settingsFor = () => ({ ...state.settings, loadingTarget: state.targets.loading });
  const kpisOf = (d, r) => C.computeKpis(d, r, state.settings, present());

  // ---------- Formatting ----------
  // Small rates and rates near 100% need two decimals to show a difference; 0 and 100% need none.
  const rateDigits = (v) => (v === 0 || v === 1 ? 0 : v < 0.1 || v > 0.99 ? 2 : 1);
  const fmt = (kpi, v) => {
    if (v == null) return "–";
    if (kpi.unit === "pct") return pct(v, rateDigits(v));
    if (kpi.unit === "min") return `${num(v, 1)} min`;
    return num(v, 1);
  };
  // Targets are shown as entered: 98%, 0.8%, 20 min.
  const fmtTarget = (kpi, t) => {
    const digits = [0, 1, 2].find((d) => Math.abs(Math.round(t * 100 * 10 ** d) - t * 100 * 10 ** d) < 1e-6) ?? 2;
    if (kpi.unit === "pct") return pct(t, digits);
    return kpi.unit === "min" ? `${num(t, t % 1 ? 1 : 0)} min` : num(t, t % 1 ? 1 : 0);
  };
  const targetText = (kpi, t = state.targets[kpi.id]) => (t == null ? tx("No target set") : `${tx("Target")} ${kpi.dir === "up" ? "≥" : "≤"} ${fmtTarget(kpi, t)}`);
  const badge = (ok) => {
    if (ok == null) return el("span", "cx-status is-none", tx("No target"));
    return el("span", `cx-status ${ok ? "is-good" : "is-bad"}`, ok ? `✓ ${tx("On target")}` : `✗ ${tx("Off target")}`);
  };
  const label = (kpi) => tx(kpi.label);
  const grainWord = (kpi, n) => (kpi.grain === "routes" ? tx("{n} routes", { n: int.format(n) }) : kpi.id === "notification" ? tx("{n} late or at-risk deliveries", { n: int.format(n) }) : kpi.id === "cold" ? tx("{n} chilled or frozen deliveries", { n: int.format(n) }) : tx("{n} deliveries", { n: int.format(n) }));
  const cell = (tag, text, className) => el(tag, className, text);
  const table = (headers, rows, className = "") => {
    const wrap = el("div", "dl-table-wrap cx-table-wrap");
    wrap.tabIndex = 0;
    const t = el("table", `dl-table cx-table ${className}`);
    const head = el("tr");
    headers.forEach((h) => head.append(el("th", typeof h === "object" ? h.className : null, typeof h === "object" ? h.text : h)));
    const thead = el("thead");
    thead.append(head);
    const tbody = el("tbody");
    rows.forEach((row) => tbody.append(row));
    t.append(thead, tbody);
    wrap.append(t);
    return wrap;
  };
  const numCell = (text, off) => {
    const td = el("td", `num${off ? " is-off" : ""}`, text);
    if (off) td.append(el("span", "visually-hidden", ` (${tx("off target")})`));
    return td;
  };
  const groupBy = (rows, key) => {
    const map = new Map();
    rows.forEach((row) => {
      const k = row[key] || tx("Not stated");
      if (!map.has(k)) map.set(k, []);
      map.get(k).push(row);
    });
    return map;
  };
  const sortKeys = (keys) => [...keys].sort((a, b) => String(a).localeCompare(String(b), undefined, { numeric: true }));

  // ---------- Import ----------
  const MAX_FILE = 40e6;
  const importFiles = async (files) => {
    const list = [...(files || [])];
    if (!list.length) return;
    const replace = $("[data-cx-mode]")?.value !== "merge";
    const report = [];
    let got = 0;
    for (const file of list) {
      try {
        if (file.size > MAX_FILE) { report.push(tx("{name}: larger than 40 MB.", { name: file.name })); continue; }
        say(tx("Reading {name}…", { name: file.name }));
        let sheets;
        if (/\.xlsx$/i.test(file.name)) sheets = await P.readWorkbook(await file.arrayBuffer(), window.CvImport.unzip, LANG !== "en");
        else if (/\.xls$/i.test(file.name)) { report.push(tx("{name}: old Excel files (.xls) cannot be read. Save as .xlsx or CSV.", { name: file.name })); continue; }
        else sheets = [{ name: file.name, hidden: false, rows: parseRows(P.decode(await file.arrayBuffer()), { keepBlank: true }) }];
        const { found, targets, targetSheet } = C.readSheets(sheets);
        if (!found.length && !targets) { report.push(tx("{name}: no known table found. Check the column names against the templates.", { name: file.name })); continue; }
        found.forEach((part) => {
          const records = part.name === "actions" ? part.records.filter((row) => row.Action || row.Problem).map(normaliseAction) : part.records;
          const source = /\.xlsx$/i.test(file.name) ? `${file.name} · ${part.sheet}` : file.name;
          const keyOf = C.TABLES[part.name].key;
          if (replace || state.example) {
            state[part.name] = records;
          } else {
            const byKey = new Map(state[part.name].map((row, i) => [keyOf(row) || `#${i}`, row]));
            records.forEach((row, i) => byKey.set(keyOf(row) || `new${i}`, row));
            state[part.name] = [...byKey.values()];
          }
          state.columns[part.name] = C.FIELDS[part.name].filter((field) => field in part.map);
          state.sources[part.name] = source;
          state.issues[part.name] = part.issues;
          report.push(tx(records.length === 1 ? "{table}: {n} row from {source}." : "{table}: {n} rows from {source}.", { table: TABLE_LABEL[part.name], n: int.format(records.length), source }));
          got += 1;
        });
        if (targets) {
          Object.assign(state.targets, targets);
          report.push(tx("Targets taken from {sheet}.", { sheet: targetSheet || file.name }));
        }
      } catch {
        report.push(tx("{name} could not be read. Save it as CSV or .xlsx and try again.", { name: file.name }));
      }
    }
    if (got && state.example) {
      // Tables not in the files would still hold the example: clear them.
      NAMES.forEach((name) => { if (!state.sources[name] || state.sources[name] === tx("Example")) { state[name] = []; state.columns[name] = []; delete state.sources[name]; } });
      state.example = false;
    }
    say(report.join(" "));
    state.filters = { from: "", to: "", DSP: "", Shift: "", Zone: "" };
    state.week = "";
    invalidate();
    save();
    render();
  };
  const normaliseAction = (row) => ({ ...row, Status: C.actionStatus(row.Status), Verification_Status: C.verification(row.Verification_Status) });

  // The example in memory only; loadExample also writes it, once the visitor asks for it.
  const showExample = () => {
    const ex = C.example(cfg.exampleEnd);
    NAMES.forEach((name) => {
      state[name] = ex[name];
      state.columns[name] = [...C.FIELDS[name]];
      state.sources[name] = tx("Example");
      state.issues[name] = [];
    });
    state.targets = { ...C.EXAMPLE_TARGETS };
    state.filters = { from: "", to: "", DSP: "", Shift: "", Zone: "" };
    state.week = "";
    state.example = true;
    if (state.tab === "data") state.tab = "overview";
    say(tx("Example loaded: four weeks of a delivery station with five partners. Replace it with your files in Data & targets."));
    invalidate();
  };
  const loadExample = () => {
    showExample();
    save();
    render();
  };

  // ---------- Filters and tabs ----------
  const filterBar = $("[data-cx-filters]");
  const tabList = $("[data-cx-tabs]");
  const body = $("[data-cx-body]");
  const renderFilters = () => {
    filterBar.hidden = !hasData();
    if (!hasData()) return;
    const all = [...state.deliveries, ...state.routes, ...state.incidents];
    ["DSP", "Shift", "Zone"].forEach((key) => {
      const select = filterBar.querySelector(`[data-cx-filter="${key}"]`);
      const values = sortKeys(new Set(all.map((row) => row[key]).filter(Boolean)));
      const any = el("option", null, tx("All"));
      any.value = "";
      select.replaceChildren(any, ...values.map((value) => { const o = el("option", null, value); o.value = value; return o; }));
      select.value = values.includes(state.filters[key]) ? state.filters[key] : "";
      state.filters[key] = select.value;
    });
    const { first, last } = view();
    ["from", "to"].forEach((key) => {
      const input = filterBar.querySelector(`[data-cx-filter="${key}"]`);
      input.min = first;
      input.max = last;
      input.value = state.filters[key];
    });
  };
  filterBar.addEventListener("change", (event) => {
    const key = event.target.dataset.cxFilter;
    if (!key) return;
    state.filters[key] = key === "from" || key === "to" ? parseDate(event.target.value) : event.target.value;
    invalidate();
    save();
    renderPanel();
  });
  $("[data-cx-reset-filters]").addEventListener("click", () => {
    state.filters = { from: "", to: "", DSP: "", Shift: "", Zone: "" };
    invalidate();
    save();
    render();
  });
  const renderTabs = () => {
    tabList.replaceChildren(...TABS.map(([id, text]) => {
      const button = el("button", "cx-tab", text);
      button.type = "button";
      button.id = `cx-tab-${id}`;
      button.setAttribute("role", "tab");
      button.setAttribute("aria-controls", "cx-panel");
      button.setAttribute("aria-selected", String(state.tab === id));
      button.tabIndex = state.tab === id ? 0 : -1;
      button.dataset.tab = id;
      return button;
    }));
  };
  tabList.addEventListener("click", (event) => {
    const id = event.target.closest("[data-tab]")?.dataset.tab;
    if (!id || id === state.tab) return;
    state.tab = id;
    save();
    renderTabs();
    renderPanel();
  });
  tabList.addEventListener("keydown", (event) => {
    const ids = TABS.map(([id]) => id);
    const at = ids.indexOf(state.tab);
    const next = event.key === "ArrowRight" ? ids[(at + 1) % ids.length] : event.key === "ArrowLeft" ? ids[(at - 1 + ids.length) % ids.length] : event.key === "Home" ? ids[0] : event.key === "End" ? ids[ids.length - 1] : null;
    if (!next) return;
    event.preventDefault();
    state.tab = next;
    save();
    renderTabs();
    renderPanel();
    tabList.querySelector(`[data-tab="${next}"]`).focus();
  });
  // The deep dive on one failure, from a KPI tile or the root causes.
  const openDeep = (metricId) => {
    state.deep.metric = metricId;
    state.deep.segment = "";
    goTo("deep");
  };
  const goTo = (id) => {
    state.tab = id;
    save();
    renderTabs();
    renderPanel();
    body.scrollIntoView?.({ behavior: "smooth", block: "start" });
  };

  // ---------- Charts ----------
  // A small line chart per KPI (one axis each), with the target as a dashed line.
  const SVG = "http://www.w3.org/2000/svg";
  const svgEl = (tag, attrs = {}, text) => {
    const node = document.createElementNS(SVG, tag);
    Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const miniChart = (kpi, points, target) => {
    const W = 340;
    const H = 170;
    const left = 52;
    const right = 14;
    const top = 16;
    const bottom = 28;
    const values = points.map((p) => p.value).filter((v) => v != null);
    const figure = el("figure", "cx-mini");
    const caption = el("figcaption");
    caption.append(el("strong", null, label(kpi)), el("span", null, targetText(kpi, target)));
    figure.append(caption);
    if (!values.length) { figure.append(el("p", "dl-panel-note", tx("No data in these weeks."))); return figure; }
    let lo = Math.min(...values, ...(target != null ? [target] : []));
    let hi = Math.max(...values, ...(target != null ? [target] : []));
    if (hi - lo < 1e-9) { lo -= kpi.unit === "pct" ? 0.01 : 1; hi += kpi.unit === "pct" ? 0.01 : 1; }
    const padV = (hi - lo) * 0.15;
    lo -= padV;
    hi += padV;
    if (kpi.unit === "pct") { lo = Math.max(0, lo); hi = Math.min(1, hi); }
    if (kpi.unit !== "pct") lo = Math.max(0, lo);
    const x = (i) => left + (points.length === 1 ? (W - left - right) / 2 : (i * (W - left - right)) / (points.length - 1));
    const y = (v) => top + (1 - (v - lo) / (hi - lo)) * (H - top - bottom);
    const svg = svgEl("svg", { viewBox: `0 0 ${W} ${H}`, class: "cx-mini-chart", role: "img", "aria-label": `${label(kpi)}: ${points.map((p) => `${p.week} ${fmt(kpi, p.value)}`).join(", ")}` });
    [lo, (lo + hi) / 2, hi].forEach((v) => {
      svg.append(svgEl("line", { x1: left, x2: W - right, y1: y(v), y2: y(v), style: "stroke: var(--cx-grid)", "stroke-width": 1 }));
      svg.append(svgEl("text", { x: left - 6, y: y(v) + 4, "text-anchor": "end", "font-size": 11, style: "fill: var(--cx-muted)" }, fmt(kpi, v).replace(" min", "")));
    });
    if (target != null && target >= lo && target <= hi) {
      svg.append(svgEl("line", { x1: left, x2: W - right, y1: y(target), y2: y(target), style: "stroke: var(--cx-target)", "stroke-width": 1.5, "stroke-dasharray": "5 4" }));
    }
    const path = points.map((p, i) => (p.value == null ? null : `${x(i)},${y(p.value)}`)).filter(Boolean);
    if (path.length > 1) svg.append(svgEl("polyline", { points: path.join(" "), fill: "none", style: "stroke: var(--cx-line)", "stroke-width": 2, "stroke-linejoin": "round" }));
    const step = points.length > 8 ? Math.ceil(points.length / 6) : 1;
    points.forEach((p, i) => {
      if (i % step === 0 || i === points.length - 1) svg.append(svgEl("text", { x: x(i), y: H - 8, "text-anchor": "middle", "font-size": 11, style: "fill: var(--cx-muted)" }, p.week.slice(5)));
      if (p.value == null) return;
      const ok = C.judge(kpi, p.value, target);
      const dot = svgEl("circle", { cx: x(i), cy: y(p.value), r: 4.5, style: `fill: ${ok === false ? "var(--cx-surface)" : "var(--cx-line)"}; stroke: var(--cx-line)`, "stroke-width": 2, tabindex: 0 });
      dot.append(svgEl("title", {}, `${p.week}: ${fmt(kpi, p.value)} · ${grainWord(kpi, p.n)}${ok === false ? ` · ${tx("off target")}` : ""}`));
      svg.append(dot);
    });
    const lastPoint = [...points].reverse().find((p) => p.value != null);
    if (lastPoint) {
      const i = points.lastIndexOf(lastPoint);
      svg.append(svgEl("text", { x: Math.min(x(i), W - right), y: y(lastPoint.value) - 9, "text-anchor": "end", "font-size": 12, "font-weight": 700, style: "fill: var(--cx-text)" }, fmt(kpi, lastPoint.value)));
    }
    figure.append(svg);
    return figure;
  };

  // The root-cause Pareto uses the chart of the Pareto tool.
  const paretoColors = () => Object.fromEntries(["vital", "rest", "line", "grid", "text", "muted", "surface"].map((key) => [key, `var(--pa-${key})`]));
  const paretoFigure = (result, measureWord) => {
    const figure = el("figure", "pa-figure cx-pareto");
    const bars = result.items.slice(0, 15).map((item) => ({
      key: item.key, share: item.share, cumulative: item.cumulative, vital: item.cls === "A" && !P.isOther(item.key),
      amountText: `${int.format(item.amount)} ${measureWord}`, shareText: pct(item.share, 1), cumulativeText: pct(item.cumulative, 1),
    }));
    const svg = P.chart(bars, paretoColors(), { title: tx("Pareto chart: share of each cause and cumulative share"), line80: "80%", cumulative: tx("cumulative") });
    const scroller = el("div", "pa-chart-scroll");
    scroller.tabIndex = 0;
    scroller.setAttribute("role", "group");
    scroller.setAttribute("aria-label", tx("Pareto chart: share of each cause and cumulative share"));
    scroller.append(svg);
    const tip = el("div", "pa-tooltip");
    tip.hidden = true;
    figure.append(scroller, tip);
    const show = (group) => {
      const bar = bars[Number(group.dataset.index)];
      if (!bar) return;
      tip.replaceChildren(el("strong", null, bar.amountText), el("span", null, bar.key), el("span", null, `${tx("Share of the total")}: ${bar.shareText} · ${tx("Cumulative")}: ${bar.cumulativeText}`));
      tip.hidden = false;
      const box = group.getBoundingClientRect();
      const frame = figure.getBoundingClientRect();
      tip.style.left = `${Math.min(Math.max(box.left + box.width / 2 - frame.left, 90), frame.width - 90)}px`;
      tip.style.top = `${Math.max(0, box.top - frame.top + 10)}px`;
    };
    svg.addEventListener("pointerover", (event) => { const g = event.target.closest(".pa-bar-group"); if (g) show(g); });
    svg.addEventListener("pointerleave", () => { tip.hidden = true; });
    svg.addEventListener("focusin", (event) => { const g = event.target.closest(".pa-bar-group"); if (g) show(g); });
    svg.addEventListener("focusout", () => { tip.hidden = true; });
    const legend = el("figcaption", "pa-legend");
    [["pa-key-vital", tx("Vital few (A)")], ["pa-key-rest", tx("Other causes")], ["pa-key-line", tx("Cumulative share")], ["pa-key-80", tx("80% line")]].forEach(([cls, text]) => {
      const item = el("span", "pa-legend-item");
      item.append(el("i", cls), el("span", null, text));
      legend.append(item);
    });
    figure.append(legend);
    return figure;
  };

  // ---------- Shared pieces ----------
  const weeksOf = (rows) => sortKeys(new Set(rows.map((row) => row.Date && C.isoWeek(row.Date)).filter(Boolean)));
  const byWeek = (rows) => {
    const map = new Map();
    rows.forEach((row) => {
      if (!row.Date) return;
      const w = C.isoWeek(row.Date);
      if (!map.has(w)) map.set(w, []);
      map.get(w).push(row);
    });
    return map;
  };
  const causeAnalysis = (incidents, key) => P.analyse({ rows: incidents.map((row) => [row[key] || ""]) }, {
    map: { category: 0, count: -1, value: -1, date: -1, filter: -1 }, measure: "count", notStated: tx("Not stated"), parseNumber: () => NaN, parseDate: () => "",
  });
  const overdue = (action, asOf) => action.Status !== "Completed" && action.Deadline && action.Deadline < asOf;
  const actionCounts = (asOf) => {
    const a = state.actions;
    return {
      total: a.length,
      open: a.filter((x) => x.Status === "Open").length,
      progress: a.filter((x) => x.Status === "In Progress").length,
      done: a.filter((x) => x.Status === "Completed").length,
      overdue: a.filter((x) => overdue(x, asOf)).length,
      unverified: a.filter((x) => x.Status === "Completed" && x.Verification_Status === "Pending").length,
      failed: a.filter((x) => x.Verification_Status === "Not effective").length,
    };
  };
  const emptyPanel = (text) => {
    const box = el("div", "cx-empty");
    box.append(el("p", null, text));
    const buttons = el("div", "tool-actions");
    const example = el("button", "button-primary", tx("Load the example"));
    example.type = "button";
    example.addEventListener("click", loadExample);
    const data = el("button", "button-secondary", tx("Import your files"));
    data.type = "button";
    data.addEventListener("click", () => goTo("data"));
    buttons.append(example, data);
    box.append(buttons);
    return box;
  };
  const section = (title, noteText) => {
    const box = panel(title, noteText);
    box.classList.add("cx-panel");
    return box;
  };

  // ---------- Overview ----------
  const renderOverview = () => {
    const { d, r, i, asOf } = view();
    if (!d.length && !r.length && !i.length) return [emptyPanel(hasData() ? tx("No rows match these filters.") : tx("No data yet. Load the example to see the control tower at work, or import your own files."))];
    const k = kpisOf(d, r);
    const out = [];
    // Readout
    const head = el("article", "result-card cx-readout");
    head.append(el("p", "result-label", tx("Readout")));
    const range = view();
    head.append(el("h3", null, tx("{d} deliveries, {r} routes and {i} incidents, {from} to {to}.", {
      d: int.format(d.length), r: int.format(r.length), i: int.format(i.length),
      from: showDate(state.filters.from || range.first), to: showDate(state.filters.to || range.last),
    })));
    const list = el("ul", "cx-readout-list");
    const off = C.KPIS.filter((kpi) => C.judge(kpi, k[kpi.id].value, state.targets[kpi.id]) === false);
    const scored = C.KPIS.filter((kpi) => C.judge(kpi, k[kpi.id].value, state.targets[kpi.id]) != null);
    if (off.length) list.append(el("li", null, tx("Off target: {list}.", { list: off.map((kpi) => `${label(kpi)} ${fmt(kpi, k[kpi.id].value)} (${kpi.dir === "up" ? "≥" : "≤"} ${fmtTarget(kpi, state.targets[kpi.id])})`).join("; ") })));
    else if (scored.length) list.append(el("li", null, tx("Every KPI with a target is on target.")));
    const unset = C.KPIS.filter((kpi) => k[kpi.id].value != null && state.targets[kpi.id] == null);
    if (unset.length) list.append(el("li", null, tx("Shown without a target until you set one: {list}.", { list: unset.map(label).join(", ") })));
    if (i.length) {
      const top = causeAnalysis(i, "Root_Cause_Category").items.find((item) => !P.isOther(item.key));
      if (top) list.append(el("li", null, tx("Largest root cause: {cause}, {p} of incidents.", { cause: top.key, p: pct(top.share, 0) })));
    }
    const dsps = [...groupBy(d, "DSP")].filter(([, rows]) => rows.filter(C.isDelivered).length >= state.settings.minSample)
      .map(([name, rows]) => ({ name, v: kpisOf(rows, []).perfect.value })).filter((x) => x.v != null).sort((a, b) => a.v - b.v);
    if (dsps.length > 1 && k.perfect.value != null) list.append(el("li", null, tx("Lowest Perfect Delivery: {dsp} with {v} (all: {all}).", { dsp: dsps[0].name, v: pct(dsps[0].v, 1), all: pct(k.perfect.value, 1) })));
    const ac = actionCounts(asOf);
    if (ac.total) list.append(el("li", null, tx("Actions: {open} open or in progress, {overdue} overdue, {unverified} completed but not yet verified.", { open: ac.open + ac.progress, overdue: ac.overdue, unverified: ac.unverified })));
    head.append(list);
    out.push(head);
    // KPI tiles
    const tiles = el("div", "cx-kpis");
    C.KPIS.forEach((kpi) => {
      const v = k[kpi.id];
      if (v.value == null) return;
      const tile = el("article", "cx-kpi");
      const ok = C.judge(kpi, v.value, state.targets[kpi.id]);
      tile.classList.toggle("is-bad", ok === false);
      tile.append(el("span", "dl-stat-label", label(kpi)), el("strong", "cx-kpi-value", fmt(kpi, v.value)));
      const meta = el("span", "cx-kpi-meta");
      meta.append(badge(ok));
      if (state.targets[kpi.id] != null) meta.append(el("span", null, targetText(kpi)));
      tile.append(meta, el("span", "dl-stat-note", grainWord(kpi, v.n) + (v.n < 30 ? ` · ${tx("little data")}` : "")));
      tile.title = tx(kpi.def);
      if (KPI_TO_DEEP[kpi.id]) {
        const dive = el("button", "button-ghost cx-kpi-dive", tx("Investigate"));
        dive.type = "button";
        dive.setAttribute("aria-label", `${tx("Investigate")}: ${label(kpi)}`);
        dive.addEventListener("click", () => openDeep(KPI_TO_DEEP[kpi.id]));
        tile.append(dive);
      }
      tiles.append(tile);
    });
    const score = C.cxScore(d);
    if (score != null) {
      const tile = el("article", "cx-kpi");
      tile.append(el("span", "dl-stat-label", tx("CX score")), el("strong", "cx-kpi-value", num(score, 1)), el("span", "dl-stat-note", tx("Weighted: 25 on time, 25 complete, 20 undamaged, 15 temperature, 10 first attempt, 5 no complaint.")));
      tiles.append(tile);
    }
    out.push(tiles);
    // Weekly trend
    const weeksD = byWeek(d);
    const weeksR = byWeek(r);
    const weeks = sortKeys(new Set([...weeksD.keys(), ...weeksR.keys()]));
    if (weeks.length > 1) {
      const trend = section(tx("Weekly trend"), tx("One chart per KPI, each with its own scale. Dashed line: target. Hollow dots: weeks off target."));
      const grid = el("div", "cx-minis");
      const perWeek = weeks.map((w) => ({ w, k: kpisOf(weeksD.get(w) || [], weeksR.get(w) || []) }));
      ["perfect", "onTime", "incomplete", "damage", "loading", "complaints", "lateRoute", "notification"].forEach((id) => {
        if (k[id].value == null) return;
        grid.append(miniChart(C.KPIS.find((kpi) => kpi.id === id), perWeek.map(({ w, k: wk }) => ({ week: w, value: wk[id].value, n: wk[id].n })), state.targets[id]));
      });
      trend.append(grid);
      out.push(trend);
    }
    // Partners and causes
    const pair = el("div", "dl-result-grid");
    if (k.perfect.value != null && !state.filters.DSP) {
      const box = section(tx("Perfect Delivery by partner"), tx("Partners with fewer than {n} deliveries are marked; compare them with care.", { n: state.settings.minSample }));
      const items = [...groupBy(d, "DSP")].map(([key, rows]) => {
        const v = kpisOf(rows, []).perfect;
        return { key, value: v.value ?? 0, n: v.n };
      }).sort((a, b) => b.value - a.value);
      box.append(barList(items, {
        label: (item) => [pct(item.value, 1), ` · ${tx("{n} deliveries", { n: int.format(item.n) })}${item.n < state.settings.minSample ? ` · ${tx("little data")}` : ""}`],
        highlight: (item) => item === items[items.length - 1] && items.length > 1,
      }));
      pair.append(box);
    }
    if (i.length) {
      const box = section(tx("Largest root causes"), tx("Share of all incidents. The full Pareto is under Root causes."));
      const result = causeAnalysis(i, "Root_Cause_Category");
      box.append(barList(result.items.slice(0, 6).map((item) => ({ key: item.key, value: item.amount, share: item.share, cls: item.cls })), {
        label: (item) => [int.format(item.value), ` · ${pct(item.share, 0)}`],
        highlight: (item) => item.cls === "A" && !P.isOther(item.key),
      }));
      const more = el("button", "button-ghost", tx("Open the root causes"));
      more.type = "button";
      more.addEventListener("click", () => goTo("causes"));
      box.append(more);
      pair.append(box);
    }
    if (pair.children.length) out.push(pair);
    return out;
  };

  // ---------- Operations ----------
  const reasonText = ([kind, value]) => ({
    loading: () => tx("loading {m} min", { m: num(value, 1) }),
    late: () => tx("left {m} min late", { m: int.format(Math.round(value)) }),
    scan: () => tx("scan compliance {p}", { p: pct(value, 1) }),
    gate: () => tx("gate left open"),
    cold: () => tx("cold scan missed"),
    speed: () => tx("yard speed breach"),
    bags: () => tx("{n} missing bags", { n: value }),
    vest: () => tx("no safety vest"),
    direction: () => tx("wrong traffic direction"),
    lids: () => tx("box lids missing"),
  })[kind]();
  const routeGroupRows = (routes, key) => {
    const settings = settingsFor();
    const groups = groupBy(routes, key);
    return sortKeys(groups.keys()).map((name) => {
      const rows = groups.get(name);
      const k = kpisOf([], rows);
      const over = rows.filter((row) => row.Loading_Time_Min != null && settings.loadingTarget != null && row.Loading_Time_Min > settings.loadingTarget).length;
      const loads = rows.filter((row) => row.Loading_Time_Min != null).length;
      const tr = el("tr");
      tr.append(el("th", null, name), el("td", "num", int.format(rows.length)),
        numCell(fmt(KPI_BY.loading, k.loading.value), C.judge(KPI_BY.loading, k.loading.value, state.targets.loading) === false),
        el("td", "num", loads && settings.loadingTarget != null ? pct(over / loads, 0) : "–"),
        numCell(fmt(KPI_BY.lateRoute, k.lateRoute.value), C.judge(KPI_BY.lateRoute, k.lateRoute.value, state.targets.lateRoute) === false),
        el("td", "num", int.format(rows.reduce((sum, row) => sum + (row.Missing_Bag_Events || 0), 0))),
        numCell(fmt(KPI_BY.gateClose, k.gateClose.value), C.judge(KPI_BY.gateClose, k.gateClose.value, state.targets.gateClose) === false),
        numCell(fmt(KPI_BY.coldScan, k.coldScan.value), C.judge(KPI_BY.coldScan, k.coldScan.value, state.targets.coldScan) === false));
      return tr;
    });
  };
  const KPI_BY = Object.fromEntries(C.KPIS.map((kpi) => [kpi.id, kpi]));
  const renderOperations = () => {
    const { r } = view();
    if (!r.length) return [emptyPanel(state.routes.length ? tx("No routes match these filters.") : tx("No route data yet. The route table holds loading time, departure, scans, gate and yard checks."))];
    const k = kpisOf([], r);
    const settings = settingsFor();
    const out = [];
    const stats = el("div", "dl-stats");
    const delays = r.filter((row) => row.Departure_Delay_Min != null);
    const avgDelay = delays.length ? delays.reduce((sum, row) => sum + row.Departure_Delay_Min, 0) / delays.length : null;
    const over = r.filter((row) => row.Loading_Time_Min != null && settings.loadingTarget != null && row.Loading_Time_Min > settings.loadingTarget).length;
    const scans = r.filter((row) => row.Scan_Compliance_Pct != null);
    const safety = r.filter((row) => row.Safety_Vest_Compliant === 0 || row.Traffic_Direction_Compliant === 0 || row.Yard_Speed_Breach > 0).length;
    stats.append(
      stat(tx("Routes"), int.format(r.length)),
      stat(label(KPI_BY.loading), fmt(KPI_BY.loading, k.loading.value), targetText(KPI_BY.loading)),
      stat(tx("Loading over target"), settings.loadingTarget != null && k.loading.n ? pct(over / k.loading.n, 0) : "–", tx("{n} routes", { n: int.format(over) })),
      stat(label(KPI_BY.lateRoute), fmt(KPI_BY.lateRoute, k.lateRoute.value), tx("more than {m} min late", { m: state.settings.lateMinutes })),
      stat(tx("Average departure delay"), avgDelay == null ? "–" : `${num(avgDelay, 1)} min`),
      stat(tx("Missing bag events"), int.format(r.reduce((sum, row) => sum + (row.Missing_Bag_Events || 0), 0))),
      stat(tx("Scan compliance"), scans.length ? pct(scans.reduce((sum, row) => sum + row.Scan_Compliance_Pct, 0) / scans.length, 1) : "–", tx("average per route")),
      stat(label(KPI_BY.gateClose), fmt(KPI_BY.gateClose, k.gateClose.value), targetText(KPI_BY.gateClose)),
      stat(label(KPI_BY.coldScan), fmt(KPI_BY.coldScan, k.coldScan.value), targetText(KPI_BY.coldScan)),
      stat(tx("Routes with a safety deviation"), int.format(safety), tx("vest, traffic direction or yard speed")),
    );
    out.push(stats);
    const heads = [tx("Routes"), { text: label(KPI_BY.loading), className: "num" }, { text: tx("Over target"), className: "num" }, { text: tx("Late"), className: "num" }, { text: tx("Missing bags"), className: "num" }, { text: tx("Gate closed"), className: "num" }, { text: tx("Cold scan"), className: "num" }];
    const grid = el("div", "dl-result-grid");
    [["DSP", tx("By partner")], ["Shift", tx("By shift")]].forEach(([key, title]) => {
      const box = section(title);
      box.append(table([key === "DSP" ? tx("Partner") : tx("Shift"), { text: tx("Routes"), className: "num" }, ...heads.slice(1)], routeGroupRows(r, key)));
      grid.append(box);
    });
    out.push(grid);
    // Risk queue
    const risk = r.map((row) => ({ row, ...C.routeRisk(row, settings) })).filter((x) => x.score >= 25 || x.reasons.some(([kind]) => ["vest", "direction", "speed"].includes(kind)))
      .sort((a, b) => b.score - a.score || (b.row.Date || "").localeCompare(a.row.Date || ""));
    const box = section(tx("Route risk queue"), tx("Points: loading over target 25, leaving over 10 min late 20, scans under 98% 15, gate open 15, cold scan missed 10, each yard speed breach 10, each missing bag 5. Critical from 50, watch from 25."));
    if (!risk.length) box.append(el("p", "dl-panel-note", tx("No route reaches 25 points in this selection.")));
    else {
      box.append(table([tx("Date"), tx("Route"), tx("Partner"), tx("Driver"), tx("Shift"), { text: tx("Points"), className: "num" }, tx("Level"), tx("Why")], risk.slice(0, 40).map(({ row, score, level, reasons }) => {
        const tr = el("tr");
        const lvl = el("td");
        lvl.append(el("span", `cx-level is-${level}`, level === "critical" ? tx("Critical") : level === "watch" ? tx("Watch") : tx("Safety")));
        tr.append(el("td", null, showDate(row.Date)), el("th", null, row.Route_ID || "–"), el("td", null, row.DSP), el("td", null, row.Driver_ID), el("td", null, row.Shift), el("td", "num", int.format(score)), lvl, el("td", "cx-why", reasons.map(reasonText).join(", ")));
        return tr;
      })));
      if (risk.length > 40) box.append(el("p", "dl-panel-note", tx("{n} more routes in the CSV export.", { n: int.format(risk.length - 40) })));
    }
    out.push(box);
    return out;
  };

  // ---------- Scorecards ----------
  const scoreRow = (name, d, r, i, extra = [], incidents = true) => {
    const k = kpisOf(d, r);
    const tr = el("tr");
    tr.append(el("th", null, name), el("td", "num", int.format(d.filter(C.isDelivered).length)));
    ["perfect", "onTime", "incomplete", "damage", "first", "complaints"].forEach((id) => tr.append(numCell(fmt(KPI_BY[id], k[id].value), C.judge(KPI_BY[id], k[id].value, state.targets[id]) === false)));
    extra.forEach((node) => tr.append(node));
    if (incidents) tr.append(el("td", "num", int.format(i.length)), el("td", "num", int.format(i.filter(C.incidentOpen).length)));
    return { tr, k };
  };
  const renderScorecards = () => {
    const { d, r, i } = view();
    if (!d.length) return [emptyPanel(state.deliveries.length ? tx("No deliveries match these filters.") : tx("Scorecards need the delivery table: one row per delivery."))];
    const out = [];
    const kpiHeads = ["perfect", "onTime", "incomplete", "damage", "first", "complaints"].map((id) => ({ text: tx(KPI_BY[id].label), className: "num" }));
    const dspBox = section(tx("Partner scorecard"), tx("Rates are per delivery, complaints per 1,000 deliveries. Red values miss the target."));
    const rByDsp = groupBy(r, "DSP");
    const iByDsp = groupBy(i, "DSP");
    dspBox.append(table([tx("Partner"), { text: tx("Deliveries"), className: "num" }, ...kpiHeads, { text: label(KPI_BY.loading), className: "num" }, { text: tx("Late routes"), className: "num" }, { text: tx("Incidents"), className: "num" }, { text: tx("Open"), className: "num" }],
      sortKeys(groupBy(d, "DSP").keys()).map((name) => {
        const rr = rByDsp.get(name) || [];
        const kr = kpisOf([], rr);
        const rows = groupBy(d, "DSP").get(name);
        const { tr } = scoreRow(name, rows, rr, iByDsp.get(name) || [], [
          numCell(fmt(KPI_BY.loading, kr.loading.value), C.judge(KPI_BY.loading, kr.loading.value, state.targets.loading) === false),
          numCell(fmt(KPI_BY.lateRoute, kr.lateRoute.value), C.judge(KPI_BY.lateRoute, kr.lateRoute.value, state.targets.lateRoute) === false),
        ]);
        // Under the comparison floor a partner is marked, as the page says.
        if (rows.filter(C.isDelivered).length < state.settings.minSample) tr.firstChild.append(" ", el("span", "dl-tag is-warn", tx("little data")));
        return tr;
      })));
    out.push(dspBox);
    // Drivers
    const min = state.settings.minSample;
    const dByDriver = groupBy(d.filter((row) => row.Driver_ID), "Driver_ID");
    const iByDriver = groupBy(i.filter((row) => row.Driver_ID), "Driver_ID");
    const ranked = [];
    const few = [];
    dByDriver.forEach((rows, name) => {
      const delivered = rows.filter(C.isDelivered).length;
      if (delivered < min) { few.push([name, delivered]); return; }
      const k = kpisOf(rows, []);
      const misses = C.KPIS.filter((kpi) => C.judge(kpi, k[kpi.id].value, state.targets[kpi.id]) === false).length;
      ranked.push({ name, rows, k, misses });
    });
    ranked.sort((a, b) => b.misses - a.misses || (a.k.perfect.value ?? 1) - (b.k.perfect.value ?? 1));
    const drvBox = section(tx("Driver review queue"), tx("Drivers with at least {n} deliveries, most missed targets first, then lowest Perfect Delivery. A review is a conversation about the process, not a ranking of people.", { n: min }));
    if (!dByDriver.size) drvBox.append(el("p", "dl-panel-note", tx("The delivery table has no driver IDs.")));
    else {
      drvBox.append(table([tx("Driver"), { text: tx("Deliveries"), className: "num" }, ...kpiHeads, { text: tx("Missed targets"), className: "num" }, { text: tx("Incidents"), className: "num" }, { text: tx("Repeats"), className: "num" }],
        ranked.slice(0, 40).map(({ name, rows, misses }) => {
          const inc = iByDriver.get(name) || [];
          const row = scoreRow(`${name}${rows[0].DSP ? ` · ${rows[0].DSP}` : ""}`, rows, [], [], [], false).tr;
          row.append(el("td", "num", int.format(misses)), el("td", "num", int.format(inc.length)), el("td", "num", int.format(inc.filter(C.isRepeat).length)));
          return row;
        })));
      if (few.length) drvBox.append(el("p", "dl-panel-note", tx("Not ranked, fewer than {n} deliveries: {list}.", { n: min, list: few.sort((a, b) => b[1] - a[1]).map(([name, n]) => `${name} (${n})`).join(", ") })));
    }
    drvBox.append(el("p", "cx-privacy", tx("Use driver IDs, not names. In Germany, comparing individual performance usually involves the works council and data protection.")));
    out.push(drvBox);
    return out;
  };

  // ---------- Root causes ----------
  const GROUPS = [["Root_Cause_Category", tx("Root cause")], ["Incident_Type", tx("Incident type")], ["Department_Owner", tx("Owner")], ["DSP", tx("Partner")], ["Zone", tx("Zone")], ["Shift", tx("Shift")]];
  const renderCauses = () => {
    const { d, i: all } = view();
    if (!all.length) return [emptyPanel(state.incidents.length ? tx("No incidents match these filters.") : tx("No incident log yet. One row per incident with its type, root cause, owner, severity and status."))];
    const out = [];
    const controls = el("div", "dl-grid cx-controls");
    const groupField = el("div", "field");
    const groupLabel = el("label", null, tx("Group incidents by"));
    groupLabel.htmlFor = "cx-group";
    const groupSelect = el("select");
    groupSelect.id = "cx-group";
    GROUPS.forEach(([value, text]) => { const o = el("option", null, text); o.value = value; groupSelect.append(o); });
    groupSelect.value = state.groupBy;
    groupField.append(groupLabel, groupSelect);
    const typeField = el("div", "field");
    const typeLabel = el("label", null, tx("Incident type"));
    typeLabel.htmlFor = "cx-type";
    const typeSelect = el("select");
    typeSelect.id = "cx-type";
    const types = sortKeys(new Set(all.map((row) => row.Incident_Type).filter(Boolean)));
    const allOption = el("option", null, tx("All types"));
    allOption.value = "";
    typeSelect.append(allOption, ...types.map((t) => { const o = el("option", null, t); o.value = t; return o; }));
    if (!types.includes(state.typeFilter)) state.typeFilter = "";
    typeSelect.value = state.typeFilter;
    typeField.append(typeLabel, typeSelect);
    controls.append(groupField, typeField);
    groupSelect.addEventListener("change", () => { state.groupBy = groupSelect.value; save(); renderPanel(); });
    typeSelect.addEventListener("change", () => { state.typeFilter = typeSelect.value; save(); renderPanel(); });
    out.push(controls);
    const i = state.typeFilter ? all.filter((row) => row.Incident_Type === state.typeFilter) : all;
    const groupName = GROUPS.find(([value]) => value === state.groupBy)[1];
    const result = causeAnalysis(i, state.groupBy);
    const stats = el("div", "dl-stats");
    const delivered = d.filter((row) => row.Delivered !== 0).length;
    stats.append(
      stat(tx("Incidents"), int.format(i.length), delivered ? tx("{v} per 1,000 deliveries", { v: num(i.length / delivered * 1000, 1) }) : ""),
      stat(tx("Open"), int.format(i.filter(C.incidentOpen).length)),
      stat(tx("High severity"), int.format(i.filter((row) => C.severityRank(row.Severity) >= 2).length)),
      stat(tx("Repeats"), int.format(i.filter(C.isRepeat).length), i.length ? pct(i.filter(C.isRepeat).length / i.length, 0) : ""),
      stat(tx("Vital few"), int.format(result.vital.length), tx("{p} of incidents", { p: pct(result.vitalShare, 0) })),
    );
    out.push(stats);
    const chartBox = section(tx("Pareto by {group}", { group: lower(groupName) }), result.shape === "flat" ? tx("No clear vital few: the causes are spread out, which points to the process as a whole.") : result.shape === "few" ? tx("Fewer than five groups: fix the largest first.") : tx("The highlighted groups make 80% of the incidents: start there."));
    chartBox.append(paretoFigure(result, tx("incidents")));
    const byKey = groupBy(i, state.groupBy);
    const typeKey = state.groupBy === "Incident_Type" ? "Root_Cause_Category" : "Incident_Type";
    chartBox.append(table(["#", groupName, { text: tx("Incidents"), className: "num" }, { text: tx("Share of the total"), className: "num" }, { text: tx("Cumulative"), className: "num" }, tx("Class"), { text: tx("Open"), className: "num" }, { text: tx("High severity"), className: "num" }, { text: tx("Repeats"), className: "num" }, state.groupBy === "Incident_Type" ? tx("Main root cause") : tx("Main type")],
      result.items.map((item, n) => {
        const rows = item.spellings.flatMap((spelling) => byKey.get(spelling) || (spelling === tx("Not stated") ? byKey.get(tx("Not stated")) || [] : []));
        const main = [...groupBy(rows, typeKey)].sort((a, b) => b[1].length - a[1].length)[0];
        const tr = el("tr", item.cls === "A" && !P.isOther(item.key) ? "is-vital" : "");
        tr.append(el("td", null, String(n + 1)), el("th", null, item.key), el("td", "num", int.format(item.amount)), el("td", "num", pct(item.share, 1)), el("td", "num", pct(item.cumulative, 1)), el("td", null, item.cls),
          el("td", "num", int.format(rows.filter(C.incidentOpen).length)), el("td", "num", int.format(rows.filter((row) => C.severityRank(row.Severity) >= 2).length)), el("td", "num", int.format(rows.filter(C.isRepeat).length)), el("td", null, main ? main[0] : ""));
        return tr;
      })));
    // Next steps
    const top = result.items.find((item) => !P.isOther(item.key));
    const actions = el("div", "tool-actions");
    const pareto = el("a", "button-primary", tx("Open in Pareto 80/20"));
    pareto.href = new URL("../pareto/", window.location.href).href;
    pareto.addEventListener("click", () => {
      const headers = [tx("Date"), tx("Partner"), tx("Shift"), tx("Zone"), tx("Incident type"), tx("Root cause"), tx("Owner"), tx("Severity"), tx("Status")];
      const fields = ["Date", "DSP", "Shift", "Zone", "Incident_Type", "Root_Cause_Category", "Department_Owner", "Severity", "Status"];
      const categoryCol = Math.max(0, fields.indexOf(state.groupBy));
      try {
        sessionStorage.setItem(cfg.handoffKey, JSON.stringify({ source: tx("CX Control Tower"), template: "cx-incidents", headers, rows: i.map((row) => fields.map((field) => String(row[field] ?? ""))), map: { category: categoryCol, count: -1, value: -1, date: 0, filter: 1 }, measure: "count" }));
      } catch { /* the Pareto page opens empty */ }
    });
    actions.append(pareto);
    const dive = el("button", "button-secondary", tx("Open the deep dive"));
    dive.type = "button";
    dive.addEventListener("click", () => openDeep(state.typeFilter ? (C.DEEP.find((m) => m.incident && m.incident.test(P.fold(state.typeFilter)))?.id || state.deep.metric) : state.deep.metric));
    actions.append(dive);
    if (top) {
      const whys = el("a", "button-secondary", tx("Take “{cause}” to 5 Whys", { cause: top.key }));
      const url = new URL("../five-whys/", window.location.href);
      url.searchParams.set("problem", tx("Why is “{cause}” our largest cause of incidents ({p})?", { cause: top.key, p: pct(top.share, 0) }));
      whys.href = url.href;
      const plan = el("button", "button-secondary", tx("Plan an action for “{cause}”", { cause: top.key }));
      plan.type = "button";
      plan.addEventListener("click", () => {
        state.actions.push({ Action_ID: nextActionId(), Linked_Incident: "", Problem: tx("{cause}: {n} incidents, {p} of the total", { cause: top.key, n: int.format(top.amount), p: pct(top.share, 0) }), Evidence: tx("Pareto by {group}, {from} to {to}", { group: lower(groupName), from: showDate(state.filters.from || view().first), to: showDate(state.filters.to || view().last) }), Root_Cause: "", Action_Type: "Corrective", Action: "", Owner: "", Start_Date: view().asOf, Deadline: "", Status: "Open", Verification_Metric: "", Baseline: "", Target: "", Result: "", Verification_Status: "Pending", Notes: "" });
        openAction = state.actions.length - 1;
        state.columns.actions = [...C.FIELDS.actions];
        save();
        goTo("actions");
      });
      actions.append(whys, plan);
    }
    chartBox.append(actions);
    out.push(chartBox);
    // Open incidents
    const open = i.filter(C.incidentOpen).sort((a, b) => C.severityRank(b.Severity) - C.severityRank(a.Severity) || (b.Date || "").localeCompare(a.Date || ""));
    const openBox = section(tx("Open incidents"), tx("Highest severity first, then newest."));
    if (!open.length) openBox.append(el("p", "dl-panel-note", tx("No open incidents in this selection.")));
    else openBox.append(table([tx("Date"), tx("Incident"), tx("Type"), tx("Root cause"), tx("Owner"), tx("Severity"), tx("Status"), tx("Repeat")], open.slice(0, 30).map((row) => {
      const tr = el("tr");
      tr.append(el("td", null, showDate(row.Date)), el("th", null, row.Incident_ID || "–"), el("td", null, row.Incident_Type), el("td", null, row.Root_Cause_Category), el("td", null, row.Department_Owner), el("td", null, row.Severity), el("td", null, row.Status), el("td", null, C.isRepeat(row) ? tx("yes") : ""));
      return tr;
    })));
    if (open.length > 30) openBox.append(el("p", "dl-panel-note", tx("{n} more in the CSV export.", { n: int.format(open.length - 30) })));
    out.push(openBox);
    return out;
  };

  // ---------- Actions (CAPA) ----------
  let openAction = -1;
  const nextActionId = () => {
    const max = state.actions.reduce((m, a) => Math.max(m, Number((String(a.Action_ID).match(/(\d+)\s*$/) || [])[1] || 0)), 0);
    return `ACT${String(max + 1).padStart(3, "0")}`;
  };
  const ACTION_FIELDS = [
    ["Problem", tx("Problem"), "textarea"], ["Evidence", tx("Evidence"), "textarea"], ["Root_Cause", tx("Root cause"), "textarea"],
    ["Action", tx("Action"), "textarea"], ["Action_Type", tx("Type"), ["Containment", "Corrective", "Preventive"]], ["Owner", tx("Owner"), "text"],
    ["Start_Date", tx("Start"), "date"], ["Deadline", tx("Deadline"), "date"], ["Status", tx("Status"), ["Open", "In Progress", "Completed"]],
    ["Verification_Metric", tx("Verification metric"), "text"], ["Baseline", tx("Baseline"), "text"], ["Target", tx("Target"), "text"],
    ["Result", tx("Result"), "text"], ["Verification_Status", tx("Verified?"), ["Pending", "Effective", "Not effective"]], ["Linked_Incident", tx("Linked incident"), "text"], ["Notes", tx("Notes"), "textarea"],
  ];
  const optionText = (value) => ({ Containment: tx("Containment"), Corrective: tx("Corrective"), Preventive: tx("Preventive"), Open: tx("Open"), "In Progress": tx("In progress"), Completed: tx("Completed"), Pending: tx("Pending"), Effective: tx("Effective"), "Not effective": tx("Not effective") })[value] || value;
  const actionSummary = (action, asOf) => {
    const summary = el("summary", "cx-action-summary");
    const title = el("span", "cx-action-title");
    title.append(el("strong", null, action.Action_ID || "–"), el("span", null, action.Action || action.Problem || tx("New action")));
    const meta = el("span", "cx-action-meta");
    meta.append(el("span", null, action.Owner || tx("no owner")), el("span", null, action.Deadline ? showDate(action.Deadline) : tx("no deadline")));
    const status = el("span", `cx-chip is-${action.Status === "Completed" ? "done" : overdue(action, asOf) ? "late" : "open"}`, overdue(action, asOf) ? `${optionText(action.Status)} · ${tx("overdue")}` : optionText(action.Status));
    const verified = el("span", `cx-chip is-${action.Verification_Status === "Effective" ? "done" : action.Verification_Status === "Not effective" ? "late" : "wait"}`, optionText(action.Verification_Status));
    meta.append(status, verified);
    const fromCase = state.cases.find((item) => item.actionId && item.actionId === action.Action_ID);
    if (fromCase) meta.append(el("span", "cx-chip is-open", `${tx("Investigation")} ${fromCase.id}`));
    summary.append(title, meta);
    return summary;
  };
  const renderActions = () => {
    const { asOf } = view();
    const out = [];
    const ac = actionCounts(asOf);
    const stats = el("div", "dl-stats");
    stats.append(stat(tx("Actions"), int.format(ac.total)), stat(tx("Open"), int.format(ac.open)), stat(tx("In progress"), int.format(ac.progress)), stat(tx("Overdue"), int.format(ac.overdue), tx("as of {date}", { date: showDate(asOf) })),
      stat(tx("Completed, not verified"), int.format(ac.unverified)), stat(tx("Not effective"), int.format(ac.failed)));
    out.push(stats);
    const box = section(tx("Corrective and preventive actions"), tx("Problem → evidence → root cause → action → owner → deadline → verification. An action is finished when the result shows it worked, not when the task is done."));
    const bar = el("div", "tool-actions");
    const add = el("button", "button-primary", tx("Add an action"));
    add.type = "button";
    add.addEventListener("click", () => {
      state.actions.push({ Action_ID: nextActionId(), Linked_Incident: "", Problem: "", Evidence: "", Root_Cause: "", Action_Type: "Corrective", Action: "", Owner: "", Start_Date: asOf, Deadline: "", Status: "Open", Verification_Metric: "", Baseline: "", Target: "", Result: "", Verification_Status: "Pending", Notes: "" });
      state.columns.actions = [...C.FIELDS.actions];
      openAction = state.actions.length - 1;
      save();
      renderPanel();
    });
    const csv = el("button", "button-secondary", tx("Actions as CSV"));
    csv.type = "button";
    csv.addEventListener("click", () => downloadCsv("cx-actions", [C.FIELDS.actions, ...state.actions.map((a) => C.FIELDS.actions.map((field) => a[field] ?? ""))]));
    bar.append(add, csv);
    box.append(bar);
    const list = el("div", "cx-actions");
    // Overdue first, then open, then completed; newest deadline last.
    const order = state.actions.map((action, index) => ({ action, index })).sort((a, b) => overdue(b.action, asOf) - overdue(a.action, asOf) || (a.action.Status === "Completed") - (b.action.Status === "Completed") || String(a.action.Deadline || "9").localeCompare(String(b.action.Deadline || "9")));
    order.forEach(({ action, index }) => {
      const details = el("details", "cx-action");
      details.open = index === openAction;
      details.append(actionSummary(action, asOf));
      const form = el("div", "dl-grid cx-action-form");
      ACTION_FIELDS.forEach(([field, text, kind]) => {
        const wrap = el("div", `field${kind === "textarea" ? " dl-wide" : ""}`);
        const id = `cx-a${index}-${field}`;
        const lab = el("label", null, text);
        lab.htmlFor = id;
        let input;
        if (Array.isArray(kind)) {
          input = el("select");
          const values = kind.includes(action[field]) || !action[field] ? kind : [...kind, action[field]];
          values.forEach((value) => { const o = el("option", null, optionText(value)); o.value = value; input.append(o); });
        } else if (kind === "textarea") {
          input = el("textarea");
          input.rows = 2;
        } else {
          input = el("input");
          input.type = kind === "date" ? "date" : "text";
          input.autocomplete = "off";
        }
        input.id = id;
        input.value = action[field] ?? "";
        input.addEventListener(Array.isArray(kind) || kind === "date" ? "change" : "input", () => {
          action[field] = kind === "date" ? parseDate(input.value) : input.value;
          save();
          if (["Action", "Problem", "Owner", "Deadline", "Status", "Verification_Status"].includes(field)) details.querySelector("summary").replaceWith(actionSummary(action, asOf));
        });
        wrap.append(lab, input);
        form.append(wrap);
      });
      const remove = el("button", "button-ghost", tx("Delete this action"));
      remove.type = "button";
      remove.addEventListener("click", () => {
        if (!window.confirm(tx("Delete this action?"))) return;
        state.actions.splice(index, 1);
        openAction = -1;
        save();
        renderPanel();
      });
      details.addEventListener("toggle", () => { if (details.open) openAction = index; });
      details.append(form, remove);
      list.append(details);
    });
    if (!state.actions.length) list.append(el("p", "dl-panel-note", tx("No actions yet. Add one here, or plan one from the largest root cause.")));
    box.append(list);
    out.push(box);
    return out;
  };

  // ---------- Weekly quality review ----------
  const renderReview = () => {
    const d = state.deliveries.filter(inDims);
    const r = state.routes.filter(inDims);
    const i = state.incidents.filter(inDims);
    const weeks = weeksOf([...d, ...r, ...i]).reverse();
    if (!weeks.length) return [emptyPanel(hasData() ? tx("No dated rows match these filters.") : tx("No data yet. Load the example or import your files."))];
    if (!weeks.includes(state.week)) state.week = weeks[0];
    const week = state.week;
    const prev = weeks[weeks.indexOf(week) + 1] || "";
    const inWeek = (w) => (row) => row.Date && C.isoWeek(row.Date) === w;
    const monday = C.weekMonday([...d, ...r, ...i].find(inWeek(week)).Date);
    const kNow = kpisOf(d.filter(inWeek(week)), r.filter(inWeek(week)));
    const kPrev = prev ? kpisOf(d.filter(inWeek(prev)), r.filter(inWeek(prev))) : null;
    const out = [];
    const pickRow = el("div", "dl-grid cx-controls");
    const field = el("div", "field");
    const lab = el("label", null, tx("Week"));
    lab.htmlFor = "cx-week";
    const select = el("select");
    select.id = "cx-week";
    weeks.forEach((w) => {
      const days = [...d, ...r, ...i].filter(inWeek(w)).map((row) => row.Date).sort();
      const o = el("option", null, `${w} · ${showDate(days[0])} – ${showDate(days[days.length - 1])}`);
      o.value = w;
      select.append(o);
    });
    select.value = week;
    select.addEventListener("change", () => { state.week = select.value; save(); renderPanel(); });
    field.append(lab, select);
    pickRow.append(field);
    out.push(pickRow);
    if (state.filters.from || state.filters.to) out.push(el("p", "dl-warning", tx("The weekly review uses whole weeks; the date filter does not apply here. Partner, shift and zone filters do.")));
    // KPI table
    const kpiBox = section(tx("KPIs this week"), prev ? tx("Compared with {week}.", { week: prev }) : tx("No earlier week to compare with."));
    const rows = C.KPIS.filter((kpi) => kNow[kpi.id].value != null || (kPrev && kPrev[kpi.id].value != null)).map((kpi) => {
      const now = kNow[kpi.id].value;
      const before = kPrev ? kPrev[kpi.id].value : null;
      const tr = el("tr");
      const change = now != null && before != null ? now - before : null;
      const better = change == null || Math.abs(change) < 1e-12 ? null : kpi.dir === "up" ? change > 0 : change < 0;
      const changeText = change == null ? "–" : kpi.unit === "pct" ? `${change > 0 ? "+" : change < 0 ? "−" : "±"}${num(Math.abs(change) * 100, 2)} ${tx("pts")}` : `${change > 0 ? "+" : change < 0 ? "−" : "±"}${num(Math.abs(change), 1)}`;
      const statusCell = el("td");
      statusCell.append(badge(C.judge(kpi, now, state.targets[kpi.id])));
      tr.append(el("th", null, label(kpi)), el("td", "num", fmt(kpi, now)), el("td", "num", fmt(kpi, before)), el("td", `num${better === false ? " is-off" : better ? " is-better" : ""}`, changeText), el("td", null, state.targets[kpi.id] == null ? "–" : `${kpi.dir === "up" ? "≥" : "≤"} ${fmtTarget(kpi, state.targets[kpi.id])}`), statusCell);
      return tr;
    });
    kpiBox.append(table([tx("KPI"), { text: week, className: "num" }, { text: prev || tx("Previous"), className: "num" }, { text: tx("Change"), className: "num" }, tx("Target"), tx("Status")], rows));
    out.push(kpiBox);
    // Top causes and actions
    const grid = el("div", "dl-result-grid");
    const causeBox = section(tx("Top 3 root causes"), tx("Incidents this week, with last week in brackets."));
    const nowCauses = causeAnalysis(i.filter(inWeek(week)), "Root_Cause_Category");
    const prevCount = prev ? Object.fromEntries(causeAnalysis(i.filter(inWeek(prev)), "Root_Cause_Category").items.map((item) => [P.fold(item.key), item.amount])) : {};
    const top3 = nowCauses.items.filter((item) => !P.isOther(item.key)).slice(0, 3);
    if (!top3.length) causeBox.append(el("p", "dl-panel-note", tx("No incidents this week.")));
    else {
      const ol = el("ol", "cx-top3");
      top3.forEach((item) => ol.append(el("li", null, `${item.key}: ${int.format(item.amount)} (${prev ? int.format(prevCount[P.fold(item.key)] || 0) : "–"})`)));
      causeBox.append(ol);
    }
    grid.append(causeBox);
    const end = C.addDays(monday, 6);
    const actBox = section(tx("Actions to discuss"), tx("Overdue, due this week, and completed actions whose effect is not yet verified."));
    const due = state.actions.filter((a) => a.Status !== "Completed" && a.Deadline && a.Deadline <= end);
    const verify = state.actions.filter((a) => a.Status === "Completed" && a.Verification_Status === "Pending");
    if (!due.length && !verify.length) actBox.append(el("p", "dl-panel-note", tx("Nothing due or waiting for verification.")));
    else {
      const ul = el("ul", "cx-review-actions");
      due.forEach((a) => ul.append(el("li", null, `${a.Action_ID} · ${a.Action || a.Problem} · ${a.Owner || tx("no owner")} · ${showDate(a.Deadline)}${a.Deadline < monday ? ` · ${tx("overdue")}` : ""}`)));
      verify.forEach((a) => ul.append(el("li", null, `${a.Action_ID} · ${a.Action || a.Problem} · ${tx("verify with {metric}", { metric: a.Verification_Metric || tx("a metric") })}`)));
      actBox.append(ul);
    }
    const openCases = state.cases.filter((item) => item.status !== "Verified effective");
    if (openCases.length) {
      actBox.append(el("p", "result-label", tx("Investigations in progress")));
      const ul = el("ul", "cx-review-actions");
      openCases.slice(0, 6).forEach((item) => ul.append(el("li", null, `${item.id} · ${item.title} · ${item.owner || tx("no owner")} · ${CASE_TEXT[item.status] || item.status}${item.actionId ? ` · ${item.actionId}` : ""}`)));
      actBox.append(ul);
      const more = el("button", "button-ghost", tx("Open the deep dive"));
      more.type = "button";
      more.addEventListener("click", () => goTo("deep"));
      actBox.append(more);
    }
    grid.append(actBox);
    out.push(grid);
    const agenda = section(tx("Agenda, 30 minutes"));
    const ol = el("ol", "cx-agenda");
    [tx("Safety first: any safety deviation or high-severity incident this week."), tx("KPIs against target: what moved, and is it a signal or a normal week?"), tx("Top 3 root causes: for each, the owner says what was found."), tx("Actions: overdue ones get a new date and a reason; completed ones get their result."), tx("New actions: one owner, one deadline, one way to verify.")].forEach((text) => ol.append(el("li", null, text)));
    agenda.append(ol);
    const buttons = el("div", "tool-actions");
    const copyButton = el("button", "button-primary", tx("Copy the review"));
    copyButton.type = "button";
    copyButton.addEventListener("click", () => {
      const lines = [`${tx("Weekly quality review")} ${week}${state.filters.DSP ? ` · ${state.filters.DSP}` : ""}`, ""];
      C.KPIS.forEach((kpi) => {
        if (kNow[kpi.id].value == null) return;
        const ok = C.judge(kpi, kNow[kpi.id].value, state.targets[kpi.id]);
        lines.push(`${label(kpi)}: ${fmt(kpi, kNow[kpi.id].value)}${kPrev && kPrev[kpi.id].value != null ? ` (${prev}: ${fmt(kpi, kPrev[kpi.id].value)})` : ""}${ok == null ? "" : ok ? ` ✓` : ` ✗ ${targetText(kpi)}`}`);
      });
      if (top3.length) lines.push("", `${tx("Top 3 root causes")}:`, ...top3.map((item, n) => `${n + 1}. ${item.key}: ${item.amount}`));
      if (due.length || verify.length) lines.push("", `${tx("Actions to discuss")}:`, ...due.map((a) => `- ${a.Action_ID} ${a.Action || a.Problem} (${a.Owner || "–"}, ${showDate(a.Deadline)})`), ...verify.map((a) => `- ${a.Action_ID} ${a.Action || a.Problem}: ${tx("verify")}`));
      if (openCases.length) lines.push("", `${tx("Investigations in progress")}:`, ...openCases.map((item) => `- ${item.id} ${item.title} (${item.owner || "–"}, ${CASE_TEXT[item.status] || item.status})`));
      copy(lines.join("\n"), copyButton);
    });
    const printButton = el("button", "button-secondary", tx("Print or save as PDF"));
    printButton.type = "button";
    printButton.addEventListener("click", () => window.print());
    buttons.append(copyButton, printButton);
    agenda.append(buttons);
    out.push(agenda);
    return out;
  };

  // ---------- Data & targets ----------
  const TEMPLATE_ROWS = {
    deliveries: [["2026-09-21", "DSP A", "AM", "North", "R0001", "D01", "DLV000001", "1", "1", "1", "1", "1", "1", "0", "0", "0"], ["2026-09-21", "DSP A", "AM", "North", "R0001", "D01", "DLV000002", "1", "0", "1", "1", "", "1", "1", "1", "0"]],
    routes: [["2026-09-21", "DSP A", "AM", "North", "R0001", "D01", "V01", "3", "36", "36", "18.5", "2026-09-21 07:45", "2026-09-21 07:52", "", "0", "98.9%", "1", "1", "1", "1", "1", "0"]],
    incidents: [["INC00001", "2026-09-21", "DSP A", "AM", "North", "R0001", "D01", "DLV000002", "Delay", "Late departure / loading", "Bags staged after driver arrived", "Last Mile", "Low", "Delay", "Yes", "Open", "No"]],
    actions: [["ACT001", "INC00001", "Late departures in the PM wave", "Late route rate 18%", "PM volume arrives after planned loading start", "Corrective", "Agree a PM cut-off with outbound", "Station Manager", "2026-09-22", "2026-10-03", "Open", "Late Route Rate", "18%", "<=5%", "", "Pending", ""]],
  };
  const renderData = () => {
    const out = [];
    const { asOf } = view();
    // Import
    const imp = section(tx("Import your data"), tx("CSV or Excel (.xlsx). An Excel file can hold all four tables on separate sheets, like the Control Tower workbook; each sheet is recognised by its column names. A “Metric | Target” sheet sets the targets."));
    const drop = el("div", "cx-drop");
    const fileLabel = el("label", "cv-file button-primary", tx("Choose CSV or Excel files"));
    const input = el("input");
    input.type = "file";
    input.multiple = true;
    input.accept = ".csv,.txt,.tsv,.xlsx,.xls,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    input.addEventListener("change", () => { importFiles(input.files); input.value = ""; });
    fileLabel.append(input);
    const modeField = el("div", "field");
    const modeLabel = el("label", null, tx("When a table already has data"));
    modeLabel.htmlFor = "cx-mode";
    const mode = el("select");
    mode.id = "cx-mode";
    mode.dataset.cxMode = "";
    [["replace", tx("Replace it with the file")], ["merge", tx("Add the file (same ID: the file wins)")]].forEach(([value, text]) => { const o = el("option", null, text); o.value = value; mode.append(o); });
    modeField.append(modeLabel, mode);
    drop.append(el("p", "pa-drop-lede", tx("Drop files here, or")), fileLabel);
    ["dragenter", "dragover"].forEach((type) => drop.addEventListener(type, (event) => { event.preventDefault(); drop.classList.add("is-over"); }));
    ["dragleave", "drop"].forEach((type) => drop.addEventListener(type, () => drop.classList.remove("is-over")));
    drop.addEventListener("drop", (event) => { event.preventDefault(); importFiles(event.dataTransfer?.files); });
    const buttons = el("div", "tool-actions");
    const example = el("button", "button-secondary", tx("Load the example"));
    example.type = "button";
    example.addEventListener("click", loadExample);
    const clear = el("button", "button-ghost", tx("Remove all data"));
    clear.type = "button";
    clear.addEventListener("click", () => {
      if (!window.confirm(tx("Remove all tables, actions, investigations and targets from this browser?"))) return;
      const fresh = blank();
      Object.keys(fresh).forEach((key) => { state[key] = fresh[key]; });
      state.tab = "data";
      invalidate();
      save();
      say(tx("All data removed."));
      render();
    });
    buttons.append(example, clear);
    imp.append(drop, modeField, buttons);
    // Table status
    imp.append(table([tx("Table"), { text: tx("Rows"), className: "num" }, tx("Dates"), tx("Source")], NAMES.map((name) => {
      const rows = state[name];
      const dates = rows.map((row) => row.Date || row.Deadline).filter(Boolean).sort();
      const tr = el("tr");
      tr.append(el("th", null, TABLE_LABEL[name]), el("td", "num", int.format(rows.length)), el("td", null, dates.length ? `${showDate(dates[0])} – ${showDate(dates[dates.length - 1])}` : "–"), el("td", null, state.sources[name] || "–"));
      return tr;
    }).concat((() => {
      const tr = el("tr");
      const dates = state.cases.map((item) => item.updated).filter(Boolean).sort();
      tr.append(el("th", null, tx("Investigations")), el("td", "num", int.format(state.cases.length)), el("td", null, dates.length ? `${showDate(dates[0])} – ${showDate(dates[dates.length - 1])}` : "–"), el("td", null, state.cases.length ? tx("Deep dive, this browser") : "–"));
      return [tr];
    })())));
    out.push(imp);
    // Templates and export
    const files = section(tx("Templates and export"), tx("Keep the column names; the order does not matter. 1 = yes, 0 = no. An empty temperature cell means nothing chilled on that delivery."));
    const tpl = el("div", "tool-actions");
    NAMES.forEach((name) => {
      const button = el("button", "button-secondary", tx("{table} template", { table: TABLE_LABEL[name] }));
      button.type = "button";
      button.addEventListener("click", () => downloadCsv(`cx-${name}-template`, [C.FIELDS[name], ...TEMPLATE_ROWS[name]]));
      tpl.append(button);
    });
    const exp = el("div", "tool-actions");
    const { d, r, i } = view();
    [["deliveries", d], ["routes", r], ["incidents", i], ["actions", state.actions]].forEach(([name, rows]) => {
      const button = el("button", "button-ghost", tx("{table} as CSV ({n})", { table: TABLE_LABEL[name], n: int.format(rows.length) }));
      button.type = "button";
      button.disabled = !rows.length;
      button.addEventListener("click", () => downloadCsv(`cx-${name}`, [C.FIELDS[name], ...rows.map((row) => C.FIELDS[name].map((field) => exportValue(name, field, row[field])))]));
      exp.append(button);
    });
    files.append(tpl, el("p", "dl-panel-note", tx("Export uses the filters above.")), exp);
    out.push(files);
    // Targets
    const targets = section(tx("Targets"), tx("Enter only targets your business has approved. An empty field means the KPI is shown but not scored. Rates in %, loading in minutes, complaints per 1,000 deliveries."));
    const rows = C.KPIS.map((kpi) => {
      const tr = el("tr");
      const td = el("td");
      const field = el("input");
      field.id = `cx-t-${kpi.id}`;
      field.inputMode = "decimal";
      field.autocomplete = "off";
      field.className = "cx-target-input";
      const t = state.targets[kpi.id];
      field.value = t == null ? "" : kpi.unit === "pct" ? num(t * 100, t * 100 % 1 ? 1 : 0) : num(t, t % 1 ? 1 : 0);
      field.setAttribute("aria-label", `${label(kpi)}: ${tx("target")}`);
      field.addEventListener("change", () => {
        const raw = field.value.trim();
        const n = window.ToolKit.parseNumber(raw.replace("%", ""));
        state.targets[kpi.id] = !raw ? null : Number.isFinite(n) ? (kpi.unit === "pct" ? n / 100 : n) : state.targets[kpi.id];
        field.classList.toggle("is-invalid", Boolean(raw) && !Number.isFinite(n));
        save();
      });
      td.append(field, el("span", "cx-unit", kpi.unit === "pct" ? "%" : kpi.unit === "min" ? "min" : "‰"));
      tr.append(el("th", null, label(kpi)), el("td", null, kpi.dir === "up" ? "≥" : "≤"), td, el("td", "cx-def", tx(kpi.def)));
      return tr;
    });
    targets.append(table([tx("KPI"), tx("Better when"), tx("Target"), tx("Definition")], rows, "cx-targets"));
    const settings = el("div", "dl-grid cx-controls");
    [["lateMinutes", tx("A route is late after (minutes)"), 0, 240], ["minSample", tx("Compare partners and drivers from (deliveries)"), 1, 100000]].forEach(([key, text, min, max]) => {
      const wrap = el("div", "field");
      const lab = el("label", null, text);
      lab.htmlFor = `cx-s-${key}`;
      const field = el("input");
      field.id = `cx-s-${key}`;
      field.type = "number";
      field.min = String(min);
      field.max = String(max);
      field.value = String(state.settings[key]);
      field.addEventListener("change", () => {
        const n = Number(field.value);
        if (Number.isFinite(n) && n >= min && n <= max) { state.settings[key] = key === "minSample" ? Math.round(n) : n; save(); invalidate(); }
        else field.value = String(state.settings[key]);
      });
      wrap.append(lab, field);
      settings.append(wrap);
    });
    targets.append(settings);
    const back = el("button", "button-secondary", tx("Show the overview with these targets"));
    back.type = "button";
    back.addEventListener("click", () => goTo("overview"));
    targets.append(back);
    out.push(targets);
    // Data quality
    const dq = section(tx("Data checks"), tx("What the numbers rest on. Fix these in the source and import again."));
    const list = el("ul", "cx-checks");
    const item = (ok, text) => {
      const li = el("li", ok ? "is-ok" : "is-warn");
      li.append(el("span", "cx-check-mark", ok ? "✓" : "!"), el("span", null, text));
      list.append(li);
    };
    if (!hasData()) item(false, tx("No data yet."));
    NAMES.forEach((name) => {
      (state.issues[name] || []).forEach((issue) => item(false, tx("{table}, column {field}: {n} cells could not be read (rows {lines}).", { table: TABLE_LABEL[name], field: issue.field, n: int.format(issue.count), lines: issue.lines.join(", ") + (issue.count > issue.lines.length ? " …" : "") })));
    });
    if (state.deliveries.length) {
      const cols = present();
      const missing = ["On_Time", "Complete", "Damage_Free", "First_Attempt", "Temp_Compliant"].filter((field) => !cols.has(field));
      item(!missing.length, missing.length ? tx("Deliveries without the columns {list}: Perfect Delivery is checked without them.", { list: missing.join(", ") }) : tx("Deliveries have every column Perfect Delivery needs."));
      const ids = state.deliveries.map((row) => row.Delivery_ID).filter(Boolean);
      const dup = ids.length - new Set(ids).size;
      item(!dup, dup ? tx("{n} delivery IDs appear more than once.", { n: int.format(dup) }) : tx("Every delivery ID is unique."));
      const noDate = state.deliveries.filter((row) => !row.Date).length;
      if (noDate) item(false, tx("{n} deliveries have no valid date and appear only without a date filter.", { n: int.format(noDate) }));
    }
    if (state.routes.length && state.deliveries.length) {
      const routeIds = new Set(state.routes.map((row) => `${row.Date}|${row.Route_ID}`));
      const orphan = new Set(state.deliveries.filter((row) => row.Route_ID && !routeIds.has(`${row.Date}|${row.Route_ID}`)).map((row) => `${row.Date}|${row.Route_ID}`)).size;
      item(!orphan, orphan ? tx("{n} routes in the delivery table are missing from the route table.", { n: int.format(orphan) }) : tx("Every route in the delivery table is in the route table."));
    }
    if (state.routes.length) {
      const odd = state.routes.filter((row) => row.Loading_Time_Min != null && (row.Loading_Time_Min <= 0 || row.Loading_Time_Min > 180)).length;
      if (odd) item(false, tx("{n} routes have a loading time of 0 or over 180 minutes.", { n: int.format(odd) }));
    }
    if (state.incidents.length) {
      const result = causeAnalysis(state.incidents, "Root_Cause_Category");
      item(result.otherShare <= 0.1, tx("Root cause “other”, “unknown” or empty: {p} of incidents{hint}.", { p: pct(result.otherShare, 0), hint: result.otherShare > 0.1 ? tx(" – above 10%, the cause list is missing a name") : "" }));
      if (result.suggestions.length) item(false, tx("Similar root-cause names that may be one cause: {list}.", { list: result.suggestions.map(([a, b]) => `“${a}” / “${b}”`).join(", ") }));
    }
    if (state.actions.length) {
      const noOwner = state.actions.filter((a) => !a.Owner || !a.Deadline).length;
      item(!noOwner, noOwner ? tx("{n} actions have no owner or no deadline.", { n: noOwner }) : tx("Every action has an owner and a deadline."));
      const ac = actionCounts(asOf);
      if (ac.unverified) item(false, tx("{n} completed actions are not verified yet.", { n: ac.unverified }));
    }
    dq.append(list);
    out.push(dq);
    return out;
  };
  const exportValue = (name, field, value) => {
    const kind = C.TABLES[name].kinds[field];
    if (value == null) return "";
    if (kind === "time") return new Date(value * 6e4).toISOString().slice(0, 16).replace("T", " ");
    if (kind === "share") return Math.round(value * 10000) / 10000;
    return value;
  };

  // ---------- Deep dive ----------
  // One failure, its eligible rows, where it concentrates, the incidents that record it, and an
  // investigation that becomes an action in the tracker. A clicked segment narrows the evidence only.
  const DEEP_BY = Object.fromEntries(C.DEEP.map((m) => [m.id, m]));
  const KPI_TO_DEEP = { perfect: "imperfect", onTime: "late", incomplete: "incomplete", damage: "damage", cold: "temperature", first: "firstAttempt", notification: "notification", complaints: "complaint", loading: "loading", lateRoute: "departure", gateClose: "gate", coldScan: "coldScan" };
  const DEEP_PROMPTS = {
    late: ["Compare planned and actual departure, then separate a late departure from delay on the road.", "Check route density, capacity planning, traffic evidence and when the customer was told."],
    incomplete: ["Review bag build, trolley assignment, scan exceptions and the completeness check at route release.", "Check the warehouse-to-ramp handover and repeated bag or route mismatches before assigning an owner."],
    damage: ["Check packing, heavy items on top, loading sequence and the condition at the door.", "Look for clusters by product, vehicle, route and handling stage before naming a driver cause."],
    temperature: ["Check cold-room scan times, insulated boxes, the vehicle's cooling and exposure at the door.", "Contain the food safety risk first and confirm the actual readings before declaring compliance."],
    firstAttempt: ["Review access problems, driver attempts, route instructions, time windows and the support history.", "Separate what the driver can control from an unavailable customer or restricted access."],
    notification: ["Check when the ETA moved past the window and whether a message went out before it.", "Compare the notification rate by partner and shift; a manual step depends on who remembers it."],
    complaint: ["Check the complaint categories, remove duplicate case IDs and compare the reported incidents with the outcomes.", "Find the repeats and close the service-recovery loop with customer care."],
    imperfect: ["Break down which conditions failed on the same deliveries; never add the shares of separate categories.", "Find the overlapping failures and put customer harm before the raw count."],
    loading: ["Check trolley readiness, scanner distance, bag availability, ramp capacity and staffing per wave.", "Verify an action against the loading times after it, without giving up scan quality."],
    departure: ["Separate delay made before or at loading from dispatch approval and vehicle problems.", "Compare departure delays with customer lateness on the linked deliveries before claiming an impact."],
    missingBags: ["Check bag traceability, scan exceptions, the cold-room handover and the final vehicle check.", "Check whether the missing-bag flags match incomplete deliveries at the customer."],
    gate: ["Walk gates 1 to 13 after loading and check who owns closing them in the release routine.", "Treat an open gate as a safety matter and escalate unsafe events."],
    coldScan: ["Check that chilled and frozen bags are scanned inside the cooling area and stay under control.", "Review scanner availability, missing-bag escalation and trolley movement in the cold room."],
    safety: ["Review the 10 km/h yard limit, one-way traffic, safety vests and the recorded vehicle movements.", "Escalate unsafe conditions at once, then verify training and safe behaviour in the next shifts."],
  };
  const DIM_LABEL = { DSP: tx("Partner"), Shift: tx("Shift"), Zone: tx("Zone"), Week: tx("Week"), Driver_ID: tx("Driver"), Route_ID: tx("Route"), Ramp_Gate: tx("Ramp gate"), Vehicle_ID: tx("Vehicle") };
  const CASE_TEXT = { Open: tx("Open"), Investigating: tx("Investigating"), "Verification pending": tx("Verification pending"), "Verified effective": tx("Verified effective"), Reopened: tx("Reopened"), Hypothesis: tx("Hypothesis, not yet verified"), Verified: tx("Verified on the floor or in the records") };
  const CASE_FORM = [
    ["title", tx("Investigation title"), "text"], ["status", tx("Stage"), C.CASE_STATUS],
    ["problem", tx("Problem"), "textarea"], ["evidence", tx("Verified evidence and its source"), "textarea"],
    ["where", tx("Where in the process"), "text"], ["rootStatus", tx("Root cause"), C.ROOT_STATUS],
    ["why1", tx("Why 1"), "text"], ["why2", tx("Why 2"), "text"], ["why3", tx("Why 3"), "text"], ["why4", tx("Why 4"), "text"], ["why5", tx("Why 5"), "text"],
    ["root", tx("Process failure behind it (hypothesis until verified)"), "textarea"], ["containment", tx("Containment, now"), "textarea"],
    ["corrective", tx("Corrective action"), "textarea"], ["preventive", tx("Preventive action"), "textarea"],
    ["owner", tx("Owner"), "text"], ["deadline", tx("Deadline"), "date"],
    ["verifyMetric", tx("Verification metric or method"), "text"], ["verifyResult", tx("Verification result and evidence"), "textarea"],
  ];
  const deepMetric = () => DEEP_BY[state.deep.metric] || DEEP_BY.incomplete;
  const deepTable = (metric) => (metric.grain === "routes" ? state.routes : state.deliveries);
  const deepTarget = (metric) => {
    if (!metric.kpi) return null;
    const t = state.targets[metric.kpi];
    return t == null ? null : metric.inverse ? 1 - t : t;
  };
  const deepDims = (metric) => C.DEEP_DIMS[metric.grain];
  const deepRange = () => ({ from: state.filters.from || view().first, to: state.filters.to || view().last });
  const deepRate = (v) => (v == null ? "–" : pct(v, 2));
  const deepPoints = (v) => (v == null ? "–" : `${v > 0 ? "+" : v < 0 ? "−" : "±"}${num(Math.abs(v) * 100, 2)} ${tx("pts")}`);
  const grainWords = (metric, n) => (metric.grain === "routes" ? tx("{n} routes", { n: int.format(n) }) : tx("{n} deliveries", { n: int.format(n) }));
  const deepLabel = (metric) => {
    if (metric.id === "loading") return tx("Routes loading over {m} min", { m: num(metric.over(settingsFor()), settingsFor().loadingTarget % 1 ? 1 : 0) });
    if (metric.id === "departure") return tx("Routes leaving over {m} min late", { m: state.settings.lateMinutes });
    return tx(metric.label);
  };
  const segmentText = (dim, segment) => `${DIM_LABEL[dim]} = ${segment || tx("Not stated")}`;
  // The current numbers: this period, the equal window before it, the segments and the incidents.
  const deepNumbers = () => {
    const metric = deepMetric();
    const dims = deepDims(metric);
    if (!dims.includes(state.deep.dim)) state.deep.dim = "DSP";
    const settings = settingsFor();
    const cols = present();
    const rows = view()[metric.grain === "routes" ? "r" : "d"];
    const agg = C.deepAggregate(rows, metric, settings, cols);
    const range = deepRange();
    const prior = C.priorWindow(range.from, range.to);
    const before = state.deep.compare && prior ? C.deepAggregate(deepTable(metric).filter(inDims).filter((row) => row.Date && row.Date >= prior.from && row.Date <= prior.to), metric, settings, cols) : null;
    const segments = C.deepSegments(agg, state.deep.dim, state.deep.minN);
    if (state.deep.segment && !segments.some((seg) => seg.key === state.deep.segment)) state.deep.segment = "";
    const focused = state.deep.segment !== "";
    const focus = focused ? agg.affected.filter((row) => segmentOfRow(row, state.deep.dim) === state.deep.segment) : agg.affected;
    // Incidents in the period; a focused segment keeps those of the segment (by the same column, by
    // week, or by the routes of the segment when incidents do not carry the column).
    let incidents = view().i;
    if (focused) {
      const dim = state.deep.dim;
      if (dim === "Week") incidents = incidents.filter((row) => row.Date && C.isoWeek(row.Date) === state.deep.segment);
      else if (C.FIELDS.incidents.includes(dim)) incidents = incidents.filter((row) => String(row[dim] ?? "") === state.deep.segment);
      else {
        const routes = new Set(agg.eligible.filter((row) => segmentOfRow(row, dim) === state.deep.segment).map((row) => `${row.Date}|${row.Route_ID}`));
        incidents = incidents.filter((row) => routes.has(`${row.Date}|${row.Route_ID}`));
      }
    }
    const signals = C.deepIncidents(incidents, metric, focus);
    const segmentN = focused ? (segments.find((seg) => seg.key === state.deep.segment) || { n: 0 }).n : null;
    return { metric, dims, agg, range, prior, before, segments, focus, focused, signals, segmentN, target: deepTarget(metric) };
  };
  const segmentOfRow = (row, dim) => (dim === "Week" ? (row.Date ? C.isoWeek(row.Date) : "") : String(row[dim] ?? ""));
  // Weekly failure rate as columns, with the approved maximum as a dashed line.
  const deepTrend = (points, target, metric) => {
    const W = 680;
    const H = 220;
    const left = 50;
    const right = 14;
    const top = 18;
    const bottom = 34;
    const figure = el("figure", "cx-mini cx-deep-trend");
    if (!points.length) { figure.append(el("p", "dl-panel-note", tx("No eligible rows in this period."))); return figure; }
    const maxRate = Math.max(0.01, ...points.map((p) => p.rate), target ?? 0) * 1.15;
    const areaW = W - left - right;
    const areaH = H - top - bottom;
    const x = (i) => left + ((i + 0.5) * areaW) / points.length;
    const y = (v) => H - bottom - (v / maxRate) * areaH;
    const svg = svgEl("svg", { viewBox: `0 0 ${W} ${H}`, class: "cx-mini-chart", role: "img", "aria-label": `${deepLabel(metric)}: ${points.map((p) => `${p.week} ${deepRate(p.rate)}`).join(", ")}` });
    [0, 0.25, 0.5, 0.75, 1].forEach((f) => {
      const v = maxRate * f;
      svg.append(svgEl("line", { x1: left, x2: W - right, y1: y(v), y2: y(v), style: "stroke: var(--cx-grid)", "stroke-width": 1 }));
      svg.append(svgEl("text", { x: left - 6, y: y(v) + 4, "text-anchor": "end", "font-size": 11, style: "fill: var(--cx-muted)" }, pct(v, v < 0.1 ? 1 : 0)));
    });
    if (target != null) svg.append(svgEl("line", { x1: left, x2: W - right, y1: y(target), y2: y(target), style: "stroke: var(--cx-target)", "stroke-width": 1.5, "stroke-dasharray": "5 4" }));
    const barW = Math.min(64, areaW / (points.length * 1.7));
    const step = points.length > 10 ? Math.ceil(points.length / 8) : 1;
    points.forEach((p, i) => {
      const over = target != null && p.rate > target + 1e-9;
      const bar = svgEl("rect", { x: x(i) - barW / 2, y: y(p.rate), width: barW, height: Math.max(0, y(0) - y(p.rate)), rx: 3, style: `fill: ${over ? "var(--cx-bad)" : "var(--cx-line)"}; opacity: .85`, tabindex: 0 });
      bar.append(svgEl("title", {}, `${p.week}: ${int.format(p.k)} / ${int.format(p.n)} (${deepRate(p.rate)})${over ? ` · ${tx("off target")}` : ""}`));
      svg.append(bar);
      if (i % step === 0 || i === points.length - 1) svg.append(svgEl("text", { x: x(i), y: H - 12, "text-anchor": "middle", "font-size": 11, style: "fill: var(--cx-muted)" }, p.week.slice(5)));
      if (points.length <= 12) svg.append(svgEl("text", { x: x(i), y: y(p.rate) - 6, "text-anchor": "middle", "font-size": 11, "font-weight": 700, style: "fill: var(--cx-text)" }, deepRate(p.rate)));
    });
    figure.append(svg);
    figure.append(el("figcaption", null, tx("{n} weeks. Each column is that week's cases divided by its eligible rows, not an average of daily rates.", { n: int.format(points.length) }) + (target != null ? ` ${tx("Dashed line: the approved maximum.")}` : "")));
    return figure;
  };
  const setDeep = (patch) => {
    Object.assign(state.deep, patch);
    save();
    renderPanel();
  };
  const caseNote = () => $("[data-cx-case-note]");
  const sayCase = (message, bad) => {
    const node = caseNote();
    if (!node) return;
    node.textContent = message;
    node.classList.toggle("is-bad", Boolean(bad));
  };
  const caseById = (id) => state.cases.find((item) => item.id === id);
  const newCaseId = () => {
    const stamp = window.ToolKit.today().replace(/-/g, "");
    let n = state.cases.length + 1;
    while (state.cases.some((item) => item.id === `INV-${stamp}-${String(n).padStart(3, "0")}`)) n += 1;
    return `INV-${stamp}-${String(n).padStart(3, "0")}`;
  };
  const snapshotOf = (numbers) => ({
    metric: numbers.metric.id, label: deepLabel(numbers.metric), from: numbers.range.from, to: numbers.range.to,
    DSP: state.filters.DSP, Shift: state.filters.Shift, Zone: state.filters.Zone, dim: state.deep.dim, segment: state.deep.segment,
    k: numbers.agg.k, n: numbers.agg.n, focus: numbers.focus.length, source: state.example ? tx("Example") : [...new Set(Object.values(state.sources))].join(", "),
  });
  // Save the draft as a case; silent: no message when nothing is wrong.
  const saveCase = (numbers, silent) => {
    const errors = C.caseCheck(state.draft);
    if (errors.includes("title")) { sayCase(tx("Give the investigation a title first."), true); return null; }
    if (errors.includes("verified")) { sayCase(tx("“Verified effective” needs a root cause verified on the floor or in the records, written evidence, the process failure and a verification result."), true); return null; }
    const id = state.caseId || newCaseId();
    const old = caseById(id);
    const row = { ...(old || {}), id, updated: window.ToolKit.today(), ...Object.fromEntries(C.CASE_FIELDS.map((field) => [field, String(state.draft[field] ?? "")])), snapshot: old?.snapshot || snapshotOf(numbers) };
    if (old) state.cases[state.cases.indexOf(old)] = row;
    else state.cases.push(row);
    state.caseId = id;
    save();
    if (!silent) sayCase(tx("{id} saved in this browser. Export the register before you change device.", { id }));
    return row;
  };
  const startCase = (metric) => {
    state.caseId = "";
    state.draft = { title: tx("{metric}: investigation", { metric: deepLabel(metric) }), status: "Open", rootStatus: "Hypothesis" };
    save();
  };
  const caseRegisterRows = () => {
    const head = ["Case_ID", "Last_Updated", ...C.CASE_FIELDS, "Action_ID", "Metric", "Period_Start", "Period_End", "Partner", "Shift", "Zone", "Dimension", "Segment", "Affected", "Eligible", "Source"];
    return [head, ...state.cases.map((item) => [item.id, item.updated, ...C.CASE_FIELDS.map((field) => item[field] ?? ""), item.actionId || "", item.snapshot?.label || "", item.snapshot?.from || "", item.snapshot?.to || "", item.snapshot?.DSP || "", item.snapshot?.Shift || "", item.snapshot?.Zone || "", item.snapshot?.dim || "", item.snapshot?.segment || "", item.snapshot?.k ?? "", item.snapshot?.n ?? "", item.snapshot?.source || ""])];
  };
  const downloadText = (name, body, type) => {
    const link = el("a");
    link.href = URL.createObjectURL(new Blob([body], { type }));
    link.download = name;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  };
  // The register of cases from a CSV this page exported (or the same columns typed elsewhere).
  const importCases = async (file) => {
    try {
      const rows = parseRows(P.decode(await file.arrayBuffer()));
      const header = rows[0] || [];
      const col = (name) => header.findIndex((cell) => P.fold(cell) === P.fold(name));
      if (col("Case_ID") < 0 || col("title") < 0) { sayCase(tx("Not a case register: it needs the columns Case_ID and title."), true); return; }
      let count = 0;
      rows.slice(1).forEach((cells) => {
        const get = (name) => (col(name) >= 0 ? String(cells[col(name)] ?? "") : "");
        const id = get("Case_ID").trim();
        if (!id || !get("title").trim()) return;
        const row = { id, updated: parseDate(get("Last_Updated")) || window.ToolKit.today(), ...Object.fromEntries(C.CASE_FIELDS.map((field) => [field, get(field)])), actionId: get("Action_ID"),
          snapshot: { metric: "", label: get("Metric"), from: parseDate(get("Period_Start")), to: parseDate(get("Period_End")), DSP: get("Partner"), Shift: get("Shift"), Zone: get("Zone"), dim: get("Dimension"), segment: get("Segment"), k: Number(get("Affected")) || 0, n: Number(get("Eligible")) || 0, source: get("Source") || tx("Imported register") } };
        if (!C.CASE_STATUS.includes(row.status)) row.status = "Open";
        if (!C.ROOT_STATUS.includes(row.rootStatus)) row.rootStatus = "Hypothesis";
        row.deadline = parseDate(row.deadline);
        const old = caseById(id);
        if (old) state.cases[state.cases.indexOf(old)] = { ...old, ...row };
        else state.cases.push(row);
        count += 1;
      });
      save();
      renderPanel();
      sayCase(tx("{n} investigations imported or updated.", { n: int.format(count) }));
    } catch {
      sayCase(tx("{name} could not be read. Save it as CSV and try again.", { name: file.name }), true);
    }
  };
  const briefText = (numbers) => {
    const { metric, agg, range, before, prior, segments, focus, signals, target } = numbers;
    const lines = [`# ${tx("Deep dive")}: ${deepLabel(metric)}`, "", `${tx("Period")}: ${showDate(range.from)} – ${showDate(range.to)}`,
      `${tx("Filters")}: ${tx("Partner")} ${state.filters.DSP || tx("All")}, ${tx("Shift")} ${state.filters.Shift || tx("All")}, ${tx("Zone")} ${state.filters.Zone || tx("All")}`,
      `${tx("Focus")}: ${numbers.focused ? segmentText(state.deep.dim, state.deep.segment) : tx("All segments")}`, `${tx("Source")}: ${snapshotOf(numbers).source || "–"}`, "",
      `## ${tx("Counts")}`, `- ${tx("Eligible")}: ${int.format(agg.n)}`, `- ${tx("Affected")}: ${int.format(agg.k)}`, `- ${tx("Failure rate")}: ${deepRate(agg.rate)}`, `- ${tx("Left out, no valid outcome")}: ${int.format(agg.excluded)}`,
      `- ${tx("Approved maximum")}: ${target == null ? tx("none") : deepRate(target)}`];
    if (before) lines.push(`- ${tx("Previous equal window")} (${showDate(prior.from)} – ${showDate(prior.to)}): ${before.n ? `${deepRate(before.rate)}, ${int.format(before.k)} / ${int.format(before.n)}` : tx("no eligible rows")}`);
    lines.push(`- ${tx("Affected rows in focus")}: ${int.format(focus.length)}`, `- ${tx("Incidents of this kind")}: ${int.format(signals.records.length)}; ${tx("with an exact link to an affected row")}: ${int.format(signals.linked)}`, "", `## ${tx("Largest contributors by cases")} (${DIM_LABEL[state.deep.dim]})`);
    segments.slice(0, 10).forEach((seg) => lines.push(`- ${seg.key || tx("Not stated")}: ${int.format(seg.k)} / ${int.format(seg.n)}, ${deepRate(seg.rate)}, ${pct(seg.share, 0)} ${tx("of all cases")}${seg.low ? ` (${tx("little data")})` : ""}`));
    const causes = signals.records.length ? causeAnalysis(signals.records, "Root_Cause_Category").items.slice(0, 8) : [];
    if (causes.length) { lines.push("", `## ${tx("Recorded root causes (a classification, not proof)")}`); causes.forEach((item) => lines.push(`- ${item.key}: ${int.format(item.amount)}`)); }
    lines.push("", `## ${tx("Investigation")}${state.caseId ? ` ${state.caseId}` : ""}`);
    CASE_FORM.forEach(([field, label]) => lines.push(`- ${label}: ${String(state.draft[field] || "").trim() || tx("not entered")}`));
    lines.push("", `## ${tx("Rules")}`, `- ${tx("A cause stays a hypothesis until the process and the records confirm it.")}`, `- ${tx("Incident counts and failure counts have different denominators.")}`, `- ${tx("A small sample is not evidence for escalation.")}`, "", `${tx("Generated")}: ${showDate(window.ToolKit.today())}`);
    return lines.join("\n");
  };
  const renderDeep = () => {
    const out = [];
    const hasRows = state.deliveries.length || state.routes.length;
    if (!hasRows) return [emptyPanel(hasData() ? tx("The deep dive needs the delivery or the route table.") : tx("No data yet. Load the example to see the control tower at work, or import your own files."))];
    const numbers = deepNumbers();
    const { metric, dims, agg, range, prior, before, segments, focus, focused, signals, segmentN, target } = numbers;
    const metricGrain = (m) => (m.grain === "routes" ? state.routes.length : state.deliveries.length);
    // Controls
    const controls = el("div", "dl-grid cx-controls cx-deep-controls");
    const pick = (id, labelText, options, value, onChange) => {
      const field = el("div", "field");
      const lab = el("label", null, labelText);
      lab.htmlFor = id;
      const select = el("select");
      select.id = id;
      options.forEach(([v, text]) => { const o = el("option", null, text); o.value = v; select.append(o); });
      select.value = value;
      select.addEventListener("change", () => onChange(select.value));
      field.append(lab, select);
      return field;
    };
    controls.append(pick("cx-deep-metric", tx("Failure to investigate"), C.DEEP.filter(metricGrain).map((m) => [m.id, deepLabel(m)]), metric.id, (value) => {
      const next = DEEP_BY[value];
      setDeep({ metric: value, segment: "", dim: deepDims(next).includes(state.deep.dim) ? state.deep.dim : "DSP", minN: next.grain === "routes" ? 15 : 50 });
    }));
    controls.append(pick("cx-deep-dim", tx("Break down by"), dims.map((dim) => [dim, DIM_LABEL[dim]]), state.deep.dim, (value) => setDeep({ dim: value, segment: "" })));
    const minField = el("div", "field");
    const minLab = el("label", null, tx("Sample floor (eligible rows)"));
    minLab.htmlFor = "cx-deep-min";
    const minInput = el("input");
    minInput.id = "cx-deep-min";
    minInput.type = "number";
    minInput.min = "1";
    minInput.max = "100000";
    minInput.value = String(state.deep.minN);
    minInput.addEventListener("change", () => {
      const n = Math.round(Number(minInput.value));
      if (Number.isFinite(n) && n >= 1) setDeep({ minN: n });
      else minInput.value = String(state.deep.minN);
    });
    minField.append(minLab, minInput);
    controls.append(minField);
    const cmpField = el("div", "field cx-deep-check");
    const cmpLabel = el("label", "cx-check-label");
    const cmp = el("input");
    cmp.type = "checkbox";
    cmp.checked = state.deep.compare;
    cmp.addEventListener("change", () => setDeep({ compare: cmp.checked }));
    cmpLabel.append(cmp, el("span", null, tx("Compare with the equal window before")));
    cmpField.append(cmpLabel);
    controls.append(cmpField);
    out.push(controls);
    out.push(el("p", "dl-panel-note", tx("Uses the date, partner, shift and zone filters above. A clicked segment narrows the evidence, not the overall numbers. Segment rates use their own eligible rows; incident counts are a separate record.")));
    if (!agg.n) { out.push(emptyPanel(tx("No eligible rows for this failure in this selection."))); return out; }
    // Cards
    const change = before && before.n && agg.n ? agg.rate - before.rate : null;
    const stats = el("div", "dl-stats");
    const rateStat = stat(tx("Failure rate"), deepRate(agg.rate), target == null ? tx("No approved maximum") : `${tx("Approved maximum")} ≤ ${deepRate(target)}`);
    rateStat.classList.toggle("is-bad", target != null && agg.rate > target + 1e-9);
    stats.append(
      stat(tx("Affected"), int.format(agg.k), `${grainWords(metric, agg.n)} ${tx("eligible")}${agg.excluded ? ` · ${tx("{n} left out, no valid outcome", { n: int.format(agg.excluded) })}` : ""}`),
      rateStat,
      stat(tx("Previous equal window"), before && before.n ? deepRate(before.rate) : "–", prior ? `${showDate(prior.from)} – ${showDate(prior.to)} · ${before ? grainWords(metric, before.n) : tx("not compared")}` : tx("Needs a start and an end date.")),
      stat(tx("Change"), deepPoints(change), change == null ? tx("No rows in the window before.") : change < 0 ? tx("Fewer failures than before.") : change > 0 ? tx("More failures than before: look at what changed.") : tx("Unchanged.")),
    );
    out.push(stats);
    // Readout
    const head = el("article", "result-card cx-readout");
    head.append(el("p", "result-label", tx("Readout")));
    const top = segments.find((seg) => seg.k > 0 && !seg.low);
    head.append(el("h3", null, tx("{metric}: {k} of {n} eligible {grain} ({rate}), {from} to {to}.", { metric: deepLabel(metric), k: int.format(agg.k), n: int.format(agg.n), grain: metric.grain === "routes" ? tx("routes") : tx("deliveries"), rate: deepRate(agg.rate), from: showDate(range.from), to: showDate(range.to) })));
    const list = el("ul", "cx-readout-list");
    list.append(el("li", null, top
      ? tx("Largest contributor with enough data: {name} with {k} cases, {rate} of its {n} eligible rows and {share} of all cases.", { name: top.key || tx("Not stated"), k: int.format(top.k), rate: deepRate(top.rate), n: int.format(top.n), share: pct(top.share, 0) })
      : tx("No segment reaches the sample floor with at least one case.")));
    if (top && top.vsRest != null) list.append(el("li", null, top.vsRest > 0 ? tx("{name} fails {pts} more often than the rest of the period.", { name: top.key, pts: deepPoints(top.vsRest).replace("+", "") }) : tx("{name} does not fail more often than the rest: the count follows its volume.", { name: top.key })));
    if (target != null) list.append(el("li", null, agg.rate > target + 1e-9 ? tx("Above the approved maximum of {t}.", { t: deepRate(target) }) : tx("Within the approved maximum of {t}.", { t: deepRate(target) })));
    list.append(el("li", null, `${tx("This is descriptive evidence, not proof of why the failures happened.")} ${tx("Focus")}: ${focused ? segmentText(state.deep.dim, state.deep.segment) : tx("All segments")}.`));
    head.append(list);
    out.push(head);
    // Trend and segments
    const grid = el("div", "dl-result-grid");
    const trendBox = section(tx("Weekly failure rate"), tx("Numerator over its eligible denominator, week by week."));
    trendBox.append(deepTrend(C.deepWeekly(agg), target, metric));
    grid.append(trendBox);
    const segBox = section(tx("Where it concentrates"), tx("Ranked by cases. The rate is each segment's own; the share is of all cases. “Vs rest” compares the segment with the rest of the period only when both reach the sample floor."));
    const segRows = segments.slice(0, 35).map((seg) => {
      const tr = el("tr", seg.key === state.deep.segment && focused ? "is-selected" : "");
      const th = el("th");
      const button = el("button", "cx-seg", seg.key || tx("Not stated"));
      button.type = "button";
      button.setAttribute("aria-pressed", String(focused && seg.key === state.deep.segment));
      button.title = tx("Show the rows of this segment");
      button.addEventListener("click", () => setDeep({ segment: focused && seg.key === state.deep.segment ? "" : seg.key }));
      th.append(button);
      if (seg.low) th.append(" ", el("span", "dl-tag is-warn", tx("little data")));
      const bar = el("td", "cx-seg-bar");
      const track = el("div", "bar-track");
      const fill = el("div", "bar-fill");
      fill.style.width = `${(seg.k / Math.max(1, segments[0].k)) * 100}%`;
      track.append(fill);
      bar.append(track);
      tr.append(th, el("td", "num", int.format(seg.k)), el("td", "num", int.format(seg.n)), el("td", "num", deepRate(seg.rate)), el("td", "num", pct(seg.share, 0)), el("td", `num${seg.vsRest > 0 ? " is-off" : seg.vsRest != null && seg.vsRest < 0 ? " is-better" : ""}`, deepPoints(seg.vsRest)), bar);
      return tr;
    });
    segBox.append(table([DIM_LABEL[state.deep.dim], { text: tx("Cases"), className: "num" }, { text: tx("Eligible"), className: "num" }, { text: tx("Rate"), className: "num" }, { text: tx("Share of cases"), className: "num" }, { text: tx("Vs rest"), className: "num" }, ""], segRows, "cx-seg-table"));
    const segNote = [tx("Sample floor: {n} eligible rows.", { n: int.format(state.deep.minN) })];
    if (segments.length > 35) segNote.push(tx("Top 35 of {n} shown.", { n: int.format(segments.length) }));
    if (focused) {
      const clear = el("button", "button-ghost", tx("Clear the segment"));
      clear.type = "button";
      clear.addEventListener("click", () => setDeep({ segment: "" }));
      const p = el("p", "dl-panel-note");
      p.append(`${segNote.join(" ")} `, clear);
      segBox.append(p);
    } else segBox.append(el("p", "dl-panel-note", segNote.join(" ")));
    grid.append(segBox);
    out.push(grid);
    // Cause signals and next checks
    const pair = el("div", "dl-result-grid");
    const causeBox = section(tx("Recorded cause signals"), signals.typed ? tx("Incidents whose type records this failure, grouped by their root cause.") : tx("All incidents in scope, grouped by their root cause."));
    if (!state.incidents.length) causeBox.append(el("p", "dl-panel-note", tx("No incident log yet. One row per incident with its type, root cause, owner, severity and status.")));
    else if (!signals.records.length) causeBox.append(el("p", "dl-panel-note", tx("No incident of this kind in the scope. That does not mean no failure happened.")));
    else {
      causeBox.append(el("p", "dl-panel-note", tx("{n} incidents of this kind; {linked} name one of the {k} affected rows exactly. Incident counts can differ from failure counts.", { n: int.format(signals.records.length), linked: int.format(signals.linked), k: int.format(focus.length) })));
      const result = causeAnalysis(signals.records, "Root_Cause_Category");
      causeBox.append(barList(result.items.slice(0, 8).map((item) => ({ key: item.key, value: item.amount, share: item.share, cls: item.cls })), {
        label: (item) => [int.format(item.value), ` · ${pct(item.share, 0)}`],
        highlight: (item) => item.cls === "A" && !P.isOther(item.key),
      }));
    }
    causeBox.append(el("p", "dl-warning", tx("Evidence rule: a recorded category says where to look, not what the cause is. Verify with scans, Gemba, temperature records, handover and repeat checks.")));
    pair.append(causeBox);
    const logicBox = section(tx("Investigation logic and next checks"));
    logicBox.append(el("p", "cx-deep-observed", tx("Observed: {k} affected rows in the focus, {n} incidents of this kind to review.", { k: int.format(focus.length), n: int.format(signals.records.length) })));
    if (focused && segmentN < state.deep.minN) logicBox.append(el("p", "dl-warning", tx("This segment is under the sample floor of {n}. Do not rank or escalate on its rate alone.", { n: int.format(state.deep.minN) })));
    const ol = el("ol", "cx-agenda");
    (DEEP_PROMPTS[metric.id] || []).forEach((prompt) => ol.append(el("li", null, tx(prompt))));
    ol.append(el("li", null, tx("Walk the control chain before naming an owner: warehouse, outbound, last mile, partner, driver, customer care.")));
    if (["temperature", "coldScan", "safety", "gate"].includes(metric.id)) ol.append(el("li", null, tx("Safety and cold chain: contain and escalate now, investigate after.")));
    logicBox.append(el("p", "result-label", tx("Gemba and evidence checks")), ol);
    logicBox.append(el("p", "dl-panel-note", tx("Hypothesis → check the records or the floor → process cause → containment → corrective action → prevention → owner → deadline → control after the action.")));
    pair.append(logicBox);
    out.push(pair);
    // Evidence rows
    const evBox = section(tx("Traceable rows"), `${focused ? segmentText(state.deep.dim, state.deep.segment) : tx("All segments")} · ${tx("{n} affected rows; the first 60 are shown, the CSV has all.", { n: int.format(focus.length) })}`);
    const mark = (v) => (v == null ? "–" : v === 1 ? "✓" : "✗");
    const columns = metric.grain === "routes"
      ? [[tx("Date"), (r) => showDate(r.Date)], [tx("Route"), (r) => r.Route_ID], [tx("Driver"), (r) => r.Driver_ID], [tx("Partner"), (r) => r.DSP], [tx("Shift"), (r) => r.Shift], [tx("Zone"), (r) => r.Zone], [tx("Loading (min)"), (r) => (r.Loading_Time_Min == null ? "–" : num(r.Loading_Time_Min, 1))], [tx("Delay (min)"), (r) => (r.Departure_Delay_Min == null ? "–" : int.format(Math.round(r.Departure_Delay_Min)))], [tx("Missing bags"), (r) => (r.Missing_Bag_Events == null ? "–" : int.format(r.Missing_Bag_Events))], [tx("Gate closed"), (r) => mark(r.Gate_Closed_Compliant)], [tx("Cold scan"), (r) => mark(r.Cold_Scan_Compliant)], [tx("Yard speed"), (r) => (r.Yard_Speed_Breach == null ? "–" : r.Yard_Speed_Breach > 0 ? "✗" : "✓")]]
      : [[tx("Date"), (r) => showDate(r.Date)], [tx("Delivery"), (r) => r.Delivery_ID], [tx("Route"), (r) => r.Route_ID], [tx("Driver"), (r) => r.Driver_ID], [tx("Partner"), (r) => r.DSP], [tx("Shift"), (r) => r.Shift], [tx("Zone"), (r) => r.Zone], [tx("On time"), (r) => mark(r.On_Time)], [tx("Complete"), (r) => mark(r.Complete)], [tx("Undamaged"), (r) => mark(r.Damage_Free)], [tx("Temperature"), (r) => mark(r.Temp_Compliant)], [tx("First attempt"), (r) => mark(r.First_Attempt)], [tx("Told"), (r) => (r.Notification_Eligible === 1 ? mark(r.Customer_Notified) : "–")], [tx("Complaint"), (r) => (r.Complaint === 1 ? "✗" : r.Complaint === 0 ? "" : "–")]];
    if (!focus.length) evBox.append(el("p", "dl-panel-note", tx("No affected rows in this focus.")));
    else evBox.append(table(columns.map(([text]) => text), focus.slice(0, 60).map((row) => {
      const tr = el("tr");
      columns.forEach(([, get], i) => tr.append(el(i === 1 ? "th" : "td", null, String(get(row) ?? "") || "–")));
      return tr;
    })));
    const evButtons = el("div", "tool-actions");
    const csv = el("button", "button-secondary", tx("Affected rows as CSV"));
    csv.type = "button";
    csv.disabled = !focus.length;
    csv.addEventListener("click", () => downloadCsv(`cx-deep-${metric.id}`, [C.FIELDS[metric.grain], ...focus.map((row) => C.FIELDS[metric.grain].map((field) => exportValue(metric.grain, field, row[field])))]));
    const copyBrief = el("button", "button-primary", tx("Copy the brief"));
    copyBrief.type = "button";
    copyBrief.addEventListener("click", () => copy(briefText(deepNumbers()), copyBrief));
    const mdBrief = el("button", "button-secondary", tx("Brief as Markdown"));
    mdBrief.type = "button";
    mdBrief.addEventListener("click", () => downloadText(`cx-deep-${metric.id}-${window.ToolKit.today()}.md`, briefText(deepNumbers()), "text/markdown;charset=utf-8"));
    evButtons.append(copyBrief, mdBrief, csv);
    evBox.append(evButtons);
    out.push(evBox);
    // Investigation workspace
    const work = section(tx("Investigation and CAPA workspace"), tx("Evidence and hypotheses stay apart. A Pareto never confirms a root cause on its own."));
    const chip = el("p", "cx-case-head");
    chip.append(el("span", `cx-chip ${state.caseId ? "is-open" : "is-wait"}`, state.caseId || tx("New investigation")));
    if (state.caseId && caseById(state.caseId)?.actionId) chip.append(" ", el("span", "cx-chip is-done", `${tx("Action")} ${caseById(state.caseId).actionId}`));
    work.append(chip);
    if (!Object.keys(state.draft).length) startCase(metric);
    const form = el("div", "dl-grid cx-case-form");
    CASE_FORM.forEach(([field, labelText, kind]) => {
      const wrap = el("div", `field${kind === "textarea" || field === "title" ? " dl-wide" : ""}`);
      const id = `cx-case-${field}`;
      const lab = el("label", null, labelText);
      lab.htmlFor = id;
      let input;
      if (Array.isArray(kind)) {
        input = el("select");
        kind.forEach((value) => { const o = el("option", null, CASE_TEXT[value] || value); o.value = value; input.append(o); });
        input.value = kind.includes(state.draft[field]) ? state.draft[field] : kind[0];
      } else if (kind === "textarea") {
        input = el("textarea");
        input.rows = 2;
        input.value = state.draft[field] ?? "";
      } else {
        input = el("input");
        input.type = kind;
        input.autocomplete = "off";
        input.value = state.draft[field] ?? "";
      }
      input.id = id;
      input.addEventListener(Array.isArray(kind) || kind === "date" ? "change" : "input", () => {
        state.draft[field] = kind === "date" ? parseDate(input.value) : input.value;
        save();
      });
      wrap.append(lab, input);
      form.append(wrap);
    });
    work.append(form);
    const note = el("p", "dl-panel-note cx-case-note");
    note.dataset.cxCaseNote = "";
    note.setAttribute("role", "status");
    work.append(note);
    const caseButtons = el("div", "tool-actions");
    const saveButton = el("button", "button-primary", tx("Save the investigation"));
    saveButton.type = "button";
    saveButton.addEventListener("click", () => {
      const row = saveCase(deepNumbers(), true);
      if (!row) return;
      renderPanel();
      sayCase(tx("{id} saved in this browser. Export the register before you change device.", { id: row.id }));
    });
    const capa = el("button", "button-secondary", tx("Create the linked action"));
    capa.type = "button";
    capa.addEventListener("click", () => {
      if (!C.capaReady(state.draft)) { sayCase(tx("The action needs a containment, corrective or preventive action, an owner and a deadline."), true); return; }
      const row = saveCase(deepNumbers(), true);
      if (!row) return;
      if (row.actionId && state.actions.some((a) => a.Action_ID === row.actionId)) { sayCase(tx("{id} is already linked to action {action}. Update it under Actions instead of adding another.", { id: row.id, action: row.actionId }), true); return; }
      const id = nextActionId();
      state.actions.push(C.caseToAction(state.draft, id, view().asOf, row.id, { hypothesis: tx("Working hypothesis, not verified"), investigation: tx("Investigation") }));
      state.columns.actions = [...C.FIELDS.actions];
      row.actionId = id;
      openAction = state.actions.length - 1;
      save();
      renderPanel();
      sayCase(tx("Action {action} created and linked to {id}. Close it only after the result shows it worked.", { action: id, id: row.id }));
    });
    const fresh = el("button", "button-ghost", tx("New investigation"));
    fresh.type = "button";
    fresh.addEventListener("click", () => { startCase(metric); renderPanel(); sayCase(tx("New draft. Record the evidence before naming a cause.")); });
    const register = el("button", "button-secondary", tx("Case register as CSV"));
    register.type = "button";
    register.disabled = !state.cases.length;
    register.addEventListener("click", () => downloadCsv("cx-investigations", caseRegisterRows()));
    const importLabel = el("label", "cv-file button-secondary", tx("Import a case register"));
    const importInput = el("input");
    importInput.type = "file";
    importInput.accept = ".csv,.txt,text/csv";
    importInput.addEventListener("change", () => { if (importInput.files[0]) importCases(importInput.files[0]); importInput.value = ""; });
    importLabel.append(importInput);
    caseButtons.append(saveButton, capa, fresh, register, importLabel);
    work.append(caseButtons);
    out.push(work);
    // Saved cases
    const saved = section(tx("Saved investigations"), tx("Kept in this browser. Export the register as a backup before you change browser or device."));
    if (!state.cases.length) saved.append(el("p", "dl-panel-note", tx("No investigation saved yet.")));
    else {
      saved.append(table([tx("ID"), tx("Investigation"), tx("Failure and period"), tx("Owner"), tx("Stage"), tx("Deadline"), tx("Action"), ""], [...state.cases].reverse().map((item) => {
        const tr = el("tr", item.id === state.caseId ? "is-selected" : "");
        const manage = el("td", "cx-case-manage");
        const open = el("button", "button-ghost", tx("Open it"));
        open.type = "button";
        open.addEventListener("click", () => {
          state.caseId = item.id;
          state.draft = Object.fromEntries(C.CASE_FIELDS.map((field) => [field, item[field] ?? ""]));
          save();
          renderPanel();
          sayCase(tx("{id} opened. Its numbers are those of the filters when it was first saved.", { id: item.id }));
          $(".cx-case-form")?.scrollIntoView?.({ behavior: "smooth", block: "start" });
        });
        const remove = el("button", "button-ghost", tx("Delete"));
        remove.type = "button";
        remove.addEventListener("click", () => {
          if (!window.confirm(tx("Delete investigation {id}? A linked action stays in the tracker.", { id: item.id }))) return;
          state.cases.splice(state.cases.indexOf(item), 1);
          if (state.caseId === item.id) startCase(metric);
          save();
          renderPanel();
        });
        manage.append(open, " ", remove);
        const period = el("td");
        period.append(item.snapshot?.label || "–", el("span", "dl-stat-note", ` ${showDate(item.snapshot?.from || "")} – ${showDate(item.snapshot?.to || "")}${item.snapshot?.segment ? ` · ${item.snapshot.segment}` : ""}`));
        tr.append(el("th", null, item.id), el("td", null, item.title), period, el("td", null, item.owner || tx("no owner")), el("td", null, CASE_TEXT[item.status] || item.status), el("td", null, item.deadline ? showDate(item.deadline) : "–"), el("td", null, item.actionId || "–"), manage);
        return tr;
      })));
    }
    out.push(saved);
    return out;
  };

  // ---------- Render ----------
  const RENDER = { overview: renderOverview, operations: renderOperations, deep: renderDeep, scorecards: renderScorecards, causes: renderCauses, actions: renderActions, review: renderReview, data: renderData };
  const renderPanel = () => {
    body.setAttribute("aria-labelledby", `cx-tab-${state.tab}`);
    body.replaceChildren(...RENDER[state.tab]());
    $("[data-cx-example-flag]").hidden = !state.example;
  };
  const render = () => {
    if (!hasData() && state.tab !== "data") state.tab = "overview";
    renderFilters();
    renderTabs();
    renderPanel();
  };
  // A first visit opens on the example station, so the control tower is visible at once (the flag says so).
  // Nothing is written to the browser until the visitor acts.
  if (!hasData() && firstVisit(cfg.storageKey)) showExample();
  render();
})();
