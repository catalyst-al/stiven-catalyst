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
    "Nga doli 70%-shi, çfarë pa Kotter-i në njëqind kompani, çfarë raportojnë drejtuesit në anketa, çfarë i bën njerëzit të hapur ndaj ndryshimit, dhe një kartë për një ndryshim që duhet të zgjasë.",
    "Woher die 70 % kommen, was Kotter in hundert Unternehmen sah, was Führungskräfte in Umfragen berichten, was Menschen für Wandel öffnet, und eine Karte für einen Wandel, der bleiben soll."),
  seo: x(
    "Change that lasts: where the 70% failure figure came from, Kotter's eight errors, what McKinsey's surveys show, and a card for a change that sticks.",
    "Ndryshimi që zgjat: nga doli shifra 70% e dështimeve, tetë gabimet e Kotter-it, çfarë tregojnë anketat e McKinsey-t, dhe një kartë për ndryshimin.",
    "Wandel, der bleibt: woher die 70-%-Quote kommt, Kotters acht Fehler, was die Umfragen von McKinsey zeigen, und eine Karte für Wandel, der hält."),
  feature: x(
    "The claim that 70% of change efforts fail began as an “unscientific estimate” in 1993, and a 2011 review found no evidence for it. Issue 23 goes through the eight errors John Kotter saw in more than a hundred companies, reads what executives report in McKinsey's surveys and looks at what makes people open to change. It ends with a card for a change that has to last.",
    "Pohimi se 70% e ndryshimeve dështojnë nisi si “vlerësim joshkencor” në vitin 1993, dhe një rishikim i vitit 2011 nuk gjeti prova për të. Numri 23 kalon nëpër tetë gabimet që John Kotter pa në mbi njëqind kompani, lexon çfarë raportojnë drejtuesit në anketat e McKinsey-t dhe shikon çfarë i bën njerëzit të hapur ndaj ndryshimit. Mbyllet me një kartë për një ndryshim që duhet të zgjasë.",
    "Die Behauptung, 70 % aller Veränderungen scheiterten, begann 1993 als „unwissenschaftliche Schätzung“, und eine Übersicht von 2011 fand keine Belege dafür. Ausgabe 23 geht die acht Fehler durch, die John Kotter in mehr als hundert Unternehmen sah, liest, was Führungskräfte in McKinseys Umfragen berichten, und fragt, was Menschen für Wandel öffnet. Am Ende steht eine Karte für einen Wandel, der bleiben soll."),
  figure: { n: x("≈70%", "≈70%", "≈70 %"), by: "Beer & Nohria, 2000", t: x(
    "of all change initiatives fail, wrote Beer and Nohria, citing no evidence. A 2011 review found no valid evidence for the figure.",
    "e të gjitha nismave të ndryshimit dështojnë, shkruan Beer dhe Nohria, pa cituar prova. Një rishikim i vitit 2011 nuk gjeti prova të vlefshme për këtë shifër.",
    "aller Veränderungsinitiativen scheitern, schrieben Beer und Nohria, ohne Belege zu nennen. Eine Übersicht von 2011 fand keine stichhaltigen Belege für die Zahl.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("Where 70% came from", "Nga doli 70%-shi", "Woher die 70 % kommen") },
    { page: "model", kicker: x("The model", "Modeli", "Das Modell"),
      title: x("Eight errors", "Tetë gabimet", "Acht Fehler") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The change card", "Karta e ndryshimit", "Die Veränderungskarte") },
  ],
  sources: ["hammer-champy-1993", "kotter-1995", "beer-nohria-2000", "hughes-2011", "mckinsey-transformation-2021", "mckinsey-transformation-2015", "appelbaum-2012", "wanberg-banas-2000"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Few management claims are repeated as often as “70% of change efforts fail”. Where did the figure come from, what does the evidence actually say, and what makes a change last once the project has ended?",
        "Pak pohime menaxhimi përsëriten aq shpesh sa “70% e ndryshimeve dështojnë”. Nga doli kjo shifër, çfarë thonë vërtet provat, dhe çfarë e bën një ndryshim të zgjasë pasi projekti ka mbaruar?",
        "Kaum eine Managementbehauptung wird so oft wiederholt wie „70 % aller Veränderungen scheitern“. Woher stammt die Zahl, was sagen die Belege wirklich, und was lässt einen Wandel halten, wenn das Projekt vorbei ist?"),
      body: x(
        "In 1993 Hammer and Champy gave an “unscientific estimate” that up to 50–70% of organisations that start reengineering miss the dramatic results they intended. In 2000 Beer and Nohria wrote, without evidence, that about 70% of all change initiatives fail; in 2011 Mark Hughes found no valid evidence for the figure. Kotter, who followed more than a hundred companies, gave no overall failure rate. In McKinsey's 2015 survey, 26% of executives said their transformation had improved performance and kept the gains.",
        "Në vitin 1993, Hammer dhe Champy dhanë një “vlerësim joshkencor”: deri në 50–70% e organizatave që nisin riinxhinierimin nuk arrijnë rezultatet dramatike që synojnë. Në vitin 2000, Beer dhe Nohria shkruan, pa prova, se rreth 70% e të gjitha nismave të ndryshimit dështojnë; në vitin 2011, Mark Hughes nuk gjeti prova të vlefshme për këtë shifër. Kotter-i, që ndoqi mbi njëqind kompani, nuk dha ndonjë shkallë të përgjithshme dështimi. Në anketën e McKinsey-t të vitit 2015, 26% e drejtuesve thanë se transformimi i tyre i përmirësoi rezultatet dhe i ruajti arritjet.",
        "1993 gaben Hammer und Champy eine „unwissenschaftliche Schätzung“ ab: Bis zu 50–70 % der Organisationen, die ein Reengineering beginnen, verfehlten die angestrebten dramatischen Ergebnisse. 2000 schrieben Beer und Nohria ohne Belege, etwa 70 % aller Veränderungsinitiativen scheiterten; 2011 fand Mark Hughes keine stichhaltigen Belege für die Zahl. Kotter, der mehr als hundert Unternehmen begleitete, nannte keine Gesamtquote. In McKinseys Umfrage von 2015 gaben 26 % der Führungskräfte an, ihre Transformation habe die Leistung verbessert und das Erreichte gehalten."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("Where 70%", "Nga doli", "Woher die 70 %"), x("came from", "70%-shi", "kommen")],
      lead: x(
        "The figure has a history. It began as a cautious estimate about one kind of change and ended up as a rule about all of them.",
        "Shifra ka një histori. Nisi si vlerësim i kujdesshëm për një lloj ndryshimi dhe përfundoi si rregull për të gjitha.",
        "Die Zahl hat eine Geschichte. Sie begann als vorsichtige Schätzung zu einer Art von Wandel und endete als Regel für jeden."),
      blocks: [
        { type: "timeline", items: [
          { k: "1993", t: x("Hammer and Champy, Reengineering the Corporation: an “unscientific estimate” that up to 50–70% of organisations that start reengineering miss the dramatic results they intended.", "Hammer dhe Champy, Reengineering the Corporation: një “vlerësim joshkencor” se deri në 50–70% e organizatave që nisin riinxhinierimin nuk arrijnë rezultatet dramatike që synojnë.", "Hammer und Champy, Reengineering the Corporation: eine „unwissenschaftliche Schätzung“, dass bis zu 50–70 % der Organisationen, die ein Reengineering beginnen, die angestrebten dramatischen Ergebnisse verfehlen.") },
          { k: "1995", t: x("Kotter, in Harvard Business Review, after following more than 100 companies: a few very successful, a few utter failures, most in between. No overall rate.", "Kotter-i, në Harvard Business Review, pasi ndoqi mbi 100 kompani: disa shumë të suksesshme, disa dështime të plota, shumica diku në mes. Asnjë shkallë e përgjithshme.", "Kotter in der Harvard Business Review, nachdem er mehr als 100 Unternehmen begleitet hatte: wenige sehr erfolgreich, wenige völlig gescheitert, die meisten dazwischen. Keine Gesamtquote.") },
          { k: "2000", t: x("Beer and Nohria, in Harvard Business Review: about 70% of all change initiatives fail. No source is given.", "Beer dhe Nohria, në Harvard Business Review: rreth 70% e të gjitha nismave të ndryshimit dështojnë. Nuk jepet burim.", "Beer und Nohria in der Harvard Business Review: Etwa 70 % aller Veränderungsinitiativen scheitern. Eine Quelle wird nicht genannt.") },
          { k: "2011", t: x("Mark Hughes, Journal of Change Management: no valid and reliable empirical evidence supports the figure.", "Mark Hughes, Journal of Change Management: asnjë provë empirike e vlefshme dhe e besueshme nuk e mbështet shifrën.", "Mark Hughes, Journal of Change Management: Kein stichhaltiger, verlässlicher empirischer Beleg stützt die Zahl.") },
        ] },
        { type: "p", text: x(
          "Missing the dramatic results intended is not the same as failing, and reengineering is only one kind of change. Between 1993 and 2000 both distinctions were lost.",
          "Të mos arrish rezultatet dramatike që synon nuk është njësoj si të dështosh, dhe riinxhinierimi është vetëm një lloj ndryshimi. Mes 1993 dhe 2000 humbën të dyja këto dallime.",
          "Die angestrebten dramatischen Ergebnisse zu verfehlen ist nicht dasselbe wie Scheitern, und Reengineering ist nur eine Art von Wandel. Zwischen 1993 und 2000 gingen beide Unterscheidungen verloren.") },
        { type: "callout", reading: true, text: x(
          "The 70% says more about how management ideas travel than about change. When someone quotes it, ask: failed at what, and measured how?",
          "70%-shi tregon më shumë si qarkullojnë idetë e menaxhimit sesa si shkon ndryshimi. Kur dikush e citon, pyet: dështoi në çfarë, dhe si u mat?",
          "Die 70 % verraten mehr darüber, wie Managementideen wandern, als über Wandel. Wenn jemand sie zitiert, fragen Sie: woran gescheitert, und wie gemessen?") },
      ],
      source: ["hammer-champy-1993", "kotter-1995", "beer-nohria-2000", "hughes-2011"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("What executives", "Çfarë raportojnë", "Was Führungskräfte"), x("report", "drejtuesit", "berichten")],
      lead: x(
        "For years McKinsey has asked executives how their transformations went. The answers are their own assessments, and each survey defines success in its own way.",
        "Prej vitesh, McKinsey i pyet drejtuesit si shkuan transformimet e tyre. Përgjigjet janë vlerësimet e tyre, dhe çdo anketë e përkufizon suksesin në mënyrën e vet.",
        "Seit Jahren fragt McKinsey Führungskräfte, wie ihre Transformationen verlaufen sind. Die Antworten sind eigene Einschätzungen, und jede Umfrage definiert Erfolg auf ihre Weise."),
      blocks: [
        { type: "hbars", max: 40, source: ["mckinsey-transformation-2021"],
          label: x("Where the lost value of a transformation goes, as respondents estimate it (2021)", "Ku humbet vlera e një transformimi, sipas vlerësimit të të anketuarve (2021)", "Wo bei einer Transformation Wert verloren geht, nach Schätzung der Befragten (2021)"),
          items: [
            { k: x("Setting targets", "Vendosja e objektivave", "Zielsetzung"), v: 22, n: pc(22) },
            { k: x("Planning", "Planifikimi", "Planung"), v: 23, n: pc(23) },
            { k: x("Implementation", "Zbatimi", "Umsetzung"), v: 35, n: pc(35), alert: true },
            { k: x("After implementation", "Pas zbatimit", "Nach der Umsetzung"), v: 20, n: pc(20), alert: true },
          ] },
        { type: "figures", compact: true, items: [
          { n: pc(26), t: x("said their transformation improved performance and kept the gains (2015; 20% in 2012)", "thanë se transformimi i përmirësoi rezultatet dhe i ruajti arritjet (2015; 20% në vitin 2012)", "gaben an, ihre Transformation habe die Leistung verbessert und das Erreichte gehalten (2015; 20 % im Jahr 2012)") },
          { n: pc(79), t: x("said so among those who followed a rigorous approach and completed every action", "thanë të njëjtën gjë mes atyre që ndoqën një qasje rigoroze dhe i përfunduan të gjitha veprimet", "sagten dies unter denen, die streng vorgingen und jede Maßnahme abschlossen") },
        ] },
        { type: "callout", reading: true, text: x(
          "More than half of the lost value goes during and after implementation. Plan the time and the people for that stretch before you set the launch date.",
          "Më shumë se gjysma e vlerës së humbur shkon gjatë dhe pas zbatimit. Koha dhe njerëzit për atë pjesë duhen planifikuar para se të caktosh datën e nisjes.",
          "Mehr als die Hälfte des Wertverlusts entsteht während und nach der Umsetzung. Planen Sie Zeit und Leute für diese Strecke ein, bevor Sie den Starttermin festlegen.") },
      ],
      note: x(
        "These are executives' own assessments rather than measured results, and we have not seen the sample sizes.",
        "Këto janë vlerësime të vetë drejtuesve, jo rezultate të matura, dhe madhësitë e mostrave nuk i kemi parë.",
        "Es handelt sich um eigene Einschätzungen der Führungskräfte, nicht um gemessene Ergebnisse; die Stichprobengrößen haben wir nicht gesehen."),
      source: ["mckinsey-transformation-2021", "mckinsey-transformation-2015"],
    },
    {
      id: "model", more: "the-first-30-days",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Eight", "Tetë", "Acht"), x("errors", "gabimet", "Fehler")],
      lead: x(
        "Kotter gave no failure rate. He described the errors he saw most often, in the order a change runs into them.",
        "Kotter-i nuk dha shkallë dështimi. Përshkroi gabimet që pa më shpesh, sipas radhës në të cilën i has një ndryshim.",
        "Kotter nannte keine Scheiterquote. Er beschrieb die Fehler, die er am häufigsten sah, in der Reihenfolge, in der ein Wandel auf sie trifft."),
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
            x("7 Victory declared too soon", "7 Fitorja shpallet para kohe", "7 Sieg zu früh verkündet"),
            x("8 Changes not anchored in the culture", "8 Ndryshimet nuk ngulen në kulturë", "8 Veränderungen nicht in der Kultur verankert"),
          ] },
        ] },
        { type: "p", text: x(
          "Well over half of the companies he followed failed at the first step. Urgency is enough, he wrote, when about 75% of the management is honestly convinced that business as usual is unacceptable. A review in 2012 found support for most of the steps one by one, but no formal test of the whole model.",
          "Shumë më tepër se gjysma e kompanive që ndoqi dështuan që në hapin e parë. Urgjenca mjafton, shkroi ai, kur rreth 75% e drejtuesve janë bindur sinqerisht se “biznesi si zakonisht” është i papranueshëm. Një rishikim i vitit 2012 gjeti mbështetje për shumicën e hapave veç e veç, por asnjë test formal të modelit të plotë.",
          "Weit mehr als die Hälfte der Unternehmen, die er begleitete, scheiterte schon am ersten Schritt. Die Dringlichkeit reiche, schrieb er, wenn etwa 75 % der Führung ehrlich davon überzeugt seien, dass „weiter wie bisher“ nicht akzeptabel ist. Eine Übersicht von 2012 fand Belege für die meisten Schritte einzeln, aber keinen formalen Test des ganzen Modells.") },
        { type: "callout", reading: true, text: x(
          "Kotter's list is a map of where change breaks, not a proof of how it succeeds. Read that way, it earns its place.",
          "Lista e Kotter-it është hartë e vendeve ku ndryshimi thyhet, jo provë se si ia del. E lexuar kështu, e meriton vendin e saj.",
          "Kotters Liste ist eine Karte der Stellen, an denen Wandel bricht, kein Beweis dafür, wie er gelingt. So gelesen, ist sie ihren Platz wert.") },
      ],
      source: ["kotter-1995", "appelbaum-2012"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("What opens people", "Çfarë i hap njerëzit", "Was Menschen für"), x("to change", "ndaj ndryshimit", "Wandel öffnet")],
      lead: x(
        "Connie Wanberg and Joseph Banas followed 130 US public-housing staff through a large reorganisation of their sector and asked who stayed open to the changes.",
        "Connie Wanberg dhe Joseph Banas ndoqën 130 punonjës të strehimit publik në SHBA gjatë një riorganizimi të madh të sektorit të tyre dhe pyetën kush mbeti i hapur ndaj ndryshimeve.",
        "Connie Wanberg und Joseph Banas begleiteten 130 Beschäftigte des US-Sozialwohnungswesens durch eine große Umstrukturierung ihrer Branche und fragten, wer für die Veränderungen offen blieb."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("Information", "Informacioni", "Information"), p: x("Those who were told about the changes were more open to them.", "Ata që u informuan për ndryshimet ishin më të hapur ndaj tyre.", "Wer über die Veränderungen informiert wurde, war offener für sie.") },
          { h: x("Confidence", "Besimi", "Zutrauen"), p: x("Those who felt able to cope with the changes were more open.", "Ata që ndiheshin të aftë t'i përballonin ndryshimet ishin më të hapur.", "Wer sich zutraute, mit den Veränderungen fertigzuwerden, war offener.") },
          { h: x("A say", "Zëri", "Mitsprache"), p: x("Those who took part in decisions about the changes were more open.", "Ata që morën pjesë në vendimet për ndryshimet ishin më të hapur.", "Wer an den Entscheidungen über die Veränderungen beteiligt war, war offener.") },
        ] },
        { type: "p", text: x(
          "Lower acceptance went with less job satisfaction, more irritation and a stronger intention to leave. In McKinsey's 2015 survey, continuous-improvement activities went with roughly twice the odds that results lasted.",
          "Pranimi më i ulët shkoi bashkë me më pak kënaqësi në punë, më shumë acarim dhe një synim më të fortë për t'u larguar. Në anketën e McKinsey-t të vitit 2015, aktivitetet e përmirësimit të vazhdueshëm u lidhën me afërsisht dyfishin e gjasave që rezultatet të mbaheshin.",
          "Geringere Akzeptanz ging mit weniger Arbeitszufriedenheit, mehr Gereiztheit und einer stärkeren Kündigungsabsicht einher. In McKinseys Umfrage von 2015 gingen Aktivitäten der kontinuierlichen Verbesserung mit etwa doppelt so hohen Chancen einher, dass die Ergebnisse hielten.") },
        { type: "callout", reading: true, text: x(
          "A change lasts in the people who carry it. Information, confidence and a say cost little next to a change that has to be made twice.",
          "Një ndryshim zgjat te njerëzit që e mbajnë mbi supe. Informacioni, besimi dhe një fjalë në vendime kushtojnë pak përballë një ndryshimi që duhet bërë dy herë.",
          "Ein Wandel hält in den Menschen, die ihn tragen. Information, Zutrauen und Mitsprache kosten wenig im Vergleich zu einem Wandel, der zweimal angegangen werden muss.") },
      ],
      note: x(
        "130 people and questionnaires; McKinsey's figures are self-reports, and we have not seen their sample sizes.",
        "130 veta dhe pyetësorë; shifrat e McKinsey-t janë vetëvlerësime, dhe mostrat e tyre nuk i kemi parë.",
        "130 Befragte und Fragebögen; McKinseys Zahlen sind Selbstauskünfte, ihre Stichproben haben wir nicht gesehen."),
      source: ["wanberg-banas-2000", "mckinsey-transformation-2015"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie es gemessen wird"),
      title: [x("Measure after", "Mate pas", "Nach dem Projekt"), x("the project", "projektit", "messen")],
      lead: x(
        "A change is usually measured when the project closes. Whether it lasted shows later, when nobody is watching any more.",
        "Një ndryshim zakonisht matet kur mbyllet projekti. Nëse zgjati, kjo duket më vonë, kur s'e shikon më askush.",
        "Ein Wandel wird meist gemessen, wenn das Projekt endet. Ob er hält, zeigt sich später, wenn niemand mehr hinschaut."),
      blocks: [
        { type: "steps", items: [
          { h: x("Name the result and the date", "Emërto rezultatin dhe datën", "Ergebnis und Datum benennen"), p: x("One number the change should move, and by when.", "Një numër që ndryshimi duhet ta lëvizë, dhe deri kur.", "Eine Zahl, die der Wandel bewegen soll, und bis wann.") },
          { h: x("Measure before", "Mat para", "Vorher messen"), p: x("Four weeks of the old way, so the starting point is known.", "Katër javë me mënyrën e vjetër, që të dihet pika e nisjes.", "Vier Wochen der alten Arbeitsweise, damit der Ausgangspunkt bekannt ist.") },
          { h: x("Measure at the end", "Mat në fund", "Am Ende messen"), p: x("On the day the project closes.", "Ditën kur mbyllet projekti.", "Am Tag, an dem das Projekt endet.") },
          { h: x("Measure again at 3, 6 and 12 months", "Mat sërish pas 3, 6 dhe 12 muajsh", "Nach 3, 6 und 12 Monaten erneut messen"), p: x("Until a change takes root, Kotter warned, it can slide back.", "Derisa një ndryshim të zërë rrënjë, paralajmëroi Kotter-i, mund të rrëshqasë pas.", "Bis ein Wandel Wurzeln schlägt, warnte Kotter, könne er zurückrutschen.") },
        ] },
        { type: "example", label: x("Hypothetical example, a new handover routine", "Shembull hipotetik, një rutinë e re dorëzimi", "Hypothetisches Beispiel, eine neue Übergaberoutine"), rows: [
          { k: x("Before", "Para", "Vorher"), v: x("6 of 10 handovers complete", "6 nga 10 dorëzime të plota", "6 von 10 Übergaben vollständig") },
          { k: x("Project end", "Fundi i projektit", "Projektende"), v: x("9 of 10", "9 nga 10", "9 von 10") },
          { k: x("3 months", "3 muaj", "3 Monate"), v: x("9 of 10", "9 nga 10", "9 von 10") },
          { k: x("6 months", "6 muaj", "6 Monate"), v: x("7 of 10", "7 nga 10", "7 von 10") },
        ], text: x("The slide at six months is the signal to act again. The numbers are made up.", "Rënia pas gjashtë muajsh është sinjali për të vepruar sërish. Numrat janë të sajuar.", "Der Rückgang nach sechs Monaten ist das Signal, erneut einzugreifen. Die Zahlen sind erfunden.") },
      ],
      note: x("Steps and example by the editors.", "Hapat dhe shembulli nga redaksia.", "Schritte und Beispiel von der Redaktion."),
      source: ["kotter-1995"],
    },
    {
      id: "tool",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The change", "Karta e", "Die Veränderungs-"), x("card", "ndryshimit", "karte")],
      lead: x(
        "One card for one change. Fill it in before the change starts, and look at it again on each check date.",
        "Një kartë për një ndryshim. Plotësoje para se të nisë ndryshimi, dhe rishikoje në çdo datë kontrolli.",
        "Eine Karte für einen Wandel. Füllen Sie sie vor dem Start aus und sehen Sie sie an jedem Prüftermin wieder an."),
      blocks: [
        { type: "form", items: [
          { h: x("What changes", "Çfarë ndryshon", "Was sich ändert"), hint: x("in one sentence, and the number that should move", "në një fjali, dhe numri që duhet të lëvizë", "in einem Satz, und die Zahl, die sich bewegen soll") },
          { h: x("Why now", "Pse tani", "Warum jetzt"), hint: x("what happens if nothing changes", "çfarë ndodh nëse nuk ndryshon asgjë", "was passiert, wenn sich nichts ändert") },
          { h: x("Who leads", "Kush drejton", "Wer führt"), hint: x("the people who carry it, and who decides", "njerëzit që e mbajnë, dhe kush vendos", "die Menschen, die ihn tragen, und wer entscheidet") },
          { h: x("What people need", "Çfarë u duhet njerëzve", "Was die Menschen brauchen"), hint: x("information, the confidence to cope, a say in decisions", "informacion, besim se do t'ia dalin, një fjalë në vendime", "Information, das Zutrauen, es zu schaffen, Mitsprache bei Entscheidungen"), lines: 2 },
          { h: x("First win", "Fitorja e parë", "Erster Erfolg"), hint: x("something visible within weeks", "diçka që duket brenda disa javësh", "etwas Sichtbares innerhalb weniger Wochen") },
          { h: x("Check dates", "Datat e kontrollit", "Prüftermine"), hint: x("project end, then 3, 6 and 12 months", "fundi i projektit, pastaj 3, 6 dhe 12 muaj", "Projektende, dann 3, 6 und 12 Monate") },
        ] },
      ],
      note: x(
        "Proposed by the editors, after Kotter's eight errors and the findings of Wanberg and Banas.",
        "Propozim i redaksisë, sipas tetë gabimeve të Kotter-it dhe gjetjeve të Wanberg-ut dhe Banas-it.",
        "Ein Vorschlag der Redaktion, angelehnt an Kotters acht Fehler und die Befunde von Wanberg und Banas."),
      source: ["kotter-1995", "wanberg-banas-2000"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
