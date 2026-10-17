// Management Review, No. 3: Why strategy gets lost in the middle. Block: Strategy.
// Facts and their sources: docs/revista/management-review-nr-03.md.
import { x, pc } from "../common.js";

export default {
  number: 3,
  block: "strategy",
  date: x("October 2026", "Tetor 2026", "Oktober 2026"),
  theme: [x("Why strategy", "Pse strategjia", "Warum Strategie"), x("gets lost in the middle", "humbet në mes", "in der Mitte verloren geht")],
  sub: x(
    "What happens between the plan and the work: managers who cannot name the priorities, units that cannot rely on each other, and five myths about execution.",
    "Çfarë ndodh mes planit dhe punës: menaxherë që nuk i dinë prioritetet, njësi që nuk mund të mbështeten në njëra-tjetrën, dhe pesë mite për ekzekutimin.",
    "Was zwischen Plan und Arbeit passiert: Führungskräfte, die die Prioritäten nicht kennen, Einheiten, die sich nicht aufeinander verlassen können, und fünf Mythen der Umsetzung."),
  seo: x(
    "Why strategy gets lost in the middle: what Sull, Homkes and Yoder found in thousands of managers, five myths of execution and a card for priorities.",
    "Pse strategjia humbet në mes: çfarë gjetën Sull, Homkes dhe Yoder te mijëra menaxherë, pesë mitet e ekzekutimit dhe një kartë për prioritetet.",
    "Warum Strategie in der Mitte verloren geht: was Sull, Homkes und Yoder bei Tausenden Führungskräften fanden, fünf Mythen und eine Karte für Prioritäten."),
  feature: x(
    "Issue 3 follows a strategy from the top down to the work. In one company 97% of leaders said they understood it, yet most of them could not name its priorities. Whether it happens is decided further down, in the coordination between units.",
    "Numri 3 e ndjek strategjinë nga maja deri te puna. Në një kompani, 97% e drejtuesve thanë se e kuptonin, por shumica e tyre nuk ia rendisnin dot prioritetet. Nëse ajo zbatohet apo jo, vendoset më poshtë, te koordinimi mes njësive.",
    "Ausgabe 3 verfolgt eine Strategie von der Spitze bis zur Arbeit. In einem Unternehmen sagten 97 % der Führung, sie verstünden sie, doch die meisten konnten ihre Prioritäten nicht nennen. Ob sie umgesetzt wird, entscheidet sich weiter unten, in der Abstimmung zwischen den Einheiten."),
  figure: { n: pc(28), by: "MIT SMR, 2018", t: x(
    "of the executives and middle managers responsible for executing strategy could list three of their company's strategic priorities.",
    "e drejtuesve dhe menaxherëve të mesëm që e zbatojnë strategjinë rendisnin tre nga prioritetet strategjike të kompanisë.",
    "der Führungskräfte und mittleren Manager, die die Strategie umsetzen, konnten drei der strategischen Prioritäten ihres Unternehmens nennen.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("97% said they understood the strategy", "97% thanë se e kuptonin strategjinë", "97 % sagten, sie verstünden die Strategie") },
    { page: "numbers", kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: x("Managers rely on their boss, not on the other units", "Menaxherët mbështeten në shefin, jo në njësitë e tjera", "Führungskräfte verlassen sich auf den Chef, nicht auf andere Einheiten") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The priority card", "Karta e prioriteteve", "Die Prioritätenkarte") },
  ],
  sources: ["sull-yoder-2018", "sull-homkes-2015", "lbs-2015", "leinwand-2015"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "A strategy can be clear at the top and still never reach the work. Where it gets lost is the subject here: the middle, between the people who decide it and the people who carry it out.",
        "Një strategji mund të jetë e qartë në majë dhe prapëseprapë të mos arrijë kurrë te puna. Këtu shohim ku humbet: në mes, midis atyre që e vendosin dhe atyre që e zbatojnë.",
        "Eine Strategie kann oben klar sein und trotzdem nie bei der Arbeit ankommen. Hier geht es darum, wo sie verloren geht: in der Mitte, zwischen denen, die sie beschließen, und denen, die sie umsetzen."),
      body: x(
        "In studies published since 2015, Donald Sull and colleagues have surveyed thousands of managers. Their findings point the same way. Many managers cannot name the priorities of their own company. Most can rely on their boss and their team, but far fewer on the other units they depend on. And the researchers warn that alignment from the top is not the same as coordination across the organisation.",
        "Në studime të botuara që nga viti 2015, Donald Sull dhe kolegët kanë anketuar mijëra menaxherë. Gjetjet e tyre shkojnë në të njëjtin drejtim. Shumë menaxherë nuk i dinë prioritetet e kompanisë së tyre. Shumica mund të mbështeten në shefin dhe në ekipin e tyre, por shumë më pak në njësitë e tjera nga të cilat varen. Dhe studiuesit paralajmërojnë se harmonizimi nga lart nuk është e njëjta gjë me koordinimin në gjithë organizatën.",
        "In Studien, die seit 2015 erschienen sind, haben Donald Sull und sein Team Tausende Führungskräfte befragt. Ihre Ergebnisse weisen in dieselbe Richtung. Viele Führungskräfte kennen die Prioritäten ihres eigenen Unternehmens nicht. Die meisten können sich auf Chef und Team verlassen, aber weit weniger auf die anderen Einheiten, von denen sie abhängen. Und die Forschenden warnen, dass Ausrichtung von oben nicht dasselbe ist wie Abstimmung in der ganzen Organisation."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("Everyone says", "Të gjithë thonë", "Alle sagen,"), x("they understand", "se e kuptojnë", "sie verstehen es")],
      lead: x(
        "In a large technology company, which the researchers call Generex, almost all senior leaders said they understood the priorities. Then the same leaders were asked to name them.",
        "Në një kompani të madhe teknologjie, që studiuesit e quajnë Generex, pothuajse të gjithë drejtuesit e lartë thanë se i kuptonin prioritetet. Pastaj të njëjtëve iu kërkua t'i rendisnin.",
        "In einem großen Technologieunternehmen, das die Forschenden Generex nennen, sagten fast alle oberen Führungskräfte, sie verstünden die Prioritäten. Dann wurden dieselben gebeten, sie zu nennen."),
      blocks: [
        { type: "columns", max: 100, height: 132,
          label: x("Generex: saying and knowing", "Generex: të thuash dhe të dish", "Generex: sagen und wissen"),
          items: [
            { k: x("Say they understand", "Thonë se kuptojnë", "Sagen, sie verstehen"), v: 97, n: pc(97) },
            { k: x("Name 3 of 5", "Rendisin 3 nga 5", "Nennen 3 von 5"), v: 25, n: x("1 in 4", "1 në 4", "1 von 4"), alert: true },
            { k: x("Name none", "Nuk rendisin asnjë", "Nennen keine"), v: 33, n: x("1 in 3", "1 në 3", "1 von 3"), alert: true },
          ] },
        { type: "p", text: x(
          "All three bars count the same leaders: what they said, then what they could list. The same researchers then looked at 124 organisations: only 28% of the executives and middle managers responsible for execution could list three of their company's strategic priorities.",
          "Të tria shtyllat numërojnë të njëjtët drejtues: çfarë thanë, pastaj çfarë rendisnin dot. Të njëjtët studiues shqyrtuan pastaj 124 organizata: vetëm 28% e drejtuesve dhe menaxherëve të mesëm përgjegjës për zbatimin rendisnin tre nga prioritetet strategjike të kompanisë.",
          "Alle drei Säulen zählen dieselben Führungskräfte: was sie sagten, dann was sie nennen konnten. Dieselben Forschenden untersuchten dann 124 Organisationen: Nur 28 % der für die Umsetzung verantwortlichen Führungskräfte und mittleren Manager konnten drei strategische Prioritäten ihres Unternehmens nennen.") },
        { type: "callout", reading: true, text: x(
          "Most strategies get lost on the way, before anyone has had the chance to reject them: they never reach, clearly, the people who make the daily decisions.",
          "Shumica e strategjive humbasin rrugës, para se dikush të ketë rastin t'i refuzojë: nuk u mbërrijnë të qarta atyre që marrin vendimet e përditshme.",
          "Die meisten Strategien gehen unterwegs verloren, bevor jemand sie überhaupt ablehnen könnte: Sie kommen nicht klar bei den Menschen an, welche die täglichen Entscheidungen treffen.") },
      ],
      source: ["sull-yoder-2018"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("Up and down it works,", "Lart e poshtë funksionon,", "Nach oben und unten geht es,"), x("sideways it does not", "anash jo", "zur Seite nicht")],
      lead: x(
        "In the survey of nearly 8,000 managers in more than 250 companies, the chain of command held. The links between units did not.",
        "Në anketën me rreth 8.000 menaxherë në më shumë se 250 kompani, zinxhiri i komandës mbante. Lidhjet mes njësive jo.",
        "In der Umfrage unter fast 8.000 Führungskräften in mehr als 250 Unternehmen hielt die Befehlskette. Die Verbindungen zwischen den Einheiten hielten nicht."),
      blocks: [
        { type: "hbars", max: 100, source: ["sull-homkes-2015"],
          label: x("Managers who can rely on…", "Menaxherët që mund të mbështeten në…", "Führungskräfte, die sich verlassen können auf…"),
          items: [
            { k: x("their boss and direct reports, always or mostly", "shefi dhe vartësit, gjithmonë ose shumicën e kohës", "Chef und direkt Unterstellte, immer oder meistens"), v: 84, n: pc(84) },
            { k: x("colleagues in other units, most of the time", "kolegët e njësive të tjera, shumicën e kohës", "Kollegen anderer Einheiten, meistens"), v: 50, n: x("about 50%", "rreth 50%", "etwa 50 %") },
            { k: x("colleagues in other units, always", "kolegët e njësive të tjera, gjithmonë", "Kollegen anderer Einheiten, immer"), v: 9, n: pc(9), alert: true },
          ] },
        { type: "figures", compact: true, items: [
          { n: x("1 in 3", "1 në 3", "1 von 3"), t: x("of about 11,000 managers in 400+ organisations named the top three priorities correctly (LBS, 2015)", "nga rreth 11.000 menaxherë në 400+ organizata rendisnin saktë tre prioritetet kryesore (LBS, 2015)", "von rund 11.000 Führungskräften in über 400 Organisationen nannten die drei Top-Prioritäten richtig (LBS, 2015)") },
          { n: pc(8), t: x("of leaders were rated very effective at both strategy and execution (about 700 executives, 2013)", "e drejtuesve u vlerësuan shumë efektivë si në strategji, ashtu edhe në ekzekutim (rreth 700 drejtues, 2013)", "der Führungspersonen wurden in Strategie und Umsetzung als sehr wirksam bewertet (etwa 700 Führungskräfte, 2013)") },
          { n: x("124", "124", "124"), t: x("organisations in the 2018 study of priorities", "organizata në studimin e vitit 2018 për prioritetet", "Organisationen in der Studie von 2018 über Prioritäten") },
        ] },
        { type: "callout", reading: true, text: x(
          "Most work that matters crosses a unit boundary: the warehouse and transport, reception and housekeeping. Where reliance stops at the boundary, the strategy stops there too.",
          "Shumica e punës që ka rëndësi e kapërcen kufirin e një njësie: magazina dhe transporti, recepsioni dhe pastrimi i dhomave. Aty ku besimi ndalet te kufiri, ndalet edhe strategjia.",
          "Die meiste Arbeit, auf die es ankommt, überschreitet die Grenze einer Einheit: Lager und Transport, Rezeption und Housekeeping. Wo das Vertrauen an dieser Grenze endet, endet auch die Strategie.") },
      ],
      source: ["sull-homkes-2015", "lbs-2015", "leinwand-2015", "sull-yoder-2018"],
    },
    {
      id: "model", more: "mistakes-get-lost-between-departments",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Five myths", "Pesë mite", "Fünf Mythen"), x("about execution", "për ekzekutimin", "über die Umsetzung")],
      lead: x(
        "Sull, Homkes and Sull named five beliefs that make execution look simpler than it is. The column on the right is our summary of what they propose instead.",
        "Sull, Homkes dhe Sull emërtuan pesë bindje që e bëjnë ekzekutimin të duket më i thjeshtë se ç'është. Kolona djathtas përmbledh me fjalët tona atë që propozojnë ata në vend të tyre.",
        "Sull, Homkes und Sull benannten fünf Annahmen, die Umsetzung einfacher wirken lassen, als sie ist. Die rechte Spalte ist unsere Zusammenfassung dessen, was sie stattdessen vorschlagen."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("Execution is alignment", "Ekzekutimi është harmonizim", "Umsetzung ist Ausrichtung"), p: x("The harder part is coordination across units; alignment from top to bottom is the easier half.", "Pjesa më e vështirë është koordinimi mes njësive; harmonizimi nga lart poshtë është gjysma më e lehtë.", "Schwieriger ist die Abstimmung zwischen Einheiten; die Ausrichtung von oben nach unten ist der leichtere Teil.") },
          { h: x("Execution is sticking to the plan", "Ekzekutimi është t'i përmbahesh planit", "Umsetzung heißt, am Plan festzuhalten"), p: x("The plan has to adapt when reality changes, without losing its direction.", "Plani duhet të përshtatet kur ndryshon realiteti, pa e humbur drejtimin.", "Der Plan muss sich anpassen, wenn sich die Lage ändert, ohne die Richtung zu verlieren.") },
          { h: x("Communication is understanding", "Komunikimi është kuptim", "Kommunikation ist Verständnis"), p: x("A message that was sent is not yet a message that was understood.", "Mesazhi i dërguar nuk është ende mesazh i kuptuar.", "Eine gesendete Botschaft ist noch keine verstandene.") },
          { h: x("A performance culture drives execution", "Kultura e rezultatit e shtyn ekzekutimin", "Leistungskultur treibt die Umsetzung"), p: x("It also needs to reward agility, teamwork and ambition.", "Duhet të shpërblejë edhe shkathtësinë, punën në ekip dhe ambicien.", "Sie muss auch Beweglichkeit, Teamarbeit und Ehrgeiz belohnen.") },
          { h: x("Execution is driven from the top", "Ekzekutimi drejtohet nga lart", "Umsetzung wird von oben gesteuert"), p: x("It depends on distributed leaders: middle managers and experts close to the work.", "Varet nga drejtues të shpërndarë: menaxherët e mesëm dhe ekspertët afër punës.", "Sie hängt von verteilter Führung ab: mittleren Führungskräften und Fachleuten nah an der Arbeit.") },
        ] },
        { type: "example", label: x("Hypothetical example, a hotel", "Shembull hipotetik, një hotel", "Hypothetisches Beispiel, ein Hotel"), text: x(
          "Reception and housekeeping both have clear goals that fit the plan. When a group arrives early, nobody has agreed which rooms are made ready first. The alignment is there; the coordination is missing.",
          "Recepsioni dhe pastrimi i dhomave kanë të dy objektiva të qarta, në përputhje me planin. Kur një grup mbërrin herët, askush nuk ka rënë dakord se cilat dhoma përgatiten të parat. Harmonizimi është aty, koordinimi mungon.",
          "Rezeption und Housekeeping haben beide klare Ziele, die zum Plan passen. Trifft eine Gruppe früh ein, hat niemand vereinbart, welche Zimmer zuerst fertig sein müssen. Die Ausrichtung ist da, die Abstimmung fehlt.") },
        { type: "callout", reading: true, text: x(
          "Each myth places the problem at the top or in the plan. The research finds it where the units meet.",
          "Çdo mit e kërkon problemin në majë ose te plani. Kërkimi e gjen aty ku takohen njësitë.",
          "Jeder Mythos sucht das Problem oben oder im Plan. Die Forschung findet es dort, wo die Einheiten aufeinandertreffen.") },
      ],
      source: ["sull-homkes-2015"],
    },
    {
      id: "role",
      kicker: x("Developing the role", "Zhvillimi i rolit", "Die Rolle entwickeln"),
      title: [x("The middle manager", "Menaxheri i mesëm", "Die mittlere Führungskraft"), x("as the joint", "si nyje", "als Gelenk")],
      lead: x(
        "If execution depends on distributed leaders, the middle manager does far more than carry messages between the top and the floor. In that role the strategy turns into decisions.",
        "Nëse ekzekutimi varet nga drejtues të shpërndarë, menaxheri i mesëm bën shumë më tepër sesa të çojë mesazhe mes majës dhe terrenit. Te ky rol strategjia kthehet në vendime.",
        "Wenn die Umsetzung von verteilter Führung abhängt, tut die mittlere Führungskraft weit mehr, als Botschaften zwischen der Spitze und den Teams vor Ort zu überbringen. In dieser Rolle wird Strategie zu Entscheidungen."),
      blocks: [
        { type: "steps", items: [
          { h: x("Translate", "Përkthe", "Übersetzen"), p: x("Turn each priority into what it means for your team this month, in their words.", "Ktheje çdo prioritet në atë që do të thotë për ekipin këtë muaj, me fjalët e tyre.", "Übersetzen Sie jede Priorität in das, was sie diesen Monat für Ihr Team bedeutet, und zwar in seinen eigenen Worten.") },
          { h: x("Choose what not to do", "Zgjidh çfarë nuk do të bësh", "Entscheiden, was wegfällt"), p: x("A priority without something set aside is only one more task.", "Një prioritet pa diçka që lihet mënjanë është vetëm një detyrë më shumë.", "Eine Priorität, für die nichts zurückgestellt wird, ist nur eine weitere Aufgabe.") },
          { h: x("Agree with the other units", "Merru vesh me njësitë e tjera", "Mit den anderen Einheiten abstimmen"), p: x("Name the unit you depend on most and agree what each side delivers, and by when.", "Emërto njësinë nga e cila varesh më shumë dhe bjer dakord me të se çfarë jep secila palë dhe deri kur.", "Nennen Sie die Einheit, von der Sie am meisten abhängen, und vereinbaren Sie, was jede Seite bis wann liefert.") },
          { h: x("Check understanding", "Kontrollo kuptimin", "Verständnis prüfen"), p: x("Ask the team to say the priorities back, instead of asking whether they are clear.", "Kërkoji ekipit t'i thotë prioritetet me fjalët e veta, në vend që të pyesësh nëse janë të qarta.", "Lassen Sie das Team die Prioritäten in eigenen Worten wiedergeben, statt zu fragen, ob sie klar sind.") },
        ] },
        { type: "example", label: x("Hypothetical example, a store", "Shembull hipotetik, një dyqan", "Hypothetisches Beispiel, eine Filiale"), text: x(
          "The company wants more returning customers. For the store this month, that means no advertised item is missing from the shelf. The new window display waits. The central warehouse warns a day ahead about shortages, and on Friday each salesperson says the priority in their own words.",
          "Kompania do më shumë klientë që rikthehen. Për dyqanin, këtë muaj kjo do të thotë që asnjë artikull i reklamuar të mos mungojë në raft. Vitrina e re pret. Magazina qendrore i njofton mungesat një ditë përpara, dhe të premten çdo shitës e thotë prioritetin me fjalët e veta.",
          "Das Unternehmen will mehr wiederkehrende Kunden. Für die Filiale heißt das diesen Monat: Kein beworbener Artikel fehlt im Regal. Das neue Schaufenster wartet. Das Zentrallager meldet Engpässe einen Tag vorher, und am Freitag sagt jede Verkaufskraft die Priorität in eigenen Worten.") },
        { type: "callout", reading: true, text: x(
          "“Is that clear?” almost always gets a yes. “Tell me what we are doing first this week” shows whether it is.",
          "“A është e qartë?” merr pothuajse gjithmonë një po. “Më thuaj çfarë bëjmë të parën këtë javë” tregon nëse është.",
          "„Ist das klar?“ bekommt fast immer ein Ja. „Sag mir, was wir diese Woche zuerst tun“ zeigt, ob es so ist.") },
      ],
      note: x("The four steps are a practice proposed by the editors.", "Katër hapat janë praktikë e propozuar nga redaksia.", "Die vier Schritte sind eine Praxis, die die Redaktion vorschlägt."),
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie es gemessen wird"),
      title: [x("Has the strategy", "A ka mbërritur", "Ist die Strategie"), x("arrived?", "strategjia?", "angekommen?")],
      lead: x(
        "Rather than asking managers whether the strategy was clear, the researchers had them write the priorities down. You can do the same in your team.",
        "Në vend që t'i pyesnin menaxherët nëse strategjia ishte e qartë, studiuesit u kërkuan t'i shkruanin prioritetet. Të njëjtën gjë mund ta bësh në ekipin tënd.",
        "Statt zu fragen, ob die Strategie klar sei, ließen die Forschenden die Führungskräfte die Prioritäten aufschreiben. Dasselbe können Sie in Ihrem Team tun."),
      blocks: [
        { type: "steps", items: [
          { h: x("Ask in writing", "Pyet me shkrim", "Schriftlich fragen"), p: x("Each person writes down, without notes, the three priorities of the team or the company.", "Secili shkruan, pa shënime, tre prioritetet e ekipit ose të kompanisë.", "Jede Person schreibt ohne Unterlagen die drei Prioritäten des Teams oder des Unternehmens auf.") },
          { h: x("Count the matches", "Numëro përputhjet", "Treffer zählen"), p: x("How many people name the same three? How many name at least one?", "Sa veta rendisin të njëjtat tre? Sa rendisin të paktën një?", "Wie viele nennen dieselben drei? Wie viele mindestens eine?") },
          { h: x("Ask about the other units", "Pyet për njësitë e tjera", "Nach den anderen Einheiten fragen"), p: x("For each unit you depend on: can we rely on them always, most of the time, sometimes, rarely?", "Për çdo njësi nga e cila varemi: mund të mbështetemi gjithmonë, shumicën e kohës, ndonjëherë, rrallë?", "Für jede Einheit, von der Sie abhängen: Können wir uns immer, meistens, manchmal, selten auf sie verlassen?") },
          { h: x("Repeat after a quarter", "Përsërite pas tre muajsh", "Nach einem Quartal wiederholen"), p: x("The figure to watch is the share of people who name the same three.", "Numri që ndjek është pjesa e atyre që rendisin të njëjtat tre.", "Die Zahl, auf die es ankommt, ist der Anteil, der dieselben drei nennt.") },
        ] },
        { type: "example", label: x("Hypothetical example, eight managers", "Shembull hipotetik, tetë menaxherë", "Hypothetisches Beispiel, acht Führungskräfte"), text: x(
          "Three name the company's three priorities, four name only one of them, one names none. Three out of eight is fewer than half, so the next meeting opens with the three priorities written on the board. (Invented numbers.)",
          "Tre rendisin tre prioritetet e kompanisë, katër vetëm një prej tyre, një asnjë. Tre nga tetë është më pak se gjysma, prandaj mbledhja e ardhshme hapet me tre prioritetet të shkruara në tabelë. (Numra të shpikur.)",
          "Drei nennen die drei Prioritäten des Unternehmens, vier nur eine davon, eine Person keine. Drei von acht sind weniger als die Hälfte, also beginnt die nächste Besprechung mit den drei Prioritäten an der Tafel. (Erfundene Zahlen.)") },
        { type: "callout", reading: true, text: x(
          "If fewer than half name the same three priorities, leave new goals for later. The next meeting belongs to the ones you already have.",
          "Nëse më pak se gjysma rendisin të njëjtat tre prioritete, objektivat e rinj le të presin. Mbledhja e ardhshme u takon atyre që ke tashmë.",
          "Nennen weniger als die Hälfte dieselben drei Prioritäten, warten neue Ziele. Die nächste Besprechung gehört denen, die Sie schon haben.") },
      ],
      note: x("A practice proposed by the editors, after the method of the 2018 study.", "Praktikë e propozuar nga redaksia, sipas metodës së studimit të vitit 2018.", "Eine Praxis, die die Redaktion vorschlägt, nach der Methode der Studie von 2018."),
    },
    {
      id: "tool",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The", "Karta e", "Die"), x("priority card", "prioriteteve", "Prioritätenkarte")],
      lead: x(
        "One page for one quarter. Fill it in with your team, then compare it with the card of the unit you depend on most.",
        "Një faqe për tre muaj. Plotësoje me ekipin, pastaj krahasoje me kartën e njësisë nga e cila varesh më shumë.",
        "Eine Seite für ein Quartal. Füllen Sie sie mit Ihrem Team aus und vergleichen Sie sie dann mit der Karte der Einheit, von der Sie am meisten abhängen."),
      blocks: [
        { type: "form", items: [
          { h: x("Our three priorities", "Tre prioritetet tona", "Unsere drei Prioritäten"), hint: x("in the team's words", "me fjalët e ekipit", "in den Worten des Teams"), lines: 3 },
          { h: x("What we will not do", "Çfarë nuk do të bëjmë", "Was wir nicht tun"), hint: x("so that the three can happen", "që të ndodhin të tria", "damit die drei geschehen können"), lines: 2 },
          { h: x("The unit we depend on most", "Njësia nga e cila varemi më shumë", "Die Einheit, von der wir am meisten abhängen"), hint: x("and what we need from it", "dhe çfarë na duhet prej saj", "und was wir von ihr brauchen") },
          { h: x("What we deliver to them", "Çfarë u japim ne", "Was wir ihr liefern"), hint: x("and by when", "dhe deri kur", "und bis wann") },
          { h: x("How we check understanding", "Si e kontrollojmë kuptimin", "Wie wir Verständnis prüfen"), hint: x("who asks, when, and how", "kush pyet, kur, dhe si", "wer fragt, wann, und wie") },
          { h: x("Review", "Rishikimi", "Überprüfung"), hint: x("date, and the share who named the same three", "data, dhe pjesa që rendisi të njëjtat tre", "Datum und Anteil, der dieselben drei nannte") },
        ] },
      ],
      note: x(
        "An editors' proposal for practice. Keep confidential plans and figures off the card.",
        "Praktikë që e propozon redaksia. Mos shkruaj në kartë plane ose shifra konfidenciale.",
        "Ein Vorschlag der Redaktion für die Praxis. Schreiben Sie keine vertraulichen Pläne oder Zahlen auf die Karte."),
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
