(function(){
var D = SFA.draw, P = D.palette, T = D.text, F = SFA.fmt;
function rect(c,x,y,w,h,fill,stroke,lw,r){ var g=c.ctx; g.save(); g.beginPath(); if(g.roundRect&&r) g.roundRect(x,y,w,h,r); else g.rect(x,y,w,h); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1.5;g.stroke();} g.restore(); }
function circ(c,x,y,r,fill,stroke,lw){ var g=c.ctx; g.beginPath(); g.arc(x,y,r,0,6.2832); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||2;g.stroke();} }
function clamp(v,a,b){ return Math.max(a,Math.min(b,v)); }
function mix(c1,c2,t){ t=clamp(t,0,1); return "rgb("+Math.round(c1[0]+(c2[0]-c1[0])*t)+","+Math.round(c1[1]+(c2[1]-c1[1])*t)+","+Math.round(c1[2]+(c2[2]-c1[2])*t)+")"; }
function poly(c,pts,fill,stroke,lw){ var g=c.ctx; g.beginPath(); g.moveTo(pts[0][0],pts[0][1]); for(var i=1;i<pts.length;i++) g.lineTo(pts[i][0],pts[i][1]); g.closePath(); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1.5;g.stroke();} }
function rng(seed){ var s=seed>>>0; return function(){ s=(s+0x6D2B79F5)>>>0; var t=s; t=Math.imul(t^(t>>>15),t|1); t^=t+Math.imul(t^(t>>>7),t|61); return ((t^(t>>>14))>>>0)/4294967296; }; }

/* ===== 1 · Thorax-modèle ===== */
SFA.sim({
  id:"b3-c05-thorax-modele", ch:"c05", tag:"Classique · tombe souvent",
  titre:"Le thorax-modèle : abaisse le diaphragme",
  resume:"Une cloche, un ballon, une membrane : pourquoi l'air entre quand le volume augmente ?",
  but:"Tire la membrane (diaphragme) vers le bas. Compare le modèle avec ballon, l'air enfermé sans ballon (loi de Boyle) et la cloche percée.",
  aRetenir:"Quand le diaphragme descend (et les côtes montent), le volume de la cage thoracique augmente : la pression qui y règne diminue, devient plus faible que la pression atmosphérique et l'air entre dans les poumons, qui se gonflent. À l'expiration, le volume diminue et l'air sort. Pour une quantité d'air fixée : pression × volume = constante (loi de Boyle).",
  piege:"Les poumons ne se gonflent pas « tout seuls » ni par des muscles à l'intérieur : ils suivent le volume du thorax. Si la cage thoracique est percée (pneumothorax), l'air entre dans l'espace autour du poumon et celui-ci ne suit plus le mouvement. (Modèle simplifié, ordres de grandeur.)",
  build:function(k,S){
    var c = k.canvas(340);
    var mode = k.seg("Modèle", [["b","Cloche + ballon"],["s","Air enfermé, sans ballon"],["p","Cloche percée"]], "b");
    var dv = k.slider("Volume gagné par la cloche (membrane tirée)", 0, .6, .05, 0, "L");
    var tt = 0, lp = k.loop(function(dt){ tt += dt; dv.set(Math.round(.3*(1-Math.cos(2*Math.PI*tt/4))/.05)*.05); k.redraw(); });
    k.button("▶ Respirer / pause", function(){ if (lp.running) lp.pause(); else lp.play(); }, true);
    var ro = k.readouts(["Pression dans la cloche","Pression atmosphérique","Volume du ballon"]);
    var nt = k.note("","");
    var P0 = 101.3, Vj0 = 1.0, E = .5;
    function solve(d){
      var lo = 0, hi = d, i;
      if (d <= 0) return 0;
      for (i=0;i<60;i++){ var x = (lo+hi)/2, f = P0*(1 - Vj0/(Vj0+d-x)) - E*x; if (f > 0) lo = x; else hi = x; }
      return (lo+hi)/2;
    }
    k.draw(function(){
      c.clear(); var g = c.ctx, d = dv.value, m = mode.value, x = 0, pj = P0;
      if (m==="b"){ x = solve(d); pj = P0 - E*x; }
      else if (m==="s"){ pj = P0*Vj0/(Vj0+d); }
      var cx = c.W/2, jw = Math.min(200,c.W-120), jt = 70, jb = 250, jl = cx-jw/2, jr = cx+jw/2;
      /* cloche */
      g.save(); g.strokeStyle = P.ink; g.lineWidth = 3; g.fillStyle = "rgba(190,215,240,.35)";
      g.beginPath(); g.moveTo(jl,jb); g.lineTo(jl,jt+30); g.quadraticCurveTo(jl,jt,cx-20,jt); g.lineTo(cx+20,jt); g.quadraticCurveTo(jr,jt,jr,jt+30); g.lineTo(jr,jb); g.fill(); g.stroke(); g.restore();
      /* tube en Y */
      D.line(c,cx,jt-34,cx,jt+36,P.ink,5);
      T(c,"air extérieur",cx,jt-46,{size:12,color:P.grey});
      /* ballon */
      if (m==="b"){ var r = 10 + 105*Math.sqrt(x/.6)*.55; r = Math.min(r,(jw/2)-8); ctxBalloon(c,cx,jt+36+r*.8,r,x); }
      else if (m==="p"){ D.line(c,jl,jt+90,jl-30,jt+90,P.red,4); T(c,"trou",jl-32,jt+76,{size:12,color:P.red,align:"right"}); ctxBalloon(c,cx,jt+36+11*.8,11,0); }
      /* membrane / diaphragme */
      var dy = d/.6*40;
      g.save(); g.strokeStyle = "#b56a50"; g.lineWidth = 6; g.beginPath(); g.moveTo(jl,jb); g.quadraticCurveTo(cx,jb+dy*1.3,jr,jb); g.stroke(); g.restore();
      D.line(c,cx,jb+dy*.65,cx,jb+dy*.65+28,P.ink,3); circ(c,cx,jb+dy*.65+32,5,P.ink);
      T(c,"membrane (diaphragme)",cx,jb+66+10,{size:12,color:"#b56a50"});
      if (d>0.01 && m!=="s"){ D.arrow(c,cx,jt-22,cx,jt+6,P.acc,3); }
      ro.set(0,S.fmt(pj,m==="s"?1:2)+" kPa"); ro.set(1,S.fmt(P0,1)+" kPa"); ro.set(2,m==="b" ? S.fmt(x,2)+" L" : m==="p" ? "0 L" : "pas de ballon");
      nt.set(m==="s" ? "Air enfermé : P × V = constante. Volume ×"+S.fmt((Vj0+d)/Vj0,2)+" donc pression ÷ "+S.fmt((Vj0+d)/Vj0,2)+". Dans un vrai thorax, cette baisse de pression fait entrer l'air." : m==="p" ? "Cloche percée : l'air entre aussi autour du ballon, la pression est la même partout : le ballon ne se gonfle plus." : d<=0 ? "Membrane au repos : pas de gonflement." : "La pression dans la cloche baisse de "+S.fmt(P0-pj,2)+" kPa : l'air entre par le tube et gonfle le ballon de "+S.fmt(x,2)+" L.","ok");
    });
    function ctxBalloon(c,x,y,r,v){ var g = c.ctx; g.save(); g.fillStyle = "rgba(242,150,140,.75)"; g.strokeStyle = "#b8473c"; g.lineWidth = 2.5; g.beginPath(); g.ellipse(x,y,r*.82,r,0,0,6.2832); g.fill(); g.stroke(); g.restore(); }
  }
});

