#!/usr/bin/env python3
"""Pages d'accueil « Secondaire » et « Université » (style des pages de chimie). python3 kit/build_hubs.py"""
import os, re, glob, json, subprocess, html
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src=open(R+'/chimie/index.html').read()
css=re.search(r'<style>(.*?)</style>',src,re.S).group(1)
FONTS='<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Mulish:wght@400;500;600;700;800&display=swap">'
def info(d):
    js=r"""
const fs=require('fs'),vm=require('vm');const d=process.argv[1];
const S={sims:[],ex:0,page(m){this.meta=m},sim(x){this.sims.push(x)},exos(c,l){this.ex+=l.length},theo(){},figs(){},draw:{palette:{}},fmt:()=>''};
const ctx={SFA:S,window:{},document:{addEventListener(){}},console};ctx.window=ctx;vm.createContext(ctx);
const fl=fs.readdirSync(d).filter(f=>/^(page|course-meta|sims-.*|exos-.*)\.js$/.test(f)).sort((a,b)=>(a=='page.js'?-1:b=='page.js'?1:a=='course-meta.js'?-1:b=='course-meta.js'?1:a<b?-1:1));
for(const f of fl){try{vm.runInContext(fs.readFileSync(d+'/'+f,'utf8'),ctx)}catch(e){}}
const M=S.meta||{};console.log(JSON.stringify({titre:M.titre,court:M.court,intro:M.intro,chap:(M.chapitres||[]).map(c=>c.titre),sims:S.sims.length+((M.ext||[]).length),ex:S.ex,featured:M.featured||(S.sims[0]||{}).id,ext:(M.ext||[]).filter(e=>e.id==M.featured).map(e=>e.img)[0]}));"""
    out=subprocess.run(['node','-e',js,d],capture_output=True,text=True).stdout.strip()
    return json.loads(out or '{}')
def page(title,kicker,h1,lead,secs,nav,stats):
    navh=''.join(f'<a{" class=\"on\"" if on else ""} href="{u}">{t}</a>' for u,t,on in nav)
    chips=''.join(f'<a href="#{sid}">{st}<span>{len(cards)}</span></a>' for sid,st,_,cards in secs)
    body=''
    for sid,st,sub,cards in secs:
        body+=f'<section id="{sid}"><h2>{st}<em>{len(cards)} cours</em></h2>'+(f'<p>{sub}</p>' if sub else '')+'<div class="grid">'
        for c in cards:
            body+=f'<a class="card" href="{c["href"]}" data-q="{html.escape((c["t"]+" "+c["d"]).lower())}"><img loading="lazy" src="{c["img"]}" alt=""><div><small>{c["k"]}</small><b>{c["t"]}</b><span>{c["d"]}</span></div></a>'
        body+='</div></section>'
    st=''.join(f'<div><b>{v}</b>{k}</div>' for k,v in stats)
    return f'''<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>{title} · SFA</title>{FONTS}<style>{css}</style></head><body>
<header class="top"><div class="in"><a class="logo" href="https://sciencesforall.be"><i>SFA</i>Science For All</a><nav class="nav">{navh}</nav><a class="cta" href="{nav[0][0]}prepa/">Prépa concours médecine</a></div></header>
<main class="wrap"><div class="hero"><div><span class="free">100 % gratuit</span><h1>{h1}</h1><p class="lead">{lead}</p>
<div class="search"><input id="q" type="search" placeholder="Rechercher un cours, une notion…" aria-label="Rechercher"></div><div class="stats">{st}</div></div>
<a class="feat" href="{secs[0][3][0]["href"]}"><small>À essayer en premier</small><img src="{secs[0][3][0]["img"]}" alt=""><b>{secs[0][3][0]["t"]}</b></a></div>
<nav class="chips" aria-label="Matières">{chips}</nav>{body}<p class="empty" id="empty">Aucun cours ne correspond.</p></main>
<footer>Science For All · simulations, théorie et exercices</footer>
<script>const q=document.getElementById('q');q.addEventListener('input',()=>{{const v=q.value.trim().toLowerCase();let n=0;document.querySelectorAll('section').forEach(s=>{{let k=0;s.querySelectorAll('.card').forEach(c=>{{const ok=!v||c.dataset.q.includes(v);c.style.display=ok?'':'none';if(ok)k++;}});s.style.display=k?'':'none';n+=k;}});document.getElementById('empty').style.display=n?'none':'block';}});</script></body></html>'''
# ---- secondaire
MN=[("maths","Mathématiques"),("physique","Physique"),("chimie","Chimie"),("biologie","Biologie")]
secs=[];TS=TE=0
for m,n in MN:
    cards=[]
    for a in ["3e","4e","5e","6e"]:
        d=f"{R}/secondaire/{m}/{a}"; i=info(d); TS+=i.get('sims',0); TE+=i.get('ex',0)
        cards.append({"href":f"{m}/{a}/","img":f"{m}/{a}/thumbs/{i.get('featured')}.jpg","k":f"{n} · {a} secondaire","t":f"{n} · {a}","d":f"{i.get('sims',0)} simulations · {i.get('ex',0)} exercices — "+" · ".join(i.get('chap',[])[:4])+"…"})
    secs.append((m,n,"",cards))
