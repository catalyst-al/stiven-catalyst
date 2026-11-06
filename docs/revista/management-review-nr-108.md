# Management Review Nr. 108 · Vlerësimet online: sa vlen një yll

Blloku: KPI. Seria e tretë, Nëntor 2026. Të dhënat janë te `lib/weekly/issues/108.js`.

Çfarë u lexua dhe si (6 nëntor 2026):

- **Luca (2016)**, "Reviews, Reputation, and Revenue: The Case of Yelp.com", Harvard Business School Working Paper 12-016
  (© 2011, 2016): PDF nga hbs.edu, lexuar i plotë me pymupdf, me tabelat 1–4 dhe 9–10. Pa `via`.
- **Hu, Pavlou & Zhang (2007)**, "Why do Online Product Reviews have a J-shaped Distribution? Overcoming Biases in Online
  Word-of-Mouth Communication", punim pune i dorëzuar te Marketing Science, shkurt 2007: PDF 46 faqe nga NYU Faculty
  Digital Archive (handle 2451/14951), lexuar i plotë seksionet 1 dhe 2 (studimi ekonometrik dhe eksperimenti) dhe
  përmbledhja; modeli analitik dhe parashikimi i shitjeve (seksionet 3–4) nuk u përdorën. Artikulli i shkurtër i 2009-s në
  Communications of the ACM ("Overcoming the J-shaped distribution of product reviews") nuk u hap dhe nuk citohet. Pa `via`.
- **Luca & Zervas (2016)**, "Fake It Till You Make It: Reputation, Competition, and Yelp Review Fraud", Management Science
  62(12): versioni i pranuar i 20 korrikut 2015, PDF nga Harvard DASH (nrs.harvard.edu/urn-3:HUL.InstRepos:22836596),
  lexuar i plotë. Shifrat janë të këtij versioni. Pa `via`.
- **Anderson (2012)**, "The Impact of Social Media on Lodging Performance", Cornell Hospitality Report 12(15), nëntor
  2012: PDF 14 faqe nga eCommons i Cornell-it, lexuar i plotë. Pa `via`.

Nuk u lexua dhe nuk hyri: asnjë material i rregullatorëve për vlerësimet e rreme (Komisioni Evropian, CMA, FTC). Faqja e
shtypit e Komisionit për kontrollin e vlerësimeve online nuk u hap (faqe JavaScript), ndaj asnjë shifër e saj nuk hyri.

Nuk përsëritet: NPS, CSAT, CES dhe top-2-box janë te Nr. 32; shënimi i faqes 7 çon atje. Ligji i Goodhart-it (kur masa
bëhet objektiv) është te Nr. 43; shënimi i faqes 7 dhe ai i faqes 8 e prekin vetëm në një fjali.

Lidhjet: mjeti `/tools/guest-complaints/` (regjistri i ankesave me kategori, Pareto dhe dhomat që ankohen dy herë) dhe
eseja "the-angry-guest-at-2am", ku karta e autorit nis me "What problem was reported? In the guest's words, not our
conclusion." Shënimi i faqes 8 e quan "mënyra e autorit për të shkruar një ankesë me fjalët e mysafirit". Asnjë ese e
autorit nuk flet për vlerësimet online; prandaj nuk thuhet që e ka bërë.

Pohime që u hoqën ose u ndryshuan gjatë kontrollit: "të ardhurat tatimore" u bë "të ardhurat e deklaruara te zyra e
tatimeve" (të dhënat janë të Washington State Department of Revenue); "klientët reaguan ndaj numrit, jo ndaj vlerësimeve"
u bë "jo vetëm ndaj vlerësimeve"; "50 vlerësime" u bë "50 e sipër, kundrejt nën 10"; "biznese që blinin vlerësime" u bë
"që kërkonin vlerësime të rreme" (soliciting); "kurthi i marsit 2014" u bë "në 90 ditët para marsit 2014"; "kur u pyetën
të gjithë" u bë "kur një grup i tërë vlerësoi një CD". Shifra "82% kundrejt 4%" për fotot e profilit në Boston nuk hyri:
në tekst duket e përmbysur kundrejt shifrave të kurthit (20% kundrejt 77%). Shifra 0,89% (ADR) dhe 0,54% (zënia) të
përmbledhjes së Anderson-it janë vlerat e klasës mesatare, jo të të gjitha hoteleve; prandaj shënimi jep vlerat e të
gjitha klasave (0,80; 0,20; 0,96) dhe grafiku i ndan sipas klasës.

