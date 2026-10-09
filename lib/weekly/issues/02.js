// Management Review, No. 2: KPIs that warn you in time (leading and lagging indicators). Block: KPIs.
// Facts and their sources: docs/revista/management-review-nr-02.md.
import { x, pc } from "../common.js";

export default {
  number: 2,
  block: "kpi",
  date: x("October 2026", "Tetor 2026", "Oktober 2026"),
  theme: [x("KPIs that", "KPI që", "Kennzahlen, die"), x("warn you in time", "paralajmërojnë në kohë", "rechtzeitig warnen")],
  sub: x(
    "Why a result tells you what has already happened, which measures show what is coming, and how to pair the two.",
    "Pse rezultati të tregon atë që ka ndodhur tashmë, cilat masa tregojnë çfarë po vjen, dhe si i çiftëzon të dyja.",
    "Warum ein Ergebnis zeigt, was schon passiert ist, welche Kennzahlen zeigen, was kommt, und wie man beide verbindet."),
  seo: x(
    "Leading and lagging indicators: what OSHA, Kaplan and Norton and two surveys of managers say, and a card to build one leading indicator.",
    "Tregues paraprijës dhe vonues: çfarë thonë OSHA, Kaplan e Norton dhe dy anketa me menaxherë, dhe një kartë për një tregues paraprijës.",
    "Früh- und Spätindikatoren: was OSHA, Kaplan und Norton und zwei Umfragen unter Führungskräften sagen, und eine Karte für einen Frühindikator."),
  feature: x(
    "Issue 2 is about the KPIs that arrive too late: the difference between leading and lagging indicators, what the research says about KPIs today, and a card to build one indicator that warns in time.",
    "Numri 2 flet për KPI-të që vijnë vonë: dallimi mes treguesve paraprijës dhe vonues, çfarë thonë kërkimet për KPI-të sot, dhe një kartë për të ndërtuar një tregues që paralajmëron në kohë.",
    "Ausgabe 2 handelt von Kennzahlen, die zu spät kommen: der Unterschied zwischen Früh- und Spätindikatoren, was die Forschung heute über Kennzahlen sagt, und eine Karte für einen Indikator, der rechtzeitig warnt."),
  figure: { n: pc(60), by: "MIT SMR & BCG, 2024", t: x(
    "of managers say their KPIs need to improve.",
    "e menaxherëve thonë se KPI-të e tyre duhet të përmirësohen.",
    "der Führungskräfte sagen, dass ihre Kennzahlen besser werden müssen.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("Why most KPIs arrive too late", "Pse shumica e KPI-ve vijnë vonë", "Warum die meisten Kennzahlen zu spät kommen") },
    { page: "model", kicker: x("The model", "Modeli", "Das Modell"),
      title: x("From the result back to the cause", "Nga rezultati prapa te shkaku", "Vom Ergebnis zurück zur Ursache") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The card for one leading indicator", "Karta e një treguesi paraprijës", "Die Karte für einen Frühindikator") },
  ],
  sources: ["osha-2019", "kaplan-norton-1992", "kaplan-norton-1996", "mitsmr-bcg-2024", "mitsmr-google-2018", "goodhart-1975", "strathern-1997"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "A KPI that turns red has already done its damage. This issue asks a practical question: which measures show a problem while there is still time to act?",
        "Një KPI që bëhet e kuqe e ka bërë tashmë dëmin. Ky numër bën një pyetje praktike: cilat masa e tregojnë problemin kur ka ende kohë për të vepruar?",
        "Eine Kennzahl, die rot wird, hat den Schaden schon angerichtet. Diese Ausgabe stellt eine praktische Frage: Welche Kennzahlen zeigen ein Problem, solange noch Zeit zum Handeln ist?"),
      body: x(
        "Kaplan and Norton built the Balanced Scorecard on the idea that results and the drivers of results have to be measured together. OSHA asks the same of safety: count the injuries, but first measure what prevents them. Surveys of managers show the gap that remains: most say their KPIs need to improve, and only about a quarter of senior managers strongly agree that their KPIs are tied to strategy.",
        "Kaplan dhe Norton e ndërtuan Balanced Scorecard mbi idenë se rezultatet dhe ajo që i shtyn duhen matur bashkë. OSHA kërkon të njëjtën gjë për sigurinë: numëro lëndimet, por mat më parë atë që i parandalon. Anketat me menaxherët tregojnë boshllëkun që mbetet: shumica thonë se KPI-të e tyre duhet të përmirësohen, dhe vetëm rreth një e katërta e drejtuesve të lartë janë plotësisht dakord që KPI-të lidhen me strategjinë.",
        "Kaplan und Norton haben die Balanced Scorecard auf der Idee aufgebaut, dass Ergebnisse und ihre Treiber gemeinsam gemessen werden müssen. OSHA verlangt dasselbe für die Sicherheit: Unfälle zählen, aber zuerst messen, was sie verhindert. Umfragen unter Führungskräften zeigen die Lücke, die bleibt: Die meisten sagen, ihre Kennzahlen müssen besser werden, und nur etwa ein Viertel der oberen Führungskräfte stimmt voll zu, dass sie mit der Strategie verbunden sind."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("The result", "Rezultati", "Das Ergebnis"), x("always arrives late", "vjen gjithmonë vonë", "kommt immer zu spät")],
      lead: x(
        "A lagging indicator counts what has already happened. A leading indicator measures what makes it happen. You need both, but only one of them gives you time.",
        "Treguesi vonues numëron atë që ka ndodhur. Treguesi paraprijës mat atë që e shkakton. Të duhen të dy, por vetëm njëri të jep kohë.",
        "Ein Spätindikator zählt, was schon passiert ist. Ein Frühindikator misst, was es auslöst. Man braucht beide, aber nur einer verschafft Zeit."),
      blocks: [
        { type: "lists", cols: [
          { h: x("Leading", "Paraprijës", "Frühindikator"), items: [
            x("Proactive, preventive, predictive", "Proaktiv, parandalues, parashikues", "Proaktiv, vorbeugend, vorausschauend"),
            x("Shows whether the work that prevents problems is being done", "Tregon nëse po bëhet puna që i parandalon problemet", "Zeigt, ob die Arbeit getan wird, die Probleme verhindert"),
            x("Example: share of workers at the refresher training", "Shembull: pjesa e punëtorëve në trajnimin rifreskues", "Beispiel: Anteil der Beschäftigten in der Auffrischungsschulung"),
          ] },
          { h: x("Lagging", "Vonues", "Spätindikator"), accent: true, items: [
            x("Counts events that have already happened", "Numëron ngjarje që kanë ndodhur", "Zählt Ereignisse, die schon geschehen sind"),
            x("Shows whether the effort worked", "Tregon nëse përpjekja dha rezultat", "Zeigt, ob die Anstrengung gewirkt hat"),
            x("Example: the rate of injuries and illnesses", "Shembull: shkalla e lëndimeve dhe sëmundjeve", "Beispiel: die Rate von Unfällen und Erkrankungen"),
          ] },
        ] },
        { type: "p", text: x(
          "This is how OSHA, the US workplace safety agency, describes them in its 2019 guide, and it advises using both. Kaplan and Norton made the same argument for the whole business in 1992: financial measures show the results of actions already taken, so the Balanced Scorecard adds measures of customers, internal processes, and innovation and improvement, which drive the results to come.",
          "Kështu i përshkruan OSHA, agjencia amerikane e sigurisë në punë, në udhëzuesin e vitit 2019, dhe këshillon t'i përdorësh të dy. Kaplan dhe Norton e thanë të njëjtën gjë për gjithë biznesin në 1992: masat financiare tregojnë rezultatin e veprimeve që janë bërë tashmë, prandaj Balanced Scorecard shton masa për klientët, për proceset e brendshme dhe për inovacionin e përmirësimin, që shtyjnë rezultatin e ardhshëm.",
          "So beschreibt sie OSHA, die US-Behörde für Arbeitssicherheit, in ihrem Leitfaden von 2019, und rät, beide zu nutzen. Kaplan und Norton argumentierten 1992 für das ganze Unternehmen genauso: Finanzkennzahlen zeigen das Ergebnis bereits getaner Arbeit, deshalb ergänzt die Balanced Scorecard Kennzahlen zu Kunden, internen Prozessen sowie Innovation und Verbesserung, die das künftige Ergebnis treiben.") },
        { type: "timeline", items: [
          { k: "1975", t: x("Goodhart: a statistic tends to break down once it is used for control.", "Goodhart: një shifër priret të prishet sapo përdoret për kontroll.", "Goodhart: Eine Kennzahl bricht leicht zusammen, sobald man mit ihr steuert.") },
          { k: "1992", t: x("Kaplan and Norton: the Balanced Scorecard, with four perspectives.", "Kaplan dhe Norton: Balanced Scorecard, me katër perspektiva.", "Kaplan und Norton: die Balanced Scorecard mit vier Perspektiven.") },
          { k: "1996", t: x("Outcome measures, paired with the drivers that produce them.", "Masat e rezultatit, bashkë me ato që i prodhojnë.", "Ergebniskennzahlen, gepaart mit ihren Treibern.") },
          { k: "2019", t: x("OSHA's guide to leading indicators for safety.", "Udhëzuesi i OSHA për treguesit paraprijës në siguri.", "Der OSHA-Leitfaden zu Frühindikatoren für Sicherheit.") },
        ] },
        { type: "callout", reading: true, text: x(
          "A lagging KPI tells you whether you made it. A leading one tells you whether you will make it, while you can still change the answer.",
          "Një KPI vonues të tregon nëse ia dole. Një paraprijës të tregon nëse do t'ia dalësh, kur ende mund ta ndryshosh përgjigjen.",
          "Eine späte Kennzahl sagt, ob man es geschafft hat. Eine frühe sagt, ob man es schaffen wird, solange man die Antwort noch ändern kann.") },
      ],
      source: ["osha-2019", "kaplan-norton-1992", "kaplan-norton-1996", "goodhart-1975"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("KPIs", "KPI-të", "Kennzahlen"), x("that fall short", "që nuk mjaftojnë", "reichen nicht")],
      lead: x(
        "Two surveys of managers, six years apart, describe the same gap: the KPIs are there, the confidence in them is not.",
        "Dy anketa me menaxherë, me gjashtë vite diferencë, përshkruajnë të njëjtin boshllëk: KPI-të janë aty, besimi te to jo.",
        "Zwei Umfragen unter Führungskräften, sechs Jahre auseinander, beschreiben dieselbe Lücke: Die Kennzahlen sind da, das Vertrauen in sie nicht."),
      blocks: [
        { type: "hbars", max: 100, source: ["mitsmr-bcg-2024"],
          label: x("Managers and their KPIs, 2024", "Menaxherët dhe KPI-të e tyre, 2024", "Führungskräfte und ihre Kennzahlen, 2024"),
          items: [
            { k: x("Say their KPIs need to improve", "Thonë se KPI-të duhet të përmirësohen", "Sagen, dass ihre Kennzahlen besser werden müssen"), v: 60, n: pc(60), alert: true },
            { k: x("Use AI to create new KPIs", "Përdorin AI për të krijuar KPI të reja", "Nutzen KI, um neue Kennzahlen zu entwickeln"), v: 34, n: pc(34) },
          ] },
        { type: "donut", v: 26, n: pc(26), source: ["mitsmr-google-2018"], t: x(
          "of senior managers strongly agree that their KPIs are aligned with their organisation's strategic objectives (2018).",
          "e drejtuesve të lartë janë plotësisht dakord që KPI-të e tyre lidhen me objektivat strategjikë të organizatës (2018).",
          "der oberen Führungskräfte stimmen voll zu, dass ihre Kennzahlen mit den strategischen Zielen der Organisation verbunden sind (2018).") },
        { type: "figures", compact: true, items: [
          { n: x("3,000+", "3.000+", "3.000+"), t: x("people surveyed for the 2024 report, in 25+ industries and 100 countries", "të anketuar për raportin e 2024, në 25+ industri dhe 100 vende", "Befragte für den Bericht von 2024, in über 25 Branchen und 100 Ländern") },
          { n: pc(90), t: x("of those who use AI for KPIs say their KPIs improved", "e atyre që përdorin AI për KPI thonë se KPI-të u përmirësuan", "derer, die KI für Kennzahlen nutzen, sagen, dass sie besser wurden") },
          { n: x("3,200+", "3.200+", "3.200+"), t: x("people surveyed for the 2018 study", "të anketuar për studimin e 2018", "Befragte für die Studie von 2018") },
        ] },
        { type: "callout", reading: true, text: x(
          "If only a quarter of senior managers are fully convinced that their KPIs follow the strategy, the problem is not a shortage of numbers. It is that the numbers do not say early enough what matters.",
          "Nëse vetëm një e katërta e drejtuesve të lartë janë plotësisht të bindur se KPI-të ndjekin strategjinë, problemi nuk është mungesa e numrave. Është se numrat nuk e thonë mjaft herët atë që ka rëndësi.",
          "Wenn nur ein Viertel der oberen Führungskräfte voll überzeugt ist, dass die Kennzahlen der Strategie folgen, fehlt es nicht an Zahlen. Die Zahlen sagen nur nicht früh genug, worauf es ankommt.") },
      ],
      source: ["mitsmr-bcg-2024", "mitsmr-google-2018"],
    },
    {
      id: "model",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("From the result", "Nga rezultati", "Vom Ergebnis"), x("back to the cause", "prapa te shkaku", "zurück zur Ursache")],
      lead: x(
        "A leading indicator is not chosen from a list. It is found by walking back from the result you want to the work that produces it.",
        "Një tregues paraprijës nuk zgjidhet nga një listë. Gjendet duke ecur prapa, nga rezultati që do te puna që e prodhon.",
        "Einen Frühindikator wählt man nicht aus einer Liste. Man findet ihn, indem man vom gewünschten Ergebnis zurück zur Arbeit geht, die es erzeugt."),
      blocks: [
        { type: "chain", items: [
          { h: x("The result", "Rezultati", "Das Ergebnis"), p: x("Which lagging KPI do you want to improve?", "Cilin KPI vonues do të përmirësosh?", "Welche späte Kennzahl soll besser werden?") },
          { h: x("The cause", "Shkaku", "Die Ursache"), p: x("What drives it most often?", "Çfarë e shtyn më shpesh?", "Was treibt sie am häufigsten?") },
          { h: x("The signal", "Sinjali", "Das Signal"), p: x("How can you measure the cause before the result?", "Si e mat shkakun para rezultatit?", "Wie misst man die Ursache vor dem Ergebnis?") },
          { h: x("The threshold", "Pragu", "Die Schwelle"), p: x("At which value do you act?", "Në cilën vlerë vepron?", "Ab welchem Wert wird gehandelt?") },
          { h: x("The action", "Veprimi", "Die Maßnahme"), p: x("Who acts, and how fast?", "Kush vepron, dhe sa shpejt?", "Wer handelt, und wie schnell?") },
        ] },
        { type: "example", label: x("Hypothetical example, a warehouse", "Shembull hipotetik, një magazinë", "Hypothetisches Beispiel, ein Lager"), rows: [
          { k: x("The result", "Rezultati", "Das Ergebnis"), v: x("Incomplete orders reported by customers.", "Porosi jo të plota që i raportojnë klientët.", "Unvollständige Aufträge, die Kunden melden.") },
          { k: x("The cause", "Shkaku", "Die Ursache"), v: x("Items missing when the truck is loaded.", "Artikuj që mungojnë kur ngarkohet kamioni.", "Artikel, die beim Beladen fehlen.") },
          { k: x("The signal", "Sinjali", "Das Signal"), v: x("The share of orders fully scanned before loading, per shift.", "Pjesa e porosive të skanuara plotësisht para ngarkimit, për çdo turn.", "Der Anteil der Aufträge, die vor dem Beladen vollständig gescannt sind, je Schicht.") },
          { k: x("The threshold", "Pragu", "Die Schwelle"), v: x("Below 98% in a shift.", "Nën 98% në një turn.", "Unter 98 % in einer Schicht.") },
          { k: x("The action", "Veprimi", "Die Maßnahme"), v: x("The shift lead checks the open orders with the team before departure.", "Shefi i turnit kontrollon porositë e hapura me ekipin para nisjes.", "Die Schichtleitung prüft die offenen Aufträge vor der Abfahrt mit dem Team.") },
        ], text: x(
          "The numbers are invented to show the method.",
          "Numrat janë të shpikur, për të treguar metodën.",
          "Die Zahlen sind erfunden, um die Methode zu zeigen.") },
        { type: "callout", reading: true, text: x(
          "The best leading indicator is close to the work: the team sees it during the shift and can change it the same day.",
          "Treguesi paraprijës më i mirë është afër punës: ekipi e sheh gjatë turnit dhe mund ta ndryshojë po atë ditë.",
          "Der beste Frühindikator liegt nah an der Arbeit: Das Team sieht ihn während der Schicht und kann ihn am selben Tag ändern.") },
      ],
      note: x(
        "The chain is the editors' model, built on the logic of Kaplan and Norton (1996): outcome measures and the drivers that produce them.",
        "Zinxhiri është model i redaksisë, mbi logjikën e Kaplan dhe Norton (1996): masat e rezultatit dhe ato që e prodhojnë.",
        "Die Kette ist ein Modell der Redaktion, nach der Logik von Kaplan und Norton (1996): Ergebniskennzahlen und ihre Treiber."),
      source: ["kaplan-norton-1996"],
    },
    {
      id: "apply",
      kicker: x("How to start", "Si fillohet", "Wie man beginnt"),
      title: [x("Three ways", "Tri rrugë", "Drei Wege"), x("to a first indicator", "drejt treguesit të parë", "zum ersten Indikator")],
      lead: x(
        "OSHA's guide suggests three starting points. Its examples come from safety, but the logic works for any process.",
        "Udhëzuesi i OSHA sugjeron tri pika nisjeje. Shembujt e tij vijnë nga siguria, por logjika vlen për çdo proces.",
        "Der Leitfaden von OSHA schlägt drei Ausgangspunkte vor. Seine Beispiele stammen aus der Sicherheit, aber die Logik gilt für jeden Prozess."),
      blocks: [
        { type: "steps", items: [
          { h: x("From data you already collect", "Nga të dhënat që ke", "Aus Daten, die schon da sind"), p: x("For example, the share of workers who attend the refresher training.", "Për shembull, pjesa e punëtorëve që marrin pjesë në trajnimin rifreskues.", "Zum Beispiel der Anteil der Beschäftigten, die an der Auffrischungsschulung teilnehmen.") },
          { h: x("From a hazard you know", "Nga një rrezik i njohur", "Aus einer bekannten Gefahr"), p: x("For example, walkways inspected and cleared, truck brakes replaced on time, how long the lift team takes to arrive.", "Për shembull, kalimet e inspektuara dhe të pastruara, frenat e kamionëve të ndërruara në kohë, sa i duhet ekipit të ngritjes për të mbërritur.", "Zum Beispiel geprüfte und geräumte Gehwege, rechtzeitig ersetzte Lkw-Bremsen, wie lange das Hebeteam bis zum Einsatz braucht.") },
          { h: x("From one part of the programme", "Nga një pjesë e programit", "Aus einem Teil des Programms"), p: x("For example, preventive maintenance done on schedule, or hazards corrected within the day, week or month they were found.", "Për shembull, mirëmbajtja parandaluese e bërë sipas planit, ose rreziqet e ndrequra brenda ditës, javës ose muajit kur u gjetën.", "Zum Beispiel planmäßig erledigte vorbeugende Wartung oder Gefahren, die innerhalb von Tag, Woche oder Monat ihres Fundes behoben wurden.") },
        ] },
        { type: "quote", text: x(
          "When a measure becomes a target, it ceases to be a good measure.",
          "Kur një masë bëhet objektiv, ajo pushon së qeni një masë e mirë.",
          "Wenn eine Kennzahl zum Ziel wird, hört sie auf, eine gute Kennzahl zu sein.") },
        { type: "p", text: x(
          "Marilyn Strathern's 1997 wording of an idea the economist Charles Goodhart put forward in 1975.",
          "Formulimi i Marilyn Strathern në 1997, për një ide që ekonomisti Charles Goodhart e hodhi në 1975.",
          "Marilyn Stratherns Formulierung von 1997 für eine Idee, die der Ökonom Charles Goodhart 1975 vorbrachte.") },
        { type: "callout", reading: true, text: x(
          "A leading indicator is for learning, not for punishing. If it becomes a target at any price, people learn to fill the number instead of fixing the cause.",
          "Treguesi paraprijës është për të mësuar, jo për të ndëshkuar. Nëse bëhet objektiv me çdo kusht, njerëzit mësojnë ta mbushin numrin në vend që të ndreqin shkakun.",
          "Ein Frühindikator ist zum Lernen da, nicht zum Bestrafen. Wird er um jeden Preis zum Ziel, lernen Menschen, die Zahl zu füllen, statt die Ursache zu beheben.") },
      ],
      source: ["osha-2019", "strathern-1997", "goodhart-1975"],
    },
    {
      id: "measure", more: "kpis-the-team-trusts",
      kicker: x("How it is measured", "Si matet", "Wie man es misst"),
      title: [x("Five tests", "Pesë prova", "Fünf Prüfungen"), x("for a leading indicator", "për një tregues paraprijës", "für einen Frühindikator")],
      lead: x(
        "Before you put a new indicator on the board, check it against five questions. If it fails one, it will not warn you in time.",
        "Para se ta vendosësh një tregues të ri në tabelë, kontrolloje me pesë pyetje. Nëse rrëzohet në njërën, nuk do të të paralajmërojë në kohë.",
        "Bevor ein neuer Indikator an die Tafel kommt, prüfen Sie ihn mit fünf Fragen. Fällt er bei einer durch, warnt er nicht rechtzeitig."),
      blocks: [
        { type: "rows", items: [
          { h: x("It moves first", "Lëviz i pari", "Er bewegt sich zuerst"), p: x("When it worsens, does the result usually worsen later?", "Kur përkeqësohet, a përkeqësohet zakonisht më vonë edhe rezultati?", "Wenn er schlechter wird, wird das Ergebnis dann meist später schlechter?") },
          { h: x("The team can move it", "Ekipi mund ta lëvizë", "Das Team kann ihn bewegen"), p: x("Can the people who see it change it with their own work?", "A mund ta ndryshojnë me punën e tyre ata që e shohin?", "Können die Menschen, die ihn sehen, ihn mit ihrer Arbeit ändern?") },
          { h: x("It is fast", "Është i shpejtë", "Er ist schnell"), p: x("Is it ready in the same shift or day, not at the end of the month?", "A del brenda të njëjtit turn ose ditë, jo në fund të muajit?", "Liegt er in derselben Schicht oder am selben Tag vor, nicht am Monatsende?") },
          { h: x("It has a threshold and an owner", "Ka prag dhe pronar", "Er hat Schwelle und Verantwortliche"), p: x("Is it clear at which value someone acts, and who?", "A është e qartë në cilën vlerë vepron dikush, dhe kush?", "Ist klar, ab welchem Wert jemand handelt, und wer?") },
          { h: x("It is reviewed", "Rishikohet", "Er wird überprüft"), p: x("After three months, did it really move before the result?", "Pas tre muajsh, a lëvizi vërtet para rezultatit?", "Hat er sich nach drei Monaten wirklich vor dem Ergebnis bewegt?") },
        ] },
        { type: "callout", reading: true, text: x(
          "An indicator that does not pass the fifth test is a guess. Keep the ones that proved they warn, drop the ones that only add work.",
          "Treguesi që nuk e kalon provën e pestë është hamendje. Mbaj ata që provuan se paralajmërojnë, hiq ata që vetëm shtojnë punë.",
          "Ein Indikator, der die fünfte Prüfung nicht besteht, ist eine Vermutung. Behalten Sie die, die nachweislich warnen, und streichen Sie die, die nur Arbeit machen.") },
      ],
      note: x("The five tests are a practice proposed by the editors.", "Pesë provat janë praktikë e propozuar nga redaksia.", "Die fünf Prüfungen sind eine Praxis, die die Redaktion vorschlägt."),
    },
    {
      id: "tool", tool: "/tools/kpi-diagnostic/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The card for one", "Karta e një", "Die Karte für einen"), x("leading indicator", "treguesi paraprijës", "Frühindikator")],
      lead: x(
        "One lagging KPI, one leading indicator for it. Fill it in with the people who do the work, not for them.",
        "Një KPI vonues, një tregues paraprijës për të. Plotësoje me njerëzit që e bëjnë punën, jo për ta.",
        "Eine späte Kennzahl, ein Frühindikator dafür. Füllen Sie die Karte mit den Menschen aus, die die Arbeit machen, nicht für sie."),
      blocks: [
        { type: "form", items: [
          { h: x("The result", "Rezultati", "Das Ergebnis"), hint: x("the lagging KPI and its current value", "cili KPI vonues, dhe vlera e tij sot", "die späte Kennzahl und ihr heutiger Wert") },
          { h: x("The main cause", "Shkaku kryesor", "Die Hauptursache"), hint: x("what drives it most often", "çfarë e shtyn më shpesh", "was sie am häufigsten treibt"), lines: 2 },
          { h: x("The leading indicator", "Treguesi paraprijës", "Der Frühindikator"), hint: x("what exactly is counted, and how", "çfarë numërohet saktësisht, dhe si", "was genau gezählt wird, und wie"), lines: 2 },
          { h: x("When it is measured", "Kur matet", "Wann gemessen wird"), hint: x("every shift, every day, every week", "çdo turn, çdo ditë, çdo javë", "jede Schicht, jeden Tag, jede Woche") },
          { h: x("The threshold and the action", "Pragu dhe veprimi", "Schwelle und Maßnahme"), hint: x("at which value, who acts, how fast", "në cilën vlerë, kush vepron, sa shpejt", "ab welchem Wert, wer handelt, wie schnell") },
          { h: x("The review date", "Data e rishikimit", "Der Prüftermin"), hint: x("did it move before the result?", "a lëvizi para rezultatit?", "hat er sich vor dem Ergebnis bewegt?") },
        ] },
      ],
      note: x(
        "A practice proposed by the editors. Do not write names, customer data or confidential figures on the card.",
        "Praktikë e propozuar nga redaksia. Mos shkruaj emra, të dhëna klientësh ose shifra konfidenciale në kartë.",
        "Eine Praxis, die die Redaktion vorschlägt. Keine Namen, Kundendaten oder vertraulichen Zahlen auf die Karte schreiben."),
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
