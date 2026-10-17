// Management Review, No. 74: Why projects run late and over budget. Block: Strategy.
// Facts and their sources: docs/revista/management-review-nr-74.md. The figures of How Big Things Get Done (2023)
// were read in reviews of the book, not in the book itself; the fact table says which.
import { x, pc } from "../common.js";

// A decimal written for each language: "8.5", "8,5", "8,5".
const dec = (s) => x(s, s.replace(".", ","), s.replace(".", ","));
// A decimal share: "8.5%", "8,5%", "8,5 %".
const dpc = (s) => x(`${s}%`, `${s.replace(".", ",")}%`, `${s.replace(".", ",")} %`);

export default {
  number: 74,
  block: "strategy",
  date: x("November 2026", "Nëntor 2026", "November 2026"),
  // Corrections made after publication, shown on the issue's page and its sources page. A correction made in one
  // edition only names its language (lang); only the English summary changed.
  corrections: [
    { lang: "en", date: "13 October 2026", t: "The summary of the issue now says “what it is measured against”, as the German and Albanian editions do; it first said “what counts as success”." },
  ],
  theme: [x("Why projects run late", "Pse projektet vonohen", "Warum Projekte zu spät"), x("and over budget", "dhe dalin nga buxheti", "und zu teuer werden")],
  sub: x(
    "A textbook planned for two years that took eight, how few projects hit budget and time, the inside and the outside view, error or misrepresentation, what it is measured against, and a card for an estimate.",
    "Një libër i planifikuar për dy vjet që zgjati tetë, sa pak projekte e mbajnë buxhetin dhe afatin, pamja nga brenda dhe nga jashtë, gabim apo shtrembërim, përballë cilës shifër matet, dhe një kartë për një vlerësim.",
    "Ein Lehrbuch, geplant für zwei Jahre, fertig nach acht, wie wenige Projekte Budget und Termin halten, Innen- und Außensicht, Irrtum oder Täuschung, woran gemessen wird, und eine Karte für eine Schätzung."),
  seo: x(
    "Why projects run late and over budget: Kahneman's textbook, 8.5% on budget and on time, the outside view, error or lie, the baseline, and a card.",
    "Pse projektet vonohen dhe dalin nga buxheti: libri i Kahneman-it, 8,5% brenda buxhetit dhe afatit, pamja nga jashtë, gabim apo gënjeshtër, dhe një kartë.",
    "Warum Projekte zu spät und zu teuer werden: Kahnemans Lehrbuch, 8,5 % in Budget und Zeit, die Außensicht, Irrtum oder Lüge, die Basis, eine Karte."),
  feature: x(
    "A textbook team expected to need two more years and needed eight. In a database of more than 16,000 projects, 8.5% came in on budget and on time. Issue 74 sets the inside view of a plan beside the outside view of the record, weighs whether low estimates are honest errors or strategic misrepresentation, and asks which number an overrun is measured against. It ends with a card for an estimate checked against similar projects.",
    "Një ekip që shkruante një libër shkollor priste t'i duheshin edhe dy vjet, dhe iu deshën tetë. Në një bazë të dhënash me më shumë se 16.000 projekte, 8,5% mbaruan brenda buxhetit dhe afatit. Numri 74 e vë pamjen nga brenda të planit pranë pamjes nga jashtë të historisë, peshon nëse vlerësimet e ulëta janë gabime të sinqerta apo shtrembërim i qëllimshëm, dhe pyet përballë cilës shifër matet një tejkalim. Mbyllet me një kartë për një vlerësim të kontrolluar me projekte të ngjashme.",
    "Ein Lehrbuchteam glaubte, noch zwei Jahre zu brauchen, und brauchte acht. In einer Datenbank mit mehr als 16.000 Projekten hielten 8,5 % Budget und Termin. Ausgabe 74 stellt die Innensicht eines Plans neben die Außensicht der Erfahrung, wägt ab, ob niedrige Schätzungen ehrliche Irrtümer oder strategische Täuschung sind, und fragt, woran eine Überschreitung gemessen wird. Am Ende steht eine Karte für eine Schätzung, die an ähnlichen Projekten geprüft wird."),
  figure: { n: dpc("8.5"), by: "Flyvbjerg & Gardner, 2023", t: x(
    "of more than 16,000 projects came in on budget and on time; 0.5% also delivered the benefits promised.",
    "e më shumë se 16.000 projekteve mbaruan brenda buxhetit dhe afatit; 0,5% dhanë edhe përfitimet e premtuara.",
    "von mehr als 16.000 Projekten blieben in Budget und Zeit; 0,5 % brachten auch den versprochenen Nutzen.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("Two years that became eight", "Dy vjet që u bënë tetë", "Zwei Jahre, aus denen acht wurden") },
    { page: "numbers", kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: x("On budget and on time: 8.5%", "Brenda buxhetit dhe afatit: 8,5%", "In Budget und Zeit: 8,5 %") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The outside-view card", "Karta e pamjes nga jashtë", "Die Außensicht-Karte") },
  ],
  sources: ["proj-kahneman-2011", "proj-flyvbjerg-gardner-2023", "proj-flyvbjerg-budzier-2011", "proj-lovallo-kahneman-2003", "proj-flyvbjerg-2006", "proj-flyvbjerg-2002"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Most projects are approved on an estimate made by the people who want to do them. The estimate is built from the plan, step by step, and it rarely asks how similar projects turned out. That question, and the number it gives, are the subject here.",
        "Shumica e projekteve miratohen me një vlerësim që e bëjnë ata që duan t'i realizojnë. Vlerësimi ndërtohet nga plani, hap pas hapi, dhe rrallë pyet si dolën projektet e ngjashme. Këtu flitet pikërisht për atë pyetje dhe për shifrën që ajo jep.",
        "Die meisten Projekte werden auf eine Schätzung hin genehmigt, die von denen stammt, die sie umsetzen wollen. Die Schätzung entsteht aus dem Plan, Schritt für Schritt, und fragt selten, wie ähnliche Projekte ausgingen. Um diese Frage und die Zahl, die sie liefert, geht es hier."),
      body: x(
        "Daniel Kahneman's team expected a textbook in about two years and finished it in eight. In Bent Flyvbjerg's database of more than 16,000 projects, 8.5% came in on budget and on time. Dan Lovallo and Kahneman blamed the inside view, built from the plan alone; Flyvbjerg added deliberate underestimation. Both point to the same remedy, reference class forecasting.",
        "Ekipi i Daniel Kahneman-it priste ta mbaronte një libër shkollor për rreth dy vjet dhe e mbaroi për tetë. Në bazën e të dhënave të Bent Flyvbjerg-ut me më shumë se 16.000 projekte, 8,5% mbaruan brenda buxhetit dhe afatit. Dan Lovallo dhe Kahneman-i fajësuan pamjen nga brenda, të ndërtuar vetëm nga plani; Flyvbjerg-u shtoi nënvlerësimin e qëllimshëm. Të dyja shpjegimet çojnë te i njëjti ilaç, parashikimi me klasë reference.",
        "Daniel Kahnemans Team erwartete ein Lehrbuch in etwa zwei Jahren und wurde nach acht fertig. In Bent Flyvbjergs Datenbank mit mehr als 16.000 Projekten blieben 8,5 % in Budget und Zeit. Dan Lovallo und Kahneman machten die Innensicht verantwortlich, die nur vom Plan ausgeht; Flyvbjerg ergänzte die absichtliche Unterschätzung. Beides führt zum selben Mittel, der Referenzklassenprognose."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("Two years", "Dy vjet", "Zwei Jahre,"), x("that became eight", "që u bënë tetë", "aus denen acht wurden")],
      lead: x(
        "In the 1970s Daniel Kahneman led a team writing a curriculum and a textbook on judgment and decision making for Israeli high schools. One day he asked each member how long they thought it would take to finish the book.",
        "Në vitet 1970, Daniel Kahneman-i drejtonte një ekip që shkruante një program mësimor dhe një libër për gjykimin dhe vendimmarrjen për shkollat e mesme në Izrael. Një ditë e pyeti secilin anëtar sa mendonte se do të zgjaste deri në mbarimin e librit.",
        "In den 1970er-Jahren leitete Daniel Kahneman ein Team, das einen Lehrplan und ein Lehrbuch über Urteilen und Entscheiden für israelische Oberschulen schrieb. Eines Tages fragte er jedes Mitglied, wie lange es bis zum fertigen Buch noch dauern werde."),
      blocks: [
        { type: "p", text: x(
          "The answers centred on two years, from one and a half to two and a half. Then he asked Seymour Fox, a curriculum expert on the team, how other teams had done. About 40% never finished, Fox said, and none of the rest took less than seven years or more than ten. His own estimate had been well within the group's optimistic consensus.",
          "Përgjigjet silleshin rreth dy vjetëve, nga një vit e gjysmë deri në dy vjet e gjysmë. Pastaj pyeti Seymour Fox-in, një ekspert programesh mësimore në ekip, si kishin ecur ekipet e tjera. Rreth 40% nuk mbaruan kurrë, tha Fox-i, dhe asnjë nga të tjerët nuk mbaroi për më pak se shtatë vjet ose për më shumë se dhjetë. Vlerësimi i tij kishte qenë brenda optimizmit të përbashkët të grupit.",
          "Die Antworten lagen um zwei Jahre, zwischen anderthalb und zweieinhalb. Dann fragte er Seymour Fox, einen Lehrplanexperten im Team, wie es anderen Teams ergangen war. Etwa 40 % wurden nie fertig, sagte Fox, und keines der übrigen brauchte weniger als sieben oder mehr als zehn Jahre. Seine eigene Schätzung hatte mitten im optimistischen Konsens der Gruppe gelegen.") },
        { type: "quote", text: x(
          "We're below average, but not by much.",
          "Jemi nën mesataren, por jo shumë.",
          "Wir liegen unter dem Durchschnitt, aber nicht weit.") },
        { type: "p", text: x(
          "That was Fox's view of the team against the others. The team carried on as if nothing had happened. The book was finished eight years later.",
          "Ky ishte gjykimi i Fox-it për ekipin përballë të tjerëve. Ekipi vazhdoi sikur të mos kishte ndodhur asgjë. Libri u mbarua tetë vjet më vonë.",
          "So schätzte Fox das Team im Vergleich zu den anderen ein. Das Team machte weiter, als wäre nichts gewesen. Das Buch war acht Jahre später fertig.") },
        { type: "callout", reading: true, text: x(
          "Fox had the record in his head. It came out only once the question turned to other teams.",
          "Fox-i e kishte historinë në kokë. Ajo doli vetëm kur pyetja u kthye te ekipet e tjera.",
          "Fox hatte die Erfahrung im Kopf. Sie kam erst heraus, als sich die Frage auf andere Teams richtete.") },
      ],
      note: x(
        "Kahneman's own account, in an excerpt of Thinking, Fast and Slow published by McKinsey Quarterly (2011). Lovallo and Kahneman (2003) call this the planning fallacy; for the thesis study that measured it, see No. 44.",
        "Rrëfimi i vetë Kahneman-it, në një pjesë të librit Thinking, Fast and Slow që botoi McKinsey Quarterly (2011). Lovallo dhe Kahneman-i (2003) e quajnë këtë gabimi i planifikimit; për studimin me temat e diplomës që e mati, shih Nr. 44.",
        "Kahnemans eigene Darstellung, in einem Auszug aus Thinking, Fast and Slow, den das McKinsey Quarterly veröffentlichte (2011). Lovallo und Kahneman (2003) nennen das Planungsfehlschluss; zur Studie mit Abschlussarbeiten, die ihn maß, siehe Nr. 44."),
      source: ["proj-kahneman-2011"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("On budget", "Brenda buxhetit", "In Budget"), x("and on time", "dhe afatit", "und Zeit")],
      lead: x(
        "Bent Flyvbjerg and his colleagues have collected cost and schedule data on more than 16,000 projects in over 20 fields and 136 countries, going back to 1910. In How Big Things Get Done (2023) he and Dan Gardner count how many hit all three marks.",
        "Bent Flyvbjerg dhe kolegët kanë mbledhur të dhëna për koston dhe afatet e më shumë se 16.000 projekteve në mbi 20 fusha dhe 136 vende, që nga viti 1910. Te How Big Things Get Done (2023), ai dhe Dan Gardner numërojnë sa projekte i arrijnë të tria objektivat.",
        "Bent Flyvbjerg und Kollegen haben Kosten- und Termindaten zu mehr als 16.000 Projekten aus über 20 Bereichen und 136 Ländern gesammelt, zurück bis 1910. In How Big Things Get Done (2023) zählen er und Dan Gardner, wie viele alle drei Ziele erreichen."),
      blocks: [
        { type: "hbars", max: 100, source: ["proj-flyvbjerg-gardner-2023"],
          label: x("Projects in the Flyvbjerg database, share (2023)", "Projektet në bazën e të dhënave të Flyvbjerg-ut, pjesa (2023)", "Projekte in der Flyvbjerg-Datenbank, Anteil (2023)"),
          items: [
            { k: x("Over budget, late, or both", "Mbi buxhet, me vonesë, ose të dyja", "Über Budget, verspätet oder beides"), v: 91.5, n: dpc("91.5") },
            { k: x("On budget and on time", "Brenda buxhetit dhe afatit", "In Budget und Zeit"), v: 8.5, n: dpc("8.5") },
            { k: x("…and with the benefits promised", "…dhe me përfitimet e premtuara", "…und mit dem versprochenen Nutzen"), v: 0.5, n: dpc("0.5"), alert: true },
          ] },
        { type: "figures", compact: true, items: [
          { n: pc(27), t: x("average cost overrun in 1,471 IT projects (Flyvbjerg & Budzier, 2011)", "tejkalimi mesatar i kostos në 1.471 projekte IT (Flyvbjerg & Budzier, 2011)", "mittlere Kostenüberschreitung in 1.471 IT-Projekten (Flyvbjerg & Budzier, 2011)") },
          { n: x("1 in 6", "1 në 6", "1 von 6"), t: x("was a black swan: costs 200% over on average, schedule almost 70% over", "ishte mjellmë e zezë: kosto mesatarisht 200% mbi plan, afati gati 70% mbi plan", "war ein schwarzer Schwan: Kosten im Schnitt 200 % darüber, Zeitplan fast 70 %") },
        ] },
        { type: "callout", reading: true, text: x(
          "The risk sits in the tail: the one project in six that goes far beyond the average.",
          "Rreziku qëndron te bishti i shpërndarjes: te ai projekt nga gjashtë që shkon shumë përtej mesatares.",
          "Das Risiko steckt in den Ausreißern: in dem einen Projekt von sechs, das weit über den Durchschnitt hinausgeht.") },
      ],
      note: x(
        "The database holds projects of every size, most of them large; it is a collection, not a random sample. We read the book's figures in reviews of it, not in the book itself.",
        "Baza ka projekte të të gjitha madhësive, shumica të mëdha; është koleksion, jo mostër e rastësishme. Shifrat e librit i lexuam te recensionet e tij, jo te vetë libri.",
        "Die Datenbank enthält Projekte jeder Größe, die meisten groß; sie ist eine Sammlung, keine Zufallsstichprobe. Die Zahlen des Buchs lasen wir in Rezensionen, nicht im Buch selbst."),
      source: ["proj-flyvbjerg-gardner-2023", "proj-flyvbjerg-budzier-2011"],
    },
    {
      id: "model", more: "high-volume-days",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("The inside", "Pamja nga brenda", "Innensicht"), x("and the outside view", "dhe nga jashtë", "und Außensicht")],
      lead: x(
        "Dan Lovallo and Daniel Kahneman (2003) trace bad forecasts to the inside view: the estimate is built from the project's own tasks and obstacles. The outside view sets those aside and asks how similar projects turned out. Flyvbjerg (2006) set it out in three steps.",
        "Dan Lovallo dhe Daniel Kahneman-i (2003) i lidhin parashikimet e këqija me pamjen nga brenda: vlerësimi ndërtohet nga detyrat dhe pengesat e vetë projektit. Pamja nga jashtë i lë mënjanë ato dhe pyet si dolën projektet e ngjashme. Flyvbjerg-u (2006) e shtjelloi në tre hapa.",
        "Dan Lovallo und Daniel Kahneman (2003) führen schlechte Prognosen auf die Innensicht zurück: Die Schätzung entsteht aus Aufgaben und Hindernissen des Projekts selbst. Die Außensicht fragt, wie ähnliche Projekte ausgingen. Flyvbjerg (2006) fasste sie in drei Schritte."),
      blocks: [
        { type: "chain", items: [
          { h: x("Reference class", "Klasa e referencës", "Referenzklasse"), p: x("Past projects, broad enough to count, close enough to compare.", "Projekte të shkuara, mjaft për t'u numëruar, mjaft të afërta për t'u krahasuar.", "Frühere Projekte, genug zum Zählen, nah genug zum Vergleich.") },
          { h: x("Distribution", "Shpërndarja", "Verteilung"), p: x("How their costs and times really came out.", "Si dolën vërtet kostot dhe kohët e tyre.", "Wie ihre Kosten und Zeiten wirklich ausfielen.") },
          { h: x("Position", "Vendi", "Einordnung"), p: x("Where this project sits, and how far to move the estimate.", "Ku qëndron ky projekt, dhe sa duhet lëvizur vlerësimi.", "Wo dieses Projekt steht und wie weit die Schätzung zu verschieben ist.") },
        ] },
        { type: "columns", max: 450, height: 110, source: ["proj-flyvbjerg-2006"],
          label: x("Edinburgh tram line 2, cost forecast in £ million", "Linja 2 e tramvajit të Edinburgut, parashikimi i kostos në milionë £", "Edinburger Tramlinie 2, Kostenprognose in Mio. £"),
          items: [
            { k: x("Promoters", "Nxitësit", "Projektträger"), v: 320, n: x("320", "320", "320") },
            { k: x("50% certain", "50% e sigurt", "50 % sicher"), v: 357, n: x("357", "357", "357") },
            { k: x("80% certain", "80% e sigurt", "80 % sicher"), v: 400, n: x("400", "400", "400"), alert: true },
          ] },
        { type: "callout", reading: true, text: x(
          "A reserve sized by hope is spent before the work begins. Size it from the record.",
          "Një rezervë e matur me shpresë shpenzohet para se të nisë puna. Përcaktoje sipas historisë.",
          "Eine nach Hoffnung bemessene Reserve ist aufgebraucht, bevor die Arbeit beginnt. Bemessen Sie sie nach der Erfahrung.") },
      ],
      note: x(
        "An early use of the method: 46 comparable rail projects. The promoters' £320 million already held 25% for contingency; the class asked for 40% or 57%. A planning forecast; we report no outcome.",
        "Një nga përdorimet e para të metodës: 46 projekte hekurudhore të krahasueshme. 320 milionët e propozuesve kishin tashmë 25% rezervë; klasa kërkonte 40% ose 57%. Parashikim planifikimi; nuk japim rezultat.",
        "Einer der ersten Einsätze der Methode: 46 vergleichbare Bahnprojekte. Die 320 Mio. der Träger enthielten schon 25 % Reserve; die Klasse verlangte 40 % oder 57 %. Eine Planungsprognose, kein Ergebnis."),
      source: ["proj-lovallo-kahneman-2003", "proj-flyvbjerg-2006"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("Error", "Gabim", "Irrtum"), x("or misrepresentation?", "apo shtrembërim?", "oder Täuschung?")],
      lead: x(
        "Optimism, in Lovallo and Kahneman's account, is an honest delusion. Flyvbjerg names a second cause, strategic misrepresentation. His evidence came from 258 transport projects worth US$90 billion (2002).",
        "Optimizmi, sipas Lovallo-s dhe Kahneman-it, është vetëmashtrim i sinqertë. Flyvbjerg-u përmend një shkak të dytë, shtrembërimin strategjik. Provat e tij erdhën nga 258 projekte transporti me vlerë 90 miliardë dollarë (2002).",
        "Optimismus ist bei Lovallo und Kahneman eine ehrliche Selbsttäuschung. Flyvbjerg nennt eine zweite Ursache, die strategische Falschdarstellung. Seine Belege stammen aus 258 Verkehrsprojekten im Wert von 90 Milliarden US-Dollar (2002)."),
      blocks: [
        { type: "hbars", max: 50, source: ["proj-flyvbjerg-2002"],
          label: x("Average cost overrun by type, 258 transport projects (2002)", "Tejkalimi mesatar i kostos sipas llojit, 258 projekte transporti (2002)", "Mittlere Kostenüberschreitung nach Art, 258 Verkehrsprojekte (2002)"),
          items: [
            { k: x("All projects", "Të gjitha projektet", "Alle Projekte"), v: 28, n: pc(28) },
            { k: x("Rail (58 projects)", "Hekurudha (58 projekte)", "Bahn (58 Projekte)"), v: 45, n: pc(45), alert: true },
            { k: x("Bridges and tunnels (33)", "Ura dhe tunele (33)", "Brücken und Tunnel (33)"), v: 34, n: pc(34) },
            { k: x("Roads (167)", "Rrugë (167)", "Straßen (167)"), v: 20, n: pc(20) },
          ] },
        { type: "p", text: x(
          "The authors weighed technical, economic, psychological and political explanations. Underestimation, they concluded, cannot be explained by error and is best explained by strategic misrepresentation, that is, lying.",
          "Autorët peshuan shpjegime teknike, ekonomike, psikologjike dhe politike. Nënvlerësimi, përfunduan ata, nuk shpjegohet dot me gabim dhe shpjegohet më mirë me shtrembërim strategjik, pra me gënjeshtër.",
          "Die Autoren prüften technische, ökonomische, psychologische und politische Erklärungen. Die Unterschätzung, folgerten sie, lasse sich nicht mit Irrtum erklären, am besten mit strategischer Falschdarstellung, also mit Lügen.") },
        { type: "callout", reading: true, text: x(
          "Both causes have one remedy: an estimate checked against the record by someone who does not need the project approved.",
          "Të dy shkaqet kanë një ilaç: një vlerësim i kontrolluar me historinë nga dikush që nuk ka nevojë që projekti të miratohet.",
          "Beide Ursachen haben ein Gegenmittel: eine Schätzung, an der Erfahrung geprüft von jemandem, der die Genehmigung nicht braucht.") },
      ],
      note: x(
        "The 2002 sample covers transport only, and a statistical pattern does not prove intent in a single case.",
        "Mostra e vitit 2002 mbulon vetëm transportin, dhe një model statistikor nuk e provon qëllimin në një rast të vetëm.",
        "Die Stichprobe von 2002 umfasst nur Verkehr, und ein statistisches Muster beweist im Einzelfall keine Absicht."),
      source: ["proj-flyvbjerg-2002", "proj-lovallo-kahneman-2003"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie es gemessen wird"),
      title: [x("Against", "Përballë", "Gemessen an"), x("which number?", "cilës shifër?", "welcher Zahl?")],
      lead: x(
        "An overrun depends on its baseline. Flyvbjerg and his colleagues judge a project against the estimates used to decide whether to build it. Flyvbjerg and Gardner then count three marks at once.",
        "Një tejkalim varet nga pika e nisjes. Flyvbjerg-u dhe kolegët e gjykojnë projektin përballë vlerësimeve mbi të cilat u vendos nëse do të ndërtohej. Flyvbjerg-u dhe Gardner-i numërojnë pastaj tri objektiva njëherësh.",
        "Eine Überschreitung hängt von ihrer Basis ab. Flyvbjerg und Kollegen messen ein Projekt an den Schätzungen, auf denen die Entscheidung zum Bau beruhte. Flyvbjerg und Gardner zählen dann drei Ziele zugleich."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("Cost", "Kostoja", "Kosten"), p: x("actual cost against the estimate at the decision", "kostoja e vërtetë përballë vlerësimit në kohën e vendimit", "tatsächliche Kosten gegen die Schätzung bei der Entscheidung") },
          { h: x("Time", "Koha", "Zeit"), p: x("actual finish against the date promised at the decision", "mbarimi i vërtetë përballë datës së premtuar në vendim", "tatsächliches Ende gegen den bei der Entscheidung zugesagten Termin") },
          { h: x("Benefits", "Përfitimet", "Nutzen"), p: x("what the project delivers against what its case promised", "çfarë jep projekti përballë asaj që premtonte arsyetimi i tij", "was das Projekt bringt, gegen das, was sein Antrag versprach") },
        ] },
        { type: "quote", text: x(
          "The cost estimates used to decide whether important infrastructure should be built are highly and systematically misleading.",
          "Vlerësimet e kostos mbi të cilat vendoset nëse infrastruktura e rëndësishme duhet ndërtuar janë shumë dhe sistematikisht mashtruese.",
          "Die Kostenschätzungen, auf deren Grundlage über den Bau wichtiger Infrastruktur entschieden wird, sind in hohem Maße und systematisch irreführend.") },
        { type: "callout", reading: true, text: x(
          "A budget re-based halfway through can make a late, costly project look on plan. Keep the numbers from the day of the decision, and choose the measure before the project starts.",
          "Një buxhet i rillogaritur në mes mund ta bëjë një projekt të vonuar dhe të shtrenjtë të duket sipas planit. Mbaji shifrat e ditës së vendimit, dhe zgjidhe masën para se të nisë projekti.",
          "Ein mittendrin neu angesetztes Budget lässt ein verspätetes, teures Projekt planmäßig aussehen. Halten Sie die Zahlen vom Tag der Entscheidung fest, und wählen Sie das Maß, bevor das Projekt beginnt.") },
      ],
      note: x(
        "The quote is from the abstract of Flyvbjerg, Holm and Buhl (2002), 258 transport projects. The three rows are our summary of these baselines; the 2023 figures are on page 4.",
        "Citimi është nga abstrakti i Flyvbjerg-ut, Holm-it dhe Buhl-it (2002), 258 projekte transporti. Tri rreshtat janë përmbledhja jonë e këtyre pikave të nisjes; shifrat e vitit 2023 janë te faqja 4.",
        "Das Zitat stammt aus dem Abstract von Flyvbjerg, Holm und Buhl (2002), 258 Verkehrsprojekte. Die drei Zeilen fassen diese Basen in unseren Worten zusammen; die Zahlen von 2023 stehen auf Seite 4."),
      source: ["proj-flyvbjerg-2002", "proj-flyvbjerg-gardner-2023"],
    },
    {
      id: "tool", tool: "/tools/delay-analyzer/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The outside-view", "Karta e pamjes", "Die Außensicht-"), x("card", "nga jashtë", "Karte")],
      lead: x(
        "Fill it in before the estimate is approved: first the inside view, then the record, then the gap. Afterwards log the planned and the actual dates; Delay Analyzer keeps the same kind of log for routes.",
        "Plotësoje para se të miratohet vlerësimi: së pari pamja nga brenda, pastaj historia, pastaj diferenca. Më pas shëno datat e planifikuara dhe të vërtetat; Delay Analyzer mban të njëjtin lloj regjistri për itineraret.",
        "Füllen Sie die Karte vor der Freigabe aus: erst die Innensicht, dann die Erfahrung, dann die Lücke. Halten Sie danach geplante und tatsächliche Termine fest; der Delay Analyzer führt dieselbe Art Protokoll für Touren."),
      blocks: [
        { type: "form", items: [
          { h: x("Inside view", "Pamja nga brenda", "Innensicht"), hint: x("our cost and time, built from the plan", "kostoja dhe koha jonë, të ndërtuara nga plani", "unsere Kosten und Zeit, aus dem Plan") },
          { h: x("Reference class", "Klasa e referencës", "Referenzklasse"), hint: x("similar finished projects, ours or others', and how many", "projekte të ngjashme të mbaruara, tonat ose të të tjerëve, dhe sa", "ähnliche abgeschlossene Projekte, eigene oder fremde, und wie viele") },
          { h: x("What they took", "Sa u deshi atyre", "Was sie brauchten"), hint: x("typical and worst overrun in cost and time", "tejkalimi tipik dhe më i keqi në kosto dhe kohë", "typische und schlimmste Überschreitung bei Kosten und Zeit") },
          { h: x("Our position", "Vendi ynë", "Unsere Lage"), hint: x("why we would do better or worse, in writing", "pse do të dalim më mirë ose më keq, me shkrim", "warum wir besser oder schlechter liegen, schriftlich") },
          { h: x("Estimate and reserve", "Vlerësimi dhe rezerva", "Schätzung und Reserve"), hint: x("the number we commit to, and how sure we are of it", "shifra për të cilën angazhohemi, dhe sa të sigurt jemi", "die Zahl, zu der wir stehen, und wie sicher sie ist") },
          { h: x("Afterwards", "Pas mbarimit", "Danach"), hint: x("actual cost and date, added to the class", "kostoja dhe data e vërtetë, të shtuara te klasa", "tatsächliche Kosten und Termin, zur Klasse hinzugefügt") },
        ] },
      ],
      note: x(
        "The editors' proposal, built on the three steps of Flyvbjerg (2006) and the outside view of Lovallo and Kahneman (2003). Once the number is set, a pre-mortem (No. 44) tests the plan behind it.",
        "Propozim i redaksisë, i ndërtuar mbi tre hapat e Flyvbjerg-ut (2006) dhe pamjen nga jashtë të Lovallo-s dhe Kahneman-it (2003). Pasi të vendoset shifra, një pre-mortem (Nr. 44) e provon planin pas saj.",
        "Ein Vorschlag der Redaktion, aufgebaut auf den drei Schritten von Flyvbjerg (2006) und der Außensicht von Lovallo und Kahneman (2003). Steht die Zahl, prüft ein Pre-Mortem (Nr. 44) den Plan dahinter."),
      source: ["proj-flyvbjerg-2006", "proj-lovallo-kahneman-2003"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
