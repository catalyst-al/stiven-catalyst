// Management Review, No. 25: Six Sigma and variation. Block: Operations.
// Facts and their sources: docs/revista/management-review-nr-25.md.
import { x, pc } from "../common.js";

export default {
  number: 25,
  block: "operations",
  date: x("October 2026", "Tetor 2026", "Oktober 2026"),
  theme: [x("Six Sigma", "Six Sigma", "Six Sigma"), x("and variation", "dhe variacioni", "und Variation")],
  sub: x(
    "Where Six Sigma came from, what 3.4 defects per million really means, Shewhart's two kinds of variation, whether Six Sigma pays, and a card for DMAIC.",
    "Nga erdhi Six Sigma, çfarë do të thotë vërtet 3,4 defekte për milion, dy llojet e variacionit të Shewhart, nëse Six Sigma ia vlen, dhe një kartë për DMAIC.",
    "Woher Six Sigma kommt, was 3,4 Fehler pro Million wirklich bedeuten, Shewharts zwei Arten von Variation, ob sich Six Sigma lohnt, und eine Karte für DMAIC."),
  seo: x(
    "Six Sigma and variation: Motorola's 3.4 defects per million and the 1.5 sigma shift, Shewhart and Deming on variation, what studies show, and a DMAIC card.",
    "Six Sigma dhe variacioni: 3,4 defekte për milion të Motorola-s dhe zhvendosja 1,5 sigma, Shewhart dhe Deming, çfarë tregojnë studimet, dhe karta DMAIC.",
    "Six Sigma und Variation: Motorolas 3,4 Fehler pro Million und die 1,5-Sigma-Verschiebung, Shewhart und Deming, was Studien zeigen, und eine DMAIC-Karte."),
  feature: x(
    "Issue 25 goes back to Motorola in 1986, explains what 3.4 defects per million opportunities assumes, shows how far three and six sigma lie apart, separates the two kinds of variation Walter Shewhart described in 1924, weighs two studies of firms that adopted Six Sigma, and ends with a card for DMAIC.",
    "Numri 25 kthehet te Motorola në 1986, shpjegon çfarë merr si të mirëqenë shifra 3,4 defekte për milion mundësi, tregon sa larg janë tre dhe gjashtë sigma, ndan dy llojet e variacionit që përshkroi Walter Shewhart në 1924, peshon dy studime për firmat që e adoptuan Six Sigma, dhe mbyllet me një kartë për DMAIC.",
    "Ausgabe 25 geht zurück zu Motorola im Jahr 1986, erklärt, was 3,4 Fehler pro Million Möglichkeiten voraussetzen, zeigt, wie weit drei und sechs Sigma auseinanderliegen, trennt die zwei Arten von Variation, die Walter Shewhart 1924 beschrieb, wägt zwei Studien zu Firmen ab, die Six Sigma einführten, und endet mit einer Karte für DMAIC."),
  figure: { n: x("3.4", "3,4", "3,4"), by: "Motorola, 1986", t: x(
    "defects per million opportunities is the Six Sigma level, a figure that already assumes the process drifts by 1.5 sigma.",
    "defekte për milion mundësi është niveli Six Sigma, shifër që e merr si të mirëqenë se procesi zhvendoset 1,5 sigma.",
    "Fehler pro Million Möglichkeiten sind das Six-Sigma-Niveau, eine Zahl, die schon eine Verschiebung des Prozesses um 1,5 Sigma annimmt.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("3.4 per million", "3,4 për milion", "3,4 pro Million") },
    { page: "model", kicker: x("The model", "Modeli", "Das Modell"),
      title: x("Two kinds of variation", "Dy llojet e variacionit", "Zwei Arten von Variation") },
    { page: "tool", kicker: x("Tool of the week", "Mjeti i javës", "Werkzeug der Woche"),
      title: x("The DMAIC card", "Karta DMAIC", "Die DMAIC-Karte") },
  ],
  sources: ["motorola-timeline", "isixsigma-sigma-levels", "asq-shewhart", "deming-1986", "swink-jacobs-2012", "shafer-moeller-2012", "nist-ehandbook-arl", "asq-dmaic"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Every process varies: the same task takes eight minutes one day and twelve the next. This issue is about telling the variation that belongs to the process from the variation that has a cause you can find, and about Six Sigma, the programme built to reduce it.",
        "Çdo proces ndryshon: e njëjta detyrë zgjat tetë minuta një ditë dhe dymbëdhjetë ditën tjetër. Ky numër flet për dallimin mes variacionit që i përket procesit dhe variacionit që ka një shkak që mund ta gjesh, dhe për Six Sigma, programin e ndërtuar për ta ulur.",
        "Jeder Prozess schwankt: Dieselbe Aufgabe dauert an einem Tag acht Minuten, am nächsten zwölf. Diese Ausgabe handelt davon, die Variation, die zum Prozess gehört, von jener zu unterscheiden, die eine auffindbare Ursache hat, und von Six Sigma, dem Programm, das sie verringern soll."),
      body: x(
        "Motorola dates Six Sigma to 1986. Its 3.4 defects per million opportunities assumes that a process drifts by 1.5 sigma over time. The idea behind it is older: in 1924 Walter Shewhart proposed the control chart to separate two sources of variation, and Deming estimated that 94% of troubles belong to the system. Two studies of 200 and 84 firms found that adopting Six Sigma went with better performance.",
        "Motorola e daton Six Sigma në 1986. Shifra e saj, 3,4 defekte për milion mundësi, e merr si të mirëqenë se procesi zhvendoset 1,5 sigma me kohën. Ideja pas saj është më e vjetër: në 1924 Walter Shewhart propozoi grafikun e kontrollit për të ndarë dy burime variacioni, dhe Deming vlerësoi se 94% e problemeve i përkasin sistemit. Dy studime me 200 dhe 84 firma gjetën se adoptimi i Six Sigma shkoi bashkë me performancë më të mirë.",
        "Motorola datiert Six Sigma auf 1986. Ihre 3,4 Fehler pro Million Möglichkeiten setzen voraus, dass sich ein Prozess mit der Zeit um 1,5 Sigma verschiebt. Die Idee dahinter ist älter: 1924 schlug Walter Shewhart die Regelkarte vor, um zwei Quellen der Variation zu trennen, und Deming schätzte, dass 94 % der Probleme zum System gehören. Zwei Studien mit 200 und 84 Firmen fanden, dass die Einführung von Six Sigma mit besserer Leistung einherging."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("3.4 per", "3,4 për", "3,4 pro"), x("million", "milion", "Million")],
      lead: x(
        "Motorola dates the invention of Six Sigma to 1986. The term is credited to its engineer Bill Smith; chairman Bob Galvin launched the programme across the company in 1987.",
        "Motorola e daton shpikjen e Six Sigma në 1986. Termi i atribuohet inxhinierit të saj Bill Smith; kryetari Bob Galvin e nisi programin në gjithë kompaninë në 1987.",
        "Motorola datiert die Erfindung von Six Sigma auf 1986. Der Begriff wird ihrem Ingenieur Bill Smith zugeschrieben; Vorstandschef Bob Galvin führte das Programm 1987 im ganzen Unternehmen ein."),
      blocks: [
        { type: "p", text: x(
          "Six Sigma sets out to reduce the variation of processes, because defects come from it. A process at six sigma gives 3.4 defects per million opportunities: not per million products, since one product can fail in many places.",
          "Six Sigma synon të ulë variacionin e proceseve, sepse prej tij vijnë defektet. Një proces në nivelin gjashtë sigma jep 3,4 defekte për milion mundësi: jo për milion produkte, sepse një produkt mund të dështojë në shumë vende.",
          "Six Sigma will die Variation von Prozessen verringern, weil Fehler aus ihr entstehen. Ein Prozess auf Sechs-Sigma-Niveau liefert 3,4 Fehler pro Million Möglichkeiten: nicht pro Million Produkte, denn ein Produkt kann an vielen Stellen fehlerhaft sein.") },
        { type: "figures", compact: true, items: [
          { n: x("3.4", "3,4", "3,4"), t: x("defects per million opportunities, with the 1.5 sigma shift", "defekte për milion mundësi, me zhvendosjen 1,5 sigma", "Fehler pro Million Möglichkeiten, mit der 1,5-Sigma-Verschiebung") },
          { n: x("≈0.002", "≈0,002", "≈0,002"), t: x("per million at ±6 sigma without the shift", "për milion te ±6 sigma pa zhvendosje", "pro Million bei ±6 Sigma ohne Verschiebung") },
        ] },
        { type: "p", text: x(
          "The 3.4 rests on a convention. Over time, the mean of a process is assumed to drift by up to 1.5 sigma, so a six-sigma process behaves in the long run like a 4.5-sigma one. The shift is Motorola's choice, not a law of statistics, and it has been criticised in the literature.",
          "3,4 mbështetet te një konventë. Supozohet se me kohën mesatarja e procesit zhvendoset deri në 1,5 sigma, kështu që një proces gjashtë sigma në afat të gjatë sillet si një proces 4,5 sigma. Zhvendosja është zgjedhje e Motorola-s, jo ligj i statistikës, dhe është kritikuar në literaturë.",
          "Die 3,4 beruhen auf einer Konvention. Man nimmt an, dass sich der Mittelwert eines Prozesses mit der Zeit um bis zu 1,5 Sigma verschiebt, sodass sich ein Sechs-Sigma-Prozess auf lange Sicht wie ein 4,5-Sigma-Prozess verhält. Die Verschiebung ist Motorolas Wahl, kein Gesetz der Statistik, und wird in der Fachliteratur kritisiert.") },
        { type: "callout", reading: true, text: x(
          "Six Sigma is less a number than a habit: measuring variation before arguing about it.",
          "Six Sigma është më pak një numër e më shumë një zakon: ta masësh variacionin para se të debatosh për të.",
          "Six Sigma ist weniger eine Zahl als eine Gewohnheit: Variation messen, bevor man über sie streitet.") },
      ],
      source: ["motorola-timeline", "isixsigma-sigma-levels"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("From three", "Nga tre", "Von drei"), x("to six sigma", "në gjashtë sigma", "bis sechs Sigma")],
      lead: x(
        "With the 1.5 sigma convention, each step up the scale cuts the defects per million opportunities sharply.",
        "Me konventën 1,5 sigma, çdo shkallë më lart i ul fort defektet për milion mundësi.",
        "Mit der 1,5-Sigma-Konvention senkt jede Stufe nach oben die Fehler pro Million Möglichkeiten deutlich."),
      blocks: [
        { type: "columns", height: 120, source: ["isixsigma-sigma-levels"],
          label: x("Defects per million opportunities, by sigma level, with the 1.5 sigma shift", "Defekte për milion mundësi, sipas nivelit sigma, me zhvendosjen 1,5 sigma", "Fehler pro Million Möglichkeiten nach Sigma-Niveau, mit der 1,5-Sigma-Verschiebung"),
          items: [
            { k: "3σ", v: 66807, n: x("66,807", "66.807", "66.807"), alert: true },
            { k: "4σ", v: 6210, n: x("6,210", "6.210", "6.210") },
            { k: "5σ", v: 233, n: "233" },
            { k: "6σ", v: 3.4, n: x("3.4", "3,4", "3,4") },
          ] },
        { type: "figures", compact: true, items: [
          { n: x("93.32%", "93,32%", "93,32 %"), t: x("of opportunities without a defect at three sigma", "e mundësive pa defekt te tre sigma", "der Möglichkeiten ohne Fehler bei drei Sigma") },
          { n: x("99.99966%", "99,99966%", "99,99966 %"), t: x("at six sigma", "te gjashtë sigma", "bei sechs Sigma") },
        ] },
        { type: "callout", reading: true, text: x(
          "The table is arithmetic on a convention, not measurements from factories. Its value is in showing how far apart three and six sigma are.",
          "Tabela është llogari mbi një konventë, jo matje nga fabrikat. Vlera e saj është se tregon sa larg janë tre dhe gjashtë sigma.",
          "Die Tabelle ist Rechnung auf einer Konvention, keine Messung aus Fabriken. Ihr Wert liegt darin, zu zeigen, wie weit drei und sechs Sigma auseinanderliegen.") },
      ],
      note: x(
        "Calculated with the 1.5 sigma shift; some tables round three sigma to 66,810 or 66,800.",
        "Llogaritur me zhvendosjen 1,5 sigma; disa tabela e rrumbullakojnë tre sigma në 66.810 ose 66.800.",
        "Berechnet mit der 1,5-Sigma-Verschiebung; manche Tabellen runden drei Sigma auf 66.810 oder 66.800."),
      source: ["isixsigma-sigma-levels"],
    },
    {
      id: "model", more: "a-good-sop-is-not-a-document",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Two kinds", "Dy llojet", "Zwei Arten"), x("of variation", "e variacionit", "von Variation")],
      lead: x(
        "In an internal memo of 16 May 1924, Walter Shewhart of Western Electric proposed the control chart to his superiors. He separated two sources of variation.",
        "Në një memo të brendshme më 16 maj 1924, Walter Shewhart i Western Electric u propozoi eprorëve grafikun e kontrollit. Ndau dy burime variacioni.",
        "In einem internen Memo vom 16. Mai 1924 schlug Walter Shewhart von Western Electric seinen Vorgesetzten die Regelkarte vor. Er trennte zwei Quellen der Variation."),
      blocks: [
        { type: "lists", cols: [
          { h: x("Common causes", "Shkaqet e përbashkëta", "Gemeinsame Ursachen"), items: [
            x("Part of the process itself", "Pjesë e vetë procesit", "Teil des Prozesses selbst"),
            x("Reduced only by changing the process", "Ulen vetëm duke ndryshuar procesin", "Nur durch Ändern des Prozesses zu verringern"),
          ] },
          { h: x("Special causes", "Shkaqet e veçanta", "Besondere Ursachen"), accent: true, items: [
            x("Appear now and then", "Shfaqen herë pas here", "Treten ab und zu auf"),
            x("Can be found and removed", "Mund të gjenden dhe të hiqen", "Lassen sich finden und beseitigen"),
          ] },
        ] },
        { type: "donut", v: 94, n: pc(94), source: ["deming-1986"], t: x(
          "of troubles and possibilities for improvement belong to the system, by Deming's estimate from experience; 6% are special.",
          "e problemeve dhe e mundësive për përmirësim i përkasin sistemit, sipas vlerësimit të Deming-ut nga përvoja; 6% janë të veçanta.",
          "der Probleme und Verbesserungsmöglichkeiten gehören zum System, nach Demings Schätzung aus Erfahrung; 6 % sind besondere.") },
        { type: "callout", reading: true, text: x(
          "Blaming a person for what the system produces changes nothing. Treating a special cause as normal lets it come back.",
          "Ta fajësosh një njeri për atë që prodhon sistemi nuk ndryshon asgjë. Ta trajtosh një shkak të veçantë si të zakonshëm e lë të kthehet.",
          "Einen Menschen für das zu beschuldigen, was das System hervorbringt, ändert nichts. Eine besondere Ursache als normal zu behandeln, lässt sie wiederkommen.") },
      ],
      note: x(
        "Shewhart called them chance and assignable causes; Deming named them common and special. The 94% is Deming's estimate, not a measurement.",
        "Shewhart i quajti shkaqe të rastit dhe shkaqe të caktueshme; Deming i quajti të përbashkëta dhe të veçanta. 94% është vlerësim i Deming-ut, jo matje.",
        "Shewhart nannte sie Zufallsursachen und zuordenbare Ursachen; Deming nannte sie gemeinsame und besondere. Die 94 % sind Demings Schätzung, keine Messung."),
      source: ["asq-shewhart", "deming-1986"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("Does Six Sigma", "A ia vlen", "Lohnt sich"), x("pay?", "Six Sigma?", "Six Sigma?")],
      lead: x(
        "Two studies in the Journal of Operations Management in 2012 compared firms that adopted Six Sigma with similar firms that did not.",
        "Dy studime te Journal of Operations Management në 2012 krahasuan firmat që e adoptuan Six Sigma me firma të ngjashme që nuk e adoptuan.",
        "Zwei Studien im Journal of Operations Management verglichen 2012 Firmen, die Six Sigma einführten, mit ähnlichen Firmen ohne Six Sigma."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("200 firms", "200 firma", "200 Firmen"), p: x("Morgan Swink and Brian Jacobs matched each firm with control firms of similar return on assets before adoption, industry and size. Six Sigma had a positive effect on return on assets, mainly through significant cuts in indirect costs.", "Morgan Swink dhe Brian Jacobs e krahasuan çdo firmë me firma kontrolli me kthim të ngjashëm mbi aktivet para adoptimit, me të njëjtën industri dhe madhësi. Six Sigma pati efekt pozitiv te kthimi mbi aktivet, kryesisht përmes uljes së ndjeshme të kostove indirekte.", "Morgan Swink und Brian Jacobs stellten jeder Firma Kontrollfirmen mit ähnlicher Gesamtkapitalrendite vor der Einführung, gleicher Branche und Größe gegenüber. Six Sigma wirkte positiv auf die Gesamtkapitalrendite, vor allem durch deutlich gesenkte indirekte Kosten.") },
          { h: x("84 firms, ten years", "84 firma, dhjetë vjet", "84 Firmen, zehn Jahre"), p: x("Scott Shafer and Sara Moeller followed firms from three years before adoption to six years after, against control groups. Overall, adopting Six Sigma went with better firm performance.", "Scott Shafer dhe Sara Moeller i ndoqën firmat nga tre vjet para adoptimit deri në gjashtë vjet pas tij, përballë grupeve të kontrollit. Në tërësi, adoptimi i Six Sigma shkoi bashkë me performancë më të mirë të firmës.", "Scott Shafer und Sara Moeller begleiteten Firmen von drei Jahren vor der Einführung bis sechs Jahre danach, im Vergleich mit Kontrollgruppen. Insgesamt ging die Einführung von Six Sigma mit besserer Firmenleistung einher.") },
        ] },
        { type: "callout", reading: true, text: x(
          "Both studies look at firms that announced adoption. They show what tended to follow, not what Six Sigma guarantees.",
          "Të dyja studimet shikojnë firma që e njoftuan adoptimin. Tregojnë çfarë ndodhi zakonisht më pas, jo çfarë garanton Six Sigma.",
          "Beide Studien betrachten Firmen, die die Einführung bekannt gaben. Sie zeigen, was meist folgte, nicht, was Six Sigma garantiert.") },
      ],
      note: x(
        "Associations, not full proof of cause; we could not see the effect sizes of the second study.",
        "Lidhje, jo provë e plotë shkaku; madhësinë e efekteve të studimit të dytë s'e kam parë.",
        "Zusammenhänge, kein voller Ursachenbeweis; die Effektgrößen der zweiten Studie konnten wir nicht einsehen."),
      source: ["swink-jacobs-2012", "shafer-moeller-2012"],
    },
    {
      id: "measure", tool: "/tools/sigma-control-chart/",
      kicker: x("How it is measured", "Si matet", "Wie man es misst"),
      title: [x("Reading a", "Si lexohet", "Eine Regelkarte"), x("control chart", "grafiku i kontrollit", "lesen")],
      lead: x(
        "A control chart plots one measure over time, with limits three standard deviations from the mean. In a stable process a point falls outside them with a probability of 0.27%: about one false alarm in 370 points.",
        "Grafiku i kontrollit vendos një masë në kohë, me kufij tre devijime standarde nga mesatarja. Në një proces të qëndrueshëm, një pikë bie jashtë tyre me probabilitet 0,27%: rreth një alarm i rremë në 370 pika.",
        "Eine Regelkarte trägt eine Kennzahl über die Zeit auf, mit Grenzen drei Standardabweichungen vom Mittelwert. In einem stabilen Prozess fällt ein Punkt mit einer Wahrscheinlichkeit von 0,27 % heraus: etwa ein Fehlalarm auf 370 Punkte."),
      blocks: [
        { type: "steps", items: [
          { h: x("Plot one measure in time order", "Vendos një masë sipas radhës kohore", "Eine Kennzahl in zeitlicher Reihenfolge auftragen"), p: x("Per day, shift or batch, always counted the same way.", "Për ditë, turn ose seri, gjithmonë e numëruar njësoj.", "Pro Tag, Schicht oder Charge, immer gleich gezählt.") },
          { h: x("Draw the mean and the limits", "Vizato mesataren dhe kufijtë", "Mittelwert und Grenzen einzeichnen"), p: x("Three standard deviations above and below the mean.", "Tre devijime standarde mbi dhe nën mesataren.", "Drei Standardabweichungen über und unter dem Mittelwert.") },
          { h: x("Act on signals", "Vepro kur ka sinjal", "Auf Signale reagieren"), p: x("A point outside the limits points to a special cause: look for it.", "Një pikë jashtë kufijve tregon një shkak të veçantë: kërkoje.", "Ein Punkt außerhalb der Grenzen deutet auf eine besondere Ursache: sie suchen.") },
          { h: x("Improve the process for the rest", "Përmirëso procesin për pjesën tjetër", "Für den Rest den Prozess verbessern"), p: x("Inside the limits, work on the process as a whole, not on single points.", "Brenda kufijve, puno me procesin si të tërë, jo me pika të veçanta.", "Innerhalb der Grenzen am Prozess als Ganzem arbeiten, nicht an einzelnen Punkten.") },
        ] },
        { type: "example", label: x("Hypothetical example, minutes to load a truck", "Shembull hipotetik, minutat për të ngarkuar një kamion", "Hypothetisches Beispiel, Minuten zum Beladen eines Lkw"), rows: [
          { k: x("Mean", "Mesatarja", "Mittelwert"), v: x("42 minutes", "42 minuta", "42 Minuten") },
          { k: x("Limits", "Kufijtë", "Grenzen"), v: x("30 to 54 minutes", "30 deri në 54 minuta", "30 bis 54 Minuten") },
          { k: x("Day 17", "Dita 17", "Tag 17"), v: x("61 minutes: outside, a forklift was down", "61 minuta: jashtë, një pirun ishte në defekt", "61 Minuten: außerhalb, ein Stapler war ausgefallen") },
        ], text: x("Only day 17 calls for a search for a cause; the rest is the process. The numbers are invented.", "Vetëm dita 17 kërkon që të kërkosh një shkak; pjesa tjetër është procesi. Numrat janë të shpikur.", "Nur Tag 17 verlangt die Suche nach einer Ursache; der Rest ist der Prozess. Die Zahlen sind erfunden.") },
      ],
      note: x(
        "The steps and the example are the editors'; the limits and the false-alarm rate follow NIST.",
        "Hapat dhe shembulli janë të redaksisë; kufijtë dhe shkalla e alarmeve të rreme ndjekin NIST.",
        "Schritte und Beispiel stammen von der Redaktion; Grenzen und Fehlalarmrate folgen NIST."),
      source: ["nist-ehandbook-arl"],
    },
    {
      id: "tool", tool: "/tools/six-sigma-dmaic/",
      kicker: x("Tool of the week", "Mjeti i javës", "Werkzeug der Woche"),
      title: [x("The DMAIC", "Karta", "Die DMAIC-"), x("card", "DMAIC", "Karte")],
      lead: x(
        "DMAIC is ASQ's structured way to improve an existing process that falls short of its standard or of what the customer expects. One card per project.",
        "DMAIC është mënyra e strukturuar e ASQ për të përmirësuar një proces ekzistues që nuk e arrin standardin ose atë që pret klienti. Një kartë për çdo projekt.",
        "DMAIC ist der strukturierte Weg der ASQ, einen bestehenden Prozess zu verbessern, der seinen Standard oder die Erwartungen der Kunden verfehlt. Eine Karte pro Projekt."),
      blocks: [
        { type: "form", items: [
          { h: x("Define", "Define (përcakto)", "Define (definieren)"), hint: x("the problem, the customer and the goal, on one page", "problemi, klienti dhe qëllimi, në një faqe", "Problem, Kunde und Ziel, auf einer Seite") },
          { h: x("Measure", "Measure (mat)", "Measure (messen)"), hint: x("the baseline, and whether the measurement itself can be trusted", "pika e nisjes, dhe nëse vetë matjes mund t'i besohet", "die Ausgangslage, und ob der Messung selbst zu trauen ist") },
          { h: x("Analyze", "Analyze (analizo)", "Analyze (analysieren)"), hint: x("the main causes, shown with data", "shkaqet kryesore, të treguara me të dhëna", "die Hauptursachen, mit Daten belegt") },
          { h: x("Improve", "Improve (përmirëso)", "Improve (verbessern)"), hint: x("the change, tested before it is rolled out", "ndryshimi, i provuar para se të shtrihet", "die Änderung, getestet vor der Einführung") },
          { h: x("Control", "Control (kontrollo)", "Control (sichern)"), hint: x("the control plan and the chart that keeps the gain", "plani i kontrollit dhe grafiku që e mban fitimin", "der Kontrollplan und die Regelkarte, die den Gewinn hält") },
          { h: x("For a new process", "Për një proces të ri", "Für einen neuen Prozess"), hint: x("DMADV instead: define, measure, analyze, design, verify", "DMADV në vend të saj: përcakto, mat, analizo, harto, verifiko", "stattdessen DMADV: definieren, messen, analysieren, gestalten, verifizieren") },
        ] },
      ],
      note: x(
        "The five phases follow ASQ; the card is the editors'.",
        "Pesë fazat ndjekin ASQ; karta është e redaksisë.",
        "Die fünf Phasen folgen der ASQ; die Karte stammt von der Redaktion."),
      source: ["asq-dmaic"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
