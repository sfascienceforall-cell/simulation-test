/* Chapitre 4 · Tableau périodique : métaux et non-métaux */
(function(){
var D = SFA.draw, P = D.palette, T = D.text, F = SFA.fmt;
function rr(c,x,y,w,h,fill,stroke,lw,r){ var g=c.ctx; g.save(); g.beginPath(); if(g.roundRect) g.roundRect(x,y,w,h,r||6); else g.rect(x,y,w,h); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1.5;g.stroke();} g.restore(); }
function circ(c,x,y,r,fill,stroke,lw){ var g=c.ctx; g.beginPath(); g.arc(x,y,r,0,6.2832); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1;g.stroke();} }
function rng(seed){ var a=seed>>>0; return function(){ a|=0; a=a+0x6D2B79F5|0; var t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }

/* Z : symbole, nom, masse, électronégativité, rayon (pm), état à 20 °C, catégorie, période, groupe */
var E = [null,
 ["H","hydrogène",1.01,2.20,25,"g","nm",1,1],["He","hélium",4.00,null,31,"g","nob",1,18],
 ["Li","lithium",6.94,0.98,145,"s","alc",2,1],["Be","béryllium",9.01,1.57,105,"s","ate",2,2],["B","bore",10.81,2.04,85,"s","meta",2,13],["C","carbone",12.01,2.55,70,"s","nm",2,14],["N","azote",14.01,3.04,65,"g","nm",2,15],["O","oxygène",16.00,3.44,60,"g","nm",2,16],["F","fluor",19.00,3.98,50,"g","hal",2,17],["Ne","néon",20.18,null,38,"g","nob",2,18],
 ["Na","sodium",22.99,0.93,180,"s","alc",3,1],["Mg","magnésium",24.31,1.31,150,"s","ate",3,2],["Al","aluminium",26.98,1.61,125,"s","mp",3,13],["Si","silicium",28.09,1.90,110,"s","meta",3,14],["P","phosphore",30.97,2.19,100,"s","nm",3,15],["S","soufre",32.06,2.58,100,"s","nm",3,16],["Cl","chlore",35.45,3.16,100,"g","hal",3,17],["Ar","argon",39.95,null,71,"g","nob",3,18],
 ["K","potassium",39.10,0.82,220,"s","alc",4,1],["Ca","calcium",40.08,1.00,180,"s","ate",4,2],
 ["Sc","scandium",44.96,1.36,160,"s","tra",4,3],["Ti","titane",47.87,1.54,140,"s","tra",4,4],["V","vanadium",50.94,1.63,135,"s","tra",4,5],["Cr","chrome",52.00,1.66,140,"s","tra",4,6],["Mn","manganèse",54.94,1.55,140,"s","tra",4,7],["Fe","fer",55.85,1.83,140,"s","tra",4,8],["Co","cobalt",58.93,1.88,135,"s","tra",4,9],["Ni","nickel",58.69,1.91,135,"s","tra",4,10],["Cu","cuivre",63.55,1.90,135,"s","tra",4,11],["Zn","zinc",65.38,1.65,135,"s","tra",4,12],
 ["Ga","gallium",69.72,1.81,130,"s","mp",4,13],["Ge","germanium",72.63,2.01,125,"s","meta",4,14],["As","arsenic",74.92,2.18,115,"s","meta",4,15],["Se","sélénium",78.97,2.55,115,"s","nm",4,16],["Br","brome",79.90,2.96,115,"l","hal",4,17],["Kr","krypton",83.80,null,88,"g","nob",4,18]
];
var CAT = {alc:["Alcalins","#e76f51"], ate:["Alcalino-terreux","#f4a261"], tra:["Métaux de transition","#a3c4bc"], mp:["Autres métaux","#8ab6d6"], meta:["Métalloïdes","#d4a5c9"], nm:["Autres non-métaux","#e9d985"], hal:["Halogènes","#2a9d8f"], nob:["Gaz nobles","#9d8cd6"]};
var MET = {alc:1,ate:1,tra:1,mp:1};
var STATE = {s:["Solide","#b8c4d4"], l:["Liquide","#2a9d8f"], g:["Gaz","#f4a261"]};
function valence(z){ var e=E[z], g=e[8]; if(g>=3&&g<=12) return null; if(z===2) return 2; return g<=2?g:g-10; }
function metalType(z){ var c=E[z][6]; return MET[c]?"Métal":(c==="meta"?"Métalloïde":"Non-métal"); }
function lerp(a,b,t){ return Math.round(a+(b-a)*t); }
function seqColor(t){ t=Math.max(0,Math.min(1,t)); var c0=[238,243,251], c1=[30,63,143]; return "rgb("+lerp(c0[0],c1[0],t)+","+lerp(c0[1],c1[1],t)+","+lerp(c0[2],c1[2],t)+")"; }

/* ---------- 1 · Tableau interactif ---------- */
var PROP = {
  cat:"Famille chimique", met:"Métal / non-métal", etat:"État à 20 °C", val:"Électrons de valence", en:"Électronégativité", ray:"Rayon atomique (pm)", mas:"Masse atomique (u)"
};
var TREND = {
  cat:"Les familles forment des colonnes (alcalins : groupe 1 ; halogènes : groupe 17 ; gaz nobles : groupe 18) : elles ont des propriétés voisines.",
  met:"Les métaux sont à gauche et au centre, les non-métaux à droite et en haut ; les métalloïdes (B, Si, Ge, As) forment un « escalier » entre les deux.",
  etat:"À 20 °C : presque tous les métaux sont solides ; les gaz sont des non-métaux ; le brome est le seul non-métal liquide (et le mercure, plus loin, le seul métal liquide).",
  val:"Le nombre d'électrons de valence est égal au numéro du groupe pour les groupes 1 et 2, puis au numéro du groupe moins 10 pour les groupes 13 à 18 (He : 2). Pour les métaux de transition, il n'y a pas de règle simple à ce niveau.",
  en:"L'électronégativité augmente de gauche à droite dans une période et de bas en haut dans un groupe : le fluor est le plus électronégatif. Les gaz nobles n'ont pas de valeur (grisés).",
  ray:"Le rayon atomique diminue de gauche à droite dans une période et augmente de haut en bas dans un groupe (valeurs approximatives, méthodes de mesure différentes pour les gaz nobles).",
  mas:"La masse atomique augmente avec Z (tableau classé par numéro atomique, pas par masse : le tableau complet a de rares inversions, comme Ar et K)."
};
SFA.sim({
  id:"c3-c04-tableau", ch:"c04", tag:"Classique",
  titre:"Tableau périodique interactif : colorie par propriété",
  resume:"Colorie les 36 premiers éléments selon la famille, l'état, l'électronégativité, le rayon… et repère les tendances.",
  but:"Choisis une propriété à colorier, puis clique sur un élément (ou utilise le curseur). Repère les tendances le long d'une période et dans un groupe.",
  aRetenir:"Le tableau classe les éléments par numéro atomique Z croissant. Les colonnes (groupes) rassemblent des éléments de propriétés voisines et de même nombre d'électrons de valence ; les lignes (périodes) correspondent au remplissage des couches. Les métaux sont à gauche, les non-métaux à droite.",
  piege:"Le tableau n'est pas un classement par masse (c'est par Z). Ne confonds pas période (ligne) et groupe (colonne). Seuls les 36 premiers éléments sont représentés ici.",
  build:function(k,S){
    var c = k.canvas(0,{ratio:0.62});
    var pr = k.select("Colorier selon", Object.keys(PROP).map(function(i){return [i,PROP[i]];}), "cat");
    var zs = k.slider("Élément choisi (Z)", 1, 36, 1, 11, "");
    var ro = k.readouts(["Élément","Période · groupe","Famille","Type","Valence","État (20 °C)"]);
    var nt = k.note("","");
    function geom(){ var W=c.W, cs=Math.min((W-12)/18,46); return {cs:cs, x0:(W-18*cs)/2, y0:8}; }
    c.pointer(function(type,pt){ if(type==="up"||type==="move") return; var g=geom(), col=Math.floor((pt.x-g.x0)/g.cs)+1, row=Math.floor((pt.y-g.y0)/g.cs)+1;
      for(var z=1;z<=36;z++){ if(E[z][8]===col&&E[z][7]===row){ zs.set(z); k.redraw(); } } });
    k.draw(function(){
      c.clear(); var g=geom(), cs=g.cs, W=c.W, p=pr.value, Z=zs.value, ctx=c.ctx;
      function range(idx){ var mn=1e9,mx=-1e9; for(var z=1;z<=36;z++){ var v=E[z][idx]; if(v!==null){ mn=Math.min(mn,v); mx=Math.max(mx,v);} } return [mn,mx]; }
      var rg = p==="en"?range(3):(p==="ray"?range(4):(p==="mas"?range(2):[1,8]));
      for(var z=1;z<=36;z++){ var e=E[z], x=g.x0+(e[8]-1)*cs, y=g.y0+(e[7]-1)*cs, fill, dark=false;
        if(p==="cat") fill=CAT[e[6]][1];
        else if(p==="met"){ var mt=metalType(z); fill=mt==="Métal"?"#8ab6d6":(mt==="Métalloïde"?"#d4a5c9":"#e9d985"); }
        else if(p==="etat") fill=STATE[e[5]][1];
        else { var v = p==="val"?valence(z):(p==="en"?e[3]:(p==="ray"?e[4]:e[2]));
          if(v===null||v===undefined) fill="#e6e9ee"; else { var t=(v-rg[0])/(rg[1]-rg[0]); fill=seqColor(t); dark=t>0.55; } }
        ctx.fillStyle=fill; ctx.fillRect(x+1,y+1,cs-2,cs-2);
        T(c,e[0],x+cs/2,y+cs/2,{size:Math.min(15,cs*0.5),color:dark?"#fff":"#0f1b2d"});
        if(z===Z){ ctx.strokeStyle=P.red; ctx.lineWidth=2.5; ctx.strokeRect(x+1.5,y+1.5,cs-3,cs-3); } }
      /* fiche de l'élément choisi, dans le vide du tableau */
      var eZ=E[Z], kx=g.x0+2.2*cs, kw=9.6*cs, ky=g.y0+0.1*cs, kh=3*cs-4, big=Math.min(kh*0.62,40);
      D.panel(c,kx,ky,kw,kh,{shadow:false,fill:"#fff",stroke:CAT[eZ[6]][1]});
      ctx.fillStyle=CAT[eZ[6]][1]; ctx.fillRect(kx+1,ky+10,4,kh-20);
      T(c,eZ[0],kx+kw*0.22,ky+kh*0.5,{size:big,color:P.mat,math:true});
      T(c,String(Z),kx+10,ky+11,{size:11,color:P.grey,align:"left"});
      T(c,eZ[1],kx+kw*0.42,ky+kh*0.3,{size:Math.max(11,Math.min(16,cs*0.5)),color:P.ink,align:"left"});
      T(c,F(eZ[2],2)+" u",kx+kw*0.42,ky+kh*0.56,{size:Math.max(11,cs*0.45),color:P.grey,align:"left"});
      T(c,(cs<26?"P":"période ")+eZ[7]+" · "+(cs<26?"G":"groupe ")+eZ[8],kx+kw*0.42,ky+kh*0.8,{size:Math.max(10,Math.min(13,cs*0.42)),color:P.grey,align:"left"});
      // légende
      var ly=g.y0+4*cs+14;
      if(p==="cat"||p==="met"||p==="etat"){ var items = p==="cat"?Object.keys(CAT).map(function(i){return CAT[i];}):(p==="met"?[["Métal","#8ab6d6"],["Métalloïde","#d4a5c9"],["Non-métal","#e9d985"]]:Object.keys(STATE).map(function(i){return STATE[i];}));
        var lx=g.x0, yy=ly; ctx.font="600 12px Mulish, system-ui"; ctx.textAlign="left"; ctx.textBaseline="middle";
        items.forEach(function(it){ var w=ctx.measureText(it[0]).width+26; if(lx+w>W-6){lx=g.x0;yy+=20;} ctx.fillStyle=it[1]; ctx.fillRect(lx,yy-6,12,12); ctx.fillStyle="#0f1b2d"; ctx.fillText(it[0],lx+17,yy); lx+=w+8; }); }
      else { var bw=Math.min(260,W-40); for(var i=0;i<bw;i++){ ctx.fillStyle=seqColor(i/bw); ctx.fillRect(g.x0+i,ly-6,1,12); }
        var lo=rg[0], hi=rg[1]; T(c,F(lo,p==="en"?2:(p==="mas"?0:0)),g.x0,ly+16,{size:12,color:P.grey,align:"left"}); T(c,F(hi,p==="en"?2:0),g.x0+bw,ly+16,{size:12,color:P.grey,align:"right"}); T(c,"gris : pas de valeur",g.x0+bw/2,ly+16,{size:12,color:P.grey}); }
      var e=E[Z];
      ro.set(0,e[0]+" · "+e[1]+" (Z = "+Z+")"); ro.set(1,"période "+e[7]+" · groupe "+e[8]); ro.set(2,CAT[e[6]][0]); ro.set(3,metalType(Z));
      var v=valence(Z); ro.set(4,v===null?"variable":String(v)); ro.set(5,STATE[e[5]][0]);
      nt.set("<b>Tendance :</b> "+TREND[p]+(p==="en"?"  <b>"+e[1]+"</b> : "+(e[3]===null?"pas de valeur (gaz noble)":F(e[3],2))+".":"")+(p==="ray"?"  <b>"+e[1]+"</b> : ≈ "+e[4]+" pm.":"")+(p==="mas"?"  <b>"+e[1]+"</b> : "+F(e[2],2)+" u.":""),"");
    });
  }
});

/* ---------- aides de dessin (refonte 21/11/2026) : sphères ombrées, projection 3D, décor de labo ---------- */
function shadeX(hex,f){ var m=/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex); if(!m) return hex; var v=[1,2,3].map(function(i){ var x=parseInt(m[i],16); x=f<0?x*(1+f):x+(255-x)*f; return Math.max(0,Math.min(255,Math.round(x))); }); return "rgb("+v.join(",")+")"; }
function ball3(g,x,y,r,hex,al){ if(!(r>0)||!isFinite(x)||!isFinite(y)) return; g.save(); if(al!=null) g.globalAlpha=al; var gr=g.createRadialGradient(x-r*.38,y-r*.42,r*.05,x,y,r*1.05); gr.addColorStop(0,shadeX(hex,.75)); gr.addColorStop(.45,hex); gr.addColorStop(1,shadeX(hex,-.45)); g.fillStyle=gr; g.beginPath(); g.arc(x,y,r,0,6.2832); g.fill(); g.restore(); }
function rot3(p,a,b){ var x=p[0]*Math.cos(a)+p[2]*Math.sin(a), z=-p[0]*Math.sin(a)+p[2]*Math.cos(a), y=p[1]; return [x,y*Math.cos(b)-z*Math.sin(b),y*Math.sin(b)+z*Math.cos(b)]; }
function proj3(p,st,sc,cx,cy){ var r=rot3(p,st.a,st.b), s=1/(1-r[2]*0.12); return {x:cx+r[0]*sc*s, y:cy-r[1]*sc*s, z:r[2], s:s}; }
function mixHex(a,b,t){ function p(h){ return [parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)]; } var x=p(a), y=p(b); t=Math.max(0,Math.min(1,t)); return "rgb("+x.map(function(v,i){ return Math.round(v+(y[i]-v)*t); }).join(",")+")"; }
/* mur carrelé de labo + paillasse sombre ; renvoie rien */
function labWall(c, benchY){ var g=c.ctx, W=c.W, H=c.H, gr=g.createLinearGradient(0,0,0,benchY); gr.addColorStop(0,"#eef2f6"); gr.addColorStop(1,"#dde4ec"); g.save(); g.fillStyle=gr; g.fillRect(0,0,W,benchY);
  g.strokeStyle="rgba(255,255,255,.55)"; g.lineWidth=1; for(var y=18;y<benchY;y+=26){ g.beginPath(); g.moveTo(0,y); g.lineTo(W,y); g.stroke(); } for(var x=12;x<W;x+=34){ g.beginPath(); g.moveTo(x,0); g.lineTo(x,benchY); g.stroke(); }
  var gb=g.createLinearGradient(0,benchY,0,H); gb.addColorStop(0,"#4a5566"); gb.addColorStop(.12,"#3a4352"); gb.addColorStop(1,"#2b323d"); g.fillStyle=gb; g.fillRect(0,benchY,W,H-benchY); g.fillStyle="rgba(255,255,255,.18)"; g.fillRect(0,benchY,W,2); g.restore(); }
