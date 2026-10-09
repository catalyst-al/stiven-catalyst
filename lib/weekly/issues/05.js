// Management Review, No. 5: The eight wastes of Lean. Block: Operations.
// Facts and their sources: docs/revista/management-review-nr-05.md.
import { x } from "../common.js";

const waste = (n, en, sq, de) => ({ n, h: x(...en.slice(0, 1), ...sq.slice(0, 1), ...de.slice(0, 1)), p: x(en[1], sq[1], de[1]) });

export default {
  number: 5,
  block: "operations",
  date: x("October 2026", "Tetor 2026", "Oktober 2026"),
  theme: [x("The eight wastes", "Tetë humbjet", "Die acht Verschwendungen"), x("of Lean", "e Lean-it", "im Lean")],
  sub: x(
    "Ohno's seven wastes, the eighth that came later, five principles, and a walk to find them in your own operation.",
    "Shtatë humbjet e Ohno-s, e teta që erdhi më vonë, pesë parimet, dhe një ecje për t'i gjetur në operacionin tënd.",
    "Ohnos sieben Verschwendungen, die achte, die später dazukam, fünf Prinzipien und ein Rundgang, um sie im eigenen Betrieb zu finden."),
  seo: x(
    "The eight wastes of Lean: Ohno's seven, the eighth that came later, Womack and Jones's 319-day cola can, five principles and a waste walk card.",
    "Tetë humbjet e Lean-it: shtatë të Ohno-s, e teta që erdhi më vonë, kanaçja 319-ditore e Womack dhe Jones, pesë parimet dhe karta e ecjes.",
    "Die acht Verschwendungen im Lean: Ohnos sieben, die achte, die 319 Tage der Getränkedose von Womack und Jones, fünf Prinzipien und eine Rundgangkarte."),
  feature: x(
    "Issue 5 follows a cola can for 319 days to find three hours of real work, names the seven wastes Taiichi Ohno described and the eighth added later, and ends with a card for a walk through your own operation.",
    "Numri 5 e ndjek një kanaçe kole për 319 ditë për të gjetur tre orë punë të vërtetë, emërton shtatë humbjet që përshkroi Taiichi Ohno dhe të tetën e shtuar më vonë, dhe mbyllet me një kartë për një ecje në operacionin tënd.",
    "Ausgabe 5 folgt einer Getränkedose 319 Tage lang und findet drei Stunden echter Arbeit, benennt die sieben Verschwendungen nach Taiichi Ohno und die später ergänzte achte und endet mit einer Karte für einen Rundgang durch den eigenen Betrieb."),
  figure: { n: x("3 h", "3 orë", "3 Std."), by: "Womack & Jones, 1996", t: x(
    "of value-creating work in the 319 days it took a cola can to reach a buyer.",
    "punë që krijon vlerë, në 319 ditët që iu deshën një kanaçeje kole për të arritur te blerësi.",
    "wertschöpfende Arbeit in den 319 Tagen, die eine Getränkedose bis zum Käufer brauchte.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("319 days for a cola can", "319 ditë për një kanaçe kole", "319 Tage für eine Getränkedose") },
    { page: "model", kicker: x("The model", "Modeli", "Das Modell"),
      title: x("Seven wastes, and an eighth", "Shtatë humbje, dhe një e tetë", "Sieben Verschwendungen und eine achte") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The waste walk card", "Karta e ecjes në terren", "Die Karte für den Rundgang") },
  ],
  sources: ["womack-jones-1996", "ohno-1988", "lei-lexicon", "lei-eight-wastes", "liker-2004", "krafcik-1988", "womack-1990"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Most of the time a product or a request spends in a process, nobody is working on it. It waits, it is moved, it is checked again. This issue is about seeing that time, and about the names Lean gives to it.",
        "Pjesën më të madhe të kohës që një produkt ose një kërkesë kalon në një proces, askush nuk punon me të. Pret, lëvizet, kontrollohet sërish. Ky numër flet për ta parë këtë kohë, dhe për emrat që i jep Lean-i.",
        "Den größten Teil der Zeit, die ein Produkt oder ein Auftrag in einem Prozess verbringt, arbeitet niemand daran. Es wartet, wird bewegt, wird noch einmal geprüft. Diese Ausgabe handelt davon, diese Zeit zu sehen, und von den Namen, die Lean ihr gibt."),
      body: x(
        "Taiichi Ohno, who shaped the Toyota Production System, described seven kinds of waste. Later an eighth was added: the talent of the people that is not used. James Womack and Daniel Jones turned the ideas into five principles in 1996. None of it needs a factory. A warehouse, a delivery route or a hotel reception has the same wastes under other names.",
        "Taiichi Ohno, që i dha formë Sistemit të Prodhimit të Toyota-s, përshkroi shtatë lloje humbjesh. Më vonë u shtua një e tetë: talenti i njerëzve që nuk përdoret. James Womack dhe Daniel Jones i kthyen idetë në pesë parime në 1996. Asgjë nga këto nuk kërkon fabrikë. Një magazinë, një rrugë shpërndarjeje ose recepsioni i një hoteli kanë të njëjtat humbje me emra të tjerë.",
        "Taiichi Ohno, der das Toyota-Produktionssystem prägte, beschrieb sieben Arten von Verschwendung. Später kam eine achte hinzu: das ungenutzte Talent der Menschen. James Womack und Daniel Jones machten 1996 fünf Prinzipien daraus. Nichts davon braucht eine Fabrik. Ein Lager, eine Zustelltour oder eine Hotelrezeption haben dieselben Verschwendungen unter anderen Namen."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("319 days", "319 ditë", "319 Tage"), x("for a cola can", "për një kanaçe kole", "für eine Getränkedose")],
      lead: x(
        "In Lean Thinking, Womack and Jones traced a simple product: a can of cola. It took 319 days, nine facilities, six companies and four countries to reach a buyer.",
        "Te Lean Thinking, Womack dhe Jones ndoqën një produkt të thjeshtë: një kanaçe kole. Iu deshën 319 ditë, nëntë objekte, gjashtë kompani dhe katër vende për të arritur te blerësi.",
        "In Lean Thinking verfolgten Womack und Jones ein einfaches Produkt: eine Coladose. Es brauchte 319 Tage, neun Standorte, sechs Unternehmen und vier Länder, bis es bei einem Käufer ankam."),
      blocks: [
        { type: "days", total: 319, part: 0.125, label: x("The cola can, one square for each day", "Kanaçja e kolës, një katror për çdo ditë", "Die Getränkedose, ein Feld pro Tag"),
          legend: [
            { n: x("319 days", "319 ditë", "319 Tage"), t: x("from the raw material to the buyer", "nga lënda e parë te blerësi", "vom Rohstoff bis zum Käufer") },
            { n: x("3 hours", "3 orë", "3 Stunden"), t: x("of value-creating work: one eighth of the last square", "punë që krijon vlerë: një e teta e katrorit të fundit", "wertschöpfende Arbeit: ein Achtel des letzten Feldes") },
          ] },
        { type: "p", text: x(
          "The rest was storage, transport, inspection and rework: steps that create no value for the person who drinks from the can. The can is an extreme case, but the shape is common: a long wait around a short piece of real work.",
          "Pjesa tjetër ishte magazinim, transport, inspektim dhe ripunim: hapa që nuk krijojnë vlerë për atë që pi nga kanaçja. Kanaçja është rast ekstrem, por forma është e zakonshme: një pritje e gjatë rreth një pjese të shkurtër pune të vërtetë.",
          "Der Rest war Lagern, Transportieren, Prüfen und Nacharbeiten: Schritte, die für die Person, die aus der Dose trinkt, keinen Wert schaffen. Die Dose ist ein Extremfall, aber die Form ist häufig: ein langes Warten um ein kurzes Stück echter Arbeit.") },
        { type: "callout", reading: true, text: x(
          "Before making the work faster, look at the time when no one is working. That is usually where most of the time goes.",
          "Para se ta bësh punën më të shpejtë, shiko kohën kur askush nuk punon. Zakonisht aty shkon pjesa më e madhe e kohës.",
          "Bevor man die Arbeit schneller macht, sollte man die Zeit ansehen, in der niemand arbeitet. Meist geht dort der größte Teil der Zeit hin.") },
      ],
      source: ["womack-jones-1996"],
    },
    {
      id: "model",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Seven wastes,", "Shtatë humbje,", "Sieben Verschwendungen"), x("and an eighth", "dhe një e tetë", "und eine achte")],
      lead: x(
        "The first seven are the ones Ohno described. The eighth was added later; Toyota itself still counts seven.",
        "Shtatë të parat janë ato që përshkroi Ohno. E teta u shtua më vonë; vetë Toyota numëron ende shtatë.",
        "Die ersten sieben sind die, die Ohno beschrieb. Die achte kam später dazu; Toyota selbst zählt bis heute sieben."),
      blocks: [
        { type: "rows", compact: true, items: [
          waste("01", ["Overproduction", "Making more, or earlier, than needed. The worst, because it feeds the others."], ["Mbiprodhimi", "Të bësh më shumë, ose më herët, se ç'duhet. Më e rënda, sepse ushqen të tjerat."], ["Überproduktion", "Mehr oder früher herstellen als nötig. Die schlimmste, weil sie die anderen nährt."]),
          waste("02", ["Waiting", "People or machines waiting for material, information or a decision."], ["Pritja", "Njerëz ose makina që presin material, informacion ose një vendim."], ["Warten", "Menschen oder Maschinen warten auf Material, Information oder eine Entscheidung."]),
          waste("03", ["Transport", "Moving material or information more than the work needs."], ["Transporti", "Lëvizja e materialit ose e informacionit më shumë se ç'kërkon puna."], ["Transport", "Material oder Information öfter bewegen, als die Arbeit es braucht."]),
          waste("04", ["Over-processing", "More work than the customer needs or will pay for."], ["Përpunimi i tepërt", "Më shumë punë se ç'i duhet klientit ose se ç'paguan ai."], ["Überbearbeitung", "Mehr Arbeit, als der Kunde braucht oder bezahlt."]),
          waste("05", ["Inventory", "Material, work in progress or products beyond what is needed now."], ["Stoku", "Material, punë në proces ose produkte përtej asaj që duhet tani."], ["Bestände", "Material, Ware in Arbeit oder Produkte über den aktuellen Bedarf hinaus."]),
          waste("06", ["Motion", "Walking, reaching and searching that the task does not need."], ["Lëvizja", "Ecje, zgjatje dhe kërkim që nuk i duhen detyrës."], ["Bewegung", "Laufen, Greifen und Suchen, das die Aufgabe nicht braucht."]),
          waste("07", ["Defects", "Errors that must be corrected, reworked or thrown away."], ["Defektet", "Gabime që duhen korrigjuar, ripunuar ose hedhur."], ["Fehler", "Fehler, die korrigiert, nachgearbeitet oder weggeworfen werden müssen."]),
          waste("08", ["Unused talent", "Ideas, skills and knowledge of the people that nobody asks for."], ["Talenti i papërdorur", "Idetë, aftësitë dhe njohuritë e njerëzve që askush nuk i kërkon."], ["Ungenutztes Talent", "Ideen, Fähigkeiten und Wissen der Menschen, nach denen niemand fragt."]),
        ] },
        { type: "callout", reading: true, text: x(
          "The eighth is the one a manager controls most directly. The people who do the work usually see the other seven first.",
          "E teta është ajo që menaxheri e kontrollon më drejtpërdrejt. Njerëzit që e bëjnë punën zakonisht i shohin të parët shtatë të tjerat.",
          "Die achte hat eine Führungskraft am direktesten in der Hand. Die Menschen, die die Arbeit machen, sehen die anderen sieben meist zuerst.") },
      ],
      source: ["ohno-1988", "lei-lexicon", "lei-eight-wastes", "liker-2004"],
    },
    {
      id: "principles",
      kicker: x("The principles", "Parimet", "Die Prinzipien"),
      title: [x("Five steps", "Pesë hapa", "Fünf Schritte"), x("of Lean thinking", "të të menduarit Lean", "des Lean-Denkens")],
      lead: x(
        "Womack and Jones summed up Lean as a sequence. Each step starts from the customer, not from the machine or the department.",
        "Womack dhe Jones e përmblodhën Lean-in si një varg. Çdo hap nis nga klienti, jo nga makina ose departamenti.",
        "Womack und Jones fassten Lean als Abfolge zusammen. Jeder Schritt beginnt beim Kunden, nicht bei der Maschine oder der Abteilung."),
      blocks: [
        { type: "chain", items: [
          { h: x("Value", "Vlera", "Wert"), p: x("What does the customer really pay for?", "Për çfarë paguan vërtet klienti?", "Wofür zahlt der Kunde wirklich?") },
          { h: x("Value stream", "Rrjedha e vlerës", "Wertstrom"), p: x("Every step the product or request goes through.", "Çdo hap nga kalon produkti ose kërkesa.", "Jeder Schritt, den Produkt oder Auftrag durchläuft.") },
          { h: x("Flow", "Rrjedhshmëria", "Fluss"), p: x("The steps that add value follow each other without stops.", "Hapat që shtojnë vlerë vijnë njëri pas tjetrit pa ndalesa.", "Die wertschöpfenden Schritte folgen ohne Halt aufeinander.") },
          { h: x("Pull", "Tërheqja", "Ziehen"), p: x("Make only what the next step or the customer asks for.", "Bëj vetëm atë që kërkon hapi tjetër ose klienti.", "Nur herstellen, was der nächste Schritt oder der Kunde verlangt.") },
          { h: x("Perfection", "Përsosja", "Perfektion"), p: x("Start again: there is always more waste to find.", "Fillo sërish: gjithmonë ka më shumë humbje për të gjetur.", "Von vorn beginnen: Es gibt immer mehr Verschwendung zu finden.") },
        ] },
        { type: "example", label: x("Hypothetical example, a hotel room between two guests", "Shembull hipotetik, një dhomë hoteli mes dy mysafirëve", "Hypothetisches Beispiel, ein Hotelzimmer zwischen zwei Gästen"), rows: [
          { k: x("Value", "Vlera", "Wert"), v: x("A clean room, ready when the next guest arrives.", "Një dhomë e pastër, gati kur mbërrin mysafiri tjetër.", "Ein sauberes Zimmer, fertig, wenn der nächste Gast ankommt.") },
          { k: x("Value stream", "Rrjedha e vlerës", "Wertstrom"), v: x("Check-out, cleaning, inspection, room marked ready. Note how long the room waits between steps.", "Largimi, pastrimi, kontrolli, dhoma e shënuar gati. Shëno sa pret dhoma mes hapave.", "Abreise, Reinigung, Kontrolle, Zimmer als fertig gemeldet. Notieren, wie lange es zwischen den Schritten wartet.") },
          { k: x("Flow", "Rrjedhshmëria", "Fluss"), v: x("Each room is cleaned as soon as the guest leaves, not all of them after noon.", "Çdo dhomë pastrohet sapo largohet mysafiri, jo të gjitha bashkë pas mesditës.", "Jedes Zimmer wird gereinigt, sobald der Gast abreist, nicht alle zusammen nach Mittag.") },
          { k: x("Pull", "Tërheqja", "Ziehen"), v: x("The arrivals list sets the order: the rooms needed first are cleaned first.", "Lista e mbërritjeve vendos radhën: pastrohen më parë dhomat që duhen më parë.", "Die Ankunftsliste bestimmt die Reihenfolge: Was zuerst gebraucht wird, wird zuerst gereinigt.") },
          { k: x("Perfection", "Përsosja", "Perfektion"), v: x("Each week one cause of delay is removed, such as linen missing from the cart.", "Çdo javë hiqet një shkak vonese, për shembull çarçafët që mungojnë në karrocë.", "Jede Woche wird eine Ursache für Verzögerung beseitigt, etwa fehlende Bettwäsche auf dem Wagen.") },
        ], text: x(
          "An illustration by the editors, not the case of a company.",
          "Ilustrim i redaksisë, jo rasti i një kompanie.",
          "Eine Illustration der Redaktion, kein Fall eines Unternehmens.") },
        { type: "timeline", items: [
          { k: "1978", t: x("Ohno's book on the Toyota system appears in Japan.", "Libri i Ohno-s për sistemin e Toyota-s del në Japoni.", "Ohnos Buch über das Toyota-System erscheint in Japan.") },
          { k: "1988", t: x("English edition. John Krafcik's article names “lean production”.", "Botimi anglisht. Artikulli i John Krafcik e quan “lean production”.", "Englische Ausgabe. John Krafciks Artikel prägt „lean production“.") },
          { k: "1990", t: x("The Machine That Changed the World: 90 plants in 17 countries.", "The Machine That Changed the World: 90 fabrika në 17 vende.", "The Machine That Changed the World: 90 Werke in 17 Ländern.") },
          { k: "1996", t: x("Lean Thinking: the five principles.", "Lean Thinking: pesë parimet.", "Lean Thinking: die fünf Prinzipien.") },
        ] },
      ],
      source: ["womack-jones-1996", "ohno-1988", "krafcik-1988", "womack-1990"],
    },
    {
      id: "floor", more: "pareto-and-5-why-in-practice",
      kicker: x("Beyond the factory", "Jashtë fabrikës", "Jenseits der Fabrik"),
      title: [x("The same wastes,", "Të njëjtat humbje,", "Dieselben Verschwendungen,"), x("other names", "emra të tjerë", "andere Namen")],
      lead: x(
        "Three settings, a few examples each. They are illustrations, not cases from a particular company: the point is to recognise the pattern in your own work.",
        "Tri mjedise, disa shembuj për secilin. Janë ilustrime, jo raste nga një kompani e caktuar: qëllimi është ta njohësh modelin në punën tënde.",
        "Drei Umgebungen, je einige Beispiele. Es sind Illustrationen, keine Fälle eines Unternehmens: Man soll das Muster in der eigenen Arbeit erkennen."),
      blocks: [
        { type: "tiles", groups: [
          { h: x("Warehouse", "Magazina", "Lager"), tone: "red", items: [
            { n: "01", t: x("Picking orders long before the truck is planned", "Mbledhja e porosive shumë para se të planifikohet kamioni", "Aufträge kommissionieren, lange bevor der Lkw geplant ist") },
            { n: "06", t: x("Walking to a far shelf for the fastest item", "Ecja deri te rafti i largët për artikullin që lëviz më shpejt", "Für den schnellsten Artikel zum entferntesten Regal laufen") },
            { n: "07", t: x("Parcels loaded without the last item", "Pako të ngarkuara pa artikullin e fundit", "Pakete ohne den letzten Artikel verladen") },
          ] },
          { h: x("Last mile", "Shpërndarja", "Letzte Meile"), tone: "blue", items: [
            { n: "02", t: x("Drivers waiting at the gate for loading", "Shoferë që presin te porta për ngarkim", "Fahrer warten am Tor auf die Beladung") },
            { n: "03", t: x("A parcel driven twice because the address was unclear", "Një pako që çohet dy herë sepse adresa nuk ishte e qartë", "Ein Paket, das zweimal gefahren wird, weil die Adresse unklar war") },
            { n: "05", t: x("Returns piling up until the end of the week", "Kthimet që grumbullohen deri në fund të javës", "Retouren, die sich bis zum Wochenende stapeln") },
          ] },
          { h: x("Hotel", "Hoteli", "Hotel"), tone: "ink", items: [
            { n: "04", t: x("The same guest data typed into two systems", "Të njëjtat të dhëna të mysafirit të shkruara në dy sisteme", "Dieselben Gästedaten in zwei Systeme tippen") },
            { n: "02", t: x("A guest waiting for a room that is clean but not released", "Një mysafir që pret një dhomë të pastër, por ende të paliruar në sistem", "Ein Gast wartet auf ein Zimmer, das sauber, aber nicht freigegeben ist") },
            { n: "08", t: x("A fix from the night receptionist that nobody asks about", "Një zgjidhje e recepsionistit të natës për të cilën nuk pyet askush", "Eine Lösung des Nachtportiers, nach der niemand fragt") },
          ] },
        ] },
        { type: "box", title: x("Three questions to find it", "Tri pyetje për ta gjetur", "Drei Fragen, um sie zu finden"), items: [
          x("Where does the work wait, and for how long?", "Ku pret puna, dhe sa gjatë?", "Wo wartet die Arbeit, und wie lange?"),
          x("What is written, counted or checked twice?", "Çfarë shkruhet, numërohet ose kontrollohet dy herë?", "Was wird zweimal geschrieben, gezählt oder geprüft?"),
          x("What does someone search for every day, because it has no fixed place?", "Çfarë kërkon dikush çdo ditë, sepse nuk ka vend të caktuar?", "Was sucht jemand jeden Tag, weil es keinen festen Platz hat?"),
        ] },
        { type: "callout", reading: true, text: x(
          "A waste that everyone sees every day has usually stopped being seen as a waste. It has become “the way we work”.",
          "Një humbje që e shohin të gjithë çdo ditë zakonisht nuk shihet më si humbje. Është bërë “mënyra si punojmë”.",
          "Eine Verschwendung, die alle jeden Tag sehen, gilt meist nicht mehr als Verschwendung. Sie ist zu „unserer Arbeitsweise“ geworden.") },
      ],
      note: x("The examples are illustrations by the editors; the numbers refer to the wastes on page 4.", "Shembujt janë ilustrime të redaksisë; numrat i referohen humbjeve te faqja 4.", "Die Beispiele sind Illustrationen der Redaktion; die Nummern verweisen auf die Verschwendungen auf Seite 4."),
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie man es misst"),
      title: [x("How much of the time", "Sa nga koha", "Wie viel der Zeit"), x("creates value?", "krijon vlerë?", "schafft Wert?")],
      lead: x(
        "Divide the time spent on value-creating work by the total time from request to delivery. For the cola can, three hours out of 319 days is about 0.04%.",
        "Pjesëto kohën e punës që krijon vlerë me kohën e plotë nga kërkesa te dorëzimi. Për kanaçen e kolës, tre orë nga 319 ditë janë rreth 0,04%.",
        "Teilen Sie die Zeit wertschöpfender Arbeit durch die gesamte Zeit von der Anfrage bis zur Lieferung. Bei der Getränkedose sind drei Stunden von 319 Tagen etwa 0,04 %."),
      blocks: [
        { type: "steps", items: [
          { h: x("Follow one item", "Ndiq një artikull", "Einem Stück folgen"), p: x("One order, one request, one room, from the moment it is asked for to the moment it is delivered.", "Një porosi, një kërkesë, një dhomë, nga momenti kur kërkohet te momenti kur dorëzohet.", "Ein Auftrag, eine Anfrage, ein Zimmer, vom Moment der Anfrage bis zur Übergabe.") },
          { h: x("Write down every step and its time", "Shkruaj çdo hap dhe kohën e tij", "Jeden Schritt mit Zeit notieren"), p: x("Including the time it waits between steps.", "Përfshi edhe kohën që pret mes hapave.", "Auch die Zeit, in der es zwischen den Schritten wartet.") },
          { h: x("Mark the value", "Shëno vlerën", "Den Wert markieren"), p: x("Would the customer pay for this step if they saw it? If not, it is one of the eight.", "A do ta paguante klienti këtë hap nëse do ta shihte? Nëse jo, është një nga të tetat.", "Würde der Kunde diesen Schritt bezahlen, wenn er ihn sähe? Wenn nicht, ist es eine der acht.") },
          { h: x("Start with the biggest wait", "Nis nga pritja më e madhe", "Mit der größten Wartezeit beginnen"), p: x("Not with the step that is easiest to speed up.", "Jo nga hapi që përshpejtohet më lehtë.", "Nicht mit dem Schritt, der sich am leichtesten beschleunigen lässt.") },
        ] },
        { type: "example", label: x("Hypothetical example, one order in a warehouse", "Shembull hipotetik, një porosi në magazinë", "Hypothetisches Beispiel, ein Auftrag im Lager"), text: x(
          "The order arrives on Monday at 9:00 and is delivered on Wednesday at 15:00: 54 hours. The work that creates value, picking, packing and loading, takes 40 minutes: about 1.2%. The biggest wait is the first night in the queue. The numbers are invented.",
          "Porosia vjen të hënën në 9:00 dhe dorëzohet të mërkurën në 15:00: 54 orë. Puna që krijon vlerë, mbledhja, paketimi dhe ngarkimi, zgjat 40 minuta: rreth 1,2%. Pritja më e madhe është nata e parë në radhë. Numrat janë të shpikur.",
          "Der Auftrag kommt am Montag um 9:00 und wird am Mittwoch um 15:00 geliefert: 54 Stunden. Kommissionieren, Verpacken und Verladen dauern 40 Minuten: rund 1,2 %. Am längsten wartet er in der ersten Nacht. Die Zahlen sind erfunden.") },
        { type: "callout", reading: true, text: x(
          "Lean calls overproduction the worst waste because it hides the others: when there is always stock, nobody sees the waiting, the defects or the extra moves behind it.",
          "Lean-i e quan mbiprodhimin humbjen më të rëndë sepse fsheh të tjerat: kur ka gjithmonë stok, askush nuk e sheh pritjen, defektet ose lëvizjet e tepërta pas tij.",
          "Lean nennt Überproduktion die schlimmste Verschwendung, weil sie die anderen verdeckt: Wenn immer Bestand da ist, sieht niemand das Warten, die Fehler oder die zusätzlichen Wege dahinter.") },
      ],
      note: x("The 0.04% is the editors' calculation from the figures of Womack and Jones. The four steps are a practice proposed by the editors.", "0,04% është llogaritje e redaksisë nga shifrat e Womack dhe Jones. Katër hapat janë praktikë e propozuar nga redaksia.", "Die 0,04 % sind eine Berechnung der Redaktion aus den Zahlen von Womack und Jones. Die vier Schritte sind eine Praxis, die die Redaktion vorschlägt."),
      source: ["womack-jones-1996", "lei-lexicon"],
    },
    {
      id: "tool", tool: "/tools/pareto/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The waste", "Karta e ecjes", "Die Karte für"), x("walk card", "në terren", "den Rundgang")],
      lead: x(
        "Thirty minutes on the floor, with the people who do the work. One line for each waste: what you saw, where, and how often.",
        "Tridhjetë minuta në terren, me njerëzit që e bëjnë punën. Një rresht për çdo humbje: çfarë pe, ku, dhe sa shpesh.",
        "Dreißig Minuten vor Ort, mit den Menschen, die die Arbeit machen. Eine Zeile pro Verschwendung: was Sie gesehen haben, wo und wie oft."),
      blocks: [
        { type: "form", items: [
          { h: x("Overproduction", "Mbiprodhimi", "Überproduktion"), hint: x("made before anyone asked?", "bërë para se ta kërkonte dikush?", "hergestellt, bevor jemand fragte?") },
          { h: x("Waiting", "Pritja", "Warten"), hint: x("who waits for what?", "kush pret për çfarë?", "wer wartet worauf?") },
          { h: x("Transport", "Transporti", "Transport"), hint: x("what is moved more than once?", "çfarë lëvizet më shumë se një herë?", "was wird mehr als einmal bewegt?") },
          { h: x("Over-processing", "Përpunimi i tepërt", "Überbearbeitung"), hint: x("which step would the customer not pay for?", "cilin hap nuk do ta paguante klienti?", "welchen Schritt würde der Kunde nicht bezahlen?") },
          { h: x("Inventory", "Stoku", "Bestände"), hint: x("what piles up, and where?", "çfarë grumbullohet, dhe ku?", "was stapelt sich, und wo?") },
          { h: x("Motion", "Lëvizja", "Bewegung"), hint: x("who walks or searches without need?", "kush ecën ose kërkon pa nevojë?", "wer läuft oder sucht unnötig?") },
          { h: x("Defects", "Defektet", "Fehler"), hint: x("what is done twice?", "çfarë bëhet dy herë?", "was wird doppelt gemacht?") },
          { h: x("Unused talent", "Talenti i papërdorur", "Ungenutztes Talent"), hint: x("which idea from the team is waiting for an answer?", "cila ide e ekipit pret një përgjigje?", "welche Idee aus dem Team wartet auf Antwort?") },
        ] },
      ],
      note: x(
        "A practice proposed by the editors. Note what you see, not who did it.",
        "Praktikë e propozuar nga redaksia. Shëno atë që sheh, jo kush e bëri.",
        "Eine Praxis, die die Redaktion vorschlägt. Notieren Sie, was Sie sehen, nicht wer es getan hat."),
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
