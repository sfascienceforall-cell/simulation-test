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

/* nuage de points par groupe : jitter déterministe, moyenne en trait */
function dots(c, S, ax, groups, opt){
  groups.forEach(function(g, gi){
    var cx = ax.X(gi + 0.5), w = Math.min(44, (ax.R - ax.L) / groups.length / 3.2);
    g.v.forEach(function(v, j){ var jit = ((j * 37 + gi * 11) % 17 - 8) / 8 * w; if (v >= opt.y0 && v <= opt.y1) S.draw.dot(c, cx + jit, ax.Y(v), g.v.length > 40 ? 3 : 4.6, S.draw.tint(g.color, .82)); });
    var m = ST.mean(g.v); S.draw.line(c, cx - w - 14, ax.Y(m), cx + w + 14, ax.Y(m), P.ink, 3);
    S.draw.label(c, g.name, cx, ax.B + 20, {size: 12.5, color: g.color});
  });
}

SFA.sim({
  id:"us-c08-student-deux-echantillons", ch:"c08", tag:"Classique · P1",
  titre:"Student pour deux échantillons indépendants",
  resume:"Différence de moyennes, écart-type, t, degrés de liberté, p-valeur et IC de la différence, sur un tirage simulé.",
  but:"Deux groupes de patients (contrôle et traité), pression systolique. Règle la vraie baisse due au traitement (ou glisse le trait du groupe traité), la dispersion et les effectifs, puis tire de nouveaux échantillons : la décision varie d'un tirage à l'autre.",
  aRetenir:"t = (x̄₁ − x̄₂)/ES, avec ES = s<sub>p</sub>√(1/n₁ + 1/n₂) (variance combinée, ν = n₁ + n₂ − 2) ou version de Welch (variances différentes). L'IC de la différence est (x̄₁ − x̄₂) ± t·ES : il contient 0 si et seulement si p &gt; 0,05.",
  piege:"Même avec un effet réel, un petit tirage peut donner p &gt; 0,05 : c'est un manque de puissance, pas une preuve d'absence d'effet.",
  build:function(k,S){
    var c=UI.canvas(k,300,.66,380), c2=UI.canvas(k,120,.26,150);
    var d=k.slider("Vraie baisse due au traitement",0,15,0.5,6,"mmHg");
    var sg=k.slider("Écart-type σ (dans chaque groupe)",5,25,1,12,"mmHg");
    var n1=k.slider("Effectif du groupe contrôle",5,80,1,15,"");
    var n2=k.slider("Effectif du groupe traité",5,80,1,15,"");
    var mt=k.seg("Variances",[["eq","égales (Student)"],["w","Welch"]],"eq");
    var seed=5, ro=k.readouts(["Différence observée","t","Degrés de liberté","p-valeur","IC 95 % de la différence"]);
    var nt=k.note("","");
    var rep=null;
    function study(r){
      var i,a=[],b=[]; for(i=0;i<n1.value;i++) a.push(130+sg.value*ST.randn(r)); for(i=0;i<n2.value;i++) b.push(130-d.value+sg.value*ST.randn(r));
      var m1=ST.mean(a), m2=ST.mean(b), v1=Math.pow(ST.sd(a),2), v2=Math.pow(ST.sd(b),2), N1=n1.value, N2=n2.value, es, df;
      if(mt.value==="eq"){ var sp2=((N1-1)*v1+(N2-1)*v2)/(N1+N2-2); es=Math.sqrt(sp2*(1/N1+1/N2)); df=N1+N2-2; }
      else { es=Math.sqrt(v1/N1+v2/N2); df=Math.pow(v1/N1+v2/N2,2)/(v1*v1/(N1*N1*(N1-1))+v2*v2/(N2*N2*(N2-1))); }
      var diff=m1-m2, t=diff/es, p=2*(1-ST.tcdf(Math.abs(t),df)), h=ST.tppf(0.975,df)*es;
      return {a:a,b:b,m1:m1,m2:m2,diff:diff,t:t,p:p,h:h,df:df};
    }
    k.button("Nouveau tirage",function(){ seed++; rep=null; },true);
    k.button("Répéter 200 études",function(){ var r=ST.rng(seed*131+7), z=0; for(var i=0;i<200;i++){ if(study(r).p<0.05) z++; } rep={z:z,d:d.value,sg:sg.value,n1:n1.value,n2:n2.value}; });
    var lay={};
    UI.drag(c,function(){ return lay.ax?[{id:"m",x:lay.ax.X(1.5),y:lay.ax.Y(lay.m2),r:20,dist:function(q){ return Math.hypot(Math.max(0,Math.abs(q.x-lay.ax.X(1.5))-60),q.y-lay.ax.Y(lay.m2)); }}]:[]; },
      function(id,q){ var shift=130-lay.ax.iy(q.y)+(lay.m2-(130-d.value)); /* le trait suit le pointeur */ d.set(UI.clamp(Math.round((130-lay.ax.iy(q.y)+(130-d.value-lay.m2))*2)/2,0,15)); k.redraw(); });
    k.draw(function(){
      var r=ST.rng(seed*7727+n1.value*31+n2.value), s=study(r);
      c.clear(); c2.clear(); lay.m2=s.m2;
      var ax=S.draw.axes(c,{x0:0,x1:2,y0:70,y1:190,yl:"pression systolique (mmHg)",stepX:100,l:54,hideZero:true,t:20,b:38}); lay.ax=ax;
      dots(c,S,ax,[{name:"Contrôle (n = "+n1.value+")",v:s.a,color:P.grey},{name:"Traité (n = "+n2.value+")",v:s.b,color:P.mat}],{y0:70,y1:190});
      UI.hint(c,"glisse le trait du groupe traité",ax.X(1.5),ax.T+14,P.mat);
      /* IC de la différence */
      var L=40,R=c2.W-24, x0=-25,x1=35, X=function(v){ return L+(v-x0)/(x1-x0)*(R-L); };
      UI.haxis(c2,x0,x1,L,24,c2.H-36,10,"différence des moyennes, contrôle − traité (mmHg)");
      var inside=s.diff-s.h<=0&&0<=s.diff+s.h, col=inside?P.red:P.green, y=c2.H-62;
      S.draw.line(c2,X(0),12,X(0),c2.H-36,P.ink,1.8,[5,4]); S.draw.label(c2,"0 : pas de différence",X(0)+6,12,{color:P.ink,align:"left",size:10.5});
      S.draw.line(c2,X(s.diff-s.h),y,X(s.diff+s.h),y,col,6); S.draw.dot(c2,X(s.diff),y,7.5,P.mat);
      S.draw.line(c2,X(d.value),y-14,X(d.value),y+14,S.draw.tint(P.violet,.9),2.4);
      S.draw.label(c2,"vraie différence",X(d.value),y-20,{color:P.violet,size:10.5});
      ro.set(0,S.fmt(s.diff,1)+" mmHg"); ro.set(1,S.fmt(s.t,2)); ro.set(2,S.fmt(s.df,1)); ro.set(3,ST.pval(s.p)); ro.set(4,"["+S.fmt(s.diff-s.h,1)+" ; "+S.fmt(s.diff+s.h,1)+"]");
      var txt=(s.p<0.05?"p < 0,05 : l'IC de la différence exclut 0, la différence est significative."  :"p ≥ 0,05 : l'IC de la différence contient 0 (barre rouge), pas de différence détectable avec ce tirage.");
      if(rep&&rep.d===d.value&&rep.sg===sg.value&&rep.n1===n1.value&&rep.n2===n2.value) txt+=" Sur 200 études répétées : "+rep.z+" significatives, soit une puissance d'environ "+S.fmt(rep.z/2,0)+" %.";
      nt.set(txt,s.p<0.05?"ok":"warn");
    });
  }
});

