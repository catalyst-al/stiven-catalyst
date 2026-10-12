const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

// The Control Tower engine runs without its page: no [data-cx] element, so only window.CxTower is set up.
const context = {
  window: {},
  document: { documentElement: { lang: 'en' }, querySelector: () => null, getElementById: () => null, currentScript: null },
  TextEncoder, TextDecoder, Blob, Response, DecompressionStream, URL, Intl,
};
for (const file of ['tool-kit', 'docx-kit', 'cv-import', 'pareto', 'cx-tower']) {
  vm.runInNewContext(fs.readFileSync(`src/js/${file}.js`, 'utf8'), context);
}
const { CxTower: C, Pareto, CvImport, DocxKit } = context.window;
const plain = (value) => JSON.parse(JSON.stringify(value));
const all = (name) => new Set(C.FIELDS[name]);
const settings = { lateMinutes: 5 };

const delivery = (over = {}) => ({ Date: '2026-09-21', DSP: 'A', Delivered: 1, On_Time: 1, Complete: 1, Damage_Free: 1, Temp_Compliant: null, First_Attempt: 1, Notification_Eligible: 0, Customer_Notified: 0, Complaint: 0, ...over });

test('yes/no cells in English, German and Albanian; anything else is flagged', () => {
  assert.deepEqual(['1', 'Yes', 'ja', 'Po', 'x', '0', 'No', 'nein', 'jo', '', '2', 'maybe'].map(C.bin), [1, 1, 1, 1, 1, 0, 0, 0, 0, null, NaN, NaN]);
});

test('departure times from ISO text, German dates, Excel serials and bare times', () => {
  const base = Date.parse('2026-08-31T00:00:00Z') / 6e4;
  assert.equal(C.minutes('2026-08-31T07:57', ''), base + 7 * 60 + 57);
  assert.equal(C.minutes('31.08.2026 07:57', ''), base + 7 * 60 + 57);
  assert.equal(C.minutes('46265.33125', ''), base + 7 * 60 + 57);
  assert.equal(C.minutes('07:57', '2026-08-31'), base + 7 * 60 + 57);
  // An Excel cell typed as a time only is a fraction of the row's day; German pages read it with a comma.
  assert.equal(C.minutes('0.33125', '2026-08-31'), base + 7 * 60 + 57);
  assert.equal(C.minutes('0,33125', '2026-08-31'), base + 7 * 60 + 57);
  assert.equal(C.minutes('.5', '2026-08-31'), base + 12 * 60);
  assert.equal(C.minutes('0', '2026-08-31'), base);
  assert.ok(Number.isNaN(C.minutes('0.33125', '')), 'a time alone needs the date of its row');
  assert.equal(C.minutes('', ''), null);
  assert.ok(Number.isNaN(C.minutes('soon', '')));
});

test('Perfect Delivery is checked per delivery, not multiplied from separate rates', () => {
  // Two deliveries, each failing a different condition: every single rate is 50%, perfect is 0%.
  const rows = [delivery({ On_Time: 0 }), delivery({ Complete: 0 })];
  const k = C.computeKpis(rows, [], settings, all('deliveries'));
  assert.equal(k.onTime.value, 0.5);
  assert.equal(k.incomplete.value, 0.5);
  assert.equal(k.perfect.value, 0);
  // A blank temperature cell means nothing chilled: it passes and is left out of cold chain.
  const cold = C.computeKpis([delivery(), delivery({ Temp_Compliant: 1 }), delivery({ Temp_Compliant: 0 })], [], settings, all('deliveries'));
  assert.equal(cold.cold.n, 2);
  assert.equal(cold.cold.value, 0.5);
  assert.equal(cold.perfect.value, 2 / 3);
  // A column the file does not have is left out of Perfect Delivery instead of failing it.
  const noFirst = new Set([...all('deliveries')].filter((f) => f !== 'First_Attempt'));
  assert.equal(C.computeKpis([delivery({ First_Attempt: null })], [], settings, noFirst).perfect.value, 1);
  assert.equal(C.computeKpis([delivery({ First_Attempt: null })], [], settings, all('deliveries')).perfect.n, 0);
});

