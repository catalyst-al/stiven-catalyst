import json, re, sys, statistics as st, collections
W='$AUDIT_WORK/p4-editorial/'
C=json.load(open(W+'corpus.json',encoding='utf-8'))
def clean(body):
    b=re.sub(r'\{[%{].*?[%}]\}','',body)          # nunjucks
    b=re.sub(r'<[^>]+>','',b)
    b=re.sub(r'!\[[^\]]*\]\([^)]*\)','',b)
    b=re.sub(r'\[([^\]]*)\]\([^)]*\)',r'\1',b)
    return b
def paras(body):
    ps=[p.strip() for p in re.split(r'\n\s*\n',clean(body)) if p.strip()]
    return [p for p in ps if not p.startswith('#') and p not in ('{diagram}',)]
SENT=re.compile(r'(?<=[.!?…])["”“»«]?\s+(?=[\"„“«*A-ZÄÖÜÇË0-9])')
def sents(p):
    p=re.sub(r'\*\*|\*','',p)
    p=re.sub(r'^\s*(\d+\.|-)\s+','',p,flags=re.M)
    return [s for s in SENT.split(p.replace('\n',' ')) if len(s.split())>0]
PAT={
 'en':{
  'not_X_it_is_Y': r"\b(?:is|are|was|were|does|do)(?: not|n't)\b[^.;:!?]{0,90}[.;]\s+(?:It|They|That|This|He|She)(?:'s| is| are| was| were)\b",
  'not_X_but_Y': r"\bnot\b[^.;:!?]{1,70},? but\b",
  'let_me': r"\bLet me (?:be|say)\b",
  'let_us': r"\bLet us\b",
  'true_leadership': r"\b(?:True|Real) leader(?:ship)?\b|\ba true leader\b",
  'because_sentence_start': r"(?:^|[.!?]\s+)Because\b",
  'and_that_is': r"(?:^|[.!?]\s+)And (?:that|this) is\b",
  'at_the_end_of_the_day': r"\bat the end of the day\b",
  'history_teaches': r"\bhistory\b[^.]{0,40}\bteaches\b",
  'hedge': r"\bI (?:cannot|can't|could not) (?:confirm|prove|say|give)\b|\bI do not know\b|\bnot documented\b|\bon record\b|\bI do not have\b|\bIn my opinion\b|\bin my experience\b|\bI have no (?:record|measurement|figure|data)\b|\bnot (?:verified|confirmed)\b|\bI would not claim\b|\bwill not claim\b|\bI cannot\b",
 },
 'de':{
  'not_X_it_is_Y': r"\b(?:ist|sind|war|waren) (?:kein\w*|nicht)\b[^.;:!?]{0,90}[.;]\s+(?:Es|Sie|Er|Das|Dies)(?: ist| sind| war| waren)\b",
  'not_X_but_Y': r"\b(?:nicht|kein\w*)\b[^.;:!?]{1,70},? sondern\b",
  'let_me': r"\bLassen Sie (?:mich|es mich)\b",
  'let_us': r"\b(?:Sehen|Betrachten|Machen|Stellen|Rechnen) wir\b",
  'true_leadership': r"\b(?:Echte|Wahre) Führung\b|\becht\w* Führungskraft\b",
  'because_sentence_start': r"(?:^|[.!?]\s+)Denn\b",
  'and_that_is': r"(?:^|[.!?]\s+)Und (?:das|genau das) ist\b",
  'at_the_end_of_the_day': r"\bam Ende des Tages\b",
  'history_teaches': r"\bGeschichte\b[^.]{0,40}\blehrt\b",
  'hedge': r"\bweiß ich nicht\b|\bnicht (?:belegen|bestätigen|beweisen)\b|\bkann ich nicht\b|\bmeiner Meinung nach\b|\bnicht dokumentiert\b|\bnicht genau\b|\bhabe ich nicht\b|\bbelegen kann ich\b|\bwürde (?:ich )?nicht behaupten\b",
 },
 'sq':{
  'not_X_it_is_Y': r"\bnuk (?:është|janë|ishte|ishin)\b[^.;:!?]{0,90}[.;]\s+(?:Është|Janë|Ishte|Ai është|Ajo është|Kjo është|është|janë|ajo është|ai është)\b",
  'not_X_but_Y': r"\bnuk\b[^.;:!?]{1,70},? por\b",
  'let_me': r"\bMë lejoni\b",
  'let_us': r"\bLe t[ae] \w+\b",
  'true_leadership': r"\b(?:Udhëheqja|Lidershipi|udhëheqja|lidershipi) (?:e|i) vërtet[ëa]\b|\blider(?:i)? (?:i )?vërtetë\b|\budhëheqës(?:i)? (?:i )?vërtetë\b",
  'because_sentence_start': r"(?:^|[.!?]\s+)Sepse\b",
  'and_that_is': r"(?:^|[.!?]\s+)Dhe (?:kjo|ky|ai|ajo) (?:është|ishte)\b",
  'at_the_end_of_the_day': r"\bnë fund të ditës\b",
  'history_teaches': r"\bhistori\w*\b[^.]{0,40}\bmëson\b",
  'hedge': r"\bnuk e di\b|\bnuk (?:mund|dot) ta? (?:konfirmoj|provoj|them)\b|\bnuk e provoj dot\b|\bnuk e kam\b|\bnuk i kam\b|\bpër mendimin tim\b|\bnuk është i dokumentuar\b|\bnuk mund të them\b|\bnuk do të pretendoja\b|\bnuk do të pretendoj\b|\bi kam të dokumentuar\b|\bkam të dokumentuar\b",
 }}
