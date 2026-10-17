// Management Review, No. 56: Value stream mapping: where the time goes. Block: Operations.
// Facts and their sources: docs/revista/management-review-nr-56.md.
import { x } from "../common.js";

export default {
  number: 56,
  block: "operations",
  date: x("November 2026", "Nëntor 2026", "November 2026"),
  theme: [x("Value stream mapping:", "Harta e rrjedhës së vlerës:", "Wertstromanalyse:"), x("where the time goes", "ku shkon koha", "wohin die Zeit geht")],
  sub: x(
    "Toyota's flow diagrams, a day of waiting in an oncology day hospital, current and future state, maps that stop halfway, three numbers and a ratio, and a card for your first map.",
    "Diagramet e rrjedhës te Toyota, një ditë pritjeje në një spital ditor onkologjik, gjendja e sotme dhe e ardhshme, harta që ndalen në gjysmë të rrugës, tri numra dhe një raport, dhe një kartë për hartën tënde të parë.",
    "Toyotas Flussdiagramme, ein Tag des Wartens in einer onkologischen Tagesklinik, Ist- und Soll-Zustand, Karten, die auf halbem Weg enden, drei Zahlen und ein Verhältnis sowie eine Karte für Ihre erste Wertstromkarte."),
  seo: x(
    "Value stream mapping: Rother and Shook's method, a day of waiting in an oncology day hospital, current and future state, three numbers, a card.",
    "Harta e rrjedhës së vlerës: metoda e Rother-it dhe Shook-ut, pritja në një spital ditor onkologjik, gjendja e sotme dhe e ardhshme, tri numra, një kartë.",
    "Wertstromanalyse: die Methode von Rother und Shook, Warten in einer onkologischen Tagesklinik, Ist- und Soll-Zustand, drei Zahlen, eine Karte."),
  feature: x(
    "Mike Rother and John Shook turned a Toyota diagram into value stream mapping; Issue 56 starts there. It follows a patient's day in a Spanish oncology day hospital, where the work took minutes and the waiting took hours, and walks through the steps from current to future state. It then asks why so many published maps stop at the current state, measures a flow with Karen Martin and Mike Osterling's three numbers and a ratio, and closes with a card for a first map on paper.",
    "Mike Rother dhe John Shook e kthyen një diagram të Toyota-s në hartën e rrjedhës së vlerës; Numri 56 nis që aty. Ndjek ditën e një pacienti në një spital ditor onkologjik në Spanjë, ku puna zgjati minuta dhe pritja orë, dhe kalon nëpër hapat nga gjendja e sotme te e ardhshmja. Pastaj pyet pse kaq shumë harta të botuara ndalen te gjendja e sotme, e mat një rrjedhë me tri numrat dhe raportin e Karen Martin-it dhe Mike Osterling-ut, dhe mbyllet me një kartë për hartën e parë në letër.",
    "Mike Rother und John Shook machten aus einem Toyota-Diagramm die Wertstromanalyse; dort setzt Ausgabe 56 an. Sie begleitet einen Patienten durch seinen Tag in einer spanischen onkologischen Tagesklinik, in der die Arbeit Minuten und das Warten Stunden dauerte, und geht die Schritte vom Ist- zum Soll-Zustand durch. Danach fragt sie, warum so viele veröffentlichte Karten beim Ist-Zustand stehen bleiben, misst einen Fluss mit den drei Zahlen und dem Verhältnis von Karen Martin und Mike Osterling und schließt mit einer Karte für die erste Wertstromkarte auf Papier."),
  figure: { n: x("38%", "38%", "38 %"), by: "Vidal-Carreras et al., 2022", t: x(
    "of a patient's day at an oncology day hospital in Spain was value-added time, at the median. Most of the rest was waiting.",
    "e ditës së një pacienti në një spital ditor onkologjik në Spanjë ishte kohë që shton vlerë, sipas medianës. Pjesa më e madhe e kohës tjetër ishte pritje.",
    "des Tages eines Patienten in einer onkologischen Tagesklinik in Spanien waren im Median wertschöpfende Zeit. Der Rest war größtenteils Warten.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("Learning to see", "Të mësosh të shohësh", "Sehen lernen") },
    { page: "numbers", kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: x("A day of waiting", "Një ditë pritjeje", "Ein Tag Warten") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("A first map on paper", "Harta e parë në letër", "Die erste Karte auf Papier") },
  ],
  sources: ["vsm-rother-shook-1999", "vsm-lei-lexicon", "vsm-jones-womack-2011", "vsm-vidal-carreras-2022", "vsm-marin-garcia-2021", "vsm-shou-2017", "vsm-martin-osterling-2014", "vsm-martin-2009"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Work is usually managed department by department, and each department can look efficient. The time the customer waits sits between them. Value stream mapping draws one flow from end to end, shows how much of its time is work, and sketches the next state before anything changes.",
        "Puna zakonisht drejtohet departament pas departamenti, dhe secili prej tyre mund të duket efikas. Koha që pret klienti ndodhet mes tyre. Harta e rrjedhës së vlerës e vizaton një rrjedhë nga fillimi në fund, tregon sa nga koha e saj është punë, dhe skicon gjendjen e ardhshme para se të ndryshojë ndonjë gjë.",
        "Arbeit wird meist Abteilung für Abteilung gesteuert, und jede Abteilung kann effizient aussehen. Die Zeit, die der Kunde wartet, liegt dazwischen. Die Wertstromanalyse zeichnet einen Fluss von Anfang bis Ende, zeigt, wie viel seiner Zeit Arbeit ist, und skizziert den nächsten Zustand, bevor sich etwas ändert."),
      body: x(
        "Mike Rother and John Shook took a simple Toyota diagram and made it a method. In an oncology day hospital in Spain, a map showed patients spending most of the day waiting on a laboratory and a pharmacy whose work took minutes. A review of 80 healthcare publications found that many maps stop at the current state. Karen Martin and Mike Osterling measure a flow with three numbers and a ratio, and the card at the end is for your first map on paper.",
        "Mike Rother dhe John Shook morën një diagram të thjeshtë të Toyota-s dhe e kthyen në metodë. Në një spital ditor onkologjik në Spanjë, një hartë tregoi se pacientët e kalonin pjesën më të madhe të ditës duke pritur një laborator dhe një farmaci, puna e të cilave zgjaste minuta. Një rishikim i 80 botimeve në shëndetësi gjeti se shumë harta ndalen te gjendja e sotme. Karen Martin dhe Mike Osterling e masin një rrjedhë me tri numra dhe një raport, ndërsa karta në fund është për hartën tënde të parë në letër.",
        "Mike Rother und John Shook machten aus einem einfachen Toyota-Diagramm eine Methode. In einer onkologischen Tagesklinik in Spanien zeigte eine Karte, dass Patienten den größten Teil des Tages auf ein Labor und eine Apotheke warteten, deren Arbeit Minuten dauerte. Eine Übersicht über 80 Veröffentlichungen aus dem Gesundheitswesen ergab, dass viele Karten beim Ist-Zustand stehen bleiben. Karen Martin und Mike Osterling messen einen Fluss mit drei Zahlen und einem Verhältnis; die Karte am Ende ist für Ihre erste Wertstromkarte auf Papier."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("Learning", "Të mësosh", "Sehen"), x("to see", "të shohësh", "lernen")],
      lead: x(
        "In 1998 Mike Rother and John Shook wrote that a simple tool had been right under their noses. At Toyota it was called material and information flow mapping, and it was used to draw the current and future state of a process. Rother noticed it while studying Toyota; Shook had known it for over ten years without thinking it important.",
        "Në 1998, Mike Rother dhe John Shook shkruan se një mjet i thjeshtë u kishte qenë gjithë kohën para syve. Te Toyota quhej harta e rrjedhës së materialit dhe të informacionit, dhe me të vizatohej gjendja e sotme dhe e ardhshme e një procesi. Rother-i e vuri re ndërsa studionte Toyota-n; Shook-u e njihte prej më shumë se dhjetë vjetësh, pa i dhënë rëndësi.",
        "1998 schrieben Mike Rother und John Shook, ein einfaches Werkzeug habe ihnen die ganze Zeit vor Augen gelegen. Bei Toyota hieß es Material- und Informationsflussdiagramm; damit zeichnete man Ist- und Soll-Zustand eines Prozesses. Rother fiel es auf, als er Toyota untersuchte; Shook kannte es seit über zehn Jahren, ohne ihm Bedeutung beizumessen."),
      blocks: [
        { type: "quote", text: x(
          "The challenge lies in seeing it.",
          "Sfida është ta shohësh.",
          "Die Herausforderung besteht darin, ihn zu sehen.") },
        { type: "p", text: x(
          "Wherever there is a product for a customer, they write, there is a value stream. Dan Jones and Jim Womack describe the difficulty from their own walks through plants: most managers want to stand in one place and look at their machine, their department, their plant. These often score well on the usual measures. When the managers follow the product instead, the stream as a whole turns out to perform poorly.",
          "Kudo ku ka një produkt për një klient, shkruajnë ata, ka edhe një rrjedhë vlere. Dan Jones dhe Jim Womack e përshkruajnë vështirësinë nga vizitat e tyre në terren: shumica e menaxherëve duan të qëndrojnë në një vend dhe të shohin makinën, departamentin, fabrikën e tyre. Këto shpesh dalin mirë në matjet e zakonshme. Kur menaxherët e ndjekin produktin, del se rrjedha në tërësi funksionon dobët.",
          "Wo immer es ein Produkt für einen Kunden gibt, schreiben sie, gibt es auch einen Wertstrom. Dan Jones und Jim Womack schildern die Schwierigkeit aus ihren eigenen Werksrundgängen: Die meisten Führungskräfte wollen an einem Ort stehen und auf ihre Maschine, ihre Abteilung, ihr Werk schauen. Diese schneiden bei den üblichen Kennzahlen oft gut ab. Folgen die Führungskräfte stattdessen dem Produkt, zeigt sich, dass der Strom als Ganzes schlecht läuft.") },
        { type: "callout", reading: true, text: x(
          "A department can hit its target while the customer waits. The map swaps the question of how busy each step is for how long the product sits between steps.",
          "Një departament mund ta arrijë objektivin ndërsa klienti pret. Harta e zëvendëson pyetjen se sa i zënë është çdo hap me pyetjen se sa gjatë qëndron produkti mes hapave.",
          "Eine Abteilung kann ihr Soll erfüllen, während der Kunde wartet. Die Karte ersetzt die Frage, wie ausgelastet jeder Schritt ist, durch die Frage, wie lange das Produkt zwischen den Schritten liegt.") },
      ],
      note: x(
        "From the authors' introduction of May 1998; the workbook appeared at the Lean Enterprise Institute in 1999. The quote is confirmed only in secondary sources. Jones and Womack: Seeing the Whole Value Stream (2011).",
        "Nga hyrja e autorëve, maj 1998; libri-fletore doli te Lean Enterprise Institute në 1999. Citimi konfirmohet vetëm nga burime dytësore. Jones dhe Womack: Seeing the Whole Value Stream (2011).",
        "Aus der Einleitung der Autoren vom Mai 1998; das Arbeitsbuch erschien 1999 beim Lean Enterprise Institute. Das Zitat ist nur in Sekundärquellen belegt. Jones und Womack: Seeing the Whole Value Stream (2011)."),
      source: ["vsm-rother-shook-1999", "vsm-jones-womack-2011"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("A day", "Një ditë", "Ein Tag"), x("of waiting", "pritjeje", "Warten")],
      lead: x(
        "Pilar Vidal-Carreras and colleagues mapped the day of adults receiving chemotherapy at the oncology day hospital of a large public hospital in Spain: a blood test, a visit to the oncologist, then the treatment. Patients waited 300 minutes; the median stay was 446.",
        "Pilar Vidal-Carreras dhe kolegët hartuan ditën e të rriturve që marrin kimioterapi në spitalin ditor onkologjik të një spitali të madh publik në Spanjë: analiza e gjakut, vizita te onkologu, pastaj trajtimi. Pacientët prisnin 300 minuta; mediana e qëndrimit ishte 446.",
        "Pilar Vidal-Carreras und Kollegen bildeten den Tag Erwachsener ab, die in der onkologischen Tagesklinik eines großen öffentlichen Krankenhauses in Spanien Chemotherapie erhalten: Blutabnahme, Termin beim Onkologen, dann die Behandlung. Die Patienten warteten 300 Minuten; der Aufenthalt dauerte im Median 446."),
      blocks: [
        { type: "hbars", source: ["vsm-vidal-carreras-2022"],
          label: x("Value-added time as a share of the stay, median", "Koha që shton vlerë si pjesë e qëndrimit, mediana", "Wertschöpfende Zeit als Anteil am Aufenthalt, Median"),
          items: [
            { k: x("Current state", "Gjendja e sotme", "Ist-Zustand"), v: 38.12, n: x("38.1%", "38,1%", "38,1 %"), alert: true },
            { k: x("Future state 2, projected", "Gjendja e ardhshme 2, e parashikuar", "Soll-Zustand 2, berechnet"), v: 57.43, n: x("57.4%", "57,4%", "57,4 %") },
            { k: x("Future state 1, projected", "Gjendja e ardhshme 1, e parashikuar", "Soll-Zustand 1, berechnet"), v: 75.22, n: x("75.2%", "75,2%", "75,2 %") },
          ] },
        { type: "p", text: x(
          "The laboratory could test a sample in under 15 minutes, yet the next appointment came an hour later. A dose took 15 minutes to prepare on average, yet the pharmacy would not promise it in under three hours: requests from the whole hospital arrived at once, with no priority.",
          "Laboratori mund ta analizonte një mostër për më pak se 15 minuta, por takimi tjetër vinte një orë më vonë. Përgatitja e një doze zgjaste mesatarisht 15 minuta, por farmacia nuk e premtonte për më pak se tri orë: kërkesat e gjithë spitalit mbërrinin njëherësh, pa asnjë përparësi.",
          "Das Labor konnte eine Probe in unter 15 Minuten auswerten, doch der nächste Termin folgte erst eine Stunde später. Eine Dosis war im Schnitt in 15 Minuten zubereitet, doch die Apotheke sagte sie nicht unter drei Stunden zu: Die Anforderungen des ganzen Hauses trafen gleichzeitig und ohne Priorisierung ein.") },
        { type: "callout", reading: true, text: x(
          "The work was quick. What made the day long was the time between departments, which no department answered for.",
          "Puna ishte e shpejtë. Ditën e zgjaste koha mes departamenteve, për të cilën nuk përgjigjej asnjë departament.",
          "Die Arbeit ging schnell. Lang wurde der Tag durch die Zeit zwischen den Abteilungen, für die keine Abteilung zuständig war.") },
      ],
      note: x(
        "The future states are designs that have not been put in place, so their gains are projected rather than measured. One hospital; the number of patients observed is not given.",
        "Gjendjet e ardhshme janë projekte që ende nuk janë zbatuar, ndaj fitimet e tyre janë të parashikuara, jo të matura. Një spital i vetëm; numri i pacientëve të vëzhguar nuk jepet.",
        "Die Soll-Zustände sind Entwürfe, die noch nicht umgesetzt wurden; ihre Verbesserungen sind also berechnet, nicht gemessen. Ein einziges Krankenhaus; wie viele Patienten beobachtet wurden, wird nicht genannt."),
      source: ["vsm-vidal-carreras-2022"],
    },
    {
      id: "model", more: "where-part-of-the-order-goes-missing",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Current state,", "Gjendja e sotme,", "Ist-Zustand,"), x("future state", "gjendja e ardhshme", "Soll-Zustand")],
      lead: x(
        "Rother and Shook map one product family from door to door. They trace its path from the customer back to the supplier and draw two flows: the material, and the information that tells each step what to do next.",
        "Rother-i dhe Shook-u hartojnë një familje produktesh nga dera në derë. E ndjekin rrugën e saj nga klienti prapa deri te furnitori dhe vizatojnë dy rrjedha: materialin, dhe informacionin që i thotë çdo hapi çfarë të bëjë më pas.",
        "Rother und Shook bilden eine Produktfamilie von Tor zu Tor ab. Sie verfolgen ihren Weg vom Kunden zurück zum Lieferanten und zeichnen zwei Flüsse: das Material und die Information, die jedem Schritt sagt, was als Nächstes zu tun ist."),
      blocks: [
        { type: "chain", items: [
          { h: x("Product family", "Familja e produkteve", "Produktfamilie"), p: x("Chosen from the customer end: what, how much, how often?", "Zgjidhet nga ana e klientit: çfarë, sa, sa shpesh?", "Vom Kunden her gewählt: was, wie viel, wie oft?") },
          { h: x("Current state", "Gjendja e sotme", "Ist-Zustand"), p: x("Drawn on the floor, walking the flow.", "Vizatohet në terren, duke e ndjekur rrjedhën në këmbë.", "Vor Ort gezeichnet, entlang des Flusses.") },
          { h: x("Future state", "Gjendja e ardhshme", "Soll-Zustand"), p: x("How value should flow. The most important map.", "Si duhet të rrjedhë vlera. Harta më e rëndësishme.", "Wie der Wert fließen soll. Die wichtigste Karte.") },
          { h: x("Plan", "Plani", "Plan"), p: x("One page on how to get there, reviewed regularly.", "Një faqe për mënyrën si arrihet atje, e rishikuar rregullisht.", "Eine Seite zum Weg dorthin, regelmäßig überprüft.") },
        ] },
        { type: "p", text: x(
          "The arrows run both ways: ideas for the future come up while the present is being mapped. In their words, “a current state without a future state is not much use.” One person with authority across departments, a value-stream manager, leads the work. Improving the flow is “management doing kaizen”, while teams improve their own steps.",
          "Shigjetat shkojnë në të dy drejtimet: idetë për të ardhmen lindin ndërsa hartohet e sotmja. Me fjalët e tyre, “një gjendje e sotme pa një gjendje të ardhshme nuk vlen shumë.” Punën e drejton një person me autoritet mbi disa departamente, menaxheri i rrjedhës së vlerës. Përmirësimi i rrjedhës është “menaxhimi që bën kaizen”, ndërsa ekipet përmirësojnë hapat e tyre.",
          "Die Pfeile laufen in beide Richtungen: Ideen für die Zukunft entstehen, während man die Gegenwart aufnimmt. In ihren Worten: „Ein Ist-Zustand ohne Soll-Zustand nützt nicht viel.“ Eine Person mit Befugnissen über Abteilungsgrenzen hinweg, ein Wertstrommanager, leitet die Arbeit. Den Fluss zu verbessern ist „Kaizen der Führung“, während die Teams ihre eigenen Schritte verbessern.") },
        { type: "callout", reading: true, text: x(
          "On a map, most boxes look busy. The lines between them are what make it worth drawing.",
          "Në një hartë, shumica e kutive duken të zëna. Vijat mes tyre janë ato që e bëjnë hartën të vlejë.",
          "Auf einer Karte wirken die meisten Kästen ausgelastet. Die Linien dazwischen sind es, für die sich das Zeichnen lohnt.") },
      ],
      note: x(
        "Steps and quotes follow Part I of Learning to See, as excerpted by the Lean Enterprise Institute. The reading is the editors'.",
        "Hapat dhe citimet ndjekin Pjesën I të Learning to See, në fragmentin e botuar nga Lean Enterprise Institute. Leximi është i redaksisë.",
        "Schritte und Zitate folgen Teil I von Learning to See, vom Lean Enterprise Institute als Auszug veröffentlicht. Die Deutung stammt von der Redaktion."),
      source: ["vsm-rother-shook-1999"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("Maps", "Harta", "Karten"), x("without a future", "pa të ardhme", "ohne Zukunft")],
      lead: x(
        "Juan Marin-Garcia and colleagues reviewed 80 publications on value stream mapping in healthcare from 2015 to 2019. Twenty talked about a map but drew none. For the other 60, the team checked what the map showed.",
        "Juan Marin-Garcia dhe kolegët shqyrtuan 80 botime për hartën e rrjedhës së vlerës në shëndetësi, nga 2015 deri në 2019. Njëzet prej tyre flisnin për një hartë, por nuk vizatonin asnjë. Te 60 të tjerat, ekipi shqyrtoi çfarë tregonte harta.",
        "Juan Marin-Garcia und Kollegen werteten 80 Veröffentlichungen zur Wertstromanalyse im Gesundheitswesen aus den Jahren 2015 bis 2019 aus. Zwanzig sprachen von einer Karte, zeichneten aber keine. Bei den übrigen 60 prüfte das Team, was die Karte zeigte."),
      blocks: [
        { type: "hbars", max: 60, source: ["vsm-marin-garcia-2021"],
          label: x("What the 60 drawn maps show", "Çfarë tregojnë 60 hartat e vizatuara", "Was die 60 gezeichneten Karten zeigen"),
          items: [
            { k: x("Waiting", "Pritjen", "Wartezeiten"), v: 38, n: x("38 of 60", "38 nga 60", "38 von 60") },
            { k: x("A lead-time line", "Një vijë të kohës së plotë", "Eine Durchlaufzeitlinie"), v: 22, n: x("22 of 60", "22 nga 60", "22 von 60") },
            { k: x("A future state", "Një gjendje të ardhshme", "Einen Soll-Zustand"), v: 20, n: x("20 of 60", "20 nga 60", "20 von 60"), alert: true },
            { k: x("The information flow", "Rrjedhën e informacionit", "Den Informationsfluss"), v: 19, n: x("19 of 60", "19 nga 60", "19 von 60"), alert: true },
          ] },
        { type: "p", text: x(
          "No study reported a negative or barely noticeable result, and the authors ask whether publication bias plays a part. After reviewing 131 articles from five sectors (1999–2016), Wenchi Shou and colleagues conclude that what matters is what value and waste mean in each kind of flow, and whether the classic lean metrics fit it.",
          "Asnjë studim nuk raportoi rezultat negativ ose mezi të dukshëm, dhe autorët pyesin nëse ndikon anshmëria e botimit. Pasi shqyrtuan 131 artikuj nga pesë sektorë (1999–2016), Wenchi Shou dhe kolegët arrijnë në përfundimin se rëndësi ka çfarë do të thotë vlerë dhe humbje në çdo lloj rrjedhe, dhe nëse matjet klasike lean i përshtaten asaj.",
          "Keine Studie meldete ein negatives oder kaum merkliches Ergebnis; die Autoren fragen, ob ein Publikationsbias mitspielt. Nach der Durchsicht von 131 Artikeln aus fünf Branchen (1999–2016) kommen Wenchi Shou und Kollegen zu dem Schluss: Entscheidend ist, was Wert und Verschwendung in der jeweiligen Art von Fluss bedeuten und ob die klassischen Lean-Kennzahlen dazu passen.") },
        { type: "callout", reading: true, text: x(
          "A current-state map is a photograph. Only the future state turns it into a decision.",
          "Harta e gjendjes së sotme është një fotografi. Vetëm gjendja e ardhshme e kthen në vendim.",
          "Eine Karte des Ist-Zustands ist eine Momentaufnahme. Erst der Soll-Zustand macht eine Entscheidung daraus.") },
      ],
      note: x(
        "Waiting and the lead-time line are read off a figure; the other two follow the text (the figure shows 21 and 18). Shou's sectors: manufacturing, health care, construction, product development, services.",
        "Pritja dhe vija e kohës lexohen nga një figurë; dy të tjerat ndjekin tekstin (figura tregon 21 dhe 18). Sektorët te Shou: prodhimi, shëndetësia, ndërtimi, zhvillimi i produkteve, shërbimet.",
        "Wartezeiten und Durchlaufzeitlinie sind aus einer Abbildung abgelesen; die anderen beiden folgen dem Text (die Abbildung zeigt 21 und 18). Shous Branchen: Produktion, Gesundheitswesen, Bau, Produktentwicklung, Dienstleistungen."),
      source: ["vsm-marin-garcia-2021", "vsm-shou-2017"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie es gemessen wird"),
      title: [x("Three numbers", "Tri numra", "Drei Zahlen"), x("and a ratio", "dhe një raport", "und ein Verhältnis")],
      lead: x(
        "Karen Martin and Mike Osterling map office and service work. For every step on the map they note two times and one measure of quality; a timeline under the steps adds them up.",
        "Karen Martin dhe Mike Osterling hartojnë punën në zyra dhe në shërbime. Për çdo hap në hartë shënojnë dy kohë dhe një masë të cilësisë; një vijë kohe poshtë hapave i mbledh.",
        "Karen Martin und Mike Osterling bilden Arbeit in Büro und Dienstleistung ab. Für jeden Schritt auf der Karte notieren sie zwei Zeiten und ein Qualitätsmaß; eine Zeitlinie unter den Schritten zählt sie zusammen."),
      blocks: [
        { type: "cards", cols: 3, items: [
          { h: x("Process time", "Koha e procesit", "Bearbeitungszeit"), p: x("the time it takes to actually do the work", "koha që duhet për ta bërë vetë punën", "die Zeit, die die eigentliche Arbeit dauert") },
          { h: x("Lead time", "Koha e plotë", "Durchlaufzeit"), p: x("from the moment work is available to a step until it is passed on", "nga çasti kur puna është gati për një hap deri kur kalon më tej", "vom Moment, in dem Arbeit für einen Schritt bereitliegt, bis zur Weitergabe") },
          { h: x("%C&A", "%C&A", "%C&A"), p: x("percent complete and accurate: how often the next step can use the work without correcting, adding or clarifying", "përqindja e plotë dhe e saktë: sa shpesh hapi tjetër e përdor punën pa korrigjuar, pa shtuar dhe pa sqaruar", "Prozent vollständig und korrekt: wie oft der nächste Schritt die Arbeit nutzen kann, ohne zu korrigieren, zu ergänzen oder nachzufragen") },
        ] },
        { type: "p", text: x(
          "Work that arrives at 1 pm and leaves at 3 pm has a lead time of two hours, even if it takes 20 minutes. The activity ratio is the sum of the process times divided by the sum of the lead times.",
          "Puna që mbërrin në 13:00 dhe largohet në 15:00 ka kohë të plotë dy orë, edhe nëse kërkon 20 minuta. Raporti i aktivitetit është shuma e kohëve të procesit pjesëtuar me shumën e kohëve të plota.",
          "Arbeit, die um 13 Uhr ankommt und um 15 Uhr weitergeht, hat zwei Stunden Durchlaufzeit, auch wenn sie 20 Minuten dauert. Der Aktivitätsanteil ist die Summe der Bearbeitungszeiten geteilt durch die Summe der Durchlaufzeiten.") },
        { type: "example", label: x("Hypothetical example, a customer refund in an office", "Shembull hipotetik, një rimbursim klienti në një zyrë", "Hypothetisches Beispiel: eine Kundenerstattung im Büro"), rows: [
          { k: x("Process time", "Koha e procesit", "Bearbeitungszeit"), v: x("80 minutes over five steps", "80 minuta në pesë hapa", "80 Minuten in fünf Schritten") },
          { k: x("Lead time", "Koha e plotë", "Durchlaufzeit"), v: x("4 working days, 1,920 minutes", "4 ditë pune, 1.920 minuta", "4 Arbeitstage, 1.920 Minuten") },
          { k: x("Activity ratio", "Raporti i aktivitetit", "Aktivitätsanteil"), v: x("80 / 1,920 = 4.2%", "80 / 1.920 = 4,2%", "80 / 1.920 = 4,2 %") },
        ], text: x("Faster work would save minutes; the days are lost in the queues. The figures are made up.", "Puna më e shpejtë do të kursente minuta; ditët humbasin në radhë. Shifrat janë të sajuara.", "Schnellere Arbeit spart Minuten; die Tage gehen in den Warteschlangen verloren. Die Zahlen sind erfunden.") },
      ],
      note: x(
        "The times, the formula and the two-hour case follow Martin (2014); %C&A follows her 2009 slides. The LEI lexicon likewise calls processing time a small fraction of lead time. The example is the editors'.",
        "Kohët, formula dhe rasti me dy orë ndjekin Martin-in (2014); %C&A ndjek prezantimin e saj të 2009. Edhe fjalori i LEI e quan kohën e përpunimit një pjesë të vogël të kohës së plotë. Shembulli është i redaksisë.",
        "Zeiten, Formel und das Zwei-Stunden-Beispiel folgen Martin (2014), %C&A ihren Folien von 2009. Auch das LEI-Lexikon nennt die Bearbeitungszeit einen kleinen Bruchteil der Durchlaufzeit. Das Beispiel stammt von der Redaktion."),
      source: ["vsm-martin-osterling-2014", "vsm-martin-2009", "vsm-lei-lexicon"],
    },
    {
      id: "tool", tool: "/tools/delay-analyzer/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("A first map", "Harta e parë", "Die erste Karte"), x("on paper", "në letër", "auf Papier")],
      lead: x(
        "One flow, a pencil and a walk along it. Start where the customer receives the work and go back step by step; write down what you see and do the timing yourself.",
        "Një rrjedhë, një laps dhe një vizitë përgjatë saj. Nis aty ku klienti e merr punën dhe kthehu prapa hap pas hapi; shëno atë që sheh dhe mate kohën vetë.",
        "Ein Fluss, ein Bleistift und ein Rundgang daran entlang. Beginnen Sie dort, wo der Kunde die Arbeit erhält, und gehen Sie Schritt für Schritt zurück; notieren Sie, was Sie sehen, und messen Sie die Zeiten selbst."),
      blocks: [
        { type: "form", items: [
          { h: x("The flow", "Rrjedha", "Der Fluss"), hint: x("which product or request, for which customer, how many a day", "cili produkt ose kërkesë, për cilin klient, sa në ditë", "welches Produkt oder welcher Auftrag, für welchen Kunden, wie viele am Tag") },
          { h: x("Steps", "Hapat", "Schritte"), hint: x("one box per step, from the customer back; process time under each", "një kuti për hap, nga klienti prapa; koha e procesit nën secilën", "ein Kasten je Schritt, vom Kunden zurück; Bearbeitungszeit darunter"), lines: 2 },
          { h: x("Waiting", "Pritja", "Warten"), hint: x("between the steps: how many wait, for how long", "mes hapave: sa presin, për sa kohë", "zwischen den Schritten: wie viele warten, wie lange") },
          { h: x("Information", "Informacioni", "Information"), hint: x("who tells each step what to do next, and how", "kush i thotë çdo hapi çfarë të bëjë më pas, dhe si", "wer jedem Schritt sagt, was als Nächstes zu tun ist, und wie") },
          { h: x("The timeline", "Vija e kohës", "Die Zeitlinie"), hint: x("total lead time, total process time, activity ratio", "koha e plotë gjithsej, koha e procesit gjithsej, raporti i aktivitetit", "Durchlaufzeit gesamt, Bearbeitungszeit gesamt, Aktivitätsanteil") },
          { h: x("One change for the future state", "Një ndryshim për gjendjen e ardhshme", "Eine Änderung für den Soll-Zustand"), hint: x("where the flow should not wait; who leads it, by when", "ku rrjedha nuk duhet të presë; kush e drejton, deri kur", "wo der Fluss nicht warten soll; wer es leitet, bis wann") },
        ] },
      ],
      note: x(
        "A practice the editors propose, based on Rother & Shook and Martin & Osterling.",
        "Praktikë që e propozon redaksia, e mbështetur në Rother & Shook dhe Martin & Osterling.",
        "Eine von der Redaktion vorgeschlagene Praxis, gestützt auf Rother & Shook sowie Martin & Osterling."),
      source: ["vsm-rother-shook-1999", "vsm-martin-osterling-2014"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
