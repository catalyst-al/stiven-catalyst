// Management Review, No. 65: The structured interview. Block: People.
// Facts and their sources: docs/revista/management-review-nr-65.md. Validities are correlations, written 0.42 / 0,42.
import { x, pc } from "../common.js";

const r = (d) => x(`0.${d}`, `0,${d}`, `0,${d}`);

export default {
  number: 65,
  block: "people",
  date: x("November 2026", "Nëntor 2026", "November 2026"),
  theme: [x("The structured interview:", "Intervista e strukturuar:", "Das strukturierte Interview:"), x("same questions, same scale", "të njëjtat pyetje, e njëjta shkallë", "gleiche Fragen, gleiche Skala")],
  sub: x(
    "How the 1998 validity figures were revised in 2022, what fell and by how much, Campion's fifteen components, a study in which random answers felt informative, how much structure research interviews use, and an interview guide.",
    "Si u rishikuan në 2022 shifrat e vlefshmërisë së 1998, çfarë ra dhe sa, pesëmbëdhjetë përbërësit e Campion-it, një studim ku përgjigjet e rastësishme dukeshin informuese, sa strukturë kanë intervistat e kërkimit, dhe një udhëzues interviste.",
    "Wie die Validitätswerte von 1998 im Jahr 2022 korrigiert wurden, was wie stark sank, Campions fünfzehn Bausteine, eine Studie, in der Zufallsantworten aufschlussreich wirkten, wie viel Struktur Interviews in der Forschung haben, und ein Leitfaden."),
  seo: x(
    "The structured interview: how Sackett et al. (2022) revised the 1998 validity figures, Campion's 15 components, a random-answer study and a guide.",
    "Intervista e strukturuar: si i rishikuan Sackett et al. (2022) shifrat e 1998, 15 përbërësit e Campion-it, një studim me përgjigje rastësore dhe një udhëzues.",
    "Das strukturierte Interview: wie Sackett et al. (2022) die Werte von 1998 korrigierten, Campions 15 Bausteine, eine Studie mit Zufallsantworten, ein Leitfaden."),
  feature: x(
    "Issue 65 follows the structured interview from the 0.51 that Frank Schmidt and John Hunter gave it in 1998 to the 0.42 of Paul Sackett and colleagues in 2022, shows how a correction for range restriction had inflated the old figures, sets the old and new estimates side by side, lists the fifteen components of structure defined by Michael Campion and colleagues, looks at a study in which interviewers felt just as informed after random answers, counts how much structure the interviews in research actually use, and ends with a guide for a structured interview.",
    "Numri 65 e ndjek intervistën e strukturuar nga 0,51 që i dhanë Frank Schmidt dhe John Hunter në 1998 te 0,42 e Paul Sackett-it dhe kolegëve në 2022, tregon si një korrigjim për kufizimin e shtrirjes i kishte fryrë shifrat e vjetra, i vë përballë vlerësimet e vjetra dhe të reja, rendit pesëmbëdhjetë përbërësit e strukturës sipas Michael Campion-it dhe kolegëve, shikon një studim ku intervistuesit u ndien po aq të informuar pas përgjigjeve të rastësishme, numëron sa strukturë përdorin në të vërtetë intervistat e kërkimit, dhe mbyllet me një udhëzues për një intervistë të strukturuar.",
    "Ausgabe 65 verfolgt das strukturierte Interview von den 0,51, die Frank Schmidt und John Hunter ihm 1998 gaben, bis zu den 0,42 von Paul Sackett und Kollegen im Jahr 2022, zeigt, wie eine Korrektur für Streuungseinschränkung die alten Werte aufgebläht hatte, stellt alte und neue Schätzungen nebeneinander, nennt die fünfzehn Bausteine der Struktur nach Michael Campion und Kollegen, betrachtet eine Studie, in der sich Interviewer nach Zufallsantworten genauso gut informiert fühlten, zählt, wie viel Struktur Interviews in der Forschung tatsächlich nutzen, und endet mit einem Leitfaden für ein strukturiertes Interview."),
  figure: { n: r("42"), by: "Sackett et al., 2022", t: x(
    "the revised validity of the structured interview for job performance: lower than the 0.51 of 1998, and now the highest of all the selection methods reviewed.",
    "vlefshmëria e rishikuar e intervistës së strukturuar për performancën në punë: më e ulët se 0,51 e 1998, dhe tani më e larta nga të gjitha metodat e përzgjedhjes së shqyrtuara.",
    "die korrigierte Validität des strukturierten Interviews für die Arbeitsleistung: niedriger als die 0,51 von 1998 und nun die höchste aller untersuchten Auswahlverfahren.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("A smaller number, still first", "Një shifër më e vogël, por ende e para", "Eine kleinere Zahl, weiter vorn") },
    { page: "research", kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: x("Confident on random answers", "Të sigurt mbi përgjigje rastësore", "Sicher trotz Zufallsantworten") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The interview guide", "Udhëzuesi i intervistës", "Der Interviewleitfaden") },
  ],
  sources: ["sint-schmidt-hunter-1998", "sint-mcdaniel-1994", "sint-sackett-2022", "sint-campion-1997", "sint-levashina-2014", "sint-dana-2013", "sint-taylor-small-2002", "sint-rework"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Almost nobody is hired without an interview, and most interviews are conversations. This issue looks at the alternative: the same job-related questions for every candidate, scored against a scale written in advance.",
        "Pothuajse askush nuk punësohet pa intervistë, dhe shumica e intervistave janë biseda. Ky numër shikon alternativën: të njëjtat pyetje për punën për çdo kandidat, të vlerësuara me një shkallë të shkruar më parë.",
        "Kaum jemand wird ohne Interview eingestellt, und die meisten Interviews sind Gespräche. Diese Ausgabe betrachtet die Alternative: dieselben berufsbezogenen Fragen für alle, bewertet nach einer vorab geschriebenen Skala."),
      body: x(
        "In 1998 Schmidt and Hunter put the validity of the structured interview at 0.51, level with tests of mental ability. In 2022 Sackett and colleagues corrected the corrections behind such figures: 0.42, now the highest, while the unstructured interview fell to 0.19. Campion's fifteen components show what structure means. A study with random answers shows why a free conversation feels better than it predicts, and a guide shows how to build an interview.",
        "Në 1998, Schmidt dhe Hunter e vunë vlefshmërinë e intervistës së strukturuar në 0,51, sa ajo e testeve të aftësisë mendore. Në 2022, Sackett dhe kolegët korrigjuan korrigjimet pas këtyre shifrave: 0,42, tani më e larta, ndërsa intervista pa strukturë ra në 0,19. Pesëmbëdhjetë përbërësit e Campion-it tregojnë çfarë do të thotë strukturë. Një studim me përgjigje të rastësishme tregon pse një bisedë e lirë duket më e dobishme nga ç'parashikon, dhe një udhëzues tregon si ndërtohet një intervistë.",
        "1998 setzten Schmidt und Hunter die Validität des strukturierten Interviews mit 0,51 an, gleichauf mit Tests der geistigen Fähigkeit. 2022 korrigierten Sackett und Kollegen die Korrekturen hinter solchen Werten: 0,42, nun der höchste Wert, während das freie Interview auf 0,19 fiel. Campions fünfzehn Bausteine zeigen, was Struktur heißt. Eine Studie mit Zufallsantworten zeigt, warum ein freies Gespräch nützlicher wirkt, als es vorhersagt, und ein Leitfaden zeigt, wie man ein Interview aufbaut."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("A smaller number,", "Një shifër më e vogël,", "Eine kleinere Zahl,"), x("still first", "por ende e para", "weiter vorn")],
      lead: x(
        "In 1998 Frank Schmidt and John Hunter summed up 85 years of research on hiring. The structured interview predicted job performance as well as a test of general mental ability: 0.51. In 2022 Paul Sackett and colleagues went back over the evidence. The structured interview fell to 0.42, and came out on top.",
        "Në 1998, Frank Schmidt dhe John Hunter përmblodhën 85 vjet kërkim për punësimin. Intervista e strukturuar e parashikonte performancën në punë po aq mirë sa një test i aftësisë së përgjithshme mendore: 0,51. Në 2022, Paul Sackett dhe kolegët i rishikuan provat. Intervista e strukturuar ra në 0,42, dhe doli e para.",
        "1998 fassten Frank Schmidt und John Hunter 85 Jahre Forschung zur Personalauswahl zusammen. Das strukturierte Interview sagte die Arbeitsleistung so gut voraus wie ein Test der allgemeinen geistigen Fähigkeit: 0,51. 2022 prüften Paul Sackett und Kollegen die Belege neu. Das strukturierte Interview fiel auf 0,42 und landete auf Platz eins."),
      blocks: [
        { type: "figures", compact: true, items: [
          { n: r("28"), t: x("observed in the studies behind the 1998 figure", "e vëzhguar në studimet pas shifrës së 1998", "beobachtet in den Studien hinter dem Wert von 1998") },
          { n: r("37"), t: x("corrected for unreliable performance ratings", "e korrigjuar për vlerësimet e pasakta të performancës", "korrigiert um unzuverlässige Leistungsurteile") },
          { n: r("51"), t: x("also corrected for range restriction, the step Sackett et al. dropped", "e korrigjuar edhe për kufizimin e shtrirjes, hapi që hoqën Sackett et al.", "auch um Streuungseinschränkung korrigiert, den Schritt strichen Sackett et al.") },
        ] },
        { type: "p", text: x(
          "That correction assumes the people studied were selected on the method, so their scores vary less than applicants'. Many studies tested employees never hired on that interview; correcting them anyway inflated the figures. The authors kept 0.37, added a newer meta-analysis (0.45) and arrived at 0.42.",
          "Ky korrigjim supozon se të studiuarit ishin përzgjedhur me atë metodë, ndaj pikët e tyre ndryshojnë më pak se të kandidatëve. Shumë studime testuan punonjës që s'ishin punësuar me atë intervistë; korrigjimi i tyre i fryu shifrat. Autorët mbajtën 0,37, shtuan një meta-analizë më të re (0,45) dhe arritën te 0,42.",
          "Diese Korrektur unterstellt, dass die Untersuchten nach dem Verfahren ausgewählt waren und daher weniger streuen als Bewerber. Viele Studien testeten aber Beschäftigte, die nie über dieses Interview eingestellt wurden; sie zu korrigieren, blähte die Werte auf. Die Autoren behielten 0,37, nahmen eine neuere Metaanalyse (0,45) hinzu und kamen auf 0,42.") },
        { type: "quote", text: x(
          "Our field's selection procedures are still valid, just not as valid as we thought they were.",
          "Procedurat e përzgjedhjes në fushën tonë janë ende të vlefshme, thjesht jo aq sa mendonim.",
          "Die Auswahlverfahren unseres Fachs sind weiterhin valide, nur nicht so valide, wie wir dachten.") },
        { type: "callout", reading: true, text: x(
          "The revision did not change the advice. It changed the size of the promise: a good interview helps you choose, it does not see through people.",
          "Rishikimi nuk e ndryshoi këshillën. Ndryshoi madhësinë e premtimit: një intervistë e mirë të ndihmon të zgjedhësh, nuk i sheh njerëzit tejpërtej.",
          "Die Korrektur änderte nicht den Rat, sondern die Größe des Versprechens: Ein gutes Interview hilft bei der Wahl, es durchschaut keine Menschen.") },
      ],
      note: x(
        "Validity: the correlation between a method's score and later job performance (0 none, 1 perfect). The steps are as Sackett et al. describe the 1998 source, McDaniel et al. (1994). The quote is theirs.",
        "Vlefshmëria: korrelacioni mes pikëve të një metode dhe performancës së mëvonshme në punë (0 asnjë, 1 i përsosur). Hapat janë si i përshkruajnë Sackett et al. burimin e 1998, McDaniel et al. (1994). Citimi është i tyre.",
        "Validität: die Korrelation zwischen dem Wert eines Verfahrens und der späteren Arbeitsleistung (0 keine, 1 perfekt). Die Schritte beschreiben Sackett et al. für die Quelle von 1998, McDaniel et al. (1994). Das Zitat stammt von ihnen."),
      source: ["sint-schmidt-hunter-1998", "sint-mcdaniel-1994", "sint-sackett-2022"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("What fell,", "Çfarë ra,", "Was gesunken ist"), x("and by how much", "dhe sa", "und wie stark")],
      lead: x(
        "Sackett and colleagues set their estimates next to those of 1998. Most methods that ranked high then still do, but 0.10 to 0.20 lower. The unstructured interview was halved.",
        "Sackett dhe kolegët i vunë vlerësimet e tyre pranë atyre të 1998. Shumica e metodave që renditeshin lart atëherë renditen ende lart, por 0,10 deri në 0,20 më poshtë. Intervista pa strukturë u përgjysmua.",
        "Sackett und Kollegen stellten ihre Schätzungen denen von 1998 gegenüber. Die meisten Verfahren, die damals weit oben lagen, liegen dort noch, aber 0,10 bis 0,20 niedriger. Das freie Interview halbierte sich."),
      blocks: [
        { type: "dumbbell", from: "1998", to: "2022", min: 0, max: 60, rowH: 24, source: ["sint-sackett-2022", "sint-schmidt-hunter-1998"],
          label: x("Validity for job performance, 1998 and 2022 estimates", "Vlefshmëria për performancën në punë, vlerësimet e 1998 dhe 2022", "Validität für die Arbeitsleistung, Schätzungen von 1998 und 2022"),
          rows: [
            { k: x("Structured interview", "Intervistë me strukturë", "Strukturiertes Interview"), a: 51, an: r("51"), b: 42, bn: r("42"), alert: true },
            { k: x("Job knowledge test", "Test i njohurive", "Fachwissenstest"), a: 48, an: r("48"), b: 40, bn: r("40") },
            { k: x("Work sample test", "Provë pune", "Arbeitsprobe"), a: 54, an: r("54"), b: 33, bn: r("33") },
            { k: x("Mental ability test", "Test kognitiv", "Kognitiver Test"), a: 51, an: r("51"), b: 31, bn: r("31") },
            { k: x("Unstructured interview", "Intervistë pa strukturë", "Freies Interview"), a: 38, an: r("38"), b: 19, bn: r("19") },
          ] },
        { type: "p", text: x(
          "The four strongest in 2022 all measure the job itself. Of the four, the structured interview varies most between studies: in about one setting in ten it falls below 0.18.",
          "Katër më të fortët në 2022 e matin të gjithë vetë punën. Nga të katër, intervista e strukturuar ndryshon më shumë nga studimi në studim: në rreth një rast nga dhjetë bie nën 0,18.",
          "Die vier stärksten von 2022 messen alle die Arbeit selbst. Von den vieren schwankt das strukturierte Interview am stärksten zwischen Studien: In etwa einem von zehn Fällen liegt es unter 0,18.") },
        { type: "callout", reading: true, text: x(
          "On average the method is at the top. Whether your interview is depends on how it is built.",
          "Mesatarisht metoda është në krye. Nëse është edhe intervista jote, varet nga si është ndërtuar.",
          "Im Schnitt steht das Verfahren an der Spitze. Ob Ihr Interview dort steht, hängt davon ab, wie es gebaut ist.") },
      ],
      note: x(
        "Mean estimates from the comparison table in Sackett et al. (2022). The four strongest include biodata (0.38), not shown. 0.18: lower end of the 80% credibility interval.",
        "Vlerësime mesatare nga tabela krahasuese te Sackett et al. (2022). Te katër më të fortët janë edhe të dhënat biografike (0,38), që nuk shfaqen. 0,18: kufiri i poshtëm i intervalit të besueshmërisë 80%.",
        "Mittelwerte aus der Vergleichstabelle bei Sackett et al. (2022). Zu den vier stärksten zählen auch biografische Daten (0,38), nicht abgebildet. 0,18: Untergrenze des 80-%-Glaubwürdigkeitsintervalls."),
      source: ["sint-sackett-2022", "sint-schmidt-hunter-1998"],
    },
    {
      id: "model",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Fifteen ways", "Pesëmbëdhjetë mënyra", "Fünfzehn Wege"), x("to add structure", "për të shtuar strukturë", "zu mehr Struktur")],
      lead: x(
        "Structure is not one thing. In 1997 Michael Campion, David Palmer and James Campion defined it as any enhancement that makes an interview more standard, or helps the interviewer decide what to ask and how to judge the answers. They listed fifteen components in two groups.",
        "Struktura nuk është një gjë e vetme. Në 1997, Michael Campion, David Palmer dhe James Campion e përkufizuan si çdo përmirësim që e bën intervistën më standarde, ose që e ndihmon intervistuesin të vendosë çfarë të pyesë dhe si t'i vlerësojë përgjigjet. Ata renditën pesëmbëdhjetë përbërës në dy grupe.",
        "Struktur ist nicht eine einzige Sache. 1997 definierten Michael Campion, David Palmer und James Campion sie als jede Verbesserung, die ein Interview einheitlicher macht oder dem Interviewer hilft zu entscheiden, was er fragt und wie er die Antworten bewertet. Sie nannten fünfzehn Bausteine in zwei Gruppen."),
      blocks: [
        { type: "lists", cols: [
          { h: x("Content", "Përmbajtja", "Inhalt"), items: [
            x("Questions from a job analysis", "Pyetje nga analiza e punës", "Fragen aus einer Arbeitsanalyse"),
            x("The same questions for everyone", "Të njëjtat pyetje për të gjithë", "Dieselben Fragen für alle"),
            x("Limited prompting and follow-up", "Pak nxitje dhe pyetje shtesë", "Wenig Nachhaken und Nachfragen"),
            x("Better types of questions", "Lloje më të mira pyetjesh", "Bessere Fragetypen"),
            x("More questions, a longer interview", "Më shumë pyetje, intervistë më e gjatë", "Mehr Fragen, längeres Interview"),
            x("Control of other information", "Kontroll i informacionit tjetër", "Kontrolle anderer Informationen"),
            x("Candidate's questions at the end", "Pyetjet e kandidatit në fund", "Fragen des Bewerbers am Ende"),
          ] },
          { h: x("Evaluation", "Vlerësimi", "Bewertung"), accent: true, items: [
            x("A rating for each answer", "Një notë për çdo përgjigje", "Eine Bewertung je Antwort"),
            x("Anchored rating scales", "Shkallë me ankora", "Verankerte Skalen"),
            x("Detailed notes", "Shënime të hollësishme", "Ausführliche Notizen"),
            x("Several interviewers", "Disa intervistues", "Mehrere Interviewer"),
            x("The same interviewers for all", "Të njëjtët intervistues për të gjithë", "Dieselben Interviewer für alle"),
            x("No discussion between interviews", "Pa diskutim mes intervistave", "Kein Austausch zwischen Interviews"),
            x("Interviewer training", "Trajnim i intervistuesve", "Schulung der Interviewer"),
            x("Combining scores by formula", "Bashkimi i pikëve me formulë", "Werte per Formel verrechnen"),
          ] },
        ] },
        { type: "p", text: x(
          "The two question types studied most both predict performance: situational questions (“what would you do if…”) tend to measure job knowledge, past-behaviour questions (“tell me about a time…”) experience.",
          "Dy llojet e pyetjeve më të studiuara e parashikojnë të dyja performancën: pyetjet situative (“çfarë do të bëje nëse…”) priren të matin njohuritë për punën, pyetjet për sjelljen e kaluar (“më trego për një rast kur…”) përvojën.",
          "Die zwei am meisten untersuchten Fragetypen sagen beide Leistung vorher: Situative Fragen („Was würden Sie tun, wenn …“) messen eher Fachwissen, Fragen zu früherem Verhalten („Erzählen Sie von einer Situation, in der …“) eher Erfahrung.") },
        { type: "callout", reading: true, text: x(
          "Each component moves a decision from the mood of the moment into the guide.",
          "Çdo përbërës e nxjerr një vendim nga humori i çastit dhe e fut në udhëzues.",
          "Jeder Baustein holt eine Entscheidung aus der Stimmung in den Leitfaden.") },
      ],
      note: x(
        "Labels shortened. In 2014 Levashina et al. had 30 selection experts sort the fifteen; 14 fell into Campion's groups. They propose three more: limiting small talk, telling candidates what is assessed, recording interviews.",
        "Emërtime të shkurtuara. Në 2014, te Levashina et al., 30 ekspertë të përzgjedhjes i ndanë të 15-at; 14 ranë te grupet e Campion-it. Shtojnë tre: pak bisedë e lirë, kandidatët dinë çfarë vlerësohet, intervistat regjistrohen.",
        "Bezeichnungen gekürzt. 2014 ließen Levashina et al. 30 Auswahlfachleute die 15 zuordnen; 14 davon in Campions Gruppen. Sie ergänzen drei: wenig Smalltalk, Bewerbern sagen, was bewertet wird, Interviews aufzeichnen."),
      source: ["sint-campion-1997", "sint-levashina-2014"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("Confident on", "Të sigurt mbi", "Sicher trotz"), x("random answers", "përgjigje rastësore", "Zufallsantworten")],
      lead: x(
        "Jason Dana, Robyn Dawes and Nathanial Peterson asked 76 students to predict another student's grades for a semester. They were given the earlier grade average; they also held a 20-minute unstructured interview. In one condition, the student interviewed secretly answered at random after the break.",
        "Jason Dana, Robyn Dawes dhe Nathanial Peterson u kërkuan 76 studentëve të parashikonin notat e një studenti tjetër për një semestër. Ata e kishin mesataren e mëparshme të notave; bënë edhe një intervistë 20-minutëshe pa strukturë. Në një variant, studenti i intervistuar përgjigjej fshehurazi rastësisht pas pushimit.",
        "Jason Dana, Robyn Dawes und Nathanial Peterson ließen 76 Studierende die Semesternoten eines anderen Studierenden vorhersagen. Sie kannten den bisherigen Notenschnitt und führten zusätzlich ein 20-minütiges freies Interview. In einer Variante antwortete der Befragte nach der Pause heimlich nach dem Zufall."),
      blocks: [
        { type: "columns", max: 70, height: 110, source: ["sint-dana-2013"],
          label: x("How well predictions matched the grades (correlation), Study 1", "Sa përputheshin parashikimet me notat (korrelacioni), studimi 1", "Wie gut die Vorhersagen zu den Noten passten (Korrelation), Studie 1"),
          items: [
            { k: x("Earlier grades alone", "Vetëm notat e mëparshme", "Nur frühere Noten"), v: 65, n: r("65") },
            { k: x("Without interview", "Pa intervistë", "Ohne Interview"), v: 61, n: r("61") },
            { k: x("With interview", "Me intervistë", "Mit Interview"), v: 31, n: r("31"), alert: true },
          ] },
        { type: "p", text: x(
          "Those who had heard random answers said they had learned as much as the others. In a third study, 96 of 169 students (57%) said they would rather have a random interview than none.",
          "Ata që kishin dëgjuar përgjigje të rastësishme thanë se kishin mësuar po aq sa të tjerët. Në një studim të tretë, 96 nga 169 studentë (57%) thanë se do të parapëlqenin një intervistë të rastësishme se asnjë.",
          "Wer Zufallsantworten gehört hatte, gab an, genauso viel erfahren zu haben wie die anderen. In einer dritten Studie zogen 96 von 169 Studierenden (57 %) ein Zufallsinterview gar keinem vor.") },
        { type: "callout", reading: true, text: x(
          "An interview always feels informative. The feeling is not evidence; the score against the job is.",
          "Një intervistë duket gjithmonë informuese. Ndjesia nuk është provë; prova është vlerësimi kundrejt punës.",
          "Ein Interview fühlt sich immer aufschlussreich an. Das Gefühl ist kein Beleg, die Bewertung am Maßstab der Arbeit schon.") },
      ],
      note: x(
        "Students predicting grades, not managers hiring, and the interviews were unstructured. The study shows how an interview can feel useful and still lower accuracy, not how much it does so at work.",
        "Studentë që parashikonin nota, jo menaxherë që punësonin, dhe intervistat ishin pa strukturë. Studimi tregon si një intervistë mund të duket e dobishme dhe prapë ta ulë saktësinë, jo sa e ul në punë.",
        "Studierende sagten Noten voraus, keine Führungskräfte stellten ein, und die Interviews waren frei. Die Studie zeigt, wie ein Interview nützlich wirken und doch die Treffsicherheit senken kann, nicht wie stark im Beruf."),
      source: ["sint-dana-2013"],
    },
    {
      id: "measure", more: "leading-people-without-losing-the-person",
      kicker: x("How it is measured", "Si matet", "Wie man es misst"),
      title: [x("Count the parts,", "Numëro pjesët,", "Bausteine zählen,"), x("score each answer", "vlerëso çdo përgjigje", "jede Antwort bewerten")],
      lead: x(
        "Levashina and colleagues counted the components in 104 interviews described in research from 1997 to 2010. On average they used six of the fifteen. Some were common, others almost never used.",
        "Levashina dhe kolegët numëruan përbërësit në 104 intervista të përshkruara në kërkime nga 1997 deri në 2010. Mesatarisht përdornin gjashtë nga pesëmbëdhjetë. Disa ishin të zakonshëm, të tjerë pothuajse kurrë.",
        "Levashina und Kollegen zählten die Bausteine in 104 Interviews, die in Studien von 1997 bis 2010 beschrieben sind. Im Schnitt nutzten sie sechs der fünfzehn. Manche waren üblich, andere fehlten fast immer."),
      blocks: [
        { type: "hbars", source: ["sint-levashina-2014"],
          label: x("Share of 104 interviews in research, 1997–2010, using each component", "Pjesa e 104 intervistave në kërkime, 1997–2010, që përdornin secilin përbërës", "Anteil von 104 Interviews in Studien, 1997–2010, mit dem jeweiligen Baustein"),
          items: [
            { k: x("The same questions for everyone", "Të njëjtat pyetje për të gjithë", "Dieselben Fragen für alle"), v: 74, n: pc(74) },
            { k: x("Questions from a job analysis", "Pyetje nga analiza e punës", "Fragen aus einer Arbeitsanalyse"), v: 71, n: pc(71) },
            { k: x("Anchored rating scales", "Shkallë me ankora", "Verankerte Skalen"), v: 66, n: pc(66) },
            { k: x("Interviewer training", "Trajnim i intervistuesve", "Schulung der Interviewer"), v: 52, n: pc(52) },
            { k: x("Detailed notes", "Shënime të hollësishme", "Ausführliche Notizen"), v: 19, n: pc(19) },
            { k: x("No discussion between interviews", "Pa diskutim mes intervistave", "Kein Austausch zwischen Interviews"), v: 4, n: pc(4), alert: true },
          ] },
        { type: "p", text: x(
          "Anchors pay. Across 19 studies of past-behaviour interviews, Taylor and Small (2002) found a validity of 0.35 with anchored scales and 0.26 without, and slightly closer agreement between interviewers (0.77 against 0.73).",
          "Ankorat shpërblejnë. Në 19 studime të intervistave për sjelljen e kaluar, Taylor dhe Small (2002) gjetën vlefshmëri 0,35 me shkallë me ankora dhe 0,26 pa to, si dhe pak më shumë përputhje mes intervistuesve (0,77 kundrejt 0,73).",
          "Anker zahlen sich aus. Über 19 Studien zu Interviews über früheres Verhalten fanden Taylor und Small (2002) eine Validität von 0,35 mit verankerten Skalen und 0,26 ohne, dazu etwas mehr Übereinstimmung zwischen Interviewern (0,77 gegenüber 0,73).") },
      ],
      note: x(
        "Counts from the content analysis by Levashina et al. (2014), of interviews described in research, not a survey of employers. Taylor and Small's figures as Levashina et al. report them.",
        "Numrat vijnë nga analiza e përmbajtjes te Levashina et al. (2014), për intervista të përshkruara në kërkime, jo nga një anketë me punëdhënës. Shifrat e Taylor-it dhe Small-it, siç i japin Levashina et al.",
        "Zahlen aus der Inhaltsanalyse von Levashina et al. (2014), zu Interviews in Studien, keine Umfrage unter Arbeitgebern. Die Werte von Taylor und Small so, wie Levashina et al. sie angeben."),
      source: ["sint-levashina-2014", "sint-taylor-small-2002"],
    },
    {
      id: "tool", tool: "/tools/ats-cv/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The structured", "Udhëzuesi i", "Der Leitfaden"), x("interview guide", "intervistës", "fürs Interview")],
      lead: x(
        "One guide per role, used for every candidate. Write the questions and the anchors before the first interview, score each answer on its own, and only then talk with the other interviewers.",
        "Një udhëzues për çdo rol, i njëjti për çdo kandidat. Shkruaji pyetjet dhe ankorat para intervistës së parë, vlerëso çdo përgjigje më vete, dhe vetëm pastaj fol me intervistuesit e tjerë.",
        "Ein Leitfaden je Rolle, für alle Bewerber gleich. Fragen und Anker vor dem ersten Interview schreiben, jede Antwort einzeln bewerten und erst danach mit den anderen Interviewern sprechen."),
      blocks: [
        { type: "form", items: [
          { h: x("Role and what it needs", "Roli dhe çfarë kërkon", "Rolle und Anforderungen"), hint: x("four to six things the job needs, from those who do it", "4–6 gjëra që kërkon puna, sipas atyre që e bëjnë", "vier bis sechs Anforderungen, von denen, die die Arbeit machen") },
          { h: x("Questions", "Pyetjet", "Fragen"), hint: x("per need, one “tell me about a time” and one “what would you do”; same order for all", "për secilën, një “më trego për një rast” dhe një “çfarë do të bëje”; e njëjta radhë", "je Anforderung eine Frage zu früherem Verhalten und eine situative; gleiche Reihenfolge für alle"), lines: 2 },
          { h: x("Anchors", "Ankorat", "Anker"), hint: x("what a 1, 3 and 5 answer sounds like, written in advance", "si tingëllon një përgjigje 1, 3 dhe 5, e shkruar më parë", "wie eine Antwort für 1, 3 und 5 klingt, vorab geschrieben") },
          { h: x("Follow-up", "Pyetjet shtesë", "Nachfragen"), hint: x("planned and neutral, the same for every candidate", "të planifikuara dhe neutrale, të njëjtat për çdo kandidat", "geplant und neutral, für alle gleich") },
          { h: x("Notes and score", "Shënimet dhe nota", "Notizen und Wertung"), hint: x("what was said, not impressions; score 1–5 after each answer", "çfarë u tha, jo përshtypje; notë 1–5 pas çdo përgjigjeje", "was gesagt wurde, keine Eindrücke; 1–5 nach jeder Antwort") },
          { h: x("Independent scoring", "Vlerësimi i pavarur", "Unabhängige Wertung"), hint: x("each interviewer scores alone; discuss only when all scores are in", "secili intervistues vlerëson vetëm; diskutoni vetëm kur të jenë të gjitha notat", "jeder wertet allein; Austausch erst, wenn alle Wertungen vorliegen") },
        ] },
      ],
      note: x(
        "A practice proposed by the editors, after Campion et al.'s components and Levashina et al.'s advice to probe only with planned, neutral follow-ups. Google's re:Work guide describes rubrics with examples of poor, borderline, solid and outstanding answers.",
        "Praktikë e propozuar nga redaksia, sipas përbërësve të Campion-it dhe këshillës së Levashina-s për pyetje shtesë të planifikuara e neutrale. Udhëzuesi re:Work i Google-it përshkruan rubrika me shembuj përgjigjesh të dobëta, në kufi, të mira dhe të shkëlqyera.",
        "Eine Praxis, die die Redaktion vorschlägt, nach Campions Bausteinen und dem Rat von Levashina et al., nur geplant und neutral nachzufragen. Googles re:Work-Leitfaden beschreibt Bewertungsraster mit Beispielen schwacher, knapper, solider und herausragender Antworten."),
      source: ["sint-campion-1997", "sint-levashina-2014", "sint-rework"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
