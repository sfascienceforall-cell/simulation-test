#!/usr/bin/env python3
"""Contrôle d'une page de cours : python3 kit/check-course.py <dossier> [--shots=/tmp/x] ."""
import sys, os, json
from playwright.sync_api import sync_playwright
d=os.path.abspath(sys.argv[1]); shots=[a.split('=',1)[1] for a in sys.argv[2:] if a.startswith('--shots=')]
res={"erreurs":[],"chapitres":[]}
with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
  pg=b.new_page(viewport={'width':1280,'height':900}); errs=[]
  pg.on('pageerror',lambda e:errs.append(str(e)[:200])); pg.route('**/fonts.*/**',lambda r:r.abort())
  pg.goto('file://'+d+'/index.html'); pg.wait_for_timeout(700)
  info=pg.evaluate("""()=>CH.map(c=>({id:c.id,t:c.t,ex:c.ex.length,sims:c.sims.length,theo:!!(c.th||c.sub),anim:!!(c.anim||c.sub),
     figs:(SFA._fg[c.id]||[]).length,raw:(SFA._ex[c.id]||[]).length,icon:!!(SFA._th[c.id]&&SFA._th[c.id].icon)}))""")
  for i,c in enumerate(info):
    n0=len(errs)
    pg.evaluate(f"location.hash='#c={i}&v=theo'"); pg.wait_for_timeout(250)
    if shots and i<3: os.makedirs(shots[0],exist_ok=True); pg.screenshot(path=f"{shots[0]}/theo-{i+1:02d}.png")
    pg.evaluate(f"location.hash='#c={i}&v=list'"); pg.wait_for_timeout(250)
    if shots and i<3: pg.screenshot(path=f"{shots[0]}/liste-{i+1:02d}.png",full_page=True)
    for j in range(c['ex']):
      pg.evaluate(f"location.hash='#c={i}&e={j}'"); pg.wait_for_timeout(60)
      pg.evaluate("toggleSol()"); pg.wait_for_timeout(60)
    c['erreurs']=errs[n0:][:3]
    pb=[]
    if not c['theo']: pb.append('pas de théorie')
    if not c['anim']: pb.append('pas de schéma animé')
    if not c['icon']: pb.append("pas d'icône")
    if c['figs']!=c['raw']: pb.append(f"devantures {c['figs']}/{c['raw']}")
    if c['erreurs']: pb.append('erreurs JS')
    c['problemes']=pb; res['chapitres'].append(c)
  res['erreurs']=sorted(set(errs))[:10]
  b.close()
for c in res['chapitres']: print(f"{c['id']:5} sims {c['sims']:2} ex {c['ex']:3} | "+(", ".join(c['problemes']) or "OK")+(" | "+str(c['erreurs']) if c['erreurs'] else ""))
print("TOTAL erreurs JS :",len(res['erreurs']), res['erreurs'][:5])
