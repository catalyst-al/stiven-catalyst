#!/usr/bin/env python3
import json, os, sys, collections, re
from urllib.parse import urlsplit, unquote
SITE = sys.argv[1]
P = json.load(open('pages.json'))
ORIGIN = 'https://stivencatalyst.com'
byurl = {p['url']: p for p in P}

def resolve(path):
    """GitHub-Pages style: return (status, file) for a site path."""
    path = unquote(path)
    fs = os.path.join(SITE, path.lstrip('/'))
    if path.endswith('/'):
        f = os.path.join(fs, 'index.html')
        return ('200', f) if os.path.isfile(f) else ('404', None)
    if os.path.isfile(fs):
        return ('200', fs)
    if os.path.isfile(fs + '.html'):
        return ('200-ext', fs + '.html')
    if os.path.isdir(fs) and os.path.isfile(os.path.join(fs, 'index.html')):
        return ('301-slash', os.path.join(fs, 'index.html'))
    return ('404', None)

def internal(href, base):
    if href is None: return None
    href = href.strip()
    if not href or href.startswith(('mailto:', 'tel:', 'javascript:', 'data:', 'blob:', '#')):
        return None
    s = urlsplit(href)
    if s.scheme in ('http', 'https'):
        if s.netloc not in ('stivencatalyst.com', 'www.stivencatalyst.com'):
            return None
        return s.path or '/', s.fragment
    if s.scheme:
        return None
    if href.startswith('//'):
        return None
    if s.path.startswith('/'):
        return s.path, s.fragment
    # relative
    basedir = base if base.endswith('/') else base.rsplit('/', 1)[0] + '/'
    path = os.path.normpath(basedir + s.path) if s.path else base
    if s.path.endswith('/') and not path.endswith('/'): path += '/'
    return path, s.fragment

out = {}
# 1 lang vs prefix
bad_lang = []
for p in P:
    exp = 'de' if p['rel'].startswith('de/') else 'sq' if p['rel'].startswith('sq/') else 'en'
    if p['lang'] != exp: bad_lang.append((p['rel'], p['lang']))
out['bad_lang'] = bad_lang

# 2 canonical
canon_issues = collections.defaultdict(list)
for p in P:
    c = p['canonical']
    if not c: canon_issues['missing'].append(p['rel']); continue
    if p['ncanon'] > 1: canon_issues['multiple'].append(p['rel'])
    if not c.startswith(ORIGIN): canon_issues['not_absolute_origin'].append((p['rel'], c)); continue
    path = c[len(ORIGIN):] or '/'
    if path != p['url']:
        st, f = resolve(urlsplit(path).path)
        canon_issues['not_self'].append((p['rel'], path, st, os.path.relpath(f, SITE) if f else None))
    if p['og_url'] and p['og_url'] != c: canon_issues['og_url_differs'].append((p['rel'], p['og_url'], c))
out['canon'] = canon_issues

# 3 noindex & refresh
out['noindex'] = [(p['rel'], p['robots'], p['canonical']) for p in P if 'noindex' in p['robots'].lower()]
out['robots_other'] = [(p['rel'], p['robots']) for p in P if p['robots'] and 'noindex' not in p['robots'].lower()]
out['refresh'] = [(p['rel'], p['refresh'], p['words']) for p in P if p['refresh']]

# 4 hreflang
hl = collections.defaultdict(list)
for p in P:
    h = p['hreflang']
    if not h: hl['none'].append(p['rel']); continue
    for k, v in h.items():
        if k not in ('en', 'de', 'sq', 'x-default'): hl['bad_code'].append((p['rel'], k))
        if len(v) > 1: hl['dup'].append((p['rel'], k))
        for u in v:
            if not u.startswith(ORIGIN): hl['not_abs'].append((p['rel'], u)); continue
            st, f = resolve(u[len(ORIGIN):])
            if st == '404': hl['target_404'].append((p['rel'], k, u))
            elif st != '200': hl['target_nonself_form'].append((p['rel'], k, u, st))
            else:
                tgt = byurl.get(u[len(ORIGIN):])
                if tgt is None: continue
                # reciprocity
                back = tgt['hreflang'].get(p['lang'], [])
                if p['canonical'] not in back and k != 'x-default':
                    hl['not_reciprocal'].append((p['rel'], k, u, back))
                if 'noindex' in tgt['robots']: hl['to_noindex'].append((p['rel'], u))
    if 'x-default' not in h: hl['no_xdefault'].append(p['rel'])
    if p['lang'] not in h: hl['no_self'].append(p['rel'])
    elif p['canonical'] not in h[p['lang']]: hl['self_ne_canon'].append((p['rel'], h[p['lang']], p['canonical']))
out['hreflang'] = hl

