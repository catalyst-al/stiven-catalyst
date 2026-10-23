// Operational treatise, Volume 9: The recovery gap, why fixing the failure is not the same as restoring trust. Block:
// Operations. Facts and their sources: docs/revista/traktati-operacional.md. The research is the service-recovery
// literature: Hart, Heskett & Sasser 1990, Bitner, Booms & Tetreault 1990, Tax, Brown & Chandrashekaran 1998, Maxham &
// Netemeyer 2002, Homburg & Fürst 2005, de Matos, Henrique & Rossi 2007, Orsingher, Valentini & de Angelis 2010,
// Gelbrich & Roschk 2011, Van Vaerenbergh et al. 2014 and Das et al. 2026, each checked at its DOI or page. Six chapters
// in the three layers, as in the author's PDF; the site adds two synthetic charts (the two clocks of one invented case
// in Chapter I, forty invented cases marked closed in Chapter III), both flagged, and the method has its own page.
// Every study count describes published research; nothing is measured in the author's workplaces.
import { x } from "../common.js";

const synthetic = x("Synthetic example, authored for this volume; not employer data", "Shembull sintetik, i shkruar për këtë vëllim; jo të dhëna punëdhënësi", "Synthetisches Beispiel, für diesen Band verfasst; keine Arbeitgeberdaten");

