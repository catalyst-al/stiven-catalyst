---
title: Kur tabela skuqet para teje
date: 2026-10-13T16:00:00Z
category: Operacione
series: the-system
status: published
featured: true
summary: "Një numër i kuq në ekran është një sinjal për të kontrolluar, jo një diagnozë. Pyet çfarë mat dhe sa i vjetër është para se të veprosh mbi të."
teaser: E kuqja në ekranin tënd është sinjal, jo diagnozë. Pyet çfarë mat dhe sa e vjetër është para se të veprosh.
description: "Pse një numër i kuq në tabelë ka një moshë, katër hapat mes terrenit dhe ekranit, tri reagimet e gabuara dhe një kartelë për numrin tënd të kuq."
deck: "Eseja e dytë e serisë “Sistemi është më i shpejtë se ti”: pse një numër i kuq është sinjal dhe jo diagnozë, tri reagimet e gabuara ndaj një të kuqeje, katër hapa mes alarmit dhe vendimit, si dhe një kartelë për numrin tënd të kuq."
relatedTools:
  - /tools/shift-pulse/
  - /tools/delay-analyzer/
  - /tools/cx-control-tower/
checklist:
  title: Numri im i kuq
  fill: true
  note: "Një kartelë për çdo numër që ndjek në një ekran. Plotësoje para turnit, jo gjatë të kuqes."
  items:
    - label: "Cili numër është, çfarë mat saktësisht dhe cili është objektivi i tij?"
      hint: "Delay, Loading Time, Incomplete, Damage, dhoma të hapura, koha e pritjes. Një për kartelë."
    - label: "Sa i vjetër është kur e shoh?"
      hint: "Koha mes terrenit dhe ekranit: sekonda, minuta, mëngjesi tjetër? Nëse nuk e di, mësoje sot."
    - label: "Çfarë di me siguri dhe çfarë më është raportuar?"
      hint: "Numri është një raport. Çfarë ka parë dikush me sytë e vet? A është problemi ende i hapur?"
    - label: "Kush e ka informacionin më të afërt me situatën?"
      hint: "Një emër ose një rol për çdo zonë. Shkruaje tani, mos e kërko kur ekrani është i kuq."
    - label: "Brenda rolit tim, apo eskalim? Dhe me çfarë informacioni?"
      hint: "Kufiri i vendimit tim dhe tri faktet që i duhen nivelit tjetër."
    - label: "Çfarë nuk pret verifikimin?"
      hint: "Rreziqet e menjëhershme të sigurisë: njoftohen menjëherë, analiza vjen pas."
# Three moves for tomorrow's shift, shown before the text.
firstMove:
  - "Për çdo numër që ndjek në një ekran, merr vesh çfarë mat saktësisht dhe sa i vjetër është kur e sheh, dhe shkruaje pranë tij."
  - "Vendos para turnit katër hapat pas një të kuqeje: çfarë mat dhe kur u përditësua, a është ende e hapur, kë pyet, brenda rolit apo lart."
  - "Një herë në javë, shiko të kuqet që nuk çuan në asnjë veprim. Nëse janë shumica, alarmi duhet rishikuar mbi bazën e të dhënave; një prag më i lartë nuk mjafton."
# The picture of the system in this essay (lib/diagrams.js); the "{diagram}" paragraph in the text marks its place.
diagram: dashboard-lag
---

Te [Sistemi është më i shpejtë se ti](/sq/insights/the-system-is-faster-than-you/) shkrova se sistemi vendos i pari dhe përgjegjësia në turn mbetet prapë jotja. Kjo ese merret me momentin që ndodh më shpesh: ende nuk është vendosur asgjë, por një numër në ekran është skuqur dhe të gjithë presin të shohin çfarë do të bësh.

