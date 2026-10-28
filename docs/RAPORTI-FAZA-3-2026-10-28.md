# Stiven Catalyst Tools, Faza 3: PowerTool End-to-End, piloti i parë

Data: 28 tetor 2026. Dega `feature/powertool-case-flow`, nga `main` `c21b30c9` (pas PR #364 dhe #366). Draft PR, pa
merge, pa deploy. Planetët, përmbajtja editoriale, Team Sync Worker dhe Cloudflare të paprekura. Çdo e dhënë në teste
është e stacionit shembull, e shpikur.

## 1. Çfarë ekzistonte në `main` (PARA)

Katër strukturat e kërkuara ishin aty, secila e plotë më vete, por të lidhura vetëm me tekst:

| Struktura | Çfarë kishte | Çfarë i mungonte rrjedhës |
| --- | --- | --- |
| CX Control Tower, Deep dive | Hetimi (`INV-YYYYMMDD-NNN`) me evidencë, pesë pse, shkak si hipotezë/i verifikuar, veprim, përgjegjës, afat, "metrikë verifikimi" dhe "rezultat verifikimi" si tekst; snapshot i periudhës (k/n, filtra, segment); veprimi vetëm në tabelën e stacionit; "Verified effective" ndalohej pa evidencë, shkak të verifikuar dhe rezultat të shkruar | KPI para/pas llogaritej nga njeriu dhe shkruhej si tekst; veprimi nuk shkonte te Action Tracker; pas "done" asgjë nuk ndryshonte në rast; rihapja ishte vetëm një vlerë e listës |
| Action Tracker (`sc-actions`) | Një listë për gjithë mjetet, status open/doing/done/verified, `check` dhe `result`, mbrojtje nga dublikatat (titull + burim), kujtesa, sinjale vonese | "Verified" vendosej me një klik pa rezultat; asnjë lidhje me rastin që e lindi |
| 5 Whys | Fletë pune; dërgon kundërmasën te handover (`?issue=`) dhe te tracker (`?action=&source=five-whys`) | Nuk dinte për cilin rast punonte; shkaku nuk kthehej te hetimi |
| Shift Handover | Çështje të hapura me përgjegjës/afat/bartje; lidhje te 5 Whys pas 3 bartjeve; merr `?issue=` një herë | Asnjë identifikues rasti |

Pa identifikues të përbashkët, "problemi i javës së kaluar" dhe "veprimi i javës së kaluar" ishin dy rreshta pa fije mes
tyre, dhe "Verified" ishte një fjalë, jo një numër.

## 2. Rrjedha pilot (PAS)

Një hetim i CX Control Tower është fija. Identifikuesi i tij `INV-…` udhëton në veprim, në fletën e 5 Whys dhe në
tekstin e çështjes së handover-it; asnjë kopje e dytë e punës nuk krijohet.

| Hapi | Ku | Çfarë ndodh |
| --- | --- | --- |
| Problem | Tower, Deep dive | Një dështim (p.sh. dëmtime), periudha e evidencës me filtrat; "Hetim i ri" |
| Evidencë | Tower | Snapshot i periudhës: metrika, nga–deri, partner/turn/zonë, segment, k/n; teksti i evidencës i detyrueshëm për mbyllje |
| Shkak | 5 Whys ↔ Tower | "Punoji pse-të në 5 Whys" hap fletën me problemin dhe `?case=`; fleta e emërton hetimin dhe "Dërgoje shkakun te hetimi" kthehet me `?case=&why1..5=&root=`; tower-i plotëson vetëm fushat bosh, ruan ato të shkruara, pastron adresën |
| Veprim, përgjegjës, afat | Tower → Action Tracker | "Krijo veprimin e lidhur" shkruan rreshtin në regjistrin e stacionit (si më parë) **dhe** veprimin në Action Tracker me `caseId`, përgjegjës, afat, kontroll; `trackerId` ruhet në rast; klikimi i dytë nuk shton asgjë; tracker-i tregon "Investigation INV-…" me lidhje kthimi |
| Done ≠ Verified | Action Tracker | Përgjegjësi e bën "done"; "verified" pa rezultat refuzohet nga vetë store-i (`needs-result`), forma hapet te rezultati; te rastet vendimi merret në tower |
| Verifikim | Tower | Kur veprimi është done, faza e rastit bëhet vetë "Verification pending"; kutia e verifikimit mat **të njëjtin dështim** para (periudha e snapshot-it) dhe pas (nga dita kur ndryshimi hyri në fuqi, e vendosur nga përdoruesi, deri në ditën e fundit me të dhëna), mbi rreshtat e të njëjtit partner/turn/zonë/segment, çdo shkallë mbi rreshtat e vet të vlefshëm, me periudhat dhe emëruesit të shkruar |
| KPI para/pas | Tower | `verdict`: efektiv vetëm me rreshta të mjaftueshëm pas (kufiri i mostrës i deep dive-it) dhe shkallë më të ulët (brenda maksimumit të miratuar kur ka); jo efektiv me rreshta të mjaftueshëm pa rënie; përndryshe asnjë vendim ("shumë pak rreshta", "ende asnjë rresht pas") |
| Mbyllje | Tower → Tracker → Regjistër | "Mbylle: verifikuar efektiv" kërkon vendimin efektiv + evidencë + shkak të verifikuar + veprim done; shkruan numrat në rast (`verification`), verifikon veprimin në tracker me të njëjtin tekst si rezultat, shënon rreshtin e regjistrit Effective me Baseline/Result |
| Rihapje | Tower | "Rihape: jo efektiv": rasti Reopened, veprimi mbetet done me rezultatin "jo efektiv", regjistri Not effective; veprimi i ri lidhet me të njëjtin `INV-…` (dy veprime, një rast, pa dublikatë) |
| Turni | Tower → Handover | "Vendose veprimin në dorëzimin e turnit": çështje e hapur me tekst `INV-…: veprimi`, përgjegjës, afat, një herë |

## 3. Çfarë u ndryshua

| Skedar | Ndryshim |
| --- | --- |
| `src/js/actions-store.js` | `caseId` në veprim (pastruar, opsional), `forCase()`, `?case=` në hand-off dhe në `link()`, `update()` refuzon verified pa rezultat (`lastUpdate = "needs-result"`) |
| `src/js/action-tracker.js` | Lidhja "Investigation INV-…" te veprimi; "verified" pa rezultat hap formën te rezultati dhe zbatohet kur ruhet rezultati |
| `src/js/cx-tower.js` | Motori: `caseRows`, `afterWindow`, `verdict`, `caseToTracker`, `applyWhys`. Faqja: veprimi në tracker, kutia e verifikimit, vendimet mbyll/rihap, sinkronizimi i fazës, `?case=` me pse-të, lidhjet te 5 Whys/tracker/handover; fushat `trackerId`, `verifyFrom`, `verification` në rast, regjistri CSV me kolonat e reja (eksport dhe import) |
| `src/js/five-whys.js`, `five-whys.njk` | Fusha e fshehur `case`, shiriti "Investigation INV-…", lidhja "Send the cause back"; pastrimi e heq rastin |
| `src/_includes/partials/cx-tower.njk` | Ngarkon `actions-store.js` |
| `src/css/09-career-and-data-tools.css` | Kutia e verifikimit dhe lidhjet (pa prekur pamjen ekzistuese) |
| `src/_data/de/ui.json`, `sq/ui.json` | 31 tekste të reja |
| `docs/DATA-FORMATS.md`, `README.md` | Format dhe përshkrim |

Pa backend, pa librari, pa framework. Asnjë çelës i ri ruajtjeje: rasti jeton në `sc-cx-tower`, veprimi në `sc-actions`,
fleta në `sc-five-whys`; skedari i punës, PIN-i, PWA-ja dhe team sync i mbartin si më parë.

## 4. Kompatibiliteti

- Një rast i ruajtur para kësaj faze ngarkohet me `trackerId`, `verifyFrom` dhe `verification` bosh; asgjë nuk
  rishkruhet në ngarkim.
- Veprimet e vjetra pa `caseId` janë si më parë; i vetmi ndryshim sjelljeje për to: "verified" kërkon rezultat (testi i
  vjetër i tracker-it u përshtat me qëllim).
- Shembujt mbeten të ndarë: veprimi i shembullit të tracker-it zëvendësohet nga veprimi i parë real, si më parë;
  stacioni shembull i tower-it është i shënuar `example`.
- EN/DE/SQ: çdo tekst i ri është në të tria gjuhët (testi i përkthimeve të tower-it).

## 5. Testet

| Provë | Çfarë mbulon |
| --- | --- |
| `tests/case-thread.test.cjs` (9 teste) | Rregullat e vendimit (mjaftueshmëria, rënia, maksimumi i miratuar, pa "para"); dritarja pas dhe rreshtat e rastit (partner/turn/zonë/segment/javë); stacioni shembull: dëmtimet bien pas kundërmasës, vonesat jo; përkthimi rast → veprim tracker-i; bashkimi i pse-ve (bosh plotësohet, e shkruara ruhet). Faqja e tower-it në jsdom me store-in: rrjedha e plotë deri te mbyllja, rifreskimi me gjendjen e ruajtur, rihapja me veprim të dytë nën të njëjtin rast, rreshta të pamjaftueshëm, veprimi done vetëm në regjistër, evidenca që mungon, `?case=` me pse-të dhe rasti i panjohur; faqet e 5 Whys dhe të tracker-it nga ndërtimi |
| `tests/action-tracker.test.cjs` | Verified pa rezultat refuzohet, me rezultat vuloset dita |
| `tests/browser/case-flow.spec.mjs` (Chromium, 1440 px) | Rrjedha e plotë nëpër faqet reale: tower → 5 Whys → tower → tracker → tower → handover, rifreskim, ruajtje në skedar pune, fshirje, rikthim me lidhjen rast–veprim të paprekur |
| Suitat ekzistuese | `npm test` dhe gjithë suita e shfletuesit (rezultatet në seksionin 7) |

## 6. Kufizimet, me ndershmëri

- Piloti mat KPI-në vetëm për rastet e lindura në CX Control Tower (të dhënat e dorëzimeve/rrugëve). Një rast nga
  handover-i ose 5 Whys pa të dhëna në tower mbetet me verifikim tekstual, si më parë.
- "Dita kur ndryshimi hyri në fuqi" është e përdoruesit: data e mbylljes së veprimit është vetëm parazgjedhje. Pa të,
  nuk ka dritare "pas".
- Para/pas krahason shkallë, jo shkaqe: dy periudha me volume dhe kushte të ndryshme mund të ndryshojnë për arsye të
  tjera. Kufiri i mostrës dhe periudhat e shkruara e bëjnë të dukshme, jo të pamundur.
- Vendimi për mbylljen mbetet njerëzor; numrat mund ta ndalojnë (nuk mbyllet pa vendim efektiv), nuk e marrin vetë.
- Handover-i mban identifikuesin në tekstin e çështjes, jo si fushë; mjafton për gjurmim, nuk mjafton për automatizim.

## 7. Rezultatet e provës

Në degë, commit `db1c6afa`, me ndërtim të plotë (`npm run build`, 838 faqe):

| Provë | Rezultat |
| --- | --- |
| `npm test` (node --test, 1 367 teste, 9 të reja në `case-thread.test.cjs`, 1 i përshtatur në `action-tracker.test.cjs`) | 1 367 kalojnë, 0 dështojnë |
| Gjithë suita e shfletuesit (`npx playwright test`, 6 projekte, 212 teste; `case-flow.spec.mjs` i ri) | 212 kalojnë, 0 dështojnë, 16,2 min |
| CI e PR-it | në kokën përfundimtare të PR-it |

Numrat e stacionit shembull, siç i jep motori: dëmtimet 31 gusht – 13 shtator 40 / 3 375 (1,19 %) → 14 – 26 shtator
13 / 3 388 (0,38 %), vendim efektiv; vonesat 72 / 3 375 (2,13 %) → 78 / 3 388 (2,30 %), vendim jo efektiv. Të dyja
rrugët kalojnë nëpër të njëjtin kod në teste.

## 8. Shqyrtimi i autorit: pesë raste integriteti (28 tetor, mbrëmje)

Çdo rast ka një test në `tests/case-integrity.test.cjs` që dështon në commit-in e mëparshëm (`119dca57`, provuar në
një worktree) dhe kalon pas korrigjimit. Pa funksione të reja, pa framework, pa prekje të Worker-it.

| # | Rasti | PARA (çfarë bënte kodi) | PAS (korrigjimi) |
| --- | --- | --- | --- |
| 1 | Dy hetime, i njëjti tekst veprimi | Rregulli i dublikatave i store-it (titull + burim) e quante veprimin e dytë dublikatë; hetimi i dytë lidhej me veprimin e hetimit të parë | Dublikata vlen vetëm brenda të njëjtit rast (`caseId` hyn në rregull, në `add`, në `fromParams` dhe në kërkimin e binjakut te tower-i): dy veprime, secili me rastin e vet; i njëjti tekst pa rast mbetet veprim i tretë |
| 2 | Verified në tracker vs verifikimi KPI | Me një rezultat të shtypur me dorë, një veprim rasti bëhej "verified" në tracker pa asnjë matje | `ActionsStore.update` refuzon të vendosë ose të heqë "verified" te një veprim me `caseId` nëse s'e kërkon rasti (`{ byCase: true }`, `lastUpdate = "case-verifies"`); tracker-i e gri-zon opsionin dhe e bllokon selektorin e një veprimi të verifikuar nga rasti; teksti i rezultatit mbetet i redaktueshëm; veprimet pa rast si më parë |
| 3 | ID pas fshirjes | `newCaseId` numëronte vetëm rastet ekzistuese: pas fshirjes së `…-001` hetimi i ri merrte `…-001` dhe trashëgonte veprimet jetime | Një id është e zënë sa kohë e emërton një rast, një veprim i tracker-it ose një rresht i regjistrit (`caseIdTaken`); hetimi i ri merr `…-002` |
| 4 | Teksti i 5 Whys në URL | Lidhja "Dërgoje shkakun" mbante problemin, pesë pse-të dhe shkakun në adresë; edhe tower → 5 Whys mbante problemin | Adresa mban vetëm `?case=`; tekstet udhëtojnë brenda shfletuesit si një shënim `sessionStorage` (`sc-case-handoff`, me `caseId` dhe `from`), i shkruar në klikim dhe i lexuar një herë nga faqja për të cilën është; shënimi i një rasti tjetër hidhet; lidhja te 5 Whys kërkon hetim të ruajtur |
| 5 | Periudhat dhe pragu | `afterWindow` pranonte një fillim brenda periudhës para; pragu i mostrës ishte ai i çastit (`state.deep.minN`), i ndryshueshëm pas faktit | Periudha pas fillon rreptësisht pas ditës së fundit të periudhës para (mesazh i qartë kur jo); pragu ruhet me evidencën (`snapshot.minN`), përdoret në verifikim, shënohet në vendim (`verification.minN`) dhe në tekstin e rezultatit, eksportohet/importohet në regjistër (`Sample_Floor`); kur pragu i deep dive-it ndryshon, kutia e thotë |
| + | Ruajtja dështon gjatë sinkronizimit | `update` kthente veprimin edhe kur shkrimi dështonte; vendimi shkruante rastin në kujtesë dhe tracker-in pa kontroll: pas rifreskimit të dy mund të mos përputheshin | `update` kthen null me `"unsaved"`; vendimi shkruan së pari tracker-in (nëse dështon, asgjë s'ndryshon), pastaj tower-in menjëherë (`persistNow`); nëse ky dështon, veprimi i tracker-it kthehet në gjendjen e mëparshme dhe rasti në kujtesë rikthehet; mesazh i qartë, vendimi mund të përsëritet |

Një ndryshim i vogël i lidhur: faza e rastit ndjek veprimin në të dy drejtimet sa kohë s'ka vendim ("Verification
pending" kur veprimi është done; prapë "Investigating" kur rihapet para vendimit).

| # | Rasti | PARA | PAS |
| --- | --- | --- | --- |
| 7 | Tower → Shift Handover (kontrolli i dytë i autorit) | Lidhja e re mbante tekstin e veprimit, përgjegjësin dhe afatin në `?issue=&owner=&due=` | Adresa mban vetëm `?case=`; çështja, përgjegjësi dhe afati udhëtojnë në të njëjtin shënim `sessionStorage` si te 5 Whys, i lexuar një herë nga handover-i (mesazh i vetin "Added from the CX Control Tower"); shënimi i një rasti tjetër ose i munguar nuk shton asgjë dhe faqja e thotë; `?issue=` i 5 Whys lexohet si më parë (testi `4c` në `case-integrity.test.cjs`, plus `handoffs.test.cjs` ekzistues) |

## 9. Shqyrtimi i dytë i autorit: tri prova të integritetit KPI

Testet në `tests/case-kpi.test.cjs`; të tria dështuan në commit-in e mëparshëm (`249b7e93`, provuar në një worktree)
dhe kalojnë pas korrigjimit. Vetëm shkaku, pa funksione të reja.

| # | Prova | PARA (konfirmuar) | PAS |
| --- | --- | --- | --- |
| 1 | "Effective" me mostër të pamjaftueshme PARA | `verdict` kontrollonte vetëm `after.n ≥ floor`: 10 rreshta para dhe 3 388 pas jepnin "effective" | Të dyja periudhat duhet të arrijnë kufirin; `verdict.short` thotë cila mungon dhe kutia e emërton ("Too few eligible rows in the before period (n of min)"); mbyllja refuzohet |
| 2 | Hetim nga segmenti ISO Week, kundërmasa javën tjetër | `caseRows` e zbatonte javën edhe mbi rreshtat pas: periudha pas kishte 0 rreshta, matja e pamundur; periudha para ishte gjithë intervali, jo java | `beforeWindow`: për segment jave, periudha para është vetë java (brenda intervalit të snapshot-it); rreshtat pas nuk filtrohen nga java (`ignoreWeek`); mbivendosja matet ndaj fundit të javës; teksti i kutisë e shpjegon |
| 3 | Targeti i miratuar ose të dhënat historike ndryshojnë pas hetimit | Kutia rillogariste gjithçka live: pas një riimporti ose një targeti të ri, numrat e shfaqur dhe verdikti live mund të kundërshtonin vendimin e regjistruar pa asnjë shenjë; targeti nuk ruhej me vendimin | Vendimi ruan numrat e vet dhe targetin e ditës (`verification.target`); një rast i vendosur shfaq krahasimin e regjistruar, jo atë të sotmin, dhe një paralajmërim `data-cx-changed` numëron çdo ndryshim ("before was 40 / 3 375, now …; approved maximum was 0,80 %, now 0,10 %"); vendimi nuk ndryshon vetë. Për një rast të hapur, evidenca ruhet si `snapshot.baseK/baseN` dhe një riimport që e ndryshon periudhën para shënohet para vendimit |

REZULTATET-9