/* cadre de sorbonne (hotte) avec vitre de protection */
function hood(c,x,y,w,h){ var g=c.ctx; g.save(); var gr=g.createLinearGradient(0,y,0,y+16); gr.addColorStop(0,"#7b8696"); gr.addColorStop(1,"#4d5766"); g.fillStyle=gr; g.fillRect(x,y,w,16); g.fillStyle="#5d6878"; g.fillRect(x,y+16,7,h-16); g.fillRect(x+w-7,y+16,7,h-16);
  g.fillStyle="rgba(200,225,245,.10)"; g.fillRect(x+7,y+16,w-14,h-16); g.strokeStyle="rgba(255,255,255,.35)"; g.lineWidth=6; g.beginPath(); g.moveTo(x+w*.62,y+22); g.lineTo(x+w*.5,y+h*.45); g.stroke(); g.lineWidth=2.5; g.beginPath(); g.moveTo(x+w*.7,y+22); g.lineTo(x+w*.6,y+h*.38); g.stroke();
  g.font="800 9px Mulish, system-ui, sans-serif"; g.fillStyle="rgba(255,255,255,.85)"; g.textAlign="left"; g.textBaseline="middle"; g.fillText("SORBONNE · VITRE BAISSÉE",x+10,y+8); g.restore(); }

/* ---------- 2 · Les alcalins dans l'eau ---------- */
/* mel : teinte du métal ; fl : couleur de la flamme (dihydrogène qui brûle, teinté par le métal) ; zip : vitesse de course à la surface ;
   dur : durée de base de la réaction (s, qualitative) ; v0 : vitesse des éclaboussures ; dr : éclaboussures par seconde ; sh : couches électroniques */
