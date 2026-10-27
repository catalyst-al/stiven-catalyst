#!/usr/bin/env python3
"""Parse every HTML page in _site and emit pages.json + pages.csv."""
import os, sys, json, csv, re
from urllib.parse import urlsplit, unquote
import lxml.html

SITE = sys.argv[1]
OUT = sys.argv[2]
ORIGIN = 'https://stivencatalyst.com'

def url_for(rel):
    if rel == 'index.html':
        return '/'
    if rel.endswith('/index.html'):
        return '/' + rel[:-len('index.html')]
    return '/' + rel

pages = []
for root, dirs, files in os.walk(SITE):
    for fn in files:
        if not fn.endswith('.html'):
            continue
        full = os.path.join(root, fn)
        rel = os.path.relpath(full, SITE)
        raw = open(full, 'rb').read()
        try:
            doc = lxml.html.fromstring(raw)
        except Exception as e:
            pages.append({'rel': rel, 'error': str(e)})
            continue
        h = doc.find('.//html') if doc.tag != 'html' else doc
        htmlel = doc if doc.tag == 'html' else doc.getroottree().getroot()
        lang = htmlel.get('lang')
        def meta(name=None, prop=None, equiv=None):
            if name:
                r = doc.xpath('//meta[@name=$n]/@content', n=name)
            elif prop:
                r = doc.xpath('//meta[@property=$n]/@content', n=prop)
            else:
                r = doc.xpath('//meta[translate(@http-equiv,"ABCDEFGHIJKLMNOPQRSTUVWXYZ","abcdefghijklmnopqrstuvwxyz")=$n]/@content', n=equiv)
            return r
        titles = doc.xpath('//head/title/text()')
        title = titles[0].strip() if titles else None
        desc = meta(name='description')
        canon = doc.xpath('//link[@rel="canonical"]/@href')
        robots = meta(name='robots') + meta(name='googlebot')
        hreflang = {}
        for l in doc.xpath('//head/link[@rel="alternate"][@hreflang]'):
            hreflang.setdefault(l.get('hreflang'), []).append(l.get('href'))
        feeds = [(l.get('type'), l.get('href')) for l in doc.xpath('//head/link[@rel="alternate"][@type]')]
        refresh = meta(equiv='refresh')
        jsonld = []
        for s in doc.xpath('//script[@type="application/ld+json"]'):
            txt = s.text or ''
            try:
                jsonld.append({'ok': True, 'data': json.loads(txt)})
            except Exception as e:
                jsonld.append({'ok': False, 'err': str(e), 'snippet': txt[:200]})
        # links
        links = []
        for a in doc.xpath('//a[@href]'):
            links.append(a.get('href'))
        res = []
        for el in doc.xpath('//*[@src]'):
            res.append(el.get('src'))
        for el in doc.xpath('//link[@href]'):
            if el.get('rel') in ('canonical', 'alternate'):
                continue
            res.append(el.get('href'))
        for el in doc.xpath('//*[@srcset]'):
            for part in el.get('srcset').split(','):
                p = part.strip().split(' ')[0]
                if p: res.append(p)
        for el in doc.xpath('//*[@poster]'):
            res.append(el.get('poster'))
        for el in doc.xpath('//form[@action]'):
            res.append(el.get('action'))
        ids = set(doc.xpath('//@id')) | set(doc.xpath('//a/@name'))
        # language switcher
        ls = []
        for nav in doc.xpath('//nav[contains(concat(" ",normalize-space(@class)," ")," lang-switch ")]')[:1]:
            for a in nav.xpath('.//a[@href]'):
                ls.append((a.get('hreflang') or a.text_content().strip().lower(), a.get('href')))
        # main word count
        main = doc.xpath('//main')
        body = main[0] if main else (doc.xpath('//body') or [doc])[0]
        import copy
        b2 = copy.deepcopy(body)
        for bad in b2.xpath('.//script|.//style|.//noscript|.//template|.//nav|.//svg'):
            bad.drop_tree()
        text = ' '.join(b2.text_content().split())
        words = len(re.findall(r"\w+", text))
        h1 = doc.xpath('//h1')
        h1t = ' '.join(h1[0].text_content().split()) if h1 else None
        pages.append({
            'rel': rel, 'url': url_for(rel), 'lang': lang, 'title': title,
            'desc': desc[0] if desc else None, 'ndesc': len(desc),
            'canonical': canon[0] if canon else None, 'ncanon': len(canon),
            'robots': ','.join(robots) if robots else '',
            'hreflang': hreflang, 'feeds': feeds, 'refresh': refresh[0] if refresh else None,
            'jsonld': jsonld, 'links': links, 'res': res, 'ids': sorted(ids),
            'langswitch': ls, 'words': words, 'h1': h1t, 'nh1': len(h1),
            'og_url': (meta(prop='og:url') or [None])[0], 'og_locale': (meta(prop='og:locale') or [None])[0],
            'og_type': (meta(prop='og:type') or [None])[0], 'og_title': (meta(prop='og:title') or [None])[0],
            'og_image': (meta(prop='og:image') or [None])[0],
            'content_language': (meta(equiv='content-language') or [None])[0],
            'text_hash': hash(text), 'text_head': text[:300], 'size': len(raw),
        })

json.dump(pages, open(os.path.join(OUT, 'pages.json'), 'w'), ensure_ascii=False)
with open(os.path.join(OUT, 'pages.csv'), 'w', newline='') as f:
    w = csv.writer(f)
    w.writerow(['path', 'url', 'lang', 'title', 'canonical', 'robots', 'hreflang', 'words', 'refresh'])
    for p in sorted(pages, key=lambda p: p['rel']):
        w.writerow([p['rel'], p.get('url'), p.get('lang'), p.get('title'), p.get('canonical'), p.get('robots'),
                    ' '.join(sorted(p.get('hreflang', {}).keys())), p.get('words'), p.get('refresh') or ''])
print(len(pages))
