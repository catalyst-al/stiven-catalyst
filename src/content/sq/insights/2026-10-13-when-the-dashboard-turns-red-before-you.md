---
title: Kur tabela skuqet para teje
date: 2026-10-13T16:00:00Z
category: Operacione
series: the-system
status: published
featured: true
summary: "Një numër i kuq në ekran është një sinjal për të kontrolluar, jo një diagnozë. Pyet çfarë mat dhe sa i vjetër është para se të veprosh mbi të."
teaser: E kuqja në ekranin tënd është sinjal, jo diagnozë. Pyet çfarë mat dhe sa e vjetër është para se të veprosh.
description: "Pse një numër i kuq në tabelë ka një moshë, katër hapat mes sallës dhe ekranit, tri reagimet e gabuara ndaj një të kuqeje, katër hapa para çdo vendimi, dhe një kartelë për numrin tënd të kuq."
deck: "Eseja e dytë e serisë “Sistemi është më i shpejtë se ti”: pse një numër i kuq është sinjal dhe jo diagnozë, tri reagimet e gabuara ndaj një të kuqeje, katër hapa mes alarmit dhe vendimit, dhe një kartelë për numrin tënd të kuq."
relatedTools:
  - /tools/shift-pulse/
  - /tools/delay-analyzer/
  - /tools/cx-control-tower/
checklist:
  title: Numri im i kuq
  fill: true
  note: "Një kartelë për çdo numër që ndjek në një ekran. Plotësoje para turnit, jo gjatë të kuqes."
  items:
    - label: "Cili numër është, çfarë mat saktësisht, dhe cili është objektivi i tij?"
      hint: "Delay, Loading Time, Incomplete, Damage, dhoma të hapura, koha e pritjes. Një për kartelë."
    - label: "Sa i vjetër është kur e shoh?"
      hint: "Koha mes sallës dhe ekranit: sekonda, minuta, mëngjesi tjetër? Nëse nuk e di, mësoje sot."
    - label: "Çfarë di me siguri, dhe çfarë më është raportuar?"
      hint: "Numri është një raport. Çfarë ka parë dikush me sytë e vet? A është problemi ende i hapur?"
    - label: "Kush e ka informacionin më të afërt me situatën?"
      hint: "Një emër ose një rol për çdo zonë. I shkruar tani, jo i kërkuar kur ekrani është i kuq."
    - label: "Brenda rolit tim, apo eskalim? Dhe me çfarë informacioni?"
      hint: "Kufiri i vendimit tim, dhe tri faktet që i duhen nivelit tjetër."
    - label: "Çfarë nuk pret verifikimin?"
      hint: "Rreziqet e menjëhershme të sigurisë: njoftohen menjëherë, analiza vjen pas."
# Three moves for tomorrow's shift, shown before the text.
firstMove:
  - "Për çdo numër që ndjek në një ekran, mëso çfarë mat saktësisht dhe sa i vjetër është kur e sheh, dhe shkruaje pranë tij."
  - "Vendos para turnit katër hapat pas një të kuqeje: çfarë mat dhe kur u përditësua, a është ende e hapur, kë pyet, brenda rolit apo lart."
  - "Një herë në javë, shiko të kuqet që nuk çuan në asnjë veprim. Nëse janë shumica, alarmi duhet rishikuar mbi të dhënat, jo vetëm me një prag më të lartë."
# The picture of the system in this essay (lib/diagrams.js); the "{diagram}" paragraph in the text marks its place.
diagram: dashboard-lag
---

E kuqja në ekranin tënd është sinjal, jo diagnozë. Pyet çfarë mat dhe sa e vjetër është para se të veprosh.

Te [Sistemi është më i shpejtë se ti](/sq/insights/the-system-is-faster-than-you/) shkrova që sistemi vendos i pari dhe emri në turn mbetet i yti. Kjo ese është për momentin që ndodh më shpesh: ende nuk është vendosur asgjë, por një numër në ekran është skuqur, dhe të gjithë presin çfarë do të bësh.

