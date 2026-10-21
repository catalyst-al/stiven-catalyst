// Operational treatise, Volume 3: The human override, when automation is wrong. Block: Operations.
// Facts and their sources: docs/revista/traktati-operacional.md. The research is the human-automation literature
// (Bainbridge 1983, Endsley & Kiris 1995, Parasuraman & Riley 1997, Parasuraman, Sheridan & Wickens 2000, Lee & See
// 2004, Goddard et al. 2012, Romeo & Conti 2025), each checked at its DOI; the two counts of the reviews were read in
// the abstracts. Six chapters, each in the three layers: the living scene, the conceptual and scientific breakdown,
// the operating protocol for action. The scenes are constructed from the categories of work the author knows
// (last-mile dispatch, the loading area, the hotel night shift) and say so; the one documented experience (the
// training shift without the system) is marked as such and kept general; the 100-case alarm example is invented so
// the arithmetic can be checked.
import { x } from "../common.js";

const hypothetical = x("Fully hypothetical example: 100 cases, not company data", "Shembull krejt hipotetik: 100 raste, jo të dhëna kompanie", "Rein hypothetisches Beispiel: 100 Fälle, keine Unternehmensdaten");

export default {
  number: 3,
  numeral: "III",
  block: "operations",
  date: x("October 2026", "Tetor 2026", "Oktober 2026"),
  theme: [x("The human override:", "Ndërhyrja njerëzore:", "Der menschliche Eingriff:"), x("when automation is wrong", "kur automatizimi gabon", "wenn die Automatik irrt")],
  sub: x(
    "Who takes responsibility? Six chapters on trust, alarms, system interruption and human judgment across everyday operations: the green dashboard, the ironies of automation, the base rate of an alert, what the driver knows, the night without the system, and the override that someone must own.",
    "Kush e merr përgjegjësinë? Gjashtë kapituj për besimin, alarmet, ndërprerjen e sistemit dhe gjykimin njerëzor në punën e përditshme: paneli i gjelbër, ironitë e automatizimit, baza e një alarmi, çfarë di shoferi, nata pa sistem, dhe ndërhyrja që dikush duhet ta marrë përsipër.",
    "Wer übernimmt die Verantwortung? Sechs Kapitel über Vertrauen, Alarme, Systemausfall und menschliches Urteil im Betriebsalltag: das grüne Dashboard, die Ironien der Automatisierung, die Basisrate eines Alarms, was der Fahrer weiß, die Nacht ohne System und der Eingriff, den jemand verantworten muss."),
  seo: x(
    "The human override as an operational treatise: six chapters in three layers, from a green dashboard to Bainbridge, an alarm's base rate and the override card.",
    "Ndërhyrja njerëzore si traktat operacional: gjashtë kapituj në tri shtresa, nga paneli i gjelbër te Bainbridge, baza e alarmit dhe karta e ndërhyrjes.",
    "Der menschliche Eingriff als operativer Traktat: sechs Kapitel in drei Ebenen, vom grünen Dashboard zu Bainbridge, der Basisrate und dem Eingriffsblatt."),
  feature: x(
    "Volume 3 asks what happens when an automated output looks complete and the work is not. Its six chapters move from a green departure status, a route-planning outage and a screen full of red to the research on the ironies of automation, out-of-the-loop performance and automation bias, and end with a five-stage override cycle and a card for the disputed output.",
    "Vëllimi 3 pyet çfarë ndodh kur një rezultat i automatizuar duket i plotë dhe puna nuk është. Gjashtë kapitujt e tij shkojnë nga një status i gjelbër nisjeje, një ndërprerje e planifikimit të rrugëve dhe një ekran plot të kuqe te kërkimi për ironitë e automatizimit, humbjen e pamjes së situatës dhe anshmërinë ndaj automatizimit, dhe mbyllen me një cikël ndërhyrjeje me pesë faza dhe një kartë për rezultatin e kontestuar.",
    "Band 3 fragt, was geschieht, wenn eine automatisierte Ausgabe vollständig aussieht und die Arbeit es nicht ist. Seine sechs Kapitel führen von einem grünen Abfahrtsstatus, einem Ausfall der Routenplanung und einem Bildschirm voller Rot zur Forschung über die Ironien der Automatisierung, den Verlust des Lagebilds und Automation Bias, und enden mit einem Eingriffszyklus in fünf Stufen und einem Blatt für die strittige Ausgabe."),
  figure: { n: "74", by: "Goddard et al., 2012", t: x(
    "studies met the inclusion criteria in a systematic review of automation bias, out of 13,821 retrieved papers.",
    "studime i plotësuan kriteret e përfshirjes në një rishikim sistematik të anshmërisë ndaj automatizimit, nga 13.821 punime të gjetura.",
    "Studien erfüllten die Einschlusskriterien einer systematischen Übersicht zu Automation Bias, von 13.821 gefundenen Arbeiten.") },
  teasers: [
    { page: "i-scene", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("The green dashboard, the unfinished job", "Paneli i gjelbër, puna e papërfunduar", "Das grüne Dashboard, die unfertige Arbeit") },
    { page: "iv-evidence", kicker: x("The evidence", "Prova", "Die Belege"),
      title: x("What the reviews actually found", "Çfarë gjetën vërtet rishikimet", "Was die Übersichten wirklich fanden") },
    { page: "tool", kicker: x("Field tool", "Mjeti i terrenit", "Werkzeug vor Ort"),
      title: x("The Human Override Card", "Karta e ndërhyrjes njerëzore", "Das Eingriffsblatt") },
  ],
  contract: [
    { h: x("Field", "Terreni", "Feld"), p: x("Only verified background from real roles; no invented personal incidents.", "Vetëm sfond i verifikuar nga role të vërteta; pa ngjarje personale të shpikura.", "Nur geprüfter Hintergrund aus echten Rollen; keine erfundenen persönlichen Vorfälle.") },
    { h: x("Science", "Shkenca", "Wissenschaft"), p: x("Researchers, dates, populations and limits appear beside every claim.", "Kërkuesit, datat, popullatat dhe kufijtë shfaqen pranë çdo pohimi.", "Forscher, Daten, Populationen und Grenzen stehen neben jeder Aussage.") },
    { h: x("Action", "Veprimi", "Handeln"), p: x("An authorised next step, an owner and an observable result.", "Një hap i radhës i autorizuar, një përgjegjës dhe një rezultat i vëzhgueshëm.", "Ein befugter nächster Schritt, ein Verantwortlicher und ein beobachtbares Ergebnis.") },
  ],
  sources: ["bainbridge-1983", "endsley-kiris-1995", "parasuraman-riley-1997", "parasuraman-sheridan-wickens-2000", "lee-see-2004", "goddard-2012", "romeo-conti-2025"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      title: [x("The decision", "Vendimi", "Die Entscheidung"), x("after the signal", "pas sinjalit", "nach dem Signal")],
      why: x(
        "A screen may offer an answer before the person closest to the work can explain the question.",
        "Një ekran mund ta japë përgjigjen para se personi më afër punës të arrijë ta shpjegojë pyetjen.",
        "Ein Bildschirm kann eine Antwort liefern, bevor die Person, die der Arbeit am nächsten steht, die Frage erklären kann."),
      body: x(
        "An automated route, a scan event, a red dashboard indicator and a hotel status are not interchangeable. Each is a record produced for a particular purpose. At its best, the system compresses routine effort and helps teams coordinate. At its worst, its speed encourages the organisation to skip a slower step: establishing what happened and who is authorised to act. This volume follows one practical question across logistics, dispatching and night-shift hospitality: what happens when an automated output appears complete but the work is not? The reader will meet constructed scenes, published studies and documented work categories. They are not the same kind of evidence. An invented case can clarify a mechanism; it cannot prove that a named workplace suffered that failure. No guest, driver or employer is identified, and no private system procedure is disclosed.",
        "Një rrugë e automatizuar, një skanim, një tregues i kuq në panel dhe një status hoteli nuk janë të këmbyeshëm. Secili është një regjistrim i prodhuar për një qëllim të caktuar. Në rastin më të mirë, sistemi e ngjesh punën rutinë dhe i ndihmon ekipet të koordinohen. Në rastin më të keq, shpejtësia e tij e nxit organizatën të kapërcejë një hap më të ngadaltë: të vërtetojë çfarë ndodhi dhe kush ka autoritetin të veprojë. Ky vëllim e ndjek një pyetje praktike nëpër logjistikë, dispeçeri dhe turnin e natës në hotel: çfarë ndodh kur një rezultat i automatizuar duket i plotë, por puna nuk është? Lexuesi do të hasë skena të ndërtuara, studime të botuara dhe kategori pune të dokumentuara. Nuk janë i njëjti lloj prove. Një rast i shpikur mund ta qartësojë një mekanizëm; nuk mund të provojë se një vend pune i caktuar e pësoi atë dështim. Nuk identifikohet asnjë mysafir, shofer apo punëdhënës, dhe nuk zbulohet asnjë procedurë private sistemi.",
        "Eine automatisierte Route, ein Scan, eine rote Anzeige im Dashboard und ein Hotelstatus sind nicht austauschbar. Jedes ist ein Datensatz, der für einen bestimmten Zweck erzeugt wurde. Im besten Fall verdichtet das System Routinearbeit und hilft Teams, sich abzustimmen. Im schlechtesten Fall verleitet seine Geschwindigkeit die Organisation, einen langsameren Schritt zu überspringen: festzustellen, was geschehen ist und wer handeln darf. Dieser Band verfolgt eine praktische Frage durch Logistik, Disposition und die Nachtschicht im Hotel: Was geschieht, wenn eine automatisierte Ausgabe vollständig erscheint, die Arbeit aber nicht ist? Der Leser trifft auf konstruierte Szenen, veröffentlichte Studien und dokumentierte Arbeitskategorien. Sie sind nicht dieselbe Art von Beleg. Ein erfundener Fall kann einen Mechanismus klären; er kann nicht beweisen, dass ein bestimmter Betrieb diesen Fehler erlitt. Kein Gast, Fahrer oder Arbeitgeber wird genannt, und kein internes Systemverfahren wird offengelegt."),
    },
    { id: "contents", type: "contents" },
    {
      id: "note",
      kicker: x("Research note", "Shënim kërkimor", "Forschungsnotiz"),
      title: [x("What this evidence", "Çfarë mund", "Was diese Belege"), x("can tell us", "të na thotë kjo provë", "sagen können")],
      lead: x(
        "Research on pilots, control-room operators and clinical decision support offers mechanisms, not local performance estimates.",
        "Kërkimi mbi pilotët, operatorët e dhomave të kontrollit dhe sistemet e mbështetjes së vendimit klinik ofron mekanizma, jo vlerësime të performancës lokale.",
        "Forschung zu Piloten, Leitwartenpersonal und klinischer Entscheidungsunterstützung liefert Mechanismen, keine lokalen Leistungsschätzungen."),
      blocks: [
        { type: "p", text: x(
          "Bainbridge (1983) examined the paradoxes of industrial automation. Endsley and Kiris (1995) studied performance after an automated navigation aid failed. Parasuraman and Riley (1997) distinguished reliance, over-reliance and the rejection of useful automation. Goddard and colleagues (2012) reviewed empirical studies across domains; Romeo and Conti (online 2025) focused on modern human-AI collaboration. Their settings differ from a loading ramp, an office dispatch desk or a night hotel reception. Transfer is defensible only at the level of a mechanism to test: degraded monitoring, stale records, over-trust, ignored alarms, missing recovery knowledge or unclear authority. It is not defensible to import a published error percentage as though it came from the author's workplaces.",
          "Bainbridge (1983) shqyrtoi paradokset e automatizimit industrial. Endsley dhe Kiris (1995) studiuan performancën pasi dështoi një ndihmës i automatizuar navigimi. Parasuraman dhe Riley (1997) dalluan mbështetjen, mbështetjen e tepruar dhe refuzimin e automatizimit të dobishëm. Goddard dhe kolegët (2012) rishikuan studime empirike nga fusha të ndryshme; Romeo dhe Conti (në internet 2025) u përqendruan te bashkëpunimi i sotëm njeri-AI. Mjediset e tyre ndryshojnë nga një rampë ngarkimi, një tavolinë dispeçerie apo një recepsion hoteli natën. Transferimi mbrohet vetëm në nivelin e një mekanizmi për t'u provuar: mbikëqyrje e dobësuar, regjistrime të vjetruara, besim i tepruar, alarme të shpërfillura, mungesë e njohurive të rikuperimit ose autoritet i paqartë. Nuk mbrohet importimi i një përqindjeje gabimi të botuar sikur të vinte nga vendet e punës së autorit.",
          "Bainbridge (1983) untersuchte die Paradoxien der industriellen Automatisierung. Endsley und Kiris (1995) erforschten die Leistung nach dem Ausfall einer automatisierten Navigationshilfe. Parasuraman und Riley (1997) unterschieden Verlassen, Überverlassen und das Verwerfen nützlicher Automatik. Goddard und Kollegen (2012) sichteten empirische Studien über Fachgebiete hinweg; Romeo und Conti (online 2025) richteten den Blick auf die heutige Mensch-KI-Zusammenarbeit. Ihre Umgebungen unterscheiden sich von einer Laderampe, einem Dispositionsschreibtisch oder einer Hotelrezeption bei Nacht. Eine Übertragung ist nur auf der Ebene eines zu prüfenden Mechanismus vertretbar: nachlassende Überwachung, veraltete Datensätze, Übervertrauen, ignorierte Alarme, fehlendes Wiederanlaufwissen oder unklare Befugnis. Nicht vertretbar ist, eine veröffentlichte Fehlerquote zu übernehmen, als stammte sie aus den Betrieben des Autors.") },
        { type: "cards", cols: 3, items: [
          { h: x("Observed", "E vëzhguar", "Beobachtet"), p: x("Published study, measured outcome, population and year.", "Studim i botuar, rezultat i matur, popullatë dhe vit.", "Veröffentlichte Studie, gemessenes Ergebnis, Population und Jahr.") },
          { h: x("Inferred", "E nxjerrë", "Gefolgert"), p: x("A plausible operational risk, stated as a hypothesis.", "Një rrezik operacional i besueshëm, i thënë si hipotezë.", "Ein plausibles betriebliches Risiko, als Hypothese formuliert.") },
          { h: x("Proposed", "E propozuar", "Vorgeschlagen"), p: x("A practice or metric awaiting local validation.", "Një praktikë ose matje që pret vërtetim lokal.", "Eine Praxis oder Kennzahl, die auf lokale Prüfung wartet.") },
        ] },
        { type: "callout", reading: true, text: x(
          "The purpose of research here is to discipline what we claim, not to make a constructed scene look verified.",
          "Qëllimi i kërkimit këtu është të disiplinojë atë që pohojmë, jo ta bëjë një skenë të ndërtuar të duket e verifikuar.",
          "Die Forschung dient hier dazu, unsere Aussagen zu disziplinieren, nicht, eine konstruierte Szene geprüft aussehen zu lassen.") },
      ],
      note: x(
        "Full references on the sources page; every study is cited at its DOI and read in its published version or abstract.",
        "Referencat e plota në faqen e burimeve; çdo studim citohet me DOI-n e vet dhe është lexuar në versionin e botuar ose në abstrakt.",
        "Vollständige Angaben auf der Quellenseite; jede Studie ist mit ihrer DOI zitiert und in der veröffentlichten Fassung oder im Abstract gelesen."),
      source: ["bainbridge-1983", "endsley-kiris-1995", "parasuraman-riley-1997", "goddard-2012", "romeo-conti-2025"],
    },

    // Chapter I. The green dashboard, the unfinished job
    {
      id: "ch-i", type: "chapter", numeral: "I",
      title: x("The green dashboard, the unfinished job", "Paneli i gjelbër, puna e papërfunduar", "Das grüne Dashboard, die unfertige Arbeit"),
      pages: [
        {
          id: "i-scene", layer: "scene", more: "the-report-a-machine-wrote",
          title: [x("The green dashboard,", "Paneli i gjelbër,", "Das grüne Dashboard,"), x("the unfinished job", "puna e papërfunduar", "die unfertige Arbeit")],
          lead: x(
            "A screen can be accurate about the field it records while the overall service remains incomplete.",
            "Një ekran mund të jetë i saktë për fushën që regjistron, ndërsa shërbimi në tërësi mbetet i paplotë.",
            "Ein Bildschirm kann in dem Feld, das er erfasst, richtig liegen, während die Leistung als Ganzes unvollständig bleibt."),
          blocks: [
            { type: "flag", text: x("Hypothetical composite, not a recorded incident", "Kompozim hipotetik, jo ngjarje e regjistruar", "Hypothetische Zusammensetzung, kein dokumentierter Vorfall") },
            { type: "p", text: x(
              "The dashboard marks a departure as complete. A vehicle has left the loading area; the timestamp is legitimate. But an unresolved discrepancy in the load had been discussed moments earlier. One colleague recorded an exception in one place, another sees only the successful departure status. The display is green because the departure occurred. The customer-facing process is not necessarily green.",
              "Paneli e shënon nisjen si të kryer. Një automjet ka dalë nga zona e ngarkimit; ora e regjistruar është e vërtetë. Por pak çaste më parë ishte diskutuar një mospërputhje e pazgjidhur në ngarkesë. Një koleg e shënoi përjashtimin në një vend, tjetri sheh vetëm statusin e nisjes së suksesshme. Ekrani është i gjelbër sepse nisja ndodhi. Procesi që i del klientit nuk është doemos i gjelbër.",
              "Das Dashboard markiert eine Abfahrt als erledigt. Ein Fahrzeug hat den Ladebereich verlassen; der Zeitstempel stimmt. Doch Augenblicke zuvor wurde eine ungeklärte Abweichung in der Ladung besprochen. Ein Kollege hat die Ausnahme an einer Stelle erfasst, ein anderer sieht nur den erfolgreichen Abfahrtsstatus. Die Anzeige ist grün, weil die Abfahrt stattfand. Der Prozess, der beim Kunden ankommt, ist nicht unbedingt grün.") },
            { type: "p", text: x(
              "The temptation is to argue about which employee made the wrong entry. A better investigation starts with the exact statement the screen makes. Does “departed” mean the vehicle moved? That all items were scanned? That the load was verified complete? Those are different claims. A status becomes misleading when its readers silently give it more meaning than its definition supports. Mixed trolleys, missing bags and loading discipline are documented categories from the author's last-mile background. This exact vehicle, sequence and discrepancy are invented.",
              "Tundimi është të debatohet se cili punonjës bëri shënimin e gabuar. Një hetim më i mirë nis nga pohimi i saktë që bën ekrani. A do të thotë “u nis” se automjeti lëvizi? Se u skanuan të gjithë artikujt? Se ngarkesa u verifikua e plotë? Këto janë pohime të ndryshme. Një status bëhet mashtrues kur lexuesit e tij në heshtje i japin më shumë kuptim sesa mbështet përkufizimi i tij. Karrocat e përziera, çantat që mungojnë dhe disiplina e ngarkimit janë kategori të dokumentuara nga përvoja e autorit në miljen e fundit. Ky automjet, kjo radhë dhe kjo mospërputhje janë të shpikura.",
              "Die Versuchung ist, darüber zu streiten, welcher Mitarbeiter den falschen Eintrag gemacht hat. Eine bessere Untersuchung beginnt mit der genauen Aussage des Bildschirms. Bedeutet „abgefahren“, dass das Fahrzeug sich bewegt hat? Dass alle Artikel gescannt wurden? Dass die Ladung als vollständig geprüft wurde? Das sind verschiedene Behauptungen. Ein Status wird irreführend, wenn seine Leser ihm stillschweigend mehr Bedeutung geben, als seine Definition trägt. Gemischte Wagen, fehlende Taschen und Ladedisziplin sind dokumentierte Kategorien aus der Last-Mile-Erfahrung des Autors. Dieses Fahrzeug, diese Abfolge und diese Abweichung sind erfunden.") },
            { type: "callout", reading: true, text: x(
              "A true event can still be an incomplete explanation.",
              "Një ngjarje e vërtetë mund të jetë ende një shpjegim i paplotë.",
              "Ein wahres Ereignis kann trotzdem eine unvollständige Erklärung sein.") },
          ],
          note: x(
            "No actual incident is reconstructed; the essay named below tells the same shape from the dispatch desk.",
            "Nuk rindërtohet asnjë ngjarje e vërtetë; eseja e emërtuar më poshtë e tregon të njëjtën formë nga tavolina e dispeçerisë.",
            "Kein tatsächlicher Vorfall wird rekonstruiert; der unten genannte Essay erzählt dieselbe Form vom Dispositionsschreibtisch aus."),
        },
        {
          id: "i-concept", layer: "concept",
          title: [x("From recorded", "Nga e regjistruar", "Von erfasst"), x("to resolved", "te e zgjidhur", "zu gelöst")],
          lead: x(
            "Three meanings of “done” can quietly collapse into one colour.",
            "Tri kuptime të “u bë” mund të shkrihen pa zhurmë në një ngjyrë të vetme.",
            "Drei Bedeutungen von „erledigt“ können sich still in eine einzige Farbe verwandeln."),
          blocks: [
            { type: "cards", cols: 3, items: [
              { h: x("Recorded", "E regjistruar", "Erfasst"), p: x("The system captured an event.", "Sistemi e kapi një ngjarje.", "Das System hat ein Ereignis erfasst.") },
              { h: x("Verified", "E verifikuar", "Geprüft"), p: x("The event and the required condition were checked.", "Ngjarja dhe kushti i kërkuar u kontrolluan.", "Das Ereignis und die geforderte Bedingung wurden geprüft.") },
              { h: x("Resolved", "E zgjidhur", "Gelöst"), p: x("The customer-facing obligation was fulfilled.", "Detyrimi ndaj klientit u përmbush.", "Die Verpflichtung gegenüber dem Kunden wurde erfüllt.") },
            ] },
            { type: "p", text: x(
              "The categories above are an editorial diagnostic model, not a three-stage taxonomy from one published study. They help a manager ask what the system truly claims. A scan may be evidence of a transaction; a status may record that an operation passed a designated point. Neither alone proves that every requirement downstream has been satisfied. Parasuraman, Sheridan and Wickens (2000) distinguish automation of information acquisition, information analysis, decision selection and action implementation. The distinction matters because the same dashboard may combine measured facts with inferred assessments or recommended actions. Operators deserve to know where recording stops and inference begins.",
              "Kategoritë më sipër janë një model diagnostik editorial, jo një taksonomi me tri faza nga një studim i botuar. Ato e ndihmojnë menaxherin të pyesë çfarë pohon vërtet sistemi. Një skanim mund të jetë provë e një transaksioni; një status mund të regjistrojë se një operacion kaloi një pikë të caktuar. Asnjëri vetëm nuk provon se çdo kërkesë më poshtë në zinxhir është përmbushur. Parasuraman, Sheridan dhe Wickens (2000) dallojnë automatizimin e marrjes së informacionit, të analizës së tij, të zgjedhjes së vendimit dhe të zbatimit të veprimit. Dallimi ka rëndësi, sepse i njëjti panel mund të ngatërrojë fakte të matura me vlerësime të nxjerra ose me veprime të rekomanduara. Operatorët meritojnë ta dinë ku mbaron regjistrimi dhe ku nis nxjerrja e përfundimeve.",
              "Die Kategorien oben sind ein redaktionelles Diagnosemodell, keine dreistufige Taxonomie aus einer veröffentlichten Studie. Sie helfen einer Führungskraft zu fragen, was das System wirklich behauptet. Ein Scan kann ein Beleg für eine Transaktion sein; ein Status kann festhalten, dass ein Vorgang einen bestimmten Punkt passiert hat. Keines von beiden beweist allein, dass jede Anforderung weiter unten erfüllt ist. Parasuraman, Sheridan und Wickens (2000) unterscheiden die Automatisierung der Informationsaufnahme, der Informationsanalyse, der Entscheidungsauswahl und der Handlungsausführung. Die Unterscheidung zählt, weil dasselbe Dashboard gemessene Fakten mit gefolgerten Bewertungen oder empfohlenen Handlungen mischen kann. Wer damit arbeitet, sollte wissen, wo das Erfassen endet und das Folgern beginnt.") },
            { type: "rows", compact: true, items: [
              { h: x("Observation", "Vëzhgimi", "Beobachtung"), p: x("What was sensed, entered or timestamped?", "Çfarë u mat, u shënua ose mori orë?", "Was wurde gemessen, eingegeben oder mit Zeit versehen?") },
              { h: x("Interpretation", "Interpretimi", "Deutung"), p: x("What rule transformed it into a status?", "Cili rregull e shndërroi në status?", "Welche Regel machte daraus einen Status?") },
              { h: x("Decision", "Vendimi", "Entscheidung"), p: x("What action is warranted, by whom, with what authority?", "Cili veprim justifikohet, nga kush, me çfarë autoriteti?", "Welche Handlung ist geboten, durch wen, mit welcher Befugnis?") },
            ] },
            { type: "callout", reading: true, text: x(
              "Before disputing the colour, define the condition it is supposed to represent.",
              "Para se të kundërshtosh ngjyrën, përkufizo kushtin që ajo duhet të përfaqësojë.",
              "Bevor Sie die Farbe anzweifeln, definieren Sie die Bedingung, die sie darstellen soll.") },
          ],
          note: x(
            "The four classes of automated function are Parasuraman, Sheridan and Wickens (2000); appropriate reliance after Lee and See (2004). Recorded, verified, resolved is editorial.",
            "Katër klasat e funksioneve të automatizuara janë të Parasuraman, Sheridan dhe Wickens (2000); mbështetja e përshtatshme sipas Lee dhe See (2004). Regjistruar, verifikuar, zgjidhur është ndarje editoriale.",
            "Die vier Klassen automatisierter Funktionen stammen von Parasuraman, Sheridan und Wickens (2000); angemessenes Verlassen nach Lee und See (2004). Erfasst, geprüft, gelöst ist redaktionell."),
          source: ["parasuraman-sheridan-wickens-2000", "lee-see-2004"],
        },
        {
          id: "i-protocol", layer: "protocol",
          title: [x("Verify before", "Verifiko para", "Prüfen, bevor"), x("you escalate", "se të eskalosh", "Sie eskalieren")],
          lead: x(
            "One signal, one verified condition, one accountable next decision.",
            "Një sinjal, një kusht i verifikuar, një vendim i radhës me përgjegjës.",
            "Ein Signal, eine geprüfte Bedingung, eine verantwortete nächste Entscheidung."),
          blocks: [
            { type: "steps", items: [
              { h: x("Name the signal", "Emërto sinjalin", "Das Signal benennen"), p: x("Record the indicator, source, timestamp and its official definition.", "Shëno treguesin, burimin, orën dhe përkufizimin e tij zyrtar.", "Anzeige, Quelle, Zeitstempel und offizielle Definition festhalten.") },
              { h: x("Check freshness", "Kontrollo freskinë", "Aktualität prüfen"), p: x("Establish whether the reading is live, delayed, aggregated or final.", "Vërteto nëse leximi është i drejtpërdrejtë, i vonuar, i përmbledhur apo përfundimtar.", "Klären, ob der Wert live, verzögert, aggregiert oder endgültig ist.") },
              { h: x("Compare the work", "Krahaso punën", "Mit der Arbeit vergleichen"), p: x("Use permitted independent evidence from the person or process closest to the outcome.", "Përdor prova të pavarura të lejuara nga personi ose procesi më afër rezultatit.", "Zulässige unabhängige Belege der Person oder des Prozesses nutzen, die dem Ergebnis am nächsten sind.") },
              { h: x("Classify the mismatch", "Klasifiko mospërputhjen", "Die Abweichung einordnen"), p: x("Is it a recording gap, a business-rule problem or an actual process exception?", "Është boshllëk regjistrimi, problem i rregullit të biznesit apo përjashtim i vërtetë procesi?", "Ist es eine Erfassungslücke, ein Problem der Geschäftsregel oder eine echte Prozessausnahme?") },
              { h: x("Assign authority", "Cakto autoritetin", "Befugnis zuweisen"), p: x("State who may decide on the correction or escalation under current policy.", "Thuaj kush mund të vendosë për korrigjimin ose eskalimin sipas politikës në fuqi.", "Festhalten, wer nach geltender Regelung über Korrektur oder Eskalation entscheiden darf.") },
              { h: x("Return the result", "Kthe rezultatin", "Das Ergebnis zurückgeben"), p: x("Document what was confirmed and what the team needs to know next.", "Dokumento çfarë u konfirmua dhe çfarë duhet të dijë ekipi më pas.", "Dokumentieren, was bestätigt wurde und was das Team als Nächstes wissen muss.") },
            ] },
            { type: "p", text: x(
              "A status mismatch is not permission to bypass a safety, privacy or compliance control: an immediate threat follows the emergency path, a routine discrepancy the local review route. Verification exists to produce a better decision, not an unofficial second system.",
              "Një mospërputhje statusi nuk është leje për të anashkaluar një kontroll sigurie, privatësie apo pajtueshmërie: një kërcënim i menjëhershëm ndjek rrugën e emergjencës, një mospërputhje rutinë rrugën e rishikimit lokal. Verifikimi bëhet për një vendim më të mirë, jo për një sistem të dytë jozyrtar.",
              "Eine Statusabweichung erlaubt nicht, eine Sicherheits-, Datenschutz- oder Compliance-Kontrolle zu umgehen: Eine akute Gefahr folgt dem Notfallweg, eine routinemäßige Abweichung dem lokalen Prüfweg. Die Prüfung dient einer besseren Entscheidung, nicht einem inoffiziellen zweiten System.") },
            { type: "callout", reading: true, text: x(
              "A manager should be able to say what the number means, when it was true, and what it does not establish.",
              "Një menaxher duhet të jetë në gjendje të thotë çfarë do të thotë numri, kur ishte i vërtetë, dhe çfarë nuk vërteton.",
              "Eine Führungskraft sollte sagen können, was die Zahl bedeutet, wann sie galt und was sie nicht belegt.") },
          ],
          note: x(
            "Editorial protocol after the function classes of Parasuraman et al. (2000) and the reliance framework of Lee and See (2004); not a procedure certified for a named employer.",
            "Protokoll editorial sipas klasave të funksioneve të Parasuraman et al. (2000) dhe kornizës së mbështetjes të Lee dhe See (2004); jo procedurë e certifikuar për një punëdhënës të caktuar.",
            "Redaktionelles Protokoll nach den Funktionsklassen von Parasuraman et al. (2000) und dem Vertrauensrahmen von Lee und See (2004); kein für einen bestimmten Arbeitgeber zertifiziertes Verfahren."),
          source: ["parasuraman-sheridan-wickens-2000", "lee-see-2004"],
        },
      ],
    },

    // Chapter II. The irony of automation
    {
      id: "ch-ii", type: "chapter", numeral: "II",
      title: x("The irony of automation", "Ironia e automatizimit", "Die Ironie der Automatisierung"),
      pages: [
        {
          id: "ii-scene", layer: "scene", more: "the-system-is-faster-than-you",
          title: [x("The operator", "Operatori", "Der Operator,"), x("who was watching", "që po shikonte", "der zusah")],
          lead: x(
            "Being responsible for an automated process is not the same as remaining prepared to operate it.",
            "Të jesh përgjegjës për një proces të automatizuar nuk është e njëjta gjë me të qenët gati për ta drejtuar.",
            "Für einen automatisierten Prozess verantwortlich zu sein ist nicht dasselbe wie darauf vorbereitet zu bleiben, ihn zu steuern."),
          blocks: [
            { type: "flag", text: x("Hypothetical illustration, no claimed workplace failure", "Ilustrim hipotetik, pa dështim të pretenduar në ndonjë vend pune", "Hypothetische Illustration, kein behaupteter Betriebsfehler") },
            { type: "p", text: x(
              "For hours, the plan proceeds routinely. Stops are arranged, exceptions are displayed and the person at the desk deals with the cases that the software highlights. Then an unusual condition appears. The system has not supplied a useful next move. The operator must reconstruct what has happened, what the route depends on and which changes remain permitted.",
              "Për orë të tëra plani ecën si zakonisht. Ndalesat janë renditur, përjashtimet shfaqen dhe personi në tavolinë merret me rastet që nxjerr në pah programi. Pastaj shfaqet një gjendje e pazakontë. Sistemi nuk ka dhënë një hap të radhës të dobishëm. Operatori duhet të rindërtojë çfarë ka ndodhur, nga çfarë varet rruga dhe cilat ndryshime lejohen ende.",
              "Stundenlang läuft der Plan wie gewohnt. Stopps sind geordnet, Ausnahmen werden angezeigt, und die Person am Schreibtisch bearbeitet die Fälle, die die Software hervorhebt. Dann taucht eine ungewöhnliche Lage auf. Das System hat keinen brauchbaren nächsten Zug geliefert. Der Operator muss rekonstruieren, was geschehen ist, wovon die Route abhängt und welche Änderungen noch erlaubt sind.") },
            { type: "p", text: x(
              "It is tempting to call this a simple need for better technical training. But the difficult part may be the transition itself. Routine automation invites people to monitor results rather than build and continually update the whole operational picture. When the software cannot complete the task, the missing picture has to be rebuilt under time pressure. This is a constructed scene. The author has worked in last-mile dispatch and operational coordination, but no particular route-planning outage or mistaken takeover is asserted here.",
              "Është tunduese ta quash këtë thjesht nevojë për trajnim teknik më të mirë. Por pjesa e vështirë mund të jetë vetë kalimi. Automatizimi rutinë i fton njerëzit të ndjekin rezultatet, në vend që të ndërtojnë dhe të përditësojnë vazhdimisht pamjen e plotë operacionale. Kur programi nuk e kryen dot detyrën, pamja që mungon duhet rindërtuar nën presion kohe. Kjo është një skenë e ndërtuar. Autori ka punuar në dispeçerinë e miljes së fundit dhe në koordinim operacional, por këtu nuk pohohet asnjë ndërprerje e caktuar e planifikimit të rrugëve apo marrje e gabuar e kontrollit.",
              "Es liegt nahe, das schlicht als Bedarf an besserer technischer Schulung zu bezeichnen. Doch der schwierige Teil kann der Übergang selbst sein. Routineautomatik lädt dazu ein, Ergebnisse zu überwachen, statt das gesamte Lagebild aufzubauen und laufend zu aktualisieren. Kann die Software die Aufgabe nicht abschließen, muss das fehlende Bild unter Zeitdruck neu aufgebaut werden. Dies ist eine konstruierte Szene. Der Autor hat in der Last-Mile-Disposition und in der betrieblichen Koordination gearbeitet, doch ein bestimmter Ausfall der Routenplanung oder eine fehlerhafte Übernahme wird hier nicht behauptet.") },
            { type: "callout", reading: true, text: x(
              "The most difficult human task may be the one the system leaves for last.",
              "Detyra më e vështirë njerëzore mund të jetë ajo që sistemi e lë për në fund.",
              "Die schwierigste menschliche Aufgabe ist vielleicht die, die das System zuletzt übrig lässt.") },
          ],
          note: x(
            "A constructed illustration of a general risk; its significance rests on Bainbridge (1983) and Endsley and Kiris (1995), read in the settings where they were written.",
            "Ilustrim i ndërtuar i një rreziku të përgjithshëm; rëndësia e tij mbështetet te Bainbridge (1983) dhe Endsley e Kiris (1995), të lexuar në mjediset ku u shkruan.",
            "Eine konstruierte Illustration eines allgemeinen Risikos; ihre Bedeutung stützt sich auf Bainbridge (1983) und Endsley und Kiris (1995), gelesen in den Umgebungen, in denen sie entstanden."),
        },
        {
          id: "ii-concept", layer: "concept",
          title: [x("Bainbridge's", "Ironia e pakëndshme", "Bainbridges"), x("uncomfortable irony", "e Bainbridge-it", "unbequeme Ironie")],
          lead: x(
            "Automation can remove routine activity while leaving people responsible for the exceptional cases.",
            "Automatizimi mund ta heqë veprimtarinë rutinë, duke ua lënë njerëzve përgjegjësinë për rastet e jashtëzakonshme.",
            "Automatisierung kann Routinetätigkeit entfernen und den Menschen die Verantwortung für die Ausnahmefälle lassen."),
          blocks: [
            { type: "p", text: x(
              "In a short 1983 paper, Lisanne Bainbridge challenged the belief that technical sophistication automatically eliminates human-factor problems. Industrial automation may expand the difficulties left to the operator, especially when abnormal conditions need diagnosis. The point is not that automation is undesirable; it is that the remaining human role is changed by the way automation is designed.",
              "Në një punim të shkurtër të vitit 1983, Lisanne Bainbridge e vuri në pikëpyetje bindjen se sofistikimi teknik i eliminon vetvetiu problemet e faktorit njerëzor. Automatizimi industrial mund t'i zgjerojë vështirësitë që i mbeten operatorit, sidomos kur gjendjet e panormalta kërkojnë diagnozë. Çështja nuk është se automatizimi është i padëshirueshëm; është se roli njerëzor që mbetet ndryshon nga mënyra si është projektuar automatizimi.",
              "In einem kurzen Aufsatz von 1983 widersprach Lisanne Bainbridge der Annahme, technische Raffinesse beseitige Probleme des Faktors Mensch von selbst. Industrielle Automatisierung kann die Schwierigkeiten, die dem Operator bleiben, vergrößern, besonders wenn abnormale Zustände eine Diagnose verlangen. Es geht nicht darum, dass Automatisierung unerwünscht wäre; es geht darum, dass die verbleibende menschliche Rolle durch die Gestaltung der Automatik verändert wird.") },
            { type: "cards", cols: 3, items: [
              { h: x("Routine relieved", "Rutina lehtësohet", "Routine entlastet"), p: x("Fewer repetitive manual decisions.", "Më pak vendime manuale të përsëritura.", "Weniger wiederkehrende manuelle Entscheidungen.") },
              { h: x("Context harder", "Konteksti vështirësohet", "Kontext schwerer"), p: x("Less direct participation in the work that creates familiarity.", "Më pak pjesëmarrje e drejtpërdrejtë në punën që krijon njohje.", "Weniger direkte Beteiligung an der Arbeit, die Vertrautheit schafft.") },
              { h: x("Exception retained", "Përjashtimi mbetet", "Ausnahme bleibt"), p: x("People still need to interpret unusual, consequential conditions.", "Njerëzit duhet ende të interpretojnë gjendje të pazakonta me pasoja.", "Menschen müssen weiterhin ungewöhnliche, folgenreiche Zustände deuten.") },
            ] },
            { type: "p", text: x(
              "A logistics route, a scan trail and a hotel report are not industrial control loops of the kind Bainbridge analysed. The transfer is narrower: if a process expects a person to handle anomalies, it must also preserve that person's access to context, authority, practice and usable feedback. A named owner without those conditions may carry responsibility without control. The most dangerous design question is therefore not “What can we automate?” but “What will the person still need to understand when it stops helping?”",
              "Një rrugë logjistike, një gjurmë skanimesh dhe një raport hoteli nuk janë qarqe kontrolli industrial të llojit që analizoi Bainbridge. Transferimi është më i ngushtë: nëse një proces pret që një person t'i trajtojë anomalitë, ai duhet t'ia ruajë atij personi edhe aksesin te konteksti, autoriteti, praktika dhe një reagim i përdorshëm. Një përgjegjës i emërtuar pa këto kushte mund të mbajë përgjegjësi pa kontroll. Pyetja më e rrezikshme e projektimit nuk është pra “Çfarë mund të automatizojmë?”, por “Çfarë do t'i duhet ende personit të kuptojë kur sistemi pushon së ndihmuari?”",
              "Eine Logistikroute, eine Scanspur und ein Hotelbericht sind keine industriellen Regelkreise der Art, die Bainbridge analysierte. Die Übertragung ist enger: Erwartet ein Prozess, dass eine Person Anomalien bewältigt, muss er dieser Person auch den Zugang zu Kontext, Befugnis, Übung und brauchbarer Rückmeldung erhalten. Ein benannter Verantwortlicher ohne diese Bedingungen trägt womöglich Verantwortung ohne Kontrolle. Die gefährlichste Gestaltungsfrage lautet daher nicht „Was können wir automatisieren?“, sondern „Was muss die Person noch verstehen, wenn es aufhört zu helfen?“") },
            { type: "callout", reading: true, text: x(
              "Removing a routine task does not remove the need to learn the system.",
              "Heqja e një detyre rutinë nuk e heq nevojën për ta mësuar sistemin.",
              "Eine Routineaufgabe zu entfernen hebt die Notwendigkeit nicht auf, das System zu lernen.") },
          ],
          note: x(
            "Bainbridge, “Ironies of Automation”, Automatica 19(6), 1983: a conceptual paper on industrial process control, not an experiment; the three cards are an editorial summary.",
            "Bainbridge, “Ironies of Automation”, Automatica 19(6), 1983: punim konceptual mbi kontrollin e proceseve industriale, jo eksperiment; tri kartat janë përmbledhje editoriale.",
            "Bainbridge, „Ironies of Automation“, Automatica 19(6), 1983: ein konzeptioneller Aufsatz zur industriellen Prozesssteuerung, kein Experiment; die drei Karten sind eine redaktionelle Zusammenfassung."),
          source: ["bainbridge-1983"],
        },
        {
          id: "ii-protocol", layer: "protocol",
          title: [x("Keep people", "Mbaji njerëzit", "Menschen"), x("inside the loop", "brenda qarkut", "im Regelkreis halten")],
          lead: x(
            "The response to a rare abnormal event should be rehearsed before it arrives. In Endsley and Kiris's navigation experiment (1995), lower situation awareness went with slower decisions after the expert system failed; the level of control moderated the loss. That does not measure a hotel or a dispatch desk, but it makes the design concern concrete.",
            "Përgjigjja ndaj një ngjarjeje të rrallë të panormalme duhet provuar para se ajo të vijë. Në eksperimentin e navigimit të Endsley dhe Kiris (1995), pamja më e ulët e situatës shoqërohej me vendime më të ngadalta pas dështimit të sistemit ekspert; niveli i kontrollit e zbuste humbjen. Kjo nuk mat një hotel apo një dispeçeri, por e bën konkret shqetësimin e projektimit.",
            "Die Antwort auf ein seltenes abnormales Ereignis sollte geübt sein, bevor es eintritt. Im Navigationsexperiment von Endsley und Kiris (1995) ging geringeres Lagebewusstsein mit langsameren Entscheidungen nach dem Ausfall des Expertensystems einher; die Kontrollstufe milderte den Verlust. Das misst kein Hotel und keine Disposition, macht das Gestaltungsanliegen aber konkret."),
          blocks: [
            { type: "steps", items: [
              { h: x("Explain the boundaries", "Shpjego kufijtë", "Die Grenzen erklären"), p: x("Show what the system handles, what it cannot infer and who owns exceptions.", "Trego çfarë trajton sistemi, çfarë nuk mund të nxjerrë dhe kush i ka përjashtimet.", "Zeigen, was das System abdeckt, was es nicht folgern kann und wer die Ausnahmen verantwortet.") },
              { h: x("Practice independent orientation", "Ushtro orientimin e pavarur", "Eigenständige Orientierung üben"), p: x("Periodically reconstruct the workflow from permitted evidence, without assuming the recommendation is correct.", "Herë pas here rindërto rrjedhën e punës nga provat e lejuara, pa supozuar se rekomandimi është i saktë.", "Den Arbeitsablauf regelmäßig aus zulässigen Belegen rekonstruieren, ohne die Empfehlung als richtig vorauszusetzen.") },
              { h: x("Rehearse safe escalation", "Provo eskalimin e sigurt", "Sichere Eskalation proben"), p: x("Know how to get help, pause an unsafe action and request an authorised decision.", "Dije si të kërkosh ndihmë, si të ndalosh një veprim të pasigurt dhe si të kërkosh një vendim të autorizuar.", "Wissen, wie man Hilfe holt, eine unsichere Handlung anhält und eine befugte Entscheidung einholt.") },
              { h: x("Check recovery, not memory", "Kontrollo rikuperimin, jo kujtesën", "Wiederanlauf prüfen, nicht Gedächtnis"), p: x("Use scenario-based training and confirm the operator can describe the next action.", "Përdor trajnim me skenarë dhe sigurohu që operatori e përshkruan dot veprimin e radhës.", "Szenariobasiert schulen und bestätigen, dass der Operator den nächsten Schritt beschreiben kann.") },
              { h: x("Update after learning", "Përditëso pas mësimit", "Nach dem Lernen aktualisieren"), p: x("When an unfamiliar failure appears, amend approved training after a documented review.", "Kur shfaqet një dështim i panjohur, ndrysho trajnimin e miratuar pas një rishikimi të dokumentuar.", "Tritt ein unbekannter Fehler auf, die freigegebene Schulung nach dokumentierter Prüfung anpassen.") },
            ] },
            { type: "callout", reading: true, text: x(
              "A trained operator knows not only how to use the tool, but how to recognise when the tool is no longer enough.",
              "Një operator i trajnuar di jo vetëm si ta përdorë mjetin, por edhe si ta dallojë çastin kur mjeti nuk mjafton më.",
              "Ein geschulter Operator weiß nicht nur, wie man das Werkzeug benutzt, sondern auch, wann es nicht mehr ausreicht.") },
          ],
          note: x(
            "Editorial training protocol after Bainbridge (1983) and Endsley and Kiris (1995), whose participants worked a laboratory navigation task, not a dispatch desk.",
            "Protokoll trajnimi editorial sipas Bainbridge (1983) dhe Endsley e Kiris (1995), pjesëmarrësit e të cilëve bënin një detyrë navigimi laboratorike, jo punë dispeçerie.",
            "Redaktionelles Schulungsprotokoll nach Bainbridge (1983) und Endsley und Kiris (1995), deren Teilnehmer eine Navigationsaufgabe im Labor bearbeiteten, keinen Dispositionsschreibtisch."),
          source: ["bainbridge-1983", "endsley-kiris-1995"],
        },
      ],
    },

    // Chapter III. When every alarm is red
    {
      id: "ch-iii", type: "chapter", numeral: "III",
      title: x("When every alarm is red", "Kur çdo alarm është i kuq", "Wenn jeder Alarm rot ist"),
      pages: [
        {
          id: "iii-scene", layer: "scene", more: "when-the-dashboard-turns-red-before-you",
          title: [x("When every alarm", "Kur çdo alarm", "Wenn jeder Alarm"), x("is red", "është i kuq", "rot ist")],
          lead: x(
            "A red indicator deserves attention. It is not, by itself, a diagnosis.",
            "Një tregues i kuq meriton vëmendje. Por nuk është, më vete, një diagnozë.",
            "Eine rote Anzeige verdient Aufmerksamkeit. Sie ist für sich genommen keine Diagnose."),
          blocks: [
            { type: "flag", text: x("Hypothetical dispatch scene, no recorded alarm event", "Skenë hipotetike dispeçerie, pa ngjarje alarmi të regjistruar", "Hypothetische Dispositionsszene, kein dokumentierter Alarm") },
            { type: "p", text: x(
              "The display is full of red. Some routes are late to a threshold, some readings are old and others reflect problems already being handled. The coordinator does not know which condition is new, which is serious and which is no longer current. Every signal competes for the same limited attention.",
              "Ekrani është plot të kuqe. Disa rrugë kanë kaluar një prag vonese, disa lexime janë të vjetra dhe të tjera pasqyrojnë probleme që tashmë po trajtohen. Koordinatori nuk e di cila gjendje është e re, cila është serioze dhe cila nuk vlen më. Çdo sinjal konkurron për të njëjtën vëmendje të kufizuar.",
              "Die Anzeige ist voller Rot. Manche Routen haben eine Verspätungsschwelle überschritten, manche Werte sind alt, andere spiegeln Probleme, die bereits bearbeitet werden. Der Koordinator weiß nicht, welcher Zustand neu ist, welcher ernst und welcher nicht mehr aktuell. Jedes Signal konkurriert um dieselbe begrenzte Aufmerksamkeit.") },
            { type: "p", text: x(
              "A manager may call this poor discipline: why is the team not responding to each red row? Yet an effective response depends on more than colour. The alert must represent a defined condition, arrive at a useful time, indicate severity and give someone authority to act. Otherwise an alert system may become a second source of work: investigating what the system meant before investigating what happened. There is no documented case in the author's remote-dispatch role of a specific red alert that disappeared without intervention. This scene illustrates the decision problem; it does not present invented alert statistics as experience.",
              "Një menaxher mund ta quajë këtë mungesë disipline: pse nuk i përgjigjet ekipi çdo rreshti të kuq? Por një përgjigje e efektshme varet nga më shumë se ngjyra. Alarmi duhet të përfaqësojë një kusht të përkufizuar, të vijë në një kohë të dobishme, të tregojë rëndësinë dhe t'i japë dikujt autoritetin për të vepruar. Përndryshe sistemi i alarmeve mund të bëhet burim i dytë pune: të hetosh çfarë donte të thoshte sistemi, para se të hetosh çfarë ndodhi. Nuk ka asnjë rast të dokumentuar nga roli i autorit në dispeçerinë në distancë për një alarm të kuq të caktuar që u zhduk pa ndërhyrje. Kjo skenë ilustron problemin e vendimit; nuk paraqet statistika alarmesh të shpikura si përvojë.",
              "Eine Führungskraft mag das als mangelnde Disziplin bezeichnen: Warum reagiert das Team nicht auf jede rote Zeile? Doch eine wirksame Reaktion hängt von mehr als der Farbe ab. Der Alarm muss eine definierte Bedingung abbilden, zu einem brauchbaren Zeitpunkt kommen, den Schweregrad anzeigen und jemandem die Befugnis zum Handeln geben. Sonst wird ein Alarmsystem zu einer zweiten Arbeitsquelle: erst klären, was das System meinte, dann klären, was geschah. Aus der Rolle des Autors in der Ferndisposition gibt es keinen dokumentierten Fall eines bestimmten roten Alarms, der ohne Eingriff verschwand. Diese Szene illustriert das Entscheidungsproblem; sie gibt keine erfundenen Alarmstatistiken als Erfahrung aus.") },
            { type: "callout", reading: true, text: x(
              "If every change demands the same attention, the screen has not decided what matters.",
              "Nëse çdo ndryshim kërkon të njëjtën vëmendje, ekrani nuk ka vendosur çfarë ka rëndësi.",
              "Wenn jede Änderung dieselbe Aufmerksamkeit verlangt, hat der Bildschirm nicht entschieden, was zählt.") },
          ],
          note: x(
            "Constructed scene from the category of remote dispatch work; the essay named below tells the same morning from the author's desk.",
            "Skenë e ndërtuar nga kategoria e punës së dispeçerisë në distancë; eseja e emërtuar më poshtë e tregon të njëjtin mëngjes nga tavolina e autorit.",
            "Konstruierte Szene aus der Kategorie der Ferndispositionsarbeit; der unten genannte Essay erzählt denselben Morgen vom Schreibtisch des Autors."),
        },
        {
          id: "iii-concept", layer: "concept",
          title: [x("The base-rate", "Problemi i", "Das Basisraten-"), x("problem", "bazës", "problem")],
          lead: x(
            "A system can detect many genuine exceptions and still produce mostly unhelpful alerts. Assume five of 100 cases really require attention. The system identifies four of those five, misses one, and incorrectly alarms for 15 of the remaining 95. It issues 19 alerts: four correct and 15 false positives.",
            "Një sistem mund të zbulojë shumë përjashtime të vërteta dhe prapë të prodhojë kryesisht alarme të padobishme. Supozo se pesë nga 100 raste kërkojnë vërtet vëmendje. Sistemi i identifikon katër nga këto pesë, i shpëton një, dhe alarmon gabimisht për 15 nga 95 rastet e tjera. Ai lëshon 19 alarme: katër të sakta dhe 15 të rreme.",
            "Ein System kann viele echte Ausnahmen erkennen und trotzdem überwiegend unnütze Alarme erzeugen. Angenommen, fünf von 100 Fällen brauchen wirklich Aufmerksamkeit. Das System erkennt vier dieser fünf, übersieht einen und schlägt bei 15 der übrigen 95 fälschlich an. Es gibt 19 Alarme aus: vier richtige und 15 Fehlalarme."),
          blocks: [
            { type: "flag", text: hypothetical },
            { type: "columns", max: 20, height: 105, hypothetical: true,
              label: x("One hundred invented cases, five of them true exceptions", "Njëqind raste të shpikura, pesë prej tyre përjashtime të vërteta", "Hundert erfundene Fälle, fünf davon echte Ausnahmen"),
              items: [
                { k: x("True exceptions", "Përjashtime të vërteta", "Echte Ausnahmen"), v: 5, n: "5" },
                { k: x("Alerts issued", "Alarme të lëshuara", "Ausgelöste Alarme"), v: 19, n: "19" },
                { k: x("Correct alerts", "Alarme të sakta", "Richtige Alarme"), v: 4, n: "4" },
                { k: x("False alarms", "Alarme të rreme", "Fehlalarme"), v: 15, n: "15", alert: true },
              ] },
            { type: "p", text: x(
              "Only 4 ÷ 19 = 21.1% of the alert messages correspond to real exceptions in this example. The system detected 4 ÷ 5 = 80% of true exceptions. Both values describe the same hypothetical design, from different angles. Parasuraman and Riley (1997) note that false alarms can promote disuse of automation. The example makes their base-rate warning intuitive: alert usefulness depends on how often the condition occurs, not only on how well the software detects it. No workplace false-alarm rate is estimated here.",
              "Vetëm 4 ÷ 19 = 21,1% e mesazheve të alarmit u përgjigjen përjashtimeve të vërteta në këtë shembull. Sistemi zbuloi 4 ÷ 5 = 80% të përjashtimeve të vërteta. Të dyja vlerat e përshkruajnë të njëjtin dizajn hipotetik, nga kënde të ndryshme. Parasuraman dhe Riley (1997) vërejnë se alarmet e rreme mund të nxisin braktisjen e automatizimit. Shembulli e bën intuitiv paralajmërimin e tyre për bazën: dobia e një alarmi varet nga sa shpesh ndodh kushti, jo vetëm nga sa mirë e zbulon programi. Këtu nuk vlerësohet asnjë normë alarmesh të rreme nga ndonjë vend pune.",
              "Nur 4 ÷ 19 = 21,1 % der Alarmmeldungen entsprechen in diesem Beispiel echten Ausnahmen. Das System erkannte 4 ÷ 5 = 80 % der echten Ausnahmen. Beide Werte beschreiben dieselbe hypothetische Auslegung, aus verschiedenen Blickwinkeln. Parasuraman und Riley (1997) merken an, dass Fehlalarme zum Nichtgebrauch der Automatik führen können. Das Beispiel macht ihre Warnung vor der Basisrate anschaulich: Der Nutzen eines Alarms hängt davon ab, wie oft die Bedingung eintritt, nicht nur davon, wie gut die Software sie erkennt. Eine betriebliche Fehlalarmquote wird hier nicht geschätzt.") },
            { type: "callout", reading: true, text: x(
              "Count the alarms that need action, not only the alarms the system can produce.",
              "Numëro alarmet që kërkojnë veprim, jo vetëm alarmet që sistemi mund të prodhojë.",
              "Zählen Sie die Alarme, die Handeln verlangen, nicht nur die, die das System erzeugen kann.") },
          ],
          note: x(
            "The 100 cases are invented so the arithmetic can be checked; disuse after false alarms is Parasuraman and Riley (1997).",
            "100 rastet janë të shpikura që llogaria të kontrollohet; braktisja pas alarmeve të rreme është e Parasuraman dhe Riley (1997).",
            "Die 100 Fälle sind erfunden, damit die Rechnung nachprüfbar ist; der Nichtgebrauch nach Fehlalarmen stammt von Parasuraman und Riley (1997)."),
          source: ["parasuraman-riley-1997"],
        },
        {
          id: "iii-rates", layer: "concept",
          title: [x("Two numbers,", "Dy numra,", "Zwei Zahlen,"), x("one design", "një dizajn", "eine Auslegung")],
          lead: x(
            "The same alert design looks good or bad depending on which denominator is used. Precision answers the question of the person who receives the alerts; sensitivity answers the question of the person who fears the missed case. A review of alarms needs both, and the cost of each kind of error.",
            "I njëjti dizajn alarmi duket i mirë ose i keq sipas emëruesit që përdoret. Saktësia i përgjigjet pyetjes së atij që i merr alarmet; ndjeshmëria i përgjigjet pyetjes së atij që ka frikë rastin e humbur. Një rishikim i alarmeve i do të dyja, bashkë me koston e secilit lloj gabimi.",
            "Dieselbe Alarmauslegung sieht gut oder schlecht aus, je nachdem, welcher Nenner verwendet wird. Die Präzision beantwortet die Frage dessen, der die Alarme erhält; die Sensitivität die Frage dessen, der den übersehenen Fall fürchtet. Eine Alarmprüfung braucht beides, samt den Kosten jeder Fehlerart."),
          blocks: [
            { type: "flag", text: hypothetical },
            { type: "hbars", hypothetical: true,
              label: x("The invented 100 cases, read from two sides", "100 rastet e shpikura, të lexuara nga dy anë", "Die 100 erfundenen Fälle, von zwei Seiten gelesen"),
              items: [
                { k: x("Alerts that were real (precision)", "Alarme të vërteta (saktësia)", "Echte Alarme (Präzision)"), v: 21.1, n: x("21.1%", "21,1%", "21,1 %"), alert: true },
                { k: x("True exceptions caught (sensitivity)", "Përjashtime të kapura (ndjeshmëria)", "Erkannte echte Ausnahmen (Sensitivität)"), v: 80, n: x("80%", "80%", "80 %") },
                { k: x("Alerts that were false", "Alarme të rreme", "Fehlalarme"), v: 78.9, n: x("78.9%", "78,9%", "78,9 %"), alert: true },
              ] },
            { type: "stat", hypothetical: true, n: x("21.1%", "21,1%", "21,1 %"), t: x("positive predictive value: 4 correct alerts ÷ 19 alerts issued", "vlera parashikuese pozitive: 4 alarme të sakta ÷ 19 alarme të lëshuara", "positiver Vorhersagewert: 4 richtige Alarme ÷ 19 ausgelöste Alarme") },
            { type: "p", text: x(
              "A team that receives 19 alerts and finds four real cases will, over weeks, learn to wait before reacting. That learning is rational, and it is the mechanism Parasuraman and Riley call disuse. The remedy is not to tell people to trust the screen more. It is to change the condition the alert represents, its timing or its threshold, under control, and to count the result.",
              "Një ekip që merr 19 alarme dhe gjen katër raste të vërteta, për disa javë mëson të presë para se të reagojë. Ai mësim është i arsyeshëm, dhe është pikërisht mekanizmi që Parasuraman dhe Riley e quajnë braktisje. Ilaçi nuk është t'u thuash njerëzve t'i besojnë më shumë ekranit. Është të ndryshosh, në mënyrë të kontrolluar, kushtin që përfaqëson alarmi, kohën ose pragun e tij, dhe ta numërosh rezultatin.",
              "Ein Team, das 19 Alarme erhält und vier echte Fälle findet, lernt über Wochen, vor dem Reagieren abzuwarten. Dieses Lernen ist vernünftig, und es ist genau der Mechanismus, den Parasuraman und Riley Nichtgebrauch nennen. Die Abhilfe besteht nicht darin, den Leuten zu sagen, sie sollten dem Bildschirm mehr vertrauen. Sie besteht darin, die Bedingung, die der Alarm abbildet, seinen Zeitpunkt oder seine Schwelle kontrolliert zu ändern und das Ergebnis zu zählen.") },
          ],
          note: x(
            "The percentages follow from the invented counts on the previous page; precision and sensitivity are standard definitions, not figures from any study.",
            "Përqindjet rrjedhin nga numrat e shpikur të faqes së mëparshme; saktësia dhe ndjeshmëria janë përkufizime standarde, jo shifra nga ndonjë studim.",
            "Die Prozentwerte folgen aus den erfundenen Zahlen der vorigen Seite; Präzision und Sensitivität sind Standarddefinitionen, keine Werte aus einer Studie."),
          source: ["parasuraman-riley-1997"],
        },
        {
          id: "iii-protocol", layer: "protocol",
          title: [x("A better", "Një rishikim", "Eine bessere"), x("alarm review", "më i mirë i alarmeve", "Alarmprüfung")],
          lead: x(
            "Treat alert design as a quality problem with measurable costs on both sides.",
            "Trajtoje dizajnin e alarmeve si problem cilësie, me kosto të matshme në të dyja anët.",
            "Behandeln Sie die Alarmauslegung als Qualitätsproblem mit messbaren Kosten auf beiden Seiten."),
          blocks: [
            { type: "steps", items: [
              { h: x("Define the outcome", "Përkufizo rezultatin", "Das Ergebnis definieren"), p: x("Which condition really needs a decision, not merely a colour?", "Cili kusht kërkon vërtet një vendim, jo thjesht një ngjyrë?", "Welche Bedingung braucht wirklich eine Entscheidung, nicht bloß eine Farbe?") },
              { h: x("Capture true and false signals", "Shëno sinjalet e vërteta dhe të rreme", "Richtige und falsche Signale erfassen"), p: x("Use independently verified cases with a clearly defined observation window.", "Përdor raste të verifikuara pavarësisht, me një dritare vëzhgimi të përkufizuar qartë.", "Unabhängig geprüfte Fälle mit klar definiertem Beobachtungsfenster verwenden.") },
              { h: x("Measure missed exceptions", "Mat përjashtimet e humbura", "Übersehene Ausnahmen messen"), p: x("Silence can be more consequential than noise; define misses explicitly.", "Heshtja mund të ketë më shumë pasoja se zhurma; përkufizoji humbjet shprehimisht.", "Stille kann folgenreicher sein als Lärm; Übersehenes ausdrücklich definieren.") },
              { h: x("Separate urgency from inconvenience", "Ndaj urgjencën nga bezdia", "Dringlichkeit von Unbequemlichkeit trennen"), p: x("A safety-critical condition cannot be grouped with a routine timing exception.", "Një kusht kritik për sigurinë nuk mund të grupohet me një përjashtim rutinë kohe.", "Eine sicherheitskritische Bedingung gehört nicht in eine Gruppe mit einer routinemäßigen Zeitabweichung.") },
              { h: x("Design a response", "Projekto një përgjigje", "Eine Reaktion gestalten"), p: x("Specify owner, maximum review delay and safe escalation path.", "Përcakto përgjegjësin, vonesën maksimale të rishikimit dhe rrugën e sigurt të eskalimit.", "Verantwortlichen, maximale Prüfverzögerung und sicheren Eskalationsweg festlegen.") },
              { h: x("Test after changes", "Provo pas ndryshimeve", "Nach Änderungen testen"), p: x("Compare downstream outcomes, not just the count of red rows.", "Krahaso rezultatet më poshtë në zinxhir, jo vetëm numrin e rreshtave të kuq.", "Nachgelagerte Ergebnisse vergleichen, nicht nur die Zahl roter Zeilen.") },
            ] },
            { type: "p", text: x(
              "Never improve the dashboard by raising thresholds just to make the screen greener. A threshold change is a controlled change to risk detection: it needs permission, a documented rationale and a review of both false alarms and missed cases, with the time the data was last refreshed.",
              "Mos e “përmirëso” kurrë panelin duke ngritur pragjet vetëm që ekrani të duket më i gjelbër. Një ndryshim pragu është ndryshim i kontrolluar i zbulimit të rrezikut: kërkon leje, arsyetim të dokumentuar dhe rishikim të alarmeve të rreme dhe të rasteve të humbura, bashkë me orën kur u freskuan të dhënat.",
              "„Verbessern“ Sie das Dashboard nie, indem Sie Schwellen anheben, nur damit der Bildschirm grüner wird. Eine Schwellenänderung ist eine kontrollierte Änderung der Risikoerkennung: Sie braucht Freigabe, dokumentierte Begründung und die Prüfung von Fehlalarmen und übersehenen Fällen, samt dem Zeitpunkt der letzten Datenaktualisierung.") },
            { type: "callout", reading: true, text: x(
              "An alarm is good when it helps the right person take the right action in time.",
              "Një alarm është i mirë kur e ndihmon personin e duhur të bëjë veprimin e duhur në kohë.",
              "Ein Alarm ist gut, wenn er der richtigen Person hilft, rechtzeitig das Richtige zu tun.") },
          ],
          note: x(
            "Editorial review protocol after Parasuraman and Riley (1997) on disuse and Lee and See (2004) on appropriate reliance; no threshold tested in the author's workplaces.",
            "Protokoll rishikimi editorial sipas Parasuraman dhe Riley (1997) për braktisjen dhe Lee dhe See (2004) për mbështetjen e përshtatshme; asnjë prag i provuar në vendet e punës së autorit.",
            "Redaktionelles Prüfprotokoll nach Parasuraman und Riley (1997) zum Nichtgebrauch und Lee und See (2004) zum angemessenen Verlassen; keine Schwelle in den Betrieben des Autors getestet."),
          source: ["parasuraman-riley-1997", "lee-see-2004"],
        },
      ],
    },

    // Chapter IV. What the driver knows, the system does not
    {
      id: "ch-iv", type: "chapter", numeral: "IV",
      title: x("What the driver knows, the system does not", "Çfarë di shoferi, sistemi jo", "Was der Fahrer weiß, das System nicht"),
      pages: [
        {
          id: "iv-scene", layer: "scene", more: "the-tour-the-driver-does-not-understand",
          title: [x("The route knows", "Rruga di", "Die Route weiß"), x("less than the driver", "më pak se shoferi", "weniger als der Fahrer")],
          lead: x(
            "Software knows its inputs. The worker encounters what is happening now.",
            "Programi i njeh të dhënat e veta. Punonjësi has atë që po ndodh tani.",
            "Die Software kennt ihre Eingaben. Die Arbeitskraft erlebt, was jetzt geschieht."),
          blocks: [
            { type: "flag", text: x("Composite illustration; the exact event did not occur as reported", "Ilustrim i përbërë; ngjarja e saktë nuk ndodhi siç tregohet", "Zusammengesetzte Illustration; das genaue Ereignis fand so nicht statt") },
            { type: "p", text: x(
              "A route appears reasonable on the screen. A person who has delivered in the area before notices that part of the plan depends on a condition that is no longer reliable. The person asks whether the route can be reviewed. At the same time, another system has a reassuring scan history, yet a physical load still needs checking. The coordinator faces two kinds of evidence: a record that may be formally correct and local knowledge that is not yet verified.",
              "Një rrugë duket e arsyeshme në ekran. Një person që ka bërë dorëzime më parë në atë zonë vëren se një pjesë e planit varet nga një kusht që nuk është më i besueshëm. Ai pyet nëse rruga mund të rishikohet. Në të njëjtën kohë, një sistem tjetër ka një histori skanimesh qetësuese, por ngarkesa fizike ka ende nevojë për kontroll. Koordinatori përballet me dy lloje provash: një regjistrim që mund të jetë formalisht i saktë dhe një njohuri lokale që ende nuk është verifikuar.",
              "Eine Route wirkt auf dem Bildschirm vernünftig. Eine Person, die in dem Gebiet schon zugestellt hat, bemerkt, dass ein Teil des Plans von einer Bedingung abhängt, die nicht mehr verlässlich ist. Sie fragt, ob die Route überprüft werden kann. Zugleich hat ein anderes System eine beruhigende Scanhistorie, doch eine physische Ladung muss noch geprüft werden. Der Koordinator steht vor zwei Arten von Belegen: einem Datensatz, der formal richtig sein kann, und lokalem Wissen, das noch nicht geprüft ist.") },
            { type: "p", text: x(
              "The wrong choice is to treat the software as automatically authoritative or to accept every human objection on trust. The working choice is to examine the claim, preserve the evidence and follow the authorised procedure for changes. The employee's observation has value even when it turns out to be mistaken: it identifies a condition worth testing. The author's verified background includes coordination of drivers, missing bags, mixed trolleys and scanning rules. The specific route disagreement, timing and outcome here are illustrative, not remembered events.",
              "Zgjedhja e gabuar është ta trajtosh programin si automatikisht autoritar, ose ta pranosh çdo kundërshtim njerëzor në besim. Zgjedhja e punës është ta shqyrtosh pohimin, ta ruash provën dhe të ndjekësh procedurën e autorizuar për ndryshime. Vëzhgimi i punonjësit ka vlerë edhe kur del i gabuar: ai identifikon një kusht që ia vlen të provohet. Sfondi i verifikuar i autorit përfshin koordinimin e shoferëve, çantat që mungojnë, karrocat e përziera dhe rregullat e skanimit. Mosmarrëveshja e caktuar për rrugën, koha dhe rezultati këtu janë ilustruese, jo ngjarje të kujtuara.",
              "Die falsche Wahl ist, die Software automatisch als maßgeblich zu behandeln oder jeden menschlichen Einwand auf Vertrauen hin anzunehmen. Die arbeitsfähige Wahl ist, die Behauptung zu prüfen, den Beleg zu sichern und dem befugten Änderungsverfahren zu folgen. Die Beobachtung des Mitarbeiters hat Wert, auch wenn sie sich als Irrtum erweist: Sie benennt eine Bedingung, die es zu prüfen lohnt. Der geprüfte Hintergrund des Autors umfasst die Koordination von Fahrern, fehlende Taschen, gemischte Wagen und Scanregeln. Die konkrete Meinungsverschiedenheit über die Route, der Zeitpunkt und der Ausgang sind hier illustrativ, keine erinnerten Ereignisse.") },
            { type: "callout", reading: true, text: x(
              "A route can be mathematically consistent and operationally incomplete.",
              "Një rrugë mund të jetë matematikisht e saktë dhe operacionalisht e paplotë.",
              "Eine Route kann mathematisch stimmig und betrieblich unvollständig sein.") },
          ],
          note: x(
            "No driver, route or employer is identified; the essay named below tells the same disagreement from the dispatch side.",
            "Nuk identifikohet asnjë shofer, rrugë apo punëdhënës; eseja e emërtuar më poshtë e tregon të njëjtën mosmarrëveshje nga ana e dispeçerisë.",
            "Kein Fahrer, keine Route und kein Arbeitgeber wird genannt; der unten genannte Essay erzählt dieselbe Meinungsverschiedenheit von der Dispositionsseite."),
        },
        {
          id: "iv-concept", layer: "concept",
          title: [x("Use, misuse,", "Përdorim, keqpërdorim,", "Gebrauch, Missbrauch,"), x("disuse, abuse", "braktisje, abuzim", "Nichtgebrauch, Fehlgebrauch")],
          lead: x(
            "The problem is not simply to make people trust automation more.",
            "Problemi nuk është thjesht t'i bësh njerëzit t'i besojnë më shumë automatizimit.",
            "Das Problem ist nicht einfach, Menschen dazu zu bringen, der Automatik mehr zu vertrauen."),
          blocks: [
            { type: "rows", compact: true, items: [
              { h: x("Use", "Përdorim", "Gebrauch"), p: x("Deliberately engage or disengage automation when appropriate.", "Aktivizo ose çaktivizo automatizimin me vetëdije, kur është e përshtatshme.", "Automatik bewusst einschalten oder ausschalten, wenn es angebracht ist.") },
              { h: x("Misuse", "Keqpërdorim", "Missbrauch"), p: x("Rely too strongly on its output, reducing checking or judgment.", "Mbështetu tepër te rezultati i saj, duke pakësuar kontrollin ose gjykimin.", "Sich zu stark auf ihre Ausgabe verlassen und Prüfung oder Urteil zurückfahren.") },
              { h: x("Disuse", "Braktisje", "Nichtgebrauch"), p: x("Neglect a useful system, potentially after repeated false alarms.", "Shpërfill një sistem të dobishëm, ndoshta pas alarmeve të rreme të përsëritura.", "Ein nützliches System vernachlässigen, womöglich nach wiederholten Fehlalarmen.") },
              { h: x("Abuse", "Abuzim", "Fehlgebrauch"), p: x("Design or impose automation without sufficient regard for human consequences.", "Projekto ose imponon automatizim pa kujdes të mjaftueshëm për pasojat njerëzore.", "Automatik ohne ausreichende Rücksicht auf die menschlichen Folgen gestalten oder vorschreiben.") },
            ] },
            { type: "p", text: x(
              "These terms come from Parasuraman and Riley (1997). Their model refuses an easy binary between “believe the computer” and “believe the worker”. The intended outcome is appropriate reliance. Lee and See (2004) emphasise that trust is shaped by context and by the system's characteristics. A trustworthy design helps people calibrate what the tool is actually good at, and under which circumstances. When a driver flags an unusual road condition or a colleague questions a scan event, the response must not depend on seniority or confidence alone. What independent evidence is available? Does the input reflect the current situation? Who has authority to change the plan? Can the observation improve the system for the next user?",
              "Këto terma vijnë nga Parasuraman dhe Riley (1997). Modeli i tyre e refuzon binarin e lehtë mes “besoji kompjuterit” dhe “besoji punonjësit”. Rezultati i synuar është mbështetja e përshtatshme. Lee dhe See (2004) theksojnë se besimi formohet nga konteksti dhe nga karakteristikat e sistemit. Një dizajn i besueshëm i ndihmon njerëzit të kalibrojnë për çfarë është vërtet i mirë mjeti, dhe në cilat rrethana. Kur një shofer sinjalizon një gjendje të pazakontë të rrugës, ose një koleg vë në pikëpyetje një skanim, përgjigjja nuk duhet të varet vetëm nga vjetërsia apo vetëbesimi. Çfarë prove të pavarur ka? A e pasqyron e dhëna gjendjen e tanishme? Kush ka autoritetin ta ndryshojë planin? A mund ta përmirësojë vëzhgimi sistemin për përdoruesin e radhës?",
              "Diese Begriffe stammen von Parasuraman und Riley (1997). Ihr Modell verweigert die bequeme Zweiteilung zwischen „glaub dem Computer“ und „glaub dem Mitarbeiter“. Das angestrebte Ergebnis ist angemessenes Verlassen. Lee und See (2004) betonen, dass Vertrauen vom Kontext und von den Eigenschaften des Systems geprägt wird. Eine vertrauenswürdige Gestaltung hilft Menschen zu kalibrieren, worin das Werkzeug tatsächlich gut ist, und unter welchen Umständen. Wenn ein Fahrer eine ungewöhnliche Straßenlage meldet oder ein Kollege einen Scan anzweifelt, darf die Reaktion nicht allein von Dienstalter oder Selbstsicherheit abhängen. Welche unabhängigen Belege gibt es? Spiegelt die Eingabe die aktuelle Lage? Wer darf den Plan ändern? Kann die Beobachtung das System für den nächsten Nutzer verbessern?") },
            { type: "callout", reading: true, text: x(
              "The goal is calibrated trust: neither blind reliance nor reflexive rejection.",
              "Qëllimi është besimi i kalibruar: as mbështetje e verbër, as refuzim refleksiv.",
              "Das Ziel ist kalibriertes Vertrauen: weder blindes Verlassen noch reflexhafte Ablehnung.") },
          ],
          note: x(
            "The four terms are Parasuraman and Riley's; the four questions at the end are editorial.",
            "Katër termat janë të Parasuraman dhe Riley; katër pyetjet në fund janë editoriale.",
            "Die vier Begriffe sind von Parasuraman und Riley; die vier Fragen am Ende sind redaktionell."),
          source: ["parasuraman-riley-1997", "lee-see-2004"],
        },
        {
          id: "iv-evidence", layer: "concept",
          title: [x("What reviews", "Çfarë gjetën vërtet", "Was die Übersichten"), x("actually found", "rishikimet", "wirklich fanden")],
          lead: x(
            "Automation bias has an empirical literature, but the evidence samples must stay attached to their contexts.",
            "Anshmëria ndaj automatizimit ka një literaturë empirike, por mostrat e provave duhet të mbeten të lidhura me kontekstet e tyre.",
            "Automation Bias hat eine empirische Literatur, doch die Belegstichproben müssen an ihre Kontexte gebunden bleiben."),
          blocks: [
            { type: "figures", items: [
              { n: "13,821", t: x("papers retrieved", "punime të gjetura", "gefundene Arbeiten") },
              { n: "74", t: x("studies met the criteria", "studime i plotësuan kriteret", "Studien erfüllten die Kriterien") },
              { n: "35", t: x("peer-reviewed studies reviewed", "studime të recensuara të rishikuara", "begutachtete Studien gesichtet") },
              { n: "2015–25", t: x("publication window assessed", "dritarja e botimeve e vlerësuar", "geprüftes Veröffentlichungsfenster") },
            ] },
            { type: "p", text: x(
              "Goddard, Roudsari and Wyatt (2012) searched several fields, with a focus on clinical decision support, and kept 74 studies from 13,821 retrieved papers. Trust and confidence, task experience, workload, task complexity and time constraints mediated automation bias; training, user accountability and design choices could mitigate it. Those counts are papers in a search, not the frequency of bad decisions at work.",
              "Goddard, Roudsari dhe Wyatt (2012) kërkuan në disa fusha, me përqendrim te mbështetja e vendimit klinik, dhe mbajtën 74 studime nga 13.821 punime të gjetura. Besimi dhe vetëbesimi, përvoja në detyrë, ngarkesa e punës, kompleksiteti i detyrës dhe kufizimet e kohës e ndërmjetësonin anshmërinë; trajnimi, llogaridhënia e përdoruesit dhe zgjedhjet e dizajnit mund ta zbusnin. Këto numra janë punime në një kërkim, jo shpeshtësia e vendimeve të këqija në punë.",
              "Goddard, Roudsari und Wyatt (2012) suchten in mehreren Fachgebieten, mit Schwerpunkt auf klinischer Entscheidungsunterstützung, und behielten 74 Studien von 13.821 gefundenen Arbeiten. Vertrauen und Zuversicht, Aufgabenerfahrung, Arbeitslast, Aufgabenkomplexität und Zeitdruck vermittelten Automation Bias; Schulung, Verantwortlichkeit der Nutzer und Gestaltung konnten ihn mildern. Diese Zahlen sind Arbeiten in einer Suche, nicht die Häufigkeit schlechter Entscheidungen bei der Arbeit.") },
            { type: "p", text: x(
              "Romeo and Conti (online 2025) examined 35 peer-reviewed studies of human-AI collaboration from January 2015 to April 2025 and warn that explanations alone do not reliably prevent over-reliance; prompting independent verification still matters. The two reviews use different inclusion rules and periods and cannot be compared as if they counted the same phenomenon over time.",
              "Romeo dhe Conti (në internet 2025) shqyrtuan 35 studime të recensuara mbi bashkëpunimin njeri-AI nga janari 2015 deri në prill 2025 dhe paralajmërojnë se shpjegimet vetëm nuk e parandalojnë me siguri mbështetjen e tepruar; nxitja e verifikimit të pavarur mbetet e rëndësishme. Dy rishikimet kanë rregulla përfshirjeje dhe periudha të ndryshme dhe nuk krahasohen sikur të kishin numëruar të njëjtin fenomen në kohë.",
              "Romeo und Conti (online 2025) untersuchten 35 begutachtete Studien zur Mensch-KI-Zusammenarbeit von Januar 2015 bis April 2025 und warnen, dass Erklärungen allein Überverlassen nicht zuverlässig verhindern; zur eigenständigen Prüfung anzuregen bleibt wichtig. Die beiden Übersichten haben verschiedene Einschlussregeln und Zeiträume und lassen sich nicht vergleichen, als zählten sie dasselbe Phänomen über die Zeit.") },
            { type: "callout", reading: true, text: x(
              "A bigger literature gives a stronger reason to test a mechanism, not permission to invent local results.",
              "Një literaturë më e madhe jep një arsye më të fortë për ta provuar një mekanizëm, jo leje për të shpikur rezultate lokale.",
              "Eine größere Literatur ist ein stärkerer Grund, einen Mechanismus zu prüfen, keine Erlaubnis, lokale Ergebnisse zu erfinden.") },
          ],
          note: x(
            "The counts are from the two abstracts: “Of 13 821 retrieved papers, 74 met the inclusion criteria” (JAMIA 19(1), 2012) and “35 peer-reviewed studies … published between January 2015 and April 2025” (AI & Society, online 2025).",
            "Numrat janë nga dy abstraktet: “Of 13 821 retrieved papers, 74 met the inclusion criteria” (JAMIA 19(1), 2012) dhe “35 peer-reviewed studies … published between January 2015 and April 2025” (AI & Society, në internet 2025).",
            "Die Zahlen stammen aus den beiden Abstracts: „Of 13 821 retrieved papers, 74 met the inclusion criteria“ (JAMIA 19(1), 2012) und „35 peer-reviewed studies … published between January 2015 and April 2025“ (AI & Society, online 2025)."),
          source: ["goddard-2012", "romeo-conti-2025"],
        },
        {
          id: "iv-protocol", layer: "protocol",
          title: [x("Make local knowledge", "Bëje njohurinë lokale", "Lokales Wissen"), x("transferable", "të transferueshme", "übertragbar machen")],
          lead: x(
            "Do not ask workers to choose between silent improvisation and blind obedience.",
            "Mos u kërko punonjësve të zgjedhin mes improvizimit të heshtur dhe bindjes së verbër.",
            "Verlangen Sie von Beschäftigten nicht, zwischen stiller Improvisation und blindem Gehorsam zu wählen."),
          blocks: [
            { type: "steps", items: [
              { h: x("Accept a report", "Prano një raportim", "Eine Meldung annehmen"), p: x("An easy, approved way to flag a route, status or scan reading that may be wrong.", "Një mënyrë e lehtë, e miratuar, për të sinjalizuar një rrugë, status ose skanim që mund të jetë i gabuar.", "Ein einfacher, freigegebener Weg, eine womöglich falsche Route, einen Status oder einen Scan zu melden.") },
              { h: x("Describe the observation", "Përshkruaj vëzhgimin", "Die Beobachtung beschreiben"), p: x("Condition, time, impact, and whether it can be checked independently.", "Kushti, koha, ndikimi, dhe nëse mund të kontrollohet pavarësisht.", "Bedingung, Zeit, Auswirkung und unabhängige Prüfbarkeit.") },
              { h: x("Protect the standard", "Mbro standardin", "Den Standard schützen"), p: x("No change to routes, data or compliance steps without delegated authority.", "Asnjë ndryshim i rrugëve, të dhënave apo hapave të pajtueshmërisë pa autoritet të deleguar.", "Keine Änderung an Routen, Daten oder Compliance-Schritten ohne übertragene Befugnis.") },
              { h: x("Verify jointly", "Verifiko bashkërisht", "Gemeinsam prüfen"), p: x("The original record and the real condition, with the relevant team.", "Regjistrimi origjinal dhe gjendja reale, bashkë me ekipin përkatës.", "Der ursprüngliche Datensatz und die reale Lage, mit dem zuständigen Team.") },
              { h: x("Decide and document", "Vendos dhe dokumento", "Entscheiden und dokumentieren"), p: x("Update an authorised source, or explain why the current rule stands.", "Përditëso një burim të autorizuar, ose shpjego pse rregulli aktual mbetet.", "Eine befugte Quelle aktualisieren oder erklären, warum die Regel bleibt.") },
              { h: x("Tell back", "Trego", "Zurückmelden"), p: x("Frontline users hear what was confirmed and what is still unknown.", "Përdoruesit e vijës së parë mësojnë çfarë u konfirmua dhe çfarë mbetet e panjohur.", "Die Beschäftigten an der Front erfahren, was bestätigt wurde und was offen ist.") },
            ] },
            { type: "p", text: x(
              "What a street, a ramp or a desk teaches should not stay in one person's memory; nor should an unverified anecdote become a new rule. A feedback channel works when it separates observation from approval and returns a reasoned decision to the people affected.",
              "Ajo që mëson rruga, rampa apo tavolina nuk duhet të mbetet në kujtesën e një personi; as një anekdotë e paverifikuar nuk duhet të bëhet rregull i ri. Një kanal reagimi funksionon kur e ndan vëzhgimin nga miratimi dhe u kthen njerëzve të prekur një vendim të arsyetuar.",
              "Was Straße, Rampe oder Schreibtisch lehren, sollte nicht im Gedächtnis einer Person bleiben; ebenso wenig sollte eine ungeprüfte Anekdote zur neuen Regel werden. Ein Rückmeldekanal wirkt, wenn er Beobachtung von Freigabe trennt und den Betroffenen eine begründete Entscheidung zurückgibt.") },
            { type: "callout", reading: true, text: x(
              "A system improves when a correction becomes shared knowledge, not a private workaround.",
              "Një sistem përmirësohet kur një korrigjim bëhet njohuri e përbashkët, jo zgjidhje private.",
              "Ein System verbessert sich, wenn eine Korrektur zu geteiltem Wissen wird, nicht zu einem privaten Umweg.") },
          ],
          note: x(
            "Editorial protocol after Parasuraman and Riley (1997) and Lee and See (2004); the site's Shift Handover tool carries the fields of the last two steps.",
            "Protokoll editorial sipas Parasuraman dhe Riley (1997) dhe Lee dhe See (2004); mjeti Shift Handover i faqes i mban fushat e dy hapave të fundit.",
            "Redaktionelles Protokoll nach Parasuraman und Riley (1997) und Lee und See (2004); das Tool Shift Handover der Seite trägt die Felder der letzten beiden Schritte."),
          source: ["parasuraman-riley-1997", "lee-see-2004"],
        },
      ],
    },

    // Chapter V. 03:00: when the system is unavailable
    {
      id: "ch-v", type: "chapter", numeral: "V",
      title: x("03:00: when the system is unavailable", "03:00: kur sistemi nuk është i disponueshëm", "03:00: wenn das System nicht verfügbar ist"),
      pages: [
        {
          id: "v-scene", layer: "scene", more: "the-night-the-system-went-down",
          title: [x("When the training", "Kur trajnimi", "Als die Schulung"), x("stopped", "u ndal", "stehen blieb")],
          lead: x(
            "A real experience can demonstrate dependency without becoming a fabricated incident.",
            "Një përvojë e vërtetë mund ta tregojë varësinë pa u bërë ngjarje e sajuar.",
            "Eine echte Erfahrung kann Abhängigkeit zeigen, ohne zu einem erfundenen Vorfall zu werden."),
          blocks: [
            { type: "flag", text: x("Documented experience, details limited for operational security", "Përvojë e dokumentuar, me hollësi të kufizuara për sigurinë operacionale", "Dokumentierte Erfahrung, Einzelheiten aus Gründen der Betriebssicherheit begrenzt") },
            { type: "p", text: x(
              "During an early hotel training shift, a planned system update left the trainee unable to practise normal system tasks for several hours. A colleague could explain the work, but the usual live demonstration could not proceed. The training did not become a dramatic emergency. It became an extended lesson in how much procedural learning depended on access to the interface.",
              "Gjatë një turni të hershëm trajnimi në hotel, një përditësim i planifikuar i sistemit e la praktikantin pa mundësi të ushtronte për disa orë detyrat e zakonshme të sistemit. Një koleg mund ta shpjegonte punën, por demonstrimi i zakonshëm i drejtpërdrejtë nuk mund të vazhdonte. Trajnimi nuk u bë emergjencë dramatike. U bë një mësim i zgjatur se sa shumë varej mësimi i procedurave nga aksesi në ndërfaqe.",
              "Während einer frühen Schulungsschicht im Hotel ließ ein geplantes Systemupdate den Auszubildenden mehrere Stunden lang die gewohnten Systemaufgaben nicht üben. Ein Kollege konnte die Arbeit erklären, doch die übliche Live-Vorführung konnte nicht stattfinden. Die Schulung wurde kein dramatischer Notfall. Sie wurde eine ausgedehnte Lektion darüber, wie sehr das Erlernen der Abläufe vom Zugang zur Oberfläche abhing.") },
            { type: "p", text: x(
              "This is narrower than a “night when the entire hotel system failed”. The evidence supports an interruption associated with maintenance and limited hands-on training; it does not support claims about damaged data, incorrect charges, guest consequences, emergency access or a failed recovery. Those facts are not known and do not belong in a public narrative. The episode connects to the author's later effort to organise approved operating knowledge into searchable, visual guidance, the Front Desk Control project. Such a guide can support learning, but it must not be presented as a substitute for the official system, the local operating procedure or an authorised contingency plan.",
              "Kjo është më e ngushtë se një “natë kur dështoi i gjithë sistemi i hotelit”. Prova mbështet një ndërprerje të lidhur me mirëmbajtjen dhe një trajnim praktik të kufizuar; nuk mbështet pohime për të dhëna të dëmtuara, faturime të gabuara, pasoja për mysafirët, akses emergjence apo rikuperim të dështuar. Ato fakte nuk dihen dhe nuk kanë vend në një rrëfim publik. Episodi lidhet me përpjekjen e mëvonshme të autorit për ta organizuar njohurinë e miratuar operative në një udhëzues vizual të kërkueshëm, projekti Front Desk Control. Një udhëzues i tillë mund ta mbështesë mësimin, por nuk duhet paraqitur si zëvendësues i sistemit zyrtar, i procedurës lokale të punës apo i një plani të autorizuar emergjence.",
              "Das ist enger als eine „Nacht, in der das gesamte Hotelsystem ausfiel“. Die Belege stützen eine Unterbrechung im Zusammenhang mit Wartung und eine eingeschränkte praktische Schulung; sie stützen keine Behauptungen über beschädigte Daten, falsche Buchungen, Folgen für Gäste, Notfallzugang oder einen gescheiterten Wiederanlauf. Diese Fakten sind nicht bekannt und gehören nicht in eine öffentliche Erzählung. Die Episode führt zum späteren Vorhaben des Autors, freigegebenes Betriebswissen in eine durchsuchbare, visuelle Anleitung zu ordnen, das Projekt Front Desk Control. Eine solche Anleitung kann das Lernen stützen, darf aber nicht als Ersatz für das offizielle System, die lokale Betriebsanweisung oder einen befugten Notfallplan dargestellt werden.") },
            { type: "callout", reading: true, text: x(
              "When the interface becomes unavailable, the quality of preparation becomes visible.",
              "Kur ndërfaqja bëhet e padisponueshme, cilësia e përgatitjes bëhet e dukshme.",
              "Wenn die Oberfläche nicht verfügbar ist, wird die Qualität der Vorbereitung sichtbar.") },
          ],
          note: x(
            "The author's own training shift, told without the property, the system or the date; the essay named below and the project page tell the rest.",
            "Turni i vetë autorit në trajnim, i treguar pa hotelin, sistemin apo datën; eseja e emërtuar më poshtë dhe faqja e projektit tregojnë pjesën tjetër.",
            "Die Schulungsschicht des Autors selbst, erzählt ohne Haus, System oder Datum; der unten genannte Essay und die Projektseite erzählen den Rest."),
        },
        {
          id: "v-concept", layer: "concept",
          title: [x("Out of the loop", "Jashtë qarkut", "Außerhalb des Kreises"), x("is not out of duty", "nuk do të thotë jashtë detyrës", "heißt nicht außer Dienst")],
          lead: x(
            "Less active work can mean a weaker working picture at the moment intervention is needed. Endsley and Kiris (1995) investigated operators using an expert system for a navigation task. They linked lower situation awareness under automation to worse decision-time performance after the expert system failed; the level of control available to the operator moderated the effect. This was an experiment, not an observation of hotel night auditors or delivery dispatchers.",
            "Më pak punë aktive mund të sjellë një pamje pune më të dobët pikërisht në çastin kur duhet ndërhyrë. Endsley dhe Kiris (1995) studiuan operatorë që përdornin një sistem ekspert për një detyrë navigimi. Ata e lidhën pamjen më të ulët të situatës nën automatizim me performancë më të dobët në kohën e vendimit pasi sistemi ekspert dështoi; niveli i kontrollit në dorë të operatorit e zbuste efektin. Ky ishte eksperiment, jo vëzhgim i auditorëve të natës në hotel apo i dispeçerëve të dorëzimeve.",
            "Weniger aktive Arbeit kann ein schwächeres Lagebild genau in dem Moment bedeuten, in dem eingegriffen werden muss. Endsley und Kiris (1995) untersuchten Operatoren, die ein Expertensystem für eine Navigationsaufgabe nutzten. Sie verbanden geringeres Lagebewusstsein unter Automatik mit schlechterer Entscheidungszeit nach dem Ausfall des Expertensystems; die dem Operator verfügbare Kontrollstufe milderte den Effekt. Das war ein Experiment, keine Beobachtung von Nachtauditoren im Hotel oder Zustelldisponenten."),
          blocks: [
            { type: "cards", cols: 3, items: [
              { h: x("Perceive", "Vëre", "Wahrnehmen"), p: x("What is happening now?", "Çfarë po ndodh tani?", "Was geschieht gerade?") },
              { h: x("Understand", "Kupto", "Verstehen"), p: x("What do the observations mean?", "Çfarë kuptimi kanë vëzhgimet?", "Was bedeuten die Beobachtungen?") },
              { h: x("Anticipate", "Parashiko", "Vorausschauen"), p: x("What could happen next if nothing changes?", "Çfarë mund të ndodhë më pas, nëse asgjë nuk ndryshon?", "Was könnte als Nächstes geschehen, wenn sich nichts ändert?") },
            ] },
            { type: "p", text: x(
              "The three prompts above are an editorial teaching device built around situation awareness, not a substitute for its complete research literature. In operational practice, a handover that records only an end status can deprive the next worker of the path by which that status was reached. When the system is unavailable, the worker also needs to know the limits of their role, how to obtain authorised guidance and which actions must wait. The test of resilience is not whether a person can reproduce every screen from memory. It is whether the organisation has preserved a safe, authorised ability to orient itself.",
              "Tri pyetjet më sipër janë një mjet mësimor editorial i ndërtuar rreth pamjes së situatës, jo zëvendësues i literaturës së plotë kërkimore për të. Në praktikën operacionale, një dorëzim që regjistron vetëm statusin përfundimtar mund t'ia heqë punonjësit të radhës rrugën me të cilën u arrit ai status. Kur sistemi nuk është i disponueshëm, punonjësi duhet të dijë edhe kufijtë e rolit të vet, si të marrë udhëzim të autorizuar dhe cilat veprime duhet të presin. Prova e qëndrueshmërisë nuk është nëse një person i riprodhon dot nga kujtesa të gjitha ekranet. Është nëse organizata ka ruajtur një aftësi të sigurt dhe të autorizuar për t'u orientuar.",
              "Die drei Fragen oben sind ein redaktionelles Lehrmittel rund um das Lagebewusstsein, kein Ersatz für dessen gesamte Forschungsliteratur. In der betrieblichen Praxis kann eine Übergabe, die nur einen Endstatus festhält, der nächsten Arbeitskraft den Weg vorenthalten, auf dem dieser Status erreicht wurde. Ist das System nicht verfügbar, muss die Arbeitskraft außerdem die Grenzen ihrer Rolle kennen, wissen, wie sie befugte Anleitung erhält, und welche Handlungen warten müssen. Der Prüfstein der Widerstandsfähigkeit ist nicht, ob eine Person jeden Bildschirm aus dem Gedächtnis nachbilden kann. Er ist, ob die Organisation eine sichere, befugte Fähigkeit bewahrt hat, sich zu orientieren.") },
            { type: "callout", reading: true, text: x(
              "A person who is accountable for a system needs a way to understand its state.",
              "Një person që mban përgjegjësi për një sistem ka nevojë për një mënyrë për t'ia kuptuar gjendjen.",
              "Wer für ein System verantwortlich ist, braucht einen Weg, seinen Zustand zu verstehen.") },
          ],
          note: x(
            "Endsley and Kiris, Human Factors 37(2), 1995, a laboratory study; Bainbridge (1983) for the loss of practice; the three prompts are editorial.",
            "Endsley dhe Kiris, Human Factors 37(2), 1995, studim laboratorik; Bainbridge (1983) për humbjen e praktikës; tri pyetjet janë editoriale.",
            "Endsley und Kiris, Human Factors 37(2), 1995, eine Laborstudie; Bainbridge (1983) für den Verlust der Übung; die drei Fragen sind redaktionell."),
          source: ["bainbridge-1983", "endsley-kiris-1995"],
        },
        {
          id: "v-trust", layer: "concept",
          title: [x("Confidence is", "Vetëbesimi", "Zuversicht ist"), x("not control", "nuk është kontroll", "nicht Kontrolle")],
          lead: x(
            "A transparent explanation can help, but it does not automatically produce better judgment.",
            "Një shpjegim transparent mund të ndihmojë, por nuk prodhon vetvetiu gjykim më të mirë.",
            "Eine transparente Erklärung kann helfen, erzeugt aber nicht von selbst ein besseres Urteil."),
          blocks: [
            { type: "p", text: x(
              "Lee and See (2004) describe trust in automation as consequential when complexity or unexpected conditions prevent a complete understanding of a system. The goal is appropriate reliance under the circumstances, not maximum trust. A confident user can still rely on the wrong output; a cautious user can also reject useful assistance. Romeo and Conti's review (online 2025) found that explanations in human-AI decision-making do not reliably eliminate automation bias. Complex explanations may overload people; simplified explanations may make a suggestion seem more credible without supporting independent checking. Their evidence concerns AI-assisted decisions, not every ordinary enterprise application.",
              "Lee dhe See (2004) e përshkruajnë besimin te automatizimi si vendimtar kur kompleksiteti ose gjendjet e papritura e pengojnë kuptimin e plotë të një sistemi. Qëllimi është mbështetja e përshtatshme sipas rrethanave, jo besimi maksimal. Një përdorues i sigurt mund të mbështetet prapëseprapë te rezultati i gabuar; një përdorues i kujdesshëm mund ta refuzojë edhe ndihmën e dobishme. Rishikimi i Romeo dhe Conti-t (në internet 2025) gjeti se shpjegimet në vendimmarrjen njeri-AI nuk e eliminojnë me siguri anshmërinë ndaj automatizimit. Shpjegimet e ndërlikuara mund t'i mbingarkojnë njerëzit; shpjegimet e thjeshtuara mund ta bëjnë një sugjerim të duket më i besueshëm, pa mbështetur kontrollin e pavarur. Provat e tyre kanë të bëjnë me vendime të ndihmuara nga AI, jo me çdo aplikacion të zakonshëm ndërmarrjeje.",
              "Lee und See (2004) beschreiben Vertrauen in Automatik als entscheidend, wenn Komplexität oder unerwartete Bedingungen ein vollständiges Verständnis des Systems verhindern. Das Ziel ist angemessenes Verlassen unter den gegebenen Umständen, nicht maximales Vertrauen. Ein zuversichtlicher Nutzer kann sich trotzdem auf die falsche Ausgabe verlassen; ein vorsichtiger Nutzer kann auch nützliche Hilfe ablehnen. Die Übersicht von Romeo und Conti (online 2025) fand, dass Erklärungen in der Mensch-KI-Entscheidungsfindung Automation Bias nicht zuverlässig beseitigen. Komplexe Erklärungen können Menschen überlasten; vereinfachte Erklärungen können einen Vorschlag glaubwürdiger erscheinen lassen, ohne die eigenständige Prüfung zu stützen. Ihre Belege betreffen KI-gestützte Entscheidungen, nicht jede gewöhnliche Unternehmensanwendung.") },
            { type: "rows", compact: true, items: [
              { h: x("Explanation", "Shpjegimi", "Erklärung"), p: x("What does the system claim and on what inputs?", "Çfarë pohon sistemi dhe mbi cilat të dhëna?", "Was behauptet das System, und auf welchen Eingaben?") },
              { h: x("Verification", "Verifikimi", "Prüfung"), p: x("What can an authorised user independently confirm?", "Çfarë mund të konfirmojë pavarësisht një përdorues i autorizuar?", "Was kann ein befugter Nutzer eigenständig bestätigen?") },
              { h: x("Authority", "Autoriteti", "Befugnis"), p: x("What change can this role approve, and what needs escalation?", "Cilin ndryshim mund ta miratojë ky rol, dhe çfarë ka nevojë për eskalim?", "Welche Änderung darf diese Rolle freigeben, und was braucht Eskalation?") },
              { h: x("Recovery", "Rikuperimi", "Wiederanlauf"), p: x("If the tool is unavailable, where is approved guidance?", "Nëse mjeti nuk është i disponueshëm, ku është udhëzimi i miratuar?", "Wo ist die freigegebene Anleitung, wenn das Werkzeug nicht verfügbar ist?") },
            ] },
            { type: "callout", reading: true, text: x(
              "Good assistance increases the user's ability to judge, not merely the user's willingness to agree.",
              "Ndihma e mirë e rrit aftësinë e përdoruesit për të gjykuar, jo thjesht gatishmërinë e tij për t'u pajtuar.",
              "Gute Unterstützung steigert die Urteilsfähigkeit des Nutzers, nicht bloß seine Bereitschaft zuzustimmen.") },
          ],
          note: x(
            "Lee and See, Human Factors 46(1), 2004; Romeo and Conti, AI & Society, online 2025. The four rows are editorial.",
            "Lee dhe See, Human Factors 46(1), 2004; Romeo dhe Conti, AI & Society, në internet 2025. Katër rreshtat janë editorialë.",
            "Lee und See, Human Factors 46(1), 2004; Romeo und Conti, AI & Society, online 2025. Die vier Zeilen sind redaktionell."),
          source: ["lee-see-2004", "romeo-conti-2025"],
        },
        {
          id: "v-protocol", layer: "protocol",
          title: [x("Continuity without", "Vazhdimësi pa", "Kontinuität ohne"), x("improvisation", "improvizim", "Improvisation")],
          lead: x(
            "A system-interruption plan should be knowable, authorised and safe before it is needed.",
            "Një plan për ndërprerjen e sistemit duhet të jetë i njohur, i autorizuar dhe i sigurt para se të nevojitet.",
            "Ein Plan für den Systemausfall sollte bekannt, befugt und sicher sein, bevor er gebraucht wird."),
          blocks: [
            { type: "steps", items: [
              { h: x("Know the approved source", "Njih burimin e miratuar", "Die freigegebene Quelle kennen"), p: x("Find the approved continuity instructions during training, not during the outage.", "Gjeji udhëzimet e miratuara të vazhdimësisë gjatë trajnimit, jo gjatë ndërprerjes.", "Die freigegebenen Anweisungen in der Schulung finden, nicht im Ausfall.") },
              { h: x("Define limits", "Përkufizo kufijtë", "Grenzen festlegen"), p: x("Which work proceeds, which pauses, who authorises exceptions.", "Cila punë vazhdon, cila ndalet, kush autorizon përjashtime.", "Welche Arbeit weitergeht, welche ruht, wer Ausnahmen freigibt.") },
              { h: x("Agree the communication", "Bini dakord për komunikimin", "Die Kommunikation vereinbaren"), p: x("Designated channels; no contradictory promises to customers or colleagues.", "Kanale të caktuara; asnjë premtim kontradiktor ndaj klientëve ose kolegëve.", "Vorgesehene Kanäle; keine widersprüchlichen Zusagen an Kunden oder Kollegen.") },
              { h: x("Keep an accountable record", "Mbaj një regjistër me përgjegjësi", "Nachvollziehbar dokumentieren"), p: x("Open issues documented by approved, privacy-protecting means.", "Çështjet e hapura të dokumentuara me mjete të miratuara që ruajnë privatësinë.", "Offene Punkte mit freigegebenen, datenschutzgerechten Mitteln festhalten.") },
              { h: x("Confirm controlled return", "Konfirmo kthimin e kontrolluar", "Kontrollierte Rückkehr bestätigen"), p: x("Authorised staff verify readiness and reconcile open issues officially.", "Stafi i autorizuar verifikon gatishmërinë dhe i pajton zyrtarisht çështjet e hapura.", "Befugte Beschäftigte prüfen die Bereitschaft und gleichen offene Punkte offiziell ab.") },
              { h: x("Learn afterwards", "Mëso më pas", "Danach lernen"), p: x("Review gaps in training and documentation without exposing sensitive controls.", "Rishiko boshllëqet në trajnim dhe dokumentim pa i ekspozuar kontrollet e ndjeshme.", "Lücken in Schulung und Dokumentation prüfen, ohne sensible Kontrollen preiszugeben.") },
            ] },
            { type: "p", text: x(
              "This volume deliberately gives no instructions about guest access, payment control, credentials or recovery mechanics: preparedness and responsibility can be examined without publishing a playbook that could weaken security.",
              "Ky vëllim me qëllim nuk jep udhëzime për aksesin e mysafirëve, kontrollin e pagesave, kredencialet apo mekanikën e rikuperimit: gatishmëria dhe përgjegjësia mund të shqyrtohen pa botuar një udhëzues që mund ta dobësonte sigurinë.",
              "Dieser Band gibt bewusst keine Anweisungen zu Gästezugang, Zahlungskontrolle, Zugangsdaten oder Wiederanlaufmechanik: Vorbereitung und Verantwortung lassen sich untersuchen, ohne ein Handbuch zu veröffentlichen, das die Sicherheit schwächen könnte.") },
            { type: "callout", reading: true, text: x(
              "Preparedness is an organisational capability, not a secret workaround remembered by one person.",
              "Gatishmëria është aftësi e organizatës, jo një zgjidhje e fshehtë që e mban mend vetëm një person.",
              "Vorbereitung ist eine Fähigkeit der Organisation, kein geheimer Umweg, den sich eine Person merkt.") },
          ],
          note: x(
            "Editorial continuity protocol after Bainbridge (1983), Endsley and Kiris (1995) and Lee and See (2004); not a contingency plan of any hotel.",
            "Protokoll vazhdimësie editorial sipas Bainbridge (1983), Endsley e Kiris (1995) dhe Lee e See (2004); jo plan emergjence i ndonjë hoteli.",
            "Redaktionelles Kontinuitätsprotokoll nach Bainbridge (1983), Endsley und Kiris (1995) und Lee und See (2004); kein Notfallplan eines Hotels."),
          source: ["bainbridge-1983", "endsley-kiris-1995", "lee-see-2004"],
        },
      ],
    },

    // Chapter VI. The responsible override
    {
      id: "ch-vi", type: "chapter", numeral: "VI",
      title: x("The responsible override", "Ndërhyrja me përgjegjësi", "Der verantwortete Eingriff"),
      pages: [
        {
          id: "vi-scene", layer: "scene", more: "the-scanner-is-a-witness",
          title: [x("The decision", "Vendimi", "Die Entscheidung"), x("between two systems", "mes dy sistemeve", "zwischen zwei Systemen")],
          lead: x(
            "There is an especially difficult moment when everyone can point to a record, but nobody can identify the decision owner.",
            "Ka një çast veçanërisht të vështirë kur të gjithë mund të tregojnë një regjistrim, por askush nuk e thotë dot kush e ka vendimin.",
            "Besonders schwierig ist der Moment, in dem alle auf einen Datensatz zeigen können, aber niemand den Entscheidungsverantwortlichen benennen kann."),
          blocks: [
            { type: "flag", text: x("Hypothetical scene, an editorial test case", "Skenë hipotetike, një rast prove editorial", "Hypothetische Szene, ein redaktioneller Testfall") },
            { type: "p", text: x(
              "An automated recommendation conflicts with a verified observation. The operator recognises the discrepancy but hesitates: the software is treated as authoritative, while the procedure for challenging it is unclear. The manager asks whether the team should “override” the recommendation. Yet override is not a magic button. It may mean requesting review, recording an exception, pausing a non-critical action or escalating to a person with the appropriate authority.",
              "Një rekomandim i automatizuar bie ndesh me një vëzhgim të verifikuar. Operatori e sheh mospërputhjen, por heziton: programi trajtohet si autoritar, ndërsa procedura për ta kundërshtuar është e paqartë. Menaxheri pyet nëse ekipi duhet ta “anashkalojë” rekomandimin. Por ndërhyrja nuk është një buton magjik. Mund të thotë të kërkosh rishikim, të shënosh një përjashtim, të ndalosh një veprim jokritik, ose t'ia kalosh çështjen një personi me autoritetin e duhur.",
              "Eine automatisierte Empfehlung widerspricht einer geprüften Beobachtung. Der Operator erkennt die Abweichung, zögert aber: Die Software gilt als maßgeblich, während das Verfahren, sie anzufechten, unklar ist. Die Führungskraft fragt, ob das Team die Empfehlung „übersteuern“ soll. Doch der Eingriff ist kein Zauberknopf. Er kann bedeuten, eine Prüfung anzufordern, eine Ausnahme zu erfassen, eine unkritische Handlung anzuhalten oder an eine Person mit der nötigen Befugnis zu eskalieren.") },
            { type: "p", text: x(
              "If a company treats the event as a personal contest between experienced staff and a machine, it misses the design question. What happens when both sources disagree? Does the employee have permission to stop? Who makes the next decision? How will the system be corrected if the observation proves reliable? No specific user of Front Desk Control, no hotel incident and no route correction are claimed in this scene. It is a test case for designing human accountability, not evidence that an override has been executed.",
              "Nëse një kompani e trajton ngjarjen si garë personale mes stafit me përvojë dhe një makine, i shpëton pyetja e projektimit. Çfarë ndodh kur dy burimet nuk pajtohen? A ka punonjësi leje të ndalet? Kush e merr vendimin e radhës? Si do të korrigjohet sistemi nëse vëzhgimi del i besueshëm? Në këtë skenë nuk pretendohet asnjë përdorues i caktuar i Front Desk Control, asnjë ngjarje hoteli dhe asnjë korrigjim rruge. Është një rast prove për projektimin e llogaridhënies njerëzore, jo provë se një ndërhyrje është kryer.",
              "Behandelt ein Unternehmen das Ereignis als persönlichen Wettstreit zwischen erfahrenem Personal und einer Maschine, verfehlt es die Gestaltungsfrage. Was geschieht, wenn beide Quellen sich widersprechen? Darf der Mitarbeiter anhalten? Wer trifft die nächste Entscheidung? Wie wird das System korrigiert, wenn sich die Beobachtung als verlässlich erweist? In dieser Szene wird kein bestimmter Nutzer von Front Desk Control, kein Hotelvorfall und keine Routenkorrektur behauptet. Sie ist ein Testfall für die Gestaltung menschlicher Verantwortlichkeit, kein Beleg dafür, dass ein Eingriff ausgeführt wurde.") },
            { type: "callout", reading: true, text: x(
              "The right to question a recommendation is meaningful only if someone can decide what happens next.",
              "E drejta për të vënë në pikëpyetje një rekomandim ka kuptim vetëm nëse dikush mund të vendosë çfarë ndodh më pas.",
              "Das Recht, eine Empfehlung anzuzweifeln, hat nur Sinn, wenn jemand entscheiden kann, was als Nächstes geschieht.") },
          ],
          note: x(
            "Constructed test case; the essay named below argues the same point for the scan record.",
            "Rast prove i ndërtuar; eseja e emërtuar më poshtë e mbron të njëjtën pikë për regjistrimin e skanimit.",
            "Konstruierter Testfall; der unten genannte Essay vertritt denselben Punkt für den Scandatensatz."),
        },
        {
          id: "vi-concept", layer: "concept",
          title: [x("What exactly", "Çfarë saktësisht", "Was genau"), x("is automated?", "është automatizuar?", "ist automatisiert?")],
          lead: x(
            "A system can automate information without being authorised to automate the final decision. Parasuraman, Sheridan and Wickens (2000) distinguish four classes of functions that can be automated at different levels. This is a useful antidote to the vague claim that “the system decided”. A route planner may acquire and analyse information, then suggest a plan. Another system may execute a pre-approved action. Those are different responsibility arrangements.",
            "Një sistem mund ta automatizojë informacionin pa qenë i autorizuar ta automatizojë vendimin përfundimtar. Parasuraman, Sheridan dhe Wickens (2000) dallojnë katër klasa funksionesh që mund të automatizohen në nivele të ndryshme. Është një kundërhelm i dobishëm ndaj pohimit të vagullt “sistemi vendosi”. Një planifikues rrugësh mund ta marrë dhe ta analizojë informacionin, pastaj të sugjerojë një plan. Një sistem tjetër mund të kryejë një veprim të miratuar paraprakisht. Këto janë rregullime të ndryshme përgjegjësie.",
            "Ein System kann Information automatisieren, ohne befugt zu sein, die endgültige Entscheidung zu automatisieren. Parasuraman, Sheridan und Wickens (2000) unterscheiden vier Funktionsklassen, die auf verschiedenen Stufen automatisiert werden können. Das ist ein nützliches Gegenmittel gegen die vage Behauptung „das System hat entschieden“. Ein Routenplaner kann Information aufnehmen und analysieren und dann einen Plan vorschlagen. Ein anderes System kann eine vorab freigegebene Handlung ausführen. Das sind verschiedene Verantwortungsregelungen."),
          blocks: [
            { type: "rows", compact: true, items: [
              { h: x("1 · Acquisition", "1 · Marrja", "1 · Aufnahme"), p: x("Collect data: events, positions, times, entries.", "Mbledh të dhëna: ngjarje, pozicione, orë, shënime.", "Daten sammeln: Ereignisse, Positionen, Zeiten, Einträge.") },
              { h: x("2 · Analysis", "2 · Analiza", "2 · Analyse"), p: x("Transform data: calculate, compare, flag an exception.", "Përpunon të dhënat: llogarit, krahason, sinjalizon një përjashtim.", "Daten verarbeiten: berechnen, vergleichen, eine Ausnahme markieren.") },
              { h: x("3 · Selection", "3 · Zgjedhja", "3 · Auswahl"), p: x("Recommend or choose a course of action.", "Rekomandon ose zgjedh një rrugë veprimi.", "Eine Vorgehensweise empfehlen oder wählen.") },
              { h: x("4 · Implementation", "4 · Zbatimi", "4 · Ausführung"), p: x("Carry out the action under the chosen authority level.", "Kryen veprimin sipas nivelit të zgjedhur të autoritetit.", "Die Handlung auf der gewählten Befugnisstufe ausführen.") },
            ] },
            { type: "p", text: x(
              "The central managerial task is to make those handoffs explicit. A status badge may express a rule-driven conclusion, not an independent observation. A recommended change may require a different role's approval. Even when implementation is automated, an organisation remains responsible for policies, training, controls and review.",
              "Detyra kryesore e menaxhimit është t'i bëjë të qarta këto dorëzime. Një shenjë statusi mund të shprehë një përfundim të nxjerrë nga rregulli, jo një vëzhgim të pavarur. Një ndryshim i rekomanduar mund të kërkojë miratimin e një roli tjetër. Edhe kur zbatimi është i automatizuar, organizata mbetet përgjegjëse për politikat, trajnimin, kontrollet dhe rishikimin.",
              "Die zentrale Führungsaufgabe ist, diese Übergaben ausdrücklich zu machen. Ein Statusabzeichen kann eine regelbasierte Schlussfolgerung ausdrücken, keine unabhängige Beobachtung. Eine empfohlene Änderung kann die Freigabe einer anderen Rolle verlangen. Selbst wenn die Ausführung automatisiert ist, bleibt die Organisation für Regeln, Schulung, Kontrollen und Überprüfung verantwortlich.") },
            { type: "callout", reading: true, text: x(
              "Ask which function the software performs before saying it made the decision.",
              "Pyet cilin funksion kryen programi, para se të thuash se ai e mori vendimin.",
              "Fragen Sie, welche Funktion die Software ausführt, bevor Sie sagen, sie habe entschieden.") },
          ],
          note: x(
            "Parasuraman, Sheridan and Wickens, IEEE Transactions on Systems, Man, and Cybernetics A 30(3), 2000; the operational examples are editorial.",
            "Parasuraman, Sheridan dhe Wickens, IEEE Transactions on Systems, Man, and Cybernetics A 30(3), 2000; shembujt operacionalë janë editorialë.",
            "Parasuraman, Sheridan und Wickens, IEEE Transactions on Systems, Man, and Cybernetics A 30(3), 2000; die betrieblichen Beispiele sind redaktionell."),
          source: ["parasuraman-sheridan-wickens-2000"],
        },
        {
          id: "vi-model", layer: "concept",
          title: [x("The responsible", "Modeli i ndërhyrjes", "Das Modell des"), x("override model", "me përgjegjësi", "verantworteten Eingriffs")],
          lead: x(
            "A five-stage operating cycle for exceptions that the normal display cannot resolve.",
            "Një cikël pune me pesë faza për përjashtimet që ekrani i zakonshëm nuk i zgjidh dot.",
            "Ein Betriebszyklus in fünf Stufen für Ausnahmen, die die normale Anzeige nicht lösen kann."),
          blocks: [
            { type: "chain", items: [
              { h: x("Flag", "Sinjalizo", "Melden"), p: x("Preserve the original recommendation, its time and the reason it was questioned.", "Ruaj rekomandimin origjinal, orën e tij dhe arsyen pse u vu në pikëpyetje.", "Die ursprüngliche Empfehlung, ihre Zeit und den Grund des Zweifels sichern.") },
              { h: x("Verify", "Verifiko", "Prüfen"), p: x("Compare it with independent, permitted evidence and record uncertainty.", "Krahasoje me prova të pavarura të lejuara dhe shëno pasigurinë.", "Mit unabhängigen, zulässigen Belegen vergleichen und die Unsicherheit festhalten.") },
              { h: x("Authorise", "Autorizo", "Freigeben"), p: x("Identify the person or role entitled to change the decision.", "Gjej personin ose rolin që ka të drejtë ta ndryshojë vendimin.", "Die Person oder Rolle bestimmen, die die Entscheidung ändern darf.") },
              { h: x("Act", "Vepro", "Handeln"), p: x("Make the approved correction or manage the exception under the official procedure.", "Bëj korrigjimin e miratuar ose trajtoje përjashtimin sipas procedurës zyrtare.", "Die freigegebene Korrektur vornehmen oder die Ausnahme nach dem offiziellen Verfahren behandeln.") },
              { h: x("Learn", "Mëso", "Lernen"), p: x("Report the result to those affected and assess whether data, interface, training or threshold needs review.", "Raportoja rezultatin të prekurve dhe vlerëso nëse të dhënat, ndërfaqja, trajnimi ose pragu kanë nevojë për rishikim.", "Das Ergebnis den Betroffenen melden und prüfen, ob Daten, Oberfläche, Schulung oder Schwelle überarbeitet werden müssen.") },
            ] },
            { type: "p", text: x(
              "The cycle is an editorial synthesis, not an ISO standard, a certification or a control validated on the author's data. And “human” does not mean “unlimited discretion”: some decisions are legally constrained, some demand immediate safety escalation, others a second authority.",
              "Cikli është sintezë editoriale, jo standard ISO, certifikim apo kontroll i vërtetuar me të dhënat e autorit. Dhe “njerëzor” nuk do të thotë “liri e pakufizuar”: disa vendime i kufizon ligji, disa kërkojnë eskalim të menjëhershëm sigurie, të tjera një autoritet të dytë.",
              "Der Zyklus ist eine redaktionelle Synthese, kein ISO-Standard, keine Zertifizierung und keine an den Daten des Autors validierte Kontrolle. Und „menschlich“ heißt nicht „unbegrenzter Ermessensspielraum“: Manche Entscheidungen sind rechtlich gebunden, manche verlangen sofortige Sicherheitseskalation, andere eine zweite Befugnis.") },
            { type: "rows", compact: true, items: [
              { h: x("System output", "Rezultati i sistemit", "Systemausgabe"), p: x("What does it actually recommend or record?", "Çfarë rekomandon ose regjistron vërtet?", "Was empfiehlt oder erfasst es tatsächlich?") },
              { h: x("Human evidence", "Prova njerëzore", "Menschlicher Beleg"), p: x("What independent condition has been verified?", "Cili kusht i pavarur është verifikuar?", "Welche unabhängige Bedingung wurde geprüft?") },
              { h: x("Decision rights", "Të drejtat e vendimit", "Entscheidungsrechte"), p: x("Who may correct, pause, or escalate?", "Kush mund të korrigjojë, të ndalojë ose të eskalojë?", "Wer darf korrigieren, anhalten oder eskalieren?") },
              { h: x("Closure", "Mbyllja", "Abschluss"), p: x("What proves the outcome, and who hears back?", "Çfarë e vërteton rezultatin, dhe kush merr përgjigje?", "Was belegt das Ergebnis, und wer erhält Rückmeldung?") },
            ] },
            { type: "callout", reading: true, text: x(
              "The purpose of a human override is accountable correction, not a hidden route around safeguards.",
              "Qëllimi i ndërhyrjes njerëzore është korrigjimi me përgjegjësi, jo një rrugë e fshehtë rreth mbrojtjeve.",
              "Der Zweck eines menschlichen Eingriffs ist verantwortete Korrektur, kein versteckter Weg um die Schutzvorkehrungen herum.") },
          ],
          note: x(
            "Editorial synthesis after Parasuraman et al. (2000), Lee and See (2004) and Goddard et al. (2012); no stage has been validated as a control.",
            "Sintezë editoriale sipas Parasuraman et al. (2000), Lee dhe See (2004) dhe Goddard et al. (2012); asnjë fazë nuk është vërtetuar si kontroll.",
            "Redaktionelle Synthese nach Parasuraman et al. (2000), Lee und See (2004) und Goddard et al. (2012); keine Stufe ist als Kontrolle validiert."),
          source: ["parasuraman-sheridan-wickens-2000", "lee-see-2004", "goddard-2012"],
        },
        {
          id: "vi-protocol", layer: "protocol",
          title: [x("Measure the", "Mat sistemin", "Das Entscheidungs-"), x("decision system", "e vendimit", "system messen")],
          lead: x(
            "A controlled pilot should measure customer and safety outcomes, not how often humans disagreed with software.",
            "Një pilot i kontrolluar duhet të masë rezultatet për klientin dhe sigurinë, jo sa shpesh njerëzit nuk u pajtuan me programin.",
            "Ein kontrollierter Pilot sollte Kunden- und Sicherheitsergebnisse messen, nicht, wie oft Menschen der Software widersprachen."),
          blocks: [
            { type: "steps", items: [
              { h: x("Start small", "Nis me pak", "Klein anfangen"), p: x("One low-risk, permitted workflow, with its customer outcome defined.", "Një rrjedhë pune e lejuar, me rrezik të ulët, me rezultatin për klientin të përkufizuar.", "Ein risikoarmer, zulässiger Arbeitsablauf mit definiertem Kundenergebnis.") },
              { h: x("Write down definitions", "Shkruaj përkufizimet", "Definitionen festhalten"), p: x("Observed incorrect outputs apart from merely contested recommendations.", "Rezultatet e gabuara të vëzhguara veç rekomandimeve thjesht të kontestuara.", "Beobachtete falsche Ausgaben getrennt von bloß angefochtenen Empfehlungen.") },
              { h: x("Sample cases fairly", "Merr mostra drejt", "Fälle fair auswählen"), p: x("Accepted and challenged recommendations alike; otherwise the review is biased.", "Rekomandime të pranuara dhe të kundërshtuara njësoj; përndryshe rishikimi është i anshëm.", "Angenommene wie angefochtene Empfehlungen; sonst ist die Prüfung verzerrt.") },
              { h: x("Track follow-through", "Ndiq deri në fund", "Nachverfolgen"), p: x("Verification, owner, final disposition and time to communicate the outcome.", "Verifikimi, përgjegjësi, vendimi përfundimtar dhe koha deri te njoftimi i rezultatit.", "Prüfung, Verantwortlicher, endgültige Erledigung und Zeit bis zur Mitteilung.") },
              { h: x("Audit for unintended effects", "Kontrollo efektet e padëshiruara", "Auf Nebenwirkungen prüfen"), p: x("New delays, missed cases or unauthorised actions created by the change.", "Vonesa të reja, raste të humbura ose veprime të paautorizuara që i krijoi ndryshimi.", "Neue Verzögerungen, übersehene Fälle oder unbefugte Handlungen durch die Änderung.") },
              { h: x("Decide to keep or stop", "Vendos: vazhdo apo ndalo", "Weiterführen oder beenden"), p: x("The whole result against the baseline, and what users say improved or worsened.", "Rezultati i plotë kundrejt gjendjes fillestare, dhe çfarë thonë përdoruesit se u përmirësua ose u keqësua.", "Das Gesamtergebnis gegen die Ausgangslage, und was die Nutzer als besser oder schlechter nennen.") },
            ] },
            { type: "rows", compact: true, items: [
              { h: x("Verification rate", "Norma e verifikimit", "Prüfquote"), p: x("Cases independently checked / cases sampled.", "Raste të kontrolluara pavarësisht / raste në mostër.", "Unabhängig geprüfte Fälle / Fälle in der Stichprobe.") },
              { h: x("Resolution lead time", "Koha deri në zgjidhje", "Durchlaufzeit bis zur Entscheidung"), p: x("Time from verified issue to authorised decision.", "Koha nga problemi i verifikuar deri te vendimi i autorizuar.", "Zeit vom geprüften Problem bis zur befugten Entscheidung.") },
              { h: x("Feedback closure", "Mbyllja e përgjigjes", "Rückmeldeabschluss"), p: x("Decisions communicated to affected staff.", "Vendime të njoftuara stafit të prekur.", "Entscheidungen, die den betroffenen Beschäftigten mitgeteilt wurden.") },
              { h: x("Exception quality", "Cilësia e përjashtimit", "Ausnahmequalität"), p: x("Challenges with documented reason and outcome.", "Kundërshtime me arsye dhe rezultat të dokumentuar.", "Einwände mit dokumentiertem Grund und Ergebnis.") },
            ] },
          ],
          note: x(
            "Editorial pilot design and metrics after Lee and See (2004), Goddard et al. (2012) and Romeo and Conti (2025); proposed, not tested for validity.",
            "Dizajn piloti dhe matje editoriale sipas Lee dhe See (2004), Goddard et al. (2012) dhe Romeo e Conti (2025); të propozuara, jo të provuara për vlefshmëri.",
            "Redaktionelles Pilotdesign und Kennzahlen nach Lee und See (2004), Goddard et al. (2012) und Romeo und Conti (2025); vorgeschlagen, nicht auf Gültigkeit geprüft."),
          source: ["lee-see-2004", "goddard-2012", "romeo-conti-2025"],
        },
      ],
    },

    {
      id: "tool", tool: "/tools/shift-handover/",
      kicker: x("Field tool", "Mjeti i terrenit", "Werkzeug vor Ort"),
      title: [x("The Human", "Karta e ndërhyrjes", "Das"), x("Override Card", "njerëzore", "Eingriffsblatt")],
      lead: x(
        "One disputed output. One verified condition. One authorised action. Never place personal, payment or proprietary data on a public copy.",
        "Një rezultat i kontestuar. Një kusht i verifikuar. Një veprim i autorizuar. Mos vendos kurrë të dhëna personale, pagesash apo pronësore në një kopje publike.",
        "Eine strittige Ausgabe. Eine geprüfte Bedingung. Eine befugte Handlung. Nie persönliche, Zahlungs- oder Firmendaten auf eine öffentliche Kopie schreiben."),
      blocks: [
        { type: "form", items: [
          { h: x("System output", "Rezultati i sistemit", "Systemausgabe"), hint: x("what exactly did it report, recommend or mark complete?", "çfarë saktësisht raportoi, rekomandoi ose shënoi si të kryer?", "was genau hat es gemeldet, empfohlen oder als erledigt markiert?") },
          { h: x("Current evidence", "Prova e tanishme", "Aktueller Beleg"), hint: x("what did a person or independent source actually verify?", "çfarë verifikoi vërtet një person ose një burim i pavarur?", "was hat eine Person oder eine unabhängige Quelle tatsächlich geprüft?") },
          { h: x("Uncertainty", "Pasiguria", "Unsicherheit"), hint: x("what remains unknown? is the information stale or incomplete?", "çfarë mbetet e panjohur? a është informacioni i vjetruar ose i paplotë?", "was bleibt unbekannt? ist die Information veraltet oder unvollständig?") },
          { h: x("Safety and authority", "Siguria dhe autoriteti", "Sicherheit und Befugnis"), hint: x("may work proceed? who is authorised to decide?", "a mund të vazhdojë puna? kush ka autoritetin të vendosë?", "darf die Arbeit weitergehen? wer darf entscheiden?") },
          { h: x("Action and owner", "Veprimi dhe përgjegjësi", "Handlung und Verantwortlicher"), hint: x("what approved action is next, by whom, and by when?", "cili veprim i miratuar vjen më pas, nga kush, dhe deri kur?", "welche freigegebene Handlung folgt, durch wen, und bis wann?") },
          { h: x("Result / tell back", "Rezultati / trego", "Ergebnis / Rückmeldung"), hint: x("what changed? who receives the verified update?", "çfarë ndryshoi? kush e merr përditësimin e verifikuar?", "was hat sich geändert? wer erhält die geprüfte Aktualisierung?") },
        ] },
      ],
      note: x(
        "Original editorial tool, synthesising Bainbridge, Parasuraman et al., Lee and See and Goddard et al. If the cause is uncertain, write the next verification step rather than a conclusion; the tool named below keeps the same fields for a shift.",
        "Mjet origjinal editorial, që sintetizon Bainbridge, Parasuraman et al., Lee e See dhe Goddard et al. Nëse shkaku është i pasigurt, shkruaj hapin e radhës të verifikimit, jo një përfundim; mjeti i emërtuar më poshtë i mban të njëjtat fusha për një turn.",
        "Eigenes redaktionelles Werkzeug, das Bainbridge, Parasuraman et al., Lee und See und Goddard et al. zusammenführt. Ist die Ursache unsicher, den nächsten Prüfschritt notieren, keine Schlussfolgerung; das unten genannte Tool führt dieselben Felder für eine Schicht."),
      source: ["bainbridge-1983", "parasuraman-sheridan-wickens-2000", "lee-see-2004", "goddard-2012"],
    },
    {
      id: "closing",
      kicker: x("Closing essay", "Eseja e mbylljes", "Schlussessay"),
      title: [x("The system cannot", "Sistemi nuk mund", "Das System kann"), x("inherit the responsibility", "ta trashëgojë përgjegjësinë", "die Verantwortung nicht erben")],
      lead: x(
        "The future of operational management is not a contest between faster software and wiser people.",
        "E ardhmja e menaxhimit operacional nuk është garë mes programeve më të shpejta dhe njerëzve më të mençur.",
        "Die Zukunft der betrieblichen Führung ist kein Wettstreit zwischen schnellerer Software und klügeren Menschen."),
      blocks: [
        { type: "p", text: x(
          "A dashboard can reveal a pattern that no one standing beside a loading ramp could see. A route planner can calculate possibilities at a speed no dispatcher can match. A hotel system can preserve a consistent record across shifts. These are real advantages. The lesson of this volume is not to distrust them. It is to understand their limits precisely enough to use them well. An organisation begins to lose that precision when it treats a data field as a complete event, a red indicator as a diagnosis or a recommendation as a final instruction. It loses even more when the colleague who questions a result is treated as an obstacle instead of a possible source of evidence. The opposite error is equally real: local experience can be wrong, and “I know the area” cannot replace a verified rule. Good management has to hold both claims up to the same discipline of checking.",
          "Një panel mund të zbulojë një model që askush pranë rampës së ngarkimit nuk e sheh dot. Një planifikues rrugësh mund të llogarisë mundësi me një shpejtësi që asnjë dispeçer nuk e arrin. Një sistem hoteli mund të ruajë një regjistrim të njëtrajtshëm nëpër turne. Këto janë përparësi të vërteta. Mësimi i këtij vëllimi nuk është të mos u besojmë. Është t'i kuptojmë kufijtë e tyre me aq saktësi sa t'i përdorim mirë. Një organizatë nis ta humbasë këtë saktësi kur e trajton një fushë të dhënash si ngjarje të plotë, një tregues të kuq si diagnozë, ose një rekomandim si udhëzim përfundimtar. E humbet edhe më shumë kur kolegu që vë në pikëpyetje një rezultat trajtohet si pengesë, jo si burim i mundshëm prove. Gabimi i kundërt është po aq i vërtetë: përvoja lokale mund të jetë e gabuar, dhe “e njoh zonën” nuk e zëvendëson dot një rregull të verifikuar. Menaxhimi i mirë duhet t'i nënshtrojë të dyja pohimet të njëjtës disiplinë kontrolli.",
          "Ein Dashboard kann ein Muster zeigen, das niemand neben einer Laderampe sehen könnte. Ein Routenplaner kann Möglichkeiten in einem Tempo berechnen, mit dem kein Disponent mithält. Ein Hotelsystem kann einen einheitlichen Datensatz über Schichten hinweg bewahren. Das sind echte Vorteile. Die Lehre dieses Bandes ist nicht, ihnen zu misstrauen. Sie ist, ihre Grenzen genau genug zu verstehen, um sie gut zu nutzen. Eine Organisation beginnt diese Genauigkeit zu verlieren, wenn sie ein Datenfeld als vollständiges Ereignis, eine rote Anzeige als Diagnose oder eine Empfehlung als endgültige Anweisung behandelt. Sie verliert noch mehr, wenn der Kollege, der ein Ergebnis anzweifelt, als Hindernis statt als mögliche Belegquelle behandelt wird. Der umgekehrte Fehler ist ebenso real: Lokale Erfahrung kann irren, und „ich kenne die Gegend“ ersetzt keine geprüfte Regel. Gute Führung muss beide Behauptungen derselben Disziplin des Prüfens unterziehen.") },
        { type: "p", text: x(
          "Research offers a warning rather than a magic formula. Bainbridge showed that automation can reshape rather than eliminate human work. Endsley and Kiris demonstrated a form of lost situation awareness under particular experimental conditions. Reviews of automation bias reveal why trust, workload, training and explanation design matter. None of these papers measures the author's workplaces. They give us reasons to ask better questions there. The practical answer is not a dramatic “override”. It is a modest chain of responsibilities: preserve the signal, verify the condition, establish authority, make a proportionate decision and return the learning. The aim is to let technology perform what it does reliably, while ensuring people can recognise and address what remains outside its view.",
          "Kërkimi ofron një paralajmërim, jo një formulë magjike. Bainbridge tregoi se automatizimi mund ta riformësojë punën njerëzore, jo ta eliminojë. Endsley dhe Kiris treguan një formë të humbjes së pamjes së situatës në kushte të caktuara eksperimentale. Rishikimet e anshmërisë ndaj automatizimit zbulojnë pse kanë rëndësi besimi, ngarkesa e punës, trajnimi dhe dizajni i shpjegimeve. Asnjë nga këto punime nuk i mat vendet e punës së autorit. Ato na japin arsye të bëjmë pyetje më të mira atje. Përgjigjja praktike nuk është një “ndërhyrje” dramatike. Është një zinxhir modest përgjegjësish: ruaj sinjalin, verifiko kushtin, vërteto autoritetin, merr një vendim të përpjesëtuar dhe ktheje mësimin. Qëllimi është ta lëmë teknologjinë të bëjë atë që e bën me besueshmëri, duke u siguruar që njerëzit të dallojnë dhe të trajtojnë atë që mbetet jashtë pamjes së saj.",
          "Die Forschung bietet eine Warnung, keine Zauberformel. Bainbridge zeigte, dass Automatisierung menschliche Arbeit eher umformt als beseitigt. Endsley und Kiris wiesen eine Form verlorenen Lagebewusstseins unter bestimmten Versuchsbedingungen nach. Übersichten zu Automation Bias zeigen, warum Vertrauen, Arbeitslast, Schulung und die Gestaltung von Erklärungen zählen. Keine dieser Arbeiten misst die Betriebe des Autors. Sie geben uns Gründe, dort bessere Fragen zu stellen. Die praktische Antwort ist kein dramatischer „Override“. Sie ist eine bescheidene Kette von Verantwortlichkeiten: das Signal sichern, die Bedingung prüfen, die Befugnis klären, eine verhältnismäßige Entscheidung treffen und das Gelernte zurückgeben. Das Ziel ist, die Technik das tun zu lassen, was sie zuverlässig kann, und zugleich sicherzustellen, dass Menschen erkennen und bewältigen, was außerhalb ihres Blicks bleibt.") },
        { type: "callout", reading: true, text: x(
          "The system can recommend the decision. It cannot inherit the responsibility.",
          "Sistemi mund ta rekomandojë vendimin. Nuk mund ta trashëgojë përgjegjësinë.",
          "Das System kann die Entscheidung empfehlen. Die Verantwortung kann es nicht erben.") },
      ],
      note: x(
        "Editorial conclusion. No improvement is attributed to the author's workplaces without an independently documented measurement.",
        "Përfundim editorial. Asnjë përmirësim nuk u atribuohet vendeve të punës së autorit pa një matje të dokumentuar pavarësisht.",
        "Redaktionelles Fazit. Den Betrieben des Autors wird keine Verbesserung ohne unabhängig dokumentierte Messung zugeschrieben."),
    },
    {
      id: "method",
      kicker: x("Method", "Metoda", "Methode"),
      title: [x("Evidence before", "Prova para", "Belege vor"), x("conviction", "bindjes", "Überzeugung")],
      lead: x(
        "How the claims, comparisons, fictional scenes and proposed controls were handled.",
        "Si u trajtuan pohimet, krahasimet, skenat e sajuara dhe kontrollet e propozuara.",
        "Wie Aussagen, Vergleiche, fiktive Szenen und vorgeschlagene Kontrollen behandelt wurden."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("Research basis", "Baza kërkimore", "Forschungsbasis"), p: x("Seven peer-reviewed works or scientific reviews: 1983, 1995, 1997, 2000, 2004, 2012, online 2025.", "Shtatë punime të recensuara ose rishikime shkencore: 1983, 1995, 1997, 2000, 2004, 2012, në internet 2025.", "Sieben begutachtete Arbeiten oder wissenschaftliche Übersichten: 1983, 1995, 1997, 2000, 2004, 2012, online 2025.") },
          { h: x("Verified background", "Sfond i verifikuar", "Geprüfter Hintergrund"), p: x("Operational categories from last-mile, remote dispatch, hotel night auditing and the Front Desk Control knowledge project.", "Kategori operacionale nga milja e fundit, dispeçeria në distancë, auditimi i natës në hotel dhe projekti i njohurive Front Desk Control.", "Betriebliche Kategorien aus der letzten Meile, der Ferndisposition, dem Nachtaudit im Hotel und dem Wissensprojekt Front Desk Control.") },
          { h: x("Constructed scenes", "Skena të ndërtuara", "Konstruierte Szenen"), p: x("All invented events are explicitly labelled hypothetical, composite or illustrative.", "Të gjitha ngjarjet e shpikura janë etiketuar shprehimisht si hipotetike, të përbëra ose ilustruese.", "Alle erfundenen Ereignisse sind ausdrücklich als hypothetisch, zusammengesetzt oder illustrativ gekennzeichnet.") },
          { h: x("Proposed practice", "Praktikë e propozuar", "Vorgeschlagene Praxis"), p: x("No field protocol, alert threshold, pilot result or approval is claimed as tested in an employer's operation.", "Asnjë protokoll terreni, prag alarmi, rezultat piloti apo miratim nuk pretendohet si i provuar në operacionin e një punëdhënësi.", "Kein Feldprotokoll, keine Alarmschwelle, kein Pilotergebnis und keine Freigabe wird als im Betrieb eines Arbeitgebers getestet behauptet.") },
        ] },
        { type: "p", text: x(
          "Study types are not conflated. Bainbridge (1983) is a conceptual industrial automation paper. Endsley and Kiris (1995) report an experimental navigation task. Parasuraman and Riley (1997) and Lee and See (2004) offer interpretive frameworks; Parasuraman and colleagues (2000) classify automation functions. Goddard and colleagues (2012) include 74 studies after screening 13,821 records. Romeo and Conti reviewed 35 studies from January 2015 through April 2025; their article appeared online in 2025. Limits: the studies do not establish the rate of bad routing, false scans, weak training or AI error in the author's roles. The 100-case alert exercise is entirely synthetic. “Human override” is an editorial name for authorised review and correction, not a software feature or permission to bypass controls. Editorial rule: when evidence stops, the sentence must stop claiming.",
          "Llojet e studimeve nuk ngatërrohen. Bainbridge (1983) është punim konceptual për automatizimin industrial. Endsley dhe Kiris (1995) raportojnë një detyrë eksperimentale navigimi. Parasuraman dhe Riley (1997) dhe Lee dhe See (2004) ofrojnë korniza interpretuese; Parasuraman dhe kolegët (2000) klasifikojnë funksionet e automatizimit. Goddard dhe kolegët (2012) përfshijnë 74 studime pas shqyrtimit të 13.821 regjistrimeve. Romeo dhe Conti rishikuan 35 studime nga janari 2015 deri në prill 2025; artikulli i tyre doli në internet më 2025. Kufijtë: studimet nuk e vërtetojnë shkallën e rrugëve të gabuara, skanimeve të rreme, trajnimit të dobët apo gabimeve të AI në rolet e autorit. Ushtrimi me 100 raste alarmi është krejt sintetik. “Ndërhyrja njerëzore” është emër editorial për rishikimin dhe korrigjimin e autorizuar, jo funksion programi apo leje për t'i anashkaluar kontrollet. Rregulli editorial: kur mbaron prova, fjalia duhet të pushojë së pohuari.",
          "Studientypen werden nicht vermischt. Bainbridge (1983) ist ein konzeptioneller Aufsatz zur industriellen Automatisierung. Endsley und Kiris (1995) berichten eine experimentelle Navigationsaufgabe. Parasuraman und Riley (1997) sowie Lee und See (2004) bieten Deutungsrahmen; Parasuraman und Kollegen (2000) klassifizieren Automatisierungsfunktionen. Goddard und Kollegen (2012) schließen 74 Studien nach Sichtung von 13.821 Treffern ein. Romeo und Conti sichteten 35 Studien von Januar 2015 bis April 2025; ihr Artikel erschien 2025 online. Grenzen: Die Studien belegen nicht die Rate falscher Routen, falscher Scans, schwacher Schulung oder KI-Fehler in den Rollen des Autors. Die Alarmübung mit 100 Fällen ist vollständig synthetisch. „Menschlicher Eingriff“ ist ein redaktioneller Name für befugte Prüfung und Korrektur, keine Softwarefunktion und keine Erlaubnis, Kontrollen zu umgehen. Redaktionelle Regel: Wo die Belege enden, muss der Satz aufhören zu behaupten.") },
      ],
      note: x(
        "Every source is cited at its DOI on the next page; the two counts of the reviews were read in their abstracts. There are no names of guests, colleagues, employers or private systems.",
        "Çdo burim citohet me DOI-n e vet në faqen tjetër; dy numrat e rishikimeve u lexuan në abstraktet e tyre. Nuk ka emra mysafirësh, kolegësh, punëdhënësish apo sistemesh private.",
        "Jede Quelle ist auf der nächsten Seite mit ihrer DOI zitiert; die beiden Zahlen der Übersichten wurden in deren Abstracts gelesen. Es gibt keine Namen von Gästen, Kollegen, Arbeitgebern oder internen Systemen."),
      source: ["bainbridge-1983", "endsley-kiris-1995", "parasuraman-riley-1997", "parasuraman-sheridan-wickens-2000", "lee-see-2004", "goddard-2012", "romeo-conti-2025"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
