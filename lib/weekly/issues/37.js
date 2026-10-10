// Management Review, No. 37: Dashboards that get used. Block: KPIs.
// Facts and their sources: docs/revista/management-review-nr-37.md.
import { x, pc } from "../common.js";

export default {
  number: 37,
  block: "kpi",
  date: x("October 2026", "Tetor 2026", "Oktober 2026"),
  theme: [x("Dashboards", "Dashboard-et", "Dashboards,"), x("that get used", "që përdoren", "die genutzt werden")],
  sub: x(
    "Few's one screen at a glance, how sure people feel with data, the bullet graph, who uses dashboards and for what, five design mistakes, and a card for a dashboard that gets used.",
    "Një ekran me një shikim sipas Few-t, sa të sigurt ndihen njerëzit me të dhënat, grafiku bullet, kush i përdor dashboard-et dhe për çfarë, pesë gabime dizajni, dhe një kartë për një dashboard që përdoret.",
    "Ein Bildschirm, ein Blick nach Few, wie sicher sich Menschen mit Daten fühlen, der Bullet-Graph, wer Dashboards nutzt und wofür, fünf Gestaltungsfehler und eine Karte für ein Dashboard, das genutzt wird."),
  seo: x(
    "Dashboards that get used: Few's one-screen test, data literacy (21% confident), the bullet graph, who really uses dashboards, and a card.",
    "Dashboard-et që përdoren: prova e një ekrani e Few-t, aftësitë me të dhënat (21% të sigurt), grafiku bullet, kush i përdor vërtet, dhe një kartë.",
    "Dashboards, die genutzt werden: Fews Ein-Bildschirm-Test, Datenkompetenz (21 % sicher), der Bullet-Graph, wer sie wirklich nutzt, und eine Karte."),
  feature: x(
    "Issue 37 starts with Stephen Few's narrow definition of a dashboard, one screen monitored at a glance, asks how sure employees feel when they work with data, explains the bullet graph Few designed to replace the gauge, looks at who actually uses dashboards and for what, checks a screen against Few's common design mistakes, and ends with a card for a dashboard that gets used.",
    "Numri 37 nis me përkufizimin e ngushtë të Stephen Few-t për dashboard-in, një ekran që ndiqet me një shikim, pyet sa të sigurt ndihen punonjësit kur punojnë me të dhëna, shpjegon grafikun bullet që Few e projektoi për të zëvendësuar kadranin, shikon kush i përdor vërtet dashboard-et dhe për çfarë, kontrollon një ekran me gabimet e zakonshme të dizajnit sipas Few-t, dhe mbyllet me një kartë për një dashboard që përdoret.",
    "Ausgabe 37 beginnt mit Stephen Fews enger Definition eines Dashboards, ein Bildschirm, der auf einen Blick überwacht wird, fragt, wie sicher sich Beschäftigte im Umgang mit Daten fühlen, erklärt den Bullet-Graph, den Few als Ersatz für den Tacho entwarf, zeigt, wer Dashboards tatsächlich nutzt und wofür, prüft einen Bildschirm an Fews häufigen Gestaltungsfehlern und endet mit einer Karte für ein Dashboard, das genutzt wird."),
  figure: { n: pc(21), by: "Accenture & Qlik, 2020", t: x(
    "of 9,000 employees in nine countries said they were confident in their data literacy skills.",
    "e 9.000 punonjësve në nëntë vende thanë se ishin të sigurt në aftësitë e tyre me të dhënat.",
    "von 9.000 Beschäftigten in neun Ländern gaben an, sich ihrer Datenkompetenz sicher zu sein.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("One screen, one glance", "Një ekran, një shikim", "Ein Bildschirm, ein Blick") },
    { page: "model", kicker: x("The model", "Modeli", "Das Modell"),
      title: x("A line instead of a gauge", "Një vijë në vend të kadranit", "Eine Linie statt eines Tachos") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The dashboard card", "Karta e dashboard-it", "Die Karte für das Dashboard") },
  ],
  sources: ["few-2006", "few-2017", "accenture-qlik-2020", "forrester-tableau-2022", "few-bullet-2013", "velcu-yigitbasioglu-2012", "dowding-2015"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Many companies have more dashboards than decisions. This issue asks what a dashboard is for, who can read it, who actually uses it, and how to tell a screen that gets used from one that is merely switched on.",
        "Shumë kompani kanë më shumë dashboard-e sesa vendime. Ky numër pyet për çfarë shërben një dashboard, kush di ta lexojë, kush e përdor vërtet, dhe si dallohet një ekran që përdoret nga një ekran që thjesht rri ndezur.",
        "Viele Unternehmen haben mehr Dashboards als Entscheidungen. Diese Ausgabe fragt, wofür ein Dashboard da ist, wer es lesen kann, wer es tatsächlich nutzt und wie man einen Bildschirm, der genutzt wird, von einem unterscheidet, der nur eingeschaltet ist."),
      body: x(
        "Stephen Few's definition is narrow: the most important information on one screen, monitored at a glance. In a 2019 survey of 9,000 employees in nine countries, 21% were confident in their data literacy and 74% felt overwhelmed or unhappy working with data. In Finland only about a quarter of the sales managers who answered a 2010 survey used a dashboard. Few's bullet graph replaces the gauge with one line, and a review of health care studies links dashboards that are easy to reach with better care.",
        "Përkufizimi i Stephen Few-t është i ngushtë: informacioni më i rëndësishëm në një ekran, i ndjekur me një shikim. Në një anketë të 2019 me 9.000 punonjës në nëntë vende, 21% ishin të sigurt në aftësitë e tyre me të dhënat dhe 74% ndiheshin të rënduar ose të pakënaqur kur punonin me to. Në Finlandë vetëm rreth një e katërta e drejtuesve të shitjeve që iu përgjigjën një ankete të 2010 përdornin dashboard. Grafiku bullet i Few-t e zëvendëson kadranin me një vijë, dhe një rishikim i studimeve në shëndetësi i lidh dashboard-et që arrihen lehtë me kujdes më të mirë.",
        "Stephen Fews Definition ist eng: die wichtigsten Informationen auf einem Bildschirm, auf einen Blick überwacht. In einer Umfrage von 2019 unter 9.000 Beschäftigten in neun Ländern waren sich 21 % ihrer Datenkompetenz sicher, und 74 % fühlten sich bei der Arbeit mit Daten überfordert oder unwohl. In Finnland nutzte nur etwa ein Viertel der Vertriebsleiter, die 2010 an einer Umfrage teilnahmen, ein Dashboard. Fews Bullet-Graph ersetzt den Tacho durch eine Linie, und eine Auswertung von Studien im Gesundheitswesen verbindet leicht erreichbare Dashboards mit besserer Versorgung."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("One screen,", "Një ekran,", "Ein Bildschirm,"), x("one glance", "një shikim", "ein Blick")],
      lead: x(
        "In 2004 Stephen Few defined a dashboard narrowly: a visual display of the most important information needed to reach one or more objectives, arranged on a single screen so it can be monitored at a glance.",
        "Në 2004, Stephen Few e përkufizoi dashboard-in ngushtë: një paraqitje vizuale e informacionit më të rëndësishëm që duhet për të arritur një ose më shumë objektiva, e vendosur në një ekran të vetëm që të ndiqet me një shikim.",
        "2004 definierte Stephen Few ein Dashboard eng: eine visuelle Darstellung der wichtigsten Informationen, die man braucht, um ein oder mehrere Ziele zu erreichen, auf einem einzigen Bildschirm angeordnet, damit sie sich auf einen Blick überwachen lässt."),
      blocks: [
        { type: "cards", cols: 3, items: [
          { h: x("The most important", "Më e rëndësishmja", "Das Wichtigste"), p: x("what the objectives need, not everything that can be measured", "ajo që u duhet objektivave, jo gjithçka që mund të matet", "was die Ziele brauchen, nicht alles, was sich messen lässt") },
          { h: x("One screen", "Një ekran", "Ein Bildschirm"), p: x("no scrolling, no switching: short-term memory holds little", "pa lëvizur poshtë, pa ndërruar ekran: kujtesa afatshkurtër mban pak", "kein Scrollen, kein Wechseln: das Kurzzeitgedächtnis fasst wenig") },
          { h: x("At a glance", "Me një shikim", "Auf einen Blick"), p: x("summaries and exceptions, read in an instant", "përmbledhje dhe përjashtime, të lexuara në çast", "Zusammenfassungen und Ausnahmen, sofort erfasst") },
        ] },
        { type: "p", text: x(
          "Later Few sharpened it: a mainly visual display that people use to monitor current conditions rapidly, conditions that need a timely response in a specific role. By that test, he wrote in 2017, only 2 of the 28 examples in The Big Book of Dashboards were rapid-monitoring displays; the others may be useful, but they serve other purposes.",
          "Më vonë Few e mprehu: një paraqitje kryesisht vizuale që njerëzit e përdorin për të ndjekur shpejt gjendjen e çastit, gjendje që kërkon përgjigje në kohë në një rol të caktuar. Sipas kësaj prove, shkroi ai në 2017, vetëm 2 nga 28 shembujt te The Big Book of Dashboards ishin ekrane për ndjekje të shpejtë; të tjerët mund të jenë të dobishëm, por shërbejnë për qëllime të tjera.",
          "Später schärfte Few sie nach: eine überwiegend visuelle Darstellung, mit der Menschen den aktuellen Zustand rasch überwachen, einen Zustand, der in einer bestimmten Rolle eine rechtzeitige Reaktion verlangt. Nach diesem Maßstab, schrieb er 2017, seien nur 2 der 28 Beispiele im Big Book of Dashboards Anzeigen zur schnellen Überwachung; die übrigen mögen nützlich sein, dienen aber anderen Zwecken.") },
        { type: "callout", reading: true, text: x(
          "A screen full of charts is not yet a dashboard. Ask who looks at it, how often, and what they do next.",
          "Një ekran plot grafikë nuk është ende dashboard. Pyet kush e shikon, sa shpesh, dhe çfarë bën pastaj.",
          "Ein Bildschirm voller Diagramme ist noch kein Dashboard. Fragen: Wer schaut hin, wie oft, und was folgt daraus?") },
      ],
      note: x(
        "The definitions are Few's; the 2004 wording was checked where he quotes it himself in 2017. The count of 2 in 28 is his judgement of another book, not a measurement.",
        "Përkufizimet janë të Few-t; formulimi i 2004 u kontrollua aty ku e citon vetë në 2017. Numërimi 2 nga 28 është gjykimi i tij për një libër tjetër, jo matje.",
        "Die Definitionen stammen von Few; die Fassung von 2004 wurde dort geprüft, wo er sie 2017 selbst zitiert. Die Zählung 2 von 28 ist sein Urteil über ein anderes Buch, keine Messung."),
      source: ["few-2017", "few-2006"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("Data that", "Të dhëna që", "Daten, die"), x("overwhelm", "rëndojnë", "überfordern")],
      lead: x(
        "In September 2019 Opinium surveyed 9,000 full-time employees in nine countries, Germany among them, for Accenture and Qlik. Most saw data as an asset; few felt sure using it.",
        "Në shtator 2019, Opinium anketoi për Accenture dhe Qlik 9.000 punonjës me kohë të plotë në nëntë vende, mes tyre Gjermania. Shumica i shihnin të dhënat si pasuri; pak ndiheshin të sigurt me to.",
        "Im September 2019 befragte Opinium für Accenture und Qlik 9.000 Vollzeitbeschäftigte in neun Ländern, darunter Deutschland. Die meisten sahen Daten als Wert; wenige fühlten sich sicher damit."),
      blocks: [
        { type: "hbars", max: 100, source: ["accenture-qlik-2020"],
          label: x("Employees in nine countries, September 2019 (self-reported)", "Punonjës në nëntë vende, shtator 2019 (vetëdeklarim)", "Beschäftigte in neun Ländern, September 2019 (Selbstauskunft)"),
          items: [
            { k: x("See data as an asset", "I shohin të dhënat si pasuri", "Sehen Daten als Wert"), v: 87, n: pc(87) },
            { k: x("Overwhelmed or unhappy working with data", "Të rënduar ose të pakënaqur kur punojnë me të dhëna", "Bei Datenarbeit überfordert oder unwohl"), v: 74, n: pc(74) },
            { k: x("Often trust a gut feeling instead of data", "Shpesh i besojnë ndjesisë në vend të të dhënave", "Folgen oft dem Bauchgefühl statt Daten"), v: 48, n: pc(48) },
            { k: x("Confident in their data literacy", "Të sigurt në aftësitë me të dhënat", "Ihrer Datenkompetenz sicher"), v: 21, n: pc(21), alert: true },
          ] },
        { type: "p", text: x(
          "In a 2022 Forrester Consulting survey for Tableau of more than 2,000 people in ten countries, 82% of decision-makers expected basic data literacy in every department, but only 39% of organisations offered data training to all employees.",
          "Në një anketë të Forrester Consulting për Tableau në 2022, me mbi 2.000 njerëz në dhjetë vende, 82% e vendimmarrësve prisnin aftësi bazë me të dhënat në çdo departament, por vetëm 39% e organizatave u ofronin trajnim për të dhënat të gjithë punonjësve.",
          "In einer Umfrage von Forrester Consulting für Tableau 2022 unter mehr als 2.000 Personen in zehn Ländern erwarteten 82 % der Entscheider Grundkenntnisse im Umgang mit Daten in jeder Abteilung, aber nur 39 % der Organisationen boten allen Beschäftigten Datenschulungen an.") },
        { type: "callout", reading: true, text: x(
          "Dashboards are read by people, not by software. A clear screen does not help someone who avoids numbers.",
          "Dashboard-et i lexojnë njerëzit, jo programet. Një ekran i qartë nuk ndihmon dikë që u shmanget numrave.",
          "Dashboards lesen Menschen, nicht die Software. Ein klarer Bildschirm hilft niemandem, der Zahlen meidet.") },
      ],
      note: x(
        "Both studies were commissioned by firms that sell analytics software, and both rest on self-reports. For Albania we have no comparable figure.",
        "Të dyja studimet u porositën nga firma që shesin programe analitike, dhe të dyja mbështeten te vetëdeklarimet. Për Shqipërinë nuk kemi shifër të krahasueshme.",
        "Beide Studien wurden von Firmen beauftragt, die Analysesoftware verkaufen, und beide beruhen auf Selbstauskünften. Für Albanien liegt uns keine vergleichbare Zahl vor."),
      source: ["accenture-qlik-2020", "forrester-tableau-2022"],
    },
    {
      id: "model",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("A line instead", "Një vijë në vend", "Eine Linie statt"), x("of a gauge", "të kadranit", "eines Tachos")],
      lead: x(
        "Few designed the bullet graph to replace the meters and gauges common on dashboards. In a small space it shows one measure, compares it with a target and places it in ranges such as poor, satisfactory and good.",
        "Few e projektoi grafikun bullet për të zëvendësuar matësit dhe kadranët që shihen shpesh në dashboard-e. Në pak hapësirë tregon një masë, e krahason me një objektiv dhe e vendos në zona si dobët, mjaftueshëm dhe mirë.",
        "Few entwarf den Bullet-Graph als Ersatz für die Messuhren und Tachos, die auf Dashboards üblich sind. Auf kleinem Raum zeigt er eine Kennzahl, vergleicht sie mit einem Ziel und ordnet sie Bereichen wie schlecht, ausreichend und gut zu."),
      blocks: [
        { type: "chain", items: [
          { h: x("Label", "Etiketa", "Beschriftung"), p: x("names the measure", "emërton masën", "benennt die Kennzahl") },
          { h: x("Scale", "Shkalla", "Skala"), p: x("one linear axis, usually from zero", "një bosht linear, zakonisht nga zero", "eine lineare Achse, meist ab null") },
          { h: x("Measure", "Masa", "Wert"), p: x("a dark bar, the most visible part", "një shirit i errët, pjesa më e dukshme", "ein dunkler Balken, der auffälligste Teil") },
          { h: x("Comparison", "Krahasimi", "Vergleich"), p: x("a short cross line: target or last year", "një vijë e shkurtër tërthore: objektivi ose viti i kaluar", "ein kurzer Querstrich: Ziel oder Vorjahr") },
          { h: x("Ranges", "Zonat", "Bereiche"), p: x("two to five shades, ideally three", "dy deri në pesë nuanca, më mirë tri", "zwei bis fünf Abstufungen, am besten drei") },
        ] },
        { type: "p", text: x(
          "Few advises shades of one colour, dark for poor and light for good, rather than separate hues that people with colour blindness may not tell apart. A linear design, he writes, also takes less space and is read more efficiently than a round gauge.",
          "Few këshillon nuanca të një ngjyre, të errët për dobët dhe të çelët për mirë, në vend të ngjyrave të ndryshme që njerëzit me daltonizëm mund të mos i dallojnë. Një formë lineare, shkruan ai, zë edhe më pak vend dhe lexohet më me efikasitet se një kadran i rrumbullakët.",
          "Few rät zu Abstufungen einer Farbe, dunkel für schlecht und hell für gut, statt verschiedener Farbtöne, die farbenblinde Menschen womöglich nicht unterscheiden. Eine lineare Form, schreibt er, braucht zudem weniger Platz und lässt sich effizienter lesen als ein runder Tacho.") },
        { type: "example", label: x("Hypothetical example, one line on a shift dashboard", "Shembull hipotetik, një rresht në dashboard-in e turnit", "Hypothetisches Beispiel, eine Zeile auf einem Schicht-Dashboard"), rows: [
          { k: x("Measure", "Masa", "Kennzahl"), v: x("on-time departures this week: 91%", "nisjet në kohë këtë javë: 91%", "pünktliche Abfahrten diese Woche: 91 %") },
          { k: x("Target", "Objektivi", "Ziel"), v: x("a cross line at 95%", "një vijë tërthore te 95%", "ein Querstrich bei 95 %") },
          { k: x("Ranges", "Zonat", "Bereiche"), v: x("below 85% poor, 85–95% satisfactory, above 95% good", "nën 85% dobët, 85–95% mjaftueshëm, mbi 95% mirë", "unter 85 % schlecht, 85–95 % ausreichend, über 95 % gut") },
        ], text: x("One line: below target, in the middle range. The figures are invented.", "Një rresht: nën objektiv, në zonën e mesme. Shifrat janë të shpikura.", "Eine Zeile: unter dem Ziel, im mittleren Bereich. Die Zahlen sind erfunden.") },
      ],
      note: x(
        "The parts and defaults follow Few's design specification (2006, revised 2013). The colour advice is his recommendation, not a tested standard.",
        "Pjesët dhe parazgjedhjet ndjekin specifikimin e dizajnit të Few-t (2006, rishikuar në 2013). Këshilla për ngjyrat është rekomandimi i tij, jo standard i provuar.",
        "Teile und Voreinstellungen folgen Fews Gestaltungsspezifikation (2006, überarbeitet 2013). Der Farbrat ist seine Empfehlung, kein geprüfter Standard."),
      source: ["few-bullet-2013"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("Who uses them,", "Kush i përdor,", "Wer sie nutzt"), x("and for what", "dhe për çfarë", "und wofür")],
      lead: x(
        "At the end of 2010 Oana Velcu-Laitinen and Ogan Yigitbasioglu surveyed senior sales managers at 851 Finnish companies about dashboards. 145 answered, and only about a quarter of them used one.",
        "Në fund të 2010, Oana Velcu-Laitinen dhe Ogan Yigitbasioglu anketuan drejtuesit e lartë të shitjeve në 851 kompani finlandeze për dashboard-et. U përgjigjën 145, dhe vetëm rreth një e katërta e tyre përdornin një të tillë.",
        "Ende 2010 befragten Oana Velcu-Laitinen und Ogan Yigitbasioglu leitende Vertriebsverantwortliche in 851 finnischen Unternehmen zu Dashboards. 145 antworteten, und nur etwa ein Viertel von ihnen nutzte eines."),
      blocks: [
        { type: "hbars", max: 145, source: ["velcu-yigitbasioglu-2012"],
          label: x("Sales managers who answered, Finland, end of 2010 (number, of 145)", "Drejtues shitjesh që u përgjigjën, Finlandë, fund i 2010 (numri, nga 145)", "Vertriebsleiter, die antworteten, Finnland, Ende 2010 (Anzahl, von 145)"),
          items: [
            { k: x("Used a dashboard", "Përdornin dashboard", "Nutzten ein Dashboard"), v: 36, n: "36", alert: true },
            { k: x("Used other reporting tools instead", "Përdornin mjete të tjera raportimi", "Nutzten stattdessen andere Berichtswerkzeuge"), v: 62, n: "62" },
            { k: x("Other non-users", "Të tjerë që nuk përdornin", "Übrige Nichtnutzer"), v: 47, n: "47" },
          ] },
        { type: "p", text: x(
          "Seven of the 36 had built theirs in Excel. Users ranked communication and consistency first of four purposes, ahead of monitoring, and data quality went with use. A 2015 review of 11 health care studies found that where clinicians could reach dashboards easily, as a screen saver for example, use went with better care processes and patient outcomes.",
          "Shtatë nga 36 e kishin ndërtuar në Excel. Nga katër qëllime, përdoruesit vunë të parët komunikimin dhe njëtrajtshmërinë, para ndjekjes, dhe cilësia e të dhënave shkonte me përdorimin. Një rishikim i 2015 me 11 studime në shëndetësi gjeti se aty ku personeli mjekësor i arrinte lehtë dashboard-et, për shembull si mbrojtës ekrani, përdorimi shkonte me procese më të mira kujdesi dhe rezultate më të mira për pacientët.",
          "Sieben der 36 hatten ihres in Excel gebaut. Von vier Zwecken setzten die Nutzer Kommunikation und Einheitlichkeit an die erste Stelle, vor der Überwachung, und die Datenqualität ging mit der Nutzung einher. Eine Auswertung von 11 Studien im Gesundheitswesen fand 2015: Wo das klinische Personal Dashboards leicht erreichte, etwa als Bildschirmschoner, ging die Nutzung mit besseren Versorgungsabläufen und Behandlungsergebnissen einher.") },
        { type: "callout", reading: true, text: x(
          "A dashboard people have to go looking for is rarely looked at. Put it where the work happens.",
          "Një dashboard që duhet kërkuar rrallë shikohet. Vendose aty ku ndodh puna.",
          "Ein Dashboard, das man suchen muss, wird selten angesehen. Es gehört dorthin, wo die Arbeit passiert.") },
      ],
      note: x(
        "A small sample (17% responded) and correlations, not proof of cause; 47 is the rest of the 109 non-users. The health care review calls the evidence limited.",
        "Mostër e vogël (u përgjigjën 17%) dhe lidhje, jo provë shkaku; 47 është pjesa tjetër e 109 jopërdoruesve. Rishikimi në shëndetësi i quan provat të kufizuara.",
        "Kleine Stichprobe (17 % Rücklauf) und Zusammenhänge, kein Beweis einer Ursache; 47 ist der Rest der 109 Nichtnutzer. Die Auswertung im Gesundheitswesen nennt die Belege begrenzt."),
      source: ["velcu-yigitbasioglu-2012", "dowding-2015"],
    },
    {
      id: "measure", more: "kpis-do-not-improve-in-excel",
      kicker: x("How it is measured", "Si matet", "Wie man es misst"),
      title: [x("Is anyone", "A e shikon", "Schaut überhaupt"), x("looking?", "dikush?", "jemand hin?")],
      lead: x(
        "A dashboard can be checked twice: against Few's list of common design mistakes, and against what people do with it. The first takes an hour; the second takes a month of meetings.",
        "Një dashboard mund të kontrollohet dy herë: me listën e Few-t të gabimeve të zakonshme të dizajnit, dhe me atë që njerëzit bëjnë me të. E para merr një orë; e dyta një muaj takimesh.",
        "Ein Dashboard lässt sich zweimal prüfen: an Fews Liste häufiger Gestaltungsfehler und daran, was Menschen damit tun. Das Erste dauert eine Stunde, das Zweite einen Monat an Besprechungen."),
      blocks: [
        { type: "box", title: x("Five of Few's thirteen common mistakes", "Pesë nga trembëdhjetë gabimet e zakonshme sipas Few-t", "Fünf von Fews dreizehn häufigen Fehlern"), items: [
          x("exceeding the boundaries of one screen", "kalimi i kufijve të një ekrani", "die Grenzen eines Bildschirms überschreiten"),
          x("too little context: no target, no comparison", "kontekst i pakët: pa objektiv, pa krahasim", "zu wenig Kontext: kein Ziel, kein Vergleich"),
          x("excessive detail or precision", "detaje ose saktësi e tepruar", "übermäßige Details oder Genauigkeit"),
          x("a deficient measure", "një masë e mangët", "eine ungeeignete Kennzahl"),
          x("misusing or overusing colour", "ngjyra të keqpërdorura ose të tepërta", "Farbe falsch oder zu viel einsetzen"),
        ] },
        { type: "steps", items: [
          { h: x("Name the user and the decision", "Emërto përdoruesin dhe vendimin", "Nutzer und Entscheidung benennen"), p: x("If no one can say which decision a number serves, it belongs in a report.", "Nëse askush nuk thotë dot cilit vendim i shërben një numër, vendi i tij është në raport.", "Kann niemand sagen, welcher Entscheidung eine Zahl dient, gehört sie in einen Bericht.") },
          { h: x("Count actions, not views", "Numëro veprimet, jo shikimet", "Handlungen zählen, nicht Aufrufe"), p: x("In each review, note which number led to a step, an owner and a date.", "Në çdo rishikim, shëno cili numër çoi te një hap, një përgjegjës dhe një datë.", "In jeder Besprechung notieren, welche Zahl zu einem Schritt mit Verantwortlichem und Termin führte.") },
          { h: x("Remove what no one used", "Hiq atë që nuk e përdori askush", "Entfernen, was niemand nutzte"), p: x("A measure that triggered nothing for a quarter leaves the screen.", "Një masë që s'nxiti asgjë për tre muaj del nga ekrani.", "Eine Kennzahl, die ein Quartal lang nichts auslöste, verlässt den Bildschirm.") },
        ] },
      ],
      note: x(
        "The mistakes are from Few (2006); the steps are the editors' proposal, not a tested method.",
        "Gabimet janë nga Few (2006); hapat janë propozim i redaksisë, jo metodë e provuar.",
        "Die Fehler stammen von Few (2006); die Schritte sind ein Vorschlag der Redaktion, keine geprüfte Methode."),
      source: ["few-2006"],
    },
    {
      id: "tool", tool: "/tools/shift-pulse/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The dashboard", "Karta e", "Die Karte für"), x("card", "dashboard-it", "das Dashboard")],
      lead: x(
        "Fill it in before you build the screen, and again after a month. If a line stays empty, the dashboard is not ready.",
        "Plotësoje para se ta ndërtosh ekranin, dhe sërish pas një muaji. Nëse një rresht mbetet bosh, dashboard-i nuk është gati.",
        "Vor dem Bau des Bildschirms ausfüllen, und nach einem Monat noch einmal. Bleibt eine Zeile leer, ist das Dashboard nicht fertig."),
      blocks: [
        { type: "form", items: [
          { h: x("Who looks at it", "Kush e shikon", "Wer hinschaut"), hint: x("the role, and how often: every shift, day or week", "roli, dhe sa shpesh: çdo turn, ditë ose javë", "die Rolle, und wie oft: jede Schicht, jeden Tag, jede Woche") },
          { h: x("The decision it serves", "Vendimi që i shërben", "Die Entscheidung, der es dient"), hint: x("one sentence: what changes when the number moves", "një fjali: çfarë ndryshon kur lëviz numri", "ein Satz: was sich ändert, wenn sich die Zahl bewegt") },
          { h: x("Three to five measures", "Tri deri në pesë masa", "Drei bis fünf Kennzahlen"), hint: x("each with its definition and its source", "secila me përkufizimin dhe burimin e vet", "jede mit Definition und Quelle") },
          { h: x("The comparison", "Krahasimi", "Der Vergleich"), hint: x("target, last week or last year, for every measure", "objektivi, java ose viti i kaluar, për çdo masë", "Ziel, Vorwoche oder Vorjahr, für jede Kennzahl") },
          { h: x("When it is read", "Kur lexohet", "Wann es gelesen wird"), hint: x("the meeting or the moment, and who leads it", "takimi ose momenti, dhe kush e drejton", "die Besprechung oder der Moment, und wer sie leitet") },
          { h: x("What triggers action", "Çfarë nxit veprim", "Was eine Handlung auslöst"), hint: x("the threshold, who acts, by when", "pragu, kush vepron, deri kur", "die Schwelle, wer handelt, bis wann") },
          { h: x("What we removed", "Çfarë hoqëm", "Was wir entfernt haben"), hint: x("measures that led to no action in a month", "masat që nuk çuan në asnjë veprim brenda një muaji", "Kennzahlen, die in einem Monat zu keiner Handlung führten") },
        ] },
      ],
      note: x(
        "A practice proposed by the editors, after Few's definition of a dashboard (2004, 2017) and his book (2006).",
        "Praktikë e propozuar nga redaksia, sipas përkufizimit të dashboard-it nga Few (2004, 2017) dhe librit të tij (2006).",
        "Eine Praxis, die die Redaktion vorschlägt, nach Fews Definition eines Dashboards (2004, 2017) und seinem Buch (2006)."),
      source: ["few-2017", "few-2006"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
