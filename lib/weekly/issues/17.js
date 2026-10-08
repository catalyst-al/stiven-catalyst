// Management Review, No. 17: The Balanced Scorecard after 30 years. Block: KPIs.
// Facts and their sources: docs/revista/management-review-nr-17.md.
import { x, pc } from "../common.js";

export default {
  number: 17,
  block: "kpi",
  date: x("October 2026", "Tetor 2026", "Oktober 2026"),
  theme: [x("The Balanced Scorecard", "Balanced Scorecard", "Die Balanced Scorecard"), x("after 30 years", "pas 30 vitesh", "nach 30 Jahren")],
  sub: x(
    "Where the scorecard came from, how widely it spread, what research says about its effect, why the financial numbers keep winning, and a card for a scorecard on one page.",
    "Nga erdhi karta, sa u përhap, çfarë thotë kërkimi për efektin e saj, pse shifrat financiare fitojnë gjithmonë, dhe një kartë për një scorecard në një faqe.",
    "Woher die Scorecard kam, wie weit sie sich verbreitete, was die Forschung über ihre Wirkung sagt, warum die Finanzzahlen immer gewinnen, und eine Karte für eine Scorecard auf einer Seite."),
  seo: x(
    "The Balanced Scorecard after 30 years: Kaplan on its origins, Bain's 66%, what studies found, why financial numbers win, and a one-page scorecard card.",
    "Balanced Scorecard pas 30 vitesh: Kaplan për origjinën, 66% e Bain, çfarë gjetën studimet, pse fitojnë shifrat financiare, dhe karta në një faqe.",
    "Die Balanced Scorecard nach 30 Jahren: Kaplan zur Entstehung, Bains 66 %, was Studien fanden, warum Finanzzahlen gewinnen, und eine einseitige Karte."),
  feature: x(
    "Issue 17 goes back to a 1990 study with a dozen companies, follows the scorecard from a set of measures to a map of strategy, weighs three decades of research, shows why the financial numbers win when people judge, and ends with a card for a scorecard on one page.",
    "Numri 17 kthehet te një studim i 1990 me një duzinë kompanish, e ndjek kartën nga një grup masash te një hartë e strategjisë, peshon tri dekada kërkimesh, tregon pse fitojnë shifrat financiare kur njerëzit gjykojnë, dhe mbyllet me një kartë për një scorecard në një faqe.",
    "Ausgabe 17 geht zurück zu einer Studie von 1990 mit einem Dutzend Unternehmen, folgt der Scorecard von einem Satz Kennzahlen zu einer Landkarte der Strategie, wägt drei Jahrzehnte Forschung ab, zeigt, warum beim Urteilen die Finanzzahlen gewinnen, und endet mit einer Karte für eine Scorecard auf einer Seite."),
  figure: { n: pc(66), by: "Bain, 2007", t: x(
    "of 1,221 executives worldwide said their company used the Balanced Scorecard.",
    "e 1.221 drejtuesve në botë thanë se kompania e tyre përdorte Balanced Scorecard.",
    "von 1.221 Führungskräften weltweit sagten, ihr Unternehmen nutze die Balanced Scorecard.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("A study with a dozen companies", "Një studim me një duzinë kompanish", "Eine Studie mit einem Dutzend Unternehmen") },
    { page: "model", kicker: x("The model", "Modeli", "Das Modell"),
      title: x("The strategy map", "Harta e strategjisë", "Die Strategielandkarte") },
    { page: "tool", kicker: x("Tool of the week", "Mjeti i javës", "Werkzeug der Woche"),
      title: x("The one-page scorecard", "Scorecard në një faqe", "Die Scorecard auf einer Seite") },
  ],
  sources: ["kaplan-2010", "bain-2007", "davis-albright-2004", "tawse-tabesh-2023", "kaplan-norton-2000", "ittner-2003", "lipe-salterio-2000", "norreklit-2000"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Few management tools have lasted as long as the Balanced Scorecard, and No. 2 used its idea of leading and lagging measures. This issue asks what three decades of use have taught: where it helps, where it fails, and how to tell the difference in your own operation.",
        "Pak mjete menaxhimi kanë zgjatur sa Balanced Scorecard, dhe Nr. 2 përdori idenë e saj të masave paraprijëse dhe vonuese. Ky numër pyet çfarë kanë mësuar tri dekada përdorimi: ku ndihmon, ku dështon, dhe si e dallon në operacionin tënd.",
        "Wenige Führungswerkzeuge haben so lange gehalten wie die Balanced Scorecard, und Nr. 2 nutzte ihre Idee der Früh- und Spätindikatoren. Diese Ausgabe fragt, was drei Jahrzehnte Einsatz gelehrt haben: wo sie hilft, wo sie scheitert und wie man das im eigenen Betrieb unterscheidet."),
      body: x(
        "Robert Kaplan and David Norton built the scorecard from a 1990 study with a dozen companies. In Bain's 2007 survey, two-thirds of the executives said their company used it. The research is mixed: in one bank the branches that introduced it did better, while other studies show people judging mostly by the financial numbers, and doubts about the links between the four perspectives.",
        "Robert Kaplan dhe David Norton e ndërtuan kartën nga një studim i 1990 me një duzinë kompanish. Te anketa e Bain e 2007, dy të tretat e drejtuesve thanë se kompania e tyre e përdorte. Kërkimi është i përzier: në një bankë, degët që e futën patën rezultate më të mira, ndërsa studime të tjera tregojnë njerëz që gjykojnë kryesisht nga shifrat financiare, dhe dyshime për lidhjet mes katër perspektivave.",
        "Robert Kaplan und David Norton entwickelten die Scorecard aus einer Studie von 1990 mit einem Dutzend Unternehmen. In Bains Umfrage von 2007 sagten zwei Drittel der Führungskräfte, ihr Unternehmen nutze sie. Die Forschung ist gemischt: In einer Bank schnitten die Filialen, die sie einführten, besser ab, während andere Studien zeigen, dass Menschen vor allem nach den Finanzzahlen urteilen, und Zweifel an den Verbindungen zwischen den vier Perspektiven wecken."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("A study with", "Një studim me", "Eine Studie mit"), x("a dozen companies", "një duzinë kompanish", "einem Dutzend Unternehmen")],
      lead: x(
        "In 1990 the Nolan Norton Institute, the research arm of KPMG, ran a one-year study called “Measuring Performance in the Organization of the Future”. David Norton led it; Robert Kaplan was its academic adviser.",
        "Në 1990, Nolan Norton Institute, krahu kërkimor i KPMG, zhvilloi një studim njëvjeçar me titull “Measuring Performance in the Organization of the Future”. E drejtoi David Norton; Robert Kaplan ishte këshilltari akademik.",
        "1990 führte das Nolan Norton Institute, der Forschungszweig von KPMG, eine einjährige Studie mit dem Titel „Measuring Performance in the Organization of the Future“ durch. David Norton leitete sie; Robert Kaplan war der wissenschaftliche Berater."),
      blocks: [
        { type: "p", text: x(
          "Representatives of about a dozen companies, from heavy industry to high technology, met every two months. At one meeting Art Schneiderman of Analog Devices showed the company's “Corporate Scorecard”, with measures of delivery times and of continuous improvement beside the financial ones. The discussions led to a scorecard with four perspectives: financial, customer, internal processes, and innovation and learning.",
          "Përfaqësues të rreth një duzinë kompanish, nga industria e rëndë te teknologjia e lartë, u takuan çdo dy muaj. Në një takim, Art Schneiderman i Analog Devices tregoi “Corporate Scorecard” të kompanisë, me masa për afatet e dorëzimit dhe për përmirësimin e vazhdueshëm pranë atyre financiare. Diskutimet çuan te një kartë me katër perspektiva: financiare, klienti, proceset e brendshme, dhe inovacioni e të mësuarit.",
          "Vertreter von rund einem Dutzend Unternehmen, von der Schwerindustrie bis zur Hochtechnologie, trafen sich alle zwei Monate. Bei einem Treffen zeigte Art Schneiderman von Analog Devices die „Corporate Scorecard“ des Unternehmens, mit Kennzahlen zu Lieferzeiten und kontinuierlicher Verbesserung neben den finanziellen. Aus den Diskussionen entstand eine Scorecard mit vier Perspektiven: Finanzen, Kunden, interne Prozesse sowie Innovation und Lernen.") },
        { type: "timeline", items: [
          { k: "1990", t: x("A dozen companies meet every two months.", "Një duzinë kompanish takohen çdo dy muaj.", "Ein Dutzend Unternehmen trifft sich alle zwei Monate.") },
          { k: "1992", t: x("The first article in Harvard Business Review.", "Artikulli i parë te Harvard Business Review.", "Der erste Artikel in der Harvard Business Review.") },
          { k: "2000", t: x("The strategy map links the objectives.", "Harta e strategjisë lidh objektivat.", "Die Strategielandkarte verbindet die Ziele.") },
          { k: "2008", t: x("The Execution Premium: from strategy to operations.", "The Execution Premium: nga strategjia te operacioni.", "The Execution Premium: von der Strategie zum Betrieb.") },
        ] },
        { type: "p", text: x(
          "After thousands of private, public and non-profit organisations had adopted it, Kaplan writes, he and Norton widened the scorecard into a tool for describing, communicating and carrying out strategy.",
          "Pasi e kishin përdorur mijëra organizata private, publike dhe jofitimprurëse, shkruan Kaplan, ai dhe Norton e zgjeruan kartën në një mjet për të përshkruar, komunikuar dhe zbatuar strategjinë.",
          "Nachdem Tausende private, öffentliche und gemeinnützige Organisationen sie eingeführt hatten, so Kaplan, erweiterten er und Norton die Scorecard zu einem Werkzeug, um Strategie zu beschreiben, zu vermitteln und umzusetzen.") },
        { type: "callout", reading: true, text: x(
          "The scorecard began as a way to measure and became a way to manage strategy. The first question for any team is which of the two it is using.",
          "Karta nisi si mënyrë për të matur dhe u bë mënyrë për të drejtuar strategjinë. Pyetja e parë për çdo ekip është cilën nga të dyja po përdor.",
          "Die Scorecard begann als Art zu messen und wurde zur Art, Strategie zu steuern. Die erste Frage für jedes Team ist, welche der beiden es nutzt.") },
      ],
      source: ["kaplan-2010"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("Widely used,", "E përdorur gjerë,", "Weit verbreitet,"), x("mixed evidence", "prova të përziera", "gemischte Belege")],
      lead: x(
        "Bain & Company asks executives every few years which management tools they use. In its 2007 survey of 1,221 executives worldwide, the Balanced Scorecard was among the most widely used.",
        "Bain & Company i pyet drejtuesit çdo disa vjet cilat mjete menaxhimi përdorin. Te anketa e 2007 me 1.221 drejtues në botë, Balanced Scorecard ishte ndër më të përdorurat.",
        "Bain & Company fragt Führungskräfte alle paar Jahre, welche Managementwerkzeuge sie nutzen. In der Umfrage von 2007 unter 1.221 Führungskräften weltweit gehörte die Balanced Scorecard zu den meistgenutzten."),
      blocks: [
        { type: "donut", v: 66, n: pc(66), source: ["bain-2007"], t: x(
          "of the executives said their company used the Balanced Scorecard.",
          "e drejtuesve thanë se kompania e tyre përdorte Balanced Scorecard.",
          "der Führungskräfte sagten, ihr Unternehmen nutze die Balanced Scorecard.") },
        { type: "p", text: x(
          "Use is not effect. In one bank, Davis and Albright compared branches that introduced the scorecard with branches that did not, two years before and after, on the financial measure that set bonuses in both. The branches with the scorecard did better.",
          "Përdorimi nuk është efekt. Në një bankë, Davis dhe Albright krahasuan degët që e futën kartën me degët që nuk e futën, dy vjet para dhe pas, me masën financiare që caktonte bonuset te të dyja. Degët me kartën patën rezultate më të mira.",
          "Nutzung ist nicht Wirkung. In einer Bank verglichen Davis und Albright Filialen, die die Scorecard einführten, mit Filialen ohne sie, zwei Jahre vorher und nachher, anhand der Finanzkennzahl, die in beiden die Boni bestimmte. Die Filialen mit Scorecard schnitten besser ab.") },
        { type: "p", text: x(
          "Thirty years on, Alex Tawse and Pooya Tabesh find the evidence on its effect on company performance mixed. They describe a paradox: a tool meant to help carry out strategy works only if it is itself carried out well.",
          "Tridhjetë vjet më vonë, Alex Tawse dhe Pooya Tabesh i gjejnë të përziera provat për efektin e saj te performanca e kompanive. Ata përshkruajnë një paradoks: një mjet që duhet të ndihmojë zbatimin e strategjisë funksionon vetëm nëse zbatohet mirë vetë.",
          "Dreißig Jahre später finden Alex Tawse und Pooya Tabesh die Belege zur Wirkung auf die Unternehmensleistung gemischt. Sie beschreiben ein Paradox: Ein Werkzeug, das bei der Umsetzung von Strategie helfen soll, wirkt nur, wenn es selbst gut umgesetzt wird.") },
        { type: "callout", reading: true, text: x(
          "Popularity says that many companies tried it. It does not say that it worked for them. The bank study is one bank.",
          "Popullariteti thotë se shumë kompani e provuan. Nuk thotë se u funksionoi. Studimi i bankës është një bankë.",
          "Beliebtheit sagt, dass viele Unternehmen es versucht haben. Sie sagt nicht, dass es ihnen half. Die Bankstudie ist eine Bank.") },
      ],
      source: ["bain-2007", "davis-albright-2004", "tawse-tabesh-2023"],
    },
    {
      id: "model", more: "kpis-the-team-trusts",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("The strategy", "Harta e", "Die Strategie-"), x("map", "strategjisë", "landkarte")],
      lead: x(
        "In 2000 Kaplan and Norton added the strategy map: one page on which the objectives of the four perspectives are linked by cause and effect, from what people learn to what the customer sees and what the business earns.",
        "Në 2000, Kaplan dhe Norton shtuan hartën e strategjisë: një faqe ku objektivat e katër perspektivave lidhen me shkak dhe pasojë, nga ajo që mësojnë njerëzit te ajo që sheh klienti dhe ajo që fiton biznesi.",
        "2000 ergänzten Kaplan und Norton die Strategielandkarte: eine Seite, auf der die Ziele der vier Perspektiven durch Ursache und Wirkung verbunden sind, von dem, was Menschen lernen, bis zu dem, was Kunden sehen und das Unternehmen verdient."),
      blocks: [
        { type: "chain", items: [
          { h: x("Learning and growth", "Të mësuarit dhe rritja", "Lernen und Entwicklung"), p: x("Skills, information, the way of working.", "Aftësitë, informacioni, mënyra e punës.", "Fähigkeiten, Information, Arbeitsweise.") },
          { h: x("Internal processes", "Proceset e brendshme", "Interne Prozesse"), p: x("What the operation must do well.", "Çfarë duhet të bëjë mirë operacioni.", "Was der Betrieb gut können muss.") },
          { h: x("Customer", "Klienti", "Kunden"), p: x("What the customer gets and notices.", "Çfarë merr dhe vëren klienti.", "Was Kunden bekommen und merken.") },
          { h: x("Financial", "Financiare", "Finanzen"), p: x("Revenue, cost, return.", "Të ardhurat, kostoja, kthimi.", "Umsatz, Kosten, Rendite.") },
        ] },
        { type: "example", label: x("Hypothetical example, a warehouse", "Shembull hipotetik, një magazinë", "Hypothetisches Beispiel, ein Lager"), rows: [
          { k: x("Learning", "Të mësuarit", "Lernen"), v: x("Every picker trained on the new scanner by March", "Çdo mbledhës porosish i trajnuar për skanerin e ri deri në mars", "Alle Kommissionierer bis März am neuen Scanner geschult") },
          { k: x("Process", "Procesi", "Prozess"), v: x("Picking errors below 0.5%", "Gabimet në mbledhje nën 0,5%", "Kommissionierfehler unter 0,5 %") },
          { k: x("Customer", "Klienti", "Kunden"), v: x("Complete orders 99% of the time", "Porosi të plota në 99% të rasteve", "Vollständige Aufträge in 99 % der Fälle") },
          { k: x("Financial", "Financiare", "Finanzen"), v: x("Cost of returns down by a fifth", "Kostoja e kthimeve ulet me një të pestën", "Retourenkosten um ein Fünftel gesenkt") },
        ], text: x("Each line is a bet that the one above it drives the one below. The objectives and numbers are invented.", "Çdo rresht është një bast se rreshti sipër e shtyn atë poshtë. Objektivat dhe numrat janë të shpikur.", "Jede Zeile ist eine Wette, dass die Zeile darüber die darunter antreibt. Ziele und Zahlen sind erfunden.") },
        { type: "callout", reading: true, text: x(
          "A strategy map is a hypothesis, not a fact. Its arrows are worth checking with your own data.",
          "Harta e strategjisë është hipotezë, jo fakt. Shigjetat e saj ia vlen t'i kontrollosh me të dhënat e tua.",
          "Eine Strategielandkarte ist eine Hypothese, keine Tatsache. Ihre Pfeile sollte man mit eigenen Daten prüfen.") },
      ],
      note: x(
        "In 1992 the fourth perspective was called innovation and learning; later texts call it learning and growth.",
        "Në 1992, perspektiva e katërt quhej inovacioni dhe të mësuarit; tekstet e mëvonshme e quajnë të mësuarit dhe rritja.",
        "1992 hieß die vierte Perspektive Innovation und Lernen; spätere Texte nennen sie Lernen und Entwicklung."),
      source: ["kaplan-norton-2000"],
    },
    {
      id: "risk",
      kicker: x("What goes wrong", "Çfarë shkon keq", "Was schiefgeht"),
      title: [x("Why the financial", "Pse fitojnë", "Warum die Finanzzahlen"), x("numbers win", "shifrat financiare", "gewinnen")],
      lead: x(
        "Christopher Ittner, David Larcker and Marshall Meyer followed a bank that tied bonuses to a scorecard. Superiors gave most of the weight to the financial measures, against Kaplan and Norton's intention.",
        "Christopher Ittner, David Larcker dhe Marshall Meyer ndoqën një bankë që i lidhi bonuset me një scorecard. Eprorët u dhanë masave financiare peshën më të madhe, në kundërshtim me qëllimin e Kaplan dhe Norton.",
        "Christopher Ittner, David Larcker und Marshall Meyer begleiteten eine Bank, die Boni an eine Scorecard knüpfte. Die Vorgesetzten gaben den Finanzkennzahlen das größte Gewicht, entgegen der Absicht von Kaplan und Norton."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("The weight drifts to money", "Pesha shkon te paraja", "Das Gewicht wandert zum Geld"), p: x("Superiors added factors that were not on the card, ignored some that were, and changed the criteria between periods.", "Eprorët shtuan faktorë që nuk ishin në kartë, injoruan disa që ishin, dhe ndryshuan kriteret nga një periudhë te tjetra.", "Vorgesetzte ergänzten Faktoren, die nicht auf der Karte standen, übergingen andere und änderten die Kriterien zwischen den Perioden.") },
          { h: x("Shared measures crowd out the rest", "Masat e përbashkëta i nxjerrin jashtë të tjerat", "Gemeinsame Kennzahlen verdrängen den Rest"), p: x("In an experiment with MBA students, evaluators judged two units by the measures they had in common and set aside the measures unique to each unit's strategy.", "Në një eksperiment me studentë MBA, vlerësuesit i gjykuan dy njësi nga masat që kishin të përbashkëta dhe i lanë mënjanë masat e veçanta të strategjisë së secilës.", "In einem Experiment mit MBA-Studierenden beurteilten die Bewertenden zwei Einheiten nach ihren gemeinsamen Kennzahlen und ließen die strategiespezifischen jeder Einheit beiseite.") },
          { h: x("The arrows may not hold", "Shigjetat mund të mos qëndrojnë", "Die Pfeile halten vielleicht nicht"), p: x("Hanne Nørreklit questioned the cause-and-effect links between the four perspectives; between some of them she found no causal relationship.", "Hanne Nørreklit i vuri në dyshim lidhjet shkak–pasojë mes katër perspektivave; mes disave prej tyre nuk gjeti lidhje shkakësore.", "Hanne Nørreklit stellte die Ursache-Wirkungs-Beziehungen zwischen den vier Perspektiven infrage; zwischen einigen fand sie keinen kausalen Zusammenhang.") },
        ] },
        { type: "example", label: x("Hypothetical example, two warehouses", "Shembull hipotetik, dy magazina", "Hypothetisches Beispiel, zwei Lager"), rows: [
          { k: x("Shared measure", "Masa e përbashkët", "Gemeinsame Kennzahl"), v: x("Cost per order: A €2.10, B €2.30", "Kostoja për porosi: A 2,10 €, B 2,30 €", "Kosten pro Auftrag: A 2,10 €, B 2,30 €") },
          { k: x("Own measures", "Masat e veta", "Eigene Kennzahlen"), v: x("A: next-day orders on time 97% · B: hospital orders on time 99.6%", "A: porositë për nesër në kohë 97% · B: porositë e spitaleve në kohë 99,6%", "A: Folgetag-Aufträge pünktlich 97 % · B: Klinikaufträge pünktlich 99,6 %") },
        ], text: x("Read only the shared line and B looks worse, though B was asked to do something harder. The numbers are invented.", "Po të lexosh vetëm rreshtin e përbashkët, B duket më keq, edhe pse B-së iu kërkua diçka më e vështirë. Numrat janë të shpikur.", "Liest man nur die gemeinsame Zeile, wirkt B schlechter, obwohl B etwas Schwierigeres leisten sollte. Die Zahlen sind erfunden.") },
        { type: "callout", reading: true, text: x(
          "A scorecard does not stay balanced on its own. Someone has to defend the measures that are harder to count.",
          "Karta nuk qëndron e balancuar vetvetiu. Dikush duhet t'i mbrojë masat që numërohen më vështirë.",
          "Eine Scorecard bleibt nicht von selbst ausgewogen. Jemand muss die Kennzahlen verteidigen, die sich schwerer zählen lassen.") },
      ],
      note: x("The example is the editors'.", "Shembulli është i redaksisë.", "Das Beispiel stammt von der Redaktion."),
      source: ["ittner-2003", "lipe-salterio-2000", "norreklit-2000"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie man es misst"),
      title: [x("Five questions", "Pesë pyetje", "Fünf Fragen"), x("for a scorecard", "për një scorecard", "an eine Scorecard")],
      lead: x(
        "A scorecard can be checked like any other measurement. Five questions, once a quarter, with the people who report on it.",
        "Një scorecard mund të kontrollohet si çdo matje tjetër. Pesë pyetje, një herë në tremujor, me njerëzit që raportojnë mbi të.",
        "Eine Scorecard lässt sich prüfen wie jede andere Messung. Fünf Fragen, einmal pro Quartal, mit den Menschen, die dazu berichten."),
      blocks: [
        { type: "steps", items: [
          { h: x("Which objective does each measure serve?", "Cilit objektiv i shërben çdo masë?", "Welchem Ziel dient jede Kennzahl?"), p: x("A measure without an objective is a report, not a scorecard.", "Masa pa objektiv është raport, jo scorecard.", "Eine Kennzahl ohne Ziel ist ein Bericht, keine Scorecard.") },
          { h: x("Does the cause move before the result?", "A lëviz shkaku para rezultatit?", "Bewegt sich die Ursache vor dem Ergebnis?"), p: x("Check each arrow with your own months of data.", "Kontrollo çdo shigjetë me muajt e tu të të dhënave.", "Jeden Pfeil mit eigenen Monatsdaten prüfen.") },
          { h: x("How much weight did money get?", "Sa peshë mori paraja?", "Wie viel Gewicht bekam das Geld?"), p: x("Look at the last decisions and reviews, not at the plan.", "Shiko vendimet dhe rishikimet e fundit, jo planin.", "Auf die letzten Entscheidungen und Reviews schauen, nicht auf den Plan.") },
          { h: x("Are the unique measures read?", "A lexohen masat e veçanta?", "Werden die eigenen Kennzahlen gelesen?"), p: x("One sentence on each before units are compared.", "Një fjali për secilën para se të krahasohen njësitë.", "Ein Satz zu jeder, bevor Einheiten verglichen werden.") },
          { h: x("What would we drop?", "Çfarë do të hiqnim?", "Was würden wir streichen?"), p: x("A card that only grows is no longer a choice.", "Një kartë që vetëm rritet nuk është më zgjedhje.", "Eine Karte, die nur wächst, ist keine Wahl mehr.") },
        ] },
        { type: "example", label: x("Hypothetical example, checking one arrow", "Shembull hipotetik, kontrolli i një shigjete", "Hypothetisches Beispiel, ein Pfeil geprüft"), rows: [
          { k: x("Training", "Trajnimi", "Schulung"), v: x("Done by March: 100%", "I kryer deri në mars: 100%", "Bis März erledigt: 100 %") },
          { k: x("Errors", "Gabimet", "Fehler"), v: x("Picking errors, April to June: no change", "Gabimet në mbledhje, prill–qershor: asnjë ndryshim", "Kommissionierfehler April bis Juni: keine Änderung") },
        ], text: x("The training is done but has not reached the errors: look next at how the scanners are set up. The numbers are invented.", "Trajnimi është kryer, por nuk ka arritur te gabimet: shiko më pas si janë konfiguruar skanerët. Numrat janë të shpikur.", "Die Schulung ist erledigt, hat die Fehler aber nicht erreicht: Als Nächstes die Einrichtung der Scanner prüfen. Die Zahlen sind erfunden.") },
      ],
      note: x("The questions and the example are the editors'.", "Pyetjet dhe shembulli janë të redaksisë.", "Fragen und Beispiel stammen von der Redaktion."),
    },
    {
      id: "tool", tool: "/tools/kpi-diagnostic/",
      kicker: x("Tool of the week", "Mjeti i javës", "Werkzeug der Woche"),
      title: [x("The one-page", "Scorecard", "Die Scorecard"), x("scorecard", "në një faqe", "auf einer Seite")],
      lead: x(
        "One page for one team: one or two objectives per perspective, each with a measure and a target. And one line for the arrow you are betting on.",
        "Një faqe për një ekip: një ose dy objektiva për çdo perspektivë, secili me një masë dhe një objektiv numerik. Dhe një rresht për shigjetën mbi të cilën vini bast.",
        "Eine Seite für ein Team: ein oder zwei Ziele pro Perspektive, jedes mit Kennzahl und Zielwert. Und eine Zeile für den Pfeil, auf den man wettet."),
      blocks: [
        { type: "form", items: [
          { h: x("Financial", "Financiare", "Finanzen"), hint: x("objective · measure · target", "objektivi · masa · vlera e synuar", "Ziel · Kennzahl · Zielwert") },
          { h: x("Customer", "Klienti", "Kunden"), hint: x("objective · measure · target", "objektivi · masa · vlera e synuar", "Ziel · Kennzahl · Zielwert") },
          { h: x("Internal processes", "Proceset e brendshme", "Interne Prozesse"), hint: x("objective · measure · target", "objektivi · masa · vlera e synuar", "Ziel · Kennzahl · Zielwert") },
          { h: x("Learning and growth", "Të mësuarit dhe rritja", "Lernen und Entwicklung"), hint: x("objective · measure · target", "objektivi · masa · vlera e synuar", "Ziel · Kennzahl · Zielwert") },
          { h: x("The arrow we are betting on", "Shigjeta mbi të cilën vëmë bast", "Der Pfeil, auf den wir wetten"), hint: x("if we do this, that moves within … months", "nëse bëjmë këtë, ajo lëviz brenda … muajve", "wenn wir dies tun, bewegt sich das binnen … Monaten"), lines: 2 },
          { h: x("Review", "Rishikimi", "Review"), hint: x("date, who reads it, what we drop if nothing moves", "data, kush e lexon, çfarë heqim nëse s'lëviz asgjë", "Datum, wer liest, was wir streichen, wenn sich nichts bewegt") },
        ] },
      ],
      note: x(
        "A practice proposed by the editors, on the four perspectives and the strategy map of Kaplan and Norton.",
        "Praktikë e propozuar nga redaksia, mbi katër perspektivat dhe hartën e strategjisë të Kaplan dhe Norton.",
        "Eine Praxis, die die Redaktion vorschlägt, auf Grundlage der vier Perspektiven und der Strategielandkarte von Kaplan und Norton."),
      source: ["kaplan-norton-2000"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
