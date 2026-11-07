(function(){
var D = SFA.draw, P = D.palette, T = D.text, F = SFA.fmt;
function rect(c,x,y,w,h,fill,stroke,lw,r){ var g=c.ctx; g.save(); g.beginPath(); if(g.roundRect&&r) g.roundRect(x,y,w,h,r); else g.rect(x,y,w,h); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1.5;g.stroke();} g.restore(); }
function circ(c,x,y,r,fill,stroke,lw){ var g=c.ctx; g.beginPath(); g.arc(x,y,r,0,6.2832); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||2;g.stroke();} }
function clamp(v,a,b){ return Math.max(a,Math.min(b,v)); }
function mix(c1,c2,t){ t=clamp(t,0,1); return "rgb("+Math.round(c1[0]+(c2[0]-c1[0])*t)+","+Math.round(c1[1]+(c2[1]-c1[1])*t)+","+Math.round(c1[2]+(c2[2]-c1[2])*t)+")"; }
function poly(c,pts,fill,stroke,lw){ var g=c.ctx; g.beginPath(); g.moveTo(pts[0][0],pts[0][1]); for(var i=1;i<pts.length;i++) g.lineTo(pts[i][0],pts[i][1]); g.closePath(); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1.5;g.stroke();} }
function rng(seed){ var s=seed>>>0; return function(){ s=(s+0x6D2B79F5)>>>0; var t=s; t=Math.imul(t^(t>>>15),t|1); t^=t+Math.imul(t^(t>>>7),t|61); return ((t^(t>>>14))>>>0)/4294967296; }; }
function actY(t){ return t<=35 ? Math.pow(2,(t-35)/10) : Math.max(0,1-Math.pow((t-35)/20,2)); }

