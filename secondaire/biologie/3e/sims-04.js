(function(){
var D = SFA.draw, P = D.palette, T = D.text, F = SFA.fmt;
function rect(c,x,y,w,h,fill,stroke,lw,r){ var g=c.ctx; g.save(); g.beginPath(); if(g.roundRect&&r) g.roundRect(x,y,w,h,r); else g.rect(x,y,w,h); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1.5;g.stroke();} g.restore(); }
function circ(c,x,y,r,fill,stroke,lw){ var g=c.ctx; g.beginPath(); g.arc(x,y,r,0,6.2832); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||2;g.stroke();} }
function clamp(v,a,b){ return Math.max(a,Math.min(b,v)); }
function mix(c1,c2,t){ t=clamp(t,0,1); return "rgb("+Math.round(c1[0]+(c2[0]-c1[0])*t)+","+Math.round(c1[1]+(c2[1]-c1[1])*t)+","+Math.round(c1[2]+(c2[2]-c1[2])*t)+")"; }
function poly(c,pts,fill,stroke,lw){ var g=c.ctx; g.beginPath(); g.moveTo(pts[0][0],pts[0][1]); for(var i=1;i<pts.length;i++) g.lineTo(pts[i][0],pts[i][1]); g.closePath(); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1.5;g.stroke();} }
function rng(seed){ var s=seed>>>0; return function(){ s=(s+0x6D2B79F5)>>>0; var t=s; t=Math.imul(t^(t>>>15),t|1); t^=t+Math.imul(t^(t>>>7),t|61); return ((t^(t>>>14))>>>0)/4294967296; }; }
function nf(x,d){ var a = F(x,d||0).split(","); a[0] = a[0].replace(/\B(?=(\d{3})+(?!\d))/g," "); return a.join(","); }

/* ===== 1 · Zoom sur l'intestin : plier la paroi ===== */
SFA.sim({
  id:"b3-c04-surface-intestin", ch:"c04", tag:"Classique · tombe souvent",
  titre:"Plis, villosités, microvillosités : la surface d'absorption",
  resume:"Un tube lisse de 4 m offre 0,3 m² : plisse sa paroi à trois échelles et regarde la surface exploser.",
  but:"Règle le facteur de multiplication de chaque niveau de repliement et observe la coupe de la paroi et la surface totale d'échange.",
  aRetenir:"La paroi de l'intestin grêle est repliée à trois échelles : plis, villosités, microvillosités. Les facteurs se multiplient : une longueur modeste devient une très grande surface d'échange (de l'ordre de dizaines à centaines de m² selon les estimations), ce qui permet d'absorber beaucoup de nutriments rapidement.",
  piege:"Ce n'est pas « la surface d'un terrain de tennis » à prendre au pied de la lettre : les mesures varient de 30 à 250 m² selon les méthodes. Retiens l'idée : replier = agrandir la surface sans agrandir le volume. Une villosité n'est pas un poil ni un tube vide : elle contient un capillaire sanguin et un vaisseau chylifère.",
  build:function(k,S){
    var c = k.canvas(330);
    var L = k.slider("Longueur du grêle", 3, 7, .5, 4, "m");
    var f1 = k.slider("Plis (facteur)", 1, 3, .5, 3, "×");
    var f2 = k.slider("Villosités (facteur)", 1, 10, 1, 10, "×");
    var f3 = k.slider("Microvillosités (facteur)", 1, 20, 1, 20, "×");
    var ro = k.readouts(["Tube lisse","Surface avec replis","Multiplication","Équivalent en « peaux »"]);
    var nt = k.note("","");
    k.draw(function(){
      c.clear(); var g = c.ctx, W = c.W, yb = 250, x0 = 20, x1 = W-20;
      var a1 = (f1.value-1)/2*34, h2 = (f2.value-1)/9*34, h3 = (f3.value-1)/19*6;
      function yc(x){ return yb - a1*(1-Math.cos(2*Math.PI*(x-x0)/(x1-x0)*3))/2; }
      /* lumière en haut, paroi en bas */
      rect(c,x0,20,x1-x0,yb-20+60,"#fdf3e6");
      g.fillStyle="#f2b9a8"; g.beginPath(); g.moveTo(x0,yb+70); g.lineTo(x0,yc(x0)); 
      var nv = 16, i;
      for (var x=x0; x<=x1; x+=2) g.lineTo(x,yc(x));
      g.lineTo(x1,yb+70); g.closePath(); g.fill();
      g.strokeStyle="#b56a50"; g.lineWidth=2; g.beginPath(); for (x=x0; x<=x1; x+=2){ if (x===x0) g.moveTo(x,yc(x)); else g.lineTo(x,yc(x)); } g.stroke();
      if (f2.value>1){
        for (i=0;i<nv;i++){
          var vx = x0 + (i+.5)*(x1-x0)/nv, vy = yc(vx), vw = 8;
          g.fillStyle="#f2b9a8"; g.strokeStyle="#b56a50"; g.lineWidth=1.6; g.beginPath(); g.moveTo(vx-vw/2,vy+2); g.lineTo(vx-vw/2,vy-h2+vw/2); g.arc(vx,vy-h2+vw/2,vw/2,Math.PI,0); g.lineTo(vx+vw/2,vy+2); g.fill(); g.stroke();
          g.strokeStyle=P.red; g.lineWidth=1.4; g.beginPath(); g.moveTo(vx,vy+2); g.lineTo(vx,vy-h2+2); g.stroke();
          if (h3>.4){ g.strokeStyle="#7a3a28"; g.lineWidth=1; for (var m=-3;m<=3;m++){ var ang = m*.3-Math.PI/2; g.beginPath(); g.moveTo(vx+Math.cos(ang)*(vw/2),vy-h2+vw/2+Math.sin(ang)*(vw/2)); g.lineTo(vx+Math.cos(ang)*(vw/2+h3),vy-h2+vw/2+Math.sin(ang)*(vw/2+h3)); g.stroke(); } }
        }
      }
      T(c,"lumière de l'intestin (aliments digérés)",c.W/2,34,{size:12,color:P.amber});
      T(c,"paroi (coupe schématique)",c.W/2,yb+50,{size:12,color:"#7a3a28"});
      var s0 = Math.PI*.025*L.value, fac = f1.value*f2.value*f3.value, st = s0*fac;
      ro.set(0,S.fmt(s0,2)+" m²"); ro.set(1,st>=10 ? S.fmt(st,0)+" m²" : S.fmt(st,1)+" m²"); ro.set(2,"× "+S.fmt(fac,fac%1 ? 1 : 0)); ro.set(3,S.fmt(st/1.8,0)+" × la peau (1,8 m²)");
      nt.set(fac===1 ? "Paroi lisse : peu de surface. Replie-la !" : "Facteurs : "+S.fmt(f1.value,1)+" × "+f2.value+" × "+f3.value+" = "+S.fmt(fac,fac%1 ? 1 : 0)+". La surface est multipliée sans que le volume de l'intestin change.","ok");
    });
  }
});

