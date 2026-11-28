#!/bin/bash
# The Worker's requests and errors from Cloudflare's analytics (read only). Usage: signals.sh <since ISO> [until ISO]
A=6bf56de63354f2b14587870ee30941f9; SINCE=$1; UNTIL=${2:-$(date -u +%Y-%m-%dT%H:%M:%SZ)}
Q='query($a:String!,$s:Time!,$u:Time!){viewer{accounts(filter:{accountTag:$a}){workersInvocationsAdaptive(limit:100,filter:{scriptName:"stiven-catalyst-sync",datetime_geq:$s,datetime_leq:$u}){sum{requests errors subrequests} dimensions{status scriptVersion}}}}}'
curl -sS -m 40 https://api.cloudflare.com/client/v4/graphql -H "Content-Type: application/json" --data "$(python3 -c "import json,sys;print(json.dumps({'query':sys.argv[1],'variables':{'a':sys.argv[2],'s':sys.argv[3],'u':sys.argv[4]}}))" "$Q" $A $SINCE $UNTIL)" | python3 -c "
import json,sys
d=json.load(sys.stdin)
if d.get('errors'): print('analytics errors:',json.dumps(d['errors'])[:300]); sys.exit()
rows=d['data']['viewer']['accounts'][0]['workersInvocationsAdaptive']
print('window $SINCE .. $UNTIL')
tot=err=0
for r in rows:
    print('  version',r['dimensions'].get('scriptVersion'),'status',r['dimensions'].get('status'),'requests',r['sum']['requests'],'errors',r['sum']['errors'])
    tot+=r['sum']['requests']; err+=r['sum']['errors']
print('  total requests',tot,'| errors (exceptions, exceeded limits)',err)"