test('each KPI uses its own denominator', () => {
  const rows = [
    delivery({ Notification_Eligible: 1, Customer_Notified: 1, On_Time: 0 }),
    delivery({ Notification_Eligible: 1, Customer_Notified: 0, On_Time: 0, Complaint: 1 }),
    delivery(), delivery(),
    delivery({ Delivered: 0, On_Time: 0 }),
  ];
  const k = C.computeKpis(rows, [], settings, all('deliveries'));
  assert.equal(k.onTime.n, 4);
  assert.equal(k.onTime.value, 0.5);
  assert.equal(k.notification.n, 2);
  assert.equal(k.notification.value, 0.5);
  assert.equal(k.complaints.value, 250);
  const routes = [{ Loading_Time_Min: 18, Departure_Delay_Min: 3, Gate_Closed_Compliant: 1, Cold_Scan_Compliant: null }, { Loading_Time_Min: 24, Departure_Delay_Min: 12, Gate_Closed_Compliant: 0, Cold_Scan_Compliant: 1 }, { Loading_Time_Min: null, Departure_Delay_Min: 5 }];
  const r = C.computeKpis([], routes, settings, all('deliveries'));
  assert.equal(r.loading.value, 21);
  assert.equal(r.loading.n, 2);
  assert.equal(r.lateRoute.value, 1 / 3);
  assert.equal(r.gateClose.value, 0.5);
  assert.equal(r.coldScan.n, 1);
});

test('targets: up, down, exactly on target, and no target', () => {
  const kpi = Object.fromEntries(C.KPIS.map((k) => [k.id, k]));
  assert.equal(C.judge(kpi.onTime, 0.98, 0.98), true);
  assert.equal(C.judge(kpi.onTime, 0.979, 0.98), false);
  assert.equal(C.judge(kpi.incomplete, 0.008, 0.008), true);
  assert.equal(C.judge(kpi.incomplete, 0.0081, 0.008), false);
  assert.equal(C.judge(kpi.perfect, 0.95, null), null);
  assert.equal(C.targetValue(kpi.onTime, '98%'), 0.98);
  assert.equal(C.targetValue(kpi.onTime, '0.98'), 0.98);
  assert.equal(C.targetValue(kpi.incomplete, '<=0.8%'), 0.008);
  assert.equal(C.targetValue(kpi.loading, '20 min'), 20);
});

test('route risk follows the workbook points and names each reason', () => {
  const risk = C.routeRisk({ Loading_Time_Min: 26, Departure_Delay_Min: 14, Scan_Compliance_Pct: 0.96, Gate_Closed_Compliant: 0, Cold_Scan_Compliant: 1, Yard_Speed_Breach: 0, Missing_Bag_Events: 2, Safety_Vest_Compliant: 0 }, { loadingTarget: 20 });
  assert.equal(risk.score, 25 + 20 + 15 + 15 + 10);
  assert.equal(risk.level, 'critical');
  assert.deepEqual(plain(risk.reasons.map(([kind]) => kind)), ['loading', 'late', 'scan', 'gate', 'bags', 'vest']);
  assert.equal(C.routeRisk({ Loading_Time_Min: 30 }, { loadingTarget: null }).score, 0);
});

test('ISO weeks across the year boundary', () => {
  assert.equal(C.isoWeek('2026-09-21'), '2026-W39');
  assert.equal(C.isoWeek('2026-09-27'), '2026-W39');
  assert.equal(C.isoWeek('2027-01-01'), '2026-W53');
  assert.equal(C.isoWeek('2025-12-29'), '2026-W01');
  assert.equal(C.weekMonday('2026-09-27'), '2026-09-21');
});

test('action states in several languages', () => {
  assert.deepEqual(['Completed', 'erledigt', 'E kryer', 'In Progress', 'in Arbeit', 'open', ''].map(C.actionStatus), ['Completed', 'Completed', 'Completed', 'In Progress', 'In Progress', 'Open', 'Open']);
  assert.deepEqual(['Effective', 'wirksam', 'Not effective', 'nicht wirksam', 'jo efektiv', 'Pending', ''].map(C.verification), ['Effective', 'Effective', 'Not effective', 'Not effective', 'Not effective', 'Pending', 'Pending']);
});

