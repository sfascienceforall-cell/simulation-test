(function(){
var D = SFA.draw, P = D.palette, T = D.text, F = SFA.fmt;
function rect(c,x,y,w,h,fill,stroke,lw,r){ var g=c.ctx; g.save(); g.beginPath(); if(g.roundRect&&r) g.roundRect(x,y,w,h,r); else g.rect(x,y,w,h); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1.5;g.stroke();} g.restore(); }
function circ(c,x,y,r,fill,stroke,lw){ var g=c.ctx; g.beginPath(); g.arc(x,y,r,0,6.2832); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||2;g.stroke();} }
function clamp(v,a,b){ return Math.max(a,Math.min(b,v)); }
function mix(c1,c2,t){ t=clamp(t,0,1); return "rgb("+Math.round(c1[0]+(c2[0]-c1[0])*t)+","+Math.round(c1[1]+(c2[1]-c1[1])*t)+","+Math.round(c1[2]+(c2[2]-c1[2])*t)+")"; }
function poly(c,pts,fill,stroke,lw){ var g=c.ctx; g.beginPath(); g.moveTo(pts[0][0],pts[0][1]); for(var i=1;i<pts.length;i++) g.lineTo(pts[i][0],pts[i][1]); g.closePath(); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1.5;g.stroke();} }
function rng(seed){ var s=seed>>>0; return function(){ s=(s+0x6D2B79F5)>>>0; var t=s; t=Math.imul(t^(t>>>15),t|1); t^=t+Math.imul(t^(t>>>7),t|61); return ((t^(t>>>14))>>>0)/4294967296; }; }
function nf(x,d){ var a = F(x,d||0).split(","); a[0] = a[0].replace(/\B(?=(\d{3})+(?!\d))/g,"\u202f"); return a.join(","); }


/* ===== 1 · Pyramide énergétique ===== */
SFA.sim({
  id:"b3-c02-pyramide-energie", ch:"c02", tag:"Classique · tombe souvent",
  titre:"Pyramide énergétique : où passe l'énergie ?",
  resume:"De la lumière du Soleil au dernier maillon : l'énergie fond à chaque transfert.",
  but:"Règle l'énergie solaire reçue, la part captée par les producteurs et le rendement de chaque transfert. Lis l'énergie à chaque niveau et la surface nécessaire pour nourrir un individu.",
  aRetenir:"Les producteurs ne captent qu'une petite part de la lumière (de l'ordre de 1 % ou moins en production nette). À chaque transfert, environ 10 % seulement de l'énergie passe au niveau suivant : le reste est perdu en respiration (chaleur), en déchets et en parties non mangées. L'énergie ne se recycle pas.",
  piege:"Les « 10 % » sont un ordre de grandeur : de 5 à 20 % selon les milieux. Et les pertes ne disparaissent pas : la chaleur est dispersée, les déchets nourrissent les décomposeurs.",
  build:function(k,S){
    var c = k.canvas(350);
    var sol = k.slider("Énergie solaire reçue", 1000, 8000, 200, 3600, "MJ/m²/an");
    var cap = k.slider("Part captée par les producteurs", .2, 2, .1, .5, "%");
    var eta = k.slider("Rendement d'un transfert", 5, 20, 1, 10, "%");
    var lev = k.seg("Individu à nourrir", [[1,"Consommateur I"],[2,"Consommateur II"],[3,"Consommateur III"]], 3);
    var ro = k.readouts(["Production des producteurs","Énergie du consommateur III","Surface pour un humain (10 MJ/jour)"]);
    var nt = k.note("","");
    k.draw(function(){
      c.clear();
      var E = [sol.value*1000*cap.value/100], e = eta.value/100;
      for (var i=1;i<4;i++) E.push(E[i-1]*e);
      var names = ["Producteurs","Consommateurs I","Consommateurs II","Consommateurs III"], cols = ["#9ccfae","#f1d27d","#f1a97d","#d98a7a"];
      var cx = c.W/2+14, maxw = c.W-62, y0 = 44, bh = 24, row = 62;
      T(c,"Soleil : "+nf(sol.value*1000)+" kJ/m²/an",c.W/2,16,{size:13,color:P.amber});
      for (i=0;i<4;i++){
        var w = Math.max(5, maxw*E[i]/E[0]), y = y0 + i*row;
        T(c,names[i],12,y+2,{size:12,align:"left",color:P.ink});
        T(c,nf(E[i],E[i]<10?1:0)+" kJ/m²/an",c.W-12,y+2,{size:12,align:"right",color:P.ink});
        rect(c,cx-w/2,y+12,w,bh,cols[i],P.ink,1.2);
        B3H.badge(c,["herbe","sauterelle","grenouille","buse"][i],Math.max(22,cx-w/2-16),y+12+bh/2,15,P.ink);
        if (i<3) T(c,"↓ × "+S.fmt(e,2)+"  (perdu : "+S.fmt(100*(1-e),0)+" %)",cx,y+row-9,{size:12,color:P.green});
      }
      
      var yb = y0 + 4*row + 6;
      T(c,"Perdu entre producteurs et C III : "+S.fmt(100*(1-Math.pow(e,3)),1)+" %",c.W/2,yb,{size:13,color:P.red});
      var need = 10*365, area = need*1e3/ (E[lev.value] ) ;  /* MJ/an -> kJ/an ÷ kJ/m²/an */
      ro.set(0,nf(E[0])+" kJ/m²/an"); ro.set(1,nf(E[3],1)+" kJ/m²/an");
      ro.set(2, area>=1e6 ? S.fmt(area/1e6,2)+" km²" : area>=1e4 ? S.fmt(area/1e4,1)+" ha" : nf(area)+" m²");
      nt.set(area>1e6 ? "Plus d'un km² pour un seul individu : voilà pourquoi les grands carnivores sont rares." : area>1e5 ? "Plus de 10 hectares pour un seul individu : le sommet de la chaîne est toujours peu nombreux." : "Plus on mange bas dans la chaîne, plus la surface nécessaire est petite.","ok");
    });
  }
});

