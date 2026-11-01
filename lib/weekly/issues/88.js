// Management Review, No. 88: The bullwhip effect, why small changes in demand become large swings upstream.
// Block: Strategy. Facts and their sources: docs/revista/management-review-nr-88.md. The Beer Game figures are from
// Sterman (1989), the four causes from Lee, Padmanabhan & Whang (1997), the experiment with known demand from Croson &
// Donohue (2006): all three read in full. Forrester's work is named only as Lee et al. cite it.
// The theory of constraints is No. 54, Little's law No. 58, S&OP No. 59, demand forecasting No. 77: not repeated.
import { x, pc } from "../common.js";

// A decimal number: "10.7", "10,7", "10,7".
const dec = (s) => x(s, s.replace(".", ","), s.replace(".", ","));

export default {
  number: 88,
  block: "strategy",
  date: x("November 2026", "Nëntor 2026", "November 2026"),
  theme: [x("The bullwhip effect:", "Efekti i kamxhikut:", "Der Peitscheneffekt:"), x("small waves, big swings", "valë të vogla, lëkundje të mëdha", "kleine Wellen, große Ausschläge")],
  sub: x(
    "A board game where demand changes once, how the swing grows link by link, four rational causes and a human one, what shared stock data does, how to measure the swing, and a card.",
    "Një lojë tabele ku kërkesa ndryshon një herë, si rritet lëkundja nga hallka në hallkë, katër shkaqe racionale dhe një njerëzor, çfarë bën ndarja e të dhënave të stokut, si matet lëkundja, dhe një kartë.",
    "Ein Brettspiel, in dem sich die Nachfrage einmal ändert, wie der Ausschlag von Glied zu Glied wächst, vier rationale Ursachen und eine menschliche, was geteilte Bestandsdaten bewirken, wie man ihn misst, und eine Karte."),
  seo: x(
    "The bullwhip effect: Sterman's Beer Game, the four causes of Lee, Padmanabhan and Whang, the supply line, shared inventory data, a variance ratio and a card.",
    "Efekti i kamxhikut: Beer Game e Sterman-it, katër shkaqet e Lee-së, Padmanabhan-it dhe Whang-ut, porositë në rrugë, të dhënat e stokut dhe një kartë.",
    "Der Peitscheneffekt: Stermans Beer Game, die vier Ursachen nach Lee, Padmanabhan und Whang, die Lieferpipeline, geteilte Bestände und eine Karte."),
  feature: x(
    "In the Beer Game, customer demand rises once, from four cases a week to eight, and stays there. Factory orders still peaked at 32 on average. Issue 88 follows the swing from the shop to the factory, sets the four causes that Lee, Padmanabhan and Whang found in rational ordering beside the one Sterman found in people, and shows what shared inventory data did in a later experiment. A ratio for measuring the swing and a card for one link close the issue.",
    "Te Beer Game, kërkesa e klientëve rritet një herë, nga katër kuti në javë në tetë, dhe mbetet aty. Megjithatë porositë e fabrikës arritën mesatarisht kulmin 32. Numri 88 e ndjek lëkundjen nga dyqani te fabrika, vë katër shkaqet që Lee, Padmanabhan dhe Whang gjetën te porositë racionale pranë atij që gjeti Sterman-i te njerëzit, dhe tregon çfarë bënë të dhënat e përbashkëta të stokut në një eksperiment të mëvonshëm. Një raport për ta matur lëkundjen dhe një kartë për një hallkë e mbyllin numrin.",
    "Im Beer Game steigt die Kundennachfrage einmal, von vier Kisten pro Woche auf acht, und bleibt dort. Trotzdem erreichten die Fabrikbestellungen im Schnitt eine Spitze von 32. Ausgabe 88 verfolgt den Ausschlag vom Laden bis zur Fabrik, stellt die vier Ursachen, die Lee, Padmanabhan und Whang in rationalen Bestellungen fanden, neben die eine, die Sterman bei Menschen fand, und zeigt, was geteilte Bestandsdaten in einem späteren Experiment bewirkten. Eine Kennzahl für den Ausschlag und eine Karte für ein Glied der Kette schließen die Ausgabe."),
  figure: { n: pc(700), by: "Sterman, 1989", t: x(
    "amplification at the factory in the Beer Game: customer orders rose from 4 to 8 cases a week, factory orders peaked at 32 on average.",
    "përforcim te fabrika në Beer Game: porositë e klientëve u rritën nga 4 në 8 kuti në javë, porositë e fabrikës arritën mesatarisht kulmin 32.",
    "Verstärkung in der Fabrik im Beer Game: Die Kundenbestellungen stiegen von 4 auf 8 Kisten pro Woche, die Fabrikbestellungen erreichten im Schnitt 32.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("Demand changed once", "Kërkesa ndryshoi një herë", "Die Nachfrage änderte sich einmal") },
    { page: "research", kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: x("Even when demand is known", "Edhe kur kërkesa dihet", "Selbst bei bekannter Nachfrage") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The order-swing card", "Karta e lëkundjes së porosive", "Die Karte zum Bestellausschlag") },
  ],
  sources: ["bullwhip-sterman-1989", "bullwhip-lee-1997", "bullwhip-croson-2006"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "A shop sells a little more, and weeks later the warehouse is short, the plant runs overtime, and then everyone sits on stock. Each link blames the one below. The pattern has a name, the bullwhip effect, and decades of research on where it comes from.",
        "Një dyqan shet pak më shumë, dhe disa javë më vonë magazinës i mungon malli, fabrika punon jashtë orarit, e pastaj të gjithë mbeten me stok. Çdo hallkë fajëson atë poshtë saj. Ky model ka një emër, efekti i kamxhikut (bullwhip), dhe dhjetëra vjet kërkime se nga vjen.",
        "Ein Laden verkauft etwas mehr, und Wochen später fehlt dem Lager Ware, das Werk fährt Überstunden, und dann sitzen alle auf Beständen. Jedes Glied gibt dem darunter die Schuld. Das Muster hat einen Namen, Peitscheneffekt (Bullwhip), und Jahrzehnte der Forschung dazu, woher es kommt."),
      body: x(
        "In John Sterman's Beer Game, four players run a chain from shop to factory, and customer demand steps up once. Orders and stock still swung in every trial kept, and grew with each link. Lee, Padmanabhan and Whang showed that rational managers create the same pattern through forecasts, batches, promotions and shortages. Sterman's players added a human cause: they forgot what was already on order. Croson and Donohue took the other causes away, and the swing stayed; shared stock data helped most upstream. A ratio and a card measure the swing at one link.",
        "Te Beer Game e John Sterman-it, katër lojtarë drejtojnë një zinxhir nga dyqani te fabrika, dhe kërkesa e klientëve rritet një herë. Megjithatë porositë dhe stoku u lëkundën në çdo provë të mbajtur, dhe lëkundja u rrit me çdo hallkë. Lee, Padmanabhan dhe Whang treguan se edhe menaxherët racionalë krijojnë të njëjtin model, përmes parashikimeve, porosive në grup, promocioneve dhe mungesave. Lojtarët e Sterman-it shtuan një shkak njerëzor: harronin çfarë ishte porositur tashmë. Croson dhe Donohue i hoqën shkaqet e tjera, dhe lëkundja mbeti; të dhënat e përbashkëta të stokut ndihmuan më shumë në krye të zinxhirit. Një raport dhe një kartë e matin lëkundjen në një hallkë.",
        "In John Stermans Beer Game führen vier Spieler eine Kette vom Laden bis zur Fabrik, und die Kundennachfrage steigt einmal. Trotzdem schwankten Bestellungen und Bestände in jeder ausgewerteten Runde, und der Ausschlag wuchs mit jedem Glied. Lee, Padmanabhan und Whang zeigten, dass rationale Manager dasselbe Muster erzeugen: über Prognosen, Sammelbestellungen, Aktionen und Knappheit. Stermans Spieler fügten eine menschliche Ursache hinzu: Sie vergaßen, was schon bestellt war. Croson und Donohue nahmen die anderen Ursachen heraus, und der Ausschlag blieb; geteilte Bestandsdaten halfen am meisten oben in der Kette. Eine Kennzahl und eine Karte messen den Ausschlag an einem Glied."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("Demand changed", "Kërkesa ndryshoi", "Die Nachfrage"), x("once", "një herë", "änderte sich einmal")],
      lead: x(
        "The Beer Distribution Game was developed at MIT to teach management. Four players run a retailer, a wholesaler, a distributor and a factory. Each week the only decision is how much to order, and an order takes at least four weeks to arrive. The goal is the lowest total cost for the team.",
        "Beer Distribution Game u krijua në MIT për të mësuar menaxhim. Katër lojtarë drejtojnë një shitës me pakicë, një shitës me shumicë, një shpërndarës dhe një fabrikë. Çdo javë i vetmi vendim është sa të porositësh, dhe një porosi mbërrin pas të paktën katër javësh. Qëllimi është kostoja totale më e ulët për ekipin.",
        "Das Beer Distribution Game wurde am MIT für die Managementlehre entwickelt. Vier Spieler führen Einzelhandel, Großhandel, Vertrieb und Fabrik. Die einzige Entscheidung jede Woche ist, wie viel bestellt wird, und eine Bestellung braucht mindestens vier Wochen. Ziel sind die niedrigsten Gesamtkosten des Teams."),
      blocks: [
        { type: "timeline", items: [
          { k: x("Weeks 1–4", "Javët 1–4", "Wochen 1–4"), t: x("Customers buy 4 cases a week; everyone holds 12 and orders 4.", "Klientët blejnë 4 kuti në javë; secili mban 12 dhe porosit 4.", "Kunden kaufen 4 Kisten pro Woche; jeder hält 12 und bestellt 4.") },
          { k: x("Week 5", "Java 5", "Woche 5"), t: x("Demand rises to 8 and stays there. No one is told.", "Kërkesa ngrihet në 8 dhe mbetet aty. Askujt nuk i thuhet.", "Die Nachfrage steigt auf 8 und bleibt dort. Niemand erfährt es.") },
          { k: x("Weeks 20–25", "Javët 20–25", "Wochen 20–25"), t: x("The largest backlog, 35 cases on average.", "Porositë e pambushura arrijnë kulmin, mesatarisht 35 kuti.", "Der größte Rückstand, im Schnitt 35 Kisten.") },
          { k: x("Weeks 25–30", "Javët 25–30", "Wochen 25–30"), t: x("Stock peaks at 40 cases on average, and orders collapse.", "Stoku arrin kulmin, mesatarisht 40 kuti, dhe porositë bien.", "Der Bestand erreicht im Schnitt 40 Kisten, die Bestellungen brechen ein.") },
        ] },
        { type: "p", text: x(
          "Every one of the 11 trials analysed oscillated. Recovering the starting stock took 21 weeks on average, and team costs were about ten times a simulated benchmark. Asked afterwards to draw customer demand, most players drew a wave.",
          "Të 11 provat e analizuara u lëkundën. Rikthimi te stoku fillestar zgjati mesatarisht 21 javë, dhe kostot e ekipeve ishin rreth dhjetë herë më të larta se një pikë krahasimi e simuluar. Kur u kërkua pas lojës ta vizatonin kërkesën e klientëve, shumica e lojtarëve vizatuan një valë.",
          "Alle 11 ausgewerteten Runden schwankten. Bis der Anfangsbestand wieder erreicht war, vergingen im Schnitt 21 Wochen, und die Teamkosten lagen etwa beim Zehnfachen eines simulierten Vergleichswerts. Nach dem Spiel sollten die Spieler die Kundennachfrage zeichnen; die meisten zeichneten eine Welle.") },
        { type: "callout", reading: true, text: x(
          "The wave was made inside the chain. The players saw it outside, in the customer.",
          "Vala u krijua brenda zinxhirit. Lojtarët e panë jashtë tij, te klienti.",
          "Die Welle entstand in der Kette. Die Spieler sahen sie außerhalb, beim Kunden.") },
      ],
      note: x(
        "Sterman (1989): 11 trials (44 players) kept from 48 played over four years, by MIT students and executives; figures are averages of the 11. A board game, not company data.",
        "Sterman (1989): 11 prova (44 lojtarë) të mbajtura nga 48 të luajtura gjatë katër vjetëve, nga studentë të MIT-it dhe drejtues; shifrat janë mesatare të 11 provave. Një lojë tabele, jo të dhëna kompanish.",
        "Sterman (1989): 11 Runden (44 Spieler) aus 48 über vier Jahre, gespielt von MIT-Studierenden und Führungskräften; die Zahlen sind Mittelwerte der 11. Ein Brettspiel, keine Unternehmensdaten."),
      source: ["bullwhip-sterman-1989"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("Further from", "Sa më larg", "Je weiter"), x("the customer, wilder", "klientit, aq më e egër", "vom Kunden, desto wilder")],
      lead: x(
        "Sterman measured how the swing grew from link to link. Customer orders rose from 4 to 8 cases a week. By the time the change reached the factory, its orders peaked at 32 on average, more than twice the retailer's peak.",
        "Sterman-i mati si rritej lëkundja nga hallka në hallkë. Porositë e klientëve u rritën nga 4 në 8 kuti në javë. Kur ndryshimi arriti te fabrika, porositë e saj arritën mesatarisht kulmin 32, më shumë se dyfishi i kulmit te shitësi me pakicë.",
        "Sterman maß, wie der Ausschlag von Glied zu Glied wuchs. Die Kundenbestellungen stiegen von 4 auf 8 Kisten pro Woche. Als die Änderung die Fabrik erreichte, lag deren Spitze im Schnitt bei 32, mehr als doppelt so hoch wie im Einzelhandel."),
      blocks: [
        { type: "columns", max: 35, height: 110, source: ["bullwhip-sterman-1989"],
          label: x("Peak orders, cases a week, Beer Game (1989)", "Kulmi i porosive, kuti në javë, Beer Game (1989)", "Spitzenbestellung, Kisten pro Woche, Beer Game (1989)"),
          items: [
            { k: x("Customer", "Klienti", "Kunde"), v: 8, n: "8" },
            { k: x("Retailer", "Pakicë", "Einzelhandel"), v: 15, n: "15" },
            { k: x("Wholesaler", "Shumicë", "Großhandel"), v: 19, n: "19" },
            { k: x("Distributor", "Shpërndarësi", "Vertrieb"), v: 27, n: "27" },
            { k: x("Factory", "Fabrika", "Fabrik"), v: 32, n: "32", alert: true },
          ] },
        { type: "p", text: x(
          "The variance of orders grew the same way: 1.6 for the customer, 13 at the retailer, 72 at the factory. The peaks also came later upstream: week 16 at the retailer, week 20 at the factory.",
          "Varianca e porosive u rrit në të njëjtën mënyrë: 1,6 te klienti, 13 te shitësi me pakicë, 72 te fabrika. Edhe kulmet erdhën më vonë sa më lart në zinxhir: java 16 te shitësi me pakicë, java 20 te fabrika.",
          "Die Varianz der Bestellungen wuchs genauso: 1,6 beim Kunden, 13 im Einzelhandel, 72 in der Fabrik. Auch die Spitzen kamen weiter oben später: Woche 16 im Einzelhandel, Woche 20 in der Fabrik.") },
        { type: "callout", reading: true, text: x(
          "No one upstream sees the customer. Each link sees only the orders of the link below, and those already carry the swings of everyone in between.",
          "Askush lart në zinxhir nuk e sheh klientin. Çdo hallkë sheh vetëm porositë e hallkës poshtë saj, dhe ato mbartin tashmë lëkundjet e të gjithëve mes tyre.",
          "Weiter oben sieht niemand den Kunden. Jedes Glied sieht nur die Bestellungen des Glieds darunter, und die tragen schon die Ausschläge aller dazwischen.") },
      ],
      note: x(
        "Averages of the 11 trials (Sterman 1989, Table 3). Sterman's amplification compares the rise at the factory, 4 to 32, with the rise in demand, 4 to 8: 700%.",
        "Mesatare të 11 provave (Sterman 1989, tabela 3). Përforcimi i Sterman-it krahason rritjen te fabrika, nga 4 në 32, me rritjen e kërkesës, nga 4 në 8: 700%.",
        "Mittelwerte der 11 Runden (Sterman 1989, Tabelle 3). Stermans Verstärkung vergleicht den Anstieg in der Fabrik, von 4 auf 32, mit dem der Nachfrage, von 4 auf 8: 700 %."),
      source: ["bullwhip-sterman-1989"],
    },
    {
      id: "model", more: "mistakes-get-lost-between-departments",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Four causes", "Katër shkaqe", "Vier Ursachen"), x("and a fifth", "dhe një i pestë", "und eine fünfte")],
      lead: x(
        "Lee, Padmanabhan and Whang (1997) defined the effect: orders to the supplier vary more than sales to the buyer, and the distortion grows upstream. Their models show it arises even when every member orders rationally, from four causes.",
        "Lee, Padmanabhan dhe Whang (1997) e përkufizuan efektin: porositë te furnitori ndryshojnë më shumë se shitjet te blerësi, dhe shtrembërimi rritet lart në zinxhir. Modelet e tyre tregojnë se ai lind edhe kur çdo anëtar porosit në mënyrë racionale, nga katër shkaqe.",
        "Lee, Padmanabhan und Whang (1997) definierten den Effekt: Bestellungen beim Lieferanten schwanken stärker als die Verkäufe an den Käufer, und die Verzerrung wächst nach oben. Ihre Modelle zeigen, dass er auch bei rationalem Bestellen entsteht, aus vier Ursachen."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("Demand signal processing", "Leximi i sinjalit të kërkesës", "Verarbeitung von Nachfragesignalen"), p: x("A good week is read as a new forecast, and the order overshoots; long lead times make it worse.", "Një javë e mirë lexohet si parashikim i ri, dhe porosia e kalon masën; afatet e gjata të furnizimit e përkeqësojnë.", "Eine gute Woche gilt als neue Prognose, die Bestellung schießt über; lange Lieferzeiten verschärfen das.") },
          { h: x("Rationing game", "Loja e racionimit", "Rationierungsspiel"), p: x("When supply is short, buyers order more than they need to secure their share.", "Kur malli mungon, blerësit porosisin më shumë se u duhet për të siguruar pjesën e tyre.", "Ist Ware knapp, bestellen Käufer mehr als nötig, um ihren Anteil zu sichern.") },
          { h: x("Order batching", "Porositë në grup", "Sammelbestellungen"), p: x("Ordering costs and periodic reviews bunch many weeks into one order.", "Kostot e porosisë dhe kontrollet periodike mbledhin shumë javë në një porosi.", "Bestellkosten und periodische Prüfung bündeln viele Wochen in einer Bestellung.") },
          { h: x("Price variations", "Ndryshimet e çmimit", "Preisschwankungen"), p: x("Promotions bring buying forward, then a lull follows.", "Promocionet e sjellin blerjen më herët, pastaj vjen një qetësi.", "Aktionen ziehen Käufe vor, danach folgt eine Flaute.") },
        ] },
        { type: "p", text: x(
          "Sterman's players added a fifth: they underweighted the supply line, the goods ordered but not yet received. The mean weight they gave it was 0.34, where 1 would be right; only 5 of 44 counted more than two-thirds of it.",
          "Lojtarët e Sterman-it shtuan një të pestë: i dhanë pak peshë linjës së furnizimit, mallit të porositur por ende të pambërritur. Pesha mesatare që i dhanë ishte 0,34, kur e drejta do të ishte 1; vetëm 5 nga 44 llogaritën më shumë se dy të tretat e saj.",
          "Stermans Spieler fügten eine fünfte hinzu: Sie gewichteten die Lieferpipeline zu gering, also bestellte, noch nicht eingetroffene Ware. Das mittlere Gewicht war 0,34, richtig wäre 1; nur 5 von 44 berücksichtigten mehr als zwei Drittel davon.") },
        { type: "callout", reading: true, text: x(
          "Four causes sit in how the chain is built, the fifth in how people read it. A manager can work on both.",
          "Katër shkaqe qëndrojnë te mënyra si është ndërtuar zinxhiri, i pesti te mënyra si e lexojnë njerëzit. Një menaxher mund të punojë për të dyja.",
          "Vier Ursachen stecken im Aufbau der Kette, die fünfte darin, wie Menschen sie lesen. Eine Führungskraft kann an beidem arbeiten.") },
      ],
      note: x(
        "Causes as Lee et al. (1997) name them; calling Sterman's finding a fifth is the editors'. Forrester (1961) showed the effect in case studies, as Lee et al. note. S&OP is in No. 59, forecasting in No. 77.",
        "Shkaqet siç i emërtojnë Lee et al. (1997); ta quajmë të pestë gjetjen e Sterman-it është zgjedhje e redaksisë. Forrester (1961) e tregoi efektin në studime rastesh, siç shënojnë Lee et al. S&OP është te Nr. 59, parashikimi te Nr. 77.",
        "Ursachen, wie Lee et al. (1997) sie nennen; Stermans Befund die fünfte zu nennen, ist Sache der Redaktion. Forrester (1961) zeigte den Effekt in Fallstudien, wie Lee et al. vermerken. S&OP steht in Nr. 59, Prognose in Nr. 77."),
      source: ["bullwhip-lee-1997", "bullwhip-sterman-1989"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("Even when", "Edhe kur", "Selbst bei"), x("demand is known", "kërkesa dihet", "bekannter Nachfrage")],
      lead: x(
        "Croson and Donohue (2006) removed the operational causes: no batching, no price changes, and demand known to all: any whole number from 0 to 8 cases, written on the board. 44 students played in 11 teams; 44 more saw all four stocks on screen.",
        "Croson dhe Donohue (2006) i hoqën shkaqet operacionale: pa porosi në grup, pa ndryshime çmimi, dhe me kërkesë të njohur për të gjithë: çdo numër i plotë nga 0 në 8 kuti, i shkruar në tabelë. 44 studentë luajtën në 11 ekipe; 44 të tjerë i shihnin në ekran të katër stoqet.",
        "Croson und Donohue (2006) nahmen die betrieblichen Ursachen heraus: keine Sammelbestellungen, keine Preisänderungen und eine allen bekannte Nachfrage: jede ganze Zahl von 0 bis 8 Kisten, an der Tafel notiert. 44 Studierende spielten in 11 Teams; 44 weitere sahen alle vier Bestände am Bildschirm."),
      blocks: [
        { type: "dumbbell", from: x("Base case", "Rasti bazë", "Grundfall"), to: x("Stock shown", "Stoku i dukshëm", "Bestand sichtbar"), min: 0, max: 60, source: ["bullwhip-croson-2006"],
          label: x("Variance of orders by role, two experiments (2006)", "Varianca e porosive sipas rolit, dy eksperimente (2006)", "Varianz der Bestellungen nach Rolle, zwei Experimente (2006)"),
          rows: [
            { k: x("Retailer", "Pakicë", "Einzelhandel"), a: 10.73, an: dec("10.7"), b: 10.13, bn: dec("10.1") },
            { k: x("Wholesaler", "Shumicë", "Großhandel"), a: 18.56, an: dec("18.6"), b: 16.98, bn: dec("17.0") },
            { k: x("Distributor", "Shpërndarësi", "Vertrieb"), a: 47.83, an: dec("47.8"), b: 23.18, bn: dec("23.2"), alert: true },
            { k: x("Manufacturer", "Prodhuesi", "Hersteller"), a: 57.95, an: dec("58.0"), b: 36.37, bn: dec("36.4") },
          ] },
        { type: "p", text: x(
          "Customer demand had a variance of 5.33; every role ordered with more. All 44 players in the first study gave less weight to goods on order than to goods in stock. With stock in view, the distributor's variance roughly halved; the retailer's hardly moved.",
          "Kërkesa e klientëve kishte variancë 5,33; çdo rol porositi me më shumë. Të 44 lojtarët e studimit të parë i dhanë më pak peshë mallit të porositur se mallit në stok. Me stokun në pamje, varianca e shpërndarësit ra afërsisht përgjysmë; ajo e shitësit me pakicë mezi lëvizi.",
          "Die Kundennachfrage hatte eine Varianz von 5,33; jede Rolle bestellte mit mehr. Alle 44 Spieler der ersten Studie gewichteten bestellte Ware geringer als Ware im Lager. Mit sichtbaren Beständen halbierte sich die Varianz beim Vertrieb ungefähr; im Einzelhandel bewegte sie sich kaum.") },
        { type: "callout", reading: true, text: x(
          "Knowing demand did not stop the swing. Seeing the stock below helped the links furthest from the customer most.",
          "Njohja e kërkesës nuk e ndali lëkundjen. Të parit e stokut më poshtë ndihmoi më shumë hallkat më larg klientit.",
          "Die Nachfrage zu kennen, stoppte den Ausschlag nicht. Den Bestand weiter unten zu sehen, half den Gliedern am weitesten vom Kunden am meisten.") },
      ],
      note: x(
        "Average variance of orders by role (Table 1), undergraduates in a lab, 2002. Five teams of logistics professionals showed the same pattern, less strongly.",
        "Varianca mesatare e porosive sipas rolit (tabela 1), studentë në laborator, 2002. Pesë ekipe profesionistësh të logjistikës treguan të njëjtin model, më pak të fortë.",
        "Mittlere Varianz der Bestellungen nach Rolle (Tabelle 1), Studierende im Labor, 2002. Fünf Teams aus Logistikfachleuten zeigten dasselbe Muster, schwächer."),
      source: ["bullwhip-croson-2006"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie es gemessen wird"),
      title: [x("Orders against", "Porositë përballë", "Bestellungen gegen"), x("demand", "kërkesës", "Nachfrage")],
      lead: x(
        "Both studies measure the effect the same way: the variance of the orders a link places, against the variance of the demand it receives. A ratio above 1 means the link amplifies.",
        "Të dy studimet e matin efektin njësoj: varianca e porosive që lëshon një hallkë, përballë variancës së kërkesës që merr. Një raport mbi 1 do të thotë që hallka e përforcon lëkundjen.",
        "Beide Studien messen den Effekt gleich: die Varianz der Bestellungen, die ein Glied aufgibt, gegen die Varianz der Nachfrage, die es erhält. Ein Verhältnis über 1 heißt, das Glied verstärkt."),
      blocks: [
        { type: "steps", items: [
          { h: x("Same weeks", "Të njëjtat javë", "Dieselben Wochen"), p: x("Demand received and orders placed, for one item, over the same period.", "Kërkesa e marrë dhe porositë e lëshuara, për një artikull, në të njëjtën periudhë.", "Erhaltene Nachfrage und aufgegebene Bestellungen, für einen Artikel, im selben Zeitraum.") },
          { h: x("Two variances", "Dy varianca", "Zwei Varianzen"), p: x("One for demand, one for orders, in the same units.", "Një për kërkesën, një për porositë, me të njëjtat njësi.", "Eine für die Nachfrage, eine für die Bestellungen, in denselben Einheiten.") },
          { h: x("Divide", "Pjesëto", "Teilen"), p: x("Orders over demand; repeat at each link where data exist.", "Porositë me kërkesën; përsërite te çdo hallkë ku ka të dhëna.", "Bestellungen durch Nachfrage; an jedem Glied mit Daten wiederholen.") },
        ] },
        { type: "example", label: x("Hypothetical example, one item over eight weeks", "Shembull hipotetik, një artikull gjatë tetë javëve", "Hypothetisches Beispiel, ein Artikel über acht Wochen"), rows: [
          { k: x("Demand", "Kërkesa", "Nachfrage"), v: x("36 to 44 a week, average 40, variance 8", "36 deri 44 në javë, mesatarja 40, varianca 8", "36 bis 44 pro Woche, Mittel 40, Varianz 8") },
          { k: x("Orders", "Porositë", "Bestellungen"), v: x("0, 40 or 80 a week, average 40, variance 1,200", "0, 40 ose 80 në javë, mesatarja 40, varianca 1.200", "0, 40 oder 80 pro Woche, Mittel 40, Varianz 1.200") },
          { k: x("Ratio", "Raporti", "Verhältnis"), v: x("1,200 ÷ 8 = 150", "1.200 ÷ 8 = 150", "1.200 ÷ 8 = 150") },
        ], text: x("The same 40 a week reaches the supplier as a far noisier signal. The item and its figures are invented.", "Të njëjtat 40 në javë i mbërrijnë furnitorit si sinjal shumë më i zhurmshëm. Artikulli dhe shifrat e tij janë të shpikura.", "Dieselben 40 pro Woche kommen beim Lieferanten als viel unruhigeres Signal an. Artikel und Zahlen sind erfunden.") },
      ],
      note: x(
        "The steps and the example are the editors', on the definition of Lee et al. (1997) and the variances of Croson & Donohue (2006). Variances of the eight weeks, divided by 8.",
        "Hapat dhe shembulli janë të redaksisë, mbi përkufizimin e Lee et al. (1997) dhe variancat e Croson & Donohue (2006). Variancat e tetë javëve, të pjesëtuara me 8.",
        "Schritte und Beispiel stammen von der Redaktion, gestützt auf die Definition von Lee et al. (1997) und die Varianzen bei Croson & Donohue (2006). Varianzen der acht Wochen, geteilt durch 8."),
      source: ["bullwhip-lee-1997", "bullwhip-croson-2006"],
    },
    {
      id: "tool", tool: "/tools/inventory-abc/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The order-swing", "Karta e lëkundjes", "Die Karte zum"), x("card", "së porosive", "Bestellausschlag")],
      lead: x(
        "One card per item and link, filled in with the person who places the orders. The inventory tool sorts items by how steady their demand is and sets reorder points from it.",
        "Një kartë për çdo artikull dhe hallkë, e plotësuar me personin që lëshon porositë. Mjeti i stokut i rendit artikujt sipas qëndrueshmërisë së kërkesës dhe prej saj cakton pikat e riporositjes.",
        "Eine Karte je Artikel und Glied, ausgefüllt mit der Person, die bestellt. Das Bestandswerkzeug ordnet Artikel danach, wie stetig ihre Nachfrage ist, und setzt daraus Meldebestände."),
      blocks: [
        { type: "form", items: [
          { h: x("Item and link", "Artikulli dhe hallka", "Artikel und Glied"), hint: x("who orders from whom; the weeks compared", "kush porosit te kush; javët që krahasohen", "wer bei wem bestellt; die verglichenen Wochen") },
          { h: x("The ratio", "Raporti", "Das Verhältnis"), hint: x("variance of orders ÷ variance of demand", "varianca e porosive ÷ varianca e kërkesës", "Varianz der Bestellungen ÷ Varianz der Nachfrage") },
          { h: x("On order now", "Të porositura tani", "Jetzt bestellt"), hint: x("ordered, not yet received; is it counted before the next order?", "të porositura, ende të pambërritura; a llogariten para porosisë së radhës?", "bestellt, nicht eingetroffen; vor der nächsten Bestellung gezählt?") },
          { h: x("Which cause", "Cili shkak", "Welche Ursache"), hint: x("forecast update, batching, promotion, shortage gaming, supply line ignored", "përditësimi i parashikimit, porositë në grup, promocioni, loja e mungesës, linja e furnizimit e harruar", "Prognoseanpassung, Sammelbestellung, Aktion, Knappheitsspiel, Pipeline übersehen") },
          { h: x("One change, and when we measure again", "Një ndryshim, dhe kur matim sërish", "Eine Änderung und wann wir wieder messen"), hint: x("e.g. share sales data, order smaller and more often, allocate by past sales", "p.sh. ndaj të dhënat e shitjeve, porosit më pak e më shpesh, shpërndaj sipas shitjeve të kaluara", "z. B. Verkaufsdaten teilen, kleiner und öfter bestellen, nach früheren Verkäufen zuteilen"), lines: 2 },
        ] },
      ],
      note: x(
        "Our proposal, built on the causes and counter-measures in Lee et al. (1997) and the supply line in Sterman (1989).",
        "Propozimi ynë, i ndërtuar mbi shkaqet dhe kundërmasat te Lee et al. (1997) dhe mbi linjën e furnizimit te Sterman (1989).",
        "Unser Vorschlag, gestützt auf Ursachen und Gegenmaßnahmen bei Lee et al. (1997) und die Lieferpipeline bei Sterman (1989)."),
      source: ["bullwhip-lee-1997", "bullwhip-sterman-1989"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
