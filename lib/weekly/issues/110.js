// Management Review, No. 110: The wait the customer feels, why perceived waiting differs from measured waiting and
// what changes it. Block: Operations. Facts and their sources: docs/revista/management-review-nr-110.md. Maister (1985,
// the author's own copy), Larson (1987, a copy of the journal pages), the MIT thesis of Katz & Martin (1989, body
// pp. 1–78; the appendices were not read), Spechbach et al. (2019, PubMed Central) and HSE's INDG69 were read in full.
// Buell & Norton (2011) did not open in full and is not used. The Houston case is Larson's retelling of Martin (1983).
// Queueing theory, utilisation and Kingman are Volume 5 of the operational treatise, Little's law No. 58: not repeated.
import { x, pc } from "../common.js";

const dec = (n) => x(n, n.replace(".", ","), n.replace(".", ","));

export default {
  number: 110,
  block: "operations",
  date: x("November 2026", "Nëntor 2026", "November 2026"),
  theme: [x("The wait", "Pritja", "Die Wartezeit,"), x("the customer feels", "që ndien klienti", "die der Kunde spürt")],
  sub: x(
    "A baggage hall where a longer walk ended the complaints, bank customers timed on video, eight propositions on how waits feel, a newsboard and a wait clock, a waiting room where people felt forgotten, and a check at the desk.",
    "Një sallë bagazhesh ku një ecje më e gjatë i ndali ankesat, klientë banke të matur me video, tetë teza për si ndihet pritja, një tabelë lajmesh dhe një orë pritjeje, një sallë pritjeje ku njerëzit u ndien të harruar, dhe një kontroll në sportel.",
    "Eine Gepäckhalle, in der ein längerer Weg die Beschwerden beendete, Bankkunden mit Video gemessen, acht Thesen dazu, wie sich Warten anfühlt, eine Nachrichtentafel und eine Wartezeituhr, ein Wartezimmer voller Vergessener und ein Check am Schalter."),
  seo: x(
    "Perceived versus measured waiting: Maister's propositions, Larson's fair queues, a bank timed on video, an emergency waiting room, and a check at the desk.",
    "Pritja e ndier dhe ajo e matur: tezat e Maister-it, radhët e drejta të Larson-it, një bankë e matur me video, një urgjencë dhe një kontroll në sportel.",
    "Gefühlte und gemessene Wartezeit: Maisters Thesen, Larsons gerechte Schlangen, eine Bank mit Video gemessen, eine Notaufnahme und ein Check am Schalter."),
  feature: x(
    "The clock and the customer do not measure the same wait. In a Boston bank, 277 customers timed on video thought they had waited 5.1 minutes on average; they had waited 4.2. Issue 110 shows why a longer walk ended the complaints in a baggage hall, what eight propositions say about how waits feel, what a newsboard and a wait clock changed, how feeling forgotten changed the wait patients felt, and ends with a check at the desk.",
    "Ora dhe klienti nuk e masin të njëjtën pritje. Në një bankë në Boston, 277 klientë të matur me video menduan se kishin pritur mesatarisht 5,1 minuta; kishin pritur 4,2. Numri 110 tregon pse një ecje më e gjatë i ndali ankesat në një sallë bagazhesh, çfarë thonë tetë teza për si ndihet pritja, çfarë ndryshuan një tabelë lajmesh dhe një orë pritjeje, si e ndryshoi ndjenja e harresës pritjen që ndienin pacientët, dhe mbyllet me një kontroll në sportel.",
    "Uhr und Kunde messen nicht dieselbe Wartezeit. In einer Bostoner Bank glaubten 277 per Video gemessene Kunden, im Schnitt 5,1 Minuten gewartet zu haben; es waren 4,2. Ausgabe 110 zeigt, warum ein längerer Weg in einer Gepäckhalle die Beschwerden beendete, was acht Thesen über gefühltes Warten sagen, was eine Nachrichtentafel und eine Wartezeituhr änderten, wie das Gefühl, vergessen zu sein, das Warten von Patienten veränderte, und endet mit einem Check am Schalter."),
  figure: { n: pc(52), by: "Katz & Martin, 1989", t: x(
    "was the average overestimate of the wait by 277 bank customers whose real wait was timed on video: 5.1 minutes felt, 4.2 measured.",
    "ishte mbivlerësimi mesatar i pritjes nga 277 klientë banke, pritja e vërtetë e të cilëve u mat me video: 5,1 minuta të ndiera, 4,2 të matura.",
    "betrug die durchschnittliche Überschätzung der Wartezeit durch 277 Bankkunden, deren echte Wartezeit per Video gemessen wurde: 5,1 Minuten gefühlt, 4,2 gemessen.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("A longer walk to the bags", "Një ecje më e gjatë te bagazhet", "Ein längerer Weg zum Gepäck") },
    { page: "research", kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: x("A newsboard and a wait clock", "Një tabelë lajmesh dhe një orë pritjeje", "Nachrichtentafel und Wartezeituhr") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The wait check at the desk", "Kontrolli i pritjes në sportel", "Der Warte-Check am Schalter") },
  ],
  sources: ["wait-larson-1987", "wait-katz-1989", "wait-maister-1985", "wait-hse-indg69", "wait-spechbach-2019"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Operations measure the wait with a clock. The customer measures it with a mood: two minutes can feel like nothing or like forever. This issue is about the second measure, and about what changes it when the first cannot be shortened at once.",
        "Operacionet e masin pritjen me orë. Klienti e mat me humor: dy minuta mund të duken asgjë ose një përjetësi. Ky numër flet për matjen e dytë, dhe për çfarë e ndryshon kur e para nuk shkurtohet dot menjëherë.",
        "Der Betrieb misst die Wartezeit mit der Uhr. Der Kunde misst sie mit seiner Stimmung: Zwei Minuten können sich wie nichts anfühlen oder wie eine Ewigkeit. Diese Ausgabe handelt vom zweiten Maß und davon, was es ändert, wenn sich das erste nicht sofort verkürzen lässt."),
      body: x(
        "In a baggage hall, complaints stopped once the walk was longer and nobody watched others leave first. In a bank, short waits were overestimated most. Maister's eight propositions and Larson's fair queue explain why. A newsboard made the wait more interesting; a wait clock made it more accurate. In an emergency unit, feeling forgotten made the wait feel longer, whatever the minutes. A wait check at the desk closes the issue.",
        "Në një sallë bagazhesh, ankesat u ndalën kur ecja u bë më e gjatë dhe askush nuk shihte të tjerët të iknin të parët. Në një bankë, pritjet e shkurtra u mbivlerësuan më shumë. Tetë tezat e Maister-it dhe radha e drejtë e Larson-it shpjegojnë pse. Një tabelë lajmesh e bëri pritjen më interesante; një orë pritjeje e bëri më të saktë. Në një urgjencë, ndjenja e harresës e bëri pritjen të ndihej më e gjatë, pavarësisht minutave. Një kontroll i pritjes në sportel e mbyll numrin.",
        "In einer Gepäckhalle endeten die Beschwerden, als der Weg länger war und niemand andere zuerst gehen sah. In einer Bank wurden kurze Wartezeiten am stärksten überschätzt. Maisters acht Thesen und Larsons gerechte Schlange erklären, warum. Eine Nachrichtentafel machte das Warten interessanter, eine Wartezeituhr genauer. In einer Notaufnahme ließ das Gefühl, vergessen zu sein, das Warten länger wirken, unabhängig von den Minuten. Ein Warte-Check am Schalter schließt die Ausgabe."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("A longer walk", "Një ecje më e gjatë", "Ein längerer Weg"), x("to the bags", "te bagazhet", "zum Gepäck")],
      lead: x(
        "Richard Larson of MIT retells a case from Houston. Passengers from the early morning flights complained about waiting for their bags. The airline hired more handlers until no bag took longer than eight minutes, the industry standard. The complaints went on.",
        "Richard Larson nga MIT tregon një rast nga Houstoni. Pasagjerët e fluturimeve të mëngjesit herët ankoheshin për pritjen e bagazheve. Kompania ajrore mori më shumë punëtorë derisa asnjë bagazh të mos vonohej më shumë se tetë minuta, standardi i sektorit. Ankesat vazhduan.",
        "Richard Larson vom MIT erzählt einen Fall aus Houston nach. Passagiere der frühen Morgenflüge beschwerten sich über das Warten auf ihr Gepäck. Die Fluggesellschaft stellte Gepäckabfertiger ein, bis kein Koffer länger als acht Minuten brauchte, der Branchenstandard. Die Beschwerden gingen weiter."),
      blocks: [
        { type: "figures", compact: true, items: [
          { n: x("1 + 7", "1 + 7", "1 + 7"), t: x("minutes: the walk to the carousel, then the wait at it", "minuta: ecja te shiriti, pastaj pritja aty", "Minuten: der Weg zum Gepäckband, dann das Warten dort") },
          { n: x("6", "6", "6"), t: x("minutes of walking after the change: arrival further out, the farthest carousel", "minuta ecje pas ndryshimit: mbërritja më larg, shiriti më i largët", "Minuten Fußweg nach der Änderung: Ankunft weiter draußen, das entfernteste Band") },
        ] },
        { type: "p", text: x(
          "Observers found that passengers with only hand luggage went straight to the taxis. Those at the carousel spent seven minutes watching people who had left the plane after them start their day first. Once the walk was longer, complaints fell to nearly zero.",
          "Vëzhguesit panë se pasagjerët vetëm me bagazh dore shkonin drejt e te taksitë. Ata te shiriti kalonin shtatë minuta duke parë njerëz që kishin dalë nga avioni pas tyre ta nisnin ditën të parët. Kur ecja u bë më e gjatë, ankesat ranë pothuajse në zero.",
          "Beobachter sahen, dass Passagiere mit nur Handgepäck direkt zu den Taxis gingen. Wer am Band stand, sah sieben Minuten lang zu, wie Leute, die nach ihm ausgestiegen waren, ihren Tag zuerst begannen. Mit dem längeren Weg fielen die Beschwerden auf nahezu null.") },
        { type: "callout", reading: true, text: x(
          "The clock was within standard. What hurt was the order: seven minutes of being overtaken. Larson calls it a slip.",
          "Ora ishte brenda standardit. Ajo që lëndonte ishte radha: shtatë minuta duke u parakaluar. Larson e quan rrëshqitje (slip).",
          "Die Uhr lag im Standard. Was störte, war die Reihenfolge: sieben Minuten Überholtwerden. Larson nennt es einen „Slip“.") },
      ],
      note: x(
        "Larson (1987), Operations Research, an essay he calls speculative; the case is Martin's (1983), which the editors did not read, from the 1980s and without a later wait at the carousel. Larson defines a slip as being served after someone who joined later.",
        "Larson (1987), Operations Research, një ese që ai vetë e quan spekulative; rasti është i Martin-it (1983), që redaksia nuk e lexoi, nga vitet 1980 dhe pa pritjen te shiriti pas ndryshimit. Larson e përkufizon rrëshqitjen si të shërbyerit pas dikujt që erdhi më vonë.",
        "Larson (1987), Operations Research, ein Aufsatz, den er selbst spekulativ nennt; der Fall stammt von Martin (1983), den die Redaktion nicht gelesen hat, aus den 1980er-Jahren und ohne Angabe zur späteren Wartezeit am Band. Ein Slip ist bei Larson, nach jemandem bedient zu werden, der später kam."),
      source: ["wait-larson-1987"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("Measured", "E matur", "Gemessen"), x("and felt", "dhe e ndier", "und gefühlt")],
      lead: x(
        "In 1989 Karen Katz and Blaire Martin, two of Larson's students, filmed the entry and exit of the teller line in a busy Boston bank branch and asked every third customer how long they had waited. Each answer was matched to that customer on the tape: 277 pairs of a felt and a measured wait.",
        "Më 1989 Karen Katz dhe Blaire Martin, dy studentë të Larson-it, filmuan hyrjen dhe daljen e radhës te sportelet në një degë të ngarkuar banke në Boston dhe pyetën çdo klient të tretë sa kishte pritur. Çdo përgjigje u lidh me atë klient në video: 277 çifte me një pritje të ndier dhe një të matur.",
        "1989 filmten Karen Katz und Blaire Martin, zwei Studierende Larsons, Ein- und Ausgang der Schalterschlange einer belebten Bostoner Bankfiliale und fragten jeden dritten Kunden, wie lange er gewartet habe. Jede Antwort wurde der Person auf dem Band zugeordnet: 277 Paare aus gefühlter und gemessener Wartezeit."),
      blocks: [
        { type: "dumbbell", from: x("Measured", "E matur", "Gemessen"), to: x("Felt", "E ndier", "Gefühlt"), min: 0, max: 8, rowH: 26, source: ["wait-katz-1989"],
          label: x("Average wait in the teller line, minutes, by phase of the study (1989)", "Pritja mesatare në radhë te sportelet, minuta, sipas fazës së studimit (1989)", "Durchschnittliche Wartezeit in der Schalterschlange, Minuten, nach Phase der Studie (1989)"),
          rows: [
            { k: x("Usual line", "Radha e zakonshme", "Übliche Schlange"), a: 3.6, an: dec("3.6"), b: 4.7, bn: dec("4.7"), alert: true },
            { k: x("Newsboard", "Tabela e lajmeve", "Nachrichtentafel"), a: 4.8, an: dec("4.8"), b: 6.0, bn: dec("6.0") },
            { k: x("Wait clock", "Ora e pritjes", "Wartezeituhr"), a: 4.3, an: dec("4.3"), b: 4.6, bn: dec("4.6") },
          ] },
        { type: "p", text: x(
          "Waits under a minute were mostly not felt as waits. Answers clustered at five and ten minutes: 25% said exactly five. In the usual line, waits under four minutes were overestimated by 98% on average, those of four to twelve by 18%. A reasonable wait, customers said, was 5.9 minutes.",
          "Pritjet nën një minutë zakonisht nuk ndiheshin si pritje. Përgjigjet u mblodhën te pesë dhe dhjetë minuta: 25% thanë saktësisht pesë. Në radhën e zakonshme, pritjet nën katër minuta u mbivlerësuan mesatarisht me 98%, ato nga katër deri në dymbëdhjetë me 18%. Një pritje e arsyeshme, thanë klientët, ishte 5,9 minuta.",
          "Wartezeiten unter einer Minute galten meist nicht als Warten. Die Antworten häuften sich bei fünf und zehn Minuten: 25 % sagten genau fünf. In der üblichen Schlange wurden Wartezeiten unter vier Minuten im Schnitt um 98 % überschätzt, solche von vier bis zwölf um 18 %. Angemessen seien, sagten die Kunden, 5,9 Minuten.") },
        { type: "callout", reading: true, text: x(
          "The shortest waits are felt as the most inflated. A target set in minutes is met on the clock and can still be missed in the customer's head.",
          "Pritjet më të shkurtra ndihen më të fryra. Një objektiv në minuta arrihet në orë dhe prapë mund të humbet në kokën e klientit.",
          "Die kürzesten Wartezeiten werden am stärksten aufgebläht. Ein Ziel in Minuten wird auf der Uhr erreicht und kann im Kopf des Kunden trotzdem verfehlt werden.") },
      ],
      note: x(
        "Katz & Martin (1989), MIT master's thesis; one branch, three phases of three days each, February–March 1989; customers who did not wait were not asked. Measured waits differed between phases. Overestimates are the average of each customer's own. Utilisation and queue length are in Volume 5 of the treatise, Little's law in No. 58.",
        "Katz & Martin (1989), tezë masteri në MIT; një degë, tri faza me nga tri ditë, shkurt–mars 1989; klientët që nuk pritën nuk u pyetën. Pritjet e matura ndryshonin mes fazave. Mbivlerësimet janë mesatarja e mbivlerësimit të secilit klient. Shfrytëzimi dhe gjatësia e radhës janë te Vëllimi 5 i traktatit, ligji i Little-it te Nr. 58.",
        "Katz & Martin (1989), Masterarbeit am MIT; eine Filiale, drei Phasen zu je drei Tagen, Februar–März 1989; wer nicht warten musste, wurde nicht befragt. Die gemessenen Wartezeiten unterschieden sich je Phase. Überschätzungen sind der Mittelwert der Überschätzung jedes Kunden. Auslastung und Schlangenlänge stehen in Band 5 des Traktats, Littles Gesetz in Nr. 58."),
      source: ["wait-katz-1989"],
    },
    {
      id: "model",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Eight propositions", "Tetë teza", "Acht Thesen"), x("on how waits feel", "për si ndihet pritja", "zum gefühlten Warten")],
      lead: x(
        "David Maister starts from a formula: satisfaction equals perception minus expectation. Both can be managed. He then sets out eight propositions on what makes the same minutes feel longer, meant to be tested rather than taken as proven.",
        "David Maister nis nga një formulë: kënaqësia është perceptimi minus pritshmëria. Të dyja mund të menaxhohen. Pastaj jep tetë teza për atë që i bën të njëjtat minuta të duken më të gjata, për t'u provuar, jo për t'u marrë si të provuara.",
        "David Maister geht von einer Formel aus: Zufriedenheit ist Wahrnehmung minus Erwartung. Beides lässt sich steuern. Dann stellt er acht Thesen auf, was dieselben Minuten länger wirken lässt, zum Prüfen gedacht, nicht als Beweis."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("Empty time", "Koha bosh", "Leere Zeit"), p: x("feels longer than occupied time, best occupied with something tied to the service", "duket më e gjatë se koha e zënë, mirë kur zihet me diçka që lidhet me shërbimin", "wirkt länger als gefüllte, am besten gefüllt mit etwas, das zur Leistung gehört") },
          { h: x("Before it starts", "Para se të nisë", "Vor dem Beginn"), p: x("the wait feels longer than once service has begun", "pritja duket më e gjatë se pasi ka nisur shërbimi", "wirkt Warten länger als nach Beginn der Leistung") },
          { h: x("Anxious, uncertain, unexplained", "Me ankth, e pasigurt, e pashpjeguar", "Ängstlich, ungewiss, unerklärt"), p: x("waits feel longer than calm, known, explained ones", "pritjet duken më të gjata se ato të qeta, të njohura, të shpjeguara", "wirken länger als ruhige, bekannte, erklärte") },
          { h: x("Unfair", "E padrejtë", "Ungerecht"), p: x("waits feel longer than equitable ones: someone cutting in", "pritjet duken më të gjata se ato të drejta: dikush që futet përpara", "wirkt länger als gerecht: jemand drängelt sich vor") },
          { h: x("Value and company", "Vlera dhe shoqëria", "Wert und Gesellschaft"), p: x("people wait longer for what they value; alone feels longer than in a group", "njerëzit presin më gjatë për atë që vlerësojnë; vetëm duket më gjatë se në grup", "für Wertvolles wartet man länger; allein wirkt länger als in der Gruppe") },
        ] },
        { type: "p", text: x(
          "Waiting in ignorance, Maister adds, breeds irritation and rudeness towards staff. HSE describes a housing department that took down its protective screens and gave people comfortable waiting areas and better information on delays; tension and violent incidents fell.",
          "Pritja pa dijeni, shton Maister, sjell acarim dhe vrazhdësi ndaj stafit. HSE përshkruan një departament strehimi që hoqi xhamat mbrojtës dhe u dha njerëzve vende pritjeje të rehatshme dhe informacion më të mirë për vonesat; tensioni dhe rastet e dhunës ranë.",
          "Warten in Unwissenheit, ergänzt Maister, erzeugt Gereiztheit und Unhöflichkeit gegenüber dem Personal. Die HSE beschreibt ein Wohnungsamt, das seine Schutzscheiben abbaute und bequeme Wartebereiche und bessere Informationen über Wartezeiten bot; Spannungen und Gewaltvorfälle gingen zurück.") },
      ],
      note: x(
        "Maister (1985), in The Service Encounter; the eight propositions shortened and grouped into five rows by the editors. They rest on examples, not measurements. HSE's housing department is a case in INDG69 (2006), with no figures. Aggression from customers is in No. 109.",
        "Maister (1985), te The Service Encounter; tetë tezat të shkurtuara dhe të grupuara në pesë rreshta nga redaksia. Mbështeten te shembuj, jo te matje. Departamenti i strehimit i HSE-së është një rast te INDG69 (2006), pa shifra. Agresioni nga klientët është te Nr. 109.",
        "Maister (1985), in The Service Encounter; die acht Thesen von der Redaktion gekürzt und in fünf Zeilen gruppiert. Sie beruhen auf Beispielen, nicht auf Messungen. Das Wohnungsamt ist ein Fall in INDG69 der HSE (2006), ohne Zahlen. Aggression von Kunden steht in Nr. 109."),
      source: ["wait-maister-1985", "wait-hse-indg69"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("A newsboard", "Një tabelë lajmesh", "Nachrichtentafel"), x("and a wait clock", "dhe një orë pritjeje", "und Wartezeituhr")],
      lead: x(
        "Katz and Martin tested two of Maister's propositions in the same branch. In the second phase, two electronic boards above the tellers showed news and weather. In the third, a sign at the entrance to the line gave the expected wait, updated every few seconds.",
        "Katz dhe Martin provuan dy nga tezat e Maister-it në të njëjtën degë. Në fazën e dytë, dy tabela elektronike mbi sportelet tregonin lajme dhe motin. Në të tretën, një tabelë te hyrja e radhës jepte pritjen e pritshme, e përditësuar çdo pak sekonda.",
        "Katz und Martin prüften zwei von Maisters Thesen in derselben Filiale. In der zweiten Phase zeigten zwei elektronische Tafeln über den Schaltern Nachrichten und Wetter. In der dritten nannte ein Schild am Eingang der Schlange die erwartete Wartezeit, alle paar Sekunden neu berechnet."),
      blocks: [
        { type: "pairs", from: x("Usual line", "Radha e zakonshme", "Übliche Schlange"), to: x("With the newsboard", "Me tabelën e lajmeve", "Mit Nachrichtentafel"), max: 10, source: ["wait-katz-1989"],
          label: x("How interesting the wait was, 1 (boring) to 10, by measured wait (1989)", "Sa interesante ishte pritja, nga 1 (e mërzitshme) në 10, sipas pritjes së matur (1989)", "Wie interessant das Warten war, 1 (langweilig) bis 10, nach gemessener Wartezeit (1989)"),
          rows: [
            { k: x("Under 4 minutes", "Nën 4 minuta", "Unter 4 Minuten"), a: 3.9, an: dec("3.9"), b: 5.0, bn: dec("5.0") },
            { k: x("4 to 12 minutes", "4 deri në 12 minuta", "4 bis 12 Minuten"), a: 3.8, an: dec("3.8"), b: 5.6, bn: dec("5.6"), alert: true },
          ] },
        { type: "p", text: x(
          "The board did not change how long the wait seemed, but it made it more interesting; satisfaction moved up, not significantly. The clock cut the felt wait for those who waited four to twelve minutes from 7.7 to 6.7, closer to the measured 6.9, but satisfaction did not rise, and more people seemed to look in and leave.",
          "Tabela nuk e ndryshoi sa e gjatë dukej pritja, por e bëri më interesante; kënaqësia u ngrit pak, pa qenë e rëndësishme statistikisht. Ora e uli pritjen e ndier për ata që pritën katër deri në dymbëdhjetë minuta nga 7,7 në 6,7, më afër 6,9 të matura, por kënaqësia nuk u rrit, dhe dukej se më shumë njerëz shikonin brenda e iknin.",
          "Die Tafel änderte nicht, wie lang das Warten wirkte, machte es aber interessanter; die Zufriedenheit stieg, nicht signifikant. Die Uhr senkte die gefühlte Wartezeit bei vier bis zwölf Minuten von 7,7 auf 6,7, näher an die gemessenen 6,9, doch die Zufriedenheit stieg nicht, und offenbar schauten mehr Leute herein und gingen wieder.") },
        { type: "callout", reading: true, text: x(
          "Filling the time and announcing it do different jobs. One makes the wait easier to bear, the other makes it easier to judge, and an exact number invites a race against the clock.",
          "Mbushja e kohës dhe njoftimi i saj bëjnë punë të ndryshme. Njëra e bën pritjen më të durueshme, tjetra më të lehtë për t'u gjykuar, dhe një numër i saktë fton një garë me orën.",
          "Zeit füllen und Zeit ansagen leisten Verschiedenes. Das eine macht das Warten erträglicher, das andere leichter einzuschätzen, und eine genaue Zahl lädt zum Wettlauf gegen die Uhr ein.") },
      ],
      note: x(
        "Katz & Martin (1989); only customers who noticed the board (89) or the clock (72) are counted. The interest gains had p = 0.086 and 0.021; the clock effects were borderline. A new light system ran in all phases, which the authors call their main source of error. Satisfaction was near the top of the scale (9.1 of 10).",
        "Katz & Martin (1989); numërohen vetëm klientët që e vunë re tabelën (89) ose orën (72). Rritjet e interesit kishin p = 0,086 dhe 0,021; efektet e orës ishin në kufi. Një sistem i ri dritash punoi në të gjitha fazat, që autorët e quajnë burimin kryesor të gabimit. Kënaqësia ishte afër majës së shkallës (9,1 nga 10).",
        "Katz & Martin (1989); gezählt sind nur Kunden, die die Tafel (89) oder die Uhr (72) bemerkten. Die Zuwächse beim Interesse hatten p = 0,086 und 0,021; die Effekte der Uhr lagen an der Grenze. Ein neues Lichtsystem lief in allen Phasen, laut den Autoren ihre größte Fehlerquelle. Die Zufriedenheit lag nahe am oberen Ende der Skala (9,1 von 10)."),
      source: ["wait-katz-1989"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie es gemessen wird"),
      title: [x("The clock and", "Ora dhe", "Die Uhr und"), x("the feeling of being forgotten", "ndjenja e harresës", "das Gefühl, vergessen zu sein")],
      lead: x(
        "In Geneva's outpatient emergency unit, Hervé Spechbach and colleagues took the time each of 509 patients saw a doctor from the hospital system and set it beside a questionnaire. The measured wait averaged 78 minutes; patients called 65 minutes the longest reasonable wait.",
        "Në njësinë ambulatore të urgjencës në Gjenevë, Hervé Spechbach dhe kolegët morën nga sistemi i spitalit kohën kur secili nga 509 pacientë pa mjekun dhe e vunë pranë një pyetësori. Pritja e matur ishte mesatarisht 78 minuta; pacientët e quajtën 65 minuta pritjen më të gjatë të arsyeshme.",
        "In der ambulanten Notaufnahme in Genf nahmen Hervé Spechbach und Kollegen für 509 Patienten die Zeit des Arztkontakts aus dem Kliniksystem und stellten sie neben einen Fragebogen. Die gemessene Wartezeit lag im Schnitt bei 78 Minuten; als längste noch angemessene Wartezeit nannten die Patienten 65 Minuten."),
      blocks: [
        { type: "figures", compact: true, items: [
          { n: x("53.2%", "53,2%", "53,2 %"), t: x("said the nurses had given them no waiting time", "thanë se infermierët nuk u kishin dhënë asnjë kohë pritjeje", "sagten, die Pflege habe ihnen keine Wartezeit genannt") },
          { n: pc(23), t: x("had felt forgotten; those who had not had three times the odds of calling the wait very short", "ishin ndier të harruar; ata që jo, kishin tri herë më shumë shanse ta quanin pritjen shumë të shkurtër", "hatten sich vergessen gefühlt; wer nicht, hatte eine dreimal so hohe Chance, das Warten sehr kurz zu nennen") },
        ] },
        { type: "rows", compact: true, items: [
          { h: x("Two stamps", "Dy vula kohe", "Zwei Zeitstempel"), p: x("arrival and first contact, from the system, per customer", "mbërritja dhe kontakti i parë, nga sistemi, për çdo klient", "Ankunft und erster Kontakt, aus dem System, je Kunde") },
          { h: x("The felt wait", "Pritja e ndier", "Gefühlte Wartezeit"), p: x("“How long did you wait?” in minutes, beside the stamps", "“Sa pritët?” në minuta, pranë vulave", "„Wie lange haben Sie gewartet?“ in Minuten, neben den Stempeln") },
          { h: x("Told, forgotten", "U tha, u harrua", "Informiert, vergessen"), p: x("were you given a wait; did you feel forgotten", "a ju dha dikush një kohë; a u ndiet të harruar", "wurde eine Zeit genannt; fühlten Sie sich vergessen") },
        ] },
      ],
      note: x(
        "Spechbach et al. (2019), BMC Emergency Medicine; December 2015 to March 2016, French-speaking patients only, an untested questionnaire, no response rate. The odds ratio of 3.0 compares patients who disagreed that they felt forgotten with those who were neutral. The rows are the editors' proposal.",
        "Spechbach et al. (2019), BMC Emergency Medicine; dhjetor 2015 deri mars 2016, vetëm pacientë frëngjishtfolës, një pyetësor i paprovuar, pa normë përgjigjeje. Raporti i shanseve 3,0 krahason pacientët që nuk ishin dakord se u ndien të harruar me ata neutralë. Rreshtat janë propozim i redaksisë.",
        "Spechbach et al. (2019), BMC Emergency Medicine; Dezember 2015 bis März 2016, nur französischsprachige Patienten, ein nicht validierter Fragebogen, keine Rücklaufquote. Das Chancenverhältnis von 3,0 vergleicht Patienten, die verneinten, sich vergessen gefühlt zu haben, mit neutralen. Die Zeilen sind ein Vorschlag der Redaktion."),
      source: ["wait-spechbach-2019"],
    },
    {
      id: "tool", tool: "/tools/guest-complaints/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The wait check", "Kontrolli i pritjes", "Der Warte-Check"), x("at the desk", "në sportel", "am Schalter")],
      lead: x(
        "A short check whenever a line forms at the desk, by the person who runs the shift. The Guest Complaints tool has a category for the check-in wait; complaints logged there show when lines form and how they end.",
        "Një kontroll i shkurtër sa herë që formohet një radhë në sportel, nga personi që drejton turnin. Mjeti Guest Complaints ka një kategori për pritjen në check-in; ankesat e regjistruara aty tregojnë kur formohen radhët dhe si mbarojnë.",
        "Ein kurzer Check, sobald sich am Schalter eine Schlange bildet, durch die Person, die die Schicht führt. Das Werkzeug Guest Complaints hat eine Kategorie für die Wartezeit beim Check-in; dort erfasste Beschwerden zeigen, wann Schlangen entstehen und wie sie enden."),
      blocks: [
        { type: "form", items: [
          { h: x("The line", "Radha", "Die Schlange"), hint: x("start time, how many, why: a flight, a group, one long case", "ora e nisjes, sa veta, pse: një fluturim, një grup, një rast i gjatë", "Beginn, wie viele, warum: ein Flug, eine Gruppe, ein langer Fall") },
          { h: x("Everyone seen", "Të gjithë të parë", "Alle gesehen"), hint: x("each person greeted, so no one waits unnoticed", "çdo person i përshëndetur, që askush të mos presë pa u vënë re", "jede Person begrüßt, damit niemand unbemerkt wartet") },
          { h: x("An honest estimate", "Një vlerësim i ndershëm", "Eine ehrliche Schätzung"), hint: x("a time and a reason, never “in a moment”", "një kohë dhe një arsye, kurrë “një moment”", "eine Zeit und ein Grund, nie „gleich“") },
          { h: x("One fair order", "Një radhë e drejtë", "Eine gerechte Reihenfolge"), hint: x("one line where possible; any priority said aloud", "një radhë ku është e mundur; çdo përparësi e thënë me zë", "wo möglich eine Schlange; jeder Vorrang laut erklärt") },
          { h: x("Time with a use", "Koha me një qëllim", "Zeit mit Nutzen"), hint: x("what the guest can do now: a form, a question answered", "çfarë mund të bëjë klienti tani: një formular, një pyetje e përgjigjur", "was der Gast jetzt tun kann: ein Formular, eine beantwortete Frage") },
          { h: x("Work in view", "Puna në sy", "Arbeit in Sicht"), hint: x("every open position serving; side tasks out of the guests' sight", "çdo vend i hapur duke shërbyer; punët anësore larg syve të klientëve", "jede offene Position bedient; Nebenarbeit außer Sicht der Gäste") },
        ] },
      ],
      note: x(
        "The card is the editors' proposal, built on Maister (1985), Larson (1987) and the suggestions of Katz & Martin (1989), who saw customers annoyed by unstaffed windows. It has not been tested. Wait clocks are left out: in the bank, an exact number did not raise satisfaction.",
        "Karta është propozim i redaksisë, i ndërtuar mbi Maister-in (1985), Larson-in (1987) dhe sugjerimet e Katz & Martin (1989), që panë klientë të acaruar nga sportelet pa njeri. Nuk është provuar. Orët e pritjes lihen jashtë: në bankë, një numër i saktë nuk e ngriti kënaqësinë.",
        "Die Karte ist ein Vorschlag der Redaktion, gestützt auf Maister (1985), Larson (1987) und die Empfehlungen von Katz & Martin (1989), die Kunden über unbesetzte Schalter verärgert sahen. Sie ist nicht geprüft. Wartezeituhren fehlen bewusst: In der Bank hob eine genaue Zahl die Zufriedenheit nicht."),
      source: ["wait-maister-1985", "wait-larson-1987", "wait-katz-1989"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
