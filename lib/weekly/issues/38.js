// Management Review, No. 38: Conflict in the team. Block: People.
// Facts and their sources: docs/revista/management-review-nr-38.md.
import { x, pc } from "../common.js";

export default {
  number: 38,
  block: "people",
  date: x("October 2026", "Tetor 2026", "Oktober 2026"),
  theme: [x("Conflict", "Konflikti", "Konflikte"), x("in the team", "në ekip", "im Team")],
  sub: x(
    "Three kinds of conflict and what each costs, the hours it takes every week, five ways of handling it, what goes with stronger teams, and a card for the next dispute.",
    "Tri llojet e konfliktit dhe çfarë kushton secili, orët që merr çdo javë, pesë mënyrat për ta trajtuar, çfarë shkon me ekipe më të forta, dhe një kartë për mosmarrëveshjen e radhës.",
    "Drei Arten von Konflikt und was jede kostet, die Stunden, die er jede Woche bindet, fünf Wege, damit umzugehen, was mit stärkeren Teams einhergeht, und eine Karte für den nächsten Streit."),
  seo: x(
    "Conflict in the team: task, relationship and process conflict, two hours a week, the five Thomas-Kilmann modes and a card for the next dispute.",
    "Konflikti në ekip: për detyrën, marrëdhënien dhe procesin, dy orë në javë, pesë mënyrat e Thomas-Kilmann dhe një kartë për mosmarrëveshjen e radhës.",
    "Konflikte im Team: Aufgaben-, Beziehungs- und Prozesskonflikte, zwei Stunden pro Woche, die fünf Modi nach Thomas-Kilmann und eine Karte für den Streit."),
  feature: x(
    "Issue 38 starts with the belief that disagreement about the work makes a team sharper and only personal friction harms it, follows two meta-analyses that tested it, counts the hours a week that conflict takes in nine countries, sets out the five modes of Thomas and Kilmann, looks at which ways of handling conflict go with stronger teams, and ends with a card for the next dispute.",
    "Numri 38 nis me bindjen se mosmarrëveshja për punën e mpreh ekipin dhe vetëm fërkimi personal e dëmton, ndjek dy meta-analiza që e provuan, numëron orët në javë që merr konflikti në nëntë vende, shtjellon pesë mënyrat e Thomas-it dhe Kilmann-it, shikon cilat mënyra të trajtimit të konfliktit shkojnë me ekipe më të forta, dhe mbyllet me një kartë për mosmarrëveshjen e radhës.",
    "Ausgabe 38 beginnt mit der Annahme, dass Uneinigkeit über die Arbeit ein Team schärft und nur persönliche Reibung ihm schadet, folgt zwei Metaanalysen, die sie geprüft haben, zählt die Stunden pro Woche, die Konflikte in neun Ländern binden, stellt die fünf Modi von Thomas und Kilmann vor, betrachtet, welche Arten des Umgangs mit Konflikten mit stärkeren Teams einhergehen, und endet mit einer Karte für den nächsten Streit."),
  figure: { n: x("2.1", "2,1", "2,1"), by: "CPP, 2008", t: x(
    "hours a week, on average, that employees in nine countries said they spent dealing with conflict at work.",
    "orë në javë, mesatarisht, që punonjësit në nëntë vende thanë se kalonin me konfliktet në punë.",
    "Stunden pro Woche verbrachten Beschäftigte in neun Ländern nach eigener Angabe im Schnitt mit Konflikten bei der Arbeit.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("Not every conflict is the same", "Jo çdo konflikt është i njëjtë", "Nicht jeder Konflikt ist gleich") },
    { page: "model", kicker: x("The model", "Modeli", "Das Modell"),
      title: x("Five ways to handle a conflict", "Pesë mënyra për ta trajtuar konfliktin", "Fünf Wege, mit einem Konflikt umzugehen") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The conflict card", "Karta e konfliktit", "Die Konfliktkarte") },
  ],
  sources: ["de-dreu-weingart-2003", "simons-peterson-2000", "de-wit-2012", "cpp-2008", "thomas-kilmann-1974", "dechurch-2013", "de-dreu-van-vianen-2001"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Every team disagrees: about priorities, about who does what, sometimes about each other. This issue asks which conflict costs a team, which can help it, and what a manager can do once it starts.",
        "Çdo ekip ka mosmarrëveshje: për prioritetet, për kush bën çfarë, ndonjëherë për njëri-tjetrin. Ky numër pyet cili konflikt i kushton ekipit, cili mund ta ndihmojë, dhe çfarë mund të bëjë menaxheri kur ai nis.",
        "Jedes Team ist sich manchmal uneinig: über Prioritäten, darüber, wer was macht, manchmal übereinander. Diese Ausgabe fragt, welcher Konflikt ein Team etwas kostet, welcher ihm helfen kann und was eine Führungskraft tun kann, wenn er beginnt."),
      body: x(
        "Researchers separate conflict about the task, about the relationship and about the process. Two meta-analyses, of 30 studies in 2003 and 116 in 2012, link personal friction with weaker teams, while for disagreement about the work the answer depends on the setting. In a 2008 survey in nine countries, employees said they spent 2.1 hours a week on conflict. Kenneth Thomas and Ralph Kilmann describe five ways of handling it, and a 2013 meta-analysis finds that how a team handles its differences matters at least as much as how much conflict it has.",
        "Kërkuesit e ndajnë konfliktin për detyrën, për marrëdhënien dhe për procesin. Dy meta-analiza, me 30 studime në 2003 dhe 116 në 2012, e lidhin fërkimin personal me ekipe më të dobëta, ndërsa për mosmarrëveshjen për punën përgjigjja varet nga rrethanat. Në një anketë të 2008 në nëntë vende, punonjësit thanë se kalonin 2,1 orë në javë me konfliktet. Kenneth Thomas dhe Ralph Kilmann përshkruajnë pesë mënyra për ta trajtuar, dhe një meta-analizë e 2013 gjen se si i trajton ekipi dallimet ka të paktën aq rëndësi sa sasia e konfliktit.",
        "Die Forschung unterscheidet Konflikte über die Aufgabe, über die Beziehung und über den Prozess. Zwei Metaanalysen, mit 30 Studien 2003 und 116 im Jahr 2012, verbinden persönliche Reibung mit schwächeren Teams, während es bei Uneinigkeit über die Arbeit auf die Umstände ankommt. In einer Umfrage von 2008 in neun Ländern gaben Beschäftigte an, 2,1 Stunden pro Woche mit Konflikten zu verbringen. Kenneth Thomas und Ralph Kilmann beschreiben fünf Wege, damit umzugehen, und eine Metaanalyse von 2013 zeigt, dass der Umgang eines Teams mit Unterschieden mindestens so viel zählt wie die Menge an Konflikten."),
    },
    {
      id: "story", more: "mistakes-get-lost-between-departments",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("Not every conflict", "Jo çdo konflikt", "Nicht jeder Konflikt"), x("is the same", "është i njëjtë", "ist gleich")],
      lead: x(
        "For years textbooks taught that disagreement about the work makes a team sharper and only personal friction harms it. In 2003 Carsten De Dreu and Laurie Weingart tested the idea across 30 studies.",
        "Për vite me radhë, tekstet mësonin se mosmarrëveshja për punën e mpreh ekipin dhe vetëm fërkimi personal e dëmton. Në 2003, Carsten De Dreu dhe Laurie Weingart e provuan këtë ide në 30 studime.",
        "Jahrelang lehrten Lehrbücher, dass Uneinigkeit über die Arbeit ein Team schärft und nur persönliche Reibung ihm schadet. 2003 prüften Carsten De Dreu und Laurie Weingart diese Annahme anhand von 30 Studien."),
      blocks: [
        { type: "cards", cols: 3, items: [
          { h: x("Task", "Detyra", "Aufgabe"), p: x("different views on the content of the work: ideas, opinions, decisions", "pikëpamje të ndryshme për përmbajtjen e punës: ide, mendime, vendime", "unterschiedliche Sichtweisen auf den Inhalt der Arbeit: Ideen, Meinungen, Entscheidungen") },
          { h: x("Relationship", "Marrëdhënia", "Beziehung"), p: x("personal incompatibility, with tension, annoyance and animosity", "mospërputhje personale, me tension, acarim dhe armiqësi", "persönliche Unverträglichkeit, mit Spannung, Ärger und Feindseligkeit") },
          { h: x("Process", "Procesi", "Prozess"), p: x("how the work gets done: who does what, and who is responsible", "si bëhet puna: kush bën çfarë dhe kush përgjigjet", "wie die Arbeit erledigt wird: wer was macht und wer verantwortlich ist") },
        ] },
        { type: "p", text: x(
          "Their result went against the textbooks: task conflict went with weaker team performance (−0.23) about as much as relationship conflict (−0.22). In 2012 Frank de Wit, Lindred Greer and Karen Jehn repeated the test with 116 studies: relationship (−0.16) and process conflict (−0.15) still went with weaker performance, task conflict on average not at all (−0.01).",
          "Rezultati i tyre shkoi kundër teksteve: konflikti për detyrën shkonte me performancë më të dobët të ekipit (−0,23) pothuajse aq sa ai për marrëdhënien (−0,22). Në 2012, Frank de Wit, Lindred Greer dhe Karen Jehn e përsëritën provën me 116 studime: konflikti për marrëdhënien (−0,16) dhe për procesin (−0,15) shkonin ende me performancë më të dobët, ai për detyrën mesatarisht aspak (−0,01).",
          "Ihr Ergebnis widersprach den Lehrbüchern: Aufgabenkonflikte gingen etwa so stark mit schwächerer Teamleistung einher (−0,23) wie Beziehungskonflikte (−0,22). 2012 wiederholten Frank de Wit, Lindred Greer und Karen Jehn die Prüfung mit 116 Studien: Beziehungs- (−0,16) und Prozesskonflikte (−0,15) gingen weiter mit schwächerer Leistung einher, Aufgabenkonflikte im Schnitt gar nicht (−0,01).") },
        { type: "callout", reading: true, text: x(
          "Disagreeing about the work is not healthy by default. It helps only as long as it stays about the work.",
          "Mosmarrëveshja për punën nuk është e shëndetshme vetvetiu. Ndihmon vetëm për sa kohë mbetet te puna.",
          "Uneinigkeit über die Arbeit ist nicht von sich aus gesund. Sie hilft nur, solange sie bei der Arbeit bleibt.") },
      ],
      note: x(
        "Corrected correlations from correlational studies: a link, not proof of cause. Task and relationship conflict follow Karen Jehn (1995), as Simons and Peterson sum her up; process conflict follows de Wit and colleagues (2012).",
        "Korrelacione të korrigjuara nga studime korrelacionale: lidhje, jo provë shkaku. Konflikti për detyrën dhe për marrëdhënien ndjekin Karen Jehn-in (1995), siç e përmbledhin Simons dhe Peterson; konflikti për procesin ndjek de Wit-in dhe kolegët (2012).",
        "Korrigierte Korrelationen aus Korrelationsstudien: ein Zusammenhang, kein Beweis einer Ursache. Aufgaben- und Beziehungskonflikt folgen Karen Jehn (1995), wie Simons und Peterson sie zusammenfassen; der Prozesskonflikt folgt de Wit und Kollegen (2012)."),
      source: ["de-dreu-weingart-2003", "simons-peterson-2000", "de-wit-2012"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("Two hours", "Dy orë", "Zwei Stunden"), x("a week", "në javë", "pro Woche")],
      lead: x(
        "In May 2008 CPP, then the publisher of the Thomas-Kilmann instrument, surveyed 5,000 full-time employees in nine countries in Europe and the Americas. The hours a week they said they spent dealing with conflict:",
        "Në maj 2008, CPP, atëherë botuesi i instrumentit Thomas-Kilmann, anketoi 5.000 punonjës me kohë të plotë në nëntë vende të Europës dhe të Amerikave. Orët në javë që thanë se kalonin me konfliktet:",
        "Im Mai 2008 befragte CPP, damals Verlag des Thomas-Kilmann-Instruments, 5.000 Vollzeitbeschäftigte in neun Ländern Europas und Amerikas. Die Stunden pro Woche, die sie nach eigener Angabe mit Konflikten verbrachten:"),
      blocks: [
        { type: "hbars", max: 3.5, source: ["cpp-2008"],
          label: x("Hours a week spent dealing with conflict at work, 2008", "Orë në javë me konfliktet në punë, 2008", "Stunden pro Woche mit Konflikten bei der Arbeit, 2008"),
          items: [
            { k: x("Germany", "Gjermania", "Deutschland"), v: 3.3, n: x("3.3 h", "3,3 orë", "3,3 Std."), alert: true },
            { k: x("United States", "Shtetet e Bashkuara", "USA"), v: 2.8, n: x("2.8 h", "2,8 orë", "2,8 Std.") },
            { k: x("Average of the nine countries", "Mesatarja e nëntë vendeve", "Durchschnitt der neun Länder"), v: 2.1, n: x("2.1 h", "2,1 orë", "2,1 Std.") },
            { k: x("Netherlands", "Holanda", "Niederlande"), v: 0.9, n: x("0.9 h", "0,9 orë", "0,9 Std.") },
          ] },
        { type: "figures", compact: true, items: [
          { n: pc(29), t: x("deal with conflict always or frequently; in Germany, 56%", "përballen me konflikte gjithmonë ose shpesh; në Gjermani, 56%", "haben immer oder häufig mit Konflikten zu tun; in Deutschland 56 %") },
          { n: pc(67), t: x("have gone out of their way to avoid a colleague after a disagreement", "kanë shmangur qëllimisht një koleg pas një mosmarrëveshjeje", "sind nach einer Meinungsverschiedenheit einem Kollegen bewusst aus dem Weg gegangen") },
          { n: pc(22), t: x("of non-managers think their managers handle conflict well; 31% of managers think so of themselves", "e punonjësve pa rol drejtues mendojnë se menaxherët i trajtojnë mirë konfliktet; 31% e menaxherëve e mendojnë këtë për veten", "der Beschäftigten ohne Führungsrolle finden, dass ihre Vorgesetzten Konflikte gut lösen; 31 % der Führungskräfte sagen das von sich") },
        ] },
        { type: "p", text: x(
          "Causes named most: clashes of personality and ego (49%), stress (34%), heavy workloads (33%). Only in Germany did stress come first (41%).",
          "Shkaqet e përmendura më shpesh: përplasjet e karaktereve dhe të egove (49%), stresi (34%), ngarkesa e rëndë (33%). Vetëm në Gjermani stresi doli i pari (41%).",
          "Am häufigsten genannte Ursachen: Persönlichkeits- und Egokonflikte (49 %), Stress (34 %), hohe Arbeitslast (33 %). Nur in Deutschland stand Stress an erster Stelle (41 %).") },
      ],
      note: x(
        "Commissioned by a firm that sells conflict instruments and training; self-reports from 2008, the hours are estimates. For Albania we have no comparable figure.",
        "E porositur nga një firmë që shet instrumente dhe trajnime për konfliktin; vetëdeklarime të 2008, orët janë vlerësime. Për Shqipërinë s'kam shifër të krahasueshme.",
        "Im Auftrag einer Firma, die Konfliktinstrumente und Trainings verkauft; Selbstauskünfte von 2008, die Stunden sind Schätzungen. Für Albanien liegt uns keine vergleichbare Zahl vor."),
      source: ["cpp-2008"],
    },
    {
      id: "model",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Five ways", "Pesë mënyra", "Fünf Wege,"), x("to handle a conflict", "për ta trajtuar konfliktin", "mit Konflikten umzugehen")],
      lead: x(
        "In 1974 Kenneth Thomas and Ralph Kilmann published an instrument of 30 pairs of statements. It places behaviour in a conflict on two dimensions: how far a person tries to satisfy their own concerns, and how far the other person's.",
        "Në 1974, Kenneth Thomas dhe Ralph Kilmann botuan një instrument me 30 çifte pohimesh. Ai e vendos sjelljen në një konflikt mbi dy dimensione: sa përpiqet njeriu të plotësojë shqetësimet e veta, dhe sa ato të tjetrit.",
        "1974 veröffentlichten Kenneth Thomas und Ralph Kilmann ein Instrument mit 30 Aussagepaaren. Es ordnet Verhalten im Konflikt auf zwei Dimensionen ein: wie weit jemand die eigenen Anliegen durchzusetzen versucht und wie weit die der anderen Person."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("Competing", "Konkurrimi", "Konkurrieren"), p: x("Assertive, not cooperative: you pursue your own concerns at the other person's expense.", "Këmbëngulës, jo bashkëpunues: ndjek shqetësimet e tua në kurriz të tjetrit.", "Durchsetzend, nicht kooperativ: Man verfolgt die eigenen Anliegen auf Kosten der anderen Person.") },
          { h: x("Collaborating", "Bashkëpunimi", "Zusammenarbeiten"), p: x("Assertive and cooperative: you look for a solution that meets the concerns of both.", "Këmbëngulës dhe bashkëpunues: kërkon një zgjidhje që plotëson shqetësimet e të dyve.", "Durchsetzend und kooperativ: Man sucht eine Lösung, die die Anliegen beider erfüllt.") },
          { h: x("Compromising", "Kompromisi", "Kompromiss"), p: x("Moderate on both: each side gives up part of what it wants.", "Mesatar në të dyja: secila palë heq dorë nga një pjesë e asaj që do.", "Mittel auf beiden: Jede Seite gibt einen Teil dessen auf, was sie will.") },
          { h: x("Avoiding", "Shmangia", "Vermeiden"), p: x("Neither assertive nor cooperative: you pursue neither your concerns nor the other's, at least for now.", "As këmbëngulës, as bashkëpunues: nuk ndjek as shqetësimet e tua, as të tjetrit, të paktën për tani.", "Weder durchsetzend noch kooperativ: Man verfolgt weder die eigenen Anliegen noch die der anderen, zumindest vorerst.") },
          { h: x("Accommodating", "Përshtatja", "Entgegenkommen"), p: x("Cooperative, not assertive: you set your own concerns aside to meet the other's.", "Bashkëpunues, jo këmbëngulës: i lë mënjanë shqetësimet e tua për të plotësuar ato të tjetrit.", "Kooperativ, nicht durchsetzend: Man stellt die eigenen Anliegen zurück, um denen der anderen zu entsprechen.") },
        ] },
        { type: "callout", reading: true, text: x(
          "Most of us have a habit, not a choice. Before a dispute, ask which mode the situation needs, not which one comes naturally.",
          "Shumica prej nesh kemi një zakon, jo një zgjedhje. Para një mosmarrëveshjeje, pyet cilën mënyrë kërkon situata, jo cila të vjen natyrshëm.",
          "Die meisten von uns haben eine Gewohnheit, keine Wahl. Vor einem Streit lohnt die Frage, welchen Modus die Lage braucht, nicht welcher einem liegt.") },
      ],
      note: x(
        "In Kilmann's words, everyone can use all five modes. The modes describe behaviour, not character. The instrument has been sold since 1998 by CPP, now The Myers-Briggs Company, which also commissioned the 2008 survey.",
        "Sipas Kilmann-it, çdokush mund t'i përdorë të pesë mënyrat. Mënyrat përshkruajnë sjelljen, jo karakterin. Instrumentin e shet që nga 1998 CPP, sot The Myers-Briggs Company, që porositi edhe anketën e 2008.",
        "Nach Kilmann kann jeder alle fünf Modi nutzen. Die Modi beschreiben Verhalten, nicht Charakter. Das Instrument vertreibt seit 1998 CPP, heute The Myers-Briggs Company, die auch die Umfrage von 2008 in Auftrag gab."),
      source: ["thomas-kilmann-1974", "cpp-2008"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("How the team", "Si e trajton", "Wie das Team"), x("handles it", "ekipi", "damit umgeht")],
      lead: x(
        "In 2013 Leslie DeChurch, Jessica Mesmer-Magnus and Dan Doty pooled 45 studies with 3,218 teams. They separated how much conflict a team has from the way it handles it.",
        "Në 2013, Leslie DeChurch, Jessica Mesmer-Magnus dhe Dan Doty bashkuan 45 studime me 3.218 ekipe. Ata ndanë sa konflikt ka një ekip nga mënyra si e trajton atë.",
        "2013 fassten Leslie DeChurch, Jessica Mesmer-Magnus und Dan Doty 45 Studien mit 3.218 Teams zusammen. Sie trennten, wie viel Konflikt ein Team hat, davon, wie es damit umgeht."),
      blocks: [
        { type: "hbars", max: 0.4, source: ["dechurch-2013"],
          label: x("How a team handles conflict and its performance (corrected correlation)", "Si e trajton ekipi konfliktin dhe performanca e tij (korrelacion i korrigjuar)", "Umgang eines Teams mit Konflikten und seine Leistung (korrigierte Korrelation)"),
          items: [
            { k: x("Discussing differences openly", "Diskutimi i hapur i dallimeve", "Unterschiede offen besprechen"), v: 0.33, n: x("0.33", "0,33", "0,33") },
            { k: x("Collaborating", "Bashkëpunimi", "Zusammenarbeiten"), v: 0.31, n: x("0.31", "0,31", "0,31") },
            { k: x("Avoiding", "Shmangia", "Vermeiden"), v: 0.17, n: x("−0.17", "−0,17", "−0,17"), alert: true },
            { k: x("Competing", "Konkurrimi", "Konkurrieren"), v: 0.23, n: x("−0.23", "−0,23", "−0,23"), alert: true },
          ] },
        { type: "p", text: x(
          "Beyond the amount of conflict, the way of handling it explained another 13% of the differences in performance and in how members felt. Avoiding needs a closer look: in a 2001 study by Carsten De Dreu and Annelies van Vianen, teams that avoided personal friction functioned better than those that fought it out or tried to resolve it together.",
          "Përtej sasisë së konfliktit, mënyra e trajtimit shpjegoi edhe 13% të dallimeve në performancë dhe në si ndiheshin anëtarët në ekip. Shmangia do parë më nga afër: në një studim të 2001 nga Carsten De Dreu dhe Annelies van Vianen, ekipet që e shmangnin fërkimin personal funksiononin më mirë se ato që përplaseshin ose përpiqeshin ta zgjidhnin bashkë.",
          "Über die Menge an Konflikten hinaus erklärte der Umgang damit weitere 13 % der Unterschiede in der Leistung und im Erleben des Teams. Vermeiden verdient einen zweiten Blick: In einer Studie von Carsten De Dreu und Annelies van Vianen von 2001 funktionierten Teams, die persönliche Reibung mieden, besser als jene, die sie austrugen oder gemeinsam zu lösen versuchten.") },
        { type: "callout", reading: true, text: x(
          "Argue about the work in the open. A personal clash is often better taken out of the meeting.",
          "Për punën, diskutoni hapur. Një përplasje personale shpesh është më mirë të nxirret jashtë takimit.",
          "Über die Arbeit offen streiten. Ein persönlicher Konflikt gehört oft nicht in die Besprechung.") },
      ],
      note: x(
        "Correlations, not proof of cause; bars show the size of the link, red where it is negative. Across studies, avoiding ranged from negative to slightly positive. The 2001 result is one field study of teams in complex, non-routine work.",
        "Korrelacione, jo provë shkaku; shiritat tregojnë madhësinë e lidhjes, me të kuqe aty ku është negative. Nëpër studime, shmangia shkonte nga negative deri në lehtësisht pozitive. Rezultati i 2001 është një studim i vetëm në terren, me ekipe në punë komplekse, jo rutinë.",
        "Korrelationen, kein Beweis einer Ursache; die Balken zeigen die Stärke des Zusammenhangs, rot, wo er negativ ist. Über die Studien reichte Vermeiden von negativ bis leicht positiv. Das Ergebnis von 2001 ist eine einzige Feldstudie mit Teams in komplexer, nicht routinemäßiger Arbeit."),
      source: ["dechurch-2013", "de-dreu-van-vianen-2001"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie man es misst"),
      title: [x("Ask what", "Pyet për çfarë", "Fragen, worum"), x("it is about", "bëhet fjalë", "es geht")],
      lead: x(
        "Most studies ask team members a few short questions from Karen Jehn's scale, some about the work and some about friction between people. What matters is not only how much of each a team has, but whether the two move together.",
        "Shumica e studimeve u bëjnë anëtarëve të ekipit disa pyetje të shkurtra nga shkalla e Karen Jehn-it, disa për punën dhe disa për fërkimin mes njerëzve. Ka rëndësi jo vetëm sa ka ekipi nga secila, por edhe nëse të dyja lëvizin bashkë.",
        "Die meisten Studien stellen Teammitgliedern einige kurze Fragen aus der Skala von Karen Jehn, manche zur Arbeit, manche zur Reibung zwischen Menschen. Es zählt nicht nur, wie viel ein Team von beidem hat, sondern ob beides zusammen auftritt."),
      blocks: [
        { type: "box", title: x("Three questions for the team", "Tri pyetje për ekipin", "Drei Fragen an das Team"), items: [
          x("Work: how often do people here disagree about the work being done?", "Puna: sa shpesh nuk pajtohen njerëzit këtu për punën që bëhet?", "Arbeit: Wie oft ist man sich hier über die Arbeit uneinig, die getan wird?"),
          x("Process: how often do we disagree about who does what?", "Procesi: sa shpesh nuk pajtohemi për kush bën çfarë?", "Prozess: Wie oft sind wir uns uneinig, wer was macht?"),
          x("Relationship: how much friction is there between people in the team?", "Marrëdhënia: sa fërkim ka mes njerëzve në ekip?", "Beziehung: Wie viel Reibung gibt es zwischen den Menschen im Team?"),
        ] },
        { type: "figures", compact: true, items: [
          { n: x("−0.10", "−0,10", "−0,10"), t: x("task conflict and performance, where task and relationship conflict were weakly linked", "konflikti për detyrën dhe performanca, aty ku konflikti për detyrën dhe ai për marrëdhënien lidheshin dobët", "Aufgabenkonflikt und Leistung, wo Aufgaben- und Beziehungskonflikt schwach zusammenhingen") },
          { n: x("−0.35", "−0,35", "−0,35"), t: x("the same link where the two were strongly linked (De Dreu & Weingart, 2003)", "e njëjta lidhje aty ku të dyja lidheshin fort (De Dreu & Weingart, 2003)", "derselbe Zusammenhang, wo beide stark zusammenhingen (De Dreu & Weingart, 2003)") },
        ] },
        { type: "p", text: x(
          "In 70 top management teams, Tony Simons and Randall Peterson found that trust changed how closely disagreement about the work went together with personal conflict. Their conclusion: trust is the key to gaining from task conflict without paying for relationship conflict.",
          "Në 70 ekipe të drejtimit të lartë, Tony Simons dhe Randall Peterson gjetën se besimi ndryshonte sa ngushtë shkonte mosmarrëveshja për punën me konfliktin personal. Përfundimi i tyre: besimi është çelësi për të fituar nga konflikti për detyrën pa paguar për konfliktin në marrëdhënie.",
          "In 70 Topmanagementteams fanden Tony Simons und Randall Peterson, dass Vertrauen beeinflusste, wie eng Uneinigkeit über die Arbeit mit persönlichem Konflikt einherging. Ihr Schluss: Vertrauen ist der Schlüssel, um von Aufgabenkonflikten zu profitieren, ohne für Beziehungskonflikte zu bezahlen.") },
      ],
      note: x(
        "The questions are our wording, after the sample items reported for Jehn's scale; the process question follows de Wit and colleagues. Use the answers for the team, never to rate a person.",
        "Pyetjet janë me fjalët tona, sipas shembujve të raportuar nga shkalla e Jehn-it; pyetja për procesin ndjek de Wit-in dhe kolegët. Përdori përgjigjet për ekipin, kurrë për të vlerësuar një person.",
        "Die Fragen sind in unseren Worten, nach den berichteten Beispielfragen aus Jehns Skala; die Prozessfrage folgt de Wit und Kollegen. Die Antworten sind für das Team, nie zur Bewertung einer Person."),
      source: ["de-dreu-weingart-2003", "simons-peterson-2000", "de-wit-2012"],
    },
    {
      id: "tool", tool: "/tools/five-whys/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The conflict", "Karta e", "Die Konflikt-"), x("card", "konfliktit", "karte")],
      lead: x(
        "Fill it in alone before the conversation, then go through it with the other person. If the same dispute keeps coming back, treat it as a problem in the process and look for its cause with the 5 Whys sheet.",
        "Plotësoje vetëm para bisedës, pastaj kaloje bashkë me personin tjetër. Nëse e njëjta mosmarrëveshje kthehet vazhdimisht, trajtoje si problem të procesit dhe kërkoja shkakun me fletën 5 Whys.",
        "Vor dem Gespräch allein ausfüllen, dann mit der anderen Person durchgehen. Kehrt derselbe Streit immer wieder, ihn als Problem im Prozess behandeln und die Ursache mit dem Blatt 5 Whys suchen."),
      blocks: [
        { type: "form", items: [
          { h: x("What it is about", "Për çfarë bëhet fjalë", "Worum es geht"), hint: x("the work, the process (who does what) or the relationship", "puna, procesi (kush bën çfarë) apo marrëdhënia", "die Arbeit, der Prozess (wer was macht) oder die Beziehung") },
          { h: x("The facts we both accept", "Faktet që i pranojmë të dy", "Die Fakten, die wir beide anerkennen"), hint: x("what happened, without adjectives", "çfarë ndodhi, pa mbiemra", "was passiert ist, ohne Adjektive") },
          { h: x("My concern", "Shqetësimi im", "Mein Anliegen"), hint: x("what I need, in one sentence", "çfarë më duhet, në një fjali", "was ich brauche, in einem Satz") },
          { h: x("Their concern", "Shqetësimi i tjetrit", "Das Anliegen der anderen Person"), hint: x("what I think they need; check it with them", "çfarë mendoj se i duhet; verifikoje me të", "was sie meines Erachtens braucht; mit ihr prüfen") },
          { h: x("The mode I choose", "Mënyra që zgjedh", "Der Modus, den ich wähle"), hint: x("compete, collaborate, compromise, avoid for now or accommodate, and why", "konkurroj, bashkëpunoj, bëj kompromis, e shmang për tani apo përshtatem, dhe pse", "konkurrieren, zusammenarbeiten, Kompromiss, vorerst vermeiden oder entgegenkommen, und warum") },
          { h: x("What we agree", "Çfarë biem dakord", "Was wir vereinbaren"), hint: x("who does what, by when, and the date we check it", "kush bën çfarë, deri kur, dhe data kur e kontrollojmë", "wer was bis wann macht, und wann wir es prüfen") },
        ] },
      ],
      note: x(
        "A practice proposed by the editors, after the five modes of Thomas and Kilmann (1974) and the three kinds of conflict in de Wit, Greer and Jehn (2012).",
        "Praktikë e propozuar nga redaksia, sipas pesë mënyrave të Thomas-it dhe Kilmann-it (1974) dhe tri llojeve të konfliktit te de Wit, Greer dhe Jehn (2012).",
        "Eine Praxis, die die Redaktion vorschlägt, nach den fünf Modi von Thomas und Kilmann (1974) und den drei Konfliktarten bei de Wit, Greer und Jehn (2012)."),
      source: ["thomas-kilmann-1974", "de-wit-2012"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
