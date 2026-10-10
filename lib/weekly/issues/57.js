// Management Review, No. 57: How many people can one manager lead (span of control). Block: Role.
// Facts and their sources: docs/revista/management-review-nr-57.md. The 2013 and 2019 averages are Gallup's chart
// data (8.20 and 9.07) rounded by the editors.
import { x, pc } from "../common.js";

export default {
  number: 57,
  block: "role",
  date: x("November 2026", "Nëntor 2026", "November 2026"),
  theme: [x("How many people", "Sa njerëz mund", "Wie viele Menschen"), x("can one manager lead?", "të drejtojë një menaxher?", "kann eine Führungskraft führen?")],
  sub: x(
    "Graicunas's count of relationships, the average and the median team in Gallup's data, what the work decides, what wide spans cost in hospitals, the weekly conversation, and a card for one span.",
    "Numërimi i marrëdhënieve te Graicunas-i, ekipi mesatar dhe ekipi në mes te të dhënat e Gallup, çfarë vendos puna, çfarë kushtojnë ekipet e mëdha në spitale, biseda e çdo jave, dhe një kartë për një ekip.",
    "Graicunas' Zählung der Beziehungen, das durchschnittliche und das mittlere Team in den Daten von Gallup, was die Arbeit entscheidet, was große Spannen in Kliniken kosten, das wöchentliche Gespräch und eine Karte."),
  seo: x(
    "How many people can one manager lead: Graicunas's 1933 count, Gallup's average and median team, what the work decides, hospital studies and a card.",
    "Sa njerëz drejton një menaxher: numërimi i Graicunas-it (1933), ekipi mesatar i Gallup, çfarë vendos puna, studimet në spitale dhe një kartë.",
    "Wie viele Menschen eine Führungskraft führen kann: Graicunas' Zählung von 1933, Gallups Teamgrößen, was die Arbeit entscheidet, Klinikstudien, eine Karte."),
  feature: x(
    "Issue 57 starts with the formula with which V. A. Graicunas showed in 1933 that a fifth subordinate more than doubles a manager's relationships, sets Gallup's rising average team against a median that has hardly moved, follows Luther Gulick to the conclusion that the work decides the span, looks at what wide spans cost nurse managers and their teams, shows that the weekly conversation matters more than team size, and ends with a card for checking one manager's span.",
    "Numri 57 nis me formulën me të cilën V. A. Graicunas tregoi në 1933 se një vartës i pestë ua dyfishon e më shumë marrëdhëniet menaxherëve, vë ekipin mesatar në rritje te Gallup përballë një mediane që pothuajse nuk ka lëvizur, ndjek Luther Gulick-un te përfundimi se hapësirën e kontrollit e vendos puna, shikon çfarë u kushtojnë ekipet e mëdha menaxherëve të infermierisë dhe ekipeve të tyre, tregon se biseda e çdo jave ka më shumë peshë se madhësia e ekipit, dhe mbyllet me një kartë për të kontrolluar hapësirën e një menaxheri.",
    "Ausgabe 57 beginnt mit der Formel, mit der V. A. Graicunas 1933 zeigte, dass ein fünfter Unterstellter die Beziehungen einer Führungskraft mehr als verdoppelt, stellt Gallups wachsendes Durchschnittsteam einem Median gegenüber, der sich kaum bewegt hat, folgt Luther Gulick zu dem Schluss, dass die Arbeit die Führungsspanne bestimmt, betrachtet, was große Spannen Stationsleitungen in der Pflege und ihren Teams kosten, zeigt, dass das wöchentliche Gespräch mehr zählt als die Teamgröße, und endet mit einer Karte, um die Spanne einer Führungskraft zu prüfen."),
  figure: { n: x("12.1", "12,1", "12,1"), by: "Gallup, 2026", t: x(
    "direct reports per US manager on average in 2025, up from 8.2 in 2013. The median stayed at five or six.",
    "vartës të drejtpërdrejtë për çdo menaxher në SHBA, mesatarisht, në 2025, nga 8,2 në 2013. Mediana mbeti pesë ose gjashtë.",
    "direkt Unterstellte je Führungskraft in den USA im Schnitt 2025, nach 8,2 im Jahr 2013. Der Median blieb bei fünf oder sechs.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("Five, perhaps four", "Pesë, ndoshta katër", "Fünf, vielleicht vier") },
    { page: "numbers", kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: x("Average 12, median 6", "Mesatarja 12, mediana 6", "Im Schnitt 12, im Median 6") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The span card", "Karta e hapësirës së kontrollit", "Die Karte zur Führungsspanne") },
  ],
  sources: ["span-graicunas-1933", "span-gallup-2026", "span-rajan-wulf-2006", "span-gulick-1937", "span-urwick-1937", "span-mccutcheon-2009", "span-cathcart-2004", "span-boned-galan-2023"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Organisations are removing layers of management, and the managers who remain lead more people. How many is too many? This issue follows a question that was first answered with a formula in 1933 and is still answered with averages today.",
        "Organizatat po heqin nivele menaxhimi, dhe menaxherët që mbeten drejtojnë më shumë njerëz. Sa janë shumë? Ky numër ndjek një pyetje që në 1933 mori përgjigje me një formulë dhe sot ende merr përgjigje me mesatare.",
        "Organisationen streichen Führungsebenen, und die verbleibenden Führungskräfte führen mehr Menschen. Wie viele sind zu viele? Diese Ausgabe folgt einer Frage, die 1933 mit einer Formel beantwortet wurde und heute noch mit Durchschnittswerten beantwortet wird."),
      body: x(
        "V. A. Graicunas counted a manager's relationships and found that a fifth subordinate more than doubles them. In Gallup's data the average US manager now has 12.1 direct reports, while the median stays at five or six. Luther Gulick saw the answer in the work itself. Studies of nurse managers show what wide spans cost, and Gallup finds that the weekly conversation counts for more than the size of the team.",
        "V. A. Graicunas numëroi marrëdhëniet e një menaxheri dhe gjeti se një vartës i pestë ia dyfishon e më shumë. Te të dhënat e Gallup, menaxheri mesatar në SHBA sot ka 12,1 vartës të drejtpërdrejtë, ndërsa mediana mbetet pesë ose gjashtë. Luther Gulick e pa përgjigjen te vetë puna. Studimet për menaxherët e infermierisë tregojnë çfarë kushtojnë ekipet shumë të mëdha, dhe Gallup gjen se biseda e çdo jave ka më shumë peshë se madhësia e ekipit.",
        "V. A. Graicunas zählte die Beziehungen einer Führungskraft und fand, dass ein fünfter Unterstellter sie mehr als verdoppelt. In den Daten von Gallup hat die durchschnittliche Führungskraft in den USA heute 12,1 direkt Unterstellte, der Median bleibt bei fünf oder sechs. Luther Gulick sah die Antwort in der Arbeit selbst. Studien zu Stationsleitungen in der Pflege zeigen, was große Spannen kosten, und Gallup findet, dass das wöchentliche Gespräch mehr zählt als die Größe des Teams."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("Five,", "Pesë,", "Fünf,"), x("perhaps four", "ndoshta katër", "vielleicht vier")],
      lead: x(
        "In 1933 V. A. Graicunas, a management consultant in Paris, set out to show why no superior should be directly responsible for too many subordinates. Supervisors, he wrote, measure their burden by the people they supervise one to one. They should count the relationships.",
        "Në 1933, V. A. Graicunas, konsulent menaxhimi në Paris, deshi të tregonte pse asnjë epror nuk duhet të ketë drejtpërdrejt shumë vartës. Eprorët, shkroi ai, e masin barrën me njerëzit që mbikëqyrin një për një. Duhet të numërojnë marrëdhëniet.",
        "1933 wollte V. A. Graicunas, Unternehmensberater in Paris, zeigen, warum kein Vorgesetzter direkt für zu viele Unterstellte verantwortlich sein sollte. Vorgesetzte, schrieb er, messen ihre Last an den Menschen, die sie einzeln betreuen. Sie sollten die Beziehungen zählen."),
      blocks: [
        { type: "columns", max: 1080, height: 120, source: ["span-graicunas-1933"],
          label: x("Possible relationships of one manager, by number of direct subordinates (Graicunas, 1933)", "Marrëdhëniet e mundshme të një menaxheri, sipas numrit të vartësve të drejtpërdrejtë (Graicunas, 1933)", "Mögliche Beziehungen einer Führungskraft, nach Zahl der direkt Unterstellten (Graicunas, 1933)"),
          items: [
            { k: "2", v: 6, n: "6" },
            { k: "3", v: 18, n: "18" },
            { k: "4", v: 44, n: "44" },
            { k: "5", v: 100, n: "100", alert: true },
            { k: "6", v: 222, n: "222" },
            { k: "7", v: 490, n: "490" },
            { k: "8", v: 1080, n: x("1,080", "1.080", "1.080") },
          ] },
        { type: "p", text: x(
          "With two subordinates, Dick and Harry, Tom has six: one with each, one with each while the other is there, and what each thinks of the other. A fifth subordinate takes the count from 44 to 100: “an increase in complexity of 127 per cent in return for a 20 per cent increase in working capacity”. His limit: five at most, most probably four.",
          "Me dy vartës, Dick-un dhe Harry-n, Tom-i ka gjashtë: një me secilin, një me secilin kur tjetri është aty, dhe atë që mendon secili për tjetrin. Një vartës i pestë e çon numrin nga 44 në 100: “një rritje e kompleksitetit me 127 për qind në këmbim të një rritjeje të kapacitetit të punës me 20 për qind”. Kufiri i tij: pesë më së shumti, ka shumë gjasa katër.",
          "Mit zwei Unterstellten, Dick und Harry, hat Tom sechs: eine zu jedem, eine zu jedem in Anwesenheit des anderen, und was jeder vom anderen hält. Ein fünfter Unterstellter hebt die Zahl von 44 auf 100: „eine Zunahme der Komplexität um 127 Prozent für eine Zunahme der Arbeitskapazität um 20 Prozent“. Seine Grenze: höchstens fünf, sehr wahrscheinlich vier.") },
        { type: "callout", reading: true, text: x(
          "The formula counts what could happen, not what does. Its point still holds: what grows fastest is not the number of people but the ties between them.",
          "Formula numëron atë që mund të ndodhë, jo atë që ndodh. Por thelbi vlen ende: më shpejt nuk rritet numri i njerëzve, por lidhjet mes tyre.",
          "Die Formel zählt, was geschehen könnte, nicht was geschieht. Ihr Kern gilt noch: Am schnellsten wächst nicht die Zahl der Menschen, sondern die Verbindungen zwischen ihnen.") },
      ],
      note: x(
        "Graicunas's widest count: direct, group and cross relationships. He made an exception for routine work in which tasks hardly touch. Paper of 1933, read in the 1937 reprint.",
        "Numërimi më i gjerë i Graicunas-it: marrëdhëniet e drejtpërdrejta, me grupe dhe të kryqëzuara. Ai bëri përjashtim për punën rutinë, ku detyrat mezi prekin njëra-tjetrën. Punimi i 1933, lexuar në ribotimin e 1937.",
        "Graicunas' breiteste Zählung: direkte, Gruppen- und Querbeziehungen. Ausgenommen ist Routinearbeit, bei der sich Aufgaben kaum berühren. Aufsatz von 1933, gelesen im Nachdruck von 1937."),
      source: ["span-graicunas-1933"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("Average 12,", "Mesatarja 12,", "Im Schnitt 12,"), x("median 6", "mediana 6", "im Median 6")],
      lead: x(
        "Gallup asks managers and leaders in the US: “How many people report directly to you?” Since 2013 the average has risen by nearly half; in the last year alone it went from 10.9 to 12.1.",
        "Gallup i pyet menaxherët dhe drejtuesit në SHBA: “Sa njerëz ju raportojnë drejtpërdrejt?” Që nga 2013 mesatarja është rritur gati me gjysmën; vetëm në vitin e fundit shkoi nga 10,9 në 12,1.",
        "Gallup fragt Führungskräfte in den USA: „Wie viele Menschen berichten direkt an Sie?“ Seit 2013 ist der Durchschnitt um fast die Hälfte gestiegen, allein im letzten Jahr von 10,9 auf 12,1."),
      blocks: [
        { type: "line", alert: true, min: 0, max: 15, height: 100, source: ["span-gallup-2026"],
          label: x("Average number of direct reports, managers and leaders in the US", "Numri mesatar i vartësve të drejtpërdrejtë, menaxherët dhe drejtuesit në SHBA", "Durchschnittliche Zahl direkt Unterstellter, Führungskräfte in den USA"),
          points: [
            { k: "2013", v: 8.2, n: x("8.2", "8,2", "8,2") },
            { k: "2019", v: 9.1, n: x("9.1", "9,1", "9,1") },
            { k: "2022", v: 10.5, n: x("10.5", "10,5", "10,5") },
            { k: "2023", v: 10.6, n: x("10.6", "10,6", "10,6") },
            { k: "2024", v: 10.9, n: x("10.9", "10,9", "10,9") },
            { k: "2025", v: 12.1, n: x("12.1", "12,1", "12,1") },
          ] },
        { type: "p", text: x(
          "The median stayed at five or six in every year. A minority of very large teams pulls the average up: 37% of managers lead fewer than five people, 13% lead 25 or more. Gallup links the latest rise to companies cutting middle-management roles. At the top the trend is older: in over 300 large US firms, the CEO's direct reports rose from 4.5 on average in 1986 to 6.8 in 1998.",
          "Mediana mbeti pesë ose gjashtë në çdo vit. Një pakicë ekipesh shumë të mëdha e tërheq mesataren lart: 37% e menaxherëve drejtojnë më pak se pesë njerëz, 13% drejtojnë 25 ose më shumë. Gallup e lidh rritjen e fundit me kompanitë që shkurtojnë rolet e menaxhimit të mesëm. Në krye prirja është më e vjetër: në mbi 300 firma të mëdha në SHBA, vartësit e drejtpërdrejtë të CEO-së u rritën nga 4,5 mesatarisht në 1986 në 6,8 në 1998.",
          "Der Median lag in jedem Jahr bei fünf oder sechs. Eine Minderheit sehr großer Teams zieht den Durchschnitt nach oben: 37 % der Führungskräfte führen weniger als fünf Menschen, 13 % führen 25 oder mehr. Gallup verbindet den jüngsten Anstieg mit Unternehmen, die Stellen im mittleren Management streichen. An der Spitze ist der Trend älter: In über 300 großen US-Firmen stieg die Zahl der direkt an den CEO Berichtenden von im Schnitt 4,5 im Jahr 1986 auf 6,8 im Jahr 1998.") },
        { type: "callout", reading: true, text: x(
          "An average of 12 says little about any one manager. Most lead a small team; a few carry very large ones.",
          "Një mesatare prej 12 thotë pak për një menaxher të caktuar. Shumica drejtojnë një ekip të vogël; disa pak mbajnë ekipe shumë të mëdha.",
          "Ein Durchschnitt von 12 sagt wenig über die einzelne Führungskraft. Die meisten führen ein kleines Team, wenige tragen sehr große.") },
      ],
      note: x(
        "Gallup Panel, US: 2,402 to 8,795 managers and leaders a year; margin for each average ±0.5 to ±0.8. The 1986–1998 figures come from a pay survey of large firms (Rajan & Wulf).",
        "Gallup Panel, SHBA: 2.402 deri në 8.795 menaxherë dhe drejtues në vit; marzhi për çdo mesatare ±0,5 deri në ±0,8. Shifrat 1986–1998 vijnë nga një anketë pagash në firma të mëdha (Rajan & Wulf).",
        "Gallup Panel, USA: 2.402 bis 8.795 Führungskräfte pro Jahr; Fehlerspanne je Durchschnitt ±0,5 bis ±0,8. Die Zahlen 1986–1998 stammen aus einer Vergütungsumfrage in Großunternehmen (Rajan & Wulf)."),
      source: ["span-gallup-2026", "span-rajan-wulf-2006"],
    },
    {
      id: "model", more: "leading-people-without-losing-the-person",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("The work", "Puna", "Die Arbeit"), x("decides", "vendos", "entscheidet")],
      lead: x(
        "Luther Gulick, who published Graicunas's paper in New York in 1937, gave no single number. Because the span is limited, a leader directs a few, who direct others, down to the last person. How many depends on the work: several score if it is routine and in one room, only a few if it is varied and scattered.",
        "Luther Gulick, që e botoi punimin e Graicunas-it në Nju Jork në 1937, nuk dha një numër të vetëm. Meqë hapësira e kontrollit ka kufi, drejtuesi drejton pak njerëz, që drejtojnë të tjerë, deri te njeriu i fundit. Sa, varet nga puna: disa dhjetëra kur puna është rutinë dhe në një sallë, vetëm pak kur është e larmishme dhe e shpërndarë.",
        "Luther Gulick, der Graicunas' Aufsatz 1937 in New York veröffentlichte, nannte keine einzelne Zahl. Weil die Spanne begrenzt ist, führt eine Leitung wenige, die andere führen, bis hinunter zum letzten Menschen. Wie viele, hängt von der Arbeit ab: einige Dutzend bei Routinearbeit in einem Raum, nur wenige bei vielfältiger, verstreuter Arbeit."),
      blocks: [
        { type: "lists", cols: [
          { h: x("A wider span holds when", "Një ekip më i gjerë mban kur", "Eine größere Spanne trägt, wenn"), items: [
            x("the work is routine and repeats", "puna është rutinë dhe përsëritet", "die Arbeit Routine ist und sich wiederholt"),
            x("results are easy to measure", "rezultatet maten lehtë", "Ergebnisse leicht messbar sind"),
            x("everyone does the same kind of work", "të gjithë bëjnë të njëjtin lloj pune", "alle die gleiche Art Arbeit tun"),
            x("people work in one place", "njerëzit punojnë në një vend", "alle an einem Ort arbeiten"),
            x("tasks hardly touch each other", "detyrat mezi prekin njëra-tjetrën", "sich die Aufgaben kaum berühren"),
          ] },
          { h: x("A narrower span when", "Një ekip më i ngushtë kur", "Eine kleinere Spanne, wenn"), accent: true, items: [
            x("the work is varied and qualitative", "puna është e larmishme dhe cilësore", "die Arbeit vielfältig und qualitativ ist"),
            x("results are hard to see", "rezultatet duken me vështirësi", "Ergebnisse schwer zu sehen sind"),
            x("each person does a different job", "secili bën një punë tjetër", "jede Person eine andere Aufgabe hat"),
            x("people are scattered", "njerëzit janë të shpërndarë", "die Menschen verstreut sind"),
            x("each one's work interlocks with the others'", "puna e secilit lidhet me atë të të tjerëve", "die Arbeit jedes Einzelnen in die der anderen greift"),
          ] },
        ] },
        { type: "p", text: x(
          "Lyndall Urwick put the limit at five, or at most six, people whose work is interrelated. Sir Ian Hamilton, a general whom Graicunas and Gulick both quote, advised groups of three near the top of an organisation and groups of six near its foot.",
          "Lyndall Urwick e vuri kufirin te pesë, ose më së shumti gjashtë, njerëz, puna e të cilëve është e ndërlidhur. Sir Ian Hamilton, një gjeneral që e citojnë si Graicunas-i ashtu edhe Gulick-u, këshillonte grupe me tre afër majës së një organizate dhe grupe me gjashtë afër bazës së saj.",
          "Lyndall Urwick setzte die Grenze bei fünf, höchstens sechs Menschen, deren Arbeit ineinandergreift. Sir Ian Hamilton, ein General, den Graicunas und Gulick beide zitieren, riet zu Dreiergruppen nahe der Spitze einer Organisation und zu Sechsergruppen nahe ihrem Fuß.") },
        { type: "callout", reading: true, text: x(
          "A span is not a number to copy from another team. It follows from how alike the work is and how much each job depends on the others.",
          "Hapësira e kontrollit nuk është një numër që kopjohet nga një ekip tjetër. Ajo rrjedh nga sa e ngjashme është puna dhe sa varet çdo punë nga të tjerat.",
          "Eine Führungsspanne ist keine Zahl, die man von einem anderen Team abschreibt. Sie folgt daraus, wie ähnlich die Arbeit ist und wie sehr jede Aufgabe von den anderen abhängt.") },
      ],
      note: x(
        "Gulick, Urwick and Graicunas in Papers on the Science of Administration (1937). The two lists are the editors' summary of Gulick; the last line of each follows Graicunas's exception for work that does not interlock.",
        "Gulick, Urwick dhe Graicunas te Papers on the Science of Administration (1937). Dy listat janë përmbledhje e redaksisë sipas Gulick-ut; rreshti i fundit i secilës ndjek përjashtimin e Graicunas-it për punën që nuk ndërlidhet.",
        "Gulick, Urwick und Graicunas in Papers on the Science of Administration (1937). Die zwei Listen fassen Gulick zusammen, von der Redaktion; die letzte Zeile jeder Liste folgt Graicunas' Ausnahme für Arbeit, die nicht ineinandergreift."),
      source: ["span-gulick-1937", "span-urwick-1937", "span-graicunas-1933"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("What a wide span", "Çfarë kushton", "Was eine große"), x("costs", "një ekip shumë i madh", "Spanne kostet")],
      lead: x(
        "Hospital restructuring left many nurse managers with far more units and staff. Amy Sanchez McCutcheon and colleagues studied 51 units in seven Canadian hospitals: 41 managers, 717 nurses and 680 patients.",
        "Ristrukturimi i spitaleve u la shumë menaxherëve të infermierisë shumë më tepër reparte dhe staf. Amy Sanchez McCutcheon dhe kolegët studiuan 51 reparte në shtatë spitale kanadeze: 41 menaxherë, 717 infermierë dhe 680 pacientë.",
        "Umstrukturierungen gaben vielen Pflege-Stationsleitungen in Kliniken weit mehr Stationen und Personal. Amy Sanchez McCutcheon und Kollegen untersuchten 51 Stationen in sieben kanadischen Kliniken: 41 Leitungen, 717 Pflegekräfte und 680 Patienten."),
      blocks: [
        { type: "p", text: x(
          "The wider the span, the lower the nurses' job satisfaction and the patients' satisfaction. Wide spans also weakened the good effect of the best leadership styles: as spans grew, no style made up for them.",
          "Sa më i gjerë ekipi, aq më e ulët kënaqësia e infermierëve me punën dhe kënaqësia e pacientëve. Ekipet e gjera e dobësonin edhe efektin e mirë të stileve më të mira të drejtimit: kur ekipet rriteshin, asnjë stil nuk e kompensonte dot.",
          "Je größer die Spanne, desto geringer die Arbeitszufriedenheit der Pflegekräfte und die Zufriedenheit der Patienten. Große Spannen schwächten auch die Wirkung der besten Führungsstile: Mit wachsender Spanne glich kein Stil sie mehr aus.") },
        { type: "figures", compact: true, items: [
          { n: "15 / 40", t: x("employees per manager: two thresholds above which engagement was worse, in a large US health system", "punonjës për menaxher: dy pragje mbi të cilët angazhimi ishte më i dobët, në një sistem të madh shëndetësor në SHBA", "Beschäftigte je Leitung: zwei Schwellen, über denen das Engagement schlechter war, in einem großen US-Gesundheitssystem") },
          { n: x("4 of 4", "4 nga 4", "4 von 4"), t: x("areas with better engagement scores a year after a manager post was added", "zona me angazhim më të mirë një vit pasi u shtua një vend menaxheri", "Bereiche mit besseren Engagementwerten ein Jahr nach einer zusätzlichen Leitungsstelle") },
        ] },
        { type: "p", text: x(
          "A 2023 review of 21 studies found the same pattern: wide spans came with overload for the manager and with staff who felt they could not reach their leader. Where hospitals added administrative support, managers gained time to train staff and to be with patients.",
          "Një shqyrtim i 2023 me 21 studime gjeti të njëjtin model: ekipet e gjera shoqëroheshin me mbingarkesë për menaxherin dhe me staf që ndiente se nuk e arrinte dot drejtuesin. Aty ku spitalet shtuan ndihmë administrative, menaxherët fituan kohë për të trajnuar stafin dhe për të qenë me pacientët.",
          "Eine Übersicht von 2023 über 21 Studien fand dasselbe Muster: Große Spannen gingen mit Überlastung der Leitung einher und mit Personal, das sich von seiner Leitung unerreichbar fühlte. Mit mehr Verwaltungshilfe gewannen Leitungen Zeit, um Personal anzuleiten und bei Patienten zu sein.") },
        { type: "callout", reading: true, text: x(
          "Good leadership does not stretch without limit. Past some size the manager is simply not there often enough.",
          "Drejtimi i mirë nuk zgjatet pa fund. Përtej një madhësie, menaxheri thjesht nuk është aty aq shpesh sa duhet.",
          "Gute Führung dehnt sich nicht endlos. Ab einer gewissen Größe ist die Leitung schlicht zu selten da.") },
      ],
      note: x(
        "Studies of nurse managers, most of them surveys at one point in time: they show associations. The two thresholds come from the 2023 review, not from the 2004 abstract. In Gallup's data, the most talented managers stay more engaged with large teams.",
        "Studime për menaxherët e infermierisë, shumica anketa në një moment të vetëm: tregojnë lidhje. Dy pragjet vijnë nga shqyrtimi i 2023, jo nga abstrakti i 2004. Te të dhënat e Gallup, menaxherët më të talentuar mbeten më të angazhuar me ekipe të mëdha.",
        "Meist Befragungen von Stationsleitungen zu einem Zeitpunkt: Sie zeigen Zusammenhänge. Die zwei Schwellen stammen aus der Übersicht von 2023, nicht aus dem Abstract von 2004. In den Daten von Gallup bleiben die talentiertesten Führungskräfte auch mit großen Teams engagierter."),
      source: ["span-mccutcheon-2009", "span-cathcart-2004", "span-boned-galan-2023", "span-gallup-2026"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie man es misst"),
      title: [x("Count the", "Numëro", "Gespräche"), x("conversations", "bisedat", "zählen")],
      lead: x(
        "Gallup asked 44,025 US employees how big their team is and whether they had received meaningful feedback in the past week. The size of the team made little difference. The weekly conversation did.",
        "Gallup pyeti 44.025 punonjës në SHBA sa i madh është ekipi i tyre dhe nëse kishin marrë feedback kuptimplotë javën e fundit. Madhësia e ekipit bëri pak ndryshim. Biseda e çdo jave e bëri.",
        "Gallup fragte 44.025 Beschäftigte in den USA, wie groß ihr Team ist und ob sie in der letzten Woche bedeutsames Feedback erhalten hatten. Die Teamgröße machte wenig Unterschied. Das wöchentliche Gespräch schon."),
      blocks: [
        { type: "dumbbell", from: x("Without", "Pa", "Ohne"), to: x("With weekly feedback", "Me feedback çdo javë", "Mit wöchentlichem Feedback"), min: 0, max: 80, rowH: 26, source: ["span-gallup-2026"],
          label: x("Engaged employees by team size, with and without meaningful feedback in the past week", "Punonjësit e angazhuar sipas madhësisë së ekipit, me dhe pa feedback kuptimplotë javën e fundit", "Engagierte Beschäftigte nach Teamgröße, mit und ohne bedeutsames Feedback in der letzten Woche"),
          rows: [
            { k: x("Fewer than 5", "Më pak se 5", "Unter 5"), a: 22, an: pc(22), b: 67, bn: pc(67) },
            { k: x("5 to 9", "5 deri në 9", "5 bis 9"), a: 25, an: pc(25), b: 69, bn: pc(69) },
            { k: x("10 to 24", "10 deri në 24", "10 bis 24"), a: 26, an: pc(26), b: 70, bn: pc(70) },
            { k: x("25 or more", "25 e më shumë", "25 und mehr"), a: 22, an: pc(22), b: 68, bn: pc(68), alert: true },
          ] },
        { type: "p", text: x(
          "The manager's own work counts too. 97% of US managers also do individual work; the median is 40% of their time. Above that share, their own engagement falls as the team grows: from 36% with fewer than five reports to 32% with 25 or more.",
          "Ka peshë edhe puna e vetë menaxherit. 97% e menaxherëve në SHBA bëjnë edhe punë individuale; mediana është 40% e kohës. Përtej kësaj pjese, angazhimi i tyre bie kur rritet ekipi: nga 36% me më pak se pesë vartës në 32% me 25 e më shumë.",
          "Auch die eigene Arbeit der Führungskraft zählt. 97 % der Führungskräfte in den USA erledigen auch Facharbeit, im Median 40 % ihrer Zeit. Liegt der Anteil darüber, sinkt ihr eigenes Engagement mit wachsendem Team: von 36 % bei unter fünf Unterstellten auf 32 % bei 25 und mehr.") },
      ],
      note: x(
        "Gallup's employee data, 2022–2024, count the team a person mainly works on, not the manager's direct reports. “With” means they strongly agreed (5 of 5). A survey: it shows an association, not a cause.",
        "Të dhënat e Gallup për punonjësit, 2022–2024, numërojnë ekipin ku punon kryesisht një njeri, jo vartësit e drejtpërdrejtë të menaxherit. “Me” do të thotë se u pajtuan plotësisht (5 nga 5). Anketë: tregon lidhje, jo shkak.",
        "Gallups Beschäftigtendaten, 2022–2024, zählen das Team, in dem jemand vor allem arbeitet, nicht die direkt Unterstellten einer Führungskraft. „Mit“ heißt volle Zustimmung (5 von 5). Eine Befragung: Sie zeigt einen Zusammenhang, keine Ursache."),
      source: ["span-gallup-2026"],
    },
    {
      id: "tool", tool: "/tools/shift-handover/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The span", "Karta e hapësirës", "Die Karte zur"), x("card", "së kontrollit", "Führungsspanne")],
      lead: x(
        "One manager, one card. Fill it in for your own team, or together with a manager who reports to you, and read the last two lines first.",
        "Një menaxher, një kartë. Plotësoje për ekipin tënd, ose bashkë me një menaxher që të raporton ty, dhe lexo së pari dy rreshtat e fundit.",
        "Eine Führungskraft, eine Karte. Für das eigene Team ausfüllen oder gemeinsam mit einer Führungskraft, die an einen selbst berichtet, und zuerst die letzten zwei Zeilen lesen."),
      blocks: [
        { type: "form", items: [
          { h: x("Direct reports", "Vartësit e drejtpërdrejtë", "Direkt Unterstellte"), hint: x("how many report to you directly; how many more through them", "sa të raportojnë drejtpërdrejt; sa të tjerë përmes tyre", "wie viele direkt berichten; wie viele weitere über sie") },
          { h: x("How alike the work is", "Sa e ngjashme është puna", "Wie ähnlich die Arbeit ist"), hint: x("the same tasks for all, or a different job for each", "të njëjtat detyra për të gjithë, apo një punë tjetër për secilin", "gleiche Aufgaben für alle oder für jede Person eine andere") },
          { h: x("How it interlocks", "Sa ndërlidhet", "Wie sie ineinandergreift"), hint: x("can each work alone, or does one wait for another", "a punon secili më vete, apo njëri pret tjetrin", "arbeitet jede Person für sich, oder wartet eine auf die andere") },
          { h: x("Coaching needed", "Sa udhëzim duhet", "Bedarf an Begleitung"), hint: x("who is new, who is learning a task, who runs alone", "kush është i ri, kush po mëson një detyrë, kush ecën vetë", "wer neu ist, wer eine Aufgabe lernt, wer allein läuft") },
          { h: x("Time for my own work", "Koha për punën time", "Zeit für eigene Arbeit"), hint: x("share of the week spent doing, not leading (Gallup's median: 40%)", "pjesa e javës që shkon te bërja, jo te drejtimi (mediana e Gallup: 40%)", "Anteil der Woche fürs Selbermachen statt Führen (Median bei Gallup: 40 %)") },
          { h: x("Last week's conversations", "Bisedat e javës së kaluar", "Gespräche der letzten Woche"), hint: x("with how many of them; who has had none for a month", "me sa prej tyre; kush nuk ka pasur asnjë prej një muaji", "mit wie vielen; wer seit einem Monat keines hatte") },
        ] },
      ],
      note: x(
        "A practice proposed by the editors, after Gulick and Graicunas on the work, and Gallup on the manager's own work and the weekly conversation. The card sets no ideal number. The handover tool helps to give open issues an owner instead of carrying them yourself.",
        "Praktikë e propozuar nga redaksia, sipas Gulick-ut dhe Graicunas-it për punën, dhe sipas Gallup për punën e vetë menaxherit dhe bisedën e çdo jave. Karta nuk cakton numër ideal. Mjeti i dorëzimit të turnit ndihmon që çështjet e hapura të kenë një përgjegjës, në vend që t'i mbash vetë.",
        "Eine Praxis, die die Redaktion vorschlägt, nach Gulick und Graicunas zur Arbeit und nach Gallup zur eigenen Arbeit der Führungskraft und zum wöchentlichen Gespräch. Die Karte nennt keine Idealzahl. Das Übergabe-Werkzeug hilft, offenen Punkten eine verantwortliche Person zu geben, statt sie selbst zu tragen."),
      source: ["span-gulick-1937", "span-graicunas-1933", "span-gallup-2026"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