test('tables are recognised by their headers, also in German and below a title', () => {
  const de = [['Lieferungen September'], [], ['Datum', 'DSP', 'Tour', 'Fahrer', 'Auftrag', 'Pünktlich', 'Vollständig', 'Schadenfrei', 'Beschwerde'], ['21.09.2026', 'A', 'R1', 'D1', 'X1', 'ja', 'ja', 'nein', '0']];
  const hit = C.recognise(de);
  assert.equal(hit.name, 'deliveries');
  assert.equal(hit.headerRow, 2);
  const { records, issues } = C.toRecords(hit.name, de, hit.map, hit.headerRow);
  assert.equal(records.length, 1);
  assert.deepEqual([records[0].Date, records[0].On_Time, records[0].Damage_Free, records[0].Delivery_ID], ['2026-09-21', 1, 0, 'X1']);
  assert.equal(issues.length, 0);
  const routes = [['Date', 'Route_ID', 'Loading_Time_Min', 'Planned_Departure', 'Actual_Departure', 'Scan_Compliance_Pct'], ['2026-09-21', 'R1', '18,5', '2026-09-21 07:45', '2026-09-21 07:59', '97.5%'], ['2026-09-21', 'R2', 'long', '', '', '0.99']];
  const r = C.recognise(routes);
  assert.equal(r.name, 'routes');
  const parsed = C.toRecords('routes', routes, r.map, r.headerRow);
  assert.equal(parsed.records[0].Departure_Delay_Min, 14);
  assert.equal(parsed.records[0].Scan_Compliance_Pct, 0.975);
  assert.equal(parsed.records[1].Scan_Compliance_Pct, 0.99);
  // Excel time cells, a PM wave that leaves after midnight, and an early departure.
  const night = [['Date', 'Route_ID', 'Loading_Time_Min', 'Planned_Departure', 'Actual_Departure'],
    ['2026-09-21', 'R3', '20', '0.33125', '0.345833'], ['2026-09-21', 'R4', '20', '23:50', '00:10'], ['2026-09-21', 'R5', '20', '07:45', '07:30']];
  const n = C.recognise(night);
  const late = C.toRecords('routes', night, n.map, n.headerRow);
  assert.deepEqual(plain(late.records.map((row) => row.Departure_Delay_Min)), [21, 20, 0]);
  assert.equal(late.issues.length, 0);
  assert.deepEqual(plain(parsed.issues).map((i) => [i.field, i.lines]), [['Loading_Time_Min', [3]]]);
  // A sheet with only a few matching words is not a table.
  assert.equal(C.recognise([['Date', 'Note'], ['2026-09-21', 'x']]), null);
});

test('a whole workbook: four tables, the target sheet wins over a KPI dictionary, hidden sheets are skipped', async () => {
  const sheet = (rows) => `<worksheet><sheetData>${rows.map((row, r) => `<row r="${r + 1}">${row.map((v, c) => `<c r="${String.fromCharCode(65 + c)}${r + 1}" t="inlineStr"><is><t>${v}</t></is></c>`).join('')}</row>`).join('')}</sheetData></worksheet>`;
  const sheets = [
    ['START_HERE', [['Read me']]],
    ['DELIVERY_DATA', [['Date', 'DSP', 'Delivery_ID', 'On_Time', 'Complete', 'Damage_Free', 'First_Attempt'], ['2026-09-21', 'A', 'D1', '1', '1', '1', '1'], ['2026-09-21', 'A', 'D2', '0', '1', '1', '1']]],
    ['ROUTE_DATA', [['Date', 'Route_ID', 'Loading_Time_Min', 'Departure_Delay_Min', 'Gate_Closed_Compliant'], ['2026-09-21', 'R1', '19', '2', '1']]],
    ['INCIDENT_LOG', [['Incident_ID', 'Date', 'DSP', 'Incident_Type', 'Root_Cause_Category', 'Department_Owner', 'Severity', 'Status'], ['I1', '2026-09-21', 'A', 'Delay', 'Traffic', 'Last Mile', 'Low', 'Open']]],
    ['ACTION_TRACKER', [['Action_ID', 'Problem', 'Action', 'Owner', 'Deadline', 'Status', 'Verification_Status'], ['A1', 'Late PM', 'Cut-off', 'SM', '2026-10-01', 'Open', 'Pending']]],
    ['TARGETS', [['Targets'], [], ['Metric', 'Target', 'Direction'], ['On-Time Delivery Rate', '0.98', '>='], ['Late Route Rate', '', '<='], ['Average Loading Time', '20', '<=']]],
    ['LISTS', [['Incident_Type', 'Root_Cause_Category', 'Department_Owner', 'Severity', 'Date'], ['Delay', 'Traffic', 'LM', 'Low', '']]],
    ['KPI_DICTIONARY', [['Metric', 'Definition', 'Target'], ['Late Route Rate', 'x', '2%']]],
  ];
  const files = [
    { name: 'xl/workbook.xml', text: `<workbook><sheets>${sheets.map(([name], i) => `<sheet name="${name}" sheetId="${i + 1}"${name === 'LISTS' ? ' state="hidden"' : ''} r:id="rId${i + 1}"/>`).join('')}</sheets></workbook>` },
    { name: 'xl/_rels/workbook.xml.rels', text: `<Relationships>${sheets.map((_, i) => `<Relationship Id="rId${i + 1}" Type="worksheet" Target="worksheets/sheet${i + 1}.xml"/>`).join('')}</Relationships>` },
    ...sheets.map(([, rows], i) => ({ name: `xl/worksheets/sheet${i + 1}.xml`, text: sheet(rows) })),
  ];
  const bytes = DocxKit.zip(files);
  const book = await Pareto.readWorkbook(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), CvImport.unzip);
  assert.equal(book.length, 8);
  assert.equal(book[6].hidden, true);
  const { found, targets, targetSheet } = C.readSheets(book);
  assert.deepEqual(plain(found.map((f) => `${f.name}:${f.sheet}:${f.records.length}`)), ['deliveries:DELIVERY_DATA:2', 'routes:ROUTE_DATA:1', 'incidents:INCIDENT_LOG:1', 'actions:ACTION_TRACKER:1']);
  assert.equal(targetSheet, 'TARGETS');
  assert.deepEqual(plain(targets), { onTime: 0.98, lateRoute: null, loading: 20 });
});