nav=[("../","Physique (unif)",False),("./","Secondaire",True),("../universite/","Université",False)]
open(R+'/secondaire/index.html','w').write(page("Secondaire","","Le secondaire en simulations interactives.","Maths, physique, chimie et biologie, de la 3e à la 6e secondaire (FWB) : pour chaque année, 10 chapitres avec leurs simulations, un rappel théorique animé et des exercices corrigés du ★ au ★★★★★.",secs,nav,[("simulations",TS),("exercices et QCM",TE),("années × matières",16)]))
# ---- université
cards=[{"href":"../","img":"../thumbs/"+next((f for f in sorted(os.listdir(R+'/thumbs')) if 'ourniquet' in f or 'rojectile' in f),sorted(os.listdir(R+'/thumbs'))[0]),"k":"Université · BA1","t":"Physique","d":"61 simulations : mécanique, ondes, optique, électricité ; exercices et QCM par chapitre."}]
UN=[("chimie","Chimie"),("maths","Mathématiques"),("biologie","Biologie"),("statistique","Biostatistique")]
U=[]; US=61; UE=0
for m,n in UN:
    d=f"{R}/universite/{m}"
    if not os.path.exists(d+'/page.js'): continue
    i=info(d)
    if m=='chimie': i['ex']=i.get('ex',0)+190
    US+=i.get('sims',0); UE+=i.get('ex',0)
    img=f"{m}/"+(i['ext'] if i.get('ext') else f"thumbs/{i.get('featured')}.jpg")
    U.append({"href":f"{m}/","img":img,"k":"Université · BA1","t":n,"d":f"{len(i.get('chap',[]))} chapitres · {i.get('sims',0)} simulations · {i.get('ex',0)} exercices — "+" · ".join(i.get('chap',[])[:4])+"…"})
# physique en 2e position après chimie ? on garde l'ordre : chimie, physique, maths, bio, stat
allc=[U[0],cards[0]]+U[1:]
secs=[("bachelier","Première année d'université (BA1)","Médecine, dentisterie, pharmacie, sciences biomédicales, sciences, polytechnique.",allc)]
nav=[("../","Physique",False),("../secondaire/","Secondaire",False),("./","Université",True)]
open(R+'/universite/index.html','w').write(page("Université","","L'université en simulations interactives.","Chimie, physique, mathématiques, biologie et biostatistique de première année : chaque chapitre a ses simulations, son rappel théorique animé et ses exercices corrigés du ★ au ★★★★★.",secs,nav,[("simulations",US),("exercices et QCM",UE),("matières",len(allc))]))
print("ok",TS,TE,US,UE)
