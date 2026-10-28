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

**Vulosja.** Një kod transferimi (katër fjalë nga lista e kodit të ekipit, ose një i shkruar, të paktën 8 shenja)
→ PBKDF2-SHA-256 me 310 000 raunde dhe salt të rastit → AES-GCM 256 me formatin e lidhur si additional data.
Bajtet `[2, salt16, iv12, shifër]` shkojnë pas `#h2=` në adresë (base64url), si QR kur hyjnë (deri në 2331 bajt), ose
si skedar `stiven-catalyst-handover-file` kur janë më të gjata. **Kodi thuhet veçmas**, kurrë në të njëjtin mesazh:
linku vetëm nuk lexohet. Web Crypto API e shfletuesit, asnjë kriptografi e re.

**Statuset.** Draft → Ready to hand over → **Shared** (vetëm pas veprimit: kopjim, Share, skedar i ruajtur, "E tregova
kodin QR"; jo thjesht sepse u gjenerua) → te marrësi **Received** → **Taken over** (konfirmim lokal) → te dërguesi
**Acknowledged** vetëm kur shkruan kodin e konfirmimit të marrësit. Teksti nën titull thotë qartë kur diçka është
vetëm "në këtë pajisje" dhe kur është "e konfirmuar nga pajisja tjetër". Closed = turni i mbyllur te historiku.

**Marrja (pajisja tjetër).** Faqja kërkon kodin, hap dorëzimin lokalisht dhe tregon përmbledhjen dhe çështjet:
*e re*, *tashmë e hapur këtu*, *mbajtur nga këtu* (çështjet e hapura të marrësit që dërguesi s'i kishte nuk humbasin).
Pastaj "Merre këtë dorëzim": ajo që ishte kalon te historiku (me konfirmim), dorëzimi bëhet turni aktual me `received`
dhe id-ja regjistrohet; **i njëjti transferim hapur përsëri njihet** ("E marrë tashmë në …") dhe butoni kryesor
zëvendësohet me "Merre përsëri gjithsesi". Kod i gabuar ose bajt i ndryshuar: "Kod i gabuar, ose dorëzimi u ndryshua
gjatë rrugës. Asgjë nuk u hap" (AES-GCM nuk i dallon dot). Linku i hapur në një skedë që e ka faqen hapur trajtohet
me `hashchange`.

**Konfirmimi pa server.** Pas "Konfirmo marrjen", marrësi sheh një kod 6-shenjash (SHA-256 e id-së së transferimit
dhe kodit të transferimit, base32): e thotë me zë, e kopjon ose kopjon një link `#a=`. Dërguesi e shkruan te "Kodi i
konfirmimit" dhe vetëm atëherë dorëzimi bëhet "Acknowledged by Lena: confirmed with the code". Dërguesi nuk ruan kodin
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
- Çështje e njëjtë (teksti i njëjtë, pa dalluar shkronjat e mëdha dhe hapësirat): mbetet një herë, me bartjen më të lartë.
- I njëjti transferim dy herë: njihet nga id-ja, kërkon "përsëri gjithsesi".

## 6. Çfarë u testua

TESTET

## 7. Kufizimet që mbeten

- Linku vulos përmbajtjen, por mbetet në historikun e shfletuesit dhe të chat-it si bajt të pakuptueshëm; nëse dikush
  merr edhe linkun edhe kodin, lexon dorëzimin. Kodi me 4 fjalë (≈ 41 bit) + PBKDF2 310 000 raunde e bën provën e
  verbër të kushtueshme, jo të pamundur për një sulmues me GPU dhe javë kohë; për ditën e turnit mjafton.
- Kodi i konfirmimit (30 bit) vërteton se marrësi hapi dorëzimin, jo identitetin e tij.
- Emrat e mysafirëve brenda fjalive nuk zbulohen nga shabllonet; dialogu e kërkon leximin.
- Konfirmimi kthehet me zë, mesazh ose link; nuk ka kanal automatik dhe nuk pretendohet.
- Testuar në Chromium (Playwright, dy kontekste të izoluara) dhe Node; jo në Firefox, Safari apo telefona realë.
- Faza e dytë (Problem → Evidence → … → KPI) nuk nis këtu; strukturat e reja (`id` transferimi, `received`,
  `shared`, kodi i konfirmimit) janë bërë që një çështje të mund të ndiqet më tej pa i ndryshuar.
