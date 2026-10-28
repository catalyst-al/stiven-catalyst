const { launch } = require('./pw.cjs');
(async () => {
  const b = await launch();
  const p = await b.newPage();
  const errs=[]; p.on('pageerror', e=>errs.push(e.message));
  await p.goto('http://localhost:8104/tools/ats-cv/');
  const cases = [
    ['I build apps in JavaScript', 'Java', false],
    ['Java developer', 'Java', true],
    ['Datenbanken: MySQL, PostgreSQL', 'SQL', false],
    ['SQL, MySQL', 'SQL', true],
    ['clean code, cleaning', 'lean', false],
    ['Lean management', 'lean', true],
    ['excellent communication', 'excel', false],
    ['C, C++', 'C', true],
    ['Programming in C', 'c', true],
    ['R statistics', 'R', true],
    ['C++ and C#', 'C++', true],
    ['C# .NET', 'C#', true],
    ['follow up with guests', 'follow-up', true],
    ['followup', 'follow-up', true],
    ['Front Office', 'Front-Office', true],
    ['Frontoffice', 'front office', true],
    ['manages budgets', 'budget', true],
    ['budgeting', 'budget', false],
    ['analysis', 'analyses', false],
    ['Personalführung', 'Führung', false],
    ['Führung von Teams', 'Fuehrung', false],
    ['Fuehrung von Teams', 'Führung', false],
    ['Mitarbeiterführung', 'Mitarbeiterfuehrung', false],
    ['Strasse', 'Straße', false],
    ['STRASSE', 'straße', false],
    ['Menaxhim i ekipit', 'menaxhim', true],
    ['përgjegjës për ekipin', 'pergjegjes', false],
    ['pergjegjes', 'përgjegjës', false],
    ['çështje', 'ceshtje', false],
    ['café manager', 'café', false],
    ['café manager', 'café', false],
    ['Führung', 'führung', false],
    ['kommunikativ', 'Kommunikation', true],
    ['Kommunal', 'Kommunikation', false],
    ['operative Planung', 'operations', true],
    ['Controller', 'Controlling', true],
    ['Accountant', 'Accounting', true],
    ['teams', 'team', true],
    ['managen', 'manage', true],
    ['Excel-Kenntnisse', 'excel', true],
    ['Microsoft Excel', 'MS Excel', false],
    ['customer service', 'customer-service', true],
    ['Kundenservice', 'Service', false],
    ['Kundenservice', 'Kundendienst', false],
    ['İstanbul', 'istanbul', false],
    ['Night Audit', 'Night Auditor', false],
    ['Night Auditor', 'night audit', false],
    ['SAP S/4HANA', 'SAP', true],
    ['disappear', 'sap', false],
    ['HACCP-Schulung', 'HACCP', true],
    ['Erste-Hilfe', 'Erste Hilfe', true],
    ['B2B', 'b2b', true],
    ['e-mail', 'email', true],
    ['email', 'e-mail', true],
  ];
  const out = await p.evaluate((cases) => cases.map(([text, term, exp]) => {
    const actual = window.AtsCv.hasTerm(text.toLowerCase(), term);
    return { text, term, actual };
  }), cases);
  out.forEach((r) => console.log(JSON.stringify(r.text).padEnd(36), JSON.stringify(r.term).padEnd(26), r.actual));
  // keywords: extraction from short terms
  const kw = await p.evaluate(() => {
    const data = JSON.parse(document.getElementById('ats-cv-data').textContent);
    const stop = data.stopwords.split(/\s+/);
    return {
      tech: window.AtsCv.keywords('We need C, C#, R, Go, Java, SQL, AWS, BI, QA, HR, IT and ERP experience. C and R and Go again. C# C# R R.', stop),
      nfd: window.AtsCv.keywords('Führung Führung Qualität Qualität', stop),
      nfc: window.AtsCv.keywords('Führung Führung Qualität Qualität', stop),
    };
  });
  console.log(JSON.stringify(kw));
  console.log('errors', errs);
  await b.close();
})();