test('an action tracker with Metric and Target columns is read as actions, not as targets', () => {
  const rows = [
    ['Action_ID', 'Problem', 'Action', 'Owner', 'Deadline', 'Metric', 'Baseline', 'Target', 'Verification_Status'],
    ['A1', 'Late PM wave', 'Move the cut-off', 'SM', '2026-10-01', 'Damage Rate', '1.1%', '<=0.8%', 'Pending'],
    ['A2', 'Loading', 'Dock plan', 'OM', '2026-10-05', 'Late Route Rate', '7%', '<=5%', 'Pending'],
  ];
  const { found, targets, targetSheet } = C.readSheets([{ name: 'actions.csv', rows, hidden: false }]);
  assert.deepEqual(plain(found.map((f) => `${f.name}:${f.records.length}`)), ['actions:2']);
  assert.equal(targets, null);
  assert.equal(targetSheet, '');
  // The German tracker, the same way.
  const de = rows.map((row, i) => (i ? row : ['Massnahme ID', 'Problem', 'Massnahme', 'Verantwortlich', 'Frist', 'Kennzahl', 'Ausgangswert', 'Ziel', 'Wirksamkeit']));
  assert.deepEqual(plain(C.readSheets([{ name: 'Massnahmen', rows: de, hidden: false }]).found.map((f) => f.name)), ['actions']);
  // A plain "Metric | Target" sheet still holds targets.
  const t = C.readSheets([{ name: 'TARGETS', rows: [['Metric', 'Target'], ['Damage Rate', '0.8%']], hidden: false }]);
  assert.deepEqual(plain(t.found), []);
  assert.deepEqual(plain(t.targets), { damage: 0.008 });
});

test('the example is the same every time and tells its story', () => {
  const a = C.example('2026-09-27');
  assert.deepEqual(plain(a), plain(C.example('2026-09-27')));
  assert.ok(a.deliveries.length > 5000 && a.routes.length > 150 && a.incidents.length > 300);
  assert.ok(a.deliveries.every((row) => row.Date <= '2026-09-27' && row.Date >= '2026-08-31'));
  const loading = (dsp) => {
    const rows = a.routes.filter((row) => row.DSP === dsp);
    return rows.reduce((sum, row) => sum + row.Loading_Time_Min, 0) / rows.length;
  };
  assert.ok(loading('DSP C') > loading('DSP A') + 4, 'DSP C loads slower');
  const ids = new Set(a.deliveries.map((row) => row.Delivery_ID));
  assert.equal(ids.size, a.deliveries.length);
  assert.ok(a.incidents.every((row) => !row.Delivery_ID || ids.has(row.Delivery_ID)));
});

// ---------- Deep dive ----------
const deepSettings = { lateMinutes: 5, minSample: 50, loadingTarget: 20 };
const metric = (id) => C.DEEP.find((m) => m.id === id);

