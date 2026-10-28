# Shift Handover end-to-end: transferimi i vulosur mes dy pajisjeve (Faza 1 e platformës)

Data: 28 tetor 2026. Dega `feature/shift-handover-secure-transfer`, nga `main` `669b34d`. Draft PR, pa merge, pa
deploy, Team Sync Worker dhe Cloudflare të paprekura. Çdo emër, numër dhome dhe situatë në teste është fiktive.

## 1. Çfarë ekzistonte para ndryshimit

- Krijimi i dorëzimit: data, turni, zona, numrat e turnit (me plotësim nga logjet), çështjet me prioritet, përgjegjës,
  afat, "zgjidhur" ose e hapur, numri i bartjeve; paralajmërimet dhe shënimi i sigurisë; lista e kontrollit. Ruajtje
  automatike në `localStorage` në çdo shtypje (`sc-shift-handover`), rikthim pas rifreskimit, histori 30 turnesh,
  "Mbyll turnin" që bart çështjet e hapura. Asgjë nga këto nuk u ndërtua nga e para: u verifikua dhe u ruajt.
- Transferimi: "Dërgoja turnit tjetër" paketonte dorëzimin si JSON gzip + base64url pas `#h=` në adresë, me QR,
  Share dhe kopjim. Marrësi shihte një rresht dhe e hapte.
- Konfirmimi: "Konfirmo marrjen" vetëm lokalisht (`ackAt`), pa asnjë rrugë kthimi te dërguesi.

## 2. Dobësia e konfirmuar

- Linku i vjetër **nuk ishte i enkriptuar**: gzip + base64url dekodohet nga kushdo që e sheh linkun (historik
  shfletuesi, chat, screenshot). Emrat e kolegëve, përgjegjësit dhe tekstet e çështjeve udhëtonin të lexueshëm.
- Nuk kishte zgjedhje për çfarë ndahet (emrat shkonin gjithmonë), asnjë paralajmërim për përmbajtje personale.
- Asnjë mbrojtje nga importimi i dyfishtë, asnjë dallim mes çështjeve të reja dhe atyre tashmë të hapura te marrësi.
- "I ndarë" dhe "i marrë" nuk ekzistonin si statuse; gjenerimi i një QR-je nuk linte asnjë gjurmë.

## 3. Çfarë u përmirësua (si punon tani)

**Përgatitja (dërguesi).** Dialogu tregon së pari çfarë shkon: data dhe turni, sa numra, sa çështje të hapura dhe
të zgjidhura, rreshtat e paralajmërimit, shënimi i sigurisë, kontrollet. **Emrat e njerëzve (kush dorëzon, kush
merr, përgjegjësit) mbeten jashtë si parazgjedhje**; një kuti i përfshin me qëllim. Një kontroll me shabllone tregon
çfarë duket si adresë emaili, numër telefoni, numër karte ose IBAN, me fushën ku gjendet; për emra mysafirësh brenda
fjalive, që një shabllon s'i gjen, dialogu e thotë shkoqur. Asgjë nuk ndahet pa veprimin e përdoruesit.

**Vulosja.** Një kod transferimi (gjashtë fjalë nga lista e kodit të ekipit, rreth 62 bit, ose një i shkruar, të paktën 8 shenja, me paralajmërim kur është i dobët: i shkurtër, vetëm shifra, i përsëritur, varg si 12345678, fjalë e zakonshme)
→ PBKDF2-SHA-256 me 310 000 raunde dhe salt të rastit → AES-GCM 256 me formatin e lidhur si additional data.
Bajtet `[2, salt16, iv12, shifër]` shkojnë pas `#h2=` në adresë (base64url), si QR kur hyjnë (deri në 2331 bajt), ose
si skedar `stiven-catalyst-handover-file` kur janë më të gjata. **Kodi thuhet veçmas**, kurrë në të njëjtin mesazh:
linku vetëm nuk lexohet. Web Crypto API e shfletuesit, asnjë kriptografi e re.

