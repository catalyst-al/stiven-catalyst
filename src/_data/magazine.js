// "Nga terreni" (From the Floor, Aus der Praxis): the monthly magazine of Stiven Catalyst, one entry per issue,
// newest last. The text of the printed issue (src/guide-print/magazine.njk, scripts/magazine.mjs) and of its
// reader page (src/_includes/pages/magazine-issue.njk), in English, Albanian and German.
//
// The trend is written by the editors from cited sources; "From the floor" is Stiven Janaqi's own answers,
// edited only for spelling; nothing in an issue is invented. The Albanian draft and its fact check live in
// docs/revista/.

const names = {
  en: { name: "From the Floor", tagline: "The monthly magazine of Stiven Catalyst" },
  sq: { name: "Nga terreni", tagline: "Revista mujore e Stiven Catalyst" },
  de: { name: "Aus der Praxis", tagline: "Das Monatsmagazin von Stiven Catalyst" },
};

const labels = {
  en: { issue: "Issue", contents: "In this issue", trend: "Trend of the month", floor: "From the floor", tool: "Tool of the month", essays: "Essays of the month", question: "A question for you", sources: "Sources", open: "Open it", formula: "The formula", page: "Page", read: "Further reading" },
  sq: { issue: "Numri", contents: "Në këtë numër", trend: "Trendi i muajit", floor: "Si e shoh nga terreni", tool: "Mjeti i muajit", essays: "Esetë e muajit", question: "Pyetja për ju", sources: "Burimet", open: "Hapeni", formula: "Formula", page: "Faqe", read: "Për të lexuar" },
  de: { issue: "Ausgabe", contents: "In dieser Ausgabe", trend: "Trend des Monats", floor: "Aus der Praxis", tool: "Tool des Monats", essays: "Essays des Monats", question: "Eine Frage an Sie", sources: "Quellen", open: "Öffnen", formula: "Die Formel", page: "Seite", read: "Zum Weiterlesen" },
};

const sources = [
  { url: "https://www.gallup.com/workplace/349484/state-of-the-global-workplace.aspx", en: "Gallup, State of the Global Workplace 2026 (data for 2025): engagement worldwide, of managers and in Europe; training; best-practice organisations.", sq: "Gallup, State of the Global Workplace 2026 (të dhëna për 2025): angazhimi global, i menaxherëve dhe i Evropës; trajnimi; organizatat me praktikat më të mira.", de: "Gallup, State of the Global Workplace 2026 (Daten für 2025): Engagement weltweit, bei Führungskräften und in Europa; Training; Best-Practice-Organisationen." },
  { url: "https://www.gallup.com/workplace/700718/span-control-optimal-team-size-managers.aspx", en: "Gallup, “Span of Control: What's the Optimal Team Size for Managers?” (average and median direct reports in the US).", sq: "Gallup, “Span of Control: What's the Optimal Team Size for Managers?” (mesatarja dhe mediana e vartësve në SHBA).", de: "Gallup, „Span of Control: What's the Optimal Team Size for Managers?“ (Durchschnitt und Median der direkt Unterstellten in den USA)." },
  { url: "https://www.gallup.com/workplace/713063/ai-workplace-productivity.aspx", en: "Gallup, AI use at work, second quarter of 2026 (US).", sq: "Gallup, përdorimi i AI-së në punë, tremujori i dytë 2026 (SHBA).", de: "Gallup, KI-Nutzung am Arbeitsplatz, zweites Quartal 2026 (USA)." },
  { url: "https://www.gallup.com/workplace/712433/employee-engagement-remains-flat-adoption-accelerates.aspx", en: "Gallup, “Employee Engagement Remains Flat as AI Adoption Accelerates” (manager support and AI).", sq: "Gallup, “Employee Engagement Remains Flat as AI Adoption Accelerates” (mbështetja e menaxherit dhe AI).", de: "Gallup, „Employee Engagement Remains Flat as AI Adoption Accelerates“ (Unterstützung durch Führungskräfte und KI)." },
  { url: "https://www.gartner.com/en/newsroom/press-releases/2024-10-22-gartner-unveils-top-predictions-for-it-organizations-and-users-in-2025-and-beyond", en: "Gartner, “Top Predictions for IT Organizations and Users in 2025 and Beyond”, 22 October 2024.", sq: "Gartner, “Top Predictions for IT Organizations and Users in 2025 and Beyond”, 22 tetor 2024.", de: "Gartner, „Top Predictions for IT Organizations and Users in 2025 and Beyond“, 22. Oktober 2024." },
];