/* ===== 1 · Cycle du carbone ===== */
SFA.sim({
  id:"b3-c09-cycle-carbone", ch:"c09", tag:"Modèle chiffré · tombe souvent",
  titre:"Le cycle du carbone : émissions, forêts et CO₂ de l'air",
  resume:"Combustion, déforestation, reforestation : comment évolue la quantité de CO₂ dans l'atmosphère d'ici 2125 ?",
  but:"Règle les émissions fossiles, la déforestation et la reforestation. Lis la teneur en CO₂ de l'air à l'année choisie et au bout de 100 ans.",
  aRetenir:"Le carbone circule entre l'atmosphère (CO₂), les êtres vivants (photosynthèse le fixe, respiration et décomposition le libèrent), le sol, l'océan et les roches. La combustion de pétrole, charbon et gaz libère du carbone stocké depuis des millions d'années. Les océans et les végétaux en absorbent environ la moitié ; le reste s'accumule dans l'air.",
  piege:"Les « puits » (forêts, océans) ne sont pas illimités : ici le modèle est linéaire et très simplifié, il ne prévoit pas leur saturation. Et stabiliser le CO₂ dans l'air demande de ramener les émissions au niveau de ce que les puits peuvent absorber, pas seulement de les « réduire un peu ». (Valeurs de départ proches de 2025 : 425 ppm ; 1 ppm ≈ 2,1 GtC.)",
  build:function(k,S){
    var c1 = k.canvas(170), c2 = k.canvas(230);
    var ef = k.slider("Émissions de combustibles fossiles", 0, 15, .5, 10, "GtC/an");
    var df = k.slider("Déforestation (carbone libéré)", 0, 3, .25, 1, "GtC/an");
    var rf = k.slider("Reforestation (carbone absorbé en plus)", 0, 3, .25, 0, "GtC/an");
    var an = k.slider("Année lue", 2025, 2125, 5, 2025, "");
    var ro = k.readouts(["CO₂ dans l'air l'année lue","CO₂ en 2100","Puits naturels l'année lue","Équilibre à long terme"]);
    var nt = k.note("","");
    var K = .0185, PPM = 2.12, C0 = 280;
    function run(){
      var C = 425, out = [C], e = ef.value+df.value-rf.value;
      for (var y=0;y<100;y++){ for (var s=0;s<10;s++){ var sink = K*Math.max(0,C-C0); C += .1*(e/PPM - sink); C = Math.max(C0,C); } out.push(C); }
      return out;
    }
    k.draw(function(){
      var o = run(), yr = an.value-2025, Cy = o[yr], e = ef.value+df.value-rf.value, sink = K*Math.max(0,Cy-C0)*PPM, eq = Math.max(C0, C0 + e/(PPM*K));
      c2.clear(); var ymax = Math.max(500,Math.ceil(Math.max.apply(null,o)/50)*50+25), ax = D.axes(c2,{x0:2025,x1:2125,y0:250,y1:ymax,xl:"année",yl:"CO₂ (ppm)",stepX:25,stepY:50,l:52});
      c2.ctx.save(); c2.ctx.setLineDash([5,4]); c2.ctx.strokeStyle = P.grey; c2.ctx.beginPath(); c2.ctx.moveTo(ax.L,ax.Y(280)); c2.ctx.lineTo(ax.R,ax.Y(280)); c2.ctx.stroke(); c2.ctx.restore();
      T(c2,"avant l'ère industrielle : 280 ppm",ax.R-4,ax.Y(280)-9,{size:12,align:"right",color:P.grey});
      D.fn(c2,ax,function(x){ var j = Math.min(100,Math.max(0,x-2025)), i = Math.floor(j), f = j-i; return o[i]+(o[Math.min(100,i+1)]-o[i])*f; },P.red,3.2);
      D.dot(c2,ax.X(an.value),ax.Y(Cy),6,P.violet);
      /* schéma des flux */
      c1.clear(); var W = c1.W;
      rect(c1,W*.30,12,W*.40,46,"#e6edfa",P.acc,2,8); T(c1,"Atmosphère",W*.5,28,{size:13}); T(c1,S.fmt(Cy*PPM,0)+" GtC ("+S.fmt(Cy,0)+" ppm)",W*.5,46,{size:12,color:P.grey});
      rect(c1,8,100,W*.34,44,"#dff1e5",P.green,2,8); T(c1,"Végétation, sols",8+W*.17,116,{size:12}); T(c1,"photosynthèse",8+W*.17,134,{size:12,color:P.grey});
      rect(c1,W-8-W*.30,100,W*.30,44,"#d9ecf7",P.teal,2,8); T(c1,"Océans",W-8-W*.15,122,{size:13});
      D.arrow(c1,W*.34,60,8+W*.17,98,P.green,2.5); D.arrow(c1,W*.66,60,W-8-W*.15,98,P.teal,2.5);
      T(c1,"puits : "+S.fmt(sink,1)+" GtC/an",W*.5,86,{size:12,color:P.green});
      D.arrow(c1,W*.5,160,W*.5,62,P.red,2.5); T(c1,"émissions nettes : "+S.fmt(e,1)+" GtC/an",W*.5,166,{size:12,color:P.red});
      ro.set(0,S.fmt(Cy,0)+" ppm"); ro.set(1,S.fmt(o[75],0)+" ppm"); ro.set(2,S.fmt(sink,1)+" GtC/an"); ro.set(3,S.fmt(eq,0)+" ppm");
      var sink25 = K*(425-C0)*PPM;
      nt.set(e<=0 ? "Les puits absorbent plus que ce qui est émis : le CO₂ diminue vers son niveau d'avant l'ère industrielle (limite du modèle : 280 ppm)." : o[100]>o[0]+5 ? "Les émissions ("+S.fmt(e,1)+" GtC/an) dépassent ce que les puits absorbent : le CO₂ de l'air continue d'augmenter. Pour le stabiliser à "+S.fmt(425,0)+" ppm, les émissions nettes devraient tomber vers "+S.fmt(sink25,1)+" GtC/an." : o[100]<o[0]-5 ? "Les puits dépassent les émissions : le CO₂ diminue lentement." : "Émissions et puits s'équilibrent : le CO₂ reste à peu près stable.","ok");
    });
  }
});

