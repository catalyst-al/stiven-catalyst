// Management Review, No. 70: Organisational justice: fair outcome, fair process, fair treatment. Block: People.
// Facts and their sources: docs/revista/management-review-nr-70.md. The correlations on page 4 are the corrected
// population correlations of Table 5 in Colquitt et al. (2001).
import { x } from "../common.js";

export default {
  number: 70,
  block: "people",
  // Page 2 is too full in German for the reading legend under the contents; it is left out there.
  tight: ["de"],
  date: x("October 2026", "Tetor 2026", "Oktober 2026"),
  theme: [x("Organisational", "Drejtësia", "Gerechtigkeit"), x("justice", "në organizatë", "im Unternehmen")],
  sub: x(
    "Four kinds of fairness and how they were told apart, what 183 studies tie to the boss and to the organisation, Leventhal's six rules for a fair process, nurses who slept better when their supervisors were trained, twenty questions, and a card for one decision.",
    "Katër llojet e drejtësisë dhe si u ndanë, çfarë lidhin 183 studime me shefin dhe me organizatën, gjashtë rregullat e Leventhal-it për një proces të drejtë, infermieret që flinin më mirë kur u trajnuan mbikëqyrësit, njëzet pyetje, dhe një kartë për një vendim.",
    "Vier Arten von Gerechtigkeit und wie die Forschung sie auseinanderhielt, was 183 Studien mit Chef und Organisation verbinden, Leventhals sechs Regeln für ein faires Verfahren, Pflegekräfte, die nach dem Training ihrer Vorgesetzten besser schliefen, zwanzig Fragen und eine Karte für eine Entscheidung."),
  seo: x(
    "Organisational justice: Colquitt's four dimensions, what 183 studies show, Leventhal's six rules, a supervisor training study with 467 nurses, and a card.",
    "Drejtësia në organizatë: katër dimensionet e Colquitt-it, çfarë tregojnë 183 studime, rregullat e Leventhal-it, trajnimi i mbikëqyrësve dhe një kartë.",
    "Gerechtigkeit im Unternehmen: Colquitts vier Dimensionen, was 183 Studien zeigen, Leventhals sechs Regeln, ein Training für Vorgesetzte und eine Karte."),
  feature: x(
    "Jason Colquitt tested whether people tell apart four kinds of fairness, and they do. Issue 70 shows, from a meta-analysis of 183 studies, which kinds are tied to the boss and which to the organisation, and sets out Gerald Leventhal's six rules for a fair process, which matters most when the outcome is bad. Then come nurses whose pay was cut while their supervisors learned to treat and inform them fairly, Colquitt's twenty questions, and a card for checking one decision.",
    "Jason Colquitt-i provoi nëse njerëzit dallojnë katër lloje drejtësie, dhe ata i dallojnë. Numri 70 tregon, me një meta-analizë të 183 studimeve, cilat lloje lidhen me shefin dhe cilat me organizatën, dhe shtjellon gjashtë rregullat e Gerald Leventhal-it për një proces të drejtë, që peshon më shumë kur rezultati është i keq. Pastaj vijnë infermieret që panë pagën të ulej, ndërsa mbikëqyrësit e tyre mësonin t'i trajtonin dhe t'i informonin drejt, njëzet pyetjet e Colquitt-it, dhe një kartë për të kontrolluar një vendim.",
    "Jason Colquitt prüfte, ob Menschen vier Arten von Gerechtigkeit unterscheiden, und sie tun es. Ausgabe 70 zeigt anhand einer Metaanalyse von 183 Studien, welche Arten mit der Führungskraft und welche mit der Organisation verbunden sind, und stellt Gerald Leventhals sechs Regeln für ein faires Verfahren vor, das gerade bei schlechtem Ergebnis zählt. Danach geht es um Pflegekräfte, deren Lohn sank, während ihre Vorgesetzten lernten, fair zu behandeln und zu informieren, um Colquitts zwanzig Fragen und um eine Karte, mit der Sie eine Entscheidung prüfen."),
  figure: { n: "183", by: "Colquitt et al., 2001", t: x(
    "studies on fairness at work, published from 1975 on, combined in a meta-analysis that set four kinds of justice side by side.",
    "studime për drejtësinë në punë, të botuara nga 1975 e këtej, të bashkuara në një meta-analizë që vuri katër llojet e drejtësisë krah për krah.",
    "Studien zur Gerechtigkeit bei der Arbeit, erschienen ab 1975, zusammengeführt in einer Metaanalyse, die vier Arten der Gerechtigkeit nebeneinanderstellte.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("Four kinds of fair", "Katër lloje drejtësie", "Vier Arten von Fairness") },
    { page: "research", kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: x("The pay cut and the night", "Paga e ulur dhe nata", "Die Lohnkürzung und die Nacht") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The fair decision card", "Karta e vendimit të drejtë", "Die Karte für faire Entscheidungen") },
  ],
  sources: ["oj-colquitt-2001", "oj-greenberg-1990", "oj-colquitt-meta-2001", "oj-kivimaki-2005", "oj-brockner-1996", "oj-greenberg-2006", "oj-colquitt-meta-2013", "oj-diaz-gracia-2014"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "People judge more than what they get. They judge how it was decided, how they were treated and what they were told. Those four judgements, what research ties to them and how a manager can check a decision against them before announcing it are the subject here.",
        "Njerëzit gjykojnë më shumë se atë që marrin. Gjykojnë si u vendos, si u trajtuan dhe çfarë u thanë. Këtu flitet për këto katër gjykime, për atë që kërkimi lidh me to, dhe për mënyrën si një menaxher mund ta kontrollojë një vendim me to para se ta njoftojë.",
        "Menschen beurteilen mehr als das, was sie bekommen: wie entschieden wurde, wie sie behandelt wurden und was man ihnen gesagt hat. Um diese vier Urteile geht es hier, um das, was die Forschung mit ihnen verbindet, und darum, wie eine Führungskraft eine Entscheidung vor der Bekanntgabe daran prüfen kann."),
      body: x(
        "In 2001 Jason Colquitt showed that people tell apart four kinds of justice: of the outcome, of the process, of respect and of explanation. A meta-analysis of 183 studies found that the last two shape above all how people rate their boss. Gerald Leventhal named six rules for a fair process, and 45 samples show that process counts most when the outcome is bad. In four hospitals, nurses whose pay was cut slept better when their supervisors had been trained in fair treatment.",
        "Më 2001, Jason Colquitt-i tregoi se njerëzit dallojnë katër lloje drejtësie: të rezultatit, të procesit, të respektit dhe të shpjegimit. Një meta-analizë e 183 studimeve gjeti se dy të fundit ndikojnë mbi të gjitha në vlerësimin që njerëzit i bëjnë shefit. Gerald Leventhal-i emërtoi gjashtë rregulla për një proces të drejtë, dhe 45 mostra tregojnë se procesi peshon më shumë kur rezultati është i keq. Në katër spitale, infermieret me pagë të ulur flinin më mirë kur mbikëqyrësit e tyre ishin trajnuar për trajtimin e drejtë.",
        "2001 zeigte Jason Colquitt, dass Menschen vier Arten von Gerechtigkeit unterscheiden: beim Ergebnis, beim Verfahren, beim Respekt und bei der Erklärung. Eine Metaanalyse von 183 Studien fand, dass die letzten beiden vor allem prägen, wie Beschäftigte ihre Führungskraft bewerten. Gerald Leventhal nannte sechs Regeln für ein faires Verfahren, und 45 Stichproben zeigen, dass das Verfahren bei schlechtem Ergebnis am meisten zählt. In vier Kliniken schliefen Pflegekräfte mit gekürztem Lohn besser, wenn ihre Vorgesetzten in fairem Umgang geschult waren."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("Four kinds", "Katër lloje", "Vier Arten"), x("of fair", "drejtësie", "von Fairness")],
      lead: x(
        "In 2001 Jason Colquitt wrote questions for each kind of justice the research had described and tested them twice, with students at a university and with staff of a car parts maker. Four separate factors fitted the answers better than two or three broader ones.",
        "Më 2001, Jason Colquitt-i shkroi pyetje për çdo lloj drejtësie që kishte përshkruar kërkimi dhe i provoi dy herë, me studentë në një universitet dhe me punonjës të një prodhuesi pjesësh makinash. Katër faktorë të veçantë u përshtatën me përgjigjet më mirë se dy ose tre faktorë më të gjerë.",
        "2001 schrieb Jason Colquitt Fragen zu jeder Art von Gerechtigkeit, die die Forschung beschrieben hatte, und testete sie zweimal, mit Studierenden einer Universität und mit Beschäftigten eines Autozulieferers. Vier getrennte Faktoren passten besser zu den Antworten als zwei oder drei breitere."),
      blocks: [
        { type: "cards", cols: 2, items: [
          { h: x("Distributive: the outcome", "Shpërndarëse: rezultati", "Verteilung: das Ergebnis"), p: x("Does what I get match what I put in? Adams, 1965", "A përputhet ajo që marr me atë që jap? Adams, 1965", "Passt, was ich bekomme, zu dem, was ich gebe? Adams, 1965") },
          { h: x("Procedural: the process", "Procedurale: procesi", "Verfahren: der Prozess"), p: x("Was it decided by fair rules, with a voice? Thibaut & Walker, 1975; Leventhal, 1980", "A u vendos me rregulla të drejta, a u dëgjova? Thibaut & Walker, 1975; Leventhal, 1980", "Wurde nach fairen Regeln entschieden, mit Mitsprache? Thibaut & Walker, 1975; Leventhal, 1980") },
          { h: x("Interpersonal: respect", "Ndërpersonale: respekti", "Interpersonal: Respekt"), p: x("Was I treated with politeness, dignity and respect? Bies & Moag, 1986", "A u trajtova me mirësjellje, dinjitet dhe respekt? Bies & Moag, 1986", "Wurde ich höflich, würdevoll und respektvoll behandelt? Bies & Moag, 1986") },
          { h: x("Informational: explanation", "Informative: shpjegimi", "Information: die Erklärung"), p: x("Was I told why, candidly and in time? Greenberg, 1993", "A më thanë pse, sinqerisht dhe në kohë? Greenberg, 1993", "Wurde mir offen und rechtzeitig gesagt, warum? Greenberg, 1993") },
        ] },
        { type: "p", text: x(
          "In 1990 Jerald Greenberg described the field as a literature “grown around attempts to describe and explain the role of fairness as a consideration in the workplace”. Bies and Moag had called the last two together interactional justice; Greenberg proposed splitting them, and Colquitt's data agreed.",
          "Më 1990, Jerald Greenberg-u e përshkroi fushën si një literaturë “të rritur rreth përpjekjeve për të përshkruar dhe shpjeguar rolin e drejtësisë si një konsideratë në vendin e punës”. Bies dhe Moag i kishin quajtur dy të fundit bashkë drejtësi ndërvepruese; Greenberg-u propozoi t'i ndante, dhe të dhënat e Colquitt-it i dhanë të drejtë.",
          "1990 beschrieb Jerald Greenberg das Feld als Literatur, „rund um Versuche gewachsen, die Rolle der Fairness als Gesichtspunkt am Arbeitsplatz zu beschreiben und zu erklären“. Bies und Moag hatten die letzten beiden zusammen interaktionale Gerechtigkeit genannt; Greenberg schlug vor, sie zu trennen, und Colquitts Daten gaben ihm recht.") },
        { type: "callout", reading: true, text: x(
          "A decision can be fair in one way and unfair in three. People notice all four.",
          "Një vendim mund të jetë i drejtë në një mënyrë dhe i padrejtë në tri. Njerëzit i vënë re të katërta.",
          "Eine Entscheidung kann in einer Hinsicht fair sein und in drei unfair. Die Betroffenen bemerken alle vier.") },
      ],
      note: x(
        "Justice here means perceived fairness, as the people affected judge it. The years name the works that introduced each idea, as cited by Colquitt et al. (2001); we have not read those works themselves.",
        "Drejtësia këtu do të thotë drejtësia e perceptuar, siç e gjykojnë të prekurit. Vitet emërtojnë veprat që e prezantuan secilën ide, siç i citojnë Colquitt et al. (2001); vetë ato vepra nuk i kemi lexuar.",
        "Gerechtigkeit heißt hier wahrgenommene Fairness, wie die Betroffenen sie beurteilen. Die Jahre nennen die Arbeiten, die jede Idee einführten, wie Colquitt et al. (2001) sie zitieren; die Arbeiten selbst lagen uns nicht vor."),
      source: ["oj-colquitt-2001", "oj-greenberg-1990", "oj-colquitt-meta-2001"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("The boss or", "Shefi apo", "Chef oder"), x("the organisation", "organizata", "Organisation")],
      lead: x(
        "Jason Colquitt and four colleagues combined 183 studies from 1975 on. Bies and Moag had expected respect and explanation to shape how people see their boss, and process how they see the organisation. Corrected correlations:",
        "Jason Colquitt-i dhe katër kolegë bashkuan 183 studime nga 1975 e këtej. Bies dhe Moag prisnin që respekti dhe shpjegimi të ndikonin te mënyra si shihet shefi, ndërsa procesi te mënyra si shihet organizata. Korrelacionet e korrigjuara:",
        "Jason Colquitt und vier Kollegen fassten 183 Studien ab 1975 zusammen. Bies und Moag hatten erwartet, Respekt und Erklärung prägten das Bild der Führungskraft, das Verfahren das der Organisation. Korrigierte Korrelationen:"),
      blocks: [
        { type: "pairs", from: x("Commitment", "Përkushtimi", "Bindung"), to: x("Rating of the boss", "Vlerësimi i shefit", "Urteil über die Führung"), max: 100, source: ["oj-colquitt-meta-2001"],
          label: x("Correlation with commitment and with the rating of the boss, 2001", "Korrelacioni me përkushtimin dhe me vlerësimin e shefit, 2001", "Korrelation mit Bindung und Urteil über die Führung, 2001"),
          rows: [
            { k: x("Process", "Procesi", "Verfahren"), a: 57, an: x("0.57", "0,57", "0,57"), b: 64, bn: x("0.64", "0,64", "0,64") },
            { k: x("Outcome", "Rezultati", "Ergebnis"), a: 51, an: x("0.51", "0,51", "0,51"), b: 59, bn: x("0.59", "0,59", "0,59") },
            { k: x("Respect", "Respekti", "Respekt"), a: 19, an: x("0.19", "0,19", "0,19"), b: 62, bn: x("0.62", "0,62", "0,62"), alert: true },
            { k: x("Explanation", "Shpjegimi", "Erklärung"), a: 29, an: x("0.29", "0,29", "0,29"), b: 65, bn: x("0.65", "0,65", "0,65"), alert: true },
          ] },
        { type: "p", text: x(
          "Respect and explanation went with the rating of the boss far more than with commitment. Among 6,442 male British civil servants, followed 8.7 years on average, those reporting high justice at work had a lower risk of heart disease (hazard ratio 0.65).",
          "Respekti dhe shpjegimi lidheshin me vlerësimin e shefit shumë më tepër se me përkushtimin. Mes 6.442 nëpunësve civilë britanikë meshkuj, të ndjekur mesatarisht 8,7 vjet, ata me drejtësi të lartë në punë kishin rrezik më të ulët për sëmundje të zemrës (raporti i rrezikut 0,65).",
          "Respekt und Erklärung hingen viel stärker mit dem Urteil über die Führung zusammen als mit der Bindung. Unter 6.442 männlichen britischen Beamten, im Mittel 8,7 Jahre begleitet, hatten jene, die ihre Arbeit als sehr gerecht erlebten, ein geringeres Herzrisiko (Hazard Ratio 0,65).") },
        { type: "callout", reading: true, text: x(
          "The organisation writes the procedure. The team judges the person who delivers it.",
          "Procedurën e shkruan organizata. Ekipi gjykon personin që e zbaton.",
          "Das Verfahren schreibt die Organisation. Das Team beurteilt, wer es umsetzt.") },
      ],
      note: x(
        "Mostly self-reports, which can inflate the links. Respect and commitment: only two studies. The heart study shows a link, not a cause.",
        "Kryesisht vetëdeklarime, që mund t'i fryjnë lidhjet. Respekti dhe përkushtimi: vetëm dy studime. Studimi i zemrës tregon lidhje, jo shkak.",
        "Meist Selbstauskünfte, die Zusammenhänge überhöhen können. Respekt und Bindung: nur zwei Studien. Die Herzstudie zeigt einen Zusammenhang, keine Ursache."),
      source: ["oj-colquitt-meta-2001", "oj-kivimaki-2005"],
    },
    {
      id: "model", more: "leading-people-without-losing-the-person",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Six rules for", "Gjashtë rregulla", "Sechs Regeln für"), x("a fair process", "për një proces të drejtë", "ein faires Verfahren")],
      lead: x(
        "Thibaut and Walker found in 1975 that people in disputes accept losing control over the decision as long as they keep control over the process: time to make their case. In 1980 Gerald Leventhal widened the idea into six rules a procedure should meet to be seen as fair.",
        "Thibaut dhe Walker gjetën më 1975 se palët në një mosmarrëveshje pranojnë të humbin kontrollin mbi vendimin për sa kohë ruajnë kontrollin mbi procesin: kohën për ta paraqitur rastin e tyre. Më 1980, Gerald Leventhal-i e zgjeroi idenë në gjashtë rregulla që duhet t'i plotësojë një procedurë për t'u parë si e drejtë.",
        "Thibaut und Walker fanden 1975, dass Streitparteien die Kontrolle über die Entscheidung abgeben, solange sie die Kontrolle über das Verfahren behalten: Zeit, ihre Sicht darzulegen. 1980 erweiterte Gerald Leventhal die Idee zu sechs Regeln, die ein Verfahren erfüllen sollte, um als fair zu gelten."),
      blocks: [
        { type: "cards", cols: 3, items: [
          { h: x("Consistent", "E njëtrajtshme", "Einheitlich"), p: x("the same for everyone and over time", "e njëjta për të gjithë dhe në çdo kohë", "gleich für alle und über die Zeit") },
          { h: x("Free of bias", "Pa paragjykim", "Unvoreingenommen"), p: x("no one deciding has a stake in the result", "askush që vendos s'ka interes te rezultati", "niemand, der entscheidet, hat ein Interesse am Ergebnis") },
          { h: x("Accurate", "E saktë", "Genau"), p: x("based on correct information", "e mbështetur në informacion të saktë", "auf richtigen Informationen beruhend") },
          { h: x("Correctable", "E korrigjueshme", "Korrigierbar"), p: x("a way to fix a wrong decision", "një rrugë për të ndrequr një vendim të gabuar", "ein Weg, eine falsche Entscheidung zu ändern") },
          { h: x("Ethical", "Etike", "Ethisch"), p: x("in line with standards of ethics", "në përputhje me standardet etike", "im Einklang mit ethischen Maßstäben") },
          { h: x("Representative", "Përfaqësuese", "Repräsentativ"), p: x("the views of those affected are heard", "dëgjohen pikëpamjet e të prekurve", "die Sicht der Betroffenen wird gehört") },
        ] },
        { type: "p", text: x(
          "Joel Brockner and Batia Wiesenfeld reviewed 45 samples in 1996: the process mattered most to people's reactions when the outcome was poor or felt unfair, and the outcome mattered most when the process was poor.",
          "Joel Brockner dhe Batia Wiesenfeld shqyrtuan 45 mostra më 1996: procesi peshonte më shumë te reagimet e njerëzve kur rezultati ishte i dobët ose dukej i padrejtë, dhe rezultati peshonte më shumë kur procesi ishte i dobët.",
          "1996 werteten Joel Brockner und Batia Wiesenfeld 45 Stichproben aus: Das Verfahren zählte für die Reaktionen am meisten, wenn das Ergebnis schlecht oder unfair war, und das Ergebnis zählte am meisten, wenn das Verfahren schlecht war.") },
        { type: "callout", reading: true, text: x(
          "When you cannot give people the outcome they want, the process is what you still control.",
          "Kur nuk mund t'u japësh njerëzve rezultatin që duan, procesi mbetet ende në dorën tënde.",
          "Wenn Sie Menschen nicht das gewünschte Ergebnis geben können, bleibt Ihnen immer noch das Verfahren.") },
      ],
      note: x(
        "Thibaut and Walker studied legal disputes; Leventhal carried the idea into organisations. Both are summarised from Colquitt et al. (2001); the short labels of the rules are ours.",
        "Thibaut dhe Walker studiuan mosmarrëveshje ligjore; Leventhal-i e çoi idenë në organizata. Të dyja përmblidhen nga Colquitt et al. (2001); emrat e shkurtër të rregullave janë tanët.",
        "Thibaut und Walker untersuchten Rechtsstreitigkeiten; Leventhal übertrug die Idee auf Organisationen. Beides ist nach Colquitt et al. (2001) zusammengefasst; die Kurznamen der Regeln stammen von uns."),
      source: ["oj-colquitt-meta-2001", "oj-brockner-1996"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("The pay cut", "Paga e ulur", "Die Lohnkürzung"), x("and the night", "dhe nata", "und die Nacht")],
      lead: x(
        "Jerald Greenberg followed 467 nurses in four US hospitals of one group. At two, a new pay system cut pay by about 10%. At one hospital in each pair, supervisors had two four-hour sessions on fair treatment: dignity and respect, and full, accurate explanations.",
        "Jerald Greenberg-u ndoqi 467 infermiere në katër spitale amerikane të një grupi. Në dy prej tyre, një sistem i ri page e uli pagën rreth 10%. Në një spital nga secila palë, mbikëqyrësit ndoqën dy seanca katërorëshe për trajtimin e drejtë: dinjitet dhe respekt, shpjegime të plota e të sakta.",
        "Jerald Greenberg begleitete 467 Pflegekräfte in vier US-Kliniken eines Trägers. In zweien senkte ein neues Lohnsystem den Lohn um etwa 10 %. In je einer Klinik pro Paar hatten die Vorgesetzten zwei vierstündige Schulungen zu fairem Umgang: Würde und Respekt, vollständige, genaue Erklärungen."),
      blocks: [
        { type: "matrix", y: x("Pay", "Paga", "Lohn"), x: x("Supervisors trained", "Mbikëqyrësit të trajnuar", "Leitung geschult"), cells: [
          { h: x("Cut, no training", "E ulur, pa trajnim", "Gekürzt, ohne Training"), tone: "red", where: x("pay cut · not trained", "pagë e ulur · pa trajnim", "Lohn gekürzt · nicht geschult"), p: x("Insomnia fell only a little; six months on, still clearly above all others.", "Pagjumësia ra pak; pas gjashtë muajsh, ende qartë mbi të gjithë të tjerët.", "Schlaflosigkeit sank kaum; nach sechs Monaten noch klar über allen anderen.") },
          { h: x("Cut, training", "E ulur, me trajnim", "Gekürzt, mit Training"), tone: "blue", where: x("pay cut · trained", "pagë e ulur · me trajnim", "Lohn gekürzt · geschult"), p: x("Insomnia fell steeply within four weeks; six months on, only slightly above no cut.", "Pagjumësia ra fort brenda katër javëve; pas gjashtë muajsh, pak mbi atë pa ulje page.", "Schlaflosigkeit sank binnen vier Wochen stark; nach sechs Monaten kaum über der ohne Kürzung.") },
          { h: x("Unchanged", "E pandryshuar", "Unverändert"), tone: "dim", where: x("pay unchanged · not trained", "pagë e pandryshuar · pa trajnim", "Lohn gleich · nicht geschult"), p: x("Less insomnia than with a cut.", "Më pak pagjumësi se me pagë të ulur.", "Weniger Schlaflosigkeit als mit Kürzung.") },
          { h: x("Unchanged", "E pandryshuar", "Unverändert"), tone: "dim", where: x("pay unchanged · trained", "pagë e pandryshuar · me trajnim", "Lohn gleich · geschult"), p: x("Less insomnia than with a cut.", "Më pak pagjumësi se me pagë të ulur.", "Weniger Schlaflosigkeit als mit Kürzung.") },
        ] },
        { type: "p", text: x(
          "After the cut, insomnia rose to about 6 on a 7-point scale, roughly double. The training was “nothing magical”, Greenberg said. A 2013 meta-analysis of 493 samples links justice to performance and helping, through trust and commitment.",
          "Pas uljes, pagjumësia u ngrit në rreth 6 në një shkallë 7-pikëshe, afërsisht dyfish. Trajnimi nuk kishte “asgjë magjike”, tha Greenberg-u. Një meta-analizë e vitit 2013 me 493 mostra e lidh drejtësinë me performancën dhe ndihmën, përmes besimit dhe përkushtimit.",
          "Nach der Kürzung stieg die Schlaflosigkeit auf etwa 6 auf einer 7er-Skala, rund das Doppelte. Am Training sei „nichts Magisches“, sagte Greenberg. Eine Metaanalyse von 2013 mit 493 Stichproben verbindet Gerechtigkeit mit Leistung und Hilfe, über Vertrauen und Bindung.") },
        { type: "callout", reading: true, text: x(
          "Fair treatment did not undo the cut. It changed how hard it hit.",
          "Trajtimi i drejtë nuk e zhbëri uljen. Ndryshoi sa rëndë goditi.",
          "Fairer Umgang machte die Kürzung nicht rückgängig. Er änderte, wie hart sie traf.") },
      ],
      note: x(
        "Self-reported insomnia, one hospital per condition; scale values from the 2006 news release.",
        "Pagjumësi e vetëdeklaruar, një spital për variant; vlerat nga njoftimi i vitit 2006.",
        "Selbstberichtete Schlaflosigkeit, eine Klinik je Bedingung; Werte aus der Pressemitteilung 2006."),
      source: ["oj-greenberg-2006", "oj-colquitt-meta-2013"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie es gemessen wird"),
      title: [x("Twenty", "Njëzet", "Zwanzig"), x("questions", "pyetje", "Fragen")],
      lead: x(
        "Colquitt's measure asks about one outcome, the procedure behind it and the person who carried it out. Each of the 20 questions is answered from 1, “to a small extent”, to 5, “to a large extent”. It has since been tested in other languages, Spanish among them.",
        "Mjeti i Colquitt-it pyet për një rezultat, për procedurën pas tij dhe për personin që e zbatoi. Secila nga 20 pyetjet merr përgjigje nga 1, “në masë të vogël”, deri në 5, “në masë të madhe”. Që atëherë është provuar edhe në gjuhë të tjera, mes tyre në spanjisht.",
        "Colquitts Fragebogen fragt nach einem Ergebnis, dem Verfahren dahinter und der Person, die es umgesetzt hat. Jede der 20 Fragen wird von 1, „in geringem Maß“, bis 5, „in hohem Maß“, beantwortet. Er wurde inzwischen in anderen Sprachen geprüft, darunter Spanisch."),
      blocks: [
        { type: "cards", cols: 2, items: [
          { h: x("Outcome · 4 questions", "Rezultati · 4 pyetje", "Ergebnis · 4 Fragen"), p: x("Does it reflect the effort you put in? Is it justified, given your performance?", "A e pasqyron përpjekjen që bëre? A justifikohet nga puna jote?", "Spiegelt es Ihren Einsatz? Ist es angesichts Ihrer Leistung gerechtfertigt?") },
          { h: x("Process · 7 questions", "Procesi · 7 pyetje", "Verfahren · 7 Fragen"), p: x("Could you express your views? Were the procedures consistent? Could you appeal?", "A mund t'i shprehje pikëpamjet? A ishin procedurat të njëtrajtshme? A mund ta apeloje?", "Konnten Sie Ihre Sicht äußern? Galt das Verfahren für alle gleich? Konnten Sie widersprechen?") },
          { h: x("Respect · 4 questions", "Respekti · 4 pyetje", "Respekt · 4 Fragen"), p: x("Were you treated with dignity? Did they refrain from improper remarks?", "A u trajtove me dinjitet? A u përmbajtën nga komentet e papërshtatshme?", "Wurden Sie würdevoll behandelt? Blieben unpassende Bemerkungen aus?") },
          { h: x("Explanation · 5 questions", "Shpjegimi · 5 pyetje", "Erklärung · 5 Fragen"), p: x("Were they candid? Did they explain the procedures thoroughly? Did details come in time?", "A ishin të sinqertë? A i shpjeguan plotësisht procedurat? A erdhën detajet në kohë?", "Waren sie offen? Haben sie das Verfahren gründlich erklärt? Kamen Details rechtzeitig?") },
        ] },
        { type: "example", label: x("Hypothetical example, a team after a new holiday rota", "Shembull hipotetik, një ekip pas një plani të ri pushimesh", "Hypothetisches Beispiel, ein Team nach einem neuen Urlaubsplan"), rows: [
          { k: x("Outcome", "Rezultati", "Ergebnis"), v: x("3.4 of 5", "3,4 nga 5", "3,4 von 5") },
          { k: x("Process · respect", "Procesi · respekti", "Verfahren · Respekt"), v: x("2.6 · 4.1", "2,6 · 4,1", "2,6 · 4,1") },
          { k: x("Explanation", "Shpjegimi", "Erklärung"), v: x("2.2 of 5", "2,2 nga 5", "2,2 von 5") },
        ], text: x("The team felt respected, yet no one heard why the rota changed or how to object. The scores are made up.", "Ekipi u ndie i respektuar, por askush nuk mësoi pse ndryshoi plani ose si mund ta kundërshtonte. Vlerat janë të sajuara.", "Das Team fühlte sich respektiert, doch niemand erfuhr, warum der Plan sich änderte oder wie man widersprechen kann. Die Werte sind erfunden.") },
      ],
      note: x(
        "The questions are shortened from Colquitt (2001), as reproduced in the Spanish validation (2014); the translations are ours. Ask anonymously and read the four scores apart.",
        "Pyetjet janë shkurtuar nga Colquitt (2001), siç i riprodhon validimi spanjoll (2014); përkthimet janë tonat. Pyet në mënyrë anonime dhe lexoji katër rezultatet veç e veç.",
        "Die Fragen sind gekürzt nach Colquitt (2001), wie die spanische Validierung (2014) sie wiedergibt; die Übersetzungen stammen von uns. Fragen Sie anonym und lesen Sie die vier Werte getrennt."),
      source: ["oj-colquitt-2001", "oj-diaz-gracia-2014"],
    },
    {
      id: "tool", tool: "/tools/kpi-diagnostic/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The fair", "Karta e vendimit", "Die Karte für faire"), x("decision card", "të drejtë", "Entscheidungen")],
      lead: x(
        "One decision that affects people: a rota, a bonus, a promotion, a new rule. Fill in the card before you announce it, and once more a week later, with what you heard back.",
        "Një vendim që prek njerëzit: një plan turnesh, një shpërblim, një ngritje në detyrë, një rregull i ri. Plotësoje kartën para se ta njoftosh, dhe edhe një herë një javë më vonë, me atë që dëgjove.",
        "Eine Entscheidung, die Menschen betrifft: ein Dienstplan, ein Bonus, eine Beförderung, eine neue Regel. Füllen Sie die Karte aus, bevor Sie die Entscheidung bekanntgeben, und eine Woche später noch einmal, mit den Rückmeldungen, die Sie erhalten haben."),
      blocks: [
        { type: "form", items: [
          { h: x("The decision", "Vendimi", "Die Entscheidung"), hint: x("what changes, for whom, from when", "çfarë ndryshon, për kë, nga kur", "was sich ändert, für wen, ab wann") },
          { h: x("Outcome", "Rezultati", "Ergebnis"), hint: x("which rule: contribution, equal shares or need; who gains, who loses", "cili rregull: kontributi, pjesë të barabarta apo nevoja; kush fiton, kush humbet", "welche Regel: Beitrag, gleiche Teile oder Bedarf; wer gewinnt, wer verliert") },
          { h: x("Process", "Procesi", "Verfahren"), hint: x("who was heard; same rule for all; facts checked; how to appeal", "kush u dëgjua; i njëjti rregull për të gjithë; faktet e kontrolluara; si apelohet", "wer gehört wurde; gleiche Regel für alle; Fakten geprüft; wie man widerspricht"), lines: 2 },
          { h: x("Respect", "Respekti", "Respekt"), hint: x("who tells whom, where, in what words", "kush i thotë kujt, ku, me cilat fjalë", "wer es wem sagt, wo, mit welchen Worten") },
          { h: x("Explanation", "Shpjegimi", "Erklärung"), hint: x("the real reasons, candidly, before people hear it elsewhere", "arsyet e vërteta, sinqerisht, para se njerëzit ta dëgjojnë gjetkë", "die wahren Gründe, offen, bevor die Leute es anderswo hören") },
          { h: x("A week later", "Një javë më vonë", "Eine Woche später"), hint: x("what came back; what we corrected", "çfarë u kthye; çfarë korrigjuam", "was zurückkam; was wir korrigiert haben") },
        ] },
      ],
      note: x(
        "The editors propose this card, built on Colquitt's four dimensions and Leventhal's rules. The KPI Diagnostic helps with a related question: whether a missed result comes from clarity, skill, capacity, process or ownership.",
        "Këtë kartë e propozon redaksia, mbi bazën e katër dimensioneve të Colquitt-it dhe rregullave të Leventhal-it. Diagnostikimi i KPI-së ndihmon me një pyetje të afërt: nëse një rezultat i humbur vjen nga qartësia, aftësia, kapaciteti, procesi apo përgjegjësia.",
        "Diese Karte schlägt die Redaktion vor, gestützt auf Colquitts vier Dimensionen und Leventhals Regeln. Die KPI-Diagnose hilft bei einer verwandten Frage: ob ein verfehltes Ergebnis an Klarheit, Können, Kapazität, Prozess oder Zuständigkeit liegt."),
      source: ["oj-colquitt-2001", "oj-colquitt-meta-2001"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
