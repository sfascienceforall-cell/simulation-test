(function(){
/* Outils statistiques locaux (aucune dépendance externe) */
var ST = (function(){
  var T = {};
  T.rng = function(seed){ var a = seed >>> 0; return function(){ a = (a + 0x6D2B79F5) >>> 0; var t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
  T.randn = function(r){ var u = 0, v = 0; while (u === 0) u = r(); v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
  T.erf = function(x){ var s = x < 0 ? -1 : 1; x = Math.abs(x); var t = 1 / (1 + 0.3275911 * x);
    var y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x); return s * y; };
  T.lgam = function(x){ var c = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5];
    var y = x, t = x + 5.5; t -= (x + 0.5) * Math.log(t); var s = 1.000000000190015; for (var j = 0; j < 6; j++) s += c[j] / ++y; return -t + Math.log(2.5066282746310005 * s / x); };
  /* loi normale : cdf précise (fraction continue / série de Cody simplifiée via erfc de haute précision) */
  T.erfc = function(x){ var z = Math.abs(x), t = 1 / (1 + 0.5 * z);
    var r = t * Math.exp(-z * z - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 + t * (-0.18628806 + t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * 0.17087277))))))))); return x >= 0 ? r : 2 - r; };
  T.ncdf = function(x){ return 0.5 * T.erfc(-x / Math.SQRT2); };
  T.npdf = function(x){ return Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI); };
  T.nppf = function(p){ var lo = -10, hi = 10; for (var i = 0; i < 80; i++){ var m = (lo + hi) / 2; if (T.ncdf(m) < p) lo = m; else hi = m; } return (lo + hi) / 2; };
  function betacf(a, b, x){ var qab = a + b, qap = a + 1, qam = a - 1, c = 1, d = 1 - qab * x / qap; if (Math.abs(d) < 1e-30) d = 1e-30; d = 1 / d; var h = d;
    for (var m = 1; m <= 300; m++){ var m2 = 2 * m, aa = m * (b - m) * x / ((qam + m2) * (a + m2)); d = 1 + aa * d; if (Math.abs(d) < 1e-30) d = 1e-30; c = 1 + aa / c; if (Math.abs(c) < 1e-30) c = 1e-30; d = 1 / d; h *= d * c;
      aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2)); d = 1 + aa * d; if (Math.abs(d) < 1e-30) d = 1e-30; c = 1 + aa / c; if (Math.abs(c) < 1e-30) c = 1e-30; d = 1 / d; var del = d * c; h *= del; if (Math.abs(del - 1) < 3e-14) break; } return h; }
  T.betai = function(a, b, x){ if (x <= 0) return 0; if (x >= 1) return 1; var bt = Math.exp(T.lgam(a + b) - T.lgam(a) - T.lgam(b) + a * Math.log(x) + b * Math.log(1 - x));
    return x < (a + 1) / (a + b + 2) ? bt * betacf(a, b, x) / a : 1 - bt * betacf(b, a, 1 - x) / b; };
  T.tcdf = function(t, df){ var x = df / (df + t * t), p = 0.5 * T.betai(df / 2, 0.5, x); return t > 0 ? 1 - p : p; };
  T.tpdf = function(t, df){ return Math.exp(T.lgam((df + 1) / 2) - T.lgam(df / 2)) / Math.sqrt(df * Math.PI) * Math.pow(1 + t * t / df, -(df + 1) / 2); };
  T.tppf = function(p, df){ var lo = -200, hi = 200; for (var i = 0; i < 100; i++){ var m = (lo + hi) / 2; if (T.tcdf(m, df) < p) lo = m; else hi = m; } return (lo + hi) / 2; };
  T.gammp = function(a, x){ if (x <= 0) return 0; if (x < a + 1){ var ap = a, sum = 1 / a, del = sum; for (var n = 0; n < 500; n++){ ap++; del *= x / ap; sum += del; if (Math.abs(del) < Math.abs(sum) * 1e-15) break; } return sum * Math.exp(-x + a * Math.log(x) - T.lgam(a)); }
    var b = x + 1 - a, c = 1 / 1e-30, d = 1 / b, h = d; for (var i = 1; i < 500; i++){ var an = -i * (i - a); b += 2; d = an * d + b; if (Math.abs(d) < 1e-30) d = 1e-30; c = b + an / c; if (Math.abs(c) < 1e-30) c = 1e-30; d = 1 / d; var dl = d * c; h *= dl; if (Math.abs(dl - 1) < 1e-15) break; }
    return 1 - Math.exp(-x + a * Math.log(x) - T.lgam(a)) * h; };
  T.chi2cdf = function(x, k){ return T.gammp(k / 2, x / 2); };
  T.chi2pdf = function(x, k){ if (x <= 0) return 0; return Math.exp((k / 2 - 1) * Math.log(x) - x / 2 - (k / 2) * Math.log(2) - T.lgam(k / 2)); };
  T.chi2ppf = function(p, k){ var lo = 0, hi = 500; for (var i = 0; i < 100; i++){ var m = (lo + hi) / 2; if (T.chi2cdf(m, k) < p) lo = m; else hi = m; } return (lo + hi) / 2; };
  T.fcdf = function(f, d1, d2){ if (f <= 0) return 0; return T.betai(d1 / 2, d2 / 2, d1 * f / (d1 * f + d2)); };
  T.fpdf = function(f, d1, d2){ if (f <= 0) return 0; return Math.exp(T.lgam((d1 + d2) / 2) - T.lgam(d1 / 2) - T.lgam(d2 / 2) + (d1 / 2) * Math.log(d1 / d2) + (d1 / 2 - 1) * Math.log(f) - ((d1 + d2) / 2) * Math.log(1 + d1 * f / d2)); };
  T.mean = function(a){ var s = 0; for (var i = 0; i < a.length; i++) s += a[i]; return s / a.length; };
  T.sd = function(a){ var m = T.mean(a), s = 0; for (var i = 0; i < a.length; i++) s += (a[i] - m) * (a[i] - m); return Math.sqrt(s / (a.length - 1)); };
  T.lfact = function(n){ return T.lgam(n + 1); };
  T.pval = function(p){ return p < 0.0001 ? "&lt; 0,0001" : S_fmt(p, 4); };
  function S_fmt(x, d){ return SFA.fmt(x, d); }
  /* remplissage sous une courbe entre xa et xb */
  T.fill = function(c, ax, f, xa, xb, color){ var ctx = c.ctx, n = 120; ctx.save(); ctx.beginPath(); ctx.moveTo(ax.X(xa), ax.Y(0));
    for (var i = 0; i <= n; i++){ var x = xa + (xb - xa) * i / n; ctx.lineTo(ax.X(x), ax.Y(f(x))); } ctx.lineTo(ax.X(xb), ax.Y(0)); ctx.closePath(); ctx.fillStyle = color; ctx.fill(); ctx.restore(); };
  return T;
})();