Nga 1 janari 2026 punoj part-time si Last Mile Dispatcher, në distancë, me koordinimin e 80+ automjeteve dhe 100+ shoferëve. Çfarë i bën kjo një menaxheri e shkrova te [Të drejtosh 80+ automjete që nuk i sheh](/sq/insights/80-vehicles-you-cannot-see/). Nga distanca nuk mund të shkosh në rampë të shohësh çfarë ka prapa një numri. Mbështetesh te informacioni që të vjen nga sistemi dhe nga njerëzit në terren. Dhe të dy vijnë gjithmonë pak pas asaj që po ndodh.

## Çfarë kam dhe çfarë nuk kam

Ajo që kam: rolin në distancë, që nga janari 2026. Përvojën e mëparshme në last mile, ku punoja çdo ditë me Delay, Damage, Incomplete dhe Loading Time. Dhe një model demonstrues që e kam ndërtuar vetë, [CX Control Tower](/sq/tools/cx-control-tower/), me tregues për nisjet, vonesat, ngarkimin dhe incidentet. Është demonstrim, jo sistemi i asnjë kompanie.

Ajo që nuk kam: listën e saktë të treguesve që shfaqen në sistemin e punës sime aktuale. Sa shpejt përditësohen të dhënat, në sekonda, minuta apo më vonë: nuk e di. Një rast të dokumentuar ku një numër u skuq, unë reagova dhe e di si mbaroi: nuk e kam. As një prag apo objektiv që kam kërkuar ta ndryshoj.

Pra kjo ese është analiza ime dhe mënyra si do ta bëja sot, jo një protokoll që e kam ndjekur. Skena në të është një figurë, dhe e shënoj si të tillë.

## Katër hapa mes sallës dhe të kuqes

Përfytyro një furgon që duhej të ishte nisur nga rampa dhjetë minuta më parë. Në tabelë rruga është e kuqe. Çfarë duhej të ndodhte që të ishte e kuqe?

Dikush duhej të shihte që furgoni është ende aty, ose një skanim duhej të mungonte deri në një orë të caktuar. Dikush ose diçka duhej ta raportonte. Sistemi duhej ta llogariste kundrejt objektivit, me ritmin e vet. Dhe pastaj ekrani yt duhej ta vizatonte. Katër hapa, secili me vonesën e vet. Sa e madhe është ajo vonesë ndryshon nga një sistem te tjetri, dhe për sistemin tim nuk e di. Pikërisht prandaj është pyetja e parë.

{diagram}

**Një numër i kuq nuk është salla. Është një raport për sallën, dhe një raport ka një moshë.**

Kur ti e sheh të kuqen, furgoni mund të jetë nisur. Ose mund të jetë ende aty, dhe e kuqja është gjëja e parë e vërtetë që ke dëgjuar sot. Nga ngjyra nuk i dallon dot të dyja. I dallon vetëm nëse di çfarë mat numri dhe sa i vjetër është.

## E kuqja nuk është gjithmonë urgjencë. Dhe e gjelbra nuk është gjithmonë garanci.

E njëjta logjikë vlen në të dy drejtimet. Një e kuqe mund të përshkruajë një problem që është zgjidhur ndërkohë. Një e gjelbër mund të përshkruajë sallën siç ishte para se diçka të fillonte të shkonte keq, ose të masë diçka tjetër nga ajo që mendon ti.

Prandaj pyetja nuk është “çfarë ngjyre ka”. Pyetja është “çfarë mat ky numër, kur u përditësua, dhe çfarë po ndodh realisht tani”. Ngjyra të thotë ku të shikosh. Nuk të thotë çfarë të vendosësh.

## Tri reagime të gabuara

Ka tri reagime ndaj një numri të kuq që i njeh kushdo që ka ndenjur para një tabele. Nuk janë raste që i kam të dokumentuara. Janë modele.

**Të telefonosh menjëherë.** Numri skuqet, telefoni është në dorën tënde para se të kesh menduar. Personi që merr telefonatën mund të jetë në mes të zgjidhjes së pikërisht asaj gjëje, dhe tani duhet të ndalet për të ta shpjeguar ty. Ke reaguar ndaj një situate që mund të mos ekzistojë më, dhe për këtë ke hequr një palë duar nga problemi.

