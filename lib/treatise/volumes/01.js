// Operational treatise, Volume 1: Gemba, management where the work happens. Block: Operations.
// Facts and their sources: docs/revista/traktati-operacional.md. The figures are those of Management Review No. 40,
// checked at the full texts (docs/revista/management-review-nr-40.md); Womack's 2006 column was read at lean.org.
// Three chapters, each in the three layers: the living scene, the conceptual and scientific breakdown, the
// operating protocol for action. The scenes are constructed from the categories of work the author knows (hotel
// night audit, last-mile loading) and say so on the page.
import { x, pc } from "../common.js";

export default {
  number: 1,
  numeral: "I",
  block: "operations",
  date: x("October 2026", "Tetor 2026", "Oktober 2026"),
  theme: [x("Gemba:", "Gemba:", "Gemba:"), x("management where the work happens", "menaxhimi aty ku ndodh puna", "führen, wo die Arbeit geschieht")],
  sub: x(
    "A hotel desk at 03:00, Ohno's circle, one order followed to the customer, Womack's purpose, process and people, a randomised study in which walking around made things worse, the staff who never heard back, and a card for your own walk.",
    "Një sportel hoteli në 03:00, rrethi i Ohno-s, një porosi e ndjekur deri te klienti, qëllimi, procesi dhe njerëzit te Womack-u, një studim i randomizuar ku vizitat në terren i përkeqësuan gjërat, punonjësit që nuk morën kurrë përgjigje, dhe një kartë për vizitën tënde në terren.",
    "Eine Hotelrezeption um 03:00, Ohnos Kreis, ein Auftrag bis zum Kunden verfolgt, Womacks Zweck, Prozess und Menschen, eine randomisierte Studie, in der Rundgänge der Leitung die Lage verschlechterten, die Beschäftigten, die nie Antwort bekamen, und ein Blatt für Ihren eigenen Rundgang."),
  seo: x(
    "Gemba as an operational treatise: three chapters in three layers, from the 03:00 desk to Ohno, Womack, Mann, two studies of leadership walks and a walk card.",
    "Gemba si traktat operacional: tre kapituj në tri shtresa, nga sporteli në 03:00 te Ohno, Womack, Mann, dy studime për vizitat në terren dhe një kartë.",
    "Gemba als operativer Traktat: drei Kapitel in drei Ebenen, von der Rezeption um 03:00 zu Ohno, Womack, Mann, zwei Studien zu Rundgängen und einem Arbeitsblatt."),
  feature: x(
    "Volume 1 follows one question through the hotel night shift, the loading ramp and the warehouse: what changes when a manager leaves the report, sees the actual process, and then has to act on what was found? Its three chapters open on a desk at 03:00, one order followed to the customer and a visit that changes nothing. Each scene is broken down with Ohno's circle, Womack's purpose, process and people, and two hospital studies of leadership walks, then turned into a protocol; the volume ends with a card for your own walk.",
    "Vëllimi 1 e ndjek një pyetje nëpër turnin e natës në hotel, rampën e ngarkimit dhe magazinën: çfarë ndryshon kur një menaxher e lë raportin, e sheh procesin e vërtetë, dhe pastaj duhet të veprojë mbi atë që gjeti? Tre kapitujt e tij nisin me një sportel në 03:00, një porosi të ndjekur deri te klienti dhe një vizitë që nuk ndryshon asgjë. Secila skenë zbërthehet me rrethin e Ohno-s, qëllimin, procesin dhe njerëzit te Womack-u, dhe dy studime spitalore për vizitat e drejtuesve në terren, pastaj kthehet në protokoll; vëllimi mbyllet me një kartë për vizitën tënde në terren.",
    "Band 1 verfolgt eine Frage durch die Nachtschicht im Hotel, die Laderampe und das Lager: Was ändert sich, wenn eine Führungskraft den Bericht hinter sich lässt, den tatsächlichen Prozess sieht und dann auf das Gefundene reagieren muss? Seine drei Kapitel beginnen an einer Rezeption um 03:00, bei einem Auftrag, der bis zum Kunden verfolgt wird, und bei einem Besuch, der nichts ändert. Jede Szene wird mit Ohnos Kreis, Womacks Zweck, Prozess und Menschen und zwei Klinikstudien zu Führungsrundgängen aufgeschlüsselt und dann in ein Protokoll übersetzt; am Ende steht ein Blatt für Ihren eigenen Rundgang."),
  figure: { n: x("49%", "49%", "49 %"), by: "Sexton et al., 2014", t: x(
    "of the staff surveyed in 44 neonatal intensive care units were not sure whether leadership walkrounds took place at all.",
    "e punonjësve të anketuar në 44 njësi të terapisë intensive neonatale nuk e dinin me siguri nëse drejtuesit bënin fare vizita në terren.",
    "der Befragten in 44 neonatologischen Intensivstationen wussten nicht sicher, ob Rundgänge der Leitung überhaupt stattfanden.") },
  teasers: [
    { page: "i-scene", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("A visit at 03:00", "Një vizitë në 03:00", "Ein Besuch um 03:00") },
    { page: "iii-study", kicker: x("The evidence", "Prova", "Die Belege"),
      title: x("When walking made things worse", "Kur vizitat në terren i përkeqësuan gjërat", "Als die Rundgänge schadeten") },
    { page: "tool", kicker: x("Tool of the volume", "Mjeti i vëllimit", "Werkzeug des Bandes"),
      title: x("The gemba walk card", "Karta e vizitës në terren", "Das Blatt für den Gemba-Rundgang") },
  ],
  // The reading contract on the editorial page.
  contract: [
    { h: x("Fact", "Fakti", "Fakt"), p: x("The research is attributed, dated and bounded.", "Kërkimi është i atribuuar, i datuar dhe i kufizuar.", "Die Forschung ist zugeordnet, datiert und begrenzt.") },
    { h: x("Field", "Terreni", "Feld"), p: x("Operational examples are anonymised or clearly hypothetical.", "Shembujt operacionalë janë anonimë ose qartësisht hipotetikë.", "Operative Beispiele sind anonymisiert oder klar hypothetisch.") },
    { h: x("Judgment", "Gjykimi", "Urteil"), p: x("Editorial readings are not presented as measured effects.", "Leximet editoriale nuk paraqiten si efekte të matura.", "Redaktionelle Deutungen werden nicht als gemessene Wirkungen ausgegeben.") },
  ],
  sources: ["teresko-2004", "lei-gemba-walk", "womack-2006", "womack-2011", "mann-2005", "mann-2014", "tucker-singer-2015", "sexton-2014"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      title: [x("The work", "Puna", "Die Arbeit"), x("behind the number", "pas shifrës", "hinter der Zahl")],
      why: x(
        "A report can say a shift missed its target. It cannot, by itself, explain how the failure was made. To understand that, a manager has to cross the distance between the number and the place where people do the work.",
        "Një raport mund të thotë se një turn nuk e arriti objektivin. Nuk mund të shpjegojë, vetëm me kaq, si u bë dështimi. Për ta kuptuar, menaxheri duhet ta kalojë distancën mes shifrës dhe vendit ku njerëzit bëjnë punën.",
        "Ein Bericht kann sagen, dass eine Schicht ihr Ziel verfehlt hat. Er kann nicht von sich aus erklären, wie das Versagen entstand. Um das zu verstehen, muss eine Führungskraft die Strecke zwischen der Zahl und dem Ort zurücklegen, an dem Menschen die Arbeit tun."),
      body: x(
        "This volume follows one question through warehouses, last-mile transport and the hotel night shift: what changes when a manager leaves the comfort of the report, sees the actual process, and then has to act on what was found? The lens comes from Taiichi Ohno, Jim Womack and David Mann. Two studies of hospital walkrounds test the comforting assumption that visible leadership is useful in itself. They do not confirm it: observation pays only inside a credible chain of finding, owning, resolving and reporting back.",
        "Ky vëllim e ndjek një pyetje nëpër magazina, transportin e miljes së fundit dhe turnin e natës në hotel: çfarë ndryshon kur një menaxher e lë rehatinë e raportit, e sheh procesin e vërtetë, dhe pastaj duhet të veprojë mbi atë që gjeti? Këndvështrimin e japin Taiichi Ohno, Jim Womack dhe David Mann. Dy studime për vizitat e drejtuesve në repartet e spitaleve e vënë në provë supozimin ngushëllues se drejtimi i dukshëm është i dobishëm në vetvete. Nuk e konfirmojnë: vëzhgimi jep fryt vetëm brenda një zinxhiri të besueshëm gjetjeje, përgjegjësie, zgjidhjeje dhe përgjigjeje.",
        "Dieser Band verfolgt eine Frage durch Lager, die letzte Meile und die Nachtschicht im Hotel: Was ändert sich, wenn eine Führungskraft den bequemen Bericht verlässt, den tatsächlichen Prozess sieht und dann auf das Gefundene reagieren muss? Den Blickwinkel liefern Taiichi Ohno, Jim Womack und David Mann. Zwei Studien zu Führungsrundgängen in Kliniken prüfen die tröstliche Annahme, sichtbare Führung sei an sich nützlich. Sie bestätigen sie nicht: Beobachtung lohnt sich nur innerhalb einer glaubwürdigen Kette aus Finden, Verantworten, Lösen und Zurückmelden."),
    },
    { id: "contents", type: "contents" },

    // Chapter I. The visit at 03:00
    {
      id: "ch-i", type: "chapter", numeral: "I",
      title: x("A visit at 03:00", "Një vizitë në 03:00", "Ein Besuch um 03:00"),
      pages: [
        {
          id: "i-scene", layer: "scene",
          title: [x("A visit", "Një vizitë", "Ein Besuch"), x("at 03:00", "në 03:00", "um 03:00")],
          lead: x(
            "It is 03:00 in a hotel. The dashboard is quiet. A technical issue has been logged, a guest has been told the morning team will follow up, and the night shift moves on to its next task.",
            "Është 03:00 në një hotel. Paneli është i qetë. Një problem teknik është regjistruar, mysafirit i është thënë se ekipi i mëngjesit do ta ndjekë, dhe turni i natës kalon te detyra e radhës.",
            "Es ist 03:00 in einem Hotel. Das Dashboard ist ruhig. Ein technisches Problem ist erfasst, einem Gast wurde gesagt, das Frühteam kümmere sich darum, und die Nachtschicht geht zur nächsten Aufgabe über."),
          blocks: [
            { type: "flag", text: x("Constructed scene, not a reported incident", "Skenë e ndërtuar, jo ngjarje e raportuar", "Konstruierte Szene, kein gemeldeter Vorfall") },
            { type: "p", text: x(
              "On the screen the case looks handled. In reality three things stay open: whether another department accepted it, whether the guest knows when to expect an answer, and whether the incoming shift has enough context to finish it. Nothing scandalous has happened; this is an ordinary hand-off, exactly the kind of gap that vanishes inside departmental reports: reception has recorded the issue, another team has work to do, and no single screen guarantees that the chain has closed.",
              "Në ekran rasti duket i trajtuar. Në të vërtetë tri gjëra mbeten të hapura: nëse e pranoi një departament tjetër, nëse mysafiri e di kur të presë përgjigje, dhe nëse turni që vjen ka mjaft kontekst për ta mbyllur. Nuk ka ndodhur asgjë skandaloze; është një dorëzim i zakonshëm, pikërisht ai lloj zbrazëtie që zhduket brenda raporteve të departamenteve: recepsioni e ka regjistruar problemin, një ekip tjetër ka punë për të bërë, dhe asnjë ekran i vetëm nuk garanton që zinxhiri u mbyll.",
              "Auf dem Bildschirm wirkt der Fall erledigt. Tatsächlich bleiben drei Dinge offen: ob eine andere Abteilung ihn angenommen hat, ob der Gast weiß, wann er eine Antwort erwarten kann, und ob die kommende Schicht genug Kontext hat, um ihn abzuschließen. Nichts Skandalöses ist geschehen; es ist eine gewöhnliche Übergabe, genau die Art Lücke, die in Abteilungsberichten verschwindet: Die Rezeption hat das Problem erfasst, ein anderes Team hat zu tun, und kein einzelner Bildschirm garantiert, dass sich die Kette geschlossen hat.") },
            { type: "p", text: x(
              "The same shape appears in transport. A late departure is visible on a dashboard while its reason sits elsewhere: an item not ready, a mixed trolley, a late vehicle, an unclear decision at the loading point. The metric is correct about the delay and silent about its origin.",
              "E njëjta formë shfaqet në transport. Një nisje e vonuar duket në panel, ndërsa arsyeja e saj qëndron diku tjetër: një artikull jo gati, një karrocë e përzier, një automjet i vonuar, një vendim i paqartë te pika e ngarkimit. Shifra e tregon saktë vonesën, por për origjinën e saj hesht.",
              "Dieselbe Form zeigt sich im Transport. Eine verspätete Abfahrt ist auf dem Dashboard sichtbar, während ihr Grund woanders liegt: ein Artikel nicht bereit, ein gemischter Wagen, ein verspätetes Fahrzeug, eine unklare Entscheidung am Ladepunkt. Die Kennzahl gibt die Verspätung richtig wieder; über ihren Ursprung sagt sie nichts.") },
            { type: "callout", reading: true, text: x(
              "A completed entry is not always a completed piece of work.",
              "Një regjistrim i mbyllur nuk është gjithmonë një punë e mbyllur.",
              "Ein abgeschlossener Eintrag ist nicht immer eine abgeschlossene Arbeit.") },
          ],
          note: x(
            "The examples reflect common categories of hotel and last-mile work; they do not describe an identifiable guest, vehicle, shift or recorded investigation.",
            "Shembujt pasqyrojnë kategori të zakonshme të punës në hotel dhe në miljen e fundit; nuk përshkruajnë ndonjë mysafir, automjet, turn ose hetim të regjistruar që mund të identifikohet.",
            "Die Beispiele spiegeln gängige Kategorien von Hotel- und Last-Mile-Arbeit; sie beschreiben keinen identifizierbaren Gast, kein Fahrzeug, keine Schicht und keine dokumentierte Untersuchung."),
        },
        {
          id: "i-concept", layer: "concept",
          title: [x("The number", "Shifra", "Die Zahl"), x("is not the process", "nuk është procesi", "ist nicht der Prozess")],
          lead: x(
            "A last-mile scorecard compresses many events into a few numbers: delays, damaged goods, incomplete deliveries, loading time. The compression is necessary. It also throws information away.",
            "Një tabelë treguesish në miljen e fundit i ngjesh shumë ngjarje në pak shifra: vonesa, mallra të dëmtuara, dërgesa të paplota, koha e ngarkimit. Ngjeshja është e nevojshme. Por edhe hedh informacion.",
            "Eine Last-Mile-Scorecard presst viele Ereignisse in wenige Zahlen: Verspätungen, beschädigte Ware, unvollständige Lieferungen, Ladezeit. Die Verdichtung ist nötig. Dabei geht aber auch Information verloren."),
          blocks: [
            { type: "cards", cols: 2, items: [
              { h: x("What the report sees", "Çfarë sheh raporti", "Was der Bericht sieht"), p: x("A timestamp, a status change, an exception, a rate.", "Një orë, një ndryshim statusi, një përjashtim, një përqindje.", "Einen Zeitstempel, eine Statusänderung, eine Ausnahme, eine Quote.") },
              { h: x("What the walk seeks", "Çfarë kërkon vizita në terren", "Was der Rundgang sucht"), p: x("The actual sequence, the constraint and the decision that shaped the result.", "Radhën e vërtetë, kufizimin dhe vendimin që e formoi rezultatin.", "Die tatsächliche Abfolge, die Einschränkung und die Entscheidung, die das Ergebnis geprägt haben.") },
            ] },
            { type: "p", text: x(
              "The tempting shortcut is to assign ownership where the error becomes visible: the driver is late, so the driver is the cause; the night auditor carries the open item, so the night auditor failed. Both are propositions still to be tested. Taiichi Ohno taught the opposite order. According to Teruyuki Minoura, Ohno took his students to a problem area, drew a circle on the floor and had them watch and ask why, over and over, before explaining anything. In lean language the gemba is the actual place of work; genchi genbutsu means going there to examine the real thing.",
              "Shkurtorja joshëse është ta caktosh përgjegjësinë aty ku gabimi bëhet i dukshëm: shoferi vonohet, pra shoferi është shkaku; auditori i natës e mban rastin e hapur, pra auditori i natës dështoi. Të dyja janë hipoteza që ende duhen provuar. Taiichi Ohno mësonte rendin e kundërt. Sipas Teruyuki Minoura-s, Ohno i çonte nxënësit te një vend me probleme, vizatonte një rreth në dysheme dhe i linte të shikonin e të pyesnin pse, përsëri e përsëri, para se të shpjegonin gjë. Në gjuhën lean, gemba është vendi i vërtetë i punës; genchi genbutsu do të thotë të shkosh atje dhe ta shqyrtosh gjënë e vërtetë.",
              "Die verlockende Abkürzung ist, die Verantwortung dort zuzuweisen, wo der Fehler sichtbar wird: Der Fahrer ist zu spät, also ist der Fahrer die Ursache; der Night Auditor trägt den offenen Posten, also hat der Night Auditor versagt. Beides sind Annahmen, die erst zu prüfen sind. Taiichi Ohno lehrte die umgekehrte Reihenfolge. Laut Teruyuki Minoura führte Ohno seine Schüler an einen Problemort, zeichnete einen Kreis auf den Boden und ließ sie beobachten und immer wieder nach dem Warum fragen, bevor jemand etwas erklärte. In der Lean-Sprache ist das Gemba der tatsächliche Ort der Arbeit; Genchi Genbutsu heißt, hinzugehen und die reale Sache zu prüfen.") },
            { type: "callout", reading: true, text: x(
              "Seeing accurately comes before being seen: the report tells us where to look, the observed process tells us what to ask next.",
              "Të shohësh saktë vjen para se të të shohin: raporti na thotë ku të shikojmë, procesi i vëzhguar na thotë çfarë të pyesim më pas.",
              "Genau sehen kommt vor dem Gesehenwerden: Der Bericht sagt uns, wohin wir schauen sollen, der beobachtete Prozess, was wir als Nächstes fragen sollen.") },
          ],
          note: x(
            "The circle is known from the accounts of Ohno's students; how long they stood in it varies from one telling to another, so we give no figure. The terms follow the Lean Enterprise Institute's lexicon.",
            "Rrethi njihet nga rrëfimet e nxënësve të Ohno-s; sa gjatë qëndronin në të ndryshon nga një rrëfim te tjetri, ndaj nuk japim shifër. Termat ndjekin fjalorin e Lean Enterprise Institute.",
            "Der Kreis ist aus Erzählungen von Ohnos Schülern bekannt; wie lange sie darin standen, schwankt von Erzählung zu Erzählung, deshalb nennen wir keine Zahl. Die Begriffe folgen dem Lexikon des Lean Enterprise Institute."),
          source: ["teresko-2004", "lei-gemba-walk"],
        },
        {
          id: "i-protocol", layer: "protocol", more: "gemba",
          title: [x("See before", "Shiko para se", "Sehen, bevor"), x("you diagnose", "të diagnostikosh", "Sie diagnostizieren")],
          lead: x(
            "The walk begins by resisting immediate judgment. Standing beside the work is easy; inquiry takes discipline. Four questions, asked in this order, keep the two apart.",
            "Vizita në terren nis duke i rezistuar gjykimit të menjëhershëm. Të qëndrosh pranë punës është e lehtë; hetimi kërkon disiplinë. Katër pyetje, të bëra në këtë radhë, i mbajnë të ndara.",
            "Der Rundgang beginnt damit, dem schnellen Urteil zu widerstehen. Neben der Arbeit zu stehen ist leicht; Nachfragen verlangt Disziplin. Vier Fragen, in dieser Reihenfolge gestellt, halten beides auseinander."),
          blocks: [
            { type: "steps", items: [
              { h: x("What was meant to happen?", "Çfarë duhej të ndodhte?", "Was sollte geschehen?"), p: x("The standard, as it is written or as the team describes it.", "Standardi, siç është shkruar ose siç e përshkruan ekipi.", "Der Standard, wie er geschrieben steht oder wie das Team ihn beschreibt.") },
              { h: x("What happened instead?", "Çfarë ndodhi në vend të tij?", "Was geschah stattdessen?"), p: x("The observed sequence, with times and places, leaving motives aside.", "Radha e vëzhguar, me orë dhe vende, duke i lënë mënjanë motivet.", "Die beobachtete Abfolge, mit Zeiten und Orten, Motive beiseitegelassen.") },
              { h: x("What condition made the deviation possible?", "Cili kusht e bëri të mundur devijimin?", "Welche Bedingung machte die Abweichung möglich?"), p: x("A missing item, an unclear rule, a tool that was not there, a decision nobody owned.", "Një artikull që mungonte, një rregull i paqartë, një mjet që nuk ishte aty, një vendim për të cilin nuk përgjigjej askush.", "Ein fehlender Artikel, eine unklare Regel, ein fehlendes Werkzeug, eine Entscheidung ohne Verantwortlichen.") },
              { h: x("Which parts of the explanation can be checked?", "Cilat pjesë të shpjegimit mund të kontrollohen?", "Welche Teile der Erklärung lassen sich prüfen?"), p: x("Against the log, the scan, the note, the next department.", "Me regjistrin, skanimin, shënimin, departamentin tjetër.", "Am Protokoll, am Scan, an der Notiz, an der nächsten Abteilung.") },
            ] },
            { type: "p", text: x(
              "The answers may confirm the standard, reveal a broken hand-off, or show that the standard itself no longer fits the work. A manager can stand beside a process and learn nothing, especially when everyone nearby is performing the correct answer for the visitor. The questions are what turn presence into evidence.",
              "Përgjigjet mund ta konfirmojnë standardin, të zbulojnë një dorëzim të prishur, ose të tregojnë se vetë standardi nuk i përshtatet më punës. Një menaxher mund të qëndrojë pranë një procesi dhe të mos mësojë asgjë, sidomos kur të gjithë përreth po luajnë përgjigjen e saktë për vizitorin. Pyetjet janë ato që e kthejnë praninë në provë.",
              "Die Antworten können den Standard bestätigen, eine gebrochene Übergabe aufdecken oder zeigen, dass der Standard nicht mehr zur Arbeit passt. Eine Führungskraft kann neben einem Prozess stehen und nichts lernen, besonders wenn alle dem Besucher die richtige Antwort vorspielen. Erst die Fragen machen aus Anwesenheit Belege.") },
            { type: "callout", reading: true, text: x(
              "Ask for the work to be shown, not described from memory. Separate the fact from the first theory about its cause.",
              "Kërko që puna të të tregohet, jo të përshkruhet nga kujtesa. Ndaje faktin nga teoria e parë për shkakun e tij.",
              "Lassen Sie sich die Arbeit zeigen, statt sie aus dem Gedächtnis beschreiben zu lassen. Trennen Sie die Tatsache von der ersten Theorie über ihre Ursache.") },
          ],
          note: x(
            "A practice proposed by the editors, after Ohno's circle and the Lean Enterprise Institute's definition of the gemba walk: grasping the situation by observation and inquiry before taking action.",
            "Praktikë e propozuar nga redaksia, sipas rrethit të Ohno-s dhe përkufizimit të Lean Enterprise Institute për vizitën në terren (gemba walk): të kuptosh gjendjen duke vëzhguar dhe duke pyetur, para se të veprosh.",
            "Eine Praxis, die die Redaktion vorschlägt, nach Ohnos Kreis und der Definition des Gemba-Rundgangs beim Lean Enterprise Institute: die Lage durch Beobachten und Fragen erfassen, bevor gehandelt wird."),
          source: ["lei-gemba-walk", "teresko-2004"],
        },
      ],
    },

    // Chapter II. Follow one piece of work
    {
      id: "ch-ii", type: "chapter", numeral: "II",
      title: x("Follow one piece of work", "Ndiq një punë të vetme", "Einem Stück Arbeit folgen"),
      pages: [
        {
          id: "ii-scene", layer: "scene",
          title: [x("Follow one", "Ndiq një", "Einem Stück Arbeit"), x("piece of work", "punë të vetme", "folgen")],
          lead: x(
            "Imagine following a single order from the warehouse preparation stage to the loading point, through the vehicle and on to the customer. At each transfer the content changes hands, and so do the assumptions.",
            "Imagjino të ndjekësh një porosi të vetme nga faza e përgatitjes në magazinë te pika e ngarkimit, nëpër automjet dhe deri te klienti. Në çdo kalim ndërrojnë duar përmbajtja, dhe bashkë me të supozimet.",
            "Folgen Sie in Gedanken einem einzigen Auftrag von der Vorbereitung im Lager zum Ladepunkt, durch das Fahrzeug bis zum Kunden. Bei jeder Übergabe geht der Inhalt in andere Hände über, und mit ihm die Annahmen."),
          blocks: [
            { type: "flag", text: x("Conceptual route, not a reconstruction of a particular company's run", "Rrugë konceptuale, jo rindërtim i rrugës së një kompanie të caktuar", "Konzeptionelle Route, keine Rekonstruktion der Tour eines bestimmten Unternehmens") },
            { type: "chain", items: [
              { h: x("Prepare", "Përgatit", "Vorbereiten"), p: x("Is it the correct, complete item?", "A është artikulli i saktë dhe i plotë?", "Ist es der richtige, vollständige Artikel?") },
              { h: x("Hand over", "Dorëzo", "Übergeben"), p: x("Did the status travel with it?", "A udhëtoi statusi bashkë me të?", "Ist der Status mitgereist?") },
              { h: x("Load", "Ngarko", "Laden"), p: x("Is the sequence right?", "A është radha e saktë?", "Stimmt die Reihenfolge?") },
              { h: x("Deliver", "Dorëzo te klienti", "Liefern"), p: x("Did the customer get the result?", "A e mori klienti rezultatin?", "Hat der Kunde das Ergebnis bekommen?") },
            ] },
            { type: "p", text: x(
              "The item is complete, the labels are legible, the temperature rules were respected, the loading sequence is correct, the next person has received the right status. Sometimes the most useful finding is an informal repair: one experienced worker knows which label to check twice, which teammate to call, which exception will break the sequence. The organisation counts the final delivery as a success while the real process depends on a person quietly compensating for a weak rule. If that person is absent tomorrow, the performance may disappear with them.",
              "Artikulli është i plotë, etiketat lexohen, rregullat e temperaturës u respektuan, radha e ngarkimit është e saktë, personi tjetër e ka marrë statusin e duhur. Nganjëherë gjetja më e dobishme është një riparim joformal: një punonjës me përvojë e di cilën etiketë ta kontrollojë dy herë, cilin koleg ta thërrasë, cili përjashtim do ta prishë radhën. Organizata e numëron dorëzimin e fundit si sukses, ndërsa procesi i vërtetë varet nga një njeri që në heshtje kompenson një rregull të dobët. Nëse ai njeri mungon nesër, performanca mund të zhduket bashkë me të.",
              "Der Artikel ist vollständig, die Etiketten sind lesbar, die Temperaturregeln wurden eingehalten, die Ladereihenfolge stimmt, die nächste Person hat den richtigen Status erhalten. Manchmal ist der nützlichste Befund eine informelle Reparatur: Eine erfahrene Kraft weiß, welches Etikett zweimal zu prüfen ist, welchen Kollegen sie anruft, welche Ausnahme die Reihenfolge sprengt. Die Organisation zählt die Lieferung als Erfolg, während der wirkliche Prozess von einem Menschen abhängt, der still eine schwache Regel ausgleicht. Fehlt dieser Mensch morgen, kann die Leistung mit ihm verschwinden.") },
            { type: "callout", reading: true, text: x(
              "A department can look efficient while sending friction downstream. The walk has to reveal both the formal process and the hidden labour that makes it work.",
              "Një departament mund të duket efikas, ndërsa ua kalon vështirësitë ekipeve që vijnë pas tij. Vizita në terren duhet të zbulojë edhe procesin formal, edhe punën e fshehur që e bën të funksionojë.",
              "Eine Abteilung kann effizient aussehen, während sie ihre Schwierigkeiten an die nachfolgenden Teams weiterreicht. Der Rundgang muss beides zeigen: den formalen Prozess und die verborgene Arbeit, die ihn am Laufen hält.") },
          ],
          note: x(
            "A conventional departmental review asks whether each team met its own target. A value-stream walk asks whether the whole customer outcome was protected as the work crossed teams. Each question can miss what the other catches.",
            "Një rishikim i zakonshëm i departamentit pyet nëse çdo ekip e arriti objektivin e vet. Një vizitë përgjatë rrjedhës së vlerës pyet nëse rezultati i plotë për klientin u mbrojt ndërsa puna kaloi nëpër ekipe. Secila pyetje mund të humbasë atë që kap tjetra.",
            "Eine übliche Abteilungsbesprechung fragt, ob jedes Team sein eigenes Ziel erreicht hat. Ein Wertstrom-Rundgang fragt, ob das ganze Kundenergebnis geschützt blieb, während die Arbeit die Teams durchlief. Jede der beiden Fragen kann übersehen, was die andere erfasst."),
        },
        {
          id: "ii-concept", layer: "concept",
          title: [x("Purpose, process,", "Qëllimi, procesi,", "Zweck, Prozess,"), x("people", "njerëzit", "Menschen")],
          lead: x(
            "Jim Womack describes a recurring contradiction: value flows horizontally towards customers, while authority, budgets and scorecards are arranged vertically by function. A manager who looks only inside one department can miss the boundary where a problem takes shape.",
            "Jim Womack përshkruan një kundërthënie që përsëritet: vlera rrjedh horizontalisht drejt klientëve, ndërsa autoriteti, buxhetet dhe tabelat e treguesve janë renditur vertikalisht sipas funksionit. Një menaxher që shikon vetëm brenda një departamenti mund ta humbasë kufirin ku merr formë një problem.",
            "Jim Womack beschreibt einen wiederkehrenden Widerspruch: Wert fließt waagerecht zum Kunden, Befugnis, Budgets und Scorecards sind senkrecht nach Funktion angeordnet. Wer nur in eine Abteilung schaut, verpasst die Grenze, an der ein Problem entsteht."),
          blocks: [
            { type: "cards", cols: 3, items: [
              { h: x("Purpose", "Qëllimi", "Zweck"), p: x("What problem does this stream solve for the customer?", "Çfarë problemi i zgjidh klientit kjo rrjedhë?", "Welches Problem löst dieser Strom für den Kunden?") },
              { h: x("Process", "Procesi", "Prozess"), p: x("How does value actually travel, step by step?", "Si udhëton vlera në të vërtetë, hap pas hapi?", "Wie bewegt sich der Wert tatsächlich, Schritt für Schritt?") },
              { h: x("People", "Njerëzit", "Menschen"), p: x("Can the people doing the work sustain and improve it?", "A mund ta mbajnë dhe ta përmirësojnë njerëzit që e bëjnë punën?", "Können die Menschen, die die Arbeit tun, sie erhalten und verbessern?") },
            ] },
            { type: "p", text: x(
              "This reframes a walk: instead of an unannounced visit to check whether the team is behaving, it becomes an investigation of a value stream, walked with everyone who touches it. David Mann adds the distinction between compliance theatre and a repeatable routine: the leader does not come to hear the standard recited, but asks what the process is, how the team knows it works, what happens when it fails, and what is being improved. A workaround found this way is a clue, not misconduct: an obsolete instruction, a capacity gap or an exception the procedure never anticipated.",
              "Kështu vizita në terren merr një kuptim tjetër: në vend të një vizite të paparalajmëruar për të parë nëse ekipi po sillet mirë, bëhet hetim i një rrjedhe vlere, i bërë bashkë me të gjithë ata që e prekin. David Mann shton dallimin mes respektimit të rregullave për sy e faqe dhe një rutine të përsëritshme: drejtuesi nuk vjen për ta dëgjuar standardin të recituar, por pyet cili është procesi, si e di ekipi që funksionon, çfarë ndodh kur dështon, dhe çfarë po përmirësohet. Një rrugë anësore e gjetur kështu është një e dhënë, jo shkelje: një udhëzim i vjetruar, një mungesë kapaciteti ose një përjashtim që procedura nuk e parashikoi.",
              "Damit bekommt der Rundgang eine andere Bedeutung: Statt eines unangekündigten Besuchs, der prüft, ob sich das Team benimmt, wird er zur Untersuchung eines Wertstroms mit allen, die ihn berühren. David Mann unterscheidet Compliance-Theater von wiederholbarer Routine: Die Führungskraft kommt nicht, um den Standard aufsagen zu hören, sondern fragt, was der Prozess ist, woran das Team erkennt, dass er funktioniert, was geschieht, wenn er versagt, und was verbessert wird. Ein so gefundener Umweg ist ein Hinweis, kein Fehlverhalten: eine veraltete Anweisung, eine Kapazitätslücke oder eine nie vorgesehene Ausnahme.") },
            { type: "callout", reading: true, text: x(
              "Walking alone shows a department. Walking the stream together shows the hand-offs, where problems usually wait.",
              "Kur ecën vetëm, sheh një departament. Kur ecni rrjedhën bashkë, shihni dorëzimet, aty ku zakonisht presin problemet.",
              "Wer allein geht, sieht eine Abteilung. Wer den Strom gemeinsam abgeht, sieht die Übergaben, wo Probleme meist warten.") },
          ],
          note: x(
            "Womack's three questions follow his column of 2006 and the Lean Enterprise Institute's lexicon; Mann's four questions are from a 2014 interview; his book was not seen. The reading is the editors'.",
            "Tri pyetjet e Womack-ut ndjekin kolonën e tij të 2006 dhe fjalorin e Lean Enterprise Institute; katër pyetjet e Mann-it janë nga një intervistë e 2014; libri i tij nuk u pa. Leximi është i redaksisë.",
            "Womacks drei Fragen folgen seiner Kolumne von 2006 und dem Lexikon des Lean Enterprise Institute; Manns vier Fragen stammen aus einem Interview von 2014, sein Buch wurde nicht eingesehen. Die Deutung stammt von der Redaktion."),
          source: ["womack-2006", "lei-gemba-walk", "womack-2011", "mann-2005", "mann-2014"],
        },
        {
          id: "ii-protocol", layer: "protocol", more: "why-the-handover-is-underrated",
          title: [x("The handover that", "Dorëzimi që", "Die Übergabe, die"), x("survives the morning", "i mbijeton mëngjesit", "den Morgen übersteht")],
          lead: x(
            "A hotel adds a dimension to the stream: work changes hands not only between departments but between hours. A note must carry the facts and enough context to preserve the decision already made.",
            "Hoteli i shton rrjedhës një përmasë: puna ndërron duar jo vetëm mes departamenteve, por edhe mes orëve. Një shënim duhet të mbartë faktet dhe mjaft kontekst për ta ruajtur vendimin e marrë tashmë.",
            "Das Hotel fügt dem Strom eine Dimension hinzu: Arbeit wird nicht nur zwischen Abteilungen übergeben, sondern zwischen Stunden. Eine Notiz muss die Fakten tragen und genug Kontext, um die bereits getroffene Entscheidung zu bewahren."),
          blocks: [
            { type: "chain", items: [
              { h: x("Issue received", "Problemi i raportuar", "Anliegen erhalten"), p: x("What, where, when, in the reporter's words.", "Çfarë, ku, kur, me fjalët e atij që e raportoi.", "Was, wo, wann, in den Worten des Meldenden.") },
              { h: x("Action taken", "Veprimi i bërë", "Maßnahme getroffen"), p: x("Only what was really done, not what was hoped.", "Vetëm ajo që u bë vërtet, jo ajo që shpresohej.", "Nur, was wirklich getan wurde, nicht, was erhofft war.") },
              { h: x("Status confirmed", "Statusi i konfirmuar", "Status bestätigt"), p: x("Open or closed, checked by whom.", "I hapur apo i mbyllur, i kontrolluar nga kush.", "Offen oder geschlossen, von wem geprüft.") },
              { h: x("Next owner informed", "Përgjegjësi i radhës i njoftuar", "Nächster Verantwortlicher informiert"), p: x("Who continues, through which channel, and when the guest hears.", "Kush vazhdon, përmes cilit kanal, dhe kur dëgjon mysafiri.", "Wer weitermacht, über welchen Kanal, und wann der Gast etwas hört.") },
            ] },
            { type: "p", text: x(
              "The same logic holds at a warehouse shift change. A task described as passed on stays fragile until the receiver knows the status, accepts responsibility and understands the exception. The test is simple: can the next person continue without asking the guest, or the previous shift, to repeat the whole history?",
              "E njëjta logjikë vlen në ndërrimin e turnit në magazinë. Një detyrë e përshkruar si e kaluar mbetet e brishtë derisa marrësi ta dijë statusin, ta pranojë përgjegjësinë dhe ta kuptojë përjashtimin. Prova është e thjeshtë: a mund të vazhdojë personi tjetër pa i kërkuar mysafirit, ose turnit të mëparshëm, ta përsërisë gjithë historinë?",
              "Dieselbe Logik gilt beim Schichtwechsel im Lager. Eine als weitergegeben beschriebene Aufgabe bleibt zerbrechlich, bis der Empfänger den Status kennt, die Verantwortung annimmt und die Ausnahme versteht. Der Test ist einfach: Kann die nächste Person weitermachen, ohne den Gast oder die vorige Schicht zu bitten, die ganze Geschichte zu wiederholen?") },
            { type: "callout", reading: true, text: x(
              "The handover is complete when the next person can work with it.",
              "Dorëzimi është i plotë kur personi tjetër mund të punojë me të.",
              "Die Übergabe ist vollständig, wenn die nächste Person damit arbeiten kann.") },
          ],
          note: x(
            "A practice proposed by the editors, after Womack's value-stream lens and Mann's four questions; the author's own night-audit experience is in the essay named below, not claimed as data here.",
            "Praktikë e propozuar nga redaksia, sipas këndvështrimit të rrjedhës së vlerës të Womack-ut dhe katër pyetjeve të Mann-it; përvoja e vetë autorit në auditimin e natës është te eseja më poshtë, jo e pretenduar këtu si e dhënë.",
            "Eine Praxis, die die Redaktion vorschlägt, nach Womacks Wertstrom-Blickwinkel und Manns vier Fragen; die eigene Nachtaudit-Erfahrung des Autors steht im unten genannten Essay, hier nicht als Daten angeführt."),
          source: ["womack-2006", "mann-2014"],
        },
      ],
    },

    // Chapter III. The visit that changes nothing
    {
      id: "ch-iii", type: "chapter", numeral: "III",
      title: x("The visit that changes nothing", "Vizita që nuk ndryshon asgjë", "Der Besuch, der nichts ändert"),
      pages: [
        {
          id: "iii-scene", layer: "scene",
          title: [x("The visit that", "Vizita që", "Der Besuch, der"), x("changes nothing", "nuk ndryshon asgjë", "nichts ändert")],
          lead: x(
            "A senior manager makes a late visit. Colleagues explain a recurring obstacle that makes their shift harder. The manager writes it down, thanks them and leaves. Days pass.",
            "Një drejtues i lartë bën një vizitë të vonë. Kolegët shpjegojnë një pengesë që përsëritet dhe ua vështirëson turnin. Drejtuesi e shënon, i falënderon dhe largohet. Kalojnë ditë.",
            "Eine Führungskraft macht einen späten Besuch. Kollegen erklären ein wiederkehrendes Hindernis, das ihre Schicht schwerer macht. Die Führungskraft notiert es, bedankt sich und geht. Tage vergehen."),
          blocks: [
            { type: "flag", text: x("Constructed scene, not an account of a named leader", "Skenë e ndërtuar, jo rrëfim për një drejtues të caktuar", "Konstruierte Szene, kein Bericht über eine bestimmte Führungskraft") },
            { type: "p", text: x(
              "On the next visit the staff are asked to explain the same obstacle. They cannot point to a decision, an owner or a deadline from the first time. At the first visit the team may have felt heard; at the second, the invitation to speak begins to look like more work. The visit has created a task for the employees, describing a known problem again, while their capacity to solve it has not changed.",
              "Në vizitën e radhës punonjësve u kërkohet ta shpjegojnë të njëjtën pengesë. Nuk mund të tregojnë asnjë vendim, përgjegjës ose afat nga hera e parë. Në vizitën e parë ekipi mund të jetë ndier i dëgjuar; në të dytën, ftesa për të folur nis të duket si punë shtesë. Vizita u ka krijuar punonjësve një detyrë, ta përshkruajnë sërish një problem të njohur, ndërsa aftësia e tyre për ta zgjidhur nuk ka ndryshuar.",
              "Beim nächsten Besuch werden die Beschäftigten gebeten, dasselbe Hindernis zu erklären. Sie können auf keine Entscheidung, keinen Verantwortlichen und keine Frist vom ersten Mal verweisen. Beim ersten Besuch fühlte sich das Team vielleicht gehört; beim zweiten sieht die Einladung zu sprechen nach Mehrarbeit aus. Der Besuch hat den Beschäftigten eine Aufgabe geschaffen, ein bekanntes Problem noch einmal zu beschreiben, während ihre Fähigkeit, es zu lösen, unverändert ist.") },
            { type: "p", text: x(
              "Workers can tell whether a visit is an inquiry or an inspection. When a leader arrives with a verdict, the safest response is to show the leader what the leader expects to see. That is a poor way to learn what happens on an ordinary shift, and a worse way to earn the next honest answer.",
              "Punonjësit e dallojnë nëse një vizitë është hetim apo inspektim. Kur drejtuesi vjen me një verdikt, përgjigjja më e sigurt është t'i tregosh atë që pret të shohë. Kjo është mënyrë e dobët për të mësuar çfarë ndodh në një turn të zakonshëm, dhe mënyrë edhe më e keqe për të fituar përgjigjen e ardhshme të sinqertë.",
              "Beschäftigte merken, ob ein Besuch Nachfrage oder Inspektion ist. Kommt eine Führungskraft mit einem Urteil, ist die sicherste Antwort, ihr zu zeigen, was sie erwartet. Das ist ein schlechter Weg zu erfahren, was in einer gewöhnlichen Schicht geschieht, und ein noch schlechterer, sich die nächste ehrliche Antwort zu verdienen.") },
            { type: "callout", reading: true, text: x(
              "If listening creates expectations, silence after listening is part of the intervention.",
              "Nëse dëgjimi krijon pritshmëri, heshtja pas dëgjimit është pjesë e ndërhyrjes.",
              "Wenn Zuhören Erwartungen weckt, ist das Schweigen danach Teil der Intervention.") },
          ],
          note: x(
            "A constructed illustration of a general risk, not an account of a named leader or workplace. Its weight rests on the two studies that follow.",
            "Ilustrim i ndërtuar i një rreziku të përgjithshëm, jo rrëfim për një drejtues ose vend pune të caktuar. Pesha e tij qëndron te dy studimet që vijojnë.",
            "Eine konstruierte Illustration eines allgemeinen Risikos, kein Bericht über eine bestimmte Führungskraft oder einen Arbeitsplatz. Ihr Gewicht ruht auf den zwei Studien, die folgen."),
        },
        {
          id: "iii-study", layer: "concept",
          title: [x("When walking", "Kur vizitat", "Als die Rundgänge"), x("made things worse", "i përkeqësuan gjërat", "schadeten")],
          lead: x(
            "Anita Tucker and Sara Singer tested management by walking around in US hospitals chosen at random. For 18 months senior managers observed frontline work, asked for ideas and worked with staff on the problems. 56 work areas took part; 138 in control hospitals did not.",
            "Anita Tucker dhe Sara Singer e provuan menaxhimin me vizita në terren në spitale të SHBA-së të zgjedhura rastësisht. Për 18 muaj drejtuesit e lartë vëzhguan punën e vijës së parë, kërkuan ide dhe punuan me stafin për problemet. Morën pjesë 56 reparte; 138 reparte në spitalet e kontrollit jo.",
            "Anita Tucker und Sara Singer testeten Management by Walking Around in zufällig ausgewählten US-Kliniken. 18 Monate lang beobachtete die oberste Leitung die Arbeit vor Ort, sammelte Ideen und arbeitete mit dem Personal an den Problemen. 56 Bereiche nahmen teil, 138 in Kontrollkliniken nicht."),
          blocks: [
            { type: "columns", max: 20, height: 100, source: ["tucker-singer-2015"],
              label: x("Problems per work area, on average (2013)", "Problemet për repart, mesatarisht (2013)", "Probleme je Bereich, im Schnitt (2013)"),
              items: [
                { k: x("Found", "U gjetën", "Gefunden"), v: 19, n: "19" },
                { k: x("Acted on", "U trajtuan", "Bearbeitet"), v: 11, n: "11", alert: true },
              ] },
            { type: "p", text: x(
              "On average the programme lowered the staff's rating of improvement compared with the control areas. It worked better where teams took on problems they could solve within about 30 days, and where a senior manager was made responsible for seeing a problem through. The implication is uncomfortable: asking frontline staff to reveal barriers can make leadership look less credible if the barriers remain.",
              "Mesatarisht programi e uli vlerësimin e stafit për përmirësimin, krahasuar me repartet e kontrollit. Funksionoi më mirë aty ku ekipet morën përsipër probleme që zgjidheshin brenda rreth 30 ditëve, dhe aty ku një drejtues i lartë u bë përgjegjës që problemi të çohej deri në fund. Pasoja është e pakëndshme: t'u kërkosh punonjësve të vijës së parë të zbulojnë pengesat mund ta bëjë drejtimin më pak të besueshëm, nëse pengesat mbeten.",
              "Im Schnitt senkte das Programm die Einschätzung des Personals, ob sich etwas verbessert, im Vergleich zu den Kontrollbereichen. Besser wirkte es, wo Teams Probleme angingen, die sich in etwa 30 Tagen lösen ließen, und wo ein Mitglied der Leitung ein Problem zu Ende bringen musste. Die Folgerung ist unbequem: Beschäftigte um Hindernisse zu bitten, kann die Führung weniger glaubwürdig machen, wenn die Hindernisse bleiben.") },
            { type: "callout", reading: true, text: x(
              "A walk pays only when what it finds gets fixed. The thirty days were a research classification, not a universal deadline.",
              "Vizita në terren jep fryt vetëm kur ajo që gjen rregullohet. Tridhjetë ditët ishin një klasifikim kërkimor, jo një afat universal.",
              "Ein Rundgang lohnt sich erst, wenn behoben wird, was er findet. Die dreißig Tage waren eine Forschungsklassifikation, keine allgemeine Frist.") },
          ],
          note: x(
            "Improvement was rated by nurses on a 1–5 scale, before (2004) and after (2006); the counts per work area come from the 2013 working paper, the published article (2015) reports the same design. Hospital findings are not a measure of warehouse or hotel performance.",
            "Përmirësimin e vlerësuan infermierët në një shkallë 1–5, para (2004) dhe pas (2006); numrat për repart vijnë nga versioni i punës i 2013, artikulli i botuar (2015) jep të njëjtin dizajn. Gjetjet spitalore nuk janë masë e performancës së magazinës ose hotelit.",
            "Die Verbesserung bewerteten Pflegekräfte auf einer Skala von 1 bis 5, vorher (2004) und nachher (2006); die Zahlen je Bereich stammen aus dem Arbeitspapier von 2013, der veröffentlichte Artikel (2015) nennt dasselbe Design. Klinikbefunde messen keine Lager- oder Hotelleistung."),
          source: ["tucker-singer-2015"],
        },
        {
          id: "iii-feedback", layer: "concept",
          title: [x("When nobody", "Kur askush", "Wenn niemand"), x("hears back", "nuk merr përgjigje", "Antwort bekommt")],
          lead: x(
            "J. Bryan Sexton and colleagues surveyed staff in 44 US neonatal intensive care units about leadership walkrounds; 2,073 of 3,294 answered (62.9%). They asked whether leaders visited, and also whether staff knew of the visits and heard what changed.",
            "J. Bryan Sexton dhe kolegët anketuan punonjësit e 44 njësive të terapisë intensive neonatale në SHBA për vizitat e drejtuesve në terren; u përgjigjën 2.073 nga 3.294 (62,9%). Pyetën nëse drejtuesit vizitonin, por edhe nëse punonjësit dinin për vizitat dhe dëgjonin çfarë ndryshoi.",
            "J. Bryan Sexton und Kollegen befragten Beschäftigte in 44 neonatologischen Intensivstationen in den USA zu Führungsrundgängen; 2.073 von 3.294 antworteten (62,9 %). Gefragt wurde, ob die Leitung kam, und auch, ob die Beschäftigten von den Besuchen wussten und erfuhren, was sich änderte."),
          blocks: [
            { type: "hbars", source: ["sexton-2014"],
              label: x("Staff in 44 neonatal intensive care units, 2011", "Punonjësit në 44 njësi të terapisë intensive neonatale, 2011", "Beschäftigte in 44 neonatologischen Intensivstationen, 2011"),
              items: [
                { k: x("Took part in a walkround", "Morën pjesë në një vizitë", "Nahmen an einem Rundgang teil"), v: 20.9, n: x("20.9%", "20,9%", "20,9 %") },
                { k: x("Heard back about actions taken", "Morën përgjigje për veprimet e bëra", "Erfuhren von getroffenen Maßnahmen"), v: 18.4, n: x("18.4%", "18,4%", "18,4 %") },
                { k: x("Not sure walkrounds took place", "Nuk e dinin nëse bëheshin vizita", "Unsicher, ob es Rundgänge gab"), v: 49.1, n: x("49.1%", "49,1%", "49,1 %"), alert: true },
              ] },
            { type: "p", text: x(
              "Units where more staff heard back about the actions taken rated their safety culture better and tended to report less burnout. The study is cross-sectional: it shows an association, not a cause. Put beside the first study it suggests a mechanism worth testing. Observation can reveal constraints; the finding must then be interpreted, owned, acted on and reported back to the people who live with it. Each transition can fail even when the walk itself was sincere.",
              "Njësitë ku më shumë punonjës morën përgjigje për veprimet e bëra e vlerësuan më mirë kulturën e sigurisë dhe prireshin të raportonin më pak rraskapitje. Studimi është në një moment të vetëm: tregon lidhje, jo shkak. Vënë pranë studimit të parë, sugjeron një mekanizëm që ia vlen të provohet. Vëzhgimi mund të zbulojë kufizime; gjetja pastaj duhet interpretuar, marrë përsipër, vënë në veprim dhe raportuar te njerëzit që jetojnë me të. Çdo kalim mund të dështojë edhe kur vetë vizita ishte e sinqertë.",
              "Stationen, in denen mehr Beschäftigte von den getroffenen Maßnahmen erfuhren, bewerteten ihre Sicherheitskultur besser und berichteten tendenziell weniger Burnout. Die Studie ist eine Querschnittsbefragung: Sie zeigt einen Zusammenhang, keine Ursache. Neben die erste Studie gestellt, legt sie einen Mechanismus nahe, den zu prüfen sich lohnt. Beobachtung kann Einschränkungen aufdecken; der Befund muss dann gedeutet, verantwortet, umgesetzt und an die Menschen zurückgemeldet werden, die mit ihm leben. Jeder Übergang kann scheitern, auch wenn der Rundgang selbst aufrichtig war.") },
            { type: "chain", items: [
              { h: x("Observe", "Vëzhgo", "Beobachten"), p: x("the real sequence", "radhën e vërtetë", "die reale Abfolge") },
              { h: x("Verify", "Verifiko", "Prüfen"), p: x("the cause, not the first theory", "shkakun, jo teorinë e parë", "die Ursache, nicht die erste Theorie") },
              { h: x("Assign", "Cakto", "Zuweisen"), p: x("a named owner", "një përgjegjës me emër", "einen benannten Verantwortlichen") },
              { h: x("Act", "Vepro", "Handeln"), p: x("change a condition", "ndrysho një kusht", "eine Bedingung ändern") },
              { h: x("Tell back", "Trego", "Zurückmelden"), p: x("return the answer", "kthe përgjigjen", "die Antwort zurückbringen") },
            ] },
          ],
          note: x(
            "Participation and feedback are averages of the units; 49.1% is the share of all who answered. The chain is an editorial hypothesis built on these two studies, Womack and Mann, not a published multivariable estimate.",
            "Pjesëmarrja dhe përgjigjja janë mesatare të njësive; 49,1% është pjesa e të gjithë atyre që u përgjigjën. Zinxhiri është një hipotezë editoriale e ndërtuar mbi këto dy studime, Womack-un dhe Mann-in, jo një vlerësim shumëvariabël i botuar.",
            "Teilnahme und Rückmeldung sind Mittelwerte der Stationen; 49,1 % ist der Anteil aller Antwortenden. Die Kette ist eine redaktionelle Hypothese auf Grundlage dieser zwei Studien, Womack und Mann, keine veröffentlichte multivariable Schätzung."),
          source: ["sexton-2014", "tucker-singer-2015"],
        },
        {
          id: "iii-protocol", layer: "protocol", more: "mistakes-get-lost-between-departments",
          title: [x("Count the", "Numëro", "Zählen Sie das"), x("follow-through", "ndjekjen deri në fund", "Nachfassen")],
          lead: x(
            "A raw count of walks is easy to produce and easy to game. A more useful scorecard measures what happened after the visit, and keeps the feedback share apart from the resolution share.",
            "Një numërim i thjeshtë i vizitave prodhohet lehtë dhe manipulohet lehtë. Një tabelë më e dobishme mat çfarë ndodhi pas vizitës, dhe e mban pjesën e përgjigjes të ndarë nga pjesa e zgjidhjes.",
            "Die bloße Zahl der Rundgänge ist leicht zu erzeugen und leicht zu schönen. Nützlicher ist eine Scorecard, die misst, was nach dem Besuch geschah, und den Anteil der Rückmeldungen vom Anteil der Lösungen getrennt hält."),
          blocks: [
            { type: "rows", compact: true, items: [
              { h: x("Walks held", "Vizitat e bëra", "Rundgänge durchgeführt"), p: x("Completed of scheduled.", "Të bëra nga të planifikuarat.", "Durchgeführte von den geplanten.") },
              { h: x("Issues verified", "Problemet e verifikuara", "Probleme geprüft"), p: x("Specific problems checked on the floor.", "Probleme të caktuara të kontrolluara në terren.", "Konkrete Probleme vor Ort geprüft.") },
              { h: x("Owner assigned", "Përgjegjësi i caktuar", "Verantwortlicher benannt"), p: x("Issues with a named role.", "Probleme me një rol të emërtuar.", "Probleme mit benannter Rolle.") },
              { h: x("Action completed", "Veprimi i përfunduar", "Maßnahme abgeschlossen"), p: x("Verified completions of those due.", "Përfundime të verifikuara nga ato me afat.", "Geprüfte Abschlüsse von den fälligen.") },
              { h: x("Told back", "I treguar ekipit", "Zurückgemeldet"), p: x("Staff informed of those resolved.", "Punonjës të njoftuar për ato të zgjidhura.", "Beschäftigte über die gelösten informiert.") },
            ] },
            { type: "timeline", items: [
              { k: x("Day 0", "Dita 0", "Tag 0"), t: x("Observe; record facts and immediate risk.", "Vëzhgo; shëno faktet dhe rrezikun e menjëhershëm.", "Beobachten; Fakten und akutes Risiko festhalten.") },
              { k: x("Day 3", "Dita 3", "Tag 3"), t: x("Verify the cause; name the owner and the next action.", "Verifiko shkakun; emërto përgjegjësin dhe veprimin e radhës.", "Ursache prüfen; Verantwortlichen und nächsten Schritt nennen.") },
              { k: x("Day 10", "Dita 10", "Tag 10"), t: x("Check progress; remove cross-team barriers.", "Kontrollo ecurinë; hiq pengesat mes ekipeve.", "Fortschritt prüfen; Hindernisse zwischen Teams beseitigen.") },
              { k: x("Day 30", "Dita 30", "Tag 30"), t: x("Verify the result; disclose what changed or why it stays open.", "Verifiko rezultatin; trego çfarë ndryshoi ose pse mbetet i hapur.", "Ergebnis prüfen; sagen, was sich änderte oder offen bleibt.") },
            ] },
            { type: "callout", reading: true, text: x(
              "What is promised is an owner, a realistic next action and a visible feedback date, never that every issue is resolved in 30 days.",
              "Ajo që premtohet është një përgjegjës, një veprim i radhës realist dhe një datë e dukshme përgjigjeje, kurrë se çdo problem zgjidhet brenda 30 ditëve.",
              "Versprochen werden ein Verantwortlicher, ein realistischer nächster Schritt und ein sichtbarer Rückmeldetermin, nie, dass alles in 30 Tagen gelöst ist.") },
          ],
          note: x(
            "Each measure needs a definition, a window and a denominator. The dates are illustrative: an editorial proposal after Tucker & Singer and Sexton et al., not a timetable either study requires. Solve what is safe and soluble now; contain urgent risks without waiting.",
            "Çdo masë ka nevojë për një përkufizim, një dritare kohore dhe një emërues. Datat janë ilustruese: propozim editorial sipas Tucker & Singer dhe Sexton et al., jo një orar që e kërkon ndonjëri nga studimet. Zgjidh tani atë që është e sigurt dhe e zgjidhshme; frenoji rreziqet urgjente pa pritur.",
            "Jede Kennzahl braucht eine Definition, ein Zeitfenster und einen Nenner. Die Termine sind beispielhaft: ein redaktioneller Vorschlag nach Tucker & Singer und Sexton et al., kein Zeitplan, den eine der Studien verlangt. Lösen Sie jetzt, was sicher und lösbar ist; dämmen Sie dringende Risiken sofort ein."),
          source: ["tucker-singer-2015", "sexton-2014"],
        },
      ],
    },

    {
      id: "tool", tool: "/tools/five-whys/",
      kicker: x("Tool of the volume", "Mjeti i vëllimit", "Werkzeug des Bandes"),
      title: [x("The gemba", "Karta e vizitës", "Das Blatt für den"), x("walk card", "në terren", "Gemba-Rundgang")],
      lead: x(
        "One process. One clear next action. Fill it in with the people who do the work, and set the date you will come back with an answer before you leave.",
        "Një proces. Një veprim i qartë i radhës. Plotësoje me njerëzit që e bëjnë punën, dhe cakto datën kur do të kthehesh me një përgjigje, para se të largohesh.",
        "Ein Prozess. Ein klarer nächster Schritt. Füllen Sie es mit den Menschen aus, die die Arbeit tun, und legen Sie vor dem Gehen fest, wann Sie mit einer Antwort zurückkommen."),
      blocks: [
        { type: "form", items: [
          { h: x("Process and place", "Procesi dhe vendi", "Prozess und Ort"), hint: x("which value stream or hand-off are we following?", "cilën rrjedhë vlere ose dorëzim po ndjekim?", "welchen Wertstrom oder welche Übergabe verfolgen wir?") },
          { h: x("Purpose", "Qëllimi", "Zweck"), hint: x("what result must the customer receive?", "çfarë rezultati duhet të marrë klienti?", "welches Ergebnis muss der Kunde erhalten?") },
          { h: x("Observed fact", "Fakti i vëzhguar", "Beobachtete Tatsache"), hint: x("what actually happened? what was seen, kept apart from interpretation", "çfarë ndodhi në të vërtetë? ajo që u pa, e ndarë nga interpretimi", "was ist tatsächlich geschehen? Gesehenes getrennt von Deutung"), lines: 2 },
          { h: x("Exception path", "Rruga e përjashtimit", "Ausnahmepfad"), hint: x("what do workers do when the standard does not fit?", "çfarë bëjnë punonjësit kur standardi nuk përshtatet?", "was tun die Beschäftigten, wenn der Standard nicht passt?") },
          { h: x("Next action and owner", "Veprimi i radhës dhe përgjegjësi", "Nächster Schritt und Verantwortlicher"), hint: x("what will be checked or changed, and by whom?", "çfarë do të kontrollohet ose ndryshohet, dhe nga kush?", "was wird geprüft oder geändert, und von wem?") },
          { h: x("Told back", "I treguar ekipit", "Zurückgemeldet"), hint: x("how and when will the frontline team hear the result?", "si dhe kur do ta dëgjojë ekipi i vijës së parë rezultatin?", "wie und wann erfährt das Team vor Ort das Ergebnis?") },
        ] },
      ],
      note: x(
        "A practice proposed by the editors, after Womack's three questions, Mann's four and the findings of Tucker & Singer and Sexton et al. The tool named below helps with the cause once the fact is written down.",
        "Praktikë e propozuar nga redaksia, sipas tri pyetjeve të Womack-ut, katër të Mann-it dhe gjetjeve të Tucker & Singer dhe Sexton et al. Mjeti më poshtë ndihmon për shkakun, pasi fakti është shkruar.",
        "Eine Praxis, die die Redaktion vorschlägt, nach Womacks drei Fragen, Manns vier und den Befunden von Tucker & Singer und Sexton et al. Das unten genannte Werkzeug hilft bei der Ursache, sobald die Tatsache notiert ist."),
      source: ["lei-gemba-walk", "mann-2014", "tucker-singer-2015", "sexton-2014"],
    },
    {
      id: "closing",
      kicker: x("Closing essay", "Eseja e mbylljes", "Schlussessay"),
      title: [x("The manager", "Menaxheri", "Die Führungskraft"), x("after the walk", "pas vizitës", "nach dem Rundgang")],
      lead: x(
        "A manager leaves the office because something important cannot be learned there. The numbers point to a problem; the process explains what the number is made of. But walking to the place where the work happens is only the beginning of an obligation.",
        "Menaxheri e lë zyrën sepse diçka e rëndësishme nuk mund të mësohet atje. Shifrat tregojnë një problem; procesi shpjegon nga çfarë është bërë shifra. Por të shkosh deri aty ku ndodh puna është vetëm fillimi i një detyrimi.",
        "Eine Führungskraft verlässt das Büro, weil sich etwas Wichtiges dort nicht lernen lässt. Die Zahlen weisen auf ein Problem; der Prozess erklärt, woraus die Zahl besteht. Aber zum Ort der Arbeit zu gehen ist nur der Anfang einer Verpflichtung."),
      blocks: [
        { type: "p", text: x(
          "Once a driver, a warehouse worker or a night-shift colleague explains a recurring obstacle, management can no longer say it never knew. That knowledge creates a choice. It can become an item on a list, a reason to blame or an excuse for another meeting. Or it can become a verified problem with an owner, an action and a response that reaches the person who raised it.",
          "Sapo një shofer, një punonjës magazine ose një koleg i turnit të natës shpjegon një pengesë që përsëritet, menaxhimi nuk mund të thotë më se nuk e dinte. Ajo dije krijon një zgjedhje. Mund të bëhet një pikë në një listë, një arsye për të fajësuar ose një justifikim për një takim tjetër. Ose mund të bëhet një problem i verifikuar me një përgjegjës, një veprim dhe një përgjigje që arrin te njeriu që e ngriti.",
          "Sobald ein Fahrer, eine Lagerkraft oder ein Kollege der Nachtschicht ein wiederkehrendes Hindernis erklärt, kann die Führung nicht mehr sagen, sie habe nichts gewusst. Dieses Wissen schafft eine Wahl. Es kann ein Punkt auf einer Liste werden, ein Grund für Schuldzuweisung oder ein Vorwand für eine weitere Besprechung. Oder es wird ein geprüftes Problem mit Verantwortlichem, Maßnahme und einer Antwort, die den Menschen erreicht, der es angesprochen hat.") },
        { type: "cards", cols: 2, items: [
          { h: x("The learning test", "Prova e të mësuarit", "Der Lerntest"), p: x("Can the manager now describe the real flow, the deviation and the limits of the evidence?", "A mund ta përshkruajë tani menaxheri rrjedhën e vërtetë, devijimin dhe kufijtë e provës?", "Kann die Führungskraft jetzt den realen Ablauf, die Abweichung und die Grenzen der Belege beschreiben?") },
          { h: x("The action test", "Prova e veprimit", "Der Handlungstest"), p: x("Can the team name what changed, who owns the remainder and when they will hear back?", "A mund të thotë ekipi çfarë ndryshoi, kush e ka pjesën e mbetur dhe kur do të marrë përgjigje?", "Kann das Team sagen, was sich änderte, wer den Rest verantwortet und wann es etwas hört?") },
        ] },
        { type: "p", text: x(
          "Where the first answer is no, the visit was a tour. Where the first is yes and the second no, it produced insight without credibility. Repeated often enough, that gap teaches staff that explaining problems makes little difference. What works instead is ordinary: follow the work, ask what is happening, check the facts, respect the people who know the exceptions, act within the right authority, and return with an answer.",
          "Kur përgjigjja e parë është jo, vizita ishte një shëtitje. Kur e para është po dhe e dyta jo, prodhoi kuptim pa besueshmëri. E përsëritur mjaft herë, kjo zbrazëti ua mëson punonjësve se shpjegimi i problemeve nuk ndryshon gjë. Ajo që funksionon në vend të saj është e zakonshme: ndiq punën, pyet çfarë po ndodh, kontrollo faktet, respekto njerëzit që i njohin përjashtimet, vepro brenda autoritetit të duhur, dhe kthehu me një përgjigje.",
          "Lautet die erste Antwort Nein, war der Besuch eine Besichtigung. Lautet die erste Ja und die zweite Nein, brachte er Einsicht ohne Glaubwürdigkeit. Oft genug wiederholt, lehrt diese Lücke die Beschäftigten, dass es wenig ändert, Probleme zu erklären. Was stattdessen hilft, ist unspektakulär: Folgen Sie der Arbeit, fragen Sie, was geschieht, prüfen Sie die Fakten, achten Sie die Menschen, die die Ausnahmen kennen, handeln Sie innerhalb der richtigen Befugnis und kommen Sie mit einer Antwort zurück.") },
        { type: "callout", reading: true, text: x(
          "Go and see. Then make sure the people who showed you the problem can see what happened next.",
          "Shko e shiko. Pastaj sigurohu që njerëzit që ta treguan problemin të shohin çfarë ndodhi më pas.",
          "Gehen Sie hin und sehen Sie selbst. Dann zeigen Sie denen, die Ihnen das Problem gezeigt haben, was danach geschah.") },
      ],
      note: x(
        "Editorial conclusion. No change in a hotel, warehouse or transport KPI is attributed to gemba walks without direct supporting data.",
        "Përfundim editorial. Asnjë ndryshim në një KPI hoteli, magazine ose transporti nuk u atribuohet vizitave në terren pa të dhëna të drejtpërdrejta.",
        "Redaktionelles Fazit. Keine Veränderung einer Hotel-, Lager- oder Transportkennzahl wird ohne direkte Daten den Gemba-Rundgängen zugeschrieben."),
    },
    {
      id: "method",
      kicker: x("Editorial method", "Metoda editoriale", "Redaktionelle Methode"),
      title: [x("What we can", "Çfarë mund", "Was wir behaupten"), x("and cannot claim", "dhe nuk mund të pohojmë", "können und was nicht")],
      lead: x(
        "A narrative investigation, not a causal replication. This volume keeps the evidence of the ten-page issue on gemba, Management Review No. 40, and explains its limits.",
        "Një hetim narrativ, jo një riprodhim shkakësor. Ky vëllim e ruan provën e numrit dhjetëfaqësh për gemba-n, Management Review Nr. 40, dhe shpjegon kufijtë e saj.",
        "Eine erzählende Untersuchung, keine kausale Replikation. Dieser Band behält die Belege der zehnseitigen Ausgabe zu Gemba, Management Review Nr. 40, und erklärt ihre Grenzen."),
      blocks: [
        { type: "p", text: x(
          "Tucker and Singer ran a randomised programme in hospitals; its outcome was a staff survey measure of perceived improvement, not hotel complaints or last-mile damage rates. Sexton and colleagues surveyed staff at one point in time; feedback was associated with safety-culture ratings and burnout, but the design cannot establish that feedback caused the difference. The 30-day horizon belongs to the classification of easy-to-solve problems in the hospital study; we use a similar period as an optional review cycle, clearly labelled as an editorial choice.",
          "Tucker dhe Singer zbatuan një program të randomizuar në spitale; rezultati i tij ishte një masë e perceptimit të përmirësimit nga anketa e stafit, jo ankesa hoteli ose përqindje dëmesh në miljen e fundit. Sexton dhe kolegët anketuan stafin në një moment të vetëm; përgjigjja lidhej me vlerësimet e kulturës së sigurisë dhe rraskapitjen, por dizajni nuk mund të vërtetojë se përgjigjja e shkaktoi ndryshimin. Horizonti 30-ditor i përket klasifikimit të problemeve të lehta për t'u zgjidhur në studimin spitalor; ne përdorim një periudhë të ngjashme si cikël rishikimi opsional, të etiketuar qartë si zgjedhje editoriale.",
          "Tucker und Singer führten ein randomisiertes Programm in Kliniken durch; sein Ergebnis war ein Umfragemaß wahrgenommener Verbesserung beim Personal, keine Hotelbeschwerden oder Schadenquoten der letzten Meile. Sexton und Kollegen befragten das Personal zu einem Zeitpunkt; Rückmeldung hing mit Sicherheitskultur und Burnout zusammen, doch das Design kann nicht belegen, dass die Rückmeldung den Unterschied verursachte. Der 30-Tage-Horizont gehört zur Klassifikation leicht lösbarer Probleme in der Klinikstudie; wir nutzen eine ähnliche Spanne als optionalen Prüfzyklus, klar als redaktionelle Wahl markiert.") },
        { type: "cards", cols: 3, items: [
          { h: x("Documented", "E dokumentuar", "Dokumentiert"), p: x("Author names, study designs, methods and published figures.", "Emrat e autorëve, dizajnet e studimeve, metodat dhe shifrat e botuara.", "Autorennamen, Studiendesigns, Methoden und veröffentlichte Zahlen.") },
          { h: x("Interpreted", "E interpretuar", "Gedeutet"), p: x("What the research may mean for shift operations.", "Çfarë mund të thotë kërkimi për operacionet me turne.", "Was die Forschung für den Schichtbetrieb bedeuten kann.") },
          { h: x("Hypothetical", "Hipotetike", "Hypothetisch"), p: x("The 03:00 scene, the transport case and the example response cycle.", "Skena e 03:00, rasti i transportit dhe cikli shembull i përgjigjes.", "Die Szene um 03:00, der Transportfall und der beispielhafte Antwortzyklus.") },
        ] },
        { type: "p", text: x(
          "Nothing here identifies guests, employees, companies, login systems or private operational records. The purpose is to examine how management learns and acts, not to turn routine workplace issues into personal stories without permission or evidence.",
          "Asgjë këtu nuk identifikon mysafirë, punonjës, kompani, sisteme hyrjeje ose regjistra privatë operacionalë. Qëllimi është të shqyrtohet si mëson dhe vepron menaxhimi, jo të kthehen çështje rutinë të vendit të punës në histori personale pa leje dhe pa prova.",
          "Nichts hier identifiziert Gäste, Beschäftigte, Unternehmen, Anmeldesysteme oder private Betriebsaufzeichnungen. Der Zweck ist zu untersuchen, wie Führung lernt und handelt, nicht, alltägliche Arbeitsfragen ohne Erlaubnis und Belege zu persönlichen Geschichten zu machen.") },
      ],
      note: x(
        "Research checks completed against the listed primary sources; where a book or article could not be opened, the source carries “via” on the next page.",
        "Kontrollet e kërkimit u bënë me burimet parësore të listuara; kur një libër ose artikull nuk u hap, burimi mban “përmes” në faqen tjetër.",
        "Die Prüfungen erfolgten an den gelisteten Primärquellen; wo sich ein Buch oder Artikel nicht öffnen ließ, trägt die Quelle auf der nächsten Seite „über“."),
      source: ["tucker-singer-2015", "sexton-2014"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
