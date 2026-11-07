#!/usr/bin/env python3
"""Génère, pour un cours (dossier avec page.js, sims-NN.js, exos-NN.js, theo-NN.js) :
   - index.html (page de cours : chapitres → simulations / théorie / exercices)
   - <id>/index.html pour chaque simulation du moteur SFA
   Usage : build_course.py <dossier du cours> <chemin relatif vers la racine du site> [--legacy fichier.js]"""
import sys, os, re, glob, json
d=os.path.abspath(sys.argv[1]); root=sys.argv[2].rstrip('/')+'/'
legacy=[a.split('=',1)[1] for a in sys.argv[3:] if a.startswith('--legacy=')]
FONTS='<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Mulish:wght@400;500;600;700;800&family=STIX+Two+Text:ital,wght@0,400;0,600;1,400&family=JetBrains+Mono:wght@500&display=swap">'
sims=sorted(glob.glob(d+'/sims-*.js')); exos=sorted(glob.glob(d+'/exos-*.js')); theo=sorted(glob.glob(d+'/theo-*.js'))
b=lambda p: os.path.basename(p)
head=lambda r: f'<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>SFA</title>{FONTS}<link rel="stylesheet" href="{r}kit/course.css"><link rel="stylesheet" href="{r}kit/sfa-nav.css">'
# page de cours
h=head(root)+'</head><body><div id="app"></div>\n'
h+=f'<script src="{root}kit/course-ui.js"></script>\n' if False else ''
h+=f'<script src="{root}kit/course-helpers.js"></script>\n'
for l in legacy: h+=f'<script src="{root}{l}"></script>\n'
h+=f'<script src="{root}kit/sfa-nav.js"></script>\n<script src="{root}kit/course-engine.js"></script>\n<script src="page.js"></script>\n<script src="course-meta.js"></script>\n'
for f in sims+exos+theo: h+=f'<script src="{b(f)}"></script>\n'
h+='</body></html>\n'
open(d+'/index.html','w').write(h)
# pages de simulation
n=0
for f in sims:
    t=open(f).read()
    for sid in re.findall(r'SFA\.sim\(\{\s*id\s*:\s*"([^"]+)"',t):
        os.makedirs(f'{d}/{sid}',exist_ok=True)
        r='../'+root
        p=head(r)+f'<link rel="stylesheet" href="{r}secondaire/_lib/sfa-sec.css"><script>window.SFA_SIMPAGE={json.dumps(sid)};</script>'
        p+=f'<script src="{r}secondaire/_lib/sfa-sec.js"></script><script src="../page.js"></script><script src="../course-meta.js"></script><script src="../{b(f)}"></script><script src="{r}kit/sfa-nav.js"></script><script src="{r}kit/sim-page.js"></script>'
        p+='</head><body class="simpage"><div id="app"></div></body></html>\n'
        open(f'{d}/{sid}/index.html','w').write(p); n+=1
print(d, 'sims', n)
