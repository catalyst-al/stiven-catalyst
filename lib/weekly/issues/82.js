// Management Review, No. 82: Regression to the mean. Block: KPI. Facts and their sources:
// docs/revista/management-review-nr-82.md. Kahneman's story is from his Nobel autobiography (nobelprize.org), Galton's
// table from the 1886 paper (scan at galton.org), the examples and remedies from Morton & Torgerson (2003) and Linden
// (2013), both read in full at PubMed Central. Barnett et al. (2005) could not be opened in full and was left out.
import { x } from "../common.js";

export default {
  number: 82,
  block: "kpi",
  date: x("November 2026", "Nëntor 2026", "November 2026"),
  theme: [x("Regression", "Kthimi", "Regression"), x("to the mean", "drejt mesatares", "zur Mitte")],
  sub: x(
    "Why the worst shift improves on its own and the best one slips: Kahneman's flight instructors, Galton's heights, how big the false improvement gets, a control group that got better without help, and a card.",
    "Pse turni më i keq përmirësohet vetë dhe më i miri bie: instruktorët e fluturimit të Kahneman-it, gjatësitë e Galton-it, sa e madhe bëhet përmirësimi i rremë, një grup kontrolli që u përmirësua pa ndihmë, dhe një kartë.",
    "Warum die schlechteste Schicht sich von selbst bessert und die beste nachlässt: Kahnemans Fluglehrer, Galtons Körpergrößen, wie groß die Scheinverbesserung wird, eine Kontrollgruppe ohne Hilfe und eine Karte."),
  seo: x(
    "Regression to the mean for managers: Kahneman's flight instructors, Galton's heights of 1886, a simulation, a control group and a before-and-after card.",
    "Kthimi drejt mesatares për menaxherët: instruktorët e Kahneman-it, gjatësitë e Galton-it (1886), një simulim, një grup kontrolli dhe një kartë.",
    "Regression zur Mitte für Führungskräfte: Kahnemans Fluglehrer, Galtons Körpergrößen von 1886, eine Simulation, eine Kontrollgruppe und eine Karte."),
  feature: x(
    "A flight instructor told Daniel Kahneman that praise made cadets worse and shouting made them better. Issue 82 explains why he saw what he saw. It goes back to Galton's table of 1886, shows how large a false improvement gets when two measurements agree only loosely, and follows a control group whose worst scorers improved by eight points with no help at all. Five checks before a fix gets the credit, and a card for any before-and-after claim, close the issue.",
    "Një instruktor fluturimi i tha Daniel Kahneman-it se lavdërimi i bënte kadetët më të dobët dhe të bërtiturat më të mirë. Numri 82 shpjegon pse ai pa atë që pa. Kthehet te tabela e Galton-it e vitit 1886, tregon sa i madh bëhet një përmirësim i rremë kur dy matje përputhen vetëm pak, dhe ndjek një grup kontrolli ku më të dobëtit u përmirësuan me tetë pikë pa asnjë ndihmë. Pesë kontrolle para se t'i jepet merita një ndryshimi, dhe një kartë për çdo pretendim para-pas, e mbyllin numrin.",
    "Ein Fluglehrer sagte Daniel Kahneman, Lob mache Kadetten schlechter und Anschreien besser. Ausgabe 82 erklärt, warum er sah, was er sah. Sie geht zu Galtons Tabelle von 1886 zurück, zeigt, wie groß eine Scheinverbesserung wird, wenn zwei Messungen nur lose übereinstimmen, und folgt einer Kontrollgruppe, deren Schwächste sich ohne jede Hilfe um acht Punkte verbesserten. Fünf Prüfungen, bevor eine Maßnahme das Verdienst bekommt, und eine Karte für jede Vorher-nachher-Behauptung beenden die Ausgabe."),
  figure: { n: x("+8.3", "+8,3", "+8,3"), by: "Linden, 2013", t: x(
    "points on a physical-health score for the controls who started below the high-risk cut-off, three months later, with no intervention at all.",
    "pikë në një tregues të shëndetit fizik për pjesëtarët e grupit të kontrollit që nisën nën kufirin e rrezikut të lartë, tre muaj më vonë, pa asnjë ndërhyrje.",
    "Punkte auf einer Skala der körperlichen Gesundheit bei den Kontrollpersonen, die unter der Hochrisikogrenze begannen, drei Monate später, ganz ohne Maßnahme.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("Praise, then a worse landing", "Lavdërim, pastaj ulje më e keqe", "Lob, dann eine schlechtere Landung") },
    { page: "research", kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: x("Improvement nobody made", "Përmirësim që s'e bëri askush", "Verbesserung, die niemand machte") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The before-and-after card", "Karta para-pas", "Die Vorher-nachher-Karte") },
  ],
  sources: ["rtm-kahneman-2002", "rtm-galton-1886", "rtm-morton-torgerson-2003", "rtm-linden-2013"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Every month a site picks out its worst shift, its worst driver, its worst store, and steps in. Next month the worst usually looks better and the best a little worse. Part of that movement would have happened anyway. This issue is about telling the two apart.",
        "Çdo muaj, një vend pune veçon turnin, shoferin ose dyqanin më të keq dhe ndërhyn. Muajin tjetër, më i keqi zakonisht duket më mirë dhe më i miri pak më keq. Një pjesë e kësaj lëvizjeje do të kishte ndodhur gjithsesi. Ky numër flet për si dallohen të dyja.",
        "Jeden Monat greift ein Standort seine schlechteste Schicht heraus, seinen schlechtesten Fahrer, seine schlechteste Filiale, und greift ein. Im Monat darauf sieht der Schlechteste meist besser aus und der Beste etwas schlechter. Ein Teil dieser Bewegung wäre ohnehin gekommen. Diese Ausgabe handelt davon, beides zu unterscheiden."),
      body: x(
        "Kahneman's flight instructors believed shouting worked better than praise. Galton's heights of 1886 show the same pull: children of tall parents were tall, but less so. In a simulation, the costliest fifth fell by $1,417 with no programme when two years agreed weakly, by $472 when they agreed well. In a real control group, the worst scorers gained eight points with no help. Five checks and a card help decide what a change really did.",
        "Instruktorët e fluturimit të Kahneman-it besonin se të bërtiturat funksiononin më mirë se lavdërimi. Gjatësitë e Galton-it të vitit 1886 tregojnë të njëjtën tërheqje: fëmijët e prindërve të gjatë ishin të gjatë, por më pak. Në një simulim, e pesta më e kushtueshme ra me 1.417 $ pa asnjë program kur dy vitet përputheshin pak, me 472 $ kur përputheshin mirë. Në një grup kontrolli të vërtetë, më të dobëtit fituan tetë pikë pa ndihmë. Pesë kontrolle dhe një kartë ndihmojnë të vendoset çfarë bëri vërtet një ndryshim.",
        "Kahnemans Fluglehrer glaubten, Anschreien wirke besser als Lob. Galtons Körpergrößen von 1886 zeigen denselben Zug: Kinder großer Eltern waren groß, aber weniger. In einer Simulation sanken die Kosten des teuersten Fünftels ohne Programm um 1.417 $, wenn zwei Jahre schwach übereinstimmten, um 472 $ bei guter Übereinstimmung. In einer echten Kontrollgruppe gewannen die Schwächsten acht Punkte ohne Hilfe. Fünf Prüfungen und eine Karte helfen zu entscheiden, was eine Änderung wirklich bewirkt hat."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("Praise, then a", "Lavdërim, pastaj", "Lob, dann eine"), x("worse landing", "ulje më e keqe", "schlechtere Landung")],
      lead: x(
        "As a young lecturer in Jerusalem, Daniel Kahneman was teaching the instructors of an air force flight school that praise works better than punishment. One of the most seasoned instructors objected.",
        "Si pedagog i ri në Jerusalem, Daniel Kahneman-i u mësonte instruktorëve të një shkolle fluturimi të forcave ajrore se lavdërimi funksionon më mirë se ndëshkimi. Një nga instruktorët më me përvojë e kundërshtoi.",
        "Als junger Dozent in Jerusalem lehrte Daniel Kahneman die Ausbilder einer Flugschule der Luftwaffe, dass Lob besser wirke als Strafe. Einer der erfahrensten Ausbilder widersprach."),
      blocks: [
        { type: "p", text: x(
          "Cadets he praised for a clean manoeuvre, he said, usually did worse the next time; cadets he screamed at usually did better. Kahneman saw that the observation was right and the conclusion wrong. Instructors praise after an unusually good attempt and shout after an unusually bad one, and the next attempt tends to lie closer to the cadet's usual level either way.",
          "Kadetët që i lavdëronte për një manovër të pastër, tha ai, zakonisht bënin më keq herën tjetër; ata që i bërtiste zakonisht bënin më mirë. Kahneman-i pa se vëzhgimi ishte i saktë dhe përfundimi i gabuar. Instruktorët lavdërojnë pas një përpjekjeje jashtëzakonisht të mirë dhe bërtasin pas një jashtëzakonisht të keqe, dhe përpjekja tjetër priret të bjerë më afër nivelit të zakonshëm të kadetit, në të dyja rastet.",
          "Kadetten, die er für ein sauberes Manöver lobte, sagte er, machten es beim nächsten Mal meist schlechter; die er anschrie, meist besser. Kahneman sah: Die Beobachtung stimmte, der Schluss nicht. Ausbilder loben nach einem ungewöhnlich guten Versuch und schreien nach einem ungewöhnlich schlechten, und der nächste Versuch liegt in beiden Fällen meist näher am üblichen Niveau des Kadetten.") },
        { type: "quote", text: x(
          "We are statistically punished for rewarding others and rewarded for punishing them.",
          "Statistikisht ndëshkohemi kur shpërblejmë të tjerët dhe shpërblehemi kur i ndëshkojmë.",
          "Wir werden statistisch dafür bestraft, andere zu belohnen, und dafür belohnt, sie zu bestrafen.") },
        { type: "p", text: x(
          "On the spot he had each participant toss two coins at a target behind his back, with no feedback. Those who did best the first time mostly did worse the second, and the other way round.",
          "Aty për aty, ai i kërkoi secilit pjesëmarrës të hidhte dy monedha drejt një objektivi pas shpine, pa asnjë reagim. Ata që bënë më mirë herën e parë, shumica bënë më keq herën e dytë, dhe anasjelltas.",
          "Sofort ließ er jeden Teilnehmer zwei Münzen rückwärts auf ein Ziel werfen, ohne Rückmeldung. Wer beim ersten Wurf am besten lag, lag beim zweiten meist schlechter, und umgekehrt.") },
        { type: "callout", reading: true, text: x(
          "On a shift floor the same pattern looks like proof that pressure works. It proves only that extremes do not last.",
          "Në sallën e turnit, i njëjti model duket si provë se presioni funksionon. Provon vetëm se ekstremet nuk zgjasin.",
          "Auf der Schichtfläche sieht dasselbe Muster aus wie ein Beweis, dass Druck wirkt. Es beweist nur, dass Extreme nicht anhalten.") },
      ],
      note: x(
        "Kahneman's own account in his Nobel autobiography (2002), which gives no year for it. The quote is shortened; the translations are ours. Feedback that changes behaviour is in No. 19.",
        "Rrëfimi i vetë Kahneman-it në autobiografinë e Nobelit (2002), që nuk e jep vitin. Citimi është i shkurtuar; përkthimet janë tonat. Reagimi që ndryshon sjelljen është te Nr. 19.",
        "Kahnemans eigene Darstellung in seiner Nobel-Autobiografie (2002), die kein Jahr dafür nennt. Das Zitat ist gekürzt; die Übersetzungen stammen von uns. Feedback, das Verhalten ändert, steht in Nr. 19."),
      source: ["rtm-kahneman-2002"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("Tall parents,", "Prindër të gjatë,", "Große Eltern,"), x("shorter children", "fëmijë më të shkurtër", "kleinere Kinder")],
      lead: x(
        "In 1886 Francis Galton published the heights of 930 adult children and of their parents, 205 couples, gathered through prizes for family records. He averaged each couple into a “mid-parent”, with women's heights multiplied by 1.08.",
        "Më 1886, Francis Galton-i botoi gjatësitë e 930 fëmijëve të rritur dhe të prindërve të tyre, 205 çifte, të mbledhura me çmime për regjistra familjarë. Çdo çift e ktheu në një “prind mesatar”, me gjatësitë e grave të shumëzuara me 1,08.",
        "1886 veröffentlichte Francis Galton die Körpergrößen von 930 erwachsenen Kindern und ihren Eltern, 205 Paaren, gesammelt über Preise für Familienaufzeichnungen. Jedes Paar fasste er zu einem „Mittel-Elternteil“ zusammen, die Größen der Frauen mit 1,08 multipliziert."),
      blocks: [
        { type: "dumbbell", from: x("Mid-parent", "Prindi mesatar", "Mittel-Elternteil"), to: x("Children, median", "Fëmijët, mediana", "Kinder, Median"), min: 64, max: 73, rowH: 24, source: ["rtm-galton-1886"],
          label: x("Height in inches, by group of mid-parents (1886)", "Gjatësia në inç, sipas grupit të prindërve mesatarë (1886)", "Größe in Zoll, nach Gruppe der Mittel-Eltern (1886)"),
          rows: [
            { k: x("Tall", "Të gjatë", "Groß"), a: 72.5, an: x("72.5", "72,5", "72,5"), b: 72.2, bn: x("72.2", "72,2", "72,2") },
            { k: x("Fairly tall", "Mjaft të gjatë", "Eher groß"), a: 70.5, an: x("70.5", "70,5", "70,5"), b: 69.5, bn: x("69.5", "69,5", "69,5") },
            { k: x("Middle", "Në mes", "Mitte"), a: 68.5, an: x("68.5", "68,5", "68,5"), b: 68.2, bn: x("68.2", "68,2", "68,2") },
            { k: x("Fairly short", "Mjaft të shkurtër", "Eher klein"), a: 66.5, an: x("66.5", "66,5", "66,5"), b: 67.2, bn: x("67.2", "67,2", "67,2") },
            { k: x("Short", "Të shkurtër", "Klein"), a: 64.5, an: x("64.5", "64,5", "64,5"), b: 65.8, bn: x("65.8", "65,8", "65,8"), alert: true },
          ] },
        { type: "p", text: x(
          "Galton's rule: a child's distance from the average is, on average, two-thirds of the mid-parent's. Read the other way, the most probable mid-parent of a man is only a third as far from the average as he is. The pull works in both directions.",
          "Rregulli i Galton-it: largësia e një fëmije nga mesatarja është, mesatarisht, dy të tretat e largësisë së prindit mesatar. E lexuar së prapthi, prindi mesatar më i mundshëm i një burri është vetëm një të tretën aq larg mesatares sa ai. Tërheqja punon në të dy drejtimet.",
          "Galtons Regel: Der Abstand eines Kindes vom Durchschnitt beträgt im Mittel zwei Drittel des Abstands seines Mittel-Elternteils. Umgekehrt gelesen ist der wahrscheinlichste Mittel-Elternteil eines Mannes nur ein Drittel so weit vom Durchschnitt entfernt wie er. Der Zug wirkt in beide Richtungen.") },
        { type: "callout", reading: true, text: x(
          "Nobody pushed the heights back. Selecting the extremes was enough to make them look as if they had moved.",
          "Askush nuk i shtyu gjatësitë mbrapsht. Mjaftoi zgjedhja e ekstremeve që ato të dukeshin sikur kishin lëvizur.",
          "Niemand hat die Größen zurückgeschoben. Es genügte, die Extreme auszuwählen, damit sie sich scheinbar bewegten.") },
      ],
      note: x(
        "Medians from Galton's Table I (928 children in its totals), five of the nine rows with a median; heights in inches. Galton explained the pull by heredity; it appears in any two measurements that agree only loosely.",
        "Medianat nga tabela I e Galton-it (928 fëmijë te totalet), pesë nga nëntë rreshtat me medianë; gjatësitë në inç. Galton-i e shpjegoi tërheqjen me trashëgiminë; ajo shfaqet te çdo dy matje që përputhen vetëm pak.",
        "Mediane aus Galtons Tabelle I (928 Kinder in den Summen), fünf der neun Zeilen mit Median; Größen in Zoll. Galton erklärte den Zug mit Vererbung; er zeigt sich bei je zwei Messungen, die nur lose übereinstimmen."),
      source: ["rtm-galton-1886", "rtm-morton-torgerson-2003"],
    },
    {
      id: "model",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Why the extremes", "Pse ekstremet", "Warum die Extreme"), x("come back", "kthehen", "zurückkommen")],
      lead: x(
        "The effect appears whenever a group is picked for an extreme value and measured again, and the two measurements are imperfectly correlated. The weaker the correlation and the more extreme the pick, the larger the drift.",
        "Efekti shfaqet sa herë që një grup zgjidhet për një vlerë ekstreme dhe matet përsëri, dhe dy matjet nuk korrelojnë plotësisht. Sa më i dobët korrelacioni dhe sa më ekstreme zgjedhja, aq më e madhe zhvendosja.",
        "Der Effekt tritt immer auf, wenn eine Gruppe wegen eines extremen Werts ausgewählt und erneut gemessen wird und die beiden Messungen nicht vollständig korrelieren. Je schwächer die Korrelation und je extremer die Auswahl, desto größer die Verschiebung."),
      blocks: [
        { type: "columns", max: 1500, height: 110, source: ["rtm-linden-2013"],
          label: x("Fall in the cost of the costliest fifth with no programme, by correlation between years (simulation, 2013)", "Rënia e kostos së të pestës më të kushtueshme pa program, sipas korrelacionit mes viteve (simulim, 2013)", "Rückgang der Kosten des teuersten Fünftels ohne Programm, nach Korrelation der Jahre (Simulation, 2013)"),
          items: [
            { k: x("ρ = 0.25", "ρ = 0,25", "ρ = 0,25"), v: 1417, n: x("$1,417", "1.417 $", "1.417 $"), alert: true },
            { k: x("ρ = 0.50", "ρ = 0,50", "ρ = 0,50"), v: 945, n: x("$945", "945 $", "945 $") },
            { k: x("ρ = 0.75", "ρ = 0,75", "ρ = 0,75"), v: 472, n: x("$472", "472 $", "472 $") },
          ] },
        { type: "p", text: x(
          "Ariel Linden simulated 10,000 people whose yearly costs averaged $5,000, with a standard deviation of $1,350. Those above about $6,136 in the first year, the costliest fifth, cost less in the second although nothing was done. The better the two years agreed, the smaller the fall.",
          "Ariel Linden-i simuloi 10.000 njerëz me kosto vjetore mesatare 5.000 $ dhe devijim standard 1.350 $. Ata mbi rreth 6.136 $ në vitin e parë, e pesta më e kushtueshme, kushtuan më pak në të dytin, ndonëse nuk u bë asgjë. Sa më mirë përputheshin dy vitet, aq më e vogël rënia.",
          "Ariel Linden simulierte 10.000 Personen mit Jahreskosten von im Mittel 5.000 $ und einer Standardabweichung von 1.350 $. Wer im ersten Jahr über etwa 6.136 $ lag, das teuerste Fünftel, kostete im zweiten weniger, obwohl nichts geschah. Je besser die beiden Jahre übereinstimmten, desto kleiner der Rückgang.") },
        { type: "callout", reading: true, text: x(
          "A shift's result is part pattern and part luck. Pick the worst, and you pick bad luck too; it rarely repeats.",
          "Rezultati i një turni është pjesërisht model dhe pjesërisht fat. Kur zgjedh më të keqin, zgjedh edhe fatin e keq; ai rrallë përsëritet.",
          "Das Ergebnis einer Schicht ist teils Muster, teils Zufall. Wer die schlechteste auswählt, wählt auch das Pech mit; es wiederholt sich selten.") },
      ],
      note: x(
        "The conditions are Morton & Torgerson's (2003). The bars are the mean fall in a simulation, not real patients; ρ is the correlation between the two years. Noise is in No. 20.",
        "Kushtet janë të Morton & Torgerson (2003). Shtyllat janë rënia mesatare në një simulim, jo pacientë të vërtetë; ρ është korrelacioni mes dy viteve. Zhurma është te Nr. 20.",
        "Die Bedingungen stammen von Morton & Torgerson (2003). Die Säulen zeigen den mittleren Rückgang in einer Simulation, keine echten Patienten; ρ ist die Korrelation der beiden Jahre. Streuung steht in Nr. 20."),
      source: ["rtm-morton-torgerson-2003", "rtm-linden-2013"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("Improvement", "Përmirësim që", "Verbesserung, die"), x("nobody made", "s'e bëri askush", "niemand machte")],
      lead: x(
        "Linden also looked at a real control group: 118 people in a health-coaching study who received no coaching. They answered the same physical-health questionnaire twice, three months apart.",
        "Linden-i shqyrtoi edhe një grup kontrolli të vërtetë: 118 njerëz në një studim për këshillim shëndetësor, që nuk morën asnjë këshillim. Iu përgjigjën të njëjtit pyetësor për shëndetin fizik dy herë, me tre muaj diferencë.",
        "Linden untersuchte auch eine echte Kontrollgruppe: 118 Personen in einer Studie zu Gesundheitscoaching, die kein Coaching bekamen. Sie beantworteten denselben Fragebogen zur körperlichen Gesundheit zweimal, im Abstand von drei Monaten."),
      blocks: [
        { type: "figures", compact: true, source: ["rtm-linden-2013", "rtm-morton-torgerson-2003"], items: [
          { n: x("+8.3", "+8,3", "+8,3"), t: x("points for the 34 who started below the high-risk cut-off; the rest stayed level", "pikë për 34 që nisën nën kufirin e rrezikut të lartë; të tjerët mbetën në të njëjtin nivel", "Punkte für die 34, die unter der Hochrisikogrenze begannen; die übrigen blieben gleich") },
          { n: x(">80%", ">80%", ">80 %"), t: x("of women whose bone density fell in the first year of treatment gained in the second, with no change in treatment", "e grave, dendësia e kockave të të cilave ra në vitin e parë të trajtimit, u rrit në të dytin, pa ndryshuar trajtimin", "der Frauen, deren Knochendichte im ersten Behandlungsjahr sank, legten im zweiten zu, ohne Änderung der Behandlung") },
        ] },
        { type: "p", text: x(
          "Morton and Torgerson draw the lesson for managers. Give the hospitals at the bottom of a league table extra resources, and most will climb; reward those at the top, and they will fall. Any intervention aimed at a group far from the average will appear to succeed. Because the effect works on groups, a single unit may still move the other way.",
          "Morton-i dhe Torgerson-i nxjerrin mësimin për menaxherët. Jepu spitaleve në fund të renditjes burime shtesë, dhe shumica do të ngjiten; shpërbleji ata në krye, dhe do të bien. Çdo ndërhyrje që synon një grup larg mesatares do të duket e suksesshme. Meqë efekti vepron te grupet, një njësi e vetme mund të lëvizë ende në drejtimin tjetër.",
          "Morton und Torgerson ziehen die Lehre für das Management. Gibt man den Krankenhäusern am Ende einer Rangliste mehr Mittel, steigen die meisten auf; belohnt man die an der Spitze, fallen sie. Jede Maßnahme für eine Gruppe weit weg vom Durchschnitt wird erfolgreich wirken. Weil der Effekt auf Gruppen wirkt, kann sich eine einzelne Einheit trotzdem in die andere Richtung bewegen.") },
        { type: "callout", reading: true, text: x(
          "The worst shift of the month is the easiest to turn around. That is why its turnaround proves the least.",
          "Turni më i keq i muajit është më i lehti për t'u kthyer. Prandaj kthesa e tij provon më pak se të gjitha.",
          "Die schlechteste Schicht des Monats lässt sich am leichtesten drehen. Deshalb beweist ihre Wende am wenigsten.") },
      ],
      note: x(
        "Control group: mean score 36.7, then 44.9 (2013). Bone density as Morton & Torgerson (2003) report it from a 2000 study we did not see. Read in the full text of both articles.",
        "Grupi i kontrollit: rezultati mesatar 36,7, pastaj 44,9 (2013). Dendësia e kockave siç e raportojnë Morton & Torgerson (2003) nga një studim i vitit 2000 që nuk e pamë. Lexuar te teksti i plotë i të dy artikujve.",
        "Kontrollgruppe: mittlerer Wert 36,7, dann 44,9 (2013). Knochendichte, wie Morton & Torgerson (2003) sie aus einer Studie von 2000 berichten, die wir nicht gesehen haben. Gelesen im Volltext beider Artikel."),
      source: ["rtm-linden-2013", "rtm-morton-torgerson-2003"],
    },
    {
      id: "measure", more: "a-bad-day-or-a-problem",
      kicker: x("How it is measured", "Si matet", "Wie es gemessen wird"),
      title: [x("Before the fix", "Para se t'i jepet", "Bevor die Maßnahme"), x("gets the credit", "merita ndryshimit", "das Verdienst bekommt")],
      lead: x(
        "The remedies in the literature are few and plain. A team can apply most of them to its own numbers before it credits a change.",
        "Mjetet që jep literatura janë pak dhe të thjeshta. Një ekip mund t'i zbatojë shumicën te shifrat e veta, para se t'ia japë meritën një ndryshimi.",
        "Die Abhilfen in der Literatur sind wenige und schlicht. Ein Team kann die meisten auf die eigenen Zahlen anwenden, bevor es einer Änderung das Verdienst zuschreibt."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("A comparison", "Një krahasim", "Ein Vergleich"), p: x("Units chosen the same way that did not get the change; at random if possible.", "Njësi të zgjedhura njësoj që nuk e morën ndryshimin; rastësisht, nëse mundet.", "Gleich ausgewählte Einheiten ohne die Änderung; wenn möglich per Los.") },
          { h: x("An average, not one value", "Një mesatare, jo një vlerë", "Ein Mittelwert, kein Einzelwert"), p: x("Pick the target on several periods before, not on one bad one.", "Zgjidhe objektivin mbi disa periudha më parë, jo mbi një të keqe.", "Das Ziel über mehrere Perioden wählen, nicht nach einer schlechten.") },
          { h: x("The expected drift", "Zhvendosja e pritur", "Die erwartete Verschiebung"), p: x("Group's distance from the average × (1 − correlation between periods).", "Largësia e grupit nga mesatarja × (1 − korrelacioni mes periudhave).", "Abstand der Gruppe vom Durchschnitt × (1 − Korrelation der Perioden).") },
          { h: x("The whole group", "I gjithë grupi", "Die ganze Gruppe"), p: x("The effect works on groups; one unit can move either way.", "Efekti vepron te grupet; një njësi e vetme mund të lëvizë në çdo drejtim.", "Der Effekt wirkt auf Gruppen; eine Einheit kann sich in jede Richtung bewegen.") },
          { h: x("The run, not two points", "Vargu, jo dy pika", "Die Reihe, nicht zwei Punkte"), p: x("Before and after over many periods, against the usual variation.", "Para dhe pas në shumë periudha, përballë luhatjes së zakonshme.", "Vorher und nachher über viele Perioden, gegen die übliche Streuung.") },
        ] },
        { type: "example", label: x("Hypothetical example, the worst of eight shifts", "Shembull hipotetik, më i keqi nga tetë turne", "Hypothetisches Beispiel, die schlechteste von acht Schichten"), rows: [
          { k: x("Shift C, month 1", "Turni C, muaji 1", "Schicht C, Monat 1"), v: x("4.1% late, the worst", "4,1% vonesa, më i keqi", "4,1 % verspätet, die schlechteste") },
          { k: x("After coaching", "Pas trajnimit", "Nach dem Coaching"), v: x("3.0%", "3,0%", "3,0 %") },
          { k: x("Shift C, ten months before", "Turni C, dhjetë muajt më parë", "Schicht C, zehn Monate davor"), v: x("2.9% on average", "2,9% mesatarisht", "2,9 % im Schnitt") },
        ], text: x("Shift C came back to its usual level. The figures are made up.", "Turni C u kthye në nivelin e vet të zakonshëm. Shifrat janë të sajuara.", "Schicht C kehrte auf ihr übliches Niveau zurück. Die Zahlen sind erfunden.") },
      ],
      note: x(
        "Rows 1 to 4 after Linden (2013) and Morton & Torgerson (2003); the drift formula holds for normal data and underestimates it in skewed data. Row 5 and the example are the editors'. Control charts are in No. 25.",
        "Rreshtat 1 deri 4 sipas Linden (2013) dhe Morton & Torgerson (2003); formula e zhvendosjes vlen për të dhëna normale dhe e nënvlerëson në të dhëna të shtrembëta. Rreshti 5 dhe shembulli janë të redaksisë. Kartat e kontrollit janë te Nr. 25.",
        "Zeilen 1 bis 4 nach Linden (2013) und Morton & Torgerson (2003); die Formel gilt für normalverteilte Daten und unterschätzt bei schiefen. Zeile 5 und das Beispiel stammen von der Redaktion. Regelkarten stehen in Nr. 25."),
      source: ["rtm-linden-2013", "rtm-morton-torgerson-2003"],
    },
    {
      id: "tool", tool: "/tools/sigma-control-chart/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The before-and-after", "Karta", "Die Vorher-nachher-"), x("card", "para-pas", "Karte")],
      lead: x(
        "One card for any result about to be credited to a change. A control chart shows whether the period after sits outside the usual variation of the period before.",
        "Një kartë për çdo rezultat që po i atribuohet një ndryshimi. Një kartë kontrolli tregon nëse periudha pas del jashtë luhatjes së zakonshme të periudhës para.",
        "Eine Karte für jedes Ergebnis, das einer Änderung zugeschrieben werden soll. Eine Regelkarte zeigt, ob die Zeit danach außerhalb der üblichen Streuung der Zeit davor liegt."),
      blocks: [
        { type: "form", items: [
          { h: x("The change and the claim", "Ndryshimi dhe pretendimi", "Änderung und Behauptung"), hint: x("what was done, and what it is said to have improved", "çfarë u bë, dhe çfarë thuhet se përmirësoi", "was getan wurde, und was es verbessert haben soll") },
          { h: x("How the target was chosen", "Si u zgjodh objektivi", "Wie das Ziel gewählt wurde"), hint: x("one bad value, or an average over several periods?", "një vlerë e keqe, apo një mesatare mbi disa periudha?", "ein schlechter Wert oder ein Mittel über mehrere Perioden?") },
          { h: x("Before", "Para", "Vorher"), hint: x("the measure over many periods, and the average of all units", "masa në shumë periudha, dhe mesatarja e të gjitha njësive", "die Kennzahl über viele Perioden, und der Mittelwert aller Einheiten") },
          { h: x("Comparison", "Krahasimi", "Vergleich"), hint: x("units without the change, chosen the same way, over the same weeks", "njësi pa ndryshimin, të zgjedhura njësoj, në të njëjtat javë", "Einheiten ohne die Änderung, gleich ausgewählt, in denselben Wochen") },
          { h: x("Expected drift", "Zhvendosja e pritur", "Erwartete Verschiebung"), hint: x("distance from the average × (1 − correlation), if known", "largësia nga mesatarja × (1 − korrelacioni), nëse dihet", "Abstand vom Durchschnitt × (1 − Korrelation), falls bekannt") },
          { h: x("Verdict", "Vendimi", "Urteil"), hint: x("change beyond the drift and the comparison? keep, test again or drop; date of the next look", "ndryshim përtej zhvendosjes dhe krahasimit? mbaje, provoje sërish ose hiqe; data e kontrollit tjetër", "Änderung über Verschiebung und Vergleich hinaus? behalten, erneut testen oder verwerfen; Termin der nächsten Prüfung"), lines: 2 },
        ] },
      ],
      note: x(
        "A card the editors propose, after the remedies in Linden (2013) and Morton & Torgerson (2003).",
        "Kartë që propozon redaksia, sipas mjeteve te Linden (2013) dhe Morton & Torgerson (2003).",
        "Eine Karte, die die Redaktion vorschlägt, nach den Abhilfen bei Linden (2013) und Morton & Torgerson (2003)."),
      source: ["rtm-linden-2013", "rtm-morton-torgerson-2003"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
