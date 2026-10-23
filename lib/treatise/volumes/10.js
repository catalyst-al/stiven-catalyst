// Operational treatise, Volume 10: The decision clock, when the problem is known but nobody can act. Block:
// Operations. Facts and their sources: docs/revista/traktati-operacional.md. The research is the decision and
// coordination literature: Simon 1955, Mintzberg, Raisinghani & Théorêt 1976, Klein, Calderwood & Clinton-Cirocco
// 1986, Eisenhardt 1989, Bigley & Roberts 2001, Tucker & Edmondson 2003, Faraj & Xiao 2006, Kahneman & Klein 2009,
// Okhuysen & Bechky 2009, Rudolph, Morrison & Carroll 2009 and Weick & Sutcliffe 2015, each checked at its DOI. Six
// chapters in the three layers, as in the author's PDF; the site draws the PDF's 36-minute example as a chart and
// adds a second synthetic chart, a decision queue counted by state (Chapter V), both flagged, and the method has
// its own page. Every study count describes published research; nothing is measured in the author's workplaces.
import { x } from "../common.js";

const synthetic = x("Synthetic example, authored for this volume; not employer data", "Shembull sintetik, i shkruar për këtë vëllim; jo të dhëna punëdhënësi", "Synthetisches Beispiel, für diesen Band verfasst; keine Arbeitgeberdaten");

