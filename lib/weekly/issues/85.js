// Management Review, No. 85: Checklists, one list and two results. Block: Operations.
// Facts and their sources: docs/revista/management-review-nr-85.md. Haynes et al. (2009) was read in full at Harvard
// DASH, Urbach et al. (2014) in full in the published PDF, the SURPASS study (de Vries et al., 2010) in full in the
// authors' version in de Vries's thesis (University of Amsterdam), so it carries "via". Degani & Wiener (NASA, 1990)
// and the WHO implementation manual (2009) were read in full. Poka-yoke is No. 46, standard work No. 35.
import { x, pc } from "../common.js";

export default {
  number: 85,
  block: "operations",
  date: x("November 2026", "Nëntor 2026", "November 2026"),
  theme: [x("Checklists:", "Listat e kontrollit:", "Checklisten:"), x("one list, two results", "një listë, dy rezultate", "eine Liste, zwei Ergebnisse")],
  sub: x(
    "Nineteen items that came with fewer complications in eight hospitals, the same idea with no measurable effect in 101 others, six hospitals with one list and six results, how a list is built for use, and a card to review one.",
    "Nëntëmbëdhjetë pika që erdhën me më pak ndërlikime në tetë spitale, e njëjta ide pa efekt të matshëm në 101 të tjera, gjashtë spitale me një listë dhe gjashtë rezultate, si ndërtohet një listë për t'u përdorur, dhe një kartë për ta rishikuar.",
    "Neunzehn Punkte, mit denen in acht Kliniken die Komplikationen sanken, dieselbe Idee ohne messbare Wirkung in 101 anderen, sechs Kliniken mit einer Liste und sechs Ergebnissen, wie man eine Liste für den Gebrauch baut, und eine Karte zur Prüfung."),
  seo: x(
    "Surgical safety checklists in eight hospitals, in Ontario and in the Netherlands: why one list gives different results, how to build it, and a review card.",
    "Listat e sigurisë kirurgjikale në tetë spitale, në Ontario dhe në Holandë: pse një listë jep rezultate të ndryshme, si ndërtohet, dhe një kartë rishikimi.",
    "OP-Checklisten in acht Kliniken, in Ontario und in den Niederlanden: warum eine Liste verschieden wirkt, wie man sie baut, und eine Prüfkarte."),
  feature: x(
    "In 2009 a 19-item checklist of the World Health Organization was followed by fewer complications and deaths in eight hospitals around the world. Five years later, 101 hospitals in Ontario showed no significant change after adopting checklists. Issue 85 sets the studies side by side, follows one Dutch list through six hospitals with six different results, and takes the design rules of NASA's checklist research and the WHO manual. A card to review a list closes the issue.",
    "Më 2009, pas një liste kontrolli me 19 pika të Organizatës Botërore të Shëndetësisë, ndërlikimet dhe vdekjet ranë në tetë spitale anembanë botës. Pesë vjet më vonë, 101 spitale në Ontario nuk treguan ndryshim të rëndësishëm pasi i futën listat. Numri 85 i vë studimet krah për krah, ndjek një listë holandeze nëpër gjashtë spitale me gjashtë rezultate të ndryshme, dhe merr rregullat e ndërtimit nga kërkimi i NASA-s për listat dhe nga manuali i OBSH-së. Një kartë për të rishikuar një listë e mbyll numrin.",
    "2009 sanken nach einer Checkliste der Weltgesundheitsorganisation mit 19 Punkten in acht Kliniken weltweit Komplikationen und Todesfälle. Fünf Jahre später zeigten 101 Kliniken in Ontario nach Einführung von Checklisten keine signifikante Veränderung. Ausgabe 85 stellt die Studien nebeneinander, verfolgt eine niederländische Liste durch sechs Kliniken mit sechs verschiedenen Ergebnissen und übernimmt die Gestaltungsregeln aus der Checklisten-Forschung der NASA und dem Handbuch der WHO. Eine Karte zur Prüfung einer Liste beschließt die Ausgabe."),
  figure: { n: pc(36), by: "Haynes et al., 2009", t: x(
    "average fall in complications in eight hospitals after the WHO checklist; in 101 hospitals in Ontario, no significant change (2014).",
    "rënia mesatare e ndërlikimeve në tetë spitale pas listës së OBSH-së; në 101 spitale në Ontario, asnjë ndryshim i rëndësishëm (2014).",
    "durchschnittlicher Rückgang der Komplikationen in acht Kliniken nach der WHO-Checkliste; in 101 Kliniken in Ontario keine signifikante Änderung (2014).") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("Nineteen items, three pauses", "Nëntëmbëdhjetë pika, tri ndalesa", "Neunzehn Punkte, drei Pausen") },
    { page: "numbers", kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: x("One list, other results", "Një listë, rezultate të tjera", "Eine Liste, andere Ergebnisse") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The checklist review card", "Karta e rishikimit të listës", "Die Checklisten-Prüfkarte") },
  ],
  sources: ["check-haynes-2009", "check-urbach-2014", "check-devries-2010", "check-degani-wiener-1990", "check-who-2009"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Checklists are cheap, short and easy to copy, so they spread fast. The same list has come with fewer deaths in one study and with no measurable change in another. This issue asks what made the difference, and what a manager can check before adding one more list to a shift.",
        "Listat e kontrollit janë të lira, të shkurtra dhe kopjohen lehtë, prandaj përhapen shpejt. E njëjta listë ka ardhur me më pak vdekje në një studim dhe pa asnjë ndryshim të matshëm në një tjetër. Ky numër pyet çfarë e bëri dallimin, dhe çfarë mund të kontrollojë një menaxher para se t'i shtojë turnit edhe një listë.",
        "Checklisten sind billig, kurz und leicht zu kopieren, deshalb verbreiten sie sich schnell. Dieselbe Liste ging in einer Studie mit weniger Todesfällen einher, in einer anderen mit keiner messbaren Veränderung. Diese Ausgabe fragt, was den Unterschied machte und was eine Führungskraft prüfen kann, bevor sie einer Schicht noch eine Liste gibt."),
      body: x(
        "In 2009 a 19-item WHO checklist was followed by fewer complications and deaths in eight hospitals. In Ontario, 101 hospitals adopted checklists under public reporting, and neither deaths nor complications changed significantly. In six Dutch hospitals one list gave six different results, and patients whose list was filled in more fully had fewer complications. NASA's research on cockpit checklists and the WHO manual show what makes a list usable, and a card helps review one.",
        "Më 2009, pas një liste me 19 pika të OBSH-së, ndërlikimet dhe vdekjet ranë në tetë spitale. Në Ontario, 101 spitale i futën listat nën raportim publik, dhe as vdekjet as ndërlikimet nuk ndryshuan ndjeshëm. Në gjashtë spitale holandeze një listë dha gjashtë rezultate të ndryshme, dhe pacientët, lista e të cilëve ishte plotësuar më shumë, patën më pak ndërlikime. Kërkimi i NASA-s për listat në kabinë dhe manuali i OBSH-së tregojnë çfarë e bën një listë të përdorshme, dhe një kartë ndihmon për ta rishikuar.",
        "2009 sanken nach einer WHO-Checkliste mit 19 Punkten in acht Kliniken Komplikationen und Todesfälle. In Ontario führten 101 Kliniken unter öffentlicher Berichtspflicht Checklisten ein, und weder Todesfälle noch Komplikationen änderten sich signifikant. In sechs niederländischen Kliniken brachte eine Liste sechs verschiedene Ergebnisse, und Patienten, deren Liste vollständiger ausgefüllt war, hatten weniger Komplikationen. Die NASA-Forschung zu Cockpit-Checklisten und das WHO-Handbuch zeigen, was eine Liste brauchbar macht, und eine Karte hilft bei der Prüfung."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("Nineteen items,", "Nëntëmbëdhjetë pika,", "Neunzehn Punkte,"), x("three pauses", "tri ndalesa", "drei Pausen")],
      lead: x(
        "Between October 2007 and September 2008, eight hospitals in Toronto, New Delhi, Amman, Auckland, Manila, Ifakara, London and Seattle introduced the WHO Surgical Safety Checklist: 19 items, confirmed aloud by the team at three moments of an operation.",
        "Nga tetori 2007 deri në shtator 2008, tetë spitale në Toronto, Nju Delhi, Aman, Okland, Manila, Ifakara, Londër dhe Siatëll futën listën e sigurisë kirurgjikale të OBSH-së: 19 pika, të konfirmuara me zë nga ekipi në tri momente të një operacioni.",
        "Zwischen Oktober 2007 und September 2008 führten acht Kliniken in Toronto, Neu-Delhi, Amman, Auckland, Manila, Ifakara, London und Seattle die WHO-Checkliste für sichere Chirurgie ein: 19 Punkte, vom Team an drei Momenten einer Operation laut bestätigt."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("Sign in", "Hyrja", "Sign in"), p: x("Before anaesthesia: identity, site, consent, pulse oximeter, allergy, airway, risk of blood loss.", "Para anestezisë: identiteti, vendi, pëlqimi, pulsoksimetri, alergjia, rrugët e frymëmarrjes, rreziku i humbjes së gjakut.", "Vor der Narkose: Identität, Eingriffsort, Einwilligung, Pulsoximeter, Allergie, Atemweg, Blutungsrisiko.") },
          { h: x("Time out", "Ndalesa", "Time out"), p: x("Before the incision: everyone named, patient and site confirmed, critical steps reviewed, antibiotics given.", "Para prerjes: secili me emër dhe rol, pacienti dhe vendi të konfirmuar, hapat kritikë të rishikuar, antibiotikët të dhënë.", "Vor dem Schnitt: alle mit Namen genannt, Patient und Ort bestätigt, kritische Schritte besprochen, Antibiotika gegeben.") },
          { h: x("Sign out", "Dalja", "Sign out"), p: x("Before the patient leaves: the procedure, the counts, the specimen labels, equipment problems, concerns for recovery.", "Para se pacienti të dalë: procedura, numërimet, etiketat e mostrave, problemet me pajisjet, shqetësimet për rimëkëmbjen.", "Bevor der Patient den Saal verlässt: Eingriff, Zählkontrollen, Probenetiketten, Geräteprobleme, Sorgen für die Erholung.") },
        ] },
        { type: "figures", compact: true, items: [
          { n: x("11.0 → 7.0%", "11,0 → 7,0%", "11,0 → 7,0 %"), t: x("of patients had a complication, before and after", "e pacientëve patën një ndërlikim, para dhe pas", "der Patienten hatten eine Komplikation, vorher und nachher") },
          { n: x("1.5 → 0.8%", "1,5 → 0,8%", "1,5 → 0,8 %"), t: x("died in hospital, before and after", "vdiqën në spital, para dhe pas", "starben im Krankenhaus, vorher und nachher") },
        ] },
        { type: "p", text: x(
          "The authors do not claim to know exactly why. All six safety steps they measured were done for 34.2% of patients before and 56.7% after; antibiotics on time rose from 56% to 83%. Teams also had to pause, introduce themselves and brief one another. Being observed may have played a part; the study could not fully separate it.",
          "Autorët nuk pretendojnë se e dinë saktësisht pse. Të gjashtë hapat e sigurisë që matën u bënë për 34,2% të pacientëve para dhe për 56,7% pas; antibiotikët në kohë u rritën nga 56% në 83%. Ekipet duhej edhe të ndalnin, të prezantoheshin dhe ta njihnin njëri-tjetrin me planin. Edhe fakti që ishin nën vëzhgim mund të ketë luajtur rol; studimi nuk e ndau dot plotësisht.",
          "Die Autoren behaupten nicht, genau zu wissen, warum. Alle sechs gemessenen Sicherheitsschritte erfolgten vorher bei 34,2 % der Patienten, nachher bei 56,7 %; rechtzeitige Antibiotika stiegen von 56 auf 83 %. Die Teams mussten zudem innehalten, sich vorstellen und einander briefen. Auch das Beobachtetwerden kann mitgewirkt haben; die Studie konnte es nicht ganz trennen.") },
        { type: "callout", reading: true, text: x(
          "The list brought no new medicine. It made the team say aloud, every time, steps most of them already knew and often skipped.",
          "Lista nuk solli mjekësi të re. E bëri ekipin të thoshte me zë, çdo herë, hapa që shumica i dinin dhe shpesh i anashkalonin.",
          "Die Liste brachte keine neue Medizin. Sie ließ das Team jedes Mal laut aussprechen, was die meisten schon wussten und oft übergingen.") },
      ],
      note: x(
        "Before-and-after study without a control group; 3,733 and 3,955 patients, complications counted in hospital up to 30 days. The three pauses are shortened from the study's Table 1.",
        "Studim para dhe pas, pa grup kontrolli; 3.733 dhe 3.955 pacientë, ndërlikimet të numëruara në spital deri në 30 ditë. Tri ndalesat janë shkurtuar nga tabela 1 e studimit.",
        "Vorher-nachher-Studie ohne Kontrollgruppe; 3.733 und 3.955 Patienten, Komplikationen im Krankenhaus bis 30 Tage gezählt. Die drei Pausen sind aus Tabelle 1 der Studie gekürzt."),
      source: ["check-haynes-2009"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("One list,", "Një listë,", "Eine Liste,"), x("other results", "rezultate të tjera", "andere Ergebnisse")],
      lead: x(
        "From July 2010, Ontario's Ministry of Health required hospitals to report publicly how often they used a surgical checklist. David Urbach and colleagues compared 109,341 operations in three months before each hospital's checklist with 106,370 in three months after, in 101 hospitals.",
        "Nga korriku 2010, Ministria e Shëndetësisë e Ontarios u kërkoi spitaleve të raportonin publikisht sa shpesh e përdornin listën kirurgjikale. David Urbach dhe kolegët krahasuan 109.341 operacione në tre muaj para listës së secilit spital me 106.370 në tre muaj pas saj, në 101 spitale.",
        "Ab Juli 2010 verlangte das Gesundheitsministerium von Ontario, dass Kliniken öffentlich melden, wie oft sie eine OP-Checkliste nutzen. David Urbach und Kollegen verglichen in 101 Kliniken 109.341 Operationen in drei Monaten vor der Checkliste mit 106.370 in drei Monaten danach."),
      blocks: [
        { type: "dumbbell", from: x("Before", "Para", "Vorher"), to: x("After", "Pas", "Nachher"), min: 0, max: 2, rowH: 26, source: ["check-haynes-2009", "check-devries-2010", "check-urbach-2014"],
          label: x("Deaths after surgery before and after a checklist, three studies", "Vdekjet pas operacionit para dhe pas një liste, tri studime", "Todesfälle nach Operationen vor und nach einer Checkliste, drei Studien"),
          rows: [
            { k: x("WHO 2009", "OBSH 2009", "WHO 2009"), a: 1.5, an: x("1.5%", "1,5%", "1,5 %"), b: 0.8, bn: x("0.8%", "0,8%", "0,8 %") },
            { k: x("SURPASS 2010", "SURPASS 2010", "SURPASS 2010"), a: 1.5, an: x("1.5%", "1,5%", "1,5 %"), b: 0.8, bn: x("0.8%", "0,8%", "0,8 %") },
            { k: x("Ontario 2014", "Ontario 2014", "Ontario 2014"), a: 0.71, an: x("0.71%", "0,71%", "0,71 %"), b: 0.65, bn: x("0.65%", "0,65%", "0,65 %"), alert: true },
          ] },
        { type: "p", text: x(
          "Ontario's hospitals reported compliance of 98% or more after June 2010. No formal team training was required, and implementation was not standardised. Adjusted complications went from 3.86% to 3.82%; like the change in deaths, not significant. Six hospitals had significantly fewer complications, three significantly more.",
          "Spitalet e Ontarios raportuan zbatim prej 98% e më shumë pas qershorit 2010. Nuk u kërkua trajnim formal i ekipeve, dhe futja e listës nuk u standardizua. Ndërlikimet e rregulluara shkuan nga 3,86% në 3,82%; ashtu si ndryshimi te vdekjet, jo i rëndësishëm. Gjashtë spitale patën ndjeshëm më pak ndërlikime, tre ndjeshëm më shumë.",
          "Die Kliniken in Ontario meldeten nach Juni 2010 eine Einhaltung von 98 % oder mehr. Ein formales Teamtraining war nicht verlangt, die Einführung nicht standardisiert. Die bereinigten Komplikationen gingen von 3,86 auf 3,82 % zurück; wie bei den Todesfällen nicht signifikant. Sechs Kliniken hatten signifikant weniger Komplikationen, drei signifikant mehr.") },
        { type: "callout", reading: true, text: x(
          "A compliance rate of 98% counts ticks. It says nothing about whether anyone stopped to check.",
          "Një nivel zbatimi prej 98% numëron shenjat në kuti. Nuk thotë asgjë nëse dikush ndaloi për të kontrolluar.",
          "Eine Einhaltung von 98 % zählt Häkchen. Sie sagt nichts darüber, ob jemand innehielt, um zu prüfen.") },
      ],
      note: x(
        "Deaths in hospital up to 30 days (WHO), in hospital (SURPASS), in hospital or within 30 days, adjusted (Ontario): compare direction, not level. Ontario used administrative data, the other two staff on site. SURPASS covered the whole hospital stay.",
        "Vdekjet në spital deri në 30 ditë (OBSH), në spital (SURPASS), në spital ose brenda 30 ditëve, të rregulluara (Ontario): krahasohet drejtimi, jo niveli. Ontario përdori të dhëna administrative, dy të tjerët personel në vend. SURPASS mbuloi gjithë qëndrimin në spital.",
        "Todesfälle im Krankenhaus bis 30 Tage (WHO), im Krankenhaus (SURPASS), im Krankenhaus oder binnen 30 Tagen, bereinigt (Ontario): Verglichen wird die Richtung, nicht die Höhe. Ontario nutzte Verwaltungsdaten, die beiden anderen Personal vor Ort. SURPASS umfasste den ganzen Klinikaufenthalt."),
      source: ["check-haynes-2009", "check-devries-2010", "check-urbach-2014"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("Six hospitals,", "Gjashtë spitale,", "Sechs Kliniken,"), x("six results", "gjashtë rezultate", "sechs Ergebnisse")],
      lead: x(
        "The Dutch SURPASS checklist follows the surgical patient from admission to discharge, not only in the operating room. Six hospitals with high standards of care introduced it over nine months; five similar hospitals did not, and served as controls.",
        "Lista holandeze SURPASS e ndjek pacientin kirurgjikal nga pranimi deri në daljen nga spitali, jo vetëm në sallën e operacionit. Gjashtë spitale me standarde të larta kujdesi e futën gjatë nëntë muajve; pesë spitale të ngjashme nuk e futën, dhe shërbyen si grup kontrolli.",
        "Die niederländische SURPASS-Checkliste begleitet den chirurgischen Patienten von der Aufnahme bis zur Entlassung, nicht nur im OP-Saal. Sechs Kliniken mit hohem Versorgungsstandard führten sie über neun Monate ein; fünf ähnliche Kliniken nicht, sie dienten als Kontrolle."),
      blocks: [
        { type: "dumbbell", from: x("Before", "Para", "Vorher"), to: x("After", "Pas", "Nachher"), min: 0, max: 50, rowH: 21, source: ["check-devries-2010"],
          label: x("Complications per 100 patients in the six SURPASS hospitals", "Ndërlikime për 100 pacientë në gjashtë spitalet SURPASS", "Komplikationen je 100 Patienten in den sechs SURPASS-Kliniken"),
          rows: [
            { k: x("Hospital 1", "Spitali 1", "Klinik 1"), a: 22.5, an: x("22.5", "22,5", "22,5"), b: 5.3, bn: x("5.3", "5,3", "5,3") },
            { k: x("Hospital 2", "Spitali 2", "Klinik 2"), a: 24.9, an: x("24.9", "24,9", "24,9"), b: 14.0, bn: x("14.0", "14,0", "14,0") },
            { k: x("Hospital 3", "Spitali 3", "Klinik 3"), a: 16.0, an: x("16.0", "16,0", "16,0"), b: 12.1, bn: x("12.1", "12,1", "12,1") },
            { k: x("Hospital 4", "Spitali 4", "Klinik 4"), a: 9.6, an: x("9.6", "9,6", "9,6"), b: 8.2, bn: x("8.2", "8,2", "8,2") },
            { k: x("Hospital 5", "Spitali 5", "Klinik 5"), a: 45.7, an: x("45.7", "45,7", "45,7"), b: 45.4, bn: x("45.4", "45,4", "45,4"), alert: true },
            { k: x("Hospital 6", "Spitali 6", "Klinik 6"), a: 37.6, an: x("37.6", "37,6", "37,6"), b: 18.1, bn: x("18.1", "18,1", "18,1") },
          ] },
        { type: "p", text: x(
          "In the control hospitals, complications went from 30.4 to 31.2 per 100 patients. In a sample of 1,146 lists, a median of 80% of items was filled in. Patients whose list was filled in above that median had 7.1 complications per 100; those below it, 18.8.",
          "Në spitalet e kontrollit, ndërlikimet shkuan nga 30,4 në 31,2 për 100 pacientë. Në një mostër prej 1.146 listash, mediana e pikave të plotësuara ishte 80%. Pacientët, lista e të cilëve ishte plotësuar mbi këtë mediane, patën 7,1 ndërlikime për 100; ata nën të, 18,8.",
          "In den Kontrollkliniken stiegen die Komplikationen von 30,4 auf 31,2 je 100 Patienten. In einer Stichprobe von 1.146 Listen waren im Median 80 % der Punkte ausgefüllt. Patienten mit einer Liste über diesem Median hatten 7,1 Komplikationen je 100, die darunter 18,8.") },
        { type: "callout", reading: true, text: x(
          "One list, six results. The authors point to how fully each hospital used it and how far it had become part of the work.",
          "Një listë, gjashtë rezultate. Autorët tregojnë sa plotësisht e përdori secili spital dhe sa ishte bërë pjesë e punës.",
          "Eine Liste, sechs Ergebnisse. Die Autoren verweisen darauf, wie vollständig jede Klinik sie nutzte und wie weit sie Teil der Arbeit geworden war.") },
      ],
      note: x(
        "Hospitals in the authors' random order; 5 and 6 are academic, with sicker patients and larger operations. Completeness was checked in about 26% of procedures; patients with fuller lists may differ in other ways too.",
        "Spitalet sipas renditjes së rastësishme të autorëve; 5 dhe 6 janë universitare, me pacientë më të rënduar dhe operacione më të mëdha. Plotësimi u kontrollua në rreth 26% të procedurave; pacientët me lista më të plota mund të dallojnë edhe në mënyra të tjera.",
        "Kliniken in der zufälligen Reihenfolge der Autoren; 5 und 6 sind Universitätskliniken mit kränkeren Patienten und größeren Eingriffen. Die Vollständigkeit wurde bei etwa 26 % der Eingriffe geprüft; Patienten mit volleren Listen können sich auch anders unterscheiden."),
      source: ["check-devries-2010"],
    },
    {
      id: "model",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("A list built", "Një listë e ndërtuar", "Eine Liste,"), x("for the shift", "për turnin", "für die Schicht gebaut")],
      lead: x(
        "For NASA, Asaf Degani and Earl Wiener observed 42 airline crews on 72 flights and read the reports of checklist failures; their report appeared in 1990. In 2009 the WHO set its own rules for adapting the surgical list. The two agree on more than they differ.",
        "Për NASA-n, Asaf Degani dhe Earl Wiener vëzhguan 42 ekuipazhe ajrore në 72 fluturime dhe lexuan raportet e dështimeve me listat; raporti i tyre doli më 1990. Më 2009 OBSH-ja vendosi rregullat e veta për përshtatjen e listës kirurgjikale. Të dyja përputhen më shumë se sa ndryshojnë.",
        "Für die NASA beobachteten Asaf Degani und Earl Wiener 42 Airline-Crews auf 72 Flügen und lasen Berichte über Checklistenfehler; ihr Bericht erschien 1990. 2009 legte die WHO eigene Regeln für die Anpassung der OP-Liste fest. Beide stimmen mehr überein, als sie sich unterscheiden."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("Short", "E shkurtër", "Kurz"), p: x("Five to nine items per section, under a minute each (WHO). At an airline with 81 items for start, taxi and take-off, pilots worried about poor discipline.", "Pesë deri në nëntë pika për çdo pjesë, nën një minutë secila (OBSH). Në një linjë ajrore me 81 pika për ndezjen, lëvizjen dhe ngritjen, pilotët shqetësoheshin për disiplinën e dobët.", "Fünf bis neun Punkte je Abschnitt, jeweils unter einer Minute (WHO). Bei einer Airline mit 81 Punkten für Start, Rollen und Abheben klagten Piloten über schwache Disziplin.") },
          { h: x("Critical items first", "Pikat kritike në fillim", "Kritisches zuerst"), p: x("Interruptions come late in a list; what must not be missed goes near the top.", "Ndërprerjet vijnë vonë në një listë; ajo që s'duhet humbur shkon afër majës.", "Unterbrechungen kommen spät in einer Liste; was nicht fehlen darf, steht weit oben.") },
          { h: x("Say the value", "Thuaj vlerën", "Den Wert nennen"), p: x("“Flaps 15”, not “checked”: a reply that states the setting can be heard to be wrong.", "“Flapat 15”, jo “kontrolluar”: një përgjigje që thotë vlerën dëgjohet kur është e gabuar.", "„Klappen 15“, nicht „geprüft“: Eine Antwort mit dem Wert lässt sich als falsch hören.") },
          { h: x("Spoken by the team", "E thënë nga ekipi", "Vom Team gesprochen"), p: x("Used only as a written form, the WHO expects the list to be far less effective.", "E përdorur vetëm si formular i shkruar, OBSH-ja pret që lista të jetë shumë më pak efektive.", "Nur als schriftliches Formular genutzt, erwartet die WHO eine weit geringere Wirkung.") },
          { h: x("Not a dumping site", "Jo vend për hedhje", "Keine Ablage"), p: x("An item added after every incident makes the list longer and its use weaker.", "Një pikë e shtuar pas çdo incidenti e bën listën më të gjatë dhe përdorimin më të dobët.", "Ein Punkt nach jedem Vorfall macht die Liste länger und ihren Gebrauch schwächer.") },
          { h: x("Tested before rollout", "E provuar para përhapjes", "Erprobt vor der Einführung"), p: x("One team, one day; change it and try again (WHO).", "Një ekip, një ditë; ndryshoje dhe provoje sërish (OBSH).", "Ein Team, ein Tag; ändern und erneut versuchen (WHO).") },
        ] },
        { type: "callout", reading: true, text: x(
          "Every item added to a list takes a little attention from the items already on it.",
          "Çdo pikë që i shtohet një liste merr pak vëmendje nga pikat që janë tashmë aty.",
          "Jeder Punkt, der einer Liste hinzugefügt wird, nimmt den vorhandenen ein wenig Aufmerksamkeit.") },
      ],
      note: x(
        "Rules shortened by the editors from Degani & Wiener's Appendix A (1990) and the WHO manual (2009). The aviation report covers airliners' normal checklist. Designing out the need to remember is No. 46, poka-yoke.",
        "Rregullat janë shkurtuar nga redaksia nga shtojca A e Degani & Wiener (1990) dhe nga manuali i OBSH-së (2009). Raporti i aviacionit trajton listën normale të avionëve të linjës. Si hiqet nevoja për të mbajtur mend është te Nr. 46, poka-yoke.",
        "Regeln von der Redaktion gekürzt aus Anhang A von Degani & Wiener (1990) und dem WHO-Handbuch (2009). Der Luftfahrtbericht behandelt die normale Checkliste von Verkehrsflugzeugen. Wie man das Erinnern überflüssig macht, steht in Nr. 46, Poka-Yoke."),
      source: ["check-degani-wiener-1990", "check-who-2009"],
    },
    {
      id: "measure", more: "a-good-sop-is-not-a-document",
      kicker: x("How it is measured", "Si matet", "Wie es gemessen wird"),
      title: [x("Ticked", "E shënuar", "Abgehakt"), x("or used?", "apo e përdorur?", "oder genutzt?")],
      lead: x(
        "After the crash of Delta flight 1141, which took off without flaps, investigators timed the checklist on the voice recorder: less than a second between “flaps” and “fifteen, fifteen, green light”. Pilots told Degani and Wiener the list can become a “sing-song”, recited from memory.",
        "Pas rrëzimit të fluturimit 1141 të Delta-s, që u ngrit pa flapa, hetuesit matën kohën e listës në regjistruesin e zërit: më pak se një sekondë mes “flapat” dhe “pesëmbëdhjetë, pesëmbëdhjetë, dritë jeshile”. Pilotët u thanë Degani-t dhe Wiener-it se lista mund të bëhet një “këngë”, e thënë përmendsh.",
        "Nach dem Absturz von Delta-Flug 1141, der ohne Klappen startete, maßen die Ermittler die Checkliste auf dem Stimmenrekorder: weniger als eine Sekunde zwischen „Klappen“ und „fünfzehn, fünfzehn, grünes Licht“. Piloten sagten Degani und Wiener, die Liste könne zum „Singsang“ werden, aus dem Gedächtnis aufgesagt."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("Watched, not only reported", "E vëzhguar, jo vetëm e raportuar", "Beobachtet, nicht nur gemeldet"), p: x("Someone sees the list in use a few times a month; a compliance figure alone counts ticks.", "Dikush e sheh listën në përdorim disa herë në muaj; vetëm shifra e zbatimit numëron shenja.", "Jemand sieht die Liste ein paarmal im Monat im Einsatz; eine Einhaltungsquote allein zählt Häkchen.") },
          { h: x("Values spoken", "Vlerat të thëna", "Werte genannt"), p: x("Replies give the reading, so a wrong one can be heard.", "Përgjigjet japin vlerën, që një vlerë e gabuar të dëgjohet.", "Antworten nennen den Wert, damit ein falscher hörbar wird.") },
          { h: x("Time per section", "Koha për çdo pjesë", "Zeit je Abschnitt"), p: x("Near a minute; far less may mean it is recited, far more that it is too long.", "Rreth një minutë; shumë më pak mund të thotë se thuhet përmendsh, shumë më shumë se është tepër e gjatë.", "Um eine Minute; viel weniger kann heißen, sie wird aufgesagt, viel mehr, sie ist zu lang.") },
          { h: x("Stops that happen", "Ndalesa që ndodhin", "Halte, die vorkommen"), p: x("How often the list held the work: an item missing, a step repeated.", "Sa shpesh e ndali lista punën: një pikë që mungonte, një hap i përsëritur.", "Wie oft die Liste die Arbeit anhielt: ein fehlender Punkt, ein wiederholter Schritt.") },
          { h: x("Changed by its users", "E ndryshuar nga përdoruesit", "Von den Nutzern geändert"), p: x("The last change came from the people who run it, and was tried before it spread.", "Ndryshimi i fundit erdhi nga ata që e përdorin, dhe u provua para se të përhapej.", "Die letzte Änderung kam von denen, die sie nutzen, und wurde vor der Ausbreitung erprobt.") },
        ] },
        { type: "callout", reading: true, text: x(
          "A list is in use when it can stop the work. If it never has, it is probably being recited.",
          "Një listë është në përdorim kur mund ta ndalë punën. Nëse s'e ka ndalur kurrë, ndoshta thuhet përmendsh.",
          "Eine Liste ist in Gebrauch, wenn sie die Arbeit anhalten kann. Hat sie das nie getan, wird sie wohl aufgesagt.") },
      ],
      note: x(
        "The marks are the editors', drawn from Degani & Wiener (1990), the WHO manual (2009) and the Ontario study (2014). The NTSB timing is as Degani & Wiener report it. Standard work, the base a list checks, is No. 35.",
        "Shenjat janë të redaksisë, të nxjerra nga Degani & Wiener (1990), manuali i OBSH-së (2009) dhe studimi i Ontarios (2014). Matja e NTSB-së është siç e japin Degani & Wiener. Puna standarde, baza që kontrollon një listë, është te Nr. 35.",
        "Die Merkmale stammen von der Redaktion, gestützt auf Degani & Wiener (1990), das WHO-Handbuch (2009) und die Ontario-Studie (2014). Die NTSB-Messung wie bei Degani & Wiener. Standardarbeit, die Grundlage einer Liste, steht in Nr. 35."),
      source: ["check-degani-wiener-1990", "check-who-2009", "check-urbach-2014"],
    },
    {
      id: "tool", tool: "/tools/leader-standard-work/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The checklist", "Karta e rishikimit", "Die Checklisten-"), x("review card", "të listës", "Prüfkarte")],
      lead: x(
        "One card per list, filled in with the people who use it. Start with one team: in the WHO pilot, sites that began in many operating rooms at once met the most resistance. Leader Standard Work puts watching the list on a leader's daily round.",
        "Një kartë për çdo listë, e plotësuar me ata që e përdorin. Fillo me një ekip: në provën e OBSH-së, vendet që nisën në shumë salla njëherësh hasën rezistencën më të madhe. Leader Standard Work e vë vëzhgimin e listës në raundin ditor të drejtuesit.",
        "Eine Karte pro Liste, ausgefüllt mit denen, die sie nutzen. Mit einem Team beginnen: Im WHO-Pilot stießen Standorte, die in vielen OP-Sälen zugleich anfingen, auf den meisten Widerstand. Leader Standard Work setzt das Beobachten der Liste auf die tägliche Runde der Führungskraft."),
      blocks: [
        { type: "form", items: [
          { h: x("The list and its moment", "Lista dhe momenti i saj", "Die Liste und ihr Moment"), hint: x("which work, which pause: before the start, before the step that cannot be undone, at the end", "cila punë, cila ndalesë: para fillimit, para hapit që s'kthehet, në fund", "welche Arbeit, welche Pause: vor dem Start, vor dem unumkehrbaren Schritt, am Ende") },
          { h: x("Items", "Pikat", "Punkte"), hint: x("how many per section; which ones stopped the work last month", "sa për çdo pjesë; cilat e ndalën punën muajin e kaluar", "wie viele je Abschnitt; welche im letzten Monat die Arbeit anhielten") },
          { h: x("Critical items", "Pikat kritike", "Kritische Punkte"), hint: x("the two or three that must never be missed; are they near the top?", "dy ose tri që s'duhen humbur kurrë; a janë afër majës?", "die zwei oder drei, die nie fehlen dürfen; stehen sie oben?") },
          { h: x("The replies", "Përgjigjet", "Die Antworten"), hint: x("does each reply state a value or a fact, not “checked”?", "a thotë çdo përgjigje një vlerë ose një fakt, jo “kontrolluar”?", "nennt jede Antwort einen Wert oder eine Tatsache, nicht „geprüft“?") },
          { h: x("Observed use", "Përdorimi i vëzhguar", "Beobachteter Gebrauch"), hint: x("watched how often, by whom; time per section; what was skipped", "sa shpesh u vëzhgua, nga kush; koha për pjesë; çfarë u kapërcye", "wie oft beobachtet, von wem; Zeit je Abschnitt; was übersprungen wurde") },
          { h: x("Change", "Ndryshimi", "Änderung"), hint: x("what to remove, what to add; where it is tried first; next review date", "çfarë hiqet, çfarë shtohet; ku provohet së pari; data e rishikimit të radhës", "was weg kann, was dazu muss; wo zuerst erprobt; nächster Prüftermin"), lines: 2 },
        ] },
      ],
      note: x(
        "The card is the editors' proposal, built on Degani & Wiener's guidelines (1990), the WHO manual (2009) and the SURPASS data on completeness (de Vries et al., 2010).",
        "Karta është propozim i redaksisë, e ndërtuar mbi udhëzimet e Degani & Wiener (1990), manualin e OBSH-së (2009) dhe të dhënat e SURPASS për plotësimin (de Vries et al., 2010).",
        "Die Karte ist ein Vorschlag der Redaktion, gestützt auf die Leitlinien von Degani & Wiener (1990), das WHO-Handbuch (2009) und die SURPASS-Daten zur Vollständigkeit (de Vries et al., 2010)."),
      source: ["check-degani-wiener-1990", "check-who-2009", "check-devries-2010"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
