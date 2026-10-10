// Management Review, No. 45: Shift work and night work. Block: People.
// Facts and their sources: docs/revista/management-review-nr-45.md. The issue describes evidence, guidance and law on
// night and shift work; it gives no medical or legal advice.
import { x, pc } from "../common.js";

export default {
  number: 45,
  block: "people",
  date: x("November 2026", "Nëntor 2026", "November 2026"),
  theme: [x("Shift work", "Puna me turne", "Schichtarbeit"), x("and night work", "dhe natën", "und Nachtarbeit")],
  sub: x(
    "Who works while others sleep, how risk climbs night after night, a roster that respects the body clock, what “probably carcinogenic” means, what EU law counts, and a card for checking a roster.",
    "Kush punon kur të tjerët flenë, si rritet rreziku natë pas nate, turnet që respektojnë orën e trupit, çfarë do të thotë “ndoshta kancerogjene”, çfarë numëron ligji i BE-së, dhe një kartë për kontrollin e turneve.",
    "Wer arbeitet, während andere schlafen, wie das Risiko Nacht für Nacht steigt, ein Dienstplan, der die innere Uhr achtet, was „wahrscheinlich krebserregend“ heißt, was das EU-Recht zählt, und eine Karte zur Dienstplanprüfung."),
  seo: x(
    "Shift and night work: who works at night in Europe, risk over successive nights, roster design, IARC's Group 2A, EU night-work rules and a card.",
    "Puna me turne dhe natën: kush punon natën në Evropë, rreziku natë pas nate, hartimi i turneve, Grupi 2A i IARC, rregullat e BE-së dhe një kartë.",
    "Schicht- und Nachtarbeit: wer in Europa nachts arbeitet, Risiko Nacht für Nacht, Dienstpläne, IARC-Gruppe 2A, EU-Regeln zur Nachtarbeit, eine Karte."),
  feature: x(
    "Issue 45 starts with the one in five workers in Europe who work shifts, shows how the risk of incidents rises over successive night shifts, sets out the British safety regulator's advice for designing a roster and how uncertain the evidence on the direction of rotation still is, explains what IARC means when it calls night shift work probably carcinogenic, lists what EU law requires for night workers, and ends with a card for checking a roster.",
    "Numri 45 nis me një në pesë të punësuar në Evropë që punojnë me turne, tregon si rritet rreziku i incidenteve natë pas nate, shtjellon këshillat e autoritetit britanik të sigurisë për hartimin e turneve dhe sa e pasigurt mbetet ende prova për drejtimin e rotacionit, shpjegon çfarë do të thotë IARC kur e quan punën me turne nate ndoshta kancerogjene, rendit çfarë kërkon ligji i BE-së për punonjësit e natës, dhe mbyllet me një kartë për kontrollin e turneve.",
    "Ausgabe 45 beginnt mit jedem fünften Beschäftigten in Europa, der in Schichten arbeitet, zeigt, wie das Unfallrisiko über aufeinanderfolgende Nachtschichten steigt, stellt die Empfehlungen der britischen Arbeitsschutzbehörde für die Dienstplangestaltung vor und zeigt, wie unsicher die Belege zur Rotationsrichtung noch sind, erklärt, was die IARC meint, wenn sie Nachtschichtarbeit wahrscheinlich krebserregend nennt, nennt, was das EU-Recht für Nachtarbeitende verlangt, und endet mit einer Karte zur Dienstplanprüfung."),
  figure: { n: x("+36%", "+36%", "+36 %"), by: "Folkard et al., 2005", t: x(
    "higher risk of injuries or accidents on the fourth night shift in a row than on the first, pooled from seven published studies.",
    "rrezik më i lartë për lëndime ose aksidente në turnin e katërt të natës radhazi se në të parin, nga shtatë studime të botuara bashkë.",
    "höheres Risiko für Verletzungen oder Unfälle in der vierten Nachtschicht in Folge als in der ersten, zusammengefasst aus sieben veröffentlichten Studien.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("When the others sleep", "Kur të tjerët flenë", "Wenn die anderen schlafen") },
    { page: "model", kicker: x("The model", "Modeli", "Das Modell"),
      title: x("A roster that respects the night", "Turnet që e respektojnë natën", "Ein Dienstplan, der die Nacht achtet") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The roster check card", "Karta e kontrollit të turneve", "Die Karte zur Dienstplanprüfung") },
  ],
  sources: ["nightwork-ewcs-2024", "nightwork-ewcts-2021", "nightwork-folkard-2005", "nightwork-hse-hsg256", "nightwork-cochrane-2023", "nightwork-iarc-124", "nightwork-iarc-qa-2019", "nightwork-wtd-2003"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Hotels, hospitals, warehouses and transport run through the night, and someone draws up the roster. This issue looks at what the evidence says about working at night, what the law requires, and which choices in a roster are in a manager's hands.",
        "Hotelet, spitalet, magazinat dhe transporti punojnë gjithë natën, dhe dikush i harton turnet. Ky numër shikon çfarë thonë të dhënat për punën natën, çfarë kërkon ligji, dhe cilat zgjedhje në grafikun e turneve janë në dorë të menaxherit.",
        "Hotels, Kliniken, Lager und Verkehr laufen die Nacht hindurch, und jemand schreibt den Dienstplan. Diese Ausgabe zeigt, was die Belege über Nachtarbeit sagen, was das Recht verlangt und welche Entscheidungen im Dienstplan in der Hand der Führungskraft liegen."),
      body: x(
        "In a 2024 European survey, 21% of workers worked shifts and 17% worked at night at least once a month. Pooled studies show the risk of incidents rising over successive night shifts and with shifts longer than eight hours. The UK Health and Safety Executive advises forward, fast-rotating rosters with few nights in a row, though the evidence on rotation direction is very uncertain. IARC classifies night shift work as probably carcinogenic to humans, a statement about the hazard, not about the size of the risk. EU law sets limits and a free health assessment for night workers.",
        "Në një anketë evropiane të 2024, 21% e të punësuarve punuan me turne dhe 17% punuan natën të paktën një herë në muaj. Studimet e bashkuara tregojnë se rreziku i incidenteve rritet natë pas nate dhe me turnet më të gjata se tetë orë. Autoriteti britanik i sigurisë në punë (HSE) këshillon turne që rrotullohen përpara dhe shpejt, me pak net radhazi, ndonëse prova për drejtimin e rotacionit është shumë e pasigurt. IARC e klasifikon punën me turne nate si ndoshta kancerogjene për njerëzit, një pohim për rrezikshmërinë, jo për madhësinë e rrezikut. Ligji i BE-së vendos kufij dhe një kontroll shëndetësor falas për punonjësit e natës.",
        "In einer europäischen Erhebung 2024 arbeiteten 21 % der Beschäftigten in Schichten, 17 % mindestens einmal im Monat nachts. Gepoolte Studien zeigen, dass das Unfallrisiko über aufeinanderfolgende Nachtschichten und bei Schichten über acht Stunden steigt. Die britische Arbeitsschutzbehörde HSE rät zu vorwärts und schnell rotierenden Plänen mit wenigen Nächten in Folge, auch wenn die Belege zur Rotationsrichtung sehr unsicher sind. Die IARC stuft Nachtschichtarbeit als wahrscheinlich krebserregend für den Menschen ein, eine Aussage über die Gefahr, nicht über die Höhe des Risikos. Das EU-Recht setzt Grenzen und sieht für Nachtarbeitende eine kostenlose Gesundheitsuntersuchung vor."),
    },
    {
      id: "story", more: "what-a-night-auditor-learns",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("When the others", "Kur të tjerët", "Wenn die anderen"), x("sleep", "flenë", "schlafen")],
      lead: x(
        "For the European Working Conditions Survey 2024, Eurofound interviewed 36,644 people face to face in 35 countries, Albania among them. Its highlights on working time:",
        "Për Anketën Evropiane të Kushteve të Punës 2024, Eurofound intervistoi ballë për ballë 36.644 vetë në 35 vende, mes tyre edhe Shqipërinë. Pikat kryesore për kohën e punës:",
        "Für die Europäische Erhebung über die Arbeitsbedingungen 2024 befragte Eurofound 36.644 Menschen persönlich in 35 Ländern, darunter Albanien. Die wichtigsten Ergebnisse zur Arbeitszeit:"),
      blocks: [
        { type: "hbars", max: 40, source: ["nightwork-ewcs-2024"],
          label: x("Workers in Europe, 2024", "Të punësuarit në Evropë, 2024", "Beschäftigte in Europa, 2024"),
          items: [
            { k: x("Worked shifts", "Punuan me turne", "Arbeiteten in Schichten"), v: 21, n: pc(21) },
            { k: x("Worked 2+ hours between 22:00 and 05:00, at least monthly", "Punuan 2+ orë mes 22:00 dhe 05:00, të paktën një herë në muaj", "Arbeiteten 2+ Stunden zwischen 22 und 5 Uhr, mindestens monatlich"), v: 17, n: pc(17), alert: true },
            { k: x("Under 11 hours' rest between working days, at least monthly", "Nën 11 orë pushim mes dy ditëve pune, të paktën një herë në muaj", "Unter 11 Stunden Ruhe zwischen Arbeitstagen, mindestens monatlich"), v: 20, n: x("1 in 5", "1 në 5", "1 von 5") },
          ] },
        { type: "p", text: x(
          "The 2021 telephone survey asked differently: in the EU, 21% worked at night sometimes or more often, 25% of men and 17% of women, most often in security jobs and in care, such as medical staff.",
          "Anketa telefonike e 2021 pyeti ndryshe: në BE, 21% punonin natën ndonjëherë ose më shpesh, 25% e burrave dhe 17% e grave, më shpesh në punët e sigurisë dhe në kujdes, si personeli mjekësor.",
          "Die Telefonbefragung 2021 fragte anders: In der EU arbeiteten 21 % manchmal oder öfter nachts, 25 % der Männer und 17 % der Frauen, am häufigsten in Sicherheitsberufen und in der Pflege, etwa beim medizinischen Personal.") },
        { type: "callout", reading: true, text: x(
          "Night work is not a niche. In most operations that never close, someone on the team works while the manager sleeps.",
          "Puna natën nuk është rast i veçantë. Në shumicën e operacioneve që nuk mbyllen kurrë, dikush nga ekipi punon ndërsa menaxheri fle.",
          "Nachtarbeit ist keine Nische. In den meisten Betrieben, die nie schließen, arbeitet jemand im Team, während die Führungskraft schläft.") },
      ],
      note: x(
        "Self-reports. By Eurofound's account, night and weekend work have fallen since 2015 while shift work has stayed stable; 2021 asked differently. No separate figure for Albania in the highlights.",
        "Vetëdeklarime. Sipas Eurofound, puna natën dhe në fundjavë ka rënë që nga 2015, ndërsa puna me turne ka mbetur e qëndrueshme; 2021 pyeti ndryshe. Pikat kryesore nuk japin shifër për Shqipërinë.",
        "Selbstauskünfte. Laut Eurofound gehen Nacht- und Wochenendarbeit seit 2015 zurück, Schichtarbeit bleibt stabil; 2021 wurde anders gefragt. Kein eigener Wert für Albanien in den Ergebnissen."),
      source: ["nightwork-ewcs-2024", "nightwork-ewcts-2021"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("Night after", "Natë pas", "Nacht für"), x("night", "nate", "Nacht")],
      lead: x(
        "Simon Folkard, David Lombardi and Philip Tucker pooled published studies of injuries and accidents at work: seven counted them over at least four night shifts in a row, five of these also over morning or day shifts.",
        "Simon Folkard, David Lombardi dhe Philip Tucker bashkuan studimet e botuara për lëndimet dhe aksidentet në punë: shtatë i numëruan në të paktën katër turne nate radhazi, pesë prej tyre edhe në turnet e mëngjesit ose të ditës.",
        "Simon Folkard, David Lombardi und Philip Tucker werteten veröffentlichte Studien zu Verletzungen und Unfällen bei der Arbeit gemeinsam aus: Sieben zählten sie über mindestens vier Nachtschichten in Folge, fünf davon auch über Früh- oder Tagschichten."),
      blocks: [
        { type: "pairs", from: x("Morning or day shifts", "Mëngjes ose ditë", "Früh- oder Tagschichten"), to: x("Night shifts", "Natë", "Nachtschichten"), max: 40, source: ["nightwork-folkard-2005"],
          label: x("Higher risk than on the first shift of a run, 2005", "Rrezik më i lartë se në turnin e parë të një vargu, 2005", "Höheres Risiko als in der ersten Schicht einer Folge, 2005"),
          rows: [
            { k: x("2nd shift in a row", "Turni i 2-të radhazi", "2. Schicht in Folge"), a: 2, an: x("+2%", "+2%", "+2 %"), b: 6, bn: x("+6%", "+6%", "+6 %") },
            { k: x("3rd shift in a row", "Turni i 3-të radhazi", "3. Schicht in Folge"), a: 7, an: x("+7%", "+7%", "+7 %"), b: 17, bn: x("+17%", "+17%", "+17 %") },
            { k: x("4th shift in a row", "Turni i 4-t radhazi", "4. Schicht in Folge"), a: 17, an: x("+17%", "+17%", "+17 %"), b: 36, bn: x("+36%", "+36%", "+36 %"), alert: true },
          ] },
        { type: "figures", compact: true, items: [
          { n: x("+30%", "+30%", "+30 %"), t: x("on the night shift against the morning shift; afternoon: +18%", "në turnin e natës kundrejt mëngjesit; pasditja: +18%", "in der Nacht- gegenüber der Frühschicht; Spätschicht: +18 %") },
          { n: x("+27%", "+27%", "+27 %"), t: x("on 12-hour shifts against 8-hour shifts; 10 hours: +13%", "në turnet 12-orëshe kundrejt atyre 8-orëshe; 10 orë: +13%", "bei 12- gegenüber 8-Stunden-Schichten; 10 Stunden: +13 %") },
        ] },
        { type: "callout", reading: true, text: x(
          "The fourth night costs more than the first. How many nights in a row is decided in the roster.",
          "Nata e katërt kushton më shumë se e para. Sa net radhazi vendoset te grafiku i turneve.",
          "Die vierte Nacht kostet mehr als die erste. Wie viele Nächte in Folge, entscheidet der Dienstplan.") },
      ],
      note: x(
        "Relative risks pooled from a few studies, not the risk of one workplace. Shift length, nights in a row and breaks are to be judged together, the authors say.",
        "Rreziqe relative nga pak studime bashkë, jo rreziku i një vendi pune. Gjatësia e turnit, netët radhazi dhe pushimet gjykohen bashkë, thonë autorët.",
        "Relative Risiken aus wenigen Studien, nicht das Risiko eines Betriebs. Schichtlänge, Nächte in Folge und Pausen sind zusammen zu beurteilen, so die Autoren."),
      source: ["nightwork-folkard-2005"],
    },
    {
      id: "model",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("A roster that", "Turnet që e", "Ein Dienstplan, der"), x("respects the night", "respektojnë natën", "die Nacht achtet")],
      lead: x(
        "The UK Health and Safety Executive's guide Managing shiftwork (HSG256, 2006) turns the research into advice for those who design rosters. Its main points:",
        "Udhëzuesi Managing shiftwork (HSG256, 2006) i autoritetit britanik të sigurisë në punë, HSE, e kthen kërkimin në këshilla për ata që hartojnë turnet. Pikat kryesore:",
        "Der Leitfaden Managing shiftwork (HSG256, 2006) der britischen Arbeitsschutzbehörde HSE macht aus der Forschung Empfehlungen für alle, die Dienstpläne schreiben. Die wichtigsten Punkte:"),
      blocks: [
        { type: "cards", cols: 3, items: [
          { h: x("Forward", "Përpara", "Vorwärts"), p: x("morning, afternoon, then night; limited evidence that the body clock adapts faster", "mëngjes, pasdite, pastaj natë; prova të kufizuara se ora e trupit përshtatet më shpejt", "Früh, Spät, dann Nacht; begrenzte Belege, dass die innere Uhr sich schneller anpasst") },
          { h: x("Fast or slow", "Shpejt ose ngadalë", "Schnell oder langsam"), p: x("change every 2–3 days or every 3–4 weeks, not every week or two", "ndërro çdo 2–3 ditë ose çdo 3–4 javë, jo çdo një a dy javë", "alle 2–3 Tage oder alle 3–4 Wochen wechseln, nicht alle ein, zwei Wochen") },
          { h: x("Few in a row", "Pak radhazi", "Wenige in Folge"), p: x("nights, long shifts, early starts: 2–3 in a row, then 2–3 days off", "net, turne të gjata, fillime herët: 2–3 radhazi, pastaj 2–3 ditë pushim", "Nächte, lange Schichten, früher Beginn: 2–3 in Folge, dann 2–3 freie Tage") },
          { h: x("Length", "Gjatësia", "Länge"), p: x("at most 12 hours with overtime; 8 for nights and safety-critical work", "deri në 12 orë me orët shtesë; 8 për netët dhe punën kritike për sigurinë", "höchstens 12 Stunden mit Überstunden; 8 bei Nacht- und sicherheitskritischer Arbeit") },
          { h: x("Rest", "Pushimi", "Ruhe"), p: x("11 hours between shifts; two nights' sleep when switching between days and nights", "11 orë mes turneve; dy net gjumë kur kalohet mes ditës dhe natës", "11 Stunden zwischen Schichten; zwei Nächte Schlaf beim Wechsel zwischen Tag und Nacht") },
          { h: x("Timing", "Koha", "Lage"), p: x("no starts before 7:00 unless needed; hard tasks away from low alertness", "pa fillime para 7:00 pa nevojë; detyrat e rënda larg orëve kur vëmendja bie", "kein Beginn vor 7 Uhr ohne Not; schwere Aufgaben nicht ins Müdigkeitstief") },
        ] },
        { type: "p", text: x(
          "How strong is the evidence? In a 2023 Cochrane review of 11 studies, forward and faster rotation may reduce sleepiness on shift and may not change sleep quality, but the evidence is very uncertain: on direction, one trial with 62 participants gave usable data.",
          "Sa e fortë është prova? Në një rishikim Cochrane të 2023 me 11 studime, rotacioni përpara dhe më i shpejtë mund ta ulë përgjumjen në turn dhe mund të mos e ndryshojë cilësinë e gjumit, por prova është shumë e pasigurt: për drejtimin, të dhëna të përdorshme dha vetëm një provë me 62 pjesëmarrës.",
          "Wie stark sind die Belege? Laut einem Cochrane-Review von 2023 mit 11 Studien könnten vorwärts und schneller rotierende Pläne die Schläfrigkeit in der Schicht senken, ohne die Schlafqualität zu ändern, doch die Belege sind sehr unsicher: Zur Richtung lieferte nur eine Studie mit 62 Personen nutzbare Daten.") },
        { type: "callout", reading: true, text: x(
          "Forward rotation is sensible advice, not a proven cure. The previous page points more clearly at nights in a row and shift length.",
          "Rotacioni përpara është këshillë e arsyeshme, jo ilaç i provuar. Faqja e mëparshme tregon më qartë te netët radhazi dhe te gjatësia e turnit.",
          "Vorwärtsrotation ist ein vernünftiger Rat, kein erwiesenes Mittel. Die vorige Seite zeigt deutlicher auf Nächte in Folge und Schichtlänge.") },
      ],
      note: x(
        "The advice is HSE's, written for Britain; the summary in the cards is the editors'. The review is Hulsegge et al. (2023).",
        "Këshillat janë të HSE-së, të shkruara për Britaninë; përmbledhja te kartat është e redaksisë. Rishikimi është i Hulsegge et al. (2023).",
        "Die Empfehlungen der HSE gelten für Großbritannien; die Zusammenfassung in den Karten stammt von der Redaktion. Der Review: Hulsegge et al. (2023)."),
      source: ["nightwork-hse-hsg256", "nightwork-cochrane-2023"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("Probably", "Ndoshta", "Wahrscheinlich"), x("carcinogenic", "kancerogjene", "krebserregend")],
      lead: x(
        "In June 2019, 27 experts from 16 countries met at the International Agency for Research on Cancer (IARC) in Lyon and classified night shift work, work during the usual sleeping hours of the population, as probably carcinogenic to humans: Group 2A.",
        "Në qershor 2019, 27 ekspertë nga 16 vende u mblodhën në Agjencinë Ndërkombëtare për Kërkimin e Kancerit (IARC) në Lion dhe e klasifikuan punën me turne nate, punën në orët e zakonshme të gjumit të popullsisë, si ndoshta kancerogjene për njerëzit: Grupi 2A.",
        "Im Juni 2019 trafen sich 27 Fachleute aus 16 Ländern bei der Internationalen Agentur für Krebsforschung (IARC) in Lyon und stuften Nachtschichtarbeit, Arbeit in den üblichen Schlafstunden der Bevölkerung, als wahrscheinlich krebserregend für den Menschen ein: Gruppe 2A."),
      blocks: [
        { type: "cards", cols: 3, items: [
          { h: x("In humans", "Te njerëzit", "Beim Menschen"), p: x("limited evidence: positive associations with cancers of the breast, prostate, colon and rectum; chance, bias or confounding not ruled out", "prova të kufizuara: lidhje pozitive me kancerin e gjirit, të prostatës, të zorrës së trashë dhe të rektumit; rastësia, anshmëria ose faktorët ngatërrues nuk u përjashtuan", "begrenzte Belege: positive Zusammenhänge mit Brust-, Prostata-, Dickdarm- und Mastdarmkrebs; Zufall, Verzerrung oder Störfaktoren nicht ausgeschlossen") },
          { h: x("In animals", "Te kafshët", "Bei Tieren"), p: x("sufficient evidence for altering the light–dark schedule", "prova të mjaftueshme për ndryshimin e ritmit dritë–errësirë", "ausreichende Belege für einen veränderten Hell-Dunkel-Rhythmus") },
          { h: x("Mechanisms", "Mekanizmat", "Mechanismen"), p: x("strong evidence in experimental systems: immunosuppression, chronic inflammation, cell proliferation", "prova të forta në sisteme eksperimentale: dobësim i imunitetit, inflamacion kronik, shumim qelizor", "starke Belege in Versuchssystemen: Immunsuppression, chronische Entzündung, Zellvermehrung") },
        ] },
        { type: "p", text: x(
          "The class says how strong the evidence of a hazard is, not how large the risk is. Working as a hairdresser or barber is in the same group, IARC notes, and agents in one group can carry very different risks. In 2007 an earlier working group had reached the same class for shift work that involves circadian disruption.",
          "Klasa tregon sa e fortë është prova për një rrezikshmëri, jo sa i madh është rreziku. Puna si parukier ose berber është në të njëjtin grup, vëren IARC, dhe faktorët e të njëjtit grup mund të kenë rreziqe shumë të ndryshme. Në 2007, një grup i mëparshëm pune kishte arritur në të njëjtën klasë për punën me turne që prish ritmin cirkadian.",
          "Die Einstufung sagt, wie stark die Belege für eine Gefahr sind, nicht, wie groß das Risiko ist. Die Arbeit als Friseur oder Barbier steht in derselben Gruppe, merkt die IARC an, und Faktoren einer Gruppe können sehr verschiedene Risiken tragen. 2007 war eine frühere Arbeitsgruppe für Schichtarbeit mit Störung des circadianen Rhythmus zur selben Einstufung gekommen.") },
        { type: "callout", reading: true, text: x(
          "For a manager the lesson is not a diagnosis but a duty of care: plan night work as a recognised hazard, and leave health questions to doctors.",
          "Për menaxherin mësimi nuk është diagnozë, por detyrë kujdesi: planifikoje punën natën si rrezikshmëri të njohur, dhe pyetjet për shëndetin lëri te mjekët.",
          "Für eine Führungskraft folgt daraus keine Diagnose, sondern eine Fürsorgepflicht: Nachtarbeit als anerkannte Gefahr planen und Gesundheitsfragen Ärztinnen und Ärzten überlassen.") },
      ],
      note: x(
        "IARC makes no recommendations for individuals; it tells those who are concerned to consult their physician. This issue gives no medical advice.",
        "IARC nuk jep rekomandime për individët; atyre që shqetësohen u thotë të këshillohen me mjekun. Ky numër nuk jep këshilla mjekësore.",
        "Die IARC gibt keine Empfehlungen für Einzelne; wer besorgt ist, soll ärztlichen Rat einholen. Diese Ausgabe gibt keinen medizinischen Rat."),
      source: ["nightwork-iarc-124", "nightwork-iarc-qa-2019"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie man es misst"),
      title: [x("What the law", "Çfarë numëron", "Was das Gesetz"), x("counts", "ligji", "zählt")],
      lead: x(
        "The EU Working Time Directive 2003/88/EC sets minimum rules; Articles 8 to 13 cover night work. Night time is at least seven hours, always including midnight to 05:00; a night worker normally works at least three hours of the working day in it.",
        "Direktiva e BE-së për kohën e punës, 2003/88/KE, vendos rregulla minimale; nenet 8 deri 13 mbulojnë punën natën. Koha e natës zgjat të paktën shtatë orë, gjithmonë me periudhën mesnatë–05:00; punonjës nate është kush zakonisht punon në të të paktën tri orë të ditës së punës.",
        "Die EU-Arbeitszeitrichtlinie 2003/88/EG setzt Mindestregeln; die Artikel 8 bis 13 regeln die Nachtarbeit. Die Nachtzeit umfasst mindestens sieben Stunden, immer mit 24 bis 5 Uhr; Nachtarbeitende leisten darin normalerweise mindestens drei Stunden ihres Arbeitstags."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("Art. 8, length", "Neni 8, gjatësia", "Art. 8, Dauer"), p: x("on average at most 8 hours in 24; with special hazards or heavy strain, at most 8 in any 24 hours with night work", "mesatarisht deri në 8 orë në 24; me rreziqe të veçanta ose ngarkesë të rëndë, deri në 8 në çdo 24 orë me punë nate", "im Schnitt höchstens 8 Stunden in 24; bei besonderen Gefahren oder schwerer Belastung höchstens 8 in jedem 24-Stunden-Zeitraum mit Nachtarbeit") },
          { h: x("Art. 9, health", "Neni 9, shëndeti", "Art. 9, Gesundheit"), p: x("a free, confidential health assessment before assignment and at regular intervals; suitable day work where possible for health problems linked to night work", "kontroll shëndetësor falas e konfidencial para caktimit dhe rregullisht më pas; punë dite e përshtatshme, kur është e mundur, për problemet shëndetësore nga puna natën", "kostenlose, vertrauliche Gesundheitsuntersuchung vor dem Einsatz und regelmäßig danach; wenn möglich geeignete Tagarbeit bei Gesundheitsproblemen durch Nachtarbeit") },
          { h: x("Art. 12, protection", "Neni 12, mbrojtja", "Art. 12, Schutz"), p: x("protection that fits the work, with services available at all times", "mbrojtje që i përshtatet punës, me shërbime në dispozicion në çdo kohë", "Schutz, der zur Arbeit passt, mit jederzeit verfügbaren Diensten") },
          { h: x("Art. 13, pattern", "Neni 13, modeli", "Art. 13, Rhythmus"), p: x("adapting work to the worker, easing monotonous work and work at a fixed pace", "përshtatja e punës me punonjësin, lehtësimi i punës monotone dhe me ritëm të paracaktuar", "Anpassung der Arbeit an den Menschen, Erleichterung eintöniger Arbeit und Arbeit im vorgegebenen Takt") },
        ] },
        { type: "example", label: x("Hypothetical example, four weeks of a night team", "Shembull hipotetik, katër javë të një ekipi nate", "Hypothetisches Beispiel, vier Wochen eines Nachtteams"), rows: [
          { k: x("Nights in a row", "Net radhazi", "Nächte in Folge"), v: x("longest run 5; 2 runs longer than 3", "vargu më i gjatë 5; 2 vargje më të gjata se 3", "längste Folge 5; 2 Folgen länger als 3") },
          { k: x("Rest", "Pushimi", "Ruhe"), v: x("3 changeovers with under 11 hours", "3 ndërrime me më pak se 11 orë", "3 Wechsel mit unter 11 Stunden") },
          { k: x("Health", "Shëndeti", "Gesundheit"), v: x("assessment offered to 6 of 8 night workers", "kontrolli u ofrua për 6 nga 8 punonjës nate", "Untersuchung 6 von 8 Nachtarbeitenden angeboten") },
        ], text: x("Three counts to check a roster against every month. The numbers are invented.", "Tri numërime për kontrollin mujor të turneve. Numrat janë të shpikur.", "Drei Zählungen, an denen sich ein Dienstplan jeden Monat prüfen lässt. Die Zahlen sind erfunden.") },
      ],
      note: x(
        "Minimum rules; national law and collective agreements set the details and may go further. The 11 hours of daily rest are in Article 3. Not legal advice.",
        "Rregulla minimale; ligji kombëtar dhe kontratat kolektive caktojnë hollësitë dhe mund të shkojnë më tej. Pushimi ditor prej 11 orësh është te neni 3. Nuk është këshillë ligjore.",
        "Mindestregeln; nationales Recht und Tarifverträge regeln Einzelheiten und können weiter gehen. Die 11 Stunden tägliche Ruhe stehen in Artikel 3. Keine Rechtsberatung."),
      source: ["nightwork-wtd-2003"],
    },
    {
      id: "tool", tool: "/tools/shift-handover/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The roster", "Karta e kontrollit", "Die Karte zur"), x("check card", "të turneve", "Dienstplanprüfung")],
      lead: x(
        "One roster period, one team. Fill it in before the roster is published, and again after it has been worked: the plan and what really happened can differ.",
        "Një periudhë turnesh, një ekip. Plotësoje para se të publikohet grafiku, dhe sërish pasi të jetë punuar: plani dhe ajo që ndodhi vërtet mund të ndryshojnë.",
        "Ein Planungszeitraum, ein Team. Vor der Veröffentlichung des Dienstplans ausfüllen und noch einmal, wenn er gearbeitet ist: Plan und Wirklichkeit können voneinander abweichen."),
      blocks: [
        { type: "form", items: [
          { h: x("Period and team", "Periudha dhe ekipi", "Zeitraum und Team"), hint: x("dates, team, how many people work nights", "datat, ekipi, sa vetë punojnë natën", "Daten, Team, wie viele nachts arbeiten") },
          { h: x("Nights in a row", "Net radhazi", "Nächte in Folge"), hint: x("the longest run, and the rest days after it", "vargu më i gjatë, dhe ditët e pushimit pas tij", "die längste Folge und die freien Tage danach") },
          { h: x("Longest shift", "Turni më i gjatë", "Längste Schicht"), hint: x("hours with overtime; which nights are safety-critical", "orët me orët shtesë; cilat net janë kritike për sigurinë", "Stunden mit Überstunden; welche Nächte sicherheitskritisch sind") },
          { h: x("Shortest rest", "Pushimi më i shkurtër", "Kürzeste Ruhezeit"), hint: x("from the end of one shift to the start of the next; any under 11 hours?", "nga fundi i një turni te fillimi i tjetrit; a ka nën 11 orë?", "vom Ende einer Schicht bis zum Beginn der nächsten; welche unter 11 Stunden?") },
          { h: x("Rotation", "Rotacioni", "Rotation"), hint: x("forward or backward; every few days or every few weeks", "përpara apo prapa; çdo disa ditë apo çdo disa javë", "vorwärts oder rückwärts; alle paar Tage oder alle paar Wochen") },
          { h: x("Health and handover", "Shëndeti dhe dorëzimi", "Gesundheit und Übergabe"), hint: x("health assessment offered; what the night hands to the morning, and to whom", "kontrolli shëndetësor i ofruar; çfarë i dorëzon nata mëngjesit, dhe kujt", "Gesundheitsuntersuchung angeboten; was die Nacht dem Morgen übergibt, und wem") },
        ] },
      ],
      note: x(
        "A practice proposed by the editors, after Folkard et al. (2005), HSE (2006) and Directive 2003/88/EC. It does not replace legal or medical advice.",
        "Praktikë e propozuar nga redaksia, sipas Folkard et al. (2005), HSE-së (2006) dhe Direktivës 2003/88/KE. Nuk zëvendëson këshillën ligjore ose mjekësore.",
        "Eine Praxis, die die Redaktion vorschlägt, nach Folkard et al. (2005), der HSE (2006) und der Richtlinie 2003/88/EG. Sie ersetzt keine rechtliche oder ärztliche Beratung."),
      source: ["nightwork-folkard-2005", "nightwork-hse-hsg256", "nightwork-wtd-2003"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