test('deep dive: a row without a valid outcome is left out, never a success or a failure', () => {
  const rows = [delivery({ Complete: 0 }), delivery({ Complete: 1 }), delivery({ Complete: null }), delivery({ Complete: 0, Delivered: 0 })];
  const agg = C.deepAggregate(rows, metric('incomplete'), deepSettings, all('deliveries'));
  assert.deepEqual([agg.n, agg.k, agg.excluded, agg.rate], [2, 1, 2, 0.5]);
  // Temperature: a blank cell means nothing chilled, so it is not eligible.
  const cold = C.deepAggregate([delivery(), delivery({ Temp_Compliant: 1 }), delivery({ Temp_Compliant: 0 })], metric('temperature'), deepSettings, all('deliveries'));
  assert.deepEqual([cold.n, cold.k], [2, 1]);
  // Not perfect: any failed condition; a row with a missing condition is left out.
  const imperfect = C.deepAggregate([delivery({ On_Time: 0 }), delivery(), delivery({ First_Attempt: null })], metric('imperfect'), deepSettings, all('deliveries'));
  assert.deepEqual([imperfect.n, imperfect.k], [2, 1]);
  // Late without a message: only late or at-risk deliveries count.
  const told = C.deepAggregate([delivery({ Notification_Eligible: 1, Customer_Notified: 0 }), delivery({ Notification_Eligible: 1, Customer_Notified: 1 }), delivery()], metric('notification'), deepSettings, all('deliveries'));
  assert.deepEqual([told.n, told.k], [2, 1]);
  // Routes: over the loading target, late after the late limit, and a safety deviation.
  const routes = [{ Loading_Time_Min: 24, Departure_Delay_Min: 5, Yard_Speed_Breach: 0, Safety_Vest_Compliant: 1, Traffic_Direction_Compliant: 1 }, { Loading_Time_Min: 20, Departure_Delay_Min: 6, Safety_Vest_Compliant: 0 }, { Loading_Time_Min: null, Departure_Delay_Min: null }];
  assert.deepEqual([C.deepAggregate(routes, metric('loading'), deepSettings).n, C.deepAggregate(routes, metric('loading'), deepSettings).k], [2, 1]);
  assert.deepEqual([C.deepAggregate(routes, metric('departure'), deepSettings).n, C.deepAggregate(routes, metric('departure'), deepSettings).k], [2, 1]);
  assert.deepEqual([C.deepAggregate(routes, metric('safety'), deepSettings).n, C.deepAggregate(routes, metric('safety'), deepSettings).k], [2, 1]);
  // Without an approved loading target the threshold is 20 minutes.
  assert.equal(C.deepAggregate(routes, metric('loading'), { ...deepSettings, loadingTarget: null }).k, 1);
});

test('deep dive: count, share and rate are three numbers, and "vs rest" needs the sample floor on both sides', () => {
  const rows = [
    ...Array.from({ length: 100 }, (_, i) => delivery({ DSP: 'A', Complete: i < 4 ? 0 : 1 })),
    ...Array.from({ length: 20 }, (_, i) => delivery({ DSP: 'B', Complete: i < 3 ? 0 : 1 })),
    ...Array.from({ length: 80 }, (_, i) => delivery({ DSP: 'C', Complete: i < 1 ? 0 : 1 })),
  ];
  const agg = C.deepAggregate(rows, metric('incomplete'), deepSettings, all('deliveries'));
  const segments = C.deepSegments(agg, 'DSP', 50);
  assert.deepEqual(plain(segments.map((s) => s.key)), ['A', 'B', 'C'], 'ranked by cases');
  const a = segments[0];
  assert.deepEqual([a.k, a.n, a.rate, a.share, a.low], [4, 100, 0.04, 0.5, false]);
  assert.ok(Math.abs(a.vsRest - (0.04 - 4 / 100)) < 1e-12, 'A fails exactly as often as the rest');
  const b = segments[1];
  assert.equal(b.low, true);
  assert.equal(b.vsRest, null, 'under the floor: no comparison');
  assert.ok(b.rate > a.rate, 'the highest rate is not the largest count');
  // By week, and the rate per week is the week's own numerator over its own denominator.
  const weekly = C.deepWeekly(agg);
  assert.deepEqual(plain(weekly), [{ week: '2026-W39', n: 200, k: 8, rate: 0.04 }]);
  assert.deepEqual(plain(C.deepSegments(agg, 'Week', 50).map((s) => [s.key, s.k])), [['2026-W39', 8]]);
});

