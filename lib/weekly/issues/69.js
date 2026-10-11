// Management Review, No. 69: Pilots and experiments before the big change. Block: Strategy.
// Facts and their sources: docs/revista/management-review-nr-69.md.
import { x, pc } from "../common.js";

export default {
  number: 69,
  block: "strategy",
  date: x("November 2026", "Nëntor 2026", "November 2026"),
  theme: [x("Pilots and experiments", "Pilotet dhe eksperimentet", "Pilotprojekte und Experimente"), x("before the big change", "para ndryshimit të madh", "vor der großen Veränderung")],
  sub: x(
    "An idea that waited six months, how few tested ideas improve anything, the Model for Improvement, why effects shrink at scale, when to trust a number, and a card for planning a pilot.",
    "Një ide që priti gjashtë muaj, sa pak ide të provuara përmirësojnë diçka, Modeli i Përmirësimit, pse efektet tkurren në shkallë të gjerë, kur t'i besosh një shifre, dhe një kartë për planin e një piloti.",
    "Eine Idee, die sechs Monate wartete, wie wenige getestete Ideen etwas verbessern, das Model for Improvement, warum Effekte im Großen schrumpfen, wann man einer Zahl traut, und eine Karte für den Pilotplan."),
  seo: x(
    "Pilots and experiments: an idea that waited six months, how few ideas work, PDSA, why effects shrink at scale, results you can trust and a pilot card.",
    "Pilotet dhe eksperimentet: një ide që priti gjashtë muaj, sa pak ide funksionojnë, PDSA, pse efektet tkurren, rezultate të besueshme dhe një kartë.",
    "Pilotprojekte und Experimente: eine Idee, die sechs Monate wartete, wenige Treffer, PDSA, warum Effekte schrumpfen, verlässliche Zahlen, eine Karte."),
  feature: x(
    "Issue 69 starts with an idea at Bing that waited more than six months and then raised revenue by 12%, shows how rarely tested ideas improve what they were meant to improve, sets out the three questions and small cycles of the Model for Improvement, asks why effects from published trials shrink when governments run them at scale, lists four checks before a pilot result is trusted, and ends with a card for planning a pilot.",
    "Numri 69 nis me një ide te Bing që priti më shumë se gjashtë muaj dhe pastaj i rriti të ardhurat me 12%, tregon sa rrallë idetë e provuara përmirësojnë atë që synonin, shtjellon tri pyetjet dhe ciklet e vogla të Modelit të Përmirësimit, pyet pse efektet e provave të botuara tkurren kur qeveritë i zbatojnë në shkallë të gjerë, rendit katër kontrolle para se t'i besosh rezultatit të një piloti, dhe mbyllet me një kartë për planin e një piloti.",
    "Ausgabe 69 beginnt mit einer Idee bei Bing, die über sechs Monate wartete und dann den Umsatz um 12 % steigerte, zeigt, wie selten getestete Ideen verbessern, was sie verbessern sollten, stellt die drei Fragen und kleinen Zyklen des Model for Improvement vor, fragt, warum Effekte aus veröffentlichten Studien schrumpfen, wenn Behörden sie im Großen umsetzen, nennt vier Prüfungen, bevor man dem Ergebnis eines Pilots traut, und endet mit einer Karte für die Planung eines Pilots."),
  figure: { n: pc(12), by: "Kohavi & Thomke, 2017", t: x(
    "more revenue at Bing from a small change to ad headlines, an idea that had waited more than six months for someone to test it.",
    "më shumë të ardhura te Bing nga një ndryshim i vogël te titujt e reklamave, një ide që kishte pritur më shumë se gjashtë muaj që dikush ta provonte.",
    "mehr Umsatz bei Bing durch eine kleine Änderung an Anzeigenüberschriften, eine Idee, die über sechs Monate auf einen Test gewartet hatte.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("Six months in a drawer", "Gjashtë muaj në sirtar", "Sechs Monate in der Schublade") },
    { page: "research", kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: x("Why results shrink at scale", "Pse rezultatet tkurren në shkallë të gjerë", "Warum Ergebnisse im Großen schrumpfen") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The pilot plan card", "Karta e planit të pilotit", "Die Karte für den Pilotplan") },
  ],
  sources: ["pilot-kohavi-thomke-2017", "pilot-kohavi-2020", "pilot-thomke-2020", "pilot-langley-2009", "pilot-dellavigna-linos-2022", "pilot-xu-sqr-2018"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Big changes are usually decided on conviction: a plan, a budget, a launch date. This issue is about trying the change small first, against a comparison group and with a decision rule agreed before the start, so that the result decides, not the loudest opinion.",
        "Ndryshimet e mëdha zakonisht vendosen me bindje: një plan, një buxhet, një datë nisjeje. Ky numër flet për ta provuar ndryshimin fillimisht në të vogël, përballë një grupi krahasimi dhe me një rregull vendimi të rënë dakord para nisjes, që të vendosë rezultati, jo mendimi më i zëshëm.",
        "Große Veränderungen werden meist aus Überzeugung beschlossen: ein Plan, ein Budget, ein Starttermin. Diese Ausgabe handelt davon, die Veränderung zuerst im Kleinen zu erproben, mit Vergleichsgruppe und vorab vereinbarter Entscheidungsregel, damit das Ergebnis entscheidet, nicht die lauteste Meinung."),
      body: x(
        "At Bing, a small idea waited more than six months and then raised revenue by 12%. At Microsoft, only one in three tested ideas improved what it was meant to improve. The Model for Improvement tests a change on a small scale: one day, one unit. In 126 government trials, effects were far smaller than in published studies. Four checks show when to trust a result, and a card helps plan the pilot.",
        "Te Bing, një ide e vogël priti më shumë se gjashtë muaj dhe pastaj i rriti të ardhurat me 12%. Te Microsoft, vetëm një nga tri ide të provuara përmirësoi atë që synonte. Modeli i Përmirësimit e provon një ndryshim në të vogël: një ditë, një njësi. Në 126 prova qeveritare, efektet ishin shumë më të vogla se në studimet e botuara. Katër kontrolle tregojnë kur t'i besosh një rezultati, dhe një kartë ndihmon për planin e pilotit.",
        "Bei Bing wartete eine kleine Idee über sechs Monate und steigerte dann den Umsatz um 12 %. Bei Microsoft verbesserte nur jede dritte getestete Idee, was sie verbessern sollte. Das Model for Improvement testet eine Änderung im Kleinen: ein Tag, eine Einheit. In 126 Behördenstudien waren die Effekte viel kleiner als in veröffentlichten Studien. Vier Prüfungen zeigen, wann man einem Ergebnis traut, und eine Karte hilft beim Planen."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("Six months", "Gjashtë muaj", "Sechs Monate"), x("in a drawer", "në sirtar", "in der Schublade")],
      lead: x(
        "In 2012 a Microsoft employee working on the Bing search engine proposed changing how ad headlines were displayed. It would take an engineer a few days, but it was one of hundreds of ideas, and the program managers rated it low priority.",
        "Në 2012, një punonjës i Microsoft-it që punonte për motorin e kërkimit Bing propozoi të ndryshonte mënyrën si shfaqeshin titujt e reklamave. Një inxhinieri do t'i merrte disa ditë, por ishte një nga qindra ide, dhe menaxherët e programit i dhanë përparësi të ulët.",
        "2012 schlug ein Microsoft-Mitarbeiter, der an der Suchmaschine Bing arbeitete, vor, Anzeigenüberschriften anders darzustellen. Ein Entwickler hätte dafür wenige Tage gebraucht, doch es war eine von Hunderten Ideen, und die Programmmanager gaben ihr niedrige Priorität."),
      blocks: [
        { type: "p", text: x(
          "The idea waited more than six months. Then an engineer, seeing how little the code would cost, launched a simple A/B test: users were assigned at random to the old headlines or the new ones. Within hours revenue rose so fast that it set off a “too good to be true” alert. Such alerts usually signal a bug. This time they did not.",
          "Ideja priti më shumë se gjashtë muaj. Pastaj një inxhinier, duke parë sa pak kushtonte kodi, nisi një test të thjeshtë A/B: përdoruesit u ndanë rastësisht mes titujve të vjetër dhe të rinjve. Brenda pak orësh të ardhurat u rritën aq shpejt sa ndezën një alarm “shumë mirë për të qenë e vërtetë”. Zakonisht alarme të tilla tregojnë një gabim në kod. Këtë herë jo.",
          "Die Idee wartete über sechs Monate. Dann startete ein Entwickler, der sah, wie wenig der Code kosten würde, einen einfachen A/B-Test: Die Nutzer wurden zufällig den alten oder den neuen Überschriften zugeteilt. Binnen Stunden stieg der Umsatz so schnell, dass ein Alarm „zu gut, um wahr zu sein“ auslöste. Meist steckt dahinter ein Fehler. Diesmal nicht.") },
        { type: "figures", compact: true, items: [
          { n: "6+", t: x("months the idea waited, rated low priority", "muaj priti ideja, me përparësi të ulët", "Monate wartete die Idee, mit niedriger Priorität") },
          { n: pc(12), t: x("more revenue, without hurting key user-experience metrics", "më shumë të ardhura, pa dëmtuar treguesit kryesorë të përdoruesve", "mehr Umsatz, ohne die wichtigsten Nutzerkennzahlen zu schädigen") },
          { n: x("$100M+", "100+ mln $", "100+ Mio. $"), t: x("a year in the US alone, by the authors' estimate", "në vit vetëm në SHBA, sipas vlerësimit të autorëve", "pro Jahr allein in den USA, nach Schätzung der Autoren") },
        ] },
        { type: "callout", reading: true, text: x(
          "No meeting could have ranked this idea correctly. A cheap test answered in hours what months of setting priorities had not.",
          "Asnjë mbledhje nuk do ta kishte renditur saktë këtë ide. Një test i lirë dha brenda pak orësh përgjigjen që muajt e renditjes së përparësive nuk e kishin dhënë.",
          "Keine Besprechung hätte diese Idee richtig eingestuft. Ein billiger Test beantwortete in Stunden, was monatelanges Priorisieren nicht geschafft hatte.") },
      ],
      note: x(
        "Kohavi and Thomke call it the best revenue-generating idea in Bing's history. The 12% was measured in the test; the $100 million is their annual figure for the US.",
        "Kohavi dhe Thomke e quajnë idenë që solli më shumë të ardhura në historinë e Bing-ut. 12% u mat në test; 100 milionë dollarët janë shifra e tyre vjetore për SHBA-në.",
        "Kohavi und Thomke nennen sie die umsatzstärkste Idee in der Geschichte von Bing. Die 12 % wurden im Test gemessen; die 100 Millionen Dollar sind ihre Jahreszahl für die USA."),
      source: ["pilot-kohavi-thomke-2017"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("Most ideas", "Shumica e ideve", "Die meisten Ideen"), x("do not work", "nuk funksionojnë", "wirken nicht")],
      lead: x(
        "Companies that test almost every change learn the same lesson, write Ron Kohavi and Stefan Thomke: most new ideas fail in experiments, and even experts often misjudge which ones will pay off. At Microsoft as a whole:",
        "Kompanitë që provojnë pothuajse çdo ndryshim mësojnë të njëjtin mësim, shkruajnë Ron Kohavi dhe Stefan Thomke: shumica e ideve të reja dështojnë në eksperimente, dhe edhe ekspertët shpesh gabojnë se cilat do të shpërblejnë. Te Microsoft në tërësi:",
        "Unternehmen, die fast jede Änderung testen, lernen dieselbe Lektion, schreiben Ron Kohavi und Stefan Thomke: Die meisten neuen Ideen scheitern im Experiment, und selbst Fachleute irren oft, welche sich auszahlen. Bei Microsoft insgesamt:"),
      blocks: [
        { type: "people", source: ["pilot-kohavi-thomke-2017"],
          label: x("Ideas tested in experiments at Microsoft, by result", "Idetë e provuara me eksperimente te Microsoft, sipas rezultatit", "In Experimenten getestete Ideen bei Microsoft, nach Ergebnis"),
          groups: [
            { v: 1, tone: "blue", n: x("1 in 3", "1 nga 3", "1 von 3"), t: x("prove effective", "dalin efektive", "erweisen sich als wirksam") },
            { v: 1, tone: "dim", n: x("1 in 3", "1 nga 3", "1 von 3"), t: x("have neutral results", "nuk ndryshojnë asgjë", "bleiben ohne Wirkung") },
            { v: 1, tone: "red", n: x("1 in 3", "1 nga 3", "1 von 3"), t: x("have negative results", "kanë rezultat negativ", "wirken negativ") },
          ] },
        { type: "p", text: x(
          "In well-optimised products such as Google and Bing, only about 10–20% of experiments give positive results; at Slack, about 30% of monetisation experiments (2019). Thomke puts the average at about 10%.",
          "Në produkte të optimizuara mirë si Google dhe Bing, vetëm rreth 10–20% e eksperimenteve japin rezultat pozitiv; te Slack, rreth 30% e eksperimenteve për të ardhurat (2019). Sipas Thomke-s, mesatarja është rreth 10%.",
          "In gut optimierten Produkten wie Google und Bing liefern nur etwa 10–20 % der Experimente positive Ergebnisse, bei Slack etwa 30 % der Experimente zur Monetarisierung (2019). Thomke schätzt den Schnitt auf etwa 10 %.") },
        { type: "callout", reading: true, text: x(
          "If two in three plausible ideas change nothing or make things worse, rolling out a big change untested is a bet, not a decision.",
          "Nëse dy nga tri ide të besueshme nuk ndryshojnë asgjë ose i përkeqësojnë gjërat, të zbatosh një ndryshim të madh pa e provuar është bast, jo vendim.",
          "Wenn zwei von drei plausiblen Ideen nichts ändern oder schaden, ist eine große Veränderung ohne Test eine Wette, keine Entscheidung.") },
      ],
      note: x(
        "Online products, where tests are cheap; for shop floors we found no comparable shares. Slack: a post quoted by Kohavi, Tang & Xu; Thomke's 10%: an interview (2019).",
        "Produkte online, ku testet janë të lira; për repartet e punës nuk gjetëm pjesë të krahasueshme. Slack: një postim që citojnë Kohavi, Tang & Xu; 10% e Thomke-s: një intervistë (2019).",
        "Online-Produkte, in denen Tests billig sind; für Betriebe fanden wir keine vergleichbaren Anteile. Slack: ein Beitrag, zitiert von Kohavi, Tang & Xu; Thomkes 10 %: ein Interview (2019)."),
      source: ["pilot-kohavi-thomke-2017", "pilot-kohavi-2020", "pilot-thomke-2020"],
    },
    {
      id: "model", more: "dmaic-without-a-black-belt",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Three questions,", "Tri pyetje,", "Drei Fragen,"), x("small cycles", "cikle të vogla", "kleine Zyklen")],
      lead: x(
        "The Model for Improvement, from Associates in Process Improvement and set out in The Improvement Guide (Langley and colleagues, 2009), asks three questions before anything is changed for good.",
        "Modeli i Përmirësimit (Model for Improvement), nga Associates in Process Improvement dhe i shtjelluar te The Improvement Guide (Langley dhe kolegët, 2009), bën tri pyetje para se të ndryshohet diçka përgjithmonë.",
        "Das Model for Improvement von Associates in Process Improvement, dargestellt in The Improvement Guide (Langley und Kollegen, 2009), stellt drei Fragen, bevor etwas dauerhaft geändert wird."),
      blocks: [
        { type: "cards", cols: 3, items: [
          { h: x("Aim", "Qëllimi", "Ziel"), p: x("What are we trying to accomplish?", "Çfarë po përpiqemi të arrijmë?", "Was wollen wir erreichen?") },
          { h: x("Measure", "Matja", "Messung"), p: x("How will we know that a change is an improvement?", "Si do ta dimë që një ndryshim është përmirësim?", "Woran erkennen wir, dass eine Änderung eine Verbesserung ist?") },
          { h: x("Change", "Ndryshimi", "Änderung"), p: x("What change can we make that will result in improvement?", "Çfarë ndryshimi mund të bëjmë që të sjellë përmirësim?", "Welche Änderung führt zu einer Verbesserung?") },
        ] },
        { type: "chain", label: x("Testing the change: the Plan-Do-Study-Act cycle", "Provimi i ndryshimit: cikli Plan-Do-Study-Act", "Die Änderung testen: der Zyklus Plan-Do-Study-Act"), items: [
          { h: x("Plan", "Planifiko", "Planen") },
          { h: x("Do", "Bëj", "Tun") },
          { h: x("Study", "Studio", "Studieren") },
          { h: x("Act", "Vepro", "Handeln") },
        ] },
        { type: "p", text: x(
          "Plan the change, try it, study the results, act on what was learned. The test is small on purpose: the Institute for Healthcare Improvement's example is one patient, one day. After several cycles under varying conditions, such as morning and night, the change is made permanent and spread.",
          "Planifiko ndryshimin, provoje, studio rezultatet, vepro sipas asaj që mësove. Prova është e vogël me qëllim: shembulli i Institute for Healthcare Improvement është një pacient, një ditë. Pas disa ciklesh në kushte të ndryshme, si mëngjesi e nata, ndryshimi bëhet i përhershëm dhe shtrihet.",
          "Änderung planen, erproben, Ergebnisse studieren, nach dem Gelernten handeln. Der Test ist bewusst klein: Das Beispiel des Institute for Healthcare Improvement ist ein Patient, ein Tag. Nach mehreren Zyklen unter wechselnden Bedingungen, etwa morgens und nachts, wird die Änderung dauerhaft eingeführt und ausgeweitet.") },
        { type: "callout", reading: true, text: x(
          "A pilot is not a soft launch. It is a question with a deadline: does this change, here, do better than what we do now?",
          "Piloti nuk është një nisje e butë. Është një pyetje me afat: a e bën ky ndryshim, këtu, më mirë se ajo që bëjmë sot?",
          "Ein Pilot ist kein sanfter Start, sondern eine Frage mit Frist: Schneidet diese Änderung hier besser ab als das, was wir heute tun?") },
      ],
      note: x(
        "The questions and steps follow the Institute for Healthcare Improvement's page on the model; the book itself was not seen. The reading is the editors'.",
        "Pyetjet dhe hapat ndjekin faqen e Institute for Healthcare Improvement për modelin; vetë libri nuk u pa. Leximi është i redaksisë.",
        "Fragen und Schritte folgen der Seite des Institute for Healthcare Improvement zum Modell; das Buch selbst lag nicht vor. Die Deutung stammt von der Redaktion."),
      source: ["pilot-langley-2009"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("Why results", "Pse rezultatet", "Warum Ergebnisse"), x("shrink at scale", "tkurren në shkallë të gjerë", "im Großen schrumpfen")],
      lead: x(
        "Stefano DellaVigna and Elizabeth Linos gathered 126 randomised trials with 23 million people, all run by two large “nudge units” in the United States, and compared them with nudge trials published in academic journals.",
        "Stefano DellaVigna dhe Elizabeth Linos mblodhën 126 prova të rastësishme me 23 milionë njerëz, të gjitha të kryera nga dy “njësi nudge” të mëdha në SHBA, dhe i krahasuan me provat nudge të botuara në revista akademike.",
        "Stefano DellaVigna und Elizabeth Linos sammelten 126 randomisierte Studien mit 23 Millionen Menschen, alle von zwei großen „Nudge Units“ in den USA, und verglichen sie mit Nudge-Studien aus Fachzeitschriften."),
      blocks: [
        { type: "columns", max: 10, height: 110, source: ["pilot-dellavigna-linos-2022"],
          label: x("Average effect of a nudge on take-up, percentage points", "Efekti mesatar i një nudge-i te pjesëmarrja, pikë përqindjeje", "Mittlerer Effekt eines Nudges auf die Teilnahme, Prozentpunkte"),
          items: [
            { k: x("In journals", "Në revista", "In Zeitschriften"), v: 8.7, n: x("8.7", "8,7", "8,7") },
            { k: x("At scale", "Në shkallë të gjerë", "Im Großen"), v: 1.4, n: x("1.4", "1,4", "1,4"), alert: true },
          ] },
        { type: "p", text: x(
          "The published trials were small: the median treatment group had 484 people, against 10,006 in the nudge units. Small trials can only detect large effects, and journals mostly print what is detected. Selective publication, made worse by low statistical power, explains about 70% of the gap; differences between the nudges explain most of the rest.",
          "Provat e botuara ishin të vogla: mediana e një grupi trajtimi ishte 484 veta, kundrejt 10.006 te njësitë nudge. Provat e vogla dallojnë vetëm efekte të mëdha, dhe revistat botojnë kryesisht atë që dallohet. Botimi selektiv, i rënduar nga fuqia e ulët statistikore, shpjegon rreth 70% të diferencës; dallimet mes vetë nudge-ve shpjegojnë pjesën më të madhe të mbetjes.",
          "Die veröffentlichten Studien waren klein: Der Median einer Behandlungsgruppe lag bei 484 Personen, in den Nudge Units bei 10.006. Kleine Studien erkennen nur große Effekte, und Zeitschriften drucken vor allem, was erkannt wird. Selektive Veröffentlichung, verstärkt durch geringe statistische Power, erklärt etwa 70 % der Lücke; Unterschiede der Nudges erklären den Großteil des Rests.") },
        { type: "callout", reading: true, text: x(
          "The success story you read about is the one that got published. Plan for the rollout to deliver less than the pilot that convinced you.",
          "Historia e suksesit që lexon është ajo që u botua. Planifiko sikur shtrirja e ndryshimit të japë më pak se piloti që të bindi.",
          "Die Erfolgsgeschichte, die man liest, ist die veröffentlichte. Besser einplanen, dass die Einführung weniger bringt als der Pilot, der überzeugt hat.") },
      ],
      note: x(
        "Take-up: the share who do what is asked, such as enrolling or getting vaccinated. Effects and the 70% from Econometrica (2022); group sizes from the 2020 working paper.",
        "Pjesëmarrja: pjesa e atyre që bëjnë atë që u kërkohet, si regjistrimi ose vaksinimi. Efektet dhe 70% nga Econometrica (2022); madhësitë e grupeve nga versioni i punës i 2020.",
        "Teilnahme: der Anteil derer, die tun, worum gebeten wird, etwa sich anmelden oder impfen lassen. Effekte und die 70 % aus Econometrica (2022); Gruppengrößen aus dem Arbeitspapier von 2020."),
      source: ["pilot-dellavigna-linos-2022"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie man es misst"),
      title: [x("Numbers you", "Shifra që", "Zahlen, denen"), x("can trust", "t'u besosh", "man traut")],
      lead: x(
        "“Getting numbers is easy; getting numbers you can trust is hard,” write Kohavi and Thomke. Four checks before a pilot result decides:",
        "“Të marrësh shifra është e lehtë; të marrësh shifra që mund t'u besosh është e vështirë”, shkruajnë Kohavi dhe Thomke. Katër kontrolle para se të vendosë rezultati i pilotit:",
        "„Zahlen zu bekommen ist leicht; Zahlen, denen man trauen kann, sind schwer“, schreiben Kohavi und Thomke. Vier Prüfungen, bevor ein Pilotergebnis entscheidet:"),
      blocks: [
        { type: "steps", items: [
          { h: x("Compare with a control group", "Krahaso me një grup kontrolli", "Mit einer Kontrollgruppe vergleichen"), p: x("At Yahoo, an observational study put the effect of display ads on brand searches at 871–1,198%; a controlled experiment found 5.4%.", "Te Yahoo, një studim vëzhgues e vlerësoi efektin e reklamave te kërkimet për markën 871–1.198%; një eksperiment i kontrolluar, 5,4%.", "Bei Yahoo bezifferte eine Beobachtungsstudie den Effekt von Werbebannern auf Markensuchen auf 871–1.198 %; ein kontrolliertes Experiment fand 5,4 %.") },
          { h: x("Agree one main measure and guardrails", "Cakto një masë kryesore dhe kufijtë mbrojtës", "Eine Hauptkennzahl und Leitplanken festlegen"), p: x("Before the start, not after; guardrails are what must not get worse.", "Para nisjes, jo pas; kufijtë mbrojtës janë ato që s'duhet të përkeqësohen.", "Vor dem Start, nicht danach; Leitplanken dürfen nicht schlechter werden.") },
          { h: x("Run at least a full week", "Vazhdo të paktën një javë të plotë", "Mindestens eine volle Woche laufen lassen"), p: x("LinkedIn measures for at least a week: a single day over-represents heavy users.", "LinkedIn mat të paktën një javë: një ditë e vetme i mbipërfaqëson përdoruesit më aktivë.", "LinkedIn misst mindestens eine Woche: Ein einzelner Tag überbewertet Vielnutzer.") },
          { h: x("Check the split, doubt the surprise", "Kontrollo ndarjen, dysho për befasinë", "Aufteilung prüfen, Überraschungen misstrauen"), p: x("Unplanned group sizes often void a result. Twyman's law: any figure that looks interesting or different is usually wrong.", "Grupet me madhësi të paplanifikuar shpesh e zhvlerësojnë rezultatin. Ligji i Twyman-it: çdo shifër që duket interesante ose ndryshe zakonisht është e gabuar.", "Falsche Gruppengrößen machen das Ergebnis oft wertlos. Twymans Gesetz: Jede Zahl, die interessant oder anders aussieht, ist meist falsch.") },
        ] },
        { type: "example", label: x("Hypothetical example, a new picking route in a warehouse", "Shembull hipotetik, një rrugë e re mbledhjeje në një magazinë", "Hypothetisches Beispiel, eine neue Kommissionierroute im Lager"), rows: [
          { k: x("Comparison", "Krahasimi", "Vergleich"), v: x("zone A new route, zone B as before, the same two weeks", "zona A me rrugën e re, zona B si më parë, po ato dy javë", "Zone A neue Route, Zone B wie bisher, dieselben zwei Wochen") },
          { k: x("Main measure", "Masa kryesore", "Hauptkennzahl"), v: x("lines picked per hour: A +6%, B +4%", "rreshta të mbledhur në orë: A +6%, B +4%", "Positionen pro Stunde: A +6 %, B +4 %") },
          { k: x("Guardrail", "Kufiri mbrojtës", "Leitplanke"), v: x("picking errors: unchanged in both", "gabimet e mbledhjes: të pandryshuara në të dyja", "Pickfehler: in beiden unverändert") },
        ], text: x("Against zone B, the route is worth about 2 points, not 6. The numbers are invented.", "Përballë zonës B, rruga vlen rreth 2 pikë, jo 6. Numrat janë të shpikur.", "Gegenüber Zone B bringt die Route etwa 2 Punkte, nicht 6. Die Zahlen sind erfunden.") },
      ],
      note: x(
        "Checks after Kohavi & Thomke (2017), Kohavi, Tang & Xu (2020) and, for the week, Xu et al. (2018). The example is the editors'.",
        "Kontrollet sipas Kohavi & Thomke (2017), Kohavi, Tang & Xu (2020) dhe, për javën, Xu et al. (2018). Shembulli është i redaksisë.",
        "Prüfungen nach Kohavi & Thomke (2017), Kohavi, Tang & Xu (2020) und, für die Woche, Xu et al. (2018). Das Beispiel stammt von der Redaktion."),
      source: ["pilot-kohavi-thomke-2017", "pilot-kohavi-2020", "pilot-xu-sqr-2018"],
    },
    {
      id: "tool", tool: "/tools/sigma-control-chart/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The pilot", "Karta e planit", "Die Karte für"), x("plan card", "të pilotit", "den Pilotplan")],
      lead: x(
        "Fill it in before the start, with those who will run the pilot. Then roll out in steps: a small group first, a measuring stage, then everyone.",
        "Plotësoje para nisjes, me ata që do ta drejtojnë pilotin. Pastaj shtrije me hapa: fillimisht një grup i vogël, një fazë matjeje, pastaj të gjithë.",
        "Vor dem Start ausfüllen, mit denen, die den Pilot durchführen. Dann in Stufen einführen: erst eine kleine Gruppe, dann eine Messphase, dann alle."),
      blocks: [
        { type: "form", items: [
          { h: x("Hypothesis", "Hipoteza", "Hypothese"), hint: x("if we change X, Y improves by about Z, because …", "nëse ndryshojmë X, Y përmirësohet rreth Z, sepse …", "wenn wir X ändern, verbessert sich Y um etwa Z, weil …") },
          { h: x("What changes", "Çfarë ndryshon", "Was sich ändert"), hint: x("one change, so clear that anyone could repeat it", "një ndryshim, aq i qartë sa ta përsëriste kushdo", "eine Änderung, so klar, dass jeder sie wiederholen kann") },
          { h: x("Where and how long", "Ku dhe sa gjatë", "Wo und wie lange"), hint: x("one area, shift or team; at least a full normal week", "një zonë, turn ose ekip; të paktën një javë e plotë normale", "ein Bereich, eine Schicht, ein Team; mindestens eine normale Woche") },
          { h: x("What is measured", "Çfarë matet", "Was gemessen wird"), hint: x("one main measure, how it is counted, and the guardrails", "një masë kryesore, si numërohet, dhe kufijtë mbrojtës", "eine Hauptkennzahl, wie sie gezählt wird, und die Leitplanken") },
          { h: x("Comparison group", "Grupi i krahasimit", "Vergleichsgruppe"), hint: x("where the current way goes on, the same days", "ku vazhdon mënyra e sotme, në të njëjtat ditë", "wo es an denselben Tagen weiterläuft wie bisher") },
          { h: x("Decision rule", "Rregulli i vendimit", "Entscheidungsregel"), hint: x("set before the start: roll out, adjust or stop, and who decides", "i caktuar para nisjes: shtrije, ndryshoje ose ndale, dhe kush vendos", "vor dem Start: einführen, anpassen oder stoppen, und wer entscheidet"), lines: 2 },
        ] },
      ],
      note: x(
        "A practice proposed by the editors, after the Model for Improvement, Xu et al. (2018) and Thomke's rule: a testable hypothesis, a control group, and abiding by the results.",
        "Praktikë e propozuar nga redaksia, sipas Modelit të Përmirësimit, Xu et al. (2018) dhe rregullit të Thomke-s: një hipotezë që provohet, një grup kontrolli, dhe t'u përmbahesh rezultateve.",
        "Eine Praxis, die die Redaktion vorschlägt, nach dem Model for Improvement, Xu et al. (2018) und Thomkes Regel: eine prüfbare Hypothese, eine Kontrollgruppe und sich an die Ergebnisse halten."),
      source: ["pilot-langley-2009", "pilot-xu-sqr-2018", "pilot-thomke-2020"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