SFA.sim({
  id:"us-c08-student-apparie", ch:"c08", tag:"Classique · gain de puissance",
  titre:"Avant / après : l'avantage de l'appariement",
  resume:"Les mêmes patients mesurés deux fois : le test apparié exploite la corrélation, le test indépendant la gaspille.",
  but:"Pression avant et après traitement chez les mêmes patients (un trait par patient). Augmente la corrélation entre les deux mesures : les traits deviennent parallèles, les différences se resserrent, et la p-valeur du test apparié s'effondre alors que celle du test (à tort) indépendant ne bouge presque pas.",
  aRetenir:"Test apparié : on analyse les différences individuelles d<sub>i</sub> = après − avant, t = d̄/(s<sub>d</sub>/√n), ν = n − 1. Plus la corrélation avant/après est forte, plus s<sub>d</sub> est petit, plus le test est puissant.",
  piege:"Données appariées analysées comme deux groupes indépendants : on perd de la puissance. À l'inverse, deux groupes indépendants ne doivent jamais être « appariés » artificiellement.",
  build:function(k,S){
    var c=UI.canvas(k,300,.68,380), c2=UI.canvas(k,160,.34,200);
    var d=k.slider("Vraie baisse moyenne",0,12,0.5,5,"mmHg");
    var rho=k.slider("Corrélation avant/après ρ",0,0.95,0.05,0.8,"");
    var n=k.slider("Nombre de patients",6,40,1,12,"");
    var seed=14, ro=k.readouts(["Baisse moyenne observée","Écart-type des différences","p test apparié","p test indépendant (à tort)"]);
    var nt=k.note("","");
    k.button("Nouveau tirage",function(){ seed++; },true);
    k.draw(function(){
      var N=n.value, r=ST.rng(seed*9973+N), SIG=15, i, zb=[], z1=[], z2=[];
      for(i=0;i<N;i++){ zb.push(ST.randn(r)); z1.push(ST.randn(r)); z2.push(ST.randn(r)); }
      var sb=SIG*Math.sqrt(rho.value), sw=SIG*Math.sqrt(1-rho.value), x=[], y=[], df=[];
      for(i=0;i<N;i++){ var base=140+sb*zb[i]; x.push(base+sw*z1[i]); y.push(base-d.value+sw*z2[i]); df.push(x[i]-y[i]); }
      var md=ST.mean(df), sd=ST.sd(df), t=md/(sd/Math.sqrt(N)), pa=2*(1-ST.tcdf(Math.abs(t),N-1)), h=ST.tppf(0.975,N-1)*sd/Math.sqrt(N);
      var v1=Math.pow(ST.sd(x),2), v2=Math.pow(ST.sd(y),2), es=Math.sqrt(v1/N+v2/N), ti=(ST.mean(x)-ST.mean(y))/es, dfw=Math.pow(v1/N+v2/N,2)/((v1*v1+v2*v2)/(N*N*(N-1))), pi=2*(1-ST.tcdf(Math.abs(ti),dfw));
      c.clear(); c2.clear();
      var lo=Math.floor((Math.min.apply(null,x.concat(y))-6)/10)*10, hi=Math.ceil((Math.max.apply(null,x.concat(y))+6)/10)*10;
      var ax=S.draw.axes(c,{x0:0,x1:3,y0:lo,y1:hi,yl:"pression systolique (mmHg)",stepX:100,l:54,hideZero:true,t:20,b:38});
      var X1=ax.X(1), X2=ax.X(2);
      for(i=0;i<N;i++){ S.draw.line(c,X1,ax.Y(x[i]),X2,ax.Y(y[i]),S.draw.tint(P.mat,.4),1.6); S.draw.dot(c,X1,ax.Y(x[i]),3.8,P.grey); S.draw.dot(c,X2,ax.Y(y[i]),3.8,P.mat); }
      S.draw.line(c,X1,ax.Y(ST.mean(x)),X2,ax.Y(ST.mean(y)),P.red,3.6);
      S.draw.label(c,"Avant",X1,ax.B+20,{size:12.5,color:"#4a5a6e"}); S.draw.label(c,"Après",X2,ax.B+20,{size:12.5,color:P.mat});
      S.draw.legend(c,[[S.draw.tint(P.mat,.6),"un patient"],[P.red,"moyenne"]],ax.R-4,ax.T+2,{align:"right"});
      /* différences individuelles */
      var Lm=40,Rm=c2.W-24, x0=-30,x1=40, X=function(v){ return Lm+(v-x0)/(x1-x0)*(Rm-Lm); };
      UI.haxis(c2,x0,x1,Lm,24,c2.H-34,10,"différence individuelle avant − après (mmHg)");
      S.draw.line(c2,X(0),12,X(0),c2.H-34,P.ink,1.8,[5,4]);
      df.forEach(function(v,j){ S.draw.dot(c2,X(UI.clamp(v,x0,x1)),c2.H-52-(j%3)*10,3.8,S.draw.tint(P.mat,.8)); });
      var inside=md-h<=0&&0<=md+h; S.draw.line(c2,X(md-h),28,X(md+h),28,inside?P.red:P.green,6); S.draw.dot(c2,X(md),28,7,P.mat);
      S.draw.label(c2,"d̄ = "+S.fmt(md,1)+"  (IC 95 % ["+S.fmt(md-h,1)+" ; "+S.fmt(md+h,1)+"])",Rm,12,{color:inside?P.red:P.green,align:"right",size:10.5});
      ro.set(0,S.fmt(md,1)+" mmHg"); ro.set(1,S.fmt(sd,1)+" mmHg"); ro.set(2,ST.pval(pa)); ro.set(3,ST.pval(pi));
      nt.set("Écart-type des différences : "+S.fmt(sd,1)+" mmHg. "+(rho.value>=0.5?"Les patients se ressemblent avant/après : les différences sont serrées, le test apparié est bien plus puissant que le test indépendant.":"Avec une corrélation faible, apparier n'apporte presque rien : les deux tests donnent des p-valeurs proches."),pa<pi/3&&pa<0.2?"ok":"warn");
    });
  }
});

