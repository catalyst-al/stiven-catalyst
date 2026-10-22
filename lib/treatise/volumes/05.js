// Operational treatise, Volume 5: The capacity trap, why busy operations break before they look full. Block:
// Operations. Facts and their sources: docs/revista/traktati-operacional.md. The research is queueing theory (Little
// 1961 and 2011, shared with Management Review No. 59; Kingman 1961 and 1962; Whitt 1992 and 1993; Eick, Massey &
// Whitt 1993), Factory Physics (Hopp & Spearman, 3rd edition) and NHS England's demand and capacity models, each
// checked at its DOI or page. Six chapters, each in the three layers; Chapter III gets the protocol the author's PDF
// folds into its research page. Every number is a worked example from stated assumptions (an M/M/1 station with a
// five-minute service time, a three-step chain, 100 items, a two-hour surge) and is marked hypothetical; nothing is
// measured in the author's workplaces.
import { x } from "../common.js";

const synthetic = x("Synthetic example from stated assumptions, not a measurement", "Shembull sintetik nga supozime të deklaruara, jo matje", "Synthetisches Beispiel aus genannten Annahmen, keine Messung");

export default {
  number: 5,
  numeral: "V",
  block: "operations",
  date: x("October 2026", "Tetor 2026", "Oktober 2026"),
  theme: [x("The capacity trap:", "Kurthi i kapacitetit:", "Die Kapazitätsfalle:"), x("why busy operations break before they look full", "pse operacionet e zëna prishen para se të duken plot", "warum volle Betriebe brechen, bevor sie voll aussehen")],
  sub: x(
    "Six chapters on uneven demand, queues, utilization, moving constraints, safety under pressure and capacity that survives the unexpected.",
    "Gjashtë kapituj për kërkesën e pabarabartë, radhët, shfrytëzimin, kufizimet që lëvizin, sigurinë nën presion dhe kapacitetin që i mbijeton së papriturës.",
    "Sechs Kapitel über ungleichmäßige Nachfrage, Warteschlangen, Auslastung, wandernde Engpässe, Sicherheit unter Druck und Kapazität, die das Unerwartete übersteht."),
  seo: x(
    "The capacity trap, an operational treatise: six chapters in three layers, from a wrong forecast to Little, Kingman and Whitt, and the Capacity Reality Card.",
    "Kurthi i kapacitetit, traktat operacional: gjashtë kapituj në tri shtresa, nga një parashikim i gabuar te Little, Kingman e Whitt, dhe karta e kapacitetit.",
    "Die Kapazitätsfalle, ein operativer Traktat: sechs Kapitel in drei Ebenen, von einer falschen Prognose zu Little, Kingman und Whitt, und das Kapazitätsblatt."),
  feature: x(
    "Volume 5 asks how much pressure an operation can absorb before performance begins to fail. Its six chapters move from a roster that looks adequate on the day the forecast is wrong, a queue no team owns and a desk that is always busy to Little's Law, Kingman's approximation and Whitt's multi-server warning, and end with a protocol for designing capacity for the real interval and the Capacity Reality Card.",
    "Vëllimi 5 pyet sa presion mund të përballojë një operacion para se performanca të nisë të bjerë. Gjashtë kapitujt e tij shkojnë nga një listë turnesh që duket e mjaftueshme ditën kur parashikimi del gabim, një radhë që nuk e ka asnjë ekip dhe një sportel gjithnjë i zënë, te ligji i Little-it, përafrimi i Kingman-it dhe paralajmërimi i Whitt-it për shumë shërbyes, dhe mbyllen me një protokoll për projektimin e kapacitetit për intervalin e vërtetë dhe me Kartën e realitetit të kapacitetit.",
    "Band 5 fragt, wie viel Druck ein Betrieb aufnehmen kann, bevor die Leistung zu kippen beginnt. Seine sechs Kapitel führen von einem Dienstplan, der am Tag der falschen Prognose ausreichend aussieht, einer Warteschlange, die kein Team verantwortet, und einem immer beschäftigten Schalter zu Littles Gesetz, Kingmans Näherung und Whitts Warnung für viele Bediener, und enden mit einem Protokoll für Kapazität im echten Intervall und dem Kapazitätsblatt."),
  figure: { n: "4.75×", by: x("M/M/1 model, invented example", "Modeli M/M/1, shembull i shpikur", "M/M/1-Modell, erfundenes Beispiel"), t: x(
    "the modelled increase in waiting time when a single M/M/1 station moves from 80% to 95% utilization, all other assumptions fixed. A theoretical illustration, not a workplace result.",
    "rritja e modeluar e kohës së pritjes kur një stacion i vetëm M/M/1 kalon nga 80% në 95% shfrytëzim, me gjithë supozimet e tjera të pandryshuara. Ilustrim teorik, jo rezultat nga puna.",
    "der modellierte Anstieg der Wartezeit, wenn eine einzelne M/M/1-Station von 80 % auf 95 % Auslastung geht, alle anderen Annahmen unverändert. Eine theoretische Illustration, kein Betriebsergebnis.") },
  teasers: [
    { page: "i-scene", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("The day the forecast was wrong", "Dita kur parashikimi doli gabim", "Der Tag, an dem die Prognose falsch war") },
    { page: "iii-model", kicker: x("The model", "Modeli", "Das Modell"),
      title: x("Kingman's queueing curve", "Kurba e radhës sipas Kingman-it", "Kingmans Warteschlangenkurve") },
    { page: "tool", kicker: x("Field tool", "Mjeti i terrenit", "Werkzeug vor Ort"),
      title: x("The Capacity Reality Card", "Karta e realitetit të kapacitetit", "Das Kapazitätsblatt") },
  ],
  contract: [
    { h: x("Field", "Terreni", "Feld"), p: x("Operational contexts without invented incidents.", "Kontekste operacionale pa ngjarje të shpikura.", "Betriebliche Kontexte ohne erfundene Vorfälle.") },
    { h: x("Evidence", "Prova", "Belege"), p: x("Population, assumptions, boundaries and year travel with a claim.", "Popullata, supozimet, kufijtë dhe viti udhëtojnë bashkë me pohimin.", "Population, Annahmen, Grenzen und Jahr reisen mit jeder Aussage.") },
    { h: x("Action", "Veprimi", "Handeln"), p: x("A bounded test, an owner and a verifiable customer result.", "Një provë e kufizuar, një përgjegjës dhe një rezultat i verifikueshëm për klientin.", "Ein begrenzter Test, ein Verantwortlicher und ein prüfbares Kundenergebnis.") },
  ],
  sources: ["littlelaw-little-1961", "littlelaw-little-2011", "kingman-1961", "kingman-1962", "whitt-1992", "whitt-1993", "eick-massey-whitt-1993", "factory-physics-2011", "nhs-demand-capacity"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      title: [x("When a full schedule", "Kur një orar i plotë", "Wenn ein voller Plan"), x("stops being a plan", "pushon së qeni plan", "kein Plan mehr ist")],
      why: x(
        "A busy operation can look efficient just before it becomes unable to absorb the next ordinary surprise.",
        "Një operacion i zënë mund të duket i efektshëm pikërisht para se të mos e përballojë dot të papriturën e radhës të zakonshme.",
        "Ein voll beschäftigter Betrieb kann effizient aussehen, kurz bevor er die nächste gewöhnliche Überraschung nicht mehr aufnehmen kann."),
      body: x(
        "Managers often count people, vehicles, desks and available hours, compare a forecast with that capacity and call the difference a plan. The figures matter. Yet a system does not receive work in perfectly measured portions. Arrivals cluster. Tasks take unequal amounts of time. One late handover changes the start of the next activity. A resource that exists on a roster may not be available to the particular work waiting at a particular moment. This fifth volume studies how queues form, why utilization near the limit can magnify waiting and why the location of the main constraint shifts. The settings are familiar from the author's work: last-mile dispatch and loading, training during ramp-up, service handovers in hotels and coordination across wholesale activities. No workload, queue length, staffing figure or personal intervention is presented as a measured result of those employers. We use queueing theory to make one point precise and then challenge its limits: Little on flow and time, Kingman on variability and utilization at a single server, Whitt on the reality of many servers, and healthcare guidance on planning demand and capacity as an ongoing model. The last chapter puts the mathematics inside a cautious decision protocol.",
        "Menaxherët shpesh numërojnë njerëz, automjete, sportele dhe orë në dispozicion, e krahasojnë një parashikim me atë kapacitet dhe ndryshimin e quajnë plan. Shifrat kanë rëndësi. Por një sistem nuk e merr punën në porcione të matura përsosmërisht. Mbërritjet grumbullohen. Detyrat marrin kohë të pabarabartë. Një dorëzim i vonuar e ndryshon fillimin e veprimtarisë së radhës. Një burim që ekziston në listën e turneve mund të mos jetë në dispozicion për punën e caktuar që pret në një çast të caktuar. Ky vëllim i pestë studion si formohen radhët, pse shfrytëzimi afër kufirit mund ta zmadhojë pritjen dhe pse zhvendoset vendi i kufizimit kryesor. Mjediset njihen nga puna e autorit: dispeçeria dhe ngarkimi në miljen e fundit, trajnimi gjatë hyrjes në punë, dorëzimet e shërbimit në hotele dhe koordinimi i veprimtarive me shumicë. Asnjë ngarkesë pune, gjatësi radhe, shifër stafi apo ndërhyrje personale nuk paraqitet si rezultat i matur i atyre punëdhënësve. Përdorim teorinë e radhëve për ta bërë të saktë një pikë dhe pastaj i sfidojmë kufijtë e saj: Little për rrjedhën dhe kohën, Kingman për luhatshmërinë dhe shfrytëzimin te një shërbyes i vetëm, Whitt për realitetin e shumë shërbyesve, dhe udhëzimi shëndetësor për planifikimin e kërkesës dhe kapacitetit si model i vazhdueshëm. Kapitulli i fundit e vendos matematikën brenda një protokolli të kujdesshëm vendimi.",
        "Führungskräfte zählen oft Menschen, Fahrzeuge, Schalter und verfügbare Stunden, vergleichen eine Prognose mit dieser Kapazität und nennen die Differenz einen Plan. Die Zahlen zählen. Doch ein System erhält Arbeit nicht in perfekt abgemessenen Portionen. Ankünfte ballen sich. Aufgaben dauern ungleich lang. Eine späte Übergabe verschiebt den Beginn der nächsten Tätigkeit. Eine Ressource, die im Dienstplan steht, ist für die bestimmte Arbeit, die in einem bestimmten Moment wartet, womöglich nicht verfügbar. Dieser fünfte Band untersucht, wie Warteschlangen entstehen, warum Auslastung nahe der Grenze das Warten verstärken kann und warum der Ort des Hauptengpasses wandert. Die Schauplätze sind aus der Arbeit des Autors vertraut: Disposition und Beladung auf der letzten Meile, Schulung in der Einarbeitung, Serviceübergaben im Hotel, Koordination im Großhandel. Keine Arbeitslast, Warteschlangenlänge, Personalzahl und kein persönlicher Eingriff wird als gemessenes Ergebnis dieser Arbeitgeber dargestellt. Wir nutzen die Warteschlangentheorie, um einen Punkt präzise zu machen, und hinterfragen dann ihre Grenzen: Little zu Fluss und Zeit, Kingman zu Streuung und Auslastung an einem Bediener, Whitt zur Wirklichkeit vieler Bediener, und eine Anleitung aus dem Gesundheitswesen zur Planung von Nachfrage und Kapazität als laufendes Modell. Das letzte Kapitel stellt die Mathematik in ein vorsichtiges Entscheidungsprotokoll."),
    },
    { id: "contents", type: "contents" },
    {
      id: "note",
      kicker: x("Research note", "Shënim kërkimor", "Forschungsnotiz"),
      title: [x("What capacity models", "Çfarë lejohen të pohojnë", "Was Kapazitätsmodelle"), x("are allowed to claim", "modelet e kapacitetit", "behaupten dürfen")],
      lead: x(
        "An equation can reveal a mechanism. It cannot turn an invented example into a measurement of a real workplace.",
        "Një ekuacion mund të zbulojë një mekanizëm. Nuk mund ta kthejë një shembull të shpikur në matje të një vendi pune të vërtetë.",
        "Eine Gleichung kann einen Mechanismus zeigen. Sie kann ein erfundenes Beispiel nicht in eine Messung eines realen Betriebs verwandeln."),
      blocks: [
        { type: "p", text: x(
          "The quantitative illustrations in this volume refer to simplified queueing systems. They are calculated from stated hypothetical assumptions, not extracted from any dispatcher dashboard, hotel PMS, customer order history or employer. Where a model assumes one server in steady state, it cannot simply be scaled to a fleet, a multi-counter reception or an end-to-end delivery network. Little's Law concerns long-run flow averages under specified regularity conditions. Kingman's approximation links waiting to variability and utilization for a single service station. Multi-server queues behave differently, a point examined by Whitt. The practical examples transfer questions to the model; they do not establish causal effects in the author's workplaces.",
          "Ilustrimet sasiore në këtë vëllim u referohen sistemeve të thjeshtuara të radhëve. Janë llogaritur nga supozime hipotetike të deklaruara, jo të nxjerra nga ndonjë panel dispeçerie, sistem hoteli, histori porosish klientësh apo punëdhënës. Aty ku një model supozon një shërbyes në gjendje të qëndrueshme, ai nuk mund të shkallëzohet thjesht për një flotë, një recepsion me shumë sportele apo një rrjet dorëzimi nga fillimi në fund. Ligji i Little-it ka të bëjë me mesataret afatgjata të rrjedhës, në kushte të caktuara rregullsie. Përafrimi i Kingman-it e lidh pritjen me luhatshmërinë dhe shfrytëzimin për një stacion të vetëm shërbimi. Radhët me shumë shërbyes sillen ndryshe, siç e shqyrton Whitt. Shembujt praktikë i bartin pyetjet te modeli; nuk vërtetojnë efekte shkakësore në vendet e punës së autorit.",
          "Die quantitativen Illustrationen dieses Bandes beziehen sich auf vereinfachte Warteschlangensysteme. Sie sind aus genannten hypothetischen Annahmen berechnet, nicht aus einem Dispositions-Dashboard, einem Hotel-PMS, einer Auftragshistorie oder einem Arbeitgeber gezogen. Wo ein Modell einen Bediener im stationären Zustand annimmt, lässt es sich nicht einfach auf eine Flotte, eine Rezeption mit mehreren Schaltern oder ein Zustellnetz von Ende zu Ende hochrechnen. Littles Gesetz betrifft langfristige Flussmittelwerte unter bestimmten Regularitätsbedingungen. Kingmans Näherung verknüpft Warten mit Streuung und Auslastung für eine einzelne Servicestation. Warteschlangen mit mehreren Bedienern verhalten sich anders, ein Punkt, den Whitt untersucht. Die praktischen Beispiele übertragen Fragen auf das Modell; sie belegen keine kausalen Effekte in den Betrieben des Autors.") },
        { type: "cards", cols: 3, items: [
          { h: x("Theorem", "Teoremë", "Satz"), p: x("A mathematical relation with defined variables and assumptions.", "Një raport matematik me variabla dhe supozime të përkufizuara.", "Eine mathematische Beziehung mit definierten Variablen und Annahmen.") },
          { h: x("Approximation", "Përafrim", "Näherung"), p: x("A practical estimate whose accuracy depends on the model.", "Një vlerësim praktik, saktësia e të cilit varet nga modeli.", "Eine praktische Schätzung, deren Genauigkeit vom Modell abhängt.") },
          { h: x("Hypothesis", "Hipotezë", "Hypothese"), p: x("An operational idea awaiting measurement in the real system.", "Një ide operacionale që pret matje në sistemin e vërtetë.", "Eine betriebliche Idee, die auf Messung im realen System wartet.") },
        ] },
        { type: "p", text: x(
          "A queue is not necessarily waste. Some time protects safe sequencing, required inspections and service quality. The managerial task is to distinguish necessary control from preventable delay. A demand-capacity model should show exclusions, missing data, time window, operational authority and the downstream outcome it is intended to improve.",
          "Një radhë nuk është doemos humbje. Një pjesë e kohës mbron radhitjen e sigurt, inspektimet e kërkuara dhe cilësinë e shërbimit. Detyra e menaxherit është ta dallojë kontrollin e nevojshëm nga vonesa e shmangshme. Një model kërkese-kapaciteti duhet të tregojë përjashtimet, të dhënat që mungojnë, dritaren kohore, autoritetin operacional dhe rezultatin më poshtë në zinxhir që synon të përmirësojë.",
          "Eine Warteschlange ist nicht zwangsläufig Verschwendung. Manche Zeit schützt die sichere Reihenfolge, vorgeschriebene Prüfungen und die Servicequalität. Die Führungsaufgabe ist, notwendige Kontrolle von vermeidbarer Verzögerung zu unterscheiden. Ein Nachfrage-Kapazitäts-Modell sollte Ausschlüsse, fehlende Daten, Zeitfenster, betriebliche Befugnis und das nachgelagerte Ergebnis zeigen, das es verbessern soll.") },
        { type: "callout", reading: true, text: x(
          "State the unit, boundary, time window and assumptions before trusting the number.",
          "Thuaj njësinë, kufirin, dritaren kohore dhe supozimet para se t'i besosh numrit.",
          "Nennen Sie Einheit, Grenze, Zeitfenster und Annahmen, bevor Sie der Zahl trauen.") },
      ],
      note: x(
        "Little (1961, 2011), Kingman (1961, 1962), Whitt (1992, 1993) and NHS England's demand and capacity models; full references on the sources page.",
        "Little (1961, 2011), Kingman (1961, 1962), Whitt (1992, 1993) dhe modelet e kërkesës dhe kapacitetit të NHS England; referencat e plota në faqen e burimeve.",
        "Little (1961, 2011), Kingman (1961, 1962), Whitt (1992, 1993) und die Nachfrage- und Kapazitätsmodelle von NHS England; vollständige Angaben auf der Quellenseite."),
      source: ["littlelaw-little-1961", "kingman-1961", "whitt-1992", "nhs-demand-capacity"],
    },

    // Chapter I. The day the forecast was wrong
    {
      id: "ch-i", type: "chapter", numeral: "I",
      title: x("The day the forecast was wrong", "Dita kur parashikimi doli gabim", "Der Tag, an dem die Prognose falsch war"),
      pages: [
        {
          id: "i-scene", layer: "scene", more: "high-volume-days",
          title: [x("The day the forecast", "Dita kur parashikimi", "Der Tag, an dem"), x("was wrong", "doli gabim", "die Prognose falsch war")],
          lead: x(
            "The plan says enough people are rostered. The work arrives in a different shape.",
            "Plani thotë se ka mjaft njerëz në turn. Puna mbërrin në një formë tjetër.",
            "Der Plan sagt, genug Leute sind eingeteilt. Die Arbeit kommt in anderer Form."),
          blocks: [
            { type: "flag", text: x("Constructed scene, not a documented personal event", "Skenë e ndërtuar, jo ngjarje personale e dokumentuar", "Konstruierte Szene, kein dokumentiertes persönliches Ereignis") },
            { type: "p", text: x(
              "A dispatch shift begins with a forecast, a departure schedule and a set of loading windows. The roster looks adequate. Then several departures need attention at once, a few drivers arrive later than planned and one prepared load is not yet usable. The team has not suddenly forgotten how to work. The distribution of work across time no longer resembles the average used for planning. The person closest to the loading area sees distinct queues: work waiting for preparation, vehicles waiting for permission to proceed and exceptions waiting for a decision. A manager looking only at the total number of planned tours may see an apparently modest gap. A manager on the ramp sees that capacity cannot be teleported from a quiet period into the congested window.",
              "Një turn dispeçerie nis me një parashikim, një orar nisjesh dhe një tog dritaresh ngarkimi. Lista e turnit duket e mjaftueshme. Pastaj disa nisje kërkojnë vëmendje njëherësh, disa shoferë mbërrijnë më vonë se planifikimi dhe një ngarkesë e përgatitur nuk është ende e përdorshme. Ekipi nuk ka harruar papritur si punohet. Shpërndarja e punës në kohë nuk i ngjan më mesatares që u përdor për planifikim. Personi më afër zonës së ngarkimit sheh radhë të dallueshme: punë që pret përgatitjen, automjete që presin lejen për të vazhduar dhe përjashtime që presin një vendim. Një menaxher që shikon vetëm numrin e përgjithshëm të tureve të planifikuara mund të shohë një boshllëk në dukje modest. Një menaxher në rampë sheh se kapaciteti nuk mund të teleportohet nga një periudhë e qetë në dritaren e mbushur.",
              "Eine Dispositionsschicht beginnt mit einer Prognose, einem Abfahrtsplan und einer Reihe von Ladefenstern. Der Dienstplan wirkt ausreichend. Dann brauchen mehrere Abfahrten gleichzeitig Aufmerksamkeit, ein paar Fahrer kommen später als geplant, und eine vorbereitete Ladung ist noch nicht einsetzbar. Das Team hat nicht plötzlich verlernt zu arbeiten. Die Verteilung der Arbeit über die Zeit gleicht nicht mehr dem Durchschnitt, mit dem geplant wurde. Die Person am Ladebereich sieht getrennte Warteschlangen: Arbeit, die auf Vorbereitung wartet, Fahrzeuge, die auf Freigabe warten, Ausnahmen, die auf eine Entscheidung warten. Eine Führungskraft, die nur die Gesamtzahl der geplanten Touren sieht, erkennt eine scheinbar bescheidene Lücke. Eine Führungskraft an der Rampe sieht, dass Kapazität sich nicht aus einer ruhigen Stunde in das überfüllte Fenster beamen lässt.") },
            { type: "p", text: x(
              "The author has documented work with last-mile loading, short-notice driver availability, ramp-up and days when demand exceeded forecasts. The clock, sequence and cause in this scene are illustrative. There is no verified daily volume or outcome that could be supplied responsibly as a case study.",
              "Autori ka punë të dokumentuar me ngarkimin në miljen e fundit, disponueshmërinë e shoferëve me njoftim të shkurtër, hyrjen në punë dhe ditë kur kërkesa i tejkaloi parashikimet. Ora, radha dhe shkaku në këtë skenë janë ilustruese. Nuk ka asnjë volum ditor apo rezultat të verifikuar që mund të jepej me përgjegjësi si rast studimi.",
              "Der Autor hat dokumentierte Arbeit mit Last-Mile-Beladung, kurzfristiger Fahrerverfügbarkeit, Einarbeitung und Tagen, an denen die Nachfrage die Prognose überstieg. Uhrzeit, Abfolge und Ursache in dieser Szene sind illustrativ. Es gibt kein geprüftes Tagesvolumen und kein Ergebnis, das sich verantwortungsvoll als Fallstudie liefern ließe.") },
            { type: "callout", reading: true, text: x(
              "Capacity that exists on paper but not at the required time is not available capacity.",
              "Kapaciteti që ekziston në letër, por jo në kohën e kërkuar, nuk është kapacitet i disponueshëm.",
              "Kapazität, die auf dem Papier existiert, aber nicht zur geforderten Zeit, ist keine verfügbare Kapazität.") },
          ],
          note: x(
            "Documented categories of last-mile work; the particular scene is hypothetical. The essay named below tells a high-volume day from the dispatch desk.",
            "Kategori të dokumentuara të punës në miljen e fundit; skena e caktuar është hipotetike. Eseja e emërtuar më poshtë tregon një ditë me volum të lartë nga tavolina e dispeçerisë.",
            "Dokumentierte Kategorien der Last-Mile-Arbeit; die konkrete Szene ist hypothetisch. Der unten genannte Essay erzählt einen Tag mit hohem Volumen vom Dispositionsschreibtisch."),
        },
        {
          id: "i-concept", layer: "concept",
          title: [x("Average demand", "Kërkesa mesatare", "Durchschnittliche Nachfrage"), x("is not arrival shape", "nuk është forma e mbërritjes", "ist nicht die Form der Ankunft")],
          lead: x(
            "Two shifts can receive the same total work and need different capacity because their peaks occur at different times. A daily mean removes the information that makes a shift difficult. Imagine 100 requests divided across ten equal windows. Ten in every window and a pattern of two, two, twenty-four, twenty-four and smaller values elsewhere share the same total. The second creates a queue if processing cannot follow the surge.",
            "Dy turne mund të marrin të njëjtën punë gjithsej dhe të kenë nevojë për kapacitet të ndryshëm, sepse kulmet e tyre ndodhin në kohë të ndryshme. Një mesatare ditore e heq informacionin që e bën të vështirë një turn. Përfytyro 100 kërkesa të ndara në dhjetë dritare të barabarta. Dhjetë në çdo dritare dhe një model me dy, dy, njëzet e katër, njëzet e katër dhe vlera më të vogla gjetiu kanë të njëjtin total. I dyti krijon radhë, nëse përpunimi nuk e ndjek dot valën.",
            "Zwei Schichten können dieselbe Gesamtarbeit erhalten und verschiedene Kapazität brauchen, weil ihre Spitzen zu verschiedenen Zeiten liegen. Ein Tagesmittel entfernt die Information, die eine Schicht schwer macht. Stellen Sie sich 100 Anfragen in zehn gleichen Fenstern vor. Zehn in jedem Fenster und ein Muster aus zwei, zwei, vierundzwanzig, vierundzwanzig und kleineren Werten anderswo haben dieselbe Summe. Das zweite erzeugt eine Warteschlange, wenn die Bearbeitung dem Schub nicht folgen kann."),
          blocks: [
            { type: "flag", text: synthetic },
            { type: "hbars", max: 24, hypothetical: true,
              label: x("Two arrival profiles with the same 100 requests, busiest window", "Dy profile mbërritjeje me të njëjtat 100 kërkesa, dritarja më e ngarkuar", "Zwei Ankunftsprofile mit denselben 100 Anfragen, vollstes Fenster"),
              items: [
                { k: x("Evenly spread", "Të shpërndara njëtrajtësisht", "Gleichmäßig verteilt"), v: 10, n: x("10 / window", "10 / dritare", "10 / Fenster") },
                { k: x("Peak window", "Dritarja e kulmit", "Spitzenfenster"), v: 24, n: x("24 / window", "24 / dritare", "24 / Fenster"), alert: true },
              ] },
            { type: "p", text: x(
              "Operations science distinguishes the arrival process, the service process and the resources that can perform that service. Effective capacity includes training, authorization, equipment availability, set-up or travel time and constraints between steps. A vehicle count is not an effective departure rate; a number of reception colleagues does not tell us how many distinct types of requests they can finish at a peak. A useful capacity review therefore uses matched intervals: compare demand and effective service ability for each operational window. Where job types compete for different skills, a single total hides bottlenecks. Record both what has arrived and what is actually ready to be worked.",
              "Shkenca e operacioneve dallon procesin e mbërritjes, procesin e shërbimit dhe burimet që mund ta kryejnë atë shërbim. Kapaciteti efektiv përfshin trajnimin, autorizimin, disponueshmërinë e pajisjeve, kohën e përgatitjes ose të udhëtimit dhe kufizimet mes hapave. Numri i automjeteve nuk është normë efektive nisjesh; numri i kolegëve në recepsion nuk na thotë sa lloje të ndryshme kërkesash mund të përfundojnë ata në një kulm. Një rishikim i dobishëm i kapacitetit përdor pra intervale të përputhura: krahaso kërkesën dhe aftësinë efektive të shërbimit për çdo dritare operacionale. Aty ku llojet e punëve konkurrojnë për aftësi të ndryshme, një total i vetëm i fsheh pengesat. Shëno si çfarë ka mbërritur, ashtu edhe çfarë është vërtet gati për t'u punuar.",
              "Die Betriebswissenschaft unterscheidet den Ankunftsprozess, den Serviceprozess und die Ressourcen, die diesen Service leisten können. Effektive Kapazität umfasst Schulung, Berechtigung, Verfügbarkeit der Ausrüstung, Rüst- oder Fahrzeit und Abhängigkeiten zwischen Schritten. Eine Fahrzeugzahl ist keine effektive Abfahrtsrate; die Zahl der Rezeptionskollegen sagt nicht, wie viele verschiedene Anfragearten sie in einer Spitze erledigen können. Eine nützliche Kapazitätsprüfung verwendet daher abgestimmte Intervalle: Nachfrage und effektive Servicefähigkeit je Betriebsfenster vergleichen. Wo Auftragsarten um verschiedene Fähigkeiten konkurrieren, verbirgt eine einzige Summe die Engpässe. Halten Sie fest, was angekommen ist und was tatsächlich bearbeitbar ist.") },
            { type: "callout", reading: true, text: x(
              "A forecast can be correct for the day and still be unusable for the hour.",
              "Një parashikim mund të jetë i saktë për ditën dhe prapë i papërdorshëm për orën.",
              "Eine Prognose kann für den Tag stimmen und für die Stunde unbrauchbar sein.") },
          ],
          note: x(
            "Arrival, service and effective capacity after Hopp and Spearman's Factory Physics and NHS England's demand and capacity guidance; the two profiles are invented.",
            "Mbërritja, shërbimi dhe kapaciteti efektiv sipas Factory Physics të Hopp e Spearman dhe udhëzimit të NHS England për kërkesën dhe kapacitetin; dy profilet janë të shpikura.",
            "Ankunft, Service und effektive Kapazität nach Hopp und Spearmans Factory Physics und der Nachfrage- und Kapazitätsanleitung von NHS England; die beiden Profile sind erfunden."),
          source: ["factory-physics-2011", "nhs-demand-capacity"],
        },
        {
          id: "i-protocol", layer: "protocol",
          title: [x("Plan the window,", "Planifiko dritaren,", "Das Fenster planen,"), x("not the average", "jo mesataren", "nicht den Durchschnitt")],
          lead: x(
            "Five checks before concluding that the scheduled resources match the work.",
            "Pesë kontrolle para se të përfundosh se burimet e planifikuara përputhen me punën.",
            "Fünf Prüfungen, bevor Sie schließen, dass die eingeplanten Ressourcen zur Arbeit passen."),
          blocks: [
            { type: "steps", items: [
              { h: x("Define the unit", "Përkufizo njësinë", "Die Einheit definieren"), p: x("Tour ready to load, bag group, request or case; do not mix unlike workloads into one count.", "Tur gati për ngarkim, grup çantash, kërkesë ose rast; mos përziej ngarkesa të ndryshme në një numërim.", "Ladebereite Tour, Taschengruppe, Anfrage oder Fall; keine ungleichen Arbeitslasten in einer Zahl mischen.") },
              { h: x("Choose short intervals", "Zgjidh intervale të shkurtra", "Kurze Intervalle wählen"), p: x("Windows appropriate to the process; find the peak arrival concentration, not just the daily total.", "Dritare të përshtatshme për procesin; gjej përqendrimin e kulmit të mbërritjeve, jo vetëm totalin ditor.", "Zum Prozess passende Fenster; die Spitzenkonzentration der Ankünfte finden, nicht nur die Tagessumme.") },
              { h: x("Estimate effective capacity", "Vlerëso kapacitetin efektiv", "Effektive Kapazität schätzen"), p: x("Subtract known unavailability and constraints without assuming all people are interchangeable.", "Zbrit mungesat dhe kufizimet e njohura, pa supozuar se të gjithë njerëzit janë të këmbyeshëm.", "Bekannte Ausfälle und Einschränkungen abziehen, ohne alle Menschen für austauschbar zu halten.") },
              { h: x("Inspect work at the boundary", "Kontrollo punën në kufi", "Die Arbeit an der Grenze prüfen"), p: x("How many jobs are truly ready, waiting, active, blocked and completed at each point?", "Sa punë janë vërtet gati, në pritje, aktive, të bllokuara dhe të përfunduara në çdo pikë?", "Wie viele Aufträge sind an jedem Punkt wirklich bereit, wartend, aktiv, blockiert und erledigt?") },
              { h: x("Set a response owner", "Cakto përgjegjësin e përgjigjes", "Einen Verantwortlichen festlegen"), p: x("Who can coordinate a lawful capacity adjustment, and how the team will know the plan changed.", "Kush mund të koordinojë një përshtatje të ligjshme kapaciteti, dhe si do ta marrë vesh ekipi se plani ndryshoi.", "Wer eine zulässige Kapazitätsanpassung koordinieren darf und wie das Team erfährt, dass der Plan sich änderte.") },
            ] },
            { type: "p", text: x(
              "Record the forecast and the actual arrivals by interval, with source, time zone and exclusion rule. A forecast-error percentage says little about whether the missed work arrived in a critical window; do not turn a small miss into evidence of poor effort by a colleague. Safety and legally required breaks are constraints, not spare capacity.",
              "Shëno parashikimin dhe mbërritjet e vërteta sipas intervalit, me burimin, zonën kohore dhe rregullin e përjashtimit. Një përqindje gabimi parashikimi thotë pak nëse puna e humbur mbërriti në një dritare kritike; mos e kthe një gabim të vogël në provë për përpjekje të dobët të një kolegu. Pushimet e sigurisë dhe ato të detyrueshme me ligj janë kufizime, jo kapacitet rezervë.",
              "Prognose und tatsächliche Ankünfte je Intervall festhalten, mit Quelle, Zeitzone und Ausschlussregel. Ein Prognosefehler in Prozent sagt wenig darüber, ob die verfehlte Arbeit in einem kritischen Fenster ankam; machen Sie aus einem kleinen Fehler keinen Beleg für mangelnden Einsatz eines Kollegen. Sicherheits- und gesetzliche Pausen sind Einschränkungen, keine Reservekapazität.") },
            { type: "callout", reading: true, text: x(
              "The useful question is not “Did we have enough people today?” but “Could the required work be served when it arrived?”",
              "Pyetja e dobishme nuk është “A kishim mjaft njerëz sot?”, por “A mund të shërbehej puna e kërkuar kur mbërriti?”",
              "Die nützliche Frage ist nicht „Hatten wir heute genug Leute?“, sondern „Konnte die geforderte Arbeit bedient werden, als sie ankam?“") },
          ],
          note: x(
            "Practice proposed by the editors after NHS England's demand and capacity approach and Factory Physics; not a documented employer SOP.",
            "Praktikë e propozuar nga redaksia sipas qasjes së NHS England për kërkesën dhe kapacitetin dhe Factory Physics; jo SOP i dokumentuar i ndonjë punëdhënësi.",
            "Von der Redaktion vorgeschlagene Praxis nach dem Nachfrage-Kapazitäts-Ansatz von NHS England und Factory Physics; keine dokumentierte SOP eines Arbeitgebers."),
          source: ["nhs-demand-capacity", "factory-physics-2011"],
        },
      ],
    },

    // Chapter II. The mathematics of waiting
    {
      id: "ch-ii", type: "chapter", numeral: "II",
      title: x("The mathematics of waiting", "Matematika e pritjes", "Die Mathematik des Wartens"),
      pages: [
        {
          id: "ii-scene", layer: "scene", more: "the-angry-guest-at-2am",
          title: [x("The queue no one", "Radha që askush", "Die Warteschlange, die"), x("assigned to a team", "nuk ia caktoi një ekipi", "kein Team bekam")],
          lead: x(
            "One department has completed its task. The next person cannot begin.",
            "Një departament e ka përfunduar detyrën e vet. Personi i radhës nuk mund të nisë.",
            "Eine Abteilung hat ihre Aufgabe erledigt. Die nächste Person kann nicht anfangen."),
          blocks: [
            { type: "flag", text: x("Hypothetical service example, not a named hotel incident", "Shembull hipotetik shërbimi, jo ngjarje e një hoteli të caktuar", "Hypothetisches Servicebeispiel, kein Vorfall in einem bestimmten Hotel") },
            { type: "p", text: x(
              "At an imaginary service desk, a request has been logged but needs an answer from another function. The receptionist finishes registering the matter and turns to the next guest. The request sits in a queue not shown by the counter's local service-time metric. The customer still experiences waiting, even though the first employee has completed the assigned step. The same geometry occurs in wholesale and last-mile delivery: the order is accepted but not ready for preparation; the load is physically present but awaits clarification; an exception has been reported but has not received a decision. The unit moves forward only when both the work and the information needed for the next step arrive.",
              "Në një sportel shërbimi imagjinar, një kërkesë është regjistruar, por ka nevojë për përgjigje nga një funksion tjetër. Recepsionisti e mbaron regjistrimin dhe kthehet te mysafiri i radhës. Kërkesa rri në një radhë që nuk e tregon matja lokale e kohës së shërbimit të sportelit. Klienti e përjeton prapë pritjen, edhe pse punonjësi i parë e ka përfunduar hapin e vet. E njëjta gjeometri ndodh në shitjen me shumicë dhe në dorëzimin e miljes së fundit: porosia pranohet, por nuk është gati për përgatitje; ngarkesa është fizikisht aty, por pret sqarim; një përjashtim është raportuar, por nuk ka marrë vendim. Njësia ecën përpara vetëm kur mbërrijnë si puna, ashtu edhe informacioni që duhet për hapin e radhës.",
              "An einem erdachten Serviceschalter ist eine Anfrage erfasst, braucht aber eine Antwort aus einer anderen Funktion. Die Rezeptionistin schließt die Erfassung ab und wendet sich dem nächsten Gast zu. Die Anfrage liegt in einer Warteschlange, die die lokale Servicezeit des Schalters nicht zeigt. Der Kunde erlebt trotzdem Warten, obwohl die erste Mitarbeiterin ihren Schritt erledigt hat. Dieselbe Geometrie gibt es im Großhandel und auf der letzten Meile: Der Auftrag ist angenommen, aber nicht vorbereitungsreif; die Ladung ist physisch da, wartet aber auf Klärung; eine Ausnahme ist gemeldet, hat aber keine Entscheidung. Die Einheit kommt nur voran, wenn Arbeit und Information für den nächsten Schritt beide eintreffen.") },
            { type: "p", text: x(
              "This constructed scene uses work categories from the author's background, not a claim that a particular hotel delayed a guest or that a specified order was lost. The purpose is to identify which queue is outside the owner's field of view. Counting only the minutes spent processing a request misses the time it occupies the entire system.",
              "Kjo skenë e ndërtuar përdor kategori pune nga sfondi i autorit, jo një pohim se një hotel i caktuar e vonoi një mysafir apo se një porosi e caktuar humbi. Qëllimi është të identifikohet cila radhë është jashtë fushëpamjes së pronarit. Të numërosh vetëm minutat e përpunimit të një kërkese do të thotë të humbasësh kohën që ajo zë në të gjithë sistemin.",
              "Diese konstruierte Szene nutzt Arbeitskategorien aus dem Hintergrund des Autors, keine Behauptung, ein bestimmtes Hotel habe einen Gast warten lassen oder ein bestimmter Auftrag sei verloren gegangen. Es geht darum, die Warteschlange zu finden, die außerhalb des Blickfelds des Verantwortlichen liegt. Nur die Minuten der Bearbeitung zu zählen übersieht die Zeit, die eine Anfrage im ganzen System belegt.") },
            { type: "callout", reading: true, text: x(
              "A team may complete its local task while the customer's clock keeps running.",
              "Një ekip mund ta përfundojë detyrën e vet lokale, ndërsa ora e klientit vazhdon të ecë.",
              "Ein Team kann seine lokale Aufgabe erledigen, während die Uhr des Kunden weiterläuft.") },
          ],
          note: x(
            "Constructed scene, after Little (1961, 2011) and the value-stream volumes; the essay named below tells the night desk's version.",
            "Skenë e ndërtuar, sipas Little (1961, 2011) dhe vëllimeve për rrjedhën e vlerës; eseja e emërtuar më poshtë tregon versionin e recepsionit të natës.",
            "Konstruierte Szene nach Little (1961, 2011) und den Wertstrom-Bänden; der unten genannte Essay erzählt die Version der Nachtrezeption."),
        },
        {
          id: "ii-concept", layer: "concept",
          title: [x("Little's Law:", "Ligji i Little-it:", "Littles Gesetz:"), x("flow, work and time", "rrjedha, puna dhe koha", "Fluss, Arbeit und Zeit")],
          lead: x(
            "In a stable boundary with coherent long-run averages, throughput and time determine the average amount of work inside.",
            "Në një kufi të qëndrueshëm me mesatare afatgjata koherente, rrjedha dhe koha e përcaktojnë sasinë mesatare të punës brenda.",
            "In einer stabilen Grenze mit kohärenten Langzeitmitteln bestimmen Durchsatz und Zeit die durchschnittliche Arbeitsmenge darin."),
          blocks: [
            { type: "stat", n: "L = λ × W", t: x("L = average number of jobs inside the defined system; λ = average completed jobs per time unit; W = average total time inside", "L = numri mesatar i punëve brenda sistemit të përkufizuar; λ = punët mesatare të përfunduara për njësi kohe; W = koha mesatare e plotë brenda", "L = mittlere Zahl der Aufträge im definierten System; λ = mittlere erledigte Aufträge je Zeiteinheit; W = mittlere Gesamtzeit darin") },
            { type: "p", text: x(
              "John D. C. Little's 1961 result expresses a conservation relation for queueing processes under mathematical conditions. It is not an instruction to accelerate a specific employee. Its main operational value is forcing managers to agree on the boundary: where a job enters, where it leaves and which waiting states are included. If a process completes on average 24 requests per hour and each request stays inside its boundary for 0.5 hour, the implied average work-in-process is 12 requests. This is a fully synthetic illustration of the relation; it says nothing about service times, delays or staffing at a particular hotel or warehouse.",
              "Rezultati i John D. C. Little-it i vitit 1961 shpreh një raport ruajtjeje për proceset e radhëve, në kushte matematike. Nuk është udhëzim për të përshpejtuar një punonjës të caktuar. Vlera e tij kryesore operacionale është që i detyron menaxherët të bien dakord për kufirin: ku hyn një punë, ku del dhe cilat gjendje pritjeje përfshihen. Nëse një proces përfundon mesatarisht 24 kërkesa në orë dhe çdo kërkesë qëndron brenda kufirit 0,5 orë, puna mesatare në proces del 12 kërkesa. Ky është ilustrim krejt sintetik i raportit; nuk thotë asgjë për kohët e shërbimit, vonesat apo stafin e një hoteli ose magazine të caktuar.",
              "John D. C. Littles Ergebnis von 1961 drückt eine Erhaltungsbeziehung für Warteschlangenprozesse unter mathematischen Bedingungen aus. Es ist keine Anweisung, einen bestimmten Mitarbeiter zu beschleunigen. Sein betrieblicher Hauptwert ist, dass es Führungskräfte zwingt, sich auf die Grenze zu einigen: wo ein Auftrag eintritt, wo er austritt und welche Wartezustände mitzählen. Erledigt ein Prozess im Mittel 24 Anfragen je Stunde und bleibt jede Anfrage 0,5 Stunden innerhalb der Grenze, ergibt sich ein mittlerer Bestand von 12 Anfragen. Das ist eine rein synthetische Illustration der Beziehung; sie sagt nichts über Servicezeiten, Verzögerungen oder Personal in einem bestimmten Hotel oder Lager.") },
            { type: "p", text: x(
              "The throughput rate should be consistent with the measured system during the period of analysis. During an accumulating backlog, incoming demand and completed throughput are not interchangeable. Under severe transients, a snapshot of queue length should not be plugged into the long-run formula as though the queue were stable.",
              "Norma e rrjedhës duhet të jetë në përputhje me sistemin e matur gjatë periudhës së analizës. Gjatë një grumbullimi në rritje, kërkesa hyrëse dhe rrjedha e përfunduar nuk janë të këmbyeshme. Nën luhatje të forta, një fotografi e gjatësisë së radhës nuk duhet futur në formulën afatgjatë sikur radha të ishte e qëndrueshme.",
              "Die Durchsatzrate sollte zum gemessenen System im Analysezeitraum passen. Während ein Rückstand wächst, sind eingehende Nachfrage und erledigter Durchsatz nicht austauschbar. Bei starken Übergängen darf eine Momentaufnahme der Warteschlange nicht in die Langzeitformel gesteckt werden, als wäre die Schlange stabil.") },
            { type: "callout", reading: true, text: x(
              "The formula disciplines the definition of the process. It does not diagnose the cause of waiting.",
              "Formula e disiplinon përkufizimin e procesit. Nuk e diagnostikon shkakun e pritjes.",
              "Die Formel diszipliniert die Definition des Prozesses. Sie diagnostiziert nicht die Ursache des Wartens.") },
          ],
          note: x(
            "Little, Operations Research 9(3), 383–387 (1961); Little (2011) for the conditions. The 24 × 0.5 = 12 calculation is hypothetical.",
            "Little, Operations Research 9(3), 383–387 (1961); Little (2011) për kushtet. Llogaria 24 × 0,5 = 12 është hipotetike.",
            "Little, Operations Research 9(3), 383–387 (1961); Little (2011) für die Bedingungen. Die Rechnung 24 × 0,5 = 12 ist hypothetisch."),
          source: ["littlelaw-little-1961", "littlelaw-little-2011"],
        },
        {
          id: "ii-worked", layer: "concept",
          title: [x("One equation,", "Një ekuacion,", "Eine Gleichung,"), x("three useful checks", "tri kontrolle të dobishme", "drei nützliche Prüfungen")],
          lead: x(
            "A reproducible illustration with explicit assumptions, not a performance claim.",
            "Një ilustrim i riprodhueshëm me supozime të qarta, jo pohim performance.",
            "Eine nachvollziehbare Illustration mit ausdrücklichen Annahmen, keine Leistungsbehauptung."),
          blocks: [
            { type: "flag", text: synthetic },
            { type: "rows", compact: true, items: [
              { h: x("Average completion rate: 24 cases/hour", "Norma mesatare e përfundimit: 24 raste/orë", "Mittlere Erledigungsrate: 24 Fälle/Stunde"), p: x("Long-run throughput λ.", "Rrjedha afatgjatë λ.", "Langfristiger Durchsatz λ.") },
              { h: x("Average total time: 0.5 hour/case", "Koha mesatare e plotë: 0,5 orë/rast", "Mittlere Gesamtzeit: 0,5 Stunden/Fall"), p: x("Time in system W.", "Koha në sistem W.", "Zeit im System W.") },
              { h: x("Implied average cases: 12", "Rastet mesatare të nënkuptuara: 12", "Implizierter mittlerer Bestand: 12 Fälle"), p: x("L = 24 × 0.5.", "L = 24 × 0,5.", "L = 24 × 0,5.") },
              { h: x("If time becomes 0.75 h: 18 cases", "Nëse koha bëhet 0,75 orë: 18 raste", "Wird die Zeit 0,75 h: 18 Fälle"), p: x("Only if throughput remains 24/h.", "Vetëm nëse rrjedha mbetet 24/orë.", "Nur wenn der Durchsatz bei 24/h bleibt.") },
            ] },
            { type: "p", text: x(
              "The first three rows describe one hypothetical stable boundary. The fourth is a scenario, not a forecast: holding throughput at 24 cases per hour while average elapsed time increases to 45 minutes implies 18 cases in the system. It does not mean 18 workers are needed; cases may be waiting rather than actively processed. A careful analyst checks conservation first. Are arrivals, departures and the opening and closing queue reconciled? Do all timestamps use the same clock? Are cancelled, abandoned, rerouted or reworked jobs treated consistently? Is the observed period long enough to describe the flow of interest?",
              "Tre rreshtat e parë përshkruajnë një kufi të vetëm hipotetik të qëndrueshëm. I katërti është skenar, jo parashikim: nëse rrjedha mbahet 24 raste në orë, ndërsa koha mesatare rritet në 45 minuta, në sistem dalin 18 raste. Kjo nuk do të thotë se duhen 18 punonjës; rastet mund të jenë në pritje, jo në përpunim aktiv. Një analist i kujdesshëm kontrollon së pari ruajtjen. A pajtohen mbërritjet, daljet dhe radha në hapje dhe në mbyllje? A e përdorin të gjitha orët e regjistruara të njëjtën orë? A trajtohen njëlloj punët e anuluara, të braktisura, të ridrejtuara apo të ripunuara? A është periudha e vëzhguar mjaft e gjatë për ta përshkruar rrjedhën që na intereson?",
              "Die ersten drei Zeilen beschreiben eine einzige hypothetische stabile Grenze. Die vierte ist ein Szenario, keine Prognose: Bleibt der Durchsatz bei 24 Fällen je Stunde, während die mittlere Verweilzeit auf 45 Minuten steigt, ergeben sich 18 Fälle im System. Das heißt nicht, dass 18 Beschäftigte nötig sind; Fälle können warten statt aktiv bearbeitet zu werden. Ein sorgfältiger Analyst prüft zuerst die Erhaltung. Stimmen Ankünfte, Abgänge und die Warteschlange zu Beginn und Ende überein? Verwenden alle Zeitstempel dieselbe Uhr? Werden stornierte, abgebrochene, umgeleitete oder nachbearbeitete Aufträge einheitlich behandelt? Ist der beobachtete Zeitraum lang genug, um den fraglichen Fluss zu beschreiben?") },
            { type: "callout", reading: true, text: x(
              "A mathematically correct equation can still produce a misleading answer when its units and boundary are wrong.",
              "Një ekuacion matematikisht i saktë mund të japë prapë një përgjigje mashtruese, kur njësitë dhe kufiri i tij janë gabim.",
              "Eine mathematisch richtige Gleichung kann trotzdem eine irreführende Antwort liefern, wenn Einheiten und Grenze falsch sind.") },
          ],
          note: x(
            "Little (1961, 2011); all case counts and durations on this page are synthetic.",
            "Little (1961, 2011); të gjitha numrat e rasteve dhe kohët në këtë faqe janë sintetike.",
            "Little (1961, 2011); alle Fallzahlen und Zeiten auf dieser Seite sind synthetisch."),
          source: ["littlelaw-little-1961", "littlelaw-little-2011"],
        },
        {
          id: "ii-protocol", layer: "protocol",
          title: [x("Measure the queue", "Mat radhën", "Die Warteschlange messen,"), x("without blaming it", "pa e fajësuar", "ohne sie zu beschuldigen")],
          lead: x(
            "A compact measurement sequence that does not confuse activity, waiting and failure.",
            "Një radhë e ngjeshur matjeje që nuk e ngatërron veprimtarinë, pritjen dhe dështimin.",
            "Eine kompakte Messfolge, die Tätigkeit, Warten und Versagen nicht verwechselt."),
          blocks: [
            { type: "steps", items: [
              { h: x("Select one service boundary", "Zgjidh një kufi shërbimi", "Eine Servicegrenze wählen"), p: x("A clearly defined kind of work, followed from release into the process to usable completion.", "Një lloj pune i përkufizuar qartë, i ndjekur nga hyrja në proces deri në përfundimin e përdorshëm.", "Eine klar definierte Arbeitsart, von der Freigabe in den Prozess bis zur nutzbaren Fertigstellung.") },
              { h: x("Capture entry and exit", "Shëno hyrjen dhe daljen", "Ein- und Austritt erfassen"), p: x("Permitted, consistent timestamps and a declared convention for interruptions.", "Orë të lejuara dhe të njëtrajtshme, dhe një rregull i deklaruar për ndërprerjet.", "Zulässige, einheitliche Zeitstempel und eine erklärte Konvention für Unterbrechungen.") },
              { h: x("Count pending work", "Numëro punën në pritje", "Offene Arbeit zählen"), p: x("Waiting, active, held for information and finished, at agreed intervals.", "Në pritje, aktive, e mbajtur për informacion dhe e përfunduar, në intervale të rëna dakord.", "Wartend, aktiv, wegen Information gehalten und erledigt, in vereinbarten Intervallen.") },
              { h: x("Reconcile the flow", "Pajto rrjedhën", "Den Fluss abstimmen"), p: x("Opening queue + new arrivals − completions − documented exits = closing queue.", "Radha në hapje + mbërritjet e reja − përfundimet − daljet e dokumentuara = radha në mbyllje.", "Anfangsbestand + neue Ankünfte − Erledigungen − dokumentierte Abgänge = Endbestand.") },
              { h: x("Separate necessary checks", "Ndaj kontrollet e nevojshme", "Notwendige Prüfungen trennen"), p: x("Keep legally required, safety and quality steps; examine avoidable rework and uncertainty.", "Ruaji hapat e detyrueshëm me ligj, të sigurisë dhe të cilësisë; shqyrto ripunimin dhe pasigurinë e shmangshme.", "Gesetzlich vorgeschriebene, Sicherheits- und Qualitätsschritte behalten; vermeidbare Nacharbeit und Unsicherheit prüfen.") },
              { h: x("Review with the owners", "Rishiko me pronarët", "Mit den Verantwortlichen prüfen"), p: x("Ask both sender and receiver whether the numbers describe the actual handover.", "Pyeti dërguesin dhe marrësin nëse numrat e përshkruajnë dorëzimin e vërtetë.", "Sender und Empfänger fragen, ob die Zahlen die tatsächliche Übergabe beschreiben.") },
            ] },
            { type: "p", text: x(
              "Avoid collecting private identifiers in a public case study. A small, properly anonymised sample can be enough to demonstrate the method. If the queue cannot be measured reliably, write “not measured”, state the missing fields and propose a modest data-quality check.",
              "Shmang mbledhjen e identifikuesve privatë në një rast studimi publik. Një mostër e vogël, e anonimizuar siç duhet, mund të mjaftojë për ta treguar metodën. Nëse radha nuk matet dot me besueshmëri, shkruaj “nuk është matur”, thuaj fushat që mungojnë dhe propozo një kontroll modest të cilësisë së të dhënave.",
              "Sammeln Sie in einer öffentlichen Fallstudie keine privaten Kennungen. Eine kleine, sauber anonymisierte Stichprobe kann genügen, um die Methode zu zeigen. Lässt sich die Warteschlange nicht verlässlich messen, schreiben Sie „nicht gemessen“, nennen die fehlenden Felder und schlagen eine bescheidene Datenqualitätsprüfung vor.") },
            { type: "callout", reading: true, text: x(
              "The first output of a queue study should be a trustworthy description, not a verdict about staff effort.",
              "Rezultati i parë i një studimi radhe duhet të jetë një përshkrim i besueshëm, jo një gjykim për përpjekjen e stafit.",
              "Das erste Ergebnis einer Warteschlangenstudie sollte eine vertrauenswürdige Beschreibung sein, kein Urteil über den Einsatz des Personals.") },
          ],
          note: x(
            "Editorial protocol after Little (1961) and NHS England's demand and capacity measurement guidance.",
            "Protokoll editorial sipas Little (1961) dhe udhëzimit të NHS England për matjen e kërkesës dhe kapacitetit.",
            "Redaktionelles Protokoll nach Little (1961) und der Messanleitung von NHS England für Nachfrage und Kapazität."),
          source: ["littlelaw-little-1961", "nhs-demand-capacity"],
        },
      ],
    },

    // Chapter III. The price of full utilization
    {
      id: "ch-iii", type: "chapter", numeral: "III",
      title: x("The price of full utilization", "Çmimi i shfrytëzimit të plotë", "Der Preis voller Auslastung"),
      pages: [
        {
          id: "iii-scene", layer: "scene", more: "80-vehicles-you-cannot-see",
          title: [x("Everyone is busy.", "Të gjithë janë të zënë.", "Alle sind beschäftigt."), x("The line grows.", "Radha rritet.", "Die Schlange wächst.")],
          lead: x(
            "The last few points of utilization may cost more service time than managers expect.",
            "Pikët e fundit të shfrytëzimit mund të kushtojnë më shumë kohë shërbimi nga sa presin menaxherët.",
            "Die letzten Prozentpunkte der Auslastung können mehr Servicezeit kosten, als Führungskräfte erwarten."),
          blocks: [
            { type: "flag", text: x("Constructed illustration, a single workstation", "Ilustrim i ndërtuar, një stacion i vetëm pune", "Konstruierte Illustration, eine einzelne Arbeitsstation") },
            { type: "p", text: x(
              "Imagine one processing station that can finish twelve standard jobs per hour when continuously occupied. On a quiet day, work arrives often enough to keep the station useful, and small gaps absorb variation. As arrivals become heavier, the gaps disappear. A long task, late release or batch of simultaneous arrivals can now push other jobs into a line. The manager sees an employee working continuously and concludes that the desk is efficient. The next employee sees an overflowing queue. Both observations can be true: high utilization explains how much capacity is consumed; it does not, by itself, measure the service experienced by those waiting.",
              "Përfytyro një stacion përpunimi që mund të përfundojë dymbëdhjetë punë standarde në orë kur është i zënë pa ndërprerje. Në një ditë të qetë, puna mbërrin aq shpesh sa stacioni të jetë i dobishëm, dhe boshllëqet e vogla e thithin luhatjen. Kur mbërritjet shtohen, boshllëqet zhduken. Një detyrë e gjatë, një lëshim i vonuar ose një grup mbërritjesh njëherësh mund t'i shtyjë tani punët e tjera në radhë. Menaxheri sheh një punonjës që punon pa ndërprerje dhe përfundon se sporteli është i efektshëm. Punonjësi i radhës sheh një radhë që derdhet. Të dyja vëzhgimet mund të jenë të vërteta: shfrytëzimi i lartë shpjegon sa kapacitet konsumohet; ai nuk e mat vetvetiu shërbimin që përjetojnë ata që presin.",
              "Stellen Sie sich eine Bearbeitungsstation vor, die bei durchgehender Auslastung zwölf Standardaufträge je Stunde schafft. An einem ruhigen Tag kommt Arbeit oft genug, um die Station nützlich zu halten, und kleine Lücken fangen die Streuung auf. Werden die Ankünfte dichter, verschwinden die Lücken. Eine lange Aufgabe, eine späte Freigabe oder ein Schub gleichzeitiger Ankünfte kann andere Aufträge nun in eine Schlange drängen. Die Führungskraft sieht einen durchgehend arbeitenden Mitarbeiter und schließt, der Schalter sei effizient. Der nächste Mitarbeiter sieht eine überlaufende Schlange. Beide Beobachtungen können stimmen: Hohe Auslastung erklärt, wie viel Kapazität verbraucht wird; sie misst nicht von selbst den Service, den die Wartenden erleben.") },
            { type: "p", text: x(
              "The single-station example is intentionally abstract. Last-mile operations involve many workers, vehicles, constraints and changing times. The model can illustrate the mechanism without serving as a valid numerical prediction for the author's dispatcher work.",
              "Shembulli me një stacion është qëllimisht abstrakt. Operacionet e miljes së fundit përfshijnë shumë punonjës, automjete, kufizime dhe kohë që ndryshojnë. Modeli mund ta ilustrojë mekanizmin pa shërbyer si parashikim numerik i vlefshëm për punën e autorit si dispeçer.",
              "Das Beispiel mit einer Station ist bewusst abstrakt. Last-Mile-Betriebe umfassen viele Beschäftigte, Fahrzeuge, Einschränkungen und wechselnde Zeiten. Das Modell kann den Mechanismus zeigen, ohne eine gültige Zahlenvorhersage für die Dispositionsarbeit des Autors zu sein.") },
            { type: "callout", reading: true, text: x(
              "There is a point at which using every available minute makes the next minute much less reliable.",
              "Ka një pikë ku përdorimi i çdo minute në dispozicion e bën minutën e radhës shumë më pak të besueshme.",
              "Es gibt einen Punkt, an dem das Nutzen jeder verfügbaren Minute die nächste Minute viel weniger verlässlich macht.") },
          ],
          note: x(
            "Research framework: Kingman (1961, 1962), Whitt (1992); the workstation and demand are hypothetical. The essay named below is about a fleet no dashboard shows.",
            "Korniza kërkimore: Kingman (1961, 1962), Whitt (1992); stacioni dhe kërkesa janë hipotetike. Eseja e emërtuar më poshtë flet për një flotë që asnjë panel nuk e tregon.",
            "Forschungsrahmen: Kingman (1961, 1962), Whitt (1992); Station und Nachfrage sind hypothetisch. Der unten genannte Essay handelt von einer Flotte, die kein Dashboard zeigt."),
        },
        {
          id: "iii-concept", layer: "concept",
          title: [x("Kingman: the price", "Kingman: çmimi", "Kingman: der Preis"), x("of variability", "i luhatshmërisë", "der Streuung")],
          lead: x(
            "For a single-server G/G/1 queue, a classic approximation connects mean waiting to utilization and variability.",
            "Për një radhë G/G/1 me një shërbyes, një përafrim klasik e lidh pritjen mesatare me shfrytëzimin dhe luhatshmërinë.",
            "Für eine G/G/1-Warteschlange mit einem Bediener verknüpft eine klassische Näherung das mittlere Warten mit Auslastung und Streuung."),
          blocks: [
            { type: "stat", n: "Wq ≈ [(ca² + cs²) / 2] × [ρ / (1 − ρ)] × te", t: x("Wq = expected queue wait; ca and cs = coefficients of variation of arrivals and service; ρ = utilization below 1; te = mean service time", "Wq = pritja e pritshme në radhë; ca dhe cs = koeficientët e variacionit të mbërritjeve dhe të shërbimit; ρ = shfrytëzimi nën 1; te = koha mesatare e shërbimit", "Wq = erwartete Wartezeit; ca und cs = Variationskoeffizienten von Ankünften und Service; ρ = Auslastung unter 1; te = mittlere Servicezeit") },
            { type: "p", text: x(
              "In plain language, the model combines three influences. Greater variation in arrivals or task times raises the waiting burden. Higher utilization reduces the available buffer. Longer processing times scale the size of the delay. The formula is an approximation for a defined single-station queue and is especially useful for showing heavy-traffic sensitivity; it is not a universal capacity target. Take a hypothetical station with exponential arrivals and service times and a mean service time of five minutes. The variability multiplier is then one. The calculation on the next page is exact for that M/M/1 case in steady state; the G/G/1 expression stays an approximation, ρ/(1−ρ) is not a “productivity score”, and five minutes must not be transferred to unloading, driving or a front desk as if they were identical.",
              "Me fjalë të thjeshta, modeli bashkon tri ndikime. Luhatja më e madhe në mbërritje ose në kohët e detyrave e rrit barrën e pritjes. Shfrytëzimi më i lartë e zvogëlon rezervën në dispozicion. Kohët më të gjata të përpunimit e shkallëzojnë madhësinë e vonesës. Formula është përafrim për një radhë të përkufizuar me një stacion dhe është veçanërisht e dobishme për të treguar ndjeshmërinë në trafik të rënduar; nuk është objektiv universal kapaciteti. Merr një stacion hipotetik me mbërritje dhe kohë shërbimi eksponenciale dhe me kohë mesatare shërbimi pesë minuta. Shumëzuesi i luhatshmërisë është atëherë një. Llogaria në faqen tjetër është e saktë për atë rast M/M/1 në gjendje të qëndrueshme; shprehja G/G/1 mbetet përafrim, ρ/(1−ρ) nuk është “pikë produktiviteti”, dhe pesë minutat nuk duhen bartur te shkarkimi, drejtimi apo recepsioni sikur të ishin të njëjta.",
              "In einfachen Worten verbindet das Modell drei Einflüsse. Größere Streuung bei Ankünften oder Aufgabendauern erhöht die Wartelast. Höhere Auslastung verringert den verfügbaren Puffer. Längere Bearbeitungszeiten skalieren die Größe der Verzögerung. Die Formel ist eine Näherung für eine definierte Einzelstation und besonders nützlich, um die Empfindlichkeit bei hoher Last zu zeigen; sie ist kein universelles Kapazitätsziel. Nehmen Sie eine hypothetische Station mit exponentiellen Ankünften und Servicezeiten und einer mittleren Servicezeit von fünf Minuten. Der Streuungsfaktor ist dann eins. Die Rechnung auf der nächsten Seite ist für diesen M/M/1-Fall im stationären Zustand exakt; der G/G/1-Ausdruck bleibt eine Näherung, ρ/(1−ρ) ist kein „Produktivitätswert“, und fünf Minuten dürfen nicht auf Entladen, Fahren oder Rezeption übertragen werden, als wären sie identisch.") },
            { type: "callout", reading: true, text: x(
              "Near capacity, variability is no longer a minor inconvenience. It becomes a queue amplifier.",
              "Afër kapacitetit, luhatshmëria nuk është më një bezdi e vogël. Bëhet zmadhues radhe.",
              "Nahe der Kapazitätsgrenze ist Streuung keine kleine Unannehmlichkeit mehr. Sie wird zum Verstärker der Warteschlange.") },
          ],
          note: x(
            "Kingman (1961, 1962); the VUT form of the approximation as in Factory Physics. Not a measured profile of any employer.",
            "Kingman (1961, 1962); forma VUT e përafrimit si te Factory Physics. Jo profil i matur i ndonjë punëdhënësi.",
            "Kingman (1961, 1962); die VUT-Form der Näherung wie in Factory Physics. Kein gemessenes Profil eines Arbeitgebers."),
          source: ["kingman-1961", "kingman-1962", "factory-physics-2011"],
        },
        {
          id: "iii-model", layer: "concept",
          title: [x("Four load levels,", "Katër nivele ngarkese,", "Vier Laststufen,"), x("one sharp curve", "një kurbë e mprehtë", "eine steile Kurve")],
          lead: x(
            "Under a hypothetical steady M/M/1 queue with a mean service time of five minutes, the expected wait before service is five minutes times ρ/(1−ρ).",
            "Në një radhë hipotetike të qëndrueshme M/M/1 me kohë mesatare shërbimi pesë minuta, pritja e pritshme para shërbimit është pesë minuta herë ρ/(1−ρ).",
            "In einer hypothetischen stationären M/M/1-Warteschlange mit fünf Minuten mittlerer Servicezeit beträgt die erwartete Wartezeit vor dem Service fünf Minuten mal ρ/(1−ρ)."),
          blocks: [
            { type: "flag", text: synthetic },
            { type: "columns", max: 100, height: 120, hypothetical: true,
              label: x("Expected wait before service, minutes, by utilization (M/M/1, te = 5 min)", "Pritja e pritshme para shërbimit, minuta, sipas shfrytëzimit (M/M/1, te = 5 min)", "Erwartete Wartezeit vor dem Service, Minuten, nach Auslastung (M/M/1, te = 5 min)"),
              items: [
                { k: x("70% used", "70% i përdorur", "70 % ausgelastet"), v: 11.7, n: x("11.7", "11,7", "11,7") },
                { k: x("80% used", "80% i përdorur", "80 % ausgelastet"), v: 20, n: x("20.0", "20,0", "20,0") },
                { k: x("90% used", "90% i përdorur", "90 % ausgelastet"), v: 45, n: x("45.0", "45,0", "45,0") },
                { k: x("95% used", "95% i përdorur", "95 % ausgelastet"), v: 95, n: x("95.0", "95,0", "95,0"), alert: true },
              ] },
            { type: "p", text: x(
              "The load factor ρ/(1−ρ) is 2.33 at 70%, 4.00 at 80%, 9.00 at 90% and 19.00 at 95%. With this one-station model, moving from 80% to 95% multiplies the predicted queue wait by 4.75, assuming the same service time and distributional assumptions. That is not a claim that warehouse loading time, route delay or a multi-employee reception will multiply by 4.75. It is a demonstration of non-linear congestion near saturation.",
              "Faktori i ngarkesës ρ/(1−ρ) është 2,33 në 70%, 4,00 në 80%, 9,00 në 90% dhe 19,00 në 95%. Me këtë model me një stacion, kalimi nga 80% në 95% e shumëfishon pritjen e parashikuar në radhë me 4,75, me të njëjtën kohë shërbimi dhe të njëjtat supozime shpërndarjeje. Kjo nuk është pohim se koha e ngarkimit në magazinë, vonesa e rrugës apo një recepsion me shumë punonjës do të shumëfishohen me 4,75. Është demonstrim i mbingarkesës jolineare afër ngopjes.",
              "Der Lastfaktor ρ/(1−ρ) beträgt 2,33 bei 70 %, 4,00 bei 80 %, 9,00 bei 90 % und 19,00 bei 95 %. In diesem Einstationsmodell vervielfacht der Schritt von 80 % auf 95 % die vorhergesagte Wartezeit um 4,75, bei gleicher Servicezeit und gleichen Verteilungsannahmen. Das ist keine Behauptung, dass Ladezeit im Lager, Routenverspätung oder eine Rezeption mit mehreren Beschäftigten sich um 4,75 vervielfachen. Es ist eine Demonstration nichtlinearer Überlastung nahe der Sättigung.") },
            { type: "callout", reading: true, text: x(
              "High utilization makes waiting sensitive to small disruptions; it does not prove that any particular staffing plan is wrong.",
              "Shfrytëzimi i lartë e bën pritjen të ndjeshme ndaj prishjeve të vogla; nuk provon se ndonjë plan i caktuar stafi është i gabuar.",
              "Hohe Auslastung macht das Warten empfindlich gegen kleine Störungen; sie beweist nicht, dass ein bestimmter Personalplan falsch ist.") },
          ],
          note: x(
            "Calculation from the classical M/M/1 special case, Wq = te × ρ/(1−ρ); Kingman (1961) gives the general single-server approximation. All scenarios are hypothetical.",
            "Llogari nga rasti klasik i veçantë M/M/1, Wq = te × ρ/(1−ρ); Kingman (1961) jep përafrimin e përgjithshëm me një shërbyes. Të gjithë skenarët janë hipotetikë.",
            "Rechnung aus dem klassischen M/M/1-Sonderfall, Wq = te × ρ/(1−ρ); Kingman (1961) liefert die allgemeine Einzelbediener-Näherung. Alle Szenarien sind hypothetisch."),
          source: ["kingman-1961"],
        },
        {
          id: "iii-research", layer: "concept",
          title: [x("The 80-vehicle", "Paralajmërimi", "Die Warnung"), x("warning", "i 80 automjeteve", "der 80 Fahrzeuge")],
          lead: x(
            "A fleet is not one server, and a multi-worker operation should not inherit a single-station prediction.",
            "Një flotë nuk është një shërbyes i vetëm, dhe një operacion me shumë punonjës nuk duhet ta trashëgojë parashikimin e një stacioni të vetëm.",
            "Eine Flotte ist kein einzelner Bediener, und ein Betrieb mit vielen Beschäftigten sollte keine Einstationsvorhersage erben."),
          blocks: [
            { type: "p", text: x(
              "Ward Whitt's 1992 research on the efficiency of multi-server service systems shows why the size and structure of a service system matter when choosing a utilization policy. Larger pools of servers can gain efficiency from pooling demand, and higher variability tends to reduce the utilization compatible with a given service standard. That is more nuanced than declaring that all teams must run at 80%, or that any observed utilization above 90% is automatically unacceptable. Whitt's 1993 paper developed approximations for GI/G/m queues, where multiple identical servers serve a common queue under specified assumptions. Real transport networks often have geographic separation, heterogeneous vehicles, different skills, deadlines and time-dependent demand. These constraints limit how much pooling is possible. A spare driver in one location is not necessarily spare capacity for another route.",
              "Kërkimi i Ward Whitt-it i vitit 1992 për efikasitetin e sistemeve të shërbimit me shumë shërbyes tregon pse madhësia dhe struktura e një sistemi shërbimi kanë rëndësi kur zgjidhet një politikë shfrytëzimi. Grupe më të mëdha shërbyesish mund të fitojnë efikasitet nga bashkimi i kërkesës, dhe luhatshmëria më e lartë priret ta ulë shfrytëzimin që pajtohet me një standard të caktuar shërbimi. Kjo është më e hollësishme se të deklarosh se të gjitha ekipet duhet të punojnë në 80%, ose se çdo shfrytëzim mbi 90% është automatikisht i papranueshëm. Punimi i Whitt-it i vitit 1993 zhvilloi përafrime për radhët GI/G/m, ku shumë shërbyes të njëjtë i shërbejnë një radhe të përbashkët, në supozime të caktuara. Rrjetet e vërteta të transportit kanë shpesh ndarje gjeografike, automjete të ndryshme, aftësi të ndryshme, afate dhe kërkesë që ndryshon me kohën. Këto kufizime e kufizojnë sa bashkim është i mundur. Një shofer rezervë në një vend nuk është doemos kapacitet rezervë për një rrugë tjetër.",
              "Ward Whitts Forschung von 1992 zur Effizienz von Servicesystemen mit mehreren Bedienern zeigt, warum Größe und Struktur eines Servicesystems zählen, wenn eine Auslastungspolitik gewählt wird. Größere Bedienerpools können durch gebündelte Nachfrage effizienter werden, und höhere Streuung senkt tendenziell die Auslastung, die mit einem bestimmten Servicestandard vereinbar ist. Das ist differenzierter, als zu erklären, alle Teams müssten mit 80 % laufen oder jede beobachtete Auslastung über 90 % sei automatisch inakzeptabel. Whitts Arbeit von 1993 entwickelte Näherungen für GI/G/m-Warteschlangen, in denen mehrere gleiche Bediener eine gemeinsame Schlange unter bestimmten Annahmen bedienen. Reale Transportnetze haben oft geografische Trennung, verschiedene Fahrzeuge, verschiedene Fähigkeiten, Fristen und zeitabhängige Nachfrage. Diese Einschränkungen begrenzen, wie viel Bündelung möglich ist. Ein freier Fahrer an einem Ort ist nicht unbedingt freie Kapazität für eine andere Route.") },
            { type: "cards", cols: 3, items: [
              { h: x("Pooling", "Bashkimi", "Bündelung"), p: x("Shared flexible capacity may absorb variation better.", "Kapaciteti i përbashkët dhe i lëvizshëm mund ta thithë më mirë luhatjen.", "Gemeinsame flexible Kapazität kann Streuung besser auffangen.") },
              { h: x("Friction", "Fërkimi", "Reibung"), p: x("Skill, location, route and handover rules can prevent sharing.", "Aftësitë, vendi, rruga dhe rregullat e dorëzimit mund ta pengojnë ndarjen.", "Fähigkeit, Ort, Route und Übergaberegeln können das Teilen verhindern.") },
              { h: x("Service", "Shërbimi", "Service"), p: x("Choose capacity against waiting, quality and risk targets.", "Zgjidhe kapacitetin kundrejt objektivave të pritjes, cilësisë dhe rrezikut.", "Kapazität gegen Warte-, Qualitäts- und Risikoziele wählen.") },
            ] },
            { type: "callout", reading: true, text: x(
              "Pool resources only where the work and the rules actually allow them to be pooled.",
              "Bashkoji burimet vetëm aty ku puna dhe rregullat e lejojnë vërtet bashkimin.",
              "Bündeln Sie Ressourcen nur dort, wo Arbeit und Regeln die Bündelung wirklich zulassen.") },
          ],
          note: x(
            "Whitt, Management Science 38(5), 1992, and Production and Operations Management 2(2), 1993; the three cards are editorial.",
            "Whitt, Management Science 38(5), 1992, dhe Production and Operations Management 2(2), 1993; tri kartat janë editoriale.",
            "Whitt, Management Science 38(5), 1992, und Production and Operations Management 2(2), 1993; die drei Karten sind redaktionell."),
          source: ["whitt-1992", "whitt-1993"],
        },
        {
          id: "iii-protocol", layer: "protocol",
          title: [x("Read the curve,", "Lexo kurbën,", "Die Kurve lesen,"), x("then test the pool", "pastaj provo bashkimin", "dann den Pool testen")],
          lead: x(
            "Use the single-station curve to ask why congestion accelerates; use a validated multi-resource model, process measurements or a controlled test to estimate the impact on a real workforce.",
            "Përdore kurbën e një stacioni për të pyetur pse mbingarkesa përshpejtohet; përdor një model të vërtetuar me shumë burime, matje të procesit ose një provë të kontrolluar për të vlerësuar ndikimin në një forcë pune të vërtetë.",
            "Nutzen Sie die Einstationskurve, um zu fragen, warum Überlastung sich beschleunigt; nutzen Sie ein validiertes Mehrressourcenmodell, Prozessmessungen oder einen kontrollierten Test, um die Wirkung auf eine reale Belegschaft zu schätzen."),
          blocks: [
            { type: "steps", items: [
              { h: x("Locate the station that is near its limit", "Gjej stacionin afër kufirit", "Die Station nahe ihrer Grenze finden"), p: x("Measured utilization by window, with the service time and its variation.", "Shfrytëzimi i matur sipas dritares, me kohën e shërbimit dhe luhatjen e saj.", "Gemessene Auslastung je Fenster, mit Servicezeit und ihrer Streuung.") },
              { h: x("Separate the two levers", "Ndaj dy levat", "Die zwei Hebel trennen"), p: x("Less variability in arrivals or tasks, or more effective capacity; each has a different cost.", "Më pak luhatje në mbërritje ose detyra, ose më shumë kapacitet efektiv; secila ka kosto tjetër.", "Weniger Streuung bei Ankünften oder Aufgaben, oder mehr effektive Kapazität; jedes kostet anders.") },
              { h: x("Check what can actually be pooled", "Kontrollo çfarë mund të bashkohet vërtet", "Prüfen, was sich wirklich bündeln lässt"), p: x("Skills, locations, routes, authorisations and handover rules that prevent sharing.", "Aftësitë, vendet, rrugët, autorizimet dhe rregullat e dorëzimit që e pengojnë ndarjen.", "Fähigkeiten, Orte, Routen, Berechtigungen und Übergaberegeln, die das Teilen verhindern.") },
              { h: x("Set the service target first", "Vendos së pari objektivin e shërbimit", "Zuerst das Serviceziel setzen"), p: x("Waiting, quality and risk limits; the utilization that fits them follows.", "Kufijtë e pritjes, cilësisë dhe rrezikut; shfrytëzimi që u përshtatet vjen pas.", "Grenzen für Warten, Qualität und Risiko; die dazu passende Auslastung folgt.") },
              { h: x("Test one change, one window", "Provo një ndryshim, një dritare", "Eine Änderung, ein Fenster testen"), p: x("A bounded pilot with an owner, before any budget or staffing commitment.", "Një pilot i kufizuar me përgjegjës, para çdo angazhimi buxheti ose stafi.", "Ein begrenzter Pilot mit Verantwortlichem, vor jeder Budget- oder Personalzusage.") },
            ] },
            { type: "p", text: x(
              "“More vehicles” is not a conclusion until the limiting activity, timing and permissions are understood. A utilization number without its service target is a description of effort, not a decision.",
              "“Më shumë automjete” nuk është përfundim derisa të kuptohen veprimtaria kufizuese, koha dhe lejet. Një numër shfrytëzimi pa objektivin e tij të shërbimit është përshkrim i përpjekjes, jo vendim.",
              "„Mehr Fahrzeuge“ ist kein Schluss, solange die begrenzende Tätigkeit, der Zeitpunkt und die Berechtigungen nicht verstanden sind. Eine Auslastungszahl ohne ihr Serviceziel beschreibt Einsatz, keine Entscheidung.") },
            { type: "callout", reading: true, text: x(
              "The curve tells you where waiting becomes fragile. Only the real system tells you what to change.",
              "Kurba të thotë ku bëhet e brishtë pritja. Vetëm sistemi i vërtetë të thotë çfarë të ndryshosh.",
              "Die Kurve sagt, wo das Warten zerbrechlich wird. Nur das reale System sagt, was zu ändern ist.") },
          ],
          note: x(
            "Editorial protocol after Kingman (1961) and Whitt (1992, 1993); the author's PDF folds these steps into its research page.",
            "Protokoll editorial sipas Kingman (1961) dhe Whitt (1992, 1993); PDF-ja e autorit i mban këta hapa brenda faqes së kërkimit.",
            "Redaktionelles Protokoll nach Kingman (1961) und Whitt (1992, 1993); das PDF des Autors fasst diese Schritte in seiner Forschungsseite zusammen."),
          source: ["kingman-1961", "whitt-1992", "whitt-1993"],
        },
      ],
    },

    // Chapter IV. The bottleneck moves
    {
      id: "ch-iv", type: "chapter", numeral: "IV",
      title: x("The bottleneck moves", "Pengesa zhvendoset", "Der Engpass wandert"),
      pages: [
        {
          id: "iv-scene", layer: "scene", more: "mistakes-get-lost-between-departments",
          title: [x("The bottleneck", "Pengesa", "Der Engpass"), x("moves", "zhvendoset", "wandert")],
          lead: x(
            "Solving one constrained step can expose another one a few metres, minutes or departments away.",
            "Zgjidhja e një hapi të kufizuar mund të nxjerrë në pah një tjetër, disa metra, minuta ose departamente më tej.",
            "Einen begrenzten Schritt zu lösen kann einen anderen freilegen, ein paar Meter, Minuten oder Abteilungen entfernt."),
          blocks: [
            { type: "flag", text: x("Hypothetical last-mile flow, no claimed performance result", "Rrjedhë hipotetike e miljes së fundit, pa rezultat performance të pretenduar", "Hypothetischer Last-Mile-Fluss, kein behauptetes Leistungsergebnis") },
            { type: "p", text: x(
              "At a fictional loading point, the first pressure is on preparing the load. Management adds preparation help and the work reaches the ramp sooner. The next day the preparation queue is visibly smaller, but departures have not improved. More loads now wait for checks and release. The constraint has moved, or perhaps the original measurement missed it. A manager celebrating the reduction in preparation time has a true local result. The recipient of the complete service may see no gain. This is why adding people to the activity with the most visible queue is not automatically a whole-system solution. The answer depends on which step controls the maximum rate of completed, usable work, at what time and under which quality conditions.",
              "Në një pikë ngarkimi të sajuar, presioni i parë është te përgatitja e ngarkesës. Menaxhmenti shton ndihmë për përgatitjen dhe puna arrin më shpejt në rampë. Të nesërmen radha e përgatitjes është dukshëm më e vogël, por nisjet nuk janë përmirësuar. Tani më shumë ngarkesa presin kontrollet dhe lëshimin. Kufizimi është zhvendosur, ose ndoshta matja e parë nuk e kishte kapur. Një menaxher që feston uljen e kohës së përgatitjes ka një rezultat lokal të vërtetë. Marrësi i shërbimit të plotë mund të mos shohë asnjë përfitim. Prandaj shtimi i njerëzve te veprimtaria me radhën më të dukshme nuk është automatikisht zgjidhje për të gjithë sistemin. Përgjigjja varet nga cili hap e kontrollon normën maksimale të punës së përfunduar dhe të përdorshme, në cilën kohë dhe në cilat kushte cilësie.",
              "An einem erdachten Ladepunkt liegt der erste Druck auf der Vorbereitung der Ladung. Die Führung stellt Hilfe für die Vorbereitung ab, und die Arbeit erreicht die Rampe früher. Am nächsten Tag ist die Vorbereitungsschlange sichtbar kürzer, aber die Abfahrten haben sich nicht verbessert. Mehr Ladungen warten nun auf Prüfung und Freigabe. Der Engpass ist gewandert, oder die ursprüngliche Messung hat ihn verfehlt. Eine Führungskraft, die die kürzere Vorbereitungszeit feiert, hat ein echtes lokales Ergebnis. Der Empfänger der vollständigen Leistung sieht womöglich keinen Gewinn. Deshalb ist es keine Lösung für das ganze System, Leute zur Tätigkeit mit der sichtbarsten Schlange zu schicken. Die Antwort hängt davon ab, welcher Schritt die maximale Rate erledigter, nutzbarer Arbeit bestimmt, zu welcher Zeit und unter welchen Qualitätsbedingungen.") },
            { type: "p", text: x(
              "The author's last-mile experience involved preparation, loading, missing bags, ramp order and departures. There is no documented before-and-after staffing experiment with the specific rates in this story. The scene is deliberately invented to illustrate a coupled flow.",
              "Përvoja e autorit në miljen e fundit përfshinte përgatitjen, ngarkimin, çantat që mungojnë, radhën në rampë dhe nisjet. Nuk ka asnjë eksperiment të dokumentuar para-dhe-pas me stafin me normat e caktuara të këtij rrëfimi. Skena është shpikur me qëllim për të ilustruar një rrjedhë të lidhur.",
              "Die Last-Mile-Erfahrung des Autors umfasste Vorbereitung, Beladung, fehlende Taschen, Rampenordnung und Abfahrten. Es gibt kein dokumentiertes Vorher-nachher-Personalexperiment mit den konkreten Raten dieser Geschichte. Die Szene ist bewusst erfunden, um einen gekoppelten Fluss zu zeigen.") },
            { type: "callout", reading: true, text: x(
              "The line you made shorter may simply have reappeared at the next handover.",
              "Radha që e shkurtove mund të jetë rishfaqur thjesht te dorëzimi i radhës.",
              "Die Schlange, die Sie verkürzt haben, ist vielleicht nur an der nächsten Übergabe wieder aufgetaucht.") },
          ],
          note: x(
            "Research framework: Hopp and Spearman, Factory Physics. All events and implied outcomes are constructed; the essay named below follows a mistake across departments.",
            "Korniza kërkimore: Hopp dhe Spearman, Factory Physics. Të gjitha ngjarjet dhe rezultatet e nënkuptuara janë të ndërtuara; eseja e emërtuar më poshtë e ndjek një gabim nëpër departamente.",
            "Forschungsrahmen: Hopp und Spearman, Factory Physics. Alle Ereignisse und implizierten Ergebnisse sind konstruiert; der unten genannte Essay verfolgt einen Fehler über Abteilungen hinweg."),
        },
        {
          id: "iv-concept", layer: "concept",
          title: [x("The capacity of a chain", "Kapaciteti i një zinxhiri", "Die Kapazität einer Kette"), x("is not its sum", "nuk është shuma e tij", "ist nicht ihre Summe")],
          lead: x(
            "An end-to-end flow is limited by the slowest required step even when other parts appear under-used: for an idealised series of steps with stable rates and no alternate path, sustained throughput cannot exceed the smallest step capacity.",
            "Një rrjedhë nga fillimi në fund kufizohet nga hapi më i ngadaltë i kërkuar, edhe kur pjesët e tjera duken të nënshfrytëzuara: për një varg të idealizuar hapash me norma të qëndrueshme dhe pa rrugë alternative, rrjedha e qëndrueshme nuk mund ta kalojë kapacitetin më të vogël të një hapi.",
            "Ein Fluss von Ende zu Ende ist durch den langsamsten erforderlichen Schritt begrenzt, auch wenn andere Teile unterbeschäftigt wirken: Für eine idealisierte Folge von Schritten mit stabilen Raten und ohne Ausweichpfad kann der dauerhafte Durchsatz die kleinste Schrittkapazität nicht übersteigen."),
          blocks: [
            { type: "flag", text: synthetic },
            { type: "columns", max: 90, height: 105, hypothetical: true,
              label: x("A three-step flow, usable jobs per hour; the chain is capped by release", "Një rrjedhë me tri hapa, punë të përdorshme në orë; zinxhirin e kufizon lëshimi", "Ein Fluss mit drei Schritten, nutzbare Aufträge je Stunde; die Kette ist durch die Freigabe begrenzt"),
              items: [
                { k: x("Preparation", "Përgatitja", "Vorbereitung"), v: 75, n: "75" },
                { k: x("Verification", "Verifikimi", "Prüfung"), v: 70, n: "70" },
                { k: x("Release", "Lëshimi", "Freigabe"), v: 55, n: "55", alert: true },
                { k: x("Preparation upgraded", "Përgatitja e përmirësuar", "Vorbereitung verbessert"), v: 90, n: "90" },
              ] },
            { type: "p", text: x(
              "Imagine a simple three-step flow: preparation can provide 75 usable jobs per hour, verification can handle 70 and release can finish 55. Under the stated simplification, the chain cannot sustainably release more than 55 per hour. Raising preparation from 75 to 90 changes nothing about that bound: a local KPI improves while the customer waits just as long. The next question is not “Which department is least busy?” but “What stops the finished order crossing the boundary the customer cares about?”, and the answer may be information, not motion.",
              "Përfytyro një rrjedhë të thjeshtë me tri hapa: përgatitja jep 75 punë të përdorshme në orë, verifikimi përballon 70 dhe lëshimi përfundon 55. Me thjeshtimin e deklaruar, zinxhiri nuk mund të lëshojë në mënyrë të qëndrueshme më shumë se 55 në orë. Rritja e përgatitjes nga 75 në 90 nuk e ndryshon aspak atë kufi: një KPI lokal përmirësohet, ndërsa klienti pret po aq gjatë. Pyetja e radhës nuk është “Cili departament është më pak i zënë?”, por “Çfarë e pengon porosinë e përfunduar ta kalojë kufirin që i intereson klientit?”, dhe përgjigjja mund të jetë informacioni, jo lëvizja.",
              "Stellen Sie sich einen einfachen Fluss mit drei Schritten vor: Die Vorbereitung liefert 75 nutzbare Aufträge je Stunde, die Prüfung schafft 70, die Freigabe 55. Unter der genannten Vereinfachung kann die Kette dauerhaft nicht mehr als 55 je Stunde freigeben. Die Vorbereitung von 75 auf 90 zu steigern ändert an dieser Grenze nichts: Ein lokaler KPI verbessert sich, während der Kunde genauso lange wartet. Die nächste Frage lautet nicht „Welche Abteilung ist am wenigsten beschäftigt?“, sondern „Was hindert den fertigen Auftrag daran, die Grenze zu überschreiten, die dem Kunden wichtig ist?“, und die Antwort kann Information sein, nicht Bewegung.") },
            { type: "callout", reading: true, text: x(
              "Improving the largest capacity rarely fixes a smaller capacity downstream.",
              "Përmirësimi i kapacitetit më të madh rrallë e rregullon një kapacitet më të vogël më poshtë në zinxhir.",
              "Die größte Kapazität zu verbessern behebt selten eine kleinere Kapazität weiter unten.") },
          ],
          note: x(
            "Illustrative arithmetic and flow logic after Factory Physics; hypothetical capacities, no recorded operating dataset.",
            "Aritmetikë ilustruese dhe logjikë rrjedhe sipas Factory Physics; kapacitete hipotetike, pa të dhëna operative të regjistruara.",
            "Illustrative Arithmetik und Flusslogik nach Factory Physics; hypothetische Kapazitäten, kein aufgezeichneter Betriebsdatensatz."),
          source: ["factory-physics-2011"],
        },
        {
          id: "iv-model", layer: "concept",
          title: [x("Where the constraint", "Ku ndërron vend", "Wo der Engpass"), x("changes place", "kufizimi", "den Platz wechselt")],
          lead: x(
            "A simple serial-flow model to show why improvement needs a second measurement after the change. The rates are invented; the exercise is deterministic and ignores randomness, inventories, rework and job-mix differences.",
            "Një model i thjeshtë rrjedhe në seri, për të treguar pse përmirësimi ka nevojë për një matje të dytë pas ndryshimit. Normat janë të shpikura; ushtrimi është determinist dhe i shpërfill rastësinë, stoqet, ripunimin dhe ndryshimet e përzierjes së punëve.",
            "Ein einfaches Modell eines seriellen Flusses, das zeigt, warum Verbesserung eine zweite Messung nach der Änderung braucht. Die Raten sind erfunden; die Übung ist deterministisch und ignoriert Zufall, Bestände, Nacharbeit und Unterschiede im Auftragsmix."),
          blocks: [
            { type: "flag", text: synthetic },
            { type: "rows", compact: true, items: [
              { h: x("A · first review: 75 / 70 / 55 → chain 55", "A · rishikimi i parë: 75 / 70 / 55 → zinxhiri 55", "A · erste Prüfung: 75 / 70 / 55 → Kette 55"), p: x("Release restricts the whole flow.", "Lëshimi e kufizon gjithë rrjedhën.", "Die Freigabe begrenzt den ganzen Fluss.") },
              { h: x("B · faster prep: 90 / 70 / 55 → chain 55", "B · përgatitje më e shpejtë: 90 / 70 / 55 → zinxhiri 55", "B · schnellere Vorbereitung: 90 / 70 / 55 → Kette 55"), p: x("Preparation speeds up; the total limit does not move.", "Përgatitja shpejtohet; kufiri i përgjithshëm nuk lëviz.", "Die Vorbereitung wird schneller; die Gesamtgrenze bewegt sich nicht.") },
              { h: x("C · release improved: 90 / 70 / 72 → chain 70", "C · lëshimi i përmirësuar: 90 / 70 / 72 → zinxhiri 70", "C · Freigabe verbessert: 90 / 70 / 72 → Kette 70"), p: x("Improving release exposes verification as the lowest step.", "Përmirësimi i lëshimit e nxjerr verifikimin si hapin më të ulët.", "Die bessere Freigabe legt die Prüfung als niedrigsten Schritt frei.") },
              { h: x("D · check deteriorates: 90 / 52 / 72 → chain 52", "D · kontrolli keqësohet: 90 / 52 / 72 → zinxhiri 52", "D · Prüfung verschlechtert sich: 90 / 52 / 72 → Kette 52"), p: x("The checking rate falls and becomes the new constraint.", "Norma e kontrollit bie dhe bëhet kufizimi i ri.", "Die Prüfrate fällt und wird zum neuen Engpass.") },
            ] },
            { type: "p", text: x(
              "In real last-mile work, a queue can migrate between preparation, waiting for a decision, loading, departure and a tour in progress. In a hotel, the limiting service may move between front desk availability, a specialist response or the next shift's capacity. A manager needs a flow-level measure to distinguish such changes from a problem that merely appears in a new dashboard.",
              "Në punën e vërtetë të miljes së fundit, një radhë mund të zhvendoset mes përgatitjes, pritjes për një vendim, ngarkimit, nisjes dhe një turi në ecje. Në një hotel, shërbimi kufizues mund të lëvizë mes disponueshmërisë së recepsionit, përgjigjes së një specialisti ose kapacitetit të turnit të radhës. Një menaxher ka nevojë për një matje në nivel rrjedhe, që t'i dallojë këto ndryshime nga një problem që thjesht shfaqet në një panel të ri.",
              "In der realen Last-Mile-Arbeit kann eine Warteschlange zwischen Vorbereitung, Warten auf eine Entscheidung, Beladung, Abfahrt und laufender Tour wandern. In einem Hotel kann der begrenzende Service zwischen Rezeptionsverfügbarkeit, Antwort eines Spezialisten oder Kapazität der nächsten Schicht wechseln. Eine Führungskraft braucht ein Maß auf Flussebene, um solche Wechsel von einem Problem zu unterscheiden, das bloß in einem neuen Dashboard auftaucht.") },
            { type: "callout", reading: true, text: x(
              "After every local speed-up, re-measure the complete chain.",
              "Pas çdo përshpejtimi lokal, mate sërish të gjithë zinxhirin.",
              "Nach jeder lokalen Beschleunigung die ganze Kette neu messen.") },
          ],
          note: x(
            "Synthetic serial-line example inspired by Hopp and Spearman; values are teaching inputs, not validated estimates for field operations.",
            "Shembull sintetik i një linje në seri, i frymëzuar nga Hopp dhe Spearman; vlerat janë të dhëna mësimore, jo vlerësime të vërtetuara për operacione në terren.",
            "Synthetisches Beispiel einer seriellen Linie nach Hopp und Spearman; die Werte sind Lehrgrößen, keine validierten Schätzungen für den Feldbetrieb."),
          source: ["factory-physics-2011"],
        },
        {
          id: "iv-protocol", layer: "protocol",
          title: [x("Find the constraint", "Gjej kufizimin", "Den Engpass finden,"), x("that matters now", "që ka rëndësi tani", "der jetzt zählt")],
          lead: x(
            "A repeatable sequence for deciding where to investigate, rather than chasing the longest-looking queue.",
            "Një radhë e përsëritshme për të vendosur ku të hetosh, në vend që të ndjekësh radhën që duket më e gjatë.",
            "Eine wiederholbare Folge, um zu entscheiden, wo zu untersuchen ist, statt der längsten sichtbaren Schlange nachzujagen."),
          blocks: [
            { type: "steps", items: [
              { h: x("Name the customer outcome", "Emërto rezultatin për klientin", "Das Kundenergebnis benennen"), p: x("What completed, usable work means, and the deadline.", "Çfarë do të thotë punë e përfunduar dhe e përdorshme, dhe afati.", "Was erledigte, nutzbare Arbeit heißt, und die Frist.") },
              { h: x("Draw the necessary steps", "Vizato hapat e nevojshëm", "Die notwendigen Schritte zeichnen"), p: x("Release decisions and handovers too, not only visible tasks.", "Edhe vendimet e lëshimit dhe dorëzimet, jo vetëm detyrat e dukshme.", "Auch Freigaben und Übergaben, nicht nur sichtbare Aufgaben.") },
              { h: x("Count arrivals and completions", "Numëro mbërritjet dhe përfundimet", "Ankünfte und Erledigungen zählen"), p: x("Queues and effective capacity in the same short windows.", "Radhët dhe kapaciteti efektiv në të njëjtat dritare të shkurtra.", "Warteschlangen und effektive Kapazität in denselben kurzen Fenstern.") },
              { h: x("Check actual blockage", "Kontrollo bllokimin e vërtetë", "Die tatsächliche Blockade prüfen"), p: x("Waiting for skill, equipment, information, safe access or authorization?", "Pritje për aftësi, pajisje, informacion, akses të sigurt apo autorizim?", "Warten auf Fähigkeit, Ausrüstung, Information, sicheren Zugang oder Berechtigung?") },
              { h: x("Test a focused relief", "Provo një lehtësim të përqendruar", "Eine gezielte Entlastung testen"), p: x("One approved condition changed, no control reduced; note the downstream effect.", "Një kusht i miratuar i ndryshuar, asnjë kontroll i pakësuar; shëno efektin më poshtë.", "Eine freigegebene Bedingung geändert, keine Kontrolle gekürzt; die nachgelagerte Wirkung notieren.") },
              { h: x("Measure the next boundary", "Mat kufirin e radhës", "Die nächste Grenze messen"), p: x("Where work accumulates after the change, and whether the customer outcome improves.", "Ku grumbullohet puna pas ndryshimit, dhe nëse rezultati për klientin përmirësohet.", "Wo sich Arbeit nach der Änderung staut und ob sich das Kundenergebnis verbessert.") },
            ] },
            { type: "p", text: x(
              "A bottleneck label is provisional until the local conditions and time window are known. With parallel branches or reroutes, a minimum-capacity equation is not enough: observation, data checks and perhaps simulation are needed, and always a named owner for the next decision.",
              "Etiketa “pengesë” është e përkohshme derisa të njihen kushtet lokale dhe dritarja kohore. Me degë paralele ose ridrejtime, një ekuacion i kapacitetit minimal nuk mjafton: duhen vëzhgim, kontrolle të të dhënave dhe ndoshta simulim, dhe gjithmonë një përgjegjës i emërtuar për vendimin e radhës.",
              "Die Bezeichnung „Engpass“ ist vorläufig, bis lokale Bedingungen und Zeitfenster bekannt sind. Bei parallelen Zweigen oder Umleitungen reicht eine Minimalkapazitätsgleichung nicht: Beobachtung, Datenprüfungen und vielleicht Simulation sind nötig, und immer ein benannter Verantwortlicher für die nächste Entscheidung.") },
            { type: "callout", reading: true, text: x(
              "Manage the rate of completed, usable service. Local speed is only one possible contributor.",
              "Menaxho normën e shërbimit të përfunduar dhe të përdorshëm. Shpejtësia lokale është vetëm një nga kontribuesit e mundshëm.",
              "Steuern Sie die Rate erledigter, nutzbarer Leistung. Lokale Geschwindigkeit ist nur ein möglicher Beitrag.") },
          ],
          note: x(
            "Editorial protocol informed by Factory Physics and multi-server queue research; not an employer-specific procedure.",
            "Protokoll editorial i mbështetur te Factory Physics dhe kërkimi për radhët me shumë shërbyes; jo procedurë e një punëdhënësi të caktuar.",
            "Redaktionelles Protokoll nach Factory Physics und der Forschung zu Warteschlangen mit mehreren Bedienern; kein arbeitgeberspezifisches Verfahren."),
          source: ["factory-physics-2011", "whitt-1993"],
        },
      ],
    },

    // Chapter V. When pressure attacks the standard
    {
      id: "ch-v", type: "chapter", numeral: "V",
      title: x("When pressure attacks the standard", "Kur presioni e sulmon standardin", "Wenn Druck den Standard angreift"),
      pages: [
        {
          id: "v-scene", layer: "scene", more: "how-we-worked-with-damage",
          title: [x("When speed", "Kur shpejtësia", "Wenn Geschwindigkeit"), x("attacks the standard", "e sulmon standardin", "den Standard angreift")],
          lead: x(
            "The more urgent the schedule becomes, the easier it is to confuse a completed task with correctly completed work.",
            "Sa më urgjent bëhet orari, aq më lehtë ngatërrohet një detyrë e kryer me një punë të kryer saktë.",
            "Je dringender der Zeitplan wird, desto leichter verwechselt man eine erledigte Aufgabe mit richtig erledigter Arbeit."),
          blocks: [
            { type: "flag", text: x("Constructed scene; safety and quality requirements stay binding", "Skenë e ndërtuar; kërkesat e sigurisë dhe cilësisë mbeten të detyrueshme", "Konstruierte Szene; Sicherheits- und Qualitätsanforderungen bleiben verbindlich") },
            { type: "p", text: x(
              "A hypothetical departure window is running late. A prepared trolley is almost ready, a driver is waiting and colleagues are answering several questions at once. Someone proposes skipping a final verification to recover time. The suggestion sounds operational: reduce a task now and the vehicle can leave sooner. But if the load is incomplete, the shortcut may transfer the loss to delivery, recovery work and the customer. In the author's real last-mile context, standards covered trolley organization, reporting missing bags and the handling of work in designated zones. Demand and ramp-up created real coordination pressure. There is no verified episode in which the author accepted the proposed shortcut, nor measured causal impact of one hypothetical check on delay or incomplete orders.",
              "Një dritare hipotetike nisjeje po vonohet. Një karrocë e përgatitur është gati pothuajse, një shofer pret dhe kolegët u përgjigjen disa pyetjeve njëherësh. Dikush propozon ta kapërcejnë një verifikim të fundit për të fituar kohë. Sugjerimi tingëllon operacional: pakëso një detyrë tani dhe automjeti niset më shpejt. Por nëse ngarkesa është e paplotë, rruga e shkurtër mund ta bartë humbjen te dorëzimi, puna e rikuperimit dhe klienti. Në kontekstin e vërtetë të autorit në miljen e fundit, standardet mbulonin organizimin e karrocave, raportimin e çantave që mungonin dhe trajtimin e punës në zona të caktuara. Kërkesa dhe hyrja e të rinjve në punë krijonin presion të vërtetë koordinimi. Nuk ka asnjë episod të verifikuar ku autori e pranoi rrugën e shkurtër të propozuar, as ndikim shkakësor të matur të një kontrolli hipotetik mbi vonesën apo porositë e paplota.",
              "Ein hypothetisches Abfahrtsfenster läuft spät. Ein vorbereiteter Wagen ist fast fertig, ein Fahrer wartet, Kollegen beantworten mehrere Fragen zugleich. Jemand schlägt vor, eine letzte Prüfung auszulassen, um Zeit aufzuholen. Der Vorschlag klingt betrieblich: eine Aufgabe jetzt kürzen, und das Fahrzeug kann früher losfahren. Doch ist die Ladung unvollständig, verschiebt die Abkürzung den Verlust womöglich auf Zustellung, Nacharbeit und Kunden. Im realen Last-Mile-Kontext des Autors deckten Standards die Wagenordnung, das Melden fehlender Taschen und die Arbeit in festgelegten Zonen ab. Nachfrage und Einarbeitung erzeugten echten Koordinationsdruck. Es gibt keine geprüfte Episode, in der der Autor die vorgeschlagene Abkürzung annahm, und keine gemessene kausale Wirkung einer hypothetischen Prüfung auf Verspätung oder unvollständige Aufträge.") },
            { type: "p", text: x(
              "Pressure does not erase the difference between optional effort and required control. Managers can adjust sequencing and capacity through authorized methods. They should not redefine a safety- or quality-critical step as waste merely because the queue is visible.",
              "Presioni nuk e fshin dallimin mes përpjekjes fakultative dhe kontrollit të kërkuar. Menaxherët mund ta përshtatin radhitjen dhe kapacitetin me metoda të autorizuara. Nuk duhet ta ripërkufizojnë si humbje një hap kritik për sigurinë ose cilësinë, vetëm sepse radha është e dukshme.",
              "Druck hebt den Unterschied zwischen freiwilligem Aufwand und vorgeschriebener Kontrolle nicht auf. Führungskräfte können Reihenfolge und Kapazität mit zugelassenen Mitteln anpassen. Sie sollten einen sicherheits- oder qualitätskritischen Schritt nicht als Verschwendung umdeuten, nur weil die Schlange sichtbar ist.") },
            { type: "callout", reading: true, text: x(
              "A quicker departure is not a better service if it exports an unresolved defect.",
              "Një nisje më e shpejtë nuk është shërbim më i mirë, nëse eksporton një defekt të pazgjidhur.",
              "Eine schnellere Abfahrt ist kein besserer Service, wenn sie einen ungelösten Mangel weitergibt.") },
          ],
          note: x(
            "Editorial illustration of an operational trade-off, not a specific employer incident; framework Factory Physics. The essay named below is about damage worked on, not hidden.",
            "Ilustrim editorial i një kompromisi operacional, jo ngjarje e një punëdhënësi të caktuar; korniza Factory Physics. Eseja e emërtuar më poshtë flet për dëmin e punuar, jo të fshehur.",
            "Redaktionelle Illustration eines betrieblichen Zielkonflikts, kein Vorfall bei einem bestimmten Arbeitgeber; Rahmen Factory Physics. Der unten genannte Essay handelt von bearbeiteten, nicht versteckten Schäden."),
        },
        {
          id: "v-concept", layer: "concept",
          title: [x("The false gain", "Fitimi i rremë", "Der falsche Gewinn"), x("of local speed", "i shpejtësisë lokale", "lokaler Geschwindigkeit")],
          lead: x(
            "A useful capacity measure counts usable output and the cost of work that comes back. Gross throughput counts all attempted completions; good throughput counts results that meet the agreed customer and quality requirements. The gap matters when defects trigger repacking, new handling, explanations, complaint work or another turn through the process.",
            "Një matje e dobishme e kapacitetit numëron rezultatin e përdorshëm dhe koston e punës që kthehet pas. Rrjedha bruto numëron të gjitha përfundimet e tentuara; rrjedha e mirë numëron rezultatet që i plotësojnë kërkesat e rëna dakord të klientit dhe cilësisë. Hendeku ka rëndësi kur defektet shkaktojnë ripaketim, trajtim të ri, shpjegime, punë me ankesa ose një kalim tjetër nëpër proces.",
            "Ein nützliches Kapazitätsmaß zählt die nutzbare Leistung und die Kosten der Arbeit, die zurückkommt. Der Bruttodurchsatz zählt alle versuchten Fertigstellungen; der gute Durchsatz zählt Ergebnisse, die die vereinbarten Kunden- und Qualitätsanforderungen erfüllen. Die Lücke zählt, wenn Mängel Umpacken, neue Handhabung, Erklärungen, Beschwerdearbeit oder einen weiteren Durchlauf auslösen."),
          blocks: [
            { type: "flag", text: synthetic },
            { type: "rows", compact: true, items: [
              { h: x("Before change: 100 gross, 94 good, 94.0% first pass", "Para ndryshimit: 100 bruto, 94 të mira, 94,0% pa ripunim", "Vor der Änderung: 100 brutto, 94 gut, 94,0 % im ersten Durchlauf"), p: x("One hypothetical window.", "Një dritare hipotetike.", "Ein hypothetisches Fenster.") },
              { h: x("After speed-up: 110 gross, 97 good, 88.2% first pass", "Pas përshpejtimit: 110 bruto, 97 të mira, 88,2% pa ripunim", "Nach der Beschleunigung: 110 brutto, 97 gut, 88,2 % im ersten Durchlauf"), p: x("Good output rose by three; first-pass acceptance fell.", "Rezultati i mirë u rrit me tre; pranimi pa ripunim ra.", "Die gute Leistung stieg um drei; die Erstdurchlaufquote fiel.") },
            ] },
            { type: "p", text: x(
              "Suppose an imaginary workstation processes 100 items and only 94 are accepted without rework: first-pass acceptance is 94%. If a change raises gross output to 110 but only 97 are accepted, good output increased by three while first-pass acceptance fell to about 88.2%. These numbers are fictional and cannot be used to judge a named driver or an improvement in the author's workplace. Neither ratio proves the change is good or bad without labour input, risk, costs, service impact and demand. The example teaches a measurement boundary: if managers report only “more work done”, they can overlook the burden shifted to the next team. Quality, safety and employee fatigue are constraints on acceptable solutions, not just secondary scorecards.",
              "Supozo se një stacion imagjinar përpunon 100 artikuj dhe vetëm 94 pranohen pa ripunim: pranimi pa ripunim është 94%. Nëse një ndryshim e rrit rezultatin bruto në 110, por pranohen vetëm 97, rezultati i mirë u rrit me tre, ndërsa pranimi pa ripunim ra në rreth 88,2%. Këta numra janë të sajuar dhe nuk mund të përdoren për të gjykuar një shofer të caktuar apo një përmirësim në vendin e punës së autorit. Asnjëri raport nuk provon se ndryshimi është i mirë apo i keq, pa punën e shpenzuar, rrezikun, kostot, ndikimin te shërbimi dhe kërkesën. Shembulli mëson një kufi matjeje: nëse menaxherët raportojnë vetëm “më shumë punë e bërë”, mund ta shpërfillin barrën e zhvendosur te ekipi i radhës. Cilësia, siguria dhe lodhja e punonjësve janë kufizime për zgjidhjet e pranueshme, jo thjesht tabela dytësore.",
              "Angenommen, eine erdachte Station bearbeitet 100 Artikel, und nur 94 werden ohne Nacharbeit angenommen: Die Erstdurchlaufquote beträgt 94 %. Steigert eine Änderung die Bruttoleistung auf 110, werden aber nur 97 angenommen, stieg die gute Leistung um drei, während die Erstdurchlaufquote auf etwa 88,2 % fiel. Diese Zahlen sind erfunden und taugen nicht, einen bestimmten Fahrer oder eine Verbesserung im Betrieb des Autors zu beurteilen. Keines der Verhältnisse beweist ohne Arbeitseinsatz, Risiko, Kosten, Servicewirkung und Nachfrage, ob die Änderung gut oder schlecht ist. Das Beispiel lehrt eine Messgrenze: Berichten Führungskräfte nur „mehr Arbeit erledigt“, übersehen sie die Last, die zum nächsten Team verschoben wurde. Qualität, Sicherheit und Ermüdung der Beschäftigten sind Grenzen zulässiger Lösungen, nicht bloß zweitrangige Kennzahlen.") },
            { type: "callout", reading: true, text: x(
              "Measure speed together with the amount of work the next person can use without correction.",
              "Mate shpejtësinë bashkë me sasinë e punës që personi i radhës mund ta përdorë pa korrigjim.",
              "Messen Sie Geschwindigkeit zusammen mit der Menge Arbeit, die die nächste Person ohne Korrektur nutzen kann.") },
          ],
          note: x(
            "Synthetic first-pass example; interpretation after Factory Physics and the value-stream measures of Volume 2; no local causal inference.",
            "Shembull sintetik pranimi pa ripunim; interpretimi sipas Factory Physics dhe matjeve të rrjedhës së vlerës të Vëllimit 2; asnjë përfundim shkakësor lokal.",
            "Synthetisches Erstdurchlaufbeispiel; Deutung nach Factory Physics und den Wertstrommaßen von Band 2; keine lokale kausale Folgerung."),
          source: ["factory-physics-2011"],
        },
        {
          id: "v-research", layer: "concept",
          title: [x("Peak pressure", "Presioni i kulmit", "Spitzendruck"), x("is time-dependent", "varet nga koha", "ist zeitabhängig")],
          lead: x(
            "Stationary averages can conceal the timing of congestion even in rigorously studied service models. Eick, Massey and Whitt (1993) studied time-dependent arrival rates in an infinite-server queue. Their paper shows that the number of busy resources at a moment can depend on the service-time distribution and the history of arrivals, not just the arrival rate visible at that instant.",
            "Mesataret e palëvizshme mund ta fshehin kohën e mbingarkesës edhe në modele shërbimi të studiuara rreptësisht. Eick, Massey dhe Whitt (1993) studiuan norma mbërritjeje që ndryshojnë me kohën në një radhë me shërbyes të pafund. Punimi i tyre tregon se numri i burimeve të zëna në një çast mund të varet nga shpërndarja e kohës së shërbimit dhe nga historia e mbërritjeve, jo vetëm nga norma e mbërritjes që duket në atë çast.",
            "Stationäre Mittelwerte können den Zeitpunkt der Überlastung verbergen, selbst in streng untersuchten Servicemodellen. Eick, Massey und Whitt (1993) untersuchten zeitabhängige Ankunftsraten in einer Warteschlange mit unendlich vielen Bedienern. Ihre Arbeit zeigt, dass die Zahl belegter Ressourcen in einem Moment von der Servicezeitverteilung und der Ankunftsgeschichte abhängen kann, nicht nur von der in diesem Augenblick sichtbaren Ankunftsrate."),
          blocks: [
            { type: "p", text: x(
              "This is a mathematical model of a particular system, not a direct measurement of loading ramps or hotel demand. For practical operations, the transferable question is powerful: when does work enter, how long does it remain active and at what times does the system carry its largest unfinished workload? A surge may continue to influence congestion after new arrivals have slowed, because work that entered during the peak has not yet finished. The model assumes infinitely many servers and therefore removes waiting due to a capacity limit. Real operations have finite resources, making its numerical predictions unsuitable as direct estimates of real queues. Its value here is to underscore that staffing based only on a daily mean or a peak arrival count may overlook the workload already occupying the system.",
              "Ky është model matematik i një sistemi të caktuar, jo matje e drejtpërdrejtë e rampave të ngarkimit apo e kërkesës në hotel. Për operacionet praktike, pyetja e transferueshme është e fuqishme: kur hyn puna, sa gjatë mbetet aktive dhe në cilat kohë sistemi mban ngarkesën më të madhe të papërfunduar? Një valë mund të vazhdojë të ndikojë te mbingarkesa edhe pasi mbërritjet e reja janë ngadalësuar, sepse puna që hyri gjatë kulmit nuk ka përfunduar ende. Modeli supozon pafund shërbyes dhe prandaj e heq pritjen për shkak të kufirit të kapacitetit. Operacionet e vërteta kanë burime të fundme, kështu që parashikimet e tij numerike nuk përshtaten si vlerësime të drejtpërdrejta të radhëve të vërteta. Vlera e tij këtu është të theksojë se stafi i planifikuar vetëm mbi një mesatare ditore ose një numër kulmor mbërritjesh mund ta shpërfillë ngarkesën që tashmë e zë sistemin.",
              "Das ist ein mathematisches Modell eines bestimmten Systems, keine direkte Messung von Laderampen oder Hotelnachfrage. Für die Praxis ist die übertragbare Frage stark: Wann tritt Arbeit ein, wie lange bleibt sie aktiv, und zu welchen Zeiten trägt das System seine größte unerledigte Last? Ein Schub kann die Überlastung weiter beeinflussen, nachdem neue Ankünfte abgeflaut sind, weil Arbeit aus der Spitze noch nicht fertig ist. Das Modell nimmt unendlich viele Bediener an und entfernt damit das Warten wegen einer Kapazitätsgrenze. Reale Betriebe haben endliche Ressourcen, sodass seine Zahlen nicht als direkte Schätzungen realer Warteschlangen taugen. Sein Wert liegt hier darin zu unterstreichen, dass eine Personalplanung nur nach Tagesmittel oder Spitzenankünften die Last übersehen kann, die das System bereits belegt.") },
            { type: "cards", cols: 3, items: [
              { h: x("Arrival profile", "Profili i mbërritjes", "Ankunftsprofil"), p: x("Demand varies by window; daily averages erase sequence.", "Kërkesa ndryshon sipas dritares; mesataret ditore e fshijnë radhën.", "Nachfrage variiert je Fenster; Tagesmittel löschen die Abfolge.") },
              { h: x("Service duration", "Kohëzgjatja e shërbimit", "Servicedauer"), p: x("Tasks overlap in time; the tail of a surge may persist.", "Detyrat mbivendosen në kohë; bishti i një vale mund të zgjasë.", "Aufgaben überlappen sich; der Ausläufer eines Schubs kann anhalten.") },
              { h: x("Capacity limit", "Kufiri i kapacitetit", "Kapazitätsgrenze"), p: x("Real work has finite skills, resources and permissions.", "Puna e vërtetë ka aftësi, burime dhe leje të fundme.", "Reale Arbeit hat endliche Fähigkeiten, Ressourcen und Berechtigungen.") },
            ] },
            { type: "callout", reading: true, text: x(
              "A peak can end on the arrival chart before it ends in the work.",
              "Një kulm mund të mbarojë në grafikun e mbërritjeve para se të mbarojë në punë.",
              "Eine Spitze kann im Ankunftsdiagramm enden, bevor sie in der Arbeit endet.") },
          ],
          note: x(
            "Eick, Massey and Whitt, Operations Research 41(4), 731–742 (1993); the operational application is interpretive.",
            "Eick, Massey dhe Whitt, Operations Research 41(4), 731–742 (1993); zbatimi operacional është interpretues.",
            "Eick, Massey und Whitt, Operations Research 41(4), 731–742 (1993); die betriebliche Anwendung ist deutend."),
          source: ["eick-massey-whitt-1993"],
        },
        {
          id: "v-protocol", layer: "protocol",
          title: [x("Pressure without", "Presion pa", "Druck ohne"), x("silent exceptions", "përjashtime të heshtura", "stille Ausnahmen")],
          lead: x(
            "Plan the response to a peak while keeping the non-negotiable conditions visible.",
            "Planifiko përgjigjen ndaj një kulmi, duke i mbajtur të dukshme kushtet që nuk negociohen.",
            "Planen Sie die Antwort auf eine Spitze und halten Sie die nicht verhandelbaren Bedingungen sichtbar."),
          blocks: [
            { type: "steps", items: [
              { h: x("Name the protected standards", "Emërto standardet e mbrojtura", "Die geschützten Standards benennen"), p: x("Required controls, legal rest rules and safety limits, before the shift.", "Kontrollet e kërkuara, rregullat ligjore të pushimit dhe kufijtë e sigurisë, para turnit.", "Vorgeschriebene Kontrollen, gesetzliche Ruheregeln und Sicherheitsgrenzen, vor der Schicht.") },
              { h: x("Set a visible trigger", "Vendos një shkas të dukshëm", "Einen sichtbaren Auslöser festlegen"), p: x("A measured queue, unfinished workload or service threshold, not an impression.", "Një radhë e matur, ngarkesë e papërfunduar ose prag shërbimi, jo një përshtypje.", "Eine gemessene Schlange, unerledigte Last oder Serviceschwelle, kein Eindruck.") },
              { h: x("Separate response lanes", "Ndaj korsitë e përgjigjes", "Reaktionswege trennen"), p: x("Safety concerns follow approved escalation; routine congestion uses authorized capacity and sequence choices.", "Shqetësimet e sigurisë ndjekin eskalimin e miratuar; mbingarkesa rutinë përdor zgjedhje të autorizuara kapaciteti dhe radhitjeje.", "Sicherheitsfragen folgen der freigegebenen Eskalation; Routineüberlastung nutzt zugelassene Kapazitäts- und Reihenfolgeoptionen.") },
              { h: x("Rebalance only usable capacity", "Ribalanco vetëm kapacitetin e përdorshëm", "Nur nutzbare Kapazität umverteilen"), p: x("Skills, place, timing and authorization, before moving help.", "Aftësitë, vendi, koha dhe autorizimi, para se të lëvizësh ndihmë.", "Fähigkeiten, Ort, Zeitpunkt und Berechtigung, bevor Hilfe verschoben wird.") },
              { h: x("Record trade-offs", "Shëno kompromiset", "Zielkonflikte festhalten"), p: x("Accepted completions, backlog, rework and the customer effect, together.", "Përfundimet e pranuara, grumbullimi, ripunimi dhe efekti te klienti, bashkë.", "Angenommene Erledigungen, Rückstand, Nacharbeit und Kundenwirkung, zusammen.") },
              { h: x("Close and learn", "Mbyll dhe mëso", "Abschließen und lernen"), p: x("What changed, what stayed open, whether a forecast or standard needs review.", "Çfarë ndryshoi, çfarë mbeti e hapur, nëse një parashikim ose standard duhet rishikuar.", "Was sich änderte, was offen blieb, ob Prognose oder Standard zu prüfen sind.") },
            ] },
            { type: "p", text: x(
              "Treat exception reporting as information. It is not proof that a colleague is careless, and it is not permission to ignore deliberate breaches of critical procedures. An honest report about a constraint should improve the plan, not make the reporter disappear from the chart.",
              "Trajtoje raportimin e përjashtimeve si informacion. Nuk është provë se një koleg është i pakujdesshëm, as leje për t'i shpërfillur shkeljet e qëllimshme të procedurave kritike. Një raport i ndershëm për një kufizim duhet ta përmirësojë planin, jo ta zhdukë raportuesin nga grafiku.",
              "Behandeln Sie Ausnahmemeldungen als Information. Sie sind kein Beweis für Nachlässigkeit eines Kollegen und keine Erlaubnis, absichtliche Verstöße gegen kritische Verfahren zu ignorieren. Ein ehrlicher Bericht über eine Einschränkung soll den Plan verbessern, nicht den Melder aus dem Diagramm verschwinden lassen.") },
            { type: "callout", reading: true, text: x(
              "Resilience is a method for responding to pressure, not a license to bypass the standard.",
              "Qëndrueshmëria është metodë për t'iu përgjigjur presionit, jo leje për ta anashkaluar standardin.",
              "Widerstandsfähigkeit ist eine Methode, auf Druck zu antworten, keine Lizenz, den Standard zu umgehen.") },
          ],
          note: x(
            "Editorial peak-response protocol informed by the variability models above and everyday operational safeguards; local authorization always governs.",
            "Protokoll editorial për përgjigjen ndaj kulmit, i mbështetur te modelet e luhatshmërisë më sipër dhe te mbrojtjet e përditshme operacionale; autorizimi lokal vendos gjithmonë.",
            "Redaktionelles Spitzenreaktionsprotokoll nach den obigen Streuungsmodellen und alltäglichen betrieblichen Schutzvorkehrungen; die lokale Berechtigung entscheidet immer."),
          source: ["kingman-1961", "eick-massey-whitt-1993"],
        },
      ],
    },

    // Chapter VI. Designing capacity for reality
    {
      id: "ch-vi", type: "chapter", numeral: "VI",
      title: x("Designing capacity for reality", "Projektimi i kapacitetit për realitetin", "Kapazität für die Wirklichkeit gestalten"),
      pages: [
        {
          id: "vi-scene", layer: "scene", more: "ten-minutes-before-the-shift",
          title: [x("A plan with", "Një plan me", "Ein Plan mit"), x("room to move", "hapësirë për të lëvizur", "Spielraum")],
          lead: x(
            "The ideal roster is not necessarily the roster that survives an ordinary bad hour.",
            "Lista ideale e turnit nuk është doemos lista që i mbijeton një ore të zakonshme të keqe.",
            "Der ideale Dienstplan ist nicht unbedingt der, der eine gewöhnliche schlechte Stunde übersteht."),
          blocks: [
            { type: "flag", text: x("Hypothetical planning meeting, no verified employer result", "Mbledhje planifikimi hipotetike, pa rezultat të verifikuar punëdhënësi", "Hypothetische Planungsbesprechung, kein geprüftes Arbeitgeberergebnis") },
            { type: "p", text: x(
              "A planning team has enough scheduled resources for the expected volume. Every assigned minute has a job. The plan looks economical. One supervisor asks a different question: what happens if arrivals cluster, a vehicle becomes unavailable or a newly trained employee needs assistance? The spreadsheet has no answer, because “available capacity” has been defined as if it were independent of the day's conditions. The team does not immediately demand more resources. First it distinguishes the work that can be shifted in time, the work that cannot, and the roles that can substitute for one another. It tests whether a small reserve, an earlier quality check or a more realistic release schedule changes the end-to-end outcome. The decision is based on a scenario with assumptions, not on an inspiring target for maximum occupancy.",
              "Një ekip planifikimi ka mjaft burime të planifikuara për volumin e pritshëm. Çdo minutë e caktuar ka një punë. Plani duket ekonomik. Një mbikëqyrës bën një pyetje tjetër: çfarë ndodh nëse mbërritjet grumbullohen, një automjet del jashtë përdorimit ose një punonjës i sapotrajnuar ka nevojë për ndihmë? Tabela nuk ka përgjigje, sepse “kapaciteti i disponueshëm” është përkufizuar sikur të ishte i pavarur nga kushtet e ditës. Ekipi nuk kërkon menjëherë më shumë burime. Së pari e dallon punën që mund të zhvendoset në kohë, punën që nuk mund të zhvendoset, dhe rolet që mund të zëvendësojnë njëri-tjetrin. Provon nëse një rezervë e vogël, një kontroll cilësie më i hershëm ose një orar lëshimi më realist e ndryshon rezultatin nga fillimi në fund. Vendimi mbështetet në një skenar me supozime, jo në një objektiv frymëzues për zënie maksimale.",
              "Ein Planungsteam hat genug eingeplante Ressourcen für das erwartete Volumen. Jede zugewiesene Minute hat eine Aufgabe. Der Plan wirkt sparsam. Eine Vorgesetzte stellt eine andere Frage: Was geschieht, wenn Ankünfte sich ballen, ein Fahrzeug ausfällt oder ein frisch geschulter Mitarbeiter Hilfe braucht? Die Tabelle hat keine Antwort, weil „verfügbare Kapazität“ definiert wurde, als wäre sie von den Bedingungen des Tages unabhängig. Das Team fordert nicht sofort mehr Ressourcen. Zuerst unterscheidet es die Arbeit, die sich zeitlich verschieben lässt, die, die es nicht kann, und die Rollen, die einander vertreten können. Es prüft, ob eine kleine Reserve, eine frühere Qualitätsprüfung oder ein realistischerer Freigabeplan das Ergebnis von Ende zu Ende verändert. Die Entscheidung beruht auf einem Szenario mit Annahmen, nicht auf einem inspirierenden Ziel maximaler Belegung.") },
            { type: "p", text: x(
              "The author's work across last-mile, hotel shifts and wholesale coordination motivates the question, but there is no recorded instance of this precise planning meeting or a measured outcome from a particular reserve-capacity initiative.",
              "Puna e autorit në miljen e fundit, turnet e hotelit dhe koordinimin me shumicë e motivon pyetjen, por nuk ka asnjë rast të regjistruar të kësaj mbledhjeje të saktë planifikimi, as rezultat të matur nga ndonjë nismë e caktuar për kapacitet rezervë.",
              "Die Arbeit des Autors auf der letzten Meile, in Hotelschichten und in der Großhandelskoordination begründet die Frage, doch es gibt keinen aufgezeichneten Fall dieser genauen Planungsbesprechung und kein gemessenes Ergebnis einer bestimmten Reservekapazitätsinitiative.") },
            { type: "callout", reading: true, text: x(
              "A good plan includes a response to uncertainty, not a pretence that uncertainty has been eliminated.",
              "Një plan i mirë përfshin një përgjigje ndaj pasigurisë, jo shtirjen se pasiguria është eliminuar.",
              "Ein guter Plan enthält eine Antwort auf Unsicherheit, keine Vortäuschung, Unsicherheit sei beseitigt.") },
          ],
          note: x(
            "Constructed scenario after Factory Physics and NHS England's demand and capacity guidance; the essay named below is the ten minutes before a shift.",
            "Skenar i ndërtuar sipas Factory Physics dhe udhëzimit të NHS England për kërkesën dhe kapacitetin; eseja e emërtuar më poshtë janë dhjetë minutat para turnit.",
            "Konstruiertes Szenario nach Factory Physics und der Nachfrage- und Kapazitätsanleitung von NHS England; der unten genannte Essay sind die zehn Minuten vor der Schicht."),
        },
        {
          id: "vi-concept", layer: "concept",
          title: [x("Buffers are not", "Rezervat nuk janë", "Puffer sind kein"), x("a moral failure", "dështim moral", "moralisches Versagen")],
          lead: x(
            "Time, capacity and limited work-in-process are three ways of coping with uncertain arrivals and service times, each with a cost: long lead times hide defects, idle resources cost money, unfinished work lengthens the wait. No universal percentage tells every service to reserve the same capacity.",
            "Koha, kapaciteti dhe puna e kufizuar në proces janë tri mënyra për t'u përballur me mbërritje dhe kohë shërbimi të pasigurta, secila me kosto: kohët e gjata fshehin defekte, burimet e papërdorura kushtojnë, puna e papërfunduar e zgjat pritjen. Asnjë përqindje universale nuk i thotë çdo shërbimi të rezervojë të njëjtin kapacitet.",
            "Zeit, Kapazität und begrenzter Bestand in Arbeit sind drei Wege, mit unsicheren Ankünften und Servicezeiten umzugehen, jeder mit Kosten: Lange Durchlaufzeiten verbergen Mängel, ungenutzte Ressourcen kosten Geld, unerledigte Arbeit verlängert das Warten. Kein universeller Prozentsatz sagt jedem Service, dieselbe Kapazität zu reservieren."),
          blocks: [
            { type: "flag", text: synthetic },
            { type: "stat", hypothetical: true, n: x("Δ backlog = (arrivals − completions) × time", "Δ grumbullimi = (mbërritjet − përfundimet) × koha", "Δ Rückstand = (Ankünfte − Erledigungen) × Zeit"), t: x("synthetic surge: (12/h − 10/h) × 2 h = 4 jobs waiting at the end of the window", "valë sintetike: (12/orë − 10/orë) × 2 orë = 4 punë në pritje në fund të dritares", "synthetischer Schub: (12/h − 10/h) × 2 h = 4 wartende Aufträge am Ende des Fensters") },
            { type: "p", text: x(
              "A station that receives 12 jobs an hour for two hours and finishes 10 an hour accumulates four, ignoring variation, lost jobs and an initial queue. That is not a stable queue and must not be fed into Little's steady-state averages. The next planning question is the recovery window: how fast can the backlog fall once demand drops, without sacrificing safety or creating rework? NHS England's models separate required from available capacity and update as local data change; the clinical model must be adapted, not copied.",
              "Një stacion që merr 12 punë në orë për dy orë dhe përfundon 10 në orë grumbullon katër, duke shpërfillur luhatjen, punët e humbura dhe një radhë fillestare. Kjo nuk është radhë e qëndrueshme dhe nuk duhet futur në mesataret e gjendjes së qëndrueshme të Little-it. Pyetja e radhës e planifikimit është dritarja e rikuperimit: sa shpejt mund të bjerë grumbullimi kur kërkesa ulet, pa sakrifikuar sigurinë dhe pa krijuar ripunim? Modelet e NHS England e ndajnë kapacitetin e kërkuar nga ai i disponueshëm dhe përditësohen kur ndryshojnë të dhënat lokale; modeli klinik duhet përshtatur, jo kopjuar.",
              "Eine Station, die zwei Stunden lang 12 Aufträge je Stunde erhält und 10 schafft, sammelt vier an, ohne Streuung, verlorene Aufträge und Anfangsbestand. Das ist keine stabile Warteschlange und darf nicht in Littles stationäre Mittelwerte eingesetzt werden. Die nächste Planungsfrage ist das Erholungsfenster: Wie schnell kann der Rückstand sinken, wenn die Nachfrage fällt, ohne Sicherheit zu opfern oder Nacharbeit zu erzeugen? Die Modelle von NHS England trennen benötigte von verfügbarer Kapazität und werden mit lokalen Daten aktualisiert; das klinische Modell muss angepasst, nicht kopiert werden.") },
            { type: "callout", reading: true, text: x(
              "The reserve is not an idle luxury if it is what prevents a short surge from becoming a long failure.",
              "Rezerva nuk është luks i papunë, nëse është ajo që e pengon një valë të shkurtër të bëhet dështim i gjatë.",
              "Die Reserve ist kein müßiger Luxus, wenn sie verhindert, dass ein kurzer Schub zu einem langen Versagen wird.") },
          ],
          note: x(
            "Buffers after Factory Physics; required versus available capacity after NHS England. The surge calculation is hypothetical, not local evidence.",
            "Rezervat sipas Factory Physics; kapaciteti i kërkuar kundrejt të disponueshmit sipas NHS England. Llogaria e valës është hipotetike, jo provë lokale.",
            "Puffer nach Factory Physics; benötigte gegen verfügbare Kapazität nach NHS England. Die Schubrechnung ist hypothetisch, kein lokaler Beleg."),
          source: ["factory-physics-2011", "nhs-demand-capacity"],
        },
        {
          id: "vi-protocol", layer: "protocol",
          title: [x("Design capacity", "Projekto kapacitetin", "Kapazität für das"), x("for the real interval", "për intervalin e vërtetë", "echte Intervall gestalten")],
          lead: x(
            "An operating model that tests the forecast, the queue, the service and the recovery, in that order.",
            "Një model pune që provon parashikimin, radhën, shërbimin dhe rikuperimin, me radhë.",
            "Ein Betriebsmodell, das Prognose, Warteschlange, Service und Erholung der Reihe nach prüft."),
          blocks: [
            { type: "steps", items: [
              { h: x("Choose the service promise", "Zgjidh premtimin e shërbimit", "Das Serviceversprechen wählen"), p: x("Customer result and deadline, not a utilization target.", "Rezultati për klientin dhe afati, jo një objektiv shfrytëzimi.", "Kundenergebnis und Frist, kein Auslastungsziel.") },
              { h: x("Measure arrival and service profiles", "Mat profilet e mbërritjes dhe shërbimit", "Ankunfts- und Serviceprofile messen"), p: x("Matched short intervals, job categories, effective availability.", "Intervale të shkurtra të përputhura, kategori punësh, disponueshmëri efektive.", "Abgestimmte kurze Intervalle, Auftragskategorien, effektive Verfügbarkeit.") },
              { h: x("Identify constraints", "Identifiko kufizimet", "Engpässe bestimmen"), p: x("Physical capacity, skills and locations, information gaps, required controls.", "Kapaciteti fizik, aftësitë dhe vendet, boshllëqet e informacionit, kontrollet e kërkuara.", "Physische Kapazität, Fähigkeiten und Orte, Informationslücken, vorgeschriebene Kontrollen.") },
              { h: x("Run three bounded scenarios", "Provo tre skenarë të kufizuar", "Drei begrenzte Szenarien rechnen"), p: x("Expected period, credible surge, recovery after surge; all assumptions disclosed.", "Periudha e pritshme, një valë e besueshme, rikuperimi pas valës; supozimet të deklaruara.", "Erwartete Periode, glaubwürdiger Schub, Erholung danach; alle Annahmen offen.") },
              { h: x("Select authorized actions", "Zgjidh veprime të autorizuara", "Zugelassene Maßnahmen wählen"), p: x("Capacity, sequencing or work-release changes, with named owners.", "Ndryshime kapaciteti, radhitjeje ose lëshimi pune, me përgjegjës të emërtuar.", "Kapazitäts-, Reihenfolge- oder Freigabeänderungen mit benannten Verantwortlichen.") },
              { h: x("Test and tell back", "Provo dhe trego", "Testen und zurückmelden"), p: x("Backlog, accepted output, exceptions and customer effect compared; the decision reported to the team.", "Grumbullimi, rezultati i pranuar, përjashtimet dhe efekti te klienti të krahasuara; vendimi i raportuar ekipit.", "Rückstand, angenommene Leistung, Ausnahmen und Kundenwirkung verglichen; die Entscheidung dem Team gemeldet.") },
            ] },
            { type: "p", text: x(
              "The target is not “as much usage as possible” but adequate service with transparent limits, safe execution and the ability to recover. For a fleet or a multi-team operation the single-server formula is a teaching tool only; use local data and a fitting model before committing budgets, staffing or service promises.",
              "Objektivi nuk është “sa më shumë përdorim”, por shërbim i mjaftueshëm me kufij transparentë, zbatim i sigurt dhe aftësi për t'u rikuperuar. Për një flotë ose një operacion me shumë ekipe, formula me një shërbyes është vetëm mjet mësimor; përdor të dhëna lokale dhe një model të përshtatshëm para se të angazhosh buxhete, staf ose premtime shërbimi.",
              "Das Ziel ist nicht „so viel Nutzung wie möglich“, sondern angemessener Service mit transparenten Grenzen, sicherer Ausführung und der Fähigkeit, sich zu erholen. Für eine Flotte oder einen Betrieb mit mehreren Teams ist die Einzelbedienerformel nur ein Lehrmittel; nutzen Sie lokale Daten und ein passendes Modell, bevor Sie Budgets, Personal oder Servicezusagen festlegen.") },
            { type: "callout", reading: true, text: x(
              "Capacity planning is complete only when the team knows what it will do when the forecast becomes wrong.",
              "Planifikimi i kapacitetit është i plotë vetëm kur ekipi e di çfarë do të bëjë kur parashikimi të dalë gabim.",
              "Kapazitätsplanung ist erst vollständig, wenn das Team weiß, was es tut, wenn die Prognose falsch wird.") },
          ],
          note: x(
            "Original editorial procedure synthesising Little, Kingman, Whitt, Factory Physics and NHS England guidance; not field-tested.",
            "Procedurë editoriale sipas Little, Kingman, Whitt, Factory Physics dhe NHS England; e paprovuar në terren.",
            "Redaktionelles Verfahren nach Little, Kingman, Whitt, Factory Physics und NHS England; nicht im Feld getestet."),
          source: ["littlelaw-little-1961", "kingman-1961", "whitt-1992", "factory-physics-2011", "nhs-demand-capacity"],
        },
      ],
    },

    {
      id: "tool", tool: "/tools/cx-control-tower/",
      kicker: x("Field tool", "Mjeti i terrenit", "Werkzeug vor Ort"),
      title: [x("The Capacity", "Karta e realitetit", "Das"), x("Reality Card", "të kapacitetit", "Kapazitätsblatt")],
      lead: x(
        "One operating window, one service promise and one decision that can be checked against reality. Write “not measured” where data are absent.",
        "Një dritare pune, një premtim shërbimi dhe një vendim që mund të kontrollohet kundrejt realitetit. Shkruaj “nuk është matur” aty ku mungojnë të dhënat.",
        "Ein Betriebsfenster, ein Serviceversprechen und eine Entscheidung, die sich an der Wirklichkeit prüfen lässt. Schreiben Sie „nicht gemessen“, wo Daten fehlen."),
      blocks: [
        { type: "form", items: [
          { h: x("Flow and customer", "Rrjedha dhe klienti", "Fluss und Kunde"), hint: x("which work type, arrival boundary and promised outcome?", "cili lloj pune, cili kufi mbërritjeje dhe cili rezultat i premtuar?", "welche Arbeitsart, welche Ankunftsgrenze, welches versprochene Ergebnis?") },
          { h: x("Window and baseline", "Dritarja dhe gjendja fillestare", "Fenster und Ausgangslage"), hint: x("what time interval? what is actual demand and what is forecast?", "cili interval kohor? cila është kërkesa e vërtetë dhe cili parashikimi?", "welches Zeitintervall? was ist tatsächliche Nachfrage, was Prognose?") },
          { h: x("Effective capacity", "Kapaciteti efektiv", "Effektive Kapazität"), hint: x("which people or resources are usable in that window, under which constraints?", "cilët njerëz ose burime janë të përdorshëm në atë dritare, me cilat kufizime?", "welche Menschen oder Ressourcen sind in diesem Fenster nutzbar, unter welchen Einschränkungen?") },
          { h: x("Queue and quality", "Radha dhe cilësia", "Warteschlange und Qualität"), hint: x("what is waiting, blocked, accepted, returned for rework or still open?", "çfarë pret, është e bllokuar, e pranuar, e kthyer për ripunim ose ende e hapur?", "was wartet, ist blockiert, angenommen, zur Nacharbeit zurück oder noch offen?") },
          { h: x("Surge and recovery", "Vala dhe rikuperimi", "Schub und Erholung"), hint: x("what if arrivals cluster? how long could the backlog take to clear?", "po sikur mbërritjet të grumbullohen? sa kohë mund të duhet për ta shkrirë grumbullimin?", "was, wenn Ankünfte sich ballen? wie lange könnte der Abbau des Rückstands dauern?") },
          { h: x("Decision and owner", "Vendimi dhe përgjegjësi", "Entscheidung und Verantwortlicher"), hint: x("what authorized change is proposed, by whom and for which checkpoint?", "cili ndryshim i autorizuar propozohet, nga kush dhe për cilën pikë kontrolli?", "welche zugelassene Änderung wird vorgeschlagen, von wem und für welchen Prüfpunkt?") },
          { h: x("Tell back and learning", "Trego dhe mëso", "Rückmeldung und Lernen"), hint: x("who informs the frontline of the result and the next review?", "kush e njofton vijën e parë për rezultatin dhe rishikimin e radhës?", "wer informiert die Front über das Ergebnis und die nächste Prüfung?") },
        ] },
      ],
      note: x(
        "Use an anonymised example for publication; never copy guest, payment, driver identifiers or confidential operational exports into a public tool. A proposed field worksheet, not a validated capacity algorithm.",
        "Për botim përdor një shembull të anonimizuar; mos kopjo kurrë identifikues mysafirësh, pagesash, shoferësh apo eksporte konfidenciale operacionale në një mjet publik. Fletë pune e propozuar për terrenin, jo algoritëm i vërtetuar kapaciteti.",
        "Für die Veröffentlichung ein anonymisiertes Beispiel verwenden; nie Gast-, Zahlungs- oder Fahrerkennungen oder vertrauliche Betriebsexporte in ein öffentliches Werkzeug kopieren. Ein vorgeschlagenes Arbeitsblatt, kein validierter Kapazitätsalgorithmus."),
      source: ["littlelaw-little-1961", "kingman-1961", "factory-physics-2011", "nhs-demand-capacity"],
    },
    {
      id: "closing",
      kicker: x("Closing essay", "Eseja e mbylljes", "Schlussessay"),
      title: [x("Room to do", "Hapësirë për ta bërë", "Raum, die Arbeit"), x("the job well", "punën mirë", "gut zu machen")],
      lead: x(
        "An operation does not become resilient because its schedule is full. It becomes resilient when its promises can survive ordinary uncertainty.",
        "Një operacion nuk bëhet i qëndrueshëm sepse orari i tij është plot. Bëhet i qëndrueshëm kur premtimet e tij i mbijetojnë pasigurisë së zakonshme.",
        "Ein Betrieb wird nicht widerstandsfähig, weil sein Plan voll ist. Er wird es, wenn seine Versprechen gewöhnliche Unsicherheit überstehen."),
      blocks: [
        { type: "p", text: x(
          "There is a familiar appeal in a perfectly occupied plan. Every vehicle assigned, every desk staffed to the predicted workload, every team visibly busy. The plan appears disciplined because nothing seems unused. Yet the number of occupied minutes is not the customer's experience. A customer waits in the gaps between our definitions of completion. An employee absorbs the surprises that an average has hidden. A supervisor encounters a line that cannot be shortened by asking people to hurry. Little gives us a language for flow and time. Kingman shows why utilization and variability compound waiting in the single-station model. Whitt warns that pooling and service scale change the calculation. Factory Physics reminds us that processes behave as systems of material, information, resources and variation. None of these sources knows the author's actual loading rates or the number of conversations a particular night-shift colleague completed. Their purpose in this volume is not to fabricate measurements but to improve the questions managers ask.",
          "Një plan i zënë në mënyrë të përsosur ka një joshje të njohur. Çdo automjet i caktuar, çdo sportel me staf sipas ngarkesës së parashikuar, çdo ekip dukshëm i zënë. Plani duket i disiplinuar, sepse asgjë nuk duket e papërdorur. Por numri i minutave të zëna nuk është përvoja e klientit. Klienti pret në boshllëqet mes përkufizimeve tona të përfundimit. Punonjësi i thith të papriturat që i ka fshehur një mesatare. Mbikëqyrësi has një radhë që nuk shkurtohet duke u kërkuar njerëzve të nxitojnë. Little na jep një gjuhë për rrjedhën dhe kohën. Kingman tregon pse shfrytëzimi dhe luhatshmëria e shtojnë pritjen në modelin me një stacion. Whitt paralajmëron se bashkimi dhe shkalla e shërbimit e ndryshojnë llogarinë. Factory Physics na kujton se proceset sillen si sisteme materiali, informacioni, burimesh dhe luhatjeje. Asnjëri nga këto burime nuk i di normat e vërteta të ngarkimit të autorit, as numrin e bisedave që përfundoi një koleg i caktuar i turnit të natës. Qëllimi i tyre në këtë vëllim nuk është të sajojnë matje, por t'i përmirësojnë pyetjet që bëjnë menaxherët.",
          "Ein perfekt ausgelasteter Plan hat einen vertrauten Reiz. Jedes Fahrzeug zugeteilt, jeder Schalter nach der prognostizierten Last besetzt, jedes Team sichtbar beschäftigt. Der Plan wirkt diszipliniert, weil nichts ungenutzt scheint. Doch die Zahl belegter Minuten ist nicht das Erlebnis des Kunden. Ein Kunde wartet in den Lücken zwischen unseren Definitionen von Fertigstellung. Ein Mitarbeiter fängt die Überraschungen auf, die ein Durchschnitt verborgen hat. Eine Vorgesetzte trifft auf eine Schlange, die sich nicht verkürzt, indem man die Leute zur Eile drängt. Little gibt uns eine Sprache für Fluss und Zeit. Kingman zeigt, warum Auslastung und Streuung das Warten im Einstationsmodell aufschaukeln. Whitt warnt, dass Bündelung und Servicegröße die Rechnung ändern. Factory Physics erinnert daran, dass Prozesse sich als Systeme aus Material, Information, Ressourcen und Streuung verhalten. Keine dieser Quellen kennt die tatsächlichen Laderaten des Autors oder die Zahl der Gespräche, die ein bestimmter Nachtschichtkollege erledigte. Ihr Zweck in diesem Band ist nicht, Messungen zu erfinden, sondern die Fragen zu verbessern, die Führungskräfte stellen.") },
        { type: "p", text: x(
          "Some operating problems need more capacity. Others need work released at a better time, clearer exceptions, usable information, an appropriate skill match or a standard that new colleagues can follow without constant rescue. A queue can be a signal of genuine shortage, a broken handover or a safety-critical step doing exactly what it is supposed to do. The diagnosis must precede the solution. A full system will always be impressive to the person reading a resource-utilization report. The more difficult test is whether the team can respond to an imperfect day without sacrificing quality or transferring the failure to someone else. The capacity worth defending is not the capacity to keep everybody occupied. It is the capacity to keep the service promise.",
          "Disa probleme operative kanë nevojë për më shumë kapacitet. Të tjera kanë nevojë që puna të lëshohet në kohë më të mirë, për përjashtime më të qarta, informacion të përdorshëm, përputhje të duhur aftësish ose një standard që kolegët e rinj e ndjekin pa shpëtim të vazhdueshëm. Një radhë mund të jetë sinjal mungese të vërtetë, dorëzimi të prishur ose i një hapi kritik për sigurinë që bën pikërisht atë që duhet. Diagnoza duhet t'i paraprijë zgjidhjes. Një sistem plot do të jetë gjithmonë mbresëlënës për atë që lexon një raport shfrytëzimi burimesh. Prova më e vështirë është nëse ekipi i përgjigjet dot një dite të papërsosur pa sakrifikuar cilësinë dhe pa ia kaluar dështimin dikujt tjetër. Kapaciteti që ia vlen të mbrohet nuk është kapaciteti për t'i mbajtur të gjithë të zënë. Është kapaciteti për ta mbajtur premtimin e shërbimit.",
          "Manche Betriebsprobleme brauchen mehr Kapazität. Andere brauchen Arbeit, die zu einem besseren Zeitpunkt freigegeben wird, klarere Ausnahmen, nutzbare Information, die passende Fähigkeit oder einen Standard, dem neue Kollegen ohne ständige Rettung folgen können. Eine Warteschlange kann ein Signal für echten Mangel sein, für eine gebrochene Übergabe oder für einen sicherheitskritischen Schritt, der genau das tut, was er soll. Die Diagnose muss der Lösung vorausgehen. Ein volles System wird den Leser eines Auslastungsberichts immer beeindrucken. Die schwerere Prüfung ist, ob das Team einen unvollkommenen Tag bewältigt, ohne Qualität zu opfern oder das Versagen an jemand anderen weiterzugeben. Die Kapazität, die es zu verteidigen lohnt, ist nicht die, alle beschäftigt zu halten. Es ist die Kapazität, das Serviceversprechen zu halten.") },
        { type: "callout", reading: true, text: x(
          "Build enough room for reality. Then use the room to do the work correctly.",
          "Ndërto mjaft hapësirë për realitetin. Pastaj përdore hapësirën për ta bërë punën siç duhet.",
          "Bauen Sie genug Raum für die Wirklichkeit. Dann nutzen Sie den Raum, um die Arbeit richtig zu tun.") },
      ],
      note: x(
        "Editorial conclusion. A system does not become resilient by keeping everyone busy; it becomes resilient by knowing how much pressure it can absorb before performance begins to fail.",
        "Përfundim editorial. Një sistem nuk bëhet i qëndrueshëm duke i mbajtur të gjithë të zënë; bëhet i qëndrueshëm duke ditur sa presion mund të përballojë para se performanca të nisë të bjerë.",
        "Redaktionelles Fazit. Ein System wird nicht widerstandsfähig, indem es alle beschäftigt hält; es wird es, indem es weiß, wie viel Druck es aufnehmen kann, bevor die Leistung zu kippen beginnt."),
    },
    {
      id: "method",
      kicker: x("Method", "Metoda", "Methode"),
      title: [x("Models, boundaries", "Modelet, kufijtë", "Modelle, Grenzen"), x("and limits", "dhe kufizimet", "und Schranken")],
      lead: x(
        "An evidence-informed editorial synthesis, not a field experiment. Every case with a clock time, queue, station, staffing level or numerical outcome is labelled synthetic or hypothetical.",
        "Një sintezë editoriale e mbështetur në prova, jo eksperiment në terren. Çdo rast me orë, radhë, stacion, nivel stafi ose rezultat numerik etiketohet si sintetik ose hipotetik.",
        "Eine belegbasierte redaktionelle Synthese, kein Feldexperiment. Jeder Fall mit Uhrzeit, Warteschlange, Station, Personalstand oder Zahlenergebnis ist als synthetisch oder hypothetisch gekennzeichnet."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("Theorems and approximations", "Teorema dhe përafrime", "Sätze und Näherungen"), p: x("Little (1961, 2011) is an exact relation under its conditions; Kingman (1961, 1962) and Whitt (1993) are approximations for defined queues; the M/M/1 waits are exact for that special case.", "Little (1961, 2011) është raport i saktë në kushtet e veta; Kingman (1961, 1962) dhe Whitt (1993) janë përafrime për radhë të përkufizuara; pritjet M/M/1 janë të sakta për atë rast të veçantë.", "Little (1961, 2011) ist eine exakte Beziehung unter ihren Bedingungen; Kingman (1961, 1962) und Whitt (1993) sind Näherungen für definierte Warteschlangen; die M/M/1-Wartezeiten sind für diesen Sonderfall exakt.") },
          { h: x("Scope of the models", "Fusha e modeleve", "Reichweite der Modelle"), p: x("The 80% to 95% waiting curve applies to a specified single-server queue, not to a real fleet; Eick, Massey and Whitt (1993) assume infinitely many servers.", "Kurba e pritjes nga 80% në 95% vlen për një radhë të caktuar me një shërbyes, jo për një flotë të vërtetë; Eick, Massey dhe Whitt (1993) supozojnë pafund shërbyes.", "Die Wartekurve von 80 % bis 95 % gilt für eine bestimmte Einzelbediener-Warteschlange, nicht für eine reale Flotte; Eick, Massey und Whitt (1993) nehmen unendlich viele Bediener an.") },
          { h: x("Guidance", "Udhëzime", "Anleitung"), p: x("Factory Physics and NHS England's demand and capacity models are used as comparative planning guidance; the clinical models must be adapted, not copied.", "Factory Physics dhe modelet e kërkesës dhe kapacitetit të NHS England përdoren si udhëzim krahasues planifikimi; modelet klinike duhen përshtatur, jo kopjuar.", "Factory Physics und die Nachfrage- und Kapazitätsmodelle von NHS England dienen als vergleichende Planungsanleitung; die klinischen Modelle müssen angepasst, nicht kopiert werden.") },
          { h: x("The author's workplaces", "Vendet e punës së autorit", "Die Betriebe des Autors"), p: x("No confidential operational values were used, and no causal result is attributed to any employer; the scenes name documented categories of work only.", "Nuk u përdor asnjë vlerë konfidenciale operative, dhe asnjë rezultat shkakësor nuk i atribuohet ndonjë punëdhënësi; skenat emërtojnë vetëm kategori të dokumentuara pune.", "Keine vertraulichen Betriebswerte wurden verwendet, und kein kausales Ergebnis wird einem Arbeitgeber zugeschrieben; die Szenen nennen nur dokumentierte Arbeitskategorien.") },
        ] },
        { type: "p", text: x(
          "Every calculation in this volume can be checked by hand: 24 × 0.5 = 12; 5 × ρ/(1−ρ) at 70, 80, 90 and 95 per cent; the minimum of 75, 70 and 55; 94 of 100 and 97 of 110; (12 − 10) × 2. Editorial standard: a theorem, an approximation and a hypothesis are named as such, and the sentence stops claiming where the model stops applying.",
          "Çdo llogari në këtë vëllim mund të kontrollohet me dorë: 24 × 0,5 = 12; 5 × ρ/(1−ρ) në 70, 80, 90 dhe 95 për qind; minimumi i 75, 70 dhe 55; 94 nga 100 dhe 97 nga 110; (12 − 10) × 2. Standardi editorial: një teoremë, një përafrim dhe një hipotezë quhen me emrin e tyre, dhe fjalia pushon së pohuari aty ku modeli pushon së vlejturi.",
          "Jede Rechnung in diesem Band lässt sich von Hand prüfen: 24 × 0,5 = 12; 5 × ρ/(1−ρ) bei 70, 80, 90 und 95 Prozent; das Minimum aus 75, 70 und 55; 94 von 100 und 97 von 110; (12 − 10) × 2. Redaktioneller Standard: Ein Satz, eine Näherung und eine Hypothese werden als solche benannt, und der Satz hört auf zu behaupten, wo das Modell aufhört zu gelten.") },
      ],
      note: x(
        "Every source is cited at its DOI or page on the next page; the arithmetic was re-checked for the site.",
        "Çdo burim citohet me DOI-n ose faqen e vet në faqen tjetër; aritmetika u rikontrollua për faqen.",
        "Jede Quelle ist auf der nächsten Seite mit ihrer DOI oder Seite zitiert; die Arithmetik wurde für die Website nachgerechnet."),
      source: ["littlelaw-little-1961", "littlelaw-little-2011", "kingman-1961", "kingman-1962", "whitt-1993", "eick-massey-whitt-1993", "factory-physics-2011", "nhs-demand-capacity"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