/* ===== 2 · Échanges alvéolaires ===== */
SFA.sim({
  id:"b3-c05-air-inspire-expire", ch:"c05", tag:"Comparaison · animation",
  titre:"Air inspiré, air expiré : ce que les poumons changent",
  resume:"Compare la composition de l'air entré et sorti, au repos et à l'effort : combien de dioxygène est prélevé ?",
  but:"Règle l'intensité de l'effort. Les poumons respirent à la bonne cadence : les molécules d'air qui entrent et sortent n'ont pas la même composition. Lis les pourcentages et les volumes échangés par minute.",
  aRetenir:"L'air inspiré contient environ 21 % de O₂ et 0,04 % de CO₂ ; l'air expiré environ 16 à 17 % de O₂ et 3,5 à 5 % de CO₂ (et de la vapeur d'eau). On n'expire donc pas que du CO₂ : on n'a utilisé qu'une petite partie du dioxygène inspiré. À l'effort, on ventile plus et on prélève plus de O₂.",
  piege:"L'air expiré contient encore beaucoup de dioxygène (environ 16 %) : c'est pourquoi le bouche-à-bouche fonctionne. Et le diazote (≈ 78 %) n'est pas utilisé par le corps. (Composition en air sec, valeurs moyennes simplifiées.)",
  build:function(k,S){
    var c = k.canvas(0,{ratio:1.3});
    var ef = k.slider("Intensité de l'effort", 0, 100, 5, 0, "%");
    var ro = k.readouts(["Ventilation","O₂ consommé","CO₂ produit","Quotient CO₂ / O₂"]);
    var nt = k.note("","");
    var parts = [], tph = 0, seed = 7;
    function rnd(){ seed = (seed*16807)%2147483647; return seed/2147483647; }
    function comp(E){ var o2e = 17.0 - 1.1*E, co2e = 3.5 + 1.6*E; return {in:[79.03,20.93,.04], out:[100-o2e-co2e,o2e,co2e], o2e:o2e, co2e:co2e}; }
    var lp = k.loop(function(dt){
      var E = ef.value/100, fr = 14 + 26*E, per = 60/fr*2.2; tph += dt/per; var ph = tph%1, inh = ph<.5, cm = comp(E);
      var nSp = (6+24*E)*dt*(inh?1:1)*2.2;
      if (rnd() < nSp){ var src = inh ? cm.in : cm.out, r = rnd()*100, ty = r<src[2] ? 2 : r<src[2]+src[1] ? 1 : 0; if (ty===2 && inh && rnd()<.85) ty=0; parts.push({ty:ty, s:inh?0:1, dir:inh?1:-1, off:(rnd()-.5)*2, sp:.35+rnd()*.25}); }
      parts.forEach(function(p){ p.s += p.dir*dt*p.sp*(1+E*1.6); });
      parts = parts.filter(function(p){ return p.s>-.02 && p.s<1.02; });
      k.redraw();
    });
    lp.play();
    k.draw(function(){
      c.clear(); var g=c.ctx, W=c.W, H=c.H, E = ef.value/100, o2e = 17.0 - 1.1*E, co2e = 3.5 + 1.6*E, vent = 6 + 54*E;
      var vo2 = vent*(20.93-o2e)/100, vco2 = vent*(co2e-.04)/100, cm = comp(E);
      var bgc=g.createLinearGradient(0,0,0,H); bgc.addColorStop(0,"#f4f8fc"); bgc.addColorStop(1,"#e9f0f8"); g.fillStyle=bgc; g.fillRect(0,0,W,H);
      /* barres 100 % */
      var bx=Math.max(70,W*.2), bw=W-bx-12, bh=24;
      D.text(c,"Composition de l'air sec (100 %)",10,13,{size:11.5,color:P.grey,align:"left"});
      [["Inspiré",cm.in,38],["Expiré",cm.out,74]].forEach(function(q){
        D.text(c,q[0],bx-8,q[2]+bh/2,{size:12,align:"right",color:P.ink});
        var x=bx, cols=["#cfd6df",P.acc,P.orange], nm=["N₂","O₂","CO₂"];
        D.rrect(c,bx,q[2],bw,bh,6); g.save(); g.clip();
        q[1].forEach(function(v,i){ var w=bw*v/100; g.fillStyle=cols[i]; g.fillRect(x,q[2],Math.max(v>0?1.5:0,w),bh); x+=w; });
        g.restore(); D.rrect(c,bx,q[2],bw,bh,6); g.strokeStyle="#b7c1ce"; g.lineWidth=1; g.stroke();
        D.text(c,"N₂ "+S.fmt(q[1][0],1)+" %",bx+8,q[2]+bh/2,{size:11,align:"left",color:"#41506a"});
      });
      /* étiquettes O2 et CO2 hors barres */
      D.label(c,"O₂ "+S.fmt(cm.in[1],1)+" % → "+S.fmt(o2e,1)+" %",bx+bw,114,{size:11.5,color:P.acc,align:"right"});
      D.label(c,"CO₂ "+S.fmt(cm.in[2],2)+" % → "+S.fmt(co2e,1)+" %",bx+bw,133,{size:11.5,color:"#b4560c",align:"right"});
      /* poumons */
      var cx=W/2, top=H*.47, bot=H*.95, ph=tph%1, s2 = 1 + .1*Math.sin(Math.PI*ph);
      g.save(); g.translate(cx,(top+bot)/2+20); g.scale(s2,s2); g.translate(-cx,-(top+bot)/2-20);
      var lh=(bot-top)*.78, lw=Math.min(W*.3,110);
      [-1,1].forEach(function(sd){ var lx=cx+sd*(lw*.62+6);
        g.beginPath(); g.moveTo(cx+sd*6,top+lh*.28); g.bezierCurveTo(cx+sd*(lw*.2),top+lh*.1,lx+sd*lw*.6,top+lh*.18,lx+sd*lw*.55,top+lh*.55); g.bezierCurveTo(lx+sd*lw*.5,top+lh*.95,lx-sd*lw*.2,top+lh*1.02,cx+sd*8,top+lh*.9); g.closePath();
        var gr=g.createLinearGradient(0,top,0,top+lh); gr.addColorStop(0,"#f6c0c0"); gr.addColorStop(1,"#e89a9f"); g.fillStyle=gr; g.fill(); g.strokeStyle="#c97078"; g.lineWidth=1.6; g.stroke();
        g.strokeStyle="rgba(201,112,120,.55)"; g.lineWidth=2; for (var j=0;j<3;j++){ g.beginPath(); g.moveTo(cx+sd*8,top+lh*.3); g.lineTo(lx+sd*lw*(.05+.12*j),top+lh*(.45+.15*j)); g.stroke(); } });
      g.restore();
      /* trachée */
      g.fillStyle="#f3ece0"; g.strokeStyle="#bfa98a"; g.lineWidth=1.4; D.rrect(c,cx-9,H*.35,18,top+lh*.32-H*.35+8,6); g.fill(); g.stroke();
      D.label(c,"trachée",cx+14,H*.4,{size:11,color:P.grey,align:"left"}); D.label(c,"poumons",cx+lw*1.2,top+lh*.82,{size:11,color:"#8e3d46"});
      /* particules */
      parts.forEach(function(p){ var y=H*.35+p.s*(top+lh*.7-H*.35), x=cx+p.off*(p.s<.5?5:5+(p.s-.5)*lw*.9*1.2)*(p.s>.5?1:1);
        var col = p.ty===1 ? P.acc : p.ty===2 ? P.orange : "#b9c2ce", r = p.ty===0?2.6:3.8; g.beginPath(); g.arc(x,y,r,0,6.3); g.fillStyle=col; g.fill(); if (p.ty>0){ g.strokeStyle="#fff"; g.lineWidth=1; g.stroke(); } });
      g.fillStyle="#fff"; g.fillRect(0,0,0,0);
      D.arrow(c,cx-W*.2,H*.38,cx-W*.2,H*.5,P.acc,3); D.text(c,"inspiré",cx-W*.2,H*.35,{size:11.5,color:P.acc});
      D.arrow(c,cx+W*.22,H*.5,cx+W*.22,H*.38,"#b4560c",3); D.text(c,"expiré",cx+W*.22,H*.35,{size:11.5,color:"#b4560c"});
      D.text(c,(ph<.5?"inspiration":"expiration")+" · "+S.fmt(14+26*E,0)+" resp./min (film accéléré)",W/2,H*.985,{size:11,color:P.grey});
      ro.set(0,S.fmt(vent,0)+" L/min"); ro.set(1,S.fmt(vo2,2)+" L/min"); ro.set(2,S.fmt(vco2,2)+" L/min"); ro.set(3,S.fmt(vco2/vo2,2));
      nt.set(E===0 ? "Au repos : on inspire environ 6 L d'air par minute et on prélève environ un quart de litre de O₂." : "À l'effort : "+S.fmt(vent/6,1)+" fois plus d'air brassé, et "+S.fmt(vo2/(6*(20.93-17)/100),1)+" fois plus de O₂ prélevé qu'au repos.","ok");
    });
  }
});