SFA.sim({
  id:"us-c08-anova-intuition", ch:"c08", tag:"Classique",
  titre:"ANOVA : variance entre groupes contre variance dans les groupes",
  resume:"Trois groupes : le rapport F compare la dispersion des moyennes à la dispersion des individus.",
  but:"Trois traitements (taux de cholestérol). Glisse la moyenne de chaque groupe (traits noirs) et règle la dispersion interne : observe F et la p-valeur.",
  aRetenir:"F = CM<sub>inter</sub>/CM<sub>intra</sub> avec CM<sub>inter</sub> = SC<sub>inter</sub>/(k − 1) et CM<sub>intra</sub> = SC<sub>intra</sub>/(N − k). Un F grand signifie que les moyennes diffèrent plus que ce que la dispersion interne laisse attendre.",
  piege:"Plusieurs tests t au lieu d'une ANOVA gonflent le risque de 1re espèce (3 comparaisons à 5 % : 14 %). Une ANOVA significative ne dit pas quels groupes diffèrent : il faut des comparaisons post hoc.",
  build:function(k,S){
    var c=UI.canvas(k,320,.74,400);
    var m1=k.slider("Moyenne du groupe A",4,7,0.05,5.2,"mmol/L");
    var m2=k.slider("Moyenne du groupe B",4,7,0.05,5.5,"mmol/L");
    var m3=k.slider("Moyenne du groupe C",4,7,0.05,5.9,"mmol/L");
    var sg=k.slider("Écart-type intra-groupe",0.3,1.5,0.05,0.8,"mmol/L");
    var n=k.slider("Effectif par groupe",5,40,1,10,"");
    var ro=k.readouts(["SC inter","SC intra","F","ddl","p-valeur"]);
    var nt=k.note("","");
    var zs=(function(){ var r=ST.rng(2468), out=[]; for(var g=0;g<3;g++){ var z=[],i; for(i=0;i<40;i++) z.push(ST.randn(r)); var m=ST.mean(z), s=ST.sd(z); out.push(z.map(function(v){ return (v-m)/s; })); } return out; })();
    var sl=[m1,m2,m3], lay={};
    UI.drag(c,function(){ if(!lay.ax) return []; return lay.means.map(function(m,gi){ return {id:gi,x:lay.ax.X(gi+0.5),y:lay.ax.Y(m),r:22,dist:function(q){ return Math.hypot(Math.max(0,Math.abs(q.x-lay.ax.X(gi+0.5))-52),q.y-lay.ax.Y(m)); }}; }); },
      function(id,q){ sl[id].set(UI.clamp(Math.round(lay.ax.iy(q.y)*20)/20,4,7)); k.redraw(); });
    k.draw(function(){
      var N=n.value, ms=[m1.value,m2.value,m3.value], cols=[P.grey,P.mat,P.orange], names=["A","B","C"], g;
      var data=ms.map(function(m,gi){ var z=zs[gi].slice(0,N), mz=ST.mean(z), sz=ST.sd(z); return z.map(function(v){ return m+sg.value*(v-mz)/sz; }); });
      var means=data.map(function(v){ return ST.mean(v); }), gm=ST.mean(means); lay.means=means;
      var ssb=0, ssw=0; data.forEach(function(v,gi){ ssb+=N*Math.pow(means[gi]-gm,2); v.forEach(function(x){ ssw+=Math.pow(x-means[gi],2); }); });
      var df1=2, df2=3*N-3, Fv=(ssb/df1)/(ssw/df2), p=1-ST.fcdf(Fv,df1,df2);
      c.clear(); var ax=S.draw.axes(c,{x0:0,x1:3,y0:3,y1:8.5,yl:"cholestérol (mmol/L)",stepX:100,l:54,hideZero:true,t:20,b:38}); lay.ax=ax;
      S.draw.line(c,ax.L,ax.Y(gm),ax.R,ax.Y(gm),P.red,1.6,[6,4]);
      data.forEach(function(v,gi){ var cx=ax.X(gi+0.5); v.forEach(function(x,j){ var jit=((j*37+gi*11)%17-8)/8*38; S.draw.line(c,cx+jit,ax.Y(x),cx+jit,ax.Y(means[gi]),S.draw.tint(P.grey,.4),1); S.draw.dot(c,cx+jit,ax.Y(x),4.4,S.draw.tint(cols[gi],.85)); });
        S.draw.line(c,cx-52,ax.Y(means[gi]),cx+52,ax.Y(means[gi]),P.ink,3.4); S.draw.dot(c,cx+52,ax.Y(means[gi]),6,P.ink); S.draw.label(c,names[gi]+"  ("+S.fmt(means[gi],2)+")",cx,ax.B+20,{size:12.5,color:cols[gi]}); });
      S.draw.label(c,"moyenne générale "+S.fmt(gm,2),ax.R-4,ax.Y(gm)-13,{align:"right",size:11,color:P.red});
      S.draw.legend(c,[[P.ink,"moyenne du groupe"],[P.red,"moyenne générale",1],[P.grey,"écart à la moyenne du groupe"]],ax.R-4,ax.B-62,{align:"right"});
      UI.hint(c,"glisse un trait noir",ax.X(1.5),ax.B-14,P.mat);
      ro.set(0,S.fmt(ssb,2)); ro.set(1,S.fmt(ssw,2)); ro.set(2,S.fmt(Fv,2)); ro.set(3,df1+" ; "+df2); ro.set(4,ST.pval(p));
      nt.set(p<0.05?"p &lt; 0,05 : au moins un groupe diffère des autres. Un test post hoc (Tukey, Bonferroni) dira lesquels.":"Pas de différence détectable entre les moyennes. Les traits gris (écarts à la moyenne du groupe) sont aussi grands que les écarts entre groupes.",p<0.05?"ok":"warn");
    });
  }
});