/* ===== 2 · Pyramides de nombre, de biomasse, d'énergie ===== */
SFA.sim({
  id:"b3-c02-pyramides", ch:"c02", tag:"Comparaison",
  titre:"Trois pyramides, trois histoires",
  resume:"Nombre, biomasse ou énergie : dans quel milieu la pyramide est-elle inversée, et pourquoi jamais celle d'énergie ?",
  but:"Choisis un écosystème et une pyramide. Active l'échelle logarithmique pour mieux voir les bas. Repère les inversions.",
  aRetenir:"La pyramide d'énergie (flux par an) est toujours « droite » : on ne peut pas transférer plus d'énergie qu'on n'en reçoit. Les pyramides de nombre et de biomasse (une photographie à un instant donné) peuvent être inversées : un arbre porte des milliers d'insectes ; le plancton, vite renouvelé, pèse parfois moins que ses consommateurs.",
  piege:"Pyramide de nombre ≠ pyramide d'énergie : peu d'arbres portent beaucoup d'insectes, mais l'énergie reste largement plus grande au niveau des arbres. (Valeurs indicatives, ordres de grandeur.)",
  build:function(k,S){
    var c = k.canvas(330);
    var eco = k.seg("Écosystème", [["p","Prairie"],["f","Forêt"],["o","Océan (plancton)"]], "p");
    var typ = k.seg("Pyramide", [["n","Nombre"],["b","Biomasse"],["e","Énergie"]], "n");
    var lg = k.toggle("Échelle logarithmique", true);
    var ro = k.readouts(["Forme de la pyramide","Niveau le plus large"]);
    var nt = k.note("","");
    var DATA = {
      p:{lv:["Herbes","Insectes herbivores","Insectes carnivores","Oiseaux insectivores"], n:[1000,200,8,.05], b:[500,20,3,.2], e:[15000,1500,150,15], un:{n:"individus/m²",b:"g/m²",e:"kJ/m²/an"}},
      f:{lv:["Arbres","Insectes herbivores","Araignées, insectes carnivores","Oiseaux insectivores"], n:[.05,100,6,.05], b:[25000,20,4,.4], e:[20000,2000,200,20], un:{n:"individus/m²",b:"g/m²",e:"kJ/m²/an"}},
      o:{lv:["Phytoplancton","Zooplancton","Petits poissons","Grands poissons"], n:[1e10,1e6,10,.02], b:[4,20,10,3], e:[6000,600,60,6], un:{n:"individus/m²",b:"g/m²",e:"kJ/m²/an"}}
    };
    k.draw(function(){
      c.clear(); var d = DATA[eco.value], v = d[typ.value], i, cols = ["#9ccfae","#f1d27d","#f1a97d","#d98a7a"];
      var cx = c.W/2, maxw = c.W-24, y0 = 40, bh = 46, gap = 10;
      var f = function(x){ if (lg.value) { var lo = Math.log10(Math.min.apply(null,v)) - 1, hi = Math.log10(Math.max.apply(null,v)); return Math.max(.03,(Math.log10(x)-lo)/(hi-lo)); } return Math.max(.012, x/Math.max.apply(null,v)); };
      T(c,d.un[typ.value]+(lg.value?" (largeur ∝ log)":" (largeur ∝ valeur)"),c.W/2,18,{size:12,color:P.grey});
      for (i=0;i<4;i++){
        var w = maxw*f(v[i]), y = y0 + (3-i)*(bh+gap);
        rect(c,cx-w/2,y,w,bh,cols[i],P.ink,1.2);
        B3H.badge(c,({p:["herbe","sauterelle","grenouille","buse"],f:["arbre","sauterelle","couleuvre","buse"],o:["plancton","plancton","poisson","poisson"]})[eco.value][i],20,y+bh/2,17,P.ink);
        T(c,d.lv[i],cx,y+13,{size:12,color:P.ink,bg:"rgba(255,255,255,.7)"});
        T(c,S.sci(v[i]),cx,y+32,{size:13,color:P.ink,bg:"rgba(255,255,255,.7)"});
      }
      T(c,"▲ sommet",c.W-8,y0-2,{size:12,align:"right",color:P.grey});
      var inv = false, wid = 0; for (i=1;i<4;i++) if (v[i]>v[i-1]) inv = true; for (i=0;i<4;i++) if (v[i]>v[wid]) wid = i;
      ro.set(0, inv ? "inversée" : "droite"); ro.set(1, d.lv[wid]);
      nt.set(typ.value==="e" ? "Pyramide d'énergie : toujours droite. Chaque niveau reçoit moins que le précédent." : inv ? "Pyramide inversée ! C'est possible pour le nombre ou la biomasse : "+(eco.value==="o"?"le phytoplancton est consommé au fur et à mesure et se renouvelle en quelques jours.":"un seul arbre nourrit des milliers d'insectes.") : "Pyramide droite : chaque niveau est plus petit que celui d'en dessous.", inv ? "warn" : "ok");
    });
  }
});