export default {
  number: 9,
  numeral: "IX",
  block: "operations",
  date: x("October 2026", "Tetor 2026", "Oktober 2026"),
  theme: [x("The recovery gap:", "Hendeku i rikuperimit:", "Die Wiedergutmachungslücke:"), x("why fixing the failure is not restoring trust", "pse ndreqja e dështimit nuk është rikthim i besimit", "warum der Fehler behoben und das Vertrauen nicht wiederhergestellt ist")],
  sub: x(
    "Six chapters on fairness, complaint closure, the recovery paradox, recurrence and responsible recovery.",
    "Gjashtë kapituj për drejtësinë, mbylljen e ankesave, paradoksin e rikuperimit, përsëritjen dhe rikuperimin e përgjegjshëm.",
    "Sechs Kapitel über Fairness, den Abschluss von Beschwerden, das Wiedergutmachungsparadox, Wiederholung und verantwortliche Wiedergutmachung."),
  seo: x(
    "The recovery gap, an operational treatise: six chapters in three layers, from a room that stayed a problem to Tax, de Matos, Homburg and the Closure Card.",
    "Hendeku i rikuperimit, traktat operacional: gjashtë kapituj në tri shtresa, nga një dhomë që mbeti problem te Tax, de Matos, Homburg dhe Karta e mbylljes.",
    "Die Wiedergutmachungslücke, operativer Traktat: sechs Kapitel in drei Ebenen, von einem Zimmer, das Problem blieb, zu Tax, de Matos und der Abschlusskarte."),
  feature: x(
    "Volume 9 asks whose problem a failure is after the fix. Its six chapters move from a room that stayed a problem across shifts, an apology that could not deliver, a case marked complete, a customer who did not return, a second broken promise and a handover that keeps a promise, to Tax, Brown and Chandrashekaran, Maxham and Netemeyer, de Matos, Orsingher, Gelbrich and Roschk, Van Vaerenbergh and Homburg and Fürst, and end with six gates to honest closure and the Recovery Closure Card.",
    "Vëllimi 9 pyet i kujt është problemi pas ndreqjes. Gjashtë kapitujt e tij shkojnë nga një dhomë që mbeti problem nëpër turne, një falje që nuk dorëzonte dot, një rast i shënuar i përfunduar, një klient që nuk u kthye, një premtim i dytë i thyer dhe një dorëzim që e mban premtimin, te Tax, Brown e Chandrashekaran, Maxham e Netemeyer, de Matos, Orsingher, Gelbrich e Roschk, Van Vaerenbergh dhe Homburg e Fürst, dhe mbyllen me gjashtë porta për mbyllje të ndershme dhe me Kartën e mbylljes së rikuperimit.",
    "Band 9 fragt, wessen Problem ein Fehler nach der Behebung ist. Seine sechs Kapitel führen von einem Zimmer, das über Schichten hinweg Problem blieb, einer Entschuldigung, die nicht liefern konnte, einem als erledigt markierten Fall, einem Kunden, der nicht zurückkam, einem zweiten gebrochenen Versprechen und einer Übergabe, die ein Versprechen hält, zu Tax, Brown und Chandrashekaran, Maxham und Netemeyer, de Matos, Orsingher, Gelbrich und Roschk, Van Vaerenbergh und Homburg und Fürst, und enden mit sechs Toren zum ehrlichen Abschluss und der Abschlusskarte."),
  figure: { n: "60", by: x("Orsingher, Valentini and de Angelis 2010, not a recovery rate", "Orsingher, Valentini e de Angelis 2010, jo normë rikuperimi", "Orsingher, Valentini und de Angelis 2010, keine Wiedergutmachungsquote"), t: x(
    "independent studies in a meta-analysis of satisfaction with service complaint handling.",
    "studime të pavarura në një meta-analizë të kënaqësisë me trajtimin e ankesave të shërbimit.",
    "unabhängige Studien in einer Metaanalyse zur Zufriedenheit mit der Beschwerdebearbeitung.") },
  teasers: [
    { page: "i-scene", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("The promise that failed", "Premtimi që dështoi", "Das Versprechen, das scheiterte") },
    { page: "iv-evidence", kicker: x("The evidence", "Prova", "Die Belege"),
      title: x("The paradox, with limits", "Paradoksi, me kufij", "Das Paradox, mit Grenzen") },
    { page: "tool", kicker: x("Field tool", "Mjeti i terrenit", "Werkzeug vor Ort"),
      title: x("The Recovery Closure Card", "Karta e mbylljes së rikuperimit", "Die Abschlusskarte") },
  ],
  contract: [
    { h: x("Field", "Terreni", "Feld"), p: x("Real categories of operational work, no invented personal incidents.", "Kategori të vërteta pune operacionale, pa ngjarje personale të shpikura.", "Echte Kategorien betrieblicher Arbeit, keine erfundenen persönlichen Vorfälle.") },
    { h: x("Evidence", "Prova", "Belege"), p: x("Population, design, outcome and limits travel with every finding.", "Popullata, projektimi, rezultati dhe kufijtë udhëtojnë me çdo gjetje.", "Population, Design, Ergebnis und Grenzen reisen mit jedem Befund.") },
    { h: x("Action", "Veprimi", "Handeln"), p: x("A case is closed to a justified state, never to the most flattering label.", "Një rast mbyllet në një gjendje të justifikuar, kurrë në etiketën më lajkatare.", "Ein Fall wird zu einem begründeten Zustand geschlossen, nie zum schmeichelhaftesten Etikett.") },
  ],
  sources: ["hart-heskett-sasser-1990", "bitner-booms-tetreault-1990", "tax-brown-chandrashekaran-1998", "maxham-netemeyer-2002", "homburg-furst-2005", "de-matos-2007", "orsingher-2010", "gelbrich-roschk-2011", "van-vaerenbergh-2014", "das-2026"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      title: [x("After the fix,", "Pas ndreqjes,", "Nach der Behebung:"), x("whose problem is it?", "i kujt është problemi?", "wessen Problem ist es?")],
      why: x(
        "A service can be repaired on paper while its failure continues to live in the customer's day.",
        "Një shërbim mund të ndreqet në letër, ndërsa dështimi i tij vazhdon të jetojë në ditën e klientit.",
        "Ein Service kann auf dem Papier repariert sein, während sein Versagen im Tag des Kunden weiterlebt."),
      body: x(
        "Consider the difference between two sentences: the issue has been closed, and the person affected has recovered. The first usually describes an internal decision. The second asks whether a customer received a usable remedy, an honest explanation and a credible next commitment. They are not interchangeable. A completed task, a corrected order and a polite apology may all be necessary; none automatically settles the human consequence of a broken promise. This ninth volume follows a failure through three operating worlds: a room problem that crosses hotel shifts, a last-mile delivery that arrives incomplete, and a wholesale commitment that has to survive a transfer from sales to fulfilment. These are documented categories of the author's work, not verified accounts of one particular guest, driver or reseller; the scenes that give them shape are constructed and labelled. The research is demanding. It connects complaint handling to perceived fairness and satisfaction, but does not promise that successful recovery automatically creates loyalty. A customer may appreciate the response and still decide not to return. Conversely, an issue recorded as unresolved may be under active, responsible management. Honest recovery needs both an operational account and the customer's perspective. Our question is not whether employees are nice or whether the complaint screen is green. It is whether an organisation can close the gap between correcting its own work and restoring enough reliability for the customer to make the next decision.",
        "Mendo dallimin mes dy fjalive: çështja është mbyllur, dhe personi i prekur është rikuperuar. E para zakonisht përshkruan një vendim të brendshëm. E dyta pyet nëse klienti mori një zgjidhje të përdorshme, një shpjegim të ndershëm dhe një angazhim të besueshëm për hapin tjetër. Nuk janë të këmbyeshme. Një detyrë e përfunduar, një porosi e korrigjuar dhe një falje e sjellshme mund të jenë të gjitha të nevojshme; asnjëra nuk e shlyen automatikisht pasojën njerëzore të një premtimi të thyer. Ky vëllim i nëntë e ndjek një dështim nëpër tri botë operacionale: një problem dhome që kalon nëpër turnet e hotelit, një dorëzim i miljes së fundit që mbërrin i paplotë, dhe një angazhim me shumicë që duhet t'i mbijetojë kalimit nga shitjet te përmbushja. Këto janë kategori të dokumentuara të punës së autorit, jo rrëfime të verifikuara për një mysafir, shofer apo rishitës të caktuar; skenat që u japin formë janë të ndërtuara dhe të etiketuara. Kërkimi është kërkues. E lidh trajtimin e ankesave me drejtësinë e perceptuar dhe kënaqësinë, por nuk premton se rikuperimi i suksesshëm krijon automatikisht besnikëri. Një klient mund ta vlerësojë përgjigjen dhe prapë të vendosë të mos kthehet. Anasjelltas, një çështje e regjistruar si e pazgjidhur mund të jetë nën menaxhim aktiv dhe të përgjegjshëm. Rikuperimi i ndershëm ka nevojë si për rrëfimin operacional, ashtu edhe për këndvështrimin e klientit. Pyetja jonë nuk është nëse punonjësit janë të sjellshëm apo nëse ekrani i ankesave është i gjelbër. Është nëse një organizatë mund ta mbyllë hendekun mes korrigjimit të punës së vet dhe rikthimit të besueshmërisë së mjaftueshme që klienti të marrë vendimin e radhës.",
        "Man betrachte den Unterschied zwischen zwei Sätzen: Das Anliegen ist geschlossen, und die betroffene Person hat sich erholt. Der erste beschreibt meist eine interne Entscheidung. Der zweite fragt, ob ein Kunde eine brauchbare Abhilfe, eine ehrliche Erklärung und eine glaubwürdige nächste Zusage erhielt. Sie sind nicht austauschbar. Erledigte Aufgabe, korrigierter Auftrag und höfliche Entschuldigung mögen nötig sein; keines erledigt von selbst die menschliche Folge eines gebrochenen Versprechens. Dieser neunte Band folgt einem Fehler durch drei Betriebswelten: ein Zimmerproblem, das Hotelschichten überquert, eine Zustellung der letzten Meile, die unvollständig ankommt, und eine Großhandelszusage, die den Übergang vom Verkauf zur Erfüllung überstehen muss. Das sind dokumentierte Kategorien der Arbeit des Autors, keine geprüften Berichte über einen bestimmten Gast, Fahrer oder Wiederverkäufer; die Szenen sind konstruiert und gekennzeichnet. Die Forschung ist anspruchsvoll. Sie verbindet Beschwerdebearbeitung mit wahrgenommener Fairness und Zufriedenheit, verspricht aber nicht, dass gelungene Wiedergutmachung von selbst Loyalität schafft. Ein Kunde kann die Antwort schätzen und trotzdem nicht wiederkommen. Umgekehrt kann ein als ungelöst geführtes Anliegen aktiv bearbeitet werden. Ehrliche Wiedergutmachung braucht den betrieblichen Bericht und die Sicht des Kunden. Unsere Frage ist nicht, ob die Beschäftigten freundlich sind oder der Beschwerdebildschirm grün ist. Sie ist, ob eine Organisation die Lücke schließen kann zwischen der Korrektur ihrer eigenen Arbeit und der Wiederherstellung von genug Verlässlichkeit, damit der Kunde die nächste Entscheidung treffen kann."),
    },
    { id: "contents", type: "contents" },
    {
      id: "note",
      kicker: x("Research note", "Shënim kërkimor", "Forschungsnotiz"),
      title: [x("The evidence", "Prova nuk është", "Die Belege"), x("is not a promise", "premtim", "sind kein Versprechen")],
      lead: x(
        "Service recovery research examines different outcomes in different populations. A conclusion must travel with its limits.",
        "Kërkimi i rikuperimit të shërbimit shqyrton rezultate të ndryshme në popullata të ndryshme. Një përfundim duhet të udhëtojë me kufijtë e vet.",
        "Die Forschung zur Wiedergutmachung untersucht verschiedene Ergebnisse in verschiedenen Populationen. Eine Schlussfolgerung muss mit ihren Grenzen reisen."),
      blocks: [
        { type: "p", text: x(
          "Tax, Brown and Chandrashekaran (1998) examined how complaining customers evaluated outcomes, procedures and interpersonal treatment. Homburg and Fürst (2005) studied organisations and their complaining customers together, distinguishing clear complaint-management rules from a supportive internal environment. These are useful frameworks; neither offers a universal amount of compensation, a universal response time or proof of success for a particular hotel. Orsingher, Valentini and de Angelis (2010) combined 60 independent studies of satisfaction with complaint handling. De Matos and colleagues (2007) found a positive average service-recovery-paradox effect on satisfaction, but no significant average effect on repurchase intention, word of mouth or corporate image. Das and colleagues (2026) synthesised 147 studies involving 82,901 people in 24 countries, all on online service failures: relevant for reasoning about justice and attribution, silent about hotels, loading ramps or wholesale partners.",
          "Tax, Brown dhe Chandrashekaran (1998) shqyrtuan si i vlerësonin klientët që ankoheshin rezultatet, procedurat dhe trajtimin ndërpersonal. Homburg dhe Fürst (2005) studiuan organizatat dhe klientët e tyre që ankoheshin bashkë, duke i dalluar rregullat e qarta të menaxhimit të ankesave nga një mjedis i brendshëm mbështetës. Këto janë kuadër të dobishëm; asnjëri nuk ofron një shumë universale kompensimi, një kohë universale përgjigjeje apo provë suksesi për një hotel të caktuar. Orsingher, Valentini dhe de Angelis (2010) bashkuan 60 studime të pavarura të kënaqësisë me trajtimin e ankesave. De Matos dhe kolegët (2007) gjetën një efekt mesatar pozitiv të paradoksit të rikuperimit mbi kënaqësinë, por asnjë efekt mesatar domethënës mbi qëllimin e riblerjes, fjalën gojore apo imazhin e kompanisë. Das dhe kolegët (2026) sintetizuan 147 studime me 82.901 njerëz në 24 vende, të gjitha për dështime shërbimi online: të vlefshme për të arsyetuar mbi drejtësinë dhe atribuimin, të heshtura për hotelet, rampat e ngarkimit apo partnerët me shumicë.",
          "Tax, Brown und Chandrashekaran (1998) untersuchten, wie sich beschwerende Kunden Ergebnisse, Verfahren und zwischenmenschliche Behandlung bewerteten. Homburg und Fürst (2005) untersuchten Organisationen und ihre sich beschwerenden Kunden gemeinsam und unterschieden klare Regeln der Beschwerdebearbeitung von einem unterstützenden internen Umfeld. Das sind nützliche Rahmen; keiner bietet eine universelle Entschädigungshöhe, eine universelle Antwortzeit oder einen Erfolgsbeweis für ein bestimmtes Hotel. Orsingher, Valentini und de Angelis (2010) verbanden 60 unabhängige Studien zur Zufriedenheit mit der Beschwerdebearbeitung. De Matos und Kollegen (2007) fanden einen positiven mittleren Paradoxeffekt auf die Zufriedenheit, aber keinen signifikanten mittleren Effekt auf Wiederkaufabsicht, Mundpropaganda oder Unternehmensimage. Das und Kollegen (2026) fassten 147 Studien mit 82.901 Personen in 24 Ländern zusammen, alle zu Online-Servicefehlern: relevant für Überlegungen zu Gerechtigkeit und Attribution, stumm zu Hotels, Laderampen oder Großhandelspartnern.") },
        { type: "stats", cols: 3, items: [
          { n: "60", t: x("studies: complaint-handling satisfaction meta-analysis, 2010", "studime: meta-analiza e kënaqësisë me trajtimin e ankesave, 2010", "Studien: Metaanalyse zur Zufriedenheit mit Beschwerdebearbeitung, 2010") },
          { n: "147", t: x("studies: online failure and recovery synthesis, 2026", "studime: sinteza e dështimit dhe rikuperimit online, 2026", "Studien: Synthese zu Online-Fehlern und Wiedergutmachung, 2026") },
          { n: "3", t: x("outcomes: remedy, experience and future relationship", "rezultate: zgjidhja, përvoja dhe marrëdhënia e ardhshme", "Ergebnisse: Abhilfe, Erlebnis und künftige Beziehung") },
        ] },
        { type: "p", text: x(
          "The constructs differ. A person can be satisfied with how a complaint was handled and still withhold loyalty. The research counts are published sample descriptors, not performance results, and none of them measures the author's workplaces.",
          "Konstruktet ndryshojnë. Një person mund të jetë i kënaqur me mënyrën si u trajtua një ankesë dhe prapë ta mbajë besnikërinë për vete. Numrat e kërkimit janë përshkrues mostrash të botuara, jo rezultate performance, dhe asnjëri nuk i mat vendet e punës së autorit.",
          "Die Konstrukte unterscheiden sich. Jemand kann mit der Bearbeitung einer Beschwerde zufrieden sein und Loyalität trotzdem vorenthalten. Die Forschungszahlen sind veröffentlichte Stichprobenbeschreibungen, keine Leistungsergebnisse, und keine misst die Arbeitsplätze des Autors.") },
        { type: "callout", reading: true, text: x(
          "The population, design and outcome are part of every finding, not optional fine print.",
          "Popullata, projektimi dhe rezultati janë pjesë e çdo gjetjeje, jo shënim i vogël fakultativ.",
          "Population, Design und Ergebnis sind Teil jedes Befunds, kein optionales Kleingedrucktes.") },
      ],
      note: x(
        "Orsingher, Valentini and de Angelis (2010); de Matos, Henrique and Rossi (2007); Tax, Brown and Chandrashekaran (1998); Homburg and Fürst (2005); Das et al. (2026).",
        "Orsingher, Valentini e de Angelis (2010); de Matos, Henrique e Rossi (2007); Tax, Brown e Chandrashekaran (1998); Homburg e Fürst (2005); Das et al. (2026).",
        "Orsingher, Valentini und de Angelis (2010); de Matos, Henrique und Rossi (2007); Tax, Brown und Chandrashekaran (1998); Homburg und Fürst (2005); Das et al. (2026)."),
      source: ["orsingher-2010", "de-matos-2007", "tax-brown-chandrashekaran-1998", "homburg-furst-2005", "das-2026"],
    },

    // Chapter I. The promise that failed
    {
      id: "ch-i", type: "chapter", numeral: "I",
      title: x("The promise that failed", "Premtimi që dështoi", "Das Versprechen, das scheiterte"),
      pages: [
        {
          id: "i-scene", layer: "scene", more: "the-angry-guest-at-2am",
          title: [x("The room that", "Dhoma që", "Das Zimmer, das"), x("remained a problem", "mbeti problem", "ein Problem blieb")],
          lead: x(
            "A reported defect can be entered correctly and still remain the guest's burden.",
            "Një defekt i raportuar mund të regjistrohet saktë dhe prapë të mbetet barrë e mysafirit.",
            "Ein gemeldeter Mangel kann richtig erfasst sein und trotzdem die Last des Gastes bleiben."),
          blocks: [
            { type: "flag", text: x("Constructed hotel scene, not a documented guest incident", "Skenë e ndërtuar hoteli, jo ngjarje e dokumentuar mysafiri", "Konstruierte Hotelszene, kein dokumentierter Gästevorfall") },
            { type: "p", text: x(
              "A guest reports a problem with a room in the evening. The receptionist listens, records the issue and passes it to the responsible team. Later, the night shift sees that an action was taken. The internal note is concise and the case may appear administratively complete. But the guest has not received a clear update. The next morning, the guest must decide whether to explain the story again or let it go. Nothing in this scene proves a system error, an unhelpful employee or a failed repair. Each stage may have been completed within its local task description. The story illustrates a subtler defect: no one has identified the whole experience as a single piece of work. A repair is a technical result. Closure, from the guest's perspective, also requires knowing what was done and what to expect if the symptom returns.",
              "Një mysafir raporton në mbrëmje një problem me dhomën. Recepsionisti dëgjon, e regjistron çështjen dhe ia kalon ekipit përgjegjës. Më vonë, turni i natës sheh se u bë një veprim. Shënimi i brendshëm është i shkurtër dhe rasti mund të duket administrativisht i plotë. Por mysafiri nuk ka marrë një përditësim të qartë. Të nesërmen në mëngjes, mysafiri duhet të vendosë nëse do ta shpjegojë historinë sërish apo do ta lërë. Asgjë në këtë skenë nuk provon një gabim sistemi, një punonjës të padobishëm apo një riparim të dështuar. Çdo fazë mund të jetë përfunduar brenda përshkrimit të vet lokal të detyrës. Historia ilustron një defekt më të hollë: askush nuk e ka identifikuar gjithë përvojën si një punë të vetme. Një riparim është rezultat teknik. Mbyllja, nga këndvështrimi i mysafirit, kërkon edhe të dish çfarë u bë dhe çfarë të presësh nëse simptoma kthehet.",
              "Ein Gast meldet am Abend ein Problem mit dem Zimmer. Die Rezeptionistin hört zu, erfasst das Anliegen und gibt es an das zuständige Team weiter. Später sieht die Nachtschicht, dass eine Maßnahme ergriffen wurde. Die interne Notiz ist knapp, und der Fall kann administrativ vollständig wirken. Doch der Gast hat keine klare Rückmeldung erhalten. Am nächsten Morgen muss er entscheiden, ob er die Geschichte noch einmal erzählt oder es dabei belässt. Nichts in dieser Szene beweist einen Systemfehler, eine unhilfsbereite Mitarbeiterin oder eine gescheiterte Reparatur. Jede Stufe mag innerhalb ihrer örtlichen Aufgabenbeschreibung erledigt sein. Die Geschichte zeigt einen feineren Mangel: Niemand hat das ganze Erlebnis als ein einziges Stück Arbeit erkannt. Eine Reparatur ist ein technisches Ergebnis. Abschluss aus Sicht des Gastes verlangt auch zu wissen, was getan wurde und was zu erwarten ist, wenn das Symptom zurückkehrt.") },
            { type: "p", text: x(
              "The author has documented work with room-maintenance concerns, housekeeping issues, Night Audit reporting and handovers. The room, guest, sequence and outcome above are imaginary; no name, property or private workflow is reconstructed. The management problem is the interval between reporting a defect, making a correction and informing the person who must live with the result.",
              "Autori ka dokumentuar punë me shqetësime mirëmbajtjeje dhomash, çështje pastrimi, raportim të Night Audit-it dhe dorëzime. Dhoma, mysafiri, radha dhe rezultati më sipër janë të sajuara; nuk rindërtohet asnjë emër, pronë apo rrjedhë private pune. Problemi menaxherial është intervali mes raportimit të një defekti, bërjes së një korrigjimi dhe informimit të personit që duhet të jetojë me rezultatin.",
              "Der Autor hat Arbeit mit Zimmerwartung, Housekeeping-Themen, Night-Audit-Berichten und Übergaben dokumentiert. Zimmer, Gast, Abfolge und Ausgang oben sind erfunden; kein Name, kein Haus und kein privater Arbeitsablauf wird rekonstruiert. Das Führungsproblem ist der Abstand zwischen dem Melden eines Mangels, der Korrektur und der Information der Person, die mit dem Ergebnis leben muss.") },
            { type: "callout", reading: true, text: x(
              "The final owner of a problem may not be the person who reported it, logged it or repaired it.",
              "Përgjegjësi i fundit i një problemi mund të mos jetë personi që e raportoi, e regjistroi apo e riparoi.",
              "Der letzte Verantwortliche für ein Problem ist womöglich nicht die Person, die es meldete, erfasste oder reparierte.") },
          ],
          note: x(
            "Constructed composite from documented categories of hotel work; the service-recovery literature behind it is Hart, Heskett and Sasser (1990) and Tax et al. (1998). The essay named below keeps a complaint open after the guest walks away.",
            "Kompozim i ndërtuar nga kategori të dokumentuara pune hoteli; literatura e rikuperimit pas tij është Hart, Heskett e Sasser (1990) dhe Tax et al. (1998). Eseja e emërtuar më poshtë e mban ankesën të hapur pasi mysafiri largohet.",
            "Konstruierte Zusammensetzung aus dokumentierten Kategorien der Hotelarbeit; die Literatur dahinter ist Hart, Heskett und Sasser (1990) und Tax et al. (1998). Der unten genannte Essay hält eine Beschwerde offen, nachdem der Gast gegangen ist."),
          source: ["hart-heskett-sasser-1990", "tax-brown-chandrashekaran-1998"],
        },
        {
          id: "i-concept", layer: "concept",
          title: [x("Service failure", "Dështimi i shërbimit", "Ein Servicefehler"), x("has two clocks", "ka dy orë", "hat zwei Uhren")],
          lead: x(
            "One clock measures internal work. The other measures the customer's exposure to a problem.",
            "Njëra orë mat punën e brendshme. Tjetra mat ekspozimin e klientit ndaj një problemi.",
            "Eine Uhr misst die interne Arbeit. Die andere misst, wie lange der Kunde dem Problem ausgesetzt ist."),
          blocks: [
            { type: "p", text: x(
              "A useful recovery analysis begins by identifying the original promise. Was the product complete? Was the room usable? Was the delivery reliable at the agreed point? The next question is the customer consequence: time lost, uncertainty, inconvenience, repeated contact or a decision postponed. Internal teams record the events they can control. Customers experience the chain of events they must endure. A room defect can require a specialist action, but the customer should not become the informal coordinator between departments. A missing item may be found quickly in the warehouse while the recipient still waits for a remedy. A reseller may accept an apology about an order, but its own commitments to customers remain exposed. Different sectors, different authority and risks; the common problem is a gap between local task completion and an end-to-end promise.",
              "Një analizë e dobishme rikuperimi nis duke identifikuar premtimin fillestar. A ishte produkti i plotë? A ishte dhoma e përdorshme? A ishte dorëzimi i besueshëm në pikën e rënë dakord? Pyetja tjetër është pasoja për klientin: koha e humbur, pasiguria, shqetësimi, kontakti i përsëritur ose një vendim i shtyrë. Ekipet e brendshme regjistrojnë ngjarjet që mund t'i kontrollojnë. Klientët përjetojnë zinxhirin e ngjarjeve që duhet ta durojnë. Një defekt dhome mund të kërkojë veprim specialisti, por klienti nuk duhet të bëhet koordinatori joformal mes departamenteve. Një artikull që mungon mund të gjendet shpejt në magazinë, ndërsa marrësi ende pret një zgjidhje. Një rishitës mund ta pranojë një falje për një porosi, por angazhimet e tij ndaj klientëve mbeten të ekspozuara. Sektorë të ndryshëm, autoritet dhe rreziqe të ndryshme; problemi i përbashkët është hendeku mes përfundimit të detyrës lokale dhe një premtimi nga fillimi në fund.",
              "Eine nützliche Analyse beginnt damit, das ursprüngliche Versprechen zu benennen. War das Produkt vollständig? War das Zimmer nutzbar? War die Zustellung am vereinbarten Punkt verlässlich? Die nächste Frage ist die Folge für den Kunden: verlorene Zeit, Unsicherheit, Unannehmlichkeit, wiederholter Kontakt oder eine aufgeschobene Entscheidung. Interne Teams erfassen die Ereignisse, die sie steuern können. Kunden erleben die Kette von Ereignissen, die sie ertragen müssen. Ein Zimmermangel kann eine Fachmaßnahme verlangen, doch der Kunde sollte nicht zum informellen Koordinator zwischen Abteilungen werden. Ein fehlender Artikel mag im Lager schnell gefunden sein, während der Empfänger noch auf Abhilfe wartet. Ein Wiederverkäufer mag eine Entschuldigung annehmen, doch seine eigenen Zusagen an Kunden bleiben ungeschützt. Verschiedene Sektoren, verschiedene Befugnisse und Risiken; das gemeinsame Problem ist die Lücke zwischen örtlicher Erledigung und einem Versprechen von Ende zu Ende.") },
            { type: "chain", items: [
              { h: x("Promise", "Premtimi", "Versprechen"), p: x("What was expected?", "Çfarë pritej?", "Was wurde erwartet?") },
              { h: x("Failure", "Dështimi", "Fehler"), p: x("What actually happened?", "Çfarë ndodhi vërtet?", "Was geschah wirklich?") },
              { h: x("Remedy", "Zgjidhja", "Abhilfe"), p: x("What was corrected?", "Çfarë u korrigjua?", "Was wurde korrigiert?") },
              { h: x("Experience", "Përvoja", "Erlebnis"), p: x("What remains for the customer?", "Çfarë i mbetet klientit?", "Was bleibt dem Kunden?") },
            ] },
            { type: "p", text: x(
              "Hart, Heskett and Sasser's early argument stressed identifying mistakes and responding to them: managerial guidance, not a controlled estimate of what response time creates loyalty. The sharper question is what a customer would regard as a usable outcome, and who has authority to confirm it. Proof of being informed must not be confused with proof of being satisfied, and a positive reaction does not certify the technical repair.",
              "Argumenti i hershëm i Hart, Heskett e Sasser-it theksonte identifikimin e gabimeve dhe përgjigjen ndaj tyre: udhëzim menaxherial, jo vlerësim i kontrolluar se cila kohë përgjigjeje krijon besnikëri. Pyetja më e mprehtë është çfarë do ta konsideronte klienti rezultat të përdorshëm, dhe kush ka autoritetin ta konfirmojë. Prova e të qenit i informuar nuk duhet ngatërruar me provën e të qenit i kënaqur, dhe një reagim pozitiv nuk e certifikon riparimin teknik.",
              "Das frühe Argument von Hart, Heskett und Sasser betonte, Fehler zu erkennen und auf sie zu reagieren: Führungsrat, keine kontrollierte Schätzung, welche Antwortzeit Loyalität schafft. Die schärfere Frage ist, was ein Kunde als brauchbares Ergebnis ansähe und wer befugt ist, es zu bestätigen. Der Beleg, informiert zu sein, darf nicht mit dem Beleg, zufrieden zu sein, verwechselt werden, und eine positive Reaktion bescheinigt nicht die technische Reparatur.") },
            { type: "callout", reading: true, text: x(
              "An internal completion timestamp and a customer-impact duration answer different questions.",
              "Një vulë kohe e përfundimit të brendshëm dhe kohëzgjatja e ndikimit te klienti u përgjigjen pyetjeve të ndryshme.",
              "Ein interner Erledigungszeitstempel und die Dauer der Kundenbelastung beantworten verschiedene Fragen.") },
          ],
          note: x(
            "Framework interpretation informed by Hart, Heskett and Sasser (1990), Bitner, Booms and Tetreault (1990) and Tax et al. (1998). The four stages are an editorial model.",
            "Interpretim kuadri i mbështetur te Hart, Heskett e Sasser (1990), Bitner, Booms e Tetreault (1990) dhe Tax et al. (1998). Katër fazat janë model editorial.",
            "Rahmendeutung nach Hart, Heskett und Sasser (1990), Bitner, Booms und Tetreault (1990) und Tax et al. (1998). Die vier Stufen sind ein redaktionelles Modell."),
          source: ["hart-heskett-sasser-1990", "bitner-booms-tetreault-1990", "tax-brown-chandrashekaran-1998"],
        },
        {
          id: "i-model", layer: "concept",
          title: [x("Two clocks", "Dy orë", "Zwei Uhren"), x("on one invented case", "në një rast të shpikur", "an einem erfundenen Fall")],
          lead: x(
            "A fully synthetic timeline shows how far the internal clock can run ahead of the customer's.",
            "Një vijë kohore krejt sintetike tregon sa larg mund të ecë ora e brendshme para asaj të klientit.",
            "Ein vollständig synthetischer Zeitverlauf zeigt, wie weit die interne Uhr der des Kunden vorauslaufen kann."),
          blocks: [
            { type: "flag", text: synthetic },
            { type: "hbars", max: 40, hypothetical: true,
              label: x("Hours after the report, one invented case", "Orë pas raportimit, një rast i shpikur", "Stunden nach der Meldung, ein erfundener Fall"),
              items: [
                { k: x("Technical fix completed", "Ndreqja teknike e përfunduar", "Technische Behebung abgeschlossen"), v: 2, n: "2 h" },
                { k: x("Internal case closed", "Rasti i brendshëm i mbyllur", "Interner Fall geschlossen"), v: 3, n: "3 h" },
                { k: x("Customer updated", "Klienti i përditësuar", "Kunde informiert"), v: 14, n: "14 h" },
                { k: x("Update confirmed received", "Përditësimi i konfirmuar si i marrë", "Empfang bestätigt"), v: 26, n: "26 h" },
                { k: x("Remedy verified with the customer", "Zgjidhja e verifikuar me klientin", "Abhilfe mit dem Kunden geprüft"), v: 38, n: "38 h", alert: true },
              ] },
            { type: "p", text: x(
              "Every value is invented so the two clocks can be compared, not measured at any property or station. On the internal clock the case is finished after three hours. On the customer's clock the problem is still open until the remedy is verified, more than a day later; in between, the customer does not know whether anything happened. The gap is not an accusation against the technician, the receptionist or the night shift: each acted inside a task. It is the interval nobody owned. A real operation has its own durations and its own authorised ways to confirm a remedy; the question the chart asks is which clock the dashboard reports.",
              "Çdo vlerë është e shpikur, që dy orët të krahasohen, jo e matur në ndonjë pronë apo stacion. Në orën e brendshme rasti mbaron pas tre orësh. Në orën e klientit problemi mbetet i hapur derisa zgjidhja verifikohet, më shumë se një ditë më vonë; ndërkohë, klienti nuk e di nëse ka ndodhur ndonjë gjë. Hendeku nuk është akuzë ndaj teknikut, recepsionistit apo turnit të natës: secili veproi brenda një detyre. Është intervali që askush nuk e zotëroi. Një operacion i vërtetë ka kohëzgjatjet e veta dhe mënyrat e veta të autorizuara për ta konfirmuar një zgjidhje; pyetja që bën grafiku është cilën orë raporton paneli.",
              "Jeder Wert ist erfunden, damit die beiden Uhren verglichen werden können, nicht in einem Haus oder an einer Station gemessen. Auf der internen Uhr ist der Fall nach drei Stunden erledigt. Auf der Uhr des Kunden bleibt das Problem offen, bis die Abhilfe geprüft ist, mehr als einen Tag später; dazwischen weiß der Kunde nicht, ob etwas geschah. Die Lücke ist keine Anklage gegen Techniker, Rezeption oder Nachtschicht: Alle handelten innerhalb einer Aufgabe. Sie ist der Abstand, den niemand verantwortete. Ein echter Betrieb hat eigene Dauern und eigene befugte Wege, eine Abhilfe zu bestätigen; die Frage des Diagramms ist, welche Uhr das Dashboard meldet.") },
            { type: "callout", reading: true, text: x(
              "Report the customer's clock beside the internal one, or the gap between them stays invisible.",
              "Raportoje orën e klientit pranë asaj të brendshme, përndryshe hendeku mes tyre mbetet i padukshëm.",
              "Melden Sie die Uhr des Kunden neben der internen, sonst bleibt die Lücke dazwischen unsichtbar.") },
          ],
          note: x(
            "Every value on this page is synthetic, authored for this volume; the two-clock reading follows the previous page. The author's PDF describes the two clocks without drawing them.",
            "Çdo vlerë në këtë faqe është sintetike, e shkruar për këtë vëllim; leximi me dy orë ndjek faqen e mëparshme. PDF-ja e autorit i përshkruan dy orët pa i vizatuar.",
            "Jeder Wert auf dieser Seite ist synthetisch, für diesen Band verfasst; die Lesart der zwei Uhren folgt der vorigen Seite. Das PDF des Autors beschreibt die zwei Uhren, ohne sie zu zeichnen."),
          source: ["tax-brown-chandrashekaran-1998"],
        },
        {
          id: "i-protocol", layer: "protocol",
          title: [x("Capture the loss,", "Kap humbjen,", "Den Verlust erfassen,"), x("not only the ticket", "jo vetëm biletën", "nicht nur das Ticket")],
          lead: x(
            "A complaint should be recorded so the next person can act without restarting the customer's story.",
            "Një ankesë duhet regjistruar që personi tjetër të veprojë pa e rinisur historinë e klientit.",
            "Eine Beschwerde so erfassen, dass die nächste Person handeln kann, ohne die Geschichte des Kunden neu zu beginnen."),
          blocks: [
            { type: "steps", items: [
              { h: x("Name the original promise", "Emërto premtimin fillestar", "Das ursprüngliche Versprechen benennen"), p: x("The customer-visible outcome the organisation had undertaken to provide.", "Rezultati i dukshëm për klientin që organizata ishte angazhuar ta jepte.", "Das für den Kunden sichtbare Ergebnis, das die Organisation zugesagt hatte.") },
              { h: x("Separate report from verification", "Ndaje raportin nga verifikimi", "Meldung von Prüfung trennen"), p: x("The customer statement, the observed facts and what is still uncertain.", "Deklarata e klientit, faktet e vëzhguara dhe çfarë mbetet e pasigurt.", "Die Aussage des Kunden, die beobachteten Fakten und was noch unsicher ist.") },
              { h: x("Describe remaining customer impact", "Përshkruaj ndikimin që mbetet te klienti", "Die verbleibende Kundenbelastung beschreiben"), p: x("The unresolved consequence, without collecting more private data than required.", "Pasoja e pazgjidhur, pa mbledhur më shumë të dhëna private se ç'duhet.", "Die ungelöste Folge, ohne mehr private Daten als nötig.") },
              { h: x("Assign an authorised owner", "Cakto një përgjegjës të autorizuar", "Eine befugte Verantwortliche zuweisen"), p: x("The role able to decide or escalate the remedy, not simply the team receiving an email.", "Roli që mund ta vendosë ose eskalojë zgjidhjen, jo thjesht ekipi që merr një email.", "Die Rolle, die die Abhilfe entscheiden oder eskalieren kann, nicht das Team mit der E-Mail.") },
              { h: x("Commit to the next update", "Angazhohu për përditësimin e radhës", "Die nächste Rückmeldung zusagen"), p: x("A realistic communication point and the permitted channel.", "Një pikë realiste komunikimi dhe kanali i lejuar.", "Ein realistischer Kommunikationszeitpunkt und der erlaubte Kanal.") },
              { h: x("Confirm the disposition", "Konfirmo gjendjen përfundimtare", "Den Stand bestätigen"), p: x("What was corrected, what was communicated and what remains unresolved.", "Çfarë u korrigjua, çfarë u komunikua dhe çfarë mbetet e pazgjidhur.", "Was korrigiert, was mitgeteilt wurde und was ungelöst bleibt.") },
            ] },
            { type: "p", text: x(
              "An editorial documentation checklist, not a replacement for a hotel complaint SOP, a delivery claim policy or a commercial approval rule; urgent safety or legal matters follow their authorised escalation routes at once. A trial can compare a small anonymous sample of records before and after revising the handover: could the receiving worker act with the information available, how often did the customer repeat the same facts, and did the promised update occur?",
              "Listë kontrolli dokumentimi editoriale, jo zëvendësim i një SOP-i hoteli për ankesat, i një politike pretendimesh dorëzimi apo i një rregulli miratimi tregtar; çështjet urgjente të sigurisë ose ligjore ndjekin menjëherë rrugët e tyre të autorizuara të eskalimit. Një provë mund të krahasojë një mostër të vogël anonime regjistrash para dhe pas rishikimit të dorëzimit: a mundi punonjësi që e mori të vepronte me informacionin në dispozicion, sa shpesh i përsëriti klienti të njëjtat fakte, dhe a ndodhi përditësimi i premtuar?",
              "Eine redaktionelle Checkliste, kein Ersatz für eine Beschwerde-SOP, eine Reklamationsrichtlinie oder eine Freigaberegel; dringende Sicherheits- oder Rechtsfragen folgen sofort ihren Eskalationswegen. Ein Versuch vergleicht eine kleine anonyme Stichprobe vor und nach der Überarbeitung der Übergabe: Konnte die nächste Kraft handeln, wie oft wiederholte der Kunde dieselben Fakten, kam die zugesagte Rückmeldung?") },
            { type: "callout", reading: true, text: x(
              "A complete complaint record is one that enables the next responsible action, not merely one with every field filled.",
              "Një regjistër i plotë ankese është ai që e mundëson veprimin e radhës të përgjegjshëm, jo thjesht ai me çdo fushë të plotësuar.",
              "Eine vollständige Beschwerdeaufzeichnung ist eine, die die nächste verantwortliche Handlung ermöglicht, nicht bloß eine mit allen Feldern gefüllt.") },
          ],
          note: x(
            "Original operating protocol, inspired by Tax et al. (1998) and Homburg and Fürst (2005); not a validated intervention or a hotel-certified SOP.",
            "Protokoll operativ origjinal, i frymëzuar nga Tax et al. (1998) dhe Homburg e Fürst (2005); jo ndërhyrje e vërtetuar apo SOP i certifikuar hoteli.",
            "Eigenes Betriebsprotokoll nach Tax et al. (1998) und Homburg und Fürst (2005); keine validierte Intervention, keine zertifizierte SOP."),
          source: ["tax-brown-chandrashekaran-1998", "homburg-furst-2005"],
        },
      ],
    },

    // Chapter II. Three dimensions of fairness
    {
      id: "ch-ii", type: "chapter", numeral: "II",
      title: x("Three dimensions of fairness", "Tri dimensionet e drejtësisë", "Drei Dimensionen der Fairness"),
      pages: [
        {
          id: "ii-scene", layer: "scene", more: "61-resellers",
          title: [x("The apology", "Falja që", "Die Entschuldigung,"), x("that could not deliver", "nuk dorëzonte dot", "die nicht liefern konnte")],
          lead: x(
            "A correct answer can still feel unfair when the customer carries all the inconvenience.",
            "Një përgjigje e saktë mund të ndihet prapë e padrejtë kur klienti e mban gjithë shqetësimin.",
            "Eine richtige Antwort kann sich trotzdem unfair anfühlen, wenn der Kunde alle Unannehmlichkeiten trägt."),
          blocks: [
            { type: "flag", text: x("Constructed wholesale scene, not a claimed sales incident", "Skenë e ndërtuar e shitjes me shumicë, jo ngjarje e pretenduar shitjesh", "Konstruierte Großhandelsszene, kein behaupteter Verkaufsvorfall") },
            { type: "p", text: x(
              "An independent reseller has been told that a shipment can follow a confirmed order. The delivery date changes. The account representative calls promptly and explains what the supplier can now offer. A replacement date is agreed, yet the reseller faces a separate cost: explaining the change to its own buyers and reorganising plans it cannot easily move. The supplier may believe the problem is fixed as soon as the new date is recorded. The reseller evaluates more than the date. Was the replacement outcome reasonable? Was the process understandable and free of repeated effort? Did the representative treat the reseller's position with respect? The same remedy is experienced differently if communication is evasive, if the customer had to chase several departments or if the explanation arrives only after a missed promise.",
              "Një rishitësi të pavarur i është thënë se një dërgesë mund të ndjekë një porosi të konfirmuar. Data e dorëzimit ndryshon. Përfaqësuesi i llogarisë telefonon menjëherë dhe shpjegon çfarë mund të ofrojë tani furnitori. Bihet dakord për një datë zëvendësuese, por rishitësi përballet me një kosto më vete: t'ua shpjegojë ndryshimin blerësve të vet dhe të riorganizojë plane që nuk i lëviz dot lehtë. Furnitori mund të besojë se problemi është ndrequr sapo regjistrohet data e re. Rishitësi vlerëson më shumë se datën. A ishte rezultati zëvendësues i arsyeshëm? A ishte procesi i kuptueshëm dhe pa mundim të përsëritur? A e trajtoi përfaqësuesi pozitën e rishitësit me respekt? E njëjta zgjidhje përjetohet ndryshe nëse komunikimi është shmangës, nëse klientit iu desh të ndiqte disa departamente apo nëse shpjegimi vjen vetëm pas një premtimi të humbur.",
              "Einem unabhängigen Wiederverkäufer wurde gesagt, eine Lieferung könne auf einen bestätigten Auftrag folgen. Der Liefertermin ändert sich. Der Kundenbetreuer ruft umgehend an und erklärt, was der Lieferant nun bieten kann. Ein Ersatztermin wird vereinbart, doch der Wiederverkäufer trägt eigene Kosten: die Änderung seinen Käufern erklären und Pläne umstellen, die sich nicht leicht verschieben lassen. Der Lieferant mag das Problem für behoben halten, sobald der neue Termin erfasst ist. Der Wiederverkäufer bewertet mehr als den Termin. War das Ersatzergebnis angemessen? War der Prozess verständlich und frei von wiederholtem Aufwand? Behandelte der Betreuer die Lage des Wiederverkäufers mit Respekt? Dieselbe Abhilfe wird anders erlebt, wenn die Kommunikation ausweichend ist, der Kunde mehreren Abteilungen nachlaufen musste oder die Erklärung erst nach einem verpassten Versprechen kommt.") },
            { type: "p", text: x(
              "The author previously worked across sales, stock and warehouse coordination with a network of 61 active wholesale resellers. That background is documented; the conversation, delay and outcome here are invented. A partner is not an employee of the supplier, and a supplier cannot assume the partner will silently absorb a change.",
              "Autori ka punuar më parë në koordinimin e shitjeve, stokut dhe magazinës me një rrjet prej 61 rishitësish aktivë me shumicë. Ai sfond është i dokumentuar; biseda, vonesa dhe rezultati këtu janë të shpikura. Një partner nuk është punonjës i furnitorit, dhe furnitori nuk mund të supozojë se partneri do ta përthithë në heshtje një ndryshim.",
              "Der Autor arbeitete früher in der Koordination von Verkauf, Bestand und Lager mit einem Netz von 61 aktiven Großhandelspartnern. Dieser Hintergrund ist dokumentiert; Gespräch, Verzögerung und Ausgang hier sind erfunden. Ein Partner ist kein Angestellter des Lieferanten, und ein Lieferant darf nicht annehmen, der Partner werde eine Änderung stillschweigend auffangen.") },
            { type: "callout", reading: true, text: x(
              "Fairness is not merely what the company gives back. It also concerns how the customer had to obtain it.",
              "Drejtësia nuk është thjesht çfarë kthen kompania. Ka të bëjë edhe me mënyrën si iu desh klientit ta merrte.",
              "Fairness ist nicht nur, was das Unternehmen zurückgibt. Sie betrifft auch, wie der Kunde es bekommen musste.") },
          ],
          note: x(
            "Constructed wholesale illustration; justice framework after Tax, Brown and Chandrashekaran (1998). The essay named below is about those 61 resellers and trust.",
            "Ilustrim i ndërtuar i shitjes me shumicë; kuadri i drejtësisë sipas Tax, Brown e Chandrashekaran (1998). Eseja e emërtuar më poshtë flet për ata 61 rishitës dhe besimin.",
            "Konstruierte Großhandelsillustration; Gerechtigkeitsrahmen nach Tax, Brown und Chandrashekaran (1998). Der unten genannte Essay handelt von diesen 61 Wiederverkäufern und Vertrauen."),
          source: ["tax-brown-chandrashekaran-1998"],
        },
        {
          id: "ii-concept", layer: "concept",
          title: [x("Three questions", "Tri pyetje", "Drei Fragen"), x("behind one complaint", "pas një ankese", "hinter einer Beschwerde")],
          lead: x(
            "Customers can judge the result, the path to the result and the way they were treated.",
            "Klientët mund të gjykojnë rezultatin, rrugën deri te rezultati dhe mënyrën si u trajtuan.",
            "Kunden können das Ergebnis, den Weg dorthin und die Art ihrer Behandlung beurteilen."),
          blocks: [
            { type: "p", text: x(
              "Justice theory supplies a more precise language than a generic instruction to make the customer happy. Distributive justice concerns the perceived fairness of the outcome: the replacement, correction, reimbursement or other authorised remedy. Procedural justice concerns access, timeliness, consistency, effort and transparency in the process. Interactional justice concerns dignity, honesty and the quality of interpersonal communication. The dimensions can disagree. An excellent remedy delivered only after repeated calls leaves the procedure judged poorly. A considerate apology cannot substitute for a missing item. A technically correct refusal still demands a respectful explanation and a route for review. Conversely, kindness cannot authorise a frontline worker to grant an unsafe or prohibited exception: fairness operates inside the real authority of the service.",
              "Teoria e drejtësisë jep një gjuhë më të saktë se udhëzimi i përgjithshëm për ta bërë klientin të lumtur. Drejtësia shpërndarëse ka të bëjë me drejtësinë e perceptuar të rezultatit: zëvendësimi, korrigjimi, rimbursimi ose një zgjidhje tjetër e autorizuar. Drejtësia procedurale ka të bëjë me qasjen, kohën, qëndrueshmërinë, mundimin dhe transparencën në proces. Drejtësia ndërvepruese ka të bëjë me dinjitetin, ndershmërinë dhe cilësinë e komunikimit ndërpersonal. Dimensionet mund të mos pajtohen. Një zgjidhje e shkëlqyer e dhënë vetëm pas telefonatave të përsëritura e lë procedurën të gjykuar keq. Një falje e kujdesshme nuk e zëvendëson dot një artikull që mungon. Një refuzim teknikisht i saktë kërkon prapë një shpjegim me respekt dhe një rrugë rishikimi. Anasjelltas, mirësia nuk e autorizon dot një punonjës të vijës së parë të japë një përjashtim të pasigurt ose të ndaluar: drejtësia vepron brenda autoritetit të vërtetë të shërbimit.",
              "Die Gerechtigkeitstheorie liefert eine genauere Sprache als die allgemeine Anweisung, den Kunden glücklich zu machen. Distributive Gerechtigkeit betrifft die wahrgenommene Fairness des Ergebnisses: Ersatz, Korrektur, Erstattung oder eine andere befugte Abhilfe. Prozedurale Gerechtigkeit betrifft Zugang, Rechtzeitigkeit, Konsistenz, Aufwand und Transparenz des Verfahrens. Interaktionale Gerechtigkeit betrifft Würde, Ehrlichkeit und die Qualität der zwischenmenschlichen Kommunikation. Die Dimensionen können auseinanderfallen. Eine ausgezeichnete Abhilfe erst nach wiederholten Anrufen lässt das Verfahren schlecht dastehen. Eine rücksichtsvolle Entschuldigung ersetzt keinen fehlenden Artikel. Eine technisch richtige Ablehnung verlangt dennoch eine respektvolle Erklärung und einen Weg zur Überprüfung. Umgekehrt kann Freundlichkeit eine Arbeitskraft nicht ermächtigen, eine unsichere oder verbotene Ausnahme zu gewähren: Fairness wirkt innerhalb der echten Befugnis des Service.") },
            { type: "cards", cols: 3, items: [
              { h: x("Outcome", "Rezultati", "Ergebnis"), p: x("What did the customer actually receive?", "Çfarë mori vërtet klienti?", "Was hat der Kunde tatsächlich erhalten?") },
              { h: x("Procedure", "Procedura", "Verfahren"), p: x("How much uncertainty, delay and effort remained?", "Sa pasiguri, vonesë dhe mundim mbeti?", "Wie viel Unsicherheit, Verzögerung und Aufwand blieb?") },
              { h: x("Treatment", "Trajtimi", "Behandlung"), p: x("Was the person treated honestly and respectfully?", "A u trajtua personi me ndershmëri dhe respekt?", "Wurde die Person ehrlich und respektvoll behandelt?") },
            ] },
            { type: "p", text: x(
              "Tax, Brown and Chandrashekaran (1998) found that complaining customers evaluated complaint incidents along outcomes, procedures and interpersonal treatment. Their findings prescribe no universal ranking of the three dimensions: failure type, industry and outcome change the relative weight of what the customer receives, how the process unfolds and how the interaction is conducted.",
              "Tax, Brown dhe Chandrashekaran (1998) gjetën se klientët që ankoheshin i vlerësonin ngjarjet e ankesave sipas rezultateve, procedurave dhe trajtimit ndërpersonal. Gjetjet e tyre nuk përcaktojnë asnjë renditje universale të tri dimensioneve: lloji i dështimit, industria dhe rezultati e ndryshojnë peshën relative të asaj që merr klienti, si shpaloset procesi dhe si zhvillohet ndërveprimi.",
              "Tax, Brown und Chandrashekaran (1998) fanden, dass sich beschwerende Kunden Beschwerdevorfälle nach Ergebnissen, Verfahren und zwischenmenschlicher Behandlung bewerteten. Ihre Befunde schreiben keine universelle Rangfolge der drei Dimensionen vor: Fehlerart, Branche und Ergebnis verändern das relative Gewicht dessen, was der Kunde erhält, wie das Verfahren abläuft und wie die Interaktion geführt wird.") },
            { type: "callout", reading: true, text: x(
              "A recovery decision should be checked against all three forms of fairness, within authorised limits.",
              "Një vendim rikuperimi duhet kontrolluar kundrejt të tri formave të drejtësisë, brenda kufijve të autorizuar.",
              "Eine Wiedergutmachungsentscheidung sollte an allen drei Formen der Fairness geprüft werden, innerhalb der befugten Grenzen.") },
          ],
          note: x(
            "Tax, Brown and Chandrashekaran, Journal of Marketing 62(2), 1998. Applications to wholesale, last-mile and hotels are editorial comparisons.",
            "Tax, Brown e Chandrashekaran, Journal of Marketing 62(2), 1998. Zbatimet për shitjen me shumicë, miljen e fundit dhe hotelet janë krahasime editoriale.",
            "Tax, Brown und Chandrashekaran, Journal of Marketing 62(2), 1998. Anwendungen auf Großhandel, letzte Meile und Hotels sind redaktionelle Vergleiche."),
          source: ["tax-brown-chandrashekaran-1998"],
        },
        {
          id: "ii-evidence", layer: "concept",
          title: [x("Which kind", "Cili lloj", "Welche Art"), x("of fairness matters?", "drejtësie ka rëndësi?", "von Fairness zählt?")],
          lead: x(
            "Two evidence syntheses show why the answer depends on the outcome being studied.",
            "Dy sinteza provash tregojnë pse përgjigjja varet nga rezultati që studiohet.",
            "Zwei Belegsynthesen zeigen, warum die Antwort vom untersuchten Ergebnis abhängt."),
          blocks: [
            { type: "stat", n: "60", t: x("independent studies in the meta-analysis of satisfaction with complaint handling: a literature count, not a recovery-success percentage", "studime të pavarura në meta-analizën e kënaqësisë me trajtimin e ankesave: numër literature, jo përqindje suksesi rikuperimi", "unabhängige Studien in der Metaanalyse zur Zufriedenheit mit Beschwerdebearbeitung: eine Literaturzahl, kein Prozentsatz erfolgreicher Wiedergutmachung") },
            { type: "p", text: x(
              "Orsingher, Valentini and de Angelis (2010) combined 60 independent studies of satisfaction with complaint handling. For that outcome, their meta-analysis reported the strongest relationship for distributive justice, followed by interactional justice, with a weaker association for procedural justice. But satisfaction with complaint handling did not mediate the justice dimensions' effects on overall satisfaction and return intention, as conventional wisdom might suggest. Gelbrich and Roschk (2011) examined a broader model: organisational responses, customer justice perceptions, post-complaint satisfaction and behavioural intentions. They found support for an intervening role of perceived justice and satisfaction and cautioned against treating compensation as the only relevant part of recovery: employee behaviour and procedures belong to the structure. The two reviews differ in samples, modelling choices and dependent variables. A customer rating the immediate remedy is not answering the same question as a customer deciding whether to buy again next month, and neither outcome measures the original technical fault.",
              "Orsingher, Valentini dhe de Angelis (2010) bashkuan 60 studime të pavarura të kënaqësisë me trajtimin e ankesave. Për atë rezultat, meta-analiza e tyre raportoi lidhjen më të fortë për drejtësinë shpërndarëse, e ndjekur nga drejtësia ndërvepruese, me një lidhje më të dobët për drejtësinë procedurale. Por kënaqësia me trajtimin e ankesave nuk i ndërmjetësonte efektet e dimensioneve të drejtësisë mbi kënaqësinë e përgjithshme dhe qëllimin për t'u kthyer, siç do të sugjeronte mendimi i zakonshëm. Gelbrich dhe Roschk (2011) shqyrtuan një model më të gjerë: përgjigjet organizative, perceptimet e klientit për drejtësinë, kënaqësia pas ankesës dhe qëllimet e sjelljes. Gjetën mbështetje për një rol ndërmjetës të drejtësisë së perceptuar dhe kënaqësisë dhe paralajmëruan të mos trajtohet kompensimi si e vetmja pjesë e rëndësishme e rikuperimit: sjellja e punonjësve dhe procedurat i përkasin strukturës. Dy rishikimet ndryshojnë në mostra, zgjedhje modelimi dhe variabla të varura. Një klient që vlerëson zgjidhjen e menjëhershme nuk i përgjigjet së njëjtës pyetje si një klient që vendos nëse do të blejë sërish muajin tjetër, dhe asnjëri rezultat nuk e mat defektin teknik fillestar.",
              "Orsingher, Valentini und de Angelis (2010) verbanden 60 unabhängige Studien zur Zufriedenheit mit der Beschwerdebearbeitung. Für dieses Ergebnis berichtete ihre Metaanalyse den stärksten Zusammenhang für distributive Gerechtigkeit, gefolgt von interaktionaler, mit einem schwächeren für prozedurale Gerechtigkeit. Doch die Zufriedenheit mit der Beschwerdebearbeitung vermittelte die Wirkungen der Gerechtigkeitsdimensionen auf Gesamtzufriedenheit und Wiederkehrabsicht nicht, wie es die gängige Annahme nahelegt. Gelbrich und Roschk (2011) untersuchten ein breiteres Modell: organisationale Reaktionen, Gerechtigkeitswahrnehmung, Zufriedenheit nach der Beschwerde und Verhaltensabsichten. Sie fanden Rückhalt für eine vermittelnde Rolle von Gerechtigkeit und Zufriedenheit und warnten davor, Entschädigung als einzigen relevanten Teil zu behandeln: Mitarbeiterverhalten und Verfahren gehören zur Struktur. Die beiden Übersichten unterscheiden sich in Stichproben, Modellwahl und abhängigen Variablen. Ein Kunde, der die sofortige Abhilfe bewertet, beantwortet nicht dieselbe Frage wie einer, der entscheidet, ob er nächsten Monat wieder kauft, und keines der Ergebnisse misst den ursprünglichen technischen Fehler.") },
            { type: "callout", reading: true, text: x(
              "The studies assess relationships among measured perceptions and outcomes; they do not make a single remedy universally optimal.",
              "Studimet vlerësojnë lidhjet mes perceptimeve dhe rezultateve të matura; nuk e bëjnë një zgjidhje të vetme universalisht optimale.",
              "Die Studien bewerten Zusammenhänge zwischen gemessenen Wahrnehmungen und Ergebnissen; sie machen keine einzelne Abhilfe universell optimal.") },
          ],
          note: x(
            "Orsingher, Valentini and de Angelis (2010), Journal of the Academy of Marketing Science 38, 169–186; Gelbrich and Roschk (2011), Journal of Service Research 14, 24–43. Published syntheses, not measurements of the author's workplaces.",
            "Orsingher, Valentini e de Angelis (2010), Journal of the Academy of Marketing Science 38, 169–186; Gelbrich e Roschk (2011), Journal of Service Research 14, 24–43. Sinteza të botuara, jo matje të vendeve të punës së autorit.",
            "Orsingher, Valentini und de Angelis (2010), Journal of the Academy of Marketing Science 38, 169–186; Gelbrich und Roschk (2011), Journal of Service Research 14, 24–43. Veröffentlichte Synthesen, keine Messungen der Arbeitsplätze des Autors."),
          source: ["orsingher-2010", "gelbrich-roschk-2011"],
        },
        {
          id: "ii-protocol", layer: "protocol",
          title: [x("The fairness check", "Kontrolli i drejtësisë", "Die Fairnessprüfung"), x("before closure", "para mbylljes", "vor dem Abschluss")],
          lead: x(
            "Before declaring a complaint resolved, inspect the customer experience from three angles, within the service's real boundaries.",
            "Para se ta shpallësh një ankesë të zgjidhur, shqyrtoje përvojën e klientit nga tri kënde, brenda kufijve të vërtetë të shërbimit.",
            "Bevor eine Beschwerde für gelöst erklärt wird, das Kundenerlebnis aus drei Blickwinkeln prüfen, innerhalb der echten Grenzen des Service."),
          blocks: [
            { type: "rows", compact: true, items: [
              { h: x("Outcome", "Rezultati", "Ergebnis"), p: x("What promised result or authorised alternative has actually been delivered? What remains unverified?", "Cili rezultat i premtuar ose alternativë e autorizuar është dhënë vërtet? Çfarë mbetet e paverifikuar?", "Welches zugesagte Ergebnis oder welche befugte Alternative wurde tatsächlich geliefert? Was bleibt ungeprüft?") },
              { h: x("Procedure", "Procedura", "Verfahren"), p: x("How many times did the customer need to explain, ask or wait? Was the next step and decision authority clear?", "Sa herë iu desh klientit të shpjegonte, të pyeste ose të priste? A ishin të qarta hapi i radhës dhe autoriteti i vendimit?", "Wie oft musste der Kunde erklären, fragen oder warten? Waren nächster Schritt und Entscheidungsbefugnis klar?") },
              { h: x("Treatment", "Trajtimi", "Behandlung"), p: x("Did the communication acknowledge the problem, explain facts without speculation and preserve the customer's dignity?", "A e pranoi komunikimi problemin, a i shpjegoi faktet pa spekulime dhe a e ruajti dinjitetin e klientit?", "Hat die Kommunikation das Problem anerkannt, Fakten ohne Spekulation erklärt und die Würde des Kunden gewahrt?") },
              { h: x("Boundaries", "Kufijtë", "Grenzen"), p: x("Are safety, privacy, legal requirements and compensation authority respected?", "A respektohen siguria, privatësia, kërkesat ligjore dhe autoriteti i kompensimit?", "Werden Sicherheit, Datenschutz, rechtliche Vorgaben und Entschädigungsbefugnis beachtet?") },
              { h: x("Evidence", "Prova", "Belege"), p: x("What source confirms the action? What is known about the customer's response, if any?", "Cili burim e konfirmon veprimin? Çfarë dihet për përgjigjen e klientit, nëse ka?", "Welche Quelle bestätigt die Handlung? Was ist über die Reaktion des Kunden bekannt, falls es eine gibt?") },
            ] },
            { type: "p", text: x(
              "The check needs no lengthy survey after every interaction. A sample of anonymised records can reveal recurring gaps: corrections without updates, responses without ownership, apologies without a remedy. Do not infer satisfaction from silence: a customer may not complain again because they are satisfied, because they gave up or because they switched provider. Standardisation prevents arbitrary treatment; discretion lets different situations receive different permitted responses; neither replaces transparent review.",
              "Kontrolli nuk ka nevojë për anketë të gjatë pas çdo ndërveprimi. Një mostër regjistrash anonime mund të zbulojë hendeqe të përsëritura: korrigjime pa përditësime, përgjigje pa përgjegjës, falje pa zgjidhje. Mos nxirr kënaqësi nga heshtja: një klient mund të mos ankohet sërish se është i kënaqur, se hoqi dorë ose se ndërroi ofrues. Standardizimi parandalon trajtimin arbitrar; gjykimi i lejon situatave të ndryshme përgjigje të ndryshme të lejuara; asnjëri nuk e zëvendëson rishikimin transparent.",
              "Die Prüfung braucht keine lange Umfrage nach jeder Interaktion. Eine Stichprobe anonymisierter Aufzeichnungen kann wiederkehrende Lücken zeigen: Korrekturen ohne Rückmeldung, Antworten ohne Verantwortliche, Entschuldigungen ohne Abhilfe. Zufriedenheit nicht aus Schweigen folgern: Ein Kunde beschwert sich vielleicht nicht noch einmal, weil er zufrieden ist, weil er aufgab oder weil er den Anbieter wechselte. Standardisierung verhindert willkürliche Behandlung; Ermessen erlaubt verschiedenen Lagen verschiedene zulässige Antworten; keines ersetzt eine transparente Überprüfung.") },
            { type: "callout", reading: true, text: x(
              "Ask what was fair about the outcome, the process and the treatment. Record evidence, not a declaration of happiness.",
              "Pyet çfarë ishte e drejtë te rezultati, procesi dhe trajtimi. Shëno prova, jo një deklaratë lumturie.",
              "Fragen Sie, was an Ergebnis, Verfahren und Behandlung fair war. Halten Sie Belege fest, keine Glückserklärung.") },
          ],
          note: x(
            "Original editorial checklist informed by Tax et al. (1998), Homburg and Fürst (2005) and Orsingher et al. (2010).",
            "Listë kontrolli editoriale origjinale e mbështetur te Tax et al. (1998), Homburg e Fürst (2005) dhe Orsingher et al. (2010).",
            "Eigene redaktionelle Checkliste nach Tax et al. (1998), Homburg und Fürst (2005) und Orsingher et al. (2010)."),
          source: ["tax-brown-chandrashekaran-1998", "homburg-furst-2005", "orsingher-2010"],
        },
      ],
    },

    // Chapter III. Closed is not resolved
    {
      id: "ch-iii", type: "chapter", numeral: "III",
      title: x("Closed is not resolved", "E mbyllur nuk është e zgjidhur", "Geschlossen ist nicht gelöst"),
      pages: [
        {
          id: "iii-scene", layer: "scene", more: "the-scanner-is-a-witness",
          title: [x("The case marked", "Rasti i shënuar", "Der Fall, markiert"), x("complete", "i përfunduar", "als erledigt")],
          lead: x(
            "A system status can be accurate inside one department while incomplete for the recipient.",
            "Një status sistemi mund të jetë i saktë brenda një departamenti dhe i paplotë për marrësin.",
            "Ein Systemstatus kann innerhalb einer Abteilung stimmen und für den Empfänger unvollständig sein."),
          blocks: [
            { type: "flag", text: x("Constructed last-mile example, not a verified delivery case", "Shembull i ndërtuar i miljes së fundit, jo rast i verifikuar dorëzimi", "Konstruiertes Last-Mile-Beispiel, kein geprüfter Zustellfall") },
            { type: "p", text: x(
              "A delivered order is reported as incomplete. An operational colleague opens a case, checks what the system recorded and asks a receiving team to investigate. A missing item is located. The internal case is marked as corrected. At that exact moment, the physical item has not necessarily reached the original recipient, and the recipient does not necessarily know when it will. The process has advanced; the customer outcome remains uncertain. Nothing in this story says that a particular scanner malfunctioned, that a driver was wrongly blamed or that a customer received the wrong amount. The danger is a quiet inflation of a label. Staff may mean that the internal investigation is complete. A dashboard may display the same word as if the customer problem were finished. An auditor may later read it as proof of success. The fix is not to distrust every status; it is to define what the status proves, what it does not prove, and which additional outcome needs confirmation.",
              "Një porosi e dorëzuar raportohet si e paplotë. Një koleg operacional hap një rast, kontrollon çfarë regjistroi sistemi dhe i kërkon një ekipi marrës të hetojë. Artikulli që mungon gjendet. Rasti i brendshëm shënohet si i korrigjuar. Pikërisht në atë çast, artikulli fizik nuk ka arritur doemos te marrësi fillestar, dhe marrësi nuk e di doemos kur do të arrijë. Procesi ka ecur përpara; rezultati për klientin mbetet i pasigurt. Asgjë në këtë histori nuk thotë se një skaner i caktuar nuk punoi, se një shofer u fajësua gabimisht apo se një klient mori sasinë e gabuar. Rreziku është fryrja e heshtur e një etikete. Stafi mund të ketë parasysh se hetimi i brendshëm ka përfunduar. Një panel mund ta shfaqë të njëjtën fjalë sikur problemi i klientit të kishte mbaruar. Një auditues mund ta lexojë më vonë si provë suksesi. Ilaçi nuk është të mos i besosh asnjë statusi; është të përkufizosh çfarë provon statusi, çfarë nuk provon dhe cili rezultat shtesë ka nevojë për konfirmim.",
              "Ein zugestellter Auftrag wird als unvollständig gemeldet. Eine Kollegin im Betrieb öffnet einen Fall, prüft, was das System erfasste, und bittet ein empfangendes Team um Untersuchung. Ein fehlender Artikel wird gefunden. Der interne Fall wird als korrigiert markiert. Genau in diesem Moment hat der physische Artikel den ursprünglichen Empfänger nicht unbedingt erreicht, und der Empfänger weiß nicht unbedingt, wann. Der Prozess ist vorangekommen; das Kundenergebnis bleibt ungewiss. Nichts in dieser Geschichte sagt, dass ein bestimmter Scanner versagte, ein Fahrer zu Unrecht beschuldigt wurde oder ein Kunde die falsche Menge erhielt. Die Gefahr ist die stille Aufblähung eines Etiketts. Das Personal meint vielleicht, die interne Untersuchung sei abgeschlossen. Ein Dashboard zeigt dasselbe Wort, als wäre das Kundenproblem erledigt. Ein Prüfer liest es später als Erfolgsbeweis. Die Abhilfe ist nicht, jedem Status zu misstrauen; sie ist zu definieren, was der Status beweist, was nicht, und welches weitere Ergebnis Bestätigung braucht.") },
            { type: "p", text: x(
              "The author's confirmed operating categories include incomplete orders, missing bags, mixed trolleys, loading exceptions and KPI reviews. The specific sequence above is deliberately invented.",
              "Kategoritë e konfirmuara operacionale të autorit përfshijnë porositë e paplota, çantat që mungojnë, karrocat e përziera, përjashtimet e ngarkimit dhe rishikimet e KPI-ve. Radha e veçantë më sipër është qëllimisht e shpikur.",
              "Die bestätigten Betriebskategorien des Autors umfassen unvollständige Aufträge, fehlende Taschen, gemischte Wagen, Ladeausnahmen und KPI-Reviews. Die konkrete Abfolge oben ist bewusst erfunden.") },
            { type: "callout", reading: true, text: x(
              "A case status is evidence about a workflow stage, not automatic evidence of the customer's outcome.",
              "Një status rasti është provë për një fazë të rrjedhës së punës, jo provë automatike e rezultatit për klientin.",
              "Ein Fallstatus belegt eine Stufe des Arbeitsablaufs, nicht automatisch das Ergebnis für den Kunden.") },
          ],
          note: x(
            "Constructed example from documented last-mile categories; the closure distinction is an editorial framework, not a claim about an employer's system labels. The essay named below reads a scan as a witness, not a judge.",
            "Shembull i ndërtuar nga kategori të dokumentuara të miljes së fundit; dallimi i mbylljes është kuadër editorial, jo pretendim për etiketat e sistemit të ndonjë punëdhënësi. Eseja e emërtuar më poshtë e lexon një skanim si dëshmitar, jo si gjykatës.",
            "Konstruiertes Beispiel aus dokumentierten Last-Mile-Kategorien; die Abschlussunterscheidung ist ein redaktioneller Rahmen, keine Behauptung über die Systemetiketten eines Arbeitgebers. Der unten genannte Essay liest einen Scan als Zeugen, nicht als Richter."),
        },
        {
          id: "iii-concept", layer: "concept",
          title: [x("Three records,", "Tre regjistra,", "Drei Aufzeichnungen,"), x("three different truths", "tri të vërteta të ndryshme", "drei verschiedene Wahrheiten")],
          lead: x(
            "Do not force a single green flag to stand for correction, communication and relationship recovery.",
            "Mos e detyro një flamur të vetëm të gjelbër të përfaqësojë korrigjimin, komunikimin dhe rikuperimin e marrëdhënies.",
            "Zwingen Sie keine einzige grüne Flagge, für Korrektur, Kommunikation und Beziehungswiederherstellung zu stehen."),
          blocks: [
            { type: "p", text: x(
              "The internal ledger should say what happened to the work: investigated, corrected, awaiting external action or formally rejected. A communication ledger should say what the affected person has been told, without pretending that delivery of a message proves acceptance. A customer-outcome ledger should distinguish the reported impact from what has actually been remedied. These are not three bureaucracies; they are three meanings that should be visible in one responsibly designed record. A hotel technician can complete an authorised repair while the next shift still owes an update. A warehouse can prepare a replacement while transport remains pending. A sales team can accept a revised promise while the partner still needs to adjust its own commitments. In every case the first fix is local; the customer consequence crosses the organisational boundary.",
              "Regjistri i brendshëm duhet të thotë çfarë ndodhi me punën: e hetuar, e korrigjuar, në pritje të veprimit të jashtëm ose e refuzuar formalisht. Një regjistër komunikimi duhet të thotë çfarë i është thënë personit të prekur, pa pretenduar se dërgimi i një mesazhi provon pranimin. Një regjistër i rezultatit për klientin duhet ta dallojë ndikimin e raportuar nga ajo që është ndrequr vërtet. Këto nuk janë tri burokraci; janë tri kuptime që duhet të duken në një regjistër të vetëm, të projektuar me përgjegjësi. Një teknik hoteli mund ta përfundojë një riparim të autorizuar, ndërsa turni tjetër ende i detyrohet një përditësim. Një magazinë mund ta përgatisë një zëvendësim, ndërsa transporti mbetet në pritje. Një ekip shitjesh mund ta pranojë një premtim të rishikuar, ndërsa partneri duhet ende t'i përshtatë angazhimet e veta. Në çdo rast ndreqja e parë është lokale; pasoja për klientin e kalon kufirin organizativ.",
              "Das interne Buch sollte sagen, was mit der Arbeit geschah: untersucht, korrigiert, wartet auf externe Maßnahme oder förmlich abgelehnt. Ein Kommunikationsbuch sollte sagen, was der betroffenen Person mitgeteilt wurde, ohne vorzugeben, die Zustellung einer Nachricht beweise ihre Annahme. Ein Kundenergebnisbuch sollte die gemeldete Belastung von dem unterscheiden, was tatsächlich behoben wurde. Das sind keine drei Bürokratien; es sind drei Bedeutungen, die in einer verantwortlich gestalteten Aufzeichnung sichtbar sein sollten. Ein Hoteltechniker kann eine befugte Reparatur abschließen, während die nächste Schicht noch eine Rückmeldung schuldet. Ein Lager kann einen Ersatz vorbereiten, während der Transport aussteht. Ein Verkaufsteam kann ein geändertes Versprechen annehmen, während der Partner seine eigenen Zusagen noch anpassen muss. In jedem Fall ist die erste Behebung örtlich; die Folge für den Kunden überschreitet die Organisationsgrenze.") },
            { type: "cards", cols: 3, items: [
              { h: x("Work state", "Gjendja e punës", "Arbeitsstand"), p: x("What operational step has been completed?", "Cili hap operacional ka përfunduar?", "Welcher betriebliche Schritt ist abgeschlossen?") },
              { h: x("Update state", "Gjendja e përditësimit", "Rückmeldestand"), p: x("What was communicated, and when?", "Çfarë u komunikua, dhe kur?", "Was wurde mitgeteilt, und wann?") },
              { h: x("Customer state", "Gjendja e klientit", "Kundenstand"), p: x("What remedy or residual impact is known?", "Cila zgjidhje ose ndikim i mbetur dihet?", "Welche Abhilfe oder Restbelastung ist bekannt?") },
            ] },
            { type: "p", text: x(
              "Operational systems should use exact state definitions and timestamps; the more handovers, the greater the temptation to collapse progress into one word. Homburg and Fürst (2005) distinguish formal guidelines from an organisational climate that supports complaint handling. Their result is no argument against structure: structure should make responsibility clearer, and employees should have the support to carry it through.",
              "Sistemet operacionale duhet të përdorin përkufizime të sakta gjendjeje dhe vula kohe; sa më shumë dorëzime, aq më i madh tundimi për ta përmbledhur përparimin në një fjalë. Homburg dhe Fürst (2005) i dallojnë udhëzimet formale nga një klimë organizative që e mbështet trajtimin e ankesave. Rezultati i tyre nuk është argument kundër strukturës: struktura duhet ta bëjë përgjegjësinë më të qartë, dhe punonjësit duhet të kenë mbështetjen për ta çuar deri në fund.",
              "Betriebliche Systeme sollten genaue Zustandsdefinitionen und Zeitstempel nutzen; je mehr Übergaben, desto größer die Versuchung, Fortschritt in ein Wort zu pressen. Homburg und Fürst (2005) unterscheiden formelle Richtlinien von einem Organisationsklima, das Beschwerdebearbeitung stützt. Ihr Ergebnis ist kein Argument gegen Struktur: Struktur soll Verantwortung klarer machen, und Beschäftigte sollen die Unterstützung haben, sie durchzutragen.") },
            { type: "callout", reading: true, text: x(
              "One record can show all three dimensions without calling any one of them total closure.",
              "Një regjistër i vetëm mund t'i tregojë të tri dimensionet pa e quajtur asnjërin mbyllje të plotë.",
              "Eine Aufzeichnung kann alle drei Dimensionen zeigen, ohne eine davon vollständigen Abschluss zu nennen.") },
          ],
          note: x(
            "Interpretation based on Homburg and Fürst (2005), Maxham and Netemeyer (2002) and Tax et al. (1998). The three-ledger framework is editorial.",
            "Interpretim i mbështetur te Homburg e Fürst (2005), Maxham e Netemeyer (2002) dhe Tax et al. (1998). Kuadri me tre regjistra është editorial.",
            "Deutung nach Homburg und Fürst (2005), Maxham und Netemeyer (2002) und Tax et al. (1998). Der Rahmen der drei Bücher ist redaktionell."),
          source: ["homburg-furst-2005", "maxham-netemeyer-2002", "tax-brown-chandrashekaran-1998"],
        },
        {
          id: "iii-model", layer: "concept",
          title: [x("Forty cases", "Dyzet raste", "Vierzig Fälle,"), x("marked closed", "të shënuara të mbyllura", "als geschlossen markiert")],
          lead: x(
            "A fully synthetic cohort shows what one green label can hide when three records collapse into one.",
            "Një grup krejt sintetik tregon çfarë mund të fshehë një etiketë e gjelbër kur tre regjistra shkrihen në një.",
            "Eine synthetische Kohorte zeigt, was ein grünes Etikett verbirgt, wenn drei Aufzeichnungen zu einer verschmelzen."),
          blocks: [
            { type: "flag", text: synthetic },
            { type: "hbars", max: 40, hypothetical: true,
              label: x("Invented cohort of 40 cases, all shown as closed", "Grup i shpikur prej 40 rastesh, të gjitha të shfaqura si të mbyllura", "Erfundene Kohorte von 40 Fällen, alle als geschlossen angezeigt"),
              items: [
                { k: x("Marked closed", "Të shënuara të mbyllura", "Als geschlossen markiert"), v: 40, n: "40" },
                { k: x("Work corrected, evidenced", "Puna e korrigjuar, me prova", "Arbeit korrigiert, belegt"), v: 36, n: "36" },
                { k: x("Customer updated", "Klienti i përditësuar", "Kunde informiert"), v: 28, n: "28" },
                { k: x("Update confirmed received", "Përditësimi i konfirmuar", "Empfang bestätigt"), v: 19, n: "19" },
                { k: x("Remedy verified at customer", "Zgjidhja e verifikuar te klienti", "Abhilfe beim Kunden geprüft"), v: 14, n: "14", alert: true },
                { k: x("Residual impact recorded", "Ndikimi i mbetur i shënuar", "Restbelastung erfasst"), v: 6, n: "6" },
              ] },
            { type: "p", text: x(
              "Every count is invented so the arithmetic can be followed. The dashboard shows forty closures; the work ledger supports thirty-six. Twenty-eight customers were told something and nineteen confirmed receipt. Fourteen remedies are verified, and only six records say what inconvenience remained. None of this proves the other cases went badly: some customers decline contact, some remedies cannot be verified. It shows which claim each number supports, and that “closed” carried five meanings at once.",
              "Çdo numër është i shpikur, që llogaria të ndiqet. Paneli tregon dyzet mbyllje; regjistri i punës mbështet tridhjetë e gjashtë. Njëzet e tetë klientëve iu tha diçka dhe nëntëmbëdhjetë e konfirmuan marrjen. Katërmbëdhjetë zgjidhje janë verifikuar, dhe vetëm gjashtë regjistrime thonë çfarë shqetësimi mbeti. Asgjë nga këto nuk provon se rastet e tjera shkuan keq: disa klientë e refuzojnë kontaktin, disa zgjidhje nuk verifikohen dot. Tregon cilin pohim e mbështet secili numër, dhe se “e mbyllur” mbante pesë kuptime njëherësh.",
              "Jede Zahl ist erfunden, damit die Rechnung nachvollziehbar ist. Das Dashboard zeigt vierzig Abschlüsse; das Arbeitsbuch stützt sechsunddreißig. Achtundzwanzig Kunden wurde etwas mitgeteilt, neunzehn bestätigten den Empfang. Vierzehn Abhilfen sind geprüft, und nur sechs Aufzeichnungen sagen, welche Unannehmlichkeit blieb. Nichts davon beweist, dass die anderen Fälle schlecht liefen: Manche lehnen Kontakt ab, manche Abhilfen sind nicht prüfbar. Es zeigt, welche Behauptung jede Zahl trägt, und dass „geschlossen“ fünf Bedeutungen trug.") },
            { type: "callout", reading: true, text: x(
              "Count closures by what they prove. A single total hides the ledger that is weakest.",
              "Numëroji mbylljet sipas asaj që provojnë. Një total i vetëm e fsheh regjistrin më të dobët.",
              "Abschlüsse nach dem zählen, was sie beweisen; eine Summe verbirgt das schwächste Buch.") },
          ],
          note: x(
            "Every value on this page is synthetic, authored for this volume; the three ledgers follow the previous page. The author's PDF describes the inflation of the label without counting it.",
            "Çdo vlerë në këtë faqe është sintetike, e shkruar për këtë vëllim; tre regjistrat ndjekin faqen e mëparshme. PDF-ja e autorit e përshkruan fryrjen e etiketës pa e numëruar.",
            "Jeder Wert ist synthetisch, für diesen Band verfasst; die drei Bücher folgen der vorigen Seite. Das PDF beschreibt die Aufblähung des Etiketts, ohne sie zu zählen."),
          source: ["homburg-furst-2005"],
        },
        {
          id: "iii-evidence", layer: "concept",
          title: [x("Perceptions change", "Perceptimet ndryshojnë", "Wahrnehmungen ändern sich"), x("over time", "me kohën", "mit der Zeit")],
          lead: x(
            "Measuring a complaint immediately after a reply is not the same as understanding the relationship after recovery.",
            "Matja e një ankese menjëherë pas një përgjigjeje nuk është njësoj si kuptimi i marrëdhënies pas rikuperimit.",
            "Eine Beschwerde unmittelbar nach einer Antwort zu messen ist nicht dasselbe wie die Beziehung nach der Wiedergutmachung zu verstehen."),
          blocks: [
            { type: "p", text: x(
              "Maxham and Netemeyer (2002) conducted two field studies of customers' perceptions of complaint handling over time. One followed customers who had complained to a bank for the first time, with questionnaires after the failure, after the recovery and about two weeks later; the other surveyed customers of a home-construction firm after a first product failure and recovery attempt. Their model related perceptions of fairness to satisfaction with recovery, overall firm satisfaction and future intentions. Satisfaction with recovery was a stronger predictor of positive word-of-mouth intention than overall firm satisfaction, whereas overall firm satisfaction was a stronger predictor of purchase intention. The customer can respond favourably to one recovery effort while holding a separate view about continuing the relationship; a prediction of intention is not a verified future purchase.",
              "Maxham dhe Netemeyer (2002) kryen dy studime në terren për perceptimet e klientëve mbi trajtimin e ankesave me kalimin e kohës. Njëri ndoqi klientë që ishin ankuar për herë të parë në një bankë, me pyetësorë pas dështimit, pas rikuperimit dhe rreth dy javë më vonë; tjetri anketoi klientë të një firme ndërtimi shtëpish pas një dështimi të parë produkti dhe një përpjekjeje rikuperimi. Modeli i tyre i lidhte perceptimet e drejtësisë me kënaqësinë nga rikuperimi, kënaqësinë e përgjithshme me firmën dhe qëllimet e ardhshme. Kënaqësia nga rikuperimi ishte parashikues më i fortë i qëllimit për fjalë gojore pozitive se kënaqësia e përgjithshme me firmën, ndërsa kënaqësia e përgjithshme me firmën ishte parashikues më i fortë i qëllimit për blerje. Klienti mund t'i përgjigjet mirë një përpjekjeje rikuperimi dhe të mbajë një pikëpamje më vete për vazhdimin e marrëdhënies; parashikimi i një qëllimi nuk është blerje e ardhshme e verifikuar.",
              "Maxham und Netemeyer (2002) führten zwei Feldstudien zu den Wahrnehmungen der Beschwerdebearbeitung im Zeitverlauf durch. Eine folgte Kunden, die sich zum ersten Mal bei einer Bank beschwert hatten, mit Fragebögen nach dem Fehler, nach der Wiedergutmachung und etwa zwei Wochen später; die andere befragte Kunden eines Hausbauunternehmens nach einem ersten Produktfehler und Wiedergutmachungsversuch. Ihr Modell verband Fairnesswahrnehmungen mit Zufriedenheit mit der Wiedergutmachung, Gesamtzufriedenheit mit dem Unternehmen und künftigen Absichten. Zufriedenheit mit der Wiedergutmachung sagte positive Mundpropaganda stärker voraus als die Gesamtzufriedenheit, während die Gesamtzufriedenheit die Kaufabsicht stärker voraussagte. Ein Kunde kann auf eine Wiedergutmachung positiv reagieren und zugleich eine eigene Sicht auf die Fortsetzung der Beziehung haben; eine vorhergesagte Absicht ist kein geprüfter künftiger Kauf.") },
            { type: "chain", items: [
              { h: x("Failure", "Dështimi", "Fehler"), p: x("What was experienced?", "Çfarë u përjetua?", "Was wurde erlebt?") },
              { h: x("Response", "Përgjigjja", "Antwort"), p: x("How was it handled?", "Si u trajtua?", "Wie wurde es behandelt?") },
              { h: x("Afterward", "Më pas", "Danach"), p: x("Did the remedy hold?", "A qëndroi zgjidhja?", "Hielt die Abhilfe?") },
              { h: x("Relationship", "Marrëdhënia", "Beziehung"), p: x("What changed in trust or intent?", "Çfarë ndryshoi në besim ose qëllim?", "Was änderte sich an Vertrauen oder Absicht?") },
            ] },
            { type: "p", text: x(
              "Timing matters for operations too. Immediate feedback captures the experience of receiving an answer. A later check, where appropriate and permitted, can ask whether the remedy held or the problem returned. Neither is a mandate to contact every customer repeatedly: consent, local policy and communication fatigue set real constraints.",
              "Koha ka rëndësi edhe për operacionet. Reagimi i menjëhershëm kap përvojën e marrjes së një përgjigjeje. Një kontroll i mëvonshëm, ku është e përshtatshme dhe e lejuar, mund të pyesë nëse zgjidhja qëndroi apo problemi u kthye. Asnjëri nuk është mandat për ta kontaktuar çdo klient vazhdimisht: pëlqimi, politika lokale dhe lodhja nga komunikimi vendosin kufij të vërtetë.",
              "Der Zeitpunkt zählt auch für den Betrieb. Sofortige Rückmeldung erfasst das Erlebnis, eine Antwort zu erhalten. Eine spätere Prüfung, wo angemessen und erlaubt, kann fragen, ob die Abhilfe hielt oder das Problem zurückkam. Keines ist ein Auftrag, jeden Kunden wiederholt zu kontaktieren: Einwilligung, örtliche Regeln und Kommunikationsmüdigkeit setzen echte Grenzen.") },
            { type: "callout", reading: true, text: x(
              "Satisfaction with complaint handling and future purchase intention are distinct outcomes and may change at different times.",
              "Kënaqësia me trajtimin e ankesës dhe qëllimi i ardhshëm për blerje janë rezultate të dallueshme dhe mund të ndryshojnë në kohë të ndryshme.",
              "Zufriedenheit mit der Beschwerdebearbeitung und künftige Kaufabsicht sind verschiedene Ergebnisse und können sich zu verschiedenen Zeiten ändern.") },
          ],
          note: x(
            "Maxham and Netemeyer, Journal of Retailing 78(4), 239–252 (2002), two field studies. No longitudinal measurement is claimed for the author's workplaces.",
            "Maxham e Netemeyer, Journal of Retailing 78(4), 239–252 (2002), dy studime në terren. Nuk pretendohet asnjë matje gjatësore për vendet e punës së autorit.",
            "Maxham und Netemeyer, Journal of Retailing 78(4), 239–252 (2002), zwei Feldstudien. Keine Längsschnittmessung wird für die Arbeitsplätze des Autors behauptet."),
          source: ["maxham-netemeyer-2002"],
        },
        {
          id: "iii-protocol", layer: "protocol",
          title: [x("Design a", "Projekto një mbyllje", "Einen zweistufigen"), x("two-stage closeout", "me dy faza", "Abschluss gestalten")],
          lead: x(
            "Close the local task when it is finished. Close the customer-impact question only when its status is known.",
            "Mbylle detyrën lokale kur ka mbaruar. Mbylle pyetjen e ndikimit te klienti vetëm kur statusi i saj dihet.",
            "Die örtliche Aufgabe schließen, wenn sie erledigt ist; die Frage der Kundenbelastung erst, wenn ihr Stand bekannt ist."),
          blocks: [
            { type: "steps", items: [
              { h: x("Confirm the technical disposition", "Konfirmo gjendjen teknike", "Den technischen Stand bestätigen"), p: x("The action completed and its evidence, or the case marked as still pending.", "Veprimi i përfunduar dhe prova e tij, ose rasti i shënuar si ende në pritje.", "Die erledigte Maßnahme und ihr Beleg, oder der Fall als noch offen markiert.") },
              { h: x("Record the receiving owner", "Shëno përgjegjësin që e merr", "Die empfangende Verantwortliche festhalten"), p: x("The role responsible for the next customer-visible step.", "Roli përgjegjës për hapin e radhës të dukshëm për klientin.", "Die Rolle für den nächsten für den Kunden sichtbaren Schritt.") },
              { h: x("Separate notification from consent", "Ndaje njoftimin nga pëlqimi", "Benachrichtigung von Zustimmung trennen"), p: x("An authorised update sent is not approval or satisfaction.", "Një përditësim i autorizuar i dërguar nuk është miratim apo kënaqësi.", "Eine gesendete befugte Rückmeldung ist keine Zustimmung und keine Zufriedenheit.") },
              { h: x("Verify outcome proportionately", "Verifiko rezultatin në përpjesëtim", "Das Ergebnis verhältnismäßig prüfen"), p: x("The promised remedy, checked with an appropriate evidence source and privacy safeguards.", "Zgjidhja e premtuar, e kontrolluar me burim të përshtatshëm prove dhe mbrojtje privatësie.", "Die zugesagte Abhilfe, geprüft mit einer passenden Belegquelle und Datenschutz.") },
              { h: x("Describe the residual impact", "Përshkruaj ndikimin e mbetur", "Die Restbelastung beschreiben"), p: x("If full restoration is impossible, what remains and the approved next response.", "Nëse rikthimi i plotë është i pamundur, çfarë mbetet dhe përgjigjja e radhës.", "Ist volle Wiederherstellung unmöglich, was bleibt und die genehmigte nächste Antwort.") },
              { h: x("Retain the learning signal", "Ruaje sinjalin e të mësuarit", "Das Lernsignal bewahren"), p: x("The underlying category and recurrence marker, linked to improvement without exposing identities.", "Kategoria themelore dhe shënuesi i përsëritjes, të lidhura me përmirësimin, pa identitete.", "Kategorie und Wiederholungsmarker, mit Verbesserung verknüpft, ohne Identitäten.") },
            ] },
            { type: "p", text: x(
              "A pilot can compare anonymised case records with the language in use today: count unsupported closure claims, missing handover information and promised updates that did not occur, with the denominator defined first. Unknown customer responses stay unknown. Do not keep cases open indefinitely: each task needs a stable completion definition, with remaining customer impact shown separately and assigned to a responsible next step.",
              "Një pilot mund t'i krahasojë regjistrat anonime me gjuhën e sotme: numëro pretendimet e pambështetura të mbylljes, informacionin që mungon te dorëzimi dhe përditësimet e premtuara që nuk ndodhën, me emëruesin të përkufizuar së pari. Përgjigjet e panjohura mbeten të panjohura. Mos i mbaj rastet të hapura pafundësisht: çdo detyrë ka nevojë për përkufizim të qëndrueshëm përfundimi, me ndikimin e mbetur te klienti të treguar veçmas dhe të caktuar për hapin e radhës.",
              "Ein Pilot kann anonymisierte Aufzeichnungen mit der heutigen Sprache vergleichen: unbelegte Abschlussbehauptungen, fehlende Übergabeinformation und ausgebliebene Rückmeldungen zählen, mit zuerst definiertem Nenner. Unbekannte Kundenreaktionen bleiben unbekannt. Fälle nicht endlos offen halten: Jede Aufgabe braucht eine stabile Abschlussdefinition, mit getrennt gezeigter Restbelastung und einem verantwortlichen nächsten Schritt.") },
            { type: "callout", reading: true, text: x(
              "It is legitimate to close a task and still say that the customer outcome has not yet been verified.",
              "Është legjitime ta mbyllësh një detyrë dhe prapë të thuash se rezultati për klientin nuk është verifikuar ende.",
              "Es ist legitim, eine Aufgabe zu schließen und trotzdem zu sagen, dass das Kundenergebnis noch nicht geprüft ist.") },
          ],
          note: x(
            "Original two-stage closeout model, informed by Maxham and Netemeyer (2002), Tax et al. (1998) and Homburg and Fürst (2005).",
            "Model origjinal mbylljeje me dy faza, i mbështetur te Maxham e Netemeyer (2002), Tax et al. (1998) dhe Homburg e Fürst (2005).",
            "Eigenes zweistufiges Abschlussmodell nach Maxham und Netemeyer (2002), Tax et al. (1998) und Homburg und Fürst (2005)."),
          source: ["maxham-netemeyer-2002", "tax-brown-chandrashekaran-1998", "homburg-furst-2005"],
        },
      ],
    },

    // Chapter IV. The recovery paradox
    {
      id: "ch-iv", type: "chapter", numeral: "IV",
      title: x("The recovery paradox", "Paradoksi i rikuperimit", "Das Wiedergutmachungsparadox"),
      pages: [
        {
          id: "iv-scene", layer: "scene", more: "a-bad-day-or-a-problem",
          title: [x("The customer", "Klienti", "Der Kunde,"), x("who did not return", "që nuk u kthye", "der nicht zurückkam")],
          lead: x(
            "A grateful response to a remedy does not guarantee a decision to use the service again.",
            "Një përgjigje mirënjohëse ndaj një zgjidhjeje nuk e garanton vendimin për ta përdorur sërish shërbimin.",
            "Eine dankbare Reaktion auf eine Abhilfe garantiert keine Entscheidung, den Service wieder zu nutzen."),
          blocks: [
            { type: "flag", text: x("Constructed customer scene, not an observed retention outcome", "Skenë e ndërtuar klienti, jo rezultat i vëzhguar mbajtjeje", "Konstruierte Kundenszene, kein beobachtetes Bindungsergebnis") },
            { type: "p", text: x(
              "A delivery arrives late. The provider responds rapidly, accepts its part of the problem and makes an authorised correction. The customer thanks the service team for handling it well. Internally, the incident becomes an example of excellent recovery. Weeks later, in the invented scene, the customer chooses another provider for a future order. The recovery interaction went well; the next purchase did not follow. The opposite story is also possible: a person may have a poor service experience, accept an adequate remedy and remain a customer. Neither narrative, by itself, proves a paradox. The service-recovery paradox is a more specific research claim: in some circumstances, a customer who experiences a failure followed by a strong recovery may report greater satisfaction than one who had no failure. Evidence about that comparison has been inconsistent across studies.",
              "Një dorëzim mbërrin me vonesë. Ofruesi përgjigjet shpejt, e pranon pjesën e vet të problemit dhe bën një korrigjim të autorizuar. Klienti e falënderon ekipin e shërbimit që e trajtoi mirë. Brenda, ngjarja bëhet shembull rikuperimi të shkëlqyer. Javë më vonë, në skenën e shpikur, klienti zgjedh një ofrues tjetër për një porosi të ardhshme. Ndërveprimi i rikuperimit shkoi mirë; blerja e radhës nuk pasoi. Edhe historia e kundërt është e mundur: një person mund të ketë një përvojë të keqe shërbimi, të pranojë një zgjidhje të mjaftueshme dhe të mbetet klient. Asnjëri rrëfim, më vete, nuk provon një paradoks. Paradoksi i rikuperimit të shërbimit është pretendim kërkimor më i veçantë: në disa rrethana, një klient që përjeton një dështim të ndjekur nga një rikuperim i fortë mund të raportojë kënaqësi më të madhe se një klient pa dështim. Prova për atë krahasim ka qenë e paqëndrueshme nëpër studime.",
              "Eine Zustellung kommt verspätet. Der Anbieter reagiert rasch, übernimmt seinen Teil des Problems und nimmt eine befugte Korrektur vor. Der Kunde dankt dem Serviceteam für die gute Abwicklung. Intern wird der Vorfall zum Beispiel hervorragender Wiedergutmachung. Wochen später, in der erfundenen Szene, wählt der Kunde für einen künftigen Auftrag einen anderen Anbieter. Die Wiedergutmachung lief gut; der nächste Kauf folgte nicht. Die umgekehrte Geschichte ist ebenso möglich: Jemand erlebt schlechten Service, nimmt eine angemessene Abhilfe an und bleibt Kunde. Keine der beiden Erzählungen beweist für sich ein Paradox. Das Wiedergutmachungsparadox ist eine speziellere Forschungsbehauptung: Unter manchen Umständen berichtet ein Kunde, der einen Fehler mit starker Wiedergutmachung erlebt, höhere Zufriedenheit als einer ohne Fehler. Die Belege zu diesem Vergleich waren über die Studien hinweg uneinheitlich.") },
            { type: "p", text: x(
              "This scene is not based on a documented customer record from the author's work. It shows why managers should not infer loyalty from a thank-you, infer satisfaction from the absence of a complaint, or celebrate a failure as an opportunity to impress. The responsible objective is to prevent avoidable failure and respond well when it occurs.",
              "Kjo skenë nuk mbështetet në ndonjë regjistër të dokumentuar klienti nga puna e autorit. Tregon pse menaxherët nuk duhet të nxjerrin besnikëri nga një falënderim, kënaqësi nga mungesa e ankesës, apo ta festojnë një dështim si mundësi për t'u bërë përshtypje. Objektivi i përgjegjshëm është parandalimi i dështimit të shmangshëm dhe përgjigjja e mirë kur ai ndodh.",
              "Diese Szene beruht auf keiner dokumentierten Kundenaufzeichnung aus der Arbeit des Autors. Sie zeigt, warum Führungskräfte Loyalität nicht aus einem Dank, Zufriedenheit nicht aus dem Fehlen einer Beschwerde folgern und einen Fehler nicht als Chance zum Beeindrucken feiern sollten. Das verantwortliche Ziel ist, vermeidbare Fehler zu verhindern und gut zu reagieren, wenn sie geschehen.") },
            { type: "callout", reading: true, text: x(
              "Recovery should not be designed as a marketing opportunity to create failures. Prevention remains the better promise.",
              "Rikuperimi nuk duhet projektuar si mundësi marketingu për të krijuar dështime. Parandalimi mbetet premtimi më i mirë.",
              "Wiedergutmachung sollte nicht als Marketingchance zum Erzeugen von Fehlern gestaltet werden. Prävention bleibt das bessere Versprechen.") },
          ],
          note: x(
            "Constructed illustration informed by de Matos, Henrique and Rossi (2007); no retention, review or loyalty outcome is attributed to the author. The essay named below asks whether one case is a bad day or a problem.",
            "Ilustrim i ndërtuar i mbështetur te de Matos, Henrique e Rossi (2007); asnjë rezultat mbajtjeje, vlerësimi apo besnikërie nuk i atribuohet autorit. Eseja e emërtuar më poshtë pyet nëse një rast është ditë e keqe apo problem.",
            "Konstruierte Illustration nach de Matos, Henrique und Rossi (2007); kein Bindungs-, Bewertungs- oder Loyalitätsergebnis wird dem Autor zugeschrieben. Der unten genannte Essay fragt, ob ein Fall ein schlechter Tag oder ein Problem ist."),
          source: ["de-matos-2007"],
        },
        {
          id: "iv-concept", layer: "concept",
          title: [x("Satisfaction is", "Kënaqësia nuk është", "Zufriedenheit ist"), x("not loyalty", "besnikëri", "nicht Loyalität")],
          lead: x(
            "Managers often join distinct psychological and behavioural outcomes into a single word: recovered.",
            "Menaxherët shpesh i bashkojnë rezultate të dallueshme psikologjike dhe të sjelljes në një fjalë të vetme: i rikuperuar.",
            "Führungskräfte fassen verschiedene psychologische und verhaltensbezogene Ergebnisse oft in einem Wort zusammen: wiederhergestellt."),
          blocks: [
            { type: "p", text: x(
              "After a complaint, several questions may have different answers. Was the person satisfied with the immediate handling? Are they satisfied with the company overall? Do they intend to buy again? Do they actually return? Would they recommend the company? These are not interchangeable dependent variables, and the recovery paradox depends on which outcome is compared with which baseline. A thoughtful apology may lower anger even when the physical consequence cannot be removed. A fair replacement may settle a transaction without rebuilding confidence in delivery reliability. A durable correction may reduce future risk without generating positive word of mouth. None of this makes the recovery useless; it means the organisation must describe the result it actually achieved.",
              "Pas një ankese, disa pyetje mund të kenë përgjigje të ndryshme. A ishte personi i kënaqur me trajtimin e menjëhershëm? A është i kënaqur me kompaninë në përgjithësi? A synon të blejë sërish? A kthehet vërtet? A do ta rekomandonte kompaninë? Këto nuk janë variabla të varura të këmbyeshme, dhe paradoksi i rikuperimit varet nga cili rezultat krahasohet me cilën bazë. Një falje e menduar mund ta ulë zemërimin edhe kur pasoja fizike nuk hiqet dot. Një zëvendësim i drejtë mund ta mbyllë një transaksion pa e rindërtuar besimin te besueshmëria e dorëzimit. Një korrigjim i qëndrueshëm mund ta ulë rrezikun e ardhshëm pa gjeneruar fjalë gojore pozitive. Asgjë nga këto nuk e bën rikuperimin të padobishëm; do të thotë se organizata duhet ta përshkruajë rezultatin që arriti vërtet.",
              "Nach einer Beschwerde können mehrere Fragen verschiedene Antworten haben. War die Person mit der sofortigen Bearbeitung zufrieden? Ist sie mit dem Unternehmen insgesamt zufrieden? Will sie wieder kaufen? Kommt sie tatsächlich zurück? Würde sie das Unternehmen empfehlen? Das sind keine austauschbaren abhängigen Variablen, und das Paradox hängt davon ab, welches Ergebnis mit welcher Grundlinie verglichen wird. Eine überlegte Entschuldigung kann Ärger senken, auch wenn die physische Folge nicht zu beseitigen ist. Ein fairer Ersatz kann eine Transaktion abschließen, ohne das Vertrauen in die Lieferzuverlässigkeit wiederherzustellen. Eine dauerhafte Korrektur kann künftiges Risiko senken, ohne positive Mundpropaganda zu erzeugen. Nichts davon macht die Wiedergutmachung nutzlos; es heißt, die Organisation muss das Ergebnis beschreiben, das sie wirklich erreichte.") },
            { type: "rows", compact: true, items: [
              { h: x("Complaint satisfaction", "Kënaqësia me ankesën", "Beschwerdezufriedenheit"), p: x("How did the person evaluate the handling of this specific issue?", "Si e vlerësoi personi trajtimin e kësaj çështjeje të veçantë?", "Wie bewertete die Person die Bearbeitung dieses konkreten Anliegens?") },
              { h: x("Firm satisfaction", "Kënaqësia me firmën", "Unternehmenszufriedenheit"), p: x("How does the person view the provider overall?", "Si e sheh personi ofruesin në përgjithësi?", "Wie sieht die Person den Anbieter insgesamt?") },
              { h: x("Return intention", "Qëllimi për t'u kthyer", "Wiederkehrabsicht"), p: x("Does the person say they might use the service again?", "A thotë personi se mund ta përdorë sërish shërbimin?", "Sagt die Person, sie könnte den Service wieder nutzen?") },
              { h: x("Actual behaviour", "Sjellja e vërtetë", "Tatsächliches Verhalten"), p: x("Is there later observable activity, measured ethically and with valid attribution?", "A ka veprimtari të mëvonshme të vëzhgueshme, të matur etikisht dhe me atribuim të vlefshëm?", "Gibt es spätere beobachtbare Aktivität, ethisch gemessen und gültig zugeordnet?") },
            ] },
            { type: "p", text: x(
              "There is also a selection problem in ordinary reports. People who complain are a visible subset of those affected; unreported failures never enter the recovery queue, and retained customers do not reveal why they stayed. Without defined denominators and a comparison, a percentage of satisfied complainants cannot tell us the recovery effect on the whole customer base.",
              "Ka edhe një problem përzgjedhjeje në raportet e zakonshme. Njerëzit që ankohen janë një nëngrup i dukshëm i të prekurve; dështimet e paraportuara nuk hyjnë kurrë në radhën e rikuperimit, dhe klientët e mbajtur nuk e tregojnë pse qëndruan. Pa emërues të përkufizuar dhe pa krahasim, një përqindje ankuesish të kënaqur nuk na thotë dot efektin e rikuperimit mbi gjithë bazën e klientëve.",
              "Es gibt auch ein Auswahlproblem in gewöhnlichen Berichten. Wer sich beschwert, ist eine sichtbare Teilmenge der Betroffenen; ungemeldete Fehler gelangen nie in die Wiedergutmachungsliste, und gebliebene Kunden verraten nicht, warum sie blieben. Ohne definierte Nenner und einen Vergleich kann ein Prozentsatz zufriedener Beschwerdeführer nichts über die Wirkung auf die gesamte Kundschaft sagen.") },
            { type: "callout", reading: true, text: x(
              "Reporting should name the specific outcome rather than hide all outcomes under the word recovery.",
              "Raportimi duhet ta emërtojë rezultatin e veçantë, në vend që t'i fshehë të gjitha rezultatet nën fjalën rikuperim.",
              "Berichte sollten das konkrete Ergebnis benennen, statt alle Ergebnisse unter dem Wort Wiedergutmachung zu verbergen.") },
          ],
          note: x(
            "Definitions and research interpretation after de Matos et al. (2007) and Maxham and Netemeyer (2002). Loyalty is a longer-horizon outcome, not a sticker granted at case closure.",
            "Përkufizime dhe interpretim kërkimor sipas de Matos et al. (2007) dhe Maxham e Netemeyer (2002). Besnikëria është rezultat me horizont më të gjatë, jo ngjitëse e dhënë në mbylljen e rastit.",
            "Definitionen und Forschungsdeutung nach de Matos et al. (2007) und Maxham und Netemeyer (2002). Loyalität ist ein Ergebnis mit längerem Horizont, kein Aufkleber beim Fallabschluss."),
          source: ["de-matos-2007", "maxham-netemeyer-2002"],
        },
        {
          id: "iv-evidence", layer: "concept",
          title: [x("A paradox", "Një paradoks", "Ein Paradox"), x("with limits", "me kufij", "mit Grenzen")],
          lead: x(
            "The often-repeated claim that a complaint can create greater loyalty needs a serious qualification.",
            "Pretendimi i përsëritur shpesh se një ankesë mund të krijojë besnikëri më të madhe ka nevojë për një kufizim serioz.",
            "Die oft wiederholte Behauptung, eine Beschwerde könne größere Loyalität schaffen, braucht eine ernste Einschränkung."),
          blocks: [
            { type: "p", text: x(
              "De Matos, Henrique and Rossi (2007) performed a meta-analysis of the service-recovery paradox, an effect with mixed results in individual studies. Their cumulative mean effect was positive and statistically significant for satisfaction. It was not statistically significant, on average, for repurchase intention, word of mouth or corporate image. Research design, type of respondent and service category influenced the satisfaction effect. These findings do not imply that every successful recovery lifts satisfaction above a no-failure baseline, nor that the true effect on future behaviour is exactly zero: a nonsignificant average is evidence of uncertainty about a general effect, not proof that no context can ever show one. A memorable apology cannot be assumed to erase operational risk or restore a commercial relationship.",
              "De Matos, Henrique dhe Rossi (2007) kryen një meta-analizë të paradoksit të rikuperimit të shërbimit, një efekt me rezultate të përziera në studimet e veçanta. Efekti i tyre mesatar kumulativ ishte pozitiv dhe statistikisht domethënës për kënaqësinë. Nuk ishte statistikisht domethënës, mesatarisht, për qëllimin e riblerjes, fjalën gojore apo imazhin e kompanisë. Projektimi i kërkimit, lloji i të anketuarit dhe kategoria e shërbimit ndikuan te efekti mbi kënaqësinë. Këto gjetje nuk nënkuptojnë se çdo rikuperim i suksesshëm e ngre kënaqësinë mbi bazën pa dështim, as se efekti i vërtetë mbi sjelljen e ardhshme është saktësisht zero: një mesatare jodomethënëse është provë pasigurie për një efekt të përgjithshëm, jo provë se asnjë kontekst nuk mund ta tregojë kurrë. Një falje e paharrueshme nuk mund të supozohet se e fshin rrezikun operacional apo e rikthen një marrëdhënie tregtare.",
              "De Matos, Henrique und Rossi (2007) metaanalysierten das Wiedergutmachungsparadox, einen Effekt mit gemischten Ergebnissen in Einzelstudien. Ihr kumulierter mittlerer Effekt war positiv und statistisch signifikant für Zufriedenheit. Für Wiederkaufabsicht, Mundpropaganda und Unternehmensimage war er im Mittel nicht signifikant. Forschungsdesign, Art der Befragten und Servicekategorie beeinflussten den Zufriedenheitseffekt. Diese Befunde bedeuten nicht, dass jede gelungene Wiedergutmachung die Zufriedenheit über die fehlerfreie Grundlinie hebt, noch dass der wahre Effekt auf künftiges Verhalten genau null ist: Ein nicht signifikanter Mittelwert belegt Unsicherheit über einen allgemeinen Effekt, nicht, dass kein Kontext je einen zeigen kann. Eine einprägsame Entschuldigung tilgt nicht von selbst betriebliches Risiko oder stellt eine Geschäftsbeziehung wieder her.") },
            { type: "rows", compact: true, label: x("Four outcomes in the 2007 meta-analysis", "Katër rezultate në meta-analizën e vitit 2007", "Vier Ergebnisse in der Metaanalyse von 2007"), items: [
              { h: x("Satisfaction", "Kënaqësia", "Zufriedenheit"), p: x("Positive average effect.", "Efekt mesatar pozitiv.", "Positiver mittlerer Effekt.") },
              { h: x("Repurchase intention", "Qëllimi i riblerjes", "Wiederkaufabsicht"), p: x("No statistically significant average effect reported.", "Nuk raportohet efekt mesatar statistikisht domethënës.", "Kein statistisch signifikanter mittlerer Effekt berichtet.") },
              { h: x("Word of mouth", "Fjala gojore", "Mundpropaganda"), p: x("No statistically significant average effect reported.", "Nuk raportohet efekt mesatar statistikisht domethënës.", "Kein statistisch signifikanter mittlerer Effekt berichtet.") },
              { h: x("Corporate image", "Imazhi i kompanisë", "Unternehmensimage"), p: x("No statistically significant average effect reported.", "Nuk raportohet efekt mesatar statistikisht domethënës.", "Kein statistisch signifikanter mittlerer Effekt berichtet.") },
            ] },
            { type: "p", text: x(
              "Hart, Heskett and Sasser (1990) made a managerial case for recovering from inevitable service mistakes. That article is useful as guidance and should not be treated as the meta-analytic evidence itself: compelling management cases and generalisable empirical estimates are different things.",
              "Hart, Heskett dhe Sasser (1990) bënë një argument menaxherial për rikuperimin nga gabimet e pashmangshme të shërbimit. Ai artikull është i dobishëm si udhëzim dhe nuk duhet trajtuar si vetë prova meta-analitike: rastet bindëse menaxheriale dhe vlerësimet empirike të përgjithësueshme janë gjëra të ndryshme.",
              "Hart, Heskett und Sasser (1990) führten ein Führungsargument für die Wiedergutmachung unvermeidlicher Servicefehler. Dieser Artikel ist als Anleitung nützlich und sollte nicht als der metaanalytische Beleg selbst gelten: überzeugende Führungsfälle und verallgemeinerbare empirische Schätzungen sind verschiedene Dinge.") },
            { type: "callout", reading: true, text: x(
              "Evidence for a satisfaction paradox is not evidence for a universal loyalty paradox.",
              "Prova për një paradoks kënaqësie nuk është provë për një paradoks universal besnikërie.",
              "Ein Beleg für ein Zufriedenheitsparadox ist kein Beleg für ein universelles Loyalitätsparadox.") },
          ],
          note: x(
            "De Matos, Henrique and Rossi (2007), Journal of Service Research 10(1), 60–77; Hart, Heskett and Sasser (1990). The significance labels are qualitative summaries from the paper, not invented effect sizes.",
            "De Matos, Henrique e Rossi (2007), Journal of Service Research 10(1), 60–77; Hart, Heskett e Sasser (1990). Etiketat e domethënies janë përmbledhje cilësore nga punimi, jo madhësi efekti të shpikura.",
            "De Matos, Henrique und Rossi (2007), Journal of Service Research 10(1), 60–77; Hart, Heskett und Sasser (1990). Die Signifikanzetiketten sind qualitative Zusammenfassungen aus dem Aufsatz, keine erfundenen Effektstärken."),
          source: ["de-matos-2007", "hart-heskett-sasser-1990"],
        },
        {
          id: "iv-protocol", layer: "protocol",
          title: [x("Measure what", "Mat çfarë ndryshoi", "Messen, was Wiedergutmachung"), x("recovery really changed", "vërtet rikuperimi", "wirklich änderte")],
          lead: x(
            "A practical evaluation separates incident quality, response quality and later relationship outcomes.",
            "Një vlerësim praktik e ndan cilësinë e ngjarjes, cilësinë e përgjigjes dhe rezultatet e mëvonshme të marrëdhënies.",
            "Eine praktische Bewertung trennt Vorfallqualität, Antwortqualität und spätere Beziehungsergebnisse."),
          blocks: [
            { type: "steps", items: [
              { h: x("State the comparison", "Thuaj krahasimin", "Den Vergleich benennen"), p: x("Like customer groups or incidents, not only cases that received positive feedback.", "Grupe klientësh ose ngjarje të ngjashme, jo vetëm rastet që morën reagim pozitiv.", "Vergleichbare Kundengruppen oder Vorfälle, nicht nur Fälle mit positiver Rückmeldung.") },
              { h: x("Record recovery effort", "Shëno mundimin e rikuperimit", "Den Wiedergutmachungsaufwand festhalten"), p: x("What was actually repaired, communicated and verified?", "Çfarë u riparua, u komunikua dhe u verifikua vërtet?", "Was wurde tatsächlich repariert, mitgeteilt und geprüft?") },
              { h: x("Define immediate outcomes", "Përkufizo rezultatet e menjëhershme", "Sofortige Ergebnisse definieren"), p: x("A clearly worded customer measure where permitted; missing answers are never filled in as positive.", "Një matje klienti e formuluar qartë, ku lejohet; përgjigjet që mungojnë nuk plotësohen kurrë si pozitive.", "Ein klar formuliertes Kundenmaß, wo erlaubt; fehlende Antworten nie als positiv eintragen.") },
              { h: x("Define longer-term outcomes", "Përkufizo rezultatet afatgjata", "Längerfristige Ergebnisse definieren"), p: x("Expressed intention separated from later observed behaviour, with privacy safeguards.", "Qëllimi i shprehur i ndarë nga sjellja e vëzhguar më vonë, me mbrojtje të privatësisë.", "Geäußerte Absicht getrennt von später beobachtetem Verhalten, mit Datenschutz.") },
              { h: x("Document contextual differences", "Dokumento dallimet e kontekstit", "Kontextunterschiede dokumentieren"), p: x("Complaint type, severity, business line and recurrence, before generalising.", "Lloji i ankesës, rëndësia, linja e biznesit dhe përsëritja, para se të përgjithësosh.", "Beschwerdeart, Schwere, Geschäftsbereich und Wiederholung, bevor verallgemeinert wird.") },
              { h: x("Avoid rewarding failures", "Shmang shpërblimin e dështimeve", "Fehler nicht belohnen"), p: x("Recognise response quality without creating incentives to tolerate preventable defects.", "Njihe cilësinë e përgjigjes pa krijuar stimuj për të toleruar defekte të parandalueshme.", "Antwortqualität anerkennen, ohne Anreize zu schaffen, vermeidbare Mängel zu dulden.") },
            ] },
            { type: "p", text: x(
              "Begin with descriptive measures and clear limits; without a defensible comparison, avoid causal claims, since customer mix, seasonality and other operating changes may explain changes in later purchases. Review the rate and severity of original failures alongside recovery quality: better satisfaction with apologies does not prove the original service has become more reliable.",
              "Nis me matje përshkruese dhe kufij të qartë; pa një krahasim të mbrojtshëm, shmang pohimet shkakësore, sepse përzierja e klientëve, sezonaliteti dhe ndryshime të tjera operative mund t'i shpjegojnë ndryshimet në blerjet e mëvonshme. Rishiko normën dhe rëndësinë e dështimeve fillestare pranë cilësisë së rikuperimit: kënaqësia më e mirë me faljet nuk provon se shërbimi fillestar është bërë më i besueshëm.",
              "Mit beschreibenden Maßen und klaren Grenzen beginnen; ohne belastbaren Vergleich keine Kausalbehauptungen, da Kundenmix, Saison und andere Betriebsänderungen spätere Käufe erklären können. Rate und Schwere der ursprünglichen Fehler neben der Wiedergutmachungsqualität prüfen: Mehr Zufriedenheit mit Entschuldigungen beweist nicht, dass der ursprüngliche Service zuverlässiger wurde.") },
            { type: "callout", reading: true, text: x(
              "An excellent recovery is an obligation after failure, not a substitute for a reliable service.",
              "Një rikuperim i shkëlqyer është detyrim pas dështimit, jo zëvendësim i një shërbimi të besueshëm.",
              "Eine ausgezeichnete Wiedergutmachung ist eine Pflicht nach dem Fehler, kein Ersatz für zuverlässigen Service.") },
          ],
          note: x(
            "Original evaluation protocol guided by de Matos et al. (2007), Maxham and Netemeyer (2002) and Gelbrich and Roschk (2011).",
            "Protokoll vlerësimi origjinal i udhëhequr nga de Matos et al. (2007), Maxham e Netemeyer (2002) dhe Gelbrich e Roschk (2011).",
            "Eigenes Bewertungsprotokoll nach de Matos et al. (2007), Maxham und Netemeyer (2002) und Gelbrich und Roschk (2011)."),
          source: ["de-matos-2007", "maxham-netemeyer-2002", "gelbrich-roschk-2011"],
        },
      ],
    },

    // Chapter V. When the same failure returns
    {
      id: "ch-v", type: "chapter", numeral: "V",
      title: x("When the same failure returns", "Kur i njëjti dështim kthehet", "Wenn derselbe Fehler zurückkehrt"),
      pages: [
        {
          id: "v-scene", layer: "scene", more: "how-we-worked-with-damage",
          title: [x("The second", "Premtimi i dytë", "Das zweite"), x("broken promise", "i thyer", "gebrochene Versprechen")],
          lead: x(
            "A customer evaluates the recurrence as new evidence about what to expect next time.",
            "Klienti e vlerëson përsëritjen si provë të re për atë që duhet të presë herën tjetër.",
            "Ein Kunde wertet die Wiederholung als neuen Beleg dafür, was beim nächsten Mal zu erwarten ist."),
          blocks: [
            { type: "flag", text: x("Constructed repeated-failure scene, not a verified customer case", "Skenë e ndërtuar dështimi të përsëritur, jo rast i verifikuar klienti", "Konstruierte Szene eines wiederholten Fehlers, kein geprüfter Kundenfall") },
            { type: "p", text: x(
              "A business customer receives an incomplete order. The supplier responds professionally and arranges a correction. The problem appears to be over. On a later delivery, a different item is missing. The customer now asks a different question. Instead of asking only how the latest mistake will be fixed, the customer wants to know why the process can be trusted to work next time. The repeated event changes the meaning of the first event. A single failure could have seemed temporary. The second may suggest a stable weakness, even if the causes are unrelated. It is the organisation's job to investigate what actually happened, not to dismiss that perception or to accept an unverified common cause. Fair treatment needs evidence about recurrence, not convenient storytelling.",
              "Një klient biznesi merr një porosi të paplotë. Furnitori përgjigjet me profesionalizëm dhe organizon një korrigjim. Problemi duket se ka mbaruar. Në një dorëzim të mëvonshëm, mungon një artikull tjetër. Klienti tani bën një pyetje tjetër. Në vend që të pyesë vetëm si do të ndreqet gabimi i fundit, klienti do të dijë pse procesi mund të besohet se do të funksionojë herën tjetër. Ngjarja e përsëritur e ndryshon kuptimin e ngjarjes së parë. Një dështim i vetëm mund të dukej i përkohshëm. I dyti mund të sugjerojë një dobësi të qëndrueshme, edhe nëse shkaqet nuk lidhen. Është detyrë e organizatës të hetojë çfarë ndodhi vërtet, jo ta hedhë poshtë atë perceptim apo të pranojë një shkak të përbashkët të paverifikuar. Trajtimi i drejtë ka nevojë për prova mbi përsëritjen, jo për rrëfime të përshtatshme.",
              "Ein Geschäftskunde erhält einen unvollständigen Auftrag. Der Lieferant reagiert professionell und veranlasst eine Korrektur. Das Problem scheint erledigt. Bei einer späteren Lieferung fehlt ein anderer Artikel. Der Kunde stellt nun eine andere Frage. Statt nur zu fragen, wie der jüngste Fehler behoben wird, will er wissen, warum man dem Prozess beim nächsten Mal vertrauen kann. Das wiederholte Ereignis verändert die Bedeutung des ersten. Ein einzelner Fehler konnte vorübergehend wirken. Der zweite mag eine stabile Schwäche nahelegen, selbst wenn die Ursachen nichts miteinander zu tun haben. Es ist Aufgabe der Organisation zu untersuchen, was wirklich geschah, nicht diese Wahrnehmung abzutun oder eine ungeprüfte gemeinsame Ursache anzunehmen. Faire Behandlung braucht Belege zur Wiederholung, keine bequemen Geschichten.") },
            { type: "p", text: x(
              "The scenario is invented to explain a mechanism studied by attribution researchers. It is not an account of a real partner among the 61 resellers in the author's previous wholesale network, nor evidence of two linked incidents at an actual company. An article about trust loses its own credibility if it invents the very failures it claims to understand.",
              "Skenari është i shpikur për të shpjeguar një mekanizëm të studiuar nga kërkuesit e atribuimit. Nuk është rrëfim për një partner të vërtetë mes 61 rishitësve të rrjetit të mëparshëm me shumicë të autorit, as provë e dy ngjarjeve të lidhura në një kompani të vërtetë. Një artikull për besimin e humb vetë besueshmërinë nëse i shpik pikërisht dështimet që pretendon t'i kuptojë.",
              "Das Szenario ist erfunden, um einen von der Attributionsforschung untersuchten Mechanismus zu erklären. Es ist kein Bericht über einen echten Partner unter den 61 Wiederverkäufern des früheren Großhandelsnetzes des Autors und kein Beleg zweier verknüpfter Vorfälle bei einem echten Unternehmen. Ein Artikel über Vertrauen verliert seine eigene Glaubwürdigkeit, wenn er genau die Fehler erfindet, die er zu verstehen behauptet.") },
            { type: "callout", reading: true, text: x(
              "A repeat complaint is not only another case. It is a challenge to the credibility of the previous remedy.",
              "Një ankesë e përsëritur nuk është vetëm një rast tjetër. Është sfidë ndaj besueshmërisë së zgjidhjes së mëparshme.",
              "Eine wiederholte Beschwerde ist nicht nur ein weiterer Fall. Sie stellt die Glaubwürdigkeit der vorigen Abhilfe infrage.") },
          ],
          note: x(
            "Constructed example informed by Van Vaerenbergh et al. (2014); no actual repeated failure, customer or order is attributed to the author. The essay named below traces a recurring damage figure to its causes.",
            "Shembull i ndërtuar i mbështetur te Van Vaerenbergh et al. (2014); asnjë dështim i përsëritur, klient apo porosi e vërtetë nuk i atribuohet autorit. Eseja e emërtuar më poshtë e ndjek një shifër dëmi të përsëritur deri te shkaqet.",
            "Konstruiertes Beispiel nach Van Vaerenbergh et al. (2014); kein echter wiederholter Fehler, Kunde oder Auftrag wird dem Autor zugeschrieben. Der unten genannte Essay verfolgt eine wiederkehrende Schadenszahl bis zu ihren Ursachen."),
          source: ["van-vaerenbergh-2014"],
        },
        {
          id: "v-concept", layer: "concept",
          title: [x("The customer's", "Teoria e klientit", "Die Theorie des Kunden"), x("theory of the cause", "për shkakun", "über die Ursache")],
          lead: x(
            "People do not only notice a failure. They infer whether it could have been prevented and whether it will happen again.",
            "Njerëzit nuk e vënë re vetëm një dështim. Nxjerrin nëse mund të ishte parandaluar dhe nëse do të ndodhë sërish.",
            "Menschen bemerken einen Fehler nicht nur. Sie schließen, ob er vermeidbar war und ob er wieder geschieht."),
          blocks: [
            { type: "p", text: x(
              "Attribution theory makes two distinctions useful for operations. Perceived controllability asks whether the organisation could reasonably have prevented the event. Perceived stability asks whether the underlying cause is likely to persist. These are customer interpretations, not direct root-cause measurements; an investigation can support, qualify or contradict them, but cannot erase them by stating that the case has been closed. Van Vaerenbergh, Orsingher, Vermeir and Larivière (2014) meta-analysed the links between service-failure attributions and customer outcomes. Controllability attributions elicited stronger negative emotions than stability attributions, while stability was related to both transaction-specific and overall satisfaction; the connections to loyalty and negative word of mouth ran through emotional and satisfaction pathways. The findings give no formula for predicting any named guest or delivery customer.",
              "Teoria e atribuimit bën dy dallime të dobishme për operacionet. Kontrollueshmëria e perceptuar pyet nëse organizata mund ta kishte parandaluar me arsye ngjarjen. Qëndrueshmëria e perceptuar pyet nëse shkaku themelor ka gjasa të vazhdojë. Këto janë interpretime të klientit, jo matje të drejtpërdrejta të shkakut rrënjë; një hetim mund t'i mbështesë, kufizojë ose kundërshtojë, por nuk i fshin dot duke thënë se rasti është mbyllur. Van Vaerenbergh, Orsingher, Vermeir dhe Larivière (2014) meta-analizuan lidhjet mes atribuimeve të dështimit të shërbimit dhe rezultateve për klientin. Atribuimet e kontrollueshmërisë nxitën emocione negative më të forta se atribuimet e qëndrueshmërisë, ndërsa qëndrueshmëria lidhej si me kënaqësinë e transaksionit, ashtu edhe me atë të përgjithshme; lidhjet me besnikërinë dhe fjalën gojore negative kalonin përmes rrugëve emocionale dhe të kënaqësisë. Gjetjet nuk japin formulë për të parashikuar ndonjë mysafir apo klient dorëzimi të emërtuar.",
              "Die Attributionstheorie bietet zwei für den Betrieb nützliche Unterscheidungen. Wahrgenommene Kontrollierbarkeit fragt, ob die Organisation das Ereignis vernünftigerweise hätte verhindern können. Wahrgenommene Stabilität fragt, ob die zugrunde liegende Ursache wahrscheinlich fortbesteht. Das sind Deutungen des Kunden, keine direkten Ursachenmessungen; eine Untersuchung kann sie stützen, einschränken oder widerlegen, aber nicht löschen, indem sie den Fall für geschlossen erklärt. Van Vaerenbergh, Orsingher, Vermeir und Larivière (2014) metaanalysierten die Verbindungen zwischen Attributionen von Servicefehlern und Kundenergebnissen. Kontrollierbarkeitsattributionen lösten stärkere negative Emotionen aus als Stabilitätsattributionen, während Stabilität mit transaktionsbezogener und Gesamtzufriedenheit zusammenhing; die Verbindungen zu Loyalität und negativer Mundpropaganda liefen über Emotions- und Zufriedenheitspfade. Die Befunde liefern keine Formel zur Vorhersage eines bestimmten Gastes oder Zustellkunden.") },
            { type: "cards", cols: 3, items: [
              { h: x("Controllable?", "E kontrollueshme?", "Kontrollierbar?"), p: x("Could the provider reasonably have prevented it?", "A mund ta kishte parandaluar ofruesi me arsye?", "Hätte der Anbieter es vernünftigerweise verhindern können?") },
              { h: x("Stable?", "E qëndrueshme?", "Stabil?"), p: x("Is the cause expected to persist or recur?", "A pritet shkaku të vazhdojë ose të përsëritet?", "Wird die Ursache voraussichtlich fortbestehen oder wiederkehren?") },
              { h: x("Supported?", "E mbështetur?", "Belegt?"), p: x("What evidence supports the proposed explanation?", "Cila provë e mbështet shpjegimin e propozuar?", "Welcher Beleg stützt die vorgeschlagene Erklärung?") },
            ] },
            { type: "p", text: x(
              "Communication must therefore be accurate and proportionate. If the cause is unknown, saying so with an honest next step is more defensible than claiming that the problem can never recur. If the same defect is found repeatedly, compensating each transaction without changing the process leaves the central question unanswered: what will make the next promise more reliable?",
              "Komunikimi duhet të jetë pra i saktë dhe në përpjesëtim. Nëse shkaku nuk dihet, ta thuash me një hap të ndershëm të radhës është më e mbrojtshme se të pretendosh se problemi nuk përsëritet kurrë. Nëse i njëjti defekt gjendet vazhdimisht, kompensimi i çdo transaksioni pa e ndryshuar procesin e lë pyetjen qendrore pa përgjigje: çfarë do ta bëjë premtimin e radhës më të besueshëm?",
              "Kommunikation muss daher genau und verhältnismäßig sein. Ist die Ursache unbekannt, ist es belastbarer, das mit einem ehrlichen nächsten Schritt zu sagen, als zu behaupten, das Problem könne nie wiederkehren. Wird derselbe Mangel wiederholt gefunden, lässt die Entschädigung jeder Transaktion ohne Prozessänderung die zentrale Frage offen: Was macht das nächste Versprechen verlässlicher?") },
            { type: "callout", reading: true, text: x(
              "Do not confuse the customer's attribution with a verified root cause. Investigate both.",
              "Mos e ngatërro atribuimin e klientit me një shkak rrënjë të verifikuar. Hetoji të dy.",
              "Verwechseln Sie die Attribution des Kunden nicht mit einer geprüften Grundursache. Untersuchen Sie beides.") },
          ],
          note: x(
            "Van Vaerenbergh et al. (2014), Journal of Service Research 17(4), 381–398. The cross-sector examples are editorial.",
            "Van Vaerenbergh et al. (2014), Journal of Service Research 17(4), 381–398. Shembujt ndërsektorialë janë editorialë.",
            "Van Vaerenbergh et al. (2014), Journal of Service Research 17(4), 381–398. Die sektorübergreifenden Beispiele sind redaktionell."),
          source: ["van-vaerenbergh-2014"],
        },
        {
          id: "v-evidence", layer: "concept",
          title: [x("The chain", "Zinxhiri nga", "Die Kette"), x("from response to trust", "përgjigjja te besimi", "von der Antwort zum Vertrauen")],
          lead: x(
            "A remedy influences perceptions through a sequence, not through a magical direct jump to loyalty.",
            "Një zgjidhje ndikon te perceptimet përmes një radhe, jo përmes një kërcimi magjik të drejtpërdrejtë te besnikëria.",
            "Eine Abhilfe wirkt auf Wahrnehmungen über eine Abfolge, nicht über einen magischen Sprung zur Loyalität."),
          blocks: [
            { type: "stat", n: "147", t: x("studies of online service failure and recovery, with 82,901 participants across 24 countries, in Das et al. (2026): a research sample, not a field success rate", "studime të dështimit dhe rikuperimit të shërbimit online, me 82.901 pjesëmarrës në 24 vende, te Das et al. (2026): mostër kërkimi, jo normë suksesi në terren", "Studien zu Online-Servicefehlern und Wiedergutmachung, mit 82.901 Teilnehmenden in 24 Ländern, in Das et al. (2026): eine Forschungsstichprobe, keine Erfolgsquote im Feld") },
            { type: "p", text: x(
              "Gelbrich and Roschk (2011) synthesised complaint-handling evidence along a path from organisational responses to fairness judgements, then to post-complaint satisfaction and behavioural intentions. The organisational inputs included compensation, favourable employee behaviour and procedures. The model supported mediation by fairness and satisfaction without making every element equally important for every outcome. A large corrective action may fail to restore trust if the customer sees the procedure as evasive or the explanation as unreliable; a transparent explanation without a usable remedy may be well received yet operationally insufficient. Das and colleagues (2026) integrated attribution and justice perspectives across 147 studies of online service failure and recovery. Its size makes it informative about the online literature; it does not license transferring the same effect sizes to physical wholesale, parcel delivery or hotel operations.",
              "Gelbrich dhe Roschk (2011) e sintetizuan provën e trajtimit të ankesave përgjatë një rruge nga përgjigjet organizative te gjykimet e drejtësisë, pastaj te kënaqësia pas ankesës dhe qëllimet e sjelljes. Hyrjet organizative përfshinin kompensimin, sjelljen e favorshme të punonjësve dhe procedurat. Modeli e mbështeti ndërmjetësimin nga drejtësia dhe kënaqësia, pa e bërë çdo element njësoj të rëndësishëm për çdo rezultat. Një veprim i madh korrigjues mund të mos e rikthejë besimin nëse klienti e sheh procedurën si shmangëse ose shpjegimin si të pabesueshëm; një shpjegim transparent pa zgjidhje të përdorshme mund të pritet mirë dhe prapë të jetë operacionalisht i pamjaftueshëm. Das dhe kolegët (2026) i integruan këndvështrimet e atribuimit dhe të drejtësisë nëpër 147 studime të dështimit dhe rikuperimit të shërbimit online. Madhësia e bën informuese për literaturën online; nuk jep leje për t'i bartur të njëjtat madhësi efekti te shitja fizike me shumicë, dorëzimi i pakove apo operacionet e hotelit.",
              "Gelbrich und Roschk (2011) fassten die Belege zur Beschwerdebearbeitung entlang eines Pfads von organisationalen Reaktionen zu Fairnessurteilen, dann zu Zufriedenheit nach der Beschwerde und Verhaltensabsichten zusammen. Die organisationalen Eingaben umfassten Entschädigung, günstiges Mitarbeiterverhalten und Verfahren. Das Modell stützte die Vermittlung durch Fairness und Zufriedenheit, ohne jedes Element für jedes Ergebnis gleich wichtig zu machen. Eine große Korrekturmaßnahme kann Vertrauen verfehlen, wenn der Kunde das Verfahren als ausweichend oder die Erklärung als unzuverlässig sieht; eine transparente Erklärung ohne brauchbare Abhilfe kann gut ankommen und betrieblich doch unzureichend sein. Das und Kollegen (2026) integrierten Attributions- und Gerechtigkeitsperspektiven über 147 Studien zu Online-Servicefehlern und Wiedergutmachung. Ihre Größe macht sie für die Online-Literatur aussagekräftig; sie erlaubt nicht, dieselben Effektstärken auf physischen Großhandel, Paketzustellung oder Hotelbetrieb zu übertragen.") },
            { type: "chain", items: [
              { h: x("Response", "Përgjigjja", "Antwort"), p: x("Action, procedure, conduct.", "Veprimi, procedura, sjellja.", "Handlung, Verfahren, Verhalten.") },
              { h: x("Justice", "Drejtësia", "Gerechtigkeit"), p: x("Perceived fairness.", "Drejtësia e perceptuar.", "Wahrgenommene Fairness.") },
              { h: x("Experience", "Përvoja", "Erlebnis"), p: x("Satisfaction and emotion.", "Kënaqësia dhe emocioni.", "Zufriedenheit und Emotion.") },
              { h: x("Future", "E ardhmja", "Zukunft"), p: x("Intentions and behaviour.", "Qëllimet dhe sjellja.", "Absichten und Verhalten.") },
            ] },
            { type: "callout", reading: true, text: x(
              "The mechanism can guide hypotheses in other sectors; its published effect sizes must stay in their studied context.",
              "Mekanizmi mund të udhëheqë hipoteza në sektorë të tjerë; madhësitë e efektit të botuara duhet të mbeten në kontekstin e studiuar.",
              "Der Mechanismus kann Hypothesen in anderen Sektoren leiten; seine veröffentlichten Effektstärken müssen in ihrem untersuchten Kontext bleiben.") },
          ],
          note: x(
            "Gelbrich and Roschk (2011), Journal of Service Research; Das et al. (2026), Journal of Business Research 202, article 115752. The pathway is conceptual.",
            "Gelbrich e Roschk (2011), Journal of Service Research; Das et al. (2026), Journal of Business Research 202, artikulli 115752. Rruga është konceptuale.",
            "Gelbrich und Roschk (2011), Journal of Service Research; Das et al. (2026), Journal of Business Research 202, Artikel 115752. Der Pfad ist konzeptionell."),
          source: ["gelbrich-roschk-2011", "das-2026"],
        },
        {
          id: "v-protocol", layer: "protocol",
          title: [x("From apology", "Nga falja", "Von der Entschuldigung"), x("to prevention evidence", "te prova e parandalimit", "zum Präventionsbeleg")],
          lead: x(
            "A repeated issue requires a loop that returns from the customer consequence to the operating process.",
            "Një çështje e përsëritur kërkon një cikël që kthehet nga pasoja për klientin te procesi operativ.",
            "Ein wiederholtes Problem verlangt eine Schleife von der Folge für den Kunden zurück zum Betriebsprozess."),
          blocks: [
            { type: "steps", items: [
              { h: x("Group comparable incidents", "Grupo ngjarjet e krahasueshme", "Vergleichbare Vorfälle gruppieren"), p: x("A consistent classification, with personal information protected.", "Një klasifikim i qëndrueshëm, me informacionin personal të mbrojtur.", "Eine einheitliche Klassifikation, persönliche Daten geschützt.") },
              { h: x("Verify the actual mechanism", "Verifiko mekanizmin e vërtetë", "Den tatsächlichen Mechanismus prüfen"), p: x("Observable process conditions; the reported cause is not treated as proved.", "Kushte procesi të vëzhgueshme; shkaku i raportuar nuk trajtohet si i provuar.", "Beobachtbare Prozessbedingungen; die berichtete Ursache gilt nicht als bewiesen.") },
              { h: x("Distinguish one-off from recurring", "Dallo të njëhershmen nga e përsëritura", "Einmaliges von Wiederkehrendem trennen"), p: x("Frequency and exposure, including cases nobody formally complained about.", "Shpeshtësia dhe ekspozimi, përfshirë rastet për të cilat askush nuk u ankua formalisht.", "Häufigkeit und Exposition, auch Fälle ohne förmliche Beschwerde.") },
              { h: x("Assign correction authority", "Cakto autoritetin e korrigjimit", "Korrekturbefugnis zuweisen"), p: x("Who can improve the upstream process, and who controls immediate recovery.", "Kush mund ta përmirësojë procesin më lart, dhe kush e kontrollon rikuperimin e menjëhershëm.", "Wer den vorgelagerten Prozess verbessern kann, wer die sofortige Wiedergutmachung steuert.") },
              { h: x("Test one bounded change", "Provo një ndryshim të kufizuar", "Eine abgegrenzte Änderung testen"), p: x("The original failure outcome and any adverse effect on speed or cost.", "Rezultati i dështimit fillestar dhe çdo efekt i padëshiruar mbi shpejtësinë ose koston.", "Das ursprüngliche Fehlerergebnis und jede Nebenwirkung auf Tempo oder Kosten.") },
              { h: x("Return a truthful update", "Kthe një përditësim të vërtetë", "Eine wahrheitsgemäße Rückmeldung geben"), p: x("What is verified and permitted to disclose, without claiming certainty too early.", "Çfarë është verifikuar dhe lejohet të zbulohet, pa pretenduar siguri tepër herët.", "Was geprüft ist und offengelegt werden darf, ohne zu früh Gewissheit zu behaupten.") },
            ] },
            { type: "p", text: x(
              "The process-improvement owner and the customer-communication owner may be different people, but the organisation must connect their work: if the customer hears that the cause was fixed, the evidence should support that message. A changed procedure without monitoring is a hypothesis; a monitoring result without a transparent case definition is an unreliable claim. The most credible message may be that the cause is still under investigation, an interim safeguard is in place and another update is scheduled.",
              "Përgjegjësi i përmirësimit të procesit dhe përgjegjësi i komunikimit me klientin mund të jenë persona të ndryshëm, por organizata duhet ta lidhë punën e tyre: nëse klienti dëgjon se shkaku u ndreq, prova duhet ta mbështesë atë mesazh. Një procedurë e ndryshuar pa monitorim është hipotezë; një rezultat monitorimi pa përkufizim transparent rasti është pretendim i pabesueshëm. Mesazhi më i besueshëm mund të jetë se shkaku është ende nën hetim, një masë e përkohshme është vendosur dhe një përditësim tjetër është planifikuar.",
              "Prozessverbesserung und Kundenkommunikation können bei verschiedenen Personen liegen, doch ihre Arbeit muss verbunden sein: Hört der Kunde, die Ursache sei behoben, müssen die Belege das tragen. Ein geändertes Verfahren ohne Überwachung ist eine Hypothese; ein Ergebnis ohne transparente Falldefinition eine unzuverlässige Behauptung. Die glaubwürdigste Botschaft kann sein: Ursache noch in Untersuchung, vorläufige Sicherung besteht, weitere Rückmeldung angesetzt.") },
            { type: "callout", reading: true, text: x(
              "Trust grows from a history of kept commitments. An apology is not a replacement for that history.",
              "Besimi rritet nga një histori angazhimesh të mbajtura. Një falje nuk e zëvendëson atë histori.",
              "Vertrauen wächst aus einer Geschichte gehaltener Zusagen. Eine Entschuldigung ersetzt diese Geschichte nicht.") },
          ],
          note: x(
            "Original recurrence-response protocol, informed by Van Vaerenbergh et al. (2014) and Gelbrich and Roschk (2011). No internal systems, incident files or other customers' data are to be disclosed.",
            "Protokoll origjinal përgjigjeje ndaj përsëritjes, i mbështetur te Van Vaerenbergh et al. (2014) dhe Gelbrich e Roschk (2011). Nuk zbulohen sisteme të brendshme, dosje incidentesh apo të dhëna klientësh të tjerë.",
            "Eigenes Protokoll zur Reaktion auf Wiederholung nach Van Vaerenbergh et al. (2014) und Gelbrich und Roschk (2011); keine internen Systeme oder Daten anderer Kunden werden offengelegt."),
          source: ["van-vaerenbergh-2014", "gelbrich-roschk-2011"],
        },
      ],
    },

    // Chapter VI. Designing the recovery system
    {
      id: "ch-vi", type: "chapter", numeral: "VI",
      title: x("Designing the recovery system", "Projektimi i sistemit të rikuperimit", "Das Wiedergutmachungssystem gestalten"),
      pages: [
        {
          id: "vi-scene", layer: "scene", more: "mistakes-get-lost-between-departments",
          title: [x("The handover", "Dorëzimi që", "Die Übergabe,"), x("that keeps a promise", "e mban premtimin", "die ein Versprechen hält")],
          lead: x(
            "A recovery can fail between two competent people if neither owns the complete customer commitment.",
            "Një rikuperim mund të dështojë mes dy njerëzve kompetentë, nëse asnjëri nuk e zotëron angazhimin e plotë ndaj klientit.",
            "Eine Wiedergutmachung kann zwischen zwei kompetenten Menschen scheitern, wenn keiner die vollständige Zusage an den Kunden verantwortet."),
          blocks: [
            { type: "flag", text: x("Constructed cross-department scene, not a named incident", "Skenë e ndërtuar ndërmjet departamenteve, jo ngjarje e emërtuar", "Konstruierte abteilungsübergreifende Szene, kein benannter Vorfall") },
            { type: "p", text: x(
              "A frontline colleague receives a complaint and explains the next step. A specialist team receives a technically correct task and completes its portion. A separate colleague assumes the customer must have been informed by someone else. No one is acting maliciously. The handover is missing one field: who is responsible for completing the promise made to the person affected. The scenario deliberately combines generic service features; it is not a documented hotel handover, driver escalation or wholesale complaint. It exposes a design problem: organisations often optimise the handoff of work while neglecting the handoff of responsibility for the customer outcome. Repair, communication and learning then occupy different systems or meetings.",
              "Një koleg i vijës së parë merr një ankesë dhe shpjegon hapin e radhës. Një ekip specialistësh merr një detyrë teknikisht të saktë dhe e përfundon pjesën e vet. Një koleg tjetër supozon se klienti duhet të jetë informuar nga dikush tjetër. Askush nuk vepron me keqdashje. Dorëzimit i mungon një fushë: kush është përgjegjës për ta përmbushur premtimin e bërë ndaj personit të prekur. Skenari qëllimisht bashkon veçori të përgjithshme shërbimi; nuk është dorëzim i dokumentuar hoteli, eskalim shoferi apo ankesë me shumicë. Ekspozon një problem projektimi: organizatat shpesh e optimizojnë dorëzimin e punës, ndërsa e lënë pas dore dorëzimin e përgjegjësisë për rezultatin e klientit. Riparimi, komunikimi dhe të mësuarit zënë pastaj sisteme ose mbledhje të ndryshme.",
              "Eine Kollegin an der Front erhält eine Beschwerde und erklärt den nächsten Schritt. Ein Fachteam erhält eine technisch richtige Aufgabe und erledigt seinen Teil. Eine weitere Kollegin nimmt an, der Kunde sei von jemand anderem informiert worden. Niemand handelt böswillig. Der Übergabe fehlt ein Feld: wer dafür verantwortlich ist, das der betroffenen Person gegebene Versprechen zu vollenden. Das Szenario verbindet bewusst allgemeine Servicemerkmale; es ist keine dokumentierte Hotelübergabe, Fahrereskalation oder Großhandelsbeschwerde. Es legt ein Gestaltungsproblem offen: Organisationen optimieren oft die Übergabe der Arbeit und vernachlässigen die Übergabe der Verantwortung für das Kundenergebnis. Reparatur, Kommunikation und Lernen landen dann in verschiedenen Systemen oder Besprechungen.") },
            { type: "p", text: x(
              "A recovery system cannot eliminate every error, guarantee that every person is satisfied or give all frontline workers unlimited authority. It can make the next decision explicit. Each case should have a verifiable state, an authorised owner, a communication commitment and a disposition that says what remains unknown. The first accountable action is to stop a problem from disappearing into the gap between teams.",
              "Një sistem rikuperimi nuk e eliminon dot çdo gabim, nuk garanton se çdo person është i kënaqur dhe nuk u jep të gjithë punonjësve të vijës së parë autoritet të pakufizuar. Mund ta bëjë të qartë vendimin e radhës. Çdo rast duhet të ketë një gjendje të verifikueshme, një përgjegjës të autorizuar, një angazhim komunikimi dhe një gjendje përfundimtare që thotë çfarë mbetet e panjohur. Veprimi i parë i përgjegjshëm është ta ndalësh një problem të zhduket në hendekun mes ekipeve.",
              "Ein Wiedergutmachungssystem kann nicht jeden Fehler beseitigen, nicht jede Zufriedenheit garantieren und nicht allen an der Front unbegrenzte Befugnis geben. Es kann die nächste Entscheidung ausdrücklich machen. Jeder Fall sollte einen prüfbaren Zustand, eine befugte Verantwortliche, eine Kommunikationszusage und einen Stand haben, der sagt, was unbekannt bleibt. Die erste verantwortliche Handlung ist, ein Problem daran zu hindern, in der Lücke zwischen Teams zu verschwinden.") },
            { type: "callout", reading: true, text: x(
              "The customer does not care which department made the promise. The organisation must know who owns its completion.",
              "Klientit nuk i intereson cili departament e bëri premtimin. Organizata duhet ta dijë kush e zotëron përmbushjen e tij.",
              "Dem Kunden ist gleich, welche Abteilung das Versprechen gab. Die Organisation muss wissen, wer seine Erfüllung verantwortet.") },
          ],
          note: x(
            "Constructed organisational scene; management design informed by Homburg and Fürst (2005), Hart et al. (1990) and Tax et al. (1998). The essay named below follows a mistake between departments.",
            "Skenë organizative e ndërtuar; projektimi menaxherial i mbështetur te Homburg e Fürst (2005), Hart et al. (1990) dhe Tax et al. (1998). Eseja e emërtuar më poshtë e ndjek një gabim mes departamenteve.",
            "Konstruierte Organisationsszene; Führungsgestaltung nach Homburg und Fürst (2005), Hart et al. (1990) und Tax et al. (1998). Der unten genannte Essay folgt einem Fehler zwischen Abteilungen."),
          source: ["homburg-furst-2005", "hart-heskett-sasser-1990", "tax-brown-chandrashekaran-1998"],
        },
        {
          id: "vi-concept", layer: "concept",
          title: [x("Rules and culture", "Rregullat dhe kultura", "Regeln und Kultur"), x("must work together", "duhet të punojnë bashkë", "müssen zusammenwirken")],
          lead: x(
            "A complaint system needs both repeatable definitions and people supported to use them.",
            "Një sistem ankesash ka nevojë si për përkufizime të përsëritshme, ashtu edhe për njerëz të mbështetur për t'i përdorur.",
            "Ein Beschwerdesystem braucht wiederholbare Definitionen und Menschen, die bei ihrer Anwendung unterstützt werden."),
          blocks: [
            { type: "p", text: x(
              "Homburg and Fürst (2005) distinguished a mechanistic approach to complaint handling, built around explicit procedures and guidelines, from an organic approach, built around a supportive internal environment. Their dyadic study of organisations and their customers linked both to customers' perceptions, with primarily complementary effects, and found differences between business-to-consumer and business-to-business settings and between services and manufacturing: a warning against one recovery script for every environment. A procedure can specify how to record the failure, assign an owner and confirm an update. But employees must be able to ask for help, describe an unrealistic standard and escalate matters they cannot authorise; otherwise a beautifully documented process produces a stack of complete records and a line of customers still waiting. The reverse also holds: goodwill without clear authority and state definitions becomes heroic improvisation that collapses at the next shift change.",
              "Homburg dhe Fürst (2005) e dalluan një qasje mekanike ndaj trajtimit të ankesave, të ndërtuar rreth procedurave dhe udhëzimeve të shprehura, nga një qasje organike, e ndërtuar rreth një mjedisi të brendshëm mbështetës. Studimi i tyre diadik i organizatave dhe klientëve të tyre i lidhi të dyja me perceptimet e klientëve, me efekte kryesisht plotësuese, dhe gjeti dallime mes mjediseve biznes-konsumator dhe biznes-biznes dhe mes shërbimeve dhe prodhimit: paralajmërim kundër një skenari të vetëm rikuperimi për çdo mjedis. Një procedurë mund të përcaktojë si të regjistrohet dështimi, të caktohet një përgjegjës dhe të konfirmohet një përditësim. Por punonjësit duhet të jenë në gjendje të kërkojnë ndihmë, të përshkruajnë një standard joreal dhe të eskalojnë çështje që nuk i autorizojnë dot; përndryshe një proces i dokumentuar bukur prodhon një stivë regjistrash të plota dhe një radhë klientësh që presin ende. Edhe e kundërta vlen: vullneti i mirë pa autoritet të qartë dhe përkufizime gjendjeje bëhet improvizim heroik që shembet në ndërrimin e radhës të turnit.",
              "Homburg und Fürst (2005) unterschieden einen mechanistischen Ansatz der Beschwerdebearbeitung, gebaut auf ausdrückliche Verfahren und Richtlinien, von einem organischen, gebaut auf ein unterstützendes internes Umfeld. Ihre dyadische Studie von Organisationen und ihren Kunden verband beide mit den Wahrnehmungen der Kunden, mit vor allem komplementären Wirkungen, und fand Unterschiede zwischen Endkunden- und Geschäftskundenumfeld sowie zwischen Dienstleistung und Fertigung: eine Warnung vor einem einzigen Wiedergutmachungsskript für jedes Umfeld. Ein Verfahren kann festlegen, wie der Fehler erfasst, eine Verantwortliche bestimmt und eine Rückmeldung bestätigt wird. Doch Beschäftigte müssen um Hilfe bitten, einen unrealistischen Standard benennen und eskalieren können, was sie nicht freigeben dürfen; sonst erzeugt ein schön dokumentierter Prozess einen Stapel vollständiger Aufzeichnungen und eine Schlange wartender Kunden. Das Umgekehrte gilt auch: Wohlwollen ohne klare Befugnis und Zustandsdefinitionen wird zur heroischen Improvisation, die beim nächsten Schichtwechsel zusammenbricht.") },
            { type: "cards", cols: 3, items: [
              { h: x("Standard", "Standardi", "Standard"), p: x("Define state, ownership and exceptions.", "Përkufizo gjendjen, pronësinë dhe përjashtimet.", "Zustand, Verantwortung und Ausnahmen definieren.") },
              { h: x("Support", "Mbështetja", "Unterstützung"), p: x("Make decisions and help accessible.", "Bëji vendimet dhe ndihmën të arritshme.", "Entscheidungen und Hilfe zugänglich machen.") },
              { h: x("Learning", "Të mësuarit", "Lernen"), p: x("Return verified causes to the process.", "Ktheji shkaqet e verifikuara te procesi.", "Geprüfte Ursachen in den Prozess zurückführen.") },
            ] },
            { type: "p", text: x(
              "The operational decision is not procedure versus empathy but how to make them mutually reinforcing: a complaint process fair, auditable and short enough to use when work is busy, while allowing a responsible response to the particular consequence a customer faces. Sensitive compensation, legal and safety matters require the employer's policies, not an editorial formula.",
              "Vendimi operacional nuk është procedurë kundër empatisë, por si t'i bësh të përforcojnë njëra-tjetrën: një proces ankesash i drejtë, i auditueshëm dhe mjaft i shkurtër për t'u përdorur kur puna është e ngarkuar, që lejon njëkohësisht një përgjigje të përgjegjshme ndaj pasojës së veçantë që përballon klienti. Çështjet e ndjeshme të kompensimit, ligjore dhe të sigurisë kërkojnë politikat e punëdhënësit, jo një formulë editoriale.",
              "Die betriebliche Entscheidung heißt nicht Verfahren gegen Empathie, sondern wie beide einander stärken: ein Beschwerdeprozess, fair, prüfbar und kurz genug für volle Tage, der zugleich eine verantwortliche Antwort auf die konkrete Folge für den Kunden erlaubt. Sensible Entschädigungs-, Rechts- und Sicherheitsfragen verlangen die Regeln des Arbeitgebers, keine redaktionelle Formel.") },
            { type: "callout", reading: true, text: x(
              "Consistency without judgement becomes bureaucracy. Judgement without a dependable process becomes chance.",
              "Qëndrueshmëria pa gjykim bëhet burokraci. Gjykimi pa një proces të besueshëm bëhet rastësi.",
              "Konsistenz ohne Urteil wird Bürokratie. Urteil ohne verlässlichen Prozess wird Zufall.") },
          ],
          note: x(
            "Homburg and Fürst (2005), Journal of Marketing 69(3), 95–114. The complementary approach and context effects are from the published abstract; the operating model is editorial.",
            "Homburg e Fürst (2005), Journal of Marketing 69(3), 95–114. Qasja plotësuese dhe efektet e kontekstit janë nga abstrakti i botuar; modeli operativ është editorial.",
            "Homburg und Fürst (2005), Journal of Marketing 69(3), 95–114. Der komplementäre Ansatz und die Kontexteffekte stammen aus dem veröffentlichten Abstract; das Betriebsmodell ist redaktionell."),
          source: ["homburg-furst-2005"],
        },
        {
          id: "vi-protocol", layer: "protocol",
          title: [x("Six gates", "Gjashtë porta", "Sechs Tore"), x("to honest closure", "për mbyllje të ndershme", "zum ehrlichen Abschluss")],
          lead: x(
            "A practical system distinguishes each decision and names the next owner before a case can disappear.",
            "Një sistem praktik e dallon çdo vendim dhe e emërton përgjegjësin e radhës para se një rast të zhduket.",
            "Ein praktisches System unterscheidet jede Entscheidung und benennt die nächste Verantwortliche, bevor ein Fall verschwinden kann."),
          blocks: [
            { type: "steps", items: [
              { h: x("Receive", "Prano", "Empfangen"), p: x("The customer-visible failure and the exact original promise.", "Dështimi i dukshëm për klientin dhe premtimi fillestar i saktë.", "Der für den Kunden sichtbare Fehler und das genaue ursprüngliche Versprechen.") },
              { h: x("Verify", "Verifiko", "Prüfen"), p: x("Report, verified facts, technical status and unknowns, kept apart.", "Raporti, faktet e verifikuara, statusi teknik dhe të panjohurat, të ndara.", "Meldung, geprüfte Fakten, technischer Status und Unbekanntes, getrennt.") },
              { h: x("Own", "Zotëro", "Verantworten"), p: x("An authorised decision maker and the next feasible action.", "Një vendimmarrës i autorizuar dhe veprimi i radhës i realizueshëm.", "Eine befugte Entscheiderin und die nächste machbare Handlung.") },
              { h: x("Remedy", "Zgjidh", "Abhelfen"), p: x("Complete or escalate the approved correction; record evidence of delivery.", "Përfundo ose eskalo korrigjimin e miratuar; shëno provën e dorëzimit.", "Die genehmigte Korrektur abschließen oder eskalieren; Beleg der Lieferung festhalten.") },
              { h: x("Inform", "Informo", "Informieren"), p: x("A clear, respectful update; sent, received and accepted kept distinct.", "Një përditësim i qartë dhe me respekt; e dërguara, e marra dhe e pranuara të dalluara.", "Eine klare, respektvolle Rückmeldung; gesendet, empfangen und angenommen getrennt.") },
              { h: x("Learn", "Mëso", "Lernen"), p: x("Recurrence classified, the upstream mechanism checked, the prevention action reviewed.", "Përsëritja e klasifikuar, mekanizmi më lart i kontrolluar, veprimi i parandalimit i rishikuar.", "Wiederholung eingeordnet, Mechanismus geprüft, Präventionsmaßnahme überprüft.") },
            ] },
            { type: "p", text: x(
              "A pilot can start with a few de-identified cases: where does a case move backward because the next owner lacks information, and how long passes between report, verified action and customer update? The gates are no mandatory queue: a safety concern may need action before a full record exists, and legal deadlines and employer rules take precedence. The purpose is to preserve responsibility and evidence, not to delay the remedy.",
              "Një pilot mund të nisë me pak raste të anonimizuara: ku kthehet mbrapsht një rast se përgjegjësit të radhës i mungon informacioni, dhe sa kohë kalon mes raportit, veprimit të verifikuar dhe përditësimit të klientit? Portat nuk janë radhë e detyrueshme: një shqetësim sigurie mund të kërkojë veprim para regjistrit të plotë, dhe afatet ligjore dhe rregullat e punëdhënësit kanë përparësi. Qëllimi është të ruhen përgjegjësia dhe prova, jo të vonohet zgjidhja.",
              "Ein Pilot kann mit wenigen anonymisierten Fällen beginnen: Wo läuft ein Fall zurück, weil Information fehlt, und wie viel Zeit vergeht zwischen Meldung, geprüfter Maßnahme und Kundenrückmeldung? Die Tore sind keine Pflichtreihenfolge: Ein Sicherheitsproblem kann Handeln vor der vollständigen Aufzeichnung verlangen, und Rechtsfristen und Arbeitgeberregeln gehen vor. Der Zweck ist, Verantwortung und Belege zu wahren, nicht die Abhilfe aufzuschieben.") },
            { type: "callout", reading: true, text: x(
              "Close the record honestly, not optimistically. A pending outcome must remain visible until the agreed next decision.",
              "Mbylle regjistrin me ndershmëri, jo me optimizëm. Një rezultat në pritje duhet të mbetet i dukshëm deri te vendimi i radhës i rënë dakord.",
              "Schließen Sie die Aufzeichnung ehrlich, nicht optimistisch. Ein offenes Ergebnis muss sichtbar bleiben bis zur vereinbarten nächsten Entscheidung.") },
          ],
          note: x(
            "Original editorial protocol after Tax et al. (1998) and Homburg and Fürst (2005), with the learning gate after Van Vaerenbergh et al. (2014); not a certified SOP or tested treatment.",
            "Protokoll editorial origjinal sipas Tax et al. (1998) dhe Homburg e Fürst (2005), me portën e të mësuarit sipas Van Vaerenbergh et al. (2014); jo SOP i certifikuar apo trajtim i provuar.",
            "Eigenes redaktionelles Protokoll nach Tax et al. (1998) und Homburg und Fürst (2005), das Lerntor nach Van Vaerenbergh et al. (2014); keine zertifizierte SOP, keine getestete Behandlung."),
          source: ["tax-brown-chandrashekaran-1998", "homburg-furst-2005"],
        },
      ],
    },

    {
      id: "tool", tool: "/tools/cx-control-tower/",
      kicker: x("Field tool", "Mjeti i terrenit", "Werkzeug vor Ort"),
      title: [x("The Recovery", "Karta e mbylljes", "Die Abschlusskarte"), x("Closure Card", "së rikuperimit", "der Wiedergutmachung")],
      lead: x(
        "One problem, one responsible owner, one clear customer commitment. Use only anonymised examples in public; a blank means not verified, never automatically positive.",
        "Një problem, një përgjegjës, një angazhim i qartë ndaj klientit. Në publik përdor vetëm shembuj anonimë; një fushë bosh do të thotë e paverifikuar, kurrë automatikisht pozitive.",
        "Ein Problem, eine Verantwortliche, eine klare Zusage an den Kunden. Öffentlich nur anonymisierte Beispiele; ein leeres Feld heißt nicht geprüft, nie automatisch positiv."),
      blocks: [
        { type: "form", items: [
          { h: x("Promise and impact", "Premtimi dhe ndikimi", "Versprechen und Belastung"), hint: x("what was promised, and what customer-visible consequence remains?", "çfarë u premtua, dhe cila pasojë e dukshme për klientin mbetet?", "was wurde versprochen, und welche für den Kunden sichtbare Folge bleibt?") },
          { h: x("Evidence", "Prova", "Belege"), hint: x("what is directly verified? what is only reported or assumed?", "çfarë është verifikuar drejtpërdrejt? çfarë është vetëm e raportuar ose e supozuar?", "was ist direkt geprüft? was ist nur berichtet oder angenommen?") },
          { h: x("Authority and owner", "Autoriteti dhe përgjegjësi", "Befugnis und Verantwortliche"), hint: x("who can decide the remedy, and who owns the customer update?", "kush mund ta vendosë zgjidhjen, dhe kush e zotëron përditësimin e klientit?", "wer kann die Abhilfe entscheiden, und wer verantwortet die Kundenrückmeldung?") },
          { h: x("Remedy and timing", "Zgjidhja dhe koha", "Abhilfe und Zeitpunkt"), hint: x("what was actually done, and when is the next permitted commitment?", "çfarë u bë vërtet, dhe kur është angazhimi i radhës i lejuar?", "was wurde tatsächlich getan, und wann ist die nächste zulässige Zusage?") },
          { h: x("Customer-facing closure", "Mbyllja ndaj klientit", "Abschluss gegenüber dem Kunden"), hint: x("what was communicated? was delivery confirmed, or is the response unknown?", "çfarë u komunikua? a u konfirmua dorëzimi, apo përgjigjja është e panjohur?", "was wurde mitgeteilt? wurde die Zustellung bestätigt, oder ist die Reaktion unbekannt?") },
          { h: x("Recurrence and learning", "Përsëritja dhe të mësuarit", "Wiederholung und Lernen"), hint: x("was the underlying cause checked and assigned for prevention?", "a u kontrollua shkaku themelor dhe a u caktua për parandalim?", "wurde die zugrunde liegende Ursache geprüft und zur Prävention zugewiesen?") },
        ] },
      ],
      note: x(
        "Use only with approved processes; route urgent cases under the applicable safety or legal procedure. In an internal test, check whether the next colleague can act, the agreed update occurs and prevention remains owned. Never publish identifiable case information.",
        "Përdore vetëm me procese të miratuara; rastet urgjente drejtoji sipas procedurës së zbatueshme të sigurisë ose ligjore. Në një provë të brendshme, kontrollo nëse kolegu i radhës mund të veprojë, përditësimi i rënë dakord ndodh dhe parandalimi mbetet me përgjegjës. Mos publiko kurrë informacion të identifikueshëm rastesh.",
        "Nur mit genehmigten Prozessen verwenden; dringende Fälle nach dem geltenden Sicherheits- oder Rechtsverfahren leiten. In einem internen Test prüfen, ob die nächste Kollegin handeln kann, die vereinbarte Rückmeldung erfolgt und die Prävention verantwortet bleibt. Nie identifizierbare Fallinformation veröffentlichen."),
      source: ["tax-brown-chandrashekaran-1998", "homburg-furst-2005"],
    },
    {
      id: "closing",
      kicker: x("Closing essay", "Eseja e mbylljes", "Schlussessay"),
      title: [x("The promise", "Premtimi", "Das Versprechen"), x("after the apology", "pas faljes", "nach der Entschuldigung")],
      lead: x(
        "A company repairs the part it controls. The customer remembers the whole experience.",
        "Një kompani ndreq pjesën që kontrollon. Klienti e mban mend gjithë përvojën.",
        "Ein Unternehmen repariert den Teil, den es kontrolliert. Der Kunde erinnert sich an das ganze Erlebnis."),
      blocks: [
        { type: "p", text: x(
          "An apology is a human beginning, not an operational conclusion. It can recognise inconvenience, reduce defensiveness and make a difficult conversation possible. The next question is what the organisation can actually restore. A room must be usable. An order must be complete or its remedy honestly agreed. A trading partner needs a reliable update before it can make promises of its own. These are different services, but each ends where the customer receives something they can use. The temptation is to count the visible acts of recovery: tickets, response times, credits, replacements and closure rates. The numbers are useful only when we know what each one proves. A message sent is not a message understood. A technician finished is not necessarily a guest reassured. A replacement prepared is not a parcel delivered. A satisfied complainant is not automatically a loyal customer. An organisation can be fast at repairing its own record and slow at lifting the burden from the person affected.",
          "Një falje është fillim njerëzor, jo përfundim operacional. Mund ta njohë shqetësimin, ta ulë mbrojtjen dhe ta bëjë të mundur një bisedë të vështirë. Pyetja tjetër është çfarë mund të rikthejë vërtet organizata. Një dhomë duhet të jetë e përdorshme. Një porosi duhet të jetë e plotë ose zgjidhja e saj e rënë dakord me ndershmëri. Një partner tregtar ka nevojë për një përditësim të besueshëm para se të bëjë premtime të vetat. Këto janë shërbime të ndryshme, por secili mbaron aty ku klienti merr diçka që mund ta përdorë. Tundimi është t'i numërosh veprimet e dukshme të rikuperimit: biletat, kohët e përgjigjes, kreditë, zëvendësimet dhe normat e mbylljes. Numrat janë të dobishëm vetëm kur e dimë çfarë provon secili. Një mesazh i dërguar nuk është mesazh i kuptuar. Një teknik që mbaroi nuk është doemos një mysafir i qetësuar. Një zëvendësim i përgatitur nuk është pako e dorëzuar. Një ankues i kënaqur nuk është automatikisht klient besnik. Një organizatë mund të jetë e shpejtë në riparimin e regjistrit të vet dhe e ngadaltë në heqjen e barrës nga personi i prekur.",
          "Eine Entschuldigung ist ein menschlicher Anfang, kein betrieblicher Schluss. Sie kann Unannehmlichkeit anerkennen, Abwehr senken und ein schwieriges Gespräch möglich machen. Die nächste Frage ist, was die Organisation tatsächlich wiederherstellen kann. Ein Zimmer muss nutzbar sein. Ein Auftrag muss vollständig sein oder seine Abhilfe ehrlich vereinbart. Ein Handelspartner braucht eine verlässliche Rückmeldung, bevor er eigene Versprechen geben kann. Das sind verschiedene Services, doch jeder endet dort, wo der Kunde etwas Brauchbares erhält. Die Versuchung ist, die sichtbaren Akte zu zählen: Tickets, Antwortzeiten, Gutschriften, Ersatz, Abschlussquoten. Die Zahlen nützen nur, wenn wir wissen, was jede beweist. Eine gesendete Nachricht ist keine verstandene. Ein fertiger Techniker ist nicht unbedingt ein beruhigter Gast. Ein vorbereiteter Ersatz ist kein zugestelltes Paket. Ein zufriedener Beschwerdeführer ist nicht automatisch ein treuer Kunde. Eine Organisation kann schnell darin sein, ihre eigene Aufzeichnung zu reparieren, und langsam darin, der betroffenen Person die Last abzunehmen.") },
        { type: "p", text: x(
          "The evidence is neither cynical nor sentimental. Research on fairness shows that the outcome, the procedure and the treatment all contribute to the customer experience. Studies of the recovery paradox warn that a good response may improve satisfaction without restoring future buying intentions. Attribution research reminds us that people try to decide whether a failure was preventable and whether it will recur. The more predictable the underlying process becomes, the less work needs to be done by apologies. From the front desk to the loading ramp to the wholesale relationship, the responsible manager asks one more question after the internal case is closed: what consequence is the customer still carrying, and who knows? The answer may be that the remedy is complete. It may also be that the person declines contact, that the outcome cannot be verified or that some inconvenience cannot be undone. Honesty about those limits is stronger than pretending the system has removed them. A recovery system earns its place when it helps employees act fairly, makes unresolved work visible and improves the process that failed. It does not promise perfect satisfaction. It promises that the organisation will not mistake its own convenience for the customer's recovery.",
          "Prova nuk është as cinike, as sentimentale. Kërkimi mbi drejtësinë tregon se rezultati, procedura dhe trajtimi kontribuojnë të gjitha në përvojën e klientit. Studimet e paradoksit të rikuperimit paralajmërojnë se një përgjigje e mirë mund ta përmirësojë kënaqësinë pa i rikthyer qëllimet e ardhshme të blerjes. Kërkimi i atribuimit na kujton se njerëzit përpiqen të vendosin nëse një dështim ishte i parandalueshëm dhe nëse do të përsëritet. Sa më i parashikueshëm të bëhet procesi themelor, aq më pak punë u mbetet faljeve. Nga recepsioni te rampa e ngarkimit dhe te marrëdhënia me shumicë, menaxheri i përgjegjshëm bën edhe një pyetje pasi rasti i brendshëm mbyllet: cilën pasojë po e mban ende klienti, dhe kush e di? Përgjigjja mund të jetë se zgjidhja është e plotë. Mund të jetë edhe se personi e refuzon kontaktin, se rezultati nuk verifikohet dot ose se një shqetësim nuk zhbëhet dot. Ndershmëria për ato kufij është më e fortë se pretendimi që sistemi i ka hequr. Një sistem rikuperimi e fiton vendin e vet kur i ndihmon punonjësit të veprojnë me drejtësi, e bën të dukshme punën e pazgjidhur dhe e përmirëson procesin që dështoi. Nuk premton kënaqësi të përsosur. Premton se organizata nuk do ta ngatërrojë rehatinë e vet me rikuperimin e klientit.",
          "Die Belege sind weder zynisch noch sentimental. Forschung zur Fairness zeigt, dass Ergebnis, Verfahren und Behandlung alle zum Kundenerlebnis beitragen. Studien zum Wiedergutmachungsparadox warnen, dass eine gute Antwort die Zufriedenheit heben kann, ohne künftige Kaufabsichten wiederherzustellen. Die Attributionsforschung erinnert daran, dass Menschen zu entscheiden versuchen, ob ein Fehler vermeidbar war und ob er wiederkehrt. Je vorhersehbarer der zugrunde liegende Prozess wird, desto weniger Arbeit bleibt den Entschuldigungen. Von der Rezeption bis zur Laderampe und zum Großhandel stellt die verantwortliche Führungskraft nach dem internen Abschluss eine weitere Frage: Welche Folge trägt der Kunde noch, und wer weiß davon? Die Antwort kann sein, dass die Abhilfe vollständig ist. Sie kann auch sein, dass die Person Kontakt ablehnt, das Ergebnis nicht prüfbar ist oder eine Unannehmlichkeit sich nicht rückgängig machen lässt. Ehrlichkeit über diese Grenzen ist stärker als die Behauptung, das System habe sie beseitigt. Ein Wiedergutmachungssystem verdient seinen Platz, wenn es faires Handeln stützt, ungelöste Arbeit sichtbar macht und den Prozess verbessert, der versagte. Es verspricht keine vollkommene Zufriedenheit. Es verspricht, dass die Organisation ihre eigene Bequemlichkeit nicht mit der Wiedergutmachung für den Kunden verwechselt.") },
        { type: "callout", reading: true, text: x(
          "Fix the failure. Explain the remedy. Verify the result where possible. Learn before the next promise.",
          "Ndreqe dështimin. Shpjegoje zgjidhjen. Verifikoje rezultatin ku është e mundur. Mëso para premtimit të radhës.",
          "Beheben Sie den Fehler. Erklären Sie die Abhilfe. Prüfen Sie das Ergebnis, wo möglich. Lernen Sie vor dem nächsten Versprechen.") },
      ],
      note: x(
        "Editorial conclusion. No failed recovery, lost customer or neglected complaint is attributed to any named employer.",
        "Përfundim editorial. Asnjë rikuperim i dështuar, klient i humbur apo ankesë e lënë pas dore nuk i atribuohet ndonjë punëdhënësi të caktuar.",
        "Redaktionelles Fazit. Keine gescheiterte Wiedergutmachung, kein verlorener Kunde und keine vernachlässigte Beschwerde wird einem bestimmten Arbeitgeber zugeschrieben."),
    },
    {
      id: "method",
      kicker: x("Method", "Metoda", "Methode"),
      title: [x("Evidence before", "Prova para", "Belege vor der"), x("the closure claim", "pretendimit të mbylljes", "Abschlussbehauptung")],
      lead: x(
        "An evidence-informed narrative synthesis, not an original field study. The author's documented categories are last-mile incomplete deliveries, operational coordination, wholesale partner relationships and hotel complaint handovers; every conversation and scene is labelled hypothetical, and every count describes published research.",
        "Një sintezë narrative e mbështetur në prova, jo studim origjinal në terren. Kategoritë e dokumentuara të autorit janë dorëzimet e paplota të miljes së fundit, koordinimi operacional, marrëdhëniet me partnerët me shumicë dhe dorëzimet e ankesave në hotel; çdo bisedë dhe skenë është e etiketuar hipotetike, dhe çdo numër përshkruan kërkim të botuar.",
        "Eine belegbasierte narrative Synthese, keine eigene Feldstudie. Die dokumentierten Kategorien des Autors sind unvollständige Zustellungen der letzten Meile, betriebliche Koordination, Großhandelspartnerschaften und Beschwerdeübergaben im Hotel; jedes Gespräch und jede Szene ist als hypothetisch gekennzeichnet, und jede Zahl beschreibt veröffentlichte Forschung."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("Frameworks", "Kuadrot", "Rahmen"), p: x("Hart, Heskett and Sasser (1990) is a managerial article; Bitner, Booms and Tetreault (1990) classify 700 critical incidents; Tax et al. (1998) and Homburg and Fürst (2005) are empirical models, not universal remedies.", "Hart, Heskett e Sasser (1990) është artikull menaxherial; Bitner, Booms e Tetreault (1990) klasifikojnë 700 incidente kritike; Tax et al. (1998) dhe Homburg e Fürst (2005) janë modele empirike, jo zgjidhje universale.", "Hart, Heskett und Sasser (1990) ist ein Führungsartikel; Bitner, Booms und Tetreault (1990) klassifizieren 700 kritische Vorfälle; Tax et al. (1998) und Homburg und Fürst (2005) sind empirische Modelle, keine universellen Abhilfen.") },
          { h: x("Field studies", "Studimet në terren", "Feldstudien"), p: x("Maxham and Netemeyer (2002): two field studies, a bank and a home-construction firm; intentions, not verified purchases.", "Maxham e Netemeyer (2002): dy studime në terren, një bankë dhe një firmë ndërtimi shtëpish; qëllime, jo blerje të verifikuara.", "Maxham und Netemeyer (2002): zwei Feldstudien, eine Bank und ein Hausbauunternehmen; Absichten, keine geprüften Käufe.") },
          { h: x("Meta-analyses", "Meta-analizat", "Metaanalysen"), p: x("De Matos et al. (2007); Orsingher et al. (2010), 60 studies; Gelbrich and Roschk (2011); Van Vaerenbergh et al. (2014); Das et al. (2026), 147 studies, 82,901 participants, 24 countries, online services only.", "De Matos et al. (2007); Orsingher et al. (2010), 60 studime; Gelbrich e Roschk (2011); Van Vaerenbergh et al. (2014); Das et al. (2026), 147 studime, 82.901 pjesëmarrës, 24 vende, vetëm shërbime online.", "De Matos et al. (2007); Orsingher et al. (2010), 60 Studien; Gelbrich und Roschk (2011); Van Vaerenbergh et al. (2014); Das et al. (2026), 147 Studien, 82.901 Teilnehmende, 24 Länder, nur Online-Dienste.") },
          { h: x("Invented counts", "Numrat e shpikur", "Erfundene Zahlen"), p: x("The two clocks (2, 3, 14, 26, 38 hours) and the forty closed cases (40, 36, 28, 19, 14, 6) are illustrations flagged on their pages; no proportion is a benchmark.", "Dy orët (2, 3, 14, 26, 38 orë) dhe dyzet rastet e mbyllura (40, 36, 28, 19, 14, 6) janë ilustrime me flamur në faqet e tyre; asnjë përpjesëtim nuk është pikë referimi.", "Die zwei Uhren (2, 3, 14, 26, 38 Stunden) und die vierzig geschlossenen Fälle (40, 36, 28, 19, 14, 6) sind auf ihren Seiten gekennzeichnete Illustrationen; kein Verhältnis ist ein Richtwert.") },
        ] },
        { type: "p", text: x(
          "The Recovery Closure Card, the two-stage closeout and the six gates are editorial proposals, not validated assessments or employer-approved procedures. No guest, driver, reseller, payment or confidential employer information is reproduced. Editorial standard: a framework, a field study, a meta-analysis and a proposal are named as such, and the sentence stops claiming where the evidence stops.",
          "Karta e mbylljes së rikuperimit, mbyllja me dy faza dhe gjashtë portat janë propozime editoriale, jo vlerësime të vërtetuara apo procedura të miratuara nga punëdhënësi. Nuk riprodhohet asnjë informacion mysafiri, shoferi, rishitësi, pagese apo punëdhënësi konfidencial. Standardi editorial: një kuadër, një studim në terren, një meta-analizë dhe një propozim quhen me emrin e tyre, dhe fjalia pushon së pohuari aty ku mbaron prova.",
          "Die Abschlusskarte, der zweistufige Abschluss und die sechs Tore sind redaktionelle Vorschläge, keine validierten Bewertungen oder vom Arbeitgeber genehmigten Verfahren. Keine Gäste-, Fahrer-, Wiederverkäufer-, Zahlungs- oder vertraulichen Arbeitgeberinformationen werden wiedergegeben. Redaktioneller Standard: Ein Rahmen, eine Feldstudie, eine Metaanalyse und ein Vorschlag werden als solche benannt, und der Satz hört auf zu behaupten, wo die Belege enden.") },
      ],
      note: x(
        "Every source is cited at its DOI or page on the next page; the ten records, their journals, volumes and years were checked against the publishers' metadata and abstracts.",
        "Çdo burim citohet me DOI-n ose faqen e vet në faqen tjetër; dhjetë regjistrimet, revistat, vëllimet dhe vitet e tyre u kontrolluan kundrejt metadata-ve dhe abstrakteve të botuesve.",
        "Jede Quelle ist auf der nächsten Seite mit ihrer DOI oder Seite zitiert; die zehn Einträge, ihre Zeitschriften, Bände und Jahre wurden an den Metadaten und Abstracts der Verlage geprüft."),
      source: ["hart-heskett-sasser-1990", "bitner-booms-tetreault-1990", "tax-brown-chandrashekaran-1998", "maxham-netemeyer-2002", "homburg-furst-2005", "de-matos-2007", "orsingher-2010", "gelbrich-roschk-2011", "van-vaerenbergh-2014", "das-2026"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