SFA.sim({
  id:"us-c08-tests-rangs-mann-whitney", ch:"c08", tag:"Original · robustesse",
  titre:"Valeur extrême : test t contre test de rangs",
  resume:"Une seule valeur aberrante fait perdre la significativité au test t ; le test de Mann-Whitney, fondé sur les rangs, ne bouge pas.",
  but:"Deux groupes de 8 patients (temps de récupération en minutes). Glisse vers le haut la dernière valeur du groupe B (point orange du haut) : compare la p-valeur du test t (Welch) à celle du test exact de Mann-Whitney, et regarde la file des rangs.",
  aRetenir:"Le test de Mann-Whitney (ou Wilcoxon pour échantillons indépendants) compare les rangs : il ne dépend pas de la taille d'une valeur extrême tant que son rang ne change pas. Il convient aux petits effectifs, aux distributions asymétriques et aux variables ordinales.",
  piege:"Le test de rangs n'est pas « sans hypothèse » : il suppose des distributions de même forme pour interpréter la différence comme un décalage. Si les données sont normales, il est un peu moins puissant que le test t.",
  build:function(k,S){
    var c=UI.canvas(k,290,.64,360), c2=UI.canvas(k,110,.24,140);
    var xv=k.slider("Dernière valeur du groupe B",145,400,1,150,"min");
    k.button("Valeur d'origine",function(){ xv.set(150); },true);
    var ro=k.readouts(["p test t (Welch)","Somme des rangs du groupe B","p Mann-Whitney exact","Rang de la valeur extrême"]);
    var nt=k.note("","");
    var A=[118,121,124,126,129,131,134,137], B0=[125,128,132,135,138,141,144];
    var cnt=(function(){ var dp=[]; for(var j=0;j<=8;j++){ dp.push({}); } dp[0][0]=1;
      for(var r=1;r<=16;r++){ for(var j=8;j>=1;j--){ for(var s in dp[j-1]){ var ns=(+s)+r; dp[j][ns]=(dp[j][ns]||0)+dp[j-1][s]; } } }
      return dp[8]; })();
    var tot=0, key; for(key in cnt) tot+=cnt[key];
    var lay={};
    UI.drag(c,function(){ return lay.ax?[{id:"x",x:lay.ax.X(1.5)+lay.jit,y:lay.ax.Y(xv.value),r:20}]:[]; },function(id,q){ xv.set(UI.clamp(Math.round(lay.ax.iy(q.y)),145,400)); k.redraw(); });
    k.draw(function(){
      var B=B0.concat([xv.value]), all=A.concat(B), W=0;
      var sorted=all.slice().sort(function(a,b){ return a-b; });
      B.forEach(function(v){ W+=sorted.indexOf(v)+1; });
      var le=0, ge=0; for(key in cnt){ if(+key<=W) le+=cnt[key]; if(+key>=W) ge+=cnt[key]; }
      var pm=Math.min(1,2*Math.min(le,ge)/tot);
      var v1=Math.pow(ST.sd(A),2), v2=Math.pow(ST.sd(B),2), es=Math.sqrt(v1/8+v2/8), t=(ST.mean(A)-ST.mean(B))/es;
      var df=Math.pow(v1/8+v2/8,2)/((v1*v1+v2*v2)/(64*7)), pt=2*(1-ST.tcdf(Math.abs(t),df));
      c.clear(); c2.clear();
      var ymax=Math.max(170,Math.ceil((xv.value+15)/10)*10);
      var ax=S.draw.axes(c,{x0:0,x1:2,y0:100,y1:ymax,yl:"temps de récupération (min)",stepX:100,l:54,hideZero:true,t:20,b:38}); lay.ax=ax; lay.jit=0;
      var gr=[{name:"Groupe A",v:A,color:P.grey},{name:"Groupe B",v:B,color:P.mat}];
      dots(c,S,ax,gr,{y0:100,y1:ymax});
      S.draw.dot(c,ax.X(1.5),ax.Y(xv.value),8,P.orange); S.draw.label(c,"valeur extrême "+xv.value+" min",ax.X(1.5)-14,ax.Y(xv.value),{color:P.orange,align:"right",size:11});
      UI.hint(c,"glisse ce point",ax.X(1.5)+8,Math.min(ax.B-20,ax.Y(xv.value)+24),P.orange);
      /* file des rangs */
      var Lm=14,Rm=c2.W-14,cw=(Rm-Lm)/16;
      S.draw.text(c2,"rangs de 1 (le plus rapide) à 16 : couleur = groupe",Lm,12,{size:11,align:"left",color:"#3d4b5f"});
      sorted.forEach(function(v,i){ var inB=B.indexOf(v)>=0&&A.indexOf(v)<0, ext=v===xv.value&&inB; c2.ctx.fillStyle=ext?P.orange:inB?S.draw.tint(P.mat,.85):S.draw.tint(P.grey,.5); S.draw.rrect(c2,Lm+i*cw+1,28,cw-2,34,5); c2.ctx.fill();
        S.draw.text(c2,i+1,Lm+i*cw+cw/2,45,{size:cw>26?12:10.5,color:inB||ext?"#fff":P.ink}); });
      S.draw.label(c2,"somme des rangs de B : "+W+" (attendue sous H₀ : 68)",Lm,86,{color:P.mat,align:"left",size:11.5});
      ro.set(0,ST.pval(pt)); ro.set(1,W+" (moy. attendue 68)"); ro.set(2,ST.pval(pm)); ro.set(3,sorted.indexOf(xv.value)+1+" sur 16");
      if(pt>=0.05&&pm<0.05) nt.set("Le test t ne détecte plus la différence ; le test de rangs reste significatif : la valeur extrême gonfle l'écart-type, mais son rang (16) ne change pas.","warn");
      else if(pt<0.05&&pm<0.05) nt.set("Les deux tests concluent à une différence.","ok"); else nt.set("Aucun des deux tests n'est significatif.","");
    });
  }
});

