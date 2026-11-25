#!/usr/bin/env python3
"""Ouvre toutes les pages de simulation d'un dossier et signale les erreurs.

Usage :
  python3 kit/test_sims.py secondaire/physique/5e
  python3 kit/test_sims.py universite/physique --only fils-paralleles-3d,ascenseur
  python3 kit/test_sims.py secondaire/chimie/5e --only c5-c03-glace --captures ../captures --suffixe apres

Pour chaque page : erreurs JavaScript, canevas absent, débordement horizontal à 420 px.
Avec --captures : capture de la simulation à 1280 px (<id>-<suffixe>.png) et à 420 px (<id>-mobile.png).
Il faut Playwright : pip3 install playwright && python3 -m playwright install chromium
"""
import argparse, glob, os, sys
from playwright.sync_api import sync_playwright

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def pages(dossier, only):
    d = os.path.join(RACINE, dossier)
    for f in sorted(glob.glob(os.path.join(d, '*', 'index.html'))):
        sid = os.path.basename(os.path.dirname(f))
        if sid in ('thumbs', 'exercices') or sid.startswith('_'):
            continue
        if only and sid not in only:
            continue
        txt = open(f, encoding='utf-8').read()
        if 'sim-page.js' in txt or 'class="sfa-sim"' in txt:
            yield sid, f

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('dossier')
    ap.add_argument('--only', default='')
    ap.add_argument('--captures', default='')
    ap.add_argument('--suffixe', default='apres')
    a = ap.parse_args()
    only = set(x for x in a.only.split(',') if x)
    if a.captures:
        os.makedirs(a.captures, exist_ok=True)
    pb, n = [], 0
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path=os.environ.get('CHROME') or None,
                              args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'])
        for sid, f in pages(a.dossier, only):
            for w in (1280, 420):
                pg = b.new_page(viewport={'width': w, 'height': 950})
                errs = []
                pg.on('pageerror', lambda e: errs.append(str(e)[:160]))
                pg.goto('file://' + f)
                pg.wait_for_timeout(900)
                try:
                    bt = pg.query_selector('.sim-body button.btn.pri')
                    if bt:
                        bt.click(); pg.wait_for_timeout(500)
                except Exception:
                    pass
                cv = pg.evaluate("!!document.querySelector('.sim-body canvas, .sfa-sim canvas, .sfa-sim svg')")
                over = pg.evaluate("document.documentElement.scrollWidth > innerWidth + 2")
                if errs or not cv or (w == 420 and over):
                    pb.append((sid, w, errs, 'pas de canevas' if not cv else '', 'déborde à 420 px' if (w == 420 and over) else ''))
                if a.captures:
                    pg.evaluate("scrollTo(0,0)")
                    el = pg.query_selector('.sim-body') or pg.query_selector('.sfa-sim')
                    if el:
                        nom = f"{sid}-{a.suffixe}.png" if w == 1280 else f"{sid}-mobile.png"
                        el.screenshot(path=os.path.join(a.captures, nom))
                pg.close()
            n += 1
        b.close()
    print(f'{n} pages testées, {len(pb)} problème(s)')
    for x in pb:
        print('  ', x)
    sys.exit(1 if pb else 0)

if __name__ == '__main__':
    main()
