// Management Review, No. 67: Leading remotely. Block: Role.
// Facts and their sources: docs/revista/management-review-nr-67.md. The quit rates are the means in the Nature article
// (7.20, 4.80; non-managers 8.59, 5.33; managers 2.96, 3.13), rounded by the editors to one decimal.
import { x, pc } from "../common.js";

export default {
  number: 67,
  block: "role",
  date: x("November 2026", "Nëntor 2026", "November 2026"),
  theme: [x("Leading", "Të drejtosh", "Führen"), x("remotely", "në distancë", "auf Distanz")],
  sub: x(
    "A randomised trial of two days at home, the gap between how employees and leaders see productivity, three paths in 46 studies, the bridges distance removes, what to measure, and a card for a team agreement.",
    "Një provë e rastësishme me dy ditë në shtëpi, hendeku mes asaj si e shohin produktivitetin punonjësit dhe drejtuesit, tri rrugë në 46 studime, urat që heq distanca, çfarë matet, dhe një kartë për marrëveshjen e ekipit.",
    "Ein randomisierter Versuch mit zwei Tagen zu Hause, die Lücke zwischen Beschäftigten und Leitung beim Blick auf Produktivität, drei Wege in 46 Studien, die Brücken, die Distanz kappt, was man misst, und eine Karte."),
  seo: x(
    "Leading remotely: the Trip.com trial in Nature, productivity paranoia, a meta-analysis of 46 studies, siloed networks, what to measure and a team card.",
    "Të drejtosh në distancë: prova e Trip.com te Nature, paranoja e produktivitetit, 46 studime, rrjetet e mbyllura, çfarë matet dhe një kartë ekipi.",
    "Führen auf Distanz: der Trip.com-Versuch in Nature, Produktivitätsparanoia, 46 Studien, abgeschottete Netzwerke, was man misst, eine Teamkarte."),
  feature: x(
    "Issue 67 starts with a randomised trial in which 1,612 employees of a travel company could work from home two days a week, sets what employees say about their productivity against what their leaders believe, follows a meta-analysis of 46 studies to three paths and one threshold, looks at what distance does to the ties between groups and to feedback, asks what a remote leader should measure, and ends with a card for a team's working agreement.",
    "Numri 67 nis me një provë të rastësishme ku 1.612 punonjës të një kompanie udhëtimesh mund të punonin nga shtëpia dy ditë në javë, vë atë që thonë punonjësit për produktivitetin e tyre përballë asaj që besojnë drejtuesit, ndjek një meta-analizë të 46 studimeve te tri rrugë dhe një prag, shikon çfarë u bën distanca lidhjeve mes grupeve dhe feedback-ut, pyet çfarë duhet të matë një drejtues në distancë, dhe mbyllet me një kartë për marrëveshjen e punës së ekipit.",
    "Ausgabe 67 beginnt mit einem randomisierten Versuch, in dem 1.612 Beschäftigte eines Reiseunternehmens zwei Tage pro Woche zu Hause arbeiten konnten, stellt dem, was Beschäftigte über ihre Produktivität sagen, gegenüber, was ihre Leitung glaubt, folgt einer Metaanalyse von 46 Studien zu drei Wegen und einer Schwelle, betrachtet, was Distanz mit den Verbindungen zwischen Gruppen und mit Feedback macht, fragt, was eine Führungskraft auf Distanz messen sollte, und endet mit einer Karte für die Arbeitsvereinbarung eines Teams."),
  figure: { n: pc(33), by: "Bloom, Han & Liang, 2024", t: x(
    "fewer quits when employees could work from home two days a week, in a randomised trial with 1,612 people. Their performance reviews did not change.",
    "më pak largime kur punonjësit mund të punonin nga shtëpia dy ditë në javë, në një provë të rastësishme me 1.612 vetë. Vlerësimet e tyre të performancës nuk ndryshuan.",
    "weniger Kündigungen, als Beschäftigte zwei Tage pro Woche zu Hause arbeiten konnten, in einem randomisierten Versuch mit 1.612 Personen. Ihre Leistungsbeurteilungen änderten sich nicht.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("Two days at home", "Dy ditë në shtëpi", "Zwei Tage zu Hause") },
    { page: "model", kicker: x("The model", "Modeli", "Das Modell"),
      title: x("Three paths, one threshold", "Tri rrugë, një prag", "Drei Wege, eine Schwelle") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The team agreement card", "Karta e marrëveshjes së ekipit", "Die Karte für die Teamvereinbarung") },
  ],
  sources: ["remote-bloom-2024", "remote-wti-2022", "remote-gajendran-2007", "remote-yang-2022", "remote-emanuel-2023", "gallup-sogw-2026", "remote-gallup-hybrid-2026"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "More and more teams do not share a room every day. A manager who cannot see the work has to lead it another way: through results, clear priorities and agreements the team makes together. This issue asks what the research shows and what a remote leader can do with it.",
        "Gjithnjë e më shumë ekipe nuk ndajnë të njëjtën dhomë çdo ditë. Një menaxher që nuk e sheh punën duhet ta drejtojë ndryshe: me rezultate, me prioritete të qarta dhe me marrëveshje që ekipi i bën bashkë. Ky numër pyet çfarë tregon kërkimi dhe çfarë mund të bëjë me të një drejtues në distancë.",
        "Immer mehr Teams teilen nicht jeden Tag einen Raum. Wer die Arbeit nicht sieht, muss sie anders führen: über Ergebnisse, klare Prioritäten und Vereinbarungen, die das Team gemeinsam trifft. Diese Ausgabe fragt, was die Forschung zeigt und was eine Führungskraft auf Distanz damit anfangen kann."),
      body: x(
        "In a randomised trial at Trip.com, two days at home cut quits by a third without hurting performance reviews. Microsoft found that 85% of leaders struggle to trust that hybrid staff are productive. A meta-analysis of 46 studies shows three paths and a threshold of 2.5 days a week. Data from Microsoft and a Fortune 500 firm show what distance takes away: bridges between groups and feedback for the young. Gallup shows what to measure, and what a team agreement holds.",
        "Në një provë të rastësishme te Trip.com, dy ditë në shtëpi i ulën largimet me një të tretën pa i dëmtuar vlerësimet e performancës. Microsoft gjeti se 85% e drejtuesve e kanë të vështirë të besojnë se stafi hibrid është produktiv. Një meta-analizë e 46 studimeve tregon tri rrugë dhe një prag prej 2,5 ditësh në javë. Të dhënat e Microsoft dhe të një kompanie Fortune 500 tregojnë çfarë heq distanca: urat mes grupeve dhe feedback-un për të rinjtë. Gallup tregon çfarë matet dhe çfarë mban një marrëveshje ekipi.",
        "In einem randomisierten Versuch bei Trip.com senkten zwei Tage zu Hause die Kündigungen um ein Drittel, ohne den Leistungsbeurteilungen zu schaden. Microsoft fand, dass 85 % der Führungskräfte schwer darauf vertrauen, dass hybrides Personal produktiv ist. Eine Metaanalyse von 46 Studien zeigt drei Wege und eine Schwelle von 2,5 Tagen pro Woche. Daten von Microsoft und einem Fortune-500-Unternehmen zeigen, was Distanz nimmt: Brücken zwischen Gruppen und Feedback für Junge. Gallup zeigt, was man misst und was eine Teamvereinbarung enthält."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("Two days", "Dy ditë", "Zwei Tage"), x("at home", "në shtëpi", "zu Hause")],
      lead: x(
        "In August 2021 the travel company Trip.com split 1,612 graduates in engineering, marketing and finance by birthday. Those born on an odd day could work from home on Wednesdays and Fridays; the rest came in five days. Nicholas Bloom, Ruobing Han and James Liang followed them.",
        "Në gusht 2021, kompania e udhëtimeve Trip.com i ndau sipas ditëlindjes 1.612 të diplomuar në inxhinieri, marketing dhe financë. Të lindurit në një ditë tek mund të punonin nga shtëpia të mërkurën dhe të premten; të tjerët vinin pesë ditë. I ndoqën Nicholas Bloom, Ruobing Han dhe James Liang.",
        "Im August 2021 teilte das Reiseunternehmen Trip.com 1.612 Akademiker aus Technik, Marketing und Finanzen nach dem Geburtstag ein. Wer an einem ungeraden Tag geboren war, durfte mittwochs und freitags zu Hause arbeiten, die anderen kamen fünf Tage. Nicholas Bloom, Ruobing Han und James Liang begleiteten sie."),
      blocks: [
        { type: "pairs", from: x("Five days in the office", "Pesë ditë në zyrë", "Fünf Tage im Büro"), to: x("Two days at home", "Dy ditë në shtëpi", "Zwei Tage zu Hause"), max: 10, source: ["remote-bloom-2024"],
          label: x("Quit rate during the trial, August 2021 to January 2022", "Shkalla e largimeve gjatë provës, gusht 2021 deri në janar 2022", "Kündigungsquote im Versuch, August 2021 bis Januar 2022"),
          rows: [
            { k: x("All employees", "Të gjithë punonjësit", "Alle Beschäftigten"), a: 7.2, an: x("7.2%", "7,2%", "7,2 %"), b: 4.8, bn: x("4.8%", "4,8%", "4,8 %"), alert: true },
            { k: x("Non-managers (1,217)", "Jo-menaxherët (1.217)", "Ohne Führung (1.217)"), a: 8.6, an: x("8.6%", "8,6%", "8,6 %"), b: 5.3, bn: x("5.3%", "5,3%", "5,3 %") },
            { k: x("Managers (395)", "Menaxherët (395)", "Führungskräfte (395)"), a: 3.0, an: x("3.0%", "3,0%", "3,0 %"), b: 3.1, bn: x("3.1%", "3,1%", "3,1 %") },
          ] },
        { type: "p", text: x(
          "Performance grades and promotions over the next two years did not differ, nor did the code engineers wrote. The 395 managers expected hybrid work to cut productivity by 2.6%; after the trial, they expected a gain of 1.0%. The company then extended it to all staff.",
          "Notat e performancës dhe ngritjet në dy vitet pas saj nuk ndryshuan, as kodi i inxhinierëve. 395 menaxherët prisnin që puna hibride ta ulte produktivitetin me 2,6%; pas provës prisnin një rritje prej 1,0%. Kompania e shtriu pastaj për të gjithë stafin.",
          "Leistungsnoten und Beförderungen der folgenden zwei Jahre unterschieden sich nicht, ebenso wenig der Code der Entwickler. Die 395 Führungskräfte erwarteten 2,6 % weniger Produktivität, nach dem Versuch 1,0 % mehr. Danach galt die Regel für alle.") },
        { type: "callout", reading: true, text: x(
          "The managers were not convinced by argument, but by six months of their own data.",
          "Menaxherët nuk i bindën argumentet, por gjashtë muaj me të dhënat e tyre.",
          "Nicht Argumente überzeugten die Führungskräfte, sondern sechs Monate eigene Daten.") },
      ],
      note: x(
        "Co-author James Liang co-founded and chairs Trip.com; the firm did not fund the study. Most took one day at home, usually Friday.",
        "Bashkautori James Liang është bashkëthemelues dhe kryetar i Trip.com; kompania nuk e financoi studimin. Shumica merrnin një ditë në shtëpi, zakonisht të premten.",
        "Mitautor James Liang ist Mitgründer und Chairman von Trip.com; die Firma finanzierte die Studie nicht. Die meisten nahmen einen Tag zu Hause, meist freitags."),
      source: ["remote-bloom-2024"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("Productivity", "Paranoja e", "Produktivitäts-"), x("paranoia", "produktivitetit", "paranoia")],
      lead: x(
        "In the summer of 2022 Microsoft surveyed 20,006 knowledge workers in 11 countries, Germany among them. The gap it found it called productivity paranoia: leaders fear that lost productivity comes from people not working.",
        "Në verën e 2022, Microsoft anketoi 20.006 punonjës të dijes në 11 vende, mes tyre Gjermania. Hendekun që gjeti e quajti paranojë të produktivitetit: drejtuesit kanë frikë se produktiviteti i humbur vjen nga njerëz që nuk punojnë.",
        "Im Sommer 2022 befragte Microsoft 20.006 Wissensarbeiter in 11 Ländern, darunter Deutschland. Die Lücke, die es fand, nannte es Produktivitätsparanoia: Führungskräfte fürchten, verlorene Produktivität komme daher, dass Menschen nicht arbeiten."),
      blocks: [
        { type: "hbars", source: ["remote-wti-2022"],
          label: x("Knowledge workers in 11 countries, July and August 2022", "Punonjës të dijes në 11 vende, korrik dhe gusht 2022", "Wissensarbeiter in 11 Ländern, Juli und August 2022"),
          items: [
            { k: x("Employees: I am productive at work", "Punonjësit: jam produktiv në punë", "Beschäftigte: Ich bin bei der Arbeit produktiv"), v: 87, n: pc(87) },
            { k: x("Leaders: hybrid work makes confidence hard", "Drejtuesit: puna hibride e vështirëson besimin", "Leitung: Hybridarbeit erschwert Vertrauen"), v: 85, n: pc(85) },
            { k: x("Leaders: full confidence my team is productive", "Drejtuesit: besim i plotë se ekipi është produktiv", "Leitung: volles Vertrauen in die Produktivität"), v: 12, n: pc(12), alert: true },
          ] },
        { type: "p", text: x(
          "In the same survey, 81% of employees said it is important that their manager helps them prioritise their workload. Less than a third, 31%, said their manager had ever given clear guidance in one-on-ones.",
          "Në të njëjtën anketë, 81% e punonjësve thanë se është e rëndësishme që menaxheri t'i ndihmojë të vendosin prioritetet e punës. Më pak se një e treta, 31%, thanë se menaxheri u kishte dhënë ndonjëherë udhëzime të qarta në bisedat ballë për ballë.",
          "In derselben Umfrage sagten 81 % der Beschäftigten, es sei wichtig, dass ihre Führungskraft ihnen hilft, die Arbeit zu priorisieren. Weniger als ein Drittel, 31 %, sagten, sie hätten im Einzelgespräch je klare Vorgaben bekommen.") },
        { type: "callout", reading: true, text: x(
          "A leader who cannot see the work is tempted to count activity. The team needs priorities more than it needs to be watched.",
          "Një drejtues që nuk e sheh punën tundohet të numërojë aktivitetin. Ekipit i duhen më shumë prioritete sesa vëzhgim.",
          "Wer die Arbeit nicht sieht, ist versucht, Aktivität zu zählen. Das Team braucht eher Prioritäten als Beobachtung.") },
      ],
      note: x(
        "Online survey by Edelman Data & Intelligence, 7 July to 2 August 2022, at least 2,000 per country. What people say about their work, not measured output.",
        "Anketë online nga Edelman Data & Intelligence, 7 korrik deri më 2 gusht 2022, të paktën 2.000 për vend. Është ajo që njerëzit thonë për punën e tyre, jo prodhim i matur.",
        "Onlineumfrage von Edelman Data & Intelligence, 7. Juli bis 2. August 2022, mindestens 2.000 je Land. Selbstauskünfte über die eigene Arbeit, keine gemessene Leistung."),
      source: ["remote-wti-2022"],
    },
    {
      id: "model",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Three paths,", "Tri rrugë,", "Drei Wege,"), x("one threshold", "një prag", "eine Schwelle")],
      lead: x(
        "Ravi Gajendran and David Harrison combined 46 field studies with 12,883 employees in 2007. Working away from the office acted through three paths, they found, and its effects were small but mostly good.",
        "Në 2007, Ravi Gajendran dhe David Harrison bashkuan 46 studime në terren me 12.883 punonjës. Puna larg zyrës vepronte përmes tri rrugëve, gjetën ata, dhe efektet e saj ishin të vogla, por kryesisht të mira.",
        "Ravi Gajendran und David Harrison fassten 2007 insgesamt 46 Feldstudien mit 12.883 Beschäftigten zusammen. Arbeit außerhalb des Büros wirkte über drei Wege, fanden sie, und ihre Effekte waren klein, aber überwiegend gut."),
      blocks: [
        { type: "cards", cols: 3, items: [
          { h: x("Autonomy", "Autonomia", "Autonomie"), p: x("more control over how and when; the main path to the benefits", "më shumë kontroll mbi si dhe kur; rruga kryesore drejt përfitimeve", "mehr Kontrolle über das Wie und Wann; der Hauptweg zum Nutzen") },
          { h: x("Work and family", "Puna dhe familja", "Arbeit und Familie"), p: x("less conflict, and less still with more days away", "më pak konflikt, dhe edhe më pak me më shumë ditë larg", "weniger Konflikt, mit mehr Tagen außer Haus noch weniger") },
          { h: x("Relationships", "Marrëdhëniet", "Beziehungen"), p: x("slightly better with the manager; with colleagues unchanged, up to 2.5 days a week", "pak më mirë me menaxherin; me kolegët pa ndryshim, deri në 2,5 ditë në javë", "mit der Führungskraft etwas besser; mit Kollegen unverändert, bis 2,5 Tage pro Woche") },
        ] },
        { type: "p", text: x(
          "Job satisfaction rose, and intent to quit and role stress fell. Performance rated by supervisors or records was higher; self-rated performance was not. Career prospects did not suffer. Beyond 2.5 days a week away, relationships with colleagues worsened. The authors suggest a day when the group is together, and treating remote work as normal, not as a privilege.",
          "Kënaqësia në punë u rrit, ndërsa synimi për t'u larguar dhe stresi i rolit ranë. Performanca e vlerësuar nga eprorët ose nga të dhënat ishte më e lartë; ajo e vetëvlerësuar jo. Perspektiva e karrierës nuk u dëmtua. Përtej 2,5 ditëve në javë larg, marrëdhëniet me kolegët u përkeqësuan. Autorët sugjerojnë një ditë kur grupi është bashkë, dhe ta trajtosh punën në distancë si normale, jo si privilegj.",
          "Die Arbeitszufriedenheit stieg, Kündigungsabsicht und Rollenstress sanken. Von Vorgesetzten oder Daten bewertete Leistung war höher, selbst bewertete nicht. Die Karriere litt nicht. Ab mehr als 2,5 Tagen pro Woche außer Haus wurden die Beziehungen zu Kollegen schlechter. Die Autoren raten zu einem gemeinsamen Tag und dazu, Fernarbeit als normal zu behandeln, nicht als Privileg.") },
        { type: "callout", reading: true, text: x(
          "Distance does not cut the tie to the manager. It thins the ties between colleagues, and someone has to rebuild them on purpose.",
          "Distanca nuk e pret lidhjen me menaxherin. I hollon lidhjet mes kolegëve, dhe dikush duhet t'i rindërtojë me qëllim.",
          "Distanz trennt nicht die Verbindung zur Führungskraft. Sie dünnt die Verbindungen zwischen Kollegen aus, und jemand muss sie bewusst neu knüpfen.") },
      ],
      note: x(
        "Correlations from field studies up to 2007, mostly not experiments; the effects are small. The three paths are the authors'; the short descriptions are the editors'.",
        "Korrelacione nga studime në terren deri në 2007, kryesisht jo eksperimente; efektet janë të vogla. Tri rrugët janë të autorëve; përshkrimet e shkurtra janë të redaksisë.",
        "Korrelationen aus Feldstudien bis 2007, meist keine Experimente; die Effekte sind klein. Die drei Wege stammen von den Autoren, die Kurzbeschreibungen von der Redaktion."),
      source: ["remote-gajendran-2007"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("Fewer bridges,", "Më pak ura,", "Weniger Brücken,"), x("less feedback", "më pak feedback", "weniger Feedback")],
      lead: x(
        "Longqi Yang and colleagues compared 61,182 Microsoft employees in the US in the first half of 2020: those who already worked remotely before the pandemic and those the firm-wide move sent home. Remote work made the network more static and siloed, with fewer bridges between groups.",
        "Longqi Yang dhe kolegët krahasuan 61.182 punonjës të Microsoft në SHBA në gjysmën e parë të 2020: ata që punonin tashmë në distancë para pandemisë dhe ata që i dërgoi në shtëpi vendimi për gjithë kompaninë. Puna në distancë e bëri rrjetin më statik dhe më të mbyllur, me më pak ura mes grupeve.",
        "Longqi Yang und Kollegen verglichen 61.182 Microsoft-Beschäftigte in den USA im ersten Halbjahr 2020: jene, die schon vor der Pandemie remote arbeiteten, und jene, die der firmenweite Wechsel nach Hause schickte. Fernarbeit machte das Netzwerk starrer und abgeschotteter, mit weniger Brücken zwischen Gruppen."),
      blocks: [
        { type: "figures", compact: true, items: [
          { n: x("−25%", "−25%", "−25 %"), t: x("share of collaboration time with people in other groups, about a quarter below its level before (Microsoft, 2020)", "pjesa e kohës së bashkëpunimit me njerëz nga grupe të tjera, rreth një e katërta nën nivelin e mëparshëm (Microsoft, 2020)", "Anteil der Zusammenarbeit mit anderen Gruppen, rund ein Viertel unter dem Stand davor (Microsoft, 2020)") },
          { n: x("−5%", "−5%", "−5 %"), t: x("meeting and call hours; email and chat grew instead", "orë takimesh dhe thirrjesh; në vend të tyre u rritën email-i dhe chat-i", "Stunden in Meetings und Anrufen; dafür mehr E-Mail und Chat") },
          { n: x("+18.3%", "+18,3%", "+18,3 %"), t: x("feedback on code for engineers who sat near their teammates (Fortune 500 firm, 2019–2024)", "feedback për kodin për inxhinierët që uleshin pranë ekipit (kompani Fortune 500, 2019–2024)", "Feedback zum Code für Entwickler, die nahe beim Team saßen (Fortune-500-Firma, 2019–2024)") },
        ] },
        { type: "p", text: x(
          "Natalia Emanuel, Emma Harrington and Amanda Pallais followed software engineers through office closures and later return-to-office mandates. Sitting near teammates raised feedback and code quality, above all for younger and newer engineers; experienced engineers wrote less code.",
          "Natalia Emanuel, Emma Harrington dhe Amanda Pallais ndoqën inxhinierë softueri gjatë mbylljes së zyrave dhe kthimit të mëvonshëm të detyruar në zyrë. Të qenët pranë ekipit rriti feedback-un dhe cilësinë e kodit, sidomos për inxhinierët më të rinj dhe më të sapoardhur; ata me përvojë shkruanin më pak kod.",
          "Natalia Emanuel, Emma Harrington und Amanda Pallais begleiteten Softwareentwickler durch Büroschließungen und spätere Rückkehrpflichten. Nähe zum Team brachte mehr Feedback und besseren Code, vor allem für jüngere und neuere Entwickler; erfahrene schrieben weniger Code.") },
        { type: "callout", reading: true, text: x(
          "Distance does not stop the planned work. It stops what nobody plans: the quick question, the contact in another team. A remote leader has to plan it.",
          "Distanca nuk e ndal punën e planifikuar. Ndal atë që nuk e planifikon askush: pyetjen e shpejtë, kontaktin në një ekip tjetër. Një drejtues në distancë duhet ta planifikojë.",
          "Distanz stoppt nicht die geplante Arbeit, sondern das, was niemand plant: die kurze Frage, den Kontakt in ein anderes Team. Wer auf Distanz führt, muss es planen.") },
      ],
      note: x(
        "Microsoft: one firm, during the pandemic; the two figures are from the authors' summary, as the full article was paywalled. Emanuel et al.: a working paper from one firm.",
        "Microsoft: një kompani, gjatë pandemisë; dy shifrat vijnë nga përmbledhja e autorëve, sepse artikulli i plotë ishte me pagesë. Emanuel et al.: version pune nga një kompani.",
        "Microsoft: eine Firma, in der Pandemie; die zwei Zahlen stammen aus der Zusammenfassung der Autoren, der volle Artikel war kostenpflichtig. Emanuel et al.: Arbeitspapier aus einer Firma."),
      source: ["remote-yang-2022", "remote-emanuel-2023"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie man es misst"),
      title: [x("More than", "Më shumë se", "Mehr als"), x("one number", "një numër", "eine Zahl")],
      lead: x(
        "Where people work says little on its own. In Gallup's 2025 global data, employees who worked only remotely were the most engaged, and the least likely to be thriving in their lives.",
        "Vendi ku punojnë njerëzit thotë pak vetvetiu. Te të dhënat globale të Gallup për 2025, punonjësit që punonin vetëm në distancë ishin më të angazhuarit, dhe më rrallë me mirëqenie të lartë në jetë.",
        "Wo Menschen arbeiten, sagt allein wenig. In Gallups globalen Daten für 2025 waren ausschließlich remote Arbeitende am engagiertesten und am seltensten mit hohem Wohlbefinden im Leben."),
      blocks: [
        { type: "pairs", from: x("Engaged", "Të angazhuar", "Engagiert"), to: x("Thriving", "Me mirëqenie të lartë", "Hohes Wohlbefinden"), max: 50, source: ["gallup-sogw-2026"],
          label: x("Employees by place of work, worldwide, 2025", "Punonjësit sipas vendit të punës, në botë, 2025", "Beschäftigte nach Arbeitsort, weltweit, 2025"),
          rows: [
            { k: x("Only remote", "Vetëm në distancë", "Nur remote"), a: 30, an: pc(30), b: 33, bn: pc(33), alert: true },
            { k: x("Hybrid", "Hibridë", "Hybrid"), a: 25, an: pc(25), b: 45, bn: pc(45) },
            { k: x("On site, job could be remote", "Në vend, puna mund të bëhej në distancë", "Vor Ort, Arbeit wäre remote möglich"), a: 24, an: pc(24), b: 45, bn: pc(45) },
          ] },
        { type: "rows", compact: true, items: [
          { h: x("Results", "Rezultatet", "Ergebnisse"), p: x("what was agreed and delivered, not hours online", "çfarë u ra dakord dhe çfarë u dorëzua, jo orët online", "was vereinbart und geliefert wurde, nicht Stunden online") },
          { h: x("Clarity", "Qartësia", "Klarheit"), p: x("in the US it fell twice as fast for hybrid and remote staff (Gallup, 2024)", "në SHBA ra dy herë më shpejt te stafi hibrid dhe në distancë (Gallup, 2024)", "in den USA sank sie bei Hybrid- und Remote-Beschäftigten doppelt so schnell (Gallup, 2024)") },
          { h: x("Connection", "Lidhja", "Verbindung"), p: x("lonely the day before: 24% remote and hybrid, 18% on site", "të vetmuar një ditë më parë: 24% në distancë dhe hibridë, 18% në vend", "am Vortag einsam: 24 % remote und hybrid, 18 % vor Ort") },
        ] },
      ],
      note: x(
        "Gallup World Poll, 141,444 employed respondents in 2025; on-site figures for jobs that could be done remotely. Choosing these three measures is the editors' reading of the sources.",
        "Gallup World Poll, 141.444 të punësuar të anketuar në 2025; shifrat në vend janë për punë që mund të bëheshin në distancë. Zgjedhja e tri matjeve është leximi i redaksisë.",
        "Gallup World Poll, 141.444 erwerbstätige Befragte 2025; Werte vor Ort für Arbeit, die remote möglich wäre. Die Wahl der drei Maße ist die Lesart der Redaktion."),
      source: ["gallup-sogw-2026", "remote-gallup-hybrid-2026"],
    },
    {
      id: "tool", tool: "/tools/shift-handover/", more: "80-vehicles-you-cannot-see",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The team", "Karta e marrëveshjes", "Die Karte für die"), x("agreement card", "së ekipit", "Teamvereinbarung")],
      lead: x(
        "In 2024, 48% of hybrid workers told Gallup their team had never discussed a plan for working together. Teams with one were 66% more likely to be engaged and 29% less likely to be burned out. Write it with the team, and review it.",
        "Në 2024, 48% e punonjësve hibridë i thanë Gallup-it se ekipi nuk kishte diskutuar kurrë një plan për të punuar bashkë. Ekipet me plan kishin 66% më shumë gjasa të ishin të angazhuara dhe 29% më pak gjasa të ishin të rraskapitura. Shkruaje me ekipin dhe rishikoje.",
        "2024 sagten 48 % der Hybridbeschäftigten Gallup, ihr Team habe nie einen Plan für die Zusammenarbeit besprochen. Teams mit Plan waren mit 66 % höherer Wahrscheinlichkeit engagiert und mit 29 % geringerer ausgebrannt. Mit dem Team schreiben und überprüfen."),
      blocks: [
        { type: "form", items: [
          { h: x("Channels", "Kanalet", "Kanäle"), hint: x("which channel for what: urgent, routine, decisions", "cili kanal për çfarë: urgjente, rutinë, vendime", "welcher Kanal wofür: dringend, Routine, Entscheidungen") },
          { h: x("Response times", "Kohët e përgjigjes", "Antwortzeiten"), hint: x("how fast in each channel; how to say you are unavailable", "sa shpejt në çdo kanal; si thua që nuk je i lirë", "wie schnell je Kanal; wie man sagt, dass man nicht erreichbar ist") },
          { h: x("Check-ins", "Takimet e rregullta", "Abstimmungen"), hint: x("the team check-in and each weekly one-to-one: when", "takimi i ekipit dhe biseda javore me secilin: kur", "Teamrunde und wöchentliches Einzelgespräch: wann") },
          { h: x("Escalation", "Ngritja e problemit", "Eskalation"), hint: x("what counts as a problem, whom to tell, by when; who owns it until closed", "çfarë quhet problem, kujt i thuhet, deri kur; kush e mban deri në mbyllje", "was als Problem gilt, wem man es sagt, bis wann; wer es bis zum Abschluss hält") },
          { h: x("Written down", "Çfarë shkruhet", "Was schriftlich festgehalten wird"), hint: x("decisions, handovers, open issues with an owner and a time", "vendimet, dorëzimet, çështjet e hapura me përgjegjës dhe afat", "Entscheidungen, Übergaben, offene Punkte mit Verantwortlichen und Frist") },
          { h: x("Together", "Bashkë", "Gemeinsam"), hint: x("which day in person, and what for; the next review date", "cila ditë bashkë, dhe për çfarë; data e rishikimit tjetër", "welcher Tag vor Ort, und wofür; nächster Überprüfungstermin") },
        ] },
      ],
      note: x(
        "A practice proposed by the editors, after Gallup (the most common practices in teams with a plan: check-ins, availability, unavailability) and Gajendran & Harrison (a day together). Teams with and without a plan were compared: an association, not a cause.",
        "Praktikë e propozuar nga redaksia, sipas Gallup-it (praktikat më të shpeshta në ekipet me plan: takimet, disponueshmëria, mosdisponueshmëria) dhe Gajendran & Harrison (një ditë bashkë). U krahasuan ekipe me dhe pa plan: lidhje, jo shkak.",
        "Eine Praxis, die die Redaktion vorschlägt, nach Gallup (häufigste Praktiken in Teams mit Plan: Abstimmungen, Erreichbarkeit, Abwesenheit) und Gajendran & Harrison (ein gemeinsamer Tag). Verglichen wurden Teams mit und ohne Plan: ein Zusammenhang, keine Ursache."),
      source: ["remote-gallup-hybrid-2026", "remote-gajendran-2007"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
