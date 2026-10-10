// Management Review, No. 36: 70-20-10, how leaders develop. Block: Role.
// Facts and their sources: docs/revista/management-review-nr-36.md. The shares of the 616 key events are the
// editors' sums of the event counts in the CCL technical report of 1987.
import { x, pc } from "../common.js";

export default {
  number: 36,
  block: "role",
  date: x("October 2026", "Tetor 2026", "Oktober 2026"),
  theme: [x("70-20-10:", "70-20-10:", "70-20-10:"), x("how leaders develop", "si zhvillohen drejtuesit", "wie Führungskräfte sich entwickeln")],
  sub: x(
    "Where 70-20-10 comes from, what 191 executives named, the five experiences CCL finds in four countries, why challenge needs feedback, ten challenges in a job, and a development card.",
    "Nga vjen 70-20-10, çfarë përmendën 191 drejtues, pesë përvojat që CCL gjen në katër vende, pse sfida do feedback, dhjetë sfida në një punë, dhe një kartë zhvillimi.",
    "Woher 70-20-10 stammt, was 191 Topmanager nannten, die fünf Erfahrungen, die das CCL in vier Ländern findet, warum Herausforderung Feedback braucht, zehn Herausforderungen und eine Karte."),
  seo: x(
    "70-20-10: the 1996 sentence behind the rule, the 616 key events of CCL's research, what the evidence shows, ten developmental challenges and a card.",
    "70-20-10: fjalia e 1996 pas rregullit, 616 ngjarjet kyçe të kërkimit të CCL, çfarë tregojnë provat, dhjetë sfida zhvillimi dhe një kartë.",
    "70-20-10: der Satz von 1996 hinter der Regel, 616 Schlüsselereignisse aus der CCL-Forschung, was die Belege zeigen, zehn Herausforderungen, eine Karte."),
  feature: x(
    "Issue 36 traces 70-20-10 to a sentence of 1996 and to the Center for Creative Leadership's research with 191 executives, counts the 616 key events they named, sets out the experiences CCL finds in four countries, weighs what studies find about challenge, feedback and the framework in practice, and ends with a card for developing one skill.",
    "Numri 36 e ndjek 70-20-10 deri te një fjali e 1996 dhe te kërkimi i Center for Creative Leadership me 191 drejtues, numëron 616 ngjarjet kyçe që përmendën ata, shtjellon përvojat që CCL gjen në katër vende, peshon çfarë gjejnë studimet për sfidën, feedback-un dhe zbatimin e kornizës, dhe mbyllet me një kartë për zhvillimin e një aftësie.",
    "Ausgabe 36 verfolgt 70-20-10 bis zu einem Satz von 1996 und zur Forschung des Center for Creative Leadership mit 191 Topmanagern, zählt die 616 Schlüsselereignisse, die sie nannten, stellt die Erfahrungen vor, die das CCL in vier Ländern findet, wägt ab, was Studien über Herausforderung, Feedback und das Modell in der Praxis finden, und endet mit einer Karte, um eine Fähigkeit zu entwickeln."),
  figure: { n: "616", by: "Lindsey, Homes & McCall, 1987", t: x(
    "key events of their careers, described by 191 executives: the data of the research from which 70-20-10 later emerged.",
    "ngjarje kyçe të karrierës, të përshkruara nga 191 drejtues: të dhënat e kërkimit nga i cili doli më vonë 70-20-10.",
    "Schlüsselereignisse ihrer Laufbahn, beschrieben von 191 Topmanagern: die Daten der Forschung, aus der später 70-20-10 hervorging.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("Where 70-20-10 comes from", "Nga vjen 70-20-10", "Woher 70-20-10 stammt") },
    { page: "numbers", kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: x("616 key events", "616 ngjarje kyçe", "616 Schlüsselereignisse") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The development card", "Karta e zhvillimit", "Die Entwicklungskarte") },
  ],
  sources: ["lombardo-eichinger-1996", "lindsey-1987", "ccl-702010", "wilson-ccl-2016", "derue-wellman-2009", "johnson-blackman-buick-2018", "clardy-2018", "mccauley-2006"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Few leaders are made in a classroom. 70-20-10 says so in three numbers, and few rules in leadership development are quoted more often. This issue asks where the numbers come from, what the data behind them show, and what a manager can do with them.",
        "Pak drejtues formohen në një klasë. 70-20-10 e thotë këtë me tri numra, dhe pak rregulla të zhvillimit të drejtuesve citohen më shpesh. Ky numër pyet nga vijnë numrat, çfarë tregojnë të dhënat pas tyre, dhe çfarë mund të bëjë një menaxher me to.",
        "Wenige Führungskräfte entstehen im Seminarraum. 70-20-10 sagt das in drei Zahlen, und kaum eine Regel der Führungskräfteentwicklung wird öfter zitiert. Diese Ausgabe fragt, woher die Zahlen stammen, was die Daten dahinter zeigen und was eine Führungskraft damit anfangen kann."),
      body: x(
        "In 1996 Michael Lombardo and Robert Eichinger wrote that successful managers learn roughly 70% from tough jobs, 20% from people and 10% from courses and reading. Behind it lies research by the Center for Creative Leadership, in which 191 executives described 616 key events of their careers. A 2018 review found the evidence for the 70% weak. Studies show that challenge teaches up to a point, that feedback keeps it useful, and where 70-20-10 goes wrong in practice.",
        "Në 1996, Michael Lombardo dhe Robert Eichinger shkruan se menaxherët e suksesshëm mësojnë afërsisht 70% nga punët e vështira, 20% nga njerëzit dhe 10% nga kurset dhe leximi. Pas kësaj qëndron kërkimi i Center for Creative Leadership, ku 191 drejtues përshkruan 616 ngjarje kyçe të karrierës. Një shqyrtim i 2018 i gjeti të dobëta provat për 70%. Studimet tregojnë se sfida mëson deri në një pikë, se feedback-u e mban të dobishme, dhe ku gabon 70-20-10 në praktikë.",
        "1996 schrieben Michael Lombardo und Robert Eichinger, erfolgreiche Führungskräfte lernten ungefähr 70 % aus schwierigen Aufgaben, 20 % von Menschen und 10 % aus Kursen und Lektüre. Dahinter steht Forschung des Center for Creative Leadership, in der 191 Topmanager 616 Schlüsselereignisse ihrer Laufbahn beschrieben. Eine Übersicht von 2018 fand die Belege für die 70 % schwach. Studien zeigen, dass Herausforderung bis zu einem Punkt lehrt, dass Feedback sie nützlich hält und wo 70-20-10 in der Praxis scheitert."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("Where 70-20-10", "Nga vjen", "Woher 70-20-10"), x("comes from", "70-20-10", "stammt")],
      lead: x(
        "The rule has no study of its own. Its best-known source is one sentence in The Career Architect Development Planner of 1996: lessons learned by successful and effective managers come “roughly” 70% from tough jobs, 20% from people, mostly the boss, and 10% from courses and reading.",
        "Rregulli nuk ka studim të vetin. Burimi i tij më i njohur është një fjali te The Career Architect Development Planner i 1996: mësimet e menaxherëve të suksesshëm dhe efektivë vijnë “afërsisht” 70% nga punët e vështira, 20% nga njerëzit, kryesisht nga shefi, dhe 10% nga kurset dhe leximi.",
        "Die Regel hat keine eigene Studie. Ihre bekannteste Quelle ist ein Satz im Career Architect Development Planner von 1996: Erfolgreiche und wirksame Führungskräfte lernen „ungefähr“ 70 % aus schwierigen Aufgaben, 20 % von Menschen, meist vom Chef, und 10 % aus Kursen und Lektüre."),
      blocks: [
        { type: "timeline", items: [
          { k: "1981–82", t: x("Three CCL researchers and four corporations start asking executives how they developed.", "Tre studiues të CCL dhe katër korporata nisin t'i pyesin drejtuesit si u zhvilluan.", "Drei CCL-Forscher und vier Konzerne beginnen, Topmanager zu fragen, wie sie sich entwickelt haben.") },
          { k: "1987", t: x("CCL's technical report: 191 executives, 616 key events, 1,547 lessons.", "Raporti teknik i CCL: 191 drejtues, 616 ngjarje kyçe, 1.547 mësime.", "Der technische Bericht des CCL: 191 Topmanager, 616 Schlüsselereignisse, 1.547 Lektionen.") },
          { k: "1988", t: x("McCall, Lombardo and Morrison tell the findings in The Lessons of Experience.", "McCall, Lombardo dhe Morrison i tregojnë gjetjet te The Lessons of Experience.", "McCall, Lombardo und Morrison erzählen die Befunde in The Lessons of Experience.") },
          { k: "1996", t: x("Lombardo and Eichinger: “roughly” 70, 20 and 10.", "Lombardo dhe Eichinger: “afërsisht” 70, 20 dhe 10.", "Lombardo und Eichinger: „ungefähr“ 70, 20 und 10.") },
        ] },
        { type: "p", text: x(
          "The 191 were seen by their companies as high potentials or as having lived up to their potential. Each named at least three events that lastingly changed how they managed, and what they learned. The researchers warned that the sample may not stand for all executives, and that all of it was self-report.",
          "Kompanitë i shihnin 191 drejtuesit si potenciale të larta ose si njerëz që e kishin realizuar potencialin. Secili përmendi të paktën tri ngjarje që lanë gjurmë të qëndrueshme te mënyra si drejtonte, dhe çfarë mësoi prej tyre. Vetë studiuesit paralajmëruan se mostra mund të mos përfaqësojë të gjithë drejtuesit, dhe se gjithçka ishte vetëdeklarim.",
          "Die 191 galten in ihren Unternehmen als hohe Potenziale oder als Menschen, die ihr Potenzial ausgeschöpft hatten. Jeder nannte mindestens drei Ereignisse, die dauerhaft veränderten, wie er führte, und was er daraus lernte. Die Forscher warnten selbst, die Stichprobe stehe womöglich nicht für alle Topmanager, und alles beruhe auf Selbstauskunft.") },
        { type: "callout", reading: true, text: x(
          "70-20-10 sums up what successful executives remembered about their careers. It does not measure how much anyone learns where.",
          "70-20-10 përmbledh atë që drejtuesit e suksesshëm mbanin mend nga karriera. Nuk mat sa mëson dikush dhe ku.",
          "70-20-10 fasst zusammen, woran sich erfolgreiche Topmanager aus ihrer Laufbahn erinnerten. Es misst nicht, wie viel jemand wo lernt.") },
      ],
      note: x(
        "The 1996 sentence is confirmed only through independent summaries; we could not see the book. How the three numbers were derived from the data is not shown in any source we could check.",
        "Fjalia e 1996 konfirmohet vetëm përmes përmbledhjeve të pavarura; librin s'e kam parë. Si u nxorën tri numrat nga të dhënat nuk tregohet në asnjë burim që kam mundur të kontrolloj.",
        "Der Satz von 1996 ist nur über unabhängige Zusammenfassungen belegt; das Buch lag uns nicht vor. Wie die drei Zahlen aus den Daten abgeleitet wurden, zeigt keine Quelle, die wir prüfen konnten."),
      source: ["lombardo-eichinger-1996", "lindsey-1987"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("What 191 executives", "Çfarë përmendën", "Was 191 Topmanager"), x("named", "191 drejtues", "nannten")],
      lead: x(
        "The 1987 technical report gives the number of events of each kind. Grouped as the report groups them, challenging assignments are the largest block, but not 70%.",
        "Raporti teknik i 1987 jep numrin e ngjarjeve për çdo lloj. Të grupuara si i grupon raporti, detyrat sfiduese janë blloku më i madh, por jo 70%.",
        "Der technische Bericht von 1987 nennt die Zahl der Ereignisse jeder Art. So gruppiert wie im Bericht, sind herausfordernde Aufgaben der größte Block, aber nicht 70 %."),
      blocks: [
        { type: "hbars", source: ["lindsey-1987"],
          label: x("The 616 key events, in the report's groups (share of events)", "616 ngjarjet kyçe, sipas grupeve të raportit (pjesa e ngjarjeve)", "Die 616 Schlüsselereignisse in den Gruppen des Berichts (Anteil der Ereignisse)"),
          items: [
            { k: x("Challenging assignments", "Detyra sfiduese", "Herausfordernde Aufgaben"), v: 48, n: pc(48), alert: true },
            { k: x("Other people, mostly bosses", "Njerëz të tjerë, kryesisht eprorë", "Andere Menschen, meist Vorgesetzte"), v: 18, n: pc(18) },
            { k: x("Hardships", "Vështirësi", "Rückschläge"), v: 17, n: pc(17) },
            { k: x("Early work, first supervision, personal", "Puna e hershme, drejtimi i parë, jeta personale", "Frühe Arbeit, erste Führung, Privates"), v: 11, n: pc(11) },
            { k: x("Coursework", "Kurse", "Kurse"), v: 6, n: pc(6) },
          ] },
        { type: "p", text: x(
          "Count hardships, early jobs and first supervision as work too, and the split becomes 73% work, 18% people and 6% courses: close to 70-20-10. Whether Lombardo and Eichinger grouped the events this way, the sources we checked do not say. The shares count events that people remembered, not hours of learning.",
          "Nëse edhe vështirësitë, punët e hershme dhe drejtimi i parë numërohen si punë, ndarja bëhet 73% punë, 18% njerëz dhe 6% kurse: afër 70-20-10. Nëse Lombardo dhe Eichinger i grupuan ngjarjet kështu, burimet që kam parë nuk e thonë. Pjesët numërojnë ngjarje që njerëzit mbanin mend, jo orë mësimi.",
          "Zählt man auch Rückschläge, frühe Stellen und die erste Führungsaufgabe zur Arbeit, ergibt sich 73 % Arbeit, 18 % Menschen und 6 % Kurse: nahe an 70-20-10. Ob Lombardo und Eichinger die Ereignisse so gruppierten, sagen die geprüften Quellen nicht. Die Anteile zählen erinnerte Ereignisse, keine Lernstunden.") },
        { type: "callout", reading: true, text: x(
          "The same data give 48% or 73%, depending on what counts as a job.",
          "Të njëjtat të dhëna japin 48% ose 73%, sipas asaj që numërohet si punë.",
          "Dieselben Daten ergeben 48 % oder 73 %, je nachdem, was als Aufgabe zählt.") },
      ],
      note: x(
        "Shares worked out by the editors from the event counts in the report (616 events), rounded. Executives from six large corporations, data from the 1980s.",
        "Pjesët i ka llogaritur redaksia nga numri i ngjarjeve në raport (616 ngjarje), të rrumbullakosura. Drejtues nga gjashtë korporata të mëdha, të dhëna të viteve 1980.",
        "Die Anteile hat die Redaktion aus den Ereigniszahlen des Berichts berechnet (616 Ereignisse), gerundet. Topmanager aus sechs Großunternehmen, Daten aus den 1980er-Jahren."),
      source: ["lindsey-1987"],
    },
    {
      id: "model", more: "leadership-without-a-title",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Three sources,", "Tri burime,", "Drei Quellen,"), x("five experiences", "pesë përvoja", "fünf Erfahrungen")],
      lead: x(
        "The Center for Creative Leadership presents 70-20-10 as a guideline with three clusters of experience. In a 2016 white paper it also names what the rule leaves out.",
        "Center for Creative Leadership e paraqet 70-20-10 si udhëzim me tri grupe përvojash. Në një dokument të 2016 emërton edhe atë që rregulli e lë jashtë.",
        "Das Center for Creative Leadership stellt 70-20-10 als Leitlinie mit drei Gruppen von Erfahrungen vor. In einem Whitepaper von 2016 benennt es auch, was die Regel auslässt."),
      blocks: [
        { type: "cards", cols: 3, items: [
          { h: x("Challenging assignments", "Detyrat sfiduese", "Herausfordernde Aufgaben"), p: x("new, difficult work that stretches the person", "punë e re dhe e vështirë që e shtrin njeriun përtej vetes", "neue, schwierige Arbeit, die über das Gewohnte hinausführt") },
          { h: x("Developmental relationships", "Marrëdhëniet zhvilluese", "Entwicklungsbeziehungen"), p: x("bosses who teach, model, push and mentor", "eprorë që mësojnë, japin shembull, nxisin dhe udhëheqin", "Vorgesetzte, die lehren, vorleben, fordern und begleiten") },
          { h: x("Coursework and training", "Kurset dhe trajnimi", "Kurse und Training"), p: x("in CCL's view, an amplifier of the other two", "sipas CCL, përforcues i dy të parave", "nach Sicht des CCL ein Verstärker der beiden anderen") },
        ] },
        { type: "chain", label: x("The basic five: experiences that teach leadership in all four countries (CCL, 2016)", "Pesë përvojat bazë: ato që mësojnë drejtimin në të katër vendet (CCL, 2016)", "Die fünf Grunderfahrungen, die in allen vier Ländern Führung lehren (CCL, 2016)"), items: [
          { h: x("Bosses and superiors", "Eprorët", "Vorgesetzte") },
          { h: x("Turnarounds", "Shpëtimet", "Turnarounds") },
          { h: x("Increases in scope", "Rritja e fushës", "Mehr Verantwortung") },
          { h: x("Horizontal moves", "Lëvizjet horizontale", "Wechsel zur Seite") },
          { h: x("New initiatives", "Nismat e reja", "Neue Vorhaben") },
        ] },
        { type: "p", text: x(
          "CCL asked 393 top and senior executives in China, India, Singapore and the United States. Each of the five was cited by at least 20% of interviewees in three of the four countries; coursework and training by only 9–15%. CCL also notes that the rule says neither which experiences teach most nor what each one teaches.",
          "CCL pyeti 393 drejtues të lartë në Kinë, Indi, Singapor dhe SHBA. Secilën nga pesë përvojat e përmendën të paktën 20% e të intervistuarve në tri nga katër vendet; kurset dhe trajnimin vetëm 9–15%. CCL vëren gjithashtu se rregulli nuk thotë cilat përvoja mësojnë më shumë, as çfarë mëson secila.",
          "Das CCL befragte 393 Top- und Führungskräfte in China, Indien, Singapur und den USA. Jede der fünf nannten mindestens 20 % der Befragten in drei der vier Länder, Kurse und Training nur 9–15 %. Das CCL hält auch fest, dass die Regel weder sagt, welche Erfahrungen am meisten lehren, noch, was jede lehrt.") },
        { type: "callout", reading: true, text: x(
          "The ratio says little. The list of experiences says more, and it can be planned.",
          "Raporti thotë pak. Lista e përvojave thotë më shumë, dhe mund të planifikohet.",
          "Das Verhältnis sagt wenig. Die Liste der Erfahrungen sagt mehr, und sie lässt sich planen.") },
      ],
      note: x(
        "Interviews from 2005 to 2009: 234 in the United States, 71 in India, 54 in China, 34 in Singapore; self-reports. CCL calls 70-20-10 research-based but does not show how the ratio was calculated.",
        "Intervista nga 2005 deri në 2009: 234 në SHBA, 71 në Indi, 54 në Kinë, 34 në Singapor; vetëdeklarime. CCL e quan 70-20-10 të bazuar në kërkim, por nuk tregon si u llogarit raporti.",
        "Interviews von 2005 bis 2009: 234 in den USA, 71 in Indien, 54 in China, 34 in Singapur; Selbstauskünfte. Das CCL nennt 70-20-10 forschungsbasiert, zeigt aber nicht, wie das Verhältnis berechnet wurde."),
      source: ["ccl-702010", "wilson-ccl-2016"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("Challenge teaches,", "Sfida mëson,", "Herausforderung lehrt,"), x("up to a point", "deri në një pikë", "bis zu einem Punkt")],
      lead: x(
        "D. Scott DeRue and Ned Wellman studied 225 on-the-job experiences of 60 managers. Leadership skills grew with the challenge of an experience, but with diminishing returns; access to feedback offset the decline at high levels of challenge.",
        "D. Scott DeRue dhe Ned Wellman studiuan 225 përvoja në punë të 60 menaxherëve. Aftësitë drejtuese rriteshin me sfidën e përvojës, por me kthime në rënie; mundësia për feedback e kompensonte rënien kur sfida ishte shumë e lartë.",
        "D. Scott DeRue und Ned Wellman untersuchten 225 Erfahrungen von 60 Führungskräften im Beruf. Führungsfähigkeiten wuchsen mit der Herausforderung einer Erfahrung, aber mit abnehmendem Ertrag; Zugang zu Feedback glich den Rückgang bei sehr hoher Herausforderung aus."),
      blocks: [
        { type: "p", text: x(
          "In the Australian public sector, Samantha Johnson, Deborah Blackman and Fiona Buick found middle managers willing to keep learning, yet 70-20-10 was not building the capability it promised. They name four misconceptions:",
          "Në sektorin publik australian, Samantha Johnson, Deborah Blackman dhe Fiona Buick gjetën menaxherë të mesëm të gatshëm të vazhdonin të mësonin, por 70-20-10 nuk po e ndërtonte aftësinë që premtonte. Ato emërtojnë katër keqkuptime:",
          "Im australischen öffentlichen Dienst fanden Samantha Johnson, Deborah Blackman und Fiona Buick mittlere Führungskräfte, die weiterlernen wollten, doch 70-20-10 baute die versprochene Fähigkeit nicht auf. Sie nennen vier Missverständnisse:") },
        { type: "box", title: x("Four misconceptions in practice (Johnson et al., 2018)", "Katër keqkuptime në praktikë (Johnson et al., 2018)", "Vier Missverständnisse in der Praxis (Johnson et al., 2018)"), items: [
          x("unstructured experience will build capability by itself", "përvoja pa strukturë e ndërton aftësinë vetvetiu", "Erfahrung ohne Struktur baut Fähigkeit von selbst auf"),
          x("social learning, read too narrowly", "të mësuarit nga të tjerët, i kuptuar shumë ngushtë", "Lernen mit anderen, zu eng verstanden"),
          x("behaviour will change after a course, without active support", "sjellja ndryshon pas një kursi, pa mbështetje aktive", "das Verhalten ändert sich nach einem Kurs, ohne aktive Unterstützung"),
          x("the three parts need not be planned together", "tri pjesët nuk kanë nevojë të planifikohen bashkë", "die drei Teile müssen nicht gemeinsam geplant werden"),
        ] },
        { type: "p", text: x(
          "Alan Clardy reviewed five strands of literature in 2018. The evidence that 70% or more of learning at work is informal is weak, he concludes, and the rule should be set aside.",
          "Alan Clardy shqyrtoi pesë drejtime të literaturës në 2018. Provat se 70% ose më shumë e të mësuarit në punë është joformal janë të dobëta, përfundon ai, dhe rregulli duhet lënë mënjanë.",
          "Alan Clardy sichtete 2018 fünf Literaturstränge. Die Belege, dass 70 % oder mehr des Lernens bei der Arbeit informell sind, seien schwach, folgert er, und die Regel solle beiseitegelegt werden.") },
        { type: "callout", reading: true, text: x(
          "Experience is not a plan. Stretch, feedback and a course chosen for the job have to be put together on purpose.",
          "Përvoja nuk është plan. Sfida, feedback-u dhe një kurs i zgjedhur për punën duhen bashkuar me qëllim.",
          "Erfahrung ist kein Plan. Herausforderung, Feedback und ein passender Kurs müssen bewusst zusammengebracht werden.") },
      ],
      note: x(
        "DeRue and Wellman: one study with 60 managers. Johnson et al.: qualitative data from one public sector. Clardy reviews the claim about informal learning at work in general, not only for leaders.",
        "DeRue dhe Wellman: një studim me 60 menaxherë. Johnson et al.: të dhëna cilësore nga një sektor publik. Clardy shqyrton pohimin për të mësuarit joformal në punë në përgjithësi, jo vetëm për drejtuesit.",
        "DeRue und Wellman: eine Studie mit 60 Führungskräften. Johnson et al.: qualitative Daten aus einem öffentlichen Sektor. Clardy prüft die Behauptung über informelles Lernen bei der Arbeit allgemein, nicht nur für Führungskräfte."),
      source: ["derue-wellman-2009", "johnson-blackman-buick-2018", "clardy-2018"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie man es misst"),
      title: [x("How much does", "Sa të mëson", "Wie viel lehrt"), x("a job teach?", "një punë?", "eine Aufgabe?")],
      lead: x(
        "Instead of shares, CCL's research counts challenges. Cynthia McCauley lists ten that make an assignment developmental; many can be added to a current job without changing it.",
        "Në vend të përqindjeve, kërkimi i CCL numëron sfidat. Cynthia McCauley rendit dhjetë që e bëjnë një detyrë zhvilluese; shumë prej tyre mund t'i shtohen punës së sotme pa e ndërruar atë.",
        "Statt Anteilen zählt die CCL-Forschung Herausforderungen. Cynthia McCauley nennt zehn, die eine Aufgabe entwicklungsfördernd machen; viele lassen sich der jetzigen Stelle hinzufügen, ohne sie zu wechseln."),
      blocks: [
        { type: "lists", cols: [
          { h: x("The task", "Detyra", "Die Aufgabe"), items: [
            x("Unfamiliar responsibilities", "Përgjegjësi të panjohura", "Ungewohnte Verantwortung"),
            x("New directions", "Drejtime të reja", "Neue Richtungen"),
            x("Inherited problems", "Probleme të trashëguara", "Geerbte Probleme"),
            x("High stakes", "Shumë në lojë", "Viel steht auf dem Spiel"),
            x("Scope and scale", "Fushë dhe përmasë e madhe", "Umfang und Größe"),
          ] },
          { h: x("The people", "Njerëzit", "Die Menschen"), accent: true, items: [
            x("Problems with employees", "Probleme me punonjësit", "Probleme mit Mitarbeitenden"),
            x("External pressure", "Presion nga jashtë", "Druck von außen"),
            x("Influence without authority", "Ndikim pa autoritet", "Einfluss ohne Weisungsbefugnis"),
            x("Work across cultures", "Punë mes kulturash", "Arbeit über Kulturen hinweg"),
            x("Work group diversity", "Diversiteti i grupit", "Vielfalt im Team"),
          ] },
        ] },
        { type: "example", label: x("Hypothetical example, a shift leader", "Shembull hipotetik, një drejtues turni", "Hypothetisches Beispiel, eine Schichtleitung"), rows: [
          { k: x("Assignment", "Detyra", "Aufgabe"), v: x("move the returns area to a new hall within six weeks", "zhvendos zonën e kthimeve në një sallë të re brenda gjashtë javëve", "den Retourenbereich in sechs Wochen in eine neue Halle verlegen") },
          { k: x("Challenges", "Sfidat", "Herausforderungen"), v: x("unfamiliar responsibilities, high stakes, influence without authority", "përgjegjësi të panjohura, shumë në lojë, ndikim pa autoritet", "ungewohnte Verantwortung, viel auf dem Spiel, Einfluss ohne Weisungsbefugnis") },
          { k: x("Feedback", "Feedback-u", "Feedback"), v: x("the site manager every Friday, a peer from the other shift", "drejtuesi i qendrës çdo të premte, një koleg nga turni tjetër", "die Standortleitung jeden Freitag, eine Kollegin aus der anderen Schicht") },
        ], text: x("Three challenges and feedback every week. The case is invented.", "Tri sfida dhe feedback çdo javë. Rasti është i shpikur.", "Drei Herausforderungen und jede Woche Feedback. Der Fall ist erfunden.") },
      ],
      note: x(
        "List after McCauley (2006); the two groups are the editors'. More challenge is not always better: after DeRue and Wellman, add feedback before adding challenge.",
        "Lista sipas McCauley-t (2006); dy grupet janë të redaksisë. Më shumë sfidë nuk është gjithmonë më mirë: sipas DeRue-s dhe Wellman-it, shto feedback para se të shtosh sfidë.",
        "Liste nach McCauley (2006); die zwei Gruppen stammen von der Redaktion. Mehr Herausforderung ist nicht immer besser: Nach DeRue und Wellman erst Feedback ergänzen, dann Herausforderung."),
      source: ["mccauley-2006", "derue-wellman-2009"],
    },
    {
      id: "tool", tool: "/tools/kpi-diagnostic/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The development", "Karta e", "Die Entwicklungs-"), x("card", "zhvillimit", "karte")],
      lead: x(
        "One skill per card, filled in with your manager. If the gap shows in a KPI, first check that it is a matter of skill at all.",
        "Një aftësi për çdo kartë, e plotësuar me eprorin. Nëse mungesa duket te një KPI, kontrollo së pari nëse është vërtet çështje aftësie.",
        "Eine Fähigkeit pro Karte, gemeinsam mit der Führungskraft ausgefüllt. Zeigt sich die Lücke in einer Kennzahl, zuerst prüfen, ob es überhaupt um Können geht."),
      blocks: [
        { type: "form", items: [
          { h: x("The skill", "Aftësia", "Die Fähigkeit"), hint: x("one, as others would see it: what will I do differently?", "një, si do ta shohin të tjerët: çfarë do të bëj ndryshe?", "eine, so wie andere sie sehen: Was mache ich anders?") },
          { h: x("The assignment", "Detyra", "Die Aufgabe"), hint: x("a real piece of work, and which of the ten challenges it holds", "një punë e vërtetë, dhe cilat nga dhjetë sfidat përmban", "eine echte Arbeit, und welche der zehn Herausforderungen sie enthält") },
          { h: x("Feedback", "Feedback-u", "Feedback"), hint: x("from whom, how often, and the first date", "nga kush, sa shpesh, dhe data e parë", "von wem, wie oft, und der erste Termin") },
          { h: x("Someone to learn from", "Dikush nga kë mëson", "Jemand zum Lernen"), hint: x("a boss, a peer or a mentor who does it well", "një epror, një koleg ose një mentor që e bën mirë", "Chef, Kollegin oder Mentor, die es gut können") },
          { h: x("Course or reading", "Kursi ose leximi", "Kurs oder Lektüre"), hint: x("only what supports the assignment, and when", "vetëm ajo që e mbështet detyrën, dhe kur", "nur, was die Aufgabe unterstützt, und wann") },
          { h: x("What I learned", "Çfarë mësova", "Was ich gelernt habe"), hint: x("after 90 days: what changed, and what comes next", "pas 90 ditësh: çfarë ndryshoi, dhe çfarë vjen më pas", "nach 90 Tagen: was sich geändert hat, und was als Nächstes kommt") },
        ] },
      ],
      note: x(
        "A practice proposed by the editors, after CCL's three sources, DeRue & Wellman (2009) on feedback and Johnson et al. (2018) on planning the parts together. No ratio is prescribed.",
        "Praktikë e propozuar nga redaksia, sipas tri burimeve të CCL, DeRue & Wellman (2009) për feedback-un dhe Johnson et al. (2018) për planifikimin e pjesëve bashkë. Nuk caktohet asnjë raport.",
        "Eine Praxis, die die Redaktion vorschlägt, nach den drei Quellen des CCL, DeRue & Wellman (2009) zum Feedback und Johnson et al. (2018) zur gemeinsamen Planung der Teile. Ein Verhältnis wird nicht vorgegeben."),
      source: ["ccl-702010", "derue-wellman-2009", "johnson-blackman-buick-2018"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
