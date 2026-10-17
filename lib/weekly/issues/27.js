// Management Review, No. 27: OTIF and the perfect order in logistics. Block: KPIs.
// Facts and their sources: docs/revista/management-review-nr-27.md.
import { x, pc } from "../common.js";

export default {
  number: 27,
  block: "kpi",
  date: x("October 2026", "Tetor 2026", "Oktober 2026"),
  theme: [x("OTIF and", "OTIF dhe", "OTIF und"), x("the perfect order", "porosia perfekte", "der perfekte Auftrag")],
  sub: x(
    "Why the median company ships one order in ten with a failure, why 99% on every part gives 96%, a retailer's rising bar, which date makes a delivery on time, and a card for the perfect order.",
    "Pse kompania mediane dërgon një porosi në dhjetë me ndonjë dështim, pse 99% në çdo pjesë jep 96%, pragu në rritje i një shitësi, cila datë e bën dorëzimin në kohë, dhe një kartë për porosinë perfekte.",
    "Warum das Median-Unternehmen jeden zehnten Auftrag mit Fehler versendet, warum 99 % in jedem Teil 96 % ergeben, die steigende Schwelle eines Händlers, woran Pünktlichkeit gemessen wird, und eine Karte."),
  seo: x(
    "OTIF and the perfect order: APQC's median of 90, why 99% on every part gives 96%, Walmart's thresholds, which date counts as on time, and a card.",
    "OTIF dhe porosia perfekte: mediana 90 e APQC-së, pse 99% në çdo pjesë jep 96%, pragjet e Walmart-it, cila datë quhet në kohë, dhe një kartë.",
    "OTIF und der perfekte Auftrag: der APQC-Median von 90, warum 99 % je Teil 96 % ergeben, Walmarts Schwellen, woran Pünktlichkeit gemessen wird, und eine Karte."),
  feature: x(
    "At the median company in APQC's benchmarking, one order in ten ships with some failure or defect, and 99% on each of four parts gives only 96%. Issue 27 follows the thresholds Walmart set for its suppliers and asks, with McKinsey, which date makes a delivery on time. It ends with a card for counting perfect orders.",
    "Te kompania mediane në krahasimin (benchmarking) e APQC-së, një porosi në dhjetë niset me ndonjë dështim ose defekt, dhe 99% në secilën nga katër pjesët jep vetëm 96%. Numri 27 ndjek pragjet që Walmart-i u vendosi furnitorëve dhe pyet, bashkë me McKinsey-n, cila datë e bën një dorëzim në kohë. Mbyllet me një kartë për të numëruar porositë perfekte.",
    "Beim Median-Unternehmen im Benchmarking von APQC hat jeder zehnte versandte Auftrag einen Fehler oder Mangel, und 99 % in jedem der vier Teile ergeben nur 96 %. Ausgabe 27 verfolgt die Schwellen, die Walmart seinen Lieferanten setzte, und fragt mit McKinsey, welcher Termin eine Lieferung pünktlich macht. Am Ende steht eine Karte, mit der Sie perfekte Aufträge zählen."),
  figure: { n: x("1 in 10", "1 në 10", "1 von 10"), by: "APQC, 2018", t: x(
    "orders shipped by the median company has some failure or defect, in APQC's benchmarking.",
    "porosi që dërgon kompania mediane ka ndonjë dështim ose defekt, sipas krahasimit (benchmarking) të APQC-së.",
    "Aufträgen, die das Median-Unternehmen versendet, hat einen Fehler oder Mangel, laut dem Benchmarking von APQC.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("One order in ten", "Një porosi në dhjetë", "Jeder zehnte Auftrag") },
    { page: "model", kicker: x("The model", "Modeli", "Das Modell"),
      title: x("Which date, which unit", "Cila datë, cila njësi", "Welches Datum, welche Einheit") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The perfect-order card", "Karta e porosisë perfekte", "Die Karte für perfekte Aufträge") },
  ],
  sources: ["ascm-scor-rl11", "apqc-perfect-order", "apqc-perfect-order-2018", "talkbusiness-otif-2018", "scdive-otif-2019", "mckinsey-otif-2019", "lal-regnier-2022", "forslund-jonsson-2007"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Logistics reports on time and in full as if everyone meant the same thing. What makes an order perfect, who decides when a delivery is on time, and why can good rates still leave one order in ten short?",
        "Logjistika raporton “në kohë dhe të plota” sikur të gjithë të kuptonin të njëjtën gjë. Çfarë e bën një porosi perfekte, kush vendos kur një dorëzim është në kohë, dhe pse përqindje të mira mund të lënë prapë mangët një porosi në dhjetë?",
        "Die Logistik meldet „pünktlich und vollständig“, als meinten alle dasselbe. Was macht einen Auftrag perfekt, wer entscheidet, wann eine Lieferung pünktlich ist, und warum können gute Quoten trotzdem jeden zehnten Auftrag mangelhaft lassen?"),
      body: x(
        "In the SCOR model an order is perfect only if it arrives in full, on time to the date first promised, undamaged and with correct documents. In APQC's benchmarking the median company scores 90, and 99% on each of the four parts gives only 96%. Walmart raised its bar for full truckloads from 75% to 87% between 2017 and 2019. McKinsey found no standard definition of OTIF in the consumer sector, and a case study found that missing shared definitions held customers and suppliers back.",
        "Në modelin SCOR, një porosi është perfekte vetëm nëse arrin e plotë, në kohë sipas datës së premtuar fillimisht, pa dëmtime dhe me dokumente të sakta. Në krahasimin e APQC-së, kompania mediane ka 90, dhe 99% në secilën nga katër pjesët jep vetëm 96%. Walmart-i e ngriti pragun për kamionët e plotë nga 75% në 87% mes 2017 dhe 2019. McKinsey nuk gjeti përkufizim standard të OTIF-it në sektorin e mallrave të konsumit, dhe një studim rastesh gjeti se mungesa e përkufizimeve të përbashkëta i pengonte klientët dhe furnitorët.",
        "Im SCOR-Modell ist ein Auftrag nur perfekt, wenn er vollständig, pünktlich zum ursprünglich zugesagten Termin, unbeschädigt und mit korrekten Dokumenten ankommt. Im Benchmarking von APQC kommt das Median-Unternehmen auf 90, und 99 % in jedem der vier Teile ergeben nur 96 %. Walmart hob seine Schwelle für Komplettladungen zwischen 2017 und 2019 von 75 % auf 87 %. McKinsey fand in der Konsumgüterbranche keine Standarddefinition für OTIF, und eine Fallstudie zeigte, dass fehlende gemeinsame Definitionen Kunden und Lieferanten bremsten."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("One order", "Një porosi", "Jeder zehnte"), x("in ten", "në dhjetë", "Auftrag")],
      lead: x(
        "APQC compares the perfect order across companies. At the median company the index is 90: one order in ten that it ships has some failure or defect. The top quartile reaches 95 or more.",
        "APQC e krahason porosinë perfekte mes kompanive. Te kompania mediane indeksi është 90: një në dhjetë porosi që ajo dërgon ka ndonjë dështim ose defekt. Kuartili i sipërm arrin 95 ose më shumë.",
        "APQC vergleicht den perfekten Auftrag zwischen Unternehmen. Beim Median-Unternehmen liegt der Index bei 90: Jeder zehnte versandte Auftrag hat einen Fehler oder Mangel. Das obere Quartil erreicht 95 oder mehr."),
      blocks: [
        { type: "columns", max: 100, height: 110, source: ["apqc-perfect-order"],
          label: x("APQC's worked example: four rates and the share of perfect orders they give (%)", "Shembulli i APQC-së: katër përqindje dhe pjesa e porosive perfekte që japin (%)", "Rechenbeispiel von APQC: vier Quoten und der Anteil perfekter Aufträge, den sie ergeben (%)"),
          items: [
            { k: x("On time", "Në kohë", "Pünktlich"), v: 98, n: "98" },
            { k: x("In full", "Të plota", "Vollständig"), v: 97, n: "97" },
            { k: x("Undamaged", "Pa dëmtime", "Unbeschädigt"), v: 99, n: "99" },
            { k: x("Documents", "Dokumentet", "Dokumente"), v: 82, n: "82" },
            { k: x("Perfect", "Perfekte", "Perfekt"), v: 77.2, n: x("77.2", "77,2", "77,2"), alert: true },
          ] },
        { type: "p", text: x(
          "The four rates are multiplied, so the perfect order can never be higher than the weakest of them. APQC notes that a company with 99% on each of the four parts reaches only 96% overall.",
          "Katër përqindjet shumëzohen, ndaj porosia perfekte nuk mund të dalë kurrë më e lartë se më e dobëta prej tyre. APQC-ja vëren se një kompani me 99% në secilën nga katër pjesët arrin vetëm 96% gjithsej.",
          "Die vier Quoten werden multipliziert, der perfekte Auftrag kann also nie höher liegen als die schwächste von ihnen. APQC hält fest, dass ein Unternehmen mit 99 % in jedem der vier Teile insgesamt nur auf 96 % kommt.") },
        { type: "callout", reading: true, text: x(
          "Four rates that each look good can still leave one order in ten short. The customer receives the order, not the rates.",
          "Katër përqindje që veç e veç duken të mira mund të lënë prapë mangët një porosi në dhjetë. Klienti merr porosinë, jo përqindjet.",
          "Vier Quoten, die einzeln gut aussehen, können trotzdem jeden zehnten Auftrag mangelhaft lassen. Beim Kunden kommt der Auftrag an, nicht die Quoten.") },
      ],
      note: x(
        "The example's rates are illustrative rather than a company's data: 0.98 × 0.97 × 0.99 × 0.82 = 0.772. The median and the top quartile were published in 2018; the sample is not given.",
        "Përqindjet e shembullit janë ilustruese, jo të dhëna të një kompanie: 0,98 × 0,97 × 0,99 × 0,82 = 0,772. Mediana dhe kuartili i sipërm u botuan në vitin 2018; mostra nuk jepet.",
        "Die Quoten des Beispiels dienen der Veranschaulichung und sind keine Unternehmensdaten: 0,98 × 0,97 × 0,99 × 0,82 = 0,772. Median und oberes Quartil wurden 2018 veröffentlicht; die Stichprobe wird nicht genannt."),
      source: ["apqc-perfect-order-2018", "apqc-perfect-order"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("A bar that", "Një prag që", "Eine Schwelle,"), x("kept rising", "vazhdoi të ngrihej", "die weiter stieg")],
      lead: x(
        "From August 2017 Walmart fined US suppliers whose deliveries did not arrive on time and in full: 3% of the cost of the goods affected.",
        "Nga gushti 2017, Walmart-i nisi të gjobiste furnitorët në SHBA, dërgesat e të cilëve nuk mbërrinin në kohë dhe të plota: 3% e kostos së mallrave në fjalë.",
        "Ab August 2017 verhängte Walmart Strafen gegen US-Lieferanten, deren Lieferungen nicht pünktlich und vollständig ankamen: 3 % der Kosten der betroffenen Waren."),
      blocks: [
        { type: "line", alert: true, min: 50, max: 100, height: 100, source: ["talkbusiness-otif-2018", "scdive-otif-2019"],
          label: x("Walmart's on-time, in-full threshold for full truckloads", "Pragu i Walmart-it për dorëzimin në kohë dhe të plotë, për kamionët e plotë", "Walmarts Schwelle für „pünktlich und vollständig“ bei Komplettladungen"),
          points: [
            { k: x("Aug 2017", "Gusht 2017", "Aug. 2017"), v: 75, n: pc(75) },
            { k: x("Apr 2018", "Prill 2018", "Apr. 2018"), v: 85, n: pc(85) },
            { k: x("Mar 2019", "Mars 2019", "März 2019"), v: 87, n: pc(87) },
          ] },
        { type: "p", text: x(
          "A target of 95% within one day had been announced for 2018. In January 2018 Walmart postponed it: from April the bar was 85% for full truckloads and 50% for smaller loads, up from 33%. In March 2019 it rose to 87% within a two-day window, and Walmart said it would measure on time and in full separately, so that suppliers would focus on completeness.",
          "Për vitin 2018 ishte njoftuar një objektiv prej 95% brenda një dite. Në janar 2018 Walmart-i e shtyu: nga prilli pragu ishte 85% për kamionët e plotë dhe 50% për ngarkesat më të vogla, nga 33% që ishte. Në mars 2019 u ngrit në 87% brenda një dritareje dyditore, dhe Walmart-i njoftoi se do t'i matë veç e veç “në kohë” dhe “të plota”, që furnitorët të përqendrohen te plotësia.",
          "Für 2018 war ein Ziel von 95 % innerhalb eines Tages angekündigt. Im Januar 2018 verschob Walmart es: Ab April lag die Schwelle bei 85 % für Komplettladungen und bei 50 % für Teilladungen, zuvor 33 %. Im März 2019 stieg sie auf 87 % in einem Zwei-Tage-Fenster, und Walmart kündigte an, Pünktlichkeit und Vollständigkeit getrennt zu messen, damit sich die Lieferanten auf die Vollständigkeit konzentrieren.") },
        { type: "callout", reading: true, text: x(
          "A threshold tells you what the customer will fine. How well the supplier delivers is another question, and the threshold moves whenever the customer decides.",
          "Pragu tregon për çfarë do të gjobisë klienti. Sa mirë dorëzon furnitori është tjetër pyetje, dhe pragu lëviz sa herë që vendos klienti.",
          "Eine Schwelle sagt Ihnen, wofür der Kunde Strafen verhängt. Wie gut der Lieferant liefert, ist eine andere Frage, und die Schwelle verschiebt sich, wann immer der Kunde es beschließt.") },
      ],
      note: x(
        "Announced rules rather than measured results, as reported by the trade press; Walmart's own pages were not consulted. Some reports call the two groups large and small suppliers.",
        "Rregulla të njoftuara, jo rezultate të matura, sipas shtypit të specializuar; faqet e vetë Walmart-it nuk u panë. Disa burime i quajnë dy grupet furnitorë të mëdhenj dhe të vegjël.",
        "Angekündigte Regeln, keine gemessenen Ergebnisse, nach Berichten der Fachpresse; Walmarts eigene Seiten wurden nicht eingesehen. Manche Berichte nennen die beiden Gruppen große und kleine Lieferanten."),
      source: ["talkbusiness-otif-2018", "scdive-otif-2019"],
    },
    {
      id: "model", more: "what-last-mile-taught-me",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Which date,", "Cila datë,", "Welches Datum,"), x("which unit", "cila njësi", "welche Einheit")],
      lead: x(
        "OTIF counts the deliveries that reach their destination in the quantity and at the time written on the order. In 2019 McKinsey found no standard definition of either half in the consumer sector.",
        "OTIF numëron dorëzimet që mbërrijnë në destinacion me sasinë dhe në kohën e shkruar në porosi. Në vitin 2019, McKinsey gjeti se në sektorin e mallrave të konsumit asnjëra nga dy gjysmat nuk ka përkufizim standard.",
        "OTIF zählt die Lieferungen, die in der Menge und zu der Zeit am Ziel ankommen, die im Auftrag stehen. 2019 fand McKinsey in der Konsumgüterbranche für keine der beiden Hälften eine Standarddefinition."),
      blocks: [
        { type: "lists", cols: [
          { h: x("On time: by which date?", "Në kohë: sipas cilës datë?", "Pünktlich: bis wann?"), items: [
            x("the date the retailer requests", "data që kërkon shitësi me pakicë", "der vom Händler gewünschte Termin"),
            x("the date the manufacturer promises", "data që premton prodhuesi", "der vom Hersteller zugesagte Termin"),
            x("a set slot or an agreed window", "një orar i caktuar ose një dritare e rënë dakord", "ein fester Zeitslot oder ein vereinbartes Fenster"),
          ] },
          { h: x("In full: counted how?", "Të plota: si numërohet?", "Vollständig: wie gezählt?"), accent: true, items: [
            x("by order", "sipas porosisë", "je Auftrag"),
            x("by line", "sipas rreshtit", "je Position"),
            x("by case", "sipas kutisë", "je Karton"),
          ] },
        ] },
        { type: "hbars", source: ["mckinsey-otif-2019"],
          label: x("Survey of 24 retailers and manufacturers, North America", "Anketë me 24 shitës dhe prodhues, Amerika e Veriut", "Umfrage unter 24 Händlern und Herstellern, Nordamerika"),
          items: [
            { k: x("An industry standard for OTIF would create value", "Një standard i industrisë për OTIF do të krijonte vlerë", "Ein Branchenstandard für OTIF würde Wert schaffen"), v: 92, n: pc(92), alert: true },
            { k: x("Prefer to count in full by case", "Preferojnë ta numërojnë plotësinë sipas kutisë", "Bevorzugen, die Vollständigkeit je Karton zu zählen"), v: 79, n: pc(79) },
            { k: x("Prefer the requested delivery date", "Preferojnë datën e kërkuar të dorëzimit", "Bevorzugen den Wunschtermin"), v: 67, n: pc(67) },
          ] },
        { type: "p", text: x(
          "McKinsey proposed counting the cases delivered by the requested date as a share of those ordered, with one day early accepted; on the window, the survey found no agreement.",
          "McKinsey propozoi të numërohen kutitë e dorëzuara deri në datën e kërkuar si pjesë e atyre të porositura, duke pranuar edhe një ditë më herët; për dritaren, anketa nuk gjeti marrëveshje.",
          "McKinsey schlug vor, die bis zum Wunschtermin gelieferten Kartons als Anteil der bestellten zu zählen, einen Tag früher eingeschlossen; beim Zeitfenster fand die Umfrage keine Einigkeit.") },
        { type: "callout", reading: true, text: x(
          "Two companies can both report 95% and measure different things. Before comparing OTIF, ask which date and which unit.",
          "Dy kompani mund të raportojnë të dyja 95% dhe të matin gjëra të ndryshme. Para se ta krahasosh OTIF-in, pyet: cila datë dhe cila njësi?",
          "Zwei Unternehmen können beide 95 % melden und Verschiedenes messen. Bevor Sie OTIF vergleichen, fragen Sie: welcher Termin, welche Einheit?") },
      ],
      note: x(
        "Preferences of 24 large companies; their performance was not measured, and the date of the survey is not given. The definition is a proposal by McKinsey and has not been adopted as a standard.",
        "Preferenca të 24 kompanive të mëdha; rezultatet e tyre nuk u matën, dhe data e anketës nuk jepet. Përkufizimi është propozim i McKinsey-t dhe nuk është miratuar si standard.",
        "Präferenzen von 24 großen Unternehmen; ihre Leistung wurde nicht gemessen, und das Datum der Umfrage wird nicht genannt. Die Definition ist ein Vorschlag von McKinsey und wurde nicht als Standard verabschiedet."),
      source: ["mckinsey-otif-2019"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("When the definition", "Kur përkufizimi", "Ohne gemeinsame"), x("is not shared", "nuk është i përbashkët", "Definition")],
      lead: x(
        "Helena Forslund and Patrik Jonsson followed six customer–supplier pairs in manufacturing. Missing shared definitions of the metrics, and gaps in the ERP systems, were important obstacles to managing delivery performance together; the practical problems showed above all in measuring on-time delivery.",
        "Helena Forslund dhe Patrik Jonsson ndoqën gjashtë çifte klient–furnitor në industrinë prodhuese. Mungesa e përkufizimeve të përbashkëta të treguesve dhe mangësitë e sistemeve ERP ishin pengesa të rëndësishme për ta drejtuar bashkë cilësinë e dorëzimeve; problemet praktike dolën sidomos te matja e dorëzimit në kohë.",
        "Helena Forslund und Patrik Jonsson begleiteten sechs Kunden-Lieferanten-Paare in der Industrie. Fehlende gemeinsame Definitionen der Kennzahlen und Lücken in den ERP-Systemen waren wichtige Hindernisse, die Lieferleistung gemeinsam zu steuern; die praktischen Probleme zeigten sich vor allem bei der Messung der Pünktlichkeit."),
      blocks: [
        { type: "p", text: x(
          "In 2022 a McKinsey survey of 35 senior executives at 28 consumer-goods companies in North America found the definitions still shifting. More than half said retailers had tightened their OTIF rules, with narrower windows and higher fines.",
          "Në vitin 2022, një anketë e McKinsey-t me 35 drejtues të lartë në 28 kompani të mallrave të konsumit në Amerikën e Veriut gjeti se përkufizimet ende lëviznin. Më shumë se gjysma thanë se shitësit me pakicë i kishin shtrënguar rregullat e OTIF-it, me dritare më të ngushta dhe gjoba më të larta.",
          "2022 zeigte eine McKinsey-Umfrage unter 35 Topführungskräften aus 28 Konsumgüterunternehmen in Nordamerika, dass sich die Definitionen weiter verschieben. Mehr als die Hälfte gab an, Händler hätten ihre OTIF-Regeln verschärft, mit engeren Zeitfenstern und höheren Strafen.") },
        { type: "figures", compact: true, items: [
          { n: pc(85), t: x("said at least one key retailer had moved, in the past 12 months, from the requested delivery date to a planned or promised one", "thanë se të paktën një shitës kryesor me pakicë kishte kaluar, në 12 muajt e fundit, nga data e kërkuar e dorëzimit te data e planifikuar ose e premtuar", "sagten, mindestens ein wichtiger Händler sei in den letzten 12 Monaten vom Wunschtermin auf einen geplanten oder zugesagten Termin umgestiegen") },
          { n: pc(17), t: x("said they recover more than 75% of their real cost to serve", "thanë se rikuperojnë më shumë se 75% të kostos reale të shërbimit", "sagten, sie holten mehr als 75 % ihrer tatsächlichen Servicekosten wieder herein") },
        ] },
        { type: "callout", reading: true, text: x(
          "When the customer changes the definition, the same work gets a different score. Agree on the definition before arguing about the number.",
          "Kur klienti ndryshon përkufizimin, e njëjta punë merr një notë tjetër. Bie dakord për përkufizimin para se të debatosh për numrin.",
          "Ändert der Kunde die Definition, bekommt dieselbe Arbeit eine andere Note. Vereinbaren Sie erst die Definition, dann streiten Sie über die Zahl.") },
      ],
      note: x(
        "A case study of six pairs rather than a statistical sample; the survey figures are self-reports of 28 companies.",
        "Studim rastesh me gjashtë çifte, jo mostër statistikore; shifrat e anketës janë vetëdeklarime të 28 kompanive.",
        "Eine Fallstudie mit sechs Paaren, keine statistische Stichprobe; die Umfragewerte sind Selbstauskünfte von 28 Unternehmen."),
      source: ["forslund-jonsson-2007", "lal-regnier-2022"],
    },
    {
      id: "measure", tool: "/tools/delay-analyzer/",
      kicker: x("How it is measured", "Si matet", "Wie es gemessen wird"),
      title: [x("Counting", "Si numërohen", "Perfekte Aufträge"), x("perfect orders", "porositë perfekte", "zählen")],
      lead: x(
        "In the SCOR model, perfect order fulfillment (RL.1.1) is perfect orders divided by all orders. An order is perfect only when every line in it is perfect: one error in one line takes the whole order out.",
        "Në modelin SCOR, plotësimi perfekt i porosive (RL.1.1) është numri i porosive perfekte pjesëtuar me të gjitha porositë. Një porosi është perfekte vetëm kur çdo rresht i saj është perfekt: një gabim në një rresht e nxjerr jashtë gjithë porosinë.",
        "Im SCOR-Modell ist die perfekte Auftragserfüllung (RL.1.1) die Zahl perfekter Aufträge geteilt durch alle Aufträge. Ein Auftrag ist nur perfekt, wenn jede seiner Positionen perfekt ist: Ein Fehler in einer Position nimmt den ganzen Auftrag aus der Wertung."),
      blocks: [
        { type: "chain", items: [
          { h: x("In full", "Të plota", "Vollständig"), p: x("the product and quantity ordered", "produkti dhe sasia e porositur", "Produkt und Menge wie bestellt") },
          { h: x("On time", "Në kohë", "Pünktlich"), p: x("to the date first promised to the customer", "sipas datës së premtuar fillimisht klientit", "zum ursprünglich zugesagten Termin") },
          { h: x("Documents", "Dokumentet", "Dokumente"), p: x("complete and accurate", "të plota dhe të sakta", "vollständig und korrekt") },
          { h: x("Condition", "Gjendja", "Zustand"), p: x("no damage on delivery", "pa dëmtime në dorëzim", "keine Schäden bei der Lieferung") },
        ] },
        { type: "example", label: x("Hypothetical example, one month", "Shembull hipotetik, një muaj", "Hypothetisches Beispiel, ein Monat"), rows: [
          { k: x("Orders", "Porositë", "Aufträge"), v: x("200: 6 late, 4 incomplete, 2 damaged, 3 with wrong documents", "200: 6 me vonesë, 4 jo të plota, 2 të dëmtuara, 3 me dokumente të gabuara", "200: 6 verspätet, 4 unvollständig, 2 beschädigt, 3 mit falschen Papieren") },
          { k: x("Counted", "Me numërim", "Gezählt"), v: x("the 15 failures fall on 12 orders: 188 of 200 = 94.0%", "15 dështimet bien mbi 12 porosi: 188 nga 200 = 94,0%", "die 15 Fehler betreffen 12 Aufträge: 188 von 200 = 94,0 %") },
          { k: x("Multiplied", "Me shumëzim", "Als Produkt"), v: x("97% × 98% × 99% × 98.5% = 92.7%", "97% × 98% × 99% × 98,5% = 92,7%", "97 % × 98 % × 99 % × 98,5 % = 92,7 %") },
        ], text: x(
          "SCOR counts orders, APQC multiplies rates: from the same orders they give different figures, so say which one you report. The orders are made up.",
          "SCOR numëron porositë, APQC shumëzon përqindjet: nga të njëjtat porosi dalin shifra të ndryshme, ndaj thuaj cilën raporton. Porositë janë të sajuara.",
          "SCOR zählt Aufträge, APQC multipliziert Quoten: Aus denselben Aufträgen ergeben sich verschiedene Werte, sagen Sie also, welchen Sie melden. Die Aufträge sind erfunden.") },
      ],
      note: x(
        "SCOR times the delivery against the date first promised to the customer, and the date the customer requested plays no part; the cost of the order is measured elsewhere in the model.",
        "SCOR e mat kohën kundrejt datës së premtuar fillimisht klientit, dhe data që kërkoi klienti nuk hyn në llogari; kostoja e porosisë matet gjetkë në model.",
        "SCOR misst die Pünktlichkeit am ursprünglich zugesagten Termin, der Wunschtermin des Kunden spielt keine Rolle; die Kosten des Auftrags werden an anderer Stelle im Modell gemessen."),
      source: ["ascm-scor-rl11", "apqc-perfect-order"],
    },
    {
      id: "tool", tool: "/tools/cx-control-tower/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The perfect-order", "Karta e porosisë", "Die Karte für"), x("card", "perfekte", "perfekte Aufträge")],
      lead: x(
        "Each week, check a sample of orders against the four conditions, with the definitions agreed with the customer written at the top. Count the reasons as well as the rate.",
        "Çdo javë, kontrollo një mostër porosish sipas katër kushteve, me përkufizimet e rëna dakord me klientin të shkruara në krye. Numëro arsyet, krahas përqindjes.",
        "Prüfen Sie jede Woche eine Stichprobe von Aufträgen an den vier Bedingungen, mit den beim Kunden vereinbarten Definitionen ganz oben. Zählen Sie die Gründe, nicht nur die Quote."),
      blocks: [
        { type: "form", items: [
          { h: x("Definitions", "Përkufizimet", "Definitionen"), hint: x("on time to which date and window; in full by order, line or case", "në kohë sipas cilës datë dhe dritareje; të plota sipas porosisë, rreshtit apo kutisë", "pünktlich zu welchem Termin und Fenster; vollständig je Auftrag, Position oder Karton") },
          { h: x("Order", "Porosia", "Auftrag"), hint: x("number, customer, number of lines", "numri, klienti, numri i rreshtave", "Nummer, Kunde, Zahl der Positionen") },
          { h: x("In full", "Të plota", "Vollständig"), hint: x("every line in the quantity ordered: yes or no", "çdo rresht me sasinë e porositur: po ose jo", "jede Position in der bestellten Menge: ja oder nein") },
          { h: x("On time", "Në kohë", "Pünktlich"), hint: x("against the agreed date and window: yes or no", "sipas datës dhe dritares së rënë dakord: po ose jo", "zum vereinbarten Termin und Fenster: ja oder nein") },
          { h: x("Condition and documents", "Gjendja dhe dokumentet", "Zustand und Dokumente"), hint: x("any damage; anything wrong or missing in the papers", "ndonjë dëmtim; diçka e gabuar ose që mungon te dokumentet", "Schäden; Falsches oder Fehlendes in den Papieren") },
          { h: x("Perfect or not", "Perfekte apo jo", "Perfekt oder nicht"), hint: x("if not, the first condition that failed and its cause", "nëse jo, kushti i parë që dështoi dhe shkaku i tij", "wenn nicht, die erste verfehlte Bedingung und ihre Ursache") },
        ] },
      ],
      note: x(
        "The editors' practice, after the SCOR model (RL.1.1).",
        "Praktikë e redaksisë, sipas modelit SCOR (RL.1.1).",
        "Eine Praxis der Redaktion, nach dem SCOR-Modell (RL.1.1)."),
      source: ["ascm-scor-rl11"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
