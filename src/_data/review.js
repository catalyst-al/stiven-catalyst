// Management Review, October 2026 (online on 4 October; dated September 2026 until 27 October): a one-off edition
// of Stiven Catalyst on the manager in the age of AI, in English, Albanian and German. scripts/review.mjs prints it
// (src/guide-print/review.njk) and turns the PDF into the
// pages of the reader (src/_includes/pages/review.njk).
//
// Every figure was checked against its source (docs/revista/management-review-2026-09.md). Each string is written
// once in the three languages, x(en, sq, de), and resolved per language at the end of the file.
const x = (en, sq, de) => ({ en, sq, de });
const pc = (n) => x(`${n}%`, `${n}%`, `${n} %`);

const slug = "management-review-2026-09";

const sources = [
  { id: "microsoft", title: "2026 Work Trend Index: Agents, human agency, and the opportunity for every organization", by: "Microsoft WorkLab", url: "https://www.microsoft.com/en-us/worklab/work-trend-index/agents-human-agency-and-the-opportunity-for-every-organization" },
  { id: "deloitte", title: "2026 Global Human Capital Trends", by: "Deloitte", url: "https://www.deloitte.com/us/en/insights/topics/talent/human-capital-trends.html" },
  { id: "pwc", title: "2026 Global AI Jobs Barometer", by: "PwC", url: "https://www.pwc.com/gx/en/issues/artificial-intelligence/job-barometer/2026.html" },
  { id: "sogw", title: "State of the Global Workplace 2026", by: "Gallup", url: "https://www.gallup.com/workplace/349484/state-of-the-global-workplace.aspx" },
  { id: "frontline", title: "When Good Frontline Workers Make Bad Supervisors", by: "Gallup, 2026", url: "https://www.gallup.com/workplace/700163/when-good-frontline-workers-make-bad-supervisors.aspx" },
  { id: "span", title: "Span of Control: What's the Optimal Team Size for Managers?", by: "Gallup, 2026", url: "https://www.gallup.com/workplace/700718/span-control-optimal-team-size-managers.aspx" },
  { id: "owl", title: "State of Hybrid Work 2026", by: "Owl Labs", url: "https://resources.owllabs.com/blog/2026-state-of-hybrid-work" },
];
const sourceLine = (...ids) => ids.map((id) => {
  const s = sources.find((item) => item.id === id);
  return `${s.by.replace(", 2026", "")}, ${s.title}`;
}).join("; ");

const parts = [
  null,
  x("The big picture", "Pamja e përgjithshme", "Der Überblick"),
  x("Managers under pressure", "Menaxherët nën presion", "Führungskräfte unter Druck"),
  x("Practice", "Praktika", "Praxis"),
];

