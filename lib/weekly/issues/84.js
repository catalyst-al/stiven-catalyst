// Management Review, No. 84: Heat at work. Block: People.
// Facts and their sources: docs/revista/management-review-nr-84.md. The ILO report (2024) and the EU-OSHA guidance
// (2023) were read in full as PDFs; ASR A3.5 in its consolidated text (amended 2022). Flouris et al. (2018) could not
// be opened in full and was left out. Shift and night work are in No. 45, mental health in No. 75.
import { x, pc } from "../common.js";

export default {
  number: 84,
  block: "people",
  date: x("November 2026", "Nëntor 2026", "November 2026"),
  theme: [x("Heat at work:", "Nxehtësia në punë:", "Hitze bei der Arbeit:"), x("not only in a heatwave", "jo vetëm në valë të nxehti", "nicht nur in der Hitzewelle")],
  sub: x(
    "Warehouses, kitchens, vans and laundries, nine in ten exposures outside heatwaves, Europe's fast rise, the first days in the heat, Germany's steps at 26, 30 and 35 °C, and a card for the hot shift.",
    "Magazina, kuzhina, furgonë dhe lavanderi, nëntë në dhjetë ekspozime jashtë valëve të nxehtit, rritja e shpejtë në Evropë, ditët e para në nxehtësi, shkallët gjermane te 26, 30 dhe 35 °C, dhe një kartë për turnin e nxehtë.",
    "Lager, Küchen, Transporter und Wäschereien, neun von zehn Belastungen außerhalb von Hitzewellen, Europas schneller Anstieg, die ersten Tage in der Hitze, Deutschlands Stufen bei 26, 30 und 35 °C, und eine Karte."),
  seo: x(
    "Heat at work: indoor jobs at risk, 9 in 10 exposures outside heatwaves, acclimatisation, ASR A3.5 steps at 26, 30 and 35 °C, and a shift card.",
    "Nxehtësia në punë: punët brenda në rrezik, 9 në 10 ekspozime jashtë valëve të nxehtit, përshtatja, shkallët e ASR A3.5 te 26, 30, 35 °C, dhe një kartë.",
    "Hitze bei der Arbeit: Innenarbeit im Risiko, 9 von 10 Belastungen außerhalb von Hitzewellen, Akklimatisierung, ASR A3.5 mit 26, 30, 35 °C, eine Karte."),
  feature: x(
    "Heat at work is not only a building site at noon. Issue 84 starts indoors and on the road: warehouses, kitchens, delivery vans and laundries. It shows that nine in ten exposures to excessive heat happen outside heatwaves, that Europe has the lowest share and the fastest rise, and why the first days in the heat are the riskiest. Germany's steps at 26, 30 and 35 °C, how to measure, and a card for the hot shift end the issue.",
    "Nxehtësia në punë nuk është vetëm një kantier në mesditë. Numri 84 nis brenda dhe në rrugë: magazina, kuzhina, furgonë shpërndarjeje dhe lavanderi. Tregon se nëntë në dhjetë ekspozime ndaj nxehtësisë së tepërt ndodhin jashtë valëve të nxehtit, se Evropa ka pjesën më të ulët dhe rritjen më të shpejtë, dhe pse ditët e para në nxehtësi janë më të rrezikshmet. Shkallët gjermane te 26, 30 dhe 35 °C, si matet, dhe një kartë për turnin e nxehtë e mbyllin numrin.",
    "Hitze bei der Arbeit ist nicht nur die Baustelle am Mittag. Ausgabe 84 beginnt drinnen und auf der Straße: Lager, Küchen, Lieferwagen und Wäschereien. Sie zeigt, dass neun von zehn Belastungen durch übermäßige Hitze außerhalb von Hitzewellen auftreten, dass Europa den geringsten Anteil und den schnellsten Anstieg hat und warum die ersten Tage in der Hitze die riskantesten sind. Deutschlands Stufen bei 26, 30 und 35 °C, das Messen und eine Karte für die heiße Schicht beenden die Ausgabe."),
  figure: { n: x("8 in 10", "8 në 10", "8 von 10"), by: "ILO, 2024", t: x(
    "occupational injuries linked to excessive heat happen outside heatwaves, in the ILO's global estimate for 2020.",
    "lëndime në punë të lidhura me nxehtësinë e tepërt ndodhin jashtë valëve të nxehtit, sipas vlerësimit global të ILO-s për vitin 2020.",
    "Arbeitsunfälle im Zusammenhang mit übermäßiger Hitze geschehen außerhalb von Hitzewellen, so die globale Schätzung der ILO für 2020.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("Warehouses, kitchens, vans, laundries", "Magazina, kuzhina, furgonë, lavanderi", "Lager, Küchen, Transporter, Wäschereien") },
    { page: "model", kicker: x("The model", "Modeli", "Das Modell"),
      title: x("26, 30, 35: the German steps", "26, 30, 35: shkallët gjermane", "26, 30, 35: die deutschen Stufen") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The hot shift card", "Karta e turnit të nxehtë", "Die Karte für die heiße Schicht") },
  ],
  sources: ["heat-ilo-2024", "heat-euosha-2023", "heat-asr-a35"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Hotter summers reach work done indoors and in vans, not only on building sites. Managers of warehouses, kitchens, delivery rounds and laundries decide every hot day on water, breaks and pace. This issue asks what the evidence and the rules say about those decisions.",
        "Verat më të nxehta arrijnë te puna që bëhet brenda dhe në furgonë, jo vetëm në kantiere. Menaxherët e magazinave, kuzhinave, shpërndarjeve dhe lavanderive vendosin çdo ditë të nxehtë për ujin, pushimet dhe ritmin. Ky numër pyet çfarë thonë provat dhe rregullat për këto vendime.",
        "Heißere Sommer erreichen auch Arbeit drinnen und im Lieferwagen, nicht nur auf Baustellen. Wer Lager, Küchen, Touren oder Wäschereien führt, entscheidet an jedem heißen Tag über Wasser, Pausen und Tempo. Diese Ausgabe fragt, was Belege und Regeln zu diesen Entscheidungen sagen."),
      body: x(
        "The ILO counts at least 2.41 billion workers, 71% of the working population, exposed to excessive heat; in 2020 nine in ten of those exposures happened outside heatwaves. Europe and Central Asia have the lowest share and the fastest rise. EU-OSHA names laundries, restaurant kitchens and warehouse workers among indoor groups at risk, and advises easing new workers in over days. Germany's workplace rule sets steps at 26, 30 and 35 °C. A card for the hot shift ends the issue.",
        "ILO-ja numëron të paktën 2,41 miliardë punëtorë, 71% të popullsisë që punon, të ekspozuar ndaj nxehtësisë së tepërt; më 2020, nëntë në dhjetë nga këto ekspozime ndodhën jashtë valëve të nxehtit. Evropa dhe Azia Qendrore kanë pjesën më të ulët dhe rritjen më të shpejtë. EU-OSHA rendit lavanderitë, kuzhinat e restoranteve dhe punëtorët e magazinave mes grupeve në rrezik brenda, dhe këshillon që të rinjtë të futen në punë gradualisht, me ditë. Rregulli gjerman i vendeve të punës vendos shkallë te 26, 30 dhe 35 °C. Një kartë për turnin e nxehtë e mbyll numrin.",
        "Die ILO zählt mindestens 2,41 Milliarden Beschäftigte, 71 % der Erwerbsbevölkerung, die übermäßiger Hitze ausgesetzt sind; 2020 fanden neun von zehn dieser Belastungen außerhalb von Hitzewellen statt. Europa und Zentralasien haben den geringsten Anteil und den schnellsten Anstieg. EU-OSHA nennt Wäschereien, Restaurantküchen und Lagerbeschäftigte unter den gefährdeten Gruppen drinnen und rät, Neue über Tage einzugewöhnen. Die deutsche Arbeitsstättenregel setzt Stufen bei 26, 30 und 35 °C. Eine Karte für die heiße Schicht beendet die Ausgabe."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("Warehouses, kitchens,", "Magazina, kuzhina,", "Lager, Küchen,"), x("vans, laundries", "furgonë, lavanderi", "Transporter, Wäschereien")],
      lead: x(
        "Heat at work brings to mind a road crew at noon. EU-OSHA's guidance of 2023 also names work indoors: poorly cooled buildings, heavy physical work, and services such as laundries, restaurant kitchens and bakeries, as well as warehouse workers.",
        "Nxehtësia në punë të sjell ndër mend një skuadër rrugësh në mesditë. Udhëzimi i EU-OSHA-s i vitit 2023 rendit edhe punën brenda: ndërtesa të freskuara keq, punë fizike e rëndë, dhe shërbime si lavanderitë, kuzhinat e restoranteve dhe furrat, si edhe punëtorët e magazinave.",
        "Bei Hitze am Arbeitsplatz denkt man an einen Straßentrupp am Mittag. Der Leitfaden der EU-OSHA von 2023 nennt auch Arbeit drinnen: schlecht gekühlte Gebäude, schwere körperliche Arbeit und Dienste wie Wäschereien, Restaurantküchen und Bäckereien, dazu Lagerbeschäftigte."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("Warehouses", "Magazinat", "Lager"), p: x("The ILO rates heavy handling and lifting as heavy work, 360–465 W of body heat; warehouse work is among its examples.", "ILO-ja e quan të rëndë ngritjen dhe trajtimin e ngarkesave, 360–465 W nxehtësi trupore; puna në magazinë është mes shembujve të saj.", "Die ILO stuft schweres Heben und Tragen als schwere Arbeit ein, 360–465 W Körperwärme; Lagerarbeit ist eines ihrer Beispiele.") },
          { h: x("Kitchens", "Kuzhinat", "Küchen"), p: x("Restaurant work counts as moderate, 235–360 W; EU-OSHA lists restaurant kitchens and bakeries among indoor services at risk.", "Puna në restorant quhet mesatare, 235–360 W; EU-OSHA i rendit kuzhinat e restoranteve dhe furrat mes shërbimeve në rrezik brenda.", "Restaurantarbeit gilt als mittelschwer, 235–360 W; EU-OSHA zählt Restaurantküchen und Bäckereien zu den gefährdeten Diensten drinnen.") },
          { h: x("Delivery vans", "Furgonët e shpërndarjes", "Lieferwagen"), p: x("Confined spaces that trap heat, often without air conditioning, parcels to carry, and few toilets on the route, which often means drinking too little.", "Hapësira të mbyllura që e mbajnë nxehtësinë, shpesh pa kondicioner, pako për të mbajtur, dhe pak tualete gjatë rrugës, që shpesh do të thotë pak ujë.", "Enge Räume, die Hitze stauen, oft ohne Klimaanlage, Pakete zum Tragen und wenige Toiletten auf der Tour, was oft heißt: zu wenig trinken.") },
          { h: x("Laundries", "Lavanderitë", "Wäschereien"), p: x("The ILO lists laundering among high-risk work. In hot, humid air sweat cools poorly; a worker there is more prone to losing fluid and salts.", "ILO-ja e rendit larjen e rrobave mes punëve me rrezik të lartë. Në ajër të nxehtë e të lagësht djersa freskon pak; kush punon aty humbet më lehtë lëngje dhe kripëra.", "Die ILO zählt Wäschereiarbeit zu den Hochrisikotätigkeiten. In heißer, feuchter Luft kühlt Schweiß schlecht; wer dort arbeitet, verliert leichter Flüssigkeit und Salze.") },
        ] },
        { type: "callout", reading: true, text: x(
          "Indoors, much of the heat comes from the work itself: the body that lifts, the machine that runs, the air that does not move.",
          "Brenda, shumica e nxehtësisë vjen nga vetë puna: trupi që ngre, makina që punon, ajri që nuk lëviz.",
          "Drinnen kommt viel Hitze aus der Arbeit selbst: vom Körper, der hebt, von der Maschine, die läuft, von der Luft, die steht.") },
      ],
      note: x(
        "Watts are the body's heat output by work intensity, from the ILO's table based on ISO (2017). The vans follow the ILO's account of delivery workers; grouping the cases in four is the editors'.",
        "Vatët janë nxehtësia e trupit sipas intensitetit të punës, nga tabela e ILO-s mbi bazën e ISO-s (2017). Furgonët ndjekin përshkrimin e ILO-s për punëtorët e shpërndarjes; grupimi në katër është i redaksisë.",
        "Die Watt sind die Wärmeabgabe des Körpers je Arbeitsschwere, aus der ILO-Tabelle nach ISO (2017). Die Lieferwagen folgen der ILO-Schilderung zu Zustellern; die Einteilung in vier stammt von der Redaktion."),
      source: ["heat-ilo-2024", "heat-euosha-2023"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("Nine in ten", "Nëntë në dhjetë", "Neun von zehn"), x("outside the heatwave", "jashtë valëve të nxehtit", "außerhalb der Hitzewelle")],
      lead: x(
        "The ILO's 2024 review starts from its estimate that 2.41 billion workers are exposed to excessive heat, and asks when it happens. In 2020, 231 million were exposed during a heatwave.",
        "Rishikimi i ILO-s i vitit 2024 nis nga vlerësimi se 2,41 miliardë punëtorë janë të ekspozuar ndaj nxehtësisë së tepërt, dhe pyet kur ndodh kjo. Më 2020, 231 milionë u ekspozuan gjatë një vale të nxehti.",
        "Die ILO-Übersicht von 2024 geht von 2,41 Milliarden Beschäftigten unter übermäßiger Hitze aus und fragt, wann das geschieht. 2020 waren 231 Millionen während einer Hitzewelle betroffen."),
      blocks: [
        { type: "people", source: ["heat-ilo-2024"],
          label: x("Workers exposed to excessive heat in 2020, out of 10", "Punëtorët e ekspozuar ndaj nxehtësisë së tepërt më 2020, nga 10", "Beschäftigte unter übermäßiger Hitze 2020, von 10"),
          groups: [
            { v: 1, tone: "red", n: x("1 in 10", "1 në 10", "1 von 10"), t: x("during a heatwave", "gjatë një vale të nxehti", "während einer Hitzewelle") },
            { v: 9, tone: "dim", n: x("9 in 10", "9 në 10", "9 von 10"), t: x("outside heatwaves", "jashtë valëve të nxehtit", "außerhalb von Hitzewellen") },
          ] },
        { type: "figures", compact: true, items: [
          { n: pc(29), t: x("of workers in Europe and Central Asia exposed, the lowest share of any region", "e punëtorëve në Evropë dhe Azinë Qendrore të ekspozuar, pjesa më e ulët e çdo rajoni", "der Beschäftigten in Europa und Zentralasien betroffen, der geringste Anteil aller Regionen") },
          { n: x("+17.3%", "+17,3%", "+17,3 %"), t: x("rise in exposure there from 2000 to 2020, the largest; worldwide +8.8%", "rritja e ekspozimit atje nga 2000 në 2020, më e madhja; në botë +8,8%", "Anstieg der Belastung dort von 2000 bis 2020, der größte; weltweit +8,8 %") },
        ] },
        { type: "callout", reading: true, text: x(
          "A heat plan that waits for the weather warning starts late. Most hot shifts never make the news.",
          "Një plan për nxehtësinë që pret paralajmërimin e motit nis vonë. Shumica e turneve të nxehta nuk dalin kurrë në lajme.",
          "Ein Hitzeplan, der auf die Wetterwarnung wartet, beginnt zu spät. Die meisten heißen Schichten kommen nie in die Nachrichten.") },
      ],
      note: x(
        "ILO model estimates from climate and labour-force data, formal and informal work. For Europe's fast rise in heat-linked injuries the ILO suggests workforces largely not acclimatized. Read in the full text.",
        "Vlerësime modeli të ILO-s nga të dhënat e klimës dhe të forcës punëtore, punë formale dhe joformale. Për rritjen e shpejtë të lëndimeve nga nxehtësia në Evropë, ILO-ja sugjeron fuqi punëtore kryesisht të papërshtatur. Lexuar te teksti i plotë.",
        "Modellschätzungen der ILO aus Klima- und Arbeitsmarktdaten, formelle und informelle Arbeit. Für Europas schnellen Anstieg hitzebedingter Unfälle vermutet die ILO Belegschaften, die meist nicht an Hitze gewöhnt sind. Gelesen im Volltext."),
      source: ["heat-ilo-2024"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("The body", "Trupi", "Der Körper"), x("and the first days", "dhe ditët e para", "und die ersten Tage")],
      lead: x(
        "In heatstroke, EU-OSHA warns, body temperature can reach 40 °C or more within 10 to 15 minutes, and people are generally unable to notice their own symptoms. The body adapts to heat, but only over days.",
        "Në goditjen nga nxehtësia, paralajmëron EU-OSHA, temperatura e trupit mund të arrijë 40 °C ose më shumë brenda 10 deri 15 minutash, dhe njerëzit zakonisht nuk i vënë re dot simptomat e veta. Trupi përshtatet me nxehtësinë, por vetëm me ditë.",
        "Beim Hitzschlag, warnt EU-OSHA, kann die Körpertemperatur in 10 bis 15 Minuten auf 40 °C oder mehr steigen, und Betroffene bemerken ihre eigenen Symptome meist nicht. Der Körper gewöhnt sich an Hitze, aber nur über Tage."),
      blocks: [
        { type: "columns", max: 100, height: 104, source: ["heat-euosha-2023"],
          label: x("Most of the usual time in the heat, worker with experience (2023)", "Pjesa më e madhe e kohës së zakonshme në nxehtësi, punëtor me përvojë (2023)", "Höchstanteil der üblichen Zeit in der Hitze, erfahrene Beschäftigte (2023)"),
          items: [
            { k: x("Day 1", "Dita 1", "Tag 1"), v: 50, n: pc(50), alert: true },
            { k: x("Day 2", "Dita 2", "Tag 2"), v: 60, n: pc(60) },
            { k: x("Day 3", "Dita 3", "Tag 3"), v: 80, n: pc(80) },
            { k: x("Day 4", "Dita 4", "Tag 4"), v: 100, n: pc(100) },
          ] },
        { type: "p", text: x(
          "New workers start at no more than 20% on day one and add at most 20% a day. Full acclimatisation takes six to seven days; tolerance falls even after a long weekend. A meta-analysis cited by the ILO found injury risk 1% higher per degree above reference values.",
          "Të rinjtë nisin me jo më shumë se 20% ditën e parë dhe shtojnë jo më shumë se 20% në ditë. Përshtatja e plotë zgjat gjashtë deri shtatë ditë; qëndrueshmëria bie edhe pas një fundjave të gjatë. Një meta-analizë që citon ILO-ja gjeti rrezik lëndimi 1% më të lartë për çdo gradë mbi vlerat e referencës.",
          "Neue beginnen am ersten Tag mit höchstens 20 % und steigern um höchstens 20 % pro Tag. Volle Akklimatisierung dauert sechs bis sieben Tage; die Toleranz sinkt schon nach einem langen Wochenende. Eine von der ILO zitierte Metaanalyse fand ein um 1 % höheres Unfallrisiko je Grad über den Referenzwerten.") },
        { type: "callout", reading: true, text: x(
          "In a hot week, the worker most at risk may be the new one, or the one back from leave.",
          "Në një javë të nxehtë, punëtori më në rrezik mund të jetë i riu, ose ai që sapo u kthye nga pushimet.",
          "In einer heißen Woche ist vielleicht der oder die Neue am stärksten gefährdet, oder wer gerade aus dem Urlaub kommt.") },
      ],
      note: x(
        "EU-OSHA's recommended maximum share of usual time in the heat, a guide, not a measurement. The meta-analysis (22 studies, almost 22 million injuries) is as the ILO reports it; we did not read it.",
        "Pjesa maksimale e rekomanduar e kohës së zakonshme në nxehtësi sipas EU-OSHA-s, udhëzim, jo matje. Meta-analiza (22 studime, gati 22 milionë lëndime) është siç e jep ILO-ja; nuk e lexuam.",
        "Von EU-OSHA empfohlener Höchstanteil der üblichen Zeit in der Hitze, eine Richtschnur, keine Messung. Die Metaanalyse (22 Studien, fast 22 Millionen Unfälle) wie von der ILO berichtet; wir haben sie nicht gelesen."),
      source: ["heat-euosha-2023", "heat-ilo-2024"],
    },
    {
      id: "model",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("26, 30, 35:", "26, 30, 35:", "26, 30, 35:"), x("the German steps", "shkallët gjermane", "die deutschen Stufen")],
      lead: x(
        "Germany's workplace rule on room temperature, ASR A3.5, last amended in 2022, says the air in work rooms should not exceed 26 °C. When the outside air is above 26 °C and sun protection is in place, duties rise in steps.",
        "Rregulli gjerman për temperaturën e ambienteve të punës, ASR A3.5, i ndryshuar së fundi më 2022, thotë se ajri në dhomat e punës nuk duhet të kalojë 26 °C. Kur ajri jashtë është mbi 26 °C dhe mbrojtja nga dielli është vendosur, detyrimet rriten me shkallë.",
        "Die Arbeitsstättenregel ASR A3.5 „Raumtemperatur“, zuletzt 2022 geändert, sagt: Die Lufttemperatur in Arbeitsräumen soll 26 °C nicht überschreiten. Liegt die Außenluft über 26 °C und ist Sonnenschutz vorhanden, steigen die Pflichten in Stufen."),
      blocks: [
        { type: "steps", items: [
          { h: x("Above 26 °C: should", "Mbi 26 °C: duhet", "Über 26 °C: soll"), p: x("Extra measures such as blinds kept shut, night cooling, flexitime, looser dress rules, fans; drinks should be provided. Heavy work, protective clothing or vulnerable staff call for a fresh assessment.", "Masa shtesë si grilat e mbyllura, freskimi natën, orari fleksibël, rregulla më të lira veshjeje, ventilatorët; pijet duhet të ofrohen. Puna e rëndë, veshja mbrojtëse ose punonjësit e cenueshëm kërkojnë vlerësim të ri.", "Zusätzliche Maßnahmen wie geschlossene Jalousien, Nachtauskühlung, Gleitzeit, lockerere Kleiderregeln, Ventilatoren; Getränke sollen bereitstehen. Schwere Arbeit, Schutzkleidung oder besonders Schutzbedürftige verlangen eine angepasste Beurteilung.") },
          { h: x("Above 30 °C: must", "Mbi 30 °C: detyrohet", "Über 30 °C: muss"), p: x("Effective measures under the risk assessment; technical and organisational ones come before personal ones. Drinks must be provided.", "Masa efektive sipas vlerësimit të rrezikut; ato teknike dhe organizative vijnë para atyre personale. Pijet duhet të ofrohen patjetër.", "Wirksame Maßnahmen nach der Gefährdungsbeurteilung; technische und organisatorische gehen personenbezogenen vor. Getränke müssen bereitstehen.") },
          { h: x("Above 35 °C: not a work room", "Mbi 35 °C: jo dhomë pune", "Über 35 °C: kein Arbeitsraum"), p: x("Without measures as for heat work, such as air showers, cooling phases or heat-protective clothing, the room is not suitable for work while it lasts.", "Pa masa si për punën në nxehtësi, si dushet e ajrit, fazat e freskimit ose veshja mbrojtëse nga nxehtësia, dhoma nuk është e përshtatshme për punë sa zgjat kjo.", "Ohne Maßnahmen wie bei Hitzearbeit, etwa Luftduschen, Entwärmungsphasen oder Hitzeschutzkleidung, ist der Raum für diese Zeit nicht als Arbeitsraum geeignet.") },
        ] },
        { type: "callout", reading: true, text: x(
          "At 30 °C “should” becomes “must”. A thermometer read only after complaints finds the step late.",
          "Te 30 °C “duhet” bëhet “detyrohet”. Një termometër që lexohet vetëm pas ankesave e gjen shkallën vonë.",
          "Bei 30 °C wird aus „soll“ ein „muss“. Ein Thermometer, das erst nach Beschwerden abgelesen wird, findet die Stufe zu spät.") },
      ],
      note: x(
        "ASR A3.5, sections 4.2 and 4.4, in our words; it applies in Germany. The ILO lists other limits, such as 27–31 °C by work intensity in Hungary and 28 °C in Latvia and Slovenia. The risk matrix is in No. 28.",
        "ASR A3.5, pikat 4.2 dhe 4.4, me fjalët tona; vlen në Gjermani. ILO-ja rendit kufij të tjerë, si 27–31 °C sipas intensitetit të punës në Hungari dhe 28 °C në Letoni dhe Slloveni. Matrica e rrezikut është te Nr. 28.",
        "ASR A3.5, Punkte 4.2 und 4.4, in unseren Worten; sie gilt in Deutschland. Die ILO nennt andere Grenzen, etwa 27–31 °C je nach Arbeitsschwere in Ungarn und 28 °C in Lettland und Slowenien. Die Risikomatrix steht in Nr. 28."),
      source: ["heat-asr-a35", "heat-ilo-2024"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie es gemessen wird"),
      title: [x("Measured where", "E matur aty", "Gemessen, wo"), x("people work", "ku punojnë njerëzit", "Menschen arbeiten")],
      lead: x(
        "ASR A3.5 says how: the air temperature, with a thermometer shielded from radiation and accurate to ±0.5 °C, read hourly where needed.",
        "ASR A3.5 thotë si: temperatura e ajrit, me një termometër të mbrojtur nga rrezatimi dhe me saktësi ±0,5 °C, e lexuar çdo orë kur duhet.",
        "Die ASR A3.5 sagt, wie: die Lufttemperatur, mit einem strahlungsgeschützten Thermometer auf ±0,5 °C genau, nach Erfordernis stündlich."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("At the workplace", "Te vendi i punës", "Am Arbeitsplatz"), p: x("0.6 m above the floor for seated work, 1.1 m for standing work.", "0,6 m mbi dysheme për punën ulur, 1,1 m për punën në këmbë.", "0,6 m über dem Boden bei sitzender, 1,1 m bei stehender Tätigkeit.") },
          { h: x("Outside", "Jashtë", "Draußen"), p: x("Hourly during working time, out of direct sun, about 4 m from the wall and 2 m high.", "Çdo orë gjatë punës, larg diellit të drejtpërdrejtë, rreth 4 m nga muri dhe 2 m lart.", "Stündlich während der Arbeitszeit, ohne direkte Sonne, etwa 4 m von der Wand und in 2 m Höhe.") },
          { h: x("Humidity and radiant heat", "Lagështia dhe nxehtësia rrezatuese", "Feuchte und Wärmestrahlung"), p: x("Where they are high, they are judged too, alone or in a combined index; EU-OSHA names the WBGT.", "Kur janë të larta, vlerësohen edhe ato, më vete ose në një tregues të përbërë; EU-OSHA përmend WBGT-në.", "Wo sie hoch sind, werden sie mitbewertet, einzeln oder in einem Klimasummenmaß; EU-OSHA nennt den WBGT.") },
        ] },
        { type: "line", min: 0, max: 60, height: 100, unit: "%", source: ["heat-asr-a35"],
          label: x("Highest relative humidity when cooling adds moisture (2022)", "Lagështia relative më e lartë kur freskimi shton lagështi (2022)", "Höchste relative Luftfeuchte, wenn Kühlung Feuchte zufügt (2022)"),
          points: [
            { k: "26 °C", v: 55, n: pc(55) },
            { k: "28 °C", v: 50, n: pc(50) },
            { k: "30 °C", v: 44, n: pc(44) },
            { k: "32 °C", v: 39, n: pc(39) },
            { k: "35 °C", v: 33, n: pc(33) },
          ] },
        { type: "callout", reading: true, text: x(
          "Cooling that adds moisture can trade one strain for another. The line marks where that trade stops.",
          "Freskimi që shton lagështi mund ta ndërrojë një lodhje me një tjetër. Vija tregon ku ndalet ky shkëmbim.",
          "Kühlung, die Feuchte zufügt, kann eine Belastung gegen eine andere tauschen. Die Linie zeigt, wo dieser Tausch endet.") },
      ],
      note: x(
        "The line is table 5 of ASR A3.5, the limit for cooling that raises humidity (about 11.5 g of water per kg of dry air); not a comfort range. Measuring rules from section 4.1.",
        "Vija është tabela 5 e ASR A3.5, kufiri për freskimin që rrit lagështinë (rreth 11,5 g ujë për kg ajër të thatë); jo zonë rehatie. Rregullat e matjes nga pika 4.1.",
        "Die Linie ist Tabelle 5 der ASR A3.5, die Grenze für Kühlung, die die Feuchte erhöht (rund 11,5 g Wasser je kg trockener Luft); kein Behaglichkeitsbereich. Messregeln aus Punkt 4.1."),
      source: ["heat-asr-a35", "heat-euosha-2023"],
    },
    {
      id: "tool", tool: "/tools/risk-assessment/", more: "ten-minutes-before-the-shift",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The hot", "Karta e turnit", "Die Karte für die"), x("shift card", "të nxehtë", "heiße Schicht")],
      lead: x(
        "One card per area and hot day, filled in before the shift and read out in the briefing, where today's risk is named. The full assessment of each work area belongs in Risk Assessment.",
        "Një kartë për çdo zonë dhe ditë të nxehtë, e plotësuar para turnit dhe e lexuar në brifing, aty ku emërtohet rreziku i ditës. Vlerësimi i plotë i çdo zone pune shkon te Risk Assessment.",
        "Eine Karte pro Bereich und heißem Tag, vor der Schicht ausgefüllt und im Briefing vorgelesen, dort, wo das Risiko des Tages benannt wird. Die vollständige Beurteilung jedes Bereichs gehört in Risk Assessment."),
      blocks: [
        { type: "form", items: [
          { h: x("Area and reading", "Zona dhe matja", "Bereich und Messung"), hint: x("forecast outside, room reading at 1.1 m, time of reading", "parashikimi jashtë, matja në dhomë në 1,1 m, ora e matjes", "Prognose draußen, Raumwert in 1,1 m, Uhrzeit der Messung") },
          { h: x("Step and measures", "Shkalla dhe masat", "Stufe und Maßnahmen"), hint: x("above 26, 30 or 35 °C; blinds, air, fans, cooler hours in place", "mbi 26, 30 apo 35 °C; grila, ajrim, ventilatorë, orë më të freskëta", "über 26, 30 oder 35 °C; Jalousien, Lüftung, Ventilatoren, kühlere Zeiten") },
          { h: x("Water", "Uji", "Wasser"), hint: x("where, how cool, who refills; one cup per person", "ku, sa i freskët, kush e mbush; një gotë për person", "wo, wie kühl, wer nachfüllt; ein Becher pro Person") },
          { h: x("Pace and breaks", "Ritmi dhe pushimet", "Tempo und Pausen"), hint: x("heavy tasks moved to cooler hours, rotation, a cool place to rest, targets eased", "punët e rënda në orë më të freskëta, rotacion, vend i freskët pushimi, objektiva më të lehta", "schwere Arbeit in kühlere Stunden, Rotation, ein kühler Pausenort, Ziele gesenkt") },
          { h: x("Who needs more care", "Kush ka nevojë për më shumë kujdes", "Wer mehr Aufmerksamkeit braucht"), hint: x("new or returning staff, protective clothing, pregnancy, age, alone in a van", "të rinjtë ose të kthyerit, veshja mbrojtëse, shtatzënia, mosha, vetëm në furgon", "Neue oder Rückkehrende, Schutzkleidung, Schwangerschaft, Alter, allein im Wagen") },
          { h: x("Buddy and first aid", "Shoku dhe ndihma e parë", "Buddy und Erste Hilfe"), hint: x("who watches whom, who is trained on this shift, call 112, how drivers check in", "kush vëzhgon kë, kush është i trajnuar në këtë turn, thirr 112, si lajmërohen shoferët", "wer auf wen achtet, wer in dieser Schicht ausgebildet ist, 112 rufen, wie sich Fahrer melden"), lines: 2 },
        ] },
      ],
      note: x(
        "This card is the editors' proposal, built on ASR A3.5, EU-OSHA (2023) and the ILO (2024). EU-OSHA warns that moving work into night hours brings risks of its own; night work is in No. 45, mental health in No. 75.",
        "Kjo kartë është propozim i redaksisë, i ndërtuar mbi ASR A3.5, EU-OSHA-n (2023) dhe ILO-n (2024). EU-OSHA paralajmëron se zhvendosja e punës në orët e natës sjell rreziqe të vetat; puna natën është te Nr. 45, shëndeti mendor te Nr. 75.",
        "Diese Karte ist ein Vorschlag der Redaktion, gestützt auf ASR A3.5, EU-OSHA (2023) und die ILO (2024). EU-OSHA warnt, dass Arbeit in den Nachtstunden eigene Risiken bringt; Nachtarbeit steht in Nr. 45, psychische Gesundheit in Nr. 75."),
      source: ["heat-asr-a35", "heat-euosha-2023", "heat-ilo-2024"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