Që nga 1 janari 2026 punoj me kohë të pjesshme si Last Mile Dispatcher, në distancë, dhe koordinoj 80+ automjete dhe 100+ shoferë. Çfarë i bën kjo një menaxheri e kam shkruar te [Të drejtosh 80+ automjete që nuk i sheh](/sq/insights/80-vehicles-you-cannot-see/). Nga larg nuk mund të shkosh te rampa për të parë çfarë fshihet pas një numri. Mbështetesh në informacionin që të vjen nga sistemi dhe nga njerëzit në terren, dhe të dy burimet vijnë gjithmonë pak pas asaj që po ndodh.

Ajo që vijon mbështetet në këtë rol në distancë; në përvojën time të mëparshme në last mile, ku punoja çdo ditë me Delay, Damage, Incomplete dhe Loading Time; dhe në një model demonstrues që e kam ndërtuar vetë, [Last-Mile CX Control Tower](/sq/tools/cx-control-tower/), me tregues për nisjet, vonesat, ngarkimin dhe incidentet. Është demonstrim, jo sistemi i ndonjë kompanie. Nuk e di listën e saktë të treguesve që shfaq sistemi i punës sime aktuale, dhe nuk kam asnjë rast të dokumentuar ku një numër u skuq, unë reagova dhe e di si përfundoi, as ndonjë prag apo objektiv që kam kërkuar ta ndryshoj. Prandaj kjo është analiza ime dhe mënyra si do të veproja sot, jo një protokoll që e kam ndjekur.

## Mes terrenit dhe të kuqes

Përfytyro një furgon që duhej të ishte nisur nga rampa dhjetë minuta më parë. Në tabelë rruga e tij është e kuqe. Çfarë duhej të ndodhte që ajo të skuqej?

Dikush duhej të shihte që furgoni është ende aty, ose deri në një orë të caktuar duhej të mungonte një skanim. Dikush ose diçka duhej ta raportonte. Sistemi duhej ta krahasonte me objektivin, me ritmin e vet. Pastaj ekrani yt duhej ta vizatonte. Janë katër hapa, secili me vonesën e vet. Sa e madhe është kjo vonesë ndryshon nga një sistem te tjetri, dhe për timin nuk e di nëse të dhënat përditësohen në sekonda, në minuta apo më vonë. Pikërisht prandaj kjo është pyetja e parë.

{diagram}

**Një numër i kuq nuk është terreni. Është një raport për terrenin, dhe një raport ka një moshë.**

Kur e sheh të kuqen, furgoni mund të jetë nisur tashmë. Ose mund të jetë ende aty, dhe e kuqja është gjëja e parë e vërtetë që dëgjon sot. Nga ngjyra nuk i dallon dot të dyja rastet. I dallon vetëm nëse di çfarë mat numri dhe sa i vjetër është.

## Të dyja ngjyrat mund të mashtrojnë

E njëjta logjikë vlen në të dy drejtimet. Një e kuqe mund të përshkruajë një problem që është zgjidhur ndërkohë. Një e gjelbër mund ta përshkruajë terrenin siç ishte para se diçka të fillonte të shkonte keq, ose të masë diçka tjetër nga ajo që mendon ti.

Prandaj pyetja që duhet bërë është çfarë mat ky numër, kur u përditësua dhe çfarë po ndodh tani. Ngjyra të tregon ku të shikosh dhe vendimin ta lë ty.

## Tri reagime të gabuara

Kushdo që ka ndenjur para një tabele i njeh tri reagime ndaj një numri të kuq. Janë modele, jo raste që i kam të dokumentuara.

**Të telefonosh menjëherë.** Numri skuqet dhe telefoni është në dorën tënde para se të kesh menduar. Personi që përgjigjet mund të jetë në mes të zgjidhjes së pikërisht asaj gjëje, dhe tani duhet të ndalet për të ta shpjeguar ty. Ke reaguar ndaj një situate që mund të mos ekzistojë më, dhe për këtë ke hequr një palë duar nga problemi.