/* ===== 3 · Effort physique ===== */
SFA.sim({
  id:"b3-c05-effort", ch:"c05", tag:"Défi",
  titre:"À l'effort : respiration et cœur s'emballent",
  resume:"Cœur, fréquence respiratoire, débits et O₂ consommé quand l'intensité augmente. Place ton cœur dans la zone d'endurance.",
  but:"Règle l'intensité de l'effort et l'âge. Les barres bougent avec un temps de réaction. Défi : amener la fréquence cardiaque entre 60 et 70 % de la fréquence maximale.",
  aRetenir:"À l'effort, les muscles consomment plus de dioxygène et produisent plus de CO₂ : la fréquence cardiaque, la fréquence respiratoire et le volume d'air inspiré augmentent ensemble. Poumons et cœur forment un système : l'air n'apporte du O₂ qu'à condition que le sang le transporte jusqu'aux muscles.",
  piege:"La fréquence cardiaque maximale diminue avec l'âge (environ 220 − âge, valeur moyenne approximative). Le cœur bat plus vite, mais chaque battement envoie aussi plus de sang (volume d'éjection plus grand). (Valeurs moyennes simplifiées.)",
  build:function(k,S){
    var cs = k.canvas(0,{ratio:.5});
    var c = k.canvas(300);
    var it = k.slider("Intensité de l'effort", 0, 100, 5, 20, "%");
    var ag = k.slider("Âge", 12, 60, 1, 15, "ans");
    var ro = k.readouts(["Fréquence cardiaque","Fréquence respiratoire","Air brassé","Débit cardiaque","O₂ consommé"]);
    var nt = k.note("","");
    var cur = {fc:70,fr:14,vt:.5,vent:7,q:4.9,vo2:.245};
    function target(){
      var I = it.value/100, fcmax = 220 - ag.value, fc = 70 + (fcmax-70)*I, fr = 14 + 26*I, vt = .5 + 1.5*I, q = fc*(70+50*I)/1000, vo2 = q*(50+100*I)/1000;
      return {fc:fc, fr:fr, vt:vt, vent:fr*vt, q:q, vo2:vo2, fcmax:fcmax};
    }
    var lp = k.loop(function(dt){
      var tg = target(); if (!cur) cur = {fc:70,fr:14,vt:.5,vent:7,q:4.9,vo2:.245};
      var a = 1-Math.exp(-dt*8/20);   /* temps accéléré ×8, constante ≈ 20 s */
      ["fc","fr","vt","vent","q","vo2"].forEach(function(n){ cur[n] += (tg[n]-cur[n])*a; });
      var I=it.value/100; ph.run += dt*(I>0.02? 2.2+I*7 : 0); ph.hb += dt*cur.fc/60*.9; ph.br += dt*cur.fr/60*.9; k.redraw();
    });
    var ph = {run:0,hb:0,br:0};
    lp.play();
    function scene(tg){
      var g=cs.ctx, W=cs.W, H=cs.H, I=it.value/100; cs.clear(); var bgc=g.createLinearGradient(0,0,0,H); bgc.addColorStop(0,"#eaf3fb"); bgc.addColorStop(1,"#f4f8f1"); g.fillStyle=bgc; g.fillRect(0,0,W,H);
      g.fillStyle="#b8d9a0"; g.fillRect(0,H*.86,W,H*.14);
      /* coureur */
      var rx=W*.2, ry=H*.52, u=H*.0085, sw=Math.sin(ph.run), lean=.05+I*.25;
      g.save(); g.translate(rx,ry+Math.abs(Math.sin(ph.run*2))*-3*I); g.lineCap="round"; g.lineJoin="round";
      g.strokeStyle="#334155"; g.lineWidth=5; var hip=[0,0], sh=[Math.sin(lean)*30*u/ (H*.0085) *.0+lean*28,-32];
      function limb(x0,y0,a1,l1,a2,l2){ var kx=x0+Math.sin(a1)*l1, ky=y0+Math.cos(a1)*l1, ex=kx+Math.sin(a2)*l2, ey=ky+Math.cos(a2)*l2; g.beginPath(); g.moveTo(x0,y0); g.lineTo(kx,ky); g.lineTo(ex,ey); g.stroke(); }
      var amp=.15+I*.9; limb(0,0,sw*amp,22,sw*amp-.35-I*.5*Math.max(0,Math.cos(ph.run)),22); limb(0,0,-sw*amp,22,-sw*amp-.35-I*.5*Math.max(0,-Math.cos(ph.run)),22);
      g.strokeStyle="#4a7fc1"; g.lineWidth=9; g.beginPath(); g.moveTo(0,0); g.lineTo(sh[0],sh[1]); g.stroke();
      g.strokeStyle="#f2c9a0"; g.lineWidth=4.5; var sa=-sw*(.2+I*.9); g.beginPath(); g.moveTo(sh[0],sh[1]+4); g.lineTo(sh[0]+Math.sin(sa)*14,sh[1]+4+Math.cos(sa)*14); g.lineTo(sh[0]+Math.sin(sa)*14+Math.sin(sa-1+I*.4)*13,sh[1]+4+Math.cos(sa)*14+Math.cos(sa-1+I*.4)*13); g.stroke();
      g.fillStyle="#f2c9a0"; g.strokeStyle="#2a3340"; g.lineWidth=1.2; g.beginPath(); g.arc(sh[0]+4,sh[1]-10,8,0,6.3); g.fill(); g.stroke();
      g.restore();
      /* sueur */
      if (I>.5){ g.fillStyle="rgba(90,170,230,.8)"; for (var i=0;i<Math.round((I-.4)*8);i++){ var q=((ph.run*.4+i*.37)%1); g.beginPath(); g.arc(rx+16+i*3,ry-52+q*20,1.8,0,6.3); g.fill(); } }
      /* coeur */
      var hx=W*.5, hy=H*.45, pul=Math.pow(Math.max(0,Math.sin(ph.hb*2*Math.PI)),6), hs=H*.3*(1+.16*pul);
      g.save(); g.translate(hx,hy); g.scale(hs/60,hs/60); g.fillStyle="#d4455b"; g.strokeStyle="#8f2338"; g.lineWidth=2; g.beginPath(); g.moveTo(0,28); g.bezierCurveTo(-42,0,-26,-34,0,-14); g.bezierCurveTo(26,-34,42,0,0,28); g.fill(); g.stroke(); g.restore();
      D.glow(cs,hx,hy,hs*.9,"#ff5a73",.25*pul);
      D.label(cs,S.fmt(cur.fc,0)+" bpm",hx,H*.88,{size:12,color:P.red});
      /* poumons */
      var lx=W*.8, ly=H*.45, bs=1+.18*Math.sin(ph.br*2*Math.PI)*(.4+I*.9);
      g.save(); g.translate(lx,ly); g.scale(bs,bs); [-1,1].forEach(function(sd){ g.fillStyle="#f1a9ad"; g.strokeStyle="#c97078"; g.lineWidth=1.6; g.beginPath(); g.moveTo(sd*4,-H*.12); g.bezierCurveTo(sd*H*.2,-H*.12,sd*H*.22,H*.1,sd*H*.12,H*.18); g.bezierCurveTo(sd*H*.04,H*.2,sd*3,H*.1,sd*4,-H*.12); g.fill(); g.stroke(); }); g.restore();
      D.label(cs,S.fmt(cur.fr,0)+" resp./min",lx,H*.88,{size:12,color:P.acc});
      D.label(cs,I<.02?"au repos":"effort "+it.value+" %",rx,H*.88,{size:12,color:P.ink});
      D.label(cs,"film ralenti",W-8,12,{size:10.5,color:P.grey,align:"right"});
    }
    k.draw(function(){
      scene(target());
      c.clear(); var tg = target(); if (!cur) cur = {fc:70,fr:14,vt:.5,vent:7,q:4.9,vo2:.245};
      var items = [["Fréq. cardiaque (bpm)",cur.fc,tg.fcmax,P.red,0],["Fréq. respiratoire (/min)",cur.fr,45,P.acc,0],["Air brassé (L/min)",cur.vent,90,P.teal,1],["Débit cardiaque (L/min)",cur.q,28,P.violet,1],["O₂ consommé (L/min)",cur.vo2,4,P.green,2]];
      var y = 16, h = 22, x0 = 16, w = c.W-32;
      items.forEach(function(q,i){
        var yy = y + i*50; T(c,q[0],x0,yy,{size:12,align:"left",color:P.ink});
        rect(c,x0,yy+10,w,h,"#eef1f5",P.light); rect(c,x0,yy+10,Math.max(2,w*Math.min(1,q[1]/q[2])),h,q[3],null);
        T(c,S.fmt(q[1],q[4]),x0+8,yy+10+h/2,{size:13,align:"left",color:"#fff",bg:"rgba(0,0,0,.35)"});
      });
      var z0 = .6*tg.fcmax, z1 = .7*tg.fcmax;
      c.ctx.save(); c.ctx.fillStyle = "rgba(46,107,85,.35)"; c.ctx.fillRect(x0+w*z0/tg.fcmax,y+10,w*(z1-z0)/tg.fcmax,h); c.ctx.restore();
      T(c,"zone d'endurance",Math.min(x0+w*z0/tg.fcmax,c.W-112),y+10+h+9,{size:12,align:"left",color:P.green});
      ro.set(0,S.fmt(tg.fc,0)+" bpm"); ro.set(1,S.fmt(tg.fr,0)+" /min"); ro.set(2,S.fmt(tg.vent,0)+" L/min"); ro.set(3,S.fmt(tg.q,1)+" L/min"); ro.set(4,S.fmt(tg.vo2,2)+" L/min");
      var pc = tg.fc/tg.fcmax*100;
      nt.set(pc>=60&&pc<=70 ? "Zone d'endurance atteinte ("+S.fmt(pc,0)+" % de la fréquence maximale de "+tg.fcmax+" bpm). Défi réussi." : pc<60 ? "À "+S.fmt(pc,0)+" % de ta fréquence maximale ("+tg.fcmax+" bpm) : augmente l'effort pour entrer dans la zone d'endurance (60 à 70 %)." : "À "+S.fmt(pc,0)+" % de ta fréquence maximale : effort intense, au-dessus de la zone d'endurance.", pc>=60&&pc<=70 ? "ok" : "warn");
    });
  }
});

