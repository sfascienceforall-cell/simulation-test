/* Chapitre 6 · Solutions et concentration massique */
(function(){
var D = SFA.draw, P = D.palette, T = D.text, F = SFA.fmt;
function rr(c,x,y,w,h,fill,stroke,lw,r){ var g=c.ctx; g.save(); g.beginPath(); if(g.roundRect) g.roundRect(x,y,w,h,r||6); else g.rect(x,y,w,h); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1.5;g.stroke();} g.restore(); }
function circ(c,x,y,r,fill,stroke,lw){ var g=c.ctx; g.beginPath(); g.arc(x,y,r,0,6.2832); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1;g.stroke();} }
function rng(seed){ var a=seed>>>0; return function(){ a|=0; a=a+0x6D2B79F5|0; var t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }
/* bécher : x,y,w,h ; liquide de hauteur fraction f ; couleur */
function beaker(c,x,y,w,h,f,col,label){
  CH.glass(c,x,y,w,h,f,col,{round:9});
  if(label) T(c,label,x+w/2,y+h+14,{size:12,color:P.grey});
}

/* ---------- 1 · Dissolution et saturation ---------- */
var SOL = {
  sel:{n:"Sel de cuisine (NaCl)", s:360, col:"#8ea4bf"},
  kno3:{n:"Nitrate de potassium (KNO₃)", s:316, col:"#c9ccd6"},
  nahco3:{n:"Bicarbonate de sodium (NaHCO₃)", s:96, col:"#d5d0c4"}
};
SFA.sim({
  id:"c3-c06-dissolution", ch:"c06", tag:"Classique",
  titre:"Dissoudre : concentration massique et saturation",
  resume:"Ajoute du soluté dans l'eau : la concentration monte jusqu'à la saturation, puis le solide s'accumule au fond.",
  but:"Choisis un soluté, une masse et un volume d'eau. Observe la concentration massique ρ = m/V, la masse dissoute et ce qui se dépose quand la solution est saturée.",
  aRetenir:"ρ = m ÷ V : la concentration massique (g/L) est la masse de soluté dissous par litre de solution. Elle ne peut pas dépasser la solubilité (ici à 20 °C) : au-delà, la solution est saturée et le soluté en excès reste au fond.",
  piege:"Pense à convertir les volumes en litres (500 mL = 0,5 L). Le volume de la solution n'est pas exactement celui de l'eau ajoutée : ici on le prend égal (approximation valable pour des petites masses). Les solubilités à 20 °C sont arrondies : sel ≈ 360 g/L, KNO₃ ≈ 316 g/L, NaHCO₃ ≈ 96 g/L.",
  build:function(k,S){
    var c = k.canvas(320);
    var so = k.select("Soluté", Object.keys(SOL).map(function(i){return [i,SOL[i].n+" · solubilité ≈ "+SOL[i].s+" g/L"];}), "sel");
    var ms = k.slider("Masse de soluté ajoutée", 0, 400, 5, 100, "g");
    var vs = k.slider("Volume d'eau", 0.1, 1, 0.05, 0.5, "L");
    var ro = k.readouts(["Masse dissoute","Concentration ρ","Solubilité","Dépôt au fond","État"]);
    var nt = k.note("","");
    var R=rng(4), pts=[]; for(var i=0;i<260;i++) pts.push([R(),R()]);
    var lp0 = k.loop(function(){ k.redraw(); });
    k.draw(function(){
      c.clear(); CH.bg(c); var tt=Date.now()/1000, W=c.W,H=c.H,g=c.ctx, s=SOL[so.value], V=vs.value, m=ms.value, lim=s.s*V, diss=Math.min(m,lim), dep=Math.max(0,m-lim), rho=diss/V;
      var bw=W*0.38, bx=W*0.08, by=24, bh=H-60, f=V/1.0*0.9, lvl=by+bh*(1-f);
      var tint=0.1+0.35*Math.min(1,rho/Math.max(s.s,1));
      beaker(c,bx,by,bw,bh,f,"rgba(120,170,220,"+tint.toFixed(2)+")","");
      for(var g2=0;g2<=10;g2++){ var yy=by+bh-bh*0.9*g2/10; if(g2%2===0){ D.line(c,bx+bw,yy,bx+bw+(g2%5===0?10:6),yy,"#8a95a3",1.2); } if(g2%5===0) T(c,String(g2/10).replace(".",",")+" L",bx+bw+14,yy,{size:12,color:P.grey,align:"left"}); }
      var n=Math.round(pts.length*Math.min(1,diss/400)*1.0);
      for(i=0;i<n;i++){ var px=bx+8+pts[i][0]*(bw-16)+Math.sin(tt*1.6+i)*2.2, py=lvl+8+pts[i][1]*(by+bh-lvl-16)+Math.cos(tt*1.3+i*1.7)*2.2; circ(c,px,py,2.6,s.col,"rgba(255,255,255,.7)",0.8); }
      if(dep>0){ var hh=Math.min(bh*0.35,6+dep*0.08); g.save(); g.fillStyle=s.col; g.beginPath(); g.moveTo(bx+3,by+bh-1); g.lineTo(bx+bw*0.2,by+bh-hh*0.9); g.lineTo(bx+bw*0.5,by+bh-hh); g.lineTo(bx+bw*0.8,by+bh-hh*0.9); g.lineTo(bx+bw-3,by+bh-1); g.closePath(); g.fill(); g.restore(); }
      // jauge
      var jx=W*0.66, jw=W*0.3, jy=40; T(c,"ρ / solubilité",jx+jw/2,jy-14,{size:12,color:P.grey});
      rr(c,jx,jy,jw,18,"#eef1f5","#b8c2d0",1.2,4); rr(c,jx,jy,jw*Math.min(1,rho/s.s),18,rho>=s.s-1e-9?P.amber:P.acc,null,0,4);
      T(c,F(rho,0)+" g/L",jx+jw/2,jy+34,{size:13,color:P.ink}); T(c,"limite "+s.s+" g/L",jx+jw/2,jy+52,{size:12,color:P.grey});
      T(c,F(m,0)+" g de soluté",jx+jw/2,jy+96,{size:12,color:P.ink}); T(c,"dans "+F(V*1000,0)+" mL d'eau",jx+jw/2,jy+114,{size:12,color:P.ink});
      ro.set(0,F(diss,0)+" g"); ro.set(1,F(rho,0)+" g/L"); ro.set(2,F(lim,0)+" g max");
      if(!lp0.running) lp0.play(); ro.set(3,F(dep,0)+" g"); ro.set(4,dep>0?"saturée":(Math.abs(diss-lim)<1e-9?"juste saturée":"non saturée"));
      nt.set(dep>0?"Solution saturée : seuls "+F(lim,0)+" g se dissolvent dans "+F(V*1000,0)+" mL ; les "+F(dep,0)+" g en trop restent au fond. ρ = "+F(lim,0)+" ÷ "+F(V,2)+" = "+F(rho,0)+" g/L.":"ρ = m ÷ V = "+F(diss,0)+" g ÷ "+F(V,2)+" L = <b>"+F(rho,1)+" g/L</b>.", dep>0?"warn":"ok");
    });
  }
});

/* ---------- 2 · Dilution ---------- */
var DEFIS = [
  {r0:80, rf:4, vf:250}, {r0:50, rf:10, vf:100}, {r0:120, rf:15, vf:200}, {r0:200, rf:20, vf:500}, {r0:60, rf:5, vf:300}, {r0:40, rf:8, vf:150}
];
SFA.sim({
  id:"c3-c06-dilution", ch:"c06", tag:"Défi",
  titre:"Dilution : la même masse dans un plus grand volume",
  resume:"Prélève un volume de solution mère puis complète avec de l'eau : la masse de soluté reste la même, la concentration baisse.",
  but:"Règle la concentration de la solution mère, le volume prélevé et le volume final. En mode défi, trouve le volume à prélever pour obtenir la concentration visée.",
  aRetenir:"Lors d'une dilution, la masse de soluté ne change pas : ρ₀ × V₀ = ρ₁ × V₁. On prélève V₀ de solution mère, on complète avec de l'eau jusqu'à V₁ : la concentration est divisée par le facteur de dilution V₁ ÷ V₀. Pour viser ρ₁, on prélève V₀ = ρ₁ × V₁ ÷ ρ₀.",
  piege:"On ne verse pas V₁ d'eau : on complète jusqu'au trait de jauge V₁ (volume final). Et la solution est plus pâle, mais tout le soluté prélevé dans la pipette se retrouve dans la fiole : il y en a autant qu'avant, dans un plus grand volume. Respecte les unités : mL avec mL, g/L avec g/L.",
  build:function(k,S){
    var c = k.canvas(310);
    var md = k.seg("Mode", [["libre","Libre"],["defi","Défi"]], "libre", function(){ pick(); });
    var r0 = k.slider("Concentration de la solution mère", 10, 200, 10, 80, "g/L");
    var v0 = k.slider("Volume prélevé", 0, 100, 0.5, 10, "mL");
    var vf = k.slider("Volume final de la solution fille", 50, 500, 10, 250, "mL");
    var ro = k.readouts(["Masse prélevée","Concentration finale","Facteur de dilution","Cible"]);
    var nt = k.note("","");
    var di=0; function pick(){ if(md.value==="defi"){ var d=DEFIS[di]; r0.set(d.r0); vf.set(d.vf); } }
    k.button("Défi suivant", function(){ di=(di+1)%DEFIS.length; md.set("defi"); pick(); }, true);
    var R=rng(8);
    k.draw(function(){
      if(md.value==="defi") pick();
      c.clear(); CH.bg(c); var W=c.W,H=c.H,g=c.ctx, a=r0.value, b=Math.min(v0.value,vf.value), vF=vf.value, m=a*b/1000, r1=b>0?m/vF*1000:0, fac=b>0?vF/b:Infinity;
      var shade=function(rv){ return "rgba(40,110,210,"+(0.06+0.62*Math.min(1,rv/200)).toFixed(2)+")"; };
      // bécher mère
      var bw=Math.min(90,W*0.2), by=36, bh=H-96, x1=W*0.06, x2=W*0.42, x3=W*0.74;
      beaker(c,x1,by,bw,bh,0.8,shade(a),"mère : "+F(a,0)+" g/L");
      // pipette
      var pw=22, px=x2-8, ph=bh*0.7; g.save(); g.strokeStyle="#556"; g.lineWidth=2; g.strokeRect(px,by+8,pw,ph); g.fillStyle=shade(a); g.fillRect(px+1,by+8+ph*(1-b/100),pw-2,ph*b/100); g.restore();
      T(c,F(b,1)+" mL",px+pw/2,by-8,{size:12,color:P.ink}); T(c,"prélevé",px+pw/2,by+ph+24,{size:12,color:P.grey});
      D.arrow(c,x1+bw+6,by+bh*0.45,px-4,by+bh*0.45,P.grey,1.5);
      // fiole jaugée
      var fw=Math.min(100,W*0.22), fx=x3-6;
      g.save(); g.strokeStyle="#556"; g.lineWidth=3; g.beginPath(); g.moveTo(fx+fw*0.38,by); g.lineTo(fx+fw*0.38,by+bh*0.2); g.lineTo(fx,by+bh*0.45); g.lineTo(fx,by+bh); g.lineTo(fx+fw,by+bh); g.lineTo(fx+fw,by+bh*0.45); g.lineTo(fx+fw*0.62,by+bh*0.2); g.lineTo(fx+fw*0.62,by); g.stroke(); g.restore();
      g.save(); g.beginPath(); g.moveTo(fx+1,by+bh*0.45+2); g.lineTo(fx+1,by+bh-1); g.lineTo(fx+fw-1,by+bh-1); g.lineTo(fx+fw-1,by+bh*0.45+2); g.lineTo(fx+fw*0.62-1,by+bh*0.2+4); g.lineTo(fx+fw*0.38+1,by+bh*0.2+4); g.closePath(); g.fillStyle=shade(r1); g.fill(); g.restore();
      D.line(c,fx+fw*0.34,by+bh*0.2+4,fx+fw*0.66,by+bh*0.2+4,P.red,2); T(c,"jauge "+F(vF,0)+" mL",fx+fw/2,by+bh+14,{size:12,color:P.grey});
      T(c,"fille : "+F(r1,1)+" g/L",fx+fw/2,by-10,{size:12,color:P.acc});
      // grains de soluté (mêmes nombres)
      var n=Math.round(m*6); R=rng(8); for(var i=0;i<Math.min(n,70);i++){ var u=R(),w2=R(); circ(c,x1+6+u*(bw-12),by+bh*0.25+w2*(bh*0.7),2,"#1e3f8f"); circ(c,px+4+u*(pw-8),by+8+ph*(1-b/100)+ (w2*ph*b/100*0.95),1.6,"#1e3f8f"); circ(c,fx+6+u*(fw-12),by+bh*0.48+w2*bh*0.48,2,"#1e3f8f"); }
      ro.set(0,F(m,2)+" g"); ro.set(1,b>0?F(r1,2)+" g/L":"—"); ro.set(2,b>0?"× "+F(fac,1)+" plus dilué":"—");
      if(md.value==="defi"){ var d=DEFIS[di], ok=Math.abs(r1-d.rf)<0.02; ro.set(3,F(d.rf,0)+" g/L");
        nt.set("<b>Défi "+(di+1)+" :</b> prépare <b>"+F(vf.value,0)+" mL</b> de solution à <b>"+F(d.rf,0)+" g/L</b> à partir d'une solution mère à "+F(d.r0,0)+" g/L. Quel volume prélever ?"+(ok?" ✓ Réussi : V₀ = "+F(d.rf*d.vf/d.r0,1)+" mL (ρ₁V₁ = ρ₀V₀ → "+F(d.rf,0)+" × "+d.vf+" ÷ "+d.r0+").":" Concentration actuelle : "+F(r1,2)+" g/L."), ok?"ok":"warn"); }
      else { ro.set(3,"—"); nt.set("Masse de soluté prélevée : "+F(a,0)+" g/L × "+F(b/1000,4)+" L = "+F(m,3)+" g. Elle se retrouve entièrement dans la fiole de "+F(vF,0)+" mL : ρ = "+F(m,3)+" g ÷ "+F(vF/1000,3)+" L = <b>"+F(r1,2)+" g/L</b>.",""); }
      if(v0.value>vf.value) nt.set(nt.el.innerHTML+" <br>Le volume prélevé ne peut pas dépasser le volume final.","warn");
    });
  }
});

/* ---------- 3 · Courbes de solubilité ---------- */
var CS = {
  kno3:{n:"Nitrate de potassium", t:[0,10,20,30,40,50,60,70,80,90,100], s:[13.3,20.9,31.6,45.8,63.9,85.5,110,138,169,202,246], col:P.acc},
  nacl:{n:"Chlorure de sodium (sel)", t:[0,20,40,60,80,100], s:[35.7,35.9,36.4,37.1,38.0,39.2], col:P.green},
  suc:{n:"Saccharose (sucre)", t:[0,20,40,60,80,100], s:[179,204,238,287,362,487], col:P.amber}
};
function interp(cur,x){ var t=cur.t,s=cur.s; if(x<=t[0]) return s[0]; for(var i=1;i<t.length;i++){ if(x<=t[i]) return s[i-1]+(s[i]-s[i-1])*(x-t[i-1])/(t[i]-t[i-1]); } return s[s.length-1]; }
SFA.sim({
  id:"c3-c06-solubilite", ch:"c06", tag:"Graphe",
  titre:"Courbes de solubilité : combien peut-on dissoudre à chaque température ?",
  resume:"Lis la solubilité sur la courbe, refroidis la solution et regarde les cristaux apparaître.",
  but:"Choisis un soluté, une masse ajoutée à 100 g d'eau et une température. Le point (T ; masse) indique si tout est dissous ou si des cristaux se déposent. Refroidis la solution chaude pour provoquer la cristallisation.",
  aRetenir:"La solubilité est la masse maximale de soluté qui se dissout dans une quantité d'eau donnée, à une température donnée. Elle dépend de la température : celle du nitrate de potassium augmente beaucoup, celle du sel presque pas. Sous la courbe : solution non saturée ; au-dessus : excès de soluté qui se dépose.",
  piege:"Toutes les substances ne se comportent pas pareil : refroidir une solution salée ne fait presque pas cristalliser le sel. Ici la solubilité est exprimée en g pour 100 g d'eau (valeurs arrondies de tables). Le sucre dépasse 260 g/100 g d'eau à partir d'environ 50 °C et sort du graphe.",
  build:function(k,S){
    var c = k.canvas(340);
    var su = k.select("Soluté", Object.keys(CS).map(function(i){return [i,CS[i].n];}), "kno3");
    var tm = k.slider("Température", 0, 100, 1, 60, "°C");
    var ma = k.slider("Masse de soluté pour 100 g d'eau", 0, 250, 5, 100, "g");
    var ro = k.readouts(["Solubilité à cette T","Masse dissoute","Cristaux déposés","Température de saturation"]);
    var nt = k.note("","");
    k.draw(function(){
      c.clear(); var cur=CS[su.value], T0=tm.value, m=ma.value, s=interp(cur,T0), diss=Math.min(m,s), dep=Math.max(0,m-s);
      var ax=D.axes(c,{x0:0,x1:100,y0:0,y1:260,xl:"T (°C)",yl:"g / 100 g d'eau",stepX:20,stepY:50,l:50});
      D.fn(c,ax,function(x){ return interp(cur,x); },cur.col,3);
      D.line(c,ax.X(T0),ax.Y(0),ax.X(T0),ax.Y(Math.min(260,Math.max(s,m))),P.grey,1.2,[4,4]);
      D.dot(c,ax.X(T0),ax.Y(Math.min(s,260)),5,cur.col); D.dot(c,ax.X(T0),ax.Y(m),7,dep>0?P.red:P.green); T(c,F(m,0)+" g",ax.X(T0)+10,ax.Y(m)-12,{size:12,color:dep>0?P.red:P.green,align:"left"});
      T(c,dep>0?"excès : cristaux":"non saturée",ax.X(Math.min(80,Math.max(20,T0))),ax.Y(Math.min(250,m))+(dep>0?-30:30),{size:12,color:dep>0?P.red:P.green});
      var ts=null; for(var t=0;t<=100;t+=0.1){ if(interp(cur,t)>=m-1e-9){ ts=t; break; } }
      ro.set(0,F(s,1)+" g"); ro.set(1,F(diss,1)+" g"); ro.set(2,F(dep,1)+" g"); ro.set(3,m===0?"—":(ts===null?"jamais (≤ 100 °C)":(ts<=0.05?"≤ 0 °C":F(ts,0)+" °C")));
      nt.set(dep>0?"À "+F(T0,0)+" °C, 100 g d'eau ne dissolvent que "+F(s,1)+" g : il se dépose "+F(dep,1)+" g de cristaux."+(ts!==null?" Il faudrait chauffer à "+F(ts,0)+" °C pour tout dissoudre.":" Même à 100 °C, tout ne se dissout pas."):"Tout est dissous : "+F(m,0)+" g < "+F(s,1)+" g (solubilité). "+(ts!==null&&ts>0.05&&m>0?"En refroidissant sous "+F(ts,0)+" °C, des cristaux apparaîtraient.":""), dep>0?"warn":"ok");
    });
  }
});

/* ---------- 4 · Balance de la dissolution ---------- */
SFA.sim({
  id:"c3-c06-balance", ch:"c06", tag:"Conservation",
  titre:"La balance de la dissolution : rien ne disparaît",
  resume:"Dissous du sucre dans l'eau : la masse totale ne change pas, mais le volume augmente un peu.",
  but:"Fais avancer la dissolution du sucre et lis la balance. Fais ensuite évaporer de l'eau et compare ce qui change (masse totale, concentration) et ce qui ne change pas (masse de sucre).",
  aRetenir:"Dissoudre n'est pas faire disparaître : la masse de la solution est la somme des masses de soluté et de solvant (m = m_soluté + m_eau). La masse se conserve pendant la dissolution. Si l'eau s'évapore, la masse totale diminue mais la masse de soluté reste la même : la solution devient plus concentrée.",
  piege:"Le volume de la solution n'est pas la somme exacte des volumes (le sucre ajoute un peu de volume, ≈ 0,62 mL par gramme) : on ne confond pas masse (qui s'additionne) et volume. Et « le sucre a disparu » est faux : il est dispersé en molécules entre les molécules d'eau. Solubilité du sucre à 20 °C : ≈ 204 g pour 100 g d'eau.",
  build:function(k,S){
    var c = k.canvas(340);
    var ms = k.slider("Masse de sucre", 5, 100, 5, 40, "g");
    var me = k.slider("Masse d'eau", 100, 400, 50, 200, "g");
    var av = k.slider("Avancement de la dissolution", 0, 100, 1, 40, "%");
    var ev = k.slider("Eau évaporée (bécher ouvert, après dissolution)", 0, 60, 5, 0, "g");
    var ro = k.readouts(["Masse sur la balance","Sucre dissous","Volume de la solution","Concentration ρ"]);
    var nt = k.note("","");
    var R=rng(13), pts=[]; for(var i=0;i<140;i++) pts.push([R(),R()]);
    var lp = k.loop(function(dt){ var v=av.value+dt*25; if(v>=100){ v=100; lp.pause(); } av.set(v); k.redraw(); });
    k.button("Dissoudre", function(){ av.set(0); lp.play(); }, true);
    k.draw(function(){
      c.clear(); CH.bg(c); var W=c.W,H=c.H,g=c.ctx, m=ms.value, we=me.value, e=ev.value, w=we-e, p=av.value/100;
      var evap = p>=0.999 ? e : 0, total=m+we-evap; w=we-evap;   /* l'évaporation n'intervient qu'une fois la dissolution terminée */
      var cap=2.04*w, dissMax=Math.min(m,cap), diss=dissMax*p, left=m-diss;
      var V=(w/0.998)+0.62*diss, rho=diss/V*1000;
      // balance
      var bx=W*0.08, bw=W*0.5, by=H-60;
      rr(c,bx,by,bw,34,"#cfd6e0","#6b7686",2,8); rr(c,bx+bw*0.2,by+6,bw*0.6,22,"#1e2a3a",null,0,4); T(c,F(total,1)+" g",bx+bw/2,by+17,{size:15,color:"#7cf0a5"});
      D.line(c,bx+bw*0.12,by,bx+bw*0.88,by,"#6b7686",5);
      var gx=bx+bw*0.22, gw=bw*0.56, gh=H-110, gy=by-gh, lv=Math.min(0.9,(V/700)+0.08);
      var tint=0.05+0.45*Math.min(1,rho/600);
      beaker(c,gx,gy,gw,gh,lv,"rgba(120,170,220,"+(0.18+tint*0.4).toFixed(2)+")","");
      var lt=gy+gh*(1-lv); pts.forEach(function(q,i){ if(i<diss*1.2){ circ(c,gx+6+q[0]*(gw-12),lt+6+q[1]*(gy+gh-lt-12),2.3,"#f2d9a6","#c9a45c",0.6); } });
      var ncr=Math.min(60,Math.round(left*1.3)); for(var j=0;j<ncr;j++){ var q=pts[j]; circ(c,gx+6+q[0]*(gw-12),gy+gh-5-q[1]*14,2.6,"#fff","#c9a45c",1); }
      // texte à droite
      var tx=W*0.62; T(c,"sucre : "+F(m,0)+" g",tx,28,{size:12,color:P.ink,align:"left"}); T(c,"+ eau : "+F(we,0)+" g",tx,46,{size:12,color:P.ink,align:"left"});
      T(c,"= "+F(m+we,0)+" g au départ",tx,64,{size:12,color:P.acc,align:"left"});
      T(c,"Balance maintenant :",tx,100,{size:12,color:P.ink,align:"left"}); T(c,F(total,1)+" g",tx,122,{size:15,color:p>=0.999&&e>0?P.red:P.green,align:"left"});
      T(c,evap>0?"(−"+F(evap,0)+" g d'eau évaporés)":"masse conservée !",tx,142,{size:12,color:P.grey,align:"left"});
      ro.set(0,F(total,1)+" g"); ro.set(1,F(diss,1)+" g"+(left>0.05?" ("+F(left,1)+" g non dissous)":"")); ro.set(2,F(V,0)+" mL"); ro.set(3,F(rho,0)+" g/L");
      nt.set(evap>0?"L'eau a perdu "+F(evap,0)+" g : la balance baisse, mais le sucre dissous ("+F(diss,0)+" g) n'a pas bougé. Le volume diminue, ρ = "+F(diss,0)+" ÷ "+F(V/1000,3)+" = "+F(rho,0)+" g/L : plus concentré."+(left>0.05?" Attention : il n'y a plus assez d'eau, il reste "+F(left,1)+" g de sucre non dissous (saturation).":""):(p<0.999?"Pendant la dissolution la balance indique toujours "+F(total,1)+" g : la masse se conserve.":"Dissolution terminée : "+F(total,1)+" g = "+F(m,0)+" g + "+F(we,0)+" g. Le volume est de "+F(V,0)+" mL, un peu plus que "+F(we/0.998,0)+" mL d'eau seule."),evap>0?"warn":"ok");
    });
  }
});
})();