**Ta shpërfillësh.** “Në këtë orë është gjithmonë e kuqe.” Një alarm që përsëritet vazhdimisht pa informacion të dobishëm rrezikon ta humbasë kuptimin, dhe ditën kur e kuqja do të thotë diçka, askush nuk e shikon. Te [Një ditë e keqe apo një problem?](/sq/insights/a-bad-day-or-a-problem/) shkrova për shtresën që e kapërcejnë shumica e operacioneve: atë që tregon nëse sot është ndryshe nga dhjetë ditët e fundit. Një e kuqe që e shpërfill nga zakoni është një e kuqe pa histori.

**Ta çosh lart ashtu të kuqe.** Numri dërgohet një nivel më lart, i kuq dhe i zhveshur. Ky është gabimi i tretë te [Kur ta zgjidhësh vetë dhe kur ta çosh lart](/sq/insights/solve-it-or-escalate-it/): eskalimi pa informacion. Problemi nuk iu afrua aspak zgjidhjes; vetëm përfundoi te dikush që tani duhet të bëjë pyetjet që mund t'i kishe bërë vetë.

## Katër hapa para vendimit

Të trija kanë të përbashkët që reagimi vendoset ndërsa ekrani është i kuq, dhe ky është momenti më i keq për të vendosur çfarëdo. Momenti i duhur është para turnit. Ky është rendi që do të rekomandoja:

1. **Kontrolloj çfarë mat treguesi dhe kur është përditësuar.** Pa këtë, nuk e di nëse po shoh të tashmen apo të shkuarën.
2. **Verifikoj nëse problemi është real dhe ende i hapur.** Numri është një raport, dhe dikush duhet ta konfirmojë.
3. **Kontaktoj personin që ka informacionin më të afërt me situatën.** Ai që është më afër faktit, i cili nuk është gjithmonë ai që më vjen i pari ndër mend.
4. **Përcaktoj nëse zgjidhet brenda rolit tim apo kërkon eskalim.** Nëse shkon lart, faktet shkojnë bashkë me të, jo vetëm ngjyra.

Një përjashtim: për një rrezik të menjëhershëm sigurie nuk pres analizën e plotë. Njoftoj menjëherë, dhe verifikimi vjen pas.

Kur këto katër hapa janë vendosur para turnit, minutat e para pas një të kuqeje bëhen rutinë në vend të vendimit. Ngjyra e kuqe është atëherë ajo që duhet të jetë: një sinjal për të kontrolluar, jo diagnozë.

## Alarmi, një herë në javë

Edhe diçka, më shumë për fundin e javës sesa për turnin. Shiko të kuqet që nuk çuan në asnjë veprim, sepse kur i kontrollove ishin zgjidhur tashmë ose nuk ishin fare probleme. Nëse janë shumica, alarmi po i mëson të gjithë ta shpërfillin.

Një prag i ngritur pa të dhëna, vetëm që ekrani të duket më mirë, i fsheh të kuqet e padobishme bashkë me ato që kishin rëndësi. Alarmi rishikohet mbi bazën e të dhënave: sa të kuqe pati, sa prej tyre kërkuan veprim dhe çfarë kishin të përbashkët ato. Ky numërim është edhe argumenti më i mirë që mund t'u çosh atyre që e caktojnë alarmin. Në vend të “tabela gabon”, thuaju sa të kuqe pati këtë javë dhe sa prej tyre kërkuan diçka.

## Numri im i kuq

Kartela më poshtë ka një rresht për çdo numër që ndjek në një ekran. Plotësoje para turnit. [Shift Pulse](/sq/tools/shift-pulse/) i vendos numrat e javës krah njëri-tjetrit, që një ditë e kuqe të ketë pranë dhjetë ditë histori para se të vendosësh çfarë do të thotë.

**Një numër i kuq të thotë ku të shikosh. Nuk të thotë çfarë ka aty tani. Distanca mes të dyjave është mosha e numrit, dhe ta njohësh atë është puna jote.**
