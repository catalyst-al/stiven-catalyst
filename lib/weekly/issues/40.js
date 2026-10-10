// Management Review, No. 40: Gemba: management where the work happens. Block: Operations.
// Facts and their sources: docs/revista/management-review-nr-40.md.
import { x } from "../common.js";

export default {
  number: 40,
  block: "operations",
  date: x("October 2026", "Tetor 2026", "Oktober 2026"),
  theme: [x("Gemba:", "Gemba:", "Gemba:"), x("management where the work happens", "menaxhimi aty ku ndodh puna", "führen, wo die Arbeit geschieht")],
  sub: x(
    "Ohno's circle on the floor, what staff notice of leaders' walks, Womack's purpose, process and people, a randomised study of walking around, Mann's four questions, and a card for your own walk.",
    "Rrethi i Ohno-s në dysheme, çfarë vënë re punonjësit nga ecjet e drejtuesve, qëllimi, procesi dhe njerëzit te Womack-u, një studim i rastësishëm për ecjen nëpër terren, katër pyetjet e Mann-it, dhe një kartë për ecjen tënde.",
    "Ohnos Kreis auf dem Boden, was Beschäftigte von den Rundgängen der Leitung merken, Womacks Zweck, Prozess und Menschen, eine randomisierte Studie zum Herumgehen, Manns vier Fragen und eine Karte für den eigenen Rundgang."),
  seo: x(
    "Gemba: Ohno's chalk circle, Womack's purpose, process and people, a randomised study of management by walking around, Mann's four questions and a card.",
    "Gemba: rrethi i Ohno-s, qëllimi, procesi dhe njerëzit te Womack-u, një studim i rastësishëm për menaxhimin në terren, katër pyetjet e Mann-it dhe një kartë.",
    "Gemba: Ohnos Kreidekreis, Womacks Zweck, Prozess und Menschen, eine randomisierte Studie zum Führen durch Herumgehen, Manns vier Fragen und eine Karte."),
  feature: x(
    "Issue 40 starts with the circle Taiichi Ohno drew on the shop floor, asks how many frontline staff even notice their leaders' walks, follows Jim Womack's walk along a value stream with purpose, process and people, looks at a randomised study in which walking around made things worse, sets out David Mann's four questions, and ends with a card for your own gemba walk.",
    "Numri 40 nis me rrethin që vizatonte Taiichi Ohno në dyshemenë e repartit, pyet sa punonjës të vijës së parë i vënë re fare ecjet e drejtuesve, ndjek ecjen e Jim Womack-ut përgjatë një rrjedhe vlere me qëllimin, procesin dhe njerëzit, shikon një studim të rastësishëm ku ecja nëpër terren i përkeqësoi gjërat, shtjellon katër pyetjet e David Mann-it, dhe mbyllet me një kartë për ecjen tënde në gemba.",
    "Ausgabe 40 beginnt mit dem Kreis, den Taiichi Ohno auf den Hallenboden zeichnete, fragt, wie viele Beschäftigte an der Front die Rundgänge ihrer Leitung überhaupt bemerken, folgt Jim Womacks Gang entlang eines Wertstroms mit Zweck, Prozess und Menschen, betrachtet eine randomisierte Studie, in der das Herumgehen die Lage verschlechterte, stellt David Manns vier Fragen vor und endet mit einer Karte für den eigenen Gemba-Rundgang."),
  figure: { n: x("49%", "49%", "49 %"), by: "Sexton et al., 2014", t: x(
    "of the staff surveyed in 44 neonatal intensive care units were not sure whether leadership walkrounds took place at all.",
    "e punonjësve të anketuar në 44 njësi të terapisë intensive neonatale nuk e dinin me siguri nëse drejtuesit bënin fare ecje në terren.",
    "der Befragten in 44 neonatologischen Intensivstationen wussten nicht sicher, ob Rundgänge der Leitung überhaupt stattfanden.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("Stand in the circle", "Qëndro në rreth", "Im Kreis stehen") },
    { page: "model", kicker: x("The model", "Modeli", "Das Modell"),
      title: x("Purpose, process, people", "Qëllimi, procesi, njerëzit", "Zweck, Prozess, Menschen") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The gemba walk card", "Karta e ecjes në gemba", "Die Karte für den Gemba-Rundgang") },
  ],
  sources: ["teresko-2004", "lei-gemba-walk", "sexton-2014", "womack-2011", "jusko-2011", "tucker-singer-2015", "mann-2014", "mann-2005"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "A report says what happened. It rarely says how. This issue is about going to the place where the work is done, the gemba, and about what a manager looks for there, asks there, and does afterwards.",
        "Një raport të thotë çfarë ndodhi. Rrallë të thotë si. Ky numër flet për të shkuar në vendin ku bëhet puna, në gemba, dhe për atë që një menaxher kërkon aty, pyet aty, dhe bën më pas.",
        "Ein Bericht sagt, was passiert ist, selten aber, wie. Diese Ausgabe handelt davon, an den Ort zu gehen, an dem die Arbeit gemacht wird, das Gemba, und davon, worauf eine Führungskraft dort achtet, was sie fragt und was sie danach tut."),
      body: x(
        "Taiichi Ohno made his students stand in a circle on the shop floor and watch. Jim Womack turned the habit into a walk along a whole value stream, with three questions. In 44 neonatal units, almost half the staff were not sure whether their leaders walked at all. In a randomised study in US hospitals, walking around on average made things worse, unless the problems it found were solved. David Mann's four questions show what to ask on the way.",
        "Taiichi Ohno i vinte nxënësit të qëndronin në një rreth në dyshemenë e repartit dhe të shikonin. Jim Womack-u e ktheu zakonin në një ecje përgjatë gjithë rrjedhës së vlerës, me tri pyetje. Në 44 njësi neonatale, gati gjysma e punonjësve nuk e dinin me siguri nëse drejtuesit bënin fare ecje. Në një studim të rastësishëm në spitale të SHBA, ecja nëpër terren mesatarisht i përkeqësoi gjërat, përveç rasteve kur problemet që gjente zgjidheshin. Katër pyetjet e David Mann-it tregojnë çfarë të pyesësh rrugës.",
        "Taiichi Ohno ließ seine Schüler in einem Kreis auf dem Hallenboden stehen und zuschauen. Jim Womack machte daraus einen Gang entlang eines ganzen Wertstroms, mit drei Fragen. In 44 neonatologischen Stationen wusste fast die Hälfte der Beschäftigten nicht sicher, ob die Leitung überhaupt Rundgänge machte. In einer randomisierten Studie in US-Kliniken machte das Herumgehen die Lage im Schnitt schlechter, außer dort, wo die gefundenen Probleme gelöst wurden. David Manns vier Fragen zeigen, was man unterwegs fragt."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("Stand in", "Qëndro", "Im Kreis"), x("the circle", "në rreth", "stehen")],
      lead: x(
        "According to Teruyuki Minoura, one of his students who later headed Toyota's manufacturing in North America, Taiichi Ohno would take his students to a problem area and draw a circle on the floor, where they were to observe, think and analyse.",
        "Sipas Teruyuki Minoura-s, një nga nxënësit e tij që më vonë drejtoi prodhimin e Toyota-s në Amerikën e Veriut, Taiichi Ohno i çonte nxënësit te një vend me probleme dhe vizatonte një rreth në dysheme, ku ata duhej të vëzhgonin, të mendonin dhe të analizonin.",
        "Nach Teruyuki Minoura, einem seiner Schüler, der später die Produktion von Toyota in Nordamerika leitete, führte Taiichi Ohno seine Schüler an eine Problemstelle und zeichnete einen Kreis auf den Boden, in dem sie beobachten, nachdenken und analysieren sollten."),
      blocks: [
        { type: "quote", text: x(
          "He wanted us to watch and ask 'why' over and over again.",
          "Donte që të shikonim dhe të pyesnim 'pse' përsëri e përsëri.",
          "Er wollte, dass wir zuschauen und immer wieder ‚warum‘ fragen.") },
        { type: "cards", cols: 3, items: [
          { h: x("Gemba", "Gemba", "Gemba"), p: x("“actual place”: where value is created, a shop floor, a ward, a kitchen, a loading ramp", "“vendi i vërtetë”: aty ku krijohet vlera, një repart, një pavijon, një kuzhinë, një rampë ngarkimi", "„der tatsächliche Ort“: wo Wert entsteht, eine Halle, eine Station, eine Küche, eine Laderampe") },
          { h: x("Genchi genbutsu", "Genchi genbutsu", "Genchi Genbutsu"), p: x("real place, real thing: go and see the facts for yourself", "vendi i vërtetë, gjëja e vërtetë: shko e shiko faktet vetë", "realer Ort, reale Sache: hingehen und die Fakten selbst sehen") },
          { h: x("Gemba walk", "Ecja në gemba", "Gemba-Rundgang"), p: x("grasping the situation by watching and asking, before taking action", "të kuptosh gjendjen duke parë dhe duke pyetur, para se të veprosh", "die Lage durch Beobachten und Fragen erfassen, bevor man handelt") },
        ] },
        { type: "callout", reading: true, text: x(
          "The circle is not about standing still. It is about looking long enough to stop seeing what you expected to see.",
          "Rrethi nuk ka të bëjë me të qëndruarit në vend. Ka të bëjë me të shikuarit aq gjatë sa të mos shohësh më atë që prisje të shihje.",
          "Beim Kreis geht es nicht ums Stillstehen, sondern darum, so lange hinzusehen, bis man nicht mehr sieht, was man erwartet hat.") },
      ],
      note: x(
        "The circle is known from the accounts of Ohno's students; how long they stood in it varies from one telling to another, so we give no figure. The three terms follow the Lean Enterprise Institute's lexicon.",
        "Rrethi njihet nga rrëfimet e nxënësve të Ohno-s; sa gjatë qëndronin në të ndryshon nga një rrëfim te tjetri, ndaj nuk japim shifër. Tri termat ndjekin fjalorin e Lean Enterprise Institute.",
        "Den Kreis kennt man aus Erzählungen von Ohnos Schülern; wie lange sie darin standen, schwankt von Erzählung zu Erzählung, deshalb nennen wir keine Zahl. Die drei Begriffe folgen dem Lexikon des Lean Enterprise Institute."),
      source: ["teresko-2004", "lei-gemba-walk"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("Who notices", "Kush e vë re", "Wer den Rundgang"), x("the walk", "ecjen", "bemerkt")],
      lead: x(
        "In leadership walkrounds, senior leaders visit frontline staff to talk about safety. J. Bryan Sexton and colleagues asked staff in 44 US neonatal intensive care units about them; 2,073 of 3,294 answered (62.9%).",
        "Në ecjet e drejtuesve (leadership walkrounds), drejtuesit e lartë vizitojnë punonjësit e vijës së parë për të folur për sigurinë. J. Bryan Sexton dhe kolegët i pyetën për to punonjësit e 44 njësive të terapisë intensive neonatale në SHBA; u përgjigjën 2.073 nga 3.294 (62,9%).",
        "Bei Leadership WalkRounds besucht die oberste Leitung Beschäftigte an der Front, um über Sicherheit zu sprechen. J. Bryan Sexton und Kollegen befragten dazu Beschäftigte in 44 neonatologischen Intensivstationen in den USA; 2.073 von 3.294 antworteten (62,9 %)."),
      blocks: [
        { type: "hbars", source: ["sexton-2014"],
          label: x("Staff in 44 neonatal intensive care units, 2014", "Punonjësit në 44 njësi të terapisë intensive neonatale, 2014", "Beschäftigte in 44 neonatologischen Intensivstationen, 2014"),
          items: [
            { k: x("Took part in a walkround", "Morën pjesë në një ecje", "Nahmen an einem Rundgang teil"), v: 20.9, n: x("20.9%", "20,9%", "20,9 %") },
            { k: x("Heard back about risks it reduced", "Morën përgjigje për rreziqet që u ulën", "Erfuhren, welche Risiken er senkte"), v: 18.4, n: x("18.4%", "18,4%", "18,4 %") },
            { k: x("Not sure walkrounds took place", "Nuk e dinin nëse bëheshin ecje", "Unsicher, ob es Rundgänge gab"), v: 49.1, n: x("49.1%", "49,1%", "49,1 %"), alert: true },
          ] },
        { type: "p", text: x(
          "Units where more staff heard back about what the walkrounds had changed rated their safety culture better and tended to report less burnout. In the adult clinical areas used for comparison, 27.6% had taken part.",
          "Njësitë ku më shumë punonjës morën përgjigje për atë që ndryshuan ecjet e vlerësuan më mirë kulturën e sigurisë dhe prireshin të raportonin më pak rraskapitje. Në repartet e të rriturve që shërbyen për krahasim, kishin marrë pjesë 27,6%.",
          "Stationen, in denen mehr Beschäftigte erfuhren, was die Rundgänge verändert hatten, bewerteten ihre Sicherheitskultur besser und berichteten tendenziell weniger Burnout. In den Erwachsenenbereichen, die zum Vergleich dienten, hatten 27,6 % teilgenommen.") },
        { type: "callout", reading: true, text: x(
          "A walk the team never hears about again is, for the team, a walk that did not happen.",
          "Një ecje për të cilën ekipi nuk dëgjon më asgjë është, për ekipin, një ecje që nuk ndodhi.",
          "Ein Rundgang, von dem das Team nie wieder hört, hat für das Team nicht stattgefunden.") },
      ],
      note: x(
        "Participation and feedback are averages of the units; 49.1% is the share of all who answered. A survey at one point in time: it shows an association, not a cause.",
        "Pjesëmarrja dhe përgjigjja janë mesatare të njësive; 49,1% është pjesa e të gjithë atyre që u përgjigjën. Anketë në një moment të vetëm: tregon lidhje, jo shkak.",
        "Teilnahme und Rückmeldung sind Mittelwerte der Stationen; 49,1 % ist der Anteil aller Antwortenden. Eine Befragung zu einem Zeitpunkt: Sie zeigt einen Zusammenhang, keine Ursache."),
      source: ["sexton-2014"],
    },
    {
      id: "model", more: "kpis-do-not-improve-in-excel",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Purpose, process,", "Qëllimi, procesi,", "Zweck, Prozess,"), x("people", "njerëzit", "Menschen")],
      lead: x(
        "Jim Womack, founder of the Lean Enterprise Institute, collected a decade of his walks in Gemba Walks (2011). Value flows across a company, he argues, while the company is organised in vertical departments. So walk one value stream from end to end, together with everyone who touches it.",
        "Jim Womack, themeluesi i Lean Enterprise Institute, mblodhi një dekadë ecjesh te Gemba Walks (2011). Vlera rrjedh horizontalisht nëpër kompani, thotë ai, ndërsa kompania është e ndarë në departamente vertikale. Prandaj ec një rrjedhë vlere nga fillimi në fund, bashkë me të gjithë ata që e prekin.",
        "Jim Womack, Gründer des Lean Enterprise Institute, sammelte ein Jahrzehnt seiner Rundgänge in Gemba Walks (2011). Wert fließt quer durch ein Unternehmen, sagt er, während das Unternehmen in senkrechten Abteilungen organisiert ist. Also einen Wertstrom von Anfang bis Ende gehen, gemeinsam mit allen, die ihn berühren."),
      blocks: [
        { type: "cards", cols: 3, items: [
          { h: x("Purpose", "Qëllimi", "Zweck"), p: x("What problem does this process solve for the customer?", "Çfarë problemi i zgjidh klientit ky proces?", "Welches Problem löst dieser Prozess für den Kunden?") },
          { h: x("Process", "Procesi", "Prozess"), p: x("How does it actually work, step by step?", "Si funksionon në të vërtetë, hap pas hapi?", "Wie funktioniert er tatsächlich, Schritt für Schritt?") },
          { h: x("People", "Njerëzit", "Menschen"), p: x("Are they engaged in creating, sustaining and improving it?", "A janë të përfshirë në krijimin, mbajtjen dhe përmirësimin e tij?", "Sind sie daran beteiligt, ihn zu schaffen, zu halten und zu verbessern?") },
        ] },
        { type: "p", text: x(
          "In the foreword to the book, John Shook recalls how Toyota's chairman Fujio Cho summed up what lean leaders do: go see, ask why, show respect. Womack himself told an audience in 2011 that value is always created at the bottom.",
          "Në parathënien e librit, John Shook kujton si e përmblodhi kryetari i Toyota-s, Fujio Cho, atë që bëjnë drejtuesit lean: shko e shiko, pyet pse, trego respekt. Vetë Womack-u i tha një auditori në 2011 se vlera krijohet gjithmonë poshtë.",
          "Im Vorwort des Buchs erinnert John Shook daran, wie Toyota-Chairman Fujio Cho zusammenfasste, was Lean-Führungskräfte tun: hingehen und sehen, nach dem Warum fragen, Respekt zeigen. Womack selbst sagte 2011 vor Publikum, Wert entstehe immer unten.") },
        { type: "callout", reading: true, text: x(
          "Walking alone shows you a department. Walking together shows the handovers between departments, where problems usually wait.",
          "Kur ecën vetëm, sheh një departament. Kur ecni bashkë, shihni dorëzimet mes departamenteve, aty ku zakonisht presin problemet.",
          "Allein sieht man eine Abteilung. Gemeinsam sieht man die Übergaben zwischen Abteilungen, wo Probleme meist warten.") },
      ],
      note: x(
        "The three questions follow the Lean Enterprise Institute's lexicon; Cho's words are quoted by Shook. The reading is the editors'.",
        "Tri pyetjet ndjekin fjalorin e Lean Enterprise Institute; fjalët e Cho-s i citon Shook-u. Leximi është i redaksisë.",
        "Die drei Fragen folgen dem Lexikon des Lean Enterprise Institute; Chos Worte zitiert Shook. Die Deutung stammt von der Redaktion."),
      source: ["womack-2011", "jusko-2011", "lei-gemba-walk"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("When walking", "Kur ecja", "Wenn Herumgehen"), x("makes it worse", "i përkeqëson gjërat", "schadet")],
      lead: x(
        "Anita Tucker and Sara Singer tested management by walking around in US hospitals chosen at random. For 18 months, senior managers observed frontline work, asked for ideas and worked with staff on the problems. 56 work areas took part; 138 in control hospitals did not.",
        "Anita Tucker dhe Sara Singer e provuan menaxhimin duke ecur nëpër terren në spitale të SHBA të zgjedhura rastësisht. Për 18 muaj, drejtuesit e lartë vëzhguan punën e vijës së parë, kërkuan ide dhe punuan me stafin për problemet. Morën pjesë 56 reparte; 138 reparte në spitalet e kontrollit jo.",
        "Anita Tucker und Sara Singer testeten Führen durch Herumgehen in zufällig ausgewählten US-Kliniken. 18 Monate lang beobachtete die oberste Leitung die Arbeit an der Front, sammelte Ideen und arbeitete mit dem Personal an den Problemen. 56 Bereiche nahmen teil, 138 in Kontrollkliniken nicht."),
      blocks: [
        { type: "columns", max: 20, height: 100, source: ["tucker-singer-2015"],
          label: x("Problems per work area, on average", "Problemet për repart, mesatarisht", "Probleme je Bereich, im Schnitt"),
          items: [
            { k: x("Found", "U gjetën", "Gefunden"), v: 19, n: "19" },
            { k: x("Acted on", "U trajtuan", "Bearbeitet"), v: 11, n: "11", alert: true },
          ] },
        { type: "p", text: x(
          "On average the programme lowered the staff's rating of improvement compared with the control areas. It worked better where teams took on problems they could solve within 30 days, and where a senior manager was made responsible for seeing a problem resolved. In some of the areas that fell furthest, the time went into ranking problems, and none were solved.",
          "Mesatarisht programi e uli vlerësimin e stafit për përmirësimin, krahasuar me repartet e kontrollit. Funksionoi më mirë aty ku ekipet morën përsipër probleme që zgjidheshin brenda 30 ditëve, dhe aty ku një drejtues i lartë u bë përgjegjës që problemi të zgjidhej. Në disa nga repartet që ranë më shumë, koha shkoi në renditjen e problemeve, dhe asnjë nuk u zgjidh.",
          "Im Schnitt senkte das Programm die Einschätzung des Personals, ob sich etwas verbessert, im Vergleich zu den Kontrollbereichen. Besser wirkte es, wo Teams Probleme angingen, die sich in 30 Tagen lösen ließen, und wo ein Mitglied der obersten Leitung dafür verantwortlich war, dass ein Problem gelöst wurde. In einigen der Bereiche, die am stärksten abfielen, ging die Zeit ins Sortieren der Probleme, und keines wurde gelöst.") },
        { type: "callout", reading: true, text: x(
          "Being seen on the floor is not the point. A walk pays only when what it finds gets fixed.",
          "Të të shohin në terren nuk është qëllimi. Ecja shpërblen vetëm kur ajo që gjen rregullohet.",
          "Gesehen zu werden ist nicht der Zweck. Ein Rundgang lohnt sich erst, wenn behoben wird, was er findet.") },
      ],
      note: x(
        "Improvement was rated by nurses on a 1–5 scale, before (2004) and after (2006). The counts per work area come from the 2013 working paper; the published article (2015) reports the same design and findings.",
        "Përmirësimin e vlerësuan infermierët në një shkallë 1–5, para (2004) dhe pas (2006). Numrat për repart vijnë nga versioni i punës i 2013; artikulli i botuar (2015) jep të njëjtin dizajn dhe gjetje.",
        "Die Verbesserung bewerteten Pflegekräfte auf einer Skala von 1 bis 5, vorher (2004) und nachher (2006). Die Zahlen je Bereich stammen aus dem Arbeitspapier von 2013; der veröffentlichte Artikel (2015) nennt dasselbe Design und dieselben Befunde."),
      source: ["tucker-singer-2015"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie man es misst"),
      title: [x("Four questions,", "Katër pyetje,", "Vier Fragen,"), x("one count", "një numërim", "eine Zählung")],
      lead: x(
        "David Mann, who wrote Creating a Lean Culture, treats the gemba walk as a repeatable part of a leader's standard work, not a box-checking exercise. He suggests opening with: “I'm really here as a student, and you all are the teachers.” Then four questions:",
        "David Mann, autori i Creating a Lean Culture, e trajton ecjen në gemba si pjesë të përsëritshme të punës standarde të drejtuesit, jo si plotësim kutish. Ai sugjeron ta nisësh kështu: “Në fakt jam këtu si nxënës, dhe ju jeni mësuesit.” Pastaj katër pyetje:",
        "David Mann, Autor von Creating a Lean Culture, sieht den Gemba-Rundgang als wiederholbaren Teil der Standardarbeit einer Führungskraft, nicht als Abhaken. Er schlägt vor, so zu beginnen: „Ich bin eigentlich als Schüler hier, und Sie sind die Lehrer.“ Dann vier Fragen:"),
      blocks: [
        { type: "steps", items: [
          { h: x("What's the process here?", "Cili është procesi këtu?", "Was ist hier der Prozess?"), p: x("Ask to be shown, not told.", "Kërko të ta tregojnë, jo të ta përshkruajnë.", "Sich zeigen lassen, nicht erzählen.") },
          { h: x("How can you tell it's working?", "Si e kupton që po funksionon?", "Woran erkennen Sie, dass er funktioniert?"), p: x("A board, a count or a signal you can see from where you stand.", "Një tabelë, një numërim ose një sinjal që e sheh nga vendi ku je.", "Eine Tafel, eine Zählung oder ein Signal, das man vom Standort aus sieht.") },
          { h: x("What do you do when it's not working?", "Çfarë bën kur nuk funksionon?", "Was tun Sie, wenn er nicht funktioniert?"), p: x("Listen for a way to raise it, not a workaround.", "Dëgjo nëse ka një rrugë për ta ngritur problemin, jo një rrugë anësore.", "Auf einen Meldeweg achten, nicht auf einen Umweg.") },
          { h: x("Is there work going on to improve it?", "A po punohet për ta përmirësuar?", "Wird daran gearbeitet, ihn zu verbessern?"), p: x("Ask for the last change and who proposed it.", "Pyet për ndryshimin e fundit dhe kush e propozoi.", "Nach der letzten Änderung fragen und wer sie vorschlug.") },
        ] },
        { type: "example", label: x("Hypothetical example, a month of walks in a dispatch area", "Shembull hipotetik, një muaj ecjesh në një zonë nisjeje", "Hypothetisches Beispiel, ein Monat Rundgänge im Versandbereich"), rows: [
          { k: x("Walks", "Ecjet", "Rundgänge"), v: x("8 planned, 7 held", "8 të planifikuara, 7 u bënë", "8 geplant, 7 gemacht") },
          { k: x("Problems", "Problemet", "Probleme"), v: x("14 found, 9 closed within 30 days", "14 u gjetën, 9 u mbyllën brenda 30 ditëve", "14 gefunden, 9 binnen 30 Tagen gelöst") },
          { k: x("Feedback", "Përgjigjja", "Rückmeldung"), v: x("the team was told about 4 of the 9", "ekipit iu tha për 4 nga 9", "das Team erfuhr von 4 der 9") },
        ], text: x("The gap is in the last line: the fixes happened, but the team hardly heard of them. The numbers are invented.", "Mungesa është te rreshti i fundit: rregullimet u bënë, por ekipi pothuajse nuk mori vesh. Numrat janë të shpikur.", "Die Lücke steckt in der letzten Zeile: Die Lösungen gab es, aber das Team erfuhr kaum davon. Die Zahlen sind erfunden.") },
      ],
      note: x(
        "The questions and the opening line are Mann's, from a 2014 interview; the hints under them and the example are the editors'. Counting what is closed and told back follows Tucker & Singer and Sexton et al.",
        "Pyetjet dhe fjalia e hapjes janë të Mann-it, nga një intervistë e 2014; shënimet nën to dhe shembulli janë të redaksisë. Numërimi i asaj që mbyllet dhe i tregohet ekipit ndjek Tucker & Singer dhe Sexton et al.",
        "Fragen und Eröffnungssatz stammen von Mann, aus einem Interview von 2014; die Hinweise darunter und das Beispiel stammen von der Redaktion. Zu zählen, was gelöst und zurückgemeldet wird, folgt Tucker & Singer und Sexton et al."),
      source: ["mann-2014", "mann-2005", "tucker-singer-2015", "sexton-2014"],
    },
    {
      id: "tool", tool: "/tools/five-whys/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The gemba", "Karta e ecjes", "Die Karte für den"), x("walk card", "në gemba", "Gemba-Rundgang")],
      lead: x(
        "One walk, one process. Write down what you saw, not who did it, and before you leave, set the date when you will come back with an answer.",
        "Një ecje, një proces. Shëno atë që pe, jo kush e bëri, dhe para se të largohesh, cakto datën kur do të kthehesh me një përgjigje.",
        "Ein Rundgang, ein Prozess. Notieren, was man gesehen hat, nicht wer es getan hat, und vor dem Gehen das Datum festlegen, an dem man mit einer Antwort zurückkommt."),
      blocks: [
        { type: "form", items: [
          { h: x("Process and place", "Procesi dhe vendi", "Prozess und Ort"), hint: x("which value stream, where it starts and ends", "cila rrjedhë vlere, ku nis dhe ku mbaron", "welcher Wertstrom, wo er beginnt und endet") },
          { h: x("Purpose", "Qëllimi", "Zweck"), hint: x("what problem it solves for the customer", "çfarë problemi i zgjidh klientit", "welches Problem er für den Kunden löst") },
          { h: x("What I saw", "Çfarë pashë", "Was ich gesehen habe"), hint: x("facts and places, not opinions or names", "fakte dhe vende, jo mendime ose emra", "Fakten und Orte, keine Meinungen oder Namen"), lines: 2 },
          { h: x("What they do when it fails", "Çfarë bëjnë kur dështon", "Was sie tun, wenn er versagt"), hint: x("in the words of the people who do the work", "me fjalët e njerëzve që e bëjnë punën", "in den Worten der Menschen, die die Arbeit machen") },
          { h: x("Problems I take with me", "Problemet që marr me vete", "Probleme, die ich mitnehme"), hint: x("which can be solved within 30 days; who owns each one", "cilat zgjidhen brenda 30 ditëve; kush e ka secilin", "welche sich in 30 Tagen lösen lassen; wer für jedes verantwortlich ist") },
          { h: x("Told back", "I tregova ekipit", "Zurückgemeldet"), hint: x("when and how the team hears what changed", "kur dhe si mëson ekipi çfarë ndryshoi", "wann und wie das Team erfährt, was sich geändert hat") },
        ] },
      ],
      note: x(
        "A practice proposed by the editors, after Womack's three questions, Mann's questions and the findings of Tucker & Singer.",
        "Praktikë e propozuar nga redaksia, sipas tri pyetjeve të Womack-ut, pyetjeve të Mann-it dhe gjetjeve të Tucker & Singer.",
        "Eine Praxis, die die Redaktion vorschlägt, nach Womacks drei Fragen, Manns Fragen und den Befunden von Tucker & Singer."),
      source: ["lei-gemba-walk", "mann-2014", "tucker-singer-2015"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