export default {
  number: 10,
  numeral: "X",
  block: "operations",
  date: x("October 2026", "Tetor 2026", "Oktober 2026"),
  theme: [x("The decision clock:", "Ora e vendimit:", "Die Entscheidungsuhr:"), x("when the problem is known but nobody can act", "kur problemi dihet, por askush nuk mund të veprojë", "wenn das Problem bekannt ist, aber niemand handeln kann")],
  sub: x(
    "Six chapters on bounded choice, expertise, decision rights, delays and verified action.",
    "Gjashtë kapituj për zgjedhjen e kufizuar, ekspertizën, të drejtat e vendimit, vonesat dhe veprimin e verifikuar.",
    "Sechs Kapitel über begrenzte Wahl, Expertise, Entscheidungsrechte, Verzögerungen und geprüftes Handeln."),
  seo: x(
    "The decision clock, an operational treatise: six chapters in three layers, from an exception with no next move to Simon, Klein and the Decision Rights Card.",
    "Ora e vendimit, traktat operacional: gjashtë kapituj në tri shtresa, nga një përjashtim pa hap tjetër te Simon, Klein dhe Karta e të drejtave të vendimit.",
    "Die Entscheidungsuhr, operativer Traktat: sechs Kapitel in drei Ebenen, von einer Ausnahme ohne nächsten Zug zu Simon, Klein und der Entscheidungskarte."),
  feature: x(
    "Volume 10 asks who can act once a problem is known. Its six chapters move from an exception with no next move, the information that never ends, a signal that feels familiar, four people who know four pieces and a queue that has no vehicle, to Simon, Mintzberg, Klein, Kahneman, Eisenhardt, Faraj and Xiao, Okhuysen and Bechky and Rudolph, and end with the six-step decision discipline, the Decision Rights Card and a closing essay that ties the ten volumes together.",
    "Vëllimi 10 pyet kush mund të veprojë kur problemi dihet. Gjashtë kapitujt e tij shkojnë nga një përjashtim pa hap tjetër, informacioni që nuk mbaron kurrë, një sinjal që duket i njohur, katër njerëz që dinë katër pjesë dhe një radhë pa automjet, te Simon, Mintzberg, Klein, Kahneman, Eisenhardt, Faraj e Xiao, Okhuysen e Bechky dhe Rudolph, dhe mbyllen me disiplinën e vendimit me gjashtë hapa, Kartën e të drejtave të vendimit dhe një ese mbyllëse që i lidh dhjetë vëllimet.",
    "Band 10 fragt, wer handeln kann, sobald ein Problem bekannt ist. Seine sechs Kapitel führen von einer Ausnahme ohne nächsten Zug, der Information, die nie endet, einem vertraut wirkenden Signal, vier Menschen mit vier Teilen und einer Warteschlange ohne Fahrzeug zu Simon, Mintzberg, Klein, Kahneman, Eisenhardt, Faraj und Xiao, Okhuysen und Bechky und Rudolph, und enden mit der Entscheidungsdisziplin in sechs Schritten, der Entscheidungskarte und einem Schlussessay, der die zehn Bände verbindet."),
  figure: { n: "25", by: x("Mintzberg, Raisinghani and Théorêt 1976, a study sample", "Mintzberg, Raisinghani e Théorêt 1976, mostër studimi", "Mintzberg, Raisinghani und Théorêt 1976, eine Studienstichprobe"), t: x(
    "organisational decision processes examined in a landmark study of how difficult choices unfold.",
    "procese vendimi organizativ të shqyrtuara në një studim themelor se si shpalosen zgjedhjet e vështira.",
    "organisationale Entscheidungsprozesse, untersucht in einer wegweisenden Studie darüber, wie schwierige Entscheidungen ablaufen.") },
  teasers: [
    { page: "i-scene", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("The exception with no next move", "Përjashtimi pa hap tjetër", "Die Ausnahme ohne nächsten Zug") },
    { page: "iii-evidence", kicker: x("The evidence", "Prova", "Die Belege"),
      title: x("When expertise earns trust", "Kur ekspertiza e fiton besimin", "Wenn Expertise Vertrauen verdient") },
    { page: "tool", kicker: x("Field tool", "Mjeti i terrenit", "Werkzeug vor Ort"),
      title: x("The Decision Rights Card", "Karta e të drejtave të vendimit", "Die Entscheidungskarte") },
  ],
  contract: [
    { h: x("Field", "Terreni", "Feld"), p: x("Real categories of operational work, no invented personal incidents.", "Kategori të vërteta pune operacionale, pa ngjarje personale të shpikura.", "Echte Kategorien betrieblicher Arbeit, keine erfundenen persönlichen Vorfälle.") },
    { h: x("Evidence", "Prova", "Belege"), p: x("Each study is evidence for its own setting and a hypothesis elsewhere.", "Çdo studim është provë për mjedisin e vet dhe hipotezë gjetiu.", "Jede Studie ist Beleg für ihr eigenes Umfeld und Hypothese anderswo.") },
    { h: x("Action", "Veprimi", "Handeln"), p: x("Escalated is a transfer. Decided is a choice. Resolved is a verified outcome.", "E eskaluar është kalim. E vendosur është zgjedhje. E zgjidhur është rezultat i verifikuar.", "Eskaliert ist ein Weiterreichen. Entschieden ist eine Wahl. Gelöst ist ein geprüftes Ergebnis.") },
  ],
  sources: ["simon-1955", "mintzberg-raisinghani-theoret-1976", "klein-calderwood-clinton-cirocco-1986", "eisenhardt-1989", "bigley-roberts-2001", "tucker-edmondson-2003", "faraj-xiao-2006", "pressure-kahneman-klein-2009", "okhuysen-bechky-2009", "rudolph-morrison-carroll-2009", "weick-sutcliffe-2015"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      title: [x("The moment", "Çasti", "Der Moment"), x("after recognition", "pas njohjes", "nach dem Erkennen")],
      why: x(
        "A problem can be known, verified and discussed while the next authorised decision remains absent.",
        "Një problem mund të dihet, të verifikohet dhe të diskutohet, ndërsa vendimi i radhës i autorizuar mungon ende.",
        "Ein Problem kann bekannt, geprüft und besprochen sein, während die nächste befugte Entscheidung ausbleibt."),
      body: x(
        "There is a difference between seeing a problem and having the power to change its course. A dashboard may identify an exception. A colleague may explain it accurately. A supervisor may have every reason to believe the report. Yet the work stays still because the next decision belongs to a role that has not been reached, is missing a necessary fact or has not accepted the decision as its own. This is the tenth volume of the operational treatise. The earlier volumes considered observation, value streams, automation, sustaining standards, capacity, metrics, silence, training and service recovery. The question here is what happens when those systems have made a problem visible but have not yet made action possible. The background crosses last-mile dispatch, warehouse loading, wholesale sales and hotel night shifts. It is real occupational context; the individual scenes, exchanges, durations and outcomes are deliberately constructed, because the author has no verified case file demonstrating a specific decision bottleneck in a named workplace. The research is equally bounded. Studies of fire commanders, trauma teams, technology firms and decision processes do not establish a universal deadline for dispatch or hotel operations. They illuminate mechanisms: recognition, limited information, expert judgement, authority and coordination. We translate those mechanisms into questions a manager can test, not into promises of measured improvement. A decision clock does not simply demand speed. It asks where the clock starts, what useful work occurs while it runs, when escalation is warranted and who must account for the outcome.",
        "Ka dallim mes të parit të një problemi dhe fuqisë për ta ndryshuar rrjedhën e tij. Një panel mund ta identifikojë një përjashtim. Një koleg mund ta shpjegojë saktë. Një mbikëqyrës mund të ketë çdo arsye ta besojë raportin. Megjithatë puna qëndron në vend, sepse vendimi i radhës i takon një roli që nuk është arritur, që i mungon një fakt i nevojshëm ose që nuk e ka pranuar vendimin si të vetin. Ky është vëllimi i dhjetë i traktatit operacional. Vëllimet e mëparshme trajtuan vëzhgimin, rrjedhat e vlerës, automatizimin, mbajtjen e standardeve, kapacitetin, matjet, heshtjen, trajnimin dhe rikuperimin e shërbimit. Pyetja këtu është çfarë ndodh kur ato sisteme e kanë bërë problemin të dukshëm, por ende nuk e kanë bërë veprimin të mundur. Sfondi kalon nëpër dispeçerimin e miljes së fundit, ngarkimin në magazinë, shitjet me shumicë dhe turnet e natës në hotel. Është kontekst i vërtetë profesional; skenat, shkëmbimet, kohëzgjatjet dhe rezultatet e veçanta janë qëllimisht të ndërtuara, sepse autori nuk ka asnjë dosje të verifikuar që tregon një bllokim të caktuar vendimi në një vend pune të emërtuar. Kërkimi është po aq i kufizuar. Studimet e komandantëve të zjarrfikësve, ekipeve të traumës, firmave të teknologjisë dhe proceseve të vendimit nuk vendosin një afat universal për dispeçerimin apo operacionet e hotelit. Ato ndriçojnë mekanizma: njohjen, informacionin e kufizuar, gjykimin e ekspertit, autoritetin dhe koordinimin. Ne i përkthejmë ata mekanizma në pyetje që një menaxher mund t'i provojë, jo në premtime përmirësimi të matur. Një orë vendimi nuk kërkon thjesht shpejtësi. Pyet ku nis ora, çfarë pune të dobishme ndodh ndërsa ajo ecën, kur justifikohet eskalimi dhe kush duhet të japë llogari për rezultatin.",
        "Es ist ein Unterschied, ein Problem zu sehen und die Macht zu haben, seinen Verlauf zu ändern. Ein Dashboard mag eine Ausnahme erkennen. Eine Vorgesetzte mag allen Grund haben, dem Bericht zu glauben. Doch die Arbeit steht still, weil die nächste Entscheidung einer Rolle gehört, die nicht erreicht wurde, der ein nötiger Fakt fehlt oder die die Entscheidung nicht als ihre eigene angenommen hat. Dies ist der zehnte Band des operativen Traktats. Die früheren Bände behandelten Beobachtung, Wertströme, Automatisierung, das Halten von Standards, Kapazität, Kennzahlen, Schweigen, Training und Wiedergutmachung. Die Frage hier ist, was geschieht, wenn diese Systeme ein Problem sichtbar, aber Handeln noch nicht möglich gemacht haben. Der Hintergrund reicht über Last-Mile-Disposition, Lagerbeladung, Großhandelsverkauf und Hotelnachtschichten. Die einzelnen Szenen, Gespräche, Dauern und Ausgänge sind bewusst konstruiert, weil der Autor keine geprüfte Fallakte zu einem bestimmten Entscheidungsengpass hat. Die Forschung ist ebenso begrenzt. Studien zu Feuerwehrkommandanten, Traumateams, Technologiefirmen und Entscheidungsprozessen setzen keine universelle Frist für Disposition oder Hotelbetrieb. Sie erhellen Mechanismen: Erkennen, begrenzte Information, Expertenurteil, Befugnis und Koordination. Wir übersetzen sie in Fragen, die eine Führungskraft prüfen kann, nicht in Versprechen gemessener Verbesserung. Eine Entscheidungsuhr verlangt nicht einfach Tempo. Sie fragt, wo die Uhr beginnt, welche nützliche Arbeit während ihres Laufs geschieht, wann Eskalation geboten ist und wer für das Ergebnis Rechenschaft ablegt."),
    },
    { id: "contents", type: "contents" },
    {
      id: "note",
      kicker: x("Research note", "Shënim kërkimor", "Forschungsnotiz"),
      title: [x("Evidence has", "Prova ka", "Belege haben"), x("a decision boundary", "një kufi vendimi", "eine Entscheidungsgrenze")],
      lead: x(
        "Different research designs answer different questions. They cannot be combined into a universal countdown.",
        "Projektime të ndryshme kërkimi u përgjigjen pyetjeve të ndryshme. Nuk mund të bashkohen në një numërim mbrapsht universal.",
        "Verschiedene Forschungsdesigns beantworten verschiedene Fragen. Sie lassen sich nicht zu einem universellen Countdown verbinden."),
      blocks: [
        { type: "p", text: x(
          "Herbert Simon (1955) challenged idealised rational choice by addressing the limits that shape real decisions. Mintzberg, Raisinghani and Théorêt (1976) examined 25 organisational decision processes, building a descriptive account of how unstructured choices unfold. Neither paper prescribes a response-time threshold for a warehouse. Klein, Calderwood and Clinton-Cirocco (1986) studied proficient fire-ground commanders under time pressure. Eisenhardt (1989) drew inductive propositions from eight microcomputer firms. Faraj and Xiao (2006) investigated coordination in a medical trauma centre, where consequences and expertise differ sharply from hotel or dispatch work. Kahneman and Klein (2009) identified conditions under which intuition may be trustworthy. Okhuysen and Bechky (2009) synthesised coordination theory, proposing accountability, predictability and common understanding as integrative conditions. Weick and Sutcliffe (2015) examine deference to expertise in high-reliability organising. These are complementary lenses, not eleven independent replications of one causal claim.",
          "Herbert Simon (1955) e sfidoi zgjedhjen racionale të idealizuar duke trajtuar kufijtë që i formojnë vendimet e vërteta. Mintzberg, Raisinghani dhe Théorêt (1976) shqyrtuan 25 procese vendimi organizativ, duke ndërtuar një rrëfim përshkrues se si shpalosen zgjedhjet e pastrukturuara. Asnjëri punim nuk përcakton një prag kohe përgjigjeje për një magazinë. Klein, Calderwood dhe Clinton-Cirocco (1986) studiuan komandantë të aftë zjarrfikës nën presion kohe. Eisenhardt (1989) nxori propozime induktive nga tetë firma mikrokompjuterësh. Faraj dhe Xiao (2006) hetuan koordinimin në një qendër mjekësore traume, ku pasojat dhe ekspertiza ndryshojnë thellësisht nga puna në hotel apo dispeçeri. Kahneman dhe Klein (2009) identifikuan kushtet në të cilat intuita mund të jetë e besueshme. Okhuysen dhe Bechky (2009) sintetizuan teorinë e koordinimit, duke propozuar përgjegjshmërinë, parashikueshmërinë dhe kuptimin e përbashkët si kushte integruese. Weick dhe Sutcliffe (2015) shqyrtojnë deferencën ndaj ekspertizës në organizimin me besueshmëri të lartë. Këto janë lente plotësuese, jo njëmbëdhjetë përsëritje të pavarura të një pohimi shkakësor.",
          "Herbert Simon (1955) stellte die idealisierte rationale Wahl infrage, indem er die Grenzen behandelte, die echte Entscheidungen prägen. Mintzberg, Raisinghani und Théorêt (1976) untersuchten 25 organisationale Entscheidungsprozesse und beschrieben, wie unstrukturierte Entscheidungen ablaufen. Keine der Arbeiten schreibt einer Lagerhalle eine Antwortzeitschwelle vor. Klein, Calderwood und Clinton-Cirocco (1986) untersuchten erfahrene Feuerwehrkommandanten unter Zeitdruck. Eisenhardt (1989) gewann induktive Thesen aus acht Mikrocomputerfirmen. Faraj und Xiao (2006) untersuchten Koordination in einem Traumazentrum, wo Folgen und Expertise sich stark von Hotel- oder Dispositionsarbeit unterscheiden. Kahneman und Klein (2009) benannten Bedingungen, unter denen Intuition vertrauenswürdig sein kann. Okhuysen und Bechky (2009) fassten die Koordinationstheorie zusammen und schlugen Verantwortlichkeit, Vorhersehbarkeit und gemeinsames Verständnis als integrierende Bedingungen vor. Weick und Sutcliffe (2015) betrachten die Hinwendung zur Expertise in hochzuverlässigen Organisationen. Das sind ergänzende Linsen, keine elf unabhängigen Wiederholungen einer Kausalbehauptung.") },
        { type: "stats", cols: 3, items: [
          { n: "25", t: x("processes described in the 1976 organisational decision study", "procese të përshkruara në studimin e vendimit organizativ të vitit 1976", "Prozesse, beschrieben in der Entscheidungsstudie von 1976") },
          { n: "8", t: x("firms in Eisenhardt's 1989 inductive research", "firma në kërkimin induktiv të Eisenhardt-it, 1989", "Firmen in Eisenhardts induktiver Forschung von 1989") },
          { n: "3", t: x("conditions: accountability, predictability, common understanding", "kushte: përgjegjshmëria, parashikueshmëria, kuptimi i përbashkët", "Bedingungen: Verantwortlichkeit, Vorhersehbarkeit, gemeinsames Verständnis") },
        ] },
        { type: "p", text: x(
          "The protocols and indicators in this volume are original editorial proposals; no local before-and-after result has been measured. A hypothetical clock illustrates definitions, not a scientific estimate of how quickly a named business should decide.",
          "Protokollet dhe treguesit e këtij vëllimi janë propozime editoriale origjinale; nuk është matur asnjë rezultat lokal para dhe pas. Një orë hipotetike ilustron përkufizime, jo një vlerësim shkencor se sa shpejt duhet të vendosë një biznes i emërtuar.",
          "Die Protokolle und Indikatoren dieses Bandes sind eigene redaktionelle Vorschläge; kein örtliches Vorher-Nachher-Ergebnis wurde gemessen. Eine hypothetische Uhr veranschaulicht Definitionen, keine wissenschaftliche Schätzung, wie schnell ein benanntes Unternehmen entscheiden sollte.") },
        { type: "callout", reading: true, text: x(
          "A source is evidence for its own study and a hypothesis generator elsewhere.",
          "Një burim është provë për studimin e vet dhe gjenerues hipotezash gjetiu.",
          "Eine Quelle ist Beleg für ihre eigene Studie und Hypothesenquelle anderswo.") },
      ],
      note: x(
        "Mintzberg et al. (1976); Eisenhardt (1989); Okhuysen and Bechky (2009). The counts are sample descriptors, not outcomes or local KPIs.",
        "Mintzberg et al. (1976); Eisenhardt (1989); Okhuysen e Bechky (2009). Numrat janë përshkrues mostrash, jo rezultate apo KPI lokalë.",
        "Mintzberg et al. (1976); Eisenhardt (1989); Okhuysen und Bechky (2009). Die Zahlen beschreiben Stichproben, keine Ergebnisse oder örtlichen KPIs."),
      source: ["mintzberg-raisinghani-theoret-1976", "eisenhardt-1989", "okhuysen-bechky-2009"],
    },

    // Chapter I. The problem everyone could see
    {
      id: "ch-i", type: "chapter", numeral: "I",
      title: x("The problem everyone could see", "Problemi që të gjithë e shihnin", "Das Problem, das alle sehen konnten"),
      pages: [
        {
          id: "i-scene", layer: "scene", more: "when-the-dashboard-turns-red-before-you",
          title: [x("An exception", "Një përjashtim", "Eine Ausnahme"), x("with no next move", "pa hap tjetër", "ohne nächsten Zug")],
          lead: x(
            "A delayed departure may be visible before anyone has decided what that visibility permits.",
            "Një nisje e vonuar mund të jetë e dukshme para se dikush të ketë vendosur çfarë lejon ajo dukshmëri.",
            "Eine verspätete Abfahrt kann sichtbar sein, bevor jemand entschieden hat, was diese Sichtbarkeit erlaubt."),
          blocks: [
            { type: "flag", text: x("Constructed last-mile scene, not a documented incident", "Skenë e ndërtuar e miljes së fundit, jo ngjarje e dokumentuar", "Konstruierte Last-Mile-Szene, kein dokumentierter Vorfall") },
            { type: "p", text: x(
              "A route is scheduled to leave the loading area. A missing bag is reported. The driver is waiting; a supervisor knows about the exception; the team is trying to verify whether the load is complete. The departure clock continues to move. To an observer reading only the late-departure status, this may look like a problem of the driver being slow. But the physical work is not simply waiting for a faster person. It is waiting for a decision grounded in the right facts: what has been checked, whether the missing item is physically available and who is authorised to decide the next safe, permitted step. Repeating the instruction to hurry cannot supply that authority. Suppose the supervisor reports the issue again but nobody can confirm who will decide. Reporting has succeeded. Understanding may even have succeeded. Yet the next necessary move has not been accepted. The situation is not invisible. It is undecided.",
              "Një rrugë është planifikuar të niset nga zona e ngarkimit. Raportohet një çantë që mungon. Shoferi pret; një mbikëqyrës e di përjashtimin; ekipi po përpiqet të verifikojë nëse ngarkesa është e plotë. Ora e nisjes vazhdon të ecë. Për një vëzhgues që lexon vetëm statusin e nisjes së vonuar, kjo mund të duket problem i një shoferi të ngadaltë. Por puna fizike nuk po pret thjesht një person më të shpejtë. Po pret një vendim të mbështetur në faktet e duhura: çfarë është kontrolluar, nëse artikulli që mungon është fizikisht i disponueshëm dhe kush është i autorizuar të vendosë hapin e radhës të sigurt dhe të lejuar. Përsëritja e udhëzimit për t'u nxituar nuk e jep dot atë autoritet. Supozo se mbikëqyrësi e raporton çështjen sërish, por askush nuk konfirmon dot kush do të vendosë. Raportimi ka pasur sukses. Edhe kuptimi mund të ketë pasur sukses. Megjithatë hapi i radhës i nevojshëm nuk është pranuar. Situata nuk është e padukshme. Është e pavendosur.",
              "Eine Tour soll den Ladebereich verlassen. Eine fehlende Tasche wird gemeldet. Der Fahrer wartet; eine Vorgesetzte kennt die Ausnahme; das Team versucht zu prüfen, ob die Ladung vollständig ist. Die Abfahrtsuhr läuft weiter. Für einen Beobachter, der nur den Status der verspäteten Abfahrt liest, sieht das nach einem langsamen Fahrer aus. Doch die physische Arbeit wartet nicht einfach auf eine schnellere Person. Sie wartet auf eine Entscheidung, die auf den richtigen Fakten beruht: was geprüft wurde, ob der fehlende Artikel physisch verfügbar ist und wer befugt ist, den nächsten sicheren, zulässigen Schritt zu entscheiden. Die Anweisung zur Eile zu wiederholen liefert diese Befugnis nicht. Angenommen, die Vorgesetzte meldet das Thema erneut, aber niemand kann bestätigen, wer entscheidet. Das Melden ist gelungen. Vielleicht sogar das Verstehen. Doch der nächste nötige Zug ist nicht angenommen worden. Die Lage ist nicht unsichtbar. Sie ist unentschieden.") },
            { type: "p", text: x(
              "The author has worked with missing bags, mixed trolleys, loading discipline, driver coordination and KPI discussion; those categories are documented. The particular route, people, sequence and outcome here are fictional. The scene illustrates the boundary between operational visibility and managerial action; it does not establish that a particular employer had an unclear escalation rule.",
              "Autori ka punuar me çanta që mungojnë, karroca të përziera, disiplinë ngarkimi, koordinim shoferësh dhe diskutim KPI-sh; ato kategori janë të dokumentuara. Rruga, njerëzit, radha dhe rezultati i veçantë këtu janë të sajuara. Skena ilustron kufirin mes dukshmërisë operacionale dhe veprimit menaxherial; nuk vërteton se një punëdhënës i caktuar kishte një rregull të paqartë eskalimi.",
              "Der Autor hat mit fehlenden Taschen, gemischten Wagen, Ladedisziplin, Fahrerkoordination und KPI-Besprechungen gearbeitet; diese Kategorien sind dokumentiert. Tour, Personen, Abfolge und Ausgang hier sind erfunden. Die Szene zeigt die Grenze zwischen betrieblicher Sichtbarkeit und Führungshandeln; sie belegt nicht, dass ein bestimmter Arbeitgeber eine unklare Eskalationsregel hatte.") },
            { type: "callout", reading: true, text: x(
              "The position at which delay becomes visible is not necessarily the position that can resolve it.",
              "Pozicioni ku vonesa bëhet e dukshme nuk është doemos pozicioni që mund ta zgjidhë.",
              "Die Stelle, an der Verzögerung sichtbar wird, ist nicht unbedingt die Stelle, die sie lösen kann.") },
          ],
          note: x(
            "Constructed scene based on documented work categories only; no person, site, timestamp or employer-specific decision process is claimed. The essay named below reads a red number as a signal to check, not a diagnosis.",
            "Skenë e ndërtuar vetëm mbi kategori të dokumentuara pune; nuk pretendohet asnjë person, vend, vulë kohe apo proces vendimi i një punëdhënësi. Eseja e emërtuar më poshtë e lexon një numër të kuq si sinjal për kontroll, jo si diagnozë.",
            "Konstruierte Szene allein aus dokumentierten Arbeitskategorien; keine Person, kein Standort, kein Zeitstempel und kein arbeitgeberspezifischer Entscheidungsprozess wird behauptet. Der unten genannte Essay liest eine rote Zahl als Prüfsignal, nicht als Diagnose."),
        },
        {
          id: "i-concept", layer: "concept",
          title: [x("Three clocks,", "Tri orë,", "Drei Uhren,"), x("one blocked flow", "një rrjedhë e bllokuar", "ein blockierter Fluss")],
          lead: x(
            "Detection, authorisation and execution are different activities; a single delay number cannot separate them.",
            "Zbulimi, autorizimi dhe ekzekutimi janë veprimtari të ndryshme; një numër i vetëm vonese nuk i ndan dot.",
            "Erkennen, Autorisieren und Ausführen sind verschiedene Tätigkeiten; eine einzige Verzögerungszahl kann sie nicht trennen."),
          blocks: [
            { type: "p", text: x(
              "An operational event becomes actionable through several transitions. Someone first notices an exception. The team then verifies enough of the condition to describe a legitimate choice. A person or role with authority accepts responsibility for that choice. Only after the decision can the work move into execution and outcome verification. Calling all of this “decision time” conceals the mechanism. A long fact-check can protect safety and quality. A long wait caused by an absent owner is a different kind of delay. And a decision recorded quickly may still produce no benefit if implementation never begins. No timestamp by itself tells us which interval should have been shorter; an organisation should define the start and end of each interval before comparing cases.",
              "Një ngjarje operacionale bëhet e veprueshme përmes disa kalimeve. Dikush së pari vë re një përjashtim. Pastaj ekipi verifikon mjaftueshëm nga gjendja që të përshkruhet një zgjedhje legjitime. Një person ose rol me autoritet e pranon përgjegjësinë për atë zgjedhje. Vetëm pas vendimit puna mund të kalojë në ekzekutim dhe verifikim të rezultatit. Ta quash gjithë këtë “kohë vendimi” e fsheh mekanizmin. Një kontroll i gjatë faktesh mund ta mbrojë sigurinë dhe cilësinë. Një pritje e gjatë e shkaktuar nga një përgjegjës që mungon është lloj tjetër vonese. Dhe një vendim i regjistruar shpejt mund të mos sjellë prapë asnjë dobi, nëse zbatimi nuk nis kurrë. Asnjë vulë kohe më vete nuk na thotë cili interval duhej të ishte më i shkurtër; organizata duhet ta përkufizojë fillimin dhe fundin e çdo intervali para se të krahasojë raste.",
              "Ein betriebliches Ereignis wird über mehrere Übergänge handlungsfähig. Jemand bemerkt zuerst eine Ausnahme. Das Team prüft dann genug von der Lage, um eine legitime Wahl zu beschreiben. Eine Person oder Rolle mit Befugnis übernimmt die Verantwortung für diese Wahl. Erst nach der Entscheidung kann die Arbeit in Ausführung und Ergebnisprüfung übergehen. All das „Entscheidungszeit“ zu nennen verbirgt den Mechanismus. Eine lange Faktenprüfung kann Sicherheit und Qualität schützen. Eine lange Wartezeit durch eine fehlende Verantwortliche ist eine andere Art Verzögerung. Und eine schnell festgehaltene Entscheidung bringt keinen Nutzen, wenn die Umsetzung nie beginnt. Kein Zeitstempel sagt für sich, welches Intervall kürzer hätte sein sollen; eine Organisation sollte Anfang und Ende jedes Intervalls definieren, bevor sie Fälle vergleicht.") },
            { type: "rows", compact: true, items: [
              { h: x("Detection lag", "Vonesa e zbulimit", "Erkennungsverzug"), p: x("Event to first reliable signal.", "Nga ngjarja te sinjali i parë i besueshëm.", "Vom Ereignis zum ersten verlässlichen Signal.") },
              { h: x("Verification interval", "Intervali i verifikimit", "Prüfintervall"), p: x("Signal to sufficient fact base.", "Nga sinjali te një bazë e mjaftueshme faktesh.", "Vom Signal zur ausreichenden Faktenbasis.") },
              { h: x("Decision wait", "Pritja e vendimit", "Entscheidungswartezeit"), p: x("Verified case to authorised decision.", "Nga rasti i verifikuar te vendimi i autorizuar.", "Vom geprüften Fall zur befugten Entscheidung.") },
              { h: x("Execution interval", "Intervali i ekzekutimit", "Ausführungsintervall"), p: x("Decision to action and checked outcome.", "Nga vendimi te veprimi dhe rezultati i kontrolluar.", "Von der Entscheidung zur Handlung und zum geprüften Ergebnis.") },
            ] },
            { type: "chain", items: [
              { h: x("Detect", "Zbulo", "Erkennen"), p: x("Exception seen.", "Përjashtimi i parë.", "Ausnahme gesehen.") },
              { h: x("Verify", "Verifiko", "Prüfen"), p: x("Condition checked.", "Gjendja e kontrolluar.", "Lage geprüft.") },
              { h: x("Decide", "Vendos", "Entscheiden"), p: x("Authorised choice.", "Zgjedhje e autorizuar.", "Befugte Wahl.") },
              { h: x("Act", "Vepro", "Handeln"), p: x("Change executed.", "Ndryshimi i ekzekutuar.", "Änderung ausgeführt.") },
            ] },
            { type: "callout", reading: true, text: x(
              "Shortening the wrong interval can degrade the result. Verify the whole chain.",
              "Shkurtimi i intervalit të gabuar mund ta keqësojë rezultatin. Verifiko gjithë zinxhirin.",
              "Das falsche Intervall zu verkürzen kann das Ergebnis verschlechtern. Prüfen Sie die ganze Kette.") },
          ],
          note: x(
            "Editorial process segmentation informed by Simon (1955) and Okhuysen and Bechky (2009); no empirical effect of the four clocks is asserted. Chapter V counts a wholly invented example.",
            "Ndarje editoriale e procesit e mbështetur te Simon (1955) dhe Okhuysen e Bechky (2009); nuk pohohet asnjë efekt empirik i katër orëve. Kapitulli V numëron një shembull krejt të shpikur.",
            "Redaktionelle Prozessgliederung nach Simon (1955) und Okhuysen und Bechky (2009); keine empirische Wirkung der vier Uhren wird behauptet. Kapitel V rechnet ein vollständig erfundenes Beispiel durch."),
          source: ["simon-1955", "okhuysen-bechky-2009"],
        },
        {
          id: "i-protocol", layer: "protocol",
          title: [x("Trace the decision,", "Gjurmo vendimin,", "Die Entscheidung verfolgen,"), x("not just the delay", "jo vetëm vonesën", "nicht nur die Verzögerung")],
          lead: x(
            "A short event trace can expose missing authority without identifying or blaming individual workers.",
            "Një gjurmim i shkurtër ngjarjeje mund ta zbulojë mungesën e autoritetit pa identifikuar apo fajësuar punonjës të veçantë.",
            "Eine kurze Ereignisspur kann fehlende Befugnis offenlegen, ohne einzelne Beschäftigte zu benennen oder zu beschuldigen."),
          blocks: [
            { type: "steps", items: [
              { h: x("Define the event", "Përkufizo ngjarjen", "Das Ereignis definieren"), p: x("The exception and what makes it relevant to the customer or the work standard.", "Përjashtimi dhe çfarë e bën të rëndësishëm për klientin ose standardin e punës.", "Die Ausnahme und was sie für den Kunden oder den Arbeitsstandard relevant macht.") },
              { h: x("Record what is known", "Shëno çfarë dihet", "Festhalten, was bekannt ist"), p: x("Observed facts apart from reported claims and unknown conditions.", "Faktet e vëzhguara veçmas nga pohimet e raportuara dhe kushtet e panjohura.", "Beobachtete Fakten getrennt von berichteten Behauptungen und unbekannten Bedingungen.") },
              { h: x("Identify the first choice", "Identifiko zgjedhjen e parë", "Die erste Wahl benennen"), p: x("Which decision must be made before the work can safely move?", "Cili vendim duhet marrë para se puna të lëvizë në mënyrë të sigurt?", "Welche Entscheidung muss fallen, bevor die Arbeit sicher weitergehen kann?") },
              { h: x("Name the authorised role", "Emërto rolin e autorizuar", "Die befugte Rolle benennen"), p: x("The actual delegation and escalation rule; never invent authority.", "Rregulli i vërtetë i delegimit dhe i eskalimit; mos shpik kurrë autoritet.", "Die tatsächliche Delegations- und Eskalationsregel; nie Befugnis erfinden.") },
              { h: x("Record the handover", "Shëno dorëzimin", "Die Übergabe festhalten"), p: x("When sufficient information reached that role, and whether it was accepted.", "Kur mbërriti informacioni i mjaftueshëm te ai rol, dhe nëse u pranua.", "Wann ausreichende Information diese Rolle erreichte, und ob sie angenommen wurde.") },
              { h: x("Follow through", "Çoje deri në fund", "Dranbleiben"), p: x("Execution, downstream effect and the next update if the case stays open.", "Ekzekutimi, efekti më poshtë dhe përditësimi i radhës, nëse rasti mbetet i hapur.", "Ausführung, nachgelagerte Wirkung und nächste Rückmeldung, falls der Fall offen bleibt.") },
            ] },
            { type: "p", text: x(
              "The first experiment needs no complex dashboard. Review a small, anonymised sample of permitted events and look for decisions waiting without an owner; separate urgent hazards from ordinary exceptions. A note that a case was “escalated” is not evidence that someone decided: the receiver should be able to act on the information transferred, know the permitted alternatives and say what will happen next.",
              "Eksperimenti i parë nuk ka nevojë për panel të ndërlikuar. Rishiko një mostër të vogël anonime ngjarjesh të lejuara dhe kërko vendime që presin pa përgjegjës; ndaji rreziqet urgjente nga përjashtimet e zakonshme. Një shënim se një rast u “eskalua” nuk është provë se dikush vendosi: marrësi duhet të jetë në gjendje të veprojë mbi informacionin e kaluar, t'i dijë alternativat e lejuara dhe të thotë çfarë do të ndodhë më pas.",
              "Das erste Experiment braucht kein komplexes Dashboard. Eine kleine anonymisierte Stichprobe zulässiger Ereignisse prüfen und nach Entscheidungen suchen, die ohne Verantwortliche warten; dringende Gefahren von gewöhnlichen Ausnahmen trennen. Der Vermerk, ein Fall sei „eskaliert“, beweist nicht, dass jemand entschied: Der Empfänger sollte mit der übergebenen Information handeln können, die zulässigen Alternativen kennen und sagen, was als Nächstes geschieht.") },
            { type: "callout", reading: true, text: x(
              "A signal becomes useful only when an authorised person can turn it into a checked next action.",
              "Një sinjal bëhet i dobishëm vetëm kur një person i autorizuar mund ta kthejë në një veprim të radhës të kontrolluar.",
              "Ein Signal wird erst nützlich, wenn eine befugte Person es in eine geprüfte nächste Handlung verwandeln kann.") },
          ],
          note: x(
            "Proposed audit trail, not a workplace-certified procedure; inspired by Okhuysen and Bechky (2009) and Faraj and Xiao (2006).",
            "Gjurmë auditimi e propozuar, jo procedurë e certifikuar e vendit të punës; e frymëzuar nga Okhuysen e Bechky (2009) dhe Faraj e Xiao (2006).",
            "Vorgeschlagene Prüfspur, kein betrieblich zertifiziertes Verfahren; angeregt durch Okhuysen und Bechky (2009) und Faraj und Xiao (2006)."),
          source: ["okhuysen-bechky-2009", "faraj-xiao-2006"],
        },
      ],
    },

    // Chapter II. The limits of rational decisions
    {
      id: "ch-ii", type: "chapter", numeral: "II",
      title: x("The limits of rational decisions", "Kufijtë e vendimeve racionale", "Die Grenzen rationaler Entscheidungen"),
      pages: [
        {
          id: "ii-scene", layer: "scene", more: "61-resellers",
          title: [x("The information", "Informacioni", "Die Information,"), x("that never ends", "që nuk mbaron kurrë", "die nie endet")],
          lead: x(
            "A manager can continue asking for certainty until the window for a useful choice has passed.",
            "Një menaxher mund të vazhdojë të kërkojë siguri derisa dritarja për një zgjedhje të dobishme të ketë kaluar.",
            "Eine Führungskraft kann so lange Gewissheit verlangen, bis das Fenster für eine nützliche Wahl vorbei ist."),
          blocks: [
            { type: "flag", text: x("Constructed wholesale scene, not a claimed commercial incident", "Skenë e ndërtuar e shitjes me shumicë, jo ngjarje e pretenduar tregtare", "Konstruierte Großhandelsszene, kein behaupteter Geschäftsvorfall") },
            { type: "p", text: x(
              "An independent reseller wants an answer about an urgent order. Sales knows the request. The warehouse has to confirm available stock and preparation capacity. A manager wants a reliable promise, so another update is requested, then another clarification. No one wants to mislead the partner, but the customer still cannot plan. There are legitimate reasons to pause: physical availability, order terms and capacity may be uncertain. There are also limits to the value of additional information. If the next update cannot materially change the permitted choices, waiting for complete certainty may simply postpone a necessary explanation to the customer. What should the manager do with a choice that cannot be made perfectly? Not guess. Identify the minimum sufficient evidence for a safe, authorised decision, record what remains uncertain and communicate the actual commitment rather than an attractive one. Sometimes the correct decision is that no promise can yet be confirmed; that decision still has an owner and a next update.",
              "Një rishitës i pavarur do një përgjigje për një porosi urgjente. Shitjet e dinë kërkesën. Magazina duhet të konfirmojë stokun e disponueshëm dhe kapacitetin e përgatitjes. Një menaxher do një premtim të besueshëm, prandaj kërkohet një përditësim tjetër, pastaj një sqarim tjetër. Askush nuk do ta mashtrojë partnerin, por klienti ende nuk planifikon dot. Ka arsye legjitime për të ndalur: disponueshmëria fizike, kushtet e porosisë dhe kapaciteti mund të jenë të pasigurta. Ka edhe kufij të vlerës së informacionit shtesë. Nëse përditësimi i radhës nuk i ndryshon dot thelbësisht zgjedhjet e lejuara, pritja e sigurisë së plotë mund thjesht ta shtyjë një shpjegim të nevojshëm për klientin. Çfarë duhet të bëjë menaxheri me një zgjedhje që nuk bëhet dot në mënyrë të përsosur? Jo të hamendësojë. Të identifikojë provën minimale të mjaftueshme për një vendim të sigurt dhe të autorizuar, të shënojë çfarë mbetet e pasigurt dhe ta komunikojë angazhimin e vërtetë, jo një tërheqës. Ndonjëherë vendimi i saktë është se asnjë premtim nuk konfirmohet dot ende; edhe ai vendim ka një përgjegjës dhe një përditësim të radhës.",
              "Ein unabhängiger Wiederverkäufer will eine Antwort zu einem dringenden Auftrag. Der Verkauf kennt die Anfrage. Das Lager muss verfügbaren Bestand und Vorbereitungskapazität bestätigen. Eine Führungskraft will ein verlässliches Versprechen, also wird eine weitere Rückmeldung verlangt, dann eine weitere Klärung. Niemand will den Partner täuschen, doch der Kunde kann noch immer nicht planen. Es gibt legitime Gründe zu warten: Physische Verfügbarkeit, Auftragsbedingungen und Kapazität können unsicher sein. Es gibt auch Grenzen des Werts zusätzlicher Information. Kann die nächste Rückmeldung die zulässigen Entscheidungen nicht wesentlich ändern, verschiebt das Warten auf volle Gewissheit womöglich nur eine nötige Erklärung an den Kunden. Was soll die Führungskraft mit einer Wahl tun, die sich nicht perfekt treffen lässt? Nicht raten. Den minimal ausreichenden Beleg für eine sichere, befugte Entscheidung bestimmen, das Unsichere festhalten und die tatsächliche Zusage mitteilen, nicht eine attraktive. Manchmal ist die richtige Entscheidung, dass noch kein Versprechen bestätigt werden kann; auch diese Entscheidung hat eine Verantwortliche und eine nächste Rückmeldung.") },
            { type: "p", text: x(
              "The author previously managed a wholesale network of 61 active resellers and coordinated commercial, warehouse and financial work. That experience supports the categories, not this fabricated order: there is no documented conversation, delivery failure or specific delay behind the scene.",
              "Autori ka menaxhuar më parë një rrjet me shumicë prej 61 rishitësish aktivë dhe ka koordinuar punën tregtare, të magazinës dhe financiare. Ajo përvojë i mbështet kategoritë, jo këtë porosi të sajuar: pas skenës nuk ka asnjë bisedë të dokumentuar, dështim dorëzimi apo vonesë të caktuar.",
              "Der Autor leitete früher ein Großhandelsnetz von 61 aktiven Wiederverkäufern und koordinierte kaufmännische, Lager- und Finanzarbeit. Diese Erfahrung trägt die Kategorien, nicht diesen erfundenen Auftrag: Hinter der Szene steht kein dokumentiertes Gespräch, kein Lieferausfall und keine bestimmte Verzögerung.") },
            { type: "callout", reading: true, text: x(
              "Not every unanswered question is necessary to the next decision.",
              "Jo çdo pyetje pa përgjigje është e nevojshme për vendimin e radhës.",
              "Nicht jede unbeantwortete Frage ist für die nächste Entscheidung nötig.") },
          ],
          note: x(
            "Constructed wholesale illustration; Simon (1955) provides the conceptual lens, and no observed behaviour is attributed to a named business. The essay named below is about those 61 resellers and trust.",
            "Ilustrim i ndërtuar i shitjes me shumicë; Simon (1955) jep lenten konceptuale, dhe asnjë sjellje e vëzhguar nuk i atribuohet një biznesi të emërtuar. Eseja e emërtuar më poshtë flet për ata 61 rishitës dhe besimin.",
            "Konstruierte Großhandelsillustration; Simon (1955) liefert die begriffliche Linse, und kein beobachtetes Verhalten wird einem benannten Unternehmen zugeschrieben. Der unten genannte Essay handelt von diesen 61 Wiederverkäufern und Vertrauen."),
          source: ["simon-1955"],
        },
        {
          id: "ii-concept", layer: "concept",
          title: [x("Bounded rationality", "Racionaliteti i kufizuar", "Begrenzte Rationalität"), x("is not carelessness", "nuk është pakujdesi", "ist keine Nachlässigkeit")],
          lead: x(
            "Herbert Simon questioned the model of an actor who can know and compare every relevant option.",
            "Herbert Simon e vuri në pikëpyetje modelin e një aktori që mund ta njohë dhe krahasojë çdo mundësi përkatëse.",
            "Herbert Simon stellte das Modell eines Akteurs infrage, der jede relevante Option kennen und vergleichen kann."),
          blocks: [
            { type: "p", text: x(
              "Simon's 1955 behavioural model of rational choice examines decisions under realistic limitations. Attention, information and the ability to evaluate alternatives are finite. A person may seek an option that satisfies the relevant requirements without calculating the theoretical best of all possible futures. That is not permission to disregard evidence; it is a way to recognise the conditions under which choices are made. A real operational decision should therefore begin with its constraints. Which action is prohibited? What is irreversible? What information is essential to prevent a harmful mistake? What may be learned after an authorised, reversible trial? A routine allocation with clear limits may justify a defined delegation and quick review; a security, safety or sensitive financial exception may require a pause, a different level of authority and an explicit audit trail. Treating both as equivalent in an average “decision time” metric would reward the wrong behaviour.",
              "Modeli i sjelljes së zgjedhjes racionale i Simon-it i vitit 1955 shqyrton vendimet nën kufizime realiste. Vëmendja, informacioni dhe aftësia për të vlerësuar alternativat janë të fundme. Një person mund të kërkojë një mundësi që i plotëson kërkesat përkatëse, pa llogaritur më të mirën teorike të të gjitha të ardhmeve të mundshme. Kjo nuk është leje për të shpërfillur provën; është një mënyrë për t'i njohur kushtet në të cilat bëhen zgjedhjet. Një vendim i vërtetë operacional duhet pra të nisë me kufizimet e veta. Cili veprim është i ndaluar? Çfarë është e pakthyeshme? Cili informacion është thelbësor për të parandaluar një gabim të dëmshëm? Çfarë mund të mësohet pas një prove të autorizuar dhe të kthyeshme? Një ndarje rutinë me kufij të qartë mund të justifikojë një delegim të përkufizuar dhe një rishikim të shpejtë; një përjashtim i sigurisë, i mbrojtjes ose financiar i ndjeshëm mund të kërkojë ndalim, nivel tjetër autoriteti dhe gjurmë të shprehur auditimi. T'i trajtosh të dyja si të barabarta në një matje mesatare të “kohës së vendimit” do ta shpërblente sjelljen e gabuar.",
              "Simons Verhaltensmodell rationaler Wahl von 1955 untersucht Entscheidungen unter realistischen Einschränkungen. Aufmerksamkeit, Information und die Fähigkeit, Alternativen zu bewerten, sind endlich. Jemand kann eine Option suchen, die die relevanten Anforderungen erfüllt, ohne das theoretisch Beste aller möglichen Zukünfte zu berechnen. Das ist keine Erlaubnis, Belege zu missachten; es ist ein Weg, die Bedingungen zu erkennen, unter denen gewählt wird. Eine echte betriebliche Entscheidung sollte daher mit ihren Grenzen beginnen. Welche Handlung ist verboten? Was ist unumkehrbar? Welche Information ist unverzichtbar, um einen schädlichen Fehler zu verhindern? Was lässt sich nach einem befugten, umkehrbaren Versuch lernen? Eine Routinezuteilung mit klaren Grenzen kann eine definierte Delegation und schnelle Prüfung rechtfertigen; eine Sicherheits-, Schutz- oder sensible Finanzausnahme kann eine Pause, eine andere Befugnisebene und eine ausdrückliche Prüfspur verlangen. Beides in einer durchschnittlichen „Entscheidungszeit“ gleichzusetzen belohnte das falsche Verhalten.") },
            { type: "cards", cols: 3, items: [
              { h: x("Constraint", "Kufizimi", "Grenze"), p: x("What must never be traded away?", "Çfarë nuk duhet shkëmbyer kurrë?", "Was darf nie eingetauscht werden?") },
              { h: x("Sufficiency", "Mjaftueshmëria", "Hinlänglichkeit"), p: x("Which evidence changes the choice?", "Cila provë e ndryshon zgjedhjen?", "Welcher Beleg ändert die Wahl?") },
              { h: x("Reversibility", "Kthyeshmëria", "Umkehrbarkeit"), p: x("What can be tested and undone?", "Çfarë mund të provohet dhe të zhbëhet?", "Was lässt sich testen und rückgängig machen?") },
            ] },
            { type: "p", text: x(
              "A useful manager's rule is neither “get more information” nor “decide immediately” in isolation. It is: learn what fact would alter the set of permissible actions, obtain that fact when possible, then decide at the proper authority level. If a fact is unobtainable, make the uncertainty visible.",
              "Një rregull i dobishëm për menaxherin nuk është as “merr më shumë informacion”, as “vendos menjëherë” më vete. Është: mëso cili fakt do ta ndryshonte togun e veprimeve të lejuara, merre atë fakt kur është e mundur, pastaj vendos në nivelin e duhur të autoritetit. Nëse një fakt nuk merret dot, bëje pasigurinë të dukshme.",
              "Eine nützliche Führungsregel ist weder „mehr Information holen“ noch „sofort entscheiden“ für sich allein. Sie lautet: herausfinden, welcher Fakt die Menge der zulässigen Handlungen ändern würde, diesen Fakt wenn möglich beschaffen, dann auf der richtigen Befugnisebene entscheiden. Ist ein Fakt nicht zu beschaffen, die Unsicherheit sichtbar machen.") },
            { type: "callout", reading: true, text: x(
              "Fast enough means fast enough for the risk, not simply fast.",
              "Mjaft shpejt do të thotë mjaft shpejt për rrezikun, jo thjesht shpejt.",
              "Schnell genug heißt schnell genug für das Risiko, nicht einfach schnell.") },
          ],
          note: x(
            "Conceptual interpretation of Simon (1955), Quarterly Journal of Economics 69(1). The three-card managerial test is an editorial proposal, not Simon's own taxonomy.",
            "Interpretim konceptual i Simon-it (1955), Quarterly Journal of Economics 69(1). Prova menaxheriale me tri karta është propozim editorial, jo taksonomia e vetë Simon-it.",
            "Begriffliche Deutung von Simon (1955), Quarterly Journal of Economics 69(1). Der Führungstest mit drei Karten ist ein redaktioneller Vorschlag, nicht Simons eigene Taxonomie."),
          source: ["simon-1955"],
        },
        {
          id: "ii-evidence", layer: "concept",
          title: [x("Unstructured", "E pastrukturuar", "Unstrukturiert"), x("does not mean random", "nuk do të thotë e rastësishme", "heißt nicht zufällig")],
          lead: x(
            "Mintzberg and colleagues described recurring patterns in decisions that had no simple ready-made answer.",
            "Mintzberg dhe kolegët përshkruan modele të përsëritura në vendime që nuk kishin një përgjigje të thjeshtë të gatshme.",
            "Mintzberg und Kollegen beschrieben wiederkehrende Muster in Entscheidungen ohne einfache fertige Antwort."),
          blocks: [
            { type: "stat", n: "25", t: x("strategic decision processes examined in Mintzberg, Raisinghani and Théorêt's 1976 study: a descriptive sample, not a benchmark", "procese vendimi strategjik të shqyrtuara në studimin e Mintzberg, Raisinghani e Théorêt të vitit 1976: mostër përshkruese, jo pikë referimi", "strategische Entscheidungsprozesse in der Studie von Mintzberg, Raisinghani und Théorêt 1976: eine beschreibende Stichprobe, kein Richtwert") },
            { type: "p", text: x(
              "Their model identified major phases of identification, development and selection, as well as supporting routines and dynamic factors. Its contribution was descriptive: difficult decisions have structure, even when the process is not linear. This matters because the familiar instruction to “just decide” can hide two different deficits. The organisation may not have identified the problem accurately. Or it may have identified the problem but failed to develop a permissible response. In either case, selection is not yet a genuine choice; a signature does not repair what the earlier work failed to establish. The phases below are translated into operational questions. They are not a reproduction of the authors' diagram, and they do not claim that a five-minute shift decision behaves like a corporate investment decision: the research studied organisational decisions, not hotel night-audit exceptions or dispatch routes. A decision can revisit an earlier phase when new evidence arrives; that return should be deliberate and recorded, not disguised as endless committee discussion.",
              "Modeli i tyre identifikoi fazat kryesore të identifikimit, zhvillimit dhe përzgjedhjes, si dhe rutina mbështetëse dhe faktorë dinamikë. Kontributi i tij ishte përshkrues: vendimet e vështira kanë strukturë, edhe kur procesi nuk është linear. Kjo ka rëndësi, sepse udhëzimi i njohur “thjesht vendos” mund të fshehë dy mangësi të ndryshme. Organizata mund të mos e ketë identifikuar saktë problemin. Ose mund ta ketë identifikuar problemin, por të mos ketë arritur të zhvillojë një përgjigje të lejuar. Në të dy rastet, përzgjedhja nuk është ende zgjedhje e vërtetë; një nënshkrim nuk e ndreq atë që puna e mëparshme nuk arriti ta vendoste. Fazat më poshtë janë përkthyer në pyetje operacionale. Nuk janë riprodhim i diagramit të autorëve dhe nuk pretendojnë se një vendim pesëminutësh turni sillet si një vendim investimi korporativ: kërkimi studioi vendime organizative, jo përjashtime të Night Audit-it apo rrugë dispeçerimi. Një vendim mund të rikthehet në një fazë të mëparshme kur mbërrin provë e re; ai kthim duhet të jetë i qëllimshëm dhe i regjistruar, jo i maskuar si diskutim i pafund komisioni.",
              "Ihr Modell benannte die Hauptphasen Identifikation, Entwicklung und Auswahl sowie unterstützende Routinen und dynamische Faktoren. Sein Beitrag war beschreibend: Schwierige Entscheidungen haben Struktur, auch wenn der Prozess nicht linear ist. Das zählt, weil die vertraute Anweisung „einfach entscheiden“ zwei verschiedene Defizite verbergen kann. Die Organisation hat das Problem vielleicht nicht genau erkannt. Oder sie hat es erkannt, aber keine zulässige Antwort entwickelt. In beiden Fällen ist die Auswahl noch keine echte Wahl; eine Unterschrift repariert nicht, was die frühere Arbeit nicht geschafft hat. Die Phasen unten sind in betriebliche Fragen übersetzt. Sie geben nicht das Diagramm der Autoren wieder und behaupten nicht, dass eine Fünf-Minuten-Entscheidung in der Schicht sich wie eine Investitionsentscheidung verhält: Die Forschung untersuchte organisationale Entscheidungen, keine Night-Audit-Ausnahmen oder Dispositionstouren. Eine Entscheidung kann in eine frühere Phase zurückkehren, wenn neue Belege kommen; diese Rückkehr sollte bewusst und festgehalten sein, nicht als endlose Ausschussdiskussion verkleidet.") },
            { type: "chain", items: [
              { h: x("Identify", "Identifiko", "Identifizieren"), p: x("What is the actual issue?", "Cila është çështja e vërtetë?", "Was ist das eigentliche Problem?") },
              { h: x("Develop", "Zhvillo", "Entwickeln"), p: x("What feasible actions exist?", "Cilat veprime të realizueshme ekzistojnë?", "Welche machbaren Handlungen gibt es?") },
              { h: x("Select", "Përzgjidh", "Auswählen"), p: x("Who chooses, and on what basis?", "Kush zgjedh, dhe mbi çfarë baze?", "Wer wählt, und auf welcher Grundlage?") },
            ] },
            { type: "callout", reading: true, text: x(
              "Selection without an identified problem and workable alternatives is merely motion.",
              "Përzgjedhja pa një problem të identifikuar dhe pa alternativa të realizueshme është thjesht lëvizje.",
              "Auswahl ohne erkanntes Problem und gangbare Alternativen ist bloß Bewegung.") },
          ],
          note: x(
            "Mintzberg, Raisinghani and Théorêt (1976), Administrative Science Quarterly 21(2). The phases are abbreviated for the editorial diagram.",
            "Mintzberg, Raisinghani e Théorêt (1976), Administrative Science Quarterly 21(2). Fazat janë shkurtuar për diagramin editorial.",
            "Mintzberg, Raisinghani und Théorêt (1976), Administrative Science Quarterly 21(2). Die Phasen sind für das redaktionelle Diagramm verkürzt."),
          source: ["mintzberg-raisinghani-theoret-1976"],
        },
        {
          id: "ii-protocol", layer: "protocol",
          title: [x("The minimum", "Përmbledhja minimale", "Die minimal ausreichende"), x("sufficient brief", "e mjaftueshme", "Vorlage")],
          lead: x(
            "Give an authorised decision maker what changes the choice, and label what is still unknown.",
            "Jepi një vendimmarrësi të autorizuar atë që e ndryshon zgjedhjen, dhe etiketo çfarë mbetet ende e panjohur.",
            "Geben Sie einer befugten Entscheiderin, was die Wahl ändert, und kennzeichnen Sie, was noch unbekannt ist."),
          blocks: [
            { type: "steps", items: [
              { h: x("State the decision question", "Thuaj pyetjen e vendimit", "Die Entscheidungsfrage nennen"), p: x("An action to choose, not a vague request for guidance.", "Një veprim për t'u zgjedhur, jo një kërkesë e paqartë për udhëzim.", "Eine zu wählende Handlung, keine vage Bitte um Orientierung.") },
              { h: x("Define the hard limits", "Përkufizo kufijtë e fortë", "Die harten Grenzen definieren"), p: x("The non-negotiable safety, privacy, legal and operational rules.", "Rregullat e panegociueshme të sigurisë, privatësisë, ligjit dhe operimit.", "Die unverhandelbaren Sicherheits-, Datenschutz-, Rechts- und Betriebsregeln.") },
              { h: x("Separate facts from assumptions", "Ndaji faktet nga supozimet", "Fakten von Annahmen trennen"), p: x("Observations, known constraints and explicit unknowns.", "Vëzhgime, kufizime të njohura dhe të panjohura të shprehura.", "Beobachtungen, bekannte Grenzen und ausdrücklich Unbekanntes.") },
              { h: x("Offer permissible alternatives", "Ofro alternativa të lejuara", "Zulässige Alternativen anbieten"), p: x("Including the safe default when a decision cannot be supported.", "Përfshirë parazgjedhjen e sigurt kur një vendim nuk mbështetet dot.", "Einschließlich des sicheren Standards, wenn eine Entscheidung nicht tragbar ist.") },
              { h: x("Name reversibility", "Emërto kthyeshmërinë", "Umkehrbarkeit benennen"), p: x("What can be undone, monitored or checked after the choice.", "Çfarë mund të zhbëhet, monitorohet ose kontrollohet pas zgjedhjes.", "Was sich nach der Wahl rückgängig machen, überwachen oder prüfen lässt.") },
              { h: x("Set the next information point", "Cakto pikën e radhës të informacionit", "Den nächsten Informationspunkt setzen"), p: x("Who updates the decision maker when the uncertainty changes.", "Kush e përditëson vendimmarrësin kur ndryshon pasiguria.", "Wer die Entscheiderin informiert, wenn sich die Unsicherheit ändert.") },
            ] },
            { type: "p", text: x(
              "A good brief may lead to the conclusion “do not proceed yet”, a legitimate decision when the conditions for safe action are unmet. The format is small because a brief exists to make judgement possible, not to recreate the whole history of the case. Before adopting it, a workplace should check how it fits existing authority, data-protection rules and incident reporting: a two-line decision log is no alternative to a mandatory formal record.",
              "Një përmbledhje e mirë mund të çojë në përfundimin “mos vazhdo ende”, vendim legjitim kur kushtet për veprim të sigurt nuk plotësohen. Formati është i vogël, sepse një përmbledhje ekziston për ta bërë gjykimin të mundur, jo për ta rikrijuar gjithë historinë e rastit. Para se ta adoptojë, një vend pune duhet të kontrollojë si përshtatet me autoritetin ekzistues, rregullat e mbrojtjes së të dhënave dhe raportimin e incidenteve: një ditar vendimi me dy rreshta nuk është alternativë e një regjistri formal të detyrueshëm.",
              "Eine gute Vorlage kann zum Schluss „noch nicht weitermachen“ führen, eine legitime Entscheidung, wenn die Bedingungen für sicheres Handeln fehlen. Das Format ist klein, weil eine Vorlage Urteil ermöglichen soll, nicht die ganze Geschichte des Falls nachbilden. Vor der Übernahme sollte ein Betrieb prüfen, wie sie zu bestehender Befugnis, Datenschutzregeln und Vorfallmeldung passt: Ein zweizeiliges Entscheidungsprotokoll ersetzt keine vorgeschriebene förmliche Aufzeichnung.") },
            { type: "callout", reading: true, text: x(
              "Enough information is the information required for an authorised, defensible choice.",
              "Informacion i mjaftueshëm është informacioni që duhet për një zgjedhje të autorizuar dhe të mbrojtshme.",
              "Genug Information ist die Information, die für eine befugte, vertretbare Wahl nötig ist.") },
          ],
          note: x(
            "Original editorial protocol informed by Simon (1955) and Mintzberg et al. (1976), not a validated decision aid.",
            "Protokoll editorial origjinal i mbështetur te Simon (1955) dhe Mintzberg et al. (1976), jo mjet vendimi i vërtetuar.",
            "Eigenes redaktionelles Protokoll nach Simon (1955) und Mintzberg et al. (1976), keine validierte Entscheidungshilfe."),
          source: ["simon-1955", "mintzberg-raisinghani-theoret-1976"],
        },
      ],
    },

    // Chapter III. The expert under pressure
    {
      id: "ch-iii", type: "chapter", numeral: "III",
      title: x("The expert under pressure", "Eksperti nën presion", "Der Experte unter Druck"),
      pages: [
        {
          id: "iii-scene", layer: "scene", more: "the-tour-the-driver-does-not-understand",
          title: [x("The signal", "Sinjali", "Das Signal,"), x("that feels familiar", "që duket i njohur", "das vertraut wirkt")],
          lead: x(
            "Experience can accelerate recognition. It can also make an unfamiliar situation look deceptively familiar.",
            "Përvoja mund ta përshpejtojë njohjen. Mund ta bëjë edhe një situatë të panjohur të duket mashtrueshëm e njohur.",
            "Erfahrung kann das Erkennen beschleunigen. Sie kann eine unbekannte Lage auch trügerisch vertraut erscheinen lassen."),
          blocks: [
            { type: "flag", text: x("Constructed dispatch scene, not a recorded escalation", "Skenë e ndërtuar dispeçerimi, jo eskalim i regjistruar", "Konstruierte Dispositionsszene, keine aufgezeichnete Eskalation") },
            { type: "p", text: x(
              "A dispatcher receives a message that a scheduled route is falling behind. The visible status resembles problems encountered before. The temptation is to move straight to the familiar explanation: a loading delay, a late start or a route obstacle. An experienced colleague may recognise a pattern quickly, and that recognition could save time, provided the pattern actually fits. The message alone does not show every condition. A reported delay might already have been corrected; another stage might be responsible; the data may have been refreshed at a different interval. Acting on the first plausible story can waste the same minutes that slow deliberation wastes. A more defensible response begins with the expert's hypothesis and asks what observation could falsify it. If the signal is urgent, the authorised escalation begins promptly; the dispatcher can still distinguish the apparent pattern from the facts checked.",
              "Një dispeçer merr një mesazh se një rrugë e planifikuar po mbetet prapa. Statusi i dukshëm ngjan me probleme të hasura më parë. Tundimi është të kalosh drejt te shpjegimi i njohur: një vonesë ngarkimi, një nisje e vonuar ose një pengesë në rrugë. Një koleg me përvojë mund ta njohë shpejt një model, dhe ajo njohje mund të kursejë kohë, me kusht që modeli të përshtatet vërtet. Vetëm mesazhi nuk i tregon të gjitha kushtet. Një vonesë e raportuar mund të jetë korrigjuar tashmë; një fazë tjetër mund të jetë përgjegjëse; të dhënat mund të jenë rifreskuar në një interval tjetër. Të veprosh sipas historisë së parë të besueshme mund të shpenzojë të njëjtat minuta që shpenzon edhe shqyrtimi i ngadaltë. Një përgjigje më e mbrojtshme nis me hipotezën e ekspertit dhe pyet cili vëzhgim mund ta rrëzojë. Nëse sinjali është urgjent, eskalimi i autorizuar nis menjëherë; dispeçeri mund ta dallojë prapë modelin në dukje nga faktet e kontrolluara.",
              "Ein Disponent erhält die Nachricht, dass eine geplante Tour zurückfällt. Der sichtbare Status ähnelt früheren Problemen. Die Versuchung ist, gleich zur vertrauten Erklärung zu springen: eine Ladeverzögerung, ein später Start oder ein Hindernis auf der Strecke. Eine erfahrene Kollegin erkennt ein Muster womöglich schnell, und das kann Zeit sparen, sofern das Muster wirklich passt. Die Nachricht allein zeigt nicht jede Bedingung. Eine gemeldete Verzögerung ist vielleicht schon korrigiert; eine andere Stufe ist womöglich verantwortlich; die Daten wurden vielleicht in einem anderen Intervall aktualisiert. Nach der ersten plausiblen Geschichte zu handeln kann dieselben Minuten verschwenden wie langsames Abwägen. Eine belastbarere Antwort beginnt mit der Hypothese des Experten und fragt, welche Beobachtung sie widerlegen könnte. Ist das Signal dringend, beginnt die befugte Eskalation sofort; der Disponent kann das scheinbare Muster trotzdem von den geprüften Fakten unterscheiden.") },
            { type: "p", text: x(
              "The author's background includes coordinating drivers and vehicles in last-mile work, including remote dispatch. The precise software, route, telephone exchange and outcome here are fictional; no documented event is claimed in which a particular dispatcher made a mistaken intuitive choice. Experience is powerful when it narrows attention to the right questions rather than exempting the decision from verification.",
              "Sfondi i autorit përfshin koordinimin e shoferëve dhe automjeteve në punën e miljes së fundit, përfshirë dispeçerimin në distancë. Softueri, rruga, biseda telefonike dhe rezultati i saktë këtu janë të sajuara; nuk pretendohet asnjë ngjarje e dokumentuar ku një dispeçer i caktuar bëri një zgjedhje të gabuar intuitive. Përvoja është e fuqishme kur e ngushton vëmendjen te pyetjet e duhura, jo kur e përjashton vendimin nga verifikimi.",
              "Der Hintergrund des Autors umfasst die Koordination von Fahrern und Fahrzeugen in der letzten Meile, auch aus der Ferne. Software, Tour, Telefonat und Ausgang hier sind erfunden; kein dokumentiertes Ereignis wird behauptet, in dem ein bestimmter Disponent eine falsche intuitive Wahl traf. Erfahrung ist stark, wenn sie die Aufmerksamkeit auf die richtigen Fragen lenkt, nicht, wenn sie die Entscheidung von der Prüfung befreit.") },
            { type: "callout", reading: true, text: x(
              "Expertise should accelerate the search for relevant evidence, not remove the need for evidence.",
              "Ekspertiza duhet ta përshpejtojë kërkimin e provës përkatëse, jo ta heqë nevojën për provë.",
              "Expertise sollte die Suche nach relevanten Belegen beschleunigen, nicht den Bedarf an Belegen beseitigen.") },
          ],
          note: x(
            "Constructed dispatch scenario; relevant research: Klein, Calderwood and Clinton-Cirocco (1986); Kahneman and Klein (2009). The essay named below follows a tour the driver does not understand.",
            "Skenar i ndërtuar dispeçerimi; kërkimi përkatës: Klein, Calderwood e Clinton-Cirocco (1986); Kahneman e Klein (2009). Eseja e emërtuar më poshtë e ndjek një tur që shoferi nuk e kupton.",
            "Konstruiertes Dispositionsszenario; einschlägige Forschung: Klein, Calderwood und Clinton-Cirocco (1986); Kahneman und Klein (2009). Der unten genannte Essay folgt einer Tour, die der Fahrer nicht versteht."),
          source: ["klein-calderwood-clinton-cirocco-1986", "pressure-kahneman-klein-2009"],
        },
        {
          id: "iii-concept", layer: "concept",
          title: [x("Recognition", "Njohja", "Erkennen"), x("before comparison", "para krahasimit", "vor dem Vergleich")],
          lead: x(
            "A classic fire-ground study described experienced decision makers working differently from textbook option lists.",
            "Një studim klasik i zjarrfikësve përshkroi vendimmarrës me përvojë që punonin ndryshe nga listat e mundësive të teksteve.",
            "Eine klassische Feuerwehrstudie beschrieb erfahrene Entscheider, die anders arbeiteten als Optionslisten im Lehrbuch."),
          blocks: [
            { type: "stat", n: "<12%", t: x("of the decision points in the 1986 fire-ground study showed simultaneous comparison of two or more options: a specific observed sample, not a rule for all experts", "e pikave të vendimit në studimin e zjarrfikësve të vitit 1986 treguan krahasim të njëkohshëm të dy ose më shumë mundësive: një mostër e vëzhguar e veçantë, jo rregull për të gjithë ekspertët", "der Entscheidungspunkte in der Feuerwehrstudie von 1986 zeigten einen gleichzeitigen Vergleich von zwei oder mehr Optionen: eine konkrete beobachtete Stichprobe, keine Regel für alle Experten") },
            { type: "p", text: x(
              "Gary Klein, Roberta Calderwood and Anne Clinton-Cirocco (1986) used critical-incident protocol analysis with proficient fire-ground commanders. At fewer than 12% of the reported decision points did the researchers find evidence of simultaneously comparing two or more options. In that setting, commanders most commonly recognised a familiar pattern and identified a plausible action; the work contributed to the recognition-primed decision perspective. The result is sometimes retold as evidence that experts never compare alternatives. That would be too strong: the figure concerns this study's observed decision points, not all experts or all decisions, and it is no evidence that a hotel receptionist or dispatcher should operate like a fire commander. Consequences, training, repetition and available feedback differ. The transferable insight is narrower. Expert recognition can produce a workable first option without exhaustive comparison; the next safeguard is to ask whether that option fits the observed constraints, and mental rehearsal, where feasible, can reveal a reason it will not work before the action is launched. In unfamiliar, high-stakes or weakly patterned situations, fast recognition may be less reliable, and teams should know how to stop a false pattern from becoming an instruction.",
              "Gary Klein, Roberta Calderwood dhe Anne Clinton-Cirocco (1986) përdorën analizë protokolli të incidenteve kritike me komandantë të aftë zjarrfikës. Në më pak se 12% të pikave të vendimit të raportuara kërkuesit gjetën prova krahasimi të njëkohshëm të dy ose më shumë mundësive. Në atë mjedis, komandantët më shpesh njihnin një model të njohur dhe identifikonin një veprim të besueshëm; puna kontribuoi në këndvështrimin e vendimit të nxitur nga njohja. Rezultati ndonjëherë ritregohet si provë se ekspertët nuk i krahasojnë kurrë alternativat. Kjo do të ishte tepër e fortë: shifra ka të bëjë me pikat e vendimit të vëzhguara të këtij studimi, jo me të gjithë ekspertët apo të gjitha vendimet, dhe nuk është provë se një recepsionist hoteli apo dispeçer duhet të veprojë si komandant zjarrfikës. Pasojat, trajnimi, përsëritja dhe reagimi në dispozicion ndryshojnë. Mësimi i transferueshëm është më i ngushtë. Njohja e ekspertit mund të prodhojë një mundësi të parë të realizueshme pa krahasim shterues; mbrojtja e radhës është të pyesësh nëse ajo mundësi përshtatet me kufizimet e vëzhguara, dhe ushtrimi mendor, ku është i mundur, mund të zbulojë një arsye pse nuk do të funksionojë, para se të niset veprimi. Në situata të panjohura, me rrezik të lartë ose me modele të dobëta, njohja e shpejtë mund të jetë më pak e besueshme, dhe ekipet duhet të dinë si ta ndalin një model të rremë të bëhet udhëzim.",
              "Gary Klein, Roberta Calderwood und Anne Clinton-Cirocco (1986) nutzten Protokollanalysen kritischer Ereignisse mit erfahrenen Feuerwehrkommandanten. An weniger als 12 % der berichteten Entscheidungspunkte fanden die Forscher Belege für einen gleichzeitigen Vergleich von zwei oder mehr Optionen. In diesem Umfeld erkannten die Kommandanten meist ein vertrautes Muster und bestimmten eine plausible Handlung; die Arbeit trug zur Perspektive der erkennungsgeleiteten Entscheidung bei. Das Ergebnis wird manchmal als Beleg nacherzählt, Experten verglichen nie Alternativen. Das wäre zu stark: Die Zahl betrifft die beobachteten Entscheidungspunkte dieser Studie, nicht alle Experten oder alle Entscheidungen, und sie belegt nicht, dass eine Hotelrezeptionistin oder ein Disponent wie ein Feuerwehrkommandant arbeiten sollte. Folgen, Training, Wiederholung und verfügbare Rückmeldung unterscheiden sich. Die übertragbare Einsicht ist enger. Expertenerkennung kann eine gangbare erste Option ohne erschöpfenden Vergleich liefern; die nächste Sicherung ist die Frage, ob diese Option zu den beobachteten Grenzen passt, und ein gedankliches Durchspielen kann, wo möglich, einen Grund zeigen, warum sie nicht funktioniert, bevor gehandelt wird. In unbekannten, riskanten oder schwach gemusterten Lagen kann schnelles Erkennen weniger verlässlich sein, und Teams sollten wissen, wie sie ein falsches Muster daran hindern, zur Anweisung zu werden.") },
            { type: "callout", reading: true, text: x(
              "Recognition is a description of expert practice, not permission to skip required controls.",
              "Njohja është përshkrim i praktikës së ekspertit, jo leje për t'i anashkaluar kontrollet e kërkuara.",
              "Erkennen beschreibt Expertenpraxis, es erlaubt nicht, vorgeschriebene Kontrollen zu überspringen.") },
          ],
          note: x(
            "Klein, Calderwood and Clinton-Cirocco (1986), Proceedings of the Human Factors Society Annual Meeting 30(6). A descriptive finding only.",
            "Klein, Calderwood e Clinton-Cirocco (1986), Proceedings of the Human Factors Society Annual Meeting 30(6). Vetëm gjetje përshkruese.",
            "Klein, Calderwood und Clinton-Cirocco (1986), Proceedings of the Human Factors Society Annual Meeting 30(6). Nur ein beschreibender Befund."),
          source: ["klein-calderwood-clinton-cirocco-1986"],
        },
        {
          id: "iii-evidence", layer: "concept",
          title: [x("When intuition", "Kur intuita", "Wenn Intuition"), x("has earned trust", "e ka fituar besimin", "Vertrauen verdient hat")],
          lead: x(
            "Kahneman and Klein agreed that confidence feels persuasive but does not validate the underlying judgement.",
            "Kahneman dhe Klein u pajtuan se siguria ndihet bindëse, por nuk e vërteton gjykimin në themel.",
            "Kahneman und Klein waren sich einig, dass Zuversicht überzeugend wirkt, das zugrunde liegende Urteil aber nicht bestätigt."),
          blocks: [
            { type: "p", text: x(
              "In 2009, Daniel Kahneman and Gary Klein compared two research traditions often presented as rivals: studies of heuristics and biases, and studies of naturalistic decision making. Their shared conclusion was conditional. The likely quality of intuitive judgement depends on whether the environment has learnable regularities and whether the practitioner has had an adequate chance to learn them through feedback. This is a more demanding standard than years of service. A worker may have spent years responding to repeated situations without reliable information about which early judgements were correct. Familiarity with a dashboard's colour is not the same as knowing the causal mechanism behind it, and rapid action becomes overconfidence when the task has changed but the person has not noticed. A manager weighing expert advice can ask two questions: is this a situation with patterns that can realistically be learned, and has the expert had clear and timely outcome feedback in similar situations? The answer may differ between a familiar process exception and the cause of a rare system failure.",
              "Në vitin 2009, Daniel Kahneman dhe Gary Klein krahasuan dy tradita kërkimore që shpesh paraqiten si rivale: studimet e heuristikave dhe paragjykimeve, dhe studimet e vendimmarrjes natyraliste. Përfundimi i tyre i përbashkët ishte i kushtëzuar. Cilësia e mundshme e gjykimit intuitiv varet nga fakti nëse mjedisi ka rregullsi që mësohen dhe nëse praktikuesi ka pasur mundësi të mjaftueshme t'i mësojë përmes reagimit. Ky është standard më kërkues se vitet e shërbimit. Një punonjës mund të ketë kaluar vite duke iu përgjigjur situatave të përsëritura pa informacion të besueshëm se cilat gjykime të hershme ishin të sakta. Njohja me ngjyrën e një paneli nuk është njësoj si njohja e mekanizmit shkakësor pas saj, dhe veprimi i shpejtë bëhet mbibesim kur detyra ka ndryshuar, por personi nuk e ka vënë re. Një menaxher që peshon këshillën e ekspertit mund të bëjë dy pyetje: a është kjo një situatë me modele që realisht mund të mësohen, dhe a ka pasur eksperti reagim të qartë dhe në kohë mbi rezultatin në situata të ngjashme? Përgjigjja mund të ndryshojë mes një përjashtimi të njohur procesi dhe shkakut të një dështimi të rrallë sistemi.",
              "2009 verglichen Daniel Kahneman und Gary Klein zwei Forschungstraditionen, die oft als Rivalen gelten: die Studien zu Heuristiken und Verzerrungen und die naturalistische Entscheidungsforschung. Ihr gemeinsamer Schluss war bedingt. Die wahrscheinliche Qualität intuitiven Urteils hängt davon ab, ob das Umfeld lernbare Regelmäßigkeiten hat und ob die Praktikerin genug Gelegenheit hatte, sie durch Rückmeldung zu lernen. Das ist ein anspruchsvollerer Maßstab als Dienstjahre. Eine Arbeitskraft kann jahrelang auf wiederkehrende Lagen reagiert haben, ohne verlässlich zu erfahren, welche frühen Urteile richtig waren. Die Farbe eines Dashboards zu kennen ist nicht dasselbe wie den Mechanismus dahinter zu kennen, und schnelles Handeln wird zur Selbstüberschätzung, wenn die Aufgabe sich geändert hat, die Person es aber nicht bemerkt hat. Eine Führungskraft, die Expertenrat abwägt, kann zwei Fragen stellen: Hat diese Lage realistisch lernbare Muster, und hatte der Experte in ähnlichen Lagen klare und rechtzeitige Rückmeldung über die Ergebnisse? Die Antwort kann sich zwischen einer vertrauten Prozessausnahme und der Ursache eines seltenen Systemausfalls unterscheiden.") },
            { type: "cards", cols: 3, items: [
              { h: x("Regularity", "Rregullsia", "Regelmäßigkeit"), p: x("Is the environment learnable?", "A mësohet mjedisi?", "Ist das Umfeld lernbar?") },
              { h: x("Feedback", "Reagimi", "Rückmeldung"), p: x("Did prior outcomes correct judgement?", "A e korrigjuan rezultatet e mëparshme gjykimin?", "Haben frühere Ergebnisse das Urteil korrigiert?") },
              { h: x("Boundary", "Kufiri", "Grenze"), p: x("Is this problem inside real expertise?", "A është ky problem brenda ekspertizës së vërtetë?", "Liegt dieses Problem innerhalb echter Expertise?") },
            ] },
            { type: "p", text: x(
              "None of this supports ignoring qualified colleagues or demanding unrealistic statistical proof for every routine decision. It supports matching reliance on intuition to the validity of the task and keeping a clear path to further verification.",
              "Asgjë nga këto nuk mbështet shpërfilljen e kolegëve të kualifikuar apo kërkimin e provës statistikore joreale për çdo vendim rutinë. Mbështet përshtatjen e mbështetjes në intuitë me vlefshmërinë e detyrës dhe mbajtjen e një rruge të qartë për verifikim të mëtejshëm.",
              "Nichts davon rechtfertigt, qualifizierte Kolleginnen zu ignorieren oder für jede Routineentscheidung unrealistische statistische Beweise zu verlangen. Es stützt, das Vertrauen in Intuition an die Validität der Aufgabe anzupassen und einen klaren Weg zur weiteren Prüfung offenzuhalten.") },
            { type: "callout", reading: true, text: x(
              "Confidence is a feeling. Reliability is a property to be checked.",
              "Siguria është ndjenjë. Besueshmëria është veti që kontrollohet.",
              "Zuversicht ist ein Gefühl. Verlässlichkeit ist eine Eigenschaft, die geprüft wird.") },
          ],
          note: x(
            "Kahneman and Klein (2009), American Psychologist 64(6), 515–526. The three-card questions are an editorial translation.",
            "Kahneman e Klein (2009), American Psychologist 64(6), 515–526. Pyetjet me tri karta janë përkthim editorial.",
            "Kahneman und Klein (2009), American Psychologist 64(6), 515–526. Die drei Kartenfragen sind eine redaktionelle Übersetzung."),
          source: ["pressure-kahneman-klein-2009"],
        },
        {
          id: "iii-protocol", layer: "protocol",
          title: [x("Respect the expert,", "Respekto ekspertin,", "Den Experten achten,"), x("test the premise", "provo premisën", "die Prämisse prüfen")],
          lead: x(
            "Fast expert input becomes more useful when the manager knows which assumption the proposed action depends on.",
            "Mendimi i shpejtë i ekspertit bëhet më i dobishëm kur menaxheri e di nga cili supozim varet veprimi i propozuar.",
            "Schneller Expertenrat nützt mehr, wenn die Führungskraft weiß, von welcher Annahme die vorgeschlagene Handlung abhängt."),
          blocks: [
            { type: "steps", items: [
              { h: x("Ask what pattern was recognised", "Pyet cili model u njoh", "Fragen, welches Muster erkannt wurde"), p: x("The expert's working hypothesis, not presented as confirmed fact.", "Hipoteza e punës e ekspertit, jo e paraqitur si fakt i konfirmuar.", "Die Arbeitshypothese des Experten, nicht als bestätigte Tatsache dargestellt.") },
              { h: x("Check the key distinguishing fact", "Kontrollo faktin kyç dallues", "Den entscheidenden Unterscheidungsfakt prüfen"), p: x("An observation that could make the diagnosis wrong.", "Një vëzhgim që mund ta bënte diagnozën të gabuar.", "Eine Beobachtung, die die Diagnose widerlegen könnte.") },
              { h: x("Locate the expertise boundary", "Gjej kufirin e ekspertizës", "Die Grenze der Expertise finden"), p: x("Does the adviser have relevant experience in this class of situation?", "A ka këshilluesi përvojë përkatëse në këtë klasë situatash?", "Hat die beratende Person einschlägige Erfahrung mit dieser Art von Lage?") },
              { h: x("Respect the authorised decision role", "Respekto rolin e autorizuar të vendimit", "Die befugte Entscheidungsrolle achten"), p: x("Expertise is an input; rules of delegation or approval are not bypassed.", "Ekspertiza është hyrje; rregullat e delegimit ose të miratimit nuk anashkalohen.", "Expertise ist eine Eingabe; Delegations- oder Freigaberegeln werden nicht umgangen.") },
              { h: x("Make the next action explicit", "Bëje veprimin e radhës të qartë", "Die nächste Handlung ausdrücklich machen"), p: x("The chosen permitted response and the condition that would trigger review.", "Përgjigjja e lejuar e zgjedhur dhe kushti që do të nxiste rishikim.", "Die gewählte zulässige Antwort und die Bedingung, die eine Überprüfung auslöst.") },
              { h: x("Return outcome feedback", "Kthe reagimin mbi rezultatin", "Ergebnisrückmeldung geben"), p: x("Whether the premise held and what changed, without turning every error into blame.", "Nëse premisa qëndroi dhe çfarë ndryshoi, pa e kthyer çdo gabim në faj.", "Ob die Prämisse hielt und was sich änderte, ohne jeden Fehler zur Schuld zu machen.") },
            ] },
            { type: "p", text: x(
              "A quick review is useful only when it tests a consequential premise; it must not become a ritual of six questions while an immediate hazard continues. In urgent cases, authorised safety measures take precedence and learning follows containment. A small practice test could review anonymised decisions and ask how often a key assumption was identified in advance and revisited after the outcome: that measures discipline of thought, not the probability that intuition will succeed.",
              "Një rishikim i shpejtë është i dobishëm vetëm kur provon një premisë me pasoja; nuk duhet të bëhet ritual me gjashtë pyetje ndërsa një rrezik i menjëhershëm vazhdon. Në raste urgjente, masat e autorizuara të sigurisë kanë përparësi dhe të mësuarit vjen pas frenimit. Një provë e vogël praktike mund të rishikojë vendime anonime dhe të pyesë sa shpesh u identifikua paraprakisht një supozim kyç dhe u rishikua pas rezultatit: kjo mat disiplinën e mendimit, jo probabilitetin që intuita të ketë sukses.",
              "Eine schnelle Prüfung ist nur nützlich, wenn sie eine folgenreiche Prämisse testet; sie darf nicht zum Ritual aus sechs Fragen werden, während eine unmittelbare Gefahr fortbesteht. In dringenden Fällen gehen befugte Sicherheitsmaßnahmen vor, und Lernen folgt der Eindämmung. Ein kleiner Praxistest könnte anonymisierte Entscheidungen prüfen: Wie oft wurde eine Schlüsselannahme vorab benannt und nach dem Ergebnis überprüft? Das misst Denkdisziplin, nicht die Erfolgsquote der Intuition.") },
            { type: "callout", reading: true, text: x(
              "The best use of expertise is a faster route to a better question and a lawful next action.",
              "Përdorimi më i mirë i ekspertizës është një rrugë më e shpejtë drejt një pyetjeje më të mirë dhe një veprimi të radhës të ligjshëm.",
              "Der beste Einsatz von Expertise ist ein schnellerer Weg zu einer besseren Frage und einer rechtmäßigen nächsten Handlung.") },
          ],
          note: x(
            "Original operating protocol informed by Klein et al. (1986) and Kahneman and Klein (2009).",
            "Protokoll operativ origjinal i mbështetur te Klein et al. (1986) dhe Kahneman e Klein (2009).",
            "Eigenes Betriebsprotokoll nach Klein et al. (1986) und Kahneman und Klein (2009)."),
          source: ["klein-calderwood-clinton-cirocco-1986", "pressure-kahneman-klein-2009"],
        },
      ],
    },

    // Chapter IV. Who has the authority to act?
    {
      id: "ch-iv", type: "chapter", numeral: "IV",
      title: x("Who has the authority to act?", "Kush ka autoritetin për të vepruar?", "Wer hat die Befugnis zu handeln?"),
      pages: [
        {
          id: "iv-scene", layer: "scene", more: "what-last-mile-taught-me",
          title: [x("Four people", "Katër njerëz", "Vier Menschen"), x("know four pieces", "dinë katër pjesë", "kennen vier Teile")],
          lead: x(
            "A problem may cross roles that understand different parts of it, none of whom owns the complete decision.",
            "Një problem mund të kalojë nëpër role që kuptojnë pjesë të ndryshme të tij, asnjëri prej të cilëve nuk e zotëron vendimin e plotë.",
            "Ein Problem kann Rollen durchlaufen, die verschiedene Teile davon verstehen, ohne dass eine die ganze Entscheidung verantwortet."),
          blocks: [
            { type: "flag", text: x("Constructed cross-shift hotel scene, no real guest or incident", "Skenë e ndërtuar hoteli ndërmjet turneve, pa mysafir apo ngjarje të vërtetë", "Konstruierte Hotelszene über Schichten hinweg, kein echter Gast oder Vorfall") },
            { type: "p", text: x(
              "A room concern has been recorded during an earlier hotel shift. The night colleague knows what the guest reported and what was handed over. A specialist team understands the technical condition. Another role knows what customer-facing commitment can be made. Each person may have accurate information, but an unresolved case still requires a choice about the next permissible step. The handover might say “follow up” without identifying who is to make that decision. One person assumes the specialist will decide; the specialist assumes reception will communicate; reception assumes management will authorise a commitment. The problem is not necessarily incompetence or unwillingness. It can be the design of the boundaries between knowledgeable people and authorised people. The next person should not need to reconstruct every previous call simply to learn who can decide: the case should carry a verified condition, a responsible receiving role and the next approved communication commitment.",
              "Një shqetësim dhome është regjistruar gjatë një turni të mëparshëm hoteli. Kolegu i natës e di çfarë raportoi mysafiri dhe çfarë u dorëzua. Një ekip specialistësh e kupton gjendjen teknike. Një rol tjetër e di cili angazhim ndaj klientit mund të bëhet. Secili person mund të ketë informacion të saktë, por një rast i pazgjidhur kërkon prapë një zgjedhje për hapin e radhës të lejuar. Dorëzimi mund të thotë “ndiqe” pa identifikuar kush do ta marrë atë vendim. Njëri supozon se do të vendosë specialisti; specialisti supozon se recepsioni do të komunikojë; recepsioni supozon se menaxhimi do të autorizojë një angazhim. Problemi nuk është doemos paaftësi apo mungesë vullneti. Mund të jetë projektimi i kufijve mes njerëzve që dinë dhe njerëzve që janë të autorizuar. Personi tjetër nuk duhet të ketë nevojë ta rindërtojë çdo telefonatë të mëparshme thjesht për të mësuar kush mund të vendosë: rasti duhet të bartë një gjendje të verifikuar, një rol përgjegjës që e merr dhe angazhimin e radhës të miratuar për komunikim.",
              "Ein Zimmeranliegen wurde in einer früheren Hotelschicht erfasst. Die Nachtkollegin weiß, was der Gast meldete und was übergeben wurde. Ein Fachteam versteht den technischen Zustand. Eine andere Rolle weiß, welche Zusage gegenüber dem Gast möglich ist. Jede Person mag genaue Information haben, doch ein ungelöster Fall verlangt weiterhin eine Wahl über den nächsten zulässigen Schritt. Die Übergabe sagt vielleicht „nachfassen“, ohne zu benennen, wer entscheidet. Eine nimmt an, das Fachteam entscheide; das Fachteam nimmt an, die Rezeption kommuniziere; die Rezeption nimmt an, die Leitung genehmige eine Zusage. Das Problem ist nicht unbedingt Unfähigkeit oder Unwille. Es kann die Gestaltung der Grenzen zwischen Wissenden und Befugten sein. Die nächste Person sollte nicht jedes frühere Telefonat rekonstruieren müssen, nur um zu erfahren, wer entscheiden kann: Der Fall sollte einen geprüften Zustand, eine verantwortliche empfangende Rolle und die nächste genehmigte Kommunikationszusage tragen.") },
            { type: "p", text: x(
              "The author's Night Audit experience includes documented categories of room problems and shift handovers. No evidence is available for the precise conversation, room, timing, customer reaction or chain of responsibility described here; the scene is a composite meant to expose a general coordination mechanism, without revealing any hotel's internal security, payment or escalation procedures.",
              "Përvoja e autorit në Night Audit përfshin kategori të dokumentuara problemesh dhomash dhe dorëzimesh turni. Nuk ka asnjë provë për bisedën, dhomën, kohën, reagimin e klientit apo zinxhirin e përgjegjësisë të përshkruar këtu; skena është kompozim që synon të ekspozojë një mekanizëm të përgjithshëm koordinimi, pa zbuluar procedurat e brendshme të sigurisë, pagesës apo eskalimit të ndonjë hoteli.",
              "Die Night-Audit-Erfahrung des Autors umfasst dokumentierte Kategorien von Zimmerproblemen und Schichtübergaben. Für Gespräch, Zimmer, Zeitpunkt, Gästereaktion oder Verantwortungskette hier gibt es keinen Beleg; die Szene ist eine Zusammensetzung, die einen allgemeinen Koordinationsmechanismus zeigen soll, ohne die internen Sicherheits-, Zahlungs- oder Eskalationsverfahren eines Hotels offenzulegen.") },
            { type: "callout", reading: true, text: x(
              "Knowing a problem, owning the next step and being authorised to decide are different roles.",
              "Ta dish një problem, ta zotërosh hapin e radhës dhe të jesh i autorizuar të vendosësh janë role të ndryshme.",
              "Ein Problem zu kennen, den nächsten Schritt zu verantworten und entscheiden zu dürfen sind verschiedene Rollen.") },
          ],
          note: x(
            "Constructed hotel illustration; the applicable scholarship is Faraj and Xiao (2006) and Okhuysen and Bechky (2009). The essay named below says what the driver, the dispatcher and the manager each see.",
            "Ilustrim i ndërtuar hoteli; literatura e zbatueshme është Faraj e Xiao (2006) dhe Okhuysen e Bechky (2009). Eseja e emërtuar më poshtë thotë çfarë sheh secili: shoferi, dispeçeri dhe menaxheri.",
            "Konstruierte Hotelillustration; die einschlägige Forschung ist Faraj und Xiao (2006) und Okhuysen und Bechky (2009). Der unten genannte Essay sagt, was Fahrer, Disponent und Führungskraft jeweils sehen."),
          source: ["faraj-xiao-2006", "okhuysen-bechky-2009"],
        },
        {
          id: "iv-concept", layer: "concept",
          title: [x("Expertise coordination", "Koordinimi i ekspertizës", "Expertisekoordination"), x("meets live dialogue", "takon dialogun e gjallë", "trifft lebendigen Dialog")],
          lead: x(
            "Fast-response work relies on knowledge distributed across people who cannot all hold the same view.",
            "Puna me përgjigje të shpejtë mbështetet në dije të shpërndarë mes njerëzish që nuk mund ta kenë të gjithë të njëjtën pamje.",
            "Arbeit mit schneller Reaktion beruht auf Wissen, das über Menschen verteilt ist, die nicht alle dieselbe Sicht haben können."),
          blocks: [
            { type: "p", text: x(
              "Samer Faraj and Yan Xiao (2006) examined coordination in a medical trauma centre. They distinguished expertise-coordination practices, including protocols, knowledge sharing and flexible teaming, from dialogic practices used when novel events demanded joint sensemaking and cross-boundary intervention. The study shows how specialised actors coordinate without reducing every difficult choice to a fixed handoff. Its setting matters: a trauma centre has professional roles, urgency and potential harm that are not interchangeable with dispatch, wholesale sales or hotel operations, and its discussion of protocol breaking is not advice to bypass procedures in another industry. The relevant transfer is the distinction between prepared coordination and the conversation needed to make sense of an unexpected condition. An operation needs stable pathways for common situations; when the situation does not fit them, it needs a way to bring the relevant experts together quickly and identify who has decision authority. Escalation that only forwards a message may increase activity and still leave the case stalled.",
              "Samer Faraj dhe Yan Xiao (2006) shqyrtuan koordinimin në një qendër mjekësore traume. Ata i dalluan praktikat e koordinimit të ekspertizës, përfshirë protokollet, ndarjen e dijes dhe ekipimin fleksibël, nga praktikat dialogjike të përdorura kur ngjarje të reja kërkonin kuptim të përbashkët dhe ndërhyrje përtej kufijve. Studimi tregon si koordinohen aktorët e specializuar pa e reduktuar çdo zgjedhje të vështirë në një dorëzim të fiksuar. Mjedisi i tij ka rëndësi: një qendër traume ka role profesionale, urgjencë dhe dëm të mundshëm që nuk janë të këmbyeshme me dispeçerimin, shitjet me shumicë apo operacionet e hotelit, dhe diskutimi i saj për thyerjen e protokolleve nuk është këshillë për të anashkaluar procedurat në një industri tjetër. Bartja përkatëse është dallimi mes koordinimit të përgatitur dhe bisedës që duhet për ta kuptuar një kusht të papritur. Një operacion ka nevojë për rrugë të qëndrueshme për situatat e zakonshme; kur situata nuk përshtatet me to, ka nevojë për një mënyrë për t'i bashkuar shpejt ekspertët përkatës dhe për të identifikuar kush ka autoritetin e vendimit. Eskalimi që vetëm e përcjell një mesazh mund ta rrisë aktivitetin dhe prapë ta lërë rastin të bllokuar.",
              "Samer Faraj und Yan Xiao (2006) untersuchten Koordination in einem Traumazentrum. Sie unterschieden Praktiken der Expertisekoordination, darunter Protokolle, Wissensteilung und flexible Teambildung, von dialogischen Praktiken, wenn neuartige Ereignisse gemeinsames Verstehen und grenzüberschreitendes Eingreifen verlangten. Die Studie zeigt, wie spezialisierte Akteure koordinieren, ohne jede schwierige Wahl auf eine feste Übergabe zu reduzieren. Ihr Umfeld zählt: Ein Traumazentrum hat Berufsrollen, Dringlichkeit und mögliche Schäden, die mit Disposition, Großhandel oder Hotelbetrieb nicht austauschbar sind, und seine Diskussion des Protokollbruchs ist kein Rat, in einer anderen Branche Verfahren zu umgehen. Übertragbar ist die Unterscheidung zwischen vorbereiteter Koordination und dem Gespräch, das nötig ist, um eine unerwartete Lage zu verstehen. Ein Betrieb braucht stabile Wege für gewöhnliche Lagen; passt die Lage nicht dazu, braucht er einen Weg, die relevanten Experten schnell zusammenzubringen und zu klären, wer Entscheidungsbefugnis hat. Eskalation, die nur eine Nachricht weiterleitet, kann die Aktivität erhöhen und den Fall trotzdem blockiert lassen.") },
            { type: "chain", items: [
              { h: x("Routine", "Rutina", "Routine"), p: x("Known rules and roles.", "Rregulla dhe role të njohura.", "Bekannte Regeln und Rollen.") },
              { h: x("Novel event", "Ngjarje e re", "Neues Ereignis"), p: x("Joint sensemaking.", "Kuptim i përbashkët.", "Gemeinsames Verstehen.") },
              { h: x("Authority", "Autoriteti", "Befugnis"), p: x("Permitted decision.", "Vendim i lejuar.", "Zulässige Entscheidung.") },
              { h: x("Outcome", "Rezultati", "Ergebnis"), p: x("Feedback to each role.", "Reagim për çdo rol.", "Rückmeldung an jede Rolle.") },
            ] },
            { type: "callout", reading: true, text: x(
              "Prepared coordination and real-time dialogue are complements, not substitutes.",
              "Koordinimi i përgatitur dhe dialogu në kohë reale plotësojnë njëri-tjetrin, nuk zëvendësohen.",
              "Vorbereitete Koordination und Dialog in Echtzeit ergänzen sich, sie ersetzen sich nicht.") },
          ],
          note: x(
            "Faraj and Xiao (2006), Management Science 52(8), 1155–1169. Expertise without a clear decision right can be ignored; a decision right without access to expertise can be exercised badly. Cross-sector implications are editorial.",
            "Faraj e Xiao (2006), Management Science 52(8), 1155–1169. Ekspertiza pa një të drejtë të qartë vendimi mund të shpërfillet; një e drejtë vendimi pa qasje në ekspertizë mund të ushtrohet keq. Pasojat ndërsektoriale janë editoriale.",
            "Faraj und Xiao (2006), Management Science 52(8), 1155–1169. Expertise ohne klares Entscheidungsrecht kann ignoriert werden; ein Entscheidungsrecht ohne Zugang zu Expertise kann schlecht ausgeübt werden. Sektorübergreifende Folgerungen sind redaktionell."),
          source: ["faraj-xiao-2006"],
        },
        {
          id: "iv-evidence", layer: "concept",
          title: [x("Three conditions", "Tri kushte", "Drei Bedingungen"), x("for joined-up work", "për punë të lidhur", "für verbundene Arbeit")],
          lead: x(
            "Coordination is not the number of messages exchanged. It is the condition of being able to act together.",
            "Koordinimi nuk është numri i mesazheve të shkëmbyera. Është gjendja e të qenit në gjendje të veprosh bashkë.",
            "Koordination ist nicht die Zahl der ausgetauschten Nachrichten. Sie ist der Zustand, gemeinsam handeln zu können."),
          blocks: [
            { type: "p", text: x(
              "Okhuysen and Bechky (2009) synthesised research on coordination across organisational settings. Their framework argues that mechanisms such as routines, schedules, meetings and plans help create three integrative conditions: accountability, predictability and common understanding. The categories are useful for diagnosing why information can travel while action stalls. Accountability asks which person or role is answerable for the next decision and outcome. Predictability asks whether the other parties can anticipate what that role will do and when it will respond. Common understanding asks whether the parties share enough of the situation to coordinate without repeatedly rebuilding the story. The conditions are distinct: a named owner without adequate facts may decide poorly; a detailed report with no owner may be filed indefinitely; a schedule nobody trusts coordinates nothing. The article is an integrative conceptual review, not a randomised test of a checklist; it provides a lens for a local pilot that still needs definitions and measurement.",
              "Okhuysen dhe Bechky (2009) sintetizuan kërkimin mbi koordinimin nëpër mjedise organizative. Kuadri i tyre argumenton se mekanizma si rutinat, oraret, mbledhjet dhe planet ndihmojnë të krijohen tri kushte integruese: përgjegjshmëria, parashikueshmëria dhe kuptimi i përbashkët. Kategoritë janë të dobishme për të diagnostikuar pse informacioni mund të udhëtojë, ndërsa veprimi bllokohet. Përgjegjshmëria pyet cili person ose rol përgjigjet për vendimin dhe rezultatin e radhës. Parashikueshmëria pyet nëse palët e tjera mund të parashikojnë çfarë do të bëjë ai rol dhe kur do të përgjigjet. Kuptimi i përbashkët pyet nëse palët ndajnë mjaftueshëm nga situata që të koordinohen pa e rindërtuar vazhdimisht historinë. Kushtet janë të dallueshme: një përgjegjës i emërtuar pa fakte të mjaftueshme mund të vendosë keq; një raport i hollësishëm pa përgjegjës mund të arkivohet pafundësisht; një orar që askush nuk e beson nuk koordinon asgjë. Artikulli është rishikim konceptual integrues, jo provë e randomizuar e një liste kontrolli; jep një lente për një pilot lokal që ka ende nevojë për përkufizime dhe matje.",
              "Okhuysen und Bechky (2009) fassten die Koordinationsforschung über Organisationsumfelder hinweg zusammen. Ihr Rahmen argumentiert, dass Mechanismen wie Routinen, Pläne, Besprechungen und Zeitpläne drei integrierende Bedingungen schaffen: Verantwortlichkeit, Vorhersehbarkeit und gemeinsames Verständnis. Die Kategorien helfen zu diagnostizieren, warum Information reisen kann, während Handeln stockt. Verantwortlichkeit fragt, welche Person oder Rolle für die nächste Entscheidung und das Ergebnis einsteht. Vorhersehbarkeit fragt, ob die anderen Beteiligten absehen können, was diese Rolle tut und wann sie antwortet. Gemeinsames Verständnis fragt, ob die Beteiligten genug von der Lage teilen, um zu koordinieren, ohne die Geschichte immer wieder neu aufzubauen. Die Bedingungen sind verschieden: Eine benannte Verantwortliche ohne ausreichende Fakten kann schlecht entscheiden; ein ausführlicher Bericht ohne Verantwortliche kann endlos abgelegt werden; ein Zeitplan, dem niemand traut, koordiniert nichts. Der Artikel ist eine integrierende konzeptionelle Übersicht, kein randomisierter Test einer Checkliste; er bietet eine Linse für einen örtlichen Pilot, der noch Definitionen und Messung braucht.") },
            { type: "cards", cols: 3, items: [
              { h: x("Accountability", "Përgjegjshmëria", "Verantwortlichkeit"), p: x("Who accepts the decision and outcome?", "Kush e pranon vendimin dhe rezultatin?", "Wer übernimmt Entscheidung und Ergebnis?") },
              { h: x("Predictability", "Parashikueshmëria", "Vorhersehbarkeit"), p: x("When and how will that role respond?", "Kur dhe si do të përgjigjet ai rol?", "Wann und wie antwortet diese Rolle?") },
              { h: x("Common view", "Pamja e përbashkët", "Gemeinsame Sicht"), p: x("What facts and limits are shared?", "Cilat fakte dhe kufij ndahen?", "Welche Fakten und Grenzen sind geteilt?") },
            ] },
            { type: "callout", reading: true, text: x(
              "A message has travelled successfully only when the receiver understands what they can do next.",
              "Një mesazh ka udhëtuar me sukses vetëm kur marrësi e kupton çfarë mund të bëjë më pas.",
              "Eine Nachricht ist erst dann angekommen, wenn der Empfänger versteht, was er als Nächstes tun kann.") },
          ],
          note: x(
            "Okhuysen and Bechky (2009), Academy of Management Annals 3(1), 463–502. The questions are an editorial adaptation.",
            "Okhuysen e Bechky (2009), Academy of Management Annals 3(1), 463–502. Pyetjet janë përshtatje editoriale.",
            "Okhuysen und Bechky (2009), Academy of Management Annals 3(1), 463–502. Die Fragen sind eine redaktionelle Anpassung."),
          source: ["okhuysen-bechky-2009"],
        },
        {
          id: "iv-protocol", layer: "protocol",
          title: [x("Authority is a map,", "Autoriteti është hartë,", "Befugnis ist eine Karte,"), x("not a job title", "jo titull pune", "kein Jobtitel")],
          lead: x(
            "Before an exception occurs, define the role of the observer, the expert, the decision owner and the communicator.",
            "Para se të ndodhë një përjashtim, përkufizo rolin e vëzhguesit, të ekspertit, të pronarit të vendimit dhe të komunikuesit.",
            "Vor der Ausnahme die Rollen klären: beobachten, beraten, entscheiden, kommunizieren."),
          blocks: [
            { type: "steps", items: [
              { h: x("List recurring decision classes", "Rendit klasat e përsëritura të vendimit", "Wiederkehrende Entscheidungsklassen auflisten"), p: x("One narrow class of operating exception, not “all incidents”.", "Një klasë e ngushtë përjashtimesh operative, jo “të gjitha incidentet”.", "Eine enge Klasse betrieblicher Ausnahmen, nicht „alle Vorfälle“.") },
              { h: x("Identify the authorised owner", "Identifiko përgjegjësin e autorizuar", "Die befugte Verantwortliche bestimmen"), p: x("Existing delegation, policy and legal requirements.", "Delegimi, politika dhe kërkesat ligjore ekzistuese.", "Bestehende Delegation, Richtlinien und rechtliche Vorgaben.") },
              { h: x("Define the fact threshold", "Përkufizo pragun e fakteve", "Die Faktenschwelle definieren"), p: x("What must be known before that person can decide?", "Çfarë duhet të dihet para se ai person të vendosë?", "Was muss bekannt sein, bevor diese Person entscheiden kann?") },
              { h: x("Name a safe holding state", "Emërto një gjendje të sigurt pritjeje", "Einen sicheren Haltezustand benennen"), p: x("The permitted containment or pause while the decision is pending.", "Frenimi ose ndalimi i lejuar ndërsa vendimi është në pritje.", "Die zulässige Eindämmung oder Pause, solange die Entscheidung aussteht.") },
              { h: x("Set an escalation trigger", "Cakto një shkas eskalimi", "Einen Eskalationsauslöser setzen"), p: x("When, and to which authorised role, the issue moves if no decision occurs.", "Kur, dhe te cili rol i autorizuar, kalon çështja nëse nuk merret vendim.", "Wann und an welche befugte Rolle das Thema geht, wenn keine Entscheidung fällt.") },
              { h: x("Confirm the communication duty", "Konfirmo detyrën e komunikimit", "Die Kommunikationspflicht bestätigen"), p: x("Who tells affected workers or customers what the decision means.", "Kush u thotë punonjësve ose klientëve të prekur çfarë do të thotë vendimi.", "Wer betroffenen Beschäftigten oder Kunden sagt, was die Entscheidung bedeutet.") },
            ] },
            { type: "p", text: x(
              "A generalised chart may contain four functions: notice, advise, decide and communicate. One person may perform several, but that must be intentional rather than assumed. A chart for a particular hotel or logistics employer is made and approved by the responsible organisation; this publication cannot assign real privileges, and for sensitive or hazardous work no editorial map substitutes for authorised policy. The map is a test of clarity: can the team explain the next permitted move without inventing a new chain of command?",
              "Një hartë e përgjithësuar mund të përmbajë katër funksione: vër re, këshillo, vendos dhe komuniko. Një person mund të kryejë disa prej tyre, por kjo duhet të jetë e qëllimshme, jo e supozuar. Një hartë për një hotel ose punëdhënës logjistik të caktuar bëhet dhe miratohet nga organizata përgjegjëse; ky botim nuk cakton dot privilegje të vërteta, dhe për punë të ndjeshme ose të rrezikshme asnjë hartë editoriale nuk e zëvendëson politikën e autorizuar. Harta është provë qartësie: a mund ta shpjegojë ekipi hapin e radhës të lejuar pa shpikur një zinxhir të ri komande?",
              "Eine allgemeine Karte kann vier Funktionen enthalten: bemerken, beraten, entscheiden und kommunizieren. Eine Person kann mehrere ausüben, aber bewusst, nicht stillschweigend. Eine Karte für ein bestimmtes Hotel oder einen Logistikbetrieb erstellt und genehmigt die zuständige Organisation; diese Veröffentlichung vergibt keine echten Rechte, und bei sensibler oder gefährlicher Arbeit ersetzt keine redaktionelle Karte die befugte Richtlinie. Die Karte ist ein Klarheitstest: Kann das Team den nächsten zulässigen Zug erklären, ohne eine neue Befehlskette zu erfinden?") },
            { type: "callout", reading: true, text: x(
              "Deference to expertise is not abdication of accountability; both must be designed.",
              "Deferenca ndaj ekspertizës nuk është heqje dorë nga përgjegjshmëria; të dyja duhen projektuar.",
              "Hinwendung zur Expertise ist kein Verzicht auf Verantwortlichkeit; beides muss gestaltet werden.") },
          ],
          note: x(
            "Editorial role design inspired by Okhuysen and Bechky (2009) and Faraj and Xiao (2006); not an authorised chart.",
            "Projektim editorial rolesh i frymëzuar nga Okhuysen e Bechky (2009) dhe Faraj e Xiao (2006); jo hartë e autorizuar.",
            "Redaktionelle Rollengestaltung nach Okhuysen und Bechky (2009) und Faraj und Xiao (2006); keine befugte Karte."),
          source: ["okhuysen-bechky-2009", "faraj-xiao-2006"],
        },
      ],
    },

    // Chapter V. The cost of waiting for permission
    {
      id: "ch-v", type: "chapter", numeral: "V",
      title: x("The cost of waiting for permission", "Kostoja e pritjes për leje", "Der Preis des Wartens auf Erlaubnis"),
      pages: [
        {
          id: "v-scene", layer: "scene", more: "solve-it-or-escalate-it",
          title: [x("The queue", "Radha", "Die Warteschlange,"), x("that has no vehicle", "që nuk ka automjet", "die kein Fahrzeug hat")],
          lead: x(
            "An operation can develop a queue of unresolved choices even when no physical material is accumulating.",
            "Një operacion mund të krijojë një radhë zgjedhjesh të pazgjidhura edhe kur nuk grumbullohet asnjë material fizik.",
            "Ein Betrieb kann eine Warteschlange ungelöster Entscheidungen bilden, auch wenn sich kein physisches Material staut."),
          blocks: [
            { type: "flag", text: x("Hypothetical loading-ramp illustration; times and people invented", "Ilustrim hipotetik i rampës së ngarkimit; kohët dhe njerëzit të shpikur", "Hypothetische Laderampen-Illustration; Zeiten und Personen erfunden") },
            { type: "p", text: x(
              "Imagine a morning when a loading exception has been checked. The items are not where the team expected, but the physical condition is now clear. The driver cannot change the approved process; the supervisor has reported the case; a person with the required authority is considering the next permissible step. Work is not moving, although the missing information is no longer the main cause of delay. This is a decision queue. Unlike a trolley line, it has no obvious physical length: it may exist across messages, approval requests, follow-up calls and separate screens. To a manager looking at one department's task list, each person may appear busy and compliant. To the customer, the outcome remains late. Not all waiting is waste. Permission may protect money, safety, contractual commitments or the integrity of the process. The managerial question is what the waiting accomplishes: a genuine verification interval buys evidence; an unowned request simply makes the next commitment harder to keep.",
              "Imagjino një mëngjes kur një përjashtim ngarkimi është kontrolluar. Artikujt nuk janë aty ku ekipi i priste, por gjendja fizike tani është e qartë. Shoferi nuk e ndryshon dot procesin e miratuar; mbikëqyrësi e ka raportuar rastin; një person me autoritetin e kërkuar po shqyrton hapin e radhës të lejuar. Puna nuk po lëviz, ndonëse informacioni që mungonte nuk është më shkaku kryesor i vonesës. Kjo është radhë vendimi. Ndryshe nga një rresht karrocash, nuk ka gjatësi fizike të dukshme: mund të ekzistojë nëpër mesazhe, kërkesa miratimi, telefonata ndjekëse dhe ekrane të ndara. Për një menaxher që shikon listën e detyrave të një departamenti, çdo person mund të duket i zënë dhe në rregull. Për klientin, rezultati mbetet i vonuar. Jo çdo pritje është humbje. Leja mund të mbrojë para, siguri, angazhime kontraktuale ose integritetin e procesit. Pyetja menaxheriale është çfarë arrin pritja: një interval i vërtetë verifikimi blen prova; një kërkesë pa përgjegjës thjesht e bën angazhimin e radhës më të vështirë për t'u mbajtur.",
              "Man stelle sich einen Morgen vor, an dem eine Ladeausnahme geprüft wurde. Die Artikel sind nicht dort, wo das Team sie erwartete, doch der physische Zustand ist jetzt klar. Der Fahrer kann den genehmigten Prozess nicht ändern; die Vorgesetzte hat den Fall gemeldet; eine Person mit der nötigen Befugnis erwägt den nächsten zulässigen Schritt. Die Arbeit bewegt sich nicht, obwohl fehlende Information nicht mehr die Hauptursache der Verzögerung ist. Das ist eine Entscheidungswarteschlange. Anders als eine Wagenreihe hat sie keine sichtbare physische Länge: Sie kann über Nachrichten, Freigabeanfragen, Rückrufe und getrennte Bildschirme verteilt sein. Für eine Führungskraft, die die Aufgabenliste einer Abteilung betrachtet, wirkt jede Person beschäftigt und regelkonform. Für den Kunden bleibt das Ergebnis verspätet. Nicht jedes Warten ist Verschwendung. Erlaubnis kann Geld, Sicherheit, vertragliche Zusagen oder die Integrität des Prozesses schützen. Die Führungsfrage ist, was das Warten leistet: Ein echtes Prüfintervall kauft Belege; eine Anfrage ohne Verantwortliche macht die nächste Zusage nur schwerer einzuhalten.") },
            { type: "p", text: x(
              "The categories of loading exceptions and communication are grounded in the author's last-mile background, but the timing, escalation and resolution described here are not documented and must not be assigned to an actual employer. The case serves only to clarify what an analyst would need to record before making an operational claim.",
              "Kategoritë e përjashtimeve të ngarkimit dhe të komunikimit mbështeten në sfondin e autorit në miljen e fundit, por koha, eskalimi dhe zgjidhja e përshkruara këtu nuk janë të dokumentuara dhe nuk duhet t'i atribuohen një punëdhënësi të vërtetë. Rasti shërben vetëm për të sqaruar çfarë do t'i duhej të regjistronte një analist para se të bënte një pohim operacional.",
              "Die Kategorien der Ladeausnahmen und der Kommunikation gründen im Last-Mile-Hintergrund des Autors, doch Zeitpunkt, Eskalation und Lösung hier sind nicht dokumentiert und dürfen keinem echten Arbeitgeber zugeschrieben werden. Der Fall dient nur dazu, zu klären, was ein Analyst festhalten müsste, bevor er eine betriebliche Behauptung aufstellt.") },
            { type: "callout", reading: true, text: x(
              "The absence of movement may mean a necessary hold, a missing fact or an ownerless decision.",
              "Mungesa e lëvizjes mund të thotë ndalim i nevojshëm, fakt që mungon ose vendim pa përgjegjës.",
              "Fehlende Bewegung kann einen nötigen Halt, einen fehlenden Fakt oder eine Entscheidung ohne Verantwortliche bedeuten.") },
          ],
          note: x(
            "Constructed illustration; the categorisation of waiting as a decision queue is editorial, not a measured characteristic of any company. The essay named below is about the limit of one's own decision.",
            "Ilustrim i ndërtuar; kategorizimi i pritjes si radhë vendimi është editorial, jo veti e matur e ndonjë kompanie. Eseja e emërtuar më poshtë flet për kufirin e vendimit të vet.",
            "Konstruierte Illustration; die Einordnung des Wartens als Entscheidungswarteschlange ist redaktionell, keine gemessene Eigenschaft eines Unternehmens. Der unten genannte Essay handelt von der Grenze der eigenen Entscheidung."),
        },
        {
          id: "v-model", layer: "concept",
          title: [x("Twelve open items,", "Dymbëdhjetë pika të hapura,", "Zwölf offene Punkte,"), x("counted by state", "të numëruara sipas gjendjes", "nach Zustand gezählt")],
          lead: x(
            "A fully synthetic snapshot shows how a decision queue can be made visible by naming the state of each open case.",
            "Një pamje krejt sintetike tregon si mund të bëhet e dukshme një radhë vendimi duke e emërtuar gjendjen e çdo rasti të hapur.",
            "Eine vollständig synthetische Momentaufnahme zeigt, wie eine Entscheidungswarteschlange sichtbar wird, wenn der Zustand jedes offenen Falls benannt ist."),
          blocks: [
            { type: "flag", text: synthetic },
            { type: "hbars", max: 12, hypothetical: true,
              label: x("Invented snapshot at 10:00, twelve open exceptions", "Pamje e shpikur në orën 10:00, dymbëdhjetë përjashtime të hapura", "Erfundene Momentaufnahme um 10:00, zwölf offene Ausnahmen"),
              items: [
                { k: x("Noticed, not yet verified", "Të vëna re, ende të paverifikuara", "Bemerkt, noch ungeprüft"), v: 3, n: "3" },
                { k: x("Verified, owner accepted", "Të verifikuara, përgjegjësi i pranuar", "Geprüft, Verantwortliche hat übernommen"), v: 2, n: "2" },
                { k: x("Verified, no accepted owner", "Të verifikuara, pa përgjegjës të pranuar", "Geprüft, keine übernommene Verantwortung"), v: 4, n: "4", alert: true },
                { k: x("Decided, not yet executed", "Të vendosura, ende të paekzekutuara", "Entschieden, noch nicht ausgeführt"), v: 1, n: "1" },
                { k: x("Executed, outcome unchecked", "Të ekzekutuara, rezultati i pakontrolluar", "Ausgeführt, Ergebnis ungeprüft"), v: 2, n: "2" },
              ] },
            { type: "p", text: x(
              "Every count is invented so the states can be compared, not measured at any station. On a single task list these twelve items would all read “open”. Named by state, the largest group is the one nobody can shorten by working harder: four cases are verified and still have no owner who has accepted the decision. Three are legitimately waiting for facts, one is waiting for execution, two were executed without anyone checking the result. A real operation has its own states and its own authorised owners; the chart shows only that a queue of decisions becomes manageable once each case says which clock it is waiting on.",
              "Çdo numër është i shpikur, që gjendjet të krahasohen, jo i matur në ndonjë stacion. Në një listë të vetme detyrash, këto dymbëdhjetë pika do të lexoheshin të gjitha “të hapura”. Të emërtuara sipas gjendjes, grupi më i madh është ai që askush nuk e shkurton dot duke punuar më shumë: katër raste janë verifikuar dhe ende nuk kanë përgjegjës që e ka pranuar vendimin. Tri po presin me të drejtë fakte, një po pret ekzekutim, dy u ekzekutuan pa e kontrolluar askush rezultatin. Një operacion i vërtetë ka gjendjet e veta dhe përgjegjësit e vet të autorizuar; grafiku tregon vetëm se një radhë vendimesh bëhet e menaxhueshme sapo çdo rast thotë cilën orë po pret.",
              "Jede Zahl ist erfunden, damit die Zustände vergleichbar sind, nirgends gemessen. Auf einer einzigen Aufgabenliste stünden alle zwölf Punkte als „offen“. Nach Zustand benannt, ist die größte Gruppe die, die niemand durch mehr Einsatz verkürzen kann: Vier Fälle sind geprüft und haben noch keine Verantwortliche, die die Entscheidung übernommen hat. Drei warten berechtigt auf Fakten, einer auf Ausführung, zwei wurden ausgeführt, ohne dass jemand das Ergebnis prüfte. Ein echter Betrieb hat eigene Zustände und eigene befugte Verantwortliche; das Diagramm zeigt nur, dass eine Entscheidungswarteschlange handhabbar wird, sobald jeder Fall sagt, auf welche Uhr er wartet.") },
            { type: "callout", reading: true, text: x(
              "An “open” count hides the ownerless cases. A count by state puts them first.",
              "Një numërim “të hapura” i fsheh rastet pa përgjegjës. Një numërim sipas gjendjes i vendos ato të parat.",
              "Eine Zahl „offen“ verbirgt die Fälle ohne Verantwortliche. Eine Zählung nach Zustand stellt sie voran.") },
          ],
          note: x(
            "Every value on this page is synthetic, authored for this volume; the states follow the four clocks of Chapter I. The author's PDF describes the decision queue without counting it.",
            "Çdo vlerë në këtë faqe është sintetike, e shkruar për këtë vëllim; gjendjet ndjekin katër orët e Kapitullit I. PDF-ja e autorit e përshkruan radhën e vendimit pa e numëruar.",
            "Jeder Wert auf dieser Seite ist synthetisch, für diesen Band verfasst; die Zustände folgen den vier Uhren des Kapitels I. Das PDF des Autors beschreibt die Entscheidungswarteschlange, ohne sie zu zählen."),
          source: ["okhuysen-bechky-2009"],
        },
        {
          id: "v-concept", layer: "concept",
          title: [x("Fast decisions", "Vendimet e shpejta", "Schnelle Entscheidungen"), x("can use more evidence", "mund të përdorin më shumë prova", "können mehr Belege nutzen")],
          lead: x(
            "An inductive study of fast-moving technology firms challenged the claim that rapid decisions require less information.",
            "Një studim induktiv i firmave teknologjike me ritëm të shpejtë e sfidoi pretendimin se vendimet e shpejta kërkojnë më pak informacion.",
            "Eine induktive Studie schnelllebiger Technologiefirmen stellte die Behauptung infrage, schnelle Entscheidungen bräuchten weniger Information."),
          blocks: [
            { type: "stat", n: "8", t: x("microcomputer firms in Eisenhardt's inductive 1989 study of strategic decision making: a sample size, not a decision speed", "firma mikrokompjuterësh në studimin induktiv të Eisenhardt-it të vitit 1989 mbi vendimmarrjen strategjike: madhësi mostre, jo shpejtësi vendimi", "Mikrocomputerfirmen in Eisenhardts induktiver Studie von 1989 zur strategischen Entscheidungsfindung: eine Stichprobengröße, kein Entscheidungstempo") },
            { type: "p", text: x(
              "Kathleen Eisenhardt (1989) investigated strategic decision making in eight firms from the high-velocity microcomputer industry. In that context, faster decision makers used more real-time information, developed more alternatives and used a two-tiered advice process; conflict resolution and the integration of strategy with tactical plans also mattered. This is not a randomised experiment, and it concerns executives making strategic choices, not a dispatcher clearing a route. The practical lesson is not “collect everything”. It is to distinguish real-time, decision-relevant evidence from information gathered because nobody knows when to stop. A brief that shows the current condition, alternatives and their consequences supports a timely decision better than an escalating pile of status emails. A disciplined team prepares the facts before the decision maker becomes available and identifies which disputes must be resolved rather than allowed to travel silently into execution. The fastest wrong decision is not a good outcome; neither is the slowest risk-free conversation.",
              "Kathleen Eisenhardt (1989) hetoi vendimmarrjen strategjike në tetë firma të industrisë së mikrokompjuterëve me shpejtësi të lartë. Në atë kontekst, vendimmarrësit më të shpejtë përdornin më shumë informacion në kohë reale, zhvillonin më shumë alternativa dhe përdornin një proces këshillimi me dy nivele; zgjidhja e konflikteve dhe integrimi i strategjisë me planet taktike kishin gjithashtu rëndësi. Ky nuk është eksperiment i randomizuar dhe ka të bëjë me drejtues që bëjnë zgjedhje strategjike, jo me një dispeçer që pastron një rrugë. Mësimi praktik nuk është “mblidh gjithçka”. Është ta dallosh provën në kohë reale, të rëndësishme për vendimin, nga informacioni i mbledhur se askush nuk e di kur të ndalet. Një përmbledhje që tregon gjendjen aktuale, alternativat dhe pasojat e tyre e mbështet një vendim në kohë më mirë se një stivë në rritje emailesh statusi. Një ekip i disiplinuar i përgatit faktet para se vendimmarrësi të bëhet i disponueshëm dhe identifikon cilat mosmarrëveshje duhen zgjidhur, në vend që të lejohen të udhëtojnë në heshtje në ekzekutim. Vendimi i gabuar më i shpejtë nuk është rezultat i mirë; as biseda më e ngadaltë pa rrezik.",
              "Kathleen Eisenhardt (1989) untersuchte strategische Entscheidungsfindung in acht Firmen der schnelllebigen Mikrocomputerbranche. In diesem Kontext nutzten schnellere Entscheider mehr Echtzeitinformation, entwickelten mehr Alternativen und nutzten einen zweistufigen Beratungsprozess; Konfliktlösung und die Verbindung von Strategie und taktischen Plänen zählten ebenfalls. Das ist kein randomisiertes Experiment, und es betrifft Führungskräfte mit strategischen Entscheidungen, keinen Disponenten, der eine Tour freigibt. Die praktische Lehre lautet nicht „alles sammeln“. Sie lautet, entscheidungsrelevante Echtzeitbelege von Information zu trennen, die gesammelt wird, weil niemand weiß, wann Schluss ist. Eine Vorlage, die die aktuelle Lage, Alternativen und ihre Folgen zeigt, stützt eine rechtzeitige Entscheidung besser als ein wachsender Stapel Statusmails. Ein diszipliniertes Team bereitet die Fakten vor, bevor die Entscheiderin verfügbar ist, und erkennt, welche Streitfragen gelöst werden müssen, statt still in die Ausführung zu wandern. Die schnellste falsche Entscheidung ist kein gutes Ergebnis; das langsamste risikofreie Gespräch auch nicht.") },
            { type: "callout", reading: true, text: x(
              "Timeliness can depend on preparing a better information flow, not merely pressuring people to reply.",
              "Koha e duhur mund të varet nga përgatitja e një rrjedhe më të mirë informacioni, jo thjesht nga presioni mbi njerëzit që të përgjigjen.",
              "Rechtzeitigkeit kann davon abhängen, einen besseren Informationsfluss vorzubereiten, nicht nur Druck auf Antworten zu machen.") },
          ],
          note: x(
            "Eisenhardt (1989), Academy of Management Journal 32(3), 543–576. The study offers propositions for a specific industry; applicability to frontline service operations is proposed, not tested.",
            "Eisenhardt (1989), Academy of Management Journal 32(3), 543–576. Studimi jep propozime për një industri të caktuar; zbatueshmëria në operacionet e shërbimit në vijën e parë është e propozuar, jo e provuar.",
            "Eisenhardt (1989), Academy of Management Journal 32(3), 543–576. Die Studie bietet Thesen für eine bestimmte Branche; die Übertragbarkeit auf Servicebetriebe an der Front ist vorgeschlagen, nicht getestet."),
          source: ["eisenhardt-1989"],
        },
        {
          id: "v-evidence", layer: "concept",
          title: [x("Rules that", "Rregullat që", "Regeln, die"), x("make flexibility possible", "e bëjnë fleksibilitetin të mundur", "Flexibilität möglich machen")],
          lead: x(
            "Strong decision structures can enable adaptation rather than merely slow it.",
            "Strukturat e forta të vendimit mund ta mundësojnë përshtatjen, jo thjesht ta ngadalësojnë.",
            "Starke Entscheidungsstrukturen können Anpassung ermöglichen, statt sie nur zu bremsen."),
          blocks: [
            { type: "p", text: x(
              "Bigley and Roberts (2001) investigated the Incident Command System as used by a fire department. Their inductive research examined how a formal structure could support flexible and reliable action in complex and volatile settings. The study counters an easy caricature: not every hierarchy is bureaucratic delay, and not every decentralised action is adaptive. The design challenge is a balance of boundaries and access. The organisation must say what cannot be decided locally; it must also make the route to an authorised decision understandable and workable. When an unexpected condition emerges, workers need a way to bring specialised evidence into the decision without rewriting the authority structure from scratch. Weick and Sutcliffe (2015) discuss “deference to expertise” in high-reliability organising: a principle about mobilising relevant knowledge, not about handing decision rights to whoever speaks with the most confidence. Nothing in these studies authorises an operations manager to copy emergency command procedures into hospitality or last-mile logistics; local law, training, safety and policy control the real design. The transferable question is whether the approved hierarchy makes informed, lawful action possible at the pace the situation demands.",
              "Bigley dhe Roberts (2001) hetuan Sistemin e Komandës së Incidenteve siç përdorej nga një departament zjarrfikësish. Kërkimi i tyre induktiv shqyrtoi si një strukturë formale mund ta mbështeste veprimin fleksibël dhe të besueshëm në mjedise të ndërlikuara dhe të paqëndrueshme. Studimi e kundërshton një karikaturë të lehtë: jo çdo hierarki është vonesë burokratike, dhe jo çdo veprim i decentralizuar është adaptiv. Sfida e projektimit është një balancë kufijsh dhe qasjeje. Organizata duhet të thotë çfarë nuk mund të vendoset lokalisht; duhet ta bëjë edhe rrugën drejt një vendimi të autorizuar të kuptueshme dhe të realizueshme. Kur shfaqet një kusht i papritur, punonjësit kanë nevojë për një mënyrë për ta sjellë provën e specializuar në vendim pa e rishkruar nga e para strukturën e autoritetit. Weick dhe Sutcliffe (2015) diskutojnë “deferencën ndaj ekspertizës” në organizimin me besueshmëri të lartë: një parim për mobilizimin e dijes përkatëse, jo për t'ia dorëzuar të drejtat e vendimit atij që flet me më shumë siguri. Asgjë në këto studime nuk e autorizon një menaxher operacionesh t'i kopjojë procedurat e komandës së emergjencës në mikpritje apo logjistikën e miljes së fundit; ligji lokal, trajnimi, siguria dhe politika e kontrollojnë projektimin e vërtetë. Pyetja e transferueshme është nëse hierarkia e miratuar e bën të mundur veprimin e informuar dhe të ligjshëm me ritmin që kërkon situata.",
              "Bigley und Roberts (2001) untersuchten das Incident Command System im Einsatz einer Feuerwehr. Ihre induktive Forschung prüfte, wie eine formelle Struktur flexibles und zuverlässiges Handeln in komplexen, unbeständigen Umfeldern stützen kann. Die Studie widerlegt eine bequeme Karikatur: Nicht jede Hierarchie ist bürokratische Verzögerung, und nicht jedes dezentrale Handeln ist anpassungsfähig. Die Gestaltungsaufgabe ist eine Balance aus Grenzen und Zugang. Die Organisation muss sagen, was nicht örtlich entschieden werden darf; sie muss den Weg zu einer befugten Entscheidung auch verständlich und gangbar machen. Taucht eine unerwartete Lage auf, brauchen Beschäftigte einen Weg, fachliche Belege in die Entscheidung einzubringen, ohne die Befugnisstruktur neu zu schreiben. Weick und Sutcliffe (2015) besprechen die „Hinwendung zur Expertise“ in hochzuverlässigen Organisationen: ein Prinzip zur Mobilisierung relevanten Wissens, nicht zur Übergabe von Entscheidungsrechten an die Person mit der größten Zuversicht. Nichts in diesen Studien erlaubt einer Betriebsleiterin, Einsatzführungsverfahren in Hotellerie oder Last-Mile-Logistik zu kopieren; örtliches Recht, Training, Sicherheit und Richtlinien bestimmen die echte Gestaltung. Die übertragbare Frage ist, ob die genehmigte Hierarchie informiertes, rechtmäßiges Handeln in dem Tempo ermöglicht, das die Lage verlangt.") },
            { type: "cards", cols: 3, items: [
              { h: x("Structure", "Struktura", "Struktur"), p: x("Know who may decide what.", "Dije kush mund të vendosë çfarë.", "Wissen, wer was entscheiden darf.") },
              { h: x("Expertise", "Ekspertiza", "Expertise"), p: x("Know whose evidence to consult.", "Dije provën e kujt të konsultosh.", "Wissen, wessen Belege zu befragen sind.") },
              { h: x("Escalation", "Eskalimi", "Eskalation"), p: x("Know how the two are connected.", "Dije si lidhen të dyja.", "Wissen, wie beides verbunden ist.") },
            ] },
            { type: "callout", reading: true, text: x(
              "Good authority design can reduce uncertainty without weakening necessary safeguards.",
              "Projektimi i mirë i autoritetit mund ta ulë pasigurinë pa i dobësuar mbrojtjet e nevojshme.",
              "Gute Befugnisgestaltung kann Unsicherheit senken, ohne nötige Sicherungen zu schwächen.") },
          ],
          note: x(
            "Bigley and Roberts (2001), Academy of Management Journal 44(6); Weick and Sutcliffe (2015), Managing the Unexpected, 3rd edition, chapter 7.",
            "Bigley e Roberts (2001), Academy of Management Journal 44(6); Weick e Sutcliffe (2015), Managing the Unexpected, botimi i 3-të, kapitulli 7.",
            "Bigley und Roberts (2001), Academy of Management Journal 44(6); Weick und Sutcliffe (2015), Managing the Unexpected, 3. Auflage, Kapitel 7."),
          source: ["bigley-roberts-2001", "weick-sutcliffe-2015"],
        },
        {
          id: "v-protocol", layer: "protocol",
          title: [x("Measure the wait", "Mat pritjen", "Das Warten messen,"), x("with honest denominators", "me emërues të ndershëm", "mit ehrlichen Nennern")],
          lead: x(
            "Timing data can locate a bottleneck, but it cannot establish fault or justified urgency by itself.",
            "Të dhënat e kohës mund ta gjejnë një pengesë, por nuk e vërtetojnë vetë as fajin, as urgjencën e justifikuar.",
            "Zeitdaten können einen Engpass orten, aber für sich weder Schuld noch berechtigte Dringlichkeit belegen."),
          blocks: [
            { type: "flag", text: synthetic },
            { type: "hbars", max: 36, hypothetical: true,
              label: x("One invented decision, 36 minutes in all", "Një vendim i shpikur, gjithsej 36 minuta", "Eine erfundene Entscheidung, insgesamt 36 Minuten"),
              items: [
                { k: x("Verify the condition", "Verifiko gjendjen", "Lage prüfen"), v: 11, n: "11 min" },
                { k: x("Decision wait", "Pritja e vendimit", "Entscheidungswartezeit"), v: 17, n: "17 min", alert: true },
                { k: x("Execute and check", "Ekzekuto dhe kontrollo", "Ausführen und prüfen"), v: 8, n: "8 min" },
              ] },
            { type: "p", text: x(
              "In this fully hypothetical case, 11 minutes confirm the condition, 17 pass from verified brief to authorised choice and 8 from decision to checked execution: 36 minutes in all, of which the decision wait is 17/36, about 47.2%. None of these numbers was collected from the author's employers, and 17 minutes is an illustration, not an acceptable benchmark. A local pilot records four timestamps only where a reliable and lawful source exists: first signal, verified brief, authorised decision and confirmed action. Missing times are marked “not measured”, never zero. Justified holds are logged apart from unowned waiting, and the class of problem is recorded so a routine exception is not compared with a safety-critical decision. The sample includes unresolved cases, not only decisions that reached completion; otherwise an organisation reports an attractive response time by excluding its longest waits.",
              "Në këtë rast krejt hipotetik, 11 minuta e konfirmojnë gjendjen, 17 kalojnë nga përmbledhja e verifikuar te zgjedhja e autorizuar dhe 8 nga vendimi te ekzekutimi i kontrolluar: gjithsej 36 minuta, nga të cilat pritja e vendimit është 17/36, rreth 47,2%. Asnjë nga këta numra nuk është mbledhur nga punëdhënësit e autorit, dhe 17 minuta janë ilustrim, jo pikë referimi e pranueshme. Një pilot lokal regjistron katër vula kohe vetëm ku ekziston një burim i besueshëm dhe i ligjshëm: sinjali i parë, përmbledhja e verifikuar, vendimi i autorizuar dhe veprimi i konfirmuar. Kohët që mungojnë shënohen “të pamatura”, kurrë zero. Ndalimet e justifikuara regjistrohen veçmas nga pritja pa përgjegjës, dhe klasa e problemit shënohet që një përjashtim rutinë të mos krahasohet me një vendim kritik për sigurinë. Mostra përfshin rastet e pazgjidhura, jo vetëm vendimet që arritën përfundimin; përndryshe një organizatë raporton një kohë tërheqëse përgjigjeje duke i përjashtuar pritjet e veta më të gjata.",
              "In diesem vollständig hypothetischen Fall bestätigen 11 Minuten die Lage, 17 vergehen von der geprüften Vorlage bis zur befugten Wahl und 8 von der Entscheidung bis zur geprüften Ausführung: 36 Minuten insgesamt, davon die Entscheidungswartezeit 17/36, etwa 47,2 %. Keine dieser Zahlen stammt von den Arbeitgebern des Autors, und 17 Minuten sind eine Illustration, kein annehmbarer Richtwert. Ein örtlicher Pilot erfasst vier Zeitstempel nur dort, wo eine verlässliche und rechtmäßige Quelle besteht: erstes Signal, geprüfte Vorlage, befugte Entscheidung und bestätigte Handlung. Fehlende Zeiten werden als „nicht gemessen“ markiert, nie als null. Berechtigte Halte werden getrennt vom Warten ohne Verantwortliche erfasst, und die Problemklasse wird notiert, damit eine Routineausnahme nicht mit einer sicherheitskritischen Entscheidung verglichen wird. Die Stichprobe umfasst ungelöste Fälle, nicht nur abgeschlossene Entscheidungen; sonst meldet eine Organisation eine attraktive Antwortzeit, indem sie ihre längsten Wartezeiten ausschließt.") },
            { type: "callout", reading: true, text: x(
              "Measure time to a useful decision together with time to a verified result.",
              "Mat kohën deri te një vendim i dobishëm bashkë me kohën deri te një rezultat i verifikuar.",
              "Messen Sie die Zeit bis zu einer nützlichen Entscheidung zusammen mit der Zeit bis zu einem geprüften Ergebnis.") },
          ],
          note: x(
            "All times and ratios are invented for a reproducible arithmetic example, as in the author's PDF; the indicator design is editorial and unvalidated. Review how often the owner was known and whether the outcome was verified.",
            "Të gjitha kohët dhe raportet janë të shpikura për një shembull aritmetik të riprodhueshëm, si te PDF-ja e autorit; projektimi i treguesit është editorial dhe i pavërtetuar. Rishiko sa shpesh dihej përgjegjësi dhe nëse rezultati u verifikua.",
            "Alle Zeiten und Verhältnisse sind für ein nachvollziehbares Rechenbeispiel erfunden, wie im PDF des Autors; die Indikatorgestaltung ist redaktionell und nicht validiert. Prüfen Sie, wie oft die Verantwortliche bekannt war und ob das Ergebnis geprüft wurde."),
          source: ["eisenhardt-1989"],
        },
      ],
    },

    // Chapter VI. Designing the decision system
    {
      id: "ch-vi", type: "chapter", numeral: "VI",
      title: x("Designing the decision system", "Projektimi i sistemit të vendimit", "Das Entscheidungssystem gestalten"),
      pages: [
        {
          id: "vi-scene", layer: "scene", more: "the-industry-changes-management-problems-do-not",
          title: [x("The next turn", "Turni tjetër", "Die nächste Schicht"), x("without the expert", "pa ekspertin", "ohne den Experten")],
          lead: x(
            "A decision routine is most valuable when it still works after the person who invented it has left the shift.",
            "Një rutinë vendimi është më e vlefshme kur funksionon ende pasi personi që e shpiku ka lënë turnin.",
            "Eine Entscheidungsroutine ist am wertvollsten, wenn sie noch funktioniert, nachdem die Person, die sie erfand, die Schicht verlassen hat."),
          blocks: [
            { type: "flag", text: x("Constructed cross-shift scene, no claimed personal result", "Skenë e ndërtuar ndërmjet turneve, pa rezultat personal të pretenduar", "Konstruierte Szene über Schichten hinweg, kein behauptetes persönliches Ergebnis") },
            { type: "p", text: x(
              "A recurring operational exception appears near a shift change. The experienced colleague can usually tell the team whom to contact and which fact to check first. Today that colleague is leaving. The next shift receives a short note: the condition is verified, a decision is still pending and the receiving role has been named. The work is not magically solved, but it has not been reset to the beginning. Contrast that with a second version. The outgoing colleague writes “still investigating”. No one records what was verified, which decision remains or who has accepted the case. The next team spends time discovering the same facts. The failure is not simply poor memory; it is a lack of continuity in the decision process. Tucker and Edmondson (2003) studied nurses' responses to failures in nine hospitals and examined why local fixes do not always become system learning: a comparison, not proof about this shift. An effective handover need not record every conversation. It must preserve what enables the next authorised choice.",
              "Një përjashtim operacional i përsëritur shfaqet afër ndërrimit të turnit. Kolegu me përvojë zakonisht mund t'i thotë ekipit kë të kontaktojë dhe cilin fakt të kontrollojë së pari. Sot ai koleg po largohet. Turni tjetër merr një shënim të shkurtër: gjendja është verifikuar, një vendim është ende në pritje dhe roli që e merr është emërtuar. Puna nuk zgjidhet si me magji, por nuk është rikthyer në fillim. Krahasoje me një version të dytë. Kolegu që largohet shkruan “ende në hetim”. Askush nuk shënon çfarë u verifikua, cili vendim mbetet apo kush e ka pranuar rastin. Ekipi tjetër shpenzon kohë duke zbuluar të njëjtat fakte. Dështimi nuk është thjesht kujtesë e dobët; është mungesë vazhdimësie në procesin e vendimit. Tucker dhe Edmondson (2003) studiuan reagimet e infermierëve ndaj dështimeve në nëntë spitale dhe shqyrtuan pse ndreqjet lokale nuk bëhen gjithmonë mësim sistemi: krahasim, jo provë për këtë turn. Një dorëzim efektiv nuk ka pse ta regjistrojë çdo bisedë. Duhet ta ruajë atë që e mundëson zgjedhjen e radhës të autorizuar.",
              "Eine wiederkehrende betriebliche Ausnahme taucht nahe dem Schichtwechsel auf. Die erfahrene Kollegin kann dem Team meist sagen, wen man anruft und welchen Fakt man zuerst prüft. Heute geht sie. Die nächste Schicht erhält eine kurze Notiz: Die Lage ist geprüft, eine Entscheidung steht noch aus, die empfangende Rolle ist benannt. Die Arbeit ist nicht wie von Zauberhand gelöst, aber sie wurde nicht auf den Anfang zurückgesetzt. Man vergleiche das mit einer zweiten Version. Die gehende Kollegin schreibt „noch in Klärung“. Niemand hält fest, was geprüft wurde, welche Entscheidung offen ist oder wer den Fall übernommen hat. Das nächste Team braucht Zeit, dieselben Fakten zu finden. Das Versagen ist nicht bloß schlechtes Gedächtnis; es ist fehlende Kontinuität im Entscheidungsprozess. Tucker und Edmondson (2003) untersuchten die Reaktionen von Pflegekräften auf Fehler in neun Krankenhäusern und fragten, warum örtliche Behelfe nicht immer zu Systemlernen werden: ein Vergleich, kein Beweis für diese Schicht. Eine wirksame Übergabe muss nicht jedes Gespräch festhalten. Sie muss bewahren, was die nächste befugte Wahl ermöglicht.") },
            { type: "p", text: x(
              "Neither version describes a documented incident from the author's hotel or logistics work. That is the significance of Volume 10 within this series: observation identifies conditions, a map locates the stalled flow, metrics signal exceptions, training equips people, speaking up supplies evidence, recovery protects the customer. Unless the chain carries a legitimate decision into a checked action, the system can remain busy without making progress.",
              "Asnjëri version nuk përshkruan një ngjarje të dokumentuar nga puna e autorit në hotel apo logjistikë. Kjo është rëndësia e Vëllimit 10 brenda kësaj serie: vëzhgimi identifikon kushte, një hartë e gjen rrjedhën e bllokuar, matjet sinjalizojnë përjashtime, trajnimi i pajis njerëzit, të folurit jep prova, rikuperimi e mbron klientin. Nëse zinxhiri nuk e çon një vendim legjitim në një veprim të kontrolluar, sistemi mund të mbetet i zënë pa bërë përparim.",
              "Keine der Versionen beschreibt einen dokumentierten Vorfall aus der Hotel- oder Logistikarbeit des Autors. Darin liegt die Bedeutung von Band 10 in dieser Reihe: Beobachtung erkennt Bedingungen, eine Karte ortet den stockenden Fluss, Kennzahlen signalisieren Ausnahmen, Training rüstet Menschen aus, Ansprechen liefert Belege, Wiedergutmachung schützt den Kunden. Trägt die Kette keine legitime Entscheidung in eine geprüfte Handlung, kann das System beschäftigt bleiben, ohne voranzukommen.") },
            { type: "callout", reading: true, text: x(
              "A good decision system survives the shift boundary without erasing what has already been learned.",
              "Një sistem i mirë vendimi i mbijeton kufirit të turnit pa e fshirë atë që është mësuar tashmë.",
              "Ein gutes Entscheidungssystem überlebt die Schichtgrenze, ohne das bereits Gelernte zu löschen.") },
          ],
          note: x(
            "Constructed comparison; editorial synthesis informed by Tucker and Edmondson (2003) and Okhuysen and Bechky (2009). The essay named below says the industry changes and the management problems do not.",
            "Krahasim i ndërtuar; sintezë editoriale e mbështetur te Tucker e Edmondson (2003) dhe Okhuysen e Bechky (2009). Eseja e emërtuar më poshtë thotë se industria ndryshon, problemet e menaxhimit jo.",
            "Konstruierter Vergleich; redaktionelle Synthese nach Tucker und Edmondson (2003) und Okhuysen und Bechky (2009). Der unten genannte Essay sagt, die Branche wechsle, die Führungsprobleme nicht."),
          source: ["tucker-edmondson-2003", "okhuysen-bechky-2009"],
        },
        {
          id: "vi-concept", layer: "concept",
          title: [x("Act, interpret,", "Vepro, interpreto,", "Handeln, deuten,"), x("revise the diagnosis", "rishiko diagnozën", "die Diagnose überarbeiten")],
          lead: x(
            "Decision making does not end when a choice is recorded; the outcome can change what the team knows.",
            "Vendimmarrja nuk mbaron kur regjistrohet një zgjedhje; rezultati mund ta ndryshojë atë që di ekipi.",
            "Entscheiden endet nicht, wenn eine Wahl festgehalten ist; das Ergebnis kann ändern, was das Team weiß."),
          blocks: [
            { type: "p", text: x(
              "Rudolph, Morrison and Carroll (2009) developed a theory of action-oriented problem solving using an iterative, simulation-based modelling approach. Their model links acting, interpreting and cultivating diagnoses, showing how feedback affects opportunities for adaptive problem solving. This is a conceptual and modelling contribution, not a controlled trial of a particular decision card. A practical decision system therefore requires two commitments: to make a permitted choice when the conditions for it are met, and to watch what follows and be willing to revise the interpretation. A decision accepted by a manager may be well documented and still fail to change the original constraint; that failure is information, not evidence that the record should be closed. The improvement question is not merely whether the escalation was answered, but whether the action addressed the right mechanism and whether any unexpected downstream cost appeared. Repeated safe failures can identify a defect in a decision rule, a missing source of expertise or an unrealistic standard. There is no single perfect decision time: the appropriate period depends on risk, irreversibility, authority and the opportunity to verify, and an urgent hazard and a routine supplier clarification should not share one arbitrary countdown.",
              "Rudolph, Morrison dhe Carroll (2009) zhvilluan një teori të zgjidhjes së problemeve të orientuar nga veprimi, me një qasje modelimi iterative të bazuar në simulim. Modeli i tyre e lidh veprimin, interpretimin dhe kultivimin e diagnozave, duke treguar si ndikon reagimi te mundësitë për zgjidhje adaptive problemesh. Ky është kontribut konceptual dhe modelimi, jo provë e kontrolluar e një karte vendimi të caktuar. Një sistem praktik vendimi kërkon pra dy angazhime: të bëjë një zgjedhje të lejuar kur kushtet për të plotësohen, dhe të vëzhgojë çfarë pason dhe të jetë i gatshëm ta rishikojë interpretimin. Një vendim i pranuar nga një menaxher mund të jetë i dokumentuar mirë dhe prapë të mos e ndryshojë kufizimin fillestar; ai dështim është informacion, jo provë se regjistri duhet mbyllur. Pyetja e përmirësimit nuk është thjesht nëse eskalimi mori përgjigje, por nëse veprimi e trajtoi mekanizmin e duhur dhe nëse u shfaq ndonjë kosto e papritur më poshtë në zinxhir. Dështimet e sigurta të përsëritura mund të identifikojnë një defekt në një rregull vendimi, një burim ekspertize që mungon ose një standard joreal. Nuk ka një kohë të vetme të përsosur vendimi: periudha e duhur varet nga rreziku, pakthyeshmëria, autoriteti dhe mundësia për të verifikuar, dhe një rrezik urgjent dhe një sqarim rutinë furnitori nuk duhet të ndajnë një numërim mbrapsht arbitrar.",
              "Rudolph, Morrison und Carroll (2009) entwickelten eine Theorie handlungsorientierten Problemlösens mit einem iterativen, simulationsgestützten Modellansatz. Ihr Modell verbindet Handeln, Deuten und das Pflegen von Diagnosen und zeigt, wie Rückmeldung die Chancen adaptiven Problemlösens beeinflusst. Das ist ein konzeptioneller Modellbeitrag, kein kontrollierter Test einer bestimmten Entscheidungskarte. Ein praktisches Entscheidungssystem verlangt daher zwei Verpflichtungen: eine zulässige Wahl zu treffen, wenn ihre Bedingungen erfüllt sind, und zu beobachten, was folgt, und bereit zu sein, die Deutung zu überarbeiten. Eine von einer Führungskraft angenommene Entscheidung kann gut dokumentiert sein und die ursprüngliche Einschränkung trotzdem nicht ändern; dieses Scheitern ist Information, kein Beleg, dass die Aufzeichnung geschlossen gehört. Die Verbesserungsfrage ist nicht nur, ob die Eskalation beantwortet wurde, sondern ob die Handlung den richtigen Mechanismus traf und ob unerwartete nachgelagerte Kosten auftraten. Wiederholte sichere Fehlschläge können einen Mangel in einer Entscheidungsregel, eine fehlende Expertisequelle oder einen unrealistischen Standard aufdecken. Es gibt keine einzige perfekte Entscheidungszeit: Die angemessene Dauer hängt von Risiko, Unumkehrbarkeit, Befugnis und Prüfmöglichkeit ab, und eine akute Gefahr und eine Lieferantenrückfrage sollten nicht denselben willkürlichen Countdown teilen.") },
            { type: "chain", items: [
              { h: x("Observe", "Vëzhgo", "Beobachten"), p: x("The condition.", "Gjendjen.", "Die Lage.") },
              { h: x("Choose", "Zgjidh", "Wählen"), p: x("An authorised action.", "Një veprim të autorizuar.", "Eine befugte Handlung.") },
              { h: x("Check", "Kontrollo", "Prüfen"), p: x("The actual effect.", "Efektin e vërtetë.", "Die tatsächliche Wirkung.") },
              { h: x("Learn", "Mëso", "Lernen"), p: x("Revise the rule if needed.", "Rishiko rregullin nëse duhet.", "Die Regel bei Bedarf überarbeiten.") },
            ] },
            { type: "callout", reading: true, text: x(
              "The decision is a hypothesis about what action will help. The outcome supplies its test.",
              "Vendimi është hipotezë se cili veprim do të ndihmojë. Rezultati e jep provën e tij.",
              "Die Entscheidung ist eine Hypothese darüber, welche Handlung hilft. Das Ergebnis liefert ihren Test.") },
          ],
          note: x(
            "Rudolph, Morrison and Carroll (2009), Academy of Management Review 34(4), 733–756. The operating ribbon is editorial.",
            "Rudolph, Morrison e Carroll (2009), Academy of Management Review 34(4), 733–756. Shiriti operativ është editorial.",
            "Rudolph, Morrison und Carroll (2009), Academy of Management Review 34(4), 733–756. Das Betriebsband ist redaktionell."),
          source: ["rudolph-morrison-carroll-2009"],
        },
        {
          id: "vi-protocol", layer: "protocol",
          title: [x("The six-step", "Disiplina e vendimit", "Die Entscheidungsdisziplin"), x("decision discipline", "me gjashtë hapa", "in sechs Schritten")],
          lead: x(
            "A compact protocol for ordinary operating decisions, bounded by the real authority and safety rules of the workplace.",
            "Një protokoll kompakt për vendimet e zakonshme operative, i kufizuar nga autoriteti i vërtetë dhe rregullat e sigurisë së vendit të punës.",
            "Ein kompaktes Protokoll für gewöhnliche Betriebsentscheidungen, begrenzt durch die echte Befugnis und die Sicherheitsregeln des Arbeitsplatzes."),
          blocks: [
            { type: "steps", items: [
              { h: x("Identify", "Identifiko", "Identifizieren"), p: x("The verified problem and why a choice is needed now; fact apart from hypothesis.", "Problemi i verifikuar dhe pse duhet një zgjedhje tani; fakti veçmas nga hipoteza.", "Das geprüfte Problem und warum jetzt eine Wahl nötig ist; Fakt getrennt von Hypothese.") },
              { h: x("Assess", "Vlerëso", "Abwägen"), p: x("The risk of acting, the risk of waiting, what is reversible and what evidence is essential.", "Rreziku i veprimit, rreziku i pritjes, çfarë është e kthyeshme dhe cila provë është thelbësore.", "Risiko des Handelns, Risiko des Wartens, was umkehrbar ist, welcher Beleg nötig ist.") },
              { h: x("Authorise", "Autorizo", "Autorisieren"), p: x("The role legally and operationally permitted to decide, through existing escalation.", "Roli i lejuar ligjërisht dhe operacionalisht të vendosë, përmes eskalimit ekzistues.", "Die rechtlich und betrieblich befugte Rolle, über die bestehende Eskalation.") },
              { h: x("Decide", "Vendos", "Entscheiden"), p: x("The selected permissible action, owner, reason and review condition, recorded.", "Veprimi i lejuar i zgjedhur, përgjegjësi, arsyeja dhe kushti i rishikimit, të regjistruara.", "Die gewählte zulässige Handlung, Verantwortliche, Grund und Prüfbedingung, festgehalten.") },
              { h: x("Verify", "Verifiko", "Prüfen"), p: x("Whether implementation happened and the intended result was achieved.", "Nëse zbatimi ndodhi dhe rezultati i synuar u arrit.", "Ob die Umsetzung erfolgte und das beabsichtigte Ergebnis erreicht wurde.") },
              { h: x("Learn", "Mëso", "Lernen"), p: x("The finding returned to the team; the standard changed only through the approved process.", "Gjetja e kthyer te ekipi; standardi i përditësuar vetëm përmes procesit të miratuar të ndryshimit.", "Befund zurück ans Team; Standard nur über den genehmigten Änderungsprozess angepasst.") },
            ] },
            { type: "p", text: x(
              "This discipline is no licence to override financial controls, security or safety rules or confidential hotel procedures. When a hazard is immediate, the authorised emergency pathway applies; when uncertainty makes action unsafe, “hold and escalate” may be the right outcome. To test the protocol, take one permitted class of recurring problem and document a few anonymised cases, tracking time and quality together: was the owner clear, was the decision authorised, did the action help, was the outcome communicated? The framework has not been validated in the author's workplaces.",
              "Kjo disiplinë nuk është leje për të anashkaluar kontrollet financiare, rregullat e sigurisë apo procedurat konfidenciale të hotelit. Kur rreziku është i menjëhershëm, zbatohet rruga e autorizuar e emergjencës; kur pasiguria e bën veprimin të pasigurt, “ndalo dhe eskalo” mund të jetë rezultati i saktë. Për ta provuar protokollin, merr një klasë të lejuar problemesh të përsëritura dhe dokumento disa raste anonime, duke ndjekur kohën dhe cilësinë bashkë: a ishte i qartë përgjegjësi, a u autorizua vendimi, a ndihmoi veprimi, a u komunikua rezultati? Kuadri nuk është vërtetuar në vendet e punës së autorit.",
              "Diese Disziplin ist keine Lizenz, Finanzkontrollen, Sicherheitsregeln oder vertrauliche Hotelverfahren zu übergehen. Bei unmittelbarer Gefahr gilt der befugte Notfallweg; macht Unsicherheit das Handeln unsicher, kann „halten und eskalieren“ richtig sein. Zum Test eine zulässige Klasse wiederkehrender Probleme nehmen und einige anonymisierte Fälle dokumentieren, Zeit und Qualität zusammen: War die Verantwortliche klar, war die Entscheidung befugt, half die Handlung, wurde das Ergebnis mitgeteilt? Der Rahmen wurde an den Arbeitsplätzen des Autors nicht validiert.") },
            { type: "callout", reading: true, text: x(
              "A decision is only finished when someone can account for what happened next.",
              "Një vendim mbaron vetëm kur dikush mund të japë llogari për çfarë ndodhi më pas.",
              "Eine Entscheidung ist erst fertig, wenn jemand sagen kann, was danach geschah.") },
          ],
          note: x(
            "Six-stage editorial synthesis after Simon (1955) and Rudolph et al. (2009); not a validated procedure.",
            "Sintezë editoriale me gjashtë faza sipas Simon (1955) dhe Rudolph et al. (2009); jo procedurë e vërtetuar.",
            "Sechsstufige redaktionelle Synthese nach Simon (1955) und Rudolph et al. (2009); kein validiertes Verfahren."),
          source: ["simon-1955", "rudolph-morrison-carroll-2009"],
        },
      ],
    },

    {
      id: "tool", tool: "/tools/delay-analyzer/",
      kicker: x("Field tool", "Mjeti i terrenit", "Werkzeug vor Ort"),
      title: [x("The Decision", "Karta e të drejtave", "Die Karte der"), x("Rights Card", "të vendimit", "Entscheidungsrechte")],
      lead: x(
        "One issue. One authorised decision. One checked outcome. Use only with non-sensitive sample data or inside approved systems; if the decision is pending, write “pending”, assign the approved owner and keep the next review commitment.",
        "Një çështje. Një vendim i autorizuar. Një rezultat i kontrolluar. Përdore vetëm me të dhëna shembull jo të ndjeshme ose brenda sistemeve të miratuara; nëse vendimi është në pritje, shkruaj “në pritje”, cakto përgjegjësin e miratuar dhe ruaje angazhimin e rishikimit të radhës.",
        "Ein Thema. Eine befugte Entscheidung. Ein geprüftes Ergebnis. Nur mit unsensiblen Beispieldaten oder in genehmigten Systemen verwenden; steht die Entscheidung aus, „offen“ schreiben, die genehmigte Verantwortliche zuweisen und die nächste Prüfzusage festhalten."),
      blocks: [
        { type: "form", items: [
          { h: x("The problem and its evidence", "Problemi dhe prova e tij", "Das Problem und sein Beleg"), hint: x("what was directly verified? what is only reported or assumed?", "çfarë u verifikua drejtpërdrejt? çfarë është vetëm e raportuar ose e supozuar?", "was wurde direkt geprüft? was ist nur berichtet oder angenommen?") },
          { h: x("Risk and consequence of waiting", "Rreziku dhe pasoja e pritjes", "Risiko und Folge des Wartens"), hint: x("what deteriorates while no decision is made? what requires immediate escalation?", "çfarë keqësohet ndërsa nuk merret vendim? çfarë kërkon eskalim të menjëhershëm?", "was verschlechtert sich, solange nicht entschieden wird? was verlangt sofortige Eskalation?") },
          { h: x("Decision question and permitted alternatives", "Pyetja e vendimit dhe alternativat e lejuara", "Entscheidungsfrage und zulässige Alternativen"), hint: x("which action is needed, and which options are actually authorised?", "cili veprim duhet, dhe cilat mundësi janë vërtet të autorizuara?", "welche Handlung ist nötig, und welche Optionen sind tatsächlich befugt?") },
          { h: x("Decision owner and checkpoint", "Pronari i vendimit dhe pika e kontrollit", "Entscheidungsverantwortliche und Prüfpunkt"), hint: x("which role accepts the choice? by when is the next update required?", "cili rol e pranon zgjedhjen? deri kur kërkohet përditësimi i radhës?", "welche Rolle übernimmt die Wahl? bis wann ist die nächste Rückmeldung fällig?") },
          { h: x("Action, status and outcome", "Veprimi, statusi dhe rezultati", "Handlung, Status und Ergebnis"), hint: x("what was decided, done and observed? what is still open?", "çfarë u vendos, u bë dhe u vëzhgua? çfarë mbetet ende e hapur?", "was wurde entschieden, getan und beobachtet? was ist noch offen?") },
          { h: x("Learning returned to the team", "Mësimi i kthyer te ekipi", "Lernen zurück ans Team"), hint: x("what did this case teach about the rule, training or information flow?", "çfarë mësoi ky rast për rregullin, trajnimin ose rrjedhën e informacionit?", "was lehrte dieser Fall über Regel, Training oder Informationsfluss?") },
        ] },
      ],
      note: x(
        "A proposed management aid, not a legal delegation document or a substitute for an incident system. Do not publish employee, guest, payment, route-security or confidential operational details. Escalated is a transfer; decided is a choice; resolved is a verified outcome.",
        "Mjet menaxhimi i propozuar, jo dokument ligjor delegimi dhe as zëvendësim i një sistemi incidentesh. Mos publiko detaje punonjësish, mysafirësh, pagesash, sigurie rrugësh apo detaje operacionale konfidenciale. E eskaluar është kalim; e vendosur është zgjedhje; e zgjidhur është rezultat i verifikuar.",
        "Eine vorgeschlagene Führungshilfe, kein rechtliches Delegationsdokument und kein Ersatz für ein Vorfallsystem. Keine Details zu Beschäftigten, Gästen, Zahlungen, Routensicherheit oder vertraulichen Abläufen veröffentlichen. Eskaliert ist ein Weiterreichen; entschieden ist eine Wahl; gelöst ist ein geprüftes Ergebnis."),
      source: ["okhuysen-bechky-2009", "simon-1955"],
    },
    {
      id: "closing",
      kicker: x("Closing essay", "Eseja e mbylljes", "Schlussessay"),
      title: [x("Ten volumes,", "Dhjetë vëllime,", "Zehn Bände,"), x("one operating question", "një pyetje operacionale", "eine Betriebsfrage")],
      lead: x(
        "Can an organisation turn what it knows into a responsible result that survives the next shift?",
        "A mund ta kthejë një organizatë atë që di në një rezultat të përgjegjshëm që i mbijeton turnit tjetër?",
        "Kann eine Organisation das, was sie weiß, in ein verantwortliches Ergebnis verwandeln, das die nächste Schicht überlebt?"),
      blocks: [
        { type: "p", text: x(
          "The first nine volumes asked different questions of the same world of operations. Go to the work. Follow the flow. Challenge the machine's apparent certainty. Make standards survive. Understand capacity. Resist misleading targets. Hear the people. Verify training. Recover the promise to the customer. The tenth volume asks what happens when those disciplines have succeeded. A problem is visible, the process mapped, the metric understood, the staff member heard. The customer still needs an answer. Who can act, and who will check whether that action helped? Speed is not automatically a virtue. A deliberate pause may protect people or a process, while an unowned delay hides a lack of accountability. The remedy is neither heroic improvisation nor another form for every exception. It is clarity about facts, risk, expertise, authority and outcome. A manager's legacy is not the number of decisions personally signed. It is whether successors can recognise a problem, reach the right expertise, act within their rights and learn from the result. That is how responsible judgement outlives the shift.",
          "Nëntë vëllimet e para i bënë pyetje të ndryshme të njëjtës botë të operacioneve. Shko te puna. Ndiq rrjedhën. Sfido sigurinë në dukje të makinës. Bëji standardet të mbijetojnë. Kupto kapacitetin. Rezisto objektivave mashtruese. Dëgjoji njerëzit. Verifiko trajnimin. Rikupero premtimin ndaj klientit. Vëllimi i dhjetë pyet çfarë ndodh kur ato disiplina kanë pasur sukses. Një problem është i dukshëm, procesi i hartuar, matja e kuptuar, anëtari i stafit i dëgjuar. Klienti ka ende nevojë për një përgjigje. Kush mund të veprojë, dhe kush do të kontrollojë nëse ai veprim ndihmoi? Shpejtësia nuk është automatikisht virtyt. Një ndalim i qëllimshëm mund të mbrojë njerëz ose një proces, ndërsa një vonesë pa përgjegjës e fsheh mungesën e përgjegjshmërisë. Ilaçi nuk është as improvizimi heroik, as një formular tjetër për çdo përjashtim. Është qartësia për faktet, rrezikun, ekspertizën, autoritetin dhe rezultatin. Trashëgimia e një menaxheri nuk është numri i vendimeve të nënshkruara personalisht. Është nëse pasardhësit mund ta njohin një problem, të arrijnë ekspertizën e duhur, të veprojnë brenda të drejtave të tyre dhe të mësojnë nga rezultati. Kështu gjykimi i përgjegjshëm e jeton më gjatë se turni.",
          "Die ersten neun Bände stellten derselben Welt des Betriebs verschiedene Fragen. Geh zur Arbeit. Folge dem Fluss. Hinterfrage die scheinbare Gewissheit der Maschine. Lass Standards überleben. Verstehe Kapazität. Widerstehe irreführenden Zielen. Höre die Menschen. Prüfe das Training. Stelle das Versprechen an den Kunden wieder her. Der zehnte Band fragt, was geschieht, wenn diese Disziplinen gelungen sind. Ein Problem ist sichtbar, der Prozess kartiert, die Kennzahl verstanden, die Mitarbeiterin gehört. Der Kunde braucht noch eine Antwort. Wer kann handeln, und wer prüft, ob die Handlung half? Tempo ist nicht automatisch eine Tugend. Eine bewusste Pause kann Menschen oder einen Prozess schützen, während eine Verzögerung ohne Verantwortliche fehlende Rechenschaft verbirgt. Die Abhilfe ist weder heroische Improvisation noch ein weiteres Formular für jede Ausnahme. Sie ist Klarheit über Fakten, Risiko, Expertise, Befugnis und Ergebnis. Das Vermächtnis einer Führungskraft ist nicht die Zahl der persönlich unterschriebenen Entscheidungen. Es ist, ob Nachfolger ein Problem erkennen, die richtige Expertise erreichen, in ihren Rechten handeln und aus dem Ergebnis lernen können. So überlebt verantwortliches Urteil die Schicht.") },
        { type: "lists", cols: [
          { h: x("Volumes 1 to 5", "Vëllimet 1 deri 5", "Bände 1 bis 5"), items: [
            x("Gemba: see the real work.", "Gemba: shih punën e vërtetë.", "Gemba: die echte Arbeit sehen."),
            x("Value stream mapping: trace the whole flow.", "Harta e rrjedhës së vlerës: ndiq gjithë rrjedhën.", "Wertstromanalyse: den ganzen Fluss verfolgen."),
            x("The human override: question automated certainty.", "Ndërhyrja njerëzore: vër në pikëpyetje sigurinë e automatizuar.", "Der menschliche Eingriff: automatisierte Gewissheit hinterfragen."),
            x("When improvement fades: protect the standard.", "Kur përmirësimi zbehet: mbro standardin.", "Wenn Verbesserung verblasst: den Standard schützen."),
            x("The capacity trap: understand pressure and queues.", "Kurthi i kapacitetit: kupto presionin dhe radhët.", "Die Kapazitätsfalle: Druck und Warteschlangen verstehen."),
          ] },
          { h: x("Volumes 6 to 10", "Vëllimet 6 deri 10", "Bände 6 bis 10"), accent: true, items: [
            x("The KPI trap: measure the real outcome.", "Kurthi i KPI-ve: mat rezultatin e vërtetë.", "Die KPI-Falle: das echte Ergebnis messen."),
            x("The cost of silence: hear what staff know.", "Kostoja e heshtjes: dëgjo çfarë di stafi.", "Der Preis des Schweigens: hören, was das Personal weiß."),
            x("The training illusion: prove readiness to act.", "Iluzioni i trajnimit: provo gatishmërinë për të vepruar.", "Die Trainingsillusion: Bereitschaft zum Handeln nachweisen."),
            x("The recovery gap: close the customer consequence.", "Hendeku i rikuperimit: mbylle pasojën për klientin.", "Die Wiedergutmachungslücke: die Folge für den Kunden schließen."),
            x("The decision clock: turn evidence into owned action.", "Ora e vendimit: ktheje provën në veprim me përgjegjës.", "Die Entscheidungsuhr: Belege in verantwortetes Handeln verwandeln."),
          ] },
        ] },
        { type: "callout", reading: true, text: x(
          "A problem does not become smaller while everyone waits for someone else to decide.",
          "Një problem nuk bëhet më i vogël ndërsa të gjithë presin që dikush tjetër të vendosë.",
          "Ein Problem wird nicht kleiner, während alle darauf warten, dass jemand anderes entscheidet.") },
      ],
      note: x(
        "Editorial conclusion to the first cycle of ten volumes. No decision bottleneck, delayed case or stalled escalation is attributed to any named employer.",
        "Përfundim editorial i ciklit të parë prej dhjetë vëllimesh. Asnjë bllokim vendimi, rast i vonuar apo eskalim i ngecur nuk i atribuohet ndonjë punëdhënësi të caktuar.",
        "Redaktionelles Fazit zum ersten Zyklus von zehn Bänden. Kein Entscheidungsengpass, kein verzögerter Fall und keine stockende Eskalation wird einem bestimmten Arbeitgeber zugeschrieben."),
    },
    {
      id: "method",
      kicker: x("Method", "Metoda", "Methode"),
      title: [x("Where the claims", "Nga vijnë", "Woher die Behauptungen"), x("come from", "pohimet", "stammen")],
      lead: x(
        "An evidence-informed editorial synthesis, not original field research: eleven reference works, conceptual theory, qualitative studies, an inductive firm study and research on expert judgement, each with its limits. Scenes, the time example and the field tool are editorial, not local measurements.",
        "Një sintezë editoriale e mbështetur në prova, jo kërkim origjinal në terren: njëmbëdhjetë vepra referimi, teori konceptuale, studime cilësore, një studim induktiv firmash dhe kërkim mbi gjykimin e ekspertëve, secili me kufijtë e vet. Skenat, shembulli i kohës dhe mjeti i terrenit janë editoriale, jo matje lokale.",
        "Eine belegbasierte redaktionelle Synthese, keine eigene Feldforschung: elf Referenzwerke, konzeptionelle Theorie, qualitative Studien, eine induktive Firmenstudie und Forschung zum Expertenurteil, jedes mit seinen Grenzen. Szenen, das Zeitbeispiel und das Werkzeug sind redaktionell, keine örtlichen Messungen."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("Theory", "Teoria", "Theorie"), p: x("Simon (1955), Okhuysen and Bechky (2009), Rudolph et al. (2009) and Weick and Sutcliffe (2015) describe mechanisms and conditions, not measured rates.", "Simon (1955), Okhuysen e Bechky (2009), Rudolph et al. (2009) dhe Weick e Sutcliffe (2015) përshkruajnë mekanizma dhe kushte, jo norma të matura.", "Simon (1955), Okhuysen und Bechky (2009), Rudolph et al. (2009) und Weick und Sutcliffe (2015) beschreiben Mechanismen und Bedingungen, keine gemessenen Quoten.") },
          { h: x("Field studies", "Studimet në terren", "Feldstudien"), p: x("25 decision processes (Mintzberg et al. 1976); fire-ground commanders, fewer than 12% of decision points with option comparison (Klein et al. 1986); 8 firms (Eisenhardt 1989); an incident command system (Bigley and Roberts 2001); 9 hospitals (Tucker and Edmondson 2003); a trauma centre (Faraj and Xiao 2006).", "25 procese vendimi (Mintzberg et al. 1976); komandantë zjarrfikësish, më pak se 12% e pikave të vendimit me krahasim mundësish (Klein et al. 1986); 8 firma (Eisenhardt 1989); një sistem komande incidentesh (Bigley e Roberts 2001); 9 spitale (Tucker e Edmondson 2003); një qendër traume (Faraj e Xiao 2006).", "25 Entscheidungsprozesse (Mintzberg et al. 1976); Feuerwehrkommandanten, unter 12 % der Entscheidungspunkte mit Optionsvergleich (Klein et al. 1986); 8 Firmen (Eisenhardt 1989); ein Einsatzführungssystem (Bigley und Roberts 2001); 9 Krankenhäuser (Tucker und Edmondson 2003); ein Traumazentrum (Faraj und Xiao 2006).") },
          { h: x("Expert judgement", "Gjykimi i ekspertit", "Expertenurteil"), p: x("Kahneman and Klein (2009): intuition deserves trust where the environment is regular and feedback was adequate; a condition, not a licence.", "Kahneman e Klein (2009): intuita meriton besim aty ku mjedisi është i rregullt dhe reagimi ishte i mjaftueshëm; kusht, jo leje.", "Kahneman und Klein (2009): Intuition verdient Vertrauen, wo das Umfeld regelmäßig und die Rückmeldung ausreichend war; eine Bedingung, keine Lizenz.") },
          { h: x("Invented counts", "Numrat e shpikur", "Erfundene Zahlen"), p: x("Twelve open items by state (3, 2, 4, 1, 2) and the 36-minute decision (11, 17, 8; 17/36 ≈ 47.2%) are illustrations flagged on their pages; no proportion is a benchmark.", "Dymbëdhjetë pika të hapura sipas gjendjes (3, 2, 4, 1, 2) dhe vendimi 36-minutësh (11, 17, 8; 17/36 ≈ 47,2%) janë ilustrime me flamur në faqet e tyre; asnjë përpjesëtim nuk është pikë referimi.", "Zwölf offene Punkte nach Zustand (3, 2, 4, 1, 2) und die 36-Minuten-Entscheidung (11, 17, 8; 17/36 ≈ 47,2 %) sind auf ihren Seiten gekennzeichnete Illustrationen; kein Verhältnis ist ein Richtwert.") },
        ] },
        { type: "p", text: x(
          "The Decision Rights Card, the minimum sufficient brief, the authority map and the six-step discipline are editorial proposals for local testing, not validated decision aids or employer-approved delegation. Publisher records were checked for every source; paywalled papers were not represented as read in full. Editorial standard: a theory, a field study, an expert-judgement finding and a proposal are named as such, and the sentence stops claiming where the evidence stops.",
          "Karta e të drejtave të vendimit, përmbledhja minimale e mjaftueshme, harta e autoritetit dhe disiplina me gjashtë hapa janë propozime editoriale për provë lokale, jo mjete vendimi të vërtetuara apo delegim i miratuar nga punëdhënësi. Regjistrat e botuesve u kontrolluan për çdo burim; punimet pas murit të pagesës nuk u paraqitën si të lexuara në tërësi. Standardi editorial: një teori, një studim në terren, një gjetje mbi gjykimin e ekspertit dhe një propozim quhen me emrin e tyre, dhe fjalia pushon së pohuari aty ku mbaron prova.",
          "Die Entscheidungskarte, die minimal ausreichende Vorlage, die Befugniskarte und die sechsstufige Disziplin sind redaktionelle Vorschläge für die örtliche Prüfung, keine validierten Entscheidungshilfen und keine vom Arbeitgeber genehmigte Delegation. Die Verlagsdaten wurden für jede Quelle geprüft; Aufsätze hinter Bezahlschranken wurden nicht als vollständig gelesen dargestellt. Redaktioneller Standard: Eine Theorie, eine Feldstudie, ein Befund zum Expertenurteil und ein Vorschlag werden als solche benannt, und der Satz hört auf zu behaupten, wo die Belege enden.") },
      ],
      note: x(
        "Every source is cited at its DOI on the next page; the eleven records, their journals, volumes and years were checked against the publishers' metadata and abstracts.",
        "Çdo burim citohet me DOI-n e vet në faqen tjetër; njëmbëdhjetë regjistrimet, revistat, vëllimet dhe vitet e tyre u kontrolluan kundrejt metadata-ve dhe abstrakteve të botuesve.",
        "Jede Quelle ist auf der nächsten Seite mit ihrer DOI zitiert; die elf Einträge, ihre Zeitschriften, Bände und Jahre wurden an den Metadaten und Abstracts der Verlage geprüft."),
      source: ["simon-1955", "mintzberg-raisinghani-theoret-1976", "klein-calderwood-clinton-cirocco-1986", "eisenhardt-1989", "bigley-roberts-2001", "tucker-edmondson-2003", "faraj-xiao-2006", "pressure-kahneman-klein-2009", "okhuysen-bechky-2009", "rudolph-morrison-carroll-2009", "weick-sutcliffe-2015"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
