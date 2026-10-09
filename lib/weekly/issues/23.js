// Management Review, No. 23: Change that lasts: the truth about "70% fail". Block: Strategy.
// Facts and their sources: docs/revista/management-review-nr-23.md.
import { x, pc } from "../common.js";

export default {
  number: 23,
  block: "strategy",
  date: x("October 2026", "Tetor 2026", "Oktober 2026"),
  theme: [x("Change that lasts:", "Ndryshimi që zgjat:", "Wandel, der bleibt:"), x("the truth about “70% fail”", "e vërteta për “70% dështojnë”", "die Wahrheit über „70 % scheitern“")],
  sub: x(
    "Where the 70% came from, what Kotter saw in a hundred companies, what executives report in surveys, what makes people open to change, and a card for a change that has to last.",
    "Nga erdhi 70%-shi, çfarë pa Kotter në njëqind kompani, çfarë raportojnë drejtuesit në anketa, çfarë i bën njerëzit të hapur ndaj ndryshimit, dhe një kartë për një ndryshim që duhet të zgjasë.",
    "Woher die 70 % kommen, was Kotter in hundert Unternehmen sah, was Führungskräfte in Umfragen berichten, was Menschen für Wandel öffnet, und eine Karte für einen Wandel, der bleiben soll."),
  seo: x(
    "Change that lasts: where the 70% failure figure came from, Kotter's eight errors, what McKinsey's surveys show, and a card for a change that sticks.",
    "Ndryshimi që zgjat: nga erdhi shifra 70% e dështimeve, tetë gabimet e Kotter, çfarë tregojnë anketat e McKinsey, dhe një kartë për ndryshimin.",
    "Wandel, der bleibt: woher die 70-%-Quote kommt, Kotters acht Fehler, was die Umfragen von McKinsey zeigen, und eine Karte für Wandel, der hält."),
  feature: x(
    "Issue 23 traces the claim that 70% of change efforts fail from an “unscientific estimate” in 1993 to a 2011 review that found no evidence for it, goes through the eight errors John Kotter saw in more than a hundred companies, reads what executives report in McKinsey's surveys, looks at what makes people open to change, and ends with a card for a change that has to last.",
    "Numri 23 ndjek pohimin se 70% e ndryshimeve dështojnë, nga një “vlerësim joshkencor” i 1993 te një rishikim i 2011 që nuk gjeti prova për të, kalon nëpër tetë gabimet që John Kotter pa në mbi njëqind kompani, lexon çfarë raportojnë drejtuesit në anketat e McKinsey, shikon çfarë i bën njerëzit të hapur ndaj ndryshimit, dhe mbyllet me një kartë për një ndryshim që duhet të zgjasë.",
    "Ausgabe 23 verfolgt die Behauptung, 70 % aller Veränderungen scheiterten, von einer „unwissenschaftlichen Schätzung“ 1993 bis zu einer Übersicht von 2011, die keine Belege dafür fand, geht die acht Fehler durch, die John Kotter in mehr als hundert Unternehmen sah, liest, was Führungskräfte in McKinseys Umfragen berichten, betrachtet, was Menschen für Wandel öffnet, und endet mit einer Karte für einen Wandel, der bleiben soll."),
  figure: { n: x("≈70%", "≈70%", "≈70 %"), by: "Beer & Nohria, 2000", t: x(
    "of all change initiatives fail, wrote Beer and Nohria, citing no evidence. A 2011 review found no valid evidence for the figure.",
    "e të gjitha nismave të ndryshimit dështojnë, shkruan Beer dhe Nohria, pa cituar prova. Një rishikim i 2011 nuk gjeti prova të vlefshme për këtë shifër.",
    "aller Veränderungsinitiativen scheitern, schrieben Beer und Nohria, ohne Belege zu nennen. Eine Übersicht von 2011 fand keine stichhaltigen Belege für die Zahl.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("Where 70% came from", "Nga erdhi 70%-shi", "Woher die 70 % kommen") },
    { page: "model", kicker: x("The model", "Modeli", "Das Modell"),
      title: x("Eight errors", "Tetë gabimet", "Acht Fehler") },
    { page: "tool", kicker: x("Tool of the week", "Mjeti i javës", "Werkzeug der Woche"),
      title: x("The change card", "Karta e ndryshimit", "Die Veränderungskarte") },
  ],
  sources: ["hammer-champy-1993", "kotter-1995", "beer-nohria-2000", "hughes-2011", "mckinsey-transformation-2021", "mckinsey-transformation-2015", "appelbaum-2012", "wanberg-banas-2000"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Few management claims are repeated as often as “70% of change efforts fail”. This issue asks where the figure came from, what the evidence actually says, and what makes a change last after the project ends.",
        "Pak pohime menaxhimi përsëriten aq shpesh sa “70% e ndryshimeve dështojnë”. Ky numër pyet nga erdhi shifra, çfarë thonë vërtet provat, dhe çfarë e bën një ndryshim të zgjasë pasi mbaron projekti.",
        "Kaum eine Managementbehauptung wird so oft wiederholt wie „70 % aller Veränderungen scheitern“. Diese Ausgabe fragt, woher die Zahl kommt, was die Belege wirklich sagen und was einen Wandel nach dem Projektende halten lässt."),
      body: x(
        "In 1993 Hammer and Champy gave an “unscientific estimate” that up to 50–70% of organisations that start reengineering miss the dramatic results they intended. In 2000 Beer and Nohria wrote, without evidence, that about 70% of all change initiatives fail; in 2011 Mark Hughes found no valid evidence for the figure. Kotter, who followed more than a hundred companies, gave no percentage. In McKinsey's 2015 survey, 26% of executives said their transformation had improved performance and kept the gains.",
        "Në 1993, Hammer dhe Champy dhanë një “vlerësim joshkencor”: deri në 50–70% e organizatave që nisin riinxhinierimin nuk arrijnë rezultatet dramatike që synojnë. Në 2000, Beer dhe Nohria shkruan, pa prova, se rreth 70% e të gjitha nismave të ndryshimit dështojnë; në 2011, Mark Hughes nuk gjeti prova të vlefshme për këtë shifër. Kotter, që ndoqi mbi njëqind kompani, nuk dha asnjë përqindje. Te anketa e McKinsey e 2015, 26% e drejtuesve thanë se transformimi i tyre e përmirësoi performancën dhe i mbajti arritjet.",
        "1993 gaben Hammer und Champy eine „unwissenschaftliche Schätzung“ ab: Bis zu 50–70 % der Organisationen, die ein Reengineering beginnen, verfehlten die erhofften dramatischen Ergebnisse. 2000 schrieben Beer und Nohria ohne Belege, etwa 70 % aller Veränderungsinitiativen scheiterten; 2011 fand Mark Hughes keine stichhaltigen Belege für die Zahl. Kotter, der mehr als hundert Unternehmen begleitete, nannte keine Prozentzahl. In McKinseys Umfrage von 2015 sagten 26 % der Führungskräfte, ihre Transformation habe die Leistung verbessert und die Gewinne gehalten."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("Where 70%", "Nga erdhi", "Woher die 70 %"), x("came from", "70%-shi", "kommen")],
      lead: x(
        "The figure has a history. It began as a cautious estimate about one kind of change and became a rule about all of them.",
        "Shifra ka një histori. Nisi si vlerësim i kujdesshëm për një lloj ndryshimi dhe u bë rregull për të gjitha.",
        "Die Zahl hat eine Geschichte. Sie begann als vorsichtige Schätzung zu einer Art von Wandel und wurde zur Regel für alle."),
      blocks: [
        { type: "timeline", items: [
          { k: "1993", t: x("Hammer and Champy, Reengineering the Corporation: an “unscientific estimate” that up to 50–70% of organisations that start reengineering miss the dramatic results they intended.", "Hammer dhe Champy, Reengineering the Corporation: një “vlerësim joshkencor” se deri në 50–70% e organizatave që nisin riinxhinierimin nuk arrijnë rezultatet dramatike që synojnë.", "Hammer und Champy, Reengineering the Corporation: eine „unwissenschaftliche Schätzung“, dass bis zu 50–70 % der Organisationen, die ein Reengineering beginnen, die erhofften dramatischen Ergebnisse verfehlen.") },
          { k: "1995", t: x("Kotter, in Harvard Business Review, after following more than 100 companies: a few very successful, a few utter failures, most in between. No percentage.", "Kotter, te Harvard Business Review, pasi ndoqi mbi 100 kompani: disa shumë të suksesshme, disa dështime të plota, shumica diku në mes. Asnjë përqindje.", "Kotter in der Harvard Business Review, nachdem er mehr als 100 Unternehmen begleitet hatte: wenige sehr erfolgreich, wenige völlig gescheitert, die meisten dazwischen. Keine Prozentzahl.") },
          { k: "2000", t: x("Beer and Nohria, in Harvard Business Review: about 70% of all change initiatives fail. No source is given.", "Beer dhe Nohria, te Harvard Business Review: rreth 70% e të gjitha nismave të ndryshimit dështojnë. Nuk jepet burim.", "Beer und Nohria in der Harvard Business Review: Etwa 70 % aller Veränderungsinitiativen scheitern. Eine Quelle wird nicht genannt.") },
          { k: "2011", t: x("Mark Hughes, Journal of Change Management: no valid and reliable empirical evidence supports the figure.", "Mark Hughes, Journal of Change Management: asnjë provë empirike e vlefshme dhe e besueshme nuk e mbështet shifrën.", "Mark Hughes, Journal of Change Management: Kein stichhaltiger, verlässlicher empirischer Beleg stützt die Zahl.") },
        ] },
        { type: "p", text: x(
          "Missing the dramatic results intended is not the same as failing, and reengineering is not every kind of change. Between 1993 and 2000 both distinctions were lost.",
          "Të mos arrish rezultatet dramatike që synon nuk është njësoj si të dështosh, dhe riinxhinierimi nuk është çdo lloj ndryshimi. Mes 1993 dhe 2000 humbën të dyja këto dallime.",
          "Die erhofften dramatischen Ergebnisse zu verfehlen ist nicht dasselbe wie zu scheitern, und Reengineering ist nicht jede Art von Wandel. Zwischen 1993 und 2000 gingen beide Unterscheidungen verloren.") },
        { type: "callout", reading: true, text: x(
          "The 70% says more about how management ideas travel than about change. When someone quotes it, ask: failed at what, and measured how?",
          "70%-shi flet më shumë për përhapjen e ideve të menaxhimit sesa për ndryshimin. Kur dikush e citon, pyet: dështoi në çfarë, dhe si u mat?",
          "Die 70 % sagen mehr darüber, wie Managementideen wandern, als über Wandel. Wenn jemand sie zitiert, fragen: woran gescheitert, und wie gemessen?") },
      ],
      source: ["hammer-champy-1993", "kotter-1995", "beer-nohria-2000", "hughes-2011"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("What executives", "Çfarë raportojnë", "Was Führungskräfte"), x("report", "drejtuesit", "berichten")],
      lead: x(
        "McKinsey has asked executives for years how their transformations went. The answers are their own assessments, and each survey defines success in its own way.",
        "McKinsey i pyet drejtuesit prej vitesh si shkuan transformimet e tyre. Përgjigjet janë vlerësimet e tyre, dhe çdo anketë e përkufizon suksesin në mënyrën e vet.",
        "McKinsey fragt Führungskräfte seit Jahren, wie ihre Transformationen verliefen. Die Antworten sind ihre eigenen Einschätzungen, und jede Umfrage definiert Erfolg auf ihre Weise."),
      blocks: [
        { type: "hbars", max: 40, source: ["mckinsey-transformation-2021"],
          label: x("Where the lost value of a transformation goes, as respondents estimate it (2021)", "Ku humbet vlera e një transformimi, sipas vlerësimit të të anketuarve (2021)", "Wo der verlorene Wert einer Transformation verloren geht, nach Schätzung der Befragten (2021)"),
          items: [
            { k: x("Setting targets", "Vendosja e objektivave", "Ziele setzen"), v: 22, n: pc(22) },
            { k: x("Planning", "Planifikimi", "Planung"), v: 23, n: pc(23) },
            { k: x("Implementation", "Zbatimi", "Umsetzung"), v: 35, n: pc(35), alert: true },
            { k: x("After implementation", "Pas zbatimit", "Nach der Umsetzung"), v: 20, n: pc(20), alert: true },
          ] },
        { type: "figures", compact: true, items: [
          { n: pc(26), t: x("said their transformation improved performance and kept the gains (2015; 20% in 2012)", "thanë se transformimi e përmirësoi performancën dhe i mbajti arritjet (2015; 20% në 2012)", "sagten, ihre Transformation habe die Leistung verbessert und die Gewinne gehalten (2015; 20 % im Jahr 2012)") },
          { n: pc(79), t: x("said so among those who followed a rigorous approach and completed every action", "thanë të njëjtën gjë mes atyre që ndoqën një qasje rigoroze dhe i përfunduan të gjitha veprimet", "sagten dies unter denen, die streng vorgingen und jede Maßnahme abschlossen") },
        ] },
        { type: "callout", reading: true, text: x(
          "More than half of the lost value goes during and after implementation. The plan is rarely the weakest part; carrying it out and keeping it is.",
          "Më shumë se gjysma e vlerës së humbur shkon gjatë dhe pas zbatimit. Plani rrallë është pjesa më e dobët; e tillë është zbatimi dhe mbajtja e tij.",
          "Mehr als die Hälfte des verlorenen Werts geht während und nach der Umsetzung verloren. Selten ist der Plan der schwächste Teil, sondern seine Umsetzung und sein Erhalt.") },
      ],
      note: x(
        "Executives' own assessments, not measured results; we have not seen the sample sizes.",
        "Vlerësime të vetë drejtuesve, jo rezultate të matura; madhësitë e mostrave s'i kam parë.",
        "Eigene Einschätzungen der Führungskräfte, keine gemessenen Ergebnisse; die Stichprobengrößen haben wir nicht gesehen."),
      source: ["mckinsey-transformation-2021", "mckinsey-transformation-2015"],
    },
    {
      id: "model", more: "the-first-30-days",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Eight", "Tetë", "Acht"), x("errors", "gabimet", "Fehler")],
      lead: x(
        "Kotter gave no failure rate. He described the errors he saw most often, in the order a change passes through them.",
        "Kotter nuk dha shkallë dështimi. Përshkroi gabimet që pa më shpesh, sipas radhës në të cilën i kalon një ndryshim.",
        "Kotter nannte keine Scheiterquote. Er beschrieb die Fehler, die er am häufigsten sah, in der Reihenfolge, in der ein Wandel sie durchläuft."),
      blocks: [
        { type: "lists", cols: [
          { h: x("Getting started", "Nisja", "Der Anfang"), items: [
            x("1 Not enough urgency", "1 Urgjencë e pamjaftueshme", "1 Zu wenig Dringlichkeit"),
            x("2 A guiding coalition that is not strong enough", "2 Një koalicion drejtues jo mjaft i fortë", "2 Eine zu schwache Führungskoalition"),
            x("3 No vision", "3 Mungon vizioni", "3 Keine Vision"),
            x("4 The vision communicated far too little", "4 Vizioni komunikohet tepër pak", "4 Die Vision viel zu wenig vermittelt"),
          ] },
          { h: x("Carrying it through", "Çuarja deri në fund", "Das Durchhalten"), accent: true, items: [
            x("5 Obstacles not removed", "5 Pengesat nuk hiqen", "5 Hindernisse nicht beseitigt"),
            x("6 No short-term wins planned", "6 Fitoret afatshkurtra nuk planifikohen", "6 Keine kurzfristigen Erfolge geplant"),
            x("7 Victory declared too soon", "7 Fitorja shpallet para kohe", "7 Den Sieg zu früh erklärt"),
            x("8 Changes not anchored in the culture", "8 Ndryshimet nuk ngulen në kulturë", "8 Veränderungen nicht in der Kultur verankert"),
          ] },
        ] },
        { type: "p", text: x(
          "Well over half of the companies he followed failed at the first step. Urgency is enough, he wrote, when about 75% of the management is honestly convinced that business as usual is unacceptable. A review in 2012 found support for most steps one by one, but no formal test of the whole model.",
          "Shumë më tepër se gjysma e kompanive që ndoqi dështuan që në hapin e parë. Urgjenca mjafton, shkroi ai, kur rreth 75% e drejtuesve janë bindur sinqerisht se “biznesi si zakonisht” është i papranueshëm. Një rishikim i 2012 gjeti mbështetje për shumicën e hapave veç e veç, por asnjë test formal të modelit të plotë.",
          "Weit mehr als die Hälfte der Unternehmen, die er begleitete, scheiterte schon am ersten Schritt. Dringlichkeit reiche, schrieb er, wenn etwa 75 % der Führung ehrlich überzeugt sind, dass „weiter wie bisher“ inakzeptabel ist. Eine Übersicht von 2012 fand Belege für die meisten Schritte einzeln, aber keinen formalen Test des ganzen Modells.") },
        { type: "callout", reading: true, text: x(
          "Kotter's list is a map of where change breaks, not a proof of how it succeeds. Used that way, it is useful.",
          "Lista e Kotter është hartë e vendeve ku ndryshimi thyhet, jo provë se si ia del. E përdorur kështu, është e dobishme.",
          "Kotters Liste ist eine Karte der Stellen, an denen Wandel bricht, kein Beweis, wie er gelingt. So verwendet, ist sie nützlich.") },
      ],
      source: ["kotter-1995", "appelbaum-2012"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("What opens people", "Çfarë i hap njerëzit", "Was Menschen für"), x("to change", "ndaj ndryshimit", "Wandel öffnet")],
      lead: x(
        "Connie Wanberg and Joseph Banas followed the employees of one organisation through a large reorganisation and asked who stayed open to the changes.",
        "Connie Wanberg dhe Joseph Banas ndoqën punonjësit e një organizate gjatë një riorganizimi të madh dhe pyetën kush mbeti i hapur ndaj ndryshimeve.",
        "Connie Wanberg und Joseph Banas begleiteten die Beschäftigten einer Organisation durch eine große Umstrukturierung und fragten, wer für die Veränderungen offen blieb."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("Information", "Informacioni", "Information"), p: x("Those who were told about the changes were more open to them.", "Ata që u informuan për ndryshimet ishin më të hapur ndaj tyre.", "Wer über die Veränderungen informiert wurde, war offener für sie.") },
          { h: x("Confidence", "Besimi", "Zutrauen"), p: x("Those who felt able to cope with the changes were more open.", "Ata që ndiheshin të aftë t'i përballonin ndryshimet ishin më të hapur.", "Wer sich zutraute, mit den Veränderungen fertigzuwerden, war offener.") },
          { h: x("A say", "Zëri", "Mitsprache"), p: x("Those who took part in decisions about the changes were more open.", "Ata që morën pjesë në vendimet për ndryshimet ishin më të hapur.", "Wer an den Entscheidungen über die Veränderungen beteiligt war, war offener.") },
        ] },
        { type: "p", text: x(
          "Lower acceptance went with less job satisfaction, more irritation and a stronger intention to leave. In McKinsey's 2015 survey, continuous-improvement activities went with about twice the odds that results lasted.",
          "Pranimi më i ulët shkoi bashkë me më pak kënaqësi në punë, më shumë acarim dhe një synim më të fortë për t'u larguar. Te anketa e McKinsey e 2015, aktivitetet e përmirësimit të vazhdueshëm u lidhën me rreth dyfishin e gjasave që rezultatet të mbaheshin.",
          "Geringere Akzeptanz ging mit weniger Arbeitszufriedenheit, mehr Gereiztheit und einer stärkeren Kündigungsabsicht einher. In McKinseys Umfrage von 2015 gingen Aktivitäten der kontinuierlichen Verbesserung mit etwa doppelt so hohen Chancen einher, dass die Ergebnisse hielten.") },
        { type: "callout", reading: true, text: x(
          "A change lasts in the people who carry it. Information, confidence and a say cost little next to a change that has to be made twice.",
          "Një ndryshim zgjat te njerëzit që e mbajnë. Informacioni, besimi dhe një fjalë në vendim kushtojnë pak përballë një ndryshimi që duhet bërë dy herë.",
          "Ein Wandel hält in den Menschen, die ihn tragen. Information, Zutrauen und Mitsprache kosten wenig im Vergleich zu einem Wandel, der zweimal gemacht werden muss.") },
      ],
      note: x(
        "One organisation and questionnaires; McKinsey's figures are self-reports. We have not seen the sample sizes.",
        "Një organizatë dhe pyetësorë; shifrat e McKinsey janë vetëvlerësime. Madhësitë e mostrave s'i kam parë.",
        "Eine Organisation und Fragebögen; McKinseys Zahlen sind Selbstauskünfte. Die Stichprobengrößen haben wir nicht gesehen."),
      source: ["wanberg-banas-2000", "mckinsey-transformation-2015"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie man es misst"),
      title: [x("Measure after", "Mate pas", "Nach dem Projekt"), x("the project", "projektit", "messen")],
      lead: x(
        "A change is usually measured when the project closes. Whether it lasted shows later, when nobody is watching any more.",
        "Një ndryshim zakonisht matet kur mbyllet projekti. Nëse zgjati, duket më vonë, kur s'e shikon më askush.",
        "Ein Wandel wird meist gemessen, wenn das Projekt endet. Ob er hält, zeigt sich später, wenn niemand mehr hinschaut."),
      blocks: [
        { type: "steps", items: [
          { h: x("Name the result and the date", "Emërto rezultatin dhe datën", "Ergebnis und Datum benennen"), p: x("One number the change should move, and by when.", "Një numër që ndryshimi duhet ta lëvizë, dhe deri kur.", "Eine Zahl, die der Wandel bewegen soll, und bis wann.") },
          { h: x("Measure before", "Mat para", "Vorher messen"), p: x("Four weeks of the old way, so the start is known.", "Katër javë me mënyrën e vjetër, që të dihet nga niset.", "Vier Wochen der alten Arbeitsweise, damit der Anfang bekannt ist.") },
          { h: x("Measure at the end", "Mat në fund", "Am Ende messen"), p: x("On the day the project closes.", "Ditën kur mbyllet projekti.", "Am Tag, an dem das Projekt endet.") },
          { h: x("Measure again at 3, 6 and 12 months", "Mat sërish pas 3, 6 dhe 12 muajsh", "Nach 3, 6 und 12 Monaten erneut messen"), p: x("Until a change takes root, Kotter warned, it can slide back.", "Derisa një ndryshim të zërë rrënjë, paralajmëroi Kotter, mund të kthehet pas.", "Bis ein Wandel Wurzeln schlägt, warnte Kotter, kann er zurückrutschen.") },
        ] },
        { type: "example", label: x("Hypothetical example, a new handover routine", "Shembull hipotetik, një rutinë e re dorëzimi", "Hypothetisches Beispiel, eine neue Übergaberoutine"), rows: [
          { k: x("Before", "Para", "Vorher"), v: x("6 of 10 handovers complete", "6 nga 10 dorëzime të plota", "6 von 10 Übergaben vollständig") },
          { k: x("Project end", "Fundi", "Projektende"), v: x("9 of 10", "9 nga 10", "9 von 10") },
          { k: x("3 months", "3 muaj", "3 Monate"), v: x("9 of 10", "9 nga 10", "9 von 10") },
          { k: x("6 months", "6 muaj", "6 Monate"), v: x("7 of 10", "7 nga 10", "7 von 10") },
        ], text: x("The slide at six months is the signal to act again. The numbers are invented.", "Rënia pas gjashtë muajsh është sinjali për të vepruar sërish. Numrat janë të shpikur.", "Der Rückgang nach sechs Monaten ist das Signal, erneut zu handeln. Die Zahlen sind erfunden.") },
      ],
      note: x("The steps and the example are the editors'.", "Hapat dhe shembulli janë të redaksisë.", "Schritte und Beispiel stammen von der Redaktion."),
      source: ["kotter-1995"],
    },
    {
      id: "tool",
      kicker: x("Tool of the week", "Mjeti i javës", "Werkzeug der Woche"),
      title: [x("The change", "Karta e", "Die Veränderungs-"), x("card", "ndryshimit", "karte")],
      lead: x(
        "One card for one change. Fill it in before the change starts, and look at it again on each check date.",
        "Një kartë për një ndryshim. Plotësoje para se të nisë ndryshimi, dhe shikoje sërish në çdo datë kontrolli.",
        "Eine Karte für einen Wandel. Vor dem Start ausfüllen und an jedem Prüftermin wieder ansehen."),
      blocks: [
        { type: "form", items: [
          { h: x("What changes", "Çfarë ndryshon", "Was sich ändert"), hint: x("in one sentence, and the number that should move", "në një fjali, dhe numri që duhet të lëvizë", "in einem Satz, und die Zahl, die sich bewegen soll") },
          { h: x("Why now", "Pse tani", "Warum jetzt"), hint: x("what happens if nothing changes", "çfarë ndodh nëse nuk ndryshon asgjë", "was passiert, wenn sich nichts ändert") },
          { h: x("Who leads", "Kush drejton", "Wer führt"), hint: x("the people who carry it, and who decides", "njerëzit që e mbajnë, dhe kush vendos", "die Menschen, die ihn tragen, und wer entscheidet") },
          { h: x("What people need", "Çfarë u duhet njerëzve", "Was die Menschen brauchen"), hint: x("information, the confidence to cope, a say in decisions", "informacion, besim se do ta përballojnë, një fjalë në vendime", "Information, das Zutrauen, es zu schaffen, Mitsprache bei Entscheidungen"), lines: 2 },
          { h: x("First win", "Fitorja e parë", "Erster Erfolg"), hint: x("something visible within weeks", "diçka që duket brenda disa javësh", "etwas Sichtbares innerhalb weniger Wochen") },
          { h: x("Check dates", "Datat e kontrollit", "Prüftermine"), hint: x("project end, then 3, 6 and 12 months", "fundi i projektit, pastaj 3, 6 dhe 12 muaj", "Projektende, dann 3, 6 und 12 Monate") },
        ] },
      ],
      note: x(
        "A practice proposed by the editors, after Kotter's eight errors and the findings of Wanberg and Banas.",
        "Praktikë e propozuar nga redaksia, sipas tetë gabimeve të Kotter dhe gjetjeve të Wanberg dhe Banas.",
        "Eine Praxis, die die Redaktion vorschlägt, nach Kotters acht Fehlern und den Befunden von Wanberg und Banas."),
      source: ["kotter-1995", "wanberg-banas-2000"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