rows=[]
for d in C:
    ps=paras(d['body']); txt=' '.join(ps)
    words=re.findall(r"[\wäöüßëçÄÖÜËÇ'’-]+",txt)
    ss=[s for p in ps for s in sents(p)]
    sl=[len(s.split()) for s in ss]
    r=dict(lang=d['lang'],type=d['type'],file=d['file'],slug=d['slug'],words=len(words),sents=len(ss),
           sl=sl,paras=len(ps),
           one_sent_paras=sum(1 for p in ps if len(sents(p))==1),
           last_one_sent= (len(sents(ps[-1]))==1) if ps else False,
           last_bold= ps[-1].startswith('**') if ps else False,
           last_par=ps[-1] if ps else '', first_par=ps[0] if ps else '',
           emdash=txt.count('—')+txt.count(' – '),
           q=sum(s.strip().endswith('?') for s in ss),
           bold=len(re.findall(r'\*\*[^*]+\*\*',txt)))
    for k,rx in PAT[d['lang']].items():
        r[k]=len(re.findall(rx,txt))
    rows.append(r)
json.dump(rows,open(W+'out/rows.json','w'),ensure_ascii=False)
# aggregate
def agg(sel):
    sl=[x for r in sel for x in r['sl']]; w=sum(r['words'] for r in sel)
    out=dict(n=len(sel),words=w,sents=len(sl),
      mean=round(st.mean(sl),1) if sl else 0, median=st.median(sl) if sl else 0, sd=round(st.pstdev(sl),1) if sl else 0,
      cv=round(st.pstdev(sl)/st.mean(sl),2) if sl else 0,
      pct_short_le6=round(100*sum(x<=6 for x in sl)/len(sl),1) if sl else 0,
      pct_long_ge30=round(100*sum(x>=30 for x in sl)/len(sl),1) if sl else 0,
      paras=sum(r['paras'] for r in sel),
      one_sent_para_pct=round(100*sum(r['one_sent_paras'] for r in sel)/max(1,sum(r['paras'] for r in sel)),1),
      end_one_sent_pct=round(100*sum(r['last_one_sent'] for r in sel)/len(sel),1),
      end_bold_pct=round(100*sum(r['last_bold'] for r in sel)/len(sel),1),
      emdash_per_1k=round(1000*sum(r['emdash'] for r in sel)/max(1,w),2),
      q_per_1k=round(1000*sum(r['q'] for r in sel)/max(1,w),2),
      bold_per_doc=round(sum(r['bold'] for r in sel)/len(sel),2))
    for k in PAT['en']:
        tot=sum(r[k] for r in sel)
        out[k]=f"{tot} ({round(1000*tot/max(1,w),2)}/1k; {sum(1 for r in sel if r[k])}/{len(sel)} docs)"
    return out
res={}
for lang in ('en','de','sq'):
    for typ in ('insights','reflections','notes','projects'):
        sel=[r for r in rows if r['lang']==lang and r['type']==typ]
        res[f'{lang}/{typ}']=agg(sel)
json.dump(res,open(W+'out/agg.json','w'),ensure_ascii=False,indent=1)
for k,v in res.items(): print(k, v)
