// Management Review, No. 93: Defaults, the choice nobody makes. Block: Strategy.
// Facts and their sources: docs/revista/management-review-nr-93.md. Madrian & Shea were read in full in the NBER working
// paper (w7682, May 2000), whose figures are the ones printed here; Johnson & Goldstein (2003) in full in the authors'
// PDF of the Science policy forum; Jachimowicz et al. (2019) in full at Cambridge (open access).
// Nudge trials and the nudge units are in No. 69; defaults in meetings in No. 13; estimating before discussing in No. 83.
import { x, pc } from "../common.js";

export default {
  number: 93,
  block: "strategy",
  date: x("November 2026", "Nëntor 2026", "November 2026"),
  theme: [x("Defaults:", "Opsioni i paracaktuar:", "Voreinstellungen:"), x("the choice nobody makes", "zgjedhja që s'e bën askush", "die Wahl, die niemand trifft")],
  sub: x(
    "One company that turned its savings form around, eleven European countries and their organ donor rules, a meta-analysis of 58 default studies, the three ways a default works, and a card for the defaults a manager sets.",
    "Një kompani që e ktheu përmbys formularin e kursimeve, njëmbëdhjetë vende evropiane dhe rregullat e tyre për dhurimin e organeve, një meta-analizë e 58 studimeve, tri mënyrat si vepron një opsion i paracaktuar, dhe një kartë për ato që vendos menaxheri.",
    "Ein Unternehmen, das sein Sparformular umdrehte, elf europäische Länder und ihre Regeln zur Organspende, eine Metaanalyse von 58 Studien, die drei Wege, auf denen eine Voreinstellung wirkt, und eine Karte für die Voreinstellungen einer Führungskraft."),
  seo: x(
    "Defaults: automatic enrolment in a 401(k), organ donor rules in Europe, a meta-analysis of 58 default studies, and a card to audit the defaults you set.",
    "Opsioni i paracaktuar: regjistrimi automatik në kursime, dhurimi i organeve në Evropë, një meta-analizë e 58 studimeve dhe një kartë kontrolli.",
    "Voreinstellungen: automatische Aufnahme in einen Sparplan, Organspende in Europa, eine Metaanalyse von 58 Studien und eine Karte zur Prüfung."),
  feature: x(
    "Every form, roster and checklist has an answer already filled in for those who do nothing. Issue 93 follows a US company that made its savings plan opt-out: joining more than doubled, and most new members stayed exactly where the form had put them. It compares European countries whose organ donor rules differ by one default, reads a meta-analysis of 58 studies, explains the three ways a default works, and ends with a card for auditing the defaults a manager sets.",
    "Çdo formular, plan turnesh dhe listë kontrolli ka një përgjigje të plotësuar më parë për ata që nuk bëjnë asgjë. Numri 93 ndjek një kompani amerikane që e bëri planin e kursimeve me tërheqje: pjesëmarrja u më shumë se dyfishua, dhe shumica e anëtarëve të rinj mbetën pikërisht aty ku i kishte vënë formulari. Krahason vende evropiane që rregullat e dhurimit të organeve i ndajnë vetëm në opsionin e paracaktuar, lexon një meta-analizë të 58 studimeve, shpjegon tri mënyrat si vepron ky opsion, dhe mbyllet me një kartë për kontrollin e opsioneve që vendos një menaxher.",
    "Jedes Formular, jeder Dienstplan und jede Checkliste hat für alle, die nichts tun, schon eine Antwort. Ausgabe 93 folgt einem US-Unternehmen, das seinen Sparplan auf Widerspruch umstellte: Die Teilnahme verdoppelte sich mehr als, und die meisten neuen Mitglieder blieben genau dort, wo das Formular sie hingesetzt hatte. Sie vergleicht europäische Länder, deren Organspenderegeln sich nur in der Voreinstellung unterscheiden, liest eine Metaanalyse von 58 Studien, erklärt die drei Wirkwege und endet mit einer Karte, um die eigenen Voreinstellungen zu prüfen."),
  figure: { n: pc(86), by: "Madrian & Shea, 2000", t: x(
    "of new hires were in the savings plan when joining was the default; 37% when they had to sign up. Same company, same tenure.",
    "e të punësuarve të rinj ishin në planin e kursimeve kur anëtarësimi ishte i paracaktuar; 37% kur duhej të regjistroheshin vetë. E njëjta kompani, e njëjta vjetërsi.",
    "der neu Eingestellten waren im Sparplan, wenn die Teilnahme voreingestellt war; 37 %, wenn sie sich selbst anmelden mussten. Gleiches Unternehmen, gleiche Betriebszugehörigkeit.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("The form that was turned around", "Formulari që u kthye përmbys", "Das umgedrehte Formular") },
    { page: "model", kicker: x("The model", "Modeli", "Das Modell"),
      title: x("Advice, effort, ownership", "Këshilla, mundimi, pronësia", "Rat, Aufwand, Besitz") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The default card", "Karta e opsionit të paracaktuar", "Die Karte der Voreinstellung") },
  ],
  sources: ["default-madrian-shea-2000", "default-johnson-goldstein-2003", "default-jachimowicz-2019"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "A manager decides many things without deciding them: the box already ticked, the shift that repeats unless someone changes it, the step a checklist skips unless asked. What happens when nobody acts is itself a choice, and most people take it. This issue asks how strong that pull is, and how to set it on purpose.",
        "Një menaxher vendos shumë gjëra pa i vendosur: kutia e shënuar që më parë, turni që përsëritet nëse s'e ndryshon dikush, hapi që lista e kontrollit e kapërcen nëse nuk pyetet. Ajo që ndodh kur askush nuk vepron është vetë një zgjedhje, dhe shumica e marrin. Ky numër pyet sa e fortë është kjo tërheqje, dhe si vendoset me qëllim.",
        "Eine Führungskraft entscheidet vieles, ohne es zu entscheiden: das schon gesetzte Häkchen, die Schicht, die sich wiederholt, wenn niemand sie ändert, der Schritt, den eine Checkliste auslässt, wenn niemand fragt. Was geschieht, wenn niemand handelt, ist selbst eine Wahl, und die meisten nehmen sie. Diese Ausgabe fragt, wie stark dieser Sog ist und wie man ihn bewusst setzt."),
      body: x(
        "When a US company enrolled new hires in its savings plan unless they said no, joining rose from 37% to 86%, and three in four members kept the pre-set rate of 3%. Countries where people are organ donors unless they opt out show consent of 86% to nearly 100%; in four opt-in countries it was 4% to 28%. Across 58 studies, a default moved choices by about 27 percentage points on average, with a wide spread. Three channels explain how defaults work; a card closes the issue.",
        "Kur një kompani amerikane i regjistroi të punësuarit e rinj në planin e kursimeve nëse nuk thoshin jo, pjesëmarrja u rrit nga 37% në 86%, dhe tre në katër anëtarë e mbajtën normën e paracaktuar prej 3%. Në vendet ku njerëzit janë dhurues organesh nëse nuk tërhiqen, pëlqimi është nga 86% deri afër 100%; në katër vende me regjistrim vullnetar ishte 4% deri 28%. Në 58 studime, opsioni i paracaktuar i lëvizi zgjedhjet mesatarisht rreth 27 pikë përqindjeje, me shpërndarje të gjerë. Tri kanale shpjegojnë si vepron; një kartë e mbyll numrin.",
        "Als ein US-Unternehmen neu Eingestellte in seinen Sparplan aufnahm, sofern sie nicht widersprachen, stieg die Teilnahme von 37 % auf 86 %, und drei von vier Mitgliedern behielten den voreingestellten Satz von 3 %. Länder, in denen man Organspender ist, sofern man nicht widerspricht, zeigen Zustimmung von 86 % bis fast 100 %; in vier Ländern mit Zustimmungslösung waren es 4 bis 28 %. Über 58 Studien verschob eine Voreinstellung Entscheidungen im Mittel um rund 27 Prozentpunkte, bei großer Streuung. Drei Kanäle erklären die Wirkung; eine Karte schließt die Ausgabe."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("The form that was", "Formulari që", "Das umgedrehte"), x("turned around", "u kthye përmbys", "Formular")],
      lead: x(
        "Until April 1998, a large US health and insurance company let staff join its 401(k) savings plan after a year, by filling in a form or calling. From then on, new hires were enrolled on day one, at 3% of pay in a money market fund, unless they opted out. The employer match and the fund menu stayed the same.",
        "Deri në prill 1998, një kompani e madhe amerikane e shëndetësisë dhe sigurimeve i linte punonjësit të hynin në planin e kursimeve 401(k) pas një viti, duke plotësuar një formular ose duke telefonuar. Prej atëherë, të punësuarit e rinj regjistroheshin që ditën e parë, me 3% të pagës në një fond të tregut monetar, nëse nuk tërhiqeshin. Kontributi i punëdhënësit dhe lista e fondeve mbetën po ato.",
        "Bis April 1998 konnten Beschäftigte eines großen US-Gesundheits- und Versicherungsunternehmens nach einem Jahr per Formular oder Anruf in den 401(k)-Sparplan eintreten. Danach wurden neu Eingestellte ab dem ersten Tag aufgenommen, mit 3 % des Gehalts in einem Geldmarktfonds, sofern sie nicht widersprachen. Arbeitgeberzuschuss und Fondsauswahl blieben gleich."),
      blocks: [
        { type: "pairs", from: x("Sign up", "Regjistrim vetë", "Selbst anmelden"), to: x("Default", "I paracaktuar", "Voreingestellt"), max: 100, source: ["default-madrian-shea-2000"],
          label: x("New hires with 3–15 months' tenure, before and after the switch (1998–99)", "Të punësuar të rinj me 3–15 muaj vjetërsi, para dhe pas ndryshimit (1998–99)", "Neu Eingestellte mit 3–15 Monaten Zugehörigkeit, vor und nach der Umstellung (1998–99)"),
          rows: [
            { k: x("In the plan", "Në plan", "Im Plan"), a: 37, an: pc(37), b: 86, bn: pc(86), alert: true },
            { k: x("Average contribution, % of pay", "Kontributi mesatar, % e pagës", "Mittlerer Beitrag, % des Gehalts"), a: 7.4, an: x("7.4", "7,4", "7,4"), b: 4.4, bn: x("4.4", "4,4", "4,4") },
          ] },
        { type: "figures", compact: true, items: [
          { n: pc(76), t: x("of automatically enrolled members saved exactly 3%; about 10% of earlier members did", "e anëtarëve të regjistruar automatikisht kursenin saktësisht 3%; nga anëtarët e mëparshëm, rreth 10%", "der automatisch Aufgenommenen sparten genau 3 %; bei früheren Mitgliedern rund 10 %") },
          { n: pc(61), t: x("of the new cohort kept the whole default, rate and fund; 1% of earlier staff had chosen it", "e grupit të ri e mbajtën të gjithë opsionin, normën dhe fondin; nga stafi i mëparshëm e kishte zgjedhur 1%", "der neuen Kohorte behielten die ganze Voreinstellung, Satz und Fonds; 1 % der Früheren hatten sie gewählt") },
        ] },
        { type: "callout", reading: true, text: x(
          "The default brought people in, and then held them at a low rate in the safest fund. It decided both.",
          "Opsioni i paracaktuar i solli njerëzit brenda, dhe pastaj i mbajti me normë të ulët në fondin më të sigurt. I vendosi të dyja.",
          "Die Voreinstellung brachte die Leute hinein und hielt sie dann bei niedrigem Satz im sichersten Fonds. Sie entschied beides.") },
      ],
      note: x(
        "Madrian & Shea, NBER working paper (2000): cohort hired before the switch, measured June 1998, against the first opt-out cohort, June 1999. Contribution rates are of members only. One firm; the authors find immediate eligibility explains little.",
        "Madrian & Shea, punim i NBER-it (2000): grupi i punësuar para ndryshimit, i matur në qershor 1998, kundrejt grupit të parë me tërheqje, qershor 1999. Normat e kontributit janë vetëm të anëtarëve. Një kompani; autorët gjejnë se e drejta e menjëhershme shpjegon pak.",
        "Madrian & Shea, NBER-Arbeitspapier (2000): vor der Umstellung eingestellte Kohorte, gemessen im Juni 1998, gegen die erste Widerspruchskohorte, Juni 1999. Beitragssätze nur der Mitglieder. Ein Unternehmen; die sofortige Berechtigung erklärt laut Autoren wenig."),
      source: ["default-madrian-shea-2000"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("One word", "Një fjalë", "Ein Wort"), x("on a form", "në një formular", "auf einem Formular")],
      lead: x(
        "In explicit-consent countries nobody is an organ donor without registering; in presumed-consent countries everyone is, unless they register not to be. Eric Johnson and Daniel Goldstein set the two side by side in 2003, and ran the same choice online.",
        "Në vendet me pëlqim të shprehur, askush nuk është dhurues organesh pa u regjistruar; në vendet me pëlqim të supozuar, të gjithë janë, nëse nuk regjistrohen që të mos jenë. Eric Johnson dhe Daniel Goldstein i vunë krah për krah më 2003, dhe e provuan të njëjtën zgjedhje online.",
        "In Ländern mit Zustimmungslösung ist niemand Organspender ohne Eintrag; in Ländern mit Widerspruchslösung ist es jeder, der sich nicht austragen lässt. Eric Johnson und Daniel Goldstein stellten beide 2003 nebeneinander und spielten dieselbe Wahl online durch."),
      blocks: [
        { type: "figures", compact: true, items: [
          { n: x("12% · 99.98%", "12% · 99,98%", "12 % · 99,98 %"), t: x("effective consent in Germany (opt-in) and Austria (opt-out)", "pëlqimi efektiv në Gjermani (regjistrim vullnetar) dhe në Austri (tërheqje)", "effektive Zustimmung in Deutschland (Zustimmung) und Österreich (Widerspruch)") },
          { n: x("27.5%", "27,5%", "27,5 %"), t: x("in the Netherlands, after a 1998 registry, a campaign and over 12 million letters", "në Holandë, pas një regjistri të 1998-s, një fushate dhe mbi 12 milionë letrash", "in den Niederlanden, nach einem Register 1998, einer Kampagne und über 12 Millionen Briefen") },
        ] },
        { type: "columns", max: 100, height: 104, source: ["default-johnson-goldstein-2003"],
          label: x("Online experiment, 161 people: would be a donor, by the form of the question", "Eksperiment online, 161 veta: do të ishin dhurues, sipas formës së pyetjes", "Online-Experiment, 161 Personen: würden spenden, nach Form der Frage"),
          items: [
            { k: x("Opt-in", "Regjistrim", "Zustimmung"), v: 42, n: pc(42) },
            { k: x("Opt-out", "Tërheqje", "Widerspruch"), v: 82, n: pc(82), alert: true },
            { k: x("No default", "Pa opsion", "Ohne Vorgabe"), v: 79, n: pc(79) },
          ] },
        { type: "callout", reading: true, text: x(
          "With no default, people chose much as under opt-out. Opt-in was the odd one out: it asked for effort most never made.",
          "Pa opsion të paracaktuar, njerëzit zgjodhën pothuajse si me tërheqje. Regjistrimi vullnetar ishte përjashtimi: kërkonte një mundim që shumica s'e bënë.",
          "Ohne Vorgabe wählten die Leute fast wie bei Widerspruch. Die Zustimmungslösung fiel heraus: Sie verlangte einen Aufwand, den die meisten nie leisteten.") },
      ],
      note: x(
        "Consent rates are registrations, not donations: the authors' estimate from registries (2003). Their regression found 16.3% more actual donations under opt-out (1991–2001). In the online test, changing the answer took one click.",
        "Normat e pëlqimit janë regjistrime, jo dhurime: vlerësim i autorëve nga regjistrat (2003). Regresioni i tyre gjeti 16,3% më shumë dhurime reale me tërheqje (1991–2001). Në provën online, ndryshimi i përgjigjes donte një klikim.",
        "Zustimmungsraten sind Einträge, keine Spenden: Schätzung der Autoren aus Registern (2003). Ihre Regression fand 16,3 % mehr tatsächliche Spenden bei Widerspruch (1991–2001). Im Online-Test genügte ein Klick, um die Antwort zu ändern."),
      source: ["default-johnson-goldstein-2003"],
    },
    {
      id: "model",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Advice, effort,", "Këshilla, mundimi,", "Rat, Aufwand,"), x("ownership", "pronësia", "Besitz")],
      lead: x(
        "Johnson and Goldstein named three reasons a default sticks, and the later literature calls them endorsement, ease and endowment. A default can work through one, two or all three at once.",
        "Johnson dhe Goldstein përmendën tri arsye pse një opsion i paracaktuar ngjitet, dhe literatura e mëvonshme i quan miratim, lehtësi dhe pronësi. Një opsion mund të veprojë përmes njërës, dyve ose të treve njëherësh.",
        "Johnson und Goldstein nannten drei Gründe, warum eine Voreinstellung haftet; die spätere Literatur nennt sie Empfehlung, Leichtigkeit und Besitz. Eine Voreinstellung kann über einen, zwei oder alle drei zugleich wirken."),
      blocks: [
        { type: "cards", cols: 3, items: [
          { h: x("Endorsement", "Miratimi", "Empfehlung"), p: x("The pre-set option reads as advice from whoever set it. In the savings plan, earlier staff who joined after the switch, choosing for themselves, still leaned to the default fund.", "Opsioni i paracaktuar lexohet si këshillë nga kush e vendosi. Në planin e kursimeve, edhe stafi i vjetër që hyri pas ndryshimit, duke zgjedhur vetë, anonte nga fondi i paracaktuar.", "Die Vorgabe wirkt wie ein Rat dessen, der sie setzte. Im Sparplan neigten selbst Ältere, die nach der Umstellung beitraten und selbst wählten, zum Vorgabefonds.") },
          { h: x("Ease", "Lehtësia", "Leichtigkeit"), p: x("Staying costs nothing; changing takes a form, a call, a minute. The harder the switch, the more may stay.", "Të mbetesh nuk kushton asgjë; të ndryshosh do një formular, një telefonatë, një minutë. Sa më i vështirë ndryshimi, aq më shumë mund të mbeten.", "Bleiben kostet nichts; Wechseln kostet ein Formular, einen Anruf, eine Minute. Je schwerer der Wechsel, desto mehr bleiben womöglich.") },
          { h: x("Endowment", "Pronësia", "Besitz"), p: x("The default feels like the status quo. Leaving it reads as a loss, and losses weigh more than equal gains.", "Opsioni i paracaktuar ndihet si gjendja ekzistuese. Largimi prej tij lexohet si humbje, dhe humbjet peshojnë më shumë se fitimet e barabarta.", "Die Vorgabe fühlt sich wie der Status quo an. Sie zu verlassen wirkt wie ein Verlust, und Verluste wiegen schwerer als gleich große Gewinne.") },
        ] },
        { type: "p", text: x(
          "In the meta-analysis, studies whose default carried endorsement or endowment showed larger effects; ease did not, perhaps because few studies varied the effort. Defaults were stronger for consumer choices and weaker for environmental ones, where the authors suspect preferences are held more firmly.",
          "Në meta-analizë, studimet ku opsioni mbartte miratim ose pronësi treguan efekte më të mëdha; lehtësia jo, ndoshta sepse pak studime e ndryshuan mundimin. Opsionet ishin më të forta te zgjedhjet e konsumatorit dhe më të dobëta te ato mjedisore, ku autorët dyshojnë se bindjet janë më të forta.",
          "In der Metaanalyse zeigten Studien größere Effekte, wenn die Vorgabe Empfehlung oder Besitz trug; Leichtigkeit nicht, vielleicht weil kaum eine Studie den Aufwand variierte. Bei Konsumentscheidungen wirkten Vorgaben stärker, bei Umweltentscheidungen schwächer, wo die Autoren festere Präferenzen vermuten.") },
        { type: "callout", reading: true, text: x(
          "A default from a manager the team trusts carries advice. Set it as if it were advice, because it will be read as such.",
          "Një opsion nga një menaxher që ekipi i beson mbart këshillë. Vendose sikur të ishte këshillë, sepse do të lexohet si e tillë.",
          "Eine Vorgabe von einer Führungskraft, der das Team vertraut, trägt einen Rat. Setzen Sie sie wie einen Rat, denn so wird sie gelesen.") },
      ],
      note: x(
        "Channels from Johnson & Goldstein (2003) and Jachimowicz et al. (2019), who coded each study's channels by rater judgement, a rough measure. The advice effect is from Madrian & Shea (2000). The card texts are in our words.",
        "Kanalet nga Johnson & Goldstein (2003) dhe Jachimowicz et al. (2019), që i koduan kanalet e çdo studimi sipas gjykimit të vlerësuesve, matje e përafërt. Efekti i këshillës nga Madrian & Shea (2000). Tekstet e kartave janë me fjalët tona.",
        "Kanäle nach Johnson & Goldstein (2003) und Jachimowicz et al. (2019), die die Kanäle jeder Studie per Einschätzung von Kodierern bestimmten, ein grobes Maß. Der Rat-Effekt stammt von Madrian & Shea (2000). Die Kartentexte sind in unseren Worten."),
      source: ["default-johnson-goldstein-2003", "default-jachimowicz-2019", "default-madrian-shea-2000"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("Strong on average,", "I fortë mesatarisht,", "Im Mittel stark,"), x("uneven in practice", "i pabarabartë në praktikë", "im Einzelfall ungleich")],
      lead: x(
        "Jon Jachimowicz and colleagues gathered the studies, up to May 2017, that compared an opt-in with an opt-out version of the same choice: 58 datasets from 35 articles, 73,675 people in all.",
        "Jon Jachimowicz dhe kolegët mblodhën studimet, deri në maj 2017, që krahasonin një version me regjistrim vullnetar me një version me tërheqje të së njëjtës zgjedhje: 58 grupe të dhënash nga 35 artikuj, gjithsej 73.675 veta.",
        "Jon Jachimowicz und Kollegen sammelten die Studien bis Mai 2017, die eine Zustimmungs- mit einer Widerspruchsversion derselben Wahl verglich: 58 Datensätze aus 35 Artikeln, insgesamt 73.675 Personen."),
      blocks: [
        { type: "figures", compact: true, items: [
          { n: x("27 points", "27 pikë", "27 Punkte"), t: x("average shift towards the pre-set option, in the 38 yes-or-no datasets", "zhvendosja mesatare drejt opsionit të paracaktuar, në 38 grupet me përgjigje po ose jo", "mittlere Verschiebung zur Vorgabe, in den 38 Ja-Nein-Datensätzen") },
          { n: x("d = 0.68", "d = 0,68", "d = 0,68"), t: x("standardised effect, a medium one; healthy-eating nudges reached 0.23", "efekti i standardizuar, mesatar; nudge-t për ushqim të shëndetshëm arritën 0,23", "standardisierter Effekt, mittelgroß; Nudges für gesundes Essen erreichten 0,23") },
        ] },
        { type: "hbars", max: 46, source: ["default-jachimowicz-2019"],
          label: x("The 58 results, by what they found", "58 rezultatet, sipas asaj që gjetën", "Die 58 Ergebnisse, nach Befund"),
          items: [
            { k: x("Clear effect towards the default", "Efekt i qartë drejt opsionit", "Klarer Effekt zur Vorgabe"), v: 46, n: "46" },
            { k: x("No clear effect", "Pa efekt të qartë", "Kein klarer Effekt"), v: 10, n: "10", alert: true },
            { k: x("Clear effect the other way", "Efekt i qartë në drejtim të kundërt", "Klarer Effekt in Gegenrichtung"), v: 2, n: "2", alert: true },
          ] },
        { type: "callout", reading: true, text: x(
          "The average is large, the spread larger. A default set at work is a trial: check what it does, do not assume it.",
          "Mesatarja është e madhe, shpërndarja më e madhe. Një opsion i vendosur në punë është një provë: kontrollo çfarë bën, mos e supozo.",
          "Der Mittelwert ist groß, die Streuung größer. Eine Vorgabe im Betrieb ist ein Versuch: prüfen, was sie bewirkt, nicht annehmen.") },
      ],
      note: x(
        "Jachimowicz et al. (2019); “clear” means the confidence interval excludes zero. Heterogeneity was very high (I² 98%). The authors say choice architects often misjudge default effects and should test them. Pilots are in No. 69.",
        "Jachimowicz et al. (2019); “i qartë” do të thotë që intervali i besimit nuk përfshin zeron. Shpërndarja ishte shumë e lartë (I² 98%). Autorët thonë se ata që hartojnë zgjedhjet shpesh i gabojnë efektet dhe duhet t'i provojnë. Pilotet janë te Nr. 69.",
        "Jachimowicz et al. (2019); „klar“ heißt, das Konfidenzintervall schließt null aus. Die Heterogenität war sehr hoch (I² 98 %). Laut Autoren verschätzen sich Gestalter oft und sollten Vorgaben testen. Pilotversuche stehen in Nr. 69."),
      source: ["default-jachimowicz-2019"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie es gemessen wird"),
      title: [x("Count who", "Numëro kush", "Zählen, wer"), x("stays put", "mbetet aty", "stehen bleibt")],
      lead: x(
        "Madrian and Shea measured a “default rate”: the share of people sitting exactly on the pre-set option, set against the share who had picked it when they had to choose. The same count works for any default at work.",
        "Madrian dhe Shea matën një “normë të opsionit të paracaktuar”: pjesën e njerëzve që qëndrojnë saktësisht te opsioni i vendosur, krahasuar me pjesën që e kishin zgjedhur kur duhej të zgjidhnin vetë. I njëjti numërim vlen për çdo opsion në punë.",
        "Madrian und Shea maßen eine „Default-Quote“: den Anteil, der genau auf der Vorgabe sitzt, verglichen mit dem Anteil, der sie gewählt hatte, als man selbst wählen musste. Dieselbe Zählung taugt für jede Vorgabe im Betrieb."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("Find it", "Gjeje", "Finden"), p: x("forms, rosters, checklists, system settings: what happens if nobody acts?", "formularë, plane turnesh, lista kontrolli, cilësime sistemi: çfarë ndodh nëse askush nuk vepron?", "Formulare, Dienstpläne, Checklisten, Systemeinstellungen: Was passiert, wenn niemand handelt?") },
          { h: x("Count who stays", "Numëro kush mbetet", "Bleibende zählen"), p: x("the share exactly on the default, set against a period or group that chose actively", "pjesa saktësisht te opsioni, krahasuar me një periudhë ose grup që zgjodhi vetë", "Anteil genau auf der Vorgabe, verglichen mit einer Zeit oder Gruppe, die aktiv wählte") },
          { h: x("Split it", "Ndaje", "Aufteilen"), p: x("by group: in the plan, 74% of those earning under $20,000 stayed on the default, 30% at $70,000–79,000", "sipas grupeve: në plan, 74% e atyre me nën 20.000 dollarë mbetën te opsioni, 30% te 70.000–79.000", "nach Gruppen: im Plan blieben 74 % derer unter 20.000 Dollar bei der Vorgabe, 30 % bei 70.000–79.000") },
          { h: x("Repeat it", "Përsërite", "Wiederholen"), p: x("defaults fade slowly: members on it fell from 92% to 57% over 15 months", "opsioni zbehet ngadalë: anëtarët te ai ranë nga 92% në 57% në 15 muaj", "Vorgaben verblassen langsam: der Anteil darauf sank in 15 Monaten von 92 % auf 57 %") },
        ] },
        { type: "callout", reading: true, text: x(
          "A high default rate is not success. It says the default decides; whether it decides well is a second question.",
          "Një normë e lartë e opsionit nuk është sukses. Thotë që vendos opsioni; nëse vendos mirë është pyetje tjetër.",
          "Eine hohe Default-Quote ist kein Erfolg. Sie zeigt, dass die Vorgabe entscheidet; ob sie gut entscheidet, ist eine zweite Frage.") },
      ],
      note: x(
        "Figures from Madrian & Shea (2000), one company, 1998–99, staff hired under automatic enrolment. Applying the count to forms and rosters is the editors' proposal.",
        "Shifrat nga Madrian & Shea (2000), një kompani, 1998–99, punonjës të punësuar me regjistrim automatik. Zbatimi i numërimit te formularët dhe planet e turneve është propozim i redaksisë.",
        "Zahlen aus Madrian & Shea (2000), ein Unternehmen, 1998–99, unter automatischer Aufnahme Eingestellte. Die Übertragung auf Formulare und Dienstpläne ist ein Vorschlag der Redaktion."),
      source: ["default-madrian-shea-2000"],
    },
    {
      id: "tool", tool: "/tools/standard-work/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The default", "Karta e", "Die Karte der"), x("card", "opsionit", "Vorgabe")],
      lead: x(
        "One card per default: a pre-ticked box, a standing roster, a step that runs unless someone stops it. Where the default becomes a step in the standard, Standard Work keeps it with its reason, so the next person knows why it is set that way.",
        "Një kartë për çdo opsion të paracaktuar: një kuti e shënuar më parë, një plan turnesh që përsëritet, një hap që ecën nëse s'e ndal dikush. Kur opsioni bëhet hap i standardit, Standard Work e mban me arsyen e tij, që tjetri ta dijë pse është vendosur kështu.",
        "Eine Karte pro Vorgabe: ein vorab gesetztes Häkchen, ein stehender Dienstplan, ein Schritt, der läuft, wenn ihn niemand stoppt. Wird die Vorgabe zum Schritt im Standard, hält Standard Work sie mit ihrem Grund fest, damit die Nächsten wissen, warum sie so gesetzt ist."),
      blocks: [
        { type: "form", items: [
          { h: x("The choice", "Zgjedhja", "Die Wahl"), hint: x("what is decided, where: form, roster, checklist, system", "çfarë vendoset, ku: formular, plan turnesh, listë, sistem", "was entschieden wird, wo: Formular, Dienstplan, Checkliste, System") },
          { h: x("If nobody acts", "Nëse askush nuk vepron", "Wenn niemand handelt"), hint: x("what happens today, and who set it that way", "çfarë ndodh sot, dhe kush e vendosi kështu", "was heute passiert, und wer es so gesetzt hat") },
          { h: x("Would they choose it?", "A do ta zgjidhnin?", "Würden sie es wählen?"), hint: x("what people pick when they must choose; who the default fits and who it fails", "çfarë zgjedhin njerëzit kur duhet të zgjedhin; kujt i shkon opsioni dhe kujt jo", "was Leute wählen, wenn sie müssen; wem die Vorgabe passt, wem nicht") },
          { h: x("The way out", "Rruga për të dalë", "Der Ausweg"), hint: x("how to change it, in how many steps; is it as easy as staying?", "si ndryshohet, me sa hapa; a është aq e lehtë sa të mbetesh?", "wie man wechselt, in wie vielen Schritten; so leicht wie Bleiben?") },
          { h: x("The default we want", "Opsioni që duam", "Die gewollte Vorgabe"), hint: x("pre-set, or no pre-set and an active choice; the reason in one line", "i paracaktuar, apo pa opsion dhe me zgjedhje aktive; arsyeja në një rresht", "voreingestellt, oder keine Vorgabe und aktive Wahl; der Grund in einer Zeile") },
          { h: x("Check on", "Kontroll më", "Prüfen am"), hint: x("date; share on the default, by group", "data; pjesa te opsioni, sipas grupeve", "Datum; Anteil auf der Vorgabe, nach Gruppen") },
        ] },
      ],
      note: x(
        "The card is the editors' proposal, not research. It draws on Madrian & Shea's default rate, the two errors of a default and the active-choice option in Johnson & Goldstein (2003), and the advice to test in Jachimowicz et al. (2019).",
        "Karta është propozim i redaksisë, jo kërkim. Mbështetet te norma e opsionit e Madrian & Shea, te dy gabimet e një opsioni dhe te zgjedhja aktive te Johnson & Goldstein (2003), dhe te këshilla për provë te Jachimowicz et al. (2019).",
        "Die Karte ist ein Vorschlag der Redaktion, keine Forschung. Sie stützt sich auf die Default-Quote von Madrian & Shea, die zwei Fehler einer Vorgabe und die aktive Wahl bei Johnson & Goldstein (2003) und den Rat zum Testen bei Jachimowicz et al. (2019)."),
      source: ["default-madrian-shea-2000", "default-johnson-goldstein-2003", "default-jachimowicz-2019"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
