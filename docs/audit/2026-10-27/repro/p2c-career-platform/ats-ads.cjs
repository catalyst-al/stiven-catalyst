const { launch } = require('./pw.cjs');
const adDE = `Night Manager (m/w/d) – Hotel Frankfurt Airport
Wir suchen ab sofort eine/n Night Manager in Vollzeit. Ihre Aufgaben: Sie leiten die Nachtschicht an der Rezeption und führen das Team. Sie verantworten den Night Audit in Opera PMS und erstellen die Tagesabschlüsse. Sie werden Ansprechpartner für unsere Gäste und kümmern sich um Beschwerden. Sie arbeiten eng mit dem Front Office Manager zusammen.
Ihr Profil: Abgeschlossene Ausbildung in der Hotellerie, mehrjährige Erfahrung im Front Office, sehr gute Deutsch- und Englischkenntnisse, Kenntnisse in Opera PMS und MS Office, Führungserfahrung, Belastbarkeit und Teamfähigkeit. Wir freuen uns auf Ihre Bewerbung über unser Karriereportal. Wir werden Ihre Unterlagen vertraulich behandeln.`;
const adEN = `Operations Manager – Logistics. You will lead a team of 40 associates across two shifts, own KPIs such as on-time delivery and cost per parcel, drive continuous improvement using Lean and Six Sigma, and report weekly to the site leader. Requirements: 5+ years in logistics operations, people leadership, Excel, SQL, Power BI, WMS experience (SAP EWM preferred). You will also coach team leads and ensure safety compliance.`;
(async () => {
  const b = await launch(); const p = await b.newPage();
  await p.goto('http://localhost:8104/tools/ats-cv/');
  const r = await p.evaluate(([de,en]) => {
    const data = JSON.parse(document.getElementById('ats-cv-data').textContent);
    const stop = data.stopwords.split(/\s+/);
    return { de: window.AtsCv.keywords(de, stop), en: window.AtsCv.keywords(en, stop) };
  }, [adDE, adEN]);
  console.log(JSON.stringify(r, null, 0));
  await b.close();
})();
