// Management Review, No. 101: Listening, what a manager's listening changes for the speaker and for the work, and
// what good listening looks like in practice. Block: Role. Facts and their sources: docs/revista/management-review-nr-101.md.
// Three papers were read in full: the meta-analysis of Kluger, Lehmann, Aguinis et al. (2024, Journal of Business and
// Psychology, open access, the published PDF), the interview study of Kriz, Kluger & Lyddy (2021, Frontiers in
// Psychology, Europe PMC) and the practice article of Itzchakov & Grau (2022, Organizational Dynamics, PubMed Central).
// Kluger & Itzchakov's review (2022, Annual Review) could not be opened and is not used.
// The coach is No. 11, feedback No. 19 (Kluger & DeNisi), asking for advice No. 91, silence the treatise's volume 7.
import { x } from "../common.js";

// "0.51" in English, "0,51" in Albanian and German.
const dec = (n) => x(n, n.replace(".", ","), n.replace(".", ","));

export default {
  number: 101,
  block: "role",
  date: x("November 2026", "Nëntor 2026", "November 2026"),
  theme: [x("Listening:", "Të dëgjosh:", "Zuhören:"), x("what the other person takes away", "çfarë merr tjetri me vete", "was der andere mitnimmt")],
  sub: x(
    "What a manager's listening is linked to at work, how strong the evidence really is, the three parts of good listening, why a conversation can be undone by what happens after it, and a card for the follow-up.",
    "Me çfarë lidhet dëgjimi i menaxherit në punë, sa e fortë është vërtet prova, tri pjesët e dëgjimit të mirë, pse një bisedë mund të prishet nga ajo që ndodh pas saj, dhe një kartë për vazhdimin.",
    "Womit das Zuhören einer Führungskraft bei der Arbeit zusammenhängt, wie stark die Belege wirklich sind, die drei Teile guten Zuhörens, warum ein Gespräch durch das danach zunichtegemacht werden kann, und eine Karte für die Nacharbeit."),
  seo: x(
    "Listening at work: a meta-analysis of 664 effects, 81 stories of feeling heard or unheard in a bank, the three parts of good listening and a follow-up card.",
    "Dëgjimi në punë: një meta-analizë me 664 efekte, 81 histori nga një bankë, tri pjesët e dëgjimit të mirë dhe një kartë për vazhdimin.",
    "Zuhören bei der Arbeit: eine Metaanalyse mit 664 Effekten, 81 Geschichten aus einer Bank, die drei Teile guten Zuhörens und eine Karte für die Nacharbeit."),
  feature: x(
    "Managers are trained to present, to decide and to give feedback. Listening is rarely trained, and many think they already do it well. Issue 101 reads a meta-analysis of 664 effects on what feeling listened to is linked to at work, and how much of that holds once the self-reports are set aside. It then follows 81 stories told by bank employees, in which a good conversation was often undone by what did not happen after it, and ends with a card for the follow-up.",
    "Menaxherët mësohen të prezantojnë, të vendosin dhe të japin feedback. Dëgjimi rrallë mësohet, dhe shumë mendojnë se e bëjnë tashmë mirë. Numri 101 lexon një meta-analizë me 664 efekte për atë me çfarë lidhet në punë ndjenja se të dëgjojnë, dhe sa prej saj mbetet kur lihen mënjanë vetëvlerësimet. Pastaj ndjek 81 histori të treguara nga punonjës banke, ku një bisedë e mirë shpesh u prish nga ajo që nuk ndodhi pas saj, dhe mbyllet me një kartë për vazhdimin.",
    "Führungskräfte lernen zu präsentieren, zu entscheiden und Feedback zu geben. Zuhören wird selten trainiert, und viele glauben, es schon gut zu können. Ausgabe 101 liest eine Metaanalyse mit 664 Effekten dazu, womit das Gefühl, gehört zu werden, bei der Arbeit zusammenhängt, und wie viel davon bleibt, wenn man die Selbstauskünfte beiseitelässt. Dann folgt sie 81 Geschichten von Bankbeschäftigten, in denen ein gutes Gespräch oft durch das zunichtegemacht wurde, was danach nicht geschah, und endet mit einer Karte für die Nacharbeit."),
  figure: { n: x("66 of 81", "66 nga 81", "66 von 81"), by: "Kriz, Kluger & Lyddy, 2021", t: x(
    "stories of being heard or unheard at work were about an employee trying to do good work: an idea, a concern, a suggestion.",
    "histori për të qenë i dëgjuar ose jo në punë ishin për një punonjës që përpiqej të bënte punë të mirë: një ide, një shqetësim, një sugjerim.",
    "Geschichten über Gehört- oder Nichtgehörtwerden bei der Arbeit handelten von Beschäftigten, die gute Arbeit leisten wollten: eine Idee, eine Sorge, ein Vorschlag.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("What listening is linked to", "Me çfarë lidhet dëgjimi", "Womit Zuhören zusammenhängt") },
    { page: "research", kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: x("81 stories from a bank", "81 histori nga një bankë", "81 Geschichten aus einer Bank") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The follow-up card", "Karta e vazhdimit", "Die Karte für die Nacharbeit") },
  ],
  sources: ["listen-kluger-2024", "listen-kriz-2021", "listen-itzchakov-grau-2022"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Most of what a manager learns is about talking: presenting, deciding, giving feedback. Listening is treated as something everyone can already do. This issue asks what a manager's listening actually changes, for the person speaking and for the work, and what the speaker needs to see before they feel heard.",
        "Shumica e asaj që mëson një menaxher ka të bëjë me të folurin: të prezantosh, të vendosësh, të japësh feedback. Dëgjimi trajtohet si diçka që të gjithë e dinë. Ky numër pyet çfarë ndryshon në të vërtetë dëgjimi i menaxherit, për atë që flet dhe për punën, dhe çfarë duhet të shohë ai që flet para se të ndihet i dëgjuar.",
        "Das meiste, was eine Führungskraft lernt, betrifft das Reden: präsentieren, entscheiden, Feedback geben. Zuhören gilt als etwas, das alle schon können. Diese Ausgabe fragt, was das Zuhören einer Führungskraft tatsächlich verändert, für die Person, die spricht, und für die Arbeit, und was die sprechende Person sehen muss, bevor sie sich gehört fühlt."),
      body: x(
        "Across 664 effects, feeling listened to at work went with better outcomes, most of all with the quality of the relationship (0.51). Three quarters of the data were self-reports; with other sources the link is weaker but remains. Good listening has three parts: attention, comprehension and acceptance. In 81 stories from a bank, attention alone was rarely enough: people felt unheard when the expected follow-up never came. A card for the follow-up closes the issue.",
        "Në 664 efekte, ndjenja se të dëgjojnë në punë shkonte bashkë me rezultate më të mira, mbi të gjitha me cilësinë e marrëdhënies (0,51). Tri të katërtat e të dhënave ishin vetëvlerësime; me burime të tjera lidhja është më e dobët, por mbetet. Dëgjimi i mirë ka tri pjesë: vëmendjen, kuptimin dhe pranimin. Në 81 histori nga një bankë, vëmendja vetëm rrallë mjaftoi: njerëzit u ndien të padëgjuar kur vazhdimi i pritur nuk erdhi kurrë. Një kartë për vazhdimin e mbyll numrin.",
        "Über 664 Effekte hinweg ging das Gefühl, bei der Arbeit gehört zu werden, mit besseren Ergebnissen einher, am stärksten mit der Qualität der Beziehung (0,51). Drei Viertel der Daten waren Selbstauskünfte; mit anderen Quellen ist der Zusammenhang schwächer, bleibt aber. Gutes Zuhören hat drei Teile: Aufmerksamkeit, Verstehen und Annahme. In 81 Geschichten aus einer Bank reichte Aufmerksamkeit allein selten: Menschen fühlten sich ungehört, wenn die erwartete Nacharbeit nie kam. Eine Karte für die Nacharbeit schließt die Ausgabe."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("What listening", "Me çfarë lidhet", "Womit Zuhören"), x("is linked to", "dëgjimi", "zusammenhängt")],
      lead: x(
        "Avraham Kluger, Herman Aguinis, Guy Itzchakov and colleagues gathered 664 effects from 144 samples, 400,020 observations in all, on how the speaker's sense of being listened to relates to outcomes at work. Managers were the listeners in 36% of the effects, salespeople in 21%. The average correlation was 0.39.",
        "Avraham Kluger, Herman Aguinis, Guy Itzchakov dhe kolegët mblodhën 664 efekte nga 144 mostra, gjithsej 400.020 vëzhgime, për mënyrën si lidhet ndjenja e atij që flet se e dëgjojnë me rezultatet në punë. Menaxherët ishin dëgjuesit në 36% të efekteve, shitësit në 21%. Korrelacioni mesatar ishte 0,39.",
        "Avraham Kluger, Herman Aguinis, Guy Itzchakov und Kollegen sammelten 664 Effekte aus 144 Stichproben, insgesamt 400.020 Beobachtungen, dazu, wie das Gefühl der sprechenden Person, gehört zu werden, mit Ergebnissen bei der Arbeit zusammenhängt. Führungskräfte waren in 36 % der Effekte die Zuhörenden, Verkäufer in 21 %. Die mittlere Korrelation lag bei 0,39."),
      blocks: [
        { type: "columns", max: 0.6, height: 104, source: ["listen-kluger-2024"],
          label: x("Average correlation with perceived listening, by kind of outcome (2024)", "Korrelacioni mesatar me dëgjimin e perceptuar, sipas llojit të rezultatit (2024)", "Mittlere Korrelation mit wahrgenommenem Zuhören, nach Art des Ergebnisses (2024)"),
          items: [
            { k: x("Relationship", "Marrëdhënia", "Beziehung"), v: 0.51, n: dec("0.51"), alert: true },
            { k: x("Thinking", "Të menduarit", "Denken"), v: 0.40, n: dec("0.40") },
            { k: x("Feelings", "Ndjenjat", "Gefühle"), v: 0.36, n: dec("0.36") },
            { k: x("Performance", "Performanca", "Leistung"), v: 0.36, n: dec("0.36") },
          ] },
        { type: "p", text: x(
          "Relationship covers trust, liking and satisfaction with the relationship; thinking includes knowledge and a more balanced view of a topic; feelings include job satisfaction and commitment. The authors' reading: listening may lift performance mainly by building the relationship.",
          "Marrëdhënia përfshin besimin, pëlqimin dhe kënaqësinë me marrëdhënien; të menduarit përfshin njohurinë dhe një pamje më të ekuilibruar të një teme; ndjenjat përfshijnë kënaqësinë në punë dhe përkushtimin. Leximi i autorëve: dëgjimi mund ta ngrejë performancën kryesisht duke ndërtuar marrëdhënien.",
          "Beziehung umfasst Vertrauen, Sympathie und Zufriedenheit mit der Beziehung; Denken umfasst Wissen und einen ausgewogeneren Blick auf ein Thema; Gefühle umfassen Arbeitszufriedenheit und Bindung an die Arbeit. Die Lesart der Autoren: Zuhören könnte die Leistung vor allem über die Beziehung heben.") },
        { type: "callout", reading: true, text: x(
          "The strongest link is with the relationship itself. People work better with someone they trust, and they trust the one who listens.",
          "Lidhja më e fortë është me vetë marrëdhënien. Njerëzit punojnë më mirë me dikë të cilit i besojnë, dhe i besojnë atij që dëgjon.",
          "Der stärkste Zusammenhang besteht mit der Beziehung selbst. Menschen arbeiten besser mit jemandem, dem sie vertrauen, und sie vertrauen dem, der zuhört.") },
      ],
      note: x(
        "Kluger et al. (2024), three-level meta-analysis, table 5; correlations weighted by sample, not corrected for reliability. Most data are surveys at one moment, so they show association, not cause. Feedback, the talking side, is in No. 19.",
        "Kluger et al. (2024), meta-analizë me tri nivele, tabela 5; korrelacione të peshuara sipas mostrës, pa korrigjim për besueshmërinë. Shumica e të dhënave janë anketa në një moment, prandaj tregojnë lidhje, jo shkak. Feedback-u, ana e të folurit, është te Nr. 19.",
        "Kluger et al. (2024), dreistufige Metaanalyse, Tabelle 5; nach Stichprobe gewichtete Korrelationen, nicht um die Reliabilität korrigiert. Die meisten Daten sind Befragungen zu einem Zeitpunkt; sie zeigen Zusammenhang, nicht Ursache. Feedback, die redende Seite, steht in Nr. 19."),
      source: ["listen-kluger-2024"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("How strong,", "Sa e fortë,", "Wie stark,"), x("honestly", "me ndershmëri", "ehrlich gesagt")],
      lead: x(
        "In 75% of the effects one person answered one questionnaire about both the listening and the outcome. That inflates a correlation. The meta-analysis therefore compared studies by how the two were measured, and the link shrinks, though it does not vanish.",
        "Në 75% të efekteve një person iu përgjigj një pyetësori të vetëm si për dëgjimin, ashtu edhe për rezultatin. Kjo e fryn një korrelacion. Prandaj meta-analiza i krahasoi studimet sipas mënyrës si u matën të dyja, dhe lidhja zvogëlohet, por nuk zhduket.",
        "In 75 % der Effekte beantwortete eine Person einen einzigen Fragebogen zum Zuhören und zum Ergebnis zugleich. Das bläht eine Korrelation auf. Die Metaanalyse verglich die Studien daher danach, wie beides gemessen wurde, und der Zusammenhang schrumpft, verschwindet aber nicht."),
      blocks: [
        { type: "pairs", from: x("Easier design", "Plan më i lehtë", "Einfacheres Design"), to: x("Stricter design", "Plan më i rreptë", "Strengeres Design"), max: 0.5, source: ["listen-kluger-2024"],
          label: x("Average correlation of listening with work outcomes, by study design (2024)", "Korrelacioni mesatar i dëgjimit me rezultatet në punë, sipas planit të studimit (2024)", "Mittlere Korrelation von Zuhören mit Arbeitsergebnissen, nach Studiendesign (2024)"),
          rows: [
            { k: x("One source vs. two sources", "Një burim kundrejt dy burimeve", "Eine Quelle gegen zwei Quellen"), a: 0.43, an: dec("0.43"), b: 0.26, bn: dec("0.26"), alert: true },
            { k: x("Same time vs. outcome later", "Në të njëjtën kohë kundrejt rezultatit më vonë", "Gleichzeitig gegen Ergebnis später"), a: 0.42, an: dec("0.42"), b: 0.27, bn: dec("0.27") },
          ] },
        { type: "p", text: x(
          "Experiments, where listening was made good or poor on purpose, gave 0.39, close to the surveys. Of their 30 effects only one was negative, at −0.04. The authors set this against feedback, where 38% of experimental interventions lowered performance, as No. 19 describes.",
          "Eksperimentet, ku dëgjimi u bë qëllimisht i mirë ose i dobët, dhanë 0,39, afër anketave. Nga 30 efektet e tyre vetëm një ishte negativ, me −0,04. Autorët e vënë këtë përballë feedback-ut, ku 38% e ndërhyrjeve eksperimentale e ulën performancën, siç e përshkruan Nr. 19.",
          "Experimente, in denen gutes oder schlechtes Zuhören gezielt herbeigeführt wurde, ergaben 0,39, nahe an den Befragungen. Von ihren 30 Effekten war nur einer negativ, mit −0,04. Die Autoren stellen das dem Feedback gegenüber, bei dem 38 % der experimentellen Interventionen die Leistung senkten, wie Nr. 19 beschreibt.") },
        { type: "callout", reading: true, text: x(
          "Even on the strictest reading, listening is not a soft extra. And it rarely does harm, which cannot be said of all management habits.",
          "Edhe në leximin më të rreptë, dëgjimi nuk është një shtesë e butë. Dhe rrallë bën dëm, gjë që nuk mund të thuhet për të gjitha zakonet e drejtimit.",
          "Selbst bei strengster Lesart ist Zuhören keine weiche Zugabe. Und es schadet selten, was sich nicht von allen Führungsgewohnheiten sagen lässt.") },
      ],
      note: x(
        "Kluger et al. (2024), table 7 and discussion. Two sources: listening and outcome reported by different people or records. Outcome later: a predictive design. Effects with outcomes such as burnout or misconduct were weaker (0.17) than with desirable ones (0.43).",
        "Kluger et al. (2024), tabela 7 dhe diskutimi. Dy burime: dëgjimi dhe rezultati raportohen nga njerëz ose regjistra të ndryshëm. Rezultati më vonë: plan parashikues. Efektet me rezultate si lodhja e thellë ose sjellja e keqe ishin më të dobëta (0,17) se me ato të dëshirueshme (0,43).",
        "Kluger et al. (2024), Tabelle 7 und Diskussion. Zwei Quellen: Zuhören und Ergebnis von verschiedenen Personen oder Daten berichtet. Ergebnis später: prädiktives Design. Effekte mit Ergebnissen wie Burnout oder Fehlverhalten waren schwächer (0,17) als mit erwünschten (0,43)."),
      source: ["listen-kluger-2024"],
    },
    {
      id: "model",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Three parts", "Tri pjesët", "Drei Teile"), x("of good listening", "e dëgjimit të mirë", "guten Zuhörens")],
      lead: x(
        "Guy Itzchakov and Jennifer Grau describe a good listening experience in three parts: attention, comprehension and acceptance. The speaker judges all three from small signals, and the meta-analysis lists the signals that tell them the opposite.",
        "Guy Itzchakov dhe Jennifer Grau e përshkruajnë një përvojë të mirë dëgjimi në tri pjesë: vëmendja, kuptimi dhe pranimi. Ai që flet i gjykon të treja nga sinjale të vogla, dhe meta-analiza rendit sinjalet që i thonë të kundërtën.",
        "Guy Itzchakov und Jennifer Grau beschreiben ein gutes Zuhörerlebnis in drei Teilen: Aufmerksamkeit, Verstehen und Annahme. Die sprechende Person beurteilt alle drei an kleinen Signalen, und die Metaanalyse nennt die Signale, die ihr das Gegenteil sagen."),
      blocks: [
        { type: "lists", cols: [
          { h: x("Attention", "Vëmendja", "Aufmerksamkeit"), items: [
            x("eye contact, the phone away", "kontakt me sy, telefoni mënjanë", "Blickkontakt, das Telefon weg"),
            x("nodding, short sounds", "tundje koke, tinguj të shkurtër", "Nicken, kurze Laute"),
            x("signal: doing two things at once", "sinjal: dy punë njëherësh", "Signal: zwei Dinge zugleich"),
          ] },
          { h: x("Comprehension", "Kuptimi", "Verstehen"), accent: true, items: [
            x("questions that clarify or confirm", "pyetje që sqarojnë ose konfirmojnë", "Fragen, die klären oder bestätigen"),
            x("saying back what was heard", "të thuash prapë atë që dëgjove", "das Gehörte wiedergeben"),
            x("signal: changing the topic", "sinjal: ndërrimi i temës", "Signal: das Thema wechseln"),
          ] },
          { h: x("Acceptance", "Pranimi", "Annahme"), items: [
            x("no judgment, even in disagreement", "pa gjykim, edhe kur nuk pajtohesh", "kein Urteil, auch bei Widerspruch"),
            x("“What led to it?” rather than “Why?”", "“Çfarë të çoi aty?” në vend të “Pse?”", "„Was hat dazu geführt?“ statt „Warum?“"),
            x("signal: advice nobody asked for", "sinjal: këshillë që s'e kërkoi askush", "Signal: ungefragter Rat"),
          ] },
        ] },
        { type: "p", text: x(
          "Even a neutral question can sound like judgment from a manager. “Have you talked to accounting about this?” is often heard as advice and a doubt; “What might you try next?” leaves the next step with the person.",
          "Edhe një pyetje neutrale mund të tingëllojë si gjykim nga goja e menaxherit. “E ke folur këtë me kontabilitetin?” shpesh dëgjohet si këshillë dhe dyshim; “Çfarë mund të provosh më tej?” ia lë hapin tjetër personit.",
          "Selbst eine neutrale Frage kann von einer Führungskraft wie ein Urteil klingen. „Hast du schon mit der Buchhaltung gesprochen?“ wird oft als Rat und Zweifel gehört; „Was könntest du als Nächstes versuchen?“ lässt den nächsten Schritt bei der Person.") },
        { type: "callout", reading: true, text: x(
          "The speaker does not hear the intention. They hear the question, the glance at the screen and the advice that came too early.",
          "Ai që flet nuk e dëgjon qëllimin. Dëgjon pyetjen, shikimin nga ekrani dhe këshillën që erdhi shumë herët.",
          "Die sprechende Person hört nicht die Absicht. Sie hört die Frage, den Blick auf den Bildschirm und den Rat, der zu früh kam.") },
      ],
      note: x(
        "Parts and examples from Itzchakov and Grau (2022), signals of poor listening from Kluger et al. (2024), shortened by the editors. The authors add that field studies of listening training for managers are scarce: they know of two. Coaching is in No. 11.",
        "Pjesët dhe shembujt nga Itzchakov dhe Grau (2022), sinjalet e dëgjimit të dobët nga Kluger et al. (2024), të shkurtuara nga redaksia. Autorët shtojnë se studimet në terren për trajnimin e menaxherëve në dëgjim janë të pakta: dinë dy. Coaching-u është te Nr. 11.",
        "Teile und Beispiele nach Itzchakov und Grau (2022), Signale schlechten Zuhörens nach Kluger et al. (2024), von der Redaktion gekürzt. Die Autoren fügen hinzu, dass Feldstudien zu Zuhörtrainings für Führungskräfte selten sind: Sie kennen zwei. Coaching steht in Nr. 11."),
      source: ["listen-itzchakov-grau-2022", "listen-kluger-2024"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("81 stories", "81 histori", "81 Geschichten"), x("from a bank", "nga një bankë", "aus einer Bank")],
      lead: x(
        "Tiffany Kriz, Avraham Kluger and Christopher Lyddy interviewed 41 employees of a US bank about a time someone at work had an important chance to listen to them, and took it or missed it. They told 81 stories: 47 of feeling heard, 34 of feeling unheard.",
        "Tiffany Kriz, Avraham Kluger dhe Christopher Lyddy intervistuan 41 punonjës të një banke amerikane për një rast kur dikush në punë pati një mundësi të rëndësishme për t'i dëgjuar, dhe e shfrytëzoi ose e humbi. Ata treguan 81 histori: 47 për t'u ndier të dëgjuar, 34 për t'u ndier të padëgjuar.",
        "Tiffany Kriz, Avraham Kluger und Christopher Lyddy befragten 41 Beschäftigte einer US-Bank zu einem Moment, in dem jemand bei der Arbeit eine wichtige Gelegenheit hatte, ihnen zuzuhören, und sie nutzte oder verpasste. Sie erzählten 81 Geschichten: 47 vom Gehörtwerden, 34 vom Nichtgehörtwerden."),
      blocks: [
        { type: "hbars", max: 30, source: ["listen-kriz-2021"],
          label: x("Stories by what decided the outcome, 41 bank employees (2021)", "Historitë sipas asaj që vendosi përfundimin, 41 punonjës banke (2021)", "Geschichten nach dem, was den Ausgang entschied, 41 Bankbeschäftigte (2021)"),
          items: [
            { k: x("Heard: the listener acted", "I dëgjuar: dëgjuesi veproi", "Gehört: die Person handelte"), v: 30, n: "30" },
            { k: x("Heard: the conversation itself", "I dëgjuar: vetë biseda", "Gehört: das Gespräch selbst"), v: 17, n: "17" },
            { k: x("Unheard: shut down or overruled", "I padëgjuar: u mbyll ose u anulua", "Ungehört: abgeblockt oder übergangen"), v: 23, n: "23" },
            { k: x("Unheard: open at first, then nothing", "I padëgjuar: i hapur në fillim, pastaj asgjë", "Ungehört: erst offen, dann nichts"), v: 11, n: "11", alert: true },
          ] },
        { type: "p", text: x(
          "Attentive behaviour in the conversation did not tell the stories apart. What did was whether the listener met the need the speaker came with. Sometimes that took a tool, a change or a reason for a no; one employee stopped bringing ideas after a no without a reason.",
          "Sjellja e vëmendshme në bisedë nuk i dallonte historitë. I dallonte nëse dëgjuesi e plotësoi nevojën me të cilën erdhi ai që foli. Ndonjëherë kjo kërkonte një mjet, një ndryshim ose një arsye për një jo; një punonjës pushoi së sjelli ide pas një jo-je pa arsye.",
          "Aufmerksames Verhalten im Gespräch unterschied die Geschichten nicht. Den Unterschied machte, ob die zuhörende Person das Anliegen erfüllte, mit dem jemand kam. Manchmal brauchte es dafür ein Werkzeug, eine Änderung oder eine Begründung für ein Nein; eine Person brachte nach einem Nein ohne Begründung keine Ideen mehr.") },
        { type: "callout", reading: true, text: x(
          "A warm conversation followed by nothing can do more damage than a short one. It raised the hope that then went unanswered.",
          "Një bisedë e ngrohtë e ndjekur nga asgjë mund të bëjë më shumë dëm se një e shkurtër. Ajo ngriti shpresën që pastaj mbeti pa përgjigje.",
          "Ein warmes Gespräch, dem nichts folgt, kann mehr schaden als ein kurzes. Es weckte die Hoffnung, die dann unbeantwortet blieb.") },
      ],
      note: x(
        "Kriz et al. (2021), table 3: one bank, employees chosen by HR as mid to high performers, stories told in retrospect; the editors grouped the paths. The authors expect the role of action to vary across cultures. Silence and voice are in the treatise's volume 7.",
        "Kriz et al. (2021), tabela 3: një bankë, punonjës të zgjedhur nga burimet njerëzore si me performancë mesatare deri të lartë, histori të treguara pas kohe; rrugët i grupoi redaksia. Autorët presin që roli i veprimit të ndryshojë sipas kulturës. Heshtja dhe zëri janë te vëllimi 7 i traktatit.",
        "Kriz et al. (2021), Tabelle 3: eine Bank, von der Personalabteilung als mittel bis stark leistend ausgewählte Beschäftigte, rückblickend erzählte Geschichten; die Pfade hat die Redaktion gruppiert. Die Autoren erwarten, dass die Rolle des Handelns je nach Kultur variiert. Schweigen und Stimme stehen in Band 7 der Abhandlung."),
      source: ["listen-kriz-2021"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie es gemessen wird"),
      title: [x("Ask the speaker,", "Pyet atë që foli,", "Die sprechende Person fragen,"), x("not yourself", "jo veten", "nicht sich selbst")],
      lead: x(
        "The meta-analysis defines listening from the speaker's side: their judgment of the listener's interest and reaction. Kriz and colleagues cite a study in which the listeners' ratings of themselves did not match the speakers' ratings at all (−0.06). Your own impression is the weakest measure you have.",
        "Meta-analiza e përkufizon dëgjimin nga ana e atij që flet: gjykimi i tij për interesin dhe reagimin e dëgjuesit. Kriz dhe kolegët citojnë një studim ku vlerësimet që dëgjuesit i bënin vetes nuk përputheshin fare me ato të folësve (−0,06). Përshtypja jote është masa më e dobët që ke.",
        "Die Metaanalyse bestimmt Zuhören von der Seite der sprechenden Person: ihr Urteil über Interesse und Reaktion der zuhörenden Person. Kriz und Kollegen zitieren eine Studie, in der die Selbsteinschätzung der Zuhörenden mit der Einschätzung der Sprechenden gar nicht übereinstimmte (−0,06). Der eigene Eindruck ist das schwächste Maß, das man hat."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("One question", "Një pyetje", "Eine Frage"), p: x("after an important conversation: did I listen to you well? researchers suggest one item may be enough", "pas një bisede të rëndësishme: të dëgjova mirë? studiuesit sugjerojnë se një pyetje mund të mjaftojë", "nach einem wichtigen Gespräch: Habe ich dir gut zugehört? Forschende halten eine Frage für möglicherweise ausreichend") },
          { h: x("What was asked for", "Çfarë u kërkua", "Was erbeten wurde"), p: x("written in the speaker's words: a tool, a change, a decision, or only to be heard", "e shkruar me fjalët e atij që foli: një mjet, një ndryshim, një vendim, ose vetëm të dëgjohej", "in den Worten der Person notiert: ein Werkzeug, eine Änderung, eine Entscheidung oder nur gehört werden") },
          { h: x("Follow-ups closed", "Vazhdimet e mbyllura", "Erledigte Nacharbeiten"), p: x("promised follow-ups closed on time, out of all promised", "vazhdimet e premtuara të mbyllura në kohë, nga të gjitha të premtuarat", "zugesagte Nacharbeiten fristgerecht erledigt, von allen zugesagten") },
          { h: x("A no with a reason", "Një jo me arsye", "Ein Nein mit Begründung"), p: x("every rejected idea answered with the reason, in person", "çdo ide e refuzuar merr arsyen, ballë për ballë", "jede abgelehnte Idee bekommt die Begründung, persönlich") },
          { h: x("Ideas over time", "Idetë me kalimin e kohës", "Ideen über die Zeit"), p: x("does the same person still bring ideas a month later?", "a sjell ende ide i njëjti person një muaj më vonë?", "bringt dieselbe Person einen Monat später noch Ideen?") },
        ] },
        { type: "callout", reading: true, text: x(
          "The closing rate of follow-ups is a number a manager can see every week. The feeling of being heard is built on it.",
          "Norma e mbylljes së vazhdimeve është një shifër që menaxheri mund ta shohë çdo javë. Ndjenja se të dëgjojnë ndërtohet mbi të.",
          "Die Erledigungsquote der Nacharbeiten ist eine Zahl, die eine Führungskraft jede Woche sehen kann. Das Gefühl, gehört zu werden, baut auf ihr auf.") },
      ],
      note: x(
        "The rows are the editors' proposal, built on the definition and the single-item remark in Kluger et al. (2024) and the findings of Kriz et al. (2021). The −0.06 is from Bodie et al. (2014) as Kriz et al. report it; that study was not read.",
        "Rreshtat janë propozim i redaksisë, i ndërtuar mbi përkufizimin dhe vërejtjen për një pyetje te Kluger et al. (2024) dhe mbi gjetjet e Kriz et al. (2021). Vlera −0,06 është nga Bodie et al. (2014) siç e raportojnë Kriz et al.; ai studim nuk u lexua.",
        "Die Zeilen sind ein Vorschlag der Redaktion, gestützt auf die Definition und den Hinweis auf eine Einzelfrage bei Kluger et al. (2024) und auf die Befunde von Kriz et al. (2021). Die −0,06 stammt von Bodie et al. (2014), wie Kriz et al. berichten; diese Studie wurde nicht gelesen."),
      source: ["listen-kluger-2024", "listen-kriz-2021"],
    },
    {
      id: "tool", tool: "/tools/action-tracker/", more: "talking-to-someone-who-made-a-mistake",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The follow-up", "Karta", "Die Karte"), x("card", "e vazhdimit", "für die Nacharbeit")],
      lead: x(
        "One card for each conversation that matters: an idea, a concern, a complaint about the work. Filled in by the manager right after, and closed only when the speaker has had an answer. The Action Tracker keeps the follow-ups with an owner and a date.",
        "Një kartë për çdo bisedë që ka rëndësi: një ide, një shqetësim, një ankesë për punën. E plotëson menaxheri menjëherë pas, dhe mbyllet vetëm kur ai që foli ka marrë një përgjigje. Action Tracker i mban vazhdimet me përgjegjës dhe datë.",
        "Eine Karte für jedes Gespräch, das zählt: eine Idee, eine Sorge, eine Beschwerde über die Arbeit. Die Führungskraft füllt sie direkt danach aus, und sie wird erst geschlossen, wenn die Person eine Antwort hat. Der Action Tracker führt die Nacharbeiten mit Verantwortlichen und Datum."),
      blocks: [
        { type: "form", items: [
          { h: x("Who, when, about what", "Kush, kur, për çfarë", "Wer, wann, worüber"), hint: x("one conversation per card", "një bisedë për kartë", "ein Gespräch pro Karte") },
          { h: x("What I heard", "Çfarë dëgjova", "Was ich gehört habe"), hint: x("in their words; said back and confirmed, after “And what else?”", "me fjalët e tij; e thënë prapë dhe e konfirmuar, pas “Dhe çfarë tjetër?”", "in ihren Worten; wiedergegeben und bestätigt, nach „Und was noch?“") },
          { h: x("What they need", "Çfarë i duhet", "Was die Person braucht"), hint: x("only to be heard, or an action: tool, change, decision", "vetëm të dëgjohet, apo një veprim: mjet, ndryshim, vendim", "nur gehört werden oder eine Handlung: Werkzeug, Änderung, Entscheidung") },
          { h: x("What I will do, by when", "Çfarë do të bëj, deri kur", "Was ich tue, bis wann"), hint: x("or who has the power to act, and when I take it to them", "ose kush ka fuqinë të veprojë, dhe kur ia çoj", "oder wer entscheiden kann, und wann ich es dorthin bringe") },
          { h: x("The answer given", "Përgjigja e dhënë", "Die gegebene Antwort"), hint: x("done, under way, or no with the reason; in person", "u bë, po bëhet, ose jo me arsyen; ballë për ballë", "erledigt, in Arbeit oder Nein mit Begründung; persönlich") },
          { h: x("Did you feel heard?", "U ndjeve i dëgjuar?", "Hast du dich gehört gefühlt?"), hint: x("their answer, not mine", "përgjigja e tij, jo e imja", "die Antwort der Person, nicht meine") },
        ] },
      ],
      note: x(
        "The card is the editors' proposal, built on Kriz et al. (2021) and the questions in Itzchakov and Grau (2022); it has not been tested. The essay linked below gives the author's five steps for the talk after a mistake: listen before you judge, end with an action that is checked.",
        "Karta është propozim i redaksisë, i ndërtuar mbi Kriz et al. (2021) dhe pyetjet te Itzchakov dhe Grau (2022); nuk është provuar. Eseja e lidhur më poshtë jep pesë hapat e autorit për bisedën pas një gabimi: dëgjo para se të gjykosh, mbyll me një veprim që kontrollohet.",
        "Die Karte ist ein Vorschlag der Redaktion, gestützt auf Kriz et al. (2021) und die Fragen bei Itzchakov und Grau (2022); sie ist nicht erprobt. Der unten verlinkte Essay gibt die fünf Schritte des Autors für das Gespräch nach einem Fehler: zuhören, bevor man urteilt, und mit einer Maßnahme enden, die geprüft wird."),
      source: ["listen-kriz-2021", "listen-itzchakov-grau-2022"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
