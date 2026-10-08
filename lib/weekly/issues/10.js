// Management Review, No. 10: AI in the manager's work, without illusions. Block: AI.
// Facts and their sources: docs/revista/management-review-nr-10.md.
import { x, pc } from "../common.js";

export default {
  number: 10,
  block: "ai",
  date: x("October 2026", "Tetor 2026", "Oktober 2026"),
  theme: [x("AI in the manager's work,", "AI në punën e menaxherit,", "KI in der Arbeit der Führung,"), x("without illusions", "pa iluzione", "ohne Illusionen")],
  sub: x(
    "What the experiments measure when people work with AI, where it helps and where it misleads, and what the manager has to set before the team relies on it.",
    "Çfarë matin eksperimentet kur njerëzit punojnë me AI, ku ndihmon dhe ku të çon në gabim, dhe çfarë duhet të vendosë menaxheri para se ekipi të mbështetet tek ajo.",
    "Was Experimente messen, wenn Menschen mit KI arbeiten, wo sie hilft und wo sie in die Irre führt, und was die Führungskraft festlegen muss, bevor sich das Team darauf verlässt."),
  seo: x(
    "AI at work without illusions: METR's 2025 experiment, Gallup data on use and plans, the jagged frontier, the manager's role and a card for each AI task.",
    "AI në punë pa iluzione: eksperimenti i METR 2025, Gallup për përdorimin dhe planet, kufiri i dhëmbëzuar, roli i menaxherit dhe karta e detyrës.",
    "KI bei der Arbeit ohne Illusionen: das METR-Experiment 2025, Gallup zu Nutzung und Plänen, die gezackte Grenze, die Rolle der Führung und eine Aufgabenkarte."),
  feature: x(
    "Issue 10 starts with an experiment in which people felt faster and were measured slower, follows AI use in Gallup's data, maps where AI helps and where it misleads, and ends with a card for every task you hand to it.",
    "Numri 10 nis me një eksperiment ku njerëzit u ndjenë më të shpejtë dhe u matën më të ngadaltë, ndjek përdorimin e AI-së te të dhënat e Gallup, tregon ku ndihmon dhe ku të çon në gabim, dhe mbyllet me një kartë për çdo detyrë që i jep asaj.",
    "Ausgabe 10 beginnt mit einem Experiment, in dem sich Menschen schneller fühlten und langsamer gemessen wurden, verfolgt die KI-Nutzung in Gallups Daten, zeigt, wo KI hilft und wo sie in die Irre führt, und endet mit einer Karte für jede Aufgabe, die man ihr übergibt."),
  figure: { n: pc(19), by: "METR, 2025", t: x(
    "more time was needed by experienced developers for tasks on which they could use AI. They believed AI had made them 20% faster.",
    "më shumë kohë u deshi programuesve me përvojë për detyrat ku mund të përdornin AI. Ata besonin se AI i kishte bërë 20% më të shpejtë.",
    "mehr Zeit brauchten erfahrene Entwickler für Aufgaben, bei denen sie KI nutzen durften. Sie glaubten, KI habe sie 20 % schneller gemacht.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("Felt faster, measured slower", "U ndjenë më të shpejtë, u matën më të ngadaltë", "Gefühlt schneller, gemessen langsamer") },
    { page: "manager", kicker: x("The manager's part", "Pjesa e menaxherit", "Die Rolle der Führung"),
      title: x("Where the manager comes in", "Ku hyn menaxheri", "Wo die Führungskraft ins Spiel kommt") },
    { page: "tool", kicker: x("Tool of the week", "Mjeti i javës", "Werkzeug der Woche"),
      title: x("The AI task card", "Karta e detyrës me AI", "Die KI-Aufgabenkarte") },
  ],
  sources: ["metr-2025", "gallup-ai-2025", "gallup-ai-indicator", "dellacqua-2023", "brynjolfsson-2023", "gallup-ai-engagement-2026", "workslop-2025", "nanda-2025"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Half of US employees now use AI in their work at least now and then. This issue is about the distance between what AI seems to do and what can be measured, and about the manager who has to decide in that distance.",
        "Gjysma e punonjësve në SHBA tani e përdorin AI-në në punë të paktën herë pas here. Ky numër flet për largësinë mes asaj që AI duket se bën dhe asaj që mund të matet, dhe për menaxherin që duhet të vendosë pikërisht aty.",
        "Die Hälfte der Beschäftigten in den USA nutzt KI inzwischen zumindest ab und zu bei der Arbeit. Diese Ausgabe handelt vom Abstand zwischen dem, was KI zu leisten scheint, und dem, was sich messen lässt, und von der Führungskraft, die genau dort entscheiden muss."),
      body: x(
        "In 2025 experienced developers believed AI had made them faster, while the clock said slower. Other experiments found large gains, mostly for newer people and for tasks inside what researchers call the jagged frontier. Gallup finds that use grows faster than plans, and that the manager's support goes together with whether it helps.",
        "Në 2025, programues me përvojë besonin se AI i kishte bërë më të shpejtë, ndërsa ora tregonte të kundërtën. Eksperimente të tjera gjetën fitime të mëdha, kryesisht për njerëzit më të rinj në punë dhe për detyrat brenda asaj që studiuesit e quajnë kufiri i dhëmbëzuar. Gallup gjen se përdorimi rritet më shpejt se planet, dhe se mbështetja e menaxherit shkon bashkë me dobinë që sjell.",
        "2025 glaubten erfahrene Entwickler, KI habe sie schneller gemacht, während die Uhr das Gegenteil zeigte. Andere Experimente fanden große Gewinne, vor allem für neuere Leute und für Aufgaben innerhalb dessen, was Forschende die gezackte Grenze nennen. Gallup findet, dass die Nutzung schneller wächst als die Pläne und dass die Unterstützung der Führungskraft mit dem Nutzen einhergeht."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("Felt faster,", "U ndjenë më të shpejtë,", "Gefühlt schneller,"), x("measured slower", "u matën më të ngadaltë", "gemessen langsamer")],
      lead: x(
        "In early 2025 the research group METR ran a randomised experiment: 16 experienced developers, 246 real tasks in projects they knew well. Each task was randomly assigned to be done with AI tools or without them.",
        "Në fillim të 2025, grupi kërkimor METR bëri një eksperiment të rastësishëm: 16 programues me përvojë, 246 detyra të vërteta në projekte që i njihnin mirë. Çdo detyrë u caktua rastësisht për t'u bërë me mjete AI ose pa to.",
        "Anfang 2025 führte die Forschungsgruppe METR ein randomisiertes Experiment durch: 16 erfahrene Entwickler, 246 echte Aufgaben in Projekten, die sie gut kannten. Jede Aufgabe wurde zufällig der Arbeit mit oder ohne KI-Werkzeuge zugeteilt."),
      blocks: [
        { type: "figures", items: [
          { n: pc(24), t: x("faster: what the developers expected before", "më shpejt: aq prisnin programuesit para studimit", "schneller: das erwarteten die Entwickler vorher") },
          { n: pc(20), t: x("faster: what they believed afterwards", "më shpejt: aq besonin pas tij", "schneller: das glaubten sie danach") },
          { n: pc(19), t: x("slower: what was measured", "më ngadalë: kaq u mat", "langsamer: das wurde gemessen") },
        ] },
        { type: "p", text: x(
          "Experts in economics and machine learning had forecast tasks almost 40% shorter. METR calls the result a snapshot of early-2025 tools in one setting, and in 2026 it began changing its study design because the tools and the way people use them had changed. What has not changed is the gap between the feeling and the clock.",
          "Ekspertët e ekonomisë dhe të mësimit të makinës kishin parashikuar detyra gati 40% më të shkurtra. METR e quan rezultatin një fotografi të mjeteve të fillimit të 2025 në një mjedis të caktuar, dhe në 2026 nisi ta ndryshojë studimin, sepse kishin ndryshuar mjetet dhe mënyra si përdoren. Ajo që nuk ka ndryshuar është largësia mes ndjesisë dhe orës.",
          "Fachleute aus Ökonomie und maschinellem Lernen hatten fast 40 % kürzere Aufgaben vorhergesagt. METR nennt das Ergebnis eine Momentaufnahme der Werkzeuge von Anfang 2025 in einem bestimmten Umfeld und begann 2026, das Studiendesign zu ändern, weil sich die Werkzeuge und ihre Nutzung geändert hatten. Geblieben ist der Abstand zwischen Gefühl und Uhr.") },
        { type: "timeline", items: [
          { k: "2023", t: x("Customer support: 14% more cases solved per hour with AI.", "Shërbimi ndaj klientit: 14% më shumë raste në orë me AI.", "Kundenservice: 14 % mehr gelöste Fälle pro Stunde mit KI.") },
          { k: "2023", t: x("Consultants: big gains inside the frontier, worse results outside it.", "Konsulentët: fitime të mëdha brenda kufirit, rezultate më të dobëta jashtë tij.", "Berater: große Gewinne innerhalb der Grenze, schlechtere Ergebnisse außerhalb.") },
          { k: "2025", t: x("Developers: 19% slower, with the feeling of being faster.", "Programuesit: 19% më ngadalë, me ndjesinë se ishin më të shpejtë.", "Entwickler: 19 % langsamer, mit dem Gefühl, schneller zu sein.") },
          { k: "2026", t: x("Gallup: half of US employees use AI at work.", "Gallup: gjysma e punonjësve në SHBA përdorin AI në punë.", "Gallup: Die Hälfte der US-Beschäftigten nutzt KI bei der Arbeit.") },
        ] },
        { type: "callout", reading: true, text: x(
          "The feeling of speed is not a measurement. Before a team changes how it works, someone has to measure the work, not the impression.",
          "Ndjesia e shpejtësisë nuk është matje. Para se një ekip të ndryshojë mënyrën si punon, dikush duhet të masë punën, jo përshtypjen.",
          "Das Gefühl von Tempo ist keine Messung. Bevor ein Team seine Arbeitsweise ändert, muss jemand die Arbeit messen, nicht den Eindruck.") },
      ],
      source: ["metr-2025", "brynjolfsson-2023", "dellacqua-2023", "gallup-ai-indicator"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("Half use it,", "Gjysma e përdorin,", "Die Hälfte nutzt sie,"), x("few have a plan", "pak kanë plan", "wenige haben einen Plan")],
      lead: x(
        "Since 2023 Gallup has asked US employees how often they use AI in their role. Use has more than doubled; the plans have not kept up.",
        "Që nga 2023, Gallup i pyet punonjësit në SHBA sa shpesh e përdorin AI-në në punën e tyre. Përdorimi është më shumë se dyfishuar; planet nuk kanë ecur me të njëjtin hap.",
        "Seit 2023 fragt Gallup Beschäftigte in den USA, wie oft sie KI in ihrer Rolle nutzen. Die Nutzung hat sich mehr als verdoppelt; die Pläne haben nicht Schritt gehalten."),
      blocks: [
        { type: "line", alert: true, min: 0, max: 60, height: 96, source: ["gallup-ai-2025", "gallup-ai-indicator"],
          label: x("Use AI at work a few times a year or more, US, second quarter", "Përdorin AI në punë disa herë në vit ose më shpesh, SHBA, tremujori i dytë", "Nutzen KI bei der Arbeit mehrmals im Jahr oder öfter, USA, zweites Quartal"),
          points: [
            { k: "2023", v: 21, n: pc(21) },
            { k: "2025", v: 40, n: pc(40) },
            { k: "2026", v: 52, n: pc(52) },
          ] },
        { type: "figures", compact: true, items: [
          { n: pc(44), t: x("say their organisation has begun to integrate AI (2025)", "thonë se organizata ka nisur ta integrojë AI-në (2025)", "sagen, ihre Organisation habe begonnen, KI einzuführen (2025)") },
          { n: pc(22), t: x("say a clear plan was communicated to them (2025)", "thonë se u është komunikuar një plan i qartë (2025)", "sagen, ihnen sei ein klarer Plan mitgeteilt worden (2025)") },
        ] },
        { type: "p", text: x(
          "Frequent use, a few times a week or more, rose from 11% in 2023 to 30% in May 2026; 15% now use AI every day.",
          "Përdorimi i shpeshtë, disa herë në javë ose më shumë, u rrit nga 11% në 2023 në 30% në maj 2026; 15% e përdorin tani AI-në çdo ditë.",
          "Häufige Nutzung, mehrmals pro Woche oder öfter, stieg von 11 % im Jahr 2023 auf 30 % im Mai 2026; 15 % nutzen KI inzwischen täglich.") },
        { type: "callout", reading: true, text: x(
          "Use grows from the bottom; the plan has to come from the top. In between stands the manager, who sees both.",
          "Përdorimi rritet nga poshtë; plani duhet të vijë nga lart. Në mes qëndron menaxheri, që i sheh të dyja.",
          "Die Nutzung wächst von unten; der Plan muss von oben kommen. Dazwischen steht die Führungskraft, die beides sieht.") },
      ],
      source: ["gallup-ai-2025", "gallup-ai-indicator"],
    },
    {
      id: "model", more: "the-industry-changes-management-problems-do-not",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("The jagged", "Kufiri", "Die gezackte"), x("frontier", "i dhëmbëzuar", "Grenze")],
      lead: x(
        "In 2023 Harvard Business School and BCG gave 758 consultants GPT-4 for realistic tasks. The researchers call the line between what AI does well and badly a jagged frontier: tasks that look equally hard can fall on either side of it.",
        "Në 2023, Harvard Business School dhe BCG u dhanë 758 konsulentëve GPT-4 për detyra realiste. Studiuesit e quajnë vijën mes asaj që AI e bën mirë dhe keq një kufi të dhëmbëzuar: detyra që duken njësoj të vështira mund të bien në të dyja anët e tij.",
        "2023 gaben die Harvard Business School und BCG 758 Beratern GPT-4 für realistische Aufgaben. Die Forschenden nennen die Linie zwischen dem, was KI gut und schlecht kann, eine gezackte Grenze: Gleich schwer wirkende Aufgaben können auf beiden Seiten liegen."),
      blocks: [
        { type: "lists", cols: [
          { h: x("Inside the frontier", "Brenda kufirit", "Innerhalb der Grenze"), items: [
            x("12.2% more tasks completed", "12,2% më shumë detyra të mbaruara", "12,2 % mehr erledigte Aufgaben"),
            x("25.1% faster", "25,1% më shpejt", "25,1 % schneller"),
            x("Over 40% higher quality", "Mbi 40% cilësi më e lartë", "Über 40 % höhere Qualität"),
          ] },
          { h: x("Outside the frontier", "Jashtë kufirit", "Außerhalb der Grenze"), accent: true, items: [
            x("19 percentage points less likely to be correct", "19 pikë përqindjeje më pak gjasa për zgjidhje të saktë", "19 Prozentpunkte seltener richtig"),
            x("The help of AI made the result worse", "Ndihma e AI-së e përkeqësoi rezultatin", "Die Hilfe der KI machte das Ergebnis schlechter"),
            x("How hard the task looked did not tell the side", "Vështirësia e dukshme nuk tregonte anën", "Wie schwer die Aufgabe wirkte, verriet die Seite nicht"),
          ] },
        ] },
        { type: "p", text: x(
          "In customer support, 5,179 agents with an AI assistant solved 14% more cases per hour on average. The newest and least skilled gained 34%; the most experienced, almost nothing.",
          "Te shërbimi ndaj klientit, 5.179 agjentë me një asistent AI zgjidhën mesatarisht 14% më shumë raste në orë. Më të rinjtë në punë dhe ata me më pak aftësi fituan 34%; më të përvojshmit, pothuajse asgjë.",
          "Im Kundenservice lösten 5.179 Beschäftigte mit einem KI-Assistenten im Schnitt 14 % mehr Fälle pro Stunde. Die Neuesten und weniger Geübten gewannen 34 %, die Erfahrensten fast nichts.") },
        { type: "callout", reading: true, text: x(
          "AI helps most where the task is known and the result can be checked. Outside the frontier it needs someone who knows the work well enough to see the mistake.",
          "AI ndihmon më shumë aty ku detyra njihet dhe rezultati mund të kontrollohet. Jashtë kufirit i duhet dikush që e njeh punën aq mirë sa ta shohë gabimin.",
          "KI hilft am meisten, wo die Aufgabe bekannt ist und sich das Ergebnis prüfen lässt. Außerhalb der Grenze braucht sie jemanden, der die Arbeit gut genug kennt, um den Fehler zu sehen.") },
      ],
      note: x(
        "The frontier is the researchers' term; applying it to a manager's tasks is our reading.",
        "Kufiri është termi i studiuesve; zbatimi te detyrat e menaxherit është leximi ynë.",
        "Die Grenze ist der Begriff der Forschenden; die Anwendung auf die Aufgaben der Führung ist unsere Lesart."),
      source: ["dellacqua-2023", "brynjolfsson-2023"],
    },
    {
      id: "manager",
      kicker: x("The manager's part", "Pjesa e menaxherit", "Die Rolle der Führung"),
      title: [x("Where the", "Ku hyn", "Wo die Führungskraft"), x("manager comes in", "menaxheri", "ins Spiel kommt")],
      lead: x(
        "In Gallup's 2026 data, the manager's support goes together with whether AI use helps the team or stays a private habit.",
        "Te të dhënat e Gallup 2026, mbështetja e menaxherit shkon bashkë me faktin nëse përdorimi i AI-së e ndihmon ekipin apo mbetet zakon privat.",
        "In Gallups Daten von 2026 geht die Unterstützung der Führungskraft damit einher, ob KI-Nutzung dem Team hilft oder private Gewohnheit bleibt."),
      blocks: [
        { type: "hbars", max: 100, source: ["gallup-ai-engagement-2026"],
          label: x("Engaged employees, US, 2026", "Punonjës të angazhuar, SHBA, 2026", "Engagierte Beschäftigte, USA, 2026"),
          items: [
            { k: x("Frequent use, a clear plan and the manager's support together", "Përdorim i shpeshtë, plan i qartë dhe mbështetja e menaxherit bashkë", "Häufige Nutzung, klarer Plan und Unterstützung der Führung zusammen"), v: 53, n: pc(53) },
            { k: x("The manager actively supports the team's AI use", "Menaxheri e mbështet në mënyrë aktive përdorimin e AI-së", "Die Führungskraft unterstützt die KI-Nutzung aktiv"), v: 48, n: pc(48) },
            { k: x("Without that support", "Pa këtë mbështetje", "Ohne diese Unterstützung"), v: 30, n: pc(30), alert: true },
          ] },
        { type: "figures", compact: true, items: [
          { n: pc(36), t: x("strongly agree that their manager supports the team's AI use (organisations integrating AI, May 2026)", "pohojnë fuqishëm se menaxheri e mbështet përdorimin e AI-së në ekip (organizata që po e integrojnë AI-në, maj 2026)", "stimmen voll zu, dass ihre Führungskraft die KI-Nutzung im Team unterstützt (Organisationen, die KI einführen, Mai 2026)") },
          { n: pc(40), t: x("received “workslop” in the past month (1,150 US employees, 2025)", "kishin marrë “workslop” muajin e kaluar (1.150 punonjës në SHBA, 2025)", "hatten im letzten Monat „Workslop“ erhalten (1.150 US-Beschäftigte, 2025)") },
        ] },
        { type: "p", text: x(
          "Workslop is work made with AI that looks useful but lacks substance. The person who sent it saves time; the person who receives it has to interpret, correct or redo it.",
          "Workslop është punë e bërë me AI që duket e dobishme, por s'ka përmbajtje. Ai që e dërgon kursen kohë; ai që e merr duhet ta interpretojë, ta korrigjojë ose ta bëjë nga e para.",
          "Workslop ist mit KI erstellte Arbeit, die nützlich aussieht, aber keinen Gehalt hat. Wer sie schickt, spart Zeit; wer sie bekommt, muss sie deuten, korrigieren oder neu machen.") },
        { type: "callout", reading: true, text: x(
          "The manager sets the standard: what AI may do, who checks it and what counts as finished. Without a standard, one person's speed becomes the next person's rework.",
          "Menaxheri vendos standardin: çfarë mund të bëjë AI, kush e kontrollon dhe çfarë quhet e mbaruar. Pa standard, shpejtësia e njërit bëhet ripunim për tjetrin.",
          "Die Führungskraft setzt den Standard: was KI tun darf, wer prüft und was als fertig gilt. Ohne Standard wird das Tempo des einen zur Nacharbeit des anderen.") },
      ],
      source: ["gallup-ai-engagement-2026", "gallup-ai-indicator", "workslop-2025"],
    },
    {
      id: "measure", more: "kpis-do-not-improve-in-excel",
      kicker: x("How it is measured", "Si matet", "Wie man es misst"),
      title: [x("Measure", "Mate", "Messen,"), x("before you believe", "para se ta besosh", "bevor man glaubt")],
      lead: x(
        "In 2025 a preliminary MIT NANDA report said 95% of organisations saw no measurable return from generative AI. It rested on 52 interviews, 153 survey answers from four conferences and over 300 public projects; many headlines turned it into “95% of pilots fail”. Neither a headline nor a feeling replaces measuring your own work.",
        "Në 2025, një raport paraprak i MIT NANDA tha se 95% e organizatave nuk shihnin kthim të matshëm nga AI gjeneruese. Mbështetej te 52 intervista, 153 përgjigje nga katër konferenca dhe mbi 300 projekte publike; shumë tituj e kthyen në “95% e pilotëve dështojnë”. As titulli, as ndjesia nuk e zëvendësojnë matjen e punës sate.",
        "2025 sagte ein vorläufiger Bericht von MIT NANDA, 95 % der Organisationen sähen keinen messbaren Ertrag aus generativer KI. Er beruhte auf 52 Interviews, 153 Antworten von vier Konferenzen und über 300 öffentlichen Projekten; viele Schlagzeilen machten daraus „95 % der Pilotprojekte scheitern“. Weder Schlagzeile noch Gefühl ersetzen es, die eigene Arbeit zu messen."),
      blocks: [
        { type: "steps", items: [
          { h: x("Choose one task", "Zgjidh një detyrë", "Eine Aufgabe wählen"), p: x("Repeated, known, and with a result you can check.", "Që përsëritet, njihet mirë dhe ka rezultat që kontrollohet.", "Wiederkehrend, bekannt und mit prüfbarem Ergebnis.") },
          { h: x("Measure it without AI", "Mate pa AI", "Ohne KI messen"), p: x("Two weeks: time per task and the corrections it needs.", "Dy javë: koha për detyrë dhe korrigjimet që i duhen.", "Zwei Wochen: Zeit pro Aufgabe und nötige Korrekturen.") },
          { h: x("Measure it with AI", "Mate me AI", "Mit KI messen"), p: x("The same task and the same check, including the time spent checking.", "E njëjta detyrë dhe i njëjti kontroll, bashkë me kohën e kontrollit.", "Dieselbe Aufgabe, dieselbe Prüfung, samt der Zeit fürs Prüfen.") },
          { h: x("Decide with the numbers", "Vendos me shifrat", "Mit den Zahlen entscheiden"), p: x("Keep, change or stop, and write down who checks.", "Mbaje, ndryshoje ose ndalo, dhe shkruaj kush kontrollon.", "Behalten, ändern oder stoppen, und festhalten, wer prüft.") },
        ] },
        { type: "example", label: x("Hypothetical example, the weekly shift report", "Shembull hipotetik, raporti javor i turnit", "Hypothetisches Beispiel, der wöchentliche Schichtbericht"), rows: [
          { k: x("Without AI", "Pa AI", "Ohne KI"), v: x("3 h, 4 corrections", "3 orë, 4 korrigjime", "3 Std., 4 Korrekturen") },
          { k: x("With AI", "Me AI", "Mit KI"), v: x("1 h 10 min + 30 min checking, 1 correction", "1 orë e 10 min + 30 min kontroll, 1 korrigjim", "1 Std. 10 Min. + 30 Min. Prüfung, 1 Korrektur") },
        ], text: x("The saving is real but smaller than it feels: 1 h 20 min a week. The numbers are invented.", "Kursimi është i vërtetë, por më i vogël se ç'duket: 1 orë e 20 minuta në javë. Numrat janë të shpikur.", "Die Ersparnis ist echt, aber kleiner als gefühlt: 1 Std. 20 Min. pro Woche. Die Zahlen sind erfunden.") },
      ],
      note: x("The steps and the example are the editors'.", "Hapat dhe shembulli janë të redaksisë.", "Schritte und Beispiel stammen von der Redaktion."),
      source: ["nanda-2025"],
    },
    {
      id: "tool",
      kicker: x("Tool of the week", "Mjeti i javës", "Werkzeug der Woche"),
      title: [x("The AI", "Karta e detyrës", "Die KI-"), x("task card", "me AI", "Aufgabenkarte")],
      lead: x(
        "One card for every task you hand to AI. Fill it in with the person who does the task, and look at it again after a month.",
        "Një kartë për çdo detyrë që i jep AI-së. Plotësoje me personin që e bën detyrën, dhe rishikoje pas një muaji.",
        "Eine Karte für jede Aufgabe, die man der KI übergibt. Mit der Person ausfüllen, die die Aufgabe erledigt, und nach einem Monat wieder ansehen."),
      blocks: [
        { type: "form", items: [
          { h: x("The task", "Detyra", "Die Aufgabe"), hint: x("what, how often, for whom", "çfarë, sa shpesh, për kë", "was, wie oft, für wen") },
          { h: x("Inside or outside the frontier?", "Brenda apo jashtë kufirit?", "Innerhalb oder außerhalb der Grenze?"), hint: x("can a mistake be seen quickly?", "a duket shpejt një gabim?", "fällt ein Fehler schnell auf?") },
          { h: x("What AI does, what the person does", "Çfarë bën AI, çfarë bën personi", "Was die KI tut, was der Mensch tut"), lines: 2 },
          { h: x("Who checks, and how", "Kush kontrollon, dhe si", "Wer prüft, und wie"), hint: x("before it leaves the team", "para se të dalë nga ekipi", "bevor es das Team verlässt") },
          { h: x("Measured before and after", "Matja para dhe pas", "Vorher und nachher gemessen"), hint: x("time and corrections", "koha dhe korrigjimet", "Zeit und Korrekturen") },
          { h: x("Decision and review date", "Vendimi dhe data e rishikimit", "Entscheidung und Prüftermin"), hint: x("keep, change, stop", "mbaje, ndryshoje, ndalo", "behalten, ändern, stoppen") },
        ] },
      ],
      note: x(
        "A practice proposed by the editors. Do not put personal or confidential data into public AI tools, or on the card.",
        "Praktikë e propozuar nga redaksia. Mos fut të dhëna personale ose konfidenciale në mjete publike AI, as në kartë.",
        "Eine Praxis, die die Redaktion vorschlägt. Keine persönlichen oder vertraulichen Daten in öffentliche KI-Werkzeuge eingeben, auch nicht auf die Karte."),
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