/* ===== 2 · Glucose dans le sang ===== */
SFA.sim({
  id:"b3-c04-glycemie", ch:"c04", tag:"Modèle chiffré",
  titre:"Après le repas : la glycémie en montagnes russes",
  resume:"Un repas sucré ou un repas complet : comment le glucose absorbé fait monter puis redescendre la glycémie.",
  but:"Règle la quantité de glucose absorbée et la vitesse d'absorption. Compare un fonctionnement normal et une régulation insuffisante (diabète).",
  aRetenir:"Le glucose absorbé arrive dans le sang (veine porte puis foie). La glycémie monte, puis redescend : le glucose est mis en réserve (glycogène du foie et des muscles) ou utilisé par les cellules, sous l'action de l'insuline du pancréas. Normale : environ 0,7 à 1,1 g/L ; une glycémie à jeun supérieure à 1,26 g/L signale un diabète.",
  piege:"Aliments rapides (boissons sucrées) = pic haut et rapide ; aliments à fibres = montée plus lente et plus basse, pour la même quantité de glucose. Le glucose ne disparaît pas : il est stocké ou consommé. (Modèle simplifié, valeurs indicatives ; l'insuline n'est pas modélisée en détail.)",
  build:function(k,S){
    var c = k.canvas(300);
    var A = k.slider("Glucose absorbé au repas", 0, 100, 5, 50, "g");
    var v = k.seg("Type de repas", [[20,"Rapide (boisson sucrée)"],[60,"Lent (repas à fibres)"]], 20);
    var reg = k.seg("Régulation", [["n","Normale"],["d","Insuffisante (diabète)"]], "n");
    var tm = k.slider("Temps après le repas", 0, 300, 10, 60, "min");
    var ro = k.readouts(["Glycémie à cet instant","Pic de glycémie","Heure du pic","Glucose retiré du sang"]);
    var nt = k.note("","");
    function run(){
      var tau = +v.value, V = 15, G0 = reg.value==="n" ? .9 : 1.3, kb = reg.value==="n" ? .02 : .005, be = reg.value==="n" ? .12 : .018, dt = .25, G = G0, cl = 0, out = [], pk = G0, tp = 0;
      for (var i=0;i<=1200;i++){
        var t = i*dt, ra = A.value*t/(tau*tau)*Math.exp(-t/tau), x = G-G0, cc = (kb+be*Math.max(0,x))*x;
        out.push([t,G,cl]); if (G>pk){ pk = G; tp = t; }
        cl += cc*V*dt; G += dt*(ra/V - cc);
      }
      return {out:out,pk:pk,tp:tp};
    }
    k.draw(function(){
      c.clear(); var r = run(), ax = D.axes(c,{x0:0,x1:300,y0:.5,y1:Math.max(2.4,Math.ceil(r.pk*5)/5+.1),xl:"temps (min)",yl:"glycémie (g/L)",stepX:60,stepY:.5,l:50});
      c.ctx.fillStyle = "rgba(46,107,85,.13)"; c.ctx.fillRect(ax.L,ax.Y(1.1),ax.R-ax.L,ax.Y(.7)-ax.Y(1.1));
      T(c,"zone normale",ax.R-4,ax.Y(.78),{size:12,align:"right",color:P.green});
      c.ctx.save(); c.ctx.setLineDash([5,4]); c.ctx.strokeStyle = P.red; c.ctx.beginPath(); c.ctx.moveTo(ax.L,ax.Y(1.26)); c.ctx.lineTo(ax.R,ax.Y(1.26)); c.ctx.stroke(); c.ctx.restore();
      T(c,"1,26 g/L",ax.R-4,ax.Y(1.26)-9,{size:12,align:"right",color:P.red});
      D.fn(c,ax,function(x){ var j = Math.min(1200,Math.round(x*4)); return r.out[j][1]; },P.acc,3);
      var j = Math.min(1200,Math.round(tm.value*4)), cur = r.out[j];
      D.dot(c,ax.X(tm.value),ax.Y(cur[1]),6,P.violet);
      ro.set(0,S.fmt(cur[1],2)+" g/L"); ro.set(1,S.fmt(r.pk,2)+" g/L"); ro.set(2,A.value>0 ? S.fmt(r.tp,0)+" min" : "—"); ro.set(3,S.fmt(cur[2],0)+" g sur "+A.value+" g");
      var last = r.out[1200][1];
      if (A.value===0){ nt.set(reg.value==="d" ? "Aucun glucose absorbé : la glycémie à jeun reste à 1,30 g/L, au-dessus de 1,26 g/L. C'est le signe d'un diabète, même sans repas." : "Aucun glucose absorbé : la glycémie reste à sa valeur de base (0,90 g/L). Ajoute du glucose pour voir la montée.", reg.value==="d" ? "warn" : "ok"); return; }
      nt.set(reg.value==="d" && last>1.26 ? "Régulation insuffisante : cinq heures après, la glycémie reste au-dessus de 1,26 g/L : le glucose n'est pas rangé assez vite." : r.pk>1.26 && reg.value==="n" ? "Pic au-dessus de 1,26 g/L, mais la glycémie revient dans la zone normale : l'organisme régule." : "Montée modérée puis retour à la normale : le glucose est stocké ou utilisé.", reg.value==="d" && last>1.26 ? "warn" : "ok");
    });
  }
});

