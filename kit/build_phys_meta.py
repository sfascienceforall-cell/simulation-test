"""Génère universite/physique/phys-meta.js à partir de l'accueil de la physique (chapitres, simulations, chapitre d'exercices)."""
import re,json,html,sys
import os
root=sys.argv[1] if len(sys.argv)>1 else os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
s=open(root+'/universite/physique/index.html',encoding='utf-8').read()
EXO={'MA':1,'PH1':3,'PH2':5,'PH3':7,'PH4':8,'OS':None,'FL':10,'TH':None,'PH5':9,'PH6':13,'PH7':13,'PH8':11,'PH9':14,'PH10':14,'PH11':12,'NU':None}
chs=[]
for m in re.finditer(r'<section id="([A-Z0-9]+)"><h2>([^<]*)<em[^>]*>[^<]*</em></h2><div class="grid">(.*?)</div></section>',s,re.S):
    sid,t,body=m.groups(); sims=[]
    for a in re.finditer(r'<a class="card" href="([^"]+)"[^>]*>.*?<b>(.*?)</b>',body,re.S):
        href,b=a.groups(); b=re.sub(r'<span[^>]*>.*?</span>','',b)
        sims.append({'id':href.rstrip('/').split('/')[-1],'t':html.unescape(re.sub('<[^>]+>','',b)).strip()})
    chs.append({'id':sid,'t':html.unescape(t).strip(),'exo':EXO.get(sid),'sims':sims})
assert len(chs)>=15,len(chs)
out='/* généré par build_phys_meta.py : chapitres de la physique BA1 (ordre de l\'accueil) */\nwindow.SFA_PHYS='+json.dumps({'cours':'Physique BA1','matiere':'physique','chapitres':chs},ensure_ascii=False)+';\n'
open(root+'/universite/physique/phys-meta.js','w',encoding='utf-8').write(out)
print(len(chs),sum(len(c['sims']) for c in chs))