var UI = SFA.st, P = SFA.draw.palette;

SFA.sim({
  id:"us-c07-test-conformite-moyenne", ch:"c07", tag:"Classique · P1",
  titre:"Test de conformité d'une moyenne : de la donnée à la décision",
  resume:"H₀, H₁, statistique t, p-valeur, région critique et décision, étape par étape.",
  but:"On compare la cholestérolémie moyenne d'un échantillon à la valeur de référence μ₀ = 5,2 mmol/L. Glisse la moyenne observée (point du bas ou trait bleu du haut) : regarde où tombe la statistique t et ce que vaut la p-valeur.",
  aRetenir:"t = (x̄ − μ₀)/(s/√n) suit une loi de Student à n − 1 ddl si H₀ est vraie. La p-valeur est la probabilité, sous H₀, d'obtenir un résultat au moins aussi extrême. On rejette H₀ si p ≤ α.",
  piege:"La p-valeur n'est pas la probabilité que H₀ soit vraie. Ne pas rejeter H₀ ne prouve pas que H₀ est vraie.",
  build:function(k,S){
    var MU0=5.2, c=UI.canvas(k,270,.6,340), c2=UI.canvas(k,120,.26,150);
    var xb=k.slider("Moyenne observée x̄",4.5,6.5,0.05,5.5,"mmol/L");
    var s=k.slider("Écart-type s",0.5,2,0.1,1.1,"mmol/L");
    var n=k.slider("Taille n",5,200,1,30,"");
    var al=k.seg("Seuil α",[[0.10,"10 %"],[0.05,"5 %"],[0.01,"1 %"]],0.05);
    var alt=k.seg("Hypothèse alternative",[["bi","μ ≠ μ₀"],["dr","μ > μ₀"],["ga","μ < μ₀"]],"bi");
    var ro=k.readouts(["Statistique de test","Degrés de liberté","p-valeur","Décision"]);
    var nt=k.note("","");
    var l1={}, l2={};
    UI.drag(c,function(){ if(!l1.ax) return []; return [{id:"t",x:l1.ax.X(l1.tt),y:l1.ax.T+14,r:16,dist:function(q){ return Math.abs(q.x-l1.ax.X(l1.tt)); }}]; },
      function(id,q){ var t=l1.ax.ix(q.x); xb.set(UI.clamp(Math.round((MU0+t*s.value/Math.sqrt(n.value))*20)/20,4.5,6.5)); k.redraw(); });
    UI.drag(c2,function(){ return l2.X?[{id:"x",x:l2.X(xb.value),y:l2.y,r:16}]:[]; },function(id,q){ xb.set(UI.clamp(Math.round(l2.ix(q.x)*20)/20,4.5,6.5)); k.redraw(); });
    k.draw(function(){
      var df=n.value-1, t=(xb.value-MU0)/(s.value/Math.sqrt(n.value));
      var pv= alt.value==="bi" ? 2*(1-ST.tcdf(Math.abs(t),df)) : alt.value==="dr" ? 1-ST.tcdf(t,df) : ST.tcdf(t,df);
      var a=al.value, cr= alt.value==="bi" ? ST.tppf(1-a/2,df) : ST.tppf(1-a,df);
      c.clear(); c2.clear(); var xm=Math.max(5,Math.abs(t)+1); xm=Math.min(xm,12);
      var ax=S.draw.axes(c,{x0:-xm,x1:xm,y0:0,y1:0.45,xl:"statistique t",stepY:0.1,t:26}); l1.ax=ax;
      var f=function(x){ return ST.tpdf(x,df); };
      if(alt.value!=="ga") S.draw.area(c,ax,f,Math.min(cr,xm),xm,P.red,0.2);
      if(alt.value!=="dr") S.draw.area(c,ax,f,-xm,-Math.min(cr,xm),P.red,0.2);
      var tt=Math.max(-xm,Math.min(xm,t)); l1.tt=tt;
      if(alt.value==="bi"){ S.draw.area(c,ax,f,Math.min(Math.abs(tt),xm),xm,P.mat,0.5); S.draw.area(c,ax,f,-xm,-Math.min(Math.abs(tt),xm),P.mat,0.5); }
      else if(alt.value==="dr") S.draw.area(c,ax,f,tt,xm,P.mat,0.5); else S.draw.area(c,ax,f,-xm,tt,P.mat,0.5);
      S.draw.fn(c,ax,f,P.ink,2.6);
      S.draw.line(c,ax.X(tt),ax.Y(0),ax.X(tt),ax.T+14,P.mat,2.6); S.draw.dot(c,ax.X(tt),ax.T+14,7,P.mat);
      S.draw.label(c,"t observé = "+S.fmt(t,2),ax.X(tt)+(tt>0?-12:12),ax.T+14,{align:tt>0?"right":"left",size:12,color:P.mat});
      S.draw.legend(c,[[S.draw.tint(P.mat,.6),"p-valeur (aire au-delà de t)"],[S.draw.tint(P.red,.4),"région critique (α)"]],ax.R-4,ax.T+34,{align:"right"});
      var rej=pv<=a;
      /* intervalle de confiance de la moyenne face à μ₀ */
      var h=ST.tppf(0.975,df)*s.value/Math.sqrt(n.value), Lm=30, Rm=c2.W-24, x0=4,x1=7; l2.y=c2.H-60; l2.X=function(v){ return Lm+(v-x0)/(x1-x0)*(Rm-Lm); }; l2.ix=function(px){ return x0+(px-Lm)/(Rm-Lm)*(x1-x0); };
      UI.haxis(c2,x0,x1,Lm,24,c2.H-34,0.5,"moyenne (mmol/L)");
      S.draw.line(c2,l2.X(MU0),14,l2.X(MU0),c2.H-34,P.ink,1.8,[5,4]); S.draw.label(c2,"μ₀ = 5,2",l2.X(MU0)+6,12,{color:P.ink,align:"left",size:11});
      var inside=MU0>=xb.value-h&&MU0<=xb.value+h, cc=inside?P.green:P.red;
      S.draw.line(c2,l2.X(xb.value-h),l2.y,l2.X(xb.value+h),l2.y,cc,6); S.draw.dot(c2,l2.X(xb.value),l2.y,8,P.mat);
      S.draw.label(c2,"x̄ = "+S.fmt(xb.value,2)+"  ·  IC 95 % ["+S.fmt(xb.value-h,2)+" ; "+S.fmt(xb.value+h,2)+"]",c2.W-8,12,{color:cc,align:"right",size:10.5});
      ro.set(0,S.fmt(t,2)); ro.set(1,df); ro.set(2,ST.pval(pv)); ro.set(3,rej?"rejet de H₀":"H₀ non rejetée");
      nt.set(rej?"p ≤ α : l'écart observé est trop grand pour n'être attribué qu'à la fluctuation d'échantillonnage sous H₀. Reste à juger s'il est cliniquement important.":"p &gt; α : les données sont compatibles avec H₀. Ce n'est pas une preuve que μ = μ₀ : l'échantillon est peut-être trop petit.",rej?"ok":"warn");
    });
  }
});

