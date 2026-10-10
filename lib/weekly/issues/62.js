// Management Review, No. 62: Decisions under pressure. Block: Role.
// Facts and their sources: docs/revista/management-review-nr-62.md.
import { x } from "../common.js";

export default {
  number: 62,
  block: "role",
  date: x("November 2026", "Nëntor 2026", "November 2026"),
  theme: [x("Decisions", "Vendimet", "Entscheidungen"), x("under pressure", "nën presion", "unter Druck")],
  sub: x(
    "A floor that was too quiet, 156 decisions on the fireground, recognise then simulate, what stress does to choices, when a gut feeling deserves trust, and a card for a fast decision.",
    "Një dysheme tepër e qetë, 156 vendime në zjarr, njih e pastaj simulo, çfarë u bën stresi zgjedhjeve, kur meriton besim ndjesia, dhe një kartë për një vendim të shpejtë.",
    "Ein zu stiller Boden, 156 Entscheidungen am Brandort, erst erkennen, dann durchspielen, was Stress mit Entscheidungen macht, wann das Bauchgefühl Vertrauen verdient, und eine Karte."),
  seo: x(
    "Decisions under pressure: Klein's fireground study, the recognition-primed decision model, what stress does, when to trust intuition, and a card.",
    "Vendimet nën presion: studimi i Klein-it me komandantët e zjarrit, modeli RPD, çfarë bën stresi, kur t'i besosh intuitës, dhe një kartë.",
    "Entscheiden unter Druck: Kleins Studie am Brandort, das RPD-Modell, was Stress bewirkt, wann man der Intuition traut, und eine Karte."),
  feature: x(
    "Issue 62 starts with a fire lieutenant who ordered his crew out of a house moments before the floor gave way, follows a study by Gary Klein and colleagues of 156 decisions by experienced fireground commanders, sets out the recognition-primed decision model, looks at what stress does to the way people search for options, asks with Daniel Kahneman and Klein when a professional's intuition deserves trust, and ends with a card for a fast decision.",
    "Numri 62 nis me një toger zjarrfikës që e nxori ekipin nga një shtëpi pak çaste para se të shembej dyshemeja, ndjek studimin e Gary Klein-it dhe kolegëve për 156 vendime të komandantëve me përvojë në zjarr, shtjellon modelin e vendimit të nxitur nga njohja, shikon çfarë i bën stresi mënyrës si kërkojmë mundësi, pyet bashkë me Daniel Kahneman-in dhe Klein-in kur meriton besim intuita e një profesionisti, dhe mbyllet me një kartë për një vendim të shpejtë.",
    "Ausgabe 62 beginnt mit einem Feuerwehr-Lieutenant, der seine Leute Augenblicke vor dem Einsturz des Bodens aus einem Haus holte, folgt der Studie von Gary Klein und Kollegen zu 156 Entscheidungen erfahrener Einsatzleiter am Brandort, stellt das Modell der wiedererkennungsgestützten Entscheidung vor, betrachtet, was Stress mit der Suche nach Optionen macht, fragt mit Daniel Kahneman und Klein, wann die Intuition von Fachleuten Vertrauen verdient, und endet mit einer Karte für eine schnelle Entscheidung."),
  figure: { n: "156", by: "Klein, Calderwood & Clinton-Cirocco, 2010", t: x(
    "decision points of experienced fireground commanders: in fewer than 12% of them did they compare two or more options.",
    "pika vendimi të komandantëve me përvojë në zjarr: në më pak se 12% të tyre krahasuan dy ose më shumë mundësi.",
    "Entscheidungspunkte erfahrener Einsatzleiter am Brandort: In weniger als 12 % davon verglichen sie zwei oder mehr Optionen.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("Something is wrong", "Diçka nuk shkon", "Etwas stimmt nicht") },
    { page: "model", kicker: x("The model", "Modeli", "Das Modell"),
      title: x("Recognise, then simulate", "Njih, pastaj simulo", "Erkennen, dann durchspielen") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The fast decision card", "Karta e vendimit të shpejtë", "Die Karte für schnelle Entscheidungen") },
  ],
  sources: ["pressure-gladwell-2005", "pressure-kcc-2010", "pressure-klein-2021", "pressure-kahneman-klein-2009", "pressure-starcke-brand-2016", "pressure-keinan-1987", "pressure-mckinsey-2010"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Under pressure there is rarely time to list the options, weigh them and pick the best. Yet decisions still get made, and many of them are good. This issue asks how experienced people decide when time is short, what stress changes, and when a fast judgement can be trusted.",
        "Nën presion rrallë ka kohë për t'i renditur mundësitë, për t'i peshuar dhe për të zgjedhur më të mirën. Megjithatë vendimet merren, dhe shumë prej tyre janë të mira. Ky numër pyet si vendosin njerëzit me përvojë kur koha është e shkurtër, çfarë ndryshon stresi, dhe kur mund t'i besohet një gjykimi të shpejtë.",
        "Unter Druck bleibt selten Zeit, Optionen aufzulisten, abzuwägen und die beste zu wählen. Trotzdem wird entschieden, und vieles davon gut. Diese Ausgabe fragt, wie erfahrene Menschen entscheiden, wenn die Zeit knapp ist, was Stress verändert und wann man einem schnellen Urteil trauen kann."),
      body: x(
        "A fire lieutenant ordered his crew out moments before the floor collapsed, and at first could explain it only as ESP. In a study from 1985, experienced fireground commanders compared options in fewer than 12% of 156 decisions. Gary Klein's recognition-primed decision model shows what they did instead. Experiments show that stress makes choices riskier and the search for options shorter. Daniel Kahneman and Klein set out when such intuition deserves trust.",
        "Një toger zjarrfikës e nxori ekipin jashtë pak çaste para se të shembej dyshemeja, dhe në fillim nuk e shpjegonte dot ndryshe veçse me shqisën e gjashtë. Në një studim të 1985, komandantët me përvojë në zjarr krahasuan mundësi në më pak se 12% të 156 vendimeve. Modeli i Gary Klein-it për vendimin e nxitur nga njohja tregon çfarë bënë në vend të kësaj. Eksperimentet tregojnë se stresi i bën zgjedhjet më të rrezikshme dhe kërkimin e mundësive më të shkurtër. Daniel Kahneman dhe Klein shtjellojnë kur meriton besim një intuitë e tillë.",
        "Ein Feuerwehr-Lieutenant holte seine Leute Augenblicke vor dem Einsturz des Bodens heraus und konnte es zunächst nur mit einem sechsten Sinn erklären. In einer Studie von 1985 verglichen erfahrene Einsatzleiter in weniger als 12 % von 156 Entscheidungen Optionen. Gary Kleins Modell der wiedererkennungsgestützten Entscheidung zeigt, was sie stattdessen taten. Experimente zeigen, dass Stress Entscheidungen riskanter und die Suche nach Optionen kürzer macht. Daniel Kahneman und Klein beschreiben, wann solche Intuition Vertrauen verdient."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("Something", "Diçka", "Etwas"), x("is wrong", "nuk shkon", "stimmt nicht")],
      lead: x(
        "A Cleveland fire commander told Gary Klein about a decision from his days as a lieutenant. The fire seemed to be in the kitchen of a one-storey house. Water hardly helped, and the crew pulled back into the living room. There he ordered everyone out. Moments later, the floor they had stood on collapsed.",
        "Një komandant zjarrfikës nga Cleveland-i i tregoi Gary Klein-it për një vendim nga vitet kur ishte toger. Zjarri dukej se ishte në kuzhinën e një shtëpie njëkatëshe. Uji pothuajse nuk ndihmoi, dhe ekipi u tërhoq në dhomën e ndenjjes. Aty ai urdhëroi që të dilnin të gjithë. Pak çaste më vonë, dyshemeja ku kishin qëndruar u shemb.",
        "Ein Feuerwehrkommandant aus Cleveland erzählte Gary Klein von einer Entscheidung aus seiner Zeit als Lieutenant. Das Feuer schien in der Küche eines eingeschossigen Hauses zu sein. Wasser half kaum, und die Leute zogen sich ins Wohnzimmer zurück. Dort befahl er allen hinauszugehen. Augenblicke später stürzte der Boden ein, auf dem sie gestanden hatten."),
      blocks: [
        { type: "p", text: x(
          "The fire had been in the basement. Asked why he gave the order, he spoke of ESP. Klein went through the incident with him for two hours, and the reasons came out.",
          "Zjarri kishte qenë në bodrum. Kur e pyetën pse e dha urdhrin, ai foli për shqisën e gjashtë. Klein-i e rishikoi ngjarjen me të për dy orë, dhe arsyet dolën në dritë.",
          "Das Feuer war im Keller. Gefragt, warum er den Befehl gab, sprach er von einem sechsten Sinn. Klein ging den Einsatz zwei Stunden lang mit ihm durch, und die Gründe kamen ans Licht.") },
        { type: "cards", cols: 3, items: [
          { h: x("Water", "Uji", "Wasser"), p: x("A kitchen fire should die down under water. This one did not.", "Një zjarr kuzhine duhet të shuhet nën ujë. Ky nuk u shua.", "Ein Küchenbrand sollte unter Wasser nachlassen. Dieser tat es nicht.") },
          { h: x("Heat", "Nxehtësia", "Hitze"), p: x("The room was hotter than a kitchen fire would make it.", "Dhoma ishte më e nxehtë se ç'mund ta bënte një zjarr kuzhine.", "Der Raum war heißer, als ein Küchenbrand ihn machen würde.") },
          { h: x("Quiet", "Qetësia", "Stille"), p: x("For that much heat, the fire was too quiet. The floor muffled it.", "Për gjithë atë nxehtësi, zjarri ishte tepër i qetë. Dyshemeja e mbyste zhurmën.", "Für so viel Hitze war das Feuer zu leise. Der Boden dämpfte es.") },
        ] },
        { type: "callout", reading: true, text: x(
          "He did not see more than his crew. He noticed sooner that what he saw did not match what he expected.",
          "Ai nuk pa më shumë se ekipi i tij. Vuri re më herët se ajo që shihte nuk përputhej me atë që priste.",
          "Er sah nicht mehr als seine Leute. Er merkte früher, dass das Gesehene nicht zum Erwarteten passte.") },
      ],
      note: x(
        "From Klein's interviews, told after Malcolm Gladwell's retelling in Blink (2005) as retold by Fire Engineering and Max Bazerman; we could not see Klein's own account. The cues were reconstructed afterwards.",
        "Nga intervistat e Klein-it, sipas rrëfimit të Malcolm Gladwell-it te Blink (2005), siç e rimarrin Fire Engineering dhe Max Bazerman; rrëfimin e vetë Klein-it nuk e pamë. Shenjat u rindërtuan më pas.",
        "Aus Kleins Interviews, nach Malcolm Gladwells Nacherzählung in Blink (2005), wie Fire Engineering und Max Bazerman sie wiedergeben; Kleins eigene Darstellung lag uns nicht vor. Die Hinweise wurden hinterher rekonstruiert."),
      source: ["pressure-gladwell-2005"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("One option,", "Një mundësi,", "Eine Option,"), x("not two", "jo dy", "nicht zwei")],
      lead: x(
        "In 1985 Gary Klein, Roberta Calderwood and Anne Clinton-Cirocco interviewed 26 experienced fireground commanders (23 years of experience on average) about 156 decision points in real incidents. They expected them to compare at least two options. They were wrong.",
        "Në 1985, Gary Klein, Roberta Calderwood dhe Anne Clinton-Cirocco intervistuan 26 komandantë me përvojë në zjarr (mesatarisht 23 vjet përvojë) për 156 pika vendimi në ngjarje reale. Prisnin që ata të krahasonin të paktën dy mundësi. Gabuan.",
        "1985 befragten Gary Klein, Roberta Calderwood und Anne Clinton-Cirocco 26 erfahrene Einsatzleiter am Brandort (im Schnitt 23 Jahre Erfahrung) zu 156 Entscheidungspunkten aus echten Einsätzen. Sie erwarteten, dass diese mindestens zwei Optionen vergleichen. Das stimmte nicht."),
      blocks: [
        { type: "hbars", source: ["pressure-kcc-2010"],
          label: x("156 decision points of fireground commanders, study of 1985", "156 pika vendimi të komandantëve në zjarr, studimi i 1985", "156 Entscheidungspunkte von Einsatzleitern am Brandort, Studie von 1985"),
          items: [
            { k: x("Recognised a typical situation and its usual action", "Njohën një situatë tipike dhe veprimin e zakonshëm", "Typische Lage und übliche Maßnahme erkannt"), v: 80, n: x("over 80%", "mbi 80%", "über 80 %") },
            { k: x("Compared two or more options", "Krahasuan dy ose më shumë mundësi", "Zwei oder mehr Optionen verglichen"), v: 12, n: x("under 12%", "nën 12%", "unter 12 %"), alert: true },
          ] },
        { type: "p", text: x(
          "Usually one option came to mind first, and it was enough. In 2021 Klein added that inexperienced decision makers use this approach less than half the time, and that people use it even when time is not short.",
          "Zakonisht u vinte ndër mend një mundësi e vetme, dhe kaq mjaftonte. Në 2021, Klein-i shtoi se vendimmarrësit pa përvojë e përdorin këtë qasje në më pak se gjysmën e rasteve, dhe se njerëzit e përdorin edhe kur koha nuk është e shkurtër.",
          "Meist fiel ihnen zuerst eine einzige Option ein, und sie genügte. 2021 ergänzte Klein, dass Unerfahrene diesen Weg in weniger als der Hälfte der Fälle nutzen und dass Menschen ihn auch nutzen, wenn die Zeit nicht knapp ist.") },
        { type: "callout", reading: true, text: x(
          "Under pressure, experts do not choose faster among options. Mostly they never line options up at all.",
          "Nën presion, ekspertët nuk zgjedhin më shpejt mes mundësive. Shumicën e herëve nuk i rreshtojnë fare mundësitë.",
          "Unter Druck wählen Fachleute nicht schneller zwischen Optionen. Meist stellen sie gar keine Optionen nebeneinander.") },
      ],
      note: x(
        "Done in 1985, republished with a postscript in 2010; the abstract gives the shares only as “over 80%” and “less than 12%”, and so does the chart. Interviews after the event: how commanders remembered deciding.",
        "Bërë në 1985, ribotuar me një pasthënie në 2010; abstrakti i jep pjesët vetëm si “mbi 80%” dhe “më pak se 12%”, ashtu si grafiku. Intervista pas ngjarjes: si e kujtonin komandantët vendimin.",
        "1985 durchgeführt, 2010 mit Nachwort neu erschienen; das Abstract nennt die Anteile nur als „über 80 %“ und „weniger als 12 %“, ebenso die Grafik. Interviews nach dem Einsatz: wie sich die Einsatzleiter erinnerten."),
      source: ["pressure-kcc-2010", "pressure-klein-2021"],
    },
    {
      id: "model",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Recognise,", "Njih,", "Erkennen,"), x("then simulate", "pastaj simulo", "dann durchspielen")],
      lead: x(
        "From these interviews came the recognition-primed decision (RPD) model. Klein describes two processes: matching the situation to ones met before, which points to a workable action, then imagining how it would play out.",
        "Nga këto intervista doli modeli i vendimit të nxitur nga njohja (recognition-primed decision, RPD). Klein-i përshkruan dy procese: përputhjen e situatës me ato të hasura më parë, që të çon te një veprim i zbatueshëm, pastaj përfytyrimin se si do të shkonte ai.",
        "Aus diesen Interviews entstand das Modell der wiedererkennungsgestützten Entscheidung (Recognition-Primed Decision, RPD). Klein beschreibt zwei Vorgänge: die Lage mit früher erlebten abgleichen, was auf eine brauchbare Maßnahme führt, und sich dann vorstellen, wie sie ablaufen würde."),
      blocks: [
        { type: "chain", label: x("The RPD strategy, after Kahneman & Klein (2009)", "Strategjia RPD, sipas Kahneman & Klein (2009)", "Die RPD-Strategie nach Kahneman & Klein (2009)"), items: [
          { h: x("Recognise", "Njih", "Erkennen"), p: x("The situation matches a pattern; a plausible option comes first.", "Situata përputhet me një model; një mundësi e besueshme vjen e para.", "Die Lage passt zu einem Muster; eine plausible Option kommt zuerst.") },
          { h: x("Simulate", "Simulo", "Durchspielen"), p: x("Run the option forward in the mind: will it work here?", "Çoje mundësinë përpara në mendje: a funksionon këtu?", "Die Option im Kopf vorwärts laufen lassen: Klappt sie hier?") },
          { h: x("Act or adjust", "Vepro ose ndrysho", "Handeln oder anpassen"), p: x("If it works, act. If it has a flaw, change it.", "Nëse funksionon, vepro. Nëse ka një të metë, ndryshoje.", "Klappt sie, handeln. Hat sie einen Mangel, ändern.") },
          { h: x("Next option", "Mundësia tjetër", "Nächste Option"), p: x("If it cannot be fixed, take the next most plausible one and run it the same way.", "Nëse nuk rregullohet, merr mundësinë tjetër më të besueshme dhe provoje njësoj.", "Lässt sie sich nicht retten, die nächstplausible nehmen und genauso prüfen.") },
        ] },
        { type: "p", text: x(
          "With patterns from more than a decade of fires, the commanders could foresee how flames would spread and notice signs that a house was about to collapse. Klein calls recognition fast and intuitive, simulation slower and deliberate.",
          "Me modelet e mbledhura në më shumë se një dekadë zjarresh, komandantët parashikonin si do të përhapeshin flakët dhe vinin re shenjat se një shtëpi do të shembej. Klein-i e quan njohjen të shpejtë dhe intuitive, simulimin më të ngadaltë dhe të menduar.",
          "Mit Mustern aus mehr als einem Jahrzehnt Einsätzen sahen die Einsatzleiter voraus, wie sich Flammen ausbreiten, und bemerkten Zeichen eines drohenden Einsturzes. Klein nennt das Erkennen schnell und intuitiv, das Durchspielen langsamer und bewusst.") },
        { type: "callout", reading: true, text: x(
          "The check is built in: the mental simulation. A fast decision is not thoughtless; the thinking goes into a single option.",
          "Kontrolli është brenda modelit: simulimi në mendje. Një vendim i shpejtë nuk është pa mendim; mendimi shkon te një mundësi e vetme.",
          "Die Prüfung ist eingebaut: das Durchspielen im Kopf. Schnell heißt nicht gedankenlos; das Nachdenken fließt in eine einzige Option.") },
      ],
      note: x(
        "Steps after Kahneman and Klein's description of the commanders, worded by the editors. The model describes experienced people; it does not promise that the first option is right.",
        "Hapat sipas përshkrimit të Kahneman-it dhe Klein-it për komandantët, me fjalët e redaksisë. Modeli përshkruan njerëz me përvojë; nuk premton se mundësia e parë është e duhura.",
        "Schritte nach der Beschreibung der Einsatzleiter bei Kahneman und Klein, formuliert von der Redaktion. Das Modell beschreibt Erfahrene; es verspricht nicht, dass die erste Option stimmt."),
      source: ["pressure-kahneman-klein-2009", "pressure-klein-2021"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("What stress does", "Çfarë u bën stresi", "Was Stress mit"), x("to choices", "zgjedhjeve", "Entscheidungen macht")],
      lead: x(
        "Katrin Starcke and Matthias Brand pooled laboratory studies that induced stress before a decision: 32 datasets, 1,829 participants. Overall, decisions under stress were more disadvantageous, more reward-seeking and riskier than without it.",
        "Katrin Starcke dhe Matthias Brand bashkuan studime laboratorike ku stresi shkaktohej para një vendimi: 32 grupe të dhënash, 1.829 pjesëmarrës. Në tërësi, vendimet nën stres ishin më të pafavorshme, më të prirura drejt shpërblimit dhe më të rrezikshme se pa të.",
        "Katrin Starcke und Matthias Brand fassten Laborstudien zusammen, die vor einer Entscheidung Stress auslösten: 32 Datensätze, 1.829 Teilnehmende. Insgesamt waren Entscheidungen unter Stress ungünstiger, stärker auf Belohnung aus und riskanter als ohne."),
      blocks: [
        { type: "columns", max: 0.3, height: 100, source: ["pressure-starcke-brand-2016"],
          label: x("Effect of stress on decisions (d), 2016", "Efekti i stresit te vendimet (d), 2016", "Wirkung von Stress auf Entscheidungen (d), 2016"),
          items: [
            { k: x("All", "Të gjitha", "Alle"), v: 0.17, n: x("0.17", "0,17", "0,17") },
            { k: x("Risk costly", "Rreziku kushton", "Risiko schadet"), v: 0.26, n: x("0.26", "0,26", "0,26"), alert: true },
            { k: x("Other", "Të tjera", "Andere"), v: 0.01, n: x("0.01", "0,01", "0,01") },
          ] },
        { type: "p", text: x(
          "The effect was clear where risk did harm and absent elsewhere. In an older experiment (1987), Giora Keinan gave 101 students decision problems with no time limit. Under stress, they more often offered a solution before considering all the alternatives, and scanned them less systematically; how they scanned was linked to getting the answers right.",
          "Efekti ishte i qartë aty ku rreziku dëmtonte dhe mungonte gjetkë. Në një eksperiment më të vjetër (1987), Giora Keinan u dha 101 studentëve probleme vendimi pa afat kohor. Nën stres, ata jepnin më shpesh një zgjidhje para se t'i shqyrtonin të gjitha alternativat, dhe i shqyrtonin më pak sistematikisht; mënyra e shqyrtimit lidhej me përgjigjet e sakta.",
          "Deutlich war die Wirkung, wo Risiko schadete, sonst fehlte sie. In einem älteren Experiment (1987) gab Giora Keinan 101 Studierenden Entscheidungsaufgaben ohne Zeitlimit. Unter Stress nannten sie öfter eine Lösung, bevor alle Alternativen geprüft waren, und gingen sie weniger systematisch durch; wie sie vorgingen, hing mit richtigen Antworten zusammen.") },
        { type: "callout", reading: true, text: x(
          "Stress does not only hurry a decision. Even without a deadline, it makes people stop looking sooner. With a trained eye that may be enough; without one, the first idea goes untested.",
          "Stresi nuk e nxiton vetëm vendimin. Edhe pa afat, i bën njerëzit të ndalojnë më shpejt kërkimin. Me një sy të stërvitur kjo mund të mjaftojë; pa të, ideja e parë mbetet e paprovuar.",
          "Stress drängt nicht nur zur Eile. Auch ohne Frist lässt er die Suche früher enden. Mit geübtem Blick kann das reichen; ohne ihn bleibt die erste Idee ungeprüft.") },
      ],
      note: x(
        "d is an effect size; by the usual convention 0.2 is small. Laboratory studies with stress induced on purpose, not crews in the field. Keinan's study is from 1987.",
        "d është madhësi efekti; sipas konventës së zakonshme 0,2 është i vogël. Studime laboratorike me stres të shkaktuar qëllimisht, jo ekipe në terren. Studimi i Keinan-it është i 1987.",
        "d ist eine Effektstärke; nach üblicher Konvention ist 0,2 klein. Laborstudien mit absichtlich ausgelöstem Stress, keine Teams im Einsatz. Keinans Studie stammt von 1987."),
      source: ["pressure-starcke-brand-2016", "pressure-keinan-1987"],
    },
    {
      id: "measure", more: "solve-it-or-escalate-it",
      kicker: x("How it is measured", "Si matet", "Wie man es misst"),
      title: [x("When the gut", "Kur meriton", "Wann der Bauch"), x("deserves trust", "besim ndjesia", "Vertrauen verdient")],
      lead: x(
        "Daniel Kahneman spent much of his career finding intuition flawed in experiments; Klein, making the case for expert intuition. In 2009 they set out together when it can be trusted. Their answer looks at the situation, not at how sure one feels:",
        "Daniel Kahneman e kaloi pjesën më të madhe të karrierës duke gjetur në eksperimente gabimet e intuitës; Klein-i, duke mbrojtur intuitën e ekspertëve. Në 2009 shtjelluan bashkë kur mund t'i besohet. Përgjigjja e tyre shikon situatën, jo sa i sigurt ndihet njeriu:",
        "Daniel Kahneman fand einen Großteil seiner Laufbahn lang in Experimenten Fehler der Intuition; Klein warb für die Intuition von Fachleuten. 2009 legten sie gemeinsam dar, wann man ihr trauen kann. Ihre Antwort blickt auf die Lage, nicht auf das Gefühl der Sicherheit:"),
      blocks: [
        { type: "cards", cols: 2, items: [
          { h: x("A regular environment", "Një mjedis i rregullt", "Eine regelmäßige Umgebung"), p: x("Stable links between visible cues and what follows: firefighting, medicine. Not the price of a single stock.", "Lidhje të qëndrueshme mes shenjave të dukshme dhe asaj që vjen pas: zjarrfikja, mjekësia. Jo çmimi i një aksioni të vetëm.", "Stabile Verbindungen zwischen sichtbaren Hinweisen und dem, was folgt: Brandbekämpfung, Medizin. Nicht der Kurs einer Einzelaktie.") },
          { h: x("A chance to learn it", "Mundësia për ta mësuar", "Die Chance, sie zu lernen"), p: x("Prolonged practice and feedback that is rapid and unequivocal.", "Praktikë e gjatë dhe feedback i shpejtë dhe i qartë.", "Lange Übung und Rückmeldung, die schnell und eindeutig ist.") },
        ] },
        { type: "p", text: x(
          "Confidence, they write, is no reliable sign that an intuition is valid, and expertise is fractionated: skilled in some tasks of a job, not in others. In 2010 Klein added: take the gut feeling as a data point, then check whether it makes sense here.",
          "Siguria, shkruajnë ata, nuk është shenjë e besueshme se një intuitë është e vlefshme, dhe ekspertiza është e copëzuar: e aftë në disa detyra të një pune, jo në të tjera. Në 2010 Klein-i shtoi: merre ndjesinë si një të dhënë, pastaj kontrollo nëse ka kuptim këtu.",
          "Gewissheit, schreiben sie, ist kein verlässliches Zeichen, dass eine Intuition stimmt, und Expertise ist zersplittert: in manchen Aufgaben eines Berufs gekonnt, in anderen nicht. 2010 ergänzte Klein: das Bauchgefühl als Datenpunkt nehmen und dann prüfen, ob es hier passt.") },
        { type: "example", label: x("Hypothetical example, a shift lead's month", "Shembull hipotetik, një muaj i një drejtuesi turni", "Hypothetisches Beispiel, ein Monat einer Schichtleitung"), rows: [
          { k: x("Held", "U vërtetuan", "Bestätigt"), v: x("16 of 22 fast decisions went as expected", "16 nga 22 vendime të shpejta shkuan siç pritej", "16 von 22 schnellen Entscheidungen liefen wie erwartet") },
          { k: x("Missed", "Nuk u vërtetuan", "Verfehlt"), v: x("6, of which 5 in situations rarely met before", "6, nga të cilat 5 në situata të hasura rrallë", "6, davon 5 in selten erlebten Lagen") },
        ], text: x("The count shows where experience is real and where it only feels real. The numbers are invented.", "Numërimi tregon ku përvoja është e vërtetë dhe ku vetëm duket e tillë. Numrat janë të shpikur.", "Die Zählung zeigt, wo Erfahrung echt ist und wo sie sich nur so anfühlt. Die Zahlen sind erfunden.") },
      ],
      note: x(
        "Conditions and examples from Kahneman & Klein (2009), Klein's words from McKinsey Quarterly (2010). Writing the expectation down first is the editors' way to get rapid feedback.",
        "Kushtet dhe shembujt nga Kahneman & Klein (2009), fjalët e Klein-it nga McKinsey Quarterly (2010). Shënimi i pritjes që më parë është mënyra e redaksisë për feedback të shpejtë.",
        "Bedingungen und Beispiele aus Kahneman & Klein (2009), Kleins Worte aus McKinsey Quarterly (2010). Die Erwartung vorher aufzuschreiben, ist der Weg der Redaktion zu schneller Rückmeldung."),
      source: ["pressure-kahneman-klein-2009", "pressure-mckinsey-2010"],
    },
    {
      id: "tool", tool: "/tools/shift-handover/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The fast", "Karta e vendimit", "Die Karte für schnelle"), x("decision card", "të shpejtë", "Entscheidungen")],
      lead: x(
        "One card, one decision. The first four lines before you act or right after, the last two when the pressure is off. An expectation that failed is the most useful line.",
        "Një kartë, një vendim. Katër rreshtat e parë para se të veprosh ose menjëherë pas, dy të fundit kur bie presioni. Një pritje që nuk u vërtetua është rreshti më i dobishëm.",
        "Eine Karte, eine Entscheidung. Die ersten vier Zeilen vor dem Handeln oder gleich danach, die letzten zwei, wenn der Druck nachlässt. Eine Erwartung, die nicht eintraf, ist die nützlichste Zeile."),
      blocks: [
        { type: "form", items: [
          { h: x("What I see", "Çfarë shoh", "Was ich sehe"), hint: x("cues and facts, not interpretations", "shenja dhe fakte, jo interpretime", "Hinweise und Fakten, keine Deutungen") },
          { h: x("What I expect", "Çfarë pres", "Was ich erwarte"), hint: x("what should happen next if I read it right", "çfarë duhet të ndodhë, nëse e lexoj drejt", "was als Nächstes kommt, wenn ich richtig lese") },
          { h: x("What I will do", "Çfarë do të bëj", "Was ich tue"), hint: x("the first workable option, run through once in my head", "mundësia e parë e zbatueshme, e provuar një herë në mendje", "die erste brauchbare Option, einmal im Kopf durchgespielt"), lines: 2 },
          { h: x("What would tell me I am wrong", "Çfarë do të më tregonte se gaboj", "Woran ich merke, dass ich falsch liege"), hint: x("the sign that makes me stop and look again", "shenja që më bën të ndaloj dhe të shoh përsëri", "das Zeichen, bei dem ich anhalte und neu hinsehe") },
          { h: x("What happened", "Çfarë ndodhi", "Was geschah"), hint: x("as expected? if not, what did I miss", "siç pritej? nëse jo, çfarë më shpëtoi", "wie erwartet? wenn nicht, was habe ich übersehen") },
          { h: x("Handed over", "U dorëzua", "Übergeben"), hint: x("what stays open, who owns it, who was told", "çfarë mbetet e hapur, kush e ka, kujt iu tha", "was offen bleibt, wer zuständig ist, wer informiert wurde") },
        ] },
      ],
      note: x(
        "A practice proposed by the editors, after the RPD model, Kahneman and Klein's conditions and Klein's advice to treat a gut feeling as a data point. The handover tool keeps open items with an owner.",
        "Praktikë e propozuar nga redaksia, sipas modelit RPD, kushteve të Kahneman-it dhe Klein-it dhe këshillës së Klein-it që ndjesia të trajtohet si një e dhënë. Mjeti i dorëzimit të turnit i mban çështjet e hapura me përgjegjës.",
        "Eine Praxis, die die Redaktion vorschlägt, nach dem RPD-Modell, den Bedingungen von Kahneman und Klein und Kleins Rat, ein Bauchgefühl als Datenpunkt zu nehmen. Das Übergabe-Werkzeug hält Offenes mit Verantwortlichem fest."),
      source: ["pressure-klein-2021", "pressure-kahneman-klein-2009", "pressure-mckinsey-2010"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
