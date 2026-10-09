// Management Review, No. 8: Who decides what. Block: Strategy.
// Facts and their sources: docs/revista/management-review-nr-08.md.
import { x, pc } from "../common.js";

export default {
  number: 8,
  block: "strategy",
  date: x("October 2026", "Tetor 2026", "Oktober 2026"),
  theme: [x("Who decides", "Kush vendos", "Wer entscheidet"), x("what", "çfarë", "was")],
  sub: x(
    "Why decisions get stuck between people rather than for lack of information, four kinds of decisions, and five roles that make clear who has the final word.",
    "Pse vendimet ngecin mes njerëzve dhe jo nga mungesa e informacionit, katër lloje vendimesh, dhe pesë role që e bëjnë të qartë kush ka fjalën e fundit.",
    "Warum Entscheidungen zwischen Menschen hängen bleiben und nicht aus Mangel an Information, vier Arten von Entscheidungen und fünf Rollen, die klären, wer das letzte Wort hat."),
  seo: x(
    "Who decides what: McKinsey on decision speed and quality, four kinds of decisions, the RAPID roles and a map of your team's decisions.",
    "Kush vendos çfarë: McKinsey për shpejtësinë dhe cilësinë e vendimeve, katër lloje vendimesh, rolet RAPID dhe harta e vendimeve të ekipit.",
    "Wer entscheidet was: McKinsey zu Tempo und Qualität, vier Arten von Entscheidungen, die RAPID-Rollen und eine Landkarte der Teamentscheidungen."),
  feature: x(
    "Issue 8 starts with a survey in which only one respondent in five rated their organisation's decisions excellent, shows why speed and quality go together, sorts decisions into four kinds and gives every important one five roles.",
    "Numri 8 nis me një anketë ku vetëm një në pesë të anketuar i vlerësoi të shkëlqyera vendimet e organizatës së vet, tregon pse shpejtësia dhe cilësia ecin bashkë, i ndan vendimet në katër lloje dhe i jep çdo vendimi të rëndësishëm pesë role.",
    "Ausgabe 8 beginnt mit einer Umfrage, in der nur jede fünfte befragte Person die Entscheidungen ihrer Organisation als hervorragend bewertete, zeigt, warum Tempo und Qualität zusammengehen, teilt Entscheidungen in vier Arten ein und gibt jeder wichtigen fünf Rollen."),
  figure: { n: pc(20), by: "McKinsey, 2019", t: x(
    "of respondents said their organisation excels at decision making. Only 48% said it decides quickly.",
    "e të anketuarve thanë se organizata e tyre merr vendime shkëlqyeshëm. Vetëm 48% thanë se i merr shpejt.",
    "der Befragten sagten, ihre Organisation entscheide hervorragend. Nur 48 % sagten, sie entscheide schnell.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("Speed does not spoil quality", "Shpejtësia nuk e prish cilësinë", "Tempo verdirbt die Qualität nicht") },
    { page: "roles", kicker: x("The roles", "Rolet", "Die Rollen"),
      title: x("Who has the \"D\"?", "Kush e ka \"D\"-në?", "Wer hat das „D“?") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The decision card", "Karta e një vendimi", "Die Entscheidungskarte") },
  ],
  sources: ["mckinsey-2019-decisions", "mckinsey-2019-three-keys", "desmet-2017", "rogers-blenko-2006"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Many decisions are not late because data is missing. They are late because nobody knows who decides. This issue is about decision rights: who proposes, who gives input and who has the final word.",
        "Shumë vendime nuk vonohen sepse mungojnë të dhënat. Vonohen sepse nuk dihet kush vendos. Ky numër flet për të drejtat e vendimit: kush propozon, kush jep mendim dhe kush ka fjalën e fundit.",
        "Viele Entscheidungen verzögern sich nicht, weil Daten fehlen, sondern weil niemand weiß, wer entscheidet. Diese Ausgabe handelt von Entscheidungsrechten: wer vorschlägt, wer beiträgt und wer das letzte Wort hat."),
      body: x(
        "In a McKinsey survey of 1,259 respondents, only one in five said their organisation makes decisions excellently. In 2017 McKinsey had sorted decisions into four kinds, each with its own way of deciding. And in 2006 Paul Rogers and Marcia Blenko proposed five roles that make clear who has the final word.",
        "Në një anketë të McKinsey me 1.259 të anketuar, vetëm një në pesë tha se organizata e vet merr vendime shkëlqyeshëm. Në 2017, McKinsey i kishte ndarë vendimet në katër lloje, secili me mënyrën e vet. Dhe në 2006, Paul Rogers dhe Marcia Blenko propozuan pesë role që e bëjnë të qartë kush ka fjalën e fundit.",
        "In einer McKinsey-Umfrage mit 1.259 Befragten sagte nur jede fünfte Person, ihre Organisation entscheide hervorragend. 2017 hatte McKinsey Entscheidungen in vier Arten eingeteilt, jede mit eigenem Vorgehen. Und 2006 schlugen Paul Rogers und Marcia Blenko fünf Rollen vor, die klären, wer das letzte Wort hat."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("Speed does not spoil", "Shpejtësia nuk e prish", "Tempo verdirbt"), x("quality", "cilësinë", "die Qualität nicht")],
      lead: x(
        "Many organisations behave as if fast decisions were rushed decisions. McKinsey's 2019 survey found the opposite.",
        "Shumë organizata sillen sikur vendimet e shpejta janë vendime të nxituara. Anketa e McKinsey në 2019 gjeti të kundërtën.",
        "Viele Organisationen tun so, als seien schnelle Entscheidungen übereilte Entscheidungen. Die McKinsey-Umfrage von 2019 fand das Gegenteil."),
      blocks: [
        { type: "p", text: x(
          "Only 48% of respondents said their organisation decides quickly, and 37% that its decisions are both fast and good. But those who decided quickly were twice as likely to report high-quality decisions. Speed and quality moved together, not against each other. These are the respondents' own assessments, collected in February 2018.",
          "Vetëm 48% e të anketuarve thanë se organizata e tyre vendos shpejt, dhe 37% se vendimet janë njëherësh të shpejta dhe të mira. Por ata që vendosnin shpejt raportonin dy herë më shpesh vendime me cilësi të lartë. Shpejtësia dhe cilësia lëviznin bashkë, jo kundër njëra-tjetrës. Janë vlerësime të vetë të anketuarve, të mbledhura në shkurt 2018.",
          "Nur 48 % der Befragten sagten, ihre Organisation entscheide schnell, und 37 %, ihre Entscheidungen seien zugleich schnell und gut. Doch wer schnell entschied, berichtete doppelt so häufig von Entscheidungen hoher Qualität. Tempo und Qualität bewegten sich gemeinsam, nicht gegeneinander. Es sind Einschätzungen der Befragten selbst, erhoben im Februar 2018.") },
        { type: "columns", max: 60, height: 120,
          label: x("What respondents said about their organisation", "Çfarë thanë të anketuarit për organizatën e tyre", "Was die Befragten über ihre Organisation sagten"),
          items: [
            { k: x("Excellent at deciding", "E shkëlqyer në vendime", "Hervorragend im Entscheiden"), v: 20, n: pc(20), alert: true },
            { k: x("Decides quickly", "Vendos shpejt", "Entscheidet schnell"), v: 48, n: pc(48) },
            { k: x("Fast and good", "Shpejt dhe mirë", "Schnell und gut"), v: 37, n: pc(37) },
          ] },
        { type: "figures", compact: true, items: [
          { n: x("2×", "2×", "2×"), t: x("as often, fast deciders reported high-quality decisions", "më shpesh raportonin vendime me cilësi të lartë ata që vendosnin shpejt", "so oft berichteten schnell Entscheidende von hochwertigen Entscheidungen") },
          { n: x("1,259", "1.259", "1.259"), t: x("respondents, February 2018", "të anketuar, shkurt 2018", "Befragte, Februar 2018") },
        ] },
        { type: "callout", reading: true, text: x(
          "A decision that waits is not necessarily a careful decision. Often it is a decision without an owner.",
          "Një vendim që pret nuk është domosdoshmërisht vendim i kujdesshëm. Shpesh është vendim pa pronar.",
          "Eine Entscheidung, die wartet, ist nicht unbedingt eine sorgfältige. Oft ist es eine Entscheidung ohne Eigentümer.") },
      ],
      source: ["mckinsey-2019-decisions"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("The time", "Koha që", "Die Zeit,"), x("that goes to waste", "shkon dëm", "die verloren geht")],
      lead: x(
        "Respondents said 37% of their working time goes into decisions. Most said at least half of it is wasted.",
        "Të anketuarit thanë se 37% e kohës së tyre të punës shkon te vendimet. Shumica thanë se të paktën gjysma e saj shkon dëm.",
        "Die Befragten gaben an, 37 % ihrer Arbeitszeit für Entscheidungen aufzuwenden. Die meisten sagten, mindestens die Hälfte davon sei verschwendet."),
      blocks: [
        { type: "donut", v: 37, n: pc(37), source: ["mckinsey-2019-decisions"], t: x(
          "of working time goes into decisions, by respondents' own account (McKinsey, 2019).",
          "e kohës së punës shkon te vendimet, sipas vetë të anketuarve (McKinsey, 2019).",
          "der Arbeitszeit fließt in Entscheidungen, nach Angabe der Befragten selbst (McKinsey, 2019).") },
        { type: "figures", compact: true, items: [
          { n: pc(61), t: x("say at least half of their decision time is wasted", "thonë se të paktën gjysma e kohës së vendimeve shkon dëm", "sagen, mindestens die Hälfte ihrer Entscheidungszeit sei verschwendet") },
          { n: x("530,000", "530.000", "530.000"), t: x("manager days a year at a typical Fortune 500 company, in a McKinsey calculation", "ditë menaxherësh në vit për një kompani tipike nga Fortune 500, sipas një llogarie të McKinsey", "Managertage pro Jahr in einem typischen Fortune-500-Unternehmen, nach einer McKinsey-Rechnung") },
          { n: x("$250m", "250 mln $", "250 Mio. $"), t: x("in wages for those days", "paga për ato ditë", "Gehälter für diese Tage") },
        ] },
        { type: "p", text: x(
          "The calculation is a thought experiment, not a measurement: it starts from a company of about 56,000 employees, 20% of them managers, and the median pay of a US manager in 2017.",
          "Llogaria është eksperiment mendimi, jo matje: niset nga një kompani me rreth 56.000 punonjës, 20% prej tyre menaxherë, dhe nga paga mediane e një menaxheri amerikan në 2017.",
          "Die Rechnung ist ein Gedankenexperiment, keine Messung: Sie geht von einem Unternehmen mit rund 56.000 Beschäftigten aus, davon 20 % Führungskräfte, und vom Medianlohn einer US-Führungskraft im Jahr 2017.") },
        { type: "callout", reading: true, text: x(
          "The lost time does not go into the decision itself. It goes into meetings where nobody knows whether they are deciding or advising.",
          "Koha e humbur nuk shkon te vendimi vetë. Shkon te takimet ku askush nuk e di nëse po vendos apo po këshillon.",
          "Die verlorene Zeit steckt nicht in der Entscheidung selbst, sondern in Meetings, in denen niemand weiß, ob er entscheidet oder berät.") },
      ],
      source: ["mckinsey-2019-decisions", "mckinsey-2019-three-keys"],
    },
    {
      id: "model", more: "solve-it-or-escalate-it",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Four kinds", "Katër lloje", "Vier Arten"), x("of decisions", "vendimesh", "von Entscheidungen")],
      lead: x(
        "Aaron De Smet, Gerald Lackey and Leigh Weiss (McKinsey, 2017) sorted decisions by how often they come and how much risk they carry. Each kind needs a different way of deciding.",
        "Aaron De Smet, Gerald Lackey dhe Leigh Weiss (McKinsey, 2017) i ndanë vendimet sipas sa shpesh vijnë dhe sa rrezik mbartin. Secili lloj do një mënyrë tjetër vendosjeje.",
        "Aaron De Smet, Gerald Lackey und Leigh Weiss (McKinsey, 2017) ordneten Entscheidungen danach, wie oft sie anfallen und wie viel Risiko sie tragen. Jede Art braucht ein anderes Vorgehen."),
      blocks: [
        { type: "matrix", y: x("Risk", "Rreziku", "Risiko"), x: x("How often they come", "Sa shpesh vijnë", "Wie oft sie anfallen"), cells: [
          { h: x("Big bets", "Baste të mëdha", "Große Wetten"), tone: "red", p: x("Few, but they shape the future. Leaders decide, after an open debate.", "Pak, por përcaktojnë të ardhmen. Vendosin drejtuesit, pas një debati të hapur.", "Wenige, aber sie prägen die Zukunft. Die Spitze entscheidet nach offener Debatte."), where: x("High risk · rare", "Rrezik i lartë · rrallë", "Hohes Risiko · selten") },
          { h: x("Cross-cutting", "Ndërfunksionale", "Bereichsübergreifend"), tone: "blue", p: x("Pricing, new products. Several functions decide together, with a clear process.", "Çmimet, produktet e reja. Vendosin bashkë disa funksione, me një proces të qartë.", "Preise, neue Produkte. Mehrere Funktionen entscheiden gemeinsam, mit klarem Ablauf."), where: x("High risk · frequent", "Rrezik i lartë · shpesh", "Hohes Risiko · häufig") },
          { h: x("Ad hoc", "Ad hoc", "Ad hoc"), p: x("Rare and low-risk. The authors set them aside on purpose.", "Të rralla dhe me rrezik të ulët. Autorët i lënë qëllimisht mënjanë.", "Selten und risikoarm. Die Autoren lassen sie bewusst beiseite."), where: x("Low risk · rare", "Rrezik i ulët · rrallë", "Geringes Risiko · selten") },
          { h: x("Delegated", "Të deleguara", "Delegiert"), p: x("Everyday decisions. One person or a small team takes them, without much consultation.", "Vendimet e përditshme. I merr një person ose një ekip i vogël, pa shumë konsultime.", "Alltagsentscheidungen. Eine Person oder ein kleines Team trifft sie ohne viel Abstimmung."), where: x("Low risk · frequent", "Rrezik i ulët · shpesh", "Geringes Risiko · häufig") },
        ] },
        { type: "callout", reading: true, text: x(
          "Many small decisions get stuck because they are treated as big ones: everyone is asked, but nobody decides.",
          "Shumë vendime të vogla ngecin sepse trajtohen si të mëdha: pyeten të gjithë, por nuk vendos askush.",
          "Viele kleine Entscheidungen bleiben hängen, weil man sie wie große behandelt: Alle werden gefragt, aber niemand entscheidet.") },
      ],
      note: x(
        "The descriptions in the cells are our summary of the 2017 article.",
        "Përshkrimet e qelizave janë përmbledhja jonë e artikullit të 2017.",
        "Die Beschreibungen in den Feldern sind unsere Zusammenfassung des Artikels von 2017."),
      source: ["desmet-2017"],
    },
    {
      id: "roles",
      kicker: x("The roles", "Rolet", "Die Rollen"),
      title: [x("Who has", "Kush e ka", "Wer hat"), x("the \"D\"?", "\"D\"-në?", "das „D“?")],
      lead: x(
        "Paul Rogers and Marcia Blenko (Bain, 2006) proposed five roles for every important decision. The name comes from their initials: RAPID.",
        "Paul Rogers dhe Marcia Blenko (Bain, 2006) propozuan pesë role për çdo vendim të rëndësishëm. Emri vjen nga inicialet në anglisht: RAPID.",
        "Paul Rogers und Marcia Blenko (Bain, 2006) schlugen für jede wichtige Entscheidung fünf Rollen vor. Der Name kommt von den englischen Anfangsbuchstaben: RAPID."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("Recommend (R)", "Rekomandon (R)", "Empfehlen (R)"), p: x("Gathers the facts and makes the proposal. Usually one person.", "Mbledh faktet dhe bën propozimin. Zakonisht një person.", "Sammelt die Fakten und macht den Vorschlag. Meist eine Person.") },
          { h: x("Agree (A)", "Bie dakord (A)", "Zustimmen (A)"), p: x("Must sign off and can stop the proposal. Used sparingly.", "Duhet të japë miratim dhe mund ta ndalë propozimin. Përdoret me kursim.", "Muss zustimmen und kann den Vorschlag stoppen. Sparsam eingesetzt.") },
          { h: x("Perform (P)", "Zbaton (P)", "Umsetzen (P)"), p: x("Puts the decision into practice. Named from the start.", "E vë vendimin në jetë. Emërtohet që në fillim.", "Setzt die Entscheidung um. Wird von Anfang an benannt.") },
          { h: x("Input (I)", "Jep të dhëna (I)", "Beitragen (I)"), p: x("Is consulted on facts and risks, but does not decide.", "Konsultohet për fakte dhe rreziqe, por nuk vendos.", "Wird zu Fakten und Risiken befragt, entscheidet aber nicht.") },
          { h: x("Decide (D)", "Vendos (D)", "Entscheiden (D)"), p: x("One person has the final word and closes the matter.", "Një person ka fjalën e fundit dhe e mbyll çështjen.", "Eine Person hat das letzte Wort und schließt die Sache ab.") },
        ] },
        { type: "example", label: x("Hypothetical example, overtime in a warehouse", "Shembull hipotetik, puna jashtë orarit në magazinë", "Hypothetisches Beispiel, Überstunden im Lager"), text: x(
          "The shift lead recommends, with the order numbers. HR agrees on the working-time rules. The team gives input on who is available. The operations manager decides. The shift lead and the team perform.",
          "Shefi i turnit rekomandon, me numrat e porosive. Burimet njerëzore bien dakord për rregullat e orarit. Ekipi jep të dhëna për kush është i lirë. Menaxheri i operacionit vendos. Shefi i turnit dhe ekipi e zbatojnë.",
          "Die Schichtleitung empfiehlt, mit den Auftragszahlen. Die Personalabteilung stimmt den Arbeitszeitregeln zu. Das Team trägt bei, wer verfügbar ist. Die Betriebsleitung entscheidet. Schichtleitung und Team setzen um.") },
        { type: "p", text: x(
          "According to the authors, decisions get stuck most often at four borders: between headquarters and units, between global and local, between functions, and between the company and outside partners. The roles are not played in the order of the letters.",
          "Sipas autorëve, vendimet ngecin më shpesh në katër kufij: mes qendrës dhe njësive, mes globales dhe lokales, mes funksioneve, dhe mes kompanisë dhe partnerëve të jashtëm. Rolet nuk luhen në rendin e shkronjave.",
          "Nach den Autoren bleiben Entscheidungen am häufigsten an vier Grenzen hängen: zwischen Zentrale und Einheiten, zwischen global und lokal, zwischen Funktionen und zwischen dem Unternehmen und externen Partnern. Die Rollen werden nicht in der Reihenfolge der Buchstaben gespielt.") },
        { type: "callout", reading: true, text: x(
          "A meeting without a \"D\" ends with \"we will see\".",
          "Një takim pa \"D\" mbyllet me \"do ta shohim\".",
          "Ein Meeting ohne „D“ endet mit „Wir schauen mal“.") },
      ],
      source: ["rogers-blenko-2006"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie man es misst"),
      title: [x("The decision", "Harta e", "Die Landkarte"), x("map", "vendimeve", "der Entscheidungen")],
      lead: x(
        "Pick the ten decisions your team takes most often and ask for each: who decides? Then ask the team.",
        "Zgjidh dhjetë vendimet që ekipi yt merr më shpesh dhe pyet për secilin: kush vendos? Pastaj pyet ekipin.",
        "Die zehn Entscheidungen auswählen, die Ihr Team am häufigsten trifft, und bei jeder fragen: Wer entscheidet? Dann das Team fragen."),
      blocks: [
        { type: "steps", items: [
          { h: x("List ten decisions", "Listo dhjetë vendime", "Zehn Entscheidungen auflisten"), p: x("The recurring ones: who works overtime, when an order goes back, who swaps a shift.", "Ato që përsëriten: kush punon jashtë orarit, kur kthehet një porosi, kush ndërron turnin.", "Die wiederkehrenden: wer Überstunden macht, wann ein Auftrag zurückgeht, wer eine Schicht tauscht.") },
          { h: x("Write who decides", "Shkruaj kush vendos", "Notieren, wer entscheidet"), p: x("In your view, for each one.", "Sipas teje, për secilin.", "Nach eigener Sicht, für jede.") },
          { h: x("Ask the team separately", "Pyet ekipin veçmas", "Das Team getrennt fragen"), p: x("Without showing them your answers.", "Pa ua treguar përgjigjet e tua.", "Ohne die eigenen Antworten zu zeigen.") },
          { h: x("Compare", "Krahaso", "Vergleichen"), p: x("Where the answers differ, the work gets stuck. Start with that decision.", "Aty ku përgjigjet ndryshojnë, aty ngec puna. Fillo nga ai vendim.", "Wo die Antworten auseinandergehen, bleibt die Arbeit hängen. Mit dieser Entscheidung beginnen.") },
        ] },
        { type: "example", label: x("Hypothetical example, ten decisions in a shift", "Shembull hipotetik, dhjetë vendime në një turn", "Hypothetisches Beispiel, zehn Entscheidungen in einer Schicht"), text: x(
          "The lead and the team agree on six. On the other four, two people think they decide themselves, and nobody knows who decides on shift swaps. The numbers are invented.",
          "Shefi dhe ekipi përputhen në gjashtë. Në katër të tjerat, dy veta mendojnë se vendosin vetë, dhe për ndërrimin e turneve askush nuk e di kush vendos. Numrat janë të shpikur.",
          "Leitung und Team stimmen bei sechs überein. Bei den anderen vier glauben zwei Personen, selbst zu entscheiden, und beim Schichttausch weiß niemand, wer entscheidet. Die Zahlen sind erfunden.") },
        { type: "callout", reading: true, text: x(
          "The question \"who decides?\" looks bureaucratic only until an order waits two days for an answer.",
          "Pyetja \"kush vendos?\" duket burokratike vetëm derisa një porosi pret dy ditë për një përgjigje.",
          "Die Frage „Wer entscheidet?“ wirkt nur so lange bürokratisch, bis ein Auftrag zwei Tage auf eine Antwort wartet.") },
      ],
      note: x("The steps and the example are the editors'.", "Hapat dhe shembulli janë të redaksisë.", "Schritte und Beispiel stammen von der Redaktion."),
    },
    {
      id: "tool", tool: "/tools/shift-handover/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The", "Karta e", "Die"), x("decision card", "një vendimi", "Entscheidungskarte")],
      lead: x(
        "For every decision that has been stuck for more than a week. Fill it in before the meeting, not after.",
        "Për çdo vendim që ka ngecur më shumë se një javë. Plotësoje para takimit, jo pas tij.",
        "Für jede Entscheidung, die länger als eine Woche hängt. Vor dem Meeting ausfüllen, nicht danach."),
      blocks: [
        { type: "form", items: [
          { h: x("The decision", "Vendimi", "Die Entscheidung"), hint: x("what, and by when", "çfarë, dhe deri kur", "was, und bis wann"), lines: 2 },
          { h: x("Recommends", "Rekomandon", "Empfiehlt"), hint: x("who prepares the proposal", "kush e përgatit propozimin", "wer den Vorschlag vorbereitet") },
          { h: x("Agrees", "Bie dakord", "Stimmt zu"), hint: x("who must sign off, if anyone", "kush duhet të japë miratim, nëse dikush", "wer zustimmen muss, falls jemand") },
          { h: x("Gives input", "Jep të dhëna", "Trägt bei"), hint: x("whom we ask, about what", "kë pyesim, për çfarë", "wen wir fragen, wozu") },
          { h: x("Decides", "Vendos", "Entscheidet"), hint: x("one role", "një rol", "eine Rolle") },
          { h: x("Performs and informs", "Zbaton dhe njofton", "Setzt um und informiert"), hint: x("who carries it out, who needs to know", "kush e vë në jetë, kush duhet ta dijë", "wer umsetzt, wer es wissen muss"), lines: 2 },
        ] },
      ],
      note: x(
        "A practice proposed by the editors, after the RAPID roles. Do not write names or confidential data on the card.",
        "Praktikë e propozuar nga redaksia, mbi rolet RAPID. Mos shkruaj emra ose të dhëna konfidenciale në kartë.",
        "Eine Praxis, die die Redaktion nach den RAPID-Rollen vorschlägt. Keine Namen oder vertraulichen Daten auf die Karte schreiben."),
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
