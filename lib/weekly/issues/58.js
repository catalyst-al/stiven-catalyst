// Management Review, No. 58: Little's law: work in process, time and throughput. Block: KPI.
// Facts and their sources: docs/revista/management-review-nr-58.md.
import { x } from "../common.js";

export default {
  number: 58,
  block: "kpi",
  date: x("November 2026", "Nëntor 2026", "November 2026"),
  theme: [x("Little's law:", "Ligji i Little-it:", "Littles Gesetz:"), x("work in process, time and throughput", "puna në proces, koha dhe ritmi", "Bestand, Zeit und Durchsatz")],
  sub: x(
    "A student's question in Cleveland, a four-step line with and without variability, three numbers that move together, what happens as queues grow, how to count a queue, and a card that turns open work into time.",
    "Pyetja e një studenti në Cleveland, një linjë me katër hapa me dhe pa ndryshueshmëri, tre numra që lëvizin bashkë, çfarë ndodh kur radhët rriten, si numërohet një radhë, dhe një kartë që e kthen punën e hapur në kohë.",
    "Die Frage eines Studenten in Cleveland, eine Linie mit vier Schritten mit und ohne Schwankung, drei Zahlen, die sich gemeinsam bewegen, was geschieht, wenn Schlangen wachsen, wie man eine Schlange zählt, und eine Karte, die offene Arbeit in Zeit umrechnet."),
  seo: x(
    "Little's law: the 1961 proof, work in process, throughput and lead time, Hopp and Spearman's Penny Fab, Kanban teams, and a card for one queue.",
    "Ligji i Little-it: prova e 1961, puna në proces, ritmi dhe koha e kalimit, Penny Fab i Hopp-it dhe Spearman-it, ekipet Kanban dhe një kartë.",
    "Littles Gesetz: der Beweis von 1961, Bestand, Durchsatz und Durchlaufzeit, die Penny Fab von Hopp und Spearman, Kanban-Teams und eine Karte."),
  feature: x(
    "Issue 58 starts with the student who asked John Little to prove a queuing formula in general, follows Wallace Hopp and Mark Spearman's four-step Penny Fab with and without variability, sets out what the three numbers of the law mean for a manager, looks at Kanban teams, emergency departments and a server under load, shows how to measure a queue over a period, and ends with a card that turns a count of open work into a lead time.",
    "Numri 58 nis me studentin që i kërkoi John Little-it ta provonte në përgjithësi një formulë të radhëve, ndjek Penny Fab-in me katër hapa të Wallace Hopp-it dhe Mark Spearman-it me dhe pa ndryshueshmëri, shtjellon çfarë kuptimi kanë për një menaxher tre numrat e ligjit, shikon ekipet Kanban, urgjencat dhe një server nën ngarkesë, tregon si matet një radhë gjatë një periudhe, dhe mbyllet me një kartë që e kthen numërimin e punës së hapur në kohë kalimi.",
    "Ausgabe 58 beginnt mit dem Studenten, der John Little bat, eine Warteschlangenformel allgemein zu beweisen, folgt der Penny Fab von Wallace Hopp und Mark Spearman mit vier Schritten, mit und ohne Schwankung, zeigt, was die drei Zahlen des Gesetzes für eine Führungskraft bedeuten, betrachtet Kanban-Teams, Notaufnahmen und einen Server unter Last, zeigt, wie man eine Schlange über einen Zeitraum misst, und endet mit einer Karte, die eine Zählung offener Arbeit in eine Durchlaufzeit umrechnet."),
  figure: { n: x("14 h", "14 orë", "14 Std."), by: "Hopp & Spearman, Penny Fab", t: x(
    "instead of 8: the time a job spends in a four-step line that holds four jobs, once the process times vary.",
    "në vend të 8: koha që kalon një punë në një linjë me katër hapa që mban katër punë, kur kohët e procesit ndryshojnë.",
    "statt 8: so lange bleibt ein Auftrag in einer Linie mit vier Schritten und vier Aufträgen, sobald die Bearbeitungszeiten schwanken.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("Prove it in general", "Provoje në përgjithësi", "Allgemein beweisen") },
    { page: "numbers", kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: x("Same law, longer wait", "I njëjti ligj, pritje më e gjatë", "Gleiches Gesetz, längeres Warten") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("From open work to lead time", "Nga puna e hapur te koha e kalimit", "Vom offenen Bestand zur Durchlaufzeit") },
  ],
  sources: ["littlelaw-little-1961", "littlelaw-little-2011", "littlelaw-hopp-spearman-2000", "littlelaw-tafoya-2008", "littlelaw-sjoberg-2018", "littlelaw-conwip-1990"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Most reports show how much a team finished. Few show how much is still waiting, and fewer still connect the two with how long a customer waits. Little's law does: three averages, one equation, and no assumptions about how the work is done.",
        "Shumica e raporteve tregojnë sa mbaroi një ekip. Pak tregojnë sa punë është ende në pritje, dhe edhe më pak i lidhin këto të dyja me sa pret klienti. Ligji i Little-it i lidh: tri mesatare, një barazim, dhe asnjë supozim për mënyrën si bëhet puna.",
        "Die meisten Berichte zeigen, wie viel ein Team erledigt hat. Wenige zeigen, wie viel noch wartet, und noch weniger verbinden beides damit, wie lange ein Kunde wartet. Littles Gesetz tut es: drei Mittelwerte, eine Gleichung und keine Annahmen darüber, wie die Arbeit gemacht wird."),
      body: x(
        "In 1961 John Little proved a formula that teachers of queuing had met again and again: the average number of items in a system equals the rate at which they arrive times the average time each one stays. In Hopp and Spearman's four-step Penny Fab the law holds with and without variability, but the same work in process buys less output. In five Kanban teams, less work in process went with shorter lead times, and also with lower productivity. The card at the end turns a count of open work into a lead time.",
        "Në 1961, John Little provoi një formulë që mësuesit e teorisë së radhëve e kishin hasur vazhdimisht: numri mesatar i njësive në një sistem është sa ritmi me të cilin ato mbërrijnë herë kohën mesatare që qëndron secila. Te Penny Fab-i me katër hapa i Hopp-it dhe Spearman-it, ligji vlen me dhe pa ndryshueshmëri, por e njëjta punë në proces jep më pak rezultat. Në pesë ekipe Kanban, më pak punë në proces shkoi bashkë me kohë më të shkurtra kalimi, por edhe me produktivitet më të ulët. Karta në fund e kthen numërimin e punës së hapur në kohë kalimi.",
        "1961 bewies John Little eine Formel, der Lehrende der Warteschlangentheorie immer wieder begegnet waren: Die mittlere Zahl der Einheiten in einem System ist gleich der Rate, mit der sie ankommen, mal der mittleren Zeit, die jede bleibt. In der Penny Fab von Hopp und Spearman mit vier Schritten gilt das Gesetz mit und ohne Schwankung, doch derselbe Bestand bringt weniger Ausstoß. In fünf Kanban-Teams ging weniger Bestand mit kürzeren Durchlaufzeiten einher, aber auch mit geringerer Produktivität. Die Karte am Ende rechnet eine Zählung offener Arbeit in eine Durchlaufzeit um."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("Prove it", "Provoje", "Allgemein"), x("in general", "në përgjithësi", "beweisen")],
      lead: x(
        "Around 1960 John Little taught queuing at the Case Institute of Technology in Cleveland. He told his class that one formula kept turning up in model after model and seemed very general. After class a student, Sid Hess, asked how hard it would be to prove it in general. Little's answer:",
        "Rreth vitit 1960, John Little jepte mësim për radhët në Case Institute of Technology në Cleveland. I tha klasës se një formulë dilte vazhdimisht, model pas modeli, dhe dukej shumë e përgjithshme. Pas mësimit, një student, Sid Hess, e pyeti sa e vështirë do të ishte ta provonte në përgjithësi. Përgjigjja e Little-it:",
        "Um 1960 unterrichtete John Little Warteschlangentheorie am Case Institute of Technology in Cleveland. Er sagte seiner Klasse, eine Formel tauche in einem Modell nach dem anderen auf und wirke sehr allgemein. Nach der Stunde fragte ein Student, Sid Hess, wie schwer es wäre, sie allgemein zu beweisen. Littles Antwort:"),
      blocks: [
        { type: "quote", text: x(
          "I guess it shouldn't be too hard.",
          "Mendoj se s'duhet të jetë shumë e vështirë.",
          "Ich schätze, das sollte nicht allzu schwer sein.") },
        { type: "cards", cols: 3, items: [
          { h: x("L", "L", "L"), p: x("the average number of items in the system, waiting or being served", "numri mesatar i njësive në sistem, në pritje ose duke u shërbyer", "die mittlere Zahl der Einheiten im System, wartend oder in Bearbeitung") },
          { h: x("λ", "λ", "λ"), p: x("the average rate at which items arrive, per hour or per day", "ritmi mesatar me të cilin mbërrijnë njësitë, në orë ose në ditë", "die mittlere Rate, mit der Einheiten ankommen, je Stunde oder Tag") },
          { h: x("W", "W", "W"), p: x("the average time an item spends in the system", "koha mesatare që kalon një njësi në sistem", "die mittlere Zeit, die eine Einheit im System verbringt") },
        ] },
        { type: "p", text: x(
          "“Famous last words,” he wrote fifty years later. The proof, worked out over summers on Nantucket, appeared in Operations Research in 1961: L = λW, whatever the pattern of arrivals, the service times or the order of service. Little's own explanation is simple: a person standing in a queue can be counted, and at the same time is collecting minutes of waiting.",
          "“Fjalë të fundit të famshme,” shkroi ai pesëdhjetë vjet më vonë. Prova, e punuar gjatë verëve në Nantucket, doli te Operations Research në 1961: L = λW, cilado qoftë mënyra si mbërrijnë njësitë, kohët e shërbimit apo radha e shërbimit. Shpjegimi i vetë Little-it është i thjeshtë: një njeri që qëndron në radhë mund të numërohet, dhe në të njëjtën kohë po mbledh minuta pritjeje.",
          "„Berühmte letzte Worte“, schrieb er fünfzig Jahre später. Der Beweis, in Sommern auf Nantucket ausgearbeitet, erschien 1961 in Operations Research: L = λW, gleich wie die Ankünfte verteilt sind, wie lange die Bedienung dauert und in welcher Reihenfolge bedient wird. Littles eigene Erklärung ist einfach: Wer in einer Schlange steht, wird mitgezählt und sammelt zugleich Minuten des Wartens.") },
        { type: "callout", reading: true, text: x(
          "The law does not say how to shorten a queue. It says that the queue, the pace and the wait cannot be managed one at a time.",
          "Ligji nuk të thotë si ta shkurtosh radhën. Të thotë se radha, ritmi dhe pritja nuk drejtohen veç e veç.",
          "Das Gesetz sagt nicht, wie man eine Schlange verkürzt. Es sagt, dass sich Schlange, Tempo und Wartezeit nicht einzeln steuern lassen.") },
      ],
      note: x(
        "The story and the quotes come from Little's own account for the law's 50th anniversary (2011). The 1961 proof assumes stationary processes; in 2011 Little also proves the law for any finite period.",
        "Rrëfimi dhe citimet vijnë nga rrëfimi i vetë Little-it për 50-vjetorin e ligjit (2011). Prova e 1961 supozon procese stacionare; në 2011, Little e provon ligjin edhe për çdo periudhë të fundme.",
        "Geschichte und Zitate stammen aus Littles eigenem Rückblick zum 50. Jahrestag des Gesetzes (2011). Der Beweis von 1961 setzt stationäre Prozesse voraus; 2011 beweist Little das Gesetz auch für jeden endlichen Zeitraum."),
      source: ["littlelaw-little-2011", "littlelaw-little-1961"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("Same law,", "I njëjti ligj,", "Gleiches Gesetz,"), x("longer wait", "pritje më e gjatë", "längeres Warten")],
      lead: x(
        "Wallace Hopp and Mark Spearman teach the law with the Penny Fab: four identical steps in a row, two hours each per penny. A job needs eight hours of work; the line can finish one every two hours. New jobs enter only to keep a set number inside.",
        "Wallace Hopp dhe Mark Spearman e mësojnë ligjin me Penny Fab-in: katër hapa të njëjtë njëri pas tjetrit, secili dy orë për monedhë. Një punë do tetë orë punë; linja mund të mbarojë një çdo dy orë. Punë të reja hyjnë vetëm sa për të mbajtur një numër të caktuar brenda.",
        "Wallace Hopp und Mark Spearman lehren das Gesetz mit der Penny Fab: vier gleiche Schritte hintereinander, je zwei Stunden pro Münze. Ein Auftrag braucht acht Stunden Arbeit; die Linie schafft alle zwei Stunden einen. Neue Aufträge kommen nur hinein, um eine feste Zahl in der Linie zu halten."),
      blocks: [
        { type: "dumbbell", from: x("No variability", "Pa ndryshueshmëri", "Ohne Schwankung"), to: x("With variability", "Me ndryshueshmëri", "Mit Schwankung"), min: 0, max: 20, rowH: 26, source: ["littlelaw-tafoya-2008"],
          label: x("Hours a job spends in the Penny Fab, by jobs in the line", "Orët që kalon një punë në Penny Fab, sipas punëve në linjë", "Stunden eines Auftrags in der Penny Fab, nach Aufträgen in der Linie"),
          rows: [
            { k: x("2 jobs", "2 punë", "2 Aufträge"), a: 8, an: "8", b: 10, bn: "10" },
            { k: x("4 jobs", "4 punë", "4 Aufträge"), a: 8, an: "8", b: 14, bn: "14", alert: true },
            { k: x("6 jobs", "6 punë", "6 Aufträge"), a: 12, an: "12", b: 18, bn: "18" },
          ] },
        { type: "p", text: x(
          "Without variability, four jobs fill the line: one leaves every two hours, each after eight; more jobs only add waiting. With variable process times, four jobs bring out 0.286 an hour instead of 0.5, each after 14 hours. In every row, output per hour times hours inside gives back the number of jobs.",
          "Pa ndryshueshmëri, katër punë e mbushin linjën: del një çdo dy orë, secila pas tetë orësh; punët e tjera shtojnë vetëm pritje. Kur kohët e procesit ndryshojnë, katër punë nxjerrin 0,286 në orë në vend të 0,5, secila pas 14 orësh. Në çdo rresht, rezultati në orë herë orët brenda jep përsëri numrin e punëve.",
          "Ohne Schwankung füllen vier Aufträge die Linie: Alle zwei Stunden geht einer hinaus, jeder nach acht; weitere bringen nur Warten. Schwanken die Bearbeitungszeiten, bringen vier Aufträge 0,286 pro Stunde statt 0,5, jeder nach 14 Stunden. In jeder Zeile ergibt Ausstoß pro Stunde mal Stunden in der Linie wieder die Zahl der Aufträge.") },
        { type: "callout", reading: true, text: x(
          "Variability does not break the law. It raises the price: the same output needs more work in process, and every extra job is paid for in waiting.",
          "Ndryshueshmëria nuk e prish ligjin. E rrit çmimin: i njëjti rezultat kërkon më shumë punë në proces, dhe çdo punë më shumë paguhet me pritje.",
          "Schwankung bricht das Gesetz nicht. Sie erhöht den Preis: Derselbe Ausstoß braucht mehr Bestand, und jeder zusätzliche Auftrag wird mit Warten bezahlt.") },
      ],
      note: x(
        "A teaching example, not measured data: the Penny Fab tables shown by two Intel engineers in 2008, after Hopp and Spearman. Eight hours × 0.5 jobs an hour = the four jobs that fill the line.",
        "Shembull mësimor, jo të dhëna të matura: tabelat e Penny Fab-it që treguan dy inxhinierë të Intel-it në 2008, sipas Hopp-it dhe Spearman-it. Tetë orë × 0,5 punë në orë = katër punët që e mbushin linjën.",
        "Ein Lehrbeispiel, keine gemessenen Daten: die Penny-Fab-Tabellen, die zwei Intel-Ingenieure 2008 zeigten, nach Hopp und Spearman. Acht Stunden × 0,5 Aufträge pro Stunde = die vier Aufträge, die die Linie füllen."),
      source: ["littlelaw-tafoya-2008", "littlelaw-hopp-spearman-2000"],
    },
    {
      id: "model",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Three numbers,", "Tre numra,", "Drei Zahlen,"), x("one equation", "një barazim", "eine Gleichung")],
      lead: x(
        "In operations, Hopp and Spearman put output first: throughput equals work in process divided by cycle time, the time a job spends between release and the end of its route. Little explains why: for an operating manager, output is usually the reason the operation exists, and it is often set from outside, by orders or a forecast.",
        "Në operacione, Hopp-i dhe Spearman-i e vënë rezultatin të parin: ritmi është sa puna në proces pjesëtuar me kohën e kalimit, kohën që kalon një punë nga lëshimi deri në fund të rrugës së saj. Little-i shpjegon pse: për një menaxher operacionesh, rezultati është zakonisht arsyeja pse ekziston operacioni, dhe shpesh caktohet nga jashtë, nga porositë ose nga një parashikim.",
        "In der Produktion stellen Hopp und Spearman den Ausstoß nach vorn: Durchsatz ist Bestand geteilt durch Durchlaufzeit, die Zeit eines Auftrags von der Freigabe bis zum Ende seines Wegs. Little erklärt, warum: Für eine Führungskraft im Betrieb ist der Ausstoß meist der Grund, warum es den Betrieb gibt, und er wird oft von außen vorgegeben, durch Aufträge oder eine Prognose."),
      blocks: [
        { type: "cards", cols: 3, items: [
          { h: x("Know two, find the third", "Di dy, gjej të tretin", "Zwei kennen, die dritte finden"), p: x("The most common use: one number is hard to measure, the other two are not.", "Përdorimi më i zakonshëm: njëri numër matet me vështirësi, dy të tjerët jo.", "Die häufigste Anwendung: Eine Zahl ist schwer zu messen, die anderen beiden nicht.") },
          { h: x("They move together", "Lëvizin bashkë", "Sie hängen zusammen"), p: x("More output, shorter waits and less stock cannot be chosen one at a time.", "Më shumë rezultat, pritje më të shkurtra dhe më pak stok nuk zgjidhen veç e veç.", "Mehr Ausstoß, kürzere Wartezeiten und weniger Bestand lassen sich nicht einzeln wählen.") },
          { h: x("Output fixed", "Rezultati i caktuar", "Ausstoß vorgegeben"), p: x("Then the only way to cut work in process is to cut the time each item waits.", "Atëherë e vetmja rrugë për ta ulur punën në proces është të ulësh kohën që pret çdo njësi.", "Dann lässt sich der Bestand nur senken, indem man die Wartezeit jeder Einheit senkt.") },
        ] },
        { type: "p", text: x(
          "Each of the three numbers is a measure of performance on its own, Little writes, and managers should consider collecting and displaying all three for whatever stream of items they manage. If something is amiss, it will most likely show in one of them.",
          "Secili nga tre numrat është vetë një masë e performancës, shkruan Little-i, dhe menaxherët duhet të mendojnë t'i mbledhin dhe t'i shfaqin të tre për çdo rrjedhë njësish që drejtojnë. Nëse diçka nuk shkon, me shumë gjasa do të duket te njëri prej tyre.",
          "Jede der drei Zahlen ist für sich ein Leistungsmaß, schreibt Little, und Führungskräfte sollten erwägen, alle drei für jeden Strom von Einheiten zu erfassen und zu zeigen, den sie steuern. Stimmt etwas nicht, zeigt es sich höchstwahrscheinlich in einer davon.") },
        { type: "callout", reading: true, text: x(
          "A board that shows only what was finished hides two of the three numbers. Count what is open, and the waiting time follows from the arithmetic.",
          "Një tabelë që tregon vetëm çfarë u mbarua fsheh dy nga tre numrat. Numëro atë që është e hapur, dhe koha e pritjes del nga aritmetika.",
          "Eine Tafel, die nur Erledigtes zeigt, verbirgt zwei der drei Zahlen. Wer das Offene zählt, bekommt die Wartezeit aus der Rechnung.") },
      ],
      note: x(
        "Hopp and Spearman's terms as quoted by Little (2011); the three uses and the call to managers are Little's. The reading is the editors'.",
        "Termat e Hopp-it dhe Spearman-it sipas citimit të Little-it (2011); tri përdorimet dhe thirrja për menaxherët janë të Little-it. Leximi është i redaksisë.",
        "Die Begriffe von Hopp und Spearman, wie Little (2011) sie zitiert; die drei Anwendungen und der Aufruf an Führungskräfte stammen von Little. Die Deutung stammt von der Redaktion."),
      source: ["littlelaw-hopp-spearman-2000", "littlelaw-little-2011"],
    },
    {
      id: "research", more: "high-volume-days",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("Less waiting,", "Më pak pritje,", "Weniger Warten,"), x("at a price", "me një çmim", "zu einem Preis")],
      lead: x(
        "The law is exact, but it does not say how much work in process is right. Three reports show what practice adds to it.",
        "Ligji është i saktë, por nuk thotë sa punë në proces është e duhura. Tri raporte tregojnë çfarë i shton praktika.",
        "Das Gesetz ist exakt, sagt aber nicht, wie viel Bestand richtig ist. Drei Berichte zeigen, was die Praxis hinzufügt."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("Kanban teams, 2018", "Ekipet Kanban, 2018", "Kanban-Teams, 2018"), p: x("Dag Sjøberg studied more than 8,000 work items of five teams in one software company over four years. Less work in process went with shorter lead times, as the literature claims; more work in process also went with higher productivity. No single best limit emerged.", "Dag Sjøberg studioi mbi 8.000 detyra pune të pesë ekipeve në një kompani softueri gjatë katër vjetëve. Më pak punë në proces shkoi bashkë me kohë më të shkurtra kalimi, siç pohon literatura; më shumë punë në proces shkoi edhe me produktivitet më të lartë. Nuk doli një kufi i vetëm më i mirë.", "Dag Sjøberg untersuchte über 8.000 Arbeitspakete von fünf Teams eines Softwareunternehmens über vier Jahre. Weniger Bestand ging mit kürzeren Durchlaufzeiten einher, wie die Literatur behauptet; mehr Bestand ging aber auch mit höherer Produktivität einher. Eine einzige beste Grenze ergab sich nicht.") },
          { h: x("Emergency departments", "Urgjencat", "Notaufnahmen"), p: x("Arrivals divided by what one doctor treats give the minimum staff: 10 patients an hour at 2.5 per doctor means 4 doctors. Because queues grow slowly at first and then fast as arrivals near capacity, the rule of thumb reported by Little adds 10–20%.", "Mbërritjet pjesëtuar me sa trajton një mjek japin stafin minimal: 10 pacientë në orë me 2,5 për mjek do të thotë 4 mjekë. Meqë radhët rriten ngadalë në fillim dhe shpejt kur mbërritjet i afrohen kapacitetit, rregulli praktik që raporton Little-i shton 10–20%.", "Ankünfte geteilt durch das, was ein Arzt behandelt, ergeben das Mindestpersonal: 10 Patienten pro Stunde bei 2,5 je Arzt heißt 4 Ärzte. Weil Schlangen erst langsam und nahe der Kapazität schnell wachsen, schlägt die von Little berichtete Faustregel 10–20 % auf.") },
          { h: x("A server under load, 2010", "Një server nën ngarkesë, 2010", "Ein Server unter Last, 2010"), p: x("In a load test, the queue of requests grew roughly in step with the load, then climbed steeply; above about 18 requests a second, more were essentially dropped. Little reads it as the large queue itself slowing the service.", "Në një provë ngarkese, radha e kërkesave u rrit afërsisht në hap me ngarkesën, pastaj u ngjit pjerrët; mbi rreth 18 kërkesa në sekondë, të tjerat në fakt hidheshin poshtë. Little-i e shpjegon me radhën e madhe, që vetë e ngadalëson shërbimin.", "In einem Lasttest wuchs die Schlange der Anfragen etwa im Gleichschritt mit der Last und stieg dann steil an; über etwa 18 Anfragen pro Sekunde wurden weitere praktisch verworfen. Little deutet es so, dass die große Schlange selbst die Bedienung bremste.") },
        ] },
        { type: "callout", reading: true, text: x(
          "Full load looks efficient on a capacity chart. In the queue, it is where waiting stops growing in a straight line.",
          "Ngarkesa e plotë duket efikase në një grafik kapaciteti. Te radha, është vendi ku pritja nuk rritet më në vijë të drejtë.",
          "Volle Auslastung sieht in einem Kapazitätsdiagramm effizient aus. In der Schlange ist sie der Punkt, an dem das Warten nicht mehr gerade ansteigt.") },
      ],
      note: x(
        "Sjøberg's study covers one company and shows correlations; productivity was hard to measure. The two other cases are reported by Little (2011) from conversations with the people involved, not as independent studies.",
        "Studimi i Sjøberg-ut mbulon një kompani dhe tregon lidhje; produktiviteti matej me vështirësi. Dy rastet e tjera i raporton Little-i (2011) nga bisedat me njerëzit që i bënë, jo si studime të pavarura.",
        "Sjøbergs Studie betrifft ein Unternehmen und zeigt Zusammenhänge; die Produktivität war schwer zu messen. Die beiden anderen Fälle berichtet Little (2011) aus Gesprächen mit den Beteiligten, nicht als unabhängige Studien."),
      source: ["littlelaw-sjoberg-2018", "littlelaw-little-2011"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie man es misst"),
      title: [x("Count the queue,", "Numëro radhën,", "Die Schlange zählen,"), x("find the time", "gjej kohën", "die Zeit finden")],
      lead: x(
        "Practitioners always measure over a finite period, Little points out, and over any such period the law holds exactly. A team can measure two numbers and compute the third, or measure all three and check its data.",
        "Në praktikë matet gjithmonë gjatë një periudhe të fundme, vë në dukje Little-i, dhe për çdo periudhë të tillë ligji vlen saktësisht. Një ekip mund të masë dy numra dhe të llogarisë të tretin, ose t'i masë të tre dhe të kontrollojë të dhënat.",
        "In der Praxis misst man immer über einen endlichen Zeitraum, betont Little, und über jeden solchen Zeitraum gilt das Gesetz exakt. Ein Team kann zwei Zahlen messen und die dritte berechnen oder alle drei messen und seine Daten prüfen."),
      blocks: [
        { type: "steps", items: [
          { h: x("Draw the boundary", "Vizato kufirin", "Die Grenze ziehen"), p: x("Where an item enters, where it leaves, and what counts as one item.", "Ku hyn një njësi, ku del, dhe çfarë numërohet si një njësi.", "Wo eine Einheit hineinkommt, wo sie hinausgeht und was als eine Einheit zählt.") },
          { h: x("Count what is inside", "Numëro çfarë është brenda", "Zählen, was drin ist"), p: x("At fixed times, every morning for example; average over the period.", "Në orë të caktuara, për shembull çdo mëngjes; mesatarja e periudhës.", "Zu festen Zeiten, etwa jeden Morgen; Mittelwert über den Zeitraum.") },
          { h: x("Count what leaves", "Numëro çfarë del", "Zählen, was hinausgeht"), p: x("Per day or per hour, over the same period and in the same units.", "Në ditë ose në orë, gjatë së njëjtës periudhë dhe me të njëjtat njësi.", "Je Tag oder Stunde, über denselben Zeitraum und in denselben Einheiten.") },
          { h: x("Divide and compare", "Pjesëto dhe krahaso", "Teilen und vergleichen"), p: x("Inside ÷ leaving = average time inside. Set it against the times you have recorded.", "Brenda ÷ dalje = koha mesatare brenda. Krahasoje me kohët që ke regjistruar.", "Drin ÷ hinaus = mittlere Zeit im System. Mit den erfassten Zeiten vergleichen.") },
        ] },
        { type: "example", label: x("Hypothetical example, a returns desk over four weeks", "Shembull hipotetik, një sportel kthimesh gjatë katër javëve", "Hypothetisches Beispiel, eine Retourenstelle über vier Wochen"), rows: [
          { k: x("Open each morning", "Të hapura çdo mëngjes", "Offen jeden Morgen"), v: x("60 cases on average", "60 raste mesatarisht", "im Schnitt 60 Fälle") },
          { k: x("Closed per day", "Të mbyllura në ditë", "Erledigt pro Tag"), v: x("20 cases on average", "20 raste mesatarisht", "im Schnitt 20 Fälle") },
          { k: x("Time inside", "Koha brenda", "Zeit im System"), v: x("60 ÷ 20 = 3 working days", "60 ÷ 20 = 3 ditë pune", "60 ÷ 20 = 3 Arbeitstage") },
        ], text: x("If the system's own timestamps say 1.5 days, a count is wrong, perhaps the cases on hold. The numbers are invented.", "Nëse kohët e regjistruara në sistem thonë 1,5 ditë, një numërim është i gabuar, ndoshta rastet e pezulluara. Numrat janë të shpikur.", "Sagen die Zeitstempel des Systems 1,5 Tage, stimmt eine Zählung nicht, vielleicht bei den zurückgestellten Fällen. Die Zahlen sind erfunden.") },
      ],
      note: x(
        "The finite-period proof comes from Little (2011), as does Bill Lovejoy's remark, from a hospital study, that the law is a reality check on data that do not add up. The steps and the example are the editors'.",
        "Prova për periudhën e fundme vjen nga Little-i (2011), ashtu si edhe vërejtja e Bill Lovejoy-t, nga një studim spitalor, se ligji është një provë realiteti për të dhënat që nuk përputhen. Hapat dhe shembulli janë të redaksisë.",
        "Der Beweis für den endlichen Zeitraum stammt von Little (2011), ebenso Bill Lovejoys Bemerkung aus einer Krankenhausstudie, das Gesetz sei ein Realitätscheck für Daten, die nicht aufgehen. Schritte und Beispiel stammen von der Redaktion."),
      source: ["littlelaw-little-2011"],
    },
    {
      id: "tool", tool: "/tools/delay-analyzer/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("From open work", "Nga puna e hapur", "Vom offenen Bestand"), x("to lead time", "te koha e kalimit", "zur Durchlaufzeit")],
      lead: x(
        "One queue, one period. Count what is inside and what leaves, divide, and decide how much open work the team allows before it starts anything new.",
        "Një radhë, një periudhë. Numëro çfarë është brenda dhe çfarë del, pjesëto, dhe vendos sa punë të hapur lejon ekipi para se të nisë diçka të re.",
        "Eine Schlange, ein Zeitraum. Zählen, was drin ist und was hinausgeht, teilen und festlegen, wie viel offene Arbeit das Team zulässt, bevor es etwas Neues beginnt."),
      blocks: [
        { type: "form", items: [
          { h: x("Queue and boundary", "Radha dhe kufiri", "Schlange und Grenze"), hint: x("where an item enters, where it leaves, which unit", "ku hyn një njësi, ku del, cila njësi", "wo eine Einheit hineinkommt, wo sie hinausgeht, welche Einheit") },
          { h: x("Period", "Periudha", "Zeitraum"), hint: x("from and to; the same dates for every count", "nga dhe deri; të njëjtat data për çdo numërim", "von und bis; dieselben Daten für jede Zählung") },
          { h: x("Work in process", "Puna në proces", "Bestand"), hint: x("average count of open items; when and how counted", "numri mesatar i njësive të hapura; kur dhe si numërohen", "mittlere Zahl offener Einheiten; wann und wie gezählt") },
          { h: x("Throughput", "Ritmi", "Durchsatz"), hint: x("items finished per day over the period", "njësi të mbaruara në ditë gjatë periudhës", "erledigte Einheiten pro Tag im Zeitraum") },
          { h: x("Lead time = work in process ÷ throughput", "Koha e kalimit = puna në proces ÷ ritmi", "Durchlaufzeit = Bestand ÷ Durchsatz"), hint: x("in days; against recorded times and what customers are promised", "në ditë; kundrejt kohëve të regjistruara dhe asaj që u premtohet klientëve", "in Tagen; gegen erfasste Zeiten und das, was Kunden zugesagt wird") },
          { h: x("Limit and check", "Kufiri dhe kontrolli", "Grenze und Prüfung"), hint: x("most open items allowed; who holds new starts; when we count again", "sa njësi të hapura lejohen; kush i ndal fillimet e reja; kur numërojmë përsëri", "höchstens erlaubte offene Einheiten; wer neue Starts zurückhält; wann wir wieder zählen") },
        ] },
      ],
      note: x(
        "A practice proposed by the editors, after Little (2011), the Penny Fab and CONWIP, Spearman, Woodruff and Hopp's pull system that keeps the work in process of a whole line constant.",
        "Praktikë e propozuar nga redaksia, sipas Little-it (2011), Penny Fab-it dhe CONWIP-it, sistemit tërheqës të Spearman-it, Woodruff-it dhe Hopp-it që e mban konstante punën në proces të gjithë linjës.",
        "Eine Praxis, die die Redaktion vorschlägt, nach Little (2011), der Penny Fab und CONWIP, dem Pull-System von Spearman, Woodruff und Hopp, das den Bestand einer ganzen Linie konstant hält."),
      source: ["littlelaw-little-2011", "littlelaw-conwip-1990", "littlelaw-tafoya-2008"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
