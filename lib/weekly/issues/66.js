// Management Review, No. 66: Kanban and the work-in-process limit. Block: Operations.
// Facts and their sources: docs/revista/management-review-nr-66.md.
import { x, pc } from "../common.js";

export default {
  number: 66,
  block: "operations",
  date: x("November 2026", "Nëntor 2026", "November 2026"),
  theme: [x("Kanban:", "Kanban:", "Kanban:"), x("the limit on work in process", "kufiri i punës në proces", "die Grenze für laufende Arbeit")],
  sub: x(
    "Toyota's supermarket method of 1954, a BBC Worldwide team with limits on its board, pull as a cap on open work, judges in Rome who juggled fewer cases, four flow measures, and a card for one board.",
    "Metoda e supermarketit te Toyota-s në 1954, një ekip i BBC Worldwide me kufij në tabelë, tërheqja si tavan për punën e hapur, gjyqtarët në Romë që mbanin më pak çështje njëkohësisht, katër matje të rrjedhës, dhe një kartë për një tabelë.",
    "Toyotas Supermarkt-Methode von 1954, ein Team von BBC Worldwide mit Grenzen am Board, Pull als Deckel für offene Arbeit, Richter in Rom mit weniger parallelen Fällen, vier Flussmaße und eine Karte für ein Board."),
  seo: x(
    "Kanban and WIP limits: Toyota's supermarket method, a BBC Worldwide case, pull as a cap on open work, a field study of judges, flow measures and a card.",
    "Kanban dhe kufiri i punës në proces: metoda e supermarketit e Toyota-s, rasti i BBC Worldwide, tërheqja, gjyqtarët në Romë, matjet e rrjedhës, një kartë.",
    "Kanban und WIP-Limits: Toyotas Supermarkt-Methode, ein Fall bei BBC Worldwide, Pull als Deckel, eine Feldstudie mit Richtern, Flussmaße und eine Karte."),
  feature: x(
    "Issue 66 starts with the month-end rush that Toyota's supermarket method was meant to end in 1954, follows a nine-person software team at BBC Worldwide that put limits on its kanban boards, sets out why pull is in essence a cap on work in process, looks at a field study in which six judges in Rome juggled fewer cases and finished them sooner, explains the four flow measures of the Kanban Guide, and ends with a card for setting up one board with limits.",
    "Numri 66 nis me nxitimin e fundmuajit që metoda e supermarketit e Toyota-s synonte ta mbyllte në 1954, ndjek një ekip softueri prej nëntë vetash në BBC Worldwide që vuri kufij në tabelat kanban, shtjellon pse tërheqja në thelb është një tavan për punën në proces, shikon një studim në terren ku gjashtë gjyqtarë në Romë mbanin më pak çështje njëkohësisht dhe i mbyllnin më shpejt, shpjegon katër matjet e rrjedhës te Kanban Guide, dhe mbyllet me një kartë për ngritjen e një tabele me kufij.",
    "Ausgabe 66 beginnt mit dem Monatsend-Endspurt, den Toyotas Supermarkt-Methode 1954 beenden sollte, folgt einem neunköpfigen Softwareteam bei BBC Worldwide, das seine Kanban-Boards begrenzte, zeigt, warum Pull im Kern ein Deckel für laufende Arbeit ist, betrachtet eine Feldstudie, in der sechs Richter in Rom weniger Fälle parallel führten und sie schneller abschlossen, erklärt die vier Flussmaße des Kanban Guide und endet mit einer Karte für ein Board mit Grenzen."),
  figure: { n: pc(37), by: "Middleton & Joyce, 2012", t: x(
    "shorter average lead time in 12 months for a nine-person software team at BBC Worldwide that worked with kanban boards and limits on work in process.",
    "më e shkurtër koha mesatare e kalimit për 12 muaj, në një ekip softueri prej nëntë vetash në BBC Worldwide që punonte me tabela kanban dhe kufij për punën në proces.",
    "kürzere mittlere Durchlaufzeit in 12 Monaten bei einem neunköpfigen Softwareteam von BBC Worldwide, das mit Kanban-Boards und WIP-Limits arbeitete.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("The next process is the customer", "Procesi pasardhës është klienti", "Der nächste Prozess ist der Kunde") },
    { page: "research", kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: x("Fewer cases at once", "Më pak çështje njëkohësisht", "Weniger Fälle zugleich") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("One board, with limits", "Një tabelë, me kufij", "Ein Board mit Grenzen") },
  ],
  sources: ["kanban-toyota-1954", "kanban-middleton-joyce-2012", "kanban-hopp-spearman-2004", "kanban-anderson-2014", "kanban-coviello-2015", "kanban-bray-2016", "kanban-guide-2025"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "A board full of cards looks like a busy team. Often it is a team that has started more than it can finish. This issue is about kanban and the limit it puts on work in process: how many things may be open at once, and what happens when the limit is reached.",
        "Një tabelë plot me karta duket si një ekip i zënë. Shpesh është një ekip që ka nisur më shumë sesa mund të mbarojë. Ky numër flet për kanban-in dhe për kufirin që ai i vë punës në proces: sa gjëra mund të jenë të hapura njëkohësisht, dhe çfarë ndodh kur kufiri arrihet.",
        "Ein Board voller Karten wirkt wie ein fleißiges Team. Oft ist es ein Team, das mehr begonnen hat, als es beenden kann. Diese Ausgabe handelt von Kanban und der Grenze, die es laufender Arbeit setzt: wie viel gleichzeitig offen sein darf und was geschieht, wenn die Grenze erreicht ist."),
      body: x(
        "In 1954 Toyota let each process take parts from the one before, instead of having them pushed on. Half a century later, a team at BBC Worldwide put limits on its boards and delivered sooner and more evenly. Two researchers of operations argue that pull is, in essence, a cap on work in process. In Rome, six judges who kept fewer cases open at once finished them sooner. The Kanban Guide names four measures, and a card helps set up one board.",
        "Në 1954, Toyota i la proceset të merrnin pjesët nga procesi paraardhës, në vend që t'u shtyheshin. Gjysmë shekulli më vonë, një ekip në BBC Worldwide u vuri kufij tabelave dhe dorëzoi më shpejt e më njëtrajtshëm. Dy studiues të operacioneve thonë se tërheqja, në thelb, është një tavan për punën në proces. Në Romë, gjashtë gjyqtarë që mbanin më pak çështje të hapura njëkohësisht i mbyllën më shpejt. Kanban Guide emërton katër matje, dhe një kartë ndihmon të ngrihet një tabelë.",
        "1954 ließ Toyota jeden Prozess die Teile beim vorigen holen, statt sie ihm zuzuschieben. Ein halbes Jahrhundert später begrenzte ein Team bei BBC Worldwide seine Boards und lieferte schneller und gleichmäßiger. Zwei Operations-Forscher sehen in Pull im Kern einen Deckel für laufende Arbeit. In Rom schlossen sechs Richter, die weniger Fälle zugleich offen hielten, sie schneller ab. Der Kanban Guide nennt vier Maße, und eine Karte hilft beim Aufbau eines Boards."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("The next process", "Procesi pasardhës", "Der nächste Prozess"), x("is the customer", "është klienti", "ist der Kunde")],
      lead: x(
        "According to Toyota's own history, each part in its machining plant once travelled with a voucher and was carried to the next plant whether that plant needed it or not. Parts piled up, and assembly built whatever it had parts for.",
        "Sipas historisë së vetë Toyota-s, dikur çdo pjesë në repartin e përpunimit udhëtonte me një fletë shoqëruese dhe çohej te reparti tjetër, qoftë kur ai kishte nevojë për të, qoftë kur jo. Pjesët grumbulloheshin, dhe montimi ndërtonte atë për të cilën kishte pjesë.",
        "Laut Toyotas eigener Geschichte reiste früher jedes Teil der mechanischen Fertigung mit einem Begleitschein und wurde ins nächste Werk gebracht, ob es dort gebraucht wurde oder nicht. Teile stapelten sich, und die Montage baute, wofür gerade Teile da waren."),
      blocks: [
        { type: "p", text: x(
          "Early in the month, assembly reached roughly half the plan. At the end of the month, with all parts in, the conveyors ran faster to catch up, with the same people who had waited for parts at the start. In 1954, as volumes grew, Toyota introduced what it called the supermarket method.",
          "Në fillim të muajit, montimi arrinte afërsisht gjysmën e planit. Në fund të muajit, kur kishin mbërritur të gjitha pjesët, transportuesit shpejtoheshin për ta arritur planin, me të njëjtët njerëz që në fillim kishin pritur pjesët. Në 1954, kur vëllimet u rritën, Toyota futi atë që e quajti metoda e supermarketit.",
          "Zu Monatsbeginn schaffte die Montage etwa die Hälfte des Plans. Am Monatsende, wenn alle Teile da waren, liefen die Bänder schneller, um aufzuholen, mit denselben Leuten, die anfangs auf Teile gewartet hatten. 1954, mit wachsenden Stückzahlen, führte Toyota die sogenannte Supermarkt-Methode ein.") },
        { type: "quote", text: x(
          "The subsequent process is the 'customer' and the prior process is the 'supermarket'.",
          "Procesi pasardhës është 'klienti' dhe procesi paraardhës është 'supermarketi'.",
          "Der nachfolgende Prozess ist der ‚Kunde‘, der vorherige Prozess der ‚Supermarkt‘.") },
        { type: "cards", cols: 3, items: [
          { h: x("Supermarket", "Supermarketi", "Supermarkt"), p: x("the earlier process: it holds parts and replaces only what was taken", "procesi paraardhës: mban pjesë dhe zëvendëson vetëm atë që u mor", "der vorige Prozess: hält Teile bereit und ersetzt nur, was entnommen wurde") },
          { h: x("Customer", "Klienti", "Kunde"), p: x("the later process: it takes what it needs, when it needs it", "procesi pasardhës: merr atë që i duhet, kur i duhet", "der nächste Prozess: holt, was er braucht, wenn er es braucht") },
          { h: x("Kanban", "Kanban", "Kanban"), p: x("the card added later: product name, number and quantity", "karta që u shtua më vonë: emri i produktit, numri dhe sasia", "die später ergänzte Karte: Name, Nummer und Menge des Produkts") },
        ] },
        { type: "callout", reading: true, text: x(
          "Push sends work on because it is finished. Pull starts work because there is room for it.",
          "Shtytja e çon punën tutje sepse ka mbaruar. Tërheqja e nis punën sepse ka vend për të.",
          "Push schiebt Arbeit weiter, weil sie fertig ist. Pull beginnt Arbeit, weil Platz für sie ist.") },
      ],
      note: x(
        "Toyota's history says the idea came from a 1954 trade-press report on a Lockheed aircraft plant, when supermarkets were still rare in Japan. Other tellings credit Taiichi Ohno's look at US supermarkets; we could not check his book, so we follow Toyota.",
        "Historia e Toyota-s thotë se ideja erdhi nga një reportazh i shtypit të industrisë në 1954 për një fabrikë avionësh të Lockheed-it, kur supermarketet ishin ende të rralla në Japoni. Rrëfime të tjera ia atribuojnë vëzhgimit të supermarketeve amerikane nga Taiichi Ohno; librin e tij nuk e pamë, ndaj ndjekim Toyota-n.",
        "Laut Toyotas Geschichte stammte die Idee aus einem Fachpressebericht von 1954 über ein Flugzeugwerk von Lockheed, als Supermärkte in Japan noch selten waren. Andere Erzählungen nennen Taiichi Ohnos Blick auf US-Supermärkte; sein Buch konnten wir nicht prüfen, daher folgen wir Toyota."),
      source: ["kanban-toyota-1954"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("Limits on", "Kufij në", "Grenzen am"), x("the board", "tabelë", "Board")],
      lead: x(
        "In April 2008 a nine-person software team at BBC Worldwide drew its stages on kanban boards and put each piece of work on a card. There was more work in process than anyone had realised. Peter Middleton and David Joyce studied a year of its data.",
        "Në prill 2008, një ekip softueri prej nëntë vetash në BBC Worldwide vizatoi fazat e punës në tabela kanban dhe vendosi çdo punë në një kartë. Puna në proces doli më e madhe nga sa mendonte kushdo. Peter Middleton dhe David Joyce studiuan të dhënat e një viti.",
        "Im April 2008 zeichnete ein neunköpfiges Softwareteam bei BBC Worldwide seine Stufen auf Kanban-Boards und setzte jede Aufgabe auf eine Karte. Es lief mehr Arbeit, als allen bewusst war. Peter Middleton und David Joyce werteten ein Jahr seiner Daten aus."),
      blocks: [
        { type: "dumbbell", from: x("Before", "Para", "Vorher"), to: x("After", "Pas", "Nachher"), min: 0, max: 75, rowH: 26, source: ["kanban-middleton-joyce-2012"],
          label: x("Working days, one BBC Worldwide team, 2008–2009", "Ditë pune, një ekip i BBC Worldwide, 2008–2009", "Arbeitstage, ein Team von BBC Worldwide, 2008–2009"),
          rows: [
            { k: x("Lead time, mean", "Koha e kalimit", "Durchlaufzeit"), a: 22.8, an: x("22.8", "22,8", "22,8"), b: 14.4, bn: x("14.4", "14,4", "14,4") },
            { k: x("Its upper limit", "Kufiri i sipërm", "Ihre Obergrenze"), a: 70.7, an: x("70.7", "70,7", "70,7"), b: 37.3, bn: x("37.3", "37,3", "37,3"), alert: true },
            { k: x("Development time", "Koha e zhvillimit", "Entwicklungszeit"), a: 9.2, an: x("9.2", "9,2", "9,2"), b: 2.5, bn: x("2.5", "2,5", "2,5") },
            { k: x("Blocked, per month", "Të bllokuara në muaj", "Blockiert je Monat"), a: 25.8, an: x("25.8", "25,8", "25,8"), b: 4.9, bn: x("4.9", "4,9", "4,9") },
          ] },
        { type: "p", text: x(
          "The limits came from the constraints: with fewer testers and analysts than developers, they followed what those could handle, and moved when the constraints moved. Defects reported by customers fell by 24%.",
          "Kufijtë dolën nga pikat e ngushta: me më pak testues dhe analistë se programues, ndoqën sa përballonin ata, dhe lëvizën kur lëvizën pikat e ngushta. Defektet e raportuara nga klientët ranë me 24%.",
          "Die Grenzen folgten den Engpässen: Mit weniger Testern und Analysten als Entwicklern richteten sie sich nach deren Kapazität und wanderten mit den Engpässen. Von Kunden gemeldete Fehler sanken um 24 %.") },
        { type: "callout", reading: true, text: x(
          "The limit did not make anyone work faster. It made the queue visible, at the stage where it formed.",
          "Kufiri nuk e bëri askënd të punonte më shpejt. E bëri radhën të dukshme, te faza ku formohej.",
          "Die Grenze ließ niemanden schneller arbeiten. Sie machte die Schlange sichtbar, dort, wo sie entstand.") },
      ],
      note: x(
        "Upper limit: the upper control limit of lead time, a measure of spread (−47%). Development time covers nine months. One case; the team also cut work smaller and grew in skill.",
        "Kufiri i sipërm: kufiri i sipërm i kontrollit për kohën e kalimit, masë e shpërndarjes (−47%). Koha e zhvillimit mbulon nëntë muaj. Një rast i vetëm; ekipi i ndau edhe punët më imët dhe u rrit në aftësi.",
        "Obergrenze: die obere Eingriffsgrenze der Durchlaufzeit, ein Maß der Streuung (−47 %). Die Entwicklungszeit umfasst neun Monate. Ein Einzelfall; das Team schnitt die Arbeit auch kleiner und wurde erfahrener."),
      source: ["kanban-middleton-joyce-2012"],
    },
    {
      id: "model",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Pull is", "Tërheqja është", "Pull ist"), x("a limit", "një kufi", "eine Grenze")],
      lead: x(
        "Wallace Hopp and Mark Spearman argued in 2004 that the practitioner literature had simplified “pull” until it was misunderstood. Their definition is short: pull is essentially a mechanism for limiting work in process. A kanban card is one such mechanism: no free card, no new start.",
        "Wallace Hopp dhe Mark Spearman shkruan në 2004 se literatura e praktikës e kishte thjeshtuar “tërheqjen” deri sa ajo keqkuptohej. Përkufizimi i tyre është i shkurtër: tërheqja në thelb është një mekanizëm që kufizon punën në proces. Karta kanban është një mekanizëm i tillë: pa kartë të lirë, nuk ka fillim të ri.",
        "Wallace Hopp und Mark Spearman schrieben 2004, die Praxisliteratur habe „Pull“ so vereinfacht, dass es missverstanden werde. Ihre Definition ist kurz: Pull ist im Kern ein Mechanismus, der laufende Arbeit begrenzt. Eine Kanban-Karte ist ein solcher Mechanismus: keine freie Karte, kein neuer Start."),
      blocks: [
        { type: "chain", label: x("A workflow with a limit, after the Kanban Guide", "Një rrjedhë pune me kufi, sipas Kanban Guide", "Ein Arbeitsfluss mit Grenze, nach dem Kanban Guide"), items: [
          { h: x("Work item", "Njësia e punës", "Arbeitseinheit"), p: x("what one card stands for", "çfarë përfaqëson një kartë", "wofür eine Karte steht") },
          { h: x("Started", "Fillimi", "Start"), p: x("the point where it counts as open", "pika ku quhet e hapur", "ab wann sie als offen gilt") },
          { h: x("States, with a limit", "Fazat, me kufi", "Stufen mit Grenze"), p: x("new work only below the limit", "punë e re vetëm nën kufi", "neue Arbeit nur unter der Grenze") },
          { h: x("Finished", "Mbarimi", "Fertig"), p: x("the point where it leaves", "pika ku del", "ab wann sie hinausgeht") },
        ] },
        { type: "p", text: x(
          "David Anderson dates kanban in knowledge work to 2004, when he designed a pull system for a maintenance team at Microsoft. It had no physical board. In his telling, the cards went up on a whiteboard at Corbis in 2007, at a team member's suggestion. His book Kanban followed in 2010.",
          "David Anderson e daton kanban-in në punën me dije në 2004, kur projektoi një sistem tërheqës për një ekip mirëmbajtjeje në Microsoft. Nuk kishte tabelë fizike. Sipas rrëfimit të tij, kartat u vunë në një tabelë të bardhë te Corbis në 2007, me propozimin e një anëtari të ekipit. Libri i tij Kanban erdhi në 2010.",
          "David Anderson datiert Kanban in der Wissensarbeit auf 2004, als er bei Microsoft ein Pull-System für ein Wartungsteam entwarf. Ein physisches Board gab es nicht. Nach seiner Darstellung kamen die Karten 2007 bei Corbis an ein Whiteboard, auf Vorschlag eines Teammitglieds. Sein Buch Kanban erschien 2010.") },
        { type: "callout", reading: true, text: x(
          "A board without limits is a picture of overload. The limit is what turns it into a pull system.",
          "Një tabelë pa kufij është një fotografi e mbingarkesës. Kufiri është ai që e kthen në sistem tërheqës.",
          "Ein Board ohne Grenzen ist ein Bild der Überlastung. Erst die Grenze macht daraus ein Pull-System.") },
      ],
      note: x(
        "The definition is Hopp & Spearman's; the chain follows the elements of a workflow in the Kanban Guide (2025). The history is Anderson's own account. The reading is the editors'.",
        "Përkufizimi është i Hopp-it dhe Spearman-it; zinxhiri ndjek elementet e rrjedhës së punës te Kanban Guide (2025). Historia është rrëfimi i vetë Anderson-it. Leximi është i redaksisë.",
        "Die Definition stammt von Hopp & Spearman; die Kette folgt den Elementen eines Arbeitsflusses im Kanban Guide (2025). Die Geschichte ist Andersons eigene Darstellung. Die Deutung stammt von der Redaktion."),
      source: ["kanban-hopp-spearman-2004", "kanban-guide-2025", "kanban-anderson-2014"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("Fewer cases", "Më pak çështje", "Weniger Fälle"), x("at once", "njëkohësisht", "zugleich")],
      lead: x(
        "Decio Coviello, Andrea Ichino and Nicola Persico studied Italian judges who received the same workload by lottery. Those who juggled more trials at once, instead of working on a few in sequence, took longer to complete their cases. The quality of rulings, measured by appeals, did not suffer.",
        "Decio Coviello, Andrea Ichino dhe Nicola Persico studiuan gjyqtarë italianë që merrnin të njëjtën ngarkesë me short. Ata që mbanin më shumë gjykime njëkohësisht, në vend që të punonin me radhë për pak prej tyre, i mbyllnin çështjet më vonë. Cilësia e vendimeve, e matur me apelimet, nuk u dëmtua.",
        "Decio Coviello, Andrea Ichino und Nicola Persico untersuchten italienische Richter, die per Los dieselbe Arbeitslast erhielten. Wer mehr Verfahren gleichzeitig jonglierte, statt wenige nacheinander zu bearbeiten, brauchte länger für seine Fälle. Die Qualität der Urteile, gemessen an Berufungen, litt nicht."),
      blocks: [
        { type: "p", text: x(
          "Then came a test in Rome's labour appeals court. From January 2011, six judges in one section scheduled all the hearings a new case would need up front, so that cases finished before new ones crowded in. 44 judges in four other sections kept the old way. The data run from 2005 to 2014.",
          "Pastaj erdhi një provë në gjykatën e apelit për çështjet e punës në Romë. Nga janari 2011, gjashtë gjyqtarë në një seksion i caktuan që në fillim të gjitha seancat që do t'i duheshin një çështjeje të re, që çështjet të mbaronin para se të grumbulloheshin të reja. 44 gjyqtarë në katër seksione të tjera vazhduan si më parë. Të dhënat shkojnë nga 2005 deri në 2014.",
          "Dann folgte ein Test am Berufungsgericht für Arbeitssachen in Rom. Ab Januar 2011 setzten sechs Richter einer Kammer alle Anhörungen, die ein neuer Fall brauchen würde, gleich zu Beginn an, damit Fälle endeten, bevor neue sich stauten. 44 Richter in vier anderen Kammern blieben beim alten Weg. Die Daten reichen von 2005 bis 2014.") },
        { type: "figures", compact: true, items: [
          { n: pc(12), t: x("shorter average case duration, against the other judges", "më e shkurtër kohëzgjatja mesatare e çështjeve, krahasuar me gjyqtarët e tjerë", "kürzere mittlere Falldauer, verglichen mit den übrigen Richtern") },
          { n: x("111 days", "111 ditë", "111 Tage"), t: x("less per case, by the authors' estimate", "më pak për çështje, sipas vlerësimit të autorëve", "weniger je Fall, nach Schätzung der Autoren") },
        ] },
        { type: "callout", reading: true, text: x(
          "Nobody worked harder. The judges started less at once, and finished what they had started.",
          "Askush nuk punoi më shumë. Gjyqtarët nisën më pak njëkohësisht, dhe mbaruan atë që kishin nisur.",
          "Niemand arbeitete mehr. Die Richter begannen weniger gleichzeitig und beendeten, was sie begonnen hatten.") },
      ],
      note: x(
        "Not a random assignment: the section's president asked to take part. A difference-in-differences study with six treated judges; a placebo test supports it. Their rulings were also appealed less often. Not every study finds lower WIP better on every measure (see No. 58).",
        "Nuk është caktim i rastësishëm: kryetarja e seksionit kërkoi të merrte pjesë. Studim me diferencë në diferenca, me gjashtë gjyqtarë të trajtuar; një test placebo e mbështet. Vendimet e tyre u apeluan edhe më rrallë. Jo çdo studim e gjen punën e paktë në proces më të mirë në çdo matje (shih Nr. 58).",
        "Keine Zufallszuteilung: Die Vorsitzende der Kammer wollte teilnehmen. Eine Differenz-von-Differenzen-Studie mit sechs Richtern; ein Placebotest stützt sie. Ihre Urteile wurden zudem seltener angefochten. Nicht jede Studie findet weniger WIP in jedem Maß besser (siehe Nr. 58)."),
      source: ["kanban-coviello-2015", "kanban-bray-2016"],
    },
    {
      id: "measure", more: "ten-minutes-before-the-shift",
      kicker: x("How it is measured", "Si matet", "Wie man es misst"),
      title: [x("Four measures,", "Katër matje,", "Vier Maße,"), x("one oldest card", "karta më e vjetër", "die älteste Karte")],
      lead: x(
        "The Kanban Guide by John Coleman and Daniel Vacanti asks every kanban system to track four flow measures, each counted between the points where the team says work starts and finishes.",
        "Kanban Guide i John Coleman-it dhe Daniel Vacanti-t i kërkon çdo sistemi kanban të ndjekë katër matje të rrjedhës, secila e numëruar mes pikave ku ekipi thotë se puna nis dhe mbaron.",
        "Der Kanban Guide von John Coleman und Daniel Vacanti verlangt von jedem Kanban-System vier Flussmaße, jeweils gezählt zwischen den Punkten, an denen Arbeit laut Team beginnt und endet."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("Work in process", "Puna në proces", "Laufende Arbeit"), p: x("items started but not finished", "njësitë e nisura por të pambaruara", "begonnene, nicht fertige Einheiten") },
          { h: x("Throughput", "Ritmi", "Durchsatz"), p: x("items finished per unit of time", "njësitë e mbaruara për njësi kohe", "fertige Einheiten je Zeiteinheit") },
          { h: x("Work item age", "Mosha e njësisë", "Alter der Einheit"), p: x("time since an open item started", "koha që nga fillimi i një njësie të hapur", "Zeit seit dem Start einer offenen Einheit") },
          { h: x("Cycle time", "Koha e ciklit", "Zykluszeit"), p: x("time from start to finish", "koha nga fillimi te mbarimi", "Zeit vom Start bis fertig") },
        ] },
        { type: "p", text: x(
          "The guide pairs them with a service level expectation, such as “85% of work items will be finished in eight days or less”. At BBC Worldwide the daily stand-up, about 15 minutes at the board, checked the cards, then blocked work, then clusters, then priorities.",
          "Udhëzuesi i shoqëron me një pritshmëri të nivelit të shërbimit, si “85% e njësive të punës do të mbarojnë për tetë ditë ose më pak”. Në BBC Worldwide, takimi ditor në këmbë, rreth 15 minuta para tabelës, kontrollonte kartat, pastaj punët e bllokuara, grumbujt, dhe në fund përparësitë.",
          "Der Guide ergänzt eine Service-Level-Erwartung, etwa „85 % der Einheiten sind in acht Tagen oder weniger fertig“. Bei BBC Worldwide prüfte das tägliche Stand-up, rund 15 Minuten am Board, erst die Karten, dann Blockaden, dann Häufungen, dann Prioritäten.") },
        { type: "example", label: x("Hypothetical example, a returns desk board on a Monday", "Shembull hipotetik, tabela e një sporteli kthimesh të hënën", "Hypothetisches Beispiel, Board einer Retourenstelle am Montag"), rows: [
          { k: x("Open", "Të hapura", "Offen"), v: x("14 cards against a limit of 12", "14 karta kundrejt kufirit 12", "14 Karten bei einer Grenze von 12") },
          { k: x("Oldest", "Më e vjetra", "Älteste"), v: x("11 days; 85% usually close within 6", "11 ditë; 85% mbyllen zakonisht brenda 6", "11 Tage; 85 % sind sonst in 6 fertig") },
        ], text: x("The average looks fine; the oldest card and the overrun show where to act. The numbers are invented.", "Mesatarja duket mirë; karta më e vjetër dhe tejkalimi tregojnë ku duhet vepruar. Numrat janë të shpikur.", "Der Mittelwert wirkt gut; die älteste Karte und die Überschreitung zeigen, wo zu handeln ist. Die Zahlen sind erfunden.") },
      ],
      note: x(
        "The four definitions and the example of an expectation are from the Kanban Guide; the stand-up from Middleton & Joyce. How the three averages relate is the subject of No. 58. The example is the editors'.",
        "Katër përkufizimet dhe shembulli i pritshmërisë vijnë nga Kanban Guide; takimi ditor nga Middleton & Joyce. Si lidhen tri mesataret është tema e Nr. 58. Shembulli është i redaksisë.",
        "Die vier Definitionen und das Beispiel einer Erwartung stammen aus dem Kanban Guide, das Stand-up von Middleton & Joyce. Wie die drei Mittelwerte zusammenhängen, zeigt Nr. 58. Das Beispiel stammt von der Redaktion."),
      source: ["kanban-guide-2025", "kanban-middleton-joyce-2012"],
    },
    {
      id: "tool", tool: "/tools/shift-handover/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("One board,", "Një tabelë,", "Ein Board"), x("with limits", "me kufij", "mit Grenzen")],
      lead: x(
        "One team, one flow of work. Count what is open today before you set any limit, start the limits near that count, and lower them only after a review.",
        "Një ekip, një rrjedhë pune. Numëro sa është e hapur sot para se të caktosh ndonjë kufi, nise kufirin afër këtij numri, dhe uleje vetëm pas një rishikimi.",
        "Ein Team, ein Arbeitsfluss. Erst zählen, was heute offen ist, bevor man Grenzen setzt, die Grenzen nahe dieser Zahl beginnen und erst nach einer Prüfung senken."),
      blocks: [
        { type: "form", items: [
          { h: x("Work item and flow", "Njësia e punës dhe rrjedha", "Arbeitseinheit und Fluss"), hint: x("what one card stands for; where work starts and finishes", "çfarë përfaqëson një kartë; ku nis dhe ku mbaron puna", "wofür eine Karte steht; wo Arbeit beginnt und endet") },
          { h: x("Columns and limits", "Kolonat dhe kufijtë", "Spalten und Grenzen"), hint: x("each stage, today's count, its limit", "çdo fazë, numri i sotëm, kufiri i saj", "jede Stufe, heutige Zahl, ihre Grenze"), lines: 2 },
          { h: x("Pull rule", "Rregulli i tërheqjes", "Pull-Regel"), hint: x("who starts new work, and only below the limit", "kush nis punë të re, dhe vetëm nën kufi", "wer neue Arbeit beginnt, und nur unter der Grenze") },
          { h: x("Exceptions", "Përjashtimet", "Ausnahmen"), hint: x("what may jump the queue, and who decides", "çfarë mund ta kapërcejë radhën, dhe kush vendos", "was die Schlange überspringen darf, und wer entscheidet") },
          { h: x("Blocked items", "Njësitë e bllokuara", "Blockierte Einheiten"), hint: x("marked on the card; who removes the block, by when", "të shënuara në kartë; kush e heq bllokimin, deri kur", "auf der Karte markiert; wer die Blockade löst, bis wann") },
          { h: x("Weekly review", "Rishikimi javor", "Wöchentliche Prüfung"), hint: x("oldest card, finished items, is each limit still right", "karta më e vjetër, njësitë e mbaruara, a është ende i drejtë çdo kufi", "älteste Karte, fertige Einheiten, passt jede Grenze noch") },
        ] },
      ],
      note: x(
        "A practice proposed by the editors, after the Kanban Guide, Hopp & Spearman and the BBC Worldwide team, which set its limits from its constraints and changed them as they moved.",
        "Praktikë e propozuar nga redaksia, sipas Kanban Guide, Hopp-it dhe Spearman-it dhe ekipit të BBC Worldwide, që i caktoi kufijtë sipas pikave të ngushta dhe i ndryshoi kur ato lëvizën.",
        "Eine Praxis, die die Redaktion vorschlägt, nach dem Kanban Guide, Hopp & Spearman und dem Team von BBC Worldwide, das seine Grenzen aus den Engpässen ableitete und mit ihnen änderte."),
      source: ["kanban-guide-2025", "kanban-hopp-spearman-2004", "kanban-middleton-joyce-2012"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
