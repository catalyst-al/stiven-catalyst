// Management Review, No. 59: S&OP, demand and capacity in one plan. Block: Strategy.
// Facts and their sources: docs/revista/management-review-nr-59.md. The Leitax figures come from the 2007 working
// paper of Oliva & Watson; the article appeared in Production and Operations Management in 2009.
import { x, pc } from "../common.js";

export default {
  number: 59,
  block: "strategy",
  date: x("November 2026", "Nëntor 2026", "November 2026"),
  theme: [x("S&OP:", "S&OP:", "S&OP:"), x("demand and capacity in one plan", "kërkesa dhe kapaciteti në një plan", "Nachfrage und Kapazität in einem Plan")],
  sub: x(
    "A company with a forecast for every department, what one monthly plan changed there, the five steps of S&OP, what reviews of the research find, how to measure the process and an agenda card.",
    "Një kompani me një parashikim për çdo departament, çfarë ndryshoi aty një plan mujor, pesë hapat e S&OP-së, çfarë gjejnë shqyrtimet e kërkimit, si matet procesi dhe një kartë për rendin e ditës.",
    "Ein Unternehmen mit einer Prognose je Abteilung, was ein monatlicher Plan dort änderte, die fünf Schritte von S&OP, was Übersichtsarbeiten finden, wie sich der Prozess messen lässt, und eine Karte für die Tagesordnung."),
  seo: x(
    "S&OP: one company's forecasts before and after a monthly plan, the five steps, what research reviews find, how to measure the process and an agenda card.",
    "S&OP: parashikimet e një kompanie para dhe pas një plani mujor, pesë hapat, çfarë gjejnë shqyrtimet, si matet procesi dhe një kartë për takimin.",
    "S&OP: Prognosen eines Unternehmens vor und nach einem Monatsplan, die fünf Schritte, Befunde der Forschung, Messung des Prozesses, eine Karte."),
  feature: x(
    "At a consumer electronics company, sales, operations and finance each kept their own forecast; Issue 59 follows what a monthly consensus process changed there. It sets out the five steps of sales and operations planning and weighs what reviews of the research find about maturity and results. It then asks how the process itself can be measured, and closes with a card for the agenda of the monthly S&OP meeting.",
    "Në një kompani të elektronikës së konsumit, shitjet, operacionet dhe financat mbanin secila parashikimin e vet; Numri 59 ndjek çfarë ndryshoi aty një proces mujor konsensusi. Shtjellon pesë hapat e planifikimit të shitjeve dhe operacioneve dhe peshon çfarë gjejnë shqyrtimet e kërkimit për pjekurinë dhe rezultatet. Pastaj pyet si mund të matet vetë procesi, dhe mbyllet me një kartë për rendin e ditës së takimit mujor S&OP.",
    "In einem Unterhaltungselektronik-Unternehmen führten Vertrieb, Operations und Finanzen je eine eigene Prognose; Ausgabe 59 verfolgt, was ein monatlicher Konsensprozess dort änderte. Sie stellt die fünf Schritte der Absatz- und Produktionsplanung vor und wägt ab, was Übersichtsarbeiten über Reifegrad und Ergebnisse finden. Dann fragt sie, wie sich der Prozess selbst messen lässt, und schließt mit einer Karte für die Tagesordnung der monatlichen S&OP-Sitzung."),
  figure: { n: pc(88), by: "Oliva & Watson, 2009", t: x(
    "forecast accuracy three months ahead at one electronics company in autumn 2003, up from 58% in summer 2002, after it moved to one monthly plan.",
    "saktësia e parashikimit tre muaj përpara në një kompani elektronike në vjeshtën e 2003, nga 58% në verën e 2002, pasi kaloi në një plan të vetëm mujor.",
    "Prognosegenauigkeit drei Monate im Voraus bei einem Elektronikunternehmen im Herbst 2003, nach 58 % im Sommer 2002, nachdem es auf einen gemeinsamen Monatsplan umgestellt hatte.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("A forecast for every department", "Një parashikim për çdo departament", "Eine Prognose je Abteilung") },
    { page: "model", kicker: x("The model", "Modeli", "Das Modell"),
      title: x("Five steps, one plan", "Pesë hapa, një plan", "Fünf Schritte, ein Plan") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The S&OP meeting card", "Karta e takimit S&OP", "Die Karte für die S&OP-Sitzung") },
  ],
  sources: ["sop-oliva-watson-2009", "sop-apics-dictionary", "sop-apics-2015", "sop-ling-2023", "sop-thome-2012a", "sop-thome-2012b", "sop-grimson-pyke-2007", "sop-hulthen-2017"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Sales plans with one number, operations with another, finance with a third. When nobody puts them side by side, the gap surfaces later, as shortages or as stock nobody wanted. Sales and operations planning, S&OP, sets out to replace them with one plan for demand and capacity, agreed once a month.",
        "Shitjet planifikojnë me një numër, operacionet me një tjetër, financat me një të tretë. Kur askush nuk i vë krah për krah, hendeku del më vonë, si mungesë malli ose si stok që nuk e donte askush. Planifikimi i shitjeve dhe operacioneve, S&OP, synon t'i zëvendësojë me një plan të vetëm për kërkesën dhe kapacitetin, të rënë dakord një herë në muaj.",
        "Der Vertrieb plant mit einer Zahl, Operations mit einer anderen, die Finanzen mit einer dritten. Legt niemand sie nebeneinander, zeigt sich die Lücke später, als Engpass oder als Bestand, den niemand wollte. Sales and Operations Planning, kurz S&OP, will sie durch einen einzigen Plan für Nachfrage und Kapazität ersetzen, der einmal im Monat vereinbart wird."),
      body: x(
        "At Leitax, as researchers call a consumer electronics company, every department kept its own forecast. After a monthly consensus process, accuracy three months ahead rose from 58% to 88%. APICS describes S&OP as one integrated set of plans, built in five monthly steps. Reviews of the research find that few studies measure its effect on results, and a study of six companies shows why measuring the process itself is hard.",
        "Te Leitax, siç e quajnë studiuesit një kompani të elektronikës së konsumit, çdo departament mbante parashikimin e vet. Pas një procesi mujor konsensusi, saktësia tre muaj përpara u ngrit nga 58% në 88%. APICS e përshkruan S&OP-në si një grup të vetëm planesh të integruara, që ndërtohet çdo muaj në pesë hapa. Shqyrtimet e kërkimit gjejnë se pak studime e matin efektin e saj te rezultatet, dhe një studim në gjashtë kompani tregon pse është e vështirë të matet vetë procesi.",
        "Bei Leitax, wie Forscher ein Unterhaltungselektronik-Unternehmen nennen, führte jede Abteilung ihre eigene Prognose. Nach Einführung eines monatlichen Konsensprozesses stieg die Genauigkeit drei Monate im Voraus von 58 % auf 88 %. APICS beschreibt S&OP als einen einzigen Satz integrierter Pläne, erstellt in fünf monatlichen Schritten. Übersichtsarbeiten zeigen, dass wenige Studien die Wirkung auf Ergebnisse messen, und eine Studie in sechs Unternehmen zeigt, warum schon der Prozess schwer zu messen ist."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("A forecast for", "Një parashikim", "Eine Prognose"), x("every department", "për çdo departament", "je Abteilung")],
      lead: x(
        "Before 2001, demand planning at Leitax, a consumer electronics firm in northern California, was ill-defined. Sales directors made forecasts and passed them to operations and finance informally, sometimes in hallway conversations. Rogelio Oliva and Noel Watson describe what happened next.",
        "Para 2001, planifikimi i kërkesës te Leitax, një firmë e elektronikës së konsumit në Kaliforninë e Veriut, ishte i papërcaktuar. Drejtorët e shitjeve bënin parashikime dhe ua kalonin operacioneve dhe financave në mënyrë joformale, ndonjëherë në biseda nëpër korridor. Rogelio Oliva dhe Noel Watson përshkruajnë çfarë ndodhi më pas.",
        "Vor 2001 war die Bedarfsplanung bei Leitax, einem Unterhaltungselektronik-Unternehmen in Nordkalifornien, kaum geregelt. Vertriebsleiter erstellten Prognosen und gaben sie formlos an Operations und Finanzen weiter, manchmal zwischen Tür und Angel auf dem Flur. Rogelio Oliva und Noel Watson beschreiben, was dann geschah."),
      blocks: [
        { type: "cards", cols: 3, items: [
          { h: x("Sales", "Shitjet", "Vertrieb"), p: x("paid on sales into the shops, so its forecasts were suspected of running high", "paguheshin sipas shitjeve te dyqanet, ndaj parashikimet e tyre dyshoheshin si të fryra", "nach Verkäufen in den Handel bezahlt, daher standen seine Prognosen im Verdacht, zu hoch zu sein") },
          { h: x("Operations", "Operacionet", "Operations"), p: x("answerable for shortages, so it made its own forecast", "përgjigjeshin për mungesat, ndaj bënin parashikimin e tyre", "für Engpässe verantwortlich, daher mit eigener Prognose") },
          { h: x("Finance", "Financat", "Finanzen"), p: x("suspected of following market expectations and profit thresholds", "dyshohej se ndiqnin pritjet e tregut dhe pragjet e fitimit", "im Verdacht, sich an Markterwartungen und Gewinnschwellen zu orientieren") },
        ] },
        { type: "p", text: x(
          "Marketing, too, made its own figures when it expected a promotion. Then two product launches ran late and ended in an inventory write-off of about 10% of the revenue of fiscal 2001–02. A new chief executive and five new vice presidents arrived. In April 2002 a new director of planning started a project, and three analysts took over the forecasting process.",
          "Edhe marketingu nxirrte shifrat e veta kur priste një promocion. Pastaj dy produkte të reja dolën me vonesë dhe përfunduan me një zhvlerësim stoku prej rreth 10% të të ardhurave të vitit fiskal 2001–02. Erdhën një drejtor i ri ekzekutiv dhe pesë zëvendëspresidentë të rinj. Në prill 2002, një drejtor i ri i planifikimit nisi një projekt, dhe tre analistë e morën përsipër procesin e parashikimit.",
          "Auch das Marketing rechnete mit eigenen Zahlen, wenn es eine Aktion erwartete. Dann kamen zwei Produkte verspätet auf den Markt und endeten in einer Bestandsabschreibung von etwa 10 % des Umsatzes im Geschäftsjahr 2001–02. Ein neuer CEO und fünf neue Vice Presidents kamen ins Haus. Im April 2002 startete ein neuer Planungsdirektor ein Projekt, und drei Analysten übernahmen den Prognoseprozess.") },
        { type: "callout", reading: true, text: x(
          "Each forecast made sense for the department that made it. The company as a whole had none it could plan on.",
          "Çdo parashikim kishte kuptim për departamentin që e bënte. Kompania në tërësi nuk kishte asnjë mbi të cilin të planifikonte.",
          "Jede Prognose ergab Sinn für die Abteilung, die sie erstellte. Das Unternehmen als Ganzes hatte keine, auf die es seine Planung stützen konnte.") },
      ],
      note: x(
        "Leitax is a disguised name. The case rests on 25 interviews; the motives attributed to each department are what interviewees suspected, not a measured bias.",
        "Leitax është emër i maskuar. Rasti mbështetet në 25 intervista; motivet që i vishen çdo departamenti janë dyshimet e të intervistuarve, jo një anshmëri e matur.",
        "Leitax ist ein Deckname. Der Fall beruht auf 25 Interviews; die Motive der Abteilungen sind Vermutungen der Befragten, keine gemessene Verzerrung."),
      source: ["sop-oliva-watson-2009"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("From many forecasts", "Nga shumë parashikime", "Von vielen Prognosen"), x("to one", "në një", "zu einer")],
      lead: x(
        "By summer 2003 a monthly process was in place. Sales, product planning and the new demand group each made a forecast, the three were combined, and the group met every month to agree on one. Leitax's forecast accuracy three months ahead:",
        "Deri në verën e 2003, procesi mujor ishte ngritur. Shitjet, planifikimi i produkteve dhe grupi i ri i kërkesës bënin secili një parashikim, të tre bashkoheshin, dhe grupi takohej çdo muaj për të rënë dakord për një të vetëm. Saktësia e parashikimit të Leitax tre muaj përpara:",
        "Bis zum Sommer 2003 stand ein monatlicher Prozess. Vertrieb, Produktplanung und die neue Bedarfsgruppe erstellten je eine Prognose, die drei wurden zusammengeführt, und die Gruppe traf sich jeden Monat, um sich auf eine zu einigen. Die Prognosegenauigkeit von Leitax drei Monate im Voraus:"),
      blocks: [
        { type: "dumbbell", from: x("Summer 2002", "Verë 2002", "Sommer 2002"), to: x("Autumn 2003", "Vjeshtë 2003", "Herbst 2003"), min: 0, max: 100, rowH: 26, source: ["sop-oliva-watson-2009"],
          label: x("Forecast accuracy three months ahead, Leitax", "Saktësia e parashikimit tre muaj përpara, Leitax", "Prognosegenauigkeit drei Monate im Voraus, Leitax"),
          rows: [
            { k: x("Sales by the shops", "Shitjet e dyqaneve", "Abverkauf im Handel"), a: 58, an: pc(58), b: 88, bn: pc(88), alert: true },
            { k: x("Sales into the shops", "Shitjet te dyqanet", "Verkauf in den Handel"), a: 49, an: pc(49), b: 84, bn: pc(84) },
          ] },
        { type: "figures", compact: true, items: [
          { n: x("12 → 26", "12 → 26", "12 → 26"), t: x("inventory turns a year, Q4 2003 against the year before", "rrotullime të stokut në vit, tremujori IV 2003 kundrejt vitit të mëparshëm", "Lagerumschläge im Jahr, Q4 2003 gegenüber dem Vorjahr") },
          { n: x("$55M → $23M", "55 → 23 mln $", "55 → 23 Mio. $"), t: x("average inventory on hand", "stoku mesatar në magazinë", "durchschnittlicher Lagerbestand") },
        ] },
        { type: "callout", reading: true, text: x(
          "Nobody learned to guess better. The guesses were simply made in the open, side by side, and checked every month.",
          "Askush nuk mësoi të hamendësonte më mirë. Hamendësimet thjesht u bënë hapur, krah për krah, dhe u kontrolluan çdo muaj.",
          "Niemand lernte, besser zu schätzen. Die Schätzungen lagen nun offen nebeneinander und wurden jeden Monat überprüft.") },
      ],
      note: x(
        "Accuracy = 1 − |sales − forecast| / forecast. Through 2005 it averaged 85% for sales by the shops. These are one company's figures as the researchers report them: a case, not a controlled comparison.",
        "Saktësia = 1 − |shitjet − parashikimi| / parashikimi. Deri në 2005 mbeti mesatarisht 85% për shitjet e dyqaneve. Janë shifra të një kompanie, siç i raportojnë studiuesit: një rast, jo krahasim i kontrolluar.",
        "Genauigkeit = 1 − |Absatz − Prognose| / Prognose. Bis 2005 lag sie beim Abverkauf im Schnitt bei 85 %. Es sind Zahlen eines einzigen Unternehmens, wie die Forscher sie berichten: ein Fall, kein kontrollierter Vergleich."),
      source: ["sop-oliva-watson-2009"],
    },
    {
      id: "model", more: "high-volume-days",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Five steps,", "Pesë hapa,", "Fünf Schritte,"), x("one plan", "një plan", "ein Plan")],
      lead: x(
        "S&OP is credited to Dick Ling, who ran the first S&OP class at the consultancy Oliver Wight in 1985. The APICS Dictionary describes a process that brings all of a business's plans, from sales and marketing to manufacturing, sourcing and finance, into one integrated set, at least once a month and by product family.",
        "S&OP-ja i atribuohet Dick Ling-ut, që dha kursin e parë për të te firma konsulente Oliver Wight në 1985. Fjalori i APICS e përshkruan si procesin që i bashkon të gjitha planet e një biznesi, nga shitjet dhe marketingu te prodhimi, furnizimi dhe financat, në një grup planesh të integruara, të paktën një herë në muaj dhe për çdo familje produktesh.",
        "S&OP geht auf Dick Ling zurück, der 1985 bei der Beratung Oliver Wight den ersten S&OP-Kurs hielt. Das APICS Dictionary beschreibt einen Prozess, der alle Pläne eines Unternehmens, von Vertrieb und Marketing bis Produktion, Beschaffung und Finanzen, mindestens monatlich und je Produktfamilie in einem integrierten Plansatz zusammenführt."),
      blocks: [
        { type: "steps", items: [
          { h: x("Sales forecast reports", "Raportet e parashikimit", "Prognoseberichte"), p: x("statistical forecasts and figures from the field", "parashikimet statistikore dhe shifrat nga terreni", "statistische Prognosen und Zahlen aus dem Außendienst") },
          { h: x("Demand planning", "Planifikimi i kërkesës", "Bedarfsplanung"), p: x("the management forecast for each family", "parashikimi i drejtimit për çdo familje", "die Prognose der Leitung je Familie") },
          { h: x("Supply planning", "Planifikimi i furnizimit", "Versorgungsplanung"), p: x("capacity set against demand, constraints marked", "kapaciteti përballë kërkesës, kufizimet të shënuara", "Kapazität gegen Nachfrage, Engpässe markiert") },
          { h: x("Pre-S&OP meeting", "Takimi para S&OP", "Pre-S&OP-Sitzung"), p: x("recommendations and the agenda for the executives", "rekomandimet dhe rendi i ditës për drejtuesit", "Empfehlungen und Tagesordnung für die Geschäftsleitung") },
          { h: x("Executive S&OP meeting", "Takimi i drejtuesve", "S&OP-Sitzung der Leitung"), p: x("one game plan for the whole company", "një plan i vetëm për gjithë kompaninë", "ein Gesamtplan für das ganze Unternehmen") },
        ] },
        { type: "callout", reading: true, text: x(
          "Capacity in the plan means what people, machines and vehicles can really do to standard. A headcount does not tell you that.",
          "Kapaciteti në plan do të thotë ajo që njerëzit, makineritë dhe automjetet mund të bëjnë vërtet sipas standardit. Numri i njerëzve nuk ta tregon këtë.",
          "Kapazität im Plan bedeutet, was Menschen, Maschinen und Fahrzeuge nach Standard wirklich leisten können. Die Kopfzahl allein verrät Ihnen das nicht.") },
      ],
      note: x(
        "The steps follow an APICS introduction to S&OP (2015), which plans volume rather than mix, over a rolling 18 months. The definition is from the APICS Dictionary, Ling's role from his author note (2023). The reading is the editors'.",
        "Hapat ndjekin një hyrje të APICS në S&OP (2015), që planifikon vëllimin dhe jo përzierjen, për 18 muaj që rrotullohen. Përkufizimi vjen nga fjalori i APICS, roli i Ling-ut nga shënimi i tij si autor (2023). Leximi është i redaksisë.",
        "Die Schritte folgen einer APICS-Einführung in S&OP (2015), die Volumen statt Mix plant, über rollierende 18 Monate. Die Definition stammt aus dem APICS Dictionary, Lings Rolle aus seiner Autorennotiz (2023). Die Deutung stammt von der Redaktion."),
      source: ["sop-apics-2015", "sop-apics-dictionary", "sop-ling-2023"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("One plan, little", "Një plan, pak", "Ein Plan, wenig"), x("proof of results", "prova për rezultatet", "Belege für Ergebnisse")],
      lead: x(
        "In 2012 Antônio Thomé and colleagues reviewed 271 papers on S&OP. Most of them expected one outcome above all: the plans of the departments brought together. In a second review of 55 papers they found that relatively few estimate the effect on the firm's performance.",
        "Në 2012, Antônio Thomé dhe kolegët shqyrtuan 271 punime për S&OP-në. Shumica prej tyre prisnin mbi të gjitha një rezultat: bashkimin e planeve të departamenteve. Në një shqyrtim të dytë me 55 punime gjetën se relativisht pak e vlerësojnë efektin te rezultatet e firmës.",
        "2012 sichteten Antônio Thomé und Kollegen 271 Arbeiten zu S&OP. Die meisten erwarteten vor allem ein Ergebnis: dass die Pläne der Abteilungen zusammengeführt werden. In einer zweiten Übersicht über 55 Arbeiten stellten sie fest, dass relativ wenige die Wirkung auf die Leistung des Unternehmens schätzen."),
      blocks: [
        { type: "chain", label: x("Five stages of S&OP maturity (Grimson & Pyke, 2007)", "Pesë fazat e pjekurisë së S&OP (Grimson & Pyke, 2007)", "Fünf Reifestufen von S&OP (Grimson & Pyke, 2007)"), items: [
          { h: x("No S&OP", "Pa S&OP", "Kein S&OP") },
          { h: x("Reactive", "Reaktive", "Reaktiv") },
          { h: x("Standard", "Standarde", "Standard") },
          { h: x("Advanced", "E përparuar", "Fortgeschritten") },
          { h: x("Proactive", "Proaktive", "Proaktiv") },
        ] },
        { type: "p", text: x(
          "In interviews with 15 companies, Andrew Grimson and David Pyke saw little link between firm size or type of process and how well plans were integrated. Business processes helped; information technology did not clearly help. Consensus carries its own risk: at Leitax in 2003 the agreed forecast ran too high for two products, and the write-offs came to more than 1% and 3% of lifetime materials cost.",
          "Në intervista me 15 kompani, Andrew Grimson dhe David Pyke panë pak lidhje mes madhësisë së firmës ose llojit të procesit dhe shkallës së integrimit të planeve. Proceset e punës ndihmuan; teknologjia e informacionit jo qartë. Edhe konsensusi ka rrezikun e vet: te Leitax në 2003, parashikimi i rënë dakord doli tepër i lartë për dy produkte, dhe zhvlerësimet arritën mbi 1% dhe 3% të kostos së materialeve për gjithë jetën e produktit.",
          "In Interviews mit 15 Unternehmen sahen Andrew Grimson und David Pyke kaum einen Zusammenhang zwischen Firmengröße oder Prozesstyp und dem Grad, in dem die Pläne integriert waren. Geschäftsprozesse halfen, Informationstechnik nicht eindeutig. Auch Konsens birgt ein Risiko: Bei Leitax lag die vereinbarte Prognose 2003 für zwei Produkte zu hoch, und die Abschreibungen erreichten über 1 % und 3 % der Materialkosten über die Lebensdauer.") },
        { type: "callout", reading: true, text: x(
          "The research supports S&OP as a road to one plan more than as a promise of results. And a shared plan can still be wrong, for everyone at once.",
          "Kërkimi e mbështet S&OP-në më shumë si rrugë drejt një plani të vetëm sesa si premtim rezultatesh. Dhe një plan i përbashkët mund të jetë prapë i gabuar, për të gjithë njëherësh.",
          "Die Forschung stützt S&OP eher als Weg zu einem gemeinsamen Plan denn als Versprechen von Ergebnissen. Und ein gemeinsamer Plan kann auch gemeinsam falsch sein.") },
      ],
      note: x(
        "Grimson and Pyke call their findings preliminary, from a small sample. The stage names are as cited by Hulthén et al. (2017). Oliva and Watson liken the Leitax missteps to groupthink.",
        "Grimson dhe Pyke i quajnë gjetjet e tyre paraprake, nga një mostër e vogël. Emrat e fazave janë siç i citojnë Hulthén et al. (2017). Oliva dhe Watson i krahasojnë gabimet e Leitax me mendimin në grup.",
        "Grimson und Pyke nennen ihre Befunde vorläufig, gestützt auf eine kleine Stichprobe. Die Namen der Stufen folgen Hulthén et al. (2017). Oliva und Watson vergleichen die Fehlgriffe bei Leitax mit Gruppendenken."),
      source: ["sop-thome-2012a", "sop-thome-2012b", "sop-grimson-pyke-2007", "sop-hulthen-2017", "sop-oliva-watson-2009"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie es gemessen wird"),
      title: [x("Two numbers,", "Dy numra,", "Zwei Zahlen,"), x("two owners", "dy përgjegjës", "zwei Verantwortliche")],
      lead: x(
        "Hana Hulthén, Dag Näslund and Andreas Norrman held 22 interviews in six companies run from Sweden, at maturity stages 2 to 4. Measures for trade-offs between departments were a challenge at every stage; measures aligned with strategy and rewards became one at stages 3 and 4.",
        "Hana Hulthén, Dag Näslund dhe Andreas Norrman zhvilluan 22 intervista në gjashtë kompani të drejtuara nga Suedia, në fazat 2 deri në 4 të pjekurisë. Masat për kompromiset mes departamenteve ishin sfidë në çdo fazë; masat në përputhje me strategjinë dhe shpërblimet u bënë sfidë në fazat 3 dhe 4.",
        "Hana Hulthén, Dag Näslund und Andreas Norrman führten 22 Interviews in sechs von Schweden aus geführten Unternehmen auf den Reifestufen 2 bis 4. Kennzahlen für Zielkonflikte zwischen Abteilungen waren auf jeder Stufe eine Herausforderung, Kennzahlen im Einklang mit Strategie und Anreizsystem auf den Stufen 3 und 4."),
      blocks: [
        { type: "cards", cols: 3, items: [
          { h: x("For the customer", "Për klientin", "Für den Kunden"), p: x("service level, forecast accuracy, delivery on time", "niveli i shërbimit, saktësia e parashikimit, dorëzimi në kohë", "Servicegrad, Prognosegenauigkeit, Termintreue") },
          { h: x("For resources", "Për burimet", "Für Ressourcen"), p: x("inventory, capacity, adherence to the supply plan", "stoku, kapaciteti, respektimi i planit të furnizimit", "Bestand, Kapazität, Einhaltung des Versorgungsplans") },
          { h: x("For the process", "Për procesin", "Für den Prozess"), p: x("who takes part, how the meeting runs, what it decides", "kush merr pjesë, si zhvillohet takimi, çfarë vendos", "wer teilnimmt, wie die Sitzung läuft, was sie entscheidet") },
        ] },
        { type: "example", label: x("Hypothetical example, one product family, one month", "Shembull hipotetik, një familje produktesh, një muaj", "Hypothetisches Beispiel: eine Produktfamilie, ein Monat"), rows: [
          { k: x("Demand", "Kërkesa", "Nachfrage"), v: x("forecast 1,000, sold 880: accuracy 88%", "parashikuar 1.000, shitur 880: saktësia 88%", "Prognose 1.000, verkauft 880: Genauigkeit 88 %") },
          { k: x("Supply", "Furnizimi", "Versorgung"), v: x("planned 1,000, made 940: adherence 94%", "planifikuar 1.000, prodhuar 940: respektimi 94%", "geplant 1.000, gefertigt 940: Planerfüllung 94 %") },
        ], text: x("Each number has its owner, and the meeting looks at both. The figures are made up.", "Çdo numër ka përgjegjësin e vet, dhe takimi i shqyrton të dy. Shifrat janë të sajuara.", "Jede Zahl hat ihre Verantwortlichen, und die Sitzung betrachtet beide. Die Zahlen sind erfunden.") },
      ],
      note: x(
        "The three groups follow the framework of Hulthén et al.; the examples in them are the editors'. Accuracy is computed as at Leitax, where the planning director chose a simple measure to show the direction.",
        "Tri grupet ndjekin kornizën e Hulthén et al.; shembujt brenda tyre janë të redaksisë. Saktësia llogaritet si te Leitax, ku drejtori i planifikimit zgjodhi një masë të thjeshtë për të treguar drejtimin.",
        "Die drei Gruppen folgen dem Rahmen von Hulthén et al.; die Beispiele darin stammen von der Redaktion. Die Genauigkeit wird wie bei Leitax berechnet, wo der Planungsdirektor ein einfaches Maß wählte, um die Richtung zu zeigen."),
      source: ["sop-hulthen-2017", "sop-oliva-watson-2009"],
    },
    {
      id: "tool", tool: "/tools/kpi-diagnostic/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The S&OP", "Karta e takimit", "Die Karte für die"), x("meeting card", "S&OP", "S&OP-Sitzung")],
      lead: x(
        "One meeting a month, one plan at the end. Fill in the card before the meeting, by product family rather than by item, and bring each gap with options as well as the problem.",
        "Një takim në muaj, një plan në fund. Plotësoje kartën para takimit, sipas familjeve të produkteve dhe jo sipas artikujve, dhe sill çdo hendek bashkë me mundësitë, jo vetëm me problemin.",
        "Eine Sitzung im Monat, am Ende ein Plan. Füllen Sie die Karte vor der Sitzung aus, nach Produktfamilien statt nach Artikeln, und bringen Sie zu jeder Lücke Optionen mit, nicht nur das Problem."),
      blocks: [
        { type: "form", items: [
          { h: x("Last month", "Muaji i kaluar", "Letzter Monat"), hint: x("forecast against sales, plan against output", "parashikimi përballë shitjeve, plani përballë prodhimit", "Prognose gegen Absatz, Plan gegen Ausbringung") },
          { h: x("Demand", "Kërkesa", "Nachfrage"), hint: x("volume by family for the coming months; what changed and why", "vëllimi sipas familjeve për muajt që vijnë; çfarë ndryshoi dhe pse", "Volumen je Familie für die nächsten Monate; was sich änderte und warum") },
          { h: x("Supply", "Furnizimi", "Versorgung"), hint: x("real capacity against demand: people trained, machines, vehicles", "kapaciteti real përballë kërkesës: njerëz të trajnuar, makineri, automjete", "echte Kapazität gegen Nachfrage: geschulte Leute, Maschinen, Fahrzeuge") },
          { h: x("Gaps and options", "Hendeqet dhe mundësitë", "Lücken und Optionen"), hint: x("each gap with at least two options and what each costs", "çdo hendek me të paktën dy mundësi dhe sa kushton secila", "jede Lücke mit mindestens zwei Optionen und ihren Kosten"), lines: 2 },
          { h: x("Decisions", "Vendimet", "Entscheidungen"), hint: x("what was decided, what stays open, who takes it higher", "çfarë u vendos, çfarë mbetet e hapur, kush e çon më lart", "was entschieden wurde, was offen bleibt, wer es nach oben bringt") },
          { h: x("Owners and dates", "Përgjegjësit dhe afatet", "Verantwortliche und Termine"), hint: x("who does what by when; how the teams hear of it", "kush bën çfarë dhe deri kur; si e marrin vesh ekipet", "wer was bis wann tut; wie die Teams davon erfahren") },
        ] },
      ],
      note: x(
        "A practice the editors propose, drawing on the five monthly steps in APICS, the Leitax case and the measures of Hulthén et al.",
        "Praktikë që e propozon redaksia, duke u mbështetur në pesë hapat mujorë të APICS, në rastin Leitax dhe në masat e Hulthén et al.",
        "Eine von der Redaktion vorgeschlagene Praxis, gestützt auf die fünf Monatsschritte bei APICS, den Fall Leitax und die Kennzahlen von Hulthén et al."),
      source: ["sop-apics-2015", "sop-oliva-watson-2009", "sop-hulthen-2017"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
