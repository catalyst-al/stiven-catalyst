// Management Review, No. 99: Lifting and the back, why training in lifting technique alone does not prevent back
// pain, and what the law and the guidance put first. Block: People. Facts and their sources:
// docs/revista/management-review-nr-99.md. The Cochrane review (Verbeek et al., 2011) and Martimo et al. (2008, BMJ)
// were read in full at PubMed Central; the executive summary of EU-OSHA's report (2019, pp. 11–24), HSE's brief guide
// INDG143 (2020), HSE's kinds of accident statistics (2025) and the Lastenhandhabungsverordnung were read in full.
// Heat is No. 84, injury rates No. 87, fatigue No. 89, slips and trips No. 100: not repeated.
import { x, pc } from "../common.js";

export default {
  number: 99,
  block: "people",
  date: x("November 2026", "Nëntor 2026", "November 2026"),
  theme: [x("Lifting and the back:", "Ngritja dhe shpina:", "Heben und der Rücken:"), x("technique is not enough", "teknika nuk mjafton", "Technik reicht nicht")],
  sub: x(
    "Postal workers who learned to lift, nine trials with 20,101 workers, what the law puts before training, where the hands are, and a card for one handling task.",
    "Punonjës postarë që mësuan të ngrinin, nëntë studime me 20.101 punonjës, çfarë vë ligji para trajnimit, ku janë duart, dhe një kartë për një detyrë me peshë.",
    "Postbeschäftigte, die das Heben lernten, neun Studien mit 20.101 Beschäftigten, was das Recht vor die Schulung stellt, wo die Hände sind, und eine Karte für eine Hebeaufgabe."),
  seo: x(
    "Lifting and back pain: what the Cochrane review found on lifting training, EU-OSHA's figures, the order of measures in law, HSE's risk filter, and a card.",
    "Ngritja dhe dhimbja e shpinës: çfarë gjeti rishikimi Cochrane për trajnimin, shifrat e EU-OSHA, rendi i masave në ligj, filtri i HSE-së dhe një kartë.",
    "Heben und Rückenschmerz: was der Cochrane-Review zur Hebeschulung fand, Zahlen der EU-OSHA, die Rangfolge der Maßnahmen, der HSE-Filter und eine Karte."),
  feature: x(
    "The lifting course is the most common answer to back pain in heavy work. Issue 99 follows 3,597 postal workers who were trained to lift and watched for five and a half years, then reads the Cochrane review of nine trials with 20,101 workers. It sets beside them how common back pain is in Europe, the order of measures that EU law and HSE prescribe, HSE's filter of weights by where the hands are, and a card for one handling task.",
    "Kursi i ngritjes është përgjigjja më e zakonshme ndaj dhimbjes së shpinës në punët e rënda. Numri 99 ndjek 3.597 punonjës postarë që u trajnuan të ngrinin dhe u ndoqën pesë vjet e gjysmë, pastaj lexon rishikimin Cochrane të nëntë studimeve me 20.101 punonjës. Pranë tyre vë sa e shpeshtë është dhimbja e shpinës në Evropë, rendin e masave që kërkojnë ligji evropian dhe HSE, filtrin e HSE-së të peshave sipas vendit ku janë duart, dhe një kartë për një detyrë me peshë.",
    "Der Hebekurs ist die häufigste Antwort auf Rückenschmerz bei schwerer Arbeit. Ausgabe 99 folgt 3.597 Postbeschäftigten, die heben lernten und fünfeinhalb Jahre beobachtet wurden, und liest dann den Cochrane-Review von neun Studien mit 20.101 Beschäftigten. Daneben stehen, wie verbreitet Rückenschmerz in Europa ist, die Rangfolge der Maßnahmen nach EU-Recht und HSE, der HSE-Filter für Gewichte nach Lage der Hände und eine Karte für eine Hebeaufgabe."),
  figure: { n: x("20,101", "20.101", "20.101"), by: "Verbeek et al., 2011", t: x(
    "workers in nine randomised trials: none showed that training in lifting technique prevents back pain.",
    "punonjës në nëntë studime të rastësishme: asnjë nuk tregoi që trajnimi në teknikën e ngritjes e parandalon dhimbjen e shpinës.",
    "Beschäftigte in neun randomisierten Studien: Keine zeigte, dass Schulung in Hebetechnik Rückenschmerz verhindert.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("The postal workers who learned to lift", "Postarët që mësuan të ngrinin", "Die Postbeschäftigten, die heben lernten") },
    { page: "model", kicker: x("The model", "Modeli", "Das Modell"),
      title: x("Avoid, assess, reduce, then train", "Shmang, vlerëso, ul, pastaj trajno", "Vermeiden, beurteilen, verringern, dann schulen") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The handling task card", "Karta e detyrës me peshë", "Die Karte für die Hebeaufgabe") },
  ],
  sources: ["lifting-martimo-2008", "lifting-verbeek-2011", "lifting-euosha-2019", "hse-accidents-2025", "lifting-hse-indg143", "lifting-lasthandhabv"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "When backs hurt in a warehouse, a kitchen or on a ward, the usual answer is a course: bend the knees, keep the back straight. It is cheap, it can be signed off, and it puts the answer in the worker's body. This issue asks what the trials found, and what comes before the course.",
        "Kur dhemb shpina në një magazinë, në një kuzhinë apo në një repart, përgjigjja e zakonshme është një kurs: përkul gjunjët, mbaje shpinën drejt. Kushton pak, mund të nënshkruhet, dhe e vendos zgjidhjen te trupi i punonjësit. Ky numër pyet çfarë gjetën studimet, dhe çfarë vjen para kursit.",
        "Wenn im Lager, in der Küche oder auf Station die Rücken schmerzen, ist die übliche Antwort ein Kurs: Knie beugen, Rücken gerade. Er ist billig, lässt sich abzeichnen und legt die Lösung in den Körper der Beschäftigten. Diese Ausgabe fragt, was die Studien fanden und was vor dem Kurs kommt."),
      body: x(
        "In a trial with 3,597 postal workers, training raised knowledge but not the lifting, and back injuries were no fewer than after a video. A Cochrane review of nine trials with 20,101 workers found none in which training prevented back pain. In Europe 43% of workers report backache. EU law and HSE put avoiding and reducing the load first; HSE's filter shows the weight that is low risk falling with the hands' distance from the waist. A card for one task closes the issue.",
        "Në një studim me 3.597 punonjës postarë, trajnimi rriti njohuritë, por jo mënyrën e ngritjes, dhe lëndimet e shpinës nuk qenë më të pakta se pas një videoje. Një rishikim Cochrane i nëntë studimeve me 20.101 punonjës nuk gjeti asnjë ku trajnimi ta parandalonte dhimbjen e shpinës. Në Evropë 43% e punonjësve raportojnë dhimbje shpine. Ligji evropian dhe HSE e vënë të parën shmangien dhe uljen e ngarkesës; filtri i HSE-së tregon peshën me rrezik të ulët që bie sa më larg mesit janë duart. Një kartë për një detyrë e mbyll numrin.",
        "In einer Studie mit 3.597 Postbeschäftigten stieg durch Schulung das Wissen, nicht aber die Hebetechnik, und es gab nicht weniger Rückenverletzungen als nach einem Video. Ein Cochrane-Review von neun Studien mit 20.101 Beschäftigten fand keine, in der Schulung Rückenschmerz verhinderte. In Europa berichten 43 % der Beschäftigten von Rückenschmerzen. EU-Recht und HSE stellen Vermeiden und Verringern der Last an den Anfang; der HSE-Filter zeigt, wie das Gewicht mit geringem Risiko sinkt, je weiter die Hände von der Taille sind. Eine Karte für eine Aufgabe schließt die Ausgabe."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("The postal workers", "Postarët që", "Die Postbeschäftigten,"), x("who learned to lift", "mësuan të ngrinin", "die heben lernten")],
      lead: x(
        "In a US postal trial, 3,597 workers were randomised in clusters. One group got two sessions of 1.5 hours on proper lifting and carrying, with supervisors involved and follow-up at work; the other got the usual video. The researchers then counted back injuries for five and a half years.",
        "Në një studim me postën amerikane, 3.597 punonjës u ndanë rastësisht në grupe. Një grup mori dy seanca nga 1,5 orë për ngritjen dhe mbajtjen e duhur, me përfshirjen e drejtuesve dhe ndjekje në punë; tjetri mori videon e zakonshme. Studiuesit numëruan pastaj lëndimet e shpinës për pesë vjet e gjysmë.",
        "In einer Studie bei der US-Post wurden 3.597 Beschäftigte in Clustern randomisiert. Eine Gruppe erhielt zwei Sitzungen zu je 1,5 Stunden über richtiges Heben und Tragen, mit Vorgesetzten und Nachbetreuung am Arbeitsplatz; die andere das übliche Video. Dann zählten die Forscher fünfeinhalb Jahre lang Rückenverletzungen."),
      blocks: [
        { type: "figures", compact: true, items: [
          { n: x("1.08", "1,08", "1,08"), t: x("odds of back injury, trained against video: no difference (95% interval 0.56 to 2.08)", "shanset e lëndimit të shpinës, të trajnuarit kundrejt videos: asnjë ndryshim (intervali 95%: 0,56 deri 2,08)", "Chance einer Rückenverletzung, geschult gegenüber Video: kein Unterschied (95-%-Intervall 0,56 bis 2,08)") },
          { n: x("5.5 yrs", "5,5 vjet", "5,5 Jahre"), t: x("of follow-up, rated high quality by the reviewers", "ndjekje, e vlerësuar me cilësi të lartë nga rishikuesit", "Nachbeobachtung, von den Reviewern als hochwertig eingestuft") },
        ] },
        { type: "p", text: x(
          "The researchers reported separately what had changed: the workers knew more, but their lifting and handling did not improve significantly. Martimo and colleagues, who pooled this trial with ten other studies in the BMJ in 2008, concluded that the findings challenge the widespread practice of advising workers on correct lifting technique.",
          "Studiuesit raportuan veçmas çfarë kishte ndryshuar: punonjësit dinin më shumë, por mënyra si ngrinin dhe mbanin nuk u përmirësua ndjeshëm. Martimo dhe kolegët, që e bashkuan këtë studim me dhjetë të tjera në BMJ më 2008, arritën në përfundimin se gjetjet e vënë në dyshim praktikën e përhapur të këshillimit të punonjësve për teknikën e saktë të ngritjes.",
          "Die Forscher berichteten gesondert, was sich geändert hatte: Die Beschäftigten wussten mehr, aber ihr Heben und Tragen verbesserte sich nicht signifikant. Martimo und Kollegen, die diese Studie 2008 im BMJ mit zehn weiteren zusammenfassten, schlossen, die Ergebnisse stellten die verbreitete Praxis infrage, Beschäftigte zur richtigen Hebetechnik zu beraten.") },
        { type: "callout", reading: true, text: x(
          "Knowing how to lift and lifting that way are two things. Neither one changes how heavy the box is or where it sits.",
          "Të dish si ngrihet dhe të ngresh ashtu janë dy gjëra. Asnjëra nuk ndryshon sa e rëndë është kutia ose ku qëndron ajo.",
          "Wissen, wie man hebt, und so heben sind zweierlei. Keines von beiden ändert, wie schwer die Kiste ist oder wo sie steht.") },
      ],
      note: x(
        "Daltroy et al. (1997) as Martimo et al. (2008) report it; the odds ratio is the reviewers', adjusted for clustering. The change in knowledge but not in behaviour is from the trial's separate report (1993), as both reviews cite it.",
        "Daltroy et al. (1997) siç e raportojnë Martimo et al. (2008); raporti i shanseve është i rishikuesve, i korrigjuar për grupimin. Ndryshimi te njohuritë, por jo te sjellja, vjen nga raporti i veçantë i studimit (1993), siç e citojnë të dy rishikimet.",
        "Daltroy et al. (1997), wie Martimo et al. (2008) berichten; das Odds Ratio stammt von den Reviewern, für Clusterung korrigiert. Mehr Wissen ohne verändertes Verhalten stammt aus dem gesonderten Bericht der Studie (1993), wie beide Reviews ihn zitieren."),
      source: ["lifting-martimo-2008", "lifting-verbeek-2011"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("How common", "Sa e zakonshme", "Wie verbreitet"), x("the sore back is", "është shpina që dhemb", "der schmerzende Rücken ist")],
      lead: x(
        "EU-OSHA put the European surveys together in 2019. Roughly three in five workers reported a musculoskeletal complaint in the past year, and of all workers with a work-related health problem, 60% named these disorders as the most serious one.",
        "EU-OSHA i bashkoi anketat evropiane më 2019. Rreth tre në pesë punonjës raportuan një shqetësim muskuloskeletor në vitin e fundit, dhe nga të gjithë punonjësit me një problem shëndetësor nga puna, 60% i quajtën këto çrregullime problemin më të rëndë.",
        "Die EU-OSHA hat 2019 die europäischen Erhebungen zusammengeführt. Rund drei von fünf Beschäftigten berichteten im letzten Jahr über Muskel-Skelett-Beschwerden, und von allen mit einem arbeitsbedingten Gesundheitsproblem nannten 60 % diese Erkrankungen als das schwerste."),
      blocks: [
        { type: "hbars", max: 100, source: ["lifting-euosha-2019"],
          label: x("Workers reporting each complaint in the past 12 months, EU-28, 2015", "Punonjës që raportuan secilin shqetësim në 12 muajt e fundit, BE-28, 2015", "Beschäftigte mit der jeweiligen Beschwerde in den letzten 12 Monaten, EU-28, 2015"),
          items: [
            { k: x("One or more musculoskeletal disorders", "Një ose më shumë çrregullime muskuloskeletore", "Eine oder mehrere Muskel-Skelett-Erkrankungen"), v: 58, n: pc(58) },
            { k: x("Backache", "Dhimbje shpine", "Rückenschmerzen"), v: 43, n: pc(43), alert: true },
            { k: x("Shoulders, neck or upper limbs", "Supet, qafa ose gjymtyrët e sipërme", "Schultern, Nacken oder obere Gliedmaßen"), v: 41, n: pc(41) },
            { k: x("Lower limbs", "Gjymtyrët e poshtme", "Untere Gliedmaßen"), v: 29, n: pc(29) },
          ] },
        { type: "figures", compact: true, items: [
          { n: pc(32), t: x("carry or move heavy loads at least a quarter of the time (2015)", "mbajnë ose lëvizin pesha të rënda të paktën një të katërtën e kohës (2015)", "tragen oder bewegen mindestens ein Viertel der Zeit schwere Lasten (2015)") },
          { n: pc(22), t: x("of injuries in Great Britain with over seven days off came from handling, lifting or carrying (2024/25)", "e lëndimeve në Britani me mbi shtatë ditë mungesë erdhën nga trajtimi, ngritja ose mbajtja e peshave (2024/25)", "der Verletzungen in Großbritannien mit über sieben Ausfalltagen kamen vom Handhaben, Heben oder Tragen (2024/25)") },
        ] },
        { type: "callout", reading: true, text: x(
          "Handling injuries seldom make the list of specified injuries, which are mostly fractures: 5% of them, against 22% of the long absences. The cost shows up as days off.",
          "Lëndimet nga peshat rrallë hyjnë në listën e lëndimeve të caktuara, që janë kryesisht thyerje: 5% e tyre, kundrejt 22% të mungesave të gjata. Kostoja duket te ditët e humbura.",
          "Verletzungen beim Heben stehen selten auf der Liste besonders schwerer Verletzungen, meist Brüche: 5 % davon, gegenüber 22 % der langen Ausfälle. Die Kosten zeigen sich in Ausfalltagen."),
        },
      ],
      note: x(
        "Bars: self-reports in the European Working Conditions Survey, 31,612 workers, any cause, not only lifting. Figures: EWCS 2015; HSE, employer reports under RIDDOR, provisional. The ranking of injury kinds is in No. 15.",
        "Shiritat: vetëraportime në Anketën Evropiane të Kushteve të Punës, 31.612 punonjës, nga çdo shkak, jo vetëm nga ngritja. Shifrat: EWCS 2015; HSE, raportet e punëdhënësve sipas RIDDOR, paraprake. Renditja e llojeve të lëndimeve është te Nr. 15.",
        "Balken: Selbstauskünfte in der Europäischen Erhebung über die Arbeitsbedingungen, 31.612 Beschäftigte, jede Ursache, nicht nur Heben. Zahlen: EWCS 2015; HSE, Arbeitgebermeldungen nach RIDDOR, vorläufig. Die Rangfolge der Unfallarten steht in Nr. 15."),
      source: ["lifting-euosha-2019", "hse-accidents-2025"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("Nine trials,", "Nëntë studime,", "Neun Studien,"), x("one answer", "një përgjigje", "eine Antwort")],
      lead: x(
        "Jos Verbeek and colleagues updated the Cochrane review in 2011: nine randomised trials with 20,101 workers and nine cohort studies with 1,280, among carers lifting patients, mail and baggage handlers, and construction workers. Training was compared with nothing, a video, back belts, exercise or other education.",
        "Jos Verbeek dhe kolegët e përditësuan rishikimin Cochrane më 2011: nëntë studime të rastësishme me 20.101 punonjës dhe nëntë studime kohorte me 1.280, mes atyre që ngrenë pacientë, punonjësve të postës e bagazheve dhe ndërtuesve. Trajnimi u krahasua me asgjë, me një video, me rripa shpine, me ushtrime ose me edukim tjetër.",
        "Jos Verbeek und Kollegen aktualisierten 2011 den Cochrane-Review: neun randomisierte Studien mit 20.101 Beschäftigten und neun Kohortenstudien mit 1.280, darunter Pflegende, Post- und Gepäckbeschäftigte und Bauarbeiter. Schulung wurde mit nichts, einem Video, Rückengurten, Training oder anderer Unterweisung verglichen."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("Training against nothing", "Trajnim kundrejt asgjëje", "Schulung gegen nichts"), p: x("back pain similar; odds ratio 1.17, interval 0.68 to 2.02 (moderate quality)", "dhimbja e shpinës e ngjashme; raporti i shanseve 1,17, intervali 0,68 deri 2,02 (cilësi mesatare)", "Rückenschmerz ähnlich; Odds Ratio 1,17, Intervall 0,68 bis 2,02 (mittlere Qualität)") },
          { h: x("Intensive training against a video", "Trajnim intensiv kundrejt një videoje", "Intensive Schulung gegen ein Video"), p: x("similar; in one trial a measuring device gave constant feedback on back load", "e ngjashme; në një studim një pajisje matëse jepte vazhdimisht të dhëna për ngarkesën e shpinës", "ähnlich; in einer Studie gab ein Messgerät ständig Rückmeldung zur Rückenlast") },
          { h: x("Training against back belts or exercise", "Trajnim kundrejt rripave ose ushtrimeve", "Schulung gegen Gurte oder Training"), p: x("similar (belts: low quality; exercise: cohort studies only)", "e ngjashme (rripat: cilësi e ulët; ushtrimet: vetëm studime kohorte)", "ähnlich (Gurte: geringe Qualität; Training: nur Kohortenstudien)") },
          { h: x("Training with lifting aids", "Trajnim me mjete ngritjeje", "Schulung mit Hebehilfen"), p: x("one trial, 346 nurses: similar after a year (low quality)", "një studim, 346 infermierë: e ngjashme pas një viti (cilësi e ulët)", "eine Studie, 346 Pflegekräfte: ähnlich nach einem Jahr (geringe Qualität)") },
        ] },
        { type: "p", text: x(
          "Where compliance was checked, four of six studies saw lifting change, and still back pain did not. The reviewers note that the textbook leg lift has itself been questioned on biomechanical grounds.",
          "Aty ku u kontrollua zbatimi, katër nga gjashtë studime panë ndryshim në ngritje, e megjithatë dhimbja e shpinës jo. Rishikuesit shënojnë se edhe ngritja klasike me këmbë është vënë në dyshim nga biomekanika.",
          "Wo die Umsetzung geprüft wurde, sahen vier von sechs Studien ein verändertes Heben, und doch nicht weniger Rückenschmerz. Die Reviewer merken an, dass selbst das Lehrbuch-Heben aus den Beinen biomechanisch infrage gestellt wurde.") },
        { type: "callout", reading: true, text: x(
          "The review tested the worker's technique, not the job. Workplace redesign was outside its scope, so it says little about what redesign would do.",
          "Rishikimi provoi teknikën e punonjësit, jo punën. Ndryshimi i vendit të punës ishte jashtë fushës së tij, prandaj ai thotë pak për efektin e ridizenjimit.",
          "Der Review prüfte die Technik der Beschäftigten, nicht die Arbeit. Umgestaltung des Arbeitsplatzes lag außerhalb seines Rahmens; zu ihrer Wirkung sagt er wenig.") },
      ],
      note: x(
        "Odds ratio from the review's abstract, seven trials, 19,317 workers. Confidence intervals are wide because the reviewers corrected for clustered designs. A reader's comment of 2007, printed with the review, warns that no evidence of effect is not evidence of no effect.",
        "Raporti i shanseve nga abstrakti i rishikimit, shtatë studime, 19.317 punonjës. Intervalet janë të gjera, sepse rishikuesit korrigjuan për modelet e grupuara. Një koment lexuesi i 2007-s, i botuar me rishikimin, paralajmëron se mungesa e provës së efektit nuk është provë e mungesës së efektit.",
        "Odds Ratio aus dem Abstract des Reviews, sieben Studien, 19.317 Beschäftigte. Die Intervalle sind breit, weil die Reviewer für Clusterdesigns korrigierten. Ein Leserkommentar von 2007, mit dem Review abgedruckt, warnt: Fehlender Wirkungsnachweis ist kein Nachweis fehlender Wirkung."),
      source: ["lifting-verbeek-2011"],
    },
    {
      id: "model",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Avoid, assess,", "Shmang, vlerëso,", "Vermeiden, beurteilen,"), x("reduce, then train", "ul, pastaj trajno", "verringern, dann schulen")],
      lead: x(
        "Germany's Lastenhandhabungsverordnung, which carries out EU Directive 90/269/EEC, sets an order: first avoid hazardous handling by organisation or mechanical equipment; where it cannot be avoided, assess it and keep the risk as low as possible. Instruction is a duty of its own. HSE's guide puts training after avoiding and reducing.",
        "Lastenhandhabungsverordnung gjermane, që zbaton Direktivën e BE-së 90/269/KEE, vendos një rend: së pari shmang trajtimin e rrezikshëm të peshave me organizim ose me pajisje mekanike; ku nuk shmanget, vlerësoje dhe mbaje rrezikun sa më të ulët. Udhëzimi është detyrim më vete. Udhëzuesi i HSE-së e vë trajnimin pas shmangies dhe uljes.",
        "Die Lastenhandhabungsverordnung, die die EU-Richtlinie 90/269/EWG umsetzt, legt eine Reihenfolge fest: zuerst gefährdende Lastenhandhabung durch Organisation oder mechanische Ausrüstung vermeiden; wo das nicht geht, beurteilen und die Gefährdung möglichst gering halten. Die Unterweisung ist eine eigene Pflicht. Der HSE-Leitfaden stellt die Schulung hinter Vermeiden und Verringern."),
      blocks: [
        { type: "lists", cols: [
          { h: x("The load", "Pesha", "Die Last"), items: [
            x("weight, shape and size", "pesha, forma dhe madhësia", "Gewicht, Form und Größe"),
            x("where it is gripped", "ku kapet", "Lage der Zugriffsstellen"),
            x("centre of gravity, sudden movement", "qendra e rëndesës, lëvizja e papritur", "Schwerpunkt, unvorhergesehene Bewegung"),
          ] },
          { h: x("The task", "Detyra", "Die Aufgabe"), accent: true, items: [
            x("posture, twisting, distance from the body", "qëndrimi, rrotullimi, largësia nga trupi", "Haltung, Drehen, Abstand vom Körper"),
            x("how far, how often, how long", "sa larg, sa shpesh, sa gjatë", "wie weit, wie oft, wie lange"),
            x("a pace the worker cannot change; rest", "ritmi që punonjësi s'e ndryshon; pushimi", "nicht änderbares Tempo; Erholungszeit"),
          ] },
          { h: x("The workplace", "Vendi i punës", "Der Arbeitsplatz"), items: [
            x("headroom, changes of level", "hapësira lart, ndryshimet e nivelit", "Raum nach oben, Höhenunterschiede"),
            x("heat, humidity, light", "nxehtësia, lagështia, drita", "Temperatur, Feuchte, Licht"),
            x("an even, non-slip floor; footwear", "dysheme e rrafshët, jo e rrëshqitshme; këpucët", "ebener, rutschfester Boden; Schuhwerk"),
          ] },
        ] },
        { type: "p", text: x(
          "HSE puts it plainly: information and training alone will not ensure safe handling, and on its own training cannot make up for missing aids, badly designed tasks, unsuitable loads or an unsuitable workplace.",
          "HSE e thotë qartë: informimi dhe trajnimi vetëm nuk e sigurojnë trajtimin e sigurt të peshave, dhe trajnimi më vete nuk mund të zëvendësojë mjetet që mungojnë, detyrat e projektuara keq, peshat e papërshtatshme ose vendin e papërshtatshëm të punës.",
          "Die HSE sagt es klar: Information und Schulung allein sichern kein sicheres Handhaben, und Schulung für sich kann fehlende Hilfsmittel, schlecht gestaltete Aufgaben, ungeeignete Lasten oder einen ungeeigneten Arbeitsplatz nicht ausgleichen.") },
        { type: "callout", reading: true, text: x(
          "Most of these features belong to the job, not to the worker's spine. The manager owns them.",
          "Shumica e këtyre veçorive i përkasin punës, jo shtyllës kurrizore të punonjësit. Ato janë të menaxherit.",
          "Die meisten dieser Merkmale gehören zur Arbeit, nicht zur Wirbelsäule der Beschäftigten. Sie liegen bei der Führungskraft.") },
      ],
      note: x(
        "Features from the annex of the Lastenhandhabungsverordnung (§ 2, annex), shortened by the editors; the order of measures from § 2 and from HSE's INDG143. Heat and handling together are in No. 84; floors and footwear in No. 100.",
        "Veçoritë nga shtojca e Lastenhandhabungsverordnung (§ 2, shtojca), të shkurtuara nga redaksia; rendi i masave nga § 2 dhe nga INDG143 e HSE-së. Nxehtësia bashkë me peshat është te Nr. 84; dyshemetë dhe këpucët te Nr. 100.",
        "Merkmale aus dem Anhang der Lastenhandhabungsverordnung (§ 2, Anhang), von der Redaktion gekürzt; die Reihenfolge der Maßnahmen aus § 2 und aus INDG143 der HSE. Hitze und Heben zusammen in Nr. 84; Böden und Schuhwerk in Nr. 100."),
      source: ["lifting-lasthandhabv", "lifting-hse-indg143"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie es gemessen wird"),
      title: [x("Where the", "Ku janë", "Wo die Hände"), x("hands are", "duart", "sind")],
      lead: x(
        "HSE's risk filter does not set a safe limit; it marks tasks that are low risk. The weight in each box assumes a load easily gripped with both hands, a stable stance and reasonable conditions. It falls as the hands move away from the waist.",
        "Filtri i rrezikut i HSE-së nuk vendos një kufi të sigurt; ai shënon detyrat me rrezik të ulët. Pesha në çdo kuti supozon një ngarkesë që kapet lehtë me të dy duart, qëndrim të qëndrueshëm dhe kushte të arsyeshme. Ajo bie sa më larg mesit shkojnë duart.",
        "Der Risikofilter der HSE setzt keine sichere Grenze; er markiert Aufgaben mit geringem Risiko. Das Gewicht in jedem Feld setzt eine mit beiden Händen leicht greifbare Last, einen stabilen Stand und vernünftige Bedingungen voraus. Es sinkt, je weiter die Hände von der Taille weg sind."),
      blocks: [
        { type: "columns", height: 140, source: ["lifting-hse-indg143"],
          label: x("HSE filter, men, load close to the body, kg by zone of the hands", "Filtri i HSE-së, burra, pesha pranë trupit, kg sipas zonës së duarve", "HSE-Filter, Männer, Last körpernah, kg nach Zone der Hände"),
          items: [
            { k: x("Above shoulder", "Mbi sup", "Über Schulter"), v: 10, n: "10" },
            { k: x("Chest", "Gjoks", "Brust"), v: 20, n: "20" },
            { k: x("Waist", "Mesi", "Taille"), v: 25, n: "25", alert: true },
            { k: x("Knee", "Gjuri", "Knie"), v: 20, n: "20" },
            { k: x("Near floor", "Pranë tokës", "Bodennah"), v: 10, n: "10" },
          ] },
        { type: "rows", compact: true, items: [
          { h: x("Arms extended", "Krahët të shtrirë", "Arme gestreckt"), p: x("lower values: 15 kg instead of 25 between elbow and knuckle; women's values are about two thirds", "vlera më të ulëta: 15 kg në vend të 25 mes bërrylit dhe nyjeve të gishtave; vlerat për gratë janë rreth dy të tretat", "niedrigere Werte: 15 statt 25 kg zwischen Ellbogen und Fingerknöcheln; die Werte für Frauen liegen bei rund zwei Dritteln") },
          { h: x("Look closer if", "Shiko më nga afër nëse", "Genauer hinsehen, wenn"), p: x("the torso twists, lifts come more than once every two minutes, a team lifts, or a load is carried beyond about 10 m", "trupi rrotullohet, ngritjet vijnë më shpesh se një herë në dy minuta, ngre një ekip, ose pesha mbahet përtej rreth 10 m", "der Rumpf sich dreht, öfter als einmal in zwei Minuten gehoben wird, im Team gehoben wird oder weiter als etwa 10 m getragen wird") },
        ] },
      ],
      note: x(
        "Values from figure 1 of HSE's INDG143 (2020), men, hands close to the body; women 7, 13, 16, 13, 7 kg. Zones as HSE draws them, between shoulder, elbow, knuckle and mid-shin height; short names by the editors. Guidelines for groups, not limits for a person. Injury rates are in No. 87, fatigue in No. 89.",
        "Vlerat nga figura 1 e INDG143 të HSE-së (2020), burra, duart pranë trupit; gratë 7, 13, 16, 13, 7 kg. Zonat siç i vizaton HSE, mes lartësisë së supit, bërrylit, nyjeve të gishtave dhe mesit të kërcirit; emrat e shkurtër nga redaksia. Udhëzime për grupe, jo kufij për një person. Normat e lëndimeve janë te Nr. 87, lodhja te Nr. 89.",
        "Werte aus Abbildung 1 von INDG143 der HSE (2020), Männer, Hände körpernah; Frauen 7, 13, 16, 13, 7 kg. Zonen wie von der HSE gezeichnet, zwischen Schulter-, Ellbogen-, Fingerknöchel- und Schienbeinmitte-Höhe; Kurznamen von der Redaktion. Richtwerte für Gruppen, keine Grenzen für Einzelne. Verletzungsquoten in Nr. 87, Müdigkeit in Nr. 89."),
      source: ["lifting-hse-indg143"],
    },
    {
      id: "tool", tool: "/tools/risk-assessment/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The handling", "Karta e detyrës", "Die Karte für die"), x("task card", "me peshë", "Hebeaufgabe")],
      lead: x(
        "One card per handling task, filled in where the task is done and with the people who do it. The questions follow the legal order: can it go, can it be lighter or closer, and only then what people need to know. The full assessment belongs in Risk Assessment.",
        "Një kartë për çdo detyrë me peshë, e plotësuar aty ku bëhet detyra dhe bashkë me ata që e bëjnë. Pyetjet ndjekin rendin e ligjit: a mund të hiqet, a mund të bëhet më e lehtë ose më pranë, dhe vetëm pastaj çfarë duhet të dinë njerëzit. Vlerësimi i plotë shkon te Risk Assessment.",
        "Eine Karte pro Hebeaufgabe, dort ausgefüllt, wo die Aufgabe erledigt wird, und mit denen, die sie erledigen. Die Fragen folgen der gesetzlichen Reihenfolge: Kann sie entfallen, kann sie leichter oder näher werden, und erst dann, was die Leute wissen müssen. Die vollständige Beurteilung gehört in Risk Assessment."),
      blocks: [
        { type: "form", items: [
          { h: x("Task and load", "Detyra dhe pesha", "Aufgabe und Last"), hint: x("what, from where to where, heaviest weight, how it is gripped", "çfarë, nga ku deri ku, pesha më e madhe, si kapet", "was, von wo nach wo, schwerstes Gewicht, wie gegriffen") },
          { h: x("Where the hands go", "Ku shkojnë duart", "Wohin die Hände gehen"), hint: x("lowest and highest point, arms close or extended, twisting", "pika më e ulët dhe më e lartë, krahët pranë apo të shtrirë, rrotullimi", "tiefster und höchster Punkt, Arme nah oder gestreckt, Drehen") },
          { h: x("How often, how far", "Sa shpesh, sa larg", "Wie oft, wie weit"), hint: x("lifts per hour, carrying distance, pace set by whom", "ngritje në orë, largësia e mbajtjes, kush e cakton ritmin", "Hebungen pro Stunde, Tragestrecke, wer das Tempo bestimmt") },
          { h: x("Can it be avoided?", "A mund të shmanget?", "Lässt es sich vermeiden?"), hint: x("deliver to the point of use, conveyor, truck, hoist, store at waist height", "dorëzim aty ku përdoret, rrip transportues, karrocë, ngritës, ruajtje në lartësinë e mesit", "Anlieferung am Verwendungsort, Förderband, Hubwagen, Hebezeug, Lagerung auf Taillenhöhe") },
          { h: x("Can it be reduced?", "A mund të ulet?", "Lässt es sich verringern?"), hint: x("smaller packs, handles, shorter route, rotation, ask the supplier", "paketime më të vogla, doreza, rrugë më e shkurtër, rotacion, kërkesë te furnitori", "kleinere Gebinde, Griffe, kürzerer Weg, Wechsel, Lieferant fragen") },
          { h: x("Owner, date, then the briefing", "Përgjegjësi, data, pastaj udhëzimi", "Verantwortlich, Datum, dann die Unterweisung"), hint: x("who changes what by when; what people are told about the task that remains", "kush ndryshon çfarë deri kur; çfarë u thuhet njerëzve për detyrën që mbetet", "wer was bis wann ändert; was über die verbleibende Aufgabe unterwiesen wird") },
        ] },
      ],
      note: x(
        "The card is the editors' proposal, built on the order of measures in the Lastenhandhabungsverordnung and HSE's INDG143, not a tested instrument. The author has no essay on lifting; none is linked.",
        "Karta është propozim i redaksisë, i ndërtuar mbi rendin e masave në Lastenhandhabungsverordnung dhe INDG143 të HSE-së, jo një instrument i provuar. Autori nuk ka ese për ngritjen e peshave; nuk lidhet asnjë.",
        "Die Karte ist ein Vorschlag der Redaktion, gestützt auf die Reihenfolge der Maßnahmen in der Lastenhandhabungsverordnung und INDG143 der HSE, kein erprobtes Instrument. Der Autor hat keinen Essay zum Heben; keiner ist verlinkt."),
      source: ["lifting-lasthandhabv", "lifting-hse-indg143"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