SFA.sim({
  id:"us-c07-erreurs-alpha-beta-puissance", ch:"c07", tag:"Classique · P1",
  titre:"Deux cloches : α, β et puissance",
  resume:"Sous H₀ et sous H₁ : déplace l'effet réel, n et le seuil, et lis les erreurs de 1re et 2e espèce.",
  but:"On teste H₀ : μ = μ₀ (σ connu, simplification) ; la vraie moyenne vaut en réalité μ₀ + effet. Les deux courbes sont la distribution de la statistique Z sous H₀ (gris) et sous la vérité (bleu). Glisse le seuil (trait noir) : α et β se compensent.",
  aRetenir:"α = P(rejeter H₀ | H₀ vraie) ; β = P(ne pas rejeter H₀ | H₁ vraie) ; puissance = 1 − β. Augmenter n ou l'effet réel écarte les cloches et augmente la puissance ; baisser α diminue le risque de faux positif mais fait baisser la puissance.",
  piege:"α et β ne se rapportent pas à la même situation : α suppose H₀ vraie, β suppose H₁ vraie. Ce ne sont pas des probabilités que la décision soit fausse.",
  build:function(k,S){
    var c=UI.canvas(k,320,.72,400);
    var d=k.slider("Effet réel (en écarts-types σ)",0,1.5,0.05,0.5,"σ");
    var n=k.slider("Taille n",1,200,1,25,"");
    var al=k.slider("Seuil α",0.5,20,0.5,5,"%");
    var bi=k.seg("Test",[["bi","bilatéral"],["un","unilatéral droit"]],"un");
    var ro=k.readouts(["Risque de 1re espèce (α)","Risque de 2e espèce (β)","Puissance (1 − β)","Décalage des cloches"]);
    var nt=k.note("","");
    var lay={};
    UI.drag(c,function(){ return lay.ax?[{id:"z",x:lay.ax.X(lay.zc),y:lay.ax.T+6,r:16,dist:function(q){ return Math.abs(q.x-lay.ax.X(lay.zc)); }}]:[]; },
      function(id,q){ var z=Math.abs(lay.ax.ix(q.x)), a=bi.value==="bi"?2*(1-ST.ncdf(z)):(1-ST.ncdf(lay.ax.ix(q.x))); al.set(UI.clamp(Math.round(a*1000)/10*1,0.5,20)); k.redraw(); });
    k.draw(function(){
      var sh=d.value*Math.sqrt(n.value), a=al.value/100, bil=bi.value==="bi";
      var zc= bil ? ST.nppf(1-a/2) : ST.nppf(1-a); lay.zc=zc;
      var power= bil ? (1-ST.ncdf(zc-sh))+ST.ncdf(-zc-sh) : 1-ST.ncdf(zc-sh), beta=1-power;
      var x0=-4, x1=Math.max(5,sh+4); c.clear();
      var ax=S.draw.axes(c,{x0:x0,x1:x1,y0:0,y1:0.46,xl:"statistique Z",stepY:0.1,t:26}); lay.ax=ax;
      var f0=ST.npdf, f1=function(x){ return ST.npdf(x-sh); };
      var lo=bil?-zc:x0, hi=zc;
      S.draw.area(c,ax,f1,Math.max(x0,lo),Math.min(x1,hi),P.amber,0.4);
      if(bil) S.draw.area(c,ax,f1,x0,Math.max(x0,-zc),P.green,0.4);
      S.draw.area(c,ax,f1,Math.min(x1,hi),x1,P.green,0.4);
      if(bil){ S.draw.area(c,ax,f0,zc,x1,P.red,0.65); S.draw.area(c,ax,f0,x0,-zc,P.red,0.65); } else S.draw.area(c,ax,f0,zc,x1,P.red,0.65);
      S.draw.fn(c,ax,f0,P.grey,2.6); S.draw.fn(c,ax,f1,P.mat,2.8);
      S.draw.line(c,ax.X(zc),ax.B,ax.X(zc),ax.T+6,P.ink,2.2,[5,4]); S.draw.dot(c,ax.X(zc),ax.T+6,7,P.ink); if(bil) S.draw.line(c,ax.X(-zc),ax.B,ax.X(-zc),ax.T+6,P.ink,1.6,[5,4]);
      S.draw.label(c,"H₀ vraie",ax.X(0),ax.Y(0.4)-14,{size:12,color:"#4a5a6e"}); S.draw.label(c,"vérité",ax.X(sh),ax.Y(0.4)-14,{size:12,color:P.mat});
      S.draw.legend(c,[[S.draw.tint(P.red,.8),"α : faux positif"],[S.draw.tint(P.amber,.8),"β : faux négatif"],[S.draw.tint(P.green,.8),"puissance 1 − β"]],ax.R-4,ax.T+30,{align:"right"});
      S.draw.label(c,"seuil",ax.X(zc)+8,ax.T+6,{size:11,color:P.ink,align:"left"});
      ro.set(0,S.fmt(100*a,1)+" %"); ro.set(1,S.fmt(100*beta,1)+" %"); ro.set(2,S.fmt(100*power,1)+" %"); ro.set(3,S.fmt(sh,2)+" (en unités de Z)");
      if(d.value===0) nt.set("Effet réel nul : H₀ est vraie. La « puissance » affichée est alors égale à α, c'est le taux de faux positifs.","warn");
      else if(power<0.8) nt.set("Puissance inférieure à 80 % : l'étude risque de manquer un effet réel (erreur de 2e espèce). Augmente n, l'effet ou α.","warn");
      else nt.set("Puissance d'au moins 80 %, la valeur minimale couramment visée.","ok");
    });
  }
});

