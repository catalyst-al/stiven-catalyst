// Management Review, No. 66: Kanban and the work-in-process limit. Block: Operations.
// Facts and their sources: docs/revista/management-review-nr-66.md.
import { x, pc } from "../common.js";

export default {
  number: 66,
  block: "operations",
  date: x("October 2026", "Tetor 2026", "Oktober 2026"),
  // Corrections made after publication, shown on the issue's page and its sources page.
  corrections: [
    {
      date: x("16 October 2026", "16 tetor 2026", "16. Oktober 2026"),
      t: x(
        "The 24% fall in Middleton and Joyce's study is in defects still open and reported each week; the text first said defects reported by customers, which the study does not say.",
        "Rënia me 24% te studimi i Middleton-it dhe Joyce-it është te defektet ende të hapura dhe të raportuara çdo javë; teksti fillimisht thoshte defekte të raportuara nga klientët, gjë që studimi nuk e thotë.",
        "Der Rückgang um 24 % in der Studie von Middleton und Joyce betrifft die noch offenen, wöchentlich gemeldeten Fehler; zuerst hieß es: von Kunden gemeldete Fehler, was die Studie nicht sagt."),
    },
  ],
  theme: [x("Kanban:", "Kanban:", "Kanban:"), x("the limit on work in process", "kufiri i punës në proces", "die Grenze für laufende Arbeit")],
  sub: x(
    "Toyota's supermarket method of 1954, a BBC Worldwide team that capped its boards, pull as a limit on open work, judges in Rome who kept fewer cases going, four flow measures and a card for one board.",
    "Metoda e supermarketit e Toyota-s nga viti 1954, një ekip i BBC Worldwide që u vuri kufij tabelave, tërheqja si kufi i punës së hapur, gjyqtarët në Romë që mbanin më pak çështje njëherësh, katër matje të rrjedhës dhe një kartë për një tabelë.",
    "Toyotas Supermarkt-Methode von 1954, ein Team von BBC Worldwide mit begrenzten Kanban-Tafeln, Pull als Obergrenze für offene Arbeit, Richter in Rom mit weniger parallelen Fällen, vier Flow-Kennzahlen und eine Karte für eine Tafel."),
  seo: x(
    "Kanban and WIP limits: Toyota's supermarket method, a BBC Worldwide case, pull as a cap on open work, a field study of judges, flow measures and a card.",
    "Kanban dhe kufiri i punës në proces: metoda e supermarketit e Toyota-s, rasti i BBC Worldwide, tërheqja, gjyqtarët në Romë, matjet e rrjedhës, një kartë.",
    "Kanban und WIP-Limits: Toyotas Supermarkt-Methode, ein Fall bei BBC Worldwide, Pull als Obergrenze, eine Feldstudie mit Richtern, Flow-Kennzahlen."),
  feature: x(
    "In 1954 Toyota set out to end the month-end rush with what it called the supermarket method. Half a century later a nine-person software team at BBC Worldwide put limits on its kanban boards, and two operations researchers describe pull as, in essence, a cap on work in process. Issue 66 also follows six judges in Rome who juggled fewer cases and finished them sooner, explains the four flow measures of the Kanban Guide and closes with a card for one board with limits.",
    "Më 1954 Toyota deshi t'i jepte fund vrapit të fundmuajit me atë që e quajti metoda e supermarketit. Gjysmë shekulli më vonë, një ekip softueri prej nëntë vetash në BBC Worldwide u vuri kufij tabelave kanban, ndërsa dy studiues të kërkimit operacional e përshkruajnë tërheqjen, në thelb, si tavan për punën në proces. Numri 66 ndjek edhe gjashtë gjyqtarë në Romë që mbanin më pak çështje njëherësh dhe i mbyllnin më shpejt, shpjegon katër matjet e rrjedhës të Kanban Guide dhe mbyllet me një kartë për një tabelë me kufij.",
    "1954 wollte Toyota mit der sogenannten Supermarkt-Methode den Endspurt am Monatsende beenden. Ein halbes Jahrhundert später begrenzte ein neunköpfiges Softwareteam bei BBC Worldwide seine Kanban-Tafeln, und zwei Forscher aus dem Operations Research beschreiben Pull im Kern als Obergrenze für laufende Arbeit. Ausgabe 66 begleitet außerdem sechs Richter in Rom, die weniger Fälle parallel führten und schneller abschlossen, erklärt die vier Flow-Kennzahlen des Kanban Guide und schließt mit einer Karte für eine Tafel mit Grenzen."),
  figure: { n: pc(37), by: "Middleton & Joyce, 2012", t: x(
    "shorter average lead time in 12 months for a nine-person software team at BBC Worldwide that worked with kanban boards and limits on work in process.",
    "më e shkurtër u bë koha mesatare e plotë e kalimit (lead time) brenda 12 muajve në një ekip softueri prej nëntë vetash në BBC Worldwide që punonte me tabela kanban dhe me kufij për punën në proces.",
    "kürzere mittlere Durchlaufzeit binnen 12 Monaten bei einem neunköpfigen Softwareteam von BBC Worldwide, das mit Kanban-Tafeln und WIP-Limits arbeitete.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("The next process is the customer", "Procesi pasardhës është klienti", "Der nächste Prozess ist der Kunde") },
    { page: "research", kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: x("Fewer cases at once", "Më pak çështje njëherësh", "Weniger Fälle zugleich") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("One board, with limits", "Një tabelë, me kufij", "Eine Tafel mit Grenzen") },
  ],
  sources: ["kanban-toyota-1954", "kanban-middleton-joyce-2012", "kanban-hopp-spearman-2004", "kanban-anderson-2014", "kanban-coviello-2015", "kanban-bray-2016", "kanban-guide-2025"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "A board full of cards looks like a busy team. Often it belongs to a team that has started more than it can finish. Kanban answers with a limit on work in process: how many things may be open at once, and what happens when that number is reached.",
        "Një tabelë plot me karta të jep përshtypjen e një ekipi të zënë. Shpesh është ekipi që ka nisur më shumë nga sa mund të mbarojë. Kanban-i i përgjigjet me një kufi për punën në proces: sa gjëra mund të jenë të hapura njëherësh, dhe çfarë ndodh kur ky numër arrihet.",
        "Eine Tafel voller Karten wirkt wie ein fleißiges Team. Oft gehört sie einem Team, das mehr begonnen hat, als es beenden kann. Kanban antwortet darauf mit einer Grenze für laufende Arbeit: wie viel gleichzeitig offen sein darf und was geschieht, wenn diese Zahl erreicht ist."),
      body: x(
        "In 1954 Toyota had each process collect its parts from the one before, instead of having them pushed on. Half a century later, a team at BBC Worldwide put limits on its boards and delivered sooner and more evenly. Two operations researchers argue that pull is, in essence, a cap on work in process. In Rome, six judges who kept fewer cases open at once finished them sooner. The Kanban Guide names four measures; a card helps set up one board.",
        "Më 1954 Toyota vendosi që çdo proces t'i merrte vetë pjesët te procesi paraardhës, në vend që t'ia shtynin përpara. Gjysmë shekulli më vonë, një ekip në BBC Worldwide u vuri kufij tabelave dhe dorëzoi më shpejt e më rregullisht. Dy studiues të kërkimit operacional thonë se tërheqja, në thelb, është një tavan për punën në proces. Në Romë, gjashtë gjyqtarë që mbanin më pak çështje të hapura njëherësh i mbyllën më shpejt. Kanban Guide përcakton katër matje; një kartë të ndihmon të ngresh një tabelë.",
        "1954 ließ Toyota jeden Prozess seine Teile beim vorigen abholen, statt sie ihm zuzuschieben. Ein halbes Jahrhundert später begrenzte ein Team bei BBC Worldwide seine Tafeln und lieferte schneller und gleichmäßiger. Zwei Forscher aus dem Operations Research sehen in Pull im Kern eine Obergrenze für laufende Arbeit. In Rom schlossen sechs Richter, die weniger Fälle zugleich offen hielten, diese schneller ab. Der Kanban Guide nennt vier Kennzahlen; eine Karte hilft Ihnen, eine Tafel aufzubauen."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("The next process", "Procesi pasardhës", "Der nächste Prozess"), x("is the customer", "është klienti", "ist der Kunde")],
      lead: x(
        "According to Toyota's own history, every part in its machining plant once travelled with a voucher and was carried on to the next plant whether that plant needed it or not. Parts piled up, and assembly built whatever it had parts for.",
        "Sipas historisë së vetë Toyota-s, dikur çdo pjesë në repartin e përpunimit shoqërohej nga një fletë dhe çohej te reparti tjetër, pavarësisht nëse ai kishte nevojë për të apo jo. Pjesët grumbulloheshin, dhe montimi prodhonte atë për të cilën i kishte pjesët.",
        "Laut Toyotas eigener Firmengeschichte begleitete früher ein Laufzettel jedes Teil der mechanischen Fertigung, und das Teil wurde ins nächste Werk gebracht, ob man es dort brauchte oder nicht. Teile stapelten sich, und die Montage baute, wofür gerade Teile da waren."),
      blocks: [
        { type: "p", text: x(
          "Early in the month, assembly reached roughly half the plan. At the end of the month, once all the parts were in, the conveyors ran faster to catch up, staffed by the same people who had stood waiting for parts at the start. In 1954, as volumes grew, Toyota introduced what it called the supermarket method.",
          "Në fillim të muajit, montimi arrinte afërsisht gjysmën e planit. Në fund të muajit, kur kishin mbërritur të gjitha pjesët, shiritat transportues shpejtoheshin për ta arritur planin, me të njëjtët njerëz që në fillim kishin qëndruar duke pritur pjesët. Më 1954, ndërsa vëllimet rriteshin, Toyota futi atë që e quajti metoda e supermarketit.",
          "Zu Monatsbeginn schaffte die Montage etwa die Hälfte des Plans. Am Monatsende, wenn alle Teile da waren, liefen die Bänder schneller, um aufzuholen, und zwar mit denselben Leuten, die anfangs auf Teile gewartet hatten. 1954, als die Stückzahlen wuchsen, führte Toyota die sogenannte Supermarkt-Methode ein.") },
        { type: "quote", text: x(
          "The subsequent process is the 'customer' and the prior process is the 'supermarket'.",
          "Procesi pasardhës është 'klienti' dhe procesi paraardhës është 'supermarketi'.",
          "Der nachfolgende Prozess ist der ‚Kunde‘, der vorherige Prozess der ‚Supermarkt‘.") },
        { type: "cards", cols: 3, items: [
          { h: x("Supermarket", "Supermarketi", "Supermarkt"), p: x("the earlier process: it holds parts and replaces only what was taken", "procesi paraardhës: mban pjesë gati dhe rimbush vetëm atë që u mor", "der vorige Prozess: hält Teile bereit und füllt nur nach, was entnommen wurde") },
          { h: x("Customer", "Klienti", "Kunde"), p: x("the later process: it takes what it needs, when it needs it", "procesi pasardhës: merr atë që i duhet, kur i duhet", "der nächste Prozess: holt, was er braucht, wenn er es braucht") },
          { h: x("Kanban", "Kanban", "Kanban"), p: x("the card added later: product name, number and quantity", "karta e shtuar më vonë: emri i produktit, numri dhe sasia", "die später ergänzte Karte: Name, Nummer und Menge des Produkts") },
        ] },
        { type: "callout", reading: true, text: x(
          "Push moves work on once it is finished. Pull starts work once there is room for it.",
          "Shtytja e çon punën më tej sapo ajo mbaron. Tërheqja e nis punën sapo ka vend për të.",
          "Push schiebt Arbeit weiter, sobald sie fertig ist. Pull beginnt Arbeit, sobald Platz für sie da ist.") },
      ],
      note: x(
        "Toyota's history traces the idea to a 1954 trade-press report on a Lockheed aircraft plant, at a time when supermarkets were still rare in Japan. Other accounts credit Taiichi Ohno's look at US supermarkets; we could not check his book, so we follow Toyota.",
        "Sipas historisë së Toyota-s, ideja erdhi nga një reportazh i shtypit të industrisë më 1954 për një fabrikë avionësh të Lockheed-it, kur supermarketet ishin ende të rralla në Japoni. Rrëfime të tjera ia atribuojnë vëzhgimit që Taiichi Ohno u bëri supermarketeve amerikane; librin e tij nuk mundëm ta shohim, ndaj ndjekim Toyota-n.",
        "Toyotas Firmengeschichte führt die Idee auf einen Fachpressebericht von 1954 über ein Flugzeugwerk von Lockheed zurück, als Supermärkte in Japan noch selten waren. Andere Darstellungen nennen Taiichi Ohnos Blick auf US-Supermärkte; sein Buch konnten wir nicht prüfen, daher folgen wir Toyota."),
      source: ["kanban-toyota-1954"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("Limits on", "Kufij në", "Grenzen an"), x("the board", "tabelë", "der Tafel")],
      lead: x(
        "In April 2008 a nine-person software team at BBC Worldwide drew its stages on kanban boards and put each piece of work on a card. More work was in process than anyone had realised. Peter Middleton and David Joyce studied a year of the team's data.",
        "Në prill 2008, një ekip softueri prej nëntë vetash në BBC Worldwide i vizatoi fazat e punës në tabela kanban dhe çdo punë e vuri në një kartë. Doli se në proces kishte më shumë punë nga sa e kishte kuptuar kushdo. Peter Middleton dhe David Joyce studiuan të dhënat e një viti.",
        "Im April 2008 zeichnete ein neunköpfiges Softwareteam bei BBC Worldwide seine Arbeitsschritte auf Kanban-Tafeln und setzte jede Aufgabe auf eine Karte. Es lief mehr Arbeit, als irgendjemandem bewusst gewesen war. Peter Middleton und David Joyce werteten die Daten eines Jahres aus."),
      blocks: [
        { type: "dumbbell", from: x("Before", "Para", "Vorher"), to: x("After", "Pas", "Nachher"), min: 0, max: 75, rowH: 26, source: ["kanban-middleton-joyce-2012"],
          label: x("Working days, one BBC Worldwide team, 2008–2009", "Ditë pune, një ekip i BBC Worldwide, 2008–2009", "Arbeitstage, ein Team von BBC Worldwide, 2008–2009"),
          rows: [
            { k: x("Lead time, mean", "Koha e plotë e kalimit", "Durchlaufzeit"), a: 22.8, an: x("22.8", "22,8", "22,8"), b: 14.4, bn: x("14.4", "14,4", "14,4") },
            { k: x("Its upper limit", "Kufiri i sipërm", "Ihre Obergrenze"), a: 70.7, an: x("70.7", "70,7", "70,7"), b: 37.3, bn: x("37.3", "37,3", "37,3"), alert: true },
            { k: x("Development time", "Koha e zhvillimit", "Entwicklungszeit"), a: 9.2, an: x("9.2", "9,2", "9,2"), b: 2.5, bn: x("2.5", "2,5", "2,5") },
            { k: x("Blocked, per month", "Të bllokuara në muaj", "Blockiert je Monat"), a: 25.8, an: x("25.8", "25,8", "25,8"), b: 4.9, bn: x("4.9", "4,9", "4,9") },
          ] },
        { type: "p", text: x(
          "The limits followed the constraints. With fewer testers and analysts than developers, the team set them by what those roles could handle and moved them when the constraints moved. Defects still open and reported each week fell by 24%.",
          "Kufijtë ndoqën pikat e ngushta. Meqë kishte më pak testues dhe analistë se programues, ekipi i caktoi kufijtë sipas asaj që përballonin këta, dhe i zhvendosi kur u zhvendosën pikat e ngushta. Defektet ende të hapura dhe të raportuara çdo javë ranë me 24%.",
          "Die Grenzen folgten den Engpässen. Weil es weniger Tester und Analysten als Entwickler gab, richtete das Team sie nach deren Kapazität aus und verschob sie, sobald sich die Engpässe verschoben. Die noch offenen, wöchentlich gemeldeten Fehler gingen um 24 % zurück.") },
        { type: "callout", reading: true, text: x(
          "The limit did not make anyone work faster. It made the queue visible, at the stage where it formed.",
          "Kufiri nuk e bëri askënd të punonte më shpejt. E bëri të dukshme radhën, pikërisht te faza ku ajo formohej.",
          "Die Grenze brachte niemanden dazu, schneller zu arbeiten. Sie machte die Warteschlange sichtbar, genau dort, wo sie entstand.") },
      ],
      note: x(
        "Upper limit: the upper control limit of lead time, a measure of spread (−47%). Development time covers nine months. A single case: the team also broke its work into smaller pieces and grew in skill.",
        "Kufiri i sipërm: kufiri i sipërm i kontrollit për kohën e plotë të kalimit, një masë e shpërndarjes (−47%). Koha e zhvillimit mbulon nëntë muaj. Është një rast i vetëm: ekipi i ndau edhe punët në copa më të vogla dhe u rrit në aftësi.",
        "Obergrenze: die obere Eingriffsgrenze der Durchlaufzeit, ein Maß für die Streuung (−47 %). Die Entwicklungszeit umfasst neun Monate. Ein Einzelfall: Das Team zerlegte seine Arbeit zudem in kleinere Stücke und gewann an Können."),
      source: ["kanban-middleton-joyce-2012"],
    },
    {
      id: "model",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Pull is", "Tërheqja është", "Pull ist"), x("a limit", "një kufi", "eine Grenze")],
      lead: x(
        "Wallace Hopp and Mark Spearman argued in 2004 that the practitioner literature had simplified “pull” to the point of misunderstanding. Their definition is short: pull is essentially a mechanism for limiting work in process. A kanban card is one such mechanism: no free card, no new start.",
        "Wallace Hopp dhe Mark Spearman shkruan më 2004 se literatura e praktikës e kishte thjeshtuar “tërheqjen” deri në keqkuptim. Përkufizimi i tyre është i shkurtër: tërheqja në thelb është një mekanizëm që kufizon punën në proces. Karta kanban është një mekanizëm i tillë: pa kartë të lirë, nuk nis punë e re.",
        "Wallace Hopp und Mark Spearman schrieben 2004, die Praxisliteratur habe „Pull“ bis zum Missverständnis vereinfacht. Ihre Definition ist knapp: Pull ist im Kern ein Mechanismus, der laufende Arbeit begrenzt. Eine Kanban-Karte ist ein solcher Mechanismus: Ohne freie Karte beginnt keine neue Arbeit."),
      blocks: [
        { type: "chain", label: x("A workflow with a limit, after the Kanban Guide", "Një rrjedhë pune me kufi, sipas Kanban Guide", "Ein Arbeitsfluss mit Grenze, nach dem Kanban Guide"), items: [
          { h: x("Work item", "Njësia e punës", "Arbeitseinheit"), p: x("what one card stands for", "çfarë përfaqëson një kartë", "wofür eine Karte steht") },
          { h: x("Started", "Fillimi", "Start"), p: x("the point where it counts as open", "pika ku quhet e hapur", "ab wann sie als offen gilt") },
          { h: x("States, with a limit", "Fazat, me kufi", "Stufen mit Grenze"), p: x("new work only below the limit", "punë e re vetëm nën kufi", "neue Arbeit nur unter der Grenze") },
          { h: x("Finished", "Mbarimi", "Fertig"), p: x("the point where it leaves", "pika ku del", "ab wann sie hinausgeht") },
        ] },
        { type: "p", text: x(
          "David Anderson dates kanban in knowledge work to 2004, when he designed a pull system for a maintenance team at Microsoft. It had no physical board. In his account, the cards went up on a whiteboard at Corbis in 2007, at a team member's suggestion. His book Kanban followed in 2010.",
          "David Anderson e nis kanban-in në punën me dije më 2004, kur projektoi një sistem tërheqës për një ekip mirëmbajtjeje në Microsoft. Tabelë fizike nuk kishte. Sipas rrëfimit të tij, kartat u varën në një tabelë të bardhë te Corbis më 2007, me propozimin e një anëtari të ekipit. Libri i tij Kanban doli më 2010.",
          "David Anderson datiert Kanban in der Wissensarbeit auf 2004, als er bei Microsoft ein Pull-System für ein Wartungsteam entwarf. Eine physische Tafel gab es nicht. Nach seiner Darstellung hingen die Karten 2007 bei Corbis an einem Whiteboard, auf Vorschlag eines Teammitglieds. Sein Buch Kanban erschien 2010.") },
        { type: "callout", reading: true, text: x(
          "A board without limits only pictures the overload. Add a limit, and it becomes a pull system.",
          "Një tabelë pa kufij thjesht pasqyron mbingarkesën. Vëri një kufi, dhe ajo bëhet sistem tërheqës.",
          "Eine Tafel ohne Grenzen bildet nur die Überlastung ab. Erst mit einer Grenze wird daraus ein Pull-System.") },
      ],
      note: x(
        "The definition is Hopp & Spearman's; the chain follows the elements of a workflow in the Kanban Guide (2025). The history is Anderson's own account. The editors drew the conclusions.",
        "Përkufizimi është i Hopp-it dhe Spearman-it; zinxhiri ndjek elementet e rrjedhës së punës te Kanban Guide (2025). Historia është rrëfimi i vetë Anderson-it. Përfundimet janë të redaksisë.",
        "Die Definition stammt von Hopp & Spearman; die Kette folgt den Elementen eines Arbeitsflusses im Kanban Guide (2025). Die Geschichte ist Andersons eigene Darstellung. Die Schlüsse zieht die Redaktion."),
      source: ["kanban-hopp-spearman-2004", "kanban-guide-2025", "kanban-anderson-2014"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("Fewer cases", "Më pak çështje", "Weniger Fälle"), x("at once", "njëherësh", "zugleich")],
      lead: x(
        "Decio Coviello, Andrea Ichino and Nicola Persico studied Italian judges who received the same workload by lottery. Those who juggled more trials at once, instead of working through a few in sequence, took longer to complete their cases. The quality of rulings, measured by appeals, did not suffer.",
        "Decio Coviello, Andrea Ichino dhe Nicola Persico studiuan gjyqtarë italianë që e merrnin të njëjtën ngarkesë me short. Ata që mbanin më shumë gjykime njëherësh, në vend që të merreshin me pak prej tyre njëri pas tjetrit, i mbyllnin çështjet më vonë. Cilësia e vendimeve, e matur me apelimet, nuk u dëmtua.",
        "Decio Coviello, Andrea Ichino und Nicola Persico untersuchten italienische Richter, denen das Los dieselbe Arbeitslast zuteilte. Wer mehr Verfahren gleichzeitig jonglierte, statt wenige nacheinander abzuarbeiten, brauchte länger für seine Fälle. Die Qualität der Urteile, gemessen an Berufungen, litt darunter nicht."),
      blocks: [
        { type: "p", text: x(
          "Then came a test at Rome's labour appeals court. From January 2011, six judges in one section scheduled up front every hearing a new case would need, so that cases finished before new ones crowded in. 44 judges in four other sections carried on as before. The data run from 2005 to 2014.",
          "Pastaj erdhi një provë në gjykatën e apelit për çështjet e punës në Romë. Nga janari 2011, gjashtë gjyqtarë të një seksioni i caktuan që në fillim të gjitha seancat që do t'i duheshin një çështjeje të re, në mënyrë që çështjet të mbaronin para se të grumbulloheshin të rejat. 44 gjyqtarë në katër seksione të tjera vazhduan si më parë. Të dhënat shtrihen nga 2005 deri më 2014.",
          "Dann folgte ein Versuch am Berufungsgericht für Arbeitssachen in Rom. Ab Januar 2011 legten sechs Richter einer Kammer alle Anhörungen, die ein neuer Fall brauchen würde, gleich zu Beginn fest, damit Fälle abgeschlossen waren, bevor sich neue stauten. 44 Richter in vier anderen Kammern arbeiteten weiter wie bisher. Die Daten reichen von 2005 bis 2014.") },
        { type: "figures", compact: true, items: [
          { n: pc(12), t: x("shorter average case duration, against the other judges", "më e shkurtër kohëzgjatja mesatare e çështjeve, krahasuar me gjyqtarët e tjerë", "kürzere mittlere Falldauer, verglichen mit den übrigen Richtern") },
          { n: x("111 days", "111 ditë", "111 Tage"), t: x("less per case, by the authors' estimate", "më pak për çështje, sipas vlerësimit të autorëve", "weniger je Fall, nach Schätzung der Autoren") },
        ] },
        { type: "callout", reading: true, text: x(
          "The judges started less at once and finished what they had started; the effort stayed the same.",
          "Gjyqtarët nisën më pak gjëra njëherësh dhe mbaruan atë që kishin nisur; mundi mbeti i njëjti.",
          "Die Richter begannen weniger zugleich und brachten zu Ende, was sie begonnen hatten; der Aufwand blieb derselbe.") },
      ],
      note: x(
        "Not a random assignment: the section's president asked to take part. A difference-in-differences study with six treated judges, supported by a placebo test. Their rulings were also appealed less often. Not every study finds lower WIP better on every measure (see No. 58).",
        "Gjyqtarët nuk u caktuan rastësisht: kryetarja e seksionit kërkoi vetë të merrte pjesë. Studim me diferencë në diferenca, me gjashtë gjyqtarë të trajtuar, i mbështetur nga një test placebo. Vendimet e tyre u apeluan edhe më rrallë. Jo të gjitha studimet gjejnë se më pak punë në proces është më mirë në çdo matje (shih Nr. 58).",
        "Keine Zufallszuteilung: Die Vorsitzende der Kammer wollte selbst teilnehmen. Eine Differenz-von-Differenzen-Studie mit sechs behandelten Richtern, gestützt durch einen Placebotest. Ihre Urteile wurden zudem seltener angefochten. Nicht jede Studie findet weniger WIP bei jeder Kennzahl besser (siehe Nr. 58)."),
      source: ["kanban-coviello-2015", "kanban-bray-2016"],
    },
    {
      id: "measure", more: "ten-minutes-before-the-shift",
      kicker: x("How it is measured", "Si matet", "Wie es gemessen wird"),
      title: [x("Four measures,", "Katër matje,", "Vier Kennzahlen,"), x("and the oldest card", "dhe karta më e vjetër", "und die älteste Karte")],
      lead: x(
        "The Kanban Guide by John Coleman and Daniel Vacanti asks every kanban system to track four flow measures, each counted between the points where the team says work starts and finishes.",
        "Kanban Guide i John Coleman-it dhe Daniel Vacanti-t i kërkon çdo sistemi kanban të ndjekë katër matje të rrjedhës, secila e numëruar mes pikave ku, sipas ekipit, puna nis dhe mbaron.",
        "Der Kanban Guide von John Coleman und Daniel Vacanti verlangt von jedem Kanban-System vier Flow-Kennzahlen, jeweils gezählt zwischen den Punkten, an denen die Arbeit nach Festlegung des Teams beginnt und endet."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("Work in process", "Puna në proces", "Laufende Arbeit"), p: x("items started but not finished", "njësitë e nisura por të pambaruara", "begonnene, nicht fertige Einheiten") },
          { h: x("Throughput", "Sasia e përfunduar", "Durchsatz"), p: x("items finished per unit of time", "njësitë e mbaruara për njësi kohe", "fertige Einheiten je Zeiteinheit") },
          { h: x("Work item age", "Mosha e njësisë", "Alter der Einheit"), p: x("time since an open item started", "koha që nga fillimi i një njësie të hapur", "Zeit seit dem Start einer offenen Einheit") },
          { h: x("Cycle time", "Koha e ciklit", "Zykluszeit"), p: x("time from start to finish", "koha nga fillimi te mbarimi", "Zeit vom Start bis zum Abschluss") },
        ] },
        { type: "p", text: x(
          "The guide pairs them with a service level expectation, such as “85% of work items will be finished in eight days or less”. At BBC Worldwide the daily stand-up took about 15 minutes at the board: first the cards, then blocked work, then clusters, then priorities.",
          "Udhëzuesi i shoqëron me një pritshmëri të nivelit të shërbimit, si “85% e njësive të punës do të mbarojnë për tetë ditë ose më pak”. Në BBC Worldwide, takimi i shkurtër ditor zgjaste rreth 15 minuta para tabelës: në fillim kartat, pastaj punët e bllokuara, pastaj grumbujt, në fund përparësitë.",
          "Der Guide ergänzt sie um eine Service-Level-Erwartung, etwa „85 % der Einheiten sind in acht Tagen oder weniger fertig“. Bei BBC Worldwide dauerte das tägliche Stand-up an der Tafel rund 15 Minuten: zuerst die Karten, dann Blockaden, dann Häufungen, zuletzt die Prioritäten.") },
        { type: "example", label: x("Hypothetical example, a returns desk board on a Monday", "Shembull hipotetik, tabela e një sporteli kthimesh të hënën", "Hypothetisches Beispiel: Tafel einer Retourenstelle an einem Montag"), rows: [
          { k: x("Open", "Të hapura", "Offen"), v: x("14 cards against a limit of 12", "14 karta kundrejt kufirit 12", "14 Karten bei einer Grenze von 12") },
          { k: x("Oldest", "Më e vjetra", "Älteste"), v: x("11 days; 85% usually close within 6", "11 ditë; 85% mbyllen zakonisht brenda 6", "11 Tage; 85 % sind sonst in 6 fertig") },
        ], text: x("The average looks fine; the oldest card and the overrun show where to act. The board is invented, figures included.", "Mesatarja duket në rregull; karta më e vjetër dhe tejkalimi tregojnë ku duhet vepruar. Tabela është e sajuar, bashkë me shifrat.", "Der Mittelwert wirkt unauffällig; die älteste Karte und die Überschreitung zeigen, wo Sie eingreifen sollten. Die Tafel ist erfunden, samt Zahlen.") },
      ],
      note: x(
        "The four definitions and the sample expectation come from the Kanban Guide, the stand-up from Middleton & Joyce. How the three averages relate is the subject of No. 58. The example is the editors'.",
        "Katër përkufizimet dhe shembulli i pritshmërisë vijnë nga Kanban Guide; takimi i shkurtër ditor nga Middleton & Joyce. Si lidhen tri mesataret me njëra-tjetrën shpjegohet te Nr. 58. Shembulli është i redaksisë.",
        "Die vier Definitionen und das Beispiel einer Erwartung stammen aus dem Kanban Guide, das Stand-up von Middleton & Joyce. Wie die drei Mittelwerte zusammenhängen, zeigt Nr. 58. Das Beispiel stammt von der Redaktion."),
      source: ["kanban-guide-2025", "kanban-middleton-joyce-2012"],
    },
    {
      id: "tool", tool: "/tools/shift-handover/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("One board,", "Një tabelë,", "Eine Tafel"), x("with limits", "me kufij", "mit Grenzen")],
      lead: x(
        "One team, one flow of work. Before you set any limit, count what is open today; start the limits near that count, and lower them only after a review.",
        "Një ekip, një rrjedhë pune. Para se të caktosh ndonjë kufi, numëro sa punë janë të hapura sot; nise kufirin afër këtij numri dhe uleje vetëm pas një rishikimi.",
        "Ein Team, ein Arbeitsfluss. Bevor Sie Grenzen setzen, zählen Sie, was heute offen ist; setzen Sie die Grenzen nahe dieser Zahl an und senken Sie sie erst nach einer Überprüfung."),
      blocks: [
        { type: "form", items: [
          { h: x("Work item and flow", "Njësia e punës dhe rrjedha", "Arbeitseinheit und Fluss"), hint: x("what one card stands for; where work starts and finishes", "çfarë përfaqëson një kartë; ku nis dhe ku mbaron puna", "wofür eine Karte steht; wo Arbeit beginnt und endet") },
          { h: x("Columns and limits", "Kolonat dhe kufijtë", "Spalten und Grenzen"), hint: x("each stage, today's count, its limit", "çdo fazë, numri i sotëm, kufiri i saj", "jede Stufe, heutige Zahl, ihre Grenze"), lines: 2 },
          { h: x("Pull rule", "Rregulli i tërheqjes", "Pull-Regel"), hint: x("who starts new work, and only below the limit", "kush nis punë të re, dhe vetëm nën kufi", "wer neue Arbeit beginnt, und nur unter der Grenze") },
          { h: x("Exceptions", "Përjashtimet", "Ausnahmen"), hint: x("what may jump the queue, and who decides", "çfarë mund ta kapërcejë radhën, dhe kush vendos", "was die Warteschlange überspringen darf und wer entscheidet") },
          { h: x("Blocked items", "Njësitë e bllokuara", "Blockierte Einheiten"), hint: x("marked on the card; who removes the block, by when", "të shënuara në kartë; kush e heq bllokimin, deri kur", "auf der Karte markiert; wer die Blockade löst, bis wann") },
          { h: x("Weekly review", "Rishikimi javor", "Wöchentliche Überprüfung"), hint: x("oldest card, finished items, is each limit still right", "karta më e vjetër, njësitë e mbaruara, a është ende i drejtë çdo kufi", "älteste Karte, fertige Einheiten, passt jede Grenze noch") },
        ] },
      ],
      note: x(
        "Suggested by the editors, drawing on the Kanban Guide, Hopp & Spearman and the BBC Worldwide team, which set its limits from its constraints and changed them as the constraints moved.",
        "Sugjerim i redaksisë, që nis nga Kanban Guide, nga Hopp-i dhe Spearman-i dhe nga ekipi i BBC Worldwide, që i caktoi kufijtë sipas pikave të ngushta dhe i ndryshoi kur ato lëvizën.",
        "Von der Redaktion angeregt, gestützt auf den Kanban Guide, Hopp & Spearman und das Team von BBC Worldwide, das seine Grenzen aus den Engpässen ableitete und sie anpasste, wenn diese sich verschoben."),
      source: ["kanban-guide-2025", "kanban-hopp-spearman-2004", "kanban-middleton-joyce-2012"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
