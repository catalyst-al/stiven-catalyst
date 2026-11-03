// Management Review, No. 100: Slips, trips and falls, the most ordinary accident, and housekeeping as an operating
// standard. Block: Operations. Facts and their sources: docs/revista/management-review-nr-100.md. HSE's kinds of
// accident statistics (2025), the DGUV's Statistik Arbeitsunfallgeschehen 2024 (2025; the overview and the chapter on
// slips, trips and falls), Chang et al. (2016, PubMed Central), Bell et al. (2019, SJWEH) and HSE's INDG225 were read
// in full. Bell et al. (2008) was not opened: its result is given as Chang et al. report it.
// The ranking of injury kinds is No. 15, near misses No. 63, injury rates No. 87, lifting No. 99: not repeated.
import { x, pc } from "../common.js";

export default {
  number: 100,
  block: "operations",
  date: x("November 2026", "Nëntor 2026", "November 2026"),
  theme: [x("Slips, trips and falls:", "Rrëshqitje, pengesa, rrëzime:", "Ausrutschen, Stolpern, Stürzen:"), x("the ordinary accident", "aksidenti i zakonshëm", "der gewöhnliche Unfall")],
  sub: x(
    "Why the fall on the level is the most common accident, where it happens in Germany, a trial with free slip-resistant shoes, three layers of prevention, and a floor walk at the end of the shift.",
    "Pse rrëzimi në të njëjtin nivel është aksidenti më i shpeshtë, ku ndodh në Gjermani, një studim me këpucë kundër rrëshqitjes falas, tri shtresa parandalimi, dhe një kontroll i dyshemesë në fund të turnit.",
    "Warum der Sturz auf gleicher Ebene der häufigste Unfall ist, wo er in Deutschland passiert, eine Studie mit kostenlosen rutschhemmenden Schuhen, drei Ebenen der Prävention und ein Bodenrundgang zum Schichtende."),
  seo: x(
    "Slips, trips and falls at work: HSE and DGUV figures, a randomised trial of slip-resistant shoes, prevention in three layers, and an end-of-shift floor walk.",
    "Rrëshqitjet dhe rrëzimet në punë: shifrat e HSE-së dhe DGUV-së, një studim i rastësishëm me këpucë, parandalimi në tri shtresa dhe kontrolli i dyshemesë.",
    "Stolper-, Rutsch- und Sturzunfälle: Zahlen von HSE und DGUV, eine randomisierte Studie zu Schuhen, Prävention in drei Ebenen und ein Bodenrundgang."),
  feature: x(
    "A wet floor seldom gets an inquiry. Yet slips, trips and falls on the same level are the most common injury employers report in Great Britain, and one in four reportable accidents at work in Germany. Issue 100 shows how serious these ordinary falls are, where they happen, what free slip-resistant shoes did in 226 school districts, how prevention is built in three layers, and ends with a floor walk for the end of the shift.",
    "Një dysheme e lagur rrallë merr një hetim. E megjithatë rrëshqitjet, pengesat dhe rrëzimet në të njëjtin nivel janë lëndimi më i shpeshtë që raportojnë punëdhënësit në Britani, dhe një në katër aksidente pune të raportueshme në Gjermani. Numri 100 tregon sa të rënda janë këto rrëzime të zakonshme, ku ndodhin, çfarë bënë këpucët kundër rrëshqitjes falas në 226 rrethe shkollore, si ndërtohet parandalimi në tri shtresa, dhe mbyllet me një kontroll të dyshemesë në fund të turnit.",
    "Ein nasser Boden bekommt selten einen Untersuchungsbericht. Dennoch sind Ausrutschen, Stolpern und Stürzen auf gleicher Ebene die häufigste Verletzung, die Arbeitgeber in Großbritannien melden, und jeder vierte meldepflichtige Arbeitsunfall in Deutschland. Ausgabe 100 zeigt, wie schwer diese gewöhnlichen Stürze sind, wo sie passieren, was kostenlose rutschhemmende Schuhe in 226 Schulbezirken bewirkten, wie Prävention in drei Ebenen aufgebaut ist, und endet mit einem Bodenrundgang zum Schichtende."),
  figure: { n: x("24.1%", "24,1%", "24,1 %"), by: "DGUV, 2025", t: x(
    "of reportable accidents at work in Germany in 2024 were slips, trips and falls on the level: 164,912.",
    "e aksidenteve të raportueshme në punë në Gjermani më 2024 ishin rrëshqitje, pengesa dhe rrëzime: 164.912.",
    "der meldepflichtigen Arbeitsunfälle in Deutschland 2024 waren Stolper-, Rutsch- und Sturzunfälle: 164.912.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("Too ordinary to count", "Shumë e zakonshme për t'u numëruar", "Zu gewöhnlich, um zu zählen") },
    { page: "research", kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: x("Shoes for 226 school kitchens", "Këpucë për 226 kuzhina shkollash", "Schuhe für 226 Schulküchen") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The end-of-shift floor walk", "Kontrolli i dyshemesë në fund të turnit", "Der Bodenrundgang zum Schichtende") },
  ],
  sources: ["hse-accidents-2025", "slips-dguv-2025", "slips-chang-2016", "slips-bell-2019", "slips-hse-indg225"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "A fall from a roof gets an investigation. A fall over a cable or on a wet floor gets a plaster and a note. This hundredth issue is about the accident that is too ordinary to count, and about order on the floor treated as a standard of the operation, not as cleaning.",
        "Një rënie nga çatia merr një hetim. Një rrëzim mbi një kabllo ose në një dysheme të lagur merr një leukoplast dhe një shënim. Ky numër i njëqindtë flet për aksidentin që është shumë i zakonshëm për t'u numëruar, dhe për rregullin në dysheme si standard i operacionit, jo si pastrim.",
        "Ein Absturz vom Dach bekommt eine Untersuchung. Ein Sturz über ein Kabel oder auf nassem Boden bekommt ein Pflaster und eine Notiz. Diese hundertste Ausgabe handelt vom Unfall, der zu gewöhnlich ist, um zu zählen, und von Ordnung am Boden als Standard des Betriebs, nicht als Putzen."),
      body: x(
        "In Great Britain slips, trips and falls on the level cause 30% of reported injuries but 46% of the specified ones, which are mostly fractures. In Germany they were 24.1% of reportable accidents in 2024; half on floors and walkways. Free slip-resistant shoes cut slipping injuries in school kitchens from 3.54 to 1.18 per 10,000 worker-months. Prevention works in three layers. A floor walk for the end of the shift closes the issue.",
        "Në Britani rrëshqitjet, pengesat dhe rrëzimet në të njëjtin nivel shkaktojnë 30% të lëndimeve të raportuara, por 46% të atyre të caktuarave, që janë kryesisht thyerje. Në Gjermani ishin 24,1% e aksidenteve të raportueshme më 2024; gjysma në dysheme dhe kalime. Këpucët kundër rrëshqitjes falas i ulën lëndimet nga rrëshqitja në kuzhinat e shkollave nga 3,54 në 1,18 për 10.000 muaj pune. Parandalimi punon në tri shtresa. Një kontroll i dyshemesë në fund të turnit e mbyll numrin.",
        "In Großbritannien verursachen Ausrutschen, Stolpern und Stürzen auf gleicher Ebene 30 % der gemeldeten Verletzungen, aber 46 % der besonders schweren, meist Brüche. In Deutschland waren es 2024 24,1 % der meldepflichtigen Unfälle; die Hälfte auf Böden und Verkehrswegen. Kostenlose rutschhemmende Schuhe senkten Rutschverletzungen in Schulküchen von 3,54 auf 1,18 je 10.000 Beschäftigtenmonate. Prävention wirkt in drei Ebenen. Ein Bodenrundgang zum Schichtende schließt die Ausgabe."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("Too ordinary", "Shumë e zakonshme", "Zu gewöhnlich,"), x("to count", "për t'u numëruar", "um zu zählen")],
      lead: x(
        "HSE's statistics for 2024/25 put slips, trips and falls on the same level first among the injuries employers report, in most sectors. Together with handling injuries they make about half of all reports, yet only 1% of the deaths at work over five years. That is why they look minor.",
        "Statistikat e HSE-së për 2024/25 i vënë rrëshqitjet, pengesat dhe rrëzimet në të njëjtin nivel të parat mes lëndimeve që raportojnë punëdhënësit, në shumicën e sektorëve. Bashkë me lëndimet nga peshat bëjnë rreth gjysmën e raporteve, por vetëm 1% të vdekjeve në punë në pesë vjet. Prandaj duken të vogla.",
        "Die HSE-Statistik für 2024/25 setzt Ausrutschen, Stolpern und Stürzen auf gleicher Ebene in den meisten Branchen an die Spitze der von Arbeitgebern gemeldeten Verletzungen. Zusammen mit Verletzungen beim Heben machen sie rund die Hälfte aller Meldungen aus, aber nur 1 % der Todesfälle bei der Arbeit in fünf Jahren. Deshalb wirken sie harmlos."),
      blocks: [
        { type: "pairs", from: x("Over 7 days off", "Mbi 7 ditë mungesë", "Über 7 Tage Ausfall"), to: x("Specified, mostly fractures", "Të caktuara, kryesisht thyerje", "Listenverletzungen, meist Brüche"), max: 50, source: ["hse-accidents-2025"],
          label: x("Share of each kind of injury reported by employers, Great Britain, 2024/25", "Pjesa e secilit lloj lëndimi të raportuar nga punëdhënësit, Britania e Madhe, 2024/25", "Anteil jeder Art an den von Arbeitgebern gemeldeten Verletzungen, Großbritannien, 2024/25"),
          rows: [
            { k: x("Slip, trip or fall on the same level", "Rrëshqitje, pengesë ose rrëzim në të njëjtin nivel", "Ausrutschen, Stolpern, Sturz auf gleicher Ebene"), a: 24, an: pc(24), b: 46, bn: pc(46), alert: true },
            { k: x("Handling, lifting or carrying", "Trajtim, ngritje ose mbajtje peshash", "Handhaben, Heben oder Tragen"), a: 22, an: pc(22), b: 5, bn: pc(5) },
          ] },
        { type: "p", text: x(
          "Specified injuries are a fixed list in British law; around 90% of them are fractures. Nearly half of these specified injuries came from a slip, trip or fall on the level.",
          "Lëndimet e caktuara janë një listë e mbyllur në ligjin britanik; rreth 90% e tyre janë thyerje. Gati gjysma e këtyre lëndimeve të caktuara erdhi nga një rrëshqitje, pengesë ose rrëzim në të njëjtin nivel.",
          "Listenverletzungen (specified injuries) sind eine feste Liste im britischen Recht; rund 90 % davon sind Brüche. Fast die Hälfte dieser Listenverletzungen kam von Ausrutschen, Stolpern oder Stürzen auf gleicher Ebene.") },
        { type: "callout", reading: true, text: x(
          "Rare deaths make the fall look small. The fractures and the weeks off say otherwise.",
          "Vdekjet e rralla e bëjnë rrëzimin të duket i vogël. Thyerjet dhe javët e mungesës thonë të kundërtën.",
          "Seltene Todesfälle lassen den Sturz klein wirken. Die Brüche und die Wochen des Ausfalls sagen etwas anderes.") },
      ],
      note: x(
        "HSE, RIDDOR reports to employees, 2024/25, provisional; reporting is estimated at about half. Each bar is a kind's share of one category. The overall ranking of kinds, slips 30% and handling 17%, is in No. 15; lifting in No. 99.",
        "HSE, raportet RIDDOR për punonjësit, 2024/25, paraprake; raportimi vlerësohet rreth gjysma. Çdo shirit është pjesa e një lloji brenda një kategorie. Renditja e përgjithshme e llojeve, rrëshqitjet 30% dhe peshat 17%, është te Nr. 15; ngritja te Nr. 99.",
        "HSE, RIDDOR-Meldungen zu Beschäftigten, 2024/25, vorläufig; gemeldet wird schätzungsweise rund die Hälfte. Jeder Balken ist der Anteil einer Art innerhalb einer Kategorie. Die Gesamtrangfolge, Stürze 30 % und Heben 17 %, steht in Nr. 15; Heben in Nr. 99."),
      source: ["hse-accidents-2025"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("Where people fall", "Ku rrëzohen njerëzit", "Wo Menschen stürzen"), x("in Germany", "në Gjermani", "in Deutschland")],
      lead: x(
        "The German statutory accident insurance counts slips, trips and falls on the level apart from falls from height. In 2024 they were 164,912 of 685,543 reportable accidents at work, those with at least four days off or a death.",
        "Sigurimi ligjor gjerman i aksidenteve i numëron rrëshqitjet, pengesat dhe rrëzimet në të njëjtin nivel veç rënieve nga lartësia. Më 2024 ishin 164.912 nga 685.543 aksidente pune të raportueshme, ato me të paktën katër ditë mungesë ose me vdekje.",
        "Die Deutsche Gesetzliche Unfallversicherung zählt Stolper-, Rutsch- und Sturzunfälle getrennt von Absturzunfällen. 2024 waren es 164.912 von 685.543 meldepflichtigen Arbeitsunfällen, also mit mindestens vier Tagen Arbeitsunfähigkeit oder tödlich."),
      blocks: [
        { type: "figures", compact: true, items: [
          { n: x("24.1%", "24,1%", "24,1 %"), t: x("of reportable accidents at work", "e aksidenteve të raportueshme në punë", "der meldepflichtigen Arbeitsunfälle") },
          { n: x("27.1%", "27,1%", "27,1 %"), t: x("of new accident pensions; in 68% of these the injury was a fracture", "e pensioneve të reja nga aksidentet; te 68% e tyre lëndimi ishte thyerje", "der neuen Unfallrenten; bei 68 % davon war ein Bruch die Diagnose") },
        ] },
        { type: "hbars", max: 60, source: ["slips-dguv-2025"],
          label: x("Slips, trips and falls by what the person fell on, Germany, 2024", "Rrëshqitje, pengesa dhe rrëzime sipas asaj ku u rrëzua personi, Gjermani, 2024", "Stolper-, Rutsch- und Sturzunfälle nach Gegenstand der Abweichung, Deutschland, 2024"),
          items: [
            { k: x("Floors, surfaces, walkways", "Dysheme, sipërfaqe, kalime", "Böden, Flächen, Verkehrsbereiche"), v: 52.0, n: x("52.0%", "52,0%", "52,0 %"), alert: true },
            { k: x("Stairs", "Shkallë", "Treppe"), v: 19.5, n: x("19.5%", "19,5%", "19,5 %") },
            { k: x("Ladders and steps", "Shkallë portative", "Leitern und Tritte"), v: 2.8, n: x("2.8%", "2,8%", "2,8 %") },
            { k: x("Pallets", "Paleta", "Paletten"), v: 1.5, n: x("1.5%", "1,5%", "1,5 %") },
          ] },
        { type: "p", text: x(
          "Within floors, about 13,500 falls were on a surface wet from water, rain, snow or ice, and about 4,800 on oil or grease. Most injuries were to the ankle and foot (38%) or the knee and lower leg (21%).",
          "Brenda dyshemeve, rreth 13.500 rrëzime ndodhën në sipërfaqe të lagur nga uji, shiu, bora ose akulli, dhe rreth 4.800 mbi vaj ose yndyrë. Shumica e lëndimeve ishin në kyçin e këmbës dhe shputë (38%) ose në gju dhe kërci (21%).",
          "Von den Böden waren rund 13.500 Fälle durch Wasser, Regen, Schnee oder Glatteis rutschig, rund 4.800 durch Öl oder Fett. Die meisten Verletzungen betrafen Knöchel und Fuß (38 %) oder Knie und Unterschenkel (21 %).") },
      ],
      note: x(
        "DGUV, Statistik Arbeitsunfallgeschehen 2024 (2025), tables 4 and 44: employees and entrepreneurs, accidents during work, extrapolated from a sample. Bars are shares of the 164,912; the rest are other objects. Ladder cases here are slips and trips, not falls from height.",
        "DGUV, Statistik Arbeitsunfallgeschehen 2024 (2025), tabelat 4 dhe 44: punonjës dhe sipërmarrës, aksidente gjatë punës, të shtrira nga një mostër. Shiritat janë pjesë të 164.912; pjesa tjetër janë objekte të tjera. Rastet me shkallë portative këtu janë rrëshqitje e pengesa, jo rënie nga lartësia.",
        "DGUV, Statistik Arbeitsunfallgeschehen 2024 (2025), Tabellen 4 und 44: abhängig Beschäftigte und Unternehmer, Unfälle bei betrieblicher Tätigkeit, aus einer Stichprobe hochgerechnet. Balken sind Anteile an den 164.912; der Rest sind andere Gegenstände. Leiterfälle zählen hier als Stolpern und Rutschen, nicht als Absturz."),
      source: ["slips-dguv-2025"],
    },
    {
      id: "model",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Three layers", "Tri shtresa", "Drei Ebenen"), x("of prevention", "parandalimi", "der Prävention")],
      lead: x(
        "In their review for the journal Ergonomics, Wen-Ruey Chang and colleagues set out prevention in three layers, after Haslam and Stubbs: design the hazard out, reduce what remains, and help people cope with what is left. Housekeeping sits in the middle layer.",
        "Në rishikimin e tyre për revistën Ergonomics, Wen-Ruey Chang dhe kolegët e paraqesin parandalimin në tri shtresa, sipas Haslam dhe Stubbs: hiqe rrezikun që në projektim, ule atë që mbetet, dhe ndihmo njerëzit me atë që s'hiqet dot. Rregulli dhe pastrimi janë në shtresën e mesme.",
        "In ihrem Review für die Zeitschrift Ergonomics ordnen Wen-Ruey Chang und Kollegen die Prävention nach Haslam und Stubbs in drei Ebenen: die Gefahr wegplanen, das Verbleibende verringern und den Menschen helfen, mit dem Rest umzugehen. Ordnung und Reinigung liegen in der mittleren Ebene."),
      blocks: [
        { type: "lists", cols: [
          { h: x("Design out", "Hiqe në projektim", "Wegplanen"), items: [
            x("slip-resistant flooring", "dysheme kundër rrëshqitjes", "rutschhemmender Boden"),
            x("walkways without trip hazards", "kalime pa pengesa", "Wege ohne Stolperstellen"),
            x("enough storage, good light", "vend i mjaftueshëm ruajtjeje, dritë e mirë", "genug Stauraum, gutes Licht"),
          ] },
          { h: x("Reduce", "Ule", "Verringern"), accent: true, items: [
            x("sustainable cleaning and inspection", "pastrim dhe kontroll që zgjat", "dauerhafte Reinigung und Kontrolle"),
            x("mark what cannot be removed", "shëno atë që s'hiqet dot", "markieren, was nicht weg kann"),
            x("no rushing, no awkward loads", "pa nxitim, pa pesha të vështira", "kein Hetzen, keine sperrigen Lasten"),
          ] },
          { h: x("Help people", "Ndihmo njerëzit", "Menschen unterstützen"), items: [
            x("footwear for the floor", "këpucë për dyshemenë", "Schuhwerk passend zum Boden"),
            x("eyesight, balance", "shikimi, ekuilibri", "Sehen, Gleichgewicht"),
            x("fatigue on shifts", "lodhja në turne", "Müdigkeit im Schichtdienst"),
          ] },
        ] },
        { type: "p", text: x(
          "The review warns that cleaning routines tend to slip back over time, so they must be built to last. It describes a fast-food chain where clean floors depended on the detergent head office chose, on how it was used locally, and on supervision amid high staff turnover.",
          "Rishikimi paralajmëron se rutinat e pastrimit priren të dobësohen me kohën, prandaj duhen ndërtuar që të zgjasin. Përshkruan një zinxhir ushqimi të shpejtë ku pastërtia e dyshemesë varej nga detergjenti që zgjodhi zyra qendrore, nga mënyra si përdorej në vend, dhe nga mbikëqyrja në mes të largimeve të shpeshta të stafit.",
          "Der Review warnt, dass Reinigungsroutinen mit der Zeit nachlassen und daher auf Dauer angelegt sein müssen. Er beschreibt eine Fast-Food-Kette, in der saubere Böden vom Reinigungsmittel der Zentrale abhingen, von seinem Gebrauch vor Ort und von der Aufsicht bei hoher Fluktuation.") },
        { type: "callout", reading: true, text: x(
          "A wet floor is the last link of a chain that starts with a leak, a detergent or a rushed task. Fix the chain, not only the floor.",
          "Dyshemeja e lagur është hallka e fundit e një zinxhiri që nis me një rrjedhje, një detergjent ose një punë me nxitim. Rregullo zinxhirin, jo vetëm dyshemenë.",
          "Der nasse Boden ist das letzte Glied einer Kette, die mit einem Leck, einem Reinigungsmittel oder einer gehetzten Aufgabe beginnt. Die Kette beheben, nicht nur den Boden.") },
      ],
      note: x(
        "Layers and items from table 2 of Chang et al. (2016), adapted from Haslam and Stubbs (2006), shortened by the editors. The authors add that evidence for the single elements and their priority is sparse. Fatigue is in No. 89.",
        "Shtresat dhe pikat nga tabela 2 e Chang et al. (2016), përshtatur nga Haslam dhe Stubbs (2006), të shkurtuara nga redaksia. Autorët shtojnë se provat për elementet e veçanta dhe për rendin e tyre janë të pakta. Lodhja është te Nr. 89.",
        "Ebenen und Punkte aus Tabelle 2 von Chang et al. (2016), nach Haslam und Stubbs (2006), von der Redaktion gekürzt. Die Autoren fügen hinzu, dass Belege für die einzelnen Elemente und ihre Rangfolge spärlich sind. Müdigkeit steht in Nr. 89."),
      source: ["slips-chang-2016"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("Shoes for 226", "Këpucë për 226", "Schuhe für 226"), x("school kitchens", "kuzhina shkollash", "Schulküchen")],
      lead: x(
        "Jennifer Bell and colleagues at NIOSH randomised 226 US school districts whose kitchens were run by one food service company. In one group, workers could get slip-resistant shoes free of charge from August 2011; in the other they kept buying their own. 16,949 workers took part over 53 months.",
        "Jennifer Bell dhe kolegët në NIOSH ndanë rastësisht 226 rrethe shkollore amerikane, kuzhinat e të cilave i drejtonte një kompani ushqimi. Në një grup, punonjësit mund të merrnin këpucë kundër rrëshqitjes falas nga gushti 2011; në tjetrin vazhduan t'i blinin vetë. Morën pjesë 16.949 punonjës gjatë 53 muajve.",
        "Jennifer Bell und Kollegen vom NIOSH randomisierten 226 US-Schulbezirke, deren Küchen ein Verpflegungsunternehmen betrieb. In einer Gruppe bekamen die Beschäftigten ab August 2011 kostenlos rutschhemmende Schuhe; in der anderen kauften sie sie weiter selbst. 16.949 Beschäftigte nahmen über 53 Monate teil."),
      blocks: [
        { type: "pairs", from: x("Before (24 months)", "Para (24 muaj)", "Vorher (24 Monate)"), to: x("After (29 months)", "Pas (29 muajve)", "Nachher (29 Monate)"), max: 4, source: ["slips-bell-2019"],
          label: x("Slipping injury claims per 10,000 worker-months", "Kërkesa dëmshpërblimi nga rrëshqitja për 10.000 muaj pune", "Rutschverletzungen (Versicherungsfälle) je 10.000 Beschäftigtenmonate"),
          rows: [
            { k: x("Free shoes", "Këpucë falas", "Kostenlose Schuhe"), a: 3.54, an: x("3.54", "3,54", "3,54"), b: 1.18, bn: x("1.18", "1,18", "1,18"), alert: true },
            { k: x("Usual practice", "Praktika e zakonshme", "Übliche Praxis"), a: 2.01, an: x("2.01", "2,01", "2,01"), b: 2.30, bn: x("2.30", "2,30", "2,30") },
          ] },
        { type: "p", text: x(
          "The odds of a slipping injury fell by 67% in the shoe group, while they rose in the other, and the difference held after adjustment for age. Earlier, in three US hospitals, a programme of eleven measures from dry floors to lighting went with a fall of over 50% in claims, as Chang and colleagues report it.",
          "Shanset e një lëndimi nga rrëshqitja ranë me 67% në grupin me këpucë, ndërsa në tjetrin u rritën, dhe ndryshimi qëndroi pas korrigjimit për moshën. Më herët, në tre spitale amerikane, një program me njëmbëdhjetë masa, nga dyshemetë e thata te ndriçimi, shkoi bashkë me një rënie mbi 50% të kërkesave, siç e raportojnë Chang dhe kolegët.",
          "Die Chance einer Rutschverletzung sank in der Schuhgruppe um 67 %, während sie in der anderen stieg, und der Unterschied blieb nach Korrektur für das Alter bestehen. Zuvor ging in drei US-Kliniken ein Programm aus elf Maßnahmen, von trockenen Böden bis Beleuchtung, mit über 50 % weniger Versicherungsfällen einher, wie Chang und Kollegen berichten.") },
        { type: "callout", reading: true, text: x(
          "The shoes worked where the employer paid and nearly everyone signed up. A rule that people pay for themselves is a weaker rule.",
          "Këpucët funksionuan aty ku pagoi punëdhënësi dhe pothuajse të gjithë u regjistruan. Një rregull që njerëzit e paguajnë vetë është rregull më i dobët.",
          "Die Schuhe wirkten, wo der Arbeitgeber zahlte und fast alle mitmachten. Eine Regel, die die Leute selbst bezahlen, ist eine schwächere Regel.") },
      ],
      note: x(
        "Bell et al. (2019), cluster randomised; outcome: compensation claims for slips on wet or greasy floors indoors. 94% of workers took part; whether the injured wore the shoes is not known. The hospital study (2008) was not read; its result as Chang et al. (2016) give it.",
        "Bell et al. (2019), me grupe të rastësishme; rezultati: kërkesat për dëmshpërblim nga rrëshqitjet në dysheme të lagura ose me yndyrë brenda. Morën pjesë 94% e punonjësve; nuk dihet nëse të lënduarit i mbanin këpucët. Studimi në spitale (2008) nuk u lexua; rezultati siç e japin Chang et al. (2016).",
        "Bell et al. (2019), clusterrandomisiert; Zielgröße: Versicherungsfälle durch Ausrutschen auf nassen oder fettigen Böden in Innenräumen. 94 % der Beschäftigten nahmen teil; ob die Verletzten die Schuhe trugen, ist unbekannt. Die Klinikstudie (2008) wurde nicht gelesen; ihr Ergebnis nach Chang et al. (2016)."),
      source: ["slips-bell-2019", "slips-chang-2016"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie es gemessen wird"),
      title: [x("Map the falls,", "Harto rrëzimet,", "Stürze kartieren,"), x("not only count them", "mos i numëro vetëm", "nicht nur zählen")],
      lead: x(
        "A count of falls tells you there is a problem. Where they happen tells you what to fix. HSE points to a mapping tool for finding the hot spots of slips and trips; the DGUV sorts them by place and by what the person fell on.",
        "Numri i rrëzimeve të tregon që ka një problem. Vendi ku ndodhin të tregon çfarë të rregullosh. HSE udhëzon te një mjet hartimi për të gjetur pikat e nxehta të rrëshqitjeve dhe pengesave; DGUV i rendit sipas vendit dhe sipas asaj ku u rrëzua personi.",
        "Die Zahl der Stürze sagt, dass es ein Problem gibt. Wo sie passieren, sagt, was zu beheben ist. Die HSE verweist auf ein Kartierungswerkzeug, um Schwerpunkte von Ausrutsch- und Stolperunfällen zu finden; die DGUV ordnet sie nach Ort und Gegenstand."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("Where", "Ku", "Wo"), p: x("a cross on the floor plan: door, ramp, kitchen, stairs, car park", "një kryq në planin e dyshemesë: derë, rampë, kuzhinë, shkallë, parking", "ein Kreuz im Grundriss: Tür, Rampe, Küche, Treppe, Parkplatz") },
          { h: x("Underfoot", "Nën këmbë", "Unter den Füßen"), p: x("water, grease, ice, an object, a cable, an edge, a worn mat", "ujë, yndyrë, akull, një objekt, një kabllo, një buzë, një qilim i grisur", "Wasser, Fett, Eis, ein Gegenstand, ein Kabel, eine Kante, eine verschlissene Matte") },
          { h: x("Doing what", "Duke bërë çfarë", "Bei welcher Tätigkeit"), p: x("carrying, hurrying, looking elsewhere, cleaning in progress", "duke mbajtur peshë, me nxitim, duke parë gjetiu, gjatë pastrimit", "Tragen, Eile, Blick woanders, laufende Reinigung") },
          { h: x("When", "Kur", "Wann"), p: x("hour, shift, weather; winter quarters stand out in the German data", "ora, turni, moti; tremujorët e dimrit dallohen në të dhënat gjermane", "Uhrzeit, Schicht, Wetter; Winterquartale fallen in den deutschen Daten auf") },
          { h: x("Near misses too", "Edhe ngjarjet që gati ndodhën", "Auch Beinahe-Unfälle"), p: x("a slip without a fall goes on the same plan", "një rrëshqitje pa rrëzim shkon në të njëjtin plan", "ein Ausrutschen ohne Sturz kommt auf denselben Plan") },
        ] },
        { type: "callout", reading: true, text: x(
          "Three crosses at the same door are one problem with an address. That is where the next action goes.",
          "Tre kryqe te e njëjta derë janë një problem me adresë. Aty shkon veprimi i radhës.",
          "Drei Kreuze an derselben Tür sind ein Problem mit Adresse. Dorthin gehört die nächste Maßnahme.") },
      ],
      note: x(
        "The fields are the editors' selection, built on HSE's mapping advice in INDG225 and the DGUV's categories; the winter peak is the DGUV's finding for 2021–2024 commuting falls. Near misses are in No. 63, the safety cross and rates in No. 87.",
        "Fushat janë përzgjedhje e redaksisë, të ndërtuara mbi këshillën e HSE-së për hartimin te INDG225 dhe mbi kategoritë e DGUV-së; kulmi i dimrit është gjetja e DGUV-së për rrëzimet gjatë rrugës për në punë, 2021–2024. Ngjarjet që gati ndodhën janë te Nr. 63, kryqi i sigurisë dhe normat te Nr. 87.",
        "Die Felder sind eine Auswahl der Redaktion, gestützt auf den Kartierungshinweis der HSE in INDG225 und die Kategorien der DGUV; die Winterspitze ist der DGUV-Befund zu Wegeunfällen 2021–2024. Beinahe-Unfälle stehen in Nr. 63, das Sicherheitskreuz und Quoten in Nr. 87."),
      source: ["slips-hse-indg225", "slips-dguv-2025"],
    },
    {
      id: "tool", tool: "/tools/five-s-audit/", more: "6s-without-a-poster",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The end-of-shift", "Kontrolli i dyshemesë", "Der Bodenrundgang"), x("floor walk", "në fund të turnit", "zum Schichtende")],
      lead: x(
        "One walk per area at the end of each shift, by the person who owns that area, with what is found handed over by name. The 5S Audit tool scores the same area over time and turns findings into actions with an owner.",
        "Një kontroll për çdo zonë në fund të çdo turni, nga personi që e ka atë zonë, dhe çfarë gjendet dorëzohet me emër. Mjeti 5S Audit e vlerëson të njëjtën zonë me kalimin e kohës dhe i kthen gjetjet në veprime me përgjegjës.",
        "Ein Rundgang pro Bereich am Ende jeder Schicht, durch die Person, die für den Bereich zuständig ist; Befunde werden mit Namen übergeben. Das Werkzeug 5S Audit bewertet denselben Bereich über die Zeit und macht aus Befunden Maßnahmen mit Verantwortlichen."),
      blocks: [
        { type: "form", items: [
          { h: x("Area, time, owner", "Zona, ora, përgjegjësi", "Bereich, Uhrzeit, verantwortlich"), hint: x("one area per card; who walks it", "një zonë për kartë; kush e kontrollon", "ein Bereich pro Karte; wer geht ihn ab") },
          { h: x("Floors clean and dry", "Dyshemetë të pastra dhe të thata", "Böden sauber und trocken"), hint: x("spills, leaks, where cleaning left the floor wet, the right detergent", "derdhje, rrjedhje, ku pastrimi e la dyshemenë të lagur, detergjenti i duhur", "Verschüttetes, Lecks, wo die Reinigung nass hinterließ, das richtige Mittel") },
          { h: x("Walkways clear", "Kalimet të lira", "Wege frei"), hint: x("boxes, pallets, cables, trolleys parked in the way", "kuti, paleta, kabllo, karroca të lëna në rrugë", "Kartons, Paletten, Kabel, abgestellte Rollwagen") },
          { h: x("Surfaces and light", "Sipërfaqet dhe drita", "Flächen und Licht"), hint: x("damaged floor or mats, steps and edges visible, lamps working", "dysheme ose qilima të dëmtuar, shkallë e buzë të dukshme, llamba që punojnë", "beschädigter Boden oder Matten, Stufen und Kanten sichtbar, Lampen in Ordnung") },
          { h: x("Entrances and weather", "Hyrjet dhe moti", "Eingänge und Wetter"), hint: x("matting in place, rain or ice plan for the next shift", "qilimat në vend, plani për shi ose akull për turnin tjetër", "Matten liegen, Plan für Regen oder Eis in der nächsten Schicht") },
          { h: x("Open findings", "Gjetjet e hapura", "Offene Befunde"), hint: x("what, where, who fixes it, by when; handed over by name", "çfarë, ku, kush e rregullon, deri kur; dorëzuar me emër", "was, wo, wer behebt es, bis wann; mit Namen übergeben") },
        ] },
      ],
      note: x(
        "The card is the editors' proposal, built on HSE's practical steps in INDG225 and the layers in Chang et al. (2016). The essay linked below gives the author's own end-of-shift check for one area.",
        "Karta është propozim i redaksisë, i ndërtuar mbi hapat praktikë të HSE-së te INDG225 dhe shtresat te Chang et al. (2016). Eseja e lidhur më poshtë jep kontrollin e vetë autorit për një zonë në fund të turnit.",
        "Die Karte ist ein Vorschlag der Redaktion, gestützt auf die praktischen Schritte der HSE in INDG225 und die Ebenen bei Chang et al. (2016). Der unten verlinkte Essay gibt die eigene Prüfung des Autors für einen Bereich am Schichtende."),
      source: ["slips-hse-indg225", "slips-chang-2016"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