SFA.sim({
  id:"us-c07-taille-echantillon-puissance", ch:"c07", tag:"Planifier une étude",
  titre:"Combien de sujets faut-il inclure ?",
  resume:"La taille n qui atteint la puissance visée, selon l'effet à détecter et le seuil α.",
  but:"Choisis l'effet à détecter (différence divisée par l'écart-type), α et la puissance visée. La courbe montre la puissance en fonction de n ; le point rouge est la taille minimale, la courbe pointillée celle d'un effet deux fois plus petit.",
  aRetenir:"Une moyenne contre une référence : n = ((z<sub>1−α/2</sub> + z<sub>1−β</sub>)/d)². Deux groupes indépendants : n par groupe = 2·((z<sub>1−α/2</sub> + z<sub>1−β</sub>)/d)². Diviser l'effet par 2 multiplie n par 4.",
  piege:"Formule approchée (loi normale) : avec Student, il faut quelques sujets de plus pour les petits n. L'effet d doit être fixé avant l'étude, d'après ce qui est cliniquement important.",
  build:function(k,S){
    var c=UI.canvas(k,320,.74,400);
    var d=k.slider("Effet à détecter d = différence/σ",0.1,1.5,0.05,0.5,"");
    var al=k.seg("Seuil α (bilatéral)",[[0.01,"1 %"],[0.05,"5 %"],[0.10,"10 %"]],0.05);
    var pw=k.seg("Puissance visée",[[0.8,"80 %"],[0.9,"90 %"],[0.95,"95 %"]],0.8);
    var pl=k.seg("Plan",[["1","un échantillon"],["2","deux groupes"]],"2");
    var ro=k.readouts(["n minimal","Total de sujets","n si l'effet est 2 fois plus petit"]);
    var lay={};
    UI.drag(c,function(){ return lay.ax?[{id:"d",x:lay.ax.X(lay.N),y:lay.ax.Y(pw.value),r:18}]:[]; },
      function(id,q){ var nn=Math.max(2,lay.ax.ix(q.x)), z=ST.nppf(1-al.value/2)+ST.nppf(pw.value), dd=z*Math.sqrt((pl.value==="2"?2:1)/nn); d.set(UI.clamp(Math.round(dd*20)/20,0.1,1.5)); k.redraw(); });
    function power(nn,dd,a,pln){ var z=ST.nppf(1-a/2), sh=dd*Math.sqrt(pln==="2"?nn/2:nn); return 1-ST.ncdf(z-sh)+ST.ncdf(-z-sh); }
    function nreq(dd,a,pwr,pln){ var f=(ST.nppf(1-a/2)+ST.nppf(pwr))/dd; return Math.ceil((pln==="2"?2:1)*f*f); }
    k.draw(function(){
      var N=nreq(d.value,al.value,pw.value,pl.value), N2=nreq(d.value/2,al.value,pw.value,pl.value), xmax=Math.max(20,Math.ceil(Math.min(N2*1.15,N*4.2)/10)*10); lay.N=N;
      c.clear(); var ax=S.draw.axes(c,{x0:0,x1:xmax,y0:0,y1:1,xl:pl.value==="2"?"n par groupe":"effectif n",yl:"puissance",t:24}); lay.ax=ax;
      S.draw.area(c,ax,function(x){ return power(Math.max(x,1),d.value,al.value,pl.value); },0,xmax,P.mat,0.08);
      S.draw.fn(c,ax,function(x){ return power(Math.max(x,1),d.value/2,al.value,pl.value); },P.amber,2.2,[6,4]);
      S.draw.fn(c,ax,function(x){ return power(Math.max(x,1),d.value,al.value,pl.value); },P.mat,3);
      S.draw.line(c,ax.L,ax.Y(pw.value),ax.R,ax.Y(pw.value),P.red,1.5,[5,4]);
      S.draw.line(c,ax.X(N),ax.Y(pw.value),ax.X(N),ax.B,P.red,1.5,[5,4]); S.draw.dot(c,ax.X(N),ax.Y(power(N,d.value,al.value,pl.value)),8,P.red);
      S.draw.label(c,"n = "+N,ax.X(N)+(ax.X(N)>c.W*0.7?-12:12),ax.Y(pw.value)+18,{align:ax.X(N)>c.W*0.7?"right":"left",size:13,color:P.red});
      if(N2<=xmax){ S.draw.dot(c,ax.X(N2),ax.Y(pw.value),5.5,P.amber); S.draw.label(c,"effet ÷ 2 : n = "+N2,ax.X(N2),ax.Y(pw.value)+18,{align:"right",size:11,color:P.amber}); }
      S.draw.legend(c,[[P.mat,"effet d = "+S.fmt(d.value,2)],[P.amber,"effet d/2",1],[P.red,"puissance visée",1]],ax.R-4,ax.B-74,{align:"right"});
      UI.hint(c,"glisse le point rouge",ax.L+60,ax.T+78,P.red);
      ro.set(0,N+(pl.value==="2"?" par groupe":"")); ro.set(1,pl.value==="2"?2*N:N); ro.set(2,N2);
    });
  }
});