var ALC = {
  li:{n:"Lithium", s:"Li", z:3, r:145, en:0.98, rho:0.53, rate:1, per:2, mel:"#b9c0c9", fl:null, zip:0.35, dur:9, v0:0, dr:0, sh:[2,1], txt:"Le morceau flotte et réagit calmement : bulles régulières de dihydrogène, il ne fond pas."},
  na:{n:"Sodium", s:"Na", z:11, r:180, en:0.93, rho:0.97, rate:2, per:3, mel:"#c9ced6", fl:null, zip:1.5, dur:6, v0:0.55, dr:5, sh:[2,8,1], txt:"Le morceau fond en une petite boule brillante qui file à la surface en sifflant, avec un fort dégagement de dihydrogène."},
  k:{n:"Potassium", s:"K", z:19, r:220, en:0.82, rho:0.86, rate:3, per:4, mel:"#c4c9d2", fl:"#b07ae6", flN:"lilas", zip:2.6, dur:3.6, v0:0.9, dr:14, sh:[2,8,8,1], burst:{at:0.96, n:16}, txt:"Il file encore plus vite et le dihydrogène s'enflamme spontanément : flamme lilas, petite détonation à la fin."},
  rb:{n:"Rubidium", s:"Rb", z:37, r:235, en:0.82, rho:1.53, rate:4, per:5, mel:"#d3d4cf", fl:"#d0457e", flN:"rouge-violet", zip:0, dur:2.2, v0:1.35, dr:40, sh:[2,8,18,8,1], burst:{at:0.22, n:45}, txt:"Plus dense que l'eau, il coule et réagit de façon violente, quasi explosive : gerbe d'eau et flamme rouge-violet."},
  cs:{n:"Césium", s:"Cs", z:55, r:260, en:0.79, rho:1.93, rate:5, per:6, mel:"#e0c88a", fl:"#7d6cf2", flN:"bleu-violet", zip:0, dur:1.5, v0:1.75, dr:70, sh:[2,8,18,18,8,1], burst:{at:0.04, n:90}, txt:"Réaction explosive dès le contact : l'eau est projetée et le récipient peut se fendre. Démonstration impossible en classe."}
};
var AKEYS = ["li","na","k","rb","cs"];
SFA.sim({
  id:"c3-c04-alcalins", ch:"c04", tag:"Famille",
  titre:"Les alcalins dans l'eau : plus on descend, plus c'est vif",
  resume:"Lithium, sodium, potassium, rubidium, césium côte à côte : même réaction, mais de plus en plus violente en descendant la colonne.",
  but:"Lâche un morceau de chaque alcalin dans l'eau (vue « côte à côte ») ou un seul en grand. Compare le morceau qui file à la surface, la flamme et les éclaboussures, et l'atome qui grossit en descendant la colonne. Touche une ligne pour lire ses données ; en vue « en grand », fais tourner l'atome à la souris.",
  aRetenir:"Les alcalins (groupe 1) ont 1 électron de valence et réagissent tous avec l'eau selon 2 M + 2 H₂O → 2 MOH + H₂ : ils forment du dihydrogène et une solution basique (la phénolphtaléine rose le montre). Plus on descend dans la colonne, plus le rayon augmente, plus l'électron de valence est facile à perdre et plus la réaction est violente.",
  piege:"Même famille ne veut pas dire même intensité. ⚠ À ne jamais reproduire : les alcalins réagissent violemment avec l'eau, peuvent s'enflammer et projeter une solution caustique brûlante ; ces démonstrations sont réservées aux laboratoires équipés. Ici, durées, flammes et « intensité » (1 à 5) sont qualitatives : ce ne sont pas des mesures.",
  build:function(k,S){
    var c = k.canvas(0,{ratio:1});
    Object.defineProperty(c,"ratio",{get:function(){ var w=c.cv.parentNode?c.cv.parentNode.clientWidth:600; return w<460?1.36:1.02; }, configurable:true}); c.resize();
    var vue = k.seg("Vue", [["col","Les 5 côte à côte"],["un","Un seul, en grand"]], "col", function(){ restart(); });
    var el = k.select("Alcalin (données · vue en grand)", AKEYS.map(function(i){ return [i,ALC[i].n+" ("+ALC[i].s+")"]; }), "k", function(){ if(vue.value==="un") restart(); });
    var sz = k.slider("Taille du morceau", 0.3, 1, 0.1, 0.6, "(relative)", function(){ restart(); });
    var ph = k.toggle("Ajouter de la phénolphtaléine", true);
    var spd = k.seg("Vitesse", [["1","×1"],["0.35","Ralenti"]], "1");
    k.button("▶ Lâcher les morceaux", function(){ restart(); }, true);
    var ro = k.readouts(["Électrons de valence","Rayon atomique","Électronégativité","Masse volumique","Intensité (1 à 5)"]);
    var nt = k.note("","");
    var R = rng(9), tS = 0, tt = 0, view = {a:0.6, b:0.35, drag:false}, B = {}, TF = 0.28, geo = {rows:[], tiles:[], inset:null};
    function newB(kk){ return {key:kk, drops:[], bub:[], puff:[], trail:[], acc:{b:0,d:0,p:0,t:0}, burst:false, flash:0, heave:0, cracked:false, dep:0.12}; }
    function restart(){ tS = 0; AKEYS.forEach(function(kk){ B[kk] = newB(kk); }); }
    restart();
    function delay(kk){ return vue.value==="col" ? AKEYS.indexOf(kk)*0.25 : 0; }
    function dur(a){ return a.dur*(0.45+0.9*sz.value); }
    /* état du morceau à l'instant tau (unités : largeur de l'eau = 1 ; y > 0 au-dessus de la surface) */
    function piece(a, tau, dep){
      var o = {x:0.5, y:0.2, r:0.012+0.022*sz.value, prog:0, phase:"wait", melt:0};
      if (tau < 0) return o;
      if (tau < TF){ var q = tau/TF; o.y = 0.2*(1-q*q); o.phase = "fall"; return o; }
      var tr = tau-TF, p = Math.min(1, tr/dur(a)); o.prog = p; o.phase = p < 1 ? "react" : "done";
      o.r *= Math.cbrt(Math.max(0, 1-p));
      if (a.rho < 1){ var u = tr*a.zip; o.x = 0.5+0.36*(0.62*Math.sin(1.3*u)+0.38*Math.sin(2.9*u)); o.y = 0; }
      else { var s2 = Math.min(1, tr/0.3); o.x = 0.5+0.02*Math.sin(tr*9); o.y = -(dep-0.03)*s2*s2; }
      o.melt = a.s==="Li" ? 0 : Math.min(1, tr/0.5);
      return o;
    }
    function spawnDrop(b, x, v, spread){ if (b.drops.length >= 170) return; var ang = (R()-.5)*1.3*spread; b.drops.push({x:x+(R()-.5)*0.01, y:0.002, vx:Math.sin(ang)*v*0.6, vy:Math.cos(ang)*v, r:0.004+R()*0.006}); }
    function step(b, dt){
      var a = ALC[b.key], pc = piece(a, tS-delay(b.key), b.dep), s = sz.value, i;
      b.pc = pc;
      if (pc.phase === "react"){
        b.acc.b += dt*(14+10*a.rate);
        while (b.acc.b >= 1){ b.acc.b--; if (b.bub.length < 70) b.bub.push({x:pc.x+(R()-.5)*pc.r*2.6, y:pc.y+(a.rho<1?0:(R()-.5)*pc.r), vy:(a.rho<1?0.04:0.32)+R()*0.1, r:0.003+R()*0.004*(a.rho<1?1:1.8), life:a.rho<1?0.3+R()*0.3:2}); }
        b.acc.d += dt*a.dr*(0.5+s*0.7);
        while (b.acc.d >= 1){ b.acc.d--; spawnDrop(b, pc.x, a.v0*(0.45+0.55*R()), 0.5); }
        if (a.rate >= 2){ b.acc.p += dt*(a.rate-1)*5; while (b.acc.p >= 1){ b.acc.p--; if (b.puff.length < 40) b.puff.push({x:pc.x+(R()-.5)*0.02, y:0.012, r:0.012+R()*0.01, a:0.45, vx:(R()-.5)*0.04}); } }
        b.acc.t += dt; if (b.acc.t > 0.06){ b.acc.t = 0; b.trail.push({x:pc.x, y:Math.min(0,pc.y), age:0}); if (b.trail.length > 60) b.trail.shift(); }
        if (a.burst && !b.burst && pc.prog >= a.burst.at){ b.burst = true; b.flash = 1; b.heave = 1; for (i = 0; i < Math.round(a.burst.n*(0.6+0.6*s)); i++) spawnDrop(b, pc.x, a.v0*(0.8+0.7*R()), 1.1); if (a.s === "Cs") b.cracked = true; }
      }
      b.drops.forEach(function(d){ d.x += d.vx*dt; d.y += d.vy*dt; d.vy -= 3*dt; });
      b.drops = b.drops.filter(function(d){ return d.y > -0.004 && d.x > -0.2 && d.x < 1.2; });
      b.bub.forEach(function(q){ q.y += q.vy*dt; q.life -= dt; }); b.bub = b.bub.filter(function(q){ return q.life > 0 && q.y < 0.015; });
      b.puff.forEach(function(q){ q.y += 0.12*dt; q.x += q.vx*dt; q.r += 0.035*dt; q.a -= 0.33*dt; }); b.puff = b.puff.filter(function(q){ return q.a > 0; });
      b.trail.forEach(function(q){ q.age += dt; });
      b.flash = Math.max(0, b.flash-dt*2.2); b.heave = Math.max(0, b.heave-dt*1.1);
    }
    var lp = k.loop(function(dt){
      var f = parseFloat(spd.value), d = dt*f; tt += dt; tS += d;
      if (vue.value === "col") AKEYS.forEach(function(kk){ step(B[kk], d); }); else step(B[el.value], d);
      if (!view.drag) view.a += dt*0.5;
      k.redraw();
    });
    lp.play();
    c.pointer(function(type, p){
      var g = geo;
      if (type === "down"){
        if (g.inset && p.x > g.inset.x && p.x < g.inset.x+g.inset.w && p.y > g.inset.y && p.y < g.inset.y+g.inset.h){ view.drag = true; view.lx = p.x; view.ly = p.y; return; }
        var hit = null;
        g.rows.concat(g.tiles).forEach(function(r){ if (p.x >= r.x && p.x <= r.x+r.w && p.y >= r.y && p.y <= r.y+r.h) hit = r.key; });
        if (hit && hit !== el.value){ el.set(hit); if (vue.value === "un") restart(); k.redraw(); }
      } else if (type === "drag" && view.drag){ view.a += (p.x-view.lx)*0.012; view.b = Math.max(-1.3, Math.min(1.3, view.b+(p.y-view.ly)*0.012)); view.lx = p.x; view.ly = p.y; }
      else if (type === "up") view.drag = false;
    });
    /* flamme en goutte : base (x, y), hauteur h, demi-largeur w */
    function flame(g, x, y, h, w, wob){ g.beginPath(); g.moveTo(x-w, y); g.bezierCurveTo(x-w, y-h*0.45, x+wob-w*0.25, y-h*0.7, x+wob, y-h); g.bezierCurveTo(x+wob+w*0.25, y-h*0.7, x+w, y-h*0.45, x+w, y); g.arc(x, y, w, 0, Math.PI); g.closePath(); }
    /* un cristallisoir et sa réaction ; X0, Wd : étendue de l'eau ; yW : surface ; dP : profondeur (px) ; sv : échelle verticale au-dessus de l'eau */
    function basin(b, X0, Wd, yW, dP, sv, big){
      var g = c.ctx, a = ALC[b.key], pc = b.pc || piece(a, -1, b.dep), i;
      b.dep = dP/Wd;
      var X = function(x){ return X0+x*Wd; }, Y = function(y){ return y >= 0 ? yW-y*sv : yW-y*Wd; };
      var pr0 = Math.max(2, pc.r*Wd*(big ? 1.45 : 1.1));
      var pad = Math.max(5, Wd*0.02), yT = yW-Math.max(10, dP*0.55), yB = yW+dP, rad = Math.min(14, dP*0.5);
      var dish = function(){ g.beginPath(); g.moveTo(X0-pad, yT); g.lineTo(X0-pad, yB-rad); g.quadraticCurveTo(X0-pad, yB, X0-pad+rad, yB); g.lineTo(X0+Wd+pad-rad, yB); g.quadraticCurveTo(X0+Wd+pad, yB, X0+Wd+pad, yB-rad); g.lineTo(X0+Wd+pad, yT); };
      /* ombre portée et verre */
      g.save(); g.fillStyle = "rgba(15,27,45,.18)"; g.beginPath(); g.ellipse(X0+Wd/2, yB+3, Wd*0.52, 4, 0, 0, 6.2832); g.fill();
      dish(); g.fillStyle = "rgba(255,255,255,.35)"; g.fill(); g.restore();
      /* eau : surface ondulée */
      var reacting = pc.phase === "react", amp = reacting ? 0.0035*a.rate : 0, pcx = pc.x;
      var ws = function(x){ return amp*Math.sin(x*42-tt*11)*Math.exp(-Math.abs(x-pcx)*7)+b.heave*0.035*Math.sin(x*9-tt*14)+0.0015*Math.sin(x*13+tt*2); };
      var gp = ph.value ? (pc.phase === "done" ? 0.7 : 0.7*pc.prog) : 0;
      var top = mixHex("#9fd0f0", "#f08cbf", gp), bot = mixHex("#5ea6dc", "#d9579a", gp);
      g.save(); dish(); g.clip();
      g.beginPath(); g.moveTo(X0-pad-2, yB+2); for (i = 0; i <= 48; i++){ var xx = -pad/Wd+(1+2*pad/Wd)*i/48; g.lineTo(X(xx), yW-ws(xx)*sv); } g.lineTo(X0+Wd+pad+2, yB+2); g.closePath();
      var gw = g.createLinearGradient(0, yW, 0, yB); gw.addColorStop(0, top); gw.addColorStop(1, bot); g.globalAlpha = 0.82; g.fillStyle = gw; g.fill(); g.globalAlpha = 1;
      /* traînée rose de phénolphtaléine (ions OH⁻ formés) */
      if (ph.value){ g.save(); g.beginPath(); g.rect(X0-pad, yW+1, Wd+2*pad, dP+2); g.clip(); b.trail.forEach(function(q){ var rr = Math.min(0.13, 0.012+q.age*0.03)*Wd, al = 0.32*Math.exp(-q.age*0.45); g.fillStyle = "rgba(226,62,146,"+al.toFixed(3)+")"; g.beginPath(); g.ellipse(X(q.x), Math.max(yW+Math.min(rr*0.45, dP*0.4), Y(q.y)), rr, Math.min(rr*0.55, dP*0.6), 0, 0, 6.2832); g.fill(); }); g.restore(); }
      /* bulles de dihydrogène */
      g.strokeStyle = "rgba(255,255,255,.9)"; g.lineWidth = 1;
      b.bub.forEach(function(q){ var r = Math.max(1.2, q.r*Wd); g.beginPath(); g.arc(X(q.x), Y(Math.min(0, q.y)), r, 0, 6.2832); g.fillStyle = "rgba(255,255,255,.35)"; g.fill(); g.stroke(); });
      /* morceau coulé (Rb, Cs) */
      if (pc.y < 0 && pc.phase !== "done") drawPiece(X(pc.x), Y(pc.y), pr0, pc.melt, a, 0.9);
      g.restore();
      /* reflet de surface */
      g.save(); g.strokeStyle = "rgba(255,255,255,.7)"; g.lineWidth = 1.4; g.beginPath(); for (i = 0; i <= 48; i++){ var x2 = i/48; i ? g.lineTo(X(x2), yW-ws(x2)*sv) : g.moveTo(X(x2), yW-ws(x2)*sv); } g.stroke(); g.restore();
      /* morceau en surface ou en chute, pince en attente */
      if (pc.phase === "wait"){ var tx = X(0.5), ty = Y(pc.y); g.save(); g.strokeStyle = "#5b6675"; g.lineWidth = 2.2; g.lineCap = "round"; g.beginPath(); g.moveTo(tx-6, ty-sv*0.22); g.lineTo(tx-2.5, ty-3); g.moveTo(tx+6, ty-sv*0.22); g.lineTo(tx+2.5, ty-3); g.stroke(); g.restore(); }
      /* flamme du dihydrogène */
      if (a.fl && reacting){
        var fx = X(pc.x), fy = yW-(pc.y < 0 ? 0 : pr0*1.1), boost = a.burst && pc.prog < a.burst.at+0.15 && pc.prog > a.burst.at ? 1.8 : 1;
        var hf = (0.045+0.022*a.rate)*sv*boost*(0.85+0.15*Math.sin(tt*23)), wf = Math.max(4, (0.012+0.004*a.rate)*Wd)*boost, wob = Math.sin(tt*17)*Math.min(wf*0.5, 4);
        D.glow(c, fx, fy-hf*0.4, hf*1.3, a.fl, 0.45);
        g.save(); g.globalAlpha = 0.8; g.fillStyle = a.fl; flame(g, fx, fy, hf, wf, wob); g.fill(); g.globalAlpha = 0.75; g.fillStyle = shadeX(a.fl, 0.45); flame(g, fx, fy, hf*0.62, wf*0.6, wob*0.6); g.fill(); g.globalAlpha = 0.9; g.fillStyle = "#fff6e8"; flame(g, fx, fy, hf*0.28, wf*0.3, wob*0.3); g.fill(); g.restore();
      }
      if ((pc.y >= 0 && pc.phase !== "done") || pc.phase === "wait" || pc.phase === "fall") drawPiece(X(pc.x), Y(pc.y)-(pc.phase === "react" ? pr0*0.35 : pr0), pr0, pc.melt, a, 1);
      /* fumée blanche (vapeur et hydroxyde) */
      b.puff.forEach(function(q){ g.fillStyle = "rgba(245,247,250,"+q.a.toFixed(3)+")"; g.beginPath(); g.arc(X(q.x), Y(q.y), q.r*Wd, 0, 6.2832); g.fill(); });
      /* éclaboussures */
      g.fillStyle = gp > 0.2 ? "rgba(232,120,180,.85)" : "rgba(120,180,230,.85)";
      b.drops.forEach(function(d){ var r = Math.max(1.3, d.r*Wd*(big ? 1 : 0.8)); g.beginPath(); g.ellipse(X(d.x), Y(d.y), r*0.8, r*1.15, Math.atan2(d.vx, d.vy), 0, 6.2832); g.fill(); });
      /* contour du verre, reflets, fêlure */
      g.save(); dish(); g.strokeStyle = "rgba(78,92,112,.95)"; g.lineWidth = 2.2; g.lineJoin = "round"; g.stroke();
      g.strokeStyle = "rgba(78,92,112,.95)"; g.beginPath(); g.moveTo(X0-pad-4, yT); g.lineTo(X0-pad+3, yT); g.moveTo(X0+Wd+pad-3, yT); g.lineTo(X0+Wd+pad+4, yT); g.stroke();
      g.strokeStyle = "rgba(255,255,255,.8)"; g.lineWidth = 3; g.lineCap = "round"; g.beginPath(); g.moveTo(X0-pad+6, yT+5); g.lineTo(X0-pad+6, yB-rad); g.stroke();
      if (b.cracked){ g.strokeStyle = "rgba(40,50,64,.75)"; g.lineWidth = 1.2; g.beginPath(); var cx0 = X0+Wd*0.82; dP = Math.min(dP, 70); g.moveTo(cx0, yB); g.lineTo(cx0-5, yB-dP*0.3); g.lineTo(cx0+3, yB-dP*0.55); g.lineTo(cx0-4, yB-dP*0.85); g.moveTo(cx0-5, yB-dP*0.3); g.lineTo(cx0-13, yB-dP*0.45); g.stroke(); }
      g.restore();
      if (b.flash > 0) D.glow(c, X(pc.x), yW-sv*0.05, (0.2+0.25*b.flash)*Wd, "#fff2c2", 0.95*b.flash);
    }
    function drawPiece(x, y, r, melt, a, al){
      var g = c.ctx; g.save(); g.globalAlpha = al;
      var gr = g.createRadialGradient(x-r*0.4, y-r*0.45, r*0.1, x, y, r*1.15); gr.addColorStop(0, "#ffffff"); gr.addColorStop(0.35, a.mel); gr.addColorStop(1, shadeX(a.mel, -0.45));
      g.fillStyle = gr; g.beginPath();
      if (melt >= 1) g.arc(x, y, r, 0, 6.2832); else { var cr = r*(0.15+0.85*melt); if (g.roundRect) g.roundRect(x-r, y-r*0.85, 2*r, 1.7*r, cr); else g.rect(x-r, y-r*0.85, 2*r, 1.7*r); }
      g.fill(); g.strokeStyle = "rgba(40,50,64,.55)"; g.lineWidth = 1; g.stroke(); g.restore();
    }
    /* petit atome : sphère dont la taille suit le rayon atomique + électron de valence en orbite inclinée */
    function miniAtom(x, y, a, ph0){
      var g = c.ctx, rr = 4+(a.r-145)/115*6, R0 = rr+5, w = tt*2.2+ph0, ex = x+R0*Math.cos(w), ey = y+R0*0.38*Math.sin(w), front = Math.sin(w) > 0;
      g.save(); g.strokeStyle = "rgba(194,106,12,.45)"; g.lineWidth = 1; g.beginPath(); g.ellipse(x, y, R0, R0*0.38, 0, 0, 6.2832); g.stroke(); g.restore();
      if (!front) ball3(g, ex, ey, 2.4, "#f08a24");
      ball3(g, x, y, rr, "#7d8fb3");
      if (front) ball3(g, ex, ey, 2.4, "#f08a24");
    }
    function tile(x, y, w, h, a, on){
      var g = c.ctx; g.save(); g.shadowColor = "rgba(15,27,45,.18)"; g.shadowBlur = on ? 8 : 3; g.shadowOffsetY = 1;
      rr(c, x, y, w, h, on ? "#fbe3da" : "#fdf1ec", on ? "#c2502f" : "#e8b7a5", on ? 2 : 1, 7); g.restore();
      T(c, a.s, x+9, y+12, {size:Math.min(15, h*0.3), color:"#8f2f17", align:"left"});
      T(c, String(a.z), x+w-6, y+10, {size:10, color:"#8f2f17", align:"right", weight:700});
      miniAtom(x+w/2, y+h*0.62, a, a.z);
    }
    /* atome de Bohr en 3D (couches inclinées), qu'on fait tourner à la souris */
    function atom3D(x, y, w, h, a){
      var g = c.ctx, cx = x+w/2, cy = y+h/2+6, Rm = Math.min(w, h)*0.4*(a.r/260), n = a.sh.length, items = [], j, i;
      D.panel(c, x, y, w, h, {title:"Atome de "+a.n.toLowerCase(), shadow:true});
      for (j = 0; j < n; j++){
        var rad = Rm*(j+1)/n, ti = 0.55+j*0.95, tz = j*1.15, ne = a.sh[j], val = j === n-1, sp = 1.6/(j+1);
        var pt = function(u){ var p = [Math.cos(u)*rad, Math.sin(u)*rad, 0]; var y1 = p[1]*Math.cos(ti), z1 = p[1]*Math.sin(ti); var x2 = p[0]*Math.cos(tz)-y1*Math.sin(tz), y2 = p[0]*Math.sin(tz)+y1*Math.cos(tz); return proj3([x2/Rm, y2/Rm, z1/Rm], view, Rm, cx, cy); };
        g.save(); g.strokeStyle = val ? "rgba(194,106,12,.55)" : "rgba(95,107,122,.35)"; g.lineWidth = val ? 1.4 : 1; g.beginPath(); for (i = 0; i <= 40; i++){ var q = pt(i/40*6.2832); i ? g.lineTo(q.x, q.y) : g.moveTo(q.x, q.y); } g.stroke(); g.restore();
        for (i = 0; i < ne; i++){ var q2 = pt(i/ne*6.2832+tt*sp); items.push({x:q2.x, y:q2.y, z:q2.z, r:(val ? 4.6 : 2.6)*q2.s, col:val ? "#f08a24" : "#4f7be0"}); }
      }
      items.push({x:cx, y:cy, z:0, r:Math.max(4, Rm*0.12), col:"#c0321d", nuc:true});
      items.sort(function(p, q){ return p.z-q.z; }).forEach(function(it){ ball3(g, it.x, it.y, it.r, it.col); });
      T(c, "r ≈ "+a.r+" pm · "+n+" couches", cx, y+h-10, {size:10.5, color:"#5f6b7a", weight:700});
      T(c, "↻ glisse pour le tourner", cx, y+h-25, {size:9.5, color:P.grey, weight:600});
    }
    k.draw(function(){
      var W = c.W, H = c.H, g = c.ctx, ph1 = W < 460, a = ALC[el.value];
      c.clear(); geo.rows = []; geo.tiles = []; geo.inset = null;
      var benchY = H-26; labWall(c, benchY);
      if (vue.value === "col"){
        hood(c, 4, 4, W-8, benchY-4);
        var top0 = 26, rowH = (benchY-top0-6)/5, tw = ph1 ? 50 : 62;
        AKEYS.forEach(function(kk, i){
          var aa = ALC[kk], y0 = top0+i*rowH, on = kk === el.value;
          geo.rows.push({x:0, y:y0, w:W, h:rowH, key:kk});
          if (on){ g.save(); g.fillStyle = "rgba(231,111,81,.08)"; g.fillRect(9, y0+2, W-18, rowH-4); g.restore(); }
          var X0 = tw+30, Wd = W-X0-24, yW = y0+rowH*0.62, dP = rowH*0.3;
          /* étagère */
          g.save(); g.fillStyle = "rgba(60,70,84,.28)"; g.fillRect(X0-16, yW+dP+2, Wd+32, 3); g.restore();
          basin(B[kk], X0, Wd, yW, dP, rowH*1.05, false);
          tile(14, y0+rowH*0.12, tw, rowH*0.76, aa, on);
          D.label(c, "●".repeat(aa.rate)+"○".repeat(5-aa.rate), W-18, y0+12, {align:"right", size:10, color:aa.rate >= 4 ? P.red : P.amber});
          T(c, aa.rho < 1 ? "flotte" : "coule", W-18, y0+28, {size:10, color:"#4b586a", align:"right", weight:700});
        });
      } else {
        var tw2 = ph1 ? 46 : 58, th = (benchY-30)/5-4;
        AKEYS.forEach(function(kk, i){ var y0 = 22+i*(th+4); geo.tiles.push({x:8, y:y0, w:tw2, h:th, key:kk}); tile(8, y0, tw2, th, ALC[kk], kk === el.value); });
        var hx = tw2+16; hood(c, hx, 4, W-hx-4, benchY-4);
        var X0 = hx+30, Wd = W-X0-26, yW = H*0.54, dP = benchY-12-H*0.54;
        var iw = Math.min(ph1 ? 150 : 190, (W-hx)*0.5), ih = iw*0.95; geo.inset = {x:W-iw-14, y:26, w:iw, h:ih};
        basin(B[el.value], X0, Wd, yW, dP, H*0.5, true);
        atom3D(geo.inset.x, geo.inset.y, iw, ih, a);
        D.label(c, a.n+" ("+a.s+") · "+(a.rho < 1 ? "flotte" : "coule")+(a.fl ? " · flamme "+a.flN : ""), hx+16, 34, {align:"left", size:11.5, color:"#8f2f17"});
      }
      D.label(c, "⚠ Expérience dangereuse : à ne jamais reproduire", W/2, H-13, {size:ph1 ? 10 : 11, color:"#ffd2c8", fill:"rgba(140,30,20,.85)"});
      ro.set(0, "1"); ro.set(1, a.r+" pm"); ro.set(2, F(a.en,2)); ro.set(3, F(a.rho,2)+" g/cm³ ("+(a.rho < 1 ? "flotte" : "coule")+")"); ro.set(4, a.rate+" / 5");
      nt.set("<b>"+a.n+"</b> (période "+a.per+") : "+a.txt+" Équation : 2 "+a.s+" + 2 H₂O → 2 "+a.s+"OH + H₂."+(ph.value ? " La solution rosit : elle devient basique." : ""), a.rate >= 4 ? "warn" : "");
    });
  }
});

