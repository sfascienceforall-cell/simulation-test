#!/usr/bin/env python3
"""Crée une page de test universite/physique/_tmp-<nom>/index.html à partir d'un corps <section class="sfa-sim">…</section>.
Usage : python3 kit/tmp_phys_page.py a-faire/travail/ph-reynolds.html   (supprimer le dossier _tmp-… après les tests)"""
import sys, os
R = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'universite', 'physique')
src = open(os.path.join(R, 'condensateurs-serie-parallele', 'index.html'), encoding='utf-8').read()
a = src.index('<section class="sfa-sim">'); b = src.index('</section></main>') + len('</section>')
for f in sys.argv[1:]:
    d = os.path.join(R, '_tmp-' + os.path.basename(f).rsplit('.', 1)[0]); os.makedirs(d, exist_ok=True)
    open(os.path.join(d, 'index.html'), 'w', encoding='utf-8').write(src[:a] + open(f, encoding='utf-8').read().strip() + src[b:])
    print('test :', d)
