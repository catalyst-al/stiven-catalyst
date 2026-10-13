// Operational treatise, Volume 2: Value stream mapping, where the time goes. Block: Operations.
// Facts and their sources: docs/revista/traktati-operacional.md. The figures are those of Management Review No. 56
// (value stream mapping) and No. 40 (gemba), checked at the full texts (docs/revista/management-review-nr-56.md and
// nr-40.md); Womack's 2006 column was read at lean.org. Six chapters, each in the three layers: the living scene,
// the conceptual and scientific breakdown, the operating protocol for action. The scenes are constructed from the
// categories of work the author knows (hotel night audit, last-mile loading, a wholesale network) and say so; the
// worked example with 18 and 145 minutes is invented so the arithmetic can be checked.
import { x, pc } from "../common.js";

const hypothetical = x("Hypothetical example, with invented times", "Shembull hipotetik, me kohë të shpikura", "Hypothetisches Beispiel, mit erfundenen Zeiten");

export default {
  number: 2,
  numeral: "II",
  block: "operations",
  date: x("October 2026", "Tetor 2026", "Oktober 2026"),
  theme: [x("Value stream mapping:", "Harta e rrjedhës së vlerës:", "Wertstromanalyse:"), x("where the time goes", "ku shkon koha", "wohin die Zeit geht")],
  sub: x(
    "Six chapters following the work through night shifts, loading ramps and wholesale promises: field observation, the research on waiting and on leadership walks, the hidden information flow, and a protocol that closes the feedback loop.",
    "Gjashtë kapituj që e ndjekin punën nëpër turne nate, rampa ngarkimi dhe premtime me shumicë: vëzhgimi në terren, kërkimi për pritjen dhe për ecjet e drejtuesve, rrjedha e fshehur e informacionit, dhe një protokoll që e mbyll lakun e përgjigjes.",
    "Sechs Kapitel, die der Arbeit durch Nachtschichten, Laderampen und Großhandelsversprechen folgen: Beobachtung vor Ort, die Forschung zum Warten und zu Führungsrundgängen, der verborgene Informationsfluss und ein Protokoll, das die Rückmeldeschleife schließt."),
  seo: x(
    "Value stream mapping as an operational treatise: six chapters in three layers, from the 03:00 handover to Rother and Shook, a hospital map and a closure card.",
    "Harta e rrjedhës së vlerës si traktat operacional: gjashtë kapituj në tri shtresa, nga dorëzimi në 03:00 te Rother dhe Shook, një hartë spitali dhe një kartë.",
    "Wertstromanalyse als operativer Traktat: sechs Kapitel in drei Ebenen, von der Übergabe um 03:00 zu Rother und Shook, einer Klinikkarte und einer Karte."),
  feature: x(
    "Volume 2 asks what happens between the moment work becomes ready and the moment another person can use it. Six chapters, each in three layers: a night-shift handover, a missing bag at the ramp, a promise made before the warehouse could keep it, a visit that changes nothing, a parcel that waits 145 minutes for 18 minutes of work, and a 30-day response loop. The breakdown names the mechanism with Womack, Ohno, Mann, Rother and Shook and Martin and Osterling, tests it against an oncology day hospital, a review of 80 published maps and two studies of leadership walks, and each chapter ends with a protocol; the volume ends with a flow and closure card.",
    "Vëllimi 2 pyet çfarë ndodh mes çastit kur puna bëhet gati dhe çastit kur një person tjetër mund ta përdorë. Gjashtë kapituj, secili në tri shtresa: një dorëzim i turnit të natës, një çantë që mungon në rampë, një premtim i bërë para se magazina ta mbante, një vizitë që nuk ndryshon asgjë, një pako që pret 145 minuta për 18 minuta punë, dhe një lak përgjigjeje 30-ditor. Zbërthimi e emërton mekanizmin me Womack-un, Ohno-n, Mann-in, Rother-in dhe Shook-un, Martin-in dhe Osterling-un, e provon me një spital ditor onkologjik, një rishikim të 80 hartave të botuara dhe dy studime për ecjet e drejtuesve, dhe çdo kapitull mbyllet me një protokoll; vëllimi mbyllet me një kartë rrjedhe dhe mbylljeje.",
    "Band 2 fragt, was zwischen dem Moment geschieht, in dem Arbeit fertig wird, und dem Moment, in dem eine andere Person sie nutzen kann. Sechs Kapitel, jedes in drei Ebenen: eine Übergabe der Nachtschicht, eine fehlende Tasche an der Rampe, ein Versprechen, gegeben, bevor das Lager es halten konnte, ein Besuch, der nichts ändert, ein Paket, das 145 Minuten auf 18 Minuten Arbeit wartet, und eine 30-Tage-Rückmeldeschleife. Die Aufschlüsselung benennt den Mechanismus mit Womack, Ohno, Mann, Rother und Shook sowie Martin und Osterling, prüft ihn an einer onkologischen Tagesklinik, einem Review von 80 veröffentlichten Karten und zwei Studien zu Führungsrundgängen, und jedes Kapitel endet mit einem Protokoll; der Band mit einer Fluss- und Abschlusskarte."),
  figure: { n: x("38%", "38%", "38 %"), by: "Vidal-Carreras et al., 2022", t: x(
    "of a patient's day at an oncology day hospital in Spain was value-added time, at the median. Most of the rest was waiting.",
    "e ditës së një pacienti në një spital ditor onkologjik në Spanjë ishte kohë që shton vlerë, sipas medianës. Shumica e kohës tjetër ishte pritje.",
    "des Tages eines Patienten in einer onkologischen Tagesklinik in Spanien waren wertschöpfende Zeit, im Median. Der Rest war größtenteils Warten.") },
  teasers: [
    { page: "i-scene", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("03:00 and the illusion of the report", "03:00 dhe iluzioni i raportit", "03:00 und die Illusion des Berichts") },
    { page: "v-study", kicker: x("The evidence", "Prova", "Die Belege"),
      title: x("What the hospital map revealed", "Çfarë zbuloi harta e spitalit", "Was die Klinikkarte zeigte") },
    { page: "tool", kicker: x("Field tool", "Mjeti i terrenit", "Werkzeug vor Ort"),
      title: x("The flow and closure card", "Karta e rrjedhës dhe e mbylljes", "Die Fluss- und Abschlusskarte") },
  ],
  contract: [
    { h: x("Field", "Terreni", "Feld"), p: x("Only documented work categories, without invented personal incidents.", "Vetëm kategori pune të dokumentuara, pa ngjarje personale të shpikura.", "Nur dokumentierte Arbeitskategorien, ohne erfundene persönliche Vorfälle.") },
    { h: x("Evidence", "Prova", "Belege"), p: x("The study, population, year and limits named before applying it.", "Studimi, popullata, viti dhe kufijtë e emërtuar para se të zbatohet.", "Studie, Population, Jahr und Grenzen benannt, bevor sie angewandt wird.") },
    { h: x("Action", "Veprimi", "Handeln"), p: x("A clear owner, next step and return of information at the end.", "Një pronar i qartë, hapi i radhës dhe kthimi i informacionit në fund.", "Am Ende ein klarer Verantwortlicher, nächster Schritt und Rückmeldung.") },
  ],
  sources: ["vsm-rother-shook-1999", "vsm-lei-lexicon", "lei-gemba-walk", "womack-2006", "teresko-2004", "mann-2014", "vsm-martin-osterling-2014", "vsm-martin-2009", "vsm-vidal-carreras-2022", "vsm-marin-garcia-2021", "tucker-singer-2015", "sexton-2014"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      title: [x("Where the", "Ku pret", "Wo die Arbeit"), x("work waits", "puna", "wartet")],
      why: x(
        "A process may take minutes to perform and still take hours to deliver. The mystery is rarely inside the minutes. It lives in the queue, the hand-off and the information that failed to travel with the work.",
        "Një proces mund të zgjasë minuta për t'u kryer dhe prapë orë për t'u dorëzuar. Misteri rrallë është brenda minutave. Jeton te radha, te dorëzimi dhe te informacioni që nuk udhëtoi bashkë me punën.",
        "Ein Prozess kann Minuten dauern und trotzdem Stunden brauchen, bis er geliefert ist. Das Rätsel steckt selten in den Minuten. Es lebt in der Warteschlange, in der Übergabe und in der Information, die nicht mit der Arbeit gereist ist."),
      body: x(
        "This second volume follows a single question across three worlds: what happens between the moment work becomes ready and the moment another person can use it? It starts with an imagined night-shift handover, moves through the loading ramp and a wholesale order, tests the allure of executive visits against research, and finishes with a practical closure system. Where a scene is constructed, it says so; the verified background is narrower: last-mile loading, cross-shift hotel handovers and a network of wholesale partners. No individual, guest, employer or confidential system is identified.",
        "Ky vëllim i dytë e ndjek një pyetje të vetme nëpër tri botë: çfarë ndodh mes çastit kur puna bëhet gati dhe çastit kur një person tjetër mund ta përdorë? Nis me një dorëzim të imagjinuar të turnit të natës, kalon nëpër rampën e ngarkimit dhe një porosi me shumicë, e vë në provë joshjen e vizitave të drejtuesve me kërkimin, dhe mbyllet me një sistem praktik mbylljeje. Kur një skenë është e ndërtuar, e thotë; sfondi i verifikuar është më i ngushtë: ngarkimi në milin e fundit, dorëzimet mes turneve në hotel dhe një rrjet partnerësh me shumicë. Nuk identifikohet asnjë individ, mysafir, punëdhënës ose sistem konfidencial.",
        "Dieser zweite Band verfolgt eine einzige Frage durch drei Welten: Was geschieht zwischen dem Moment, in dem Arbeit fertig wird, und dem Moment, in dem eine andere Person sie nutzen kann? Er beginnt mit einer vorgestellten Übergabe der Nachtschicht, führt über die Laderampe und einen Großhandelsauftrag, prüft den Reiz von Chefbesuchen an der Forschung und endet mit einem praktischen System des Abschließens. Wo eine Szene konstruiert ist, steht es dabei; der geprüfte Hintergrund ist schmaler: Beladung auf der letzten Meile, Übergaben im Hotel und ein Netz von Großhandelspartnern. Keine Person, kein Gast, kein Arbeitgeber und kein vertrauliches System wird genannt."),
    },
    { id: "contents", type: "contents" },
    {
      id: "note",
      kicker: x("Research note", "Shënim kërkimor", "Forschungsnotiz"),
      title: [x("What evidence", "Çfarë lejohet", "Was Belege"), x("is allowed to say", "të thotë prova", "sagen dürfen")],
      lead: x(
        "The numerical cases in this volume come mostly from healthcare. That is a strength when used carefully: hospitals make waiting, coordination and handovers unusually visible. It is also a limit. One hospital is not a warehouse.",
        "Rastet me shifra në këtë vëllim vijnë kryesisht nga shëndetësia. Kjo është një forcë kur përdoret me kujdes: spitalet e bëjnë pritjen, koordinimin dhe dorëzimet jashtëzakonisht të dukshme. Është edhe një kufi. Një spital nuk është magazinë.",
        "Die Zahlenbeispiele dieses Bandes stammen überwiegend aus dem Gesundheitswesen. Das ist eine Stärke, wenn man sie sorgfältig nutzt: Kliniken machen Warten, Koordination und Übergaben ungewöhnlich sichtbar. Es ist auch eine Grenze. Ein Krankenhaus ist kein Lager."),
      blocks: [
        { type: "p", text: x(
          "One verified 2022 study reported a 38.12% median share of value-added time in the measured patient journey of one oncology day hospital. Two higher ratios were modelled as alternative future states: projections, not observed improvements. We use the example to examine the logic of queues, not to assert that warehouses show the same proportion. A randomised hospital programme studied by Tucker and Singer found that management walkarounds were not beneficial on average in the study's measured outcome, while ownership and active resolution went with better local results. A cross-sectional survey by Sexton and colleagues connected feedback with better safety-culture ratings and less reported burnout. Association is not proof of causation.",
          "Një studim i verifikuar i 2022-shit raportoi një pjesë mediane prej 38,12% kohe që shton vlerë në rrugëtimin e matur të pacientit në një spital ditor onkologjik. Dy raporte më të larta u modeluan si gjendje të ardhshme alternative: parashikime, jo përmirësime të vëzhguara. Shembullin e përdorim për të shqyrtuar logjikën e radhëve, jo për të pohuar se magazinat kanë të njëjtën përpjesë. Një program i randomizuar spitalor, i studiuar nga Tucker dhe Singer, gjeti se ecjet e menaxherëve nuk ishin mesatarisht të dobishme në rezultatin e matur të studimit, ndërsa pronësia dhe zgjidhja aktive shkonin me rezultate më të mira lokale. Një anketë në një moment të vetëm nga Sexton dhe kolegët e lidhi përgjigjen me vlerësime më të mira të kulturës së sigurisë dhe më pak rraskapitje të raportuar. Lidhja nuk është provë shkaku.",
          "Eine geprüfte Studie von 2022 berichtete einen Median von 38,12 % wertschöpfender Zeit im gemessenen Patientenweg einer onkologischen Tagesklinik. Zwei höhere Anteile wurden als alternative Soll-Zustände modelliert: Projektionen, keine beobachteten Verbesserungen. Wir nutzen das Beispiel, um die Logik von Warteschlangen zu untersuchen, nicht um zu behaupten, Lager zeigten dieselbe Proportion. Ein randomisiertes Klinikprogramm, untersucht von Tucker und Singer, fand, dass Führungsrundgänge im gemessenen Ergebnis der Studie im Schnitt nicht nützten, während Verantwortung und aktives Lösen mit besseren lokalen Ergebnissen einhergingen. Eine Querschnittsbefragung von Sexton und Kollegen verband Rückmeldung mit besserer Sicherheitskultur und weniger berichtetem Burnout. Zusammenhang ist kein Beweis für Ursache.") },
        { type: "cards", cols: 3, items: [
          { h: x("Observed", "E vëzhguar", "Beobachtet"), p: x("Published sample, definition, year, design, reported estimate.", "Mostër e botuar, përkufizim, vit, dizajn, vlerësim i raportuar.", "Veröffentlichte Stichprobe, Definition, Jahr, Design, berichtete Schätzung.") },
          { h: x("Transferred", "E transferuar", "Übertragen"), p: x("A management hypothesis that could be tested in another sector.", "Një hipotezë menaxhimi që mund të provohet në një sektor tjetër.", "Eine Führungshypothese, die sich in einer anderen Branche prüfen ließe.") },
          { h: x("Unproven", "E paprovuar", "Unbelegt"), p: x("A claim of impact in the editor's own workplaces without measurements.", "Një pretendim ndikimi në vendet e punës së redaktorit pa matje.", "Eine Wirkungsbehauptung für die Arbeitsplätze des Herausgebers ohne Messungen.") },
        ] },
      ],
      note: x(
        "Full references on the sources page; the three studies are read in their published versions.",
        "Referencat e plota te faqja e burimeve; tri studimet janë lexuar në versionet e tyre të botuara.",
        "Vollständige Angaben auf der Quellenseite; die drei Studien wurden in ihren veröffentlichten Fassungen gelesen."),
      source: ["vsm-vidal-carreras-2022", "tucker-singer-2015", "sexton-2014"],
    },

    // Chapter I. 03:00 and the illusion of the report
    {
      id: "ch-i", type: "chapter", numeral: "I",
      title: x("03:00 and the illusion of the report", "03:00 dhe iluzioni i raportit", "03:00 und die Illusion des Berichts"),
      pages: [
        {
          id: "i-scene", layer: "scene",
          title: [x("03:00 and", "03:00 dhe", "03:00 und"), x("the illusion", "iluzioni", "die Illusion")],
          lead: x(
            "The night desk is quiet in the story that follows. That quiet is a narrative device, not evidence that any particular hotel had a failed handover.",
            "Sporteli i natës është i qetë në historinë që vijon. Ajo qetësi është një mjet rrëfimi, jo provë se ndonjë hotel i caktuar pati një dorëzim të dështuar.",
            "Die Nachtrezeption ist ruhig in der Geschichte, die folgt. Diese Ruhe ist ein Erzählmittel, kein Beleg, dass irgendein bestimmtes Hotel eine gescheiterte Übergabe hatte."),
          blocks: [
            { type: "flag", text: x("Hypothetical scene, not a reported hotel incident", "Skenë hipotetike, jo ngjarje e raportuar hoteli", "Hypothetische Szene, kein gemeldeter Hotelvorfall") },
            { type: "p", text: x(
              "It is 03:00. A night auditor reads a brief note left by the earlier shift: a guest has reported a defect in the room. The case is marked for follow-up. The previous colleague has finished. The specialist team will not see the guest until later. Everyone has done something, and yet no one can say whether the guest will receive an answer. There is an entry in the log. There may be a message somewhere else. The guest has a memory of a promise. None of these alone is a completed remedy. The weak point is the interval between a problem being recorded and the next person having the information, authority and time to act.",
              "Është 03:00. Një auditor nate lexon një shënim të shkurtër të lënë nga turni i mëparshëm: një mysafir ka raportuar një defekt në dhomë. Rasti është shënuar për ndjekje. Kolegu i mëparshëm ka mbaruar. Ekipi i specializuar nuk do ta shohë mysafirin deri më vonë. Të gjithë kanë bërë diçka, e prapë askush nuk mund të thotë nëse mysafiri do të marrë përgjigje. Ka një regjistrim në ditar. Mund të ketë një mesazh diku tjetër. Mysafiri ka kujtimin e një premtimi. Asnjë nga këto vetëm nuk është zgjidhje e mbyllur. Pika e dobët është intervali mes regjistrimit të një problemi dhe çastit kur personi tjetër ka informacionin, autoritetin dhe kohën për të vepruar.",
              "Es ist 03:00. Ein Nachtauditor liest eine kurze Notiz der früheren Schicht: Ein Gast hat einen Mangel im Zimmer gemeldet. Der Fall ist zur Nachverfolgung markiert. Der vorige Kollege ist fertig. Das Fachteam sieht den Gast erst später. Alle haben etwas getan, und doch kann niemand sagen, ob der Gast eine Antwort bekommt. Es gibt einen Eintrag im Protokoll. Vielleicht eine Nachricht woanders. Der Gast erinnert sich an ein Versprechen. Nichts davon ist für sich eine abgeschlossene Abhilfe. Die schwache Stelle ist das Intervall zwischen dem Erfassen eines Problems und dem Moment, in dem die nächste Person Information, Befugnis und Zeit zum Handeln hat.") },
            { type: "p", text: x(
              "The story resembles ordinary categories of hotel work that can be discussed publicly: technical room issues, cleaning concerns, matters carried into the morning handover. The hour, the note, the dialogue and the outcome are fictional.",
              "Historia u ngjan kategorive të zakonshme të punës në hotel që mund të diskutohen publikisht: probleme teknike në dhoma, shqetësime pastrimi, çështje që kalojnë te dorëzimi i mëngjesit. Ora, shënimi, dialogu dhe rezultati janë të trilluara.",
              "Die Geschichte ähnelt gewöhnlichen Kategorien von Hotelarbeit, über die sich öffentlich sprechen lässt: technische Zimmerprobleme, Reinigungsanliegen, Dinge, die in die Morgenübergabe getragen werden. Stunde, Notiz, Dialog und Ausgang sind fiktiv.") },
            { type: "callout", reading: true, text: x(
              "A finished shift is not the same thing as finished work.",
              "Një turn i mbaruar nuk është e njëjta gjë si një punë e mbaruar.",
              "Eine beendete Schicht ist nicht dasselbe wie beendete Arbeit.") },
          ],
          note: x(
            "The work categories reflect the author's documented night-audit experience, without identifying properties, guests or confidential procedures.",
            "Kategoritë e punës pasqyrojnë përvojën e dokumentuar të autorit në auditimin e natës, pa identifikuar hotele, mysafirë ose procedura konfidenciale.",
            "Die Arbeitskategorien spiegeln die dokumentierte Nachtaudit-Erfahrung des Autors, ohne Häuser, Gäste oder vertrauliche Verfahren zu nennen."),
        },
        {
          id: "i-concept", layer: "concept",
          title: [x("A status is", "Një status", "Ein Status ist"), x("not a resolution", "nuk është zgjidhje", "keine Lösung")],
          lead: x(
            "A service process often gives each department its own definition of completion. Reception can finish registering a request; maintenance can complete a repair; housekeeping can complete a task. The guest experiences one result: was the problem dealt with, and did someone keep the promise?",
            "Një proces shërbimi shpesh i jep çdo departamenti përkufizimin e vet të përfundimit. Recepsioni mund ta mbyllë regjistrimin e një kërkese; mirëmbajtja mund ta përfundojë një riparim; pastrimi mund ta kryejë një detyrë. Mysafiri përjeton një rezultat të vetëm: a u trajtua problemi, dhe a e mbajti dikush premtimin?",
            "Ein Serviceprozess gibt oft jeder Abteilung ihre eigene Definition von Erledigung: Die Rezeption erfasst, die Technik repariert, das Housekeeping beendet eine Aufgabe. Der Gast erlebt ein einziges Ergebnis: Wurde das Problem behandelt, und hat jemand das Versprechen gehalten?"),
          blocks: [
            { type: "p", text: x(
              "This is the first analytical error to avoid when reading a dashboard. A green status may be true within the system that produced it and incomplete within the entire service. Shift work adds a less visible division: time. The people handing over and receiving a case may never be in the building together, so a note must carry enough context to preserve the decision already made. Womack's purpose, process, people lens moves attention from the vertical unit to the end-to-end outcome.",
              "Ky është gabimi i parë analitik që duhet shmangur kur lexon një panel. Një status i gjelbër mund të jetë i vërtetë brenda sistemit që e prodhoi dhe i paplotë brenda gjithë shërbimit. Puna me turne shton një ndarje më pak të dukshme: kohën. Njerëzit që dorëzojnë dhe që marrin një rast mund të mos jenë kurrë bashkë në ndërtesë, prandaj një shënim duhet të mbartë mjaft kontekst për ta ruajtur vendimin e marrë tashmë. Lentja qëllim, proces, njerëz e Womack-ut e zhvendos vëmendjen nga njësia vertikale te rezultati nga fillimi në fund.",
              "Das ist der erste analytische Fehler, den man beim Lesen eines Dashboards vermeiden muss. Ein grüner Status kann innerhalb des Systems, das ihn erzeugt hat, wahr sein und innerhalb des gesamten Service unvollständig. Schichtarbeit fügt eine weniger sichtbare Trennung hinzu: die Zeit. Die Menschen, die einen Fall übergeben und übernehmen, sind vielleicht nie gleichzeitig im Haus, also muss eine Notiz genug Kontext tragen, um die getroffene Entscheidung zu bewahren. Womacks Linse Zweck, Prozess, Menschen lenkt den Blick von der senkrechten Einheit auf das Ergebnis von Anfang bis Ende.") },
            { type: "cards", cols: 3, items: [
              { h: x("Purpose", "Qëllimi", "Zweck"), p: x("What does a good outcome mean to the customer, not merely to one team?", "Çfarë do të thotë rezultat i mirë për klientin, jo vetëm për një ekip?", "Was bedeutet ein gutes Ergebnis für den Kunden, nicht nur für ein Team?") },
              { h: x("Process", "Procesi", "Prozess"), p: x("What information and decision must travel from one shift to the next?", "Cili informacion dhe vendim duhet të udhëtojë nga një turn te tjetri?", "Welche Information und Entscheidung muss von einer Schicht zur nächsten reisen?") },
              { h: x("People", "Njerëzit", "Menschen"), p: x("Who accepts the open work, and what support can they reach?", "Kush e pranon punën e hapur, dhe çfarë mbështetjeje ka në dorë?", "Wer übernimmt die offene Arbeit, und welche Unterstützung erreicht sie?") },
            ] },
            { type: "cards", cols: 2, items: [
              { h: x("Weak handover", "Dorëzim i dobët", "Schwache Übergabe"), p: x("“Room issue reported.” No state, no owner, no next commitment.", "“Problem në dhomë, i raportuar.” Pa gjendje, pa pronar, pa angazhim të radhës.", "„Zimmerproblem gemeldet.“ Kein Zustand, kein Verantwortlicher, keine nächste Zusage.") },
              { h: x("Actionable handover", "Dorëzim i zbatueshëm", "Handlungsfähige Übergabe"), p: x("Issue, observed facts, action taken, next owner, next update.", "Problemi, faktet e vëzhguara, veprimi i bërë, pronari i radhës, përditësimi i radhës.", "Anliegen, beobachtete Fakten, getroffene Maßnahme, nächster Verantwortlicher, nächstes Update.") },
            ] },
          ],
          note: x(
            "Womack's framework from his 2006 column and the Lean Enterprise Institute's lexicon; the hotel application is editorial.",
            "Korniza e Womack-ut nga kolona e tij e 2006 dhe fjalori i Lean Enterprise Institute; zbatimi në hotel është editorial.",
            "Womacks Rahmen aus seiner Kolumne von 2006 und dem Lexikon des Lean Enterprise Institute; die Anwendung im Hotel ist redaktionell."),
          source: ["womack-2006", "lei-gemba-walk"],
        },
        {
          id: "i-protocol", layer: "protocol", more: "what-a-night-auditor-learns",
          title: [x("Protocol:", "Protokolli:", "Protokoll:"), x("close the loop", "mbyll lakun", "die Schleife schließen")],
          lead: x(
            "A five-field handover that survives the morning. Not every issue can be solved at night; the problem begins when an unresolved issue is disguised as complete.",
            "Një dorëzim me pesë fusha që i mbijeton mëngjesit. Jo çdo problem mund të zgjidhet natën; problemi nis kur një çështje e pazgjidhur maskohet si e mbyllur.",
            "Eine Übergabe mit fünf Feldern, die den Morgen übersteht. Nicht jedes Problem lässt sich nachts lösen; das Problem beginnt, wenn ein ungelöstes Anliegen als erledigt getarnt wird."),
          blocks: [
            { type: "rows", compact: true, items: [
              { h: x("What happened?", "Çfarë ndodhi?", "Was ist geschehen?"), p: x("Record the observation, not an assumption about the person responsible.", "Shëno vëzhgimin, jo një supozim për personin përgjegjës.", "Die Beobachtung, nicht eine Annahme über die verantwortliche Person.") },
              { h: x("What was verified?", "Çfarë u verifikua?", "Was wurde geprüft?"), p: x("Distinguish the reporter's account from checks actually performed.", "Ndaje rrëfimin e atij që raportoi nga kontrollet e bëra vërtet.", "Den Bericht des Meldenden von tatsächlich durchgeführten Prüfungen trennen.") },
              { h: x("What action was taken?", "Çfarë veprimi u bë?", "Welche Maßnahme wurde getroffen?"), p: x("Only the real action, not the hoped-for outcome.", "Vetëm veprimi i vërtetë, jo rezultati i shpresuar.", "Nur die wirkliche Maßnahme, nicht das erhoffte Ergebnis.") },
              { h: x("Who owns the remainder?", "Kush e ka pjesën e mbetur?", "Wer verantwortet den Rest?"), p: x("A responsible role and the channel used for the transfer.", "Një rol përgjegjës dhe kanali i përdorur për kalimin.", "Eine verantwortliche Rolle und der Kanal der Übergabe.") },
              { h: x("When will the receiver respond?", "Kur do të përgjigjet marrësi?", "Wann antwortet der Empfänger?"), p: x("The next review or update commitment.", "Rishikimi i radhës ose angazhimi për përditësim.", "Die nächste Prüfung oder Zusage für ein Update.") },
            ] },
            { type: "p", text: x(
              "A manager can audit the quality of this handover without reading private guest details: sample anonymous records and ask whether the next shift could act without calling the previous shift for basic facts. If not, the handover is incomplete even if every field is filled. The remedy is a smaller, clearer record of what remains open.",
              "Një menaxher mund ta auditojë cilësinë e këtij dorëzimi pa lexuar të dhëna private të mysafirëve: merr një mostër regjistrimesh anonime dhe pyet nëse turni tjetër mund të vepronte pa i telefonuar turnit të mëparshëm për fakte bazë. Nëse jo, dorëzimi është i paplotë edhe nëse çdo fushë është e mbushur. Ilaçi është një regjistrim më i vogël dhe më i qartë i asaj që mbetet e hapur.",
              "Die Qualität dieser Übergabe lässt sich prüfen, ohne private Gastdaten zu lesen: anonyme Einträge ansehen und fragen, ob die nächste Schicht handeln könnte, ohne die vorige anzurufen. Wenn nicht, ist die Übergabe unvollständig, auch wenn jedes Feld ausgefüllt ist. Die Abhilfe ist eine kleinere, klarere Aufzeichnung dessen, was offen bleibt.") },
            { type: "callout", reading: true, text: x(
              "The handover is complete when the next person can work, not when the first person presses Send.",
              "Dorëzimi është i plotë kur personi tjetër mund të punojë, jo kur i pari shtyp Dërgo.",
              "Die Übergabe ist vollständig, wenn die nächste Person arbeiten kann, nicht, wenn die erste auf Senden drückt.") },
          ],
          note: x(
            "Practice proposed by the editors, after Womack's value-stream lens; not a procedure certified for a named hotel. The site's Shift Handover tool carries the same fields.",
            "Praktikë e propozuar nga redaksia, sipas lentes së rrjedhës së vlerës të Womack-ut; jo një procedurë e certifikuar për një hotel të caktuar. Mjeti Shift Handover i faqes i mban të njëjtat fusha.",
            "Eine Praxis, die die Redaktion vorschlägt, nach Womacks Wertstrom-Linse; kein für ein bestimmtes Hotel zertifiziertes Verfahren. Das Werkzeug Shift Handover der Seite führt dieselben Felder."),
          source: ["womack-2006"],
        },
      ],
    },

    // Chapter II. Ohno's circle at the loading ramp
    {
      id: "ch-ii", type: "chapter", numeral: "II",
      title: x("Ohno's circle at the loading ramp", "Rrethi i Ohno-s në rampën e ngarkimit", "Ohnos Kreis an der Laderampe"),
      pages: [
        {
          id: "ii-scene", layer: "scene", more: "where-part-of-the-order-goes-missing",
          title: [x("The circle", "Rrethi", "Der Kreis"), x("at the ramp", "në rampë", "an der Rampe")],
          lead: x(
            "A last-mile operation can put the apparent owner of a delay at the very end of a chain that began before the driver arrived.",
            "Një operacion i milit të fundit mund ta vërë pronarin e dukshëm të një vonese në fund të një zinxhiri që nisi para se të mbërrinte shoferi.",
            "Ein Betrieb auf der letzten Meile kann den scheinbaren Verursacher einer Verspätung ans Ende einer Kette stellen, die begann, bevor der Fahrer eintraf."),
          blocks: [
            { type: "flag", text: x("Hypothetical composite, grounded in real work categories", "Kompozim hipotetik, i bazuar në kategori të vërteta pune", "Hypothetische Zusammensetzung, gestützt auf echte Arbeitskategorien") },
            { type: "p", text: x(
              "A driver is expected to leave the loading area. The route is ready on paper. One bag cannot be found. A trolley nearby holds items that must be checked again. Minutes pass. On the dashboard, the departure grows later. At the loading point the visible work is not driving at all; it is searching, checking, clarifying and waiting for a decision.",
              "Një shofer pritet të largohet nga zona e ngarkimit. Rruga është gati në letër. Një çantë nuk gjendet. Një karrocë aty pranë mban artikuj që duhen kontrolluar sërish. Kalojnë minuta. Në panel, nisja bëhet gjithnjë e më e vonë. Te pika e ngarkimit puna e dukshme nuk është fare ngarja; është kërkimi, kontrolli, sqarimi dhe pritja e një vendimi.",
              "Ein Fahrer soll den Ladebereich verlassen. Die Tour ist auf dem Papier fertig. Eine Tasche ist nicht zu finden. Ein Wagen daneben enthält Artikel, die noch einmal geprüft werden müssen. Minuten vergehen. Auf dem Dashboard wird die Abfahrt später. Am Ladepunkt ist die sichtbare Arbeit gar kein Fahren; sie ist Suchen, Prüfen, Klären und Warten auf eine Entscheidung.") },
            { type: "p", text: x(
              "Missing bags, mixed trolleys and loading discipline were real categories of work in the author's last-mile experience. The particular driver, clock time, sequence and root cause in this scene are invented. The tempting managerial response is immediate: demand that the driver leave faster. But if the load is incomplete, more urgency only moves the problem downstream. The useful question is not “who is late?” but “which condition made the agreed next step impossible?”",
              "Çantat që mungojnë, karrocat e përziera dhe disiplina e ngarkimit ishin kategori të vërteta pune në përvojën e autorit në milin e fundit. Shoferi i caktuar, ora, radha dhe shkaku rrënjësor në këtë skenë janë të shpikura. Përgjigjja joshëse e menaxherit është e menjëhershme: kërko që shoferi të niset më shpejt. Por nëse ngarkesa është e paplotë, më shumë nxitim vetëm e zhvendos problemin poshtë rrjedhës. Pyetja e dobishme nuk është “kush vonohet?”, por “cili kusht e bëri të pamundur hapin e radhës të dakorduar?”",
              "Fehlende Taschen, gemischte Wagen und Ladedisziplin waren echte Arbeitskategorien in der Last-Mile-Erfahrung des Autors. Der konkrete Fahrer, die Uhrzeit, die Abfolge und die Ursache in dieser Szene sind erfunden. Die verlockende Reaktion der Führung kommt sofort: Der Fahrer soll schneller losfahren. Aber wenn die Ladung unvollständig ist, schiebt mehr Druck das Problem nur stromabwärts. Die nützliche Frage ist nicht „Wer ist zu spät?“, sondern „Welche Bedingung hat den vereinbarten nächsten Schritt unmöglich gemacht?“") },
            { type: "callout", reading: true, text: x(
              "The point at which the delay appears is not necessarily the point at which it began.",
              "Pika ku shfaqet vonesa nuk është doemos pika ku ajo nisi.",
              "Der Punkt, an dem die Verspätung erscheint, ist nicht unbedingt der Punkt, an dem sie begann.") },
          ],
          note: x(
            "No unpublished figures or person-identifying details from the author's employers are used. The essay named below tells the same shape from the dispatch desk.",
            "Nuk përdoren shifra të pabotuara ose hollësi që identifikojnë persona nga punëdhënësit e autorit. Eseja më poshtë e tregon të njëjtën formë nga tavolina e dispeçerisë.",
            "Keine unveröffentlichten Zahlen oder personenbezogenen Details aus den Betrieben des Autors werden verwendet. Der unten genannte Essay erzählt dieselbe Form vom Dispositionstisch."),
        },
        {
          id: "ii-concept", layer: "concept",
          title: [x("Ohno and the", "Ohno dhe", "Ohno und die"), x("discipline of seeing", "disiplina e të parit", "Disziplin des Sehens")],
          lead: x(
            "The story of Taiichi Ohno's circle is memorable because the student must watch before being permitted to explain. It is a teaching account transmitted by people who worked with Ohno, not a controlled experiment. Its discipline still matters.",
            "Historia e rrethit të Taiichi Ohno-s mbahet mend sepse nxënësi duhet të shikojë para se t'i lejohet të shpjegojë. Është një rrëfim mësimi i përcjellë nga njerëz që punuan me Ohno-n, jo një eksperiment i kontrolluar. Disiplina e tij prapë ka rëndësi.",
            "Die Geschichte von Taiichi Ohnos Kreis bleibt im Gedächtnis, weil der Schüler beobachten muss, bevor er erklären darf. Sie ist eine Lehrerzählung, überliefert von Menschen, die mit Ohno gearbeitet haben, kein kontrolliertes Experiment. Ihre Disziplin zählt trotzdem."),
          blocks: [
            { type: "cards", cols: 3, items: [
              { h: x("See", "Shiko", "Sehen"), p: x("Describe an observable sequence rather than an inferred motive.", "Përshkruaj një radhë të vëzhgueshme, jo një motiv të supozuar.", "Eine beobachtbare Abfolge beschreiben, kein unterstelltes Motiv.") },
              { h: x("Ask", "Pyet", "Fragen"), p: x("Ask the worker what the standard requires and where reality differs.", "Pyete punonjësin çfarë kërkon standardi dhe ku ndryshon realiteti.", "Die Arbeitskraft fragen, was der Standard verlangt und wo die Wirklichkeit abweicht.") },
              { h: x("Check", "Kontrollo", "Prüfen"), p: x("Compare an explanation with timing, status and the work itself.", "Krahasoje shpjegimin me kohën, statusin dhe vetë punën.", "Eine Erklärung mit Zeiten, Status und der Arbeit selbst vergleichen.") },
            ] },
            { type: "p", text: x(
              "A delivery system carries two objects. The physical object is the order: items, bags, containers, the vehicle. The informational object is the instruction: which order belongs where, what has been checked, what is missing, what the next worker should do. Transport is possible only when both flows make sense to the receiving person. When they separate, the employee at the end becomes an improvised information system: waiting, calling, searching, inventing a workaround. Rother and Shook's Learning to See made drawing both streams together, from a current state to a future state with a plan, a practical method. Drawing only the material boxes loses much of the point.",
              "Një sistem dërgese mbart dy objekte. Objekti fizik është porosia: artikujt, çantat, kontejnerët, automjeti. Objekti informativ është udhëzimi: cila porosi ku shkon, çfarë është kontrolluar, çfarë mungon, çfarë duhet të bëjë punonjësi tjetër. Transporti është i mundur vetëm kur të dyja rrjedhat kanë kuptim për personin që i merr. Kur ndahen, punonjësi në fund bëhet një sistem informacioni i improvizuar: pret, telefonon, kërkon, shpik një rrugë anësore. Learning to See i Rother-it dhe Shook-ut e bëri metodë praktike vizatimin e të dyja rrjedhave bashkë, nga gjendja e sotme te një gjendje e ardhshme me një plan. Të vizatosh vetëm kutitë e materialit humb një pjesë të madhe të kuptimit.",
              "Ein Liefersystem trägt zwei Objekte. Das physische Objekt ist der Auftrag: Artikel, Taschen, Behälter, das Fahrzeug. Das informationelle Objekt ist die Anweisung: welcher Auftrag wohin gehört, was geprüft wurde, was fehlt, was die nächste Kraft tun soll. Transport ist nur möglich, wenn beide Flüsse für die empfangende Person Sinn ergeben. Trennen sie sich, wird die Kraft am Ende zum improvisierten Informationssystem: warten, anrufen, suchen, einen Umweg erfinden. Rother und Shooks Learning to See machte daraus eine praktische Methode: beide Ströme gemeinsam zeichnen, vom Ist-Zustand zu einem Soll-Zustand mit Plan. Wer nur die Materialkästen zeichnet, verliert einen großen Teil des Sinns.") },
            { type: "chain", items: [
              { h: x("Prepare", "Përgatit", "Vorbereiten"), p: x("Right units?", "Njësitë e duhura?", "Richtige Einheiten?") },
              { h: x("Hand over", "Dorëzo", "Übergeben"), p: x("Clear status?", "Status i qartë?", "Klarer Status?") },
              { h: x("Load", "Ngarko", "Laden"), p: x("Complete scan?", "Skanim i plotë?", "Vollständiger Scan?") },
              { h: x("Depart", "Nisu", "Abfahren"), p: x("Ready to go?", "Gati për nisje?", "Bereit zur Abfahrt?") },
            ] },
          ],
          note: x(
            "Ohno's circle as told by Teruyuki Minoura (IndustryWeek, 2004); gemba and genchi genbutsu from the Lean Enterprise Institute; Rother & Shook via the excerpts the LEI publishes. The diagram is editorial and generic.",
            "Rrethi i Ohno-s siç e tregon Teruyuki Minoura (IndustryWeek, 2004); gemba dhe genchi genbutsu nga Lean Enterprise Institute; Rother & Shook përmes pjesëve që boton LEI. Diagrami është editorial dhe i përgjithshëm.",
            "Ohnos Kreis, wie Teruyuki Minoura ihn erzählt (IndustryWeek, 2004); Gemba und Genchi Genbutsu vom Lean Enterprise Institute; Rother & Shook über die vom LEI veröffentlichten Auszüge. Das Diagramm ist redaktionell und generisch."),
          source: ["teresko-2004", "lei-gemba-walk", "vsm-rother-shook-1999"],
        },
        {
          id: "ii-protocol", layer: "protocol",
          title: [x("Four questions", "Katër pyetje", "Vier Fragen"), x("at the loading point", "te pika e ngarkimit", "am Ladepunkt")],
          lead: x(
            "David Mann frames the gemba visit as a repeatable part of leader standard work rather than an executive tour. His four questions shift attention away from performance theatre and towards conditions a responsible manager can investigate.",
            "David Mann e sheh vizitën në gemba si pjesë të përsëritshme të punës standarde të drejtuesit, jo si shëtitje drejtuesi. Katër pyetjet e tij e zhvendosin vëmendjen nga teatri i performancës te kushtet që një menaxher përgjegjës mund t'i hetojë.",
            "David Mann versteht den Gemba-Besuch als wiederholbaren Teil der Standardarbeit einer Führungskraft, nicht als Chefbesichtigung. Seine vier Fragen lenken den Blick weg vom Leistungstheater hin zu Bedingungen, die eine verantwortliche Führungskraft untersuchen kann."),
          blocks: [
            { type: "steps", items: [
              { h: x("Show me the standard process.", "Më trego procesin standard.", "Zeigen Sie mir den Standardprozess."), p: x("How an order becomes ready, not just how fast a vehicle leaves.", "Si bëhet gati një porosi, jo vetëm sa shpejt niset një automjet.", "Wie ein Auftrag fertig wird, nicht nur, wie schnell das Fahrzeug abfährt.") },
              { h: x("How can we tell it is working?", "Si e kuptojmë që funksionon?", "Woran erkennen wir, dass er funktioniert?"), p: x("What signal confirms completeness before the scan?", "Cili sinjal e konfirmon plotësinë para skanimit?", "Welches Signal bestätigt die Vollständigkeit vor dem Scan?") },
              { h: x("What happens when it is not?", "Çfarë ndodh kur nuk funksionon?", "Was geschieht, wenn nicht?"), p: x("What a worker does when a bag is absent, in their own words.", "Çfarë bën një punonjës kur mungon një çantë, me fjalët e veta.", "Was eine Arbeitskraft tut, wenn eine Tasche fehlt, in ihren Worten.") },
              { h: x("Who is working on improving it?", "Kush po punon për ta përmirësuar?", "Wer arbeitet daran, ihn zu verbessern?"), p: x("Who is authorised to alter the upstream condition that causes rechecking.", "Kush është i autorizuar ta ndryshojë kushtin më lart në rrjedhë që shkakton rikontrollin.", "Wer die vorgelagerte Bedingung ändern darf, die das Nachprüfen verursacht.") },
            ] },
            { type: "p", text: x(
              "An informative gemba walk ends with a traceable question or decision. If no one owns the discovered impediment, the visit has produced a description, not an improvement. Ohno's circle is not permission to stand silently while a safety risk continues: immediate harm requires immediate intervention. For everything else, the rule is to learn enough before deciding.",
              "Një ecje informuese në gemba mbyllet me një pyetje ose vendim që mund të gjurmohet. Nëse askush nuk e merr përsipër pengesën e zbuluar, vizita ka prodhuar një përshkrim, jo një përmirësim. Rrethi i Ohno-s nuk është leje për të qëndruar në heshtje ndërsa vazhdon një rrezik sigurie: dëmi i menjëhershëm kërkon ndërhyrje të menjëhershme. Për gjithçka tjetër, rregulli është të mësosh mjaftueshëm para se të vendosësh.",
              "Ein aufschlussreicher Gemba-Rundgang endet mit einer nachvollziehbaren Frage oder Entscheidung. Verantwortet niemand das entdeckte Hindernis, hat der Besuch eine Beschreibung erzeugt, keine Verbesserung. Ohnos Kreis ist keine Erlaubnis, schweigend dazustehen, während ein Sicherheitsrisiko weiterläuft: Unmittelbare Gefahr verlangt unmittelbares Eingreifen. Für alles andere gilt: genug lernen, bevor man entscheidet.") },
            { type: "callout", reading: true, text: x(
              "Presence provides access to evidence. Evidence still has to be collected, owned and acted on.",
              "Prania jep qasje te prova. Prova prapë duhet mbledhur, marrë në pronësi dhe vënë në veprim.",
              "Anwesenheit verschafft Zugang zu Belegen. Belege müssen trotzdem gesammelt, verantwortet und umgesetzt werden.") },
          ],
          note: x(
            "Mann's questions from a 2014 interview, paraphrased; the loading-point hints are editorial. Anonymised notes about the process are enough: a useful observation needs no employee names.",
            "Pyetjet e Mann-it nga një intervistë e 2014, të parafrazuara; shënimet për pikën e ngarkimit janë editoriale. Shënime anonime për procesin mjaftojnë: një vëzhgim i dobishëm nuk ka nevojë për emra punonjësish.",
            "Manns Fragen aus einem Interview von 2014, paraphrasiert; die Hinweise zum Ladepunkt sind redaktionell. Anonymisierte Notizen zum Prozess reichen: Eine nützliche Beobachtung braucht keine Namen."),
          source: ["mann-2014", "teresko-2004"],
        },
      ],
    },

    // Chapter III. The promise and the warehouse
    {
      id: "ch-iii", type: "chapter", numeral: "III",
      title: x("The promise and the warehouse", "Premtimi dhe magazina", "Das Versprechen und das Lager"),
      pages: [
        {
          id: "iii-scene", layer: "scene", more: "61-resellers",
          title: [x("The promise", "Premtimi", "Das Versprechen"), x("and the warehouse", "dhe magazina", "und das Lager")],
          lead: x(
            "A sale is often made in a conversation. Fulfilment is made across a chain of commitments that the salesperson may not control.",
            "Një shitje shpesh bëhet në një bisedë. Përmbushja bëhet përmes një zinxhiri angazhimesh që shitësi mund të mos e kontrollojë.",
            "Ein Verkauf wird oft in einem Gespräch gemacht. Die Erfüllung entsteht über eine Kette von Zusagen, die der Verkäufer vielleicht nicht kontrolliert."),
          blocks: [
            { type: "flag", text: x("Hypothetical wholesale example, not a claimed incident", "Shembull hipotetik shitjeje me shumicë, jo ngjarje e pretenduar", "Hypothetisches Großhandelsbeispiel, kein behaupteter Vorfall") },
            { type: "p", text: x(
              "An account manager confirms an urgent order to an independent reseller. The customer assumes delivery can follow immediately. Only later does the team learn that the required stock needs verification and the warehouse is already processing several commitments. No one has lied. The problem is a promise made before the capacity behind it was visible.",
              "Një menaxher llogarie i konfirmon një porosi urgjente një rishitësi të pavarur. Klienti supozon se dorëzimi mund të vijë menjëherë. Vetëm më vonë ekipi mëson se stoku i kërkuar ka nevojë për verifikim dhe magazina po përpunon tashmë disa angazhime. Askush nuk ka gënjyer. Problemi është një premtim i bërë para se kapaciteti pas tij të ishte i dukshëm.",
              "Ein Kundenbetreuer bestätigt einem unabhängigen Wiederverkäufer einen dringenden Auftrag. Der Kunde nimmt an, die Lieferung könne sofort folgen. Erst später erfährt das Team, dass der benötigte Bestand geprüft werden muss und das Lager bereits mehrere Zusagen abarbeitet. Niemand hat gelogen. Das Problem ist ein Versprechen, das gemacht wurde, bevor die Kapazität dahinter sichtbar war.") },
            { type: "p", text: x(
              "The author previously managed a wholesale network of 61 active resellers in Albania and worked across sales, warehousing and financial coordination. These are real elements of that background; this particular rushed promise, conversation and delay are not documented personal events. A wholesale partner is not an employee: the supplier cannot issue an instruction and assume the partner will reorganise its business around it. Reliability has to be earned at the interface: what was promised, what was confirmed, what changed and who will communicate the new reality.",
              "Autori ka drejtuar më parë një rrjet me shumicë me 61 rishitës aktivë në Shqipëri dhe ka punuar në shitje, magazinim dhe koordinim financiar. Këto janë elemente të vërteta të atij sfondi; ky premtim i nxituar, kjo bisedë dhe kjo vonesë nuk janë ngjarje personale të dokumentuara. Një partner me shumicë nuk është punonjës: furnitori nuk mund të lëshojë një udhëzim dhe të supozojë se partneri do ta riorganizojë biznesin e vet rreth tij. Besueshmëria duhet fituar te ndërfaqja: çfarë u premtua, çfarë u konfirmua, çfarë ndryshoi dhe kush do ta komunikojë realitetin e ri.",
              "Der Autor führte früher ein Großhandelsnetz mit 61 aktiven Wiederverkäufern in Albanien und arbeitete über Vertrieb, Lager und Finanzkoordination hinweg. Das sind echte Elemente dieses Hintergrunds; dieses konkrete überhastete Versprechen, das Gespräch und die Verzögerung sind keine dokumentierten persönlichen Ereignisse. Ein Großhandelspartner ist kein Angestellter: Der Lieferant kann keine Anweisung erteilen und annehmen, der Partner werde sein Geschäft darum herum umbauen. Verlässlichkeit muss an der Schnittstelle verdient werden: was versprochen, was bestätigt, was geändert wurde und wer die neue Wirklichkeit mitteilt.") },
            { type: "callout", reading: true, text: x(
              "The sale may be recorded today. Trust is tested when the promise meets capacity.",
              "Shitja mund të regjistrohet sot. Besimi vihet në provë kur premtimi takon kapacitetin.",
              "Der Verkauf wird vielleicht heute verbucht. Das Vertrauen wird geprüft, wenn das Versprechen auf die Kapazität trifft.") },
          ],
          note: x(
            "The network size is background supplied by the author, not a research sample; no order-level dataset from that role is available for this publication. The essay named below tells that story.",
            "Madhësia e rrjetit është sfond i dhënë nga autori, jo mostër kërkimore; për këtë botim nuk ka asnjë bazë të dhënash në nivel porosie nga ai rol. Eseja më poshtë e tregon atë histori.",
            "Die Größe des Netzes ist vom Autor gelieferter Hintergrund, keine Forschungsstichprobe; für diese Veröffentlichung liegt kein Datensatz auf Auftragsebene aus jener Rolle vor. Der unten genannte Essay erzählt diese Geschichte."),
        },
        {
          id: "iii-concept", layer: "concept",
          title: [x("Horizontal value,", "Vlera horizontale,", "Waagerechter Wert,"), x("vertical departments", "departamente vertikale", "senkrechte Abteilungen")],
          lead: x(
            "A company is often managed vertically: sales objectives, preparation and accuracy objectives, departure and service targets. Each dashboard may be fair inside its own remit. The customer receives one horizontal experience, and it can fail between the dashboards.",
            "Një kompani shpesh menaxhohet vertikalisht: objektiva shitjesh, objektiva përgatitjeje dhe saktësie, objektiva nisjeje dhe shërbimi. Çdo panel mund të jetë i drejtë brenda fushës së vet. Klienti merr një përvojë të vetme horizontale, dhe ajo mund të dështojë mes paneleve.",
            "Ein Unternehmen wird oft senkrecht geführt: Verkaufsziele, Vorbereitungs- und Genauigkeitsziele, Abfahrts- und Serviceziele. Jedes Dashboard kann in seinem Bereich fair sein. Der Kunde erhält eine waagerechte Erfahrung, und sie kann zwischen den Dashboards scheitern."),
          blocks: [
            { type: "cards", cols: 2, items: [
              { h: x("Local success", "Sukses lokal", "Lokaler Erfolg"), p: x("Order accepted, list completed, vehicle assigned.", "Porosia e pranuar, lista e plotësuar, automjeti i caktuar.", "Auftrag angenommen, Liste abgearbeitet, Fahrzeug zugeteilt.") },
              { h: x("Customer success", "Sukses për klientin", "Kundenerfolg"), p: x("Correct product delivered, in the promised condition, with reliable updates.", "Produkti i saktë i dorëzuar, në gjendjen e premtuar, me përditësime të besueshme.", "Richtiges Produkt geliefert, im versprochenen Zustand, mit verlässlichen Updates.") },
            ] },
            { type: "p", text: x(
              "Womack's three questions apply to the whole chain: fulfil the order in the condition and time the partner can rely on; confirm availability, prepare, hand over, transport and update; agree on roles, escalation and exceptions across all units. Someone must have authority to ask whether the total promise remains credible when each department takes a locally reasonable action; Rother and Shook call that person the value-stream manager. Design does not erase individual responsibility: a knowingly false promise or a skipped safety step still requires fair investigation. The point is to distinguish a defect in the system from a decision made against a clear standard.",
              "Tri pyetjet e Womack-ut vlejnë për gjithë zinxhirin: përmbush porosinë në gjendjen dhe kohën që partneri mund t'i besojë; konfirmo disponueshmërinë, përgatit, dorëzo, transporto dhe përditëso; bini dakord për rolet, eskalimin dhe përjashtimet në të gjitha njësitë. Dikush duhet të ketë autoritetin të pyesë nëse premtimi i plotë mbetet i besueshëm kur çdo departament ndërmerr një veprim lokalisht të arsyeshëm; Rother-i dhe Shook-u e quajnë këtë person menaxherin e rrjedhës së vlerës. Dizajni nuk e fshin përgjegjësinë individuale: një premtim i rremë me dashje ose një hap sigurie i kapërcyer prapë kërkojnë hetim të drejtë. Çështja është të dallohet një defekt i sistemit nga një vendim i marrë kundër një standardi të qartë.",
              "Womacks drei Fragen gelten für die ganze Kette: den Auftrag in dem Zustand und der Zeit erfüllen, auf die sich der Partner verlassen kann; Verfügbarkeit bestätigen, vorbereiten, übergeben, transportieren und informieren; Rollen, Eskalation und Ausnahmen über alle Einheiten vereinbaren. Jemand muss die Befugnis haben zu fragen, ob das Gesamtversprechen glaubwürdig bleibt, wenn jede Abteilung eine lokal vernünftige Handlung setzt; Rother und Shook nennen diese Person den Wertstrommanager. Gestaltung löscht persönliche Verantwortung nicht aus: Ein wissentlich falsches Versprechen oder ein übersprungener Sicherheitsschritt verlangt weiterhin eine faire Untersuchung. Es gilt, einen Systemfehler von einer Entscheidung gegen einen klaren Standard zu unterscheiden.") },
            { type: "callout", reading: true, text: x(
              "When customer success depends on several local successes, the join between them deserves its own standard and owner.",
              "Kur suksesi për klientin varet nga disa suksese lokale, bashkimi mes tyre meriton standardin dhe pronarin e vet.",
              "Hängt der Kundenerfolg von mehreren lokalen Erfolgen ab, verdient die Naht zwischen ihnen einen eigenen Standard und einen Verantwortlichen.") },
          ],
          note: x(
            "Womack's lens and the Lean Enterprise Institute's lexicon; the value-stream manager from Part I of Learning to See; the wholesale application is editorial.",
            "Lentja e Womack-ut dhe fjalori i Lean Enterprise Institute; menaxheri i rrjedhës së vlerës nga Pjesa I e Learning to See; zbatimi te shitja me shumicë është editorial.",
            "Womacks Linse und das Lexikon des Lean Enterprise Institute; der Wertstrommanager aus Teil I von Learning to See; die Anwendung auf den Großhandel ist redaktionell."),
          source: ["womack-2006", "vsm-lei-lexicon", "vsm-rother-shook-1999"],
        },
        {
          id: "iii-protocol", layer: "protocol",
          title: [x("Protocol:", "Protokolli:", "Protokoll:"), x("hand over a promise", "dorëzo një premtim", "ein Versprechen übergeben")],
          lead: x(
            "Six fields for a cross-functional commitment. The template is deliberately modest: a shared record and disciplined language are often the first measurable experiment.",
            "Gjashtë fusha për një angazhim mes funksioneve. Modeli është qëllimisht i thjeshtë: një regjistër i përbashkët dhe një gjuhë e disiplinuar janë shpesh eksperimenti i parë i matshëm.",
            "Sechs Felder für eine funktionsübergreifende Zusage. Die Vorlage ist bewusst bescheiden: Gemeinsame Aufzeichnung und disziplinierte Sprache sind oft das erste messbare Experiment."),
          blocks: [
            { type: "rows", compact: true, items: [
              { h: x("Customer result", "Rezultati për klientin", "Kundenergebnis"), p: x("What exactly has been requested and accepted?", "Çfarë saktësisht u kërkua dhe u pranua?", "Was genau wurde angefragt und angenommen?") },
              { h: x("Stock or resource check", "Kontrolli i stokut ose burimit", "Bestands- oder Ressourcenprüfung"), p: x("What availability has been verified, and at what time?", "Cila disponueshmëri u verifikua, dhe në cilën orë?", "Welche Verfügbarkeit wurde wann geprüft?") },
              { h: x("Next owner", "Pronari i radhës", "Nächster Verantwortlicher"), p: x("Who accepts responsibility for the next step?", "Kush e pranon përgjegjësinë për hapin e radhës?", "Wer verantwortet den nächsten Schritt?") },
              { h: x("Exception condition", "Kushti i përjashtimit", "Ausnahmebedingung"), p: x("What must stop a promise from being treated as confirmed?", "Çfarë duhet ta ndalojë një premtim të trajtohet si i konfirmuar?", "Was muss verhindern, dass ein Versprechen als bestätigt gilt?") },
              { h: x("Update channel", "Kanali i përditësimit", "Update-Kanal"), p: x("Who informs the partner if the condition changes?", "Kush e njofton partnerin nëse kushti ndryshon?", "Wer informiert den Partner bei Änderungen?") },
              { h: x("Closure evidence", "Prova e mbylljes", "Abschlussnachweis"), p: x("What proves the recipient got the promised result?", "Çfarë vërteton se marrësi e mori rezultatin e premtuar?", "Was belegt das versprochene Ergebnis beim Empfänger?") },
            ] },
            { type: "p", text: x(
              "Sample a small set of orders and ask how often the receiving team needed clarification before it could act. Does the organisation have one shared meaning for “confirmed”? Is stock confirmation distinct from order acceptance? Can a warehouse flag that a promise needs revision without being treated as obstructive? Who tells the reseller when the answer changes?",
              "Merr një mostër të vogël porosish dhe pyet sa shpesh ekipi marrës pati nevojë për sqarim. A ka organizata një kuptim të përbashkët për “të konfirmuar”? A është konfirmimi i stokut i ndarë nga pranimi i porosisë? A mund të sinjalizojë magazina se një premtim ka nevojë për rishikim pa u trajtuar si pengesë? Kush ia thotë rishitësit kur përgjigjja ndryshon?",
              "Prüfen Sie an einer kleinen Stichprobe von Aufträgen, wie oft das empfangende Team Klärung brauchte. Gibt es eine gemeinsame Bedeutung für „bestätigt“? Ist die Bestandsbestätigung von der Auftragsannahme getrennt? Kann das Lager ein Versprechen in Frage stellen, ohne als Bremser zu gelten?") },
            { type: "callout", reading: true, text: x(
              "The hospital's 38.12% belongs to patients in one hospital, not to wholesale. What transfers is the question: what happens to work after one department says it is ready?",
              "38,12% e spitalit u përket pacientëve të një spitali, jo shitjes me shumicë. Ajo që transferohet është pyetja: çfarë i ndodh punës pasi një departament thotë se është gati?",
              "Die 38,12 % gehören Patienten eines Krankenhauses, nicht dem Großhandel. Übertragbar ist die Frage: Was geschieht mit der Arbeit, nachdem eine Abteilung „fertig“ sagt?") },
          ],
          note: x(
            "Editorial checklist after end-to-end flow concepts from the Lean Enterprise Institute; Vidal-Carreras et al. (2022) is used only as an external comparative case.",
            "Listë editoriale sipas koncepteve të rrjedhës nga fillimi në fund të Lean Enterprise Institute; Vidal-Carreras et al. (2022) përdoret vetëm si rast krahasues i jashtëm.",
            "Redaktionelle Checkliste nach den Konzepten des Lean Enterprise Institute zum durchgängigen Fluss; Vidal-Carreras et al. (2022) dient nur als externer Vergleichsfall."),
          source: ["vsm-lei-lexicon", "vsm-vidal-carreras-2022"],
        },
      ],
    },

    // Chapter IV. The paradox of presence
    {
      id: "ch-iv", type: "chapter", numeral: "IV",
      title: x("The paradox of presence", "Paradoksi i pranisë", "Das Paradox der Anwesenheit"),
      pages: [
        {
          id: "iv-scene", layer: "scene",
          title: [x("The visit that", "Vizita që", "Der Besuch, der"), x("changes nothing", "nuk ndryshon asgjë", "nichts ändert")],
          lead: x(
            "A leader can visit the workplace, listen carefully and still make the working day worse if every concern ends as another unanswered promise.",
            "Një drejtues mund ta vizitojë vendin e punës, të dëgjojë me kujdes, dhe prapë ta bëjë ditën e punës më të keqe, nëse çdo shqetësim mbaron si një premtim tjetër pa përgjigje.",
            "Eine Führungskraft kann den Arbeitsplatz besuchen, aufmerksam zuhören und den Arbeitstag trotzdem schlechter machen, wenn jedes Anliegen als ein weiteres unbeantwortetes Versprechen endet."),
          blocks: [
            { type: "flag", text: x("Hypothetical scene, not an account of a named leader", "Skenë hipotetike, jo rrëfim për një drejtues të caktuar", "Hypothetische Szene, kein Bericht über eine bestimmte Führungskraft") },
            { type: "p", text: x(
              "A senior manager makes a late visit. Colleagues explain a recurring obstacle that makes their shift harder. The manager writes it down, thanks them and leaves. Days pass. The staff are asked to explain the same obstacle during another visit, but they cannot identify a decision, an owner or a deadline from the first. At the first visit the team may have felt heard. At the second, the invitation to speak begins to look like more work: management presence has increased, the employees' capacity to solve the problem has not.",
              "Një drejtues i lartë bën një vizitë të vonë. Kolegët shpjegojnë një pengesë që përsëritet dhe ua vështirëson turnin. Drejtuesi e shënon, i falënderon dhe largohet. Kalojnë ditë. Në një vizitë tjetër punonjësve u kërkohet ta shpjegojnë të njëjtën pengesë, por nuk mund të tregojnë asnjë vendim, pronar ose afat nga e para. Në vizitën e parë ekipi mund të jetë ndier i dëgjuar. Në të dytën, ftesa për të folur nis të duket si punë shtesë: prania e menaxhimit është rritur, aftësia e punonjësve për ta zgjidhur problemin jo.",
              "Eine Führungskraft macht einen späten Besuch. Kollegen erklären ein wiederkehrendes Hindernis, das ihre Schicht schwerer macht. Die Führungskraft notiert es, bedankt sich und geht. Tage vergehen. Bei einem weiteren Besuch werden die Beschäftigten gebeten, dasselbe Hindernis zu erklären, doch sie können keine Entscheidung, keinen Verantwortlichen und keine Frist vom ersten Mal nennen. Beim ersten Besuch fühlte sich das Team vielleicht gehört. Beim zweiten sieht die Einladung zu sprechen nach Mehrarbeit aus: Die Präsenz der Führung ist gestiegen, die Fähigkeit der Beschäftigten, das Problem zu lösen, nicht.") },
            { type: "callout", reading: true, text: x(
              "If listening creates expectations, silence after listening is part of the intervention.",
              "Nëse dëgjimi krijon pritshmëri, heshtja pas dëgjimit është pjesë e ndërhyrjes.",
              "Wenn Zuhören Erwartungen weckt, ist das Schweigen danach Teil der Intervention.") },
          ],
          note: x(
            "A constructed illustration of a general organisational risk, not a documented encounter with the author; its significance rests on the two studies that follow, read in the settings where they were collected.",
            "Ilustrim i ndërtuar i një rreziku të përgjithshëm organizativ, jo një takim i dokumentuar me autorin; rëndësia e tij qëndron te dy studimet që vijojnë, të lexuara në mjediset ku u mblodhën.",
            "Eine konstruierte Illustration eines allgemeinen organisatorischen Risikos, keine dokumentierte Begegnung des Autors; ihr Gewicht ruht auf den zwei Studien, die folgen, gelesen in den Umgebungen, in denen sie erhoben wurden."),
        },
        {
          id: "iv-study", layer: "concept",
          title: [x("The uncomfortable", "Eksperimenti", "Das unbequeme"), x("experiment", "i pakëndshëm", "Experiment")],
          lead: x(
            "Anita Tucker and Sara Singer studied a management-by-walking-around programme in US hospitals chosen at random. For 18 months senior managers met frontline workers, gathered improvement ideas and worked with staff on problems. 56 work areas took part; 138 in control hospitals did not.",
            "Anita Tucker dhe Sara Singer studiuan një program menaxhimi duke ecur nëpër terren në spitale të SHBA-së të zgjedhura rastësisht. Për 18 muaj drejtuesit e lartë takuan punonjësit e vijës së parë, mblodhën ide përmirësimi dhe punuan me stafin për problemet. Morën pjesë 56 reparte; 138 reparte në spitalet e kontrollit jo.",
            "Anita Tucker und Sara Singer untersuchten ein Programm des Führens durch Herumgehen in zufällig ausgewählten US-Kliniken. 18 Monate lang trafen Führungskräfte Beschäftigte an der Front, sammelten Verbesserungsideen und arbeiteten mit dem Personal an Problemen. 56 Bereiche nahmen teil, 138 in Kontrollkliniken nicht."),
          blocks: [
            { type: "columns", max: 20, height: 100, source: ["tucker-singer-2015"],
              label: x("Work area averages reported in the working paper (2013)", "Mesataret për repart të raportuara në versionin e punës (2013)", "Durchschnitte je Bereich laut Arbeitspapier (2013)"),
              items: [
                { k: x("Identified", "Të identifikuara", "Erkannt"), v: 19, n: "19" },
                { k: x("Action taken", "Me veprim", "Bearbeitet"), v: 11, n: "11", alert: true },
              ] },
            { type: "p", text: x(
              "The average estimated effect on the study's outcome was negative, a finding that resists the easy claim that visible management is necessarily good. Results were better where managers were assigned responsibility for seeing issues through and where teams prioritised easier-to-solve problems that produced more action. The figure above is a descriptive count, not a conversion rate and not evidence that every action fully solved its issue. The experiment does not prove that any 30-day policy is optimal in logistics or hospitality. It supports a narrower, more useful warning: finding problems is not the same as resolving them.",
              "Efekti mesatar i vlerësuar mbi rezultatin e studimit ishte negativ, një gjetje që i reziston pohimit të lehtë se menaxhimi i dukshëm është doemos i mirë. Rezultatet ishin më të mira aty ku menaxherëve iu caktua përgjegjësia t'i çonin çështjet deri në fund dhe ku ekipet u dhanë përparësi problemeve më të lehta për t'u zgjidhur, që prodhuan më shumë veprim. Shifra më sipër është numërim përshkrues, jo shkallë konvertimi dhe jo provë se çdo veprim e zgjidhi plotësisht çështjen e vet. Eksperimenti nuk vërteton se ndonjë politikë 30-ditore është optimale në logjistikë ose mikpritje. Mbështet një paralajmërim më të ngushtë dhe më të dobishëm: të gjesh probleme nuk është e njëjta gjë si t'i zgjidhësh.",
              "Der geschätzte durchschnittliche Effekt auf das Ergebnis der Studie war negativ, ein Befund, der der bequemen Behauptung widersteht, sichtbare Führung sei zwangsläufig gut. Besser lief es, wo Führungskräfte die Verantwortung erhielten, Themen zu Ende zu bringen, und wo Teams leichter lösbare Probleme vorzogen, die mehr Handlung erzeugten. Die Zahl oben ist eine beschreibende Zählung, keine Umwandlungsquote und kein Beleg, dass jede Maßnahme ihr Problem ganz gelöst hat. Das Experiment beweist nicht, dass eine 30-Tage-Regel in Logistik oder Gastgewerbe optimal wäre. Es stützt eine engere, nützlichere Warnung: Probleme zu finden ist nicht dasselbe wie sie zu lösen.") },
          ],
          note: x(
            "Improvement was rated by nurses on a 1–5 scale, before (2004) and after (2006); the counts per work area come from the 2013 working paper, the published article (2015) reports the same design. Hospital findings are not a measure of warehouse or hotel performance.",
            "Përmirësimin e vlerësuan infermierët në një shkallë 1–5, para (2004) dhe pas (2006); numrat për repart vijnë nga versioni i punës i 2013, artikulli i botuar (2015) jep të njëjtin dizajn. Gjetjet spitalore nuk janë masë e performancës së magazinës ose hotelit.",
            "Die Verbesserung bewerteten Pflegekräfte auf einer Skala von 1 bis 5, vorher (2004) und nachher (2006); die Zahlen je Bereich stammen aus dem Arbeitspapier von 2013, der veröffentlichte Artikel (2015) nennt dasselbe Design. Klinikbefunde messen keine Lager- oder Hotelleistung."),
          source: ["tucker-singer-2015"],
        },
        {
          id: "iv-feedback", layer: "concept",
          title: [x("Who hears", "Kush dëgjon", "Wer erfährt,"), x("what changed?", "çfarë ndryshoi?", "was sich änderte?")],
          lead: x(
            "A different study asked staff in 44 neonatal intensive care units about leadership walkrounds. Of 3,294 surveys administered, 2,073 were returned, a response rate of 62.9%. Almost half the respondents were unsure whether walkrounds occurred at all.",
            "Një studim tjetër i pyeti punonjësit e 44 njësive të terapisë intensive neonatale për ecjet e drejtuesve. Nga 3.294 pyetësorë të shpërndarë, u kthyen 2.073, një përqindje përgjigjeje prej 62,9%. Pothuajse gjysma e të anketuarve nuk e dinin nëse ecjet bëheshin fare.",
            "Eine andere Studie befragte Beschäftigte in 44 neonatologischen Intensivstationen zu Führungsrundgängen. Von 3.294 ausgegebenen Fragebögen kamen 2.073 zurück, eine Rücklaufquote von 62,9 %. Fast die Hälfte der Antwortenden war unsicher, ob Rundgänge überhaupt stattfanden."),
          blocks: [
            { type: "hbars", source: ["sexton-2014"],
              label: x("Staff in 44 neonatal intensive care units, 2011", "Punonjësit në 44 njësi të terapisë intensive neonatale, 2011", "Beschäftigte in 44 neonatologischen Intensivstationen, 2011"),
              items: [
                { k: x("Not sure walkrounds occurred", "Nuk e dinin nëse bëheshin ecje", "Unsicher, ob es Rundgänge gab"), v: 49.1, n: x("49.1%", "49,1%", "49,1 %"), alert: true },
                { k: x("Participated in walkrounds", "Morën pjesë në ecje", "Nahmen an Rundgängen teil"), v: 20.9, n: x("20.9%", "20,9%", "20,9 %") },
                { k: x("Heard back about actions", "Morën përgjigje për veprimet", "Erfuhren von Maßnahmen"), v: 18.4, n: x("18.4%", "18,4%", "18,4 %") },
              ] },
            { type: "p", text: x(
              "Areas where more staff heard about actions taken after walkrounds also tended to report a more favourable safety culture and less burnout. This was a cross-sectional survey: it cannot establish that feedback caused those ratings. The question is nonetheless worth testing locally. If a worker identifies a recurring obstacle in a loading area, do they later learn whether anyone checked it? If a night-shift colleague documents a cross-team barrier, does the next shift receive a decision? Feedback is not public relations: it closes the information loop that a walk opened.",
              "Repartet ku më shumë punonjës dëgjuan për veprimet e bëra pas ecjeve prireshin gjithashtu të raportonin një kulturë sigurie më të favorshme dhe më pak rraskapitje. Kjo ishte anketë në një moment të vetëm: nuk mund të vërtetojë se përgjigjja i shkaktoi ato vlerësime. Pyetja prapë ia vlen të provohet lokalisht. Nëse një punonjës identifikon një pengesë që përsëritet në një zonë ngarkimi, a mëson më vonë nëse dikush e kontrolloi? Nëse një koleg i turnit të natës dokumenton një pengesë mes ekipeve, a merr turni tjetër një vendim? Përgjigjja nuk është marrëdhënie me publikun: mbyll lakun e informacionit që hapi ecja.",
              "Bereiche, in denen mehr Beschäftigte von Maßnahmen nach den Rundgängen erfuhren, berichteten tendenziell auch eine günstigere Sicherheitskultur und weniger Burnout. Das war eine Querschnittsbefragung: Sie kann nicht belegen, dass die Rückmeldung diese Bewertungen verursachte. Die Frage lohnt sich trotzdem vor Ort. Wenn eine Arbeitskraft im Ladebereich ein wiederkehrendes Hindernis benennt, erfährt sie später, ob jemand es geprüft hat? Wenn ein Kollege der Nachtschicht eine teamübergreifende Hürde dokumentiert, erhält die nächste Schicht eine Entscheidung? Rückmeldung ist keine Öffentlichkeitsarbeit: Sie schließt die Informationsschleife, die ein Rundgang geöffnet hat.") },
            { type: "callout", reading: true, text: x(
              "To the team, an improvement they never hear about can look like no improvement at all.",
              "Për ekipin, një përmirësim për të cilin nuk dëgjon kurrë mund të duket si asnjë përmirësim.",
              "Für das Team kann eine Verbesserung, von der es nie erfährt, wie gar keine Verbesserung aussehen.") },
          ],
          note: x(
            "Participation and feedback are mean unit-level values; 49.1% is the share of respondents unsure that walkrounds took place. Percentages refer to the surveyed clinical population, not to warehouses or hotels.",
            "Pjesëmarrja dhe përgjigjja janë vlera mesatare të njësive; 49,1% është pjesa e të anketuarve që nuk e dinin nëse bëheshin ecje. Përqindjet i referohen popullatës klinike të anketuar, jo magazinave ose hoteleve.",
            "Teilnahme und Rückmeldung sind Mittelwerte der Stationen; 49,1 % ist der Anteil der Antwortenden, die unsicher waren, ob Rundgänge stattfanden. Die Prozentwerte gelten für die befragte klinische Population, nicht für Lager oder Hotels."),
          source: ["sexton-2014"],
        },
        {
          id: "iv-protocol", layer: "protocol",
          title: [x("Ownership", "Pronësia", "Verantwortung"), x("before applause", "para duartrokitjes", "vor Applaus")],
          lead: x(
            "A gemba walk fails when management treats the conversation as proof of engagement. The useful artefact is a short register: a fact, a priority, an owner, a next action and a date for reporting back. It is valuable only if it changes what happens next.",
            "Një ecje në gemba dështon kur menaxhimi e trajton bisedën si provë angazhimi. Artefakti i dobishëm është një regjistër i shkurtër: një fakt, një përparësi, një pronar, një veprim i radhës dhe një datë për të raportuar. Ka vlerë vetëm nëse ndryshon çfarë ndodh më pas.",
            "Ein Gemba-Rundgang scheitert, wenn die Führung das Gespräch als Beweis für Engagement nimmt. Das nützliche Artefakt ist ein kurzes Register: eine Tatsache, eine Priorität, ein Verantwortlicher, ein nächster Schritt und ein Termin für die Rückmeldung. Es ist nur wertvoll, wenn es ändert, was als Nächstes geschieht."),
          blocks: [
            { type: "steps", items: [
              { h: x("Before the walk", "Para ecjes", "Vor dem Rundgang"), p: x("Choose one process and the outcome being investigated.", "Zgjidh një proces dhe rezultatin që po hetohet.", "Einen Prozess und das untersuchte Ergebnis wählen.") },
              { h: x("During", "Gjatë", "Währenddessen"), p: x("Capture verifiable conditions, not impressions about people.", "Shëno kushte të verifikueshme, jo përshtypje për njerëzit.", "Prüfbare Bedingungen festhalten, keine Eindrücke über Menschen.") },
              { h: x("Immediately after", "Menjëherë pas", "Unmittelbar danach"), p: x("Classify immediate hazards separately from routine improvement.", "Ndaji rreziqet e menjëhershme nga përmirësimi rutinë.", "Akute Gefahren getrennt von routinemäßiger Verbesserung einordnen.") },
              { h: x("Before the next review", "Para rishikimit të radhës", "Vor der nächsten Prüfung"), p: x("Name one accountable owner and one next milestone.", "Emërto një pronar përgjegjës dhe një pikë të radhës.", "Einen Verantwortlichen und einen nächsten Meilenstein benennen.") },
              { h: x("At the return", "Në kthim", "Bei der Rückkehr"), p: x("Show the team what changed, what failed and what remains open.", "Tregoji ekipit çfarë ndryshoi, çfarë dështoi dhe çfarë mbetet e hapur.", "Dem Team zeigen, was sich änderte, was scheiterte und was offen bleibt.") },
            ] },
            { type: "p", text: x(
              "Not all problems belong in the same lane. A safety concern may require immediate containment and formal escalation; a cross-department design problem may take weeks and authority beyond the local leader. In every lane, the team should still hear what was decided. A manager must also protect the worker's right to say the standard is unrealistic: a workaround may conceal a breach, or signal that the process no longer matches the real work.",
              "Jo të gjitha problemet hyjnë në të njëjtën korsi. Një shqetësim sigurie mund të kërkojë frenim të menjëhershëm dhe eskalim formal; një problem dizajni mes departamenteve mund të zgjasë javë dhe të kërkojë autoritet përtej drejtuesit lokal. Në çdo korsi, ekipi prapë duhet të dëgjojë çfarë u vendos. Menaxheri duhet të mbrojë edhe të drejtën e punonjësit për të thënë se standardi është jorealist: një rrugë anësore mund të fshehë një shkelje, ose të tregojë se procesi nuk përputhet më me punën.",
              "Nicht alle Probleme gehören in dieselbe Spur. Ein Sicherheitsanliegen kann sofortige Eindämmung und Eskalation verlangen; ein abteilungsübergreifendes Problem kann Wochen und Befugnis jenseits der lokalen Leitung brauchen. In jeder Spur soll das Team hören, was entschieden wurde. Die Führungskraft muss auch das Recht schützen, den Standard unrealistisch zu nennen: Ein Umweg kann einen Verstoß verbergen oder zeigen, dass der Prozess nicht mehr zur Arbeit passt.") },
          ],
          note: x(
            "Editorial action protocol informed by Tucker & Singer, Sexton et al. and David Mann. Not an intervention tested in the author's workplaces.",
            "Protokoll editorial veprimi i ndikuar nga Tucker & Singer, Sexton et al. dhe David Mann. Jo një ndërhyrje e provuar në vendet e punës së autorit.",
            "Redaktionelles Handlungsprotokoll, geprägt von Tucker & Singer, Sexton et al. und David Mann. Keine in den Betrieben des Autors geprüfte Intervention."),
          source: ["tucker-singer-2015", "sexton-2014", "mann-2014"],
        },
      ],
    },

    // Chapter V. Process time versus queue time
    {
      id: "ch-v", type: "chapter", numeral: "V",
      title: x("Process time versus queue time", "Koha e procesit kundrejt kohës në radhë", "Prozesszeit gegen Wartezeit"),
      pages: [
        {
          id: "v-scene", layer: "scene",
          title: [x("The minute", "Minuta", "Die Minute"), x("and the queue", "dhe radha", "und die Warteschlange")],
          lead: x(
            "When people complain that a process takes too long, the first instinct is to make the task faster. Sometimes the task is already fast. The delay is in the space before it begins.",
            "Kur njerëzit ankohen se një proces zgjat shumë, instinkti i parë është ta bësh detyrën më të shpejtë. Nganjëherë detyra është tashmë e shpejtë. Vonesa është në hapësirën para se të nisë.",
            "Wenn Menschen klagen, ein Prozess dauere zu lange, ist der erste Instinkt, die Aufgabe schneller zu machen. Manchmal ist die Aufgabe schon schnell. Die Verzögerung liegt im Raum, bevor sie beginnt."),
          blocks: [
            { type: "flag", text: hypothetical },
            { type: "stats", cols: 3, hypothetical: true, items: [
              { n: x("18 min", "18 min", "18 min"), t: x("of active work: pick, check, load, release", "punë aktive: merr, kontrollo, ngarko, lësho", "aktive Arbeit: picken, prüfen, laden, freigeben") },
              { n: x("145 min", "145 min", "145 min"), t: x("from entering the flow to ready for departure", "nga hyrja në rrjedhë deri gati për nisje", "vom Eintritt in den Fluss bis abfahrbereit") },
              { n: x("12.4%", "12,4%", "12,4 %"), t: x("activity ratio: 18 divided by 145", "raporti i aktivitetit: 18 pjesëtuar me 145", "Aktivitätsquote: 18 geteilt durch 145") },
            ] },
            { type: "p", text: x(
              "Imagine a parcel that needs just a few minutes for each physical action. The actions total 18 minutes, yet the parcel takes 145 minutes from entering the chosen flow to being ready for departure. It spends most of that time waiting for a prior step, a clarification or an available resource. Making the loading action two minutes faster would barely change the total journey. That distinction is the purpose of value stream mapping: not a floor plan, not an organisation chart, but a map of how a particular family of work moves, including the information that makes the next action possible and the time consumed while the work is idle.",
              "Imagjino një pako që ka nevojë vetëm për pak minuta për çdo veprim fizik. Veprimet bëjnë gjithsej 18 minuta, por pakos i duhen 145 minuta nga hyrja në rrjedhën e zgjedhur deri sa të jetë gati për nisje. Pjesën më të madhe të asaj kohe e kalon duke pritur një hap të mëparshëm, një sqarim ose një burim të lirë. Ta bësh veprimin e ngarkimit dy minuta më të shpejtë mezi do ta ndryshonte rrugëtimin e plotë. Ky dallim është qëllimi i hartës së rrjedhës së vlerës: jo planimetri, jo organigramë, por hartë e mënyrës si lëviz një familje e caktuar pune, përfshirë informacionin që e bën të mundur veprimin e radhës dhe kohën që harxhohet ndërsa puna rri.",
              "Nehmen Sie ein Paket, das für jede physische Handlung nur wenige Minuten braucht. Die Handlungen ergeben zusammen 18 Minuten, doch das Paket braucht 145 Minuten vom Eintritt in den gewählten Fluss bis zur Abfahrbereitschaft. Die meiste Zeit wartet es auf einen vorherigen Schritt, eine Klärung oder eine freie Ressource. Das Laden zwei Minuten schneller zu machen, würde die Gesamtreise kaum ändern. Diese Unterscheidung ist der Zweck der Wertstromanalyse: kein Hallenplan, kein Organigramm, sondern eine Karte, wie eine bestimmte Familie von Arbeit sich bewegt, einschließlich der Information, die den nächsten Schritt möglich macht, und der Zeit, die vergeht, während die Arbeit liegt.") },
            { type: "callout", reading: true, text: x(
              "A fast task can live inside a slow system.",
              "Një detyrë e shpejtë mund të jetojë brenda një sistemi të ngadaltë.",
              "Eine schnelle Aufgabe kann in einem langsamen System leben.") },
          ],
          note: x(
            "The synthetic numbers are included so the calculation can be checked. They are not a measurement of the author's actual loading time, shift, site or company; real measurement needs consistent timestamps and an agreed process boundary.",
            "Numrat sintetikë përfshihen që llogaria të kontrollohet. Nuk janë matje e kohës së vërtetë të ngarkimit, turnit, vendit ose kompanisë së autorit; matja e vërtetë kërkon vula kohore të njëtrajtshme dhe një kufi procesi të dakorduar.",
            "Die synthetischen Zahlen stehen hier, damit die Rechnung nachprüfbar ist. Sie messen weder die tatsächliche Ladezeit noch Schicht, Standort oder Unternehmen des Autors; echte Messung braucht einheitliche Zeitstempel und eine vereinbarte Prozessgrenze."),
        },
        {
          id: "v-concept", layer: "concept",
          title: [x("Three numbers,", "Tri numra,", "Drei Zahlen,"), x("one ratio", "një raport", "ein Verhältnis")],
          lead: x(
            "Karen Martin and Mike Osterling map office and service work with three measures: process time, the effort spent actively doing the defined work; lead time, the elapsed time from entry to exit; and percent complete and accurate, whether work reaches the next step usable, without correction, addition or clarification.",
            "Karen Martin dhe Mike Osterling e hartojnë punën në zyra dhe shërbime me tri matje: kohën e procesit, përpjekjen e shpenzuar duke bërë vërtet punën e përcaktuar; kohën e plotë, kohën e kaluar nga hyrja në dalje; dhe përqindjen e plotë dhe të saktë, nëse puna arrin te hapi tjetër e përdorshme, pa korrigjim, shtesë ose sqarim.",
            "Karen Martin und Mike Osterling kartieren Büro- und Servicearbeit mit drei Maßen: Prozesszeit, der Aufwand, die definierte Arbeit tatsächlich zu tun; Durchlaufzeit, die verstrichene Zeit von Eintritt bis Austritt; und Prozent vollständig und korrekt, ob Arbeit den nächsten Schritt nutzbar erreicht, ohne Korrektur, Ergänzung oder Klärung."),
          blocks: [
            { type: "rows", compact: true, items: [
              { h: x("PT, process time", "PT, koha e procesit", "PT, Prozesszeit"), p: x("Actual active work time. How long we work.", "Koha e vërtetë e punës aktive. Sa gjatë punojmë.", "Tatsächliche aktive Arbeitszeit. Wie lange wir arbeiten.") },
              { h: x("LT, lead time", "LT, koha e plotë", "LT, Durchlaufzeit"), p: x("Elapsed time from entry to exit. How long it waits.", "Koha e kaluar nga hyrja në dalje. Sa gjatë pret.", "Verstrichene Zeit von Eintritt bis Austritt. Wie lange es wartet.") },
              { h: x("%C&A, complete and accurate", "%C&A, e plotë dhe e saktë", "%C&A, vollständig und korrekt"), p: x("Accepted without repair. How good the hand-off is.", "E pranuar pa riparim. Sa i mirë është dorëzimi.", "Angenommen ohne Nacharbeit. Wie gut die Übergabe ist.") },
            ] },
            { type: "p", text: x(
              "For the hypothetical flow, 18 minutes of process time inside 145 minutes of lead time gives an activity ratio of 12.4%. This does not mean employees were productive for 12.4% of their day; it describes a flow and its time, not the utilisation of staff. That distinction matters whenever managers start turning a process metric into a judgment about people. With several steps, add the active times and divide by the overall lead time, in one consistent scope. And %C&A is not a speed measure: a fast handover that sends incomplete information increases the burden downstream, so the receiving team should define it.",
              "Për rrjedhën hipotetike, 18 minuta kohë procesi brenda 145 minutave kohë të plotë japin një raport aktiviteti prej 12,4%. Kjo nuk do të thotë se punonjësit ishin produktivë për 12,4% të ditës; përshkruan një rrjedhë dhe kohën e saj, jo shfrytëzimin e stafit. Ky dallim ka rëndësi sa herë që menaxherët nisin ta kthejnë një matje procesi në gjykim për njerëzit. Me disa hapa, mblidh kohët aktive dhe pjesëtoji me kohën e plotë të përgjithshme, me një fushë të vetme të njëtrajtshme. Dhe %C&A nuk është masë shpejtësie: një dorëzim i shpejtë që dërgon informacion të paplotë e rrit barrën poshtë rrjedhës, prandaj duhet ta përkufizojë ekipi marrës.",
              "Für den hypothetischen Fluss ergeben 18 Minuten Prozesszeit in 145 Minuten Durchlaufzeit eine Aktivitätsquote von 12,4 %. Das heißt nicht, dass die Beschäftigten 12,4 % ihres Tages produktiv waren; es beschreibt einen Fluss und seine Zeit, nicht die Auslastung des Personals. Diese Unterscheidung zählt, sobald Führungskräfte eine Prozesskennzahl in ein Urteil über Menschen verwandeln. Bei mehreren Schritten addiert man die aktiven Zeiten und teilt durch die gesamte Durchlaufzeit, in einem einheitlichen Rahmen. Und %C&A ist kein Tempomaß: Eine schnelle Übergabe mit unvollständiger Information erhöht die Last stromabwärts, also sollte das empfangende Team sie definieren.") },
            { type: "callout", reading: true, text: x(
              "Measure the whole elapsed journey, including the work waiting between steps.",
              "Mat gjithë rrugëtimin e kaluar, përfshirë punën që pret mes hapave.",
              "Messen Sie den ganzen Weg, auch die Arbeit, die zwischen den Schritten wartet.") },
          ],
          note: x(
            "Definitions from Karen Martin's 2014 post and her 2009 slides; the book itself was not seen. The calculation is hypothetical.",
            "Përkufizimet nga postimi i Karen Martin-it i 2014 dhe sllajdet e saj të 2009; vetë libri nuk u pa. Llogaria është hipotetike.",
            "Definitionen aus Karen Martins Beitrag von 2014 und ihren Folien von 2009; das Buch selbst wurde nicht eingesehen. Die Rechnung ist hypothetisch."),
          source: ["vsm-martin-osterling-2014", "vsm-martin-2009"],
        },
        {
          id: "v-study", layer: "concept",
          title: [x("What the hospital", "Çfarë zbuloi", "Was die Klinikkarte"), x("map revealed", "harta e spitalit", "zeigte")],
          lead: x(
            "Pilar Vidal-Carreras, Julio Garcia-Sabater and Juan Marin-Garcia mapped the day of adults receiving chemotherapy at the oncology day hospital of a large public hospital in Spain: a blood test, a visit to the oncologist, then the treatment. The median stay was 446 minutes, with 306 minutes of non-value-added time, 300 of them waiting.",
            "Pilar Vidal-Carreras, Julio Garcia-Sabater dhe Juan Marin-Garcia vizatuan ditën e të rriturve që marrin kimioterapi në spitalin ditor onkologjik të një spitali të madh publik në Spanjë: analiza e gjakut, vizita te onkologu, pastaj trajtimi. Mediana e qëndrimit ishte 446 minuta, me 306 minuta kohë pa vlerë, 300 prej tyre pritje.",
            "Pilar Vidal-Carreras, Julio Garcia-Sabater und Juan Marin-Garcia zeichneten den Tag von Erwachsenen, die in der onkologischen Tagesklinik eines großen öffentlichen Krankenhauses in Spanien Chemotherapie erhalten: Blutabnahme, Besuch beim Onkologen, dann die Behandlung. Der Aufenthalt dauerte im Median 446 Minuten, mit 306 Minuten ohne Wertschöpfung, davon 300 Warten."),
          blocks: [
            { type: "hbars", source: ["vsm-vidal-carreras-2022"],
              label: x("Value-added time as a share of the stay, median", "Koha që shton vlerë si pjesë e qëndrimit, mediana", "Wertschöpfende Zeit als Anteil am Aufenthalt, Median"),
              items: [
                { k: x("Current state, measured", "Gjendja e sotme, e matur", "Ist-Zustand, gemessen"), v: 38.12, n: x("38.1%", "38,1%", "38,1 %"), alert: true },
                { k: x("Future state 2, projected", "Gjendja e ardhshme 2, e parashikuar", "Soll-Zustand 2, berechnet"), v: 57.43, n: x("57.4%", "57,4%", "57,4 %") },
                { k: x("Future state 1, projected", "Gjendja e ardhshme 1, e parashikuar", "Soll-Zustand 1, berechnet"), v: 75.22, n: x("75.2%", "75,2%", "75,2 %") },
              ] },
            { type: "p", text: x(
              "The laboratory could test a sample in under 15 minutes, yet the next appointment was an hour later. A dose took 15 minutes to prepare on average, yet the pharmacy would not promise it in less than three hours: requests from the whole hospital arrived at once, with no priority. The future states are projected designs, not before-and-after outcomes; reporting them as achieved gains would overstate the study. The practical comparison is about coordination, not about pretending a patient journey and a parcel journey are equivalent.",
              "Laboratori mund ta analizonte një mostër për më pak se 15 minuta, por takimi tjetër ishte një orë më vonë. Përgatitja e një doze zgjaste mesatarisht 15 minuta, por farmacia nuk e premtonte për më pak se tri orë: kërkesat e gjithë spitalit mbërrinin njëherësh, pa përparësi. Gjendjet e ardhshme janë projekte të parashikuara, jo rezultate para-pas; t'i raportoje si fitime të arritura do ta zmadhonte studimin. Krahasimi praktik ka të bëjë me koordinimin, jo me pretendimin se rrugëtimi i një pacienti dhe i një pakoje janë të njëjtë.",
              "Das Labor konnte eine Probe in unter 15 Minuten auswerten, der nächste Termin lag aber eine Stunde später. Eine Dosis war im Schnitt in 15 Minuten zubereitet, doch die Apotheke sagte sie nicht unter drei Stunden zu: Die Anforderungen des ganzen Hauses kamen gleichzeitig und ohne Vorrang. Die Soll-Zustände sind berechnete Entwürfe, keine Vorher-nachher-Ergebnisse. Der praktische Vergleich betrifft die Koordination, nicht die Behauptung, ein Patientenweg und ein Paketweg seien gleich.") },
            { type: "callout", reading: true, text: x(
              "The work was quick. The day was long because of the time between departments, which no department owned.",
              "Puna ishte e shpejtë. Dita ishte e gjatë për shkak të kohës mes departamenteve, që nuk i përkiste asnjë departamenti.",
              "Die Arbeit ging schnell. Der Tag war lang wegen der Zeit zwischen den Abteilungen, für die keine Abteilung zuständig war.") },
          ],
          note: x(
            "Tables 1 and 2 of the article, published in IJERPH 19(7), 2022. One hospital; the number of patients observed is not given.",
            "Tabelat 1 dhe 2 të artikullit, të botuar te IJERPH 19(7), 2022. Një spital; numri i pacientëve të vëzhguar nuk jepet.",
            "Tabellen 1 und 2 des Artikels, erschienen in IJERPH 19(7), 2022. Ein Krankenhaus; wie viele Patienten beobachtet wurden, wird nicht genannt."),
          source: ["vsm-vidal-carreras-2022"],
        },
        {
          id: "v-review", layer: "concept",
          title: [x("Maps without", "Harta pa", "Karten ohne"), x("a future", "të ardhme", "Zukunft")],
          lead: x(
            "Juan Marin-Garcia and colleagues reviewed 80 publications on value stream mapping in healthcare from 2015 to 2019. Twenty spoke of a map but drew none. Of the 60 drawn maps, only 20 showed a future state, and only 19 the flow of information.",
            "Juan Marin-Garcia dhe kolegët shqyrtuan 80 botime për hartën e rrjedhës së vlerës në shëndetësi, nga 2015 deri në 2019. Njëzet flisnin për një hartë, por nuk vizatonin asnjë. Nga 60 hartat e vizatuara, vetëm 20 tregonin një gjendje të ardhshme, dhe vetëm 19 rrjedhën e informacionit.",
            "Juan Marin-Garcia und Kollegen werteten 80 Veröffentlichungen zur Wertstromanalyse im Gesundheitswesen von 2015 bis 2019 aus. Zwanzig sprachen von einer Karte, zeichneten aber keine. Von den 60 gezeichneten Karten zeigten nur 20 einen Soll-Zustand und nur 19 den Informationsfluss."),
          blocks: [
            { type: "hbars", max: 80, source: ["vsm-marin-garcia-2021"],
              label: x("80 publications on value stream mapping in healthcare, 2015–2019", "80 botime për hartën e rrjedhës së vlerës në shëndetësi, 2015–2019", "80 Veröffentlichungen zur Wertstromanalyse im Gesundheitswesen, 2015–2019"),
              items: [
                { k: x("Drew a map", "Vizatuan një hartë", "Zeichneten eine Karte"), v: 60, n: x("60 of 80", "60 nga 80", "60 von 80") },
                { k: x("Showed waiting on it", "Tregonin pritjen", "Zeigten Wartezeiten"), v: 38, n: x("38 of 80", "38 nga 80", "38 von 80") },
                { k: x("Drew a future state", "Vizatuan një gjendje të ardhshme", "Zeichneten einen Soll-Zustand"), v: 20, n: x("20 of 80", "20 nga 80", "20 von 80"), alert: true },
                { k: x("Drew the information flow", "Vizatuan rrjedhën e informacionit", "Zeichneten den Informationsfluss"), v: 19, n: x("19 of 80", "19 nga 80", "19 von 80"), alert: true },
              ] },
            { type: "p", text: x(
              "No study in the review reported a negative or barely noticeable result; the authors ask whether publication bias plays a part. The review cannot tell us how much mapping helped the author's workplaces. It does show how easily diagnosis becomes the last step rather than the first step towards a change. A material map without its information flow cannot explain many modern delays: a product may be physically present but not released, a reservation may exist without the next shift knowing what remains open, an order may be accepted without a verified capacity promise. The object is there; the authority or information to proceed is not. A map needs both: where the item is, and what the next person knows.",
              "Asnjë studim në rishikim nuk raportoi rezultat negativ ose mezi të dukshëm; autorët pyesin nëse ndikon anshmëria e botimit. Rishikimi nuk mund të na thotë sa i ndihmoi hartimi vendet e punës së autorit. Tregon, megjithatë, sa lehtë diagnoza bëhet hapi i fundit dhe jo i pari drejt një ndryshimi. Një hartë materiali pa rrjedhën e informacionit nuk mund të shpjegojë shumë vonesa moderne: një produkt mund të jetë fizikisht aty, por i palëshuar; një rezervim mund të ekzistojë pa e ditur turni tjetër çfarë mbetet e hapur; një porosi mund të pranohet pa një premtim kapaciteti të verifikuar. Objekti është aty; autoriteti ose informacioni për të vazhduar nuk është. Harta ka nevojë për të dyja: ku është artikulli, dhe çfarë di personi tjetër.",
              "Keine Studie im Review meldete ein negatives oder kaum merkliches Ergebnis; die Autoren fragen, ob Publikationsbias mitspielt. Der Review kann nicht sagen, wie sehr das Kartieren den Betrieben des Autors geholfen hat. Er zeigt aber, wie leicht die Diagnose zum letzten statt zum ersten Schritt einer Veränderung wird. Eine Materialkarte ohne Informationsfluss erklärt viele moderne Verzögerungen nicht: Ein Produkt kann physisch da, aber nicht freigegeben sein; eine Reservierung existieren, ohne dass die nächste Schicht weiß, was offen ist; ein Auftrag angenommen werden ohne geprüftes Kapazitätsversprechen. Das Objekt ist da; die Befugnis oder Information zum Weitermachen nicht. Eine Karte braucht beides: wo der Artikel ist und was die nächste Person weiß.") },
          ],
          note: x(
            "20 of 80 drew no map; of the 60 maps, 38 showed waiting (read from a figure), 20 a future state and 19 the information flow (the text; the figure shows 21 and 18). Material and information flows after the Lean Enterprise Institute's lexicon.",
            "20 nga 80 nuk vizatuan hartë; nga 60 hartat, 38 tregonin pritjen (lexuar nga një figurë), 20 një gjendje të ardhshme dhe 19 rrjedhën e informacionit (teksti; figura tregon 21 dhe 18). Rrjedhat e materialit dhe të informacionit sipas fjalorit të Lean Enterprise Institute.",
            "20 von 80 zeichneten keine Karte; von den 60 Karten zeigten 38 Wartezeiten (aus einer Abbildung abgelesen), 20 einen Soll-Zustand und 19 den Informationsfluss (der Text; die Abbildung zeigt 21 und 18). Material- und Informationsfluss nach dem Lexikon des Lean Enterprise Institute."),
          source: ["vsm-marin-garcia-2021", "vsm-lei-lexicon"],
        },
        {
          id: "v-protocol", layer: "protocol",
          title: [x("From current state", "Nga gjendja e sotme", "Vom Ist-Zustand"), x("to future state", "te gjendja e ardhshme", "zum Soll-Zustand")],
          lead: x(
            "A current-state map answers “what is happening now?” The future-state map answers a harder question: “what should we change, and what will tell us that the change works?” Rother and Shook pair the map with an implementation plan because diagnosis alone does not improve flow.",
            "Harta e gjendjes së sotme përgjigjet “çfarë po ndodh tani?” Harta e gjendjes së ardhshme përgjigjet një pyetjeje më të vështirë: “çfarë duhet të ndryshojmë, dhe çfarë do të na tregojë se ndryshimi funksionon?” Rother-i dhe Shook-u e shoqërojnë hartën me një plan zbatimi, sepse diagnoza vetëm nuk e përmirëson rrjedhën.",
            "Eine Ist-Karte beantwortet „Was geschieht jetzt?“ Die Soll-Karte beantwortet eine schwerere Frage: „Was sollen wir ändern, und woran erkennen wir, dass die Änderung wirkt?“ Rother und Shook stellen der Karte einen Umsetzungsplan zur Seite, weil Diagnose allein den Fluss nicht verbessert."),
          blocks: [
            { type: "chain", items: [
              { h: x("Map", "Vizato", "Kartieren"), p: x("Select one flow and observe it end to end, including the information path.", "Zgjidh një rrjedhë dhe vëzhgoje nga fillimi në fund, përfshirë rrugën e informacionit.", "Einen Fluss wählen und ihn von Anfang bis Ende beobachten, einschließlich des Informationswegs.") },
              { h: x("Measure", "Mat", "Messen"), p: x("Capture active time, total lead time, exceptions and %C&A.", "Shëno kohën aktive, kohën e plotë, përjashtimet dhe %C&A.", "Aktive Zeit, gesamte Durchlaufzeit, Ausnahmen und %C&A erfassen.") },
              { h: x("Design", "Projekto", "Gestalten"), p: x("Identify one queue or hand-off whose condition can be changed.", "Gjej një radhë ose dorëzim, kushti i të cilit mund të ndryshohet.", "Eine Warteschlange oder Übergabe finden, deren Bedingung sich ändern lässt.") },
              { h: x("Test", "Provo", "Testen"), p: x("Assign an owner, run a bounded test and measure the complete outcome.", "Cakto një pronar, bëj një provë të kufizuar dhe mat rezultatin e plotë.", "Einen Verantwortlichen benennen, einen begrenzten Test fahren und das vollständige Ergebnis messen.") },
            ] },
            { type: "p", text: x(
              "Start with one item type, one class of request or one shift handover. Record the current state without judging individuals. Then draw a future state that changes a condition rather than demanding more speed. A successful test should make a downstream outcome better, not just the local metric: a faster loading phase paired with more missing items is not an improvement; a neater log that forces the next shift to telephone the previous one is not a better handover. Some waiting protects safety, quality and sequencing; the question is which delay is necessary and which is created by uncertainty, rework or poor coordination.",
              "Nis me një lloj artikulli, një klasë kërkesash ose një dorëzim turni. Shëno gjendjen e sotme pa gjykuar individë. Pastaj vizato një gjendje të ardhshme që ndryshon një kusht, në vend që të kërkojë më shumë shpejtësi. Një provë e suksesshme duhet ta bëjë më të mirë një rezultat poshtë rrjedhës, jo vetëm matjen lokale: një fazë ngarkimi më e shpejtë bashkë me më shumë artikuj që mungojnë nuk është përmirësim; një ditar më i rregullt që e detyron turnin tjetër t'i telefonojë të mëparshmit nuk është dorëzim më i mirë. Një pjesë e pritjes mbron sigurinë, cilësinë dhe radhën; pyetja është cila vonesë është e nevojshme dhe cila krijohet nga pasiguria, ripunimi ose koordinimi i dobët.",
              "Beginnen Sie mit einer Artikelart, einer Klasse von Anfragen oder einer Schichtübergabe. Halten Sie den Ist-Zustand fest, ohne Personen zu bewerten. Zeichnen Sie dann einen Soll-Zustand, der eine Bedingung ändert, statt mehr Tempo zu fordern. Ein gelungener Test soll ein Ergebnis stromabwärts verbessern, nicht nur die lokale Kennzahl: Schnelleres Laden mit mehr fehlenden Artikeln ist keine Verbesserung; ein ordentlicheres Protokoll, das die nächste Schicht zwingt, die vorige anzurufen, ist keine bessere Übergabe. Manches Warten schützt Sicherheit, Qualität und Reihenfolge; die Frage ist, welche Verzögerung nötig ist und welche aus Unsicherheit, Nacharbeit oder schlechter Koordination entsteht.") },
            { type: "callout", reading: true, text: x(
              "The map is useful only if it changes a decision.",
              "Harta është e dobishme vetëm nëse ndryshon një vendim.",
              "Die Karte ist nur nützlich, wenn sie eine Entscheidung ändert.") },
          ],
          note: x(
            "Steps after Part I of Learning to See and the measures of Martin & Osterling; the testing questions are editorial proposals.",
            "Hapat sipas Pjesës I të Learning to See dhe matjeve të Martin & Osterling; pyetjet e provës janë propozime editoriale.",
            "Schritte nach Teil I von Learning to See und den Maßen von Martin & Osterling; die Testfragen sind redaktionelle Vorschläge."),
          source: ["vsm-rother-shook-1999", "vsm-martin-osterling-2014"],
        },
      ],
    },

    // Chapter VI. The 30-day response loop
    {
      id: "ch-vi", type: "chapter", numeral: "VI",
      title: x("The 30-day response loop", "Laku i përgjigjes 30-ditor", "Die 30-Tage-Rückmeldeschleife"),
      pages: [
        {
          id: "vi-scene", layer: "scene",
          title: [x("The 30-day", "Laku i përgjigjes", "Die 30-Tage-"), x("response loop", "30-ditor", "Rückmeldeschleife")],
          lead: x(
            "A manager who asks staff to show the real work makes an implicit commitment: the information will not disappear into a notebook.",
            "Një menaxher që u kërkon punonjësve t'i tregojnë punën e vërtetë merr një angazhim të heshtur: informacioni nuk do të zhduket në një bllok shënimesh.",
            "Eine Führungskraft, die Beschäftigte bittet, die wirkliche Arbeit zu zeigen, gibt eine stille Zusage: Die Information verschwindet nicht in einem Notizbuch."),
          blocks: [
            { type: "flag", text: x("Hypothetical scene, not a recorded follow-up", "Skenë hipotetike, jo ndjekje e regjistruar", "Hypothetische Szene, keine dokumentierte Nachverfolgung") },
            { type: "p", text: x(
              "A frontline colleague points out a recurring delay. The manager records it and leaves. A week later the problem still exists, but the team can see that someone has checked the underlying sequence, assigned an owner and scheduled a decision. A month later the team hears whether the change worked, failed or needs more time. No hero appears. The difference is the clarity of the response.",
              "Një koleg i vijës së parë vë në dukje një vonesë që përsëritet. Menaxheri e shënon dhe largohet. Një javë më vonë problemi ekziston ende, por ekipi sheh se dikush e ka kontrolluar radhën në themel, ka caktuar një pronar dhe ka planifikuar një vendim. Një muaj më vonë ekipi dëgjon nëse ndryshimi funksionoi, dështoi apo ka nevojë për më shumë kohë. Nuk shfaqet asnjë hero. Dallimi është qartësia e përgjigjes.",
              "Ein Kollege an der Front weist auf eine wiederkehrende Verzögerung hin. Die Führungskraft notiert sie und geht. Eine Woche später besteht das Problem noch, aber das Team sieht, dass jemand die zugrunde liegende Abfolge geprüft, einen Verantwortlichen benannt und eine Entscheidung terminiert hat. Einen Monat später erfährt das Team, ob die Änderung wirkte, scheiterte oder mehr Zeit braucht. Kein Held tritt auf. Der Unterschied ist die Klarheit der Antwort.") },
            { type: "p", text: x(
              "The thirty days are not a law of improvement and not a promise that every operational failure can be repaired inside one month. In the hospital study by Tucker and Singer, quicker-to-solve issues went with more action and better outcomes in the local analysis; this volume uses 30 days as an illustrative review horizon for non-urgent problems. Immediate safety or compliance risks demand immediate treatment; structural issues may need a longer roadmap.",
              "Tridhjetë ditët nuk janë ligj përmirësimi dhe as premtim se çdo dështim operacional mund të ndreqet brenda një muaji. Në studimin spitalor të Tucker-it dhe Singer-it, çështjet që zgjidheshin më shpejt shkonin me më shumë veprim dhe rezultate më të mira në analizën lokale; ky vëllim i përdor 30 ditët si horizont ilustrues rishikimi për problemet jo urgjente. Rreziqet e menjëhershme të sigurisë ose të përputhshmërisë kërkojnë trajtim të menjëhershëm; çështjet strukturore mund të kenë nevojë për një plan më të gjatë.",
              "Die dreißig Tage sind kein Gesetz der Verbesserung und kein Versprechen, dass sich jedes betriebliche Versagen in einem Monat beheben lässt. In der Klinikstudie von Tucker und Singer gingen schneller lösbare Themen in der lokalen Analyse mit mehr Handlung und besseren Ergebnissen einher; dieser Band nutzt 30 Tage als beispielhaften Prüfhorizont für nicht dringende Probleme. Akute Sicherheits- oder Compliance-Risiken verlangen sofortige Behandlung; strukturelle Themen brauchen vielleicht einen längeren Fahrplan.") },
            { type: "callout", reading: true, text: x(
              "An observation without a return answer is an unfinished management process.",
              "Një vëzhgim pa përgjigje kthimi është një proces menaxhimi i pambaruar.",
              "Eine Beobachtung ohne Rückantwort ist ein unvollendeter Führungsprozess.") },
          ],
          note: x(
            "Editorial scene and proposed planning cycle, informed by Tucker & Singer (2015).",
            "Skenë editoriale dhe cikël planifikimi i propozuar, të ndikuara nga Tucker & Singer (2015).",
            "Redaktionelle Szene und vorgeschlagener Planungszyklus, geprägt von Tucker & Singer (2015)."),
          source: ["tucker-singer-2015"],
        },
        {
          id: "vi-concept", layer: "concept",
          title: [x("Five actions,", "Pesë veprime,", "Fünf Handlungen,"), x("one obligation", "një detyrim", "eine Verpflichtung")],
          lead: x(
            "Observe, verify, assign, act, tell back: a five-stage synthesis of gemba observation, value-stream analysis, problem ownership and the feedback research, the same chain as in Volume 1.",
            "Vëzhgo, verifiko, cakto, vepro, trego: një sintezë me pesë faza e vëzhgimit në gemba, analizës së rrjedhës së vlerës, pronësisë së problemit dhe kërkimit për përgjigjen, i njëjti zinxhir si në Vëllimin 1.",
            "Beobachten, prüfen, zuweisen, handeln, zurückmelden: eine fünfstufige Synthese aus Gemba-Beobachtung, Wertstromanalyse, Problemverantwortung und der Forschung zur Rückmeldung, dieselbe Kette wie in Band 1."),
          blocks: [
            { type: "rows", compact: true, items: [
              { h: x("Observe", "Vëzhgo", "Beobachten"), p: x("Select one value stream and record what actually happened. Do not begin with an accusation about who was slow; where there is immediate risk, make the situation safe first.", "Zgjidh një rrjedhë vlere dhe shëno çfarë ndodhi vërtet. Mos nis me akuzë se kush ishte i ngadaltë; ku ka rrezik të menjëhershëm, siguroje situatën së pari.", "Einen Wertstrom wählen und festhalten, was wirklich geschah. Nicht mit dem Vorwurf beginnen, wer langsam war; bei akutem Risiko zuerst die Lage sichern.") },
              { h: x("Verify", "Verifiko", "Prüfen"), p: x("Check the sequence, timestamps, standard, exception conditions and the downstream effect. Ask the people who send work and the people who receive it; they often describe two honest versions of the same handover.", "Kontrollo radhën, vulat kohore, standardin, kushtet e përjashtimit dhe efektin poshtë rrjedhës. Pyet ata që e dërgojnë punën dhe ata që e marrin; shpesh përshkruajnë dy versione të sinqerta të të njëjtit dorëzim.", "Abfolge, Zeitstempel, Standard, Ausnahmebedingungen und die Wirkung stromabwärts prüfen. Die fragen, die Arbeit senden, und die, die sie empfangen; sie beschreiben oft zwei ehrliche Versionen derselben Übergabe.") },
              { h: x("Assign", "Cakto", "Zuweisen"), p: x("Name the person responsible for the next decision, not just the department in an email. Set a checkpoint. Distinguish the local owner from the person with authority to remove a cross-functional barrier.", "Emërto personin përgjegjës për vendimin e radhës, jo vetëm departamentin në një email. Cakto një pikë kontrolli. Dallo pronarin lokal nga personi me autoritet për të hequr një pengesë mes funksioneve.", "Die Person für die nächste Entscheidung benennen, nicht nur die Abteilung in einer E-Mail. Einen Kontrollpunkt setzen. Den lokalen Verantwortlichen von der Person mit Befugnis unterscheiden, eine funktionsübergreifende Hürde zu beseitigen.") },
              { h: x("Act", "Vepro", "Handeln"), p: x("Apply a correction or a controlled test. Document what changed and what remains uncertain. Do not describe a planned action as completed, and do not treat a status update as evidence of customer benefit.", "Zbato një korrigjim ose një provë të kontrolluar. Dokumento çfarë ndryshoi dhe çfarë mbetet e pasigurt. Mos e përshkruaj një veprim të planifikuar si të përfunduar, dhe mos e trajto një përditësim statusi si provë përfitimi për klientin.", "Eine Korrektur oder einen kontrollierten Test anwenden. Dokumentieren, was sich änderte und was unsicher bleibt. Eine geplante Maßnahme nicht als erledigt beschreiben und ein Status-Update nicht als Beleg für Kundennutzen nehmen.") },
              { h: x("Tell back", "Trego", "Zurückmelden"), p: x("Return to the frontline with the result: what changed, what did not, and the next milestone if the work remains open. This completes the obligation created when management asked people to expose a problem.", "Kthehu te vija e parë me rezultatin: çfarë ndryshoi, çfarë jo, dhe pika e radhës nëse puna mbetet e hapur. Kjo e mbyll detyrimin e krijuar kur menaxhimi u kërkoi njerëzve të zbulonin një problem.", "Mit dem Ergebnis an die Front zurückkehren: was sich änderte, was nicht, und der nächste Meilenstein, falls die Arbeit offen bleibt. Das erfüllt die Verpflichtung, die entstand, als die Führung Menschen bat, ein Problem offenzulegen.") },
            ] },
          ],
          note: x(
            "Five-stage editorial synthesis after the Lean Enterprise Institute's gemba walk, Tucker & Singer (2015) and Sexton et al. (2014); no new causal effect is estimated.",
            "Sintezë editoriale me pesë faza sipas ecjes në gemba të Lean Enterprise Institute, Tucker & Singer (2015) dhe Sexton et al. (2014); nuk vlerësohet asnjë efekt i ri shkakësor.",
            "Fünfstufige redaktionelle Synthese nach dem Gemba-Rundgang des Lean Enterprise Institute, Tucker & Singer (2015) und Sexton et al. (2014); kein neuer kausaler Effekt wird geschätzt."),
          source: ["lei-gemba-walk", "tucker-singer-2015", "sexton-2014"],
        },
        {
          id: "vi-protocol", layer: "protocol",
          title: [x("Thirty days", "Tridhjetë ditë", "Dreißig Tage"), x("without a ritual", "pa ritual", "ohne Ritual")],
          lead: x(
            "A sample schedule and a small scorecard, not an evidence-based deadline. A safety issue needs immediate escalation; a large redesign needs longer, and then “tell back” means an honest progress update.",
            "Një orar shembull dhe një tabelë e vogël, jo një afat i bazuar në prova. Një çështje sigurie ka nevojë për eskalim të menjëhershëm; një riprojektim i madh kërkon më shumë kohë, dhe atëherë “trego” do të thotë përditësim i sinqertë i ecurisë.",
            "Ein Beispielplan und eine kleine Scorecard, keine belegte Frist. Ein Sicherheitsthema braucht sofortige Eskalation; ein großer Umbau braucht länger, und „zurückmelden“ heißt dann ein ehrliches Zwischenergebnis."),
          blocks: [
            { type: "timeline", items: [
              { k: x("Day 0", "Dita 0", "Tag 0"), t: x("Observe, record facts and contain immediate risk.", "Vëzhgo, shëno faktet dhe frenoje rrezikun e menjëhershëm.", "Beobachten, Fakten festhalten, akutes Risiko eindämmen.") },
              { k: x("Day 3", "Dita 3", "Tag 3"), t: x("Verify the mechanism and choose an accountable owner.", "Verifiko mekanizmin dhe zgjidh një pronar përgjegjës.", "Den Mechanismus prüfen und einen Verantwortlichen wählen.") },
              { k: x("Day 10", "Dita 10", "Tag 10"), t: x("Review the first action and any cross-team block.", "Rishiko veprimin e parë dhe çdo bllokim mes ekipeve.", "Erste Maßnahme und teamübergreifende Blockaden prüfen.") },
              { k: x("Day 30", "Dita 30", "Tag 30"), t: x("Check the measured outcome and report back to staff.", "Kontrollo rezultatin e matur dhe raportoja stafit.", "Gemessenes Ergebnis prüfen und dem Personal zurückmelden.") },
            ] },
            { type: "rows", compact: true, items: [
              { h: x("Found", "Të gjetura", "Gefunden"), p: x("Verified findings. Discovery volume.", "Gjetje të verifikuara. Vëllimi i zbulimit.", "Geprüfte Befunde.") },
              { h: x("Owned", "Me pronar", "Verantwortet"), p: x("Owner per verified finding. Clear responsibility.", "Pronar për çdo gjetje të verifikuar. Përgjegjësi e qartë.", "Verantwortlicher je Befund.") },
              { h: x("Acted", "Me veprim", "Umgesetzt"), p: x("Action per owned finding. Follow-through.", "Veprim për çdo gjetje me pronar. Ndjekje deri në fund.", "Maßnahme je Befund.") },
              { h: x("Told back", "Të treguara", "Zurückgemeldet"), p: x("Staff updated per actioned finding. Feedback closure.", "Staf i njoftuar për çdo gjetje të trajtuar. Mbyllja e përgjigjes.", "Personal informiert je Maßnahme.") },
            ] },
            { type: "p", text: x(
              "The denominators matter: an organisation can report a 100% feedback rate by excluding unresolved cases. Track all verified findings by age and status, and keep a visible list of unresolved risks. Do not publish worker names or guest details as proof of transparency; a public example shows the method, not the case file.",
              "Emëruesit kanë rëndësi: një organizatë mund të raportojë 100% përgjigje duke përjashtuar rastet e pazgjidhura. Ndiqi të gjitha gjetjet e verifikuara sipas vjetërsisë dhe statusit, dhe mbaj një listë të dukshme të rreziqeve të pazgjidhura. Mos boto emra punonjësish ose të dhëna mysafirësh si provë transparence; një shembull publik tregon metodën, jo dosjen.",
              "Die Nenner zählen: 100 % Rückmeldung lassen sich melden, indem man ungelöste Fälle ausschließt. Alle geprüften Befunde nach Alter und Status verfolgen und eine sichtbare Liste ungelöster Risiken führen. Keine Namen oder Gastdaten als Beweis für Transparenz veröffentlichen; ein öffentliches Beispiel zeigt die Methode, nicht die Akte.") },
            { type: "callout", reading: true, text: x(
              "A walk is complete when learning returns to the people who supplied it.",
              "Një ecje është e plotë kur mësimi u kthehet njerëzve që e dhanë.",
              "Ein Rundgang ist vollständig, wenn das Gelernte zu den Menschen zurückkehrt, die es geliefert haben.") },
          ],
          note: x(
            "Editorial planning horizon and measurement design, influenced by Tucker & Singer (2015) and Sexton et al. (2014); metrics proposed, not tested for validity.",
            "Horizont planifikimi dhe dizajn matjeje editoriale, të ndikuara nga Tucker & Singer (2015) dhe Sexton et al. (2014); matjet janë propozime, të paprovuara për vlefshmëri.",
            "Redaktioneller Planungshorizont und Messentwurf, geprägt von Tucker & Singer (2015) und Sexton et al. (2014); die Kennzahlen sind Vorschläge, nicht auf Validität geprüft."),
          source: ["tucker-singer-2015", "sexton-2014"],
        },
      ],
    },

    {
      id: "tool", tool: "/tools/delay-analyzer/",
      kicker: x("Field tool", "Mjeti i terrenit", "Werkzeug vor Ort"),
      title: [x("The one-page flow", "Karta e rrjedhës", "Die Fluss- und"), x("and closure card", "dhe e mbylljes", "Abschlusskarte")],
      lead: x(
        "For the warehouse, the office or a night-shift handover: one single flow, one bounded experiment. If you do not yet have a reliable time measurement, write “not measured” rather than inventing minutes.",
        "Për magazinën, zyrën ose një dorëzim të turnit të natës: një rrjedhë e vetme, një eksperiment i kufizuar. Nëse nuk ke ende një matje të besueshme të kohës, shkruaj “e pamatur” në vend që të shpikësh minuta.",
        "Für Lager, Büro oder Nachtschicht: ein Fluss, ein begrenztes Experiment. Ohne verlässliche Zeitmessung „nicht gemessen“ schreiben, statt Minuten zu erfinden."),
      blocks: [
        { type: "form", items: [
          { h: x("Process and customer", "Procesi dhe klienti", "Prozess und Kunde"), hint: x("which single flow are we following, and for whose outcome?", "cilën rrjedhë të vetme po ndjekim, dhe për rezultatin e kujt?", "welchen einzelnen Fluss verfolgen wir, und für wessen Ergebnis?") },
          { h: x("Current condition", "Gjendja e sotme", "Aktueller Zustand"), hint: x("what did we directly observe? what is still only reported?", "çfarë vëzhguam drejtpërdrejt? çfarë është ende vetëm e raportuar?", "was haben wir direkt beobachtet, was ist nur berichtet?") },
          { h: x("Time and quality", "Koha dhe cilësia", "Zeit und Qualität"), hint: x("PT, LT, waiting and %C&A where measurement is valid", "PT, LT, pritja dhe %C&A ku matja është e vlefshme", "PT, LT, Warten und %C&A, wo die Messung gültig ist") },
          { h: x("The failed hand-off", "Dorëzimi i dështuar", "Die gescheiterte Übergabe"), hint: x("where did work, information or authority stop travelling?", "ku pushoi së udhëtuari puna, informacioni ose autoriteti?", "wo blieben Arbeit, Information oder Befugnis stehen?"), lines: 2 },
          { h: x("Next action and owner", "Veprimi i radhës dhe pronari", "Nächster Schritt und Verantwortlicher"), hint: x("who can change the condition, and when will they check it?", "kush mund ta ndryshojë kushtin, dhe kur do ta kontrollojë?", "wer kann die Bedingung ändern, und wann prüft er sie?") },
          { h: x("Tell back", "Trego", "Zurückmelden"), hint: x("who will report to the people doing the work, and by when?", "kush do t'u raportojë njerëzve që bëjnë punën, dhe deri kur?", "wer meldet es den Menschen an der Arbeit, und bis wann?") },
        ] },
      ],
      note: x(
        "Original editorial tool, synthesising Rother & Shook, Womack, Mann and Martin & Osterling. If the cause is uncertain, write the next verification step rather than a conclusion; if the issue is sensitive, keep the internal record secure and use only an anonymised summary in public.",
        "Mjet editorial origjinal, që sintetizon Rother & Shook, Womack-un, Mann-in dhe Martin & Osterling. Nëse shkaku është i pasigurt, shkruaj hapin e radhës të verifikimit, jo një përfundim; nëse çështja është e ndjeshme, mbaje të sigurt regjistrimin e brendshëm dhe përdor publikisht vetëm një përmbledhje anonime.",
        "Originales redaktionelles Werkzeug nach Rother & Shook, Womack, Mann und Martin & Osterling. Ist die Ursache unsicher, den nächsten Prüfschritt notieren statt eines Schlusses; ist das Thema heikel, intern sichern und öffentlich nur anonymisiert zusammenfassen."),
      source: ["vsm-rother-shook-1999", "womack-2006", "mann-2014", "vsm-martin-osterling-2014"],
    },
    {
      id: "closing",
      kicker: x("Closing essay", "Eseja e mbylljes", "Schlussessay"),
      title: [x("What stays when", "Çfarë mbetet kur", "Was bleibt, wenn"), x("the manager leaves", "menaxheri largohet", "die Führungskraft geht")],
      lead: x(
        "The hotel shift, the last-mile loading point and the wholesale network are not interchangeable. Their customers, risks and authority structures differ. Yet each exposes the same fragility: work can be completed locally while its value is stranded between people, teams or moments in time.",
        "Turni i hotelit, pika e ngarkimit në milin e fundit dhe rrjeti me shumicë nuk zëvendësojnë njëri-tjetrin. Klientët, rreziqet dhe strukturat e autoritetit ndryshojnë. Prapë secili zbulon të njëjtën brishtësi: puna mund të mbyllet lokalisht ndërsa vlera e saj mbetet e bllokuar mes njerëzve, ekipeve ose çasteve në kohë.",
        "Die Hotelschicht, der Ladepunkt auf der letzten Meile und das Großhandelsnetz sind nicht austauschbar. Kunden, Risiken und Befugnisstrukturen unterscheiden sich. Doch jedes legt dieselbe Zerbrechlichkeit offen: Arbeit kann lokal abgeschlossen sein, während ihr Wert zwischen Menschen, Teams oder Zeitpunkten gestrandet ist."),
      blocks: [
        { type: "p", text: x(
          "The first instinct is to ask for a better report. Reports are needed; they tell us whether a target was met, a departure was delayed, a request remains open. But a report is a description produced by one information boundary. The second instinct is to send a leader to the floor. Observation is needed too; Ohno, Womack and Mann remind us to look at the actual work and to be wary of easy explanations. The research adds a difficult qualification: visiting without resolving and reporting back can make leadership less credible rather than more useful. The third instinct is to build a protocol. That is necessary, provided the protocol belongs to the work rather than to the performance of management: a form that records a problem and leaves it unowned is not improvement; a map that never leads to a future state is not transformation; a KPI that counts activity without showing its customer effect is not a result.",
          "Instinkti i parë është të kërkosh një raport më të mirë. Raportet duhen; na thonë nëse një objektiv u arrit, një nisje u vonua, një kërkesë mbetet e hapur. Por një raport është përshkrim i prodhuar nga një kufi i vetëm informacioni. Instinkti i dytë është të dërgosh një drejtues në terren. Edhe vëzhgimi duhet; Ohno, Womack dhe Mann na kujtojnë ta shohim punën e vërtetë dhe t'u ruhemi shpjegimeve të lehta. Kërkimi shton një kusht të vështirë: të vizitosh pa zgjidhur dhe pa raportuar mund ta bëjë drejtimin më pak të besueshëm, jo më të dobishëm. Instinkti i tretë është të ndërtosh një protokoll. Kjo është e nevojshme, me kusht që protokolli t'i përkasë punës dhe jo shfaqjes së menaxhimit: një formular që regjistron një problem dhe e lë pa pronar nuk është përmirësim; një hartë që nuk çon kurrë te një gjendje e ardhshme nuk është transformim; një KPI që numëron aktivitetin pa treguar efektin te klienti nuk është rezultat.",
          "Der erste Instinkt ist, einen besseren Bericht zu verlangen. Berichte sind nötig; sie sagen uns, ob ein Ziel erreicht, eine Abfahrt verspätet, eine Anfrage offen ist. Aber ein Bericht ist eine Beschreibung, erzeugt an einer einzigen Informationsgrenze. Der zweite Instinkt ist, eine Führungskraft auf den Shopfloor zu schicken. Auch Beobachtung ist nötig; Ohno, Womack und Mann erinnern uns, die tatsächliche Arbeit anzusehen und leichten Erklärungen zu misstrauen. Die Forschung fügt eine schwierige Einschränkung hinzu: Besuchen ohne Lösen und Zurückmelden kann Führung weniger glaubwürdig statt nützlicher machen. Der dritte Instinkt ist, ein Protokoll zu bauen. Das ist nötig, sofern das Protokoll der Arbeit gehört und nicht der Inszenierung von Führung: Ein Formular, das ein Problem erfasst und ohne Verantwortlichen lässt, ist keine Verbesserung; eine Karte, die nie zu einem Soll-Zustand führt, ist keine Transformation; eine Kennzahl, die Aktivität zählt, ohne ihre Wirkung beim Kunden zu zeigen, ist kein Ergebnis.") },
        { type: "p", text: x(
          "What remains is a quieter discipline: see the work; trace the whole flow; distinguish cause from blame; assign a decision; test a change; return to the people with the answer. The manager cannot eliminate every constraint. The manager can stop pretending that noticing a constraint is the same as solving it.",
          "Ajo që mbetet është një disiplinë më e qetë: shiko punën; gjurmo gjithë rrjedhën; dallo shkakun nga faji; cakto një vendim; provo një ndryshim; kthehu te njerëzit me përgjigjen. Menaxheri nuk mund ta heqë çdo kufizim. Menaxheri mund të ndalojë së pretenduari se ta vësh re një kufizim është e njëjta gjë si ta zgjidhësh.",
          "Was bleibt, ist eine leisere Disziplin: die Arbeit sehen; den ganzen Fluss verfolgen; Ursache von Schuld unterscheiden; eine Entscheidung zuweisen; eine Änderung testen; mit der Antwort zu den Menschen zurückkehren. Die Führungskraft kann nicht jede Einschränkung beseitigen. Sie kann aufhören, so zu tun, als sei das Bemerken einer Einschränkung dasselbe wie ihre Lösung.") },
        { type: "callout", reading: true, text: x(
          "Follow the work all the way to the customer. Then follow your own promise all the way back to the team.",
          "Ndiqe punën deri te klienti. Pastaj ndiqe premtimin tënd deri mbrapa te ekipi.",
          "Folgen Sie der Arbeit bis zum Kunden. Dann folgen Sie Ihrem eigenen Versprechen zurück zum Team.") },
      ],
      note: x(
        "Editorial conclusion. No project-level improvement is attributed to the author without an independently documented measurement.",
        "Përfundim editorial. Asnjë përmirësim në nivel projekti nuk i atribuohet autorit pa një matje të dokumentuar në mënyrë të pavarur.",
        "Redaktionelles Fazit. Keine Verbesserung auf Projektebene wird dem Autor ohne unabhängig dokumentierte Messung zugeschrieben."),
    },
    {
      id: "method",
      kicker: x("Method", "Metoda", "Methode"),
      title: [x("How this volume", "Si u ndërtua", "Wie dieser Band"), x("was built", "ky vëllim", "entstand")],
      lead: x(
        "An evidence-informed editorial synthesis, not a field experiment. This volume keeps the evidence of Management Review No. 56 on value stream mapping and No. 40 on gemba; the scenes and timestamps invented to explain a mechanism are always labelled hypothetical or constructed.",
        "Një sintezë editoriale e mbështetur në prova, jo një eksperiment në terren. Ky vëllim e ruan provën e Management Review Nr. 56 për hartën e rrjedhës së vlerës dhe Nr. 40 për gemba-n; skenat dhe kohët e shpikura për të shpjeguar një mekanizëm shënohen gjithmonë si hipotetike ose të ndërtuara.",
        "Eine belegbasierte redaktionelle Synthese, kein Feldexperiment. Dieser Band behält die Belege von Management Review Nr. 56 zur Wertstromanalyse und Nr. 40 zu Gemba; die zur Erklärung eines Mechanismus erfundenen Szenen und Zeiten sind stets als hypothetisch oder konstruiert markiert."),
      blocks: [
        { type: "p", text: x(
          "Research: Rother and Shook, Womack and the Lean Enterprise Institute provide the conceptual frameworks; Martin and Osterling the process-time, lead-time and quality measures; Vidal-Carreras and colleagues the oncology patient-flow example; Marin-Garcia and colleagues the review of published maps; Tucker and Singer and Sexton and colleagues two distinct healthcare studies of leadership walkrounds, action and feedback. Boundaries: the 38.12% is not a wholesale or logistics estimate; projected future states are not achieved gains; perceived improvement in a hospital intervention cannot be translated into a measured drop in loading delays; associations in a cross-sectional survey cannot establish a causal change in burnout. Practice: the value stream with 18 minutes of active work and 145 minutes of lead time is wholly invented; the 30-day schedule is an editorial review rhythm, not a procedure said to have been used by the author.",
          "Kërkimi: Rother-i dhe Shook-u, Womack-u dhe Lean Enterprise Institute japin kornizat konceptuale; Martin-i dhe Osterling-u matjet e kohës së procesit, kohës së plotë dhe cilësisë; Vidal-Carreras dhe kolegët shembullin e rrjedhës së pacientëve onkologjikë; Marin-Garcia dhe kolegët rishikimin e hartave të botuara; Tucker dhe Singer dhe Sexton dhe kolegët dy studime të ndryshme shëndetësore për ecjet e drejtuesve, veprimin dhe përgjigjen. Kufijtë: 38,12% nuk është vlerësim për shitjen me shumicë ose logjistikën; gjendjet e ardhshme të parashikuara nuk janë fitime të arritura; përmirësimi i perceptuar në një ndërhyrje spitalore nuk mund të përkthehet në rënie të matur të vonesave të ngarkimit; lidhjet në një anketë në një moment të vetëm nuk mund të vërtetojnë ndryshim shkakësor të rraskapitjes. Praktika: rrjedha e vlerës me 18 minuta punë aktive dhe 145 minuta kohë të plotë është tërësisht e shpikur; orari 30-ditor është ritëm editorial rishikimi, jo një procedurë që thuhet se e ka përdorur autori.",
          "Forschung: Rother und Shook, Womack und das Lean Enterprise Institute liefern die begrifflichen Rahmen; Martin und Osterling die Maße für Prozesszeit, Durchlaufzeit und Qualität; Vidal-Carreras und Kollegen das Beispiel des onkologischen Patientenflusses; Marin-Garcia und Kollegen den Review veröffentlichter Karten; Tucker und Singer sowie Sexton und Kollegen zwei verschiedene Klinikstudien zu Führungsrundgängen, Handlung und Rückmeldung. Grenzen: Die 38,12 % sind keine Schätzung für Großhandel oder Logistik; berechnete Soll-Zustände sind keine erreichten Gewinne; wahrgenommene Verbesserung in einer Klinikintervention lässt sich nicht in einen gemessenen Rückgang von Ladeverzögerungen übersetzen; Zusammenhänge in einer Querschnittsbefragung belegen keine kausale Veränderung von Burnout. Praxis: Der Wertstrom mit 18 Minuten aktiver Arbeit und 145 Minuten Durchlaufzeit ist vollständig erfunden; der 30-Tage-Plan ist ein redaktioneller Prüfrhythmus, kein Verfahren, das der Autor angeblich genutzt hätte.") },
        { type: "cards", cols: 3, items: [
          { h: x("Source", "Burimi", "Quelle"), p: x("Verifiable references, sample populations, published definitions.", "Referenca të verifikueshme, popullata mostrash, përkufizime të botuara.", "Prüfbare Angaben, Stichprobenpopulationen, veröffentlichte Definitionen.") },
          { h: x("Interpretation", "Interpretimi", "Deutung"), p: x("A reasoned comparison across different kinds of operations.", "Një krahasim i arsyetuar mes llojeve të ndryshme operacionesh.", "Ein begründeter Vergleich über verschiedene Arten von Betrieb hinweg.") },
          { h: x("Proposal", "Propozimi", "Vorschlag"), p: x("Checklists and action cycles awaiting local testing.", "Lista kontrolli dhe cikle veprimi që presin provë lokale.", "Checklisten und Handlungszyklen, die auf lokale Erprobung warten.") },
        ] },
      ],
      note: x(
        "Sources include primary articles where accessible and institutional lean guidance; where a book was not seen, its entry carries “via” on the next page. There are no names of guests, colleagues, employers or private internal technologies in the case descriptions.",
        "Burimet përfshijnë artikuj parësorë ku u hapën dhe udhëzime institucionale lean; kur një libër nuk u pa, hyrja e tij mban “përmes” në faqen tjetër. Në përshkrimet e rasteve nuk ka emra mysafirësh, kolegësh, punëdhënësish ose teknologjish private të brendshme.",
        "Die Quellen umfassen Primärartikel, wo zugänglich, und institutionelle Lean-Leitfäden; wo ein Buch nicht eingesehen wurde, trägt sein Eintrag auf der nächsten Seite „über“. In den Fallbeschreibungen stehen keine Namen von Gästen, Kollegen, Arbeitgebern oder privaten internen Technologien."),
      source: ["vsm-vidal-carreras-2022", "vsm-marin-garcia-2021", "tucker-singer-2015", "sexton-2014"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