/* ===== 3 · Circuit du nutriment ===== */
SFA.sim({
  id:"b3-c04-circuit", ch:"c04", tag:"Animation · corps humain",
  titre:"Suivre un nutriment de l'intestin aux organes",
  resume:"Glucose ou graisse : deux routes différentes au départ de l'intestin. Qui passe par le foie en premier ?",
  but:"Choisis un nutriment, lance le trajet ou avance étape par étape. Touche un organe sur le schéma pour sauter à cette étape. Lis la concentration relative à chaque étape.",
  aRetenir:"Glucose et acides aminés traversent la paroi dans les capillaires sanguins, rejoignent la veine porte et passent par le foie avant le cœur : le foie filtre, stocke et régule. Les graisses (acides gras, glycérol) sont reconstituées dans la cellule et empruntent les vaisseaux chylifères puis la lymphe, et rejoignent le sang près du cœur, sans passer d'abord par le foie.",
  piege:"Le sang quittant l'intestin ne va pas directement au cœur : il passe d'abord par le foie (veine porte). Lymphe et sang sont deux liquides circulants différents. (Concentrations relatives indicatives.)",
  build:function(k,S){
    var c = k.canvas(0,{ratio:1.15});
    var nu = k.seg("Nutriment", [["g","Glucose"],["a","Acides aminés"],["l","Lipides (graisses)"]], "g", function(){ st.set(0); lp.pause(); t = 0; });
    var st = k.slider("Étape du trajet", 0, 8, 1, 0, "", function(){ t = st.value; });
    var t = 0;
    var lp = k.loop(function(dt){ t += dt*.7; if (t >= 8){ t = 8; lp.pause(); } st.set(Math.round(t)); k.redraw(); });
    k.button("▶ Lire le trajet", function(){ if (lp.running) lp.pause(); else { if (t>=8) t = 0; lp.play(); } }, true);
    var ro = k.readouts(["Où est le nutriment ?","Concentration relative"]);
    var nt = k.note("","");
    var PTS = {
      sang:[[.5,.82],[.4,.71],[.28,.6],[.36,.49],[.44,.4],[.73,.24],[.56,.41],[.5,.25],[.5,.07]],
      lymphe:[[.5,.82],[.62,.73],[.65,.58],[.63,.3],[.44,.4],[.73,.24],[.56,.41],[.5,.25],[.5,.07]]
    };
    var R = {
      sang:{lab:["Villosité (capillaire)","Veine porte","Foie","Veine cave inférieure","Cœur (droit)","Poumons","Cœur (gauche)","Aorte","Organes"],
        txt:["Le nutriment traverse la paroi intestinale et entre dans un capillaire sanguin de la villosité.","Les veines de l'intestin se réunissent en la veine porte, qui mène directement au foie.","Le foie capte, stocke (glycogène, réserves) et transforme : premier filtre.","Le sang sorti du foie repart par la veine cave inférieure.","Il arrive dans le cœur droit.","Le cœur droit l'envoie aux poumons, où il se recharge en dioxygène.","Retour au cœur gauche.","Le cœur gauche propulse le sang dans l'aorte, vers tout le corps.","Les cellules des organes reçoivent le nutriment et l'utilisent."]},
      lymphe:{lab:["Villosité (chylifère)","Vaisseau lymphatique","Lymphe","Veine sous-clavière","Cœur (droit)","Poumons","Cœur (gauche)","Aorte","Organes"],
        txt:["Les graisses reconstituées sont absorbées dans le chylifère central de la villosité.","Elles gagnent les vaisseaux lymphatiques de l'intestin.","La lymphe laiteuse circule dans les vaisseaux lymphatiques et le canal thoracique.","La lymphe se déverse dans une veine près du cœur (veine sous-clavière).","Le mélange entre dans le cœur droit : pas de passage direct par le foie.","Les poumons.","Cœur gauche.","L'aorte distribue vers tout le corps (le foie reçoit alors sa part par l'artère hépatique).","Les cellules et le tissu adipeux utilisent ou stockent les graisses."]}
    };
    var CONC = {g:[100,100,66,66,66,66,66,66,66], a:[100,100,60,60,60,60,60,60,60], l:[100,100,100,100,100,100,100,100,100]};
    var cur = function(){ return nu.value==="l" ? "lymphe" : "sang"; };
    c.pointer(function(type,p){ if (type!=="down") return; var pts = PTS[cur()], best=-1, bd=30; pts.forEach(function(q,i){ var d=Math.hypot(p.x-q[0]*c.W,p.y-q[1]*c.H); if (d<bd){ bd=d; best=i; } }); if (best>=0){ lp.pause(); t=best; st.set(best); k.redraw(); } });
    function blob(g,pts,fill,stroke){ g.beginPath(); g.moveTo(pts[0][0],pts[0][1]); for (var i=1;i<=pts.length;i++){ var a=pts[i-1], b=pts[i%pts.length]; g.quadraticCurveTo(a[0],a[1],(a[0]+b[0])/2,(a[1]+b[1])/2); } g.closePath(); g.fillStyle=fill; g.fill(); if (stroke){ g.strokeStyle=stroke; g.lineWidth=1.4; g.stroke(); } }
    k.draw(function(){
      c.clear(); var g = c.ctx, W=c.W, H=c.H, key = cur(), r = R[key], pts = PTS[key].map(function(q){ return [q[0]*W,q[1]*H]; }), s = Math.round(st.value), col = key==="sang" ? "#c0321d" : "#d99a1c", i;
      var bgc=g.createLinearGradient(0,0,0,H); bgc.addColorStop(0,"#eef4fb"); bgc.addColorStop(1,"#e6eef8"); g.fillStyle=bgc; g.fillRect(0,0,W,H);
      /* silhouette */
      g.fillStyle="#fbe9dc"; g.strokeStyle="#e3c8b4"; g.lineWidth=2;
      g.beginPath(); g.arc(W*.5,H*.075,W*.085,0,6.3); g.fill(); g.stroke();
      g.beginPath(); g.moveTo(W*.3,H*.17); g.quadraticCurveTo(W*.5,H*.13,W*.7,H*.17); g.quadraticCurveTo(W*.82,H*.4,W*.7,H*.92); g.lineTo(W*.3,H*.92); g.quadraticCurveTo(W*.18,H*.4,W*.3,H*.17); g.closePath(); g.fill(); g.stroke();
      /* organes */
      var u=W/380;
      blob(g,[[W*.3,H*.2],[W*.4,H*.17],[W*.43,H*.3],[W*.38,H*.4],[W*.3,H*.38],[W*.27,H*.28]],"#f3b6b6","#d98787");
      blob(g,[[W*.58,H*.17],[W*.7,H*.2],[W*.74,H*.3],[W*.68,H*.4],[W*.6,H*.38],[W*.57,H*.28]],"#f3b6b6","#d98787");
      var onLiver = key==="sang";
      blob(g,[[W*.18,H*.55],[W*.3,H*.5],[W*.4,H*.56],[W*.36,H*.64],[W*.24,H*.66]],onLiver?"#b9674a":"#cfa591","#7a3d27");
      g.strokeStyle="#e5a0a0"; g.lineWidth=11*u; g.lineCap="round"; g.lineJoin="round"; g.beginPath();
      g.moveTo(W*.37,H*.76); g.bezierCurveTo(W*.37,H*.7,W*.63,H*.7,W*.63,H*.76); g.bezierCurveTo(W*.65,H*.83,W*.52,H*.78,W*.5,H*.84); g.bezierCurveTo(W*.46,H*.89,W*.35,H*.84,W*.37,H*.76); g.stroke();
      g.strokeStyle="#f3c4c4"; g.lineWidth=6*u; g.stroke();
      g.fillStyle="#d4455b"; g.strokeStyle="#8f2338"; g.lineWidth=1.5; g.beginPath(); g.moveTo(W*.5,H*.46); g.bezierCurveTo(W*.38,H*.36,W*.44,H*.31,W*.5,H*.37); g.bezierCurveTo(W*.58,H*.31,W*.64,H*.36,W*.5,H*.46); g.fill(); g.stroke();
      D.text(c,"foie",W*.2,H*.64,{size:11,color:"#6e3523"}); D.text(c,"poumon",W*.34,H*.2,{size:10.5,color:"#a35050"}); D.text(c,"poumon",W*.64,H*.2,{size:10.5,color:"#a35050"});
      D.text(c,"cœur",W*.5,H*.44,{size:10.5,color:"#fff"}); D.text(c,"intestin grêle",W*.5,H*.9,{size:10.5,color:"#a35050"});
      /* route */
      g.save(); g.strokeStyle=col; g.lineWidth=5; g.lineJoin="round"; g.lineCap="round"; g.globalAlpha=.3; g.beginPath(); pts.forEach(function(q,j){ j?g.lineTo(q[0],q[1]):g.moveTo(q[0],q[1]); }); g.stroke(); g.restore();
      g.save(); g.strokeStyle=col; g.lineWidth=5; g.lineJoin="round"; g.lineCap="round"; g.beginPath(); for (i=0;i<=Math.min(8,Math.floor(t));i++){ i?g.lineTo(pts[i][0],pts[i][1]):g.moveTo(pts[i][0],pts[i][1]); } if (t<8 && t>Math.floor(t)){ var a0=Math.floor(t),uu=t-a0; g.lineTo(pts[a0][0]+(pts[a0+1][0]-pts[a0][0])*uu,pts[a0][1]+(pts[a0+1][1]-pts[a0][1])*uu); } g.stroke(); g.restore();
      for (i=0;i<9;i++){ var act=i===s; g.beginPath(); g.arc(pts[i][0],pts[i][1],act?9:6,0,6.3); g.fillStyle=act?"#fff":(i<s?col:"#fff"); g.fill(); g.lineWidth=act?3:2; g.strokeStyle=act?P.violet:(i<=s?col:P.grey); g.stroke(); }
      var a = Math.min(8,Math.floor(t)), b = Math.min(8,a+1), uu2 = t-a, dx = pts[a][0]+(pts[b][0]-pts[a][0])*uu2, dy = pts[a][1]+(pts[b][1]-pts[a][1])*uu2;
      D.glow(c,dx,dy,22,col,.5); g.beginPath(); g.arc(dx,dy,7,0,6.3); g.fillStyle=col; g.fill(); g.lineWidth=2.5; g.strokeStyle="#fff"; g.stroke();
      /* bulle d'étape */
      var lab = (s+1)+". "+r.lab[s]; var bx = Math.min(W-12, Math.max(12, pts[s][0])); var left = pts[s][0] > W*.5;
      D.label(c,lab,left?pts[s][0]-14:pts[s][0]+14,pts[s][1]-(s===8?-18:0),{size:11.5,color:P.violet,align:left?"right":"left"});
      D.label(c,key==="sang"?"route du sang":"route de la lymphe",8,H*.97,{size:11.5,color:col,align:"left"});
      ro.set(0,r.lab[s]); ro.set(1,CONC[nu.value][s]+" %");
      nt.set(r.txt[s], "ok");
    });
  }
});

