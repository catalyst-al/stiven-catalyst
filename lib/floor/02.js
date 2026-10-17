// Nga terreni (From the Floor, Aus der Praxis), issue 2, November 2026: When the load rises. Written in the format
// of the Management Review (lib/weekly/issues), drawn by the same pages under the name of the magazine
// (src/_data/magazine.js). The trend and the research are the editors', from the sources below; "From the floor" is
// Stiven Janaqi's own answers, edited only for spelling. The Albanian draft and its fact check: docs/revista/numri-02*.md.
import { x, pc } from "../weekly/common.js";

// "4.37" in English, "4,37" in Albanian and German.
const dec = (n) => x(n, n.replace(".", ","), n.replace(".", ","));

export default {
  number: 2,
  slug: "nga-terreni-02",
  block: "operations",
  date: x("November 2026", "Nëntor 2026", "November 2026"),
  theme: [x("When the load", "Kur ngarkesa", "Wenn die Last"), x("rises", "rritet", "steigt")],
  sub: x(
    "Pressure does not always create the problems. It makes them visible: the peak season in figures, new people and long shifts in the research, answers from the floor, and a handover for five fields.",
    "Presioni nuk i krijon gjithmonë problemet. I bën të dukshme: sezoni i pikut në shifra, njerëzit e rinj dhe turnet e gjata në kërkime, përgjigje nga terreni, dhe një dorëzim me pesë fusha.",
    "Druck schafft die Probleme nicht immer. Er macht sie sichtbar: die Hochsaison in Zahlen, neue Leute und lange Schichten in der Forschung, Antworten aus der Praxis und eine Übergabe mit fünf Feldern."),
  // For Publications and the lists of issues.
  lead: x(
    "November opens the busiest season in logistics. For many teams it means more volume, less time and more new people, all at once.",
    "Nëntori hap sezonin më të ngarkuar në logjistikë. Për shumë ekipe, kjo do të thotë më shumë vëllim, më pak kohë dhe më shumë njerëz të rinj në të njëjtën kohë.",
    "Der November eröffnet die arbeitsreichste Zeit in der Logistik. Für viele Teams heißt das: mehr Volumen, weniger Zeit und mehr neue Leute, alles gleichzeitig."),
  seo: x(
    "Peak season in logistics: the figures for Germany, the research on new workers and long shifts, answers from the floor and a shift handover.",
    "Sezoni i pikut në logjistikë: shifrat për Gjermaninë, kërkimet për punonjësit e rinj dhe turnet e gjata, përgjigje nga terreni dhe dorëzimi i turnit.",
    "Hochsaison in der Logistik: die Zahlen für Deutschland, die Forschung zu neuen Beschäftigten und langen Schichten, Antworten aus der Praxis, Schichtübergabe."),
  feature: x(
    "Every November, German parcel logistics needs thousands of extra people and vehicles. Issue 2 counts them, then turns to the research on new workers and long shifts under pressure. Stiven Janaqi answers from the floor, and a shift handover in five fields closes the issue.",
    "Çdo nëntor, logjistika e pakove në Gjermani ka nevojë për mijëra njerëz dhe automjete shtesë. Numri 2 i numëron, pastaj kthehet te kërkimet për punonjësit e rinj dhe turnet e gjata nën presion. Stiven Janaqi përgjigjet nga terreni, dhe numri mbyllet me një dorëzim turni me pesë fusha.",
    "Jeden November braucht die Paketlogistik in Deutschland Tausende zusätzliche Menschen und Fahrzeuge. Ausgabe 2 zählt sie und wendet sich dann der Forschung zu neuen Beschäftigten und langen Schichten unter Druck zu. Stiven Janaqi antwortet aus der Praxis; eine Schichtübergabe mit fünf Feldern schließt die Ausgabe ab."),
  figure: { n: x("750 m", "750 mln", "750 Mio."), by: "BPEX, 2025", t: x(
    "parcel and express shipments were expected in Germany in November and December 2025 alone.",
    "dërgesa korrier dhe pako priteshin në Gjermani vetëm në nëntor dhe dhjetor 2025.",
    "KEP-Sendungen wurden allein im November und Dezember 2025 in Deutschland erwartet.") },
  teasers: [
    { page: "trend", kicker: x("Trend of the month", "Trendi i muajit", "Trend des Monats"),
      title: x("Peak season", "Sezoni i pikut", "Die Hochsaison") },
    { page: "newcomers", kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: x("The first month", "Muaji i parë", "Der erste Monat") },
    { page: "floor", kicker: x("From the floor", "Si e shoh nga terreni", "Aus der Praxis"),
      title: x("Days above forecast", "Ditët mbi parashikim", "Tage über Prognose") },
  ],
  sources: [
    { id: "kep-2026", by: "KE-CONSULT for BPEX", year: 2026, title: "KEP-Studie 2026: Analyse des Marktes in Deutschland", url: "https://bpex-ev.de/kep-branche/zahlen-und-fakten" },
    { id: "bpex-xmas-2025", by: "BPEX", year: 2025, title: "Paketbranche erwartet geringen Anstieg der Sendungsmengen in der Weihnachtszeit, Presseinformation 17/2025", url: "https://bpex-ev.de/presse/pressemeldungen?year=2025" },
    { id: "ba-engpass-2025", lang: "de", by: "Bundesagentur für Arbeit", year: 2026, title: "Fachkräfteengpassanalyse 2025", url: "https://statistik.arbeitsagentur.de/DE/Statischer-Content/Statistiken/Themen-im-Fokus/Fachkraeftebedarf/Fachkraefteengpassanalyse/Fachkraefteengpassanalyse.html" },
    { id: "breslin-2006", by: "Breslin & Smith", year: 2006, title: "Trial by fire: a multivariate examination of the relation between job tenure and work injuries, Occupational and Environmental Medicine 63(1)", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC2078031/" },
    { id: "gallup-2017", by: "Gallup", year: 2017, title: "State of the American Workplace", url: "https://www.gallup.com/file/workplace/238085/Gallup_State_of_the_American_Workplace_Report.pdf" },
    { id: "dembe-2005", by: "Dembe et al.", year: 2005, title: "The impact of overtime and long work hours on occupational injuries and illnesses, Occupational and Environmental Medicine 62(9)", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC1741083/" },
    { id: "folkard-2005", by: "Folkard, Lombardi & Tucker", year: 2005, title: "Shiftwork: safety, sleepiness and sleep, Industrial Health 43(1)", url: "https://www.jstage.jst.go.jp/article/indhealth/43/1/43_1_20/_pdf" },
    { id: "starmer-2014", by: "Starmer et al.", year: 2014, title: "Changes in medical errors after implementation of a handoff program, New England Journal of Medicine 371(19)", url: "https://pubmed.ncbi.nlm.nih.gov/25372088/", via: "Abstract at PubMed" },
  ],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "November opens the busiest season in logistics: more volume, less time and more new people, all at once. This issue asks what happens to a standard when the load rises, and what a manager can do before it does.",
        "Nëntori hap sezonin më të ngarkuar në logjistikë: më shumë vëllim, më pak kohë dhe më shumë njerëz të rinj, të gjitha njëherësh. Ky numër pyet çfarë ndodh me një standard kur ngarkesa rritet, dhe çfarë mund të bëjë një menaxher para se të rritet.",
        "Der November eröffnet die arbeitsreichste Zeit in der Logistik: mehr Volumen, weniger Zeit und mehr neue Leute, alles gleichzeitig. Diese Ausgabe fragt, was mit einem Standard geschieht, wenn die Last steigt, und was eine Führungskraft vorher tun kann."),
      body: x(
        "In 2025 about 4.37 billion parcel and express shipments were moved in Germany; for November and December alone the industry expected about 750 million, up to 21 million on the busiest days. The extra capacity is mostly new people, and the research is clear about their first month: more than four times the risk of an injury. Long shifts add their own. Stiven Janaqi answers from the floor, and a shift handover with five fields closes the issue.",
        "Në 2025, në Gjermani u transportuan rreth 4,37 miliardë dërgesa korrier dhe pako; vetëm për nëntorin dhe dhjetorin, sektori priste rreth 750 milionë, deri në 21 milionë në ditët më të ngarkuara. Kapaciteti shtesë përbëhet kryesisht nga njerëz të rinj, dhe kërkimi është i qartë për muajin e tyre të parë: më shumë se katërfishi i rrezikut të një lëndimi. Turnet e gjata shtojnë të vetin. Stiven Janaqi përgjigjet nga terreni, dhe numri mbyllet me një dorëzim turni me pesë fusha.",
        "2025 wurden in Deutschland rund 4,37 Milliarden KEP-Sendungen befördert; allein für November und Dezember erwartete die Branche rund 750 Millionen, an Spitzentagen bis zu 21 Millionen. Die zusätzliche Kapazität besteht vor allem aus neuen Leuten, und die Forschung ist zu ihrem ersten Monat eindeutig: mehr als das Vierfache des Verletzungsrisikos. Lange Schichten kommen hinzu. Stiven Janaqi antwortet aus der Praxis, und eine Schichtübergabe mit fünf Feldern schließt die Ausgabe."),
    },
    {
      id: "trend",
      kicker: x("Trend of the month", "Trendi i muajit", "Trend des Monats"),
      title: [x("Peak", "Sezoni", "Die"), x("season", "i pikut", "Hochsaison")],
      lead: x(
        "In 2025 about 4.37 billion courier, express and parcel shipments were moved in Germany, 1.8% more than a year earlier. The market is half as large again as in 2015, but since the peak of 2021 it has grown slowly.",
        "Në 2025, në Gjermani u transportuan rreth 4,37 miliardë dërgesa korrier, ekspres dhe pako, 1,8% më shumë se një vit më parë. Tregu është sa një herë e gjysmë ai i 2015, por që nga piku i 2021 rritet ngadalë.",
        "2025 wurden in Deutschland rund 4,37 Milliarden Kurier-, Express- und Paketsendungen befördert, 1,8 % mehr als im Vorjahr. Der Markt ist anderthalbmal so groß wie 2015, wächst aber seit dem Höchststand von 2021 nur langsam."),
      blocks: [
        { type: "line", min: 3, max: 5, ticks: [3, 4, 5], height: 118, source: ["kep-2026"],
          label: x("Parcel and express shipments in Germany, billions", "Dërgesa korrier dhe pako në Gjermani, miliardë", "KEP-Sendungen in Deutschland, Milliarden"),
          points: [
            { k: "2017", v: 3.35, n: dec("3.35") },
            { k: "2018", v: 3.52, n: dec("3.52") },
            { k: "2019", v: 3.65, n: dec("3.65") },
            { k: "2020", v: 4.05, n: dec("4.05") },
            { k: "2021", v: 4.51, n: dec("4.51") },
            { k: "2022", v: 4.15, n: dec("4.15") },
            { k: "2023", v: 4.18, n: dec("4.18") },
            { k: "2024", v: 4.29, n: dec("4.29") },
            { k: "2025", v: 4.37, n: dec("4.37") },
          ] },
        { type: "p", text: x(
          "On an average delivery day of 2025 the companies moved 14.5 million shipments. For November and December the industry association BPEX expected about 750 million, 1 to 2% more than a year earlier: in its own words, in fact a stagnation.",
          "Në një ditë mesatare dorëzimi të 2025, kompanitë lëvizën 14,5 milionë dërgesa. Për nëntorin dhe dhjetorin, shoqata e sektorit BPEX priste rreth 750 milionë, 1 deri në 2% më shumë se një vit më parë: me fjalët e saj, në fakt një ngecje.",
          "An einem durchschnittlichen Zustelltag 2025 beförderten die Unternehmen 14,5 Millionen Sendungen. Für November und Dezember erwartete der Branchenverband BPEX rund 750 Millionen, 1 bis 2 % mehr als im Vorjahr: nach eigenen Worten faktisch eine Stagnation.") },
        { type: "callout", reading: true, text: x(
          "The year grows slowly; the peak does not. Every November the same network has to carry more in less time.",
          "Viti rritet ngadalë; piku jo. Çdo nëntor i njëjti rrjet duhet të mbajë më shumë në më pak kohë.",
          "Das Jahr wächst langsam, die Spitzenzeit nicht. Jeden November muss dasselbe Netz mehr in weniger Zeit bewältigen.") },
      ],
      note: x(
        "Shipments for 2015–2025 as the KEP-Studie 2026 gives them (2023: 4.175 billion, rounded). The 750 million are a forecast made in November 2025.",
        "Dërgesat e 2015–2025 siç i jep KEP-Studie 2026 (2023: 4,175 miliardë, e rrumbullakosur). 750 milionët janë parashikim i bërë në nëntor 2025.",
        "Sendungen 2015–2025 nach der KEP-Studie 2026 (2023: 4,175 Milliarden, gerundet). Die 750 Millionen sind eine Prognose vom November 2025."),
      source: ["kep-2026", "bpex-xmas-2025"],
    },
    {
      id: "peak",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("Two months", "Dy muaj", "Zwei Monate"), x("of their own", "më vete", "für sich")],
      lead: x(
        "In the high phase before Christmas the networks move about 15 million shipments a day, and up to 21 million on the busiest days. To carry them, the industry adds people and vehicles.",
        "Në fazën e lartë para Krishtlindjeve, rrjetet lëvizin rreth 15 milionë dërgesa në ditë, dhe deri në 21 milionë në ditët më të ngarkuara. Për t'i përballuar, sektori shton njerëz dhe automjete.",
        "In der Hochphase vor Weihnachten bewegen die Netze etwa 15 Millionen Sendungen am Tag, an Spitzentagen bis zu 21 Millionen. Um sie zu bewältigen, holt die Branche Menschen und Fahrzeuge dazu."),
      blocks: [
        { type: "columns", max: 21, height: 124, source: ["kep-2026", "bpex-xmas-2025"],
          label: x("Shipments a day in Germany, millions", "Dërgesa në ditë në Gjermani, milionë", "Sendungen pro Tag in Deutschland, Millionen"),
          items: [
            { k: x("Average day, 2025", "Dita mesatare, 2025", "Durchschnittstag 2025"), v: 14.5, n: dec("14.5") },
            { k: x("High phase", "Faza e lartë", "Hochphase"), v: 15, n: x("~15", "~15", "~15") },
            { k: x("Busiest days", "Ditët më të ngarkuara", "Spitzentage"), v: 21, n: x("up to 21", "deri 21", "bis 21"), alert: true },
          ] },
        { type: "stats", cols: 3, items: [
          { n: x("20,000", "20.000", "20.000"), t: x("extra workers for the season", "punonjës shtesë për sezonin", "zusätzliche Arbeitskräfte für die Saison") },
          { n: x("17,000", "17.000", "17.000"), t: x("extra vehicles", "automjete shtesë", "zusätzliche Fahrzeuge") },
          { n: "157", t: x("occupations short of skilled workers in Germany in 2025", "profesione me mungesë fuqie punëtore në Gjermani në 2025", "Engpassberufe in Deutschland 2025") },
        ] },
        { type: "callout", reading: true, text: x(
          "The extra capacity of the peak is mostly people who were not there in October, in a market where people are hard to find.",
          "Kapaciteti shtesë i pikut përbëhet kryesisht nga njerëz që nuk ishin aty në tetor, në një treg ku njerëzit nuk gjenden lehtë.",
          "Die zusätzliche Kapazität der Spitzenzeit besteht vor allem aus Menschen, die im Oktober noch nicht da waren, auf einem Markt, auf dem Arbeitskräfte schwer zu finden sind.") },
      ],
      note: x(
        "Up to 21 million is the BPEX's calculated figure for the busiest days. Truck drivers are among the 157 shortage occupations, out of 1,236 assessed.",
        "Deri 21 milionë është shifra e llogaritur nga BPEX-i për ditët më të ngarkuara. Shoferët e kamionëve janë ndër 157 profesionet me mungesë, nga 1.236 të vlerësuara.",
        "Bis zu 21 Millionen ist der rechnerische Wert des BPEX für Spitzentage. Berufskraftfahrer gehören zu den 157 Engpassberufen, von 1.236 bewerteten."),
      source: ["kep-2026", "bpex-xmas-2025", "ba-engpass-2025"],
    },
    {
      id: "newcomers",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("The first", "Muaji", "Der erste"), x("month", "i parë", "Monat")],
      lead: x(
        "Breslin and Smith set 61,404 first lost-time injury claims of a year in Ontario against how long each worker had been in the job.",
        "Breslin dhe Smith i vunë 61.404 lëndimet e para me humbje ditësh pune të një viti në Ontario përballë kohës që kishte secili në punë.",
        "Breslin und Smith legten 61.404 erste Unfallmeldungen mit Ausfalltagen eines Jahres in Ontario neben die Zeit, die jeder schon im Job war."),
      blocks: [
        { type: "hbars", max: 4.5, source: ["breslin-2006"],
          label: x("Risk of a lost-time injury by time in the job, against over a year (2006)", "Rreziku i një lëndimi me humbje ditësh sipas kohës në punë, përballë mbi një viti (2006)", "Risiko einer Verletzung mit Ausfalltagen nach Zeit im Job, gegenüber über einem Jahr (2006)"),
          items: [
            { k: x("First month", "Muaji i parë", "Erster Monat"), v: 4.08, n: x("4.08×", "4,08×", "4,08×"), alert: true },
            { k: x("Second month", "Muaji i dytë", "Zweiter Monat"), v: 2.15, n: x("2.15×", "2,15×", "2,15×") },
            { k: x("Months 3–4", "Muajt 3–4", "Monate 3–4"), v: 1.93, n: x("1.93×", "1,93×", "1,93×") },
            { k: x("Months 5–12", "Muajt 5–12", "Monate 5–12"), v: 1.73, n: x("1.68–1.73×", "1,68–1,73×", "1,68–1,73×") },
            { k: x("Over a year", "Mbi një vit", "Über ein Jahr"), v: 1, n: x("1.00", "1,00", "1,00") },
          ] },
        { type: "donut", v: 12, n: pc(12), source: ["gallup-2017"], t: x(
          "of US employees strongly agreed that their organisation does a great job of onboarding new employees.",
          "e punonjësve në SHBA ishin plotësisht dakord që organizata e tyre e bën shumë mirë integrimin e të ardhurve të rinj.",
          "der Beschäftigten in den USA stimmten voll zu, dass ihre Organisation neue Mitarbeitende sehr gut einarbeitet.") },
        { type: "callout", reading: true, text: x(
          "The riskiest weeks of a job are its first ones, and the peak brings the most first weeks at once.",
          "Javët më të rrezikshme të një pune janë të parat, dhe piku sjell më shumë javë të para njëherësh.",
          "Die riskantesten Wochen eines Jobs sind die ersten, und die Spitzenzeit bringt die meisten ersten Wochen auf einmal.") },
      ],
      note: x(
        "Rate ratios adjusted for sex, age, occupation and industry, Ontario 2000. Read in the full text.",
        "Raporte të shkallëve, të korrigjuara sipas gjinisë, moshës, profesionit dhe industrisë, Ontario 2000. Lexuar në tekstin e plotë.",
        "Ratenverhältnisse, bereinigt um Geschlecht, Alter, Beruf und Branche, Ontario 2000. Gelesen im Volltext."),
      source: ["breslin-2006", "gallup-2017"],
    },
    {
      id: "hours",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("The long", "Turni", "Die lange"), x("shift", "i gjatë", "Schicht")],
      lead: x(
        "At the peak the hours grow too. Dembe and colleagues followed more than 10,000 American workers from 1987 to 2000 and compared the jobs in which they were injured.",
        "Në pik rriten edhe orët. Dembe dhe kolegët ndoqën më shumë se 10.000 punonjës amerikanë nga 1987 deri në 2000 dhe krahasuan punët ku ata u lënduan.",
        "In der Spitzenzeit steigen auch die Arbeitsstunden. Dembe und Kollegen begleiteten von 1987 bis 2000 mehr als 10.000 amerikanische Beschäftigte und verglichen die Jobs, in denen sie sich verletzten."),
      blocks: [
        { type: "hbars", max: 70, source: ["dembe-2005"],
          label: x("Higher injury hazard than in jobs without it (2005)", "Rrezik më i lartë lëndimi se në punët pa të (2005)", "Höheres Verletzungsrisiko als in Jobs ohne (2005)"),
          items: [
            { k: x("Overtime", "Orë shtesë", "Überstunden"), v: 61, n: x("+61%", "+61%", "+61 %"), alert: true },
            { k: x("12 hours or more a day", "12 orë ose më shumë në ditë", "12 Stunden oder mehr am Tag"), v: 37, n: x("+37%", "+37%", "+37 %") },
            { k: x("60 hours or more a week", "60 orë ose më shumë në javë", "60 Stunden oder mehr pro Woche"), v: 23, n: x("+23%", "+23%", "+23 %") },
          ] },
        { type: "columns", max: 130, height: 96, source: ["folkard-2005"],
          label: x("Relative risk of injury by length of shift, against 8 hours (2005)", "Rreziku relativ i lëndimit sipas gjatësisë së turnit, përballë 8 orëve (2005)", "Relatives Verletzungsrisiko nach Schichtlänge, gegenüber 8 Stunden (2005)"),
          items: [
            { k: x("8 hours", "8 orë", "8 Stunden"), v: 100, n: dec("1.00") },
            { k: x("10 hours", "10 orë", "10 Stunden"), v: 113, n: dec("1.13") },
            { k: x("12 hours", "12 orë", "12 Stunden"), v: 127, n: dec("1.27"), alert: true },
          ] },
        { type: "callout", reading: true, text: x(
          "Overtime handles today's volume and adds to today's risk. At best it is a bridge to a plan.",
          "Orët shtesë përballojnë vëllimin e sotëm dhe shtojnë rrezikun e sotëm. Në rastin më të mirë janë urë drejt një plani.",
          "Überstunden bewältigen das Volumen von heute und erhöhen das Risiko von heute. Bestenfalls sind sie eine Brücke zu einem Plan.") },
      ],
      note: x(
        "Dembe: hazard ratios adjusted for age, sex, occupation, industry and region. Folkard: estimates pooled from four studies of risk by hour on shift. Both read in the full text.",
        "Dembe: raporte rreziku të korrigjuara sipas moshës, gjinisë, profesionit, industrisë dhe rajonit. Folkard: vlerësime të bashkuara nga katër studime të rrezikut sipas orës së turnit. Të dyja të lexuara në tekstin e plotë.",
        "Dembe: Hazard Ratios, bereinigt um Alter, Geschlecht, Beruf, Branche und Region. Folkard: gepoolte Schätzungen aus vier Studien zum Risiko je Schichtstunde. Beide im Volltext gelesen."),
      source: ["dembe-2005", "folkard-2005"],
    },
    {
      id: "floor",
      kicker: x("From the floor", "Si e shoh nga terreni", "Aus der Praxis"),
      title: [x("Days above", "Ditët mbi", "Tage über"), x("forecast", "parashikim", "Prognose")],
      lead: x(
        "Stiven Janaqi has been a Team Leader and an Area Manager in last-mile logistics and works today as a Night Auditor in hospitality.",
        "Stiven Janaqi ka qenë Team Leader dhe Area Manager në logjistikën e miljes së fundit, dhe sot punon si Night Auditor në hoteleri.",
        "Stiven Janaqi war Team Leader und Area Manager in der Last-Mile-Logistik und arbeitet heute als Night Auditor in der Hotellerie."),
      blocks: [
        { type: "qa", sign: "Stiven Janaqi", items: [
          { q: x("What happens to an operation when the load rises?", "Çfarë ndodh me një operacion kur ngarkesa rritet?", "Was passiert mit einem Betrieb, wenn die Last steigt?"), a: [
            x("The peak does not always create the problems. Often it only makes them visible.", "Piku nuk krijon gjithmonë problemet. Shpesh vetëm i bën të dukshme.", "Die Spitzenzeit schafft die Probleme nicht immer. Oft macht sie sie nur sichtbar."),
            x("When volume rises, an unclear SOP becomes a mistake. Incomplete training becomes a delay or a quality problem. Weak communication becomes the next shift's problem. Capacity that looked enough on a normal day starts to show its limits.", "Kur volumi rritet, SOP-ja e paqartë bëhet gabim. Trajnimi i paplotë bëhet vonesë ose problem cilësie. Komunikimi i dobët bëhet problem i turnit tjetër. Kapaciteti që dukej i mjaftueshëm në një ditë normale fillon të tregojë kufijtë e tij.", "Wenn das Volumen steigt, wird eine unklare SOP zum Fehler. Unvollständiges Training wird zur Verspätung oder zum Qualitätsproblem. Schwache Kommunikation wird zum Problem der nächsten Schicht. Kapazität, die an einem normalen Tag ausreichend aussah, beginnt ihre Grenzen zu zeigen."),
          ] },
          { q: x("What have you seen on days when demand ran above forecast?", "Çfarë ke parë në ditët kur kërkesa doli mbi parashikim?", "Was haben Sie an Tagen gesehen, an denen die Nachfrage über der Prognose lag?"), a: [
            x("I have had days when demand ran above forecast. Drivers had to be brought in at short notice, and there were drivers in ramp-up who were not yet fully aligned with the SOPs.", "Kam pasur ditë kur kërkesa doli mbi forecast. U deshën shoferë me njoftim të shkurtër, dhe kishte shoferë në fazën e ramp-up që nuk ishin ende plotësisht të përafruar me SOP-të.", "Ich hatte Tage, an denen die Nachfrage über dem Forecast lag. Fahrer mussten kurzfristig geholt werden, und es gab Fahrer in der Ramp-up-Phase, die noch nicht vollständig auf die SOPs ausgerichtet waren."),
            x("On such a day the damage rate went above target, with several concrete cases of damage during the operation. For me that is the clearest proof that operational pressure shows up directly in quality. New people under pressure expose the weakness of standardisation straight away.", "Në një ditë të tillë, damage rate doli mbi target, me disa raste konkrete dëmtimesh gjatë operacionit. Për mua kjo është prova më e qartë se presioni operacional shfaqet direkt te cilësia. Njerëzit e rinj nën presion e ekspozojnë menjëherë dobësinë e standardizimit.", "An einem solchen Tag lag die Schadensquote über dem Ziel, mit mehreren konkreten Schadensfällen während des Betriebs. Für mich ist das der klarste Beweis, dass sich operativer Druck direkt in der Qualität zeigt. Neue Leute unter Druck legen die Schwäche der Standardisierung sofort offen."),
          ] },
          { q: x("What would you do differently today?", "Çfarë do të bëje ndryshe sot?", "Was würden Sie heute anders machen?"), a: [
            x("Today I would invest more before the load than during it. Once the pressure has started, the time to learn the process becomes much more expensive.", "Sot do të investoja më shumë përpara ngarkesës sesa gjatë saj. Kur presioni ka filluar, koha për të mësuar procesin bëhet shumë më e shtrenjtë.", "Heute würde ich mehr vor der Last investieren als während der Last. Wenn der Druck einmal begonnen hat, wird die Zeit, den Prozess zu lernen, viel teurer."),
            x("Capacity is not only a number of people. It is the number of people who can carry out the process to standard.", "Kapaciteti nuk është vetëm numër njerëzish. Është numër njerëzish që mund ta ekzekutojnë procesin në standard.", "Kapazität ist nicht nur eine Anzahl von Menschen. Sie ist die Zahl der Menschen, die den Prozess nach Standard ausführen können."),
          ] },
        ] },
        { type: "callout", label: x("A question for you", "Pyetja për ty", "Eine Frage an Sie"), text: x(
          "If your volume rose by a third tomorrow, which standard would break first?",
          "Nëse nesër vëllimi yt do të rritej me një të tretën, cili standard do të prishej i pari?",
          "Wenn Ihr Volumen morgen um ein Drittel stiege, welcher Standard würde zuerst brechen?") },
      ],
    },
    {
      id: "tool", tool: "/tools/shift-handover/", more: "why-the-handover-is-underrated",
      kicker: x("Tool of the month", "Mjeti i muajit", "Tool des Monats"),
      title: [x("The shift", "Dorëzimi", "Die"), x("handover", "i turnit", "Schichtübergabe")],
      lead: x(
        "When volume rises, personal memory becomes less reliable; the handover becomes the memory of the operation. In nine hospitals a structured handover cut medical errors by almost a quarter, without making handovers longer.",
        "Kur volumi rritet, kujtesa personale bëhet më pak e besueshme; dorëzimi bëhet memoria e operacionit. Në nëntë spitale, një dorëzim i strukturuar i uli gabimet mjekësore me gati një të katërtën, pa i zgjatur dorëzimet.",
        "Wenn das Volumen steigt, wird das persönliche Gedächtnis weniger zuverlässig; die Übergabe wird zum Gedächtnis des Betriebs. In neun Krankenhäusern senkte eine strukturierte Übergabe die medizinischen Fehler um fast ein Viertel, ohne die Übergaben zu verlängern."),
      blocks: [
        { type: "pairs", from: x("Before", "Para", "Vorher"), to: x("After", "Pas", "Nachher"), max: 26, source: ["starmer-2014"],
          label: x("Per 100 admissions, before and after the I-PASS handover (2014)", "Për 100 shtrime, para dhe pas dorëzimit I-PASS (2014)", "Pro 100 Aufnahmen, vor und nach der I-PASS-Übergabe (2014)"),
          rows: [
            { k: x("Medical errors", "Gabime mjekësore", "Medizinische Fehler"), a: 24.5, an: dec("24.5"), b: 18.8, bn: dec("18.8"), alert: true },
            { k: x("Preventable adverse events", "Ngjarje të dëmshme të parandalueshme", "Vermeidbare unerwünschte Ereignisse"), a: 4.7, an: dec("4.7"), b: 3.3, bn: dec("3.3") },
          ] },
        { type: "rows", compact: true, label: x("Five fields under pressure", "Pesë fusha nën presion", "Fünf Felder unter Druck"), items: [
          { h: x("What changed", "Çfarë ndryshoi", "Was hat sich geändert"), p: x("volume, people, equipment, against the plan", "vëllimi, njerëzit, pajisjet, krahasuar me planin", "Volumen, Leute, Ausrüstung, im Vergleich zum Plan") },
          { h: x("What remains open", "Çfarë mbetet e hapur", "Was bleibt offen"), p: x("each issue in one line", "çdo çështje në një rresht", "jeder Punkt in einer Zeile") },
          { h: x("Who owns it", "Kush e mban", "Wer verantwortet es"), p: x("one name per issue", "një emër për çdo çështje", "ein Name pro Punkt") },
          { h: x("By when", "Deri kur", "Bis wann"), p: x("a time, not “soon”", "një orë, jo “shpejt”", "eine Uhrzeit, nicht „bald“") },
          { h: x("What the next shift must know", "Çfarë duhet të dijë turni tjetër", "Was die nächste Schicht wissen muss"), p: x("heads-ups, safety, new people on the team", "paralajmërime, siguria, njerëz të rinj në ekip", "Hinweise, Sicherheit, neue Leute im Team") },
        ] },
      ],
      note: x(
        "Resident handovers in nine children's hospitals, 10,740 admissions; oral handovers took 2.4 and 2.5 minutes per patient. The five fields come from Stiven Janaqi's answers for this issue; the notes under them are the editors'.",
        "Dorëzimet e mjekëve specializantë në nëntë spitale pediatrike, 10.740 shtrime; dorëzimet me gojë zgjatën 2,4 dhe 2,5 minuta për pacient. Pesë fushat vijnë nga përgjigjet e Stiven Janaqit për këtë numër; shënimet nën to janë të redaksisë.",
        "Übergaben von Assistenzärztinnen und -ärzten in neun Kinderkliniken, 10.740 Aufnahmen; mündliche Übergaben dauerten 2,4 und 2,5 Minuten pro Patient. Die fünf Felder stammen aus Stiven Janaqis Antworten für diese Ausgabe; die Hinweise darunter sind von der Redaktion."),
      source: ["starmer-2014"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
