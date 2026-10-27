# Validate downloaded exports: zip integrity + every XML part parses; xlsx opens in openpyxl; ics line lengths; csv shape.
import sys, os, zipfile, csv, io, re, json
from xml.dom import minidom
import openpyxl
D = sys.argv[1]
report = {}
for name in sorted(os.listdir(D)):
    p = os.path.join(D, name); r = {}
    try:
        if name.endswith(('.xlsx', '.docx')):
            z = zipfile.ZipFile(p); bad = z.testzip(); r['zip'] = 'ok' if bad is None else f'bad {bad}'
            for n in z.namelist():
                if n.endswith(('.xml', '.rels')): minidom.parseString(z.read(n))
            r['xml'] = 'ok'
            if name.endswith('.xlsx'):
                wb = openpyxl.load_workbook(p); ws = wb.active
                rows = list(ws.iter_rows(values_only=True)); r['rows'] = len(rows)
                cells = [c for row in rows for c in row if isinstance(c, str)]
                r['apostrophe_text'] = [c[:40] for c in cells if c.startswith("'")][:3]
                r['numbers_as_text'] = [c for c in cells if re.fullmatch(r'-?\d+[.,]\d+', c)][:3]
            else:
                doc = z.read('word/document.xml').decode('utf8'); r['docx_chars'] = len(re.sub('<[^>]+>', '', doc))
        elif name.endswith('.ics'):
            raw = open(p, 'rb').read(); lines = raw.split(b'\r\n')
            r['long_lines'] = sum(1 for l in lines if len(l) > 75); r['max_line'] = max(len(l) for l in lines)
            txt = raw.decode('utf8'); r['english_labels'] = bool(re.search(r'\\nCheck: |\\nArea: |\\nFrom: ', txt))
            try: raw.decode('utf8'); r['utf8'] = 'ok'
            except Exception as e: r['utf8'] = str(e)
        elif name.endswith('.csv'):
            txt = open(p, encoding='utf-8-sig').read(); first = txt.split('\r\n')[0]
            sep = ';' if first.count(';') > first.count(',') else ','
            rows = list(csv.reader(io.StringIO(txt), delimiter=sep)); widths = {len(x) for x in rows if x}
            r['sep'] = sep; r['rows'] = len(rows); r['ragged'] = len(widths) > 1
            cells = [c for row in rows for c in row]
            r['dot_decimals'] = [c for c in cells if re.fullmatch(r'-?\d+\.\d+', c)][:4]
            r['comma_decimals'] = [c for c in cells if re.fullmatch(r'-?\d+,\d+', c)][:4]
            r['apostrophe'] = [c[:40] for c in cells if c.startswith("'")][:3]
        elif name.endswith('.json'):
            json.load(open(p)); r['json'] = 'ok'
    except Exception as e:
        r['ERROR'] = repr(e)[:200]
    report[name] = r
for k, v in report.items(): print(k, v)