/* ===== 4 · Chirurgie de l'intestin ===== */
SFA.sim({
  id:"b3-c04-chirurgie", ch:"c04", tag:"Original · niche",
  titre:"Retirer un tronçon d'intestin : quelles carences ?",
  resume:"Chaque nutriment est surtout absorbé dans une zone précise du grêle. Retire un tronçon et vois ce qui manque.",
  but:"Place le début et la longueur du tronçon retiré. Lis, pour chaque nutriment, la part d'absorption qui reste.",
  aRetenir:"L'absorption n'est pas uniforme : le fer et le calcium surtout au début (duodénum), glucose, acides aminés et graisses dans la première partie, la vitamine B12 et les sels biliaires dans la fin (iléon). Selon le tronçon retiré, les carences ne sont pas les mêmes.",
  piege:"Retirer 20 % de l'intestin ne fait pas perdre 20 % de tout : cela dépend de la zone. Le corps compense en partie (adaptation, réserves), mais la fin de l'iléon est irremplaçable pour la vitamine B12. (Cartes d'absorption simplifiées.)",
  build:function(k,S){
    var c = k.canvas(330);
    var s0 = k.slider("Début du tronçon retiré", 0, 90, 5, 30, "% du grêle");
    var ln = k.slider("Longueur retirée", 0, 100, 5, 30, "% du grêle");
    var ro = k.readouts(["Longueur restante (grêle de 5 m)","Plus gros déficit"]);
    var nt = k.note("","");
    var NU = [
      {n:"Fer, calcium", col:"#b5651d", f:function(x){ return Math.exp(-x/.12); }},
      {n:"Glucose, acides aminés", col:"#2e6b55", f:function(x){ return Math.exp(-Math.pow((x-.25)/.2,2)/2); }},
      {n:"Graisses (acides gras)", col:"#d4a017", f:function(x){ return Math.exp(-Math.pow((x-.35)/.28,2)/2); }},
      {n:"Eau, sels", col:"#0e7490", f:function(x){ return 1; }},
      {n:"Vitamine B12, sels biliaires", col:"#5B21B6", f:function(x){ return Math.exp(-Math.pow((x-.92)/.07,2)/2); }}
    ];
    NU.forEach(function(q){ var s=0,i; for (i=0;i<1000;i++) s += q.f((i+.5)/1000); q.tot = s; });
    function kept(q,a,b){ var s=0,i; for (i=0;i<1000;i++){ var x=(i+.5)/1000; if (x<a||x>b) s += q.f(x); } return s/q.tot; }
    k.draw(function(){
      c.clear(); var a = s0.value/100, b = Math.min(1,a+ln.value/100), W = c.W, x0 = 20, x1 = W-20, i;
      T(c,"Duodénum",x0,16,{size:12,align:"left",color:P.grey}); T(c,"Iléon",x1,16,{size:12,align:"right",color:P.grey});
      rect(c,x0,26,x1-x0,26,"#f2b9a8","#b56a50",1.5,13);
      if (b>a) rect(c,x0+(x1-x0)*a,26,(x1-x0)*(b-a),26,"#fff","#b42318",2);
      if (b>a) T(c,"retiré",x0+(x1-x0)*(a+b)/2,39,{size:12,color:P.red});
      var worst = 1, wn = "", y = 74;
      NU.forEach(function(q,j){
        var r = kept(q,a,b), yy = y + j*46;
        T(c,q.n,x0,yy,{size:12,align:"left",color:P.ink}); T(c,S.fmt(r*100,0)+" %",x1,yy,{size:12,align:"right",color:r<.7?P.red:P.ink});
        rect(c,x0,yy+10,x1-x0,14,"#eee",P.grey,1,7); rect(c,x0,yy+10,Math.max(2,(x1-x0)*r),14,r<.7?P.red:q.col,null,0,7);
        if (r<worst){ worst = r; wn = q.n; }
      });
      var rem = 5*(1-(b-a));
      ro.set(0,S.fmt(rem,1)+" m"); ro.set(1, worst<.98 ? wn+" (−"+S.fmt((1-worst)*100,0)+" %)" : "aucun");
      nt.set(rem<2 ? "Moins de 2 m de grêle restant : « syndrome de l'intestin court », nutrition spécialisée nécessaire." : worst<.7 ? "Risque de <b>carence</b> : "+wn+" (moins de 70 % de l'absorption préservée)." : b>a ? "Les carences restent limitées : les zones absorbantes essentielles sont conservées." : "Rien n'est retiré : absorption complète.", rem<2||worst<.7 ? "warn" : "ok");
    });
  }
});
})();