/* ===== 2 · Lynx et lièvre ===== */
SFA.sim({
  id:"b3-c09-lynx-lievre", ch:"c09", tag:"Modèle chiffré · classique",
  titre:"Proies et prédateurs : lièvres et lynx",
  resume:"Deux populations qui s'influencent : les courbes oscillent, décalées. Change les paramètres et vois ce qui se passe.",
  but:"Règle la reproduction des proies, l'efficacité de la chasse et la mortalité des prédateurs. Observe les oscillations et le portrait de phase.",
  aRetenir:"Plus il y a de proies, plus les prédateurs prospèrent ; plus il y a de prédateurs, plus les proies diminuent, puis les prédateurs manquent de nourriture… : les deux populations oscillent, le maximum des prédateurs suivant celui des proies. Un écosystème est en équilibre dynamique, pas figé.",
  piege:"Le prédateur ne « détruit » pas sa proie : il la régule. Si la nourriture des proies est limitée, les oscillations s'amortissent vers un équilibre. Mais si cette limite est trop basse, les prédateurs disparaissent. (Modèle de Lotka-Volterra, simplifié ; nombres en unités arbitraires.)",
  build:function(k,S){
    var c1 = k.canvas(220), c2 = k.canvas(190);
    var r = k.slider("Reproduction des lièvres", .2, 1.2, .05, .55, "/an");
    var a = k.slider("Efficacité de la chasse", .01, .04, .0025, .02, "");
    var m = k.slider("Mortalité des lynx", .2, 1.2, .05, .8, "/an");
    var lim = k.toggle("Nourriture limitée pour les lièvres (plafond : 100)", false);
    var ro = k.readouts(["Équilibre : lièvres","Équilibre : lynx","Période des cycles","Issue"]);
    var nt = k.note("","");
    function run(){
      var H = 30, L = 15, dt = .02, out = [], Kc = 100, i, s;
      function d(h,l){ return [r.value*h*(lim.value ? 1-h/Kc : 1) - a.value*h*l, a.value*h*l - m.value*l]; }
      for (i=0;i<=3000;i++){
        if (i%10===0) out.push([i*dt,H,L]);
        var k1 = d(H,L), k2 = d(H+dt/2*k1[0],L+dt/2*k1[1]), k3 = d(H+dt/2*k2[0],L+dt/2*k2[1]), k4 = d(H+dt*k3[0],L+dt*k3[1]);
        H = Math.max(1e-3,H+dt*(k1[0]+2*k2[0]+2*k3[0]+k4[0])/6); L = Math.max(1e-3,L+dt*(k1[1]+2*k2[1]+2*k3[1]+k4[1])/6);
      }
      return out;
    }
    k.draw(function(){
      var o = run(), Hs = m.value/a.value, Ls = lim.value ? r.value*(1-Hs/100)/a.value : r.value/a.value, mx = 0, i;
      if (lim.value && Hs >= 100){ Hs = 100; Ls = 0; }
      o.forEach(function(q){ mx = Math.max(mx,q[1],q[2]); }); mx = Math.max(60,Math.ceil(mx/20)*20);
      c1.clear(); var ax = D.axes(c1,{x0:0,x1:60,y0:0,y1:mx,xl:"temps (années)",yl:"effectif",stepX:10,l:46});
      D.fn(c1,ax,function(x){ return o[Math.min(o.length-1,Math.round(x/.2))][1]; },P.amber,3);
      D.fn(c1,ax,function(x){ return o[Math.min(o.length-1,Math.round(x/.2))][2]; },P.violet,3);
      T(c1,"lièvres",ax.X(22),ax.T+8,{size:12,align:"left",color:P.amber}); T(c1,"lynx",ax.X(36),ax.T+8,{size:12,align:"left",color:P.violet});
      c2.clear(); var bx = D.axes(c2,{x0:0,x1:mx,y0:0,y1:mx,xl:"lièvres",yl:"lynx",l:46,stepX:Math.max(20,mx/5),stepY:Math.max(20,mx/5)});
      var g = c2.ctx; g.save(); g.strokeStyle = P.teal; g.lineWidth = 2; g.beginPath(); o.forEach(function(q,j){ if (j) g.lineTo(bx.X(q[1]),bx.Y(q[2])); else g.moveTo(bx.X(q[1]),bx.Y(q[2])); }); g.stroke(); g.restore();
      D.dot(c2,bx.X(Math.min(mx,Hs)),bx.Y(Math.min(mx,Ls)),5,P.red);
      /* période : écart entre deux maxima de lièvres */
      var pk = []; for (i=2;i<o.length-1;i++) if (o[i][1]>o[i-1][1] && o[i][1]>=o[i+1][1] && o[i][1]>Hs*1.05) pk.push(o[i][0]);
      var per = pk.length>=2 ? pk[1]-pk[0] : null, last = o[o.length-1], gone = last[2]<.5 || (lim.value && m.value/a.value>=100);
      ro.set(0,S.fmt(Hs,0)); ro.set(1,S.fmt(Ls,0)); ro.set(2, per ? S.fmt(per,1)+" ans" : "—");
      var amort = pk.length>=2 && (o[o.length-1][1]-Hs)<Hs*.05;
      ro.set(3, gone ? "lynx disparus" : lim.value && (Math.abs(last[1]-Hs)<Hs*.05) ? "équilibre stable" : "oscillations");
      nt.set(gone ? "La nourriture des lièvres est trop limitée pour faire vivre des lynx : les prédateurs disparaissent." : lim.value ? "Avec une nourriture limitée, les oscillations s'amortissent et les deux populations tendent vers un équilibre (point rouge)." : "Sans limite de nourriture, les cycles se répètent indéfiniment autour de l'équilibre (point rouge). Le maximum des lynx suit celui des lièvres.","ok");
    });
  }
});