# 5 language switcher
lsw = collections.defaultdict(list)
for p in P:
    if not p['langswitch']: lsw['none'].append(p['rel']); continue
    for code, href in p['langswitch']:
        r = internal(href, p['url'])
        if not r: lsw['external'].append((p['rel'], href)); continue
        st, f = resolve(r[0])
        if st == '404': lsw['broken'].append((p['rel'], code, href))
        else:
            tgt = os.path.relpath(f, SITE)
            tl = 'de' if tgt.startswith('de/') else 'sq' if tgt.startswith('sq/') else 'en'
            if tl != code: lsw['wrong_lang'].append((p['rel'], code, href))
            # does switcher point to the equivalent page (same path minus prefix)?
            strip = lambda x: re.sub(r'^(de|sq)/', '', x)
            if strip(tgt) != strip(p['rel']): lsw['not_equivalent'].append((p['rel'], code, href, tgt))
out['langswitch'] = lsw

# 6 internal links
broken = collections.defaultdict(set); nonexact = collections.Counter(); nonexact_ex = {}
inlinks = collections.defaultdict(set)
badfrag = collections.defaultdict(set)
idx = {p['rel']: set(p['ids']) for p in P}
allfiles = set()
for root, d, fs in os.walk(SITE):
    for f in fs: allfiles.add(os.path.relpath(os.path.join(root, f), SITE))
for p in P:
    for kind, lst in (('a', p['links']), ('res', p['res'])):
        for href in lst:
            r = internal(href, p['url'])
            if not r: continue
            path, frag = r
            st, f = resolve(path)
            if st == '404':
                broken[(kind, path)].add(p['rel'])
                continue
            tgt = os.path.relpath(f, SITE)
            if kind == 'a':
                if tgt != p['rel']: inlinks[tgt].add(p['rel'])
                if st != '200':
                    nonexact[st] += 1; nonexact_ex.setdefault((st, path), p['rel'])
                if frag and tgt.endswith('.html') and frag not in idx.get(tgt, set()):
                    badfrag[(path, frag)].add(p['rel'])
out['broken'] = {f'{k[0]} {k[1]}': sorted(v)[:5] + [len(v)] for k, v in broken.items()}
out['nonexact'] = dict(nonexact); out['nonexact_ex'] = [list(k) + [v] for k, v in list(nonexact_ex.items())[:60]]
out['badfrag'] = {f'{k[0]}#{k[1]}': sorted(v)[:3] + [len(v)] for k, v in badfrag.items()}
# sitemap
import xml.etree.ElementTree as ET
sm = ET.parse(os.path.join(SITE, 'sitemap.xml')).getroot()
ns = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
smurls = []
for u in sm.findall('s:url', ns):
    loc = u.find('s:loc', ns).text.strip(); lm = u.find('s:lastmod', ns)
    alts = [(x.get('hreflang'), x.get('href')) for x in u.findall('{http://www.w3.org/1999/xhtml}link')]
    smurls.append((loc, lm.text if lm is not None else None, alts))
smset = set()
sm_issues = collections.defaultdict(list)
for loc, lm, alts in smurls:
    if not loc.startswith(ORIGIN): sm_issues['not_origin'].append(loc); continue
    path = loc[len(ORIGIN):]
    st, f = resolve(path)
    if st == '404': sm_issues['404'].append(loc); continue
    tgt = os.path.relpath(f, SITE); smset.add(tgt)
    if st != '200': sm_issues['nonexact'].append((loc, st))
    pg = next((x for x in P if x['rel'] == tgt), None)
    if pg:
        if 'noindex' in pg['robots']: sm_issues['noindex_in_sitemap'].append(loc)
        if pg['canonical'] != loc: sm_issues['loc_ne_canonical'].append((loc, pg['canonical']))
        if pg['refresh']: sm_issues['redirect_in_sitemap'].append(loc)
out['sitemap_count'] = len(smurls); out['sitemap_unique'] = len(set(x[0] for x in smurls))
out['sitemap_issues'] = sm_issues
out['sitemap_lastmods'] = collections.Counter((lm or 'NONE')[:10] for _, lm, _ in smurls).most_common(40)
indexable = [p for p in P if 'noindex' not in p['robots'] and not p['refresh']]
out['indexable_count'] = len(indexable)
out['indexable_canon_self'] = sum(1 for p in indexable if p['canonical'] == ORIGIN + p['url'])
out['missing_from_sitemap'] = sorted(p['rel'] for p in indexable if p['rel'] not in smset)
# orphans: no inlinks and not in sitemap
out['orphans_no_inlinks'] = sorted(p['rel'] for p in P if not inlinks.get(p['rel']))
out['orphans_and_not_in_sitemap'] = sorted(p['rel'] for p in P if not inlinks.get(p['rel']) and p['rel'] not in smset)
json.dump({k: dict(v) if isinstance(v, collections.defaultdict) else v for k, v in out.items()}, open('checks.json', 'w'), indent=1, ensure_ascii=False, default=list)
json.dump({k: sorted(v) for k, v in inlinks.items()}, open('inlinks.json', 'w'))
json.dump(smurls, open('sitemap_urls.json', 'w'))
for k, v in out.items():
    if isinstance(v, dict):
        print(k, {kk: len(vv) if isinstance(vv, (list, set)) else vv for kk, vv in v.items()})
    elif isinstance(v, list): print(k, len(v))
    else: print(k, v)