const pages = [
  { id: "cover", type: "cover" },
  { id: "editor", type: "editor" },
  { id: "contents", type: "contents" },

  // Part I. The big picture
  {
    id: "ai", part: 1, image: { src: `/media/magazine/${slug}/art/manager.jpg`, width: 495, height: 550 },
    kicker: x("Cover story", "Tema kryesore", "Titelthema"),
    title: [x("The manager", "Menaxheri", "Die Führungskraft"), x("in the age of AI", "në epokën e AI-së", "im Zeitalter der KI")],
    lead: x("How work is being redesigned, and what leaders must keep human.", "Si po riorganizohet puna dhe çfarë duhet ta ruajnë drejtuesit si punë të njeriut.", "Wie Arbeit neu gestaltet wird und was Führung menschlich halten muss."),
    blocks: [
      { type: "p", text: x(
        "AI is changing the tools we work with, and with them how work is divided, how results are measured and how decisions are made. The new manager asks two questions: what can be automated, and what must stay human.",
        "AI po ndryshon mjetet me të cilat punojmë, e bashkë me to mënyrën si ndahet puna, si maten rezultatet dhe si merren vendimet. Menaxheri i ri bën dy pyetje: çfarë mund të automatizohet dhe çfarë duhet të mbetet njerëzore.",
        "KI verändert die Werkzeuge, mit denen wir arbeiten, und mit ihnen, wie Arbeit verteilt, Ergebnisse gemessen und Entscheidungen getroffen werden. Die neue Führungskraft stellt zwei Fragen: Was lässt sich automatisieren, und was muss menschlich bleiben?") },
      { type: "cards", cols: 3, items: [
        { h: x("Automate tasks, not accountability", "Automatizo detyrat, jo përgjegjësinë", "Aufgaben automatisieren, nicht Verantwortung"),
          p: x("Let AI remove repetitive work, but keep people accountable for results, ethics and impact.", "Lëre AI-në të heqë punën që përsëritet, por mbaji njerëzit përgjegjës për rezultatet, etikën dhe ndikimin.", "Überlassen Sie KI die wiederkehrende Arbeit. Für Ergebnisse, Ethik und Wirkung bleiben Menschen verantwortlich.") },
        { h: x("Redesign how work flows", "Riorganizo rrjedhën e punës", "Den Arbeitsfluss neu gestalten"),
          p: x("Rethink how work moves between people, AI and processes. A new task list is not enough.", "Rimendo si kalon puna mes njerëzve, AI-së dhe proceseve. Një listë e re detyrash nuk mjafton.", "Denken Sie neu, wie Arbeit zwischen Menschen, KI und Prozessen läuft. Eine neue Aufgabenliste reicht nicht.") },
        { h: x("Keep judgment, trust and context human", "Gjykimi, besimi dhe konteksti mbeten te njeriu", "Urteil, Vertrauen und Kontext menschlich halten"),
          p: x("Use AI for speed and scale, but keep judgment, trust and context in the hard decisions.", "Përdore AI-në për shpejtësi dhe shtrirje, por ruaj gjykimin, besimin dhe kontekstin në vendimet e vështira.", "Nutzen Sie KI für Tempo und Skalierung, aber bewahren Sie Urteil, Vertrauen und Kontext bei schwierigen Entscheidungen.") },
      ] },
      { type: "quote", text: x("A great manager designs the boundary between human judgment and machine speed.", "Një menaxher i mirë e përcakton vetë kufirin mes gjykimit njerëzor dhe shpejtësisë së makinës.", "Eine gute Führungskraft gestaltet die Grenze zwischen menschlichem Urteil und maschinellem Tempo.") },
    ],
  },
  {
    id: "trends", part: 1,
    kicker: x("Trends", "Trendet", "Trends"),
    title: [x("Management", "Trendet e menaxhimit", "Management-"), x("trends 2026", "2026", "Trends 2026")],
    lead: x("Five movements shaping the manager's work.", "Pesë lëvizje që po formësojnë punën e menaxherit.", "Fünf Bewegungen, die die Arbeit von Führungskräften prägen."),
    blocks: [
      { type: "rows", items: [
        { h: x("Agentic AI enters workflows", "AI me agjentë hyn në rrjedhat e punës", "Agentische KI zieht in Abläufe ein"),
          p: x("AI is moving from individual help to running multi-step workflows.", "AI po kalon nga ndihma për individin te kryerja e rrjedhave të punës me disa hapa.", "KI entwickelt sich von der Hilfe für Einzelne zur Ausführung mehrstufiger Abläufe.") },
        { h: x("Middle management is being redefined", "Menaxhimi i mesëm po ripërkufizohet", "Das mittlere Management wird neu definiert"),
          p: x("The role is shifting from administrative coordination to judgment, coaching and prioritisation.", "Roli po zhvendoset nga koordinimi administrativ te gjykimi, mentorimi dhe prioritizimi.", "Die Rolle verschiebt sich von administrativer Koordination zu Urteil, Coaching und Priorisierung.") },
        { h: x("Skills beat job descriptions", "Aftësitë para përshkrimeve të punës", "Fähigkeiten zählen mehr als Stellenbeschreibungen"),
          p: x("Companies look for adaptability and transferable skills, not only titles.", "Kompanitë po kërkojnë përshtatshmëri dhe aftësi të transferueshme, jo vetëm tituj.", "Unternehmen suchen Anpassungsfähigkeit und übertragbare Fähigkeiten, nicht nur Titel.") },
        { h: x("Productivity pressure is rising", "Presioni për produktivitet po rritet", "Der Produktivitätsdruck steigt"),
          p: x("More data and more visibility raise the pressure on managers.", "Më shumë të dhëna dhe më shumë dukshmëri rrisin presionin mbi menaxherët.", "Mehr Daten und mehr Sichtbarkeit erhöhen den Druck auf Führungskräfte.") },
        { h: x("Culture becomes an AI issue", "Kultura bëhet çështje e AI-së", "Kultur wird zur KI-Frage"),
          p: x("How people work together is becoming part of the return on AI.", "Mënyra si njerëzit bashkëpunojnë po bëhet pjesë e kthimit nga investimi në AI.", "Wie Menschen zusammenarbeiten, wird Teil der Rendite von KI.") },
      ] },
      { type: "box", title: x("What should a leader do?", "Çfarë duhet të bëjë një drejtues?", "Was sollte eine Führungskraft tun?"), items: [
        x("Clarify how decisions are made.", "Qartëso si merren vendimet.", "Klären Sie, wie Entscheidungen fallen."),
        x("Turn trends into work standards.", "Ktheji prirjet në standarde pune.", "Übersetzen Sie Trends in Arbeitsstandards."),
        x("Watch the impact on people, not only the output.", "Shiko ndikimin te njerëzit, jo vetëm rezultatin.", "Achten Sie auf die Wirkung auf Menschen, nicht nur auf die Ergebnisse."),
      ] },
    ],
    note: x("Editorial synthesis of the sources in this edition.", "Sintezë e redaksisë nga burimet e këtij botimi.", "Redaktionelle Synthese aus den Quellen dieser Ausgabe."),
  },
  {
    id: "models", part: 1,
    kicker: x("Work design", "Organizimi i punës", "Arbeitsgestaltung"),
    title: [x("Operating models", "Modeli operativ", "Betriebsmodelle"), x("over prompts", "para udhëzimeve për AI-në", "vor Prompts")],
    lead: x("Why management changes through how work is organised more than through prompts.", "Pse menaxhimin e ndryshon më shumë mënyra si organizohet puna sesa udhëzimet që i japim AI-së.", "Warum sich Management stärker durch die Organisation der Arbeit verändert als durch Prompts."),
    blocks: [
      { type: "p", text: x(
        "AI can speed up a task. The real value appears when the organisation reviews the process, the decision-making, the standards and how the result is repeated.",
        "AI mund ta rrisë shpejtësinë e një detyre. Vlera e vërtetë shfaqet kur organizata rishikon procesin, vendimmarrjen, standardet dhe mënyrën si përsëritet rezultati.",
        "KI kann eine Aufgabe beschleunigen. Der eigentliche Wert entsteht, wenn die Organisation Prozess, Entscheidungswege, Standards und die Wiederholbarkeit des Ergebnisses überprüft.") },
      { type: "cards", cols: 2, items: [
        { h: x("From personal productivity to process redesign", "Nga produktiviteti personal te riprojektimi i procesit", "Von persönlicher Produktivität zum Prozessdesign"),
          p: x("From individual time saved to a simpler core process.", "Nga fitimi individual i kohës te thjeshtimi i procesit kryesor.", "Von individueller Zeitersparnis zu einem einfacheren Kernprozess.") },
        { h: x("From faster output to clearer decision rights", "Nga rezultati më i shpejtë te qartësia se kush vendos", "Von schnelleren Ergebnissen zu klaren Entscheidungsrechten"),
          p: x("Speed is not enough. It must be clear who decides, when and on what basis.", "Shpejtësia nuk mjafton. Duhet të jetë e qartë kush vendos, kur dhe mbi çfarë baze.", "Tempo reicht nicht. Es muss klar sein, wer entscheidet, wann und auf welcher Grundlage.") },
        { h: x("From isolated use to team-wide standards", "Nga përdorimi i veçuar te standardet e ekipit", "Von Einzelnutzung zu Teamstandards"),
          p: x("Value grows when individual use becomes a shared way of working.", "Vlera rritet kur përdorimi individual kthehet në mënyrë pune të përbashkët.", "Der Wert wächst, wenn Einzelnutzung zu einer gemeinsamen Arbeitsweise wird.") },
        { h: x("From experimentation to repeatable workflow", "Nga eksperimentimi te rrjedha e përsëritshme", "Vom Experiment zum wiederholbaren Ablauf"),
          p: x("From scattered trials to processes that are measurable, repeatable and stable.", "Nga prova të shpërndara te procese të matshme, të përsëritshme dhe të qëndrueshme.", "Von verstreuten Versuchen zu messbaren, wiederholbaren und stabilen Prozessen.") },
      ] },
      { type: "callout", label: x("The key question", "Pyetja kyçe", "Die Schlüsselfrage"),
        text: x("Beyond what AI can do: how does the way the team works change?", "Përtej asaj që mund të bëjë AI: si ndryshon mënyra si punon ekipi?", "Über das hinaus, was KI kann: Wie verändert sich die Arbeitsweise des Teams?") },
    ],
  },
  {
    id: "numbers", part: 1,
    kicker: x("At a glance", "Me një shikim", "Auf einen Blick"),
    title: [x("The", "Shifrat", "Die"), x("numbers", "e botimit", "Zahlen")],
    lead: x("The figures behind this edition, each with its source.", "Shifrat që e mbajnë në këmbë këtë botim, secila me burimin e vet.", "Die Zahlen hinter dieser Ausgabe, jede mit ihrer Quelle."),
    blocks: [
      { type: "stats", cols: 2, items: [
        { n: pc(66), t: x("of AI users say AI gives them more time for high-value work.", "e përdoruesve të AI-së thonë se AI u jep më shumë kohë për punë me vlerë të lartë.", "der KI-Nutzenden sagen, dass KI ihnen mehr Zeit für wertvolle Arbeit gibt."), by: "Microsoft" },
        { n: pc(58), t: x("say AI helps them produce work they could not have done a year ago.", "thonë se AI i ndihmon të bëjnë punë që nuk mund ta bënin një vit më parë.", "sagen, dass sie mit KI Arbeit leisten, die vor einem Jahr nicht möglich war."), by: "Microsoft" },
        { n: pc(40), t: x("higher productivity growth, 2018–2025, in companies of the most AI-exposed sectors: 34% against 24%.", "rritje më e lartë e produktivitetit, 2018–2025, te kompanitë e sektorëve më të ekspozuar ndaj AI-së: 34% kundrejt 24%.", "höheres Produktivitätswachstum 2018–2025 bei Unternehmen der am stärksten KI-exponierten Branchen: 34 % gegenüber 24 %."), by: "PwC" },
        { n: pc(85), t: x("of leaders say building adaptability is critical.", "e drejtuesve thonë se ndërtimi i përshtatshmërisë është kritik.", "der Führungskräfte halten den Aufbau von Anpassungsfähigkeit für entscheidend."), by: "Deloitte" },
        { n: pc(7), t: x("say they are leading in helping their workforce grow and adapt.", "thonë se prijnë kur vjen puna te ndihma për njerëzit e tyre, që të rriten dhe të përshtaten.", "sehen sich als führend darin, ihre Belegschaft beim Wachsen und Anpassen zu unterstützen."), by: "Deloitte" },
        { n: pc(65), t: x("of organisations believe their culture needs significant change because of AI.", "e organizatave besojnë se kultura e tyre duhet të ndryshojë ndjeshëm për shkak të AI-së.", "der Organisationen glauben, dass sich ihre Kultur wegen KI deutlich ändern muss."), by: "Deloitte" },
      ] },
      { type: "callout", label: x("For the manager", "Për menaxherin", "Für die Führungskraft"),
        text: x("AI is bringing change either way. What matters is whether the organisation turns that change into a standard.", "AI po sjell ndryshim gjithsesi. Ajo që ka rëndësi është nëse organizata e kthen këtë ndryshim në standard.", "KI bringt so oder so Veränderung. Entscheidend ist, ob die Organisation daraus einen Standard macht.") },
    ],
    source: sourceLine("microsoft", "pwc", "deloitte"),
  },
  {
    id: "human", part: 1,
    kicker: x("Human × machine", "Njeriu × makina", "Mensch × Maschine"),
    title: [x("Who decides", "Kush vendos", "Wer entscheidet"), x("what?", "çfarë?", "was?")],
    lead: x("Handing work to AI blindly is easy. A good manager first draws the line between machine speed and human judgment.", "E lehtë është t'ia lësh punën AI-së verbërisht. Menaxheri i mirë e heq që më parë vijën mes shpejtësisë së makinës dhe gjykimit njerëzor.", "Arbeit blind an KI abzugeben ist leicht. Eine gute Führungskraft zieht zuerst die Grenze zwischen maschinellem Tempo und menschlichem Urteil."),
    blocks: [
      { type: "lists", cols: [
        { h: x("Best for AI", "Më e mira për AI-në", "Am besten für KI"), items: [
          x("Summarising large volumes of information", "Përmbledhja e sasive të mëdha të informacionit", "Große Informationsmengen zusammenfassen"),
          x("First drafts and documentation", "Skicat e para dhe dokumentimi", "Erste Entwürfe und Dokumentation"),
          x("Pattern spotting", "Gjetja e modeleve", "Muster erkennen"),
          x("Anomaly alerts", "Sinjalizimi i anomalive", "Hinweise auf Anomalien"),
          x("Scenario generation", "Krijimi i skenarëve", "Szenarien entwickeln"),
        ] },
        { h: x("Must stay human", "Duhet të mbetet njerëzore", "Muss menschlich bleiben"), accent: true, items: [
          x("Setting priorities", "Vendosja e prioriteteve", "Prioritäten setzen"),
          x("Coaching people", "Mentorimi i njerëzve", "Menschen coachen"),
          x("Judgment under ambiguity", "Gjykimi kur gjërat janë të paqarta", "Urteil bei Unklarheit"),
          x("Ethical trade-offs", "Zgjedhjet etike", "Ethische Abwägungen"),
          x("Exception handling", "Trajtimi i përjashtimeve", "Umgang mit Ausnahmen"),
        ] },
      ] },
      { type: "stat", n: pc(16), t: x(
        "of AI users in Microsoft's research are “Frontier Professionals”: they use agents for multi-step work, redesign how they work and share AI standards with their teams.",
        "e përdoruesve të AI-së në kërkimin e Microsoft-it janë “Frontier Professionals”: përdorin agjentë për punë me disa hapa, riorganizojnë mënyrën si punojnë dhe ndajnë standarde të AI-së me ekipin.",
        "der KI-Nutzenden in der Microsoft-Studie sind „Frontier Professionals“: Sie nutzen Agenten für mehrstufige Arbeit, gestalten ihre Arbeitsweise neu und teilen KI-Standards mit ihren Teams.") },
      { type: "callout", label: x("A question for the manager", "Pyetja për menaxherin", "Eine Frage an die Führungskraft"),
        text: x("Are we using AI to remove low-value work, or to remove the thinking too?", "Po e përdorim AI-në për të hequr punën me vlerë të ulët, apo po e përdorim për të hequr edhe mendimin?", "Nutzen wir KI, um Arbeit mit geringem Wert abzubauen, oder auch das Denken?") },
      { type: "quote", text: x("The manager's job is to decide who decides.", "Puna e menaxherit është të vendosë kush vendos.", "Die Aufgabe der Führungskraft ist zu entscheiden, wer entscheidet.") },
    ],
    source: sourceLine("microsoft"),
  },
  {
    id: "roi", part: 1,
    kicker: x("Work design", "Organizimi i punës", "Arbeitsgestaltung"),
    title: [x("The return on AI", "Fitimi nga AI", "Die Rendite von KI"), x("depends on how work is designed.", "varet nga mënyra si organizohet puna.", "hängt an der Arbeitsgestaltung.")],
    lead: x("Technology arrives fast. The rules for how people and machines work together often lag behind.", "Teknologjia futet shpejt. Rregullat e bashkëpunimit mes njeriut dhe makinës shpesh mbeten pas.", "Technologie kommt schnell. Die Regeln für die Zusammenarbeit von Mensch und Maschine hinken oft hinterher."),
    blocks: [
      { type: "stats", cols: 2, items: [
        { n: pc(6), t: x("of leaders say they are making progress in designing how people and AI work together.", "e drejtuesve thonë se po bëjnë përparim në organizimin e bashkëpunimit mes njerëzve dhe AI-së.", "der Führungskräfte sehen Fortschritte bei der Gestaltung der Zusammenarbeit von Mensch und KI.") },
        { n: pc(60), t: x("of leaders use AI to support decisions, yet only 5% say they manage AI-based decisions well.", "e drejtuesve përdorin AI për të mbështetur vendimet, por vetëm 5% thonë se i menaxhojnë mirë vendimet e bazuara në AI.", "der Führungskräfte nutzen KI für Entscheidungen, aber nur 5 % sagen, dass sie KI-gestützte Entscheidungen gut steuern.") },
      ] },
      { type: "cards", cols: 2, plain: true, items: [
        { h: x("Role", "Roli", "Rolle"), p: x("Who does what?", "Kush bën çfarë?", "Wer macht was?") },
        { h: x("Rights", "Të drejtat", "Rechte"), p: x("Who decides?", "Kush vendos?", "Wer entscheidet?") },
        { h: x("Checks", "Kontrolli", "Kontrolle"), p: x("Who verifies?", "Kush verifikon?", "Wer prüft?") },
        { h: x("Escalation", "Eskalimi", "Eskalation"), p: x("When is a person needed?", "Kur duhet njeriu?", "Wann braucht es einen Menschen?") },
      ] },
      { type: "callout", label: x("The operating model test", "Testi i modelit operativ", "Der Test für das Betriebsmodell"),
        text: x("If AI delivers output faster but nobody knows who decides, who checks and who is accountable, the organisation has gained speed and nothing more.", "Nëse AI jep rezultate më shpejt, por askush nuk e di kush vendos, kush kontrollon dhe kush mban përgjegjësinë, organizata ka fituar shpejtësi dhe asgjë më shumë.", "Wenn KI schneller Ergebnisse liefert, aber niemand weiß, wer entscheidet, wer prüft und wer verantwortlich ist, hat die Organisation an Tempo gewonnen, an sonst nichts.") },
    ],
    source: sourceLine("deloitte"),
  },
  {
    id: "skills", part: 1,
    kicker: x("AI and jobs", "AI dhe vendet e punës", "KI und Arbeit"),
    title: [x("Productivity rises.", "Produktiviteti rritet.", "Die Produktivität steigt."), x("Skills move faster.", "Aftësitë ndryshojnë më shpejt.", "Fähigkeiten ändern sich schneller.")],
    lead: x("AI is changing the output, and with it what roles are made of.", "AI po ndryshon rezultatet e punës, e bashkë me to edhe përmbajtjen e roleve.", "KI verändert die Ergebnisse der Arbeit und mit ihnen den Inhalt von Rollen."),
    blocks: [
      { type: "stats", cols: 2, items: [
        { n: pc(40), t: x("higher productivity growth from 2018 to 2025 in companies of the sectors most exposed to AI than in the least exposed: 34% against 24%.", "rritje më e lartë e produktivitetit nga 2018 deri në 2025 te kompanitë e sektorëve më të ekspozuar ndaj AI-së, krahasuar me më pak të ekspozuarit: 34% kundrejt 24%.", "höheres Produktivitätswachstum von 2018 bis 2025 bei Unternehmen der am stärksten KI-exponierten Branchen als bei den am wenigsten exponierten: 34 % gegenüber 24 %.") },
        { n: x("2×", "2×", "2×"), t: x("Skills in the most AI-exposed jobs are changing more than twice as fast.", "Aftësitë te punët më të ekspozuara ndaj AI-së po ndryshojnë më shumë se dy herë më shpejt.", "Die Fähigkeiten in den am stärksten KI-exponierten Jobs ändern sich mehr als doppelt so schnell.") },
        { n: x("7×", "7×", "7×"), t: x("In the US, AI-exposed junior roles are seven times more likely to ask for skills that used to be senior, such as leadership.", "Në SHBA, rolet fillestare të ekspozuara ndaj AI-së kanë shtatë herë më shumë gjasa të kërkojnë aftësi që dikur u kërkoheshin vetëm punonjësve me përvojë, si udhëheqja.", "In den USA verlangen KI-exponierte Einstiegsrollen siebenmal häufiger Fähigkeiten, die früher Senior-Rollen vorbehalten waren, etwa Führung.") },
        { n: x("2.5×", "2,5×", "2,5×"), t: x("The most AI-exposed jobs are adding tasks that rely on empathy, judgment and creativity 2.5 times faster.", "Punët më të ekspozuara ndaj AI-së po shtojnë 2,5 herë më shpejt detyra që mbështeten në empati, gjykim dhe kreativitet.", "In den am stärksten KI-exponierten Jobs kommen Aufgaben, die Empathie, Urteil und Kreativität brauchen, 2,5-mal schneller hinzu.") },
      ] },
      { type: "callout", label: x("What it means for managers", "Çfarë do të thotë për menaxherët", "Was das für Führungskräfte bedeutet"),
        text: x("When you take tasks out of a role, plan what the person learns next and which bigger responsibility they grow into.", "Kur heq detyra nga një rol, planifiko çfarë do të mësojë personi më pas dhe në cilën përgjegjësi më të madhe do të rritet.", "Wenn Sie Aufgaben aus einer Rolle herausnehmen, planen Sie, was die Person als Nächstes lernt und in welche größere Verantwortung sie hineinwächst.") },
    ],
    source: sourceLine("pwc"),
  },
  {
    id: "culture", part: 1,
    kicker: x("Culture", "Kultura", "Kultur"),
    title: [x("The 65%", "65% dhe", "65 % und der"), x("culture reset", "rinisja e kulturës", "Neustart der Kultur")],
    lead: x("Most organisations in Deloitte's study believe their culture needs to change significantly because of AI.", "Shumica e organizatave në studimin e Deloitte-it besojnë se kultura e tyre duhet të ndryshojë ndjeshëm për shkak të AI-së.", "Die meisten Organisationen in der Deloitte-Studie glauben, dass sich ihre Kultur wegen KI deutlich ändern muss."),
    blocks: [
      { type: "cards", cols: 2, plain: true, items: [
        { h: x("Trust", "Besimi", "Vertrauen"), p: x("Can the AI's output be challenged?", "A mund të vihet në dyshim rezultati i AI-së?", "Darf das Ergebnis der KI hinterfragt werden?") },
        { h: x("Transparency", "Transparenca", "Transparenz"), p: x("Does the team know when AI is being used?", "A e di ekipi kur po përdoret AI?", "Weiß das Team, wann KI im Einsatz ist?") },
        { h: x("Learning", "Të mësuarit", "Lernen"), p: x("Is there room to learn without shame?", "A ka hapësirë për të mësuar pa turp?", "Gibt es Raum, ohne Scham zu lernen?") },
        { h: x("Accountability", "Përgjegjshmëria", "Verantwortung"), p: x("Does responsibility stay clear?", "A mbetet përgjegjësia e qartë?", "Bleibt die Verantwortung klar?") },
      ] },
      { type: "callout", label: x("Where improvisation starts", "Ku nis improvizimi", "Wo Improvisation beginnt"),
        text: x("When technology changes faster than the team's norms, people start to improvise. That is where shadow AI, distrust and double standards are born.", "Kur teknologjia ndryshon më shpejt se normat e ekipit, njerëzit fillojnë të improvizojnë. Aty lindin përdorimi i AI-së pa dijeninë e askujt, mosbesimi dhe standardet e dyfishta.", "Wenn sich Technologie schneller ändert als die Normen des Teams, beginnen Menschen zu improvisieren. Dort entstehen Schatten-KI, Misstrauen und doppelte Standards.") },
    ],
    source: sourceLine("deloitte"),
  },

  // Part II. Managers under pressure
  {
    id: "squeeze", part: 2,
    kicker: x("People and performance", "Njerëzit dhe performanca", "Menschen und Leistung"),
    title: [x("The manager", "Angazhimi i menaxherëve", "Das Engagement der"), x("engagement squeeze", "nën presion", "Führungskräfte schrumpft")],
    lead: x("Managers used to have an engagement advantage. In 2025 it almost disappeared.", "Menaxherët dikur kishin një avantazh angazhimi. Më 2025 ky avantazh pothuajse u zhduk.", "Führungskräfte hatten früher einen Engagement-Vorsprung. 2025 ist er fast verschwunden."),
    blocks: [
      { type: "bars", label: x("Engaged managers worldwide", "Menaxherë të angazhuar në botë", "Engagierte Führungskräfte weltweit"), max: 35, items: [
        { k: "2022", v: 31, n: pc(31) }, { k: "2023", v: 30, n: pc(30) }, { k: "2024", v: 27, n: pc(27) }, { k: "2025", v: 22, n: pc(22), alert: true },
      ] },
      { type: "stats", cols: 2, items: [
        { n: pc(20), t: x("of employees worldwide were engaged in 2025.", "e punonjësve në botë ishin të angazhuar më 2025.", "der Beschäftigten weltweit waren 2025 engagiert.") },
        { n: pc(79), t: x("of managers were engaged in Gallup's best-practice organisations.", "e menaxherëve ishin të angazhuar në organizatat me praktikat më të mira sipas Gallup-it.", "der Führungskräfte waren in Gallups Best-Practice-Organisationen engagiert.") },
      ] },
      { type: "callout", label: x("Why it matters", "Pse ka rëndësi", "Warum das wichtig ist"),
        text: x("When the manager loses energy, so does the capacity for coaching, feedback, priorities and connection with the team. The operation feels it soon after.", "Kur menaxheri humbet energjinë, bie edhe kapaciteti për mentorim, reagime, prioritete dhe lidhje me ekipin. Pak më vonë e ndien edhe operacioni.", "Wenn die Führungskraft Energie verliert, sinkt auch die Kraft für Coaching, Rückmeldung, Prioritäten und die Verbindung zum Team. Kurz darauf spürt es auch der Betrieb.") },
    ],
    source: sourceLine("sogw"),
  },
  {
    id: "promotion", part: 2,
    kicker: x("Frontline management", "Menaxhimi në vijën e parë", "Erste Führungsebene"),
    title: [x("Promotion without", "Promovim pa", "Beförderung ohne"), x("preparation.", "përgatitje.", "Vorbereitung.")],
    lead: x("Being good at operational work does not automatically prepare you to lead people.", "Të jesh i mirë në punën operative nuk të përgatit automatikisht për të drejtuar njerëz.", "Wer operativ gut ist, ist nicht automatisch darauf vorbereitet, Menschen zu führen."),
    blocks: [
      { type: "split", label: x("US frontline supervisors and supervisor training", "Supervizorët e vijës së parë në SHBA dhe trajnimi për rolin", "Frontline-Vorgesetzte in den USA und Führungstraining"), items: [
        { v: 45, n: pc(45), t: x("trained in the past year", "të trajnuar në vitin e fundit", "im letzten Jahr geschult") },
        { v: 32, n: pc(32), t: x("trained, but not in the past year", "të trajnuar, por jo në vitin e fundit", "geschult, aber nicht im letzten Jahr") },
        { v: 23, n: pc(23), t: x("never trained", "asnjëherë të trajnuar", "nie geschult"), alert: true },
      ] },
      { type: "stats", cols: 3, label: x("Supervisors trained in the past year are", "Ata që u trajnuan në vitin e fundit kanë", "Bei Vorgesetzten, die im letzten Jahr geschult wurden, ist die Wahrscheinlichkeit"), items: [
        { n: pc(79), t: x("more likely to be engaged", "më shumë gjasa të jenë të angazhuar", "höher, dass sie engagiert sind") },
        { n: pc(19), t: x("less likely to feel burned out very often or always", "më pak gjasa të ndihen shumë shpesh ose gjithmonë të rraskapitur", "geringer, dass sie sich sehr oft oder immer ausgebrannt fühlen") },
        { n: pc(11), t: x("less likely to be actively looking or watching for a new job", "më pak gjasa të kërkojnë aktivisht një punë tjetër ose të jenë në pritje të një rasti", "geringer, dass sie aktiv eine neue Stelle suchen oder nach einer Ausschau halten") },
      ] },
      { type: "callout", label: x("One practical move", "Një hap praktik", "Ein praktischer Schritt"),
        text: x("Build onboarding for new managers that covers prioritising, feedback, coaching, delegation and escalation. Do not let them learn the role only by burning out in it.", "Ndërto për menaxherët e rinj një program hyrjeje në rol që mbulon prioritizimin, reagimet, mentorimin, delegimin dhe çuarjen e çështjeve lart. Mos i lër ta mësojnë rolin vetëm duke u rraskapitur.", "Bauen Sie für neue Führungskräfte eine Einarbeitung auf, die Priorisieren, Rückmeldung, Anleitung, Delegieren und Eskalieren abdeckt. Lassen Sie sie die Rolle nicht nur dadurch lernen, dass sie darin ausbrennen.") },
    ],
    source: sourceLine("frontline"),
  },
  {
    id: "span", part: 2,
    kicker: x("Span of control", "Shtrirja e kontrollit", "Führungsspanne"),
    title: [x("How many direct reports", "Sa vartës direkt", "Wie viele direkt Unterstellte"), x("are too many?", "janë shumë?", "sind zu viele?")],
    lead: x("There is no universal number. But there is a practical limit: how many people can you lead without losing coaching, feedback and clarity?", "Nuk ka një numër universal. Por ka një kufi praktik: sa njerëz mund të drejtosh pa humbur mentorimin, reagimet dhe qartësinë?", "Eine universelle Zahl gibt es nicht, wohl aber eine praktische Grenze: Wie viele Menschen können Sie führen, ohne dass Coaching, Rückmeldung und Klarheit verloren gehen?"),
    blocks: [
      { type: "table",
        big: { n: "5–6", t: x("median team size per manager", "mediana e ekipit për një menaxher", "Median der Teamgröße pro Führungskraft") },
        label: x("Manager engagement by team size", "Angazhimi i menaxherëve sipas madhësisë së ekipit", "Engagement der Führungskräfte nach Teamgröße"),
        head: [x("Direct reports", "Vartës", "Direkt Unterstellte"), x("Own work ≤ 40%", "Punë vetjake ≤ 40%", "Eigene Arbeit ≤ 40 %"), x("Own work > 40%", "Punë vetjake > 40%", "Eigene Arbeit > 40 %")],
        rows: [
          ["1–4", pc(37), pc(36)],
          ["5–9", pc(37), pc(35)],
          ["10–24", pc(37), pc(34)],
          ["25+", pc(37), pc(32)],
        ],
        note: x("“Own work”: the share of time the manager still spends on individual contributor work.", "“Punë vetjake”: pjesa e kohës që menaxheri ende harxhon për punë individuale, jo menaxhim.", "„Eigene Arbeit“: der Anteil der Zeit, den die Führungskraft noch mit eigener Facharbeit verbringt.") },
      { type: "callout", label: x("The player-coach problem", "Menaxheri që luan edhe vetë", "Das Spielertrainer-Problem"),
        text: x("97% of US managers in Gallup's study also carry individual work, at a median of 40% of their time. When that load stays high and the team grows, management weakens.", "97% e menaxherëve në SHBA në studimin e Gallup-it kanë edhe përgjegjësi individuale, me një medianë prej 40% të kohës. Kur kjo ngarkesë mbetet e lartë dhe ekipi rritet, menaxhimi dobësohet.", "97 % der US-Führungskräfte in Gallups Studie haben auch eigene Facharbeit, im Median 40 % ihrer Zeit. Bleibt diese Last hoch und wächst das Team, leidet die Führung.") },
    ],
    source: sourceLine("span"),
  },
  {
    id: "visibility", part: 2,
    kicker: x("Trust and visibility", "Besimi dhe dukshmëria", "Vertrauen und Sichtbarkeit"),
    title: [x("The visibility", "Kurthi i", "Die Falle"), x("trap", "dukshmërisë", "der Sichtbarkeit")],
    lead: x("When physical presence becomes a performance signal, management risks measuring what is seen, not what is valuable.", "Kur prania fizike kthehet në sinjal performance, menaxhimi rrezikon të masë atë që shihet, jo atë që ka vlerë.", "Wenn Anwesenheit zum Leistungssignal wird, misst Führung leicht das Sichtbare statt des Wertvollen."),
    blocks: [
      { type: "stats", cols: 3, items: [
        { n: pc(76), t: x("of employees surveyed see leadership visibility and oversight as the top reason for return-to-office policies.", "e punonjësve të anketuar e shohin dukshmërinë dhe mbikëqyrjen nga drejtuesit si arsyen kryesore të kthimit në zyrë.", "der befragten Beschäftigten sehen Sichtbarkeit und Kontrolle durch die Führung als Hauptgrund für die Rückkehr ins Büro.") },
        { n: pc(48), t: x("have taken part in, or plan to try, “billboard days”: office days chosen to be seen by senior leaders or clients.", "kanë bërë ose planifikojnë “ditë billboard”: ditë në zyrë të zgjedhura për t'u parë nga drejtuesit ose klientët.", "haben „Billboard Days“ gemacht oder planen sie: Bürotage, die gewählt werden, um von der Führung oder Kunden gesehen zu werden.") },
        { n: pc(87), t: x("say a supportive manager is a top factor in how they feel about their job.", "thonë se një menaxher mbështetës është faktor kryesor në mënyrën si ndihen për punën.", "sagen, dass eine unterstützende Führungskraft entscheidend dafür ist, wie sie sich in ihrem Job fühlen.") },
      ] },
      { type: "callout", label: x("A check for your own team", "Një kontroll për ekipin tënd", "Ein Test für Ihr eigenes Team"),
        text: x("Look at what you reward. If someone's standing rises with the days they are seen, visibility has started to count for more than contribution. Clear output, collaboration, trust and results are stronger signals than presence.", "Shiko çfarë shpërblen. Nëse vlerësimi për dikë rritet me ditët kur shihet në zyrë, dukshmëria ka nisur të vlejë më shumë se kontributi. Rezultatet e qarta, bashkëpunimi, besimi dhe arritjet janë sinjale më të forta se prania.", "Prüfen Sie, was Sie belohnen. Steigt das Ansehen einer Person mit den Tagen, an denen sie gesehen wird, zählt Sichtbarkeit bereits mehr als der Beitrag. Klare Ergebnisse, Zusammenarbeit, Vertrauen und erreichte Ziele sind stärkere Signale als bloße Präsenz.") },
    ],
    source: x("Owl Labs, State of Hybrid Work 2026: survey of 2,000 full-time knowledge workers in the US.", "Owl Labs, State of Hybrid Work 2026: anketë me 2.000 punonjës me kohë të plotë në punë intelektuale në SHBA.", "Owl Labs, State of Hybrid Work 2026: Befragung von 2.000 Vollzeit-Wissensarbeitenden in den USA."),
  },
  {
    id: "floor", part: 2, more: "leading-people-without-losing-the-person",
    kicker: x("From the floor", "Si e shoh nga terreni", "Aus der Praxis"),
    title: [x("From operations to management:", "Nga operacioni te menaxhimi:", "Vom Betrieb ins Management:"), x("the pressure changes shape.", "presioni ndryshon formë.", "Der Druck ändert seine Form.")],
    blocks: [
      { type: "figures", items: [
        { n: "4", t: x("Shift Leaders", "Shift Leaders", "Shift Leaders") },
        { n: "8", t: x("dispatchers", "dispecerë", "Dispatcher") },
        { n: "~250", t: x("drivers, indirectly", "shoferë, indirekt", "Fahrer, indirekt") },
      ] },
      { type: "p", text: x(
        "When I moved from Team Leader On Road to Area Manager after about five months, the responsibility grew quickly. My direct structure was four Shift Leaders and eight dispatchers, and the operation included around 250 drivers indirectly.",
        "Kur kalova nga Team Leader On Road në Area Manager pas rreth pesë muajsh, përgjegjësia u zgjerua shpejt. Në strukturën direkte kisha katër Shift Leaders dhe tetë dispecerë, ndërsa operacioni përfshinte rreth 250 shoferë në mënyrë indirekte.",
        "Als ich nach rund fünf Monaten vom Team Leader On Road zum Area Manager wechselte, wuchs die Verantwortung schnell. Direkt geführt habe ich vier Shift Leaders und acht Dispatcher, indirekt gehörten rund 250 Fahrer zum Betrieb.") },
      { type: "p", text: x(
        "The energy did not go into one problem. It went into constantly switching between KPIs, delays, quality, damage, loading, safety and people who needed a decision or support.",
        "Energjia nuk harxhohej te një problem i vetëm. Harxhohej te kalimi i vazhdueshëm mes KPI-ve, vonesave, cilësisë, dëmtimeve, ngarkimit, sigurisë dhe njerëzve që kishin nevojë për vendim ose mbështetje.",
        "Die Energie floss nicht in ein einzelnes Problem. Sie floss in den ständigen Wechsel zwischen KPIs, Verspätungen, Qualität, Schäden, Beladung, Sicherheit und Menschen, die eine Entscheidung oder Unterstützung brauchten.") },
      { type: "p", text: x(
        "What would have helped me most is onboarding made for the step from operator to manager: prioritising, delegating, feedback and clear limits to the role.",
        "Ajo që do të më kishte ndihmuar më shumë është një onboarding specifik për kalimin nga operator në menaxher: prioritizim, delegim, feedback dhe kufij të qartë të rolit.",
        "Am meisten hätte mir ein Onboarding geholfen, das genau für den Schritt vom Operator zur Führungskraft gemacht ist: Priorisieren, Delegieren, Feedback und klare Grenzen der Rolle.") },
      { type: "callout", label: x("What it taught me", "Çfarë më mësoi", "Was es mich gelehrt hat"),
        text: x("A manager who reacts to everything quickly becomes part of the problem. A manager who tells the signal from the noise can start building a system.", "Menaxheri që reagon ndaj gjithçkaje bëhet shpejt pjesë e problemit. Menaxheri që dallon sinjalin nga zhurma mund të fillojë të ndërtojë sistem.", "Eine Führungskraft, die auf alles reagiert, wird schnell Teil des Problems. Eine Führungskraft, die das Signal vom Rauschen unterscheidet, kann anfangen, ein System aufzubauen.") },
      { type: "sign" },
    ],
  },

  // Part III. Practice
  {
    id: "kpi", part: 3, tool: "/tools/kpi-diagnostic/",
    kicker: x("Tool of the month", "Mjeti i muajit", "Werkzeug der Ausgabe"),
    title: [x("A KPI is a signal,", "Një KPI është sinjal,", "Ein KPI ist ein Signal,"), x("not a conclusion.", "jo përfundim.", "keine Schlussfolgerung.")],
    lead: x("A red KPI starts an investigation. Whether the process should change is decided later.", "Një KPI e kuqe hap një hetim. Nëse procesi duhet ndryshuar, vendoset më vonë.", "Eine rote Kennzahl eröffnet eine Untersuchung. Ob sich der Prozess ändern soll, wird erst danach entschieden."),
    blocks: [
      { type: "steps", items: [
        { h: x("Segment", "Segmento", "Segmentieren"), p: x("Split the problem by shift, zone, category, channel or team.", "Ndaje problemin sipas turnit, zonës, kategorisë, kanalit ose ekipit.", "Teilen Sie das Problem nach Schicht, Zone, Kategorie, Kanal oder Team auf.") },
        { h: x("Find the concentration", "Gjej përqendrimin", "Die Häufung finden"), p: x("Find where most of the loss collects.", "Gjej ku mblidhet pjesa më e madhe e humbjes.", "Finden Sie heraus, wo sich der größte Teil des Verlusts sammelt.") },
        { h: x("Go to the process", "Shko në proces", "In den Prozess gehen"), p: x("Look at the operational reality and check what is happening.", "Shiko realitetin operacional dhe kontrollo çfarë po ndodh.", "Sehen Sie sich die operative Realität an und prüfen Sie, was passiert.") },
        { h: x("Ask why", "Pyet pse", "Nach dem Warum fragen"), p: x("Only now use 5 Why or another cause analysis.", "Vetëm tani përdor 5 Why ose një analizë tjetër për shkakun.", "Nutzen Sie erst jetzt 5 Why oder eine andere Ursachenanalyse.") },
        { h: x("Countermeasure", "Kundërmasa", "Gegenmaßnahme"), p: x("Try one small change and measure the result.", "Provo një ndryshim të vogël dhe mat rezultatin.", "Testen Sie eine kleine Änderung und messen Sie das Ergebnis.") },
      ] },
      { type: "quote", text: x("A KPI shows you where to start asking questions.", "Një KPI të tregon ku të fillosh të bësh pyetje.", "Eine Kennzahl zeigt Ihnen, wo Sie mit den Fragen anfangen sollten.") },
      { type: "pull", text: x("Don't fight the symptom. Find the pattern.", "Mos lufto simptomën. Gjej modelin.", "Bekämpfen Sie nicht das Symptom. Finden Sie das Muster.") },
    ],
  },
  {
    id: "pareto", part: 3, more: "pareto-and-5-why-in-practice", tool: "/tools/pareto/",
    kicker: x("Operations lab", "Laboratori i operacioneve", "Betriebslabor"),
    title: [x("Pareto", "Pareto", "Pareto"), x("before 5 Why", "para 5 Why", "vor 5 Why")],
    lead: x("Do not look for the root cause of a problem you have not located yet.", "Mos kërko shkakun rrënjësor të një problemi kur ende nuk e di ku ndodh.", "Suchen Sie nicht nach der Grundursache eines Problems, das Sie noch nicht verortet haben."),
    blocks: [
      { type: "pareto", label: x("Illustration: cases by category", "Ilustrim: rastet sipas kategorisë", "Illustration: Fälle nach Kategorie") },
      { type: "steps", items: [
        { h: x("Pareto finds the concentration.", "Pareto tregon ku mblidhen rastet.", "Pareto findet die Häufung."), p: x("Which category, zone or visible cause is producing most of the cases?", "Cila kategori, zonë ose shkak i dukshëm po prodhon shumicën e rasteve?", "Welche Kategorie, Zone oder sichtbare Ursache erzeugt die meisten Fälle?") },
        { h: x("Gemba checks reality.", "Gemba verifikon realitetin.", "Gemba prüft die Realität."), p: x("What looks true in the report has to be seen in the process.", "Ajo që duket në raport duhet parë në proces.", "Was im Bericht so aussieht, muss im Prozess gesehen werden.") },
        { h: x("5 Why looks for the cause.", "5 Why kërkon shkakun.", "5 Why sucht die Ursache."), p: x("Only once you have chosen the right problem, ask why it happened.", "Vetëm pasi ke zgjedhur problemin e duhur, pyet pse ndodhi.", "Erst wenn Sie das richtige Problem gewählt haben, fragen Sie, warum es passiert ist.") },
      ] },
      { type: "callout", label: x("Rule of thumb", "Rregull praktik", "Faustregel"),
        text: x("Go from wide to narrow: KPI, segment, Pareto, process, 5 Why, countermeasure.", "Shko nga e gjera te e ngushta: KPI, segment, Pareto, proces, 5 Why, kundërmasë.", "Gehen Sie vom Breiten zum Engen: Kennzahl, Segment, Pareto, Prozess, 5 Why, Gegenmaßnahme.") },
    ],
  },
  {
    id: "review", part: 3,
    kicker: x("Practice", "Praktikë", "Praxis"),
    title: [x("The 15-minute", "Rishikimi operacional", "Der 15-Minuten-"), x("operations review", "15-minutësh", "Betriebscheck")],
    lead: x("A simple frame for reading the operation without getting lost in the noise.", "Një kornizë e thjeshtë për të lexuar operacionin pa u humbur në zhurmë.", "Ein einfacher Rahmen, um den Betrieb zu lesen, ohne sich im Rauschen zu verlieren."),
    blocks: [
      { type: "steps", items: [
        { h: x("People", "Njerëzit", "Menschen"), p: x("Who needs support, clarity or feedback?", "Kush ka nevojë për mbështetje, qartësi ose reagim?", "Wer braucht Unterstützung, Klarheit oder Feedback?") },
        { h: x("Process", "Procesi", "Prozess"), p: x("Where is the flow of work breaking?", "Ku po prishet rrjedha e punës?", "Wo bricht der Arbeitsfluss?") },
        { h: x("Performance", "Performanca", "Leistung"), p: x("Which numbers are drifting from the standard?", "Cilat shifra po devijojnë nga standardi?", "Welche Zahlen weichen vom Standard ab?") },
        { h: x("Problems", "Problemet", "Probleme"), p: x("Which issues keep coming back?", "Cilat çështje po përsëriten?", "Welche Themen kehren wieder?") },
        { h: x("Priorities", "Prioritetet", "Prioritäten"), p: x("What must be followed up today, not tomorrow?", "Çfarë duhet ndjekur sot, jo nesër?", "Was muss heute verfolgt werden, nicht morgen?") },
      ] },
      { type: "callout", label: x("Keep in mind", "Mbaje në mend", "Im Blick behalten"),
        text: x("The aim is to see the operation more clearly. Reporting more is a different aim.", "Qëllimi është ta shohësh operacionin më qartë. Të raportosh më shumë është tjetër qëllim.", "Ziel ist, den Betrieb klarer zu sehen. Mehr zu berichten ist ein anderes Ziel.") },
    ],
  },
  {
    id: "handover", part: 3, more: "why-the-handover-is-underrated", tool: "/tools/shift-handover/",
    kicker: x("Operating discipline", "Disiplina operative", "Betriebsdisziplin"),
    title: [x("Handover is", "Dorëzimi i turnit është", "Die Übergabe ist das"), x("organisational memory.", "memoria e organizatës.", "Gedächtnis der Organisation.")],
    lead: x("A shift can do perfect work. The organisation still fails if the information does not reach the next shift.", "Një turn mund ta bëjë punën në përsosmëri, e megjithatë organizata dështon nëse informacioni nuk kalon te turni tjetër.", "Eine Schicht kann perfekt arbeiten. Die Organisation scheitert trotzdem, wenn die Information nicht bei der nächsten Schicht ankommt."),
    blocks: [
      { type: "steps", items: [
        { h: x("State", "Gjendja", "Stand"), p: x("What is the situation now?", "Çfarë është gjendja tani?", "Wie ist die Lage jetzt?") },
        { h: x("Open points", "Pikat e hapura", "Offene Punkte"), p: x("What is not closed?", "Çfarë nuk është mbyllur?", "Was ist nicht abgeschlossen?") },
        { h: x("Owner", "Përgjegjësi", "Verantwortlich"), p: x("Who takes it on?", "Kush e merr më tej?", "Wer übernimmt?") },
        { h: x("Deadline", "Afati", "Frist"), p: x("When must it be acted on?", "Kur duhet vepruar?", "Bis wann muss gehandelt werden?") },
        { h: x("Context", "Konteksti", "Kontext"), p: x("What must be understood, not just read?", "Çfarë duhet kuptuar, jo vetëm lexuar?", "Was muss verstanden, nicht nur gelesen werden?") },
      ] },
      { type: "callout", label: x("The test", "Testi", "Der Test"),
        text: x("If the next person has to rebuild the story from scratch, the handover has not worked.", "Nëse personi tjetër duhet ta rindërtojë historinë nga zero, dorëzimi i turnit nuk ka funksionuar.", "Wenn die nächste Person die Geschichte von vorn rekonstruieren muss, hat die Übergabe nicht funktioniert.") },
    ],
  },
  {
    id: "sop", part: 3, more: "a-good-sop-is-not-a-document",
    kicker: x("Standard work", "Puna standarde", "Standardarbeit"),
    title: [x("A good SOP", "Një SOP e mirë", "Eine gute SOP"), x("holds up on shift.", "mban në turn.", "hält in der Schicht.")],
    lead: x("It is a way of working that someone else can use under pressure and still reach the same result.", "Është një mënyrë pune që një person tjetër mund ta përdorë nën presion dhe prapë të arrijë të njëjtin rezultat.", "Sie ist eine Arbeitsweise, mit der eine andere Person auch unter Druck zum selben Ergebnis kommt."),
    blocks: [
      { type: "cards", cols: 2, items: [
        { h: x("Find", "Gjeje", "Finden"), p: x("The information must be where the employee expects it.", "Informacioni duhet të jetë aty ku punonjësi e pret.", "Die Information muss dort sein, wo die Person sie erwartet.") },
        { h: x("Follow", "Ndiqe", "Befolgen"), p: x("The order must be clear, not open to interpretation.", "Rendi duhet të jetë i qartë, jo i hapur ndaj interpretimit.", "Die Reihenfolge muss klar sein, nicht offen für Interpretation.") },
        { h: x("Verify", "Verifikoje", "Prüfen"), p: x("A step counts as done when the result is right; a click proves nothing.", "Hapi quhet i mbaruar kur rezultati është i saktë; një klikim nuk provon asgjë.", "Ein Schritt gilt als erledigt, wenn das Ergebnis stimmt; ein Klick beweist nichts.") },
        { h: x("Update", "Përditësoje", "Aktualisieren"), p: x("When the process changes, the standard must change with it.", "Kur procesi ndryshon, standardi duhet të ndryshojë me të.", "Wenn sich der Prozess ändert, muss sich der Standard mit ihm ändern.") },
      ] },
      { type: "callout", label: x("The Stiven Catalyst rule", "Rregulli i Stiven Catalyst", "Die Stiven-Catalyst-Regel"),
        text: x("If the SOP looks good as a PDF but nobody uses it on shift, it is documentation, and the standard is still missing.", "Nëse SOP-ja duket bukur në PDF, por askush nuk e përdor në turn, ajo është dokumentacion, dhe standardi ende mungon.", "Wenn die SOP als PDF gut aussieht, aber niemand sie in der Schicht nutzt, ist sie Dokumentation, und der Standard fehlt noch.") },
    ],
  },
  {
    id: "days", part: 3, more: "the-operations-manager-i-want-to-be",
    kicker: x("New in the role", "I ri në rol", "Neu in der Rolle"),
    title: [x("The first", "90 ditët", "Die ersten"), x("90 days", "e para", "90 Tage")],
    lead: x("In a new operation, the first job is to understand what needs to change, well before you show how fast you can change it.", "Në një operacion të ri, detyra e parë është të kuptosh çfarë duhet të ndryshojë, shumë përpara se të tregosh sa shpejt mund ta ndryshosh.", "In einem neuen Betrieb geht es zuerst darum zu verstehen, was sich ändern muss, lange bevor Sie zeigen, wie schnell Sie es ändern können."),
    blocks: [
      { type: "cards", cols: 1, items: [
        { n: x("Days 1–30", "Ditët 1–30", "Tage 1–30"), h: x("Understand", "Kupto", "Verstehen"), p: x("The team, the process, the KPIs, the customer, the handover, the dependencies and the problems that have become “normal”.", "Ekipi, procesi, KPI-të, klienti, dorëzimi i turnit, varësitë dhe problemet që janë bërë “normale”.", "Das Team, der Prozess, die Kennzahlen, der Kunde, die Übergabe, die Abhängigkeiten und die Probleme, die „normal“ geworden sind.") },
        { n: x("Days 31–60", "Ditët 31–60", "Tage 31–60"), h: x("Prioritise", "Prioritizo", "Priorisieren"), p: x("Separate symptoms from real problems. Choose a few priorities and give each an owner.", "Ndaji simptomat nga problemet reale. Zgjidh pak prioritete dhe cakto një përgjegjës për secilin.", "Trennen Sie Symptome von echten Problemen. Wählen Sie wenige Prioritäten und geben Sie jeder eine verantwortliche Person.") },
        { n: x("Days 61–90", "Ditët 61–90", "Tage 61–90"), h: x("Standardise", "Standardizo", "Standardisieren"), p: x("Turn improvements into a working rhythm: review, standard, measurement, feedback and follow-up.", "Ktheji përmirësimet në ritëm pune: rishikim, standard, matje, reagim dhe ndjekje.", "Bringen Sie Verbesserungen in einen Arbeitsrhythmus: Überprüfung, Standard, Messung, Rückmeldung und Nachverfolgung.") },
      ] },
      { type: "callout", label: x("The goal", "Qëllimi", "Das Ziel"),
        text: x("At the end of this period, the operation should understand itself better and learn faster than when you arrived.", "Në fund të kësaj periudhe, operacioni duhet ta kuptojë veten më mirë dhe të mësojë më shpejt se kur erdhe ti.", "Am Ende dieser Zeit sollte der Betrieb sich besser verstehen und schneller lernen als bei Ihrer Ankunft.") },
    ],
  },
  {
    id: "challenge", part: 3,
    kicker: x("A 30-day challenge", "Sfida 30-ditore", "Eine 30-Tage-Aufgabe"),
    title: [x("One problem.", "Një problem.", "Ein Problem."), x("Four weeks.", "Katër javë.", "Vier Wochen.")],
    lead: x("Pick a problem that keeps coming back: one you see often, that costs time or energy and is worth understanding better, even if it is not the biggest in theory. Treat it as an experiment rather than a crisis.", "Zgjidh një problem që rikthehet: një problem që e sheh shpesh, që të merr kohë ose energji dhe që ia vlen ta kuptosh më mirë, edhe nëse në teori nuk është më i madhi. Trajtoje si eksperiment, më shumë se si krizë.", "Wählen Sie ein Problem, das immer wiederkommt: eines, das Sie oft sehen, das Zeit oder Energie kostet und das es wert ist, besser verstanden zu werden, auch wenn es theoretisch nicht das größte ist. Behandeln Sie es eher als Experiment denn als Krise."),
    blocks: [
      { type: "cards", cols: 2, items: [
        { n: x("Week 1", "Java 1", "Woche 1"), h: x("Observe and log", "Vëzhgo dhe regjistro", "Beobachten und erfassen"), p: x("Log every repeat by category, not by culprit. Do not propose solutions yet.", "Regjistro çdo përsëritje sipas kategorisë, jo sipas fajtorit. Mos propozo zgjidhje ende.", "Erfassen Sie jede Wiederholung nach Kategorie, nicht nach Schuldigen. Schlagen Sie noch keine Lösungen vor.") },
        { n: x("Week 2", "Java 2", "Woche 2"), h: x("Segment", "Segmento", "Segmentieren"), p: x("Use Pareto. Find where the cases pile up and choose the main category.", "Përdor Pareto. Gjej ku grumbullohen rastet dhe zgjidh kategorinë kryesore.", "Nutzen Sie Pareto. Finden Sie heraus, wo sich die Fälle häufen, und wählen Sie die Hauptkategorie.") },
        { n: x("Week 3", "Java 3", "Woche 3"), h: x("Diagnose", "Diagnostiko", "Diagnostizieren"), p: x("Go to the process. Use 5 Why only on the chosen problem, until you find a cause deeper than the symptom.", "Shko në proces. Përdor 5 Why vetëm mbi problemin e zgjedhur, derisa të gjesh një shkak më të thellë se simptoma.", "Gehen Sie in den Prozess. Wenden Sie 5 Why nur auf das gewählte Problem an, bis eine Ursache unter dem Symptom sichtbar wird.") },
        { n: x("Week 4", "Java 4", "Woche 4"), h: x("Test", "Testo", "Testen"), p: x("Try one small countermeasure. Measure, see whether the pattern changes, and decide whether it should become the standard.", "Provo një kundërmasë të vogël. Mat, shiko nëse modeli ndryshon dhe vendos nëse duhet standardizuar.", "Testen Sie eine kleine Gegenmaßnahme. Messen Sie, prüfen Sie, ob sich das Muster ändert, und entscheiden Sie, ob sie Standard werden soll.") },
      ] },
      { type: "callout", label: x("At the end of the month", "Në fund të muajit", "Am Monatsende"),
        text: x("You will not have solved everything. If one recurring problem is better understood than four weeks ago, the month has done its work.", "Nuk do t'i kesh zgjidhur të gjitha. Nëse një problem që përsëritet kuptohet më mirë se katër javë më parë, muaji e ka bërë punën e vet.", "Sie werden nicht alles gelöst haben. Wenn ein wiederkehrendes Problem heute besser verstanden ist als vor vier Wochen, hat der Monat seinen Zweck erfüllt.") },
      { type: "quote", text: x("One month. One recurring problem. One better standard.", "Një muaj. Një problem i përsëritur. Një standard më i mirë.", "Ein Monat. Ein wiederkehrendes Problem. Ein besserer Standard.") },
    ],
  },
  {
    id: "playbook", part: 3,
    kicker: x("The Stiven Catalyst playbook", "Udhëzuesi i Stiven Catalyst", "Das Stiven-Catalyst-Handbuch"),
    title: [x("Five principles", "Pesë parime", "Fünf Prinzipien"), x("for better operations", "për operacione më të mira", "für bessere Abläufe")],
    blocks: [
      { type: "rows", items: [
        { h: x("People", "Njerëzit", "Menschen"), p: x("Pressure can be fair. Humiliation cannot.", "Presioni mund të jetë i drejtë. Poshtërimi jo.", "Druck kann fair sein. Demütigung nicht.") },
        { h: x("Standards", "Standardet", "Standards"), p: x("If the result depends on having the right person on shift, you do not have a standard yet.", "Nëse rezultati varet nga personi i duhur në turn, nuk ke ende standard.", "Wenn das Ergebnis davon abhängt, dass die richtige Person in der Schicht ist, gibt es noch keinen Standard.") },
        { h: x("Data", "Të dhënat", "Daten"), p: x("The KPI is the signal. The floor tells you what it means.", "KPI-ja është sinjal; kuptimin ta tregon terreni.", "Die Kennzahl ist das Signal. Die Praxis sagt, was sie bedeutet.") },
        { h: x("Ownership", "Përgjegjësia", "Verantwortung"), p: x("A problem must not be left without an owner, but it must not cross the limits of authority either.", "Problemi nuk duhet të mbetet pa përgjegjës, por as të kalojë kufijtë e autoritetit.", "Ein Problem darf nicht ohne Verantwortlichen bleiben, aber auch nicht die Grenzen der Befugnis überschreiten.") },
        { h: x("Continuous improvement", "Përmirësimi i vazhdueshëm", "Kontinuierliche Verbesserung"), p: x("Once a problem is solved, ask what to change so that it does not come back.", "Pasi zgjidhet një problem, pyet çfarë duhet ndryshuar që të mos kthehet.", "Ist ein Problem gelöst, fragen Sie, was sich ändern muss, damit es nicht wiederkommt.") },
      ] },
      { type: "quote", text: x("Good leadership builds an operation that needs saving less often.", "Udhëheqja e mirë ndërton një operacion që ka më rrallë nevojë të shpëtohet.", "Gute Führung baut einen Betrieb auf, der seltener gerettet werden muss.") },
    ],
  },
  { id: "sources", type: "sources" },
  { id: "back", type: "back" },
];