/* ---------- 3 · Mendeleïev prédit un élément ---------- */
var MEN = {
  ge:{n:"Case vide sous le silicium (éka-silicium)", up:["Si",28.09,2.33,"SiO₂"], dn:["Sn",118.71,7.31,"SnO₂"], real:["Ge",72.63,5.32,"GeO₂"], pm:72, pd:5.5, grp:"groupe 14", ox:"XO₂", eka:"éka-silicium", sym:"Es", oxP:"EsO₂", nom:"germanium", who:"Clemens Winkler", yr:1886, cell:[5,4]},
  ga:{n:"Case vide sous l'aluminium (éka-aluminium)", up:["Al",26.98,2.70,"Al₂O₃"], dn:["In",114.82,7.31,"In₂O₃"], real:["Ga",69.72,5.91,"Ga₂O₃"], pm:68, pd:5.9, grp:"groupe 13", ox:"X₂O₃", eka:"éka-aluminium", sym:"Ea", oxP:"Ea₂O₃", nom:"gallium", who:"Paul-Émile Lecoq de Boisbaudran", yr:1875, cell:[5,3]}
};
/* tableau de 1871 (lignes « Reihen » 1 à 7, groupes I à VIII), masses telles que publiées ; "—" = case laissée vide */
var T1871 = [
  [["H","1"]],
  [["Li","7"],["Be","9,4"],["B","11"],["C","12"],["N","14"],["O","16"],["F","19"]],
  [["Na","23"],["Mg","24"],["Al","27,3"],["Si","28"],["P","31"],["S","32"],["Cl","35,5"]],
  [["K","39"],["Ca","40"],["—","44"],["Ti","48"],["V","51"],["Cr","52"],["Mn","55"],["Fe Co Ni","56 · 59 · 59"]],
  [["(Cu)","63"],["Zn","65"],["—","68"],["—","72"],["As","75"],["Se","78"],["Br","80"]],
  [["Rb","85"],["Sr","87"],["Yt ?","88"],["Zr","90"],["Nb","94"],["Mo","96"],["—","100"],["Ru Rh Pd","104 · 104 · 106"]],
  [["(Ag)","108"],["Cd","112"],["In","113"],["Sn","118"],["Sb","122"],["Te","125"],["I","127"]]
];
var GRP = [["I","R₂O"],["II","RO"],["III","R₂O₃"],["IV","RO₂"],["V","R₂O₅"],["VI","RO₃"],["VII","R₂O₇"],["VIII","RO₄"]];
/* germanium : maille du diamant (comme le silicium juste au-dessus) */
var GE3 = (function(){ var P0 = [], i, j, k2;
  for (i = 0; i <= 1; i++) for (j = 0; j <= 1; j++) for (k2 = 0; k2 <= 1; k2++) P0.push([i,j,k2]);
  [[.5,.5,0],[.5,.5,1],[.5,0,.5],[.5,1,.5],[0,.5,.5],[1,.5,.5],[.25,.25,.25],[.75,.75,.25],[.75,.25,.75],[.25,.75,.75]].forEach(function(p){ P0.push(p); });
  var at = P0.map(function(p){ return [p[0]-.5, p[1]-.5, p[2]-.5]; }), bd = [];
  for (i = 0; i < at.length; i++) for (j = i+1; j < at.length; j++){ var d = Math.hypot(at[i][0]-at[j][0], at[i][1]-at[j][1], at[i][2]-at[j][2]); if (d < 0.45) bd.push([i,j]); }
  return {at:at, bd:bd}; })();