const issue1 = {
  number: 1,
  slug: "nga-terreni-01",
  month: "2026-10",
  essays: { from: "2026-10-01", to: "2026-10-31" },
  tool: "/tools/kpi-diagnostic/",
  alertFirst: true,
  sources,
  en: {
    date: "October 2026",
    theme: "The manager in the middle",
    themeSub: "Data, AI and the decision",
    coverStat: { n: "22%", text: "of managers worldwide were engaged at work in 2025, down from 31% in 2022." },
    contents: [
      ["trend", "The manager in the middle"],
      ["floor", "Stiven Janaqi on energy, training, large teams and noise"],
      ["tool", "The KPI Diagnostic"],
      ["essays", "The series “Ten years close to the work”, complete"],
      ["question", "Reaction or system?"],
    ],
    trend: {
      title: "The manager in the middle",
      lead: "The latest data show something many people in operations have felt for a long time: the pressure gathers at the manager.",
      stats: [
        { n: "20%", t: "of employees worldwide engaged in 2025" },
        { n: "31% → 22%", t: "managers engaged, 2022 to 2025" },
        { n: "12%", t: "Europe, the lowest region" },
        { n: "< 50%", t: "of managers have had any management training" },
      ],
      parts: [
        { h: "Engagement is falling, and falling most among managers.", p: "According to Gallup's State of the Global Workplace 2026, only 20% of employees worldwide were engaged at work in 2025, down from 23% in 2022. It was the second year of decline in a row. The steepest fall was among managers: from 31% in 2022 to 27% in 2024 and 22% in 2025. Employees without a management role stand at 19%. For years managers were clearly more engaged than their teams. That advantage has almost disappeared." },
        { h: "Training makes a difference, but most do not get it.", p: "Fewer than half of the world's managers say they have had any management training. Trained managers are half as likely to be actively disengaged as untrained ones. In best-practice organisations, manager engagement reaches 79%. The decline is not a law of nature." },
        { h: "The manager sets most of a team's climate.", p: "Gallup estimates that about 70% of the variance in a team's engagement is linked to its manager." },
        { h: "Teams are growing, but not everywhere alike.", p: "In the US, the average number of direct reports per manager rose from 8.2 in 2013 to 12.1 in 2025. The median stays around 6. The average rises because some teams have become very large, not because every manager has more people." },
        { h: "And now AI arrives, through the manager.", p: "In the second quarter of 2026, according to Gallup, 51% of US leaders used AI a few times a week or more, up from 17% in 2023. Among managers the figure is 36%, up from 15%; among employees without a management role, 26%, up from 9%. Employees whose manager actively supports the team's use of AI use it 2.1 times as often, and their engagement is 48%, against 30% for the others. With frequent use, a clear plan and a supportive manager together, engagement reaches 53%." },
        { h: "A prediction, not a measurement.", p: "In October 2024 Gartner predicted that through 2026, one in five organisations would use AI to flatten their structure, eliminating more than half of current middle management positions." },
      ],
      meaning: { h: "What it means", p: "The data do not say that managers are the problem. They say that the manager is the point where targets from above, problems from the floor, data and now AI meet. An organisation that expects more from this person has to give more too: training, clear priorities and less noise." },
    },
    floor: {
      intro: "Stiven Janaqi has been a Team Leader and an Area Manager in last-mile logistics and works today as a Night Auditor in hospitality.",
      qa: [
        { q: "When you were promoted, what took most of your energy?", a: [
          "When I moved from a role closer to the operation to Area Manager, after about five months, the challenge was no longer only solving the problems of the moment. I had 4 Shift Leaders and 8 Dispatchers reporting to me directly, while the operation included around 250 drivers indirectly. Most of my energy went into moving constantly from one problem to the next: KPIs, delays, quality, damage, loading, safety, and people who needed decisions or support.",
          "What wears you out is not always the size of a problem. It is the number of small problems that need attention at the same time.",
        ] },
        { q: "Did you get management training?", a: [
          "I do not have certain information that would let me say I received a formal management training programme at that moment, so I would not present it as a fact. What would have helped me a lot is an onboarding made for the move from operator to manager: how to prioritise, how to delegate, how to give feedback, how to develop people, and how to tell a problem that needs you from a problem the team should solve itself.",
          "Many people are promoted because they are good at the operational work. But the manager's job needs a different set of skills.",
        ] },
        { q: "Does it ring true that managers can be as disengaged as their teams?", a: [
          "Yes, it seems credible from what I have seen. Not because managers do not want to do their job, but because they are often the point where all the pressures gather. From above come the targets, the KPIs and the deadlines. From below come people's problems, absences, conflicts and the reality of the operation. In between are the reports, the meetings and the admin.",
          "When this goes on for long, a manager can slide from leading the team to reacting to problems. At that point the energy for coaching, development and improvement is gone.",
        ] },
        { q: "How many direct reports are too many in operations?", a: [
          "I do not believe in a universal number. It depends on how complex the work is and how autonomous the people are. But from my experience, 12 direct reports in a fast-paced operation is already a serious span. If each of them needs feedback, coaching, problem-solving and escalation, the quality of management can drop very quickly.",
          "The problem is not only how many people you have on the org chart. The question is: how many of them can you really give the attention your role demands?",
        ] },
        { q: "One thing an organisation could do tomorrow for its first-line managers?", a: [
          "Give them clarity on priorities and take away part of the administrative noise. A first-line manager should not spend most of the day producing reports about the work they should be managing.",
          "I would set up a simple rhythm: a few KPIs that matter, open problems with a clear owner, a short moment for the people, and a defined channel for escalation. If everything is a priority, in the end the manager only reacts.",
        ] },
      ],
      closing: "When I started leading larger operations, I thought my job was to have as many answers as possible. Over time I understood that the most valuable part of the role was knowing which problems really needed my attention. A manager who reacts to everything quickly becomes part of the problem. A manager who tells the signal from the noise can start building a system.",
    },
    tool: {
      text: "A number turned red. Before you push harder, find out where the cause sits. Ten statements show whether it lies in clarity, skill, capacity, process design or ownership, with three first moves and a question for the floor. It takes about two minutes, and nothing you enter is stored or sent.",
      formula: ["Red KPI", "segment", "find the concentration", "go to the process", "ask why", "try a change", "measure again"],
      quote: "A KPI does not give you the answer. It shows you where to start asking questions.",
    },
    essays: {
      intro: "In October the series “Ten years close to the work” was published complete: twelve essays in English, German and Albanian.",
      pick: "For this issue: essay 3 on KPIs, essay 5 on people, and essay 10 on the limits of responsibility.",
    },
    question: "How much of your day as a manager goes into reacting to problems, and how much into building what prevents them?",
  },
  sq: {
    date: "Tetor 2026",
    theme: "Menaxheri në mes",
    themeSub: "Të dhënat, AI dhe vendimi",
    coverStat: { n: "22%", text: "e menaxherëve në botë ishin të angazhuar në punë në 2025, nga 31% në 2022." },
    contents: [
      ["trend", "Menaxheri në mes"],
      ["floor", "Stiven Janaqi për energjinë, trajnimin, ekipet e mëdha dhe zhurmën"],
      ["tool", "Diagnostikimi i KPI-së"],
      ["essays", "Seria “Dhjetë vite pranë punës”, e plotë"],
      ["question", "Reagim apo sistem?"],
    ],
    trend: {
      title: "Menaxheri në mes",
      lead: "Të dhënat e fundit tregojnë diçka që shumë njerëz në operacione e ndiejnë prej kohësh: presioni mblidhet te menaxheri.",
      stats: [
        { n: "20%", t: "e punonjësve në botë të angazhuar në 2025" },
        { n: "31% → 22%", t: "menaxherë të angazhuar, 2022 deri 2025" },
        { n: "12%", t: "Evropa, rajoni më i ulët" },
        { n: "< 50%", t: "e menaxherëve kanë marrë ndonjë trajnim për menaxhim" },
      ],
      parts: [
        { h: "Angazhimi bie, dhe bie më shumë te menaxherët.", p: "Sipas raportit State of the Global Workplace 2026 të Gallup, vetëm 20% e punonjësve në botë ishin të angazhuar në punë në vitin 2025, nga 23% në 2022. Ishte viti i dytë rresht me rënie. Rënia më e madhe ishte te menaxherët: nga 31% në 2022 në 27% në 2024 dhe në 22% në 2025. Punonjësit pa rol menaxheri janë në 19%. Për vite me radhë, menaxherët ishin dukshëm më të angazhuar se ekipet e tyre. Ky avantazh pothuajse është zhdukur." },
        { h: "Trajnimi bën diferencë, por shumica nuk e marrin.", p: "Më pak se gjysma e menaxherëve në botë thonë se kanë marrë ndonjë trajnim për menaxhim. Menaxherët e trajnuar janë gjysma më pak të shkëputur aktivisht nga puna sesa ata pa trajnim. Në organizatat me praktikat më të mira, angazhimi i menaxherëve arrin 79%. Rënia nuk është ligj natyre." },
        { h: "Menaxheri përcakton pjesën më të madhe të klimës së ekipit.", p: "Gallup vlerëson se rreth 70% e ndryshimit në angazhimin e një ekipi lidhet me menaxherin." },
        { h: "Ekipet po zmadhohen, por jo kudo njësoj.", p: "Në SHBA, numri mesatar i vartësve direkt për menaxher u rrit nga 8,2 në 2013 në 12,1 në 2025. Mediana mbetet rreth 6. Mesatarja rritet sepse disa ekipe janë bërë shumë të mëdha, jo sepse çdo menaxher ka më shumë njerëz." },
        { h: "Dhe tani vjen AI, përmes menaxherit.", p: "Në tremujorin e dytë të 2026, sipas Gallup, në SHBA 51% e drejtuesve të lartë përdorin AI disa herë në javë ose më shpesh, nga 17% në 2023. Te menaxherët shifra është 36%, nga 15%; te punonjësit pa rol menaxheri, 26%, nga 9%. Punonjësit, menaxheri i të cilëve e mbështet aktivisht përdorimin e AI-së, e përdorin atë 2,1 herë më shpesh, dhe angazhimi i tyre është 48%, kundrejt 30% te të tjerët. Kur ka përdorim të shpeshtë, një plan të qartë dhe mbështetje nga menaxheri, angazhimi arrin 53%." },
        { h: "Një parashikim, jo një matje.", p: "Në tetor 2024, Gartner parashikoi se deri në 2026 një e pesta e organizatave do ta përdorin AI-n për të rrafshuar strukturën dhe do të heqin më shumë se gjysmën e pozicioneve aktuale të menaxhimit të mesëm." },
      ],
      meaning: { h: "Çfarë do të thotë kjo", p: "Të dhënat nuk thonë se menaxherët janë problemi. Thonë se menaxheri është pika ku takohen objektivat nga lart, problemet nga terreni, të dhënat dhe tani edhe AI. Një organizatë që pret më shumë nga ky person duhet t'i japë edhe më shumë: trajnim, prioritete të qarta dhe më pak zhurmë." },
    },
    floor: {
      intro: "Stiven Janaqi ka qenë Team Leader dhe Area Manager në logjistikën e miljes së fundit, dhe sot punon si Night Auditor në hoteleri.",
      qa: [
        { q: "Kur u ngrite në detyrë, çfarë ta harxhonte më shumë energjinë?", a: [
          "Kur kalova nga një rol më afër operacionit në Area Manager, pas rreth pesë muajsh, sfida nuk ishte më vetëm të zgjidhja problemet e momentit. Kisha 4 Shift Leaders dhe 8 Dispatchers në strukturën direkte, ndërsa operacioni përfshinte rreth 250 shoferë indirekt. Energjia më e madhe shkonte te kalimi i vazhdueshëm nga një problem te tjetri: KPI, vonesa, cilësi, dëmtime, ngarkim, siguri dhe njerëz që kishin nevojë për vendime ose mbështetje.",
          "Ajo që të lodh nuk është gjithmonë madhësia e një problemi. Është numri i problemeve të vogla që kërkojnë vëmendje njëkohësisht.",
        ] },
        { q: "A more trajnim për menaxhim?", a: [
          "Nuk kam informacion të sigurt që më lejon të them se kam marrë një program formal trajnimi menaxherial në atë moment, ndaj nuk do ta fus si fakt. Ajo që do të më kishte ndihmuar shumë do të ishte një onboarding specifik për kalimin nga operator në menaxher: si të prioritizosh, si të delegosh, si të japësh feedback, si të zhvillosh njerëzit dhe si të dallosh një problem që kërkon ndërhyrjen tënde nga një problem që ekipi duhet ta zgjidhë vetë.",
          "Shumë njerëz promovohen sepse janë të mirë në punën operative. Por puna e menaxherit kërkon një grup tjetër aftësish.",
        ] },
        { q: "A të duket e vërtetë që menaxherët mund të jenë po aq pak të angazhuar sa ekipet e tyre?", a: [
          "Po, më duket e besueshme nga ajo që kam parë. Jo sepse menaxherët nuk duan të bëjnë punën e tyre, por sepse shpesh janë pika ku mblidhen të gjitha presionet. Nga lart vijnë objektivat, KPI-të dhe afatet. Nga poshtë vijnë problemet e njerëzve, mungesat, konfliktet dhe realiteti i operacionit. Në mes janë raportet, takimet dhe administrata.",
          "Kur kjo vazhdon gjatë, menaxheri mund të kalojë nga drejtimi i ekipit te reagimi ndaj problemeve. Në atë moment humbet energjia për coaching, zhvillim dhe përmirësim.",
        ] },
        { q: "Sa vartës direkt janë shumë në operacione?", a: [
          "Nuk besoj te një numër universal. Varet nga kompleksiteti i punës dhe sa autonomë janë njerëzit. Por nga eksperienca ime, 12 persona direkt në një operacion me ritëm të lartë janë tashmë një span serioz. Nëse secili prej tyre kërkon feedback, coaching, zgjidhje problemesh dhe eskalim, cilësia e menaxhimit mund të bjerë shumë shpejt.",
          "Problemi nuk është vetëm sa njerëz ke në organigramë. Pyetja është: sa prej tyre mund t'u japësh realisht vëmendjen që kërkon roli yt?",
        ] },
        { q: "Një gjë që një organizatë mund ta bëjë nesër për menaxherët e linjës së parë?", a: [
          "T'u japë qartësi mbi prioritetet dhe t'u heqë një pjesë të zhurmës administrative. Një menaxher i linjës së parë nuk duhet të kalojë pjesën më të madhe të ditës duke prodhuar raporte për punën që duhet të ishte duke menaxhuar.",
          "Do të krijoja një ritëm të thjeshtë: pak KPI që kanë rëndësi, probleme të hapura me owner të qartë, një moment të shkurtër për njerëzit dhe një kanal të përcaktuar për eskalim. Nëse çdo gjë është prioritet, menaxheri në fund vetëm reagon.",
        ] },
      ],
      closing: "Kur fillova të drejtoja operacione më të mëdha, mendova se detyra ime ishte të kisha sa më shumë përgjigje. Me kohën kuptova se pjesa më e vlefshme e rolit ishte të dija cilat probleme kërkonin vërtet vëmendjen time. Menaxheri që reagon ndaj gjithçkaje bëhet shpejt pjesë e problemit. Menaxheri që dallon sinjalin nga zhurma mund të fillojë të ndërtojë sistem.",
    },
    tool: {
      text: "Një shifër u bë e kuqe. Para se të shtyni më fort, gjeni ku është shkaku. Dhjetë pohime tregojnë nëse shkaku është te qartësia, aftësia, kapaciteti, procesi apo përgjegjësia, me tre hapa të parë dhe një pyetje për ekipin. Zgjat rreth dy minuta, dhe asgjë që shkruani nuk ruhet e nuk dërgohet.",
      formula: ["KPI i kuq", "segmento", "gjej përqendrimin", "shko në proces", "pyet pse", "provo një ndryshim", "mat përsëri"],
      quote: "Një KPI nuk të jep përgjigjen. Të tregon ku duhet të fillosh të bësh pyetje.",
    },
    essays: {
      intro: "Në tetor u publikua e plotë seria “Dhjetë vite pranë punës”: dymbëdhjetë ese në shqip, anglisht dhe gjermanisht.",
      pick: "Për këtë numër: eseja 3 për KPI-të, eseja 5 për njerëzit dhe eseja 10 për kufijtë e përgjegjësisë.",
    },
    question: "Sa nga dita juaj si menaxher shkon te reagimi ndaj problemeve, dhe sa te ndërtimi i asaj që i parandalon ato?",
  },
  de: {
    date: "Oktober 2026",
    theme: "Die Führungskraft in der Mitte",
    themeSub: "Daten, KI und die Entscheidung",
    coverStat: { n: "22 %", text: "der Führungskräfte weltweit waren 2025 engagiert, nach 31 % im Jahr 2022." },
    contents: [
      ["trend", "Die Führungskraft in der Mitte"],
      ["floor", "Stiven Janaqi über Energie, Training, große Teams und Lärm"],
      ["tool", "Die KPI-Diagnose"],
      ["essays", "Die Reihe „Zehn Jahre nah an der Arbeit“, vollständig"],
      ["question", "Reaktion oder System?"],
    ],
    trend: {
      title: "Die Führungskraft in der Mitte",
      lead: "Die neuesten Daten zeigen etwas, das viele im Betrieb schon lange spüren: Der Druck sammelt sich bei der Führungskraft.",
      stats: [
        { n: "20 %", t: "der Beschäftigten weltweit engagiert, 2025" },
        { n: "31 % → 22 %", t: "engagierte Führungskräfte, 2022 bis 2025" },
        { n: "12 %", t: "Europa, die niedrigste Region" },
        { n: "< 50 %", t: "der Führungskräfte hatten je ein Führungstraining" },
      ],
      parts: [
        { h: "Das Engagement sinkt, und am stärksten bei Führungskräften.", p: "Laut Gallups State of the Global Workplace 2026 waren 2025 nur 20 % der Beschäftigten weltweit bei der Arbeit engagiert, nach 23 % im Jahr 2022. Es war das zweite Jahr in Folge mit einem Rückgang. Am stärksten fiel er bei Führungskräften: von 31 % im Jahr 2022 auf 27 % 2024 und 22 % 2025. Beschäftigte ohne Führungsrolle liegen bei 19 %. Jahrelang waren Führungskräfte deutlich engagierter als ihre Teams. Dieser Vorsprung ist fast verschwunden." },
        { h: "Training macht einen Unterschied, aber die meisten bekommen keins.", p: "Weniger als die Hälfte der Führungskräfte weltweit sagt, je ein Führungstraining erhalten zu haben. Geschulte Führungskräfte sind nur halb so oft aktiv unengagiert wie ungeschulte. In Best-Practice-Organisationen erreicht das Engagement der Führungskräfte 79 %. Der Rückgang ist kein Naturgesetz." },
        { h: "Die Führungskraft prägt den größten Teil des Teamklimas.", p: "Gallup schätzt, dass rund 70 % der Unterschiede im Engagement eines Teams mit seiner Führungskraft zusammenhängen." },
        { h: "Teams werden größer, aber nicht überall gleich.", p: "In den USA stieg die durchschnittliche Zahl direkt Unterstellter pro Führungskraft von 8,2 im Jahr 2013 auf 12,1 im Jahr 2025. Der Median bleibt bei etwa 6. Der Durchschnitt steigt, weil einige Teams sehr groß geworden sind, nicht weil jede Führungskraft mehr Menschen hat." },
        { h: "Und jetzt kommt KI, über die Führungskraft.", p: "Im zweiten Quartal 2026 nutzten laut Gallup in den USA 51 % der obersten Führungskräfte KI mehrmals pro Woche oder öfter, nach 17 % im Jahr 2023. Bei Führungskräften sind es 36 %, nach 15 %; bei Beschäftigten ohne Führungsrolle 26 %, nach 9 %. Beschäftigte, deren Führungskraft die KI-Nutzung im Team aktiv unterstützt, nutzen sie 2,1-mal so häufig, und ihr Engagement liegt bei 48 %, gegenüber 30 % bei den anderen. Mit häufiger Nutzung, einem klaren Plan und unterstützender Führungskraft zusammen erreicht das Engagement 53 %." },
        { h: "Eine Prognose, keine Messung.", p: "Im Oktober 2024 prognostizierte Gartner, dass bis 2026 jede fünfte Organisation KI nutzen wird, um ihre Struktur abzuflachen, und dabei mehr als die Hälfte der heutigen Positionen im mittleren Management streicht." },
      ],
      meaning: { h: "Was das bedeutet", p: "Die Daten sagen nicht, dass Führungskräfte das Problem sind. Sie sagen, dass die Führungskraft der Punkt ist, an dem sich Ziele von oben, Probleme aus dem Betrieb, Daten und jetzt auch KI treffen. Eine Organisation, die mehr von dieser Person erwartet, muss ihr auch mehr geben: Training, klare Prioritäten und weniger Lärm." },
    },
    floor: {
      intro: "Stiven Janaqi war Team Leader und Area Manager in der Last-Mile-Logistik und arbeitet heute als Night Auditor in der Hotellerie.",
      qa: [
        { q: "Was hat Sie nach der Beförderung die meiste Energie gekostet?", a: [
          "Als ich nach etwa fünf Monaten von einer Rolle näher am Betrieb zum Area Manager wurde, ging es nicht mehr nur darum, die Probleme des Moments zu lösen. Ich hatte 4 Shift Leaders und 8 Dispatcher direkt unter mir, und zum Betrieb gehörten indirekt rund 250 Fahrer. Die meiste Energie ging in den ständigen Wechsel von einem Problem zum nächsten: KPIs, Verspätungen, Qualität, Schäden, Beladung, Sicherheit und Menschen, die Entscheidungen oder Unterstützung brauchten.",
          "Was einen müde macht, ist nicht immer die Größe eines Problems. Es ist die Zahl der kleinen Probleme, die gleichzeitig Aufmerksamkeit brauchen.",
        ] },
        { q: "Haben Sie ein Führungstraining bekommen?", a: [
          "Ich habe keine sichere Information, die mir erlaubt zu sagen, dass ich damals ein formales Führungstrainingsprogramm bekommen habe, deshalb stelle ich es nicht als Tatsache dar. Sehr geholfen hätte mir ein Onboarding speziell für den Schritt vom Operator zur Führungskraft: wie man priorisiert, wie man delegiert, wie man Feedback gibt, wie man Menschen entwickelt und wie man ein Problem, das einen selbst braucht, von einem unterscheidet, das das Team selbst lösen sollte.",
          "Viele werden befördert, weil sie in der operativen Arbeit gut sind. Aber die Arbeit einer Führungskraft verlangt andere Fähigkeiten.",
        ] },
        { q: "Klingt es glaubwürdig, dass Führungskräfte so wenig engagiert sein können wie ihre Teams?", a: [
          "Ja, nach dem, was ich gesehen habe, ist das glaubwürdig. Nicht weil Führungskräfte ihre Arbeit nicht machen wollen, sondern weil sie oft der Punkt sind, an dem sich der ganze Druck sammelt. Von oben kommen Ziele, KPIs und Fristen. Von unten kommen die Probleme der Menschen, Ausfälle, Konflikte und die Realität des Betriebs. Dazwischen liegen Berichte, Meetings und Verwaltung.",
          "Wenn das lange anhält, kann eine Führungskraft vom Führen des Teams ins Reagieren auf Probleme rutschen. Dann fehlt die Energie für Coaching, Entwicklung und Verbesserung.",
        ] },
        { q: "Wie viele direkt Unterstellte sind im Betrieb zu viele?", a: [
          "Ich glaube nicht an eine universelle Zahl. Es hängt davon ab, wie komplex die Arbeit ist und wie selbstständig die Menschen sind. Aber nach meiner Erfahrung sind 12 direkt Unterstellte in einem Betrieb mit hohem Tempo schon eine ernsthafte Spanne. Wenn jeder von ihnen Feedback, Coaching, Problemlösung und Eskalation braucht, kann die Qualität der Führung sehr schnell sinken.",
          "Das Problem ist nicht nur, wie viele Menschen im Organigramm stehen. Die Frage ist: Wie vielen von ihnen können Sie wirklich die Aufmerksamkeit geben, die Ihre Rolle verlangt?",
        ] },
        { q: "Eine Sache, die eine Organisation morgen für ihre Führungskräfte der ersten Ebene tun könnte?", a: [
          "Ihnen Klarheit über die Prioritäten geben und ihnen einen Teil des Verwaltungslärms abnehmen. Eine Führungskraft der ersten Ebene sollte nicht den größten Teil des Tages damit verbringen, Berichte über die Arbeit zu schreiben, die sie eigentlich führen sollte.",
          "Ich würde einen einfachen Rhythmus schaffen: wenige KPIs, die zählen, offene Probleme mit klarem Owner, ein kurzer Moment für die Menschen und ein festgelegter Kanal für Eskalation. Wenn alles Priorität hat, reagiert die Führungskraft am Ende nur noch.",
        ] },
      ],
      closing: "Als ich anfing, größere Betriebe zu führen, dachte ich, meine Aufgabe sei es, möglichst viele Antworten zu haben. Mit der Zeit habe ich verstanden, dass der wertvollste Teil der Rolle war zu wissen, welche Probleme wirklich meine Aufmerksamkeit brauchten. Eine Führungskraft, die auf alles reagiert, wird schnell Teil des Problems. Eine Führungskraft, die das Signal vom Rauschen unterscheidet, kann anfangen, ein System aufzubauen.",
    },
    tool: {
      text: "Eine Zahl ist rot geworden. Bevor Sie stärker drücken, finden Sie heraus, wo die Ursache liegt. Zehn Aussagen zeigen, ob sie bei Klarheit, Können, Kapazität, Prozessgestaltung oder Verantwortung liegt, mit drei ersten Schritten und einer Frage an das Team. Das dauert etwa zwei Minuten, und nichts, was Sie eingeben, wird gespeichert oder gesendet.",
      formula: ["Roter KPI", "segmentieren", "die Häufung finden", "zum Prozess gehen", "warum fragen", "eine Änderung testen", "neu messen"],
      quote: "Ein KPI gibt Ihnen nicht die Antwort. Er zeigt Ihnen, wo Sie anfangen sollten, Fragen zu stellen.",
    },
    essays: {
      intro: "Im Oktober erschien die Reihe „Zehn Jahre nah an der Arbeit“ vollständig: zwölf Essays auf Deutsch, Englisch und Albanisch.",
      pick: "Für diese Ausgabe: Essay 3 über KPIs, Essay 5 über Menschen und Essay 10 über die Grenzen der Verantwortung.",
    },
    question: "Wie viel Ihres Tages als Führungskraft geht in die Reaktion auf Probleme, und wie viel in den Aufbau dessen, was sie verhindert?",
  },
};