const common = {
  name: "Management Review",
  tagline: x("Management without theatre.", "Menaxhim pa teatër.", "Management ohne Theater."),
  date: x("October 2026", "Tetor 2026", "Oktober 2026"),
  // Corrections made after publication, shown on the edition's page (pages/review.njk), newest last.
  corrections: [
    {
      date: x("14 October 2026", "14 tetor 2026", "14. Oktober 2026"),
      t: x(
        "Three figures now say they come from US samples: PwC's finding on AI-exposed junior roles, and Gallup's figures on frontline supervisors and on managers who also carry individual work. The edition first gave them without the country.",
        "Tri shifra tani thonë se vijnë nga mostra në SHBA: gjetja e PwC-së për rolet fillestare të ekspozuara ndaj AI-së, dhe shifrat e Gallup-it për supervizorët e vijës së parë dhe për menaxherët që kanë edhe përgjegjësi individuale. Botimi fillimisht i jepte pa përmendur vendin.",
        "Drei Zahlen nennen jetzt ihre US-Stichproben: der PwC-Befund zu KI-exponierten Einstiegsrollen sowie die Gallup-Zahlen zu Frontline-Vorgesetzten und zu Führungskräften, die auch eigene Facharbeit leisten. Die Ausgabe nannte das Land zuerst nicht."),
    },
    {
      date: x("27 October 2026", "27 tetor 2026", "27. Oktober 2026"),
      t: x(
        "The 40% now says what it compares: productivity growth from 2018 to 2025 of 34% in companies of the sectors most exposed to AI, against 24% in the least exposed, as PwC reports it. The edition first gave the 40% alone.",
        "40% tani thotë çfarë krahason: rritjen e produktivitetit nga 2018 deri në 2025, 34% te kompanitë e sektorëve më të ekspozuar ndaj AI-së kundrejt 24% te më pak të ekspozuarit, siç e jep PwC. Botimi fillimisht e jepte 40% vetëm.",
        "Die 40 % sagen jetzt, was sie vergleichen: das Produktivitätswachstum von 2018 bis 2025, 34 % bei Unternehmen der am stärksten KI-exponierten Branchen gegenüber 24 % bei den am wenigsten exponierten, wie PwC es angibt. Die Ausgabe nannte zuerst nur die 40 %."),
    },
  ],
  theme: x("The manager in the age of AI", "Menaxheri në epokën e AI-së", "Die Führungskraft im Zeitalter der KI"),
  sub: x("How work is being redesigned, and what leaders must keep human.", "Si po riorganizohet puna dhe çfarë duhet ta ruajnë drejtuesit si punë të njeriut.", "Wie Arbeit neu gestaltet wird und was Führung menschlich halten muss."),
  cover: { src: `/media/magazine/${slug}/art/bulb.jpg`, width: 350, height: 700 },
  inside: ["trends", "numbers", "human", "kpi", "review"],
  editor: {
    kicker: x("From the editor", "Nga redaktori", "Aus der Redaktion"),
    title: x("Clear ideas for better management.", "Ide të qarta për një menaxhim më të mirë.", "Klare Ideen für besseres Management."),
    body: [
      x("This edition is built on data, practical tools and clear thinking about management.", "Ky botim ndërtohet mbi të dhëna, mjete praktike dhe mendim të qartë për menaxhimin.", "Diese Ausgabe beruht auf Daten, praktischen Werkzeugen und klarem Denken über Management."),
      x("There are no invented statistics and no empty jargon, and every idea has to lead to a concrete action.", "Nuk ka statistika të shpikura, nuk ka zhargon të zbrazët dhe çdo ide duhet të çojë në veprim të prekshëm.", "Sie finden hier keine erfundenen Zahlen und keinen leeren Jargon, und jede Idee muss zu einer konkreten Handlung führen."),
      x("The aim is simple: to help managers, teams and organisations make better decisions and build stronger processes.", "Qëllimi është i thjeshtë: të ndihmojmë menaxherët, ekipet dhe organizatat të marrin vendime më të mira dhe të ndërtojnë procese më të forta.", "Das Ziel ist einfach: Führungskräften, Teams und Organisationen helfen, bessere Entscheidungen zu treffen und stärkere Prozesse aufzubauen."),
      x("The edition has three parts: the big picture, managers under pressure, and practice you can start on Monday.", "Botimi ka tri pjesë: pamjen e përgjithshme, menaxherët nën presion dhe praktikën që mund ta nisësh të hënën.", "Die Ausgabe hat drei Teile: den Überblick, Führungskräfte unter Druck und Praxis, mit der Sie am Montag beginnen können."),
    ],
    role: x("Editor", "Redaktor", "Herausgeber"),
  },
  sourcesPage: {
    kicker: x("Sources and method", "Burimet dhe metoda", "Quellen und Methode"),
    title: [x("No invented stats.", "Pa statistika të shpikura.", "Keine erfundenen Zahlen."), x("No empty jargon.", "Pa zhargon të zbrazët.", "Kein leerer Jargon.")],
    lead: x("Every number in this edition is tied to an identifiable source. The data is there to build the argument, not as decoration.", "Çdo numër në këtë botim lidhet me një burim të identifikueshëm. Të dhënat janë përdorur për të ndërtuar argumentin, jo për dekor.", "Jede Zahl in dieser Ausgabe geht auf eine nachvollziehbare Quelle zurück. Die Daten tragen das Argument, sie sind keine Dekoration."),
    method: x("Editorial method", "Metoda editoriale", "Redaktionelle Methode"),
    methodText: x("The sources were checked for year, publisher and the exact meaning of each metric. Where an idea is editorial interpretation, it is kept clearly apart from the statistics. Personal experience is used only where it is documented from real work.", "Burimet u kontrolluan për vitin, botuesin dhe kuptimin e saktë të metrikës. Kur një ide është interpretim editorial, ajo ndahet qartë nga statistika. Përvoja personale përdoret vetëm aty ku ka bazë të dokumentuar nga puna reale.", "Die Quellen wurden auf Jahr, Herausgeber und genaue Bedeutung jeder Kennzahl geprüft. Redaktionelle Deutung ist klar von Statistik getrennt. Persönliche Erfahrung erscheint nur dort, wo sie aus realer Arbeit belegt ist."),
  },
  back: {
    line: x("Every month, the conversation goes on in", "Çdo muaj, biseda vazhdon te", "Jeden Monat geht das Gespräch weiter in"),
    more: x("the monthly magazine of Stiven Catalyst.", "revista mujore e Stiven Catalyst.", "dem Monatsmagazin von Stiven Catalyst."),
  },
  labels: {
    contents: x("Contents", "Përmbajtja", "Inhalt"),
    inside: x("Inside", "Brenda", "In dieser Ausgabe"),
    page: x("Page", "Faqe", "Seite"),
    source: x("Source", "Burimi", "Quelle"),
    sources: x("Sources", "Burimet", "Quellen"),
    more: x("More in the essay", "Më shumë te eseja", "Mehr im Essay"),
    open: x("Open the tool", "Hape mjetin", "Tool öffnen"),
    edition: x("Edition", "Botimi", "Ausgabe"),
    open_edition: x("Open the edition", "Hape botimin", "Ausgabe öffnen"),
    read_text: x("Read the edition as text", "Lexoje botimin si tekst", "Die Ausgabe als Text lesen"),
    page_by_page: x("The edition, page by page", "Botimi, faqe pas faqeje", "Die Ausgabe, Seite für Seite"),
  },
  // The description for search results: short enough to be shown whole (about 155 characters).
  seo: x(
    "The manager in the age of AI: figures from Microsoft, Deloitte, PwC, Gallup and Owl Labs, checked one by one, and the practice behind them.",
    "Menaxheri në epokën e AI-së: shifrat e Microsoft, Deloitte, PwC, Gallup dhe Owl Labs, të kontrolluara një nga një, dhe praktika pas tyre.",
    "Die Führungskraft im KI-Zeitalter: Zahlen von Microsoft, Deloitte, PwC, Gallup und Owl Labs, einzeln geprüft, und die Praxis dahinter."),
  feature: x(
    "A one-off edition on the manager in the age of AI: the numbers from Microsoft, Deloitte, PwC, Gallup and Owl Labs, checked one by one, and the practice that turns them into work.",
    "Një botim më vete për menaxherin në epokën e AI-së: shifrat e Microsoft, Deloitte, PwC, Gallup dhe Owl Labs, të kontrolluara një nga një, dhe praktika që i kthen në punë.",
    "Eine eigene Ausgabe über die Führungskraft im Zeitalter der KI: die Zahlen von Microsoft, Deloitte, PwC, Gallup und Owl Labs, einzeln geprüft, und die Praxis, die daraus Arbeit macht."),
};

const langs = ["en", "sq", "de"];
const isText = (value) => value && typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === 3 && langs.every((lang) => lang in value);
const resolve = (value, lang) => {
  if (isText(value)) return value[lang];
  if (Array.isArray(value)) return value.map((item) => resolve(item, lang));
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, resolve(item, lang)]));
  return value;
};

// The title on one line, for the contents and the reader: "Management-" + "Trends 2026" joins without a space.
const withHeading = (page) => page.title ? { ...page, heading: page.title[0].endsWith("-") ? page.title[0] + page.title[1] : `${page.title[0]} ${page.title[1]}` } : page;

const pageOf = Object.fromEntries(pages.map((page, index) => [page.id, index + 1]));

export default {
  slug,
  langs,
  sources,
  pageOf,
  pageCount: pages.length,
  prints: langs.map((lang) => ({ lang })),
  ...Object.fromEntries(langs.map((lang) => [lang, {
    ...resolve(common, lang),
    parts: resolve(parts, lang),
    pages: resolve(pages, lang).map(withHeading),
  }])),
};
