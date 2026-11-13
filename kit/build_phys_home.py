"""Génère universite/physique/index.html : la page du cours de physique BA1, au même format que les autres cours
(en-tête du cours, liste des chapitres, bandeau de chapitre ‹ › avec Aperçu / Simulations / Théorie / Exercices).

Source des données : universite/physique/catalogue.html (les cartes, une <section> par chapitre ; c'est aussi la source de
build_phys_meta.py et add_phys_sim.py). Après un ajout de simulation : add_phys_sim.py → build_phys_meta.py → ce script.

Les nombres d'exercices par chapitre de la page d'exercices sont dans EXN (à mettre à jour si on ajoute des exercices)."""
import re, json, html, os, sys

R = sys.argv[1] if len(sys.argv) > 1 else os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src = open(R + '/universite/physique/catalogue.html', encoding='utf-8').read()

# chapitre de simulations -> chapitre (0-based) de la page d'exercices (même table que build_phys_meta.py)
EXO = {'MA': 1, 'PH1': 3, 'PH2': 5, 'PH3': 7, 'PH4': 8, 'OS': None, 'FL': 10, 'PH5': 9, 'PH6': 13, 'PH7': 13, 'PH8': 11,
       'PH9': 14, 'PH10': 14, 'PH11': 12, 'NU': 19, 'TH': 18}
# exercices par chapitre de la page d'exercices (index 0 à 19), relevés le 13/11/2026
EXN = [9, 20, 23, 9, 13, 11, 11, 22, 9, 9, 9, 9, 9, 9, 13, 30, 30, 15, 8, 8]
# chapitres d'exercices sans simulations propres : proposés à part
EXTRA = [(0, 'Rappels de trigonométrie'), (2, 'Projections dans les axes'), (6, 'Quantité de mouvement et impulsion'),
         (15, 'QCM 1 — révision tous chapitres'), (16, 'QCM 2 — révision tous chapitres'),
         (17, 'QCM 3 — impulsion, produits scalaire et vectoriel')]
BASE = 'https://sfascienceforall-cell.github.io/simulation-test/universite/physique/'


def txt(s):
    return html.unescape(re.sub(r'<[^>]+>', '', s)).strip()


chs = []
for m in re.finditer(r'<section id="([A-Z0-9]+)"><h2>([^<]*)<em[^>]*>[^<]*</em></h2><div class="grid">(.*?)</div></section>', src, re.S):
    sid, t, body = m.groups()
    sims = []
    for a in re.finditer(r'<a class="card" href="([^"]+)"[^>]*>\s*<img[^>]*src="([^"]+)"[^>]*>\s*<div>\s*<small>[^<]*</small>\s*<b>(.*?)</b>\s*<span>(.*?)</span>', body, re.S):
        href, img, b, d = a.groups()
        new = 'class=new' in b or 'class="new"' in b
        b = re.sub(r'<span[^>]*>.*?</span>', '', b)
        if href.startswith(BASE):
            href = href[len(BASE):]
        sid2 = href.rstrip('/').split('/')[-1]
        sims.append({'id': sid2, 'h': href, 'i': img, 't': txt(b), 'd': txt(d), 'n': 1 if new else 0})
    e = EXO.get(sid)
    chs.append({'k': sid, 't': txt(t), 'x': e, 'xn': EXN[e] if e is not None else 0, 's': sims})
assert len(chs) >= 15, len(chs)
NS = sum(len(c['s']) for c in chs)
NX = sum(EXN)
DATA = json.dumps({'ch': chs, 'extra': [{'x': i, 't': t, 'n': EXN[i]} for i, t in EXTRA]}, ensure_ascii=False)

