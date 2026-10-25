// Operational treatise, Volume 11: The exception factory, when the process works only because people keep fixing
// it. Block: Operations. Facts and their sources: docs/revista/traktati-operacional.md. The research is the
// routines and workaround literature: Tucker, Edmondson & Spear 2002, Feldman & Pentland 2003, Tucker & Edmondson
// 2003, Tucker 2004, Halbesleben, Wakefield & Wakefield 2008, Alter 2014, Bartelheimer, Wolf & Beverungen 2023 and
// van der Waal et al. 2025, with van der Aalst 2016, Rother & Shook 1999 and Martin & Osterling 2014 for measurement,
// each checked at its DOI or publisher page. Six chapters in the three layers, as in the author's PDF; the site
// draws the PDF's 48 / 20 minute example as a chart and adds a second synthetic chart, twenty deviations sorted into
// the four editorial categories (Chapter III), both flagged, and the method has its own page. Every study count
// describes published research; nothing is measured in the author's workplaces.
import { x } from "../common.js";

const synthetic = x("Synthetic example, authored for this volume; not employer data", "Shembull sintetik, i shkruar për këtë vëllim; jo të dhëna punëdhënësi", "Synthetisches Beispiel, für diesen Band verfasst; keine Arbeitgeberdaten");

export default {
  number: 11,
  numeral: "XI",
  block: "operations",
  date: x("October 2026", "Tetor 2026", "Oktober 2026"),
  theme: [x("The exception factory:", "Fabrika e përjashtimeve:", "Die Ausnahmefabrik:"), x("when the process works only because people keep fixing it", "kur procesi funksionon vetëm sepse njerëzit vazhdojnë ta ndreqin", "wenn der Prozess nur funktioniert, weil Menschen ihn ständig reparieren")],
  sub: x(
    "Six chapters on invisible repair, routines, workarounds, diffusion, cost and redesign.",
    "Gjashtë kapituj për korrigjimin e padukshëm, rutinat, zgjidhjet e përkohshme, përhapjen, koston dhe riprojektimin.",
    "Sechs Kapitel über unsichtbare Korrekturen, Routinen, Workarounds, Verbreitung, Kosten und Neugestaltung."),
  seo: x(
    "The exception factory, an operational treatise: six chapters on the work no SOP can see, from Tucker, Feldman and Alter to the Exception Intelligence Card.",
    "Fabrika e përjashtimeve, traktat operacional: gjashtë kapituj për punën që SOP-ja nuk e sheh, nga Tucker, Feldman dhe Alter te Karta e përjashtimeve.",
    "Die Ausnahmefabrik, operativer Traktat: sechs Kapitel über die Arbeit, die kein SOP sieht, von Tucker, Feldman und Alter bis zur Ausnahmekarte."),
  feature: x(
    "Volume 11 opens the second cycle of the treatise with the work beneath the work. Its six chapters move from a completed order with an invisible repair, the colleague who always knows, a small list beside the system, the shortcut everyone learns and four minutes that never appear, to Tucker, Edmondson and Spear, Feldman and Pentland, Alter, Bartelheimer, Wolf and Beverungen and van der Waal, and end with a controlled exception-to-change cycle, the Exception Intelligence Card and a closing essay on the hidden tax on good work.",
    "Vëllimi 11 hap ciklin e dytë të traktatit me punën nën punë. Gjashtë kapitujt e tij shkojnë nga një porosi e përfunduar me një korrigjim të padukshëm, kolegu që gjithmonë e di, një listë e vogël pranë sistemit, shkurtesa që e mësojnë të gjithë dhe katër minuta që nuk duken kurrë, te Tucker, Edmondson e Spear, Feldman e Pentland, Alter, Bartelheimer, Wolf e Beverungen dhe van der Waal, dhe mbyllen me një cikël të kontrolluar nga përjashtimi te ndryshimi, Kartën e përjashtimeve dhe një ese mbyllëse për taksën e fshehur mbi punën e mirë.",
    "Band 11 eröffnet den zweiten Zyklus des Traktats mit der Arbeit unter der Arbeit. Seine sechs Kapitel führen von einem erledigten Auftrag mit unsichtbarer Korrektur, der Kollegin, die es immer weiß, einer kleinen Liste neben dem System, der Abkürzung, die alle lernen, und vier Minuten, die nie erscheinen, zu Tucker, Edmondson und Spear, Feldman und Pentland, Alter, Bartelheimer, Wolf und Beverungen und van der Waal, und enden mit einem kontrollierten Zyklus von der Ausnahme zur Änderung, der Ausnahmekarte und einem Schlussessay über die verborgene Steuer auf gute Arbeit."),
  figure: { n: "197h", by: x("Tucker, Edmondson and Spear 2002, observation time", "Tucker, Edmondson e Spear 2002, kohë vëzhgimi", "Tucker, Edmondson und Spear 2002, Beobachtungszeit"), t: x(
    "spent observing hospital nurses in a foundational study of how immediate problem solving can inhibit organisational learning.",
    "të kaluara duke vëzhguar infermiere spitali, në një studim themelor se si zgjidhja e menjëhershme e problemeve mund ta pengojë të mësuarit organizativ.",
    "Beobachtung von Pflegekräften im Krankenhaus, in einer grundlegenden Studie darüber, wie sofortiges Problemlösen organisationales Lernen hemmen kann.") },
  teasers: [
    { page: "i-scene", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("A completed order, an invisible repair", "Një porosi e përfunduar, një korrigjim i padukshëm", "Ein erledigter Auftrag, eine unsichtbare Korrektur") },
    { page: "iv-evidence", kicker: x("The evidence", "Prova", "Die Belege"),
      title: x("How a repair spreads", "Si përhapet një korrigjim", "Wie sich eine Korrektur verbreitet") },
    { page: "tool", kicker: x("Field tool", "Mjeti i terrenit", "Werkzeug vor Ort"),
      title: x("The Exception Intelligence Card", "Karta e përjashtimeve", "Die Ausnahmekarte") },
  ],
  contract: [
    { h: x("See the real work", "Shih punën e vërtetë", "Die echte Arbeit sehen"), p: x("Compare the prescribed procedure with the observed performance.", "Krahaso procedurën e përshkruar me punën e vëzhguar.", "Die vorgeschriebene Vorgehensweise mit der beobachteten Ausführung vergleichen.") },
    { h: x("Test the risk", "Provo rrezikun", "Das Risiko prüfen"), p: x("Protect safety, privacy and authority before evaluating a workaround.", "Mbro sigurinë, privatësinë dhe autoritetin para se të vlerësosh një zgjidhje të përkohshme.", "Sicherheit, Datenschutz und Befugnis schützen, bevor ein Workaround bewertet wird.") },
    { h: x("Repair the system", "Ndreq sistemin", "Das System reparieren"), p: x("Assign and verify a durable, authorised improvement.", "Cakto dhe verifiko një përmirësim të qëndrueshëm dhe të autorizuar.", "Eine dauerhafte, befugte Verbesserung zuweisen und prüfen.") },
  ],
  sources: ["tucker-edmondson-spear-2002", "feldman-pentland-2003", "tucker-edmondson-2003", "tucker-2004", "halbesleben-2008", "alter-2014", "bartelheimer-wolf-beverungen-2023", "van-der-waal-2025", "van-der-aalst-2016", "vsm-rother-shook-1999", "vsm-martin-osterling-2014"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      title: [x("The work", "Puna", "Die Arbeit"), x("beneath the work", "nën punë", "unter der Arbeit")],
      why: x(
        "A successful shift may conceal small repairs that the operating model never planned.",
        "Një turn i suksesshëm mund të fshehë korrigjime të vogla që modeli operativ nuk i planifikoi kurrë.",
        "Eine erfolgreiche Schicht kann kleine Korrekturen verbergen, die das Betriebsmodell nie vorgesehen hat."),
      body: x(
        "An operation may finish the day on time while requiring its people to correct the process repeatedly. A missing piece of information is found through an extra conversation. A trolley must be checked again. A handover is made usable by someone who knows what was omitted. The final report records the output, not necessarily the effort spent making the output possible. This eleventh volume opens the second cycle of the treatise. The question underneath them all is how much of what we call process reliability is actually repeated human compensation. Not all adaptation is wrong. Work always varies. The issue is whether managers can distinguish skilled adjustment within the rules from an unauthorised shortcut, and a temporary repair from an opportunity for redesign. The author has worked in last-mile operations, warehouse-facing coordination, wholesale management and hotel night shifts. These are verified domains, not permission to invent a named incident: the scenes combine plausible tasks to explain mechanisms, are labelled hypothetical and disclose no guest identities, private operating systems or commercially sensitive records. A workaround may be a warning, a useful innovation or a dangerous breach. Our task is not to praise or punish its existence, but to learn why the approved path did not work, protect what must never be bypassed and decide which part of the operating system should change.",
        "Një operacion mund ta mbyllë ditën në kohë, ndërsa u kërkon njerëzve të vet ta korrigjojnë procesin vazhdimisht. Një informacion që mungon gjendet përmes një bisede shtesë. Një karrocë duhet kontrolluar sërish. Një dorëzim bëhet i përdorshëm nga dikush që e di çfarë u la jashtë. Raporti përfundimtar regjistron rezultatin, jo doemos mundin e harxhuar që rezultati të bëhej i mundur. Ky vëllim i njëmbëdhjetë hap ciklin e dytë të traktatit. Pyetja nën të gjitha është: sa nga ajo që e quajmë besueshmëri e procesit është në të vërtetë kompensim njerëzor i përsëritur? Jo çdo përshtatje është e gabuar. Puna gjithmonë ndryshon. Çështja është nëse menaxherët e dallojnë rregullimin e aftë brenda rregullave nga një shkurtesë e paautorizuar, dhe një korrigjim të përkohshëm nga një mundësi për riprojektim. Autori ka punuar në operacionet e miljes së fundit, në koordinimin pranë magazinës, në menaxhimin e shitjes me shumicë dhe në turnet e natës në hotel. Këto janë fusha të verifikuara, jo leje për të shpikur një ngjarje të emërtuar: skenat bashkojnë detyra të besueshme për të shpjeguar mekanizma, janë të shënuara si hipotetike dhe nuk zbulojnë identitete mysafirësh, sisteme operative private apo të dhëna tregtare të ndjeshme. Një zgjidhje e përkohshme mund të jetë paralajmërim, risi e dobishme ose shkelje e rrezikshme. Detyra jonë nuk është ta lavdërojmë apo ta ndëshkojmë ekzistencën e saj, por të mësojmë pse rruga e miratuar nuk funksionoi, të mbrojmë atë që nuk duhet anashkaluar kurrë dhe të vendosim cila pjesë e sistemit operativ duhet të ndryshojë.",
        "Ein Betrieb kann den Tag pünktlich beenden und dabei von seinen Menschen verlangen, den Prozess immer wieder zu korrigieren. Eine fehlende Information wird über ein zusätzliches Gespräch gefunden. Ein Wagen muss erneut geprüft werden. Eine Übergabe wird brauchbar, weil jemand weiß, was ausgelassen wurde. Der Abschlussbericht erfasst das Ergebnis, nicht unbedingt den Aufwand, der es möglich machte. Dieser elfte Band eröffnet den zweiten Zyklus des Traktats. Die Frage unter allen lautet: Wie viel von dem, was wir Prozesszuverlässigkeit nennen, ist in Wahrheit wiederholte menschliche Kompensation? Nicht jede Anpassung ist falsch. Arbeit schwankt immer. Es geht darum, ob Führungskräfte geschickte Anpassung innerhalb der Regeln von einer unbefugten Abkürzung unterscheiden, und eine vorläufige Korrektur von einer Gelegenheit zur Neugestaltung. Der Autor hat im Last-Mile-Betrieb, in lagernaher Koordination, im Großhandelsmanagement und in Hotelnachtschichten gearbeitet. Das sind geprüfte Bereiche, keine Erlaubnis, einen benannten Vorfall zu erfinden: Die Szenen verbinden plausible Aufgaben, um Mechanismen zu erklären, sind als hypothetisch gekennzeichnet und legen keine Gästeidentitäten, internen Systeme oder sensiblen Geschäftsdaten offen. Ein Workaround kann Warnung, nützliche Innovation oder gefährlicher Verstoß sein. Unsere Aufgabe ist nicht, seine Existenz zu loben oder zu bestrafen, sondern zu verstehen, warum der genehmigte Weg nicht funktionierte, zu schützen, was nie umgangen werden darf, und zu entscheiden, welcher Teil des Betriebssystems sich ändern muss."),
    },
    { id: "contents", type: "contents" },
    {
      id: "note",
      kicker: x("Research note", "Shënim kërkimor", "Forschungsnotiz"),
      title: [x("Evidence without", "Provë pa", "Belege ohne"), x("borrowed certainty", "siguri të huazuar", "geliehene Gewissheit")],
      lead: x(
        "Observation, theory, case studies and log analysis answer different questions; none establishes a universal exception rate.",
        "Vëzhgimi, teoria, studimet e rasteve dhe analiza e regjistrave u përgjigjen pyetjeve të ndryshme; asnjëra nuk vendos një normë universale përjashtimesh.",
        "Beobachtung, Theorie, Fallstudien und Log-Analyse beantworten verschiedene Fragen; keine begründet eine universelle Ausnahmequote."),
      blocks: [
        { type: "p", text: x(
          "In 2002 Tucker, Edmondson and Spear reported 197 hours of observation of hospital nurses. They studied how staff dealt with obstacles and why fixing immediate problems can obstruct organisational learning. The 197 hours are time observed, not a number of breakdowns or a percentage of harmful workarounds. Feldman and Pentland (2003) gave a conceptual account of organisational routines: the abstract understanding of a routine and its particular performances continually shape one another. Alter (2014) offers a theory of why people consider and perform workarounds. Neither contribution provides a tested causal estimate for the author's workplaces. Bartelheimer, Wolf and Beverungen (2023) examined nine workarounds across three cases in a two-year multiple-case study, tracing how temporary deviations can diffuse through observation and communication and sometimes affect procedures, IT artefacts and organisational arrangements. Van der Waal and colleagues, online in 2024 and in a 2025 issue, identified eleven workaround types in two hospital departments with a process-mining approach. These are different populations and outcomes. The numbers must not be combined.",
          "Më 2002 Tucker, Edmondson dhe Spear raportuan 197 orë vëzhgimi të infermiereve në spital. Ata studiuan si e përballonte stafi pengesat dhe pse ndreqja e problemeve të menjëhershme mund ta pengojë të mësuarit organizativ. 197 orët janë kohë e vëzhguar, jo numër prishjesh dhe as përqindje e zgjidhjeve të përkohshme të dëmshme. Feldman dhe Pentland (2003) dhanë një rrëfim konceptual të rutinave organizative: kuptimi abstrakt i një rutine dhe kryerjet e saj të veçanta e formojnë njëra-tjetrën vazhdimisht. Alter (2014) ofron një teori se pse njerëzit e shqyrtojnë dhe e kryejnë një zgjidhje të përkohshme. Asnjëra kontribut nuk jep një vlerësim shkakësor të provuar për vendet e punës të autorit. Bartelheimer, Wolf dhe Beverungen (2023) shqyrtuan nëntë zgjidhje të përkohshme në tri raste, në një studim dyvjeçar me shumë raste, duke gjurmuar si përhapen devijimet e përkohshme përmes vëzhgimit dhe komunikimit dhe ndonjëherë prekin procedurat, artefaktet e TI-së dhe rregullimet organizative. Van der Waal dhe kolegët, në internet më 2024 dhe në një numër të 2025-s, identifikuan njëmbëdhjetë tipe zgjidhjesh të përkohshme në dy reparte spitalore me nxjerrje procesesh. Këto janë popullata dhe rezultate të ndryshme. Numrat nuk duhen bashkuar.",
          "2002 berichteten Tucker, Edmondson und Spear über 197 Stunden Beobachtung von Pflegekräften im Krankenhaus. Sie untersuchten, wie das Personal mit Hindernissen umging und warum das Beheben unmittelbarer Probleme organisationales Lernen behindern kann. Die 197 Stunden sind Beobachtungszeit, keine Zahl von Störungen und kein Anteil schädlicher Workarounds. Feldman und Pentland (2003) gaben eine begriffliche Darstellung organisationaler Routinen: Das abstrakte Verständnis einer Routine und ihre konkreten Ausführungen formen einander fortlaufend. Alter (2014) bietet eine Theorie, warum Menschen Workarounds erwägen und ausführen. Keiner der Beiträge liefert eine geprüfte Kausalschätzung für die Arbeitsplätze des Autors. Bartelheimer, Wolf und Beverungen (2023) untersuchten in einer zweijährigen Mehrfallstudie neun Workarounds in drei Fällen und verfolgten, wie sich vorläufige Abweichungen über Beobachtung und Kommunikation verbreiten und mitunter Abläufe, IT-Artefakte und organisatorische Regelungen verändern. Van der Waal und Kollegen, online 2024 und in einer Ausgabe von 2025, fanden mit Process Mining elf Workaround-Typen in zwei Krankenhausabteilungen. Das sind verschiedene Populationen und Ergebnisse. Die Zahlen dürfen nicht verbunden werden.") },
        { type: "stats", cols: 3, items: [
          { n: "197 h", t: x("observation time in Tucker et al. (2002), not cases", "kohë vëzhgimi te Tucker et al. (2002), jo raste", "Beobachtungszeit bei Tucker et al. (2002), keine Fälle") },
          { n: "9", t: x("workarounds in a three-case, two-year study (2023)", "zgjidhje të përkohshme në një studim dyvjeçar me tri raste (2023)", "Workarounds in einer zweijährigen Studie mit drei Fällen (2023)") },
          { n: "11", t: x("workaround types in two hospital departments with SWORD (2025)", "tipe zgjidhjesh të përkohshme në dy reparte spitalore me SWORD (2025)", "Workaround-Typen in zwei Krankenhausabteilungen mit SWORD (2025)") },
        ] },
        { type: "p", text: x(
          "The templates and sample calculations in this edition are editorial proposals. They have not been validated as safety controls or tested to improve throughput, error rates or employee wellbeing in any named company. Where a source was read through the publisher's summary, the list of sources says so.",
          "Shabllonet dhe llogaritjet shembull në këtë botim janë propozime editoriale. Nuk janë vërtetuar si kontrolle sigurie dhe as janë provuar se përmirësojnë rrjedhën, normat e gabimeve apo mirëqenien e punonjësve në ndonjë kompani të emërtuar. Kur një burim është lexuar përmes përmbledhjes së botuesit, lista e burimeve e thotë.",
          "Die Vorlagen und Beispielrechnungen dieser Ausgabe sind redaktionelle Vorschläge. Sie wurden weder als Sicherheitskontrollen validiert noch daraufhin getestet, ob sie Durchsatz, Fehlerquoten oder das Wohl der Beschäftigten in einem benannten Unternehmen verbessern. Wo eine Quelle über die Zusammenfassung des Verlags gelesen wurde, sagt es das Quellenverzeichnis.") },
        { type: "callout", reading: true, text: x(
          "Do not carry a descriptive count from healthcare into a logistics KPI.",
          "Mos e bart një numërim përshkrues nga shëndetësia në një KPI logjistike.",
          "Übertragen Sie keine beschreibende Zahl aus dem Gesundheitswesen in eine Logistik-KPI.") },
      ],
      note: x(
        "Primary study records: Tucker et al. (2002); Bartelheimer et al. (2023); van der Waal et al. (2025). No field experiment was performed for this volume.",
        "Regjistrat parësorë të studimeve: Tucker et al. (2002); Bartelheimer et al. (2023); van der Waal et al. (2025). Për këtë vëllim nuk u krye asnjë eksperiment në terren.",
        "Primäre Studienangaben: Tucker et al. (2002); Bartelheimer et al. (2023); van der Waal et al. (2025). Für diesen Band wurde kein Feldexperiment durchgeführt."),
      source: ["tucker-edmondson-spear-2002", "bartelheimer-wolf-beverungen-2023", "van-der-waal-2025"],
    },

    // Chapter I. The work that was never in the SOP
    {
      id: "ch-i", type: "chapter", numeral: "I",
      title: x("The work that was never in the SOP", "Puna që nuk ishte kurrë në SOP", "Die Arbeit, die nie im SOP stand"),
      pages: [
        {
          id: "i-scene", layer: "scene", more: "a-good-sop-is-not-a-document",
          title: [x("A completed order,", "Një porosi e përfunduar,", "Ein erledigter Auftrag,"), x("an invisible repair", "një korrigjim i padukshëm", "eine unsichtbare Korrektur")],
          lead: x(
            "The loading point may look orderly only because someone corrected the handover before the next person saw it.",
            "Pika e ngarkimit mund të duket e rregullt vetëm sepse dikush e korrigjoi dorëzimin para se ta shihte personi tjetër.",
            "Die Ladestelle wirkt vielleicht nur deshalb geordnet, weil jemand die Übergabe korrigierte, bevor die nächste Person sie sah."),
          blocks: [
            { type: "flag", text: x("Hypothetical composite, not a reported loading incident", "Përbërje hipotetike, jo ngjarje e raportuar ngarkimi", "Hypothetische Zusammensetzung, kein gemeldeter Ladevorfall") },
            { type: "p", text: x(
              "A driver approaches the loading point. The plan says the order is ready, but a member of the team pauses to compare what is physically present with what the next stage expects. One item needs clarification. Someone who knows the usual arrangement asks a colleague, checks the right place and updates the next worker. The load eventually moves. The report will show a departure. It may show a delay. It probably will not describe the extra search, the unplanned conversation or the mental work of deciding whether the load was ready. Those actions occurred in the interval between the documented procedure and the work that made the procedure usable. There is no need to condemn the worker. A clarification may be the correct, authorised action. The diagnostic question is different: was that clarification a rare exception, or was it required because the agreed handover regularly failed to provide what the receiver needed? If the second holds, success on the departure board may be masking a cost borne by the team.",
              "Një shofer i afrohet pikës së ngarkimit. Plani thotë se porosia është gati, por një anëtar i ekipit ndalet për të krahasuar atë që është fizikisht aty me atë që pret faza tjetër. Një artikull ka nevojë për sqarim. Dikush që e di rregullimin e zakonshëm pyet një koleg, kontrollon vendin e duhur dhe e përditëson punonjësin tjetër. Ngarkesa më në fund niset. Raporti do të tregojë një nisje. Mund të tregojë një vonesë. Me gjasë nuk do ta përshkruajë kërkimin shtesë, bisedën e paplanifikuar apo punën mendore për të vendosur nëse ngarkesa ishte gati. Ato veprime ndodhën në hapësirën mes procedurës së dokumentuar dhe punës që e bëri procedurën të përdorshme. Nuk ka nevojë ta dënosh punonjësin. Një sqarim mund të jetë veprimi i saktë dhe i autorizuar. Pyetja diagnostike është tjetër: a ishte ai sqarim një përjashtim i rrallë, apo u desh sepse dorëzimi i rënë dakord rregullisht nuk i jepte marrësit atë që i duhej? Nëse vlen e dyta, suksesi në tabelën e nisjeve mund të fshehë një kosto që e mban ekipi.",
              "Ein Fahrer nähert sich der Ladestelle. Laut Plan ist der Auftrag bereit, doch ein Teammitglied hält inne, um zu vergleichen, was physisch vorhanden ist und was die nächste Stufe erwartet. Ein Artikel muss geklärt werden. Jemand, der die übliche Anordnung kennt, fragt eine Kollegin, prüft die richtige Stelle und informiert den Nächsten. Die Ladung fährt schließlich los. Der Bericht wird eine Abfahrt zeigen. Vielleicht eine Verspätung. Die zusätzliche Suche, das ungeplante Gespräch oder die Denkarbeit der Entscheidung, ob die Ladung bereit war, beschreibt er wahrscheinlich nicht. Diese Handlungen geschahen im Raum zwischen der dokumentierten Vorgehensweise und der Arbeit, die sie brauchbar machte. Niemand muss den Mitarbeiter verurteilen. Eine Klärung kann die richtige, befugte Handlung sein. Die diagnostische Frage ist eine andere: War diese Klärung eine seltene Ausnahme, oder war sie nötig, weil die vereinbarte Übergabe dem Empfänger regelmäßig nicht lieferte, was er brauchte? Gilt das Zweite, verdeckt der Erfolg auf der Abfahrtstafel womöglich Kosten, die das Team trägt.") },
            { type: "p", text: x(
              "The author's last-mile experience included missing bags, mixed trolleys, scanning discipline and loading coordination. It provides no case record of the particular correction in this scene, the person who performed it, its duration or its effect on departure; those details are invented solely to illustrate the mechanism.",
              "Përvoja e autorit në miljen e fundit përfshinte çanta që mungonin, karroca të përziera, disiplinë skanimi dhe koordinim ngarkimi. Ajo nuk jep asnjë regjistrim rasti për korrigjimin e veçantë të kësaj skene, për personin që e bëri, kohëzgjatjen apo efektin në nisje; ato hollësi janë shpikur vetëm për të ilustruar mekanizmin.",
              "Die Last-Mile-Erfahrung des Autors umfasste fehlende Taschen, gemischte Wagen, Scan-Disziplin und Ladekoordination. Sie liefert keine Fallakte zu der konkreten Korrektur in dieser Szene, zur Person, die sie ausführte, zu ihrer Dauer oder ihrer Wirkung auf die Abfahrt; diese Details sind allein zur Veranschaulichung erfunden.") },
            { type: "callout", reading: true, text: x(
              "The fact that work was delivered is not proof that the designed process delivered it without repair.",
              "Fakti që puna u dorëzua nuk është provë se procesi i projektuar e dorëzoi pa korrigjim.",
              "Dass die Arbeit geliefert wurde, beweist nicht, dass der entworfene Prozess sie ohne Korrektur geliefert hat.") },
          ],
          note: x(
            "The order, dialogue and outcome are constructed; the real occupational background is limited to documented last-mile work categories. The essay named below says why a good SOP is not a document.",
            "Porosia, dialogu dhe rezultati janë të ndërtuara; sfondi i vërtetë profesional kufizohet te kategoritë e dokumentuara të punës në miljen e fundit. Eseja e emërtuar më poshtë thotë pse një SOP e mirë nuk është dokument.",
            "Auftrag, Dialog und Ausgang sind konstruiert; der echte berufliche Hintergrund beschränkt sich auf dokumentierte Last-Mile-Arbeitskategorien. Der unten genannte Essay sagt, warum ein gutes SOP kein Dokument ist."),
        },
        {
          id: "i-concept", layer: "concept",
          title: [x("The routine", "Rutina", "Die Routine"), x("and its performance", "dhe kryerja e saj", "und ihre Ausführung")],
          lead: x(
            "A procedure describes what should be repeatable; work is the set of actions people actually perform in context.",
            "Një procedurë përshkruan atë që duhet të përsëritet; puna është tërësia e veprimeve që njerëzit kryejnë realisht në kontekst.",
            "Eine Vorgehensweise beschreibt, was wiederholbar sein soll; Arbeit ist die Gesamtheit der Handlungen, die Menschen im Kontext tatsächlich ausführen."),
          blocks: [
            { type: "p", text: x(
              "Feldman and Pentland (2003) distinguish the ostensive aspect of a routine, its abstract account, from the performative aspect, the actions taken by specific people at particular times. One is not simply a truthful blueprint and the other a faulty copy: repeated performances can maintain, adapt or change the understood routine. A staff member may discover that a recurring field is missing and add an informal clarification step. What looks like a deviation may reveal that the standard was written without enough attention to the receiving team's real information needs. But a boundary follows. Some standards protect safety, law, security or personal data; they are not optional because workers find another path faster. The purpose of observation is to discover the actual mechanism and classify it correctly, not to celebrate every shortcut. Follow one task from origin to recipient: what does the policy expect, what do staff really do, why does the difference exist, and is that variation permitted, temporary or prohibited?",
              "Feldman dhe Pentland (2003) e dallojnë aspektin ostensiv të një rutine, rrëfimin e saj abstrakt, nga aspekti performativ, veprimet e kryera nga njerëz të caktuar në kohë të caktuara. Njëri nuk është thjesht një plan i vërtetë dhe tjetri një kopje me të meta: kryerjet e përsëritura mund ta ruajnë, ta përshtatin ose ta ndryshojnë rutinën e kuptuar. Një punonjës mund të zbulojë se një fushë që përsëritet mungon dhe shton një hap sqarimi joformal. Ajo që duket devijim mund të tregojë se standardi u shkrua pa vëmendje të mjaftueshme për nevojat e vërteta të informacionit të ekipit marrës. Por pason një kufi. Disa standarde mbrojnë sigurinë, ligjin, mbrojtjen ose të dhënat personale; nuk bëhen fakultative sepse punonjësit gjejnë një rrugë më të shpejtë. Qëllimi i vëzhgimit është të zbulojë mekanizmin e vërtetë dhe ta klasifikojë saktë, jo të festojë çdo shkurtesë. Ndiq një detyrë nga burimi te marrësi: çfarë pret politika, çfarë bën realisht stafi, pse ekziston dallimi dhe a është ai ndryshim i lejuar, i përkohshëm apo i ndaluar?",
              "Feldman und Pentland (2003) unterscheiden den ostensiven Aspekt einer Routine, ihre abstrakte Darstellung, vom performativen Aspekt, den Handlungen bestimmter Menschen zu bestimmten Zeiten. Das eine ist nicht einfach ein wahrer Bauplan und das andere eine fehlerhafte Kopie: Wiederholte Ausführungen können die verstandene Routine erhalten, anpassen oder verändern. Eine Mitarbeiterin entdeckt vielleicht, dass ein wiederkehrendes Feld fehlt, und fügt einen informellen Klärungsschritt ein. Was wie eine Abweichung aussieht, kann zeigen, dass der Standard ohne genug Blick auf den echten Informationsbedarf des empfangenden Teams geschrieben wurde. Doch es folgt eine Grenze. Manche Standards schützen Sicherheit, Recht, Schutz oder personenbezogene Daten; sie werden nicht freiwillig, weil jemand einen schnelleren Weg findet. Beobachtung soll den tatsächlichen Mechanismus aufdecken und richtig einordnen, nicht jede Abkürzung feiern. Verfolgen Sie eine Aufgabe vom Ursprung bis zum Empfänger: Was erwartet die Regel, was tut das Personal wirklich, warum gibt es den Unterschied, und ist die Abweichung erlaubt, vorläufig oder verboten?") },
            { type: "cards", cols: 2, items: [
              { h: x("Ostensive routine", "Rutina ostensive", "Ostensive Routine"), p: x("What the organisation says the recurring work is.", "Çfarë thotë organizata se është puna që përsëritet.", "Was die Organisation über die wiederkehrende Arbeit sagt.") },
              { h: x("Performative routine", "Rutina performative", "Performative Routine"), p: x("What people actually do, with concrete constraints and knowledge.", "Çfarë bëjnë realisht njerëzit, me kufizime dhe njohuri konkrete.", "Was Menschen tatsächlich tun, mit konkreten Grenzen und Kenntnissen.") },
            ] },
            { type: "rows", compact: true, items: [
              { h: x("Written work", "Puna e shkruar", "Geschriebene Arbeit"), p: x("Instructions, roles, expected inputs and intended results.", "Udhëzime, role, të dhëna hyrëse të pritura dhe rezultate të synuara.", "Anweisungen, Rollen, erwartete Eingaben und beabsichtigte Ergebnisse.") },
              { h: x("Performed work", "Puna e kryer", "Ausgeführte Arbeit"), p: x("Observed sequence, clarifications, rechecks and handovers.", "Radha e vëzhguar, sqarimet, rikontrollet dhe dorëzimet.", "Beobachtete Abfolge, Klärungen, Nachprüfungen und Übergaben.") },
              { h: x("Difference", "Dallimi", "Unterschied"), p: x("A question for investigation, not immediate proof of failure.", "Pyetje për hetim, jo provë e menjëhershme dështimi.", "Eine Frage zur Untersuchung, kein sofortiger Beweis eines Versagens.") },
            ] },
            { type: "callout", reading: true, text: x(
              "A variance in performance is a starting point for explanation, not a verdict.",
              "Një ndryshim në kryerje është pikënisje për shpjegim, jo vendim gjyqi.",
              "Eine Abweichung in der Ausführung ist ein Ausgangspunkt für Erklärung, kein Urteil.") },
          ],
          note: x(
            "Feldman and Pentland (2003), Administrative Science Quarterly 48(1). The loading application and the three-row comparison are editorial.",
            "Feldman e Pentland (2003), Administrative Science Quarterly 48(1). Zbatimi te ngarkimi dhe krahasimi me tri rreshta janë editoriale.",
            "Feldman und Pentland (2003), Administrative Science Quarterly 48(1). Die Anwendung auf das Laden und der Vergleich in drei Zeilen sind redaktionell."),
          source: ["feldman-pentland-2003"],
        },
        {
          id: "i-protocol", layer: "protocol",
          title: [x("Compare the path", "Krahaso rrugën", "Den Weg vergleichen,"), x("people really use", "që njerëzit përdorin vërtet", "den Menschen wirklich gehen")],
          lead: x(
            "A minimal comparison of work as described and work as performed, before changing any SOP.",
            "Një krahasim minimal i punës siç përshkruhet dhe punës siç kryhet, para se të ndryshohet çdo SOP.",
            "Ein minimaler Vergleich von beschriebener und ausgeführter Arbeit, bevor ein SOP geändert wird."),
          blocks: [
            { type: "steps", items: [
              { h: x("Select one handover", "Zgjidh një dorëzim", "Eine Übergabe wählen"), p: x("Define the work item, the receiving person and the expected customer result.", "Përkufizo njësinë e punës, personin marrës dhe rezultatin e pritur për klientin.", "Arbeitseinheit, empfangende Person und erwartetes Kundenergebnis festlegen.") },
              { h: x("Read the current rule", "Lexo rregullin aktual", "Die geltende Regel lesen"), p: x("Record the authorised process and any mandatory controls.", "Shëno procesin e autorizuar dhe çdo kontroll të detyrueshëm.", "Den befugten Ablauf und alle Pflichtkontrollen festhalten.") },
              { h: x("Observe without guessing", "Vëzhgo pa hamendësuar", "Beobachten, ohne zu raten"), p: x("Describe the actual steps, including calls, checks and idle time.", "Përshkruaj hapat e vërtetë, përfshirë telefonatat, kontrollet dhe kohën e vdekur.", "Die tatsächlichen Schritte beschreiben, samt Anrufen, Prüfungen und Leerlauf.") },
              { h: x("Ask why the extra step exists", "Pyet pse ekziston hapi shtesë", "Fragen, warum der Zusatzschritt existiert"), p: x("Separate missing information, missing resources and local preference.", "Ndaj informacionin që mungon, burimet që mungojnë dhe preferencën lokale.", "Fehlende Information, fehlende Ressourcen und örtliche Vorliebe trennen.") },
              { h: x("Protect the boundary", "Mbro kufirin", "Die Grenze schützen"), p: x("Escalate unsafe or prohibited practices through authorised channels.", "Eskalo praktikat e pasigurta ose të ndaluara përmes kanaleve të autorizuara.", "Unsichere oder verbotene Praktiken über befugte Wege eskalieren.") },
              { h: x("Choose the next test", "Zgjidh provën e radhës", "Den nächsten Test wählen"), p: x("Confirm which part of the standard or workflow may need redesign.", "Konfirmo cila pjesë e standardit ose e rrjedhës së punës mund të ketë nevojë për riprojektim.", "Klären, welcher Teil des Standards oder Ablaufs neu gestaltet werden muss.") },
            ] },
            { type: "p", text: x(
              "Use a small, non-sensitive sample from one process and mark each extra action as observed, reported or not verified. In a protected area, study an anonymised description, never the guest, employee or transaction record. Do not rewrite the SOP because one operator prefers another sequence; first confirm that the standard is accurate, usable and still authorised.",
              "Përdor një mostër të vogël, jo të ndjeshme, nga një proces dhe shëno çdo veprim shtesë si të vëzhguar, të raportuar ose të paverifikuar. Në një zonë të mbrojtur, studio një përshkrim anonim, kurrë regjistrin e mysafirit, punonjësit apo transaksionit. Mos e rishkruaj SOP-në sepse një operator preferon një radhë tjetër; konfirmo së pari që standardi është i saktë, i përdorshëm dhe ende i autorizuar.",
              "Eine kleine, unsensible Stichprobe aus einem Prozess nutzen und jede Zusatzhandlung als beobachtet, berichtet oder ungeprüft markieren. In geschützten Bereichen eine anonymisierte Beschreibung untersuchen, nie den Gäste-, Personal- oder Transaktionsdatensatz. Das SOP nicht umschreiben, weil jemand eine andere Reihenfolge bevorzugt; zuerst klären, ob der Standard richtig, brauchbar und noch befugt ist.") },
            { type: "callout", reading: true, text: x(
              "Document the discrepancy before prescribing the correction.",
              "Dokumento mospërputhjen para se të përshkruash korrigjimin.",
              "Die Abweichung dokumentieren, bevor die Korrektur verordnet wird.") },
          ],
          note: x(
            "Editorial observation protocol informed by Feldman and Pentland (2003) and Tucker et al. (2002); not an employer-approved SOP.",
            "Protokoll editorial vëzhgimi i mbështetur te Feldman e Pentland (2003) dhe Tucker et al. (2002); jo SOP e miratuar nga punëdhënësi.",
            "Redaktionelles Beobachtungsprotokoll nach Feldman und Pentland (2003) und Tucker et al. (2002); kein vom Arbeitgeber genehmigtes SOP."),
          source: ["feldman-pentland-2003", "tucker-edmondson-spear-2002"],
        },
      ],
    },

    // Chapter II. The hero who hides the failure
    {
      id: "ch-ii", type: "chapter", numeral: "II",
      title: x("The hero who hides the failure", "Heroi që e fsheh dështimin", "Der Held, der den Fehler verdeckt"),
      pages: [
        {
          id: "ii-scene", layer: "scene", more: "why-the-handover-is-underrated",
          title: [x("The colleague", "Kolegu", "Die Kollegin,"), x("who always knows", "që gjithmonë e di", "die es immer weiß")],
          lead: x(
            "Good intentions can make a fragile process appear dependable for far longer than it is.",
            "Qëllimet e mira mund ta bëjnë një proces të brishtë të duket i besueshëm shumë më gjatë se ç'është.",
            "Gute Absichten können einen fragilen Prozess viel länger verlässlich erscheinen lassen, als er ist."),
          blocks: [
            { type: "flag", text: x("Hypothetical scene, not an account of a particular employee", "Skenë hipotetike, jo rrëfim për një punonjës të caktuar", "Hypothetische Szene, kein Bericht über eine bestimmte Person") },
            { type: "p", text: x(
              "The morning begins with a familiar obstacle. The information passed to the next team is incomplete. Rather than sending the work back, an experienced colleague knows which question to ask and whom to call. They correct the record, share the answer and return to the next task. Everyone appreciates the speed. The customer receives what was expected. Tomorrow the same obstacle appears. The colleague repairs it again. The weekly summary reports completed work. Nobody has deliberately falsified anything. Yet the organisation has made the same mistake twice, and the person who prevented visible failure has become part of the system's unrecorded capacity. Then the colleague is absent. The process has not suddenly deteriorated; its hidden dependency has become visible. Another worker cannot complete the same step because the explanatory knowledge was never built into the handover or the procedure.",
              "Mëngjesi nis me një pengesë të njohur. Informacioni që i kalon ekipit tjetër është i paplotë. Në vend që ta kthejë punën mbrapsht, një koleg me përvojë e di cilën pyetje të bëjë dhe kë të marrë në telefon. E korrigjon regjistrin, e ndan përgjigjen dhe kthehet te detyra tjetër. Të gjithë e vlerësojnë shpejtësinë. Klienti merr atë që priste. Nesër shfaqet e njëjta pengesë. Kolegu e ndreq sërish. Përmbledhja javore raporton punë të përfunduar. Askush nuk ka falsifikuar asgjë me qëllim. Megjithatë organizata e ka bërë të njëjtin gabim dy herë, dhe personi që e parandaloi dështimin e dukshëm është bërë pjesë e kapacitetit të paregjistruar të sistemit. Pastaj kolegu mungon. Procesi nuk është përkeqësuar papritur; varësia e tij e fshehur është bërë e dukshme. Një punonjës tjetër nuk e kryen dot të njëjtin hap, sepse dija shpjeguese nuk u ndërtua kurrë në dorëzim apo në procedurë.",
              "Der Morgen beginnt mit einem vertrauten Hindernis. Die Information an das nächste Team ist unvollständig. Statt die Arbeit zurückzuschicken, weiß eine erfahrene Kollegin, welche Frage sie stellen und wen sie anrufen muss. Sie korrigiert den Datensatz, teilt die Antwort und geht zur nächsten Aufgabe. Alle schätzen das Tempo. Der Kunde erhält, was er erwartet hat. Morgen taucht dasselbe Hindernis auf. Die Kollegin behebt es erneut. Die Wochenübersicht meldet erledigte Arbeit. Niemand hat absichtlich etwas gefälscht. Doch die Organisation hat denselben Fehler zweimal gemacht, und die Person, die das sichtbare Versagen verhinderte, ist Teil der unerfassten Kapazität des Systems geworden. Dann fehlt die Kollegin. Der Prozess hat sich nicht plötzlich verschlechtert; seine verborgene Abhängigkeit ist sichtbar geworden. Eine andere Person kann denselben Schritt nicht ausführen, weil das erklärende Wissen nie in die Übergabe oder die Vorgehensweise eingebaut wurde.") },
            { type: "p", text: x(
              "This is an invented story. The author has worked with practical SOPs and cross-shift information, but no evidence confirms this recurring correction or this colleague. The point is not that helpful staff cause problems. It is that a workplace can reward immediate problem resolution while failing to invest in preventing recurrence.",
              "Kjo është një histori e shpikur. Autori ka punuar me SOP praktike dhe me informacion ndërmjet turneve, por asnjë provë nuk e konfirmon këtë korrigjim të përsëritur apo këtë koleg. Pika nuk është se stafi që ndihmon krijon probleme. Është se një vend pune mund ta shpërblejë zgjidhjen e menjëhershme të problemit, ndërsa nuk investon në parandalimin e përsëritjes.",
              "Das ist eine erfundene Geschichte. Der Autor hat mit praktischen SOPs und schichtübergreifender Information gearbeitet, doch kein Beleg bestätigt diese wiederkehrende Korrektur oder diese Kollegin. Es geht nicht darum, dass hilfsbereite Menschen Probleme verursachen. Es geht darum, dass ein Arbeitsplatz sofortiges Problemlösen belohnen und zugleich versäumen kann, in die Vermeidung der Wiederholung zu investieren.") },
            { type: "callout", reading: true, text: x(
              "A person may protect today's customer while the process remains unchanged for tomorrow.",
              "Një person mund ta mbrojë klientin e sotëm, ndërsa procesi mbetet i pandryshuar për nesër.",
              "Ein Mensch kann den Kunden von heute schützen, während der Prozess für morgen unverändert bleibt.") },
          ],
          note: x(
            "Constructed narrative; Tucker, Edmondson and Spear (2002) motivate the distinction between an immediate fix and organisational learning. The essay named below is about the handover that carries what one person knows.",
            "Rrëfim i ndërtuar; Tucker, Edmondson e Spear (2002) e motivojnë dallimin mes ndreqjes së menjëhershme dhe të mësuarit organizativ. Eseja e emërtuar më poshtë flet për dorëzimin që mbart atë që di një person.",
            "Konstruierte Erzählung; Tucker, Edmondson und Spear (2002) begründen den Unterschied zwischen sofortiger Behebung und organisationalem Lernen. Der unten genannte Essay handelt von der Übergabe, die trägt, was eine Person weiß."),
          source: ["tucker-edmondson-spear-2002"],
        },
        {
          id: "ii-concept", layer: "concept",
          title: [x("First-order action,", "Veprimi i rendit të parë,", "Handeln erster Ordnung,"), x("second-order learning", "të mësuarit e rendit të dytë", "Lernen zweiter Ordnung")],
          lead: x(
            "Restoring the immediate task and removing the recurring obstacle are two different achievements.",
            "Rikthimi i detyrës së menjëhershme dhe heqja e pengesës që përsëritet janë dy arritje të ndryshme.",
            "Die unmittelbare Aufgabe wiederherzustellen und das wiederkehrende Hindernis zu beseitigen sind zwei verschiedene Leistungen."),
          blocks: [
            { type: "p", text: x(
              "Tucker, Edmondson and Spear (2002) observed hospital nurses for 197 hours and studied how frontline staff addressed obstacles in everyday work. Their analysis explains how the local success of quickly coping with a failure can reduce the chance that the organisation learns how to prevent it. It is a hospital study, not a count of warehouse exceptions. The useful distinction is between making the present case work and changing the conditions that produce the case. An employee may have no time or authority for a full root-cause investigation during a busy shift; a manager who wants second-order learning must provide a path through which evidence from the first repair reaches someone able to redesign the system. The two forms of action should not be confused or set in competition. An immediate repair may be essential for safety or service continuity, and a root-cause analysis that leaves the current customer unprotected is equally poor management. The sequence matters: contain risk, restore the permitted service, record the systemic obstacle, assign follow-through. If the only recognised performance is completion speed, reporting and prevention are crowded out. Learning has to count as real work, with time, ownership and feedback.",
              "Tucker, Edmondson dhe Spear (2002) vëzhguan infermiere spitali për 197 orë dhe studiuan si i trajtonte stafi i vijës së parë pengesat në punën e përditshme. Analiza e tyre shpjegon si suksesi lokal i përballimit të shpejtë të një dështimi mund ta ulë mundësinë që organizata të mësojë si ta parandalojë. Është studim spitalor, jo numërim përjashtimesh në magazinë. Dallimi i dobishëm është mes bërjes që rasti i tanishëm të funksionojë dhe ndryshimit të kushteve që e prodhojnë rastin. Një punonjës mund të mos ketë kohë apo autoritet për një hetim të plotë të shkakut rrënjësor gjatë një turni të ngarkuar; një menaxher që do të mësuarin e rendit të dytë duhet të krijojë një rrugë përmes së cilës prova nga korrigjimi i parë arrin te dikush që mund ta riprojektojë sistemin. Të dyja format e veprimit nuk duhen ngatërruar e as vënë në garë. Një korrigjim i menjëhershëm mund të jetë thelbësor për sigurinë ose vazhdimësinë e shërbimit, dhe një analizë e shkakut rrënjësor që e lë klientin e tanishëm pa mbrojtje është po aq menaxhim i dobët. Radha ka rëndësi: frenoje rrezikun, rikthe shërbimin e lejuar, regjistro pengesën sistemike, cakto ndjekjen. Nëse e vetmja performancë e njohur është shpejtësia e përfundimit, raportimi dhe parandalimi shtyhen mënjanë. Të mësuarit duhet të numërohet si punë e vërtetë, me kohë, pronësi dhe kthim informacioni.",
              "Tucker, Edmondson und Spear (2002) beobachteten Pflegekräfte im Krankenhaus 197 Stunden lang und untersuchten, wie Personal an vorderster Front Hindernisse im Arbeitsalltag anging. Ihre Analyse erklärt, wie der örtliche Erfolg, ein Versagen schnell zu bewältigen, die Chance verringern kann, dass die Organisation lernt, es zu verhindern. Es ist eine Krankenhausstudie, keine Zählung von Lagerausnahmen. Die nützliche Unterscheidung liegt zwischen dem Funktionieren des aktuellen Falls und der Änderung der Bedingungen, die den Fall erzeugen. Beschäftigte haben in einer vollen Schicht oft weder Zeit noch Befugnis für eine vollständige Ursachenanalyse; eine Führungskraft, die Lernen zweiter Ordnung will, muss einen Weg schaffen, auf dem der Beleg aus der ersten Korrektur jemanden erreicht, der das System neu gestalten kann. Beide Formen des Handelns sollten weder verwechselt noch gegeneinander ausgespielt werden. Eine sofortige Korrektur kann für Sicherheit oder Kontinuität des Service unverzichtbar sein, und eine Ursachenanalyse, die den aktuellen Kunden ungeschützt lässt, ist ebenso schlechte Führung. Die Reihenfolge zählt: Risiko eindämmen, den erlaubten Service wiederherstellen, das systemische Hindernis erfassen, die Nachverfolgung zuweisen. Zählt nur das Tempo der Erledigung, werden Melden und Vorbeugen verdrängt. Lernen muss als echte Arbeit gelten, mit Zeit, Verantwortung und Rückmeldung.") },
            { type: "chain", items: [
              { h: x("Now · restore", "Tani · rikthe", "Jetzt · wiederherstellen"), p: x("Help the present case within the approved standard.", "Ndihmo rastin e tanishëm brenda standardit të miratuar.", "Dem aktuellen Fall im genehmigten Standard helfen.") },
              { h: x("Next · explain", "Pastaj · shpjego", "Danach · erklären"), p: x("Record the verified recurring condition.", "Regjistro gjendjen e verifikuar që përsëritet.", "Die geprüfte wiederkehrende Bedingung erfassen.") },
              { h: x("Later · redesign", "Më vonë · riprojekto", "Später · neu gestalten"), p: x("Change the upstream cause and test the result.", "Ndrysho shkakun më lart në rrjedhë dhe provo rezultatin.", "Die vorgelagerte Ursache ändern und das Ergebnis prüfen.") },
            ] },
            { type: "callout", reading: true, text: x(
              "The issue is not heroism itself. It is an organisation that relies on heroism instead of repairing its process.",
              "Çështja nuk është vetë heroizmi. Është një organizatë që mbështetet te heroizmi në vend që ta ndreqë procesin e vet.",
              "Das Problem ist nicht das Heldentum selbst. Es ist eine Organisation, die sich auf Heldentum verlässt, statt ihren Prozess zu reparieren.") },
          ],
          note: x(
            "Tucker, Edmondson and Spear (2002), Journal of Organizational Change Management 15(2), 197 observed hours of nursing work. The application to other sectors is editorial.",
            "Tucker, Edmondson e Spear (2002), Journal of Organizational Change Management 15(2), 197 orë të vëzhguara të punës infermierore. Zbatimi në sektorë të tjerë është editorial.",
            "Tucker, Edmondson und Spear (2002), Journal of Organizational Change Management 15(2), 197 beobachtete Stunden Pflegearbeit. Die Anwendung auf andere Branchen ist redaktionell."),
          source: ["tucker-edmondson-spear-2002"],
        },
        {
          id: "ii-evidence", layer: "concept",
          title: [x("Why fixing fast", "Pse ndreqja e shpejtë", "Warum schnelles Beheben"), x("is not learning fast", "nuk është të mësuar i shpejtë", "kein schnelles Lernen ist")],
          lead: x(
            "Follow-up research described repeated interruptions at the boundary between required materials, information and frontline work.",
            "Kërkimi pasues përshkroi ndërprerje të përsëritura në kufirin mes materialeve të nevojshme, informacionit dhe punës së vijës së parë.",
            "Spätere Forschung beschrieb wiederholte Unterbrechungen an der Grenze zwischen benötigtem Material, Information und Arbeit an vorderster Front."),
          blocks: [
            { type: "p", text: x(
              "In a 2004 study of operational failures encountered by hospital nurses, Anita Tucker reported that in the studied setting most failures stemmed from breakdowns in the supply of materials and information across organisational boundaries, and that employees quickly compensated for most of them. With Edmondson (2003) she had already followed 26 nurses in nine hospitals for 239 hours and found that most responses restored the work without addressing the cause. These papers provide a mechanism, not evidence of how often last-mile drivers or night auditors meet the same problem. The cost of compensation has layers. The visible action may take a few minutes, but the worker also stops the planned task, finds someone with authority or knowledge, verifies an answer and re-enters the original activity; a time study that watches only the corrective motion misses coordination and switching costs. There is also an information cost. If the correction is silent, the process owner never receives reliable evidence that the input is systematically unfit for use. If every event is reported but no decision returns, reporting becomes another burden. This volume treats the recurring workaround as a clue that deserves two decisions, with possibly different owners and horizons: how to protect the current case, and whether the designed process should change.",
              "Në një studim të vitit 2004 për dështimet operacionale që hasnin infermieret në spital, Anita Tucker raportoi se në mjedisin e studiuar shumica e dështimeve vinin nga prishje në furnizimin me materiale dhe informacion përtej kufijve organizativë, dhe se punonjësit i kompensonin shpejt shumicën e tyre. Me Edmondson (2003) ajo kishte ndjekur tashmë 26 infermiere në nëntë spitale për 239 orë dhe kishte gjetur se shumica e reagimeve e rikthenin punën pa e trajtuar shkakun. Këto punime japin një mekanizëm, jo provë se sa shpesh e hasin të njëjtin problem shoferët e miljes së fundit apo auditorët e natës. Kostoja e kompensimit ka shtresa. Veprimi i dukshëm mund të zgjasë pak minuta, por punonjësi ndalon edhe detyrën e planifikuar, gjen dikë me autoritet ose dije, verifikon një përgjigje dhe rihyn në veprimtarinë fillestare; një studim kohe që sheh vetëm lëvizjen korrigjuese i humbet kostot e koordinimit dhe të kalimit. Ka edhe një kosto informacioni. Nëse korrigjimi bëhet në heshtje, pronari i procesit nuk merr kurrë provë të besueshme se të dhënat hyrëse janë sistematikisht të papërdorshme. Nëse raportohet çdo ngjarje, por nuk kthehet asnjë vendim, raportimi bëhet barrë tjetër. Ky vëllim e trajton zgjidhjen e përkohshme që përsëritet si gjurmë që meriton dy vendime, ndoshta me pronarë dhe horizonte të ndryshme: si të mbrohet rasti i tanishëm, dhe nëse procesi i projektuar duhet të ndryshojë.",
              "In einer Studie von 2004 über betriebliche Störungen, denen Pflegekräfte im Krankenhaus begegneten, berichtete Anita Tucker, dass im untersuchten Umfeld die meisten Störungen aus Unterbrechungen der Material- und Informationsversorgung über Organisationsgrenzen hinweg stammten und dass die Beschäftigten die meisten schnell ausglichen. Mit Edmondson (2003) hatte sie bereits 26 Pflegekräfte in neun Krankenhäusern 239 Stunden lang begleitet und festgestellt, dass die meisten Reaktionen die Arbeit wiederherstellten, ohne die Ursache anzugehen. Diese Arbeiten liefern einen Mechanismus, keinen Beleg, wie oft Last-Mile-Fahrer oder Nachtauditoren auf dasselbe Problem stoßen. Die Kosten der Kompensation haben Schichten. Die sichtbare Handlung dauert vielleicht wenige Minuten, doch die Person unterbricht auch die geplante Aufgabe, sucht jemanden mit Befugnis oder Wissen, prüft eine Antwort und kehrt zur ursprünglichen Tätigkeit zurück; eine Zeitstudie, die nur die Korrekturbewegung sieht, übersieht Koordinations- und Wechselkosten. Hinzu kommen Informationskosten. Geschieht die Korrektur still, erhält die Prozessverantwortliche nie einen verlässlichen Beleg, dass die Eingabe systematisch unbrauchbar ist. Wird jedes Ereignis gemeldet, aber keine Entscheidung kommt zurück, wird das Melden zur weiteren Last. Dieser Band behandelt den wiederkehrenden Workaround als Hinweis, der zwei Entscheidungen verdient, womöglich mit verschiedenen Verantwortlichen und Horizonten: wie der aktuelle Fall geschützt wird, und ob der entworfene Prozess sich ändern sollte.") },
            { type: "stat", n: "197 h", t: x(
              "of direct observation in the 2002 nursing study (Tucker, Edmondson and Spear): observation time only, not a number of failures.",
              "vëzhgim i drejtpërdrejtë në studimin infermieror të 2002-s (Tucker, Edmondson e Spear): vetëm kohë vëzhgimi, jo numër dështimesh.",
              "direkte Beobachtung in der Pflegestudie von 2002 (Tucker, Edmondson und Spear): nur Beobachtungszeit, keine Zahl von Störungen.") },
            { type: "callout", reading: true, text: x(
              "A completed correction belongs in the operational account. Its recurring cause belongs in the improvement account.",
              "Një korrigjim i kryer i përket llogarisë operacionale. Shkaku i tij që përsëritet i përket llogarisë së përmirësimit.",
              "Eine erledigte Korrektur gehört in das Betriebskonto. Ihre wiederkehrende Ursache gehört in das Verbesserungskonto.") },
          ],
          note: x(
            "Tucker et al. (2002); Tucker and Edmondson (2003), California Management Review 45(2); Tucker (2004), Journal of Operations Management 22(2). Findings apply to the hospital contexts studied.",
            "Tucker et al. (2002); Tucker e Edmondson (2003), California Management Review 45(2); Tucker (2004), Journal of Operations Management 22(2). Gjetjet vlejnë për mjediset spitalore të studiuara.",
            "Tucker et al. (2002); Tucker und Edmondson (2003), California Management Review 45(2); Tucker (2004), Journal of Operations Management 22(2). Die Befunde gelten für die untersuchten Krankenhausumfelder."),
          source: ["tucker-edmondson-spear-2002", "tucker-edmondson-2003", "tucker-2004"],
        },
        {
          id: "ii-protocol", layer: "protocol",
          title: [x("Protect the worker.", "Mbro punonjësin.", "Die Person schützen."), x("Surface the defect.", "Nxirr në dritë defektin.", "Den Mangel zeigen.")],
          lead: x(
            "An immediate fix and an improvement ticket need different questions and different owners.",
            "Një ndreqje e menjëhershme dhe një kërkesë përmirësimi kanë nevojë për pyetje të ndryshme dhe pronarë të ndryshëm.",
            "Sofortige Behebung und Verbesserungsauftrag brauchen andere Fragen und andere Verantwortliche."),
          blocks: [
            { type: "steps", items: [
              { h: x("Restore safely", "Rikthe në mënyrë të sigurt", "Sicher wiederherstellen"), p: x("Resolve or contain the current issue within policy and delegated authority.", "Zgjidhe ose frenoje çështjen aktuale brenda politikës dhe autoritetit të deleguar.", "Das aktuelle Problem im Rahmen von Regeln und Befugnis lösen oder eindämmen.") },
              { h: x("Capture the trigger", "Kap shkaktarin", "Den Auslöser festhalten"), p: x("Name the missing input, constraint or rule that made the extra action necessary.", "Emërto të dhënën, kufizimin ose rregullin që mungonte dhe e bëri të nevojshëm veprimin shtesë.", "Fehlende Eingabe, Grenze oder Regel benennen, die den Zusatz nötig machte.") },
              { h: x("Count recurrence", "Numëro përsëritjen", "Wiederholung zählen"), p: x("Observe repeated appearances with a consistent event definition.", "Vëzhgo shfaqjet e përsëritura me një përkufizim të qëndrueshëm të ngjarjes.", "Wiederholtes Auftreten mit einer einheitlichen Ereignisdefinition beobachten.") },
              { h: x("Assign an improvement owner", "Cakto një pronar përmirësimi", "Eine Verbesserungsverantwortliche bestimmen"), p: x("Give the systemic condition to a person able to change it.", "Jepja gjendjen sistemike një personi që mund ta ndryshojë.", "Die systemische Bedingung einer Person geben, die sie ändern kann.") },
              { h: x("Return the decision", "Ktheje vendimin", "Die Entscheidung zurückmelden"), p: x("Tell affected staff what will change, what cannot change and why.", "Thuaju stafit të prekur çfarë do të ndryshojë, çfarë nuk mund të ndryshojë dhe pse.", "Den Betroffenen sagen, was sich ändert, was sich nicht ändern kann und warum.") },
              { h: x("Retest without the expert", "Riprovo pa ekspertin", "Ohne die Expertin erneut testen"), p: x("Check whether the redesigned process works for another trained worker.", "Kontrollo nëse procesi i riprojektuar funksionon për një punonjës tjetër të trajnuar.", "Prüfen, ob der neu gestaltete Prozess für eine andere geschulte Person funktioniert.") },
            ] },
            { type: "p", text: x(
              "Do not turn every helpful correction into an accusation; prohibited shortcuts go separately through the formal controls. A useful indicator is not how many people performed workarounds, but the share of verified, recurring obstacles that receive a decision and a later check of whether the workaround is still needed. Open cases stay in the denominator, or success is manufactured by leaving unresolved work out.",
              "Mos e kthe çdo korrigjim ndihmues në akuzë; shkurtesat e ndaluara kalojnë veçmas përmes kontrolleve formale. Një tregues i dobishëm nuk është sa njerëz bënë zgjidhje të përkohshme, por pjesa e pengesave të verifikuara që përsëriten, të cilat marrin një vendim dhe një kontroll të mëvonshëm nëse zgjidhja duhet ende. Rastet e hapura mbeten në emërues, përndryshe suksesi fabrikohet duke lënë jashtë punën e pazgjidhur.",
              "Nicht jede hilfreiche Korrektur zur Anklage machen; verbotene Abkürzungen laufen getrennt über die formalen Kontrollen. Ein nützlicher Indikator ist nicht, wie viele Menschen Workarounds ausführten, sondern der Anteil geprüfter, wiederkehrender Hindernisse mit Entscheidung und späterer Prüfung, ob der Workaround noch nötig ist. Offene Fälle bleiben im Nenner, sonst entsteht Erfolg durch Weglassen ungelöster Arbeit.") },
            { type: "callout", reading: true, text: x(
              "Recognition should reward the person who made the constraint visible, not only the one who kept it invisible.",
              "Mirënjohja duhet ta shpërblejë personin që e bëri kufizimin të dukshëm, jo vetëm atë që e mbajti të padukshëm.",
              "Anerkennung gebührt der Person, die die Grenze sichtbar machte, nicht nur der, die sie verbarg.") },
          ],
          note: x(
            "Original editorial protocol informed by Tucker et al. (2002) and Tucker (2004); the proposed measures are not validated in a named workplace.",
            "Protokoll editorial origjinal i mbështetur te Tucker et al. (2002) dhe Tucker (2004); matjet e propozuara nuk janë vërtetuar në një vend pune të emërtuar.",
            "Eigenes redaktionelles Protokoll nach Tucker et al. (2002) und Tucker (2004); die vorgeschlagenen Maße sind an keinem benannten Arbeitsplatz validiert."),
          source: ["tucker-edmondson-spear-2002", "tucker-2004"],
        },
      ],
    },

    // Chapter III. The anatomy of a workaround
    {
      id: "ch-iii", type: "chapter", numeral: "III",
      title: x("The anatomy of a workaround", "Anatomia e një zgjidhjeje të përkohshme", "Die Anatomie eines Workarounds"),
      pages: [
        {
          id: "iii-scene", layer: "scene", more: "the-tools-you-build-yourself",
          title: [x("A small list", "Një listë e vogël", "Eine kleine Liste"), x("beside the system", "pranë sistemit", "neben dem System")],
          lead: x(
            "A separate note can be a sensible learning aid or an unauthorised second source of operational truth.",
            "Një shënim më vete mund të jetë ndihmë e arsyeshme për të mësuar ose një burim i dytë i paautorizuar i së vërtetës operacionale.",
            "Eine separate Notiz kann eine sinnvolle Lernhilfe sein oder eine unbefugte zweite Quelle betrieblicher Wahrheit."),
          blocks: [
            { type: "flag", text: x("Hypothetical composite, no guest or internal data", "Përbërje hipotetike, pa të dhëna mysafirësh apo të brendshme", "Hypothetische Zusammensetzung, keine Gäste- oder internen Daten") },
            { type: "p", text: x(
              "A new employee opens the official system and needs to complete a routine task. The procedure is correct but difficult to find. A colleague has made a small personal reference: a few steps, a note about where the approved instruction lives, perhaps a sketch of the decision sequence. It makes learning easier. Now imagine a different version. The same personal note starts recording real cases, assumes a system status or tells people to skip a mandatory approval. What began as a convenience has become a second operating system, one without governance. The two versions may look similar from a distance. Their risk is not the same. The question is not whether staff may learn from their own notes. It is what a note is doing: supporting authorised work, compensating for poor system design, or silently replacing a controlled decision.",
              "Një punonjës i ri hap sistemin zyrtar dhe duhet të kryejë një detyrë rutinë. Procedura është e saktë, por e vështirë për t'u gjetur. Një koleg ka bërë një referencë të vogël personale: disa hapa, një shënim se ku ndodhet udhëzimi i miratuar, ndoshta një skicë e radhës së vendimeve. E bën më të lehtë të mësuarit. Tani imagjino një version tjetër. I njëjti shënim personal nis të regjistrojë raste të vërteta, supozon një status sistemi ose u thotë njerëzve ta kapërcejnë një miratim të detyrueshëm. Ajo që nisi si lehtësi është bërë një sistem i dytë operativ, pa qeverisje. Dy versionet mund të duken të ngjashme nga larg. Rreziku i tyre nuk është i njëjti. Pyetja nuk është nëse stafi mund të mësojë nga shënimet e veta. Është çfarë po bën një shënim: po e mbështet punën e autorizuar, po kompenson një projektim të dobët sistemi, apo po zëvendëson në heshtje një vendim të kontrolluar.",
              "Ein neuer Mitarbeiter öffnet das offizielle System und muss eine Routineaufgabe erledigen. Die Vorgehensweise ist richtig, aber schwer zu finden. Eine Kollegin hat eine kleine persönliche Hilfe angelegt: ein paar Schritte, ein Hinweis, wo die genehmigte Anweisung liegt, vielleicht eine Skizze der Entscheidungsfolge. Sie erleichtert das Lernen. Nun eine andere Version. Dieselbe persönliche Notiz beginnt echte Fälle zu erfassen, unterstellt einen Systemstatus oder sagt, eine Pflichtfreigabe zu überspringen. Was als Erleichterung begann, ist ein zweites Betriebssystem geworden, eines ohne Steuerung. Aus der Ferne sehen beide Versionen ähnlich aus. Ihr Risiko ist nicht dasselbe. Die Frage ist nicht, ob Beschäftigte aus eigenen Notizen lernen dürfen. Sie lautet, was eine Notiz tut: befugte Arbeit unterstützen, schlechtes Systemdesign ausgleichen oder still eine kontrollierte Entscheidung ersetzen.") },
            { type: "p", text: x(
              "The author developed Front Desk Control as an aid for finding SOPs and learning material in hotel work. Its documented purpose was organisation and retrieval, not replacement of the official property-management system. There is no confirmed management approval, shared operational adoption or measured productivity benefit, and this scene is not evidence that sensitive data were entered into that project.",
              "Autori e zhvilloi Front Desk Control si ndihmë për të gjetur SOP dhe material mësimor në punën e hotelit. Qëllimi i tij i dokumentuar ishte organizimi dhe gjetja, jo zëvendësimi i sistemit zyrtar të menaxhimit të pronës. Nuk ka miratim të konfirmuar nga drejtimi, përdorim operacional të përbashkët apo përfitim të matur produktiviteti, dhe kjo skenë nuk është provë se në atë projekt janë futur të dhëna të ndjeshme.",
              "Der Autor entwickelte Front Desk Control als Hilfe, um SOPs und Lernmaterial in der Hotelarbeit zu finden. Sein dokumentierter Zweck war Ordnung und Auffinden, nicht der Ersatz des offiziellen Hotelsystems. Es gibt keine bestätigte Freigabe der Leitung, keine gemeinsame betriebliche Nutzung und keinen gemessenen Produktivitätsgewinn, und diese Szene belegt nicht, dass sensible Daten in dieses Projekt eingegeben wurden.") },
            { type: "callout", reading: true, text: x(
              "A workaround becomes significant at the point where it changes a protected fact, action or authority.",
              "Një zgjidhje e përkohshme bëhet e rëndësishme në pikën ku ndryshon një fakt, veprim apo autoritet të mbrojtur.",
              "Ein Workaround wird dort bedeutsam, wo er eine geschützte Tatsache, Handlung oder Befugnis verändert.") },
          ],
          note: x(
            "Constructed scene referencing a documented personal learning-tool project, without claiming operational use or security guarantees. The essay named below sets out when a personal tool may be shared.",
            "Skenë e ndërtuar që i referohet një projekti të dokumentuar personal mjeti mësimor, pa pretenduar përdorim operacional apo garanci sigurie. Eseja e emërtuar më poshtë tregon kur mund të ndahet një mjet personal.",
            "Konstruierte Szene mit Bezug auf ein dokumentiertes persönliches Lernwerkzeug, ohne betriebliche Nutzung oder Sicherheitsgarantien zu behaupten. Der unten genannte Essay zeigt, wann ein persönliches Werkzeug geteilt werden darf."),
        },
        {
          id: "iii-concept", layer: "concept",
          title: [x("Why workarounds", "Pse lindin", "Warum Workarounds"), x("emerge", "zgjidhjet e përkohshme", "entstehen")],
          lead: x(
            "Steven Alter treats workarounds as responses to constraints in a work system, not as one homogeneous category of misconduct.",
            "Steven Alter i trajton zgjidhjet e përkohshme si përgjigje ndaj kufizimeve në një sistem pune, jo si një kategori e njëtrajtshme sjelljeje të gabuar.",
            "Steven Alter behandelt Workarounds als Antworten auf Grenzen in einem Arbeitssystem, nicht als einheitliche Kategorie von Fehlverhalten."),
          blocks: [
            { type: "p", text: x(
              "Alter's 2014 Theory of Workarounds examines how circumstances, perceived obstacles, goals and the costs of possible alternatives shape the decision to deviate from a normal work process. The theory is integrative: it explains why workarounds are considered and performed, not that each one is safe or productive. In practice we can examine four pressures without presuming motives. The formal process may be hard to execute because an input is missing. A system may lack a useful field or present information at the wrong moment. Volume and deadlines may intensify local improvisation. The organisation may reward completion while leaving exception resolution unowned. There is a sharp difference between adaptation within authorised discretion and a workaround that bypasses a required control. The first may be an expected part of a flexible standard; the second may be urgent even if its immediate outcome looks successful. Halbesleben, Wakefield and Wakefield (2008) review how workarounds in health care can carry patient-safety consequences. A good intention does not certify the method, and a deviation alone does not prove disregard for quality.",
              "Teoria e zgjidhjeve të përkohshme e Alter-it, e vitit 2014, shqyrton si rrethanat, pengesat e perceptuara, qëllimet dhe kostot e alternativave të mundshme e formojnë vendimin për t'u larguar nga një proces normal pune. Teoria është integruese: shpjegon pse shqyrtohen dhe kryhen zgjidhjet e përkohshme, jo se secila është e sigurt apo produktive. Në praktikë mund të shqyrtojmë katër presione pa supozuar motive. Procesi formal mund të jetë i vështirë sepse mungon një e dhënë. Një sistem mund të mos ketë një fushë të dobishme ose ta japë informacionin në çastin e gabuar. Vëllimi dhe afatet mund ta shtojnë improvizimin lokal. Organizata mund ta shpërblejë përfundimin, ndërsa zgjidhja e përjashtimeve mbetet pa pronar. Ka dallim të prerë mes përshtatjes brenda lirisë së autorizuar dhe një zgjidhjeje të përkohshme që anashkalon një kontroll të detyrueshëm. E para mund të jetë pjesë e pritshme e një standardi fleksibël; e dyta mund të jetë urgjente edhe kur rezultati i saj i menjëhershëm duket i suksesshëm. Halbesleben, Wakefield dhe Wakefield (2008) shqyrtojnë si zgjidhjet e përkohshme në shëndetësi mund të kenë pasoja për sigurinë e pacientit. Një qëllim i mirë nuk e certifikon metodën, dhe një devijim më vete nuk provon mospërfillje për cilësinë.",
              "Alters Theory of Workarounds von 2014 untersucht, wie Umstände, wahrgenommene Hindernisse, Ziele und die Kosten möglicher Alternativen die Entscheidung prägen, von einem normalen Arbeitsprozess abzuweichen. Die Theorie ist integrierend: Sie erklärt, warum Workarounds erwogen und ausgeführt werden, nicht dass jeder sicher oder produktiv ist. In der Praxis lassen sich vier Drücke prüfen, ohne Motive zu unterstellen. Der formale Prozess ist schwer auszuführen, weil eine Eingabe fehlt. Einem System fehlt ein nützliches Feld, oder es zeigt Information im falschen Moment. Menge und Fristen verstärken örtliche Improvisation. Die Organisation belohnt Erledigung und lässt die Klärung von Ausnahmen ohne Verantwortliche. Es besteht ein scharfer Unterschied zwischen Anpassung im befugten Ermessen und einem Workaround, der eine Pflichtkontrolle umgeht. Das Erste kann erwarteter Teil eines flexiblen Standards sein; das Zweite kann dringend sein, auch wenn sein unmittelbares Ergebnis erfolgreich aussieht. Halbesleben, Wakefield und Wakefield (2008) zeigen in ihrer Übersicht, wie Workarounds im Gesundheitswesen Folgen für die Patientensicherheit haben können. Eine gute Absicht beglaubigt die Methode nicht, und eine Abweichung allein beweist keine Missachtung der Qualität.") },
            { type: "rows", compact: true, items: [
              { h: x("Constraint", "Kufizimi", "Grenze"), p: x("What prevented the approved path from producing the needed result?", "Çfarë e pengoi rrugën e miratuar të jepte rezultatin e nevojshëm?", "Was hinderte den genehmigten Weg, das nötige Ergebnis zu liefern?") },
              { h: x("Alternative", "Alternativa", "Alternative"), p: x("What different action was taken, if any?", "Çfarë veprimi tjetër u ndërmor, nëse u ndërmor?", "Welche andere Handlung wurde gewählt, falls überhaupt?") },
              { h: x("Boundary", "Kufiri", "Begrenzung"), p: x("Was it permitted, restricted or expressly prohibited?", "A ishte e lejuar, e kufizuar apo shprehimisht e ndaluar?", "War sie erlaubt, eingeschränkt oder ausdrücklich verboten?") },
              { h: x("Consequence", "Pasoja", "Folge"), p: x("What did the next worker or customer actually experience?", "Çfarë përjetoi realisht punonjësi tjetër apo klienti?", "Was erlebte die nächste Person oder der Kunde tatsächlich?") },
            ] },
            { type: "callout", reading: true, text: x(
              "Start by naming the constraint. Do not start by guessing the worker's character.",
              "Nis duke e emërtuar kufizimin. Mos nis duke hamendësuar karakterin e punonjësit.",
              "Beginnen Sie damit, die Grenze zu benennen. Nicht damit, den Charakter der Person zu erraten.") },
          ],
          note: x(
            "Alter (2014), Communications of the Association for Information Systems 34, article 55; Halbesleben et al. (2008), Health Care Management Review 33(1), on safety concerns. The four questions are editorial.",
            "Alter (2014), Communications of the Association for Information Systems 34, artikulli 55; Halbesleben et al. (2008), Health Care Management Review 33(1), për shqetësimet e sigurisë. Katër pyetjet janë editoriale.",
            "Alter (2014), Communications of the Association for Information Systems 34, Artikel 55; Halbesleben et al. (2008), Health Care Management Review 33(1), zu Sicherheitsbedenken. Die vier Fragen sind redaktionell."),
          source: ["alter-2014", "halbesleben-2008"],
        },
        {
          id: "iii-framework", layer: "concept",
          title: [x("Four exceptions,", "Katër përjashtime,", "Vier Ausnahmen,"), x("four responses", "katër përgjigje", "vier Antworten")],
          lead: x(
            "A working classification for discussion, not a validated taxonomy or permission to bypass controls.",
            "Një klasifikim pune për diskutim, jo taksonomi e vërtetuar dhe as leje për të anashkaluar kontrollet.",
            "Eine Arbeitseinteilung fürs Gespräch, keine validierte Taxonomie und keine Erlaubnis zur Umgehung."),
          blocks: [
            { type: "p", text: x(
              "The four categories below are editorial: they translate published insights into a practical conversation about governance, and are not a classification measured by Alter or a regulatory definition. An authorised adjustment stays inside an approved range of discretion. A compensating workaround keeps work moving because a process input is inadequate. A candidate innovation points to a possibly better practice but requires testing and approval. A prohibited bypass crosses a control designed to protect people, confidentiality, quality or lawful authority. The categories can overlap, and the classification stays provisional until the actual mechanism is checked. An unfamiliar sequence may be an approved exception the supervisor never learned; a fast result may conceal a breach. Ask for the current standard and the actual delegated authority before judging.",
              "Katër kategoritë më poshtë janë editoriale: i përkthejnë njohuritë e botuara në një bisedë praktike për qeverisjen, dhe nuk janë klasifikim i matur nga Alter apo përkufizim rregullator. Një rregullim i autorizuar qëndron brenda një hapësire të miratuar lirie veprimi. Një zgjidhje e përkohshme kompensuese e mban punën në lëvizje, sepse një e dhënë e procesit është e pamjaftueshme. Një risi kandidate tregon drejt një praktike ndoshta më të mirë, por kërkon provë dhe miratim. Një anashkalim i ndaluar kalon një kontroll të projektuar për të mbrojtur njerëzit, konfidencialitetin, cilësinë ose autoritetin e ligjshëm. Kategoritë mund të mbivendosen, dhe klasifikimi mbetet i përkohshëm derisa të kontrollohet mekanizmi i vërtetë. Një radhë e panjohur mund të jetë përjashtim i miratuar që mbikëqyrësi nuk e mësoi kurrë; një rezultat i shpejtë mund të fshehë një shkelje. Kërko standardin aktual dhe autoritetin e vërtetë të deleguar para se të gjykosh.",
              "Die vier Kategorien unten sind redaktionell: Sie übersetzen veröffentlichte Einsichten in ein praktisches Gespräch über Steuerung und sind weder eine von Alter gemessene Einteilung noch eine regulatorische Definition. Eine befugte Anpassung bleibt in einem genehmigten Ermessensrahmen. Ein ausgleichender Workaround hält die Arbeit in Gang, weil eine Prozesseingabe unzureichend ist. Eine Innovationskandidatin weist auf eine womöglich bessere Praxis, braucht aber Test und Freigabe. Eine verbotene Umgehung überschreitet eine Kontrolle zum Schutz von Menschen, Vertraulichkeit, Qualität oder rechtmäßiger Befugnis. Die Kategorien überschneiden sich mitunter; die Einordnung bleibt vorläufig, bis der Mechanismus geprüft ist. Eine ungewohnte Abfolge kann eine genehmigte Ausnahme sein, die die Vorgesetzte nie kennengelernt hat; ein schnelles Ergebnis kann einen Verstoß verbergen. Vor dem Urteil nach dem geltenden Standard und der tatsächlich übertragenen Befugnis fragen.") },
            { type: "cards", cols: 3, items: [
              { h: x("Approved flexibility", "Fleksibilitet i miratuar", "Genehmigte Flexibilität"), p: x("A documented choice within delegated limits.", "Një zgjedhje e dokumentuar brenda kufijve të deleguar.", "Eine dokumentierte Wahl in übertragenen Grenzen.") },
              { h: x("Compensation", "Kompensim", "Ausgleich"), p: x("An extra step used because required inputs are unreliable.", "Një hap shtesë i përdorur sepse të dhënat e nevojshme janë të pabesueshme.", "Ein Zusatzschritt, weil nötige Eingaben unzuverlässig sind.") },
              { h: x("Innovation candidate", "Risi kandidate", "Innovationskandidat"), p: x("A better route proposed for controlled validation.", "Një rrugë më e mirë e propozuar për vërtetim të kontrolluar.", "Ein besserer Weg, vorgeschlagen zur kontrollierten Prüfung.") },
            ] },
            { type: "callout", label: x("04 · Prohibited bypass", "04 · Anashkalim i ndaluar", "04 · Verbotene Umgehung"), text: x(
              "A mandatory safety, legal, access, privacy or financial control cannot be waived by an informal workaround. Follow authorised escalation immediately.",
              "Një kontroll i detyrueshëm sigurie, ligjor, aksesi, privatësie apo financiar nuk mund të shmanget nga një zgjidhje e përkohshme joformale. Ndiq menjëherë eskalimin e autorizuar.",
              "Keine Pflichtkontrolle zu Sicherheit, Recht, Zugang, Datenschutz oder Finanzen wird durch einen informellen Workaround aufgehoben. Sofort befugt eskalieren.") },
            { type: "callout", reading: true, text: x(
              "Context determines whether a deviation is acceptable; speed alone never does.",
              "Konteksti vendos nëse një devijim është i pranueshëm; shpejtësia vetëm nuk e vendos kurrë.",
              "Ob eine Abweichung annehmbar ist, entscheidet der Kontext, nie das Tempo.") },
          ],
          note: x(
            "Editorial synthesis after Alter (2014), Halbesleben et al. (2008) and Bartelheimer et al. (2023); the categories are proposed, not empirically validated.",
            "Sintezë editoriale sipas Alter (2014), Halbesleben et al. (2008) dhe Bartelheimer et al. (2023); kategoritë janë të propozuara, jo të vërtetuara empirikisht.",
            "Redaktionelle Synthese nach Alter (2014), Halbesleben et al. (2008) und Bartelheimer et al. (2023); die Kategorien sind vorgeschlagen, nicht empirisch validiert."),
          source: ["alter-2014", "halbesleben-2008", "bartelheimer-wolf-beverungen-2023"],
        },
        {
          id: "iii-model", layer: "concept",
          title: [x("Twenty deviations,", "Njëzet devijime,", "Zwanzig Abweichungen,"), x("sorted before judged", "të renditura para se të gjykohen", "eingeordnet vor dem Urteil")],
          lead: x(
            "A fully synthetic sample shows why a single count of “workarounds” cannot tell a manager what to do.",
            "Një mostër krejt sintetike tregon pse një numërim i vetëm i “zgjidhjeve të përkohshme” nuk i thotë dot një menaxheri çfarë të bëjë.",
            "Eine vollständig synthetische Stichprobe zeigt, warum eine einzige Zahl von „Workarounds“ einer Führungskraft nicht sagt, was zu tun ist."),
          blocks: [
            { type: "flag", text: synthetic },
            { type: "hbars", max: 10, hypothetical: true,
              label: x("Invented sample, twenty observed deviations from one written procedure", "Mostër e shpikur, njëzet devijime të vëzhguara nga një procedurë e shkruar", "Erfundene Stichprobe, zwanzig beobachtete Abweichungen von einer schriftlichen Vorgehensweise"),
              items: [
                { k: x("Approved flexibility", "Fleksibilitet i miratuar", "Genehmigte Flexibilität"), v: 8, n: "8" },
                { k: x("Compensation for a missing input", "Kompensim për një të dhënë që mungon", "Ausgleich für eine fehlende Eingabe"), v: 7, n: "7" },
                { k: x("Innovation candidate", "Risi kandidate", "Innovationskandidat"), v: 3, n: "3" },
                { k: x("Prohibited bypass", "Anashkalim i ndaluar", "Verbotene Umgehung"), v: 2, n: "2", alert: true },
              ] },
            { type: "p", text: x(
              "Every count is invented so the categories can be compared, not measured at any workplace. On a dashboard these twenty would read as one number. Sorted, they call for four different responses. Eight sit inside approved discretion: the action is to document the flexibility so a supervisor does not mistake it for a shortcut. Seven compensate for an input that arrives incomplete: the action belongs upstream, with the owner of that input, not with the people who repair it. Three are candidate improvements that need a bounded test before anyone copies them. Two are the smallest group and the most urgent: a prohibited bypass is escalated at once, whatever its share of the total. A real operation would classify its own sample, with the actual standard and delegated authority in hand; the chart shows only that the decision begins after the sorting.",
              "Çdo numër është i shpikur, që kategoritë të krahasohen, jo i matur në ndonjë vend pune. Në një panel, këta njëzet do të lexoheshin si një numër i vetëm. Të renditur, ata kërkojnë katër përgjigje të ndryshme. Tetë janë brenda lirisë së miratuar: veprimi është ta dokumentosh fleksibilitetin, që një mbikëqyrës të mos e ngatërrojë me shkurtesë. Shtatë kompensojnë një të dhënë që mbërrin e paplotë: veprimi i përket më lart në rrjedhë, pronarit të asaj të dhëne, jo njerëzve që e ndreqin. Tre janë përmirësime kandidate që kanë nevojë për një provë të kufizuar para se t'i kopjojë kushdo. Dy janë grupi më i vogël dhe më urgjent: një anashkalim i ndaluar eskalohet menjëherë, cilado qoftë pjesa e tij në total. Një operacion i vërtetë do ta klasifikonte mostrën e vet, me standardin aktual dhe autoritetin e deleguar në dorë; grafiku tregon vetëm se vendimi nis pas renditjes.",
              "Jede Zahl ist erfunden, damit die Kategorien vergleichbar sind, an keinem Arbeitsplatz gemessen. Auf einem Dashboard stünden diese zwanzig als eine Zahl. Eingeordnet verlangen sie vier verschiedene Antworten. Acht liegen im genehmigten Ermessen: Hier wird die Flexibilität dokumentiert, damit eine Vorgesetzte sie nicht für eine Abkürzung hält. Sieben gleichen eine unvollständig ankommende Eingabe aus: Die Handlung gehört nach vorn, zur Verantwortlichen dieser Eingabe, nicht zu den Menschen, die sie reparieren. Drei sind Verbesserungskandidaten, die einen begrenzten Test brauchen, bevor jemand sie übernimmt. Zwei sind die kleinste Gruppe und die dringendste: Eine verbotene Umgehung wird sofort eskaliert, gleich welchen Anteil sie hat. Ein echter Betrieb würde seine eigene Stichprobe einordnen, mit dem geltenden Standard und der übertragenen Befugnis in der Hand; das Diagramm zeigt nur, dass die Entscheidung nach der Einordnung beginnt.") },
            { type: "callout", reading: true, text: x(
              "The smallest group on the chart is the one that cannot wait.",
              "Grupi më i vogël në grafik është ai që nuk mund të presë.",
              "Die kleinste Gruppe im Diagramm ist die, die nicht warten kann.") },
          ],
          note: x(
            "Every value on this page is synthetic, authored for this volume; the categories are the editorial four of the previous page, after Alter (2014). The author's PDF describes the categories without counting them.",
            "Çdo vlerë në këtë faqe është sintetike, e shkruar për këtë vëllim; kategoritë janë katër kategoritë editoriale të faqes së mëparshme, sipas Alter (2014). PDF-ja e autorit i përshkruan kategoritë pa i numëruar.",
            "Jeder Wert auf dieser Seite ist synthetisch, für diesen Band verfasst; die Kategorien sind die vier redaktionellen der vorigen Seite, nach Alter (2014). Das PDF des Autors beschreibt die Kategorien, ohne sie zu zählen."),
          source: ["alter-2014"],
        },
        {
          id: "iii-protocol", layer: "protocol",
          title: [x("Ask before", "Pyet para se", "Fragen, bevor"), x("you classify", "të klasifikosh", "Sie einordnen")],
          lead: x(
            "A manager needs a fair fact-finding conversation, with an immediate stop rule for prohibited practices.",
            "Një menaxheri i duhet një bisedë e drejtë për gjetjen e fakteve, me një rregull ndalimi të menjëhershëm për praktikat e ndaluara.",
            "Ein faires Gespräch über die Fakten, mit sofortiger Stopp-Regel für verbotene Praktiken."),
          blocks: [
            { type: "steps", items: [
              { h: x("Identify the intended outcome", "Identifiko rezultatin e synuar", "Das beabsichtigte Ergebnis klären"), p: x("What result was the worker trying to deliver?", "Çfarë rezultati po përpiqej të jepte punonjësi?", "Welches Ergebnis wollte die Person liefern?") },
              { h: x("Read the authorised route", "Lexo rrugën e autorizuar", "Den befugten Weg lesen"), p: x("Which current process and exception policy should apply?", "Cili proces aktual dhe cila politikë përjashtimesh duhet të zbatohej?", "Welcher geltende Ablauf und welche Ausnahmeregel gelten?") },
              { h: x("Describe what actually occurred", "Përshkruaj çfarë ndodhi realisht", "Beschreiben, was tatsächlich geschah"), p: x("Separate observation, report and assumption.", "Ndaj vëzhgimin, raportimin dhe supozimin.", "Beobachtung, Bericht und Annahme trennen.") },
              { h: x("Check exposure", "Kontrollo ekspozimin", "Die Gefährdung prüfen"), p: x("Did the variation affect safety, privacy, legal obligations or a protected transaction?", "A preku ndryshimi sigurinë, privatësinë, detyrimet ligjore apo një transaksion të mbrojtur?", "Betraf sie Sicherheit, Datenschutz, Rechtspflichten oder eine geschützte Transaktion?") },
              { h: x("Locate the system constraint", "Gjej kufizimin e sistemit", "Die Systemgrenze finden"), p: x("Which input, interface, timing or resource made the approved path difficult?", "Cila e dhënë, ndërfaqe, kohë apo burim e bëri të vështirë rrugën e miratuar?", "Welche Eingabe, Schnittstelle, Zeit oder Ressource erschwerte den genehmigten Weg?") },
              { h: x("Choose the governance response", "Zgjidh përgjigjen e qeverisjes", "Die Steuerungsantwort wählen"), p: x("Restore compliance, redesign, test formally or document approved flexibility.", "Rikthe përputhshmërinë, riprojekto, provo formalisht ose dokumento fleksibilitetin e miratuar.", "Regeltreue wiederherstellen, neu gestalten, formal testen oder genehmigte Flexibilität dokumentieren.") },
            ] },
            { type: "p", text: x(
              "Keep sensitive cases in secure channels; teaching examples stay abstract and anonymised, and nobody is asked to demonstrate a prohibited bypass. Where the issue is low-risk and permitted, a short controlled trial can check whether a change helps both the local team and the receiving one. If the benefit is unproven, write “hypothesis”, not “saving”.",
              "Mbaji rastet e ndjeshme në kanale të sigurta; shembujt mësimorë mbeten abstraktë dhe anonimë, dhe askujt nuk i kërkohet të demonstrojë një anashkalim të ndaluar. Kur çështja ka rrezik të ulët dhe është e lejuar, një provë e shkurtër e kontrolluar mund të kontrollojë nëse ndryshimi ndihmon edhe ekipin lokal, edhe atë marrës. Nëse përfitimi nuk është provuar, shkruaj “hipotezë”, jo “kursim”.",
              "Sensible Fälle bleiben in sicheren Kanälen; Lehrbeispiele bleiben abstrakt und anonym, und niemand muss eine verbotene Umgehung vorführen. Ist das Thema risikoarm und erlaubt, kann ein kurzer kontrollierter Versuch prüfen, ob die Änderung dem örtlichen und dem empfangenden Team hilft. Ist der Nutzen unbewiesen, „Hypothese“ schreiben, nicht „Einsparung“.") },
            { type: "callout", reading: true, text: x(
              "A useful exception report makes it possible to decide; it does not authorise the exception.",
              "Një raport i dobishëm përjashtimi e bën të mundur vendimin; nuk e autorizon përjashtimin.",
              "Ein nützlicher Ausnahmebericht macht die Entscheidung möglich; er genehmigt die Ausnahme nicht.") },
          ],
          note: x(
            "Editorial protocol after Alter (2014), with safety boundaries from Halbesleben et al. (2008).",
            "Protokoll editorial sipas Alter (2014), me kufijtë e sigurisë nga Halbesleben et al. (2008).",
            "Redaktionelles Protokoll nach Alter (2014), mit Sicherheitsgrenzen nach Halbesleben et al. (2008)."),
          source: ["alter-2014", "halbesleben-2008"],
        },
      ],
    },

    // Chapter IV. When exceptions become normal
    {
      id: "ch-iv", type: "chapter", numeral: "IV",
      title: x("When exceptions become normal", "Kur përjashtimet bëhen normë", "Wenn Ausnahmen normal werden"),
      pages: [
        {
          id: "iv-scene", layer: "scene", more: "watch-how-i-do-it-is-not-training",
          title: [x("The shortcut", "Shkurtesa", "Die Abkürzung,"), x("everyone learns", "që e mësojnë të gjithë", "die alle lernen")],
          lead: x(
            "An informal repair can spread through a team without appearing in a training record or a revision history.",
            "Një korrigjim joformal mund të përhapet në një ekip pa u shfaqur në një regjistër trajnimi apo në historinë e rishikimeve.",
            "Eine informelle Korrektur kann sich in einem Team verbreiten, ohne in einem Schulungsnachweis oder einer Versionsgeschichte aufzutauchen."),
          blocks: [
            { type: "flag", text: x("Hypothetical training scene, not an observed incident", "Skenë hipotetike trajnimi, jo ngjarje e vëzhguar", "Hypothetische Schulungsszene, kein beobachteter Vorfall") },
            { type: "p", text: x(
              "An experienced worker teaches a newcomer how to prepare the next step. The written guide explains one route. The experienced worker shows a slightly different sequence and says this is how the team usually gets through the busy part of the day. The new person follows it because it appears efficient and socially accepted. Nothing in that exchange proves the alternative is unsafe. Nothing proves it is better either. What has happened is that a routine has acquired an informal version and transmitted it through observation. If the receiving team accepts the result, the difference can stay hidden for months. If a later worker cannot interpret the result, the organisation pays in rechecking and clarification. The managerial error would be to assume that printing the standard more prominently makes informal behaviour disappear. If workers believe the alternative is necessary, the investigation starts with what they are trying to accomplish and why the approved process does not fit the moment.",
              "Një punonjës me përvojë i mëson një të ardhuri të ri si të përgatisë hapin tjetër. Udhëzuesi i shkruar shpjegon një rrugë. Punonjësi me përvojë tregon një radhë pak të ndryshme dhe thotë se kështu e kalon zakonisht ekipi pjesën e ngarkuar të ditës. Personi i ri e ndjek, sepse duket efikase dhe e pranuar shoqërisht. Asgjë në atë shkëmbim nuk provon se alternativa është e pasigurt. Asgjë nuk provon as se është më e mirë. Ajo që ka ndodhur është se një rutinë ka fituar një version joformal dhe e ka përcjellë përmes vëzhgimit. Nëse ekipi marrës e pranon rezultatin, dallimi mund të mbetet i fshehur për muaj. Nëse një punonjës i mëvonshëm nuk e interpreton dot rezultatin, organizata paguan me rikontrolle dhe sqarime. Gabimi menaxherial do të ishte të supozosh se printimi më i dukshëm i standardit e zhduk sjelljen joformale. Nëse punonjësit besojnë se alternativa është e nevojshme, hetimi nis me atë që po përpiqen të arrijnë dhe pse procesi i miratuar nuk i përshtatet çastit.",
              "Ein erfahrener Mitarbeiter zeigt einer Neuen, wie der nächste Schritt vorbereitet wird. Die schriftliche Anleitung erklärt einen Weg. Der Erfahrene zeigt eine etwas andere Abfolge und sagt, so komme das Team meist durch den vollen Teil des Tages. Die Neue folgt ihr, weil sie effizient und sozial akzeptiert wirkt. Nichts in diesem Austausch beweist, dass die Alternative unsicher ist. Nichts beweist auch, dass sie besser ist. Geschehen ist, dass eine Routine eine informelle Version erhalten und über Beobachtung weitergegeben hat. Nimmt das empfangende Team das Ergebnis an, kann der Unterschied monatelang verborgen bleiben. Kann eine spätere Person das Ergebnis nicht deuten, zahlt die Organisation mit Nachprüfung und Klärung. Der Führungsfehler wäre anzunehmen, dass ein auffälliger gedruckter Standard informelles Verhalten verschwinden lässt. Halten die Beschäftigten die Alternative für nötig, beginnt die Untersuchung mit dem, was sie erreichen wollen, und warum der genehmigte Ablauf nicht zum Moment passt.") },
            { type: "p", text: x(
              "The author has worked with onboarding, ramp-up and standard operating instructions, but has no documented case in which this exact sequence spread across a team. The dialogue, roles and consequences are constructed to isolate a process of diffusion, not to describe a specific workplace.",
              "Autori ka punuar me përshtatjen e punonjësve të rinj, rritjen graduale të ritmit dhe udhëzimet standarde të punës, por nuk ka asnjë rast të dokumentuar ku kjo radhë e saktë u përhap në një ekip. Dialogu, rolet dhe pasojat janë ndërtuar për të veçuar një proces përhapjeje, jo për të përshkruar një vend pune të caktuar.",
              "Der Autor hat mit Einarbeitung, Hochlaufphasen und Standardarbeitsanweisungen gearbeitet, hat aber keinen dokumentierten Fall, in dem sich genau diese Abfolge in einem Team verbreitete. Dialog, Rollen und Folgen sind konstruiert, um einen Verbreitungsprozess herauszuarbeiten, nicht um einen bestimmten Arbeitsplatz zu beschreiben.") },
            { type: "callout", reading: true, text: x(
              "The unwritten route can become a social standard long before it becomes a governed one.",
              "Rruga e pashkruar mund të bëhet standard shoqëror shumë kohë para se të bëhet standard i qeverisur.",
              "Der ungeschriebene Weg kann lange zum sozialen Standard werden, bevor er ein gesteuerter wird.") },
          ],
          note: x(
            "Hypothetical composite informed by organisational routines theory and published workaround-diffusion research. The essay named below says why “watch how I do it” is not training.",
            "Përbërje hipotetike e mbështetur te teoria e rutinave organizative dhe te kërkimi i botuar për përhapjen e zgjidhjeve të përkohshme. Eseja e emërtuar më poshtë thotë pse “shiko si e bëj unë” nuk është trajnim.",
            "Hypothetische Zusammensetzung nach der Theorie organisationaler Routinen und veröffentlichter Forschung zur Verbreitung von Workarounds. Der unten genannte Essay sagt, warum „schau, wie ich es mache“ kein Training ist."),
        },
        {
          id: "iv-evidence", layer: "concept",
          title: [x("How a repair", "Si përhapet", "Wie sich eine Korrektur"), x("spreads", "një korrigjim", "verbreitet")],
          lead: x(
            "Case research shows a workaround can move through people, software artefacts and eventually organisational arrangements.",
            "Kërkimi me raste tregon se një zgjidhje e përkohshme mund të lëvizë përmes njerëzve, artefakteve softuerike dhe më në fund rregullimeve organizative.",
            "Fallforschung zeigt, dass ein Workaround über Menschen, Software-Artefakte und schließlich organisatorische Regelungen wandern kann."),
          blocks: [
            { type: "p", text: x(
              "Bartelheimer, Wolf and Beverungen (2023) examined nine workarounds across three cases during a two-year multiple-case study. They identified communication and observation as important paths through which workers learned about informal adjustments. Some practices affected colleagues' routines; some contributed to changes in IT artefacts or wider organisational arrangements. This is an account of cases, not an experimental estimate of how often a shortcut becomes innovation, and widespread adoption does not certify a better process. A workaround may travel because the original difficulty is common, because the alternative is visible, or because local norms reward completion. The mechanism must be examined separately from the desirability of the result. The study is especially useful for understanding when a workaround fails to travel. Workgroups can have different tools and weak visibility into each other's methods. The same unofficial adjustment can be adopted locally yet never become part of a shared process definition, and a receiving department may then reject or rework outputs that made sense to the sending team. When managers see this split, the right intervention is not another message telling everyone to comply. It is a shared diagnosis of the interface and a governed decision about the standard.",
              "Bartelheimer, Wolf dhe Beverungen (2023) shqyrtuan nëntë zgjidhje të përkohshme në tri raste gjatë një studimi dyvjeçar me shumë raste. Ata identifikuan komunikimin dhe vëzhgimin si rrugë të rëndësishme përmes të cilave punonjësit mësonin për rregullimet joformale. Disa praktika prekën rutinat e kolegëve; disa kontribuan në ndryshime të artefakteve të TI-së ose të rregullimeve më të gjera organizative. Ky është rrëfim rastesh, jo vlerësim eksperimental se sa shpesh një shkurtesë bëhet risi, dhe përhapja e gjerë nuk e certifikon një proces më të mirë. Një zgjidhje e përkohshme mund të udhëtojë sepse vështirësia fillestare është e zakonshme, sepse alternativa është e dukshme ose sepse normat lokale e shpërblejnë përfundimin. Mekanizmi duhet shqyrtuar veçmas nga dëshirueshmëria e rezultatit. Studimi është veçanërisht i dobishëm për të kuptuar kur një zgjidhje e përkohshme nuk arrin të udhëtojë. Grupet e punës mund të kenë mjete të ndryshme dhe dukshmëri të dobët të metodave të njëri-tjetrit. I njëjti rregullim jozyrtar mund të pranohet lokalisht, por të mos bëhet kurrë pjesë e një përkufizimi të përbashkët procesi, dhe një repart marrës mund ta refuzojë ose ta ripunojë atëherë rezultatin që kishte kuptim për ekipin dërgues. Kur menaxherët e shohin këtë ndarje, ndërhyrja e duhur nuk është një mesazh tjetër që u thotë të gjithëve të binden. Është një diagnozë e përbashkët e ndërfaqes dhe një vendim i qeverisur për standardin.",
              "Bartelheimer, Wolf und Beverungen (2023) untersuchten in einer zweijährigen Mehrfallstudie neun Workarounds in drei Fällen. Sie benannten Kommunikation und Beobachtung als wichtige Wege, auf denen Beschäftigte von informellen Anpassungen erfuhren. Manche Praktiken veränderten die Routinen von Kolleginnen; manche trugen zu Änderungen an IT-Artefakten oder weiteren organisatorischen Regelungen bei. Das ist eine Darstellung von Fällen, keine experimentelle Schätzung, wie oft eine Abkürzung zur Innovation wird, und weite Verbreitung beglaubigt keinen besseren Prozess. Ein Workaround kann wandern, weil die ursprüngliche Schwierigkeit häufig ist, weil die Alternative sichtbar ist oder weil örtliche Normen Erledigung belohnen. Der Mechanismus muss getrennt von der Wünschbarkeit des Ergebnisses geprüft werden. Besonders nützlich ist die Studie, um zu verstehen, wann ein Workaround nicht wandert. Arbeitsgruppen können verschiedene Werkzeuge und wenig Einblick in die Methoden der anderen haben. Dieselbe inoffizielle Anpassung kann örtlich übernommen werden und doch nie Teil einer gemeinsamen Prozessdefinition werden, und eine empfangende Abteilung weist dann Ergebnisse zurück oder überarbeitet sie, die für das sendende Team Sinn ergaben. Sehen Führungskräfte diese Spaltung, ist die richtige Intervention keine weitere Botschaft, alle sollten sich fügen. Es ist eine gemeinsame Diagnose der Schnittstelle und eine gesteuerte Entscheidung über den Standard.") },
            { type: "stat", n: "9", t: x(
              "workarounds examined across three cases over two years (Bartelheimer, Wolf and Beverungen 2023): descriptive study scope, not a success rate.",
              "zgjidhje të përkohshme të shqyrtuara në tri raste gjatë dy vjetëve (Bartelheimer, Wolf e Beverungen 2023): shtrirje përshkruese e studimit, jo normë suksesi.",
              "Workarounds, untersucht in drei Fällen über zwei Jahre (Bartelheimer, Wolf und Beverungen 2023): beschreibender Studienumfang, keine Erfolgsquote.") },
            { type: "callout", reading: true, text: x(
              "Diffusion tells us that a behaviour spreads. It does not tell us whether it should survive.",
              "Përhapja na tregon se një sjellje përhapet. Nuk na tregon nëse duhet të mbijetojë.",
              "Verbreitung sagt uns, dass sich ein Verhalten ausbreitet. Sie sagt nicht, ob es überleben sollte.") },
          ],
          note: x(
            "Bartelheimer, Wolf and Beverungen (2023), Information Systems Journal 33(5), 1085–1150. Case-study findings cannot establish universal frequencies.",
            "Bartelheimer, Wolf e Beverungen (2023), Information Systems Journal 33(5), 1085–1150. Gjetjet e studimeve të rasteve nuk vendosin dot shpeshtësi universale.",
            "Bartelheimer, Wolf und Beverungen (2023), Information Systems Journal 33(5), 1085–1150. Befunde aus Fallstudien können keine universellen Häufigkeiten begründen."),
          source: ["bartelheimer-wolf-beverungen-2023"],
        },
        {
          id: "iv-measurement", layer: "concept",
          title: [x("Can process logs", "A e zbulojnë dot regjistrat", "Können Prozessprotokolle"), x("reveal the hidden path?", "rrugën e fshehur?", "den verborgenen Weg zeigen?")],
          lead: x(
            "Digital records can locate unusual sequences, but they rarely carry the full reason someone acted differently.",
            "Regjistrat digjitalë mund të gjejnë radhë të pazakonta, por rrallë e mbartin arsyen e plotë pse dikush veproi ndryshe.",
            "Digitale Aufzeichnungen können ungewöhnliche Abfolgen orten, tragen aber selten den vollen Grund, warum jemand anders handelte."),
          blocks: [
            { type: "p", text: x(
              "Van der Waal and colleagues developed SWORD, a semi-automated workaround-detection framework that uses event-log traces. In two hospital departments they identified eleven types of workarounds. The paper appeared online in January 2024 and in the 2025 volume of the journal. Eleven is the number of workaround types in that case study, not the number of people, incidents or errors. A log can show that recorded steps occurred in a surprising order or that a task returned to an earlier status. Such a deviation may suggest a workaround, a legitimate exception, an incomplete trace or an error in the process model; its meaning still needs investigation with people who know the domain. As van der Aalst (2016) sets out for process mining in general, a system records its own events; it does not observe every physical correction, conversation or decision. This matters when leaders use process mining as if it were a surveillance verdict. If the logs omit the second channel where work happens, the picture stays incomplete. The method can identify a question worth investigating; it cannot attribute motive or justify disciplinary action. Process mining fits where lawful access, data quality and organisational authorisation are present. Otherwise a small anonymised observation sample may be a better first step.",
              "Van der Waal dhe kolegët zhvilluan SWORD, një kuadër gjysmë të automatizuar për zbulimin e zgjidhjeve të përkohshme që përdor gjurmët e regjistrave të ngjarjeve. Në dy reparte spitalore ata identifikuan njëmbëdhjetë tipe zgjidhjesh të përkohshme. Punimi doli në internet në janar 2024 dhe në vëllimin e 2025-s të revistës. Njëmbëdhjetë është numri i tipeve në atë studim rasti, jo numri i njerëzve, ngjarjeve apo gabimeve. Një regjistër mund të tregojë se hapat e regjistruar ndodhën në një radhë të papritur ose se një detyrë u kthye në një status të mëparshëm. Një devijim i tillë mund të sugjerojë një zgjidhje të përkohshme, një përjashtim legjitim, një gjurmë të paplotë ose një gabim në modelin e procesit; kuptimi i tij ka ende nevojë për hetim me njerëz që e njohin fushën. Siç e shtjellon van der Aalst (2016) për nxjerrjen e proceseve në përgjithësi, një sistem regjistron ngjarjet e veta; nuk e vëzhgon çdo korrigjim fizik, bisedë apo vendim. Kjo ka rëndësi kur drejtuesit e përdorin nxjerrjen e proceseve si të ishte vendim mbikëqyrjeje. Nëse regjistrat e lënë jashtë kanalin e dytë ku ndodh puna, pamja mbetet e paplotë. Metoda mund të gjejë një pyetje që ia vlen të hetohet; nuk mund t'i atribuojë motive dhe as të justifikojë masa disiplinore. Nxjerrja e proceseve përshtatet aty ku ka akses të ligjshëm, cilësi të dhënash dhe autorizim organizativ. Përndryshe, një mostër e vogël anonime vëzhgimi mund të jetë hap i parë më i mirë.",
              "Van der Waal und Kollegen entwickelten SWORD, ein halbautomatisches Verfahren zur Erkennung von Workarounds aus Ereignisprotokollen. In zwei Krankenhausabteilungen fanden sie elf Typen von Workarounds. Der Aufsatz erschien im Januar 2024 online und im Jahrgang 2025 der Zeitschrift. Elf ist die Zahl der Workaround-Typen in dieser Fallstudie, nicht die Zahl von Menschen, Vorfällen oder Fehlern. Ein Protokoll kann zeigen, dass erfasste Schritte in überraschender Reihenfolge geschahen oder dass eine Aufgabe zu einem früheren Status zurückkehrte. Eine solche Abweichung kann auf einen Workaround, eine legitime Ausnahme, eine unvollständige Spur oder einen Fehler im Prozessmodell deuten; ihre Bedeutung braucht weiter die Prüfung mit Menschen, die das Fach kennen. Wie van der Aalst (2016) für Process Mining allgemein darlegt, erfasst ein System seine eigenen Ereignisse; es beobachtet nicht jede physische Korrektur, jedes Gespräch oder jede Entscheidung. Das zählt, wenn Führung Process Mining wie ein Überwachungsurteil nutzt. Fehlt in den Protokollen der zweite Kanal, in dem Arbeit geschieht, bleibt das Bild unvollständig. Die Methode kann eine prüfenswerte Frage finden; sie kann kein Motiv zuschreiben und keine Disziplinarmaßnahme rechtfertigen. Process Mining passt, wo rechtmäßiger Zugang, Datenqualität und organisatorische Freigabe vorliegen. Sonst ist eine kleine anonymisierte Beobachtungsstichprobe vielleicht der bessere erste Schritt.") },
            { type: "stats", cols: 3, items: [
              { n: "11", t: x("types identified in a two-department hospital study", "tipe të identifikuara në një studim spitalor me dy reparte", "Typen, gefunden in einer Krankenhausstudie mit zwei Abteilungen") },
              { n: x("Trace", "Gjurmë", "Spur"), t: x("partial evidence: records observed events, not full explanations", "provë e pjesshme: regjistron ngjarje të vëzhguara, jo shpjegime të plota", "Teilbeleg: erfasst beobachtete Ereignisse, keine vollen Erklärungen") },
              { n: x("Verify", "Verifiko", "Prüfen"), t: x("with people: was an apparent deviation permitted?", "me njerëzit: a ishte i lejuar një devijim i dukshëm?", "mit Menschen: War eine scheinbare Abweichung erlaubt?") },
            ] },
            { type: "callout", reading: true, text: x(
              "Event data are traces of recorded work, not a camera on the whole process.",
              "Të dhënat e ngjarjeve janë gjurmë të punës së regjistruar, jo kamerë mbi gjithë procesin.",
              "Ereignisdaten sind Spuren erfasster Arbeit, keine Kamera auf den ganzen Prozess.") },
          ],
          note: x(
            "van der Waal et al. (2025), Business & Information Systems Engineering 67(2), 171–190, online January 2024; van der Aalst (2016), Process Mining, second edition.",
            "van der Waal et al. (2025), Business & Information Systems Engineering 67(2), 171–190, në internet në janar 2024; van der Aalst (2016), Process Mining, botimi i dytë.",
            "van der Waal et al. (2025), Business & Information Systems Engineering 67(2), 171–190, online Januar 2024; van der Aalst (2016), Process Mining, zweite Auflage."),
          source: ["van-der-waal-2025", "van-der-aalst-2016"],
        },
        {
          id: "iv-protocol", layer: "protocol",
          title: [x("Stop drift", "Ndale rrëshqitjen", "Die Drift stoppen,"), x("before it hardens", "para se të ngurtësohet", "bevor sie erstarrt")],
          lead: x(
            "Treat repeating deviations as a governance signal that requires a real decision about the approved way of working.",
            "Devijimet që përsëriten janë sinjal qeverisjeje: kërkojnë një vendim të vërtetë.",
            "Wiederkehrende Abweichungen sind ein Steuerungssignal: Sie verlangen eine echte Entscheidung."),
          blocks: [
            { type: "steps", items: [
              { h: x("Notice a pattern", "Vër re një model", "Ein Muster bemerken"), p: x("Use anonymous observation, feedback or authorised records to identify repeated variation.", "Përdor vëzhgim anonim, reagime ose regjistra të autorizuar për të gjetur ndryshimin që përsëritet.", "Mit anonymer Beobachtung, Rückmeldung oder befugten Daten Wiederholungen finden.") },
              { h: x("Verify the actual purpose", "Verifiko qëllimin e vërtetë", "Den tatsächlichen Zweck prüfen"), p: x("Ask both sending and receiving teams what the alternative achieves.", "Pyeti edhe ekipin dërgues, edhe atë marrës, çfarë arrin alternativa.", "Beide Teams fragen, was die Alternative leistet.") },
              { h: x("Inspect the boundary", "Shqyrto kufirin", "Die Grenze prüfen"), p: x("Check which requirements may never be bypassed.", "Kontrollo cilat kërkesa nuk mund të anashkalohen kurrë.", "Prüfen, welche Anforderungen nie umgangen werden dürfen.") },
              { h: x("Test the proposed path", "Provo rrugën e propozuar", "Den vorgeschlagenen Weg testen"), p: x("Use a bounded, documented evaluation when the alternative is permitted.", "Përdor një vlerësim të kufizuar dhe të dokumentuar kur alternativa është e lejuar.", "Ist die Alternative erlaubt, begrenzt und dokumentiert bewerten.") },
              { h: x("Decide the standard", "Vendos standardin", "Über den Standard entscheiden"), p: x("Approve, redesign or prohibit explicitly through the responsible authority.", "Mirato, riprojekto ose ndalo shprehimisht përmes autoritetit përgjegjës.", "Durch die zuständige Stelle ausdrücklich genehmigen, ändern oder verbieten.") },
              { h: x("Teach and retire", "Mëso dhe tërhiq", "Schulen und abschaffen"), p: x("Train the people affected, remove obsolete notes and check recurrence later.", "Trajno njerëzit e prekur, hiq shënimet e vjetruara dhe kontrollo më vonë përsëritjen.", "Betroffene schulen, alte Notizen entfernen, später Wiederkehr prüfen.") },
            ] },
            { type: "p", text: x(
              "Drift is ambiguous, so the decision is written. If management quietly tolerates an alternative the SOP forbids, workers must interpret conflicting authority; if it prohibits the alternative without fixing its constraint, the difficulty returns tomorrow. Record the new rule with the information the next team needs to follow it.",
              "Rrëshqitja është e paqartë, prandaj vendimi shkruhet. Nëse drejtimi e toleron në heshtje një alternativë që SOP-ja e ndalon, punonjësit duhet të interpretojnë autoritete që bien ndesh; nëse e ndalon pa e ndrequr kufizimin, vështirësia kthehet nesër. Shëno rregullin e ri bashkë me informacionin që i duhet ekipit tjetër për ta ndjekur.",
              "Drift ist mehrdeutig, darum wird schriftlich entschieden. Stilles Dulden lässt Beschäftigte widersprüchliche Befugnisse deuten; ein Verbot ohne behobene Grenze bringt die Schwierigkeit morgen zurück. Die neue Regel samt der Information festhalten, die das nächste Team braucht.") },
            { type: "callout", reading: true, text: x(
              "Improvement occurs when the correct version becomes clear and usable for the next trained person.",
              "Përmirësimi ndodh kur versioni i saktë bëhet i qartë dhe i përdorshëm për personin e radhës të trajnuar.",
              "Verbesserung heißt: Die richtige Version ist für die nächste geschulte Person klar und brauchbar.") },
          ],
          note: x(
            "Editorial governance cycle inspired by Bartelheimer et al. (2023), Feldman and Pentland (2003) and van der Waal et al. (2025).",
            "Cikël editorial qeverisjeje i frymëzuar nga Bartelheimer et al. (2023), Feldman e Pentland (2003) dhe van der Waal et al. (2025).",
            "Redaktioneller Steuerungszyklus, angeregt durch Bartelheimer et al. (2023), Feldman und Pentland (2003) und van der Waal et al. (2025)."),
          source: ["bartelheimer-wolf-beverungen-2023", "feldman-pentland-2003", "van-der-waal-2025"],
        },
      ],
    },

    // Chapter V. The invisible cost of keeping things moving
    {
      id: "ch-v", type: "chapter", numeral: "V",
      title: x("The invisible cost of keeping things moving", "Kostoja e padukshme e mbajtjes së punës në lëvizje", "Die unsichtbaren Kosten des Weiterlaufens"),
      pages: [
        {
          id: "v-scene", layer: "scene", more: "pareto-and-5-why-in-practice",
          title: [x("Four minutes", "Katër minuta", "Vier Minuten,"), x("that never appear", "që nuk duken kurrë", "die nie erscheinen")],
          lead: x(
            "A small repair may look trivial until it repeats across many handovers and consumes attention the dashboard does not show.",
            "Një korrigjim i vogël mund të duket i parëndësishëm derisa përsëritet në shumë dorëzime dhe harxhon vëmendje që paneli nuk e tregon.",
            "Eine kleine Korrektur wirkt banal, bis sie sich über viele Übergaben wiederholt und Aufmerksamkeit verbraucht, die das Dashboard nicht zeigt."),
          blocks: [
            { type: "flag", text: x("Fictional numerical example, not company data", "Shembull numerik i trilluar, jo të dhëna kompanie", "Erfundenes Zahlenbeispiel, keine Unternehmensdaten") },
            { type: "p", text: x(
              "Suppose a receiving team has to clarify an incomplete instruction before it can use a prepared order. One clarification lasts four minutes. It feels unremarkable. The next task arrives. The day goes on. Now consider an illustrative sample of eighty similar handovers. Twelve require the same kind of clarification. The direct correction time is twelve multiplied by four minutes: forty-eight minutes. That is not a daily total for any workplace where the author has worked; both the event count and the time are invented. More important, forty-eight minutes is not a full economic cost. It excludes interruption, waiting by others, rechecks, any error made during the confusion and the opportunity cost of an experienced colleague's attention. Counting these effects responsibly would require their own observations and clear assumptions.",
              "Supozo se një ekip marrës duhet të sqarojë një udhëzim të paplotë para se ta përdorë një porosi të përgatitur. Një sqarim zgjat katër minuta. Duket i parëndësishëm. Vjen detyra tjetër. Dita vazhdon. Tani merr një mostër ilustruese prej tetëdhjetë dorëzimesh të ngjashme. Dymbëdhjetë kërkojnë të njëjtin lloj sqarimi. Koha e drejtpërdrejtë e korrigjimit është dymbëdhjetë herë katër minuta: dyzet e tetë minuta. Ky nuk është total ditor për asnjë vend pune ku ka punuar autori; edhe numri i ngjarjeve, edhe koha janë të shpikura. Më e rëndësishmja, dyzet e tetë minuta nuk janë kosto e plotë ekonomike. Lënë jashtë ndërprerjen, pritjen e të tjerëve, rikontrollet, çdo gabim të bërë gjatë ngatërresës dhe koston e mundësisë së vëmendjes së një kolegu me përvojë. Numërimi i përgjegjshëm i këtyre efekteve do të kërkonte vëzhgimet e veta dhe supozime të qarta.",
              "Angenommen, ein empfangendes Team muss eine unvollständige Anweisung klären, bevor es einen vorbereiteten Auftrag nutzen kann. Eine Klärung dauert vier Minuten. Sie wirkt unauffällig. Die nächste Aufgabe kommt. Der Tag geht weiter. Nun eine veranschaulichende Stichprobe von achtzig ähnlichen Übergaben. Zwölf brauchen dieselbe Art Klärung. Die direkte Korrekturzeit ist zwölf mal vier Minuten: achtundvierzig Minuten. Das ist keine Tagessumme an einem Arbeitsplatz des Autors; Ereigniszahl und Zeit sind beide erfunden. Wichtiger: Achtundvierzig Minuten sind keine vollständigen wirtschaftlichen Kosten. Sie lassen Unterbrechung, das Warten anderer, Nachprüfungen, Fehler in der Verwirrung und die Opportunitätskosten der Aufmerksamkeit einer erfahrenen Kollegin aus. Diese Wirkungen verantwortlich zu zählen, verlangte eigene Beobachtungen und klare Annahmen.") },
            { type: "p", text: x(
              "The example can also be misread in the opposite direction. Twelve clarifications may include authorised quality checks, not waste. Counting them as defects without knowing why they exist would punish care and quality. The point of measurement is to tell avoidable repair from necessary control, not to produce a larger cost number.",
              "Shembulli mund të keqlexohet edhe në drejtimin e kundërt. Dymbëdhjetë sqarimet mund të përfshijnë kontrolle cilësie të autorizuara, jo humbje. Numërimi i tyre si defekte pa e ditur pse ekzistojnë do ta ndëshkonte kujdesin dhe cilësinë. Qëllimi i matjes është të dallojë korrigjimin e shmangshëm nga kontrolli i nevojshëm, jo të prodhojë një numër më të madh kostoje.",
              "Das Beispiel lässt sich auch in die andere Richtung missverstehen. Zwölf Klärungen können befugte Qualitätsprüfungen enthalten, keine Verschwendung. Sie als Fehler zu zählen, ohne zu wissen, warum es sie gibt, bestrafte Sorgfalt und Qualität. Messen soll vermeidbare Korrektur von nötiger Kontrolle unterscheiden, nicht eine größere Kostenzahl erzeugen.") },
            { type: "callout", reading: true, text: x(
              "A repeated four-minute fix is a hypothesis about process design, not proof that every four-minute check is waste.",
              "Një ndreqje katërminutëshe që përsëritet është hipotezë për projektimin e procesit, jo provë se çdo kontroll katërminutësh është humbje.",
              "Eine wiederholte Vier-Minuten-Korrektur ist eine Hypothese über das Prozessdesign, kein Beweis, dass jede Vier-Minuten-Prüfung Verschwendung ist.") },
          ],
          note: x(
            "All numbers on this page are synthetic and reproducible; no workplace sample was collected. The essay named below counts recurring problems with Pareto and 5 Why.",
            "Të gjithë numrat në këtë faqe janë sintetikë dhe të riprodhueshëm; nuk u mblodh asnjë mostër nga vende pune. Eseja e emërtuar më poshtë i numëron problemet që përsëriten me Pareto dhe 5 Why.",
            "Alle Zahlen dieser Seite sind synthetisch und nachvollziehbar; keine Stichprobe an einem Arbeitsplatz wurde erhoben. Der unten genannte Essay zählt wiederkehrende Probleme mit Pareto und 5 Why."),
        },
        {
          id: "v-concept", layer: "concept",
          title: [x("The hidden", "Libri i fshehur", "Das verborgene"), x("expense ledger", "i shpenzimeve", "Kostenbuch")],
          lead: x(
            "A repair may consume more than direct labour time, yet some waiting and checking are essential safeguards.",
            "Një korrigjim mund të harxhojë më shumë se kohën e drejtpërdrejtë të punës, por disa pritje dhe kontrolle janë mbrojtje thelbësore.",
            "Eine Korrektur kann mehr als direkte Arbeitszeit verbrauchen, doch manches Warten und Prüfen ist unverzichtbarer Schutz."),
          blocks: [
            { type: "p", text: x(
              "The temptation is to assign a unit cost to each workaround and declare savings when the count falls. That can become another misleading KPI. A lower exception count may reflect a redesigned process; it may also reflect under-reporting, a redefinition of the event or the removal of an important verification step. Use at least four lenses. Direct correction time captures the visible work. Coordination captures calls and handover clarification. Downstream quality checks whether the receiver can use the work without further repair. Recurrence tests whether the same obstacle returns after a claimed solution. These should never be collapsed into one attractive number without stating their boundaries. A value-stream view, as Rother and Shook (1999) and Martin and Osterling (2014) describe it, separates process time from waiting and asks whether work arrives complete and accurate; here those ideas serve as a frame, not as measured results. A necessary quality check is not a defect merely because it takes time, and a customer-facing failure may need urgent action even if its repair lasts seconds. Risk and consequence matter alongside time. The most useful comparison is before and after a controlled change, with the same event definition and similar conditions. If repair time falls but incomplete deliveries, unresolved guest problems or other downstream failures rise, the improvement has not been demonstrated.",
              "Tundimi është t'i caktosh një kosto njësie çdo zgjidhjeje të përkohshme dhe të shpallësh kursime kur numri bie. Kjo mund të bëhet një tjetër KPI mashtrues. Një numër më i ulët përjashtimesh mund të pasqyrojë një proces të riprojektuar; mund të pasqyrojë edhe nënraportim, ripërkufizim të ngjarjes ose heqjen e një hapi të rëndësishëm verifikimi. Përdor të paktën katër lente. Koha e drejtpërdrejtë e korrigjimit kap punën e dukshme. Koordinimi kap telefonatat dhe sqarimin e dorëzimit. Cilësia më poshtë në rrjedhë kontrollon nëse marrësi mund ta përdorë punën pa korrigjim të mëtejshëm. Përsëritja provon nëse e njëjta pengesë kthehet pas një zgjidhjeje të shpallur. Këto nuk duhen shkrirë kurrë në një numër tërheqës pa i thënë kufijtë e tyre. Një pamje e rrjedhës së vlerës, siç e përshkruajnë Rother e Shook (1999) dhe Martin e Osterling (2014), e ndan kohën e procesit nga pritja dhe pyet nëse puna mbërrin e plotë dhe e saktë; këtu ato ide shërbejnë si kornizë, jo si rezultate të matura. Një kontroll i nevojshëm cilësie nuk është defekt vetëm sepse merr kohë, dhe një dështim përballë klientit mund të kërkojë veprim urgjent edhe kur korrigjimi i tij zgjat sekonda. Rreziku dhe pasoja kanë rëndësi krahas kohës. Krahasimi më i dobishëm është para dhe pas një ndryshimi të kontrolluar, me të njëjtin përkufizim ngjarjeje dhe kushte të ngjashme. Nëse koha e korrigjimit bie, por rriten dorëzimet e paplota, problemet e pazgjidhura të mysafirëve apo dështime të tjera më poshtë në rrjedhë, përmirësimi nuk është provuar.",
              "Die Versuchung ist, jedem Workaround Stückkosten zuzuweisen und Einsparungen zu melden, wenn die Zahl sinkt. Das kann eine weitere irreführende KPI werden. Eine geringere Ausnahmezahl kann einen neu gestalteten Prozess spiegeln; ebenso Untererfassung, eine neue Ereignisdefinition oder den Wegfall eines wichtigen Prüfschritts. Nutzen Sie mindestens vier Linsen. Direkte Korrekturzeit erfasst die sichtbare Arbeit. Koordination erfasst Anrufe und Klärung der Übergabe. Nachgelagerte Qualität prüft, ob der Empfänger die Arbeit ohne weitere Korrektur nutzen kann. Wiederkehr prüft, ob dasselbe Hindernis nach einer behaupteten Lösung zurückkommt. Diese dürfen nie ohne Angabe ihrer Grenzen zu einer attraktiven Zahl verschmolzen werden. Ein Wertstromblick, wie ihn Rother und Shook (1999) und Martin und Osterling (2014) beschreiben, trennt Prozesszeit vom Warten und fragt, ob Arbeit vollständig und richtig ankommt; hier dienen diese Gedanken als Rahmen, nicht als gemessene Ergebnisse. Eine nötige Qualitätsprüfung ist kein Fehler, nur weil sie Zeit kostet, und ein Versagen am Kunden kann dringendes Handeln verlangen, auch wenn die Korrektur Sekunden dauert. Risiko und Folge zählen neben der Zeit. Am nützlichsten ist der Vergleich vor und nach einer kontrollierten Änderung, mit derselben Ereignisdefinition und ähnlichen Bedingungen. Sinkt die Korrekturzeit, steigen aber unvollständige Lieferungen, ungelöste Gästeprobleme oder andere nachgelagerte Fehler, ist die Verbesserung nicht belegt.") },
            { type: "rows", compact: true, items: [
              { h: x("Correction time", "Koha e korrigjimit", "Korrekturzeit"), p: x("Minutes spent performing an unplanned, permitted repair.", "Minutat e harxhuara për një korrigjim të paplanifikuar dhe të lejuar.", "Minuten für eine ungeplante, erlaubte Korrektur.") },
              { h: x("Coordination", "Koordinimi", "Koordination"), p: x("Extra clarification or rework imposed on other roles.", "Sqarim ose ripunim shtesë i ngarkuar roleve të tjera.", "Zusätzliche Klärung oder Nacharbeit für andere Rollen.") },
              { h: x("Downstream quality", "Cilësia më poshtë në rrjedhë", "Nachgelagerte Qualität"), p: x("Whether the recipient received complete, usable work.", "Nëse marrësi mori punë të plotë dhe të përdorshme.", "Ob der Empfänger vollständige, brauchbare Arbeit erhielt.") },
              { h: x("Recurrence", "Përsëritja", "Wiederkehr"), p: x("Whether the same verified obstacle appears again.", "Nëse e njëjta pengesë e verifikuar shfaqet sërish.", "Ob dasselbe geprüfte Hindernis erneut auftritt.") },
            ] },
            { type: "callout", reading: true, text: x(
              "Measure the effect of the repair, not merely the movement of its cost into another department.",
              "Mat efektin e korrigjimit, jo thjesht zhvendosjen e kostos së tij në një repart tjetër.",
              "Messen Sie die Wirkung der Korrektur, nicht bloß das Verschieben ihrer Kosten in eine andere Abteilung.") },
          ],
          note: x(
            "Editorial measurement model informed by Tucker (2004), Rother and Shook (1999) and Martin and Osterling (2014); no local data.",
            "Model editorial matjeje i mbështetur te Tucker (2004), Rother e Shook (1999) dhe Martin e Osterling (2014); pa të dhëna lokale.",
            "Redaktionelles Messmodell nach Tucker (2004), Rother und Shook (1999) und Martin und Osterling (2014); keine örtlichen Daten."),
          source: ["tucker-2004", "vsm-rother-shook-1999", "vsm-martin-osterling-2014"],
        },
        {
          id: "v-example", layer: "concept",
          title: [x("An honest calculation", "Një llogaritje e ndershme", "Eine ehrliche Rechnung"), x("with limits", "me kufij", "mit Grenzen")],
          lead: x(
            "Simple arithmetic can expose the scale of a hypothesis while making its omissions explicit.",
            "Aritmetika e thjeshtë mund ta tregojë shkallën e një hipoteze, duke i bërë të qarta mangësitë e saj.",
            "Einfache Arithmetik kann die Größenordnung einer Hypothese zeigen und dabei ihre Lücken offenlegen."),
          blocks: [
            { type: "flag", text: synthetic },
            { type: "hbars", max: 48, hypothetical: true,
              label: x("Synthetic direct correction time, four minutes per exception", "Kohë sintetike e drejtpërdrejtë korrigjimi, katër minuta për përjashtim", "Synthetische direkte Korrekturzeit, vier Minuten je Ausnahme"),
              items: [
                { k: x("Before: 12 cases", "Para: 12 raste", "Vorher: 12 Fälle"), v: 48, n: "48 min", alert: true },
                { k: x("After: 5 cases", "Pas: 5 raste", "Nachher: 5 Fälle"), v: 20, n: "20 min" },
              ] },
            { type: "p", text: x(
              "For the invented example in the scene of this chapter, suppose exactly twelve of eighty handovers required one four-minute clarification. The event incidence is 12 divided by 80, or 15%. Direct extra work is 12 times 4 minutes, or 48 minutes in the sample. Neither measure estimates other teams, other dates or any actual employer. Now imagine that a redesign, in a comparable hypothetical sample, reduces the verified recurring clarifications from twelve to five. With the same assumed four minutes, direct correction time would fall from 48 to 20 minutes, a difference of 28. This does not prove a real saving; the redesigned work may consume preparation time elsewhere. The comparison is a calculation, not an observed experiment. Before measuring a real intervention, fix the boundary and the definition: what counts as a clarification, what must still be checked, who records it, and what would show that the downstream result stayed at least as good. Only then does the calculation become useful.",
              "Për shembullin e shpikur në skenën e këtij kapitulli, supozo se saktësisht dymbëdhjetë nga tetëdhjetë dorëzime kërkuan një sqarim katërminutësh. Shpeshtësia e ngjarjes është 12 pjesëtuar me 80, pra 15%. Puna e drejtpërdrejtë shtesë është 12 herë 4 minuta, pra 48 minuta në mostër. Asnjëra matje nuk vlerëson ekipe të tjera, data të tjera apo ndonjë punëdhënës të vërtetë. Tani imagjino se një riprojektim, në një mostër hipotetike të krahasueshme, i ul sqarimet e verifikuara që përsëriten nga dymbëdhjetë në pesë. Me të njëjtat katër minuta të supozuara, koha e drejtpërdrejtë e korrigjimit do të binte nga 48 në 20 minuta, një diferencë prej 28. Kjo nuk provon një kursim të vërtetë; puna e riprojektuar mund të harxhojë kohë përgatitjeje diku tjetër. Krahasimi është llogaritje, jo eksperiment i vëzhguar. Para se të matësh një ndërhyrje të vërtetë, fikso kufirin dhe përkufizimin: çfarë llogaritet sqarim, çfarë duhet ende kontrolluar, kush e regjistron dhe çfarë do të tregonte se rezultati më poshtë në rrjedhë mbeti të paktën po aq i mirë. Vetëm atëherë llogaritja bëhet e dobishme.",
              "Für das erfundene Beispiel in der Szene dieses Kapitels sei angenommen, dass genau zwölf von achtzig Übergaben eine Vier-Minuten-Klärung brauchten. Die Ereignishäufigkeit ist 12 geteilt durch 80, also 15 %. Die direkte Zusatzarbeit ist 12 mal 4 Minuten, also 48 Minuten in der Stichprobe. Keine der beiden Größen schätzt andere Teams, andere Tage oder einen echten Arbeitgeber. Nun senke eine Neugestaltung in einer vergleichbaren hypothetischen Stichprobe die geprüften wiederkehrenden Klärungen von zwölf auf fünf. Mit denselben angenommenen vier Minuten fiele die direkte Korrekturzeit von 48 auf 20 Minuten, eine Differenz von 28. Das beweist keine echte Einsparung; die neu gestaltete Arbeit kann anderswo Vorbereitungszeit verbrauchen. Der Vergleich ist eine Rechnung, kein beobachtetes Experiment. Vor der Messung einer echten Intervention Grenze und Definition festlegen: was als Klärung zählt, was weiter geprüft werden muss, wer es erfasst und was zeigen würde, dass das nachgelagerte Ergebnis mindestens so gut blieb. Erst dann wird die Rechnung nützlich.") },
            { type: "stat", n: "15%", hypothetical: true, t: x(
              "12 of 80 sampled handovers needing clarification, an illustration: not a defect rate measured at any employer. Checked: 12 × 4 = 48; 5 × 4 = 20; 48 − 20 = 28; 12 ÷ 80 = 0.15.",
              "12 nga 80 dorëzime në mostër që kërkuan sqarim, një ilustrim: jo normë defektesh e matur te ndonjë punëdhënës. E kontrolluar: 12 × 4 = 48; 5 × 4 = 20; 48 − 20 = 28; 12 ÷ 80 = 0,15.",
              "12 von 80 Übergaben der Stichprobe mit Klärungsbedarf, eine Illustration: keine bei einem Arbeitgeber gemessene Fehlerquote. Geprüft: 12 × 4 = 48; 5 × 4 = 20; 48 − 20 = 28; 12 ÷ 80 = 0,15.") },
            { type: "callout", reading: true, text: x(
              "A projection should be labelled as a projection until the new process has actually been observed.",
              "Një projeksion duhet shënuar si projeksion derisa procesi i ri të jetë vëzhguar vërtet.",
              "Eine Hochrechnung sollte Hochrechnung heißen, bis der neue Prozess tatsächlich beobachtet wurde.") },
          ],
          note: x(
            "All counts and times are invented for a reproducible arithmetic example, as in the author's PDF; no result was observed.",
            "Të gjithë numrat dhe kohët janë të shpikura për një shembull aritmetik të riprodhueshëm, si te PDF-ja e autorit; nuk u vëzhgua asnjë rezultat.",
            "Alle Zahlen und Zeiten sind für ein nachvollziehbares Rechenbeispiel erfunden, wie im PDF des Autors; kein Ergebnis wurde beobachtet."),
        },
        {
          id: "v-protocol", layer: "protocol",
          title: [x("Measure the cost", "Mat koston", "Die Kosten messen,"), x("without blaming the fixer", "pa fajësuar atë që ndreq", "ohne die Reparierende zu beschuldigen")],
          lead: x(
            "A small sample, a clear denominator and a downstream check are a more reliable start than an elaborate dashboard.",
            "Një mostër e vogël, një emërues i qartë dhe një kontroll më poshtë në rrjedhë janë fillim më i besueshëm se një panel i stërholluar.",
            "Kleine Stichprobe, klarer Nenner, nachgelagerte Prüfung: ein besserer Anfang als ein aufwendiges Dashboard."),
          blocks: [
            { type: "steps", items: [
              { h: x("Define the population", "Përkufizo popullatën", "Die Grundgesamtheit festlegen"), p: x("Choose a clear class of handover and an observation window.", "Zgjidh një klasë të qartë dorëzimesh dhe një dritare vëzhgimi.", "Eine klare Übergabeklasse und ein Beobachtungsfenster wählen.") },
              { h: x("Agree on an exception", "Bini dakord për përjashtimin", "Sich auf die Ausnahme einigen"), p: x("Count only the extra activity that fits the approved definition.", "Numëro vetëm veprimtarinë shtesë që përputhet me përkufizimin e miratuar.", "Nur Zusatzarbeit zählen, die der genehmigten Definition entspricht.") },
              { h: x("Time a sample", "Mat kohën e një mostre", "Eine Stichprobe timen"), p: x("Capture correction and coordination separately, where permitted.", "Kap veçmas korrigjimin dhe koordinimin, aty ku lejohet.", "Korrektur und Koordination getrennt erfassen, wo erlaubt.") },
              { h: x("Verify necessity", "Verifiko domosdoshmërinë", "Notwendigkeit prüfen"), p: x("Keep required safety and quality controls outside the avoidable-rework category.", "Mbaji kontrollet e detyrueshme të sigurisë dhe cilësisë jashtë kategorisë së ripunimit të shmangshëm.", "Pflichtkontrollen für Sicherheit und Qualität nicht als vermeidbare Nacharbeit zählen.") },
              { h: x("Test one redesign", "Provo një riprojektim", "Eine Neugestaltung testen"), p: x("Document the change, scope, owner and success condition.", "Dokumento ndryshimin, shtrirjen, pronarin dhe kushtin e suksesit.", "Änderung, Umfang, Verantwortliche und Erfolgsbedingung dokumentieren.") },
              { h: x("Check the recipient", "Kontrollo marrësin", "Den Empfänger prüfen"), p: x("Measure usability of the output and recurrence, not only apparent time saved.", "Mat përdorshmërinë e rezultatit dhe përsëritjen, jo vetëm kohën që duket e kursyer.", "Brauchbarkeit des Ergebnisses und Wiederkehr messen, nicht nur scheinbar gesparte Zeit.") },
            ] },
            { type: "p", text: x(
              "A small sample is fine if its limits are stated. Voluntary reports are not the whole universe of exceptions; silence is a source of bias. Do not compare weeks whose order mix, staffing or demand differ without saying so. Aggregate sensitive work at process level: the chart shows where the process is weak, not who worked it.",
              "Një mostër e vogël është në rregull nëse kufijtë e saj thuhen. Raportimet vullnetare nuk janë gjithë universi i përjashtimeve; heshtja është burim anshmërie. Mos krahaso javë me përbërje porosish, staf apo kërkesë të ndryshme pa e thënë. Puna e ndjeshme grupohet në nivel procesi: grafiku tregon ku është i dobët procesi, jo kush e punoi.",
              "Eine kleine Stichprobe genügt, wenn ihre Grenzen genannt sind. Freiwillige Meldungen sind nicht alle Ausnahmen; Schweigen verzerrt. Keine Wochen mit anderem Auftragsmix, anderer Besetzung oder Nachfrage vergleichen, ohne es zu sagen. Sensible Arbeit auf Prozessebene zusammenfassen: Das Diagramm zeigt, wo der Prozess schwach ist, nicht, wer gearbeitet hat.") },
            { type: "callout", reading: true, text: x(
              "An exception becomes actionable when its definition, cost, risk and owner are understood.",
              "Një përjashtim bëhet i veprueshëm kur kuptohen përkufizimi, kostoja, rreziku dhe pronari i tij.",
              "Eine Ausnahme wird handhabbar, wenn Definition, Kosten, Risiko und Verantwortliche verstanden sind.") },
          ],
          note: x(
            "Original editorial measurement protocol; not a validated benchmark or an implemented internal control. The interruption and switching costs follow Tucker (2004).",
            "Protokoll editorial origjinal matjeje; jo pikë referimi e vërtetuar dhe as kontroll i brendshëm i zbatuar. Kostot e ndërprerjes dhe të kalimit ndjekin Tucker (2004).",
            "Eigenes redaktionelles Messprotokoll; kein validierter Richtwert und keine eingeführte interne Kontrolle. Die Unterbrechungs- und Wechselkosten folgen Tucker (2004)."),
          source: ["tucker-2004"],
        },
      ],
    },

    // Chapter VI. From workaround to better process
    {
      id: "ch-vi", type: "chapter", numeral: "VI",
      title: x("From workaround to better process", "Nga zgjidhja e përkohshme te procesi më i mirë", "Vom Workaround zum besseren Prozess"),
      pages: [
        {
          id: "vi-scene", layer: "scene", more: "mistakes-get-lost-between-departments",
          title: [x("The fix that should", "Ndreqja që nuk duhet", "Die Korrektur, die nicht"), x("no longer be needed", "të nevojitet më", "mehr nötig sein sollte")],
          lead: x(
            "A good redesign removes the need for repeated compensation without removing the worker's capacity to detect new problems.",
            "Një riprojektim i mirë e heq nevojën për kompensim të përsëritur pa ia hequr punonjësit aftësinë për të dalluar probleme të reja.",
            "Eine gute Neugestaltung beseitigt den Bedarf an wiederholter Kompensation, ohne der Person die Fähigkeit zu nehmen, neue Probleme zu erkennen."),
          blocks: [
            { type: "flag", text: x("Hypothetical improvement scene, not a documented outcome", "Skenë hipotetike përmirësimi, jo rezultat i dokumentuar", "Hypothetische Verbesserungsszene, kein dokumentiertes Ergebnis") },
            { type: "p", text: x(
              "A team recognises that the same clarification keeps interrupting a handover. Rather than asking the experienced worker to repeat the workaround, the process owner interviews the sender and the receiver. Both describe the gap. They agree to make a required status clear at the point where the information changes hands. The change is modest. The team tests the revised handover on a narrow set of work, checks the receiving person's experience and compares it with the previous process. Staff keep the ability to report unexpected conditions. Nobody is told to skip verification because the new workflow is supposed to be better. If the revised process works, the remaining task is governance. Update the controlled instruction, teach the receiving team, retire conflicting side notes where authorised, and return the result to the people who first described the obstacle. A useful process is one a trained colleague can use without relying on the memory of its original designer.",
              "Një ekip e kupton se i njëjti sqarim vazhdon ta ndërpresë një dorëzim. Në vend që t'i kërkojë punonjësit me përvojë ta përsërisë zgjidhjen e përkohshme, pronari i procesit interviston dërguesin dhe marrësin. Të dy e përshkruajnë boshllëkun. Bien dakord ta bëjnë të qartë një status të nevojshëm në pikën ku informacioni ndërron duar. Ndryshimi është i vogël. Ekipi e provon dorëzimin e rishikuar në një grup të ngushtë punësh, kontrollon përvojën e personit marrës dhe e krahason me procesin e mëparshëm. Stafi e ruan mundësinë për të raportuar kushte të papritura. Askujt nuk i thuhet ta kapërcejë verifikimin sepse rrjedha e re e punës gjoja është më e mirë. Nëse procesi i rishikuar funksionon, detyra që mbetet është qeverisja. Përditëso udhëzimin e kontrolluar, mësoje ekipin marrës, tërhiq shënimet anësore që bien ndesh aty ku është e autorizuar, dhe ktheja rezultatin njerëzve që e përshkruan të parët pengesën. Një proces i dobishëm është ai që një koleg i trajnuar mund ta përdorë pa u mbështetur te kujtesa e projektuesit të tij fillestar.",
              "Ein Team erkennt, dass dieselbe Klärung immer wieder eine Übergabe unterbricht. Statt den Erfahrenen zu bitten, den Workaround zu wiederholen, befragt die Prozessverantwortliche Sender und Empfänger. Beide beschreiben die Lücke. Sie vereinbaren, einen nötigen Status dort klar zu machen, wo die Information den Besitzer wechselt. Die Änderung ist bescheiden. Das Team testet die überarbeitete Übergabe an einem schmalen Arbeitsausschnitt, prüft die Erfahrung der empfangenden Person und vergleicht sie mit dem bisherigen Prozess. Das Personal behält die Möglichkeit, unerwartete Bedingungen zu melden. Niemandem wird gesagt, die Prüfung zu überspringen, weil der neue Ablauf angeblich besser ist. Funktioniert der überarbeitete Prozess, bleibt die Steuerung. Die kontrollierte Anweisung aktualisieren, das empfangende Team schulen, widersprüchliche Nebennotizen abschaffen, wo es befugt ist, und das Ergebnis den Menschen zurückmelden, die das Hindernis zuerst beschrieben. Ein nützlicher Prozess ist einer, den eine geschulte Kollegin nutzen kann, ohne auf das Gedächtnis seines ursprünglichen Gestalters angewiesen zu sein.") },
            { type: "p", text: x(
              "This is a constructed future-state illustration. The author has built practical guides and discussed SOP improvement, but there is no before-and-after evidence that this particular redesign reduced delays or errors in a workplace, and a professional publication must preserve that boundary.",
              "Ky është një ilustrim i ndërtuar i gjendjes së ardhshme. Autori ka ndërtuar udhëzues praktikë dhe ka diskutuar përmirësimin e SOP-ve, por nuk ka asnjë provë para dhe pas se ky riprojektim i caktuar i uli vonesat apo gabimet në një vend pune, dhe një botim profesional duhet ta ruajë këtë kufi.",
              "Das ist eine konstruierte Darstellung eines Zielzustands. Der Autor hat praktische Leitfäden gebaut und SOP-Verbesserung besprochen, doch es gibt keinen Vorher-Nachher-Beleg, dass gerade diese Neugestaltung Verzögerungen oder Fehler an einem Arbeitsplatz senkte, und eine Fachpublikation muss diese Grenze wahren.") },
            { type: "callout", reading: true, text: x(
              "The goal is not zero adaptation. It is fewer avoidable repairs, clear controls and faster learning when reality changes.",
              "Qëllimi nuk është zero përshtatje. Janë më pak korrigjime të shmangshme, kontrolle të qarta dhe të mësuar më të shpejtë kur realiteti ndryshon.",
              "Das Ziel ist nicht null Anpassung. Es sind weniger vermeidbare Korrekturen, klare Kontrollen und schnelleres Lernen, wenn sich die Wirklichkeit ändert.") },
          ],
          note: x(
            "Constructed scene synthesising published process-learning and workaround-innovation mechanisms; no local intervention is claimed. The essay named below follows a mistake between sender and receiver.",
            "Skenë e ndërtuar që sintetizon mekanizmat e botuar të të mësuarit të proceseve dhe të risisë nga zgjidhjet e përkohshme; nuk pretendohet asnjë ndërhyrje lokale. Eseja e emërtuar më poshtë ndjek një gabim mes dërguesit dhe marrësit.",
            "Konstruierte Szene, die veröffentlichte Mechanismen des Prozesslernens und der Innovation aus Workarounds zusammenführt; keine örtliche Intervention wird behauptet. Der unten genannte Essay folgt einem Fehler zwischen Sender und Empfänger."),
        },
        {
          id: "vi-concept", layer: "concept",
          title: [x("Build the repair", "Ndërtoje korrigjimin", "Die Korrektur"), x("into the system", "brenda sistemit", "ins System einbauen")],
          lead: x(
            "Improvement requires authority and testing, not simply copying the popular informal alternative.",
            "Përmirësimi kërkon autoritet dhe provë, jo thjesht kopjimin e alternativës joformale të njohur.",
            "Verbesserung verlangt Befugnis und Test, nicht einfach das Kopieren der beliebten informellen Alternative."),
          blocks: [
            { type: "p", text: x(
              "The multiple-case research by Bartelheimer and colleagues describes how bottom-up adaptation can contribute to process innovation, but also shows that diffusion may go unnoticed and be governed unevenly. The practical conclusion is not to adopt every workaround. It is to create a deliberate pathway by which verified constraints are reviewed and safe alternatives tested. First, protect the customer and the current work. Second, determine whether the observed action was within authorised discretion. Third, find the process condition that created the alternative. Fourth, name an improvement owner with authority to alter that condition. Fifth, run a bounded test with a downstream quality measure. Sixth, revise the standard, train users and check whether the original constraint returns. The decision may be to keep the existing standard and remove the workaround. If it is a non-negotiable safety or privacy control, no experiment grants permission to bypass it. In other cases the standard itself may be obsolete or incomplete. In either direction the decision should be explicit, documented and communicated. Redesign creates a new risk: a cleaner procedure can shift work to another role. Check both sender and receiver before calling the change an improvement.",
              "Kërkimi me shumë raste i Bartelheimer-it dhe kolegëve përshkruan si përshtatja nga poshtë lart mund të kontribuojë në risinë e procesit, por tregon edhe se përhapja mund të kalojë pa u vënë re dhe të qeveriset në mënyrë të pabarabartë. Përfundimi praktik nuk është të miratohet çdo zgjidhje e përkohshme. Është të krijohet një rrugë e qëllimshme përmes së cilës kufizimet e verifikuara shqyrtohen dhe alternativat e sigurta provohen. Së pari, mbro klientin dhe punën aktuale. Së dyti, përcakto nëse veprimi i vëzhguar ishte brenda lirisë së autorizuar. Së treti, gjej kushtin e procesit që e krijoi alternativën. Së katërti, emërto një pronar përmirësimi me autoritet për ta ndryshuar atë kusht. Së pesti, bëj një provë të kufizuar me një matje të cilësisë më poshtë në rrjedhë. Së gjashti, rishiko standardin, trajno përdoruesit dhe kontrollo nëse kufizimi fillestar kthehet. Vendimi mund të jetë të mbahet standardi ekzistues dhe të hiqet zgjidhja e përkohshme. Nëse bëhet fjalë për një kontroll sigurie apo privatësie që nuk negociohet, asnjë eksperiment nuk jep leje për ta anashkaluar. Në raste të tjera vetë standardi mund të jetë i vjetruar ose i paplotë. Në cilindo drejtim, vendimi duhet të jetë i shprehur, i dokumentuar dhe i komunikuar. Riprojektimi krijon një rrezik të ri: një procedurë më e pastër mund ta zhvendosë punën te një rol tjetër. Kontrollo edhe dërguesin, edhe marrësin para se ta quash ndryshimin përmirësim.",
              "Die Mehrfallforschung von Bartelheimer und Kollegen beschreibt, wie Anpassung von unten zur Prozessinnovation beitragen kann, zeigt aber auch, dass Verbreitung unbemerkt bleiben und ungleich gesteuert werden kann. Die praktische Folgerung ist nicht, jeden Workaround zu übernehmen. Sie lautet, einen bewussten Weg zu schaffen, auf dem geprüfte Grenzen überprüft und sichere Alternativen getestet werden. Erstens den Kunden und die laufende Arbeit schützen. Zweitens klären, ob die beobachtete Handlung im befugten Ermessen lag. Drittens die Prozessbedingung finden, die die Alternative hervorbrachte. Viertens eine Verbesserungsverantwortliche mit Befugnis benennen, diese Bedingung zu ändern. Fünftens einen begrenzten Test mit einem nachgelagerten Qualitätsmaß durchführen. Sechstens den Standard überarbeiten, die Nutzer schulen und prüfen, ob die ursprüngliche Grenze zurückkehrt. Die Entscheidung kann sein, den bestehenden Standard zu behalten und den Workaround zu beseitigen. Bei einer nicht verhandelbaren Sicherheits- oder Datenschutzkontrolle erlaubt kein Experiment ihre Umgehung. In anderen Fällen ist der Standard selbst veraltet oder unvollständig. In jeder Richtung sollte die Entscheidung ausdrücklich, dokumentiert und mitgeteilt sein. Neugestaltung schafft ein neues Risiko: Ein saubererer Ablauf kann Arbeit auf eine andere Rolle verschieben. Sender und Empfänger prüfen, bevor die Änderung Verbesserung heißt.") },
            { type: "chain", items: [
              { h: x("Observe", "Vëzhgo", "Beobachten"), p: x("Real sequence.", "Radha e vërtetë.", "Echte Abfolge.") },
              { h: x("Evaluate", "Vlerëso", "Bewerten"), p: x("Risk and cause.", "Rreziku dhe shkaku.", "Risiko und Ursache.") },
              { h: x("Decide", "Vendos", "Entscheiden"), p: x("Authorised owner.", "Pronari i autorizuar.", "Befugte Verantwortliche.") },
              { h: x("Verify", "Verifiko", "Prüfen"), p: x("Downstream result.", "Rezultati më poshtë në rrjedhë.", "Nachgelagertes Ergebnis.") },
            ] },
            { type: "callout", reading: true, text: x(
              "The standard must carry the learning that the workaround exposed.",
              "Standardi duhet ta mbartë mësimin që e nxori në dritë zgjidhja e përkohshme.",
              "Der Standard muss das Lernen tragen, das der Workaround offengelegt hat.") },
          ],
          note: x(
            "Editorial governance model after Alter (2014), Bartelheimer et al. (2023) and Feldman and Pentland (2003).",
            "Model editorial qeverisjeje sipas Alter (2014), Bartelheimer et al. (2023) dhe Feldman e Pentland (2003).",
            "Redaktionelles Steuerungsmodell nach Alter (2014), Bartelheimer et al. (2023) und Feldman und Pentland (2003)."),
          source: ["alter-2014", "bartelheimer-wolf-beverungen-2023", "feldman-pentland-2003"],
        },
        {
          id: "vi-protocol", layer: "protocol",
          title: [x("A controlled", "Një cikël i kontrolluar", "Ein kontrollierter Zyklus"), x("exception-to-change cycle", "nga përjashtimi te ndryshimi", "von der Ausnahme zur Änderung")],
          lead: x(
            "One problem family, one owner and one documented check of whether the extra repair is still needed.",
            "Një familje problemesh, një pronar dhe një kontroll i dokumentuar nëse korrigjimi shtesë duhet ende.",
            "Eine Problemfamilie, eine Verantwortliche, eine dokumentierte Prüfung, ob die Korrektur noch nötig ist."),
          blocks: [
            { type: "steps", items: [
              { h: x("Contain", "Frenoje", "Eindämmen"), p: x("Protect current customers, workers and regulated obligations first.", "Mbro së pari klientët aktualë, punonjësit dhe detyrimet e rregulluara.", "Zuerst aktuelle Kunden, Beschäftigte und regulierte Pflichten schützen.") },
              { h: x("Describe", "Përshkruaje", "Beschreiben"), p: x("Write the actual exception in factual, anonymous terms.", "Shkruaje përjashtimin e vërtetë me terma faktikë dhe anonimë.", "Die tatsächliche Ausnahme sachlich und anonym festhalten.") },
              { h: x("Verify", "Verifikoje", "Prüfen"), p: x("Confirm the root condition with both sides of the handover.", "Konfirmo kushtin rrënjësor me të dyja anët e dorëzimit.", "Die Grundbedingung mit beiden Seiten der Übergabe bestätigen.") },
              { h: x("Choose", "Zgjidh", "Wählen"), p: x("Assign an authorised decision: approve, redesign, retain or prohibit.", "Cakto një vendim të autorizuar: mirato, riprojekto, mbaj ose ndalo.", "Eine befugte Entscheidung zuweisen: genehmigen, neu gestalten, beibehalten oder verbieten.") },
              { h: x("Test", "Provoje", "Testen"), p: x("Compare recurrence and downstream quality in a bounded sample.", "Krahaso përsëritjen dhe cilësinë më poshtë në rrjedhë në një mostër të kufizuar.", "Wiederkehr und nachgelagerte Qualität in einer begrenzten Stichprobe vergleichen.") },
              { h: x("Institutionalise", "Institucionalizoje", "Verankern"), p: x("Update controlled material, train users and report back on the outcome.", "Përditëso materialin e kontrolluar, trajno përdoruesit dhe raporto rezultatin.", "Kontrolliertes Material aktualisieren, Nutzer schulen und über das Ergebnis berichten.") },
            ] },
            { type: "p", text: x(
              "The research cited here proves no universal thirty-day deadline: urgent harms need immediate controls, and structural redesign may take longer. A documented open issue with a named owner is more honest than a premature “closed”. Track whether the workaround is still necessary and whether the recipient gets a better service; if only the first changes, the work may simply have moved.",
              "Kërkimi i cituar këtu nuk provon asnjë afat universal tridhjetëditor: dëmet urgjente kërkojnë kontrolle të menjëhershme, dhe riprojektimi strukturor mund të zgjasë më shumë. Një çështje e hapur e dokumentuar me pronar të emërtuar është më e ndershme se një “e mbyllur” e parakohshme. Ndiq nëse zgjidhja e përkohshme duhet ende dhe nëse marrësi merr shërbim më të mirë; nëse ndryshon vetëm e para, puna mund të jetë zhvendosur thjesht.",
              "Die hier zitierte Forschung belegt keine universelle Frist von dreißig Tagen: Dringende Schäden brauchen sofortige Kontrollen, strukturelle Neugestaltung kann länger dauern. Ein dokumentiertes offenes Thema mit benannter Verantwortlicher ist ehrlicher als ein verfrühtes „erledigt“. Verfolgen, ob der Workaround noch nötig ist und ob der Empfänger besseren Service erhält; ändert sich nur das Erste, ist die Arbeit womöglich nur verlagert.") },
            { type: "callout", reading: true, text: x(
              "Remove the recurring obstacle, not the employee's permission to notice a new one.",
              "Hiqe pengesën që përsëritet, jo lejen e punonjësit për të vënë re një të re.",
              "Das wiederkehrende Hindernis beseitigen, nicht die Erlaubnis, ein neues zu bemerken.") },
          ],
          note: x(
            "Original editorial method, inspired by Tucker et al. (2002), Alter (2014) and Bartelheimer et al. (2023); not a validated procedure.",
            "Metodë editoriale origjinale, e frymëzuar nga Tucker et al. (2002), Alter (2014) dhe Bartelheimer et al. (2023); jo procedurë e vërtetuar.",
            "Eigene redaktionelle Methode, angeregt durch Tucker et al. (2002), Alter (2014) und Bartelheimer et al. (2023); kein validiertes Verfahren."),
          source: ["tucker-edmondson-spear-2002", "alter-2014", "bartelheimer-wolf-beverungen-2023"],
        },
      ],
    },

    {
      id: "tool", tool: "/tools/kaizen-board/",
      kicker: x("Field tool", "Mjeti i terrenit", "Werkzeug vor Ort"),
      title: [x("The Exception", "Karta", "Die"), x("Intelligence Card", "e përjashtimeve", "Ausnahmekarte")],
      lead: x(
        "An original, anonymised worksheet for understanding recurring deviations without normalising unsafe shortcuts. One exception, one boundary, one decision, one check; if something is unknown, write “not measured”.",
        "Një fletë pune origjinale dhe anonime për t'i kuptuar devijimet që përsëriten pa i normalizuar shkurtesat e pasigurta. Një përjashtim, një kufi, një vendim, një kontroll; nëse diçka nuk dihet, shkruaj “e pamatur”.",
        "Ein eigenes, anonymisiertes Arbeitsblatt, um wiederkehrende Abweichungen zu verstehen, ohne unsichere Abkürzungen zu normalisieren. Eine Ausnahme, eine Grenze, eine Entscheidung, eine Prüfung; ist etwas unbekannt, „nicht gemessen“ schreiben."),
      blocks: [
        { type: "form", items: [
          { h: x("Observed exception", "Përjashtimi i vëzhguar", "Beobachtete Ausnahme"), hint: x("which approved step or input failed? what is verified?", "cili hap ose e dhënë e miratuar dështoi? çfarë është verifikuar?", "welcher genehmigte Schritt oder welche Eingabe versagte? was ist geprüft?") },
          { h: x("Boundary and containment", "Kufiri dhe frenimi", "Grenze und Eindämmung"), hint: x("was any mandatory safety, privacy or authority control involved?", "a u përfshi ndonjë kontroll i detyrueshëm sigurie, privatësie apo autoriteti?", "war eine Pflichtkontrolle zu Sicherheit, Datenschutz oder Befugnis betroffen?") },
          { h: x("Worker correction", "Korrigjimi i punonjësit", "Korrektur der Beschäftigten"), hint: x("what additional action was taken? was it authorised?", "çfarë veprimi shtesë u ndërmor? a ishte i autorizuar?", "welche Zusatzhandlung wurde gewählt? war sie befugt?") },
          { h: x("Recurrence and consequence", "Përsëritja dhe pasoja", "Wiederkehr und Folge"), hint: x("how often? extra time? downstream quality? write “not measured” if unknown", "sa shpesh? kohë shtesë? cilësia më poshtë në rrjedhë? shkruaj “e pamatur” nëse nuk dihet", "wie oft? Zusatzzeit? nachgelagerte Qualität? „nicht gemessen“, wenn unbekannt") },
          { h: x("Decision and owner", "Vendimi dhe pronari", "Entscheidung und Verantwortliche"), hint: x("retain, redesign, prohibit or investigate: who can authorise it?", "mbaj, riprojekto, ndalo apo heto: kush mund ta autorizojë?", "beibehalten, neu gestalten, verbieten oder untersuchen: wer kann es genehmigen?") },
          { h: x("Verification and tell-back", "Verifikimi dhe kthimi i përgjigjes", "Prüfung und Rückmeldung"), hint: x("when will the next sample be checked and the team updated?", "kur do të kontrollohet mostra e radhës dhe kur do të informohet ekipi?", "wann wird die nächste Stichprobe geprüft und das Team informiert?") },
        ] },
      ],
      note: x(
        "Use boundary: this card does not authorise bypassing a controlled SOP, safety check, privacy obligation, hotel procedure or legal requirement. Keep sensitive cases in approved internal systems. The Kaizen Board on this site keeps the decisions and their checks.",
        "Kufiri i përdorimit: kjo kartë nuk autorizon anashkalimin e një SOP-je të kontrolluar, kontrolli sigurie, detyrimi privatësie, procedure hoteli apo kërkese ligjore. Mbaji rastet e ndjeshme në sistemet e brendshme të miratuara. Tabela Kaizen në këtë faqe i mban vendimet dhe kontrollet e tyre.",
        "Einsatzgrenze: Diese Karte erlaubt nicht, ein kontrolliertes SOP, eine Sicherheitsprüfung, eine Datenschutzpflicht, ein Hotelverfahren oder eine Rechtsvorschrift zu umgehen. Sensible Fälle in genehmigten internen Systemen führen. Das Kaizen-Board auf dieser Website hält die Entscheidungen und ihre Prüfungen fest."),
      source: ["alter-2014", "tucker-edmondson-spear-2002"],
    },
    {
      id: "closing",
      kicker: x("Closing essay", "Eseja e mbylljes", "Schlussessay"),
      title: [x("The hidden tax", "Taksa e fshehur", "Die verborgene Steuer"), x("on good work", "mbi punën e mirë", "auf gute Arbeit")],
      lead: x(
        "A dependable organisation does not ask its best people to conceal the same defect forever.",
        "Një organizatë e besueshme nuk u kërkon njerëzve të saj më të mirë ta fshehin të njëjtin defekt përgjithmonë.",
        "Eine verlässliche Organisation verlangt von ihren besten Leuten nicht, denselben Mangel für immer zu verbergen."),
      blocks: [
        { type: "p", text: x(
          "We praise the people who know how to keep things moving. Often they deserve that praise. A frontline worker who notices a missing input, verifies the condition and protects the next person is demonstrating judgement. But there is a managerial danger in turning that competence into a permanent operating requirement. When the same extra action must be repeated, the organisation has not yet decided whether it belongs in the process. A report may show that the job was completed. The worker remembers the phone call, the recheck and the explanation that made completion possible. Neither perspective is automatically false; they describe different parts of the work. The purpose of management is to connect them without mistaking the visible output for the whole production of that output. The research in this volume resists simple morals. Tucker and colleagues found that solving immediate problems can interfere with organisational learning. Feldman and Pentland explain why routines vary in performance. Alter shows the forces behind workarounds. Bartelheimer and colleagues show how informal practices can spread and become sources of innovation. Van der Waal and colleagues show that digital traces can help identify candidate patterns, while still requiring interpretation. Together these perspectives demand curiosity and governance, not celebration of shortcuts. For a warehouse, a delivery network, a wholesale operation or a hotel shift, the discipline is similar. Observe the real work. Identify the missing condition. Protect the boundaries that are non-negotiable. Give the recurring problem to someone who can change its source. Test the improvement at the receiving end. Return the answer to the people who had to carry the old burden. The aim is not to remove human initiative from the workplace. It is to stop charging workers an invisible tax for weaknesses the organisation can repair. Good judgement will always be needed. The same preventable correction, performed forever, should not be its permanent assignment.",
          "Ne i lavdërojmë njerëzit që dinë ta mbajnë punën në lëvizje. Shpesh e meritojnë atë lavdërim. Një punonjës i vijës së parë që vë re një të dhënë që mungon, verifikon gjendjen dhe e mbron personin tjetër po tregon gjykim. Por ka një rrezik menaxherial kur ajo aftësi kthehet në kërkesë të përhershme operative. Kur i njëjti veprim shtesë duhet përsëritur, organizata ende nuk ka vendosur nëse ai i përket procesit. Një raport mund të tregojë se puna u krye. Punonjësi e kujton telefonatën, rikontrollin dhe shpjegimin që e bënë të mundur përfundimin. Asnjëra pikëpamje nuk është automatikisht e rreme; përshkruajnë pjesë të ndryshme të punës. Qëllimi i menaxhimit është t'i lidhë, pa e ngatërruar rezultatin e dukshëm me gjithë prodhimin e atij rezultati. Kërkimi në këtë vëllim u reziston moraleve të thjeshta. Tucker dhe kolegët gjetën se zgjidhja e problemeve të menjëhershme mund ta pengojë të mësuarit organizativ. Feldman dhe Pentland shpjegojnë pse rutinat ndryshojnë në kryerje. Alter tregon forcat pas zgjidhjeve të përkohshme. Bartelheimer dhe kolegët tregojnë si praktikat joformale mund të përhapen dhe të bëhen burime risie. Van der Waal dhe kolegët tregojnë se gjurmët digjitale mund të ndihmojnë të gjenden modele kandidate, por kërkojnë ende interpretim. Bashkë, këto pikëpamje kërkojnë kureshtje dhe qeverisje, jo festimin e shkurtesave. Për një magazinë, një rrjet dorëzimesh, një operacion me shumicë apo një turn hoteli, disiplina është e ngjashme. Vëzhgo punën e vërtetë. Gjej kushtin që mungon. Mbro kufijtë që nuk negociohen. Jepja problemin që përsëritet dikujt që mund ta ndryshojë burimin e tij. Provoje përmirësimin te marrësi. Ktheja përgjigjen njerëzve që duhej ta mbanin barrën e vjetër. Qëllimi nuk është ta heqim nismën njerëzore nga vendi i punës. Është të ndalojmë t'u marrim punonjësve një taksë të padukshme për dobësi që organizata mund t'i ndreqë. Gjykimi i mirë do të duhet gjithmonë. I njëjti korrigjim i parandalueshëm, i kryer përgjithmonë, nuk duhet të jetë detyra e tij e përhershme.",
          "Wir loben die Menschen, die wissen, wie man die Dinge in Gang hält. Oft verdienen sie das Lob. Wer an vorderster Front eine fehlende Eingabe bemerkt, die Lage prüft und die nächste Person schützt, zeigt Urteilskraft. Doch es liegt eine Führungsgefahr darin, diese Kompetenz zur dauerhaften Betriebsanforderung zu machen. Muss dieselbe Zusatzhandlung immer wieder geschehen, hat die Organisation noch nicht entschieden, ob sie in den Prozess gehört. Ein Bericht mag zeigen, dass die Arbeit erledigt wurde. Die Beschäftigte erinnert sich an den Anruf, die Nachprüfung und die Erklärung, die die Erledigung möglich machten. Keine der beiden Sichten ist automatisch falsch; sie beschreiben verschiedene Teile der Arbeit. Aufgabe der Führung ist, sie zu verbinden, ohne das sichtbare Ergebnis für die ganze Herstellung dieses Ergebnisses zu halten. Die Forschung in diesem Band widersteht einfachen Moralen. Tucker und Kollegen fanden, dass das Lösen unmittelbarer Probleme organisationales Lernen stören kann. Feldman und Pentland erklären, warum Routinen in der Ausführung schwanken. Alter zeigt die Kräfte hinter Workarounds. Bartelheimer und Kollegen zeigen, wie sich informelle Praktiken verbreiten und zu Quellen der Innovation werden können. Van der Waal und Kollegen zeigen, dass digitale Spuren helfen können, Kandidatenmuster zu finden, die dennoch Deutung brauchen. Zusammen verlangen diese Sichten Neugier und Steuerung, nicht die Feier der Abkürzung. Für ein Lager, ein Zustellnetz, einen Großhandel oder eine Hotelschicht ist die Disziplin ähnlich. Die echte Arbeit beobachten. Die fehlende Bedingung finden. Die nicht verhandelbaren Grenzen schützen. Das wiederkehrende Problem jemandem geben, der seine Quelle ändern kann. Die Verbesserung beim Empfänger testen. Die Antwort den Menschen zurückgeben, die die alte Last tragen mussten. Ziel ist nicht, menschliche Initiative vom Arbeitsplatz zu entfernen. Ziel ist, den Beschäftigten keine unsichtbare Steuer mehr für Schwächen abzuverlangen, die die Organisation beheben kann. Gutes Urteil wird immer gebraucht. Dieselbe vermeidbare Korrektur, für immer ausgeführt, sollte nicht seine dauerhafte Aufgabe sein.") },
        { type: "callout", reading: true, text: x(
          "When people must repair the process every day, the process is not as reliable as the dashboard suggests.",
          "Kur njerëzit duhet ta ndreqin procesin çdo ditë, procesi nuk është aq i besueshëm sa e tregon paneli.",
          "Wenn Menschen den Prozess jeden Tag reparieren müssen, ist er nicht so verlässlich, wie das Dashboard nahelegt.") },
      ],
      note: x(
        "Editorial essay opening the second cycle of the treatise. No recurring correction, workaround or redesign is attributed to any named employer.",
        "Ese editoriale që hap ciklin e dytë të traktatit. Asnjë korrigjim i përsëritur, zgjidhje e përkohshme apo riprojektim nuk i atribuohet ndonjë punëdhënësi të caktuar.",
        "Redaktioneller Essay zum Auftakt des zweiten Zyklus des Traktats. Keine wiederkehrende Korrektur, kein Workaround und keine Neugestaltung wird einem bestimmten Arbeitgeber zugeschrieben."),
    },
    {
      id: "method",
      kicker: x("Method", "Metoda", "Methode"),
      title: [x("Where the claims", "Nga vijnë", "Woher die Behauptungen"), x("come from", "pohimet", "stammen")],
      lead: x(
        "An evidence-informed editorial synthesis, not original field research: eleven reference works, observation studies, routines theory, a theory of workarounds, a multiple-case study and a process-mining study, each with its limits. Scenes, sample arithmetic and the card are editorial.",
        "Një sintezë editoriale e mbështetur në prova, jo kërkim origjinal në terren: njëmbëdhjetë vepra referimi, studime vëzhgimi, teoria e rutinave, një teori e zgjidhjeve të përkohshme, një studim me shumë raste dhe një studim me nxjerrje procesesh, secili me kufijtë e vet. Skenat, aritmetika shembull dhe karta janë editoriale.",
        "Eine belegbasierte redaktionelle Synthese, keine eigene Feldforschung: elf Referenzwerke, Beobachtungsstudien, Routinentheorie, eine Theorie der Workarounds, eine Mehrfallstudie und eine Process-Mining-Studie, jedes mit seinen Grenzen. Szenen, Beispielrechnung und Karte sind redaktionell."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("Observation", "Vëzhgimi", "Beobachtung"), p: x("197 hours of nursing work (Tucker et al. 2002); 239 hours, 26 nurses, nine hospitals (Tucker and Edmondson 2003); most failures from material and information supply across boundaries (Tucker 2004). Hospitals, not warehouses or hotels.", "197 orë pune infermierore (Tucker et al. 2002); 239 orë, 26 infermiere, nëntë spitale (Tucker e Edmondson 2003); shumica e dështimeve nga furnizimi me materiale dhe informacion përtej kufijve (Tucker 2004). Spitale, jo magazina apo hotele.", "197 Stunden Pflegearbeit (Tucker et al. 2002); 239 Stunden, 26 Pflegekräfte, neun Krankenhäuser (Tucker und Edmondson 2003); die meisten Störungen aus der Material- und Informationsversorgung über Grenzen (Tucker 2004). Krankenhäuser, keine Lager oder Hotels.") },
          { h: x("Theory", "Teoria", "Theorie"), p: x("Feldman and Pentland (2003) on ostensive and performative routines; Alter (2014) on why workarounds are chosen; Halbesleben et al. (2008) on their safety consequences. Mechanisms, not measured rates.", "Feldman e Pentland (2003) për rutinat ostensive dhe performative; Alter (2014) për arsyet pse zgjidhen zgjidhjet e përkohshme; Halbesleben et al. (2008) për pasojat e tyre në siguri. Mekanizma, jo norma të matura.", "Feldman und Pentland (2003) zu ostensiven und performativen Routinen; Alter (2014) dazu, warum Workarounds gewählt werden; Halbesleben et al. (2008) zu ihren Sicherheitsfolgen. Mechanismen, keine gemessenen Quoten.") },
          { h: x("Cases and logs", "Raste dhe regjistra", "Fälle und Protokolle"), p: x("Nine workarounds in three cases over two years (Bartelheimer et al. 2023); eleven types in two hospital departments (van der Waal et al. 2025, online 2024). Counts of study scope, not benchmarks.", "Nëntë zgjidhje të përkohshme në tri raste gjatë dy vjetëve (Bartelheimer et al. 2023); njëmbëdhjetë tipe në dy reparte spitalore (van der Waal et al. 2025, në internet 2024). Numra të shtrirjes së studimit, jo pika referimi.", "Neun Workarounds in drei Fällen über zwei Jahre (Bartelheimer et al. 2023); elf Typen in zwei Krankenhausabteilungen (van der Waal et al. 2025, online 2024). Zahlen zum Studienumfang, keine Richtwerte.") },
          { h: x("Invented counts", "Numrat e shpikur", "Erfundene Zahlen"), p: x("Twenty deviations by category (8, 7, 3, 2) and the handover example (12 of 80, 15%; 48 → 20 minutes, 28 less) are illustrations flagged on their pages.", "Njëzet devijime sipas kategorisë (8, 7, 3, 2) dhe shembulli i dorëzimeve (12 nga 80, 15%; 48 → 20 minuta, 28 më pak) janë ilustrime me flamur në faqet e tyre.", "Zwanzig Abweichungen nach Kategorie (8, 7, 3, 2) und das Übergabebeispiel (12 von 80, 15 %; 48 → 20 Minuten, 28 weniger) sind auf ihren Seiten gekennzeichnete Illustrationen.") },
        ] },
        { type: "p", text: x(
          "The four categories, the six-step protocols, the four measurement lenses and the Exception Intelligence Card are editorial proposals for local testing, not validated safety controls or employer-approved procedures. Publisher records were checked for every source; where a book or paper was read through its publisher's summary, the list says so. Editorial standard: a theory, a field study, a case study and a proposal are named as such, and the sentence stops claiming where the evidence stops.",
          "Katër kategoritë, protokollet me gjashtë hapa, katër lentet e matjes dhe Karta e përjashtimeve janë propozime editoriale për provë lokale, jo kontrolle sigurie të vërtetuara apo procedura të miratuara nga punëdhënësi. Regjistrat e botuesve u kontrolluan për çdo burim; kur një libër apo punim është lexuar përmes përmbledhjes së botuesit, lista e thotë. Standardi editorial: një teori, një studim në terren, një studim rasti dhe një propozim quhen me emrin e tyre, dhe fjalia pushon së pohuari aty ku mbaron prova.",
          "Die vier Kategorien, die sechsstufigen Protokolle, die vier Messlinsen und die Ausnahmekarte sind redaktionelle Vorschläge für die örtliche Prüfung, keine validierten Sicherheitskontrollen und keine vom Arbeitgeber genehmigten Verfahren. Die Verlagsdaten wurden für jede Quelle geprüft; wo ein Buch oder Aufsatz über die Zusammenfassung des Verlags gelesen wurde, sagt es das Verzeichnis. Redaktioneller Standard: Eine Theorie, eine Feldstudie, eine Fallstudie und ein Vorschlag werden als solche benannt, und der Satz hört auf zu behaupten, wo die Belege enden.") },
      ],
      note: x(
        "Every source is cited on the next page; the eleven records, their journals, volumes, pages and years were checked against the publishers' metadata and abstracts.",
        "Çdo burim citohet në faqen tjetër; njëmbëdhjetë regjistrimet, revistat, vëllimet, faqet dhe vitet e tyre u kontrolluan kundrejt metadata-ve dhe abstrakteve të botuesve.",
        "Jede Quelle ist auf der nächsten Seite zitiert; die elf Einträge, ihre Zeitschriften, Bände, Seiten und Jahre wurden an den Metadaten und Abstracts der Verlage geprüft."),
      source: ["tucker-edmondson-spear-2002", "feldman-pentland-2003", "tucker-edmondson-2003", "tucker-2004", "halbesleben-2008", "alter-2014", "bartelheimer-wolf-beverungen-2023", "van-der-waal-2025", "van-der-aalst-2016", "vsm-rother-shook-1999", "vsm-martin-osterling-2014"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