/* ===== 3 · Manger moins haut ===== */
SFA.sim({
  id:"b3-c02-regime-surface", ch:"c02", tag:"Défi",
  titre:"Manger moins haut : quelle surface pour nourrir une personne ?",
  resume:"Fais varier la part de calories d'origine animale et lis la surface agricole nécessaire.",
  but:"Règle la part animale du régime et le rendement de conversion plante → animal. Défi : nourrir 1 000 personnes avec 100 hectares.",
  aRetenir:"Produire une calorie animale demande plusieurs calories végétales, car l'animal perd l'essentiel de l'énergie en vivant (chaleur, mouvement). Plus la part animale est grande, plus la surface cultivée nécessaire augmente : surface = surface végétale × [(1 − p) + p / rendement].",
  piege:"Modèle simple : on suppose que les animaux sont nourris avec des cultures. En réalité, une partie de l'élevage utilise des prairies où l'on ne peut pas cultiver. Le rendement varie : environ 3 à 5 % pour le bœuf, 10 % pour le porc ou la volaille.",
  build:function(k,S){
    var c = k.canvas(320);
    var p = k.slider("Part des calories d'origine animale", 0, 100, 5, 40, "%");
    var eta = k.slider("Rendement plante → animal", 3, 25, 1, 10, "%");
    var ro = k.readouts(["Surface par personne","Personnes nourries par 100 ha","Comparé au régime 100 % végétal"]);
    var nt = k.note("","");
    var S0m = 350;
    function area(pp){ return S0m*((1-pp/100)+(pp/100)/(eta.value/100)); }
    k.draw(function(){
      c.clear(); var ymax = Math.ceil(area(100)/500)*500;
      var ax = D.axes(c,{x0:0,x1:100,y0:0,y1:ymax,xl:"% de calories animales",yl:"m² par personne",stepX:20,l:56});
      D.fn(c,ax,function(x){ return area(x); },P.acc,3.2);
      var a = area(p.value);
      D.line(c,ax.X(p.value),ax.B,ax.X(p.value),ax.Y(a),P.grey,1.5,[4,4]); D.line(c,ax.L,ax.Y(a),ax.X(p.value),ax.Y(a),P.grey,1.5,[4,4]);
      D.dot(c,ax.X(p.value),ax.Y(a),6,P.violet);
      D.dot(c,ax.X(0),ax.Y(S0m),4,P.green);
      var tg = 1e6/1000, ok = a <= tg + 1e-9;
      if (tg < ymax) { D.line(c,ax.L,ax.Y(tg),ax.R,ax.Y(tg),P.green,1.5,[6,4]); T(c,"objectif 1 000 m²",ax.R-4,ax.Y(tg)-9,{size:12,align:"right",color:P.green}); }
      var persons = 100*1e4/a;
      ro.set(0,nf(a)+" m²"); ro.set(1,nf(persons)); ro.set(2,"× "+S.fmt(a/S0m,1));
      var pmax = (tg/S0m - 1)/(1/(eta.value/100) - 1)*100;
      nt.set(ok ? "Défi réussi : "+nf(persons)+" personnes pour 100 ha." : "Pas encore : avec ce rendement, il faut descendre sous <b>"+S.fmt(pmax,1)+" %</b> de calories animales (objectif : 1 000 personnes, soit 1 000 m² par personne).", ok ? "ok" : "warn");
    });
  }
});

