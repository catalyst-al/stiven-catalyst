// Reminders that stay on the device (src/js/reminders.js, the opt-in in partials/action-tracker.njk, the periodic
// sync handler in src/sw.js): overdue and due-today counts by date, at most one a day, the note on the page where
// notifications are blocked, the summary kept in IndexedDB for the service worker, and what the browser can do.
// IndexedDB is a small fake of the parts the scripts use; Notification and the service worker are fakes too.
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');
const nunjucks = require('nunjucks');

const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const plain = (value) => JSON.parse(JSON.stringify(value));
const part = read('src/_data/i18n-parts/team-sync-2.json');
const pad = (n) => String(n).padStart(2, '0');
const day = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
const shift = (iso, days) => { const d = new Date(`${iso}T12:00:00`); d.setDate(d.getDate() + days); return day(d); };
const TODAY = day(new Date());

// A minimal IndexedDB: databases of object stores keyed by keyPath, requests answering on a later turn, and an
// upgrade that can be called off (then a new database is not made), as in browsers.
const fakeIndexedDB = () => {
  const dbs = new Map();
  const later = (fn) => setTimeout(fn, 0);
  const makeDb = () => {
    const stores = new Map();
    return {
      stores,
      objectStoreNames: { contains: (name) => stores.has(name) },
      createObjectStore: (name, { keyPath }) => { stores.set(name, { keyPath, rows: new Map() }); },
      close() {},
      transaction(name) {
        const data = stores.get(name);
        if (!data) throw new Error('NotFoundError');
        const tx = { pending: 0, done: false, oncomplete: null, onerror: null, onabort: null };
        const settle = () => later(() => { if (!tx.done && tx.pending === 0) { tx.done = true; tx.oncomplete?.(); } });
        const request = (work) => {
          const req = { result: undefined, onsuccess: null, onerror: null };
          tx.pending += 1;
          later(() => { req.result = work(); req.onsuccess?.(); tx.pending -= 1; settle(); });
          return req;
        };
        tx.objectStore = () => ({
          get: (key) => request(() => structuredClone(data.rows.get(key))),
          put: (value) => request(() => { data.rows.set(value[data.keyPath], structuredClone(value)); return value[data.keyPath]; }),
          delete: (key) => request(() => { data.rows.delete(key); }),
        });
        settle();
        return tx;
      },
    };
  };
  return {
    dbs,
    opened: 0,
    open(name) {
      this.opened += 1;
      const req = { result: null, transaction: null, onupgradeneeded: null, onsuccess: null, onerror: null, onblocked: null };
      later(() => {
        let db = dbs.get(name);
        if (!db) {
          db = makeDb();
          let aborted = false;
          req.result = db;
          req.transaction = { abort: () => { aborted = true; } };
          req.onupgradeneeded?.({ oldVersion: 0 });
          if (aborted) { req.result = null; req.onerror?.(); return; }
          dbs.set(name, db);
        }
        req.result = db;
        req.onsuccess?.();
      });
      return req;
    },
  };
};
const record = (idb, id) => idb.dbs.get('sc-reminders')?.stores.get('kv')?.rows.get(id);

// Notification as browsers have it: a permission, a request that answers it, and notifications made.
const fakeNotification = (permission, answer = permission) => {
  const made = [];
  const asked = [];
  class FakeNotification {
    constructor(title, options) { made.push({ title, ...plain(options) }); }
    close() {}
    static async requestPermission() { asked.push(true); FakeNotification.permission = answer; return answer; }
  }
  FakeNotification.permission = permission;
  return { FakeNotification, made, asked };
};
// A service worker registration with Periodic Background Sync.
const fakeRegistration = ({ periodic = true } = {}) => {
  const shown = [];
  const registered = [];
  const unregistered = [];
  const tags = new Set();
  const reg = { showNotification: async (title, options) => { shown.push({ title, ...plain(options) }); } };
  if (periodic) reg.periodicSync = { register: async (tag, options) => { registered.push([tag, plain(options)]); tags.add(tag); }, unregister: async (tag) => { unregistered.push(tag); tags.delete(tag); }, getTags: async () => [...tags] };
  return { reg, shown, registered, unregistered };
};