/*B3D-LIB*/
window.B3D = window.B3D || (function(){
  var B = {}, BG = [244,246,251];
  B.hex = function(h){ h = h.replace("#",""); return [parseInt(h.substr(0,2),16), parseInt(h.substr(2,2),16), parseInt(h.substr(4,2),16)]; };
  B.mix = function(a,b,t){ return [a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t, a[2]+(b[2]-a[2])*t]; };
  B.css = function(a,al){ return "rgba("+Math.round(a[0])+","+Math.round(a[1])+","+Math.round(a[2])+","+(al===undefined?1:al)+")"; };
  B.cam = function(yaw,pitch,dist){ return {yaw:yaw, pitch:pitch, dist:dist||7, auto:true, hold:false}; };
  B.rot = function(cam,x,y,z){
    var cy=Math.cos(cam.yaw), sy=Math.sin(cam.yaw), cp=Math.cos(cam.pitch), sp=Math.sin(cam.pitch);
    var x1=cy*x+sy*z, z1=-sy*x+cy*z, y1=cp*y+sp*z1, z2=-sp*y+cp*z1; return [x1,y1,z2];
  };
  /* glisser = tourner (souris et doigt) */
  B.drag = function(c, cam, redraw){
    c.cv.style.touchAction = "none"; c.cv.style.cursor = "grab";
    var lx=0, ly=0, dn=false;
    c.pointer(function(t,p){
      if (t==="down"){ dn=true; lx=p.x; ly=p.y; cam.hold=true; c.cv.style.cursor="grabbing"; }
      else if (t==="drag" && dn){ cam.yaw -= (p.x-lx)*0.012; cam.pitch += (p.y-ly)*0.01; cam.pitch = Math.max(-1.45, Math.min(1.45, cam.pitch)); lx=p.x; ly=p.y; if (redraw) redraw(); }
      else if (t==="up"){ dn=false; cam.hold=false; c.cv.style.cursor="grab"; }
    });
  };
  B.spin = function(cam, dt, speed){ if (cam.auto && !cam.hold) cam.yaw += dt*(speed||0.35); };
  B.background = function(c){
    var ctx=c.ctx, g=ctx.createLinearGradient(0,0,0,c.H); g.addColorStop(0,"#fbfcff"); g.addColorStop(1,"#e9eef7");
    ctx.fillStyle=g; ctx.fillRect(0,0,c.W,c.H);
  };
  B.hint = function(c, txt){
    var ctx=c.ctx; ctx.save(); ctx.font="600 11px Mulish,system-ui,sans-serif"; ctx.fillStyle="#8a95a3"; ctx.textAlign="left"; ctx.textBaseline="alphabetic";
    ctx.fillText(txt || "Glisse pour tourner la vue en 3D", 10, c.H-10); ctx.restore();
  };
  B.scene = function(c, cam, scale, fogD){
    var items=[], labels=[], ctx=c.ctx, fd=fogD||4;
    var S = {};
    S.P = function(p){ var r=B.rot(cam,p[0],p[1],p[2]); var k=cam.dist/(cam.dist+r[2]); return {x:c.W/2+r[0]*k*scale, y:c.H/2-r[1]*k*scale, z:r[2], k:k}; };
    function fog(z){ return Math.max(0, Math.min(1, (z+fd)/(2*fd)))*0.5; }
    S.sphere = function(p, r, col, al, ring){
      var q=S.P(p), rr=r*q.k*scale; if (rr<0.4) return;
      items.push({z:q.z, f:function(){
        var base=B.mix(col, BG, fog(q.z));
        var g=ctx.createRadialGradient(q.x-.35*rr,q.y-.4*rr,rr*.08,q.x,q.y,rr);
        g.addColorStop(0,B.css(B.mix(base,[255,255,255],.6))); g.addColorStop(.5,B.css(base)); g.addColorStop(1,B.css(B.mix(base,[0,0,20],.42)));
        ctx.globalAlpha = al===undefined?1:al; ctx.fillStyle=g; ctx.beginPath(); ctx.arc(q.x,q.y,rr,0,6.2832); ctx.fill();
        if (ring){ ctx.strokeStyle=ring; ctx.lineWidth=Math.max(1,rr*.12); ctx.stroke(); }
        ctx.globalAlpha=1; }});
      return q;
    };
    S.line = function(a, b, w, col, al, dash){
      var p=S.P(a), q=S.P(b), z=(p.z+q.z)/2, wd=w*(p.k+q.k)/2*scale;
      items.push({z:z, f:function(){
        ctx.globalAlpha = al===undefined?1:al; ctx.lineCap="round"; ctx.strokeStyle=B.css(B.mix(col,BG,fog(z)));
        if (dash) ctx.setLineDash(dash);
        ctx.lineWidth=Math.max(.6,wd); ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y); ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha=1; }});
    };
    /* cylindre ombré entre a et b (rayon r) */
    S.tube = function(a, b, r, col, al){
      var p=S.P(a), q=S.P(b), z=(p.z+q.z)/2, wd=2*r*(p.k+q.k)/2*scale;
      items.push({z:z, f:function(){
        var base=B.mix(col,BG,fog(z)); ctx.globalAlpha = al===undefined?1:al; ctx.lineCap="round";
        var ws=[1,.7,.4,.18], cs=[B.mix(base,[0,0,20],.4), B.mix(base,[0,0,20],.12), base, B.mix(base,[255,255,255],.5)];
        var dx=(q.x-p.x), dy=(q.y-p.y), L=Math.sqrt(dx*dx+dy*dy)||1, nx=-dy/L, ny=dx/L;
        for (var i=0;i<4;i++){ var off=(i>=2? -0.18:0)*wd/2; ctx.strokeStyle=B.css(cs[i]); ctx.lineWidth=Math.max(.6,wd*ws[i]);
          ctx.beginPath(); ctx.moveTo(p.x+nx*off,p.y+ny*off); ctx.lineTo(q.x+nx*off,q.y+ny*off); ctx.stroke(); }
        ctx.globalAlpha=1; }});
    };
    /* face plane (liste de points 3D), normale n (3D), ombrage de Lambert */
    S.poly = function(pts, col, n, al, stroke, back){
      var ps=pts.map(S.P), z=0; ps.forEach(function(p){ z+=p.z; }); z/=ps.length; if (back) z=99;
      var sh=0.75;
      if (n){ var r=B.rot(cam,n[0],n[1],n[2]), L=Math.sqrt(r[0]*r[0]+r[1]*r[1]+r[2]*r[2])||1; var d=(-0.35*r[0]+0.55*r[1]-0.75*r[2])/L; sh=0.55+0.45*Math.abs(d); }
      items.push({z:z, f:function(){
        var base=B.mix(col,BG,fog(z)); base=B.mix([0,0,20],base,Math.min(1,sh)); if (sh>1) base=B.mix(base,[255,255,255],sh-1);
        ctx.globalAlpha=al===undefined?1:al; ctx.fillStyle=B.css(base); ctx.beginPath(); ctx.moveTo(ps[0].x,ps[0].y);
        for (var i=1;i<ps.length;i++) ctx.lineTo(ps[i].x,ps[i].y); ctx.closePath(); ctx.fill();
        if (stroke){ ctx.strokeStyle=stroke; ctx.lineWidth=.8; ctx.stroke(); } ctx.globalAlpha=1; }});
    };
    S.label = function(p, txt, col, size, dx, dy, align){ labels.push({q:S.P(p), t:txt, c:col||"#0f1b2d", s:size||12, dx:dx||0, dy:dy||0, a:align||"center"}); };
    S.flush = function(){
      items.sort(function(a,b){ return b.z-a.z; });
      for (var i=0;i<items.length;i++) items[i].f();
      ctx.save(); ctx.textBaseline="middle";
      labels.forEach(function(l){ ctx.font="700 "+l.s+"px Mulish,system-ui,sans-serif"; ctx.textAlign=l.a;
        var w=ctx.measureText(l.t).width, x=l.q.x+l.dx, y=l.q.y+l.dy;
        ctx.fillStyle="rgba(255,255,255,.82)"; var bx = l.a==="center"? x-w/2 : (l.a==="left"? x : x-w); ctx.fillRect(bx-3,y-l.s*.62,w+6,l.s*1.25);
        ctx.fillStyle=l.c; ctx.fillText(l.t,x,y); });
      ctx.restore();
    };
    return S;
  };
  return B;
})();
/*B3D-LIB-END*/

