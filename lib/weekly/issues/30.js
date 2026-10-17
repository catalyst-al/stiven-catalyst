// Management Review, No. 30: Data quality. Block: AI.
// Facts and their sources: docs/revista/management-review-nr-30.md.
import { x, pc } from "../common.js";

export default {
  number: 30,
  block: "ai",
  date: x("October 2026", "Tetor 2026", "Oktober 2026"),
  theme: [x("The quality", "Cilësia", "Die Qualität"), x("of data", "e të dhënave", "der Daten")],
  sub: x(
    "How many new records carry an error, what bad data costs, six dimensions of quality, data cascades and wrong labels in AI, and a card for measuring your data in one afternoon.",
    "Sa regjistrime të reja kanë gabim, sa kushtojnë të dhënat e këqija, gjashtë dimensionet e cilësisë, kaskadat dhe etiketat e gabuara në AI dhe një kartë për ta matur cilësinë në një pasdite.",
    "Wie viele neue Datensätze einen Fehler haben, was schlechte Daten kosten, sechs Dimensionen der Qualität, Datenkaskaden und falsche Labels in der KI und eine Karte, um Daten an einem Nachmittag zu messen."),
  seo: x(
    "Data quality: 47% of new records with a critical error, what bad data costs, six dimensions, wrong labels in AI test sets and a card.",
    "Cilësia e të dhënave: 47% e regjistrimeve të reja me gabim kritik, sa kushtojnë të dhënat e këqija, gjashtë dimensione, etiketat e gabuara në AI dhe një kartë.",
    "Datenqualität: 47 % der neuen Datensätze mit kritischem Fehler, was schlechte Daten kosten, sechs Dimensionen, falsche Labels in KI-Testdaten und eine Karte."),
  feature: x(
    "Issue 30 opens with 75 managers who checked the newest records of their own units and found a critical error in 47% of them. It weighs what bad data costs and how little of that cost is measured, then sets out six dimensions of data quality. Data cascades and wrong labels in AI come next, and a card for measuring data in one afternoon closes the issue.",
    "Numri 30 hapet me 75 drejtues që kontrolluan regjistrimet më të reja të njësive të tyre dhe gjetën gabim kritik te 47% e tyre. Peshon sa kushtojnë të dhënat e këqija dhe sa pak matet kjo kosto, pastaj shtjellon gjashtë dimensionet e cilësisë së të dhënave. Vijnë kaskadat e të dhënave dhe etiketat e gabuara në AI, ndërsa në fund një kartë për t'i matur të dhënat në një pasdite.",
    "Ausgabe 30 beginnt mit 75 Führungskräften, die die neuesten Datensätze ihrer eigenen Einheiten prüften und in 47 % davon einen kritischen Fehler fanden. Sie wägt ab, was schlechte Daten kosten und wie wenig davon gemessen wird, und stellt sechs Dimensionen der Datenqualität vor. Es folgen Datenkaskaden und falsche Labels in der KI, zum Schluss eine Karte, mit der Sie Ihre Daten an einem Nachmittag messen."),
  figure: { n: pc(47), by: "Nagle, Redman & Sammon, 2017", t: x(
    "of newly created records had at least one critical error, on average, in 75 checks that managers ran on their own units.",
    "e regjistrimeve të krijuara rishtazi kishin të paktën një gabim kritik, mesatarisht, në 75 kontrolle që drejtuesit bënë në njësitë e tyre.",
    "der neu angelegten Datensätze hatten im Schnitt mindestens einen kritischen Fehler, in 75 Prüfungen, die Führungskräfte in ihren eigenen Einheiten durchführten.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("47 out of 100 new records", "47 nga 100 regjistrime të reja", "47 von 100 neuen Datensätzen") },
    { page: "model", kicker: x("The model", "Modeli", "Das Modell"),
      title: x("Six dimensions of quality", "Gjashtë dimensionet e cilësisë", "Sechs Dimensionen der Qualität") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The data quality card", "Karta e cilësisë së të dhënave", "Die Karte zur Datenqualität") },
  ],
  sources: ["nagle-redman-sammon-2017", "destatis-ki-2025", "sambasivan-2021", "northcutt-2021", "redman-2016", "gartner-ai-ready-2025", "gartner-dq-2021", "dama-uk-2013"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Every report, KPI and AI model is only as good as the records behind it. How many of those records are wrong, what does that cost, and how can a team find out in one afternoon?",
        "Çdo raport, KPI dhe model AI vlen aq sa regjistrimet që ka pas. Sa prej tyre janë të gabuara, sa kushton kjo dhe si mund ta zbulojë një ekip në një pasdite?",
        "Jeder Bericht, jede Kennzahl und jedes KI-Modell ist nur so gut wie die Datensätze dahinter. Wie viele davon sind falsch, was kostet das, und wie findet ein Team es an einem Nachmittag heraus?"),
      body: x(
        "When 75 managers checked the newest records of their own units, 47% had at least one critical error on average, and fewer than 3% of the scores met the bar they set themselves. Estimates of the cost run from Gartner's $12.9 million a year per organisation to IBM's $3.1 trillion for the US, neither with a visible method. In AI, 92% of 53 practitioners interviewed had met a data cascade, and the test sets of widely used benchmarks hold at least 3.3% wrong labels on average.",
        "Kur 75 drejtues kontrolluan regjistrimet më të reja të njësive të tyre, 47% kishin mesatarisht të paktën një gabim kritik, ndërsa më pak se 3% e rezultateve e arritën pragun që kishin vënë vetë. Vlerësimet e kostos shkojnë nga 12,9 milionë dollarë në vit për organizatë sipas Gartner-it deri në 3.100 miliardë dollarë për SHBA-në sipas IBM-it, asnjëra me metodë të dukshme. Në AI, 92% e 53 praktikuesve të intervistuar kishin hasur një kaskadë të dhënash, ndërsa grupet e testimit të disa testeve krahasuese (benchmark) të përdorura gjerësisht kanë mesatarisht të paktën 3,3% etiketa të gabuara.",
        "Als 75 Führungskräfte die neuesten Datensätze ihrer eigenen Einheiten prüften, hatten im Schnitt 47 % mindestens einen kritischen Fehler, und weniger als 3 % der Werte erreichten die selbst gesetzte Schwelle. Kostenschätzungen reichen von Gartners 12,9 Millionen Dollar pro Jahr und Organisation bis zu IBMs 3,1 Billionen Dollar für die USA, keine mit erkennbarer Methode. In der KI hatten 92 % von 53 befragten Fachleuten eine Datenkaskade erlebt, und die Testdaten verbreiteter Benchmarks enthalten im Schnitt mindestens 3,3 % falsche Labels."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("47 out of 100", "47 nga 100", "47 von 100"), x("new records", "regjistrime të reja", "neuen Datensätzen")],
      lead: x(
        "Over two years, 75 managers ran the same test on their own units: they took the last 100 records their teams had completed and counted those without a critical error, one that affects the work.",
        "Gjatë dy vjetëve, 75 drejtues bënë të njëjtën provë në njësitë e tyre: morën 100 regjistrimet e fundit që kishin plotësuar ekipet e tyre dhe numëruan ato pa asnjë gabim kritik, pra gabim që ndikon në punë.",
        "Innerhalb von zwei Jahren machten 75 Führungskräfte denselben Test in ihren eigenen Einheiten: Sie nahmen die letzten 100 Datensätze, die ihre Teams abgeschlossen hatten, und zählten die ohne kritischen Fehler, also ohne Fehler, der die Arbeit beeinträchtigt."),
      blocks: [
        { type: "donut", v: 47, n: pc(47), alert: true, source: ["nagle-redman-sammon-2017"], t: x(
          "of newly created records had at least one critical error, on average.",
          "e regjistrimeve të krijuara rishtazi kishin mesatarisht të paktën një gabim kritik.",
          "der neu angelegten Datensätze hatten im Schnitt mindestens einen kritischen Fehler.") },
        { type: "p", text: x(
          "Asked how good the data had to be, no manager called a score below the high nineties acceptable, and fewer than 3% of the scores reached that bar. The scores ranged from 0 to 99, and the authors found no meaningful differences between industries.",
          "Të pyetur sa të mira duhej të ishin të dhënat, asnjë drejtues nuk quajti të pranueshëm një rezultat nën nëntëdhjetat e larta, dhe më pak se 3% e rezultateve e arritën këtë prag. Rezultatet shkonin nga 0 deri në 99 dhe autorët nuk gjetën dallime domethënëse mes industrive.",
          "Gefragt, wie gut die Daten sein müssten, nannte keine Führungskraft einen Wert unter den hohen Neunzigern akzeptabel, und weniger als 3 % der Werte erreichten diese Schwelle. Die Werte reichten von 0 bis 99, und die Autoren fanden keine nennenswerten Unterschiede zwischen Branchen.") },
        { type: "callout", reading: true, text: x(
          "The test takes an afternoon and needs no software. The hard part is looking at the records your own team made.",
          "Prova merr një pasdite dhe nuk kërkon softuer. Pjesa e vështirë është të shikosh regjistrimet që bëri vetë ekipi yt.",
          "Der Test dauert einen Nachmittag und braucht keine Software. Schwer ist nur, sich die Datensätze anzusehen, die Ihr eigenes Team angelegt hat.") },
      ],
      note: x(
        "75 measurements by managers in their own units: a small, unrepresentative sample. The bar was the managers' own, and the 3% is a share of measurements; companies were not counted.",
        "75 matje të drejtuesve në njësitë e tyre: mostër e vogël dhe jopërfaqësuese. Pragun e vunë vetë drejtuesit, ndërsa 3% është pjesë e matjeve; kompanitë nuk u numëruan.",
        "75 Messungen von Führungskräften in ihren eigenen Einheiten: eine kleine, nicht repräsentative Stichprobe. Die Schwelle setzten die Führungskräfte selbst, und die 3 % beziehen sich auf Messungen; Unternehmen wurden nicht gezählt."),
      source: ["nagle-redman-sammon-2017"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("What bad data", "Sa kushtojnë", "Was schlechte"), x("costs", "të dhënat e këqija", "Daten kosten")],
      lead: x(
        "Nobody has measured the full cost of poor data. What exists are estimates and rules of thumb, worth reading together with their caveats.",
        "Koston e plotë të të dhënave të këqija nuk e ka matur askush. Ka vlerësime dhe rregulla empirike, që duhen lexuar bashkë me kufizimet e tyre.",
        "Die vollen Kosten schlechter Daten hat niemand gemessen. Es gibt Schätzungen und Faustregeln, die Sie nur zusammen mit ihren Vorbehalten lesen sollten."),
      blocks: [
        { type: "figures", compact: true, items: [
          { n: x("$12.9m", "12,9 mln $", "12,9 Mio. $"), t: x("a year: Gartner's average cost of poor data quality per organisation (2021)", "në vit: kostoja mesatare e cilësisë së dobët të të dhënave për organizatë sipas Gartner-it (2021)", "pro Jahr: Gartners durchschnittliche Kosten schlechter Datenqualität je Organisation (2021)") },
          { n: pc(50), t: x("of knowledge workers' time lost in hidden data factories, by Redman's estimate", "e kohës së punonjësve të dijes humbet në fabrikat e fshehura të të dhënave, vlerëson Redman", "der Zeit von Wissensarbeitern gehen laut Redman in versteckten Datenfabriken verloren") },
          { n: pc(44), t: x("of German firms that considered AI but do not use it cite the availability or quality of data (2025)", "e firmave gjermane që e shqyrtuan AI-në, por nuk e përdorin, përmendin disponueshmërinë ose cilësinë e të dhënave (2025)", "der deutschen Unternehmen, die KI erwogen, aber nicht nutzen, nennen Verfügbarkeit oder Qualität der Daten (2025)") },
        ] },
        { type: "columns", height: 100, source: ["nagle-redman-sammon-2017"],
          label: x("Cost of 100 units of work at $1 each, by Redman's rule of ten ($)", "Kostoja e 100 njësive pune me 1 dollar secila, sipas rregullit të dhjetës të Redman-it ($)", "Kosten von 100 Arbeitseinheiten zu je 1 Dollar nach Redmans Zehnerregel ($)"),
          items: [
            { k: x("All data clean", "Të gjitha të pastra", "Alle Daten sauber"), v: 100, n: "100" },
            { k: x("11 records flawed", "11 regjistrime me gabim", "11 Datensätze fehlerhaft"), v: 199, n: "199", alert: true },
          ] },
        { type: "p", text: x(
          "Redman calls the extra steps a team adds to cope with errors made upstream hidden data factories, and his rule of ten says flawed data make a unit of work cost ten times as much. Both are his estimates; neither was measured. The best-known figure, $3.1 trillion a year for the US in 2016, was IBM's; Redman later wrote that it could be off by a trillion dollars either way.",
          "Redman i quan fabrika të fshehura të të dhënave hapat shtesë që shton një ekip për të përballuar gabimet e bëra më lart në zinxhir, dhe rregulli i tij i dhjetës thotë se të dhënat me gabime bëjnë një njësi pune dhjetë herë më të shtrenjtë. Të dyja janë vlerësime të tij; asnjëra nuk është matur. Shifra më e njohur, 3.100 miliardë dollarë në vit për SHBA-në në vitin 2016, ishte e IBM-it; Redman-i shkroi më vonë se mund të jetë gabim me një mijë miliardë dollarë, në njërin ose në tjetrin drejtim.",
          "Redman nennt die zusätzlichen Schritte, mit denen ein Team Fehler von weiter vorn auffängt, versteckte Datenfabriken, und seine Zehnerregel besagt, dass fehlerhafte Daten eine Arbeitseinheit zehnmal so teuer machen. Beides sind seine Schätzungen; gemessen wurde keine davon. Die bekannteste Zahl, 3,1 Billionen Dollar pro Jahr für die USA im Jahr 2016, stammte von IBM; Redman schrieb später, sie könne in beide Richtungen um eine Billion danebenliegen.") },
      ],
      note: x(
        "These are estimates, so do not add them up or compare them. Gartner does not show how it reached its average; the German figure is a reason firms report and measures no data quality.",
        "Këto janë vlerësime, prandaj nuk duhen mbledhur e as krahasuar. Gartner-i nuk tregon si e nxori mesataren; shifra gjermane është arsye që e deklarojnë vetë firmat dhe nuk mat cilësinë e të dhënave.",
        "Es sind Schätzungen; addieren oder vergleichen Sie sie deshalb nicht. Gartner zeigt nicht, wie der Durchschnitt zustande kam; die deutsche Zahl ist ein Grund, den Firmen selbst angeben, und misst keine Datenqualität."),
      source: ["gartner-dq-2021", "redman-2016", "destatis-ki-2025", "nagle-redman-sammon-2017"],
    },
    {
      id: "model", more: "mistakes-get-lost-between-departments",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Six dimensions", "Gjashtë dimensionet", "Sechs Dimensionen"), x("of quality", "e cilësisë", "der Qualität")],
      lead: x(
        "In 2013 a working group of DAMA UK, the data management association, named six primary dimensions for assessing data quality. The UK government adopted them in its 2020 data quality framework.",
        "Në vitin 2013, një grup pune i DAMA UK, shoqatës për menaxhimin e të dhënave, emërtoi gjashtë dimensione kryesore për të vlerësuar cilësinë e të dhënave. Qeveria britanike i mori në kornizën e saj të cilësisë së të dhënave në vitin 2020.",
        "2013 benannte eine Arbeitsgruppe von DAMA UK, dem Verband für Datenmanagement, sechs Hauptdimensionen zur Bewertung der Datenqualität. Die britische Regierung übernahm sie 2020 in ihr Rahmenwerk."),
      blocks: [
        { type: "cards", cols: 3, items: [
          { h: x("Completeness", "Plotësia", "Vollständigkeit"), p: x("nothing that should be there is missing", "nuk mungon asgjë që duhet të jetë", "nichts fehlt, was da sein sollte") },
          { h: x("Uniqueness", "Veçantia", "Eindeutigkeit"), p: x("no record appears twice", "asnjë regjistrim nuk del dy herë", "kein Datensatz kommt doppelt vor") },
          { h: x("Timeliness", "Aktualiteti", "Aktualität"), p: x("changes at the source show up quickly where the data are used", "ndryshimet në burim shfaqen shpejt aty ku përdoren të dhënat", "Änderungen an der Quelle kommen schnell bei den Nutzern an") },
          { h: x("Validity", "Vlefshmëria", "Gültigkeit"), p: x("values fit the agreed format and rules", "vlerat përputhen me formatin dhe rregullat e rëna dakord", "Werte entsprechen dem vereinbarten Format und den Regeln") },
          { h: x("Accuracy", "Saktësia", "Genauigkeit"), p: x("the data reflect reality", "të dhënat pasqyrojnë realitetin", "die Daten bilden die Wirklichkeit ab") },
          { h: x("Consistency", "Konsistenca", "Konsistenz"), p: x("the data agree across sources, which does not make them accurate", "të dhënat përputhen mes burimeve, gjë që nuk i bën të sakta", "Quellen stimmen überein, was die Daten noch nicht richtig macht") },
        ] },
        { type: "p", text: x(
          "For AI, Gartner sets a different test: data are AI-ready when they represent the use case, including the patterns, errors and outliers a model needs. In a 2024 Gartner survey of 1,203 data management leaders, 63% said their organisation did not have, or was not sure it had, the right data practices for AI.",
          "Për AI-në, Gartner-i vë një provë tjetër: të dhënat janë gati për AI kur përfaqësojnë rastin e përdorimit, bashkë me rregullsitë, gabimet dhe vlerat e skajshme që i duhen modelit. Në një anketë të Gartner-it të vitit 2024 me 1.203 drejtues të menaxhimit të të dhënave, 63% thanë se organizata e tyre nuk i ka, ose s'është e sigurt se i ka, praktikat e duhura të të dhënave për AI.",
          "Für KI setzt Gartner einen anderen Maßstab: Daten sind KI-tauglich, wenn sie den Anwendungsfall abbilden, samt den Mustern, Fehlern und Ausreißern, die ein Modell braucht. In einer Gartner-Umfrage von 2024 unter 1.203 Datenverantwortlichen sagten 63 %, ihrer Organisation fehlten die richtigen Datenpraktiken für KI oder sie wüssten es nicht.") },
        { type: "callout", reading: true, text: x(
          "Clean and fit for use are two different things. Always ask: good enough for what?",
          "E pastër dhe e përshtatshme për përdorim janë dy gjëra të ndryshme. Pyet gjithmonë: mjaftueshëm e mirë për çfarë?",
          "Sauber und brauchbar sind zweierlei. Fragen Sie immer: gut genug wofür?") },
      ],
      note: x(
        "The definitions condense the DAMA UK document; DAMA-DMBOK and other sources give longer lists. The 63% is a self-report.",
        "Përkufizimet përmbledhin dokumentin e DAMA UK; DAMA-DMBOK dhe burime të tjera japin lista më të gjata. 63% është vetëdeklarim.",
        "Die Definitionen verdichten das DAMA-UK-Dokument; DAMA-DMBOK und andere Quellen nennen längere Listen. Die 63 % sind eine Selbstauskunft."),
      source: ["dama-uk-2013", "gartner-ai-ready-2025"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("Everyone wants", "Të gjithë duan", "Alle wollen"), x("the model work", "punën me modelin", "die Modellarbeit")],
      lead: x(
        "Nithya Sambasivan and colleagues at Google interviewed 53 practitioners who build AI for high-stakes uses in India, East and West Africa and the US. 92% had met at least one data cascade: a data problem that compounds and harms results further down the line.",
        "Nithya Sambasivan dhe kolegët e saj në Google intervistuan 53 praktikues që ndërtojnë AI për përdorime me rrezik të lartë në Indi, në Afrikën Lindore e Perëndimore dhe në SHBA. 92% kishin hasur të paktën një kaskadë të dhënash: një problem të dhënash që grumbullohet dhe dëmton rezultatet më poshtë në zinxhir.",
        "Nithya Sambasivan und Kollegen bei Google befragten 53 Fachleute, die KI für folgenreiche Einsätze in Indien, Ost- und Westafrika und den USA entwickeln. 92 % hatten mindestens eine Datenkaskade erlebt: ein Datenproblem, das sich aufschaukelt und weiter hinten in der Kette den Ergebnissen schadet."),
      blocks: [
        { type: "hbars", max: 12, source: ["northcutt-2021"],
          label: x("Wrong labels in the test sets of widely used benchmarks (%)", "Etiketa të gabuara në grupet e testimit të testeve krahasuese të përdorura gjerësisht (%)", "Falsche Labels in den Testdaten verbreiteter Benchmarks (%)"),
          items: [
            { k: "MNIST", v: 0.15, n: x("0.15", "0,15", "0,15") },
            { k: x("Average of 10 datasets", "Mesatarja e 10 grupeve", "Durchschnitt von 10 Datensammlungen"), v: 3.3, n: x("3.3", "3,3", "3,3") },
            { k: x("ImageNet validation set", "ImageNet, grupi i validimit", "ImageNet, Validierungsdaten"), v: 6, n: "6" },
            { k: "QuickDraw", v: 10.12, n: x("10.12", "10,12", "10,12"), alert: true },
          ] },
        { type: "p", text: x(
          "Curtis Northcutt, Anish Athalye and Jonas Mueller found at least 3.3% wrong labels on average in the test sets of ten widely used datasets of images, text and audio. Such errors can reverse the ranking of models: on ImageNet, the smaller ResNet-18 beats ResNet-50 if the share of originally mislabelled test examples rises by just 6%.",
          "Curtis Northcutt, Anish Athalye dhe Jonas Mueller gjetën mesatarisht të paktën 3,3% etiketa të gabuara në grupet e testimit të dhjetë grupeve të përdorura gjerësisht me imazhe, tekst dhe audio. Gabime të tilla mund ta përmbysin renditjen e modeleve: te ImageNet, ResNet-18 më i vogël del më mirë se ResNet-50 nëse pjesa e shembujve të testimit me etiketë fillimisht të gabuar rritet me vetëm 6%.",
          "Curtis Northcutt, Anish Athalye und Jonas Mueller fanden in den Testdaten von zehn verbreiteten Datensammlungen mit Bildern, Text und Audio im Schnitt mindestens 3,3 % falsche Labels. Solche Fehler können die Rangfolge von Modellen umkehren: Bei ImageNet schlägt das kleinere ResNet-18 das ResNet-50, wenn der Anteil ursprünglich falsch beschrifteter Testbeispiele um nur 6 % steigt.") },
        { type: "callout", reading: true, text: x(
          "A model is judged against data, so wrong data mean a wrong judgment.",
          "Një model gjykohet mbi të dhënat, ndaj të dhëna të gabuara japin gjykim të gabuar.",
          "Ein Modell wird an Daten gemessen; falsche Daten ergeben ein falsches Urteil.") },
      ],
      note: x(
        "The interviews cover 53 people and are not a representative survey; the test sets are public and come from no company. Versions of the paper give 3.3% or 3.4%.",
        "Intervistat përfshijnë 53 veta dhe nuk janë anketë përfaqësuese; grupet e testimit janë publike dhe nuk vijnë nga ndonjë kompani. Versionet e punimit japin 3,3% ose 3,4%.",
        "Die Interviews umfassen 53 Personen und sind keine repräsentative Umfrage; die Testdaten sind öffentlich und stammen aus keinem Unternehmen. Fassungen der Studie nennen 3,3 % oder 3,4 %."),
      source: ["sambasivan-2021", "northcutt-2021"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie es gemessen wird"),
      title: [x("The Friday afternoon", "Matja e së premtes", "Die Messung am"), x("measurement", "pasdite", "Freitagnachmittag")],
      lead: x(
        "The method of Nagle, Redman and Sammon needs no software: a team, an afternoon and the last 100 records it completed.",
        "Metoda e Nagle-it, Redman-it dhe Sammon-it nuk kërkon softuer: një ekip, një pasdite dhe 100 regjistrimet e fundit që ka plotësuar.",
        "Die Methode von Nagle, Redman und Sammon braucht keine Software: ein Team, einen Nachmittag und die letzten 100 Datensätze, die es abgeschlossen hat."),
      blocks: [
        { type: "steps", items: [
          { h: x("Take the last 100 records", "Merr 100 regjistrimet e fundit", "Nehmen Sie die letzten 100 Datensätze"), p: x("the ones your unit completed most recently", "ato që njësia jote plotësoi së fundi", "die zuletzt in Ihrer Einheit abgeschlossen wurden") },
          { h: x("Pick the 10–15 most important fields", "Zgjidh 10–15 fushat më të rëndësishme", "Wählen Sie die 10–15 wichtigsten Felder"), p: x("the ones the next step depends on", "ato nga të cilat varet hapi tjetër", "die, von denen der nächste Schritt abhängt") },
          { h: x("Mark every visible error", "Shëno çdo gabim të dukshëm", "Markieren Sie jeden sichtbaren Fehler"), p: x("record by record, with people who know the data", "regjistrim pas regjistrimi, me njerëz që i njohin të dhënat", "Datensatz für Datensatz, mit Menschen, die die Daten kennen") },
          { h: x("Count the error-free records", "Numëro regjistrimet pa gabim", "Zählen Sie die fehlerfreien Datensätze"), p: x("that number, from 0 to 100, is the score", "ky numër, nga 0 deri në 100, është rezultati", "diese Zahl von 0 bis 100 ist der Wert") },
        ] },
        { type: "example", label: x("Hypothetical example, 100 customer orders", "Shembull hipotetik, 100 porosi klientësh", "Hypothetisches Beispiel, 100 Kundenaufträge"), rows: [
          { k: x("Errors", "Gabimet", "Fehler"), v: x("wrong address in 9, no phone number in 14, wrong quantity in 5; 4 orders have two errors", "adresë e gabuar te 9, pa numër telefoni te 14, sasi e gabuar te 5; 4 porosi kanë dy gabime", "falsche Adresse bei 9, keine Telefonnummer bei 14, falsche Menge bei 5; 4 Aufträge haben zwei Fehler") },
          { k: x("Score", "Rezultati", "Wert"), v: x("24 orders have an error, 76 are clean: score 76", "24 porosi kanë gabim, 76 janë të pastra: rezultati 76", "24 Aufträge sind fehlerhaft, 76 sind sauber: Wert 76") },
          { k: x("Rule of ten", "Rregulli i 10", "Zehnerregel"), v: x("$100 of work costs 76 + 24 × 10 = $316", "puna prej 100 $ kushton 76 + 24 × 10 = 316 $", "Arbeit für 100 $ kostet 76 + 24 × 10 = 316 $") },
        ], text: x("Orders and errors alike are made up.", "Si porositë, ashtu edhe gabimet janë të sajuara.", "Aufträge wie Fehler sind frei erfunden.") },
      ],
      note: x(
        "The steps follow Nagle, Redman & Sammon (2017); the rule of ten is Redman's rule of thumb; the example is the editors'.",
        "Hapat ndjekin Nagle, Redman & Sammon (2017); rregulli i dhjetës është rregull empirik i Redman-it; shembulli është i redaksisë.",
        "Die Schritte folgen Nagle, Redman & Sammon (2017); die Zehnerregel ist Redmans Faustregel; das Beispiel stammt von der Redaktion."),
      source: ["nagle-redman-sammon-2017"],
    },
    {
      id: "tool", tool: "/tools/pareto/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The data quality", "Karta e cilësisë", "Die Karte zur"), x("card", "së të dhënave", "Datenqualität")],
      lead: x(
        "One card per check, once a month. Count the errors by field, then sort them: a few fields usually carry most of them.",
        "Një kartë për çdo kontroll, një herë në muaj. Numëro gabimet sipas fushës, pastaj renditi: zakonisht pak fusha mbajnë shumicën e tyre.",
        "Eine Karte pro Prüfung, einmal im Monat. Zählen Sie die Fehler je Feld und sortieren Sie sie dann: Meist entfällt der Großteil auf wenige Felder."),
      blocks: [
        { type: "form", items: [
          { h: x("Records checked", "Regjistrimet e kontrolluara", "Geprüfte Datensätze"), hint: x("which 100, from which step, on which date", "cilat 100, nga cili hap, në cilën datë", "welche 100, aus welchem Schritt, an welchem Tag") },
          { h: x("Critical fields", "Fushat kritike", "Kritische Felder"), hint: x("the 10–15 fields the next step depends on", "10–15 fushat nga të cilat varet hapi tjetër", "die 10–15 Felder, von denen der nächste Schritt abhängt") },
          { h: x("Errors by field", "Gabimet sipas fushës", "Fehler je Feld"), hint: x("missing, wrong, duplicate or out of date", "mungon, e gabuar, e dyfishtë apo e vjetruar", "fehlend, falsch, doppelt oder veraltet") },
          { h: x("Score", "Rezultati", "Wert"), hint: x("error-free records out of 100", "regjistrime pa gabim nga 100", "fehlerfreie Datensätze von 100") },
          { h: x("Where errors start", "Ku nisin gabimet", "Wo Fehler entstehen"), hint: x("the step or system where most are created", "hapi ose sistemi ku krijohen më shumë", "der Schritt oder das System, wo die meisten entstehen") },
          { h: x("Fix at the source", "Ndreqe në burim", "An der Quelle beheben"), hint: x("one change, who, by when; measure again next month", "një ndryshim, kush, deri kur; mate sërish muajin tjetër", "eine Änderung, wer, bis wann; im nächsten Monat neu messen") },
        ] },
      ],
      note: x(
        "Suggested by the editors, after the Friday afternoon measurement (2017) and the DAMA UK dimensions (2013).",
        "Sugjerim i redaksisë, sipas matjes së së premtes pasdite (2017) dhe dimensioneve të DAMA UK (2013).",
        "Von der Redaktion vorgeschlagen, nach der Freitagnachmittags-Messung (2017) und den DAMA-UK-Dimensionen (2013)."),
      source: ["nagle-redman-sammon-2017", "dama-uk-2013"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