**Statuset.** Draft → Ready to hand over → **Shared** (vetëm pas veprimit që pati sukses: kopjim që clipboard-i e konfirmoi, edhe përgjigja e komandës së vjetër kontrollohet, Share që u kthye, skedar i ruajtur, "E tregova
kodin QR"; jo thjesht sepse u gjenerua) → te marrësi **Received** → **Taken over** (konfirmim lokal) → te dërguesi
**Acknowledged** vetëm kur dërguesi shkruan me dorë kodin e konfirmimit të marrësit: konfirmim manual se dorëzimi u hap me kodin e vet, jo provë e identitetit apo e pajisjes. Teksti nën titull thotë qartë kur diçka është
vetëm "në këtë pajisje" dhe kur është "e konfirmuar nga pajisja tjetër". Closed = turni i mbyllur te historiku.

**Marrja (pajisja tjetër).** Faqja kërkon kodin, hap dorëzimin lokalisht dhe tregon përmbledhjen dhe çështjet:
*e re*, *tashmë e hapur këtu*, *mbajtur nga këtu* (çështjet e hapura të marrësit që dërguesi s'i kishte nuk humbasin). Një çështje e hapur në të dyja pajisjet mbetet një: gjendja më e sigurt fiton (mbetet e hapur edhe kur dërguesi e ka shënuar të zgjidhur), përgjegjësi, afati dhe prioriteti më i lartë i marrësit ruhen, bartja më e lartë, dhe çdo ndryshim shfaqet nën çështje para marrjes.
Pastaj "Merre këtë dorëzim": ajo që ishte kalon te historiku (me konfirmim), dorëzimi bëhet turni aktual me `received`
dhe id-ja regjistrohet; **i njëjti transferim hapur përsëri njihet** ("E marrë tashmë në …") dhe butoni kryesor
zëvendësohet me "Merre përsëri gjithsesi". Kod i gabuar ose bajt i ndryshuar: "Kod i gabuar, ose dorëzimi u ndryshua
gjatë rrugës. Asgjë nuk u hap" (AES-GCM nuk i dallon dot). Linku i hapur në një skedë që e ka faqen hapur trajtohet
me `hashchange`.

**Konfirmimi pa server.** Pas "Konfirmo marrjen", marrësi sheh një kod 6-shenjash (SHA-256 e id-së së transferimit
dhe kodit të transferimit, base32): e thotë me zë, e kopjon ose kopjon një link `#a=`. Dërguesi e shkruan te "Kodi i
konfirmimit" dhe vetëm atëherë dorëzimi bëhet "Acknowledged: confirmation code typed in by hand (Lena)". Faqja e thotë: konfirmim manual që dorëzimi u hap me kodin e vet, jo provë kush e hapi apo në cilën pajisje. Dërguesi nuk ruan kodin
e transferimit, vetëm kodin e konfirmimit që pret. Nuk pretendohet sinkronizim automatik.

**Pajtueshmëria.** Linqet e vjetra `#h=`/`#h0=` lexohen ende, me shënimin "bërë nga një version më i vjetër, pa
enkriptim"; nuk prodhohen më. Gjendja e ruajtur zgjerohet (`shared`, `ack`, `received`, `state.received`) dhe
rindërtohet fushë më fushë nga `clean()`: një dorëzim i vjetër hapet pa ndryshim. Work Backup, pikat e rikthimit,
PIN Lock dhe Team Sync e mbajnë çelësin `sc-shift-handover` siç e mbanin.

## 4. Çfarë ndodh pa internet

Gjithçka është lokale: vulosja, hapja, kodi i konfirmimit. Pajisja marrëse duhet ta ketë hapur mjetin më parë, që
service worker-i ta ketë kopjen; atëherë linku hapet edhe pa rrjet nga një faqe tjetër. Një pajisje që s'e ka hapur
kurrë faqen nuk e hap linkun offline, sepse s'ka kopje; teksti i faqes dhe ky raport e thonë.

## 5. Konfliktet dhe dublikatat

- Turni aktual i marrësit me përmbajtje: kalon te historiku para marrjes, me konfirmim.
- Çështjet e hapura të marrësit që dërguesi s'i ka: mbahen te turni i ri, të shënuara "mbajtur nga këtu".
- Çështje e njëjtë: teksti i njëjtë nuk mjafton. Një çështje hyrëse merret për të njëjtën me një të hapur këtu vetëm kur teksti përputhet, përgjegjësi dhe afati pajtohen ose mungojnë në njërën anë, dhe këtu ka saktësisht një të tillë. Atëherë mbetet një: e hapur këtu nuk bëhet e zgjidhur se e solli ashtu transferimi; përgjegjësi ose afati që mungon plotësohet nga këtu; prioriteti dhe bartja më e lartë; çdo ndryshim i dukshëm. Kur përgjegjësi ose afati ndryshojnë, ose ka më shumë se një kandidat, identiteti nuk është i sigurt: të gjitha regjistrimet ruhen dhe çështja hyrëse shënohet "tekst i njëjtë me një çështje këtu".
- I njëjti transferim dy herë: njihet nga id-ja, kërkon "përsëri gjithsesi".

## 6. Çfarë u testua

| Kontroll | Si | Rezultati |
| --- | --- | --- |
| Build | `npx eleventy` | pa gabim |
| Testet unit | `npm test` | **1343 / 1343**, 0 të anashkaluara (ishin 1337; `tests/handover-link.test.cjs` u rishkrua me 11 teste) |
| Vulosja dhe hapja | Node, `tests/handover-link.test.cjs` | hapet me kodin e vet, me shkronja/hapësira/viza të ndryshme; kod i gabuar → `wrong`; çdo bajt i ndryshuar (salt, iv, shifër, fundi) → `wrong`; bajte të huaja → `invalid`; dy vulosje të së njëjtës dorëzim ndryshojnë dhe hapen të dyja |
| Kufijtë | Node | fragment > 64 KB i refuzuar pa dekodim; skedar > 1 MB i refuzuar; bombë gzip 50 MB (link i vjetër) e refuzuar nën 2 s; bombë e vulosur (256 KB hapësira) → `invalid` pas deshifrimit |
| Linqet e vjetra | Node + jsdom me faqen e ndërtuar | `#h=` dhe `#h0=` hapen me shënimin "version më i vjetër, pa enkriptim"; markup në fusha mbetet tekst (asnjë element nga linku) |
| Kodi i transferimit dhe i konfirmimit | Node | 4 fjalë nga lista / 10 shenja pa 0-1-i-l-o; ≥ 8 shenja; kodi i konfirmimit varet nga id-ja dhe nga kodi, i njëjtë sido që shkruhet kodi |
| Përmbajtja personale | Node | email, telefon (≥ 9 shifra), kartë (≥ 13 shifra), IBAN gjenden me fushën; numrat e dhomave, sasitë dhe oraret jo |
| Bashkimi i çështjeve | Node | e re / e njëjtë (bartja më e lartë) / e mbajtur nga këtu; listat bosh |
| Rrjedha A → B → konfirmim → A | Playwright, Chromium, dy kontekste të izoluara, **18 / 18** (3 teste × 390/768/1440 px × temë e errët me lëvizje / e çelët me lëvizje të reduktuar), `tests/browser/handover-transfer.spec.mjs` | ruajtja automatike dhe rikthimi pas rifreskimit; përmbledhja me emrat jashtë dhe brenda; kod i shkurtër i refuzuar; linku pa emra, nën 2331 bajt, me QR; "Shared" vetëm pas kopjimit; B: kod i gabuar nuk ndryshon asgjë, kodi i saktë hap parapamjen me *e re* / *mbajtur nga këtu*; marrja ruan çështjen e hapur të B-së dhe çon turnin e vjetër te historiku; "Received" → "Taken over by Lena" me kod konfirmimi; i njëjti link përsëri → "Already received"; A: kod i gabuar i refuzuar, i sakti → "Acknowledged by Lena"; mbyllja e turnit mban kodin te historiku dhe pastron të dhënat e transferimit |
| Link i dëmtuar, fragment i huaj, skedar, offline, tastierë | Playwright, i njëjti spec | bajt i ndryshuar → "Kod i gabuar, ose dorëzimi u ndryshua"; bajte jo-dorëzim → "nuk është dorëzim që kjo faqe e hap"; fragment i pavlefshëm → shënim dhe adresa pastrohet; skedari ruhet pa emra dhe hapet; "nuk është skedar dorëzimi"; "Jo tani" nuk ndryshon gjë; **offline**: pasi B e ka hapur mjetin një herë dhe service worker-i e kontrollon faqen, nga një faqe tjetër dhe pa rrjet linku hapet dhe kodi punon; vetëm me tastierë: fusha e kodit me fokus, Enter hap, "Merre" me fokus, Enter merr |
| EN / DE / SQ | Playwright | A në gjermanisht ("Geteilt"), B në shqip ("dorëzim i vulosur", "Emrat jashtë", "E marrë") |
| Aksesueshmëria | axe-core në faqen e A-së pas ndarjes dhe te B me parapamjen | 0 shkelje serioze ose kritike |
| Pa gabime skripti | fixtures.mjs për A, `pageerror` për B | 0 |

Nuk u testua: Firefox, Safari, telefona realë. Dy kontekstet e Playwright janë dy profile të izoluara shfletuesi në të
njëjtën makinë, jo dy pajisje fizike.

## 7. Kufizimet që mbeten

- Linku vulos përmbajtjen, por mbetet në historikun e shfletuesit dhe të chat-it si bajt të pakuptueshëm; nëse dikush
  merr edhe linkun edhe kodin, lexon dorëzimin. Kodi me 6 fjalë (≈ 62 bit) + PBKDF2 310 000 raunde e bën provën e
  verbër praktikisht të pamundur; një kod i shkruar me dorë mund të jetë më i dobët dhe faqja e paralajmëron, pa e ndaluar.
- Kodi i konfirmimit (30 bit) është konfirmim manual: tregon se dorëzimi u hap me kodin e vet të transferimit, jo kush e hapi, as në cilën pajisje.
- Emrat e mysafirëve brenda fjalive nuk zbulohen nga shabllonet; dialogu e kërkon leximin.
- Konfirmimi kthehet me zë, mesazh ose link; nuk ka kanal automatik dhe nuk pretendohet.
- Testuar në Chromium (Playwright, dy kontekste të izoluara) dhe Node; jo në Firefox, Safari apo telefona realë.
- Faza e dytë (Problem → Evidence → … → KPI) nuk nis këtu; strukturat e reja (`id` transferimi, `received`,
  `shared`, kodi i konfirmimit) janë bërë që një çështje të mund të ndiqet më tej pa i ndryshuar.

## 8. Korrigjimet e 28 tetorit pas shqyrtimit të PR-së (commit-i pasues)

1. **Bashkimi i çështjeve:** një çështje e hapur te marrësi nuk bëhet më `done` se transferimi e sjell të zgjidhur;
   përgjegjësi, afati dhe prioriteti më i lartë i marrësit ruhen kur dërguesi s'i ka ose i ka ndryshe; bartja më e
   lartë; çdo ndryshim (`conflicts`: solvedThere, owner, due, priority) shfaqet nën çështje në parapamje.
2. **Shared vetëm pas suksesit:** `copyText` kthen true/false (API-ja e clipboard-it, ose përgjigja e `execCommand`);
   pa sukses, dorëzimi nuk shënohet i ndarë dhe faqja kërkon kopjim me dorë.
3. **Acknowledged** riformulohet si konfirmim manual me kod: titulli, rreshti i gjendjes dhe dy tekstet ndihmëse e
   thonë se nuk vërteton identitetin as pajisjen.
4. **Kodi i transferimit** i gjeneruar: gjashtë fjalë nga lista e Team Sync (≈ 62 bit), ose 12 shenja pa lista;
   kodet e shkruara me dorë paralajmërohen kur janë të dobëta (`weakPasscode`), pa librari të reja.

Teste të shtuara: bashkimi me konflikt (6 raste), kodet e dobëta (12 raste), gjendja e ruajtur nga versioni i
mëparshëm që ngarkohet e pandryshuar dhe historiku i paprekur pas marrjes (jsdom); në shfletues: paralajmërimi i
kodit të dobët, konflikti i dukshëm, historiku i marrësit i paprekur, formulimi i Acknowledged, shfletues që nuk
kopjon → jo Shared. Rezultatet: §6, rreshti i fundit.

## 9. Korrigjimi i identitetit të çështjeve (28 tetor, pas shqyrtimit të dytë)

Rreziku i gjetur nga autori: `mergeIssues` i identifikonte çështjet vetëm nga teksti i normalizuar dhe i vendoste
në një Map, kështu që dy probleme me të njëjtin përshkrim por me përgjegjës ose afate të ndryshme mund të
bashkoheshin dhe njëri të humbiste, edhe brenda vetë pajisjes marrëse.

Tani: identiteti kërkon tekst të njëjtë **dhe** përgjegjës e afat që pajtohen (të barabartë ose bosh në një anë)
**dhe** një kandidat të vetëm këtu. Çdo rast tjetër ruan të gjitha regjistrimet: çështja hyrëse shënohet
`ambiguous` dhe del në parapamje me etiketën "tekst i njëjtë me një çështje këtu" dhe shpjegimin "vendos vetë";
çështjet e marrësit mbeten "mbajtur nga këtu". Dy çështje të marrësit me tekst të njëjtë nuk bashkohen kurrë mes
tyre; dy çështje të dërguesit me tekst të njëjtë mbërrijnë të dyja.

Teste: në Node 7 raste (një kandidat i saktë mes dy, përgjegjës tjetër, afat tjetër, pa emra me dy kandidatë,
dy identike te dërguesi pa asgjë këtu, dy identike te dërguesi me njërën këtu, dy identike bosh këtu); në
shfletues, pajisja A me dy "Dock 4 door jams" (Facilities / Maintenance), pajisja B me një të tretën (Lena) dhe një
turn në historik: pas marrjes tri regjistrime me përgjegjësit dhe afatet e veta, historiku i paprekur plus turni i
mëparshëm i B-së.