**Ta injorosh.** “Në këtë orë është gjithmonë e kuqe.” Një alarm që përsëritet vazhdimisht pa informacion të dobishëm rrezikon të humbasë rëndësinë e vet. Dhe ditën që e kuqja do të thotë diçka, askush nuk shikon. Te [Një ditë e keqe apo një problem?](/sq/insights/a-bad-day-or-a-problem/) shkrova për shtresën që shumica e operacioneve e kapërcejnë: atë që thotë nëse sot është ndryshe nga dhjetë ditët e fundit. Një e kuqe që e injoron nga zakoni është një e kuqe pa histori.

**Ta kalosh më tej të kuqe.** Numri dërgohet një nivel më lart, i kuq dhe i zhveshur. Ky është gabimi i tretë nga [Kur ta zgjidhësh vetë dhe kur ta çosh lart](/sq/insights/solve-it-or-escalate-it/): eskalimi pa informacion. Problemi nuk ka lëvizur drejt një zgjidhjeje. Ka lëvizur vetëm te dikush që tani duhet të bëjë pyetjet që ti mund t'i kishe bërë vetë.

## Katër hapa para vendimit

Ajo që i bashkon të trija është se reagimi vendoset ndërsa ekrani është i kuq. Ky është momenti më i keq për të vendosur çfarëdo. Momenti i duhur është para turnit.

Nuk e kam të dokumentuar rendin që ndjek sot. Por ky është rendi që do të rekomandoja:

1. **Kontrolloj çfarë mat treguesi dhe kur është përditësuar.** Pa këtë, nuk di nëse po shoh të tashmen apo të shkuarën.
2. **Verifikoj nëse problemi është real dhe ende i hapur.** Numri është një raport. Dikush duhet ta konfirmojë.
3. **Kontaktoj personin që ka informacionin më të afërt me situatën.** Jo atë që më vjen i pari ndër mend, por atë që është më afër faktit.
4. **Përcaktoj nëse zgjidhet brenda rolit tim apo kërkon eskalim.** Dhe nëse shkon lart, shkon me faktet, jo vetëm me ngjyrën.

Një përjashtim: për një rrezik të menjëhershëm sigurie nuk pres analizën e plotë. Njoftoj menjëherë, dhe verifikimi vjen pas.

Kur këto katër hapa janë vendosur para turnit, minutat e para pas një të kuqeje nuk janë vendim. Janë rutinë.

**Ngjyra e kuqe është sinjal për të kontrolluar. Nuk është diagnozë.**

## Alarmi, një herë në javë

Edhe diçka, më shumë për fundin e javës sesa për turnin. Shiko të kuqet që nuk çuan në asnjë veprim, sepse kur i verifikove ishin zgjidhur tashmë ose nuk ishin probleme. Nëse janë shumica, alarmi po i stërvit të gjithë ta injorojnë.

Por zgjidhja nuk është thjesht ta ngresh pragun që ekrani të duket më mirë. Një prag i ngritur pa të dhëna fsheh të kuqet e padobishme bashkë me ato që kishin rëndësi. Alarmi rishikohet mbi bazën e të dhënave: sa të kuqe, sa prej tyre kërkonin veprim, dhe çfarë kishin të përbashkët ato që kërkonin. Ai numërim është edhe argumenti më i mirë që mund t'u çosh njerëzve që e vendosin alarmin. Jo “tabela është gabim”, por sa të kuqe ishin këtë javë dhe sa prej tyre kërkuan vërtet diçka.

## Numri im i kuq

Kartela më poshtë ka një rresht për çdo numër që ndjek në një ekran: çfarë mat, sa i vjetër është kur e sheh, çfarë di me siguri, kush e ka informacionin më të afërt, kur shkon lart, dhe çfarë nuk pret verifikimin. Plotësoje para turnit. [Shift Pulse](/sq/tools/shift-pulse/) i tregon numrat e javës pranë njëri-tjetrit, që një ditë e kuqe t'i ketë dhjetë ditët e historisë pranë para se të vendosësh çfarë do të thotë.

**Një numër i kuq të thotë ku të shikosh. Nuk të thotë çfarë ka aty tani. Distanca mes të dyjave është mosha e numrit, dhe ta dish atë është puna jote.**
