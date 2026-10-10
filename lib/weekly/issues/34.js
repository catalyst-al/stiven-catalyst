// Management Review, No. 34: Recognition that works. Block: People.
// Facts and their sources: docs/revista/management-review-nr-34.md.
import { x, pc } from "../common.js";

export default {
  number: 34,
  block: "people",
  date: x("October 2026", "Tetor 2026", "Oktober 2026"),
  theme: [x("Recognition", "Mirënjohja", "Anerkennung,"), x("that works", "që funksionon", "die wirkt")],
  sub: x(
    "How few feel recognised enough, who gives the recognition people remember, the five pillars of Gallup and Workhuman, what field experiments show, what recognition is worth, and a card for recognition that lands.",
    "Sa pak ndihen mjaftueshëm të vlerësuar, nga kush vjen mirënjohja që mbahet mend, pesë shtyllat e Gallup dhe Workhuman, çfarë tregojnë eksperimentet në terren, sa vlen mirënjohja, dhe një kartë për mirënjohjen që arrin.",
    "Wie wenige sich genug anerkannt fühlen, von wem die Anerkennung kommt, an die man sich erinnert, die fünf Säulen von Gallup und Workhuman, was Feldexperimente zeigen, was Anerkennung wert ist, und eine Karte für Anerkennung, die ankommt."),
  seo: x(
    "Recognition that works: Gallup's 22%, who gives the praise people remember, five pillars, field experiments, what it is worth and a card.",
    "Mirënjohja që funksionon: 22% e Gallup, kush jep lavdërimin që mbahet mend, pesë shtylla, eksperimente në terren, sa vlen dhe një kartë.",
    "Anerkennung, die wirkt: Gallups 22 %, wer das Lob gibt, an das man sich erinnert, fünf Säulen, Feldexperimente, ihr Wert und eine Karte."),
  feature: x(
    "Issue 34 starts with the finding of Gallup and Workhuman that only 22% of US employees strongly agree they get the right amount of recognition, asks who gives the recognition people remember, sets out the five pillars of recognition that works, looks at field experiments in which a card helped and an award did harm, weighs Gallup's estimate of what recognition is worth, and ends with a card for recognition that lands.",
    "Numri 34 nis me gjetjen e Gallup dhe Workhuman se vetëm 22% e punonjësve në SHBA pajtohen fuqishëm se marrin mirënjohjen e duhur, pyet nga kush vjen mirënjohja që njerëzit e mbajnë mend, shtjellon pesë shtyllat e mirënjohjes që funksionon, shikon eksperimente në terren ku një kartolinë ndihmoi dhe një çmim dëmtoi, mat vlerësimin e Gallup për sa vlen mirënjohja, dhe mbyllet me një kartë për mirënjohjen që arrin.",
    "Ausgabe 34 beginnt mit dem Befund von Gallup und Workhuman, dass nur 22 % der Beschäftigten in den USA voll zustimmen, die richtige Menge Anerkennung zu bekommen, fragt, von wem die Anerkennung kommt, an die man sich erinnert, stellt die fünf Säulen wirksamer Anerkennung vor, betrachtet Feldexperimente, in denen eine Karte half und eine Auszeichnung schadete, wägt Gallups Schätzung zum Wert von Anerkennung ab und endet mit einer Karte für Anerkennung, die ankommt."),
  figure: { n: pc(22), by: "Gallup & Workhuman, 2024", t: x(
    "of US employees strongly agree that they get the right amount of recognition for the work they do.",
    "e punonjësve në SHBA pajtohen fuqishëm se marrin mirënjohjen e duhur për punën që bëjnë.",
    "der Beschäftigten in den USA stimmen voll zu, für ihre Arbeit die richtige Menge Anerkennung zu bekommen.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("Enough recognition?", "Mirënjohje e mjaftueshme?", "Genug Anerkennung?") },
    { page: "model", kicker: x("The model", "Modeli", "Das Modell"),
      title: x("Five pillars", "Pesë shtylla", "Fünf Säulen") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The recognition card", "Karta e mirënjohjes", "Die Anerkennungskarte") },
  ],
  sources: ["gallup-workhuman-2024", "gallup-recognition-2016", "euosha-pulse-2025", "gallup-workhuman-2023", "kosfeld-neckermann-2011", "bradler-2016", "gubler-2016", "deci-1999"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Recognition costs little and most managers give it, yet it often misses. This issue looks at how much of it people get, from whom, what makes it work, and when an award does more harm than good.",
        "Mirënjohja kushton pak dhe shumica e menaxherëve e japin, por shpesh nuk arrin. Ky numër shikon sa prej saj marrin njerëzit, nga kush, çfarë e bën të funksionojë, dhe kur një çmim bën më shumë dëm se mirë.",
        "Anerkennung kostet wenig, und die meisten Führungskräfte geben sie, doch oft verfehlt sie ihr Ziel. Diese Ausgabe zeigt, wie viel davon Menschen bekommen, von wem, was sie wirksam macht und wann eine Auszeichnung mehr schadet als nützt."),
      body: x(
        "In 2024 only 22% of US employees strongly agreed that they get the right amount of recognition for their work; in Europe about one in three workers feel their efforts go unnoticed. The recognition people remember most often comes from their manager. Gallup and Workhuman describe five pillars of recognition that works. In field experiments a thank-you card and a symbolic award raised performance, while an attendance award lowered the efficiency of those who already came reliably. Gallup estimates what a business could gain if twice as many people heard praise each week.",
        "Në 2024 vetëm 22% e punonjësve në SHBA pajtoheshin fuqishëm se marrin mirënjohjen e duhur për punën; në Evropë rreth një në tre të punësuar ndiejnë se përpjekjet e tyre nuk vihen re. Mirënjohja që njerëzit e mbajnë mend më shpesh vjen nga menaxheri. Gallup dhe Workhuman përshkruajnë pesë shtylla të mirënjohjes që funksionon. Në eksperimente në terren, një kartolinë falënderimi dhe një çmim simbolik e rritën rendimentin, ndërsa një çmim për praninë e uli efikasitetin e atyre që vinin rregullisht edhe më parë. Gallup vlerëson sa mund të fitojë një biznes nëse dyfishohen ata që dëgjojnë lavdërim çdo javë.",
        "2024 stimmten nur 22 % der Beschäftigten in den USA voll zu, für ihre Arbeit die richtige Menge Anerkennung zu bekommen; in Europa hat etwa jeder Dritte das Gefühl, dass der eigene Einsatz nicht gesehen wird. Die Anerkennung, an die man sich erinnert, kommt am häufigsten von der Führungskraft. Gallup und Workhuman beschreiben fünf Säulen wirksamer Anerkennung. In Feldexperimenten steigerten eine Dankeskarte und eine symbolische Auszeichnung die Leistung, eine Anwesenheitsprämie senkte die Effizienz derer, die schon zuverlässig kamen. Gallup schätzt, was ein Unternehmen gewinnen könnte, wenn doppelt so viele jede Woche Lob hörten."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("Enough", "Mirënjohje", "Genug"), x("recognition?", "e mjaftueshme?", "Anerkennung?")],
      lead: x(
        "In spring 2024 Gallup and Workhuman asked employed adults in the United States about recognition at work. Only 22% strongly agreed that they get the right amount, the same share as in 2022.",
        "Në pranverën e 2024, Gallup dhe Workhuman pyetën të punësuar në SHBA për mirënjohjen në punë. Vetëm 22% u pajtuan fuqishëm se marrin aq sa duhet, njësoj si në 2022.",
        "Im Frühjahr 2024 befragten Gallup und Workhuman Erwerbstätige in den USA zur Anerkennung bei der Arbeit. Nur 22 % stimmten voll zu, genug davon zu bekommen, genauso viele wie 2022."),
      blocks: [
        { type: "donut", v: 22, n: pc(22), source: ["gallup-workhuman-2024"], t: x(
          "strongly agree that they get the right amount of recognition for the work they do.",
          "pajtohen fuqishëm se marrin mirënjohjen e duhur për punën që bëjnë.",
          "stimmen voll zu, für ihre Arbeit die richtige Menge Anerkennung zu bekommen.") },
        { type: "figures", compact: true, items: [
          { n: pc(55), t: x("receive no recognition at all, or recognition that meets none of the five pillars on page 5", "nuk marrin fare mirënjohje, ose marrin mirënjohje që nuk plotëson asnjë nga pesë shtyllat te faqja 5", "bekommen keine Anerkennung oder eine, die keine der fünf Säulen auf Seite 5 erfüllt") },
          { n: pc(11), t: x("say someone at their workplace has ever asked how they like to be recognised", "thonë se dikush në punë i ka pyetur ndonjëherë si duan të vlerësohen", "sagen, dass jemand bei der Arbeit sie je gefragt hat, wie sie anerkannt werden möchten") },
          { n: pc(13), t: x("strongly agree they know how others at work like to be recognised", "pajtohen fuqishëm se e dinë si duan të vlerësohen të tjerët në punë", "stimmen voll zu, zu wissen, wie andere bei der Arbeit anerkannt werden möchten") },
        ] },
        { type: "callout", reading: true, text: x(
          "Most of the 55% do hear a thank you. What is missing is recognition that fits the person and the work.",
          "Shumica e këtyre 55% e dëgjojnë një faleminderit. Ajo që mungon është mirënjohja që i përshtatet njeriut dhe punës.",
          "Die meisten dieser 55 % hören durchaus ein Danke. Was fehlt, ist Anerkennung, die zur Person und zur Arbeit passt.") },
      ],
      note: x(
        "A US panel and self-reports; most results come from 4,439 people asked in April 2024. That the 22% is unchanged since 2022 is Gallup's statement in an article on the report.",
        "Panel në SHBA dhe vetëdeklarime; shumica e rezultateve vijnë nga 4.439 vetë të pyetur në prill 2024. Se 22% nuk ka ndryshuar që nga 2022 e thotë Gallup në një artikull për raportin.",
        "Ein US-Panel und Selbstauskünfte; die meisten Ergebnisse stammen von 4.439 Befragten im April 2024. Dass die 22 % seit 2022 unverändert sind, schreibt Gallup in einem Artikel zum Bericht."),
      source: ["gallup-workhuman-2024"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("Who people", "Kë mbajnë", "Wen man in"), x("remember", "mend njerëzit", "Erinnerung behält")],
      lead: x(
        "Gallup asked employees in a workplace survey to recall who gave them their most meaningful and memorable recognition. The answers, as Gallup published them in 2016:",
        "Në një anketë për vendin e punës, Gallup u kërkoi punonjësve të kujtonin kush u kishte dhënë mirënjohjen më kuptimplote dhe më të paharrueshme. Përgjigjet, siç i botoi Gallup në 2016:",
        "In einer Arbeitsplatzumfrage bat Gallup Beschäftigte, sich zu erinnern, wer ihnen die bedeutsamste und einprägsamste Anerkennung gegeben hatte. Die Antworten, wie Gallup sie 2016 veröffentlichte:"),
      blocks: [
        { type: "hbars", max: 30, source: ["gallup-recognition-2016"],
          label: x("Who gave the most memorable recognition (Gallup, 2016)", "Kush dha mirënjohjen më të paharrueshme (Gallup, 2016)", "Wer die einprägsamste Anerkennung gab (Gallup, 2016)"),
          items: [
            { k: x("Manager", "Menaxheri", "Führungskraft"), v: 28, n: pc(28), alert: true },
            { k: x("Senior leader or CEO", "Drejtues i lartë ose CEO", "Topführung oder CEO"), v: 24, n: pc(24) },
            { k: x("Manager's manager", "Menaxheri i menaxherit", "Nächsthöhere Führungskraft"), v: 12, n: pc(12) },
            { k: x("Customer", "Klienti", "Kunde"), v: 10, n: pc(10) },
            { k: x("Peers", "Kolegët", "Kollegen"), v: 9, n: pc(9) },
            { k: x("Other", "Të tjerë", "Andere"), v: 17, n: pc(17) },
          ] },
        { type: "p", text: x(
          "Day to day the picture is different. In 2024, 46% of US employees said a peer recognises them at least a few times a month, and 38% said the same of a manager. In EU-OSHA's 2025 telephone survey of over 28,000 workers in Europe, about one in three felt their efforts go unnoticed.",
          "Në punën e përditshme pamja është ndryshe. Në 2024, 46% e punonjësve në SHBA thanë se një koleg i vlerëson të paktën disa herë në muaj, dhe 38% thanë të njëjtën gjë për një menaxher. Në anketën telefonike të EU-OSHA në 2025, me mbi 28.000 të punësuar në Evropë, rreth një në tre ndienin se përpjekjet e tyre nuk vihen re.",
          "Im Arbeitsalltag sieht es anders aus. 2024 sagten 46 % der Beschäftigten in den USA, dass Kollegen sie mindestens einige Male im Monat anerkennen, 38 % sagten das von einer Führungskraft. In der Telefonumfrage von EU-OSHA 2025 mit über 28.000 Beschäftigten in Europa hatte etwa jeder Dritte das Gefühl, dass der eigene Einsatz nicht gesehen wird.") },
        { type: "callout", reading: true, text: x(
          "Peers give recognition more often; the manager's is the one people remember most often. A team needs both.",
          "Kolegët vlerësojnë më shpesh; mirënjohjen e menaxherit njerëzit e mbajnë mend më shpesh. Një ekipi i duhen të dyja.",
          "Kollegen erkennen öfter an; an die Anerkennung der Führungskraft erinnert man sich am häufigsten. Ein Team braucht beides.") },
      ],
      note: x(
        "Gallup gives no sample or year for the question on memorable recognition; the six answers add up to 100%. Self-reports; for Albania we have no comparable figure.",
        "Gallup nuk jep mostër as vit për pyetjen e mirënjohjes së paharrueshme; gjashtë përgjigjet bëjnë 100%. Vetëdeklarime; për Shqipërinë s'kam shifër të krahasueshme.",
        "Gallup nennt für die Frage nach der einprägsamsten Anerkennung weder Stichprobe noch Jahr; die sechs Antworten ergeben 100 %. Selbstauskünfte; für Albanien liegt uns keine vergleichbare Zahl vor."),
      source: ["gallup-recognition-2016", "gallup-workhuman-2024", "euosha-pulse-2025"],
    },
    {
      id: "model", more: "leading-people-without-losing-the-person",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Five pillars", "Pesë shtylla", "Fünf Säulen"), x("of recognition", "të mirënjohjes", "der Anerkennung")],
      lead: x(
        "Gallup and Workhuman describe five pillars of strategic recognition. In their words, recognition has the most impact when it is fulfilling, authentic, personalised, equitable and embedded in the culture.",
        "Gallup dhe Workhuman përshkruajnë pesë shtylla të mirënjohjes strategjike. Sipas tyre, mirënjohja ka më shumë ndikim kur është e mjaftueshme, e sinqertë, e personalizuar, e drejtë dhe e rrënjosur në kulturë.",
        "Gallup und Workhuman beschreiben fünf Säulen strategischer Anerkennung. Nach ihren Worten wirkt Anerkennung am stärksten, wenn sie angemessen, echt, persönlich, gerecht und in der Kultur verankert ist."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("Fulfilling", "E mjaftueshme", "Angemessen"), p: x("the amount and the form fit the accomplishment", "sasia dhe forma i përshtaten arritjes", "Menge und Form passen zur Leistung") },
          { h: x("Authentic", "E sinqertë", "Echt"), p: x("it feels genuine, not like a box to tick", "ndihet e vërtetë, jo si detyrë për t'u shënuar", "sie wirkt aufrichtig, nicht wie eine Pflichtübung") },
          { h: x("Personalised", "E personalizuar", "Persönlich"), p: x("it comes the way the person wants to be recognised", "vjen ashtu si do njeriu të vlerësohet", "sie kommt so, wie die Person anerkannt werden möchte") },
          { h: x("Equitable", "E drejtë", "Gerecht"), p: x("it is about achievement, without favourites", "lidhet me arritjen, pa të preferuar", "es geht um Leistung, ohne Günstlinge") },
          { h: x("Embedded", "E rrënjosur", "Verankert"), p: x("it is part of the values and of everyday work", "është pjesë e vlerave dhe e punës së përditshme", "sie gehört zu den Werten und zum Arbeitsalltag") },
        ] },
        { type: "p", text: x(
          "In their 2024 report, employees whose recognition met even one pillar were 2.9 times as likely to be engaged as those whose recognition met none; with four or more, 9.0 times. Following 3,447 employees from 2022 to 2024, they found that the well-recognised, whose recognition met at least four pillars, were 45% less likely to have left two years later.",
          "Në raportin e tyre të 2024, punonjësit mirënjohja e të cilëve plotësonte qoftë edhe një shtyllë kishin 2,9 herë më shumë gjasa të ishin të angazhuar se ata me mirënjohje që s'plotësonte asnjë; me katër ose më shumë, 9,0 herë. Duke ndjekur 3.447 punonjës nga 2022 deri në 2024, gjetën se të vlerësuarit mirë, me mirënjohje që plotësonte të paktën katër shtylla, kishin 45% më pak gjasa të ishin larguar pas dy vjetësh.",
          "In ihrem Bericht von 2024 waren Beschäftigte, deren Anerkennung auch nur eine Säule erfüllte, 2,9-mal so häufig engagiert wie jene, deren Anerkennung keine erfüllte; bei vier oder mehr 9,0-mal. Bei 3.447 Beschäftigten, die sie von 2022 bis 2024 begleiteten, hatten die gut Anerkannten, deren Anerkennung mindestens vier Säulen erfüllte, zwei Jahre später mit 45 % geringerer Wahrscheinlichkeit gekündigt.") },
        { type: "callout", reading: true, text: x(
          "The pillars describe how recognition is received, not how often it is given. Whether it worked is decided by the person who gets it.",
          "Shtyllat përshkruajnë si merret mirënjohja, jo sa shpesh jepet. Nëse funksionoi e vendos njeriu që e merr.",
          "Die Säulen beschreiben, wie Anerkennung ankommt, nicht wie oft sie gegeben wird. Ob sie wirkt, entscheidet die Person, die sie bekommt.") },
      ],
      note: x(
        "Correlations from a US panel, studied with Workhuman, a firm that sells recognition software. The 45% comes from following the same people over time, but it is still not proof of cause.",
        "Korrelacione nga një panel në SHBA, të studiuara bashkë me Workhuman, një firmë që shet softuer mirënjohjeje. 45% vjen nga ndjekja e të njëjtëve njerëz në kohë, por sërish nuk është provë shkaku.",
        "Korrelationen aus einem US-Panel, untersucht mit Workhuman, einer Firma, die Anerkennungssoftware verkauft. Die 45 % stammen aus der Begleitung derselben Personen über die Zeit, sind aber trotzdem kein Beweis der Ursache."),
      source: ["gallup-workhuman-2024", "gallup-workhuman-2023"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("A card helps,", "Kartolina ndihmon,", "Eine Karte hilft,"), x("an award can harm", "çmimi mund të dëmtojë", "ein Preis kann schaden")],
      lead: x(
        "Surveys show correlations. Field experiments and a meta-analysis have tested recognition and rewards more directly, with effects in both directions.",
        "Anketat tregojnë korrelacione. Eksperimente në terren dhe një meta-analizë e kanë provuar më drejtpërdrejt mirënjohjen dhe shpërblimet, me efekte në të dy drejtimet.",
        "Umfragen zeigen Zusammenhänge. Feldexperimente und eine Metaanalyse prüften Anerkennung und Belohnungen direkter, mit Wirkungen in beide Richtungen."),
      blocks: [
        { type: "figures", compact: true, items: [
          { n: x("≈ 12%", "≈ 12%", "≈ 12 %"), t: x("better performance when students could win a purely symbolic award (Kosfeld & Neckermann, 2011)", "rendiment më i mirë kur studentët mund të fitonin një çmim thjesht simbolik (Kosfeld & Neckermann, 2011)", "bessere Leistung, wenn Studierende eine rein symbolische Auszeichnung gewinnen konnten (Kosfeld & Neckermann, 2011)") },
          { n: x("−8%", "−8%", "−8 %"), t: x("efficiency at daily tasks for workers with good attendance, after a laundry plant brought in an attendance award (Gubler et al., 2016)", "efikasitet në detyrat ditore te punëtorët me prani të mirë, pasi një lavanderi vendosi një çmim për praninë (Gubler et al., 2016)", "Effizienz bei täglichen Aufgaben derer mit guter Anwesenheit, nachdem eine Wäscherei eine Anwesenheitsprämie einführte (Gubler et al., 2016)") },
          { n: x("d = 0.33", "d = 0,33", "d = 0,33"), t: x("effect of positive feedback on intrinsic motivation (Deci et al., 1999)", "efekti i feedback-ut pozitiv te motivimi i brendshëm (Deci et al., 1999)", "Wirkung von positivem Feedback auf die intrinsische Motivation (Deci et al., 1999)") },
        ] },
        { type: "p", text: x(
          "Christiane Bradler and colleagues hired over 300 people for a three-hour data-entry job and, after two hours, handed some an unannounced thank-you card. Performance rose, most when only the best got one, and mostly among those without one. The laundry award, a $75 gift card drawn among workers with perfect attendance, was also gamed. In Deci's meta-analysis of 128 studies, tangible and expected rewards lowered intrinsic motivation.",
          "Christiane Bradler dhe kolegët punësuan mbi 300 vetë për tri orë futje të dhënash dhe, pas dy orësh, u dhanë disave një kartolinë falënderimi pa paralajmërim. Rendimenti u rrit, më shumë kur kartolinën e merrnin vetëm më të mirët, dhe kryesisht te ata që nuk e morën. Çmimi i lavanderisë, një kartë dhuratë 75 dollarë e shortuar mes atyre me prani të përsosur, u përdor edhe me hile. Te meta-analiza e Deci-t me 128 studime, shpërblimet materiale dhe të pritura e ulën motivimin e brendshëm.",
          "Christiane Bradler und Kollegen stellten über 300 Personen für drei Stunden Dateneingabe ein; nach zwei Stunden bekamen einige unangekündigt eine Dankeskarte. Die Leistung stieg, am stärksten, wenn nur die Besten eine bekamen, vor allem bei denen ohne Karte. Die Prämie der Wäscherei, ein unter allen mit perfekter Anwesenheit verloster Gutschein über 75 Dollar, wurde zudem ausgetrickst. In Decis Metaanalyse von 128 Studien senkten materielle und erwartete Belohnungen die intrinsische Motivation.") },
        { type: "callout", reading: true, text: x(
          "Words and symbols can work. A prize tied to one measure can teach people to chase the measure, and those who already did well to feel overlooked.",
          "Fjalët dhe simbolet mund të funksionojnë. Një çmim i lidhur me një tregues të vetëm mund t'i mësojë njerëzit të ndjekin treguesin, dhe ata që punonin mirë edhe më parë të ndihen të anashkaluar.",
          "Worte und Symbole können wirken. Ein Preis für eine einzige Kennzahl lehrt leicht, der Kennzahl nachzujagen, und lässt die schon Guten sich übergangen fühlen.") },
      ],
      note: x(
        "Short tasks, students, one plant: the experiments show that recognition can matter, not how much it will in your team. The −8% applies to workers whose attendance was above average before the award.",
        "Detyra të shkurtra, studentë, një fabrikë: eksperimentet tregojnë se mirënjohja mund të ketë rëndësi, jo sa do të ketë në ekipin tënd. −8% vlen për punëtorët me prani mbi mesataren para çmimit.",
        "Kurze Aufgaben, Studierende, ein Werk: Die Experimente zeigen, dass Anerkennung wirken kann, nicht wie stark im eigenen Team. Die −8 % gelten für Beschäftigte mit überdurchschnittlicher Anwesenheit vor der Prämie."),
      source: ["kosfeld-neckermann-2011", "bradler-2016", "gubler-2016", "deci-1999"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie man es misst"),
      title: [x("What recognition", "Sa vlen", "Was Anerkennung"), x("is worth", "mirënjohja", "wert ist")],
      lead: x(
        "Gallup estimated what the median business in its database could gain if twice as many employees strongly agreed that they had received recognition or praise for good work in the last seven days: one in two instead of one in four.",
        "Gallup vlerësoi sa mund të fitonte biznesi mesatar në bazën e tij të të dhënave nëse dyfishoheshin punonjësit që pajtohen fuqishëm se kanë marrë mirënjohje ose lavdërim për punë të mirë në shtatë ditët e fundit: një në dy në vend të një në katër.",
        "Gallup schätzte, was das mittlere Unternehmen seiner Datenbank gewinnen könnte, wenn doppelt so viele Beschäftigte voll zustimmten, in den letzten sieben Tagen Anerkennung oder Lob für gute Arbeit bekommen zu haben: jeder Zweite statt jeder Vierte."),
      blocks: [
        { type: "columns", max: 25, height: 110, source: ["gallup-workhuman-2023"],
          label: x("Estimated change if recognition doubled, median business", "Ndryshimi i vlerësuar nëse dyfishohet mirënjohja, biznesi mesatar", "Geschätzte Veränderung bei doppelter Anerkennung, mittleres Unternehmen"),
          items: [
            { k: x("Productivity", "Produktiviteti", "Produktivität"), v: 9, n: x("+9%", "+9%", "+9 %") },
            { k: x("Safety incidents", "Incidentet e sigurisë", "Sicherheitsvorfälle"), v: 22, n: x("−22%", "−22%", "−22 %"), alert: true },
            { k: x("Absenteeism", "Mungesat", "Fehlzeiten"), v: 22, n: x("−22%", "−22%", "−22 %"), alert: true },
          ] },
        { type: "p", text: x(
          "The estimate rests on Gallup's meta-analysis of 456 studies in 276 organisations, covering 2.7 million employees. Gallup warns that the three effects influence each other and cannot be added up. In a team, recognition can be counted without a survey:",
          "Vlerësimi mbështetet te meta-analiza e Gallup me 456 studime në 276 organizata, me 2,7 milionë punonjës. Gallup paralajmëron se tre efektet ndikojnë te njëri-tjetri dhe nuk mblidhen. Në një ekip, mirënjohja mund të numërohet edhe pa anketë:",
          "Die Schätzung stützt sich auf Gallups Metaanalyse von 456 Studien in 276 Organisationen mit 2,7 Millionen Beschäftigten. Gallup warnt, dass sich die drei Wirkungen gegenseitig beeinflussen und nicht addiert werden dürfen. In einem Team lässt sich Anerkennung auch ohne Umfrage zählen:") },
        { type: "box", title: x("Three things to count", "Tri gjëra për t'u numëruar", "Drei Dinge zum Zählen"), items: [
          x("how many people were asked how they like to be recognised", "sa njerëz janë pyetur si duan të vlerësohen", "wie viele gefragt wurden, wie sie anerkannt werden möchten"),
          x("who was recognised this month, and who was not", "kush u vlerësua këtë muaj, dhe kush jo", "wer diesen Monat anerkannt wurde, und wer nicht"),
          x("what for: results, help to colleagues, safety, learning", "për çfarë: rezultate, ndihmë për kolegët, siguri, të mësuar", "wofür: Ergebnisse, Hilfe für Kollegen, Sicherheit, Lernen"),
        ] },
      ],
      note: x(
        "An estimate from correlations, made with a firm that sells recognition software. Gallup's survey item may not be reused without its consent. The list is the editors'.",
        "Vlerësim nga korrelacione, i bërë bashkë me një firmë që shet softuer mirënjohjeje. Pyetja e anketës së Gallup nuk mund të ripërdoret pa lejen e tij. Lista është e redaksisë.",
        "Eine Schätzung aus Korrelationen, erstellt mit einer Firma, die Anerkennungssoftware verkauft. Gallups Umfragefrage darf ohne seine Zustimmung nicht verwendet werden. Die Liste stammt von der Redaktion."),
      source: ["gallup-workhuman-2023"],
    },
    {
      id: "tool", tool: "/tools/shift-pulse/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The recognition", "Karta e", "Die Anerkennungs-"), x("card", "mirënjohjes", "karte")],
      lead: x(
        "One card, one person, once a week. Shift Pulse shows by day or week where a number improved; the card asks who made it happen and how to thank them. Once a month, look back at who was recognised.",
        "Një kartë, një njeri, një herë në javë. Shift Pulse tregon sipas ditës ose javës ku u përmirësua një shifër; karta pyet kush e bëri të ndodhë dhe si ta falënderosh. Një herë në muaj, shiko pas kush u vlerësua.",
        "Eine Karte, eine Person, einmal pro Woche. Shift Pulse zeigt nach Tag oder Woche, wo sich eine Zahl verbessert hat; die Karte fragt, wer das bewirkt hat und wie man dankt. Einmal im Monat zurückschauen, wer anerkannt wurde."),
      blocks: [
        { type: "form", items: [
          { h: x("Who", "Kush", "Wer"), hint: x("the person or the team, role and shift", "njeriu ose ekipi, roli dhe turni", "Person oder Team, Rolle und Schicht") },
          { h: x("What exactly", "Çfarë saktësisht", "Was genau"), hint: x("what they did, in one sentence, with the date", "çfarë bënë, në një fjali, me datën", "was sie getan haben, in einem Satz, mit Datum") },
          { h: x("Why it mattered", "Pse kishte rëndësi", "Warum es zählte"), hint: x("for the customer, the team, safety or a goal", "për klientin, ekipin, sigurinë ose një objektiv", "für Kunden, Team, Sicherheit oder ein Ziel") },
          { h: x("How they like it", "Si e duan", "Wie sie es mögen"), hint: x("asked? in private or before the team, spoken or written", "i pyete? vetëm ose para ekipit, me gojë apo me shkrim", "gefragt? unter vier Augen oder vor dem Team, mündlich oder schriftlich") },
          { h: x("Fairness check", "Kontrolli i drejtësisë", "Fairness-Check"), hint: x("who else contributed; who has not been recognised for a while", "kush tjetër kontribuoi; kush nuk është vlerësuar prej kohësh", "wer noch beigetragen hat; wer lange nicht anerkannt wurde") },
          { h: x("Said", "U tha", "Gesagt"), hint: x("when, by whom, how it was received", "kur, nga kush, si u prit", "wann, von wem, wie es ankam") },
        ] },
      ],
      note: x(
        "A practice proposed by the editors, after the five pillars of Gallup and Workhuman and the experiments on page 6. It does not replace fair pay or promotion.",
        "Praktikë e propozuar nga redaksia, sipas pesë shtyllave të Gallup dhe Workhuman dhe eksperimenteve te faqja 6. Nuk zëvendëson pagën e drejtë ose promovimin.",
        "Eine Praxis, die die Redaktion vorschlägt, nach den fünf Säulen von Gallup und Workhuman und den Experimenten auf Seite 6. Sie ersetzt weder faire Bezahlung noch Beförderung."),
      source: ["gallup-workhuman-2024", "gubler-2016"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
