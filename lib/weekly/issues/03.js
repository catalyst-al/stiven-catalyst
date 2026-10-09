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
    "Çfarë ndodh mes planit dhe punës: menaxherë që nuk i dinë prioritetet, njësi që nuk mbështeten dot te njëra-tjetra, dhe pesë mite për ekzekutimin.",
    "Was zwischen Plan und Arbeit passiert: Führungskräfte, die die Prioritäten nicht kennen, Einheiten, die sich nicht aufeinander verlassen können, und fünf Mythen der Umsetzung."),
  seo: x(
    "Why strategy gets lost in the middle: what Sull, Homkes and Yoder found in thousands of managers, five myths of execution and a card for priorities.",
    "Pse strategjia humbet në mes: çfarë gjetën Sull, Homkes dhe Yoder te mijëra menaxherë, pesë mitet e ekzekutimit dhe një kartë për prioritetet.",
    "Warum Strategie in der Mitte verloren geht: was Sull, Homkes und Yoder bei Tausenden Führungskräften fanden, fünf Mythen und eine Karte für Prioritäten."),
  feature: x(
    "Issue 3 follows a strategy from the top to the work: the company where 97% of leaders said they understood it, the managers who could not name three priorities, and the coordination between units that decides whether it happens.",
    "Numri 3 e ndjek strategjinë nga maja te puna: kompania ku 97% e drejtuesve thanë se e kuptonin, menaxherët që nuk rendisnin dot tre prioritete, dhe koordinimi mes njësive që vendos nëse ajo ndodh.",
    "Ausgabe 3 verfolgt eine Strategie von oben bis zur Arbeit: das Unternehmen, in dem 97 % der Führung sagten, sie verstünden sie, die Führungskräfte, die keine drei Prioritäten nennen konnten, und die Abstimmung zwischen Einheiten, die über die Umsetzung entscheidet."),
  figure: { n: pc(28), by: "MIT SMR, 2018", t: x(
    "of the executives and middle managers responsible for executing strategy could list three of their company's strategic priorities.",
    "e drejtuesve dhe menaxherëve të mesëm që e zbatojnë strategjinë rendisnin tre nga prioritetet strategjike të kompanisë.",
    "der Führungskräfte und mittleren Manager, die die Strategie umsetzen, konnten drei der strategischen Prioritäten ihres Unternehmens nennen.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("97% said they understood the strategy", "97% thanë se e kuptonin strategjinë", "97 % sagten, sie verstünden die Strategie") },
    { page: "numbers", kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: x("Managers rely on their boss, not on the other units", "Menaxherët mbështeten te shefi, jo te njësitë e tjera", "Führungskräfte verlassen sich auf den Chef, nicht auf andere Einheiten") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The priority card", "Karta e prioriteteve", "Die Prioritätenkarte") },
  ],
  sources: ["sull-yoder-2018", "sull-homkes-2015", "lbs-2015", "leinwand-2015"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "A strategy can be clear at the top and still never reach the work. This issue looks at where it gets lost: in the middle, between the people who decide it and the people who carry it out.",
        "Një strategji mund të jetë e qartë në majë dhe prapë të mos arrijë kurrë te puna. Ky numër shikon ku humbet: në mes, mes atyre që e vendosin dhe atyre që e zbatojnë.",
        "Eine Strategie kann oben klar sein und trotzdem nie bei der Arbeit ankommen. Diese Ausgabe schaut, wo sie verloren geht: in der Mitte, zwischen denen, die sie beschließen, und denen, die sie umsetzen."),
      body: x(
        "In studies published since 2015, Donald Sull and colleagues have surveyed thousands of managers. Their findings point the same way. Many managers cannot name the priorities of their own company. Most can rely on their boss and their team, but far fewer on the other units they depend on. And the researchers warn that alignment from the top is not the same as coordination across the organisation.",
        "Në studime të botuara që nga viti 2015, Donald Sull dhe kolegët kanë anketuar mijëra menaxherë. Gjetjet e tyre shkojnë në të njëjtin drejtim. Shumë menaxherë nuk i dinë prioritetet e kompanisë së tyre. Shumica mbështeten te shefi dhe te ekipi, por shumë më pak te njësitë e tjera nga të cilat varen. Dhe kërkuesit paralajmërojnë se harmonizimi nga lart nuk është e njëjta gjë me koordinimin në gjithë organizatën.",
        "In Studien, die seit 2015 erschienen sind, haben Donald Sull und weitere Forschende Tausende Führungskräfte befragt. Ihre Ergebnisse weisen in dieselbe Richtung. Viele Führungskräfte kennen die Prioritäten ihres eigenen Unternehmens nicht. Die meisten können sich auf Chef und Team verlassen, aber weit weniger auf die anderen Einheiten, von denen sie abhängen. Und die Forschenden warnen, dass Ausrichtung von oben nicht dasselbe ist wie Abstimmung in der ganzen Organisation."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("Everyone says", "Të gjithë thonë", "Alle sagen,"), x("they understand", "se e kuptojnë", "sie verstehen es")],
      lead: x(
        "In a large technology company, which the researchers call Generex, almost all senior leaders said they understood the priorities. Then the managers were asked to name them.",
        "Në një kompani të madhe teknologjie, që kërkuesit e quajnë Generex, pothuajse të gjithë drejtuesit e lartë thanë se i kuptonin prioritetet. Pastaj menaxherëve iu kërkua t'i rendisnin.",
        "In einem großen Technologieunternehmen, das die Forschenden Generex nennen, sagten fast alle oberen Führungskräfte, sie verstünden die Prioritäten. Dann wurden die Führungskräfte gebeten, sie zu nennen."),
      blocks: [
        { type: "columns", max: 100, height: 132,
          label: x("Generex: saying and knowing", "Generex: të thuash dhe të dish", "Generex: sagen und wissen"),
          items: [
            { k: x("Say they understand", "Thonë se kuptojnë", "Sagen, sie verstehen"), v: 97, n: pc(97) },
            { k: x("Name 3 of 5", "Rendisin 3 nga 5", "Nennen 3 von 5"), v: 25, n: x("1 in 4", "1 në 4", "1 von 4"), alert: true },
            { k: x("Name none", "Nuk rendisin asnjë", "Nennen keine"), v: 33, n: x("1 in 3", "1 në 3", "1 von 3"), alert: true },
          ] },
        { type: "p", text: x(
          "The first bar counts the senior leaders, the other two the managers who implement the strategy. The same researchers then looked at 124 organisations: only 28% of the executives and middle managers responsible for execution could list three of their company's strategic priorities.",
          "Shtylla e parë numëron drejtuesit e lartë, dy të tjerat menaxherët që e zbatojnë strategjinë. Të njëjtët kërkues shqyrtuan pastaj 124 organizata: vetëm 28% e drejtuesve dhe menaxherëve të mesëm përgjegjës për zbatimin rendisnin tre nga prioritetet strategjike të kompanisë.",
          "Die erste Säule zählt die oberen Führungskräfte, die beiden anderen die Führungskräfte, die die Strategie umsetzen. Dieselben Forschenden untersuchten dann 124 Organisationen: Nur 28 % der für die Umsetzung verantwortlichen Führungskräfte und mittleren Manager konnten drei strategische Prioritäten ihres Unternehmens nennen.") },
        { type: "callout", reading: true, text: x(
          "A strategy does not get lost because people reject it. It gets lost because it does not arrive clearly at the people who make the daily decisions.",
          "Strategjia nuk humbet sepse njerëzit e refuzojnë. Humbet sepse nuk mbërrin e qartë te ata që marrin vendimet e përditshme.",
          "Eine Strategie geht nicht verloren, weil Menschen sie ablehnen. Sie geht verloren, weil sie nicht klar bei denen ankommt, die die täglichen Entscheidungen treffen.") },
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
        "In der Umfrage unter fast 8.000 Führungskräften in mehr als 250 Unternehmen hielt die Befehlskette. Die Verbindungen zwischen Einheiten nicht."),
      blocks: [
        { type: "hbars", max: 100, source: ["sull-homkes-2015"],
          label: x("Managers who can rely on…", "Menaxherët që mund të mbështeten te…", "Führungskräfte, die sich verlassen können auf…"),
          items: [
            { k: x("their boss and direct reports, always or mostly", "shefi dhe vartësit, gjithmonë ose shumicën e kohës", "Chef und direkt Unterstellte, immer oder meistens"), v: 84, n: pc(84) },
            { k: x("colleagues in other units, most of the time", "kolegët e njësive të tjera, shumicën e kohës", "Kollegen anderer Einheiten, meistens"), v: 50, n: x("about 50%", "rreth 50%", "etwa 50 %") },
            { k: x("colleagues in other units, always", "kolegët e njësive të tjera, gjithmonë", "Kollegen anderer Einheiten, immer"), v: 9, n: pc(9), alert: true },
          ] },
        { type: "figures", compact: true, items: [
          { n: x("1 in 3", "1 në 3", "1 von 3"), t: x("of about 11,000 managers in 400+ organisations named the top three priorities correctly (LBS, 2015)", "nga rreth 11.000 menaxherë në 400+ organizata rendisnin saktë tre prioritetet kryesore (LBS, 2015)", "von rund 11.000 Führungskräften in über 400 Organisationen nannten die drei Top-Prioritäten richtig (LBS, 2015)") },
          { n: pc(8), t: x("of leaders were rated very effective at both strategy and execution (about 700 executives, 2013)", "e liderëve u vlerësuan shumë efektivë si në strategji, ashtu edhe në ekzekutim (rreth 700 drejtues, 2013)", "der Führungspersonen wurden in Strategie und Umsetzung als sehr wirksam bewertet (etwa 700 Führungskräfte, 2013)") },
          { n: x("124", "124", "124"), t: x("organisations in the 2018 study of priorities", "organizata në studimin e 2018 për prioritetet", "Organisationen in der Studie von 2018 über Prioritäten") },
        ] },
        { type: "callout", reading: true, text: x(
          "Most work that matters crosses a unit boundary: the warehouse and transport, reception and housekeeping. Where reliance stops at the boundary, the strategy stops there too.",
          "Shumica e punës që ka rëndësi e kalon kufirin e një njësie: magazina dhe transporti, recepsioni dhe housekeeping. Aty ku mbështetja ndalet te kufiri, ndalet edhe strategjia.",
          "Die meiste wichtige Arbeit überquert die Grenze einer Einheit: Lager und Transport, Rezeption und Housekeeping. Wo das Vertrauen an der Grenze endet, endet dort auch die Strategie.") },
      ],
      source: ["sull-homkes-2015", "lbs-2015", "leinwand-2015", "sull-yoder-2018"],
    },
    {
      id: "model", more: "mistakes-get-lost-between-departments",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Five myths", "Pesë mite", "Fünf Mythen"), x("about execution", "për ekzekutimin", "über die Umsetzung")],
      lead: x(
        "Sull, Homkes and Sull named five beliefs that make execution look simpler than it is. The column on the right is our summary of what they propose instead.",
        "Sull, Homkes dhe Sull emërtuan pesë bindje që e bëjnë ekzekutimin të duket më i thjeshtë se ç'është. Kolona djathtas është përmbledhja jonë e asaj që propozojnë në vend të tyre.",
        "Sull, Homkes und Sull benannten fünf Annahmen, die Umsetzung einfacher wirken lassen, als sie ist. Die rechte Spalte ist unsere Zusammenfassung dessen, was sie stattdessen vorschlagen."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("Execution is alignment", "Ekzekutimi është harmonizim", "Umsetzung ist Ausrichtung"), p: x("The harder part is coordination across units, not only from top to bottom.", "Pjesa më e vështirë është koordinimi mes njësive, jo vetëm nga lart poshtë.", "Schwieriger ist die Abstimmung zwischen Einheiten, nicht nur von oben nach unten.") },
          { h: x("Execution is sticking to the plan", "Ekzekutimi është t'i përmbahesh planit", "Umsetzung heißt, am Plan festzuhalten"), p: x("The plan has to adapt when reality changes, without losing its direction.", "Plani duhet të përshtatet kur ndryshon realiteti, pa e humbur drejtimin.", "Der Plan muss sich anpassen, wenn sich die Lage ändert, ohne die Richtung zu verlieren.") },
          { h: x("Communication is understanding", "Komunikimi është kuptim", "Kommunikation ist Verständnis"), p: x("A message that was sent is not yet a message that was understood.", "Mesazhi i dërguar nuk është ende mesazh i kuptuar.", "Eine gesendete Botschaft ist noch keine verstandene.") },
          { h: x("A performance culture drives execution", "Kultura e rezultatit e shtyn ekzekutimin", "Leistungskultur treibt die Umsetzung"), p: x("It also needs to reward agility, teamwork and ambition.", "Duhet të shpërblejë edhe shkathtësinë, punën në ekip dhe ambicien.", "Sie muss auch Beweglichkeit, Teamarbeit und Ehrgeiz belohnen.") },
          { h: x("Execution is driven from the top", "Ekzekutimi drejtohet nga lart", "Umsetzung wird von oben gesteuert"), p: x("It depends on distributed leaders: middle managers and experts close to the work.", "Varet nga liderët e shpërndarë: menaxherët e mesëm dhe ekspertët afër punës.", "Sie hängt von verteilter Führung ab: mittleren Führungskräften und Fachleuten nah an der Arbeit.") },
        ] },
        { type: "example", label: x("Hypothetical example, a hotel", "Shembull hipotetik, një hotel", "Hypothetisches Beispiel, ein Hotel"), text: x(
          "Reception and housekeeping both have clear goals that fit the plan. When a group arrives early, nobody has agreed which rooms are made ready first. The alignment is there; the coordination is missing.",
          "Recepsioni dhe housekeeping kanë të dy objektiva të qarta, në përputhje me planin. Kur një grup mbërrin herët, askush nuk ka rënë dakord se cilat dhoma përgatiten të parat. Harmonizimi është aty, koordinimi mungon.",
          "Rezeption und Housekeeping haben beide klare Ziele, die zum Plan passen. Wenn eine Gruppe früh ankommt, hat niemand vereinbart, welche Zimmer zuerst fertig gemacht werden. Die Ausrichtung ist da, die Abstimmung fehlt.") },
        { type: "callout", reading: true, text: x(
          "Each myth puts the problem at the top or in the plan. The research puts it where the units meet.",
          "Çdo mit e vendos problemin në majë ose te plani. Kërkimi e vendos aty ku takohen njësitë.",
          "Jeder Mythos verortet das Problem oben oder im Plan. Die Forschung verortet es dort, wo Einheiten sich treffen.") },
      ],
      source: ["sull-homkes-2015"],
    },
    {
      id: "role",
      kicker: x("Developing the role", "Zhvillimi i rolit", "Die Rolle entwickeln"),
      title: [x("The middle manager", "Menaxheri i mesëm", "Die mittlere Führungskraft"), x("as the joint", "si nyje", "als Gelenk")],
      lead: x(
        "If execution depends on distributed leaders, the middle manager is not a messenger between the top and the floor. They are the place where the strategy becomes decisions.",
        "Nëse ekzekutimi varet nga liderët e shpërndarë, menaxheri i mesëm nuk është lajmëtar mes majës dhe terrenit. Është vendi ku strategjia bëhet vendime.",
        "Wenn Umsetzung von verteilter Führung abhängt, ist die mittlere Führungskraft kein Bote zwischen oben und der Fläche. Sie ist der Ort, an dem Strategie zu Entscheidungen wird."),
      blocks: [
        { type: "steps", items: [
          { h: x("Translate", "Përkthe", "Übersetzen"), p: x("Turn each priority into what it means for your team this month, in their words.", "Ktheje çdo prioritet në atë që do të thotë për ekipin këtë muaj, me fjalët e tyre.", "Jede Priorität in das übersetzen, was sie diesen Monat für das Team bedeutet, in dessen Worten.") },
          { h: x("Choose what not to do", "Zgjidh çfarë nuk bën", "Wählen, was man nicht tut"), p: x("A priority without something set aside is only one more task.", "Një prioritet pa diçka që lihet mënjanë është vetëm një detyrë më shumë.", "Eine Priorität, für die nichts beiseitegelegt wird, ist nur eine Aufgabe mehr.") },
          { h: x("Agree with the other units", "Merru vesh me njësitë e tjera", "Mit den anderen Einheiten abstimmen"), p: x("Name the unit you depend on most and agree what each side delivers, and by when.", "Emërto njësinë nga e cila varesh më shumë dhe bjer dakord me të: çfarë jep secila palë, dhe deri kur.", "Die Einheit nennen, von der man am meisten abhängt, und vereinbaren, was jede Seite bis wann liefert.") },
          { h: x("Check understanding", "Kontrollo kuptimin", "Verständnis prüfen"), p: x("Ask the team to say the priorities back, instead of asking whether they are clear.", "Kërkoji ekipit t'i thotë prioritetet me fjalët e veta, në vend që të pyesësh nëse janë të qarta.", "Das Team die Prioritäten wiedergeben lassen, statt zu fragen, ob sie klar sind.") },
        ] },
        { type: "example", label: x("Hypothetical example, a store", "Shembull hipotetik, një dyqan", "Hypothetisches Beispiel, eine Filiale"), text: x(
          "The company wants more returning customers. For the store this month, that means no advertised item missing from the shelf. The new window display waits. The central warehouse warns a day ahead about shortages, and on Friday each salesperson says the priority in their own words.",
          "Kompania do më shumë klientë që kthehen. Për dyqanin, këtë muaj kjo do të thotë asnjë artikull i reklamuar që mungon në raft. Vitrina e re pret. Magazina qendrore njofton një ditë më parë për mungesat, dhe të premten çdo shitës e thotë prioritetin me fjalët e veta.",
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
      kicker: x("How it is measured", "Si matet", "Wie man es misst"),
      title: [x("Has the strategy", "A ka mbërritur", "Ist die Strategie"), x("arrived?", "strategjia?", "angekommen?")],
      lead: x(
        "The researchers did not ask managers whether the strategy was clear. They asked them to write the priorities down. You can do the same in your team.",
        "Kërkuesit nuk i pyetën menaxherët nëse strategjia ishte e qartë. Iu kërkua t'i shkruanin prioritetet. Të njëjtën gjë mund ta bësh në ekipin tënd.",
        "Die Forschenden fragten nicht, ob die Strategie klar sei. Sie ließen die Prioritäten aufschreiben. Dasselbe können Sie im eigenen Team tun."),
      blocks: [
        { type: "steps", items: [
          { h: x("Ask in writing", "Pyet me shkrim", "Schriftlich fragen"), p: x("Each person writes down, without notes, the three priorities of the team or the company.", "Secili shkruan, pa shënime, tre prioritetet e ekipit ose të kompanisë.", "Jede Person schreibt ohne Notizen die drei Prioritäten des Teams oder Unternehmens auf.") },
          { h: x("Count the matches", "Numëro përputhjet", "Treffer zählen"), p: x("How many people name the same three? How many name at least one?", "Sa veta rendisin të njëjtat tre? Sa rendisin të paktën një?", "Wie viele nennen dieselben drei? Wie viele mindestens eine?") },
          { h: x("Ask about the other units", "Pyet për njësitë e tjera", "Nach den anderen Einheiten fragen"), p: x("For each unit you depend on: can we rely on them always, most of the time, sometimes, rarely?", "Për çdo njësi nga e cila varemi: mund të mbështetemi gjithmonë, shumicën e kohës, ndonjëherë, rrallë?", "Für jede Einheit, von der man abhängt: Können wir uns immer, meistens, manchmal, selten verlassen?") },
          { h: x("Repeat after a quarter", "Përsërite pas tre muajsh", "Nach einem Quartal wiederholen"), p: x("The number to watch is the share who name the same three.", "Numri që ndjek është pjesa e atyre që rendisin të njëjtat tre.", "Die Zahl, auf die es ankommt, ist der Anteil, der dieselben drei nennt.") },
        ] },
        { type: "example", label: x("Hypothetical example, eight managers", "Shembull hipotetik, tetë menaxherë", "Hypothetisches Beispiel, acht Führungskräfte"), text: x(
          "Three name the company's three priorities, four name only one of them, one names none. Three out of eight is fewer than half: the next meeting starts from the three priorities, written on the board. The numbers are invented.",
          "Tre rendisin tre prioritetet e kompanisë, katër vetëm një prej tyre, një asnjë. Tre nga tetë është më pak se gjysma: takimi i ardhshëm nis nga tre prioritetet, të shkruara në tabelë. Numrat janë të shpikur.",
          "Drei nennen die drei Prioritäten des Unternehmens, vier nur eine davon, eine keine. Drei von acht ist weniger als die Hälfte: Das nächste Meeting beginnt mit den drei Prioritäten, an der Tafel. Die Zahlen sind erfunden.") },
        { type: "callout", reading: true, text: x(
          "If fewer than half name the same three priorities, the next meeting is not about new goals. It is about the ones you already have.",
          "Nëse më pak se gjysma rendisin të njëjtat tre prioritete, takimi i ardhshëm nuk është për objektiva të rinj. Është për ata që i keni tashmë.",
          "Wenn weniger als die Hälfte dieselben drei Prioritäten nennt, geht es im nächsten Meeting nicht um neue Ziele, sondern um die, die man schon hat.") },
      ],
      note: x("A practice proposed by the editors, after the method of the 2018 study.", "Praktikë e propozuar nga redaksia, sipas metodës së studimit të 2018.", "Eine Praxis, die die Redaktion vorschlägt, nach der Methode der Studie von 2018."),
    },
    {
      id: "tool",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The", "Karta e", "Die"), x("priority card", "prioriteteve", "Prioritätenkarte")],
      lead: x(
        "One page for one quarter. Fill it in with your team, then compare it with the card of the unit you depend on most.",
        "Një faqe për tre muaj. Plotësoje me ekipin, pastaj krahasoje me kartën e njësisë nga e cila varesh më shumë.",
        "Eine Seite für ein Quartal. Füllen Sie sie mit dem Team aus und vergleichen Sie sie dann mit der Karte der Einheit, von der Sie am meisten abhängen."),
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
        "A practice proposed by the editors. Do not write confidential plans or figures on the card.",
        "Praktikë e propozuar nga redaksia. Mos shkruaj plane ose shifra konfidenciale në kartë.",
        "Eine Praxis, die die Redaktion vorschlägt. Keine vertraulichen Pläne oder Zahlen auf die Karte schreiben."),
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
