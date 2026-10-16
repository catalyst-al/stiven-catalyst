---
title: 'Një ditë e keqe apo një problem?'
date: 2026-10-10T18:00:00Z
category: Operacione
series: improvement
status: published
featured: true
summary: Një ditë e keqe është sinjal për të kontrolluar. Nuk është automatikisht provë se i gjithë procesi duhet ndryshuar.
teaser: Në një raport të qershorit 2025, Delay ishte 2,8%. Ditë e keqe apo problem? Nga përgjigjja varet nëse e ndryshon procesin, dhe vetëm numri nuk ta jep.
description: "Një ditë me KPI të këqija: pse një numër i vetëm nuk tregon nëse procesi ndryshoi, dy gabimet e kundërta, dhe katër pyetje para se të ndryshosh procesin."
deck: 'Eseja e pestë e serisë “Përmirësimi që mbahet”: si i ndiqnim KPI-të çdo ditë, pse një numër i vetëm nuk tregon nëse procesi ka ndryshuar, dy gabimet e kundërta, kur ndërhyn menjëherë, dhe katër pyetje para se të ndryshosh procesin.'
relatedTools:
  - /tools/sigma-control-chart/
  - /tools/delay-analyzer/
checklist:
  title: Para se të ndryshosh procesin
  fill: true
  note: Fletë orientuese, si do ta bëja sot, jo një metodë që e kam përdorur në mënyrë të dokumentuar.
  items:
    - label: A ka një problem të menjëhershëm sigurie ose shërbimi?
      hint: Nëse po, ndërhyn tani. Analiza vjen më pas.
    - label: Si krahasohet dita me volumin, me kushtet dhe me ditët e mëparshme?
      hint: Sa punë kishte, çfarë ndodhi atë ditë, si ishin ditët para saj.
    - label: Është përjashtim apo pjesë e një tendence?
      hint: Një ditë jashtë zakonit, apo disa ditë me radhë në të njëjtin drejtim?
    - label: A kemi gjetur një shkak konkret?
      hint: Para se të ndryshojmë procesin, jo pas.
# Three moves for tomorrow's shift, shown before the text.
firstMove:
  - Para se të ndryshosh një rregull, vendose numrin e sotëm pranë dhjetë ditëve të fundit.
  - Kontrollo së pari nëse ka një problem të menjëhershëm sigurie ose shërbimi. Nëse po, vepro tani.
  - Emërto një shkak konkret para se ta prekësh procesin.
# The picture of the system in this essay (lib/diagrams.js); the "{diagram}" paragraph in the text marks its place.
diagram: three-layers
---

2,8%.

Kaq ishte Delay në një raport të qershorit 2025. Ishte një ditë e keqe, apo kishte ndryshuar diçka në proces? Vetëm numri nuk ta thotë.

Në last mile ndiqnim çdo ditë Delay, Damage, Incomplete dhe Loading Time. Rezultatet diskutoheshin në daily stand-up, çdo devijim duhej shpjeguar, dhe shifrat i analizonim edhe sipas DSP-ve dhe sipas problemeve operative. Mbi këtë rutinë mbështetet kjo ese. Nuk mund ta rindërtoj, nga ana tjetër, si zgjidhnim mes pritjes dhe ndërhyrjes: nëse e linim një rezultat të përsëritej para se të ndërhynim, nëse ndiqnim trendet ditore ose javore në Excel apo Power BI, nëse kam përdorur vetë një kartë kontrolli statistikore me kufij kontrolli. Metoda që vijon është mënyra si do ta lexoja sot një ditë të keqe.

## Një numër pa histori

2,8% më vete thotë pak. Krahasuar me çfarë?

Le të marrim një shembull të shpikur. Supozojmë se mesatarja e javëve të fundit ishte 2,5%. A është 2,8% sinjal?

Varet. Çdo proces luhatet. Asnjë ditë nuk del njësoj si tjetra, edhe kur askush nuk ka ndryshuar asgjë: ndryshon volumi, ndryshojnë njerëzit, ndryshojnë rrugët. Pyetja nuk është nëse sot është më keq se mesatarja. Shumë ditë do të jenë të tilla. Pyetja është nëse sot është më keq se sa luhatet zakonisht ky proces.