function bust(c, x, y, s){
  var g = c.ctx; g.save();
  g.fillStyle = "#2f3440"; g.beginPath(); g.moveTo(x-s*0.9, y+s*1.1); g.quadraticCurveTo(x-s*0.85, y+s*0.35, x, y+s*0.3); g.quadraticCurveTo(x+s*0.85, y+s*0.35, x+s*0.9, y+s*1.1); g.closePath(); g.fill();
  g.fillStyle = "#e9c9a6"; g.beginPath(); g.ellipse(x, y-s*0.18, s*0.3, s*0.36, 0, 0, 6.2832); g.fill();
  g.fillStyle = "#8d8177"; g.beginPath(); g.moveTo(x-s*0.32, y-s*0.05); g.quadraticCurveTo(x-s*0.36, y+s*0.75, x, y+s*0.95); g.quadraticCurveTo(x+s*0.36, y+s*0.75, x+s*0.32, y-s*0.05); g.quadraticCurveTo(x, y+s*0.12, x-s*0.32, y-s*0.05); g.fill();
  g.beginPath(); g.moveTo(x-s*0.34, y-s*0.1); g.quadraticCurveTo(x-s*0.5, y-s*0.62, x, y-s*0.6); g.quadraticCurveTo(x+s*0.5, y-s*0.62, x+s*0.34, y-s*0.1); g.quadraticCurveTo(x+s*0.42, y+s*0.25, x+s*0.3, y+s*0.3); g.lineTo(x+s*0.27, y-s*0.3); g.quadraticCurveTo(x, y-s*0.42, x-s*0.27, y-s*0.3); g.lineTo(x-s*0.3, y+s*0.3); g.quadraticCurveTo(x-s*0.42, y+s*0.25, x-s*0.34, y-s*0.1); g.fill();
  g.fillStyle = "#3a2f28"; g.beginPath(); g.arc(x-s*0.1, y-s*0.2, s*0.035, 0, 6.2832); g.arc(x+s*0.1, y-s*0.2, s*0.035, 0, 6.2832); g.fill();
  g.restore();
}
SFA.sim({
  id:"c3-c04-mendeleiev", ch:"c04", tag:"Histoire",
  titre:"Mendeleïev prédit un élément encore inconnu",
  resume:"Le tableau de 1871 et ses cases vides : la prédiction de l'éka-silicium, puis la découverte du germanium.",
  but:"Lance la séquence : Mendeleïev compare les voisins de la case vide et prédit l'élément manquant, puis l'élément réel est révélé (fais tourner son cristal à la souris). Déplace ensuite la masse supposée : la densité interpolée s'affiche sur le graphe.",
  aRetenir:"Mendeleïev a classé les éléments par masse croissante en plaçant dans la même colonne ceux de propriétés voisines, quitte à laisser des trous. En comparant les voisins, il a prédit la masse, la densité et la formule de l'oxyde d'éléments inconnus : ils ont été découverts ensuite (gallium en 1875, germanium en 1886).",
  piege:"L'interpolation linéaire ne donne qu'un ordre de grandeur : la densité réelle diffère de 10 à 20 % (environ 10 % pour le germanium, 16 % pour le gallium). Mendeleïev utilisait aussi les voisins de la même ligne. La formule de l'oxyde, elle, est exacte parce que la colonne partage le nombre d'électrons de valence. Dans le tableau de 1871, les voisins utiles sont deux lignes plus haut et plus bas (sous-groupes alternés).",
  build:function(k,S){
    var c = k.canvas(0,{ratio:1});
    Object.defineProperty(c,"ratio",{get:function(){ var w=c.cv.parentNode?c.cv.parentNode.clientWidth:600; return w<460?1.42:1.0; }, configurable:true}); c.resize();
    var gc = k.canvas(230);
    var st = {seq:-1, t:0}, v3 = {a:0.5, b:0.45, drag:false}, box3 = null;
    var cs = k.select("Trou à combler", Object.keys(MEN).map(function(i){return [i,MEN[i].n];}), "ge", function(){ ms.set(Math.round((MEN[cs.value].up[1]+MEN[cs.value].dn[1])/2)); st.seq = -1; rv.set(false); });
    var ms = k.slider("Masse atomique supposée", 30, 115, 1, 73, "u");
    var rv = k.toggle("Révéler l'élément réel", false, function(v){ st.seq = -1; });
    k.button("▶ Prédire puis révéler", function(){ st.seq = 0; rv.set(false); }, true);
    var ro = k.readouts(["Masse supposée","Densité interpolée","Formule de l'oxyde prévue","Densité réelle"]);
    var nt = k.note("","");
    var lp = k.loop(function(dt){ st.t += dt; if (st.seq >= 0){ st.seq = Math.min(1, st.seq+dt/6.5); if (st.seq >= 0.62 && !rv.value) rv.set(true); if (st.seq >= 1) st.seq = -1; } if (!v3.drag) v3.a += dt*0.45; k.redraw(); });
    lp.play();
    c.pointer(function(type, p){
      if (type === "down" && box3 && p.x > box3.x && p.x < box3.x+box3.w && p.y > box3.y && p.y < box3.y+box3.h){ v3.drag = true; v3.lx = p.x; v3.ly = p.y; }
      else if (type === "drag" && v3.drag){ v3.a += (p.x-v3.lx)*0.012; v3.b = Math.max(-1.3, Math.min(1.3, v3.b+(p.y-v3.ly)*0.012)); v3.lx = p.x; v3.ly = p.y; }
      else if (type === "up") v3.drag = false;
    });
    gc.pointer(function(type, p){ if ((type === "down" || type === "drag") && st.ax){ ms.set(Math.max(30, Math.min(115, Math.round(st.ax.ix(p.x))))); k.redraw(); } });
    function sm(x, a, b){ x = (x-a)/(b-a); x = x < 0 ? 0 : x > 1 ? 1 : x; return x*x*(3-2*x); }
    function typed(s, f){ var n = Math.round(s.length*f); return s.slice(0, n); }
    k.draw(function(){
      var W = c.W, H = c.H, g = c.ctx, m = MEN[cs.value], ph1 = W < 460, M = ms.value, i, j;
      var seq = st.seq, A = seq >= 0 ? sm(seq, 0.02, 0.2) : 1, Pt = seq >= 0 ? sm(seq, 0.18, 0.55) : 1, Fl = seq >= 0 ? sm(seq, 0.6, 0.7) : (rv.value ? 1 : 0), rev = Fl >= 0.5;
      c.clear();
      /* bureau en bois */
      var gb = g.createLinearGradient(0, 0, 0, H); gb.addColorStop(0, "#8a5a36"); gb.addColorStop(1, "#6d4426"); g.fillStyle = gb; g.fillRect(0, 0, W, H);
      g.save(); g.strokeStyle = "rgba(255,255,255,.05)"; g.lineWidth = 2; for (i = 0; i < 14; i++){ g.beginPath(); var yy0 = i*H/14+8; g.moveTo(0, yy0); g.bezierCurveTo(W*0.3, yy0+6, W*0.6, yy0-6, W, yy0+3); g.stroke(); } g.restore();
      /* feuille de 1871 */
      var px = 10, py = 10, pw = W-20, phh = H*(ph1 ? 0.54 : 0.58);
      g.save(); g.shadowColor = "rgba(0,0,0,.35)"; g.shadowBlur = 12; g.shadowOffsetY = 4; g.translate(px+pw/2, py+phh/2); g.rotate(-0.006);
      var gp = g.createLinearGradient(-pw/2, -phh/2, pw/2, phh/2); gp.addColorStop(0, "#f7edd3"); gp.addColorStop(1, "#eadcb6"); g.fillStyle = gp; g.fillRect(-pw/2, -phh/2, pw, phh); g.restore();
      g.save(); var vg = g.createRadialGradient(px+pw/2, py+phh/2, phh*0.3, px+pw/2, py+phh/2, pw*0.7); vg.addColorStop(0, "rgba(120,80,30,0)"); vg.addColorStop(1, "rgba(120,80,30,.18)"); g.fillStyle = vg; g.fillRect(px, py, pw, phh); g.restore();
      var ink = "#3b2a1a", titleH = 30;
      bust(c, px+22, py+19, 13);
      T(c, "D. Mendeleïev, 1871 · Système périodique des éléments", px+40, py+16, {size:ph1 ? 10.5 : 12.5, color:ink, align:"left", math:true, italic:true, weight:600});
      var lc = ph1 ? 22 : 34, gw = (pw-lc-12)/8, hh = ph1 ? 26 : 30, rh = (phh-titleH-hh-8)/7, x0 = px+6+lc, y0 = py+titleH+hh;
      GRP.forEach(function(gr2, j2){ var xx = x0+j2*gw+gw/2; T(c, gr2[0], xx, py+titleH+8, {size:ph1 ? 10 : 11.5, color:ink, math:true}); T(c, gr2[1], xx, py+titleH+21, {size:ph1 ? 8.5 : 10, color:"#6b5434", math:true, weight:600}); });
      g.save(); g.strokeStyle = "rgba(59,42,26,.25)"; g.lineWidth = 1; for (i = 0; i <= 7; i++){ g.beginPath(); g.moveTo(px+6, y0+i*rh); g.lineTo(px+pw-6, y0+i*rh); g.stroke(); } for (j = 0; j <= 8; j++){ g.beginPath(); g.moveTo(x0+j*gw, py+titleH); g.lineTo(x0+j*gw, y0+7*rh); g.stroke(); } g.restore();
      var cellXY = function(r, col){ return [x0+(col-1)*gw+gw/2, y0+(r-1)*rh+rh/2]; };
      var nb = [m.up[0], m.dn[0]], gapC = m.cell;
      T1871.forEach(function(row, r){
        T(c, String(r+1), px+6+lc/2, y0+r*rh+rh/2, {size:ph1 ? 9.5 : 10.5, color:"#6b5434", weight:600});
        row.forEach(function(cell, col){
          var xy = cellXY(r+1, col+1), sym = cell[0], gap = sym === "—", isSel = gap && r+1 === gapC[0] && col+1 === gapC[1], isNb = nb.indexOf(sym) >= 0, multi = sym.indexOf(" ") > 0 && sym.indexOf("?") < 0;
          if (isNb && A > 0){ g.save(); g.fillStyle = "rgba(31,75,158,"+(0.16*A).toFixed(3)+")"; g.fillRect(xy[0]-gw/2+2, xy[1]-rh/2+2, gw-4, rh-4); g.restore(); }
          if (isSel){
            var pulse = 0.5+0.5*Math.sin(st.t*4), sx = Math.abs(Math.cos(Fl*Math.PI));
            g.save(); g.translate(xy[0], xy[1]); g.scale(Math.max(0.04, sx), 1);
            g.fillStyle = rev ? "#d9efe3" : "rgba(192,50,29,"+(0.12+0.12*pulse).toFixed(3)+")"; g.fillRect(-gw/2+2, -rh/2+2, gw-4, rh-4);
            g.strokeStyle = rev ? P.green : P.red; g.lineWidth = 2; g.strokeRect(-gw/2+2, -rh/2+2, gw-4, rh-4);
            T(c, rev ? m.real[0] : "?", 0, -rh*0.14, {size:Math.min(15, gw*0.34), color:rev ? P.green : P.red, math:true});
            T(c, rev ? F(m.real[1], 1) : "= "+cell[1], 0, rh*0.26, {size:ph1 ? 8.5 : 9.5, color:rev ? P.green : P.red, math:true, weight:600});
            g.restore();
          } else {
            var dim = sym.charAt(0) === "(";
            T(c, gap ? "—" : sym, xy[0], xy[1]-(multi ? rh*0.14 : rh*0.14), {size:multi ? (ph1 ? 7.5 : 9.5) : Math.min(14, gw*0.3), color:dim ? "#9a8a70" : isNb ? P.acc : ink, math:true});
            T(c, (gap ? "= " : "")+cell[1], xy[0], xy[1]+rh*0.26, {size:multi ? (ph1 ? 6.5 : 8) : (ph1 ? 8 : 9.5), color:dim ? "#9a8a70" : "#6b5434", math:true, weight:600});
          }
        });
      });
      /* flèches : les voisins de la colonne (deux lignes plus haut et plus bas) */
      if (A > 0){
        var gxy = cellXY(gapC[0], gapC[1]);
        [[3, 1], [7, -1]].forEach(function(q){ var a0 = cellXY(q[0], gapC[1]), sx0 = a0[0]-gw*0.42, sy0 = a0[1]+q[1]*rh*0.3, ex = gxy[0]-gw*0.42, ey = gxy[1]-q[1]*rh*0.3, cxp = sx0-gw*0.55;
          g.save(); g.strokeStyle = P.acc; g.lineWidth = 2; g.setLineDash([4, 3]); g.beginPath(); var N = 24, last = null; for (i = 0; i <= N*A; i++){ var u = i/N, bx = (1-u)*(1-u)*sx0+2*u*(1-u)*cxp+u*u*ex, by = (1-u)*(1-u)*sy0+2*u*(1-u)*((sy0+ey)/2)+u*u*ey; i ? g.lineTo(bx, by) : g.moveTo(bx, by); last = [bx, by]; } g.stroke(); g.restore();
          if (A >= 1) D.arrow(c, ex-6, ey-q[1]*0.5, ex, ey, P.acc, 2); });
      }
      /* fiches : prédiction (1871) et élément réel */
      var cy0 = py+phh+12, chh = H-cy0-10, cw = (W-30)/2, c1x = 10, c2x = 20+cw;
      g.save(); g.shadowColor = "rgba(0,0,0,.3)"; g.shadowBlur = 8; g.shadowOffsetY = 3; rr(c, c1x, cy0, cw, chh, "#fbf6e8", null, 0, 8); rr(c, c2x, cy0, cw, chh, rev ? "#eef8f2" : "#f2f3f5", null, 0, 8); g.restore();
      var fs = ph1 ? 10.5 : 12, lh = fs*1.55;
      T(c, "PRÉDICTION · 1871", c1x+10, cy0+14, {size:9.5, color:"#6b5434", align:"left", weight:800});
      var L1 = [m.eka+" ("+m.sym+")", "masse ≈ "+m.pm, "densité ≈ "+F(m.pd, 1)+" g/cm³", "oxyde "+m.oxP+" ("+m.grp+")", "voisins : "+m.up[0]+" et "+m.dn[0]];
      L1.forEach(function(s, i2){ var f = Math.max(0, Math.min(1, Pt*L1.length-i2)); if (f > 0) T(c, typed(s, f), c1x+12, cy0+36+i2*lh, {size:i2 ? fs : fs+1.5, color:i2 ? ink : P.red, align:"left", math:i2 === 0, italic:i2 === 0, weight:i2 ? 700 : 600}); });
      if (seq >= 0 && Pt < 1){ var cur = Math.floor(Pt*L1.length); if (cur < L1.length && st.t*3%1 < 0.6) T(c, "▍", c1x+14+Math.min(cw-30, 7*typed(L1[cur], Pt*L1.length-cur).length), cy0+36+cur*lh, {size:fs, color:ink}); }
      T(c, (rev ? "DÉCOUVERT EN " + m.yr : "ÉLÉMENT RÉEL"), c2x+10, cy0+14, {size:9.5, color:rev ? P.green : "#5f6b7a", align:"left", weight:800});
      box3 = {x:c2x, y:cy0, w:cw, h:chh};
      if (!rev){
        var pulse2 = 0.5+0.5*Math.sin(st.t*3);
        T(c, "?", c2x+cw/2, cy0+chh*0.48, {size:Math.min(64, chh*0.45), color:"rgba(138,149,163,"+(0.45+0.3*pulse2).toFixed(2)+")"});
        T(c, "encore inconnu en 1871", c2x+cw/2, cy0+chh-16, {size:fs-1, color:"#5f6b7a", weight:700});
      } else {
        var sc = Math.min(cw, chh)*0.3, ccx = c2x+cw*(ph1 ? 0.5 : 0.36), ccy = cy0+chh*(ph1 ? 0.5 : 0.55);
        if (cs.value === "ge"){
          var pr = GE3.at.map(function(p){ return proj3(p, v3, sc, ccx, ccy); });
          g.save(); g.strokeStyle = "rgba(95,107,122,.3)"; g.lineWidth = 1; [[0,1],[0,2],[0,4],[1,3],[1,5],[2,3],[2,6],[3,7],[4,5],[4,6],[5,7],[6,7]].forEach(function(e){ g.beginPath(); g.moveTo(pr[e[0]].x, pr[e[0]].y); g.lineTo(pr[e[1]].x, pr[e[1]].y); g.stroke(); }); g.restore();
          g.save(); g.strokeStyle = "#7a8aa0"; g.lineWidth = 3; g.lineCap = "round"; GE3.bd.forEach(function(e){ g.beginPath(); g.moveTo(pr[e[0]].x, pr[e[0]].y); g.lineTo(pr[e[1]].x, pr[e[1]].y); g.stroke(); }); g.restore();
          pr.map(function(p, i3){ return [p, i3]; }).sort(function(p, q){ return p[0].z-q[0].z; }).forEach(function(q){ ball3(g, q[0].x, q[0].y, sc*0.11*q[0].s, "#6f8aa8"); });
          T(c, "cristal de Ge : même maille que le silicium", c2x+cw/2, cy0+chh-12, {size:ph1 ? 9 : 10, color:"#4b586a", weight:700});
        } else {
          /* gallium : métal qui fond dans une coupelle (29,8 °C) */
          var wob = Math.sin(st.t*2.2)*0.06, dx = ccx, dy = ccy+sc*0.5;
          g.save(); g.fillStyle = "#c9d1dc"; g.beginPath(); g.ellipse(dx, dy+sc*0.35, sc*1.25, sc*0.3, 0, 0, 6.2832); g.fill(); g.strokeStyle = "#8a95a3"; g.stroke();
          var gg = g.createRadialGradient(dx-sc*0.3, dy-sc*0.35, sc*0.05, dx, dy, sc*1.1); gg.addColorStop(0, "#ffffff"); gg.addColorStop(0.4, "#b9c2cc"); gg.addColorStop(1, "#59636f"); g.fillStyle = gg;
          g.beginPath(); g.ellipse(dx, dy, sc*(0.95+wob), sc*(0.48-wob*0.5), 0, Math.PI, 0); g.quadraticCurveTo(dx+sc*1.05, dy+sc*0.32, dx, dy+sc*0.34); g.quadraticCurveTo(dx-sc*1.05, dy+sc*0.32, dx-sc*(0.95+wob), dy); g.fill(); g.restore();
          T(c, "Ga : métal qui fond à 29,8 °C", c2x+cw/2, cy0+chh-12, {size:ph1 ? 9 : 10, color:"#4b586a", weight:700});
        }
        if (!ph1){ var tx = c2x+cw*0.66; T(c, m.real[0], tx, cy0+38, {size:20, color:P.green, align:"left", math:true}); T(c, m.nom, tx, cy0+38+lh, {size:fs-1, color:P.green, align:"left"}); T(c, F(m.real[1], 2)+" u", tx, cy0+38+2*lh, {size:fs, color:ink, align:"left"}); T(c, F(m.real[2], 2)+" g/cm³", tx, cy0+38+3*lh, {size:fs, color:ink, align:"left"}); T(c, m.real[3], tx, cy0+38+4*lh, {size:fs, color:ink, align:"left"}); }
        else T(c, m.real[0]+" · "+F(m.real[1], 1)+" u · "+F(m.real[2], 2), c2x+cw/2, cy0+30, {size:10, color:P.green});
        T(c, "↻", c2x+cw-12, cy0+14, {size:12, color:P.grey});
      }
      if (seq >= 0.62 && seq < 0.95){ var al = Math.min(1, (seq-0.62)*12)*Math.min(1, (0.95-seq)*12); g.save(); g.globalAlpha = al; D.label(c, m.yr+" : "+m.who+" découvre le "+m.nom+" !", W/2, py+phh-14, {size:ph1 ? 10.5 : 12.5, color:P.green, fill:"rgba(236,248,241,.96)"}); g.restore(); }
      /* graphe densité / masse */
      var up = m.up, dn = m.dn;
      gc.clear(); var ax = D.axes(gc, {x0:0, x1:130, y0:0, y1:9, xl:"masse atomique (u)", yl:"densité (g/cm³)", stepX:20, stepY:2, l:46}); st.ax = ax;
      D.line(gc, ax.X(up[1]), ax.Y(up[2]), ax.X(dn[1]), ax.Y(dn[2]), P.grey, 2, [6,4]);
      [up, dn].forEach(function(e){ D.dot(gc, ax.X(e[1]), ax.Y(e[2]), 6, P.acc); T(gc, e[0], ax.X(e[1]), ax.Y(e[2])-14, {size:13, color:P.acc}); });
      var inM = Math.max(up[1], Math.min(dn[1], M)), rho = up[2]+(inM-up[1])/(dn[1]-up[1])*(dn[2]-up[2]);
      D.dot(gc, ax.X(m.pm), ax.Y(m.pd), 5, P.amber); T(gc, "Mendeleïev", ax.X(m.pm)-8, ax.Y(m.pd)-12, {size:11, color:P.amber, align:"right"});
      D.dot(gc, ax.X(inM), ax.Y(rho), 7, P.red); T(gc, "?", ax.X(inM), ax.Y(rho)+17, {size:14, color:P.red});
      if (rev){ D.dot(gc, ax.X(m.real[1]), ax.Y(m.real[2]), 7, P.green); T(gc, m.real[0], ax.X(m.real[1])+14, ax.Y(m.real[2])+4, {size:13, color:P.green, align:"left"}); }
      T(gc, "↔ glisse pour choisir la masse", ax.R-6, ax.B-12, {size:11, color:P.grey, align:"right", weight:600});
      ro.set(0, F(M,0)+" u"); ro.set(1, F(rho,2)+" g/cm³"); ro.set(2, m.grp+" : "+up[3]+" et "+dn[3]+" → "+m.ox); ro.set(3, rev ? F(m.real[2],2)+" g/cm³ ("+m.real[0]+")" : "cachée");
      var out = M < up[1] || M > dn[1];
      nt.set((out ? "La masse supposée est en dehors de l'intervalle des voisins ("+up[0]+" : "+F(up[1],1)+" u ; "+dn[0]+" : "+F(dn[1],1)+" u) : la valeur est limitée aux voisins. " : "")+(rev ? "<b>"+m.real[0]+"</b> : masse "+F(m.real[1],2)+" u, densité "+F(m.real[2],2)+" g/cm³ ; prédiction de Mendeleïev : ≈ "+m.pm+" u et ≈ "+F(m.pd,1)+" g/cm³. Ton interpolation à "+F(M,0)+" u donne "+F(rho,2)+" g/cm³ (écart "+F((rho-m.real[2])/m.real[2]*100,0)+" %). L'oxyde "+m.real[3]+" suit bien la formule prévue."+(cs.value === "ga" ? " Anecdote : Lecoq de Boisbaudran mesura d'abord 4,7 g/cm³ ; Mendeleïev lui écrivit que son métal devait être impur. Après purification : 5,9 g/cm³." : "") : "Les voisins verticaux ont des propriétés semblables : sois prudent, estime la masse au milieu des deux voisins (≈ "+F((up[1]+dn[1])/2,0)+" u) puis révèle l'élément."), "");
    });
  }
});


