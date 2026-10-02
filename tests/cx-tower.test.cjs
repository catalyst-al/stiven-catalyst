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
