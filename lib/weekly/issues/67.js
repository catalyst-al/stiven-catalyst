// Management Review, No. 67: Leading remotely. Block: Role.
// Facts and their sources: docs/revista/management-review-nr-67.md. The quit rates are the means in the Nature article
// (7.20, 4.80; non-managers 8.59, 5.33; managers 2.96, 3.13), rounded by the editors to one decimal.
import { x, pc } from "../common.js";

export default {
  number: 67,
  block: "role",
  date: x("October 2026", "Tetor 2026", "Oktober 2026"),
  theme: [x("Leading", "Të drejtosh", "Führen"), x("remotely", "në distancë", "auf Distanz")],
  sub: x(
    "A randomised trial of two days at home, the gap between how employees and leaders see productivity, three paths in 46 studies, the bridges distance removes, what to measure and a card for a team agreement.",
    "Një provë e rastësishme me dy ditë në shtëpi, hendeku mes mënyrës si e shohin produktivitetin punonjësit dhe drejtuesit, tri rrugë në 46 studime, urat që i heq distanca, çfarë duhet matur dhe një kartë për marrëveshjen e ekipit.",
    "Ein randomisierter Versuch mit zwei Tagen zu Hause, die Lücke zwischen dem Blick der Beschäftigten und der Leitung auf Produktivität, drei Wege in 46 Studien, die Brücken, die Distanz kappt, was Sie messen sollten, und eine Karte."),
  seo: x(
    "Leading remotely: the Trip.com trial in Nature, productivity paranoia, a meta-analysis of 46 studies, siloed networks, what to measure and a team card.",
    "Të drejtosh në distancë: prova e Trip.com te Nature, paranoja e produktivitetit, 46 studime, rrjetet e mbyllura, çfarë matet dhe një kartë ekipi.",
    "Führen auf Distanz: der Trip.com-Versuch in Nature, Produktivitätsparanoia, 46 Studien, abgeschottete Netzwerke, was zu messen ist, eine Teamkarte."),
  feature: x(
    "In a randomised trial, 1,612 employees of a travel company could work from home two days a week; Issue 67 begins with what happened. It sets what employees say about their productivity against what their leaders believe, and follows a meta-analysis of 46 studies to three paths and one threshold. It then looks at what distance does to the ties between groups and to feedback, asks what a remote leader should measure, and closes with a card for a team's working agreement.",
    "Numri 67 nis me një provë të rastësishme ku 1.612 punonjës të një kompanie udhëtimesh mund të punonin nga shtëpia dy ditë në javë, dhe me atë që ndodhi. Vë përballë njëra-tjetrës atë që thonë punonjësit për produktivitetin e tyre dhe atë që besojnë drejtuesit, dhe ndjek një meta-analizë të 46 studimeve deri te tri rrugë dhe një prag. Pastaj shikon çfarë u bën distanca lidhjeve mes grupeve dhe komenteve për punën, pyet çfarë duhet të matë një drejtues në distancë, dhe mbyllet me një kartë për marrëveshjen e punës së ekipit.",
    "In einem randomisierten Versuch durften 1.612 Beschäftigte eines Reiseunternehmens zwei Tage pro Woche zu Hause arbeiten; Ausgabe 67 beginnt mit dem Ergebnis. Sie stellt dem, was Beschäftigte über ihre Produktivität sagen, gegenüber, was ihre Leitung glaubt, und folgt einer Metaanalyse von 46 Studien zu drei Wegen und einer Schwelle. Dann zeigt sie, was Distanz mit den Verbindungen zwischen Gruppen und mit Rückmeldungen macht, fragt, was eine Führungskraft auf Distanz messen sollte, und schließt mit einer Karte für die Arbeitsvereinbarung eines Teams."),
  figure: { n: pc(33), by: "Bloom, Han & Liang, 2024", t: x(
    "fewer quits when employees could work from home two days a week, in a randomised trial with 1,612 people. Their performance reviews did not change.",
    "më pak largime kur punonjësit mund të punonin nga shtëpia dy ditë në javë, në një provë të rastësishme me 1.612 vetë. Vlerësimet e tyre të punës nuk ndryshuan.",
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
        "More and more teams do not share a room every day. A manager who cannot see the work has to lead it another way: through results, clear priorities and agreements the team makes together. What does the research show, and what can a remote leader do with it?",
        "Gjithnjë e më shumë ekipe nuk ndajnë të njëjtën dhomë çdo ditë. Një menaxher që nuk e sheh punën duhet ta drejtojë ndryshe: me rezultate, me përparësi të qarta dhe me marrëveshje që ekipi i bën bashkë. Çfarë tregon kërkimi, dhe çfarë mund të bëjë me të një drejtues në distancë?",
        "Immer mehr Teams teilen nicht jeden Tag einen Raum. Wer die Arbeit nicht sieht, muss sie anders führen: über Ergebnisse, klare Prioritäten und Vereinbarungen, die das Team gemeinsam trifft. Was zeigt die Forschung, und was kann eine Führungskraft auf Distanz damit anfangen?"),
      body: x(
        "In a randomised trial at Trip.com, two days at home cut quits by a third without hurting performance reviews. Microsoft found that 85% of leaders struggle to trust that hybrid staff are productive. A meta-analysis of 46 studies shows three paths and a threshold of 2.5 days a week. Data from Microsoft and a Fortune 500 firm show what distance takes away: bridges between groups, and feedback for the young. Gallup shows what to measure and what a team agreement holds.",
        "Në një provë të rastësishme te Trip.com, dy ditë në shtëpi i ulën largimet me një të tretën, pa i dëmtuar vlerësimet e punës. Microsoft-i gjeti se 85% e drejtuesve e kanë të vështirë të besojnë se stafi hibrid është produktiv. Një meta-analizë e 46 studimeve tregon tri rrugë dhe një prag prej 2,5 ditësh në javë. Të dhënat e Microsoft-it dhe të një kompanie Fortune 500 tregojnë çfarë heq distanca: urat mes grupeve dhe komentet për punën e të rinjve. Gallup-i tregon çfarë duhet matur dhe çfarë përmban një marrëveshje ekipi.",
        "In einem randomisierten Versuch bei Trip.com senkten zwei Tage zu Hause die Kündigungen um ein Drittel, ohne den Leistungsbeurteilungen zu schaden. Microsoft fand, dass 85 % der Führungskräfte sich schwertun, darauf zu vertrauen, dass hybrid Arbeitende produktiv sind. Eine Metaanalyse von 46 Studien zeigt drei Wege und eine Schwelle von 2,5 Tagen pro Woche. Daten von Microsoft und einem Fortune-500-Unternehmen zeigen, was Distanz nimmt: Brücken zwischen Gruppen und Rückmeldung für Jüngere. Gallup zeigt, was zu messen ist und was eine Teamvereinbarung enthält."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("Two days", "Dy ditë", "Zwei Tage"), x("at home", "në shtëpi", "zu Hause")],
      lead: x(
        "In August 2021 the travel company Trip.com split 1,612 graduates in engineering, marketing and finance by birthday. Those born on an odd day could work from home on Wednesdays and Fridays; the rest came in five days a week. Nicholas Bloom, Ruobing Han and James Liang followed them.",
        "Në gusht 2021, kompania e udhëtimeve Trip.com i ndau sipas ditëlindjes 1.612 të diplomuar në inxhinieri, marketing dhe financë. Të lindurit në një datë tek mund të punonin nga shtëpia të mërkurën dhe të premten; të tjerët vinin në zyrë pesë ditë në javë. I ndoqën Nicholas Bloom, Ruobing Han dhe James Liang.",
        "Im August 2021 teilte das Reiseunternehmen Trip.com 1.612 Hochschulabsolventen aus Technik, Marketing und Finanzen nach ihrem Geburtstag ein. Wer an einem ungeraden Tag geboren war, durfte mittwochs und freitags zu Hause arbeiten; die anderen kamen fünf Tage pro Woche ins Büro. Nicholas Bloom, Ruobing Han und James Liang begleiteten sie."),
      blocks: [
        { type: "pairs", from: x("Five days in the office", "Pesë ditë në zyrë", "Fünf Tage im Büro"), to: x("Two days at home", "Dy ditë në shtëpi", "Zwei Tage zu Hause"), max: 10, source: ["remote-bloom-2024"],
          label: x("Quit rate during the trial, August 2021 to January 2022", "Shkalla e largimeve gjatë provës, gusht 2021 deri në janar 2022", "Kündigungsquote im Versuch, August 2021 bis Januar 2022"),
          rows: [
            { k: x("All employees", "Të gjithë punonjësit", "Alle Beschäftigten"), a: 7.2, an: x("7.2%", "7,2%", "7,2 %"), b: 4.8, bn: x("4.8%", "4,8%", "4,8 %"), alert: true },
            { k: x("Non-managers (1,217)", "Jo-menaxherët (1.217)", "Ohne Führungsaufgabe (1.217)"), a: 8.6, an: x("8.6%", "8,6%", "8,6 %"), b: 5.3, bn: x("5.3%", "5,3%", "5,3 %") },
            { k: x("Managers (395)", "Menaxherët (395)", "Führungskräfte (395)"), a: 3.0, an: x("3.0%", "3,0%", "3,0 %"), b: 3.1, bn: x("3.1%", "3,1%", "3,1 %") },
          ] },
        { type: "p", text: x(
          "Performance grades and promotions over the next two years did not differ, and neither did the code the engineers wrote. The 395 managers had expected hybrid work to cut productivity by 2.6%; after the trial, they expected a gain of 1.0%. The company then extended the arrangement to all staff.",
          "Notat e punës dhe ngritjet në detyrë në dy vitet që pasuan nuk ndryshuan, as kodi që shkruanin inxhinierët. 395 menaxherët kishin pritur që puna hibride ta ulte produktivitetin me 2,6%; pas provës prisnin një rritje prej 1,0%. Kompania pastaj e shtriu këtë rregull për të gjithë stafin.",
          "Leistungsnoten und Beförderungen der folgenden zwei Jahre unterschieden sich nicht, ebenso wenig der Code der Entwickler. Die 395 Führungskräfte hatten 2,6 % weniger Produktivität erwartet, nach dem Versuch erwarteten sie 1,0 % mehr. Danach galt die Regel für alle Beschäftigten.") },
        { type: "callout", reading: true, text: x(
          "Six months of their own data convinced the managers where argument had not.",
          "Gjashtë muaj me të dhënat e tyre i bindën menaxherët, aty ku argumentet nuk kishin mundur.",
          "Sechs Monate eigener Daten überzeugten die Führungskräfte, wo Argumente es nicht vermocht hatten.") },
      ],
      note: x(
        "Co-author James Liang co-founded Trip.com and chairs its board; the firm did not fund the study. Most took one day at home, usually Friday.",
        "Bashkautori James Liang është bashkëthemelues i Trip.com dhe kryetar i bordit të saj; kompania nuk e financoi studimin. Shumica merrnin një ditë në shtëpi, zakonisht të premten.",
        "Mitautor James Liang ist Mitgründer von Trip.com und Vorsitzender des Verwaltungsrats; die Firma finanzierte die Studie nicht. Die meisten nahmen einen Tag zu Hause, meist freitags."),
      source: ["remote-bloom-2024"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("Productivity", "Paranoja e", "Produktivitäts-"), x("paranoia", "produktivitetit", "paranoia")],
      lead: x(
        "In the summer of 2022 Microsoft surveyed 20,006 knowledge workers in 11 countries, Germany among them. It called the gap it found productivity paranoia: leaders fear that lost productivity comes from people not working.",
        "Në verën e vitit 2022, Microsoft-i anketoi 20.006 punonjës të dijes në 11 vende, mes tyre edhe Gjermania. Hendekun që gjeti e quajti paranojë të produktivitetit: drejtuesit kanë frikë se produktiviteti i humbur vjen nga njerëz që nuk punojnë.",
        "Im Sommer 2022 befragte Microsoft 20.006 Wissensarbeiter in 11 Ländern, darunter Deutschland. Die Lücke, auf die es stieß, nannte es Produktivitätsparanoia: Führungskräfte fürchten, verlorene Produktivität komme daher, dass Menschen nicht arbeiten."),
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
          "Në të njëjtën anketë, 81% e punonjësve thanë se është e rëndësishme që menaxheri t'i ndihmojë të vendosin përparësitë e punës. Më pak se një e treta, 31%, thanë se menaxheri u kishte dhënë ndonjëherë udhëzime të qarta në bisedat ballë për ballë.",
          "In derselben Umfrage sagten 81 % der Beschäftigten, es sei wichtig, dass ihre Führungskraft ihnen hilft, die Arbeit zu priorisieren. Weniger als ein Drittel, 31 %, sagten, sie hätten im Einzelgespräch jemals klare Vorgaben bekommen.") },
        { type: "callout", reading: true, text: x(
          "A leader who cannot see the work is tempted to count activity. The team needs priorities more than it needs to be watched.",
          "Një drejtues që nuk e sheh punën tundohet të numërojë aktivitetin. Ekipit i duhen më shumë përparësi të qarta sesa vëzhgim.",
          "Wer die Arbeit nicht sieht, ist versucht, Aktivität zu zählen. Das Team braucht eher Prioritäten als Beobachtung.") },
      ],
      note: x(
        "Online survey by Edelman Data & Intelligence, 7 July to 2 August 2022, at least 2,000 per country. It records what people say about their work, not measured output.",
        "Anketë online nga Edelman Data & Intelligence, 7 korrik deri më 2 gusht 2022, të paktën 2.000 vetë për vend. Regjistron atë që njerëzit thonë për punën e tyre, jo rezultate të matura.",
        "Onlineumfrage von Edelman Data & Intelligence, 7. Juli bis 2. August 2022, mindestens 2.000 Befragte je Land. Sie erfasst Selbstauskünfte über die eigene Arbeit, keine gemessene Leistung."),
      source: ["remote-wti-2022"],
    },
    {
      id: "model",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Three paths,", "Tri rrugë,", "Drei Wege,"), x("one threshold", "një prag", "eine Schwelle")],
      lead: x(
        "In 2007 Ravi Gajendran and David Harrison combined 46 field studies with 12,883 employees. Working away from the office acted through three paths, they found, and its effects were small but mostly good.",
        "Më 2007, Ravi Gajendran dhe David Harrison bashkuan 46 studime në terren me 12.883 punonjës. Puna larg zyrës vepronte përmes tri rrugëve, gjetën ata, dhe efektet e saj ishin të vogla, por kryesisht të mira.",
        "Ravi Gajendran und David Harrison fassten 2007 insgesamt 46 Feldstudien mit 12.883 Beschäftigten zusammen. Arbeit außerhalb des Büros wirkte demnach über drei Wege, und ihre Effekte waren klein, aber überwiegend positiv."),
      blocks: [
        { type: "cards", cols: 3, items: [
          { h: x("Autonomy", "Autonomia", "Autonomie"), p: x("more control over how and when; the main path to the benefits", "më shumë kontroll mbi mënyrën dhe kohën; rruga kryesore drejt përfitimeve", "mehr Kontrolle über das Wie und Wann; der Hauptweg zum Nutzen") },
          { h: x("Work and family", "Puna dhe familja", "Arbeit und Familie"), p: x("less conflict, and less still with more days away", "më pak konflikt, dhe edhe më pak me më shumë ditë larg", "weniger Konflikt, mit mehr Tagen außer Haus noch weniger") },
          { h: x("Relationships", "Marrëdhëniet", "Beziehungen"), p: x("slightly better with the manager; with colleagues unchanged, up to 2.5 days a week", "pak më mirë me menaxherin; me kolegët pa ndryshim, deri në 2,5 ditë në javë", "mit der Führungskraft etwas besser; mit Kollegen unverändert, bis 2,5 Tage pro Woche") },
        ] },
        { type: "p", text: x(
          "Job satisfaction rose, while intent to quit and role stress fell. Performance rated by supervisors or records was higher; self-rated performance was not. Career prospects did not suffer. Beyond 2.5 days a week away, relationships with colleagues worsened. The authors suggest a day when the group is together, and treating remote work as normal rather than as a privilege.",
          "Kënaqësia në punë u rrit, ndërsa synimi për t'u larguar dhe stresi i rolit ranë. Rendimenti i vlerësuar nga eprorët ose nga të dhënat ishte më i lartë; ai i vetëvlerësuar jo. Perspektiva e karrierës nuk u dëmtua. Përtej 2,5 ditëve në javë larg zyrës, marrëdhëniet me kolegët u përkeqësuan. Autorët sugjerojnë një ditë kur grupi është bashkë, dhe ta trajtosh punën në distancë si diçka normale, jo si privilegj.",
          "Die Arbeitszufriedenheit stieg, Kündigungsabsicht und Rollenstress sanken. Von Vorgesetzten oder anhand von Daten bewertete Leistung war höher, selbst eingeschätzte nicht. Die Karrierechancen litten nicht. Ab mehr als 2,5 Tagen pro Woche außer Haus verschlechterten sich die Beziehungen zu Kollegen. Die Autoren raten zu einem gemeinsamen Tag und dazu, Fernarbeit als normal zu behandeln, nicht als Privileg.") },
        { type: "callout", reading: true, text: x(
          "Distance leaves the tie to the manager intact and thins the ties between colleagues. Someone has to rebuild those on purpose.",
          "Distanca e lë të paprekur lidhjen me menaxherin dhe i hollon lidhjet mes kolegëve. Dikush duhet t'i rindërtojë këto me qëllim.",
          "Distanz lässt die Verbindung zur Führungskraft bestehen und dünnt die Verbindungen zwischen Kollegen aus. Jemand muss sie bewusst neu knüpfen.") },
      ],
      note: x(
        "Correlations from field studies up to 2007, mostly not experiments; the effects are small. The three paths are the authors'; the short descriptions are the editors'.",
        "Korrelacione nga studime në terren deri më 2007, kryesisht jo eksperimente; efektet janë të vogla. Tri rrugët janë të autorëve; përshkrimet e shkurtra janë të redaksisë.",
        "Korrelationen aus Feldstudien bis 2007, meist keine Experimente; die Effekte sind klein. Die drei Wege stammen von den Autoren, die Kurzbeschreibungen von der Redaktion."),
      source: ["remote-gajendran-2007"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("Fewer bridges,", "Më pak ura,", "Weniger Brücken,"), x("less feedback", "më pak komente", "weniger Rückmeldung")],
      lead: x(
        "Longqi Yang and colleagues compared 61,182 Microsoft employees in the US in the first half of 2020: those who already worked remotely before the pandemic and those whom the firm-wide move sent home. Remote work made the network more static and siloed, with fewer bridges between groups.",
        "Longqi Yang dhe kolegët krahasuan 61.182 punonjës të Microsoft-it në SHBA në gjysmën e parë të vitit 2020: ata që punonin tashmë në distancë para pandemisë dhe ata që i dërgoi në shtëpi vendimi për gjithë kompaninë. Puna në distancë e bëri rrjetin më statik dhe më të mbyllur, me më pak ura mes grupeve.",
        "Longqi Yang und Kollegen verglichen 61.182 Microsoft-Beschäftigte in den USA im ersten Halbjahr 2020: jene, die schon vor der Pandemie remote arbeiteten, und jene, die der firmenweite Wechsel nach Hause schickte. Fernarbeit machte das Netzwerk starrer und abgeschotteter, mit weniger Brücken zwischen Gruppen."),
      blocks: [
        { type: "figures", compact: true, items: [
          { n: x("−25%", "−25%", "−25 %"), t: x("share of collaboration time with people in other groups, about a quarter below its level before (Microsoft, 2020)", "pjesa e kohës së bashkëpunimit me njerëz nga grupe të tjera, rreth një e katërta nën nivelin e mëparshëm (Microsoft, 2020)", "Anteil der Zusammenarbeit mit anderen Gruppen, rund ein Viertel unter dem Stand davor (Microsoft, 2020)") },
          { n: x("−5%", "−5%", "−5 %"), t: x("meeting and call hours; email and chat grew instead", "orë takimesh dhe thirrjesh; në vend të tyre u rritën email-i dhe chat-i", "Stunden in Besprechungen und Anrufen; dafür mehr E-Mail und Chat") },
          { n: x("+18.3%", "+18,3%", "+18,3 %"), t: x("feedback on code for engineers who sat near their teammates (Fortune 500 firm, 2019–2024)", "komente për kodin për inxhinierët që uleshin pranë ekipit (kompani Fortune 500, 2019–2024)", "Rückmeldungen zum Code für Entwickler, die nahe beim Team saßen (Fortune-500-Firma, 2019–2024)") },
        ] },
        { type: "p", text: x(
          "Natalia Emanuel, Emma Harrington and Amanda Pallais followed software engineers through office closures and later return-to-office mandates. Sitting near teammates raised feedback and code quality, above all for younger and newer engineers; experienced engineers wrote less code.",
          "Natalia Emanuel, Emma Harrington dhe Amanda Pallais ndoqën inxhinierë softueri gjatë mbylljes së zyrave dhe kthimit të mëvonshëm të detyruar në zyrë. Të qenët pranë ekipit i shtoi komentet dhe cilësinë e kodit, sidomos për inxhinierët më të rinj në moshë dhe në punë; ata me përvojë shkruanin më pak kod.",
          "Natalia Emanuel, Emma Harrington und Amanda Pallais begleiteten Softwareentwickler durch Büroschließungen und spätere Rückkehrpflichten. Nähe zum Team brachte mehr Rückmeldungen und besseren Code, vor allem für jüngere und neuere Entwickler; erfahrene schrieben weniger Code.") },
        { type: "callout", reading: true, text: x(
          "Planned work survives distance. What gets lost is what nobody plans: the quick question, the contact in another team. A remote leader has to plan it.",
          "Puna e planifikuar i mbijeton distancës. Humbet ajo që nuk e planifikon askush: pyetja e shpejtë, kontakti në një ekip tjetër. Një drejtues në distancë duhet ta planifikojë.",
          "Geplante Arbeit übersteht die Distanz. Verloren geht, was niemand plant: die kurze Frage, der Kontakt in ein anderes Team. Wer auf Distanz führt, muss genau das planen.") },
      ],
      note: x(
        "Microsoft: one firm, during the pandemic; the two figures come from the authors' summary, as the full article was behind a paywall. Emanuel et al.: a working paper from one firm.",
        "Microsoft: një kompani, gjatë pandemisë; dy shifrat vijnë nga përmbledhja e autorëve, sepse artikulli i plotë ishte me pagesë. Emanuel et al.: punim në zhvillim nga një kompani e vetme.",
        "Microsoft: eine Firma, während der Pandemie; die zwei Zahlen stammen aus der Zusammenfassung der Autoren, da der vollständige Artikel kostenpflichtig war. Emanuel et al.: ein Arbeitspapier aus einer einzigen Firma."),
      source: ["remote-yang-2022", "remote-emanuel-2023"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie es gemessen wird"),
      title: [x("More than", "Më shumë se", "Mehr als"), x("one number", "një numër", "eine Zahl")],
      lead: x(
        "Where people work says little on its own. In Gallup's 2025 global data, employees who worked only remotely were the most engaged, and among the least likely to be thriving in their lives.",
        "Vendi ku punojnë njerëzit, më vete, thotë pak. Në të dhënat globale të Gallup-it për 2025, punonjësit që punonin vetëm në distancë ishin më të angazhuarit, dhe ndër ata me më pak gjasa për mirëqenie të lartë në jetë.",
        "Wo Menschen arbeiten, sagt für sich genommen wenig. In Gallups globalen Daten für 2025 waren ausschließlich remote Arbeitende am engagiertesten und hatten zugleich mit am seltensten ein hohes Wohlbefinden im Leben."),
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
        "Gallup World Poll, 141,444 employed respondents in 2025; the on-site figures are for jobs that could be done remotely. The choice of these three measures is the editors' reading of the sources.",
        "Gallup World Poll, 141.444 të anketuar të punësuar më 2025; shifrat për punën në vend janë për punë që mund të bëheshin në distancë. Zgjedhja e këtyre tri matjeve është leximi i redaksisë.",
        "Gallup World Poll, 141.444 erwerbstätige Befragte 2025; die Werte vor Ort gelten für Arbeit, die remote möglich wäre. Die Wahl dieser drei Kennzahlen ist die Lesart der Redaktion."),
      source: ["gallup-sogw-2026", "remote-gallup-hybrid-2026"],
    },
    {
      id: "tool", tool: "/tools/shift-handover/", more: "80-vehicles-you-cannot-see",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The team", "Karta e marrëveshjes", "Die Karte für die"), x("agreement card", "së ekipit", "Teamvereinbarung")],
      lead: x(
        "In 2024, 48% of hybrid workers told Gallup their team had never discussed a plan for working together. Teams with one were 66% more likely to be engaged and 29% less likely to be burned out. Write the plan with the team, and review it.",
        "Më 2024, 48% e punonjësve hibridë i thanë Gallup-it se ekipi nuk kishte diskutuar kurrë një plan për të punuar bashkë. Ekipet me plan kishin 66% më shumë gjasa të ishin të angazhuara dhe 29% më pak gjasa të ishin të rraskapitura. Shkruaje planin bashkë me ekipin dhe rishikoje.",
        "2024 sagten 48 % der hybrid Arbeitenden Gallup, ihr Team habe nie einen Plan für die Zusammenarbeit besprochen. Teams mit Plan waren mit 66 % höherer Wahrscheinlichkeit engagiert und mit 29 % geringerer Wahrscheinlichkeit ausgebrannt. Schreiben Sie den Plan mit dem Team und überprüfen Sie ihn."),
      blocks: [
        { type: "form", items: [
          { h: x("Channels", "Kanalet", "Kanäle"), hint: x("which channel for what: urgent, routine, decisions", "cili kanal për çfarë: urgjente, rutinë, vendime", "welcher Kanal wofür: dringend, Routine, Entscheidungen") },
          { h: x("Response times", "Kohët e përgjigjes", "Antwortzeiten"), hint: x("how fast in each channel; how to say you are unavailable", "sa shpejt në çdo kanal; si thua që nuk je i lirë", "wie schnell je Kanal; wie man sagt, dass man nicht erreichbar ist") },
          { h: x("Check-ins", "Takimet e rregullta", "Abstimmungen"), hint: x("the team check-in and each weekly one-to-one: when", "takimi i ekipit dhe biseda javore me secilin: kur", "Teamrunde und wöchentliches Einzelgespräch: wann") },
          { h: x("Escalation", "Ngritja e problemit", "Eskalation"), hint: x("what counts as a problem, whom to tell, by when; who owns it until closed", "çfarë quhet problem, kujt i thuhet, deri kur; kush përgjigjet deri në mbyllje", "was als Problem gilt, wem man es sagt, bis wann; wer bis zum Abschluss zuständig ist") },
          { h: x("Written down", "Çfarë shkruhet", "Was notiert wird"), hint: x("decisions, handovers, open issues with an owner and a time", "vendimet, dorëzimet, çështjet e hapura me përgjegjës dhe afat", "Entscheidungen, Übergaben, offene Punkte mit Verantwortlichen und Frist") },
          { h: x("Together", "Bashkë", "Gemeinsam"), hint: x("which day in person, and what for; the next review date", "cila ditë bashkë, dhe për çfarë; data e rishikimit tjetër", "welcher Tag vor Ort, und wofür; nächster Überprüfungstermin") },
        ] },
      ],
      note: x(
        "A practice the editors propose, drawing on Gallup (the most common practices in teams with a plan: check-ins, availability, unavailability) and Gajendran & Harrison (a day together). Gallup compared teams with and without a plan, so this is an association, not a cause.",
        "Praktikë që e propozon redaksia, duke u mbështetur në Gallup-in (praktikat më të shpeshta në ekipet me plan: takimet, disponueshmëria, mosdisponueshmëria) dhe në Gajendran & Harrison (një ditë bashkë). Gallup-i krahasoi ekipe me dhe pa plan, ndaj kjo është lidhje, jo shkak.",
        "Eine von der Redaktion vorgeschlagene Praxis, gestützt auf Gallup (häufigste Praktiken in Teams mit Plan: Abstimmungen, Erreichbarkeit, Abwesenheit) und Gajendran & Harrison (ein gemeinsamer Tag). Gallup verglich Teams mit und ohne Plan; das zeigt einen Zusammenhang, keine Ursache."),
      source: ["remote-gallup-hybrid-2026", "remote-gajendran-2007"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