test('deep dive: the equal window before, and the incidents that record the failure', () => {
  assert.deepEqual(plain(C.priorWindow('2026-09-14', '2026-09-27')), { from: '2026-08-31', to: '2026-09-13', days: 14 });
  assert.equal(C.priorWindow('2026-09-27', '2026-09-14'), null);
  assert.equal(C.priorWindow('', '2026-09-14'), null);
  const incidents = [
    { Incident_ID: 'I1', Date: '2026-09-21', Incident_Type: 'Incomplete', Delivery_ID: 'D1', Route_ID: 'R1' },
    { Incident_ID: 'I2', Date: '2026-09-21', Incident_Type: 'Unvollständig', Delivery_ID: 'D9', Route_ID: 'R1' },
    { Incident_ID: 'I3', Date: '2026-09-21', Incident_Type: 'Delay', Delivery_ID: 'D1', Route_ID: 'R1' },
    { Incident_ID: 'I4', Date: '2026-09-21', Incident_Type: 'Dorëzim i paplotë', Delivery_ID: '', Route_ID: 'R2' },
  ];
  const affected = [delivery({ Delivery_ID: 'D1', Complete: 0 }), delivery({ Delivery_ID: 'D2', Complete: 0 })];
  const found = C.deepIncidents(incidents, metric('incomplete'), affected);
  assert.deepEqual(plain(found.records.map((r) => r.Incident_ID)), ['I1', 'I2', 'I4'], 'English, German and Albanian types');
  assert.equal(found.linked, 1, 'one names an affected delivery exactly');
  // Routes link by date and route; a metric without a type takes every incident.
  const routeHit = C.deepIncidents(incidents, metric('departure'), [{ Date: '2026-09-21', Route_ID: 'R1' }]);
  assert.deepEqual(plain(routeHit.records.map((r) => r.Incident_ID)), ['I3']);
  assert.equal(routeHit.linked, 1);
  assert.equal(C.deepIncidents(incidents, metric('complaint'), []).records.length, 4);
});

test('deep dive: a case needs a title, and "verified effective" needs evidence, a verified cause and a result', () => {
  assert.deepEqual(plain(C.caseCheck({ title: ' ' })), ['title']);
  assert.deepEqual(plain(C.caseCheck({ title: 'Bags', status: 'Verified effective', rootStatus: 'Hypothesis', evidence: 'x', root: 'y', verifyResult: 'z' })), ['verified']);
  assert.deepEqual(plain(C.caseCheck({ title: 'Bags', status: 'Verified effective', rootStatus: 'Verified', evidence: 'x', root: 'y', verifyResult: '' })), ['verified']);
  assert.deepEqual(plain(C.caseCheck({ title: 'Bags', status: 'Verified effective', rootStatus: 'Verified', evidence: 'x', root: 'y', verifyResult: 'z' })), []);
  assert.equal(C.capaReady({ corrective: 'Stage bags', owner: 'SL', deadline: '2026-10-01' }), true);
  assert.equal(C.capaReady({ corrective: 'Stage bags', owner: '', deadline: '2026-10-01' }), false);
  const action = C.caseToAction({ title: 'Bags', problem: 'Missing bags on DSP C', evidence: 'Scan log', rootStatus: 'Hypothesis', root: 'Bags staged late', containment: 'Walk the ramp', corrective: 'Pre-stage bags', owner: 'DSP C Lead', deadline: '2026-10-01', verifyMetric: 'Missing bag events' }, 'ACT009', '2026-09-27', 'INV-1', { hypothesis: 'Hypothese', investigation: 'Untersuchung' });
  assert.equal(action.Action_Type, 'Corrective');
  assert.equal(action.Action, 'Pre-stage bags');
  assert.equal(action.Root_Cause, 'Hypothese: Bags staged late');
  assert.equal(action.Notes, 'Untersuchung INV-1');
  assert.deepEqual([action.Status, action.Verification_Status, action.Start_Date], ['Open', 'Pending', '2026-09-27']);
  assert.equal(C.caseToAction({ title: 'T', rootStatus: 'Verified', root: 'Cause', preventive: 'Train', owner: 'X', deadline: '2026-10-01' }, 'A', '2026-09-27', 'I').Root_Cause, 'Cause');
});

test('deep dive: the example station tells its story in the numbers', () => {
  const ex = C.example('2026-09-27');
  const cols = all('deliveries');
  const incomplete = C.deepAggregate(ex.deliveries, metric('incomplete'), deepSettings, cols);
  assert.equal(incomplete.n, ex.deliveries.length);
  const byDsp = C.deepSegments(incomplete, 'DSP', 50);
  assert.equal(byDsp[0].key, 'DSP C', 'the partner that loses bags leads the incomplete deliveries');
  assert.ok(byDsp[0].vsRest > 0);
  const loading = C.deepAggregate(ex.routes, metric('loading'), deepSettings);
  assert.equal(C.deepSegments(loading, 'DSP', 15)[0].key, 'DSP C');
  const late = C.deepAggregate(ex.deliveries, metric('late'), deepSettings, cols);
  assert.equal(C.deepSegments(late, 'Shift', 50)[0].key, 'PM', 'the late shift delivers late');
  const signals = C.deepIncidents(ex.incidents, metric('incomplete'), incomplete.affected);
  assert.equal(signals.records.length, incomplete.k, 'every incomplete delivery of the example has its incident');
  assert.equal(signals.linked, incomplete.k);
});