/* ---------- 4 · Élément mystère ---------- */
var MYS = [
  {z:11, cl:["À 20 °C, c'est un solide mou qu'on coupe au couteau et qu'on conserve dans l'huile.","Fraîchement coupé, il brille puis ternit très vite à l'air.","Plongé dans l'eau, il réagit vivement : dihydrogène et solution basique.","Il a 1 électron de valence.","Il se trouve en 3e période."]},
  {z:17, cl:["Gaz jaune-vert à 20 °C, d'odeur piquante et toxique.","Il sert à désinfecter l'eau des piscines.","C'est un non-métal de la famille des halogènes.","Il a 7 électrons de valence.","Il se trouve en 3e période."]},
  {z:26, cl:["Métal gris, solide à 20 °C, attiré par un aimant.","Il rouille à l'air humide.","Il se trouve au centre du tableau, parmi les métaux de transition.","Sa masse atomique est voisine de 56 u.","Il se trouve en 4e période."]},
  {z:10, cl:["Gaz incolore à 20 °C.","Il ne forme pratiquement aucun composé chimique.","Il remplit les enseignes lumineuses rouge-orangé.","Il a 8 électrons de valence.","Il se trouve en 2e période."]},
  {z:13, cl:["Solide gris argenté, très léger (densité 2,7), non attiré par un aimant.","Bon conducteur, utilisé pour les canettes et les feuilles de cuisine.","C'est un métal, ni alcalin ni de transition.","Il a 3 électrons de valence.","Il se trouve en 3e période."]},
  {z:35, cl:["C'est le seul non-métal liquide à 20 °C : liquide rouge-brun.","Il dégage des vapeurs rouges toxiques et irritantes.","Il appartient à la famille des halogènes.","Il a 7 électrons de valence.","Il se trouve en 4e période."]},
  {z:20, cl:["Métal gris argenté, solide, un peu plus dur que le sodium.","Il réagit avec l'eau en dégageant du dihydrogène, moins vivement que le sodium.","Il est présent dans les os, les dents et le calcaire.","Il a 2 électrons de valence.","Il se trouve en 4e période."]},
  {z:14, cl:["Solide gris bleuté, brillant mais cassant.","C'est un métalloïde : il conduit mal l'électricité sans être un isolant parfait.","Il sert à fabriquer les puces électroniques.","Il a 4 électrons de valence.","Il se trouve en 3e période."]}
];
SFA.sim({
  id:"c3-c04-mystere", ch:"c04", tag:"Jeu",
  titre:"Élément mystère : trouve-le avec le moins d'indices",
  resume:"Chaque indice rapproche du but : propriétés physiques, famille, électrons de valence, période. Clique sur le tableau pour répondre.",
  but:"Révèle les indices un par un, puis clique sur l'élément que tu penses être le bon. Moins tu utilises d'indices et d'essais, plus ton score est élevé.",
  aRetenir:"La position dans le tableau résume les propriétés : la colonne (groupe) donne la famille et le nombre d'électrons de valence, la ligne (période) donne le nombre de couches. Un élément se trouve en croisant des indices physiques et la position.",
  piege:"Un seul indice ne suffit presque jamais : « solide gris » convient à des dizaines de métaux. Le score diminue avec chaque indice et chaque erreur : réfléchis avant de cliquer.",
  build:function(k,S){
    var c = k.canvas(0,{ratio:0.36});
    var ro = k.readouts(["Indices utilisés","Essais ratés","Score"]);
    var cl = k.note("","");
    var nt = k.note("","");
    var cur=-1, shown=1, miss=0, solved=false, last={}, tried=[];
    function newGame(){ var n; do{ n=Math.floor(Math.random()*MYS.length); } while(n===cur&&MYS.length>1); cur=n; shown=1; miss=0; solved=false; tried=[]; nt.set("Clique sur le tableau pour proposer un élément.",""); }
    k.button("Indice suivant", function(){ if(!solved&&shown<5) shown++; }, true);
    k.button("Nouveau mystère", function(){ newGame(); });
    k.button("Abandonner (révéler)", function(){ solved=true; shown=5; nt.set("C'était <b>"+E[MYS[cur].z][1]+"</b> ("+E[MYS[cur].z][0]+", Z = "+MYS[cur].z+").","warn"); });
    function geom(){ var W=c.W, cs=Math.min((W-12)/18,40); return {cs:cs,x0:(W-18*cs)/2,y0:8}; }
    c.pointer(function(type,pt){ if(type!=="down"||solved) return; var g=geom(), col=Math.floor((pt.x-g.x0)/g.cs)+1, row=Math.floor((pt.y-g.y0)/g.cs)+1;
      for(var z=1;z<=36;z++){ if(E[z][8]===col&&E[z][7]===row){
        if(tried.indexOf(z)>=0) return; tried.push(z);
        var m=MYS[cur].z; if(z===m){ solved=true; var pts=Math.max(0,100-15*(shown-1)-10*miss); nt.set("<b>Bravo !</b> C'est bien le "+E[m][1]+" ("+E[m][0]+"). Score : "+pts+" / 100.","ok"); }
        else { miss++; var hint=[]; if(E[z][7]===E[m][7]) hint.push("même période"); if(E[z][8]===E[m][8]) hint.push("même groupe"); if(E[z][6]===E[m][6]) hint.push("même famille");
          nt.set("Ce n'est pas le "+E[z][1]+"."+(hint.length?" Mais ils sont dans le/la "+hint.join(" et ")+".":" Relis les indices."),"warn"); }
        k.redraw(); } } });
    newGame();
    k.draw(function(){
      c.clear(); var g=geom(), cs=g.cs, ctx=c.ctx, m=MYS[cur];
      for(var z=1;z<=36;z++){ var e=E[z], x=g.x0+(e[8]-1)*cs, y=g.y0+(e[7]-1)*cs, bad=tried.indexOf(z)>=0&&z!==m.z, good=solved&&z===m.z;
        ctx.fillStyle=good?"#2e6b55":(bad?"#f1c9c5":D.tint(CAT[e[6]][1],0.22)); ctx.beginPath(); D.rrect(c,x+1,y+1,cs-2,cs-2,4); ctx.fill();
        T(c,e[0],x+cs/2,y+cs/2,{size:Math.min(15,cs*0.5),color:good?"#fff":"#0f1b2d"}); }
      T(c,"Clique sur l'élément que tu proposes",c.W/2,g.y0+4*cs+22,{size:13,color:P.grey});
      cl.set("<b>Indices :</b><ol style='margin:4px 0 0 18px;padding:0'>"+m.cl.slice(0,shown).map(function(x){return "<li>"+x+"</li>";}).join("")+"</ol>","");
      ro.set(0,shown+" / 5"); ro.set(1,String(miss)); ro.set(2,solved&&tried.indexOf(m.z)>=0?Math.max(0,100-15*(shown-1)-10*miss)+" / 100":"—");
    });
  }
});
})();
