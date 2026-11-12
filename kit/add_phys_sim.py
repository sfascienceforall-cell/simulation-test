"""Ajoute une simulation de physique autonome à simulation-test.
python3 kit/add_phys_sim.py <id> "<titre>" "<sous-titre de la carte>" "<phrase d'intro>" <section: PH1…PH11, MA, OS, FL, TH> <corps.html> "<mots-clés>"
<corps.html> = le bloc <section class="sfa-sim">…</section> (canevas, contrôles, script). L'enveloppe (en-tête, colonne, habillage)
est reprise de condensateurs-serie-parallele. Ensuite : vignette thumbs/<id>.jpg, puis node kit/build_search_index.js."""
import sys,os,re,json,html
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sid,titre,sous,intro,sec,body,kw=sys.argv[1:8]
B='https://sfascienceforall-cell.github.io/simulation-test/universite/physique/'
src=open(R+'/universite/physique/condensateurs-serie-parallele/index.html',encoding='utf-8').read()
a=src.index('<section class="sfa-sim">'); b=src.index('</section></main>')+len('</section>')
head,tail=src[:a],src[b:]
T0='Condensateurs en série et en parallèle'
head=head.replace(f'<title>{T0} · SFA</title>',f'<title>{html.escape(titre,quote=False)} · SFA</title>').replace(f'›<b>{T0}</b>',f'›<b>{html.escape(titre,quote=False)}</b>').replace(f'<h1>{T0}</h1>',f'<h1>{html.escape(titre,quote=False)}</h1>')
i=head.index('<p>Capacité équivalente'); j=head.index('</p>',i); head=head[:i]+'<p>'+intro+head[j:]
# fil d'Ariane et puce : chapitre de la section
home=R+'/universite/physique/index.html'; s=open(home,encoding='utf-8').read()
m=re.search(r'<section id="'+sec+r'"><h2>([^<]*)<em class="">(\d+) simulations?</em></h2><div class="grid">(.*?)</div></section>',s,re.S); assert m,sec
small=re.search(r'<small>([^<]*)</small>',m.group(3)).group(1)
head=re.sub(r'(<nav class="sfa-crumbs"[^>]*>.*?›<a href=")[^"]*(">)[^<]*(</a>)',lambda mm:mm.group(1)+B+'#'+sec+mm.group(2)+small+mm.group(3),head,count=1,flags=re.S)
head=head.replace('<span class="sfa-chip">Physique · Électrocinétique</span>',f'<span class="sfa-chip">Physique · {small}</span>')
os.makedirs(R+f'/universite/physique/{sid}',exist_ok=True)
open(R+f'/universite/physique/{sid}/index.html','w',encoding='utf-8').write(head+open(body,encoding='utf-8').read().rstrip('\n')+tail)
# carte d'accueil (fin de section)
if f'href="{B}{sid}/"' not in s:
    card=(f'<a class="card" href="{B}{sid}/" data-q="{html.escape((titre+" "+sous+" "+kw+" "+m.group(1)).lower())}"><img loading="lazy" src="thumbs/{sid}.jpg" alt="">'
          f'<div><small>{small}</small><b>{html.escape(titre,quote=False)}<span class=new>Nouveau</span></b><span>{html.escape(sous,quote=False)}</span></div></a>')
    n=int(m.group(2))+1
    seg=s[m.start():m.end()]
    seg=seg.replace(f'<em class="">{m.group(2)} simulation','<em class="">%d simulation'%n,1).replace(' simulation</em>',' simulations</em>') if n>1 else seg
    seg=seg[:seg.rindex('</div></section>')]+card+'</div></section>'
    s=s[:m.start()]+seg+s[m.end():]
    s=re.sub(r'(<div class="stats"><div><b>)(\d+)(</b>simulations)',lambda q:q.group(1)+str(int(q.group(2))+1)+q.group(3),s)
    open(home,'w',encoding='utf-8').write(s)
# recherche
p=R+'/kit/extra-index.json'; raw=open(p,encoding='utf-8').read(); d=json.loads(raw)
if not any(x['u']==f'universite/physique/{sid}/' for x in d):
    d.append({"k":"simulation","t":titre,"s":"Physique · "+small,"u":f"universite/physique/{sid}/","m":"physique"})
    open(p,'w',encoding='utf-8').write(json.dumps(d,ensure_ascii=False)+('\n' if raw.endswith('\n') else ''))
os.system(f'python3 {R}/kit/build_phys_meta.py && python3 {R}/kit/sync_phys_sidebars.py')
print('ok',sid,'→',small)