PAGE = r'''<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Physique BA1 · SFA</title>
<meta name="description" content="Physique BA1 : __NC__ chapitres, __NS__ simulations interactives, théorie animée et __NX__ exercices et QCM corrigés. Gratuit, sans compte.">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Mulish:wght@400;500;600;700;800&display=swap">
<link rel="stylesheet" href="../../kit/course.css"><link rel="stylesheet" href="../../kit/sfa-nav.css">
<style>
/* page de cours de la physique : même gabarit que les cours du moteur (course.css), généré par kit/build_phys_home.py */
body{--acc:#185fa5}
a.ct{text-decoration:none;display:inline-flex;align-items:center}
.ct.off{opacity:.4;pointer-events:none}
.pg-bar{height:6px;background:#e9edf3;border-radius:99px;overflow:hidden;max-width:440px;margin-top:12px}.pg-bar i{display:block;height:100%;width:0;background:#2e6b55;border-radius:99px;transition:width .4s}
.pg-txt{font:600 12.5px var(--f-ui,Mulish,system-ui);color:#5f6b7a;margin-top:6px}
.chgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:12px}
.chcard{background:#fff;border:1.5px solid #e8e8e8;border-radius:12px;overflow:hidden;text-decoration:none;color:inherit;display:flex;flex-direction:column;transition:.15s}
.chcard:hover{border-color:#185fa5;box-shadow:0 4px 14px rgba(24,95,165,.10);transform:translateY(-2px)}
.chcard img{display:block;width:100%;aspect-ratio:16/9;object-fit:cover;object-position:top;background:#f7f8fa;border-bottom:1.5px solid #f0f0f0}
.chcard div{padding:10px 12px 12px;display:flex;flex-direction:column;gap:4px;flex:1}
.chcard small{font:800 10.5px var(--f-ui,Mulish);letter-spacing:.08em;text-transform:uppercase;color:#8a95a3}
.chcard b{font:800 14.5px/1.3 var(--f-ui,Mulish);color:#13233a}
.chcard .meta{margin-top:auto;display:flex;gap:6px;flex-wrap:wrap;padding-top:6px}
.tag{font:700 11.5px var(--f-ui,Mulish);border-radius:99px;padding:2px 9px;border:1.5px solid}
.tag.s{color:#185fa5;border-color:#b5d4f4;background:#e6f1fb}.tag.e{color:#BA7517;border-color:#f5c88f;background:#fdf3e4}.tag.v{color:#0F6E56;border-color:#9FE1CB;background:#e7f6ef}
.scard{position:relative}
.st{position:absolute;top:8px;left:8px;font:800 10.5px var(--f-ui,Mulish);border-radius:99px;padding:3px 8px;background:#fff;color:#5f6b7a;box-shadow:0 1px 3px rgba(15,27,45,.15)}
.st.seen{background:#e7f6ef;color:#0F6E56}.st.new{background:#f4c542;color:#5a4300}
.sfa-ex h1{font:800 22px/1.25 var(--f-ui,Mulish);margin:6px 2px 4px}
.sfa-ex p.sub{font-size:13.5px;color:#5f6b7a;margin:0 2px 14px}
.sfa-ex h3.peek{font:800 14px var(--f-ui,Mulish);margin:20px 2px 8px}
.sfa-ex .bigrow.three{margin:8px 0 4px}

.bigrow a.bigbtn{display:block;text-decoration:none;color:inherit;border:1.5px solid #e8e8e8;border-radius:12px;padding:24px 16px;text-align:center;font:700 16px var(--f-ui,Mulish);transition:.15s}
.bigrow a.bigbtn:hover{border-color:#185fa5;background:#f4f9ff;transform:translateY(-2px)}
.bigrow a.bigbtn small{display:block;font-weight:500;font-size:12.5px;color:#888;margin-top:6px}
.bigrow a.bigbtn.off{opacity:.45;pointer-events:none}
.xlist{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}
.xlist a{font:700 13px var(--f-ui,Mulish);text-decoration:none;color:#24428a;background:#eef3fd;border-radius:8px;padding:8px 11px}
.xlist a em{font-style:normal;color:#8a95a3;font-weight:600;margin-left:5px}
.empty{color:#5f6b7a;font-size:14px;padding:12px 2px}
.sfa-list a.done i{color:#0F6E56}
</style></head><body>
<header class="sfa-top"><div class="in"><a class="sfa-logo" href="https://sciencesforall.be"><i>SFA</i>Science For All</a><a class="sfa-cta" href="https://sciencesforall.be/concours">Prépa concours médecine</a></div></header>
<div class="sfa-page"><nav class="sfa-crumbs" aria-label="Fil d'Ariane"><a href="../../">Accueil</a>›<a href="../">Université</a>›<b>Physique BA1</b></nav>
<div class="sfa-grid"><main style="min-width:0">
<div class="sfa-titlecard crs-hero" id="hero"><div class="crs-hero-l"><div class="sfa-chips"><span class="sfa-chip">Université · BA1</span><span class="sfa-chip free">Gratuit</span></div>
<h1>Physique BA1</h1><p>Mécanique, fluides, gaz, ondes, optique, électricité et magnétisme. Chaque chapitre suit le même chemin : tu <b>manipules</b> les simulations, tu relis la <b>théorie</b> animée, puis tu t'<b>entraînes</b> sur des exercices corrigés du ★ au ★★★★★.</p>
<div class="crs-stats"><div><b>__NC__</b>chapitres</div><div><b>__NS__</b>simulations</div><div><b>__NX__</b>exercices et QCM</div></div>
<div class="pg-bar"><i id="pgBar"></i></div><div class="pg-txt" id="pgTxt"></div>
<div class="crs-search"><input id="q" type="search" placeholder="Rechercher une simulation, une notion…" aria-label="Rechercher"></div></div>
<a class="crs-feat" id="feat" href="bulles-laplace/"><small>À essayer en premier</small><img src="thumbs/bulles-laplace.jpg" alt=""><b>Deux bulles de savon reliées</b></a></div>
<section class="sfa-sim"><div class="sfa-ex">
<nav class="ch-tabs" id="chTabs" aria-label="Chapitre" hidden></nav>
<div id="vHome"><p class="sub">Choisis un chapitre. Chaque chapitre contient ses <b>simulations</b>, un <b>rappel théorique</b> avec schéma animé et ses <b>exercices</b> de difficulté croissante (★ → ★★★★★).</p><div class="chgrid" id="homeGrid"></div>
<h3 class="peek">Pour réviser et s'entraîner</h3><p class="sub">Les chapitres d'outils et les QCM de révision qui couvrent tout le cours.</p><div class="xlist" id="xList"></div></div>
<div id="vSearch" style="display:none"><h1 id="sTitle"></h1><div class="sgrid" id="sGrid"></div></div>
<div id="vChap" style="display:none"><h1 id="chTitle"></h1><p class="sub" id="chRes"></p>
<div class="bigrow three"><a class="bigbtn" id="bS" href="#"><span class="bi">▶</span>Simulations<small id="chSimN"></small></a><a class="bigbtn" id="bT" href="#"><span class="bi">∑</span>Théorie<small>rappel de notions + schéma animé</small></a><a class="bigbtn" id="bE" href="#"><span class="bi">★</span>Exercices<small id="chExN"></small></a></div>
<h3 class="peek">Les simulations du chapitre</h3><div class="sgrid" id="chGrid"></div></div>
<div id="vSims" style="display:none"><h1 id="smTitle"></h1><div class="sgrid" id="smGrid"></div></div>
</div></section></main>
<aside class="sfa-side"><div class="sfa-list"><h2>Chapitres<span>__NS__ simulations</span></h2><ol id="sideList"></ol>
<span class="sp-chap"><a href="exercices/">Tous les exercices et QCM →</a></span></div>
<div class="sfa-promo"><small>Envie d'aller plus loin ?</small><b>La prépa concours médecine SFA : le cours complet, les exercices type examen corrigés et le suivi.</b><a href="https://sciencesforall.be/concours">Voir la prépa concours médecine</a></div></aside></div></div>
<footer class="sfa-foot">Science For All · physique BA1 : simulations, théorie et exercices · <a href="catalogue.html">toutes les simulations sur une page</a></footer>
<script>window.PHYS=__DATA__;</script>
<script>
(function(){
"use strict";
var D=window.PHYS,CH=D.ch,ci=-1;
function esc(t){return String(t==null?"":t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/"/g,"&quot;");}
function norm(t){return String(t||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");}
/* progression : visites gardées par kit/sfa-progress.js et kit/sfa-shell.js (clé sfa_progress_v1, ce navigateur seulement) */
var V={};try{var p=JSON.parse(localStorage.getItem("sfa_progress_v1")||"null");if(p&&p.visits)Object.keys(p.visits).forEach(function(k){var m=/\/universite\/physique\/([^\/]+)\/(index\.html)?$/.exec(k);if(m)V[m[1]]=1;});}catch(e){}
function seen(s){return !!V[s.id];}
var ALL=[];CH.forEach(function(c,i){c.s.forEach(function(s){s.c=i;ALL.push(s);});});
var nSeen=ALL.filter(seen).length;
document.getElementById("pgBar").style.width=(100*nSeen/ALL.length).toFixed(1)+"%";
document.getElementById("pgTxt").textContent=nSeen?("Ta progression : "+nSeen+" simulation"+(nSeen>1?"s":"")+" ouverte"+(nSeen>1?"s":"")+" sur "+ALL.length+" (gardée dans ce navigateur)"):"Ta progression s'affichera ici dès ta première simulation (gardée dans ce navigateur, sans compte).";
function exo(c,v){return c.x==null?null:"exercices/#c="+c.x+"&v="+v;}
function card(s,showCh){var c=CH[s.c],b=seen(s)?'<span class="st seen">✓ Vue</span>':(s.n?'<span class="st new">Nouveau</span>':'<span class="st">À découvrir</span>');
 return '<a class="scard" href="'+esc(s.h)+'">'+b+'<img loading="lazy" src="'+esc(s.i)+'" alt="" onerror="this.style.visibility=\'hidden\'"><div><small>'+(showCh?"Ch. "+(s.c+1)+" · ":"")+esc(c.t.split(" : ")[0])+'</small><b>'+esc(s.t)+'</b><span>'+esc(s.d)+'</span></div></a>';}
/* liste latérale */
var side=document.getElementById("sideList");
CH.forEach(function(c,i){var n=c.s.filter(seen).length,li=document.createElement("li");li.innerHTML='<a href="#c='+i+'" data-c="'+i+'"'+(n&&n===c.s.length?' class="done"':'')+'><i>'+(n&&n===c.s.length?"✓":String(i+1).padStart(2,"0"))+'</i>'+esc(c.t)+'<em>'+c.s.length+(c.xn?" · "+c.xn:"")+'</em></a>';side.appendChild(li);});
/* accueil : grille des chapitres */
document.getElementById("homeGrid").innerHTML=CH.map(function(c,i){var n=c.s.filter(seen).length,im=c.s[0]?c.s[0].i:"";
 return '<a class="chcard" href="#c='+i+'"><img loading="lazy" src="'+esc(im)+'" alt="" onerror="this.style.visibility=\'hidden\'"><div><small>Chapitre '+(i+1)+'</small><b>'+esc(c.t)+'</b><span class="meta"><span class="tag s">'+c.s.length+' simulation'+(c.s.length>1?"s":"")+'</span>'+(c.xn?'<span class="tag e">théorie + '+c.xn+' exercices</span>':"")+(n?'<span class="tag v">'+n+' vue'+(n>1?"s":"")+'</span>':"")+'</span></div></a>';}).join("");
document.getElementById("xList").innerHTML=D.extra.map(function(x){return '<a href="exercices/#c='+x.x+'&v=list">'+esc(x.t)+'<em>'+x.n+'</em></a>';}).join("");
/* bandeau de chapitre, comme les autres cours */
function tabs(cur){var t=document.getElementById("chTabs");if(cur==null){t.hidden=true;return;}var c=CH[ci],th=exo(c,"theo"),li=exo(c,"list");
 function b(k,lab,href,n,off){return '<a class="ct'+(cur===k?" on":"")+(off?" off":"")+'" href="'+href+'">'+lab+(n!=null?"<em>"+n+"</em>":"")+'</a>';}
 t.innerHTML='<button type="button" class="ct-nav" data-go="'+(ci-1)+'"'+(ci?"":" disabled")+' title="Chapitre précédent" aria-label="Chapitre précédent">‹</button>'+
 '<button type="button" class="ct-ch" data-go="home" title="Tous les chapitres"><small>Chapitre '+(ci+1)+' / '+CH.length+'</small><b>'+esc(c.t)+'</b></button>'+
 '<div class="ct-seg">'+b("o","Aperçu","#c="+ci)+b("s","Simulations","#c="+ci+"&v=sims",c.s.length)+b("t","Théorie",th||"#",null,!th)+b("e","Exercices",li||"#",c.xn||null,!li)+'</div>'+
 '<button type="button" class="ct-nav" data-go="'+(ci+1)+'"'+(ci<CH.length-1?"":" disabled")+' title="Chapitre suivant" aria-label="Chapitre suivant">›</button>';
 t.hidden=false;}
document.getElementById("chTabs").addEventListener("click",function(e){var g=e.target.closest("[data-go]");if(!g||g.disabled)return;location.hash=g.dataset.go==="home"?"":"c="+g.dataset.go;});
function show(id,cur){["vHome","vSearch","vChap","vSims"].forEach(function(v){document.getElementById(v).style.display=v===id?"block":"none";});
 document.getElementById("hero").style.display=(id==="vHome"||id==="vSearch")?"":"none";tabs(cur);
 document.querySelectorAll(".sfa-list a[data-c]").forEach(function(a){a.classList.toggle("on",+a.dataset.c===ci&&id!=="vHome");});}
function openChap(i){ci=i;var c=CH[i];document.getElementById("chTitle").textContent=c.t;
 var n=c.s.filter(seen).length;document.getElementById("chRes").textContent="Chapitre "+(i+1)+" sur "+CH.length+" · "+c.s.length+" simulation"+(c.s.length>1?"s":"")+(n?" · "+n+" déjà ouverte"+(n>1?"s":""):"");
 document.getElementById("chSimN").textContent=c.s.length+" simulation"+(c.s.length>1?"s":"")+" à manipuler";
 var th=exo(c,"theo"),li=exo(c,"list");
 document.getElementById("bS").href="#c="+i+"&v=sims";
 var bT=document.getElementById("bT"),bE=document.getElementById("bE");bT.href=th||"#";bE.href=li||"#";bT.classList.toggle("off",!th);bE.classList.toggle("off",!li);
 document.getElementById("chExN").textContent=li?c.xn+" exercices, du plus simple à l'examen":"bientôt";
 document.getElementById("chGrid").innerHTML=c.s.map(function(s){return card(s);}).join("");
 show("vChap","o");}
function openSims(i){ci=i;var c=CH[i];document.getElementById("smTitle").textContent=c.t+" — simulations";document.getElementById("smGrid").innerHTML=c.s.map(function(s){return card(s);}).join("");show("vSims","s");}
function goHome(){ci=-1;show("vHome",null);}
var q=document.getElementById("q");
function search(v){var n=norm(v).trim();if(!n){route();return;}
 var r=ALL.filter(function(s){return norm(s.t+" "+s.d+" "+CH[s.c].t).indexOf(n)>=0;}),cs=CH.map(function(c,i){return [c,i];}).filter(function(p){return norm(p[0].t).indexOf(n)>=0;});
 document.getElementById("sTitle").textContent=r.length+" simulation"+(r.length>1?"s":"")+" et "+cs.length+" chapitre"+(cs.length>1?"s":"")+" pour « "+v.trim()+" »";
 document.getElementById("sGrid").innerHTML=cs.map(function(p){return '<a class="scard chlink" href="#c='+p[1]+'"><div><small>Chapitre '+(p[1]+1)+'</small><b>'+esc(p[0].t)+'</b><span>Simulations, théorie et exercices →</span></div></a>';}).join("")+r.map(function(s){return card(s,true);}).join("")||'<p class="empty">Rien trouvé. Essaie un autre mot (ex. « pression », « lentille », « ressort »).</p>';
 ci=-1;show("vSearch",null);}
q.addEventListener("input",function(){search(q.value);});
function route(){var h=location.hash.replace(/^#/,""),m=/c=(\d+)/.exec(h);
 if(m&&CH[+m[1]]){var i=+m[1];if(/v=sims/.test(h))openSims(i);else openChap(i);window.scrollTo(0,0);return;}
 /* anciens liens vers une section du catalogue (#FL, #PH2…) depuis les pages de simulation */
 for(var k=0;k<CH.length;k++)if(CH[k].k===h){openChap(k);return;}
 goHome();}
addEventListener("hashchange",route);route();
})();
</script>
<script src="../../kit/sfa-progress.js"></script><script src="../../kit/sfa-nav.js"></script></body></html>
'''
out = (PAGE.replace('__DATA__', DATA).replace('__NC__', str(len(chs))).replace('__NS__', str(NS)).replace('__NX__', str(NX)))
open(R + '/universite/physique/index.html', 'w', encoding='utf-8').write(out)
print('physique/index.html :', len(chs), 'chapitres,', NS, 'simulations,', NX, 'exercices')