/* ===== 4 · Bioaccumulation ===== */
SFA.sim({
  id:"b3-c02-bioaccumulation", ch:"c02", tag:"Original · niche",
  titre:"Bioaccumulation : un poison de plus en plus concentré",
  resume:"Un polluant très dilué dans l'eau s'accumule le long de la chaîne alimentaire. Qui franchit le seuil de sécurité ?",
  but:"Règle la concentration dans l'eau et le facteur de concentration à chaque maillon. Observe les concentrations (échelle logarithmique) et le niveau qui dépasse le seuil.",
  aRetenir:"Un polluant persistant (mercure, PCB, certains pesticides) n'est pas éliminé : il se stocke dans les tissus. Un prédateur mange de nombreuses proies contaminées, donc sa concentration est plus élevée que celle de ses proies. Les derniers maillons (grands poissons, oiseaux, humains) sont les plus exposés.",
  piege:"Un poison peu concentré dans l'eau n'est pas inoffensif : son danger se joue en haut de la chaîne. Mais tous les polluants ne s'accumulent pas : ceux que l'organisme élimine ou dégrade ne se concentrent pas.",
  build:function(k,S){
    var c = k.canvas(320);
    var cw = k.slider("Polluant dans l'eau", .1, 5, .1, 1, "ng/L");
    var m = k.slider("Facteur de concentration à chaque maillon", 2, 10, .5, 5, "×");
    var el = k.toggle("Polluant éliminé par l'organisme (non persistant)", false);
    var ro = k.readouts(["Phytoplancton","Grand poisson","Dernier maillon"]);
    var nt = k.note("","");
    var BCF = 1e4, SEUIL = 500;                 /* µg/kg : valeur de référence (ordre de grandeur de la limite sanitaire pour le mercure dans le poisson) */
    k.draw(function(){
      c.clear(); var f = el.value ? .8 : m.value, v = [cw.value*BCF/1000], i;   /* ng/kg → µg/kg */
      for (i=1;i<5;i++) v.push(v[i-1]*f);
      var names = ["Phytoplancton","Zooplancton","Petit poisson","Grand poisson","Oiseau / humain"], cols = ["#9ccfae","#f1d27d","#f1a97d","#d98a7a","#b97a9a"];
      var lo = -1, hi = 6, L = 20, R = c.W-16, y0 = 24, bh = 34, gap = 12, X = function(val){ return L + (Math.log10(Math.max(val,.1))-lo)/(hi-lo)*(R-L); };
      for (var e = lo; e <= hi; e++){ D.line(c,X(Math.pow(10,e)),y0-6,X(Math.pow(10,e)),y0+5*(bh+gap)-gap+4,"#edf0f4",1); T(c,e<0?"0,1":(e<4?String(Math.pow(10,e)):"10"+["⁴","⁵","⁶"][e-4]),X(Math.pow(10,e)),y0+5*(bh+gap)+6,{size:12,color:P.grey}); }
      for (i=0;i<5;i++){
        var y = y0 + i*(bh+gap), w = X(v[i]) - L;
        rect(c,L,y,Math.max(w,3),bh,cols[i],v[i]>SEUIL?P.red:P.ink,v[i]>SEUIL?3:1.2);
        T(c,names[i],L+6,y+11,{size:12,align:"left",color:P.ink});
        T(c,S.sci(v[i],2)+" µg/kg",L+6,y+26,{size:12,align:"left",color:P.ink});
      }
      var xs = X(SEUIL); D.line(c,xs,y0-6,xs,y0+5*(bh+gap)-gap+4,P.red,2,[6,4]); T(c,"seuil 500 µg/kg",Math.min(xs,c.W-70),y0-14,{size:12,color:P.red});
      T(c,"concentration (µg/kg, échelle logarithmique)",c.W/2,y0+5*(bh+gap)+24,{size:12,color:P.grey});
      ro.set(0,S.sci(v[0],2)+" µg/kg"); ro.set(1,S.sci(v[3],2)+" µg/kg"); ro.set(2,S.sci(v[4],2)+" µg/kg");
      var first = -1; for (i=0;i<5;i++) if (v[i]>SEUIL){ first = i; break; }
      nt.set(first<0 ? "Aucun maillon ne dépasse le seuil de référence. Augmente le polluant ou le facteur pour voir la bioaccumulation." : "Dès le maillon « "+names[first]+" », le seuil est dépassé : les consommateurs de ce niveau sont menacés alors que l'eau est très peu polluée.", first<0 ? "ok" : "warn");
    });
  }
});
})();
