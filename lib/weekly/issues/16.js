// Management Review, No. 16: Delegation. Block: Role.
// Facts and their sources: docs/revista/management-review-nr-16.md.
import { x, pc } from "../common.js";

export default {
  number: 16,
  block: "role",
  date: x("October 2026", "Tetor 2026", "Oktober 2026"),
  theme: [x("Delegation:", "Delegimi:", "Delegieren:"), x("what to hand over, and how far", "çfarë jep dhe deri ku", "was man abgibt und wie weit")],
  sub: x(
    "How much of a manager's week others could do, why some managers hand over more than others, the five degrees of initiative, and a card for handing over one task well.",
    "Sa nga java e një menaxheri mund ta bëjnë të tjerët, pse disa menaxherë japin më shumë se të tjerët, pesë shkallët e iniciativës, dhe një kartë për ta dhënë mirë një detyrë.",
    "Wie viel von der Woche einer Führungskraft andere übernehmen könnten, warum manche mehr abgeben als andere, die fünf Stufen der Initiative und eine Karte, mit der Sie eine Aufgabe gut übergeben."),
  seo: x(
    "Delegation: the 41% of time others could take over, Gallup's study of CEOs, who's got the monkey, what research says about handing over, and a card.",
    "Delegimi: 41% e kohës që mund ta marrin të tjerët, studimi i Gallup-it me CEO-të, kush e ka majmunin, çfarë thotë kërkimi, dhe një kartë delegimi.",
    "Delegieren: die 41 % Zeit, die andere übernehmen könnten, Gallups CEO-Studie, wer den Affen hat, was die Forschung sagt, und eine Karte zum Übergeben."),
  feature: x(
    "Knowledge workers spend 41% of their time on work that others could do. Issue 16 looks at Gallup's study of fast-growing companies, follows a monkey that leaps from one back to another, and asks what decides whether a manager lets go. It ends with a card for handing over a single task.",
    "Punonjësit e dijes e kalojnë 41% të kohës në punë që mund ta bënin të tjerët. Numri 16 shqyrton studimin e Gallup-it për kompanitë që rriten shpejt, ndjek një majmun që kërcen nga një shpinë te tjetra dhe pyet çfarë e vendos nëse një menaxher e lëshon punën nga dora. Në fund vjen një kartë për ta dhënë një detyrë të vetme.",
    "Wissensarbeiter verbringen 41 % ihrer Zeit mit Arbeit, die andere erledigen könnten. Ausgabe 16 betrachtet Gallups Studie über schnell wachsende Unternehmen, folgt einem Affen, der von einem Rücken auf den nächsten springt, und fragt, was darüber entscheidet, ob eine Führungskraft loslässt. Am Ende steht eine Karte für die Übergabe einer einzelnen Aufgabe."),
  figure: { n: pc(41), by: "Birkinshaw & Cohen, 2013", t: x(
    "of knowledge workers' time went on tasks that gave them little satisfaction and that others could do well.",
    "e kohës së punonjësve të dijes shkonte në detyra që u jepnin pak kënaqësi dhe që të tjerët mund t'i bënin mirë.",
    "der Zeit von Wissensarbeitern floss in Aufgaben, die ihnen wenig Befriedigung brachten und die andere gut erledigen könnten.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("Work others could do", "Punë që mund ta bëjnë të tjerët", "Arbeit, die andere tun könnten") },
    { page: "model", kicker: x("The model", "Modeli", "Das Modell"),
      title: x("Who's got the monkey?", "Kush e ka majmunin?", "Wer hat den Affen?") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The delegation card", "Karta e delegimit", "Die Delegationskarte") },
  ],
  sources: ["birkinshaw-cohen-2013", "gallup-delegator-2015", "oncken-wass-1974", "leana-1986", "yukl-fu-1999", "bloom-2012", "lee-willis-tian-2018", "cheong-2016"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Most managers were promoted because they did the work well. Delegation asks them to let someone else do it, perhaps less well at first. What to hand over, how far, and with what support: those are the questions here.",
        "Shumica e menaxherëve u ngritën në detyrë sepse e bënin punën mirë. Delegimi u kërkon t'ia lënë dikujt tjetër, që në fillim ndoshta e bën më keq. Çfarë jep, deri ku dhe me çfarë mbështetjeje: këto janë pyetjet e këtyre faqeve.",
        "Die meisten Führungskräfte wurden befördert, weil sie die Arbeit gut machten. Delegieren verlangt, sie jemand anderem zu überlassen, der sie anfangs vielleicht schlechter macht. Was Sie abgeben, wie weit und mit welcher Unterstützung: Um diese Fragen geht es hier."),
      body: x(
        "Julian Birkinshaw and Jordan Cohen found that knowledge workers spend 41% of their time on tasks others could do well. In Gallup's study of fast-growing companies, those whose CEOs had a strong talent for delegating earned more. William Oncken and Donald Wass described five degrees of initiative. Research shows what makes managers let go, and when handing over power helps people or weighs on them.",
        "Julian Birkinshaw dhe Jordan Cohen gjetën se punonjësit e dijes kalojnë 41% të kohës në detyra që të tjerët mund t'i bëjnë mirë. Në studimin e Gallup-it për kompanitë që rriten shpejt, ato me CEO me talent të fortë për delegim fituan më shumë. William Oncken dhe Donald Wass përshkruan pesë shkallë iniciative. Kërkimi tregon çfarë i shtyn menaxherët ta lëshojnë punën, dhe kur dhënia e pushtetit i ndihmon njerëzit e kur i rëndon.",
        "Julian Birkinshaw und Jordan Cohen stellten fest, dass Wissensarbeiter 41 % ihrer Zeit mit Aufgaben verbringen, die andere gut erledigen könnten. In Gallups Studie über schnell wachsende Unternehmen erzielten jene mehr Umsatz, deren CEOs ein ausgeprägtes Talent zum Delegieren hatten. William Oncken und Donald Wass beschrieben fünf Stufen der Initiative. Die Forschung zeigt, was Führungskräfte loslassen lässt und wann abgegebene Verantwortung Menschen stärkt oder belastet."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("Work others", "Punë që mund ta", "Arbeit, die andere"), x("could do", "bëjnë të tjerët", "tun könnten")],
      lead: x(
        "Julian Birkinshaw and Jordan Cohen asked knowledge workers to go through their tasks one by one and rate what each was worth to them and to their company.",
        "Julian Birkinshaw dhe Jordan Cohen u kërkuan punonjësve të dijes t'i kalonin detyrat e veta një nga një dhe të vlerësonin sa vlente secila për ta dhe për kompaninë.",
        "Julian Birkinshaw und Jordan Cohen baten Wissensarbeiter, ihre Aufgaben einzeln durchzugehen und zu bewerten, was jede ihnen selbst und dem Unternehmen wert war."),
      blocks: [
        { type: "donut", v: 41, n: pc(41), t: x(
          "of their time, on average, went on tasks that gave them little satisfaction and that others could do well.",
          "e kohës së tyre, mesatarisht, shkonte në detyra që u jepnin pak kënaqësi dhe që të tjerët mund t'i bënin mirë.",
          "ihrer Zeit flossen im Schnitt in Aufgaben, die ihnen wenig Befriedigung brachten und die andere gut erledigen könnten.") },
        { type: "chain", items: [
          { h: x("Drop", "Hiqe", "Streichen"), p: x("Stop doing it, and see whether anyone misses it.", "Mos e bëj më, dhe shih nëse i mungon dikujt.", "Lassen Sie es weg und schauen Sie, ob es jemandem fehlt.") },
          { h: x("Delegate", "Delegoje", "Delegieren"), p: x("Someone else does it, within clear limits.", "E bën dikush tjetër, brenda kufijve të qartë.", "Jemand anderes übernimmt es, in klaren Grenzen.") },
          { h: x("Redesign", "Rindërtoje", "Neu gestalten"), p: x("Change the task so that it takes less time.", "Ndryshoje detyrën që të marrë më pak kohë.", "Ändern Sie die Aufgabe so, dass sie weniger Zeit kostet.") },
        ] },
        { type: "p", text: x(
          "The authors then worked with 15 executives who decided, task by task, whether to drop, delegate or redesign. On average they freed about a fifth of their time, close to one day a week, for work that mattered more.",
          "Autorët punuan më pas me 15 drejtues, që vendosën detyrë pas detyre nëse do ta hiqnin, do ta delegonin apo do ta rindërtonin. Mesatarisht liruan rreth një të pestën e kohës, afro një ditë në javë, për punë me më shumë vlerë.",
          "Danach arbeiteten die Autoren mit 15 Führungskräften, die Aufgabe für Aufgabe entschieden: streichen, delegieren oder neu gestalten. Im Schnitt gewannen sie rund ein Fünftel ihrer Zeit, fast einen Tag pro Woche, für wichtigere Arbeit.") },
        { type: "callout", reading: true, text: x(
          "Before asking who could take a task, ask whether it should exist at all. Part of the 41% should be dropped rather than passed on.",
          "Para se të pyesësh kush mund ta marrë një detyrë, pyet nëse duhet të ekzistojë fare. Një pjesë e 41% duhet hequr, jo kaluar te dikush tjetër.",
          "Bevor Sie fragen, wer eine Aufgabe übernehmen könnte, fragen Sie, ob es sie überhaupt braucht. Ein Teil der 41 % gehört gestrichen statt weitergereicht.") },
      ],
      note: x(
        "The shares are the participants' own ratings, and the group of 15 executives is small. The three choices are the authors', the descriptions the editors'.",
        "Pjesët janë vlerësimet e vetë pjesëmarrësve, dhe grupi me 15 drejtues është i vogël. Tri zgjedhjet janë të autorëve, përshkrimet të redaksisë.",
        "Die Anteile beruhen auf den Einschätzungen der Teilnehmenden, und die Gruppe von 15 Führungskräften ist klein. Die drei Wege stammen von den Autoren, die Beschreibungen von der Redaktion."),
      source: ["birkinshaw-cohen-2013"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("The CEOs", "CEO-të", "Die CEOs,"), x("who let go", "që e lëshojnë", "die loslassen")],
      lead: x(
        "In 2014 Gallup studied the talent profiles of 143 CEOs on the Inc. 500, a list of fast-growing private companies in the US, and compared those with a strong talent for delegating with those whose talent was limited or low.",
        "Në 2014, Gallup-i studioi profilin e talentit të 143 CEO-ve të listës Inc. 500, një listë kompanish private që rriten shpejt në SHBA, dhe krahasoi ata me talent të fortë për delegim me ata me talent të kufizuar ose të ulët.",
        "2014 untersuchte Gallup die Talentprofile von 143 CEOs der Inc. 500, einer Liste schnell wachsender Privatunternehmen in den USA, und verglich CEOs mit ausgeprägtem Talent zum Delegieren mit solchen, bei denen es begrenzt oder gering war."),
      blocks: [
        { type: "columns", max: 10, height: 90, source: ["gallup-delegator-2015"],
          label: x("Average revenue in 2013, by the CEO's talent for delegating", "Të ardhurat mesatare në 2013, sipas talentit të CEO-së për delegim", "Durchschnittlicher Umsatz 2013, nach dem Talent des CEO zum Delegieren"),
          items: [
            { k: x("Strong talent", "Talent i fortë", "Ausgeprägtes Talent"), v: 8, n: x("$8m", "8 mln $", "8 Mio. $"), alert: true },
            { k: x("Limited or low", "I kufizuar ose i ulët", "Begrenzt oder gering"), v: 6, n: x("$6m", "6 mln $", "6 Mio. $") },
          ] },
        { type: "figures", compact: true, items: [
          { n: pc(33), t: x("more revenue for the companies of CEOs with a strong talent for delegating", "më shumë të ardhura për kompanitë e CEO-ve me talent të fortë për delegim", "mehr Umsatz bei Unternehmen von CEOs mit ausgeprägtem Talent zum Delegieren") },
          { n: x("1 in 4", "1 në 4", "1 von 4"), t: x("entrepreneurs with employees has a strong talent for delegating, in Gallup's wider sample", "sipërmarrës me punonjës ka talent të fortë për delegim, në mostrën më të gjerë të Gallup-it", "Unternehmern mit Beschäftigten hat ein ausgeprägtes Talent zum Delegieren, in Gallups breiterer Stichprobe") },
        ] },
        { type: "callout", reading: true, text: x(
          "Fast-growing companies are not typical companies, and a link is no proof. Still, it points the same way as the 41%: a leader who keeps every task becomes the ceiling of the business.",
          "Kompanitë që rriten shpejt nuk janë kompani tipike, dhe një lidhje nuk është provë. Megjithatë, ajo tregon në të njëjtin drejtim si 41%: drejtuesi që i mban të gjitha detyrat për vete bëhet tavani i biznesit.",
          "Schnell wachsende Unternehmen sind keine typischen Unternehmen, und ein Zusammenhang ist kein Beweis. Er weist aber in dieselbe Richtung wie die 41 %: Wer jede Aufgabe selbst behält, wird zur Obergrenze des eigenen Geschäfts.") },
      ],
      note: x(
        "The talent profiles come from Gallup, which also sells an assessment of these talents. The figures describe 2013 revenue, not later growth.",
        "Profilet e talentit vijnë nga Gallup-i, që shet edhe një vlerësim të këtyre talenteve. Shifrat përshkruajnë të ardhurat e 2013, jo rritjen e mëvonshme.",
        "Die Talentprofile stammen von Gallup, das auch einen Test dieser Talente verkauft. Die Zahlen beschreiben den Umsatz 2013, nicht späteres Wachstum."),
      source: ["gallup-delegator-2015"],
    },
    {
      id: "model", more: "solve-it-or-escalate-it",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Who's got", "Kush e ka", "Wer hat"), x("the monkey?", "majmunin?", "den Affen?")],
      lead: x(
        "In 1974 William Oncken and Donald Wass called the next move on a problem a monkey. When a manager says “let me think about it, and I'll let you know”, the monkey jumps from the employee's back onto the manager's.",
        "Në 1974, William Oncken dhe Donald Wass e quajtën majmun hapin e radhës në një problem. Kur menaxheri thotë “më lër ta mendoj dhe të them”, majmuni kërcen nga shpina e punonjësit në shpinën e menaxherit.",
        "1974 nannten William Oncken und Donald Wass den nächsten Schritt bei einem Problem einen Affen. Sagt die Führungskraft „Ich denke darüber nach und melde mich“, springt der Affe vom Rücken der Mitarbeiterin oder des Mitarbeiters auf den eigenen."),
      blocks: [
        { type: "rows", compact: true, label: x("Five degrees of initiative, from the lowest", "Pesë shkallë iniciative, nga më e ulëta", "Fünf Stufen der Initiative, von der niedrigsten an"), items: [
          { h: x("Wait until told", "Pret derisa t'i thuhet", "Warten, bis es angeordnet wird"), p: x("Nothing happens until the manager acts.", "Asgjë nuk ndodh derisa të veprojë menaxheri.", "Nichts geschieht, bis die Führungskraft handelt.") },
          { h: x("Ask what to do", "Pyet çfarë të bëjë", "Fragen, was zu tun ist"), p: x("The question comes up, the decision stays above.", "Pyetja vjen, vendimi mbetet lart.", "Die Frage kommt, die Entscheidung bleibt oben.") },
          { h: x("Recommend, then act", "Propozon, pastaj vepron", "Vorschlagen, dann handeln"), p: x("The employee brings a proposal and acts on the decision.", "Punonjësi sjell një propozim dhe vepron sipas vendimit.", "Die Person bringt einen Vorschlag und setzt die Entscheidung um.") },
          { h: x("Act, then tell at once", "Vepron dhe njofton menjëherë", "Handeln und sofort melden"), p: x("The decision is taken below; the manager hears straight away.", "Vendimi merret poshtë; menaxheri e mëson menjëherë.", "Entschieden wird unten; die Führungskraft erfährt es sofort.") },
          { h: x("Act, then report routinely", "Vepron dhe raporton rregullisht", "Handeln und regelmäßig berichten"), p: x("The task belongs to the employee; the manager sees the summary.", "Detyra i përket punonjësit; menaxheri sheh përmbledhjen.", "Die Aufgabe liegt bei der Person; die Führungskraft sieht die Übersicht.") },
        ] },
        { type: "p", text: x(
          "The article sets a rule: the first two degrees are not allowed, and for each monkey manager and employee agree on degree three, four or five. HBR republished the piece as a classic in 1999, with a commentary by Stephen Covey.",
          "Artikulli vendos një rregull: dy shkallët e para nuk lejohen, dhe për çdo majmun menaxheri dhe punonjësi bien dakord për shkallën tre, katër ose pesë. HBR e ribotoi artikullin si klasik në 1999, me një koment të Stephen Covey-t.",
          "Der Artikel stellt eine Regel auf: Die ersten beiden Stufen sind nicht erlaubt; für jeden Affen vereinbaren Führungskraft und Mitarbeitende Stufe drei, vier oder fünf. HBR druckte den Text 1999 als Klassiker erneut, mit einem Kommentar von Stephen Covey.") },
        { type: "callout", reading: true, text: x(
          "Delegating is not giving away a task. It is agreeing how far the other person may go before they need you.",
          "Delegimi nuk është dhënia e një detyre. Është marrëveshja se deri ku mund të shkojë tjetri para se t'i duhesh ti.",
          "Delegieren heißt nicht, eine Aufgabe wegzugeben. Es heißt zu vereinbaren, wie weit die andere Person gehen darf, bevor sie Sie braucht.") },
      ],
      note: x(
        "The five degrees are Oncken and Wass's, in our words; the descriptions are the editors'.",
        "Pesë shkallët janë të Oncken-it dhe Wass-it, me fjalët tona; përshkrimet janë të redaksisë.",
        "Die fünf Stufen stammen von Oncken und Wass, in unseren Worten; die Beschreibungen von der Redaktion."),
      source: ["oncken-wass-1974"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("Who gets", "Kujt i jepet", "Wer etwas"), x("to decide", "vendimi", "entscheiden darf")],
      lead: x(
        "In 1986 Carrie Leana studied 44 supervisors and 198 claims adjusters in 19 offices of an insurer, and measured delegation by the amount an adjuster could settle alone.",
        "Në 1986, Carrie Leana studioi 44 mbikëqyrës dhe 198 vlerësues dëmesh në 19 zyra të një kompanie sigurimesh, dhe e mati delegimin me shumën që një vlerësues mund ta mbyllte vetë.",
        "1986 untersuchte Carrie Leana 44 Vorgesetzte und 198 Schadenregulierer in 19 Büros eines Versicherers und maß Delegation an dem Betrag, den ein Regulierer allein abschließen durfte."),
      blocks: [
        { type: "lists", cols: [
          { h: x("What made supervisors delegate", "Çfarë i shtyu mbikëqyrësit të delegonin", "Was Vorgesetzte delegieren ließ"), items: [
            x("How they saw the employee", "Si e shihnin punonjësin", "Wie sie die Person einschätzten"),
            x("How heavy their own workload was", "Sa e rëndë ishte ngarkesa e tyre", "Wie hoch ihre eigene Arbeitslast war"),
            x("How important the decision was", "Sa i rëndësishëm ishte vendimi", "Wie wichtig die Entscheidung war"),
          ] },
          { h: x("What did not", "Çfarë nuk ndikoi", "Was nicht"), accent: true, items: [
            x("The supervisor's personality", "Personaliteti i mbikëqyrësit", "Die Persönlichkeit der Vorgesetzten"),
            x("A general taste for sharing power", "Një prirje e përgjithshme për ta ndarë pushtetin", "Eine allgemeine Neigung, Macht zu teilen"),
          ] },
        ] },
        { type: "p", text: x(
          "In 1999 Gary Yukl and Ping Ping Fu found that managers delegated more to people who were competent, shared the goals of the task, had worked with them longer and got on well with them. Many were reluctant to hand over important decisions, or to give an important task to someone without experience.",
          "Në 1999, Gary Yukl dhe Ping Ping Fu gjetën se menaxherët delegonin më shumë te njerëzit që ishin të aftë, ndanin qëllimet e detyrës, kishin punuar më gjatë me ta dhe kishin marrëdhënie të mirë me ta. Shumë ngurronin të jepnin vendime të rëndësishme, ose t'ia besonin një detyrë të rëndësishme dikujt pa përvojë.",
          "1999 stellten Gary Yukl und Ping Ping Fu fest, dass Führungskräfte mehr an Menschen delegierten, die kompetent waren, die Ziele der Aufgabe teilten, schon länger mit ihnen arbeiteten und gut mit ihnen auskamen. Viele scheuten sich, wichtige Entscheidungen abzugeben oder eine wichtige Aufgabe jemandem ohne Erfahrung anzuvertrauen."),
        },
        { type: "p", text: x(
          "Across countries, Nicholas Bloom, Raffaella Sadun and John Van Reenen studied almost 4,000 firms. Those based in regions with high trust gave plant managers more say over hiring, investment, production and sales. Firms in the US and Northern Europe were the most decentralised, those in Southern Europe and Asia the most centralised.",
          "Nicholas Bloom, Raffaella Sadun dhe John Van Reenen studiuan afro 4.000 firma në vende të ndryshme. Ato me seli në rajone me besim të lartë u linin drejtuesve të fabrikave më shumë fjalë në punësim, investime, prodhim dhe shitje. Firmat në SHBA dhe në Evropën Veriore ishin më të decentralizuarat, ato në Evropën Jugore dhe në Azi më të centralizuarat.",
          "Länderübergreifend untersuchten Nicholas Bloom, Raffaella Sadun und John Van Reenen fast 4.000 Firmen. Wer seinen Sitz in Regionen mit hohem Vertrauen hatte, ließ Werksleitern mehr Mitsprache bei Einstellungen, Investitionen, Produktion und Vertrieb. Firmen in den USA und Nordeuropa waren am stärksten dezentralisiert, jene in Südeuropa und Asien am stärksten zentralisiert.") },
        { type: "callout", reading: true, text: x(
          "In all three studies the answer lies less in the manager's character than in trust, and in what the manager knows about the person. Both can be built, one task at a time.",
          "Në të tri studimet, përgjigjja qëndron më pak te karakteri i menaxherit dhe më shumë te besimi, si dhe te ajo që menaxheri di për personin. Të dyja ndërtohen, detyrë pas detyre.",
          "In allen drei Studien liegt die Antwort weniger im Charakter der Führungskraft als im Vertrauen und in dem, was sie über die Person weiß. Beides lässt sich aufbauen, Aufgabe für Aufgabe.") },
      ],
      source: ["leana-1986", "yukl-fu-1999", "bloom-2012"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie es gemessen wird"),
      title: [x("Hours freed,", "Orët e liruara,", "Gewonnene Stunden,"), x("load carried", "ngarkesa e marrë", "getragene Last")],
      lead: x(
        "Delegation can be measured twice: in the hours the manager gets back, and in how the person who takes on the task carries it.",
        "Delegimi matet dy herë: në orët që i kthehen menaxherit, dhe në mënyrën si e mban detyrën personi që e merr.",
        "Delegieren lässt sich zweimal messen: an den Stunden, die die Führungskraft zurückgewinnt, und daran, wie die Person, die die Aufgabe übernimmt, sie trägt."),
      blocks: [
        { type: "p", text: x(
          "A meta-analysis of 105 samples linked empowering leaders with better performance, more help beyond the job and more creativity. A 2016 study added a warning: some empowering behaviours also raised the strain people felt from their job. Its authors speak of two faces, one that enables and one that burdens.",
          "Një meta-analizë me 105 mostra i lidhi drejtuesit që i fuqizojnë njerëzit me rendiment më të mirë, më shumë ndihmë përtej detyrës dhe më shumë krijimtari. Një studim i 2016 shtoi një paralajmërim: disa sjellje fuqizuese rritën edhe tensionin që njerëzit ndienin nga puna. Autorët e tij flasin për dy fytyra, njëra që aftëson dhe tjetra që rëndon.",
          "Eine Metaanalyse mit 105 Stichproben brachte ermächtigende Führung mit besserer Leistung, mehr Hilfsbereitschaft über die eigene Aufgabe hinaus und mehr Kreativität in Verbindung. Eine Studie von 2016 fügte eine Warnung hinzu: Manches ermächtigende Verhalten erhöhte auch die Anspannung, die Menschen durch ihre Arbeit spürten. Die Autoren sprechen von zwei Gesichtern, einem, das befähigt, und einem, das belastet.") },
        { type: "steps", items: [
          { h: x("Log one week", "Shëno një javë", "Eine Woche protokollieren"), p: x("Every task over 15 minutes, with the time it took.", "Çdo detyrë mbi 15 minuta, me kohën që mori.", "Jede Aufgabe über 15 Minuten, mit der Zeit, die sie gekostet hat.") },
          { h: x("Drop, delegate or redesign", "Hiq, delego ose rindërto", "Streichen, delegieren, neu gestalten"), p: x("Mark each task, as Birkinshaw and Cohen suggest.", "Shëno secilën detyrë, siç sugjerojnë Birkinshaw dhe Cohen.", "Markieren Sie jede Aufgabe, wie Birkinshaw und Cohen vorschlagen.") },
          { h: x("Agree the degree", "Bie dakord për shkallën", "Die Stufe vereinbaren"), p: x("Three, four or five, and the support that comes with it.", "Tre, katër ose pesë, dhe mbështetja që vjen me të.", "Drei, vier oder fünf, und die Unterstützung, die dazugehört.") },
          { h: x("Count again in a month", "Numëro sërish pas një muaji", "Nach einem Monat neu zählen"), p: x("Hours freed, and how the person feels about the load.", "Orët e liruara, dhe si e ndien personi ngarkesën.", "Gewonnene Stunden, und wie die Person die Last empfindet.") },
        ] },
        { type: "example", label: x("Hypothetical example, a manager's week", "Shembull hipotetik, java e një menaxheri", "Hypothetisches Beispiel, die Woche einer Führungskraft"), rows: [
          { k: x("Logged", "Të shënuara", "Protokolliert"), v: x("45 hours in the week", "45 orë në javë", "45 Stunden in der Woche") },
          { k: x("Can go", "Mund të hiqen", "Kann weg"), v: x("12 hours, to drop or delegate", "12 orë, për t'u hequr ose deleguar", "12 Stunden, zu streichen oder zu delegieren") },
          { k: x("A month later", "Pas një muaji", "Nach einem Monat"), v: x("6 hours handed over, with a weekly check-in", "6 orë të dhëna, me një kontroll javor", "6 Stunden übergeben, mit wöchentlicher Abstimmung") },
        ], text: x("Half the list in the first month, so that support can keep pace. The numbers are made up.", "Gjysma e listës në muajin e parë, që mbështetja të mbajë ritmin. Numrat janë të sajuar.", "Die Hälfte der Liste im ersten Monat, damit die Unterstützung Schritt halten kann. Die Zahlen sind erfunden.") },
      ],
      note: x("Steps and example: the editors.", "Hapat dhe shembulli: redaksia.", "Schritte und Beispiel: die Redaktion."),
      source: ["lee-willis-tian-2018", "cheong-2016", "birkinshaw-cohen-2013"],
    },
    {
      id: "tool", more: "61-resellers",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The", "Karta", "Die"), x("delegation card", "e delegimit", "Delegationskarte")],
      lead: x(
        "One card for each task you hand over. Fill it in together, keep a copy each, and look at it again at the first check-in.",
        "Një kartë për çdo detyrë që jep. Plotësoje bashkë me personin që e merr; secili mban një kopje, dhe karta rishikohet në kontrollin e parë.",
        "Eine Karte für jede Aufgabe, die Sie übergeben. Füllen Sie sie gemeinsam aus, beide behalten eine Kopie, und beim ersten Abstimmungstermin nehmen Sie sie wieder zur Hand."),
      blocks: [
        { type: "form", items: [
          { h: x("The task", "Detyra", "Die Aufgabe"), hint: x("one sentence, starting with a verb", "një fjali, që nis me folje", "ein Satz, der mit einem Verb beginnt") },
          { h: x("Done means", "E kryer do të thotë", "Erledigt heißt"), hint: x("the result you will both look at", "rezultati që do ta shihni të dy", "das Ergebnis, auf das Sie beide schauen"), lines: 2 },
          { h: x("Degree of initiative", "Shkalla e iniciativës", "Stufe der Initiative"), hint: x("3 recommend · 4 act and tell at once · 5 act and report", "3 propozon · 4 vepron dhe njofton menjëherë · 5 vepron dhe raporton", "3 vorschlagen · 4 handeln und sofort melden · 5 handeln und berichten") },
          { h: x("Limits", "Kufijtë", "Grenzen"), hint: x("money, time, people: where you need me", "para, kohë, njerëz: ku të duhem unë", "Geld, Zeit, Menschen: wo du mich brauchst") },
          { h: x("Support", "Mbështetja", "Unterstützung"), hint: x("what you get from me, and who else can help", "çfarë merr nga unë, dhe kush tjetër mund të ndihmojë", "was du von mir bekommst und wer sonst helfen kann") },
          { h: x("Check-ins", "Kontrollet", "Abstimmungen"), hint: x("dates, short, until the task is yours", "datat, takime të shkurtra, derisa detyra të jetë e jotja", "Termine, kurz, bis die Aufgabe deine ist") },
        ] },
      ],
      note: x(
        "Proposed by the editors; the degrees of initiative follow Oncken and Wass (1974).",
        "Praktikë që e propozon redaksia; shkallët e iniciativës ndjekin Oncken-in dhe Wass-in (1974).",
        "Ein Vorschlag der Redaktion; die Stufen der Initiative folgen Oncken und Wass (1974)."),
      source: ["oncken-wass-1974"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