test('the texts of the control tower and its page are translated', () => {
  const textsOf = (file) => {
    const source = fs.readFileSync(file, 'utf8');
    const found = new Set();
    for (const match of source.matchAll(/\btx\(\s*"((?:[^"\\]|\\.)*)"/g)) found.add(match[1]);
    for (const match of source.matchAll(/"((?:[^"\\]|\\.)*)" \| t\(lang\)/g)) found.add(match[1]);
    return [...found].map((text) => text.replace(/\\"/g, '"'));
  };
  for (const lang of ['de', 'sq']) {
    const ui = JSON.parse(fs.readFileSync(`src/_data/${lang}/ui.json`, 'utf8'));
    for (const file of ['src/js/cx-tower.js', 'src/_includes/partials/cx-tower.njk']) {
      for (const text of textsOf(file)) assert.ok(ui[text], `${lang}: ${file}: ${text}`);
    }
    // The labels the engine keeps in its tables, and the checks of the deep dive.
    for (const kpi of C.KPIS) assert.ok(ui[kpi.label] && ui[kpi.def], `${lang}: ${kpi.id}`);
    for (const m of C.DEEP) assert.ok(ui[m.label], `${lang}: ${m.label}`);
    const source = fs.readFileSync('src/js/cx-tower.js', 'utf8');
    const prompts = source.slice(source.indexOf('const DEEP_PROMPTS'), source.indexOf('const DIM_LABEL'));
    for (const match of prompts.matchAll(/"((?:[^"\\]|\\.)*)"/g)) assert.ok(ui[match[1]], `${lang}: ${match[1]}`);
  }
});

