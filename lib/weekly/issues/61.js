// Management Review, No. 61: Algorithmic management of work. Block: AI.
// Facts and their sources: docs/revista/management-review-nr-61.md. The AI Act and its duties for employers are in
// No. 41; AI at work in Nos. 10, 39 and 51. This issue keeps to algorithmic management and the platform work directive.
import { x, pc } from "../common.js";

export default {
  number: 61,
  block: "ai",
  date: x("November 2026", "Nëntor 2026", "November 2026"),
  theme: [x("Algorithmic management", "Menaxhimi algoritmik", "Algorithmisches Management"), x("of work", "i punës", "der Arbeit")],
  sub: x(
    "The EU's first rules on algorithmic management and their deadline, how many workers software already directs, instruct, monitor and evaluate, what managers worry about, four counts, and a card for one automated decision.",
    "Rregullat e para të BE-së për menaxhimin algoritmik dhe afati i tyre, sa punonjës i drejton tashmë softueri, udhëzo, mbikëqyr dhe vlerëso, çfarë i shqetëson menaxherët, katër numërime, dhe një kartë për një vendim të automatizuar.",
    "Die ersten EU-Regeln für algorithmisches Management und ihre Frist, wie viele Beschäftigte Software schon steuert, anweisen, überwachen und bewerten, was Führungskräfte besorgt, vier Zahlen und eine Karte für eine automatisierte Entscheidung."),
  seo: x(
    "Algorithmic management: the EU platform work directive due 2 December 2026, a quarter of workers directed by software, managers' concerns and a card.",
    "Menaxhimi algoritmik: direktiva e BE-së për punën në platforma me afat 2 dhjetor 2026, një e katërta e punonjësve nën softuer, shqetësimet dhe një kartë.",
    "Algorithmisches Management: die EU-Plattformrichtlinie mit Frist 2. Dezember 2026, ein Viertel der Beschäftigten von Software gesteuert, Sorgen und eine Karte."),
  feature: x(
    "Issue 61 sets out the EU's first rules on algorithmic management, in the platform work directive that Member States must transpose by 2 December 2026, shows that software already allocates, instructs, rates or monitors about a quarter of all workers in the EU, sorts the tools into instructing, monitoring and evaluating, weighs what managers gain and what worries them, adds a Swedish study of logistics workers, proposes four counts for one system, and ends with a card for one automated decision.",
    "Numri 61 shtjellon rregullat e para të BE-së për menaxhimin algoritmik, te direktiva për punën në platforma që shtetet anëtare duhet ta transpozojnë deri më 2 dhjetor 2026, tregon se softueri tashmë cakton, udhëzon, vlerëson ose mbikëqyr rreth një të katërtën e të gjithë punonjësve në BE, i ndan mjetet në ato që udhëzojnë, mbikëqyrin dhe vlerësojnë, peshon çfarë fitojnë menaxherët dhe çfarë i shqetëson, shton një studim suedez me punonjës të logjistikës, propozon katër numërime për një sistem, dhe mbyllet me një kartë për një vendim të automatizuar.",
    "Ausgabe 61 stellt die ersten EU-Regeln für algorithmisches Management vor, in der Plattformrichtlinie, die die Mitgliedstaaten bis zum 2. Dezember 2026 umsetzen müssen, zeigt, dass Software schon etwa einem Viertel aller Beschäftigten in der EU Arbeit zuteilt, Anweisungen gibt, sie bewertet oder überwacht, ordnet die Werkzeuge in Anweisen, Überwachen und Bewerten, wägt ab, was Führungskräfte gewinnen und was sie besorgt, ergänzt eine schwedische Studie mit Beschäftigten der Logistik, schlägt vier Zahlen für ein System vor und endet mit einer Karte für eine automatisierte Entscheidung."),
  figure: { n: pc(27), by: "EU-OSHA, 2025", t: x(
    "of workers in the EU say the organisation they work for uses digital technologies to allocate tasks, working time or shifts to them automatically.",
    "e punonjësve në BE thonë se organizata ku punojnë përdor teknologji digjitale për t'u caktuar automatikisht detyra, orar pune ose turne.",
    "der Beschäftigten in der EU sagen, dass ihre Organisation digitale Technik nutzt, um ihnen Aufgaben, Arbeitszeit oder Schichten automatisch zuzuteilen.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("Rules for the algorithmic boss", "Rregulla për shefin algoritmik", "Regeln für den algorithmischen Chef") },
    { page: "numbers", kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: x("A quarter, not a niche", "Një e katërta, jo një kënd i vogël", "Ein Viertel, keine Nische") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The card for one automated decision", "Karta për një vendim të automatizuar", "Karte für eine automatisierte Entscheidung") },
  ],
  sources: ["algo-dir-2024", "algo-ep-2025", "algo-ec-qja-2026", "euosha-pulse-2025", "algo-jrc-2025", "algo-oecd-2025", "algo-oecd-brief-2025", "algo-hennum-nilsson-2025"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "A roster drawn up by software, a task pushed to a phone, a score that ranks the team: parts of a manager's work are now done by algorithms. This issue asks how far that has gone, what the EU's first law on it requires, and what a manager still has to own. It describes the law; it is not legal advice.",
        "Një orar i hartuar nga softueri, një detyrë që të vjen në telefon, një pikë që rendit ekipin: pjesë të punës së menaxherit tani i bëjnë algoritmet. Ky numër pyet sa larg ka shkuar kjo, çfarë kërkon ligji i parë i BE-së për të, dhe çfarë mbetet ende përgjegjësi e menaxherit. Përshkruan ligjin; nuk është këshillë ligjore.",
        "Ein Dienstplan aus der Software, eine Aufgabe aufs Handy, ein Punktwert, der das Team ordnet: Teile der Führungsarbeit erledigen heute Algorithmen. Diese Ausgabe fragt, wie weit das reicht, was das erste EU-Gesetz dazu verlangt und wofür eine Führungskraft selbst einstehen muss. Sie beschreibt das Gesetz; sie ist keine Rechtsberatung."),
      body: x(
        "Directive (EU) 2024/2831 sets the EU's first rules on algorithmic management, for digital labour platforms, and must be transposed by 2 December 2026. Yet only 5% of EU workers earned income through a platform in the year to spring 2025, while about one in four say software allocates their tasks or shifts, and nearly as many that it instructs, rates or monitors them. In an OECD survey of over 6,000 managers, 60% of users say the tools improve their decisions, and nearly two-thirds have at least one concern. A Swedish study links heavy algorithmic management in logistics with more distress and accidents.",
        "Direktiva (BE) 2024/2831 vendos rregullat e para të BE-së për menaxhimin algoritmik, për platformat digjitale të punës, dhe duhet transpozuar deri më 2 dhjetor 2026. Megjithatë, vetëm 5% e punonjësve në BE fituan të ardhura përmes një platforme në vitin deri në pranverën e 2025, ndërsa rreth një në katër punonjës thotë se softueri i cakton detyrat ose turnet, dhe pothuajse po aq thonë se i udhëzon, i vlerëson ose i mbikëqyr. Në një anketë të OECD me mbi 6.000 menaxherë, 60% e përdoruesve thonë se mjetet ua përmirësojnë vendimet, dhe gati dy të tretat kanë të paktën një shqetësim. Një studim suedez e lidh menaxhimin algoritmik të rëndë në logjistikë me më shumë shqetësim psikologjik dhe aksidente.",
        "Die Richtlinie (EU) 2024/2831 setzt die ersten EU-Regeln für algorithmisches Management auf digitalen Arbeitsplattformen; sie ist bis zum 2. Dezember 2026 umzusetzen. Doch nur 5 % der Beschäftigten in der EU verdienten im Jahr bis Frühjahr 2025 Geld über eine Plattform. Etwa jeder Vierte sagt, dass Software Aufgaben oder Schichten zuteilt, fast ebenso viele, dass sie anleitet, bewertet oder überwacht. In einer OECD-Befragung von über 6.000 Führungskräften sagen 60 % der Nutzer, die Werkzeuge verbesserten ihre Entscheidungen; fast zwei Drittel haben mindestens eine Sorge. Eine schwedische Studie verbindet starkes algorithmisches Management in der Logistik mit mehr Belastung und Unfällen."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("Rules for the", "Rregulla për", "Regeln für den"), x("algorithmic boss", "shefin algoritmik", "algorithmischen Chef")],
      lead: x(
        "Chapter III of Directive (EU) 2024/2831 on platform work, adopted in October 2024, holds the EU's first rules on algorithmic management; most also cover the self-employed. Member States must transpose it “by 2 December 2026”.",
        "Kapitulli III i Direktivës (BE) 2024/2831 për punën në platforma, e miratuar në tetor 2024, mban rregullat e para të BE-së për menaxhimin algoritmik; shumica mbulojnë edhe të vetëpunësuarit. Shtetet anëtare duhet ta transpozojnë “deri më 2 dhjetor 2026”.",
        "Kapitel III der Richtlinie (EU) 2024/2831 zur Plattformarbeit, angenommen im Oktober 2024, enthält die ersten EU-Regeln für algorithmisches Management; die meisten gelten auch für Selbstständige. Die Mitgliedstaaten müssen sie „bis zum 2. Dezember 2026“ umsetzen."),
      blocks: [
        { type: "cards", cols: 2, items: [
          { h: x("What it may not process", "Çfarë nuk lejohet të përpunojë", "Was sie nicht verarbeiten darf"), p: x("Emotional state, private conversations, data from outside working time (Art. 7).", "Gjendja emocionale, bisedat private, të dhëna jashtë kohës së punës (neni 7).", "Gefühlslage, private Gespräche, Daten außerhalb der Arbeitszeit (Art. 7).") },
          { h: x("Who is told what", "Kush informohet dhe për çfarë", "Wer was erfährt"), p: x("Which systems monitor or decide, on what data, by the first working day (Art. 9).", "Cilat sisteme mbikëqyrin ose vendosin, me çfarë të dhënash, deri në ditën e parë të punës (neni 9).", "Welche Systeme überwachen oder entscheiden, mit welchen Daten, bis zum ersten Arbeitstag (Art. 9).") },
          { h: x("A human oversees", "Një njeri mbikëqyr", "Ein Mensch beaufsichtigt"), p: x("An evaluation at least every two years; a human suspends or closes an account (Art. 10).", "Një vlerësim të paktën çdo dy vjet; një llogari e pezullon ose e mbyll një njeri (neni 10).", "Mindestens alle zwei Jahre eine Bewertung; ein Konto sperrt oder schließt ein Mensch (Art. 10).") },
          { h: x("A right to an answer", "E drejta për një përgjigje", "Ein Recht auf Antwort"), p: x("An explanation, and a reply to a request for review within two weeks (Art. 11).", "Një shpjegim, dhe përgjigje brenda dy javëve për një kërkesë rishikimi (neni 11).", "Eine Erklärung und binnen zwei Wochen eine Antwort auf einen Antrag auf Überprüfung (Art. 11).") },
        ] },
        { type: "p", text: x(
          "For other workplaces nothing is settled. In December 2025 the European Parliament asked for such rules in all of them; in July 2026 the Commission put algorithmic management into its consultation on a Quality Jobs Act.",
          "Për vendet e tjera të punës asgjë nuk është vendosur. Në dhjetor 2025, Parlamenti Evropian kërkoi rregulla të tilla për të gjitha; në korrik 2026, Komisioni e futi menaxhimin algoritmik në konsultimin për një Quality Jobs Act.",
          "Für andere Arbeitsplätze ist nichts entschieden. Im Dezember 2025 forderte das Europäische Parlament solche Regeln für alle; im Juli 2026 nahm die Kommission algorithmisches Management in ihre Konsultation zu einem Quality Jobs Act auf.") },
        { type: "callout", reading: true, text: x(
          "The directive is written for platforms, but its four questions fit any team where software hands out shifts or scores.",
          "Direktiva është shkruar për platformat, por katër pyetjet e saj i përshtaten çdo ekipi ku softueri shpërndan turne ose pikë.",
          "Die Richtlinie ist für Plattformen geschrieben, aber ihre vier Fragen passen zu jedem Team, in dem Software Schichten oder Punkte verteilt.") },
      ],
      note: x(
        "Articles 7, 9–11 and 29, shortened; national laws will word them their own way. The Parliament's request is not law. A description, not legal advice.",
        "Nenet 7, 9–11 dhe 29, shkurt; ligjet kombëtare do t'i formulojnë në mënyrën e tyre. Kërkesa e Parlamentit nuk është ligj. Përshkrim, jo këshillë ligjore.",
        "Artikel 7, 9–11 und 29, verkürzt; die nationalen Gesetze fassen sie auf eigene Weise. Die Forderung des Parlaments ist kein Gesetz. Eine Beschreibung, keine Rechtsberatung."),
      source: ["algo-dir-2024", "algo-ep-2025", "algo-ec-qja-2026"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("A quarter,", "Një e katërta,", "Ein Viertel,"), x("not a niche", "jo një kënd i vogël", "keine Nische")],
      lead: x(
        "In spring 2025, EU-OSHA's OSH Pulse asked 25,688 workers in the EU by telephone whether the organisation they work for uses digital technologies to manage parts of their work.",
        "Në pranverën e 2025, OSH Pulse i EU-OSHA pyeti me telefon 25.688 punonjës në BE nëse organizata ku punojnë përdor teknologji digjitale për të drejtuar pjesë të punës së tyre.",
        "Im Frühjahr 2025 fragte der OSH Pulse von EU-OSHA 25.688 Beschäftigte in der EU telefonisch, ob ihre Organisation digitale Technik nutzt, um Teile ihrer Arbeit zu steuern."),
      blocks: [
        { type: "hbars", source: ["euosha-pulse-2025"],
          label: x("Workers in the EU, 2025", "Punonjësit në BE, 2025", "Beschäftigte in der EU, 2025"),
          items: [
            { k: x("Software allocates tasks, working time or shifts", "Softueri cakton detyra, orar ose turne", "Software teilt Aufgaben, Arbeitszeit oder Schichten zu"), v: 27, n: pc(27), alert: true },
            { k: x("Others rate their performance through it", "Të tjerët ua vlerësojnë punën përmes tij", "Andere bewerten darüber ihre Leistung"), v: 26, n: pc(26) },
            { k: x("It gives automated instructions", "Jep udhëzime të automatizuara", "Sie gibt automatische Anweisungen"), v: 26, n: pc(26) },
            { k: x("It monitors their work and behaviour", "Mbikëqyr punën dhe sjelljen e tyre", "Sie überwacht Arbeit und Verhalten"), v: 25, n: pc(25) },
            { k: x("Earned income through a platform", "Fituan të ardhura përmes një platforme", "Verdienten Geld über eine Plattform"), v: 5, n: pc(5) },
          ] },
        { type: "p", text: x(
          "The JRC's AIM-WORK survey of 70,316 workers in late 2024 and early 2025 asked more narrowly about systems acting with little or no human input: 24% had their rosters or shift hours allocated automatically, 21% their tasks.",
          "Anketa AIM-WORK e JRC, me 70.316 punonjës në fund të 2024 dhe në fillim të 2025, pyeti më ngushtë për sisteme që veprojnë me pak ose aspak ndërhyrje njerëzore: 24% i merrnin orarin ose turnet të caktuara automatikisht, 21% detyrat.",
          "Die AIM-WORK-Erhebung des JRC mit 70.316 Beschäftigten Ende 2024 und Anfang 2025 fragte enger nach Systemen, die mit wenig oder ohne menschliches Zutun arbeiten: 24 % bekamen Dienstpläne oder Schichten automatisch zugeteilt, 21 % ihre Aufgaben.") },
        { type: "callout", reading: true, text: x(
          "The directive reaches the 5%. The practices it regulates reach about a quarter of all workers.",
          "Direktiva arrin te 5%. Praktikat që ajo rregullon arrijnë te rreth një e katërta e të gjithë punonjësve.",
          "Die Richtlinie erreicht die 5 %. Die Praktiken, die sie regelt, erreichen etwa ein Viertel aller Beschäftigten.") },
      ],
      note: x(
        "Self-reports, EU-27. OSH Pulse asks what workers know of their organisation; 2–3% did not know. Platform income, over the past 12 months, is a separate question. The two surveys ask differently, so their figures differ.",
        "Vetëdeklarime, BE-27. OSH Pulse pyet çfarë dinë punonjësit për organizatën e tyre; 2–3% nuk e dinin. Të ardhurat nga platformat, në 12 muajt e fundit, janë pyetje më vete. Dy anketat pyesin ndryshe, ndaj shifrat ndryshojnë.",
        "Selbstauskünfte, EU-27. OSH Pulse fragt, was Beschäftigte über ihre Organisation wissen; 2–3 % wussten es nicht. Plattformeinkommen in den letzten 12 Monaten ist eine eigene Frage. Die beiden Erhebungen fragen verschieden, daher die abweichenden Werte."),
      source: ["euosha-pulse-2025", "algo-jrc-2025"],
    },
    {
      id: "model",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Instruct, monitor,", "Udhëzo, mbikëqyr,", "Anweisen, überwachen,"), x("evaluate", "vlerëso", "bewerten")],
      lead: x(
        "The OECD defines algorithmic management as software, with or without AI, that fully or partly automates tasks done by human managers. Its employer survey sorts fifteen uses into three groups and asked over 6,000 mid-level managers in six countries which ones their firm provides.",
        "OECD e përkufizon menaxhimin algoritmik si softuer, me ose pa AI, që automatizon plotësisht ose pjesërisht detyra që i bëjnë menaxherët. Anketa e saj me punëdhënësit i ndan pesëmbëdhjetë përdorime në tri grupe dhe pyeti mbi 6.000 menaxherë të nivelit të mesëm në gjashtë vende cilat prej tyre i ka firma e tyre.",
        "Die OECD definiert algorithmisches Management als Software, mit oder ohne KI, die Aufgaben von Führungskräften ganz oder teilweise automatisiert. Ihre Befragung ordnet fünfzehn Anwendungen in drei Gruppen und fragte über 6.000 Führungskräfte mittlerer Ebene in sechs Ländern, welche ihr Unternehmen nutzt."),
      blocks: [
        { type: "cards", cols: 3, items: [
          { h: x("Instruct", "Udhëzo", "Anweisen"), p: x("schedules, activities, clients, task instructions", "oraret, aktivitetet, klientët, udhëzimet për detyrat", "Dienstpläne, Tätigkeiten, Kunden, Arbeitsanweisungen") },
          { h: x("Monitor", "Mbikëqyr", "Überwachen"), p: x("work time, speed, location, tone of calls or emails, fatigue", "koha e punës, shpejtësia, vendndodhja, toni i thirrjeve ose email-eve, lodhja", "Arbeitszeit, Tempo, Standort, Ton von Anrufen oder E-Mails, Ermüdung") },
          { h: x("Evaluate", "Vlerëso", "Bewerten"), p: x("targets, rewards, sanctions, leaderboards", "objektivat, shpërblimet, sanksionet, renditjet", "Ziele, Belohnungen, Sanktionen, Ranglisten") },
        ] },
        { type: "columns", max: 100, height: 120, source: ["algo-oecd-brief-2025"],
          label: x("Firms using each group, average of France, Germany, Italy and Spain", "Firmat që përdorin secilin grup, mesatarja e Francës, Gjermanisë, Italisë dhe Spanjës", "Unternehmen mit der jeweiligen Gruppe, Mittel aus Frankreich, Deutschland, Italien und Spanien"),
          items: [
            { k: x("Instruct", "Udhëzo", "Anweisen"), v: 69, n: pc(69) },
            { k: x("Monitor", "Mbikëqyr", "Überwachen"), v: 67, n: pc(67) },
            { k: x("Evaluate", "Vlerëso", "Bewerten"), v: 35, n: pc(35), alert: true },
          ] },
        { type: "p", text: x(
          "In the United States, adoption averages 90% across all three groups; in Japan, 40% of firms use any tool. Tools that sanction poor work are rarer everywhere than those that reward good work: 14% against 23%.",
          "Në SHBA, përdorimi është mesatarisht 90% në të tria grupet; në Japoni, 40% e firmave përdorin ndonjë mjet. Mjetet që sanksionojnë punën e dobët janë kudo më të rralla se ato që shpërblejnë punën e mirë: 14% kundrejt 23%.",
          "In den USA liegt die Nutzung über alle drei Gruppen im Schnitt bei 90 %; in Japan nutzen 40 % der Unternehmen überhaupt ein Werkzeug. Werkzeuge, die schlechte Arbeit sanktionieren, sind überall seltener als solche, die gute belohnen: 14 % gegenüber 23 %.") },
        { type: "callout", reading: true, text: x(
          "The further a tool reaches into personal data or into consequences, the rarer it is, and the more a manager's judgement counts.",
          "Sa më thellë hyn një mjet në të dhënat personale ose në pasoja, aq më i rrallë është, dhe aq më shumë vlen gjykimi i menaxherit.",
          "Je tiefer ein Werkzeug in persönliche Daten oder Folgen reicht, desto seltener ist es und desto mehr zählt das Urteil der Führungskraft.") },
      ],
      note: x(
        "Managers answering for their firms. The OECD calls its definition broad: in the four European countries 79% use at least one tool. Not every tool uses AI, so the AI Act (No. 41) covers only some.",
        "Menaxherë që përgjigjen për firmat e tyre. OECD e quan përkufizimin e saj të gjerë: në katër vendet evropiane 79% përdorin të paktën një mjet. Jo çdo mjet përdor AI, ndaj AI Act (Nr. 41) mbulon vetëm një pjesë.",
        "Führungskräfte antworten für ihr Unternehmen. Die OECD nennt ihre Definition breit: In den vier europäischen Ländern nutzen 79 % mindestens ein Werkzeug. Nicht jedes Werkzeug nutzt KI, daher erfasst der AI Act (Nr. 41) nur einen Teil."),
      source: ["algo-oecd-2025", "algo-oecd-brief-2025"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("Better decisions,", "Vendime më të mira,", "Bessere Entscheidungen,"), x("unclear accountability", "përgjegjësi e paqartë", "unklare Verantwortung")],
      lead: x(
        "In the OECD survey, 60% of managers using the tools said their decisions had improved, through more information, speed and autonomy. Yet nearly two-thirds had at least one concern.",
        "Në anketën e OECD, 60% e menaxherëve që i përdorin mjetet thanë se vendimet u ishin përmirësuar, falë më shumë informacioni, shpejtësie dhe autonomie. Megjithatë, gati dy të tretat kishin të paktën një shqetësim.",
        "In der OECD-Befragung sagten 60 % der Führungskräfte mit den Werkzeugen, sie entschieden nun besser, dank mehr Information, Tempo und Spielraum. Doch fast zwei Drittel hatten mindestens eine Sorge."),
      blocks: [
        { type: "hbars", source: ["algo-oecd-brief-2025"],
          label: x("Managers using the tools who report the concern, six countries", "Menaxherët që i përdorin mjetet dhe e raportojnë shqetësimin, gjashtë vende", "Nutzer unter den Führungskräften mit dieser Sorge, sechs Länder"),
          items: [
            { k: x("Unclear accountability for a wrong decision", "Përgjegjësi e paqartë për një vendim të gabuar", "Unklare Verantwortung bei Fehlentscheidung"), v: 28, n: pc(28), alert: true },
            { k: x("Cannot follow the logic of a decision", "Nuk ndiqet dot logjika e vendimit", "Logik der Entscheidung nicht nachvollziehbar"), v: 27, n: pc(27) },
            { k: x("Workers' health poorly protected", "Shëndeti i punonjësve i mbrojtur keq", "Gesundheit des Personals schlecht geschützt"), v: 27, n: pc(27) },
          ] },
        { type: "p", text: x(
          "For workers the evidence is thin. In a 2024 survey of nearly 1,000 drivers and warehouse workers in Sweden, the most exposed reported psychological distress about twice as often as the least exposed (ratio 2.12), accidents 1.9 times as often. The JRC finds clearly worse conditions for the 2% of EU workers subject to every form at once.",
          "Për punonjësit provat janë të pakta. Në një anketë të 2024 me gati 1.000 shoferë dhe punonjës magazine në Suedi, më të ekspozuarit raportuan shqetësim psikologjik rreth dy herë më shpesh se më pak të ekspozuarit (raporti 2,12), aksidente 1,9 herë më shpesh. JRC gjen kushte qartë më të këqija për 2% e punonjësve në BE që u nënshtrohen njëherësh të gjitha formave.",
          "Für Beschäftigte ist die Beweislage dünn. In einer Befragung von 2024 mit fast 1.000 Fahrern und Lagerkräften in Schweden nannten die am stärksten Betroffenen etwa doppelt so oft psychische Belastung wie die am wenigsten Betroffenen (Verhältnis 2,12), Unfälle 1,9-mal so oft. Das JRC findet klar schlechtere Bedingungen für die 2 % in der EU, die allen Formen zugleich unterliegen.") },
        { type: "callout", reading: true, text: x(
          "The most common worry is not the software but the gap behind it: when a decision is wrong, nobody is sure who owns it.",
          "Shqetësimi më i shpeshtë nuk është softueri, por boshllëku pas tij: kur një vendim është i gabuar, askush nuk e di me siguri kujt i përket.",
          "Die häufigste Sorge ist nicht die Software, sondern die Lücke dahinter: Ist eine Entscheidung falsch, weiß keiner, wem sie gehört.") },
      ],
      note: x(
        "Self-reports. The Swedish study is a one-time survey, recruited partly online: it shows a link, not a cause. Across all EU workers the JRC's links are mild and not causal either.",
        "Vetëdeklarime. Studimi suedez është anketë në një moment të vetëm, me pjesëmarrës të rekrutuar pjesërisht në internet: tregon lidhje, jo shkak. Për gjithë punonjësit e BE-së, lidhjet e JRC janë të dobëta dhe as ato nuk janë shkakësore.",
        "Selbstauskünfte. Die schwedische Studie ist eine einmalige Befragung, teils online rekrutiert: Sie zeigt einen Zusammenhang, keine Ursache. Über alle EU-Beschäftigten sind die Zusammenhänge des JRC schwach, auch nicht kausal."),
      source: ["algo-oecd-brief-2025", "algo-hennum-nilsson-2025", "algo-jrc-2025"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie man es misst"),
      title: [x("Four counts", "Katër numërime", "Vier Zahlen"), x("for one system", "për një sistem", "für ein System")],
      lead: x(
        "The directive's yardsticks can serve any team as measures, platform or not. The survey question is a test too: ask the team what the system does, and compare their answers with what it really does.",
        "Matësit e direktivës mund t'i shërbejnë çdo ekipi, platformë apo jo. Edhe pyetja e anketës është një provë: pyet ekipin çfarë bën sistemi, dhe krahasoji përgjigjet me atë që bën vërtet.",
        "Die Maßstäbe der Richtlinie taugen für jedes Team als Kennzahlen, ob Plattform oder nicht. Auch die Frage der Erhebung ist ein Test: das Team fragen, was das System tut, und die Antworten mit dem vergleichen, was es wirklich tut."),
      blocks: [
        { type: "steps", items: [
          { h: x("Informed", "I informuar", "Informiert"), p: x("Share of the team who can say what the system decides and on what data. A “don't know” is a finding.", "Pjesa e ekipit që di të thotë çfarë vendos sistemi dhe mbi cilat të dhëna. Një “nuk e di” është gjetje.", "Anteil des Teams, der sagen kann, was das System entscheidet und mit welchen Daten. Ein „weiß nicht“ ist ein Befund.") },
          { h: x("Explained", "I shpjeguar", "Erklärt"), p: x("Requests for an explanation or review answered within two weeks, the directive's limit for a review.", "Kërkesat për shpjegim ose rishikim që marrin përgjigje brenda dy javëve, afati i direktivës për një rishikim.", "Anfragen nach Erklärung oder Überprüfung, die binnen zwei Wochen beantwortet werden, die Frist der Richtlinie für eine Überprüfung.") },
          { h: x("Decided by a person", "Vendosur nga një njeri", "Von einem Menschen entschieden"), p: x("Sanctions, suspensions or pay changes a human checked before they applied.", "Sanksionet, pezullimet ose ndryshimet e pagës që i kontrolloi një njeri para se të zbatoheshin.", "Sanktionen, Sperrungen oder Lohnänderungen, die ein Mensch vor dem Wirksamwerden geprüft hat.") },
          { h: x("Evaluated", "I vlerësuar", "Bewertet"), p: x("Date of the last review of the system's effect on the team, at least every two years.", "Data e rishikimit të fundit të ndikimit të sistemit te ekipi, të paktën çdo dy vjet.", "Datum der letzten Prüfung, wie das System auf das Team wirkt, mindestens alle zwei Jahre.") },
        ] },
        { type: "example", label: x("Hypothetical example, a shift-planning system in a team of 30", "Shembull hipotetik, një sistem planifikimi turnesh në një ekip me 30 vetë", "Hypothetisches Beispiel, ein Schichtplanungssystem in einem Team von 30"), rows: [
          { k: x("Informed", "I informuar", "Informiert"), v: x("12 of 30 could say what it decides", "12 nga 30 dinin të thoshin çfarë vendos", "12 von 30 konnten sagen, was es entscheidet") },
          { k: x("Explained", "I shpjeguar", "Erklärt"), v: x("5 requests, 3 answered within two weeks", "5 kërkesa, 3 morën përgjigje brenda dy javëve", "5 Anfragen, 3 binnen zwei Wochen beantwortet") },
          { k: x("Evaluated", "I vlerësuar", "Bewertet"), v: x("never in three years", "asnjëherë në tre vjet", "nie in drei Jahren") },
        ], text: x("The system may work well; the team cannot know. The numbers are invented.", "Sistemi mund të punojë mirë; ekipi s'ka si ta dijë. Numrat janë të shpikur.", "Das System mag gut arbeiten; das Team kann es nicht wissen. Die Zahlen sind erfunden.") },
      ],
      note: x(
        "The counts are the editors' reading of Articles 9–11 of the directive and of the OSH Pulse question. Its limits bind platforms; for other employers they are a benchmark.",
        "Numërimet janë leximi i redaksisë për nenet 9–11 të direktivës dhe për pyetjen e OSH Pulse. Afatet e saj i detyrojnë platformat; për punëdhënësit e tjerë janë pikë krahasimi.",
        "Die Zahlen sind die Lesart der Redaktion von Artikel 9–11 der Richtlinie und der Frage des OSH Pulse. Ihre Fristen binden Plattformen; für andere Arbeitgeber sind sie ein Maßstab."),
      source: ["algo-dir-2024", "euosha-pulse-2025"],
    },
    {
      id: "tool", tool: "/tools/five-whys/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("One automated", "Karta për një vendim", "Karte für eine"), x("decision card", "të automatizuar", "automatisierte Entscheidung")],
      lead: x(
        "One card for each decision that software takes or prepares. Fill it in with the people it affects; where a line stays empty, the gap is the finding.",
        "Një kartë për çdo vendim që softueri e merr ose e përgatit. Plotësoje me njerëzit që i prek; aty ku një rresht mbetet bosh, boshllëku është gjetja.",
        "Eine Karte für jede Entscheidung, die Software trifft oder vorbereitet. Mit den Betroffenen ausfüllen; wo eine Zeile leer bleibt, ist die Lücke der Befund."),
      blocks: [
        { type: "form", items: [
          { h: x("The decision", "Vendimi", "Die Entscheidung"), hint: x("what it decides or proposes: shifts, tasks, targets, a rating, a sanction", "çfarë vendos ose propozon: turne, detyra, objektiva, një vlerësim, një sanksion", "was sie entscheidet oder vorschlägt: Schichten, Aufgaben, Ziele, eine Bewertung, eine Sanktion") },
          { h: x("Data", "Të dhënat", "Daten"), hint: x("what it uses, and what it must not: feelings, private talk, time off work", "çfarë përdor, dhe çfarë nuk duhet: ndjenjat, bisedat private, koha jashtë punës", "was sie nutzt und was nicht: Gefühle, private Gespräche, Zeit außerhalb der Arbeit") },
          { h: x("Who can review it", "Kush mund ta rishikojë", "Wer sie überprüfen kann"), hint: x("the role that can check and override it, and how fast", "roli që mund ta kontrollojë dhe ta ndryshojë, dhe sa shpejt", "die Rolle, die sie prüfen und aufheben kann, und wie schnell") },
          { h: x("How the team learns of it", "Si e mëson ekipi", "Wie das Team davon erfährt"), hint: x("when they were told, in what words, where it is written", "kur u tha, me cilat fjalë, ku është shkruar", "wann es erfuhr, mit welchen Worten, wo es steht") },
          { h: x("Explanation and challenge", "Shpjegimi dhe ankimi", "Erklärung und Einspruch"), hint: x("who answers, and within how many days", "kush përgjigjet, dhe brenda sa ditësh", "wer antwortet und binnen wie vieler Tage") },
          { h: x("Last evaluation", "Vlerësimi i fundit", "Letzte Bewertung"), hint: x("date, who took part, what changed", "data, kush mori pjesë, çfarë ndryshoi", "Datum, wer beteiligt war, was sich änderte") },
        ] },
      ],
      note: x(
        "A practice proposed by the editors, after Articles 7–11 of the directive and the concerns in the OECD survey. When a decision proves wrong, the 5 Whys sheet helps trace why and name one owner.",
        "Praktikë e propozuar nga redaksia, sipas neneve 7–11 të direktivës dhe shqetësimeve në anketën e OECD. Kur një vendim del i gabuar, fleta 5 Whys ndihmon të gjesh pse dhe të caktosh një përgjegjës.",
        "Eine Praxis, die die Redaktion vorschlägt, nach Artikel 7–11 der Richtlinie und den Sorgen aus der OECD-Befragung. Erweist sich eine Entscheidung als falsch, hilft das 5-Why-Blatt, die Ursache zu finden und eine verantwortliche Person zu benennen."),
      source: ["algo-dir-2024", "algo-oecd-brief-2025"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
