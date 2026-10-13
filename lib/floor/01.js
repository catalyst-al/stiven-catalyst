// Nga terreni (From the Floor, Aus der Praxis), issue 1, October 2026: The manager in the middle. Written in the
// format of the Management Review (lib/weekly/issues), drawn by the same pages under the name of the magazine
// (src/_data/magazine.js). The trend and the research are the editors', from the sources below, most of them
// checked already for the Management Review (Nos. 1, 9, 10, 57); "From the floor" is Stiven Janaqi's own answers,
// edited only for spelling. The Albanian draft and its fact check: docs/revista/numri-01*.md.
import { x, pc } from "../weekly/common.js";

// "8.2" in English, "8,2" in Albanian and German.
const dec = (n) => x(n, n.replace(".", ","), n.replace(".", ","));

export default {
  number: 1,
  slug: "nga-terreni-01",
  block: "role",
  date: x("October 2026", "Tetor 2026", "Oktober 2026"),
  theme: [x("The manager", "Menaxheri", "Die Führungskraft"), x("in the middle", "në mes", "in der Mitte")],
  sub: x(
    "Data, AI and the decision: why engagement falls most among managers, who trains them, how large their teams have grown, how AI arrives through them, and answers from the floor.",
    "Të dhënat, AI dhe vendimi: pse angazhimi bie më shumë te menaxherët, kush i trajnon, sa janë rritur ekipet e tyre, si vjen AI përmes tyre, dhe përgjigje nga terreni.",
    "Daten, KI und die Entscheidung: warum das Engagement bei Führungskräften am stärksten sinkt, wer sie schult, wie groß ihre Teams geworden sind, wie KI über sie ankommt, und Antworten aus der Praxis."),
  // For Publications and the lists of issues.
  lead: x(
    "The latest data show something many people in operations have felt for a long time: the pressure gathers at the manager.",
    "Të dhënat e fundit tregojnë diçka që shumë njerëz në operacione e ndiejnë prej kohësh: presioni mblidhet te menaxheri.",
    "Die neuesten Daten zeigen, was viele im Betrieb seit Langem spüren: Der Druck sammelt sich bei der Führungskraft."),
  seo: x(
    "The manager in the middle: falling engagement, missing training, larger teams and AI, in Gallup's figures, with answers from the floor and a KPI tool.",
    "Menaxheri në mes: angazhimi që bie, trajnimi që mungon, ekipet më të mëdha dhe AI, në shifrat e Gallup, me përgjigje nga terreni dhe një mjet KPI.",
    "Die Führungskraft in der Mitte: sinkendes Engagement, fehlende Schulung, größere Teams und KI in Gallups Zahlen, mit Antworten aus der Praxis."),
  feature: x(
    "Issue 1 follows the fall in engagement among managers, counts how few of them were trained for the role, measures how far their teams have grown, shows how AI arrives through them, lets Stiven Janaqi answer from the floor, and ends with a simple rhythm and the KPI Diagnostic.",
    "Numri 1 ndjek rënien e angazhimit te menaxherët, numëron sa pak prej tyre u trajnuan për rolin, mat sa janë rritur ekipet e tyre, tregon si vjen AI përmes tyre, i lë Stiven Janaqit fjalën nga terreni, dhe mbyllet me një ritëm të thjeshtë dhe Diagnostikimin e KPI-së.",
    "Ausgabe 1 folgt dem sinkenden Engagement der Führungskräfte, zählt, wie wenige für die Rolle geschult wurden, misst, wie groß ihre Teams geworden sind, zeigt, wie KI über sie ankommt, lässt Stiven Janaqi aus der Praxis antworten und endet mit einem einfachen Rhythmus und der KPI-Diagnose."),
  figure: { n: pc(22), by: "Gallup, 2026", t: x(
    "of managers worldwide were engaged at work in 2025, down from 31% in 2022.",
    "e menaxherëve në botë ishin të angazhuar në punë në 2025, nga 31% në 2022.",
    "der Führungskräfte weltweit waren 2025 engagiert, nach 31 % im Jahr 2022.") },
  teasers: [
    { page: "trend", kicker: x("Trend of the month", "Trendi i muajit", "Trend des Monats"),
      title: x("The manager in the middle", "Menaxheri në mes", "Die Führungskraft in der Mitte") },
    { page: "ai", kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: x("AI arrives through the manager", "AI vjen përmes menaxherit", "KI kommt über die Führung") },
    { page: "floor", kicker: x("From the floor", "Si e shoh nga terreni", "Aus der Praxis"),
      title: x("Signal or noise", "Sinjali apo zhurma", "Signal oder Rauschen") },
  ],
  sources: [
    { id: "gallup-sogw-2026", by: "Gallup", year: 2026, title: "State of the Global Workplace: 2026 Report", url: "https://www.gallup.com/workplace/349484/state-of-the-global-workplace.aspx" },
    { id: "gallup-sogw-2025", by: "Gallup", year: 2025, title: "State of the Global Workplace: 2025 Report", url: "https://www.gallup.com/file/workplace/659528/state-of-the-global-workplace-2025-download.pdf" },
    { id: "gallup-manager-2015", by: "Gallup", year: 2015, title: "State of the American Manager", url: "https://www.gallup.com/services/182138/state-american-manager.aspx" },
    { id: "cmi-2023", by: "Chartered Management Institute", year: 2023, title: "Better Management Report: Taking responsibility", url: "https://www.managers.org.uk/knowledge-and-insights/research/better-management-report-take-responsibility-take-action/" },
    { id: "span-gallup-2026", by: "Jim Harter, Gallup", year: 2026, title: "Span of Control: What's the Optimal Team Size for Managers?", url: "https://www.gallup.com/workplace/700718/span-control-optimal-team-size-managers.aspx" },
    { id: "gallup-ai-q2-2026", by: "Gallup", year: 2026, title: "AI and Workplace Productivity: What Leaders Need to Know", url: "https://www.gallup.com/workplace/713063/ai-workplace-productivity.aspx" },
    { id: "gallup-ai-engagement-2026", by: "Jim Harter, Gallup", year: 2026, title: "Employee Engagement Remains Flat as AI Adoption Accelerates", url: "https://www.gallup.com/workplace/712433/employee-engagement-remains-flat-adoption-accelerates.aspx" },
    { id: "gartner-2024", by: "Gartner", year: 2024, title: "Gartner Unveils Top Predictions for IT Organizations and Users in 2025 and Beyond", url: "https://www.gartner.com/en/newsroom/press-releases/2024-10-22-gartner-unveils-top-predictions-for-it-organizations-and-users-in-2025-and-beyond", via: "Network World, 22 October 2024" },
  ],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Targets from above, problems from the floor, data, and now AI: they all meet at the manager. This issue asks what the latest figures say about the person in the middle, and what an organisation can do for them tomorrow.",
        "Objektivat nga lart, problemet nga terreni, të dhënat, dhe tani AI: të gjitha takohen te menaxheri. Ky numër pyet çfarë thonë shifrat e fundit për personin në mes, dhe çfarë mund të bëjë një organizatë për të që nesër.",
        "Vorgaben von oben, Probleme aus der Praxis, Daten und jetzt KI: Alles trifft sich bei der Führungskraft. Diese Ausgabe fragt, was die neuesten Zahlen über die Person in der Mitte sagen und was eine Organisation morgen für sie tun kann."),
      body: x(
        "Only 20% of employees worldwide were engaged in 2025, and managers fell furthest: from 31% in 2022 to 22%. Fewer than half say they were ever trained for the role, their teams have grown, and AI now arrives through them. Stiven Janaqi answers from the floor: a manager who reacts to everything becomes part of the problem. A simple rhythm and the KPI Diagnostic close the issue.",
        "Vetëm 20% e punonjësve në botë ishin të angazhuar në 2025, dhe menaxherët ranë më shumë: nga 31% në 2022 në 22%. Më pak se gjysma thonë se janë trajnuar ndonjëherë për rolin, ekipet e tyre janë rritur, dhe tani AI vjen përmes tyre. Stiven Janaqi përgjigjet nga terreni: menaxheri që reagon ndaj gjithçkaje bëhet pjesë e problemit. Numri mbyllet me një ritëm të thjeshtë dhe Diagnostikimin e KPI-së.",
        "Nur 20 % der Beschäftigten weltweit waren 2025 engagiert, und Führungskräfte fielen am tiefsten: von 31 % im Jahr 2022 auf 22 %. Weniger als die Hälfte sagt, je für die Rolle geschult worden zu sein, ihre Teams sind gewachsen, und KI kommt nun über sie an. Stiven Janaqi antwortet aus der Praxis: Wer auf alles reagiert, wird Teil des Problems. Ein einfacher Rhythmus und die KPI-Diagnose schließen die Ausgabe."),
    },
    {
      id: "trend",
      kicker: x("Trend of the month", "Trendi i muajit", "Trend des Monats"),
      title: [x("The manager", "Menaxheri", "Die Führungskraft"), x("in the middle", "në mes", "in der Mitte")],
      lead: x(
        "Only 20% of employees worldwide were engaged at work in 2025, down from 23% in 2022. The steepest fall was among managers.",
        "Vetëm 20% e punonjësve në botë ishin të angazhuar në punë në 2025, nga 23% në 2022. Rënia më e madhe ishte te menaxherët.",
        "Nur 20 % der Beschäftigten weltweit waren 2025 engagiert, nach 23 % im Jahr 2022. Am stärksten fiel der Wert bei den Führungskräften."),
      blocks: [
        { type: "line", alert: true, min: 0, max: 40, height: 104, source: ["gallup-sogw-2026"],
          label: x("Engaged managers worldwide, 2022–2025", "Menaxherët e angazhuar në botë, 2022–2025", "Engagierte Führungskräfte weltweit, 2022–2025"),
          points: [
            { k: "2022", v: 31, n: pc(31) },
            { k: "2023", v: 30, n: pc(30) },
            { k: "2024", v: 27, n: pc(27) },
            { k: "2025", v: 22, n: pc(22) },
          ] },
        { type: "figures", compact: true, items: [
          { n: pc(19), t: x("of employees without a management role were engaged in 2025", "e punonjësve pa rol menaxheri ishin të angazhuar në 2025", "der Beschäftigten ohne Führungsrolle waren 2025 engagiert") },
          { n: pc(12), t: x("in Europe, the lowest region (three-year average)", "në Evropë, rajoni më i ulët (mesatare e tri viteve)", "in Europa, der niedrigsten Region (Dreijahresmittel)") },
          { n: pc(70), t: x("of the variance in a team's engagement is linked to its manager", "e ndryshimit në angazhimin e një ekipi lidhet me menaxherin", "der Varianz im Engagement eines Teams hängen an der Führungskraft") },
        ] },
        { type: "callout", reading: true, text: x(
          "For years managers were clearly more engaged than their teams. That advantage has almost disappeared, and what happens to the manager does not stay with the manager.",
          "Për vite me radhë, menaxherët ishin dukshëm më të angazhuar se ekipet e tyre. Ky avantazh pothuajse është zhdukur, dhe ajo që i ndodh menaxherit nuk mbetet vetëm te menaxheri.",
          "Jahrelang waren Führungskräfte deutlich engagierter als ihre Teams. Dieser Vorsprung ist fast verschwunden, und was mit der Führungskraft geschieht, bleibt nicht bei ihr.") },
      ],
      note: x(
        "Engagement as Gallup measures it, data for 2025. The 70% is Gallup's estimate across business units (2015).",
        "Angazhimi siç e mat Gallup, të dhëna për 2025. 70% është vlerësimi i Gallup ndër njësitë e biznesit (2015).",
        "Engagement, wie Gallup es misst, Daten für 2025. Die 70 % sind Gallups Schätzung über Geschäftseinheiten hinweg (2015)."),
      source: ["gallup-sogw-2026", "gallup-manager-2015"],
    },
    {
      id: "training", more: "the-first-30-days",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("Promoted,", "Të promovuar,", "Befördert,"), x("not prepared", "jo të përgatitur", "nicht vorbereitet")],
      lead: x(
        "Less than half of the world's managers, 44%, say they have received management training. Half as many of those who were trained are actively disengaged as of those who were not.",
        "Më pak se gjysma e menaxherëve në botë, 44%, thonë se kanë marrë trajnim për menaxhim. Te ata që u trajnuan, aktivisht të shkëputur janë gjysma e atyre që nuk u trajnuan.",
        "Weniger als die Hälfte der Führungskräfte weltweit, 44 %, sagt, eine Führungsschulung erhalten zu haben. Unter den Geschulten sind halb so viele aktiv unengagiert wie unter den Ungeschulten."),
      blocks: [
        { type: "hbars", max: 100, source: ["cmi-2023"],
          label: x("UK managers and formal management training (2023)", "Menaxherët në Mbretërinë e Bashkuar dhe trajnimi formal për menaxhim (2023)", "Führungskräfte im Vereinigten Königreich und formale Führungsschulung (2023)"),
          items: [
            { k: x("No formal training when they took the role", "Pa trajnim formal kur morën rolin", "Ohne formale Schulung beim Antritt der Rolle"), v: 82, n: pc(82), alert: true },
            { k: x("No management qualification", "Pa kualifikim për menaxhim", "Ohne Führungsqualifikation"), v: 52, n: pc(52) },
            { k: x("Never any formal training", "Asnjëherë trajnim formal", "Nie eine formale Schulung"), v: 33, n: pc(33) },
          ] },
        { type: "stats", cols: 2, items: [
          { n: pc(44), t: x("of managers worldwide say they have received management training (2024)", "e menaxherëve në botë thonë se kanë marrë trajnim për menaxhim (2024)", "der Führungskräfte weltweit sagen, sie seien geschult worden (2024)"), by: "Gallup, 2025" },
          { n: pc(79), t: x("of managers were engaged in best-practice organisations in 2025, nearly four times the world", "e menaxherëve ishin të angazhuar në organizatat me praktikat më të mira në 2025, gati katërfishi i botës", "der Führungskräfte waren 2025 in Best-Practice-Organisationen engagiert, fast das Vierfache der Welt"), by: "Gallup, 2026" },
        ] },
        { type: "callout", reading: true, text: x(
          "Many people are promoted because they are good at the operational work. The decline is not a law of nature: where managers are prepared, it does not happen.",
          "Shumë njerëz promovohen sepse janë të mirë në punën operative. Rënia nuk është ligj natyre: ku menaxherët përgatiten, ajo nuk ndodh.",
          "Viele werden befördert, weil sie die operative Arbeit gut machen. Der Rückgang ist kein Naturgesetz: Wo Führungskräfte vorbereitet werden, findet er nicht statt.") },
      ],
      note: x(
        "Gallup's training figures are from the 2025 report (data for 2024); the report gives no shares for the actively disengaged. CMI: YouGov, 2,524 UK managers, June 2023.",
        "Shifrat e Gallup për trajnimin janë nga raporti i 2025 (të dhëna për 2024); raporti nuk jep përqindje për të shkëputurit aktivisht. CMI: YouGov, 2.524 menaxherë në Mbretërinë e Bashkuar, qershor 2023.",
        "Gallups Schulungszahlen stammen aus dem Bericht 2025 (Daten für 2024); der Bericht nennt keine Anteile für aktiv Unengagierte. CMI: YouGov, 2.524 Führungskräfte im Vereinigten Königreich, Juni 2023."),
      source: ["gallup-sogw-2025", "gallup-sogw-2026", "cmi-2023"],
    },
    {
      id: "span",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("Larger teams,", "Ekipe më të mëdha,", "Größere Teams,"), x("not everywhere", "jo kudo njësoj", "nicht überall")],
      lead: x(
        "In the US the average number of direct reports per manager rose from 8.2 in 2013 to 12.1 in 2025, because some teams became very large. The median stays at about 5 to 6.",
        "Në SHBA, numri mesatar i vartësve direkt për menaxher u rrit nga 8,2 në 2013 në 12,1 në 2025, sepse disa ekipe u bënë shumë të mëdha. Mediana mbetet rreth 5 deri në 6.",
        "In den USA stieg die durchschnittliche Zahl direkt Unterstellter je Führungskraft von 8,2 im Jahr 2013 auf 12,1 im Jahr 2025, weil einige Teams sehr groß wurden. Der Median bleibt bei etwa 5 bis 6."),
      blocks: [
        { type: "line", min: 0, max: 14, ticks: [0, 4, 8, 12], height: 112,
          label: x("Average number of direct reports, managers and leaders in the US", "Numri mesatar i vartësve direkt, menaxherët dhe drejtuesit në SHBA", "Durchschnittliche Zahl direkt Unterstellter, Führungskräfte in den USA"),
          points: [
            { k: "2013", v: 8.2, n: dec("8.2") },
            { k: "2019", v: 9.1, n: dec("9.1") },
            { k: "2022", v: 10.5, n: dec("10.5") },
            { k: "2023", v: 10.6, n: dec("10.6") },
            { k: "2024", v: 10.9, n: dec("10.9") },
            { k: "2025", v: 12.1, n: dec("12.1") },
          ] },
        { type: "donut", v: 40, n: pc(40), t: x(
          "of their time, the median, US managers spend on individual contributor work; 97% have some of it besides leading others.",
          "të kohës së tyre, mediana, menaxherët në SHBA e kalojnë me punë si kontribues individual; 97% kanë diçka të tillë krahas drejtimit të të tjerëve.",
          "ihrer Zeit, im Median, verbringen US-Führungskräfte mit eigener Facharbeit; 97 % haben solche Arbeit neben der Führung.") },
        { type: "callout", reading: true, text: x(
          "The number on the org chart says little. The question is how many people a manager can really give the attention the role demands.",
          "Numri në organigramë thotë pak. Pyetja është sa njerëzve mund t'u japë vërtet një menaxher vëmendjen që kërkon roli.",
          "Die Zahl im Organigramm sagt wenig. Die Frage ist, wie vielen Menschen eine Führungskraft wirklich die Aufmerksamkeit geben kann, die die Rolle verlangt.") },
      ],
      note: x(
        "Gallup's US panel; the average includes leaders with very large spans. The span of control is the subject of Management Review No. 57.",
        "Paneli i Gallup në SHBA; mesatarja përfshin drejtues me ekipe shumë të mëdha. Shtrirja e kontrollit është tema e Management Review Nr. 57.",
        "Gallups US-Panel; der Durchschnitt schließt Führungskräfte mit sehr großen Teams ein. Die Führungsspanne ist Thema von Management Review Nr. 57."),
      source: ["span-gallup-2026"],
    },
    {
      id: "ai",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("AI arrives", "AI vjen", "KI kommt"), x("through the manager", "përmes menaxherit", "über die Führung")],
      lead: x(
        "Frequent use of AI at work, a few times a week or more, has risen at every level in the US since 2023, fastest among leaders. Whether teams follow depends on their manager.",
        "Përdorimi i shpeshtë i AI-së në punë, disa herë në javë ose më shumë, është rritur në çdo nivel në SHBA që nga 2023, më shpejt te drejtuesit. Nëse ekipet ndjekin, varet nga menaxheri i tyre.",
        "Die häufige KI-Nutzung bei der Arbeit, mehrmals pro Woche oder öfter, ist in den USA seit 2023 auf jeder Ebene gestiegen, am schnellsten bei Leitenden. Ob Teams folgen, hängt an ihrer Führungskraft."),
      blocks: [
        { type: "pairs", from: "2023", to: x("Q2 2026", "T2 2026", "Q2 2026"), max: 60, source: ["gallup-ai-q2-2026"],
          label: x("US employees using AI a few times a week or more", "Punonjës në SHBA që përdorin AI disa herë në javë ose më shumë", "US-Beschäftigte, die KI mehrmals pro Woche oder öfter nutzen"),
          rows: [
            { k: x("Leaders", "Drejtuesit", "Leitende"), a: 17, an: pc(17), b: 51, bn: pc(51) },
            { k: x("Managers", "Menaxherët", "Führungskräfte"), a: 15, an: pc(15), b: 36, bn: pc(36), alert: true },
            { k: x("Individual contributors", "Punonjësit pa rol menaxheri", "Ohne Führungsrolle"), a: 9, an: pc(9), b: 26, bn: pc(26) },
          ] },
        { type: "hbars", max: 60, source: ["gallup-ai-engagement-2026"],
          label: x("Engaged employees in organisations that have brought in AI (2026)", "Punonjës të angazhuar në organizatat që kanë futur AI (2026)", "Engagierte Beschäftigte in Organisationen mit KI (2026)"),
          items: [
            { k: x("Frequent use, a clear plan and the manager's support", "Përdorim i shpeshtë, plan i qartë dhe mbështetja e menaxherit", "Häufige Nutzung, klarer Plan und Unterstützung der Führung"), v: 53, n: pc(53) },
            { k: x("The manager actively supports the team's AI use", "Menaxheri e mbështet aktivisht përdorimin e AI-së", "Die Führungskraft unterstützt die KI-Nutzung aktiv"), v: 48, n: pc(48) },
            { k: x("Without that support", "Pa këtë mbështetje", "Ohne diese Unterstützung"), v: 30, n: pc(30), alert: true },
          ] },
        { type: "p", text: x(
          "A prediction, not a measurement: in October 2024 Gartner predicted that through 2026, 20% of organisations would use AI to flatten their structure, eliminating more than half of current middle management positions.",
          "Një parashikim, jo një matje: në tetor 2024, Gartner parashikoi se deri në 2026, 20% e organizatave do ta përdorin AI-në për të rrafshuar strukturën, duke hequr më shumë se gjysmën e pozicioneve aktuale të menaxhimit të mesëm.",
          "Eine Prognose, keine Messung: Im Oktober 2024 sagte Gartner voraus, dass bis 2026 20 % der Organisationen KI nutzen, um ihre Struktur abzuflachen, und mehr als die Hälfte der heutigen Stellen im mittleren Management streichen.") },
      ],
      note: x(
        "Gallup Panel, US. Engagement: Q1–Q2 2026, employees whose organisation has brought in AI. Gartner's release quoted by Network World.",
        "Paneli i Gallup, SHBA. Angazhimi: T1–T2 2026, punonjës organizata e të cilëve ka futur AI. Njoftimi i Gartner i cituar nga Network World.",
        "Gallup-Panel, USA. Engagement: Q1–Q2 2026, Beschäftigte, deren Organisation KI eingeführt hat. Gartners Mitteilung zitiert nach Network World."),
      source: ["gallup-ai-q2-2026", "gallup-ai-engagement-2026", "gartner-2024"],
    },
    {
      id: "floor",
      kicker: x("From the floor", "Si e shoh nga terreni", "Aus der Praxis"),
      title: [x("Signal", "Sinjali", "Signal"), x("or noise", "apo zhurma", "oder Rauschen")],
      lead: x("Stiven Janaqi has been a Team Leader and an Area Manager in last-mile logistics and works today as a Night Auditor in hospitality.", "Stiven Janaqi ka qenë Team Leader dhe Area Manager në logjistikën e miljes së fundit, dhe sot punon si Night Auditor në hoteleri.", "Stiven Janaqi war Team Leader und Area Manager in der Last-Mile-Logistik und arbeitet heute als Night Auditor in der Hotellerie."),
      blocks: [
        { type: "qa", items: [
          { q: x("When you were promoted, what took most of your energy?", "Kur u ngrite në detyrë, çfarë ta harxhonte më shumë energjinë?", "Was hat Sie nach der Beförderung die meiste Energie gekostet?"), a: [
            x("When I moved from a role closer to the operation to Area Manager, after about five months, the challenge was no longer only solving the problems of the moment. I had 4 Shift Leaders and 8 Dispatchers reporting to me directly, while the operation included around 250 drivers indirectly. Most of my energy went into moving constantly from one problem to the next: KPIs, delays, quality, damage, loading, safety, and people who needed decisions or support.", "Kur kalova nga një rol më afër operacionit në Area Manager, pas rreth pesë muajsh, sfida nuk ishte më vetëm të zgjidhja problemet e momentit. Kisha 4 Shift Leaders dhe 8 Dispatchers në strukturën direkte, ndërsa operacioni përfshinte rreth 250 shoferë indirekt. Energjia më e madhe shkonte te kalimi i vazhdueshëm nga një problem te tjetri: KPI, vonesa, cilësi, dëmtime, ngarkim, siguri dhe njerëz që kishin nevojë për vendime ose mbështetje.", "Als ich nach etwa fünf Monaten von einer Rolle näher am Betrieb zum Area Manager wurde, ging es nicht mehr nur darum, die Probleme des Moments zu lösen. Ich hatte 4 Shift Leaders und 8 Dispatcher direkt unter mir, und zum Betrieb gehörten indirekt rund 250 Fahrer. Die meiste Energie ging in den ständigen Wechsel von einem Problem zum nächsten: KPIs, Verspätungen, Qualität, Schäden, Beladung, Sicherheit und Menschen, die Entscheidungen oder Unterstützung brauchten."),
            x("What wears you out is not always the size of a problem. It is the number of small problems that need attention at the same time.", "Ajo që të lodh nuk është gjithmonë madhësia e një problemi. Është numri i problemeve të vogla që kërkojnë vëmendje njëkohësisht.", "Was einen müde macht, ist nicht immer die Größe eines Problems. Es ist die Zahl der kleinen Probleme, die gleichzeitig Aufmerksamkeit brauchen."),
          ] },
          { q: x("Did you get management training?", "A more trajnim për menaxhim?", "Haben Sie ein Führungstraining bekommen?"), a: [
            x("What would have helped me a lot is an onboarding made for the move from operator to manager: how to prioritise, how to delegate, how to give feedback, how to develop people, and how to tell a problem that needs you from a problem the team should solve itself.", "Ajo që do të më kishte ndihmuar shumë do të ishte një onboarding specifik për kalimin nga operator në menaxher: si të prioritizosh, si të delegosh, si të japësh feedback, si të zhvillosh njerëzit dhe si të dallosh një problem që kërkon ndërhyrjen tënde nga një problem që ekipi duhet ta zgjidhë vetë.", "Sehr geholfen hätte mir ein Onboarding speziell für den Schritt vom Operator zur Führungskraft: wie man priorisiert, wie man delegiert, wie man Feedback gibt, wie man Menschen entwickelt und wie man ein Problem, das einen selbst braucht, von einem unterscheidet, das das Team selbst lösen sollte."),
            x("Many people are promoted because they are good at the operational work. But the manager's job needs a different set of skills.", "Shumë njerëz promovohen sepse janë të mirë në punën operative. Por puna e menaxherit kërkon një grup tjetër aftësish.", "Viele werden befördert, weil sie in der operativen Arbeit gut sind. Aber die Arbeit einer Führungskraft verlangt andere Fähigkeiten."),
          ] },
          { q: x("Does it ring true that managers can be as disengaged as their teams?", "A të duket e vërtetë që menaxherët mund të jenë po aq pak të angazhuar sa ekipet e tyre?", "Klingt es glaubwürdig, dass Führungskräfte so wenig engagiert sein können wie ihre Teams?"), a: [
            x("Yes, it seems credible from what I have seen. Not because managers do not want to do their job, but because they are often the point where all the pressures gather. From above come the targets, the KPIs and the deadlines. From below come people's problems, absences, conflicts and the reality of the operation. In between are the reports, the meetings and the admin.", "Po, më duket e besueshme nga ajo që kam parë. Jo sepse menaxherët nuk duan të bëjnë punën e tyre, por sepse shpesh janë pika ku mblidhen të gjitha presionet. Nga lart vijnë objektivat, KPI-të dhe afatet. Nga poshtë vijnë problemet e njerëzve, mungesat, konfliktet dhe realiteti i operacionit. Në mes janë raportet, takimet dhe administrata.", "Ja, nach dem, was ich gesehen habe, ist das glaubwürdig. Nicht weil Führungskräfte ihre Arbeit nicht machen wollen, sondern weil sie oft der Punkt sind, an dem sich der ganze Druck sammelt. Von oben kommen Ziele, KPIs und Fristen. Von unten kommen die Probleme der Menschen, Ausfälle, Konflikte und die Realität des Betriebs. Dazwischen liegen Berichte, Meetings und Verwaltung."),
            x("When this goes on for long, a manager can slide from leading the team to reacting to problems. At that point the energy for coaching, development and improvement is gone.", "Kur kjo vazhdon gjatë, menaxheri mund të kalojë nga drejtimi i ekipit te reagimi ndaj problemeve. Në atë moment humbet energjia për coaching, zhvillim dhe përmirësim.", "Wenn das lange anhält, kann eine Führungskraft vom Führen des Teams ins Reagieren auf Probleme rutschen. Dann fehlt die Energie für Coaching, Entwicklung und Verbesserung."),
          ] },
        ] },
      ],
    },
    {
      id: "floor-2",
      kicker: x("From the floor", "Si e shoh nga terreni", "Aus der Praxis"),
      blocks: [
        { type: "qa", closing: x("When I started leading larger operations, I thought my job was to have as many answers as possible. Over time I understood that the most valuable part of the role was knowing which problems really needed my attention. A manager who reacts to everything quickly becomes part of the problem. A manager who tells the signal from the noise can start building a system.", "Kur fillova të drejtoja operacione më të mëdha, mendova se detyra ime ishte të kisha sa më shumë përgjigje. Me kohën kuptova se pjesa më e vlefshme e rolit ishte të dija cilat probleme kërkonin vërtet vëmendjen time. Menaxheri që reagon ndaj gjithçkaje bëhet shpejt pjesë e problemit. Menaxheri që dallon sinjalin nga zhurma mund të fillojë të ndërtojë sistem.", "Als ich anfing, größere Betriebe zu führen, dachte ich, meine Aufgabe sei es, möglichst viele Antworten zu haben. Mit der Zeit habe ich verstanden, dass der wertvollste Teil der Rolle war zu wissen, welche Probleme wirklich meine Aufmerksamkeit brauchten. Eine Führungskraft, die auf alles reagiert, wird schnell Teil des Problems. Eine Führungskraft, die das Signal vom Rauschen unterscheidet, kann anfangen, ein System aufzubauen."), sign: "Stiven Janaqi", items: [
          { q: x("How many direct reports are too many in operations?", "Sa vartës direkt janë shumë në operacione?", "Wie viele direkt Unterstellte sind im Betrieb zu viele?"), a: [
            x("I do not believe in a universal number. It depends on how complex the work is and how autonomous the people are. But from my experience, 12 direct reports in a fast-paced operation is already a serious span. If each of them needs feedback, coaching, problem-solving and escalation, the quality of management can drop very quickly.", "Nuk besoj te një numër universal. Varet nga kompleksiteti i punës dhe sa autonomë janë njerëzit. Por nga eksperienca ime, 12 persona direkt në një operacion me ritëm të lartë janë tashmë një span serioz. Nëse secili prej tyre kërkon feedback, coaching, zgjidhje problemesh dhe eskalim, cilësia e menaxhimit mund të bjerë shumë shpejt.", "Ich glaube nicht an eine universelle Zahl. Es hängt davon ab, wie komplex die Arbeit ist und wie selbstständig die Menschen sind. Aber nach meiner Erfahrung sind 12 direkt Unterstellte in einem Betrieb mit hohem Tempo schon eine ernsthafte Spanne. Wenn jeder von ihnen Feedback, Coaching, Problemlösung und Eskalation braucht, kann die Qualität der Führung sehr schnell sinken."),
            x("The problem is not only how many people you have on the org chart. The question is: how many of them can you really give the attention your role demands?", "Problemi nuk është vetëm sa njerëz ke në organigramë. Pyetja është: sa prej tyre mund t'u japësh realisht vëmendjen që kërkon roli yt?", "Das Problem ist nicht nur, wie viele Menschen im Organigramm stehen. Die Frage ist: Wie vielen von ihnen können Sie wirklich die Aufmerksamkeit geben, die Ihre Rolle verlangt?"),
          ] },
          { q: x("One thing an organisation could do tomorrow for its first-line managers?", "Një gjë që një organizatë mund ta bëjë nesër për menaxherët e linjës së parë?", "Eine Sache, die eine Organisation morgen für ihre Führungskräfte der ersten Ebene tun könnte?"), a: [
            x("Give them clarity on priorities and take away part of the administrative noise. A first-line manager should not spend most of the day producing reports about the work they should be managing.", "T'u japë qartësi mbi prioritetet dhe t'u heqë një pjesë të zhurmës administrative. Një menaxher i linjës së parë nuk duhet të kalojë pjesën më të madhe të ditës duke prodhuar raporte për punën që duhet të ishte duke menaxhuar.", "Ihnen Klarheit über die Prioritäten geben und ihnen einen Teil des Verwaltungslärms abnehmen. Eine Führungskraft der ersten Ebene sollte nicht den größten Teil des Tages damit verbringen, Berichte über die Arbeit zu schreiben, die sie eigentlich führen sollte."),
            x("I would set up a simple rhythm: a few KPIs that matter, open problems with a clear owner, a short moment for the people, and a defined channel for escalation. If everything is a priority, in the end the manager only reacts.", "Do të krijoja një ritëm të thjeshtë: pak KPI që kanë rëndësi, probleme të hapura me owner të qartë, një moment të shkurtër për njerëzit dhe një kanal të përcaktuar për eskalim. Nëse çdo gjë është prioritet, menaxheri në fund vetëm reagon.", "Ich würde einen einfachen Rhythmus schaffen: wenige KPIs, die zählen, offene Probleme mit klarem Owner, ein kurzer Moment für die Menschen und ein festgelegter Kanal für Eskalation. Wenn alles Priorität hat, reagiert die Führungskraft am Ende nur noch."),
          ] },
        ] },
        { type: "callout", label: x("A question for you", "Pyetja për ju", "Eine Frage an Sie"), text: x("How much of your day as a manager goes into reacting to problems, and how much into building what prevents them?", "Sa nga dita juaj si menaxher shkon te reagimi ndaj problemeve, dhe sa te ndërtimi i asaj që i parandalon ato?", "Wie viel Ihres Tages als Führungskraft geht in die Reaktion auf Probleme, und wie viel in den Aufbau dessen, was sie verhindert?") },
      ],
    },

    {
      id: "rhythm", more: "solve-it-or-escalate-it",
      kicker: x("The practice", "Praktika", "Die Praxis"),
      title: [x("A simple", "Një ritëm", "Ein einfacher"), x("rhythm", "i thjeshtë", "Rhythmus")],
      lead: x(
        "Stiven Janaqi's answer to what an organisation could do tomorrow, as a card for the week: a few KPIs that matter, open problems with an owner, a moment for the people, one channel for escalation.",
        "Përgjigja e Stiven Janaqit për atë që mund të bëjë një organizatë nesër, si një kartë për javën: pak KPI që kanë rëndësi, problemet e hapura me përgjegjës, një moment për njerëzit, një kanal për përshkallëzimin.",
        "Stiven Janaqis Antwort darauf, was eine Organisation morgen tun könnte, als Karte für die Woche: wenige KPIs, die zählen, offene Probleme mit Verantwortlichem, ein Moment für die Menschen, ein Kanal für Eskalation."),
      blocks: [
        { type: "form", items: [
          { h: x("Three KPIs that matter this week", "Tri KPI që kanë rëndësi këtë javë", "Drei KPIs, die diese Woche zählen"), hint: x("and the one that is red", "dhe ai që është i kuq", "und der, der rot ist") },
          { h: x("Open problems, each with an owner", "Problemet e hapura, secili me përgjegjës", "Offene Probleme, jedes mit Verantwortlichem"), hint: x("name and date, not “the team”", "emër dhe datë, jo “ekipi”", "Name und Datum, nicht „das Team“"), lines: 2 },
          { h: x("A moment for the people", "Një moment për njerëzit", "Ein Moment für die Menschen"), hint: x("who needs feedback or help this week", "kush ka nevojë për feedback ose ndihmë këtë javë", "wer diese Woche Feedback oder Hilfe braucht") },
          { h: x("The escalation channel", "Kanali i përshkallëzimit", "Der Eskalationsweg"), hint: x("what goes up, to whom, by when", "çfarë shkon lart, te kush, deri kur", "was nach oben geht, an wen, bis wann") },
          { h: x("One report I can stop", "Një raport që mund ta ndal", "Ein Bericht, den ich streichen kann"), hint: x("the administrative noise to take away", "zhurma administrative për ta hequr", "das Verwaltungsrauschen, das wegfallen kann") },
        ] },
      ],
      note: x(
        "A practice proposed by the editors after Stiven Janaqi's answer on page 8. If everything is a priority, in the end the manager only reacts.",
        "Praktikë e propozuar nga redaksia sipas përgjigjes së Stiven Janaqit në faqen 8. Nëse gjithçka është prioritet, në fund menaxheri vetëm reagon.",
        "Eine Praxis, die die Redaktion nach Stiven Janaqis Antwort auf Seite 8 vorschlägt. Wenn alles Priorität hat, reagiert die Führungskraft am Ende nur."),
    },
    {
      id: "tool", tool: "/tools/kpi-diagnostic/", more: "kpis-do-not-improve-in-excel",
      kicker: x("Tool of the month", "Mjeti i muajit", "Tool des Monats"),
      title: [x("The KPI", "Diagnostikimi", "Die"), x("Diagnostic", "i KPI-së", "KPI-Diagnose")],
      lead: x("A number turned red. Before you push harder, find out where the cause sits. Ten statements show whether it lies in clarity, skill, capacity, process design or ownership, with three first moves and a question for the floor. It takes about two minutes, and nothing you enter is stored or sent.", "Një shifër u bë e kuqe. Para se të shtyni më fort, gjeni ku është shkaku. Dhjetë pohime tregojnë nëse shkaku është te qartësia, aftësia, kapaciteti, procesi apo përgjegjësia, me tre hapa të parë dhe një pyetje për ekipin. Zgjat rreth dy minuta, dhe asgjë që shkruani nuk ruhet e nuk dërgohet.", "Eine Zahl ist rot geworden. Bevor Sie stärker drücken, finden Sie heraus, wo die Ursache liegt. Zehn Aussagen zeigen, ob sie bei Klarheit, Können, Kapazität, Prozessgestaltung oder Verantwortung liegt, mit drei ersten Schritten und einer Frage an das Team. Das dauert etwa zwei Minuten, und nichts, was Sie eingeben, wird gespeichert oder gesendet."),
      blocks: [
        { type: "box", title: x("From a red number to a change", "Nga numri i kuq te ndryshimi", "Von der roten Zahl zur Änderung"), items: [
            x("Red KPI", "KPI e kuqe", "Roter KPI"),
            x("segment", "segmento", "segmentieren"),
            x("find the concentration", "gjej përqendrimin", "die Häufung finden"),
            x("go to the process", "shko në proces", "zum Prozess gehen"),
            x("ask why", "pyet pse", "warum fragen"),
            x("try a change", "provo një ndryshim", "eine Änderung testen"),
            x("measure again", "mat përsëri", "neu messen"),
        ] },
        { type: "quote", text: x("A KPI does not give you the answer. It shows you where to start asking questions.", "Një KPI nuk të jep përgjigjen. Të tregon ku duhet të fillosh të bësh pyetje.", "Ein KPI gibt Ihnen nicht die Antwort. Er zeigt Ihnen, wo Sie anfangen sollten, Fragen zu stellen.") },
      ],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
