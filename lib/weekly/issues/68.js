// Management Review, No. 68: Inventory record accuracy and cycle counting. Block: KPIs.
// Facts and their sources: docs/revista/management-review-nr-68.md.
import { x, pc } from "../common.js";

export default {
  number: 68,
  block: "kpi",
  date: x("November 2026", "Nëntor 2026", "November 2026"),
  theme: [x("Inventory accuracy", "Saktësia e stokut", "Bestandsgenauigkeit"), x("and cycle counting", "dhe numërimi ciklik", "und rollierende Inventur")],
  sub: x(
    "Two records in three that do not match the shelf, where the errors gather, counting what matters more often, small losses that empty shelves, how accuracy is measured, and a card for one count.",
    "Dy regjistrime nga tre që nuk përputhen me raftin, ku mblidhen gabimet, numërimi më i shpeshtë i asaj që ka rëndësi, humbjet e vogla që zbrazin raftet, si matet saktësia, dhe një kartë për një numërim.",
    "Zwei von drei Bestandsdaten, die nicht zum Regal passen, wo sich die Fehler sammeln, Wichtiges öfter zählen, kleine Verluste, die Regale leeren, wie man Genauigkeit misst, und eine Karte für eine Zählung."),
  seo: x(
    "Inventory accuracy: 65% of records wrong at one retailer, where errors gather, cycle counting by segment, blind counts, tolerances and a count card.",
    "Saktësia e stokut: 65% e regjistrimeve gabim te një shitës, ku mblidhen gabimet, numërimi ciklik, numërimi pa sasi, toleranca dhe një kartë.",
    "Bestandsgenauigkeit: 65 % falsche Bestandsdaten bei einem Händler, wo Fehler entstehen, rollierende Inventur, Blindzählung, Toleranz, eine Karte."),
  feature: x(
    "Issue 68 starts with a retailer where two inventory records in three did not match what was in the store, shows that the errors gather by product rather than by store, sets out how leading companies count the important items more often, looks at research on small undetected losses, staffing and RFID, explains how record accuracy is measured with a tolerance and a blind count, and ends with a card for one cycle count.",
    "Numri 68 nis me një shitës me pakicë ku dy regjistrime stoku nga tre nuk përputheshin me atë që kishte në dyqan, tregon se gabimet mblidhen sipas produktit më shumë se sipas dyqanit, shtjellon si i numërojnë kompanitë e përparuara më shpesh artikujt e rëndësishëm, shikon kërkimet për humbjet e vogla të pazbuluara, stafin dhe RFID-në, shpjegon si matet saktësia e regjistrimeve me një tolerancë dhe me numërim pa e ditur sasinë, dhe mbyllet me një kartë për një numërim ciklik.",
    "Ausgabe 68 beginnt bei einem Händler, bei dem zwei von drei Bestandsdaten nicht zu dem passten, was im Laden lag, zeigt, dass sich die Fehler eher nach Produkt als nach Filiale sammeln, stellt vor, wie führende Unternehmen wichtige Artikel öfter zählen, betrachtet Forschung zu kleinen unentdeckten Verlusten, Personal und RFID, erklärt, wie Bestandsgenauigkeit mit Toleranz und Blindzählung gemessen wird, und endet mit einer Karte für eine rollierende Zählung."),
  figure: { n: pc(65), by: "DeHoratius & Raman, 2008", t: x(
    "of nearly 370,000 inventory records in 37 stores of one retailer did not match what was actually there.",
    "e gati 370.000 regjistrimeve të stokut në 37 dyqane të një shitësi nuk përputheshin me atë që kishte vërtet.",
    "von fast 370.000 Bestandsdaten in 37 Filialen eines Händlers stimmten nicht mit dem tatsächlichen Bestand überein.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("The shelf and the system", "Rafti dhe sistemi", "Regal und System") },
    { page: "model", kicker: x("The model", "Modeli", "Das Modell"),
      title: x("Count what matters more often", "Numëro më shpesh atë që ka rëndësi", "Wichtiges öfter zählen") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The cycle count card", "Karta e numërimit ciklik", "Die Karte für die rollierende Inventur") },
  ],
  sources: ["ira-raman-2001", "ira-dehoratius-raman-2008", "ira-gao-2002", "ira-kang-gershwin-2005", "ira-chuang-oliva-2015", "ira-hardgrave-2013", "ira-rinehart-1960"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Every order, every replenishment and every promise to a customer starts from a number in the system: how many are there. This issue asks how often that number is wrong, why, and how a team keeps it close to the shelf without stopping work for a full stocktake.",
        "Çdo porosi, çdo rimbushje dhe çdo premtim për një klient nis nga një numër në sistem: sa copë ka. Ky numër pyet sa shpesh ai numër është gabim, pse, dhe si e mban një ekip afër raftit pa e ndalur punën për një inventar të plotë.",
        "Jede Bestellung, jede Nachlieferung und jede Zusage an Kunden beginnt mit einer Zahl im System: wie viele da sind. Diese Ausgabe fragt, wie oft diese Zahl falsch ist, warum, und wie ein Team sie nah am Regal hält, ohne die Arbeit für eine Vollinventur anzuhalten."),
      body: x(
        "At one retailer, 65% of inventory records did not match a physical count, and the errors gathered by product category more than by store. A US government guide of 2002 shows how leading companies count the important items more often and measure accuracy against a tolerance. Research shows that small undetected losses can empty shelves, that the count itself can create errors, and what helped: full-time staff and RFID.",
        "Te një shitës me pakicë, 65% e regjistrimeve të stokut nuk përputheshin me numërimin fizik, dhe gabimet mblidheshin më shumë sipas kategorisë së produktit se sipas dyqanit. Një udhëzues i qeverisë amerikane i 2002 tregon si i numërojnë kompanitë e përparuara më shpesh artikujt e rëndësishëm dhe si e matin saktësinë me një tolerancë. Kërkimet tregojnë se humbjet e vogla të pazbuluara mund t'i zbrazin raftet, se vetë numërimi mund të krijojë gabime, dhe çfarë ndihmoi: stafi me kohë të plotë dhe RFID.",
        "Bei einem Händler stimmten 65 % der Bestandsdaten nicht mit der Zählung überein, und die Fehler sammelten sich eher nach Warengruppe als nach Filiale. Ein Leitfaden der US-Regierung von 2002 zeigt, wie führende Unternehmen wichtige Artikel öfter zählen und Genauigkeit an einer Toleranz messen. Studien zeigen, dass kleine unentdeckte Verluste Regale leeren, dass die Zählung selbst Fehler erzeugen kann und was half: Vollzeitpersonal und RFID."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("The shelf", "Rafti", "Regal"), x("and the system", "dhe sistemi", "und System")],
      lead: x(
        "Retailers had invested heavily in planning systems, wrote Ananth Raman, Nicole DeHoratius and Zeynep Ton in 2001, yet they struggled with execution. At one leading retailer, 65% of inventory records were inaccurate: the recorded level did not reflect what was actually there.",
        "Shitësit me pakicë kishin investuar shumë në sistemet e planifikimit, shkruan Ananth Raman, Nicole DeHoratius dhe Zeynep Ton në 2001, e megjithatë ngecnin te zbatimi. Te një shitës i madh, 65% e regjistrimeve të stokut ishin të pasakta: sasia e regjistruar nuk tregonte atë që kishte vërtet.",
        "Händler hatten viel in Planungssysteme investiert, schrieben Ananth Raman, Nicole DeHoratius und Zeynep Ton 2001, und scheiterten doch an der Umsetzung. Bei einem führenden Händler waren 65 % der Bestandsdaten falsch: Der Buchbestand zeigte nicht, was tatsächlich da war."),
      blocks: [
        { type: "cards", cols: 3, items: [
          { h: x("Loss", "Humbja", "Schwund"), p: x("goods leave the backroom or the shelf and no transaction records it", "malli largohet nga magazina ose nga rafti pa u regjistruar asnjë lëvizje", "Ware verschwindet aus Lager oder Regal, ohne dass eine Buchung sie erfasst") },
          { h: x("Recording", "Regjistrimi", "Buchung"), p: x("a receipt, a sale or a correction booked wrongly, or not at all", "një pranim, një shitje ose një korrigjim i regjistruar gabim, ose aspak", "ein Eingang, ein Verkauf oder eine Korrektur falsch oder gar nicht gebucht") },
          { h: x("Misplacement", "Vendi i gabuar", "Falscher Platz"), p: x("the item is in the store, but not where anyone looks for it", "artikulli është në dyqan, por jo aty ku e kërkon kushdo", "der Artikel ist im Laden, aber nicht dort, wo man ihn sucht") },
        ] },
        { type: "p", text: x(
          "At another leading retailer, misplaced items kept one in six customers who asked staff for help from finding products that were in the store. The authors put the cost at more than 10% of profits; stores of one chain, with identical IT, differed widely.",
          "Te një shitës tjetër i madh, artikujt në vend të gabuar e penguan një në gjashtë klientë që kërkuan ndihmë nga stafi të gjente produkte që ishin në dyqan. Autorët e vlerësuan koston në më shumë se 10% të fitimit; dyqanet e një rrjeti, me të njëjtin sistem, ndryshonin shumë.",
          "Bei einem anderen führenden Händler fand jeder sechste Kunde, der um Hilfe bat, vorrätige Produkte nicht, weil sie am falschen Platz lagen. Die Autoren schätzten die Kosten auf über 10 % des Gewinns; Filialen einer Kette mit identischer IT unterschieden sich stark.") },
        { type: "callout", reading: true, text: x(
          "The system knows only what it was told. Every unrecorded movement becomes a wrong number, and the next order is planned from it.",
          "Sistemi di vetëm atë që i është thënë. Çdo lëvizje e paregjistruar bëhet një numër i gabuar, dhe porosia e radhës planifikohet mbi të.",
          "Das System weiß nur, was man ihm mitteilt. Jede ungebuchte Bewegung wird zu einer falschen Zahl, und die nächste Bestellung wird danach geplant.") },
      ],
      note: x(
        "The 65% may come from the same retailer as the study on the next page. The three kinds of error follow Raman et al. and Chuang & Oliva; the grouping is the editors'.",
        "65% mund të vijë nga i njëjti shitës si studimi i faqes tjetër. Tri llojet e gabimit ndjekin Raman et al. dhe Chuang & Oliva; grupimi është i redaksisë.",
        "Die 65 % stammen womöglich vom selben Händler wie die Studie der nächsten Seite. Die drei Fehlerarten folgen Raman et al. und Chuang & Oliva; die Einteilung stammt von der Redaktion."),
      source: ["ira-raman-2001", "ira-chuang-oliva-2015"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("Where the", "Ku mblidhen", "Wo sich die"), x("errors gather", "gabimet", "Fehler sammeln")],
      lead: x(
        "Nicole DeHoratius and Ananth Raman checked nearly 370,000 inventory records in 37 stores of one retailer against physical counts, then asked where the differences cluster.",
        "Nicole DeHoratius dhe Ananth Raman krahasuan me numërimin fizik gati 370.000 regjistrime stoku në 37 dyqane të një shitësi, pastaj pyetën ku grumbullohen diferencat.",
        "Nicole DeHoratius und Ananth Raman prüften fast 370.000 Bestandsdaten in 37 Filialen eines Händlers gegen Zählungen und fragten dann, wo sich die Abweichungen häufen."),
      blocks: [
        { type: "donut", v: 65, n: pc(65), source: ["ira-dehoratius-raman-2008"], t: x(
          "of the records did not match the physical count.",
          "e regjistrimeve nuk përputheshin me numërimin fizik.",
          "der Bestandsdaten stimmten nicht mit der Zählung überein.") },
        { type: "hbars", source: ["ira-dehoratius-raman-2008"],
          label: x("Share of the total variance in record inaccuracy, 2008", "Pjesa e variancës së përgjithshme të pasaktësisë, 2008", "Anteil an der Gesamtvarianz der Bestandsfehler, 2008"),
          items: [
            { k: x("Between product categories", "Mes kategorive të produkteve", "Zwischen Warengruppen"), v: 26.4, n: x("26.4%", "26,4%", "26,4 %"), alert: true },
            { k: x("Between stores", "Mes dyqaneve", "Zwischen Filialen"), v: 2.7, n: x("2.7%", "2,7%", "2,7 %") },
          ] },
        { type: "p", text: x(
          "The product category accounted for almost ten times as much of the variance as the store. Auditing practices reduced inaccuracy; a more complex store environment and the distribution structure increased it.",
          "Kategoria e produktit shpjegonte gati dhjetë herë më shumë nga varianca se dyqani. Praktikat e kontrollit të stokut e ulnin pasaktësinë; një mjedis më i ndërlikuar i dyqanit dhe struktura e shpërndarjes e rritnin.",
          "Die Warengruppe erklärte fast zehnmal so viel der Varianz wie die Filiale. Prüfpraktiken senkten die Fehler, eine komplexere Ladenumgebung und die Struktur der Belieferung erhöhten sie.") },
        { type: "callout", reading: true, text: x(
          "Errors are not spread evenly. They gather in certain kinds of product, and that is where to count first.",
          "Gabimet nuk shpërndahen njësoj. Mblidhen te disa lloje produktesh, dhe aty duhet numëruar së pari.",
          "Fehler verteilen sich nicht gleichmäßig. Sie sammeln sich bei bestimmten Produktarten, und dort sollte man zuerst zählen.") },
      ],
      note: x(
        "One retailer, published 2008. Any difference from the count makes a record inaccurate; the size of the gaps is not shown here.",
        "Një shitës, botuar në 2008. Çdo diferencë nga numërimi e bën regjistrimin të pasaktë; madhësia e diferencave nuk tregohet këtu.",
        "Ein Händler, veröffentlicht 2008. Jede Abweichung von der Zählung macht einen Datensatz falsch; die Größe der Abweichungen zeigen wir nicht."),
      source: ["ira-dehoratius-raman-2008"],
    },
    {
      id: "model",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Count what matters", "Numëro më shpesh", "Wichtiges"), x("more often", "atë që ka rëndësi", "öfter zählen")],
      lead: x(
        "In 2002 the US General Accounting Office (GAO) studied 12 locations of seven companies known for inventory management. Some counted everything at one point in time; most used cycle counting: a portion daily, weekly or monthly, until all stock has been counted.",
        "Në 2002, Zyra e Përgjithshme e Kontabilitetit e SHBA (GAO) studioi 12 vende të shtatë kompanive të njohura për menaxhimin e stokut. Disa numëronin gjithçka në një moment; shumica përdornin numërimin ciklik: një pjesë çdo ditë, javë ose muaj, derisa të numërohet i gjithë stoku.",
        "2002 untersuchte der US-Rechnungshof GAO 12 Standorte von sieben für ihre Lagerführung bekannten Unternehmen. Manche zählten alles zu einem Zeitpunkt; die meisten zählten rollierend: täglich, wöchentlich oder monatlich ein Teil, bis alles gezählt ist."),
      blocks: [
        { type: "columns", max: 4, height: 110, source: ["ira-gao-2002"],
          label: x("Counts per year at one location, by segment (share of items)", "Numërime në vit në një vend, sipas segmentit (pjesa e artikujve)", "Zählungen pro Jahr an einem Standort, nach Segment (Anteil der Artikel)"),
          items: [
            { k: x("A · top 10%", "A · 10% e parë", "A · obere 10 %"), v: 4, n: "4×", alert: true },
            { k: x("B · 20%", "B · 20%", "B · 20 %"), v: 3, n: "3×" },
            { k: x("C · 30%", "C · 30%", "C · 30 %"), v: 2, n: "2×" },
            { k: x("D · 40%", "D · 40%", "D · 40 %"), v: 1, n: "1×" },
          ] },
        { type: "p", text: x(
          "Items were ranked by value times activity. At another company, with some 80 facilities, a site could switch to cycle counting only after a wall-to-wall count and accuracy above 95%. It began at four full cycles a year; getting down to one took about six years. Below 95%, a full count was due again.",
          "Artikujt renditeshin sipas vlerës shumëzuar me lëvizjen. Te një kompani tjetër, me rreth 80 objekte, një vend kalonte te numërimi ciklik vetëm pas një numërimi të plotë dhe me saktësi mbi 95%. Fillonte me katër cikle të plota në vit; për të zbritur në një iu deshën rreth gjashtë vjet. Nën 95%, duhej sërish një numërim i plotë.",
          "Gereiht wurde nach Wert mal Bewegung. Bei einem anderen Unternehmen mit rund 80 Standorten durfte ein Standort erst nach einer Vollinventur und mit über 95 % Genauigkeit rollierend zählen. Er begann mit vier vollen Zyklen im Jahr; bis zu einem dauerte es etwa sechs Jahre. Unter 95 % war wieder eine Vollinventur fällig.") },
        { type: "callout", reading: true, text: x(
          "Cycle counting is earned: it works where the records are already close to right.",
          "Numërimi ciklik fitohet: funksionon aty ku regjistrimet janë tashmë afër së vërtetës.",
          "Rollierende Inventur muss man sich verdienen: Sie wirkt, wo die Daten schon fast stimmen.") },
      ],
      note: x(
        "The segments are one plant's work in process; at the 12 locations, frequencies ranged from daily to less than yearly. Cycle counting needs a system that books every movement; all seven companies had one.",
        "Segmentet janë puna në proces e një fabrike; te 12 vendet, shpeshtësia shkonte nga çdo ditë deri në më rrallë se një herë në vit. Numërimi ciklik kërkon një sistem që regjistron çdo lëvizje; të shtatë kompanitë e kishin.",
        "Die Segmente betreffen Umlaufbestände eines Werks; an den 12 Standorten reichte die Häufigkeit von täglich bis seltener als jährlich. Rollierende Inventur braucht ein System, das jede Bewegung bucht; alle sieben hatten eines."),
      source: ["ira-gao-2002"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("Small losses,", "Humbje të vogla,", "Kleine Verluste,"), x("empty shelves", "rafte bosh", "leere Regale")],
      lead: x(
        "Yun Kang and Stanley Gershwin at MIT modelled stock that disappears without the system noticing. Even a small rate of undetected loss disrupted replenishment and led to severe out-of-stocks; the sales lost could far outweigh the goods lost. Lean systems with little stock were even more sensitive.",
        "Yun Kang dhe Stanley Gershwin në MIT modeluan stokun që zhduket pa e vënë re sistemi. Edhe një normë e vogël humbjesh të pazbuluara e prishte rimbushjen dhe sillte mungesa të rënda në raft; shitjet e humbura mund ta tejkalonin shumë mallin e humbur. Sistemet lean me pak stok ishin edhe më të ndjeshme.",
        "Yun Kang und Stanley Gershwin am MIT modellierten Bestand, der verschwindet, ohne dass das System es merkt. Schon eine kleine Rate unentdeckter Verluste störte die Nachversorgung und führte zu schweren Fehlbeständen; die entgangenen Verkäufe konnten den verlorenen Warenwert weit übersteigen. Schlanke Systeme mit wenig Bestand reagierten noch empfindlicher."),
      blocks: [
        { type: "figures", compact: true, items: [
          { n: x("~26%", "~26%", "~26 %"), t: x("less record inaccuracy with RFID, one category, 13 stores, 23 weeks", "më pak pasaktësi me RFID, një kategori, 13 dyqane, 23 javë", "weniger Bestandsfehler mit RFID, eine Warengruppe, 13 Filialen, 23 Wochen") },
          { n: x("up to 81%", "deri 81%", "bis 81 %"), t: x("in five categories and 62 stores; in some, no significant effect", "në pesë kategori dhe 62 dyqane; te disa, pa efekt domethënës", "in fünf Warengruppen und 62 Filialen; bei manchen ohne signifikante Wirkung") },
        ] },
        { type: "p", text: x(
          "In a simulation, Howard Hao-Chun Chuang and Rogelio Oliva found loss in the backroom and on the shelf to be the main driver; recording and shelving errors mattered little. In five stores of a global chain, full-time staff reduced inaccuracy, part-time staff did not. In 1960, R. F. Rinehart found that about 80% of the discrepancies in a federal supply facility came from the procedures meant to correct them.",
          "Në një simulim, Howard Hao-Chun Chuang dhe Rogelio Oliva gjetën se humbjet në magazinë dhe në raft ishin shkaku kryesor; gabimet e regjistrimit dhe të vendosjes kishin pak ndikim. Në pesë dyqane të një rrjeti global, stafi me kohë të plotë e uli pasaktësinë, ai me kohë të pjesshme jo. Në 1960, R. F. Rinehart gjeti se rreth 80% e mospërputhjeve në një depo federale furnizimi vinin nga procedurat që duhej t'i korrigjonin.",
          "In einer Simulation fanden Howard Hao-Chun Chuang und Rogelio Oliva Schwund in Lager und Regal als Haupttreiber; Buchungs- und Einräumfehler zählten kaum. In fünf Filialen einer globalen Kette senkte Vollzeitpersonal die Fehler, Teilzeitpersonal nicht. 1960 fand R. F. Rinehart, dass etwa 80 % der Abweichungen in einem Bundeslager der USA von den Verfahren stammten, die sie korrigieren sollten.") },
        { type: "callout", reading: true, text: x(
          "A record that is too high is the dangerous one: the system sees stock and does not reorder. And a careless count writes a new error into the system.",
          "Regjistrimi që tregon më shumë se ç'ka është ai i rrezikshmi: sistemi sheh stok dhe nuk porosit. Dhe një numërim i pakujdesshëm shkruan një gabim të ri në sistem.",
          "Gefährlich ist der zu hohe Buchbestand: Das System sieht Ware und bestellt nicht nach. Und eine nachlässige Zählung schreibt einen neuen Fehler ins System.") },
      ],
      note: x(
        "Kang & Gershwin: models, not field data. Hardgrave et al.: field experiments at one global retailer. Rinehart: one facility; the sources were counting and adjusting balances.",
        "Kang & Gershwin: modele, jo të dhëna nga terreni. Hardgrave et al.: eksperimente në terren te një shitës global. Rinehart: një depo; burimet ishin numërimi dhe korrigjimi i gjendjeve.",
        "Kang & Gershwin: Modelle, keine Felddaten. Hardgrave et al.: Feldexperimente bei einem globalen Händler. Rinehart: ein Lager; Quellen waren Zählen und Korrigieren der Bestände."),
      source: ["ira-kang-gershwin-2005", "ira-hardgrave-2013", "ira-chuang-oliva-2015", "ira-rinehart-1960"],
    },
    {
      id: "measure", more: "where-part-of-the-order-goes-missing",
      kicker: x("How it is measured", "Si matet", "Wie man es misst"),
      title: [x("Count blind,", "Numëro pa parë", "Blind zählen,"), x("then measure", "sistemin, pastaj mat", "dann messen")],
      lead: x(
        "GAO's guide gives the common measure: records found accurate, divided by records counted, times 100. What counts as accurate is set by a tolerance, the range within which a count may differ from the record and still be correct.",
        "Udhëzuesi i GAO jep masën e zakonshme: regjistrimet e sakta, pjesëtuar me regjistrimet e numëruara, herë 100. Çfarë quhet e saktë e cakton toleranca, kufiri brenda të cilit numërimi mund të ndryshojë nga regjistrimi dhe të quhet prapë i saktë.",
        "Der GAO-Leitfaden nennt das übliche Maß: korrekte Datensätze geteilt durch gezählte Datensätze, mal 100. Was als korrekt gilt, legt eine Toleranz fest, die Spanne, in der eine Zählung vom Buchbestand abweichen darf und trotzdem stimmt."),
      blocks: [
        { type: "steps", items: [
          { h: x("Count blind", "Numëro pa e ditur sasinë", "Blind zählen"), p: x("Item and location, not the quantity: at 10 of 12 locations.", "Artikulli dhe vendi, jo sasia: në 10 nga 12 vende.", "Artikel und Platz, nicht die Menge: an 10 von 12 Standorten.") },
          { h: x("Recount differences", "Rinumëro diferencat", "Abweichungen nachzählen"), p: x("Usually two or three counts, ideally by someone else.", "Zakonisht dy ose tri numërime, mirë nga dikush tjetër.", "Meist zwei oder drei Zählungen, am besten durch jemand anderen.") },
          { h: x("Find the cause", "Gjej shkakun", "Ursache suchen"), p: x("Transactions, receipts and shipments, the same day or the next.", "Lëvizjet, pranimet dhe dërgesat, po atë ditë ose të nesërmen.", "Buchungen, Eingänge und Versand, am selben oder nächsten Tag.") },
          { h: x("Correct and code", "Korrigjo dhe kodo", "Korrigieren und codieren"), p: x("Adjust with approval and give the cause a code.", "Korrigjo me miratim dhe jepi shkakut një kod.", "Mit Freigabe anpassen und der Ursache einen Code geben.") },
        ] },
        { type: "example", label: x("Hypothetical example, a week of counts in one zone", "Shembull hipotetik, një javë numërimesh në një zonë", "Hypothetisches Beispiel, eine Woche Zählungen in einer Zone"), rows: [
          { k: x("Accuracy", "Saktësia", "Genauigkeit"), v: x("184 of 200 records within tolerance: 92%", "184 nga 200 regjistrime brenda tolerancës: 92%", "184 von 200 Datensätzen in der Toleranz: 92 %") },
          { k: x("Adjustments", "Korrigjimet", "Korrekturen"), v: x("+40 and −36 units: net +4, gross 76", "+40 dhe −36 copë: neto +4, bruto 76", "+40 und −36 Stück: netto +4, brutto 76") },
        ], text: x("The net figure looks harmless; the gross shows how much was wrong. The numbers are invented.", "Shifra neto duket e padëmshme; bruto tregon sa ishte gabim. Numrat janë të shpikur.", "Die Nettozahl wirkt harmlos, die Bruttozahl zeigt, wie viel falsch war. Die Zahlen sind erfunden.") },
      ],
      note: x(
        "Experts put the goal at 95% or more (GAO, after Brooks & Wilson); six of eight cycle-counting locations aimed at 95–98%, with tolerances of 0–5%. Those that coded causes used 22 codes on average.",
        "Ekspertët e vënë objektivin në 95% ose më shumë (GAO, sipas Brooks & Wilson); gjashtë nga tetë vendet me numërim ciklik synonin 95–98%, me toleranca 0–5%. Ata që i kodonin shkaqet përdornin mesatarisht 22 kode.",
        "Fachleute setzen das Ziel bei 95 % oder mehr an (GAO, nach Brooks & Wilson); sechs von acht Standorten mit rollierender Inventur zielten auf 95–98 %, mit Toleranzen von 0–5 %. Wer Ursachen codierte, nutzte im Schnitt 22 Codes."),
      source: ["ira-gao-2002"],
    },
    {
      id: "tool", tool: "/tools/pareto/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The cycle", "Karta e numërimit", "Die Karte für die"), x("count card", "ciklik", "rollierende Inventur")],
      lead: x(
        "One card per location counted. Write the counted quantity before you look at the system, and give every difference a cause. After a month, rank the causes.",
        "Një kartë për çdo vend të numëruar. Shëno sasinë e numëruar para se të shikosh sistemin, dhe jepi çdo diference një shkak. Pas një muaji, rendit shkaqet.",
        "Eine Karte pro gezähltem Platz. Die gezählte Menge notieren, bevor man ins System schaut, und jeder Abweichung eine Ursache geben. Nach einem Monat die Ursachen ordnen."),
      blocks: [
        { type: "form", items: [
          { h: x("Item and location", "Artikulli dhe vendi", "Artikel und Platz"), hint: x("item number, description, exact location", "numri i artikullit, përshkrimi, vendi i saktë", "Artikelnummer, Bezeichnung, genauer Platz") },
          { h: x("Counted quantity", "Sasia e numëruar", "Gezählte Menge"), hint: x("counted blind; a recount if it differs", "e numëruar pa e ditur sasinë; rinumërim nëse ndryshon", "blind gezählt; Nachzählung bei Abweichung") },
          { h: x("System quantity", "Sasia në sistem", "Buchbestand"), hint: x("filled in only after the count", "plotësohet vetëm pas numërimit", "erst nach der Zählung eintragen") },
          { h: x("Difference and tolerance", "Diferenca dhe toleranca", "Abweichung und Toleranz"), hint: x("units, and whether it is within the tolerance", "copë, dhe nëse është brenda tolerancës", "Stück, und ob sie in der Toleranz liegt") },
          { h: x("Cause", "Shkaku", "Ursache"), hint: x("a code: receipt, picking, wrong location, loss, count error", "një kod: pranimi, mbledhja, vend i gabuar, humbje, gabim numërimi", "ein Code: Eingang, Kommissionierung, falscher Platz, Schwund, Zählfehler") },
          { h: x("Correction", "Korrigjimi", "Korrektur"), hint: x("who approved it, when, and what changes in the process", "kush e miratoi, kur, dhe çfarë ndryshon në proces", "wer freigab, wann, und was sich im Prozess ändert") },
        ] },
      ],
      note: x(
        "A practice proposed by the editors, after GAO (2002): blind counts, recounts, research and cause codes. A count error is a cause too, after Rinehart (1960). Rank the codes with the Pareto tool.",
        "Praktikë e propozuar nga redaksia, sipas GAO (2002): numërimi pa e ditur sasinë, rinumërimi, kërkimi i shkakut dhe kodet. Edhe gabimi i numërimit është shkak, sipas Rinehart-it (1960). Kodet renditen me mjetin Pareto.",
        "Eine Praxis, die die Redaktion vorschlägt, nach GAO (2002): Blindzählung, Nachzählung, Ursachensuche und Codes. Auch ein Zählfehler ist eine Ursache, nach Rinehart (1960). Die Codes ordnet das Pareto-Werkzeug."),
      source: ["ira-gao-2002", "ira-rinehart-1960"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
