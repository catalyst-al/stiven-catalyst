// CX Control Tower: KPI denominators, Perfect Delivery per row, ISO weeks, target parsing, German CSV headers.
const { tool, check, note, text } = require('./lib.cjs');
const w = tool('/tools/cx-control-tower/', {});
const C = w.CxTower;
const d = (o) => ({ Delivered: 1, On_Time: 1, Complete: 1, Damage_Free: 1, Temp_Compliant: null, First_Attempt: 1, Notification_Eligible: null, Customer_Notified: null, Complaint: 0, ...o });
const rows = [
  d({}), d({ On_Time: 0, Notification_Eligible: 1, Customer_Notified: 1 }), d({ Complete: 0 }), d({ Damage_Free: 0, Complaint: 1 }),
  d({ Temp_Compliant: 0 }), d({ Temp_Compliant: 1 }), d({ On_Time: null }), d({ Delivered: 0, First_Attempt: 0 }), d({ First_Attempt: 0, On_Time: 0, Notification_Eligible: 1, Customer_Notified: 0 }), d({}),
];
const present = new Set(['On_Time', 'Complete', 'Damage_Free', 'Temp_Compliant', 'First_Attempt', 'Notification_Eligible', 'Customer_Notified', 'Complaint', 'Delivered']);
const k = C.computeKpis(rows, [], { lateMinutes: 5 }, present);
// Independent: delivered = 9 (row 8 not delivered).
// onTime: known On_Time among delivered = 8 (row 7 null) -> on time = rows 1,3,4,5,6,10 = 6 -> 6/8
check('onTime = 6/8', 0.75, k.onTime.value);
// perfect: delivered with no null among PERFECT fields = 8 (row 7 null excluded); perfect = rows 1,6,10 -> wait row 5 temp 0 fails; row 6 temp 1 ok -> rows 1,6,10 = 3 -> 3/8
check('perfect = 3/8 (row with unknown On_Time excluded)', 3 / 8, k.perfect.value);
check('incomplete = 1/9', 1 / 9, k.incomplete.value);
check('first attempt over ALL orders = 8/10', 0.8, k.first.value);
check('notification = 1/2', 0.5, k.notification.value);
check('complaints per 1000 over all orders = 1/10*1000', 100, k.complaints.value);
check('cold = 1/2', 0.5, k.cold.value);
// ISO weeks (independent reference values)
[['2026-01-01', '2026-W01'], ['2027-01-01', '2026-W53'], ['2024-12-30', '2025-W01'], ['2026-10-25', '2026-W43'], ['2026-10-26', '2026-W44'], ['2021-01-03', '2020-W53']].forEach(([iso, wk]) => check(`isoWeek ${iso}`, wk, C.isoWeek(iso)));
// target parsing ambiguity
const inc = C.KPIS.find((x) => x.id === 'incomplete');
note('targetValue("0.8") for Incomplete Rate (user means 0.8 %?)', C.targetValue(inc, '0.8'));
note('targetValue("0,8 %")', C.targetValue(inc, '0,8 %'));
note('targetValue("1") for incomplete (1 % or 100 %?)', C.targetValue(inc, '1'));
// German header recognition + decimal comma + yes/no words
const de = [['Datum', 'Lieferpartner', 'Schicht', 'Auftrag', 'Zugestellt', 'Pünktlich', 'Vollständig', 'Schadenfrei', 'Erstzustellung', 'Beschwerde'],
  ['26.10.2026', 'DSP A', 'Früh', 'A1', 'ja', 'ja', 'ja', 'ja', 'ja', 'nein'],
  ['26.10.2026', 'DSP A', 'Früh', 'A2', 'ja', 'nein', 'ja', 'ja', 'ja', 'ja'],
  ['25.10.2026', 'DSP Ö', 'Spät', 'A3', '1', '0', '1', '1', '1', '0']];
const hit = C.recognise(de);
note('German headers recognised as', hit && { name: hit.name, fields: Object.keys(hit.map) });
if (hit) { const r = C.toRecords(hit.name, de, hit.map, hit.headerRow); note('records', r.records.map((x) => [x.Date, x.On_Time, x.Complaint])); note('issues', r.issues); }
// "Example" page state on first load: is it labelled?
note('first-load head', text(w, 'main h1').slice(0, 80));
note('example banner?', /example|Beispiel/i.test(text(w, '[data-cx], main')) );
