// Management Review, No. 94: Noise at work, hearing loss and the quieter costs. Block: People.
// Facts and their sources: docs/revista/management-review-nr-94.md. Directive 2003/10/EC was read in full in the Official
// Journal text held at legislation.gov.uk (EUR-Lex did not answer); the LärmVibrationsArbSchV in full at
// gesetze-im-internet.de (as amended 21 July 2021); Basner et al. (2014) in full at PubMed Central; the DGUV tables of
// suspected, recognised and new-pension cases in full on dguv.de. Heat is in No. 84, shift work in No. 45.
import { x, pc } from "../common.js";

export default {
  number: 94,
  block: "people",
  date: x("November 2026", "Nëntor 2026", "November 2026"),
  theme: [x("Noise at work:", "Zhurma në punë:", "Lärm bei der Arbeit:"), x("the ear and the quieter costs", "veshi dhe kostot më të heshtura", "das Ohr und die leiseren Kosten")],
  sub: x(
    "Hearing that does not come back, Germany's most recognised occupational disease, the steps at 80, 85 and 87 dB(A), what noise does to speech, attention and strain, how a shift's exposure is measured, and a card for the loud area.",
    "Dëgjimi që nuk kthehet, sëmundja profesionale më e njohur në Gjermani, shkallët te 80, 85 dhe 87 dB(A), çfarë i bën zhurma të folurit, vëmendjes dhe lodhjes, si matet ekspozimi i një turni, dhe një kartë për zonën e zhurmshme.",
    "Gehör, das nicht zurückkommt, Deutschlands am häufigsten anerkannte Berufskrankheit, die Stufen bei 80, 85 und 87 dB(A), was Lärm mit Sprache, Aufmerksamkeit und Belastung macht, wie die Belastung einer Schicht gemessen wird, und eine Karte."),
  seo: x(
    "Noise at work: noise-induced hearing loss, German occupational disease figures, the 80, 85 and 87 dB(A) values, non-auditory effects, and a card.",
    "Zhurma në punë: humbja e dëgjimit, shifrat gjermane të sëmundjeve profesionale, vlerat 80, 85 dhe 87 dB(A), efektet e tjera dhe një kartë.",
    "Lärm bei der Arbeit: Lärmschwerhörigkeit, Zahlen der DGUV, die Werte 80, 85 und 87 dB(A), Wirkungen jenseits des Ohrs und eine Karte."),
  feature: x(
    "Noise takes hearing slowly and does not give it back. Issue 94 starts with the ear: why noise-induced hearing loss is permanent and what it does to speech and attention. It shows that in Germany it was the most often recognised occupational disease in 2024 and 2025, sets out the EU and German steps at 80, 85 and 87 dB(A), reads what noise costs below those levels, explains how a shift's exposure is measured, and ends with a card for the loud area, from the source to the ear.",
    "Zhurma e merr dëgjimin ngadalë dhe nuk e kthen më. Numri 94 nis me veshin: pse humbja e dëgjimit nga zhurma është e përhershme dhe çfarë i bën të folurit dhe vëmendjes. Tregon se në Gjermani ishte sëmundja profesionale e njohur më shpesh më 2024 dhe 2025, shtron shkallët evropiane dhe gjermane te 80, 85 dhe 87 dB(A), lexon çfarë kushton zhurma nën këto nivele, shpjegon si matet ekspozimi i një turni, dhe mbyllet me një kartë për zonën e zhurmshme, nga burimi te veshi.",
    "Lärm nimmt das Gehör langsam und gibt es nicht zurück. Ausgabe 94 beginnt beim Ohr: warum Lärmschwerhörigkeit bleibt und was sie mit Sprache und Aufmerksamkeit macht. Sie zeigt, dass sie in Deutschland 2024 und 2025 die am häufigsten anerkannte Berufskrankheit war, stellt die europäischen und deutschen Stufen bei 80, 85 und 87 dB(A) dar, liest, was Lärm unterhalb davon kostet, erklärt die Messung über die Schicht und endet mit einer Karte für den lauten Bereich, von der Quelle bis zum Ohr."),
  figure: { n: x("9,819", "9.819", "9.819"), by: "DGUV, 2026", t: x(
    "cases of noise-induced hearing loss recognised as an occupational disease in Germany in 2025, more than any other disease.",
    "raste të humbjes së dëgjimit nga zhurma të njohura si sëmundje profesionale në Gjermani më 2025, më shumë se çdo sëmundje tjetër.",
    "Fälle von Lärmschwerhörigkeit 2025 in Deutschland als Berufskrankheit anerkannt, mehr als bei jeder anderen Krankheit.") },
  teasers: [
    { page: "numbers", kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: x("Germany's most recognised occupational disease", "Sëmundja profesionale më e njohur në Gjermani", "Die häufigste anerkannte Berufskrankheit") },
    { page: "model", kicker: x("The model", "Modeli", "Das Modell"),
      title: x("80, 85, 87: the steps", "80, 85, 87: shkallët", "80, 85, 87: die Stufen") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The loud area card", "Karta e zonës së zhurmshme", "Die Karte für den lauten Bereich") },
  ],
  sources: ["noise-directive-2003-10", "noise-laermvibrationsarbschv", "noise-basner-2014", "noise-dguv-bk-2026"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "In a warehouse, a kitchen or a laundry, noise is part of the work and rarely part of the plan. It does its damage without pain, and the damage stays. Managers decide which machine runs where, who works beside it and for how long. This issue asks what the evidence and the rules say about those decisions.",
        "Në një magazinë, një kuzhinë ose një lavanderi, zhurma është pjesë e punës dhe rrallë pjesë e planit. E bën dëmin pa dhimbje, dhe dëmi mbetet. Menaxherët vendosin cila makinë punon ku, kush punon pranë saj dhe për sa kohë. Ky numër pyet çfarë thonë provat dhe rregullat për këto vendime.",
        "In einem Lager, einer Küche oder einer Wäscherei gehört Lärm zur Arbeit und selten zur Planung. Er schadet ohne Schmerz, und der Schaden bleibt. Führungskräfte entscheiden, welche Maschine wo läuft, wer daneben arbeitet und wie lange. Diese Ausgabe fragt, was Belege und Regeln zu diesen Entscheidungen sagen."),
      body: x(
        "Noise kills sensory cells in the inner ear that do not grow back; prevention is the only option. In Germany, 9,819 cases of noise-induced hearing loss were recognised as an occupational disease in 2025, about four in ten of all recognitions. EU law sets steps at 80, 85 and 87 dB(A); Germany allows 85 at the ear. Below those levels noise still costs speech, attention and strain. How exposure is measured, and a card for the loud area, end the issue.",
        "Zhurma vret qeliza shqisore në veshin e brendshëm që nuk rriten më; parandalimi është e vetmja rrugë. Në Gjermani, 9.819 raste të humbjes së dëgjimit nga zhurma u njohën si sëmundje profesionale më 2025, rreth katër në dhjetë nga të gjitha njohjet. Ligji i BE-së vendos shkallë te 80, 85 dhe 87 dB(A); Gjermania lejon 85 te veshi. Nën këto nivele, zhurma kushton prapë të folur, vëmendje dhe lodhje. Si matet ekspozimi, dhe një kartë për zonën e zhurmshme, e mbyllin numrin.",
        "Lärm tötet Sinneszellen im Innenohr, die nicht nachwachsen; Vorbeugung ist der einzige Weg. In Deutschland wurden 2025 9.819 Fälle von Lärmschwerhörigkeit als Berufskrankheit anerkannt, rund vier von zehn aller Anerkennungen. Das EU-Recht setzt Stufen bei 80, 85 und 87 dB(A); Deutschland erlaubt 85 am Ohr. Unterhalb davon kostet Lärm noch Sprache, Aufmerksamkeit und Kraft. Wie die Belastung gemessen wird und eine Karte für den lauten Bereich beenden die Ausgabe."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("The damage", "Dëmi që", "Der Schaden,"), x("that does not heal", "nuk shërohet", "der nicht heilt")],
      lead: x(
        "Noise is the major preventable cause of hearing loss, wrote Mathias Basner and colleagues in The Lancet in 2014. It can come from one intense impulse, or from long, steady exposure above about 75 to 85 dB(A), as in industry.",
        "Zhurma është shkaku kryesor i parandalueshëm i humbjes së dëgjimit, shkruan Mathias Basner me kolegët në The Lancet më 2014. Mund të vijë nga një impuls i vetëm i fortë, ose nga ekspozim i gjatë e i vazhdueshëm mbi rreth 75 deri 85 dB(A), si në industri.",
        "Lärm ist die wichtigste vermeidbare Ursache von Schwerhörigkeit, schrieben Mathias Basner und Kollegen 2014 in The Lancet. Er kann aus einem einzigen starken Impuls kommen oder aus langer, gleichmäßiger Belastung über etwa 75 bis 85 dB(A), wie in der Industrie."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("The cells", "Qelizat", "Die Zellen"), p: x("Noise destroys the sensory hair cells of the inner ear. In mammals they do not regenerate: there is no remission.", "Zhurma shkatërron qelizat shqisore me qime të veshit të brendshëm. Te gjitarët ato nuk rigjenerohen: nuk ka kthim.", "Lärm zerstört die Haarsinneszellen des Innenohrs. Bei Säugetieren wachsen sie nicht nach: Es gibt keine Rückbildung.") },
          { h: x("The ringing", "Zhurma në vesh", "Das Klingeln"), p: x("Tinnitus often follows exposure and can last; it can disturb sleep and make it hard to sustain attention.", "Tingëllima në vesh shpesh vjen pas ekspozimit dhe mund të zgjasë; mund të prishë gjumin dhe ta bëjë të vështirë mbajtjen e vëmendjes.", "Tinnitus folgt oft auf Lärm und kann bleiben; er kann den Schlaf stören und das Halten der Aufmerksamkeit erschweren.") },
          { h: x("Speech", "Të folurit", "Sprache"), p: x("Hearing loss that stops a person following speech in everyday situations has a severe social effect.", "Humbja e dëgjimit që e pengon njeriun të ndjekë të folurit në situata të përditshme ka efekt të rëndë shoqëror.", "Schwerhörigkeit, die Sprache im Alltag nicht mehr verstehen lässt, hat schwere soziale Folgen.") },
          { h: x("Attention and falls", "Vëmendja dhe rëniet", "Aufmerksamkeit und Stürze"), p: x("It can lower attention to tasks; undiagnosed hearing loss is associated with accidents and falls.", "Mund ta ulë vëmendjen te detyrat; humbja e dëgjimit e padiagnostikuar lidhet me aksidente dhe rënie.", "Sie kann die Aufmerksamkeit für Aufgaben senken; unerkannte Schwerhörigkeit geht mit Unfällen und Stürzen einher.") },
        ] },
        { type: "callout", reading: true, text: x(
          "Noise hurts no one on the day. The loss shows years later, when nothing can be done but prevent more of it.",
          "Zhurma nuk lëndon askënd atë ditë. Humbja duket vite më vonë, kur s'mund të bëhet gjë tjetër veç të parandalohet më shumë.",
          "Lärm tut am Tag selbst niemandem weh. Der Verlust zeigt sich Jahre später, wenn man nur noch weiteren verhindern kann.") },
      ],
      note: x(
        "From Basner et al. (2014), a review in The Lancet, read in full at PubMed Central; the levels are LA averages over time. The four groups are the editors' summary. Heat at work is in No. 84.",
        "Nga Basner et al. (2014), rishikim në The Lancet, lexuar i plotë në PubMed Central; nivelet janë mesatare LA në kohë. Katër grupet janë përmbledhje e redaksisë. Nxehtësia në punë është te Nr. 84.",
        "Aus Basner et al. (2014), einer Übersicht in The Lancet, vollständig bei PubMed Central gelesen; die Pegel sind zeitlich gemittelte LA-Werte. Die vier Gruppen fasst die Redaktion zusammen. Hitze bei der Arbeit steht in Nr. 84."),
      source: ["noise-basner-2014"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("The most recognised", "Sëmundja profesionale", "Die häufigste anerkannte"), x("occupational disease", "më e njohur", "Berufskrankheit")],
      lead: x(
        "Germany's statutory accident insurers publish each year how many occupational diseases were reported, recognised and compensated with a pension. Noise-induced hearing loss is number 2301 on the list.",
        "Sigurimet ligjore gjermane të aksidenteve publikojnë çdo vit sa sëmundje profesionale u raportuan, u njohën dhe u kompensuan me pension. Humbja e dëgjimit nga zhurma është numri 2301 në listë.",
        "Die gesetzlichen Unfallversicherungsträger veröffentlichen jedes Jahr, wie viele Berufskrankheiten angezeigt, anerkannt und mit einer Rente entschädigt wurden. Lärmschwerhörigkeit hat die Nummer 2301."),
      blocks: [
        { type: "columns", max: 10000, height: 104, source: ["noise-dguv-bk-2026"],
          label: x("Noise-induced hearing loss recognised as an occupational disease, Germany", "Humbja e dëgjimit nga zhurma e njohur si sëmundje profesionale, Gjermani", "Als Berufskrankheit anerkannte Lärmschwerhörigkeit, Deutschland"),
          items: [
            { k: "2023", v: 7609, n: x("7,609", "7.609", "7.609") },
            { k: "2024", v: 8897, n: x("8,897", "8.897", "8.897") },
            { k: "2025", v: 9819, n: x("9,819", "9.819", "9.819"), alert: true },
          ] },
        { type: "figures", compact: true, items: [
          { n: x("20,228", "20.228", "20.228"), t: x("suspected cases of noise-induced hearing loss reported in 2025", "raste të dyshuara të humbjes së dëgjimit nga zhurma, të raportuara më 2025", "Verdachtsanzeigen auf Lärmschwerhörigkeit im Jahr 2025") },
          { n: "340", t: x("new pensions for it in 2025, against 9,819 recognitions", "pensione të reja për të më 2025, kundrejt 9.819 njohjeve", "neue Renten dafür im Jahr 2025, bei 9.819 Anerkennungen") },
        ] },
        { type: "callout", reading: true, text: x(
          "Each case counted here began years earlier, in a loud room where the exposure was not brought down.",
          "Çdo rast i numëruar këtu nisi vite më parë, në një dhomë të zhurmshme ku ekspozimi nuk u ul.",
          "Jeder hier gezählte Fall begann Jahre zuvor, in einem lauten Raum, in dem die Belastung nicht gesenkt wurde.") },
      ],
      note: x(
        "DGUV tables, all statutory accident insurers, read in 2026. In 2024 and 2025 no disease had more recognitions; 9,819 of 24,340 in 2025 is about 40% (editors' arithmetic). Counts are cases, not a rate.",
        "Tabelat e DGUV-së, të gjitha sigurimet ligjore të aksidenteve, lexuar më 2026. Më 2024 dhe 2025 asnjë sëmundje nuk pati më shumë njohje; 9.819 nga 24.340 më 2025 janë rreth 40% (llogari e redaksisë). Numrat janë raste, jo normë.",
        "DGUV-Tabellen, alle gesetzlichen Unfallversicherungsträger, gelesen 2026. 2024 und 2025 hatte keine Krankheit mehr Anerkennungen; 9.819 von 24.340 im Jahr 2025 sind rund 40 % (Rechnung der Redaktion). Fallzahlen, keine Quote."),
      source: ["noise-dguv-bk-2026"],
    },
    {
      id: "model",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("80, 85, 87:", "80, 85, 87:", "80, 85, 87:"), x("the steps", "shkallët", "die Stufen")],
      lead: x(
        "Directive 2003/10/EC sets three values for the daily noise exposure, averaged over an eight-hour day. The two action values ignore hearing protectors; the limit counts what reaches the ear through them.",
        "Direktiva 2003/10/KE vendos tri vlera për ekspozimin ditor ndaj zhurmës, mesatare mbi një ditë tetë-orëshe. Dy vlerat e veprimit nuk i llogaritin mbrojtëset e veshit; kufiri numëron atë që arrin te veshi përmes tyre.",
        "Die Richtlinie 2003/10/EG setzt drei Werte für die tägliche Lärmexposition, gemittelt über einen Achtstundentag. Die beiden Auslösewerte lassen Gehörschutz außer Acht; der Grenzwert zählt, was durch ihn am Ohr ankommt."),
      blocks: [
        { type: "steps", items: [
          { h: x("80 dB(A): lower action value", "80 dB(A): vlera e poshtme e veprimit", "80 dB(A): unterer Auslösewert"), p: x("Hearing protectors made available; information and training; preventive hearing tests where the assessment shows a risk.", "Mbrojtëset e veshit vihen në dispozicion; informim dhe trajnim; teste parandaluese të dëgjimit kur vlerësimi tregon rrezik.", "Gehörschutz wird bereitgestellt; Information und Unterweisung; vorbeugende Hörtests, wo die Beurteilung ein Risiko zeigt.") },
          { h: x("85 dB(A): upper action value", "85 dB(A): vlera e sipërme e veprimit", "85 dB(A): oberer Auslösewert"), p: x("Protectors must be worn; the area is marked and access limited; a programme of technical and organisational measures; a right to a hearing check.", "Mbrojtëset duhet të mbahen; zona shënohet dhe hyrja kufizohet; një program masash teknike dhe organizative; e drejta për kontroll të dëgjimit.", "Gehörschutz muss getragen werden; der Bereich wird gekennzeichnet und begrenzt; ein Programm technischer und organisatorischer Maßnahmen; Recht auf Hörprüfung.") },
          { h: x("87 dB(A): limit at the ear", "87 dB(A): kufiri te veshi", "87 dB(A): Grenzwert am Ohr"), p: x("Never to be exceeded, even with protectors; if it is, act at once and find out why. Germany sets this value at 85 dB(A).", "Nuk kalohet kurrë, as me mbrojtëse; nëse kalohet, veprohet menjëherë dhe gjendet pse. Gjermania e vendos këtë vlerë te 85 dB(A).", "Darf nie überschritten werden, auch nicht mit Gehörschutz; sonst sofort handeln und die Ursache klären. Deutschland setzt diesen Wert auf 85 dB(A).") },
        ] },
        { type: "callout", reading: true, text: x(
          "The law ranks the answers: first the source, then technology, then work organisation, and only then the ear plug.",
          "Ligji i rendit përgjigjet: së pari burimi, pastaj teknika, pastaj organizimi i punës, dhe vetëm në fund tapa e veshit.",
          "Das Recht ordnet die Antworten: zuerst die Quelle, dann die Technik, dann die Organisation, und erst zuletzt der Stöpsel.") },
      ],
      note: x(
        "Directive 2003/10/EC, articles 3, 5–7 and 10, in our words; peak values 135, 137 and 140 dB(C). Germany: LärmVibrationsArbSchV §§ 6–8, the 85 dB(A) at the ear in § 8(2). Not legal advice.",
        "Direktiva 2003/10/KE, nenet 3, 5–7 dhe 10, me fjalët tona; vlerat e pikut 135, 137 dhe 140 dB(C). Gjermania: LärmVibrationsArbSchV §§ 6–8, 85 dB(A) te veshi në § 8(2). Nuk është këshillë ligjore.",
        "Richtlinie 2003/10/EG, Artikel 3, 5–7 und 10, in unseren Worten; Spitzenwerte 135, 137 und 140 dB(C). Deutschland: LärmVibrationsArbSchV §§ 6–8, die 85 dB(A) am Ohr in § 8 Abs. 2. Keine Rechtsberatung."),
      source: ["noise-directive-2003-10", "noise-laermvibrationsarbschv"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("The quieter", "Kostot më", "Die leiseren"), x("costs", "të heshtura", "Kosten")],
      lead: x(
        "The Lancet review's evidence on noise beyond the ear comes mostly from homes, schools and hospitals: annoyance, disturbed sleep, raised blood pressure and stress hormones, and, among hospital staff, effects on work itself.",
        "Provat e rishikimit në The Lancet për zhurmën përtej veshit vijnë kryesisht nga shtëpitë, shkollat dhe spitalet: bezdia, gjumi i prishur, tensioni i rritur dhe hormonet e stresit, dhe, te stafi i spitaleve, efektet te vetë puna.",
        "Die Belege der Lancet-Übersicht zu Lärm jenseits des Ohrs stammen meist aus Wohnungen, Schulen und Kliniken: Belästigung, gestörter Schlaf, erhöhter Blutdruck und Stresshormone und, beim Klinikpersonal, Folgen für die Arbeit selbst."),
      blocks: [
        { type: "cards", cols: 3, items: [
          { h: x("Words lost", "Fjalë që humbin", "Verlorene Worte"), p: x("Noise lowers speech intelligibility; in hospitals the misunderstandings that follow can lead to errors.", "Zhurma e ul kuptueshmërinë e të folurit; në spitale keqkuptimet që pasojnë mund të çojnë në gabime.", "Lärm senkt die Sprachverständlichkeit; in Kliniken können die folgenden Missverständnisse zu Fehlern führen.") },
          { h: x("Strain", "Lodhja", "Belastung"), p: x("Staff report annoyance, irritation, fatigue and tension headaches; noise-induced stress is linked to burnout and lower performance.", "Stafi raporton bezdi, acarim, lodhje dhe dhimbje koke nga tensioni; stresi nga zhurma lidhet me shterjen dhe me performancë më të ulët.", "Beschäftigte berichten Belästigung, Gereiztheit, Müdigkeit und Spannungskopfschmerz; lärmbedingter Stress hängt mit Burnout und geringerer Leistung zusammen.") },
          { h: x("The heart", "Zemra", "Das Herz"), p: x("Risk estimates for cardiovascular disease at ear-damaging work noise tend to be higher than for traffic noise at home.", "Vlerësimet e rrezikut për sëmundjet e zemrës nga zhurma e punës që dëmton veshin priren të jenë më të larta se për zhurmën e trafikut në shtëpi.", "Risikoschätzungen für Herz-Kreislauf-Erkrankungen bei gehörschädigendem Arbeitslärm liegen eher höher als bei Verkehrslärm zu Hause.") },
        ] },
        { type: "p", text: x(
          "The law names two of these costs. The employer must weigh noise that masks warning signals or other sounds needed to avoid accidents, and Germany adds tasks that demand high concentration and attention. Better acoustics, such as sound-absorbing ceilings, have been linked to staff performance and less strain.",
          "Ligji i përmend dy nga këto kosto. Punëdhënësi duhet të peshojë zhurmën që mbulon sinjalet paralajmëruese ose tinguj të tjerë të nevojshëm për të shmangur aksidentet, dhe Gjermania shton punët që kërkojnë përqendrim dhe vëmendje të lartë. Akustika më e mirë, si tavanet që thithin tingullin, është lidhur me performancën e stafit dhe me më pak lodhje.",
          "Das Recht nennt zwei dieser Kosten. Der Arbeitgeber muss Lärm berücksichtigen, der Warnsignale oder andere zur Unfallvermeidung nötige Geräusche überdeckt, und Deutschland ergänzt Tätigkeiten mit hoher Konzentration und Aufmerksamkeit. Bessere Akustik, etwa schallabsorbierende Decken, wurde mit besserer Leistung und geringerer Belastung verbunden.") },
        { type: "callout", reading: true, text: x(
          "Below 80 dB(A) the ear may be safe and the shift still poorer: missed calls, repeated orders, a tired team.",
          "Nën 80 dB(A) veshi mund të jetë i sigurt dhe turni prapë më i dobët: thirrje të humbura, porosi të përsëritura, një ekip i lodhur.",
          "Unter 80 dB(A) mag das Ohr sicher sein und die Schicht trotzdem schlechter: überhörte Rufe, wiederholte Aufträge, ein müdes Team.") },
      ],
      note: x(
        "Basner et al. (2014); the work effects are from hospital studies, not warehouses or kitchens, and are associations. Law: Directive 2003/10/EC art. 4(6)(e); LärmVibrationsArbSchV § 3(3). The callout is the editors' reading. Sleep and shift work are in No. 45.",
        "Basner et al. (2014); efektet te puna vijnë nga studime në spitale, jo në magazina a kuzhina, dhe janë lidhje. Ligji: Direktiva 2003/10/KE neni 4(6)(e); LärmVibrationsArbSchV § 3(3). Thirrja është lexim i redaksisë. Gjumi dhe turnet janë te Nr. 45.",
        "Basner et al. (2014); die Arbeitsfolgen stammen aus Klinikstudien, nicht aus Lagern oder Küchen, und sind Zusammenhänge. Recht: Richtlinie 2003/10/EG Art. 4 Abs. 6 Buchst. e; LärmVibrationsArbSchV § 3 Abs. 3. Der Hinweis ist Lesart der Redaktion. Schlaf und Schichtarbeit stehen in Nr. 45."),
      source: ["noise-basner-2014", "noise-directive-2003-10", "noise-laermvibrationsarbschv"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie es gemessen wird"),
      title: [x("Averaged over", "Mesatarja e", "Gemittelt über"), x("the shift", "turnit", "die Schicht")],
      lead: x(
        "The daily exposure, LEX,8h, is a time-weighted average of all the noise at work over a nominal eight-hour day, impulses included; the peak is measured apart. Decibels add up in an unfamiliar way.",
        "Ekspozimi ditor, LEX,8h, është mesatare e peshuar në kohë e gjithë zhurmës në punë gjatë një dite nominale tetë-orëshe, përfshirë impulset; piku matet veçmas. Decibelët mblidhen në një mënyrë të pazakontë.",
        "Die tägliche Exposition LEX,8h ist ein zeitlich gewichteter Mittelwert allen Lärms bei der Arbeit über einen nominalen Achtstundentag, Impulse eingeschlossen; der Spitzenpegel wird getrennt gemessen. Dezibel addieren sich ungewohnt."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("+3 dB", "+3 dB", "+3 dB"), p: x("twice the sound energy: two identical machines instead of one", "dyfishi i energjisë së tingullit: dy makina të njëjta në vend të njërës", "doppelte Schallenergie: zwei gleiche Maschinen statt einer") },
          { h: x("+10 dB", "+10 dB", "+10 dB"), p: x("ten times the energy, heard as about twice as loud", "dhjetëfishi i energjisë, i dëgjuar rreth dy herë më fort", "zehnfache Energie, etwa doppelt so laut empfunden") },
          { h: x("Assess, then measure", "Vlerëso, pastaj mat", "Beurteilen, dann messen"), p: x("measure where compliance cannot be judged safely; by a competent person; keep results 30 years", "mat kur përputhja nuk gjykohet me siguri; nga një person kompetent; ruaj rezultatet 30 vjet", "messen, wo die Einhaltung nicht sicher beurteilt werden kann; fachkundig; Ergebnisse 30 Jahre aufbewahren") },
        ] },
        { type: "example", label: x("Example, invented by the editors", "Shembull, i shpikur nga redaksia", "Beispiel, von der Redaktion erfunden"),
          rows: [
            { k: x("Dish area, 4 h", "Zona e enëve, 4 orë", "Spülbereich, 4 Std."), v: "88 dB(A)" },
            { k: x("Rest of the shift", "Pjesa tjetër e turnit", "Rest der Schicht"), v: x("quiet", "e qetë", "ruhig") },
            { k: "LEX,8h", v: x("about 85 dB(A)", "rreth 85 dB(A)", "etwa 85 dB(A)") },
          ],
          text: x(
            "Half the shift at a level averages about 3 dB below it. Halving the time near the machine buys 3 dB; lowering the machine by 10 dB buys more.",
            "Gjysma e turnit në një nivel jep mesatare rreth 3 dB më poshtë. Përgjysmimi i kohës pranë makinës fiton 3 dB; ulja e makinës me 10 dB fiton më shumë.",
            "Die halbe Schicht bei einem Pegel ergibt im Mittel etwa 3 dB weniger. Halbe Zeit an der Maschine bringt 3 dB; 10 dB leiser an der Quelle bringt mehr.") },
      ],
      note: x(
        "Definitions from Directive 2003/10/EC art. 2 and 4 and LärmVibrationsArbSchV §§ 3–5; the 3 dB and 10 dB rules from Basner et al. (2014). The example and its arithmetic are the editors', with the rest of the shift taken as quiet.",
        "Përkufizimet nga Direktiva 2003/10/KE nenet 2 dhe 4 dhe LärmVibrationsArbSchV §§ 3–5; rregullat e 3 dB dhe 10 dB nga Basner et al. (2014). Shembulli dhe llogaria janë të redaksisë, me pjesën tjetër të turnit të marrë si të qetë.",
        "Begriffe aus Richtlinie 2003/10/EG Art. 2 und 4 und LärmVibrationsArbSchV §§ 3–5; die Regeln zu 3 dB und 10 dB aus Basner et al. (2014). Beispiel und Rechnung stammen von der Redaktion, der Rest der Schicht als ruhig angenommen."),
      source: ["noise-directive-2003-10", "noise-laermvibrationsarbschv", "noise-basner-2014"],
    },
    {
      id: "tool", tool: "/tools/risk-assessment/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The loud", "Karta e zonës", "Die Karte für den"), x("area card", "së zhurmshme", "lauten Bereich")],
      lead: x(
        "One card per loud area, filled in in the order the law sets: source first, ear last. The full assessment of each work area, with owners and checks, belongs in Risk Assessment.",
        "Një kartë për çdo zonë të zhurmshme, e plotësuar sipas rendit që vendos ligji: burimi i pari, veshi i fundit. Vlerësimi i plotë i çdo zone pune, me përgjegjës dhe kontrolle, shkon te Risk Assessment.",
        "Eine Karte pro lautem Bereich, ausgefüllt in der Reihenfolge des Rechts: zuerst die Quelle, zuletzt das Ohr. Die vollständige Beurteilung jedes Bereichs, mit Verantwortlichen und Prüfungen, gehört in Risk Assessment."),
      blocks: [
        { type: "form", items: [
          { h: x("Area and level", "Zona dhe niveli", "Bereich und Pegel"), hint: x("sources, hours near them, LEX,8h and peak if measured; who measured, when", "burimet, orët pranë tyre, LEX,8h dhe piku nëse u mat; kush e mati, kur", "Quellen, Stunden in ihrer Nähe, LEX,8h und Spitze, falls gemessen; wer, wann") },
          { h: x("At the source", "Te burimi", "An der Quelle"), hint: x("quieter equipment or method; maintenance of what rattles, leaks or bangs", "pajisje ose metodë më e qetë; mirëmbajtja e asaj që kërcet, rrjedh ose përplaset", "leiseres Gerät oder Verfahren; Wartung dessen, was klappert, zischt oder schlägt") },
          { h: x("Technical", "Teknike", "Technisch"), hint: x("enclosures, screens, sound-absorbing surfaces, damping", "kapsulime, ekrane, sipërfaqe që thithin tingullin, amortizim", "Kapselung, Abschirmung, schallabsorbierende Flächen, Dämpfung") },
          { h: x("Organisation", "Organizimi", "Organisation"), hint: x("time near the source, rotation, quiet breaks and rest room", "koha pranë burimit, rotacioni, pushime dhe dhomë pushimi të qeta", "Zeit an der Quelle, Wechsel, ruhige Pausen und Pausenraum") },
          { h: x("The ear", "Veshi", "Das Ohr"), hint: x("protectors chosen and fitted, worn above 85; warning signals still heard; area marked", "mbrojtëse të zgjedhura dhe të përshtatura, të mbajtura mbi 85; sinjalet paralajmëruese dëgjohen; zona e shënuar", "Gehörschutz ausgewählt und angepasst, über 85 getragen; Warnsignale hörbar; Bereich gekennzeichnet") },
          { h: x("People", "Njerëzit", "Menschen"), hint: x("briefed in a language they understand; hearing checks offered; date of the next review", "të informuar në një gjuhë që e kuptojnë; kontrolle dëgjimi të ofruara; data e rishikimit tjetër", "unterwiesen in verständlicher Sprache; Hörprüfung angeboten; Datum der nächsten Prüfung") },
        ] },
      ],
      note: x(
        "The card is the editors' proposal, not legal advice, built on the order in LärmVibrationsArbSchV § 7 and Directive 2003/10/EC art. 5, the duties in §§ 8 and 11, and Basner et al. (2014). The risk matrix is in No. 28.",
        "Karta është propozim i redaksisë, jo këshillë ligjore, e ndërtuar mbi rendin në LärmVibrationsArbSchV § 7 dhe Direktivën 2003/10/KE neni 5, detyrimet në §§ 8 dhe 11, dhe Basner et al. (2014). Matrica e rrezikut është te Nr. 28.",
        "Die Karte ist ein Vorschlag der Redaktion, keine Rechtsberatung, gestützt auf die Rangfolge in § 7 LärmVibrationsArbSchV und Art. 5 der Richtlinie 2003/10/EG, die Pflichten in §§ 8 und 11 und Basner et al. (2014). Die Risikomatrix steht in Nr. 28."),
      source: ["noise-laermvibrationsarbschv", "noise-directive-2003-10", "noise-basner-2014"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