## Tabela e fakteve

| Shifra ose fakti | Burimi | Statusi |
|---|---|---|
| Seattle, 2003–2009, të gjitha restorantet, 3.582 (faqja 3) | Luca (2016), f. 3 dhe 8 | U konfirmua: "I worked with the Washington State Department of Revenue to gather revenues for all restaurants in Seattle from 2003 through 2009"; "In total, there are 3,582 restaurants during the period of interest." |
| Yelp e rrumbullakon mesataren te gjysmë ylli; 3,24 → 3 yje, 3,25 → 3,5 (faqja 3) | Luca (2016), f. 11 | U konfirmua: "These average ratings are rounded to the nearest half a star. Therefore, a restaurant with a 3.24 rating will be rounded to 3 stars, while a restaurant with a 3.25 rating will be rounded to 3.5 stars" |
| Një yll më shumë: 5–9% më shumë të ardhura për restorantet e pavarura (faqja 3, hyrja, përmbajtja) | Luca (2016), abstrakti dhe f. 4 | U konfirmua: "a one-star increase leads to a 5-9 percent increase in revenue for independent restaurants, depending on the specification" |
| Zinxhirët: efekti jo i rëndësishëm, afër zeros (faqja 3) | Luca (2016), f. 5 | U konfirmua: "the impact is statistically insignificant and close to zero for chains" |
| RD: gjysmë ylli i rrumbullakimit, i shtrirë në një yll, rreth 9%; brenda 0,1 ylli; OLS 5,4% (faqja 3 dhe shënimi) | Luca (2016), f. 13–14, tabelat 3–4 | U konfirmua: "I find that an exogenous one-star improvement leads to a roughly 9% increase in revenue. (Note that the shock is one-half star, but I renormalize for ease of interpretation)"; "I restrict the sample to all observations in which a restaurant is less than 0.1 stars from a discontinuity"; "A one-star increase is associated with a 5.4% increase in revenue, controlling for restaurant and quarter specific unobservables." |
| Klientët përdorin yllin e rrumbullakuar si shkurtore (faqja 3) | Luca (2016), f. 15 | U konfirmua: "consumers do not use all available information, but instead use the rounded rating as a simplifying heuristic" |
| Yelp 70% e restoranteve të Seattle-it më 2009; Seattle Times rreth 5% (faqja 3) | Luca (2016), f. 3 | U konfirmua: "the website had over 60,000 restaurant reviews covering 70% of all operational restaurants as of 2009. By comparison, the Seattle Times has reviewed roughly 5% of operational Seattle restaurants." |
| Zinxhirët rreth 5% e restoranteve në një tremujor (shënimi i faqes 3) | Luca (2016), f. 8 | U konfirmua: "In any given quarter, roughly 5% of restaurants are chains." |
| Ndryshimi i vlerësimit ka 50% më shumë efekt me ≥50 vlerësime se me <10 (karta e faqes 5) | Luca (2016), f. 20, tabela 9 | U konfirmua: "a change in a restaurant’s rating has 50% more impact when the restaurant has at least 50 reviews (compared to a restaurant with fewer than 10 reviews)" |
| Vlerësuesit elitë rreth dyfishin e efektit (karta e faqes 5) | Luca (2016), f. 21, tabela 10 | U konfirmua: "Table 10 shows that elite reviewers have roughly double the impact of other reviewers." |
| Lexuesit peshojnë numrin dhe vlerësuesin kur i shohin (faqja 5) | Luca (2016), abstrakti | U konfirmua: "Consumer response to a restaurant’s average rating is affected by the number of reviews and whether the reviewers are certified as “elite” by Yelp" |
| 13.341 rezervime në Travelocity, korrik 2012, nëntë qytete amerikane (faqja 4) | Anderson (2012), f. 9 | U konfirmua: "The data consist of 13,341 reservations made during July 2012 in nine major U.S. cities." |
| Një pikë më shumë: shanset +14,2%; çmimi +11,2% me të njëjtin shans (kopertina, hyrja, faqja 4) | Anderson (2012), f. 5, 9–10 | U konfirmua: "increasing one point increases the odds of being selected by 14.2 percent"; "if a hotel increases its review scores by 1 point on a 5-point scale (e.g., from 3.3 to 4.3), the hotel can increase its price by 11.2 percent and still maintain the same occupancy or market share" |
| Çdo vend më poshtë në listë: shanset −11,5% (faqja 4) | Anderson (2012), f. 9 | U konfirmua: "That equates to an 11.5-percent decrease in its chances for every notch it drops (all else being equal)." (raport shansesh 0,885) |
| RevPAR për 1% GRI sipas klasës: luks 0,49; shumë i lartë 0,74; i lartë 0,83; mesatar i lartë 1,13; mesatar 1,42 (grafiku i faqes 4) | Anderson (2012), Exhibit 5, f. 11 | U konfirmua: "Luxury 0.44 0.09 0.49"; "Upper Upscale 0.57 0.30 0.74"; "Upscale 0.67 0.19 0.83"; "Upper MidScale 0.74 0.42 1.13"; "MidScale 0.89 0.54 1.42"; "The table entries represent the percentage impact upon pricing, demand, and performance given a 1-percent change in online reputation as measured by GRI." |
| Të gjitha klasat: ADR 0,80, zënia 0,20, RevPAR 0,96 (shënimi i faqes 4) | Anderson (2012), Exhibit 5 | U konfirmua: "All 0.80 0.20 0.96"; "a 1-percent increase in a hotel’s GRI score, say from 80 to 80.8 aligns with a 0.96-percent increase in RevPAR" |
| Fitimi në klasën mesatare gati tri herë sa në luks (thirrja e faqes 4) | Anderson (2012), f. 11 | Llogaritur nga redaksia: 1,42 / 0,49 = 2,9. Burimi: "the gain from online reputation improvement is much more profound for a midscale property (1.42%) than for a luxury hotel (.49%)"; shpjegimi i pasigurisë: "would-be guests may experience more uncertainty in the level of service in lower chain scales" |
| STR mujore janar 2010–qershor 2012, 11 qytete (6 evropiane, 5 të Amerikës së Veriut), kundrejt grupit konkurrues; GRI i ReviewPro (shënimi i faqes 4) | Anderson (2012), f. 10 | U konfirmua: "monthly revenue, demand, and supply data from STR for 2½ years (January 2010 through June 2012)"; "I have these data for 11 major markets (6 European and 5 North American cities)"; "I use ReviewPro’s Global Review Index (GRI) for the subject hotels as well as each hotel within its STR listed competitive set" |
| Shumëçka nuk matet (shënimi i faqes 4) | Anderson (2012), f. 11 | U konfirmua: "Needless to say, many factors contribute to hotel performance that are not measured here." |
| Amazon 2005: 32.878 libra, 17.978 DVD, 28.983 video; mbledhur shkurt–korrik 2005 (faqja 6) | Hu, Pavlou & Zhang (2007), f. 4, tabela 1 | U konfirmua: "Product information and their corresponding consumer reviews were collected from Amazon.com between February and July of 2005"; tabela 1: "Books 32,878 967,075 4.02"; "DVDs 17,978 2,034,552 4.19"; "Videos 28,983 1,248,992 3.99" |
| 78%, 73%, 72% e vlerësimeve ≥4 yje (grafiku i faqes 6) | Hu, Pavlou & Zhang (2007), f. 5 | U konfirmua: "about 78%, 73%, and 72% of the online product reviews for books, DVDs, and videos are greater or equal to 4-stars, respectively" |
| Forma J: mbi gjysma 5 yje, 20% 1 yll, pak në mes (faqja 6, karta e faqes 5) | Hu, Pavlou & Zhang (2007), f. 10 | U konfirmua: "over half of the reviews are 5-star, 10% are 4-star, 10% are 3-star, 10% are 2-star, while 20% are 1-star reviews." |
| 78% e librave me më pak se 20 vlerësime (faqja 6) | Hu, Pavlou & Zhang (2007), f. 5 | U konfirmua: "Figure 1 shows that 78%, 41%, and 66% of books, DVDs, and videos have less than 20 reviews." |
| Eksperimenti: një CD muzike, 66 studentë, 60 përgjigje (faqja 6) | Hu, Pavlou & Zhang (2007), f. 10 | U konfirmua: "We distributed a randomly-selected “Mr. A-Z” music CD to a sample of 66 students ... 60 responses were obtained (91% response rate)" |
| Shpërndarje normale; mesatarja 3,12 kundrejt 3,54 në Amazon (faqja 6) | Hu, Pavlou & Zhang (2007), f. 11 | U konfirmua: "The distribution of the experimental product reviews (Figure 5a) can be adequately fitted with a normal curve"; "the mean of Amazon’s online product reviews (mean=3.54) is significantly higher (p<.05) than the mean reported by the respondents of the experiment (mean=3.12)" |
| Amazon >60% me 1 ose 5 yje; eksperimenti <10% (faqja 6) | Hu, Pavlou & Zhang (2007), f. 12 | U konfirmua: "the majority of Amazon’s product reviews (>60%) are polarized (either 1-star or 5-stars)"; "less than 10% of the experimental reviews are polarized (1-star or 5-star reviews)" |
| Dy shkaqet: paragjykimi i blerjes dhe i mosraportimit (shënimi dhe thirrja e faqes 6) | Hu, Pavlou & Zhang (2007), abstrakti | U konfirmua: "(1) purchasing bias - only consumers with favorable disposition towards a product purchase the product and have the opportunity to write a product review, and (2) under-reporting bias - consumers with polarized (either positive or negative) reviews are more likely to report their reviews than consumers with moderate reviews" |
| Kufijtë: një produkt, studentë (shënimi i faqes 6) | Hu, Pavlou & Zhang (2007), f. 12 | U konfirmua: "since the experimental results are based on a single product, there may be concerns about the generalizability"; "the experiment was conducted among students" |
| 316.415 vlerësime, 3.625 restorante të Bostonit, 2004–2012; 50.486 (rreth 16%) të filtruara (hyrja, faqja 7) | Luca & Zervas (2016), f. 6–7 | U konfirmua: "We include in our analysis every Yelp review that was written from the founding of Yelp in 2004 through 2012"; "our dataset contains 316,415 reviews for 3,625 restaurants. Of these reviews, 50,486 (approximately 16%) have been filtered by Yelp." |
| Të filtruarat më ekstreme; mashtrimi kur reputacioni është i dobët (pak vlerësime ose të këqija së fundmi); zinxhirët më pak (faqja 7, karta e faqes 5) | Luca & Zervas (2016), abstrakti | U konfirmua: "These reviews tend to be more extreme (favorable or unfavorable) than other reviews"; "a restaurant is more likely to commit review fraud when its reputation is weak, i.e., when it has few reviews, or it has recently received bad reviews. Third, chain restaurants – which benefit less from Yelp – are also less likely to commit review fraud." |
| Filtri tregues i përafërt, me gabime në të dy drejtimet (shënimi i faqes 7) | Luca & Zervas (2016), f. 3 | U konfirmua: "the filtering algorithm is imperfect. Therefore, there are both false positives (i.e., filtered reviews that are not fake) and false negatives (i.e., fake reviews that were not filtered)." |
| Kurthi: 126 biznese me "consumer alert" në 90 ditët para marsit 2014 (shënimi i faqes 7) | Luca & Zervas (2016), f. 11 | U konfirmua: "During March 2014, we collected data from all US businesses listed on Yelp. We identified 126 businesses – none of which are Boston restaurants – that had received a consumer alert over the prior 90 days" |
| 79% të filtruara te bizneset e kapura, kundrejt 19% te restoranti mesatar i Bostonit (faqja 7) | Luca & Zervas (2016), f. 11 | U konfirmua: "among businesses that received a consumer alert the average fraction of reviews that are filtered is 79%, compared to 19% for the average Boston restaurant." Bizneset u kapën "soliciting fake reviews" |
| Vlerësuesit e filtruar në Boston kishin shkruar 10 vlerësime, të publikuarit 137 (faqja 7) | Luca & Zervas (2016), f. 11–12 | U konfirmua: "reviewers whose reviews were filtered have written fewer reviews than reviewers whose reviews were published (10 vs 137)" |
| Shembulli i hoteleve A dhe B (faqja 5) | Redaksia | I shpikur nga redaksia; faqja e shënon "Shembull, i shpikur nga redaksia". Llogaria: 10 × 3 / 10 = 3,0; (5 × 5 + 5 × 1) / 10 = 3,0 |
| Fushat e faqes 7, karta e faqes 8, mendimi për objektivat e stafit, thirrjet | Redaksia | Propozim dhe lexime të redaksisë mbi Luca (2016), Hu et al. (2007) dhe Luca & Zervas (2016); faqet e thonë |