// The page itself, in a browser without a screen: the deep dive on the example station.
test('the deep dive on the page: numbers, a clicked segment, a saved case and its action', () => {
  const { JSDOM } = require('jsdom');
  const cfg = fs.readFileSync('src/_data/cxTower.json', 'utf8');
  const html = `<html lang="en"><body><div data-cx class="cx"><p data-cx-example-flag hidden></p><p data-cx-note></p>
    <div data-cx-filters hidden><input data-cx-filter="from" type="date"><input data-cx-filter="to" type="date"><select data-cx-filter="DSP"></select><select data-cx-filter="Shift"></select><select data-cx-filter="Zone"></select><button data-cx-reset-filters type="button"></button></div>
    <div data-cx-tabs></div><div data-cx-body id="cx-panel"></div></div><script type="application/json" id="cx-data">${cfg}</script></body></html>`;
  const dom = new JSDOM(html, { url: 'https://example.test/tools/cx-control-tower/', runScripts: 'outside-only' });
  const { window } = dom;
  window.confirm = () => true;
  window.URL.createObjectURL = () => 'blob:x';
  window.URL.revokeObjectURL = () => {};
  for (const file of ['tool-kit', 'docx-kit', 'cv-import', 'pareto', 'cx-tower']) window.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  const body = window.document.querySelector('[data-cx-body]');
  const click = (node) => node.dispatchEvent(new window.Event('click', { bubbles: true }));
  const texts = () => body.textContent;
  // The page writes its state a moment after each change, at once when it is hidden: that moment, here.
  const stored = () => { window.dispatchEvent(new window.Event('pagehide')); return JSON.parse(window.localStorage.getItem('sc-cx-tower')); };
  // A first visit opens on the example; the overview tiles offer the deep dive.
  assert.ok(window.document.querySelector('[data-tab="deep"]'));
  const dives = [...body.querySelectorAll('.cx-kpi-dive')];
  assert.ok(dives.length >= 8, 'a button per KPI tile');
  click(dives.find((b) => b.getAttribute('aria-label').includes('Incomplete Rate')));
  assert.equal(window.document.querySelector('[data-tab="deep"]').getAttribute('aria-selected'), 'true');
  // The numbers match the engine on the same rows.
  const ex = C.example('2026-09-27');
  const agg = C.deepAggregate(ex.deliveries, metric('incomplete'), deepSettings, all('deliveries'));
  const stats = [...body.querySelectorAll('.dl-stat-value')].map((n) => n.textContent);
  assert.equal(stats[0], String(agg.k));
  assert.ok(texts().includes(`${agg.k} of ${agg.n.toLocaleString('en-GB')} eligible deliveries`), 'readout');
  const segments = C.deepSegments(agg, 'DSP', 50);
  const firstSeg = body.querySelector('.cx-seg-table tbody tr');
  assert.equal(firstSeg.querySelector('.cx-seg').textContent, segments[0].key);
  assert.equal(firstSeg.children[1].textContent, String(segments[0].k));
  // Clicking a segment narrows the evidence rows, not the cards.
  click(firstSeg.querySelector('.cx-seg'));
  assert.ok(texts().includes(`Partner = ${segments[0].key}`));
  assert.equal([...body.querySelectorAll('.dl-stat-value')][0].textContent, String(agg.k), 'the cards keep the whole period');
  assert.ok(texts().includes(`${segments[0].k} affected rows`));
  assert.equal(stored().deep.segment, segments[0].key);
  // Saving a case: a title is needed; "verified effective" is refused without evidence.
  const field = (name) => body.querySelector(`#cx-case-${name}`);
  const type = (name, value) => { field(name).value = value; field(name).dispatchEvent(new window.Event(field(name).tagName === 'SELECT' || field(name).type === 'date' ? 'change' : 'input', { bubbles: true })); };
  const button = (text) => [...body.querySelectorAll('button')].find((b) => b.textContent === text);
  assert.equal(field('title').value, 'Incomplete deliveries: investigation');
  type('title', '');
  click(button('Save the investigation'));
  assert.ok(body.querySelector('.cx-case-note').textContent.includes('title'));
  type('title', 'Missing bags at DSP C');
  type('status', 'Verified effective');
  click(button('Save the investigation'));
  assert.ok(body.querySelector('.cx-case-note').classList.contains('is-bad'));
  assert.equal(stored().cases.length, 0);
  type('status', 'Investigating');
  type('evidence', 'Scan log: bags staged after the driver arrived');
  click(button('Save the investigation'));
  let saved = stored().cases;
  assert.equal(saved.length, 1);
  assert.match(saved[0].id, /^INV-\d{8}-001$/);
  assert.deepEqual([saved[0].snapshot.metric, saved[0].snapshot.segment, saved[0].snapshot.k], ['incomplete', segments[0].key, agg.k]);
  assert.ok(texts().includes(saved[0].id), 'listed under saved investigations');
  // The linked action needs an action, an owner and a deadline; then it lands in the tracker, once.
  click(button('Create the linked action'));
  assert.ok(body.querySelector('.cx-case-note').classList.contains('is-bad'));
  type('corrective', 'Pre-stage bags per route before the driver arrives');
  type('owner', 'DSP C Lead');
  type('deadline', '2026-10-10');
  click(button('Create the linked action'));
  let state = stored();
  const actions = state.tables.actions.rows;
  const fields = state.tables.actions.fields;
  const last = Object.fromEntries(fields.map((f, i) => [f, actions[actions.length - 1][i]]));
  assert.equal(last.Action_ID, 'ACT006');
  assert.equal(last.Action, 'Pre-stage bags per route before the driver arrives');
  assert.ok(last.Root_Cause.startsWith('Working hypothesis, not verified'));
  assert.equal(state.cases[0].actionId, 'ACT006');
  click(button('Create the linked action'));
  assert.equal(stored().tables.actions.rows.length, actions.length, 'not twice');
  // The action tracker shows where the action came from; the weekly review lists the open investigation.
  click(window.document.querySelector('[data-tab="actions"]'));
  assert.ok(texts().includes(`Investigation ${saved[0].id}`));
  click(window.document.querySelector('[data-tab="review"]'));
  assert.ok(texts().includes('Investigations in progress'));
  // Back in the deep dive, a route failure breaks down by ramp gate, and the state survives a reload.
  click(window.document.querySelector('[data-tab="deep"]'));
  const metricSelect = body.querySelector('#cx-deep-metric');
  metricSelect.value = 'loading';
  metricSelect.dispatchEvent(new window.Event('change', { bubbles: true }));
  assert.ok([...body.querySelector('#cx-deep-dim').options].some((o) => o.value === 'Ramp_Gate'));
  const loading = C.deepAggregate(ex.routes, metric('loading'), deepSettings);
  assert.equal([...body.querySelectorAll('.dl-stat-value')][0].textContent, String(loading.k));
  assert.equal(body.querySelector('#cx-deep-min').value, '15', 'the route floor');
  state = stored();
  assert.deepEqual([state.deep.metric, state.deep.minN, state.caseId], ['loading', 15, saved[0].id]);
});