SFA.sim({
  id:"us-c08-taille-d-effet-cohen", ch:"c08", tag:"Lecture d'un essai",
  titre:"La taille d'effet d de Cohen",
  resume:"Une différence standardisée : recouvrement des distributions et probabilité qu'un patient traité fasse mieux qu'un témoin.",
  but:"Glisse la cloche B (ou le curseur) pour faire varier d = (μ₂ − μ₁)/σ : observe le recouvrement des deux populations, puis la p-valeur attendue selon l'effectif par groupe.",
  aRetenir:"d = différence de moyennes/écart-type commun. Repères usuels (arbitraires) : 0,2 petit ; 0,5 moyen ; 0,8 grand. P(un sujet de B dépasse un sujet de A) = Φ(d/√2). Contrairement à p, d ne dépend pas de n.",
  piege:"Un grand d avec n minuscule peut ne pas être significatif ; un petit d avec n énorme l'est. Les repères 0,2/0,5/0,8 ne remplacent pas le jugement clinique.",
  build:function(k,S){
    var c=UI.canvas(k,300,.66,380);
    var d=k.slider("Taille d'effet d",0,2,0.05,0.5,"");
    var n=k.slider("Effectif par groupe",5,500,1,30,"");
    var ro=k.readouts(["Recouvrement","P(B dépasse A)","Part de B au-dessus de la moyenne de A","t attendu","p attendue"]);
    var nt=k.note("","");
    var lay={};
    UI.drag(c,function(){ return lay.ax?[{id:"d",x:lay.ax.X(d.value),y:lay.ax.Y(ST.npdf(0)),r:22}]:[]; },function(id,q){ d.set(UI.clamp(Math.round(lay.ax.ix(q.x)*20)/20,0,2)); k.redraw(); });
    k.draw(function(){
      var dd=d.value, N=n.value;
      c.clear(); var ax=S.draw.axes(c,{x0:-3.5,x1:5.5,y0:0,y1:0.46,xl:"écarts-types σ",stepY:0.1,stepX:1,t:24}); lay.ax=ax;
      var fa=ST.npdf, fb=function(x){ return ST.npdf(x-dd); };
      S.draw.area(c,ax,function(x){ return Math.min(fa(x),fb(x)); },-3.5,5.5,P.red,0.3);
      S.draw.fn(c,ax,fa,P.grey,2.8); S.draw.fn(c,ax,fb,P.mat,2.8);
      S.draw.line(c,ax.X(0),ax.Y(0),ax.X(0),ax.Y(fa(0)),P.grey,1.4,[4,3]); S.draw.line(c,ax.X(dd),ax.Y(0),ax.X(dd),ax.Y(fb(dd)),P.mat,1.4,[4,3]);
      S.draw.dot(c,ax.X(dd),ax.Y(fb(dd)),8,P.mat);
      S.draw.line(c,ax.X(0),ax.Y(0.05),ax.X(dd),ax.Y(0.05),P.ink,1.8); S.draw.label(c,"d = "+S.fmt(dd,2),ax.X(dd/2),ax.Y(0.05)-14,{size:12,color:P.ink});
      S.draw.legend(c,[[P.grey,"groupe A (référence)"],[P.mat,"groupe B"],[S.draw.tint(P.red,.6),"recouvrement"]],ax.R-4,ax.T+2,{align:"right"});
      UI.hint(c,"glisse la cloche B",ax.X(dd),ax.Y(ST.npdf(0))-18,P.mat);
      var ovl=2*ST.ncdf(-dd/2), ps=ST.ncdf(dd/Math.sqrt(2)), te=dd*Math.sqrt(N/2), pe=2*(1-ST.tcdf(te,2*N-2));
      ro.set(0,S.fmt(100*ovl,0)+" %"); ro.set(1,S.fmt(100*ps,0)+" %"); ro.set(2,S.fmt(100*ST.ncdf(dd),0)+" %"); ro.set(3,S.fmt(te,2)); ro.set(4,ST.pval(pe));
      nt.set("d = "+S.fmt(dd,2)+" : "+(dd<0.2?"effet négligeable":dd<0.5?"petit effet":dd<0.8?"effet moyen":"grand effet")+" selon les repères usuels. Avec "+N+" sujets par groupe, la p-valeur attendue est "+ST.pval(pe).replace("&lt;","<")+" : la même taille d'effet est plus ou moins « significative » selon n.",pe<0.05?"ok":"warn");
    });
  }
});
})();