/*B3D-ADD:b3-3d-villosite*/
SFA.sim({
  id:"b3-3d-villosite", ch:"c04", tag:"3D · absorption",
  titre:"Une forêt de villosités : où partent les nutriments absorbés ?",
  resume:"Des villosités de l'intestin grêle en 3D : le glucose et les acides aminés partent dans le sang, les lipides dans la lymphe.",
  but:"Choisis un nutriment et la concentration dans la lumière de l'intestin. Observe où il est absorbé et par quel vaisseau il quitte la villosité. Supprime les villosités (paroi lisse) et compare le nombre de molécules absorbées. Glisse pour tourner.",
  aRetenir:"La paroi de l'intestin grêle est couverte de villosités (puis de microvillosités) : cela multiplie la surface d'absorption. Dans chaque villosité, un réseau de capillaires sanguins reçoit le glucose, les acides aminés, l'eau et les sels : ce sang passe par la veine porte puis par le foie avant le reste du corps. Un vaisseau lymphatique central (chylifère) reçoit les lipides (sous forme de petites gouttelettes) : la lymphe rejoint le sang sans passer d'abord par le foie.",
  piege:"« Tout ce qui est absorbé va dans le sang » est inexact : les lipides empruntent d'abord la lymphe. Et l'absorption n'est pas la digestion : un nutriment doit d'abord être découpé en petites molécules (glucose, acides aminés, acides gras) pour traverser la paroi.",
  build:function(k, S){
    var B = window.B3D, c = k.canvas(430), cam = B.cam(0.7, 0.45, 8);
    var nut = k.seg("Nutriment", [["glu","Glucose"],["aa","Acides aminés"],["lip","Lipides"],["mix","Les trois"]], "mix", function(){ reset(); });
    var conc = k.slider("Concentration dans la lumière", 10, 100, 5, 60, "%");
    var vil = k.toggle("Paroi avec villosités", true, function(){ reset(); });
    var rot = k.toggle("Rotation automatique", false, function(v){ cam.auto = v; });
    var ro = k.readouts(["Absorbés (cumul)", "Vers le sang (foie)", "Vers la lymphe", "Débit (par 10 s)"]);
    var nt = k.note("", "");
    cam.auto = false;
    var TY = {glu:{c:B.hex("#f59e0b"), n:"glucose"}, aa:{c:B.hex("#7c3aed"), n:"acide aminé"}, lip:{c:B.hex("#facc15"), n:"lipide"}};
    var VX = [-0.9, 0, 0.9], VH = 1.3, VR = 0.27, P = [], tot = 0, toBlood = 0, toLymph = 0, hist = [], T = 0, acc = 0;
    function reset(){ P = []; tot = 0; toBlood = 0; toLymph = 0; hist = []; T = 0; acc = 0; }
    function rnd(){ return Math.random() * 2 - 1; }
    function pick(){ if (nut.value !== "mix") return nut.value; return ["glu", "aa", "lip"][Math.floor(Math.random() * 3)]; }
    function step(dt){
      T += dt; acc += dt * (conc.value / 100) * 14;
      while (acc >= 1){ acc -= 1; if (P.filter(function(p){ return p.s === 0; }).length < 70) P.push({s:0, t:pick(), x:rnd() * 1.6, y:2.1 + Math.random() * 0.2, z:rnd() * 1.6, vx:rnd(), vz:rnd(), vy:-0.35 - Math.random() * 0.3, u:0}); }
      P.forEach(function(p){
        if (p.s === 0){
          p.vx = 0.95 * p.vx + 0.3 * rnd(); p.vz = 0.95 * p.vz + 0.3 * rnd();
          p.x += p.vx * dt * 0.8; p.z += p.vz * dt * 0.8; p.y += p.vy * dt;
          p.x = Math.max(-1.6, Math.min(1.6, p.x)); p.z = Math.max(-1.6, Math.min(1.6, p.z));
          if (vil.value){
            for (var i = 0; i < 3; i++) for (var j = 0; j < 3; j++){
              var d = Math.hypot(p.x - VX[i], p.z - VX[j]);
              if (p.y < VH + 0.1 && p.y > 0.1 && d < VR + 0.12){ p.s = 1; p.vi = VX[i]; p.vj = VX[j]; p.u = 0; p.ang = Math.atan2(p.z - VX[j], p.x - VX[i]); p.ytop = Math.min(VH, p.y); }
            }
            if (p.y < 0.05){ p.y = 0.05; p.vy = Math.abs(p.vy) * 0.6; }
          } else {
            if (p.y < 0.05){ if (Math.random() < 0.12){ p.s = 2; p.u = 0; p.vi = p.x; p.vj = p.z; p.y = 0; } else { p.y = 0.05; p.vy = 0.5; } }
          }
          if (p.y > 2.4) p.dead = true;
        } else if (p.s === 1){
          /* à l'intérieur de la villosité : vers le bas, dans le capillaire ou le chylifère */
          p.u += dt * 0.9; var f = Math.min(1, p.u);
          var inner = p.t === "lip" ? 0 : 0.14;
          p.x = p.vi + inner * Math.cos(p.ang * (1 - f)); p.z = p.vj + inner * Math.sin(p.ang * (1 - f));
          p.y = p.ytop * (1 - f); if (f >= 1){ p.s = 2; p.u = 0; }
        } else if (p.s === 2){
          p.u += dt * 0.5; var g = Math.min(1, p.u), tx = p.t === "lip" ? 1.9 : -1.9;
          if (g === 1 && !p.counted){ p.counted = true; tot++; if (p.t === "lip") toLymph++; else toBlood++; hist.push(T); }
          p.x = p.vi + (tx - p.vi) * g; p.y = -0.22 * Math.sin(Math.PI * Math.min(1, g * 1.0)) - 0.02; p.z = p.vj + ((p.t === "lip" ? 1.0 : -1.0) * 1.8 - p.vj) * (g > 0.7 ? (g - 0.7) / 0.3 : 0) * 0.0 + (p.vj) * (1 - g);
          if (g >= 1){ p.s = 3; p.u = 0; }
        } else if (p.s === 3){
          p.u += dt * 0.7; p.z += (p.t === "lip" ? 1 : -1) * dt * 1.2 * 1.0; p.x = p.t === "lip" ? 1.9 : -1.9; p.y = -0.06; if (p.u > 1.6) p.dead = true;
        }
      });
      P = P.filter(function(p){ return !p.dead; });
      hist = hist.filter(function(h){ return h > T - 10; });
    }
    B.drag(c, cam, function(){ render(); });
    function render(){
      B.background(c);
      var sc = B.scene(c, cam, Math.min(c.W / 4.3, c.H / 4.4), 4);
      var FL = B.hex("#f0c6b4");
      /* sol : muqueuse */
      for (var a = -2; a < 2; a++) for (var b = -2; b < 2; b++) sc.poly([[a * 0.85 - 0.0, 0, b * 0.85], [a * 0.85 + 0.85, 0, b * 0.85], [a * 0.85 + 0.85, 0, b * 0.85 + 0.85], [a * 0.85, 0, b * 0.85 + 0.85]], FL, [0, 1, 0], 1, "rgba(160,80,60,.25)", true);
      /* vaisseaux collecteurs sous la paroi */
      sc.tube([-1.9, -0.12, -1.9], [-1.9, -0.12, 1.9], 0.07, B.hex("#dc2626")); sc.tube([1.9, -0.12, -1.9], [1.9, -0.12, 1.9], 0.07, B.hex("#f5e6a8"));
      sc.label([-1.9, -0.4, 1.9], "vers le foie", "#b91c1c", 10, 0, 0); sc.label([1.9, -0.4, 1.9], "vers la lymphe", "#a16207", 10, 0, 0);
      if (vil.value) for (var i = 0; i < 3; i++) for (var j = 0; j < 3; j++){
        var x = VX[i], z = VX[j];
        sc.tube([x, 0, z], [x, VH, z], VR, B.hex("#e9a8a0"), 0.55); sc.sphere([x, VH, z], VR, B.hex("#e9a8a0"), 0.55);
        sc.tube([x + 0.14, 0, z], [x + 0.14, VH - 0.05, z], 0.05, B.hex("#dc2626")); sc.tube([x - 0.14, 0, z], [x - 0.14, VH - 0.05, z], 0.05, B.hex("#b91c1c"));
        sc.tube([x, 0, z], [x, VH - 0.1, z], 0.06, B.hex("#fde68a"), 0.9);
      }
      P.forEach(function(p){ sc.sphere([p.x, p.y, p.z], p.t === "lip" ? 0.11 : 0.075, TY[p.t].c, 1, p.t === "lip" ? "#a16207" : null); });
      sc.label([0, 2.4, 0], "lumière de l'intestin", "#0f1b2d", 10, 0, 0);
      if (vil.value) sc.label([VX[2], VH + 0.45, VX[0]], "villosité", "#0f1b2d", 10, 0, 0);
      sc.flush(); B.hint(c);
      var ctx = c.ctx; ctx.save(); ctx.font = "700 11px Mulish,system-ui,sans-serif"; ctx.textBaseline = "middle";
      [["glucose", "#f59e0b"], ["acide aminé", "#7c3aed"], ["lipide", "#facc15"]].forEach(function(q, n){ ctx.fillStyle = q[1]; ctx.beginPath(); ctx.arc(14, 16 + n * 17, 5, 0, 6.3); ctx.fill(); ctx.fillStyle = "#0f1b2d"; ctx.fillText(q[0], 24, 16 + n * 17); });
      ctx.fillStyle = "#dc2626"; ctx.fillRect(10, 68, 9, 4); ctx.fillStyle = "#0f1b2d"; ctx.fillText("capillaire sanguin", 24, 70);
      ctx.fillStyle = "#e8c95a"; ctx.fillRect(10, 85, 9, 4); ctx.fillStyle = "#0f1b2d"; ctx.fillText("chylifère (lymphe)", 24, 87); ctx.restore();
      ro.set(0, tot); ro.set(1, toBlood); ro.set(2, toLymph); ro.set(3, hist.length);
      var msg, kind = "";
      if (!vil.value){ msg = "Paroi lisse : seule la surface plane absorbe. Le débit d'absorption s'effondre : sans villosités, un grêle de 7 m n'absorberait presque rien."; kind = "warn"; }
      else if (nut.value === "glu") msg = "Le glucose traverse l'épithélium et entre dans un capillaire sanguin : direction la veine porte, puis le foie.";
      else if (nut.value === "aa") msg = "Les acides aminés suivent la même route que le glucose : capillaire sanguin, veine porte, foie.";
      else if (nut.value === "lip") msg = "Les lipides (petites gouttelettes) entrent dans le chylifère, vaisseau lymphatique au centre de la villosité : ils rejoignent le sang sans passer d'abord par le foie.";
      else msg = "Deux routes : glucose et acides aminés vont dans les capillaires (côté gauche, vers le foie), les lipides dans le chylifère (côté droit, lymphe).";
      nt.set(msg, kind);
    }
    k.draw(render);
    for (var w0 = 0; w0 < 160; w0++) step(0.05);
    var L = k.loop(function(dt){ B.spin(cam, dt, 0.25); step(dt); render(); });
    L.play();
  }
});
/*B3D-ADD-END:b3-3d-villosite*/
