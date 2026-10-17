// Management Review, No. 17: The Balanced Scorecard after 30 years. Block: KPIs.
// Facts and their sources: docs/revista/management-review-nr-17.md.
import { x, pc } from "../common.js";

export default {
  number: 17,
  block: "kpi",
  date: x("October 2026", "Tetor 2026", "Oktober 2026"),
  theme: [x("The Balanced Scorecard", "Balanced Scorecard", "Die Balanced Scorecard"), x("after 30 years", "pas 30 vitesh", "nach 30 Jahren")],
  sub: x(
    "Where the scorecard came from, how widely it spread, what research says about its effect, why the financial numbers tend to win, and a card for a scorecard on one page.",
    "Nga lindi karta, sa u përhap, çfarë thotë kërkimi për efektin e saj, pse shifrat financiare zakonisht fitojnë, dhe një kartë për një scorecard në një faqe.",
    "Woher die Scorecard kommt, wie weit sie sich verbreitet hat, was die Forschung über ihre Wirkung sagt, warum die Finanzzahlen meist gewinnen, und eine Karte für eine Scorecard auf einer Seite."),
  seo: x(
    "The Balanced Scorecard after 30 years: Kaplan on its origins, Bain's 66%, what studies found, why financial numbers win, and a one-page scorecard card.",
    "Balanced Scorecard pas 30 vitesh: Kaplan për origjinën, 66% e Bain-it, çfarë gjetën studimet, pse fitojnë shifrat financiare, dhe karta në një faqe.",
    "Die Balanced Scorecard nach 30 Jahren: Kaplan zur Entstehung, Bains 66 %, was Studien fanden, warum Finanzzahlen gewinnen, und eine einseitige Karte."),
  feature: x(
    "The Balanced Scorecard began in 1990, in a study with a dozen companies, and grew from a set of measures into a map of strategy. Issue 17 weighs three decades of research and shows why the financial numbers win when people judge. It closes with a card for a scorecard on one page.",
    "Balanced Scorecard lindi në vitin 1990, në një studim me një duzinë kompanish, dhe nga një grup masash u rrit në një hartë të strategjisë. Numri 17 peshon tri dekada kërkimesh dhe tregon pse fitojnë shifrat financiare kur njerëzit gjykojnë. Mbyllet me një kartë për një scorecard në një faqe.",
    "Die Balanced Scorecard entstand 1990 in einer Studie mit einem Dutzend Unternehmen und wuchs von einem Satz Kennzahlen zu einer Landkarte der Strategie. Ausgabe 17 wägt drei Jahrzehnte Forschung ab und zeigt, warum beim Urteilen die Finanzzahlen gewinnen. Am Ende steht eine Karte für eine Scorecard auf einer Seite."),
  figure: { n: pc(66), by: "Bain, 2007", t: x(
    "of 1,221 executives worldwide said their company used the Balanced Scorecard.",
    "e 1.221 drejtuesve në mbarë botën thanë se kompania e tyre përdorte Balanced Scorecard.",
    "von 1.221 Führungskräften weltweit gaben an, ihr Unternehmen nutze die Balanced Scorecard.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("A study with a dozen companies", "Një studim me një duzinë kompanish", "Eine Studie mit einem Dutzend Unternehmen") },
    { page: "model", kicker: x("The model", "Modeli", "Das Modell"),
      title: x("The strategy map", "Harta e strategjisë", "Die Strategielandkarte") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The one-page scorecard", "Scorecard në një faqe", "Die Scorecard auf einer Seite") },
  ],
  sources: ["kaplan-2010", "kaplan-norton-1992", "bain-2007", "davis-albright-2004", "tawse-tabesh-2023", "kaplan-norton-2000", "ittner-2003", "lipe-salterio-2000", "norreklit-2000"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Few management tools have lasted as long as the Balanced Scorecard, and No. 2 borrowed its idea of leading and lagging measures. Three decades of use have taught something: where it helps, where it fails, and how to tell the difference in your own operation.",
        "Pak mjete menaxhimi kanë jetuar aq gjatë sa Balanced Scorecard, dhe Nr. 2 mori prej saj idenë e masave paraprijëse dhe vonuese. Tri dekada përdorimi kanë mësuar diçka: ku ndihmon, ku dështon, dhe si e dallon këtë në operacionin tënd.",
        "Nur wenige Führungswerkzeuge haben so lange überdauert wie die Balanced Scorecard, und Nr. 2 übernahm ihre Idee der Früh- und Spätindikatoren. Drei Jahrzehnte Einsatz haben etwas gelehrt: wo sie hilft, wo sie scheitert und wie Sie das im eigenen Betrieb auseinanderhalten."),
      body: x(
        "Robert Kaplan and David Norton built the scorecard from a 1990 study with a dozen companies. In Bain's 2007 survey, two-thirds of the executives said their company used it. The research is mixed. In one bank the branches that introduced it did better; other studies show people judging mostly by the financial numbers, and raise doubts about the links between the four perspectives.",
        "Robert Kaplan dhe David Norton e ndërtuan kartën nga një studim i vitit 1990 me një duzinë kompanish. Në anketën e Bain-it të vitit 2007, dy të tretat e drejtuesve thanë se kompania e tyre e përdorte. Kërkimi jep pamje të përzier. Në një bankë, degët që e futën patën rezultate më të mira; studime të tjera tregojnë se njerëzit gjykojnë kryesisht nga shifrat financiare, dhe ngrenë dyshime për lidhjet mes katër perspektivave.",
        "Robert Kaplan und David Norton entwickelten die Scorecard aus einer Studie von 1990 mit einem Dutzend Unternehmen. In Bains Umfrage von 2007 gaben zwei Drittel der Führungskräfte an, ihr Unternehmen nutze sie. Die Forschung ergibt ein gemischtes Bild. In einer Bank schnitten die Filialen, die sie einführten, besser ab; andere Studien zeigen, dass Menschen vor allem nach den Finanzzahlen urteilen, und wecken Zweifel an den Verbindungen zwischen den vier Perspektiven."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("A study with", "Një studim me", "Eine Studie mit"), x("a dozen companies", "një duzinë kompanish", "einem Dutzend Unternehmen")],
      lead: x(
        "In 1990 the Nolan Norton Institute, the research arm of KPMG, ran a one-year study called “Measuring Performance in the Organization of the Future”. David Norton led it; Robert Kaplan was its academic adviser.",
        "Në vitin 1990, Nolan Norton Institute, krahu kërkimor i KPMG-së, zhvilloi një studim njëvjeçar me titull “Measuring Performance in the Organization of the Future”. E drejtoi David Norton; Robert Kaplan ishte këshilltari akademik.",
        "1990 führte das Nolan Norton Institute, der Forschungszweig von KPMG, eine einjährige Studie mit dem Titel „Measuring Performance in the Organization of the Future“ durch. David Norton leitete sie, Robert Kaplan war wissenschaftlicher Berater."),
      blocks: [
        { type: "p", text: x(
          "Representatives of about a dozen companies, from heavy industry to high technology, met every two months. At one meeting Art Schneiderman of Analog Devices presented the company's “Corporate Scorecard”, which set measures of delivery times and continuous improvement beside the financial ones. The discussions produced a scorecard with four perspectives: financial, customer, internal processes, and innovation and learning.",
          "Përfaqësues të rreth një duzinë kompanish, nga industria e rëndë te teknologjia e lartë, takoheshin çdo dy muaj. Në një takim, Art Schneiderman nga Analog Devices paraqiti “Corporate Scorecard” të kompanisë, ku pranë masave financiare qëndronin masa për afatet e dorëzimit dhe për përmirësimin e vazhdueshëm. Nga diskutimet doli një kartë me katër perspektiva: financat, klienti, proceset e brendshme, dhe inovacioni e të mësuarit.",
          "Vertreter von rund einem Dutzend Unternehmen, von der Schwerindustrie bis zur Hochtechnologie, trafen sich alle zwei Monate. Bei einem Treffen stellte Art Schneiderman von Analog Devices die „Corporate Scorecard“ des Unternehmens vor, die neben den Finanzkennzahlen auch Lieferzeiten und kontinuierliche Verbesserung erfasste. Aus den Diskussionen entstand eine Scorecard mit vier Perspektiven: Finanzen, Kunden, interne Prozesse sowie Innovation und Lernen.") },
        { type: "timeline", items: [
          { k: "1990", t: x("A dozen companies meet every two months.", "Një duzinë kompanish takohen çdo dy muaj.", "Ein Dutzend Unternehmen trifft sich alle zwei Monate.") },
          { k: "1992", t: x("The first article in Harvard Business Review.", "Artikulli i parë në Harvard Business Review.", "Der erste Artikel in der Harvard Business Review.") },
          { k: "2000", t: x("The strategy map links the objectives.", "Harta e strategjisë lidh objektivat.", "Die Strategielandkarte verbindet die Ziele.") },
          { k: "2008", t: x("The Execution Premium: from strategy to operations.", "The Execution Premium: nga strategjia te operacioni.", "The Execution Premium: von der Strategie zum Betrieb.") },
        ] },
        { type: "p", text: x(
          "After thousands of private, public and non-profit organisations had adopted it, Kaplan writes, he and Norton widened the scorecard into a tool for describing, communicating and carrying out strategy.",
          "Pasi e kishin zbatuar mijëra organizata private, publike dhe jofitimprurëse, shkruan Kaplan, ai dhe Norton e zgjeruan kartën në një mjet për ta përshkruar, komunikuar dhe zbatuar strategjinë.",
          "Nachdem Tausende private, öffentliche und gemeinnützige Organisationen sie eingeführt hatten, so Kaplan, bauten er und Norton die Scorecard zu einem Werkzeug aus, mit dem sich Strategie beschreiben, vermitteln und umsetzen lässt.") },
        { type: "callout", reading: true, text: x(
          "The scorecard began as a way to measure and became a way to manage strategy. Any team using one should first ask which of the two it has.",
          "Karta nisi si mënyrë për të matur dhe u bë mënyrë për ta drejtuar strategjinë. Çdo ekip që e përdor duhet të pyesë së pari cilën nga të dyja ka në dorë.",
          "Die Scorecard begann als Messinstrument und wurde zum Instrument der Strategiesteuerung. Jedes Team, das eine nutzt, sollte zuerst klären, welches von beiden es in der Hand hat.") },
      ],
      source: ["kaplan-2010", "kaplan-norton-1992"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("Widely used,", "E përdorur gjerë,", "Weit verbreitet,"), x("mixed evidence", "prova të përziera", "gemischte Belege")],
      lead: x(
        "Every few years Bain & Company asks executives which management tools they use. Its 2007 survey covered 1,221 executives worldwide.",
        "Çdo disa vjet, Bain & Company i pyet drejtuesit cilat mjete menaxhimi përdorin. Anketa e vitit 2007 përfshiu 1.221 drejtues në mbarë botën.",
        "Alle paar Jahre fragt Bain & Company Führungskräfte, welche Managementwerkzeuge sie einsetzen. Die Umfrage von 2007 umfasste 1.221 Führungskräfte weltweit."),
      blocks: [
        { type: "donut", v: 66, n: pc(66), source: ["bain-2007"], t: x(
          "of the executives said their company used the Balanced Scorecard.",
          "e drejtuesve thanë se kompania e tyre përdorte Balanced Scorecard.",
          "der Führungskräfte gaben an, ihr Unternehmen nutze die Balanced Scorecard.") },
        { type: "p", text: x(
          "Whether it works is another question. In one bank, Davis and Albright compared branches that introduced the scorecard with branches that did not, two years before and after, on the financial measure that set bonuses in both. The branches with the scorecard did better.",
          "Nëse funksionon, kjo është tjetër pyetje. Në një bankë, Davis dhe Albright krahasuan degët që e futën kartën me degët që nuk e futën, dy vjet para dhe dy vjet pas, me masën financiare që caktonte bonuset te të dyja. Degët me kartën patën rezultate më të mira.",
          "Ob sie wirkt, ist eine andere Frage. In einer Bank verglichen Davis und Albright Filialen, die die Scorecard einführten, mit Filialen ohne sie, jeweils zwei Jahre davor und danach, anhand der Finanzkennzahl, die in beiden die Boni bestimmte. Die Filialen mit Scorecard schnitten besser ab.") },
        { type: "p", text: x(
          "Thirty years on, Alex Tawse and Pooya Tabesh find the evidence on its effect on company performance mixed. They describe a paradox: a tool meant to help carry out strategy works only if it is itself carried out well.",
          "Tridhjetë vjet më vonë, Alex Tawse dhe Pooya Tabesh i gjejnë të përziera provat për efektin e saj te rezultatet e kompanive. Ata përshkruajnë një paradoks: një mjet që duhet të ndihmojë zbatimin e strategjisë funksionon vetëm nëse zbatohet mirë edhe vetë.",
          "Dreißig Jahre später halten Alex Tawse und Pooya Tabesh die Belege zur Wirkung auf den Unternehmenserfolg für gemischt. Sie beschreiben ein Paradox: Ein Werkzeug, das bei der Umsetzung von Strategie helfen soll, wirkt nur, wenn es selbst gut umgesetzt wird.") },
        { type: "callout", reading: true, text: x(
          "Popularity shows how many companies tried it, and says nothing about whether it worked for them. The bank study, besides, covers a single bank.",
          "Popullariteti tregon sa kompani e provuan, por nuk thotë asgjë nëse u funksionoi. Studimi i bankës, nga ana tjetër, mbulon vetëm një bankë.",
          "Beliebtheit zeigt, wie viele Unternehmen es versucht haben, aber nicht, ob es ihnen geholfen hat. Und die Bankstudie betrifft eine einzige Bank.") },
      ],
      source: ["bain-2007", "davis-albright-2004", "tawse-tabesh-2023"],
    },
    {
      id: "model", more: "kpis-the-team-trusts",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("The strategy", "Harta e", "Die Strategie-"), x("map", "strategjisë", "landkarte")],
      lead: x(
        "In 2000 Kaplan and Norton added the strategy map: one page on which the objectives of the four perspectives are linked by cause and effect, from what people learn to what the customer sees and what the business earns.",
        "Në vitin 2000, Kaplan dhe Norton shtuan hartën e strategjisë: një faqe ku objektivat e katër perspektivave lidhen me shkak dhe pasojë, nga ajo që mësojnë njerëzit te ajo që sheh klienti dhe ajo që fiton biznesi.",
        "2000 ergänzten Kaplan und Norton die Strategielandkarte: eine Seite, auf der die Ziele der vier Perspektiven durch Ursache und Wirkung verknüpft sind, von dem, was Menschen lernen, bis zu dem, was Kunden sehen und das Unternehmen verdient."),
      blocks: [
        { type: "chain", items: [
          { h: x("Learning and growth", "Të mësuarit dhe rritja", "Lernen und Entwicklung"), p: x("Skills, information, the way of working.", "Aftësitë, informacioni, mënyra e punës.", "Fähigkeiten, Information, Arbeitsweise.") },
          { h: x("Internal processes", "Proceset e brendshme", "Interne Prozesse"), p: x("What the operation must do well.", "Çfarë duhet të bëjë mirë operacioni.", "Was der Betrieb gut können muss.") },
          { h: x("Customer", "Klienti", "Kunden"), p: x("What the customer gets and notices.", "Çfarë merr dhe vëren klienti.", "Was Kunden bekommen und bemerken.") },
          { h: x("Financial", "Financiare", "Finanzen"), p: x("Revenue, cost, return.", "Të ardhurat, kostoja, kthimi.", "Umsatz, Kosten, Rendite.") },
        ] },
        { type: "example", label: x("Hypothetical example, a warehouse", "Shembull hipotetik, një magazinë", "Hypothetisches Beispiel, ein Lager"), rows: [
          { k: x("Learning", "Të mësuarit", "Lernen"), v: x("Every picker trained on the new scanner by March", "Çdo mbledhës porosish i trajnuar për skanerin e ri deri në mars", "Alle Kommissionierer bis März am neuen Scanner geschult") },
          { k: x("Process", "Procesi", "Prozess"), v: x("Picking errors below 0.5%", "Gabimet në mbledhje nën 0,5%", "Kommissionierfehler unter 0,5 %") },
          { k: x("Customer", "Klienti", "Kunden"), v: x("Complete orders 99% of the time", "Porosi të plota në 99% të rasteve", "Vollständige Aufträge in 99 % der Fälle") },
          { k: x("Financial", "Financiare", "Finanzen"), v: x("Cost of returns down by a fifth", "Kostoja e kthimeve ulet me një të pestën", "Retourenkosten um ein Fünftel gesenkt") },
        ], text: x("Each line bets that the line above drives the one below. Objectives and numbers are made up.", "Çdo rresht vë bast se rreshti sipër e shtyn atë poshtë. Objektivat dhe numrat janë të sajuar.", "Jede Zeile setzt darauf, dass die Zeile darüber die darunter antreibt. Ziele und Zahlen sind erfunden.") },
        { type: "callout", reading: true, text: x(
          "A strategy map is a hypothesis. Test its arrows against your own data.",
          "Harta e strategjisë është hipotezë. Shigjetat e saj provoji me të dhënat e tua.",
          "Eine Strategielandkarte ist eine Hypothese. Prüfen Sie ihre Pfeile an Ihren eigenen Daten.") },
      ],
      note: x(
        "In 1992 the fourth perspective was called innovation and learning; later texts call it learning and growth.",
        "Në vitin 1992, perspektiva e katërt quhej inovacioni dhe të mësuarit; tekstet e mëvonshme e quajnë të mësuarit dhe rritja.",
        "1992 hieß die vierte Perspektive Innovation und Lernen; spätere Texte nennen sie Lernen und Entwicklung."),
      source: ["kaplan-norton-2000"],
    },
    {
      id: "risk",
      kicker: x("What goes wrong", "Çfarë shkon keq", "Was schiefgeht"),
      title: [x("Why the financial", "Pse fitojnë", "Warum die Finanzzahlen"), x("numbers win", "shifrat financiare", "gewinnen")],
      lead: x(
        "Christopher Ittner, David Larcker and Marshall Meyer followed a bank that tied bonuses to a scorecard. Superiors gave most of the weight to the financial measures, against what Kaplan and Norton intended.",
        "Christopher Ittner, David Larcker dhe Marshall Meyer ndoqën një bankë që i lidhi bonuset me një scorecard. Eprorët u dhanë masave financiare peshën më të madhe, në kundërshtim me qëllimin e Kaplan-it dhe Norton-it.",
        "Christopher Ittner, David Larcker und Marshall Meyer begleiteten eine Bank, die Boni an eine Scorecard knüpfte. Die Vorgesetzten gaben den Finanzkennzahlen das größte Gewicht, entgegen der Absicht von Kaplan und Norton."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("The weight drifts to money", "Pesha rrëshqet te paraja", "Das Gewicht wandert zum Geld"), p: x("Superiors added factors that were not on the card, ignored some that were, and changed the criteria from one period to the next.", "Eprorët shtuan faktorë që nuk ishin në kartë, shpërfillën disa që ishin, dhe i ndryshuan kriteret nga një periudhë te tjetra.", "Vorgesetzte zogen Faktoren heran, die nicht auf der Karte standen, übergingen andere, die dort standen, und änderten die Kriterien von Periode zu Periode.") },
          { h: x("Shared measures crowd out the rest", "Masat e përbashkëta i nxjerrin jashtë të tjerat", "Gemeinsame Kennzahlen verdrängen den Rest"), p: x("In an experiment with MBA students, evaluators judged two units by the measures they had in common and set aside the measures unique to each unit's strategy.", "Në një eksperiment me studentë MBA, vlerësuesit i gjykuan dy njësi nga masat që kishin të përbashkëta dhe i lanë mënjanë masat e veçanta të strategjisë së secilës.", "In einem Experiment mit MBA-Studierenden beurteilten die Bewertenden zwei Einheiten nach ihren gemeinsamen Kennzahlen und ließen die strategiespezifischen jeder Einheit beiseite.") },
          { h: x("The arrows may not hold", "Shigjetat mund të mos qëndrojnë", "Die Pfeile halten vielleicht nicht"), p: x("Hanne Nørreklit questioned the cause-and-effect links between the four perspectives; between some of them, she argued, the link is not causal.", "Hanne Nørreklit i vuri në dyshim lidhjet shkak–pasojë mes katër perspektivave; mes disave, sipas saj, lidhja nuk është shkakësore.", "Hanne Nørreklit stellte die Ursache-Wirkungs-Beziehungen zwischen den vier Perspektiven infrage; zwischen einigen sei der Zusammenhang nicht kausal.") },
        ] },
        { type: "example", label: x("Hypothetical example, two warehouses", "Shembull hipotetik, dy magazina", "Hypothetisches Beispiel, zwei Lager"), rows: [
          { k: x("Shared measure", "Masa e përbashkët", "Gemeinsame Kennzahl"), v: x("Cost per order: A €2.10, B €2.30", "Kostoja për porosi: A 2,10 €, B 2,30 €", "Kosten pro Auftrag: A 2,10 €, B 2,30 €") },
          { k: x("Own measures", "Masat e veta", "Eigene Kennzahlen"), v: x("A: next-day orders on time 97% · B: hospital orders on time 99.6%", "A: porositë për nesër në kohë 97% · B: porositë e spitaleve në kohë 99,6%", "A: Folgetag-Aufträge pünktlich 97 % · B: Klinikaufträge pünktlich 99,6 %") },
        ], text: x("Read only the shared line and B looks worse, although B was asked to do something harder. These numbers are invented.", "Po të lexosh vetëm rreshtin e përbashkët, B duket më keq, edhe pse B-së iu kërkua diçka më e vështirë. Këta numra janë të shpikur.", "Wer nur die gemeinsame Zeile liest, hält B für schlechter, obwohl B etwas Schwierigeres leisten sollte. Diese Zahlen sind erfunden.") },
        { type: "callout", reading: true, text: x(
          "A scorecard drifts out of balance on its own. Someone has to stand up for the measures that are harder to count.",
          "Karta e humb ekuilibrin vetvetiu. Dikush duhet t'i mbrojë masat që numërohen më vështirë.",
          "Eine Scorecard verliert ihr Gleichgewicht von selbst. Jemand muss für die Kennzahlen eintreten, die sich schwerer zählen lassen.") },
      ],
      note: x("The example is the editors'.", "Shembulli është i redaksisë.", "Das Beispiel stammt von der Redaktion."),
      source: ["ittner-2003", "lipe-salterio-2000", "norreklit-2000"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie es gemessen wird"),
      title: [x("Five questions", "Pesë pyetje", "Fünf Fragen"), x("for a scorecard", "për një scorecard", "an eine Scorecard")],
      lead: x(
        "A scorecard can be checked like any other measurement: five questions, once a quarter, with the people who report on it.",
        "Një scorecard kontrollohet si çdo matje tjetër: pesë pyetje, një herë në tremujor, me njerëzit që raportojnë mbi të.",
        "Eine Scorecard lässt sich prüfen wie jede andere Messung: fünf Fragen, einmal im Quartal, mit den Menschen, die dazu berichten."),
      blocks: [
        { type: "steps", items: [
          { h: x("Which objective does each measure serve?", "Cilit objektiv i shërben çdo masë?", "Welchem Ziel dient jede Kennzahl?"), p: x("A measure that serves no objective belongs in a report.", "Masa që nuk i shërben asnjë objektivi i përket një raporti.", "Eine Kennzahl, die keinem Ziel dient, gehört in einen Bericht.") },
          { h: x("Does the cause move before the result?", "A lëviz shkaku para rezultatit?", "Bewegt sich die Ursache vor dem Ergebnis?"), p: x("Check each arrow against several months of your own data.", "Kontrollo çdo shigjetë me disa muaj të dhënash të tua.", "Prüfen Sie jeden Pfeil an mehreren Monaten eigener Daten.") },
          { h: x("How much weight did money get?", "Sa peshë mori paraja?", "Wie viel Gewicht bekam das Geld?"), p: x("Look at the latest decisions and reviews rather than the plan.", "Shiko vendimet dhe rishikimet e fundit, jo planin.", "Schauen Sie auf die letzten Entscheidungen und Besprechungen statt auf den Plan.") },
          { h: x("Are the unique measures read?", "A lexohen masat e veçanta?", "Werden die eigenen Kennzahlen gelesen?"), p: x("One sentence on each before units are compared.", "Një fjali për secilën para se të krahasohen njësitë.", "Ein Satz zu jeder, bevor Einheiten verglichen werden.") },
          { h: x("What would we drop?", "Çfarë do të hiqnim?", "Was würden wir streichen?"), p: x("A card that only grows has stopped being a choice.", "Një kartë që vetëm rritet ka pushuar së qeni zgjedhje.", "Eine Karte, die nur wächst, ist keine Auswahl mehr.") },
        ] },
        { type: "example", label: x("Hypothetical example, checking one arrow", "Shembull hipotetik, kontrolli i një shigjete", "Hypothetisches Beispiel, ein Pfeil geprüft"), rows: [
          { k: x("Training", "Trajnimi", "Schulung"), v: x("Done by March: 100%", "I kryer deri në mars: 100%", "Bis März erledigt: 100 %") },
          { k: x("Errors", "Gabimet", "Fehler"), v: x("Picking errors, April to June: no change", "Gabimet në mbledhje, prill–qershor: asnjë ndryshim", "Kommissionierfehler April bis Juni: keine Änderung") },
        ], text: x("The training is done but has not reached the errors, so look next at how the scanners are set up. The figures are invented.", "Trajnimi u krye, por nuk u ndie te gabimet; prandaj shiko më pas si janë konfiguruar skanerët. Shifrat janë të shpikura.", "Die Schulung ist abgeschlossen, bei den Fehlern aber nicht angekommen; prüfen Sie als Nächstes, wie die Scanner eingerichtet sind. Die Zahlen sind erfunden.") },
      ],
      note: x("Questions and example: the editors.", "Pyetjet dhe shembulli: redaksia.", "Fragen und Beispiel: die Redaktion."),
    },
    {
      id: "tool", tool: "/tools/kpi-diagnostic/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The one-page", "Scorecard", "Die Scorecard"), x("scorecard", "në një faqe", "auf einer Seite")],
      lead: x(
        "One page for one team: one or two objectives per perspective, each with a measure and a target, and one line for the arrow you are betting on.",
        "Një faqe për një ekip: një ose dy objektiva për çdo perspektivë, secili me një masë dhe një vlerë të synuar, dhe një rresht për shigjetën mbi të cilën vë bast.",
        "Eine Seite für ein Team: ein oder zwei Ziele pro Perspektive, jedes mit Kennzahl und Zielwert, dazu eine Zeile für den Pfeil, auf den Sie setzen."),
      blocks: [
        { type: "form", items: [
          { h: x("Financial", "Financiare", "Finanzen"), hint: x("objective · measure · target", "objektivi · masa · vlera e synuar", "Ziel · Kennzahl · Zielwert") },
          { h: x("Customer", "Klienti", "Kunden"), hint: x("objective · measure · target", "objektivi · masa · vlera e synuar", "Ziel · Kennzahl · Zielwert") },
          { h: x("Internal processes", "Proceset e brendshme", "Interne Prozesse"), hint: x("objective · measure · target", "objektivi · masa · vlera e synuar", "Ziel · Kennzahl · Zielwert") },
          { h: x("Learning and growth", "Të mësuarit dhe rritja", "Lernen und Entwicklung"), hint: x("objective · measure · target", "objektivi · masa · vlera e synuar", "Ziel · Kennzahl · Zielwert") },
          { h: x("The arrow we are betting on", "Shigjeta mbi të cilën vëmë bast", "Der Pfeil, auf den wir setzen"), hint: x("if we do this, that moves within … months", "nëse bëjmë këtë, ajo lëviz brenda … muajve", "wenn wir dies tun, bewegt sich das binnen … Monaten"), lines: 2 },
          { h: x("Review", "Rishikimi", "Überprüfung"), hint: x("date, who reads it, what we drop if nothing moves", "data, kush e lexon, çfarë heqim nëse s'lëviz asgjë", "Datum, wer liest, was wir streichen, wenn sich nichts bewegt") },
        ] },
      ],
      note: x(
        "A practice the editors propose, built on Kaplan and Norton's four perspectives and strategy map.",
        "Praktikë që e propozon redaksia, e ndërtuar mbi katër perspektivat dhe hartën e strategjisë të Kaplan-it dhe Norton-it.",
        "Ein Vorschlag der Redaktion, aufgebaut auf den vier Perspektiven und der Strategielandkarte von Kaplan und Norton."),
      source: ["kaplan-norton-2000"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
