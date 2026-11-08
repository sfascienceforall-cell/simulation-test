/* Chimie BA1 · compléments · chapitre 7 : cinétique et mécanismes */
(function(){
var P = function(){ return SFA.draw.palette; };
var R = 8.314;

/* ---------- 1. Vitesses initiales : ordres partiels ---------- */
var SCEN = {
  A:{m:1,n:1,k:0.50,u:"L/(mol·s)"},
  B:{m:2,n:1,k:12,u:"L²/(mol²·s)"},
  C:{m:1,n:0,k:0.030,u:"s⁻¹"},
  D:{m:0,n:2,k:0.80,u:"L/(mol·s)"}
};
var EXP = [[0.10,0.10],[0.20,0.10],[0.10,0.30],[0.30,0.20]];
var NOISE = [1.000,1.012,0.991,1.007];
SFA.sim({
  id:"uc-c07-vitesses-initiales", ch:"c07", tag:"Méthode des vitesses initiales",
  titre:"Trouver les ordres partiels dans un tableau d’expériences",
  resume:"Quatre expériences, une loi de vitesse cachée : double une concentration, regarde v, déduis l’ordre.",
  but:"Choisis une réaction. Clique deux lignes du tableau pour les comparer : si une seule concentration change, le rapport des vitesses donne l'ordre. Puis vérifie ta loi sur les 4 expériences et lis k.",
  aRetenir:"Quand [A] est multipliée par r et [B] ne change pas, v est multipliée par r<sup>m</sup> : m = log(v₂/v₁)/log r. L’ordre se lit dans le tableau, JAMAIS dans l’équation bilan. k se calcule ensuite : k = v/([A]<sup>m</sup>[B]<sup>n</sup>).",
  piege:"Erreurs classiques : comparer deux expériences où DEUX concentrations ont changé (comme 1 et 4), ou déduire l’ordre des coefficients stœchiométriques. Une vitesse insensible à [B] signifie ordre 0 en B (pas « ordre 1 »).",
  build:function(k,S){
    var c = k.canvas(350);
    var sc = k.seg("Réaction",[["A","A"],["B","B"],["C","C"],["D","D"]],"A", function(){ pick = []; });
    var gm = k.seg("Ordre supposé en A",[[0,"0"],[1,"1"],[2,"2"]],1);
    var gn = k.seg("Ordre supposé en B",[[0,"0"],[1,"1"],[2,"2"]],1);
    var meth = k.toggle("Montrer la méthode des rapports",false);
    var ro = k.readouts(["k calculé","Écart maximal prédiction/mesure"]);
    var nt = k.note("","");
    var pick = [], rows = [];
    var SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹";
    function sciT(x, d){ if (!isFinite(x) || x === 0) return "0"; var e = Math.floor(Math.log(Math.abs(x)) / Math.LN10), m = x / Math.pow(10, e); if (Math.abs(+m.toFixed(d)) >= 10){ m /= 10; e++; } if (e === 0) return m.toFixed(d).replace(".", ","); return m.toFixed(d).replace(".", ",") + "·10" + (e < 0 ? "⁻" : "") + String(Math.abs(e)).replace(/\d/g, function(q){ return SUP[q]; }); }
    c.pointer(function(type, p){ if (type !== "down") return; rows.forEach(function(r){ if (p.y >= r.y && p.y <= r.y + r.h){ var ix = pick.indexOf(r.i); if (ix >= 0) pick.splice(ix, 1); else { if (pick.length >= 2) pick.shift(); pick.push(r.i); } k.redraw(); } }); });
    function vexp(i){ var s=SCEN[sc.value]; return s.k*Math.pow(EXP[i][0],s.m)*Math.pow(EXP[i][1],s.n)*NOISE[i]; }
    k.draw(function(){
      var s=SCEN[sc.value], ctx=c.ctx, W=c.W, ph=W<420, Pl=S.draw.palette;
      UC.bg(c, "#f6f9fc", "#ffffff");
      var cols=ph?[W*0.07,W*0.2,W*0.34,W*0.56,W*0.82]:[W*0.06,W*0.18,W*0.32,W*0.54,W*0.82], y0=26, dy=38;
      var heads=ph?["Exp.","[A]","[B]","v mesurée","v prédite"]:["Exp.","[A] (mol/L)","[B] (mol/L)","v mesurée (mol/(L·s))","v prédite"];
      ctx.save(); ctx.fillStyle="#e8eef7"; S.draw.rrect(c,6,y0-17,W-12,34,8); ctx.fill(); ctx.restore();
      heads.forEach(function(h,j){ S.draw.text(c,h,cols[j],y0,{size:ph?10.5:11.5,color:Pl.acc,weight:800}); });
      var maxerr=0, kk=[], vmax=0, v;
      for (var i=0;i<4;i++){ v=vexp(i); vmax=Math.max(vmax,v); }
      rows=[];
      for (i=0;i<4;i++){
        var y=y0+dy*(i+1)-16, v1=vexp(i), pred=Math.pow(EXP[i][0],gm.value)*Math.pow(EXP[i][1],gn.value), on=pick.indexOf(i)>=0;
        kk.push(v1/pred); rows.push({i:i,y:y,h:dy-4});
        ctx.save(); ctx.fillStyle=on?"rgba(244,197,66,.28)":(i%2?"#f3f6fa":"#ffffff"); ctx.strokeStyle=on?Pl.amber:"#e3e7ed"; ctx.lineWidth=on?2.2:1; S.draw.rrect(c,6,y,W-12,dy-4,8); ctx.fill(); ctx.stroke(); ctx.restore();
        var cy2=y+(dy-4)/2;
        S.draw.text(c,String(i+1),cols[0],cy2,{size:13,weight:800});
        /* concentrations en pastilles de hauteur ∝ valeur */
        S.draw.text(c,S.fmt(EXP[i][0],2),cols[1],cy2,{size:12.5,math:true});
        S.draw.text(c,S.fmt(EXP[i][1],2),cols[2],cy2,{size:12.5,math:true});
        S.draw.text(c,sciT(v1,3),cols[3]-6,cy2-5,{size:12.5,math:true});
        ctx.save(); ctx.fillStyle="#d8e2f2"; S.draw.rrect(c,cols[3]-34,cy2+6,68,5,2.5); ctx.fill(); ctx.fillStyle=Pl.acc; S.draw.rrect(c,cols[3]-34,cy2+6,Math.max(3,68*v1/vmax),5,2.5); ctx.fill(); ctx.restore();
      }
      var kbar=kk[0];
      for (i=0;i<4;i++){ var v2=vexp(i), pr=kbar*Math.pow(EXP[i][0],gm.value)*Math.pow(EXP[i][1],gn.value), e=Math.abs(pr-v2)/v2; maxerr=Math.max(maxerr,e); S.draw.text(c,sciT(pr,3),cols[4],y0+dy*(i+1)-16+(dy-4)/2,{size:12.5,math:true,color:e<0.03?Pl.green:Pl.red,weight:800}); }
      /* comparaison de deux lignes choisies */
      var py=y0+dy*5+4;
      S.draw.panel(c,6,py,W-12,c.H-py-8,{shadow:false,title:"Comparaison de deux expériences"});
      if (pick.length===2){
        var a=pick[0], b=pick[1], rA=EXP[b][0]/EXP[a][0], rB=EXP[b][1]/EXP[a][1], rv=vexp(b)/vexp(a), lines=[];
        lines.push("Exp. "+(a+1)+" → exp. "+(b+1)+" :  [A] × "+S.fmt(rA,2)+"   [B] × "+S.fmt(rB,2)+"   v × "+S.fmt(rv,2));
        if (Math.abs(rB-1)<1e-9 && Math.abs(rA-1)>1e-9){ lines.push("[B] constante : "+S.fmt(rA,2)+"^m = "+S.fmt(rv,2)+"  ⟹  m ≈ "+S.fmt(Math.log(rv)/Math.log(rA),2)); }
        else if (Math.abs(rA-1)<1e-9 && Math.abs(rB-1)>1e-9){ lines.push("[A] constante : "+S.fmt(rB,2)+"^n = "+S.fmt(rv,2)+"  ⟹  n ≈ "+S.fmt(Math.log(rv)/Math.log(rB),2)); }
        else lines.push("Les deux concentrations changent : impossible d'isoler un ordre. Choisis une autre paire.");
        lines.forEach(function(t,j){ S.draw.text(c,t,16,py+36+j*20,{size:ph?10.5:12,align:"left",color:j===1&&/impossible/.test(t)?Pl.red:Pl.violet,weight:700}); });
      } else S.draw.text(c,"Clique deux lignes du tableau pour les comparer :",16,py+38,{size:ph?10.5:12,align:"left",color:Pl.grey,weight:700}); S.draw.text(c,"idéalement une paire où une seule concentration change.",16,py+58,{size:ph?10.5:12,align:"left",color:Pl.grey,weight:700});
      if (meth.value){ var r1=vexp(1)/vexp(0), r2=vexp(2)/vexp(0);
        S.draw.text(c,"Exp. 2/1 : 2^m = "+S.fmt(r1,2)+" ⟹ m ≈ "+S.fmt(Math.log(r1)/Math.log(2),2)+"   ·   exp. 3/1 : 3^n = "+S.fmt(r2,2)+" ⟹ n ≈ "+S.fmt(Math.log(r2)/Math.log(3),2),16,py+80,{size:ph?10:11.5,align:"left",color:Pl.green,weight:800}); }
      ro.set(0,sciT(kbar,3)+" (unité adaptée)"); ro.set(1,S.fmt(maxerr*100,1)+" %");
      if (maxerr<0.03) nt.set("Ta loi v = k[A]<sup>"+gm.value+"</sup>[B]<sup>"+gn.value+"</sup> reproduit les 4 mesures (écart &lt; 3 %, bruit expérimental ≈ 1 %). Ordre global = "+(gm.value+gn.value)+".","ok");
      else nt.set("Ta loi ne reproduit pas toutes les mesures : revois l’ordre d’un des deux réactifs.","warn");
    });
  }
});

/* ---------- 2. Mécanismes et étape déterminante ---------- */
var MECA = {
  no:{ bilan:"2 NO + O₂ → 2 NO₂", s1:"2 NO ⇌ N₂O₂", s2:"N₂O₂ + O₂ → 2 NO₂", xs:[["NO",2],["O₂",1]],
       l1:"v = k₁[NO]²  (étape 1 lente : l’O₂ n’intervient pas)", l2:"v = k₂K[NO]²[O₂]  (pré-équilibre rapide, K = k₁/k₋₁)",
       f1:function(a){ return a.NO*a.NO; }, f2:function(a){ return a.NO*a.NO*a.O2; }, i:"N₂O₂" },
  o3:{ bilan:"2 O₃ → 3 O₂", s1:"O₃ ⇌ O₂ + O", s2:"O + O₃ → 2 O₂", xs:[["O₃",1],["O₂",1]],
       l1:"v = k₁[O₃]  (étape 1 lente et irréversible)", l2:"v = k₂K[O₃]²/[O₂]  (pré-équilibre ; O₂ est un inhibiteur)",
       f1:function(a){ return a.O3; }, f2:function(a){ return a.O3*a.O3/a.O2; }, i:"O" },
  sn:{ bilan:"(CH₃)₃CBr + OH⁻ → (CH₃)₃COH + Br⁻", s1:"(CH₃)₃CBr ⇌ (CH₃)₃C⁺ + Br⁻", s2:"(CH₃)₃C⁺ + OH⁻ → (CH₃)₃COH", xs:[["RBr",1],["OH⁻",1]],
       l1:"v = k₁[RBr]  (SN1 : ionisation lente, [OH⁻] sans effet)", l2:"v = k₂K[RBr][OH⁻]/[Br⁻]  (cas hypothétique : si l’attaque du carbocation était lente, Br⁻ ralentirait la réaction ; ce n’est PAS une SN2, qui se fait en une seule étape concertée et donne v = k[RBr][OH⁻])",
       f1:function(a){ return a.RBr; }, f2:function(a){ return a.RBr*a.OH/a.Br; }, i:"(CH₃)₃C⁺" }
};
SFA.sim({
  id:"uc-c07-mecanisme-etape-lente", ch:"c07", tag:"Mécanismes",
  titre:"Mécanisme en deux étapes : quelle est l’étape lente ?",
  resume:"La loi de vitesse expérimentale dépend de l’étape déterminante ; lis-la sur le profil d’énergie.",
  but:"Choisis un mécanisme et l’étape lente : le profil énergétique, la loi de vitesse et l’effet d’un changement de concentration s’affichent. Vérifie que la somme des étapes redonne le bilan.",
  aRetenir:"La loi de vitesse est celle de l’étape LENTE (plus haute barrière). Un intermédiaire n’apparaît ni dans le bilan ni dans la loi finale : on l’élimine par un pré-équilibre rapide. Les ordres du mécanisme doivent concorder avec l’expérience.",
  piege:"Lire les ordres dans les coefficients du bilan (2 NO + O₂ → ordre 3 ?) : un bilan n’est pas une étape élémentaire. Un mécanisme n’est jamais « prouvé », seulement compatible avec la loi de vitesse mesurée.",
  build:function(k,S){
    var c = k.canvas(0, {ratio:1.2});
    var m = k.seg("Mécanisme",[["no","NO + O₂"],["o3","Ozone"],["sn","SN1 (bromure de tert-butyle)"]],"no");
    var sl = k.seg("Étape lente",[["1","Étape 1"],["2","Étape 2"]],"2");
    var fa = k.slider("Facteur sur la 1<sup>re</sup> concentration",0.5,4,0.5,2,"×");
    var fb = k.slider("Facteur sur la 2<sup>e</sup> concentration",0.5,4,0.5,1,"×");
    var ro = k.readouts(["v / v₀"]);
    var nt = k.note("","");
    k.button("Rejouer", function(){ tm = 0; lp.play(); });
    var tm = 0, key = "";
    var lp = k.loop(function(dt){ tm += dt * 1.6; if (tm > 14) tm = 14; k.redraw(); }); lp.play();
    k.draw(function(){
      var d=MECA[m.value], slow=sl.value, W=c.W, H=c.H, ctx=c.ctx, Pl=P(), sh=Math.round(H*0.5);
      if (key !== m.value + slow){ key = m.value + slow; tm = 0; lp.play(); }
      UC.bg(c, "#f8fafd", "#ffffff");
      /* populations : R → I (k1) → P (k2) */
      var k1 = slow==="1" ? 0.3 : 3, k2 = slow==="2" ? 0.3 : 3, T = Math.min(tm, 10);
      function pops(t){ var R_ = Math.exp(-k1 * t), I_ = k1 / (k2 - k1) * (Math.exp(-k1 * t) - Math.exp(-k2 * t)); return [R_, I_, Math.max(0, 1 - R_ - I_)]; }
      var pp = pops(T);
      var e1 = slow==="1"?90:45, e2 = slow==="2"?95:40;
      var X=function(t){ return 40+t/4*(W-70); }, Y=function(e){ return sh-30-(e+25)/150*(sh-52); };
      ctx.save(); ctx.strokeStyle="#8a95a3"; ctx.lineWidth=1.2; ctx.beginPath(); ctx.moveTo(32,8); ctx.lineTo(32,sh-18); ctx.lineTo(W-10,sh-18); ctx.stroke(); ctx.restore();
      S.draw.text(c,"énergie",36,10,{size:10.5,align:"left",color:Pl.grey}); S.draw.text(c,"coordonnée de réaction",W-10,sh-6,{size:10,align:"right",color:Pl.grey});
      ctx.save(); ctx.strokeStyle=Pl.acc; ctx.lineWidth=2.8; ctx.beginPath();
      function hill(xa,ya,xb,yb,top){ for (var i=0;i<=40;i++){ var u=i/40, x=xa+(xb-xa)*u, y=ya+(yb-ya)*(3*u*u-2*u*u*u)+(top-(ya+yb)/2)*Math.sin(Math.PI*u); var px=X(x), py=Y(y); if (i===0&&xa===0) ctx.moveTo(px,py); else ctx.lineTo(px,py); } }
      hill(0,0,2,25,e1); hill(2,25,4,-20,25+e2); ctx.stroke(); ctx.restore();
      var st3 = [[0,0,"#c0321d"],[2,25,"#c26a0c"],[4,-20,"#24775a"]];
      st3.forEach(function(s3, i){ var r = 3 + 16 * Math.sqrt(pp[i]); if (pp[i] > 0.005){ S.draw.glow(c, X(s3[0]), Y(s3[1]) - r, r * 1.8, s3[2], 0.25); UC.ball(ctx, X(s3[0]), Y(s3[1]) - r, r, s3[2]); } });
      S.draw.text(c,"réactifs",X(0)+22,Y(0)+10,{size:10.5,color:Pl.ink,weight:700}); S.draw.text(c,d.i,X(2),Y(25)+12,{size:10.5,color:Pl.ink,weight:700,math:true}); S.draw.text(c,"produits",X(4)-20,Y(-20)+10,{size:10.5,color:Pl.ink,weight:700});
      S.draw.label(c,slow==="1"?"TS₁ : LENTE":"TS₁",X(1),Y(e1)-14,{size:10.5,color:slow==="1"?Pl.red:Pl.grey});
      S.draw.label(c,slow==="2"?"TS₂ : LENTE":"TS₂",X(3),Y(25+e2)-14,{size:10.5,color:slow==="2"?Pl.red:Pl.grey});
      /* cinétique : fractions de R, I, P au cours du temps */
      var c2 = {ctx:ctx, W:W, H:H - sh, clear:function(){}};
      ctx.save(); ctx.translate(0, sh);
      var ax = S.draw.axes(c2, {x0:0,x1:10,y0:0,y1:1,xl:"temps",yl:"fraction",stepX:2,stepY:0.25,l:40,r:14,t:16,b:30});
      [[0,"#c0321d","réactif"],[1,"#c26a0c","intermédiaire"],[2,"#24775a","produit"]].forEach(function(sp){ S.draw.fn(c2, ax, function(t){ return pops(t)[sp[0]]; }, sp[1], 2.4); });
      S.draw.line(c2, ax.X(T), ax.T, ax.X(T), ax.B, Pl.grey, 1.2, [3,3]);
      [0,1,2].forEach(function(i2){ S.draw.dot(c2, ax.X(T), ax.Y(pp[i2]), 4.5, st3[i2][2]); });
      S.draw.legend(c2, [["#c0321d","réactif"],["#c26a0c","intermédiaire"],["#24775a","produit"]], ax.R - 4, ax.T + 4, {align:"right"});
      ctx.restore();
      var a = m.value==="o3" ? {O3:fa.value,O2:fb.value} : m.value==="sn" ? {RBr:fa.value,OH:fb.value,Br:1} : {NO:fa.value,O2:fb.value};
      var ratio = slow==="1" ? d.f1(a) : d.f2(a);
      ro.set(0,"× "+S.fmt(ratio,2));
      var first=m.value==="no"?"[NO]":m.value==="o3"?"[O₃]":"[RBr]", second=m.value==="no"?"[O₂]":m.value==="o3"?"[O₂]":"[OH⁻]";
      nt.set("<b>Bilan :</b> "+d.bilan+"<br><b>Étape 1 :</b> "+d.s1+"<br><b>Étape 2 :</b> "+d.s2+"<br><b>Somme :</b> les étapes s’additionnent et l’intermédiaire "+d.i+" disparaît.<br><b>Loi :</b> "+(slow==="1"?d.l1:d.l2)+"<br>Tu as multiplié "+first+" par "+S.fmt(fa.value,1)+" et "+second+" par "+S.fmt(fb.value,1)+"."+(slow==="2"?" <i>Étape 2 lente : l’intermédiaire s’accumule (courbe orange) avant de se transformer.</i>":" <i>Étape 1 lente : l’intermédiaire est consommé dès qu’il se forme (il reste rare).</i>"),"");
    });
  }
});

/* ---------- 3. Arrhenius linéaire ---------- */
SFA.sim({
  id:"uc-c07-arrhenius-lineaire", ch:"c07", tag:"Énergie d’activation",
  titre:"Arrhenius : la droite ln k contre 1/T",
  resume:"Pente = −Ea/R. Compare k à deux températures, avec ou sans catalyseur.",
  but:"Règle Ea, le facteur de fréquence et deux températures : ln k est une droite en 1/T. Tu peux aussi glisser les points T₁ et T₂ sur la droite. Le catalyseur abaisse Ea : la pente est moins raide.",
  aRetenir:"k = A·e<sup>−Ea/RT</sup> ; ln k = ln A − (Ea/R)(1/T) ; ln(k₂/k₁) = (Ea/R)(1/T₁ − 1/T₂). Une grande Ea rend la vitesse très sensible à T.",
  piege:"Ea en kJ/mol mais R en J/(mol·K) : convertir. T en kelvins. « Ça double tous les 10 K » n’est qu’une règle empirique (valable pour Ea ≈ 50 kJ/mol vers 300 K).",
  build:function(k,S){
    var c = k.canvas(380);
    var ea = k.slider("Énergie d’activation Ea",20,200,5,60,"kJ/mol");
    var la = k.slider("log₁₀ A",5,16,0.5,10,"");
    var t1 = k.slider("Température T₁",270,400,5,298,"K");
    var t2 = k.slider("Température T₂",270,400,5,310,"K");
    var cat = k.toggle("Catalyseur (Ea − 30 kJ/mol)",false);
    var ro = k.readouts(["k(T₁)","k(T₂)","k₂/k₁","× par +10 K à T₁"]);
    var geo = {}, dr = null;
    function E(){ return Math.max(5,ea.value-(cat.value?30:0)); }
    function lnk(T){ return la.value*Math.LN10-E()*1000/(R*T); }
    c.pointer(function(type,p){
      if (type==="down" && geo.ax){ var d1=Math.hypot(p.x-geo.p1[0],p.y-geo.p1[1]), d2=Math.hypot(p.x-geo.p2[0],p.y-geo.p2[1]); dr = d1<26&&d1<=d2 ? t1 : d2<26 ? t2 : null; }
      if (type==="up") dr=null;
      if (dr && (type==="drag"||type==="down")){ var u=geo.ax.ix(p.x); dr.set(Math.round(1000/Math.max(2.5,Math.min(3.7,u))/5)*5); k.redraw(); }
    });
    k.draw(function(){
      var Pl=S.draw.palette, ctx=c.ctx;
      UC.bg(c,"#f6f9fc","#ffffff");
      var Ea0=ea.value, v=[], T;
      for (T=270;T<=400;T+=130){ v.push(la.value*Math.LN10-E()*1000/(R*T)); v.push(la.value*Math.LN10-Ea0*1000/(R*T)); }
      var lo=Math.floor(Math.min.apply(null,v)-2), hi=Math.ceil(Math.max.apply(null,v)+2);
      var ax=S.draw.axes(c,{x0:2.4,x1:3.8,y0:lo,y1:hi,xl:"1000/T (K⁻¹)",yl:"ln k",stepX:0.2,l:50});
      geo.ax=ax;
      if (cat.value){ S.draw.fn(c,ax,function(u){ return la.value*Math.LN10-Ea0*1000/(R*1000/u); },Pl.grey,2,[5,4]); S.draw.text(c,"sans catalyseur",ax.X(3.35),ax.Y(la.value*Math.LN10-Ea0*1000/(R*298))-12,{size:10.5,color:Pl.grey,weight:700}); }
      S.draw.fn(c,ax,function(u){ return lnk(1000/u); },cat.value?Pl.green:Pl.acc,3.2);
      var pts=[[t1.value,Pl.red,"T₁"],[t2.value,Pl.amber,"T₂"]];
      /* construction de Δ(ln k) entre T1 et T2 */
      var X1=ax.X(1000/t1.value),Y1=ax.Y(lnk(t1.value)),X2=ax.X(1000/t2.value),Y2=ax.Y(lnk(t2.value));
      ctx.save(); ctx.strokeStyle="#94a3b8"; ctx.setLineDash([4,3]); ctx.lineWidth=1.2; ctx.beginPath(); ctx.moveTo(X1,Y1); ctx.lineTo(X2,Y1); ctx.lineTo(X2,Y2); ctx.stroke(); ctx.restore();
      geo.p1=[X1,Y1]; geo.p2=[X2,Y2];
      pts.forEach(function(p,i){ var x=ax.X(1000/p[0]), y=ax.Y(lnk(p[0])); S.draw.dot(c,x,y,8,p[1]); S.draw.label(c,p[2]+" = "+p[0]+" K",x,y+(i?-18:18),{color:p[1],size:11}); });
      S.draw.label(c,"pente = −Ea/R = "+S.fmt(-E()*1000/R/1000,2)+" ·10³ K",ax.R-8,ax.T+14,{align:"right",size:12,color:cat.value?Pl.green:Pl.acc});
      S.draw.text(c,"glisse T₁ / T₂ sur la droite",ax.L+8,ax.B-12,{size:10.5,align:"left",color:Pl.grey,weight:700});
      var k1=Math.exp(lnk(t1.value)), k2=Math.exp(lnk(t2.value)), k3=Math.exp(lnk(t1.value+10));
      function sciT(x,d){ if (!isFinite(x)||x===0) return "0"; var e=Math.floor(Math.log(Math.abs(x))/Math.LN10), m=x/Math.pow(10,e); if (Math.abs(+m.toFixed(d))>=10){ m/=10; e++; } return e===0?m.toFixed(d).replace(".",","):m.toFixed(d).replace(".",",")+"·10"+(e<0?"⁻":"")+String(Math.abs(e)).replace(/\d/g,function(q){ return "⁰¹²³⁴⁵⁶⁷⁸⁹"[q]; }); }
      ro.set(0,S.sci(k1,2)); ro.set(1,S.sci(k2,2)); ro.set(2,"× "+S.sci(k2/k1,2)); ro.set(3,"× "+S.fmt(k3/k1,2));
    });
    k.note("k est affichée dans l’unité propre à l’ordre de la réaction (ici, valeur numérique seule). Courbe grise en pointillés : sans catalyseur.","");
  }
});

/* ---------- 4. Pharmacocinétique : doses répétées ---------- */
SFA.sim({
  id:"uc-c07-pharmacocinetique", ch:"c07", tag:"Cinétique d’ordre 1 et médecine",
  titre:"Doses répétées : accumulation et état d’équilibre",
  resume:"Élimination d’ordre 1, accumulation, plateau après ≈ 5 demi-vies, dose de charge.",
  but:"Règle la dose, l’intervalle, la demi-vie et le volume de distribution. Compare C<sub>max</sub> et C<sub>min</sub> à l’état d’équilibre à la fenêtre thérapeutique ; teste une dose de charge.",
  aRetenir:"k = ln 2/t<sub>½</sub>. Après n doses IV rapides : C = (D/V)Σ e<sup>−k(t−tᵢ)</sup>. À l’état d’équilibre : C<sub>max</sub> = (D/V)/(1 − e<sup>−kτ</sup>) et C<sub>min</sub> = C<sub>max</sub>·e<sup>−kτ</sup>. Facteur d’accumulation 1/(1 − e<sup>−kτ</sup>) ; plateau après ≈ 4 à 5 t<sub>½</sub>.",
  piege:"Modèle monocompartimental, injection IV instantanée, élimination d’ordre 1 (pas de saturation). Un médicament éliminé selon un ordre 0 (alcool, phénytoïne à forte dose) s’accumule de façon bien plus dangereuse.",
  build:function(k,S){
    var c = k.canvas(320);
    var D = k.slider("Dose D",100,1000,50,500,"mg");
    var V = k.slider("Volume de distribution V",10,100,5,40,"L");
    var th = k.slider("Demi-vie t½",1,24,0.5,6,"h");
    var tau = k.slider("Intervalle τ",2,24,1,8,"h");
    var minS = k.slider("Seuil d’efficacité",1,20,0.5,8,"mg/L");
    var maxS = k.slider("Seuil de toxicité",10,60,1,25,"mg/L");
    var load = k.toggle("Dose de charge (1<sup>re</sup> dose × facteur d’accumulation)",false);
    var ro = k.readouts(["C<sub>max</sub> équilibre","C<sub>min</sub> équilibre","Facteur d’accumulation","Plateau atteint vers"]);
    var nt = k.note("","");
    k.draw(function(){
      c.clear();
      var kk=Math.LN2/th.value, e=Math.exp(-kk*tau.value), Rr=1/(1-e);
      var nd=Math.min(16,Math.max(6,Math.ceil(5*th.value/tau.value)+2)), Tm=nd*tau.value;
      function C(t){ var s=0; for (var i=0;i<nd;i++){ var ti=i*tau.value; if (t>=ti){ var d=(i===0&&load.value)?D.value*Rr:D.value; s+=d/V.value*Math.exp(-kk*(t-ti)); } } return s; }
      var cmaxss=D.value/V.value*Rr, cminss=cmaxss*e;
      var ymax=Math.max(maxS.value*1.15,cmaxss*1.15,(load.value?D.value*Rr/V.value*1.1:0));
      var ax=S.draw.axes(c,{x0:0,x1:Tm,y0:0,y1:ymax,xl:"t (h)",yl:"C (mg/L)",l:50});
      var ctx=c.ctx; ctx.save(); ctx.fillStyle="rgba(46,107,85,.10)"; ctx.fillRect(ax.L,ax.Y(maxS.value),ax.R-ax.L,ax.Y(minS.value)-ax.Y(maxS.value)); ctx.restore();
      S.draw.line(c,ax.L,ax.Y(minS.value),ax.R,ax.Y(minS.value),P().green,1.6,[5,4]); S.draw.line(c,ax.L,ax.Y(maxS.value),ax.R,ax.Y(maxS.value),P().red,1.6,[5,4]);
      S.draw.text(c,"fenêtre thérapeutique",ax.R-8,ax.Y(maxS.value)+11,{size:11,color:P().green,align:"right"});
      S.draw.fn(c,ax,C,P().acc,2.4);
      ro.set(0,S.fmt(cmaxss,1)+" mg/L"); ro.set(1,S.fmt(cminss,1)+" mg/L"); ro.set(2,"× "+S.fmt(Rr,2)); ro.set(3,S.fmt(4.5*th.value,0)+" h");
      var m="";
      if (cmaxss>maxS.value && cminss<minS.value) m="Fenêtre trop étroite : Cmax dépasse le seuil toxique ET Cmin passe sous le seuil d’efficacité. Fractionner la dose (τ plus court, D plus petite).";
      else if (cmaxss>maxS.value) m="Cmax à l’équilibre dépasse le seuil de toxicité : réduire la dose ou espacer les prises.";
      else if (cminss<minS.value) m="Cmin à l’équilibre sous le seuil d’efficacité : augmenter la dose ou raccourcir τ ; une dose de charge accélère l’entrée dans la fenêtre.";
      else m="Les valeurs d’équilibre restent dans la fenêtre thérapeutique.";
      nt.set(m,(cmaxss>maxS.value||cminss<minS.value)?"warn":"ok");
    });
  }
});

/* ---------- 5. Michaelis-Menten et inhibition ---------- */
SFA.sim({
  id:"uc-c07-michaelis-menten", ch:"c07", tag:"Enzymes",
  titre:"Michaelis-Menten et inhibiteurs",
  resume:"v en fonction de [S], saturation, Km, inhibition compétitive ou non compétitive, double inverse.",
  but:"Fais varier [S], Vmax, Km et l’inhibiteur. Compare la courbe directe et le tracé de Lineweaver-Burk : un inhibiteur compétitif change la pente mais pas l’ordonnée à l’origine.",
  aRetenir:"v = Vmax[S]/(Km + [S]). v = Vmax/2 quand [S] = Km. Compétitif : Km apparent = Km(1 + [I]/Ki), Vmax inchangée. Non compétitif : Vmax apparent = Vmax/(1 + [I]/Ki), Km inchangé. Lineweaver-Burk : 1/v = (Km/Vmax)(1/[S]) + 1/Vmax.",
  piege:"Vmax n’est jamais « atteinte » : v tend vers Vmax. Le tracé 1/v amplifie l’erreur des faibles concentrations. Pour [S] ≪ Km, la cinétique est d’ordre 1 ; pour [S] ≫ Km, d’ordre 0.",
  build:function(k,S){
    var c = k.canvas(320);
    var mode = k.seg("Tracé",[["d","v contre [S]"],["i","1/v contre 1/[S]"]],"d");
    var vm = k.slider("Vmax",10,100,5,60,"µmol/(L·min)");
    var km = k.slider("Km",0.2,10,0.2,2,"mmol/L");
    var s = k.slider("[S]",0.1,30,0.1,4,"mmol/L");
    var inh = k.seg("Inhibiteur",[["0","aucun"],["c","compétitif"],["n","non compétitif"]],"0");
    var ci = k.slider("[I] (Ki = 1 mmol/L)",0,5,0.25,2,"mmol/L");
    var ro = k.readouts(["v à cette [S]","v / Vmax","Km apparent","Vmax apparent"]);
    function par(){ var a=inh.value==="0"?0:ci.value; var kma=km.value*(inh.value==="c"?1+a:1), vma=vm.value/(inh.value==="n"?1+a:1); return {km:kma,vm:vma}; }
    k.draw(function(){
      c.clear(); var p=par();
      if (mode.value==="d"){
        var ax=S.draw.axes(c,{x0:0,x1:30,y0:0,y1:vm.value*1.1,xl:"[S] (mmol/L)",yl:"v",stepX:5,l:50});
        S.draw.fn(c,ax,function(x){ return vm.value*x/(km.value+x); },P().grey,1.8,[5,4]);
        S.draw.fn(c,ax,function(x){ return p.vm*x/(p.km+x); },P().acc,2.8);
        S.draw.line(c,ax.L,ax.Y(p.vm/2),ax.X(p.km),ax.Y(p.vm/2),P().amber,1.4,[3,4]); S.draw.line(c,ax.X(p.km),ax.Y(p.vm/2),ax.X(p.km),ax.B,P().amber,1.4,[3,4]);
        S.draw.text(c,"Km apparent",ax.X(p.km),ax.B-10,{size:11,color:P().amber,bg:"#fff"});
        S.draw.dot(c,ax.X(s.value),ax.Y(p.vm*s.value/(p.km+s.value)),6,P().red);
      } else {
        var ln0=function(x){ return km.value/vm.value*x+1/vm.value; }, ln1=function(x){ return p.km/p.vm*x+1/p.vm; };
        var x0=-1.3/km.value, x1=5;
        var yy0=Math.min(ln0(x0),ln1(x0),0), yy1=Math.max(ln0(x1),ln1(x1))*1.1;
        var ax2=S.draw.axes(c,{x0:x0,x1:x1,y0:yy0*1.1,y1:yy1,xl:"1/[S] (L/mmol)",yl:"1/v",l:56});
        S.draw.fn(c,ax2,function(x){ return km.value/vm.value*x+1/vm.value; },P().grey,1.8,[5,4]);
        S.draw.fn(c,ax2,function(x){ return p.km/p.vm*x+1/p.vm; },P().acc,2.8);
        S.draw.dot(c,ax2.X(0),ax2.Y(1/p.vm),5,P().green); S.draw.text(c,"1/Vmax",ax2.X(0)+30,ax2.Y(1/p.vm)+12,{size:11,color:P().green});
        S.draw.dot(c,ax2.X(-1/p.km),ax2.Y(0),5,P().amber); S.draw.text(c,"−1/Km",ax2.X(-1/p.km),ax2.Y(0)-12,{size:11,color:P().amber});
        S.draw.dot(c,ax2.X(1/s.value),ax2.Y(1/(p.vm*s.value/(p.km+s.value))),6,P().red);
      }
      var v=p.vm*s.value/(p.km+s.value);
      ro.set(0,S.fmt(v,1)+" µmol/(L·min)"); ro.set(1,S.fmt(v/vm.value*100,0)+" %"); ro.set(2,S.fmt(p.km,2)+" mmol/L"); ro.set(3,S.fmt(p.vm,1));
    });
    k.note("Courbe grise en pointillés : enzyme sans inhibiteur. Modèle simplifié (conditions de Michaelis-Menten, état quasi stationnaire).","");
  }
});
})();