SFA.sim({
  id:"us-c07-pvaleur-grands-echantillons", ch:"c07", tag:"Original · significatif ≠ pertinent",
  titre:"Significatif… mais utile ? Le poids de n",
  resume:"Un effet cliniquement négligeable devient « hautement significatif » quand n devient énorme.",
  but:"Un médicament baisse la pression de Δ mmHg en moyenne (σ = 15 mmHg). Fais croître n : l'intervalle se resserre autour de Δ et s'éloigne de 0 (« significatif »), alors que l'effet ne change pas. Compare-le à la zone verte, celle de la pertinence clinique.",
  aRetenir:"p dépend de l'effet ET de n (statistique z = Δ√n/σ). La significativité statistique ne dit rien de l'importance de l'effet : il faut lire l'estimation de l'effet et son intervalle de confiance.",
  piege:"« p &lt; 0,001 » ne signifie pas « effet important ». À l'inverse, un effet important peut être non significatif si n est trop petit.",
  build:function(k,S){
    var SIG=15, c=UI.canvas(k,300,.7,380), c2=UI.canvas(k,200,.4,250);
    var dl=k.slider("Effet réel Δ",0.2,10,0.1,1,"mmHg");
    var ln=k.slider("log₁₀ n  (n de 10 à 100 000)",1,5,0.05,2,"");
    var cl=k.slider("Seuil de pertinence clinique",1,10,0.5,5,"mmHg");
    var ro=k.readouts(["n","z","p-valeur","IC 95 % de l'effet","Verdict"]);
    var nt=k.note("","");
    var lay={};
    UI.drag(c2,function(){ if(!lay.bx) return []; var n=Math.pow(10,ln.value), z=dl.value*Math.sqrt(n)/SIG, p=2*(1-ST.ncdf(z)); return [{id:"n",x:lay.bx.X(ln.value),y:lay.bx.Y(Math.min(8,-Math.log10(Math.max(p,1e-300)))),r:18}]; },
      function(id,q){ ln.set(UI.clamp(Math.round(lay.bx.ix(q.x)*20)/20,1,5)); k.redraw(); });
    k.draw(function(){
      var n=Math.round(Math.pow(10,ln.value)), z=dl.value*Math.sqrt(n)/SIG, p=2*(1-ST.ncdf(z)), h=1.96*SIG/Math.sqrt(n);
      c.clear(); c2.clear();
      /* forêt : IC attendus selon n */
      var rows=[10,100,1000,10000,100000], L=74, R=c.W-14, x0=-14, x1=24, T=44, B=c.H-44, X=function(v){ return L+(v-x0)/(x1-x0)*(R-L); };
      var ctx=c.ctx;
      ctx.fillStyle=S.draw.tint(P.green,.13); ctx.fillRect(X(cl.value),T-8,R-X(cl.value),B-T+16);
      S.draw.label(c,"zone d'effet pertinent",R-4,T-20,{color:P.green,align:"right",size:11});
      UI.haxis(c,x0,x1,L,14,B+4,4,"effet sur la pression (mmHg)");
      S.draw.line(c,X(0),T-10,X(0),B+4,P.ink,1.8); S.draw.label(c,"0 : aucun effet",X(0)-6,T-20,{color:P.ink,align:"right",size:11});
      S.draw.line(c,X(dl.value),T-10,X(dl.value),B+4,S.draw.tint(P.mat,.5),1.4,[4,4]);
      var all=(rows.indexOf(n)<0?rows.concat([n]):rows.slice()).sort(function(a,b){ return a-b; }), step=(B-T)/(all.length-1||1);
      all.forEach(function(nn,i){
        var y=T+i*step, hh=1.96*SIG/Math.sqrt(nn), zz=dl.value*Math.sqrt(nn)/SIG, sig=zz>1.96, cur=nn===n, lo=dl.value-hh, hi=dl.value+hh;
        var col=sig?(dl.value>=cl.value?P.green:P.orange):P.grey;
        S.draw.line(c,X(Math.max(x0,lo)),y,X(Math.min(x1,hi)),y,col,cur?7:4);
        S.draw.line(c,X(Math.max(x0,lo)),y-6,X(Math.max(x0,lo)),y+6,col,2.4); S.draw.line(c,X(Math.min(x1,hi)),y-6,X(Math.min(x1,hi)),y+6,col,2.4);
        S.draw.dot(c,X(dl.value),y,cur?6:4,P.mat);
        S.draw.label(c,"n = "+nn.toLocaleString("fr-BE"),L-6,y,{color:cur?P.red:"#4a5a6e",align:"right",size:11,weight:cur?800:700});
        if(cur){ ctx.strokeStyle=P.red; ctx.lineWidth=1.6; S.draw.rrect(c,4,y-13,c.W-8,26,8); ctx.stroke(); }
      });
      S.draw.legend(c,[[P.grey,"non significatif"],[P.orange,"signif., négligeable"],[P.green,"signif., pertinent"]],R-4,B-62,{align:"right"});
      var bx=S.draw.axes(c2,{x0:1,x1:5,y0:0,y1:8,xl:"log₁₀ n",yl:"−log₁₀ p",stepX:1,stepY:2,t:22,b:38}); lay.bx=bx;
      S.draw.fn(c2,bx,function(x){ var zz=dl.value*Math.sqrt(Math.pow(10,x))/SIG, pp=2*(1-ST.ncdf(zz)); return Math.min(8,-Math.log10(Math.max(pp,1e-300))); },P.mat,3);
      S.draw.line(c2,bx.L,bx.Y(-Math.log10(0.05)),bx.R,bx.Y(-Math.log10(0.05)),P.red,1.5,[5,4]); S.draw.label(c2,"p = 0,05",bx.R-4,bx.Y(1.3)-13,{align:"right",size:11,color:P.red});
      S.draw.dot(c2,bx.X(ln.value),bx.Y(Math.min(8,-Math.log10(Math.max(p,1e-300)))),7.5,P.red);
      var sig=p<0.05, rel=dl.value>=cl.value;
      ro.set(0,n.toLocaleString("fr-BE")); ro.set(1,S.fmt(z,2)); ro.set(2,ST.pval(p)); ro.set(3,"["+S.fmt(dl.value-h,2)+" ; "+S.fmt(dl.value+h,2)+"]");
      ro.set(4,(sig?"significatif":"non significatif")+", "+(rel?"pertinent":"négligeable"));
      nt.set(sig&&!rel?"Statistiquement significatif mais cliniquement négligeable : l'effet de "+S.fmt(dl.value,1)+" mmHg est sous le seuil de "+S.fmt(cl.value,1)+" mmHg. Un tout petit effet devient « significatif » dès que n est grand.":sig?"Significatif et pertinent : l'IC exclut 0 et l'effet dépasse le seuil clinique.":rel?"Effet qui serait pertinent mais non significatif : n trop petit, l'IC contient 0 (étude sous-puissante).":"Ni significatif ni pertinent à ce stade.",sig&&!rel?"warn":"ok");
    });
  }
});

