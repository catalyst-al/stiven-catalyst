// Management Review, No. 41: AI and the rules at work: the EU AI Act. Block: AI.
// Facts and their sources: docs/revista/management-review-nr-41.md.
import { x } from "../common.js";

export default {
  number: 41,
  block: "ai",
  date: x("November 2026", "Nëntor 2026", "November 2026"),
  theme: [x("AI and the rules at work:", "AI dhe rregullat në punë:", "KI und die Regeln bei der Arbeit:"), x("the EU AI Act", "EU AI Act", "der EU AI Act")],
  sub: x(
    "What applies and when, after the 2026 delay, how many firms use AI, the four levels of risk, what an employer must do before a high-risk system starts, what AI literacy asks, and a card for each AI system in a team.",
    "Çfarë zbatohet dhe kur, pas shtyrjes së 2026, sa firma përdorin AI, katër nivelet e rrezikut, çfarë duhet të bëjë punëdhënësi para se të nisë një sistem me rrezik të lartë, çfarë kërkojnë njohuritë për AI, dhe një kartë për çdo sistem AI në ekip.",
    "Was wann gilt, nach dem Aufschub von 2026, wie viele Unternehmen KI nutzen, die vier Risikostufen, was ein Arbeitgeber vor dem Start eines Hochrisiko-Systems tun muss, was KI-Kompetenz verlangt, und eine Karte für jedes KI-System im Team."),
  seo: x(
    "The EU AI Act at work: the dates after the 2026 delay, the four levels of risk, the ban on emotion recognition, deployers' duties, AI literacy and a card.",
    "EU AI Act në punë: afatet pas shtyrjes së 2026, katër nivelet e rrezikut, ndalimi i njohjes së emocioneve, detyrat e përdoruesit, njohuritë për AI, një kartë.",
    "Der EU AI Act bei der Arbeit: Fristen nach dem Aufschub 2026, vier Risikostufen, Verbot der Emotionserkennung, Betreiberpflichten, KI-Kompetenz, eine Karte."),
  feature: x(
    "Issue 41 opens the second series with the EU's AI Act: it sets out what has applied since 2025 and what the Digital Omnibus on AI postponed in 2026, counts the firms that already use AI, sorts uses into four levels of risk, from the banned emotion recognition at work to hiring and performance tools, lists what an employer must do before a high-risk system starts, explains the duty of AI literacy, and ends with a card for each AI system a team uses.",
    "Numri 41 e hap serinë e dytë me AI Act të BE-së: tregon çfarë zbatohet që nga 2025 dhe çfarë shtyu në 2026 Digital Omnibus për AI-në, numëron firmat që e përdorin tashmë AI-në, i ndan përdorimet në katër nivele rreziku, nga njohja e ndaluar e emocioneve në punë te mjetet për punësimin dhe vlerësimin e punës, rendit çfarë duhet të bëjë punëdhënësi para se të nisë një sistem me rrezik të lartë, shpjegon detyrën e njohurive për AI, dhe mbyllet me një kartë për çdo sistem AI që përdor ekipi.",
    "Ausgabe 41 eröffnet die zweite Serie mit dem AI Act der EU: Sie zeigt, was seit 2025 gilt und was der Digital-Omnibus zur KI 2026 verschoben hat, zählt die Unternehmen, die KI schon nutzen, ordnet Anwendungen in vier Risikostufen, von der verbotenen Emotionserkennung am Arbeitsplatz bis zu Werkzeugen für Einstellung und Leistungsbewertung, nennt, was ein Arbeitgeber vor dem Start eines Hochrisiko-Systems tun muss, erklärt die Pflicht zur KI-Kompetenz und endet mit einer Karte für jedes KI-System, das ein Team nutzt."),
  figure: { n: "16", by: "Regulation (EU) 2026/1744", t: x(
    "months later than first planned: the AI Act's rules for high-risk AI used to hire and manage workers now apply from 2 December 2027.",
    "muaj më vonë se sa ishte planifikuar: rregullat e AI Act për AI-në me rrezik të lartë në punësim dhe në drejtimin e punonjësve zbatohen tani nga 2 dhjetori 2027.",
    "Monate später als zunächst geplant: Die Regeln des AI Act für Hochrisiko-KI bei Einstellung und Führung von Beschäftigten gelten nun ab dem 2. Dezember 2027.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("What applies, and when", "Çfarë zbatohet, dhe kur", "Was gilt, und ab wann") },
    { page: "model", kicker: x("The model", "Modeli", "Das Modell"),
      title: x("Four levels of risk", "Katër nivele rreziku", "Vier Risikostufen") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The AI card for a team", "Karta e AI-së për ekipin", "Die KI-Karte für das Team") },
  ],
  sources: ["aiact-reg-2024", "aiact-omnibus-2026", "aiact-ec-framework", "aiact-ec-prohibited-2025", "aiact-ec-literacy-qa", "aiact-eurostat-2024", "aiact-eurostat-2025"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "AI tools can plan shifts, sort job applications or check work, and since 2024 the EU has a law for it. This issue sets out what the AI Act asks of a manager whose team uses AI, what already applies and what was postponed. It describes the law; it is not legal advice.",
        "Mjetet AI mund të planifikojnë turne, të renditin kërkesat për punë ose të kontrollojnë punën, dhe që nga 2024 BE-ja ka një ligj për të. Ky numër tregon çfarë i kërkon AI Act një menaxheri, ekipi i të cilit përdor AI, çfarë zbatohet tashmë dhe çfarë u shty. Përshkruan ligjin; nuk është këshillë ligjore.",
        "KI-Werkzeuge können Schichten planen, Bewerbungen sortieren oder Arbeit prüfen, und seit 2024 hat die EU ein Gesetz dafür. Diese Ausgabe zeigt, was der AI Act von einer Führungskraft verlangt, deren Team KI nutzt, was schon gilt und was verschoben wurde. Sie beschreibt das Gesetz; sie ist keine Rechtsberatung."),
      body: x(
        "The AI Act entered into force in August 2024. Its bans and the duty of AI literacy have applied since February 2025; in July 2026 a second regulation moved the rules for high-risk uses, among them hiring and managing workers, to December 2027. Eurostat counts one EU firm in five using AI in 2025. The Act sorts uses into four levels of risk, bans emotion recognition at work, and gives employers who deploy high-risk systems duties of their own, starting with informing the team.",
        "AI Act hyri në fuqi në gusht 2024. Ndalimet dhe detyra e njohurive për AI zbatohen që nga shkurti 2025; në korrik 2026 një rregullore e dytë i shtyu deri në dhjetor 2027 rregullat për përdorimet me rrezik të lartë, mes tyre punësimin dhe drejtimin e punonjësve. Eurostat numëron një firmë në pesë në BE që përdorte AI në 2025. Akti i ndan përdorimet në katër nivele rreziku, ndalon njohjen e emocioneve në punë, dhe u jep punëdhënësve që përdorin sisteme me rrezik të lartë detyra të vetat, duke nisur me informimin e ekipit.",
        "Der AI Act trat im August 2024 in Kraft. Seine Verbote und die Pflicht zur KI-Kompetenz gelten seit Februar 2025; im Juli 2026 verschob eine zweite Verordnung die Regeln für Hochrisiko-Anwendungen, darunter Einstellung und Führung von Beschäftigten, auf Dezember 2027. Eurostat zählt 2025 jedes fünfte EU-Unternehmen mit KI. Das Gesetz ordnet Anwendungen in vier Risikostufen, verbietet Emotionserkennung am Arbeitsplatz und gibt Arbeitgebern, die Hochrisiko-Systeme betreiben, eigene Pflichten, angefangen damit, das Team zu informieren."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("What applies,", "Çfarë zbatohet,", "Was gilt,"), x("and when", "dhe kur", "und ab wann")],
      lead: x(
        "The AI Act, Regulation (EU) 2024/1689, entered into force on 1 August 2024 and applies in stages. In July 2026 the EU changed part of its calendar with a second regulation, the Digital Omnibus on AI.",
        "AI Act, Rregullorja (BE) 2024/1689, hyri në fuqi më 1 gusht 2024 dhe zbatohet me faza. Në korrik 2026, BE-ja ndryshoi një pjesë të kalendarit të tij me një rregullore të dytë, Digital Omnibus për AI-në.",
        "Der AI Act, die Verordnung (EU) 2024/1689, trat am 1. August 2024 in Kraft und gilt schrittweise. Im Juli 2026 änderte die EU einen Teil seines Zeitplans mit einer zweiten Verordnung, dem Digital-Omnibus zur KI."),
      blocks: [
        { type: "timeline", items: [
          { k: "2025", t: x("2 February: the bans, among them emotion recognition at work, and the duty of AI literacy.", "2 shkurt: ndalimet, mes tyre njohja e emocioneve në punë, dhe detyra e njohurive për AI.", "2. Februar: die Verbote, darunter Emotionserkennung am Arbeitsplatz, und die Pflicht zur KI-Kompetenz.") },
          { k: "2026", t: x("2 August: most of the Act, including transparency for chatbots and deepfakes.", "2 gusht: pjesa më e madhe e aktit, edhe transparenca për chatbot-et dhe deepfake-t.", "2. August: der Großteil des Gesetzes, auch die Transparenz bei Chatbots und Deepfakes.") },
          { k: "2027", t: x("2 December: high-risk rules for Annex III uses, among them work and hiring.", "2 dhjetor: rregullat për përdorimet me rrezik të lartë të Aneksit III, mes tyre puna dhe punësimi.", "2. Dezember: Hochrisiko-Regeln für Anwendungen nach Anhang III, darunter Arbeit und Einstellung.") },
          { k: "2028", t: x("2 August: high-risk rules for AI built into regulated products.", "2 gusht: rregullat për AI-në me rrezik të lartë brenda produkteve të rregulluara.", "2. August: Hochrisiko-Regeln für KI in regulierten Produkten.") },
        ] },
        { type: "p", text: x(
          "The delay is law, not a proposal. The Commission proposed it in November 2025, because the standards for high-risk systems were late; Parliament voted on 16 June 2026, the Council approved on 29 June, and Regulation (EU) 2026/1744 entered into force on 27 July 2026. Annex III moved from 2 August 2026, the product rules from 2 August 2027. Since August 2025 the rules for general-purpose AI models and the penalties have applied.",
          "Shtyrja është ligj, jo propozim. Komisioni e propozoi në nëntor 2025, sepse standardet për sistemet me rrezik të lartë ishin vonë; Parlamenti votoi më 16 qershor 2026, Këshilli e miratoi më 29 qershor, dhe Rregullorja (BE) 2026/1744 hyri në fuqi më 27 korrik 2026. Aneksi III u shty nga 2 gushti 2026, rregullat për produktet nga 2 gushti 2027. Që nga gushti 2025 zbatohen rregullat për modelet AI me qëllim të përgjithshëm dhe gjobat.",
          "Der Aufschub ist Gesetz, kein Vorschlag. Die Kommission schlug ihn im November 2025 vor, weil die Normen für Hochrisiko-Systeme fehlten; das Parlament stimmte am 16. Juni 2026 zu, der Rat am 29. Juni, und die Verordnung (EU) 2026/1744 trat am 27. Juli 2026 in Kraft. Anhang III rückte vom 2. August 2026, die Produktregeln vom 2. August 2027. Seit August 2025 gelten die Regeln für KI-Modelle mit allgemeinem Verwendungszweck und die Sanktionen.") },
        { type: "callout", reading: true, text: x(
          "The delay moved the high-risk rules, not the bans or AI literacy. Those have applied since February 2025.",
          "Shtyrja lëvizi rregullat për rrezikun e lartë, jo ndalimet ose njohuritë për AI. Këto zbatohen që nga shkurti 2025.",
          "Verschoben wurden die Hochrisiko-Regeln, nicht die Verbote oder die KI-Kompetenz. Diese gelten seit Februar 2025.") },
      ],
      note: x(
        "Dates as in Article 113 as amended in 2026. The Act also covers firms outside the EU when the output of their AI is used in the EU (Article 2). A description of the law, not legal advice.",
        "Datat sipas nenit 113, siç u ndryshua në 2026. Akti mbulon edhe firmat jashtë BE-së, kur rezultati i AI-së së tyre përdoret në BE (neni 2). Përshkrim i ligjit, jo këshillë ligjore.",
        "Daten nach Artikel 113 in der Fassung von 2026. Das Gesetz erfasst auch Unternehmen außerhalb der EU, wenn die Ergebnisse ihrer KI in der EU verwendet werden (Artikel 2). Eine Beschreibung des Gesetzes, keine Rechtsberatung."),
      source: ["aiact-reg-2024", "aiact-omnibus-2026", "aiact-ec-framework"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("AI in one firm", "AI në një firmë", "KI in jedem fünften"), x("in five", "në pesë", "Unternehmen")],
      lead: x(
        "Eurostat asks enterprises in the EU with at least 10 employees whether they use AI technologies, such as text mining, speech recognition or the generation of language. The share has more than doubled in two years.",
        "Eurostat i pyet ndërmarrjet në BE me të paktën 10 punonjës nëse përdorin teknologji AI, si analiza e teksteve, njohja e të folurit ose gjenerimi i gjuhës. Pjesa e tyre është më shumë se dyfishuar në dy vjet.",
        "Eurostat fragt Unternehmen in der EU mit mindestens 10 Beschäftigten, ob sie KI-Technologien nutzen, etwa Text Mining, Spracherkennung oder Sprachgenerierung. Der Anteil hat sich in zwei Jahren mehr als verdoppelt."),
      blocks: [
        { type: "line", alert: true, min: 0, max: 25, height: 100, source: ["aiact-eurostat-2024", "aiact-eurostat-2025"],
          label: x("EU enterprises with 10 or more employees that use AI", "Ndërmarrjet në BE me 10 e më shumë punonjës që përdorin AI", "EU-Unternehmen mit 10 und mehr Beschäftigten, die KI nutzen"),
          points: [
            { k: "2023", v: 8, n: x("8.0%", "8,0%", "8,0 %") },
            { k: "2024", v: 13.5, n: x("13.5%", "13,5%", "13,5 %") },
            { k: "2025", v: 20, n: x("20.0%", "20,0%", "20,0 %") },
          ] },
        { type: "p", text: x(
          "Size makes the difference: in 2025, 55% of large enterprises used AI, 30% of medium-sized and 17% of small ones. In the Act's terms, every firm that uses an AI system under its own authority is a deployer, not only the firms that build it.",
          "Madhësia e bën dallimin: në 2025, AI e përdornin 55% e ndërmarrjeve të mëdha, 30% e atyre të mesme dhe 17% e atyre të vogla. Në gjuhën e aktit, çdo firmë që përdor një sistem AI nën autoritetin e vet është përdorues (deployer), jo vetëm firmat që e ndërtojnë.",
          "Die Größe macht den Unterschied: 2025 nutzten 55 % der großen Unternehmen KI, 30 % der mittleren und 17 % der kleinen. Im Sinne des Gesetzes ist jedes Unternehmen, das ein KI-System in eigener Verantwortung verwendet, Betreiber, nicht nur die Unternehmen, die es bauen.") },
        { type: "callout", reading: true, text: x(
          "Most firms will meet the Act as users of bought tools. The duties that reach them are those of the deployer.",
          "Shumica e firmave do ta takojnë aktin si përdoruese të mjeteve të blera. Detyrat që i prekin janë ato të përdoruesit.",
          "Die meisten Unternehmen begegnen dem Gesetz als Nutzer gekaufter Werkzeuge. Für sie gelten die Pflichten des Betreibers.") },
      ],
      note: x(
        "EU-27, enterprises with 10 or more employees; micro-enterprises are not counted. Use of at least one AI technology, not only generative AI. The deployer is defined in Article 3(4) of the Act.",
        "BE-27, ndërmarrje me 10 e më shumë punonjës; mikrondërmarrjet nuk numërohen. Përdorimi i të paktën një teknologjie AI, jo vetëm AI-së gjeneruese. Përdoruesi (deployer) përkufizohet te neni 3(4) i aktit.",
        "EU-27, Unternehmen mit 10 und mehr Beschäftigten; Kleinstunternehmen sind nicht erfasst. Nutzung mindestens einer KI-Technologie, nicht nur generativer KI. Der Betreiber ist in Artikel 3 Nummer 4 des Gesetzes definiert."),
      source: ["aiact-eurostat-2024", "aiact-eurostat-2025", "aiact-reg-2024"],
    },
    {
      id: "model",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Four levels", "Katër nivele", "Vier"), x("of risk", "rreziku", "Risikostufen")],
      lead: x(
        "The Act regulates uses of AI by the risk they carry for health, safety and fundamental rights. The European Commission describes four levels, from banned to free of new rules.",
        "Akti i rregullon përdorimet e AI-së sipas rrezikut që sjellin për shëndetin, sigurinë dhe të drejtat themelore. Komisioni Evropian përshkruan katër nivele, nga e ndaluara te ajo pa rregulla të reja.",
        "Das Gesetz regelt KI-Anwendungen nach ihrem Risiko für Gesundheit, Sicherheit und Grundrechte. Die Europäische Kommission beschreibt vier Stufen, vom Verbot bis zu keinen neuen Regeln."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("Unacceptable: banned", "E papranueshme: e ndaluar", "Unannehmbar: verboten"), p: x("Among the practices in Article 5: inferring the emotions of people at the workplace, except for medical or safety reasons; social scoring; manipulation.", "Mes praktikave të nenit 5: nxjerrja e emocioneve të njerëzve në vendin e punës, përveç arsyeve mjekësore ose të sigurisë; pikëzimi social; manipulimi.", "Unter den Praktiken in Artikel 5: Emotionen von Menschen am Arbeitsplatz ableiten, außer aus medizinischen oder Sicherheitsgründen; Social Scoring; Manipulation.") },
          { h: x("High: strict duties", "E lartë: detyra të rrepta", "Hoch: strenge Pflichten"), p: x("Annex III, point 4: AI to recruit and select, to decide on promotion or dismissal, to allocate tasks by behaviour or traits, or to monitor and evaluate performance.", "Aneksi III, pika 4: AI për rekrutim dhe përzgjedhje, për vendime për ngritje ose largim, për ndarjen e detyrave sipas sjelljes ose tipareve, ose për mbikëqyrjen dhe vlerësimin e punës.", "Anhang III, Nummer 4: KI zur Einstellung und Auswahl, für Entscheidungen über Beförderung oder Kündigung, zur Aufgabenverteilung nach Verhalten oder Merkmalen oder zur Überwachung und Bewertung der Leistung.") },
          { h: x("Transparency: tell people", "Transparencë: njoftoji njerëzit", "Transparenz: Menschen informieren"), p: x("People must know when they are talking to a chatbot; deepfakes must be labelled (Article 50).", "Njerëzit duhet ta dinë kur flasin me një chatbot; deepfake-t duhet të etiketohen (neni 50).", "Menschen müssen wissen, wenn sie mit einem Chatbot sprechen; Deepfakes müssen gekennzeichnet sein (Artikel 50).") },
          { h: x("Minimal: no new rules", "Minimale: pa rregulla të reja", "Minimal: keine neuen Regeln"), p: x("For example spam filters or AI in video games.", "Për shembull filtrat e spam-it ose AI në videolojëra.", "Etwa Spamfilter oder KI in Videospielen.") },
        ] },
        { type: "p", text: x(
          "In its 2025 guidelines the Commission counts as banned a call centre that tracks its employees' anger through webcams and voice recognition. Tracking customers is not, if staff are not tracked at the same time. Fatigue and pain are physical states, not emotions.",
          "Në udhëzimet e 2025, Komisioni e quan të ndaluar një qendër thirrjesh që ndjek zemërimin e punonjësve me kamera dhe njohje të zërit. Ndjekja e klientëve nuk ndalohet, nëse nuk ndiqet njëkohësisht stafi. Lodhja dhe dhimbja janë gjendje fizike, jo emocione.",
          "In ihren Leitlinien von 2025 wertet die Kommission ein Callcenter als verboten, das den Ärger seiner Beschäftigten per Webcam und Spracherkennung verfolgt. Bei Kunden gilt das nicht, wenn nicht zugleich das Personal erfasst wird. Müdigkeit und Schmerz sind körperliche Zustände, keine Emotionen.") },
        { type: "callout", reading: true, text: x(
          "The level depends on the use, not the software: the same tool can plan routes or rank people.",
          "Niveli varet nga përdorimi, jo nga softueri: i njëjti mjet mund të planifikojë rrugë ose të renditë njerëz.",
          "Die Stufe hängt von der Anwendung ab, nicht von der Software: Dasselbe Werkzeug kann Routen planen oder Menschen einstufen.") },
      ],
      note: x(
        "An Annex III system can fall outside the high level, for instance if it only does a narrow procedural task (Article 6(3)); one that profiles people never does. The guidelines are not binding.",
        "Një sistem i Aneksit III mund të dalë nga niveli i lartë, për shembull nëse kryen vetëm një detyrë të ngushtë procedurale (neni 6(3)); ai që profilizon njerëz nuk del kurrë. Udhëzimet nuk janë detyruese.",
        "Ein System nach Anhang III kann aus der hohen Stufe fallen, etwa wenn es nur eine eng begrenzte Verfahrensaufgabe erfüllt (Artikel 6 Absatz 3); eines, das Profile von Menschen erstellt, nie. Die Leitlinien sind nicht verbindlich."),
      source: ["aiact-ec-framework", "aiact-reg-2024", "aiact-ec-prohibited-2025"],
    },
    {
      id: "apply",
      kicker: x("How it is applied", "Si zbatohet", "Wie es umgesetzt wird"),
      title: [x("Before the system", "Para se të nisë", "Bevor das System"), x("starts", "sistemi", "startet")],
      lead: x(
        "A firm that uses a high-risk AI system under its own authority is its deployer. Article 26 gives the deployer duties of its own, apart from those of the provider; for Annex III systems they apply from 2 December 2027.",
        "Firma që përdor një sistem AI me rrezik të lartë nën autoritetin e vet është përdoruesi i tij. Neni 26 i jep përdoruesit detyra të vetat, të ndara nga ato të ofruesit; për sistemet e Aneksit III ato zbatohen nga 2 dhjetori 2027.",
        "Ein Unternehmen, das ein Hochrisiko-KI-System in eigener Verantwortung verwendet, ist dessen Betreiber. Artikel 26 gibt dem Betreiber eigene Pflichten, getrennt von denen des Anbieters; für Systeme nach Anhang III gelten sie ab dem 2. Dezember 2027."),
      blocks: [
        { type: "steps", items: [
          { h: x("Follow the instructions", "Ndiq udhëzimet", "Der Betriebsanleitung folgen"), p: x("Use the system as the provider's instructions for use say (26(1)).", "Përdore sistemin siç thonë udhëzimet e përdorimit të ofruesit (26(1)).", "Das System so verwenden, wie es die Betriebsanleitung des Anbieters vorsieht (26 Abs. 1).") },
          { h: x("Name the people who oversee it", "Cakto kush e mbikëqyr", "Aufsicht benennen"), p: x("With the competence, training and authority to do it, and support (26(2)).", "Me aftësinë, trajnimin dhe autoritetin për ta bërë, dhe me mbështetje (26(2)).", "Mit Kompetenz, Schulung und Befugnis dafür, und mit Unterstützung (26 Abs. 2).") },
          { h: x("Inform the team first", "Informo ekipin më parë", "Zuerst das Team informieren"), p: x("Employers tell workers' representatives and the affected workers before the system is used at work (26(7)).", "Punëdhënësi i njofton përfaqësuesit e punonjësve dhe punonjësit e prekur para se sistemi të përdoret në punë (26(7)).", "Arbeitgeber informieren die Arbeitnehmervertretung und die betroffenen Beschäftigten, bevor das System am Arbeitsplatz eingesetzt wird (26 Abs. 7).") },
          { h: x("Monitor and report", "Mbikëqyr dhe raporto", "Überwachen und melden"), p: x("If a risk appears, inform the provider and the authority and suspend use; report serious incidents (26(5)).", "Nëse shfaqet një rrezik, njofto ofruesin dhe autoritetin dhe pezullo përdorimin; raporto incidentet e rënda (26(5)).", "Zeigt sich ein Risiko, Anbieter und Behörde informieren und die Nutzung aussetzen; schwerwiegende Vorfälle melden (26 Abs. 5).") },
          { h: x("Keep the logs, tell the people concerned", "Ruaj regjistrat, njofto të prekurit", "Protokolle aufbewahren, Betroffene informieren"), p: x("Logs for at least six months; people about whom it decides or helps decide are told (26(6), 26(11)).", "Regjistrat për të paktën gjashtë muaj; njerëzit për të cilët vendos ose ndihmon të vendoset njoftohen (26(6), 26(11)).", "Protokolle mindestens sechs Monate; Personen, über die es entscheidet oder mitentscheidet, werden informiert (26 Abs. 6 und 11).") },
        ] },
        { type: "callout", reading: true, text: x(
          "The notice to the team comes before the first use, not after the first complaint.",
          "Njoftimi për ekipin vjen para përdorimit të parë, jo pas ankesës së parë.",
          "Die Information an das Team kommt vor dem ersten Einsatz, nicht nach der ersten Beschwerde.") },
      ],
      note: x(
        "A selection of the duties in Article 26; the Digital Omnibus moved their date, not their content. The notice follows national rules on informing workers. Not legal advice.",
        "Një përzgjedhje e detyrave të nenit 26; Digital Omnibus ua shtyu datën, jo përmbajtjen. Njoftimi ndjek rregullat kombëtare për informimin e punonjësve. Jo këshillë ligjore.",
        "Eine Auswahl der Pflichten aus Artikel 26; der Digital-Omnibus verschob ihr Datum, nicht ihren Inhalt. Die Information folgt den nationalen Regeln zur Unterrichtung der Beschäftigten. Keine Rechtsberatung."),
      source: ["aiact-reg-2024", "aiact-omnibus-2026"],
    },
    {
      id: "measure", more: "watch-how-i-do-it-is-not-training",
      kicker: x("How it is measured", "Si matet", "Wie man es misst"),
      title: [x("AI literacy:", "Njohuritë për AI:", "KI-Kompetenz:"), x("what counts", "çfarë vlen", "was zählt")],
      lead: x(
        "Article 4 has applied since 2 February 2025 to every provider and deployer, whatever the risk of the system. The Digital Omnibus softened its wording in 2026; the duty remains.",
        "Neni 4 zbatohet që nga 2 shkurti 2025 për çdo ofrues dhe përdorues, cilido qoftë rreziku i sistemit. Digital Omnibus e zbuti formulimin e tij në 2026; detyra mbetet.",
        "Artikel 4 gilt seit dem 2. Februar 2025 für alle Anbieter und Betreiber, unabhängig vom Risiko des Systems. Der Digital-Omnibus hat 2026 seinen Wortlaut abgeschwächt; die Pflicht bleibt."),
      blocks: [
        { type: "lists", cols: [
          { h: x("Until July 2026", "Deri në korrik 2026", "Bis Juli 2026"), items: [
            x("Ensure, to their best extent, a sufficient level of AI literacy", "Të sigurojnë, sa më mirë që munden, një nivel të mjaftueshëm njohurish për AI", "Nach besten Kräften ein ausreichendes Maß an KI-Kompetenz sicherstellen"),
            x("of staff and others who operate AI on their behalf", "të stafit dhe të tjerëve që përdorin AI në emër të tyre", "bei Personal und anderen, die KI in ihrem Auftrag bedienen"),
          ] },
          { h: x("Since July 2026", "Që nga korriku 2026", "Seit Juli 2026"), accent: true, items: [
            x("Take measures to support the development of AI literacy", "Të marrin masa për të mbështetur zhvillimin e njohurive për AI", "Maßnahmen ergreifen, um die Entwicklung der KI-Kompetenz zu fördern"),
            x("No guaranteed level for any individual", "Pa një nivel të garantuar për secilin individ", "Kein garantiertes Niveau für einzelne Personen"),
          ] },
        ] },
        { type: "p", text: x(
          "Both versions weigh people's knowledge, experience and training, the context of use and those affected. The Commission's Q&A asks for a general understanding of AI, the firm's role as provider or deployer and the risks of its systems. No certificate is needed; an internal record of trainings is enough. National market surveillance authorities supervise from August 2026.",
          "Të dy versionet marrin parasysh njohuritë, përvojën dhe trajnimin e njerëzve, kontekstin e përdorimit dhe ata që preken. Pyetjet dhe përgjigjet e Komisionit kërkojnë një kuptim të përgjithshëm të AI-së, rolin e firmës si ofrues ose përdorues dhe rreziqet e sistemeve të saj. Nuk duhet certifikatë; mjafton një regjistër i brendshëm i trajnimeve. Autoritetet kombëtare të mbikëqyrjes së tregut mbikëqyrin nga gushti 2026.",
          "Beide Fassungen berücksichtigen Wissen, Erfahrung und Ausbildung der Menschen, den Einsatzkontext und die Betroffenen. Die Fragen und Antworten der Kommission verlangen ein allgemeines Verständnis von KI, die Rolle des Unternehmens als Anbieter oder Betreiber und die Risiken seiner Systeme. Ein Zertifikat ist nicht nötig; ein interner Nachweis der Schulungen genügt. Die nationalen Marktüberwachungsbehörden beaufsichtigen ab August 2026.") },
        { type: "example", label: x("Hypothetical example, a dispatch team with two AI tools", "Shembull hipotetik, një ekip dispeçerësh me dy mjete AI", "Hypothetisches Beispiel, ein Dispositionsteam mit zwei KI-Werkzeugen"), rows: [
          { k: x("Who uses AI", "Kush përdor AI", "Wer KI nutzt"), v: x("12 of 14 people, a route planner and a chatbot", "12 nga 14 veta, një planifikues rrugësh dhe një chatbot", "12 von 14 Personen, ein Routenplaner und ein Chatbot") },
          { k: x("Training", "Trajnimi", "Schulung"), v: x("one hour on limits and errors; 10 of 12 done", "një orë për kufijtë dhe gabimet; e bënë 10 nga 12", "eine Stunde zu Grenzen und Fehlern; 10 von 12 erledigt") },
        ], text: x("The record names the date, the content and who took part. Team and numbers are invented.", "Regjistri shënon datën, përmbajtjen dhe kush mori pjesë. Ekipi dhe numrat janë të shpikur.", "Der Nachweis nennt Datum, Inhalt und Teilnehmende. Team und Zahlen sind erfunden.") },
      ],
      note: x(
        "The two wordings are summarised from Article 4 before and after Regulation (EU) 2026/1744; the example is the editors'.",
        "Dy formulimet janë përmbledhur nga neni 4 para dhe pas Rregullores (BE) 2026/1744; shembulli është i redaksisë.",
        "Die beiden Fassungen sind aus Artikel 4 vor und nach der Verordnung (EU) 2026/1744 zusammengefasst; das Beispiel stammt von der Redaktion."),
      source: ["aiact-reg-2024", "aiact-omnibus-2026", "aiact-ec-literacy-qa"],
    },
    {
      id: "tool", tool: "/tools/shift-handover/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The AI card", "Karta e AI-së", "Die KI-Karte"), x("for a team", "për ekipin", "für das Team")],
      lead: x(
        "One card for each AI system the team uses. Fill it in before the first use, keep it with the training record, and look at it again when the system or its use changes. Problems with the system go into the shift handover, with an owner and a time.",
        "Një kartë për çdo sistem AI që përdor ekipi. Plotësoje para përdorimit të parë, mbaje bashkë me regjistrin e trajnimeve, dhe rishikoje kur ndryshon sistemi ose përdorimi i tij. Problemet me sistemin hyjnë në dorëzimin e turnit, me përgjegjës dhe orë.",
        "Eine Karte für jedes KI-System, das das Team nutzt. Vor dem ersten Einsatz ausfüllen, beim Schulungsnachweis aufbewahren und wieder ansehen, wenn sich das System oder sein Einsatz ändert. Probleme mit dem System gehören in die Schichtübergabe, mit verantwortlicher Person und Uhrzeit."),
      blocks: [
        { type: "form", items: [
          { h: x("System and provider", "Sistemi dhe ofruesi", "System und Anbieter"), hint: x("what it does, who supplies it, where the instructions for use are", "çfarë bën, kush e ofron, ku janë udhëzimet e përdorimit", "was es tut, wer es liefert, wo die Betriebsanleitung liegt") },
          { h: x("Use and level of risk", "Përdorimi dhe niveli i rrezikut", "Einsatz und Risikostufe"), hint: x("what we use it for; banned, high, transparency or minimal; who decided", "për çfarë e përdorim; e ndaluar, e lartë, transparencë apo minimale; kush vendosi", "wofür wir es nutzen; verboten, hoch, Transparenz oder minimal; wer entschieden hat") },
          { h: x("Oversight", "Mbikëqyrja", "Aufsicht"), hint: x("who oversees it, with what training, and who may stop it", "kush e mbikëqyr, me çfarë trajnimi, dhe kush mund ta ndalë", "wer es beaufsichtigt, mit welcher Schulung, und wer es stoppen darf") },
          { h: x("Team informed", "Ekipi u informua", "Team informiert"), hint: x("when and how; workers' representatives too", "kur dhe si; edhe përfaqësuesit e punonjësve", "wann und wie; auch die Arbeitnehmervertretung") },
          { h: x("AI literacy", "Njohuritë për AI", "KI-Kompetenz"), hint: x("what people learned, when, where the record is", "çfarë mësuan njerëzit, kur, ku është regjistri", "was die Menschen gelernt haben, wann, wo der Nachweis liegt") },
          { h: x("Problems and logs", "Problemet dhe regjistrat", "Probleme und Protokolle"), hint: x("who reports to the provider, where the logs are kept, for how long", "kush i raporton ofruesit, ku ruhen regjistrat, për sa kohë", "wer an den Anbieter meldet, wo die Protokolle liegen, wie lange") },
        ] },
      ],
      note: x(
        "A practice proposed by the editors, after Articles 4, 5, 26 and Annex III of the AI Act and the Commission's four levels. It does not replace legal advice or the provider's instructions.",
        "Praktikë e propozuar nga redaksia, sipas neneve 4, 5, 26 dhe Aneksit III të AI Act, dhe katër niveleve të Komisionit. Nuk zëvendëson këshillën ligjore as udhëzimet e ofruesit.",
        "Eine Praxis, die die Redaktion vorschlägt, nach den Artikeln 4, 5 und 26 sowie Anhang III des AI Act und den vier Stufen der Kommission. Sie ersetzt weder Rechtsberatung noch die Anleitung des Anbieters."),
      source: ["aiact-reg-2024", "aiact-ec-framework", "aiact-ec-literacy-qa"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
