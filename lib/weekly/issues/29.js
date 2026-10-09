// Management Review, No. 29: Burnout and workload. Block: People.
// Facts and their sources: docs/revista/management-review-nr-29.md. The issue describes a definition and the
// conditions of work; it gives no medical advice.
import { x, pc } from "../common.js";

export default {
  number: 29,
  block: "people",
  date: x("October 2026", "Tetor 2026", "Oktober 2026"),
  theme: [x("Burnout", "Burnout-i", "Burnout"), x("and workload", "dhe ngarkesa", "und Arbeitslast")],
  sub: x(
    "How often people feel burned out, pressure in Germany and Europe, what the WHO counts as burnout, Gallup's five factors, six areas of worklife, and a card for a talk about workload.",
    "Sa shpesh ndihen njerëzit të djegur nga puna, presioni në Gjermani e Evropë, çfarë quan OBSH burnout, pesë faktorët e Gallup, gjashtë fusha të punës, dhe një kartë për bisedën për ngarkesën.",
    "Wie oft sich Menschen ausgebrannt fühlen, Druck in Deutschland und Europa, was die WHO als Burnout zählt, Gallups fünf Faktoren, sechs Bereiche des Arbeitslebens und eine Karte für ein Gespräch."),
  seo: x(
    "Burnout and workload: Gallup's 28%, pressure in Germany and Europe, the WHO definition, five factors, six areas of worklife and a card for a talk.",
    "Burnout-i dhe ngarkesa: 28% e Gallup, presioni në Gjermani dhe Evropë, përkufizimi i OBSH, pesë faktorë, gjashtë fusha të punës dhe një kartë.",
    "Burnout und Arbeitslast: Gallups 28 %, Druck in Deutschland und Europa, die WHO-Definition, fünf Faktoren, sechs Bereiche und eine Karte."),
  feature: x(
    "Issue 29 starts with Gallup's finding that 28% of full-time employees feel burned out very often or always, follows deadline pressure in Germany and time pressure across Europe, sets out what the WHO counts as burnout, lists the five factors Gallup links to it and the six areas of worklife where job and person can be mismatched, and ends with a card for a talk about workload.",
    "Numri 29 nis me gjetjen e Gallup se 28% e punonjësve me kohë të plotë ndihen të djegur nga puna shumë shpesh ose gjithmonë, ndjek presionin e afateve në Gjermani dhe presionin e kohës në Evropë, shtjellon çfarë quan OBSH burnout, rendit pesë faktorët që Gallup lidh me të dhe gjashtë fushat e jetës në punë ku puna dhe njeriu mund të mos përputhen, dhe mbyllet me një kartë për bisedën për ngarkesën.",
    "Ausgabe 29 beginnt mit Gallups Befund, dass sich 28 % der Vollzeitbeschäftigten sehr oft oder immer ausgebrannt fühlen, verfolgt den Termindruck in Deutschland und den Zeitdruck in Europa, erklärt, was die WHO als Burnout zählt, nennt die fünf Faktoren, die Gallup damit verbindet, und die sechs Bereiche des Arbeitslebens, in denen Arbeit und Mensch nicht zusammenpassen können, und endet mit einer Karte für ein Gespräch über die Arbeitslast."),
  figure: { n: pc(28), by: "Gallup, 2020", t: x(
    "of full-time employees feel burned out at work very often or always, in a 2019 study of 12,658.",
    "e punonjësve me kohë të plotë ndihen të djegur nga puna shumë shpesh ose gjithmonë, në një studim të 2019 me 12.658 vetë.",
    "der Vollzeitbeschäftigten fühlen sich bei der Arbeit sehr oft oder immer ausgebrannt, in einer Studie von 2019 mit 12.658 Befragten.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("More than one in four", "Më shumë se një në katër", "Mehr als jeder Vierte") },
    { page: "model", kicker: x("The model", "Modeli", "Das Modell"),
      title: x("What the WHO counts", "Çfarë quan OBSH burnout", "Was die WHO zählt") },
    { page: "tool", kicker: x("Tool of the week", "Mjeti i javës", "Werkzeug der Woche"),
      title: x("The workload talk", "Biseda për ngarkesën", "Das Gespräch über die Arbeitslast") },
  ],
  sources: ["gallup-burnout-2020", "euosha-pulse-2025", "maslach-leiter-2016", "crawford-2010", "who-burnout-2019", "baua-stressreport-2020", "gallup-burnout-2018", "who-icd11-qd85"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Burnout is often treated as a personal problem. The WHO places it in the job: chronic stress at work that has not been managed. This issue looks at how common it is, what goes with it, and what a manager can change in the work.",
        "Burnout-i shpesh trajtohet si problem personal. OBSH e vendos te puna: stres kronik në punë që nuk është menaxhuar. Ky numër shikon sa i përhapur është, çfarë shkon bashkë me të, dhe çfarë mund të ndryshojë një menaxher te puna.",
        "Burnout wird oft als persönliches Problem behandelt. Die WHO verortet ihn in der Arbeit: chronischer Stress am Arbeitsplatz, der nicht bewältigt wurde. Diese Ausgabe zeigt, wie verbreitet Burnout ist, was damit einhergeht und was eine Führungskraft an der Arbeit ändern kann."),
      body: x(
        "In a 2019 Gallup study, 28% of full-time employees felt burned out very often or always. In Germany 48% often work under strong deadline or performance pressure; in Europe more than 40% report severe time pressure. The WHO counts burnout as an occupational phenomenon, not a medical condition. Gallup links it most strongly to unfair treatment, unmanageable workload, unclear roles, little support from the manager and unreasonable time pressure; Maslach and Leiter name six areas where job and person may not fit.",
        "Në një studim të Gallup të 2019, 28% e punonjësve me kohë të plotë ndiheshin të djegur nga puna shumë shpesh ose gjithmonë. Në Gjermani 48% punojnë shpesh nën presion të fortë afatesh ose rendimenti; në Evropë mbi 40% raportojnë presion të rëndë kohe. OBSH e quan burnout-in fenomen profesional, jo gjendje mjekësore. Gallup e lidh më fort me trajtimin e padrejtë, ngarkesën e pamenaxhueshme, rolet e paqarta, mbështetjen e pakët nga menaxheri dhe presionin e paarsyeshëm të kohës; Maslach dhe Leiter emërtojnë gjashtë fusha ku puna dhe njeriu mund të mos përputhen.",
        "In einer Gallup-Studie von 2019 fühlten sich 28 % der Vollzeitbeschäftigten sehr oft oder immer ausgebrannt. In Deutschland arbeiten 48 % häufig unter starkem Termin- oder Leistungsdruck; in Europa berichten über 40 % von hohem Zeitdruck. Die WHO zählt Burnout als berufsbezogenes Phänomen, nicht als medizinischen Zustand. Gallup verbindet Burnout am stärksten mit unfairer Behandlung, nicht zu bewältigender Arbeitslast, unklaren Rollen, wenig Unterstützung durch die Führungskraft und unangemessenem Zeitdruck; Maslach und Leiter nennen sechs Bereiche, in denen Arbeit und Mensch nicht zusammenpassen."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("More than", "Më shumë se", "Mehr als"), x("one in four", "një në katër", "jeder Vierte")],
      lead: x(
        "In a 2019 study Gallup asked 12,658 full-time employees how often they feel burned out at work. 28% answered very often or always; 76% at least sometimes.",
        "Në një studim të 2019, Gallup pyeti 12.658 punonjës me kohë të plotë sa shpesh ndihen të djegur nga puna. 28% u përgjigjën shumë shpesh ose gjithmonë; 76% të paktën ndonjëherë.",
        "In einer Studie von 2019 fragte Gallup 12.658 Vollzeitbeschäftigte, wie oft sie sich bei der Arbeit ausgebrannt fühlen. 28 % antworteten sehr oft oder immer, 76 % zumindest manchmal."),
      blocks: [
        { type: "hbars", max: 50, source: ["gallup-burnout-2020"],
          label: x("How often full-time employees feel burned out at work (2019)", "Sa shpesh ndihen të djegur nga puna punonjësit me kohë të plotë (2019)", "Wie oft sich Vollzeitbeschäftigte bei der Arbeit ausgebrannt fühlen (2019)"),
          items: [
            { k: x("Always", "Gjithmonë", "Immer"), v: 7, n: pc(7), alert: true },
            { k: x("Very often", "Shumë shpesh", "Sehr oft"), v: 21, n: pc(21), alert: true },
            { k: x("Sometimes", "Ndonjëherë", "Manchmal"), v: 48, n: pc(48) },
            { k: x("Rarely", "Rrallë", "Selten"), v: 20, n: pc(20) },
            { k: x("Never", "Kurrë", "Nie"), v: 4, n: pc(4) },
          ] },
        { type: "p", text: x(
          "A 2018 Gallup study of about 7,500 full-time employees found 23% very often or always, and 44% sometimes. The samples differ, so the two figures do not make a trend.",
          "Një studim i Gallup i 2018 me rreth 7.500 punonjës me kohë të plotë gjeti 23% shumë shpesh ose gjithmonë, dhe 44% ndonjëherë. Mostrat janë të ndryshme, ndaj dy shifrat nuk përbëjnë trend.",
          "Eine Gallup-Studie von 2018 mit rund 7.500 Vollzeitbeschäftigten fand 23 % sehr oft oder immer und 44 % manchmal. Die Stichproben sind verschieden, die beiden Werte ergeben also keinen Trend.") },
        { type: "callout", reading: true, text: x(
          "The largest group is the 48% who answer sometimes. Burnout shows up in degrees, not only in rare cases.",
          "Grupi më i madh janë 48% që përgjigjen “ndonjëherë”. Burnout-i shfaqet me shkallë, jo vetëm në raste të rralla.",
          "Die größte Gruppe sind die 48 %, die „manchmal“ sagen. Burnout zeigt sich in Abstufungen, nicht nur in seltenen Fällen.") },
      ],
      note: x(
        "Self-reports, not diagnoses; the texts we saw do not name the country of the samples.",
        "Vetëdeklarime, jo diagnoza; tekstet që pamë nuk e thonë vendin e mostrave.",
        "Selbstauskünfte, keine Diagnosen; die eingesehenen Texte nennen das Land der Stichproben nicht."),
      source: ["gallup-burnout-2020", "gallup-burnout-2018"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("Pressure in", "Presioni në", "Druck in"), x("Germany and Europe", "Gjermani dhe Evropë", "Deutschland und Europa")],
      lead: x(
        "The German BIBB/BAuA survey of 2018 asked over 20,000 employed people about their work. 48% often work under strong deadline or performance pressure, fewer than in 2006 and 2012.",
        "Anketa gjermane BIBB/BAuA e 2018 pyeti mbi 20.000 të punësuar për punën e tyre. 48% punojnë shpesh nën presion të fortë afatesh ose rendimenti, më pak se në 2006 dhe 2012.",
        "Die BIBB/BAuA-Erwerbstätigenbefragung 2018 fragte über 20.000 Erwerbstätige nach ihrer Arbeit. 48 % arbeiten häufig unter starkem Termin- oder Leistungsdruck, weniger als 2006 und 2012."),
      blocks: [
        { type: "line", min: 0, max: 60, height: 96, source: ["baua-stressreport-2020"],
          label: x("Often under strong deadline or performance pressure, Germany", "Shpesh nën presion të fortë afatesh ose rendimenti, Gjermani", "Häufig unter starkem Termin- oder Leistungsdruck, Deutschland"),
          points: [
            { k: "2006", v: 54, n: pc(54) },
            { k: "2012", v: 52, n: pc(52) },
            { k: "2018", v: 48, n: pc(48) },
          ] },
        { type: "p", text: x(
          "Of those exposed, 67% feel burdened by it, up from 65% in 2012. In spring 2025 EU-OSHA asked over 28,000 workers in the EU, Iceland, Norway and Switzerland by telephone:",
          "Nga të ekspozuarit, 67% ndihen të ngarkuar prej tij, nga 65% në 2012. Në pranverën e 2025, EU-OSHA pyeti me telefon mbi 28.000 të punësuar në BE, Islandë, Norvegji dhe Zvicër:",
          "Von den Betroffenen fühlen sich 67 % dadurch belastet, 2012 waren es 65 %. Im Frühjahr 2025 befragte EU-OSHA über 28.000 Beschäftigte in der EU, Island, Norwegen und der Schweiz telefonisch:") },
        { type: "figures", compact: true, items: [
          { n: x("> 40%", "> 40%", "> 40 %"), t: x("report severe time pressure", "raportojnë presion të rëndë kohe", "berichten von hohem Zeitdruck") },
          { n: x("≈ 1 in 3", "≈ 1 në 3", "≈ 1 von 3"), t: x("feel their efforts go unnoticed", "ndiejnë se përpjekjet e tyre nuk vihen re", "haben das Gefühl, dass ihr Einsatz nicht gesehen wird") },
          { n: x("≈ 30%", "≈ 30%", "≈ 30 %"), t: x("report poor communication or cooperation", "raportojnë komunikim ose bashkëpunim të dobët", "berichten von schlechter Kommunikation oder Zusammenarbeit") },
        ] },
      ],
      note: x(
        "Self-reports; the German figures are from 2018, and EU-OSHA gives only rounded values. For Albania we have no comparable data on burnout.",
        "Vetëdeklarime; shifrat gjermane janë të 2018, dhe EU-OSHA jep vetëm vlera të rrumbullakuara. Për Shqipërinë s'kam të dhëna të krahasueshme për burnout-in.",
        "Selbstauskünfte; die deutschen Werte stammen von 2018, und EU-OSHA nennt nur gerundete Werte. Für Albanien liegen uns keine vergleichbaren Daten zu Burnout vor."),
      source: ["baua-stressreport-2020", "euosha-pulse-2025"],
    },
    {
      id: "model", more: "leading-people-without-losing-the-person",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("What the WHO", "Çfarë quan", "Was die WHO"), x("counts as burnout", "OBSH burnout", "Burnout nennt")],
      lead: x(
        "In May 2019 the World Health Organization included burn-out in its International Classification of Diseases, ICD-11, as an occupational phenomenon. “It is not classified as a medical condition.”",
        "Në maj 2019, Organizata Botërore e Shëndetësisë e përfshiu burn-out-in në Klasifikimin Ndërkombëtar të Sëmundjeve, ICD-11, si fenomen profesional. “Nuk klasifikohet si gjendje mjekësore.”",
        "Im Mai 2019 nahm die Weltgesundheitsorganisation Burn-out als berufsbezogenes Phänomen in ihre Internationale Klassifikation der Krankheiten, ICD-11, auf. „Es wird nicht als medizinischer Zustand eingestuft.“"),
      blocks: [
        { type: "p", text: x(
          "It describes a syndrome resulting from chronic workplace stress that has not been successfully managed, with three dimensions:",
          "E përshkruan si sindromë që vjen nga stresi kronik në vendin e punës, që nuk është menaxhuar me sukses, me tri dimensione:",
          "Sie beschreibt ein Syndrom als Folge von chronischem Stress am Arbeitsplatz, der nicht erfolgreich bewältigt wurde, mit drei Dimensionen:") },
        { type: "cards", cols: 3, items: [
          { h: x("Exhaustion", "Rraskapitja", "Erschöpfung"), p: x("feelings of energy depletion or exhaustion", "ndjenja e shterimit të energjisë ose e rraskapitjes", "Gefühl von Energieverlust oder Erschöpfung") },
          { h: x("Distance", "Distanca", "Distanz"), p: x("more mental distance from one's job, or negativism or cynicism about it", "distancë mendore e shtuar nga puna, ose negativizëm a cinizëm ndaj saj", "mehr innere Distanz zur Arbeit oder Negativismus und Zynismus ihr gegenüber") },
          { h: x("Efficacy", "Efikasiteti", "Wirksamkeit"), p: x("reduced professional efficacy", "efikasitet profesional i ulur", "verringerte berufliche Leistungsfähigkeit") },
        ] },
        { type: "p", text: x(
          "It refers only to work and should not be used for other areas of life. In ICD-11 it has the code QD85, among problems associated with employment, in the chapter on factors influencing health status, not among the diseases. ICD-11 came into effect on 1 January 2022.",
          "Vlen vetëm për kontekstin e punës dhe nuk duhet përdorur për fusha të tjera të jetës. Në ICD-11 ka kodin QD85, te problemet që lidhen me punësimin, në kapitullin e faktorëve që ndikojnë në gjendjen e shëndetit, jo te sëmundjet. ICD-11 hyri në fuqi më 1 janar 2022.",
          "Das Konzept bezieht sich nur auf die Arbeit und soll nicht für andere Lebensbereiche verwendet werden. In der ICD-11 hat es den Code QD85, unter den Problemen im Zusammenhang mit Beschäftigung, im Kapitel über Faktoren, die den Gesundheitszustand beeinflussen, nicht unter den Krankheiten. Die ICD-11 trat am 1. Januar 2022 in Kraft.") },
        { type: "callout", reading: true, text: x(
          "The definition points at work, not at the person: stress at work that has not been managed. Managing the work is a manager's job; diagnosing a person is not.",
          "Përkufizimi tregon te puna, jo te njeriu: stres në punë që nuk është menaxhuar. Menaxhimi i punës është detyrë e menaxherit; diagnoza e njeriut jo.",
          "Die Definition zeigt auf die Arbeit, nicht auf den Menschen: Stress bei der Arbeit, der nicht bewältigt wurde. Die Arbeit zu steuern ist Aufgabe der Führungskraft, einen Menschen zu diagnostizieren nicht.") },
      ],
      note: x(
        "The current ICD-11 entry words the third dimension as a sense of ineffectiveness and lack of accomplishment. This issue describes a definition and gives no medical advice.",
        "Hyrja aktuale e ICD-11 e formulon dimensionin e tretë si ndjenjë e paefektshmërisë dhe e mungesës së arritjes. Ky numër përshkruan një përkufizim dhe nuk jep këshilla mjekësore.",
        "Der aktuelle ICD-11-Eintrag fasst die dritte Dimension als Gefühl von Unwirksamkeit und fehlender Leistung. Diese Ausgabe beschreibt eine Definition und gibt keinen medizinischen Rat."),
      source: ["who-burnout-2019", "who-icd11-qd85"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("What goes", "Çfarë shkon", "Was mit Burnout"), x("with burnout", "me burnout-in", "einhergeht")],
      lead: x(
        "In 2018 Ben Wigert and Sangeeta Agrawal of Gallup named the five factors most strongly linked to burnout among about 7,500 full-time employees.",
        "Në 2018, Ben Wigert dhe Sangeeta Agrawal nga Gallup emërtuan pesë faktorët që lidhen më fort me burnout-in te rreth 7.500 punonjës me kohë të plotë.",
        "2018 nannten Ben Wigert und Sangeeta Agrawal von Gallup die fünf Faktoren, die bei rund 7.500 Vollzeitbeschäftigten am stärksten mit Burnout zusammenhingen."),
      blocks: [
        { type: "box", title: x("Gallup's order, 2018", "Renditja e Gallup, 2018", "Gallups Reihenfolge, 2018"), items: [
          x("unfair treatment at work", "trajtimi i padrejtë në punë", "unfaire Behandlung bei der Arbeit"),
          x("unmanageable workload", "ngarkesa e pamenaxhueshme", "nicht zu bewältigende Arbeitslast"),
          x("lack of role clarity", "mungesa e qartësisë së rolit", "fehlende Rollenklarheit"),
          x("lack of communication and support from the manager", "mungesa e komunikimit dhe e mbështetjes nga menaxheri", "fehlende Kommunikation und Unterstützung durch die Führungskraft"),
          x("unreasonable time pressure", "presioni i paarsyeshëm i kohës", "unangemessener Zeitdruck"),
        ] },
        { type: "figures", compact: true, items: [
          { n: x("2.3×", "2,3×", "2,3×"), t: x("as likely to report high burnout, for those often treated unfairly at work", "më shumë gjasa për burnout të lartë, për ata që trajtohen shpesh padrejtësisht në punë", "so häufig hohes Burnout bei denen, die bei der Arbeit oft unfair behandelt werden") },
          { n: x("≈ 70%", "≈ 70%", "≈ 70 %"), t: x("less likely to feel burned out regularly, for those who feel supported by their manager", "më pak gjasa për burnout të rregullt, për ata që ndihen të mbështetur nga menaxheri", "seltener regelmäßig Burnout bei denen, die sich von ihrer Führungskraft unterstützt fühlen") },
          { n: pc(70), t: x("less likely to report high burnout, for those who often or always have enough time for all their work", "më pak gjasa për burnout të lartë, për ata që kanë shpesh ose gjithmonë kohë për gjithë punën", "seltener hohes Burnout bei denen, die oft oder immer genug Zeit für ihre ganze Arbeit haben") },
        ] },
        { type: "p", text: x(
          "Employees who felt burned out were 63% more likely to take a sick day and 2.6 times as likely to be actively looking for another job.",
          "Punonjësit që ndiheshin të djegur nga puna kishin 63% më shumë gjasa të merrnin një ditë pushimi për sëmundje dhe 2,6 herë më shumë gjasa të kërkonin aktivisht një punë tjetër.",
          "Wer sich ausgebrannt fühlte, nahm mit 63 % höherer Wahrscheinlichkeit einen Krankheitstag und suchte mit 2,6-facher Wahrscheinlichkeit aktiv eine andere Stelle.") },
        { type: "callout", reading: true, text: x(
          "All five factors are decided at work. That is where a manager can look first.",
          "Të pesë faktorët vendosen në punë. Aty mund të shikojë i pari një menaxher.",
          "Alle fünf Faktoren entstehen bei der Arbeit. Dort kann eine Führungskraft zuerst hinschauen.") },
      ],
      note: x(
        "Associations from self-reports, not proof of cause. In 2020 Gallup put unclear communication from managers and lack of manager support in third and fourth place.",
        "Lidhje nga vetëdeklarime, jo provë shkaku. Në 2020, Gallup vuri në vendin e tretë dhe të katërt komunikimin e paqartë nga menaxherët dhe mungesën e mbështetjes nga menaxheri.",
        "Zusammenhänge aus Selbstauskünften, kein Beweis der Ursache. 2020 setzte Gallup unklare Kommunikation von Führungskräften und fehlende Unterstützung durch sie auf Platz drei und vier."),
      source: ["gallup-burnout-2018", "gallup-burnout-2020"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie man es misst"),
      title: [x("Where the job", "Ku puna", "Wo die Arbeit"), x("does not fit", "nuk përputhet", "nicht passt")],
      lead: x(
        "Christina Maslach and Michael Leiter describe six areas of worklife in which a person and the job can be mismatched. The bigger the mismatch, the more likely burnout; the better the match, the more likely engagement.",
        "Christina Maslach dhe Michael Leiter përshkruajnë gjashtë fusha të jetës në punë ku njeriu dhe puna mund të mos përputhen. Sa më e madhe mospërputhja, aq më shumë gjasa për burnout; sa më e mirë përputhja, aq më shumë gjasa për angazhim.",
        "Christina Maslach und Michael Leiter beschreiben sechs Bereiche des Arbeitslebens, in denen Mensch und Arbeit nicht zusammenpassen können. Je größer die Abweichung, desto wahrscheinlicher Burnout; je besser die Passung, desto wahrscheinlicher Engagement."),
      blocks: [
        { type: "cards", cols: 3, items: [
          { h: x("Workload", "Ngarkesa", "Arbeitslast"), p: x("Can the work be done in the time there is?", "A mund të bëhet puna në kohën që ka?", "Lässt sich die Arbeit in der vorhandenen Zeit schaffen?") },
          { h: x("Control", "Kontrolli", "Kontrolle"), p: x("Who decides how the work is done?", "Kush vendos si bëhet puna?", "Wer entscheidet, wie die Arbeit gemacht wird?") },
          { h: x("Reward", "Shpërblimi", "Belohnung"), p: x("Is the effort seen and rewarded?", "A shihet dhe shpërblehet përpjekja?", "Wird der Einsatz gesehen und belohnt?") },
          { h: x("Community", "Komuniteti", "Gemeinschaft"), p: x("Do people help each other?", "A e ndihmojnë njerëzit njëri-tjetrin?", "Helfen die Menschen einander?") },
          { h: x("Fairness", "Drejtësia", "Fairness"), p: x("Are work and decisions shared fairly?", "A ndahen drejt puna dhe vendimet?", "Werden Arbeit und Entscheidungen fair verteilt?") },
          { h: x("Values", "Vlerat", "Werte"), p: x("Does the work fit what people think is right?", "A përputhet puna me atë që njerëzit e mendojnë të drejtë?", "Passt die Arbeit zu dem, was die Menschen für richtig halten?") },
        ] },
        { type: "p", text: x(
          "A meta-analysis by Eean Crawford, Jeffery LePine and Bruce Rich found that job demands go with more burnout, and job resources with less burnout and more engagement. Demands that people see as hindrances go with less engagement; demands they see as challenges, with more.",
          "Një meta-analizë e Eean Crawford, Jeffery LePine dhe Bruce Rich gjeti se kërkesat e punës shkojnë me më shumë burnout, dhe burimet e punës me më pak burnout dhe më shumë angazhim. Kërkesat që njerëzit i shohin si pengesa shkojnë me më pak angazhim; ato që i shohin si sfida, me më shumë.",
          "Eine Metaanalyse von Eean Crawford, Jeffery LePine und Bruce Rich fand, dass Arbeitsanforderungen mit mehr Burnout einhergehen und Arbeitsressourcen mit weniger Burnout und mehr Engagement. Anforderungen, die Menschen als Hindernis sehen, gehen mit weniger Engagement einher; solche, die sie als Herausforderung sehen, mit mehr.") },
      ],
      note: x(
        "The questions are the editors', after the six areas. Correlations, not proof of cause; Maslach and Leiter note that few studies evaluate interventions.",
        "Pyetjet janë të redaksisë, sipas gjashtë fushave. Korrelacione, jo provë shkaku; Maslach dhe Leiter vërejnë se pak studime i vlerësojnë ndërhyrjet.",
        "Die Fragen stammen von der Redaktion, nach den sechs Bereichen. Korrelationen, kein Beweis der Ursache; Maslach und Leiter merken an, dass wenige Studien Maßnahmen bewerten."),
      source: ["maslach-leiter-2016", "crawford-2010"],
    },
    {
      id: "tool",
      kicker: x("Tool of the week", "Mjeti i javës", "Werkzeug der Woche"),
      title: [x("The workload", "Biseda për", "Das Gespräch über"), x("talk", "ngarkesën", "die Arbeitslast")],
      lead: x(
        "Fifteen minutes, one to one, every few weeks. The talk is about the work, not about health: the manager listens, asks, and writes down one change.",
        "Pesëmbëdhjetë minuta, një me një, çdo disa javë. Biseda është për punën, jo për shëndetin: menaxheri dëgjon, pyet dhe shkruan një ndryshim.",
        "Fünfzehn Minuten, unter vier Augen, alle paar Wochen. Es geht um die Arbeit, nicht um die Gesundheit: Die Führungskraft hört zu, fragt nach und notiert eine Änderung."),
      blocks: [
        { type: "form", items: [
          { h: x("Load", "Ngarkesa", "Last"), hint: x("what is on the list this week, and what could wait", "çfarë ka në listë këtë javë, dhe çfarë mund të presë", "was diese Woche ansteht, und was warten könnte") },
          { h: x("Time", "Koha", "Zeit"), hint: x("where deadlines collide, and who set them", "ku përplasen afatet, dhe kush i vendosi", "wo Termine kollidieren, und wer sie gesetzt hat") },
          { h: x("Decisions", "Vendimet", "Entscheidungen"), hint: x("what you can decide yourself, and where you wait for others", "çfarë mund të vendosësh vetë, dhe ku pret për të tjerët", "was du selbst entscheiden kannst, und wo du auf andere wartest") },
          { h: x("Fairness", "Drejtësia", "Fairness"), hint: x("where work or credit feels unevenly shared", "ku puna ose meritat duken të ndara padrejtë", "wo Arbeit oder Anerkennung ungleich verteilt wirken") },
          { h: x("Support", "Mbështetja", "Unterstützung"), hint: x("what I can take off, decide or ask for on your behalf", "çfarë mund të heq, të vendos ose të kërkoj unë për ty", "was ich dir abnehmen, entscheiden oder für dich einfordern kann") },
          { h: x("One change", "Një ndryshim", "Eine Änderung"), hint: x("what, who, by when; look at it again next time", "çfarë, kush, deri kur; e rishikojmë herën tjetër", "was, wer, bis wann; beim nächsten Mal wieder ansehen") },
        ] },
      ],
      note: x(
        "A practice proposed by the editors, after Gallup's five factors (2018) and the six areas of worklife. It does not replace medical help.",
        "Praktikë e propozuar nga redaksia, sipas pesë faktorëve të Gallup (2018) dhe gjashtë fushave të jetës në punë. Nuk zëvendëson ndihmën mjekësore.",
        "Eine Praxis, die die Redaktion vorschlägt, nach Gallups fünf Faktoren (2018) und den sechs Bereichen des Arbeitslebens. Sie ersetzt keine ärztliche Hilfe."),
      source: ["gallup-burnout-2018", "maslach-leiter-2016"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