Mbi këtë ide ngrihet karta e kontrollit. Ajo i vendos ditët njëra pas tjetrës, bashkë me mesataren dhe me dy kufij që tregojnë sa larg luhatet zakonisht procesi. Një ditë brenda kufijve ka shumë gjasa të jetë luhatje e zakonshme. Një ditë jashtë tyre, ose disa ditë me radhë në të njëjtën anë të mesatares, tregon se diçka mund të ketë ndryshuar.

## Dy gabimet e kundërta

Një ditë e keqe mund të lexohet gabim në dy mënyra të kundërta. Ajo që vijon është mendimi im, jo raste që mund t'i dokumentoj.

Gabimi i parë e trajton çdo ditë të keqe si problem. Ndryshohet një rregull, shtohet një kontroll, thirret një mbledhje. Të nesërmen numri kthehet në normë, dhe duket sikur masa dha efekt. Por ndoshta do të ishte kthyer vetë, dhe tani procesi ka një rregull më shumë, që askush nuk e di pse ekziston.

**Nëse ndryshojmë rregullat pas çdo luhatjeje, rrezikojmë të krijojmë më shumë paqëndrueshmëri sesa përmirësim.**

Gabimi i dytë është e kundërta. Asnjë ditë nuk duket aq e keqe sa të reagosh, sepse secila është vetëm pak më keq se e djeshmja. Numri ngjitet ngadalë, dhe askush nuk e vë re, sepse askush nuk i shikon ditët bashkë.

Karta e kontrollit ndihmon në të dyja rastet. Të qetëson kur dita mbetet brenda luhatjes së zakonshme, dhe të zgjon kur disa ditë me radhë shkojnë në të njëjtin drejtim, edhe pse asnjëra prej tyre nuk duket alarmante më vete.

## Kur ndërhyn menjëherë

Kjo nuk do të thotë të presësh çdo herë statistikën. Një menaxher duhet të dijë kur të ndërhyjë menjëherë dhe kur të mbledhë më shumë informacion.

Një ditë me shumë vonesa meriton vëmendje, por jo çdo devijim kërkon një procedurë të re. Këshilla ime do të ishte të mos ngatërrosh një rezultat të keq me provën se procesi ka ndryshuar, dhe të kontrollosh tri gjëra.

E para: a ka një problem të menjëhershëm sigurie ose shërbimi? Nëse po, ndërhyn tani. Një klient që pret ose një rrezik në rampë nuk presin derisa të mblidhen pesë pika në grafik.

E dyta: a është rezultati përjashtim apo pjesë e një tendence?

E treta: a e kemi gjetur një shkak konkret para se të ndryshojmë procesin?

## Volumi, moti dhe procesi

Në last mile ndiqnim shkaqe operative: çanta që mungonin, karroca të përziera, vonesa në përgatitje, probleme gjatë ngarkimit. Nuk di për ndonjë metodë të dokumentuar me të cilën ta ndanim ndikimin e motit dhe të volumit nga një problem i procesit.

Sot, para se të përcaktoja shkakun, do ta krahasoja rezultatin me volumin e punës, me kushtet e ditës dhe me të dhënat e ditëve të mëparshme. 2,8% vonesa në një ditë me volum të jashtëzakonshëm nuk do të thotë e njëjta gjë si 2,8% në një ditë të zakonshme.

{diagram}

## Tri shtresa

**KPI-ja tregon çfarë ndodhi. Trendi ndihmon të kuptojmë nëse po ndryshon diçka. Analiza e procesit na ndihmon të vendosim çfarë duhet bërë.**

Shumë operacione kalojnë drejt e nga shtresa e parë te e treta: numri del keq dhe menjëherë kërkohet një masë. Shtresa e mesme, ajo që tregon nëse kjo ditë ndryshon nga të tjerat, është ajo që mungon më shpesh.

Një ditë e keqe është sinjal për të kontrolluar, jo automatikisht provë se i gjithë procesi duhet ndryshuar. [Sigma dhe karta e kontrollit](/sq/tools/sigma-control-chart/) e vizaton shtresën e mesme për ditët ose javët e tua dhe shpjegon çfarë është sinjal e çfarë jo. Para se të ndryshosh një rregull, plotëso fletën më poshtë dhe kopjoje.