const sources2 = [
  { url: "https://bpex-ev.de/kep-branche/zahlen-und-fakten.html", en: "BPEX (the German parcel and express association, formerly BIEK), facts and figures: shipments in Germany in 2025.", sq: "BPEX (shoqata gjermane e pakove dhe ekspresit, ish-BIEK), fakte dhe shifra: dërgesat në Gjermani në 2025.", de: "BPEX (Bundesverband Paket und Expresslogistik, ehemals BIEK), Zahlen und Fakten: Sendungen in Deutschland 2025." },
  { url: "https://www.bpex-ev.de/presse/meldung/ausblick-weihnachtsgeschaeft-2025.html", en: "BPEX, “Ausblick Weihnachtsgeschäft 2025”, November 2025: shipments in November and December, peak days, extra staff and vehicles.", sq: "BPEX, “Ausblick Weihnachtsgeschäft 2025”, nëntor 2025: dërgesat e nëntorit dhe dhjetorit, ditët e pikut, punonjësit dhe automjetet shtesë.", de: "BPEX, „Ausblick Weihnachtsgeschäft 2025“, November 2025: Sendungen im November und Dezember, Spitzentage, zusätzliche Beschäftigte und Fahrzeuge." },
  { url: "https://statistik.arbeitsagentur.de/DE/Statischer-Content/Statistiken/Themen-im-Fokus/Fachkraeftebedarf/Fachkraefteengpassanalyse/Fachkraefteengpassanalyse.html", en: "Bundesagentur für Arbeit, Fachkräfteengpassanalyse 2025: occupations with a shortage of skilled workers.", sq: "Bundesagentur für Arbeit, Fachkräfteengpassanalyse 2025: profesionet me mungesë fuqie punëtore të kualifikuar.", de: "Bundesagentur für Arbeit, Fachkräfteengpassanalyse 2025: Berufe mit Fachkräfteengpass." },
  { url: "https://www.gallup.com/workplace/235121/why-onboarding-experience-key-retention.aspx", en: "Gallup, “Why the Onboarding Experience Is Key for Retention”, 2018, research first reported in State of the American Workplace (2017).", sq: "Gallup, “Why the Onboarding Experience Is Key for Retention”, 2018; kërkim i raportuar fillimisht te State of the American Workplace (2017).", de: "Gallup, „Why the Onboarding Experience Is Key for Retention“, 2018; Forschung, zuerst veröffentlicht in State of the American Workplace (2017)." },
];