/* ===== 3 · Mini-écosystème en bocal ===== */
SFA.sim({
  id:"b3-c09-bocal", ch:"c09", tag:"Défi",
  titre:"Un écosystème en bocal : équilibre ou effondrement ?",
  resume:"Plantes, animaux, lumière : peut-on fermer un bocal et le laisser vivre un mois ?",
  but:"Règle la masse de plantes, le nombre d'escargots et l'éclairage, puis fais défiler les jours (ou lance le film). Défi : garde tous les animaux en vie pendant 30 jours.",
  aRetenir:"Un bocal fermé échange de l'énergie (lumière) mais pas de matière : pour durer, la photosynthèse des plantes doit produire autant de O₂ que la respiration de tous les êtres vivants en consomme. Trop d'animaux, trop peu de plantes ou trop peu de lumière : le dioxygène s'épuise et les animaux meurent.",
  piege:"Les plantes respirent aussi, jour et nuit. Et l'équilibre n'est pas figé : un léger déséquilibre s'accumule jour après jour. (Modèle très simplifié : CO₂ supposé non limitant, nourriture non modélisée, plantes toujours vivantes.)",
  build:function(k,S){
    var cj = k.canvas(0,{ratio:.74}), c1 = k.canvas(190), c2 = k.canvas(110);
    var pl = k.slider("Plantes (masse)", 5, 60, 1, 24, "g");
    var an = k.slider("Animaux (escargots)", 0, 20, 1, 5, "");
    var li = k.slider("Intensité lumineuse", 10, 100, 5, 70, "%");
    var ph = k.slider("Heures d'éclairage par jour", 0, 24, 1, 12, "h");
    var dy = k.slider("Jour affiché", 0, 30, 1, 0, "j");
    var ro = k.readouts(["O₂ produit par jour (brut)","O₂ consommé par jour","Bilan par jour","Issue après 30 jours"]);
    var nt = k.note("","");
    var bub=[], seed=9, play=false;
    function rnd(){ seed=(seed*16807)%2147483647; return seed/2147483647; }
    k.button("Lancer le film (30 jours)", function(){ if (dy.value>=30) dy.set(0); play=!play; lp.play(); }, true);
    var lp = k.loop(function(dt){ if (play){ var nd=dy.value+dt*2.2; if (nd>=30){ nd=30; play=false; } dy.set(nd); }
      var on = (li.value>0 && ph.value>0); if (on && rnd()<dt*pl.value*.25) bub.push({x:.28+rnd()*.44,y:.58,a:0});
      bub.forEach(function(b){ b.a+=dt; b.y-=dt*.12; b.x+=Math.sin(b.a*4+b.x*10)*.0007; }); bub=bub.filter(function(b){ return b.y>.2 && b.a<5; }); k.redraw(); }); lp.play();
    var VG = 2000, TOT = .2094*VG;
    function f(l){ return 1.3*l/(l+30); }
    function run(){
      var o2 = TOT, n = an.value, out = [], gross = pl.value*.9*f(li.value), resp = pl.value*.1, i;
      for (i=0;i<=720;i++){
        var hrs = i%24, on = hrs < ph.value, dO = (on ? gross : 0) - resp - n*1.5;
        if (i%24===0) out.push([i/24,o2/VG*100,n]);
        o2 = Math.max(0,Math.min(.35*VG,o2 + dO)); if (o2/VG*100 < 12) n = Math.max(0,n*(1-.03)); 
      }
      return out;
    }
    function scene(o2d,nd){
      var g=cj.ctx, W=cj.W, H=cj.H, tt=Date.now()/1000; cj.clear();
      var bgc=g.createLinearGradient(0,0,0,H); bgc.addColorStop(0,"#eef3f8"); bgc.addColorStop(1,"#dfe8f0"); g.fillStyle=bgc; g.fillRect(0,0,W,H);
      g.fillStyle="#b9a182"; g.fillRect(0,H*.92,W,H*.08);
      var jx=W*.24, jw=W*.52, jy=H*.2, jh=H*.7, k1=Math.max(0,Math.min(1,(o2d-8)/13));
      /* lampe */
      var Lv=li.value/100*(ph.value>0?1:0); g.fillStyle="#6b7686"; g.fillRect(W*.43,H*.02,W*.14,6); g.fillStyle="#6b7686"; g.beginPath(); g.moveTo(W*.4,H*.02+6); g.lineTo(W*.6,H*.02+6); g.lineTo(W*.56,H*.1); g.lineTo(W*.44,H*.1); g.closePath(); g.fill();
      if (Lv>0){ var bm=g.createLinearGradient(0,H*.1,0,H*.7); bm.addColorStop(0,"rgba(255,235,140,"+(.55*Lv)+")"); bm.addColorStop(1,"rgba(255,235,140,0)"); g.fillStyle=bm; g.beginPath(); g.moveTo(W*.44,H*.1); g.lineTo(W*.56,H*.1); g.lineTo(jx+jw,H*.8); g.lineTo(jx,H*.8); g.closePath(); g.fill(); }
      D.glow(cj,W*.5,H*.1,40,"#f4c542",.15+.55*Lv);
      D.label(cj,Lv>0?"lumière "+li.value+" % · "+ph.value+" h/jour":"lampe éteinte",W*.5,H*.015+0,{size:10.5,color:P.ink,base:"top"});
      /* air du bocal */
      g.save(); D.rrect(cj,jx,jy,jw,jh,18); g.clip(); g.fillStyle="rgba(190,225,245,"+(.3+.2*k1)+")"; g.fillRect(jx,jy,jw,jh); if (k1<.55){ g.fillStyle="rgba(110,95,70,"+(.45*(1-k1/.55))+")"; g.fillRect(jx,jy,jw,jh); }
      g.fillStyle="#8a6a45"; g.fillRect(jx,jy+jh*.82,jw,jh*.18); g.fillStyle="#6f5434"; for (var i=0;i<14;i++){ g.beginPath(); g.arc(jx+((i*.071+.05)%1)*jw,jy+jh*(.86+(i%3)*.05),2.5,0,6.3); g.fill(); }
      /* plantes */
      var np=Math.max(1,Math.round(pl.value/8));
      for (i=0;i<np;i++){ var px=jx+jw*(.12+.76*(i+.5)/np), ph2=jh*(.28+.3*((i*37)%5)/5); g.strokeStyle="#3f8f4a"; g.lineWidth=3; g.beginPath(); g.moveTo(px,jy+jh*.82); g.quadraticCurveTo(px+Math.sin(tt+i)*3,jy+jh*.82-ph2*.6,px,jy+jh*.82-ph2); g.stroke();
        for (var q=0;q<4;q++){ var yy=jy+jh*.82-ph2*(q+1)/4.6, sd=q%2?1:-1; g.fillStyle=q%2?"#4ea65b":"#3a8f4f"; g.beginPath(); g.ellipse(px+sd*11,yy,12,5,sd*-.5,0,6.3); g.fill(); } }
      /* escargots */
      for (i=0;i<an.value;i++){ var alive=i<nd, sx=jx+jw*.1+((i*0.137+.05)%.8)*jw+(alive?Math.sin(tt*.4+i)*6:0), sy=jy+jh*.82+4; g.globalAlpha=alive?1:.35;
        g.fillStyle=alive?"#d9b383":"#999"; g.beginPath(); g.ellipse(sx,sy,9,3.2,0,0,6.3); g.fill(); g.fillStyle=alive?"#b9783d":"#888"; g.beginPath(); g.arc(sx-2,sy-5,6,0,6.3); g.fill(); g.strokeStyle="#6b3f17"; g.lineWidth=1; g.beginPath(); g.arc(sx-2,sy-5,3.2,0,5); g.stroke(); g.globalAlpha=1; }
      bub.forEach(function(b){ g.globalAlpha=.8; g.beginPath(); g.arc(jx+(b.x-.24)/.52*jw*.0+b.x*W*1-jx*0,jy+(b.y-.2)/.7*jh*0+b.y*H,2.6,0,6.3); g.strokeStyle=P.acc; g.lineWidth=1.3; g.stroke(); g.globalAlpha=1; });
      g.restore();
      D.rrect(cj,jx,jy,jw,jh,18); g.strokeStyle="#7fa3bd"; g.lineWidth=3; g.stroke(); g.fillStyle="#8b5a2b"; D.rrect(cj,jx+jw*.2,jy-12,jw*.6,16,5); g.fill();
      /* jauge O2 */
      var gx=W-34, gt=H*.2, gh=H*.62; D.rrect(cj,gx,gt,14,gh,7); g.fillStyle="#fff"; g.fill(); g.strokeStyle="#aab4c1"; g.lineWidth=1.5; g.stroke();
      var fh=gh*Math.min(1,o2d/30); g.save(); D.rrect(cj,gx,gt,14,gh,7); g.clip(); g.fillStyle=o2d<12?P.red:P.acc; g.fillRect(gx,gt+gh-fh,14,fh); g.restore();
      g.strokeStyle=P.red; g.lineWidth=2; g.beginPath(); g.moveTo(gx-6,gt+gh*(1-12/30)); g.lineTo(gx+20,gt+gh*(1-12/30)); g.stroke();
      D.text(cj,"O₂",gx+7,gt-10,{size:11,color:P.ink}); D.text(cj,S.fmt(o2d,1)+" %",gx+7,gt+gh+12,{size:11,color:o2d<12?P.red:P.ink}); D.text(cj,"12 %",gx-12,gt+gh*(1-12/30),{size:10.5,color:P.red,align:"right"});
      D.label(cj,"jour "+Math.round(dy.value)+" · "+nd+" / "+an.value+" escargots vivants",10,H-12,{size:11.5,color:nd<an.value?P.red:P.green,align:"left"});
    }
    k.draw(function(){
      var o = run(), g1 = pl.value*.9*f(li.value)*ph.value, rp = pl.value*.1*24, ra = an.value*1.5*24, last = o[o.length-1];
      var di = Math.max(0,Math.min(29,Math.floor(dy.value))), o2d = o[di][1]+(o[Math.min(30,di+1)][1]-o[di][1])*(dy.value-di), nd = Math.round(o[Math.min(30,Math.round(dy.value))][2]);
      scene(o2d,nd);
      c1.clear(); var ax = D.axes(c1,{x0:0,x1:30,y0:0,y1:35,xl:"jour",yl:"O₂ dans l'air (%)",stepX:5,stepY:10,l:50});
      c1.ctx.fillStyle = "rgba(180,35,24,.09)"; c1.ctx.fillRect(ax.L,ax.Y(12),ax.R-ax.L,ax.Y(0)-ax.Y(12)); T(c1,"zone mortelle (< 12 %)",ax.R-4,ax.Y(6),{size:12,align:"right",color:P.red});
      D.fn(c1,ax,function(x){ var j = Math.min(29,Math.floor(x)), f = x-j; return o[j][1]+(o[j+1][1]-o[j][1])*f; },P.acc,3);
      c2.clear(); var bx = D.axes(c2,{x0:0,x1:30,y0:0,y1:Math.max(5,an.value+1),xl:"jour",yl:"animaux",stepX:5,l:50});
      D.fn(c2,bx,function(x){ var j = Math.min(29,Math.floor(x)), f = x-j; return o[j][2]+(o[j+1][2]-o[j][2])*f; },P.violet,3);
      var net = g1-rp-ra;
      ro.set(0,S.fmt(g1,0)+" mL"); ro.set(1,S.fmt(rp+ra,0)+" mL"); ro.set(2,(net>=0?"+":"")+S.fmt(net,0)+" mL"); ro.set(3, last[2]<an.value*.5 ? "effondrement ("+S.fmt(last[2],0)+" animaux)" : last[2]<an.value ? "pertes ("+S.fmt(last[2],0)+" animaux)" : "équilibre");
      nt.set(an.value===0 ? "Sans animaux, les plantes seules produisent un excédent de O₂ : rien ne le consomme." : last[2]<an.value ? "Effondrement : le O₂ passe sous 12 % et des animaux meurent. Ajoute des plantes, de la lumière ou retire des animaux." : net<-20 ? "Bilan négatif : le O₂ baisse chaque jour, l'effondrement n'est qu'une question de temps." : "L'équilibre tient 30 jours : la photosynthèse compense la respiration de tous.", last[2]<an.value ? "warn" : "ok");
    });
  }
});

