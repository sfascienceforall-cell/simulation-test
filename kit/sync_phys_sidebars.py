"""Réécrit la liste latérale (« sfa-list ») de chaque page de simulation de physique d'après universite/physique/phys-meta.js.
Usage : python3 kit/sync_phys_sidebars.py (après build_phys_meta.py). Ne touche qu'au bloc <div class="sfa-list">…</div>."""
import json,os,re,html
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
B='https://sfascienceforall-cell.github.io/simulation-test/universite/physique/'
s=open(R+'/universite/physique/phys-meta.js',encoding='utf-8').read(); P=json.loads(s[s.index('{'):s.rindex('}')+1])
n=0
for c in P['chapitres']:
    for s_ in c['sims']:
        p=f"{R}/universite/physique/{s_['id']}/index.html"
        if not os.path.exists(p): continue
        t=open(p,encoding='utf-8').read()
        m=re.search(r'<div class="sfa-list">.*?</ol></div>',t,re.S)
        if not m: continue
        k=len(c['sims'])
        li=''.join(f'<li><a{" class=\"on\" aria-current=\"page\"" if x["id"]==s_["id"] else ""} href="{B}{x["id"]}/"><i>{j+1:02d}</i>{html.escape(x["t"],quote=False)}</a></li>' for j,x in enumerate(c['sims']))
        new=f'<div class="sfa-list"><h2>{html.escape(c["t"],quote=False)}<span>{k} simulation{"s" if k>1 else ""}</span></h2><ol>{li}</ol></div>'
        if new!=m.group(0): t=t[:m.start()]+new+t[m.end():]; open(p,'w',encoding='utf-8').write(t); n+=1
print(n,'listes mises à jour')