/* ===== 4 · Altitude, tabac et hémoglobine ===== */
SFA.sim({
  id:"b3-c05-altitude", ch:"c05", tag:"Original · niche",
  titre:"Altitude et monoxyde de carbone : le sang transporte moins de O₂",
  resume:"En montagne la pression d'O₂ chute. L'hémoglobine se sature moins. Et la fumée de cigarette occupe aussi l'hémoglobine.",
  but:"Règle l'altitude, l'acclimatation et la part d'hémoglobine occupée par le monoxyde de carbone. Lis la saturation du sang et la quantité de O₂ transportée.",
  aRetenir:"La proportion d'O₂ dans l'air reste 21 %, mais la pression de l'air diminue avec l'altitude : il y a moins de molécules de O₂ à chaque inspiration. L'hémoglobine (globules rouges) fixe O₂ ; sa saturation baisse quand la pression de O₂ baisse. Le monoxyde de carbone se fixe à la place de O₂ et réduit la quantité transportée, à toute altitude.",
  piege:"« Moins d'oxygène en altitude » ne veut pas dire que l'air contient moins de O₂ en pourcentage, mais qu'il y en a moins par litre d'air. Et le fumeur n'a pas besoin d'altitude pour manquer d'oxygène. (Modèle simplifié : atmosphère standard, courbe de saturation de l'hémoglobine moyenne.)",
  build:function(k,S){
    var c = k.canvas(300);
    var h = k.slider("Altitude", 0, 8800, 100, 0, "m");
    var ac = k.slider("Acclimatation (respiration plus rapide)", 0, 100, 10, 0, "%");
    var co = k.slider("Monoxyde de carbone dans le sang (tabac)", 0, 10, 1, 0, "%");
    var ro = k.readouts(["Pression atmosphérique","Pression de O₂ dans les alvéoles","Saturation de l'hémoglobine","O₂ transporté par litre de sang"]);
    var nt = k.note("","");
    function state(){
      var hh = h.value, A = ac.value/100, Patm = 101.325*Math.pow(1-2.25577e-5*hh,5.25588), pio2 = .2093*(Patm-6.3);
      var z = hh/8848, paco2 = 5.3-2.0*z-2.0*A*Math.pow(z,.7), pao2 = pio2 - paco2/.8, p50 = 3.5 - .5*A;
      var s = pao2>0 ? Math.pow(pao2,2.7)/(Math.pow(p50,2.7)+Math.pow(pao2,2.7)) : 0;
      return {patm:Patm, pao2:pao2, p50:p50, s:s, cont:201*(1-co.value/100)*s};
    }
    k.draw(function(){
      c.clear(); var st = state();
      var ax = D.axes(c,{x0:0,x1:15,y0:0,y1:100,xl:"pression de O₂ dans les alvéoles (kPa)",yl:"saturation (%)",stepX:3,stepY:25,l:52});
      D.fn(c,ax,function(x){ return 100*Math.pow(x,2.7)/(Math.pow(st.p50,2.7)+Math.pow(x,2.7)); },P.red,3.2);
      D.fn(c,ax,function(x){ return 100*Math.pow(x,2.7)/(Math.pow(3.5,2.7)+Math.pow(x,2.7)); },P.grey,1.5,[5,4]);
      var xp = Math.max(0,Math.min(15,st.pao2));
      D.line(c,ax.X(xp),ax.B,ax.X(xp),ax.Y(st.s*100),P.violet,1.5,[4,4]); D.line(c,ax.L,ax.Y(st.s*100),ax.X(xp),ax.Y(st.s*100),P.violet,1.5,[4,4]);
      D.dot(c,ax.X(xp),ax.Y(st.s*100),7,P.violet);
      T(c,"pointillé gris : courbe de référence",ax.R-4,ax.Y(40),{size:12,align:"right",color:P.grey});
      ro.set(0,S.fmt(st.patm,0)+" kPa"); ro.set(1,st.pao2>0 ? S.fmt(st.pao2,1)+" kPa" : "≈ 0 kPa"); ro.set(2,S.fmt(st.s*100,0)+" %"); ro.set(3,S.fmt(st.cont,0)+" mL");
      nt.set(st.pao2<=0 ? "Sans acclimatation, à cette altitude, la pression de O₂ devient trop faible : perte de conscience en quelques minutes. L'acclimatation (hyperventilation) est indispensable." : st.s<.75 ? "Saturation inférieure à 75 % : hypoxie sévère. Les alpinistes de très haute altitude utilisent de l'oxygène en bouteille." : st.s<.9 ? "Saturation inférieure à 90 % : hypoxie, essoufflement, maux de tête (mal des montagnes)." : co.value>=5 ? "Même sans altitude, "+co.value+" % de monoxyde de carbone dans le sang réduisent d'autant (environ "+co.value+" %) le O₂ transporté : l'hémoglobine occupée par le CO ne peut plus fixer O₂." : "Saturation normale : l'hémoglobine est presque entièrement chargée en O₂.", st.pao2<=0||st.s<.9 ? "warn" : "ok");
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

/*B3D-ADD:b3-3d-coeur*/
SFA.sim({
  id:"b3-3d-coeur", ch:"c05", tag:"3D · cycle cardiaque",
  titre:"Un battement de cœur en 3D, synchronisé avec les pressions et le volume",
  resume:"Un cœur 3D qui bat et, dessous, le diagramme de Wiggers : valves, pression du ventricule gauche, volume et ECG au même instant.",
  but:"Lance le film (ralenti) ou avance phase par phase. Change la fréquence cardiaque : la diastole raccourcit, le ventricule se remplit moins, le débit finit par plafonner. Glisse sur le cœur pour le tourner.",
  aRetenir:"Un cycle cardiaque a 3 temps : systole des oreillettes (elles finissent de remplir les ventricules), systole des ventricules (valves auriculo-ventriculaires fermées, puis ouverture des valves de l'aorte et de l'artère pulmonaire : éjection), puis diastole (tout le cœur se relâche et se remplit). Les valves imposent un sens unique au sang. Débit cardiaque = fréquence × volume d'éjection systolique (≈ 5 L/min au repos). Modèle simplifié du cœur gauche.",
  piege:"Le sang rouge n'est pas « dans le cœur gauche parce qu'il est propre » : le cœur gauche reçoit le sang oxygéné des poumons, le cœur droit le sang pauvre en O₂ des organes. Et quand la fréquence monte beaucoup, c'est la diastole qui raccourcit le plus : le ventricule n'a plus le temps de se remplir, donc plus de fréquence ne veut plus dire plus de débit.",
  build:function(k, S){
    var B = window.B3D, c = k.canvas(340), w = k.canvas(250), cam = B.cam(0.35, 0.1, 8);
    var fc = k.slider("Fréquence cardiaque", 45, 190, 5, 75, "bpm");
    var spd = k.slider("Vitesse du film", 0.1, 1, 0.05, 0.35, "×");
    var rot = k.toggle("Rotation automatique", false, function(v){ cam.auto = v; });
    var ro = k.readouts(["Phase", "Volume d'éjection", "Débit cardiaque", "Systole / diastole"]);
    var nt = k.note("", "");
    cam.auto = false;
    var t = 0, playing = true, PH = ["Systole des oreillettes", "Contraction isovolumétrique", "Éjection", "Relaxation isovolumétrique", "Remplissage (diastole)"];
    var PCOL = ["#fde68a", "#fecaca", "#fca5a5", "#bfdbfe", "#dbeafe"];
    k.button("Lecture / pause", function(){ playing = !playing; }, true);
    k.button("Phase suivante", function(){ var m = model(); var s = m.st, i = 0; for (var q = 0; q < 5; q++) if (t >= s[q]) i = q; t = s[(i + 1) % 5] + 0.002; playing = false; });
    B.drag(c, cam, function(){ render(); });
    function model(){
      var T = 60 / fc.value, sc = Math.sqrt(T / 0.8), ta = Math.min(0.1 * sc, T * 0.14), ts = Math.min(0.3 * sc, T * 0.42);
      var te = ta + 0.12 * ts, tc = ta + 0.7 * ts, tE = ta + ts, Td = T - tE;
      var ESV = 55, g = function(x){ return 1 - Math.exp(-x / 0.14); };
      var EDVpre = ESV + (130 - 20 - ESV) * g(Td), EDV = EDVpre + 20 * Math.min(1, ta / 0.1), SV = EDV - ESV;
      var e0 = Math.exp(-(T - tc + te) / 0.6), P0 = 65 + 20.3 * e0 / (1 - e0), Pc = P0 + 20.3;
      return {T:T, ta:ta, ts:ts, te:te, tc:tc, tE:tE, Td:Td, ESV:ESV, EDVpre:EDVpre, EDV:EDV, SV:SV, P0:P0, Pc:Pc, st:[0, ta, te, tc, tE], g:g};
    }
    function at(m, x){      /* valeurs à l'instant x du cycle */
      var ph, V, Pv, Pao, a = 0;
      if (x < m.ta){ ph = 0; a = x / m.ta; V = m.EDVpre + (m.EDV - m.EDVpre) * (1 - Math.cos(Math.PI * a)) / 2; Pv = 6 + 4 * Math.sin(Math.PI * a); }
      else if (x < m.te){ ph = 1; V = m.EDV; var r = (x - m.ta) / (m.te - m.ta); Pv = 10 + (m.P0 - 10) * r * r; }
      else if (x < m.tc){ ph = 2; var u = (x - m.te) / (m.tc - m.te); V = m.EDV - m.SV * (1 - Math.cos(Math.PI * u)) / 2; Pv = m.P0 + 45 * Math.sin(Math.PI * u * 0.85); }
      else if (x < m.tE){ ph = 3; V = m.ESV; Pv = 8 + (m.Pc - 8) * Math.exp(-(x - m.tc) / 0.035); }
      else { ph = 4; var tau = x - m.tE; V = m.ESV + (m.EDVpre - m.ESV) * m.g(tau) / m.g(m.Td); Pv = 6 + 3 * (tau / m.Td); }
      if (ph === 2) Pao = Pv;
      else { var tauC = (x >= m.tc ? x - m.tc : x + m.T - m.tc); Pao = 65 + (m.Pc - 65) * Math.exp(-tauC / 0.6) + (ph === 3 && x - m.tc < 0.05 ? 3 * Math.sin(Math.PI * (x - m.tc) / 0.05) : 0); }
      return {ph:ph, V:V, Pv:Pv, Pao:Pao, a:a};
    }
    function ecg(m, x){
      function bump(c0, wd, h){ return h * Math.exp(-Math.pow((x - c0) / wd, 2)); }
      return bump(m.ta * 0.45, m.ta * 0.25, 0.15) + bump(m.ta - 0.005 > 0 ? m.ta + 0.012 : m.ta, 0.008, -0.12) + bump(m.ta + 0.03, 0.012, 1) + bump(m.ta + 0.046, 0.01, -0.22) + bump(m.ta + 0.7 * m.ts * 0.85, m.ts * 0.14, 0.3);
    }
    function render(){
      var m = model(), x = t % m.T, v = at(m, x), ph = v.ph;
      /* --- cœur 3D --- */
      B.background(c);
      var sc = B.scene(c, cam, Math.min(c.W / 4.6, c.H / 5.6), 4);
      var RED = B.hex("#dc2626"), BLU = B.hex("#2563eb"), DRED = B.hex("#b91c1c"), DBLU = B.hex("#1d4ed8");
      var atr = 0.42 - 0.12 * (ph === 0 ? Math.sin(Math.PI * v.a) : 0) + (ph >= 1 && ph <= 3 ? 0.05 : 0);
      var vr = 0.34 + 0.46 * Math.cbrt(v.V / 125), vrR = 0.3 + 0.42 * Math.cbrt(v.V / 125);
      var LA = [0.95, 0.95, -0.15], RA = [-0.95, 0.95, 0.1], LV = [0.6, -0.65, -0.1], RV = [-0.65, -0.55, 0.3];
      /* vaisseaux */
      sc.tube([-1.0, 1.2, 0.1], [-1.2, 2.0, 0.1], 0.17, DBLU); sc.label([-1.25, 2.25, 0.1], "veine cave", "#1d4ed8", 10, 0, 0);
      sc.tube([1.0, 1.1, -0.2], [1.35, 1.7, -0.3], 0.15, DRED); sc.label([1.4, 1.95, -0.3], "veines pulm.", "#b91c1c", 10, 0, 0);
      sc.tube([0.3, 0.1, 0.45], [0.05, 1.5, 0.5], 0.2, RED); sc.tube([0.05, 1.5, 0.5], [-0.3, 2.0, 0.5], 0.2, RED); sc.tube([-0.3, 2.0, 0.5], [-0.65, 1.8, 0.5], 0.2, RED); sc.label([0.0, 2.25, 0.5], "aorte", "#b91c1c", 10, 0, 0);
      sc.tube([-0.3, 0.1, 0.6], [-0.25, 1.1, 0.8], 0.17, BLU); sc.tube([-0.25, 1.1, 0.8], [0.5, 1.5, 0.8], 0.17, BLU); sc.label([0.55, 1.75, 0.8], "art. pulm.", "#1d4ed8", 10, 0, 0);
      /* cavités */
      sc.sphere(RA, atr, BLU, 0.92); sc.sphere(LA, atr, RED, 0.92);
      sc.sphere(RV, vrR, DBLU, 0.95); sc.sphere(LV, vr, DRED, 0.95);
      sc.label(RA, "OD", "#fff", 11, 0, 0); sc.label(LA, "OG", "#fff", 11, 0, 0); sc.label([RV[0], RV[1], RV[2] - 0.4], "VD", "#fff", 11, 0, 0); sc.label([LV[0], LV[1], LV[2] - 0.5], "VG", "#fff", 12, 0, 0);
      /* valves : ouverte (vert) ou fermée (rouge) */
      var avOpen = (ph === 0 || ph === 4), aoOpen = ph === 2;
      function valve(p, open, nm){ sc.sphere(p, 0.12, open ? B.hex("#16a34a") : B.hex("#f59e0b"), 1, "#fff"); }
      valve([0.85, 0.25, -0.2], avOpen); valve([-0.85, 0.25, 0.1], avOpen); valve([0.35, 0.15, -0.1], aoOpen); valve([-0.35, 0.15, 0.35], aoOpen);
      /* flux de sang */
      var q, n;
      if (ph === 2) for (q = 0; q < 5; q++){ n = ((t * 2 + q / 5) % 1); sc.sphere([0.4 - 0.1 * n, 0.2 + 2.0 * n, -0.15], 0.07, B.hex("#fecaca")); }
      if (avOpen) for (q = 0; q < 4; q++){ n = ((t * 2 + q / 4) % 1); sc.sphere([0.7 - 0.2 * n, 1.0 - 1.4 * n, -0.15], 0.07, B.hex("#fecaca")); sc.sphere([-0.7 + 0.15 * n, 1.0 - 1.4 * n, 0.15], 0.07, B.hex("#bfdbfe")); }
      sc.flush(); B.hint(c);
      var ctx = c.ctx; ctx.save(); ctx.font = "800 12px Mulish,system-ui,sans-serif"; ctx.fillStyle = "#0f1b2d"; ctx.fillText(PH[ph], 10, 18);
      ctx.font = "600 11px Mulish,system-ui,sans-serif"; ctx.fillStyle = "#16a34a"; ctx.fillText("● valve ouverte", 10, c.H - 44); ctx.fillStyle = "#f59e0b"; ctx.fillText("● valve fermée", 10, c.H - 28); ctx.restore();
      /* --- diagramme de Wiggers --- */
      w.clear(); var W = w.W, H = w.H, L = 44, R = W - 10, pw = R - L, c2 = w.ctx;
      var rows = [{y:8, h:34, n:"ECG"}, {y:50, h:110, n:"Pression (mmHg)"}, {y:168, h:70, n:"Volume VG (mL)"}];
      function X(tt){ return L + tt / m.T * pw; }
      var bounds = [[0, m.ta], [m.ta, m.te], [m.te, m.tc], [m.tc, m.tE], [m.tE, m.T]];
      bounds.forEach(function(b, i){ c2.fillStyle = PCOL[i]; c2.globalAlpha = 0.45; c2.fillRect(X(b[0]), 6, X(b[1]) - X(b[0]), 234); c2.globalAlpha = 1; });
      c2.font = "700 10px Mulish,system-ui,sans-serif"; c2.fillStyle = "#475569"; c2.textAlign = "left";
      rows.forEach(function(r){ c2.fillText(r.n, 4, r.y + 8); });
      c2.strokeStyle = "#94a3b8"; c2.lineWidth = 1; rows.forEach(function(r){ c2.strokeRect(L, r.y, pw, r.h); });
      function trace(r, f, lo, hi, col, lw){ c2.beginPath(); for (var i = 0; i <= 160; i++){ var tt = m.T * i / 160, val = f(tt), px = X(tt), py = r.y + r.h - (val - lo) / (hi - lo) * r.h; if (i) c2.lineTo(px, py); else c2.moveTo(px, py); } c2.strokeStyle = col; c2.lineWidth = lw || 2; c2.stroke(); }
      trace(rows[0], function(tt){ return ecg(m, tt); }, -0.4, 1.2, "#0f1b2d", 1.6);
      trace(rows[1], function(tt){ return at(m, tt).Pao; }, 0, 135, "#475569", 2);
      trace(rows[1], function(tt){ return at(m, tt).Pv; }, 0, 135, "#dc2626", 2.2);
      trace(rows[2], function(tt){ return at(m, tt).V; }, 40, 140, "#2563eb", 2.2);
      c2.font = "700 10px Mulish,system-ui,sans-serif"; c2.fillStyle = "#dc2626"; c2.fillText("VG", X(m.te) + 4, rows[1].y + 22); c2.fillStyle = "#475569"; c2.fillText("aorte", X(m.T) - 36, rows[1].y + rows[1].h - ((m.P0 + 8 - 0) / 135) * rows[1].h - 6);
      c2.fillStyle = "#64748b"; c2.fillText("0", L - 8, 248); c2.fillText(S.fmt(m.T, 2) + " s", R - 36, 248);
      c2.strokeStyle = "#0f1b2d"; c2.lineWidth = 1.5; c2.setLineDash([4, 3]); c2.beginPath(); c2.moveTo(X(x), 4); c2.lineTo(X(x), 240); c2.stroke(); c2.setLineDash([]);
      /* lecture */
      ro.set(0, PH[ph]); ro.set(1, S.fmt(m.SV, 0) + " mL"); ro.set(2, S.fmt(m.SV * fc.value / 1000, 1) + " L/min"); ro.set(3, S.fmt((m.ta + m.ts), 2) + " s / " + S.fmt(m.Td, 2) + " s");
      var msgs = ["Les oreillettes se contractent et finissent de remplir les ventricules (≈ 20 % du remplissage). Les valves auriculo-ventriculaires sont ouvertes, celles de l'aorte fermées.",
        "Les ventricules commencent à se contracter : toutes les valves sont fermées, la pression monte sans que le volume change (isovolumétrique).",
        "La pression du ventricule dépasse celle de l'aorte : la valve aortique s'ouvre et le sang est éjecté. Le volume chute de " + S.fmt(m.SV, 0) + " mL.",
        "La valve aortique se referme (le « dicrote » sur la pression de l'aorte) : le ventricule se relâche, toutes les valves fermées, pression qui s'effondre.",
        "Le cœur est relâché : les valves auriculo-ventriculaires s'ouvrent, le sang des oreillettes remplit passivement les ventricules."];
      var warn = fc.value > 150 ? " Fréquence très élevée : la diastole ne dure plus que " + S.fmt(m.Td, 2) + " s, le remplissage est incomplet et le volume d'éjection baisse." : "";
      nt.set(msgs[ph] + warn, warn ? "warn" : "");
    }
    k.draw(render);
    var Lp = k.loop(function(dt){ B.spin(cam, dt, 0.25); if (playing) t += dt * spd.value; render(); });
    Lp.play();
  }
});
/*B3D-ADD-END:b3-3d-coeur*/