/* ===== 4 · Croissance d'une population de levures ===== */
SFA.sim({
  id:"b3-c09-croissance-levures", ch:"c09", tag:"Modèle chiffré",
  titre:"Croissance d'une population de levures : sucre limité",
  resume:"Une population qui explose, puis plafonne quand le sucre manque. Où est la limite ?",
  but:"Règle le sucre de départ, la température et la population initiale. Lis la capacité maximale et passe en échelle logarithmique pour voir la phase exponentielle.",
  aRetenir:"Une population croît d'abord de façon exponentielle (chaque individu en produit d'autres), puis ralentit quand les ressources se raréfient et atteint un plateau : la capacité du milieu. Cette capacité dépend des ressources (ici le sucre) ; la vitesse dépend de la température.",
  piege:"Le plateau n'est pas « la fin de la reproduction » : naissances et morts s'équilibrent. Après épuisement du sucre, la population finit par diminuer. En échelle linéaire, la phase exponentielle ressemble à un coude ; en échelle logarithmique, c'est une droite. (Modèle simplifié, unités : millions de cellules/mL.)",
  build:function(k,S){
    var c1 = k.canvas(240), c2 = k.canvas(150);
    var s0 = k.slider("Sucre au départ", 1, 20, 1, 10, "g/L");
    var tp = k.slider("Température", 10, 45, 1, 30, "°C");
    var n0 = k.slider("Population de départ", .1, 2, .1, .2, "million/mL");
    var lg = k.toggle("Échelle logarithmique (population)", false);
    var ro = k.readouts(["Capacité maximale","90 % de la capacité atteints vers","Temps pour doubler (début)"]);
    var nt = k.note("","");
    var Y = 2, KS = .5, DR = .02;
    function run(){
      var N = n0.value, Sg = s0.value, mu0 = .55*actY(tp.value), dt = .05, out = [], i, pk = 0;
      for (i=0;i<=1920;i++){
        if (i%4===0) out.push([i*dt,N,Sg]);
        var mu = mu0*Sg/(KS+Sg), dN = (mu-DR)*N, dS = -mu*N/Y;
        N = Math.max(1e-6,N+dt*dN); Sg = Math.max(0,Sg+dt*dS);
      }
      return {out:out, mu0:mu0};
    }
    k.draw(function(){
      var r = run(), o = r.out, Kc = n0.value + Y*s0.value, mx = Kc*1.08; o.forEach(function(q){ mx = Math.max(mx,q[1]); });
      c1.clear(); var ax;
      if (lg.value){ ax = D.axes(c1,{x0:0,x1:48,y0:-1,y1:Math.max(1.5,Math.ceil(Math.log10(mx)*2+1)/2),xl:"temps (h)",yl:"log₁₀(N)",stepX:8,stepY:.5,l:50}); D.fn(c1,ax,function(x){ return Math.log10(o[Math.min(o.length-1,Math.round(x*5))][1]); },P.green,3); }
      else { ax = D.axes(c1,{x0:0,x1:48,y0:0,y1:Math.max(5,Math.ceil(mx/5)*5),xl:"temps (h)",yl:"population (million/mL)",stepX:8,l:50}); D.fn(c1,ax,function(x){ return o[Math.min(o.length-1,Math.round(x*5))][1]; },P.green,3);
        c1.ctx.save(); c1.ctx.setLineDash([5,4]); c1.ctx.strokeStyle = P.grey; c1.ctx.beginPath(); c1.ctx.moveTo(ax.L,ax.Y(Kc)); c1.ctx.lineTo(ax.R,ax.Y(Kc)); c1.ctx.stroke(); c1.ctx.restore(); T(c1,"capacité du milieu",ax.R-4,ax.Y(Kc)-9,{size:12,align:"right",color:P.grey}); }
      c2.clear(); var bx = D.axes(c2,{x0:0,x1:48,y0:0,y1:Math.max(2,s0.value),xl:"temps (h)",yl:"sucre (g/L)",stepX:8,l:50});
      D.fn(c2,bx,function(x){ return o[Math.min(o.length-1,Math.round(x*5))][2]; },P.amber,3);
      var t95 = null; for (var i=0;i<o.length;i++) if (o[i][0]>48) break; else if (o[i][1]>=.9*Kc){ t95 = o[i][0]; break; }
      var mu0 = r.mu0, mue = mu0*s0.value/(KS+s0.value), td = mue>DR ? Math.LN2/(mue-DR) : null;
      ro.set(0,S.fmt(Kc,1)+" million/mL"); ro.set(1, t95===null ? "pas dans les 48 h" : S.fmt(t95,0)+" h"); ro.set(2, td && td<100 ? S.fmt(td,1)+" h" : "pas de croissance");
      nt.set(mu0<=DR ? "Température trop basse ou trop haute : les levures ne se multiplient presque pas." : "Capacité = population de départ + rendement × sucre ≈ "+S.fmt(Kc,1)+" million/mL. Plus de sucre : plateau plus haut. Plus chaud (jusqu'à ≈ 35 °C) : plateau atteint plus vite, mais pas plus haut.","ok");
    });
  }
});
})();