SFA.sim({
  id:"us-c07-tests-multiples-p-hacking", ch:"c07", tag:"Original · P1",
  titre:"20 tests, 1 découverte : les faux positifs s'accumulent",
  resume:"Quand toutes les hypothèses nulles sont vraies, tester beaucoup de critères produit presque toujours un résultat « significatif ».",
  but:"Aucun critère n'est réellement associé à l'issue (H₀ vraie partout). Lance une étude qui teste m critères : chaque case est une p-valeur et se révèle une à une. Compare avec la correction de Bonferroni.",
  aRetenir:"Pour m tests indépendants au seuil α, P(au moins un faux positif) = 1 − (1 − α)<sup>m</sup> ; pour m = 20 et α = 5 %, elle vaut 64 %. Bonferroni teste chaque critère au seuil α/m, ce qui ramène ce risque à environ α (au prix d'une puissance moindre).",
  piege:"Annoncer seulement le critère « significatif » parmi 20 testés (p-hacking) est trompeur : il faut déclarer tous les tests effectués, ou corriger.",
  build:function(k,S){
    var g=UI.canvas(k,210,.5,300), c=UI.canvas(k,250,.56,330), shown=1e9, acc=0;
    var m=k.slider("Nombre de tests m",1,100,1,20,"");
    var al=k.seg("Seuil α",[[0.01,"1 %"],[0.05,"5 %"],[0.10,"10 %"]],0.05);
    var bf=k.toggle("Correction de Bonferroni (seuil α/m)",false);
    var seed=22, cum={key:"",fp:0,tot:0};
    var ro=k.readouts(["Seuil appliqué à chaque test","Tests « significatifs » ici","Risque d'au moins 1 faux positif","Observé sur 2 000 études"]);
    var nt=k.note("","");
    var ani=k.loop(function(dt){ acc+=dt*18; var q=Math.floor(acc); acc-=q; shown+=q; if(shown>=m.value) ani.pause(); k.redraw(); });
    k.button("Nouvelle étude (révélation une à une)",function(){ seed++; shown=0; acc=0; ani.play(); },true);
    function thr(){ return bf.value ? al.value/m.value : al.value; }
    var lay={};
    UI.drag(c,function(){ if(!lay.ax) return []; var th=thr(); return [{id:"m",x:lay.ax.X(m.value),y:lay.ax.Y(1-Math.pow(1-th,m.value)),r:18}]; },function(id,q){ m.set(UI.clamp(Math.round(lay.ax.ix(q.x)),1,100)); shown=1e9; k.redraw(); });
    k.draw(function(){
      var M=m.value, th=thr(), r=ST.rng(seed*65537+M), i, np=0, first=-1, fp0=0;
      g.clear(); var cols=Math.min(M,M>40?10:M>20?10:Math.min(M,5)), rows=Math.ceil(M/cols), cw=(g.W-20)/cols, ch=Math.min(42,(g.H-46)/rows);
      for(i=0;i<M;i++){ var p=r(), x=10+(i%cols)*cw, y=34+Math.floor(i/cols)*ch, hit=p<th, vis=i<shown; if(vis&&hit){ np++; if(first<0){ first=i; fp0=p; } }
        g.ctx.fillStyle=!vis?S.draw.tint(P.grey,.12):hit?S.draw.tint(P.red,.9):S.draw.tint(P.grey,.28); S.draw.rrect(g,x+1.5,y+1.5,cw-3,ch-3,5); g.ctx.fill();
        if(vis&&cw>28&&ch>16){ S.draw.text(g,S.fmt(p,2),x+cw/2,y+ch/2,{size:cw>40?11.5:10,color:hit?"#fff":"#4a5a6e",weight:700}); } }
      S.draw.text(g,"chaque case = la p-valeur d'un critère (aucun n'est réellement associé)",10,14,{size:11.5,align:"left",color:"#3d4b5f"});
      if(first>=0&&shown>=M) S.draw.label(g,"Titre trompeur : « le critère n°"+(first+1)+" est associé (p = "+S.fmt(fp0,2)+") »",g.W-8,g.H-12,{color:P.red,align:"right",size:11});
      var key=M+"|"+th; if(cum.key!==key){ var rr=ST.rng(99991+M), j, q, any, tot=2000, fp=0; for(j=0;j<tot;j++){ any=false; for(q=0;q<M;q++){ if(rr()<th){ any=true; break; } } if(any) fp++; } cum={key:key,fp:fp,tot:tot}; }
      c.clear(); var ax=S.draw.axes(c,{x0:0,x1:100,y0:0,y1:1,xl:"nombre de tests m",yl:"P(≥ 1 faux positif)",stepX:10,stepY:0.2,t:24}); lay.ax=ax;
      S.draw.fn(c,ax,function(x){ return 1-Math.pow(1-al.value,x); },P.red,2.8);
      S.draw.fn(c,ax,function(x){ return 1-Math.pow(1-al.value/Math.max(x,1),x); },P.green,2.8);
      S.draw.label(c,"sans correction",ax.X(100)-4,ax.Y(1-Math.pow(1-al.value,100))+15,{color:P.red,align:"right",size:11.5}); S.draw.label(c,"Bonferroni",ax.X(100)-4,ax.Y(al.value)-14,{color:P.green,align:"right",size:11.5});
      var risk=1-Math.pow(1-th,M); S.draw.dot(c,ax.X(M),ax.Y(risk),7.5,P.ink);
      S.draw.label(c,F100(risk),ax.X(M)+(M>70?-12:12),ax.Y(risk)+(risk>0.5?18:-14),{color:P.ink,align:M>70?"right":"left",size:12});
      UI.hint(c,"glisse le point (m)",ax.X(60),ax.Y(0.5),P.mat);
      ro.set(0,S.fmt(th,4)); ro.set(1,np+" sur "+M); ro.set(2,S.fmt(100*risk,1)+" %"); ro.set(3,S.fmt(100*cum.fp/cum.tot,1)+" %");
      nt.set(np>0&&shown>=M?"Un « résultat significatif » est apparu alors qu'aucun critère n'est vraiment associé : c'est un faux positif. "+(bf.value?"":"Active Bonferroni pour voir le risque redescendre."):"Seuil appliqué à chaque test : "+S.fmt(th,4)+". Probabilité d'avoir au moins une « découverte » par hasard : "+S.fmt(100*risk,1)+" %.",np>0&&shown>=M?"warn":"ok");
    });
    function F100(r){ return S.fmt(100*r,0)+" %"; }
  }
});
})();
