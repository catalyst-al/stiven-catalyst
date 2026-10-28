// Management Review, No. 21: The middle manager, a role being redefined. Block: Role.
// Facts and their sources: docs/revista/management-review-nr-21.md.
import { x, pc } from "../common.js";

export default {
  number: 21,
  block: "role",
  date: x("October 2026", "Tetor 2026", "Oktober 2026"),
  // Corrections made after publication, shown on the issue's page and its sources page.
  corrections: [
    {
      date: x("27 October 2026", "27 tetor 2026", "27. Oktober 2026"),
      t: x(
        "The share of middle managers in the US layoffs one data firm tracked, almost a third, is no longer dated 2023: the part of the Bloomberg article we could read does not give the year, and the analysis was published in March 2024. The 73% and 7% on the manager's role are now credited to Deloitte's press release on the report, where we found them; the chapter we cite does not give them in its text.",
        "Pjesa e menaxherëve të mesëm te largimet në SHBA që ndoqi një firmë të dhënash, gati një e treta, nuk datohet më në 2023: pjesa e artikullit të Bloomberg-ut që mundëm të lexonim nuk e jep vitin, dhe analiza u botua në mars 2024. 73% dhe 7% për rolin e menaxherit i atribuohen tani njoftimit për shtyp të Deloitte-it për raportin, ku i gjetëm; kapitulli që citojmë nuk i jep në tekstin e vet.",
        "Der Anteil mittlerer Führungskräfte an den US-Entlassungen, die eine Datenfirma erfasste, fast ein Drittel, ist nicht mehr auf 2023 datiert: Der Teil des Bloomberg-Artikels, den wir lesen konnten, nennt das Jahr nicht, und die Analyse erschien im März 2024. Die 73 % und 7 % zur Führungsrolle werden jetzt Deloittes Pressemitteilung zum Bericht zugeschrieben, wo wir sie fanden; das zitierte Kapitel nennt sie nicht in seinem Text."),
    },
  ],
  theme: [x("The middle manager,", "Menaxheri i mesëm,", "Die mittlere Führung,"), x("a role being redefined", "roli që po ripërkufizohet", "eine Rolle im Umbau")],
  sub: x(
    "How much middle managers matter to results, why the role is under pressure, the three jobs that remain, where their time goes, and a card for a week that leaves room for people.",
    "Sa ndikojnë menaxherët e mesëm në rezultate, pse roli është nën presion, tri punët që mbeten, ku shkon koha e tyre, dhe një kartë për një javë që lë vend për njerëzit.",
    "Wie viel mittlere Führungskräfte für die Ergebnisse ausmachen, warum die Rolle unter Druck steht, welche drei Aufgaben bleiben, wohin ihre Zeit geht, und eine Karte für eine Woche mit Platz für Menschen."),
  seo: x(
    "The middle manager: Mollick's 22.3%, layoffs and fewer job postings, three jobs that remain, where the time goes, and a card for a week with room for people.",
    "Menaxheri i mesëm: 22,3% e Mollick-ut, largimet dhe më pak njoftime pune, tri punët që mbeten, ku shkon koha, dhe një kartë për një javë me vend për njerëzit.",
    "Die mittlere Führung: Mollicks 22,3 %, Entlassungen, weniger Stellenanzeigen, drei Aufgaben, die bleiben, wohin die Zeit geht, und eine Karte für die Woche."),
  feature: x(
    "In the video game industry, producers, the middle managers, explained far more of the variation in revenue than designers did. Yet layoffs and a fall in job postings have put the role under pressure. Issue 21 sets out three jobs that remain for the middle, follows where its time goes, and ends with a card for a week that leaves room for people.",
    "Në industrinë e videolojërave, producentët, pra menaxherët e mesëm, shpjeguan shumë më tepër nga variacioni i të ardhurave se dizajnerët. Megjithatë largimet nga puna dhe rënia e njoftimeve e kanë vënë rolin nën presion. Numri 21 shtjellon tri punë që i mbeten mesit, ndjek ku i shkon koha, dhe mbyllet me një kartë për një javë që lë vend për njerëzit.",
    "In der Videospielbranche erklärten die Producer, also die mittleren Führungskräfte, weit mehr der Umsatzunterschiede als die Designer. Dennoch setzen Entlassungen und schrumpfende Stellenanzeigen die Rolle unter Druck. Ausgabe 21 beschreibt drei Aufgaben, die der Mitte bleiben, verfolgt, wohin ihre Zeit geht, und endet mit einer Karte für eine Woche mit Platz für Menschen."),
  figure: { n: x("22.3%", "22,3%", "22,3 %"), by: "Mollick, 2012", t: x(
    "of the variation in revenue between video games was explained by their producers, the middle managers; by the designers, just over 7%.",
    "e variacionit të të ardhurave mes videolojërave e shpjeguan producentët e tyre, menaxherët e mesëm; dizajnerët, pak mbi 7%.",
    "der Umsatzunterschiede zwischen Videospielen erklärten ihre Producer, die mittleren Führungskräfte; die Designer etwas über 7 %.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("Who moves the revenue", "Kush lëviz të ardhurat", "Wer den Umsatz bewegt") },
    { page: "model", kicker: x("The model", "Modeli", "Das Modell"),
      title: x("Three jobs of the middle", "Tri punët e mesit", "Drei Aufgaben der Mitte") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("A week with room for people", "Një javë me vend për njerëzit", "Eine Woche mit Platz für Menschen") },
  ],
  sources: ["mollick-2012", "bloomberg-2024", "bi-revelio-2024", "gartner-2024", "wooldridge-floyd-1990", "mckinsey-middle-2023", "deloitte-2025"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Middle managers sit between the strategy and the people who carry it out. In an analysis published in 2024 they made up almost a third of the US layoffs one data firm tracked, and surveys find much of their time going to work other than managing. What is the role worth, and what is it becoming?",
        "Menaxherët e mesëm qëndrojnë mes strategjisë dhe njerëzve që e zbatojnë. Sipas një analize të botuar në 2024 nga një firmë të dhënash, përbënin gati një të tretën e largimeve nga puna që ajo ndoqi në SHBA, dhe anketat gjejnë se shumë nga koha e tyre shkon në punë që nuk është menaxhim. Sa vlen ky rol, dhe në çfarë po shndërrohet?",
        "Mittlere Führungskräfte stehen zwischen der Strategie und denen, die sie umsetzen. In einer 2024 veröffentlichten Analyse stellten sie fast ein Drittel der US-Entlassungen, die eine Datenfirma erfasste, und laut Umfragen fließt viel ihrer Zeit in Arbeit, die keine Führungsarbeit ist. Was ist die Rolle wert, und was wird aus ihr?"),
      body: x(
        "In the video game industry, middle managers explained 22.3% of the variation in revenue, the designers just over 7%. Job postings for middle managers fell 42% in two and a half years, and Gartner predicts that AI will flatten more structures. McKinsey finds middle managers spending nearly half their time on work that is not managing; Deloitte finds only 13% of managers' time going to developing people. A 1990 study linked their part in strategy to better performance.",
        "Në industrinë e videolojërave, menaxherët e mesëm shpjeguan 22,3% të variacionit të të ardhurave, dizajnerët pak mbi 7%. Njoftimet e punës për menaxherë të mesëm ranë me 42% në dy vjet e gjysmë, dhe Gartner-i parashikon që AI do të rrafshojë më shumë struktura. McKinsey gjen se menaxherët e mesëm kalojnë gati gjysmën e kohës në punë që nuk është menaxhim; Deloitte gjen se vetëm 13% e kohës së menaxherëve shkon në zhvillimin e njerëzve. Një studim i vitit 1990 e lidhi pjesën e tyre në strategji me rezultate më të mira.",
        "In der Videospielbranche erklärten mittlere Führungskräfte 22,3 % der Umsatzunterschiede, die Designer etwas über 7 %. Stellenanzeigen für mittlere Führungskräfte gingen in zweieinhalb Jahren um 42 % zurück, und Gartner erwartet, dass KI weitere Strukturen abflacht. Laut McKinsey verbringen mittlere Führungskräfte fast die Hälfte ihrer Zeit mit Arbeit, die keine Führungsarbeit ist; laut Deloitte fließen nur 13 % der Zeit von Führungskräften in die Entwicklung von Menschen. Eine Studie von 1990 brachte ihre Beteiligung an der Strategie mit besserer Leistung in Verbindung."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("Who moves", "Kush lëviz", "Wer den Umsatz"), x("the revenue", "të ardhurat", "bewegt")],
      lead: x(
        "Ethan Mollick studied the video game industry, where producers are the middle managers of a game and designers its innovators, and asked how much of the variation in revenue between games each explained.",
        "Ethan Mollick studioi industrinë e videolojërave, ku producentët janë menaxherët e mesëm të një loje dhe dizajnerët novatorët e saj, dhe pyeti sa nga variacioni i të ardhurave mes lojërave shpjegonte secili.",
        "Ethan Mollick untersuchte die Videospielbranche, in der Producer die mittleren Führungskräfte eines Spiels sind und Designer seine Innovatoren, und fragte, wie viel der Umsatzunterschiede zwischen Spielen jeweils auf sie zurückging."),
      blocks: [
        { type: "hbars", max: 30, source: ["mollick-2012"],
          label: x("Share of the variation in game revenue explained by", "Pjesa e variacionit të të ardhurave që shpjegon", "Anteil der Umsatzunterschiede, erklärt durch"),
          items: [
            { k: x("The producers (middle managers)", "Producentët (menaxherët e mesëm)", "Die Producer (mittlere Führung)"), v: 22.3, n: x("22.3%", "22,3%", "22,3 %"), alert: true },
            { k: x("The company itself", "Vetë kompania", "Das Unternehmen selbst"), v: 21.3, n: x("21.3%", "21,3%", "21,3 %") },
            { k: x("The designers (innovators)", "Dizajnerët (novatorët)", "Die Designer (Innovatoren)"), v: 7, n: x("> 7%", "> 7%", "> 7 %") },
          ] },
        { type: "p", text: x(
          "In the study's own summary, differences between middle managers had a much larger effect on results than differences between innovators. It covers one industry, and its figures are shares of variation that give no recipe.",
          "Sipas përmbledhjes së vetë studimit, dallimet mes menaxherëve të mesëm patën efekt shumë më të madh në rezultate se dallimet mes novatorëve. Studimi mbulon një industri të vetme, dhe shifrat e tij janë pjesë të variacionit, jo recetë.",
          "Laut der Zusammenfassung der Studie wirkten sich Unterschiede zwischen mittleren Führungskräften viel stärker auf die Ergebnisse aus als Unterschiede zwischen Innovatoren. Sie umfasst eine einzige Branche, und ihre Zahlen sind Anteile an der Streuung, die kein Rezept liefern.") },
        { type: "callout", reading: true, text: x(
          "Results depend on the people who organise the work as well as on those with the ideas. A company that cuts this layer should first know what it was doing.",
          "Rezultatet varen nga njerëzit që e organizojnë punën po aq sa nga ata me ide. Një kompani që e pret këtë shtresë duhet të dijë më parë çfarë bënte ajo.",
          "Ergebnisse hängen von denen ab, die die Arbeit organisieren, ebenso wie von denen mit den Ideen. Ein Unternehmen, das diese Ebene streicht, sollte vorher wissen, was sie geleistet hat.") },
      ],
      note: x("For the designers, the sources give just over 7%.", "Për dizajnerët, burimet japin pak mbi 7%.", "Für die Designer nennen die Quellen etwas über 7 %."),
      source: ["mollick-2012"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("A role", "Një rol", "Eine Rolle"), x("under pressure", "nën presion", "unter Druck")],
      lead: x(
        "Three sources point the same way: more layoffs, fewer job postings and a forecast of flatter structures. Each measures something different.",
        "Tri burime tregojnë në të njëjtin drejtim: më shumë largime, më pak njoftime pune dhe një parashikim për struktura më të rrafshëta. Secili mat diçka tjetër.",
        "Drei Quellen, eine Richtung: mehr Entlassungen, weniger Stellenanzeigen und eine Prognose flacherer Strukturen. Jede misst etwas anderes."),
      blocks: [
        { type: "columns", max: 100, height: 100, source: ["bi-revelio-2024"],
          label: x("Job postings for middle managers, April 2022 = 100", "Njoftimet e punës për menaxherë të mesëm, prill 2022 = 100", "Stellenanzeigen für mittlere Führungskräfte, April 2022 = 100"),
          items: [
            { k: x("Apr. 2022", "Prill 2022", "Apr. 2022"), v: 100, n: "100" },
            { k: x("Oct. 2024", "Tetor 2024", "Okt. 2024"), v: 58, n: "58", alert: true },
          ] },
        { type: "rows", compact: true, items: [
          { h: x("Layoffs", "Largimet", "Entlassungen"), p: x("Middle managers made up almost a third of the US layoffs Live Data Technologies tracked, up from 20% in 2018, in an analysis for Bloomberg (2024).", "Në një analizë për Bloomberg-un (2024), menaxherët e mesëm përbënin gati një të tretën e largimeve në SHBA që ndoqi Live Data Technologies, nga 20% në vitin 2018.", "Mittlere Führungskräfte stellten fast ein Drittel der US-Entlassungen, die Live Data Technologies erfasste, nach 20 % im Jahr 2018, so eine Analyse für Bloomberg (2024).") },
          { h: x("Job postings", "Njoftimet e punës", "Stellenanzeigen"), p: x("In October 2024 employers advertised 42% fewer middle-manager jobs than in April 2022, in Revelio Labs data reported by Business Insider.", "Në tetor 2024 punëdhënësit shpallnin 42% më pak vende për menaxherë të mesëm se në prill 2022, sipas të dhënave të Revelio Labs që botoi Business Insider.", "Im Oktober 2024 schrieben Arbeitgeber 42 % weniger Stellen für mittlere Führungskräfte aus als im April 2022, laut Daten von Revelio Labs, über die Business Insider berichtete.") },
          { h: x("A forecast", "Një parashikim", "Eine Prognose"), p: x("Gartner predicted in 2024 that by 2026, 20% of organisations would use AI to flatten their structure, cutting more than half of their middle-manager positions.", "Gartner-i parashikoi në vitin 2024 se deri në 2026, 20% e organizatave do ta përdornin AI për të rrafshuar strukturën, duke hequr mbi gjysmën e vendeve të tyre për menaxherë të mesëm.", "Gartner sagte 2024 voraus, dass bis 2026 20 % der Organisationen mit KI ihre Struktur abflachen und dabei mehr als die Hälfte ihrer Stellen im mittleren Management streichen würden.") },
        ] },
        { type: "callout", reading: true, text: x(
          "The figures measure pressure on the role; they say nothing about the work vanishing. Someone still has to do what the middle did.",
          "Shifrat masin presionin mbi rolin; për zhdukjen e punës nuk thonë asgjë. Dikush ende duhet ta bëjë atë që bënte mesi.",
          "Die Zahlen messen den Druck auf die Rolle; dass die Arbeit verschwindet, sagen sie nicht. Jemand muss weiterhin tun, was die Mitte getan hat.") },
      ],
      note: x(
        "The layoff analysis does not publish its method, and postings are not hires. Gartner's figure is a forecast; we have no data on whether it came true.",
        "Analiza e largimeve nuk e publikon metodën, dhe njoftimet nuk janë punësime. Shifra e Gartner-it është parashikim; s'kemi të dhëna nëse u realizua.",
        "Die Analyse der Entlassungen legt ihre Methode nicht offen, und Anzeigen sind keine Einstellungen. Gartners Zahl ist eine Prognose; ob sie eingetroffen ist, wissen wir nicht."),
      source: ["bloomberg-2024", "bi-revelio-2024", "gartner-2024"],
    },
    {
      id: "model",
      more: "the-operations-manager-i-want-to-be",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Three jobs", "Tri punët", "Drei Aufgaben"), x("of the middle", "e mesit", "der Mitte")],
      lead: x(
        "Strip away the administration and three jobs remain. The list is the editors' reading of the research in this issue.",
        "Hiqe administratën dhe mbeten tri punë. Lista është leximi që redaksia u bën kërkimeve të këtij numri.",
        "Ziehen Sie die Verwaltung ab, bleiben drei Aufgaben. Die Liste ist die Lesart der Redaktion zur Forschung in dieser Ausgabe."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("Translate the strategy", "Përkthe strategjinë", "Die Strategie übersetzen"), p: x("Turn goals into work the team can do, and carry back up what the plan missed. In 20 organisations, Bill Wooldridge and Steven Floyd linked middle managers' part in shaping strategy to better performance.", "Ktheji qëllimet në punë që ekipi mund ta bëjë, dhe çoje lart atë që plani nuk e pa. Në 20 organizata, Bill Wooldridge dhe Steven Floyd e lidhën pjesën e menaxherëve të mesëm në formimin e strategjisë me rezultate më të mira.", "Ziele in Arbeit übersetzen, die das Team leisten kann, und nach oben tragen, was der Plan übersehen hat. In 20 Organisationen brachten Bill Wooldridge und Steven Floyd die Beteiligung mittlerer Führungskräfte an der Strategiebildung mit besserer Leistung in Verbindung.") },
          { h: x("Develop the people", "Zhvillo njerëzit", "Menschen entwickeln"), p: x("Coaching, feedback and growth: the work that, in Deloitte's survey, gets 13% of managers' time.", "Mentorim, reagime dhe rritje: puna që, në anketën e Deloitte-it, merr 13% të kohës së menaxherëve.", "Coaching, Feedback und Entwicklung: die Arbeit, die in Deloittes Umfrage 13 % der Zeit von Führungskräften bekommt.") },
          { h: x("Organise the work across teams", "Organizo punën mes ekipeve", "Die Arbeit zwischen Teams organisieren"), p: x("Priorities, handovers and resources between teams, which no single team owns.", "Përparësitë, dorëzimet dhe burimet mes ekipeve, për të cilat nuk përgjigjet asnjë ekip i vetëm.", "Prioritäten, Übergaben und Ressourcen zwischen Teams, für die kein einzelnes Team zuständig ist.") },
        ] },
        { type: "callout", reading: true, text: x(
          "A middle that only passes on numbers and approvals is easy to cut. One that translates, develops and organises is not: cut it, and the work moves somewhere else.",
          "Një mes që vetëm përcjell shifra dhe miratime pritet lehtë. Një mes që përkthen, zhvillon dhe organizon jo: po ta presësh, puna shkon diku tjetër.",
          "Eine Mitte, die nur Zahlen und Freigaben weiterreicht, lässt sich leicht streichen. Eine, die übersetzt, entwickelt und organisiert, nicht: Wer sie streicht, schiebt die Arbeit an eine andere Stelle.") },
      ],
      note: x(
        "The three jobs are the editors' reading. Wooldridge and Floyd's study of 20 organisations shows an association; it does not prove cause.",
        "Tri punët janë leximi i redaksisë. Studimi i Wooldridge-it dhe Floyd-it në 20 organizata tregon një lidhje; shkakun nuk e provon.",
        "Die drei Aufgaben sind die Lesart der Redaktion. Die Studie von Wooldridge und Floyd mit 20 Organisationen zeigt einen Zusammenhang; eine Ursache belegt sie nicht."),
      source: ["wooldridge-floyd-1990", "deloitte-2025"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("Where the", "Ku shkon", "Wohin die"), x("time goes", "koha", "Zeit geht")],
      lead: x(
        "In spring 2022 McKinsey surveyed 984 people, 706 of them middle managers by its definition. Deloitte returned to the manager's role in its Global Human Capital Trends 2025.",
        "Në pranverën e vitit 2022, McKinsey pyeti 984 njerëz, 706 prej tyre menaxherë të mesëm sipas përkufizimit të saj. Deloitte iu kthye rolit të menaxherit në Global Human Capital Trends 2025.",
        "Im Frühjahr 2022 befragte McKinsey 984 Menschen, 706 davon nach eigener Definition mittlere Führungskräfte. Deloitte griff die Rolle der Führungskraft in den Global Human Capital Trends 2025 auf."),
      blocks: [
        { type: "figures", compact: true, items: [
          { n: "≈½", t: x("of middle managers' time on work that is not managing", "e kohës së menaxherëve të mesëm në punë që nuk është menaxhim", "der Zeit mittlerer Führungskräfte für Arbeit, die keine Führungsarbeit ist") },
          { n: x("≈1 day", "≈1 ditë", "≈1 Tag"), t: x("a week on administrative work", "në javë në punë administrative", "pro Woche für Verwaltungsarbeit") },
          { n: "< 1/3", t: x("of their time on managing people", "e kohës në menaxhimin e njerëzve", "ihrer Zeit für die Führung von Menschen") },
        ] },
        { type: "hbars", max: 50, source: ["deloitte-2025"],
          label: x("Share of managers' time, Deloitte 2025", "Pjesa e kohës së menaxherëve, Deloitte 2025", "Anteil der Zeit von Führungskräften, Deloitte 2025"),
          items: [
            { k: x("Day-to-day problems and administration", "Problemet e ditës dhe administrata", "Tagesprobleme und Verwaltung"), v: 40, n: x("≈40%", "≈40%", "≈40 %"), alert: true },
            { k: x("Developing people", "Zhvillimi i njerëzve", "Menschen entwickeln"), v: 13, n: pc(13) },
          ] },
        { type: "p", text: x(
          "In the report's press release, 73% of organisations called redefining the manager's role important, but only 7% were making great progress; in the report, 36% of managers said they had not been adequately prepared to lead people.",
          "Në njoftimin për shtyp të raportit, 73% e organizatave e quajtën të rëndësishëm ripërkufizimin e rolit të menaxherit, por vetëm 7% po bënin përparim të madh; te raporti, 36% e menaxherëve thanë se nuk ishin përgatitur mjaftueshëm për të drejtuar njerëz.",
          "In der Pressemitteilung zum Bericht hielten 73 % der Organisationen eine Neubestimmung der Führungsrolle für wichtig, doch nur 7 % kamen dabei gut voran; im Bericht gaben 36 % der Führungskräfte an, nicht ausreichend darauf vorbereitet worden zu sein, Menschen zu führen.") },
        { type: "callout", reading: true, text: x(
          "Both surveys find the same thing: the people side of the job gets whatever is left over.",
          "Të dyja anketat gjejnë të njëjtën gjë: puna me njerëzit merr çfarë mbetet.",
          "Beide Umfragen kommen zum selben Ergebnis: Die Arbeit mit Menschen bekommt, was übrig bleibt.") },
      ],
      note: x(
        "The shares of time are the managers' own reports. We could not confirm the size of Deloitte's sample of managers. The 73% and 7% are from Deloitte's press release of 24 March 2025.",
        "Pjesët e kohës janë raportime të vetë menaxherëve. Madhësinë e mostrës së menaxherëve të Deloitte-it nuk e kemi konfirmuar dot. 73% dhe 7% janë nga njoftimi për shtyp i Deloitte-it i 24 marsit 2025.",
        "Die Zeitanteile beruhen auf Angaben der Führungskräfte selbst. Die Größe von Deloittes Stichprobe an Führungskräften konnten wir nicht bestätigen. Die 73 % und 7 % stammen aus Deloittes Pressemitteilung vom 24. März 2025."),
      source: ["mckinsey-middle-2023", "deloitte-2025"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie es gemessen wird"),
      title: [x("Log one", "Regjistro", "Eine Woche"), x("week", "një javë", "protokollieren")],
      lead: x(
        "The surveys describe managers in general. Your own week can be measured the same way, in half-hour blocks, in five minutes a day.",
        "Anketat përshkruajnë menaxherët në përgjithësi. Javën tënde mund ta masësh njësoj, në blloqe gjysmë ore, me pesë minuta në ditë.",
        "Die Umfragen beschreiben Führungskräfte im Allgemeinen. Ihre eigene Woche können Sie genauso messen, in Halbstundenblöcken, mit fünf Minuten am Tag."),
      blocks: [
        { type: "steps", items: [
          { h: x("Log a week in half-hour blocks", "Regjistro një javë në blloqe gjysmë ore", "Eine Woche in Halbstundenblöcken festhalten"), p: x("At the end of each day, from the calendar and memory.", "Në fund të çdo dite, nga kalendari dhe kujtesa.", "Am Ende jedes Tages, aus Kalender und Gedächtnis.") },
          { h: x("Sort each block", "Rendit çdo bllok", "Jeden Block zuordnen"), p: x("People, strategy, work across teams, administration, other work.", "Njerëzit, strategjia, puna mes ekipeve, administrata, punë tjetër.", "Menschen, Strategie, Arbeit zwischen Teams, Verwaltung, andere Arbeit.") },
          { h: x("Compare with what the role needs", "Krahasoje me atë që kërkon roli", "Mit dem vergleichen, was die Rolle braucht"), p: x("Write the share you want next to the share you got.", "Shkruaj pjesën që do pranë pjesës që more.", "Schreiben Sie den gewünschten Anteil neben den tatsächlichen.") },
          { h: x("Move one block a week", "Zhvendos një bllok në javë", "Pro Woche einen Block verschieben"), p: x("Hand over, automate or stop one piece of administration.", "Jepja dikujt tjetër, automatizoje ose ndalo një pjesë të administratës.", "Geben Sie ein Stück Verwaltung ab, automatisieren Sie es oder hören Sie damit auf.") },
        ] },
        { type: "example", label: x("Hypothetical example, a 45-hour week", "Shembull hipotetik, një javë 45-orëshe", "Hypothetisches Beispiel, eine 45-Stunden-Woche"), rows: [
          { k: x("People", "Njerëzit", "Menschen"), v: x("6 hours", "6 orë", "6 Stunden") },
          { k: x("Strategy", "Strategjia", "Strategie"), v: x("3 hours", "3 orë", "3 Stunden") },
          { k: x("Across teams", "Mes ekipeve", "Zwischen Teams"), v: x("9 hours", "9 orë", "9 Stunden") },
          { k: x("Admin", "Administrata", "Verwaltung"), v: x("14 hours", "14 orë", "14 Stunden") },
          { k: x("Other", "Tjetër", "Anderes"), v: x("13 hours", "13 orë", "13 Stunden") },
        ], text: x("Administration takes more than twice the time that people get, so that is where the first block comes from. The numbers are made up.", "Administrata merr më shumë se dyfishin e kohës që marrin njerëzit, prandaj blloku i parë merret prej saj. Numrat janë të sajuar.", "Die Verwaltung bekommt mehr als doppelt so viel Zeit wie die Menschen, also kommt der erste Block von dort. Die Zahlen sind erfunden.") },
      ],
      note: x("The steps and the example are ours.", "Hapat dhe shembulli janë të redaksisë.", "Schritte und Beispiel stammen von uns."),
    },
    {
      id: "tool",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("A week with", "Një javë me vend", "Eine Woche mit"), x("room for people", "për njerëzit", "Platz für Menschen")],
      lead: x(
        "One card to plan a week. The fixed blocks for people and for the work across teams go in first; administration gets what is left.",
        "Një kartë për të planifikuar një javë. Blloqet e fiksuara për njerëzit dhe për punën mes ekipeve hyjnë të parat; administrata merr atë që mbetet.",
        "Eine Karte, um eine Woche zu planen. Die festen Blöcke für Menschen und für die Arbeit zwischen Teams kommen zuerst; die Verwaltung bekommt, was übrig bleibt."),
      blocks: [
        { type: "form", items: [
          { h: x("People", "Njerëzit", "Menschen"), hint: x("one-to-ones, coaching, feedback: when, with whom", "biseda një me një, mentorim, reagime: kur, me kë", "Einzelgespräche, Coaching, Feedback: wann, mit wem"), lines: 2 },
          { h: x("Strategy", "Strategjia", "Strategie"), hint: x("what the team needs to hear this week, and what I carry up", "çfarë duhet të dëgjojë ekipi këtë javë, dhe çfarë çoj lart", "was das Team diese Woche hören muss und was ich nach oben trage") },
          { h: x("Across teams", "Mes ekipeve", "Zwischen Teams"), hint: x("the priorities and handovers I settle with other teams", "përparësitë dhe dorëzimet që i rregulloj me ekipet e tjera", "die Prioritäten und Übergaben, die ich mit anderen Teams kläre") },
          { h: x("Administration", "Administrata", "Verwaltung"), hint: x("what I hand over, automate or stop", "çfarë ia jap dikujt tjetër, automatizoj ose ndaloj", "was ich abgebe, automatisiere oder beende") },
          { h: x("Protected time", "Koha e mbrojtur", "Geschützte Zeit"), hint: x("the hours no one can book", "orët që s'mund t'i zërë askush", "die Stunden, die niemand belegen kann") },
          { h: x("Friday check", "Kontrolli i së premtes", "Freitagsprüfung"), hint: x("the share of the week that went to people", "sa nga java shkoi te njerëzit", "der Anteil der Woche, der an Menschen ging") },
        ] },
      ],
      note: x(
        "Our proposal, building on the time studies of McKinsey and Deloitte.",
        "Propozimi ynë, mbi studimet e kohës të McKinsey-t dhe Deloitte-it.",
        "Unser Vorschlag, aufbauend auf den Zeitstudien von McKinsey und Deloitte."),
      source: ["mckinsey-middle-2023", "deloitte-2025"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
