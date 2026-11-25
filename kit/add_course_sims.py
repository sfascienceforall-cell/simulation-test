#!/usr/bin/env python3
"""Branche un NOUVEAU fichier de simulations sur un cours à moteur, sans régénérer le reste du cours.
Usage : python3 kit/add_course_sims.py universite/chimie sims-V1A.js
 - ajoute <script src="sims-V1A.js"> dans <cours>/index.html (après le dernier sims-*.js) ;
 - crée <cours>/<id>/index.html pour chaque SFA.sim({id:…}) du fichier, sur le modèle d'une page existante du cours.
Ne touche à aucune autre page (build_course.py, lui, réécrit toutes les pages : ne pas l'utiliser sur un cours existant)."""
import sys, os, re, glob
cours, fic = sys.argv[1].rstrip('/'), sys.argv[2]
src = open(os.path.join(cours, fic), encoding='utf-8').read()
ids = re.findall(r'SFA\.sim\(\{\s*id\s*:\s*["\']([^"\']+)["\']', src)
if not ids: sys.exit('aucun SFA.sim({id:…}) trouvé dans ' + fic)
idx = os.path.join(cours, 'index.html'); h = open(idx, encoding='utf-8').read()
if f'src="{fic}"' not in h:
    last = list(re.finditer(r'<script src="sims-[^"]+"></script>\n?', h))[-1]
    h = h[:last.end()] + f'<script src="{fic}"></script>\n' + h[last.end():]
    open(idx, 'w', encoding='utf-8').write(h)
modele = None
for d in sorted(glob.glob(os.path.join(cours, '*', 'index.html'))):
    t = open(d, encoding='utf-8').read()
    if 'window.SFA_SIMPAGE=' in t: modele = t; break
if not modele: sys.exit('pas de page de simulation modèle dans ' + cours)
for sid in ids:
    p = re.sub(r'window\.SFA_SIMPAGE="[^"]*"', f'window.SFA_SIMPAGE="{sid}"', modele)
    p = re.sub(r'<script src="\.\./sims-[^"]+"></script>', f'<script src="../{fic}"></script>', p, count=1)
    os.makedirs(os.path.join(cours, sid), exist_ok=True)
    open(os.path.join(cours, sid, 'index.html'), 'w', encoding='utf-8').write(p)
print(f'{fic} branché sur {cours} : {len(ids)} page(s) : ' + ', '.join(ids))
