// Management Review, No. 9: Engagement, the 2026 data. Block: People.
// Facts and their sources: docs/revista/management-review-nr-09.md.
import { x, pc } from "../common.js";

export default {
  number: 9,
  block: "people",
  date: x("October 2026", "Tetor 2026", "Oktober 2026"),
  theme: [x("Engagement:", "Angazhimi:", "Engagement:"), x("the 2026 data", "të dhënat e vitit 2026", "die Daten von 2026")],
  sub: x(
    "One worker in five worldwide is engaged. Why Albania comes out above the average, why Europe is last, and what goes with engagement in a team.",
    "Një në pesë punonjës në botë është i angazhuar. Pse Shqipëria del mbi mesataren, pse Evropa është e fundit, dhe çfarë lidhet me angazhimin në ekip.",
    "Weltweit ist jeder fünfte Beschäftigte engagiert. Warum Albanien über dem Durchschnitt liegt, warum Europa Schlusslicht ist und was mit Engagement im Team einhergeht."),
  seo: x(
    "Engagement in 2026: Gallup's figures for the world, Europe, Albania and Germany, the four levels of the Q12 and a short pulse for your team.",
    "Angazhimi në vitin 2026: shifrat e Gallup-it për botën, Evropën, Shqipërinë dhe Gjermaninë, katër nivelet e Q12 dhe një puls i shkurtër për ekipin.",
    "Engagement 2026: Gallups Zahlen für Welt, Europa, Albanien und Deutschland, die vier Ebenen des Q12 und ein kurzer Puls für Ihr Team."),
  feature: x(
    "Issue 9 reads Gallup's April 2026 report. Engagement fell worldwide for the second year in a row, Europe sits at the bottom and Albania well above both. Data from 183,806 work units show what goes with engaged teams.",
    "Numri 9 lexon raportin e Gallup-it të prillit 2026. Angazhimi në botë ra për të dytin vit radhazi, Evropa është në fund dhe Shqipëria shumë mbi të dyja. Të dhënat nga 183.806 njësi pune tregojnë çfarë shkon bashkë me ekipet e angazhuara.",
    "Ausgabe 9 wertet Gallups Bericht vom April 2026 aus. Das Engagement ist weltweit zum zweiten Mal in Folge gesunken, Europa liegt am Ende und Albanien weit über beiden. Daten aus 183.806 Arbeitseinheiten zeigen, was mit engagierten Teams einhergeht."),
  figure: { n: pc(32), by: "Gallup, 2026", t: x(
    "of employees in Albania are engaged, a three-year average to 2025. World: 20%. Europe: 12%.",
    "e punonjësve në Shqipëri janë të angazhuar, mesatare e tri viteve deri në 2025. Bota: 20%. Evropa: 12%.",
    "der Beschäftigten in Albanien sind engagiert, Dreijahresdurchschnitt bis 2025. Welt: 20 %. Europa: 12 %.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("One worker in five", "Një në pesë punonjës", "Jeder fünfte Beschäftigte") },
    { page: "numbers", kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: x("Albania above the average", "Shqipëria mbi mesataren", "Albanien über dem Durchschnitt") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("Eight statements for the team", "Tetë pohime për ekipin", "Acht Aussagen für das Team") },
  ],
  sources: ["gallup-sogw-2026", "gallup-albania-2026", "gallup-germany-2026", "gallup-us-2026", "gallup-q12", "gallup-q12-2024"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Engagement is neither happiness nor satisfaction. Gallup uses the word for people who are involved in and enthusiastic about their work and workplace. Here we read the 2026 data and ask what a manager can do with them.",
        "Angazhimi nuk është as lumturi, as kënaqësi. Gallup-i e përdor fjalën për njerëzit që janë të përfshirë në punën e tyre dhe në vendin ku punojnë, dhe që e bëjnë punën me entuziazëm. Këtu lexojmë të dhënat e vitit 2026 dhe pyesim çfarë mund të bëjë një menaxher me to.",
        "Engagement ist weder Glück noch Zufriedenheit. Gallup meint damit Menschen, die sich in ihre Arbeit und ihren Arbeitsplatz einbringen und dafür begeistern. Hier lesen wir die Daten von 2026 und fragen, was eine Führungskraft damit anfangen kann."),
      body: x(
        "The April 2026 report shows the second decline in a row worldwide, mostly among managers. Albania, at 32%, comes out above the world average and far above Europe. Gallup's meta-analysis of 183,806 work units links high engagement with fewer absences, fewer accidents and more profit. The data show an association; they do not establish cause.",
        "Raporti i prillit 2026 tregon rënien e dytë radhazi në botë, kryesisht te menaxherët. Shqipëria, me 32%, del mbi mesataren botërore dhe shumë mbi Evropën. Meta-analiza e Gallup-it me 183.806 njësi pune e lidh angazhimin e lartë me më pak mungesa, më pak aksidente dhe më shumë fitim. Të dhënat tregojnë një lidhje; shkakun nuk e vërtetojnë.",
        "Der Bericht vom April 2026 zeigt den zweiten Rückgang in Folge weltweit, vor allem bei Führungskräften. Albanien liegt mit 32 % über dem Weltdurchschnitt und weit über Europa. Gallups Metaanalyse mit 183.806 Arbeitseinheiten verbindet hohes Engagement mit weniger Fehlzeiten, weniger Unfällen und mehr Gewinn. Die Daten zeigen Zusammenhänge; Ursachen belegen sie nicht."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("One worker", "Një në pesë", "Jeder fünfte"), x("in five", "punonjës", "Beschäftigte")],
      lead: x(
        "In 2025, 20% of the world's employees were engaged, according to Gallup: the lowest level since 2020, after two years of decline.",
        "Në vitin 2025, 20% e punonjësve në botë ishin të angazhuar sipas Gallup-it: niveli më i ulët që nga 2020, pas dy vitesh rënie.",
        "2025 waren laut Gallup 20 % der Beschäftigten weltweit engagiert: der tiefste Stand seit 2020, nach zwei Jahren Rückgang."),
      blocks: [
        { type: "columns", max: 25, height: 120,
          label: x("Engaged employees worldwide", "Punonjës të angazhuar në botë", "Engagierte Beschäftigte weltweit"),
          note: x(
            "Share of employees worldwide who were engaged in each year shown, as Gallup measured it (State of the Global Workplace 2026).",
            "Pjesa e punonjësve në botë që ishin të angazhuar në secilin vit të treguar, siç e mati Gallup-i (State of the Global Workplace 2026).",
            "Anteil der engagierten Beschäftigten weltweit in jedem gezeigten Jahr, wie Gallup ihn gemessen hat (State of the Global Workplace 2026)."),
          items: [
            { k: "2009", v: 12, n: pc(12) },
            { k: "2022", v: 23, n: pc(23) },
            { k: "2025", v: 20, n: pc(20), alert: true },
          ] },
        { type: "p", text: x(
          "The decline comes mostly from managers: their engagement fell from 31% in 2022 to 22% in 2025, while among employees without a management role it moved from 20% to 19%. Issue 1 of this review covers it at length.",
          "Rënia vjen kryesisht nga menaxherët: angazhimi i tyre ra nga 31% në vitin 2022 në 22% në vitin 2025, ndërsa te punonjësit pa rol menaxherial lëvizi nga 20% në 19%. Numri 1 i kësaj reviste e trajton më gjatë.",
          "Der Rückgang kommt vor allem von Führungskräften: Ihr Engagement fiel von 31 % im Jahr 2022 auf 22 % im Jahr 2025, bei Beschäftigten ohne Führungsrolle bewegte es sich von 20 % auf 19 %. Ausgabe 1 dieser Reihe behandelt das ausführlich.") },
        { type: "figures", compact: true, items: [
          { n: pc(31), t: x("engaged in the US in 2025", "të angazhuar në SHBA në vitin 2025", "engagiert in den USA 2025") },
          { n: pc(17), t: x("actively disengaged in the US in 2025", "aktivisht të shkëputur në SHBA në vitin 2025", "aktiv unengagiert in den USA 2025") },
          { n: pc(36), t: x("the US peak, in 2020", "kulmi në SHBA, në vitin 2020", "der Höchststand in den USA, 2020") },
        ] },
        { type: "callout", reading: true, text: x(
          "When managers' engagement falls, the team feels it before the survey shows it.",
          "Kur bie angazhimi i menaxherëve, ekipi e ndjen para se ta tregojë anketa.",
          "Wenn das Engagement der Führungskräfte sinkt, spürt das Team es, bevor die Umfrage es zeigt.") },
      ],
      source: ["gallup-sogw-2026", "gallup-us-2026"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("Albania", "Shqipëria", "Albanien"), x("above the average", "mbi mesataren", "über dem Durchschnitt")],
      lead: x(
        "In the country data, Albania has 32% engaged. Europe, at 12%, is the lowest region in the world.",
        "Te të dhënat sipas vendeve, Shqipëria ka 32% të angazhuar. Evropa, me 12%, është rajoni më i ulët në botë.",
        "In den Länderdaten hat Albanien 32 % Engagierte. Europa ist mit 12 % die Region mit dem niedrigsten Wert weltweit."),
      blocks: [
        { type: "hbars", max: 40, source: ["gallup-albania-2026", "gallup-sogw-2026", "gallup-germany-2026"],
          label: x("Engaged employees, 2025", "Punonjës të angazhuar, 2025", "Engagierte Beschäftigte, 2025"),
          note: x(
            "Share of employees engaged. Albania, Germany and Europe are 2023–2025 averages; the world is 2025 alone, so the comparison is approximate.",
            "Pjesa e punonjësve të angazhuar. Shqipëria, Gjermania dhe Evropa janë mesatare të viteve 2023–2025; bota është vetëm 2025, prandaj krahasimi është i përafërt.",
            "Anteil der engagierten Beschäftigten. Albanien, Deutschland und Europa sind Durchschnitte von 2023–2025, die Welt nur 2025; der Vergleich ist daher ungefähr."),
          items: [
            { k: x("Albania", "Shqipëria", "Albanien"), v: 32, n: pc(32) },
            { k: x("World", "Bota", "Welt"), v: 20, n: pc(20) },
            { k: x("Europe", "Evropa", "Europa"), v: 12, n: pc(12), alert: true },
            { k: x("Germany", "Gjermania", "Deutschland"), v: 11, n: pc(11), alert: true },
          ] },
        { type: "figures", compact: true, items: [
          { n: x("11% → 32%", "11% → 32%", "11 % → 32 %"), t: x("Albania, from 2012 to 2025 (three-year averages)", "Shqipëria, nga 2012 në 2025 (mesatare trevjeçare)", "Albanien, von 2012 bis 2025 (Dreijahresdurchschnitte)") },
          { n: pc(63), t: x("in Albania say it is a good time to find a job (Europe 57%, world 52%)", "në Shqipëri thonë se është kohë e mirë për të gjetur punë (Evropa 57%, bota 52%)", "in Albanien sagen, es sei eine gute Zeit, Arbeit zu finden (Europa 57 %, Welt 52 %)") },
        ] },
        { type: "p", text: x(
          "Albania, Germany and Europe are averages of 2023–2025; the world figure is 2025 alone, so that comparison is approximate.",
          "Shqipëria, Gjermania dhe Evropa janë mesatare të viteve 2023–2025; bota është vetëm 2025, prandaj ky krahasim është i përafërt.",
          "Albanien, Deutschland und Europa sind Durchschnitte von 2023–2025, der Weltwert gilt nur für 2025; dieser Vergleich ist daher nur ungefähr.") },
        { type: "callout", reading: true, text: x(
          "Where jobs are easy to find, high engagement guarantees nothing, which gives a manager one more reason to work at keeping good people.",
          "Aty ku punë gjen lehtë, angazhimi i lartë nuk garanton asgjë. Kjo i jep menaxherit një arsye më shumë për t'u kujdesur që njerëzit e mirë të mbeten.",
          "Wo Arbeit leicht zu finden ist, garantiert hohes Engagement nichts. Für eine Führungskraft ist das ein Grund mehr, sich darum zu kümmern, dass gute Leute bleiben.") },
      ],
      source: ["gallup-albania-2026", "gallup-sogw-2026", "gallup-germany-2026"],
    },
    {
      id: "model",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Four levels", "Katër nivele", "Vier Ebenen"), x("of engagement", "të angazhimit", "des Engagements")],
      lead: x(
        "Gallup measures engagement with 12 elements and arranges them in four levels, from basic needs to growth. Each level builds on the one below; Gallup says the needs are met in sequence.",
        "Gallup-i e mat angazhimin me 12 elemente dhe i rendit në katër nivele, nga nevojat bazë te rritja. Çdo nivel mbështetet në atë poshtë tij; sipas Gallup-it, nevojat plotësohen me radhë.",
        "Gallup misst Engagement mit 12 Elementen und ordnet sie in vier Ebenen, von den Grundbedürfnissen bis zum Wachstum. Jede Ebene baut auf der darunter auf; laut Gallup werden die Bedürfnisse der Reihe nach erfüllt."),
      blocks: [
        { type: "chain", items: [
          { h: x("Basic needs", "Nevojat bazë", "Grundbedürfnisse"), p: x("Knowing what is expected and having what the work needs.", "Të dish çfarë pritet dhe të kesh atë që i duhet punës.", "Wissen, was erwartet wird, und haben, was die Arbeit braucht.") },
          { h: x("Contribution", "Kontributi", "Beitrag"), p: x("Doing what you do best, being noticed, having someone who cares.", "Të bësh atë që di më mirë, të të vënë re, të kesh dikë që kujdeset.", "Tun, was Sie am besten können, gesehen werden, jemanden haben, dem Sie wichtig sind.") },
          { h: x("Teamwork", "Puna në ekip", "Team"), p: x("Your opinion counts, the purpose means something, colleagues care about quality.", "Mendimi yt ka peshë, qëllimi ka kuptim, kolegët kujdesen për cilësinë.", "Ihre Meinung zählt, der Zweck hat Sinn, Kollegen achten auf Qualität.") },
          { h: x("Growth", "Rritja", "Wachstum"), p: x("Someone talks with you about your progress, and you can learn.", "Dikush flet me ty për ecurinë, dhe ke ku të mësosh.", "Jemand spricht mit Ihnen über Ihren Fortschritt, und Sie können dazulernen.") },
        ] },
        { type: "example", label: x("Hypothetical example, the four levels in one warehouse shift", "Shembull hipotetik, katër nivelet në një turn magazine", "Hypothetisches Beispiel, die vier Ebenen in einer Lagerschicht"), rows: [
          { k: x("Basic needs", "Nevojat bazë", "Grundbedürfnisse"), v: x("The plan for the day is on the board and the scanners are charged.", "Plani i ditës është në tabelë dhe skanerët janë të ngarkuar.", "Der Tagesplan hängt an der Tafel, und die Scanner sind geladen.") },
          { k: x("Contribution", "Kontributi", "Beitrag"), v: x("The lead names yesterday's good work in the briefing.", "Shefi e përmend punën e mirë të djeshme në takimin e shkurtër në fillim të turnit.", "Die Leitung würdigt in der Schichtbesprechung die gute Arbeit von gestern.") },
          { k: x("Teamwork", "Puna në ekip", "Team"), v: x("When someone says a step does not work, it is written down and taken up.", "Kur dikush thotë se një hap nuk funksionon, shënohet dhe merret parasysh.", "Sagt jemand, ein Schritt funktioniere nicht, wird es notiert und aufgegriffen.") },
          { k: x("Growth", "Rritja", "Wachstum"), v: x("Each month, everyone learns one new task in the warehouse.", "Çdo muaj, secili mëson një detyrë të re në magazinë.", "Jeden Monat lernt jede Person eine neue Aufgabe im Lager.") },
        ], text: x("An editors' illustration, not drawn from any one company.", "Ilustrim i redaksisë; nuk vjen nga ndonjë kompani e caktuar.", "Eine Illustration der Redaktion, keinem bestimmten Unternehmen entnommen.") },
        { type: "callout", reading: true, text: x(
          "Many engagement programmes start at the top, with values and events. Gallup's model suggests starting at the bottom: does everyone know what is expected today, and do they have what they need to do it?",
          "Shumë programe angazhimi nisin nga lart, me vlera dhe aktivitete. Modeli i Gallup-it sugjeron të nisësh nga poshtë: a e di secili çfarë pritet sot, dhe a ka me çfarë ta bëjë?",
          "Viele Engagement-Programme beginnen oben, mit Werten und Veranstaltungen. Gallups Modell legt nahe, unten anzufangen: Weiß jeder, was heute erwartet wird, und hat er, was er dafür braucht?") },
      ],
      note: x(
        "The descriptions are in our words; the Q12 questions belong to Gallup and are not reproduced.",
        "Përshkrimet janë me fjalët tona; pyetjet e Q12 janë pronë e Gallup-it dhe nuk riprodhohen.",
        "Die Beschreibungen sind in unseren Worten; die Q12-Fragen gehören Gallup und werden nicht wiedergegeben."),
      source: ["gallup-q12"],
    },
    {
      id: "why",
      kicker: x("Why it matters", "Pse ka rëndësi", "Warum es zählt"),
      title: [x("What moves", "Çfarë lëviz", "Was sich mit dem"), x("with engagement", "bashkë me angazhimin", "Engagement bewegt")],
      lead: x(
        "Gallup's meta-analysis (11th edition, 2024) compares work units in the top quarter of engagement with those in the bottom quarter. The medians:",
        "Meta-analiza e Gallup-it (botimi i 11-të, 2024) krahason njësitë e punës në çerekun më të lartë të angazhimit me ato në çerekun më të ulët. Medianat:",
        "Gallups Metaanalyse (11. Ausgabe, 2024) vergleicht Arbeitseinheiten im obersten Viertel des Engagements mit denen im untersten Viertel. Die Mediane:"),
      blocks: [
        { type: "figures", compact: true, items: [
          { n: x("736", "736", "736"), t: x("studies", "studime", "Studien") },
          { n: x("347", "347", "347"), t: x("organisations in 90 countries", "organizata në 90 vende", "Organisationen in 90 Ländern") },
          { n: x("183,806", "183.806", "183.806"), t: x("work units", "njësi pune", "Arbeitseinheiten") },
        ] },
        { type: "figures", compact: true, items: [
          { n: x("−78%", "−78%", "−78 %"), t: x("absenteeism", "mungesa nga puna", "Fehlzeiten") },
          { n: x("−63%", "−63%", "−63 %"), t: x("safety incidents", "aksidente sigurie", "Sicherheitsvorfälle") },
          { n: x("−32%", "−32%", "−32 %"), t: x("quality defects", "defekte cilësie", "Qualitätsmängel") },
        ] },
        { type: "figures", compact: true, items: [
          { n: x("+23%", "+23%", "+23 %"), t: x("profitability", "fitimi", "Rentabilität") },
          { n: x("+18%", "+18%", "+18 %"), t: x("sales productivity", "produktiviteti në shitje", "Produktivität im Vertrieb") },
          { n: x("−21%", "−21%", "−21 %"), t: x("turnover, in high-turnover organisations", "largimet, në organizatat me largime të larta", "Fluktuation in Organisationen mit hoher Fluktuation") },
        ] },
        { type: "figures", compact: true, items: [
          { n: x("−28%", "−28%", "−28 %"), t: x("shrinkage (theft)", "humbje malli (vjedhje)", "Inventurdifferenzen (Diebstahl)") },
          { n: x("+10%", "+10%", "+10 %"), t: x("customer loyalty", "besnikëria e klientëve", "Kundentreue") },
          { n: x("+70%", "+70%", "+70 %"), t: x("employees thriving in their wellbeing", "punonjës me mirëqenie të lartë", "Beschäftigte mit hohem Wohlbefinden") },
        ] },
        { type: "p", text: x(
          "These are medians and links across units, not proof that engagement causes them. Except for wellbeing, the outcome data come from the organisations' own records.",
          "Janë mediana dhe lidhje mes njësive, jo provë se angazhimi i shkakton. Përveç mirëqenies, të dhënat e rezultateve vijnë nga regjistrat e vetë organizatave.",
          "Es sind Mediane und Zusammenhänge zwischen Einheiten, kein Beweis, dass Engagement sie verursacht. Außer beim Wohlbefinden stammen die Leistungsdaten aus den Unterlagen der Organisationen.") },
        { type: "callout", reading: true, text: x(
          "A shift lead sees engagement less in an annual survey than in who comes on time, who reports the mistake and who stays.",
          "Një shef turni e sheh angazhimin më pak te anketa vjetore e më shumë te kush vjen në kohë, kush e raporton gabimin dhe kush qëndron.",
          "Eine Schichtleitung erkennt Engagement weniger an der jährlichen Umfrage als daran, wer pünktlich kommt, wer den Fehler meldet und wer bleibt.") },
      ],
      source: ["gallup-q12-2024"],
    },
    {
      id: "measure", more: "leading-people-without-losing-the-person",
      kicker: x("How it is measured", "Si matet", "Wie es gemessen wird"),
      title: [x("The team's", "Pulsi", "Der Puls"), x("pulse", "i ekipit", "des Teams")],
      lead: x(
        "Gallup's survey needs permission and method. A manager can still keep a short pulse in their own words, and use it to open a conversation. It should never turn into a grade.",
        "Anketa e Gallup-it kërkon leje dhe metodë. Megjithatë, një menaxher mund të mbajë një puls të shkurtër, me fjalët e veta, dhe ta përdorë për të hapur një bisedë. Nuk duhet të kthehet kurrë në notë.",
        "Gallups Umfrage braucht Erlaubnis und Methode. Eine Führungskraft kann dennoch einen kurzen Puls in eigenen Worten erheben und damit ein Gespräch eröffnen. Zur Note sollte er nie werden."),
      blocks: [
        { type: "steps", items: [
          { h: x("No names", "Pa emra", "Ohne Namen"), p: x("Cards are collected without names; results are seen only for the whole team.", "Kartat mblidhen pa emër; rezultati shihet vetëm për gjithë ekipin.", "Karten werden ohne Namen gesammelt; Ergebnisse gibt es nur für das ganze Team.") },
          { h: x("Start at the bottom", "Nis nga poshtë", "Unten anfangen"), p: x("If the statements on basic needs score low, start there, not with growth.", "Nëse pohimet për nevojat bazë kanë notë të ulët, fillo aty, jo te rritja.", "Fallen die Aussagen zu den Grundbedürfnissen niedrig aus, beginnen Sie dort, nicht beim Wachstum.") },
          { h: x("One conversation, one change", "Një bisedë, një ndryshim", "Ein Gespräch, eine Änderung"), p: x("Talk with the team about the lowest statement and choose one thing to change.", "Fol me ekipin për pohimin më të ulët dhe zgjidh një gjë për të ndryshuar.", "Sprechen Sie mit dem Team über die niedrigste Aussage und wählen Sie eine Sache, die Sie ändern.") },
          { h: x("Repeat", "Përsërite", "Wiederholen"), p: x("After three months, with the same statements.", "Pas tre muajsh, me të njëjtat pohime.", "Nach drei Monaten, mit denselben Aussagen.") },
        ] },
        { type: "example", label: x("Hypothetical example, a team of twelve", "Shembull hipotetik, një ekip prej 12 vetash", "Hypothetisches Beispiel, ein Team aus zwölf Personen"), text: x(
          "Average scores: basic needs 4.2, contribution 3.1, teamwork 3.8, growth 2.6. Growth is lowest while the basics hold, so the team agrees on one monthly conversation about progress. (Made-up numbers.)",
          "Notat mesatare: nevojat bazë 4,2, kontributi 3,1, puna në ekip 3,8, rritja 2,6. Rritja është më e ulëta, ndërsa bazat qëndrojnë, prandaj ekipi bie dakord për një bisedë mujore për ecurinë. (Numra të sajuar.)",
          "Durchschnittswerte: Grundbedürfnisse 4,2, Beitrag 3,1, Team 3,8, Wachstum 2,6. Wachstum liegt am niedrigsten, während die Basis hält; also vereinbart das Team ein monatliches Gespräch über den Fortschritt. (Ausgedachte Zahlen.)") },
        { type: "callout", reading: true, text: x(
          "A pulse that brings no change teaches the team to stop answering.",
          "Një puls që nuk sjell asnjë ndryshim e mëson ekipin të mos përgjigjet më.",
          "Ein Puls, der nichts verändert, bringt dem Team bei, nicht mehr zu antworten.") },
      ],
      note: x("The four steps are our proposal.", "Katër hapat janë propozimi ynë.", "Die vier Schritte sind unser Vorschlag."),
    },
    {
      id: "tool",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("Eight statements", "Tetë pohime", "Acht Aussagen"), x("for the team", "për ekipin", "für das Team")],
      lead: x(
        "Two statements for each level, in our words. Everyone rates them without a name, from 1 to 5.",
        "Dy pohime për çdo nivel, me fjalët tona. Secili i vlerëson pa emër, nga 1 deri në 5.",
        "Zwei Aussagen pro Ebene, in unseren Worten. Jede Person bewertet sie ohne Namen, von 1 bis 5."),
      blocks: [
        { type: "rating", roomy: true, scale: ["1", "2", "3", "4", "5"],
          key: x("1 = not at all · 5 = completely", "1 = aspak · 5 = plotësisht", "1 = gar nicht · 5 = völlig"),
          items: [
            x("At the start of the shift I know what matters most today.", "Në fillim të turnit e di çfarë është më e rëndësishme sot.", "Zu Schichtbeginn weiß ich, was heute am wichtigsten ist."),
            x("When I lack something for the work, I get it without losing time.", "Kur më mungon diçka për punën, e marr pa humbur kohë.", "Wenn mir etwas für die Arbeit fehlt, bekomme ich es ohne Zeitverlust."),
            x("This week someone noticed a good piece of my work.", "Këtë javë dikush vuri re një punë të mirë që bëra.", "Diese Woche hat jemand eine gute Arbeit von mir bemerkt."),
            x("My lead knows what helps me work well.", "Shefi im e di çfarë më ndihmon të punoj mirë.", "Meine Leitung weiß, was mir hilft, gut zu arbeiten."),
            x("When I say something is not working, I am heard.", "Kur them se diçka nuk shkon, më dëgjojnë.", "Wenn ich sage, dass etwas nicht funktioniert, werde ich gehört."),
            x("In our team we help each other when someone falls behind.", "Te ekipi ynë ndihmojmë njëri-tjetrin kur dikush mbetet pas.", "In unserem Team helfen wir einander, wenn jemand zurückfällt."),
            x("This month I learned something that makes my work easier.", "Këtë muaj mësova diçka që ma lehtëson punën.", "Diesen Monat habe ich etwas gelernt, das mir die Arbeit erleichtert."),
            x("I know what I need to learn for the next step.", "E di çfarë duhet të mësoj për hapin tjetër.", "Ich weiß, was ich für den nächsten Schritt lernen muss."),
          ] },
        { type: "box", title: x("After the card", "Pas kartës", "Nach der Karte"), items: [
          x("Find the level with the lowest scores.", "Gjej nivelin me notat më të ulëta.", "Suchen Sie die Ebene mit den niedrigsten Werten."),
          x("Ask the team what would raise it, and listen.", "Pyete ekipin çfarë do ta ngrinte, dhe dëgjo.", "Fragen Sie das Team, was sie anheben würde, und hören Sie zu."),
          x("Change one thing, then repeat the card after three months.", "Ndrysho një gjë, pastaj përsërite kartën pas tre muajsh.", "Ändern Sie eine Sache und wiederholen Sie die Karte nach drei Monaten."),
        ] },
      ],
      note: x(
        "The statements are in our words, grouped by Gallup's four levels; they are not the Q12 questions. Use the card for the team, never to rate a person.",
        "Pohimet janë me fjalët tona, të ndara sipas katër niveleve të Gallup-it; nuk janë pyetjet e Q12. Përdore kartën për ekipin, kurrë për të vlerësuar një person.",
        "Die Aussagen sind in unseren Worten, nach Gallups vier Ebenen gruppiert; es sind nicht die Q12-Fragen. Nutzen Sie die Karte für das Team, nie zur Bewertung einer einzelnen Person."),
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