const issue2 = {
  number: 2,
  slug: "nga-terreni-02",
  month: "2026-11",
  tool: "/tools/shift-handover/",
  // Three essays from the series instead of the month's essays: no new essay was published in November.
  reading: ["why-the-handover-is-underrated", "a-good-sop-is-not-a-document", "what-last-mile-taught-me"],
  floorSplit: [[0, 2], [2, 3]],
  sources: sources2,
  en: {
    date: "November 2026",
    theme: "When the load rises",
    themeSub: "Pressure does not always create the problems. It makes them visible",
    coverStat: { n: "750 m", text: "parcel and express shipments were expected in Germany in November and December 2025 alone." },
    contents: [
      ["trend", "Peak season"],
      ["floor", "Stiven Janaqi on days when demand runs above forecast"],
      ["tool", "The Shift Handover"],
      ["read", "Three essays from the series “Ten years close to the work”"],
      ["question", "Which standard breaks first?"],
    ],
    trend: {
      title: "Peak season",
      lead: "November opens the busiest season in logistics. For many teams it means more volume, less time and more new people, all at once.",
      stats: [
        { n: "4.37 bn", t: "parcel and express shipments in Germany in 2025" },
        { n: "~750 m", t: "expected in November and December 2025" },
        { n: "21 m", t: "shipments on the busiest days" },
        { n: "20,000", t: "extra workers for the season" },
      ],
      parts: [
        { h: "Volume keeps growing, but more slowly.", p: "In 2025 about 4.37 billion courier, express and parcel shipments were moved in Germany, about 2% more than a year earlier. Growth continues, but more slowly than expected." },
        { h: "The last two months of the year are a world of their own.", p: "For November and December 2025, the industry association BPEX expected about 750 million shipments, 1 to 2% more than a year earlier. At the height of the season the networks move on average about 15 million shipments a day, and up to 21 million on the busiest days." },
        { h: "Extra capacity is mostly new people.", p: "To handle the season, companies in the industry were adding up to 20,000 workers and 17,000 vehicles." },
        { h: "And people are hard to find.", p: "According to the Federal Employment Agency's analysis for 2025, Germany had a shortage of skilled workers in 157 occupations, and professional drivers are among the occupations where demand remains high." },
        { h: "Onboarding is the weak point.", p: "In Gallup research first reported in 2017 and 2018, only 12% of employees strongly agreed that their organisation does a great job of onboarding new employees. It is not a measurement from this year, but the question returns every time a team grows with new people under pressure." },
      ],
      meaning: { h: "What it means", p: "At the peak, an operation has no time to learn. What is not clear before the volume rises shows up during it: as a mistake, as a delay, or as a problem for the next shift." },
    },
    floor: {
      intro: "Stiven Janaqi has been a Team Leader and an Area Manager in last-mile logistics and works today as a Night Auditor in hospitality.",
      qa: [
        { q: "What happens to an operation when the load rises?", a: [
          "The peak does not always create the problems. Often it only makes them visible.",
          "When volume rises, an unclear SOP becomes a mistake. Incomplete training becomes a delay or a quality problem. Weak communication becomes the next shift's problem. Capacity that looked enough on a normal day starts to show its limits.",
        ] },
        { q: "What have you seen on days when demand ran above forecast?", a: [
          "I have had days when demand ran above forecast. Drivers had to be brought in at short notice, and there were drivers in ramp-up who were not yet fully aligned with the SOPs.",
          "On such a day the damage rate went above target, with several concrete cases of damage during the operation. For me that is the clearest proof that operational pressure shows up directly in quality. New people under pressure expose the weakness of the standard straight away.",
        ] },
        { q: "What would you do differently today?", a: [
          "Today I would invest more before the load than during it. Once the pressure has started, the time to learn the process becomes much more expensive.",
          "Capacity is not only a number of people. It is the number of people who can carry out the process to standard.",
        ] },
      ],
      closing: "The peak does not always create the problems. Often it only makes them visible.",
    },
    tool: {
      text: "When volume rises, personal memory becomes less reliable. The handover becomes the memory of the operation. The Shift Handover on Stiven Catalyst builds one in a few minutes: the numbers, open issues with an owner and a time, heads-ups and safety. “Fill in from the logs” takes the numbers from the damage, incomplete and delay logs, and everything stays in your browser.",
      formulaTitle: "Five fields under pressure",
      formula: ["What changed", "What remains open", "Who owns it", "By when", "What the next shift must know"],
      quote: "When volume rises, personal memory becomes less reliable. The handover becomes the memory of the operation.",
    },
    reading: {
      intro: "From the series “Ten years close to the work”:",
      notes: ["The handover as a transfer of responsibility.", "The standard that holds under pressure.", "The live operation and its indicators."],
    },
    question: "If your volume rose by a third tomorrow, which standard would break first?",
  },
  sq: {
    date: "Nëntor 2026",
    theme: "Kur ngarkesa rritet",
    themeSub: "Presioni nuk i krijon gjithmonë problemet. I bën të dukshme",
    coverStat: { n: "750 mln", text: "dërgesa korrier dhe pako priteshin në Gjermani vetëm në nëntor dhe dhjetor 2025." },
    contents: [
      ["trend", "Sezoni i pikut"],
      ["floor", "Stiven Janaqi për ditët me kërkesë mbi parashikim"],
      ["tool", "Dorëzimi i turnit"],
      ["read", "Tri ese nga seria “Dhjetë vite pranë punës”"],
      ["question", "Cili standard prishet i pari?"],
    ],
    trend: {
      title: "Sezoni i pikut",
      lead: "Nëntori hap sezonin më të ngarkuar në logjistikë. Për shumë ekipe, kjo do të thotë më shumë vëllim, më pak kohë dhe më shumë njerëz të rinj në të njëjtën kohë.",
      stats: [
        { n: "4,37 mld", t: "dërgesa korrier dhe pako në Gjermani në 2025" },
        { n: "~750 mln", t: "të pritura në nëntor dhe dhjetor 2025" },
        { n: "21 mln", t: "dërgesa në ditët më të ngarkuara" },
        { n: "20.000", t: "punonjës shtesë për sezonin" },
      ],
      parts: [
        { h: "Vëllimi rritet, por më ngadalë.", p: "Në vitin 2025, në Gjermani u transportuan rreth 4,37 miliardë dërgesa korrier, ekspres dhe pako, rreth 2% më shumë se një vit më parë. Rritja vazhdon, por është më e ngadaltë nga sa pritej." },
        { h: "Dy muajt e fundit të vitit janë një botë më vete.", p: "Për nëntorin dhe dhjetorin e 2025, shoqata e branshit BPEX priste rreth 750 milionë dërgesa, 1 deri në 2% më shumë se një vit më parë. Në pikun e sezonit, rrjetet lëvizin mesatarisht rreth 15 milionë dërgesa në ditë, dhe deri në 21 milionë në ditët më të ngarkuara." },
        { h: "Kapaciteti shtesë është kryesisht njerëz të rinj.", p: "Për të përballuar sezonin, kompanitë e branshit shtonin deri në 20.000 punonjës dhe 17.000 automjete shtesë." },
        { h: "Dhe njerëzit nuk gjenden lehtë.", p: "Sipas analizës së Agjencisë Federale të Punës për 2025, Gjermania kishte mungesë fuqie punëtore të kualifikuar në 157 profesione, dhe shoferët profesionistë janë ndër profesionet ku kërkesa mbetet e lartë." },
        { h: "Integrimi i të rinjve është pika e dobët.", p: "Në kërkimin e Gallup të raportuar fillimisht në 2017 dhe 2018, vetëm 12% e punonjësve pajtoheshin fort se organizata e tyre e bën shumë mirë integrimin e të rinjve. Nuk është matje e këtij viti, por pyetja kthehet sa herë që një ekip shtohet me njerëz të rinj nën presion." },
      ],
      meaning: { h: "Çfarë do të thotë kjo", p: "Në pik, një operacion nuk ka kohë të mësojë. Ajo që nuk është e qartë para se të rritet vëllimi, shfaqet gjatë tij: si gabim, si vonesë ose si problem për turnin tjetër." },
    },
    floor: {
      intro: "Stiven Janaqi ka qenë Team Leader dhe Area Manager në logjistikën e miljes së fundit, dhe sot punon si Night Auditor në hoteleri.",
      qa: [
        { q: "Çfarë ndodh me një operacion kur ngarkesa rritet?", a: [
          "Piku nuk krijon gjithmonë problemet. Shpesh vetëm i bën të dukshme.",
          "Kur volumi rritet, SOP-ja e paqartë bëhet gabim. Trajnimi i paplotë bëhet vonesë ose problem cilësie. Komunikimi i dobët bëhet problem i turnit tjetër. Kapaciteti që dukej i mjaftueshëm në një ditë normale fillon të tregojë kufijtë e tij.",
        ] },
        { q: "Çfarë ke parë në ditët kur kërkesa doli mbi parashikim?", a: [
          "Kam pasur ditë kur kërkesa doli mbi forecast. U deshën shoferë me njoftim të shkurtër, dhe kishte shoferë në fazën e ramp-up që nuk ishin ende plotësisht të përafruar me SOP-të.",
          "Në një ditë të tillë, damage rate doli mbi target, me disa raste konkrete dëmtimesh gjatë operacionit. Për mua kjo është prova më e qartë se presioni operacional shfaqet direkt te cilësia. Njerëzit e rinj nën presion e ekspozojnë menjëherë dobësinë e standardizimit.",
        ] },
        { q: "Çfarë do të bëje ndryshe sot?", a: [
          "Sot do të investoja më shumë përpara ngarkesës sesa gjatë saj. Kur presioni ka filluar, koha për të mësuar procesin bëhet shumë më e shtrenjtë.",
          "Kapaciteti nuk është vetëm numër njerëzish. Është numër njerëzish që mund ta ekzekutojnë procesin në standard.",
        ] },
      ],
      closing: "Piku nuk krijon gjithmonë problemet. Shpesh vetëm i bën të dukshme.",
    },
    tool: {
      text: "Kur volumi rritet, kujtesa personale bëhet më pak e besueshme. Handover-i bëhet memoria e operacionit. Dorëzimi i turnit në Stiven Catalyst e ndërton këtë në pak minuta: shifrat, çështjet e hapura me përgjegjës dhe orë, paralajmërimet dhe sigurinë. “Plotëso nga regjistrat” i merr shifrat nga regjistrat e dëmeve, të plotësisë dhe të vonesave, dhe gjithçka mbetet në shfletuesin tuaj.",
      formulaTitle: "Pesë fusha nën presion",
      formula: ["Çfarë ndryshoi", "Çfarë mbetet e hapur", "Kush e mban", "Deri kur", "Çfarë duhet të dijë turni tjetër"],
      quote: "Kur volumi rritet, kujtesa personale bëhet më pak e besueshme. Handover-i bëhet memoria e operacionit.",
    },
    reading: {
      intro: "Nga seria “Dhjetë vite pranë punës”:",
      notes: ["Dorëzimi si transferim përgjegjësie.", "Standardi që funksionon nën presion.", "Operacioni live dhe treguesit e tij."],
    },
    question: "Nëse nesër vëllimi juaj do të rritej me një të tretën, cili standard do të prishej i pari?",
  },
  de: {
    date: "November 2026",
    theme: "Wenn die Last steigt",
    themeSub: "Druck schafft die Probleme nicht immer. Er macht sie sichtbar",
    coverStat: { n: "750 Mio.", text: "KEP-Sendungen wurden allein im November und Dezember 2025 in Deutschland erwartet." },
    contents: [
      ["trend", "Die Hochsaison"],
      ["floor", "Stiven Janaqi über Tage mit Nachfrage über Prognose"],
      ["tool", "Die Schichtübergabe"],
      ["read", "Drei Essays aus der Reihe „Zehn Jahre nah an der Arbeit“"],
      ["question", "Welcher Standard bricht zuerst?"],
    ],
    trend: {
      title: "Die Hochsaison",
      lead: "Der November eröffnet die arbeitsreichste Zeit in der Logistik. Für viele Teams heißt das: mehr Menge, weniger Zeit und mehr neue Leute, alles gleichzeitig.",
      stats: [
        { n: "4,37 Mrd.", t: "KEP-Sendungen in Deutschland 2025" },
        { n: "~750 Mio.", t: "erwartet im November und Dezember 2025" },
        { n: "21 Mio.", t: "Sendungen an Spitzentagen" },
        { n: "20.000", t: "zusätzliche Beschäftigte für die Saison" },
      ],
      parts: [
        { h: "Die Menge wächst, aber langsamer.", p: "2025 wurden in Deutschland rund 4,37 Milliarden Kurier-, Express- und Paketsendungen befördert, etwa 2 % mehr als im Vorjahr. Das Wachstum geht weiter, aber langsamer als erwartet." },
        { h: "Die letzten zwei Monate des Jahres sind eine eigene Welt.", p: "Für November und Dezember 2025 erwartete der Branchenverband BPEX rund 750 Millionen Sendungen, 1 bis 2 % mehr als im Vorjahr. In der Hochphase bewegen die Netze im Schnitt rund 15 Millionen Sendungen pro Tag, an Spitzentagen bis zu 21 Millionen." },
        { h: "Zusätzliche Kapazität sind vor allem neue Menschen.", p: "Für die Saison setzten die Unternehmen der Branche bis zu 20.000 zusätzliche Beschäftigte und 17.000 zusätzliche Fahrzeuge ein." },
        { h: "Und Menschen sind schwer zu finden.", p: "Laut der Fachkräfteengpassanalyse 2025 der Bundesagentur für Arbeit gab es in Deutschland in 157 Berufen einen Fachkräfteengpass, und Berufskraftfahrer gehören zu den Berufen, in denen die Nachfrage hoch bleibt." },
        { h: "Die Einarbeitung ist die Schwachstelle.", p: "In Gallup-Forschung, die zuerst 2017 und 2018 veröffentlicht wurde, stimmten nur 12 % der Beschäftigten voll zu, dass ihre Organisation neue Mitarbeitende sehr gut einarbeitet. Das ist keine Messung aus diesem Jahr, aber die Frage kehrt jedes Mal zurück, wenn ein Team unter Druck mit neuen Leuten wächst." },
      ],
      meaning: { h: "Was das bedeutet", p: "In der Spitze hat ein Betrieb keine Zeit zu lernen. Was vor dem Anstieg der Menge nicht klar ist, zeigt sich währenddessen: als Fehler, als Verspätung oder als Problem für die nächste Schicht." },
    },
    floor: {
      intro: "Stiven Janaqi war Team Leader und Area Manager in der Last-Mile-Logistik und arbeitet heute als Night Auditor in der Hotellerie.",
      qa: [
        { q: "Was passiert mit einem Betrieb, wenn die Last steigt?", a: [
          "Die Spitze schafft die Probleme nicht immer. Oft macht sie sie nur sichtbar.",
          "Wenn die Menge steigt, wird eine unklare SOP zum Fehler. Unvollständiges Training wird zur Verspätung oder zum Qualitätsproblem. Schwache Kommunikation wird zum Problem der nächsten Schicht. Kapazität, die an einem normalen Tag ausreichend aussah, zeigt ihre Grenzen.",
        ] },
        { q: "Was haben Sie an Tagen gesehen, an denen die Nachfrage über der Prognose lag?", a: [
          "Ich hatte Tage, an denen die Nachfrage über dem Forecast lag. Fahrer mussten kurzfristig geholt werden, und es gab Fahrer in der Ramp-up-Phase, die noch nicht vollständig mit den SOPs vertraut waren.",
          "An einem solchen Tag lag die Schadensquote über dem Ziel, mit mehreren konkreten Schadensfällen während des Betriebs. Für mich ist das der klarste Beweis, dass sich operativer Druck direkt in der Qualität zeigt. Neue Leute unter Druck legen die Schwäche der Standardisierung sofort offen.",
        ] },
        { q: "Was würden Sie heute anders machen?", a: [
          "Heute würde ich mehr vor der Last investieren als während der Last. Wenn der Druck einmal begonnen hat, wird die Zeit, den Prozess zu lernen, viel teurer.",
          "Kapazität ist nicht nur eine Zahl von Menschen. Es ist die Zahl der Menschen, die den Prozess im Standard ausführen können.",
        ] },
      ],
      closing: "Die Spitze schafft die Probleme nicht immer. Oft macht sie sie nur sichtbar.",
    },
    tool: {
      text: "Wenn die Menge steigt, wird das persönliche Gedächtnis weniger verlässlich. Die Übergabe wird zum Gedächtnis des Betriebs. Die Schichtübergabe von Stiven Catalyst baut sie in wenigen Minuten: die Zahlen, offene Punkte mit Verantwortlichem und Uhrzeit, Hinweise und Sicherheit. „Aus den Protokollen übernehmen“ holt die Zahlen aus den Protokollen für Schäden, Vollständigkeit und Verspätungen, und alles bleibt in Ihrem Browser.",
      formulaTitle: "Fünf Felder unter Druck",
      formula: ["Was hat sich geändert", "Was ist noch offen", "Wem gehört es", "Bis wann", "Was die nächste Schicht wissen muss"],
      quote: "Wenn die Menge steigt, wird das persönliche Gedächtnis weniger verlässlich. Die Übergabe wird zum Gedächtnis des Betriebs.",
    },
    reading: {
      intro: "Aus der Reihe „Zehn Jahre nah an der Arbeit“:",
      notes: ["Die Übergabe als Weitergabe von Verantwortung.", "Der Standard, der unter Druck hält.", "Der Live-Betrieb und seine Kennzahlen."],
    },
    question: "Wenn Ihre Menge morgen um ein Drittel stiege, welcher Standard würde zuerst brechen?",
  },
};

// The page layout of an issue: cover, contents, two pages of trend, the pages of "From the floor" (floorSplit,
// the questions on each page; the closing words go on the last), the tool, the essays, the question, the back.
const withLayout = (issue) => {
  const floorSplit = issue.floorSplit || [[0, 2], [2, 4], [4, 99]];
  const floor = 5;
  const tool = floor + floorSplit.length;
  const pageOf = { trend: 3, floor, tool, essays: tool + 1, read: tool + 1, question: tool + 2, back: tool + 3 };
  return { ...issue, floorSplit, pageOf };
};

const issues = [issue1, issue2].map(withLayout);
const langs = ["en", "sq", "de"];

export default {
  langs,
  names,
  labels,
  issues,
  latest: issues[issues.length - 1],
  // One print page per issue and language (src/guide-print/magazine.njk).
  prints: issues.flatMap((issue) => langs.map((lang) => ({ issue, lang }))),
};
