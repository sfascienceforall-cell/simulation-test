#!/usr/bin/env python3
"""Vignettes des simulations : python3 kit/thumbs.py <dossier de cours> [...] (ou --all). Écrit <cours>/thumbs/<id>.jpg (640×400)."""
import sys, os, re, glob, io
from playwright.sync_api import sync_playwright
from PIL import Image
R='/home/claude/simulations'
args=sys.argv[1:]
if args==['--all']: args=sorted(glob.glob(R+'/secondaire/*/*/'))+[R+'/universite/'+m+'/' for m in ('chimie','biologie','statistique','maths') if os.path.exists(R+'/universite/'+m+'/page.js')]
only=os.environ.get('ONLY')
with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
  pg=b.new_page(viewport={'width':1180,'height':1000},device_scale_factor=1)
  pg.route('**/fonts.*/**',lambda r:r.abort())
  for d in args:
    d=os.path.abspath(d); os.makedirs(d+'/thumbs',exist_ok=True); n=0
    for idx in sorted(glob.glob(d+'/*/index.html')):
      sid=os.path.basename(os.path.dirname(idx))
      if sid=='thumbs' or (only and only not in sid): continue
      try:
        pg.goto('file://'+idx); pg.wait_for_timeout(1100)
        el=pg.query_selector('.simhost .stage') or pg.query_selector('.simhost')
        png=el.screenshot()
        im=Image.open(io.BytesIO(png)).convert('RGB'); w,h=im.size; th=int(w*10/16)
        if h>th:
          sc=th/h; im2=im.resize((max(1,int(w*sc)),th),Image.LANCZOS); bg=Image.new('RGB',(w,th),(246,248,252)); bg.paste(im2,((w-im2.size[0])//2,0)); im=bg
        else:
          bg=Image.new('RGB',(w,th),(255,255,255)); bg.paste(im,(0,(th-h)//2)); im=bg
        im.resize((640,400),Image.LANCZOS).save(f'{d}/thumbs/{sid}.jpg',quality=82); n+=1
      except Exception as e: print('ERR',sid,e)
    print(os.path.relpath(d,R),n,flush=True)
  b.close()
