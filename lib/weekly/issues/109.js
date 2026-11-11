// Management Review, No. 109: Aggression from customers and the public, at the desk, at the door and on the phone:
// how common it is and what protects staff. Block: People. Facts and their sources: docs/revista/management-review-nr-109.md.
// HSE's Violence at work statistics 2024/25 (2025) with its CSEW data tables, the DGUV's Statistik Arbeitsunfallgeschehen
// 2024 (2025; chapter 10 on violence, attacks and threats), the ILO Violence and Harassment Convention, 2019 (C190),
// EU-OSHA's first findings of ESENER 2024 (2025), Arnetz et al. (2017, PubMed Central) and the Cochrane review of
// Geoffrion et al. (2020, PubMed Central) were read in full. No security procedures are described.
// Incivility between colleagues is No. 79, mental health at work No. 75, the risk matrix No. 28: not repeated.
import { x, pc } from "../common.js";

// "6.8%" in English, "6,8%" in Albanian and "6,8 %" in German.
const pcd = (n) => x(`${n}%`, `${n.replace(".", ",")}%`, `${n.replace(".", ",")} %`);
const dec = (n) => x(n, n.replace(".", ","), n.replace(".", ","));

export default {
  number: 109,
  block: "people",
  date: x("November 2026", "Nëntor 2026", "November 2026"),
  theme: [x("When the customer", "Kur klienti", "Wenn der Kunde"), x("turns aggressive", "bëhet agresiv", "aggressiv wird")],
  sub: x(
    "Threats and attacks from customers and the public: who is most at risk in Britain, where it happens in Germany, what the ILO convention asks of employers, a trial in seven hospitals, what to record, and a card for one area.",
    "Kërcënimet dhe sulmet nga klientët dhe publiku: kush rrezikohet më shumë në Britani, ku ndodhin në Gjermani, çfarë u kërkon punëdhënësve konventa e ILO-s, një provë në shtatë spitale, çfarë regjistrohet, dhe një kartë për një zonë.",
    "Drohungen und Angriffe von Kunden und Publikum: wer in Großbritannien am stärksten gefährdet ist, wo es in Deutschland passiert, was das ILO-Übereinkommen von Arbeitgebern verlangt, eine Studie in sieben Kliniken, was zu erfassen ist, und eine Karte für einen Bereich."),
  seo: x(
    "Aggression from customers and the public at work: HSE and DGUV figures, ILO Convention 190, ESENER 2024, a hospital trial, what to record, and a card.",
    "Agresioni nga klientët dhe publiku në punë: shifrat e HSE-së dhe DGUV-së, Konventa 190 e ILO-s, ESENER 2024, një provë në spitale, regjistrimi dhe një kartë.",
    "Aggression von Kunden und Publikum: Zahlen von HSE und DGUV, ILO-Übereinkommen 190, ESENER 2024, eine Klinikstudie, was zu erfassen ist, und eine Karte."),
  feature: x(
    "Most violence at work does not come from colleagues. In Germany, 61% of the reportable accidents from violence, attacks and threats in 2024 came from people outside the company. Issue 109 shows which jobs carry the risk, what the ILO convention of 2019 asks of employers, what a trial in seven hospitals and a review of training found, what to record when it happens, and ends with a card for one area.",
    "Shumica e dhunës në punë nuk vjen nga kolegët. Në Gjermani, 61% e aksidenteve të raportueshme nga dhuna, sulmet dhe kërcënimet më 2024 erdhën nga persona jashtë kompanisë. Numri 109 tregon cilat punë e mbartin rrezikun, çfarë u kërkon punëdhënësve konventa e ILO-s e vitit 2019, çfarë gjetën një provë në shtatë spitale dhe një rishikim i trajnimeve, çfarë regjistrohet kur ndodh, dhe mbyllet me një kartë për një zonë.",
    "Die meiste Gewalt bei der Arbeit kommt nicht von Kollegen. In Deutschland gingen 2024 61 % der meldepflichtigen Unfälle durch Gewalt, Angriff und Bedrohung von betriebsfremden Personen aus. Ausgabe 109 zeigt, welche Tätigkeiten das Risiko tragen, was das ILO-Übereinkommen von 2019 von Arbeitgebern verlangt, was eine Studie in sieben Kliniken und eine Übersicht zu Schulungen fanden, was zu erfassen ist, und endet mit einer Karte für einen Bereich."),
  figure: { n: pcd("61.1"), by: "DGUV, 2025", t: x(
    "of the reportable accidents from violence, attacks and threats at work in Germany in 2024 came from people outside the company: 10,504 of 17,194.",
    "e aksidenteve të raportueshme nga dhuna, sulmet dhe kërcënimet në punë në Gjermani më 2024 erdhën nga persona jashtë kompanisë: 10.504 nga 17.194.",
    "der meldepflichtigen Unfälle durch Gewalt, Angriff und Bedrohung in Deutschland 2024 gingen von betriebsfremden Personen aus: 10.504 von 17.194.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("The jobs that face the public", "Punët që përballen me publikun", "Die Tätigkeiten mit Publikumskontakt") },
    { page: "research", kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: x("Data for the ward, not a course", "Të dhëna për repartin, jo një kurs", "Daten für die Station, kein Kurs") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The aggression card for one area", "Karta e agresionit për një zonë", "Die Aggressionskarte für einen Bereich") },
  ],
  sources: ["violence-hse-2025", "slips-dguv-2025", "violence-ilo-c190", "mon-esener-2024", "violence-arnetz-2017", "violence-geoffrion-2020"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "A receptionist is shouted at over a bill, a driver is threatened at a door, a call ends in abuse. It is often filed as part of the job. This issue treats it as a risk of work with numbers, duties and a record, like any other.",
        "Një recepsionisti i bërtasin për një faturë, një shofer kërcënohet te një derë, një telefonatë mbaron me fyerje. Shpesh shënohet si pjesë e punës. Ky numër e trajton si rrezik pune me shifra, detyra dhe regjistër, si çdo rrezik tjetër.",
        "Eine Rezeptionistin wird wegen einer Rechnung angeschrien, ein Fahrer an einer Tür bedroht, ein Anruf endet mit Beleidigungen. Oft gilt das als Teil des Jobs. Diese Ausgabe behandelt es als Arbeitsrisiko mit Zahlen, Pflichten und einer Erfassung, wie jedes andere."),
      body: x(
        "In England and Wales 1.2% of working adults suffered violence at work in a year, threats included; in protective services 6.8%. In Germany 61% of violent accidents came from outsiders. The ILO convention asks employers to assess the risk with their workers. A hospital trial worked with each ward's own data; training alone has little proof. A card for one area closes the issue.",
        "Në Angli dhe Uells 1,2% e të rriturve që punojnë pësuan dhunë në punë brenda një viti, me kërcënimet; në shërbimet mbrojtëse 6,8%. Në Gjermani 61% e aksidenteve nga dhuna erdhën nga persona të jashtëm. Konventa e ILO-s u kërkon punëdhënësve ta vlerësojnë rrezikun bashkë me punonjësit. Një provë në spitale punoi me të dhënat e vetë çdo reparti; për trajnimin vetëm ka pak prova. Një kartë për një zonë e mbyll numrin.",
        "In England und Wales erlebten 1,2 % der Erwerbstätigen in einem Jahr Gewalt bei der Arbeit, Drohungen eingeschlossen; in Schutzdiensten 6,8 %. In Deutschland gingen 61 % der Gewaltunfälle von Betriebsfremden aus. Das ILO-Übereinkommen verlangt, das Risiko mit den Beschäftigten zu beurteilen. Eine Klinikstudie arbeitete mit den Daten jeder Station; für Schulung allein gibt es wenig Belege. Eine Karte für einen Bereich schließt die Ausgabe."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("The jobs that", "Punët që", "Die Tätigkeiten"), x("face the public", "përballen me publikun", "mit Publikumskontakt")],
      lead: x(
        "The Crime Survey for England and Wales counts violence at work, threats included. For 2024/25 it estimates 689,000 incidents, 370,000 assaults and 319,000 threats, against 329,000 working adults. The average risk is 1.2% a year; for the jobs that meet the public it is higher.",
        "Anketa e krimit për Anglinë dhe Uellsin e numëron dhunën në punë bashkë me kërcënimet. Për 2024/25 vlerëson 689.000 raste, 370.000 sulme dhe 319.000 kërcënime, ndaj 329.000 të rriturve që punojnë. Rreziku mesatar është 1,2% në vit; për punët që takojnë publikun është më i lartë.",
        "Der Crime Survey for England and Wales zählt Gewalt bei der Arbeit einschließlich Drohungen. Für 2024/25 schätzt er 689.000 Vorfälle, 370.000 Angriffe und 319.000 Drohungen, gegen 329.000 Erwerbstätige. Das durchschnittliche Risiko liegt bei 1,2 % im Jahr; in Tätigkeiten mit Publikumskontakt ist es höher."),
      blocks: [
        { type: "hbars", max: 8, source: ["violence-hse-2025"],
          label: x("Working adults who suffered violence at work once or more in a year, England and Wales, 2023/24 and 2024/25", "Të rritur që punojnë dhe pësuan dhunë në punë një ose më shumë herë brenda një viti, Anglia dhe Uellsi, 2023/24 dhe 2024/25", "Erwerbstätige, die in einem Jahr ein- oder mehrmals Gewalt bei der Arbeit erlebten, England und Wales, 2023/24 und 2024/25"),
          items: [
            { k: x("Protective services", "Shërbimet mbrojtëse", "Schutzdienste"), v: 6.8, n: pcd("6.8") },
            { k: x("Health and social care associate professionals", "Profesionistë ndihmës në shëndetësi dhe kujdes social", "Assistenzberufe in Gesundheit und Sozialem"), v: 2.7, n: pcd("2.7") },
            { k: x("Transport drivers and operatives", "Shoferë dhe operatorë transporti", "Fahrer und Bediener im Verkehr"), v: 2.4, n: pcd("2.4") },
            { k: x("Sales occupations", "Punët e shitjes", "Verkaufsberufe"), v: 2.2, n: pcd("2.2"), alert: true },
            { k: x("All occupations", "Të gjitha punët", "Alle Berufe"), v: 1.2, n: pcd("1.2") },
          ] },
        { type: "p", text: x(
          "In 54% of incidents the offender was a stranger; where known, most often a client or member of the public met through work. 38% of assaults caused an injury. Victims saw alcohol in 40% of threats and 21% of assaults, and 23% of victims went through it three times or more.",
          "Në 54% të rasteve autori ishte i panjohur; kur njihej, më shpesh ishte një klient ose dikush nga publiku i njohur përmes punës. 38% e sulmeve shkaktuan lëndim. Viktimat panë alkool në 40% të kërcënimeve dhe 21% të sulmeve, dhe 23% e viktimave e përjetuan tri herë ose më shumë.",
          "Bei 54 % der Vorfälle war die Täterin oder der Täter fremd; wenn bekannt, meist Kundschaft oder Publikum aus der Arbeit. 38 % der Angriffe führten zu einer Verletzung. Opfer nahmen bei 40 % der Drohungen und 21 % der Angriffe Alkohol wahr, und 23 % der Opfer erlebten es dreimal oder öfter.") },
        { type: "callout", reading: true, text: x(
          "The same person at the same counter is hit again. Repeat cases point to a place and a task, not to bad luck.",
          "I njëjti person te i njëjti sportel goditet sërish. Rastet e përsëritura tregojnë një vend dhe një detyrë, jo fatin e keq.",
          "Dieselbe Person am selben Schalter trifft es wieder. Wiederholte Fälle zeigen auf einen Ort und eine Aufgabe, nicht auf Pech.") },
      ],
      note: x(
        "HSE, Violence at work statistics 2024/25, and its CSEW tables 4–8. Bars: share of working adults aged 16–64 in each occupation group, two survey years combined; the 95% intervals are wide (protective services 3.7–9.9%). Domestic violence is excluded. Incivility between colleagues is in No. 79.",
        "HSE, Violence at work statistics 2024/25, dhe tabelat 4–8 të CSEW. Shiritat: pjesa e të rriturve 16–64 vjeç që punojnë në çdo grup pune, dy vite ankete bashkë; intervalet 95% janë të gjera (shërbimet mbrojtëse 3,7–9,9%). Dhuna në familje përjashtohet. Mosrespekti mes kolegëve është te Nr. 79.",
        "HSE, Violence at work statistics 2024/25, und die CSEW-Tabellen 4–8. Balken: Anteil der Erwerbstätigen von 16 bis 64 Jahren je Berufsgruppe, zwei Erhebungsjahre zusammen; die 95-%-Intervalle sind breit (Schutzdienste 3,7–9,9 %). Häusliche Gewalt ist ausgeschlossen. Unhöflichkeit unter Kollegen steht in Nr. 79."),
      source: ["violence-hse-2025"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("Where it happens", "Ku ndodh", "Wo es passiert"), x("in Germany", "në Gjermani", "in Deutschland")],
      lead: x(
        "The German statutory accident insurance counts accidents from violence, attacks, threats and witnessing an extreme event, if they kept someone off work for more than three days or were fatal. In 2024 there were 17,194; 10,504 came from people outside the company, 1,647 from colleagues.",
        "Sigurimi ligjor gjerman i aksidenteve numëron aksidentet nga dhuna, sulmet, kërcënimet dhe dëshmimi i një ngjarjeje ekstreme, kur e mbajtën dikë jashtë punës më shumë se tri ditë ose ishin vdekjeprurëse. Më 2024 ishin 17.194; 10.504 erdhën nga persona jashtë kompanisë, 1.647 nga kolegët.",
        "Die Deutsche Gesetzliche Unfallversicherung zählt Unfälle durch Gewalt, Angriff, Bedrohung und Zeugenschaft eines Extremereignisses, wenn sie zu mehr als drei Tagen Arbeitsunfähigkeit oder zum Tod führten. 2024 waren es 17.194; 10.504 gingen von Betriebsfremden aus, 1.647 von Beschäftigten."),
      blocks: [
        { type: "figures", compact: true, items: [
          { n: pcd("61.1"), t: x("came from people outside the company", "erdhën nga persona jashtë kompanisë", "gingen von Betriebsfremden aus") },
          { n: pc(56), t: x("of the new accident pensions from these accidents had shock as the first diagnosis", "e pensioneve të reja nga këto aksidente kishin shokun si diagnozë të parë", "der neuen Unfallrenten aus diesen Unfällen hatten einen Schock als Erstdiagnose") },
        ] },
        { type: "hbars", max: 30, source: ["slips-dguv-2025"],
          label: x("Violence, attacks and threats as a share of all reportable accidents at work in the sector, Germany, 2024", "Dhuna, sulmet dhe kërcënimet si pjesë e të gjitha aksidenteve të raportueshme në punë në sektor, Gjermani, 2024", "Anteil von Gewalt, Angriff und Bedrohung an allen meldepflichtigen Arbeitsunfällen der Branche, Deutschland, 2024"),
          items: [
            { k: x("Security services", "Shërbimet e sigurisë", "Wach- und Sicherheitsdienste"), v: 24.6, n: pcd("24.6"), alert: true },
            { k: x("Care and residential homes", "Shtëpitë e kujdesit dhe banimit", "Heime"), v: 11.2, n: pcd("11.2") },
            { k: x("Land transport", "Transporti tokësor", "Landverkehr"), v: 6.6, n: pcd("6.6") },
            { k: x("Restaurants and catering", "Restorantet dhe gastronomia", "Gastronomie"), v: 2.5, n: pcd("2.5") },
            { k: x("All trade associations", "Të gjitha shoqatat profesionale", "Alle Berufsgenossenschaften"), v: 2.1, n: pcd("2.1") },
          ] },
        { type: "callout", reading: true, text: x(
          "A middling share can hide the largest count: land transport's 6.6% is 2,277 accidents, more than any other sector listed. The share says where violence dominates; the count says where it adds up.",
          "Një pjesë mesatare mund të fshehë numrin më të madh: 6,6% e transportit tokësor janë 2.277 aksidente, më shumë se në çdo sektor tjetër të listuar. Pjesa tregon ku mbizotëron dhuna; numri tregon ku mblidhet.",
          "Ein mittlerer Anteil kann die größte Zahl verbergen: Die 6,6 % im Landverkehr sind 2.277 Unfälle, mehr als in jeder anderen aufgeführten Branche. Der Anteil zeigt, wo Gewalt vorherrscht; die Zahl, wo sie sich summiert.") },
      ],
      note: x(
        "DGUV, Statistik Arbeitsunfallgeschehen 2024 (2025), tables 63 and 64: employees and entrepreneurs, without professional athletes; the sector shares are for the commercial trade associations and include witnessing. In the public sector the share is 7.0%, with railways at 30.9%. For just under 14% the report gave no detail of the violence.",
        "DGUV, Statistik Arbeitsunfallgeschehen 2024 (2025), tabelat 63 dhe 64: punonjës dhe sipërmarrës, pa sportistët profesionistë; pjesët sipas sektorit janë për shoqatat profesionale tregtare dhe përfshijnë dëshmimin. Në sektorin publik pjesa është 7,0%, me hekurudhat 30,9%. Për pak më pak se 14% raporti nuk dha hollësi për dhunën.",
        "DGUV, Statistik Arbeitsunfallgeschehen 2024 (2025), Tabellen 63 und 64: abhängig Beschäftigte und Unternehmer, ohne Berufssportler; die Branchenanteile gelten für die gewerblichen Berufsgenossenschaften und schließen Zeugenschaft ein. Bei der öffentlichen Hand liegt der Anteil bei 7,0 %, bei Bahnbetrieben bei 30,9 %. Bei knapp 14 % fehlten nähere Angaben."),
      source: ["slips-dguv-2025"],
    },
    {
      id: "model",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Four duties", "Katër detyra", "Vier Pflichten"), x("of the employer", "të punëdhënësit", "des Arbeitgebers")],
      lead: x(
        "The ILO Violence and Harassment Convention, adopted in June 2019, covers threats as well as acts, single or repeated. It reaches work-related calls and messages and the way to and from work, and asks states to take violence involving third parties into account. Article 9 sets out what employers are to do.",
        "Konventa e ILO-s për dhunën dhe ngacmimin, e miratuar në qershor 2019, mbulon kërcënimet si edhe veprimet, një herë ose të përsëritura. Shtrihet te telefonatat dhe mesazhet e punës dhe te rruga për në punë e kthimi, dhe u kërkon shteteve të marrin parasysh dhunën që përfshin palë të treta. Neni 9 thotë çfarë duhet të bëjnë punëdhënësit.",
        "Das ILO-Übereinkommen über Gewalt und Belästigung, angenommen im Juni 2019, erfasst Drohungen ebenso wie Taten, einmalig oder wiederholt. Es reicht bis zu dienstlichen Anrufen und Nachrichten und zum Arbeitsweg und verlangt von den Staaten, Gewalt unter Beteiligung Dritter einzubeziehen. Artikel 9 nennt, was Arbeitgeber tun sollen."),
      blocks: [
        { type: "steps", items: [
          { h: x("A policy, made with the workers", "Një politikë, e bërë me punonjësit", "Eine Richtlinie, mit den Beschäftigten"), p: x("on violence and harassment, adopted and applied", "për dhunën dhe ngacmimin, e miratuar dhe e zbatuar", "zu Gewalt und Belästigung, beschlossen und angewendet") },
          { h: x("Part of safety and health", "Pjesë e sigurisë dhe shëndetit", "Teil von Sicherheit und Gesundheit"), p: x("with the psychosocial risks that go with it", "bashkë me rreziqet psikosociale që vijnë me të", "mit den zugehörigen psychosozialen Risiken") },
          { h: x("Hazards found, risks assessed", "Rreziqet e gjetura, të vlerësuara", "Gefahren ermittelt, Risiken beurteilt"), p: x("with the workers taking part, and measures to control them", "me pjesëmarrjen e punonjësve, dhe masa për t'i kontrolluar", "unter Beteiligung der Beschäftigten, mit Maßnahmen dagegen") },
          { h: x("Information and training", "Informim dhe trajnim", "Information und Unterweisung"), p: x("on the risks found, the measures and everyone's rights", "për rreziqet e gjetura, masat dhe të drejtat e secilit", "zu den Risiken, den Maßnahmen und den Rechten aller") },
        ] },
        { type: "figures", compact: true, items: [
          { n: pc(56), t: x("of EU workplaces name difficult customers, patients or pupils as a risk (2024)", "e vendeve të punës në BE i quajnë rrezik klientët, pacientët ose nxënësit e vështirë (2024)", "der Betriebe in der EU nennen schwierige Kunden, Patienten oder Schüler als Risiko (2024)") },
          { n: pc(54), t: x("of those with 20 or more staff have a procedure for threats, abuse or assaults by outsiders", "e atyre me 20 ose më shumë punonjës kanë një procedurë për kërcënime, fyerje ose sulme nga të jashtmit", "der Betriebe ab 20 Beschäftigten darunter haben ein Verfahren für Drohungen, Beschimpfungen oder Übergriffe Externer") },
        ] },
        { type: "callout", reading: true, text: x(
          "The convention starts with an assessment made together with the people at the counter, not with a poster at the entrance.",
          "Konventa nis me një vlerësim të bërë bashkë me njerëzit në sportel, jo me një afishe te hyrja.",
          "Das Übereinkommen beginnt mit einer Beurteilung gemeinsam mit den Menschen am Schalter, nicht mit einem Plakat am Eingang.") },
      ],
      note: x(
        "C190, Articles 1, 3, 4 and 9, shortened by the editors. It binds the states that ratify it, which then oblige employers by law. ESENER 2024, first findings (EU-OSHA, 2025): one respondent per workplace; the procedure question was asked only where the risk was named; it was 51% in 2019, 72% in health and social work.",
        "C190, nenet 1, 3, 4 dhe 9, të shkurtuara nga redaksia. Detyron shtetet që e ratifikojnë, të cilat pastaj i detyrojnë punëdhënësit me ligj. ESENER 2024, gjetjet e para (EU-OSHA, 2025): një përgjigjës për çdo vend pune; pyetja për procedurën u bë vetëm aty ku u përmend rreziku; ishte 51% më 2019, 72% në shëndetësi dhe punën sociale.",
        "C190, Artikel 1, 3, 4 und 9, von der Redaktion gekürzt. Es bindet die Staaten, die es ratifizieren, und diese verpflichten die Arbeitgeber per Gesetz. ESENER 2024, erste Ergebnisse (EU-OSHA, 2025): eine befragte Person je Betrieb; die Frage nach dem Verfahren nur, wo das Risiko genannt wurde; 2019 waren es 51 %, im Gesundheits- und Sozialwesen 72 %."),
      source: ["violence-ilo-c190", "mon-esener-2024"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("Data for the ward,", "Të dhëna për repartin,", "Daten für die Station,"), x("not a course", "jo një kurs", "kein Kurs")],
      lead: x(
        "Judith Arnetz and colleagues randomised high-risk units in seven US hospitals; 41 were analysed. On 21 of them, the supervisor got three years of the unit's own violence data in a visit of at most 45 minutes and drew up an action plan with the staff; the other 20 carried on as usual. The outcome was violence from patients and visitors.",
        "Judith Arnetz dhe kolegët ndanë rastësisht njësi me rrezik të lartë në shtatë spitale amerikane; u analizuan 41. Në 21 prej tyre, përgjegjësi mori në një vizitë deri në 45 minuta të dhënat e tri viteve për dhunën në njësinë e vet dhe hartoi një plan veprimi me stafin; 20 të tjerat vazhduan si zakonisht. Rezultati i matur ishte dhuna nga pacientët dhe vizitorët.",
        "Judith Arnetz und Kollegen randomisierten Stationen mit hohem Risiko in sieben US-Kliniken; 41 wurden ausgewertet. Auf 21 davon bekam die Leitung in einem Besuch von höchstens 45 Minuten drei Jahre Gewaltdaten der eigenen Station und erstellte mit dem Team einen Maßnahmenplan; die anderen 20 arbeiteten wie bisher. Gemessen wurde Gewalt durch Patienten und Besucher."),
      blocks: [
        { type: "pairs", from: x("Before (3 years)", "Para (3 vjet)", "Vorher (3 Jahre)"), to: x("6 months after", "6 muaj pas", "6 Monate danach"), max: 16, source: ["violence-arnetz-2017"],
          label: x("Violent events per 100 full-time staff a year, 41 hospital units (2017)", "Raste dhune për 100 punonjës me kohë të plotë në vit, 41 njësi spitalore (2017)", "Gewaltereignisse je 100 Vollzeitkräfte im Jahr, 41 Klinikstationen (2017)"),
          rows: [
            { k: x("Own data and a plan", "Të dhënat e veta dhe një plan", "Eigene Daten und ein Plan"), a: 8.05, an: dec("8.05"), b: 6.71, bn: dec("6.71"), alert: true },
            { k: x("Usual practice", "Praktika e zakonshme", "Übliche Praxis"), a: 8.32, an: dec("8.32"), b: 14.36, bn: dec("14.36") },
          ] },
        { type: "p", text: x(
          "The gap held at six months, then closed: after two years both groups were higher. Injuries were lower with the plan at 24 months, 2.81 against 8.09. A Cochrane review of nine studies with 1,688 health workers found that training may raise knowledge but may not reduce aggression; the evidence is weak.",
          "Dallimi qëndroi në gjashtë muaj, pastaj u mbyll: pas dy vitesh të dy grupet ishin më lart. Lëndimet ishin më pak me planin në muajin e 24-t, 2,81 kundrejt 8,09. Një rishikim Cochrane i nëntë studimeve me 1.688 punonjës shëndetësie gjeti se trajnimi mund ta rrisë njohurinë, por mund të mos e ulë agresionin; provat janë të dobëta.",
          "Der Abstand hielt sechs Monate, dann schloss er sich: Nach zwei Jahren lagen beide Gruppen höher. Verletzungen waren mit Plan nach 24 Monaten seltener, 2,81 gegenüber 8,09. Ein Cochrane-Review von neun Studien mit 1.688 Beschäftigten im Gesundheitswesen fand, dass Schulung Wissen erhöhen, Aggression aber wohl nicht senken kann; die Belege sind schwach.") },
        { type: "callout", reading: true, text: x(
          "A course once a year is the easiest measure to buy and the hardest to prove. A unit's own numbers, read with its staff and read again, did more.",
          "Një kurs një herë në vit është masa më e lehtë për t'u blerë dhe më e vështira për t'u provuar. Shifrat e vetë njësisë, të lexuara me stafin dhe të rilexuara, bënë më shumë.",
          "Ein Kurs im Jahr ist die am leichtesten gekaufte und am schwersten belegte Maßnahme. Die eigenen Zahlen einer Station, mit dem Team gelesen und wieder gelesen, bewirkten mehr.") },
      ],
      note: x(
        "Arnetz et al. (2017), one Midwest hospital system; rates from reported events and paid hours. The six-month effect came from the control units rising; the authors suggest a booster. Geoffrion et al. (2020): very low to low certainty, long-term RR 1.14. Both are from health care; the editors' reading is that the method carries over.",
        "Arnetz et al. (2017), një sistem spitalor në Midwest; normat nga rastet e raportuara dhe orët e paguara. Efekti në gjashtë muaj erdhi nga rritja te njësitë e kontrollit; autorët sugjerojnë një përforcim. Geoffrion et al. (2020): siguri shumë e ulët deri e ulët, afatgjatë RR 1,14. Të dyja vijnë nga shëndetësia; lexim i redaksisë është se metoda vlen edhe gjetiu.",
        "Arnetz et al. (2017), ein Kliniksystem im Mittleren Westen; Raten aus gemeldeten Ereignissen und bezahlten Stunden. Der Effekt nach sechs Monaten kam vom Anstieg der Kontrollstationen; die Autoren schlagen eine Auffrischung vor. Geoffrion et al. (2020): sehr geringe bis geringe Vertrauenswürdigkeit, langfristig RR 1,14. Beide aus dem Gesundheitswesen; dass die Methode übertragbar ist, ist die Lesart der Redaktion."),
      source: ["violence-arnetz-2017", "violence-geoffrion-2020"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie es gemessen wird"),
      title: [x("Count the threats,", "Numëro kërcënimet,", "Drohungen zählen,"), x("not only the injuries", "jo vetëm lëndimet", "nicht nur Verletzungen")],
      lead: x(
        "Injury reports miss most of it. Britain's RIDDOR counts only physical violence; verbal abuse is excluded even if it leads to time off. In the hospitals of the trial, comparing staff surveys with the reporting system showed that 88% of violent events went unreported.",
        "Raportet e lëndimeve e humbasin pjesën më të madhe. RIDDOR në Britani numëron vetëm dhunën fizike; fyerja verbale përjashtohet edhe kur sjell mungesë nga puna. Në spitalet e provës, krahasimi i anketave të stafit me sistemin e raportimit tregoi se 88% e rasteve të dhunës nuk u raportuan.",
        "Unfallmeldungen erfassen das meiste nicht. Das britische RIDDOR zählt nur körperliche Gewalt; verbale Angriffe sind ausgeschlossen, auch wenn sie zu Ausfallzeit führen. In den Kliniken der Studie zeigte der Abgleich von Befragungen mit dem Meldesystem, dass 88 % der Gewaltereignisse nicht gemeldet wurden."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("What happened", "Çfarë ndodhi", "Was geschah"), p: x("abuse, threat, physical attack; on site, at a door, by phone or message", "fyerje, kërcënim, sulm fizik; në vend, te një derë, me telefon ose mesazh", "Beschimpfung, Drohung, körperlicher Angriff; vor Ort, an einer Tür, per Telefon oder Nachricht") },
          { h: x("Where and doing what", "Ku dhe duke bërë çfarë", "Wo und bei welcher Tätigkeit"), p: x("area, task, the moment: a refusal, a bill, a wait, bad news", "zona, detyra, momenti: një refuzim, një faturë, një pritje, një lajm i keq", "Bereich, Aufgabe, Anlass: eine Absage, eine Rechnung, eine Wartezeit, eine schlechte Nachricht") },
          { h: x("Who", "Kush", "Wer"), p: x("stranger, known customer, the same person again", "i panjohur, klient i njohur, i njëjti person sërish", "fremd, bekannte Kundschaft, dieselbe Person erneut") },
          { h: x("What it did", "Çfarë shkaktoi", "Was es auslöste"), p: x("injury, shock, time off, a colleague who witnessed it", "lëndim, shok, mungesë, një koleg që e pa", "Verletzung, Schock, Ausfall, ein Kollege als Zeuge") },
          { h: x("Rate, not count", "Norma, jo numri", "Rate statt Zahl"), p: x("events per 100 full-time staff, by area, every quarter", "raste për 100 punonjës me kohë të plotë, sipas zonës, çdo tremujor", "Ereignisse je 100 Vollzeitkräfte, je Bereich, jedes Quartal") },
        ] },
        { type: "callout", reading: true, text: x(
          "If abuse is not written down, it is accepted. The first measure is that staff know a threat counts.",
          "Nëse fyerja nuk shkruhet, pranohet. Masa e parë është që stafi ta dijë se një kërcënim numërohet.",
          "Was nicht aufgeschrieben wird, wird hingenommen. Die erste Maßnahme ist, dass alle wissen: Eine Drohung zählt.") },
      ],
      note: x(
        "The fields are the editors' selection, built on what the trial's unit reports showed (type of incident, job, location, rates per 100 full-time staff from paid hours) and on C190's coverage of calls and messages. The 88% is an earlier study in the same hospital system, as Arnetz et al. report it.",
        "Fushat janë përzgjedhje e redaksisë, të ndërtuara mbi atë që tregonin raportet e njësive në provë (lloji i rastit, puna, vendi, normat për 100 punonjës me kohë të plotë nga orët e paguara) dhe mbi shtrirjen e C190 te telefonatat dhe mesazhet. 88% vjen nga një studim i mëparshëm në të njëjtin sistem spitalor, siç e raportojnë Arnetz et al.",
        "Die Felder sind eine Auswahl der Redaktion, gestützt auf die Stationsberichte der Studie (Art des Vorfalls, Tätigkeit, Ort, Raten je 100 Vollzeitkräfte aus bezahlten Stunden) und darauf, dass C190 Anrufe und Nachrichten einschließt. Die 88 % stammen aus einer früheren Studie im selben Kliniksystem, wie Arnetz et al. berichten."),
      source: ["violence-hse-2025", "violence-arnetz-2017", "violence-ilo-c190"],
    },
    {
      id: "tool", tool: "/tools/risk-assessment/", more: "the-angry-guest-at-2am",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The aggression card", "Karta e agresionit", "Die Aggressionskarte"), x("for one area", "për një zonë", "für einen Bereich")],
      lead: x(
        "One card per area that meets the public, filled in with the people who work there and read again after every incident. The Risk Assessment tool keeps the result for each work area, with measures, owners and the date of the next review.",
        "Një kartë për çdo zonë që takon publikun, e plotësuar me njerëzit që punojnë aty dhe e rilexuar pas çdo rasti. Mjeti Risk Assessment e ruan rezultatin për çdo zonë pune, me masat, përgjegjësit dhe datën e rishikimit të radhës.",
        "Eine Karte pro Bereich mit Publikumskontakt, ausgefüllt mit den Menschen, die dort arbeiten, und nach jedem Vorfall wieder gelesen. Das Werkzeug Risk Assessment hält das Ergebnis je Arbeitsbereich fest, mit Maßnahmen, Verantwortlichen und dem Datum der nächsten Überprüfung."),
      blocks: [
        { type: "form", items: [
          { h: x("Area and contact", "Zona dhe kontakti", "Bereich und Kontakt"), hint: x("desk, door, phone; who works there and when", "sportel, derë, telefon; kush punon aty dhe kur", "Schalter, Tür, Telefon; wer dort arbeitet und wann") },
          { h: x("What staff have met", "Çfarë ka hasur stafi", "Was das Team erlebt hat"), hint: x("asked in person; abuse and threats count", "pyetur drejtpërdrejt; fyerjet dhe kërcënimet numërohen", "persönlich gefragt; Beschimpfungen und Drohungen zählen") },
          { h: x("The moments that trigger it", "Momentet që e ndezin", "Die Auslöser"), hint: x("refusals, bills, waits, bad news, alcohol", "refuzime, fatura, pritje, lajme të këqija, alkool", "Absagen, Rechnungen, Wartezeiten, schlechte Nachrichten, Alkohol") },
          { h: x("What already protects", "Çfarë mbron tashmë", "Was schon schützt"), hint: x("who can be called, what staff may decide, what they are told", "kë mund të thërrasin, çfarë mund të vendosin, çfarë u thuhet", "wen man rufen kann, was man entscheiden darf, was man erfährt") },
          { h: x("Agreed measures", "Masat e rëna dakord", "Vereinbarte Maßnahmen"), hint: x("what, who, by when; agreed with the staff of the area", "çfarë, kush, deri kur; të rëna dakord me stafin e zonës", "was, wer, bis wann; mit dem Team des Bereichs vereinbart") },
          { h: x("After an incident", "Pas një rasti", "Nach einem Vorfall"), hint: x("talk it through the same day, time off if needed, the card read again", "bisedë po atë ditë, pushim nëse duhet, karta rilexohet", "am selben Tag besprechen, bei Bedarf Freistellung, Karte neu lesen") },
        ] },
      ],
      note: x(
        "The card is the editors' proposal, built on Article 9 of C190 and the action plans of Arnetz et al. (2017); it is not tested as a whole. The risk matrix is in No. 28. The essay linked below is about an angry complaint at night, not violence: listening first and saying what can be done at that hour.",
        "Karta është propozim i redaksisë, i ndërtuar mbi nenin 9 të C190 dhe planet e veprimit të Arnetz et al. (2017); nuk është provuar si e tërë. Matrica e rrezikut është te Nr. 28. Eseja e lidhur më poshtë flet për një ankesë të zemëruar natën, jo për dhunë: të dëgjosh më parë dhe të thuash çfarë mund të bëhet në atë orë.",
        "Die Karte ist ein Vorschlag der Redaktion, gestützt auf Artikel 9 von C190 und die Maßnahmenpläne bei Arnetz et al. (2017); als Ganzes ist sie nicht geprüft. Die Risikomatrix steht in Nr. 28. Der unten verlinkte Essay handelt von einer wütenden Beschwerde in der Nacht, nicht von Gewalt: erst zuhören, dann sagen, was zu dieser Stunde möglich ist."),
      source: ["violence-ilo-c190", "violence-arnetz-2017"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