// The opt-in as the Action Tracker page renders it, with the filters stubbed the way eleventy.config.js defines them.
const missing = new Set();
const optinHtml = (lang = 'en') => {
  const ui = lang === 'en' ? {} : { ...read(`src/_data/${lang}/ui.json`), ...read('src/_data/i18n-parts/action-tracker.json')[lang], ...part[lang] };
  const env = new nunjucks.Environment(new nunjucks.FileSystemLoader(['src/_includes']), { autoescape: true });
  env.addFilter('t', (text) => { if (lang !== 'en' && ui[text] === undefined) missing.add(`${lang}: ${text}`); return lang === 'en' ? text : ui[text] ?? text; });
  env.addFilter('assetUrl', (url) => url);
  env.addFilter('scriptJson', (value) => new nunjucks.runtime.SafeString(JSON.stringify(value)));
  const cfg = read(lang === 'en' ? 'src/_data/actionTracker.json' : `src/_data/${lang}/actionTracker.json`);
  const html = env.render('partials/action-tracker.njk', { lang, cfg });
  return html.match(/<div class="at-remind"[\s\S]*?<\/div>/)[0];
};

const load = ({ path = '/tools/pareto/', body = '', actions = null, idb = fakeIndexedDB(), notification = null, registration = null, periodicAllowed = 'granted' } = {}) => {
  const lang = (path.match(/^\/(de|sq)\//) || [])[1] || 'en';
  const dom = new JSDOM(`<html lang="${lang}"><body><main id="main"><h1>Tool</h1>${body}</main></body></html>`, { url: `https://stivencatalyst.com${path}`, runScripts: 'outside-only' });
  const w = dom.window;
  if (idb) w.indexedDB = idb;
  if (notification) w.Notification = notification;
  if (registration) {
    Object.defineProperty(w.navigator, 'serviceWorker', { configurable: true, value: { getRegistration: async () => registration } });
    Object.defineProperty(w.navigator, 'permissions', { configurable: true, value: { query: async () => ({ state: periodicAllowed }) } });
  }
  if (actions) w.localStorage.setItem('sc-actions', JSON.stringify({ rows: actions }));
  w.eval(fs.readFileSync('src/js/reminders.js', 'utf8'));
  return w;
};
const R = load({ idb: null }).RemindersMath;

const ACTIONS = [
  { id: 'a1', title: 'Fix dock door', due: shift(TODAY, -3), status: 'open', created: shift(TODAY, -10) },
  { id: 'a2', title: 'Order gloves', due: TODAY, status: 'doing', created: shift(TODAY, -2) },
  { id: 'a3', title: 'Label racks', due: shift(TODAY, -1), status: 'open', created: shift(TODAY, -5) },
  { id: 'a4', title: 'Sweep bay 4', due: shift(TODAY, -3), status: 'open', created: shift(TODAY, -12), owner: 'Besnik Hoxha', detail: 'Private detail' },
  { id: 'a5', title: 'Toolbox talk', due: shift(TODAY, 2), status: 'open', created: shift(TODAY, -1) },
  { id: 'a6', title: 'Closed late', due: shift(TODAY, -7), status: 'done', created: shift(TODAY, -9) },
  { id: 'a7', title: 'Verified', due: TODAY, status: 'verified', created: shift(TODAY, -9) },
  { id: 'a8', title: 'No date', due: '', status: 'open' },
  { id: 'a9', title: '', due: TODAY, status: 'open' },
  { id: 'a10', title: 'Bad date', due: '24.10.2026', status: 'open' },
];
const WORDS = { title: 'Action Tracker', counts: '{overdue} overdue · {today} due today', more: 'and {n} more', open: 'Open the Action Tracker', close: 'Close' };
const putState = async (idb, state) => {
  const S = load({ idb }).RemindersMath.store(idb);
  await S.put({ id: 'state', on: true, since: '2026-10-01T08:00:00.000Z', last: '', lang: 'en', texts: { en: WORDS }, ...state });
};

test('due and overdue by date: open actions only, before today is overdue, the first three soonest first', () => {
  const t = '2026-10-24';
  const rows = [
    { title: 'A', due: '2026-10-21', status: 'open', created: '2026-10-10' },
    { title: 'B', due: '2026-10-24', status: 'doing' },
    { title: 'C', due: '2026-10-23', status: 'open' },
    { title: 'D', due: '2026-10-21', status: 'open', created: '2026-10-01' },
    { title: 'E', due: '2026-10-25', status: 'open' },
    { title: 'F', due: '2026-10-20', status: 'done' },
    { title: 'G', due: '2026-10-24', status: 'verified' },
    { title: 'H', due: '', status: 'open' },
    { title: '  ', due: '2026-10-24', status: 'open' },
    { title: 'I', due: '2026-10-24' },
  ];
  // Overdue: A, C, D (3); due today: B and I (no status reads as open, as the store does).
  assert.deepEqual(plain(R.dueNow(rows, t)), { overdue: 3, today: 2, titles: ['D', 'A', 'C'] });
  assert.deepEqual(plain(R.dueNow(rows, '2026-10-21')), { overdue: 0, today: 2, titles: ['D', 'A'] });
  assert.deepEqual(plain(R.dueNow(rows, '2026-10-26')), { overdue: 6, today: 0, titles: ['D', 'A', 'C'] });
  assert.deepEqual(plain(R.dueNow([], t)), { overdue: 0, today: 0, titles: [] });
  // The words: counts, the three titles, how many more.
  const msg = plain(R.message(R.dueNow(rows, t), WORDS));
  assert.equal(msg.counts, '3 overdue · 2 due today');
  assert.equal(msg.more, 'and 2 more');
  assert.equal(msg.body, '3 overdue · 2 due today\n• D\n• A\n• C\nand 2 more');
  assert.equal(R.message({ overdue: 1, today: 0, titles: ['X'] }, WORDS).more, '');
  // The list as the store keeps it, or the old bare array; anything else is no list.
  const storage = { getItem: () => JSON.stringify(rows) };
  assert.equal(R.readRows(storage).length, rows.length);
  assert.deepEqual(plain(R.readRows({ getItem: () => 'garbage' })), []);
  assert.deepEqual(plain(R.readRows({ getItem: () => null })), []);
});

test('once a day: switched on and not shown yet today; the words in the page\'s language, else the one switched on in', () => {
  assert.equal(R.shouldShow(null, '2026-10-24'), false);
  assert.equal(R.shouldShow({ on: false, last: '' }, '2026-10-24'), false);
  assert.equal(R.shouldShow({ on: true, last: '' }, '2026-10-24'), true);
  assert.equal(R.shouldShow({ on: true, last: '2026-10-24' }, '2026-10-24'), false);
  assert.equal(R.shouldShow({ on: true, last: '2026-10-23' }, '2026-10-24'), true);
  assert.equal(R.shouldShow({ on: 'yes', last: '' }, '2026-10-24'), false, 'only a real true');
  assert.equal(R.localDay(new Date(2026, 9, 24, 0, 30)), '2026-10-24', 'the visitor\'s own calendar day');
  const de = { ...WORDS, title: 'Maßnahmenliste' };
  assert.equal(R.wordsFor({ lang: 'de', texts: { de } }, 'en').title, 'Maßnahmenliste');
  assert.equal(R.wordsFor({ lang: 'de', texts: { de, en: WORDS } }, 'en').title, 'Action Tracker');
  assert.equal(R.wordsFor({ texts: { en: { title: 'x' } } }, 'en'), null, 'incomplete words are not used');
  assert.equal(R.trackerUrl('https://stivencatalyst.com', 'sq'), 'https://stivencatalyst.com/sq/tools/action-tracker/');
  assert.equal(R.langOf('/de/tools/pareto/'), 'de');
  assert.equal(R.langOf('/tools.html'), 'en');
});

test('the summary for the service worker: counts per due day and the three due soonest, nothing else of the list', () => {
  const now = new Date(`${TODAY}T09:00:00`);
  const long = { title: 'x'.repeat(200), due: shift(TODAY, 5), status: 'open' };
  const summary = plain(R.summarize([...ACTIONS, long], now, { lang: 'de', url: 'https://stivencatalyst.com/de/tools/action-tracker/' }));
  assert.deepEqual(Object.keys(summary).sort(), ['byDue', 'first', 'id', 'lang', 'updated', 'url', 'version']);
  assert.equal(summary.id, 'summary');
  assert.equal(summary.version, 1);
  assert.equal(summary.updated, now.toISOString());
  assert.deepEqual(summary.byDue, { [shift(TODAY, -3)]: 2, [shift(TODAY, -1)]: 1, [TODAY]: 1, [shift(TODAY, 2)]: 1, [shift(TODAY, 5)]: 1 });
  assert.deepEqual(summary.first, [{ title: 'Sweep bay 4', due: shift(TODAY, -3) }, { title: 'Fix dock door', due: shift(TODAY, -3) }, { title: 'Label racks', due: shift(TODAY, -1) }]);
  assert.ok(summary.first.every((a) => Object.keys(a).join() === 'title,due'));
  const text = JSON.stringify(summary);
  for (const secret of ['Besnik', 'Private detail', 'Closed late', 'No date', 'a1']) assert.ok(!text.includes(secret), secret);
  assert.equal(R.summarize([long], now).first[0].title.length, 80, 'titles are cut short');
  // On any later day the summary gives the same counts as the list itself, here and in the service worker.
  const sw = swLoad();
  for (const offset of [0, 1, 2, 3, 6, -3]) {
    const later = shift(TODAY, offset);
    const fromList = plain(R.dueNow([...ACTIONS, long], later));
    assert.deepEqual(plain(R.fromSummary(summary, later)), fromList, later);
    assert.deepEqual(plain(sw.self.SwReminders.remindCounts(summary, later)), fromList, `sw ${later}`);
  }
  // A damaged summary counts nothing it cannot read.
  assert.deepEqual(plain(R.fromSummary({ byDue: { x: 3, [TODAY]: -1, [shift(TODAY, -1)]: 1.5 }, first: 'no' }, TODAY)), { overdue: 0, today: 0, titles: [] });
});

test('what the browser can do, detected: no IndexedDB, no Notification, a permission, Periodic Background Sync', () => {
  assert.deepEqual(plain(R.detect({})), { idb: false, permission: 'unsupported', notify: false, serviceWorker: false, periodic: false });
  const { FakeNotification } = fakeNotification('denied');
  assert.deepEqual(plain(R.detect({ indexedDB: {}, Notification: FakeNotification, navigator: {} })), { idb: true, permission: 'denied', notify: false, serviceWorker: false, periodic: false });
  FakeNotification.permission = 'granted';
  function Registration() {}
  Registration.prototype.periodicSync = {};
  assert.deepEqual(plain(R.detect({ indexedDB: {}, Notification: FakeNotification, navigator: { serviceWorker: {} }, ServiceWorkerRegistration: Registration })), { idb: true, permission: 'granted', notify: true, serviceWorker: true, periodic: true });
  assert.equal(R.detect({ navigator: { serviceWorker: {} }, ServiceWorkerRegistration: function Plain() {} }).periodic, false, 'a service worker without periodic sync');
  // A browser that throws on reaching IndexedDB (blocked storage).
  const blocked = {};
  Object.defineProperty(blocked, 'indexedDB', { get() { throw new Error('SecurityError'); } });
  assert.equal(R.detect(blocked).idb, false);
});

test('on a tool page: nothing is made while reminders are off, and nothing is asked', async () => {
  const idb = fakeIndexedDB();
  const { FakeNotification, asked, made } = fakeNotification('default');
  const w = load({ idb, notification: FakeNotification, actions: ACTIONS });
  assert.equal(await w.Reminders.ready, null);
  assert.equal(idb.dbs.size, 0, 'no database is created just by looking');
  assert.deepEqual(asked, []);
  assert.deepEqual(made, []);
  assert.equal(w.document.querySelector('[data-reminders-banner]'), null);
  // No IndexedDB at all: the page works as before.
  const bare = load({ idb: null, actions: ACTIONS });
  assert.equal(await bare.Reminders.ready, null);
});

test('once a day on any tool page: a note at the top where notifications are blocked, with counts, titles and the link', async () => {
  const idb = fakeIndexedDB();
  await putState(idb, { texts: { de: { ...WORDS, title: 'Maßnahmenliste', counts: '{overdue} überfällig · {today} heute fällig', open: 'Maßnahmenliste öffnen', close: 'Schließen', more: 'und {n} weitere' } }, lang: 'de' });
  const { FakeNotification, made, asked } = fakeNotification('denied');
  const w = load({ path: '/de/tools/pareto/', idb, notification: FakeNotification, actions: ACTIONS });
  const shown = plain(await w.Reminders.ready);
  assert.deepEqual(shown, { how: 'banner', overdue: 3, today: 1, titles: ['Sweep bay 4', 'Fix dock door', 'Label racks'] });
  assert.deepEqual(made, [], 'no notification when they are blocked');
  assert.deepEqual(asked, [], 'and permission is not asked again');
  const banner = w.document.querySelector('main > [data-reminders-banner]');
  assert.ok(banner && banner === w.document.querySelector('main').firstElementChild, 'at the top of the page');
  assert.equal(banner.querySelector('[role="status"] strong').textContent, 'Maßnahmenliste');
  assert.match(banner.textContent, /3 überfällig · 1 heute fällig/);
  assert.deepEqual([...banner.querySelectorAll('li')].map((li) => li.textContent), ['Sweep bay 4', 'Fix dock door', 'Label racks', 'und 1 weitere']);
  const link = banner.querySelector('a');
  assert.equal(link.href, 'https://stivencatalyst.com/de/tools/action-tracker/');
  assert.equal(link.textContent, 'Maßnahmenliste öffnen');
  assert.equal(record(idb, 'state').last, TODAY, 'the day is claimed');
  // The summary is kept current for the service worker.
  assert.deepEqual(plain(record(idb, 'summary').byDue), plain(R.summarize(ACTIONS).byDue));
  assert.equal(record(idb, 'summary').url, 'https://stivencatalyst.com/de/tools/action-tracker/');
  // Closed with its button; the same day nothing more, on this page or the next.
  banner.querySelector('button').click();
  assert.equal(w.document.querySelector('[data-reminders-banner]'), null);
  assert.equal(await w.Reminders.remindNow(), null);
  const next = load({ path: '/de/tools/five-whys/', idb, notification: FakeNotification, actions: ACTIONS });
  assert.equal(await next.Reminders.ready, null);
  assert.equal(next.document.querySelector('[data-reminders-banner]'), null);
  // The next day: again, now with one more overdue.
  const tomorrow = new Date(`${shift(TODAY, 1)}T08:00:00`);
  const again = plain(await next.Reminders.remindNow(tomorrow));
  assert.deepEqual([again.how, again.overdue, again.today], ['banner', 4, 0]);
  assert.equal(record(idb, 'state').last, shift(TODAY, 1));
  // Nothing due: nothing shown, and the day stays open for a later page.
  const quiet = fakeIndexedDB();
  await putState(quiet);
  const calm = load({ idb: quiet, actions: [{ title: 'Later', due: shift(TODAY, 4), status: 'open' }] });
  assert.equal(await calm.Reminders.ready, null);
  assert.equal(record(quiet, 'state').last, '');
  // Without Notification at all (e.g. Safari on a phone outside the installed app): the note too.
  const none = fakeIndexedDB();
  await putState(none);
  const plainPage = load({ idb: none, actions: ACTIONS });
  assert.equal((await plainPage.Reminders.ready).how, 'banner');
});

test('a notification where it is allowed: through the service worker when there is one, else from the page', async () => {
  const idb = fakeIndexedDB();
  await putState(idb);
  const { FakeNotification, made } = fakeNotification('granted');
  const { reg, shown, registered } = fakeRegistration();
  const w = load({ idb, notification: FakeNotification, registration: reg, actions: ACTIONS });
  assert.equal((await w.Reminders.ready).how, 'notification');
  assert.deepEqual(made, []);
  assert.equal(shown.length, 1);
  assert.equal(shown[0].title, 'Action Tracker');
  assert.equal(shown[0].body, '3 overdue · 1 due today\n• Sweep bay 4\n• Fix dock door\n• Label racks\nand 1 more');
  assert.equal(shown[0].tag, 'sc-reminders');
  assert.equal(shown[0].data.url, 'https://stivencatalyst.com/tools/action-tracker/');
  assert.deepEqual(registered, [['sc-reminders', { minInterval: 86400000 }]], 'the daily wake-up, registered again on a visit');
  assert.equal(w.document.querySelector('[data-reminders-banner]'), null);
  // No service worker: the page's own notification.
  const idb2 = fakeIndexedDB();
  await putState(idb2);
  const n2 = fakeNotification('granted');
  const w2 = load({ idb: idb2, notification: n2.FakeNotification, actions: ACTIONS });
  assert.equal((await w2.Reminders.ready).how, 'notification');
  assert.equal(n2.made.length, 1);
  assert.equal(n2.made[0].tag, 'sc-reminders');
});

test('the opt-in in the Action Tracker: permission asked only on the click, state and summary kept, off again', async () => {
  const idb = fakeIndexedDB();
  const n = fakeNotification('default', 'granted');
  const { reg, registered, unregistered } = fakeRegistration();
  const w = load({ path: '/tools/action-tracker/', body: optinHtml('en'), idb, notification: n.FakeNotification, registration: reg, actions: ACTIONS });
  await w.Reminders.ready;
  const box = w.document.querySelector('[data-reminders-optin]');
  const button = box.querySelector('[data-reminders-toggle]');
  assert.equal(box.hidden, false, 'shown where the script runs');
  assert.equal(button.textContent, 'Remind me of due actions on this device');
  assert.equal(button.getAttribute('aria-pressed'), 'false');
  assert.deepEqual(n.asked, [], 'not asked on opening the page');
  assert.equal(idb.dbs.size, 0);
  button.click();
  assert.deepEqual(n.asked, [true], 'asked on the click, at once');
  const state = plain(await w.Reminders.last);
  assert.equal(state.on, true);
  assert.equal(state.last, '');
  assert.deepEqual(state.texts.en, WORDS);
  assert.deepEqual(plain(record(idb, 'state')), state);
  assert.deepEqual(record(idb, 'summary').first.map((a) => a.title), ['Sweep bay 4', 'Fix dock door', 'Label racks']);
  assert.deepEqual(registered, [['sc-reminders', { minInterval: 86400000 }]]);
  assert.equal(button.textContent, 'Stop the reminders on this device');
  assert.equal(button.getAttribute('aria-pressed'), 'true');
  assert.match(box.querySelector('[data-reminders-status]').textContent, /^Reminders are on\. Once a day.*As an installed app, this device can also remind you when no tool is open\.$/);
  // Off: the summary goes, the wake-up too; asked nothing.
  button.click();
  await w.Reminders.last;
  assert.equal(record(idb, 'state').on, false);
  assert.equal(record(idb, 'summary'), undefined);
  assert.deepEqual(unregistered, ['sc-reminders']);
  assert.equal(box.querySelector('[data-reminders-status]').textContent, 'Reminders are off on this device.');
  assert.deepEqual(n.asked, [true]);
});

test('the opt-in where notifications are refused or missing: on with the note instead; without IndexedDB, not offered', async () => {
  const idb = fakeIndexedDB();
  const n = fakeNotification('default', 'denied');
  const { reg, registered } = fakeRegistration();
  const w = load({ path: '/sq/tools/action-tracker/', body: optinHtml('sq'), idb, notification: n.FakeNotification, registration: reg, actions: ACTIONS });
  await w.Reminders.ready;
  const box = w.document.querySelector('[data-reminders-optin]');
  assert.equal(box.querySelector('[data-reminders-toggle]').textContent, 'Më kujto veprimet që skadojnë në këtë pajisje');
  box.querySelector('[data-reminders-toggle]').click();
  const state = await w.Reminders.last;
  assert.equal(state.on, true);
  assert.equal(state.texts.sq.title, 'Lista e veprimeve');
  assert.deepEqual(registered, [], 'no background wake-up without notifications');
  assert.match(box.querySelector('[data-reminders-status]').textContent, /^Kujtesat janë aktive\. Ky shfletues i bllokon njoftimet/);
  // The next tool page: the note, in Albanian.
  const page = load({ path: '/sq/tools/five-whys/', idb, notification: n.FakeNotification, actions: ACTIONS });
  assert.equal((await page.Reminders.ready).how, 'banner');
  assert.match(page.document.querySelector('[data-reminders-banner]').textContent, /3 me afat të kaluar · 1 skadojnë sot/);
  // Already denied before: not asked again, on with the note.
  const idb2 = fakeIndexedDB();
  const n2 = fakeNotification('denied');
  const w2 = load({ path: '/tools/action-tracker/', body: optinHtml('en'), idb: idb2, notification: n2.FakeNotification });
  await w2.Reminders.ready;
  w2.document.querySelector('[data-reminders-toggle]').click();
  await w2.Reminders.last;
  assert.deepEqual(n2.asked, []);
  assert.match(w2.document.querySelector('[data-reminders-status]').textContent, /^Reminders are on\. This browser blocks notifications/);
  // Without IndexedDB: the button is there but cannot be switched on, and says why.
  const w3 = load({ path: '/tools/action-tracker/', body: optinHtml('en'), idb: null });
  await w3.Reminders.ready;
  assert.equal(w3.document.querySelector('[data-reminders-toggle]').disabled, true);
  assert.match(w3.document.querySelector('[data-reminders-status]').textContent, /cannot keep reminders/);
  // Every text of the opt-in is translated.
  missing.clear();
  optinHtml('de');
  optinHtml('sq');
  assert.deepEqual([...missing], []);
});

// ---- The service worker ----
const swLoad = ({ origin = 'https://stivencatalyst.com', notification = null, clients = null } = {}) => {
  const listeners = {};
  const self = { location: { origin }, addEventListener: (name, fn) => { listeners[name] = fn; }, Notification: notification, clients };
  new Function('self', 'caches', 'fetch', 'Response', fs.readFileSync('src/sw.js', 'utf8'))(self, {}, async () => { throw new Error('no network in this test'); }, { error: () => 'error' });
  return { self, listeners };
};

test('the service worker: the day\'s notification from the summary where no page showed it, once, and a click opens the tracker', async () => {
  const idb = fakeIndexedDB();
  await putState(idb);
  // A page keeps the summary (reminders on, nothing due shown yet today because it was opened yesterday).
  const page = load({ idb, notification: fakeNotification('denied').FakeNotification, actions: ACTIONS });
  await page.Reminders.ready;
  // The page showed today's (as a note): the worker shows nothing more today.
  const { reg, shown } = fakeRegistration();
  const sw = swLoad();
  const { remind } = sw.self.SwReminders;
  assert.equal(await remind({ idb, registration: reg, permission: 'granted' }), false);
  // Tomorrow, no page open: the worker shows it, claims the day, and only once.
  const tomorrow = new Date(`${shift(TODAY, 1)}T07:00:00`);
  assert.equal(await remind({ idb, registration: reg, permission: 'granted', now: tomorrow }), true);
  assert.equal(shown.length, 1);
  assert.equal(shown[0].body, '4 overdue · 0 due today\n• Sweep bay 4\n• Fix dock door\n• Label racks\nand 1 more');
  assert.equal(shown[0].tag, 'sc-reminders');
  assert.equal(shown[0].data.url, 'https://stivencatalyst.com/tools/action-tracker/');
  assert.equal(record(idb, 'state').last, shift(TODAY, 1));
  assert.equal(await remind({ idb, registration: reg, permission: 'granted', now: tomorrow }), false);
  assert.equal(await page.Reminders.remindNow(tomorrow), null, 'nor the page that day');
  // Not allowed, no database, reminders off: nothing, and no database is made.
  assert.equal(await remind({ idb, registration: reg, permission: 'denied', now: new Date(`${shift(TODAY, 2)}T07:00:00`) }), false);
  const empty = fakeIndexedDB();
  assert.equal(await remind({ idb: empty, registration: reg, permission: 'granted' }), false);
  assert.equal(empty.dbs.size, 0);
  assert.equal(await remind({ idb: undefined, registration: reg, permission: 'granted' }), false);
  // The events: the periodic sync of its own tag only, the click on its own notification only.
  const waits = [];
  sw.self.onperiodicsync({ tag: 'other', waitUntil: (p) => waits.push(p) });
  assert.equal(waits.length, 0);
  sw.self.onperiodicsync({ tag: 'sc-reminders', waitUntil: (p) => waits.push(p) });
  assert.equal(waits.length, 1);
  assert.equal(await waits[0], false, 'no registration in this fake scope: nothing, no error');
  const opened = [];
  const withClients = swLoad({ clients: { matchAll: async () => [{ url: 'https://stivencatalyst.com/tools/pareto/', focus: () => opened.push('focus') }], openWindow: async (url) => opened.push(url) } });
  const click = (url, tag = 'sc-reminders') => {
    let pending = null;
    let closed = false;
    withClients.self.onnotificationclick({ notification: { tag, data: { url }, close: () => { closed = true; } }, waitUntil: (p) => { pending = p; } });
    return { pending, closed: () => closed };
  };
  const one = click('https://stivencatalyst.com/de/tools/action-tracker/');
  await one.pending;
  assert.equal(one.closed(), true);
  const two = click('https://evil.example/phish');
  await two.pending;
  const three = click('https://stivencatalyst.com/tools/action-tracker/', 'other');
  assert.equal(three.pending, null);
  assert.deepEqual(opened, ['https://stivencatalyst.com/de/tools/action-tracker/', 'https://stivencatalyst.com/tools/action-tracker/'], 'only the tracker of this site');
  assert.equal(withClients.self.SwReminders.remindUrl('/sq/tools/action-tracker/'), 'https://stivencatalyst.com/sq/tools/action-tracker/');
  assert.equal(withClients.self.SwReminders.remindUrl('javascript:alert(1)'), 'https://stivencatalyst.com/tools/action-tracker/');
  // The offline part of the worker is untouched.
  assert.equal(typeof withClients.listeners.fetch, 'function');
  assert.ok(withClients.self.SwKit.PRECACHE.includes('/offline.html'));
});

test('the script is loaded with the work box on every tool page, and its styles keep to the brand colours', () => {
  const box = fs.readFileSync('src/_includes/partials/work-backup.njk', 'utf8');
  assert.match(box, /work-backup\.js' \| assetUrl \}\}" defer><\/script>\n[^\n]*\n<script src="\{\{ '\/js\/reminders\.js' \| assetUrl \}\}" defer><\/script>/);
  const tracker = fs.readFileSync('src/_includes/partials/action-tracker.njk', 'utf8');
  assert.match(tracker, /data-reminders-optin[^>]*hidden/);
  assert.doesNotMatch(fs.readFileSync('src/js/reminders.js', 'utf8'), /\bfetch\(|XMLHttpRequest|sendBeacon|WebSocket/, 'nothing leaves the device');
  const css = fs.readFileSync('src/css/40-team-sync.css', 'utf8');
  assert.match(css, /\.rm-banner \{/);
  assert.doesNotMatch(css, /--red|--gold/);
});
